// The 1200x630 link-preview card (og:image). Built only from Kiwiw elements and
// exported with the editor's own pipeline. Not part of the template gallery.
import type { Element, KiwiwDoc } from "../types";
import { kiwiGeometry, cutLine } from "../brand/kiwi";

let n = 0;
const id = () => `sc${n++}`;
const text = (p: Partial<Extract<Element, { type: "text" }>>): Element => ({
  id: id(), type: "text", x: 0, y: 0, w: 400, h: 80, rotation: 0, opacity: 1,
  text: "Text", fontSize: 48, fontFamily: "Inter", color: "#0B0D08",
  fontWeight: 700, align: "left", lineHeight: 1.2, letterSpacing: 0, ...p,
});
const shape = (p: Partial<Extract<Element, { type: "shape" }>>): Element => ({
  id: id(), type: "shape", x: 0, y: 0, w: 200, h: 200, rotation: 0, opacity: 1,
  shape: "rect", fill: "#8BD630", stroke: "#0B0D08", strokeWidth: 0, radius: 16, ...p,
});

/**
 * 1200×630 link-preview card, built only from Kiwiw elements. The site's
 * og:image is exported from this template with the editor's own pipeline.
 */
export function shareCard(): KiwiwDoc {
  const cx = 950, cy = 315, R = 245;
  const g = kiwiGeometry(R, 0.8, 7);
  const els: Element[] = [];
  const ellipse = (p: Partial<Extract<Element, { type: "shape" }>>) => shape({ shape: "ellipse", radius: 0, ...p });
  const ring = (r: number, fill: string) => ellipse({ x: cx - r, y: cy - r, w: 2 * r, h: 2 * r, fill });

  // rind, skin and flesh (stepped rings stand in for the radial gradient)
  els.push(ring(R, "#8A6A44"), ring(R * 0.95, "#4A3720"), ring(R * 0.935, "#8BD630"),
    ring(R * 0.72, "#A8E048"), ring(R * 0.52, "#C6EC62"), ring(R * 0.36, "#E6F6A2"));
  // rays
  g.rays.filter((_, i) => i % 2 === 0).forEach((r) => {
    const len = Math.hypot(r.x2 - r.x1, r.y2 - r.y1);
    const mx = (r.x1 + r.x2) / 2, my = (r.y1 + r.y2) / 2;
    const ang = (Math.atan2(r.y2 - r.y1, r.x2 - r.x1) * 180) / Math.PI;
    els.push(shape({ x: cx + mx - len / 2, y: cy + my - 0.75, w: len, h: 1.5, rotation: ang, fill: "#F4FBD6", opacity: r.o, radius: 0 }));
  });
  // core + seed ring
  els.push(ellipse({ x: cx - g.core.rx, y: cy - g.core.ry, w: 2 * g.core.rx, h: 2 * g.core.ry, fill: "#F7FBE5" }));
  g.seeds.forEach((s) => els.push(ellipse({ x: cx + s.x - s.rx, y: cy + s.y - s.ry, w: 2 * s.rx, h: 2 * s.ry, rotation: s.rot, fill: "#17140D" })));
  // the cut: a zig-zag of short ink strokes through the middle
  const pts = cutLine(R, 3).filter(([, y]) => Math.abs(y) <= R * 0.97);
  for (let i = 1; i < pts.length; i++) {
    const [x1, y1] = pts[i - 1], [x2, y2] = pts[i];
    const len = Math.hypot(x2 - x1, y2 - y1) + 2;
    const ang = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
    els.push(shape({ x: cx + (x1 + x2) / 2 - len / 2, y: cy + (y1 + y2) / 2 - 2.5, w: len, h: 5, rotation: ang, fill: "#0B0D08", radius: 2 }));
  }

  // words
  els.push(
    text({ x: 72, y: 84, w: 600, h: 22, text: "[01] FIG. 1 · A KIWI, CUT CLEAN IN HALF", fontSize: 15, fontFamily: "JetBrains Mono", color: "#D8F27A", fontWeight: 500, letterSpacing: 1.5 }),
    text({ x: 66, y: 122, w: 620, h: 92, text: "Plain idea in.", fontSize: 88, fontFamily: "Bricolage Grotesque Variable", color: "#F2F5E6", fontWeight: 800, letterSpacing: -3.5, lineHeight: 0.95 }),
    text({ x: 66, y: 210, w: 620, h: 92, text: "Juicy design out.", fontSize: 88, fontFamily: "Bricolage Grotesque Variable", color: "#8BD630", fontWeight: 800, letterSpacing: -3.5, lineHeight: 0.95 }),
    text({ x: 70, y: 326, w: 520, h: 66, text: "Type the plain version. Kiwiw hands back the juicy one.", fontSize: 23, color: "#B4BCA2", fontWeight: 400, lineHeight: 1.4 }),
    shape({ x: 70, y: 430, w: 292, h: 64, fill: "#8BD630", radius: 32 }),
    text({ x: 70, y: 430, w: 292, h: 64, text: "Start cutting →", fontSize: 22, color: "#0B0D08", fontWeight: 600, align: "center", lineHeight: 1 }),
    text({ x: 72, y: 540, w: 420, h: 22, text: "KIWIW.VERCEL.APP", fontSize: 15, fontFamily: "JetBrains Mono", color: "#6B7360", fontWeight: 500, letterSpacing: 1.8 }),
    text({ x: 728, y: 586, w: 440, h: 20, text: "SEEDS · 72 (WE COUNTED)", fontSize: 13, fontFamily: "JetBrains Mono", color: "#9AA28A", fontWeight: 500, letterSpacing: 1.3, align: "right" }),
  );

  return { width: 1200, height: 630, background: "#0B0D08", elements: els };
}
