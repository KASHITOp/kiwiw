// Juice from a photo (DESIGN.md §23): load a user photo, find its dominant
// colours, and re-hue a recipe's accents to match (lightness kept, so
// contrast survives).
import type { Element, KiwiwDoc } from "../types";
import type { Photo } from "../data/photos";

export interface UserPhoto extends Photo { palette: string[] }

export const PHOTO_LINES = ["main character moment", "core memory unlocked", "this photo has opinions", "no caption needed", "certified mood", "plot twist incoming"];

const hex = (r: number, g: number, b: number) => "#" + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("").toUpperCase();
function toHsl(h: string): [number, number, number] {
  const n = parseInt(h.slice(1), 16), r = (n >> 16) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn;
  if (!d) return [0, 0, l];
  const s = d / (1 - Math.abs(2 * l - 1));
  const hh = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [(hh * 60 + 360) % 360, s, l];
}
function fromHsl(h: number, s: number, l: number) {
  const c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = l - c / 2;
  const [r, g, b] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  return hex((r + m) * 255, (g + m) * 255, (b + m) * 255);
}

/** Downscale to ≤1200px JPEG and pull 5 dominant colours (tiny k-means). */
export async function loadPhoto(file: File): Promise<UserPhoto> {
  const bmp = await createImageBitmap(file);
  const k = Math.min(1, 1200 / Math.max(bmp.width, bmp.height));
  const W = Math.round(bmp.width * k), H = Math.round(bmp.height * k);
  const c = document.createElement("canvas"); c.width = W; c.height = H;
  const ctx = c.getContext("2d")!;
  ctx.drawImage(bmp, 0, 0, W, H);
  const src = c.toDataURL("image/jpeg", 0.86);
  const s = document.createElement("canvas"); s.width = 48; s.height = 48;
  const sx = s.getContext("2d", { willReadFrequently: true })!;
  sx.drawImage(bmp, 0, 0, 48, 48);
  const d = sx.getImageData(0, 0, 48, 48).data;
  const px: [number, number, number][] = [];
  for (let i = 0; i < d.length; i += 4) px.push([d[i], d[i + 1], d[i + 2]]);
  let cents = [0, 0.2, 0.4, 0.6, 0.8].map((f) => px[Math.floor(f * px.length)]);
  let groups: [number, number, number][][] = [];
  for (let it = 0; it < 8; it++) {
    groups = cents.map(() => []);
    for (const p of px) {
      let bi = 0, bd = Infinity;
      cents.forEach((q, j) => { const dd = (p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2 + (p[2] - q[2]) ** 2; if (dd < bd) { bd = dd; bi = j; } });
      groups[bi].push(p);
    }
    cents = groups.map((g, j) => (g.length ? [0, 1, 2].map((ch) => g.reduce((t, p) => t + p[ch], 0) / g.length) as [number, number, number] : cents[j]));
  }
  // loud first: saturation × share of pixels
  const palette = cents.map((q, j) => ({ h: hex(...q), w: groups[j].length })).sort((a, b) => toHsl(b.h)[1] * Math.sqrt(b.w) - toHsl(a.h)[1] * Math.sqrt(a.w)).map((x) => x.h);
  return { src, topic: "user", w: W, h: H, palette };
}

/** Re-hue the recipe's loud colours to the photo's, keeping their lightness. */
export function tuneToPhoto(doc: KiwiwDoc, palette: string[]): KiwiwDoc {
  const loud = palette.filter((h) => toHsl(h)[1] > 0.22);
  if (!loud.length) return doc;
  const count = new Map<string, number>();
  const bump = (c?: string) => { if (c && /^#[0-9a-f]{6}$/i.test(c)) { const [, s, l] = toHsl(c); if (s > 0.35 && l > 0.15 && l < 0.88) count.set(c.toUpperCase(), (count.get(c.toUpperCase()) ?? 0) + 1); } };
  bump(doc.background);
  for (const e of doc.elements) { if (e.type === "text") bump(e.color); if (e.type === "shape") bump(e.fill); if (e.type === "sticker") { bump(e.fill); bump(e.accent); } }
  const map = new Map<string, string>();
  [...count.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3).forEach(([c], i) => {
    const [, s, l] = toHsl(c), [h2, s2] = toHsl(loud[i % loud.length]);
    map.set(c, fromHsl(h2, Math.max(s2, s * 0.8), l));
  });
  const re = (c?: string) => (c && map.get(c.toUpperCase())) ?? c;
  return {
    ...doc,
    background: re(doc.background)!,
    elements: doc.elements.map((e): Element => {
      if (e.type === "text") return { ...e, color: re(e.color)!, ...(e.outline ? { outline: { ...e.outline, color: re(e.outline.color)! } } : {}), ...(e.shadow ? { shadow: { ...e.shadow, color: re(e.shadow.color)! } } : {}) };
      if (e.type === "shape") return { ...e, fill: re(e.fill)! };
      if (e.type === "sticker") return { ...e, fill: re(e.fill)!, accent: re(e.accent)! };
      return e;
    }),
  };
}
