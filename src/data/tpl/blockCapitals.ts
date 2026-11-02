// Direction 1 · BLOCK CAPITALS (REFERENCES.md): shouting, but with a ruler.
import { T, R, S, rule, tpl, F, FORMATS } from "./dsl";

const PAPER = "#F1EFE8", INK = "#0B0B0B", RED = "#FF3B1F";
const style = "Block Capitals";

export const blockCapitals = [
  tpl(
    { id: "bc-rave", name: "Basement Rave Poster", description: "Techno, a strobe light and one (1) working fire exit.", style, format: FORMATS.poster.label, tags: ["event", "music", "party"] },
    1080, 1350, PAPER,
    [
      T({ x: 54, y: 46, w: 600, h: 40, text: "KIWIW SOUND SYSTEM", font: F.smono, size: 26, fontWeight: 700, letterSpacing: 3 }),
      T({ x: 600, y: 46, w: 426, h: 40, text: "VOL. 03", font: F.smono, size: 26, fontWeight: 700, letterSpacing: 3, align: "right" }),
      rule(54, 108, 972, INK, 3),
      T({ x: 40, y: 112, w: 1100, h: 410, text: "BASE", font: F.anton, size: 500, lineHeight: 0.82, letterSpacing: -4 }),
      T({ x: 40, y: 502, w: 1100, h: 410, text: "MENT", font: F.anton, size: 500, lineHeight: 0.82, letterSpacing: -4, color: RED }),
      rule(54, 950, 972, INK, 3),
      T({ x: 54, y: 980, w: 460, h: 80, text: "FRI 22.11", font: F.archivo, size: 72 }),
      T({ x: 54, y: 1066, w: 460, h: 40, text: "22:00 → WHENEVER", font: F.smono, size: 28, fontWeight: 700 }),
      T({ x: 560, y: 980, w: 300, h: 130, text: "THE OLD PRINTING PRESS\nLOWER LEVEL\nKNOCK TWICE", font: F.smono, size: 24, fontWeight: 700, lineHeight: 1.45 }),
      S("burst-12", { x: 812, y: 1030, w: 230, h: 230, fill: RED, ink: INK, rotation: 12 }),
      T({ x: 812, y: 1030, w: 230, h: 230, text: "₹299", font: F.archivo, size: 58, color: "#FFFFFF", align: "center", rotation: 12 }),
      T({ x: 54, y: 1268, w: 760, h: 40, text: "NO PHOTOS · NO PHONES · NO REGRETS", font: F.smono, size: 22, fontWeight: 700, letterSpacing: 2 }),
    ],
  ),

  tpl(
    { id: "bc-hiring", name: "Loud Job Post", description: "Hiring, but impossible to scroll past. No ninjas were requested.", style, format: FORMATS.banner.label, tags: ["hiring", "linkedin", "jobs"] },
    1584, 396, INK,
    [
      T({ x: 40, y: 30, w: 1140, h: 336, text: "HIRING.", font: F.anton, size: 380, lineHeight: 0.84, letterSpacing: -3, color: PAPER }),
      rule(1176, 60, 3, PAPER, 276),
      T({ x: 1210, y: 58, w: 340, h: 30, text: "NOW OPEN", font: F.smono, size: 22, fontWeight: 700, letterSpacing: 3, color: RED }),
      T({ x: 1210, y: 110, w: 340, h: 200, text: "01  DESIGNER\n02  ENGINEER\n03  CHIEF OF VIBES", font: F.smono, size: 26, fontWeight: 700, lineHeight: 1.7, color: PAPER }),
      T({ x: 1210, y: 300, w: 340, h: 40, text: "NO NINJAS. NO ROCKSTARS.", font: F.smono, size: 18, fontWeight: 700, letterSpacing: 1, color: "#8A8A84" }),
      S("burst-12", { x: 1000, y: 24, w: 168, h: 168, fill: RED, ink: RED, rotation: -12 }),
      T({ x: 1000, y: 24, w: 168, h: 168, text: "3\nROLES", font: F.archivo, size: 30, color: "#FFFFFF", align: "center", rotation: -12, lineHeight: 1 }),
    ],
  ),

  tpl(
    { id: "bc-47fonts", name: "I Tried 47 Fonts", description: "Clickbait, but it went to design school and kept the grid.", style, format: FORMATS.yt.label, tags: ["youtube", "thumbnail", "fonts"] },
    1280, 720, PAPER,
    [
      T({ x: 520, y: -70, w: 820, h: 860, text: "47", font: F.anton, size: 860, lineHeight: 0.92, letterSpacing: -20, color: RED }),
      T({ x: 48, y: 64, w: 520, h: 140, text: "I TRIED", font: F.anton, size: 170, lineHeight: 0.84 }),
      T({ x: 48, y: 470, w: 520, h: 140, text: "FONTS.", font: F.anton, size: 170, lineHeight: 0.84 }),
      rule(48, 230, 440, INK, 4),
      T({ x: 48, y: 260, w: 460, h: 180, text: "ONE OF THEM\nWAS COMIC\nSANS.", font: F.archivo, size: 50, lineHeight: 1.05 }),
      T({ x: 48, y: 648, w: 400, h: 34, text: "EP. 12 · 18:42 · NO SPONSOR", font: F.smono, size: 22, fontWeight: 700, letterSpacing: 2 }),
    ],
  ),

  tpl(
    { id: "bc-lift", name: "No Pain No Plain", description: "A gym flyer that went to design school and skipped leg day.", style, format: FORMATS.post.label, tags: ["fitness", "gym", "promo"] },
    1080, 1080, INK,
    [
      T({ x: 48, y: 30, w: 1100, h: 250, text: "LIFT.", font: F.anton, size: 300, lineHeight: 0.84, letterSpacing: -2, color: PAPER }),
      T({ x: 48, y: 268, w: 1100, h: 250, text: "TYPE.", font: F.anton, size: 300, lineHeight: 0.84, letterSpacing: -2, color: RED }),
      T({ x: 48, y: 506, w: 1100, h: 250, text: "REPEAT.", font: F.anton, size: 300, lineHeight: 0.84, letterSpacing: -2, color: PAPER }),
      rule(54, 800, 972, PAPER, 3),
      T({ x: 54, y: 830, w: 640, h: 200, text: "01  TYPE THAT LIFTS\n02  GRIDS THAT SPOT YOU\n03  ZERO CARDIO", font: F.smono, size: 32, fontWeight: 700, lineHeight: 1.6, color: PAPER }),
      S("arrow-swoop", { x: 770, y: 840, w: 230, h: 144, ink: RED, rotation: 160 }),
      R({ x: 948, y: 990, w: 78, h: 40, fill: RED }),
      T({ x: 948, y: 990, w: 78, h: 40, text: "GO", font: F.archivo, size: 26, color: INK, align: "center" }),
    ],
  ),
];
