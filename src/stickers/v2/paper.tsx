// Frames & Paper: polaroids, film, tickets, receipts, stamps, tape, clips.
import { S, HEART, heartAt, T, line } from "./kit";
import { tornEdge, poly, type Pt } from "../geometry";
import type { StickerDef } from "../library";

const C = "Frames & Paper" as const;
const CREAM = "#FBF5E9", INK = "#1C1712";

/** Perforated stamp edge around a rect. */
function stampPath(x: number, y: number, w: number, h: number, r = 2.2, step = 6) {
  let d = `M${x},${y}`;
  const edge = (x0: number, y0: number, dx: number, dy: number, len: number) => {
    const n = Math.round(len / step);
    for (let i = 0; i < n; i++) {
      const sx = x0 + dx * (i * step + step / 2 - r), sy = y0 + dy * (i * step + step / 2 - r);
      const ex = x0 + dx * (i * step + step / 2 + r), ey = y0 + dy * (i * step + step / 2 + r);
      d += ` L${sx},${sy} A${r},${r} 0 0 0 ${ex},${ey}`;
    }
    d += ` L${x0 + dx * len},${y0 + dy * len}`;
  };
  edge(x, y, 1, 0, w); edge(x + w, y, 0, 1, h); edge(x + w, y + h, -1, 0, w); edge(x, y + h, 0, -1, h);
  return d + "Z";
}

const ticket = (kind: string, name: string, title: string, sub: string, colors: [string, string, string], tags: string[]) =>
  S(kind, name, C, ["ticket", "stub", "admit", ...tags], colors, ({ c }) => (
    <g>
      <path d="M4,6 L156,6 L156,22 A6,6 0 0 0 156,34 L156,54 L4,54 L4,34 A6,6 0 0 0 4,22Z" fill={c.fill} stroke={c.ink} strokeWidth="1.6" />
      <path d="M120,8 L120,52" {...line(c.ink, 1.2)} strokeDasharray="2.5 2.5" />
      <rect x="10" y="12" width="104" height="36" fill="none" stroke={c.ink} strokeWidth=".8" />
      <T x={62} y={34} s={title.length > 12 ? 11 : 15} f="Bowlby One" c={c.ink} ls={0.6}>{title}</T>
      <T x={62} y={44} s={5} f="Space Mono" c={c.ink} w={700} ls={1}>{sub}</T>
      <T x={138} y={33} s={9} f="Space Mono" c={c.accent} w={700} rot={-90}>Nº 0711</T>
    </g>
  ), { vb: [160, 60], size: [400, 150] });

export const PAPER: StickerDef[] = [
  S("pp-polaroid", "Polaroid", C, ["polaroid", "photo", "frame", "instant", "scrapbook"], [CREAM, "#2B2B2B", INK], ({ c }) => (
    <g>
      <rect x="10" y="4" width="80" height="94" rx="1.5" fill={c.fill} stroke="#00000022" />
      <rect x="16" y="10" width="68" height="64" fill={c.accent} />
      <path d="M16,60 L34,44 L48,56 L62,38 L84,62 L84,74 L16,74Z" fill="#4B5563" opacity=".6" />
      <circle cx="68" cy="24" r="6" fill="#9CA3AF" opacity=".7" />
      <T x={50} y={90} s={9} f="Caveat Variable" c={c.ink} w={700}>core memory</T>
    </g>
  ), { size: [240, 240], border: "none" }),
  S("pp-film", "Film strip", C, ["film", "strip", "negative", "35mm", "cinema", "frame"], ["#1C1C1C", "#F2B33D", "#FBF5E9"], ({ c }) => (
    <g>
      <rect x="0" y="0" width="200" height="60" fill={c.fill} />
      {Array.from({ length: 20 }, (_, i) => <g key={i}><rect x={4 + i * 10} y="3" width="5" height="5" rx="1" fill={c.ink} /><rect x={4 + i * 10} y="52" width="5" height="5" rx="1" fill={c.ink} /></g>)}
      {[0, 1, 2].map((i) => <rect key={i} x={6 + i * 64} y="12" width="60" height="36" fill={c.accent} opacity={0.75 + i * 0.1} />)}
      <T x={30} y={58.5} s={3.6} f="Space Mono" c={c.accent}>KW 400 · 07</T>
    </g>
  ), { vb: [200, 60], size: [600, 180], border: "none" }),
  S("pp-photobooth", "Photo-booth strip", C, ["photobooth", "photo booth", "strip", "frame", "polaroid", "friends"], ["#FFFFFF", "#D1D5DB", INK], ({ c }) => (
    <g>
      <rect x="20" y="0" width="60" height="200" fill={c.fill} stroke="#00000018" />
      {[0, 1, 2, 3].map((i) => <rect key={i} x="26" y={6 + i * 44} width="48" height="40" fill={c.accent} />)}
      <T x={50} y={196} s={6} f="Caveat Variable" c={c.ink} w={700}>11.11.26 ♡</T>
    </g>
  ), { vb: [100, 200], size: [150, 300], border: "none" }),
  S("pp-frame-ornate", "Ornate frame", C, ["frame", "ornate", "gold", "vintage", "retro", "baroque"], ["#D4AF37", "#FFF3C4", "#7A5A12"], ({ c }) => (
    <g>
      <rect x="6" y="6" width="88" height="88" rx="4" fill="none" stroke={c.fill} strokeWidth="9" />
      <rect x="6" y="6" width="88" height="88" rx="4" fill="none" stroke={c.ink} strokeWidth="1.4" />
      <rect x="13" y="13" width="74" height="74" fill="none" stroke={c.ink} strokeWidth="1" />
      {[[10, 10], [90, 10], [10, 90], [90, 90]].map(([x, y], i) => <g key={i}><circle cx={x} cy={y} r="7" fill={c.fill} stroke={c.ink} strokeWidth="1.2" /><circle cx={x} cy={y} r="2.6" fill={c.accent} /></g>)}
      {[50].map((x) => <g key={x}><path d={`M${x - 10},6 Q${x},-2 ${x + 10},6`} fill={c.fill} stroke={c.ink} strokeWidth="1.2" /><path d={`M${x - 10},94 Q${x},102 ${x + 10},94`} fill={c.fill} stroke={c.ink} strokeWidth="1.2" /></g>)}
    </g>
  ), { size: [320, 320], border: "none" }),
  S("pp-frame-scallop", "Scalloped frame", C, ["frame", "scallop", "cute", "coquette", "border"], ["#FF8FB1", "#FFFFFF", "#7A1030"], ({ c }) => (
    <g>
      {Array.from({ length: 40 }, (_, i) => {
        const side = Math.floor(i / 10), t = (i % 10) * 9 + 9.5;
        const [x, y] = side === 0 ? [t, 5] : side === 1 ? [95, t] : side === 2 ? [100 - t, 95] : [5, 100 - t];
        return <circle key={i} cx={x} cy={y} r="5.6" fill={c.fill} />;
      })}
      <rect x="5" y="5" width="90" height="90" fill={c.fill} /><rect x="13" y="13" width="74" height="74" fill={c.accent} stroke={c.ink} strokeWidth=".8" strokeDasharray="2 2" />
    </g>
  ), { size: [320, 320], border: "none" }),
  ticket("pp-ticket-admit", "Admit One ticket", "ADMIT ONE", "VALID FOR ONE (1) GOOD TIME", ["#F4D35E", "#C8102E", INK], ["admit one", "event", "cinema"]),
  ticket("pp-ticket-lucky", "Lucky ticket", "LUCKY TICKET", "KEEP THIS · IT KNOWS THINGS", ["#FF8FB1", "#7A1030", INK], ["lucky", "raffle", "coquette"]),
  ticket("pp-ticket-nowhere", "Ticket to nowhere", "TICKET TO NOWHERE", "ONE WAY · NO REFUNDS ON VIBES", ["#9AD0FF", "#1D3FD8", INK], ["nowhere", "travel", "trip"]),
  S("pp-receipt", "Receipt", C, ["receipt", "bill", "paper", "shopping", "list"], ["#FFFFFF", "#6B7280", INK], ({ c }) => {
    const top = tornEdge(10, 90, 6, 3, 5, 2.4), bot = tornEdge(90, 10, 116, 9, 5, 2.4);
    const rows = [["CHAI", "20"], ["MORE CHAI", "20"], ["SAMOSA x2", "40"], ["EMOTIONAL DAMAGE", "∞"], ["VIBES", "FREE"]];
    return (
      <g>
        <path d={poly([...top, ...bot] as Pt[])} fill={c.fill} stroke="#00000020" />
        <T x={50} y={20} s={7} f="Space Mono" c={c.ink} w={700}>KIWIW CAFE</T>
        <T x={50} y={27} s={3.6} f="Space Mono" c={c.accent}>TABLE 07 · 11:11 PM</T>
        {rows.map(([k, v], i) => <g key={k}><T x={16} y={40 + i * 10} s={4.4} f="Space Mono" c={c.ink} a="start">{k}</T><T x={84} y={40 + i * 10} s={4.4} f="Space Mono" c={c.ink} a="end">{v}</T></g>)}
        <path d="M16,90 L84,90" {...line(c.ink, 0.8)} strokeDasharray="2 1.5" />
        <T x={16} y={98} s={5.4} f="Space Mono" c={c.ink} a="start" w={700}>TOTAL</T><T x={84} y={98} s={5.4} f="Space Mono" c={c.ink} a="end" w={700}>PRICELESS</T>
        <T x={50} y={110} s={3.6} f="Space Mono" c={c.accent}>THANK U, COME AGAIN</T>
      </g>
    );
  }, { vb: [100, 124], size: [220, 273], border: "none" }),
  S("pp-postcard", "Postcard", C, ["postcard", "mail", "travel", "greetings", "letter"], [CREAM, "#C8102E", INK], ({ c }) => (
    <g>
      <rect x="4" y="10" width="152" height="100" fill={c.fill} stroke={c.ink} strokeWidth="1.2" />
      <path d="M84,22 L84,98" {...line(c.ink, 1)} />
      {[52, 66, 80].map((y) => <line key={y} x1="92" x2="148" y1={y} y2={y} stroke={c.ink} strokeWidth=".7" />)}
      <path d={stampPath(124, 16, 26, 30)} fill="#FFFFFF" stroke={c.ink} strokeWidth=".6" />
      <rect x="128" y="20" width="18" height="22" fill={c.accent} />
      <path d={HEART} fill="#FFFFFF" transform={heartAt(137, 31, 5)} />
      <T x={44} y={42} s={13} f="Great Vibes" c={c.accent}>greetings from</T>
      <T x={44} y={66} s={17} f="Bowlby One" c={c.ink}>SURAT</T>
      <T x={44} y={84} s={8} f="Caveat Variable" c={c.ink} w={700}>wish u were here (eating)</T>
    </g>
  ), { vb: [160, 120], size: [400, 300], border: "none" }),
  S("pp-stamp-heart", "Heart postage stamp", C, ["stamp", "postage", "heart", "mail", "love"], ["#FFFFFF", "#C8102E", INK], ({ c }) => (
    <g>
      <path d={stampPath(8, 4, 84, 92)} fill={c.fill} stroke="#00000022" strokeWidth=".6" />
      <rect x="16" y="12" width="68" height="76" fill={c.accent} />
      <path d={HEART} fill="#FFD6E0" transform={heartAt(50, 46, 22)} />
      <T x={50} y={82} s={7} f="Space Mono" c="#FFFFFF" w={700}>₹ 11 · LOVE</T>
    </g>
  ), { size: [180, 180] }),
  S("pp-stamp-airmail", "Airmail stamp", C, ["stamp", "airmail", "postage", "travel", "mail"], ["#FFFFFF", "#1D3FD8", "#C8102E"], ({ c }) => (
    <g>
      <path d={stampPath(4, 12, 92, 76)} fill={c.fill} stroke="#00000022" strokeWidth=".6" />
      <rect x="12" y="20" width="76" height="60" fill="#EEF2FF" />
      {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${12 + i * 9},20 l6,0 l-9,60 l-6,0Z`} fill={i % 2 ? c.ink : c.accent} opacity=".9" />)}
      <rect x="22" y="36" width="56" height="28" fill="#FFFFFF" />
      <T x={50} y={53} s={10} f="Bowlby One" c={c.accent}>AIRMAIL</T>
      <T x={50} y={61} s={4.2} f="Space Mono" c={c.ink}>PAR AVION · BY KIWI</T>
    </g>
  ), { size: [200, 200] }),
  S("pp-matchbox", "Matchbox label", C, ["matchbox", "label", "vintage", "retro", "safety matches"], ["#D7261E", "#F4D35E", INK], ({ c }) => (
    <g>
      <rect x="4" y="4" width="152" height="92" rx="3" fill={c.fill} stroke={c.ink} strokeWidth="1.6" />
      <rect x="10" y="10" width="140" height="80" fill="none" stroke={c.accent} strokeWidth="1.4" />
      <T x={80} y={30} s={8} f="Space Mono" c={c.accent} w={700} ls={2}>SAFETY MATCHES</T>
      <circle cx="80" cy="54" r="15" fill={c.accent} stroke={c.ink} strokeWidth="1.2" />
      <path d="M80,44 C74,50 74,58 80,62 C86,58 86,50 80,44Z" fill={c.fill} />
      <T x={80} y={84} s={10} f="Bowlby One" c={c.accent}>HOT TAKES</T>
    </g>
  ), { vb: [160, 100], size: [360, 225] }),
  S("pp-notebook", "Torn notebook paper", C, ["notebook", "paper", "torn", "lined", "note", "school"], ["#FFFFFF", "#9AC1F0", "#E85D75"], ({ c }) => {
    const left: Pt[] = Array.from({ length: 22 }, (_, i) => [4 + (i % 2) * 3 + ((i * 7) % 3), 120 - i * 5.6]);
    return (
      <g>
        <path d={poly([[8, 2], [96, 2], [96, 120], ...left] as Pt[])} fill={c.fill} stroke="#00000018" />
        {Array.from({ length: 11 }, (_, i) => <line key={i} x1="10" x2="96" y1={16 + i * 9.6} y2={16 + i * 9.6} stroke={c.fill === "#FFFFFF" ? c.accent : "#00000030"} strokeWidth=".7" />)}
        <line x1="24" x2="24" y1="2" y2="120" stroke={c.ink} strokeWidth=".9" />
        {[22, 60, 98].map((y) => <circle key={y} cx="14" cy={y} r="3.2" fill="#F3F4F6" stroke="#0000001a" />)}
      </g>
    );
  }, { vb: [100, 122], size: [300, 366], border: "none" }),
  S("pp-tape-washi", "Washi tape (hearts)", C, ["tape", "washi", "hearts", "pink", "scrapbook"], ["#FFC2D1", "#FF4F81", INK], ({ c }) => (
    <g opacity=".92">
      <path d="M4,4 L8,8 L4,12 L8,16 L4,20 L8,24 L4,28 L156,28 L152,24 L156,20 L152,16 L156,12 L152,8 L156,4Z" fill={c.fill} />
      {Array.from({ length: 9 }, (_, i) => <path key={i} d={HEART} fill={c.accent} transform={heartAt(18 + i * 16, 16, 4.4)} />)}
    </g>
  ), { vb: [160, 32], size: [440, 88], border: "none" }),
  S("pp-tape-grid", "Washi tape (grid)", C, ["tape", "washi", "grid", "check", "scrapbook"], ["#BFE3C0", "#2E7D4F", INK], ({ c }) => (
    <g opacity=".9">
      <path d="M4,4 L8,8 L4,12 L8,16 L4,20 L8,24 L4,28 L156,28 L152,24 L156,20 L152,16 L156,12 L152,8 L156,4Z" fill={c.fill} />
      {Array.from({ length: 19 }, (_, i) => <line key={i} x1={8 + i * 8} x2={8 + i * 8} y1="4" y2="28" stroke={c.accent} strokeWidth=".6" />)}
      {[10, 16, 22].map((y) => <line key={y} x1="6" x2="154" y1={y} y2={y} stroke={c.accent} strokeWidth=".6" />)}
    </g>
  ), { vb: [160, 32], size: [440, 88], border: "none" }),
  S("pp-paperclip", "Paperclip", C, ["paperclip", "clip", "office", "scrapbook", "metal"], ["#B8BEC8", "#FFFFFF", INK], ({ c }) => (
    <g transform="rotate(-20 50 50)">
      <path d="M40,90 L40,22 C40,10 60,10 60,22 L60,80 C60,88 48,88 48,80 L48,30" fill="none" stroke={c.ink} strokeWidth="5.6" strokeLinecap="round" />
      <path d="M40,90 L40,22 C40,10 60,10 60,22 L60,80 C60,88 48,88 48,80 L48,30" fill="none" stroke={c.fill} strokeWidth="3.6" strokeLinecap="round" />
      <path d="M41.5,60 L41.5,26" stroke={c.accent} strokeWidth="1" strokeLinecap="round" />
    </g>
  ), { size: [120, 120], border: "none" }),
  S("pp-paperclip-heart", "Heart paperclip", C, ["paperclip", "heart", "clip", "pink", "coquette"], ["#FF8FB1", "#FFFFFF", "#7A1030"], ({ c }) => (
    <g>
      <path d="M50,92 C26,72 14,56 16,38 C18,22 36,16 46,28 L50,34 L54,28 C64,16 82,22 84,38 C86,56 74,72 50,92 M50,80 C34,66 28,54 30,42 C32,32 42,32 48,42" fill="none" stroke={c.ink} strokeWidth="5.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M50,92 C26,72 14,56 16,38 C18,22 36,16 46,28 L50,34 L54,28 C64,16 82,22 84,38 C86,56 74,72 50,92 M50,80 C34,66 28,54 30,42 C32,32 42,32 48,42" fill="none" stroke={c.fill} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  ), { size: [120, 120], border: "none" }),
  S("pp-staples", "Staples", C, ["staple", "staples", "office", "paper", "zine"], ["#C9CED8", "#FFFFFF", INK], ({ c }) => (
    <g>{[[20, 30, -8], [60, 70, 12]].map(([x, y, r], i) => (
      <g key={i} transform={`rotate(${r} ${x + 15} ${y})`}><path d={`M${x},${y + 5} L${x},${y} L${x + 30},${y} L${x + 30},${y + 5}`} fill="none" stroke={c.ink} strokeWidth="3.4" strokeLinejoin="round" /><path d={`M${x},${y + 5} L${x},${y} L${x + 30},${y} L${x + 30},${y + 5}`} fill="none" stroke={c.fill} strokeWidth="1.8" strokeLinejoin="round" /></g>
    ))}</g>
  ), { size: [120, 120], border: "none" }),
  S("pp-binder-clip", "Binder clip", C, ["binder clip", "clip", "office", "black", "scrapbook"], ["#1C1C1C", "#C9CED8", "#000000"], ({ c }) => (
    <g>
      <path d="M30,8 L36,46 M70,8 L64,46" fill="none" stroke={c.accent} strokeWidth="3.4" strokeLinecap="round" />
      <path d="M30,8 L70,8" stroke={c.accent} strokeWidth="3.4" strokeLinecap="round" />
      <path d="M18,46 L82,46 L74,92 L26,92Z" fill={c.fill} stroke={c.ink} strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M26,52 L74,52" stroke="#4B5563" strokeWidth="2" />
    </g>
  ), { size: [120, 120], border: "none" }),
  S("pp-sticky", "Sticky note", C, ["sticky note", "post it", "note", "reminder", "yellow"], ["#FFE97A", "#E8C93E", "#3A2E00"], ({ c }) => (
    <g>
      <path d="M8,8 L92,8 L92,78 C80,80 74,86 72,92 L8,92Z" fill={c.fill} />
      <path d="M72,92 C74,86 80,80 92,78 C84,82 78,86 72,92Z" fill={c.accent} />
      <rect x="8" y="8" width="84" height="10" fill={c.accent} opacity=".5" />
      <T x={48} y={46} s={12} f="Caveat Variable" c={c.ink} w={700}>to-do:</T>
      <T x={48} y={64} s={11} f="Caveat Variable" c={c.ink} w={700}>be iconic</T>
    </g>
  ), { size: [220, 220], border: "none" }),
  S("pp-label-tag", "Kraft label tag", C, ["tag", "label", "kraft", "gift", "string", "price"], ["#D2A86E", "#FBF5E9", INK], ({ c }) => (
    <g>
      <path d="M2,10 C18,4 22,24 30,30" {...line(c.ink, 1.2)} />
      <path d="M30,14 L140,14 L140,66 L30,66 L14,40Z" fill={c.fill} stroke={c.ink} strokeWidth="1.4" strokeLinejoin="round" />
      <circle cx="30" cy="40" r="4" fill={c.accent} stroke={c.ink} strokeWidth="1.2" />
      <T x={88} y={46} s={15} f="Caveat Variable" c={c.ink} w={700}>handle with love</T>
    </g>
  ), { vb: [144, 80], size: [360, 200] }),
];
