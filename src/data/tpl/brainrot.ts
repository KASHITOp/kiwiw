// Direction 6 · BRAINROT BROADCAST (REFERENCES.md): group chat at 3 a.m.
import { T, R, O, S, tpl, F, FORMATS } from "./dsl";

const ACID = "#D8F27A", PINK = "#FF3FA4", INK = "#0B0B0B", WHITE = "#FFFFFF", RED = "#FF2D2D";
const style = "Brainrot Broadcast";
const meme = { color: WHITE, outline: { color: INK, width: 9 }, uppercase: true, align: "center" as const, lineHeight: 0.92 };

export const brainrot = [
  tpl(
    { id: "br-ratio", name: "Ratio'd Announcement", description: "Big news, delivered like a group chat at 3 a.m. Typing…", style, format: FORMATS.post.label, tags: ["announcement", "launch", "meme", "social"] },
    1080, 1080, ACID,
    [
      S("texture-halftone-radial", { x: 140, y: 140, w: 800, h: 800, fill: PINK, opacity: 0.35 }),
      T({ x: 40, y: 40, w: 1000, h: 250, text: "when the launch is", font: F.anton, size: 130, ...meme }),
      R({ x: 160, y: 380, w: 760, h: 270, fill: INK, radius: 28, rotation: -3 }),
      R({ x: 150, y: 370, w: 760, h: 270, fill: WHITE, stroke: INK, strokeWidth: 5, radius: 28, rotation: -3 }),
      T({ x: 190, y: 392, w: 680, h: 36, text: "● kiwiw · now", font: F.smono, size: 24, fontWeight: 700, color: "#6B6B6B", rotation: -3 }),
      T({ x: 190, y: 438, w: 680, h: 180, text: "we shipped it. on time. no one is more surprised than us.", font: F.gochi, size: 54, lineHeight: 1.05, color: INK, rotation: -3 }),
      T({ x: 40, y: 780, w: 1000, h: 250, text: "actually on time", font: F.anton, size: 130, ...meme }),
      S("burst-12", { x: 820, y: 230, w: 220, h: 220, fill: PINK, ink: INK, rotation: 14 }),
      T({ x: 820, y: 230, w: 220, h: 220, text: "NEW", font: F.rubik, size: 50, color: WHITE, align: "center", rotation: 14 }),
      S("arrow-swoop", { x: 30, y: 600, w: 200, h: 125, ink: INK, rotation: -20 }),
      T({ x: 40, y: 700, w: 160, h: 60, text: "this", font: F.gochi, size: 48, color: INK, rotation: -8 }),
      R({ x: 760, y: 680, w: 210, h: 66, fill: INK, radius: 33, rotation: 4 }),
      T({ x: 760, y: 680, w: 210, h: 66, text: "W +1,204", font: F.smono, size: 26, fontWeight: 700, color: ACID, align: "center", rotation: 4 }),
    ],
  ),

  tpl(
    { id: "br-pov", name: "POV: You Opened The Story", description: "Fake progress bar, real engagement, zero shame.", style, format: FORMATS.story.label, tags: ["story", "meme", "instagram"] },
    1080, 1920, INK,
    [
      ...[0, 1, 2, 3].map((i) => R({ x: 40 + i * 254, y: 40, w: 238, h: 8, fill: i === 0 ? WHITE : "#4A4A4A", radius: 4 })),
      S("kiwi-happy", { x: 40, y: 80, w: 80, h: 80 }),
      T({ x: 136, y: 96, w: 500, h: 46, text: "kiwiw  · 2m", font: F.smono, size: 28, fontWeight: 700, color: WHITE }),
      T({ x: 60, y: 300, w: 960, h: 230, text: "POV:", font: F.rubik, size: 220, color: ACID, lineHeight: 1 }),
      T({ x: 60, y: 560, w: 960, h: 300, text: "you opened this and now you're contractually obligated to", font: F.gochi, size: 86, lineHeight: 1.05, color: WHITE }),
      T({ x: 40, y: 900, w: 1000, h: 400, text: "swipe up", font: F.anton, size: 250, color: PINK, uppercase: true, align: "center", lineHeight: 0.9, outline: { color: WHITE, width: 8 }, rotation: -4 }),
      S("arrow-drop", { x: 440, y: 1280, w: 200, h: 320, ink: WHITE }),
      S("bubble-shout", { x: 690, y: 1240, w: 340, h: 291, fill: ACID, ink: INK, rotation: 8 }),
      T({ x: 720, y: 1270, w: 280, h: 160, text: "fr fr", font: F.gochi, size: 80, color: INK, align: "center", rotation: 8 }),
      S("burst-sparkle", { x: 80, y: 1320, w: 140, h: 140, fill: ACID }),
      S("burst-sparkle", { x: 220, y: 1460, w: 80, h: 80, fill: PINK }),
      R({ x: 40, y: 1760, w: 860, h: 96, fill: "transparent", stroke: WHITE, strokeWidth: 3, radius: 48 }),
      T({ x: 90, y: 1760, w: 760, h: 96, text: "Send message…", font: F.smono, size: 30, color: "#9A9A9A" }),
      T({ x: 920, y: 1760, w: 120, h: 96, text: "♥", font: F.inter, size: 64, color: PINK, align: "center" }),
    ],
  ),

  tpl(
    { id: "br-clickbait", name: "Clickbait But Honest", description: "The thumbnail admits it's clickbait. Honestly? Respect.", style, format: FORMATS.yt.label, tags: ["youtube", "thumbnail", "meme"] },
    1280, 720, PINK,
    [
      S("texture-halftone", { x: 0, y: 360, w: 420, h: 420, fill: INK, opacity: 0.25 }),
      T({ x: 30, y: 40, w: 720, h: 640, text: "i spent ₹0 on this", font: F.anton, size: 190, ...meme, align: "left", lineHeight: 0.9 }),
      S("burst-spiky", { x: 900, y: 40, w: 340, h: 340, fill: ACID }),
      S("kiwi-bird", { x: 860, y: 200, w: 380, h: 345, ink: INK, rotation: -6 }),
      S("scribble-circle", { x: 820, y: 230, w: 460, h: 322, ink: RED, rotation: 6 }),
      S("arrow-swoop", { x: 700, y: 430, w: 190, h: 120, ink: RED, rotation: 10 }),
      S("bubble-speech", { x: 760, y: 20, w: 300, h: 240, fill: WHITE, ink: INK, rotation: -6 }),
      T({ x: 776, y: 40, w: 268, h: 150, text: "is that even legal??", font: F.gochi, size: 46, lineHeight: 1, color: INK, align: "center", rotation: -6 }),
      R({ x: 40, y: 610, w: 520, h: 70, fill: ACID, rotation: -2 }),
      T({ x: 40, y: 610, w: 520, h: 70, text: "NOT CLICKBAIT*", font: F.rubik, size: 38, color: INK, align: "center", rotation: -2 }),
      T({ x: 570, y: 630, w: 160, h: 50, text: "*it is", font: F.gochi, size: 40, color: INK }),
      R({ x: 1130, y: 640, w: 120, h: 50, fill: INK, radius: 8 }),
      T({ x: 1130, y: 640, w: 120, h: 50, text: "12:34", font: F.smono, size: 26, fontWeight: 700, color: WHITE, align: "center" }),
    ],
  ),

  tpl(
    { id: "br-maincharacter", name: "Main Character Banner", description: "For profiles that refuse to be a background character.", style, format: FORMATS.banner.label, tags: ["linkedin", "banner", "profile"] },
    1584, 396, INK,
    [
      S("texture-halftone-radial", { x: 1100, y: -100, w: 600, h: 600, fill: PINK, opacity: 0.4 }),
      T({ x: 36, y: 34, w: 1540, h: 190, text: "main character", font: F.anton, size: 196, color: ACID, uppercase: true, lineHeight: 0.92, letterSpacing: -1, outline: { color: PINK, width: 6 } }),
      T({ x: 860, y: 214, w: 440, h: 80, text: "(professionally)", font: F.gochi, size: 60, color: WHITE, rotation: -5 }),
      R({ x: 40, y: 312, w: 330, h: 54, fill: WHITE, radius: 27 }),
      T({ x: 40, y: 312, w: 330, h: 54, text: "OPEN TO: CHAOS", font: F.smono, size: 24, fontWeight: 700, color: INK, align: "center" }),
      R({ x: 390, y: 312, w: 300, h: 54, fill: "transparent", stroke: ACID, strokeWidth: 3, radius: 27 }),
      T({ x: 390, y: 312, w: 300, h: 54, text: "● ONLINE-ISH", font: F.smono, size: 22, fontWeight: 700, color: ACID, align: "center" }),
      S("burst-sparkle", { x: 1440, y: 40, w: 100, h: 100, fill: ACID }),
      S("scribble-star", { x: 1480, y: 250, w: 80, h: 80, ink: WHITE, rotation: 14 }),
      S("arrow-loop", { x: 720, y: 296, w: 200, h: 111, ink: WHITE, rotation: -6 }),
      O({ x: 1330, y: 330, w: 14, h: 14, fill: RED }),
      T({ x: 1350, y: 318, w: 220, h: 40, text: "you, probably", font: F.gochi, size: 32, color: WHITE }),
    ],
  ),
];
