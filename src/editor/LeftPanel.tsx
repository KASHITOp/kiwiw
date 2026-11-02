import { useEffect, useMemo, useRef, useState } from "react";
import { LayoutTemplate, Shapes, Type, Image as ImageIcon, Upload, Sparkles, Search, Citrus, X } from "lucide-react";
import { useEditor } from "../store";
import { makeShape, makeImage } from "../data/factory";
import { TEMPLATES } from "../data/templates";
import { TEXT_PRESETS, placeText, makeSticker, type TextPreset } from "../data/presets";
import { STICKER_CATEGORIES, searchStickers, type StickerCategory } from "../stickers/library";
import StickerArt from "../stickers/StickerArt";
import ElementContent from "./ElementContent";
import Thumb from "./Thumb";
import { removeDesign, useDesigns } from "./autosave";
import AIPanel from "./AIPanel";
import AssetPanel from "./AssetPanel";
import JuicePanel from "../juice/JuicePanel";
import { DEFAULT_IDEA } from "../juice";
import type { Element, ShapeKind } from "../types";

type Tab = "juice" | "templates" | "text" | "elements" | "photos" | "uploads" | "ai";

// DESIGN.md §15: icons only, labels as instant tooltips, Juice first and glowing.
const TABS: { id: Tab; icon: React.ReactNode; label: string; placeholder: string }[] = [
  { id: "juice", icon: <Citrus size={20} strokeWidth={1.75} />, label: "Juice It", placeholder: "Your boring line, then Enter" },
  { id: "templates", icon: <LayoutTemplate size={20} strokeWidth={1.75} />, label: "Templates", placeholder: "Search: rave, resume, diwali…" },
  { id: "text", icon: <Type size={20} strokeWidth={1.75} />, label: "Text", placeholder: "Search: headline, hinglish, meme…" },
  { id: "elements", icon: <Shapes size={20} strokeWidth={1.75} />, label: "Stickers", placeholder: "Search: burst, tape, diya, kiwi…" },
  { id: "photos", icon: <ImageIcon size={20} strokeWidth={1.75} />, label: "Photos", placeholder: "Search photos: chai, neon, beach…" },
  { id: "uploads", icon: <Upload size={20} strokeWidth={1.75} />, label: "Uploads", placeholder: "Filter your uploads by name" },
  { id: "ai", icon: <Sparkles size={20} strokeWidth={1.75} />, label: "Magic", placeholder: "Search: write, image, background…" },
];

const HINTS: Record<Tab, string> = {
  juice: "6 posters, 0 API keys",
  templates: `${TEMPLATES.length} originals`,
  text: `${TEXT_PRESETS.length} presets`,
  elements: "all hand-drawn",
  photos: "free to use",
  uploads: "yours, obviously",
  ai: "keys optional",
};

export default function LeftPanel() {
  const [tab, setTab] = useState<Tab>("templates");
  const [collapsed, setCollapsed] = useState(false);
  const [queries, setQueries] = useState<Record<Tab, string>>({ juice: DEFAULT_IDEA, templates: "", text: "", elements: "", photos: "", uploads: "", ai: "" });
  const q = queries[tab];
  const setQ = (v: string) => setQueries((s) => ({ ...s, [tab]: v }));
  const searchRef = useRef<HTMLInputElement>(null);

  // "/" focuses the open panel's search; Ctrl+\ collapses the panel (DESIGN.md §14–15)
  useEffect(() => {
    const focus = () => { setCollapsed(false); setTimeout(() => searchRef.current?.focus(), 30); };
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === "\\" || e.code === "Backslash")) { e.preventDefault(); setCollapsed((c) => !c); }
    };
    window.addEventListener("kiwiw:search", focus);
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("kiwiw:search", focus); window.removeEventListener("keydown", onKey); };
  }, []);

  const pick = (id: Tab) => {
    if (id === tab && !collapsed) { setCollapsed(true); return; }
    setTab(id);
    setCollapsed(false);
  };
  const meta = TABS.find((t) => t.id === tab)!;

  return (
    <>
      <nav className="rail" aria-label="Editor sections">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={"rail-btn" + (t.id === "juice" ? " juice" : "") + (tab === t.id && !collapsed ? " active" : "")}
            onClick={() => pick(t.id)}
            aria-label={t.label}
            aria-pressed={tab === t.id && !collapsed}
            data-tip={t.label}
          >
            {t.icon}
          </button>
        ))}
        <span className="rail-spacer" />
        <button className="rail-btn" onClick={() => setCollapsed((c) => !c)} aria-label="Collapse panel" data-tip={collapsed ? "Open panel (Ctrl+\\)" : "Hide panel (Ctrl+\\)"}>
          <span className={"rail-chev" + (collapsed ? " flip" : "")} aria-hidden="true">‹</span>
        </button>
      </nav>
      <aside className={"lp" + (collapsed ? " collapsed" : "")} aria-hidden={collapsed}>
        <div className="lp-inner">
          <header className="lp-head">
            <h2>{meta.label}</h2>
            <span>{HINTS[tab]}</span>
          </header>
          <div className="lp-search">
            <Search size={15} />
            <input
              ref={searchRef}
              id="panel-search"
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") window.dispatchEvent(new CustomEvent("kiwiw:panel-enter", { detail: tab }));
                if (e.key === "Escape") { if (q) setQ(""); else searchRef.current?.blur(); }
              }}
              placeholder={meta.placeholder}
              aria-label={`Search ${meta.label}`}
            />
            {q && <button className="lp-clear" onClick={() => setQ("")} aria-label="Clear search"><X size={13} /></button>}
          </div>
          <div className="lp-body" key={tab}>
            {tab === "juice" && <JuicePanel text={q} setText={setQ} />}
            {tab === "templates" && <TemplatesTab q={q} />}
            {tab === "elements" && <StickersTab q={q} setQ={setQ} />}
            {tab === "text" && <TextTab q={q} />}
            {tab === "photos" && <AssetPanel q={q} />}
            {tab === "uploads" && <UploadTab q={q} />}
            {tab === "ai" && <AIPanel q={q} />}
          </div>
        </div>
      </aside>
    </>
  );
}

const match = (q: string, ...hay: (string | undefined)[]) => {
  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  const text = hay.join(" ").toLowerCase();
  return words.every((w) => text.includes(w));
};

function NoMatch({ q, tryThis }: { q: string; tryThis: string }) {
  return <div className="empty">Nothing matches "{q}". Try {tryThis}. Or don't, we're a panel, not a cop.</div>;
}

function MyDesigns({ q }: { q: string }) {
  const loadDoc = useEditor((s) => s.loadDoc);
  const current = useEditor((s) => s.designId);
  const list = useDesigns().filter((d) => match(q, d.name));
  if (!list.length) return null;
  return (
    <>
      <h4>My designs <span className="count">{list.length}</span></h4>
      <div className="tpl-grid mine">
        {list.map((d) => (
          <div key={d.id} className={"tpl" + (d.id === current ? " current" : "")} onClick={() => loadDoc(d.doc, d.id)} title={`${d.name} · ${ago(d.updated)}`}>
            <Thumb doc={d.doc} />
            <div className="tpl-label"><b>{d.name}</b><span>{d.id === current ? "Editing now" : ago(d.updated)}</span></div>
            <button className="mine-x" title="Delete this design. It had a good run." onClick={(e) => { e.stopPropagation(); removeDesign(d.id); }}><X size={12} /></button>
          </div>
        ))}
      </div>
      <h4 className="sub-h">Templates</h4>
    </>
  );
}

function ago(t: number) {
  const m = Math.round((Date.now() - t) / 60000);
  return m < 1 ? "Just now" : m < 60 ? `${m} min ago` : m < 1440 ? `${Math.round(m / 60)} h ago` : `${Math.round(m / 1440)} d ago`;
}

function TemplatesTab({ q }: { q: string }) {
  const loadDoc = useEditor((s) => s.loadDoc);
  const mine = useDesigns().length > 0;
  const list = TEMPLATES.filter((t) => match(q, t.name, t.description, t.category, t.style, ...(t.tags ?? [])));
  return (
    <>
      <MyDesigns q={q} />
      {!mine && <h4>Templates</h4>}
      {!list.length && <NoMatch q={q} tryThis={'"poster", "desi" or "resume"'} />}
      <div className="tpl-grid">
        {list.map((t) => (
          <div key={t.id} className="tpl" onClick={() => loadDoc(t.doc)} title={t.description ? `${t.name}: ${t.description}` : t.name}>
            <Thumb doc={t.doc} />
            <div className="tpl-label">
              <b>{t.name}</b>
              {t.description && <span>{t.description}</span>}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* ---------------- Text presets ---------------- */

function PresetPreview({ p }: { p: TextPreset }) {
  // Render the real element, scaled to the tile, so the preview *is* the preset.
  const s = Math.min(0.32, 250 / p.el.w, 74 / p.el.h);
  const el = {
    ...p.el, id: "pv", x: 0, y: 0,
    w: p.el.w * s, h: p.el.h * s, fontSize: p.el.fontSize * s, letterSpacing: p.el.letterSpacing * s,
    outline: p.el.outline ? { ...p.el.outline, width: Math.max(1, p.el.outline.width * s) } : p.el.outline,
    shadow: p.el.shadow ? { ...p.el.shadow, x: p.el.shadow.x * s, y: p.el.shadow.y * s } : p.el.shadow,
  } as Element;
  const dark = p.el.color.toUpperCase() === "#FFFFFF";
  return (
    <div className={"tp-art" + (dark ? " dark" : "")}>
      <div style={{ width: el.w, height: el.h, transform: `rotate(${p.el.rotation}deg)`, flex: "none" }}>
        <ElementContent el={el} />
      </div>
    </div>
  );
}

function TextTab({ q }: { q: string }) {
  const { addElement, doc } = useEditor();
  const list = TEXT_PRESETS.filter((p) => match(q, p.label, p.hint, p.el.fontFamily));
  return (
    <>
      {!list.length && <NoMatch q={q} tryThis={'"headline", "hand" or "desi"'} />}
      <div className="tp-list">
        {list.map((p) => (
          <button key={p.id} className="tp" onClick={() => addElement(placeText(p, doc.width, doc.height))} title={p.hint}>
            <PresetPreview p={p} />
            <span className="tp-meta"><b>{p.label}</b><span>{p.hint}</span></span>
          </button>
        ))}
      </div>
    </>
  );
}

/* ---------------- Stickers & shapes ---------------- */

const BASIC: { k: ShapeKind; name: string; svg: React.ReactNode }[] = [
  { k: "rect", name: "Rectangle", svg: <rect x="14" y="22" width="72" height="56" rx="6" /> },
  { k: "ellipse", name: "Circle", svg: <circle cx="50" cy="50" r="34" /> },
  { k: "triangle", name: "Triangle", svg: <path d="M50,16 L86,82 H14Z" /> },
  { k: "line", name: "Line", svg: <rect x="10" y="46" width="80" height="8" rx="4" /> },
];

function StickersTab({ q, setQ }: { q: string; setQ: (v: string) => void }) {
  const { addElement, doc } = useEditor();
  const [cat, setCat] = useState<StickerCategory | "All">("All");
  const list = useMemo(() => searchStickers(q, cat), [q, cat]);
  const showBasic = cat === "All" && !q.trim();

  return (
    <>
      <div className="st-cats">
        {(["All", ...STICKER_CATEGORIES] as const).map((c) => (
          <button key={c} className={"st-cat" + (cat === c ? " on" : "")} onClick={() => setCat(c)}>{c}</button>
        ))}
      </div>
      {showBasic && (
        <>
          <div className="sub-h">Basic shapes</div>
          <div className="st-grid">
            {BASIC.map((b) => (
              <button key={b.k} className="st-tile" title={b.name} onClick={() => addElement(makeShape(b.k, { x: doc.width / 2 - 130, y: doc.height / 2 - 130 }))}>
                <svg viewBox="0 0 100 100" fill="var(--muted)">{b.svg}</svg>
              </button>
            ))}
          </div>
        </>
      )}
      <div className="sub-h">{cat === "All" ? (q.trim() ? `${list.length} found` : "Stickers") : cat}</div>
      <div className="st-grid">
        {list.map((d) => (
          <button key={d.kind} className="st-tile" title={d.name} onClick={() => addElement(makeSticker(d.kind, doc.width, doc.height))}>
            <StickerArt kind={d.kind} fit />
          </button>
        ))}
      </div>
      {!list.length && (
        <div className="empty">
          Nothing matches "{q}". We drew 50 stickers by hand and none of them is that.
          <br /><button className="btn sm" style={{ marginTop: 12 }} onClick={() => setQ("kiwi")}>Show me kiwis</button>
        </div>
      )}
    </>
  );
}

// uploads survive tab switches (not reloads: they're data URLs, and localStorage has feelings)
let UPLOADS: { name: string; src: string }[] = [];

function UploadTab({ q }: { q: string }) {
  const add = useEditor((s) => s.addElement);
  const ref = useRef<HTMLInputElement>(null);
  const [imgs, setImgs] = useState(UPLOADS);
  const shown = imgs.filter((i) => match(q, i.name));

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    Array.from(e.target.files ?? []).forEach((f) => {
      const r = new FileReader();
      r.onload = () => setImgs((p) => (UPLOADS = [{ name: f.name, src: r.result as string }, ...p]));
      r.readAsDataURL(f);
    });
  };

  return (
    <>
      <button className="btn primary block" style={{ marginBottom: "var(--s-3)" }} onClick={() => ref.current?.click()}>
        <Upload size={16} /> Upload image
      </button>
      <input ref={ref} type="file" accept="image/*" multiple hidden onChange={onFile} />
      <div className="asset-grid">
        {shown.map((im, i) => (
          <div key={i} className="asset" onClick={() => add(makeImage(im.src))} title={im.name}>
            <img src={im.src} alt={im.name} />
          </div>
        ))}
      </div>
      {imgs.length === 0 && <div className="empty">Nothing here yet. Upload a photo and we'll make it juicy. Screenshots of the group chat also accepted.</div>}
      {imgs.length > 0 && !shown.length && <NoMatch q={q} tryThis="part of a file name" />}
    </>
  );
}
