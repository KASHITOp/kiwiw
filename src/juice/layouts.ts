// Juice It, step 3: one deterministic layout per style direction. Each turns
// the copy into a 1080×1350 poster, fitting every headline by real measurement.
import type { Element, KiwiwDoc } from "../types";
import { T, R, S, Block, Frame, rule, F } from "../data/tpl/dsl";
import { fitText } from "./fit";
import type { Idea } from "./parse";
import type { JuiceCopy, StyleKey } from "./copy";

const W = 1080, H = 1350;
type Layout = (c: JuiceCopy, idea: Idea, seed: number) => KiwiwDoc;
const doc = (background: string, els: (Element | Element[])[]): KiwiwDoc => ({ width: W, height: H, background, elements: els.flat() });

/* 1 · Block Capitals */
const block: Layout = (c, idea, seed) => {
  const PAPER = "#F1EFE8", INK = "#0B0B0B", RED = seed % 2 ? "#FF3B1F" : "#FF5A1F";
  const fit = fitText(c.headline, { family: F.anton, maxW: 1000, maxH: 780, maxSize: 440, lineHeight: 0.9, maxLines: 4, uppercase: true });
  // Anton's caps are taller than its 0.84 line box, so step lines a bit wider
  const lineH = fit.size * 0.9;
  const top = 130 + Math.max(0, (780 - lineH * fit.lines.length) / 2);
  const det = fitText(c.cta === idea.price ? idea.when || "ALL WEEK" : idea.when || "THIS WEEK", { family: F.archivo, maxW: 560, maxH: 80, maxSize: 72, maxLines: 1 });
  return doc(PAPER, [
    T({ x: 54, y: 46, w: 600, h: 40, text: c.kicker, font: F.smono, size: 26, fontWeight: 700, letterSpacing: 3 }),
    T({ x: 600, y: 46, w: 426, h: 40, text: "VOL. 01", font: F.smono, size: 26, fontWeight: 700, letterSpacing: 3, align: "right" }),
    rule(54, 108, 972, INK, 3),
    ...fit.lines.map((l, i) => T({ x: 40, y: top + i * lineH, w: 1040, h: lineH, text: l, font: F.anton, size: fit.size, lineHeight: 0.84, color: i === fit.lines.length - 1 ? RED : INK })),
    rule(54, 950, 972, INK, 3),
    T({ x: 54, y: 980, w: 600, h: 80, text: det.text, font: F.archivo, size: det.size }),
    T({ x: 54, y: 1070, w: 600, h: 80, text: c.extra, font: F.smono, size: 26, fontWeight: 700, lineHeight: 1.4 }),
    S("burst-12", { x: 800, y: 1010, w: 240, h: 240, fill: RED, ink: INK, rotation: 12 }),
    T({ x: 820, y: 1030, w: 200, h: 200, text: c.cta, font: F.archivo, size: c.cta.length > 4 ? 40 : 56, color: "#FFFFFF", align: "center", rotation: 12 }),
    T({ x: 54, y: 1268, w: 760, h: 40, text: c.sub, font: F.smono, size: 22, fontWeight: 700, letterSpacing: 2 }),
  ]);
};

/* 2 · The Sunday Issue */
const sunday: Layout = (c, idea) => {
  const CREAM = "#F4EEE3", INK = "#1B1A17", TOMATO = "#E8553B", SAGE = "#8E9C7C";
  const head = fitText(c.headline + ",", { family: F.instr, maxW: 920, maxH: 470, maxSize: 190, lineHeight: 0.92, maxLines: 3 });
  const sub = fitText(c.sub, { family: F.instr, italic: true, maxW: 920, maxH: 300, maxSize: Math.min(170, head.size), lineHeight: 0.92, maxLines: 2 });
  // centre the headline block in the space between masthead and byline
  const y1 = 150 + Math.max(0, (880 - (head.h + 10 + sub.h + 60)) / 2);
  const y2 = y1 + head.h + 10;
  return doc(CREAM, [
    T({ x: 80, y: 66, w: 700, h: 30, text: c.kicker.split(" · ")[0], font: F.smono, size: 22, fontWeight: 700, letterSpacing: 4, color: INK }),
    T({ x: 600, y: 66, w: 400, h: 30, text: c.kicker.split(" · ")[1] ?? "", font: F.smono, size: 22, fontWeight: 700, letterSpacing: 4, color: TOMATO, align: "right" }),
    rule(80, 110, 920, INK, 2),
    T({ x: 74, y: y1, w: 940, h: head.h, text: head.text, font: F.instr, size: head.size, lineHeight: 0.92, color: INK }),
    T({ x: 74, y: y2, w: 940, h: sub.h, text: sub.text, font: F.instr, size: sub.size, italic: true, lineHeight: 0.92, color: TOMATO }),
    S("line-squiggle", { x: 90, y: y2 + sub.h + 10, w: Math.min(700, sub.w), h: 40, fill: SAGE }),
    rule(80, 1060, 920, INK, 2),
    T({ x: 80, y: 1090, w: 640, h: 120, text: [idea.when, idea.place?.toUpperCase(), c.extra].filter(Boolean).join("\n"), font: F.smono, size: 22, fontWeight: 700, letterSpacing: 2, lineHeight: 1.7, color: INK }),
    S("arrow-swoop", { x: 700, y: 1090, w: 170, h: 106, ink: TOMATO, rotation: 200 }),
    T({ x: 800, y: 1220, w: 200, h: 60, text: c.cta, font: F.instr, size: 44, italic: true, color: INK, align: "right" }),
  ]);
};

/* 3 · Cut & Paste Club */
const zine: Layout = (c, idea, seed) => {
  const KRAFT = "#E9DCC4", INK = "#111111", WHITE = "#FFFFFF";
  const fills = ["#FF4FA3", INK, "#FF7A1A", "#8BD630"];
  const texts = [INK, WHITE, INK, INK];
  const fonts = [F.rubik, F.marker, F.rubik, F.marker];
  const words = c.headline.toUpperCase().split(/\s+/);
  // at most 3 blocks: merge extra words into the last block
  const blocks = words.length <= 3 ? words : [words[0], words[1], words.slice(2).join(" ")];
  let y = 90;
  const els: (Element | Element[])[] = [S("texture-halftone", { x: 640, y: -40, w: 480, h: 480, fill: INK, opacity: 0.18 })];
  blocks.forEach((b, i) => {
    const k = (i + seed) % 4;
    const f = fitText(b, { family: fonts[k], maxW: 860, maxH: 190, maxSize: 170, maxLines: 1 });
    const bw = Math.min(960, f.w + 90), bh = f.size * 1.25;
    const x = i % 2 ? 1080 - bw - 60 : 60;
    els.push(Block({ x, y, w: bw, h: bh, fill: fills[k], text: b, font: fonts[k], size: f.size, color: texts[k], rot: [-5, 3, -3][i % 3], shadow: k === 1 ? "#FF7A1A" : INK, offset: 12 }));
    y += bh + 30;
  });
  const scrapY = Math.max(y + 20, 700);
  const note = fitText(c.sub, { family: F.caveat, weight: 700, maxW: 500, maxH: 230, maxSize: 74, lineHeight: 1.05, maxLines: 3 });
  els.push(
    S("paper-scrap", { x: 120, y: scrapY, w: 640, h: 330, fill: WHITE, ink: INK, rotation: 4 }),
    S("tape-clear", { x: 90, y: scrapY - 20, w: 200, h: 54, rotation: -28 }),
    S("tape-clear", { x: 620, y: scrapY, w: 200, h: 54, rotation: 24 }),
    T({ x: 180, y: scrapY + 50, w: 520, h: 230, text: note.text, font: F.caveat, size: note.size, fontWeight: 700, lineHeight: 1.05, color: INK, rotation: 4 }),
    S("burst-12", { x: 790, y: scrapY + 150, w: 250, h: 250, fill: "#8BD630", ink: INK, rotation: -14 }),
    T({ x: 810, y: scrapY + 170, w: 210, h: 210, text: c.cta, font: F.rubik, size: c.cta.length > 5 ? 30 : 40, color: INK, align: "center", rotation: -14 }),
    R({ x: 60, y: 1220, w: 760, h: 64, fill: INK, rotation: -1 }),
    T({ x: 60, y: 1220, w: 760, h: 64, text: (idea.when || "SOON-ISH").slice(0, 34), font: F.smono, size: 28, fontWeight: 700, letterSpacing: 2, color: KRAFT, align: "center", rotation: -1 }),
    S("scribble-star", { x: 900, y: 1190, w: 120, h: 120, ink: "#FF4FA3", rotation: 10 }),
    S("texture-grain", { x: 0, y: 0, w: W, h: H, opacity: 0.5 }),
  );
  return doc(KRAFT, els);
};

/* 4 · Bombay Talkies */
const filmi: Layout = (c, idea) => {
  const MARIGOLD = "#F6A21E", VERMILION = "#D7261E", PEACOCK = "#0F6E6E", CREAM = "#F7E7C6", KATTHA = "#2A160E";
  const head = fitText(c.headline, { family: F.baloo, weight: 800, maxW: 900, maxH: 420, maxSize: 240, lineHeight: 0.9, maxLines: 2, uppercase: true });
  const det = fitText(idea.when || "IS ON", { family: F.mukta, weight: 800, maxW: 560, maxH: 70, maxSize: 48, maxLines: 1 });
  const hy = 210 + Math.max(0, (420 - head.h) / 2);
  return doc(PEACOCK, [
    S("burst-rays", { x: 40, y: 40, w: 1000, h: 1000, fill: "#13807F", accent: PEACOCK }),
    Frame(28, 28, W - 56, H - 56, CREAM, 7),
    Frame(48, 48, W - 96, H - 96, MARIGOLD, 2),
    S("desi-marigold", { x: 70, y: 70, w: 120, h: 120 }),
    S("desi-marigold", { x: 890, y: 70, w: 120, h: 120 }),
    T({ x: 140, y: 100, w: 800, h: 90, text: c.kicker, font: F.tiro, size: 76, color: CREAM, align: "center" }),
    T({ x: 60, y: hy, w: 960, h: head.h, text: head.text, font: F.baloo, size: head.size, fontWeight: 800, lineHeight: 0.9, color: MARIGOLD, align: "center", shadow: { color: KATTHA, x: 12, y: 12 }, outline: { color: KATTHA, width: 6 } }),
    S("badge-ribbon", { x: 110, y: 660, w: 860, h: 276, fill: VERMILION, accent: "#8E1A14", ink: KATTHA }),
    T({ x: 230, y: 680, w: 620, h: 130, text: det.text, font: F.mukta, size: det.size, fontWeight: 800, color: CREAM, align: "center" }),
    T({ x: 120, y: 900, w: 840, h: 90, text: c.sub, font: F.mukta, size: 40, fontWeight: 700, color: CREAM, align: "center" }),
    S("badge-seal", { x: 80, y: 1050, w: 230, h: 230, fill: VERMILION, accent: CREAM, rotation: -12 }),
    T({ x: 95, y: 1065, w: 200, h: 200, text: c.cta.replace(" ", "\n"), font: F.rubik, size: c.cta.length > 6 ? 30 : 40, lineHeight: 1.1, color: CREAM, align: "center", rotation: -12 }),
    T({ x: 330, y: 1130, w: 500, h: 80, text: c.extra, font: F.mukta, size: 32, fontWeight: 600, lineHeight: 1.25, color: CREAM }),
    S("desi-diya", { x: 850, y: 1120, w: 140, h: 140 }),
  ]);
};

/* 5 · Quiet Money */
const calm: Layout = (c, idea) => {
  const BONE = "#EDEAE3", GRAPHITE = "#191A17", MOSS = "#4F5D3A", BRASS = "#B08A4E";
  const head = fitText(c.headline + ".", { family: F.fraunces, weight: 300, maxW: 860, maxH: 240, maxSize: 120, lineHeight: 1, maxLines: 2 });
  const sub = fitText(c.sub, { family: F.fraunces, weight: 300, italic: true, maxW: 860, maxH: 130, maxSize: 64, lineHeight: 1.05, maxLines: 2 });
  return doc(BONE, [
    Frame(48, 48, 984, 1254, GRAPHITE, 1.5),
    T({ x: 110, y: 120, w: 600, h: 30, text: c.kicker, font: F.smono, size: 20, fontWeight: 700, letterSpacing: 4, color: GRAPHITE }),
    T({ x: 600, y: 120, w: 370, h: 30, text: idea.price ?? idea.day?.toUpperCase() ?? "", font: F.smono, size: 20, fontWeight: 700, letterSpacing: 4, color: BRASS, align: "right" }),
    T({ x: 90, y: 200, w: 900, h: 520, text: c.extra, font: F.fraunces, size: 460, fontWeight: 200, lineHeight: 1, letterSpacing: -20, color: GRAPHITE, align: "center" }),
    rule(470, 760, 140, GRAPHITE, 1.5),
    T({ x: 110, y: 800, w: 860, h: head.h, text: head.text, font: F.fraunces, size: head.size, fontWeight: 300, lineHeight: 1, color: GRAPHITE, align: "center" }),
    T({ x: 110, y: 820 + head.h, w: 860, h: sub.h, text: sub.text, font: F.fraunces, size: sub.size, fontWeight: 300, italic: true, lineHeight: 1.05, color: MOSS, align: "center" }),
    T({ x: 110, y: 1210, w: 860, h: 30, text: [idea.when, idea.place?.toUpperCase()].filter(Boolean).join(" · ") || c.cta.toUpperCase(), font: F.smono, size: 18, fontWeight: 700, letterSpacing: 4, color: GRAPHITE, align: "center" }),
    S("kiwi-slice", { x: 930, y: 1240, w: 44, h: 44 }),
  ]);
};

/* 6 · Brainrot Broadcast */
const brainrot: Layout = (c, idea, seed) => {
  const ACID = "#D8F27A", PINK = "#FF3FA4", INK = "#0B0B0B", WHITE = "#FFFFFF";
  const meme = { color: WHITE, outline: { color: INK, width: 9 }, align: "center" as const, lineHeight: 0.92 };
  const top = fitText(`${c.kicker} ${c.headline}`, { family: F.anton, maxW: 1000, maxH: 320, maxSize: 150, lineHeight: 0.92, maxLines: 3, uppercase: true });
  const bottom = fitText(c.extra, { family: F.anton, maxW: 1000, maxH: 250, maxSize: 140, lineHeight: 0.92, maxLines: 2, uppercase: true });
  const notif = fitText(c.sub, { family: F.gochi, maxW: 660, maxH: 170, maxSize: 64, lineHeight: 1.05, maxLines: 3 });
  return doc(ACID, [
    S("texture-halftone-radial", { x: 140, y: 240, w: 800, h: 800, fill: PINK, opacity: 0.35 }),
    T({ x: 40, y: 40, w: 1000, h: top.h, text: top.text, font: F.anton, size: top.size, ...meme }),
    R({ x: 170, y: 470, w: 740, h: 300, fill: INK, radius: 28, rotation: -3 }),
    R({ x: 160, y: 460, w: 740, h: 300, fill: WHITE, stroke: INK, strokeWidth: 5, radius: 28, rotation: -3 }),
    T({ x: 200, y: 480, w: 660, h: 36, text: `● kiwiw · ${idea.time ? "at " + idea.time.toLowerCase() : "now"}`, font: F.smono, size: 24, fontWeight: 700, color: "#6B6B6B", rotation: -3 }),
    T({ x: 200, y: 528, w: 660, h: 210, text: notif.text, font: F.gochi, size: notif.size, lineHeight: 1.05, color: INK, rotation: -3 }),
    T({ x: 40, y: 1310 - bottom.h - 40, w: 1000, h: bottom.h, text: bottom.text, font: F.anton, size: bottom.size, ...meme }),
    S("burst-12", { x: 830, y: 330, w: 210, h: 210, fill: PINK, ink: INK, rotation: 14 }),
    T({ x: 845, y: 345, w: 180, h: 180, text: c.cta, font: F.rubik, size: 44, color: WHITE, align: "center", rotation: 14 }),
    S("arrow-swoop", { x: 30, y: 700, w: 200, h: 125, ink: INK, rotation: -20 }),
    T({ x: 40, y: 800, w: 160, h: 60, text: "this", font: F.gochi, size: 48, color: INK, rotation: -8 }),
    R({ x: 760, y: 800, w: 230, h: 66, fill: INK, radius: 33, rotation: 4 }),
    T({ x: 760, y: 800, w: 230, h: 66, text: `W +${(seed % 9000) + 1000}`, font: F.smono, size: 26, fontWeight: 700, color: ACID, align: "center", rotation: 4 }),
  ]);
};

export const LAYOUTS: Record<StyleKey, Layout> = { block, sunday, zine, filmi, calm, brainrot };
