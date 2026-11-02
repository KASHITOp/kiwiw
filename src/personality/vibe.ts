// The Vibe slider (DESIGN.md §13): Corporate ⇄ Unhinged.
// A pure function of the original design, so moving back to Neutral is exact.
import type { Element, KiwiwDoc, TextElement, StickerElement } from "../types";
import { rng } from "../brand/kiwi";
import { STICKER_MAP } from "../stickers/library";
import { nearestWeight } from "../fonts/kit";
import { fitText } from "../juice/fit";

export const VIBES = ["Corporate", "Polished", "Neutral", "Spicy", "Unhinged"] as const;
export type VibeName = (typeof VIBES)[number];
export const vibeName = (v: number): VibeName => VIBES[Math.min(4, Math.floor(v / 20.0001))];

const cap = (s: string) => s.replace(/\S+/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase());
const strip = (s: string) => s.replace(/[.!?,]+$/g, "").replace(/\s+/g, " ").trim();

/** Prewritten tone lines. {x} is the original headline. All original copy. */
const TONE: Record<Exclude<VibeName, "Neutral">, string[]> = {
  Corporate: [
    "{X}: A Strategic Update",
    "Q3 Alignment Session: {X}",
    "Leveraging {X} for Stakeholder Value",
    "Per My Last Email: {X}",
  ],
  Polished: ["{X}", "Introducing {X}", "{X}, Considered"],
  Spicy: ["{X}!!", "{X}. Obviously.", "Yes, {X}.", "{X} (you're welcome)"],
  Unhinged: [
    "{XX} OR PERISH",
    "BREAKING: {XX}",
    "{xx} (this is not a cult)",
    "{XX}!!! NO FURTHER QUESTIONS",
    "the {xx} has entered the chat",
  ],
};

const SUB_TONE: Partial<Record<VibeName, string[]>> = {
  Corporate: ["Attendance is mandatory-ish.", "Please action accordingly.", "Circling back on this."],
  Unhinged: ["no thoughts. only this.", "tell your mum. tell your landlord.", "we are not ok (in a good way)"],
};

const fill = (pattern: string, x: string) =>
  pattern.replace("{XX}", x.toUpperCase()).replace("{xx}", x.toLowerCase()).replace("{X}", cap(x));

const HEAD_FONT: Partial<Record<VibeName, { family: string; weight: number; upper?: boolean }[]>> = {
  Corporate: [{ family: "Inter", weight: 600 }],
  Polished: [{ family: "Fraunces Variable", weight: 400 }, { family: "Instrument Serif", weight: 400 }],
  Spicy: [{ family: "Archivo Black", weight: 400 }, { family: "Bricolage Grotesque Variable", weight: 800 }],
  Unhinged: [{ family: "Permanent Marker", weight: 400 }, { family: "Rubik Mono One", weight: 400, upper: true }, { family: "Anton", weight: 400, upper: true }],
};

const CHAOS_STICKERS = ["burst-12", "burst-spiky", "arrow-swoop", "scribble-star", "burst-sparkle", "bubble-shout", "scribble-circle", "arrow-loop"];
const LOUD_KINDS = new Set(["Bursts", "Scribbles", "Arrows", "Bubbles"]);

/** Which text is the headline: explicit role, else the biggest type. */
function roles(doc: KiwiwDoc) {
  const texts = doc.elements.filter((e): e is TextElement => e.type === "text" && !!e.text.trim());
  const byArea = [...texts].sort((a, b) => b.fontSize - a.fontSize);
  const head = texts.find((t) => t.role === "headline") ?? byArea[0];
  const sub = texts.find((t) => t.role === "sub" && t !== head) ?? byArea.find((t) => t !== head && t.fontSize < (head?.fontSize ?? 0) * 0.6 && t.text.length > 8);
  return { head, sub };
}

/** New copy, same box: measure the real font and shrink until it fits. */
function refit(t: TextElement, maxH: number) {
  if (typeof document === "undefined") return;
  const f = fitText(t.text, {
    family: t.fontFamily, weight: t.fontWeight, italic: t.italic, uppercase: t.uppercase,
    maxW: t.w, maxH, maxSize: t.fontSize, minSize: 12, lineHeight: t.lineHeight,
    trackingEm: t.letterSpacing / Math.max(1, t.fontSize), maxLines: 4,
  });
  t.fontSize = f.size;
  t.text = f.text;
}

/** Fonts the slider can switch to, so they're loaded before we measure. */
export const VIBE_FONTS = Object.values(HEAD_FONT).flat().map((f) => `${f.weight} 40px "${f.family}"`);

export function applyVibe(base: KiwiwDoc, vibe: number, seed = 7): KiwiwDoc {
  const name = vibeName(vibe);
  if (name === "Neutral") return base;
  const r = rng(seed + Math.round(vibe));
  const pick = <T,>(a: T[]) => a[Math.floor(r() * a.length)];
  const { head, sub } = roles(base);
  const chaos = Math.max(0, vibe - 50) * 0.24; // up to ±12°
  const tidy = vibe < 40;

  const headPattern = pick(TONE[name]);
  const headFont = HEAD_FONT[name] ? pick(HEAD_FONT[name]!) : undefined;
  const subLine = SUB_TONE[name] ? pick(SUB_TONE[name]!) : undefined;

  let els: Element[] = base.elements.map((el): Element => {
    let next: Element = { ...el };
    // rotation: corporate straightens everything, unhinged tilts it
    if (tidy) next.rotation = Math.abs(el.rotation) < 15 ? 0 : el.rotation;
    else if (chaos) next.rotation = el.rotation + (r() - 0.5) * 2 * chaos;
    if (el.type === "text" && el === head) {
      const t = next as TextElement;
      t.text = fill(headPattern, strip(el.text));
      if (headFont) {
        t.fontFamily = headFont.family;
        t.fontWeight = nearestWeight(headFont.family, headFont.weight);
        t.uppercase = headFont.upper ?? (name === "Corporate" ? false : el.uppercase);
        t.lineHeight = Math.max(el.lineHeight, 1.02); // new face, new ascenders: no more crushed lines
      }
      refit(t, el.h * 0.96);
    }
    if (el.type === "text" && el === sub && subLine) { (next as TextElement).text = subLine; refit(next as TextElement, el.h * 1.05); }
    // sticker density: corporate fades the loud stickers out
    if (el.type === "sticker" && tidy && LOUD_KINDS.has(STICKER_MAP[el.kind]?.category ?? "")) next = { ...next, opacity: vibe < 20 ? 0 : el.opacity * 0.35 };
    return next;
  });

  // unhinged: add chaos stickers around the edges
  const extra = Math.max(0, Math.round((vibe - 55) / 9));
  const S = Math.min(base.width, base.height);
  for (let i = 0; i < extra; i++) {
    const kind = CHAOS_STICKERS[(i + seed) % CHAOS_STICKERS.length];
    const def = STICKER_MAP[kind];
    const size = S * (0.14 + r() * 0.08);
    const h = (size * def.vb[1]) / def.vb[0];
    const edge = i % 4;
    const x = edge === 1 ? base.width - size - S * 0.03 : edge === 3 ? S * 0.03 : r() * (base.width - size);
    const y = edge === 0 ? S * 0.03 : edge === 2 ? base.height - h - S * 0.03 : r() * (base.height - h);
    const st: StickerElement = {
      id: `vibe-${i}`, type: "sticker", kind, name: `Chaos ${def.name}`, x, y, w: size, h, rotation: (r() - 0.5) * 50, opacity: 1,
      fill: pick(["#FF3FA4", "#D8F27A", "#FF3B1F", "#FFE14D"]), accent: "#FFFFFF", ink: "#0B0B0B",
    };
    els = [...els, st];
  }
  return { ...base, elements: els };
}
