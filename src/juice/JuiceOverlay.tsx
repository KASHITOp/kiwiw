import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RefreshCw, X, Shuffle, Sparkles } from "lucide-react";
import { useEditor } from "../store";
import KiwiSlice from "../brand/KiwiSlice";
import Thumb from "../editor/Thumb";
import { juiceWithAI, juiceBatch, rejuiceOne, moreLikeThis, type JuiceResult, type JuiceSession } from ".";
import "./juice.css";

interface Props {
  text: string;
  onClose: () => void;
}

const LOADING = ["Squeezing…", "Removing the boring bits…", "Adding unnecessary sparkle…", "Cutting the kiwi…"];

// The reveal: a kiwi splits open and six posters burst out like seeds.
export default function JuiceOverlay({ text, onClose }: Props) {
  const navigate = useNavigate();
  const loadDoc = useEditor((s) => s.loadDoc);
  const [results, setResults] = useState<JuiceResult[] | null>(null);
  const [batch, setBatch] = useState(0);
  const session = useRef<JuiceSession | null>(null);
  const [ai, setAi] = useState(false);
  const [msg] = useState(() => LOADING[Math.floor(Math.random() * LOADING.length)]);
  const stageRef = useRef<HTMLDivElement>(null);
  const kiwiL = useRef<HTMLDivElement>(null);
  const kiwiR = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let alive = true;
    setResults(null);
    juiceWithAI(text).then((r) => { if (alive) { session.current = r.session; setResults(r.results); setAi(r.ai); } });
    return () => { alive = false; };
  }, [text]);

  // Re-juice: six new compositions (new recipes first, never a repeat combo)
  const rejuiceAll = () => { if (!session.current) return; setResults(juiceBatch(session.current)); setBatch((b) => b + 1); };
  const swap = (i: number, r: JuiceResult) => setResults((rs) => rs && rs.map((x, j) => (j === i ? r : x)));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [onClose]);

  // Choreography: kiwi splits, then cards fly out of the cut to their slots.
  useLayoutEffect(() => {
    if (!results || !stageRef.current) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const stage = stageRef.current.getBoundingClientRect();
    const cx = stage.left + stage.width / 2, cy = Math.min(stage.top + stage.height / 2, window.innerHeight / 2);
    const ease = "cubic-bezier(.2,.9,.25,1)";
    // hold the split long enough to read, then let it dissolve behind the cards
    const split = (dir: 1 | -1) => [
      { transform: "translate(0,0) rotate(0) scale(.6)", opacity: 0 },
      { transform: "translate(0,0) rotate(0) scale(1)", opacity: 1, offset: 0.18 },
      { transform: `translate(${dir * 120}px,${dir * 16}px) rotate(${dir * 13}deg) scale(1)`, opacity: 1, offset: 0.55 },
      { transform: `translate(${dir * 210}px,${dir * 28}px) rotate(${dir * 19}deg) scale(1.05)`, opacity: 0 },
    ];
    kiwiL.current?.animate(split(-1), { duration: 1500, easing: "cubic-bezier(.3,.7,.3,1)", fill: "forwards" });
    kiwiR.current?.animate(split(1), { duration: 1500, easing: "cubic-bezier(.3,.7,.3,1)", fill: "forwards" });
    stageRef.current.querySelectorAll<HTMLElement>(".jz-card").forEach((card, i) => {
      const r = card.getBoundingClientRect();
      const dx = cx - (r.left + r.width / 2), dy = cy - (r.top + r.height / 2);
      const spin = (i % 2 ? 1 : -1) * (18 + i * 4);
      card.animate(
        [
          { transform: `translate(${dx}px,${dy}px) scale(.08) rotate(${spin}deg)`, opacity: 0 },
          { transform: `translate(${dx * 0.1}px,${dy * 0.1}px) scale(1.06) rotate(${spin / 6}deg)`, opacity: 1, offset: 0.7 },
          { transform: "none", opacity: 1 },
        ],
        { duration: 780, delay: 620 + i * 80, easing: ease, fill: "backwards" },
      );
    });
  }, [results]);

  const open = (r: JuiceResult) => { loadDoc(r.doc); onClose(); navigate("/editor"); };

  return (
    <div className="jz" role="dialog" aria-modal="true" aria-label="Juice It results">
      <div className="jz-head">
        <div>
          <div className="jz-eyebrow">JUICE IT · 6 WAYS {ai && "· AI COPY"}</div>
          <h2 className="jz-title">“{text}”, but juicy.</h2>
        </div>
        <div className="jz-actions">
          <button className="jz-btn" onClick={rejuiceAll} disabled={!results}><RefreshCw size={16} /> Re-juice all</button>
          <button className="jz-btn icon" onClick={onClose} aria-label="Close"><X size={18} /></button>
        </div>
      </div>
      <div className="jz-stage" ref={stageRef}>
        {!results && <div className="jz-loading">{msg}</div>}
        {results && (
          <>
            <div className="jz-kiwi" aria-hidden="true">
              <div ref={kiwiL}><KiwiSlice half="left" /></div>
              <div ref={kiwiR}><KiwiSlice half="right" /></div>
            </div>
            <div className="jz-grid">
              {results.map((r, i) => (
                <div key={`${batch}-${i}`} className="jz-card">
                  <button className="jz-open" onClick={() => open(r)} aria-label={`Open the ${r.name} version in the editor`}>
                    <span className="jz-art" key={r.style + r.layout}><Thumb doc={r.doc} /></span>
                  </button>
                  <span className="jz-meta">
                    <b>{r.name}</b>
                    <span>{r.joke}</span>
                  </span>
                  <span className="jz-acts">
                    <button onClick={() => open(r)}>Open</button>
                    <button title="A different recipe in this slot" onClick={() => session.current && swap(i, rejuiceOne(session.current, results.map((x) => x.style)))}><Shuffle size={13} /> Re-juice</button>
                    <button title="Same recipe, new layout, photo and copy" onClick={() => session.current && swap(i, moreLikeThis(session.current, r.style))}><Sparkles size={13} /> More</button>
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
