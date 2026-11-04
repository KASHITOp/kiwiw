// 20 hero templates: 2 per Style DNA recipe (STYLE_DNA.md). Built in the
// browser after fonts load (so fitText measures real glyphs), then frozen to
// src/data/tpl/heroes.json via /dev/kit?dump=heroes. Every one uses at least
// two effects from the engine (DESIGN.md §16).
import type { Element, KiwiwDoc, Template } from "../types";
import { T, R, S, I, rule, F } from "../data/tpl/dsl";
import { LAYOUTS, fit, mono } from "./layouts";
import { writeCopy, type RecipeKey } from "./recipes";
import { parseIdea } from "../juice/parse";
import { PHOTOS, type Photo } from "../data/photos";
import { resolveCollisions } from "./collide";
import { V3_TEMPLATES } from "./heroesV3";

const ph = (name: string): Photo => PHOTOS.find((p) => p.src.includes(name))!;
const img = (name: string, b: { x: number; y: number; w: number; h: number }, p: Partial<Element> = {}) => I({ ...b, src: ph(name).src, focus: ph(name).focus, ...(p as object) });
const doc = (width: number, height: number, background: string, els: (Element | Element[])[]): KiwiwDoc => ({ width, height, background, elements: els.flat() });

interface Meta { id: string; name: string; description: string; recipe: RecipeKey | "coquette"; format: string; tags: string[] }
const STYLE: Record<RecipeKey | "coquette", string> = {
  coquette: "Scrapbook Coquette",
  nazar: "Nazar Battu", tapri: "Tapri Print", stadium: "Stadium Halftone", brutal: "Brutal Grid", swiss: "Swiss Drop",
  trippy: "Trippy Window", neo: "Neo Brutal Pop", pixel: "8-Bit Flex", sticker: "Sticker Bomb", glossy: "Glossy Bloom", quotes: "Loud Quotes",
};

/** A poster from a Juice layout with curated copy. */
function fromLayout(r: RecipeKey, layout: number, line: string, photo: string, photo2: string, angle = 0, over: Partial<ReturnType<typeof writeCopy>> = {}) {
  const c = { ...writeCopy(r, parseIdea(line), angle), ...over };
  return LAYOUTS[r][layout]({ c, photo: ph(photo), photo2: ph(photo2), seed: 7 });
}

const POSTERS: [Meta, () => KiwiwDoc][] = [
  [{ id: "dna-nazar-poster", name: "Nimbu Mirchi Fest Poster", description: "Protected from nazar, exams and the HOD. Mostly the HOD.", recipe: "nazar", format: "Poster", tags: ["desi", "hindi", "fest", "college", "event"] },
    () => fromLayout("nazar", 0, "college fest friday 6pm", "crowd-28457979", "crowd-4218027", 0, { kicker: "NO", head: "बुरी नज़र", sub: "Fest hai, padhai baad mein" })],
  [{ id: "dna-tapri-poster", name: "Tapri Opening Ceremony", description: "Ribbon cutting by the chai uncle. Speeches limited to one cutting.", recipe: "tapri", format: "Poster", tags: ["desi", "hindi", "chai", "cafe", "opening"] },
    () => fromLayout("tapri", 0, "chai tapri opening sunday", "chai-37186989", "chai-33210272", 0, { head: "चाय पे चर्चा", sub: "Ek cutting, do log, teen ghante", cta: "₹10 ONLY" })],
  [{ id: "dna-stadium-poster", name: "Legend In The Group Chat", description: "Sports-poster energy for someone who once won a carrom match.", recipe: "stadium", format: "Poster", tags: ["sports", "fitness", "gym", "event"] },
    () => fromLayout("stadium", 0, "gym new batch monday 6am", "gym-16996376", "gym-2652236", 1)],
  [{ id: "dna-brutal-poster", name: "Memo From The Grid", description: "A hiring memo that went to the gym and came back numbered.", recipe: "brutal", format: "Poster", tags: ["hiring", "jobs", "brutalist", "corporate"] },
    () => fromLayout("brutal", 2, "hiring designers", "work-12662877", "work-6893890", 0)],
  [{ id: "dna-swiss-poster", name: "A Very Small Podcast", description: "One giant letter, one tiny man, zero clue what the episode is about.", recipe: "swiss", format: "Poster", tags: ["podcast", "swiss", "minimal", "episode"] },
    () => fromLayout("swiss", 1, "podcast episode 12", "podcast-31213674", "podcast-7383469", 0)],
  [{ id: "dna-trippy-poster", name: "main_character.exe", description: "A birthday invite that crashed because it believed in itself too much.", recipe: "trippy", format: "Poster", tags: ["birthday", "party", "retro", "psychedelic"] },
    () => fromLayout("trippy", 0, "birthday party saturday 8pm", "cake-9543834", "party-32333371", 0)],
  [{ id: "dna-neo-poster", name: "1 New Event (You'll Like It)", description: "An app notification for real life. Swipe right to attend.", recipe: "neo", format: "Poster", tags: ["launch", "startup", "app", "neo-brutal"] },
    () => fromLayout("neo", 0, "my startup launch friday 7pm", "launch-18015296", "launch-7327336", 1)],
  [{ id: "dna-pixel-poster", name: "Level Up: Birthday", description: "Player 1 is turning 25. No continues left. Cake respawns.", recipe: "pixel", format: "Poster", tags: ["birthday", "game", "8-bit", "party"] },
    () => fromLayout("pixel", 0, "birthday party saturday 8pm", "party-32333371", "cake-9543834", 0)],
  [{ id: "dna-sticker-poster", name: "Bake Sale Limited Drop", description: "Streetwear energy for cupcakes. Resale value: crumbs.", recipe: "sticker", format: "Poster", tags: ["bake", "sale", "food", "streetwear"] },
    () => fromLayout("sticker", 0, "bake sale saturday 10am", "bake-11803470", "bake-8482916", 0)],
  [{ id: "dna-glossy-poster", name: "Shaadi Soft Launch", description: "Save the date, glossy edition. Mummy wants it framed.", recipe: "glossy", format: "Poster", tags: ["desi", "wedding", "save the date", "glossy"] },
    () => fromLayout("glossy", 1, "wedding save the date 14 feb", "wedding-29368877", "wedding-36354615", 0, { head: "Save the date", sub: "Shaadi mein zaroor aana" })],
];

/* --------------------- hand-built, other formats --------------------- */

const nazarStory = () => {
  const W = 1080, H = 1920;
  const stripes = Array.from({ length: 9 }, (_, i) => R({ x: i * 120, y: 0, w: 120, h: H, fill: i % 2 ? "#FFD23F" : "#F2479B" }));
  return doc(W, H, "#F2479B", [
    stripes,
    S("desi-nimbu-mirchi", { x: 400, y: -40, w: 280, h: 644, cutout: { color: "#FBEEDC", width: 6 } }),
    img("wedding-29368877", { x: 240, y: 640, w: 600, h: 600 }, { frame: { kind: "evileye", color: "#1D3FD8", accent: "#7FB7FF" }, grain: 0.3 }),
    fit("नज़र ना लगे", F.rozha, { x: 40, y: 1290, w: 1000, h: 260 }, { size: 230, align: "center", color: "#B3122E", lh: 1.05, lines: 1, extra: { outline: { color: "#FBEEDC", width: 12 }, shadow: { color: "#5E0A1A", x: 10, y: 10 } } }).el,
    T({ x: 60, y: 1560, w: 960, h: 80, text: "Shaadi ki photos aa gayi. Bas dekh lo, comment mat karo.", font: F.khand, size: 42, fontWeight: 700, color: "#1D3FD8", align: "center" }),
    R({ x: 240, y: 1700, w: 600, h: 100, fill: "#FBEEDC", radius: 50, cutout: { color: "#B3122E", width: 5 } }),
    T({ x: 240, y: 1700, w: 600, h: 100, text: "SWIPE UP · NAZAR FREE", font: F.anton, size: 44, color: "#B3122E", align: "center", lineHeight: 1, letterSpacing: 3 }),
  ]);
};

const tapriPost = () => {
  const W = 1080, H = 1080;
  const items: [string, string][] = [["Cutting Chai", "₹10"], ["Adrak Wali", "₹15"], ["Bun Maska", "₹25"], ["Gossip", "FREE"]];
  return doc(W, H, "#FFF3D6", [
    R({ x: 0, y: 0, w: W, h: H, fill: "#FFF3D6", frame: { kind: "truck", color: "#D62828" }, grain: 0.4 }),
    fit("चाय टपरी", F.yatra, { x: 130, y: 120, w: 820, h: 200 }, { size: 190, align: "center", color: "#D62828", lh: 1.1, lines: 1, extra: { shadow: { color: "#FFD23F", x: 7, y: 7 } } }).el,
    T({ x: 130, y: 330, w: 820, h: 50, text: "RATE LIST · HORN OK PLEASE", font: F.khand, size: 40, fontWeight: 700, color: "#0F7C7A", align: "center", letterSpacing: 4 }),
    img("chai-34324342", { x: 130, y: 420, w: 400, h: 500 }, { rotation: -4, frame: { kind: "stamp", color: "#FFFDF6" }, fx: { riso: { inks: ["#0F7C7A", "#D62828"], paper: "#FFF3D6" } } }),
    ...items.map(([n, p], i) => [
      T({ x: 580, y: 450 + i * 110, w: 260, h: 70, text: n, font: F.baloo, size: 46, fontWeight: 800, color: "#1A1208" }),
      T({ x: 820, y: 450 + i * 110, w: 140, h: 70, text: p, font: F.khand, size: 48, fontWeight: 700, color: "#D62828", align: "right" }),
      rule(580, 530 + i * 110, 380, "#1A1208", 2),
    ]).flat(),
    S("desi-marigold", { x: 860, y: 860, w: 120, h: 120 }),
  ]);
};

const stadiumYT = () => {
  const W = 1280, H = 720;
  return doc(W, H, "#F2E8D5", [
    S("bg-halftone", { x: 0, y: 300, w: W, h: 420, fill: "#D7191C", accent: "#F2E8D5" }),
    T({ x: 40, y: 20, w: 760, h: 60, text: "nobody cares unless you show up.", font: F.instr, size: 52, italic: true, color: "#111111" }),
    fit("I TRAINED FOR 30 DAYS", F.anton, { x: 40, y: 90, w: 720, h: 470 }, { size: 260, upper: true, color: "#D7191C", lh: 0.88, lines: 3 }).el,
    img("gym-16996376", { x: 760, y: 40, w: 480, h: 680 }, { fx: { halftone: { dot: 10, ink: "#111111", paper: null } }, cutout: { color: "#F2E8D5", width: 10 } }),
    R({ x: 40, y: 580, w: 520, h: 110, fill: "#111111" }),
    mono(60, 590, 500, "DAY: 30 / 30\nRESULT: CAN FINALLY OPEN JARS", "#F2E8D5", 26),
    S("burst-seal", { x: 600, y: 520, w: 180, h: 180, fill: "#111111", rotation: 10 }),
    T({ x: 610, y: 570, w: 160, h: 80, text: "NO\nSUBS", font: F.anton, size: 40, color: "#F2E8D5", align: "center", rotation: 10, lineHeight: 0.95 }),
  ]);
};

const brutalBanner = () => {
  const W = 1584, H = 396;
  return doc(W, H, "#F4F1EA", [
    ...[396, 792, 1188].map((x) => R({ x, y: 0, w: 2, h: H, fill: "#0A0A0A", opacity: 0.3 })),
    mono(30, 20, 600, "NOTICE NO. 01 / KIWIW PRESS", "#0A0A0A", 16),
    fit("MAKE THE SIGNAL LOUDER", F.archivo, { x: 30, y: 60, w: 740, h: 300 }, { size: 120, upper: true, color: "#0A0A0A", lh: 0.92, lines: 3 }).el,
    R({ x: 792, y: 0, w: 396, h: 396, fill: "#FF2E1F" }),
    T({ x: 812, y: 20, w: 356, h: 70, text: "01", font: F.archivo, size: 64, color: "#F4F1EA" }),
    T({ x: 812, y: 230, w: 356, h: 140, text: "PRODUCT\nDESIGNER", font: F.archivo, size: 54, color: "#F4F1EA", lineHeight: 1 }),
    img("work-6893890", { x: 1188, y: 0, w: 396, h: 396 }, { fx: { riso: { inks: ["#0A0A0A", "#1F3BFF"], paper: "#F4F1EA" } }, grain: 0.4 }),
    R({ x: 1208, y: 300, w: 356, h: 76, fill: "#1F3BFF" }),
    T({ x: 1208, y: 300, w: 356, h: 76, text: "02. OPEN TO WORK", font: F.smono, size: 26, fontWeight: 700, color: "#F4F1EA", align: "center", lineHeight: 1 }),
  ]);
};

const swissPost = () => {
  const W = 1080, H = 1080;
  return doc(W, H, "#EFEDE6", [
    T({ x: -80, y: -220, w: 1300, h: 1000, text: "JU", font: F.archivo, size: 820, color: "#E30613", lineHeight: 0.9 }),
    T({ x: 300, y: 600, w: 1000, h: 520, text: "NE", font: F.archivo, size: 520, color: "#E30613", lineHeight: 0.9 }),
    rule(60, 560, 960, "#141414", 2),
    ...Array.from({ length: 12 }, (_, i) => T({ x: 60 + i * 84, y: 572, w: 60, h: 30, text: String(i + 1).padStart(2, "0"), font: F.smono, size: 18, fontWeight: 700, color: i === 5 ? "#E30613" : "#141414", allowOverlap: true })),
    S("figure-walker", { allowOverlap: true, x: 480, y: 432, w: 64, h: 128 }),
    img("portrait-3979997", { x: 60, y: 800, w: 200, h: 220 }, { fx: { bw: true }, cutout: { color: "#FFFFFF", width: 6 }, rotation: -4 }),
    T({ x: 60, y: 640, w: 250, h: 120, text: "Summer Sale\n(A Small One)", font: F.inter, size: 30, fontWeight: 700, color: "#141414", lineHeight: 1.25 }),
    mono(60, 1030, 260, "01—30 JUNE\nUP TO 30% / NO DRAMA", "#141414", 16),
  ]);
};

const trippyStory = () => {
  const W = 1080, H = 1920;
  return doc(W, H, "#FFF1DE", [
    S("bg-swirl", { x: 0, y: 0, w: W, h: H, fill: "#FF4FA3", accent: "#FFC72C", ink: "#6B3FD8" }),
    R({ x: 100, y: 380, w: 880, h: 560, fill: "transparent", rotation: -3, frame: { kind: "window", color: "#E8322E", accent: "#FFF1DE", title: "main_character.exe" } }),
    fit("I AM THE MAIN CHARACTER", F.shri, { x: 150, y: 500, w: 780, h: 400 }, { size: 140, color: "#111111", lh: 1.05, lines: 3, valign: "center", extra: { rotation: -3 } }).el,
    img("portrait-34921744", { x: 180, y: 1020, w: 520, h: 620 }, { rotation: 4, frame: { kind: "window", color: "#FFC72C", accent: "#FFF1DE", title: "me.jpg" }, fx: { riso: { inks: ["#6B3FD8", "#FF4FA3", "#FFC72C"], paper: "#FFF1DE" } } }),
    R({ x: 560, y: 1480, w: 440, h: 240, fill: "transparent", rotation: -5, frame: { kind: "window", color: "#3FA9FF", accent: "#FFFFFF", title: "reminder.txt" } }),
    T({ x: 585, y: 1560, w: 390, h: 140, text: "drink water.\npost this.\nbe iconic.", font: F.smono, size: 28, fontWeight: 700, color: "#111111", rotation: -5, lineHeight: 1.4 }),
    S("burst-sparkle", { x: 80, y: 200, w: 150, h: 150, fill: "#FFC72C" }),
  ]);
};

const neoBanner = () => {
  const W = 1584, H = 396;
  const hard = (x: number, y: number, w: number, h: number) => R({ x: x + 10, y: y + 10, w, h, fill: "#111111", radius: 22 });
  const card = (x: number, y: number, w: number, h: number, fill: string) => R({ x, y, w, h, fill, radius: 22, stroke: "#111111", strokeWidth: 5 });
  return doc(W, H, "#FFE14D", [
    S("bg-pixel", { x: 0, y: 0, w: W, h: H, fill: "#FFE14D", accent: "#111111", ink: "#111111", opacity: 0.2 }),
    hard(40, 40, 760, 300), card(40, 40, 760, 300, "#FFFFFF"),
    T({ x: 70, y: 60, w: 600, h: 40, text: "● Kiwiw · now", font: F.smono, size: 24, fontWeight: 700, color: "#111111" }),
    fit("Save now. Feast anytime.", F.archivo, { x: 70, y: 110, w: 700, h: 200 }, { size: 90, color: "#111111", lh: 0.95, lines: 2, valign: "center" }).el,
    hard(840, 60, 300, 260), img("bake-8482916", { x: 840, y: 60, w: 300, h: 260 }, { radius: 22, cutout: { color: "#111111", width: 5 }, fx: { riso: { inks: ["#111111", "#FF6FB5"], paper: "#FFE14D" } } }),
    hard(1180, 70, 360, 100), card(1180, 70, 360, 100, "#FF6FB5"),
    T({ x: 1180, y: 70, w: 360, h: 100, text: "TAP TO ORDER", font: F.archivo, size: 36, color: "#111111", align: "center", lineHeight: 1 }),
    hard(1180, 210, 360, 100), card(1180, 210, 360, 100, "#B6F23A"),
    T({ x: 1180, y: 210, w: 360, h: 100, text: "OPEN 24/7", font: F.archivo, size: 36, color: "#111111", align: "center", lineHeight: 1 }),
  ]);
};

const pixelYT = () => {
  const W = 1280, H = 720;
  return doc(W, H, "#120B2E", [
    S("bg-pixel", { x: 0, y: 0, w: W, h: H, fill: "#120B2E", accent: "#FFD400", ink: "#FF3EA5" }),
    R({ x: 30, y: 30, w: 1220, h: 70, fill: "#FF3EA5" }),
    T({ x: 50, y: 30, w: 700, h: 70, text: "LEVEL 01 · EPISODE 12", font: F.press, size: 28, color: "#120B2E", lineHeight: 1 }),
    T({ x: 700, y: 30, w: 530, h: 70, text: "♥ ♥ ♥", font: F.press, size: 28, color: "#120B2E", align: "right", lineHeight: 1 }),
    fit("BOSS FIGHT: MY INBOX", F.press, { x: 50, y: 140, w: 680, h: 380 }, { size: 80, color: "#FFD400", lh: 1.3, lines: 4, valign: "center", extra: { shadow: { color: "#FF3EA5", x: 7, y: 7 } } }).el,
    R({ x: 770, y: 140, w: 450, h: 450, fill: "#3FE0FF", stroke: "#FFFFFF", strokeWidth: 8 }),
    img("podcast-7383469", { x: 790, y: 160, w: 410, h: 410 }, { fx: { riso: { inks: ["#120B2E", "#FF3EA5"], paper: "#3FE0FF" } }, grain: 0.2 }),
    R({ x: 50, y: 570, w: 520, h: 100, fill: "#5CFF5C", stroke: "#120B2E", strokeWidth: 6 }),
    T({ x: 50, y: 570, w: 520, h: 100, text: "PRESS PLAY", font: F.press, size: 34, color: "#120B2E", align: "center", lineHeight: 1 }),
    S("pixel-heart", { x: 640, y: 560, w: 120, h: 108 }),
  ]);
};

const stickerStory = () => {
  const W = 1080, H = 1920;
  return doc(W, H, "#2443FF", [
    S("texture-halftone", { x: 500, y: 0, w: 580, h: 580, fill: "#3A58FF" }),
    fit("GOOD MOOD, LIMITED DROP", F.bagel, { x: 50, y: 80, w: 980, h: 520 }, { size: 190, color: "#C6F432", lh: 0.95, lines: 3, extra: { outline: { color: "#111111", width: 12 }, shadow: { color: "#111111", x: 10, y: 12 }, rotation: -5 } }).el,
    img("portrait-27665348", { x: 180, y: 640, w: 720, h: 860 }, { rotation: 4, cutout: { color: "#FFFFFF", width: 20 }, fx: { riso: { inks: ["#2443FF", "#FF7AC6"], paper: "#FFFFFF" } } }),
    S("burst-12", { x: 800, y: 600, w: 230, h: 230, fill: "#FF7AC6", ink: "#111111", rotation: 10 }),
    T({ x: 810, y: 660, w: 210, h: 110, text: "NEW!", font: F.bagel, size: 56, color: "#FFFFFF", align: "center", rotation: 10, lineHeight: 1 }),
    S("tape-masking", { x: 420, y: 610, w: 240, h: 76, rotation: -8 }),
    S("scribble-star", { x: 40, y: 1100, w: 200, h: 200, ink: "#C6F432" }),
    S("arrow-swoop", { x: 60, y: 1460, w: 240, h: 150, ink: "#FFFFFF", rotation: -20 }),
    S("kiwi-happy", { x: 860, y: 1420, w: 180, h: 180, rotation: 12 }),
    T({ x: 300, y: 1560, w: 520, h: 140, text: "no refunds on vibes", font: F.marker, size: 54, color: "#FFFFFF", rotation: -4, lineHeight: 1.05 }),
    R({ x: 560, y: 1730, w: 460, h: 130, fill: "#FFFFFF", rotation: -3, cutout: { color: "#111111", width: 5 } }),
    T({ x: 580, y: 1745, w: 420, h: 110, text: "DROP 01 · SAT 12PM\nLINK IN BIO", font: F.smono, size: 26, fontWeight: 700, color: "#111111", rotation: -3, lineHeight: 1.4 }),
  ]);
};

const glossyPost = () => {
  const W = 1080, H = 1080;
  return doc(W, H, "#1C1C1E", [
    fit("GLOSSY BLOOM", F.bagel, { x: 40, y: 50, w: 1000, h: 320 }, { size: 170, color: "#F7F3EC", lh: 0.95, lines: 2, align: "center", extra: { glossy: { from: "#FFFFFF", to: "#D8D2C8", ink: "#4A4744" } } }).el,
    img("bake-18101274", { x: 330, y: 400, w: 420, h: 520 }, { rotation: -3, frame: { kind: "polaroid", title: "fresh out the oven" } }),
    S("burst-sparkle", { x: 770, y: 380, w: 130, h: 130, fill: "#FFE58A" }),
    S("burst-sparkle", { x: 200, y: 800, w: 90, h: 90, fill: "#FFC2D1" }),
    T({ x: 60, y: 950, w: 460, h: 100, text: "Pastries so shiny you can check your hair in them.", font: F.instr, size: 30, color: "#F7F3EC", lineHeight: 1.2 }),
    T({ x: 560, y: 950, w: 460, h: 100, text: "Weekends · 9 till sold out", font: F.instr, size: 30, italic: true, color: "#FFE58A", align: "right", lineHeight: 1.2 }),
  ]);
};

const OTHERS: [Meta, () => KiwiwDoc][] = [
  [{ id: "dna-nazar-story", name: "Nazar Na Lage Story", description: "For wedding photos too pretty for the khandaan group.", recipe: "nazar", format: "Story", tags: ["desi", "hindi", "wedding", "story"] }, nazarStory],
  [{ id: "dna-tapri-post", name: "Tapri Rate List", description: "Cutting chai ₹10, gossip free, credit on Mondays only.", recipe: "tapri", format: "Instagram post", tags: ["desi", "hindi", "menu", "chai", "cafe"] }, tapriPost],
  [{ id: "dna-stadium-yt", name: "I Trained For 30 Days", description: "A thumbnail with stats nobody asked for. Jar-opening included.", recipe: "stadium", format: "YouTube thumbnail", tags: ["youtube", "fitness", "thumbnail"] }, stadiumYT],
  [{ id: "dna-brutal-banner", name: "Open To Work, Loudly", description: "A LinkedIn banner that numbers its own personality.", recipe: "brutal", format: "LinkedIn banner", tags: ["linkedin", "banner", "hiring", "profile"] }, brutalBanner],
  [{ id: "dna-swiss-post", name: "JU / NE Sale", description: "A sale so Swiss it barely admits it's a sale.", recipe: "swiss", format: "Instagram post", tags: ["sale", "swiss", "minimal", "fashion"] }, swissPost],
  [{ id: "dna-trippy-story", name: "Main Character Story", description: "Affirmations from your laptop at 2 a.m., now in story format.", recipe: "trippy", format: "Story", tags: ["story", "retro", "psychedelic", "self"] }, trippyStory],
  [{ id: "dna-neo-banner", name: "Push Notification Banner", description: "A bakery banner that wants to be an app so badly.", recipe: "neo", format: "LinkedIn banner", tags: ["banner", "food", "app", "neo-brutal"] }, neoBanner],
  [{ id: "dna-pixel-yt", name: "Boss Fight: My Inbox", description: "Podcast thumbnail, 8-bit edition. 400 unread emails as the final boss.", recipe: "pixel", format: "YouTube thumbnail", tags: ["youtube", "podcast", "game", "thumbnail"] }, pixelYT],
  [{ id: "dna-sticker-story", name: "Limited Drop Story", description: "Streetwear drop story. Stickers outnumber the products.", recipe: "sticker", format: "Story", tags: ["story", "fashion", "drop", "streetwear"] }, stickerStory],
  [{ id: "dna-glossy-post", name: "Glossy Bloom Bakery", description: "Pastries glossy enough to fix your hair in.", recipe: "glossy", format: "Instagram post", tags: ["food", "bakery", "glossy", "post"] }, glossyPost],
];

/** Build every hero doc (call after fonts load). */
export function buildHeroes(): Template[] {
  return [...POSTERS, ...OTHERS, ...V3_TEMPLATES].map(([m, build]) => {
    const d = resolveCollisions(build()).doc;
    return { id: m.id, name: m.name, description: m.description, style: STYLE[m.recipe], format: m.format, category: m.format, tags: m.tags, thumbBg: d.background, doc: d };
  });
}
