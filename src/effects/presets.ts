// The Effects gallery (DESIGN.md §16): every preset is a patch on the
// element, so it saves, undoes, exports and can be used by Juice It.
import type { Element, ImageElement, TextElement } from "../types";
import { nearestWeight } from "../fonts/kit";

export type FxGroup = "Image" | "Frames" | "Type" | "Devanagari" | "Finish";
export const FX_GROUPS: FxGroup[] = ["Image", "Type", "Devanagari", "Frames", "Finish"];

export interface FxPreset {
  id: string;
  label: string;
  group: FxGroup;
  applies: (el: Element) => boolean;
  on: (el: Element) => boolean;
  apply: (el: Element) => Partial<Element>;
  off: (el: Element) => Partial<Element>;
}

const img = (el: Element): el is ImageElement => el.type === "image";
const txt = (el: Element): el is TextElement => el.type === "text";
const fxOf = (el: Element) => (img(el) ? el.fx ?? {} : {});
const imgFx = (id: string, label: string, val: unknown, key: "halftone" | "duotone" | "posterize" | "bw"): FxPreset => ({
  id, label, group: "Image", applies: img,
  on: (el) => !!(fxOf(el) as Record<string, unknown>)[key],
  apply: (el) => ({ fx: { ...fxOf(el), [key]: val } }) as Partial<Element>,
  off: (el) => ({ fx: { ...fxOf(el), [key]: key === "bw" ? false : null } }) as Partial<Element>,
});
const frame = (kind: NonNullable<Element["frame"]>["kind"], label: string, extra: object = {}): FxPreset => ({
  id: `frame-${kind}`, label, group: "Frames", applies: () => true,
  on: (el) => el.frame?.kind === kind,
  apply: () => ({ frame: { kind, ...extra } }),
  off: () => ({ frame: null }),
});
const deva = (family: string, label: string): FxPreset => ({
  id: `deva-${family}`, label, group: "Devanagari", applies: txt,
  on: (el) => txt(el) && el.fontFamily === family,
  apply: (el) => ({ fontFamily: family, fontWeight: nearestWeight(family, (el as TextElement).fontWeight) }) as Partial<Element>,
  off: () => ({ fontFamily: "Anton", fontWeight: 400 }) as Partial<Element>,
});

export const FX_PRESETS: FxPreset[] = [
  imgFx("halftone", "Halftone", { dot: 12, ink: "#111111", paper: null }, "halftone"),
  imgFx("duotone", "Duotone", { dark: "#141414", light: "#D7191C" }, "duotone"),
  imgFx("posterize", "Posterize", 4, "posterize"),
  imgFx("bw", "B&W punch", true, "bw"),

  {
    id: "wave", label: "Wave", group: "Type", applies: txt,
    on: (el) => txt(el) && !!el.wave, apply: () => ({ wave: 60, curve: 0, glossy: null }) as Partial<Element>, off: () => ({ wave: 0 }) as Partial<Element>,
  },
  {
    id: "arch", label: "Arch", group: "Type", applies: txt,
    on: (el) => txt(el) && !!el.curve, apply: () => ({ curve: -55, wave: 0 }) as Partial<Element>, off: () => ({ curve: 0 }) as Partial<Element>,
  },
  {
    id: "pop", label: "Outline + shadow", group: "Type", applies: txt,
    on: (el) => txt(el) && !!el.outline && !!el.shadow,
    apply: (el) => { const f = (el as TextElement).fontSize; return { outline: { color: "#111111", width: Math.max(2, Math.round(f * 0.05)) }, shadow: { color: "#111111", x: Math.round(f * 0.07), y: Math.round(f * 0.07) }, glossy: null } as Partial<Element>; },
    off: () => ({ outline: null, shadow: null }) as Partial<Element>,
  },
  {
    id: "stack", label: "Stacked caps", group: "Type", applies: txt,
    on: (el) => txt(el) && !!el.uppercase && el.lineHeight <= 0.9 && el.text.includes("\n"),
    apply: (el) => ({ uppercase: true, fontFamily: "Anton", fontWeight: 400, lineHeight: 0.84, letterSpacing: 0, align: "left", text: (el as TextElement).text.trim().split(/\s+/).join("\n"), curve: 0 }) as Partial<Element>,
    off: (el) => ({ lineHeight: 1.05, text: (el as TextElement).text.split("\n").join(" ") }) as Partial<Element>,
  },
  {
    id: "glossy", label: "Glossy bubble", group: "Type", applies: txt,
    on: (el) => txt(el) && !!el.glossy,
    apply: () => ({ glossy: { from: "#FFB3DE", to: "#FF3EA5", ink: "#3A0D2E" }, fontFamily: "Bagel Fat One", fontWeight: 400, outline: null, shadow: null, wave: 0, curve: 0 }) as Partial<Element>,
    off: () => ({ glossy: null }) as Partial<Element>,
  },

  deva("Rozha One", "Rozha One"),
  deva("Yatra One", "Yatra One"),
  deva("Khand", "Khand"),
  deva("Tiro Devanagari Hindi", "Tiro"),
  deva("Baloo 2 Variable", "Baloo 2"),

  frame("stamp", "Postage stamp"),
  frame("torn", "Torn paper"),
  frame("polaroid", "Polaroid", { title: "aaj ka mood" }),
  frame("window", "Retro window", { title: "main_character.exe" }),
  frame("truck", "Truck art"),
  frame("evileye", "Evil eye"),

  {
    id: "cutout", label: "Sticker cutout", group: "Finish", applies: () => true,
    on: (el) => !!el.cutout, apply: (el) => ({ cutout: { color: "#FFFFFF", width: Math.max(5, Math.round(Math.min(el.w, el.h) * 0.022)) } }), off: () => ({ cutout: null }),
  },
  {
    id: "grain", label: "Paper grain", group: "Finish", applies: () => true,
    on: (el) => (el.grain ?? 0) > 0, apply: () => ({ grain: 0.55 }), off: () => ({ grain: 0 }),
  },
];

export const BACKGROUNDS = ["bg-checker", "bg-swirl", "bg-halftone", "bg-sunburst", "bg-pixel"];
