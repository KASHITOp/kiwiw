// Core data model for Kiwiw documents.

export type ElementType = "text" | "shape" | "image";

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

export type Element = TextElement | ShapeElement | ImageElement;

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
}
