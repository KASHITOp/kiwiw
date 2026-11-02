import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toPng } from "html-to-image";
import { Undo2, Redo2, Minus, Plus, Maximize2, Download, Braces, Flame } from "lucide-react";
import KiwiLogo from "../brand/KiwiLogo";
import { useEditor } from "../store";
import Canvas from "../editor/Canvas";
import LeftPanel from "../editor/LeftPanel";
import PropertiesPanel from "../editor/PropertiesPanel";
import LayersPanel from "../editor/LayersPanel";
import VibeBar from "../editor/VibeBar";
import RoastPanel from "../editor/RoastPanel";
import Toaster from "../personality/Toaster";
import KiwiMascot from "../personality/KiwiMascot";
import { react, toast, oops } from "../personality/bus";
import { squeezeKiwis, useKonami } from "../personality/useKonami";

const EXPORT_LINES = ["Exported. It's juicy.", "Exported. Go post it before you overthink it.", "Exported. Fresh off the vine.", "Exported. The kiwi is proud of you."];
const onKonami = () => { squeezeKiwis(); react("squeeze", "↑↑↓↓←→←→BA. I felt that. In my seeds."); };

const SIZES = [
  { label: "Square 1080", w: 1080, h: 1080 },
  { label: "Story 1080×1920", w: 1080, h: 1920 },
  { label: "Slide 1280×720", w: 1280, h: 720 },
  { label: "Poster 1080×1350", w: 1080, h: 1350 },
  { label: "A4 794×1123", w: 794, h: 1123 },
];

export default function Editor() {
  const { zoom, setZoom, undo, redo, newDoc, doc, selectedId, removeElement, duplicateElement } = useEditor();
  const [roasting, setRoasting] = useState(false);
  useKonami(onKonami);

  // Fit + center whenever the page dimensions change (initial load, template open, resize).
  useEffect(() => { setZoom(fitZoom(doc.width, doc.height)); /* eslint-disable-next-line */ }, [doc.width, doc.height]);

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
    const prev = node.style.transform;
    node.style.transform = "scale(1)";
    useEditor.getState().select(null);
    await new Promise((r) => setTimeout(r, 60));
    try {
      const url = await toPng(node, { pixelRatio: 2, width: doc.width, height: doc.height });
      const a = document.createElement("a");
      a.href = url;
      a.download = "kiwiw-design.png";
      a.click();
      toast(EXPORT_LINES[Math.floor(Math.random() * EXPORT_LINES.length)]);
      react("proud");
    } catch (e) {
      oops("Export", e);
    } finally {
      node.style.transform = prev;
    }
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(doc, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "kiwiw-design.json";
    a.click();
    toast("Saved as JSON. Future you says thanks.");
  };

  return (
    <div className="editor">
      <div className="topbar">
        <Link to="/" className="brand">
          <KiwiLogo size={26} /> Kiwiw
        </Link>
        <span className="sep" />
        <button className="icon-btn" title="Undo (Ctrl+Z). Tiny time travel." onClick={undo}><Undo2 size={18} /></button>
        <button className="icon-btn" title="Redo (Ctrl+Y). Un-undo." onClick={redo}><Redo2 size={18} /></button>
        <select
          className="btn sm"
          style={{ width: "auto", paddingRight: "var(--s-6)" }}
          onChange={(e) => { const s = SIZES[+e.target.value]; if (s) newDoc(s.w, s.h); }}
          value=""
        >
          <option value="" disabled>Resize…</option>
          {SIZES.map((s, i) => <option key={s.label} value={i}>{s.label}</option>)}
        </select>

        <div className="spacer" />
        <VibeBar />
        <button className={"btn sm roast-btn" + (roasting ? " on" : "")} onClick={() => setRoasting((r) => !r)} title="Roast my design. Honest feedback, one-click fixes." disabled={!doc.elements.length}>
          <Flame size={16} /> Roast
        </button>
        <div className="spacer" />

        <button className="icon-btn" title="Zoom out" onClick={() => setZoom(zoom - 0.1)}><Minus size={18} /></button>
        <span className="zoom">{Math.round(zoom * 100)}%</span>
        <button className="icon-btn" title="Zoom in" onClick={() => setZoom(zoom + 0.1)}><Plus size={18} /></button>
        <button className="icon-btn" title="Fit to screen. Find your page again." onClick={() => setZoom(fitZoom(doc.width, doc.height))}><Maximize2 size={18} /></button>

        <span className="sep" />
        <button className="btn sm" onClick={exportJson} title="Download the design as JSON"><Braces size={16} /> Save</button>
        <button className="btn primary sm" onClick={exportPng}><Download size={16} /> Export PNG</button>
      </div>

      <div className="editor-body">
        <LeftPanel />
        <Canvas />
        <div className="side right">
          <PropertiesPanel />
          <LayersPanel />
        </div>
        {roasting && <RoastPanel onClose={() => setRoasting(false)} />}
        <KiwiMascot />
      </div>
      <Toaster />
    </div>
  );
}

function fitZoom(w: number, h: number) {
  const availW = window.innerWidth - 60 - 300 - 300 - 100;
  const availH = window.innerHeight - 52 - 100;
  return Math.max(0.1, Math.min(1, Math.min(availW / w, availH / h)));
}
