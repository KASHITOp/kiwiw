import PageStrip from "../carousel/PageStrip";
import { useEffect, useRef, useState } from "react";
import { useEditor } from "../store";
import type { Element } from "../types";
import ElementContent from "./ElementContent";
import FloatingToolbar from "./FloatingToolbar";
import { snap, unionBox, type Box, type Guide } from "./snap";
import { Minus, Plus, Maximize2 } from "lucide-react";
import { fitZoom } from "./zoom";
import { useStickerDrop } from "./panels";

type Handle = "nw" | "n" | "ne" | "e" | "se" | "s" | "sw" | "w";
const HANDLES: Handle[] = ["nw", "n", "ne", "e", "se", "s", "sw", "w"];
const SNAP_PX = 6; // DESIGN.md §14, in screen pixels

/** Page-sized textures sit on top of everything; clicks pass through them (pick them from Layers). */
const isVeil = (el: Element, w: number, h: number) =>
  el.type === "sticker" && /texture|grain|halftone/.test(el.kind) && el.w * el.h >= w * h * 0.8;

interface Drag {
  mode: "move" | "resize" | "rotate" | "marquee";
  handle?: Handle;
  startX: number;
  startY: number;
  orig?: Element;
  /** move: every selected element's start position */
  origs?: Record<string, { x: number; y: number }>;
  box?: Box;
  cx?: number;
  cy?: number;
  /** marquee start in canvas units */
  mx?: number;
  my?: number;
  additive?: boolean;
}

export default function Canvas() {
  const { doc, zoom, setZoom, selectedId, selectedIds, select, selectMany, updateElement, updateMany, commit } = useEditor();
  const canvasRef = useRef<HTMLDivElement>(null);
  const drag = useRef<Drag | null>(null);
  const [guides, setGuides] = useState<Guide[]>([]);
  const [marquee, setMarquee] = useState<Box | null>(null);

  useEffect(() => {
    const toCanvas = (clientX: number, clientY: number) => {
      const r = canvasRef.current!.getBoundingClientRect();
      return { x: (clientX - r.left) / zoom, y: (clientY - r.top) / zoom };
    };
    const onMove = (e: PointerEvent) => {
      const d = drag.current;
      if (!d) return;
      const dx = (e.clientX - d.startX) / zoom;
      const dy = (e.clientY - d.startY) / zoom;

      if (d.mode === "move") {
        let sx = 0, sy = 0;
        const cur = useEditor.getState().doc;
        if (!e.altKey) {
          const moving = new Set(Object.keys(d.origs!));
          const others = cur.elements.filter((o) => !moving.has(o.id) && !o.hidden);
          const box = { ...d.box!, x: d.box!.x + dx, y: d.box!.y + dy };
          const r = snap(box, others, { x: 0, y: 0, w: cur.width, h: cur.height }, SNAP_PX / zoom);
          sx = r.dx; sy = r.dy;
          setGuides(r.guides);
        } else setGuides([]);
        const patches: Record<string, Partial<Element>> = {};
        for (const [id, o] of Object.entries(d.origs!)) patches[id] = { x: o.x + dx + sx, y: o.y + dy + sy };
        updateMany(patches, false);
      } else if (d.mode === "resize") {
        updateElement(d.orig!.id, resize(d.orig!, d.handle!, dx, dy), false);
      } else if (d.mode === "rotate") {
        let ang = Math.atan2(e.clientY - d.cy!, e.clientX - d.cx!) * (180 / Math.PI) + 90;
        if (e.shiftKey) ang = Math.round(ang / 15) * 15;
        updateElement(d.orig!.id, { rotation: Math.round(ang) }, false);
      } else if (d.mode === "marquee") {
        const p = toCanvas(e.clientX, e.clientY);
        setMarquee({ x: Math.min(p.x, d.mx!), y: Math.min(p.y, d.my!), w: Math.abs(p.x - d.mx!), h: Math.abs(p.y - d.my!) });
      }
    };
    const onUp = (e: PointerEvent) => {
      const d = drag.current;
      drag.current = null;
      setGuides([]);
      if (d?.mode !== "marquee") return;
      const p = toCanvas(e.clientX, e.clientY);
      const m = { x: Math.min(p.x, d.mx!), y: Math.min(p.y, d.my!), w: Math.abs(p.x - d.mx!), h: Math.abs(p.y - d.my!) };
      setMarquee(null);
      if (m.w * zoom < 4 && m.h * zoom < 4) { if (!d.additive) select(null); return; }
      const { doc: cur, selectedIds: prev } = useEditor.getState();
      const hit = new Set(cur.elements.filter((el) => !el.hidden && !el.locked && !isVeil(el, cur.width, cur.height) && el.x < m.x + m.w && el.x + el.w > m.x && el.y < m.y + m.h && el.y + el.h > m.y).map((el) => el.id));
      // touching one group member takes the whole group
      const groups = new Set(cur.elements.filter((el) => hit.has(el.id) && el.groupId).map((el) => el.groupId));
      const ids = cur.elements.filter((el) => hit.has(el.id) || (el.groupId && groups.has(el.groupId))).map((el) => el.id);
      selectMany(d.additive ? [...new Set([...prev, ...ids])] : ids);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [zoom, updateElement, updateMany, select, selectMany]);

  const startMove = (e: React.PointerEvent, el: Element) => {
    if (el.locked) return;
    e.stopPropagation();
    if (e.shiftKey) { select(el.id, true); return; }
    // grabbing a member of the current selection drags the whole selection
    if (!useEditor.getState().selectedIds.includes(el.id)) select(el.id);
    const { doc: cur, selectedIds: ids } = useEditor.getState();
    const moving = cur.elements.filter((x) => ids.includes(x.id) && !x.locked);
    commit();
    drag.current = {
      mode: "move", startX: e.clientX, startY: e.clientY,
      origs: Object.fromEntries(moving.map((x) => [x.id, { x: x.x, y: x.y }])),
      box: unionBox(moving),
    };
  };

  const startMarquee = (e: React.PointerEvent) => {
    if (e.button !== 0 || !canvasRef.current) return;
    const r = canvasRef.current.getBoundingClientRect();
    drag.current = { mode: "marquee", startX: e.clientX, startY: e.clientY, mx: (e.clientX - r.left) / zoom, my: (e.clientY - r.top) / zoom, additive: e.shiftKey };
  };

  const startResize = (e: React.PointerEvent, el: Element, handle: Handle) => {
    e.stopPropagation();
    commit();
    drag.current = { mode: "resize", handle, startX: e.clientX, startY: e.clientY, orig: { ...el } };
  };

  const startRotate = (e: React.PointerEvent, el: Element) => {
    e.stopPropagation();
    commit();
    const rect = canvasRef.current!.getBoundingClientRect();
    const cx = rect.left + (el.x + el.w / 2) * zoom;
    const cy = rect.top + (el.y + el.h / 2) * zoom;
    drag.current = { mode: "rotate", startX: e.clientX, startY: e.clientY, orig: { ...el }, cx, cy };
  };

  const drop = useStickerDrop((cx, cy) => {
    const r = canvasRef.current?.getBoundingClientRect();
    return r ? { x: (cx - r.left) / zoom, y: (cy - r.top) / zoom } : null;
  });
  const sel = new Set(selectedIds);
  const multi = selectedIds.length > 1 ? unionBox(doc.elements.filter((e) => sel.has(e.id) && !e.hidden)) : null;

  const hs = 11 / zoom; // handle size in canvas units (keeps visual size stable)
  const hb = 2 / zoom;

  return (
    <div className="stage" onPointerDown={startMarquee} onDragOver={drop.onDragOver} onDrop={drop.onDrop}>
      <div className="sheet" style={{ width: doc.width * zoom, height: doc.height * zoom }}>
      <FloatingToolbar />
      {!doc.elements.length && (
        <div className="canvas-empty" aria-hidden="true">
          <b>A blank page is just a poster with stage fright.</b>
          <span>Pick a template, or Juice It one boring line.</span>
        </div>
      )}
      <div
        ref={canvasRef}
        className="canvas"
        style={{
          width: doc.width,
          height: doc.height,
          background: doc.background,
          transform: `scale(${zoom})`,
          transformOrigin: "top left",
        }}
        id="kiwiw-canvas"
      >
        {doc.elements.map((el) =>
          el.hidden ? null : (
            <div
              key={el.id}
              className={"el" + (sel.has(el.id) ? " selected" : "")}
              onPointerDown={(e) => startMove(e, el)}
              style={{
                left: el.x,
                top: el.y,
                width: el.w,
                height: el.h,
                opacity: el.opacity,
                transform: `rotate(${el.rotation}deg)`,
                outlineWidth: sel.has(el.id) ? (multi ? 1.5 : 2) / zoom : 0,
                cursor: el.locked ? "default" : "move",
                pointerEvents: isVeil(el, doc.width, doc.height) ? "none" : undefined,
              }}
            >
              <ElementContent el={el} />
            </div>
          )
        )}

        {/* selection handles overlay (drawn after so they sit on top) */}
        {multi && (
          <div className="multi-box" style={{ left: multi.x, top: multi.y, width: multi.w, height: multi.h, borderWidth: 1.5 / zoom }} />
        )}
        {marquee && <div className="marquee" style={{ left: marquee.x, top: marquee.y, width: marquee.w, height: marquee.h, borderWidth: 1 / zoom }} />}
        {guides.length > 0 && (
          <svg className="guides" width={doc.width} height={doc.height} viewBox={`0 0 ${doc.width} ${doc.height}`}>
            {guides.map((g, i) => (
              <g key={i} stroke={g.kind === "edge" ? "#FF3D9A" : "#D8F27A"} strokeWidth={(g.kind === "edge" ? 1 : 1.5) / zoom}>
                <line x1={g.x1} y1={g.y1} x2={g.x2} y2={g.y2} />
                {g.kind === "space" && (g.x1 === g.x2
                  ? <><line x1={g.x1 - 5 / zoom} y1={g.y1} x2={g.x1 + 5 / zoom} y2={g.y1} /><line x1={g.x2 - 5 / zoom} y1={g.y2} x2={g.x2 + 5 / zoom} y2={g.y2} /></>
                  : <><line x1={g.x1} y1={g.y1 - 5 / zoom} x2={g.x1} y2={g.y1 + 5 / zoom} /><line x1={g.x2} y1={g.y2 - 5 / zoom} x2={g.x2} y2={g.y2 + 5 / zoom} /></>)}
              </g>
            ))}
          </svg>
        )}
        {selectedId && selectedIds.length === 1 &&
          (() => {
            const el = doc.elements.find((x) => x.id === selectedId);
            if (!el || el.hidden || el.locked) return null;
            return (
              <div
                style={{
                  position: "absolute",
                  left: el.x,
                  top: el.y,
                  width: el.w,
                  height: el.h,
                  transform: `rotate(${el.rotation}deg)`,
                  pointerEvents: "none",
                }}
              >
                {HANDLES.map((h) => {
                  const pos = handlePos(h, el.w, el.h);
                  return (
                    <div
                      key={h}
                      className="handle"
                      onPointerDown={(e) => startResize(e, el, h)}
                      style={{
                        left: pos.x - hs / 2,
                        top: pos.y - hs / 2,
                        width: hs,
                        height: hs,
                        borderWidth: hb,
                        pointerEvents: "auto",
                        cursor: cursorFor(h),
                      }}
                    />
                  );
                })}
                <div
                  className="handle rot"
                  onPointerDown={(e) => startRotate(e, el)}
                  style={{
                    left: el.w / 2 - hs / 2,
                    top: -28 / zoom,
                    width: hs,
                    height: hs,
                    borderWidth: hb,
                    pointerEvents: "auto",
                  }}
                />
              </div>
            );
          })()}
      </div>
      </div>
      <PageStrip />
      {/* zoom pill (DESIGN.md §15): bottom-centre, clear of the mascot */}
      <div className="zoom-pill" onPointerDown={(e) => e.stopPropagation()}>
        <button onClick={() => setZoom(zoom / 1.2)} title="Zoom out" aria-label="Zoom out"><Minus size={15} /></button>
        <button className="zp-pct" onClick={() => setZoom(1)} title="Reset to 100%">{Math.round(zoom * 100)}%</button>
        <button onClick={() => setZoom(zoom * 1.2)} title="Zoom in" aria-label="Zoom in"><Plus size={15} /></button>
        <span className="zp-sep" />
        <button onClick={() => setZoom(fitZoom(doc.width, doc.height))} title="Fit to screen. Find your page again." aria-label="Fit to screen"><Maximize2 size={14} /></button>
        <span className="zp-sep" />
        <span className="zp-size">{doc.width} × {doc.height}</span>
      </div>
    </div>
  );
}

function handlePos(h: Handle, w: number, hgt: number) {
  const map: Record<Handle, { x: number; y: number }> = {
    nw: { x: 0, y: 0 }, n: { x: w / 2, y: 0 }, ne: { x: w, y: 0 },
    e: { x: w, y: hgt / 2 }, se: { x: w, y: hgt }, s: { x: w / 2, y: hgt },
    sw: { x: 0, y: hgt }, w: { x: 0, y: hgt / 2 },
  };
  return map[h];
}

function cursorFor(h: Handle) {
  return { nw: "nwse-resize", se: "nwse-resize", ne: "nesw-resize", sw: "nesw-resize", n: "ns-resize", s: "ns-resize", e: "ew-resize", w: "ew-resize" }[h];
}

function resize(o: Element, h: Handle, dx: number, dy: number): Partial<Element> {
  let { x, y, w, h: ht } = o;
  const min = 16;
  if (h.includes("e")) w = Math.max(min, o.w + dx);
  if (h.includes("s")) ht = Math.max(min, o.h + dy);
  if (h.includes("w")) { w = Math.max(min, o.w - dx); x = o.x + (o.w - w); }
  if (h.includes("n")) { ht = Math.max(min, o.h - dy); y = o.y + (o.h - ht); }
  return { x, y, w, h: ht };
}
