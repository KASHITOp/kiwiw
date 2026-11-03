// Effects-engine backgrounds (DESIGN.md §16) + Style DNA stickers
// (STYLE_DNA.md). All original SVG, drawn here from seeded geometry.
import type { JSX } from "react";
import type { StickerDef } from "./library";
import { smoothClosed, type Pt } from "./geometry";
import { rng } from "../brand/kiwi";

const INK = "#111111";

// warped checkerboard: a grid whose vertices ride two sine fields
const warp = (x: number, y: number): Pt => [x + 3.4 * Math.sin(y * 0.085 + x * 0.025), y + 3.4 * Math.sin(x * 0.09 + 0.6)];
function checkerCells() {
  const N = 8, s = 100 / N, out: string[] = [];
  const edge = (x0: number, y0: number, x1: number, y1: number) =>
    [0, 0.34, 0.67].map((t) => warp(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t));
  for (let i = -1; i <= N; i++)
    for (let j = -1; j <= N; j++) {
      if ((i + j + 2) % 2) continue;
      const x = i * s, y = j * s;
      const pts = [...edge(x, y, x + s, y), ...edge(x + s, y, x + s, y + s), ...edge(x + s, y + s, x, y + s), ...edge(x, y + s, x, y)];
      out.push("M" + pts.map((p) => p[0].toFixed(2) + "," + p[1].toFixed(2)).join("L") + "Z");
    }
  return out.join("");
}
const CHECKER = checkerCells();

function swirlRings(cx: number, cy: number, n: number, step: number, phase: number) {
  return Array.from({ length: n }, (_, k) => {
    const r = (n - k) * step;
    const pts: Pt[] = Array.from({ length: 28 }, (_, i) => {
      const a = (i / 28) * Math.PI * 2;
      const rr = r * (1 + 0.13 * Math.sin(3 * a + k * 0.55 + phase) + 0.05 * Math.sin(7 * a - k));
      return [cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * 1.08];
    });
    return smoothClosed(pts);
  });
}
const SWIRL_A = swirlRings(30, 32, 11, 7.2, 0);
const SWIRL_B = swirlRings(82, 92, 8, 6.4, 1.7);

const PIX = (() => {
  const r = rng(41), cells: [number, number, number][] = [];
  for (let i = 0; i < 70; i++) cells.push([Math.floor(r() * 50) * 2, Math.floor(r() * 50) * 2, r() < 0.2 ? 2 : r() < 0.55 ? 1 : 0]);
  return cells;
})();

const HEART = ["..XX.XX..", ".XXXXXXX.", "XXXXXXXXX", "XXXXXXXXX", ".XXXXXXX.", "..XXXXX..", "...XXX...", "....X...."];
const STAR = ["....X....", "....X....", "...XXX...", "XXXXXXXXX", ".XXXXXXX.", "..XXXXX..", ".XXX.XXX.", ".XX...XX.", "X.......X"];
const pixels = (rows: string[], fill: string, ink: string) => (
  <g>
    {rows.flatMap((row, y) => [...row].map((c, x) => (c === "X" ? <rect key={`${x}-${y}`} x={x * 10 + 5} y={y * 10 + 5} width="10.4" height="10.4" fill={fill} stroke={ink} strokeWidth="0.6" /> : null)))}
  </g>
);

export const EXTRA_DEFS: StickerDef[] = [
  /* Backgrounds: stretch to the page (DESIGN.md §16) */
  {
    kind: "bg-checker", name: "Warped checkerboard", category: "Backgrounds", tags: ["checker", "checkerboard", "warped", "psychedelic", "retro", "background"], vb: [100, 100], size: [1080, 1080], stretch: true,
    uses: ["fill", "accent"], colors: { fill: "#C8102E", accent: "#F7B2C4", ink: INK },
    Art: ({ c }) => (<g><rect x="-2" y="-2" width="104" height="104" fill={c.accent} /><path d={CHECKER} fill={c.fill} /></g>),
  },
  {
    kind: "bg-swirl", name: "Psychedelic swirl", category: "Backgrounds", tags: ["swirl", "psychedelic", "rainbow", "groovy", "70s", "retro", "background"], vb: [100, 125], size: [1080, 1350], stretch: true,
    uses: ["fill", "accent", "ink"], colors: { fill: "#FF4FA3", accent: "#FFC72C", ink: "#6B3FD8" },
    Art: ({ c }) => {
      const cols = [c.fill, c.accent, c.ink, "#FFF1DE", "#3FA9FF", "#E8322E"];
      return (
        <g>
          <rect x="-2" y="-2" width="104" height="129" fill="#FFF1DE" />
          {SWIRL_A.map((d, i) => <path key={`a${i}`} d={d} fill={cols[i % cols.length]} />)}
          {SWIRL_B.map((d, i) => <path key={`b${i}`} d={d} fill={cols[(i + 2) % cols.length]} />)}
        </g>
      );
    },
  },
  {
    kind: "bg-halftone", name: "Halftone gradient", category: "Backgrounds", tags: ["halftone", "gradient", "dots", "pop art", "comic", "background"], vb: [100, 125], size: [1080, 1350], stretch: true,
    uses: ["fill", "accent"], colors: { fill: "#D7191C", accent: "#F2E8D5", ink: INK },
    Art: ({ c }) => {
      const dots: JSX.Element[] = [];
      const s = 5;
      for (let j = 0; j <= 26; j++)
        for (let i = 0; i <= 21; i++) {
          const x = i * s + (j % 2 ? s / 2 : 0), y = j * s;
          const r = s * 0.62 * Math.pow(Math.max(0, y / 125), 1.15);
          if (r > 0.12) dots.push(<circle key={`${i}-${j}`} cx={x} cy={y} r={r} />);
        }
      return (<g><rect x="-2" y="-2" width="104" height="129" fill={c.accent} /><g fill={c.fill}>{dots}</g></g>);
    },
  },
  {
    kind: "bg-sunburst", name: "Sunburst rays", category: "Backgrounds", tags: ["sunburst", "rays", "burst", "filmi", "retro", "background"], vb: [100, 125], size: [1080, 1350], stretch: true,
    uses: ["fill", "accent"], colors: { fill: "#FFD23F", accent: "#F7931E", ink: INK },
    Art: ({ c }) => (
      <g>
        <rect x="-2" y="-2" width="104" height="129" fill={c.accent} />
        {Array.from({ length: 16 }, (_, i) => {
          const a0 = (i / 16) * Math.PI * 2, a1 = ((i + 0.5) / 16) * Math.PI * 2, R = 160, cx = 50, cy = 70;
          return <path key={i} d={`M${cx},${cy} L${cx + Math.cos(a0) * R},${cy + Math.sin(a0) * R} L${cx + Math.cos(a1) * R},${cy + Math.sin(a1) * R}Z`} fill={c.fill} />;
        })}
      </g>
    ),
  },
  {
    kind: "bg-pixel", name: "Pixel grid", category: "Backgrounds", tags: ["pixel", "8-bit", "8bit", "retro", "game", "stars", "background"], vb: [100, 100], size: [1080, 1080], stretch: true,
    uses: ["fill", "accent", "ink"], colors: { fill: "#120B2E", accent: "#FFD400", ink: "#FF3EA5" },
    Art: ({ c }) => (
      <g>
        <rect x="-2" y="-2" width="104" height="104" fill={c.fill} />
        <g stroke="#FFFFFF" strokeOpacity="0.07" strokeWidth="0.25">
          {Array.from({ length: 21 }, (_, i) => <line key={`v${i}`} x1={i * 5} y1="0" x2={i * 5} y2="100" />)}
          {Array.from({ length: 21 }, (_, i) => <line key={`h${i}`} x1="0" y1={i * 5} x2="100" y2={i * 5} />)}
        </g>
        {PIX.map(([x, y, k], i) => <rect key={i} x={x} y={y} width={k === 2 ? 2 : 1} height={k === 2 ? 2 : 1} fill={k === 2 ? c.accent : k === 1 ? "#FFFFFF" : c.ink} />)}
      </g>
    ),
  },


  /* Glossy Bloom: chrome stickers (metallic gradients, specular stripe) */
  {
    kind: "chrome-star", name: "Chrome sparkle", category: "Bursts", tags: ["chrome", "glossy", "y2k", "sparkle", "star", "metal", "3d"], vb: [100, 100], size: [200, 200],
    uses: ["fill", "accent"], colors: { fill: "#E9E4F2", accent: "#FFC2D1", ink: "#2A0F2E" },
    Art: ({ c, uid }) => (
      <g>
        <defs>
          <linearGradient id={`cs${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#FFFFFF" /><stop offset=".35" stopColor={c.fill} /><stop offset=".55" stopColor="#8E8A99" /><stop offset=".7" stopColor="#FFFFFF" /><stop offset="1" stopColor={c.accent} />
          </linearGradient>
        </defs>
        <path d="M50,2 C54,34 66,46 98,50 C66,54 54,66 50,98 C46,66 34,54 2,50 C34,46 46,34 50,2Z" fill="#2A0F2E" opacity=".25" transform="translate(3 5)" />
        <path d="M50,2 C54,34 66,46 98,50 C66,54 54,66 50,98 C46,66 34,54 2,50 C34,46 46,34 50,2Z" fill={`url(#cs${uid})`} stroke="#FFFFFF" strokeWidth="1.2" />
        <path d="M48,14 C50,30 54,40 60,44" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" fill="none" opacity=".9" />
      </g>
    ),
  },
  {
    kind: "chrome-heart", name: "Chrome heart", category: "Bursts", tags: ["chrome", "glossy", "heart", "love", "y2k", "3d", "metal"], vb: [100, 90], size: [200, 180],
    uses: ["fill", "accent"], colors: { fill: "#FF9DB8", accent: "#FFFFFF", ink: "#2A0F2E" },
    Art: ({ c, uid }) => (
      <g>
        <defs>
          <radialGradient id={`ch${uid}`} cx=".35" cy=".3" r=".8">
            <stop offset="0" stopColor="#FFFFFF" /><stop offset=".25" stopColor={c.fill} /><stop offset=".75" stopColor="#B83A6A" /><stop offset="1" stopColor="#5E1236" />
          </radialGradient>
        </defs>
        <path d="M50,86 C20,64 4,46 4,28 C4,12 16,4 28,4 C38,4 46,10 50,18 C54,10 62,4 72,4 C84,4 96,12 96,28 C96,46 80,64 50,86Z" fill="#2A0F2E" opacity=".25" transform="translate(2 5)" />
        <path d="M50,86 C20,64 4,46 4,28 C4,12 16,4 28,4 C38,4 46,10 50,18 C54,10 62,4 72,4 C84,4 96,12 96,28 C96,46 80,64 50,86Z" fill={`url(#ch${uid})`} />
        <ellipse cx="28" cy="22" rx="11" ry="6" fill={c.accent} opacity=".85" transform="rotate(-25 28 22)" />
      </g>
    ),
  },
  {
    kind: "chrome-blob", name: "Glossy bubble", category: "Blobs", tags: ["chrome", "glossy", "bubble", "blob", "3d", "y2k"], vb: [100, 100], size: [220, 220],
    uses: ["fill", "accent"], colors: { fill: "#FFE58A", accent: "#FFFFFF", ink: "#2A0F2E" },
    Art: ({ c, uid }) => (
      <g>
        <defs>
          <radialGradient id={`cb${uid}`} cx=".35" cy=".3" r=".85">
            <stop offset="0" stopColor="#FFFFFF" /><stop offset=".3" stopColor={c.fill} /><stop offset="1" stopColor="#C9900A" />
          </radialGradient>
        </defs>
        <circle cx="52" cy="55" r="42" fill="#2A0F2E" opacity=".2" />
        <circle cx="50" cy="50" r="42" fill={`url(#cb${uid})`} />
        <ellipse cx="36" cy="30" rx="14" ry="8" fill={c.accent} opacity=".9" transform="rotate(-30 36 30)" />
      </g>
    ),
  },

  /* Style DNA stickers */
  {
    kind: "desi-nimbu-mirchi", name: "Nimbu mirchi", category: "Desi", tags: ["nimbu", "mirchi", "lemon", "chilli", "nazar", "evil eye", "totka", "desi"], vb: [100, 230], size: [180, 414],
    uses: ["fill", "accent", "ink"], colors: { fill: "#FFD23F", accent: "#2E9E3E", ink: "#2A160E" },
    Art: ({ c }) => {
      const chilli = (y: number, left: boolean, red: boolean, k: number) => {
        const s = left ? -1 : 1;
        return (
          <g key={k}>
            <path d={`M50,${y} C${50 + s * 20},${y + 2} ${50 + s * 30},${y + 18} ${50 + s * 26},${y + 40} C${50 + s * 18},${y + 26} ${50 + s * 8},${y + 12} 50,${y + 6}Z`} fill={red ? "#D62828" : c.accent} stroke={c.ink} strokeWidth="1.6" strokeLinejoin="round" />
            <path d={`M50,${y} q${s * 4},-4 ${s * 3},-8`} stroke="#1E6B2A" strokeWidth="3" fill="none" strokeLinecap="round" />
          </g>
        );
      };
      return (
        <g>
          <path d="M50,0 V205" stroke={c.ink} strokeWidth="2" />
          <circle cx="50" cy="6" r="5" fill="none" stroke={c.ink} strokeWidth="2" />
          {[24, 52, 80, 108, 136].map((y, i) => chilli(y, i % 2 === 0, i === 2, i))}
          <ellipse cx="50" cy="196" rx="24" ry="20" fill={c.fill} stroke={c.ink} strokeWidth="2" />
          <ellipse cx="42" cy="188" rx="7" ry="4.5" fill="#FFF4B0" />
          <path d="M50,176 q2,-6 6,-8" stroke="#1E6B2A" strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>
      );
    },
  },
  {
    kind: "desi-evil-eye", name: "Evil eye (nazar)", category: "Desi", tags: ["evil eye", "nazar", "nazar battu", "eye", "lucky", "desi"], vb: [100, 100], size: [200, 200],
    uses: ["fill", "accent", "ink"], colors: { fill: "#1D3FD8", accent: "#7FB7FF", ink: INK },
    Art: ({ c }) => (
      <g>
        <circle cx="50" cy="50" r="46" fill={c.fill} />
        <circle cx="50" cy="50" r="38" fill="#FFFFFF" />
        <circle cx="50" cy="50" r="27" fill={c.accent} />
        <circle cx="50" cy="50" r="15" fill={c.ink} />
        <ellipse cx="40" cy="38" rx="6" ry="4" fill="#FFFFFF" opacity="0.85" />
      </g>
    ),
  },
  {
    kind: "figure-walker", name: "Tiny walker", category: "Scribbles", tags: ["figure", "person", "walker", "swiss", "tiny", "human", "man"], vb: [60, 120], size: [70, 140],
    uses: ["fill"], colors: { fill: INK, accent: "#FFFFFF", ink: INK },
    Art: ({ c }) => (
      <g stroke={c.fill} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <circle cx="32" cy="12" r="9" fill={c.fill} stroke="none" />
        <path d="M30,26 L26,62" />
        <path d="M29,34 L44,48 L52,44" />
        <path d="M28,36 L14,52 L10,62" />
        <path d="M26,62 L40,86 L36,112 L46,114" />
        <path d="M26,62 L14,88 L4,108" />
      </g>
    ),
  },
  {
    kind: "pixel-heart", name: "Pixel heart", category: "Pixel", tags: ["pixel", "heart", "8-bit", "game", "love", "life"], vb: [100, 90], size: [200, 180],
    uses: ["fill", "ink"], colors: { fill: "#FF3EA5", accent: "#FFFFFF", ink: "#120B2E" },
    Art: ({ c }) => pixels(HEART, c.fill, c.ink),
  },
  {
    kind: "pixel-star", name: "Pixel star", category: "Pixel", tags: ["pixel", "star", "8-bit", "game", "coin", "bonus"], vb: [100, 100], size: [200, 200],
    uses: ["fill", "ink"], colors: { fill: "#FFD400", accent: "#FFFFFF", ink: "#120B2E" },
    Art: ({ c }) => pixels(STAR, c.fill, c.ink),
  },
];
