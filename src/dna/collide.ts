// Collision check (DESIGN.md §16): nothing drawn on top of a text element may
// cover its glyphs. Stickers, shapes and much smaller text that sit above a
// text element in z-order are tested against the text's measured ink box and
// nudged out of the way (or shrunk, if there's nowhere to go).
import type { Element, KiwiwDoc, TextElement } from "../types";

interface Box { x: number; y: number; w: number; h: number }

let ctx: CanvasRenderingContext2D | null = null;
const measure = (t: TextElement, line: string) => {
  ctx ??= document.createElement("canvas").getContext("2d");
  if (!ctx) return line.length * t.fontSize * 0.55;
  ctx.font = `${t.italic ? "italic " : ""}${t.fontWeight} ${t.fontSize}px "${t.fontFamily}"`;
  return ctx.measureText(t.uppercase ? line.toUpperCase() : line).width + t.letterSpacing * line.length;
};

/** Where the glyphs really are (not the whole text box). */
export function inkBox(t: TextElement): Box {
  const lines = t.text.split("\n");
  const w = Math.min(t.w, Math.max(...lines.map((l) => measure(t, l))));
  const h = Math.min(t.h, lines.length * t.fontSize * t.lineHeight);
  const x = t.align === "left" ? t.x : t.align === "right" ? t.x + t.w - w : t.x + (t.w - w) / 2;
  return { x, y: t.y + (t.h - h) / 2, w, h };
}

/** Axis-aligned bounds of a (possibly rotated) element. */
function aabb(e: Element): Box {
  const r = ((e.rotation || 0) * Math.PI) / 180;
  const c = Math.abs(Math.cos(r)), s = Math.abs(Math.sin(r));
  const w = e.w * c + e.h * s, h = e.w * s + e.h * c;
  return { x: e.x + e.w / 2 - w / 2, y: e.y + e.h / 2 - h / 2, w, h };
}

const overlap = (a: Box, b: Box) => Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x)) * Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y));

/** Is `e` a candidate to cover text? Big backgrounds and frames are not. */
function isCover(e: Element, doc: KiwiwDoc, under: TextElement): boolean {
  if (e.hidden || e.opacity < 0.3 || e.allowOverlap) return false;
  if (e.w * e.h > doc.width * doc.height * 0.35) return false;
  if (e.type === "sticker") return !e.kind.startsWith("bg-") && !/texture|halftone|grain/.test(e.kind);
  if (e.type === "shape") return e.fill !== "transparent" && !e.frame && !e.fill.includes("gradient");
  // giant decorative letters (Swiss Drop) are meant to be overlapped by type
  if (e.type === "text") return under.fontSize < doc.height * 0.25 && e.fontSize < under.fontSize * 0.35 && !!e.text.trim();
  return false;
}

export interface Fix { id: string; name: string; action: "nudged" | "shrunk" }

/** Returns a copy of the doc with covering elements moved; `fixes` lists what changed. */
export function resolveCollisions(doc: KiwiwDoc): { doc: KiwiwDoc; fixes: Fix[] } {
  const els = doc.elements.map((e) => ({ ...e })) as Element[];
  const fixes: Fix[] = [];
  const texts = (upto: number) => els.slice(0, upto).filter((e): e is TextElement => e.type === "text" && !e.hidden && !!e.text.trim() && e.opacity > 0.3);
  const hits = (b: Box, i: number) => texts(i).filter((t) => isCover(els[i], doc, t)).map((t) => overlap(b, inkBox(t))).reduce((a, v) => a + v, 0);

  els.forEach((e, i) => {
    const b = aabb(e);
    const area = b.w * b.h;
    if (!area || hits(b, i) < area * 0.06) return;
    // 1) nudge: try 16 directions, smallest move that clears the text and stays on the page

    let best = null as { dx: number; dy: number; d: number } | null;
    for (let step = 1; step <= 24 && !best; step++) {
      const dist = step * Math.max(b.w, b.h) * 0.08;
      for (let k = 0; k < 16; k++) {
        const a = (k / 16) * Math.PI * 2, dx = Math.cos(a) * dist, dy = Math.sin(a) * dist;
        const nb = { ...b, x: b.x + dx, y: b.y + dy };
        if (nb.x < -nb.w * 0.25 || nb.y < -nb.h * 0.25 || nb.x + nb.w > doc.width + nb.w * 0.25 || nb.y + nb.h > doc.height + nb.h * 0.25) continue;
        if (hits(nb, i) < area * 0.02 && (!best || dist < best.d)) best = { dx, dy, d: dist };
      }
      if (best && best.d > Math.min(doc.width, doc.height) * 0.3) best = null;
    }
    if (best) { e.x += best.dx; e.y += best.dy; fixes.push({ id: e.id, name: e.name ?? e.type, action: "nudged" }); return; }
    // 2) shrink towards the corner furthest from the text, down to 45%
    for (let s = 0.9; s >= 0.45; s -= 0.05) {
      const cx = e.x + e.w / 2, cy = e.y + e.h / 2;
      const w = e.w * s, h = e.h * s;
      const cand = [[cx - e.w / 2, cy - e.h / 2], [cx + e.w / 2 - w, cy - e.h / 2], [cx - e.w / 2, cy + e.h / 2 - h], [cx + e.w / 2 - w, cy + e.h / 2 - h]];
      for (const [x, y] of cand) {
        const nb = aabb({ ...e, x, y, w, h } as Element);
        if (hits(nb, i) < nb.w * nb.h * 0.02) {
          const k = s;
          Object.assign(e, { x, y, w, h }, e.type === "text" ? { fontSize: e.fontSize * k } : {});
          fixes.push({ id: e.id, name: e.name ?? e.type, action: "shrunk" });
          return;
        }
      }
    }

  });
  return { doc: { ...doc, elements: els }, fixes };
}
