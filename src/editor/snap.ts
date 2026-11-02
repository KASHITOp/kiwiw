// Smart snapping (DESIGN.md §14): edges + centres (pink) and equal spacing (lime).
export interface Box { x: number; y: number; w: number; h: number }
export interface Guide { x1: number; y1: number; x2: number; y2: number; kind: "edge" | "space" }

interface Hit { d: number; delta: number; guides: Guide[] }

const overlaps = (a0: number, a1: number, b0: number, b1: number) => a0 < b1 && b0 < a1;

/** One axis. "x" works on x/w with y/h as the cross axis; "y" swaps them. */
function axis(m: Box, others: Box[], page: Box, thr: number, ax: "x" | "y"): Hit | null {
  const P = (b: Box) => (ax === "x" ? b.x : b.y);
  const S = (b: Box) => (ax === "x" ? b.w : b.h);
  const Q = (b: Box) => (ax === "x" ? b.y : b.x);
  const T = (b: Box) => (ax === "x" ? b.h : b.w);
  const line = (at: number, c0: number, c1: number, kind: Guide["kind"]): Guide =>
    ax === "x" ? { x1: at, y1: c0, x2: at, y2: c1, kind } : { x1: c0, y1: at, x2: c1, y2: at, kind };
  const seg = (a: number, b: number, c: number): Guide =>
    ax === "x" ? { x1: a, y1: c, x2: b, y2: c, kind: "space" } : { x1: c, y1: a, x2: c, y2: b, kind: "space" };

  let best: Hit | null = null;
  const offer = (delta: number, guides: () => Guide[]) => {
    const d = Math.abs(delta);
    if (d <= thr && (!best || d < best.d - 0.01)) best = { d, delta, guides: guides() };
  };

  // edges + centres
  const pts = [P(m), P(m) + S(m) / 2, P(m) + S(m)];
  for (const o of [page, ...others]) {
    const isPage = o === page;
    const cands = [P(o), P(o) + S(o) / 2, P(o) + S(o)];
    for (const c of cands)
      for (const p of pts)
        offer(c - p, () => {
          const c0 = isPage ? Q(page) : Math.min(Q(o), Q(m));
          const c1 = isPage ? Q(page) + T(page) : Math.max(Q(o) + T(o), Q(m) + T(m));
          return [line(c, c0, c1, "edge")];
        });
  }

  // equal spacing among neighbours that share the cross axis
  const row = others.filter((o) => overlaps(Q(o), Q(o) + T(o), Q(m), Q(m) + T(m)));
  const before = row.filter((o) => P(o) + S(o) <= P(m) + thr).sort((a, b) => P(b) + S(b) - (P(a) + S(a)));
  const after = row.filter((o) => P(o) >= P(m) + S(m) - thr).sort((a, b) => P(a) - P(b));
  const L = before[0], R = after[0];
  const mid = (a: Box) => Math.max(Q(a), Q(m)) / 2 + Math.min(Q(a) + T(a), Q(m) + T(m)) / 2;
  if (L && R) {
    const target = (P(L) + S(L) + P(R) - S(m)) / 2;
    offer(target - P(m), () => {
      const g0 = P(L) + S(L), g1 = P(R);
      return [seg(g0, target, mid(L)), seg(target + S(m), g1, mid(R))];
    });
  }
  if (L && before[1]) {
    const LL = before[1], gap = P(L) - (P(LL) + S(LL));
    if (gap > 0) offer(P(L) + S(L) + gap - P(m), () => [seg(P(LL) + S(LL), P(L), mid(LL)), seg(P(L) + S(L), P(L) + S(L) + gap, mid(L))]);
  }
  if (R && after[1]) {
    const RR = after[1], gap = P(RR) - (P(R) + S(R));
    if (gap > 0) offer(P(R) - gap - S(m) - P(m), () => [seg(P(R) - gap, P(R), mid(R)), seg(P(R) + S(R), P(RR), mid(RR))]);
  }
  return best;
}

export function snap(m: Box, others: Box[], page: Box, thr: number) {
  const hx = axis(m, others, page, thr, "x");
  const hy = axis(m, others, page, thr, "y");
  const dx = hx?.delta ?? 0, dy = hy?.delta ?? 0;
  // guides were computed before the shift on the other axis; nudge them along
  const gx = (hx?.guides ?? []).map((g) => (g.kind === "space" ? { ...g, y1: g.y1 + dy, y2: g.y2 + dy } : g));
  const gy = (hy?.guides ?? []).map((g) => (g.kind === "space" ? { ...g, x1: g.x1 + dx, x2: g.x2 + dx } : g));
  return { dx, dy, guides: [...gx, ...gy] };
}

export const unionBox = (bs: Box[]): Box => {
  const x = Math.min(...bs.map((b) => b.x)), y = Math.min(...bs.map((b) => b.y));
  return { x, y, w: Math.max(...bs.map((b) => b.x + b.w)) - x, h: Math.max(...bs.map((b) => b.y + b.h)) - y };
};
