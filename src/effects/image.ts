// Image effects (DESIGN.md §16): halftone, duotone, Riso print, B&W.
// Every effect auto-brightens dark photos first (diyas at night stay readable).
// Rendered on a canvas into a data URL and cached by source + settings, so the
// canvas, thumbnails and PNG export all show exactly the same pixels.
import type { ImageFx } from "../types";

const cache = new Map<string, Promise<string>>();

export const hasImageFx = (fx?: ImageFx) => !!fx && !!(fx.halftone || fx.duotone || fx.posterize || fx.riso || fx.bw);

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
  brighten(a);
  if (fx.riso || fx.posterize) {
    g.putImageData(d, 0, 0);
    return riso(c, fx.riso ?? { inks: ["#1D3FD8", "#FF4FA3"], paper: "#F4EBDD" });
  }

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
      const lum = L[sy * w + sx] / 255;
      const r = cell * 0.62 * Math.sqrt(fx.halftone.invert ? lum : 1 - lum);
      if (r < 0.35) continue;
      o.moveTo(x + r, y);
      o.arc(x, y, r, 0, Math.PI * 2);
    }
  }
  o.fill();
  return out.toDataURL("image/png");
}

/** Lift dark photos: if the mean luminance is low, apply a gamma so midtones open up. */
function brighten(a: Uint8ClampedArray) {
  let sum = 0, n = 0;
  for (let i = 0; i < a.length; i += 16) { sum += 0.299 * a[i] + 0.587 * a[i + 1] + 0.114 * a[i + 2]; n++; }
  const mean = sum / Math.max(1, n) / 255;
  if (mean > 0.42) return;
  const gamma = Math.max(0.45, Math.log(0.5) / Math.log(Math.max(0.05, mean)));
  const lut = new Uint8ClampedArray(256);
  for (let v = 0; v < 256; v++) lut[v] = 255 * Math.pow(v / 255, gamma);
  for (let i = 0; i < a.length; i += 4) { a[i] = lut[a[i]]; a[i + 1] = lut[a[i + 1]]; a[i + 2] = lut[a[i + 2]]; }
}

/**
 * Riso print: paper, then up to three flat ink layers multiplied on top,
 * each nudged 1–2 px (misregistration), with halftone dots in the shadows and
 * a paper grain over everything. Reads like a printed zine, never a broken JPEG.
 */
function riso(src: HTMLCanvasElement, o: { inks: string[]; paper: string; misreg?: number }): string {
  const w = src.width, h = src.height;
  const L = new Float32Array(w * h);
  const sd = src.getContext("2d")!.getImageData(0, 0, w, h).data;
  // smoothed, contrast-stretched luminance (flat ink areas, no JPEG speckle)
  let lo = 255, hi = 0;
  for (let i = 0, p = 0; i < sd.length; i += 4, p++) { const l = 0.299 * sd[i] + 0.587 * sd[i + 1] + 0.114 * sd[i + 2]; L[p] = l; }
  const B = new Float32Array(w * h), r = Math.max(1, Math.round(w / 400));
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    let s = 0, n = 0;
    for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
      const xx = Math.min(w - 1, Math.max(0, x + dx)), yy = Math.min(h - 1, Math.max(0, y + dy));
      s += L[yy * w + xx]; n++;
    }
    const v = s / n; B[y * w + x] = v; if (v < lo) lo = v; if (v > hi) hi = v;
  }
  const span = Math.max(1, hi - lo);
  for (let p = 0; p < B.length; p++) B[p] = (B[p] - lo) / span; // 0 = dark, 1 = light

  const out = document.createElement("canvas");
  out.width = w; out.height = h;
  const g = out.getContext("2d")!;
  g.fillStyle = o.paper; g.fillRect(0, 0, w, h);
  const m = (o.misreg ?? 1.5) * (w / 600);
  const inks = o.inks.slice(0, 3);
  // ink k covers everything darker than its threshold; darker inks cover less
  const thresholds = inks.length >= 3 ? [0.3, 0.52, 0.74] : [0.38, 0.68];
  const layer = (ink: string, t: number, k: number) => {
    const c = document.createElement("canvas");
    c.width = w; c.height = h;
    const cg = c.getContext("2d")!;
    const id = cg.createImageData(w, h);
    const [R, G, Bc] = rgb(ink);
    const cell = Math.max(3, w / 140);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const v = B[y * w + x];
      let on = v < t;
      // shadows of the darkest ink get halftone dots just above the threshold
      if (!on && k === 0 && v < t + 0.16) {
        const u = ((x + y) / cell) % 1, q = ((x - y) / cell) % 1;
        const dist = Math.hypot((u + 1) % 1 - 0.5, (q + 1) % 1 - 0.5);
        on = dist < 0.42 * (1 - (v - t) / 0.16);
      }
      if (!on) continue;
      const i = (y * w + x) * 4;
      id.data[i] = R; id.data[i + 1] = G; id.data[i + 2] = Bc; id.data[i + 3] = 235;
    }
    cg.putImageData(id, 0, 0);
    return c;
  };
  g.globalCompositeOperation = "multiply";
  // light ink first, dark ink last, each knocked slightly off register
  [...inks].reverse().forEach((ink, j) => {
    const k = inks.length - 1 - j;
    const off = k === 0 ? 0 : (k % 2 ? 1 : -1) * m;
    g.drawImage(layer(ink, thresholds[k] ?? 0.5, k), off, k === 0 ? 0 : off * 0.6);
  });
  // paper grain
  g.globalCompositeOperation = "multiply";
  const gd = g.getImageData(0, 0, w, h);
  let seed = 7;
  for (let i = 0; i < gd.data.length; i += 4) {
    seed = (seed * 16807) % 2147483647;
    const n = 1 - ((seed % 1000) / 1000) * 0.09;
    gd.data[i] *= n; gd.data[i + 1] *= n; gd.data[i + 2] *= n;
  }
  g.putImageData(gd, 0, 0);
  return out.toDataURL("image/jpeg", 0.9);
}
