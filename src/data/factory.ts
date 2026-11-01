import type { Element, ShapeKind, TextElement, ShapeElement, ImageElement } from "../types";

// Kiwi palette first (DESIGN.md 02), then two warm extras for user designs.
export const PALETTE = [
  "#0B0D08", "#17140D", "#8A6A44", "#6CB022", "#8BD630",
  "#D8F27A", "#F2F5E6", "#ffffff", "#fb7185", "#f59e0b",
];

export const FONTS = [
  "Inter", "Bricolage Grotesque Variable", "JetBrains Mono", "Georgia", "Poppins", "Playfair Display",
  "Courier New", "Arial", "Impact", "Comic Sans MS",
];

export function makeText(partial: Partial<TextElement> = {}): Omit<Element, "id"> {
  return {
    type: "text",
    x: 120, y: 120, w: 420, h: 90, rotation: 0, opacity: 1,
    text: "Your text here",
    fontSize: 54, fontFamily: "Inter", color: "#0B0D08", fontWeight: 700,
    align: "left", lineHeight: 1.2, letterSpacing: 0,
    ...partial,
  } as Omit<TextElement, "id">;
}

export function makeShape(shape: ShapeKind, partial: Partial<ShapeElement> = {}): Omit<Element, "id"> {
  return {
    type: "shape",
    x: 200, y: 200, w: 260, h: 260, rotation: 0, opacity: 1,
    shape, fill: "#8BD630", stroke: "#0B0D08", strokeWidth: 0, radius: 16,
    ...partial,
  } as Omit<ShapeElement, "id">;
}

export function makeImage(src: string, partial: Partial<ImageElement> = {}): Omit<Element, "id"> {
  return {
    type: "image",
    x: 160, y: 160, w: 400, h: 400, rotation: 0, opacity: 1,
    src, radius: 12, fit: "cover",
    ...partial,
  } as Omit<ImageElement, "id">;
}
