import { useState } from "react";
import { Type, Square, Image as ImageIcon, Sparkles, Eye, EyeOff, Lock, Unlock, ArrowUp, ArrowDown, Trash2, GripVertical } from "lucide-react";
import { useEditor } from "../store";
import { STICKER_MAP } from "../stickers/library";
import type { Element, KiwiwDoc } from "../types";
import Thumb from "./Thumb";

const typeIcon = (el: Element) =>
  el.type === "text" ? <Type size={14} /> : el.type === "image" ? <ImageIcon size={14} /> : el.type === "sticker" ? <Sparkles size={14} /> : <Square size={14} />;

const defaultName = (el: Element) =>
  el.type === "text" ? (el.text.replace(/\s+/g, " ").trim().slice(0, 22) || "Text")
    : el.type === "image" ? "Image"
    : el.type === "sticker" ? (STICKER_MAP[el.kind]?.name ?? "Sticker")
    : el.shape;

// a 1-element document so the thumbnail shows just this layer's content
const miniDoc = (el: Element): KiwiwDoc => ({
  width: el.w || 100,
  height: el.h || 100,
  background: "transparent",
  elements: [{ ...el, x: 0, y: 0, rotation: 0, opacity: 1, hidden: false }],
});

export default function LayersPanel() {
  const { doc, selectedId, select, updateElement, removeElement, reorder, setLayerOrder } = useEditor();
  const [dragId, setDragId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  const layers = [...doc.elements].reverse(); // front-first

  const onDrop = (targetId: string) => {
    if (!dragId || dragId === targetId) { setDragId(null); setOverId(null); return; }
    const ids = layers.map((l) => l.id);
    const from = ids.indexOf(dragId);
    const to = ids.indexOf(targetId);
    ids.splice(to, 0, ids.splice(from, 1)[0]);
    setLayerOrder(ids);
    setDragId(null);
    setOverId(null);
  };

  return (
    <>
      <h4 className="sub-h">Layers</h4>
      {layers.length === 0 && <div className="empty">No layers yet.<br />Add something from the left.</div>}
      {layers.map((el) => (
        <div
          key={el.id}
          className={"lyr" + (el.id === selectedId ? " active" : "") + (overId === el.id ? " dragover" : "")}
          onClick={() => select(el.id)}
          draggable
          onDragStart={() => setDragId(el.id)}
          onDragOver={(e) => { e.preventDefault(); setOverId(el.id); }}
          onDragLeave={() => setOverId((o) => (o === el.id ? null : o))}
          onDrop={() => onDrop(el.id)}
        >
          <span className="lyr-grip"><GripVertical size={14} /></span>
          <div className="lyr-thumb">
            <Thumb doc={miniDoc(el)} />
          </div>
          <span className="lyr-type">{typeIcon(el)}</span>
          <input
            className="lyr-name"
            value={el.name ?? defaultName(el)}
            onChange={(e) => updateElement(el.id, { name: e.target.value }, false)}
            onClick={(e) => e.stopPropagation()}
          />
          <div className="lyr-actions">
            <button className="icon-btn" title={el.hidden ? "Show" : "Hide"} onClick={(e) => { e.stopPropagation(); updateElement(el.id, { hidden: !el.hidden }); }}>
              {el.hidden ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
            <button className="icon-btn" title={el.locked ? "Unlock" : "Lock"} onClick={(e) => { e.stopPropagation(); updateElement(el.id, { locked: !el.locked }); }}>
              {el.locked ? <Lock size={15} /> : <Unlock size={15} />}
            </button>
            <button className="icon-btn" title="Bring forward" onClick={(e) => { e.stopPropagation(); reorder(el.id, "forward"); }}><ArrowUp size={15} /></button>
            <button className="icon-btn" title="Send backward" onClick={(e) => { e.stopPropagation(); reorder(el.id, "backward"); }}><ArrowDown size={15} /></button>
            <button className="icon-btn" title="Delete" onClick={(e) => { e.stopPropagation(); removeElement(el.id); }}><Trash2 size={15} /></button>
          </div>
        </div>
      ))}
    </>
  );
}
