// Juice It: one boring line in, six wildly different posters out.
// Works with no API key (built-in copy); with an OpenAI key, the copy is
// rewritten by AI first and the same deterministic layouts are applied.
import type { KiwiwDoc } from "../types";
import { keys } from "../ai/provider";
import { parseIdea, hash, type Idea } from "./parse";
import { writeCopy, STYLE_META, STYLE_ORDER, type JuiceCopy, type StyleKey } from "./copy";
import { LAYOUTS } from "./layouts";
import { ensureFonts } from "./fit";

export type { StyleKey } from "./copy";
export { STYLE_META, STYLE_ORDER } from "./copy";

export interface JuiceResult {
  style: StyleKey;
  name: string;
  vibe: string;
  copy: JuiceCopy;
  doc: KiwiwDoc;
}

export const DEFAULT_IDEA = "bake sale saturday 10am";

export const EXAMPLE_IDEAS = [
  "bake sale saturday 10am",
  "chai stall opening friday 6pm",
  "diwali sale 40% off",
  "we're hiring designers",
  "garage gig 30 nov at sharma's garage",
];

/** Fonts the layouts measure with; load before juicing for exact fits. */
export const JUICE_FONTS = [
  '400 100px "Anton"', '400 100px "Archivo Black"', '700 100px "Space Mono"', '400 100px "Space Mono"',
  '400 100px "Instrument Serif"', 'italic 400 100px "Instrument Serif"', '400 100px "Rubik Mono One"',
  '400 100px "Permanent Marker"', '700 100px "Caveat Variable"', '800 100px "Baloo 2 Variable"',
  '800 100px "Mukta"', '600 100px "Mukta"', '400 100px "Tiro Devanagari Hindi"', '300 100px "Fraunces Variable"',
  'italic 300 100px "Fraunces Variable"', '200 100px "Fraunces Variable"', '400 100px "Gochi Hand"',
];

type Overrides = Partial<Record<StyleKey, Partial<JuiceCopy>>>;

export function juice(text: string, variant = 0, overrides?: Overrides): JuiceResult[] {
  const idea: Idea = parseIdea(text.trim() || DEFAULT_IDEA);
  const seed = hash(idea.raw.toLowerCase()) + variant * 13;
  return STYLE_ORDER.map((style) => {
    const copy = { ...writeCopy(style, idea, seed), ...(overrides?.[style] ?? {}) };
    return { style, ...STYLE_META[style], copy, doc: LAYOUTS[style](copy, idea, seed) };
  });
}

export async function juiceWithAI(text: string, variant = 0): Promise<{ results: JuiceResult[]; ai: boolean }> {
  await ensureFonts(JUICE_FONTS);
  if (!keys.openai) return { results: juice(text, variant), ai: false };
  try {
    return { results: juice(text, variant, await aiCopy(text)), ai: true };
  } catch {
    return { results: juice(text, variant), ai: false };
  }
}

async function aiCopy(text: string): Promise<Overrides> {
  const sys = `You write poster copy. Given a plain event/announcement line, return JSON with keys
calm, sunday, block, filmi, zine, brainrot. Each value: {"headline": <=4 words, "sub": <=9 words}.
Tone: calm=quiet luxury, sunday=editorial magazine, block=loud brutalist, filmi=Bollywood poster
in Hinglish, zine=handmade punk, brainrot=Gen-Z meme. Keep facts (dates, times, places) out of headlines.`;
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${keys.openai}` },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      temperature: 0.9,
      messages: [{ role: "system", content: sys }, { role: "user", content: text }],
    }),
  });
  if (!res.ok) throw new Error(`AI ${res.status}`);
  const data = await res.json();
  const parsed = JSON.parse(data.choices?.[0]?.message?.content ?? "{}") as Overrides;
  return parsed;
}
