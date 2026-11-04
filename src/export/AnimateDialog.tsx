// "Export → Animated" dialog: pick a preset and size, watch the live preview,
// download MP4/WebM or GIF. A joke progress bar keeps you company.
import { useEffect, useMemo, useRef, useState } from "react";
import { toCanvas } from "html-to-image";
import { X } from "lucide-react";
import ElementContent from "../editor/ElementContent";
import { smartResize } from "../ai/resize";
import { cropBox, drawFrame, encodeGif, plan, recordVideo, videoType, DURATION, HOLD, PRESETS, type Layer, type Preset } from "./animate";
import { toast } from "../personality/bus";
import type { KiwiwDoc } from "../types";

const SIZES = [{ id: "current", label: "Current size" }, { id: "square", label: "1080 × 1080", w: 1080, h: 1080 }, { id: "story", label: "1080 × 1920", w: 1080, h: 1920 }] as const;
const JOKES = ["Rasterising feelings…", "Teaching the headline to slam…", "Pre-peeling the stickers…", "Warming up the rubber stamp…", "Encoding (1987 technology, be patient)…", "Almost there. Kiwi is stretching…"];

export default function AnimateDialog({ doc: original, onClose }: { doc: KiwiwDoc; onClose: () => void }) {
  const [size, setSize] = useState<(typeof SIZES)[number]["id"]>("current");
  const [preset, setPreset] = useState<Preset>("slam");
  const doc = useMemo(() => {
    const s = SIZES.find((x) => x.id === size)!;
    return "w" in s && (s.w !== original.width || s.h !== original.height) ? smartResize(original, s.w, s.h) : original;
  }, [original, size]);
  const host = useRef<HTMLDivElement>(null);
  const preview = useRef<HTMLCanvasElement>(null);
  const [layers, setLayers] = useState<Layer[] | null>(null);
  const [busy, setBusy] = useState<{ p: number; what: string } | null>(null);
  const timing = useMemo(() => plan(doc), [doc]);

  // rasterise every element once (fonts + images loaded first)
  useEffect(() => {
    let live = true;
    setLayers(null);
    (async () => {
      await document.fonts.ready;
      await new Promise((r) => setTimeout(r, 250));
      const nodes = Array.from(host.current?.querySelectorAll<HTMLElement>("[data-layer]") ?? []);
      await Promise.all(Array.from(host.current?.querySelectorAll("img") ?? []).map((i) => i.decode().catch(() => null)));
      const out: Layer[] = [];
      for (const n of nodes) {
        if (!live) return;
        const i = +n.dataset.layer!;
        const e = doc.elements[i];
        const b = cropBox(e);
        try {
          const bmp = await toCanvas(n, { width: Math.ceil(b.w), height: Math.ceil(b.h), pixelRatio: 1, backgroundColor: undefined });
          out.push({ bmp, ...b, ...timing[i], chars: e.type === "text" ? e.text.length : 0, color: e.type === "text" ? e.color : "#111" });
        } catch { /* skip an element that cannot render */ }
      }
      if (live) setLayers(out);
    })();
    return () => { live = false; };
  }, [doc, timing]);

  // looping live preview
  useEffect(() => {
    const c = preview.current;
    if (!c || !layers) return;
    c.width = doc.width; c.height = doc.height;
    const ctx = c.getContext("2d")!;
    let raf = 0; const t0 = performance.now();
    const tick = () => { const t = ((performance.now() - t0) / 1000) % (DURATION + HOLD); drawFrame(ctx, doc, layers, preset, Math.min(t, DURATION)); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [layers, preset, doc]);

  const save = (blob: Blob, ext: string) => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `kiwiw-${preset}-${doc.width}x${doc.height}.${ext}`;
    (window as unknown as { __kiwiwExport?: string }).__kiwiwExport = `${ext}:${blob.size}`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  };
  const joke = (p: number) => JOKES[Math.min(JOKES.length - 1, Math.floor(p * JOKES.length))];
  const runVideo = async () => {
    if (!layers) return;
    setBusy({ p: 0, what: joke(0) });
    try { const { blob, ext } = await recordVideo(doc, layers, preset, (p) => setBusy({ p, what: joke(p) })); save(blob, ext); toast(`Exported ${ext.toUpperCase()}. It moves! Your poster has a cardio routine now.`); }
    catch (e) { toast(`Video export tripped: ${(e as Error).message}. Try GIF.`); }
    finally { setBusy(null); }
  };
  const runGif = async () => {
    if (!layers) return;
    setBusy({ p: 0, what: joke(0) });
    try { save(await encodeGif(doc, layers, preset, (p) => setBusy({ p, what: joke(p) })), "gif"); toast("GIF exported. Pronounce it however you like, we won't fight."); }
    finally { setBusy(null); }
  };
  const vt = videoType().ext.toUpperCase();

  return (
    <div className="anim-wrap" role="dialog" aria-label="Animated export">
      <div className="anim">
        <header><b className="display">Export, but make it move</b><button className="icon-btn" onClick={onClose} aria-label="Close"><X size={18} /></button></header>
        <div className="anim-body">
          <div className="anim-stage">
            <canvas ref={preview} />
            {!layers && <div className="anim-load mono"><span className="spinner" /> slicing your design into layers…</div>}
          </div>
          <div className="anim-side">
            <h4>Preset</h4>
            <div className="anim-presets">
              {PRESETS.map((p) => (
                <button key={p.id} className={"anim-preset" + (preset === p.id ? " on" : "")} onClick={() => setPreset(p.id)}><b>{p.name}</b><span>{p.joke}</span></button>
              ))}
            </div>
            <h4>Size</h4>
            <div className="chips">{SIZES.map((s) => <button key={s.id} className={"chip" + (size === s.id ? " on" : "")} onClick={() => setSize(s.id)}>{s.label}</button>)}</div>
            <p className="anim-note mono">{DURATION + HOLD}s · {doc.width}×{doc.height} · bg wipe → photo → headline → stickers → stamp</p>
            <div className="anim-go">
              <button className="btn primary stamp-btn" disabled={!layers || !!busy} onClick={runVideo}>Export {vt}</button>
              <button className="btn" disabled={!layers || !!busy} onClick={runGif}>Export GIF</button>
            </div>
            {busy && <div className="anim-bar"><i style={{ width: `${Math.round(busy.p * 100)}%` }} /><span className="mono">{busy.what}</span></div>}
          </div>
        </div>
      </div>
      {/* offscreen: one full-res layer per element, cropped to its box */}
      <div ref={host} className="anim-host" aria-hidden="true">
        {doc.elements.map((el, i) => {
          if (el.hidden) return null;
          const b = cropBox(el);
          return (
            <div key={el.id + size} data-layer={i} style={{ position: "relative", width: Math.ceil(b.w), height: Math.ceil(b.h), overflow: "visible" }}>
              <div className="el" style={{ position: "absolute", left: el.x - b.x, top: el.y - b.y, width: el.w, height: el.h, opacity: el.opacity, transform: `rotate(${el.rotation}deg)` }}>
                <ElementContent el={el} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
