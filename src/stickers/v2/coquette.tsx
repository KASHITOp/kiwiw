// Scrapbook Coquette: lips, cherries, bows, hearts, love letters. Original SVG.
import { S, HEART, heartAt, LIP_UP, LIP_LO, Gloss, Dots, T, line, sparkle } from "./kit";
import type { StickerDef } from "../library";

const C = "Coquette" as const;
const RED = "#C8102E", PINK = "#FF8FB1", CREAM = "#FBEEDC";

const bow = (cx: number, cy: number, s: number, fill: string, ink: string) => (
  <g transform={`translate(${cx} ${cy}) scale(${s})`}>
    <path d="M0,0 C-10,-14 -30,-18 -34,-6 C-37,4 -22,10 0,0Z" fill={fill} stroke={ink} strokeWidth="2" strokeLinejoin="round" />
    <path d="M0,0 C10,-14 30,-18 34,-6 C37,4 22,10 0,0Z" fill={fill} stroke={ink} strokeWidth="2" strokeLinejoin="round" />
    <path d="M-2,2 C-8,16 -14,28 -20,36 L-12,34 L-8,40 C-4,28 -1,16 2,4Z" fill={fill} stroke={ink} strokeWidth="2" strokeLinejoin="round" />
    <path d="M2,2 C8,16 14,28 20,36 L12,34 L8,40 C4,28 1,16 -2,4Z" fill={fill} stroke={ink} strokeWidth="2" strokeLinejoin="round" />
    <ellipse rx="6" ry="5.5" fill={fill} stroke={ink} strokeWidth="2" />
    <path d="M-26,-6 C-20,-8 -12,-6 -6,-2 M26,-6 C20,-8 12,-6 6,-2" {...line(ink, 1.3)} opacity=".55" />
  </g>
);

const cherry = (x: number, y: number, r: number, fill: string, uid: string, k: string) => (
  <g>
    <defs><Gloss id={`cg${k}${uid}`} base={fill} dark="#5E0010" hi="#FFD0D8" /></defs>
    <circle cx={x} cy={y} r={r} fill={`url(#cg${k}${uid})`} />
    <ellipse cx={x - r * 0.38} cy={y - r * 0.4} rx={r * 0.22} ry={r * 0.13} fill="#fff" opacity=".9" transform={`rotate(-30 ${x} ${y})`} />
  </g>
);

export const COQUETTE: StickerDef[] = [
  S("cq-lips-glossy", "Glossy red lips", C, ["lips", "kiss", "red", "glossy", "coquette", "mouth", "love"], [RED, "#FFFFFF", "#5E0010"], ({ c, uid }) => (
    <g>
      <defs><linearGradient id={`lg${uid}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={c.fill} /><stop offset="1" stopColor={c.ink} /></linearGradient></defs>
      <path d={LIP_UP} fill={`url(#lg${uid})`} />
      <path d={LIP_LO} fill={c.fill} />
      <path d="M8,30 C30,33 70,33 92,30" {...line(c.ink, 2)} />
      <path d="M30,40 C38,46 54,47 64,42" {...line(c.accent, 3.2)} opacity=".8" />
      <path d="M36,17 C40,15 43,16 45,19" {...line(c.accent, 2)} opacity=".7" />
    </g>
  ), { vb: [100, 60], size: [260, 156] }),
  S("cq-lips-halftone", "Halftone lips", C, ["lips", "halftone", "kiss", "b&w", "print", "coquette"], ["#111111", "#F4EBDD", "#111111"], ({ c, uid }) => (
    <g>
      <defs><Dots id={`hd${uid}`} ink={c.fill} size={3.4} r={1.2} /></defs>
      <path d={LIP_UP} fill={c.accent} /><path d={LIP_LO} fill={c.accent} />
      <path d={LIP_UP} fill={`url(#hd${uid})`} /><path d={LIP_LO} fill={`url(#hd${uid})`} opacity=".75" />
      <path d="M8,30 C30,33 70,33 92,30" {...line(c.ink, 2.4)} />
    </g>
  ), { vb: [100, 60], size: [260, 156] }),
  S("cq-kiss", "Kiss mark", C, ["kiss", "lipstick", "mark", "smooch", "love", "coquette"], [RED, RED, RED], ({ c }) => (
    <g opacity=".92">
      <path d={LIP_UP} fill={c.fill} transform="translate(0 2) rotate(-8 50 30)" />
      <path d={LIP_LO} fill={c.fill} transform="rotate(-8 50 30)" />
      {Array.from({ length: 14 }, (_, i) => <path key={i} d={`M${14 + i * 5.4},${28 + Math.sin(i) * 3} l${(i % 3) - 1},${i % 2 ? 9 : -8}`} {...line("#FFFFFF", 1.1)} opacity=".55" transform="rotate(-8 50 30)" />)}
    </g>
  ), { vb: [100, 60], size: [200, 120], border: "none" }),
  S("cq-kiss-trio", "Kiss trail", C, ["kiss", "kisses", "xoxo", "lipstick", "love", "coquette"], [RED, PINK, "#8E0B22"], ({ c }) => (
    <g>
      {[[20, 30, -14, 0.5, c.fill], [52, 60, 8, 0.44, c.accent], [84, 32, -4, 0.38, c.ink]].map(([x, y, r, s, f], i) => (
        <g key={i} transform={`translate(${+x - 50 * +s} ${+y - 30 * +s}) rotate(${r} ${50 * +s} ${30 * +s}) scale(${s})`}>
          <path d={LIP_UP} fill={f as string} /><path d={LIP_LO} fill={f as string} />
        </g>
      ))}
    </g>
  ), { vb: [104, 80], size: [260, 200], border: "none" }),
  S("cq-cherries", "Cherries with a bow", C, ["cherry", "cherries", "bow", "coquette", "fruit", "cute"], [RED, PINK, "#2E5E1E"], ({ c, uid }) => (
    <g>
      <path d="M36,74 C40,50 48,30 60,18 M66,70 C64,48 62,32 60,18" {...line(c.ink, 2.6)} />
      <path d="M60,18 C70,8 86,8 92,14 C82,20 70,22 60,18Z" fill="#4E8C2A" stroke={c.ink} strokeWidth="1.6" />
      {cherry(34, 78, 15, c.fill, uid, "a")}
      {cherry(68, 74, 15, c.fill, uid, "b")}
      {bow(59, 22, 0.46, c.accent, "#7A1030")}
    </g>
  )),
  S("cq-cherry", "Single cherry", C, ["cherry", "coquette", "fruit", "red"], [RED, "#4E8C2A", "#2E1A0E"], ({ c, uid }) => (
    <g>
      <path d="M50,58 C52,40 60,22 74,10" {...line(c.ink, 2.6)} />
      <path d="M70,14 C76,4 90,4 94,10 C86,16 76,18 70,14Z" fill={c.accent} />
      {cherry(48, 70, 22, c.fill, uid, "s")}
    </g>
  ), { size: [180, 180] }),
  S("cq-bow", "Ribbon bow", C, ["bow", "ribbon", "coquette", "pink", "cute", "gift"], [PINK, "#FFFFFF", "#7A1030"], ({ c }) => (
    <g>{bow(50, 38, 1.32, c.fill, c.ink)}<path d="M18,30 C24,26 32,28 38,34" {...line(c.accent, 2.4)} opacity=".8" /></g>
  ), { size: [220, 220] }),
  S("cq-bow-satin", "Satin bow (red)", C, ["bow", "ribbon", "satin", "red", "coquette"], [RED, "#FF6B81", "#4A0010"], ({ c }) => (
    <g>{bow(50, 38, 1.32, c.fill, c.ink)}{bow(50, 38, 0.8, c.accent, c.ink)}</g>
  ), { size: [220, 220] }),
  S("cq-bow-row", "Tiny bow row", C, ["bow", "border", "row", "ribbon", "coquette", "divider"], [PINK, CREAM, "#7A1030"], ({ c }) => (
    <g>
      <path d="M2,22 Q75,30 148,22" {...line(c.ink, 1.4)} strokeDasharray="3 3" />
      {[18, 56, 94, 132].map((x) => <g key={x}>{bow(x, 20, 0.42, c.fill, c.ink)}</g>)}
    </g>
  ), { vb: [150, 44], size: [600, 176] }),
  S("cq-heart-glossy", "Glossy heart", C, ["heart", "glossy", "love", "red", "3d", "coquette"], [RED, "#FFFFFF", "#5E0010"], ({ c, uid }) => (
    <g>
      <defs><Gloss id={`hg${uid}`} base={c.fill} dark={c.ink} /></defs>
      <path d={HEART} fill={`url(#hg${uid})`} />
      <ellipse cx="27" cy="22" rx="12" ry="6" fill={c.accent} opacity=".9" transform="rotate(-28 27 22)" />
      <circle cx="40" cy="16" r="2.4" fill={c.accent} opacity=".9" />
    </g>
  ), { vb: [100, 90], size: [220, 198] }),
  S("cq-heart-glitter", "Glitter heart", C, ["heart", "glitter", "sparkle", "pink", "love", "coquette"], [PINK, "#FFFFFF", "#C2185B"], ({ c, uid }) => (
    <g>
      <defs><clipPath id={`gh${uid}`}><path d={HEART} /></clipPath></defs>
      <path d={HEART} fill={c.ink} />
      <g clipPath={`url(#gh${uid})`}>
        {Array.from({ length: 130 }, (_, i) => {
          const x = (i * 37.7) % 100, y = (i * 61.3) % 90, s = 1 + ((i * 13) % 5) * 0.5;
          return <rect key={i} x={x} y={y} width={s} height={s} fill={i % 4 === 0 ? c.accent : c.fill} transform={`rotate(${i * 23} ${x} ${y})`} opacity={0.6 + (i % 3) * 0.2} />;
        })}
      </g>
      <path d={sparkle(76, 22, 9)} fill={c.accent} /><path d={sparkle(26, 60, 5)} fill={c.accent} />
    </g>
  ), { vb: [100, 90], size: [220, 198] }),
  S("cq-heart-pin", "Safety-pin heart", C, ["heart", "safety pin", "punk", "coquette", "love"], [RED, "#D9DDE3", "#1A0A0E"], ({ c }) => (
    <g>
      <path d={HEART} fill={c.fill} stroke={c.ink} strokeWidth="2.4" />
      <g transform="rotate(-24 50 46)">
        <path d="M22,46 L78,46 C86,46 86,38 78,38 L30,38" {...line(c.ink, 4.4)} />
        <path d="M22,46 L78,46 C86,46 86,38 78,38 L30,38" {...line(c.accent, 2.4)} />
        <circle cx="84" cy="42" r="2" fill={c.accent} />
        <rect x="16" y="36" width="12" height="12" rx="2.5" fill={c.accent} stroke={c.ink} strokeWidth="1.8" />
      </g>
    </g>
  ), { vb: [100, 90], size: [210, 189] }),
  S("cq-heart-torn", "Torn heart", C, ["heart", "torn", "broken", "paper", "coquette", "heartbreak"], [RED, CREAM, "#1A0A0E"], ({ c }) => (
    <g>
      <path d="M48,86 C20,64 4,46 4,28 C4,12 16,4 28,4 C38,4 44,10 48,18 L42,32 L52,44 L40,58 L50,70Z" fill={c.fill} stroke={c.accent} strokeWidth="3" transform="rotate(-6 30 50) translate(-3 0)" />
      <path d="M54,86 C80,64 96,46 96,28 C96,12 84,4 72,4 C62,4 56,10 52,18 L46,32 L56,44 L44,58 L54,70Z" fill={c.fill} stroke={c.accent} strokeWidth="3" transform="rotate(7 70 50) translate(4 0)" />
    </g>
  ), { vb: [104, 92], size: [210, 186] }),
  S("cq-heart-anatomical", "Anatomical heart (line art)", C, ["heart", "anatomical", "line art", "tattoo", "coquette", "goth"], ["#1A0A0E", RED, "#1A0A0E"], ({ c }) => (
    <g {...line(c.fill, 2)}>
      <path d="M50,92 C30,82 16,66 16,48 C16,34 24,26 34,26 C40,26 44,28 48,32 C54,26 60,22 70,24 C82,26 88,38 86,52 C84,68 70,84 50,92Z" />
      <path d="M38,26 C36,18 36,10 40,4 M48,32 C48,22 50,12 56,6 M60,24 C62,16 66,10 72,8 M72,8 L78,4 M40,4 L34,2" />
      <path d="M28,50 C34,58 36,68 34,78 M50,46 C56,56 58,70 54,84 M70,40 C66,50 70,62 76,68" opacity=".7" />
      <path d="M22,40 C28,38 34,40 38,44 M62,34 C68,32 74,34 78,40" opacity=".6" />
      <path d="M40,60 C44,62 46,66 46,70" stroke={c.accent} />
    </g>
  ), { size: [200, 200], uses: ["fill", "accent"] }),
  S("cq-heart-doodle", "Doodle heart", C, ["heart", "doodle", "outline", "hand drawn", "coquette"], [RED, RED, RED], ({ c }) => (
    <g {...line(c.fill, 3)}>
      <path d="M50,84 C24,64 8,46 10,28 C12,14 26,6 38,12 C44,15 48,20 50,26 C54,16 62,8 74,10 C88,12 94,28 88,44 C82,60 66,72 50,84 C46,80 42,76 40,72" />
    </g>
  ), { vb: [100, 90], size: [180, 162], border: "none" }),
  S("cq-envelope", "Envelope with heart seal", C, ["envelope", "letter", "mail", "heart", "seal", "love", "coquette"], [CREAM, RED, "#3A2418"], ({ c }) => (
    <g>
      <rect x="6" y="18" width="88" height="58" rx="3" fill={c.fill} stroke={c.ink} strokeWidth="2" />
      <path d="M6,20 L50,52 L94,20" fill="#F1DEC3" stroke={c.ink} strokeWidth="2" strokeLinejoin="round" />
      <path d="M6,76 L40,46 M94,76 L60,46" {...line(c.ink, 1.4)} opacity=".5" />
      <circle cx="50" cy="52" r="11" fill={c.accent} />
      <path d={HEART} fill="#8E0B22" transform={heartAt(50, 52, 6.5)} />
    </g>
  ), { vb: [100, 90], size: [240, 216] }),
  S("cq-love-letter", "Love letter", C, ["letter", "love", "note", "script", "coquette", "paper"], [CREAM, RED, "#3A2418"], ({ c }) => (
    <g>
      <path d="M10,6 L90,4 L92,96 L8,94Z" fill={c.fill} stroke={c.ink} strokeWidth="1.2" transform="rotate(-3 50 50)" />
      {[30, 44, 58, 72].map((y) => <line key={y} x1="16" x2="84" y1={y} y2={y} stroke="#C9B49A" strokeWidth=".8" transform="rotate(-3 50 50)" />)}
      <T x={50} y={26} s={14} f="Great Vibes" c={c.accent} rot={-3}>my dearest,</T>
      <T x={50} y={50} s={9.5} f="Great Vibes" c={c.ink} rot={-3}>you are my favourite</T>
      <T x={50} y={64} s={9.5} f="Great Vibes" c={c.ink} rot={-3}>notification. always.</T>
      <T x={68} y={84} s={10} f="Great Vibes" c={c.accent} rot={-3}>xoxo</T>
      <path d={HEART} fill={c.accent} transform={heartAt(84, 80, 5)} />
    </g>
  ), { size: [240, 240] }),
  S("cq-rose", "Red rose", C, ["rose", "flower", "red", "love", "coquette", "valentine"], [RED, "#3E7B2C", "#4A0010"], ({ c }) => (
    <g>
      <path d="M50,58 C50,72 48,86 46,98" {...line(c.accent, 3)} />
      <path d="M48,78 C38,72 28,74 22,80 C32,84 42,84 48,78Z M49,86 C58,80 68,82 74,88 C64,92 55,91 49,86Z" fill={c.accent} />
      <path d="M50,60 C28,60 20,44 26,28 C32,40 40,44 50,44 C60,44 68,40 74,28 C80,44 72,60 50,60Z" fill={c.fill} stroke={c.ink} strokeWidth="1.6" />
      <path d="M32,30 C30,16 44,8 52,14 C62,8 74,16 70,30 C64,38 40,40 32,30Z" fill={c.fill} stroke={c.ink} strokeWidth="1.6" />
      <path d="M42,24 C44,16 56,14 58,22 C56,30 46,32 42,24Z M46,22 C50,18 54,22 52,26" {...line(c.ink, 1.6)} />
    </g>
  ), { size: [200, 200] }),
  S("cq-lily", "Lily", C, ["lily", "flower", "white", "coquette", "wedding"], ["#FFF6F2", "#F7A8C0", "#3E7B2C"], ({ c }) => (
    <g>
      <path d="M50,56 C52,72 50,86 48,98" {...line(c.ink, 2.6)} />
      {[-70, -20, 30, 80, 130, 180].map((a, i) => (
        <path key={i} d="M50,50 C40,40 38,20 50,6 C62,20 60,40 50,50Z" fill={c.fill} stroke="#B97A8C" strokeWidth="1.2" transform={`rotate(${a} 50 50)`} />
      ))}
      {[-40, 0, 40].map((a) => <path key={a} d="M50,50 L50,30" {...line("#C9701E", 1.4)} transform={`rotate(${a} 50 50)`} />)}
      {[-40, 0, 40].map((a) => <circle key={a} cx="50" cy="29" r="2" fill="#8A3A10" transform={`rotate(${a} 50 50)`} />)}
      <circle cx="50" cy="50" r="5" fill={c.accent} />
    </g>
  ), { size: [200, 200] }),
  S("cq-martini", "Martini (olive optional)", C, ["martini", "cocktail", "drink", "glass", "party", "coquette"], ["#DDEFF5", "#7FA33A", "#1A1A1A"], ({ c }) => (
    <g>
      <path d="M14,14 L86,14 L50,56Z" fill={c.fill} stroke={c.ink} strokeWidth="2.4" strokeLinejoin="round" opacity=".95" />
      <path d="M22,22 L78,22 L50,52Z" fill="#B9DCE8" />
      <path d="M50,56 L50,88 M32,92 C40,88 60,88 68,92" {...line(c.ink, 2.6)} />
      <path d="M40,4 L62,36" {...line(c.ink, 1.8)} />
      <circle cx="56" cy="28" r="6" fill={c.accent} stroke={c.ink} strokeWidth="1.6" /><circle cx="57.5" cy="27" r="2" fill="#D7261E" />
      <path d="M22,18 L30,18" {...line("#FFFFFF", 2)} />
    </g>
  ), { size: [180, 180] }),
  S("cq-cocktail", "Cocktail with cherry", C, ["cocktail", "drink", "cherry", "party", "coquette", "pink"], [PINK, RED, "#1A1A1A"], ({ c, uid }) => (
    <g>
      <path d="M24,30 L76,30 L70,86 C70,90 30,90 30,86Z" fill="#EAF6FA" stroke={c.ink} strokeWidth="2.4" />
      <path d="M27,46 L73,46 L70,84 C70,87 30,87 30,84Z" fill={c.fill} />
      <path d="M30,52 L36,52" {...line("#FFFFFF", 2)} />
      <path d="M58,26 C60,14 66,8 74,4" {...line("#2E5E1E", 1.8)} />
      {cherry(58, 30, 9, c.accent, uid, "c")}
      <path d="M40,40 L32,6" {...line("#F2C200", 2.6)} />
    </g>
  ), { size: [180, 180] }),
  S("cq-pushpin", "Heart pushpin", C, ["pushpin", "pin", "thumbtack", "heart", "scrapbook", "coquette"], [RED, "#FFFFFF", "#5E0010"], ({ c, uid }) => (
    <g>
      <defs><Gloss id={`pp${uid}`} base={c.fill} dark={c.ink} /></defs>
      <path d="M50,60 L52,96" {...line("#9AA0A8", 2.6)} />
      <path d={HEART} fill={`url(#pp${uid})`} transform={heartAt(50, 36, 30)} />
      <ellipse cx="38" cy="24" rx="7" ry="4" fill={c.accent} opacity=".85" transform="rotate(-25 38 24)" />
    </g>
  ), { size: [140, 140] }),
  S("cq-lipstick", "Lipstick", C, ["lipstick", "makeup", "red", "beauty", "coquette"], [RED, "#D4AF37", "#1A1A1A"], ({ c }) => (
    <g transform="rotate(18 50 50)">
      <path d="M40,8 L60,18 L60,40 L40,40Z" fill={c.fill} stroke={c.ink} strokeWidth="2" strokeLinejoin="round" />
      <rect x="37" y="40" width="26" height="14" fill={c.accent} stroke={c.ink} strokeWidth="2" />
      <rect x="34" y="54" width="32" height="40" rx="3" fill={c.ink} />
      <path d="M44,12 L46,38" {...line("#FFFFFF", 1.6)} opacity=".7" /><path d="M40,62 L40,88" {...line("#5A5A5A", 2)} />
    </g>
  ), { size: [170, 170] }),
  S("cq-perfume", "Perfume bottle", C, ["perfume", "bottle", "fragrance", "glass", "coquette", "pink"], [PINK, "#FFFFFF", "#7A1030"], ({ c, uid }) => (
    <g>
      <defs><Gloss id={`pf${uid}`} base={c.fill} dark="#C2185B" /></defs>
      <rect x="42" y="12" width="16" height="16" rx="2" fill="#E9D7A8" stroke={c.ink} strokeWidth="1.8" />
      <path d="M20,40 C20,30 30,28 50,28 C70,28 80,30 80,40 L84,84 C84,92 16,92 16,84Z" fill={`url(#pf${uid})`} stroke={c.ink} strokeWidth="2" />
      <rect x="32" y="52" width="36" height="20" rx="2" fill={c.accent} opacity=".95" />
      <T x={50} y={66} s={9} f="Great Vibes" c={c.ink}>no. 11</T>
      <path d="M26,40 L28,78" {...line("#FFFFFF", 2.4)} opacity=".7" />
      {bow(50, 30, 0.34, "#FF6B81", c.ink)}
    </g>
  ), { size: [180, 180] }),
  S("cq-pearl-heart", "Pearl heart", C, ["pearl", "pearls", "heart", "jewellery", "coquette"], ["#FFFDF6", "#E8DCCB", "#B8A88E"], ({ c }) => (
    <g>
      {Array.from({ length: 26 }, (_, i) => {
        const t = (i / 26) * Math.PI * 2;
        const x = 50 + 16 * Math.pow(Math.sin(t), 3) * 2.6, y = 44 - (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * 2.5;
        return <g key={i}><circle cx={x} cy={y} r="4.6" fill={c.accent} stroke={c.ink} strokeWidth=".8" /><circle cx={x - 1.4} cy={y - 1.4} r="1.6" fill={c.fill} /></g>;
      })}
    </g>
  ), { size: [200, 200] }),
];
