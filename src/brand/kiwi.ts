// Deterministic kiwi-slice geometry, shared by the logo, the hero slice and
// the share card, so every kiwi in the product is the same kiwi.

export function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export interface Ray { x1: number; y1: number; x2: number; y2: number; o: number; w: number }
export interface Seed { x: number; y: number; rx: number; ry: number; rot: number }

export interface KiwiGeometry {
  R: number;
  rays: Ray[];
  seeds: Seed[];
  core: { rx: number; ry: number };
}

/** Rays + seed ring for a slice of radius R, centred on 0,0. */
export function kiwiGeometry(R: number, detail = 1, seed = 7): KiwiGeometry {
  const rand = rng(seed);
  const rays: Ray[] = [];
  const nr = Math.round(110 * detail);
  for (let i = 0; i < nr; i++) {
    const a = (i / nr) * Math.PI * 2 + (rand() - 0.5) * 0.04;
    const r1 = R * 0.24;
    const r2 = R * (0.78 + rand() * 0.13);
    rays.push({
      x1: Math.cos(a) * r1, y1: Math.sin(a) * r1,
      x2: Math.cos(a) * r2, y2: Math.sin(a) * r2,
      o: 0.12 + rand() * 0.14,
      w: R * 0.0035 + 0.3,
    });
  }
  const seeds: Seed[] = [];
  const ns = Math.round(72 * Math.min(1, detail + 0.2));
  for (let i = 0; i < ns; i++) {
    const a = (i / ns) * Math.PI * 2 + (rand() - 0.5) * 0.08;
    const rr = R * (0.26 + rand() * 0.07);
    seeds.push({
      x: Math.cos(a) * rr, y: Math.sin(a) * rr,
      rx: R * 0.011 + 0.4, ry: R * 0.03 + 0.8,
      rot: (a * 180) / Math.PI - 90,
    });
  }
  return { R, rays, seeds, core: { rx: R * 0.2, ry: R * 0.165 } };
}

/** A vertical zig-zag through the centre: the "cut". */
export function cutLine(R: number, seed = 3): [number, number][] {
  const rand = rng(seed);
  const pts: [number, number][] = [];
  let k = 0;
  for (let y = -R - 40; y <= R + 40; y += 24) {
    pts.push([(k++ % 2 ? 8 : -8) + (rand() - 0.5) * 5, y]);
  }
  return pts;
}

export const KIWI = {
  ink: "#0B0D08",
  kiwi: "#8BD630",
  flesh: "#D8F27A",
  seed: "#17140D",
  fuzz: "#8A6A44",
  skin: "#4A3720",
  paper: "#F2F5E6",
} as const;
