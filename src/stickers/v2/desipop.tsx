// Desi Pop: badges, signboards, truck art, kitchen + street icons. Original wording.
import { S, HEART, heartAt, T, line, Gloss } from "./kit";
import { scallop, starPts, poly } from "../geometry";
import type { StickerDef } from "../library";

const C = "Desi Pop" as const;
const YEL = "#FFD400", BLK = "#111111", RED = "#D7261E", PINK = "#F2479B", CREAM = "#FFF4DE";

/** Round scalloped badge with two lines of text. */
const badge = (kind: string, name: string, top: string, bottom: string, colors: [string, string, string], tags: string[], font = "Rozha One", size = 22) =>
  S(kind, name, C, ["badge", "desi", ...tags], colors, ({ c }) => (
    <g>
      <path d={scallop(22, 47, 3.4)} fill={c.fill} stroke={c.ink} strokeWidth="2" />
      <circle cx="50" cy="50" r="37" fill="none" stroke={c.accent} strokeWidth="1.6" strokeDasharray="3 2.4" />
      <T x={50} y={bottom ? 50 : 58} s={size} f={font} c={c.accent} stroke={c.ink} sw={2.6}>{top}</T>
      {bottom && <T x={50} y={67} s={5.2} f="Space Mono" w={700} c={c.accent}>{bottom}</T>}
    </g>
  ), { size: [220, 220] });

/** Yellow/black cinema signboard. */
const sign = (kind: string, name: string, l1: string, l2: string, tags: string[], colors: [string, string, string] = [YEL, BLK, RED]) =>
  S(kind, name, C, ["signboard", "board", "bollywood", "yellow", "desi", ...tags], colors, ({ c }) => (
    <g>
      <rect x="4" y="6" width="192" height="76" rx="4" fill={c.accent} />
      <rect x="9" y="11" width="182" height="66" rx="2" fill={c.fill} />
      {[[14, 16], [186, 16], [14, 72], [186, 72]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2.4" fill={c.accent} />)}
      <T x={100} y={l2 ? 44 : 56} s={l2 ? 24 : 30} f="Rozha One" c={c.accent}>{l1}</T>
      {l2 && <T x={100} y={68} s={14} f="Khand" w={700} c={c.ink} ls={1}>{l2}</T>}
    </g>
  ), { vb: [200, 88], size: [480, 211] });

const truckFlower = (cx: number, cy: number, r: number, a: string, b: string, k: string) => (
  <g>
    {Array.from({ length: 8 }, (_, i) => <ellipse key={k + i} cx={cx} cy={cy - r * 0.55} rx={r * 0.28} ry={r * 0.5} fill={i % 2 ? a : b} stroke={BLK} strokeWidth=".9" transform={`rotate(${i * 45} ${cx} ${cy})`} />)}
    <circle cx={cx} cy={cy} r={r * 0.28} fill={YEL} stroke={BLK} strokeWidth=".9" />
  </g>
);

export const DESI_POP: StickerDef[] = [
  badge("dp-pataka", "पटाका badge", "पटाका", "100% FIRECRACKER", [RED, YEL, BLK], ["pataka", "firecracker", "hot", "diwali", "hindi"], "Rozha One", 26),
  badge("dp-kaleshi", "Kaleshi aurat badge", "KALESHI", "AURAT · CERTIFIED", [PINK, "#FFFFFF", BLK], ["kaleshi", "aurat", "fight", "attitude", "hinglish"], "Bowlby One", 15),
  badge("dp-drama-queen", "Drama queen badge", "DRAMA", "QUEEN · SINCE BIRTH", ["#7B2CBF", YEL, BLK], ["drama", "queen", "attitude", "filmy"], "Bowlby One", 18),
  badge("dp-apni-fav", "Apni favourite badge", "खुद की", "FAVOURITE · ALWAYS", [YEL, RED, BLK], ["favourite", "self love", "main", "hindi", "confidence"], "Rozha One", 20),
  badge("dp-jugaad", "Jugaad badge", "JUGAAD", "CERTIFIED ENGINEER", ["#0F7A3C", YEL, BLK], ["jugaad", "hack", "engineer", "hinglish"], "Bowlby One", 16),
  badge("dp-ghar-ka-khana", "Ghar ka khana badge", "घर का", "KHANA · NO COMPROMISE", ["#F6A21E", BLK, BLK], ["food", "home", "khana", "hindi"], "Rozha One", 24),
  badge("dp-sasta", "Sasta & tikau badge", "SASTA", "& TIKAU · 100%", ["#1D3FD8", YEL, BLK], ["cheap", "value", "deal", "sale", "hinglish"], "Bowlby One", 20),
  sign("dp-sign-chai", "जब मिले, तब चाय", "जब मिले, तब चाय", "TIMINGS: ALWAYS", ["chai", "tea", "hindi", "cafe"]),
  sign("dp-sign-shaadi", "Shaadi season board", "शादी का सीज़न", "BAND · BAJA · BUFFET", ["shaadi", "wedding", "season"]),
  sign("dp-sign-filmy", "Filmy entry board", "एंट्री धमाकेदार", "HOUSEFULL · SHOW 9 PM", ["filmy", "cinema", "entry", "housefull"], [BLK, YEL, YEL]),
  S("dp-horn-ok", "Horn OK Please", C, ["horn ok please", "truck", "truck art", "road", "desi"], [YEL, RED, BLK], ({ c }) => (
    <g>
      <rect x="4" y="6" width="192" height="68" rx="10" fill={c.fill} stroke={c.ink} strokeWidth="2.4" />
      <rect x="10" y="12" width="180" height="56" rx="7" fill="none" stroke={c.accent} strokeWidth="2" strokeDasharray="6 3" />
      {truckFlower(28, 40, 18, c.accent, "#1D8A4E", "l")}{truckFlower(172, 40, 18, c.accent, "#1D8A4E", "r")}
      <T x={100} y={38} s={20} f="Rozha One" c={c.accent}>HORN</T>
      <T x={100} y={60} s={16} f="Bowlby One" c={c.ink}>OK PLEASE</T>
    </g>
  ), { vb: [200, 80], size: [480, 192] }),
  S("dp-truck-flower", "Truck-art flower", C, ["truck art", "flower", "folk", "pattern", "desi"], [RED, "#1D8A4E", BLK], ({ c }) => (
    <g>{truckFlower(50, 50, 46, c.fill, c.accent, "a")}{truckFlower(50, 50, 24, YEL, c.fill, "b")}</g>
  ), { size: [200, 200] }),
  S("dp-evil-eye-string", "Nazar bead string", C, ["evil eye", "nazar", "beads", "protection", "desi"], ["#1D3FD8", "#9AD0FF", BLK], ({ c }) => (
    <g>
      <path d="M50,0 L50,14" {...line(c.ink, 1.4)} />
      {[24, 50, 76].map((y, i) => (
        <g key={y}><circle cx="50" cy={y + 6} r={i === 1 ? 14 : 10} fill={c.fill} /><circle cx="50" cy={y + 6} r={i === 1 ? 9.5 : 6.6} fill="#FFFFFF" /><circle cx="50" cy={y + 6} r={i === 1 ? 6 : 4.2} fill={c.accent} /><circle cx="50" cy={y + 6} r={i === 1 ? 2.8 : 2} fill={BLK} /></g>
      ))}
      <path d="M44,96 L50,90 L56,96" fill="none" stroke={c.ink} strokeWidth="1.4" />
    </g>
  ), { size: [140, 140] }),
  S("dp-mehndi-hand", "Mehndi hand", C, ["mehndi", "henna", "hand", "wedding", "line art", "desi"], ["#8E3B12", "#F3D2B3", "#8E3B12"], ({ c }) => (
    <g>
      <path d="M36,98 L34,62 C26,56 18,48 20,42 C22,36 30,40 34,46 L34,16 C34,10 42,10 42,16 L42,40 L44,8 C44,2 52,2 52,8 L52,40 L56,12 C56,6 64,6 64,12 L62,42 L68,22 C68,16 76,16 76,22 L72,58 C70,72 64,84 64,98Z" fill={c.accent} stroke={c.fill} strokeWidth="1.8" strokeLinejoin="round" />
      <g {...line(c.ink, 1.2)}>
        <circle cx="52" cy="66" r="9" /><circle cx="52" cy="66" r="4" />
        {Array.from({ length: 8 }, (_, i) => <path key={i} d="M52,55 C50,52 54,52 52,55" transform={`rotate(${i * 45} 52 66)`} />)}
        <path d="M38,18 L38,30 M48,10 L48,26 M60,14 L60,28 M72,24 L70,36" strokeDasharray="1.6 2" />
        <path d="M38,84 C46,80 56,80 62,84 M40,90 C48,86 56,86 62,90" />
      </g>
    </g>
  ), { size: [200, 200] }),
  S("dp-kulhad", "Kulhad chai", C, ["kulhad", "chai", "tea", "clay", "cup", "desi"], ["#B5542A", "#D9A066", "#5A2410"], ({ c }) => (
    <g>
      <path d="M38,20 C34,12 40,6 38,0 M52,22 C48,14 54,8 52,2 M64,20 C60,12 66,8 64,2" {...line("#9CA3AF", 1.8)} opacity=".8" />
      <path d="M18,28 L82,28 L72,90 C70,95 30,95 28,90Z" fill={c.fill} stroke={c.ink} strokeWidth="2.2" strokeLinejoin="round" />
      <ellipse cx="50" cy="28" rx="32" ry="6" fill={c.accent} stroke={c.ink} strokeWidth="2" />
      <ellipse cx="50" cy="29" rx="27" ry="4" fill="#C08A55" />
      <path d="M26,44 L74,44" {...line(c.ink, 1.2)} opacity=".4" />
      <path d="M30,60 L36,60 M64,72 L70,72" {...line("#FFFFFF", 1.4)} opacity=".35" />
    </g>
  ), { size: [180, 180] }),
  S("dp-cutting-chai", "Cutting chai glass", C, ["cutting chai", "chai", "glass", "tea", "mumbai", "desi"], ["#C9822F", "#F2E8D5", "#3A2410"], ({ c }) => (
    <g>
      <path d="M26,18 L74,18 L68,92 L32,92Z" fill="#EAF6FA" stroke={c.ink} strokeWidth="2" opacity=".95" />
      <path d="M28.5,40 L71.5,40 L68,90 L32,90Z" fill={c.fill} />
      <ellipse cx="50" cy="40" rx="21.5" ry="3" fill={c.accent} opacity=".85" />
      {[30, 37, 44, 51, 58, 65].map((x) => <path key={x} d={`M${x},20 L${x + 1.6},90`} stroke="#FFFFFF" strokeWidth="1.2" opacity=".35" />)}
    </g>
  ), { size: [170, 170] }),
  S("dp-auto", "Auto-rickshaw", C, ["auto", "rickshaw", "tuk tuk", "street", "india", "travel"], [YEL, "#1D8A4E", BLK], ({ c }) => (
    <g>
      <path d="M14,70 L14,40 C14,22 30,12 52,12 L70,12 C82,12 88,24 90,40 L94,70Z" fill={c.accent} stroke={c.ink} strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M14,52 L94,52 L94,72 L14,72Z" fill={c.fill} stroke={c.ink} strokeWidth="2.4" />
      <path d="M58,20 L80,20 C84,26 86,32 86,40 L58,40Z" fill="#BFE3FF" stroke={c.ink} strokeWidth="1.8" />
      <path d="M22,40 C22,28 32,20 50,20 L50,40Z" fill="#BFE3FF" stroke={c.ink} strokeWidth="1.8" opacity=".8" />
      {[[26, 76], [84, 76]].map(([x, y], i) => <g key={i}><circle cx={x} cy={y} r="11" fill={c.ink} /><circle cx={x} cy={y} r="4.6" fill="#D1D5DB" /></g>)}
      <rect x="40" y="56" width="26" height="9" rx="1.5" fill="#FFFFFF" stroke={c.ink} strokeWidth="1.2" />
      <T x={53} y={63} s={6} f="Space Mono" c={c.ink} w={700}>GJ 05</T>
    </g>
  ), { size: [240, 240] }),
  S("dp-rangoli-corner", "Rangoli corner", C, ["rangoli", "corner", "border", "diwali", "festival", "pattern"], [RED, "#F6A21E", "#0F6E6E"], ({ c }) => (
    <g>
      {[0, 1, 2].map((k) => <path key={k} d={`M0,${20 + k * 26} A${20 + k * 26},${20 + k * 26} 0 0 0 ${20 + k * 26},0`} fill="none" stroke={[c.fill, c.accent, c.ink][k]} strokeWidth="5" />)}
      {Array.from({ length: 7 }, (_, i) => { const a = (i / 6) * (Math.PI / 2); return <ellipse key={i} cx={Math.cos(a) * 82} cy={Math.sin(a) * 82} rx="6" ry="11" fill={c.fill} transform={`rotate(${(a * 180) / Math.PI + 90} ${Math.cos(a) * 82} ${Math.sin(a) * 82})`} />; })}
      {Array.from({ length: 5 }, (_, i) => { const a = (i / 4) * (Math.PI / 2); return <circle key={i} cx={Math.cos(a) * 34} cy={Math.sin(a) * 34} r="4" fill={c.ink} />; })}
      <circle cx="0" cy="0" r="12" fill={c.accent} />
    </g>
  ), { size: [240, 240], border: "none" }),
  S("dp-diya-glow", "Glowing diya", C, ["diya", "lamp", "diwali", "glow", "festival", "light"], ["#F6A21E", "#D7261E", "#5A2410"], ({ c, uid }) => (
    <g>
      <defs><radialGradient id={`dg${uid}`}><stop offset="0" stopColor="#FFE58A" stopOpacity=".95" /><stop offset="1" stopColor="#FFE58A" stopOpacity="0" /></radialGradient></defs>
      <circle cx="50" cy="34" r="30" fill={`url(#dg${uid})`} />
      <path d="M50,8 C58,22 62,32 50,44 C38,32 42,22 50,8Z" fill={c.fill} /><path d="M50,22 C54,30 54,36 50,42 C46,36 46,30 50,22Z" fill="#FFF3B0" />
      <path d="M10,56 Q50,100 90,56 Q70,66 50,66 Q30,66 10,56Z" fill={c.accent} stroke={c.ink} strokeWidth="2.2" strokeLinejoin="round" />
      <ellipse cx="50" cy="57" rx="40" ry="7" fill="#8E3414" stroke={c.ink} strokeWidth="2.2" />
      {[30, 42, 58, 70].map((x) => <circle key={x} cx={x} cy="76" r="2.2" fill={c.fill} />)}
    </g>
  ), { size: [200, 200] }),
  S("dp-marigold-string", "Marigold string", C, ["marigold", "genda", "garland", "string", "wedding", "puja"], ["#F6A21E", "#FF7A1A", "#2E7D32"], ({ c }) => (
    <g>
      <path d="M50,0 L50,200" {...line(c.ink, 1.2)} />
      {Array.from({ length: 9 }, (_, i) => (
        <g key={i} transform={`translate(0 ${4 + i * 22})`}>
          <path d={scallop(14, 11, 1.6, 50, 10)} fill={i % 2 ? c.fill : c.accent} />
          <path d={scallop(10, 7, 1.4, 50, 10)} fill={i % 2 ? c.accent : c.fill} />
          {i % 3 === 2 && <path d="M50,20 C60,22 64,18 66,14 C60,14 54,16 50,20Z" fill={c.ink} />}
        </g>
      ))}
    </g>
  ), { vb: [100, 206], size: [110, 226], border: "none" }),
  S("dp-pressure-cooker", "Pressure cooker", C, ["pressure cooker", "cooker", "kitchen", "whistle", "food", "desi"], ["#C9CED8", BLK, "#2B2B2B"], ({ c, uid }) => (
    <g>
      <defs><Gloss id={`pc${uid}`} base={c.fill} dark="#7C8696" /></defs>
      <path d="M44,2 C40,10 46,14 42,20 M56,2 C52,10 58,14 54,20" {...line("#9CA3AF", 1.8)} />
      <rect x="44" y="20" width="12" height="10" rx="3" fill={c.accent} />
      <path d="M14,40 C14,30 30,26 50,26 C70,26 86,30 86,40Z" fill={`url(#pc${uid})`} stroke={c.ink} strokeWidth="2" />
      <path d="M86,36 L98,30 L98,40 L86,42Z" fill={c.accent} />
      <path d="M12,42 L88,42 L84,86 C84,92 16,92 16,86Z" fill={`url(#pc${uid})`} stroke={c.ink} strokeWidth="2" />
      <path d="M22,50 L24,80" {...line("#FFFFFF", 2.4)} opacity=".7" />
      <T x={50} y={72} s={9} f="Bowlby One" c={c.ink}>SEETI x3</T>
    </g>
  ), { size: [200, 200] }),
  S("dp-jhumka", "Jhumka", C, ["jhumka", "earring", "jewellery", "gold", "wedding", "desi"], ["#D4AF37", RED, "#7A5A12"], ({ c, uid }) => (
    <g>
      <defs><Gloss id={`jh${uid}`} base={c.fill} dark={c.ink} hi="#FFF3C4" /></defs>
      <circle cx="50" cy="10" r="6" fill="none" stroke={c.fill} strokeWidth="2.6" />
      <circle cx="50" cy="26" r="10" fill={`url(#jh${uid})`} stroke={c.ink} strokeWidth="1" /><circle cx="50" cy="26" r="4" fill={c.accent} />
      <path d="M22,70 C22,46 34,36 50,36 C66,36 78,46 78,70Z" fill={`url(#jh${uid})`} stroke={c.ink} strokeWidth="1.2" />
      {[30, 40, 50, 60, 70].map((x) => <circle key={x} cx={x} cy="54" r="2.4" fill={c.accent} />)}
      {Array.from({ length: 9 }, (_, i) => <g key={i}><path d={`M${24 + i * 6.5},70 L${24 + i * 6.5},82`} stroke={c.ink} strokeWidth=".8" /><circle cx={24 + i * 6.5} cy="85" r="3" fill="#FFFDF6" stroke="#B8A88E" strokeWidth=".7" /></g>)}
    </g>
  ), { size: [160, 160] }),
  S("dp-bindi", "Bindi burst", C, ["bindi", "dot", "red", "desi", "minimal"], [RED, "#D4AF37", BLK], ({ c }) => (
    <g>
      <path d={poly(starPts(12, 46, 34))} fill={c.accent} />
      <circle cx="50" cy="50" r="30" fill={c.fill} />
      <circle cx="50" cy="50" r="12" fill={c.accent} /><circle cx="50" cy="50" r="5" fill={c.fill} />
    </g>
  ), { size: [140, 140] }),
  S("dp-lotus", "Lotus", C, ["lotus", "kamal", "flower", "pink", "spiritual", "desi"], [PINK, "#FFC2D1", "#7A1030"], ({ c }) => (
    <g>
      {[-60, -30, 0, 30, 60].map((a, i) => <path key={a} d="M50,80 C36,64 36,34 50,14 C64,34 64,64 50,80Z" fill={i % 2 ? c.accent : c.fill} stroke={c.ink} strokeWidth="1.6" transform={`rotate(${a} 50 80)`} />)}
      <path d="M16,82 Q50,94 84,82" {...line("#1D8A4E", 3)} />
    </g>
  ), { size: [200, 200] }),
  S("dp-desi-stamp", "100% desi stamp", C, ["stamp", "desi", "certified", "100%", "made in india"], [RED, RED, RED], ({ c }) => (
    <g opacity=".9" transform="rotate(-10 50 50)">
      <circle cx="50" cy="50" r="44" fill="none" stroke={c.fill} strokeWidth="3.4" />
      <circle cx="50" cy="50" r="36" fill="none" stroke={c.fill} strokeWidth="1.4" />
      <T x={50} y={46} s={20} f="Bowlby One" c={c.fill}>100%</T>
      <T x={50} y={64} s={13} f="Bowlby One" c={c.fill} ls={2}>DESI</T>
      <T x={50} y={26} s={6} f="Space Mono" w={700} c={c.fill} ls={1}>CERTIFIED BY MUMMY</T>
      {[22, 78].map((x) => <path key={x} d={HEART} fill={c.fill} transform={heartAt(x, 52, 4)} />)}
    </g>
  ), { size: [200, 200], border: "none" }),
  S("dp-chai-pe-charcha", "Chai pe charcha bubble", C, ["chai", "charcha", "speech", "bubble", "gossip", "hinglish"], [CREAM, "#B5542A", BLK], ({ c }) => (
    <g>
      <path d="M10,10 L190,10 L190,64 L60,64 L40,82 L44,64 L10,64Z" fill={c.fill} stroke={c.ink} strokeWidth="2.4" strokeLinejoin="round" />
      <T x={100} y={45} s={24} f="Rozha One" c={c.accent}>चाय पे चर्चा?</T>
    </g>
  ), { vb: [200, 90], size: [420, 189] }),
];
