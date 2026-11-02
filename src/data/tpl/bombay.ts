// Direction 4 · BOMBAY TALKIES PRESS (REFERENCES.md) — the Desi pack.
// Single-screen cinema poster, matchbox label, hand-painted signboard.
import { T, S, Frame, rule, tpl, F, FORMATS } from "./dsl";

const MARIGOLD = "#F6A21E", VERMILION = "#D7261E", PEACOCK = "#0F6E6E", CREAM = "#F7E7C6", KATTHA = "#2A160E";
const style = "Bombay Talkies Press";
const desi = ["desi", "india", "hinglish"];

/** The direction's signature: a double-rule border. */
const border = (w: number, h: number, outer: string, inner: string) => [
  Frame(28, 28, w - 56, h - 56, outer, 7),
  Frame(48, 48, w - 96, h - 96, inner, 2),
];

export const bombay = [
  tpl(
    { id: "bt-fest", name: "Fest Poster That Actually Gets Crowd", description: "College fest poster with main-character energy and a free-food clause.", style, format: FORMATS.poster.label, tags: [...desi, "college", "fest", "event"] },
    1080, 1350, PEACOCK,
    [
      S("burst-rays", { x: 40, y: 40, w: 1000, h: 1000, fill: "#13807F", accent: PEACOCK }),
      ...border(1080, 1350, CREAM, MARIGOLD),
      S("desi-marigold", { x: 70, y: 70, w: 120, h: 120 }),
      S("desi-marigold", { x: 890, y: 70, w: 120, h: 120 }),
      T({ x: 140, y: 108, w: 800, h: 90, text: "धूम मचा दो", font: F.tiro, size: 76, color: CREAM, align: "center" }),
      T({ x: 60, y: 220, w: 960, h: 260, text: "UTSAV", font: F.baloo, size: 240, fontWeight: 800, lineHeight: 0.9, color: MARIGOLD, align: "center", shadow: { color: KATTHA, x: 12, y: 12 }, outline: { color: KATTHA, width: 6 } }),
      T({ x: 140, y: 500, w: 800, h: 110, text: "2026", font: F.rubik, size: 100, color: CREAM, align: "center", letterSpacing: 10 }),
      S("badge-ribbon", { x: 110, y: 630, w: 860, h: 276, fill: VERMILION, accent: "#8E1A14", ink: KATTHA }),
      T({ x: 230, y: 650, w: 620, h: 130, text: "3 DIN · 40 EVENTS · 1 DJ", font: F.mukta, size: 46, fontWeight: 800, color: CREAM, align: "center" }),
      T({ x: 120, y: 860, w: 840, h: 120, text: "Battle of Bands · Standup Night\nRangoli Wars · Antakshari Finals", font: F.mukta, size: 40, fontWeight: 700, lineHeight: 1.35, color: CREAM, align: "center" }),
      T({ x: 80, y: 1000, w: 920, h: 60, text: "12–14 FEB · MAIN GROUND", font: F.rubik, size: 36, color: MARIGOLD, align: "center" }),
      S("badge-seal", { x: 80, y: 1070, w: 220, h: 220, fill: VERMILION, accent: CREAM, rotation: -12 }),
      T({ x: 80, y: 1070, w: 220, h: 220, text: "FREE\nFOOD*", font: F.rubik, size: 34, lineHeight: 1.1, color: CREAM, align: "center", rotation: -12 }),
      T({ x: 320, y: 1150, w: 520, h: 80, text: "*samosa supply limited.\nPehle aao, pehle khao.", font: F.mukta, size: 30, fontWeight: 600, lineHeight: 1.3, color: CREAM }),
      S("desi-diya", { x: 850, y: 1130, w: 140, h: 140 }),
    ],
  ),

  tpl(
    { id: "bt-chai", name: "Chai Break Menu", description: "Cutting chai, bun maska and life advice, all priced fairly.", style, format: FORMATS.story.label, tags: [...desi, "menu", "food", "cafe"] },
    1080, 1920, CREAM,
    [
      ...border(1080, 1920, KATTHA, VERMILION),
      S("burst-rays", { x: 90, y: 90, w: 900, h: 900, fill: "#F3D79F", accent: CREAM }),
      T({ x: 90, y: 160, w: 900, h: 300, text: "चाय", font: F.tiro, size: 300, color: VERMILION, align: "center", lineHeight: 1 }),
      T({ x: 90, y: 470, w: 900, h: 170, text: "TAPRI", font: F.baloo, size: 190, fontWeight: 800, color: KATTHA, align: "center", lineHeight: 0.9, shadow: { color: MARIGOLD, x: 10, y: 10 } }),
      T({ x: 90, y: 650, w: 900, h: 50, text: "Est. whenever the kettle allowed", font: F.mukta, size: 36, fontWeight: 600, color: KATTHA, align: "center" }),
      ...[
        ["Cutting Chai", "₹15"],
        ["Masala Chai", "₹25"],
        ["Bun Maska", "₹30"],
        ["Bournvita (nostalgia)", "₹40"],
        ["Life Advice", "FREE"],
      ].flatMap(([item, price], i) => [
        T({ x: 120, y: 790 + i * 150, w: 620, h: 80, text: item, font: F.baloo, size: 58, fontWeight: 700, color: KATTHA }),
        T({ x: 700, y: 790 + i * 150, w: 260, h: 80, text: price, font: F.rubik, size: 46, color: VERMILION, align: "right" }),
        rule(120, 880 + i * 150, 840, KATTHA, 2),
      ]),
      S("badge-seal", { x: 760, y: 1500, w: 250, h: 250, fill: VERMILION, accent: CREAM, rotation: -14 }),
      T({ x: 760, y: 1500, w: 250, h: 250, text: "SINCE\n1987", font: F.rubik, size: 38, lineHeight: 1.1, color: CREAM, align: "center", rotation: -14 }),
      T({ x: 120, y: 1590, w: 620, h: 130, text: "UPI accepted.\nUdhaar not.", font: F.baloo, size: 62, fontWeight: 800, lineHeight: 1, color: KATTHA }),
      S("desi-diya", { x: 120, y: 1730, w: 110, h: 110 }),
      S("desi-diya", { x: 850, y: 1730, w: 110, h: 110 }),
    ],
  ),

  tpl(
    { id: "bt-diwali", name: "Diwali Sale But Make It Fashion", description: "Festive discounts with couture energy and zero blinking LEDs.", style, format: FORMATS.post.label, tags: [...desi, "diwali", "sale", "festival"] },
    1080, 1080, KATTHA,
    [
      S("desi-rangoli", { x: 640, y: -160, w: 600, h: 600, opacity: 0.9 }),
      S("desi-toran", { x: 0, y: 0, w: 1080, h: 200 }),
      ...border(1080, 1080, MARIGOLD, VERMILION),
      T({ x: 90, y: 230, w: 900, h: 90, text: "शुभ दीपावली", font: F.tiro, size: 80, color: MARIGOLD }),
      T({ x: 80, y: 330, w: 920, h: 200, text: "DIWALI", font: F.baloo, size: 220, fontWeight: 800, lineHeight: 0.9, color: CREAM }),
      T({ x: 80, y: 520, w: 920, h: 220, text: "SALE", font: F.baloo, size: 260, fontWeight: 800, lineHeight: 0.9, color: MARIGOLD, shadow: { color: VERMILION, x: 12, y: 12 } }),
      S("badge-pill", { x: 80, y: 790, w: 600, h: 110, fill: VERMILION, ink: MARIGOLD }),
      T({ x: 80, y: 790, w: 600, h: 110, text: "FLAT 40% OFF", font: F.rubik, size: 40, color: CREAM, align: "center" }),
      T({ x: 90, y: 920, w: 600, h: 50, text: "Only till Bhai Dooj. Mummy's orders.", font: F.mukta, size: 32, fontWeight: 700, color: CREAM }),
      S("desi-diya", { x: 700, y: 780, w: 140, h: 140 }),
      S("desi-diya", { x: 850, y: 830, w: 120, h: 120 }),
    ],
  ),

  tpl(
    { id: "bt-shaadi", name: "Shaadi Save-the-Date, Mummy Approved", description: "Save the date. Also save room for the third dessert counter.", style, format: FORMATS.story.label, tags: [...desi, "wedding", "invite", "save the date"] },
    1080, 1920, CREAM,
    [
      ...border(1080, 1920, VERMILION, MARIGOLD),
      S("desi-toran", { x: 48, y: 48, w: 984, h: 220 }),
      S("desi-marigold", { x: 70, y: 1700, w: 150, h: 150 }),
      S("desi-marigold", { x: 860, y: 1700, w: 150, h: 150 }),
      T({ x: 90, y: 330, w: 900, h: 60, text: "SAVE THE DATE", font: F.rubik, size: 50, color: VERMILION, align: "center", letterSpacing: 6 }),
      T({ x: 90, y: 440, w: 900, h: 190, text: "Rohan", font: F.baloo, size: 190, fontWeight: 800, color: PEACOCK, align: "center", lineHeight: 0.95 }),
      T({ x: 90, y: 620, w: 900, h: 150, text: "&", font: F.tiro, size: 150, italic: true, color: VERMILION, align: "center", lineHeight: 1 }),
      T({ x: 90, y: 770, w: 900, h: 190, text: "Meera", font: F.baloo, size: 190, fontWeight: 800, color: PEACOCK, align: "center", lineHeight: 0.95 }),
      T({ x: 90, y: 990, w: 900, h: 90, text: "शादी का लड्डू, finally", font: F.tiro, size: 70, color: KATTHA, align: "center" }),
      S("badge-seal", { x: 340, y: 1110, w: 400, h: 400, fill: PEACOCK, accent: MARIGOLD }),
      T({ x: 340, y: 1110, w: 400, h: 400, text: "14\nFEB\n2027", font: F.rubik, size: 62, lineHeight: 1.05, color: CREAM, align: "center" }),
      T({ x: 90, y: 1540, w: 900, h: 110, text: "Jaipur · Dress code: as shiny as possible", font: F.mukta, size: 40, fontWeight: 700, color: KATTHA, align: "center" }),
      S("badge-pill", { x: 300, y: 1660, w: 480, h: 100, fill: CREAM, ink: VERMILION, rotation: -6 }),
      T({ x: 300, y: 1660, w: 480, h: 100, text: "MUMMY APPROVED", font: F.rubik, size: 28, color: VERMILION, align: "center", rotation: -6 }),
    ],
  ),
];
