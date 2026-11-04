// The content type kit (DESIGN.md §10). Google Fonts, self-hosted via
// Fontsource so exports embed them. Grouped by mood for the picker.
import "@fontsource/anton/400.css";
import "@fontsource/archivo-black/400.css";
import "@fontsource-variable/unbounded/wght.css";
import "@fontsource-variable/syne/wght.css";
import "@fontsource/rubik-mono-one/400.css";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "@fontsource-variable/fraunces/opsz.css";
import "@fontsource-variable/fraunces/opsz-italic.css";
import "@fontsource/dm-serif-display/400.css";
import "@fontsource/dm-serif-display/400-italic.css";
import "@fontsource-variable/caveat/wght.css";
import "@fontsource/permanent-marker/400.css";
import "@fontsource/gochi-hand/400.css";
import "@fontsource-variable/baloo-2/wght.css";
import "@fontsource/mukta/400.css";
import "@fontsource/mukta/600.css";
import "@fontsource/mukta/700.css";
import "@fontsource/mukta/800.css";
import "@fontsource/tiro-devanagari-hindi/400.css";
import "@fontsource/tiro-devanagari-hindi/400-italic.css";
import "@fontsource/space-mono/400.css";
import "@fontsource/space-mono/700.css";
import "@fontsource/space-mono/400-italic.css";
import "@fontsource/jetbrains-mono/700.css";
import "@fontsource/jetbrains-mono/800.css";
import "@fontsource/rozha-one/400.css";
import "@fontsource/yatra-one/400.css";
import "@fontsource/khand/500.css";
import "@fontsource/khand/600.css";
import "@fontsource/khand/700.css";
import "@fontsource/press-start-2p/400.css";
import "@fontsource/shrikhand/400.css";
import "@fontsource/bagel-fat-one/400.css";
// v3: Loud Quotes, scrapbook script, Gujarati, UI chrome
import "@fontsource/rubik-wet-paint/400.css";
import "@fontsource/rubik-glitch/400.css";
import "@fontsource/bowlby-one/400.css";
import "@fontsource-variable/climate-crisis";
import "@fontsource-variable/big-shoulders-display/wght";
import "@fontsource-variable/playfair-display/wght";
import "@fontsource-variable/playfair-display/wght-italic";
import "@fontsource/caprasimo/400.css";
import "@fontsource/gloock/400.css";
import "@fontsource/kalam/400.css";
import "@fontsource/kalam/700.css";
import "@fontsource/great-vibes/400.css";
import "@fontsource-variable/inter-tight/wght";
import "@fontsource/mukta-vaani/600.css";
import "@fontsource/mukta-vaani/800.css";

export type FontGroup = "Display" | "Serif" | "Hand" | "Desi" | "Mono" | "Clean";

export interface FontDef {
  family: string;
  label: string;
  group: FontGroup;
  weights: number[];
  defaultWeight: number;
  italic?: boolean;
  sample: string;
  /** Picks this and the kiwi mascot has opinions. */
  comicEnergy?: boolean;
}

export const GROUP_LABEL: Record<FontGroup, string> = {
  Display: "Display · loud",
  Serif: "Serif · fancy",
  Hand: "Hand · human",
  Desi: "Desi · apna",
  Mono: "Mono · nerdy",
  Clean: "Clean · plain",
};

const range = (a: number, b: number) => Array.from({ length: (b - a) / 100 + 1 }, (_, i) => a + i * 100);

export const FONT_KIT: FontDef[] = [
  { family: "Bricolage Grotesque Variable", label: "Bricolage Grotesque", group: "Display", weights: range(200, 800), defaultWeight: 800, sample: "Juicy design" },
  { family: "Anton", label: "Anton", group: "Display", weights: [400], defaultWeight: 400, sample: "LOUD NOISES" },
  { family: "Archivo Black", label: "Archivo Black", group: "Display", weights: [400], defaultWeight: 400, sample: "Big Energy" },
  { family: "Unbounded Variable", label: "Unbounded", group: "Display", weights: range(200, 900), defaultWeight: 800, sample: "Space Age" },
  { family: "Syne Variable", label: "Syne", group: "Display", weights: range(400, 800), defaultWeight: 800, sample: "Gallery Night" },
  { family: "Rubik Mono One", label: "Rubik Mono One", group: "Display", weights: [400], defaultWeight: 400, sample: "ARCADE" },
  { family: "Bagel Fat One", label: "Bagel Fat One", group: "Display", weights: [400], defaultWeight: 400, sample: "Glossy Bloom" },
  { family: "Shrikhand", label: "Shrikhand", group: "Display", weights: [400], defaultWeight: 400, sample: "Groovy, baby" },
  { family: "Press Start 2P", label: "Press Start 2P", group: "Display", weights: [400], defaultWeight: 400, sample: "LEVEL 01" },
  { family: "Bowlby One", label: "Bowlby One", group: "Display", weights: [400], defaultWeight: 400, sample: "FAT CHANCE" },
  { family: "Climate Crisis Variable", label: "Climate Crisis", group: "Display", weights: [400], defaultWeight: 400, sample: "MELTING" },
  { family: "Big Shoulders Display Variable", label: "Big Shoulders Display", group: "Display", weights: range(100, 900), defaultWeight: 900, sample: "STACKED CAPS" },
  { family: "Caprasimo", label: "Caprasimo", group: "Display", weights: [400], defaultWeight: 400, sample: "Groovy Sunday" },
  { family: "Rubik Wet Paint", label: "Rubik Wet Paint", group: "Display", weights: [400], defaultWeight: 400, sample: "DRIP DRIP" },
  { family: "Rubik Glitch", label: "Rubik Glitch", group: "Display", weights: [400], defaultWeight: 400, sample: "ERROR 404" },
  { family: "Instrument Serif", label: "Instrument Serif", group: "Serif", weights: [400], defaultWeight: 400, italic: true, sample: "A quiet headline" },
  { family: "Fraunces Variable", label: "Fraunces", group: "Serif", weights: range(100, 900), defaultWeight: 400, italic: true, sample: "Fancy, but fun" },
  { family: "DM Serif Display", label: "DM Serif Display", group: "Serif", weights: [400], defaultWeight: 400, italic: true, sample: "The Sunday Issue" },
  { family: "Playfair Display Variable", label: "Playfair Display", group: "Serif", weights: range(400, 900), defaultWeight: 700, italic: true, sample: "Darling, no." },
  { family: "Gloock", label: "Gloock", group: "Serif", weights: [400], defaultWeight: 400, sample: "Old Money" },
  { family: "Great Vibes", label: "Great Vibes", group: "Hand", weights: [400], defaultWeight: 400, sample: "favorite person" },
  { family: "Kalam", label: "Kalam", group: "Hand", weights: [400, 700], defaultWeight: 700, sample: "चाय पहले" },
  { family: "Caveat Variable", label: "Caveat", group: "Hand", weights: range(400, 700), defaultWeight: 600, sample: "note to self" },
  { family: "Permanent Marker", label: "Permanent Marker", group: "Hand", weights: [400], defaultWeight: 400, sample: "FRESH PAINT" },
  { family: "Gochi Hand", label: "Gochi Hand", group: "Hand", weights: [400], defaultWeight: 400, sample: "lol ok", comicEnergy: true },
  { family: "Baloo 2 Variable", label: "Baloo 2", group: "Desi", weights: range(400, 800), defaultWeight: 800, sample: "धमाका Sale!" },
  { family: "Mukta", label: "Mukta", group: "Desi", weights: [400, 600, 700, 800], defaultWeight: 700, sample: "चाय पे चर्चा" },
  { family: "Rozha One", label: "Rozha One", group: "Desi", weights: [400], defaultWeight: 400, sample: "बुरी नज़र" },
  { family: "Yatra One", label: "Yatra One", group: "Desi", weights: [400], defaultWeight: 400, sample: "चाय टपरी" },
  { family: "Khand", label: "Khand", group: "Desi", weights: [500, 600, 700], defaultWeight: 700, sample: "धमाकेदार SALE" },
  { family: "Tiro Devanagari Hindi", label: "Tiro Devanagari Hindi", group: "Desi", weights: [400], defaultWeight: 400, italic: true, sample: "शुभ दीपावली" },
  { family: "Mukta Vaani", label: "Mukta Vaani (ગુજરાતી)", group: "Desi", weights: [600, 800], defaultWeight: 800, sample: "કેમ છો?" },
  { family: "JetBrains Mono", label: "JetBrains Mono", group: "Mono", weights: range(400, 800), defaultWeight: 600, sample: "SEEDS 072" },
  { family: "Space Mono", label: "Space Mono", group: "Mono", weights: [400, 700], defaultWeight: 700, italic: true, sample: "ISSUE 07" },
  { family: "Inter Tight Variable", label: "Inter Tight", group: "Clean", weights: range(400, 900), defaultWeight: 600, sample: "Tight and tidy" },
  { family: "Inter", label: "Inter", group: "Clean", weights: range(400, 800), defaultWeight: 600, sample: "Plain and clear" },
];

export const FONT_GROUPS: FontGroup[] = ["Display", "Serif", "Hand", "Desi", "Mono", "Clean"];

export const fontDef = (family: string): FontDef | undefined => FONT_KIT.find((f) => f.family === family);

export const fontLabel = (family: string) => fontDef(family)?.label ?? family.replace(/ Variable$/, "");

/** Closest weight the face actually ships, so the browser never fakes a bold. */
export function nearestWeight(family: string, wanted: number): number {
  const def = fontDef(family);
  if (!def) return wanted;
  return def.weights.reduce((best, w) => (Math.abs(w - wanted) < Math.abs(best - wanted) ? w : best), def.weights[0]);
}
