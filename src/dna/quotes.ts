// Recipe 11 · LOUD QUOTES (STYLE_DNA.md §11). No photos: type is the design.
// Every poster gets the riso finish: paper grain, a misregistered second ink
// (offset shadow) and ink bleed (soft halo). Six layout grammars.
import type { Element, KiwiwDoc, TextElement } from "../types";
import { T, R, S, F } from "../data/tpl/dsl";
import { fit, mono, type Ctx } from "./layouts";

const W = 1080, H = 1350;
type Layout = (x: Ctx) => KiwiwDoc;
const doc = (background: string, els: (Element | Element[] | null | false)[]): KiwiwDoc => ({ width: W, height: H, background, elements: els.filter(Boolean).flat() as Element[] });

/** Riso palette pairs: paper, main ink, second ink. */
export const LQ_PALETTES = [
  { name: "tomato", bg: "#F4E6D0", ink: "#E8402A", ink2: "#1D3FD8" },
  { name: "hot pink", bg: "#FF6FAE", ink: "#C8102E", ink2: "#FFF0F5" },
  { name: "mustard", bg: "#E9B23A", ink: "#6E1423", ink2: "#FFF1D6" },
  { name: "cobalt", bg: "#1F3FD8", ink: "#F6EBD9", ink2: "#FF6FAE" },
  { name: "cream", bg: "#F3EBDD", ink: "#111111", ink2: "#E8402A" },
];
const pal = (seed: number, k: number) => LQ_PALETTES[(seed + k) % LQ_PALETTES.length];
type P = (typeof LQ_PALETTES)[number];

const DEVA = /[ऀ-ॿ]/;
/** Misregistration + bleed + grain on a headline. */
const ink = (p: P, o = 6): Partial<TextElement> => ({ shadow: { color: p.ink2, x: o, y: Math.round(o * 0.8) }, bleed: p.ink, grain: 0.35 });
/** Full-page paper grain + a faint halftone in the second ink. */
const riso = (p: P) => [
  S("texture-grain", { x: 0, y: 0, w: W, h: H, fill: p.ink, opacity: 0.32 }),
];
const by = (c: Ctx["c"], p: P, y = 1250) => mono(60, y, 960, c.by ?? "— KIWIW, 2026", p.ink, 22, "center");

/* A · giant single word, stretched tall (or melting) */
const giant: Layout = ({ c, seed }) => {
  const p = pal(seed, 0);
  const word = (c.word ?? c.noun).toUpperCase();
  const deva = DEVA.test(word);
  const melt = seed % 3 === 1;
  const font = deva ? F.tiro : melt ? F.wet : F.shoulders;
  const g = fit(word, font, { x: 40, y: 250, w: 1000, h: 420 }, { size: 520, upper: !deva, align: "center", color: p.ink, lh: 0.9, lines: 1, weight: font === F.shoulders ? 900 : 400, extra: ink(p, 8) });
  const stretch = Math.min(2.2, 700 / Math.max(1, g.h));
  const gEl = { ...g.el, h: g.h * stretch, stretch, y: 210 } as Element;
  const q = fit(c.head, deva ? F.tiro : F.playfair, { x: 90, y: 210 + g.h * stretch + 110, w: 900, h: 1180 - (210 + g.h * stretch + 110) }, { size: 64, italic: true, weight: 800, align: "center", color: p.ink, lh: 1.08, lines: 3, extra: { bleed: p.ink } });
  return doc(p.bg, [
    mono(60, 120, 960, c.kicker, p.ink, 24, "center"),
    R({ x: 470, y: 170, w: 140, h: 6, fill: p.ink2 }),
    gEl, q.el, by(c, p), riso(p),
  ]);
};

/* B · full-bleed stacked manifesto, condensed caps edge to edge */
const manifesto: Layout = ({ c, seed }) => {
  const p = pal(seed, 1);
  const words = c.head.toUpperCase().replace(/[.,!?]+$/, "").split(/\s+/);
  const lines: string[] = [];
  for (let i = 0; i < words.length;) {
    const two = words[i + 1] && (words[i] + words[i + 1]).length <= 9;
    lines.push(two ? `${words[i]} ${words[i + 1]}` : words[i]);
    i += two ? 2 : 1;
  }
  const rows = lines.slice(0, 7);
  const deva = DEVA.test(c.head);
  const slot = Math.min(380, 1120 / rows.length);
  let y = 0;
  const els = rows.map((line, i) => {
    const f = fit(line, deva ? F.rozha : F.shoulders, { x: 40, y, w: 1000, h: slot }, { size: slot * 1.4, upper: !deva, align: "center", color: i % 2 ? p.ink2 : p.ink, lh: 0.86, lines: 1, weight: 900, extra: i % 2 ? { bleed: p.ink2, grain: 0.35 } : ink(p, 5) });
    y = f.bottom + 6;
    return f.el;
  });
  // centre the stack as it really came out, in the space above the attribution
  const dy = 40 + Math.max(0, (1170 - y) / 2);
  const placed = els.map((e) => ({ ...e, y: e.y + dy }) as Element);
  return doc(p.bg, [placed, by(c, p), riso(p)]);
};

/* C · House Rules: ransom-note header + numbered list */
const houseRules: Layout = ({ c, seed }) => {
  const p = pal(seed, 2);
  const letters: Element[] = [];
  const word = (w: string, y: number, size: number) => {
    const total = w.length * size * 0.92;
    [...w].forEach((ch, i) => {
      const r = ((seed * 7 + i * 13) % 11) - 5;
      letters.push(S(`ty-ransom-${ch.toLowerCase()}`, { x: (W - total) / 2 + i * size * 0.92, y: y + ((i * 17) % 3) * 6, w: size, h: size, rotation: r }));
    });
  };
  word("HOUSE", 60, 150);
  word("RULES", 222, 150);
  const rules = (c.rules ?? []).slice(0, 5);
  const top = 420, gap = (1180 - top) / rules.length;
  const rows = rules.map((r, i) => {
    const y = top + i * gap;
    const t = fit(r, F.kalam, { x: 210, y: y + 4, w: 800, h: gap - 24 }, { size: 52, weight: 700, color: p.ink, lh: 1.08, lines: 2, valign: "center", extra: { bleed: p.ink } });
    return [
      T({ x: 50, y: y + (gap - 100) / 2, w: 150, h: 100, text: String(i + 1).padStart(2, "0"), font: F.bowlby, size: 66, color: p.ink2, align: "center", lineHeight: 1.3, shadow: { color: p.ink, x: 5, y: 4 } }),
      t.el,
      i < rules.length - 1 ? R({ x: 210, y: y + gap - 8, w: 800, h: 3, fill: p.ink, opacity: 0.35 }) : null,
    ].filter(Boolean) as Element[];
  });
  return doc(p.bg, [letters, rows.flat(), mono(60, 1250, 960, "BY ORDER OF THE MANAGEMENT (MUMMY)", p.ink, 22, "center"), riso(p)]);
};

/* D · a sentence with one word shouting (70s groovy, highlighted, wavy) */
const highlight: Layout = ({ c, seed }) => {
  const p = pal(seed, 3);
  const words = c.head.split(/\s+/);
  const key = !c.word ? -1 : words.findIndex((w) => w.toLowerCase().replace(/[^\p{L}\p{M}\p{N}]/gu, "") === c.word!.toLowerCase());
  const k = key >= 0 ? key : words.length - 1;
  const before = words.slice(0, k).join(" "), word = words[k].replace(/[.,!?]+$/, ""), after = words.slice(k + 1).join(" ");
  const deva = DEVA.test(c.head);
  const serif = deva ? F.tiro : F.playfair;
  const b = before ? fit(before, serif, { x: 80, y: 120, w: 920, h: 330 }, { size: 120, italic: !deva, weight: 800, color: p.ink, lh: 1.02, lines: 3, valign: "bottom", align: "center", extra: { bleed: p.ink } }) : null;
  const ky = (b?.bottom ?? 300) + 40;
  const kw = fit(word, deva ? F.rozha : F.capra, { x: 80, y: ky + 30, w: 920, h: 300 }, { size: 300, color: p.ink2 === "#FFF0F5" || p.ink2 === "#FFF1D6" ? p.ink : p.ink2, align: "center", lh: 1.1, lines: 1, extra: { ...ink(p, 7), shadow: { color: p.ink, x: 8, y: 7 }, wave: 28 } });
  const hl = R({ x: (W - kw.w) / 2 - 40, y: kw.y + kw.h * 0.15, w: kw.w + 80, h: kw.h * 0.8, fill: p.ink2 === "#FFF0F5" || p.ink2 === "#FFF1D6" ? p.ink2 : p.bg === "#1F3FD8" ? "#FFE14D" : "#FFE14D", rotation: -2, radius: 8 });
  const a = after ? fit(after, serif, { x: 80, y: kw.bottom + 40, w: 920, h: 1180 - kw.bottom - 40 }, { size: 110, italic: !deva, weight: 800, color: p.ink, lh: 1.02, lines: 3, align: "center", extra: { bleed: p.ink } }) : null;
  return doc(p.bg, [b?.el ?? null, hl, kw.el, a?.el ?? null, by(c, p), riso(p)]);
};

/* E · quote + tiny attribution */
const quote: Layout = ({ c, seed }) => {
  const p = pal(seed, 4);
  const deva = DEVA.test(c.head);
  const q = fit(c.head, deva ? F.tiro : F.gloock, { x: 100, y: 360, w: 880, h: 660 }, { size: 210, color: p.ink, lh: 1.04, lines: 5, valign: "center", extra: ink(p, 4) });
  return doc(p.bg, [
    T({ x: 40, y: -10, w: 460, h: 460, text: "“", font: F.gloock, size: 520, color: p.ink2, lineHeight: 1, opacity: 0.95 }),
    q.el,
    T({ x: 100, y: Math.min(1150, q.bottom + 50), w: 880, h: 100, text: c.by ?? "— kiwi", font: F.vibes, size: 72, color: p.ink, align: "right", lineHeight: 1.2 }),
    mono(100, 1260, 880, c.kicker, p.ink, 20),
    riso(p),
  ]);
};

/* F · Hindi / English bilingual */
const bilingual: Layout = ({ c, seed }) => {
  const p = pal(seed, 0);
  const hi = c.hi ?? c.head;
  const h = fit(hi, F.rozha, { x: 60, y: 120, w: 960, h: 520 }, { size: 230, color: p.ink, align: "center", lh: 1.12, lines: 2, valign: "center", extra: ink(p, 7) });
  const en = fit(c.head.toUpperCase(), F.shoulders, { x: 60, y: 760, w: 960, h: 400 }, { size: 200, upper: true, weight: 900, color: p.ink, align: "center", lh: 0.92, lines: 3, valign: "center", extra: { bleed: p.ink, grain: 0.35 } });
  return doc(p.bg, [
    h.el,
    R({ x: 60, y: 700, w: 960, h: 8, fill: p.ink2 }),
    T({ x: 390, y: 678, w: 300, h: 52, text: "हिंदी  /  ENGLISH", font: F.khand, size: 34, fontWeight: 700, color: p.bg, align: "center", lineHeight: 1.5 }),
    R({ x: 380, y: 680, w: 320, h: 48, fill: p.ink, radius: 24 }),
    en.el,
    mono(60, 1250, 960, "BOTH ARE CORRECT. DON'T ARGUE.", p.ink, 22, "center"),
    riso(p),
  ].map((e, i, arr) => (i === 2 ? arr[3] : i === 3 ? arr[2] : e)));
};

export const QUOTE_LAYOUTS: Layout[] = [giant, manifesto, houseRules, highlight, quote, bilingual];
