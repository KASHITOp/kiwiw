// Y2K Shiny: chrome, sparkles, disco, gadgets, charms. Original SVG.
import { S, HEART, heartAt, Chrome, Gloss, T, line, sparkle } from "./kit";
import { starPts, poly, smoothClosed, type Pt } from "../geometry";
import type { StickerDef } from "../library";

const C = "Y2K" as const;
const SILVER = "#E9ECF2", INK = "#14161C";
const star5 = poly(starPts(5, 46, 20));

export const Y2K: StickerDef[] = [
  S("y2k-chrome-sparkle", "Chrome sparkle", C, ["sparkle", "chrome", "star", "y2k", "shiny", "silver"], [SILVER, "#FFFFFF", INK], ({ c, uid }) => (
    <g><defs><Chrome id={`cs${uid}`} tint={c.fill} angle={60} /></defs>
      <path d={sparkle(50, 50, 46, 0.14)} fill={`url(#cs${uid})`} stroke={c.ink} strokeWidth="1.2" />
      <path d={sparkle(50, 50, 14, 0.2)} fill={c.accent} /></g>
  ), { size: [200, 200] }),
  S("y2k-sparkle-cluster", "Sparkle cluster", C, ["sparkle", "sparkles", "twinkle", "y2k", "shine", "stars"], ["#FFFFFF", "#FFE066", INK], ({ c }) => (
    <g>
      <path d={sparkle(40, 46, 34, 0.12)} fill={c.fill} stroke={c.ink} strokeWidth="1.6" />
      <path d={sparkle(80, 22, 14, 0.14)} fill={c.accent} stroke={c.ink} strokeWidth="1.2" />
      <path d={sparkle(78, 76, 10, 0.14)} fill={c.fill} stroke={c.ink} strokeWidth="1.2" />
    </g>
  ), { size: [180, 180], border: "none" }),
  S("y2k-chrome-star", "Chrome star", C, ["star", "chrome", "y2k", "silver", "metal", "shiny"], [SILVER, "#FFFFFF", INK], ({ c, uid }) => (
    <g><defs><Chrome id={`st${uid}`} tint={c.fill} angle={35} /></defs>
      <path d={star5} fill={`url(#st${uid})`} stroke={c.ink} strokeWidth="1.4" strokeLinejoin="round" />
      <path d={sparkle(36, 34, 7)} fill={c.accent} /></g>
  ), { size: [200, 200] }),
  S("y2k-leopard-star", "Leopard star", C, ["leopard", "star", "animal print", "y2k", "cheetah"], ["#E8B04A", "#1A120A", "#8A5A1A"], ({ c, uid }) => (
    <g>
      <defs><clipPath id={`lp${uid}`}><path d={star5} /></clipPath></defs>
      <path d={star5} fill={c.fill} />
      <g clipPath={`url(#lp${uid})`}>
        {Array.from({ length: 34 }, (_, i) => {
          const x = (i * 29.3) % 100, y = (i * 47.1) % 100, r = 3 + (i % 3);
          return <g key={i} transform={`rotate(${i * 40} ${x} ${y})`}><path d={`M${x - r},${y} C${x - r},${y - r * 1.2} ${x + r},${y - r * 1.2} ${x + r},${y}`} {...line(c.accent, 2.2)} /><ellipse cx={x} cy={y - r * 0.2} rx={r * 0.5} ry={r * 0.35} fill={c.ink} /></g>;
        })}
      </g>
      <path d={star5} fill="none" stroke={c.accent} strokeWidth="2" strokeLinejoin="round" />
    </g>
  ), { size: [200, 200] }),
  S("y2k-disco", "Disco ball", C, ["disco", "disco ball", "party", "mirror", "y2k", "70s"], ["#CFD5DE", "#FFFFFF", "#4A5060"], ({ c, uid }) => (
    <g>
      <defs><clipPath id={`db${uid}`}><circle cx="50" cy="54" r="40" /></clipPath></defs>
      <path d="M50,4 L50,14" {...line(c.ink, 2)} />
      <circle cx="50" cy="54" r="40" fill={c.ink} />
      <g clipPath={`url(#db${uid})`}>
        {Array.from({ length: 10 }, (_, r) => Array.from({ length: 12 }, (_, k) => {
          const y = 14 + r * 8.2, w = 8.2, x = 10 + k * w + (r % 2) * 3;
          const lum = (Math.sin(k * 1.7 + r * 2.3) + 1) / 2;
          return <rect key={`${r}-${k}`} x={x} y={y} width={w - 1} height="7.2" fill={lum > 0.75 ? c.accent : lum > 0.4 ? c.fill : "#8D95A3"} />;
        }))}
      </g>
      <path d={sparkle(30, 34, 9)} fill="#FFFFFF" /><path d={sparkle(80, 22, 7)} fill="#FFE066" />
    </g>
  ), { size: [210, 210] }),
  S("y2k-8ball", "Magic 8-ball", C, ["8 ball", "eight ball", "billiards", "fortune", "y2k"], ["#111111", "#FFFFFF", "#2A2A2A"], ({ c, uid }) => (
    <g><defs><Gloss id={`eb${uid}`} base="#3A3A3A" dark={c.fill} hi="#9A9A9A" /></defs>
      <circle cx="50" cy="50" r="44" fill={`url(#eb${uid})`} />
      <circle cx="56" cy="44" r="17" fill={c.accent} />
      <T x={56} y={52} s={22} f="Archivo Black" c={c.fill}>8</T>
      <ellipse cx="30" cy="28" rx="9" ry="5" fill="#FFFFFF" opacity=".5" transform="rotate(-35 30 28)" /></g>
  ), { size: [180, 180] }),
  S("y2k-vinyl", "Vinyl record", C, ["vinyl", "record", "music", "lp", "retro", "y2k"], ["#111111", "#FF4FA3", "#2B2B2B"], ({ c }) => (
    <g>
      <circle cx="50" cy="50" r="46" fill={c.fill} />
      {[40, 34, 28, 22].map((r) => <circle key={r} cx="50" cy="50" r={r} {...line(c.ink, 0.9)} />)}
      <path d="M22,22 A40,40 0 0 1 50,10" {...line("#FFFFFF", 2)} opacity=".35" />
      <circle cx="50" cy="50" r="15" fill={c.accent} />
      <T x={50} y={48} s={4.4} f="Space Mono" c="#111" w={700}>SIDE A</T>
      <T x={50} y={56} s={3.6} f="Space Mono" c="#111">bangers only</T>
      <circle cx="50" cy="50" r="1.8" fill="#111" />
    </g>
  ), { size: [210, 210] }),
  S("y2k-camera", "Retro camera", C, ["camera", "retro", "photo", "film", "y2k", "vintage"], ["#F2E8D5", "#2E2E2E", "#111111"], ({ c }) => (
    <g>
      <rect x="8" y="26" width="84" height="56" rx="7" fill={c.fill} stroke={c.ink} strokeWidth="2.4" />
      <rect x="8" y="42" width="84" height="26" fill={c.accent} />
      <rect x="18" y="18" width="18" height="10" rx="2" fill={c.accent} stroke={c.ink} strokeWidth="2" />
      <circle cx="54" cy="54" r="20" fill="#E5E7EB" stroke={c.ink} strokeWidth="2.4" />
      <circle cx="54" cy="54" r="13" fill="#1F2937" /><circle cx="49" cy="49" r="4" fill="#93C5FD" opacity=".85" />
      <rect x="76" y="31" width="10" height="7" rx="1.5" fill="#FDE68A" stroke={c.ink} strokeWidth="1.4" />
      <circle cx="80" cy="74" r="2.5" fill="#EF4444" />
    </g>
  ), { size: [220, 220] }),
  S("y2k-flip-phone", "Flip phone", C, ["phone", "flip phone", "mobile", "y2k", "2000s", "nokia-ish"], ["#FF8FB1", "#B7F0FF", "#1A1A1A"], ({ c }) => (
    <g transform="rotate(-10 50 50)">
      <rect x="30" y="4" width="40" height="44" rx="8" fill={c.fill} stroke={c.ink} strokeWidth="2.2" />
      <rect x="36" y="11" width="28" height="26" rx="2" fill={c.accent} stroke={c.ink} strokeWidth="1.6" />
      <T x={50} y={27} s={6} f="Press Start 2P" c={c.ink}>hi :)</T>
      <rect x="30" y="50" width="40" height="46" rx="8" fill={c.fill} stroke={c.ink} strokeWidth="2.2" />
      {Array.from({ length: 9 }, (_, i) => <rect key={i} x={36 + (i % 3) * 10} y={60 + Math.floor(i / 3) * 9} width="7" height="5" rx="1.5" fill="#FFFFFF" stroke={c.ink} strokeWidth="1" />)}
      <path d={HEART} fill="#E0457B" transform={heartAt(62, 14, 3)} />
    </g>
  ), { size: [180, 180] }),
  S("y2k-cassette", "Mixtape cassette", C, ["cassette", "tape", "mixtape", "music", "retro", "y2k"], ["#FFC72C", "#FFFFFF", "#1A1A1A"], ({ c }) => (
    <g>
      <rect x="4" y="18" width="92" height="62" rx="5" fill={c.fill} stroke={c.ink} strokeWidth="2.4" />
      <rect x="12" y="24" width="76" height="30" rx="3" fill={c.accent} stroke={c.ink} strokeWidth="1.6" />
      <T x={50} y={36} s={9} f="Caveat Variable" c={c.ink} w={700}>songs 4 u ♡</T>
      <rect x="28" y="40" width="44" height="12" rx="6" fill="#2A2A2A" />
      <circle cx="36" cy="46" r="4.4" fill="#FFFFFF" /><circle cx="64" cy="46" r="4.4" fill="#FFFFFF" />
      <path d="M22,80 L28,64 L72,64 L78,80" fill="#E5A800" stroke={c.ink} strokeWidth="1.8" strokeLinejoin="round" />
      {[34, 44, 56, 66].map((x) => <circle key={x} cx={x} cy="72" r="2" fill={c.ink} />)}
    </g>
  ), { size: [220, 220] }),
  S("y2k-sun-charm", "Gold sun charm", C, ["sun", "gold", "charm", "celestial", "y2k", "jewellery"], ["#F5C542", "#FFF3B0", "#8A5A00"], ({ c, uid }) => (
    <g><defs><Gloss id={`sn${uid}`} base={c.fill} dark={c.ink} hi={c.accent} /></defs>
      <path d={poly(starPts(16, 47, 32))} fill={`url(#sn${uid})`} stroke={c.ink} strokeWidth="1" />
      <circle cx="50" cy="50" r="26" fill={`url(#sn${uid})`} stroke={c.ink} strokeWidth="1.2" />
      <path d="M40,46 Q43,43 46,46 M54,46 Q57,43 60,46 M42,58 Q50,64 58,58" {...line(c.ink, 1.8)} /></g>
  ), { size: [200, 200] }),
  S("y2k-moon-charm", "Gold moon charm", C, ["moon", "crescent", "gold", "charm", "celestial", "y2k"], ["#F5C542", "#FFF3B0", "#8A5A00"], ({ c, uid }) => (
    <g><defs><Gloss id={`mn${uid}`} base={c.fill} dark={c.ink} hi={c.accent} /></defs>
      <path d="M62,8 C36,10 18,30 18,54 C18,78 38,94 62,92 C46,84 38,70 38,52 C38,34 46,18 62,8Z" fill={`url(#mn${uid})`} stroke={c.ink} strokeWidth="1.4" />
      <path d="M30,46 Q33,43 36,46" {...line(c.ink, 1.6)} />
      <path d={sparkle(74, 36, 9)} fill={c.fill} stroke={c.ink} strokeWidth="1" /><path d={sparkle(80, 66, 5)} fill={c.fill} /></g>
  ), { size: [200, 200] }),
  S("y2k-butterfly", "Chrome butterfly", C, ["butterfly", "chrome", "y2k", "wings", "shiny"], ["#B9A7FF", "#FFFFFF", "#2A1F5C"], ({ c, uid }) => (
    <g><defs><Chrome id={`bf${uid}`} tint={c.fill} angle={70} /></defs>
      {[1, -1].map((s) => (
        <g key={s} transform={s < 0 ? "translate(100 0) scale(-1 1)" : undefined}>
          <path d="M50,48 C40,18 14,6 8,20 C2,34 20,48 50,50Z" fill={`url(#bf${uid})`} stroke={c.ink} strokeWidth="1.6" />
          <path d="M50,52 C36,56 16,66 20,80 C24,92 44,80 50,56Z" fill={`url(#bf${uid})`} stroke={c.ink} strokeWidth="1.6" />
          <circle cx="24" cy="24" r="5" fill={c.accent} opacity=".8" />
        </g>
      ))}
      <ellipse cx="50" cy="52" rx="3.4" ry="20" fill={c.ink} />
      <path d="M49,34 C46,24 42,18 38,16 M51,34 C54,24 58,18 62,16" {...line(c.ink, 1.4)} /></g>
  ), { size: [210, 210] }),
  S("y2k-butterfly-line", "Butterfly doodle", C, ["butterfly", "doodle", "line", "y2k", "cute"], ["#FF4FA3", "#FF4FA3", "#FF4FA3"], ({ c }) => (
    <g {...line(c.fill, 2.6)}>
      <path d="M50,48 C40,18 14,6 8,20 C2,34 20,48 50,50 C80,48 98,34 92,20 C86,6 60,18 50,48Z" />
      <path d="M50,52 C36,56 16,66 20,80 C24,92 44,80 50,56 C56,80 76,92 80,80 C84,66 64,56 50,52Z" />
      <path d="M50,40 L50,70 M49,36 C46,26 42,20 38,18 M51,36 C54,26 58,20 62,18" />
    </g>
  ), { size: [180, 180], border: "none" }),
  S("y2k-pearls", "Pearl string", C, ["pearls", "pearl", "necklace", "string", "y2k", "coquette"], ["#FFFDF6", "#E8DCCB", "#B8A88E"], ({ c }) => (
    <g>
      {Array.from({ length: 17 }, (_, i) => {
        const x = 6 + i * 11.75, y = 14 + Math.sin((i / 16) * Math.PI) * 22;
        return <g key={i}><circle cx={x} cy={y} r="5.6" fill={c.accent} stroke={c.ink} strokeWidth=".9" /><circle cx={x - 1.7} cy={y - 1.7} r="2" fill={c.fill} /></g>;
      })}
    </g>
  ), { vb: [200, 48], size: [520, 125] }),
  S("y2k-cd", "Iridescent CD", C, ["cd", "disc", "iridescent", "holographic", "y2k", "music"], ["#C9F0FF", "#FFC2E2", "#7C8696"], ({ c, uid }) => (
    <g>
      <defs><linearGradient id={`cd${uid}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={c.fill} /><stop offset=".35" stopColor={c.accent} /><stop offset=".6" stopColor="#FFF3B0" /><stop offset=".8" stopColor="#B9A7FF" /><stop offset="1" stopColor={c.fill} /></linearGradient></defs>
      <circle cx="50" cy="50" r="46" fill={`url(#cd${uid})`} stroke={c.ink} strokeWidth="1.2" />
      <path d="M50,4 L50,96 M4,50 L96,50" stroke="#FFFFFF" strokeWidth="6" opacity=".25" />
      <circle cx="50" cy="50" r="14" fill="#F1F3F6" stroke={c.ink} strokeWidth="1" /><circle cx="50" cy="50" r="6" fill="#FFFFFF" stroke={c.ink} strokeWidth="1" />
    </g>
  ), { size: [200, 200] }),
  S("y2k-chrome-flame", "Chrome flame", C, ["flame", "fire", "chrome", "y2k", "hot", "tribal"], [SILVER, "#FFFFFF", INK], ({ c, uid }) => (
    <g><defs><Chrome id={`fl${uid}`} tint={c.fill} angle={100} /></defs>
      <path d="M50,96 C24,96 12,78 16,58 C20,40 34,34 32,14 C46,22 50,36 48,48 C56,40 58,28 56,18 C74,30 88,50 84,70 C80,88 66,96 50,96Z" fill={`url(#fl${uid})`} stroke={c.ink} strokeWidth="1.6" />
      <path d="M50,86 C38,86 32,76 36,66 C40,58 48,58 50,48 C60,58 66,66 64,74 C62,82 58,86 50,86Z" fill={c.accent} opacity=".7" /></g>
  ), { size: [180, 180] }),
  S("y2k-chrome-bolt", "Chrome lightning", C, ["lightning", "bolt", "chrome", "y2k", "energy"], [SILVER, "#FFE066", INK], ({ c, uid }) => (
    <g><defs><Chrome id={`lb${uid}`} tint={c.fill} angle={20} /></defs>
      <path d="M58,4 L18,56 L44,56 L34,96 L82,38 L54,38 L66,4Z" fill={`url(#lb${uid})`} stroke={c.ink} strokeWidth="1.8" strokeLinejoin="round" />
      <path d={sparkle(78, 74, 8)} fill={c.accent} /></g>
  ), { size: [180, 180] }),
  S("y2k-bubble-heart", "Bubblegum heart", C, ["heart", "bubble", "bubblegum", "pink", "glossy", "y2k"], ["#FF9DD2", "#FFFFFF", "#B0306E"], ({ c, uid }) => (
    <g><defs><Gloss id={`bh${uid}`} base={c.fill} dark={c.ink} /></defs>
      <path d={HEART} fill={`url(#bh${uid})`} transform="translate(0 4)" />
      <path d="M18,26 C20,18 28,14 34,16" {...line(c.accent, 5)} opacity=".9" /><circle cx="40" cy="18" r="2.6" fill={c.accent} />
      <path d={sparkle(84, 14, 9)} fill={c.accent} stroke={c.ink} strokeWidth="1" /></g>
  ), { vb: [100, 94], size: [210, 197] }),
  S("y2k-smiley-star", "Starry-eyed smiley", C, ["smiley", "smile", "happy", "face", "y2k", "acid"], ["#FFE066", "#FF4FA3", "#111111"], ({ c }) => (
    <g>
      <circle cx="50" cy="50" r="44" fill={c.fill} stroke={c.ink} strokeWidth="2.6" />
      <path d={sparkle(34, 40, 9, 0.2)} fill={c.accent} /><path d={sparkle(66, 40, 9, 0.2)} fill={c.accent} />
      <path d="M28,58 C36,76 64,76 72,58" {...line(c.ink, 3.4)} />
    </g>
  ), { size: [180, 180] }),
  S("y2k-blob-chrome", "Liquid chrome blob", C, ["chrome", "liquid", "blob", "metal", "y2k", "3d"], [SILVER, "#FFFFFF", INK], ({ c, uid }) => {
    const pts: Pt[] = Array.from({ length: 9 }, (_, i) => { const a = (i / 9) * Math.PI * 2, r = 36 + 10 * Math.sin(i * 2.7); return [50 + Math.cos(a) * r, 50 + Math.sin(a) * r * 0.86]; });
    return (<g><defs><Chrome id={`lq${uid}`} tint={c.fill} angle={120} /></defs>
      <path d={smoothClosed(pts)} fill={`url(#lq${uid})`} stroke={c.ink} strokeWidth="1.2" />
      <ellipse cx="38" cy="34" rx="12" ry="5" fill={c.accent} opacity=".85" transform="rotate(-25 38 34)" /></g>);
  }, { size: [200, 200] }),
];
