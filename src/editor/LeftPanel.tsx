import { useMemo, useRef, useState } from "react";
import { LayoutTemplate, Shapes, Type, Image as ImageIcon, Upload, Sparkles, Search } from "lucide-react";
import { useEditor } from "../store";
import { makeShape, makeImage } from "../data/factory";
import { TEMPLATES } from "../data/templates";
import { TEXT_PRESETS, placeText, makeSticker, type TextPreset } from "../data/presets";
import { STICKER_CATEGORIES, searchStickers, type StickerCategory } from "../stickers/library";
import StickerArt from "../stickers/StickerArt";
import ElementContent from "./ElementContent";
import Thumb from "./Thumb";
import AIPanel from "./AIPanel";
import AssetPanel from "./AssetPanel";
import type { Element, ShapeKind } from "../types";

type Tab = "templates" | "elements" | "text" | "photos" | "uploads" | "ai";

const TABS: { id: Tab; icon: React.ReactNode; label: string }[] = [
  { id: "templates", icon: <LayoutTemplate size={20} />, label: "Design" },
  { id: "text", icon: <Type size={20} />, label: "Text" },
  { id: "elements", icon: <Shapes size={20} />, label: "Stickers" },
  { id: "photos", icon: <ImageIcon size={20} />, label: "Photos" },
  { id: "uploads", icon: <Upload size={20} />, label: "Upload" },
  { id: "ai", icon: <Sparkles size={20} />, label: "Magic" },
];

export default function LeftPanel() {
  const [tab, setTab] = useState<Tab>("templates");
  return (
    <>
      <div className="rail">
        {TABS.map((t) => (
          <button key={t.id} className={tab === t.id ? "active" : ""} onClick={() => setTab(t.id)}>
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>
      <div className="side">
        {tab === "templates" && <TemplatesTab />}
        {tab === "elements" && <StickersTab />}
        {tab === "text" && <TextTab />}
        {tab === "photos" && <AssetPanel />}
        {tab === "uploads" && <UploadTab />}
        {tab === "ai" && <AIPanel />}
      </div>
    </>
  );
}

function TemplatesTab() {
  const loadDoc = useEditor((s) => s.loadDoc);
  return (
    <>
      <h4>Templates</h4>
      <div className="tpl-grid">
        {TEMPLATES.map((t) => (
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

function TextTab() {
  const { addElement, doc } = useEditor();
  return (
    <>
      <h4>Text presets</h4>
      <div className="tp-list">
        {TEXT_PRESETS.map((p) => (
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

function StickersTab() {
  const { addElement, doc } = useEditor();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<StickerCategory | "All">("All");
  const list = useMemo(() => searchStickers(q, cat), [q, cat]);
  const showBasic = cat === "All" && !q.trim();

  return (
    <>
      <h4>Stickers & shapes</h4>
      <div className="st-search">
        <Search size={14} />
        <input id="sticker-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search: burst, tape, diya, kiwi…" />
      </div>
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
      {!list.length && <div className="empty">Nothing matches "{q}". Try "burst", "tape" or "kiwi".</div>}
    </>
  );
}

function UploadTab() {
  const add = useEditor((s) => s.addElement);
  const ref = useRef<HTMLInputElement>(null);
  const [imgs, setImgs] = useState<string[]>([]);

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    Array.from(e.target.files ?? []).forEach((f) => {
      const r = new FileReader();
      r.onload = () => setImgs((p) => [r.result as string, ...p]);
      r.readAsDataURL(f);
    });
  };

  return (
    <>
      <h4>Uploads</h4>
      <button className="btn primary block" style={{ marginBottom: "var(--s-3)" }} onClick={() => ref.current?.click()}>
        <Upload size={16} /> Upload image
      </button>
      <input ref={ref} type="file" accept="image/*" multiple hidden onChange={onFile} />
      <div className="asset-grid">
        {imgs.map((src, i) => (
          <div key={i} className="asset" onClick={() => add(makeImage(src))}>
            <img src={src} />
          </div>
        ))}
      </div>
      {imgs.length === 0 && <div className="empty">Nothing here yet. Drop in a photo and we'll make it juicy.</div>}
    </>
  );
}
