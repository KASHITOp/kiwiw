// Direction 5 · QUIET MONEY (REFERENCES.md): a series-A deck in a linen shirt.
import { T, R, O, S, Frame, rule, tpl, F, FORMATS } from "./dsl";

const BONE = "#EDEAE3", GRAPHITE = "#191A17", MOSS = "#4F5D3A", BRASS = "#B08A4E";
const style = "Quiet Money";

export const quietMoney = [
  tpl(
    { id: "qm-investor", name: "Investor Bait", description: "A pitch slide so calm the VCs forget to ask about revenue.", style, format: FORMATS.slide.label, tags: ["desi", "hinglish", "pitch", "startup", "slide"] },
    1920, 1080, BONE,
    [
      Frame(60, 60, 1800, 960, GRAPHITE, 1.5),
      T({ x: 140, y: 120, w: 700, h: 30, text: "SERIES A · SLIDE 04 / 12", font: F.smono, size: 22, fontWeight: 700, letterSpacing: 4, color: GRAPHITE }),
      T({ x: 1080, y: 120, w: 700, h: 30, text: "CONFIDENTIAL-ISH", font: F.smono, size: 22, fontWeight: 700, letterSpacing: 4, color: BRASS, align: "right" }),
      T({ x: 110, y: 170, w: 900, h: 700, text: "10×", font: F.fraunces, size: 560, fontWeight: 200, lineHeight: 1, letterSpacing: -30, color: GRAPHITE }),
      rule(1060, 330, 2, GRAPHITE, 420),
      T({ x: 1110, y: 320, w: 720, h: 90, text: "Jugaad,", font: F.fraunces, size: 96, fontWeight: 300, lineHeight: 1, color: GRAPHITE }),
      T({ x: 1110, y: 420, w: 720, h: 90, text: "but make it SaaS.", font: F.fraunces, size: 96, fontWeight: 300, italic: true, lineHeight: 1, color: MOSS }),
      T({ x: 1110, y: 560, w: 640, h: 180, text: "Hum scale karenge. Calmly, over chai. Ten times the customers since we stopped saying 'synergy' in meetings.", font: F.inter, size: 30, lineHeight: 1.55, color: GRAPHITE }),
      T({ x: 140, y: 940, w: 800, h: 30, text: "KIWIW CAPITAL · MUMBAI · 2026", font: F.smono, size: 20, fontWeight: 700, letterSpacing: 4, color: GRAPHITE }),
      S("kiwi-slice", { x: 1760, y: 920, w: 56, h: 56 }),
    ],
  ),

  tpl(
    { id: "qm-hiring", name: "Quietly Hiring", description: "We're hiring. We just won't shout about it. Much.", style, format: FORMATS.banner.label, tags: ["linkedin", "hiring", "banner"] },
    1584, 396, BONE,
    [
      Frame(24, 24, 1536, 348, GRAPHITE, 1.5),
      T({ x: 80, y: 90, w: 520, h: 150, text: "Quietly", font: F.fraunces, size: 150, fontWeight: 300, lineHeight: 1, color: GRAPHITE }),
      T({ x: 560, y: 90, w: 520, h: 150, text: "hiring.", font: F.fraunces, size: 150, fontWeight: 300, italic: true, lineHeight: 1, color: MOSS }),
      T({ x: 86, y: 270, w: 700, h: 30, text: "DESIGN · ENGINEERING · TASTE", font: F.smono, size: 20, fontWeight: 700, letterSpacing: 4, color: GRAPHITE }),
      rule(1140, 80, 1.5, GRAPHITE, 236),
      O({ x: 1190, y: 96, w: 40, h: 40, fill: BRASS }),
      T({ x: 1190, y: 160, w: 330, h: 120, text: "Remote, sane hours,\nno 'family' talk.\nkiwiw.vercel.app/jobs", font: F.inter, size: 22, lineHeight: 1.6, color: GRAPHITE }),
    ],
  ),

  tpl(
    { id: "qm-linen", name: "Linen Shirt Launch", description: "A product launch that whispers its price and still sells out.", style, format: FORMATS.post.label, tags: ["product", "launch", "fashion", "minimal"] },
    1080, 1080, BONE,
    [
      Frame(48, 48, 984, 984, GRAPHITE, 1.5),
      T({ x: 110, y: 120, w: 600, h: 30, text: "THE SHIRT · NO. 04", font: F.smono, size: 20, fontWeight: 700, letterSpacing: 4, color: GRAPHITE }),
      T({ x: 600, y: 120, w: 370, h: 30, text: "₹4,900", font: F.smono, size: 20, fontWeight: 700, letterSpacing: 4, color: BRASS, align: "right" }),
      T({ x: 90, y: 330, w: 900, h: 300, text: "Linen", font: F.fraunces, size: 300, fontWeight: 200, lineHeight: 1, letterSpacing: -10, color: GRAPHITE, align: "center" }),
      T({ x: 180, y: 640, w: 720, h: 80, text: "Now in moss, bone and 'regret not buying it'.", font: F.inter, size: 28, lineHeight: 1.45, color: GRAPHITE, align: "center" }),
      ...[MOSS, "#D9D3C6", BRASS].map((c, i) => R({ x: 450 + i * 64, y: 780, w: 48, h: 48, fill: c, stroke: GRAPHITE, strokeWidth: 1 })),
      T({ x: 110, y: 950, w: 860, h: 30, text: "AVAILABLE THURSDAY · QUIETLY", font: F.smono, size: 18, fontWeight: 700, letterSpacing: 4, color: GRAPHITE, align: "center" }),
    ],
  ),

  tpl(
    { id: "qm-webinar", name: "Calm Webinar Energy", description: "A thumbnail that promises zero exclamation marks. Cameras optional.", style, format: FORMATS.yt.label, tags: ["youtube", "webinar", "thumbnail"] },
    1280, 720, GRAPHITE,
    [
      Frame(32, 32, 1216, 656, "#4A4B45", 1.5),
      T({ x: 90, y: 100, w: 600, h: 30, text: "WEBINAR · 45 MIN · CAMERAS OFF", font: F.smono, size: 20, fontWeight: 700, letterSpacing: 4, color: BONE }),
      T({ x: 84, y: 200, w: 700, h: 150, text: "Pricing,", font: F.fraunces, size: 160, fontWeight: 300, lineHeight: 1, color: BONE }),
      T({ x: 84, y: 360, w: 700, h: 150, text: "calmly.", font: F.fraunces, size: 160, fontWeight: 300, italic: true, lineHeight: 1, color: BRASS }),
      T({ x: 90, y: 590, w: 600, h: 30, text: "NO HYPE · ONE CHART · TEA BREAK", font: F.smono, size: 18, fontWeight: 700, letterSpacing: 4, color: "#9A9A92" }),
      O({ x: 800, y: 150, w: 400, h: 400, fill: MOSS }),
      T({ x: 800, y: 150, w: 400, h: 400, text: "45", font: F.fraunces, size: 230, fontWeight: 200, color: BONE, align: "center", lineHeight: 1 }),
      T({ x: 800, y: 570, w: 400, h: 30, text: "MINUTES, NOT 90", font: F.smono, size: 16, fontWeight: 700, letterSpacing: 4, color: BONE, align: "center" }),
    ],
  ),
];
