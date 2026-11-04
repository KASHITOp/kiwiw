// Sticker Library 2.0 helpers (DESIGN.md §17). Shared paths + a compact
// builder so each set file reads like a catalogue, not boilerplate.
import type { JSX } from "react";
import type { StickerCategory, StickerColors, StickerDef, ColorSlot } from "../library";

export type Art = (p: { c: StickerColors; uid: string }) => JSX.Element;

interface Opts {
  vb?: [number, number];
  size?: [number, number];
  uses?: ColorSlot[];
  border?: StickerDef["border"];
  stretch?: boolean;
}

/** One sticker. Colours: [fill, accent, ink]. */
export const S = (
  kind: string, name: string, category: StickerCategory, tags: string[],
  colors: [string, string, string], Art: Art, o: Opts = {},
): StickerDef => ({
  kind, name, category, tags, Art,
  vb: o.vb ?? [100, 100],
  size: o.size ?? [240, 240],
  uses: o.uses ?? ["fill", "accent", "ink"],
  colors: { fill: colors[0], accent: colors[1], ink: colors[2] },
  border: o.border ?? "white",
  stretch: o.stretch,
});

/** Heart in a 100x90 box. */
export const HEART = "M50,86 C20,64 4,46 4,28 C4,12 16,4 28,4 C38,4 46,10 50,18 C54,10 62,4 72,4 C84,4 96,12 96,28 C96,46 80,64 50,86Z";
/** Heart scaled to centre (cx, cy) with half-width r. */
export const heartAt = (cx: number, cy: number, r: number) => `translate(${cx - r} ${cy - r * 0.9}) scale(${r / 50})`;

/** Concave four-point sparkle. */
export const sparkle = (cx: number, cy: number, r: number, k = 0.18) =>
  `M${cx},${cy - r} Q${cx + r * k},${cy - r * k} ${cx + r},${cy} Q${cx + r * k},${cy + r * k} ${cx},${cy + r} Q${cx - r * k},${cy + r * k} ${cx - r},${cy} Q${cx - r * k},${cy - r * k} ${cx},${cy - r}Z`;

/** Red-lip silhouette in a 100x60 box (upper + lower lip). */
export const LIP_UP = "M6,30 C16,22 26,10 38,12 C44,13 47,17 50,19 C53,17 56,13 62,12 C74,10 84,22 94,30 C80,31 66,30 50,32 C34,30 20,31 6,30Z";
export const LIP_LO = "M6,30 C20,31 34,30 50,32 C66,30 80,31 94,30 C86,44 70,54 50,54 C30,54 14,44 6,30Z";

/** Glossy radial gradient defs; returns url(). */
export function Gloss({ id, base, dark, hi = "#FFFFFF" }: { id: string; base: string; dark: string; hi?: string }) {
  return (
    <radialGradient id={id} cx=".35" cy=".28" r=".85">
      <stop offset="0" stopColor={hi} /><stop offset=".22" stopColor={base} /><stop offset=".8" stopColor={dark} /><stop offset="1" stopColor={dark} />
    </radialGradient>
  );
}

/** Silver chrome: banded linear gradient. */
export function Chrome({ id, tint = "#FFFFFF", angle = 90 }: { id: string; tint?: string; angle?: number }) {
  return (
    <linearGradient id={id} gradientTransform={`rotate(${angle} .5 .5)`}>
      <stop offset="0" stopColor="#5A5F6B" /><stop offset=".22" stopColor={tint} /><stop offset=".42" stopColor="#8B92A1" />
      <stop offset=".55" stopColor="#2E323B" /><stop offset=".7" stopColor="#C9CED8" /><stop offset=".86" stopColor={tint} /><stop offset="1" stopColor="#6B7280" />
    </linearGradient>
  );
}

/** Halftone dot pattern (B&W cutout look). */
export function Dots({ id, ink, size = 4, r = 1.3 }: { id: string; ink: string; size?: number; r?: number }) {
  return (
    <pattern id={id} width={size} height={size} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <circle cx={size / 2} cy={size / 2} r={r} fill={ink} />
    </pattern>
  );
}

/** SVG text with sensible defaults. */
export function T({ x, y, s, f, c, w = 400, a = "middle", ls = 0, it, children, rot, stroke, sw }: {
  x: number; y: number; s: number; f: string; c: string; w?: number; a?: "start" | "middle" | "end"; ls?: number; it?: boolean;
  children: React.ReactNode; rot?: number; stroke?: string; sw?: number;
}) {
  return (
    <text x={x} y={y} fontSize={s} fontFamily={f} fill={c} fontWeight={w} textAnchor={a} letterSpacing={ls}
      fontStyle={it ? "italic" : undefined} transform={rot ? `rotate(${rot} ${x} ${y})` : undefined}
      stroke={stroke} strokeWidth={sw} paintOrder={stroke ? "stroke" : undefined} strokeLinejoin="round">
      {children}
    </text>
  );
}

export const ink = { stroke: "#111", strokeWidth: 2.4, strokeLinejoin: "round", strokeLinecap: "round" } as const;
export const line = (c: string, w = 2.4) => ({ stroke: c, strokeWidth: w, strokeLinejoin: "round", strokeLinecap: "round", fill: "none" }) as const;
