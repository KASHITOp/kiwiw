import { useState } from "react";
import { Citrus, RefreshCw } from "lucide-react";
import { useEditor } from "../store";
import Thumb from "../editor/Thumb";
import { juiceWithAI, DEFAULT_IDEA, EXAMPLE_IDEAS, type JuiceResult } from ".";
import "./juice.css";

// Juice It inside the editor: same engine, results load straight onto the canvas.
export default function JuicePanel() {
  const loadDoc = useEditor((s) => s.loadDoc);
  const [text, setText] = useState(DEFAULT_IDEA);
  const [variant, setVariant] = useState(0);
  const [busy, setBusy] = useState(false);
  const [results, setResults] = useState<JuiceResult[] | null>(null);

  const run = async (v = 0) => {
    if (!text.trim()) return;
    setBusy(true);
    setVariant(v);
    const r = await juiceWithAI(text, v);
    setResults(r.results);
    setBusy(false);
  };

  return (
    <>
      <h4>Juice it</h4>
      <p className="fx-note" style={{ marginTop: 0, marginBottom: 12 }}>One boring line in, six posters out. Click one to drop it on the canvas.</p>
      <div className="jp-input">
        <input type="text" value={text} maxLength={70} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && run(0)} placeholder="bake sale saturday 10am" aria-label="Your boring line" />
      </div>
      <div className="row" style={{ marginBottom: 12 }}>
        <button className="btn primary sm" onClick={() => run(0)} disabled={busy || !text.trim()}>
          {busy ? <span className="spinner" /> : <><Citrus size={15} /> Juice it</>}
        </button>
        <button className="btn sm" onClick={() => run(variant + 1)} disabled={busy || !results}><RefreshCw size={14} /> Re-juice</button>
      </div>
      {!results && (
        <div className="st-cats" style={{ marginBottom: 12 }}>
          {EXAMPLE_IDEAS.map((ex) => <button key={ex} className="st-cat" style={{ textTransform: "none" }} onClick={() => setText(ex)}>{ex}</button>)}
        </div>
      )}
      {results && (
        <div className="jp-grid">
          {results.map((r, i) => (
            <button key={r.style + variant} className="jp-card" style={{ animationDelay: `${i * 60}ms` }} onClick={() => loadDoc(r.doc)} title={`Load the ${r.name} version`}>
              <span className="jz-art"><Thumb doc={r.doc} /></span>
              <span>{r.vibe} · {r.name}</span>
            </button>
          ))}
        </div>
      )}
    </>
  );
}
