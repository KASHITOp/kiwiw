// Human layer names (DESIGN.md §15): "Headline: MAIN CHARACTER", "Sticker: starburst", "Shape: red dot".
import type { Element, KiwiwDoc } from "../types";
import { STICKER_MAP } from "../stickers/library";

const COLORS: [string, number, number, number][] = [
  ["red", 255, 59, 31], ["pink", 255, 63, 164], ["orange", 255, 138, 0], ["yellow", 255, 225, 77],
  ["lime", 216, 242, 122], ["green", 139, 214, 48], ["teal", 15, 110, 110], ["blue", 47, 107, 255],
  ["purple", 122, 77, 255], ["brown", 107, 74, 35], ["black", 11, 11, 11], ["white", 255, 255, 255],
  ["cream", 241, 239, 232], ["grey", 140, 145, 135], ["navy", 27, 42, 74], ["maroon", 128, 24, 32],
];

export function colorName(hex: string) {
  const m = hex.trim().match(/^#?([0-9a-f]{6}|[0-9a-f]{3})$/i);
  if (!m) return hex === "transparent" ? "clear" : "";
  const h = m[1].length === 3 ? m[1].split("").map((c) => c + c).join("") : m[1];
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  let best = "", bestD = Infinity;
  for (const [name, cr, cg, cb] of COLORS) {
    const d = (cr - r) ** 2 + (cg - g) ** 2 + (cb - b) ** 2;
    if (d < bestD) { best = name; bestD = d; }
  }
  return best;
}

const ROLE: Record<string, string> = { headline: "Headline", sub: "Subhead", body: "Body", label: "Label", cta: "Button" };

export function humanName(el: Element, doc: KiwiwDoc): string {
  if (el.userNamed && el.name) return el.name;
  if (el.type === "text") {
    const max = Math.max(...doc.elements.map((e) => (e.type === "text" ? e.fontSize : 0)));
    const role = el.role ? ROLE[el.role] : el.fontSize >= max ? "Headline" : el.fontSize >= max * 0.45 ? "Subhead" : "Text";
    const raw = el.text.replace(/\s+/g, " ").trim();
    const t = el.uppercase ? raw.toUpperCase() : raw;
    return `${role}: ${t.length > 26 ? t.slice(0, 25) + "…" : t || "empty"}`;
  }
  if (el.type === "sticker") return `Sticker: ${(STICKER_MAP[el.kind]?.name ?? el.kind).toLowerCase()}`;
  if (el.type === "image") return "Photo";
  const c = el.fill === "transparent" ? `${colorName(el.stroke)} outline` : colorName(el.fill);
  const r = el.w / Math.max(1, el.h);
  const kind = el.shape === "ellipse" ? (r > 0.8 && r < 1.25 ? "dot" : "oval")
    : el.shape === "rect" ? (r > 6 || r < 1 / 6 ? "bar" : r > 0.85 && r < 1.18 ? "square" : "block")
    : el.shape;
  return `Shape: ${c} ${kind}`.replace(/\s+/g, " ");
}
