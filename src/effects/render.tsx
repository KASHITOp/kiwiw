// Effects renderers (DESIGN.md §16): frames, grain, cutout, wave + glossy
// type and processed images. Used by ElementContent, so canvas, thumbnails and
// export always agree.
import { useEffect, useId, useState } from "react";
import type { FrameFx, ImageElement, TextElement } from "../types";
import { rng } from "../brand/kiwi";
import { cssFallback, hasImageFx, processImage } from "./image";

/* ------------------------------ images ------------------------------ */

export function FxImage({ el }: { el: ImageElement }) {
  const active = hasImageFx(el.fx);
  const key = active ? JSON.stringify(el.fx) : "";
  const [out, setOut] = useState<{ key: string; url: string } | null>(null);
  useEffect(() => {
    if (!active) return;
    let live = true;
    processImage(el.src, el.fx!).then((url) => live && setOut({ key: el.src + key, url })).catch(() => {});
    return () => { live = false; };
  }, [el.src, key, active]);
  const ready = active && out?.key === el.src + key;
  const pos = el.focus ? `${el.focus.x * 100}% ${el.focus.y * 100}%` : "50% 50%";
  return (
    <img
      src={ready ? out!.url : el.src}
      draggable={false}
      alt=""
      style={{
        width: "100%", height: "100%", objectFit: el.fit, objectPosition: pos, borderRadius: el.radius, display: "block",
        filter: active && !ready ? cssFallback(el.fx) : undefined,
      }}
    />
  );
}

/* ------------------------------ finish ------------------------------ */

/** Stacked drop-shadows = a sticker border that hugs the real shape. */
export function cutoutFilter(c?: { color: string; width: number } | null) {
  if (!c || c.width <= 0) return "";
  const w = c.width, d = +(w * 0.71).toFixed(1);
  return [
    `drop-shadow(${w}px 0 0 ${c.color})`, `drop-shadow(-${w}px 0 0 ${c.color})`,
    `drop-shadow(0 ${w}px 0 ${c.color})`, `drop-shadow(0 -${w}px 0 ${c.color})`,
    `drop-shadow(${d}px ${d}px 0 ${c.color})`, `drop-shadow(-${d}px -${d}px 0 ${c.color})`,
    `drop-shadow(0 ${Math.max(4, w)}px ${Math.max(8, w * 2)}px rgba(0,0,0,.28))`,
  ].join(" ");
}

/** Paper grain clipped to the element's own pixels (an inline SVG filter, so export keeps it). */
export function GrainDefs({ id, amount }: { id: string; amount: number }) {
  const k = Math.max(0, Math.min(1, amount)) * 1.25;
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <filter id={id} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="7" stitchTiles="stitch" result="n" />
        <feColorMatrix in="n" type="saturate" values="0" result="m" />
        <feComponentTransfer in="m" result="t">
          <feFuncR type="linear" slope={k} intercept={1 - k * 0.55} />
          <feFuncG type="linear" slope={k} intercept={1 - k * 0.55} />
          <feFuncB type="linear" slope={k} intercept={1 - k * 0.55} />
        </feComponentTransfer>
        <feBlend in="SourceGraphic" in2="t" mode="multiply" result="b" />
        <feComposite in="b" in2="SourceGraphic" operator="in" />
      </filter>
    </svg>
  );
}

/* ------------------------------ frames ------------------------------ */

const INK = "#111111";

/** Where the content sits inside a frame, in element units. */
export function frameInset(f: FrameFx, w: number, h: number) {
  const m = Math.min(w, h);
  switch (f.kind) {
    case "stamp": { const p = Math.max(6, m * 0.035) * 2.5; return { t: p, r: p, b: p, l: p }; }
    case "torn": { const p = m * 0.06; return { t: p, r: p, b: p, l: p }; }
    case "polaroid": { const p = m * 0.055; return { t: p, r: p, b: p * 3.6, l: p }; }
    case "window": { const b = Math.max(3, m * 0.012), bar = Math.min(90, Math.max(22, m * 0.11)); return { t: b + bar, r: b, b, l: b }; }
    case "truck": { const p = m * 0.09; return { t: p, r: p, b: p, l: p }; }
    case "evileye": {
      const r = m / 2 * 0.58;
      return { t: h / 2 - r, r: w / 2 - r, b: h / 2 - r, l: w / 2 - r };
    }
  }
}

function tornPoly(w: number, h: number, inset: number, amp: number, seed: number) {
  const r = rng(seed * 97 + 13);
  const pts: string[] = [];
  const step = Math.max(10, Math.min(w, h) / 22);
  const j = () => (r() - 0.5) * 2 * amp;
  for (let x = inset; x < w - inset; x += step) pts.push(`${x.toFixed(1)}px ${(inset + j()).toFixed(1)}px`);
  for (let y = inset; y < h - inset; y += step) pts.push(`${(w - inset + j()).toFixed(1)}px ${y.toFixed(1)}px`);
  for (let x = w - inset; x > inset; x -= step) pts.push(`${x.toFixed(1)}px ${(h - inset + j()).toFixed(1)}px`);
  for (let y = h - inset; y > inset; y -= step) pts.push(`${(inset + j()).toFixed(1)}px ${y.toFixed(1)}px`);
  return `polygon(${pts.join(",")})`;
}

const seedOf = (s: string) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 100000, 7) || 7;

export function Framed({ f, w, h, id, children }: { f: FrameFx; w: number; h: number; id: string; children: React.ReactNode }) {
  const uid = "f" + useId().replace(/[^a-zA-Z0-9]/g, "");
  const ins = frameInset(f, w, h);
  const m = Math.min(w, h);
  const content: React.CSSProperties = { position: "absolute", left: ins.l, top: ins.t, width: Math.max(1, w - ins.l - ins.r), height: Math.max(1, h - ins.t - ins.b), overflow: "hidden" };

  if (f.kind === "stamp") {
    const r = Math.max(6, m * 0.035), gap = r * 2.7;
    const holes: React.ReactNode[] = [];
    const nx = Math.max(2, Math.round(w / gap)), ny = Math.max(2, Math.round(h / gap));
    for (let i = 0; i <= nx; i++) { const x = (i * w) / nx; holes.push(<circle key={`t${i}`} cx={x} cy={0} r={r} />, <circle key={`b${i}`} cx={x} cy={h} r={r} />); }
    for (let i = 0; i <= ny; i++) { const y = (i * h) / ny; holes.push(<circle key={`l${i}`} cx={0} cy={y} r={r} />, <circle key={`r${i}`} cx={w} cy={y} r={r} />); }
    return (
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <svg width="100%" height="100%" viewBox={`0 0 ${w} ${h}`} style={{ position: "absolute", inset: 0, overflow: "visible" }} aria-hidden="true">
          <defs><mask id={uid}><rect width={w} height={h} fill="#fff" /><g fill="#000">{holes}</g></mask></defs>
          <rect width={w} height={h} fill={f.color ?? "#FFFDF6"} mask={`url(#${uid})`} />
          <rect x={ins.l * 0.55} y={ins.t * 0.55} width={w - ins.l * 1.1} height={h - ins.t * 1.1} fill="none" stroke={f.accent ?? "rgba(0,0,0,.18)"} strokeWidth={Math.max(1, m * 0.003)} />
        </svg>
        <div style={content}>{children}</div>
      </div>
    );
  }

  if (f.kind === "torn") {
    const amp = m * 0.018, s = seedOf(id);
    return (
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <div style={{ position: "absolute", inset: 0, background: f.color ?? "#F4EBDD", clipPath: tornPoly(w, h, amp, amp, s), filter: "drop-shadow(0 6px 10px rgba(0,0,0,.25))" }} />
        <div style={{ ...content, clipPath: tornPoly(w - ins.l - ins.r, h - ins.t - ins.b, amp * 0.6, amp * 0.6, s + 3) }}>{children}</div>
      </div>
    );
  }

  if (f.kind === "polaroid") {
    const p = ins.l;
    return (
      <div style={{ position: "relative", width: "100%", height: "100%", background: f.color ?? "#FFFDF7", boxShadow: `0 ${m * 0.02}px ${m * 0.05}px rgba(0,0,0,.3)` }}>
        <div style={content}>{children}</div>
        {f.title && (
          <div style={{ position: "absolute", left: p, right: p, bottom: 0, height: ins.b, display: "grid", placeItems: "center", fontFamily: "Caveat Variable, cursive", fontWeight: 600, fontSize: ins.b * 0.42, color: f.accent ?? INK, whiteSpace: "nowrap", overflow: "hidden" }}>
            {f.title}
          </div>
        )}
      </div>
    );
  }

  if (f.kind === "window") {
    const b = ins.l, bar = ins.t - b;
    const btn = bar * 0.5;
    return (
      <div style={{ position: "relative", width: "100%", height: "100%", border: `${b}px solid ${INK}`, background: f.accent ?? "#FFF1DE", boxShadow: `${b * 2.4}px ${b * 2.4}px 0 ${INK}`, boxSizing: "border-box" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: bar, background: f.color ?? "#FF4FA3", borderBottom: `${b}px solid ${INK}`, display: "flex", alignItems: "center", gap: bar * 0.18, padding: `0 ${bar * 0.3}px`, boxSizing: "border-box" }}>
          <span style={{ flex: 1, fontFamily: "Space Mono, monospace", fontWeight: 700, fontSize: bar * 0.4, color: INK, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{f.title ?? ""}</span>
          {["–", "□", "×"].map((g) => (
            <span key={g} style={{ width: btn, height: btn, flex: "none", display: "grid", placeItems: "center", border: `${Math.max(1.5, b * 0.6)}px solid ${INK}`, background: "#FFFFFF", fontFamily: "Space Mono, monospace", fontWeight: 700, fontSize: btn * 0.7, lineHeight: 1, color: INK }}>{g}</span>
          ))}
        </div>
        <div style={{ ...content, left: 0, top: bar, width: "100%", height: `calc(100% - ${bar}px)` }}>{children}</div>
      </div>
    );
  }

  if (f.kind === "truck") {
    const band = ins.l;
    const cols = ["#F7931E", "#0F7C7A", "#FFD23F", "#2B59C3", "#FFFFFF"];
    const t = band * 0.42, L = band * 0.92, sw = Math.max(1, band * 0.03);
    // bunting: triangles hang inward from each inner edge of the band
    const pts: React.ReactNode[] = [];
    const side = (x0: number, y0: number, x1: number, y1: number, nx: number, ny: number) => {
      const n = Math.max(3, Math.round(Math.hypot(x1 - x0, y1 - y0) / (t * 1.1)));
      for (let i = 0; i < n; i++) {
        const ax = x0 + ((x1 - x0) * i) / n, ay = y0 + ((y1 - y0) * i) / n;
        const bx = x0 + ((x1 - x0) * (i + 1)) / n, by = y0 + ((y1 - y0) * (i + 1)) / n;
        const mx = (ax + bx) / 2 + nx * t, my = (ay + by) / 2 + ny * t;
        pts.push(<path key={pts.length} d={`M${ax.toFixed(1)},${ay.toFixed(1)} L${mx.toFixed(1)},${my.toFixed(1)} L${bx.toFixed(1)},${by.toFixed(1)}Z`} fill={cols[pts.length % cols.length]} stroke={INK} strokeWidth={sw} strokeLinejoin="round" />);
      }
    };
    side(L, L, w - L, L, 0, 1);
    side(L, h - L, w - L, h - L, 0, -1);
    side(L, L, L, h - L, 1, 0);
    side(w - L, L, w - L, h - L, -1, 0);
    const dots: React.ReactNode[] = [];
    const dr = band * 0.09, step = band * 0.42;
    for (let x = band * 0.5; x < w - band * 0.3; x += step) dots.push(<circle key={`dt${x}`} cx={x} cy={band * 0.42} r={dr} />, <circle key={`db${x}`} cx={x} cy={h - band * 0.42} r={dr} />);
    for (let y = band * 0.9; y < h - band * 0.7; y += step) dots.push(<circle key={`dl${y}`} cx={band * 0.42} cy={y} r={dr} />, <circle key={`dr${y}`} cx={w - band * 0.42} cy={y} r={dr} />);
    const rosette = (cx: number, cy: number, key: string) => (
      <g key={key}>
        {Array.from({ length: 8 }, (_, i) => <ellipse key={i} cx={cx} cy={cy - band * 0.3} rx={band * 0.12} ry={band * 0.26} fill={i % 2 ? "#FFD23F" : "#F7931E"} transform={`rotate(${i * 45} ${cx} ${cy})`} stroke={INK} strokeWidth={Math.max(1, band * 0.02)} />)}
        <circle cx={cx} cy={cy} r={band * 0.16} fill="#0F7C7A" stroke={INK} strokeWidth={Math.max(1, band * 0.02)} />
      </g>
    );
    return (
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <div style={content}>{children}</div>
        <svg width="100%" height="100%" viewBox={`0 0 ${w} ${h}`} style={{ position: "absolute", inset: 0, pointerEvents: "none" }} aria-hidden="true">
          <path fillRule="evenodd" d={`M0,0H${w}V${h}H0Z M${L},${L}V${h - L}H${w - L}V${L}Z`} fill={f.color ?? "#D62828"} stroke={INK} strokeWidth={Math.max(1.5, band * 0.05)} />
          {pts}
          <g fill="#FFF3D6">{dots}</g>
          {rosette(band * 0.5, band * 0.5, "a")}{rosette(w - band * 0.5, band * 0.5, "b")}{rosette(band * 0.5, h - band * 0.5, "c")}{rosette(w - band * 0.5, h - band * 0.5, "d")}
        </svg>
      </div>
    );
  }

  // evil-eye ring: content becomes the pupil
  const R = m / 2, cx = w / 2, cy = h / 2;
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <svg width="100%" height="100%" viewBox={`0 0 ${w} ${h}`} style={{ position: "absolute", inset: 0 }} aria-hidden="true">
        <circle cx={cx} cy={cy} r={R} fill={f.color ?? "#1D3FD8"} />
        <circle cx={cx} cy={cy} r={R * 0.84} fill="#FFFFFF" />
        <circle cx={cx} cy={cy} r={R * 0.71} fill={f.accent ?? "#7FB7FF"} />
        <circle cx={cx} cy={cy} r={R * 0.61} fill={INK} />
      </svg>
      <div style={{ ...content, borderRadius: "50%" }}>{children}</div>
    </div>
  );
}

/* ------------------------------ type ------------------------------ */

export function textBase(el: TextElement): React.CSSProperties {
  return {
    fontSize: el.fontSize,
    fontFamily: el.fontFamily,
    fontWeight: el.fontWeight,
    fontStyle: el.italic ? "italic" : "normal",
    textTransform: el.uppercase ? "uppercase" : "none",
    textAlign: el.align,
    lineHeight: el.lineHeight,
    letterSpacing: el.letterSpacing,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  };
}

// Split by grapheme cluster, so Devanagari matras stay attached to their letter.
const seg = typeof Intl !== "undefined" && "Segmenter" in Intl ? new Intl.Segmenter(undefined, { granularity: "grapheme" }) : null;
const graphemes = (s: string) => (seg ? [...seg.segment(s)].map((x) => x.segment) : [...s]);

/** Each glyph rides a sine wave; words stay together so wrapping still works. */
export function WaveText({ el, style }: { el: TextElement; style: React.CSSProperties }) {
  const amp = ((el.wave ?? 0) / 100) * el.fontSize * 0.34;
  const text = el.text;
  const total = Math.max(6, graphemes(text.replace(/\s/g, "")).length);
  let i = 0;
  const lines = text.split("\n");
  return (
    <div style={style}>
      <div>
        {lines.map((line, li) => (
          <div key={li}>
            {line.split(/( +)/).map((word, wi) =>
              /^ +$/.test(word) ? word : (
                <span key={wi} style={{ display: "inline-block", whiteSpace: "nowrap" }}>
                  {graphemes(word).map((ch, ci) => {
                    const t = (i++ / total) * Math.PI * 2 * 1.15;
                    // vertical offset only: per-glyph transforms stop painting at thumbnail scale in Chrome
                    const y = Math.sin(t) * amp;
                    return <span key={ci} style={{ display: "inline-block", position: "relative", top: `${y.toFixed(1)}px` }}>{ch}</span>;
                  })}
                </span>
              ),
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const shade = (hex: string, k: number) => {
  const m = hex.replace("#", "");
  const n = m.length === 3 ? m.split("").map((c) => c + c).join("") : m;
  const c = [0, 2, 4].map((i) => Math.max(0, Math.min(255, Math.round(parseInt(n.slice(i, i + 2), 16) * k))));
  return `#${c.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
};

/** Glossy bubble type: an ink outline layer under a gradient fill with a white top shine. */
export function GlossyText({ el, style }: { el: TextElement; style: React.CSSProperties }) {
  const g = el.glossy!;
  const f = el.fontSize;
  const sw = f * 0.09;
  const layer: React.CSSProperties = { ...style, position: "absolute", inset: 0 };
  // extrusion: stacked ink offsets read as depth, then one soft contact shadow
  const depth = Array.from({ length: 7 }, (_, i) => `0 ${((i + 1) * f * 0.014).toFixed(1)}px 0 ${shade(g.ink, 1 - i * 0.05)}`).join(", ");
  const clip = { color: "transparent", WebkitBackgroundClip: "text", backgroundClip: "text" } as const;
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div style={{ ...layer, color: g.ink, WebkitTextStroke: `${sw}px ${g.ink}`, paintOrder: "stroke fill", textShadow: `${depth}, 0 ${f * 0.14}px ${f * 0.16}px rgba(20,0,20,.32)` }}><div>{el.text}</div></div>
      <div style={{ ...layer, ...clip, backgroundImage: `radial-gradient(ellipse 60% 40% at 30% 18%, rgba(255,255,255,.7), rgba(255,255,255,0) 60%), linear-gradient(180deg, ${g.from} 0%, ${g.from} 22%, ${g.to} 64%, ${shade(g.to, 0.62)} 100%)` }}><div>{el.text}</div></div>
      <div style={{ ...layer, ...clip, backgroundImage: "linear-gradient(180deg, rgba(255,255,255,0) 6%, rgba(255,255,255,.95) 13%, rgba(255,255,255,.15) 27%, rgba(255,255,255,0) 34%)", transform: `translateY(-${f * 0.02}px) scale(.96, .9)` }}><div>{el.text}</div></div>
      <div style={{ ...layer, ...clip, backgroundImage: "linear-gradient(0deg, rgba(255,255,255,.45) 0%, rgba(255,255,255,0) 14%)" }}><div>{el.text}</div></div>
    </div>
  );
}
