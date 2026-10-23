import { useEffect, useRef } from "react";
import { useEditor } from "../store";
import type { Element } from "../types";

type Handle = "nw" | "n" | "ne" | "e" | "se" | "s" | "sw" | "w";
const HANDLES: Handle[] = ["nw", "n", "ne", "e", "se", "s", "sw", "w"];

interface Drag {
  mode: "move" | "resize" | "rotate";
  handle?: Handle;
  startX: number;
  startY: number;
  orig: Element;
  cx?: number;
  cy?: number;
  startAngle?: number;
}

export default function Canvas() {
  const { doc, zoom, selectedId, select, updateElement, commit } = useEditor();
  const canvasRef = useRef<HTMLDivElement>(null);
  const drag = useRef<Drag | null>(null);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const d = drag.current;
      if (!d) return;
      const dx = (e.clientX - d.startX) / zoom;
      const dy = (e.clientY - d.startY) / zoom;

      if (d.mode === "move") {
        updateElement(d.orig.id, { x: d.orig.x + dx, y: d.orig.y + dy }, false);
      } else if (d.mode === "resize") {
        const p = resize(d.orig, d.handle!, dx, dy);
        updateElement(d.orig.id, p, false);
      } else if (d.mode === "rotate") {
        const ang = Math.atan2(e.clientY - d.cy!, e.clientX - d.cx!) * (180 / Math.PI) + 90;
        updateElement(d.orig.id, { rotation: Math.round(ang) }, false);
      }
    };
    const onUp = () => (drag.current = null);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [zoom, updateElement]);

  const startMove = (e: React.PointerEvent, el: Element) => {
    if (el.locked) return;
    e.stopPropagation();
    select(el.id);
    commit();
    drag.current = { mode: "move", startX: e.clientX, startY: e.clientY, orig: { ...el } };
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

  const hs = 11 / zoom; // handle size in canvas units (keeps visual size stable)
  const hb = 2 / zoom;

  return (
    <div className="stage" onPointerDown={() => select(null)}>
      <div style={{ width: doc.width * zoom, height: doc.height * zoom, margin: 40, flex: "none" }}>
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
              className={"el" + (el.id === selectedId ? " selected" : "")}
              onPointerDown={(e) => startMove(e, el)}
              style={{
                left: el.x,
                top: el.y,
                width: el.w,
                height: el.h,
                opacity: el.opacity,
                transform: `rotate(${el.rotation}deg)`,
                outlineWidth: el.id === selectedId ? 2 / zoom : 0,
                cursor: el.locked ? "default" : "move",
              }}
            >
              <ElementContent el={el} />
            </div>
          )
        )}

        {/* selection handles overlay (drawn after so they sit on top) */}
        {selectedId &&
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
    </div>
  );
}

function ElementContent({ el }: { el: Element }) {
  if (el.type === "text") {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          fontSize: el.fontSize,
          fontFamily: el.fontFamily,
          color: el.color,
          fontWeight: el.fontWeight,
          fontStyle: el.italic ? "italic" : "normal",
          textDecoration: el.underline ? "underline" : "none",
          textAlign: el.align,
          lineHeight: el.lineHeight,
          letterSpacing: el.letterSpacing,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {el.text}
      </div>
    );
  }
  if (el.type === "image") {
    return (
      <img
        src={el.src}
        draggable={false}
        style={{ width: "100%", height: "100%", objectFit: el.fit, borderRadius: el.radius, display: "block" }}
      />
    );
  }
  // shape
  const common: React.CSSProperties = {
    width: "100%",
    height: "100%",
    background: el.fill,
    border: el.strokeWidth ? `${el.strokeWidth}px solid ${el.stroke}` : "none",
  };
  if (el.shape === "ellipse") return <div style={{ ...common, borderRadius: "50%" }} />;
  if (el.shape === "line")
    return <div style={{ width: "100%", height: el.strokeWidth || 6, background: el.fill, marginTop: "auto", marginBottom: "auto" }} />;
  if (el.shape === "triangle")
    return <div style={{ ...common, clipPath: "polygon(50% 0, 100% 100%, 0 100%)" }} />;
  return <div style={{ ...common, borderRadius: el.radius }} />;
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
