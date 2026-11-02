// Juice It, step 3 helper: fit any text into a box by measuring it for real
// (canvas measureText with the actual web font), choosing the line breaks that
// allow the largest size. This is why a 3-word and a 12-word idea both fit.

let ctx: CanvasRenderingContext2D | null = null;
const getCtx = () => (ctx ??= document.createElement("canvas").getContext("2d"));

function width(text: string, family: string, weight: number, italic: boolean, size: number, trackingEm: number) {
  const c = getCtx();
  if (!c) return text.length * size * 0.6; // non-browser fallback
  c.font = `${italic ? "italic " : ""}${weight} ${size}px "${family}"`;
  return c.measureText(text).width + Math.max(0, text.length - 1) * trackingEm * size;
}

/** Split words into k lines minimising the widest line (small inputs, so brute-force DP is fine). */
function bestSplit(words: string[], k: number, measure: (s: string) => number): string[] {
  const n = words.length;
  if (k >= n) return words.slice();
  const memo = new Map<string, { w: number; lines: string[] }>();
  const go = (i: number, left: number): { w: number; lines: string[] } => {
    const key = `${i}:${left}`;
    const hit = memo.get(key);
    if (hit) return hit;
    let best: { w: number; lines: string[] };
    if (left === 1) {
      const line = words.slice(i).join(" ");
      best = { w: measure(line), lines: [line] };
    } else {
      best = { w: Infinity, lines: [] };
      for (let j = i + 1; j <= n - left + 1; j++) {
        const line = words.slice(i, j).join(" ");
        const lw = measure(line);
        if (lw >= best.w) break;
        const sub = go(j, left - 1);
        const w = Math.max(lw, sub.w);
        if (w < best.w) best = { w, lines: [line, ...sub.lines] };
      }
    }
    memo.set(key, best);
    return best;
  };
  return go(0, k).lines;
}

export interface FitOpts {
  family: string;
  weight?: number;
  italic?: boolean;
  maxW: number;
  maxH: number;
  maxSize: number;
  minSize?: number;
  lineHeight?: number;
  trackingEm?: number;
  maxLines?: number;
  uppercase?: boolean;
}

export interface Fit { size: number; lines: string[]; text: string; h: number; w: number }

export function fitText(input: string, o: FitOpts): Fit {
  const text = o.uppercase ? input.toUpperCase() : input;
  const words = text.split(/\s+/).filter(Boolean);
  const lh = o.lineHeight ?? 1, weight = o.weight ?? 400, tr = o.trackingEm ?? 0;
  const at100 = (s: string) => width(s, o.family, weight, !!o.italic, 100, tr);
  let best: Fit = { size: o.minSize ?? 10, lines: [text], text, h: 0, w: 0 };
  const maxLines = Math.min(o.maxLines ?? 4, Math.max(1, words.length));
  for (let k = 1; k <= maxLines; k++) {
    const lines = bestSplit(words, k, at100);
    const widest = Math.max(...lines.map(at100));
    const size = Math.max(o.minSize ?? 10, Math.min(o.maxSize, (o.maxW / widest) * 100 * 0.97, o.maxH / (k * lh)));
    if (size > best.size + 0.5) best = { size, lines, text: lines.join("\n"), h: size * lh * k, w: (widest * size) / 100 };
  }
  if (!best.h) best = { ...best, h: best.size * lh * best.lines.length, w: (at100(best.text) * best.size) / 100 };
  return best;
}

/** Wait for the fonts a juice run will measure with. */
export async function ensureFonts(specs: string[]) {
  if (typeof document === "undefined" || !document.fonts) return;
  await Promise.all(specs.map((s) => document.fonts.load(s).catch(() => [])));
}
