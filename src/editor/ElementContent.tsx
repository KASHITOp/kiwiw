import { useId } from "react";
import type { Element, TextElement } from "../types";
import StickerArt from "../stickers/StickerArt";

// Shared element renderer — used by the live canvas and by thumbnails,
// so a template preview looks exactly like the real thing.
export default function ElementContent({ el }: { el: Element }) {
  if (el.type === "text") return el.curve ? <CurvedText el={el} /> : <TextContent el={el} />;
  if (el.type === "sticker") {
    return <StickerArt kind={el.kind} fill={el.fill} accent={el.accent} ink={el.ink} flipX={el.flipX} />;
  }
  if (el.type === "image") {
    return (
      <img
        src={el.src}
        draggable={false}
        style={{ width: "100%", height: "100%", objectFit: el.fit, borderRadius: el.radius, display: "block" }}
      />
    );
  }
  // shape
  const common: React.CSSProperties = {
    width: "100%",
    height: "100%",
    background: el.fill,
    border: el.strokeWidth ? `${el.strokeWidth}px solid ${el.stroke}` : "none",
  };
  if (el.shape === "ellipse") return <div style={{ ...common, borderRadius: "50%" }} />;
  if (el.shape === "line")
    return <div style={{ width: "100%", height: el.strokeWidth || 6, background: el.fill, marginTop: "auto", marginBottom: "auto" }} />;
  if (el.shape === "triangle")
    return <div style={{ ...common, clipPath: "polygon(50% 0, 100% 100%, 0 100%)" }} />;
  return <div style={{ ...common, borderRadius: el.radius }} />;
}

/** Text effects (DESIGN.md §12) as CSS. */
function effectStyle(el: TextElement): React.CSSProperties {
  const s: React.CSSProperties = {};
  if (el.outline && el.outline.width > 0) {
    s.WebkitTextStroke = `${el.outline.width}px ${el.outline.color}`;
    s.paintOrder = "stroke fill";
  }
  if (el.shadow) s.textShadow = `${el.shadow.x}px ${el.shadow.y}px 0 ${el.shadow.color}`;
  return s;
}

function TextContent({ el }: { el: TextElement }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        fontSize: el.fontSize,
        fontFamily: el.fontFamily,
        color: el.color,
        fontWeight: el.fontWeight,
        fontStyle: el.italic ? "italic" : "normal",
        textDecoration: el.underline ? "underline" : "none",
        textTransform: el.uppercase ? "uppercase" : "none",
        textAlign: el.align,
        lineHeight: el.lineHeight,
        letterSpacing: el.letterSpacing,
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        ...effectStyle(el),
      }}
    >
      {/* block wrapper keeps the highlight span inline, so it breaks per line */}
      <div>
        {el.highlight ? (
          <span
            style={{
              background: el.highlight.color,
              padding: "0.02em 0.22em",
              borderRadius: "0.06em",
              boxDecorationBreak: "clone",
              WebkitBoxDecorationBreak: "clone",
            }}
          >
            {el.text}
          </span>
        ) : (
          el.text
        )}
      </div>
    </div>
  );
}

/** Single-line text on an arc. curve > 0 smiles, curve < 0 frowns (arches). */
function CurvedText({ el }: { el: TextElement }) {
  const pid = "c" + useId().replace(/[^a-zA-Z0-9]/g, "");
  const w = Math.max(1, el.w), h = Math.max(1, el.h);
  const k = Math.max(-100, Math.min(100, el.curve ?? 0)) / 100;
  const ends = h / 2 - k * h * 0.3 + el.fontSize * 0.35;
  const d = `M0,${ends.toFixed(1)} Q${(w / 2).toFixed(1)},${(ends + k * h * 1.2).toFixed(1)} ${w.toFixed(1)},${ends.toFixed(1)}`;
  const text = (el.uppercase ? el.text.toUpperCase() : el.text).replace(/\n/g, " ");
  const common = {
    fontFamily: el.fontFamily,
    fontSize: el.fontSize,
    fontWeight: el.fontWeight,
    fontStyle: el.italic ? "italic" : "normal",
    letterSpacing: el.letterSpacing,
    textAnchor: "middle" as const,
  };
  const path = (
    <textPath href={`#${pid}`} startOffset="50%">
      {text}
    </textPath>
  );
  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${w} ${h}`} style={{ display: "block", overflow: "visible" }}>
      <path id={pid} d={d} fill="none" />
      {el.shadow && (
        <text {...common} fill={el.shadow.color} transform={`translate(${el.shadow.x} ${el.shadow.y})`}>
          {path}
        </text>
      )}
      <text
        {...common}
        fill={el.color}
        stroke={el.outline && el.outline.width > 0 ? el.outline.color : undefined}
        strokeWidth={el.outline?.width}
        strokeLinejoin="round"
        style={{ paintOrder: "stroke fill" }}
      >
        {path}
      </text>
    </svg>
  );
}
