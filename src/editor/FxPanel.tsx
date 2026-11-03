// Effects gallery for the right panel (DESIGN.md §16). Every tile is a live
// render of the selected element with that effect applied.
import { useMemo } from "react";
import { useEditor } from "../store";
import type { Element, KiwiwDoc, StickerElement } from "../types";
import { FX_GROUPS, FX_PRESETS, BACKGROUNDS, type FxPreset } from "../effects/presets";
import { STICKER_MAP } from "../stickers/library";
import { makeSticker } from "../data/presets";
import Thumb from "./Thumb";
import { ColorPopover } from "./PropertiesPanel";

/** One element on the page colour, cropped to at most 1.6:1 so tiles read. */
function preview(el: Element, bg: string): KiwiwDoc {
  const w = Math.max(1, el.w), h = Math.max(1, el.h);
  const W = Math.min(w, h * 1.6), H = Math.min(h, w * 1.6);
  const x = el.type === "text" && el.align === "left" ? 0 : el.type === "text" && el.align === "right" ? W - w : (W - w) / 2;
  const pad = Math.max(W, H) * 0.1;
  return { width: W + pad * 2, height: H + pad * 2, background: bg, elements: [{ ...el, x: x + pad, y: (H - h) / 2 + pad, rotation: 0, opacity: 1, hidden: false }] };
}

export default function FxPanel({ el }: { el: Element }) {
  const bg = useEditor((s) => s.doc.background);
  const updateElement = useEditor((s) => s.updateElement);
  const presets = useMemo(() => FX_PRESETS.filter((p) => p.applies(el)), [el]);
  const toggle = (p: FxPreset) => updateElement(el.id, p.on(el) ? p.off(el) : p.apply(el));
  const up = (patch: Partial<Element>) => updateElement(el.id, patch);

  return (
    <div className="fxp">
      <h4 className="sub-h">Effects <span className="fxp-hint">click to toggle</span></h4>
      {FX_GROUPS.map((g) => {
        const list = presets.filter((p) => p.group === g);
        if (!list.length) return null;
        return (
          <div key={g} className="fxp-group">
            <div className="fxp-label">{g}</div>
            <div className="fxp-grid">
              {list.map((p) => {
                const on = p.on(el);
                const pv = { ...el, ...(on ? {} : p.apply(el)) } as Element;
                return (
                  <button key={p.id} className={"fxp-tile" + (on ? " on" : "")} onClick={() => toggle(p)} title={on ? `Remove ${p.label}` : `Apply ${p.label}`} aria-pressed={on}>
                    <span className="fxp-art"><Thumb doc={preview(pv, bg)} /></span>
                    <span className="fxp-name">{p.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
      {el.type === "sticker" && el.kind.startsWith("bg-") && <BackgroundSwap el={el} />}
      <FxControls el={el} up={up} />
    </div>
  );
}

function Range({ label, min, max, step = 1, value, onChange, fmt }: { label: string; min: number; max: number; step?: number; value: number; onChange: (v: number) => void; fmt?: (v: number) => string }) {
  return (
    <div className="field fxp-range">
      <label>{label} <b>{fmt ? fmt(value) : value}</b></label>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(+e.target.value)} />
    </div>
  );
}

function FxControls({ el, up }: { el: Element; up: (p: Partial<Element>) => void }) {
  const fx = el.type === "image" ? el.fx ?? {} : {};
  const setFx = (patch: object) => up({ fx: { ...fx, ...patch } } as Partial<Element>);
  const rows: React.ReactNode[] = [];
  if (el.type === "image" && fx.halftone) {
    rows.push(<Range key="dot" label="Halftone dot" min={4} max={40} value={fx.halftone.dot} onChange={(v) => setFx({ halftone: { ...fx.halftone, dot: v } })} />);
    if (!fx.duotone) rows.push(
      <div key="hti" className="row">
        <ColorPopover label="Ink" value={fx.halftone.ink ?? "#111111"} onChange={(c) => setFx({ halftone: { ...fx.halftone, ink: c } })} />
        <ColorPopover label="Paper" value={fx.halftone.paper ?? "transparent"} onChange={(c) => setFx({ halftone: { ...fx.halftone, paper: c } })} />
      </div>,
    );
  }
  if (el.type === "image" && fx.duotone) rows.push(
    <div key="duo" className="row">
      <ColorPopover label="Shadows" value={fx.duotone.dark} onChange={(c) => setFx({ duotone: { ...fx.duotone!, dark: c } })} />
      <ColorPopover label="Lights" value={fx.duotone.light} onChange={(c) => setFx({ duotone: { ...fx.duotone!, light: c } })} />
    </div>,
  );
  if (el.type === "image" && fx.riso) rows.push(
    <div key="riso" className="row">
      {fx.riso.inks.slice(0, 2).map((ink, i) => (
        <ColorPopover key={i} label={i ? "Ink 2" : "Ink 1"} value={ink} onChange={(c) => setFx({ riso: { ...fx.riso!, inks: fx.riso!.inks.map((x, j) => (j === i ? c : x)) } })} />
      ))}
    </div>,
    <Range key="mis" label="Misregistration" min={0} max={4} step={0.5} value={fx.riso.misreg ?? 1.5} onChange={(v) => setFx({ riso: { ...fx.riso!, misreg: v } })} fmt={(v) => `${v}px`} />,
  );
  if (el.type === "text" && el.wave) rows.push(<Range key="wave" label="Wave" min={-100} max={100} value={el.wave} onChange={(v) => up({ wave: v } as Partial<Element>)} />);
  if (el.type === "text" && el.glossy) rows.push(
    <div key="gl" className="row">
      <ColorPopover label="Top" value={el.glossy.from} onChange={(c) => up({ glossy: { ...el.glossy!, from: c } } as Partial<Element>)} />
      <ColorPopover label="Bottom" value={el.glossy.to} onChange={(c) => up({ glossy: { ...el.glossy!, to: c } } as Partial<Element>)} />
    </div>,
  );
  if (el.frame) {
    rows.push(
      <div key="fr" className="row">
        <ColorPopover label="Frame" value={el.frame.color ?? defaultFrameColor(el.frame.kind)} onChange={(c) => up({ frame: { ...el.frame!, color: c } })} />
        {(el.frame.kind === "window" || el.frame.kind === "evileye" || el.frame.kind === "polaroid") && (
          <ColorPopover label={el.frame.kind === "window" ? "Body" : el.frame.kind === "polaroid" ? "Caption" : "Iris"} value={el.frame.accent ?? (el.frame.kind === "window" ? "#FFF1DE" : el.frame.kind === "polaroid" ? "#111111" : "#7FB7FF")} onChange={(c) => up({ frame: { ...el.frame!, accent: c } })} />
        )}
      </div>,
    );
    if (el.frame.kind === "window" || el.frame.kind === "polaroid")
      rows.push(
        <div key="ft" className="field">
          <label>{el.frame.kind === "window" ? "Window title" : "Caption"}</label>
          <input type="text" value={el.frame.title ?? ""} onChange={(e) => up({ frame: { ...el.frame!, title: e.target.value } })} />
        </div>,
      );
  }
  if (el.cutout) rows.push(
    <div key="cut" className="row">
      <Range label="Cutout width" min={2} max={40} value={el.cutout.width} onChange={(v) => up({ cutout: { ...el.cutout!, width: v } })} />
      <ColorPopover label="Colour" value={el.cutout.color} onChange={(c) => up({ cutout: { ...el.cutout!, color: c } })} />
    </div>,
  );
  if ((el.grain ?? 0) > 0) rows.push(<Range key="gr" label="Grain" min={0.1} max={1} step={0.05} value={el.grain!} onChange={(v) => up({ grain: v })} fmt={(v) => `${Math.round(v * 100)}%`} />);
  if (!rows.length) return null;
  return <div className="fxp-controls">{rows}</div>;
}

const defaultFrameColor = (k: string) => ({ stamp: "#FFFDF6", torn: "#F4EBDD", polaroid: "#FFFDF7", window: "#FF4FA3", truck: "#D62828", evileye: "#1D3FD8" })[k] ?? "#FFFFFF";

function BackgroundSwap({ el }: { el: StickerElement }) {
  const updateElement = useEditor((s) => s.updateElement);
  return (
    <div className="fxp-group">
      <div className="fxp-label">Swap background</div>
      <div className="fxp-grid">
        {BACKGROUNDS.map((k) => (
          <button key={k} className={"fxp-tile" + (el.kind === k ? " on" : "")} onClick={() => { const d = STICKER_MAP[k]; updateElement(el.id, { kind: k, ...d.colors }); }}>
            <span className="fxp-art"><Thumb doc={{ width: 100, height: 100, background: "#fff", elements: [{ ...makeSticker(k, 100, 100), id: "pv", x: 0, y: 0, w: 100, h: 100 } as Element] }} /></span>
            <span className="fxp-name">{STICKER_MAP[k].name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/** Page-level: drop a full-bleed background behind everything. */
export function PageBackgrounds() {
  const { doc, addElement } = useEditor();
  const add = (k: string) => {
    addElement({ ...makeSticker(k, doc.width, doc.height), x: 0, y: 0, w: doc.width, h: doc.height });
    const id = useEditor.getState().selectedId;
    if (id) useEditor.getState().reorder(id, "back");
  };
  return (
    <div className="fxp">
      <h4 className="sub-h">Page backgrounds</h4>
      <div className="fxp-grid">
        {BACKGROUNDS.map((k) => (
          <button key={k} className="fxp-tile" onClick={() => add(k)} title={`Use ${STICKER_MAP[k].name} as the page background`}>
            <span className="fxp-art"><Thumb doc={{ width: 100, height: 100, background: "#fff", elements: [{ ...makeSticker(k, 100, 100), id: "pv", x: 0, y: 0, w: 100, h: 100 } as Element] }} /></span>
            <span className="fxp-name">{STICKER_MAP[k].name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
