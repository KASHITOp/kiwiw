// Roast My Design (DESIGN.md §13): score, roasts, a Fix it on each.
import { useEffect, useMemo, useState } from "react";
import { Flame, X, Wand2 } from "lucide-react";
import { useEditor } from "../store";
import { roastDesign, verdict, type Roast } from "../personality/roast";
import { react, toast } from "../personality/bus";
import { aiRoasts } from "../ai/tools";
import type { KiwiwDoc } from "../types";

export default function RoastPanel({ onClose }: { onClose: () => void }) {
  const doc = useEditor((s) => s.doc);
  const { score, roasts } = useMemo(() => roastDesign(doc), [doc]);
  const [ai, setAi] = useState<string[] | null>(null);
  const [busy, setBusy] = useState(false);
  const fixable = roasts.filter((r) => r.fix);

  const fix = (r: Roast) => {
    useEditor.getState().replaceDoc(r.fix!(useEditor.getState().doc), true);
    toast(`Fixed: ${r.title.toLowerCase()}. You're welcome.`);
  };
  const fixAll = () => {
    let d: KiwiwDoc = useEditor.getState().doc;
    for (const r of fixable) d = r.fix!(d);
    useEditor.getState().replaceDoc(d, true);
    react("proud", "Fixed everything. I'd frame it.");
  };

  // Roast v2: Gemini writes the jokes about this exact design; the rule-based
  // roasts (and their one-click fixes) show instantly and never wait for it.
  useEffect(() => {
    let live = true;
    setBusy(true);
    aiRoasts(useEditor.getState().doc).then((r) => { if (live) { setAi(r); setBusy(false); } });
    return () => { live = false; };
  }, []);

  return (
    <aside className="roast" role="dialog" aria-label="Roast my design">
      <header className="roast-head">
        <Flame size={18} />
        <b>Roast my design</b>
        <button className="icon-btn" onClick={onClose} title="Close. The roast continues in our hearts."><X size={16} /></button>
      </header>
      <div className="roast-score">
        <span className="roast-num" style={{ ["--p" as string]: score }}>{score}</span>
        <div>
          <b>{verdict(score)}</b>
          <span>{roasts.length && roasts[0].severity ? `${roasts.length} note${roasts.length > 1 ? "s" : ""}, lovingly` : "Zero notes. Suspicious."}</span>
        </div>
      </div>
      <ul className="roast-list">
        {roasts.map((r) => (
          <li key={r.id}>
            <b>{r.title}</b>
            <p>{r.roast}</p>
            {r.fix && <button className="btn sm" onClick={() => fix(r)}><Wand2 size={14} /> Fix it</button>}
          </li>
        ))}
        {busy && <li className="roast-bonus"><b>Gemini is warming the tandoor…</b><p className="mg-brew"><span className="spinner" /> Extra-crispy roasts loading. The fixes above already work.</p></li>}
        {ai?.map((line, i) => <li key={i} className="roast-bonus"><b>Gemini says</b><p>{line}</p></li>)}
      </ul>
      <footer className="roast-foot">
        {fixable.length > 1 && <button className="btn primary sm" onClick={fixAll}><Wand2 size={14} /> Fix all {fixable.length}</button>}
      </footer>
    </aside>
  );
}
