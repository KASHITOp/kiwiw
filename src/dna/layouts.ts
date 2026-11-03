// Juice It 2.0 layouts: 3 layout grammars per Style DNA recipe (STYLE_DNA.md),
// 30 in all, each a 1080×1350 poster. Headlines are fitted by real font
// measurement, photos get the recipe's image effect, and every layout uses at
// least two effects from the engine (DESIGN.md §16).
import type { Element, KiwiwDoc, TextElement } from "../types";
import { T, R, S, I, rule, F } from "../data/tpl/dsl";
import { fitText } from "../juice/fit";
import type { Photo } from "../data/photos";
import type { Copy, RecipeKey } from "./recipes";

const W = 1080, H = 1350;
export interface Ctx { c: Copy; photo: Photo; photo2: Photo; seed: number }
type Layout = (x: Ctx) => KiwiwDoc;
type Box = { x: number; y: number; w: number; h: number };
const doc = (background: string, els: (Element | Element[] | null | false)[]): KiwiwDoc => ({ width: W, height: H, background, elements: els.filter(Boolean).flat() as Element[] });

interface FO {
  size: number; lh?: number; lines?: number; upper?: boolean; weight?: number; italic?: boolean; min?: number; track?: number;
  color?: string; align?: "left" | "center" | "right"; valign?: "top" | "center" | "bottom"; extra?: Partial<TextElement>;
}
/** A headline fitted into a box. Returns the element and where it really ended. */
export function fit(text: string, font: string, b: Box, o: FO) {
  const lh = o.lh ?? 1;
  const f = fitText(text, { family: font, maxW: b.w, maxH: b.h, maxSize: o.size, minSize: o.min ?? 14, lineHeight: lh, maxLines: o.lines ?? 3, uppercase: o.upper, weight: o.weight, italic: o.italic, trackingEm: o.track });
  const h = Math.max(f.h, f.size * lh);
  const y = b.y + (o.valign === "bottom" ? b.h - h : o.valign === "center" ? (b.h - h) / 2 : 0);
  const el = T({ x: b.x, y, w: b.w, h, text: f.text, font, size: f.size, lineHeight: lh, color: o.color ?? "#111111", align: o.align ?? "left", fontWeight: o.weight ?? 400, italic: o.italic, letterSpacing: (o.track ?? 0) * f.size, ...o.extra });
  return { el, y, h, size: f.size, w: f.w, bottom: y + h };
}
export const mono = (x: number, y: number, w: number, text: string, color = "#111111", size = 22, align: "left" | "right" | "center" = "left", font: string = F.smono) =>
  T({ x, y, w, h: size * 1.6 * Math.max(1, text.split("\n").length), text, font, size, fontWeight: 700, letterSpacing: size * 0.08, color, align, lineHeight: 1.5 });
const photo = (x: Ctx, b: Box, p: Partial<Element> = {}, which: "photo" | "photo2" = "photo") =>
  I({ ...b, src: x[which].src, focus: x[which].focus, ...(p as object) });

/* ================================ 1 · NAZAR BATTU ================================ */
const NZ = { pink: "#F2479B", yellow: "#FFD23F", cobalt: "#1D3FD8", sky: "#7FB7FF", crimson: "#B3122E", cream: "#FBEEDC" };

const nazarA: Layout = ({ c }) => {
  const stripes = Array.from({ length: 9 }, (_, i) => R({ x: i * 120, y: 0, w: 120, h: H, fill: i % 2 ? NZ.yellow : NZ.pink }));
  const k = fit(c.kicker, F.anton, { x: 60, y: 640, w: 960, h: 220 }, { size: 230, upper: true, align: "center", color: NZ.crimson, lh: 0.95, lines: 1, extra: { outline: { color: NZ.cream, width: 8 } } });
  const h = fit(c.head, F.rozha, { x: 50, y: k.bottom + 10, w: 980, h: 320 }, { size: 260, align: "center", color: NZ.crimson, lh: 1.05, lines: 2, extra: { outline: { color: NZ.cream, width: 10 }, shadow: { color: "#5E0A1A", x: 10, y: 10 } } });
  return doc(NZ.pink, [
    stripes,
    S("desi-nimbu-mirchi", { x: 410, y: -30, w: 260, h: 598, cutout: { color: NZ.cream, width: 6 } }),
    S("desi-nimbu-mirchi", { x: 120, y: -150, w: 150, h: 345, rotation: 6 }),
    S("desi-nimbu-mirchi", { x: 810, y: -170, w: 150, h: 345, rotation: -5 }),
    k.el, h.el,
    R({ x: 140, y: 1190, w: 800, h: 92, fill: NZ.cream, radius: 46, cutout: { color: NZ.crimson, width: 5 } }),
    T({ x: 140, y: 1190, w: 800, h: 92, text: `${c.sub}  ·  ${c.when}`, font: F.khand, size: 34, fontWeight: 700, color: NZ.crimson, align: "center", lineHeight: 1 }),
  ]);
};

const nazarB: Layout = (x) => {
  const { c } = x;
  const eyes: Element[] = [];
  for (let j = 0; j < 6; j++) for (let i = 0; i < 5; i++) eyes.push(S("desi-evil-eye", { x: i * 240 - 60 + (j % 2) * 120, y: j * 250 - 70, w: 170, h: 170, opacity: 0.9 }));
  const h = fit(c.head, F.rozha, { x: 60, y: 900, w: 960, h: 230 }, { size: 200, align: "center", color: NZ.crimson, lh: 1.05, lines: 2, extra: { outline: { color: NZ.cream, width: 12 } } });
  return doc(NZ.cream, [
    eyes,
    photo(x, { x: 240, y: 170, w: 600, h: 600 }, { frame: { kind: "evileye", color: NZ.cobalt, accent: NZ.sky }, fx: { duotone: { dark: "#1A0A3D", light: "#FFC2DE" } }, grain: 0.4 }),
    R({ x: 40, y: 870, w: 1000, h: 440, fill: NZ.cream, radius: 40, opacity: 0.94 }),
    R({ x: 320, y: 830, w: 440, h: 70, fill: NZ.cobalt, radius: 35, rotation: -3 }),
    T({ x: 320, y: 830, w: 440, h: 70, text: c.kicker, font: F.anton, size: 44, color: "#FFFFFF", align: "center", rotation: -3, letterSpacing: 4, lineHeight: 1 }),
    h.el,
    mono(60, 1220, 960, `${c.sub.toUpperCase()}  ·  ${c.when}`, NZ.cobalt, 22, "center"),
  ]);
};

const nazarC: Layout = (x) => {
  const { c } = x;
  const h = fit(c.head, F.rozha, { x: 60, y: 780, w: 960, h: 360 }, { size: 270, color: NZ.yellow, lh: 1.05, lines: 2, extra: { outline: { color: "#111111", width: 10 }, shadow: { color: "#111111", x: 12, y: 12 } } });
  return doc(NZ.cobalt, [
    S("bg-sunburst", { x: -200, y: -300, w: 1480, h: 1500, fill: "#2B4FF0", accent: NZ.cobalt, opacity: 1 }),
    photo(x, { x: 300, y: 120, w: 560, h: 640 }, { rotation: -4, cutout: { color: "#FFFFFF", width: 14 }, fx: { riso: { inks: ["#1D3FD8", "#F2479B"], paper: "#FBEEDC" } } }),
    S("desi-nimbu-mirchi", { x: 860, y: -30, w: 160, h: 368, rotation: -8 }),
    S("desi-evil-eye", { x: 70, y: 130, w: 200, h: 200, rotation: -10 }),
    T({ x: 60, y: 610, w: 600, h: 170, text: c.kicker.split(" ")[0], font: F.anton, size: 190, color: NZ.pink, lineHeight: 0.9, outline: { color: "#111111", width: 8 }, rotation: -6 }),
    h.el,
    T({ x: 60, y: Math.min(1150, h.bottom + 30), w: 960, h: 60, text: c.sub, font: F.khand, size: 44, fontWeight: 700, color: "#FFFFFF" }),
    mono(60, 1250, 700, `${c.when}${c.where ? "  ·  " + c.where : ""}`, NZ.yellow, 22),
    S("desi-evil-eye", { x: 860, y: 1130, w: 170, h: 170, rotation: 12, cutout: { color: "#FFFFFF", width: 6 } }),
  ]);
};

/* ================================ 2 · TAPRI PRINT ================================ */
const TP = { red: "#D62828", teal: "#0F7C7A", saffron: "#F7931E", chalk: "#FFF3D6", ink: "#1A1208", yellow: "#FFD23F" };

const tapriA: Layout = (x) => {
  const { c } = x;
  const h = fit(c.head, F.yatra, { x: 150, y: 200, w: 780, h: 230 }, { size: 170, align: "center", color: TP.red, lh: 1.15, lines: 2, extra: { shadow: { color: TP.yellow, x: 6, y: 6 } } });
  return doc(TP.chalk, [
    R({ x: 0, y: 0, w: W, h: H, fill: "transparent", frame: { kind: "truck", color: TP.red } }),
    T({ x: 150, y: 150, w: 780, h: 50, text: c.kicker, font: F.khand, size: 40, fontWeight: 700, color: TP.teal, align: "center" }),
    h.el,
    photo(x, { x: 260, y: h.bottom + 20, w: 560, h: Math.min(540, 960 - h.bottom) }, { rotation: -3, frame: { kind: "stamp", color: "#FFFDF6" }, fx: { riso: { inks: ["#0F7C7A", "#D62828", "#F7931E"], paper: "#FFF3D6" } } }),
    S("desi-marigold", { x: 150, y: 470, w: 150, h: 150 }),
    S("desi-marigold", { x: 800, y: 860, w: 130, h: 130 }),
    R({ x: 170, y: 1000, w: 740, h: 100, fill: TP.teal, rotation: -2 }),
    fit(c.sub, F.baloo, { x: 190, y: 1005, w: 700, h: 90 }, { size: 46, weight: 800, color: TP.chalk, align: "center", lh: 1, lines: 2, valign: "center", extra: { rotation: -2 } }).el,
    T({ x: 150, y: 1120, w: 780, h: 50, text: `${c.when}  ·  ${c.cta || "SABKE LIYE"}`, font: F.khand, size: 34, fontWeight: 700, color: TP.ink, align: "center" }),
  ]);
};

const tapriB: Layout = (x) => {
  const { c } = x;
  const h = fit(c.head, F.yatra, { x: 80, y: 820, w: 920, h: 240 }, { size: 200, align: "center", color: TP.yellow, lh: 1.15, lines: 2, extra: { outline: { color: TP.ink, width: 10 }, shadow: { color: TP.ink, x: 10, y: 10 } } });
  return doc(TP.teal, [
    S("bg-sunburst", { x: -300, y: -200, w: 1680, h: 1600, fill: TP.saffron, accent: TP.teal }),
    photo(x, { x: 270, y: 160, w: 540, h: 540 }, { radius: 270, cutout: { color: TP.chalk, width: 16 }, fx: { riso: { inks: ["#1A1208", "#D62828"], paper: "#FFF3D6" } } }),
    S("desi-toran", { x: 0, y: 0, w: W, h: 200 }),
    R({ x: 160, y: 720, w: 760, h: 100, fill: TP.red, cutout: { color: TP.ink, width: 6 } }),
    T({ x: 160, y: 720, w: 760, h: 100, text: c.sub, font: F.baloo, size: 50, fontWeight: 800, color: TP.chalk, align: "center", lineHeight: 1 }),
    h.el,
    T({ x: 80, y: 1200, w: 920, h: 60, text: `${c.when}${c.where ? "  ·  " + c.where : ""}`, font: F.khand, size: 38, fontWeight: 700, color: TP.chalk, align: "center" }),
    S("desi-diya", { x: 60, y: 1150, w: 130, h: 130 }), S("desi-diya", { x: 890, y: 1150, w: 130, h: 130 }),
  ]);
};

const tapriC: Layout = (x) => {
  const { c } = x;
  const h = fit(c.head, F.yatra, { x: 70, y: 90, w: 940, h: 300 }, { size: 230, color: TP.red, lh: 1.12, lines: 2 });
  return doc(TP.chalk, [
    R({ x: 0, y: 0, w: W, h: H, fill: TP.chalk, grain: 0.6 }),
    h.el,
    T({ x: 75, y: h.bottom, w: 900, h: 60, text: c.sub, font: F.baloo, size: 46, fontWeight: 800, color: TP.teal }),
    photo(x, { x: 70, y: h.bottom + 90, w: 640, h: 700 }, { rotation: 2, frame: { kind: "torn", color: "#FFFFFF" }, fx: { duotone: { dark: TP.teal, light: TP.yellow } } }),
    S("badge-seal", { x: 720, y: h.bottom + 160, w: 280, h: 280, fill: TP.red, accent: TP.yellow, ink: TP.ink, rotation: 10 }),
    T({ x: 740, y: h.bottom + 250, w: 240, h: 100, text: c.cta || "SABKE LIYE", font: F.khand, size: 40, fontWeight: 700, color: TP.chalk, align: "center", rotation: 10, lineHeight: 1 }),
    R({ x: 0, y: 1210, w: W, h: 140, fill: TP.red, frame: { kind: "truck", color: TP.teal } }),
    T({ x: 0, y: 1245, w: W, h: 70, text: c.when, font: F.khand, size: 40, fontWeight: 700, color: TP.chalk, align: "center" }),
  ]);
};

/* ============================== 3 · STADIUM HALFTONE ============================= */
const ST = { red: "#D7191C", cream: "#F2E8D5", ink: "#111111" };
const stats = (c: Copy) => [
  `${c.topic === "work" ? "ROLE" : "EVENT"}: ${c.plain.toUpperCase().slice(0, 22)}`,
  `WHEN: ${c.when.slice(0, 24)}`,
  c.where ? `WHERE: ${c.where.slice(0, 22)}` : `TYPE: ${c.noun}`,
  `ENTRY: ${c.cta || "OPEN"}`,
].join("\n");

const stadiumA: Layout = (x) => {
  const { c } = x;
  const h = fit(c.head, F.anton, { x: 50, y: 110, w: 980, h: 520 }, { size: 300, upper: true, color: ST.red, lh: 0.9, lines: 3 });
  return doc(ST.cream, [
    T({ x: 54, y: 50, w: 900, h: 50, text: c.manifesto, font: F.instr, size: 44, italic: true, color: ST.ink }),
    h.el,
    R({ x: 620, y: Math.max(h.bottom + 60, 560), w: 420, h: 1290 - Math.max(h.bottom + 60, 560), fill: ST.red }),
    photo(x, { x: 540, y: Math.max(h.bottom + 20, 520), w: 480, h: 1270 - Math.max(h.bottom + 20, 520) }, { fx: { halftone: { dot: 9, ink: ST.ink, paper: null } }, cutout: { color: ST.cream, width: 10 } }),
    mono(54, Math.max(h.bottom + 60, 860), 460, stats(c), ST.ink, 22),
    rule(54, 1180, 400, ST.ink, 4),
    T({ x: 54, y: 1200, w: 420, h: 100, text: c.kicker, font: F.anton, size: 80, color: ST.ink, lineHeight: 1 }),
    S("scribble-x", { x: 860, y: 380, w: 160, h: 160, ink: ST.ink }),
  ]);
};

const stadiumB: Layout = (x) => {
  const { c } = x;
  // headline owns the top; the subject stands in front of its last line only
  const h = fit(c.head, F.anton, { x: 40, y: 50, w: 1000, h: 520 }, { size: 330, upper: true, color: ST.cream, lh: 0.88, lines: 3 });
  // Anton's caps overshoot their 0.88 line box, so the photo starts just below the last line
  const py = Math.max(380, h.bottom + h.size * 0.06);
  return doc(ST.red, [
    S("bg-halftone", { x: 0, y: 650, w: W, h: 700, fill: "#9E0F12", accent: ST.red }),
    h.el,
    photo(x, { x: 300, y: py, w: 700, h: 1140 - py }, { fx: { riso: { inks: ["#111111", "#D7191C"], paper: "#F2E8D5" } }, cutout: { color: "#FFFFFF", width: 14 }, rotation: 2 }),
    R({ x: 40, y: 1150, w: 520, h: 160, fill: ST.ink }),
    mono(60, 1165, 490, stats(c), ST.cream, 20),
    T({ x: 600, y: 1170, w: 440, h: 140, text: c.manifesto.toUpperCase(), font: F.anton, size: 40, color: ST.cream, align: "right", lineHeight: 1.1 }),
  ]);
};

const stadiumC: Layout = (x) => {
  const { c } = x;
  const word = (c.head.split(/[\s.,!]+/).find((w) => w.length >= 3) ?? c.noun).toUpperCase();
  const rows = Array.from({ length: 7 }, (_, i) => T({ x: -20, y: 40 + i * 190, w: 1120, h: 200, text: `${word} ${word} ${word}`, font: F.anton, size: 220, color: i === 3 ? ST.red : "transparent", lineHeight: 0.9, outline: i === 3 ? null : { color: ST.red, width: 3 }, letterSpacing: 4 }));
  return doc(ST.ink, [
    rows,
    photo(x, { x: 230, y: 240, w: 620, h: 860 }, { fx: { halftone: { dot: 11, ink: ST.cream, paper: null, invert: true } }, grain: 0.3 }),
    R({ x: 0, y: 1130, w: W, h: 220, fill: ST.cream }),
    fit(c.head, F.anton, { x: 50, y: 1145, w: 680, h: 120 }, { size: 110, upper: true, color: ST.ink, lh: 0.9, lines: 2 }).el,
    mono(760, 1150, 280, `${c.when}\n${c.where || c.noun}`, ST.red, 20, "right"),
    T({ x: 50, y: 1290, w: 980, h: 40, text: c.manifesto, font: F.instr, size: 34, italic: true, color: ST.ink }),
  ]);
};

/* ================================= 4 · BRUTAL GRID ================================ */
const BG = { red: "#FF2E1F", blue: "#1F3BFF", ink: "#0A0A0A", paper: "#F4F1EA" };
const grid = (color: string) => [270, 540, 810].map((gx) => R({ x: gx, y: 0, w: 2, h: H, fill: color, opacity: 0.35 }));

const brutalA: Layout = (x) => {
  const { c } = x;
  const h = fit(c.head, F.archivo, { x: 40, y: 120, w: 1000, h: 520 }, { size: 230, upper: true, color: BG.ink, lh: 0.92, lines: 4 });
  return doc(BG.paper, [
    grid(BG.ink),
    mono(40, 40, 500, c.kicker, BG.ink, 18), mono(540, 40, 500, "KIWIW / 2026", BG.ink, 18, "right"),
    rule(40, 90, 1000, BG.ink, 3),
    h.el,
    R({ x: 40, y: 700, w: 500, h: 290, fill: BG.red }),
    T({ x: 60, y: 715, w: 460, h: 60, text: "01", font: F.archivo, size: 54, color: BG.paper }),
    T({ x: 60, y: 790, w: 460, h: 190, text: c.when, font: F.archivo, size: 48, color: BG.paper, lineHeight: 1.05 }),
    R({ x: 40, y: 990, w: 500, h: 290, fill: BG.blue }),
    T({ x: 60, y: 1005, w: 460, h: 60, text: "02", font: F.archivo, size: 54, color: BG.paper }),
    T({ x: 60, y: 1080, w: 460, h: 190, text: (c.where || c.sub).toUpperCase(), font: F.archivo, size: 44, color: BG.paper, lineHeight: 1.05 }),
    photo(x, { x: 540, y: 700, w: 500, h: 580 }, { fx: { riso: { inks: ["#0A0A0A", "#FF2E1F"], paper: "#F4F1EA" } } }),
    S("arrow-straight", { x: 600, y: 640, w: 260, h: 80, ink: BG.red, fill: BG.red }),
    mono(40, 1300, 1000, `03 — ${c.sub.toUpperCase()}`, BG.ink, 18),
  ]);
};

const brutalB: Layout = (x) => {
  const { c } = x;
  const h = fit(c.head, F.archivo, { x: 40, y: 100, w: 1000, h: 560 }, { size: 260, upper: true, color: BG.red, lh: 0.9, lines: 4, extra: { outline: { color: BG.paper, width: 6 } } });
  return doc(BG.blue, [
    grid(BG.paper),
    mono(40, 36, 1000, `${c.kicker}    /    ISSUED ${new Date(2026, 10, 2).getFullYear()}    /    PAGE 01`, BG.paper, 16),
    h.el,
    photo(x, { x: 40, y: Math.min(720, h.bottom + 60), w: 500, h: 1280 - Math.min(720, h.bottom + 60) }, { fx: { duotone: { dark: BG.ink, light: BG.paper } }, cutout: { color: BG.paper, width: 8 } }),
    T({ x: 580, y: Math.min(730, h.bottom + 70), w: 460, h: 300, text: `01. ${c.when}\n02. ${(c.where || "SEE YOU THERE").slice(0, 26)}\n03. ${c.sub.slice(0, 30)}`, font: F.smono, size: 26, fontWeight: 700, color: BG.paper, lineHeight: 1.6 }),
    R({ x: 580, y: 1130, w: 460, h: 150, fill: BG.red, grain: 0.5 }),
    T({ x: 580, y: 1130, w: 460, h: 150, text: c.cta || "SHOW UP.", font: F.archivo, size: 58, color: BG.paper, align: "center", lineHeight: 1 }),
  ]);
};

const brutalC: Layout = (x) => {
  const { c } = x;
  return doc(BG.paper, [
    photo(x, { x: 0, y: 0, w: W, h: 700 }, { fx: { bw: true }, grain: 0.5 }),
    R({ x: 40, y: 470, w: 1000, h: 300, fill: BG.red }),
    fit(c.head, F.archivo, { x: 70, y: 490, w: 940, h: 260 }, { size: 150, upper: true, color: BG.paper, lh: 0.92, lines: 3, valign: "center" }).el,
    R({ x: 40, y: 800, w: 320, h: 420, fill: BG.ink }), R({ x: 380, y: 800, w: 320, h: 420, fill: BG.blue }), R({ x: 720, y: 800, w: 320, h: 420, fill: BG.paper, strokeWidth: 3, stroke: BG.ink }),
    T({ x: 60, y: 820, w: 280, h: 80, text: "01", font: F.archivo, size: 70, color: BG.red }),
    T({ x: 60, y: 930, w: 280, h: 260, text: c.when.replace(/ · /g, "\n"), font: F.archivo, size: 38, color: BG.paper, lineHeight: 1.1 }),
    T({ x: 400, y: 820, w: 280, h: 80, text: "02", font: F.archivo, size: 70, color: BG.paper }),
    T({ x: 400, y: 930, w: 280, h: 260, text: (c.where || c.noun).toUpperCase(), font: F.archivo, size: 38, color: BG.paper, lineHeight: 1.1 }),
    T({ x: 740, y: 820, w: 280, h: 80, text: "03", font: F.archivo, size: 70, color: BG.blue }),
    T({ x: 740, y: 930, w: 280, h: 260, text: c.sub.toUpperCase(), font: F.archivo, size: 34, color: BG.ink, lineHeight: 1.1 }),
    mono(40, 1260, 1000, `${c.kicker} — KIWIW PRESS — NO NOISE. JUST NEWS.`, BG.ink, 18),
  ]);
};

/* ================================== 5 · SWISS DROP ================================ */
const SW = { red: "#E30613", paper: "#EFEDE6", ink: "#141414" };
const timeline = (y: number, color: string, active: number) => [
  rule(60, y, 960, color, 2),
  ...Array.from({ length: 12 }, (_, i) => T({ x: 60 + i * 84, y: y + 12, w: 60, h: 30, text: String(i + 1).padStart(2, "0"), font: F.smono, size: 18, fontWeight: 700, color: i === active ? SW.red : color, allowOverlap: true })),
];

const swissA: Layout = (x) => {
  const { c } = x;
  const word = c.head.replace(/[^A-Z0-9 ]/gi, "").split(" ").sort((a, b) => b.length - a.length)[0]?.toUpperCase().slice(0, 8) || "NEW";
  const half = Math.ceil(word.length / 2);
  return doc(SW.paper, [
    T({ x: -60, y: 40, w: 1300, h: 560, text: word.slice(0, half), font: F.archivo, size: 560, color: SW.red, lineHeight: 0.85 }),
    T({ x: 1080 - 1240, y: 720, w: 1300, h: 560, text: word.slice(half) || word, font: F.archivo, size: 560, color: SW.red, lineHeight: 0.85, align: "right" }),
    timeline(640, SW.ink, (x.seed % 12)),
    S("figure-walker", { allowOverlap: true, x: 470, y: 520, w: 64, h: 128 }),
    mono(60, 40, 400, c.kicker, SW.ink, 18),
    R({ x: 640, y: 30, w: 400, h: 110, fill: SW.paper }),
    T({ x: 650, y: 36, w: 380, h: 100, text: `${c.plain}\n${c.sub}`, font: F.inter, size: 24, fontWeight: 600, color: SW.ink, align: "right", lineHeight: 1.3 }),
    mono(60, 1270, 960, `${c.when}${c.where ? "  /  " + c.where : ""}`, SW.ink, 18),
    photo(x, { x: 60, y: 1050, w: 160, h: 200 }, { fx: { bw: true }, cutout: { color: "#FFFFFF", width: 5 }, rotation: -4 }),
  ]);
};

const swissB: Layout = (x) => {
  const { c } = x;
  const letter = (c.head.match(/[A-Z0-9]/i)?.[0] ?? "K").toUpperCase();
  return doc(SW.paper, [
    T({ x: -120, y: -260, w: 1400, h: 1500, text: letter, font: F.archivo, size: 1500, color: SW.ink, lineHeight: 0.9, grain: 0.35 }),
    photo(x, { x: 640, y: 300, w: 300, h: 300 }, { radius: 150, fx: { bw: true }, cutout: { color: SW.paper, width: 10 } }),
    R({ x: 880, y: 250, w: 90, h: 90, fill: SW.red, shape: "ellipse" }),
    fit(c.head, F.archivo, { x: 60, y: 1010, w: 700, h: 170 }, { size: 90, upper: true, color: SW.red, lh: 0.95, lines: 2 }).el,
    T({ x: 60, y: 1200, w: 700, h: 80, text: c.sub, font: F.inter, size: 30, fontWeight: 500, color: SW.ink, lineHeight: 1.3 }),
    mono(780, 1050, 240, `${c.when.replace(/ · /g, "\n")}\n${c.where}`, SW.ink, 18, "right"),
    mono(60, 50, 960, `${c.kicker}                                                   ${new Date(2026, 0, 1).getFullYear()}`, SW.ink, 16),
  ]);
};

const swissC: Layout = (x) => {
  const { c } = x;
  const word = (c.head.replace(/[^A-Z ]/gi, "").split(" ").find((w) => w.length >= 3) ?? c.noun).toUpperCase().slice(0, 5);
  return doc(SW.ink, [
    ...[...word].map((ch, i) => T({ x: -30, y: -60 + i * 300, w: 700, h: 340, text: ch, font: F.archivo, size: 380, color: i % 2 ? SW.paper : SW.red, lineHeight: 0.9 })),
    S("figure-walker", { allowOverlap: true, x: 400, y: 70, w: 70, h: 140, fill: SW.paper }),
    ...Array.from({ length: 10 }, (_, i) => T({ x: 930, y: 60 + i * 120, w: 100, h: 30, text: String(2016 + i), font: F.smono, size: 18, fontWeight: 700, color: i === 9 ? SW.red : "#8A8A8A", align: "right" })),
    rule(900, 60, 2, "#8A8A8A", 1),
    photo(x, { x: 560, y: 520, w: 320, h: 420 }, { fx: { duotone: { dark: SW.ink, light: SW.red } }, frame: { kind: "torn", color: SW.paper } }),
    fit(c.plain, F.inter, { x: 560, y: 980, w: 340, h: 160 }, { size: 52, color: SW.paper, lh: 1.05, lines: 3, weight: 700 }).el,
    mono(560, 1160, 340, `${c.when}\n${c.where}`, "#BDBDBD", 16),
  ]);
};

/* ================================ 6 · TRIPPY WINDOW =============================== */
const TW = { pink: "#FF4FA3", sun: "#FFC72C", grape: "#6B3FD8", sky: "#3FA9FF", red: "#E8322E", cream: "#FFF1DE", ink: "#111111" };

const trippyA: Layout = ({ c, seed }) => {
  const h = fit(c.head, F.shri, { x: 150, y: 470, w: 780, h: 330 }, { size: 120, color: TW.ink, lh: 1.05, lines: 3, valign: "center" });
  return doc(TW.cream, [
    S("bg-swirl", { x: 0, y: 0, w: W, h: H, fill: TW.pink, accent: TW.sun, ink: TW.grape }),
    R({ x: 110, y: 360, w: 860, h: 520, fill: "transparent", rotation: -3, frame: { kind: "window", color: TW.red, accent: TW.cream, title: c.kicker } }),
    { ...h.el, rotation: -3 } as Element,
    R({ x: 520, y: 930, w: 470, h: 250, fill: "transparent", rotation: 4, frame: { kind: "window", color: TW.sky, accent: "#FFFFFF", title: "reminder.txt" } }),
    T({ x: 545, y: 1010, w: 420, h: 150, text: `${c.when}\n${c.where || c.sub}`, font: F.smono, size: 24, fontWeight: 700, color: TW.ink, rotation: 4, lineHeight: 1.5 }),
    S("burst-sparkle", { x: 80, y: 200, w: 140, h: 140, fill: TW.sun }),
    S("scribble-star", { x: 120 + (seed % 3) * 10, y: 1000, w: 180, h: 180, ink: TW.ink }),
  ]);
};

const trippyB: Layout = (x) => {
  const { c } = x;
  const h = fit(c.head, F.shri, { x: 60, y: 60, w: 960, h: 300 }, { size: 140, color: TW.cream, lh: 1.05, lines: 2, align: "center", extra: { outline: { color: TW.ink, width: 8 }, shadow: { color: TW.ink, x: 8, y: 8 }, wave: 45 } });
  return doc(TW.pink, [
    S("bg-checker", { x: 0, y: 0, w: W, h: H, fill: "#C8102E", accent: "#F7B2C4" }),
    h.el,
    photo(x, { x: 160, y: h.bottom + 40, w: 760, h: 700 }, { rotation: -2, frame: { kind: "window", color: TW.sun, accent: TW.cream, title: `${c.noun.toLowerCase()}.jpg` }, fx: { riso: { inks: ["#6B3FD8", "#FF4FA3", "#FFC72C"], paper: "#FFF1DE" } } }),
    R({ x: 190, y: 1200, w: 700, h: 90, fill: TW.cream, radius: 45, cutout: { color: TW.ink, width: 5 } }),
    T({ x: 190, y: 1200, w: 700, h: 90, text: `${c.when}${c.where ? " · " + c.where : ""}`, font: F.smono, size: 26, fontWeight: 700, color: TW.ink, align: "center", lineHeight: 1 }),
  ]);
};

const trippyC: Layout = (x) => {
  const { c } = x;
  const h = fit(c.head, F.shri, { x: 60, y: 80, w: 960, h: 480 }, { size: 240, color: TW.grape, lh: 1.02, lines: 3, extra: { wave: 70, shadow: { color: TW.sun, x: 8, y: 8 } } });
  return doc(TW.cream, [
    S("bg-swirl", { x: -100, y: 560, w: 1280, h: 900, fill: TW.sky, accent: TW.pink, ink: TW.sun }),
    h.el,
    T({ x: 66, y: h.bottom + 10, w: 900, h: 50, text: c.sub, font: F.smono, size: 28, fontWeight: 700, color: TW.ink }),
    photo(x, { x: 90, y: 680, w: 480, h: 560 }, { rotation: -5, frame: { kind: "polaroid", title: "manifested" }, grain: 0.3 }),
    R({ x: 580, y: 820, w: 430, h: 320, fill: "transparent", rotation: 3, frame: { kind: "window", color: TW.pink, accent: TW.cream, title: "you_have_1_invite" } }),
    T({ x: 600, y: 920, w: 390, h: 200, text: `${c.when}\n\n${c.where || "location: vibes"}`, font: F.smono, size: 24, fontWeight: 700, color: TW.ink, rotation: 3, lineHeight: 1.3 }),
  ]);
};

/* ================================ 7 · NEO BRUTAL POP ============================== */
const NB = { yellow: "#FFE14D", ink: "#111111", white: "#FFFFFF", pink: "#FF6FB5", lime: "#B6F23A" };
const card = (b: Box, fill: string, rot = 0, r = 26) => R({ ...b, fill, radius: r, stroke: NB.ink, strokeWidth: 6, rotation: rot });
const hard = (b: Box, rot = 0, r = 26) => R({ x: b.x + 14, y: b.y + 14, w: b.w, h: b.h, fill: NB.ink, radius: r, rotation: rot });

const neoA: Layout = (x) => {
  const { c } = x;
  const hb = { x: 70, y: 110, w: 940, h: 420 };
  const h = fit(c.head, F.archivo, { x: 110, y: 200, w: 860, h: 300 }, { size: 150, color: NB.ink, lh: 0.95, lines: 3, valign: "center" });
  return doc(NB.yellow, [
    S("bg-pixel", { x: 0, y: 0, w: W, h: H, fill: NB.yellow, accent: NB.ink, ink: NB.ink, opacity: 0.25 }),
    hard(hb), card(hb, NB.white),
    T({ x: 110, y: 140, w: 600, h: 50, text: `● ${c.kicker}`, font: F.smono, size: 26, fontWeight: 700, color: NB.ink }),
    h.el,
    hard({ x: 70, y: 590, w: 560, h: 560 }, -2), photo(x, { x: 70, y: 590, w: 560, h: 560 }, { radius: 26, rotation: -2, cutout: { color: NB.ink, width: 6 }, fx: { duotone: { dark: "#111111", light: "#FFF4D6" } }, grain: 0.25 }),
    hard({ x: 680, y: 640, w: 330, h: 120 }), card({ x: 680, y: 640, w: 330, h: 120 }, NB.pink),
    T({ x: 680, y: 640, w: 330, h: 120, text: c.cta, font: F.archivo, size: 34, color: NB.ink, align: "center", lineHeight: 1 }),
    hard({ x: 680, y: 800, w: 330, h: 350 }), card({ x: 680, y: 800, w: 330, h: 350 }, NB.lime),
    T({ x: 705, y: 830, w: 280, h: 300, text: `${c.when.replace(/ · /g, "\n")}\n\n${c.where}`, font: F.smono, size: 26, fontWeight: 700, color: NB.ink, lineHeight: 1.35 }),
    S("burst-12", { x: 900, y: 60, w: 150, h: 150, fill: NB.pink, ink: NB.ink }),
    T({ x: 900, y: 60, w: 150, h: 150, text: "1", font: F.archivo, size: 70, color: NB.white, align: "center", lineHeight: 1 }),
    mono(70, 1220, 940, c.sub, NB.ink, 24),
  ]);
};

const neoB: Layout = (x) => {
  const { c } = x;
  const h = fit(c.head, F.archivo, { x: 120, y: 330, w: 840, h: 320 }, { size: 130, color: NB.ink, lh: 0.95, lines: 3, valign: "center" });
  return doc(NB.lime, [
    hard({ x: 80, y: 180, w: 920, h: 560 }), card({ x: 80, y: 180, w: 920, h: 560 }, NB.white),
    photo(x, { x: 120, y: 220, w: 90, h: 90 }, { radius: 45, cutout: { color: NB.ink, width: 4 } }),
    T({ x: 230, y: 230, w: 600, h: 40, text: "Kiwiw · now", font: F.smono, size: 26, fontWeight: 700, color: NB.ink }),
    T({ x: 230, y: 270, w: 600, h: 40, text: c.kicker, font: F.inter, size: 26, fontWeight: 600, color: "#555555" }),
    h.el,
    T({ x: 120, y: 660, w: 840, h: 50, text: c.when, font: F.smono, size: 26, fontWeight: 700, color: NB.ink }),
    hard({ x: 80, y: 800, w: 440, h: 140 }), card({ x: 80, y: 800, w: 440, h: 140 }, NB.yellow),
    T({ x: 80, y: 800, w: 440, h: 140, text: c.cta, font: F.archivo, size: 40, color: NB.ink, align: "center", lineHeight: 1 }),
    hard({ x: 560, y: 800, w: 440, h: 140 }), card({ x: 560, y: 800, w: 440, h: 140 }, NB.white),
    T({ x: 560, y: 800, w: 440, h: 140, text: "OBVIOUSLY", font: F.archivo, size: 40, color: NB.ink, align: "center", lineHeight: 1 }),
    photo(x, { x: 300, y: 1000, w: 480, h: 300 }, { radius: 26, rotation: 3, cutout: { color: NB.ink, width: 6 }, fx: { duotone: { dark: "#111111", light: "#FFF4D6" } }, grain: 0.25 }),
    S("arrow-loop", { x: 60, y: 1000, w: 220, h: 200, ink: NB.ink, rotation: -10 }),
    S("badge-pill", { x: 790, y: 1060, w: 230, h: 100, fill: NB.pink, ink: NB.ink, rotation: -8 }),
    T({ x: 790, y: 1060, w: 230, h: 100, text: "NEW", font: F.archivo, size: 40, color: NB.ink, align: "center", rotation: -8, lineHeight: 1 }),
  ]);
};

const neoC: Layout = (x) => {
  const { c } = x;
  const h = fit(c.head, F.archivo, { x: 60, y: 70, w: 960, h: 520 }, { size: 210, upper: true, color: NB.yellow, lh: 0.92, lines: 4, extra: { outline: { color: NB.ink, width: 10 }, shadow: { color: NB.ink, x: 14, y: 14 } } });
  return doc(NB.pink, [
    h.el,
    hard({ x: 150, y: 640, w: 560, h: 540 }, 4), photo(x, { x: 150, y: 640, w: 560, h: 540 }, { radius: 30, rotation: 4, cutout: { color: NB.ink, width: 7 }, fx: { duotone: { dark: "#111111", light: "#FFF4D6" } }, grain: 0.25 }),
    ...[c.when, c.where || c.noun, c.cta].filter(Boolean).map((t, i) => [
      hard({ x: 650, y: 690 + i * 150, w: 380, h: 110 }, 0, 55), card({ x: 650, y: 690 + i * 150, w: 380, h: 110 }, i === 1 ? NB.lime : NB.white, 0, 55),
      T({ x: 670, y: 690 + i * 150, w: 340, h: 110, text: t.slice(0, 26), font: F.smono, size: 26, fontWeight: 700, color: NB.ink, align: "center", lineHeight: 1.1 }),
    ]).flat(),
    mono(60, 1250, 960, c.sub, NB.ink, 26),
  ]);
};

/* ================================== 8 · 8-BIT FLEX ================================ */
const PX = { night: "#120B2E", pink: "#FF3EA5", coin: "#FFD400", slime: "#5CFF5C", cyan: "#3FE0FF" };

const pixelA: Layout = (x) => {
  const { c } = x;
  const h = fit(c.head, F.press, { x: 50, y: 150, w: 980, h: 330 }, { size: 120, color: PX.coin, lh: 1.25, lines: 3, align: "center", valign: "center", extra: { shadow: { color: PX.pink, x: 8, y: 8 } } });
  return doc(PX.night, [
    S("bg-pixel", { x: 0, y: 0, w: W, h: H, fill: PX.night, accent: PX.coin, ink: PX.pink }),
    R({ x: 40, y: 40, w: 1000, h: 80, fill: PX.pink }),
    T({ x: 60, y: 40, w: 600, h: 80, text: c.kicker, font: F.press, size: 30, color: PX.night, lineHeight: 1 }),
    T({ x: 500, y: 40, w: 520, h: 80, text: "♥ ♥ ♥", font: F.press, size: 30, color: PX.night, align: "right", lineHeight: 1 }),
    h.el,
    R({ x: 230, y: 500, w: 620, h: 580, fill: PX.cyan, stroke: "#FFFFFF", strokeWidth: 8 }),
    photo(x, { x: 250, y: 520, w: 580, h: 540 }, { fx: { riso: { inks: ["#120B2E", "#FF3EA5"], paper: "#3FE0FF" } }, grain: 0.2 }),
    S("pixel-star", { x: 70, y: 560, w: 150, h: 150 }), S("pixel-heart", { x: 860, y: 900, w: 160, h: 144 }),
    R({ x: 240, y: 1110, w: 600, h: 110, fill: PX.slime, stroke: PX.night, strokeWidth: 6 }),
    T({ x: 240, y: 1110, w: 600, h: 110, text: c.sub, font: F.press, size: 34, color: PX.night, align: "center", lineHeight: 1 }),
    T({ x: 60, y: 1250, w: 960, h: 50, text: c.when, font: F.press, size: 22, color: "#FFFFFF", align: "center", lineHeight: 1.4 }),
  ]);
};

const pixelB: Layout = (x) => {
  const { c } = x;
  const h = fit(c.head, F.press, { x: 60, y: 130, w: 960, h: 360 }, { size: 96, color: "#FFFFFF", lh: 1.25, lines: 3, extra: { shadow: { color: PX.cyan, x: 8, y: 8 } } });
  return doc(PX.night, [
    S("bg-pixel", { x: 0, y: 0, w: W, h: H, fill: PX.night, accent: PX.slime, ink: PX.cyan }),
    T({ x: 60, y: 60, w: 960, h: 40, text: `${c.kicker} — PLAYER 2 HAS JOINED`, font: F.press, size: 20, color: PX.slime }),
    h.el,
    ...Array.from({ length: 10 }, (_, i) => R({ x: 60 + i * 64, y: h.bottom + 40, w: 54, h: 40, fill: i < 7 ? PX.pink : "#3A2A6B" })),
    T({ x: 720, y: h.bottom + 40, w: 300, h: 40, text: "HP 70%", font: F.press, size: 20, color: PX.pink, align: "right" }),
    photo(x, { x: 60, y: h.bottom + 130, w: 520, h: 620 }, { fx: { riso: { inks: ["#120B2E", "#FF3EA5"], paper: "#3FE0FF" } }, cutout: { color: "#FFFFFF", width: 8 } }),
    T({ x: 620, y: h.bottom + 140, w: 400, h: 400, text: `MISSION:\n${c.plain.toUpperCase().slice(0, 28)}\n\nWHEN:\n${c.when}\n\nWHERE:\n${(c.where || "ONLINE").slice(0, 20)}`, font: F.press, size: 20, color: "#FFFFFF", lineHeight: 1.6 }),
    S("pixel-heart", { x: 860, y: 1130, w: 150, h: 135 }),
    S("pixel-star", { x: 660, y: 1140, w: 120, h: 120 }),
  ]);
};

const pixelC: Layout = (x) => {
  const { c } = x;
  return doc(PX.pink, [
    S("bg-checker", { x: 0, y: 0, w: W, h: H, fill: "#E62E8F", accent: PX.pink, opacity: 1 }),
    R({ x: 90, y: 110, w: 900, h: 1130, fill: PX.night, stroke: "#FFFFFF", strokeWidth: 10, cutout: { color: PX.night, width: 8 } }),
    T({ x: 120, y: 150, w: 840, h: 60, text: `HI-SCORE  ${String(9000 + (x.seed % 999)).padStart(6, "0")}`, font: F.press, size: 26, color: PX.coin, align: "center" }),
    fit(c.head, F.press, { x: 130, y: 230, w: 820, h: 260 }, { size: 96, color: PX.slime, lh: 1.25, lines: 3, align: "center", valign: "center", extra: { shadow: { color: PX.pink, x: 6, y: 6 } } }).el,
    photo(x, { x: 250, y: 500, w: 580, h: 520 }, { fx: { riso: { inks: ["#120B2E", "#FF3EA5"], paper: "#FFD400" } }, frame: { kind: "stamp", color: PX.coin } }),
    T({ x: 120, y: 1040, w: 840, h: 50, text: c.sub, font: F.press, size: 30, color: "#FFFFFF", align: "center" }),
    T({ x: 120, y: 1120, w: 840, h: 80, text: `${c.when}${c.where ? "\n" + c.where : ""}`, font: F.press, size: 18, color: PX.cyan, align: "center", lineHeight: 1.6 }),
    S("pixel-star", { x: 30, y: 30, w: 150, h: 150 }), S("pixel-heart", { x: 900, y: 1180, w: 150, h: 135 }),
  ]);
};

/* ================================= 9 · STICKER BOMB =============================== */
const SB = { blue: "#2443FF", lime: "#C6F432", pink: "#FF7AC6", white: "#FFFFFF", ink: "#111111" };
const bubble = (o: Partial<TextElement>): Partial<TextElement> => ({ outline: { color: SB.ink, width: 12 }, shadow: { color: SB.ink, x: 10, y: 12 }, ...o });

const stickerA: Layout = (x) => {
  const { c } = x;
  const h = fit(c.head, F.bagel, { x: 50, y: 60, w: 760, h: 420 }, { size: 170, color: SB.lime, lh: 0.95, lines: 3, extra: bubble({ rotation: -6 }) });
  return doc(SB.blue, [
    S("texture-halftone", { x: 600, y: 0, w: 480, h: 480, fill: "#3A58FF" }),
    photo(x, { x: 230, y: 360, w: 640, h: 760 }, { rotation: 4, cutout: { color: SB.white, width: 18 }, fx: { riso: { inks: ["#2443FF", "#FF7AC6"], paper: "#FFFFFF" } } }),
    h.el,
    S("burst-12", { x: 820, y: 330, w: 200, h: 200, fill: SB.pink, ink: SB.ink, rotation: 10 }),
    T({ x: 830, y: 380, w: 180, h: 100, text: "NEW!", font: F.bagel, size: 44, color: SB.white, align: "center", rotation: 10, lineHeight: 1 }),
    S("scribble-star", { x: 60, y: 560, w: 170, h: 170, ink: SB.lime }),
    S("tape-masking", { x: 470, y: 330, w: 220, h: 70, rotation: -8 }),
    S("arrow-swoop", { x: 60, y: 900, w: 220, h: 140, ink: SB.white, rotation: -20 }),
    S("kiwi-happy", { x: 840, y: 960, w: 170, h: 170, rotation: 12 }),
    S("burst-sparkle", { x: 100, y: 1150, w: 120, h: 120, fill: SB.lime }),
    R({ x: 640, y: 1170, w: 400, h: 130, fill: SB.white, rotation: -3, cutout: { color: SB.ink, width: 5 } }),
    T({ x: 660, y: 1180, w: 360, h: 110, text: `${c.when}\n${c.cta || c.where}`, font: F.smono, size: 22, fontWeight: 700, color: SB.ink, rotation: -3, lineHeight: 1.4 }),
    T({ x: 230, y: 1150, w: 420, h: 120, text: c.sub, font: F.marker, size: 40, color: SB.white, rotation: -4, lineHeight: 1.05 }),
  ]);
};

const stickerB: Layout = (x) => {
  const { c } = x;
  const h = fit(c.head, F.bagel, { x: 60, y: 760, w: 960, h: 360 }, { size: 180, color: SB.pink, lh: 0.95, lines: 3, align: "center", extra: bubble({ rotation: 3 }) });
  return doc(SB.lime, [
    S("bg-halftone", { x: 0, y: 0, w: W, h: 700, fill: "#9BCB1E", accent: SB.lime, rotation: 180 }),
    photo(x, { x: 140, y: 80, w: 560, h: 680 }, { rotation: -5, frame: { kind: "torn", color: SB.white }, fx: { duotone: { dark: SB.ink, light: SB.pink } } }),
    photo(x, { x: 600, y: 200, w: 380, h: 460 }, { rotation: 7, cutout: { color: SB.white, width: 14 } }, "photo2"),
    S("tape-clear", { x: 300, y: 50, w: 240, h: 76, rotation: 4 }),
    S("badge-ticket", { x: 680, y: 60, w: 330, h: 160, fill: SB.blue, ink: SB.ink, rotation: -6 }),
    T({ x: 700, y: 95, w: 290, h: 90, text: c.kicker, font: F.bagel, size: 38, color: SB.white, align: "center", rotation: -6, lineHeight: 1 }),
    h.el,
    S("scribble-circle", { x: 60, y: 1120, w: 300, h: 160, ink: SB.blue }),
    T({ x: 70, y: 1160, w: 290, h: 80, text: c.cta || "GOOD MOOD", font: F.marker, size: 30, color: SB.blue, align: "center" }),
    mono(400, 1180, 620, `${c.when}\n${c.where || c.sub}`, SB.ink, 22, "right"),
    S("burst-boom", { x: 40, y: 560, w: 180, h: 180, fill: SB.blue, ink: SB.ink, rotation: -12 }),
  ]);
};

const stickerC: Layout = (x) => {
  const { c } = x;
  const h = fit(c.head, F.bagel, { x: 60, y: 70, w: 960, h: 360 }, { size: 170, color: SB.blue, lh: 0.95, lines: 3, extra: bubble({ outline: { color: SB.white, width: 12 }, shadow: { color: SB.ink, x: 12, y: 12 } }) });
  return doc(SB.pink, [
    R({ x: 0, y: 0, w: W, h: H, fill: SB.pink, grain: 0.7 }),
    h.el,
    photo(x, { x: 70, y: h.bottom + 30, w: 470, h: 560 }, { rotation: -6, frame: { kind: "polaroid", title: c.noun.toLowerCase() + " core" } }),
    photo(x, { x: 530, y: h.bottom + 90, w: 470, h: 560 }, { rotation: 5, frame: { kind: "polaroid", title: "no thoughts" } }, "photo2"),
    S("tape-masking", { x: 220, y: h.bottom + 10, w: 200, h: 64, rotation: -14 }),
    S("tape-masking", { x: 680, y: h.bottom + 70, w: 200, h: 64, rotation: 10 }),
    S("bubble-shout", { x: 720, y: 1080, w: 320, h: 220, fill: SB.lime, ink: SB.ink, rotation: -4 }),
    T({ x: 740, y: 1120, w: 280, h: 120, text: c.sub, font: F.marker, size: 28, color: SB.ink, align: "center", rotation: -4, lineHeight: 1.05 }),
    mono(70, 1230, 620, `${c.when}${c.where ? "  ·  " + c.where : ""}`, SB.ink, 22),
    S("burst-12", { x: 900, y: 420, w: 140, h: 140, fill: SB.lime, ink: SB.ink }),
    S("scribble-star", { x: 40, y: 1060, w: 140, h: 140, ink: SB.blue }),
  ]);
};

/* ================================= 10 · GLOSSY BLOOM ============================== */
// Premium: 3D bubble type, rounded glossy photo cards with a sheen, chrome stickers, cream or deep plum.
const GL = { cream: "#F6EEDF", plum: "#2A0F2E", plum2: "#4A1A4F", butter: "#FFE58A", blush: "#FFC2D1", lilac: "#C9B8FF", ink: "#2A0F2E" };
const gloss = (from: string, to: string, ink: string): Partial<TextElement> => ({ glossy: { from, to, ink } });
const SHEEN = "linear-gradient(155deg, rgba(255,255,255,.55) 0%, rgba(255,255,255,.12) 22%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 78%, rgba(255,255,255,.18) 100%)";
/** A photo in a rounded glossy card: white rim, soft shadow, specular sheen on top. */
const glossCard = (x: Ctx, b: Box, rot: number, r = 48, which: "photo" | "photo2" = "photo") => [
  photo(x, b, { radius: r, rotation: rot, cutout: { color: "#FFFFFF", width: 12 } }, which),
  R({ ...b, fill: SHEEN, radius: r, rotation: rot }),
];

const glossyA: Layout = (x) => {
  const { c } = x;
  const h = fit(c.head, F.bagel, { x: 50, y: 70, w: 980, h: 400 }, { size: 230, lh: 0.92, lines: 2, align: "center", extra: gloss("#FFD6E5", "#E0457B", "#5E1236") });
  const py = h.bottom + 70;
  return doc(GL.cream, [
    R({ x: 0, y: 0, w: W, h: H, fill: GL.cream, grain: 0.3 }),
    h.el,
    glossCard(x, { x: 200, y: py, w: 680, h: Math.min(640, 1150 - py) }, -3),
    S("chrome-star", { x: 820, y: py - 90, w: 190, h: 190, rotation: 12 }),
    S("chrome-heart", { x: 90, y: py + 360, w: 170, h: 153, rotation: -14 }),
    R({ x: 220, y: 1196, w: 640, h: 80, fill: GL.plum, radius: 40 }),
    fit(c.when, F.smono, { x: 250, y: 1206, w: 580, h: 60 }, { size: 26, weight: 700, color: GL.butter, align: "center", lines: 1, valign: "center" }).el,
    T({ x: 60, y: 1290, w: 960, h: 44, text: c.sub, font: F.instr, size: 34, italic: true, color: GL.plum, align: "center" }),
  ]);
};

const glossyB: Layout = (x) => {
  const { c } = x;
  const h = fit(c.head, F.bagel, { x: 50, y: 780, w: 980, h: 360 }, { size: 220, lh: 0.92, lines: 2, align: "center", extra: gloss("#FFF6C9", "#F2B705", "#6B4A00") });
  return doc(GL.plum, [
    S("bg-halftone", { x: 0, y: 980, w: W, h: 370, fill: GL.plum2, accent: GL.plum }),
    T({ x: 60, y: 70, w: 960, h: 40, text: c.kicker, font: F.smono, size: 24, fontWeight: 700, color: GL.blush, align: "center", letterSpacing: 10 }),
    glossCard(x, { x: 255, y: 150, w: 570, h: 570 }, 3, 285),
    S("chrome-heart", { x: 760, y: 140, w: 200, h: 180, rotation: 14 }),
    S("chrome-star", { x: 110, y: 560, w: 170, h: 170, rotation: -8 }),
    h.el,
    T({ x: 60, y: 1170, w: 960, h: 60, text: c.sub, font: F.instr, size: 46, italic: true, color: GL.cream, align: "center" }),
    mono(60, 1260, 960, `${c.when}${c.where ? "  ·  " + c.where : ""}`, GL.butter, 22, "center"),
  ]);
};

const glossyC: Layout = (x) => {
  const { c } = x;
  const h = fit(c.head, F.bagel, { x: 50, y: 60, w: 980, h: 330 }, { size: 210, lh: 0.92, lines: 2, align: "center", extra: gloss("#F1ECFF", "#8E6CFF", "#2A0F2E") });
  return doc(GL.cream, [
    R({ x: 0, y: 0, w: W, h: H, fill: "linear-gradient(180deg, #F6EEDF 0%, #FFD9E6 100%)", grain: 0.25 }),
    h.el,
    glossCard(x, { x: 80, y: h.bottom + 60, w: 500, h: Math.min(720, 1120 - h.bottom - 60) }, -6, 44),
    glossCard(x, { x: 510, y: h.bottom + 120, w: 490, h: Math.min(700, 1140 - h.bottom - 120) }, 5, 44, "photo2"),
    S("chrome-blob", { x: 440, y: h.bottom + 20, w: 170, h: 170 }),
    S("chrome-star", { x: 880, y: h.bottom + 40, w: 150, h: 150, rotation: 10 }),
    T({ x: 60, y: 1180, w: 960, h: 60, text: c.sub, font: F.instr, size: 44, italic: true, color: GL.ink, align: "center" }),
    mono(60, 1260, 960, `${c.when}${c.where ? "  ·  " + c.where : ""}`, GL.ink, 22, "center"),
  ]);
};

export const LAYOUTS: Record<RecipeKey, Layout[]> = {
  nazar: [nazarA, nazarB, nazarC],
  tapri: [tapriA, tapriB, tapriC],
  stadium: [stadiumA, stadiumB, stadiumC],
  brutal: [brutalA, brutalB, brutalC],
  swiss: [swissA, swissB, swissC],
  trippy: [trippyA, trippyB, trippyC],
  neo: [neoA, neoB, neoC],
  pixel: [pixelA, pixelB, pixelC],
  sticker: [stickerA, stickerB, stickerC],
  glossy: [glossyA, glossyB, glossyC],
};

/** Fonts the layouts measure with (loaded before juicing). Devanagari faces need Devanagari text to fetch that subset. */
export const DNA_FONTS: [string, string?][] = [
  ['400 100px "Anton"'], ['400 100px "Archivo Black"'], ['700 100px "Space Mono"'], ['400 100px "Instrument Serif"'], ['italic 400 100px "Instrument Serif"'],
  ['400 100px "Shrikhand"'], ['400 100px "Bagel Fat One"'], ['400 100px "Press Start 2P"'], ['700 100px "Inter"'], ['600 100px "Inter"'],
  ['400 100px "Permanent Marker"'], ['800 100px "Baloo 2 Variable"'], ['700 100px "Khand"'], ['600 100px "Caveat Variable"'],
  ['400 100px "Rozha One"', "अआइकखगघचछजटठडतथदनपफबमयरलवशसहज़ड़ड़ािीुूेैोौंँ्"], ['400 100px "Yatra One"', "अआइकखगघचछजटठडतथदनपफबमयरलवशसहज़ड़ािीुूेैोौंँ्"],
  ['700 100px "Khand"', "अआइकखगघचछजटठडतथदनपफबमयरलवशसहािीुूेैोौंँ्"], ['400 100px "Rozha One"', "NO बुरी"], ['400 100px "Yatra One"', "ABC"],
];
