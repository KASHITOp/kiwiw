// Stadium / Sport: flip digits, stat blocks, trophies, jerseys. Unbranded.
import { S, T, line, Gloss } from "./kit";
import { poly, starPts } from "../geometry";
import type { StickerDef } from "../library";

const C = "Sport" as const;
const RED = "#D7191C", CREAM = "#F2E8D5", INK = "#111111";

/** Split-flap scoreboard digit. */
const digit = (n: number): StickerDef => S(`sp-digit-${n}`, `Scoreboard ${n}`, C, ["scoreboard", "digit", "number", "score", String(n), "flip"], [INK, "#FFD400", "#333333"], ({ c }) => (
  <g>
    <rect x="10" y="4" width="80" height="112" rx="8" fill={c.fill} />
    <rect x="16" y="10" width="68" height="48" rx="4" fill={c.ink} /><rect x="16" y="62" width="68" height="48" rx="4" fill={c.ink} />
    <T x={50} y={98} s={92} f="Big Shoulders Display Variable" w={900} c={c.accent}>{n}</T>
    <rect x="10" y="58.5" width="80" height="3" fill={c.fill} />
    <rect x="6" y="54" width="6" height="12" rx="2" fill="#555" /><rect x="88" y="54" width="6" height="12" rx="2" fill="#555" />
  </g>
), { vb: [100, 120], size: [140, 168], border: "none" });

export const SPORT: StickerDef[] = [
  ...Array.from({ length: 10 }, (_, i) => digit(i)),
  S("sp-stat-block", "Stat block", C, ["stats", "stat block", "player", "card", "stadium"], [CREAM, RED, INK], ({ c }) => (
    <g>
      <rect x="4" y="4" width="152" height="92" fill={c.fill} stroke={c.ink} strokeWidth="2" />
      <rect x="4" y="4" width="152" height="18" fill={c.accent} /><T x={10} y={17} s={10} f="Big Shoulders Display Variable" w={900} c={c.fill} a="start" ls={1}>PLAYER PROFILE</T>
      {[["AGE", "23"], ["CLUB", "CHAI FC"], ["POSITION", "STRIKER (OF DEALS)"], ["FORM", "UNSTOPPABLE"]].map(([k, v], i) => (
        <g key={k}><T x={10} y={38 + i * 16} s={8} f="Space Mono" w={700} c={c.ink} a="start">{k}:</T><T x={60} y={38 + i * 16} s={8} f="Space Mono" c={c.ink} a="start">{v}</T></g>
      ))}
    </g>
  ), { vb: [160, 100], size: [380, 238], border: "none" }),
  S("sp-whistle", "Whistle", C, ["whistle", "referee", "coach", "sport", "pe"], ["#C9CED8", RED, INK], ({ c, uid }) => (
    <g>
      <defs><Gloss id={`wh${uid}`} base={c.fill} dark="#6B7280" /></defs>
      <path d="M10,10 C26,14 30,30 34,40" {...line(c.accent, 3)} />
      <circle cx="50" cy="58" r="26" fill={`url(#wh${uid})`} stroke={c.ink} strokeWidth="2.2" />
      <path d="M58,34 L94,34 L94,52 L72,52Z" fill={`url(#wh${uid})`} stroke={c.ink} strokeWidth="2.2" strokeLinejoin="round" />
      <circle cx="50" cy="58" r="8" fill={c.ink} /><circle cx="34" cy="38" r="5" fill="none" stroke={c.ink} strokeWidth="2.2" />
    </g>
  ), { size: [170, 170] }),
  S("sp-trophy", "Trophy", C, ["trophy", "cup", "winner", "champion", "gold", "award"], ["#F5C542", "#FFF3B0", "#8A5A00"], ({ c, uid }) => (
    <g>
      <defs><Gloss id={`tr${uid}`} base={c.fill} dark={c.ink} hi={c.accent} /></defs>
      <path d="M26,14 C8,14 8,40 30,44 M74,14 C92,14 92,40 70,44" {...line(c.ink, 5)} /><path d="M26,14 C8,14 8,40 30,44 M74,14 C92,14 92,40 70,44" {...line(c.fill, 2.6)} />
      <path d="M24,8 L76,8 L72,40 C70,56 58,62 50,62 C42,62 30,56 28,40Z" fill={`url(#tr${uid})`} stroke={c.ink} strokeWidth="2" />
      <rect x="44" y="62" width="12" height="14" fill={c.fill} stroke={c.ink} strokeWidth="2" />
      <rect x="30" y="76" width="40" height="16" rx="2" fill="#3A2A10" stroke={c.ink} strokeWidth="2" />
      <T x={50} y={88} s={7} f="Space Mono" w={700} c={c.accent}>NO. 1</T>
      <path d={poly(starPts(5, 9, 4, 50, 30))} fill={c.accent} />
    </g>
  ), { size: [200, 200] }),
  S("sp-matchday", "MATCHDAY stamp", C, ["matchday", "stamp", "game", "stadium", "fixture"], [RED, RED, RED], ({ c }) => (
    <g opacity=".92" transform="rotate(-8 100 40)">
      <rect x="6" y="8" width="188" height="64" rx="6" fill="none" stroke={c.fill} strokeWidth="4" />
      <rect x="12" y="14" width="176" height="52" rx="3" fill="none" stroke={c.fill} strokeWidth="1.4" />
      <T x={100} y={52} s={36} f="Big Shoulders Display Variable" w={900} c={c.fill} ls={3}>MATCHDAY</T>
    </g>
  ), { vb: [200, 80], size: [420, 168], border: "none" }),
  S("sp-jersey-10", "Jersey No. 10", C, ["jersey", "shirt", "number 10", "football", "kit"], [RED, "#FFFFFF", INK], ({ c }) => (
    <g>
      <path d="M30,8 L42,4 C44,12 56,12 58,4 L70,8 L94,22 L84,40 L74,34 L74,94 L26,94 L26,34 L16,40 L6,22Z" fill={c.fill} stroke={c.ink} strokeWidth="2.4" strokeLinejoin="round" />
      <T x={50} y={44} s={10} f="Big Shoulders Display Variable" w={900} c={c.accent} ls={2}>KIWI</T>
      <T x={50} y={84} s={40} f="Big Shoulders Display Variable" w={900} c={c.accent}>10</T>
    </g>
  ), { size: [200, 200] }),
  S("sp-jersey-07", "Jersey No. 07", C, ["jersey", "shirt", "number 7", "cricket", "kit"], ["#1D3FD8", "#FFD400", INK], ({ c }) => (
    <g>
      <path d="M30,8 L42,4 C44,12 56,12 58,4 L70,8 L94,22 L84,40 L74,34 L74,94 L26,94 L26,34 L16,40 L6,22Z" fill={c.fill} stroke={c.ink} strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M26,34 L74,34" {...line(c.accent, 3)} />
      <T x={50} y={50} s={9} f="Big Shoulders Display Variable" w={900} c={c.accent} ls={2}>CAPTAIN</T>
      <T x={50} y={86} s={38} f="Big Shoulders Display Variable" w={900} c={c.accent}>07</T>
    </g>
  ), { size: [200, 200] }),
  S("sp-checkered", "Checkered flag", C, ["checkered", "flag", "race", "finish", "racing"], ["#FFFFFF", INK, "#6B7280"], ({ c }) => (
    <g>
      <path d="M16,6 L16,96" {...line(c.ink, 4)} />
      {Array.from({ length: 5 }, (_, r) => Array.from({ length: 7 }, (_, k) => (
        <rect key={`${r}-${k}`} x={18 + k * 10} y={8 + r * 10 + Math.sin(k * 0.9) * 4} width="10.4" height="10.4" fill={(r + k) % 2 ? c.accent : c.fill} stroke={c.accent} strokeWidth=".3" />
      )))}
    </g>
  ), { size: [180, 180] }),
  S("sp-football", "Football", C, ["football", "soccer", "ball", "sport"], ["#FFFFFF", INK, INK], ({ c }) => (
    <g>
      <circle cx="50" cy="50" r="44" fill={c.fill} stroke={c.ink} strokeWidth="2.6" />
      <path d={poly(starPts(5, 14, 11.3, 50, 50))} fill={c.accent} />
      {[0, 72, 144, 216, 288].map((a) => <g key={a} transform={`rotate(${a} 50 50)`}><path d="M50,36 L50,20 M43,22 L57,22" {...line(c.accent, 2)} /><path d="M38,6 L50,10 L62,6" fill={c.accent} /></g>)}
    </g>
  ), { size: [160, 160] }),
  S("sp-cricket", "Bat and ball", C, ["cricket", "bat", "ball", "sport", "india"], ["#E8C27A", RED, INK], ({ c }) => (
    <g>
      <g transform="rotate(35 50 50)"><rect x="44" y="2" width="12" height="30" rx="3" fill="#2B2B2B" /><path d="M40,32 L60,32 L62,94 C62,98 38,98 38,94Z" fill={c.fill} stroke={c.ink} strokeWidth="2" /><path d="M44,40 L44,88" {...line("#FFFFFF", 2)} opacity=".6" /></g>
      <circle cx="78" cy="78" r="12" fill={c.accent} stroke={c.ink} strokeWidth="1.6" /><path d="M68,72 C74,78 80,84 88,84" {...line("#FFFFFF", 1.2)} strokeDasharray="1.6 1.6" />
    </g>
  ), { size: [190, 190] }),
  S("sp-medal", "Gold medal", C, ["medal", "gold", "winner", "first place", "award"], ["#F5C542", "#1D3FD8", "#8A5A00"], ({ c, uid }) => (
    <g>
      <defs><Gloss id={`md${uid}`} base={c.fill} dark={c.ink} hi="#FFF3C4" /></defs>
      <path d="M30,4 L44,44 L56,44 L42,4Z" fill={c.accent} /><path d="M70,4 L56,44 L44,44 L58,4Z" fill="#C8102E" />
      <circle cx="50" cy="66" r="26" fill={`url(#md${uid})`} stroke={c.ink} strokeWidth="2" />
      <circle cx="50" cy="66" r="18" fill="none" stroke={c.ink} strokeWidth="1.2" />
      <T x={50} y={75} s={22} f="Big Shoulders Display Variable" w={900} c={c.ink}>1</T>
    </g>
  ), { size: [170, 170] }),
  S("sp-full-time", "Full time board", C, ["full time", "score", "board", "result", "match"], [INK, "#FFD400", "#FFFFFF"], ({ c }) => (
    <g>
      <rect x="4" y="4" width="192" height="72" rx="6" fill={c.fill} />
      <T x={100} y={22} s={11} f="Space Mono" w={700} c={c.accent} ls={3}>FULL TIME</T>
      <T x={40} y={60} s={24} f="Big Shoulders Display Variable" w={900} c={c.ink} ls={1}>CHAI</T>
      <T x={100} y={62} s={32} f="Big Shoulders Display Variable" w={900} c={c.accent}>3 – 0</T>
      <T x={160} y={60} s={24} f="Big Shoulders Display Variable" w={900} c={c.ink} ls={1}>NEEND</T>
    </g>
  ), { vb: [200, 80], size: [440, 176], border: "none" }),
];
