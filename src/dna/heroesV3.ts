// v3 templates (REVIEW.md round 6): Loud Quotes, the Scrapbook Coquette family,
// and use-case posters for the photo recipes. Built in the browser with real
// font metrics and frozen with the heroes (scripts/dump-heroes.mjs). Every one
// has 2+ effects, 1+ Sticker Library 2.0 sticker, a funny name and a hover joke.
import type { Element, KiwiwDoc } from "../types";
import { T, R, S, I, F } from "../data/tpl/dsl";
import { LAYOUTS, fit, mono } from "./layouts";
import { QUOTE_LAYOUTS } from "./quotes";
import { writeCopy, type Copy, type RecipeKey } from "./recipes";
import { parseIdea } from "../juice/parse";
import { PHOTOS, type Photo } from "../data/photos";

export interface Meta { id: string; name: string; description: string; recipe: RecipeKey | "coquette"; format: string; tags: string[] }
const ph = (name: string): Photo => PHOTOS.find((p) => p.src.includes(name))!;
const doc = (width: number, height: number, background: string, els: (Element | Element[] | null | false)[]): KiwiwDoc => ({ width, height, background, elements: els.filter(Boolean).flat() as Element[] });
const plus = (d: KiwiwDoc, ...els: Element[]): KiwiwDoc => ({ ...d, elements: [...d.elements, ...els] });
const img = (name: string, b: { x: number; y: number; w: number; h: number }, p: Partial<Element> = {}) => I({ ...b, src: ph(name).src, focus: ph(name).focus, ...(p as object) });

/* ------------------------------ Loud Quotes ------------------------------ */

/** A Loud Quotes poster from a curated line. seed picks the palette. */
function lq(layout: number, line: string, seed: number, over: Partial<Copy> = {}, ...stickers: Element[]): KiwiwDoc {
  const c = { ...writeCopy("quotes", parseIdea(line), 0), ...over };
  return plus(QUOTE_LAYOUTS[layout]({ c, photo: ph("chai-37186989"), photo2: ph("chai-33210272"), seed }), ...stickers);
}
const corner = (kind: string, rot = 10, x = 900, y = 40, s = 140, p: Partial<Element> = {}) => S(kind, { x, y, w: s, h: s, rotation: rot, border: "white", ...(p as object) } as Parameters<typeof S>[1]);

const LOUD: [Meta, () => KiwiwDoc][] = [
  [{ id: "lq-chai-pehle", name: "चाय पहले, बाकी बाद में", description: "The only house rule that has never been broken.", recipe: "quotes", format: "Poster", tags: ["hindi", "quote", "chai", "bilingual", "loud quotes"] },
    () => lq(5, "chai first, everything later", 0, { hi: "चाय पहले, बाकी बाद में", head: "Chai first, everything later." }, corner("dp-kulhad", -8, 900, 1080, 130))],
  [{ id: "lq-jugaad", name: "Jugaad Is A Lifestyle", description: "Engineering degree optional. Cello tape mandatory.", recipe: "quotes", format: "Poster", tags: ["hinglish", "quote", "jugaad", "loud quotes"] },
    () => lq(0, "jugaad is a lifestyle", 3, { word: "jugaad", kicker: "RULE NO. 1" }, corner("dp-jugaad", 10, 860, 1000, 180))],
  [{ id: "lq-desi-startup", name: "House Rules Of A Desi Startup", description: "Stand-up at 11. Chai at 10:59. Pivot by lunch.", recipe: "quotes", format: "Poster", tags: ["startup", "house rules", "hinglish", "work", "loud quotes"] },
    () => lq(2, "house rules of a desi startup", 4, { rules: ["Chai before stand-up.", "Deadline is a vibe, not a date.", "Jugaad > Jira.", "If it runs on my laptop, it ships.", "Mummy is the real investor."] }, corner("km-coding", -8, 30, 40, 140))],
  [{ id: "lq-hostel-rules", name: "Hostel House Rules", description: "Maggi after midnight is protected under hostel law.", recipe: "quotes", format: "Poster", tags: ["college", "hostel", "house rules", "loud quotes"] },
    () => lq(2, "hostel rules", 2, { rules: ["Maggi after midnight is legal.", "Borrowed charger = gone charger.", "Attendance is a rumour.", "The warden can hear you.", "Last samosa is shared. Allegedly."] }, corner("km-sleepy", -8, 30, 40, 140))],
  [{ id: "lq-sab-ho-jayega", name: "Sab Ho Jayega", description: "Said every Indian parent, every exam season, every time.", recipe: "quotes", format: "Poster", tags: ["hinglish", "motivation", "manifesto", "loud quotes"] },
    () => lq(1, "sab ho jayega, tension mat lo", 1, {}, corner("y2k-chrome-sparkle", 0, 470, 1200, 120))],
  [{ id: "lq-kal-se-pakka", name: "Kal Se Pakka", description: "The gym, the diet, the email. All starting tomorrow. Pakka.", recipe: "quotes", format: "Poster", tags: ["hinglish", "funny", "procrastination", "loud quotes"] },
    () => lq(3, "kal se pakka, promise", 3, { word: "pakka" }, corner("ib-loading", -4, 650, 40, 380, { h: 150 } as Partial<Element>))],
  [{ id: "lq-mummy-right", name: "Mummy Is Always Right", description: "Peer-reviewed by every Indian kid, eventually.", recipe: "quotes", format: "Poster", tags: ["quote", "mum", "family", "loud quotes"] },
    () => lq(4, "mummy is always right. eventually you'll agree.", 4, { by: "— every Indian kid, eventually" }, corner("cq-heart-glossy", 12, 880, 1040, 140))],
  [{ id: "lq-dil-se", name: "दिल से, दिमाग से नहीं", description: "Decision-making framework, approved by no consultant ever.", recipe: "quotes", format: "Poster", tags: ["hindi", "bilingual", "love", "loud quotes"] },
    () => lq(5, "with the heart, not the head", 1, { hi: "दिल से, दिमाग से नहीं", head: "With the heart, not the head." }, corner("cq-heart-anatomical", -10, 40, 1080, 150))],
  [{ id: "lq-overthinking", name: "Overthinking Is My Cardio", description: "10,000 steps, all of them in my head.", recipe: "quotes", format: "Poster", tags: ["funny", "mood", "gen z", "loud quotes"] },
    () => lq(3, "overthinking is my cardio", 0, { word: "cardio" }, corner("km-gym", 8, 880, 40, 150))],
  [{ id: "lq-delulu", name: "Delulu Is The Solulu", description: "Manifesting, but with a stacked condensed font.", recipe: "quotes", format: "Poster", tags: ["gen z", "manifest", "delulu", "loud quotes"] },
    () => lq(1, "delulu is the solulu", 3, {}, corner("ty-1111", -6, 380, 1150, 320, { h: 128 } as Partial<Element>))],
  [{ id: "lq-pehle-khud", name: "Pehle Khud Ko Chuno", description: "Self-care poster that also reminds you to drink water.", recipe: "quotes", format: "Poster", tags: ["hinglish", "self love", "quote", "loud quotes"] },
    () => lq(4, "pehle khud ko chuno, phir sabko", 1, { by: "— your therapist, probably" }, corner("ty-main-character", -4, 600, 40, 420, { h: 168 } as Partial<Element>))],
  [{ id: "lq-5-minute", name: "Bas 5 Minute Aur", description: "A unit of time that has never once meant five minutes.", recipe: "quotes", format: "Poster", tags: ["hinglish", "funny", "sleep", "loud quotes"] },
    () => lq(0, "bas 5 minute aur", 4, { word: "minute", kicker: "PUBLIC NOTICE" }, corner("km-sleepy", 10, 880, 1060, 150))],
  [{ id: "lq-rest", name: "Rest Is Productive Too", description: "Permission slip to close the laptop. Signed by kiwi.", recipe: "quotes", format: "Poster", tags: ["quote", "self care", "rest", "loud quotes"] },
    () => lq(4, "rest is productive too", 2, { by: "— kiwi, from the couch" }, corner("km-chai", -8, 880, 1040, 150))],
  [{ id: "lq-do-it-scared", name: "Do It Scared", description: "Courage, but make it a 380pt condensed font.", recipe: "quotes", format: "Poster", tags: ["motivation", "manifesto", "quote", "loud quotes"] },
    () => lq(1, "do it scared, do it anyway", 0, {}, corner("y2k-chrome-bolt", 12, 900, 1150, 130))],
  [{ id: "lq-reply", name: "Not Everything Needs A Reply", description: "For the family group chat, with love and boundaries.", recipe: "quotes", format: "Poster", tags: ["quote", "boundaries", "chat", "loud quotes"] },
    () => lq(3, "not everything needs a reply", 4, { word: "reply" }, corner("ib-seen", -4, 560, 40, 460, { h: 143 } as Partial<Element>))],
  [{ id: "lq-chai-code", name: "Chai, Code, Repeat", description: "The developer's full daily routine, in three words.", recipe: "quotes", format: "Poster", tags: ["developer", "chai", "code", "manifesto", "loud quotes"] },
    () => lq(1, "chai, code, repeat", 2, {}, corner("dp-cutting-chai", 10, 900, 1140, 140))],
  [{ id: "lq-jab-mile", name: "जब मिले, तब चाय", description: "Opening hours of every tapri in India.", recipe: "quotes", format: "Poster", tags: ["hindi", "chai", "bilingual", "loud quotes"] },
    () => lq(5, "whenever we meet, chai", 3, { hi: "जब मिले, तब चाय", head: "Whenever we meet, chai." }, corner("dp-sign-chai", -4, 30, 1110, 230, { h: 101 } as Partial<Element>))],
  [{ id: "lq-soft-life", name: "Soft Life, Hard Work", description: "Both are true. Neither is optional.", recipe: "quotes", format: "Poster", tags: ["quote", "motivation", "giant word", "loud quotes"] },
    () => lq(0, "soft life, hard work", 1, { word: "soft" }, corner("cq-bow", 8, 880, 1060, 150))],
  [{ id: "lq-log-kya", name: "Log Kya Kahenge? Kuch Nahi.", description: "They're busy. They have their own posters to make.", recipe: "quotes", format: "Poster", tags: ["hinglish", "quote", "confidence", "loud quotes"] },
    () => lq(4, "log kya kahenge? kuch nahi. sab busy hain.", 0, { by: "— a very relaxed uncle" }, corner("km-cool", 8, 880, 1040, 150))],
  [{ id: "lq-ghar-ka-khana", name: "Ghar Ka Khana Supremacy", description: "Michelin who? Mummy's dal has three stars and a guilt trip.", recipe: "quotes", format: "Poster", tags: ["hinglish", "food", "house rules", "loud quotes"] },
    () => lq(2, "ghar ka khana", 3, { rules: ["Mummy's dal > any restaurant.", "Second helping is not optional.", "Leftovers are a lifestyle.", "No phones at the table. Mostly.", "Pickle jar is shared property."] }, corner("dp-ghar-ka-khana", -10, 30, 40, 140))],
  // Jugaad 101: a 5-slide carousel
  ...([
    [1, "jugaad 101: a field guide", 0, { head: "Jugaad 101: a field guide", by: "1/5 · SWIPE →" }, "dp-jugaad"],
    [1, "use what you've got", 1, { by: "2/5 · SWIPE →" }, "pp-tape-washi"],
    [3, "tape is a tool", 2, { word: "tape", by: "3/5 · SWIPE →" }, "pp-paperclip"],
    [2, "jugaad rules", 3, { rules: ["Tape fixes 80% of problems.", "The other 20%: a rubber band.", "Never throw away a dabba.", "A spoon is a screwdriver.", "If it works, it's not stupid."] }, "km-coding"],
    [4, "share this with your engineer friend", 4, { by: "5/5 · now go fix something" }, "km-judging"],
  ] as [number, string, number, Partial<Copy>, string][]).map(([layout, line, seed, over, st], i): [Meta, () => KiwiwDoc] => [
    { id: `lq-carousel-${i + 1}`, name: `Jugaad 101 · Slide ${i + 1}/5`, description: ["Cover slide. Swipe if you've ever fixed a remote with a rubber band.", "Slide 2: resourcefulness, loudly.", "Slide 3: the most powerful tool in India.", "Slide 4: the laws of jugaad.", "Slide 5: the call to action (fix something)."][i], recipe: "quotes", format: "Carousel slide", tags: ["carousel", "jugaad", "series", "loud quotes"] },
    () => lq(layout, line, seed, over, corner(st, i % 2 ? -8 : 8, i === 3 ? 30 : 900, i === 3 ? 40 : 1080, 140)),
  ]),
];

/* --------------------------- Scrapbook Coquette --------------------------- */

const CQ = { cream: "#FBF1E6", blush: "#F9D6DE", red: "#C8102E", pink: "#FF8FB1", ink: "#2A0A12", paper: "#FFFDF8" };
/** Spell a word in ransom letters. */
function ransom(word: string, x: number, y: number, size: number, tilt = 0): Element[] {
  return [...word.toUpperCase()].flatMap((ch, i) => (ch === " " ? [] : [S(`ty-ransom-${ch.toLowerCase()}`, { x: x + i * size * 0.88, y: y + ((i * 37) % 3) * size * 0.06, w: size, h: size, rotation: tilt + (((i * 53) % 9) - 4) })]));
}
const polaroid = (photo: string, x: number, y: number, w: number, rot: number, title: string) =>
  img(photo, { x, y, w, h: w * 1.12 }, { rotation: rot, frame: { kind: "polaroid", title }, grain: 0.25 } as Partial<Element>);
const grain = (W: number, H: number, fill = "#7A3B2E") => S("texture-grain", { x: 0, y: 0, w: W, h: H, fill, opacity: 0.28 });
const script = (text: string, x: number, y: number, w: number, size: number, color = CQ.red, rot = -4, align: "left" | "center" | "right" = "center") =>
  T({ x, y, w, h: size * 1.3, text, font: F.vibes, size, color, align, rotation: rot, lineHeight: 1.1, bleed: color } as Parameters<typeof T>[0]);
const st = (kind: string, x: number, y: number, w: number, h = w, rot = 0, p: Partial<Element> = {}) => S(kind, { x, y, w, h, rotation: rot, border: "white", ...(p as object) } as Parameters<typeof S>[1]);

const COQUETTE: [Meta, () => KiwiwDoc][] = [
  [{ id: "cq-fav-person", name: "Favorite Person Collage", description: "Tag them. Or don't, and let them wonder.", recipe: "coquette", format: "Instagram post", tags: ["coquette", "friends", "love", "collage", "scrapbook"] }, () => {
    const W = 1080, H = 1080;
    return doc(W, H, CQ.blush, [
      st("pp-notebook", 560, 40, 470, 580, 4, { border: "none" }),
      ransom("FAV", 70, 60, 150, -3),
      script("person", 70, 220, 520, 140, CQ.red, -6, "left"),
      polaroid("party-32333371", 90, 430, 380, -6, "us, obviously"),
      polaroid("cake-9543834", 600, 140, 330, 5, "the cake era"),
      st("cq-cherries", 410, 380, 190, 190, -8),
      st("cq-lips-glossy", 650, 580, 300, 180, 8),
      st("pp-ticket-lucky", 560, 800, 460, 172, -5, { border: "none" }),
      st("cq-bow", 160, 380, 150, 150, -12),
      st("y2k-sparkle-cluster", 950, 40, 110, 110, 0, { border: "none" }),
      grain(W, H),
    ]);
  }],
  [{ id: "cq-valentine", name: "Be My Valentine (Or Else)", description: "Romantic, slightly threatening, entirely handwritten.", recipe: "coquette", format: "Poster", tags: ["coquette", "valentine", "love", "letter", "scrapbook"] }, () => {
    const W = 1080, H = 1350;
    return doc(W, H, CQ.red, [
      S("bg-checker", { x: 0, y: 0, w: W, h: H, fill: "#B00C24", accent: CQ.red, opacity: 0.55 }),
      st("cq-love-letter", 170, 240, 740, 740, -5, { border: "none" }),
      st("cq-envelope", 60, 900, 380, 342, -10),
      st("cq-rose", 760, 860, 280, 280, 12),
      st("cq-kiss-trio", 640, 140, 360, 277, 6, { border: "none", fill: "#FFFFFF", accent: CQ.pink, ink: "#FFD6E0" }),
      T({ x: 60, y: 50, w: 600, h: 150, text: "BE MY\nVALENTINE", font: F.bowlby, size: 76, color: "#FFFFFF", lineHeight: 0.95, shadow: { color: "#5E0010", x: 6, y: 5 }, grain: 0.3 } as Parameters<typeof T>[0]),
      script("(or else)", 360, 1180, 640, 110, "#FFFFFF", -6, "right"),
      st("pp-stamp-heart", 470, 1010, 170, 170, 8),
      grain(W, H, "#3A0008"),
    ]);
  }],
  [{ id: "cq-galentines", name: "Galentine's Brunch", description: "Mimosas optional. Gossip mandatory. Cherries everywhere.", recipe: "coquette", format: "Story", tags: ["coquette", "brunch", "friends", "invite", "story"] }, () => {
    const W = 1080, H = 1920;
    return doc(W, H, CQ.cream, [
      st("pp-frame-scallop", 90, 160, 900, 900, 0, { border: "none", fill: CQ.pink, accent: CQ.paper }),
      img("food-958547", { x: 180, y: 250, w: 720, h: 720 }, { fx: { duotone: { dark: "#7A1030", light: "#FFE3EA" } }, radius: 18 } as Partial<Element>),
      st("cq-bow", 430, 80, 220, 220, 0),
      ransom("GALS", 150, 1100, 190, -2),
      script("brunch & gossip", 90, 1300, 900, 120, CQ.red, -4),
      st("cq-cocktail", 80, 960, 220, 220, -10),
      st("cq-cherries", 800, 950, 220, 220, 10),
      mono(90, 1500, 900, "SUNDAY · 11AM · BRING YOUR BEST STORY", CQ.ink, 30, "center"),
      st("pp-ticket-admit", 230, 1600, 620, 233, -3, { border: "none", fill: CQ.pink, accent: CQ.red }),
      grain(W, H),
    ]);
  }],
  [{ id: "cq-friendship", name: "Friendship Day Photo Dump", description: "Every photo blurry, every memory crystal clear.", recipe: "coquette", format: "Instagram post", tags: ["coquette", "friendship day", "friends", "photo dump"] }, () => {
    const W = 1080, H = 1080;
    return doc(W, H, "#F4E1E8", [
      st("pp-photobooth", 60, 70, 300, 600, -5, { border: "none" }),
      img("crowd-28457979", { x: 105, y: 90, w: 145, h: 132 }, { rotation: -5, fx: { bw: true } } as Partial<Element>),
      img("party-32333371", { x: 112, y: 222, w: 145, h: 132 }, { rotation: -5, fx: { bw: true } } as Partial<Element>),
      img("fest-11511275", { x: 120, y: 354, w: 145, h: 132 }, { rotation: -5, fx: { bw: true } } as Partial<Element>),
      ransom("BFF", 420, 90, 180, 3),
      script("since forever", 400, 300, 620, 100, CQ.red, -5),
      polaroid("fest-3899269", 470, 440, 320, 7, "the night we don't talk about"),
      st("pp-film", 10, 780, 640, 192, -4, { border: "none" }),
      st("cq-heart-pin", 840, 380, 180, 162, 12),
      st("ty-core-memory", 650, 870, 400, 160, -6),
      grain(W, H),
    ]);
  }],
  [{ id: "cq-core-memory", name: "Core Memory Unlocked", description: "For the photo you'll still be posting in 2035.", recipe: "coquette", format: "Instagram post", tags: ["coquette", "memory", "photo", "nostalgia"] }, () => {
    const W = 1080, H = 1080;
    return doc(W, H, "#FFF4E8", [
      st("pp-notebook", 40, 60, 560, 680, -4, { border: "none" }),
      polaroid("chai-18413481", 330, 120, 470, 5, "golden hour, chai, you"),
      st("pp-tape-washi", 420, 90, 300, 60, -8, { border: "none" }),
      st("ty-core-memory", 40, 780, 620, 248, -4),
      st("y2k-sparkle-cluster", 820, 100, 180, 180, 0, { border: "none" }),
      st("cq-cherry", 820, 760, 200, 200, 14),
      script("never forget", 60, 610, 380, 90, CQ.red, -8, "left"),
      st("y2k-cd", 820, 560, 180, 180, 0),
      grain(W, H),
    ]);
  }],
  [{ id: "cq-mood-board", name: "Mood Board: Soft Era", description: "Lips, pearls, cherries and one very serious lily.", recipe: "coquette", format: "Poster", tags: ["coquette", "mood board", "aesthetic", "collage"] }, () => {
    const W = 1080, H = 1350;
    const sw = ["#C8102E", "#FF8FB1", "#FBEEDC", "#D9DDE3", "#2A0A12"];
    return doc(W, H, "#F7EDE6", [
      T({ x: 60, y: 50, w: 960, h: 120, text: "mood board", font: F.playfair, size: 110, italic: true, fontWeight: 800, color: CQ.red, align: "left", lineHeight: 1, bleed: CQ.red } as Parameters<typeof T>[0]),
      mono(60, 175, 960, "VOL. 07 · THE SOFT ERA · NO NOTES", CQ.ink, 24),
      img("wedding-10454182", { x: 60, y: 240, w: 470, h: 560 }, { fx: { duotone: { dark: "#3A0A14", light: "#FFE3EA" } }, radius: 6 } as Partial<Element>),
      img("cake-16000541", { x: 560, y: 240, w: 460, h: 300 }, { radius: 6, grain: 0.3 } as Partial<Element>),
      img("food-36236282", { x: 560, y: 560, w: 460, h: 240 }, { fx: { halftone: { dot: 7, ink: "#2A0A12", paper: "#FBEEDC" } }, radius: 6 } as Partial<Element>),
      ...sw.map((c, i) => R({ x: 60 + i * 120, y: 840, w: 100, h: 100, fill: c, radius: 50, cutout: { color: "#FFFFFF", width: 5 } })),
      st("cq-lips-halftone", 680, 830, 340, 204, -6),
      st("y2k-pearls", 60, 990, 600, 144, 0, { border: "none" }),
      st("cq-lily", 820, 1060, 220, 220, 10),
      st("cq-perfume", 640, 1100, 200, 200, -8),
      script("soft, but make it loud", 60, 1170, 600, 80, CQ.red, -3, "left"),
      grain(W, H),
    ]);
  }],
  [{ id: "cq-birthday-era", name: "Birthday Girl Era", description: "Main character energy, now with a disco ball and a cake.", recipe: "coquette", format: "Story", tags: ["coquette", "birthday", "party", "story"] }, () => {
    const W = 1080, H = 1920;
    return doc(W, H, "#2A0A12", [
      S("bg-sunburst", { x: -300, y: -200, w: 1680, h: 1800, fill: "#4A0F1E", accent: "#2A0A12", opacity: 1 }),
      st("y2k-disco", 340, 60, 400, 400, 0),
      ransom("BDAY", 120, 520, 210, -3),
      script("girl era", 160, 720, 760, 170, CQ.pink, -6),
      polaroid("cake-25956380", 270, 960, 540, -4, "make a wish (a big one)"),
      st("cq-bow-satin", 90, 900, 240, 240, -14),
      st("y2k-bubble-heart", 790, 880, 220, 207, 12),
      st("y2k-sparkle-cluster", 820, 1580, 200, 200, 0, { border: "none" }),
      mono(90, 1740, 900, "SAT · 8PM · DRESS CODE: SPARKLY", "#FFD6E0", 30, "center"),
      grain(W, H, "#000000"),
    ]);
  }],
  [{ id: "cq-cherry-menu", name: "Cherry On Top Café Menu", description: "Every item ends with a cherry. Including the bill.", recipe: "coquette", format: "Instagram post", tags: ["coquette", "menu", "cafe", "food", "dessert"] }, () => {
    const W = 1080, H = 1080;
    const items: [string, string][] = [["Cherry Cheesecake", "₹240"], ["Rose Milk Tea", "₹180"], ["Strawberry Croissant", "₹210"], ["A Little Treat", "₹∞"]];
    return doc(W, H, CQ.cream, [
      st("pp-frame-scallop", 30, 30, 1020, 1020, 0, { border: "none", fill: CQ.red, accent: CQ.cream }),
      T({ x: 185, y: 175, w: 480, h: 190, text: "cherry\non top", font: F.playfair, size: 92, italic: true, fontWeight: 900, color: CQ.red, lineHeight: 0.95, shadow: { color: CQ.pink, x: 5, y: 4 } } as Parameters<typeof T>[0]),
      st("cq-cherries", 650, 160, 230, 230, 8),
      mono(185, 390, 600, "MENU · ALL DAY · NO DIETS", CQ.ink, 22),
      ...items.flatMap(([n, p], i) => [
        T({ x: 185, y: 450 + i * 95, w: 470, h: 60, text: n, font: F.gloock, size: 42, color: CQ.ink, lineHeight: 1.2 }),
        T({ x: 660, y: 450 + i * 95, w: 230, h: 60, text: p, font: F.bowlby, size: 38, color: CQ.red, align: "right", lineHeight: 1.3 }),
        R({ x: 185, y: 522 + i * 95, w: 705, h: 2, fill: CQ.ink, opacity: 0.25 }),
      ]),
      st("cq-bow-row", 300, 850, 480, 140, 0, { border: "none" }),
      grain(W, H),
    ]);
  }],
  [{ id: "cq-rakhi", name: "Rakhi, Coquette Edition", description: "Bhai, the bow is cute. Where is my gift though?", recipe: "coquette", format: "Instagram post", tags: ["coquette", "raksha bandhan", "rakhi", "hindi", "festival"] }, () => {
    const W = 1080, H = 1080;
    return doc(W, H, "#FFE3EA", [
      S("bg-halftone", { x: 0, y: 0, w: W, h: H, fill: "#FF8FB1", accent: "#FFE3EA", opacity: 0.5 }),
      fit("रक्षाबंधन", F.rozha, { x: 60, y: 60, w: 960, h: 240 }, { size: 210, align: "center", color: CQ.red, lh: 1.15, lines: 1, extra: { outline: { color: "#FFFFFF", width: 10 }, shadow: { color: "#5E0010", x: 8, y: 8 } } }).el,
      R({ x: 0, y: 470, w: W, h: 70, fill: CQ.red, rotation: -3 }),
      st("cq-bow-satin", 380, 320, 320, 320, 0),
      st("dp-bindi", 480, 420, 120, 120, 0, { border: "none" }),
      script("bhai, gift kahan hai?", 90, 650, 900, 120, CQ.red, -4),
      st("pp-ticket-lucky", 60, 830, 440, 165, -6, { border: "none" }),
      st("cq-envelope", 700, 800, 280, 252, 8),
      st("y2k-sparkle-cluster", 70, 300, 160, 160, 0, { border: "none" }),
      grain(W, H),
    ]);
  }],
  [{ id: "cq-ticket-nowhere", name: "Ticket To Nowhere Trip Invite", description: "Destination unknown. Snacks confirmed. Mummy not informed.", recipe: "coquette", format: "Poster", tags: ["coquette", "travel", "trip", "invite", "scrapbook"] }, () => {
    const W = 1080, H = 1350;
    return doc(W, H, "#E9EEF9", [
      st("pp-postcard", 90, 120, 900, 675, -4, { border: "none" }),
      st("pp-ticket-nowhere", 140, 780, 760, 285, 5, { border: "none" }),
      st("pp-stamp-airmail", 820, 60, 200, 200, 10),
      st("y2k-camera", 60, 1050, 260, 260, -10),
      polaroid("city-27786486", 700, 980, 300, 8, "somewhere, eventually"),
      script("road trip?", 330, 1150, 380, 110, "#1D3FD8", -6),
      grain(W, H, "#1D3FD8"),
    ]);
  }],
  [{ id: "cq-1111-wishlist", name: "11:11 Wishlist", description: "Wishes made at 11:11 legally have to come true.", recipe: "coquette", format: "Story", tags: ["coquette", "wishlist", "manifest", "story", "11:11"] }, () => {
    const W = 1080, H = 1920;
    const wishes = ["a window seat", "my own café", "mummy's approval", "a dog named Kiwi", "less screen time (lol)"];
    return doc(W, H, "#1B1B3A", [
      S("bg-pixel", { x: 0, y: 0, w: W, h: H, fill: "#FFE066", accent: "#1B1B3A", opacity: 0.6 }),
      st("ty-1111", 140, 120, 800, 320, -4),
      st("pp-notebook", 140, 520, 800, 1000, 2, { border: "none" }),
      ...wishes.map((w, i) => T({ x: 260, y: 640 + i * 170, w: 640, h: 110, text: `${i + 1}. ${w}`, font: F.kalam, size: 64, fontWeight: 700, color: "#1B1B3A", rotation: 2, lineHeight: 1.2 })),
      st("pp-sticky", 720, 1400, 300, 300, 8, { border: "none" }),
      st("y2k-moon-charm", 60, 1500, 260, 260, -10),
      st("y2k-sparkle-cluster", 820, 460, 200, 200, 0, { border: "none" }),
      grain(W, H, "#000000"),
    ]);
  }],
  [{ id: "cq-flags", name: "Red Flag / Green Flag", description: "A field guide to the group chat. Peer-reviewed by your bestie.", recipe: "coquette", format: "Instagram post", tags: ["coquette", "dating", "funny", "red flag", "green flag"] }, () => {
    const W = 1080, H = 1080;
    const red = ["replies 'k'", "no chai opinions", "hates kiwis"], green = ["sends memes", "remembers your order", "shares fries"];
    return doc(W, H, CQ.cream, [
      R({ x: 0, y: 0, w: 540, h: H, fill: "#FFE1E1" }), R({ x: 540, y: 0, w: 540, h: H, fill: "#E2F5E6" }),
      st("ty-red-flag", 40, 60, 460, 184, -4),
      st("ty-green-flag", 580, 60, 460, 184, 4),
      ...red.map((t, i) => T({ x: 60, y: 320 + i * 170, w: 440, h: 120, text: `× ${t}`, font: F.kalam, size: 54, fontWeight: 700, color: "#C8102E", lineHeight: 1.1 })),
      ...green.map((t, i) => T({ x: 600, y: 320 + i * 170, w: 440, h: 120, text: `✓ ${t}`, font: F.kalam, size: 54, fontWeight: 700, color: "#1E7A3E", lineHeight: 1.1 })),
      st("km-judging", 450, 880, 180, 180, 0),
      mono(40, 1010, 1000, "SCREENSHOT. SEND TO THE GROUP. SAY NOTHING.", CQ.ink, 22, "center"),
      grain(W, H),
    ]);
  }],
  [{ id: "cq-anniversary-receipt", name: "Anniversary Receipt", description: "Itemised love. Total: priceless. Tip: included.", recipe: "coquette", format: "Poster", tags: ["coquette", "anniversary", "love", "receipt"] }, () => {
    const W = 1080, H = 1350;
    return doc(W, H, CQ.red, [
      st("pp-receipt", 90, 140, 520, 646, -4, { border: "none" }),
      polaroid("wedding-36354615", 600, 120, 400, 7, "year one"),
      fit("happy anniversary", F.playfair, { x: 60, y: 880, w: 960, h: 260 }, { size: 140, italic: true, weight: 900, color: "#FFFFFF", lh: 0.95, lines: 2, align: "center", extra: { shadow: { color: "#5E0010", x: 6, y: 5 }, bleed: "#FFFFFF" } }).el,
      st("cq-kiss", 700, 640, 260, 156, -10, { border: "none", fill: "#FFFFFF", accent: "#FFFFFF", ink: "#FFFFFF" }),
      st("cq-heart-glitter", 80, 1170, 160, 144, -12),
      mono(260, 1210, 760, "PAID IN FULL · NO REFUNDS · KEEP FOREVER", "#FFE3EA", 24),
      grain(W, H, "#3A0008"),
    ]);
  }],
];

/* ------------------------- use-case photo posters ------------------------- */

function fromLayout(r: RecipeKey, layout: number, line: string, photo: string, photo2: string, angle = 0, over: Partial<Copy> = {}, ...extra: Element[]) {
  const c = { ...writeCopy(r, parseIdea(line), angle), ...over };
  return plus(LAYOUTS[r][layout]({ c, photo: ph(photo), photo2: ph(photo2), seed: 7 }), ...extra);
}

const USE: [Meta, () => KiwiwDoc][] = [
  [{ id: "uc-hackathon", name: "48 Hours, 0 Sleep Hackathon", description: "Free pizza, free wifi, free existential crisis at 4 a.m.", recipe: "pixel", format: "Poster", tags: ["hackathon", "college", "coding", "event"] },
    () => fromLayout("pixel", 1, "hackathon friday 6pm", "laptop-265144", "laptop-8052620", 0, { kicker: "WORLD 1-1", head: "48 HOURS. 0 SLEEP.", sub: "PRESS START TO CODE" }, st("ib-loading", 60, 1150, 420, 163, -4))],
  [{ id: "uc-club-recruit", name: "Club Recruitment (We Have Snacks)", description: "Join the club. Leave with three new hobbies and a hoodie.", recipe: "neo", format: "Poster", tags: ["college", "club", "recruitment", "hiring"] },
    () => fromLayout("neo", 1, "design club recruitment monday 5pm", "crowd-4218027", "fest-11537125", 0, { head: "We're Recruiting", sub: "Snacks guaranteed. Talent optional.", cta: "SIGN ME UP" }, st("ib-notification", 600, 40, 440, 158, 4))],
  [{ id: "uc-diwali-sale", name: "Dhamaka Diwali Sale", description: "Prices so low the neighbours will ask questions.", recipe: "tapri", format: "Poster", tags: ["diwali", "sale", "festival", "hindi", "offer"] },
    () => fromLayout("tapri", 1, "diwali sale 40% off", "diwali-34400019", "diwali-10182772", 0, {}, st("dp-diya-glow", 860, 1100, 200, 200, 0))],
  [{ id: "uc-holi", name: "Holi But Make It Trippy", description: "Colours everywhere. Including places colours should not be.", recipe: "trippy", format: "Poster", tags: ["holi", "festival", "party", "colour"] },
    () => fromLayout("trippy", 1, "holi party sunday 11am", "fest-36425051", "fest-11517280", 0, { kicker: "holi.exe", head: "BURA NA MANO, HOLI HAI", sub: "Wear white. Leave rainbow." }, st("y2k-smiley-star", 860, 1140, 180, 180, 12))],
  [{ id: "uc-navratri", name: "Navratri Garba Night", description: "Nine nights, one pair of sore feet, zero regrets.", recipe: "nazar", format: "Poster", tags: ["navratri", "garba", "festival", "dance", "hindi"] },
    () => fromLayout("nazar", 2, "garba night saturday 8pm", "fest-11511275", "fest-3899269", 0, { kicker: "AAJ", head: "गरबा रात", sub: "Dandiya laao, energy hum denge" }, st("dp-marigold-string", 940, 0, 110, 560, 0, { border: "none" }))],
  [{ id: "uc-eid", name: "Eid Mubarak Glow", description: "Sheer khurma first, photos second, sleep never.", recipe: "glossy", format: "Poster", tags: ["eid", "festival", "glossy", "greeting"] },
    () => fromLayout("glossy", 0, "eid mubarak", "food-36854500", "food-37180955", 0, { kicker: "FESTIVE", head: "Eid Mubarak", sub: "Sheer khurma on the table" }, st("y2k-moon-charm", 820, 70, 220, 220, 10))],
  [{ id: "uc-product-drop", name: "Product Drop 002", description: "Restock in 3, 2, 1… sold out. Sorry. Stickers left though.", recipe: "sticker", format: "Poster", tags: ["product", "drop", "launch", "streetwear", "sale"] },
    () => fromLayout("sticker", 1, "product drop friday 12pm", "startup-7414009", "launch-7327336", 1, {}, st("y2k-chrome-star", 860, 40, 180, 180, 10))],
  [{ id: "uc-exam-results", name: "Results Are Out (Stay Calm)", description: "Sports-commentary energy for a 74.5%. Crowd goes mild.", recipe: "stadium", format: "Poster", tags: ["exam", "results", "college", "school"] },
    () => fromLayout("stadium", 1, "exam results today", "office-1181738", "office-12903168", 0, { kicker: "FULL TIME", head: "RESULTS ARE OUT", sub: "STAY CALM. MUMMY IS WATCHING." }, st("sp-trophy", 860, 1100, 190, 190, 8))],
  [{ id: "uc-farewell", name: "Farewell, Seniors", description: "Goodbye to the people who taught us where the canteen is.", recipe: "swiss", format: "Poster", tags: ["farewell", "college", "seniors", "event"] },
    () => fromLayout("swiss", 1, "farewell party friday 7pm", "crowd-28457979", "party-32333371", 0, { head: "FAREWELL PARTY", sub: "Thanks for the notes, seniors" }, st("pp-ticket-nowhere", 620, 40, 420, 158, 4, { border: "none" }))],
  [{ id: "uc-open-to-work", name: "Hire Me, I Have 47 Tabs Open", description: "A LinkedIn post that's honest about the tabs.", recipe: "brutal", format: "Poster", tags: ["open to work", "linkedin", "jobs", "hiring"] },
    () => fromLayout("brutal", 0, "open to work", "laptop-19935029", "office-6326260", 0, { kicker: "NOTICE NO. 47", head: "OPEN TO WORK", sub: "Designer. Fast learner. 47 tabs open." }, st("ib-cursor-hand", 880, 1130, 160, 160, -12))],
  [{ id: "uc-gym-batch", name: "New Batch, Same Excuses", description: "6 a.m. batch for people who will join the 7 p.m. batch.", recipe: "stadium", format: "Poster", tags: ["gym", "fitness", "batch", "sports"] },
    () => fromLayout("stadium", 2, "gym new batch monday 6am", "gym-2261483", "gym-3838705", 2, {}, st("sp-whistle", 860, 40, 180, 180, 10))],
  [{ id: "uc-wedding-invite", name: "Shaadi Invite, Nazar-Proof", description: "RSVP by WhatsApp. Gifts by UPI. Dancing by force.", recipe: "nazar", format: "Poster", tags: ["wedding", "invite", "shaadi", "hindi"] },
    () => fromLayout("nazar", 1, "wedding sangeet saturday 7pm", "wedding-29368877", "wedding-10454182", 1, { kicker: "SAVE THE DATE", head: "शुभ विवाह" }, st("dp-mehndi-hand", 860, 20, 200, 200, 12))],
  [{ id: "uc-birthday-pixel", name: "Player 2 Has Entered The Party", description: "Birthday invite for anyone who still blows on cartridges.", recipe: "pixel", format: "Poster", tags: ["birthday", "party", "game", "8-bit"] },
    () => fromLayout("pixel", 2, "birthday party saturday 8pm", "cake-23384637", "party-32333371", 1, {}, st("km-party", 860, 1110, 190, 190, 8))],
  [{ id: "uc-podcast-cover", name: "Gossip Hour Podcast", description: "Episode 12: we talk about you (affectionately).", recipe: "brutal", format: "Poster", tags: ["podcast", "cover", "episode"] },
    () => fromLayout("brutal", 1, "podcast episode 12", "podcast-2876659", "podcast-164755", 2, { head: "GOSSIP HOUR" }, st("y2k-cassette", 830, 1100, 220, 220, -8))],
];

/* ----------------------------- other formats ----------------------------- */

const certificate = () => {
  const W = 1600, H = 1131;
  return doc(W, H, "#FFF8E8", [
    st("pp-frame-ornate", 30, 30, 1540, 1071, 0, { border: "none" }),
    mono(0, 120, W, "THE KIWIW INSTITUTE OF CHAI STUDIES", "#7A5A12", 28, "center"),
    T({ x: 100, y: 180, w: 1400, h: 170, text: "Certificate of Excellence", font: F.playfair, size: 120, italic: true, fontWeight: 900, color: "#7A1030", align: "center", lineHeight: 1.1, bleed: "#7A1030" } as Parameters<typeof T>[0]),
    T({ x: 100, y: 380, w: 1400, h: 60, text: "This certifies, beyond reasonable doubt, that", font: F.gloock, size: 40, color: "#2A1A0E", align: "center", lineHeight: 1.3 }),
    T({ x: 200, y: 460, w: 1200, h: 170, text: "Your Name Here", font: F.vibes, size: 150, color: "#C8102E", align: "center", lineHeight: 1.1 }),
    T({ x: 200, y: 660, w: 1200, h: 120, text: "can make cutting chai in under 4 minutes while answering three phone calls and one aunty.", font: F.gloock, size: 38, color: "#2A1A0E", align: "center", lineHeight: 1.35 }),
    st("dp-desi-stamp", 1200, 760, 260, 260, -12, { border: "none" }),
    st("sp-medal", 140, 760, 240, 240, -8),
    T({ x: 560, y: 900, w: 480, h: 60, text: "Chief Chai Officer", font: F.vibes, size: 56, color: "#2A1A0E", align: "center", lineHeight: 1.1 }),
    R({ x: 560, y: 965, w: 480, h: 2, fill: "#2A1A0E" }),
    mono(560, 980, 480, "SIGNED, WITH A SLIGHT SLURP", "#7A5A12", 20, "center"),
  ]);
};

const eventPass = () => {
  const W = 1080, H = 1920;
  return doc(W, H, "#111111", [
    S("bg-checker", { x: 0, y: 0, w: W, h: H, fill: "#1D3FD8", accent: "#111111", opacity: 0.6 }),
    R({ x: 470, y: 0, w: 140, h: 330, fill: "#FFD400" }),
    R({ x: 140, y: 300, w: 800, h: 1400, fill: "#FFFDF6", radius: 40, cutout: { color: "#111111", width: 6 } }),
    R({ x: 470, y: 340, w: 140, h: 30, fill: "#111111", radius: 15 }),
    T({ x: 180, y: 420, w: 720, h: 260, text: "ALL\nACCESS", font: F.shoulders, size: 200, fontWeight: 900, color: "#111111", align: "center", lineHeight: 0.85, shadow: { color: "#FF4FA3", x: 8, y: 6 } } as Parameters<typeof T>[0]),
    img("music-11865671", { x: 220, y: 760, w: 640, h: 520 }, { fx: { riso: { inks: ["#1D3FD8", "#FF4FA3"], paper: "#FFFDF6" } }, radius: 18 } as Partial<Element>),
    st("sp-digit-0", 240, 1320, 120, 144, 0, { border: "none" }), st("sp-digit-7", 370, 1320, 120, 144, 0, { border: "none" }),
    T({ x: 520, y: 1330, w: 360, h: 130, text: "BACKSTAGE\n(snacks only)", font: F.bowlby, size: 40, color: "#111111", lineHeight: 1.1 }),
    mono(180, 1520, 720, "KIWIW FEST · NIGHT 2 · DO NOT LOSE THIS", "#111111", 24, "center"),
    st("ib-verified", 800, 1520, 130, 130, 10),
  ]);
};

const pitchSlide = () => {
  const W = 1920, H = 1080;
  return doc(W, H, "#F4F1EA", [
    R({ x: 0, y: 0, w: 640, h: H, fill: "#FF2E1F", grain: 0.3 } as Parameters<typeof R>[0]),
    T({ x: 60, y: 60, w: 520, h: 60, text: "SERIES A · DECK V47 (FINAL) (FINAL-2)", font: F.smono, size: 22, fontWeight: 700, color: "#0A0A0A", letterSpacing: 2, lineHeight: 1.4 }),
    T({ x: 60, y: 760, w: 540, h: 260, text: "01", font: F.shoulders, size: 300, fontWeight: 900, color: "#0A0A0A", lineHeight: 0.85 }),
    fit("CHAI, BUT AS A SERVICE.", F.archivo, { x: 720, y: 160, w: 1120, h: 460 }, { size: 180, color: "#0A0A0A", lh: 0.92, lines: 3, upper: true, extra: { shadow: { color: "#1F3BFF", x: 8, y: 6 } } }).el,
    T({ x: 720, y: 680, w: 1100, h: 120, text: "We deliver cutting chai to stand-ups in 4 minutes. Investors get theirs first.", font: F.tight, size: 44, fontWeight: 600, color: "#0A0A0A", lineHeight: 1.25 }),
    st("ib-loading", 720, 860, 520, 202, -2),
    st("dp-cutting-chai", 1640, 760, 220, 220, 8),
    st("y2k-chrome-star", 1700, 50, 170, 170, 12),
  ]);
};

const wallpaper = () => {
  const W = 1080, H = 1920;
  return doc(W, H, "#FF6FAE", [
    S("bg-swirl", { x: 0, y: 0, w: W, h: H, fill: "#FF6FAE", accent: "#FFD6E8", opacity: 0.7 }),
    fit("DO IT SCARED", F.shoulders, { x: 40, y: 600, w: 1000, h: 760 }, { size: 330, upper: true, weight: 900, color: "#C8102E", lh: 0.84, lines: 3, align: "center", extra: { shadow: { color: "#FFF0F5", x: 8, y: 7 }, bleed: "#C8102E", grain: 0.3 } }).el,
    st("y2k-chrome-sparkle", 120, 360, 200, 200, -10),
    st("y2k-butterfly", 760, 1400, 240, 240, 12),
    st("cq-heart-glossy", 90, 1500, 200, 180, -12),
    mono(0, 1780, W, "LOCK SCREEN · DO NOT FORGET", "#7A1030", 26, "center"),
  ]);
};

const ytThumb = () => {
  const W = 1280, H = 720;
  return doc(W, H, "#FFD400", [
    S("bg-sunburst", { x: -200, y: -300, w: 1700, h: 1300, fill: "#FFE14D", accent: "#FFD400", opacity: 1 }),
    img("chai-33210272", { x: 700, y: 60, w: 520, h: 600 }, { rotation: 4, cutout: { color: "#FFFFFF", width: 12 }, fx: { halftone: { dot: 8, ink: "#111111", paper: "#FFFDF6" } } } as Partial<Element>),
    fit("I TRIED EVERY CHAI IN MUMBAI", F.bowlby, { x: 40, y: 50, w: 680, h: 460 }, { size: 120, color: "#111111", lh: 0.95, lines: 4, upper: true, extra: { outline: { color: "#FFFFFF", width: 8 }, shadow: { color: "#D7261E", x: 8, y: 7 } } }).el,
    st("ib-caution", 60, 520, 190, 180, -8),
    st("km-crying", 1080, 520, 180, 180, 10),
    T({ x: 280, y: 560, w: 420, h: 100, text: "(my kidneys)", font: F.marker, size: 56, color: "#D7261E", rotation: -4, lineHeight: 1.1 }),
  ]);
};

const linkedinPost = () => {
  const W = 1080, H = 1080;
  return doc(W, H, "#FFE14D", [
    st("ib-error", 70, 90, 940, 470, -2, { border: "none" }),
    fit("I'm thrilled to announce I finally closed 46 of my 47 tabs.", F.tight, { x: 90, y: 600, w: 900, h: 260 }, { size: 74, weight: 800, color: "#111111", lh: 1.08, lines: 4 }).el,
    st("ib-verified", 880, 860, 150, 150, 8),
    st("ib-like", 90, 900, 260, 172, -6),
    mono(380, 960, 480, "#OpenToWork #TabsOpen #Agree?", "#111111", 24),
  ]);
};

const memeTemplate = () => {
  const W = 1080, H = 1080;
  return doc(W, H, "#FFFFFF", [
    st("ib-pov", 60, 60, 300, 216, -6),
    T({ x: 380, y: 90, w: 640, h: 200, text: "you said 'just one more episode' at 11 p.m.", font: F.tight, size: 52, fontWeight: 800, color: "#111111", lineHeight: 1.1 }),
    img("laptop-7437087", { x: 60, y: 320, w: 960, h: 620 }, { fx: { halftone: { dot: 9, ink: "#1A1A2E", paper: "#DCEBFF" } }, radius: 12 } as Partial<Element>),
    st("ib-battery", 760, 800, 280, 235, 8),
    st("km-sleepy", 80, 820, 200, 200, -10),
    mono(60, 1000, 960, "MEME TEMPLATE · SWAP THE PHOTO, KEEP THE PAIN", "#111111", 22, "center"),
  ]);
};

const FORMATS: [Meta, () => KiwiwDoc][] = [
  [{ id: "fx-certificate", name: "Certified Chai Expert", description: "Frame-worthy proof that you can make chai while on a call.", recipe: "coquette", format: "Certificate", tags: ["certificate", "award", "funny", "chai"] }, certificate],
  [{ id: "fx-event-pass", name: "All Access (Snacks Only)", description: "Backstage pass to the snack table. Lanyard not included.", recipe: "brutal", format: "Event pass", tags: ["event pass", "festival", "music", "ticket"] }, eventPass],
  [{ id: "fx-pitch-slide", name: "Pitch Deck Cover: Chai-aaS", description: "Slide 1 of 47. Investors already asking for a refill.", recipe: "brutal", format: "Slide", tags: ["pitch deck", "slide", "startup", "presentation"] }, pitchSlide],
  [{ id: "fx-wallpaper", name: "Do It Scared Wallpaper", description: "A lock screen that yells at you, lovingly, 96 times a day.", recipe: "quotes", format: "Wallpaper", tags: ["wallpaper", "phone", "motivation", "quote"] }, wallpaper],
  [{ id: "fx-yt-chai", name: "I Tried Every Chai In Mumbai", description: "Thumbnail energy: 9 cups, 1 YouTuber, 0 sleep.", recipe: "stadium", format: "YouTube thumbnail", tags: ["youtube", "thumbnail", "food", "chai"] }, ytThumb],
  [{ id: "fx-linkedin-tabs", name: "Thrilled To Announce (Tabs)", description: "A LinkedIn post that's honest about the tabs. Agree?", recipe: "neo", format: "LinkedIn post", tags: ["linkedin", "post", "funny", "work"] }, linkedinPost],
  [{ id: "fx-meme-pov", name: "POV Meme Template", description: "Swap the photo, keep the pain. Works for any 11 p.m. decision.", recipe: "neo", format: "Meme", tags: ["meme", "pov", "funny", "template"] }, memeTemplate],
];

export const V3_TEMPLATES: [Meta, () => KiwiwDoc][] = [...LOUD, ...COQUETTE, ...USE, ...FORMATS];
