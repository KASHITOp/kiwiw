// Type stickers: ransom-note letters A–Z (one sticker each) and script phrases.
import { S, HEART, heartAt, T, line, sparkle } from "./kit";
import { poly, type Pt } from "../geometry";
import { rng } from "../../brand/kiwi";
import type { StickerDef } from "../library";

const C = "Type" as const;

// paper / ink pairs, like letters snipped from different magazines
const PAPERS: [string, string][] = [
  ["#FFFFFF", "#111111"], ["#111111", "#FFFFFF"], ["#C8102E", "#FFFFFF"], ["#FFE066", "#111111"],
  ["#FF8FB1", "#7A1030"], ["#F4EBDD", "#C8102E"], ["#1D3FD8", "#FFE066"], ["#E9ECF2", "#1D3FD8"],
];
const FACES: { f: string; w?: number; it?: boolean; up?: boolean }[] = [
  { f: "Bowlby One" }, { f: "Playfair Display Variable", w: 900, it: true }, { f: "Anton", up: true },
  { f: "Gloock" }, { f: "Caprasimo" }, { f: "Archivo Black" }, { f: "Rubik Mono One" },
  { f: "Big Shoulders Display Variable", w: 900 }, { f: "DM Serif Display", it: true }, { f: "Climate Crisis Variable" },
];

const ransom = (ch: string, i: number): StickerDef => {
  const r = rng(101 + i * 7);
  const [paper, inkc] = PAPERS[(i * 5) % PAPERS.length];
  const face = FACES[(i * 3) % FACES.length];
  const lower = !face.up && r() < 0.35;
  const pts: Pt[] = [[6 + r() * 8, 4 + r() * 8], [94 - r() * 8, 3 + r() * 8], [96 - r() * 6, 52 + (r() - 0.5) * 10], [92 - r() * 8, 96 - r() * 8], [8 + r() * 8, 95 - r() * 6], [3 + r() * 6, 48 + (r() - 0.5) * 12]];
  const rot = (r() - 0.5) * 12;
  return S(`ty-ransom-${ch.toLowerCase()}`, `Ransom letter ${ch}`, C, ["ransom", "letter", "alphabet", "cutout", "magazine", ch.toLowerCase(), `letter ${ch.toLowerCase()}`], [paper, inkc, "#00000022"], ({ c }) => (
    <g transform={`rotate(${rot} 50 50)`}>
      <path d={poly(pts)} fill={c.fill} stroke={c.ink} strokeWidth=".8" />
      <T x={50} y={lower ? 70 : 76} s={lower ? 68 : 66} f={face.f} w={face.w} it={face.it} c={c.accent}>{lower ? ch.toLowerCase() : ch}</T>
    </g>
  ), { size: [130, 130], border: "none" });
};

const phrase = (kind: string, name: string, tags: string[], colors: [string, string, string], body: (c: { fill: string; accent: string; ink: string }) => React.ReactNode, vb: [number, number] = [200, 80]) =>
  S(kind, name, C, ["phrase", "quote", "text", "words", ...tags], colors, ({ c }) => <g>{body(c)}</g>, { vb, size: [vb[0] * 2.2, vb[1] * 2.2] });

export const TYPE: StickerDef[] = [
  ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map(ransom),
  phrase("ty-fav-person", "favorite person", ["favorite person", "script", "love", "bestie", "coquette"], ["#C8102E", "#FFFFFF", "#FF8FB1"], (c) => (
    <><T x={100} y={52} s={38} f="Great Vibes" c={c.fill} stroke={c.accent} sw={6}>favorite person</T><path d={HEART} fill={c.ink} transform={heartAt(182, 22, 9)} /></>
  )),
  phrase("ty-main-character", "main character", ["main character", "script", "mood", "gen z"], ["#111111", "#FFE066", "#FFFFFF"], (c) => (
    <><rect x="18" y="14" width="164" height="52" rx="26" fill={c.accent} stroke={c.fill} strokeWidth="2.4" /><T x={100} y={49} s={21} f="Caprasimo" c={c.fill}>main character</T></>
  )),
  phrase("ty-its-giving", "it's giving", ["it's giving", "slang", "gen z", "script"], ["#FF4FA3", "#FFFFFF", "#7A1030"], (c) => (
    <><T x={100} y={50} s={42} f="Shrikhand" c={c.fill} stroke={c.accent} sw={7} rot={-4}>it's giving</T><path d={sparkle(180, 18, 10)} fill={c.ink} /></>
  )),
  phrase("ty-delulu", "delulu is the solulu", ["delulu", "solulu", "slang", "gen z", "manifest"], ["#B9A7FF", "#2A1F5C", "#FFFFFF"], (c) => (
    <><rect x="6" y="10" width="188" height="64" rx="8" fill={c.fill} stroke={c.accent} strokeWidth="2.4" /><T x={100} y={38} s={20} f="Bowlby One" c={c.accent}>DELULU IS</T><T x={100} y={64} s={22} f="Great Vibes" c={c.accent}>the solulu</T></>
  ), [200, 84]),
  phrase("ty-core-memory", "core memory", ["core memory", "memory", "nostalgia", "script"], ["#FFC72C", "#1A1A1A", "#FFFFFF"], (c) => (
    <><path d="M10,18 L190,10 L186,70 L14,66Z" fill={c.fill} /><T x={100} y={50} s={24} f="Caveat Variable" w={700} c={c.accent}>core memory unlocked</T></>
  )),
  phrase("ty-red-flag", "red flag", ["red flag", "flag", "dating", "warning"], ["#E11D2E", "#FFFFFF", "#111111"], (c) => (
    <><path d="M30,10 L30,76" {...line(c.ink, 3.4)} /><path d="M32,12 C60,4 80,22 110,12 L110,46 C80,56 60,38 32,46Z" fill={c.fill} stroke={c.ink} strokeWidth="2" /><T x={118} y={36} s={18} f="Bowlby One" c={c.fill} stroke={c.accent} sw={4} a="start">RED</T><T x={118} y={62} s={18} f="Bowlby One" c={c.fill} stroke={c.accent} sw={4} a="start">FLAG</T></>
  )),
  phrase("ty-green-flag", "green flag", ["green flag", "flag", "dating", "good sign"], ["#22A559", "#FFFFFF", "#111111"], (c) => (
    <><path d="M30,10 L30,76" {...line(c.ink, 3.4)} /><path d="M32,12 C60,4 80,22 110,12 L110,46 C80,56 60,38 32,46Z" fill={c.fill} stroke={c.ink} strokeWidth="2" /><T x={116} y={36} s={16} f="Bowlby One" c={c.fill} stroke={c.accent} sw={4} a="start">GREEN</T><T x={116} y={62} s={16} f="Bowlby One" c={c.fill} stroke={c.accent} sw={4} a="start">FLAG</T></>
  )),
  phrase("ty-1111", "11:11 make a wish", ["11:11", "wish", "time", "manifest", "magic"], ["#1D3FD8", "#FFFFFF", "#FFE066"], (c) => (
    <><T x={100} y={50} s={40} f="Bowlby One" c={c.fill} stroke={c.accent} sw={6}>11:11</T><T x={100} y={74} s={16} f="Great Vibes" c={c.fill} stroke={c.accent} sw={3}>make a wish</T><path d={sparkle(178, 16, 10)} fill={c.ink} stroke={c.fill} strokeWidth="1" /></>
  )),
  phrase("ty-no-thoughts", "no thoughts just vibes", ["no thoughts", "vibes", "chill", "mood"], ["#F4EBDD", "#111111", "#FF4FA3"], (c) => (
    <><rect x="4" y="12" width="192" height="58" fill={c.fill} stroke={c.accent} strokeWidth="2" /><T x={100} y={36} s={14} f="Space Mono" w={700} c={c.accent} ls={2}>NO THOUGHTS</T><T x={100} y={62} s={24} f="Great Vibes" c={c.ink}>just vibes</T></>
  )),
  phrase("ty-obsessed", "obsessed", ["obsessed", "love", "script", "coquette"], ["#C8102E", "#FFC2D1", "#FFFFFF"], (c) => (
    <><T x={100} y={54} s={46} f="Playfair Display Variable" w={900} it c={c.fill} stroke={c.accent} sw={6}>obsessed.</T></>
  )),
  phrase("ty-xoxo", "XOXO", ["xoxo", "hugs", "kisses", "love", "letter"], ["#FF4FA3", "#FFFFFF", "#7A1030"], (c) => (
    <><T x={100} y={60} s={58} f="Bowlby One" c={c.fill} stroke={c.ink} sw={4} ls={4}>XOXO</T></>
  )),
  phrase("ty-not-a-phase", "it's not a phase", ["not a phase", "emo", "mood", "attitude"], ["#111111", "#C8102E", "#F4EBDD"], (c) => (
    <><rect x="8" y="16" width="184" height="50" fill={c.ink} transform="rotate(-2 100 40)" /><T x={100} y={50} s={24} f="Rubik Glitch" c={c.fill} rot={-2}>IT'S NOT A PHASE</T></>
  )),
  S("ty-heart-text", "Heart of words", C, ["heart", "text", "warped", "love", "words", "coquette"], ["#C8102E", "#FF8FB1", "#FFFFFF"], ({ c, uid }) => (
    <g>
      <defs><path id={`hp${uid}`} d="M50,82 C22,62 8,46 10,30 C12,16 26,10 36,14 C44,17 48,22 50,28 C52,22 56,17 64,14 C74,10 88,16 90,30 C92,46 78,62 50,82" /></defs>
      <path d={HEART} fill={c.accent} transform="translate(13 12) scale(.74)" />
      <text fontFamily="Bowlby One" fontSize="6.4" fill={c.fill} letterSpacing=".4"><textPath href={`#hp${uid}`} startOffset="3%">YOU · ME · CHAI · FOREVER · ALWAYS ·</textPath></text>
      <T x={50} y={46} s={12} f="Great Vibes" c={c.ink}>always</T>
    </g>
  ), { vb: [100, 90], size: [260, 234] }),
  S("ty-heart-bulge", "Bulge heart text", C, ["heart", "warp", "bulge", "text", "love you"], ["#FF4FA3", "#FFFFFF", "#7A1030"], ({ c }) => (
    <g>
      <path d={HEART} fill={c.fill} stroke={c.ink} strokeWidth="2.4" transform="translate(0 4)" />
      <T x={50} y={36} s={13} f="Bowlby One" c={c.accent} stroke={c.ink} sw={2.4}>LOVE</T>
      <T x={50} y={56} s={18} f="Bowlby One" c={c.accent} stroke={c.ink} sw={2.4}>YOU</T>
      <T x={50} y={70} s={8} f="Bowlby One" c={c.accent} stroke={c.ink} sw={1.6}>TOO</T>
    </g>
  ), { vb: [100, 94], size: [220, 207] }),
];
