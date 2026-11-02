// Seeded geometry for hand-drawn-looking stickers (DESIGN.md §11).
import { rng } from "../brand/kiwi";

export type Pt = [number, number];

const f = (n: number) => n.toFixed(1);
const fp = (p: Pt) => `${f(p[0])},${f(p[1])}`;

/** Closed Catmull-Rom spline through the points, as cubic Béziers. */
export function smoothClosed(pts: Pt[], tension = 1): string {
  const n = pts.length;
  let d = `M${fp(pts[0])}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    const c1: Pt = [p1[0] + ((p2[0] - p0[0]) / 6) * tension, p1[1] + ((p2[1] - p0[1]) / 6) * tension];
    const c2: Pt = [p2[0] - ((p3[0] - p1[0]) / 6) * tension, p2[1] - ((p3[1] - p1[1]) / 6) * tension];
    d += ` C${fp(c1)} ${fp(c2)} ${fp(p2)}`;
  }
  return d + "Z";
}

/** Open Catmull-Rom spline through the points. */
export function smoothOpen(pts: Pt[]): string {
  const p = [pts[0], ...pts, pts[pts.length - 1]];
  let d = `M${fp(pts[0])}`;
  for (let i = 1; i < p.length - 2; i++) {
    const p0 = p[i - 1], p1 = p[i], p2 = p[i + 1], p3 = p[i + 2];
    const c1: Pt = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: Pt = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${fp(c1)} ${fp(c2)} ${fp(p2)}`;
  }
  return d;
}

export const poly = (pts: Pt[]) => `M${pts.map(fp).join(" L")}Z`;
export const polyline = (pts: Pt[]) => `M${pts.map(fp).join(" L")}`;

/** Irregular blob points around a centre. */
export function blobPts(seed: number, n = 8, irregular = 0.28, cx = 50, cy = 50, r = 44, sy = 1): Pt[] {
  const rand = rng(seed);
  return Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2 + (rand() - 0.5) * 0.35;
    const rr = r * (1 - irregular / 2 + irregular * rand());
    return [cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * sy] as Pt;
  });
}

/** Star / burst points, optionally with seeded jitter on the radii. */
export function starPts(n: number, ro: number, ri: number, cx = 50, cy = 50, rot = -90, jitter = 0, seed = 1): Pt[] {
  const rand = rng(seed);
  const pts: Pt[] = [];
  for (let i = 0; i < n * 2; i++) {
    const a = ((rot + (i * 180) / n) * Math.PI) / 180;
    const base = i % 2 === 0 ? ro : ri;
    const r = base * (1 - jitter / 2 + jitter * rand());
    pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
  }
  return pts;
}

/** A circle with scalloped bumps (seals, marigolds, clouds). */
export function scallop(n: number, R: number, depth: number, cx = 50, cy = 50): string {
  let d = "";
  for (let i = 0; i < n; i++) {
    const a0 = (i / n) * Math.PI * 2, a1 = ((i + 1) / n) * Math.PI * 2, am = (a0 + a1) / 2;
    const p0: Pt = [cx + Math.cos(a0) * R, cy + Math.sin(a0) * R];
    const p1: Pt = [cx + Math.cos(a1) * R, cy + Math.sin(a1) * R];
    const c: Pt = [cx + Math.cos(am) * (R + depth * 2), cy + Math.sin(am) * (R + depth * 2)];
    d += (i === 0 ? `M${fp(p0)}` : "") + ` Q${fp(c)} ${fp(p1)}`;
  }
  return d + "Z";
}

/** Nudge every point by up to `amp`, deterministically. */
export function wobble(pts: Pt[], seed: number, amp: number): Pt[] {
  const rand = rng(seed);
  return pts.map(([x, y]) => [x + (rand() - 0.5) * amp * 2, y + (rand() - 0.5) * amp * 2] as Pt);
}

/** Two short strokes forming an arrowhead at `tip`, pointing along `angle` (radians). */
export function arrowHead(tip: Pt, angle: number, len = 16, spread = 0.5): string {
  const a1 = angle + Math.PI - spread, a2 = angle + Math.PI + spread;
  return `M${fp([tip[0] + Math.cos(a1) * len, tip[1] + Math.sin(a1) * len])} L${fp(tip)} L${fp([tip[0] + Math.cos(a2) * len, tip[1] + Math.sin(a2) * len])}`;
}

/** Jagged edge points between two x positions (torn paper, tape ends). */
export function tornEdge(x0: number, x1: number, y: number, seed: number, step = 7, amp = 4): Pt[] {
  const rand = rng(seed);
  const pts: Pt[] = [];
  for (let x = x0; x <= x1; x += step) pts.push([x, y + (rand() - 0.5) * amp * 2]);
  pts.push([x1, y]);
  return pts;
}

export function zigX(x: number, y0: number, y1: number, seed: number, step = 6, amp = 3): Pt[] {
  const rand = rng(seed);
  const pts: Pt[] = [];
  for (let y = y0; y <= y1; y += step) pts.push([x + (rand() - 0.5) * amp * 2, y]);
  pts.push([x, y1]);
  return pts;
}
