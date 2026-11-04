// Left-panel content v3 (DESIGN.md §15–16): stickers grouped by Style DNA
// recipe, text presets rendered in their real style, a photo masonry with
// one-hover effects, and Magic as bold cards.
import { useEffect, useMemo, useState } from "react";
import { Flame, Gauge, PenLine, Eraser } from "lucide-react";
import { useEditor } from "../store";
import { makeImage, makeShape } from "../data/factory";
import { makeSticker, placeText, TEXT_PRESETS, type TextPreset } from "../data/presets";
import { STICKER_MAP, STICKERS } from "../stickers/library";
import StickerArt from "../stickers/StickerArt";
import { docPalette, recolor } from "../stickers/recolor";
import ElementContent from "./ElementContent";
import { PHOTOS, searchPhotos, type Photo } from "../data/photos";
import type { Element, ImageFx, ShapeKind } from "../types";

const match = (q: string, ...hay: (string | undefined)[]) => {
  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  const text = hay.join(" ").toLowerCase();
  return words.every((w) => text.includes(w));
};

/* ------------------------------ Stickers ------------------------------ */

const BASIC: { k: ShapeKind; name: string; svg: React.ReactNode }[] = [
  { k: "rect", name: "Rectangle", svg: <rect x="14" y="22" width="72" height="56" rx="6" /> },
  { k: "ellipse", name: "Circle", svg: <circle cx="50" cy="50" r="34" /> },
  { k: "triangle", name: "Triangle", svg: <path d="M50,16 L86,82 H14Z" /> },
  { k: "line", name: "Line", svg: <rect x="10" y="46" width="80" height="8" rx="4" /> },
];

/** Sticker Library 2.0 tabs (DESIGN.md §17). "Classics" = the v1 drawer. */
const TABS: { id: string; name: string; joke: string; cats: string[] }[] = [
  { id: "Coquette", name: "Coquette", joke: "lips, cherries, bows. no notes", cats: ["Coquette"] },
  { id: "Y2K", name: "Y2K Shiny", joke: "chrome is a personality", cats: ["Y2K"] },
  { id: "Frames & Paper", name: "Frames & Paper", joke: "scrapbook, but make it legal", cats: ["Frames & Paper"] },
  { id: "Type", name: "Type", joke: "ransom notes, minus the crime", cats: ["Type"] },
  { id: "Desi Pop", name: "Desi Pop", joke: "horn OK please", cats: ["Desi Pop", "Desi"] },
  { id: "Internet", name: "Internet Brain", joke: "too many tabs open", cats: ["Internet"] },
  { id: "Sport", name: "Stadium", joke: "stats made up, energy real", cats: ["Sport"] },
  { id: "Pets", name: "Pets & Chaos", joke: "real cats from Pexels, drawn ones from us", cats: ["Pets"] },
  { id: "Kiwi Moods", name: "Kiwi Moods", joke: "12 moods, 0 chill", cats: ["Kiwi Moods", "Kiwi"] },
  { id: "Classics", name: "Classics", joke: "blobs, bursts, scribbles, tape", cats: ["Blobs", "Bursts", "Badges", "Scribbles", "Arrows", "Tape & paper", "Bubbles", "Lines", "Texture", "Pixel"] },
];

type Border = "white" | "none" | "black";

export function StickersTab({ q, setQ }: { q: string; setQ: (v: string) => void }) {
  const { addElement, doc, selectedId, updateElement } = useEditor();
  const [tab, setTab] = useState("all");
  const [border, setBorder] = useState<Border>("white");
  const [matchOn, setMatchOn] = useState(false);
  const sel = doc.elements.find((e) => e.id === selectedId);
  const selSticker = sel?.type === "sticker" ? sel : null;
  const palette = useMemo(() => docPalette(doc), [doc]);

  const add = (kind: string) => {
    let el = makeSticker(kind, doc.width, doc.height) as Element;
    if (el.type === "sticker") {
      el = { ...el, border: border === "none" ? undefined : border };
      if (matchOn && palette && STICKER_MAP[kind].uses.length) el = { ...el, ...recolor(el, palette) };
    }
    addElement(el);
  };
  const pickBorder = (b: Border) => {
    setBorder(b);
    if (selSticker) updateElement(selSticker.id, { border: b === "none" ? undefined : b });
  };
  const toggleMatch = () => {
    setMatchOn(!matchOn);
    if (!matchOn && selSticker && palette) updateElement(selSticker.id, recolor(selSticker, palette));
  };

  const total = STICKERS.filter((d) => !d.kind.startsWith("bg-")).length;
  const groups = useMemo(() => {
    const list = STICKERS.filter((d) => !d.kind.startsWith("bg-"));
    return TABS.filter((t) => tab === "all" || t.id === tab)
      .map((t) => ({ ...t, defs: list.filter((d) => t.cats.includes(d.category) && match(q, d.name, d.category, t.name, ...d.tags)) }))
      .filter((g) => g.defs.length);
  }, [q, tab]);

  return (
    <>
      <div className="stk-count mono"><b>{total}</b> stickers · <b>0</b> logos · 100% ours</div>
      <div className="chips scroll">
        <button className={"chip nb" + (tab === "all" ? " on" : "")} onClick={() => setTab("all")}>All</button>
        {TABS.map((t) => <button key={t.id} className={"chip nb" + (tab === t.id ? " on" : "")} onClick={() => setTab(t.id)}>{t.name}</button>)}
      </div>
      <div className="stk-tools">
        <div className="seg" role="group" aria-label="Sticker border">
          {(["white", "none", "black"] as Border[]).map((b) => (
            <button key={b} className={border === b ? "on" : ""} onClick={() => pickBorder(b)} title={`${b} sticker border`}>
              <i className={"bd-" + b} />{b === "none" ? "None" : b === "white" ? "White" : "Black"}
            </button>
          ))}
        </div>
        <button className={"stk-match" + (matchOn ? " on" : "")} onClick={toggleMatch} disabled={!palette} title="Recolour stickers to this design's palette">
          {palette && <span className="sw">{palette.map((c, i) => <i key={i} style={{ background: c }} />)}</span>}
          Match design
        </button>
      </div>
      {groups.map((g) => (
        <section key={g.id} className="stk-group">
          <h5>{g.name} <span className="stamp-chip">{g.defs.length} ORIGINALS</span></h5>
          <p className="stk-joke">{g.joke}</p>
          <div className="stk-grid">
            {g.defs.map((d) => (
              <button
                key={d.kind}
                className="stk-tile"
                data-name={d.name}
                title={`${d.name}: click or drag onto the page`}
                draggable
                onDragStart={(e) => { e.dataTransfer.setData("application/x-kiwiw-sticker", d.kind); e.dataTransfer.effectAllowed = "copy"; }}
                onClick={() => add(d.kind)}
              >
                <StickerArt kind={d.kind} fit {...(matchOn && palette && d.uses.length ? { fill: palette[0], accent: palette[1], ink: palette[2] } : {})} />
              </button>
            ))}
          </div>
        </section>
      ))}
      {tab === "all" && !q.trim() && (
        <section className="stk-group">
          <h5>Basic shapes <span>for when you're feeling minimal</span></h5>
          <div className="stk-grid">
            {BASIC.map((b) => (
              <button key={b.k} className="stk-tile basic" onClick={() => addElement(makeShape(b.k, { x: doc.width / 2 - 130, y: doc.height / 2 - 130 }))} data-name={b.name}>
                <svg viewBox="0 0 100 100" fill="currentColor">{b.svg}</svg>
              </button>
            ))}
          </div>
        </section>
      )}
      {!groups.length && (
        <div className="empty">
          <KiwiMini mood="judging" />
          Nothing matches "{q}". We drew {total} stickers by hand and none of them is that.
          <br /><button className="btn sm" style={{ marginTop: 12 }} onClick={() => setQ("kiwi")}>Show me kiwis</button>
        </div>
      )}
    </>
  );
}

/** Tiny kiwi for empty / loading states. */
export function KiwiMini({ mood = "judging" }: { mood?: string }) {
  return <div className="kiwi-mini"><StickerArt kind={`km-${mood}`} fit /></div>;
}

/** Canvas drop target for dragged stickers (mounted by the Canvas). */
export function useStickerDrop(toCanvas: (x: number, y: number) => { x: number; y: number } | null) {
  const { addElement, doc } = useEditor();
  return {
    onDragOver: (e: React.DragEvent) => { if (e.dataTransfer.types.includes("application/x-kiwiw-sticker")) { e.preventDefault(); e.dataTransfer.dropEffect = "copy"; } },
    onDrop: (e: React.DragEvent) => {
      const k = e.dataTransfer.getData("application/x-kiwiw-sticker");
      if (!k || !STICKER_MAP[k]) return;
      e.preventDefault();
      const p = toCanvas(e.clientX, e.clientY);
      const el = makeSticker(k, doc.width, doc.height);
      addElement(p ? { ...el, x: p.x - el.w / 2, y: p.y - el.h / 2 } : el);
    },
  };
}

/* ------------------------------ Text ------------------------------ */

const FEATURED = ["shouty", "serif", "hindi", "hinglish", "glossy", "window", "stats"];

function PresetArt({ p }: { p: TextPreset }) {
  // the real element, scaled to the card, so the preview IS the preset
  const s = Math.min(0.3, 252 / p.el.w, 96 / p.el.h);
  const el = {
    ...p.el, id: "pv", x: 0, y: 0,
    w: p.el.w * s, h: p.el.h * s, fontSize: p.el.fontSize * s, letterSpacing: p.el.letterSpacing * s,
    outline: p.el.outline ? { ...p.el.outline, width: Math.max(1, p.el.outline.width * s) } : p.el.outline,
    shadow: p.el.shadow ? { ...p.el.shadow, x: p.el.shadow.x * s, y: p.el.shadow.y * s } : p.el.shadow,
    cutout: p.el.cutout ? { ...p.el.cutout, width: Math.max(1, p.el.cutout.width * s) } : p.el.cutout,
  } as Element;
  return (
    <div className={"txp-art" + (p.dark ? " dark" : "")} style={p.paper ? { background: p.paper } : undefined}>
      <div style={{ width: el.w, height: el.h, transform: `rotate(${p.el.rotation}deg)`, flex: "none" }}><ElementContent el={el} /></div>
    </div>
  );
}

export function TextTab({ q }: { q: string }) {
  const { addElement, doc } = useEditor();
  const list = TEXT_PRESETS.filter((p) => match(q, p.label, p.hint, p.el.fontFamily));
  const featured = list.filter((p) => FEATURED.includes(p.id)).sort((a, b) => FEATURED.indexOf(a.id) - FEATURED.indexOf(b.id));
  const rest = list.filter((p) => !FEATURED.includes(p.id));
  const card = (p: TextPreset) => (
    <button key={p.id} className="txp" onClick={() => addElement(placeText(p, doc.width, doc.height))} title={`${p.label}: ${p.hint}`}>
      <PresetArt p={p} />
      <span className="txp-meta"><b>{p.label}</b><span>{p.hint}</span></span>
    </button>
  );
  return (
    <>
      {featured.length > 0 && <><h5 className="pnl-h">Signature styles <span>instant personality</span></h5><div className="txp-list">{featured.map(card)}</div></>}
      {rest.length > 0 && <><h5 className="pnl-h">More type <span>supporting cast</span></h5><div className="txp-list">{rest.map(card)}</div></>}
      {!list.length && <div className="empty">No style called "{q}". Try "hindi", "glossy" or "stats". Or invent one, we won't tell.</div>}
    </>
  );
}

/* ------------------------------ Photos ------------------------------ */

const PHOTO_CHIPS = ["all", "food", "chai", "bake", "cake", "fest", "crowd", "music", "diwali", "wedding", "gym", "office", "laptop", "podcast", "startup", "launch", "city", "portrait", "abstract"];
const QUICK: { label: string; fx: ImageFx }[] = [
  { label: "Halftone", fx: { halftone: { dot: 10, ink: "#111111", paper: "#F2E8D5" } } },
  { label: "Riso", fx: { riso: { inks: ["#1D3FD8", "#FF4FA3"], paper: "#F4EBDD", misreg: 1.5 } } },
  { label: "Duotone", fx: { duotone: { dark: "#141414", light: "#D7191C" } } },
];

export function PhotosTab({ q }: { q: string }) {
  const { addElement, doc } = useEditor();
  const [chip, setChip] = useState("all");
  const list = useMemo(() => {
    // abstract textures go last in "All": lead with real photos
    const base = q.trim() ? searchPhotos(q) : [...PHOTOS.filter((p) => p.topic !== "abstract"), ...PHOTOS.filter((p) => p.topic === "abstract")];
    return chip === "all" ? base : base.filter((p) => p.topic === chip);
  }, [q, chip]);
  const cols: Photo[][] = [[], []];
  const heights = [0, 0];
  list.forEach((p) => { const c = heights[0] <= heights[1] ? 0 : 1; cols[c].push(p); heights[c] += p.h / p.w; });

  const add = (p: Photo, fx?: ImageFx) => {
    const base = makeImage(p.src) as Element;
    const w = Math.min(doc.width * 0.7, doc.height * 0.7 * (p.w / p.h)), h = w * (p.h / p.w);
    addElement({ ...base, w, h, x: (doc.width - w) / 2, y: (doc.height - h) / 2, focus: p.focus, ...(fx ? { fx } : {}) } as Element);
  };

  return (
    <>
      <div className="chips scroll">{PHOTO_CHIPS.map((c) => <button key={c} className={"chip" + (chip === c ? " on" : "")} onClick={() => setChip(c)}>{c === "all" ? "All" : c}</button>)}</div>
      <div className="ph-masonry">
        {cols.map((col, i) => (
          <div key={i} className="ph-col">
            {col.map((p) => (
              <div key={p.src} className="ph-tile" style={{ aspectRatio: `${p.w} / ${p.h}` }}>
                <button className="ph-img" onClick={() => add(p)} title="Add as is"><img src={p.src} loading="lazy" alt={p.topic} /></button>
                <span className="ph-fx">{QUICK.map((x) => <button key={x.label} onClick={() => add(p, x.fx)}>{x.label}</button>)}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
      {!list.length && <div className="empty">No {chip === "all" ? "" : chip + " "}photos for "{q}". The photographer is on chai break.</div>}
      <p className="fx-note">Free photos from Pexels. Hover one: add it plain, or pre-juiced.</p>
    </>
  );
}

/* ------------------------------ Magic ------------------------------ */

export function MagicCards({ q, children }: { q: string; children: { write: React.ReactNode; bg: React.ReactNode } }) {
  const [open, setOpen] = useState<string | null>(null);
  useEffect(() => { if (q.trim()) setOpen(null); }, [q]);
  const cards = [
    { id: "write", icon: <PenLine size={18} />, title: "Magic Write", joke: "Writes copy so you can pretend you did.", tone: "lime", words: "magic write copy text rephrase" },
    { id: "roast", icon: <Flame size={18} />, title: "Roast my design", joke: "Brutally honest. One-click fixes. No therapy included.", tone: "red", words: "roast critique feedback fix" },
    { id: "vibe", icon: <Gauge size={18} />, title: "Vibe slider", joke: "Corporate to Unhinged in one drag.", tone: "pink", words: "vibe slider corporate unhinged tone" },
    { id: "bg", icon: <Eraser size={18} />, title: "Background remover", joke: "Deletes backgrounds, not memories.", tone: "blue", words: "background remover remove bg cutout" },
  ].filter((c) => match(q, c.title, c.words));
  const act = (id: string) => {
    if (id === "roast") window.dispatchEvent(new Event("kiwiw:roast"));
    else if (id === "vibe") window.dispatchEvent(new Event("kiwiw:vibe"));
    else setOpen((o) => (o === id ? null : id));
  };
  return (
    <div className="mg-list">
      {cards.map((c) => (
        <div key={c.id} className={`mg-card t-${c.tone}` + (open === c.id ? " open" : "")}>
          <button className="mg-head" onClick={() => act(c.id)} aria-expanded={open === c.id}>
            <span className="mg-ic">{c.icon}</span>
            <span className="mg-txt"><b>{c.title}</b><span>{c.joke}</span></span>
            <span className="mg-go">{c.id === "roast" || c.id === "vibe" ? "Go →" : open === c.id ? "–" : "+"}</span>
          </button>
          {open === c.id && <div className="mg-body">{c.id === "write" ? children.write : children.bg}</div>}
        </div>
      ))}
      {!cards.length && <div className="empty">No spell called "{q}". We have four: write, roast, vibe, background.</div>}
    </div>
  );
}
