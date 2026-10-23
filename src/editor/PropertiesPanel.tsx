import { useEditor } from "../store";
import { PALETTE, FONTS } from "../data/factory";
import type { TextElement, ShapeElement, ImageElement } from "../types";

export default function PropertiesPanel() {
  const { doc, selectedId, updateElement, setBackground } = useEditor();
  const el = doc.elements.find((e) => e.id === selectedId);

  if (!el) {
    return (
      <>
        <h4>Page</h4>
        <div className="field">
          <label>Background</label>
          <input type="color" value={doc.background} onChange={(e) => setBackground(e.target.value)} />
        </div>
        <div className="swatches">
          {PALETTE.map((c) => (
            <div key={c} className="swatch" style={{ background: c }} onClick={() => setBackground(c)} />
          ))}
        </div>
        <div className="empty">Select an element to edit its properties.</div>
      </>
    );
  }

  const up = (patch: Partial<typeof el>) => updateElement(el.id, patch);

  return (
    <>
      <h4>{el.type} properties</h4>

      <div className="row">
        <div className="field">
          <label>X</label>
          <input type="number" value={Math.round(el.x)} onChange={(e) => up({ x: +e.target.value })} />
        </div>
        <div className="field">
          <label>Y</label>
          <input type="number" value={Math.round(el.y)} onChange={(e) => up({ y: +e.target.value })} />
        </div>
      </div>
      <div className="row">
        <div className="field">
          <label>W</label>
          <input type="number" value={Math.round(el.w)} onChange={(e) => up({ w: +e.target.value })} />
        </div>
        <div className="field">
          <label>H</label>
          <input type="number" value={Math.round(el.h)} onChange={(e) => up({ h: +e.target.value })} />
        </div>
      </div>
      <div className="row">
        <div className="field">
          <label>Rotation</label>
          <input type="number" value={Math.round(el.rotation)} onChange={(e) => up({ rotation: +e.target.value })} />
        </div>
        <div className="field">
          <label>Opacity</label>
          <input type="number" min={0} max={1} step={0.1} value={el.opacity} onChange={(e) => up({ opacity: +e.target.value })} />
        </div>
      </div>

      {el.type === "text" && <TextProps el={el} up={up} />}
      {el.type === "shape" && <ShapeProps el={el} up={up} />}
      {el.type === "image" && <ImageProps el={el} up={up} />}
    </>
  );
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (c: string) => void }) {
  return (
    <div className="field">
      <label>{label}</label>
      <input type="color" value={value} onChange={(e) => onChange(e.target.value)} />
      <div className="swatches" style={{ marginTop: 6 }}>
        {PALETTE.map((c) => (
          <div key={c} className="swatch" style={{ background: c }} onClick={() => onChange(c)} />
        ))}
      </div>
    </div>
  );
}

function TextProps({ el, up }: { el: TextElement; up: (p: Partial<TextElement>) => void }) {
  return (
    <>
      <div className="field">
        <label>Text</label>
        <textarea value={el.text} onChange={(e) => up({ text: e.target.value })} />
      </div>
      <div className="field">
        <label>Font</label>
        <select value={el.fontFamily} onChange={(e) => up({ fontFamily: e.target.value })}>
          {FONTS.map((f) => <option key={f} value={f}>{f}</option>)}
        </select>
      </div>
      <div className="row">
        <div className="field">
          <label>Size</label>
          <input type="number" value={el.fontSize} onChange={(e) => up({ fontSize: +e.target.value })} />
        </div>
        <div className="field">
          <label>Weight</label>
          <select value={el.fontWeight} onChange={(e) => up({ fontWeight: +e.target.value })}>
            {[300, 400, 500, 600, 700, 800].map((w) => <option key={w} value={w}>{w}</option>)}
          </select>
        </div>
      </div>
      <div className="field">
        <label>Align</label>
        <div className="row">
          {(["left", "center", "right"] as const).map((a) => (
            <button key={a} className={"btn sm" + (el.align === a ? " primary" : "")} onClick={() => up({ align: a })}>{a}</button>
          ))}
        </div>
      </div>
      <div className="row">
        <button className={"btn sm" + (el.italic ? " primary" : "")} onClick={() => up({ italic: !el.italic })}><i>I</i></button>
        <button className={"btn sm" + (el.underline ? " primary" : "")} onClick={() => up({ underline: !el.underline })}><u>U</u></button>
      </div>
      <ColorField label="Color" value={el.color} onChange={(c) => up({ color: c })} />
    </>
  );
}

function ShapeProps({ el, up }: { el: ShapeElement; up: (p: Partial<ShapeElement>) => void }) {
  return (
    <>
      <ColorField label="Fill" value={el.fill} onChange={(c) => up({ fill: c })} />
      {el.shape === "rect" && (
        <div className="field">
          <label>Corner radius</label>
          <input type="number" value={el.radius} onChange={(e) => up({ radius: +e.target.value })} />
        </div>
      )}
      <div className="row">
        <div className="field">
          <label>Stroke width</label>
          <input type="number" value={el.strokeWidth} onChange={(e) => up({ strokeWidth: +e.target.value })} />
        </div>
      </div>
      {el.strokeWidth > 0 && <ColorField label="Stroke" value={el.stroke} onChange={(c) => up({ stroke: c })} />}
    </>
  );
}

function ImageProps({ el, up }: { el: ImageElement; up: (p: Partial<ImageElement>) => void }) {
  return (
    <>
      <div className="field">
        <label>Fit</label>
        <div className="row">
          {(["cover", "contain"] as const).map((f) => (
            <button key={f} className={"btn sm" + (el.fit === f ? " primary" : "")} onClick={() => up({ fit: f })}>{f}</button>
          ))}
        </div>
      </div>
      <div className="field">
        <label>Corner radius</label>
        <input type="number" value={el.radius} onChange={(e) => up({ radius: +e.target.value })} />
      </div>
    </>
  );
}
