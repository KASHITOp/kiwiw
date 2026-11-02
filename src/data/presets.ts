// Text presets and sticker factory for the left panel (Phase 1).
import type { Element, StickerElement, TextElement } from "../types";
import { STICKER_MAP } from "../stickers/library";

type NewEl = Omit<Element, "id">;

export interface TextPreset {
  id: string;
  label: string;
  hint: string;
  el: Omit<TextElement, "id" | "x" | "y">;
}

const t = (p: Partial<TextElement> & Pick<TextElement, "text" | "fontFamily" | "fontSize" | "w" | "h">): TextPreset["el"] => ({
  type: "text", rotation: 0, opacity: 1, color: "#0B0D08", fontWeight: 400, align: "left",
  lineHeight: 1.1, letterSpacing: 0, ...p,
});

export const TEXT_PRESETS: TextPreset[] = [
  { id: "shouty", label: "Shouty headline", hint: "Anton, all caps, no indoor voice", el: t({ text: "STOP SCROLLING", fontFamily: "Anton", fontSize: 150, w: 920, h: 150, uppercase: true, lineHeight: 0.86, letterSpacing: -1, role: "headline" }) },
  { id: "serif", label: "Fancy serif", hint: "Instrument Serif, italic, pinky up", el: t({ text: "A rather fancy headline", fontFamily: "Instrument Serif", fontSize: 120, italic: true, w: 880, h: 240, lineHeight: 0.95, role: "headline" }) },
  { id: "sticker", label: "Sticker label", hint: "Highlighted, tilted, slightly smug", el: t({ text: "NEW DROP", fontFamily: "Rubik Mono One", fontSize: 46, w: 440, h: 80, uppercase: true, align: "center", highlight: { color: "#D8F27A" }, rotation: -4, role: "label" }) },
  { id: "hand", label: "Handwritten note", hint: "Caveat, written in a hurry", el: t({ text: "psst… this one's good", fontFamily: "Caveat Variable", fontSize: 78, fontWeight: 600, color: "#FF3B1F", w: 640, h: 110, rotation: -3, role: "sub" }) },
  { id: "hinglish", label: "Hinglish caption", hint: "Baloo 2, full desi confidence", el: t({ text: "Kya scene hai, boss?", fontFamily: "Baloo 2 Variable", fontSize: 72, fontWeight: 800, w: 760, h: 110, lineHeight: 1.05, role: "sub" }) },
  { id: "desi", label: "Desi headline", hint: "Tiro Devanagari, cinema-hall grand", el: t({ text: "धमाका ऑफ़र", fontFamily: "Tiro Devanagari Hindi", fontSize: 120, color: "#D7261E", w: 760, h: 170, align: "center", role: "headline" }) },
  { id: "meme", label: "Meme caption", hint: "White, outlined, legally a meme", el: t({ text: "WHEN THE DESIGN SLAPS", fontFamily: "Anton", fontSize: 104, color: "#FFFFFF", uppercase: true, align: "center", w: 960, h: 230, lineHeight: 0.95, outline: { color: "#0B0D08", width: 7 }, role: "headline" }) },
  { id: "arch", label: "Arched badge text", hint: "Curved, like it owns a food truck", el: t({ text: "FRESHLY SQUEEZED", fontFamily: "Rubik Mono One", fontSize: 50, uppercase: true, w: 640, h: 190, curve: -60, align: "center", role: "label" }) },
  { id: "shadow", label: "Hard shadow pop", hint: "Archivo Black + a shadow with no chill", el: t({ text: "Big Energy", fontFamily: "Archivo Black", fontSize: 120, color: "#FF4FA3", w: 820, h: 150, shadow: { color: "#0B0D08", x: 8, y: 8 }, role: "headline" }) },
  { id: "mono", label: "Mono label", hint: "Space Mono, very serious numbers", el: t({ text: "ISSUE 07 · NOV 2026", fontFamily: "Space Mono", fontSize: 30, fontWeight: 700, uppercase: true, letterSpacing: 4, w: 640, h: 50, role: "label" }) },
  { id: "body", label: "Body text", hint: "Inter. Sometimes you just need words.", el: t({ text: "Plain words go here. Keep it short; nobody reads paragraph three.", fontFamily: "Inter", fontSize: 32, w: 660, h: 130, lineHeight: 1.4, role: "body" }) },
];

/** Scale a preset/sticker made for ~1080px canvases to the current page. */
export const pageScale = (w: number, h: number) => Math.min(w, h) / 1080;

export function placeText(p: TextPreset, docW: number, docH: number): NewEl {
  const s = pageScale(docW, docH);
  const el = p.el;
  const w = el.w * s, h = el.h * s;
  return {
    ...el,
    w, h,
    x: (docW - w) / 2,
    y: (docH - h) / 2,
    fontSize: el.fontSize * s,
    letterSpacing: el.letterSpacing * s,
    outline: el.outline ? { ...el.outline, width: el.outline.width * s } : el.outline,
    shadow: el.shadow ? { ...el.shadow, x: el.shadow.x * s, y: el.shadow.y * s } : el.shadow,
  } as NewEl;
}

export function makeSticker(kind: string, docW: number, docH: number): NewEl {
  const def = STICKER_MAP[kind];
  const s = pageScale(docW, docH);
  const w = def.size[0] * s, h = def.size[1] * s;
  const el: Omit<StickerElement, "id"> = {
    type: "sticker", kind, name: def.name,
    x: (docW - w) / 2, y: (docH - h) / 2, w, h, rotation: 0, opacity: 1,
    fill: def.colors.fill, accent: def.colors.accent, ink: def.colors.ink,
  };
  return el as NewEl;
}
