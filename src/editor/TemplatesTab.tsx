// Templates panel (DESIGN.md §15): "My designs" | "Templates" tabs, category
// chips, and a masonry grid where every card follows its design's shape.
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";
import { useEditor } from "../store";
import { TEMPLATES } from "../data/templates";
import type { KiwiwDoc, Template } from "../types";
import Thumb from "./Thumb";
import { removeDesign, useDesigns } from "./autosave";

const CHIPS: { id: string; label: string; test: (t: Template) => boolean }[] = [
  { id: "all", label: "All", test: () => true },
  { id: "posts", label: "Posts", test: (t) => t.category === "Instagram post" },
  { id: "stories", label: "Stories", test: (t) => t.category === "Story" },
  { id: "posters", label: "Posters", test: (t) => t.category === "Poster" && !t.tags?.includes("resume") },
  { id: "slides", label: "Slides", test: (t) => t.category === "Slide" || t.category === "YouTube thumbnail" },
  { id: "banners", label: "Banners", test: (t) => t.category === "LinkedIn banner" },
  { id: "desi", label: "Desi", test: (t) => !!t.tags?.includes("desi") },
  { id: "resumes", label: "Resumes", test: (t) => !!t.tags?.includes("resume") },
];

const SIZE_NAMES: Record<string, string> = {
  "1080x1080": "Post", "1080x1920": "Story", "1080x1350": "Poster", "1280x720": "Thumbnail",
  "1920x1080": "Slide", "1584x396": "LinkedIn banner", "794x1123": "A4",
};
export const sizeLabel = (d: KiwiwDoc) => `${d.width} × ${d.height}${SIZE_NAMES[`${d.width}x${d.height}`] ? ` · ${SIZE_NAMES[`${d.width}x${d.height}`]}` : ""}`;

const match = (q: string, ...hay: (string | undefined)[]) => {
  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  const text = hay.join(" ").toLowerCase();
  return words.every((w) => text.includes(w));
};

export function ago(t: number) {
  const m = Math.floor((Date.now() - t) / 60000);
  if (m < 1) return "edited just now";
  if (m < 60) return `edited ${m} min ago`;
  if (m < 1440) return `edited ${Math.floor(m / 60)} h ago`;
  return m < 2880 ? "edited yesterday" : `edited ${Math.floor(m / 1440)} days ago`;
}

let lastView: "mine" | "templates" = "templates";

export default function TemplatesTab({ q }: { q: string }) {
  const [view, setView] = useState(lastView);
  const [chip, setChip] = useState("all");
  const designs = useDesigns();
  useEffect(() => { lastView = view; }, [view]);

  const chipDef = CHIPS.find((c) => c.id === chip)!;
  const templates = TEMPLATES.filter((t) => chipDef.test(t) && match(q, t.name, t.description, t.category, t.style, ...(t.tags ?? [])));
  const mine = designs.filter((d) => match(q, d.name));

  return (
    <>
      <div className="seg" role="tablist" aria-label="Designs or templates">
        <button role="tab" aria-selected={view === "mine"} className={view === "mine" ? "on" : ""} onClick={() => setView("mine")}>
          My designs <span>{designs.length}</span>
        </button>
        <button role="tab" aria-selected={view === "templates"} className={view === "templates" ? "on" : ""} onClick={() => setView("templates")}>
          Templates <span>{TEMPLATES.length}</span>
        </button>
      </div>

      {view === "templates" ? (
        <>
          <div className="chips">
            {CHIPS.map((c) => (
              <button key={c.id} className={"chip" + (chip === c.id ? " on" : "")} onClick={() => setChip(c.id)}>{c.label}</button>
            ))}
          </div>
          {templates.length ? (
            <TemplateGrid items={templates.map((t) => ({ id: t.id, doc: t.doc, name: t.name, title: t.description }))} />
          ) : (
            <div className="empty">No {chip === "all" ? "" : chipDef.label.toLowerCase() + " "}templates match "{q}". The designers are on chai break.</div>
          )}
        </>
      ) : mine.length ? (
        <TemplateGrid mine items={mine.map((d) => ({ id: d.id, doc: d.doc, name: d.name, updated: d.updated }))} />
      ) : (
        <div className="empty">
          {designs.length ? <>No saved design matches "{q}".</> : <>Nothing saved yet. Edit any template and it lands here on its own. Like a fridge, but for posters.</>}
          {!designs.length && <><br /><button className="btn sm" style={{ marginTop: 12 }} onClick={() => setView("templates")}>Browse templates</button></>}
        </div>
      )}
    </>
  );
}

interface Item { id: string; doc: KiwiwDoc; name: string; title?: string; updated?: number }

const GAP = 10;

/** Masonry: portrait/square cards share a column; landscape spans both; banners get a 2.4:1 card. */
function TemplateGrid({ items, mine }: { items: Item[]; mine?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [W, setW] = useState(288);
  const loadDoc = useEditor((s) => s.loadDoc);
  const current = useEditor((s) => s.designId);
  const [, tick] = useState(0);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => el.clientWidth && setW(el.clientWidth));
    ro.observe(el);
    setW(el.clientWidth || 288);
    return () => ro.disconnect();
  }, []);
  // keep "edited 3 min ago" honest
  useEffect(() => {
    if (!mine) return;
    const t = setInterval(() => tick((n) => n + 1), 30000);
    return () => clearInterval(t);
  }, [mine]);

  const layout = useMemo(() => {
    const col = (W - GAP) / 2;
    const heights = [0, 0];
    const isWide = (it: Item) => it.doc.width / it.doc.height >= 1.3;
    // a full-width card waits until the columns are level, so it never leaves a hole
    const queue = [...items], ordered: Item[] = [];
    const sim = [0, 0];
    while (queue.length) {
      let i = 0;
      if (isWide(queue[0]) && Math.abs(sim[0] - sim[1]) > 40) {
        const j = queue.findIndex((x) => !isWide(x));
        if (j > 0) i = j;
      }
      const [it] = queue.splice(i, 1);
      ordered.push(it);
      const r = it.doc.width / it.doc.height;
      if (isWide(it)) { const y = Math.max(...sim) + W / Math.max(r, 2.4) + GAP; sim[0] = sim[1] = y; }
      else { const c = sim[0] <= sim[1] ? 0 : 1; sim[c] += (col - 16) / r + 16 + GAP; }
    }
    return ordered.map((it) => {
      const r = it.doc.width / it.doc.height;
      const banner = r >= 2.5, wide = r >= 1.3;
      const pad = banner ? 12 : 8;
      const w = wide ? W : col;
      const h = banner ? Math.round(W / 2.4) : Math.round((w - pad * 2) / r + pad * 2);
      let x = 0, y: number;
      if (wide) {
        y = Math.max(...heights);
        heights[0] = heights[1] = y + h + GAP;
      } else {
        const c = heights[0] <= heights[1] ? 0 : 1;
        x = c * (col + GAP);
        y = heights[c];
        heights[c] = y + h + GAP;
      }
      return { it, x, y, w, h, pad };
    });
  }, [items, W]);
  const total = layout.length ? Math.max(...layout.map((l) => l.y + l.h)) : 0;

  return (
    <div ref={ref} className="tgrid" style={{ height: total }}>
      {layout.map(({ it, x, y, w, h, pad }) => (
        <div
          key={it.id}
          role="button"
          tabIndex={0}
          className={"tcard" + (mine ? " mine" : "") + (mine && it.id === current ? " current" : "")}
          style={{ left: x, top: y, width: w, height: h }}
          onClick={() => loadDoc(it.doc, mine ? it.id : undefined)}
          onKeyDown={(e) => e.key === "Enter" && loadDoc(it.doc, mine ? it.id : undefined)}
          title={it.title ? `${it.name}: ${it.title}` : it.name}
        >
          <div className="tcard-frame" style={{ inset: pad }}><Thumb doc={it.doc} /></div>
          <div className="tcard-label">
            <b>{it.name}</b>
            <span>{!mine && it.title ? it.title : sizeLabel(it.doc)}</span>
          </div>
          {mine && it.updated && <span className="tcard-time">{mine && it.id === current ? "editing now" : ago(it.updated)}</span>}
          {mine && (
            <button className="tcard-x" title="Delete this design. It had a good run." aria-label={`Delete ${it.name}`} onClick={(e) => { e.stopPropagation(); removeDesign(it.id); }}>
              <X size={12} />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
