import { useEffect, useRef, useState } from "react";
import { Citrus, RefreshCw, Shuffle, Sparkles } from "lucide-react";
import { useEditor } from "../store";
import Thumb from "../editor/Thumb";
import { juiceWithAI, juiceBatch, rejuiceOne, moreLikeThis, EXAMPLE_IDEAS, type JuiceResult, type JuiceSession } from ".";
import "./juice.css";

// Juice It inside the editor: same engine, results load straight onto the canvas.
// The idea is typed in the panel's header search (DESIGN.md §15); Enter juices it.
export default function JuicePanel({ text, setText }: { text: string; setText: (v: string) => void }) {
  const loadDoc = useEditor((s) => s.loadDoc);
  const [batch, setBatch] = useState(0);
  const [busy, setBusy] = useState(false);
  const [results, setResults] = useState<JuiceResult[] | null>(null);
  const session = useRef<JuiceSession | null>(null);

  const run = async () => {
    if (!text.trim()) return;
    setBusy(true);
    const r = await juiceWithAI(text);
    session.current = r.session;
    setResults(r.results);
    setBatch((b) => b + 1);
    setBusy(false);
    r.upgrade.then((u) => { if (u) setResults((cur) => (cur === r.results ? u : cur)); });
  };
  const again = () => { if (!session.current) return; setResults(juiceBatch(session.current)); setBatch((b) => b + 1); };
  const swap = (i: number, r: JuiceResult) => setResults((rs) => rs && rs.map((x, j) => (j === i ? r : x)));

  const runRef = useRef(run);
  runRef.current = run;
  useEffect(() => {
    const on = (e: Event) => { if ((e as CustomEvent).detail === "juice") runRef.current(); };
    window.addEventListener("kiwiw:panel-enter", on);
    return () => window.removeEventListener("kiwiw:panel-enter", on);
  }, []);

  return (
    <>
      <p className="fx-note" style={{ marginTop: 0, marginBottom: 12 }}>Type one boring line in the box above. Six posters come out. Click one to drop it on the canvas.</p>
      <div className="row" style={{ marginBottom: 12 }}>
        <button className="btn primary sm" onClick={() => run()} disabled={busy || !text.trim()}>
          {busy ? <span className="spinner" /> : <><Citrus size={15} /> Juice it</>}
        </button>
        <button className="btn sm" onClick={again} disabled={busy || !results}><RefreshCw size={14} /> Re-juice all</button>
      </div>
      {!results && (
        <div className="st-cats" style={{ marginBottom: 12 }}>
          {EXAMPLE_IDEAS.map((ex) => <button key={ex} className="st-cat" style={{ textTransform: "none" }} onClick={() => setText(ex)}>{ex}</button>)}
        </div>
      )}
      {results && (
        <div className="jp-grid">
          {results.map((r, i) => (
            <div key={`${batch}-${i}`} className="jp-card" style={{ animationDelay: `${i * 60}ms` }}>
              <button className="jz-open" onClick={() => loadDoc(r.doc)} title={`${r.name}: ${r.joke}`}>
                <span className="jz-art" key={r.style + r.layout}><Thumb doc={r.doc} /></span>
              </button>
              <span>{r.name}</span>
              <span className="jz-acts sm">
                <button title="A different recipe" onClick={() => session.current && swap(i, rejuiceOne(session.current, results.map((x) => x.style)))}><Shuffle size={12} /></button>
                <button title="More like this: same recipe, new layout" onClick={() => session.current && swap(i, moreLikeThis(session.current, r.style))}><Sparkles size={12} /></button>
              </span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
