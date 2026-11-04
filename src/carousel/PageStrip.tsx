// The carousel page strip under the canvas: pick, add, duplicate, reorder,
// delete; export the whole set as PDF or a ZIP of PNGs.
import { useState } from "react";
import { ArrowLeft, ArrowRight, Copy, FileDown, Plus, Trash2, Archive } from "lucide-react";
import { useCarousel, MAX_PAGES } from "./store";
import { useEditor } from "../store";
import { exportPdf, exportZip } from "./exportPages";
import { toast } from "../personality/bus";
import Thumb from "../editor/Thumb";

export default function PageStrip() {
  const { pages, index, go, add, duplicate, remove, move, snapshot } = useCarousel();
  const doc = useEditor((s) => s.doc);
  const [busy, setBusy] = useState<number | null>(null);
  if (!pages) return null;
  const live = pages.map((p, i) => (i === index ? doc : p));
  const run = async (kind: "pdf" | "zip") => {
    setBusy(0);
    try {
      await (kind === "pdf" ? exportPdf : exportZip)(snapshot(), (p) => setBusy(p));
      toast(kind === "pdf" ? "PDF ready. LinkedIn will call it a 'document'. Let it." : "ZIP of PNGs ready. One slide per file, zero drama.");
    } catch (e) { toast(`Carousel export tripped: ${(e as Error).message}`); }
    finally { setBusy(null); }
  };
  return (
    <div className="pstrip" onPointerDown={(e) => e.stopPropagation()}>
      <div className="pstrip-pages">
        {live.map((p, i) => (
          <button key={i} className={"pstrip-page" + (i === index ? " on" : "")} onClick={() => go(i)} title={`Slide ${i + 1}`}>
            <span className="pstrip-art"><Thumb doc={p} /></span>
            <span className="mono">{i + 1}</span>
          </button>
        ))}
        {live.length < MAX_PAGES && <button className="pstrip-add" onClick={add} title="Add a blank slide"><Plus size={18} /></button>}
      </div>
      <div className="pstrip-tools">
        <button className="icon-btn" onClick={() => move(-1)} disabled={index === 0} title="Move slide left"><ArrowLeft size={15} /></button>
        <button className="icon-btn" onClick={() => move(1)} disabled={index === live.length - 1} title="Move slide right"><ArrowRight size={15} /></button>
        <button className="icon-btn" onClick={duplicate} disabled={live.length >= MAX_PAGES} title="Duplicate slide"><Copy size={15} /></button>
        <button className="icon-btn" onClick={remove} title={live.length > 1 ? "Delete slide" : "Leave carousel mode"}><Trash2 size={15} /></button>
        <span className="sep" />
        <button className="btn sm" onClick={() => run("pdf")} disabled={busy !== null}><FileDown size={14} /> PDF</button>
        <button className="btn sm" onClick={() => run("zip")} disabled={busy !== null}><Archive size={14} /> PNG zip</button>
        {busy !== null && <span className="mono pstrip-busy">printing slide {Math.min(live.length, Math.floor(busy * live.length) + 1)}/{live.length}…</span>}
      </div>
    </div>
  );
}
