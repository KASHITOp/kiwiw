// Magic tools v3 (DESIGN.md §19). Each asks /api/kiwi-ai (Gemini, server-side
// key) and silently falls back to a built-in version, so nothing ever blocks.
import type { Element, KiwiwDoc, TextElement } from "../types";
import { fitText } from "../juice/fit";

async function ask<T>(task: string, payload: Record<string, unknown>, ms = 14000): Promise<T | null> {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), ms);
    const r = await fetch("/api/kiwi-ai", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ task, ...payload }), signal: ctrl.signal });
    clearTimeout(t);
    if (r.status !== 200) return null;
    return (await r.json()) as T;
  } catch { return null; }
}

/* ------------------------------ Magic Write tones ------------------------------ */

export type Tone = "corporate" | "unhinged" | "hinglish" | "genz" | "uncle" | "shark";
export const TONES: { id: Tone; label: string; joke: string }[] = [
  { id: "corporate", label: "Corporate", joke: "per my last poster" },
  { id: "unhinged", label: "Unhinged", joke: "no indoor voice" },
  { id: "hinglish", label: "Hinglish", joke: "thoda desi, thoda English" },
  { id: "genz", label: "Gen-Z", joke: "it's giving copywriter" },
  { id: "uncle", label: "Desi Uncle", joke: "beta, in my time…" },
  { id: "shark", label: "Shark Tank", joke: "₹50 lakh for 5%" },
];

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const trimEnd = (s: string) => s.trim().replace(/[.!?]+$/, "");
const HING: [RegExp, string][] = [[/\bvery\b/gi, "bahut"], [/\bfriends?\b/gi, "yaar log"], [/\bcome\b/gi, "aao"], [/\bnow\b/gi, "abhi"], [/\bfood\b/gi, "khana"], [/\btea\b/gi, "chai"], [/\bgood\b/gi, "mast"], [/\bfun\b/gi, "maza"], [/\beveryone\b/gi, "sab log"], [/\bdon'?t\b/gi, "mat"]];

export function builtinTone(text: string, tone: Tone): string {
  const t = trimEnd(text);
  switch (tone) {
    case "corporate": return `Per my last email: ${t.toLowerCase()}. Let's align on this.`;
    case "unhinged": return `${t.toUpperCase()}!!! NO NOTES. ONLY SCREAMS.`;
    case "hinglish": { let s = t; for (const [re, w] of HING) s = s.replace(re, w); return `${cap(s)}, yaar. Aa jao!`; }
    case "genz": return `${t.toLowerCase()}. no cap, it's giving main character.`;
    case "uncle": return `Beta, ${t.toLowerCase()}. In my time we walked 5 km for this.`;
    case "shark": return `${cap(t)}. Asking ₹50 lakh for 5%. The vibes are pre-revenue.`;
  }
}

/** Rewrite in a tone, length-aware: the new text is refitted to its box. */
export async function rewriteTone(el: TextElement, tone: Tone): Promise<{ patch: Partial<TextElement>; ai: boolean }> {
  const words = el.text.split(/\s+/).length;
  const maxWords = Math.max(3, Math.round(words * 1.6) + 2);
  const r = await ask<{ text?: string }>("tone", { text: el.text, tone, maxWords });
  const text = (r?.text?.trim() || builtinTone(el.text, tone)).split(/\s+/).slice(0, maxWords + 4).join(" ");
  return { patch: { text, ...refit(el, text, el.fontFamily) }, ai: !!r?.text };
}

/** Keep new copy inside the element's box: shrink (never grow past the old size). */
function refit(el: TextElement, text: string, family: string): Partial<TextElement> {
  const f = fitText(el.uppercase ? text.toUpperCase() : text, { family, maxW: el.w, maxH: el.h, maxSize: el.fontSize, minSize: Math.max(10, el.fontSize * 0.35), lineHeight: el.lineHeight, maxLines: 6, weight: el.fontWeight, italic: el.italic });
  return { fontSize: f.size };
}

/* ------------------------------ Translate ------------------------------ */

export type Lang = "hi" | "gu" | "hinglish";
export const LANGS: { id: Lang; label: string; font?: string; bold?: string }[] = [
  { id: "hi", label: "हिंदी", font: "Tiro Devanagari Hindi", bold: "Rozha One" },
  { id: "gu", label: "ગુજરાતી", font: "Mukta Vaani", bold: "Mukta Vaani" },
  { id: "hinglish", label: "Hinglish" },
];
// tiny offline phrasebook for the most common poster words (used only when AI is away)
const PHRASES: Record<"hi" | "gu", Record<string, string>> = {
  hi: { sale: "सेल", chai: "चाय", tea: "चाय", party: "पार्टी", welcome: "स्वागत है", today: "आज", tomorrow: "कल", love: "प्यार", "happy birthday": "जन्मदिन मुबारक", wedding: "शादी", new: "नया", offer: "ऑफ़र", free: "मुफ़्त", sweet: "मीठा", food: "खाना", come: "आइए", everyone: "सब", friends: "दोस्त", music: "संगीत", night: "रात", festival: "त्योहार", "good morning": "सुप्रभात" },
  gu: { sale: "સેલ", chai: "ચા", tea: "ચા", party: "પાર્ટી", welcome: "સ્વાગત છે", today: "આજે", tomorrow: "કાલે", love: "પ્રેમ", "happy birthday": "જન્મદિવસની શુભેચ્છા", wedding: "લગ્ન", new: "નવું", offer: "ઓફર", free: "મફત", sweet: "મીઠું", food: "જમવાનું", come: "આવો", everyone: "બધા", friends: "મિત્રો", music: "સંગીત", night: "રાત", festival: "તહેવાર", "good morning": "સુપ્રભાત" },
};
function builtinTranslate(text: string, to: Lang): string | null {
  if (to === "hinglish") return builtinTone(text, "hinglish");
  const dict = PHRASES[to];
  let s = ` ${text.toLowerCase()} `, hits = 0;
  for (const k of Object.keys(dict).sort((a, b) => b.length - a.length)) {
    const re = new RegExp(`\\b${k}\\b`, "g");
    if (re.test(s)) { hits++; s = s.replace(re, dict[k]); }
  }
  const words = text.split(/\s+/).length;
  return hits && hits >= Math.ceil(words / 3) ? s.trim() : null;
}

/** Translate and switch to a font that has the script. */
export async function translate(el: TextElement, to: Lang): Promise<{ patch: Partial<TextElement>; ai: boolean } | null> {
  const r = await ask<{ text?: string }>("translate", { text: el.text, to });
  const text = r?.text?.trim() || builtinTranslate(el.text, to);
  if (!text) return null;
  const L = LANGS.find((l) => l.id === to)!;
  const family = L.font ? (el.fontWeight >= 700 || el.role === "headline" ? L.bold! : L.font) : el.fontFamily;
  if (typeof document !== "undefined") await document.fonts.load(`400 40px "${family}"`, text).catch(() => []);
  return { patch: { text, fontFamily: family, uppercase: L.font ? false : el.uppercase, fontWeight: L.font ? (family === "Mukta Vaani" ? 800 : 400) : el.fontWeight, ...refit({ ...el, uppercase: false }, text, family) }, ai: !!r?.text };
}

/* ------------------------------ Caption writer ------------------------------ */

export interface Captions { instagram: string; linkedin: string; hashtags: string[] }
const docText = (d: KiwiwDoc) => d.elements.filter((e): e is TextElement => e.type === "text").sort((a, b) => b.fontSize - a.fontSize).map((e) => e.text.replace(/\s+/g, " ")).slice(0, 4).join(" · ");

export async function writeCaptions(doc: KiwiwDoc, style = ""): Promise<{ captions: Captions; ai: boolean }> {
  const text = docText(doc) || "a fresh design";
  const r = await ask<Captions>("caption", { text, style });
  if (r?.instagram && r.linkedin) return { captions: { instagram: r.instagram, linkedin: r.linkedin, hashtags: (r.hashtags ?? []).map((h) => h.replace(/^#/, "")) }, ai: true };
  const head = text.split(" · ")[0];
  const tags = Array.from(new Set(head.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/).filter((w) => w.length > 2))).slice(0, 4);
  return {
    ai: false,
    captions: {
      instagram: `${head} ✦ save this, send it to the group chat, act surprised later.\nmade in 30 seconds, judged for 30 minutes.`,
      linkedin: `Excited to share: ${head}.\nIt started as a plain line and ended up as a poster with opinions.\nAgree? (Please say agree.)`,
      hashtags: [...tags, "kiwiw", "design", "desidesign", "posterdesign"].slice(0, 8),
    },
  };
}

/* ------------------------------ Palette from vibe ------------------------------ */

export interface Palette { name: string; colors: string[] }
const VIBES: [RegExp, Palette][] = [
  [/monsoon|rain|mumbai/i, { name: "Monsoon Local", colors: ["#2E3B4E", "#F2F4F0", "#F6C445", "#5FA8A0", "#E85D3F"] }],
  [/diwali|diya|festive/i, { name: "Diya Hour", colors: ["#2A0F2E", "#FFE58A", "#F6A21E", "#D7261E", "#FF6FAE"] }],
  [/holi|colour|color/i, { name: "Gulaal Gang", colors: ["#FFF4DE", "#7B2CBF", "#FF4FA3", "#FFD400", "#22A559"] }],
  [/goa|beach|sea|ocean/i, { name: "Susegad Sunset", colors: ["#FFE8C7", "#0F4C5C", "#FF7A59", "#2EC4B6", "#FFD166"] }],
  [/chai|tea|tapri/i, { name: "Cutting Chai", colors: ["#F4E6D0", "#3A2410", "#B5542A", "#D9A066", "#0F7A3C"] }],
  [/neon|night|club|rave/i, { name: "Bass Drop", colors: ["#0B0B1A", "#F2F5E6", "#39FF14", "#FF2BD6", "#2BD9FF"] }],
  [/forest|green|garden|plant/i, { name: "Botanical Flex", colors: ["#EEF2E6", "#1F3D2B", "#7FB069", "#E6AA68", "#CA3C25"] }],
  [/love|valentine|romance|rose/i, { name: "Cherry Bomb", colors: ["#FBEEDC", "#C8102E", "#FF8FB1", "#2A0A12", "#FFD6E0"] }],
  [/winter|snow|cold|mountain/i, { name: "Manali Morning", colors: ["#EEF4FA", "#1B2A41", "#7FA7C9", "#F4D35E", "#C2185B"] }],
  [/desert|rajasthan|jaipur|sand/i, { name: "Pink City", colors: ["#F6E3D4", "#5B1A18", "#E07A5F", "#F2CC8F", "#3D405B"] }],
];
function hashPalette(s: string): Palette {
  let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) % 360;
  const hsl = (H: number, S: number, L: number) => {
    const a = (S / 100) * Math.min(L / 100, 1 - L / 100), f = (n: number) => { const k = (n + H / 30) % 12; return Math.round(255 * (L / 100 - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)))).toString(16).padStart(2, "0"); };
    return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
  };
  return { name: "Custom Mood", colors: [hsl(h, 40, 94), hsl(h, 60, 16), hsl((h + 150) % 360, 85, 55), hsl((h + 40) % 360, 80, 62), hsl((h + 200) % 360, 70, 45)] };
}
export async function paletteFor(vibe: string): Promise<{ palette: Palette; ai: boolean }> {
  const r = await ask<Palette>("palette", { text: vibe });
  if (r?.colors?.length === 5 && r.colors.every((c) => /^#[0-9a-f]{6}$/i.test(c))) return { palette: r, ai: true };
  return { palette: VIBES.find(([re]) => re.test(vibe))?.[1] ?? hashPalette(vibe.toLowerCase()), ai: false };
}

const lum = (h: string) => { const n = parseInt(h.slice(1), 16); return (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255; };
/** Recolour a design: background, text and shapes take palette roles by their job. */
export function applyPalette(doc: KiwiwDoc, p: Palette): KiwiwDoc {
  const [bg, ink, a1, a2, a3] = p.colors;
  const accents = [a1, a2, a3];
  let k = 0;
  const elements = doc.elements.map((e): Element => {
    if (e.type === "text") {
      const big = e.role === "headline" || e.fontSize > doc.width * 0.07;
      return { ...e, color: big ? (lum(a1) > 0.5 === lum(bg) > 0.5 ? ink : a1) : ink, ...(e.outline ? { outline: { ...e.outline, color: bg } } : {}), ...(e.shadow ? { shadow: { ...e.shadow, color: a2 } } : {}) };
    }
    if (e.type === "shape") return { ...e, fill: e.w * e.h > doc.width * doc.height * 0.6 ? bg : accents[k++ % 3] };
    if (e.type === "sticker") return e.kind.startsWith("bg-") ? { ...e, fill: a1, accent: bg } : { ...e, fill: accents[k++ % 3], accent: accents[k % 3], ink };
    return e;
  });
  return { ...doc, background: bg, elements };
}

/* ------------------------------ Roast v2 ------------------------------ */

export function designSummary(doc: KiwiwDoc): string {
  const els = doc.elements.map((e) => e.type === "text" ? `text "${e.text.slice(0, 50)}" in ${e.fontFamily} ${Math.round(e.fontSize)}px ${e.color}` : e.type === "sticker" ? `sticker ${e.kind}` : e.type === "image" ? "photo" : `${e.type} ${(e as { fill?: string }).fill ?? ""}`);
  return `${doc.width}x${doc.height}, background ${doc.background}, ${doc.elements.length} elements: ${els.join("; ")}`;
}
export async function aiRoasts(doc: KiwiwDoc): Promise<string[] | null> {
  const r = await ask<{ roasts?: string[] }>("roast", { summary: designSummary(doc) }, 18000);
  return r?.roasts?.filter((x) => typeof x === "string" && x.trim()).slice(0, 3) ?? null;
}
