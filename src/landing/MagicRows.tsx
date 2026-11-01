import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useInView } from "./useInView";
import { useMedia } from "./useMedia";
import { PHOTO_SRC } from "./HeroEditor";

/* ---------------- 03.1 Magic Write: copy types itself out ---------------- */
const LINES = ["BAKE SALE, SAT.", "CRUMBS BY NOON.", "COME HUNGRY.", "SWEET DEALS INSIDE."];

function WriteDemo() {
  const [ref, inView] = useInView<HTMLDivElement>();
  const reduced = useMedia("(prefers-reduced-motion: reduce)");
  const [idx, setIdx] = useState(0);
  const [n, setN] = useState(LINES[0].length);
  const [phase, setPhase] = useState<"hold" | "del" | "type">("hold");

  useEffect(() => {
    if (!inView || reduced) return;
    const line = LINES[idx];
    let t: number;
    if (phase === "hold") t = window.setTimeout(() => setPhase("del"), 1500);
    else if (phase === "del") {
      t = n > 0 ? window.setTimeout(() => setN(n - 1), 28) : window.setTimeout(() => { setIdx((idx + 1) % LINES.length); setPhase("type"); }, 200);
    } else {
      t = n < line.length ? window.setTimeout(() => setN(n + 1), 62) : window.setTimeout(() => setPhase("hold"), 0);
    }
    return () => clearTimeout(t);
  }, [inView, reduced, idx, n, phase]);

  const text = LINES[idx].slice(0, n);
  return (
    <div ref={ref} className="demo demo-write">
      <div className="dw-prompt mono"><span className="dw-k">PROMPT ›</span> bake sale flyer, make it juicy</div>
      <div className="dw-arrow mono">↓ MAGIC WRITE</div>
      <div className="dw-poster">
        <img src={PHOTO_SRC} alt="" className="dw-photo" />
        <div className="display dw-head">{text}<span className="dw-caret" /></div>
        <div className="mono dw-chip">SAT · 10AM</div>
      </div>
    </div>
  );
}

/* ---------------- 03.2 Magic Resize: one post, three shapes ---------------- */
const FORMATS = [
  { k: "POST", ratio: "1:1", w: 1080, h: 1080 },
  { k: "STORY", ratio: "9:16", w: 1080, h: 1920 },
  { k: "SLIDE", ratio: "16:9", w: 1920, h: 1080 },
] as const;

function ResizeDemo() {
  const [ref, inView] = useInView<HTMLDivElement>();
  const reduced = useMedia("(prefers-reduced-motion: reduce)");
  const [i, setI] = useState(0);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    if (!inView || hover || reduced) return;
    const t = window.setTimeout(() => setI((v) => (v + 1) % FORMATS.length), 2400);
    return () => clearTimeout(t);
  }, [inView, hover, reduced, i]);

  const f = FORMATS[i];
  const MAX = 240;
  const s = MAX / Math.max(f.w, f.h);
  return (
    <div ref={ref} className="demo demo-resize" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <div className="dr-stage">
        <div className={"dr-box fmt-" + f.k.toLowerCase()} style={{ width: Math.round(f.w * s), height: Math.round(f.h * s) }}>
          <img src={PHOTO_SRC} alt="" className="dr-photo" />
          <div className="display dr-head">BAKE<br />SALE!</div>
          <div className="mono dr-chip">SAT · 10AM</div>
        </div>
      </div>
      <div className="dr-bar">
        <div className="seg-k" role="tablist" aria-label="Format">
          {FORMATS.map((x, j) => (
            <button key={x.k} role="tab" aria-selected={i === j} className={"mono" + (i === j ? " on" : "")} onClick={() => setI(j)}>
              {x.k} <span>{x.ratio}</span>
            </button>
          ))}
        </div>
        <span className="mono dr-size">{f.w} × {f.h}</span>
      </div>
    </div>
  );
}

/* ---------------- 03.3 Background remover: a wipe peels the photo ---------------- */
function Subject() {
  // An original little potted plant: cream pot, kiwi-green leaves.
  return (
    <svg viewBox="0 0 200 200" className="de-subject" aria-hidden="true">
      <g fill="#8BD630">
        <ellipse cx="100" cy="62" rx="14" ry="42" />
        <ellipse cx="72" cy="78" rx="12" ry="36" transform="rotate(-32 72 78)" />
        <ellipse cx="128" cy="78" rx="12" ry="36" transform="rotate(32 128 78)" />
        <ellipse cx="56" cy="104" rx="10" ry="28" transform="rotate(-58 56 104)" fill="#6CB022" />
        <ellipse cx="144" cy="104" rx="10" ry="28" transform="rotate(58 144 104)" fill="#6CB022" />
      </g>
      <path d="M58 118 H142 L132 184 Q131 190 125 190 H75 Q69 190 68 184 Z" fill="#F2F5E6" />
      <rect x="52" y="112" width="96" height="16" rx="5" fill="#E2E8CF" />
      <path d="M70 150 Q100 162 130 150" stroke="#B4BCA2" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function EraseDemo() {
  const [ref, inView] = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className={"demo demo-erase" + (inView ? " playing" : "")}>
      <div className="de-stage">
        <div className="de-layer de-before">
          <img src={PHOTO_SRC} alt="" className="de-bg" />
          <Subject />
        </div>
        <div className="de-wipe">
          <div className="de-layer de-after">
            <Subject />
          </div>
          <div className="de-handle"><i /></div>
        </div>
        <span className="mono de-tag de-tag-l">BEFORE</span>
        <span className="mono de-tag de-tag-r">AFTER · PNG</span>
      </div>
    </div>
  );
}

/* ---------------- rows ---------------- */
const ROWS = [
  {
    idx: "03.1 · MAGIC WRITE",
    h: "Plain words in, juicy lines out.",
    p: "Type what you mean. Magic Write rewrites it into something people stop scrolling for: shorter, punchier, a little hungry.",
    spec: ["WRITE", "REPHRASE", "SHORTEN", "EXPAND"],
    cta: { label: "Try it in the editor →", to: "/editor" },
    demo: <WriteDemo />,
  },
  {
    idx: "03.2 · MAGIC RESIZE · IN THE OVEN",
    h: "One post, every shape.",
    p: "Square for the feed, tall for stories, wide for slides. The layout re-cuts itself so nothing gets cropped or squashed. Still baking: this is the plan, not the product yet.",
    spec: ["1:1", "9:16", "16:9"],
    cta: { label: "Watch the repo →", href: "https://github.com/KASHITOp/kiwiw" },
    demo: <ResizeDemo />,
  },
  {
    idx: "03.3 · BACKGROUND REMOVER",
    h: "Peel off the background.",
    p: "One click and the subject is free, ready to drop onto anything. Like peeling a kiwi, minus the sticky hands.",
    spec: ["ONE CLICK", "PNG", "TRANSPARENT"],
    cta: { label: "Try it in the editor →", to: "/editor" },
    demo: <EraseDemo />,
  },
];

export default function MagicRows() {
  return (
    <section id="magic" className="sec mg">
      <div className="sec-head">
        <div className="mono eyebrow">[03] MAGIC STUDIO · THREE TRICKS</div>
        <h2 className="display sec-h2">The juicy bits do themselves.</h2>
      </div>
      <div className="mg-rows">
        {ROWS.map((r, i) => (
          <article key={r.idx} className={"mg-row" + (i % 2 ? " flip" : "")}>
            <div className="mg-copy">
              <div className="mono mg-idx">{r.idx}</div>
              <h3 className="display mg-h3">{r.h}</h3>
              <p>{r.p}</p>
              <ul className="mono mg-spec">{r.spec.map((s) => <li key={s}>{s}</li>)}</ul>
              {r.cta.to
                ? <Link to={r.cta.to} className="mono k-ghost">{r.cta.label}</Link>
                : <a href={r.cta.href} target="_blank" rel="noreferrer" className="mono k-ghost">{r.cta.label}</a>}
            </div>
            <div className="mg-demo">{r.demo}</div>
          </article>
        ))}
      </div>
    </section>
  );
}
