// Direction 3 · CUT & PASTE CLUB (REFERENCES.md): photocopier at 2 a.m.
import { T, R, S, Block, tpl, F, FORMATS } from "./dsl";

const KRAFT = "#E9DCC4", INK = "#111111", PINK = "#FF4FA3", KIWI = "#8BD630", TANG = "#FF7A1A", WHITE = "#FFFFFF";
const style = "Cut & Paste Club";

export const cutPaste = [
  tpl(
    { id: "cp-gig", name: "Garage Band Gig", description: "Three chords, two fans and one extension cord doing its best.", style, format: FORMATS.poster.label, tags: ["music", "gig", "event", "zine"] },
    1080, 1350, KRAFT,
    [
      S("texture-halftone", { x: 640, y: -40, w: 480, h: 480, fill: INK, opacity: 0.18 }),
      Block({ x: 70, y: 90, w: 300, h: 130, fill: PINK, text: "THE", font: F.rubik, size: 76, color: INK, rot: -6, shadow: INK }),
      Block({ x: 110, y: 250, w: 760, h: 200, fill: INK, text: "SOGGY", font: F.marker, size: 170, color: WHITE, rot: 3, shadow: TANG, offset: 14 }),
      Block({ x: 60, y: 480, w: 900, h: 170, fill: TANG, text: "BISCUITS", font: F.rubik, size: 110, color: INK, rot: -3, shadow: INK }),
      S("paper-scrap", { x: 150, y: 720, w: 640, h: 330, fill: WHITE, ink: INK, rotation: 4 }),
      S("tape-clear", { x: 120, y: 700, w: 200, h: 54, fill: "#FFE98A", rotation: -28 }),
      S("tape-clear", { x: 650, y: 720, w: 200, h: 54, fill: "#FFE98A", rotation: 24 }),
      T({ x: 200, y: 770, w: 560, h: 220, text: "live @ Sharma's\ngarage, 7pm\n(bring earplugs)", font: F.caveat, size: 72, fontWeight: 700, lineHeight: 1.05, color: INK, rotation: 4 }),
      S("burst-12", { x: 780, y: 860, w: 250, h: 250, fill: KIWI, ink: INK, rotation: -14 }),
      T({ x: 780, y: 860, w: 250, h: 250, text: "FREE*", font: F.rubik, size: 38, color: INK, align: "center", rotation: -14 }),
      T({ x: 790, y: 1110, w: 260, h: 50, text: "*entry, not snacks", font: F.caveat, size: 40, fontWeight: 600, color: INK, rotation: -4 }),
      R({ x: 60, y: 1210, w: 690, h: 64, fill: INK, rotation: -1 }),
      T({ x: 60, y: 1210, w: 690, h: 64, text: "SAT 30 NOV · BYO CHAIR", font: F.smono, size: 30, fontWeight: 700, letterSpacing: 2, color: KRAFT, align: "center", rotation: -1 }),
      S("scribble-star", { x: 900, y: 1180, w: 120, h: 120, ink: PINK, rotation: 10 }),
      S("texture-grain", { x: 0, y: 0, w: 1080, h: 1350, opacity: 0.5 }),
    ],
  ),

  tpl(
    { id: "cp-thrift", name: "Thrift Haul Story", description: "₹200 jacket, ₹2,000 confidence, no receipts.", style, format: FORMATS.story.label, tags: ["fashion", "story", "shopping"] },
    1080, 1920, PINK,
    [
      S("texture-halftone-radial", { x: 540, y: 1300, w: 700, h: 700, fill: INK, opacity: 0.2 }),
      Block({ x: 80, y: 120, w: 560, h: 200, fill: KRAFT, text: "THRIFT", font: F.rubik, size: 104, color: INK, rot: -4, shadow: INK, offset: 14 }),
      Block({ x: 420, y: 330, w: 520, h: 210, fill: KIWI, text: "HAUL", font: F.marker, size: 170, color: INK, rot: 5, shadow: INK, offset: 14 }),
      S("paper-scrap", { x: 90, y: 640, w: 470, h: 390, fill: WHITE, ink: INK, rotation: -5 }),
      T({ x: 120, y: 690, w: 410, h: 270, text: "the jacket\n₹200", font: F.caveat, size: 110, fontWeight: 700, lineHeight: 0.95, color: INK, rotation: -5 }),
      S("tape-masking", { x: 230, y: 610, w: 200, h: 56, rotation: -8 }),
      S("paper-scrap", { x: 520, y: 980, w: 470, h: 390, fill: "#FFE14D", ink: INK, rotation: 6 }),
      T({ x: 550, y: 1030, w: 410, h: 270, text: "the boots\nfree", font: F.caveat, size: 110, fontWeight: 700, lineHeight: 0.95, color: INK, rotation: 6 }),
      S("scribble-circle", { x: 590, y: 1150, w: 300, h: 150, ink: INK, rotation: 6 }),
      T({ x: 600, y: 1310, w: 400, h: 60, text: "(long story)", font: F.gochi, size: 48, color: INK, rotation: 6 }),
      S("tape-masking", { x: 660, y: 950, w: 200, h: 56, rotation: 10 }),
      S("badge-tag", { x: 90, y: 1120, w: 360, h: 206, fill: TANG, ink: INK, rotation: -12 }),
      T({ x: 175, y: 1150, w: 270, h: 140, text: "VIBES\nPRICELESS", font: F.rubik, size: 36, lineHeight: 1.15, color: INK, align: "center", rotation: -12 }),
      S("arrow-loop", { x: 120, y: 1420, w: 420, h: 233, ink: INK, rotation: 10 }),
      R({ x: 120, y: 1700, w: 840, h: 96, fill: INK, rotation: -2 }),
      T({ x: 120, y: 1700, w: 840, h: 96, text: "SWIPE FOR THE DAMAGE →", font: F.rubik, size: 42, color: KRAFT, align: "center", rotation: -2 }),
      S("texture-grain", { x: 0, y: 0, w: 1080, h: 1920, opacity: 0.45 }),
    ],
  ),

  tpl(
    { id: "cp-lostcat", name: "Lost Cat (It's a Sale)", description: "A missing-cat flyer that is legally a discount. Tear-off tabs included.", style, format: FORMATS.post.label, tags: ["sale", "promo", "funny", "flyer"] },
    1080, 1080, KRAFT,
    [
      S("paper-torn", { x: 60, y: 50, w: 960, h: 980, fill: WHITE, rotation: -1.5 }),
      S("tape-clear", { x: 70, y: 40, w: 220, h: 60, fill: "#FFE98A", rotation: -20 }),
      S("tape-clear", { x: 800, y: 40, w: 220, h: 60, fill: "#FFE98A", rotation: 18 }),
      T({ x: 100, y: 100, w: 880, h: 190, text: "LOST:", font: F.marker, size: 190, color: INK, align: "center", rotation: -1.5 }),
      T({ x: 100, y: 270, w: 880, h: 70, text: "have you seen this sale?", font: F.caveat, size: 70, fontWeight: 700, color: INK, align: "center", rotation: -1.5 }),
      R({ x: 250, y: 370, w: 580, h: 330, fill: PINK, stroke: INK, strokeWidth: 6, rotation: 2 }),
      T({ x: 250, y: 370, w: 580, h: 330, text: "50%\nOFF", font: F.rubik, size: 116, lineHeight: 1, color: WHITE, align: "center", rotation: 2, outline: { color: INK, width: 6 } }),
      T({ x: 120, y: 714, w: 840, h: 60, text: "answers to 'discount'. very friendly. loves checkout.", font: F.caveat, size: 46, fontWeight: 600, color: INK, align: "center", rotation: -1.5 }),
      ...Array.from({ length: 8 }, (_, i) => [
        R({ x: 104 + i * 109, y: 800, w: 2, h: 210, fill: "#BFB6A4", rotation: -1.5 }),
        T({ x: 108 + i * 109 - 64, y: 880, w: 230, h: 50, text: "CALL 98XX · 50% OFF", font: F.smono, size: 16, fontWeight: 700, color: INK, rotation: -91.5, align: "center" }),
      ]).flat(),
      S("arrow-drop", { x: 900, y: 500, w: 110, h: 176, ink: TANG, rotation: 160 }),
    ],
  ),

  tpl(
    { id: "cp-craftfair", name: "Craft Fair, Chaotic Good", description: "Glitter is not a business model. It's a lifestyle with a stall fee.", style, format: FORMATS.banner.label, tags: ["linkedin", "banner", "event", "craft"] },
    1584, 396, KRAFT,
    [
      S("texture-halftone", { x: 1250, y: -60, w: 400, h: 400, fill: INK, opacity: 0.16 }),
      Block({ x: 60, y: 60, w: 330, h: 130, fill: PINK, text: "CRAFT", font: F.rubik, size: 74, color: INK, rot: -5, shadow: INK }),
      Block({ x: 410, y: 70, w: 260, h: 130, fill: KIWI, text: "FAIR", font: F.marker, size: 100, color: INK, rot: 4, shadow: INK }),
      Block({ x: 690, y: 50, w: 360, h: 130, fill: TANG, text: "SUNDAY", font: F.rubik, size: 66, color: INK, rot: -3, shadow: INK }),
      T({ x: 70, y: 240, w: 900, h: 70, text: "handmade, slightly crooked, 100% vibes", font: F.caveat, size: 66, fontWeight: 700, color: INK, rotation: -1.5 }),
      R({ x: 70, y: 322, w: 470, h: 46, fill: INK }),
      T({ x: 70, y: 322, w: 470, h: 46, text: "KIWIW HALL · 11AM – 6PM", font: F.smono, size: 22, fontWeight: 700, color: KRAFT, align: "center" }),
      S("badge-rosette", { x: 1120, y: 30, w: 200, h: 260, fill: KIWI, accent: PINK, rotation: 8 }),
      T({ x: 1135, y: 100, w: 170, h: 100, text: "BEST\nIN SHOW", font: F.rubik, size: 22, lineHeight: 1.1, color: INK, align: "center", rotation: 8 }),
      S("kiwi-bird", { x: 1360, y: 150, w: 200, h: 182, ink: INK }),
      S("bubble-speech", { x: 1360, y: 40, w: 190, h: 152, fill: WHITE, ink: INK }),
      T({ x: 1366, y: 52, w: 178, h: 100, text: "i made\nthis!!", font: F.gochi, size: 36, lineHeight: 1, color: INK, align: "center" }),
      S("scribble-star", { x: 1000, y: 230, w: 110, h: 110, ink: INK, rotation: -8 }),
      S("texture-grain", { x: 0, y: 0, w: 1584, h: 396, opacity: 0.45 }),
    ],
  ),
];
