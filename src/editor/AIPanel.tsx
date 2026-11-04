import { useEffect, useMemo, useState } from "react";

import { useEditor } from "../store";
import { makeText } from "../data/factory";
import { removeBackground } from "../ai/provider";
import { TONES, LANGS, rewriteTone, translate, writeCaptions, paletteFor, applyPalette, type Captions, type Palette } from "../ai/tools";
import { FORMATS, smartResize } from "../ai/resize";
import { oops, toast } from "../personality/bus";
import { MagicCards } from "./panels";
import Thumb from "./Thumb";
import { useCarousel } from "../carousel/store";
import { buildCarousel, aiPoints, builtinPoints, CAROUSEL_STYLES, type CarouselStyle } from "../carousel/build";
import type { TextElement } from "../types";

// Magic is a stack of bold cards (DESIGN.md §19). Every tool asks Gemini on
// the server and falls back to a built-in version; none of them block the UI.
export default function AIPanel({ q = "" }: { q?: string }) {
  return (
    <MagicCards q={q}>
      {{ carousel: <CarouselMaker />, write: <MagicWrite />, translate: <Translate />, caption: <CaptionWriter />, palette: <VibePalette />, resize: <MagicResize />, bg: <MagicBgRemove /> }}
    </MagicCards>
  );
}

/** A rotating funny loading line while a spell runs. */
function Brewing({ lines }: { lines: string[] }) {
  const [i, setI] = useState(0);
  useEffect(() => { const t = setInterval(() => setI((x) => (x + 1) % lines.length), 1400); return () => clearInterval(t); }, [lines]);
  return <div className="mg-brew"><span className="spinner" /> {lines[i]}</div>;
}
const viaLabel = (ai: boolean) => <span className={"mg-via" + (ai ? " ai" : "")}>{ai ? "Gemini" : "built-in"}</span>;

function useSelectedText() {
  const { doc, selectedId } = useEditor();
  const el = doc.elements.find((e) => e.id === selectedId);
  return el?.type === "text" ? (el as TextElement) : null;
}

function CarouselMaker() {
  const [topic, setTopic] = useState("my first year of college");
  const [busy, setBusy] = useState<string | null>(null);
  const [via, setVia] = useState<boolean | null>(null);
  const run = async (style: CarouselStyle) => {
    setBusy(style);
    try {
      const ai = await aiPoints(topic, style);
      const pages = buildCarousel(style, ai ?? builtinPoints(topic, style));
      useCarousel.getState().start(pages);
      setVia(!!ai);
      toast(`${pages.length} slides ready. Edit any slide from the strip under the page.`);
    } catch (e) { oops("Carousel", e); } finally { setBusy(null); }
  };
  return (
    <div className="ai-card">
      <p className="hint">One topic line. Magic Write fills every slide. 1080×1350, exports as one PDF or a PNG zip.</p>
      <div className="field"><input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="my first year of college" /></div>
      <div className="mg-tones">
        {CAROUSEL_STYLES.map((s) => <button key={s.id} className="mg-tone" disabled={!!busy || !topic.trim()} onClick={() => run(s.id)}><b>{s.name}</b><span>{s.joke}</span></button>)}
      </div>
      {busy && <Brewing lines={["Drafting thought leadership…", "Adding 'Agree?' (removing it)…", "Numbering the lessons…", "Making slide 4 the spicy one…"]} />}
      {via !== null && !busy && <p className="mg-done">Slides written {viaLabel(via)}</p>}
    </div>
  );
}

function MagicWrite() {
  const sel = useSelectedText();
  const { updateElement, addElement } = useEditor();
  const [busy, setBusy] = useState<string | null>(null);
  const [via, setVia] = useState<boolean | null>(null);
  const [draft, setDraft] = useState("");
  const run = async (tone: (typeof TONES)[number]["id"]) => {
    setBusy(tone);
    try {
      const base = sel ?? ({ ...makeText({ text: draft || "Plain idea in. Juicy design out.", fontSize: 56, w: 760, h: 220 }), id: "tmp" } as TextElement);
      const r = await rewriteTone(base, tone);
      if (sel) updateElement(sel.id, r.patch); else addElement({ ...base, ...r.patch, id: undefined } as never);
      setVia(r.ai);
      toast(`Rewritten, ${TONES.find((t) => t.id === tone)!.label.toLowerCase()} style.`);
    } catch (e) { oops("Magic Write", e); } finally { setBusy(null); }
  };
  return (
    <div className="ai-card">
      <p className="hint">{sel ? <>Rewriting <b>"{sel.text.slice(0, 40)}{sel.text.length > 40 ? "…" : ""}"</b>. It shrinks to fit its box.</> : "Select a text on the page, or type a line to add a new one."}</p>
      {!sel && <div className="field"><textarea placeholder="Write about…" value={draft} onChange={(e) => setDraft(e.target.value)} /></div>}
      <div className="mg-tones">
        {TONES.map((t) => (
          <button key={t.id} className="mg-tone" onClick={() => run(t.id)} disabled={!!busy}>
            <b>{t.label}</b><span>{t.joke}</span>
          </button>
        ))}
      </div>
      {busy && <Brewing lines={["Hiring a copywriter…", "Firing the copywriter…", "Doing it ourselves…", "Counting syllables…"]} />}
      {via !== null && !busy && <p className="mg-done">Done {viaLabel(via)}</p>}
    </div>
  );
}

function Translate() {
  const sel = useSelectedText();
  const { updateElement } = useEditor();
  const [busy, setBusy] = useState(false);
  const [via, setVia] = useState<boolean | null>(null);
  const run = async (to: (typeof LANGS)[number]["id"]) => {
    if (!sel) return;
    setBusy(true);
    try {
      const r = await translate(sel, to);
      if (!r) { toast("Gemini is on chai break and our phrasebook only knows 20 words. Try again in a minute."); return; }
      updateElement(sel.id, r.patch); setVia(r.ai);
    } catch (e) { oops("Translate", e); } finally { setBusy(false); }
  };
  return (
    <div className="ai-card">
      <p className="hint">{sel ? "Pick a language. The font switches to one that speaks it." : "Select a text on the page first."}</p>
      <div className="mg-row">{LANGS.map((l) => <button key={l.id} className="btn sm" disabled={!sel || busy} onClick={() => run(l.id)}>{l.label}</button>)}</div>
      {busy && <Brewing lines={["Calling Nani for spelling…", "Finding the matra key…", "Translating vibes, not words…"]} />}
      {via !== null && !busy && <p className="mg-done">Done {viaLabel(via)}</p>}
    </div>
  );
}

function CaptionWriter() {
  const doc = useEditor((s) => s.doc);
  const [busy, setBusy] = useState(false);
  const [out, setOut] = useState<{ captions: Captions; ai: boolean } | null>(null);
  const run = async () => { setBusy(true); try { setOut(await writeCaptions(doc)); } finally { setBusy(false); } };
  const copy = (t: string) => { navigator.clipboard?.writeText(t).then(() => toast("Copied. Go be famous.")).catch(() => toast("Clipboard said no. Select and copy it yourself.")); };
  const tags = out ? out.captions.hashtags.map((h) => `#${h}`).join(" ") : "";
  return (
    <div className="ai-card">
      <p className="hint">Reads your design, writes the post. Instagram, LinkedIn and hashtags.</p>
      <button className="btn primary block" onClick={run} disabled={busy || !doc.elements.length}>{busy ? <span className="spinner" /> : out ? "Write another" : "Write captions"}</button>
      {busy && <Brewing lines={["Thinking of a pun…", "Rejecting the pun…", "Keeping the pun…", "Adding #blessed (removing it)…"]} />}
      {out && !busy && (
        <div className="mg-caps">
          <div className="mg-cap"><b>Instagram</b><p>{out.captions.instagram}</p><button className="btn sm" onClick={() => copy(`${out.captions.instagram}\n\n${tags}`)}>Copy</button></div>
          <div className="mg-cap"><b>LinkedIn</b><p>{out.captions.linkedin}</p><button className="btn sm" onClick={() => copy(out.captions.linkedin)}>Copy</button></div>
          <div className="mg-cap"><b>Hashtags</b><p className="mono">{tags}</p></div>
          <p className="mg-done">Written {viaLabel(out.ai)}</p>
        </div>
      )}
    </div>
  );
}

function VibePalette() {
  const { replaceDoc, commit } = useEditor();
  const doc = useEditor((s) => s.doc);
  const [vibe, setVibe] = useState("monsoon in Mumbai");
  const [busy, setBusy] = useState(false);
  const [p, setP] = useState<{ palette: Palette; ai: boolean } | null>(null);
  const run = async () => {
    setBusy(true);
    try {
      const r = await paletteFor(vibe);
      setP(r);
      commit();
      replaceDoc(applyPalette(useEditor.getState().doc, r.palette), true);
    } finally { setBusy(false); }
  };
  return (
    <div className="ai-card">
      <p className="hint">Describe a mood. We paint the whole design in it. Undo is right there.</p>
      <div className="field"><input value={vibe} onChange={(e) => setVibe(e.target.value)} placeholder="monsoon in Mumbai" onKeyDown={(e) => e.key === "Enter" && run()} /></div>
      <div className="mg-row">{["monsoon in Mumbai", "Diwali at nani's", "Goa at 6pm", "chai tapri"].map((v) => <button key={v} className="chip" onClick={() => setVibe(v)}>{v}</button>)}</div>
      <button className="btn primary block" onClick={run} disabled={busy || !vibe.trim() || !doc.elements.length}>{busy ? <span className="spinner" /> : "Paint it"}</button>
      {busy && <Brewing lines={["Mixing paint…", "Asking the sky for its hex code…", "Arguing about teal…"]} />}
      {p && !busy && (
        <div className="mg-pal"><b>{p.palette.name}</b> {viaLabel(p.ai)}<div className="sw">{p.palette.colors.map((c, i) => <i key={i} style={{ background: c }} title={c} />)}</div></div>
      )}
    </div>
  );
}

function MagicResize() {
  const doc = useEditor((s) => s.doc);
  const { replaceDoc, commit } = useEditor();
  const previews = useMemo(() => (doc.elements.length ? FORMATS.filter((f) => f.w !== doc.width || f.h !== doc.height).map((f) => ({ f, d: smartResize(doc, f.w, f.h) })) : []), [doc]);
  const go = (d: typeof doc, label: string) => { commit(); replaceDoc(d, true); toast(`Resized for ${label}. Re-laid out, not stretched.`); };
  return (
    <div className="ai-card">
      <p className="hint">{doc.elements.length ? "Pick a size. Photos get their own zone, type gets re-stacked, backgrounds stretch." : "Add something to the page first. Resizing nothing is very fast, though."}</p>
      <div className="mg-sizes">
        {previews.map(({ f, d }) => (
          <button key={f.id} className="mg-size" onClick={() => go(d, f.label)} title={`${f.label} · ${f.w}×${f.h}`}>
            <span className="mg-size-art" style={{ aspectRatio: `${f.w} / ${f.h}` }}><Thumb doc={d} /></span>
            <b>{f.label}</b><span>{f.w}×{f.h}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function MagicBgRemove() {
  const { doc, selectedId, updateElement } = useEditor();
  const el = doc.elements.find((e) => e.id === selectedId);
  const isImage = el?.type === "image";
  const [busy, setBusy] = useState(false);

  const run = async () => {
    if (!isImage) return;
    setBusy(true);
    try {
      const out = await removeBackground((el as { src: string }).src);
      updateElement(el!.id, { src: out });
    } catch (e) { oops("Background remover", e); }
    finally { setBusy(false); }
  };

  return (
    <div className="ai-card">
      <p className="hint">{isImage ? "Remove the background of the selected image." : "Select an image on the canvas first."}</p>
      <button className="btn primary block" onClick={run} disabled={!isImage || busy}>{busy ? <span className="spinner" /> : "Remove background"}</button>
      {busy && <Brewing lines={["Asking the background to leave politely…", "Background left. Taking its shadow too…"]} />}
    </div>
  );
}
