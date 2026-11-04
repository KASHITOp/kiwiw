// Landing v4 sections: ticker, effects playground, roast demo.
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Flame, Wand2 } from "lucide-react";
import Thumb from "../editor/Thumb";
import { useEditor } from "../store";
import { useInView } from "./useInView";
import { roastDesign, verdict } from "../personality/roast";
import { juiceRecipe, ensureJuiceFonts } from "../juice";
import type { Element, KiwiwDoc } from "../types";

/* ------------------------------ ticker ------------------------------ */

const LINES = [
  "No kiwis were harmed", "Comic Sans is banned", "Chai-powered", "11 styles, 0 design degrees", "268 stickers, 0 logos",
  "Nazar battu included", "Your poster, but louder", "Made in Bangalore, conceived at Surat airport",
  "Halftone is a personality", "Fonts with opinions", "Horn OK please",
];

export function Ticker() {
  const row = [...LINES, ...LINES];
  return (
    <div className="tk" aria-label={LINES.join(" · ")}>
      <div className="tk-track" aria-hidden="true">
        {row.map((l, i) => <span key={i} className="mono">{l}<i>✦</i></span>)}
      </div>
    </div>
  );
}

/* ------------------------------ effects playground ------------------------------ */

const BASE: Element = { id: "pg", type: "image", src: "/photos/chai-37186989.jpg", x: 0, y: 0, w: 540, h: 675, rotation: 0, opacity: 1, radius: 0, fit: "cover" } as Element;
const FX: { id: string; label: string; joke: string; patch: Partial<Element> }[] = [
  { id: "none", label: "Original", joke: "a perfectly fine photo. boring.", patch: {} },
  { id: "halftone", label: "Halftone", joke: "newspaper energy, zero newspapers.", patch: { fx: { halftone: { dot: 11, ink: "#111111", paper: "#F2E8D5" } } } as Partial<Element> },
  { id: "riso", label: "Riso", joke: "printed in a zine shop that smells like ink.", patch: { fx: { riso: { inks: ["#1D3FD8", "#FF4FA3"], paper: "#F4EBDD", misreg: 2 } } } as Partial<Element> },
  { id: "duotone", label: "Duotone", joke: "two colours, infinite attitude.", patch: { fx: { duotone: { dark: "#2A0F2E", light: "#FFC2D1" } } } as Partial<Element> },
  { id: "stamp", label: "Stamp", joke: "₹10 postage. delivery: vibes.", patch: { frame: { kind: "stamp", color: "#FFFDF6" } } },
  { id: "truck", label: "Truck-art", joke: "horn OK please.", patch: { frame: { kind: "truck", color: "#D62828" } } },
  { id: "evileye", label: "Evil eye", joke: "nazar na lage.", patch: { frame: { kind: "evileye", color: "#1D3FD8", accent: "#7FB7FF" } } },
  { id: "window", label: "Retro window", joke: "chai.exe has stopped responding (to sleep).", patch: { frame: { kind: "window", color: "#FF4FA3", accent: "#FFF1DE", title: "chai.exe" } } },
];

export function Playground() {
  const [on, setOn] = useState("riso");
  const fx = FX.find((f) => f.id === on)!;
  const el = { ...BASE, ...fx.patch } as Element;
  return (
    <section id="effects" className="sec pg">
      <div className="pg-text">
        <div className="mono eyebrow">[05] EFFECTS PLAYGROUND</div>
        <h2 className="display sec-h2">Same chai. Eight moods.</h2>
        <p className="sec-sub">Every effect is real, editable and exports at full resolution. Click a chip. Then click another. It's free.</p>
        <div className="pg-chips">
          {FX.map((f) => <button key={f.id} className={"pg-chip" + (on === f.id ? " on" : "")} onClick={() => setOn(f.id)}>{f.label}</button>)}
        </div>
        <p className="mono pg-joke" key={fx.id}>→ {fx.joke}</p>
      </div>
      <div className="pg-stage">
        <div className="pg-card" key={fx.id}><Thumb doc={{ width: el.w, height: el.h, background: "transparent", elements: [el] }} /></div>
      </div>
    </section>
  );
}

/* ------------------------------ roast demo ------------------------------ */

const T = (p: Partial<Element> & { text: string }) => ({ id: Math.random().toString(36).slice(2), type: "text", rotation: 0, opacity: 1, color: "#111111", fontWeight: 400, align: "center", lineHeight: 1.1, letterSpacing: 0, fontFamily: "Inter", fontSize: 40, x: 0, y: 0, w: 100, h: 100, ...p } as Element);
/** A poster engineered to be roasted: 5 fonts, low contrast, no hierarchy, glued to the edges. */
const UGLY: KiwiwDoc = {
  width: 1080, height: 1350, background: "#FFFFFF",
  elements: [
    T({ text: "BAKE SALE", fontFamily: "Gochi Hand", fontSize: 92, color: "#F6E27A", x: 6, y: 8, w: 1068, h: 120 }),
    T({ text: "Saturday 10am", fontFamily: "Fraunces Variable", fontSize: 70, color: "#BFBFBF", x: 6, y: 300, w: 1068, h: 100 }),
    T({ text: "Cakes · Cookies · Brownies", fontFamily: "Rubik Mono One", fontSize: 58, color: "#9AD0FF", x: 6, y: 520, w: 1068, h: 160 }),
    T({ text: "Everyone welcome!!!", fontFamily: "Permanent Marker", fontSize: 70, color: "#FFB0C8", x: 6, y: 780, w: 1068, h: 110 }),
    T({ text: "please come", fontFamily: "Space Mono", fontSize: 64, color: "#CCCCCC", x: 6, y: 1240, w: 1068, h: 90 }),
  ],
};

export function RoastDemo() {
  const navigate = useEditor((s) => s.loadDoc);
  const [ref, inView] = useInView<HTMLElement>("-20% 0px");
  const roast = useMemo(() => roastDesign(UGLY), []);
  const lines = roast.roasts.filter((r) => r.severity > 0).slice(0, 4);
  const [idx, setIdx] = useState(0);
  const [chars, setChars] = useState(0);
  const [stage, setStage] = useState<"ugly" | "fixing" | "juiced">("ugly");
  const [ready, setReady] = useState(false);
  useEffect(() => { ensureJuiceFonts().then(() => setReady(true)); }, []);
  const juiced = useMemo(() => juiceRecipe("bake sale saturday 10am", "sticker", 0).doc, [ready]);
  const done = idx >= lines.length;

  // typewriter: one roast at a time, two chars a tick, short pause between lines
  useEffect(() => {
    if (!inView || done) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setIdx(lines.length); return; }
    const full = lines[idx].roast.length;
    const t = setTimeout(() => {
      if (chars < full) setChars((c) => c + 2);
      else { setIdx((i) => i + 1); setChars(0); }
    }, chars < full ? 22 : 420);
    return () => clearTimeout(t);
  }, [inView, done, idx, chars, lines]);
  const shown = (i: number) => (i < idx ? lines[i].roast : i === idx ? lines[i].roast.slice(0, chars) : undefined);

  // Fix it: the roast's fixes run, then the whole thing gets juiced
  const fix = () => { setStage("fixing"); setTimeout(() => setStage("juiced"), 900); };
  const doc = stage === "juiced" ? juiced : UGLY;

  return (
    <section id="roast" className="sec rd" ref={ref}>
      <div className="rd-poster">
        <div className={"rd-card " + stage} key={stage === "juiced" ? "j" : "u"}><Thumb doc={doc} /></div>
        <span className="mono rd-score">{stage === "juiced" ? "SCORE 96 · FRESHLY SQUEEZED" : `SCORE ${roast.score} · ${verdict(roast.score).toUpperCase()}`}</span>
      </div>
      <div className="rd-text">
        <div className="mono eyebrow">[09] ROAST MY DESIGN</div>
        <h2 className="display sec-h2">We roast posters, not people.</h2>
        <ol className="rd-lines">
          {lines.map((l, i) => (
            <li key={l.id} className={shown(i) !== undefined ? "on" : ""}>
              <b className="mono"><Flame size={13} /> {l.title}</b>
              <span>{shown(i) ?? ""}{i === idx && <i className="rd-caret" />}</span>
            </li>
          ))}
        </ol>
        <div className="rd-cta">
          {stage === "ugly" ? (
            <button className="k-btn" onClick={fix} disabled={!done}><Wand2 size={17} /> Fix it</button>
          ) : (
            <Link to="/editor" className="k-btn" onClick={() => navigate(juiced)}>Open the fixed one →</Link>
          )}
          <span className="mono rd-note">{stage === "ugly" ? (done ? "one click. no therapy needed." : "roasting…") : "fixed, then juiced. you're welcome."}</span>
        </div>
      </div>
    </section>
  );
}
