// "Match my design": pull a 3-colour palette out of the current page so a
// sticker can be recoloured to belong there (Sticker Library 2.0).
import type { KiwiwDoc, StickerElement } from "../types";

const HEX = /^#([0-9a-f]{6})$/i;
const lum = (h: string) => {
  const n = parseInt(h.slice(1), 16);
  return (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
};
const sat = (h: string) => {
  const n = parseInt(h.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
  return mx ? (mx - mn) / mx : 0;
};

/** [fill, accent, ink] from the page: the loudest colour, a contrasting second, the darkest. */
export function docPalette(doc: KiwiwDoc): [string, string, string] | null {
  const seen = new Map<string, number>();
  const add = (c: string | undefined, w: number) => { if (c && HEX.test(c)) seen.set(c.toUpperCase(), (seen.get(c.toUpperCase()) ?? 0) + w); };
  add(doc.background, 3);
  for (const e of doc.elements) {
    const area = Math.sqrt(e.w * e.h) / 100;
    if (e.type === "text") add(e.color, 2 + area);
    if (e.type === "shape") add(e.fill, area);
    if (e.type === "sticker" && !e.kind.startsWith("bg-")) { add(e.fill, area); add(e.accent, area * 0.5); }
  }
  const all = [...seen.entries()].sort((a, b) => b[1] - a[1]).map(([c]) => c);
  if (!all.length) return null;
  const loud = [...all].sort((a, b) => sat(b) - sat(a));
  const fill = loud[0];
  const accent = all.find((c) => c !== fill && Math.abs(lum(c) - lum(fill)) > 0.3) ?? (lum(fill) > 0.5 ? "#111111" : "#FFFFFF");
  const ink = [...all].sort((a, b) => lum(a) - lum(b))[0];
  return [fill, accent, lum(ink) < 0.35 && ink !== fill ? ink : "#111111"];
}

export function recolor(el: Pick<StickerElement, "fill" | "accent" | "ink">, p: [string, string, string]) {
  return { ...el, fill: p[0], accent: p[1], ink: p[2] };
}
