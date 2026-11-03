// Juice It 2.0: one boring line in, six posters from six different Style DNA
// recipes out (STYLE_DNA.md). A session remembers every recipe+layout combo it
// has shown, so Re-juice always brings a new composition: different recipe,
// layout grammar, photo and copy angle. No API key needed; with an OpenAI key
// the copy is rewritten in each recipe's tone first.
import type { KiwiwDoc } from "../types";
import { keys } from "../ai/provider";
import { parseIdea, hash } from "./parse";
import { RECIPES, RECIPE_ORDER, writeCopy, type Copy, type RecipeKey } from "../dna/recipes";
import { LAYOUTS, DNA_FONTS } from "../dna/layouts";
import { photoFor } from "../data/photos";

export type { RecipeKey } from "../dna/recipes";
export { RECIPES, RECIPE_ORDER } from "../dna/recipes";

export interface JuiceResult {
  /** Recipe key (kept as `style` for older callers). */
  style: RecipeKey;
  name: string;
  vibe: string;
  joke: string;
  layout: number;
  copy: Copy;
  doc: KiwiwDoc;
}

export const DEFAULT_IDEA = "bake sale saturday 10am";

export const EXAMPLE_IDEAS = [
  "bake sale saturday 10am",
  "chai tapri opening sunday",
  "diwali sale 40% off",
  "hiring designers",
  "college fest friday 6pm",
];

export interface JuiceSession {
  text: string;
  used: Set<string>;
  shown: number;
  angle: Partial<Record<RecipeKey, number>>;
  batch: number;
  ai?: Partial<Record<RecipeKey, { head?: string; sub?: string }>>;
}

export const newSession = (text: string): JuiceSession => ({ text, used: new Set(), shown: 0, angle: {}, batch: 0 });

const combos = (r: RecipeKey) => LAYOUTS[r].length;
const usedFor = (s: JuiceSession, r: RecipeKey) => LAYOUTS[r].filter((_, i) => s.used.has(`${r}:${i}`)).length;

function nextLayout(s: JuiceSession, r: RecipeKey): number {
  if (usedFor(s, r) >= combos(r)) for (let i = 0; i < combos(r); i++) s.used.delete(`${r}:${i}`);
  // start from a seeded spot so different lines open with different grammars
  const start = hash(s.text.toLowerCase() + r) % combos(r);
  for (let k = 0; k < combos(r); k++) {
    const i = (start + k) % combos(r);
    if (!s.used.has(`${r}:${i}`)) { s.used.add(`${r}:${i}`); return i; }
  }
  return start;
}

function build(s: JuiceSession, r: RecipeKey, layout = nextLayout(s, r)): JuiceResult {
  const idea = parseIdea(s.text.trim() || DEFAULT_IDEA);
  const angle = s.angle[r] ?? hash(idea.raw + r) % 3;
  s.angle[r] = angle + 1;
  const n = s.shown++;
  const copy = { ...writeCopy(r, idea, angle), ...(s.ai?.[r] ?? {}) };
  const seed = hash(idea.raw) + n * 7;
  const doc = LAYOUTS[r][layout]({ c: copy, photo: photoFor(idea.raw, n + hash(idea.raw)), photo2: photoFor(idea.raw, n + hash(idea.raw) + 1), seed });
  const meta = RECIPES[r];
  return { style: r, name: meta.name, vibe: meta.vibe, joke: meta.jokes[(angle + layout) % meta.jokes.length], layout, copy, doc };
}

/** Six results from six different recipes, preferring the least-shown ones. */
export function juiceBatch(s: JuiceSession): JuiceResult[] {
  // the default line opens with the curated six; any other line rotates the deck
  const rot = (s.batch * 6 + (s.text.trim().toLowerCase() === DEFAULT_IDEA ? 0 : hash(s.text.toLowerCase()))) % RECIPE_ORDER.length;
  const order = [...RECIPE_ORDER.slice(rot), ...RECIPE_ORDER.slice(0, rot)];
  const pick = [...order].sort((a, b) => usedFor(s, a) - usedFor(s, b)).slice(0, 6);
  s.batch++;
  return order.filter((r) => pick.includes(r)).map((r) => build(s, r));
}

/** Replace one card with a recipe that isn't on screen yet. */
export function rejuiceOne(s: JuiceSession, onScreen: RecipeKey[]): JuiceResult {
  const free = RECIPE_ORDER.filter((r) => !onScreen.includes(r));
  const r = [...free].sort((a, b) => usedFor(s, a) - usedFor(s, b))[0] ?? onScreen[0];
  return build(s, r);
}

/** Same recipe, new layout grammar, new photo and copy angle. */
export function moreLikeThis(s: JuiceSession, r: RecipeKey): JuiceResult {
  return build(s, r);
}

/** Synchronous, deterministic batch (the landing hero preview). */
export function juice(text: string, variant = 0): JuiceResult[] {
  const s = newSession(text);
  let out = juiceBatch(s);
  for (let v = 0; v < variant; v++) out = juiceBatch(s);
  return out;
}

export async function ensureJuiceFonts() {
  if (typeof document === "undefined" || !document.fonts) return;
  await Promise.all(DNA_FONTS.map(([spec, text]) => document.fonts.load(spec, text).catch(() => [])));
}

/** Async entry: loads fonts, optionally asks AI for copy, then juices. */
export async function juiceWithAI(text: string, variant = 0, session?: JuiceSession): Promise<{ results: JuiceResult[]; ai: boolean; session: JuiceSession }> {
  await ensureJuiceFonts();
  const s = session ?? newSession(text);
  let ai = false;
  if (keys.openai && !s.ai) {
    try { s.ai = await aiCopy(text); ai = true; } catch { /* the built-in copy is funny enough */ }
  }
  if (!session) for (let v = 0; v < variant; v++) juiceBatch(s);
  return { results: juiceBatch(s), ai, session: s };
}

async function aiCopy(text: string): Promise<JuiceSession["ai"]> {
  const tones = RECIPE_ORDER.map((r) => `${r}=${RECIPES[r].name} (${RECIPES[r].vibe})`).join(", ");
  const sys = `You write poster copy. Given a plain event/announcement line, return JSON with keys ${RECIPE_ORDER.join(", ")}.
Each value: {"head": <=5 words, "sub": <=9 words}. Tones: ${tones}. nazar and tapri heads must be in Hindi (Devanagari),
subs in Hinglish. Witty, never mean. No real brands, people or characters. Keep dates/times/places out of heads.`;
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${keys.openai}` },
    body: JSON.stringify({ model: "gpt-4o-mini", response_format: { type: "json_object" }, temperature: 0.9, messages: [{ role: "system", content: sys }, { role: "user", content: text }] }),
  });
  if (!res.ok) throw new Error(`AI ${res.status}`);
  const data = await res.json();
  return JSON.parse(data.choices?.[0]?.message?.content ?? "{}");
}

/** Back-compat for callers that preload fonts by spec list. */
export const JUICE_FONTS = DNA_FONTS.map(([spec]) => spec);
