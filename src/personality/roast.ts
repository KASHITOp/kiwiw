// Roast My Design (DESIGN.md §13): rule-based critique, written as roasts,
// each with a one-click fix. Roasts the design, never the person.
import type { Element, KiwiwDoc, TextElement } from "../types";
import { nearestWeight } from "../fonts/kit";

export interface Roast {
  id: string;
  title: string;
  roast: string;
  severity: number;
  fix?: (doc: KiwiwDoc) => KiwiwDoc;
}

/* ---------- colour helpers ---------- */
function rgb(hex: string): [number, number, number] | null {
  const m = hex.trim().match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (!m) return null;
  const h = m[1].length === 3 ? m[1].split("").map((c) => c + c).join("") : m[1];
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as [number, number, number];
}
function lum(hex: string) {
  const c = rgb(hex);
  if (!c) return 0.5;
  const [r, g, b] = c.map((v) => { const s = v / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
export const contrast = (a: string, b: string) => { const la = lum(a), lb = lum(b); return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05); };

/** What colour sits behind a text element: the topmost opaque shape/sticker under its centre, else the page. */
function behind(doc: KiwiwDoc, t: TextElement): string {
  const cx = t.x + t.w / 2, cy = t.y + t.h / 2;
  const idx = doc.elements.indexOf(t);
  for (let i = idx - 1; i >= 0; i--) {
    const e = doc.elements[i];
    if (e.hidden || e.opacity < 0.6) continue;
    if (cx < e.x || cx > e.x + e.w || cy < e.y || cy > e.y + e.h) continue;
    if (e.type === "shape" && e.fill !== "transparent") return e.fill;
    if (e.type === "sticker" && ["badge-seal", "badge-pill", "badge-ribbon", "badge-tag", "burst-12", "burst-spiky", "burst-boom", "burst-seal", "paper-scrap", "paper-torn", "bubble-speech", "bubble-round", "bubble-thought", "bubble-shout", "blob-jelly", "blob-outlined"].includes(e.kind)) return e.fill;
  }
  return doc.background;
}

const map = (doc: KiwiwDoc, f: (e: Element) => Element): KiwiwDoc => ({ ...doc, elements: doc.elements.map(f) });
const texts = (doc: KiwiwDoc) => doc.elements.filter((e): e is TextElement => e.type === "text" && !e.hidden && !!e.text.trim());
const decorative = (e: Element) => e.type === "sticker" && /texture|grain|halftone/.test(e.kind);

export function roastDesign(doc: KiwiwDoc): { score: number; roasts: Roast[] } {
  const R: Roast[] = [];
  const T = texts(doc);
  const W = doc.width, H = doc.height, S = Math.min(W, H);

  if (!doc.elements.length) {
    return { score: 100, roasts: [{ id: "empty", title: "Empty canvas", roast: "Bold of you to roast an empty page. It's flawless. Nothing to fix, nothing to love.", severity: 0 }] };
  }

  // 1. too many fonts
  const fams = [...new Set(T.map((t) => t.fontFamily))];
  if (fams.length > 3) {
    // keep the three faces carrying the most ink (size² × characters); fold the rest in
    const ink = (f: string) => T.filter((t) => t.fontFamily === f).reduce((a, t) => a + t.fontSize ** 2 * t.text.length, 0);
    const keep = [...fams].sort((a, b) => ink(b) - ink(a)).slice(0, 3);
    const big = Math.max(...T.map((t) => t.fontSize));
    const sizeOf = (f: string) => Math.max(...T.filter((t) => t.fontFamily === f).map((t) => t.fontSize));
    const display = keep.reduce((a, f) => (sizeOf(f) > sizeOf(a) ? f : a));
    const body = keep.reduce((a, f) => (sizeOf(f) < sizeOf(a) ? f : a));
    R.push({
      id: "fonts", title: `${fams.length} fonts`, severity: 14,
      roast: `${fams.length} fonts? This isn't a ransom note. Unless it is, in which case: committed.`,
      fix: (d) => map(d, (e) => e.type === "text" && !keep.includes(e.fontFamily)
        ? (() => { const f = e.fontSize >= big * 0.5 ? display : body; return { ...e, fontFamily: f, fontWeight: nearestWeight(f, e.fontWeight) }; })()
        : e),
    });
  }

  // 2. low contrast
  const faint = T.filter((t) => contrast(t.color, behind(doc, t)) < (t.fontSize > S * 0.05 ? 3 : 4.5));
  if (faint.length) {
    const worst = faint[0];
    const ratio = contrast(worst.color, behind(doc, worst)).toFixed(1);
    R.push({
      id: "contrast", title: "Low contrast", severity: 16,
      roast: `"${worst.text.slice(0, 24)}${worst.text.length > 24 ? "…" : ""}" is whispering at ${ratio}:1. Even the kiwi is squinting.`,
      fix: (d) => map(d, (e) => {
        if (e.type !== "text" || !faint.some((f) => f.id === e.id)) return e;
        const bg = behind(d, e);
        return { ...e, color: contrast("#0B0B0B", bg) >= contrast("#FFFFFF", bg) ? "#0B0B0B" : "#FFFFFF" };
      }),
    });
  }

  // 3. cramped margins
  const m = S * 0.03;
  const cramped = doc.elements.filter((e) => !e.hidden && !decorative(e) && e.w < W * 0.92 && e.h < H * 0.92 && e.rotation === 0 &&
    (e.x < m || e.y < m || e.x + e.w > W - m || e.y + e.h > H - m) && e.x > -e.w * 0.5 && e.y > -e.h * 0.5);
  if (cramped.length >= 2) {
    const pad = S * 0.06;
    R.push({
      id: "margins", title: "Cramped margins", severity: 10,
      roast: `${cramped.length} things are hugging the edges like it's the last metro home.`,
      fix: (d) => map(d, (e) => cramped.some((c) => c.id === e.id)
        ? { ...e, x: Math.min(Math.max(e.x, pad), W - e.w - pad), y: Math.min(Math.max(e.y, pad), H - e.h - pad) }
        : e),
    });
  }

  // 4. everything centred
  if (T.length >= 3 && T.every((t) => t.align === "center") && T.every((t) => Math.abs(t.x + t.w / 2 - W / 2) < W * 0.04)) {
    R.push({
      id: "centered", title: "Everything centred", severity: 8,
      roast: "Everything is centred. Bold choice. By which we mean the default one.",
      fix: (d) => map(d, (e) => e.type === "text" ? { ...e, align: "left", x: S * 0.08 } : e),
    });
  }

  // 5. tiny text
  const tiny = T.filter((t) => t.fontSize < S * 0.018);
  if (tiny.length) {
    R.push({
      id: "tiny", title: "Microscopic text", severity: 8,
      roast: "Some text is so small it needs a magnifying glass and a lawyer.",
      fix: (d) => map(d, (e) => e.type === "text" && tiny.some((t) => t.id === e.id) ? { ...e, fontSize: S * 0.022, h: Math.max(e.h, S * 0.03) } : e),
    });
  }

  // 6. no hierarchy
  if (T.length >= 2) {
    const sizes = T.map((t) => t.fontSize);
    const big = Math.max(...sizes), small = Math.min(...sizes);
    if (big / small < 1.6) {
      const hero = T.find((t) => t.fontSize === big)!;
      R.push({
        id: "hierarchy", title: "No hierarchy", severity: 12,
        roast: "Every line is the same size. So who's the main character here?",
        fix: (d) => map(d, (e) => e.id === hero.id && e.type === "text" ? { ...e, fontSize: e.fontSize * 1.7, h: e.h * 1.7, fontWeight: nearestWeight(e.fontFamily, 800) } : e),
      });
    }
  }

  // 7. wall of text
  const words = T.reduce((a, t) => a + t.text.split(/\s+/).length, 0);
  if (words > 70) R.push({ id: "words", title: "Wall of text", severity: 8, roast: `That's ${words} words. This is a poster, not a terms-and-conditions page.` });

  // 8. wandered off the page
  const lost = doc.elements.filter((e) => e.x > W || e.y > H || e.x + e.w < 0 || e.y + e.h < 0);
  if (lost.length) {
    R.push({
      id: "lost", title: "Lost elements", severity: 6,
      roast: `${lost.length} thing${lost.length > 1 ? "s" : ""} wandered off the page. We've sent a search party.`,
      fix: (d) => map(d, (e) => lost.some((l) => l.id === e.id) ? { ...e, x: (W - e.w) / 2, y: (H - e.h) / 2 } : e),
    });
  }

  // 9. too many colours
  const colors = new Set(doc.elements.flatMap((e) => e.type === "text" ? [e.color] : e.type === "shape" ? [e.fill] : e.type === "sticker" ? [e.fill] : []).map((c) => c.toLowerCase()).filter((c) => c !== "transparent"));
  if (colors.size > 7) R.push({ id: "colors", title: "Colour overload", severity: 6, roast: `${colors.size} colours. Pick a palette, not a fight.` });

  const score = Math.max(5, 100 - R.reduce((a, r) => a + r.severity, 0));
  if (!R.length) R.push({ id: "clean", title: "No notes", severity: 0, roast: "Honestly? Juicy. We have notes, but they're all compliments." });
  return { score, roasts: R };
}

export const verdict = (score: number) =>
  score >= 90 ? "Freshly squeezed" : score >= 75 ? "Pretty juicy" : score >= 55 ? "Needs a squeeze" : score >= 35 ? "Mostly pulp" : "Kiwi-adjacent";
