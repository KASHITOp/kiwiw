import { useEditor } from "../store";
import { FONTS } from "../data/factory";
import { AlignLeft, AlignCenter, AlignRight, ArrowUp, ArrowDown, Copy, Trash2 } from "lucide-react";

const ICON = 16;

export default function FloatingToolbar() {
  const { doc, selectedId, zoom, updateElement, removeElement, duplicateElement, reorder } = useEditor();
  const el = doc.elements.find((e) => e.id === selectedId);
  if (!el || el.hidden || el.locked) return null;

  // position above the element (in unscaled wrapper pixels)
  const cx = (el.x + el.w / 2) * zoom;
  const topAbove = el.y * zoom - 46;
  const placeBelow = topAbove < 4;
  const top = placeBelow ? el.y * zoom + el.h * zoom + 10 : topAbove;

  const up = (patch: Partial<typeof el>) => updateElement(el.id, patch);

  return (
    <div className="float-toolbar" style={{ left: cx, top, transform: "translateX(-50%)" }} onPointerDown={(e) => e.stopPropagation()}>
      {el.type === "text" && (
        <>
          <select value={el.fontFamily} onChange={(e) => up({ fontFamily: e.target.value })} title="Font">
            {FONTS.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
          <input type="number" value={Math.round(el.fontSize)} onChange={(e) => up({ fontSize: +e.target.value })} title="Font size" />
          <ColorChip value={el.color} onChange={(c) => up({ color: c })} />
          <span className="sep" />
          <button className={"icon-btn" + (el.align === "left" ? " on" : "")} title="Align left" onClick={() => up({ align: "left" })}><AlignLeft size={ICON} /></button>
          <button className={"icon-btn" + (el.align === "center" ? " on" : "")} title="Align center" onClick={() => up({ align: "center" })}><AlignCenter size={ICON} /></button>
          <button className={"icon-btn" + (el.align === "right" ? " on" : "")} title="Align right" onClick={() => up({ align: "right" })}><AlignRight size={ICON} /></button>
          <span className="sep" />
        </>
      )}
      {el.type === "shape" && (
        <>
          <ColorChip value={el.fill} onChange={(c) => up({ fill: c })} />
          <span className="sep" />
        </>
      )}

      <button className="icon-btn" title="Bring forward" onClick={() => reorder(el.id, "forward")}><ArrowUp size={ICON} /></button>
      <button className="icon-btn" title="Send backward" onClick={() => reorder(el.id, "backward")}><ArrowDown size={ICON} /></button>
      <button className="icon-btn" title="Duplicate" onClick={() => duplicateElement(el.id)}><Copy size={ICON} /></button>
      <button className="icon-btn" title="Delete" onClick={() => removeElement(el.id)}><Trash2 size={ICON} /></button>
    </div>
  );
}

function ColorChip({ value, onChange }: { value: string; onChange: (c: string) => void }) {
  return (
    <label className="mini-chip" style={{ background: value, position: "relative", cursor: "pointer", display: "inline-block" }} title="Color">
      <input type="color" value={value} onChange={(e) => onChange(e.target.value)} style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer", width: "100%", height: "100%" }} />
    </label>
  );
}
