import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toPng } from "html-to-image";
import { Undo2, Redo2, Download, Braces, Flame, Keyboard } from "lucide-react";
import { fitZoom } from "../editor/zoom";
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
import CheatSheet from "../editor/CheatSheet";
import { listDesigns, useAutosave } from "../editor/autosave";
import type { Element } from "../types";
import { useMedia } from "../landing/useMedia";

let clipboard: Element[] = [];
const onSaveFail = () => toast("Autosave is full (big uploads?). Hit Save to keep a copy.");

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
  const { setZoom, undo, redo, newDoc, doc } = useEditor();
  const [roasting, setRoasting] = useState(false);
  const [cheat, setCheat] = useState(false);
  const phone = useMedia("(max-width: 759px)");
  useKonami(onKonami);
  // Magic cards jump straight to Roast and the Vibe slider
  useEffect(() => {
    const roast = () => { if (useEditor.getState().doc.elements.length) setRoasting(true); else toast("Add something first. Even we can't roast an empty page."); };
    const vibe = () => {
      const el = document.querySelector<HTMLElement>(".vibe");
      el?.querySelector("input")?.focus();
      el?.classList.remove("flash"); void el?.offsetWidth; el?.classList.add("flash");
    };
    window.addEventListener("kiwiw:roast", roast);
    window.addEventListener("kiwiw:vibe", vibe);
    return () => { window.removeEventListener("kiwiw:roast", roast); window.removeEventListener("kiwiw:vibe", vibe); };
  }, []);

  // Fit + center whenever the page dimensions change (initial load, template open, resize).
  useEffect(() => { setZoom(fitZoom(doc.width, doc.height)); /* eslint-disable-next-line */ }, [doc.width, doc.height]);

  // Opening /editor with nothing loaded brings back the last design.
  useEffect(() => {
    const st = useEditor.getState();
    if (st.doc.elements.length || st.history.past.length) return;
    const last = listDesigns()[0];
    if (last) { st.loadDoc(last.doc, last.id); toast("Welcome back. Your design waited for you."); }
  }, []);
  useAutosave(onSaveFail);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t?.tagName === "INPUT" || t?.tagName === "TEXTAREA" || t?.tagName === "SELECT" || t?.isContentEditable) return;
      const st = useEditor.getState();
      const mod = e.ctrlKey || e.metaKey;
      const k = e.key.toLowerCase();
      const has = st.selectedIds.length > 0;
      if (mod && k === "z" && !e.shiftKey) { e.preventDefault(); st.undo(); }
      else if (mod && (k === "y" || (k === "z" && e.shiftKey))) { e.preventDefault(); st.redo(); }
      else if (mod && k === "d") { e.preventDefault(); if (has) st.duplicateSelected(); }
      else if (mod && k === "a") { e.preventDefault(); st.selectMany(st.doc.elements.filter((x) => !x.hidden && !x.locked).map((x) => x.id)); }
      else if (mod && k === "g" && e.shiftKey) { e.preventDefault(); if (has) { st.ungroup(); toast("Ungrouped. Creative differences."); } }
      else if (mod && k === "g") { e.preventDefault(); if (st.selectedIds.length > 1) { st.group(); toast("Grouped. They're a band now."); } }
      else if (mod && k === "c") {
        if (!has) return;
        clipboard = st.doc.elements.filter((x) => st.selectedIds.includes(x.id)).map((x) => JSON.parse(JSON.stringify(x)));
        toast(clipboard.length > 1 ? `Copied ${clipboard.length} things.` : "Copied.");
      }
      else if (mod && k === "x") {
        if (!has) return;
        clipboard = st.doc.elements.filter((x) => st.selectedIds.includes(x.id)).map((x) => JSON.parse(JSON.stringify(x)));
        st.removeSelected();
      }
      else if (mod && k === "v") { if (clipboard.length) { e.preventDefault(); st.pasteElements(clipboard); } }
      else if ((e.key === "Delete" || e.key === "Backspace") && has) { e.preventDefault(); st.removeSelected(); }
      else if (e.key.startsWith("Arrow") && has) {
        e.preventDefault();
        const step = e.shiftKey ? 10 : 1;
        const dx = e.key === "ArrowLeft" ? -step : e.key === "ArrowRight" ? step : 0;
        const dy = e.key === "ArrowUp" ? -step : e.key === "ArrowDown" ? step : 0;
        const patches = Object.fromEntries(st.doc.elements.filter((x) => st.selectedIds.includes(x.id) && !x.locked).map((x) => [x.id, { x: x.x + dx, y: x.y + dy }]));
        st.updateMany(patches, !e.repeat);
      }
      else if (e.key === "Escape") { st.select(null); setCheat(false); }
      else if (e.key === "/") { e.preventDefault(); window.dispatchEvent(new Event("kiwiw:search")); }
      else if (e.key === "?") { e.preventDefault(); setCheat((c) => !c); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

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

  if (phone) return (
    <div className="phone-gate">
      <KiwiLogo size={56} />
      <h1>This editor needs elbow room.</h1>
      <p>Dragging tiny handles on a phone is a crime we won't let you commit. Open Kiwiw on a laptop, or juice a line right here instead.</p>
      <Link to="/" className="btn primary">Juice something on the landing page →</Link>
      <span>Your designs autosave, so they'll be waiting on the big screen.</span>
    </div>
  );

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
          <Flame size={16} className="flame" /> Roast
        </button>
        <div className="spacer" />

        <button className="icon-btn" title="Shortcuts (?)" onClick={() => setCheat(true)}><Keyboard size={18} /></button>
        <span className="sep" />
        <button className="btn sm" onClick={exportJson} title="Download the design as JSON"><Braces size={16} /> Save</button>
        <button className="btn primary sm stamp-btn" onClick={exportPng} title="Stamp it, ship it"><Download size={16} /> Export PNG</button>
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
      {cheat && <CheatSheet onClose={() => setCheat(false)} />}
      <Toaster />
    </div>
  );
}
