import { useEditor } from "../store";
import type { Element } from "../types";

const icon = (el: Element) => (el.type === "text" ? "🆃" : el.type === "image" ? "🖼" : "◆");
const label = (el: Element) =>
  el.name || (el.type === "text" ? el.text.slice(0, 18) || "Text" : el.type === "image" ? "Image" : `${el.shape}`);

export default function LayersPanel() {
  const { doc, selectedId, select, updateElement, removeElement, reorder } = useEditor();
  // show top-most first
  const layers = [...doc.elements].reverse();

  return (
    <div>
      <h4>Layers</h4>
      {layers.length === 0 && <div className="empty">No layers yet. Add something from the left.</div>}
      {layers.map((el) => (
        <div
          key={el.id}
          className={"layer-item" + (el.id === selectedId ? " active" : "")}
          onClick={() => select(el.id)}
        >
          <span className="mini">{icon(el)}</span>
          <span className="t">{label(el)}</span>
          <button
            className="btn sm ghost"
            title={el.hidden ? "Show" : "Hide"}
            onClick={(e) => { e.stopPropagation(); updateElement(el.id, { hidden: !el.hidden }); }}
          >{el.hidden ? "🚫" : "👁"}</button>
          <button
            className="btn sm ghost"
            title={el.locked ? "Unlock" : "Lock"}
            onClick={(e) => { e.stopPropagation(); updateElement(el.id, { locked: !el.locked }); }}
          >{el.locked ? "🔒" : "🔓"}</button>
          <button className="btn sm ghost" title="Up" onClick={(e) => { e.stopPropagation(); reorder(el.id, "forward"); }}>↑</button>
          <button className="btn sm ghost" title="Down" onClick={(e) => { e.stopPropagation(); reorder(el.id, "backward"); }}>↓</button>
          <button className="btn sm ghost" title="Delete" onClick={(e) => { e.stopPropagation(); removeElement(el.id); }}>🗑</button>
        </div>
      ))}
    </div>
  );
}
