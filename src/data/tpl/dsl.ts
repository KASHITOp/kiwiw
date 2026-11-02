// A tiny layout DSL for authoring templates as plain data.
import type { Element, TextElement, ShapeElement, StickerElement, Template } from "../../types";
import { STICKER_MAP } from "../../stickers/library";

let n = 0;
const id = () => `k${(n++).toString(36)}`;

/** Font family names (DESIGN.md §10). */
export const F = {
  anton: "Anton",
  archivo: "Archivo Black",
  rubik: "Rubik Mono One",
  unbounded: "Unbounded Variable",
  syne: "Syne Variable",
  bric: "Bricolage Grotesque Variable",
  instr: "Instrument Serif",
  fraunces: "Fraunces Variable",
  dmserif: "DM Serif Display",
  caveat: "Caveat Variable",
  marker: "Permanent Marker",
  gochi: "Gochi Hand",
  baloo: "Baloo 2 Variable",
  mukta: "Mukta",
  tiro: "Tiro Devanagari Hindi",
  smono: "Space Mono",
  jb: "JetBrains Mono",
  inter: "Inter",
} as const;

type Box = { x: number; y: number; w: number; h: number };
type TextIn = Box & Partial<TextElement> & { text: string; font: string; size: number };

export function T(p: TextIn): Element {
  const { font, size, ...rest } = p;
  return {
    id: id(), type: "text", rotation: 0, opacity: 1, color: "#0B0B0B", fontWeight: 400,
    align: "left", lineHeight: 1.05, letterSpacing: 0, fontFamily: font, fontSize: size, ...rest,
  } as Element;
}

export function R(p: Box & Partial<ShapeElement>): Element {
  return { id: id(), type: "shape", shape: "rect", rotation: 0, opacity: 1, fill: "#000000", stroke: "#000000", strokeWidth: 0, radius: 0, ...p } as Element;
}

export function O(p: Box & Partial<ShapeElement>): Element {
  return R({ shape: "ellipse", ...p });
}

/** Hollow rectangle (borders, frames). */
export function Frame(x: number, y: number, w: number, h: number, color: string, width = 2, radius = 0): Element {
  return R({ x, y, w, h, fill: "transparent", stroke: color, strokeWidth: width, radius });
}

/** Horizontal rule. */
export const rule = (x: number, y: number, w: number, color: string, thickness = 2) => R({ x, y, w, h: thickness, fill: color });

export function S(kind: string, p: Box & Partial<StickerElement>): Element {
  const def = STICKER_MAP[kind];
  if (!def) throw new Error(`Unknown sticker ${kind}`);
  return {
    id: id(), type: "sticker", kind, name: def.name, rotation: 0, opacity: 1,
    fill: def.colors.fill, accent: def.colors.accent, ink: def.colors.ink, ...p,
  } as Element;
}

/** A ransom-note paper block: hard shadow + coloured block + centred text, rotated together. */
export function Block(p: Box & {
  fill: string; text: string; font: string; size: number; color: string;
  rot?: number; shadow?: string; offset?: number; radius?: number; extra?: Partial<TextElement>;
}): Element[] {
  const rot = p.rot ?? 0, off = p.offset ?? 10;
  const els: Element[] = [];
  if (p.shadow) els.push(R({ x: p.x + off, y: p.y + off, w: p.w, h: p.h, fill: p.shadow, rotation: rot, radius: p.radius ?? 0 }));
  els.push(R({ x: p.x, y: p.y, w: p.w, h: p.h, fill: p.fill, rotation: rot, radius: p.radius ?? 0 }));
  els.push(T({ x: p.x, y: p.y, w: p.w, h: p.h, text: p.text, font: p.font, size: p.size, color: p.color, align: "center", rotation: rot, lineHeight: 1, ...p.extra }));
  return els;
}

export interface TemplateMeta {
  id: string;
  name: string;
  description: string;
  style: string;
  format: string;
  tags?: string[];
}

export function tpl(meta: TemplateMeta, width: number, height: number, background: string, parts: (Element | Element[])[]): Template {
  return {
    ...meta,
    category: meta.format,
    thumbBg: background,
    doc: { width, height, background, elements: parts.flat() },
  };
}

export const FORMATS = {
  post: { w: 1080, h: 1080, label: "Instagram post" },
  story: { w: 1080, h: 1920, label: "Story" },
  poster: { w: 1080, h: 1350, label: "Poster" },
  yt: { w: 1280, h: 720, label: "YouTube thumbnail" },
  slide: { w: 1920, h: 1080, label: "Slide" },
  banner: { w: 1584, h: 396, label: "LinkedIn banner" },
} as const;
