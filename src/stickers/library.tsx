// Kiwiw's own sticker library (DESIGN.md §11). Every piece is original SVG,
// drawn here or generated from seeded geometry. Up to three colour slots each.
import type { JSX } from "react";
import { kiwiGeometry } from "../brand/kiwi";
import {
  type Pt, smoothClosed, smoothOpen, poly, polyline, blobPts, starPts, scallop,
  wobble, arrowHead, tornEdge, zigX,
} from "./geometry";

export interface StickerColors { fill: string; accent: string; ink: string }
export type ColorSlot = keyof StickerColors;

export const STICKER_CATEGORIES = [
  "Blobs", "Bursts", "Badges", "Scribbles", "Arrows", "Tape & paper",
  "Bubbles", "Lines", "Texture", "Kiwi", "Desi",
] as const;
export type StickerCategory = (typeof STICKER_CATEGORIES)[number];

export interface StickerDef {
  kind: string;
  name: string;
  category: StickerCategory;
  tags: string[];
  /** viewBox width / height. */
  vb: [number, number];
  /** Default size on a ~1080px canvas. */
  size: [number, number];
  /** Stretch to the element box instead of letterboxing. */
  stretch?: boolean;
  uses: ColorSlot[];
  colors: StickerColors;
  Art: (p: { c: StickerColors; uid: string }) => JSX.Element;
}

const INK = "#0B0D08";
const round = { strokeLinecap: "round", strokeLinejoin: "round", fill: "none" } as const;

/* ----------------------------------------------------------------- shared */

const kiwiG = kiwiGeometry(40, 0.45, 11);

function KiwiDisc({ c, face }: { c: StickerColors; face?: boolean }) {
  return (
    <g transform="translate(50 50)">
      <circle r="47" fill="#8A6A44" />
      <circle r="44.5" fill="#4A3720" />
      <circle r="43.5" fill={c.fill} />
      <circle r="28" fill={c.accent} opacity="0.55" />
      {kiwiG.rays.filter((_, i) => i % 2 === 0).map((r, i) => (
        <line key={i} x1={r.x1} y1={r.y1} x2={r.x2 * 1.02} y2={r.y2 * 1.02} stroke="#F4FBD6" strokeOpacity={r.o} strokeWidth="0.8" />
      ))}
      <ellipse rx="9.5" ry="8" fill="#F7FBE5" />
      {kiwiG.seeds.map((s, i) => (
        <ellipse key={i} cx={s.x * 1.02} cy={s.y * 1.02} rx="1.1" ry="2.6" transform={`rotate(${s.rot} ${s.x * 1.02} ${s.y * 1.02})`} fill={c.ink} />
      ))}
      {face && (
        <g>
          <circle cx="-3.6" cy="-1.5" r="1.4" fill={c.ink} />
          <circle cx="3.6" cy="-1.5" r="1.4" fill={c.ink} />
          <path d="M-3.4 2.2 Q0 5.4 3.4 2.2" stroke={c.ink} strokeWidth="1.2" {...round} />
          <ellipse cx="-6.4" cy="2.2" rx="1.8" ry="1" fill="#FF7FB3" opacity="0.85" />
          <ellipse cx="6.4" cy="2.2" rx="1.8" ry="1" fill="#FF7FB3" opacity="0.85" />
        </g>
      )}
    </g>
  );
}

function wave(width: number, y: number, amp: number, period: number): string {
  let d = `M0,${y}`;
  for (let x = 0; x < width; x += period) d += ` q${period / 4},${-amp} ${period / 2},0 t${period / 2},0`;
  return d;
}

/* ---------------------------------------------------------- definitions */

const blob = (kind: string, name: string, pts: Pt[], tags: string[], outline = false): StickerDef => ({
  kind, name, category: "Blobs", tags: ["blob", "shape", ...tags], vb: [100, 100], size: [320, 320],
  uses: outline ? ["fill", "ink"] : ["fill"], colors: { fill: "#8BD630", accent: "#D8F27A", ink: INK },
  Art: ({ c }) => <path d={smoothClosed(pts)} fill={c.fill} stroke={outline ? c.ink : "none"} strokeWidth={outline ? 3.5 : 0} strokeLinejoin="round" />,
});

const DEFS: StickerDef[] = [
  /* Blobs */
  blob("blob-jelly", "Jelly blob", blobPts(3, 7, 0.3), ["jelly", "organic"]),
  blob("blob-puddle", "Puddle", blobPts(9, 9, 0.22, 50, 50, 46, 0.68), ["puddle", "flat"]),
  blob("blob-bean", "Bean", [[18, 42], [42, 20], [76, 24], [90, 50], [72, 76], [44, 72], [24, 66]], ["bean", "pill"]),
  blob("blob-amoeba", "Amoeba", blobPts(21, 11, 0.42), ["amoeba", "weird"]),
  blob("blob-cloud", "Cloud blob", Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2; const r = i % 2 ? 36 : 45; return [50 + Math.cos(a) * r, 50 + Math.sin(a) * r * 0.82] as Pt; }), ["cloud", "soft"]),
  blob("blob-outlined", "Outlined blob", blobPts(5, 8, 0.3), ["outline", "sticker"], true),

  /* Bursts */
  {
    kind: "burst-12", name: "Starburst", category: "Bursts", tags: ["star", "new", "sale", "badge"], vb: [100, 100], size: [300, 300],
    uses: ["fill", "ink"], colors: { fill: "#FF3B1F", accent: "#FFFFFF", ink: INK },
    Art: ({ c }) => <path d={poly(starPts(12, 48, 35))} fill={c.fill} stroke={c.ink} strokeWidth="2.5" strokeLinejoin="round" />,
  },
  {
    kind: "burst-spiky", name: "Spiky burst", category: "Bursts", tags: ["spike", "explosion", "loud"], vb: [100, 100], size: [300, 300],
    uses: ["fill"], colors: { fill: "#D8F27A", accent: "#FFFFFF", ink: INK },
    Art: ({ c }) => <path d={poly(starPts(24, 49, 37, 50, 50, -90, 0.16, 7))} fill={c.fill} />,
  },
  {
    kind: "burst-rays", name: "Sunburst rays", category: "Bursts", tags: ["sun", "rays", "retro", "cinema"], vb: [100, 100], size: [520, 520],
    uses: ["fill", "accent"], colors: { fill: "#F6A21E", accent: "#D7261E", ink: INK },
    Art: ({ c }) => (
      <g>
        {Array.from({ length: 18 }, (_, i) => {
          const a0 = (i / 18) * Math.PI * 2, a1 = a0 + Math.PI / 18;
          return <path key={i} d={`M50,50 L${50 + Math.cos(a0) * 70},${50 + Math.sin(a0) * 70} L${50 + Math.cos(a1) * 70},${50 + Math.sin(a1) * 70}Z`} fill={c.fill} />;
        })}
        <circle cx="50" cy="50" r="12" fill={c.accent} />
      </g>
    ),
  },
  {
    kind: "burst-seal", name: "Wavy seal", category: "Bursts", tags: ["seal", "wavy", "award"], vb: [100, 100], size: [280, 280],
    uses: ["fill", "accent"], colors: { fill: "#FF4FA3", accent: "#FFFFFF", ink: INK },
    Art: ({ c }) => (
      <g>
        <path d={scallop(18, 42, 3.4)} fill={c.fill} />
        <circle cx="50" cy="50" r="34" fill="none" stroke={c.accent} strokeWidth="1.6" strokeDasharray="3 3" />
      </g>
    ),
  },
  {
    kind: "burst-sparkle", name: "Sparkle", category: "Bursts", tags: ["sparkle", "shine", "star", "magic"], vb: [100, 100], size: [180, 180],
    uses: ["fill"], colors: { fill: "#D8F27A", accent: "#FFFFFF", ink: INK },
    Art: ({ c }) => <path d="M50,2 Q55,45 98,50 Q55,55 50,98 Q45,55 2,50 Q45,45 50,2Z" fill={c.fill} />,
  },
  {
    kind: "burst-boom", name: "Boom", category: "Bursts", tags: ["boom", "comic", "pow", "explosion"], vb: [100, 100], size: [320, 320],
    uses: ["fill", "accent", "ink"], colors: { fill: "#FFE14D", accent: "#FF3B1F", ink: INK },
    Art: ({ c }) => (
      <g>
        <path d={poly(starPts(14, 48, 30, 50, 50, -80, 0.3, 13))} fill={c.fill} stroke={c.ink} strokeWidth="2.5" strokeLinejoin="round" />
        <path d={poly(starPts(10, 28, 17, 50, 50, -70, 0.3, 17))} fill={c.accent} />
      </g>
    ),
  },

  /* Badges */
  {
    kind: "badge-seal", name: "Seal badge", category: "Badges", tags: ["seal", "certified", "badge", "award"], vb: [100, 100], size: [260, 260],
    uses: ["fill", "accent"], colors: { fill: "#0B0D08", accent: "#D8F27A", ink: INK },
    Art: ({ c }) => (
      <g>
        <path d={scallop(26, 45, 1.8)} fill={c.fill} />
        <circle cx="50" cy="50" r="37" fill="none" stroke={c.accent} strokeWidth="1.8" />
        <circle cx="50" cy="50" r="33.5" fill="none" stroke={c.accent} strokeWidth="0.8" />
      </g>
    ),
  },
  {
    kind: "badge-ribbon", name: "Ribbon banner", category: "Badges", tags: ["ribbon", "banner", "title", "retro"], vb: [200, 64], size: [560, 180],
    uses: ["fill", "accent", "ink"], colors: { fill: "#D7261E", accent: "#8E1A14", ink: INK },
    Art: ({ c }) => (
      <g>
        <path d="M0,22 H30 V58 H0 L10,40Z" fill={c.accent} />
        <path d="M200,22 H170 V58 H200 L190,40Z" fill={c.accent} />
        <path d="M22,48 L30,58 V48Z M178,48 L170,58 V48Z" fill={c.ink} opacity="0.55" />
        <rect x="22" y="6" width="156" height="42" fill={c.fill} />
      </g>
    ),
  },
  {
    kind: "badge-tag", name: "Price tag", category: "Badges", tags: ["price", "tag", "sale", "shop"], vb: [140, 80], size: [340, 194],
    uses: ["fill", "ink"], colors: { fill: "#F6A21E", accent: "#FFFFFF", ink: INK },
    Art: ({ c }) => (
      <g>
        <path d="M32,6 H130 Q136,6 136,12 V68 Q136,74 130,74 H32 L4,40Z" fill={c.fill} stroke={c.ink} strokeWidth="3" strokeLinejoin="round" />
        <circle cx="26" cy="40" r="6" fill="#FFFFFF" stroke={c.ink} strokeWidth="3" />
      </g>
    ),
  },
  {
    kind: "badge-ticket", name: "Ticket stub", category: "Badges", tags: ["ticket", "event", "admit", "cinema"], vb: [160, 80], size: [400, 200],
    uses: ["fill", "ink"], colors: { fill: "#F7E7C6", accent: "#FFFFFF", ink: "#2A160E" },
    Art: ({ c }) => (
      <g>
        <path d="M10,4 H72 A8,8 0 0 0 88,4 H150 Q156,4 156,10 V70 Q156,76 150,76 H88 A8,8 0 0 0 72,76 H10 Q4,76 4,70 V10 Q4,4 10,4Z" fill={c.fill} stroke={c.ink} strokeWidth="2.5" />
        <line x1="80" y1="14" x2="80" y2="66" stroke={c.ink} strokeWidth="2" strokeDasharray="4 4" />
      </g>
    ),
  },
  {
    kind: "badge-pill", name: "Pill label", category: "Badges", tags: ["pill", "label", "chip", "button"], vb: [200, 70], size: [440, 154],
    uses: ["fill", "ink"], colors: { fill: "#FFFFFF", accent: "#FFFFFF", ink: INK },
    Art: ({ c }) => <rect x="3" y="3" width="194" height="64" rx="32" fill={c.fill} stroke={c.ink} strokeWidth="3.5" />,
  },
  {
    kind: "badge-rosette", name: "Rosette", category: "Badges", tags: ["rosette", "winner", "award", "first"], vb: [100, 130], size: [240, 312],
    uses: ["fill", "accent"], colors: { fill: "#F6A21E", accent: "#D7261E", ink: INK },
    Art: ({ c }) => (
      <g>
        <path d="M36,70 L22,124 L36,114 L46,128 L54,76Z M64,70 L78,124 L64,114 L54,128 L46,76Z" fill={c.accent} />
        <path d={scallop(20, 40, 3)} fill={c.fill} />
        <circle cx="50" cy="50" r="28" fill="none" stroke={c.accent} strokeWidth="2" />
      </g>
    ),
  },

  /* Scribbles */
  {
    kind: "scribble-ball", name: "Scribble coil", category: "Scribbles", tags: ["scribble", "messy", "doodle", "coil"], vb: [100, 60], size: [320, 192],
    uses: ["ink"], colors: { fill: "#000000", accent: "#000000", ink: INK },
    Art: ({ c }) => {
      // a pen looping back and forth: a coil that drifts right
      const pts: Pt[] = [];
      for (let u = 0; u <= 1.0001; u += 0.012) pts.push([12 + 76 * u + 9 * Math.cos(u * Math.PI * 14), 30 + 20 * Math.sin(u * Math.PI * 14) * (0.75 + 0.25 * Math.sin(u * 9))]);
      return <path d={smoothOpen(wobble(pts, 31, 0.6))} stroke={c.ink} strokeWidth="2.6" {...round} />;
    },
  },
  {
    kind: "scribble-circle", name: "Circled", category: "Scribbles", tags: ["circle", "highlight", "this one", "doodle"], vb: [100, 70], size: [420, 294],
    uses: ["ink"], colors: { fill: "#000000", accent: "#000000", ink: "#FF3B1F" },
    Art: ({ c }) => {
      const pts: Pt[] = [];
      for (let t = -0.35; t <= Math.PI * 2 + 0.7; t += 0.35) pts.push([50 + Math.cos(t) * (46 - t * 0.6), 35 + Math.sin(t) * (30 - t * 0.5)]);
      return <path d={smoothOpen(wobble(pts, 4, 1.2))} stroke={c.ink} strokeWidth="2.6" {...round} />;
    },
  },
  {
    kind: "scribble-x", name: "Cross-out", category: "Scribbles", tags: ["x", "nope", "cross", "wrong"], vb: [100, 100], size: [200, 200],
    uses: ["ink"], colors: { fill: "#000000", accent: "#000000", ink: "#FF3B1F" },
    Art: ({ c }) => <path d="M12,14 Q46,46 88,88 M86,12 Q52,50 14,86" stroke={c.ink} strokeWidth="9" {...round} />,
  },
  {
    kind: "scribble-star", name: "Doodle star", category: "Scribbles", tags: ["star", "doodle", "gold star"], vb: [100, 100], size: [200, 200],
    uses: ["ink"], colors: { fill: "#000000", accent: "#000000", ink: INK },
    Art: ({ c }) => <path d={poly(wobble(starPts(5, 46, 19, 50, 54), 8, 2.2))} stroke={c.ink} strokeWidth="3.4" {...round} />,
  },
  {
    kind: "scribble-spiral", name: "Spiral", category: "Scribbles", tags: ["spiral", "hypnotic", "dizzy"], vb: [100, 100], size: [200, 200],
    uses: ["ink"], colors: { fill: "#000000", accent: "#000000", ink: INK },
    Art: ({ c }) => {
      const pts: Pt[] = [];
      for (let t = 0; t < Math.PI * 7; t += 0.45) pts.push([50 + Math.cos(t) * (2 + t * 2.05), 50 + Math.sin(t) * (2 + t * 2.05)]);
      return <path d={smoothOpen(pts)} stroke={c.ink} strokeWidth="3" {...round} />;
    },
  },

  /* Arrows */
  {
    kind: "arrow-swoop", name: "Swoop arrow", category: "Arrows", tags: ["arrow", "curve", "look"], vb: [160, 100], size: [380, 238],
    uses: ["ink"], colors: { fill: "#000000", accent: "#000000", ink: INK },
    Art: ({ c }) => <path d={`M10,84 C38,14 108,4 146,42 ${arrowHead([146, 42], Math.atan2(38, 38), 18)}`} stroke={c.ink} strokeWidth="5" {...round} />,
  },
  {
    kind: "arrow-loop", name: "Loop arrow", category: "Arrows", tags: ["arrow", "loop", "playful"], vb: [180, 100], size: [420, 233],
    uses: ["ink"], colors: { fill: "#000000", accent: "#000000", ink: INK },
    Art: ({ c }) => <path d={`M8,72 C40,72 58,22 86,30 C112,38 94,78 76,62 C58,46 100,18 132,40 C146,50 156,54 170,48 ${arrowHead([170, 48], Math.atan2(-6, 14), 16)}`} stroke={c.ink} strokeWidth="5" {...round} />,
  },
  {
    kind: "arrow-straight", name: "Wobbly arrow", category: "Arrows", tags: ["arrow", "straight", "this way"], vb: [160, 40], size: [400, 100],
    uses: ["ink"], colors: { fill: "#000000", accent: "#000000", ink: INK },
    Art: ({ c }) => <path d={`M6,24 Q50,14 92,22 T150,20 ${arrowHead([150, 20], -0.03, 16)}`} stroke={c.ink} strokeWidth="5" {...round} />,
  },
  {
    kind: "arrow-drop", name: "Drop arrow", category: "Arrows", tags: ["arrow", "down", "scroll"], vb: [100, 160], size: [200, 320],
    uses: ["ink"], colors: { fill: "#000000", accent: "#000000", ink: INK },
    Art: ({ c }) => <path d={`M62,8 C8,42 92,92 42,146 ${arrowHead([42, 146], Math.atan2(54, -50), 18)}`} stroke={c.ink} strokeWidth="5" {...round} />,
  },

  /* Tape & paper */
  {
    kind: "tape-clear", name: "Tape strip", category: "Tape & paper", tags: ["tape", "stuck", "collage"], vb: [200, 50], size: [320, 80], stretch: true,
    uses: ["fill"], colors: { fill: "#FFE98A", accent: "#FFFFFF", ink: INK },
    Art: ({ c }) => <path d={poly([...zigX(6, 4, 46, 3), ...zigX(194, 4, 46, 5).reverse()])} fill={c.fill} opacity="0.82" />,
  },
  {
    kind: "tape-masking", name: "Masking tape", category: "Tape & paper", tags: ["tape", "masking", "kraft"], vb: [200, 50], size: [320, 80], stretch: true,
    uses: ["fill", "accent"], colors: { fill: "#E8D5A8", accent: "#CDB47E", ink: INK },
    Art: ({ c }) => (
      <g>
        <path d={poly([...zigX(6, 4, 46, 9), ...zigX(194, 4, 46, 12).reverse()])} fill={c.fill} />
        {[14, 24, 34].map((y) => <line key={y} x1="14" y1={y} x2="186" y2={y} stroke={c.accent} strokeWidth="0.6" />)}
      </g>
    ),
  },
  {
    kind: "paper-torn", name: "Torn paper", category: "Tape & paper", tags: ["paper", "torn", "rip", "note"], vb: [200, 120], size: [600, 360], stretch: true,
    uses: ["fill"], colors: { fill: "#FFFFFF", accent: "#FFFFFF", ink: INK },
    Art: ({ c }) => <path d={poly([...tornEdge(0, 200, 8, 21), ...tornEdge(0, 200, 112, 22).reverse()])} fill={c.fill} />,
  },
  {
    kind: "paper-scrap", name: "Paper scrap", category: "Tape & paper", tags: ["paper", "scrap", "note", "zine"], vb: [120, 100], size: [360, 300],
    uses: ["fill", "ink"], colors: { fill: "#FFE14D", accent: "#FFFFFF", ink: INK },
    Art: ({ c }) => {
      const pts: Pt[] = [[8, 12], [112, 6], [116, 90], ...tornEdge(6, 110, 96, 33, 8, 3).reverse()];
      return (
        <g>
          <path d={poly(pts)} fill={c.ink} transform="translate(5 5)" />
          <path d={poly(pts)} fill={c.fill} />
        </g>
      );
    },
  },

  /* Bubbles */
  {
    kind: "bubble-speech", name: "Speech bubble", category: "Bubbles", tags: ["speech", "talk", "quote", "chat"], vb: [140, 112], size: [420, 336],
    uses: ["fill", "ink"], colors: { fill: "#FFFFFF", accent: "#FFFFFF", ink: INK },
    Art: ({ c }) => <path d="M22,4 H118 Q136,4 136,22 V64 Q136,82 118,82 H58 L28,106 L34,82 H22 Q4,82 4,64 V22 Q4,4 22,4Z" fill={c.fill} stroke={c.ink} strokeWidth="3.5" strokeLinejoin="round" />,
  },
  {
    kind: "bubble-round", name: "Round speech", category: "Bubbles", tags: ["speech", "round", "talk"], vb: [140, 120], size: [400, 343],
    uses: ["fill", "ink"], colors: { fill: "#D8F27A", accent: "#FFFFFF", ink: INK },
    Art: ({ c }) => <path d="M70,6 C108,6 136,26 136,52 C136,78 108,98 70,98 C62,98 55,97 48,95 L18,114 L28,86 C12,77 4,65 4,52 C4,26 32,6 70,6Z" fill={c.fill} stroke={c.ink} strokeWidth="3.5" strokeLinejoin="round" />,
  },
  {
    kind: "bubble-thought", name: "Thought cloud", category: "Bubbles", tags: ["thought", "think", "cloud", "dream"], vb: [140, 120], size: [400, 343],
    uses: ["fill", "ink"], colors: { fill: "#FFFFFF", accent: "#FFFFFF", ink: INK },
    Art: ({ c }) => {
      const pts = Array.from({ length: 14 }, (_, i) => { const a = (i / 14) * Math.PI * 2; const r = i % 2 ? 0.86 : 1; return [72 + Math.cos(a) * 62 * r, 46 + Math.sin(a) * 40 * r] as Pt; });
      return (
        <g fill={c.fill} stroke={c.ink} strokeWidth="3.5">
          <path d={smoothClosed(pts)} strokeLinejoin="round" />
          <circle cx="24" cy="98" r="8" />
          <circle cx="10" cy="113" r="4.5" />
        </g>
      );
    },
  },
  {
    kind: "bubble-shout", name: "Shout bubble", category: "Bubbles", tags: ["shout", "yell", "loud", "comic"], vb: [140, 120], size: [420, 360],
    uses: ["fill", "ink"], colors: { fill: "#FF4FA3", accent: "#FFFFFF", ink: INK },
    Art: ({ c }) => {
      const pts = starPts(16, 1, 0.78, 0, 0, -90, 0.22, 41).map(([x, y]) => [70 + x * 66, 52 + y * 46] as Pt);
      pts.splice(12, 0, [22, 118]);
      return <path d={poly(pts)} fill={c.fill} stroke={c.ink} strokeWidth="3.5" strokeLinejoin="round" />;
    },
  },

  /* Lines */
  {
    kind: "line-squiggle", name: "Squiggle underline", category: "Lines", tags: ["underline", "squiggle", "wave"], vb: [300, 40], size: [480, 64], stretch: true,
    uses: ["fill"], colors: { fill: "#FF3B1F", accent: "#FFFFFF", ink: INK },
    Art: ({ c }) => <path d={wave(300, 20, 13, 40)} stroke={c.fill} strokeWidth="6" {...round} />,
  },
  {
    kind: "line-swoosh", name: "Marker swoosh", category: "Lines", tags: ["underline", "marker", "brush", "highlight"], vb: [300, 50], size: [520, 86], stretch: true,
    uses: ["fill"], colors: { fill: "#D8F27A", accent: "#FFFFFF", ink: INK },
    Art: ({ c }) => <path d="M4,34 C70,14 190,6 296,14 C230,22 130,30 10,44 Q2,42 4,34Z" fill={c.fill} />,
  },
  {
    kind: "line-double", name: "Double underline", category: "Lines", tags: ["underline", "double", "emphasis"], vb: [300, 40], size: [480, 64], stretch: true,
    uses: ["fill"], colors: { fill: "#0B0D08", accent: "#FFFFFF", ink: INK },
    Art: ({ c }) => <path d="M6,14 Q150,6 294,12 M16,30 Q150,22 286,28" stroke={c.fill} strokeWidth="5" {...round} />,
  },
  {
    kind: "line-zigzag", name: "Zigzag line", category: "Lines", tags: ["zigzag", "line", "edgy"], vb: [300, 40], size: [480, 64], stretch: true,
    uses: ["fill"], colors: { fill: "#0B0D08", accent: "#FFFFFF", ink: INK },
    Art: ({ c }) => <path d={polyline(Array.from({ length: 16 }, (_, i) => [4 + i * 19.5, i % 2 ? 32 : 8] as Pt))} stroke={c.fill} strokeWidth="5" {...round} />,
  },

  /* Texture */
  {
    kind: "texture-halftone", name: "Halftone dots", category: "Texture", tags: ["halftone", "dots", "print", "pop art"], vb: [100, 100], size: [360, 360],
    uses: ["fill"], colors: { fill: "#0B0D08", accent: "#FFFFFF", ink: INK },
    Art: ({ c }) => (
      <g fill={c.fill}>
        {Array.from({ length: 11 * 11 }, (_, k) => {
          const i = k % 11, j = Math.floor(k / 11), r = 4.4 * (1 - (i + j) / 21);
          return r > 0.25 ? <circle key={k} cx={4.5 + i * 9.1} cy={4.5 + j * 9.1} r={r} /> : null;
        })}
      </g>
    ),
  },
  {
    kind: "texture-halftone-radial", name: "Halftone glow", category: "Texture", tags: ["halftone", "dots", "radial", "spotlight"], vb: [100, 100], size: [360, 360],
    uses: ["fill"], colors: { fill: "#FF4FA3", accent: "#FFFFFF", ink: INK },
    Art: ({ c }) => (
      <g fill={c.fill}>
        {Array.from({ length: 13 * 13 }, (_, k) => {
          const i = k % 13, j = Math.floor(k / 13), x = 4 + i * 7.7, y = 4 + j * 7.7;
          const r = 3.6 * (1 - Math.hypot(x - 50, y - 50) / 62);
          return r > 0.25 ? <circle key={k} cx={x} cy={y} r={r} /> : null;
        })}
      </g>
    ),
  },
  {
    kind: "texture-grain", name: "Grain overlay", category: "Texture", tags: ["grain", "noise", "film", "texture"], vb: [100, 100], size: [1080, 1080], stretch: true,
    uses: [], colors: { fill: "#000000", accent: "#FFFFFF", ink: INK },
    Art: ({ uid }) => (
      <g>
        <filter id={`g${uid}`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves={3} stitchTiles="stitch" />
          <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.9 0" />
        </filter>
        <rect width="100" height="100" filter={`url(#g${uid})`} opacity="0.35" />
      </g>
    ),
  },

  /* Kiwi */
  {
    kind: "kiwi-slice", name: "Kiwi slice", category: "Kiwi", tags: ["kiwi", "fruit", "slice", "brand"], vb: [100, 100], size: [280, 280],
    uses: ["fill", "accent", "ink"], colors: { fill: "#8BD630", accent: "#D8F27A", ink: "#17140D" },
    Art: ({ c }) => <KiwiDisc c={c} />,
  },
  {
    kind: "kiwi-happy", name: "Happy kiwi", category: "Kiwi", tags: ["kiwi", "cute", "face", "mascot", "kawaii"], vb: [100, 100], size: [280, 280],
    uses: ["fill", "accent", "ink"], colors: { fill: "#8BD630", accent: "#D8F27A", ink: "#17140D" },
    Art: ({ c }) => <KiwiDisc c={c} face />,
  },
  {
    kind: "kiwi-half", name: "Half kiwi", category: "Kiwi", tags: ["kiwi", "half", "fruit"], vb: [100, 56], size: [320, 180],
    uses: ["fill", "accent", "ink"], colors: { fill: "#8BD630", accent: "#D8F27A", ink: "#17140D" },
    Art: ({ c, uid }) => (
      <g>
        <clipPath id={`h${uid}`}><rect x="0" y="50" width="100" height="56" /></clipPath>
        <g clipPath={`url(#h${uid})`} transform="translate(0 -44)"><KiwiDisc c={c} /></g>
        <rect x="3" y="4" width="94" height="2.2" fill="#EEF9BE" opacity="0.8" />
      </g>
    ),
  },
  {
    kind: "kiwi-bird", name: "Kiwi bird", category: "Kiwi", tags: ["kiwi", "bird", "mascot", "animal"], vb: [110, 100], size: [300, 273],
    uses: ["fill", "ink"], colors: { fill: "#8A6A44", accent: "#D8F27A", ink: "#17140D" },
    Art: ({ c }) => (
      <g>
        <path d="M60,34 C80,26 92,34 92,46 C92,52 88,56 82,58 C80,80 62,90 42,88 C20,86 6,72 8,54 C10,36 30,28 60,34Z" fill={c.fill} />
        {[[24, 50], [34, 44], [46, 46], [30, 62], [44, 60], [58, 52], [54, 70], [38, 74]].map(([x, y], i) => (
          <path key={i} d={`M${x},${y} q3,-3 6,0`} stroke={c.ink} strokeOpacity="0.35" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        ))}
        <path d="M88,44 Q100,50 106,66" stroke={c.ink} strokeWidth="3" {...round} />
        <circle cx="82" cy="40" r="2.6" fill={c.ink} />
        <path d="M40,86 L38,97 M38,97 L32,99 M38,97 L42,99 M56,86 L58,97 M58,97 L52,99 M58,97 L63,99" stroke={c.ink} strokeWidth="2.4" {...round} />
      </g>
    ),
  },

  /* Desi */
  {
    kind: "desi-diya", name: "Diya", category: "Desi", tags: ["diya", "diwali", "lamp", "festival", "deepavali"], vb: [100, 100], size: [220, 220],
    uses: ["fill", "accent", "ink"], colors: { fill: "#F6A21E", accent: "#B4471C", ink: "#2A160E" },
    Art: ({ c }) => (
      <g>
        <path d="M50,8 C60,24 64,36 50,50 C36,36 40,24 50,8Z" fill={c.fill} />
        <path d="M50,24 C55,32 56,39 50,46 C44,39 45,32 50,24Z" fill="#FFE8A3" />
        <path d="M8,58 Q50,104 92,58 Q74,68 50,68 Q26,68 8,58Z" fill={c.accent} stroke={c.ink} strokeWidth="2.5" strokeLinejoin="round" />
        <ellipse cx="50" cy="60" rx="42" ry="7" fill="#8E3414" stroke={c.ink} strokeWidth="2.5" />
        {[30, 50, 70].map((x) => <circle key={x} cx={x} cy="78" r="2.2" fill={c.fill} />)}
      </g>
    ),
  },
  {
    kind: "desi-marigold", name: "Marigold", category: "Desi", tags: ["marigold", "genda", "flower", "wedding", "puja"], vb: [100, 100], size: [200, 200],
    uses: ["fill", "accent", "ink"], colors: { fill: "#F6A21E", accent: "#FF7A1A", ink: "#8A4B0E" },
    Art: ({ c }) => (
      <g>
        <path d={scallop(18, 42, 3.2)} fill={c.accent} />
        <path d={scallop(15, 31, 3.2)} fill={c.fill} />
        <path d={scallop(12, 20, 2.6)} fill={c.accent} />
        <circle cx="50" cy="50" r="9" fill={c.ink} />
      </g>
    ),
  },
  {
    kind: "desi-rangoli", name: "Rangoli", category: "Desi", tags: ["rangoli", "mandala", "diwali", "festival", "pattern"], vb: [100, 100], size: [300, 300],
    uses: ["fill", "accent", "ink"], colors: { fill: "#D7261E", accent: "#F6A21E", ink: "#0F6E6E" },
    Art: ({ c }) => (
      <g>
        {Array.from({ length: 8 }, (_, i) => <ellipse key={`a${i}`} cx="50" cy="22" rx="9" ry="22" fill={c.fill} transform={`rotate(${i * 45} 50 50)`} />)}
        {Array.from({ length: 8 }, (_, i) => <ellipse key={`b${i}`} cx="50" cy="30" rx="6" ry="13" fill={c.accent} transform={`rotate(${i * 45 + 22.5} 50 50)`} />)}
        <circle cx="50" cy="50" r="12" fill={c.ink} />
        <circle cx="50" cy="50" r="6" fill={c.accent} />
        {Array.from({ length: 16 }, (_, i) => { const a = (i / 16) * Math.PI * 2; return <circle key={`d${i}`} cx={50 + Math.cos(a) * 47} cy={50 + Math.sin(a) * 47} r="1.8" fill={c.ink} />; })}
      </g>
    ),
  },
  {
    kind: "desi-toran", name: "Toran garland", category: "Desi", tags: ["toran", "garland", "bunting", "wedding", "festival", "decor"], vb: [300, 80], size: [900, 240], stretch: true,
    uses: ["fill", "accent", "ink"], colors: { fill: "#0F7A3C", accent: "#F6A21E", ink: "#2A160E" },
    Art: ({ c }) => (
      <g>
        <path d="M0,10 Q150,26 300,10" stroke={c.ink} strokeWidth="2" fill="none" />
        {Array.from({ length: 9 }, (_, i) => {
          const x = 18 + i * 33, y = 10 + Math.sin((x / 300) * Math.PI) * 16;
          return (
            <g key={i}>
              <path d={`M${x},${y} C${x - 10},${y + 22} ${x - 6},${y + 44} ${x},${y + 58} C${x + 6},${y + 44} ${x + 10},${y + 22} ${x},${y}Z`} fill={c.fill} />
              <circle cx={x} cy={y + 2} r="5.5" fill={c.accent} />
            </g>
          );
        })}
      </g>
    ),
  },
];

export const STICKERS = DEFS;
export const STICKER_MAP: Record<string, StickerDef> = Object.fromEntries(DEFS.map((d) => [d.kind, d]));

export function searchStickers(q: string, category: StickerCategory | "All"): StickerDef[] {
  const s = q.trim().toLowerCase();
  return DEFS.filter((d) =>
    (category === "All" || d.category === category) &&
    (!s || d.name.toLowerCase().includes(s) || d.category.toLowerCase().includes(s) || d.tags.some((t) => t.includes(s))),
  );
}
