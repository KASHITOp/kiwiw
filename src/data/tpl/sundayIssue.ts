// Direction 2 · THE SUNDAY ISSUE (REFERENCES.md): expensive paper, slow coffee.
import { T, R, S, rule, tpl, F, FORMATS } from "./dsl";

const CREAM = "#F4EEE3", INK = "#1B1A17", TOMATO = "#E8553B", SAGE = "#8E9C7C";
const style = "The Sunday Issue";

export const sundayIssue = [
  tpl(
    { id: "si-resume", name: "The Overachiever Resume", description: "One page. Seven languages (four are CSS). Zero chill.", style, format: FORMATS.poster.label, tags: ["resume", "cv", "job"] },
    1080, 1350, CREAM,
    [
      T({ x: 80, y: 60, w: 500, h: 30, text: "THE RÉSUMÉ · VOL. 1", font: F.smono, size: 20, fontWeight: 700, letterSpacing: 3, color: INK }),
      T({ x: 500, y: 60, w: 500, h: 30, text: "AVAILABLE · IMMEDIATELY", font: F.smono, size: 20, fontWeight: 700, letterSpacing: 3, color: TOMATO, align: "right" }),
      rule(80, 104, 920, INK, 2),
      T({ x: 74, y: 128, w: 940, h: 180, text: "Ananya", font: F.instr, size: 190, lineHeight: 0.9, color: INK }),
      T({ x: 470, y: 128, w: 540, h: 180, text: "Rao", font: F.instr, size: 190, italic: true, lineHeight: 0.9, color: TOMATO }),
      S("line-squiggle", { x: 480, y: 302, w: 300, h: 34, fill: SAGE }),
      T({ x: 80, y: 352, w: 900, h: 44, text: "Product designer who also does the dishes.", font: F.inter, size: 30, color: INK }),
      rule(80, 430, 920, INK, 2),
      T({ x: 80, y: 466, w: 420, h: 30, text: "EXPERIENCE", font: F.smono, size: 20, fontWeight: 700, letterSpacing: 3, color: TOMATO }),
      T({ x: 80, y: 508, w: 440, h: 54, text: "Kiwiw, Lead Designer", font: F.instr, size: 46, color: INK }),
      T({ x: 80, y: 566, w: 440, h: 70, text: "2024 – now. Made a kiwi split in half on scroll. Twice.", font: F.inter, size: 22, lineHeight: 1.45, color: INK }),
      T({ x: 80, y: 660, w: 440, h: 54, text: "Chai Startup, Designer", font: F.instr, size: 46, color: INK }),
      T({ x: 80, y: 718, w: 440, h: 70, text: "2021 – 2024. Survived three pivots and one rebrand to 'Chaitanya'.", font: F.inter, size: 22, lineHeight: 1.45, color: INK }),
      T({ x: 80, y: 812, w: 440, h: 54, text: "Freelance, Everything", font: F.instr, size: 46, color: INK }),
      T({ x: 80, y: 870, w: 440, h: 70, text: "2019 – 2021. Logos for every cousin's café.", font: F.inter, size: 22, lineHeight: 1.45, color: INK }),
      R({ x: 560, y: 466, w: 2, h: 470, fill: INK }),
      T({ x: 600, y: 466, w: 400, h: 30, text: "SKILLS", font: F.smono, size: 20, fontWeight: 700, letterSpacing: 3, color: TOMATO }),
      T({ x: 600, y: 508, w: 400, h: 190, text: "Figma, fonts, feelings\nSaying no to Comic Sans\nGrids, on purpose\nSeven languages", font: F.inter, size: 26, lineHeight: 1.6, color: INK }),
      T({ x: 600, y: 732, w: 400, h: 30, text: "CONTACT", font: F.smono, size: 20, fontWeight: 700, letterSpacing: 3, color: TOMATO }),
      T({ x: 600, y: 774, w: 400, h: 90, text: "ananya@email.com\n+91 98XXX XXXXX", font: F.inter, size: 26, lineHeight: 1.6, color: INK }),
      R({ x: 80, y: 1010, w: 8, h: 180, fill: TOMATO }),
      T({ x: 120, y: 1000, w: 880, h: 140, text: "“She aligns things for fun. We have stopped asking.”", font: F.instr, size: 62, italic: true, lineHeight: 1.05, color: INK }),
      T({ x: 120, y: 1150, w: 700, h: 30, text: "— HER MANAGER, PROBABLY", font: F.smono, size: 20, fontWeight: 700, letterSpacing: 3, color: SAGE }),
      T({ x: 900, y: 1270, w: 100, h: 30, text: "01", font: F.smono, size: 20, fontWeight: 700, color: INK, align: "right" }),
    ],
  ),

  tpl(
    { id: "si-longread", name: "Long Read, Short Attention", description: "An essay cover for people who only ever read the cover.", style, format: FORMATS.post.label, tags: ["blog", "essay", "editorial", "quote"] },
    1080, 1080, CREAM,
    [
      T({ x: 80, y: 66, w: 600, h: 30, text: "THE SUNDAY ISSUE", font: F.smono, size: 22, fontWeight: 700, letterSpacing: 4, color: INK }),
      T({ x: 600, y: 66, w: 400, h: 30, text: "NO. 07", font: F.smono, size: 22, fontWeight: 700, letterSpacing: 4, color: TOMATO, align: "right" }),
      rule(80, 110, 920, INK, 2),
      T({ x: 74, y: 210, w: 940, h: 150, text: "The art of", font: F.instr, size: 160, lineHeight: 0.92, color: INK }),
      T({ x: 74, y: 360, w: 940, h: 150, text: "doing nothing,", font: F.instr, size: 160, italic: true, lineHeight: 0.92, color: TOMATO }),
      S("line-squiggle", { x: 90, y: 516, w: 700, h: 40, fill: SAGE }),
      T({ x: 74, y: 560, w: 940, h: 150, text: "beautifully.", font: F.instr, size: 160, lineHeight: 0.92, color: INK }),
      rule(80, 860, 920, INK, 2),
      T({ x: 80, y: 890, w: 700, h: 70, text: "WORDS BY K. · 4 MIN READ\nYOU WILL SKIM IT. WE KNOW.", font: F.smono, size: 22, fontWeight: 700, letterSpacing: 2, lineHeight: 1.6, color: INK }),
      S("arrow-swoop", { x: 600, y: 860, w: 190, h: 120, ink: TOMATO, rotation: 190 }),
      T({ x: 900, y: 966, w: 100, h: 40, text: "12", font: F.instr, size: 44, italic: true, color: INK, align: "right" }),
    ],
  ),

  tpl(
    { id: "si-keynote", name: "Sunday Keynote", description: "A conference talk title that sounds expensive and runs ten minutes over.", style, format: FORMATS.slide.label, tags: ["slide", "talk", "presentation"] },
    1920, 1080, CREAM,
    [
      T({ x: 120, y: 90, w: 900, h: 34, text: "KEYNOTE · 09:30 · HALL B", font: F.smono, size: 26, fontWeight: 700, letterSpacing: 4, color: TOMATO }),
      rule(120, 140, 1680, INK, 2),
      T({ x: 112, y: 250, w: 1100, h: 190, text: "Design for", font: F.instr, size: 200, lineHeight: 0.9, color: INK }),
      T({ x: 112, y: 430, w: 1100, h: 190, text: "people who", font: F.instr, size: 200, lineHeight: 0.9, color: INK }),
      T({ x: 112, y: 610, w: 1100, h: 190, text: "never read slides.", font: F.instr, size: 200, italic: true, lineHeight: 0.9, color: TOMATO }),
      R({ x: 1340, y: 250, w: 460, h: 560, fill: SAGE }),
      S("kiwi-bird", { x: 1390, y: 380, w: 360, h: 327, fill: "#3E4A33", ink: "#1B1A17" }),
      T({ x: 1340, y: 826, w: 460, h: 60, text: "FIG. 1 — THE SPEAKER, MOSTLY.\nNOT TO SCALE.", font: F.smono, size: 18, fontWeight: 700, letterSpacing: 2, lineHeight: 1.6, color: INK }),
      rule(120, 950, 1680, INK, 2),
      T({ x: 120, y: 974, w: 700, h: 34, text: "KIWIW CONF 2026", font: F.smono, size: 22, fontWeight: 700, letterSpacing: 4, color: INK }),
      T({ x: 1100, y: 974, w: 700, h: 34, text: "10 / 42", font: F.smono, size: 22, fontWeight: 700, letterSpacing: 4, color: INK, align: "right" }),
    ],
  ),

  tpl(
    { id: "si-recipe", name: "Recipe Card Gone Fancy", description: "Two-minute noodles, plated like a tasting menu with a reservation.", style, format: FORMATS.story.label, tags: ["food", "recipe", "story"] },
    1080, 1920, CREAM,
    [
      T({ x: 90, y: 110, w: 900, h: 34, text: "THE SUNDAY ISSUE · KITCHEN", font: F.smono, size: 24, fontWeight: 700, letterSpacing: 4, color: INK }),
      rule(90, 160, 900, INK, 2),
      T({ x: 84, y: 260, w: 940, h: 180, text: "Two-Minute", font: F.instr, size: 190, lineHeight: 0.9, color: INK }),
      T({ x: 84, y: 440, w: 940, h: 180, text: "Noodles,", font: F.instr, size: 190, italic: true, lineHeight: 0.9, color: TOMATO }),
      T({ x: 84, y: 620, w: 940, h: 180, text: "at Midnight", font: F.instr, size: 190, lineHeight: 0.9, color: INK }),
      T({ x: 90, y: 860, w: 900, h: 34, text: "SERVES 1 · TIME 2 MIN (IT'S NEVER 2 MIN)", font: F.smono, size: 24, fontWeight: 700, letterSpacing: 2, color: SAGE }),
      rule(90, 920, 900, INK, 2),
      T({ x: 90, y: 970, w: 400, h: 34, text: "YOU WILL NEED", font: F.smono, size: 22, fontWeight: 700, letterSpacing: 4, color: TOMATO }),
      T({ x: 90, y: 1020, w: 900, h: 260, text: "1 packet of noodles\n1 packet of tastemaker\n1 dramatic sigh\nChilli flakes, unreasonably", font: F.inter, size: 40, lineHeight: 1.55, color: INK }),
      T({ x: 90, y: 1340, w: 400, h: 34, text: "METHOD", font: F.smono, size: 22, fontWeight: 700, letterSpacing: 4, color: TOMATO }),
      T({ x: 90, y: 1390, w: 880, h: 260, text: "i. Boil the water.\nii. Stir with intent.\niii. Call it risotto.", font: F.instr, size: 70, italic: true, lineHeight: 1.15, color: INK }),
      S("badge-seal", { x: 720, y: 1560, w: 270, h: 270, fill: TOMATO, accent: CREAM, rotation: -10 }),
      T({ x: 720, y: 1560, w: 270, h: 270, text: "CHEF'S\nKISS", font: F.smono, size: 34, fontWeight: 700, letterSpacing: 2, lineHeight: 1.1, color: CREAM, align: "center", rotation: -10 }),
      T({ x: 90, y: 1800, w: 500, h: 34, text: "PAGE 31", font: F.smono, size: 22, fontWeight: 700, letterSpacing: 4, color: INK }),
    ],
  ),
];
