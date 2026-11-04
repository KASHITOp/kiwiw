// Landing v5 sections: the Sticker Drawer and the Magic tools with live demos.
// Every demo runs on the built-in engines (no network), so it's instant.
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import StickerArt from "../stickers/StickerArt";
import { STICKERS } from "../stickers/library";
import Thumb from "../editor/Thumb";
import { TEMPLATES } from "../data/templates";
import { builtinTone, TONES, applyPalette, type Palette } from "../ai/tools";
import { smartResize } from "../ai/resize";
import { useInView } from "./useInView";
import { rng } from "../brand/kiwi";

/* ------------------------------ Sticker drawer ------------------------------ */

const PICKS = [
  "cq-cherries", "cq-lips-glossy", "cq-bow", "cq-heart-glossy", "y2k-disco", "y2k-chrome-sparkle", "dp-horn-ok", "dp-pataka",
  "dp-auto", "dp-kulhad", "ib-error", "ib-404", "km-cool", "km-chai", "km-love", "pp-ticket-admit", "pp-polaroid", "ty-ransom-k",
  "ty-ransom-i", "ty-ransom-w", "ty-delulu", "ty-red-flag", "sp-digit-7", "sp-trophy", "pc-cat-tux", "pc-cat-bengal-ht",
  "y2k-cassette", "dp-evil-eye-string", "cq-envelope", "y2k-butterfly", "ib-cursor-hand", "dp-jugaad", "pp-stamp-heart", "y2k-8ball",
];

interface Piece { kind: string; x: number; y: number; r: number; s: number }
function scatter(seed: number): Piece[] {
  const r = rng(seed);
  return PICKS.map((kind) => ({ kind, x: 6 + r() * 80, y: 8 + r() * 72, r: (r() - 0.5) * 50, s: 0.75 + r() * 0.6 }));
}

export function StickerDrawer() {
  const [ref, inView] = useInView<HTMLElement>("-15% 0px");
  const [seed, setSeed] = useState(7);
  const [open, setOpen] = useState(false);
  const [moved, setMoved] = useState<Record<number, { x: number; y: number }>>({});
  const pile = useMemo(() => scatter(seed), [seed]);
  const box = useRef<HTMLDivElement>(null);
  const drag = useRef<{ i: number; dx: number; dy: number } | null>(null);
  const total = STICKERS.filter((d) => !d.kind.startsWith("bg-")).length;
  useEffect(() => { if (inView) { const t = setTimeout(() => setOpen(true), 150); return () => clearTimeout(t); } }, [inView]);

  const shake = () => { setOpen(false); setMoved({}); setTimeout(() => { setSeed((s) => s + 1); setOpen(true); }, 260); };
  const down = (i: number) => (e: React.PointerEvent) => {
    const b = box.current!.getBoundingClientRect();
    const p = moved[i] ?? { x: pile[i].x, y: pile[i].y };
    drag.current = { i, dx: e.clientX - (b.left + (p.x / 100) * b.width), dy: e.clientY - (b.top + (p.y / 100) * b.height) };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const move = (e: React.PointerEvent) => {
    if (!drag.current) return;
    const b = box.current!.getBoundingClientRect();
    const { i, dx, dy } = drag.current;
    setMoved((m) => ({ ...m, [i]: { x: Math.max(-4, Math.min(94, ((e.clientX - dx - b.left) / b.width) * 100)), y: Math.max(-4, Math.min(90, ((e.clientY - dy - b.top) / b.height) * 100)) } }));
  };

  return (
    <section id="stickers" className="sec sd" ref={ref}>
      <div className="sd-head">
        <div className="sec-head">
          <div className="mono eyebrow">[06] THE STICKER DRAWER · DRAG THEM AROUND</div>
          <h2 className="display sec-h2">A drawer full of chaos.</h2>
          <p className="sec-sub">Coquette lips, Y2K chrome, desi signboards, ransom letters, 12 kiwi moods and actual cats. Every one drawn by us, every one draggable.</p>
        </div>
        <div className="sd-count">
          <b className="display">{total}</b>
          <span className="mono">STICKERS</span>
          <span className="mono">0 LOGOS · 100% LEGAL</span>
        </div>
      </div>
      <div className={"sd-box" + (open ? " open" : "")} ref={box} onPointerMove={move} onPointerUp={() => (drag.current = null)}>
        {pile.map((p, i) => {
          const pos = moved[i] ?? p;
          return (
            <div
              key={`${seed}-${i}`}
              className="sd-piece"
              style={{ left: `${open ? pos.x : 46}%`, top: `${open ? pos.y : 40}%`, ["--r" as string]: `${open ? p.r : 0}deg`, ["--s" as string]: open ? p.s : 0.3, transitionDelay: moved[i] ? "0ms" : `${i * 18}ms` }}
              onPointerDown={down(i)}
            >
              <StickerArt kind={p.kind} fit />
            </div>
          );
        })}
        <div className="sd-actions">
          <button className="k-btn" onClick={shake}>Shake the drawer</button>
          <Link to="/editor" className="k-btn ghost">Open the drawer →</Link>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ Magic tools demos ------------------------------ */

function useTick(ms: number, n: number, on = true) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!on || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((x) => (x + 1) % n), ms);
    return () => clearInterval(t);
  }, [ms, n, on]);
  return i;
}

const LINE = "Bake sale this Saturday";
function WriteDemo({ on }: { on: boolean }) {
  const i = useTick(2200, TONES.length, on);
  const t = TONES[i];
  return (
    <div className="mt-demo mt-write">
      <span className="mono mt-in">{LINE}</span>
      <span className="mt-tone mono">{t.label.toUpperCase()}</span>
      <p key={t.id} className="mt-out">{builtinTone(LINE, t.id)}</p>
    </div>
  );
}

const TRANSLATIONS: [string, string, string][] = [["Chai first, everything later.", "Bricolage Grotesque Variable", "EN"], ["चाय पहले, बाकी बाद में", "Rozha One", "हिंदी"], ["ચા પહેલા, બાકી બધું પછી", "Mukta Vaani", "ગુજરાતી"], ["Chai pehle, baaki sab baad mein", "Bricolage Grotesque Variable", "HINGLISH"]];
function TranslateDemo({ on }: { on: boolean }) {
  const i = useTick(1900, TRANSLATIONS.length, on);
  const [text, font, lang] = TRANSLATIONS[i];
  return (
    <div className="mt-demo mt-tr">
      <span className="mt-tone mono">{lang}</span>
      <p key={i} className="mt-out big" style={{ fontFamily: font, fontWeight: font === "Mukta Vaani" ? 800 : undefined }}>{text}</p>
      <span className="mono mt-in">font switches with the script</span>
    </div>
  );
}

const DEMO_PALETTES: Palette[] = [
  { name: "Monsoon Local", colors: ["#2E3B4E", "#F2F4F0", "#F6C445", "#5FA8A0", "#E85D3F"] },
  { name: "Diya Hour", colors: ["#2A0F2E", "#FFE58A", "#F6A21E", "#D7261E", "#FF6FAE"] },
  { name: "Susegad Sunset", colors: ["#FFE8C7", "#0F4C5C", "#FF7A59", "#2EC4B6", "#FFD166"] },
];
const VIBE_WORDS = ["monsoon in Mumbai", "Diwali at nani's", "Goa at 6pm"];
function PaletteDemo({ on }: { on: boolean }) {
  const base = useMemo(() => TEMPLATES.find((t) => t.id === "lq-sab-ho-jayega")?.doc ?? TEMPLATES[0].doc, []);
  const docs = useMemo(() => DEMO_PALETTES.map((p) => applyPalette(base, p)), [base]);
  const i = useTick(2000, docs.length, on);
  return (
    <div className="mt-demo mt-pal">
      <div className="mt-thumb" style={{ aspectRatio: `${base.width} / ${base.height}` }}><Thumb doc={docs[i]} /></div>
      <div className="mt-side">
        <span className="mono mt-in">"{VIBE_WORDS[i]}"</span>
        <div className="mt-sw">{DEMO_PALETTES[i].colors.map((c) => <i key={c} style={{ background: c }} />)}</div>
        <b className="mt-name">{DEMO_PALETTES[i].name}</b>
      </div>
    </div>
  );
}

const SIZES = [{ w: 1080, h: 1350, l: "POSTER" }, { w: 1080, h: 1920, l: "STORY" }, { w: 1280, h: 720, l: "YOUTUBE" }, { w: 1584, h: 396, l: "LINKEDIN BANNER" }];
function ResizeDemo({ on }: { on: boolean }) {
  const base = useMemo(() => TEMPLATES.find((t) => t.id === "dna-nazar-poster")?.doc ?? TEMPLATES[0].doc, []);
  const docs = useMemo(() => SIZES.map((s) => (s.w === base.width && s.h === base.height ? base : smartResize(base, s.w, s.h))), [base]);
  const i = useTick(1800, SIZES.length, on);
  return (
    <div className="mt-demo mt-rs">
      <div className="mt-stage"><div className="mt-thumb" key={i} style={{ aspectRatio: `${SIZES[i].w} / ${SIZES[i].h}` }}><Thumb doc={docs[i]} /></div></div>
      <span className="mt-tone mono">{SIZES[i].l} · {SIZES[i].w}×{SIZES[i].h}</span>
    </div>
  );
}

function CaptionDemo() {
  return (
    <div className="mt-demo mt-cap">
      <p><b>Instagram</b> crumbs will fall, diets will fail, we accept this. saturday 10am ✦ bring cash, leave sticky.</p>
      <p><b>LinkedIn</b> Thrilled to announce our bake sale. Learnings: butter is a growth strategy. Agree?</p>
      <p className="mono">#bakesale #desidesign #kiwiw #dietkalse</p>
    </div>
  );
}

const TOOLS = [
  { id: "write", title: "Magic Write", joke: "Six tones. Fits the box.", Demo: WriteDemo },
  { id: "translate", title: "Translate", joke: "The font follows the script.", Demo: TranslateDemo },
  { id: "palette", title: "Palette from Vibe", joke: "Type a mood, get the paint.", Demo: PaletteDemo },
  { id: "resize", title: "Magic Resize", joke: "Re-laid out, never stretched.", Demo: ResizeDemo },
  { id: "caption", title: "Caption Writer", joke: "Humility not included.", Demo: CaptionDemo },
] as const;

export function MagicTools() {
  const [ref, inView] = useInView<HTMLElement>("-10% 0px");
  return (
    <section id="magic" className="sec mt" ref={ref}>
      <div className="sec-head">
        <div className="mono eyebrow">[08] MAGIC · 8 SPELLS, NO WAND</div>
        <h2 className="display sec-h2">AI that knows the brief.</h2>
        <p className="sec-sub">Gemini on our server when it's awake, a built-in brain when it isn't. You never wait, and you never paste a key. These demos are running live.</p>
      </div>
      <div className="mt-grid">
        {TOOLS.map(({ id, title, joke, Demo }) => (
          <article key={id} className={"mt-card mt-" + id}>
            <header><b className="display">{title}</b><span className="mono">{joke}</span></header>
            <Demo on={inView} />
          </article>
        ))}
        <Link to="/editor" className="mt-card mt-cta">
          <b className="display">+ Roast, Vibe slider & Background remover</b>
          <span className="mono">open the editor → magic tab</span>
        </Link>
      </div>
    </section>
  );
}
