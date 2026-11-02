// Image effects (DESIGN.md §16): halftone, duotone, posterize, B&W.
// Rendered on a canvas into a data URL and cached by source + settings, so the
// canvas, thumbnails and PNG export all show exactly the same pixels.
import type { ImageFx } from "../types";

const cache = new Map<string, Promise<string>>();

export const hasImageFx = (fx?: ImageFx) => !!fx && !!(fx.halftone || fx.duotone || fx.posterize || fx.bw);

export function processImage(src: string, fx: ImageFx): Promise<string> {
  const key = src.length > 200 ? src.slice(0, 120) + src.length + src.slice(-60) : src;
  const k = key + "|" + JSON.stringify(fx);
  let p = cache.get(k);
  if (!p) {
    p = run(src, fx);
    cache.set(k, p);
    p.catch(() => cache.delete(k));
  }
  return p;
}

/** Cheap CSS stand-in while the canvas version renders (or if the source is tainted). */
export function cssFallback(fx?: ImageFx): string | undefined {
  if (!hasImageFx(fx)) return undefined;
  if (fx!.bw || fx!.halftone || fx!.duotone) return "grayscale(1) contrast(1.4)";
  return "contrast(1.3) saturate(1.4)";
}

function rgb(hex: string): [number, number, number] {
  const m = hex.replace("#", "");
  const h = m.length === 3 ? m.split("").map((c) => c + c).join("") : m.padEnd(6, "0");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) || 0) as [number, number, number];
}

async function load(src: string): Promise<HTMLImageElement> {
  const img = new Image();
  if (!src.startsWith("data:") && !src.startsWith("/") && !src.startsWith(location.origin)) img.crossOrigin = "anonymous";
  img.src = src;
  await img.decode();
  return img;
}

async function run(src: string, fx: ImageFx): Promise<string> {
  const img = await load(src);
  const s = Math.min(1, 1100 / Math.max(img.naturalWidth, img.naturalHeight));
  const w = Math.max(1, Math.round(img.naturalWidth * s)), h = Math.max(1, Math.round(img.naturalHeight * s));
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  const g = c.getContext("2d", { willReadFrequently: true })!;
  g.drawImage(img, 0, 0, w, h);
  const d = g.getImageData(0, 0, w, h);
  const a = d.data;

  const tone = !!(fx.bw || fx.duotone || fx.halftone);
  const contrast = fx.bw ? 1.6 : fx.halftone ? 1.3 : fx.duotone ? 1.2 : 1;
  const levels = fx.posterize && fx.posterize > 1 ? Math.round(fx.posterize) : 0;
  const q = (v: number) => (levels ? Math.round((v / 255) * (levels - 1)) / (levels - 1) * 255 : v);
  const [dr, dg, db] = rgb(fx.duotone?.dark ?? "#000000");
  const [lr, lg, lb] = rgb(fx.duotone?.light ?? "#FFFFFF");
  const L = new Float32Array(w * h);

  for (let i = 0, p = 0; i < a.length; i += 4, p++) {
    if (tone) {
      let l = 0.299 * a[i] + 0.587 * a[i + 1] + 0.114 * a[i + 2];
      l = Math.max(0, Math.min(255, (l - 128) * contrast + 128));
      l = q(l);
      L[p] = l;
      if (fx.duotone) {
        const t = l / 255;
        a[i] = dr + (lr - dr) * t; a[i + 1] = dg + (lg - dg) * t; a[i + 2] = db + (lb - db) * t;
      } else { a[i] = a[i + 1] = a[i + 2] = l; }
    } else if (levels) {
      a[i] = q(a[i]); a[i + 1] = q(a[i + 1]); a[i + 2] = q(a[i + 2]);
    }
  }
  g.putImageData(d, 0, 0);
  if (!fx.halftone) return c.toDataURL("image/jpeg", 0.92);

  // halftone: dots on a 45° lattice, radius from darkness
  const out = document.createElement("canvas");
  out.width = w; out.height = h;
  const o = out.getContext("2d")!;
  const paper = fx.duotone ? fx.duotone.light : fx.halftone.paper;
  const ink = fx.duotone ? fx.duotone.dark : fx.halftone.ink ?? "#111111";
  if (paper) { o.fillStyle = paper; o.fillRect(0, 0, w, h); }
  const cell = Math.max(3, (fx.halftone.dot || 10) * (w / 1000));
  const cos = Math.cos(Math.PI / 4), sin = Math.sin(Math.PI / 4);
  const R = Math.hypot(w, h) / 2 + cell;
  o.fillStyle = ink;
  o.beginPath();
  for (let u = -R; u <= R; u += cell) {
    for (let v = -R; v <= R; v += cell) {
      const x = w / 2 + u * cos - v * sin, y = h / 2 + u * sin + v * cos;
      if (x < -cell || y < -cell || x > w + cell || y > h + cell) continue;
      const sx = Math.min(w - 1, Math.max(0, Math.round(x))), sy = Math.min(h - 1, Math.max(0, Math.round(y)));
      const r = cell * 0.62 * Math.sqrt(1 - L[sy * w + sx] / 255);
      if (r < 0.35) continue;
      o.moveTo(x + r, y);
      o.arc(x, y, r, 0, Math.PI * 2);
    }
  }
  o.fill();
  return out.toDataURL("image/png");
}
