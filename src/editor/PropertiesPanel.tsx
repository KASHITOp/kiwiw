import { useState } from "react";
import { AlignLeft, AlignCenter, AlignRight, Italic, Underline, Type, Square, Circle } from "lucide-react";
import { useEditor } from "../store";
import { PALETTE, FONTS, makeText, makeShape } from "../data/factory";
import type { TextElement, ShapeElement, ImageElement } from "../types";

export default function PropertiesPanel() {
  const { doc, selectedId, updateElement } = useEditor();
  const el = doc.elements.find((e) => e.id === selectedId);

  if (!el) return <EmptyState />;

  const up = (patch: Partial<typeof el>) => updateElement(el.id, patch);

  return (
    <>
      <h4>{el.type} · properties</h4>

      <div className="row">
        <div className="field"><label>X</label><input type="number" value={Math.round(el.x)} onChange={(e) => up({ x: +e.target.value })} /></div>
        <div className="field"><label>Y</label><input type="number" value={Math.round(el.y)} onChange={(e) => up({ y: +e.target.value })} /></div>
      </div>
      <div className="row">
        <div className="field"><label>W</label><input type="number" value={Math.round(el.w)} onChange={(e) => up({ w: +e.target.value })} /></div>
        <div className="field"><label>H</label><input type="number" value={Math.round(el.h)} onChange={(e) => up({ h: +e.target.value })} /></div>
      </div>
      <div className="row">
        <div className="field"><label>Rotation</label><input type="number" value={Math.round(el.rotation)} onChange={(e) => up({ rotation: +e.target.value })} /></div>
        <div className="field"><label>Opacity</label><input type="number" min={0} max={1} step={0.1} value={el.opacity} onChange={(e) => up({ opacity: +e.target.value })} /></div>
      </div>

      {el.type === "text" && <TextProps el={el} up={up} />}
      {el.type === "shape" && <ShapeProps el={el} up={up} />}
      {el.type === "image" && <ImageProps el={el} up={up} />}
    </>
  );
}

function EmptyState() {
  const { doc, setBackground, addElement } = useEditor();
  return (
    <>
      <h4>Page</h4>
      <div className="es-size">
        <div className="dim">{doc.width} × {doc.height}</div>
        <div className="unit">pixels</div>
      </div>
      <ColorPopover label="Background" value={doc.background} onChange={setBackground} />

      <h4 className="sub-h">Quick add</h4>
      <button className="quick-action" onClick={() => addElement(makeText({ text: "Heading", fontSize: 72, fontWeight: 800 }))}>
        <span className="qi"><Type size={16} /></span> Add a heading
      </button>
      <button className="quick-action" onClick={() => addElement(makeShape("rect"))}>
        <span className="qi"><Square size={16} /></span> Add a rectangle
      </button>
      <button className="quick-action" onClick={() => addElement(makeShape("ellipse"))}>
        <span className="qi"><Circle size={16} /></span> Add a circle
      </button>
    </>
  );
}

export function ColorPopover({ label, value, onChange }: { label?: string; value: string; onChange: (c: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="field" style={{ position: "relative" }}>
      {label && <label>{label}</label>}
      <button type="button" className="color-trigger" onClick={() => setOpen((o) => !o)}>
        <span className="chip" style={{ background: value }} />
        <span className="hex">{value}</span>
      </button>
      {open && (
        <>
          <div style={{ position: "fixed", inset: 0, zIndex: 55 }} onClick={() => setOpen(false)} />
          <div className="popover" style={{ top: "100%", left: 0, right: 0, marginTop: 4 }}>
            <input type="color" value={value} onChange={(e) => onChange(e.target.value)} />
            <div className="hex-row">
              <input type="text" value={value} onChange={(e) => onChange(e.target.value)} />
              <button className="btn sm" onClick={() => setOpen(false)}>Done</button>
            </div>
            <div className="swatches" style={{ marginTop: "var(--s-3)" }}>
              {PALETTE.map((c) => (
                <div key={c} className={"swatch" + (c.toLowerCase() === value.toLowerCase() ? " on" : "")} style={{ background: c }} onClick={() => onChange(c)} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function TextProps({ el, up }: { el: TextElement; up: (p: Partial<TextElement>) => void }) {
  return (
    <>
      <div className="field"><label>Text</label><textarea value={el.text} onChange={(e) => up({ text: e.target.value })} /></div>
      <div className="field">
        <label>Font</label>
        <select value={el.fontFamily} onChange={(e) => up({ fontFamily: e.target.value })}>
          {FONTS.map((f) => <option key={f} value={f}>{f}</option>)}
        </select>
      </div>
      <div className="row">
        <div className="field"><label>Size</label><input type="number" value={el.fontSize} onChange={(e) => up({ fontSize: +e.target.value })} /></div>
        <div className="field">
          <label>Weight</label>
          <select value={el.fontWeight} onChange={(e) => up({ fontWeight: +e.target.value })}>
            {[300, 400, 500, 600, 700, 800].map((w) => <option key={w} value={w}>{w}</option>)}
          </select>
        </div>
      </div>
      <div className="field">
        <label>Alignment</label>
        <div className="row" style={{ gap: "var(--s-2)" }}>
          <div className="seg" style={{ flex: 2 }}>
            <button className={el.align === "left" ? "on" : ""} onClick={() => up({ align: "left" })}><AlignLeft size={15} /></button>
            <button className={el.align === "center" ? "on" : ""} onClick={() => up({ align: "center" })}><AlignCenter size={15} /></button>
            <button className={el.align === "right" ? "on" : ""} onClick={() => up({ align: "right" })}><AlignRight size={15} /></button>
          </div>
          <div className="seg" style={{ flex: 1 }}>
            <button className={el.italic ? "on" : ""} onClick={() => up({ italic: !el.italic })}><Italic size={15} /></button>
            <button className={el.underline ? "on" : ""} onClick={() => up({ underline: !el.underline })}><Underline size={15} /></button>
          </div>
        </div>
      </div>
      <ColorPopover label="Color" value={el.color} onChange={(c) => up({ color: c })} />
    </>
  );
}

function ShapeProps({ el, up }: { el: ShapeElement; up: (p: Partial<ShapeElement>) => void }) {
  return (
    <>
      <ColorPopover label="Fill" value={el.fill} onChange={(c) => up({ fill: c })} />
      {el.shape === "rect" && (
        <div className="field"><label>Corner radius</label><input type="number" value={el.radius} onChange={(e) => up({ radius: +e.target.value })} /></div>
      )}
      <div className="field"><label>Stroke width</label><input type="number" value={el.strokeWidth} onChange={(e) => up({ strokeWidth: +e.target.value })} /></div>
      {el.strokeWidth > 0 && <ColorPopover label="Stroke" value={el.stroke} onChange={(c) => up({ stroke: c })} />}
    </>
  );
}

function ImageProps({ el, up }: { el: ImageElement; up: (p: Partial<ImageElement>) => void }) {
  return (
    <>
      <div className="field">
        <label>Fit</label>
        <div className="seg">
          <button className={el.fit === "cover" ? "on" : ""} onClick={() => up({ fit: "cover" })}>Cover</button>
          <button className={el.fit === "contain" ? "on" : ""} onClick={() => up({ fit: "contain" })}>Contain</button>
        </div>
      </div>
      <div className="field"><label>Corner radius</label><input type="number" value={el.radius} onChange={(e) => up({ radius: +e.target.value })} /></div>
    </>
  );
}
