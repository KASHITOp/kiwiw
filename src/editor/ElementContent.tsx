import { useId } from "react";
import type { Element, TextElement } from "../types";
import StickerArt from "../stickers/StickerArt";
import { cutoutFilter, Framed, FxImage, GlossyText, GrainDefs, textBase, WaveText } from "../effects/render";

// Shared element renderer — used by the live canvas and by thumbnails,
// so a template preview looks exactly like the real thing. The effects engine
// (DESIGN.md §16) wraps the content: frame, then grain + cutout as filters.
export default function ElementContent({ el }: { el: Element }) {
  const gid = "g" + useId().replace(/[^a-zA-Z0-9]/g, "");
  const inner = <Content el={el} />;
  const grain = el.grain ?? 0;
  const cut = el.cutout ?? stickerBorder(el);
  if (!el.frame && !cut && grain <= 0) return inner;
  const filter = [grain > 0 ? `url(#${gid})` : "", cutoutFilter(cut)].filter(Boolean).join(" ");
  return (
    <div style={{ position: "relative", width: "100%", height: "100%", filter: filter || undefined }}>
      {grain > 0 && <GrainDefs id={gid} amount={grain} />}
      {el.frame ? <Framed f={el.frame} w={el.w} h={el.h} id={el.id}>{inner}</Framed> : inner}
    </div>
  );
}

/** Sticker Library 2.0 die-cut border, sized to the sticker. */
function stickerBorder(el: Element) {
  if (el.type !== "sticker" || !el.border || el.border === "none") return null;
  return { color: el.border === "white" ? "#FFFFFF" : "#111111", width: Math.max(3, Math.round(Math.min(el.w, el.h) * 0.028)) };
}

function Content({ el }: { el: Element }) {
  if (el.type === "text") {
    if (el.curve) return <CurvedText el={el} />;
    if (el.glossy) return <GlossyText el={el} style={textStyle(el)} />;
    if (el.wave) return <WaveText el={el} style={textStyle(el)} />;
    return <TextContent el={el} />;
  }
  if (el.type === "sticker") {
    return <StickerArt kind={el.kind} fill={el.fill} accent={el.accent} ink={el.ink} flipX={el.flipX} />;
  }
  if (el.type === "image") return <FxImage el={el} />;
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
  const sh: string[] = [];
  if (el.shadow) sh.push(`${el.shadow.x}px ${el.shadow.y}px 0 ${el.shadow.color}`);
  if (el.bleed) sh.push(`0 0 ${(el.fontSize * 0.018).toFixed(1)}px ${el.bleed}`, `0 0 ${(el.fontSize * 0.05).toFixed(1)}px ${el.bleed}66`);
  if (sh.length) s.textShadow = sh.join(", ");
  return s;
}

function textStyle(el: TextElement): React.CSSProperties {
  return {
    width: "100%",
    height: "100%",
    ...textBase(el),
    color: el.color,
    textDecoration: el.underline ? "underline" : "none",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    ...effectStyle(el),
  };
}

function TextContent({ el }: { el: TextElement }) {
  const st = el.stretch && el.stretch !== 1 ? { transform: `scaleY(${el.stretch})`, transformOrigin: "top center", height: `${100 / el.stretch}%` } : undefined;
  return (
    <div style={{ ...textStyle(el), ...st }}>
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
