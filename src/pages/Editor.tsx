import { useEffect } from "react";
import { Link } from "react-router-dom";
import { toPng } from "html-to-image";
import { useEditor } from "../store";
import Canvas from "../editor/Canvas";
import LeftPanel from "../editor/LeftPanel";
import PropertiesPanel from "../editor/PropertiesPanel";
import LayersPanel from "../editor/LayersPanel";

const SIZES = [
  { label: "Square 1080", w: 1080, h: 1080 },
  { label: "Story 1080×1920", w: 1080, h: 1920 },
  { label: "Slide 1280×720", w: 1280, h: 720 },
  { label: "Poster 1080×1350", w: 1080, h: 1350 },
  { label: "A4 210×297", w: 794, h: 1123 },
];

export default function Editor() {
  const { zoom, setZoom, undo, redo, newDoc, doc, selectedId, removeElement, duplicateElement } = useEditor();

  // fit the canvas on first load
  useEffect(() => { setZoom(fitZoom(doc.width, doc.height)); /* eslint-disable-next-line */ }, []);

  // keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      const mod = e.ctrlKey || e.metaKey;
      if (mod && e.key.toLowerCase() === "z" && !e.shiftKey) { e.preventDefault(); undo(); }
      else if (mod && (e.key.toLowerCase() === "y" || (e.key.toLowerCase() === "z" && e.shiftKey))) { e.preventDefault(); redo(); }
      else if (mod && e.key.toLowerCase() === "d" && selectedId) { e.preventDefault(); duplicateElement(selectedId); }
      else if ((e.key === "Delete" || e.key === "Backspace") && selectedId) { e.preventDefault(); removeElement(selectedId); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [undo, redo, selectedId, removeElement, duplicateElement]);

  const exportPng = async () => {
    const node = document.getElementById("kiwiw-canvas");
    if (!node) return;
    const prevTransform = node.style.transform;
    node.style.transform = "scale(1)";
    useEditor.getState().select(null);
    await new Promise((r) => setTimeout(r, 60));
    try {
      const url = await toPng(node, { pixelRatio: 2, width: doc.width, height: doc.height });
      const a = document.createElement("a");
      a.href = url;
      a.download = "kiwiw-design.png";
      a.click();
    } catch (e) {
      alert("Export failed: " + (e as Error).message);
    } finally {
      node.style.transform = prevTransform;
    }
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(doc, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "kiwiw-design.json";
    a.click();
  };

  return (
    <div className="editor">
      <div className="topbar">
        <Link to="/" className="brand" style={{ fontSize: 18 }}>
          <span className="dot">🥝</span> Kiwiw
        </Link>
        <span style={{ color: "var(--line)" }}>|</span>
        <button className="btn sm ghost" title="Undo (Ctrl+Z)" onClick={undo}>↩ Undo</button>
        <button className="btn sm ghost" title="Redo (Ctrl+Y)" onClick={redo}>↪ Redo</button>
        <select
          className="btn sm"
          style={{ paddingRight: 8 }}
          onChange={(e) => { const s = SIZES[+e.target.value]; if (s) newDoc(s.w, s.h); }}
          value=""
        >
          <option value="" disabled>Resize…</option>
          {SIZES.map((s, i) => <option key={s.label} value={i}>{s.label}</option>)}
        </select>

        <div className="spacer" />

        <button className="btn sm ghost" onClick={() => setZoom(zoom - 0.1)}>−</button>
        <span style={{ width: 48, textAlign: "center", fontSize: 13 }}>{Math.round(zoom * 100)}%</span>
        <button className="btn sm ghost" onClick={() => setZoom(zoom + 0.1)}>+</button>
        <button className="btn sm ghost" onClick={() => setZoom(fitZoom(doc.width, doc.height))}>Fit</button>

        <span style={{ color: "var(--line)" }}>|</span>
        <button className="btn sm" onClick={exportJson}>Save .json</button>
        <button className="btn primary sm" onClick={exportPng}>⬇ Export PNG</button>
      </div>

      <div className="editor-body">
        <LeftPanel />
        <Canvas />
        <div className="side right">
          <PropertiesPanel />
          <div style={{ height: 1, background: "var(--line)", margin: "18px 0" }} />
          <LayersPanel />
        </div>
      </div>
    </div>
  );
}

function fitZoom(w: number, h: number) {
  const availW = window.innerWidth - 64 - 280 - 300 - 80;
  const availH = window.innerHeight - 54 - 80;
  return Math.max(0.1, Math.min(1, Math.min(availW / w, availH / h)));
}
