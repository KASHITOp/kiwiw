import { useLayoutEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GripVertical } from "lucide-react";
import { useEditor } from "../store";
import type { Element } from "../types";

// Poster design units. The poster is rendered at this size and scaled to fit.
const PW = 168;
const PH = 184;

type Part = "photo" | "headline" | "button";
const PARTS: Part[] = ["photo", "headline", "button"];

const THEMES = [
  { bg: "#D8F27A", ink: "#0B0D08", chipBg: "#0B0D08", chipFg: "#D8F27A" },
  { bg: "#0B0D08", ink: "#D8F27A", chipBg: "#8BD630", chipFg: "#0B0D08" },
  { bg: "#8BD630", ink: "#0B0D08", chipBg: "#F2F5E6", chipFg: "#0B0D08" },
];

const PHOTO_SVG = `<svg xmlns='http://www.w3.org/2000/svg' width='336' height='168' viewBox='0 0 336 168'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#5c4428'/><stop offset='.45' stop-color='#8A6A44'/><stop offset='1' stop-color='#C9965A'/></linearGradient></defs><rect width='336' height='168' fill='url(#g)'/><circle cx='242' cy='64' r='27' fill='#F6E7C8'/></svg>`;
export const PHOTO_SRC = "data:image/svg+xml;utf8," + encodeURIComponent(PHOTO_SVG);

const CHIP_TEXT = "SAT · 10AM";

interface Props {
  posterRef: React.RefObject<HTMLDivElement | null>;
  full: boolean;
}

export default function HeroEditor({ posterRef, full }: Props) {
  const navigate = useNavigate();
  const loadDoc = useEditor((s) => s.loadDoc);
  const [text, setText] = useState("Bake sale!");
  const [theme, setTheme] = useState(0);
  const [sel, setSel] = useState<Part>("headline");
  const [off, setOff] = useState<Record<Part, { x: number; y: number }>>({
    photo: { x: 0, y: 0 },
    headline: { x: 0, y: 0 },
    button: { x: 0, y: 0 },
  });
  const [scale, setScale] = useState(1);

  const photoRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLDivElement>(null);
  const partRef: Record<Part, React.RefObject<HTMLDivElement | null>> = { photo: photoRef, headline: headRef, button: btnRef };
  const drag = useRef<{ part: Part; sx: number; sy: number; ox: number; oy: number } | null>(null);

  useLayoutEffect(() => {
    const el = posterRef.current;
    if (!el) return;
    const measure = () => setScale(el.clientHeight / PH || 1);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [posterRef]);

  const clamp = (v: number, m: number) => Math.max(-m, Math.min(m, v));
  const nudge = (p: Part, dx: number, dy: number) =>
    setOff((o) => ({ ...o, [p]: { x: clamp(o[p].x + dx, 130), y: clamp(o[p].y + dy, 150) } }));

  const onDown = (p: Part) => (e: React.PointerEvent) => {
    e.preventDefault();
    setSel(p);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { part: p, sx: e.clientX, sy: e.clientY, ox: off[p].x, oy: off[p].y };
  };
  const onMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const x = clamp(d.ox + (e.clientX - d.sx) / scale, 130);
    const y = clamp(d.oy + (e.clientY - d.sy) / scale, 150);
    setOff((o) => ({ ...o, [d.part]: { x, y } }));
  };
  const onUp = () => (drag.current = null);
  const onKey = (p: Part) => (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 12 : 4;
    const map: Record<string, [number, number]> = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
    const m = map[e.key];
    if (m) { e.preventDefault(); setSel(p); nudge(p, m[0], m[1]); }
  };

  const t = THEMES[theme];
  const headline = text.trim().toUpperCase() || "YOUR IDEA";

  // Carry the poster into the real editor, measured from the DOM so it matches.
  const openInKiwiw = () => {
    const box = posterRef.current!.getBoundingClientRect();
    const k = 1080 / PW;
    const rel = (p: Part) => {
      const r = partRef[p].current!.getBoundingClientRect();
      return { x: ((r.left - box.left) / scale) * k, y: ((r.top - box.top) / scale) * k, w: (r.width / scale) * k, h: (r.height / scale) * k };
    };
    const ph = rel("photo");
    const hd = rel("headline");
    const bt = rel("button");
    const els: Element[] = [
      { id: "ph", name: "Photo", type: "image", ...ph, rotation: 0, opacity: 1, src: PHOTO_SRC, radius: 0, fit: "cover" },
      {
        id: "hd", name: "Headline", type: "text", ...hd, rotation: 0, opacity: 1, text: headline,
        fontSize: 36 * k, fontFamily: "Bricolage Grotesque Variable", color: t.ink, fontWeight: 800,
        align: "left", lineHeight: 0.84, letterSpacing: -0.04 * 36 * k,
      },
      { id: "bt", name: "Button", type: "shape", shape: "rect", ...bt, rotation: 0, opacity: 1, fill: t.chipBg, stroke: t.chipBg, strokeWidth: 0, radius: bt.h / 2 },
      {
        id: "bl", name: "Button label", type: "text", ...bt, rotation: 0, opacity: 1, text: CHIP_TEXT,
        fontSize: 9.5 * k, fontFamily: "JetBrains Mono", color: t.chipFg, fontWeight: 600, align: "center", lineHeight: 1, letterSpacing: 0,
      },
    ];
    loadDoc({ width: 1080, height: Math.round(PH * k), background: t.bg, elements: els });
    navigate("/editor");
  };

  const partStyle = (p: Part): React.CSSProperties => ({ transform: `translate(${off[p].x}px, ${off[p].y}px)` });
  const handles = <><b className="h tl" /><b className="h tr" /><b className="h bl" /><b className="h br" /></>;

  return (
    <div className={"mini" + (full ? " full" : "")}>
      <div className="mini-bar">
        <i style={{ background: "#8A6A44" }} /><i style={{ background: "#8BD630" }} /><i style={{ background: "#D8F27A" }} />
        <span className="mono">untitled-poster.kiwi</span>
        <span className="mono mini-live">{full ? "● JUICED · 72/72" : "● LIVE · TRY IT"}</span>
      </div>
      <div className="mini-body">
        <div className="mini-poster-box" ref={posterRef}>
          <div className="mini-poster" style={{ width: PW, height: PH, background: t.bg, color: t.ink, transform: `scale(${scale})` }}>
            <div ref={photoRef} className={"part photo" + (sel === "photo" ? " sel" : "")} style={partStyle("photo")}
              onPointerDown={onDown("photo")} onPointerMove={onMove} onPointerUp={onUp} onKeyDown={onKey("photo")} tabIndex={0} aria-label="Photo, drag or use arrow keys">
              <img src={PHOTO_SRC} alt="" draggable={false} />
              {sel === "photo" && handles}
            </div>
            <div ref={headRef} className={"part head" + (sel === "headline" ? " sel" : "")} style={partStyle("headline")}
              onPointerDown={onDown("headline")} onPointerMove={onMove} onPointerUp={onUp} onKeyDown={onKey("headline")} tabIndex={0} aria-label="Headline, drag or use arrow keys">
              {headline}
              {sel === "headline" && handles}
            </div>
            <div ref={btnRef} className={"part chip mono" + (sel === "button" ? " sel" : "")} style={{ ...partStyle("button"), background: t.chipBg, color: t.chipFg }}
              onPointerDown={onDown("button")} onPointerMove={onMove} onPointerUp={onUp} onKeyDown={onKey("button")} tabIndex={0} aria-label="Button, drag or use arrow keys">
              {CHIP_TEXT}
              {sel === "button" && handles}
            </div>
          </div>
        </div>
        <div className="mini-ctrl">
          <label className="mono mini-lbl" htmlFor="mini-headline">HEADLINE · TYPE ANYTHING</label>
          <input id="mini-headline" className="mini-inp" value={text} maxLength={22} onChange={(e) => setText(e.target.value)} onFocus={() => setSel("headline")} />
          <div className="mono mini-lbl" style={{ marginTop: 10 }}>DRAG THE BITS</div>
          <div className="mini-chips">
            {PARTS.map((p) => (
              <button key={p} className={"mono mini-chip" + (sel === p ? " on" : "")} onClick={() => setSel(p)}>
                <GripVertical size={12} aria-hidden="true" /> {p}
              </button>
            ))}
          </div>
          <div className="mini-actions">
            <button className="k-btn sm" onClick={openInKiwiw}>Open in Kiwiw →</button>
            <button className="mono k-ghost" onClick={() => setTheme((i) => (i + 1) % THEMES.length)}>Re-juice</button>
          </div>
        </div>
      </div>
    </div>
  );
}
