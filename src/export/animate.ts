// Animated export (DESIGN.md §20). The design assembles itself in ~5s:
// background wipe → photos bounce → headline slams → texts → stickers pop →
// CTA stamps last. Each element is rasterised ONCE (same renderer as the PNG
// export), then frames are composited on a canvas, so it records in real time.
import type { Element, KiwiwDoc } from "../types";
import { GIFEncoder, quantize, applyPalette } from "gifenc";

export type Preset = "slam" | "peel" | "type";
export const PRESETS: { id: Preset; name: string; joke: string }[] = [
  { id: "slam", name: "Slam", joke: "headline enters like it owns the place" },
  { id: "peel", name: "Peel", joke: "everything peels on like a sticker" },
  { id: "type", name: "Typewriter", joke: "dramatic typing, zero typos" },
];

type Role = "back" | "image" | "head" | "text" | "sticker" | "cta";
export interface Layer {
  bmp: CanvasImageSource; x: number; y: number; w: number; h: number; // crop box in page px
  role: Role; start: number; dur: number; chars: number; color: string;
}
export const DURATION = 5, HOLD = 1.2;

const isBack = (e: Element, d: KiwiwDoc) =>
  (e.type === "sticker" && (e.kind.startsWith("bg-") || /texture|grain/.test(e.kind))) ||
  (e.type !== "text" && e.type !== "image" && (e.w * e.h >= d.width * d.height * 0.6 || e.w >= d.width * 0.92 || e.h >= d.height * 0.92));

/** Roles + timing for every visible element (index-aligned with doc.elements). */
export function plan(doc: KiwiwDoc): { role: Role; start: number; dur: number }[] {
  const els = doc.elements;
  const texts = els.filter((e) => e.type === "text" && !e.hidden);
  const head = [...texts].sort((a, b) => (b.type === "text" ? b.fontSize : 0) - (a.type === "text" ? a.fontSize : 0))[0];
  // CTA: an explicit cta, else the lowest text sitting on a pill/badge
  const onPill = (t: Element) => els.some((s) => s.type === "shape" && t.x + t.w / 2 > s.x && t.x + t.w / 2 < s.x + s.w && t.y + t.h / 2 > s.y && t.y + t.h / 2 < s.y + s.h && s.w * s.h < doc.width * doc.height * 0.3);
  const cta = texts.find((t) => t.type === "text" && t.role === "cta") ?? [...texts].filter((t) => t !== head && onPill(t)).sort((a, b) => b.y - a.y)[0];
  const ctaBox = cta ? els.filter((s) => s === cta || (s.type === "shape" && cta.x + cta.w / 2 > s.x && cta.x + cta.w / 2 < s.x + s.w && cta.y + cta.h / 2 > s.y && cta.y + cta.h / 2 < s.y + s.h && s.w * s.h < doc.width * doc.height * 0.3)) : [];
  const roleOf = (e: Element): Role => ctaBox.includes(e) ? "cta" : isBack(e, doc) ? "back" : e === head ? "head" : e.type === "image" ? "image" : e.type === "text" ? "text" : "sticker";
  const roles = els.map(roleOf);
  const order = (r: Role) => els.map((e, i) => ({ e, i })).filter((x) => roles[x.i] === r).sort((a, b) => a.e.y - b.e.y);
  const out = els.map((_, i) => ({ role: roles[i], start: 0, dur: 0.5 }));
  order("back").forEach(({ i }, k) => Object.assign(out[i], { start: k * 0.12, dur: 0.7 }));
  order("image").forEach(({ i }, k) => Object.assign(out[i], { start: 0.55 + k * 0.25, dur: 0.75 }));
  order("head").forEach(({ i }) => Object.assign(out[i], { start: 1.4, dur: 0.5 }));
  order("text").forEach(({ i }, k) => Object.assign(out[i], { start: 2.0 + k * 0.22, dur: 0.45 }));
  const st = order("sticker");
  st.forEach(({ i }, k) => Object.assign(out[i], { start: 2.5 + k * Math.min(0.14, 1.3 / Math.max(1, st.length)), dur: 0.45 }));
  order("cta").forEach(({ i }) => Object.assign(out[i], { start: 4.1, dur: 0.45 }));
  return out;
}

const clamp = (v: number) => Math.max(0, Math.min(1, v));
const outCubic = (p: number) => 1 - Math.pow(1 - p, 3);
const outBack = (p: number) => { const c = 1.9; return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2); };

/** Draw one frame at time t. */
export function drawFrame(ctx: CanvasRenderingContext2D, doc: KiwiwDoc, layers: Layer[], preset: Preset, t: number) {
  ctx.clearRect(0, 0, doc.width, doc.height);
  ctx.fillStyle = doc.background;
  ctx.globalAlpha = preset === "type" ? clamp(t / 0.5) : 1;
  ctx.fillRect(0, 0, doc.width, doc.height);
  for (const L of layers) {
    const dur = preset === "type" && (L.role === "text" || L.role === "head") ? Math.min(1.6, 0.25 + L.chars * 0.045) : L.dur;
    const p = clamp((t - L.start) / dur);
    if (p <= 0) continue;
    const e = outCubic(p), b = outBack(p);
    let a = 1, s = 1, sx = 1, r = 0, dx = 0, dy = 0, clipX = 1, clipY = 1;
    if (L.role === "back") {
      if (preset === "slam") clipX = e; else if (preset === "peel") clipY = e; else a = e;
    } else if (L.role === "cta") {
      s = 1.9 - 0.9 * e; r = -10 * (1 - e); a = clamp(p * 3);
    } else if (preset === "slam") {
      if (L.role === "head") { s = 1 + 1.7 * (1 - e); a = clamp(p * 4); const k = t - L.start - dur; if (k > 0 && k < 0.28) { dx = Math.sin(k * 90) * 9 * (1 - k / 0.28); dy = Math.cos(k * 70) * 5 * (1 - k / 0.28); } }
      else if (L.role === "image") { s = 0.6 + 0.4 * b; dy = -doc.height * 0.12 * (1 - b); a = clamp(p * 3); }
      else if (L.role === "text") { dy = 46 * (1 - e); a = e; }
      else { s = Math.max(0, b); r = -28 * (1 - e); }
    } else if (preset === "peel") {
      r = -14 * (1 - e); dx = -70 * (1 - e); dy = -46 * (1 - e); sx = 0.35 + 0.65 * b; a = clamp(p * 2.5);
    } else {
      if (L.role === "text" || L.role === "head") { clipX = Math.round(p * L.chars) / Math.max(1, L.chars); }
      else if (L.role === "image") { s = 1.06 - 0.06 * e; a = e; }
      else { s = Math.max(0, b); a = clamp(p * 2); }
    }
    ctx.save();
    ctx.globalAlpha = a;
    const cx = L.x + L.w / 2 + dx, cy = L.y + L.h / 2 + dy;
    ctx.translate(cx, cy);
    ctx.rotate((r * Math.PI) / 180);
    ctx.scale(s * sx, s);
    if (clipX < 1 || clipY < 1) { ctx.beginPath(); ctx.rect(-L.w / 2, -L.h / 2, L.w * clipX, L.h * clipY); ctx.clip(); }
    ctx.drawImage(L.bmp, -L.w / 2, -L.h / 2, L.w, L.h);
    ctx.restore();
    // typewriter caret
    if (preset === "type" && (L.role === "text" || L.role === "head") && p < 1 && Math.floor(t * 4) % 2 === 0) {
      ctx.fillStyle = L.color;
      ctx.fillRect(L.x + L.w * clipX, L.y + L.h * 0.18, Math.max(3, L.h * 0.05), L.h * 0.64);
    }
  }
}

/** Best video type this browser can record. */
export function videoType(): { mime: string; ext: "mp4" | "webm" } {
  const opts: [string, "mp4" | "webm"][] = [["video/mp4;codecs=avc1", "mp4"], ["video/mp4", "mp4"], ["video/webm;codecs=vp9", "webm"], ["video/webm", "webm"]];
  for (const [m, ext] of opts) if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(m)) return { mime: m, ext };
  return { mime: "video/webm", ext: "webm" };
}

/** Real-time recording of the animation from a canvas. */
export function recordVideo(doc: KiwiwDoc, layers: Layer[], preset: Preset, onProgress: (p: number) => void): Promise<{ blob: Blob; ext: string }> {
  const { mime, ext } = videoType();
  const canvas = document.createElement("canvas");
  canvas.width = doc.width; canvas.height = doc.height;
  const ctx = canvas.getContext("2d")!;
  drawFrame(ctx, doc, layers, preset, 0);
  const stream = canvas.captureStream(30);
  const rec = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 8_000_000 });
  const chunks: Blob[] = [];
  rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);
  return new Promise((resolve, reject) => {
    rec.onstop = () => resolve({ blob: new Blob(chunks, { type: mime.split(";")[0] }), ext });
    rec.onerror = () => reject(new Error("MediaRecorder failed"));
    rec.start(250);
    const t0 = performance.now(), total = DURATION + HOLD;
    const tick = () => {
      const t = (performance.now() - t0) / 1000;
      drawFrame(ctx, doc, layers, preset, Math.min(t, DURATION));
      onProgress(Math.min(1, t / total));
      if (t < total) requestAnimationFrame(tick); else rec.stop();
    };
    requestAnimationFrame(tick);
  });
}

/** Offline GIF (12fps, half size) with gifenc. */
export async function encodeGif(doc: KiwiwDoc, layers: Layer[], preset: Preset, onProgress: (p: number) => void): Promise<Blob> {
  const k = Math.min(1, 540 / doc.width), W = Math.round(doc.width * k), H = Math.round(doc.height * k);
  const big = document.createElement("canvas"); big.width = doc.width; big.height = doc.height;
  const small = document.createElement("canvas"); small.width = W; small.height = H;
  const bctx = big.getContext("2d")!, sctx = small.getContext("2d", { willReadFrequently: true })!;
  const fps = 12, frames = Math.round((DURATION + HOLD) * fps);
  const gif = GIFEncoder();
  for (let f = 0; f < frames; f++) {
    drawFrame(bctx, doc, layers, preset, Math.min(f / fps, DURATION));
    sctx.clearRect(0, 0, W, H);
    sctx.drawImage(big, 0, 0, W, H);
    const { data } = sctx.getImageData(0, 0, W, H);
    const palette = quantize(data, 256);
    gif.writeFrame(applyPalette(data, palette), W, H, { palette, delay: Math.round(1000 / fps) });
    onProgress((f + 1) / frames);
    if (f % 4 === 0) await new Promise((r) => setTimeout(r, 0));
  }
  gif.finish();
  return new Blob([gif.bytes() as Uint8Array<ArrayBuffer>], { type: "image/gif" });
}

/** Crop box (page px) around an element, rotation and borders included. */
export function cropBox(e: Element) {
  const rad = (e.rotation * Math.PI) / 180, c = Math.abs(Math.cos(rad)), s = Math.abs(Math.sin(rad));
  const w = e.w * c + e.h * s, h = e.w * s + e.h * c;
  const pad = Math.max(24, Math.min(e.w, e.h) * 0.18);
  return { x: e.x + e.w / 2 - w / 2 - pad, y: e.y + e.h / 2 - h / 2 - pad, w: w + 2 * pad, h: h + 2 * pad };
}
