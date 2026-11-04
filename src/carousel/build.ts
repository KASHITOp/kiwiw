// Three LinkedIn carousel styles, filled from one topic line (DESIGN.md §22).
// Gemini writes the points when it's awake; built-in copy otherwise.
import type { Element, KiwiwDoc } from "../types";
import { T, R, S, I, F } from "../data/tpl/dsl";
import { fit, mono } from "../dna/layouts";
import { QUOTE_LAYOUTS } from "../dna/quotes";
import { writeCopy } from "../dna/recipes";
import { parseIdea } from "../juice/parse";
import { photoFor } from "../data/photos";
import { resolveCollisions } from "../dna/collide";

export type CarouselStyle = "lessons" | "stadium" | "jugaad";
export const CAROUSEL_STYLES: { id: CarouselStyle; name: string; joke: string }[] = [
  { id: "lessons", name: "Loud Quotes lessons", joke: "riso posters that teach" },
  { id: "stadium", name: "Stadium: 5 things I learned", joke: "match report for your career" },
  { id: "jugaad", name: "Desi Jugaad tips", joke: "nazar-proof life hacks" },
];

export interface Points { title: string; points: string[]; cta: string }
const W = 1080, H = 1350;
const doc = (background: string, els: (Element | Element[] | null | false)[]): KiwiwDoc => resolveCollisions({ width: W, height: H, background, elements: els.filter(Boolean).flat() as Element[] }).doc;
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Built-in points when AI is away: honest, funny, topic-aware. */
export function builtinPoints(topic: string, style: CarouselStyle): Points {
  const t = topic.trim() || "my first startup";
  if (style === "jugaad") return {
    title: `Jugaad tips for ${t}`,
    points: ["Start with what's already in the house.", "Tape fixes 80% of problems. Rubber bands fix the rest.", "Ask the uncle who has done it before. He will tell you anyway.", "Cheap and working beats perfect and pending.", "Write it down. Even on a chai cup."],
    cta: "Save this for the next crisis",
  };
  return {
    title: style === "stadium" ? `5 things I learned from ${t}` : `Lessons from ${t}`,
    points: [`Nobody cares about ${t} until you show up.`, "Done is better than perfect. Perfect is a myth anyway.", "Ask for help early. Pride is expensive.", "Rest is part of the plan, not a break from it.", "Celebrate small wins. Chai counts."],
    cta: "Follow for part two",
  };
}

/** Ask the server for points; null when Gemini is slow or away. */
export async function aiPoints(topic: string, style: CarouselStyle): Promise<Points | null> {
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 12000);
    const r = await fetch("/api/kiwi-ai", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ task: "carousel", text: topic, style }), signal: ctrl.signal });
    clearTimeout(timer);
    if (r.status !== 200) return null;
    const j = await r.json();
    return j?.title && Array.isArray(j.points) && j.points.length >= 3 ? { title: String(j.title), points: j.points.slice(0, 8).map(String), cta: String(j.cta ?? "Follow for more") } : null;
  } catch { return null; }
}

/* ---------- Loud Quotes lessons ---------- */
function lessons(p: Points): KiwiwDoc[] {
  const base = (line: string) => writeCopy("quotes", parseIdea(line), 0);
  const ph = photoFor(p.title);
  const cover = QUOTE_LAYOUTS[1]({ c: { ...base(p.title), head: p.title, by: `SWIPE →  1/${p.points.length + 2}` }, photo: ph, photo2: ph, seed: 0 });
  const slides = p.points.map((pt, i) => {
    const layout = [3, 4, 0, 3, 4, 1, 3, 4][i % 8];
    return QUOTE_LAYOUTS[layout]({ c: { ...base(pt), head: pt, kicker: `LESSON ${String(i + 1).padStart(2, "0")}`, by: `${i + 2}/${p.points.length + 2} · SWIPE →` }, photo: ph, photo2: ph, seed: i + 1 });
  });
  const end = QUOTE_LAYOUTS[2]({ c: { ...base("house rules"), rules: [p.cta, "Repost if this helped.", "Comment your own lesson.", "Send it to the group chat.", "Drink water. Then chai."] }, photo: ph, photo2: ph, seed: 4 });
  return [cover, ...slides, end];
}

/* ---------- Stadium: things I learned ---------- */
const ST = { red: "#D7191C", cream: "#F2E8D5", ink: "#111111" };
function stadium(p: Points): KiwiwDoc[] {
  const n = p.points.length;
  const ph = photoFor(p.title, 0);
  const cover = doc(ST.red, [
    S("bg-halftone", { x: 0, y: 0, w: W, h: H, fill: "#B01217", accent: ST.red, opacity: 0.8 }),
    I({ x: 80, y: 520, w: 920, h: 600, src: ph.src, focus: ph.focus, fx: { halftone: { dot: 9, ink: ST.ink, paper: ST.cream } }, cutout: { color: "#FFFFFF", width: 12 }, rotation: -2 }),
    fit(p.title.toUpperCase(), F.anton, { x: 60, y: 80, w: 960, h: 400 }, { size: 180, upper: true, color: ST.cream, lh: 0.88, lines: 4, extra: { shadow: { color: ST.ink, x: 8, y: 8 } } }).el,
    S("sp-matchday", { x: 620, y: 1170, w: 400, h: 160, rotation: -6, fill: ST.cream, accent: ST.cream, ink: ST.cream }),
    mono(60, 1230, 520, `SWIPE →  1/${n + 2}`, ST.cream, 26),
  ]);
  const slides = p.points.map((pt, i) => doc(ST.cream, [
    R({ x: 0, y: 0, w: W, h: 120, fill: ST.red }),
    mono(60, 40, 960, `THING ${i + 1} OF ${n} · MATCH REPORT`, ST.cream, 24),
    S(`sp-digit-${Math.floor((i + 1) / 10)}`, { x: 60, y: 200, w: 250, h: 300 }),
    S(`sp-digit-${(i + 1) % 10}`, { x: 330, y: 200, w: 250, h: 300 }),
    fit(pt, F.archivo, { x: 60, y: 580, w: 960, h: 520 }, { size: 120, color: ST.ink, lh: 0.98, lines: 5, extra: { grain: 0.25 } }).el,
    R({ x: 60, y: 1150, w: 960, h: 6, fill: ST.red }),
    mono(60, 1200, 960, `${i + 2}/${n + 2}   ·   STATS MADE UP, LESSON REAL`, ST.ink, 22),
    i === n - 1 ? S("sp-trophy", { x: 820, y: 220, w: 200, h: 200, border: "white" } as Parameters<typeof S>[1]) : S("sp-whistle", { x: 840, y: 240, w: 170, h: 170, border: "white" } as Parameters<typeof S>[1]),
  ]));
  const end = doc(ST.ink, [
    fit("FULL TIME.", F.anton, { x: 60, y: 160, w: 960, h: 300 }, { size: 260, upper: true, color: ST.red, lh: 0.9, lines: 1 }).el,
    fit(p.cta, F.archivo, { x: 60, y: 520, w: 960, h: 360 }, { size: 110, color: ST.cream, lh: 1, lines: 3 }).el,
    S("sp-full-time", { x: 160, y: 960, w: 760, h: 304 }),
  ]);
  return [cover, ...slides, end];
}

/* ---------- Desi Jugaad tips ---------- */
const NZ = { pink: "#F2479B", yellow: "#FFD23F", cobalt: "#1D3FD8", crimson: "#B3122E", cream: "#FBEEDC" };
function jugaad(p: Points): KiwiwDoc[] {
  const n = p.points.length;
  const stripes = (a: string, b: string) => Array.from({ length: 9 }, (_, i) => R({ x: i * 120, y: 0, w: 120, h: H, fill: i % 2 ? a : b }));
  const cover = doc(NZ.pink, [
    stripes(NZ.yellow, NZ.pink),
    S("desi-nimbu-mirchi", { x: 420, y: -30, w: 240, h: 552, cutout: { color: NZ.cream, width: 6 } }),
    fit("जुगाड़", F.rozha, { x: 60, y: 560, w: 960, h: 260 }, { size: 240, align: "center", color: NZ.crimson, lh: 1.1, lines: 1, extra: { outline: { color: NZ.cream, width: 12 }, shadow: { color: "#5E0A1A", x: 10, y: 10 } } }).el,
    fit(cap(p.title), F.khand, { x: 80, y: 860, w: 920, h: 220 }, { size: 96, weight: 700, align: "center", color: NZ.cobalt, lh: 1, lines: 2, extra: { outline: { color: NZ.cream, width: 6 } } }).el,
    S("dp-jugaad", { x: 80, y: 1100, w: 200, h: 200, rotation: -10, border: "white" } as Parameters<typeof S>[1]),
    mono(320, 1200, 680, `SWIPE →  1/${n + 2}`, NZ.crimson, 26),
  ]);
  const slides = p.points.map((pt, i) => doc(NZ.cream, [
    ...Array.from({ length: 5 }, (_, k) => S("desi-evil-eye", { x: k * 240 - 40, y: -60, w: 150, h: 150, opacity: 0.85 })),
    R({ x: 60, y: 200, w: 300, h: 300, fill: NZ.cobalt, radius: 150, cutout: { color: "#FFFFFF", width: 8 } }),
    T({ x: 60, y: 250, w: 300, h: 200, text: String(i + 1), font: F.rozha, size: 200, color: NZ.yellow, align: "center", lineHeight: 1 }),
    mono(400, 300, 620, `TIP ${i + 1} OF ${n}`, NZ.crimson, 28),
    fit(pt, F.baloo, { x: 60, y: 580, w: 960, h: 520 }, { size: 110, weight: 800, color: NZ.crimson, lh: 1.02, lines: 5, extra: { shadow: { color: NZ.yellow, x: 6, y: 6 } } }).el,
    S(["dp-kulhad", "dp-auto", "dp-pressure-cooker", "dp-diya-glow", "dp-jhumka", "dp-truck-flower"][i % 6], { x: 820, y: 1100, w: 200, h: 200, rotation: 8, border: "white" } as Parameters<typeof S>[1]),
    mono(60, 1230, 700, `${i + 2}/${n + 2} · TESTED BY MUMMY`, NZ.cobalt, 22),
  ]));
  const end = doc(NZ.cobalt, [
    S("bg-sunburst", { x: -200, y: -300, w: 1480, h: 1500, fill: "#2B4FF0", accent: NZ.cobalt }),
    fit("बस इतना ही!", F.rozha, { x: 60, y: 200, w: 960, h: 260 }, { size: 200, align: "center", color: NZ.yellow, lh: 1.1, lines: 1, extra: { outline: { color: "#111111", width: 8 } } }).el,
    fit(p.cta, F.baloo, { x: 80, y: 560, w: 920, h: 300 }, { size: 100, weight: 800, align: "center", color: "#FFFFFF", lh: 1.05, lines: 3 }).el,
    S("desi-evil-eye", { x: 440, y: 960, w: 200, h: 200 }),
  ]);
  return [cover, ...slides, end];
}

export function buildCarousel(style: CarouselStyle, p: Points): KiwiwDoc[] {
  const pts = { ...p, points: p.points.slice(0, 8) };
  return style === "stadium" ? stadium(pts) : style === "jugaad" ? jugaad(pts) : lessons(pts);
}
