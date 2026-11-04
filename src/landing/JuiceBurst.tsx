import type { UserPhoto } from "../juice/photo";
// Landing hero demo, inline (no overlay): the line typed in the hero card
// lands here, a kiwi splits, and six posters fly out of the cut like seeds
// into a fan. Same Juice It 2.0 session engine and per-card actions.
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RefreshCw, Shuffle, Sparkles } from "lucide-react";
import { useEditor } from "../store";
import KiwiSlice from "../brand/KiwiSlice";
import Thumb from "../editor/Thumb";
import { juiceWithAI, juiceBatch, rejuiceOne, moreLikeThis, type JuiceResult, type JuiceSession } from "../juice";

export default function JuiceBurst({ text, nonce, photo }: { text: string; nonce: number; photo?: UserPhoto }) {
  const navigate = useNavigate();
  const loadDoc = useEditor((s) => s.loadDoc);
  const [results, setResults] = useState<JuiceResult[] | null>(null);
  const [batch, setBatch] = useState(0);
  const [ai, setAi] = useState(false);
  const session = useRef<JuiceSession | null>(null);
  const secRef = useRef<HTMLElement>(null);
  const kiwiRef = useRef<HTMLDivElement>(null);
  const kl = useRef<HTMLDivElement>(null), kr = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!nonce) return;
    let live = true;
    secRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    juiceWithAI(text, 0, undefined, photo).then((r) => {
      if (!live) return;
      session.current = r.session; setResults(r.results); setAi(r.ai); setBatch((b) => b + 1);
      // AI copy swaps in place, unless the user already re-juiced
      r.upgrade.then((u) => { if (live && u) { setResults((cur) => (cur === r.results ? u : cur)); setAi(true); } });
    });
    return () => { live = false; };
  }, [text, nonce, photo]);

  // the burst: kiwi splits, cards fly from the cut to their fan slots
  useLayoutEffect(() => {
    if (!results || !kiwiRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const k = kiwiRef.current.getBoundingClientRect();
    const cx = k.left + k.width / 2, cy = k.top + k.height / 2;
    const split = (dir: 1 | -1) => [
      { transform: "translate(0,0) rotate(0)", opacity: 1 },
      { transform: `translate(${dir * 70}px, ${dir * 6}px) rotate(${dir * 14}deg)`, opacity: 1, offset: 0.45 },
      { transform: `translate(${dir * 120}px, ${dir * 10}px) rotate(${dir * 20}deg)`, opacity: 1 },
    ];
    kl.current?.animate(split(-1), { duration: 900, easing: "cubic-bezier(.3,.7,.3,1)", fill: "forwards" });
    kr.current?.animate(split(1), { duration: 900, easing: "cubic-bezier(.3,.7,.3,1)", fill: "forwards" });
    secRef.current?.querySelectorAll<HTMLElement>(".jb-card").forEach((card, i) => {
      const r = card.getBoundingClientRect();
      const dx = cx - (r.left + r.width / 2), dy = cy - (r.top + r.height / 2);
      card.animate(
        [
          { transform: `translate(${dx}px, ${dy}px) scale(.06) rotate(${(i - 2.5) * 30}deg)`, opacity: 0 },
          { transform: `translate(${dx * 0.08}px, ${dy * 0.08}px) scale(1.05)`, opacity: 1, offset: 0.72 },
          { transform: "none", opacity: 1 },
        ],
        { duration: 820, delay: 260 + i * 90, easing: "cubic-bezier(.2,.9,.25,1)", fill: "backwards" },
      );
    });
  }, [batch]);

  const open = (r: JuiceResult) => { loadDoc(r.doc); navigate("/editor"); };
  const swap = (i: number, r: JuiceResult) => setResults((rs) => rs && rs.map((x, j) => (j === i ? r : x)));
  const again = () => { if (!session.current) return; setResults(juiceBatch(session.current)); setBatch((b) => b + 1); };

  if (!nonce) return null;
  return (
    <section className="sec jb" ref={secRef} aria-live="polite">
      <div className="jb-head">
        <div>
          <div className="mono eyebrow">JUICE IT · 6 RECIPES {ai && "· AI COPY"}</div>
          <h2 className="display jb-title">{photo && !text ? "Your photo, but juicy." : <>“{session.current?.text ?? text}”, but juicy.</>}</h2>
        </div>
        <button className="k-btn sm" onClick={again} disabled={!results}><RefreshCw size={15} /> Re-juice all</button>
      </div>
      <div className="jb-kiwi" ref={kiwiRef} aria-hidden="true">
        <div ref={kl}><KiwiSlice half="left" /></div>
        <div ref={kr}><KiwiSlice half="right" /></div>
      </div>
      {!results && <div className="mono jb-wait">Squeezing…</div>}
      {results && (
        <div className="jb-fan">
          {results.map((r, i) => (
            <div key={`${batch}-${i}`} className="jb-card" style={{ ["--r" as string]: `${(i - 2.5) * 3.2}deg`, ["--y" as string]: `${Math.abs(i - 2.5) * 12}px` }}>
              <button className="jz-open" onClick={() => open(r)} aria-label={`Open the ${r.name} version in the editor`}>
                <span className="jz-art" key={r.style + r.layout}><Thumb doc={r.doc} /></span>
              </button>
              <span className="jz-meta"><b>{r.name}</b><span>{r.joke}</span></span>
              <span className="jz-acts">
                <button onClick={() => open(r)}>Open</button>
                <button title="A different recipe in this slot" onClick={() => session.current && swap(i, rejuiceOne(session.current, results.map((x) => x.style)))}><Shuffle size={13} /> Re-juice</button>
                <button title="Same recipe, new layout, photo and copy" onClick={() => session.current && swap(i, moreLikeThis(session.current, r.style))}><Sparkles size={13} /> More</button>
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
