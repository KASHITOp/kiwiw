// Core data model for Kiwiw documents.

export type ElementType = "text" | "shape" | "image" | "sticker";

export interface ElementBase {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  w: number;
  h: number;
  rotation: number;
  opacity: number;
  locked?: boolean;
  hidden?: boolean;
  name?: string;
}

export interface TextElement extends ElementBase {
  type: "text";
  text: string;
  fontSize: number;
  fontFamily: string;
  color: string;
  fontWeight: number;
  italic?: boolean;
  underline?: boolean;
  align: "left" | "center" | "right";
  lineHeight: number;
  letterSpacing: number;
  /** Text effects (DESIGN.md §12). All optional. */
  uppercase?: boolean;
  outline?: { color: string; width: number } | null;
  shadow?: { color: string; x: number; y: number } | null;
  highlight?: { color: string } | null;
  /** −100 (frown) … 100 (smile); 0 = straight. */
  curve?: number;
  /** Role hint used by Juice It, the Vibe slider and Roast. */
  role?: "headline" | "sub" | "body" | "label" | "cta";
}

export type ShapeKind = "rect" | "ellipse" | "line" | "triangle";

export interface ShapeElement extends ElementBase {
  type: "shape";
  shape: ShapeKind;
  fill: string;
  stroke: string;
  strokeWidth: number;
  radius: number;
}

export interface ImageElement extends ElementBase {
  type: "image";
  src: string;
  radius: number;
  fit: "cover" | "contain";
}

export interface StickerElement extends ElementBase {
  type: "sticker";
  /** Key into the sticker library (src/stickers). */
  kind: string;
  fill: string;
  accent: string;
  ink: string;
  flipX?: boolean;
}

export type Element = TextElement | ShapeElement | ImageElement | StickerElement;

export interface KiwiwDoc {
  width: number;
  height: number;
  background: string;
  elements: Element[];
}

export interface Template {
  id: string;
  name: string;
  category: string;
  thumbBg: string;
  doc: KiwiwDoc;
  /** One-line joke shown on hover. */
  description?: string;
  /** Style direction from REFERENCES.md. */
  style?: string;
  /** Format label, e.g. "Instagram post". */
  format?: string;
  tags?: string[];
}
