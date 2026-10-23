import type { Element } from "../types";

// Shared element renderer — used by the live canvas and by thumbnails,
// so a template preview looks exactly like the real thing.
export default function ElementContent({ el }: { el: Element }) {
  if (el.type === "text") {
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
          textAlign: el.align,
          lineHeight: el.lineHeight,
          letterSpacing: el.letterSpacing,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {el.text}
      </div>
    );
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
