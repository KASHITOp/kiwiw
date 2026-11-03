import { useEffect, useMemo, useState } from "react";
import { juice, DEFAULT_IDEA, EXAMPLE_IDEAS, ensureJuiceFonts } from "../juice";
import Thumb from "../editor/Thumb";
import "../juice/juice.css";

interface Props {
  posterRef: React.RefObject<HTMLDivElement | null>;
  full: boolean;
  /** Juice inline under the hero (no overlay). */
  onJuice: (text: string) => void;
}

// The hero demo: type a boring line, watch it get juiced live, then burst it into six.
export default function JuiceCard({ posterRef, full, onJuice }: Props) {
  const [text, setText] = useState(DEFAULT_IDEA);
  const [debounced, setDebounced] = useState(DEFAULT_IDEA);
  const [styleIdx, setStyleIdx] = useState(0);
  const [fontsReady, setFontsReady] = useState(false);

  useEffect(() => { ensureJuiceFonts().then(() => setFontsReady(true)); }, []);
  useEffect(() => { const t = setTimeout(() => setDebounced(text), 180); return () => clearTimeout(t); }, [text]);
  // the preview flips through the six styles so the card is never static
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setStyleIdx((i) => (i + 1) % 6), 2200);
    return () => clearInterval(t);
  }, []);

  const results = useMemo(() => juice(debounced), [debounced, fontsReady]);
  const r = results[styleIdx];

  return (
    <div className={"mini" + (full ? " full" : "")}>
      <div className="mini-bar">
        <i style={{ background: "#8A6A44" }} /><i style={{ background: "#8BD630" }} /><i style={{ background: "#D8F27A" }} />
        <span className="mono">juice-bar.kiwi</span>
        <span className="mono mini-live">{full ? "● JUICED · 72/72" : "● LIVE · TRY IT"}</span>
      </div>
      <div className="jc-body">
        <div className="jc-preview" ref={posterRef}>
          <Thumb doc={r.doc} />
          <span className="jc-preview-tag">{r.vibe}</span>
        </div>
        <div className="jc-ctrl">
          <label className="mono mini-lbl" htmlFor="juice-input">YOUR BORING LINE</label>
          <input
            id="juice-input"
            className="mini-inp"
            value={text}
            maxLength={70}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && text.trim()) onJuice(text.trim()); }}
            placeholder="bake sale saturday 10am"
          />
          <div className="jc-examples">
            {EXAMPLE_IDEAS.slice(1, 4).map((ex) => (
              <button key={ex} className="jc-example" onClick={() => setText(ex)}>{ex}</button>
            ))}
          </div>
          <div className="jc-go">
            <button className="k-btn sm" onClick={() => onJuice(text.trim())} disabled={!text.trim()}>Juice it →</button>
            <span className="mono mini-lbl" style={{ margin: 0 }}>1 LINE · 6 POSTERS · 10 STYLES</span>
          </div>
        </div>
      </div>
    </div>
  );
}
