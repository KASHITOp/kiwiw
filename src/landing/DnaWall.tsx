// Landing v3: the Style DNA wall (hover a recipe, see your line in it) and a
// before/after slider (plain flyer vs juiced poster). STYLE_DNA.md.
import { useEffect, useMemo, useRef, useState } from "react";
import { DEFAULT_IDEA, RECIPES, RECIPE_ORDER, ensureJuiceFonts, juiceRecipe, type RecipeKey } from "../juice";
import Thumb from "../editor/Thumb";

const SWATCH: Record<RecipeKey, string[]> = {
  nazar: ["#F2479B", "#FFD23F", "#1D3FD8", "#B3122E"], tapri: ["#D62828", "#0F7C7A", "#F7931E", "#FFF3D6"],
  stadium: ["#D7191C", "#F2E8D5", "#111111"], brutal: ["#FF2E1F", "#1F3BFF", "#0A0A0A", "#F4F1EA"],
  swiss: ["#E30613", "#EFEDE6", "#141414"], trippy: ["#FF4FA3", "#FFC72C", "#6B3FD8", "#3FA9FF"],
  neo: ["#FFE14D", "#111111", "#FF6FB5", "#B6F23A"], pixel: ["#120B2E", "#FF3EA5", "#FFD400", "#5CFF5C"],
  sticker: ["#2443FF", "#C6F432", "#FF7AC6", "#FFFFFF"], glossy: ["#1C1C1E", "#F7F3EC", "#FFE58A", "#FFC2D1"],
};
const FACE: Record<RecipeKey, { font: string; text: string }> = {
  nazar: { font: "Rozha One", text: "नज़र" }, tapri: { font: "Yatra One", text: "टपरी" }, stadium: { font: "Anton", text: "STADIUM" },
  brutal: { font: "Archivo Black", text: "GRID." }, swiss: { font: "Archivo Black", text: "SW—" }, trippy: { font: "Shrikhand", text: "Trippy" },
  neo: { font: "Archivo Black", text: "POP!" }, pixel: { font: "Press Start 2P", text: "8BIT" }, sticker: { font: "Bagel Fat One", text: "BOMB" },
  glossy: { font: "Bagel Fat One", text: "Gloss" },
};

export default function DnaWall() {
  const [line, setLine] = useState(DEFAULT_IDEA);
  const [ready, setReady] = useState(false);
  useEffect(() => { ensureJuiceFonts().then(() => setReady(true)); }, []);
  const results = useMemo(() => Object.fromEntries(RECIPE_ORDER.map((r) => [r, juiceRecipe(line.trim() || DEFAULT_IDEA, r, 0)])), [line, ready]);

  return (
    <>
      <section id="dna" className="sec dna">
        <div className="dna-top">
          <div className="sec-head">
            <div className="mono eyebrow">[02] STYLE DNA · 10 RECIPES, 30 LAYOUTS</div>
            <h2 className="display sec-h2">Same line. Ten personalities.</h2>
            <p className="sec-sub">Every card below is your line, juiced live in that recipe. Type something boring. We dare you.</p>
            <input className="dna-inp" value={line} maxLength={60} onChange={(e) => setLine(e.target.value)} aria-label="Your line for the Style DNA wall" />
          </div>
          <Spinner results={results} />
        </div>
        <div className="dna-grid">
          {RECIPE_ORDER.map((r, i) => (
            <div key={r} className="dna-card" tabIndex={0}>
              <div className="dna-poster"><Thumb doc={results[r].doc} /></div>
              <div className="dna-tag" style={{ background: SWATCH[r][0], color: SWATCH[r][1] }}>
                <span className="mono dna-no">{String(i + 1).padStart(2, "0")}</span>
                <b className="dna-name" style={{ fontFamily: FACE[r].font }}>{RECIPES[r].name}</b>
                <span className="mono dna-vibe">{RECIPES[r].jokes[0]}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
      <BeforeAfter line={line.trim() || DEFAULT_IDEA} ready={ready} />
    </>
  );
}

/** A big poster that cycles through the recipes (fills the header's right side). */
function Spinner({ results }: { results: Record<string, ReturnType<typeof juiceRecipe>> }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((n) => (n + 1) % RECIPE_ORDER.length), 1800);
    return () => clearInterval(t);
  }, []);
  const r = RECIPE_ORDER[i];
  return (
    <div className="dna-spin" aria-hidden="true">
      <div className="dna-spin-card" key={r}><Thumb doc={results[r].doc} /></div>
      <span className="mono dna-spin-tag">{RECIPES[r].name.toUpperCase()} · {String(i + 1).padStart(2, "0")}/10</span>
    </div>
  );
}

function BeforeAfter({ line, ready }: { line: string; ready: boolean }) {
  const [pos, setPos] = useState(50);
  const box = useRef<HTMLDivElement>(null);
  const after = useMemo(() => juiceRecipe(line, "sticker", 0), [line, ready]);
  const drag = (clientX: number) => {
    const r = box.current!.getBoundingClientRect();
    setPos(Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100)));
  };
  return (
    <section className="sec ba">
      <div className="sec-head">
        <div className="mono eyebrow">[03] BEFORE / AFTER · DRAG THE SEED</div>
        <h2 className="display sec-h2">From Word doc to wow.</h2>
        <p className="sec-sub">Left: what your uncle would print. Right: what Juice It made from the same line, in 0.2 seconds.</p>
      </div>
      <div
        className="ba-box"
        ref={box}
        onPointerDown={(e) => { (e.target as HTMLElement).setPointerCapture?.(e.pointerId); drag(e.clientX); }}
        onPointerMove={(e) => e.buttons && drag(e.clientX)}
        role="slider" aria-label="Before and after" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pos)} tabIndex={0}
        onKeyDown={(e) => { if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - 5)); if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + 5)); }}
      >
        <div className="ba-after"><Thumb doc={after.doc} /></div>
        <div className="ba-before" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <div className="ba-plain">
            <p className="ba-plain-h">{line.replace(/\b\w/g, (m) => m.toUpperCase())}</p>
            <p>All are welcome.</p>
            <p>Please come.</p>
            <p className="ba-clip">[clip art not found]</p>
          </div>
        </div>
        <div className="ba-handle" style={{ left: `${pos}%` }}><span>⟷</span></div>
        <span className="mono ba-tag l">BEFORE</span><span className="mono ba-tag r">AFTER · STICKER BOMB</span>
      </div>
    </section>
  );
}
