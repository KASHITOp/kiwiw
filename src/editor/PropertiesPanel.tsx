import { useState } from "react";
import { AlignLeft, AlignCenter, AlignRight, Italic, Underline, Type, Square, Circle, FlipHorizontal2 } from "lucide-react";
import { useEditor } from "../store";
import { PALETTE, makeText, makeShape } from "../data/factory";
import { fontDef, nearestWeight } from "../fonts/kit";
import { STICKER_MAP, type ColorSlot } from "../stickers/library";
import type { TextElement, ShapeElement, ImageElement, StickerElement } from "../types";
import FontPicker from "./FontPicker";

export default function PropertiesPanel() {
  const { doc, selectedId, updateElement } = useEditor();
  const el = doc.elements.find((e) => e.id === selectedId);

  if (!el) return <EmptyState />;

  const up = (patch: Partial<typeof el>) => updateElement(el.id, patch);
  const title = el.type === "sticker" ? STICKER_MAP[el.kind]?.name ?? "sticker" : el.type;

  return (
    <>
      <h4>{title} · properties</h4>

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
      {el.type === "sticker" && <StickerProps el={el} up={up} />}
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
        <div className="unit">pixels of pure potential</div>
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

/** A labelled on/off row for an effect, with its controls shown when on. */
function FxRow({ label, on, onToggle, children }: { label: string; on: boolean; onToggle: () => void; children?: React.ReactNode }) {
  return (
    <div className={"fx" + (on ? " on" : "")}>
      <button type="button" className="fx-head" onClick={onToggle} aria-pressed={on}>
        <span>{label}</span>
        <span className="fx-switch"><i /></span>
      </button>
      {on && <div className="fx-body">{children}</div>}
    </div>
  );
}

function TextProps({ el, up }: { el: TextElement; up: (p: Partial<TextElement>) => void }) {
  const def = fontDef(el.fontFamily);
  const weights = def?.weights ?? [300, 400, 500, 600, 700, 800];
  const s = el.fontSize / 100; // effect defaults scale with type size
  return (
    <>
      <div className="field"><label>Text</label><textarea value={el.text} onChange={(e) => up({ text: e.target.value })} /></div>
      <div className="field">
        <label>Font</label>
        <FontPicker value={el.fontFamily} onChange={(family) => up({ fontFamily: family, fontWeight: nearestWeight(family, el.fontWeight), italic: el.italic && !!fontDef(family)?.italic })} />
      </div>
      <div className="row">
        <div className="field"><label>Size</label><input type="number" value={Math.round(el.fontSize)} onChange={(e) => up({ fontSize: +e.target.value })} /></div>
        <div className="field">
          <label>Weight</label>
          <select value={nearestWeight(el.fontFamily, el.fontWeight)} onChange={(e) => up({ fontWeight: +e.target.value })} disabled={weights.length < 2}>
            {weights.map((w) => <option key={w} value={w}>{w}</option>)}
          </select>
        </div>
      </div>
      <div className="row">
        <div className="field"><label>Line height</label><input type="number" step={0.05} value={el.lineHeight} onChange={(e) => up({ lineHeight: +e.target.value })} /></div>
        <div className="field"><label>Tracking</label><input type="number" step={0.5} value={Math.round(el.letterSpacing * 10) / 10} onChange={(e) => up({ letterSpacing: +e.target.value })} /></div>
      </div>
      <div className="field">
        <label>Alignment</label>
        <div className="row" style={{ gap: "var(--s-2)" }}>
          <div className="seg" style={{ flex: 2 }}>
            <button className={el.align === "left" ? "on" : ""} onClick={() => up({ align: "left" })} title="Left"><AlignLeft size={15} /></button>
            <button className={el.align === "center" ? "on" : ""} onClick={() => up({ align: "center" })} title="Centre"><AlignCenter size={15} /></button>
            <button className={el.align === "right" ? "on" : ""} onClick={() => up({ align: "right" })} title="Right"><AlignRight size={15} /></button>
          </div>
          <div className="seg" style={{ flex: 1.4 }}>
            <button className={el.italic ? "on" : ""} onClick={() => up({ italic: !el.italic })} title={def && !def.italic ? "This face has no italic; the browser will fake it" : "Italic"}><Italic size={15} /></button>
            <button className={el.underline ? "on" : ""} onClick={() => up({ underline: !el.underline })} title="Underline"><Underline size={15} /></button>
            <button className={el.uppercase ? "on" : ""} onClick={() => up({ uppercase: !el.uppercase })} title="ALL CAPS">AA</button>
          </div>
        </div>
      </div>
      <ColorPopover label="Color" value={el.color} onChange={(c) => up({ color: c })} />

      <h4 className="sub-h">Effects</h4>
      <FxRow label="Outline" on={!!el.outline} onToggle={() => up({ outline: el.outline ? null : { color: "#0B0D08", width: Math.max(2, Math.round(4 * s)) } })}>
        {el.outline && (
          <div className="row">
            <ColorPopover value={el.outline.color} onChange={(c) => up({ outline: { ...el.outline!, color: c } })} />
            <div className="field"><input type="number" min={1} max={40} value={el.outline.width} onChange={(e) => up({ outline: { ...el.outline!, width: +e.target.value } })} title="Outline width" /></div>
          </div>
        )}
      </FxRow>
      <FxRow label="Hard shadow" on={!!el.shadow} onToggle={() => up({ shadow: el.shadow ? null : { color: "#0B0D08", x: Math.max(2, Math.round(6 * s)), y: Math.max(2, Math.round(6 * s)) } })}>
        {el.shadow && (
          <div className="row">
            <ColorPopover value={el.shadow.color} onChange={(c) => up({ shadow: { ...el.shadow!, color: c } })} />
            <div className="field"><input type="number" value={el.shadow.x} onChange={(e) => up({ shadow: { ...el.shadow!, x: +e.target.value, y: +e.target.value } })} title="Shadow offset" /></div>
          </div>
        )}
      </FxRow>
      <FxRow label="Highlight" on={!!el.highlight} onToggle={() => up({ highlight: el.highlight ? null : { color: "#D8F27A" } })}>
        {el.highlight && <ColorPopover value={el.highlight.color} onChange={(c) => up({ highlight: { color: c } })} />}
      </FxRow>
      <FxRow label="Curve" on={!!el.curve} onToggle={() => up({ curve: el.curve ? 0 : -50 })}>
        <div className="fx-range">
          <span className="mono-num">{el.curve ?? 0}</span>
          <input type="range" min={-100} max={100} value={el.curve ?? 0} onChange={(e) => up({ curve: +e.target.value })} aria-label="Curve amount" />
        </div>
        <div className="fx-note">Curved text sits on one line. Arch it negative, smile it positive.</div>
      </FxRow>
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

const SLOT_LABEL: Record<ColorSlot, string> = { fill: "Fill", accent: "Accent", ink: "Ink" };

function StickerProps({ el, up }: { el: StickerElement; up: (p: Partial<StickerElement>) => void }) {
  const def = STICKER_MAP[el.kind];
  return (
    <>
      {def?.uses.map((slot) => (
        <ColorPopover key={slot} label={SLOT_LABEL[slot]} value={el[slot]} onChange={(c) => up({ [slot]: c } as Partial<StickerElement>)} />
      ))}
      {def && !def.uses.length && <div className="fx-note">This one's pure texture. Change its opacity instead.</div>}
      <button className={"quick-action" + (el.flipX ? " on" : "")} onClick={() => up({ flipX: !el.flipX })}>
        <span className="qi"><FlipHorizontal2 size={16} /></span> {el.flipX ? "Flipped" : "Flip horizontally"}
      </button>
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
