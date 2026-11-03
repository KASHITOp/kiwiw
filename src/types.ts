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
  /** true once someone renamed the layer by hand; otherwise the panel names it. */
  userNamed?: boolean;
  /** Elements sharing a groupId select and move together. */
  groupId?: string;
  /** Effects engine (DESIGN.md §16), any element type. */
  frame?: FrameFx | null;
  cutout?: { color: string; width: number } | null;
  /** 0–1 paper grain, clipped to the element's own pixels. */
  grain?: number;
}

export type FrameKind = "stamp" | "torn" | "polaroid" | "window" | "truck" | "evileye";

export interface FrameFx {
  kind: FrameKind;
  /** Paper / bar / border colour, depending on the frame. */
  color?: string;
  /** Secondary colour (window body, stamp hairline). */
  accent?: string;
  /** Window title or polaroid caption. */
  title?: string;
}

/** Image effects (DESIGN.md §16). Processed on a canvas and cached. */
export interface ImageFx {
  halftone?: { dot: number; ink?: string; paper?: string | null; invert?: boolean } | null;
  duotone?: { dark: string; light: string } | null;
  posterize?: number | null;
  bw?: boolean;
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
  /** Wave warp, −100…100 (% of a third of the font size). */
  wave?: number;
  /** Glossy bubble fill: vertical gradient with an ink outline layer. */
  glossy?: { from: string; to: string; ink: string } | null;
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
  fx?: ImageFx;
  /** Focal point for cover crops, 0–1 (default centre). */
  focus?: { x: number; y: number };
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
