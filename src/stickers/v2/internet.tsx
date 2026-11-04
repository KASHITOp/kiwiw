// Internet Brain: UI scraps, popups, cursors, statuses. Original SVG.
import { S, HEART, heartAt, T, line } from "./kit";
import type { StickerDef } from "../library";

const C = "Internet" as const;
const BLUE = "#1D3FD8", INK = "#111111", WIN = "#E9ECF2";

/** Classic OS window chrome. */
const win = (x: number, y: number, w: number, h: number, title: string, bar: string) => (
  <g>
    <rect x={x + 3} y={y + 3} width={w} height={h} fill={INK} />
    <rect x={x} y={y} width={w} height={h} fill={WIN} stroke={INK} strokeWidth="1.6" />
    <rect x={x} y={y} width={w} height="12" fill={bar} stroke={INK} strokeWidth="1.6" />
    <T x={x + 5} y={y + 8.6} s={6} f="Space Mono" w={700} c="#FFFFFF" a="start">{title}</T>
    {[0, 1, 2].map((i) => <rect key={i} x={x + w - 11 - i * 9} y={y + 2.5} width="7" height="7" fill={WIN} stroke={INK} strokeWidth="1" />)}
  </g>
);

export const INTERNET: StickerDef[] = [
  S("ib-pov", "POV", C, ["pov", "point of view", "meme", "caption", "gen z"], ["#FFFFFF", INK, INK], ({ c }) => (
    <g><rect x="6" y="14" width="88" height="44" rx="22" fill={c.fill} stroke={c.ink} strokeWidth="3" /><T x={50} y={46} s={26} f="Archivo Black" c={c.accent} ls={1}>POV:</T></g>
  ), { vb: [100, 72], size: [220, 158] }),
  S("ib-loading", "Loading bar", C, ["loading", "progress", "bar", "wait", "buffer"], ["#22C55E", WIN, INK], ({ c }) => (
    <g>{win(4, 4, 152, 52, "loading_feelings.exe", BLUE)}
      <rect x="14" y="26" width="132" height="14" fill="#FFFFFF" stroke={c.ink} strokeWidth="1.4" />
      {Array.from({ length: 11 }, (_, i) => <rect key={i} x={16 + i * 9.6} y="28" width="8" height="10" fill={c.fill} />)}
      <T x={80} y={51} s={6} f="Space Mono" c={c.ink}>87% · please do not perceive me</T></g>
  ), { vb: [160, 62], size: [420, 163] }),
  S("ib-error", "Error popup", C, ["error", "popup", "window", "warning", "os", "retro"], ["#C8102E", "#FFE066", INK], ({ c }) => (
    <g>{win(4, 4, 152, 70, "error", c.fill)}
      <circle cx="26" cy="40" r="10" fill={c.fill} stroke={c.ink} strokeWidth="1.4" /><T x={26} y={45} s={14} f="Archivo Black" c="#FFFFFF">!</T>
      <T x={44} y={36} s={7.4} f="Space Mono" w={700} c={c.ink} a="start">too many feelings.</T>
      <T x={44} y={46} s={6} f="Space Mono" c={c.ink} a="start">close some tabs? (no)</T>
      <rect x="62" y="54" width="36" height="13" fill={WIN} stroke={c.ink} strokeWidth="1.4" /><T x={80} y={63} s={6.4} f="Space Mono" w={700} c={c.ink}>OK :(</T>
      <rect x="104" y="54" width="44" height="13" fill={c.accent} stroke={c.ink} strokeWidth="1.4" /><T x={126} y={63} s={6.4} f="Space Mono" w={700} c={c.ink}>IGNORE</T></g>
  ), { vb: [160, 80], size: [420, 210] }),
  S("ib-cursor-hand", "Cursor hand", C, ["cursor", "hand", "pointer", "click", "web"], ["#FFFFFF", INK, INK], ({ c }) => (
    <g transform="scale(1.1) translate(-4 -2)">
      <path d="M34,52 L34,14 C34,8 44,8 44,14 L44,40 L44,34 C44,28 54,28 54,34 L54,42 L54,38 C54,32 64,32 64,38 L64,46 L64,44 C64,38 74,38 74,44 L74,66 C74,80 66,90 52,90 C40,90 34,84 28,74 L18,58 C14,52 22,46 28,52Z" fill={c.fill} stroke={c.ink} strokeWidth="3.2" strokeLinejoin="round" />
      <path d="M44,40 L44,56 M54,42 L54,56 M64,46 L64,56" {...line(c.accent, 2.4)} />
    </g>
  ), { size: [150, 150], border: "none" }),
  S("ib-cursor-arrow", "Cursor arrow", C, ["cursor", "arrow", "pointer", "mouse", "web"], ["#FFFFFF", INK, INK], ({ c }) => (
    <path d="M24,8 L24,82 L42,64 L54,92 L66,86 L54,60 L80,60Z" fill={c.fill} stroke={c.ink} strokeWidth="4" strokeLinejoin="round" />
  ), { size: [130, 130], border: "none" }),
  S("ib-notification", "Notification bubble", C, ["notification", "message", "alert", "phone", "text"], ["#FFFFFF", "#22C55E", INK], ({ c }) => (
    <g>
      <rect x="4" y="8" width="192" height="58" rx="14" fill={c.fill} stroke={c.ink} strokeWidth="2" />
      <rect x="14" y="18" width="38" height="38" rx="10" fill={c.accent} />
      <path d="M24,30 L42,30 L42,42 L32,42 L26,48 L27,42 L24,42Z" fill="#FFFFFF" />
      <T x={62} y={32} s={9} f="Inter" w={700} c={c.ink} a="start">mummy · now</T>
      <T x={62} y={47} s={9} f="Inter" c={c.ink} a="start">khana kha liya? reply karo</T>
      <circle cx="184" cy="12" r="9" fill="#EF4444" /><T x={184} y={16} s={10} f="Inter" w={800} c="#FFFFFF">9</T>
    </g>
  ), { vb: [200, 72], size: [440, 158] }),
  S("ib-skill-issue", "Skill issue", C, ["skill issue", "meme", "gamer", "roast", "slang"], ["#7C3AED", "#FFFFFF", INK], ({ c }) => (
    <g><path d="M8,16 L192,8 L188,66 L12,70Z" fill={c.fill} stroke={c.ink} strokeWidth="2.4" /><T x={100} y={48} s={15} f="Press Start 2P" c={c.accent}>SKILL ISSUE</T></g>
  ), { vb: [200, 78], size: [440, 172] }),
  S("ib-404", "404 not found", C, ["404", "error", "not found", "lost", "web"], ["#FFE066", INK, "#C8102E"], ({ c }) => (
    <g>
      <rect x="20" y="6" width="160" height="74" fill={c.fill} stroke={c.ink} strokeWidth="2.4" />
      <T x={100} y={56} s={54} f="Rubik Glitch" c={c.accent}>404</T>
      <T x={100} y={73} s={9} f="Space Mono" w={700} c={c.ink}>MOTIVATION NOT FOUND</T>
    </g>
  ), { vb: [200, 84], size: [400, 168], border: "white" }),
  S("ib-music-player", "Music player", C, ["music", "player", "song", "waveform", "spotify-ish", "audio"], ["#111111", "#22C55E", "#FFFFFF"], ({ c }) => (
    <g>
      <rect x="4" y="4" width="192" height="70" rx="12" fill={c.fill} />
      <rect x="12" y="12" width="40" height="40" rx="6" fill={c.accent} /><path d={HEART} fill={c.fill} transform={heartAt(32, 32, 10)} />
      <T x={60} y={26} s={9} f="Inter" w={800} c={c.ink} a="start">tum hi ho (chai version)</T>
      <T x={60} y={38} s={7} f="Inter" c="#9CA3AF" a="start">kiwi · 3:07</T>
      {Array.from({ length: 34 }, (_, i) => { const h = 3 + Math.abs(Math.sin(i * 0.9) * 9) + (i % 3); return <rect key={i} x={60 + i * 3.8} y={50 - h / 2} width="2.2" height={h} rx="1" fill={i < 14 ? c.accent : "#4B5563"} />; })}
      <path d="M86,60 L86,70 L94,65Z M100,60 L102,60 L102,70 L100,70Z M106,60 L108,60 L108,70 L106,70Z" fill={c.ink} />
    </g>
  ), { vb: [200, 78], size: [460, 179] }),
  S("ib-caution", "Caution: you might fall in love", C, ["caution", "warning", "sign", "love", "funny"], ["#FFD400", INK, "#C8102E"], ({ c }) => (
    <g>
      <path d="M50,4 L96,88 L4,88Z" fill={c.fill} stroke={c.ink} strokeWidth="3.4" strokeLinejoin="round" />
      <path d={HEART} fill={c.accent} transform={heartAt(50, 46, 13)} />
      <T x={50} y={72} s={7} f="Archivo Black" c={c.ink}>CAUTION</T>
      <T x={50} y={81} s={4.6} f="Space Mono" w={700} c={c.ink}>YOU MIGHT FALL IN LOVE</T>
    </g>
  ), { vb: [100, 94], size: [230, 216] }),
  S("ib-like", "Like counter", C, ["like", "heart", "counter", "social", "instagram-ish", "notification"], ["#EF4444", "#FFFFFF", INK], ({ c }) => (
    <g>
      <path d="M8,8 L92,8 L92,52 L58,52 L50,62 L42,52 L8,52Z" fill={c.fill} />
      <path d={HEART} fill={c.accent} transform={heartAt(28, 30, 11)} />
      <T x={64} y={38} s={20} f="Inter" w={800} c={c.accent}>99+</T>
    </g>
  ), { vb: [100, 66], size: [200, 132] }),
  S("ib-typing", "Typing bubble", C, ["typing", "chat", "message", "dots", "waiting"], ["#E5E7EB", "#6B7280", INK], ({ c }) => (
    <g><rect x="6" y="14" width="88" height="40" rx="20" fill={c.fill} /><circle cx="14" cy="58" r="6" fill={c.fill} />{[32, 50, 68].map((x, i) => <circle key={x} cx={x} cy="34" r="6" fill={c.accent} opacity={0.5 + i * 0.25} />)}</g>
  ), { vb: [100, 68], size: [180, 122] }),
  S("ib-search", "Search bar", C, ["search", "search bar", "google-ish", "query", "web"], ["#FFFFFF", "#6B7280", INK], ({ c }) => (
    <g>
      <rect x="4" y="10" width="192" height="40" rx="20" fill={c.fill} stroke={c.ink} strokeWidth="2" />
      <circle cx="26" cy="29" r="7" fill="none" stroke={c.accent} strokeWidth="2.4" /><path d="M31,34 L37,40" {...line(c.accent, 2.6)} />
      <T x={46} y={34} s={10} f="Inter" c={c.ink} a="start">how to be that girl in 1 day</T>
    </g>
  ), { vb: [200, 60], size: [460, 138] }),
  S("ib-battery", "Battery low", C, ["battery", "low", "tired", "energy", "phone"], ["#EF4444", "#FFFFFF", INK], ({ c }) => (
    <g>
      <rect x="6" y="20" width="78" height="40" rx="6" fill={c.accent} stroke={c.ink} strokeWidth="3" /><rect x="84" y="32" width="8" height="16" rx="2" fill={c.ink} />
      <rect x="11" y="25" width="14" height="30" rx="2" fill={c.fill} />
      <T x={52} y={46} s={11} f="Archivo Black" c={c.ink}>1%</T>
      <T x={48} y={76} s={8} f="Space Mono" w={700} c={c.ink}>social battery</T>
    </g>
  ), { vb: [100, 84], size: [210, 176] }),
  S("ib-verified", "Verified tick", C, ["verified", "tick", "check", "blue tick", "badge", "famous"], ["#1D9BF0", "#FFFFFF", INK], ({ c }) => (
    <g><path d="M50,4 L60,14 L74,12 L78,26 L92,32 L86,46 L94,58 L82,66 L80,80 L66,80 L56,92 L44,84 L30,88 L24,76 L10,70 L14,56 L6,44 L18,36 L20,22 L34,20 L42,8Z" fill={c.fill} /><path d="M32,50 L44,62 L68,36" {...line(c.accent, 7)} /></g>
  ), { size: [150, 150] }),
  S("ib-captcha", "Not a robot", C, ["captcha", "robot", "checkbox", "verify", "funny"], ["#F9FAFB", "#22C55E", INK], ({ c }) => (
    <g>
      <rect x="4" y="8" width="192" height="48" rx="3" fill={c.fill} stroke="#D1D5DB" strokeWidth="1.6" />
      <rect x="14" y="20" width="24" height="24" rx="2" fill="#FFFFFF" stroke="#9CA3AF" strokeWidth="1.6" /><path d="M18,32 L25,39 L36,24" {...line(c.accent, 3.6)} />
      <T x={48} y={30} s={10} f="Inter" c={c.ink} a="start">I'm not a robot</T>
      <T x={48} y={44} s={7.4} f="Inter" c="#6B7280" a="start">just emotionally unavailable</T>
    </g>
  ), { vb: [200, 64], size: [440, 141] }),
  S("ib-seen", "Seen 2:14 am", C, ["seen", "read", "receipt", "chat", "ghosted", "late night"], ["#FFFFFF", "#9CA3AF", INK], ({ c }) => (
    <g>
      <rect x="40" y="8" width="150" height="34" rx="17" fill="#3B82F6" /><T x={115} y={30} s={10} f="Inter" c="#FFFFFF">u up? (asking for a friend)</T>
      <T x={186} y={56} s={8} f="Inter" w={600} c={c.accent} a="end">Seen 2:14 am</T>
    </g>
  ), { vb: [200, 62], size: [440, 136] }),
  S("ib-hashtag", "Hashtag", C, ["hashtag", "tag", "social", "trending"], ["#FF4FA3", "#FFFFFF", INK], ({ c }) => (
    <g><rect x="10" y="10" width="80" height="80" rx="22" fill={c.fill} stroke={c.ink} strokeWidth="2.6" /><T x={50} y={72} s={62} f="Archivo Black" c={c.accent}>#</T></g>
  ), { size: [140, 140] }),
  S("ib-wifi", "Wi-Fi (no signal)", C, ["wifi", "signal", "internet", "offline", "network"], ["#111111", "#C8102E", "#FFFFFF"], ({ c }) => (
    <g>
      {[38, 26, 14].map((r, i) => <path key={r} d={`M${50 - r},${66 - r * 0.6} A${r},${r} 0 0 1 ${50 + r},${66 - r * 0.6}`} {...line(i === 2 ? c.fill : "#9CA3AF", 7)} />)}
      <circle cx="50" cy="70" r="6" fill={c.fill} />
      <T x={50} y={94} s={6.4} f="Space Mono" w={700} c={c.accent}>NO SIGNAL, ONLY VIBES</T>
    </g>
  ), { size: [180, 180] }),
  S("ib-play", "Play button", C, ["play", "button", "video", "youtube-ish", "reel"], ["#EF4444", "#FFFFFF", INK], ({ c }) => (
    <g><rect x="6" y="18" width="88" height="64" rx="18" fill={c.fill} /><path d="M40,34 L66,50 L40,66Z" fill={c.accent} /></g>
  ), { size: [160, 160] }),
];
