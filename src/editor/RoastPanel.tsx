// Roast My Design (DESIGN.md §13): score, roasts, a Fix it on each.
import { useMemo, useState } from "react";
import { Flame, X, Wand2 } from "lucide-react";
import { useEditor } from "../store";
import { roastDesign, verdict, type Roast } from "../personality/roast";
import { react, toast } from "../personality/bus";
import { keys } from "../ai/provider";
import type { KiwiwDoc } from "../types";

export default function RoastPanel({ onClose }: { onClose: () => void }) {
  const doc = useEditor((s) => s.doc);
  const { score, roasts } = useMemo(() => roastDesign(doc), [doc]);
  const [bonus, setBonus] = useState<string | null>(null);
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

  const aiRoast = async () => {
    setBusy(true);
    try {
      const summary = doc.elements.map((e) => e.type === "text" ? `text "${e.text.slice(0, 40)}" ${e.fontFamily} ${Math.round(e.fontSize)}px ${e.color}` : e.type).join("; ");
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${keys.openai}` },
        body: JSON.stringify({
          model: "gpt-4o-mini", temperature: 1,
          messages: [
            { role: "system", content: "You roast graphic designs in one funny sentence under 20 words. Roast the design, never the person. Be specific." },
            { role: "user", content: `Background ${doc.background}, ${doc.width}x${doc.height}. Elements: ${summary}` },
          ],
        }),
      });
      if (!res.ok) throw new Error(`OpenAI ${res.status}`);
      const data = await res.json();
      setBonus(data.choices?.[0]?.message?.content?.trim() ?? null);
    } catch (e) {
      toast(`The AI roaster choked on a seed. Rule-based roasts still work. (${(e as Error).message})`);
    } finally { setBusy(false); }
  };

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
        {bonus && <li className="roast-bonus"><b>Bonus roast (AI)</b><p>{bonus}</p></li>}
      </ul>
      <footer className="roast-foot">
        {fixable.length > 1 && <button className="btn primary sm" onClick={fixAll}><Wand2 size={14} /> Fix all {fixable.length}</button>}
        {keys.openai && <button className="btn sm" onClick={aiRoast} disabled={busy}>{busy ? <span className="spinner" /> : <><Flame size={14} /> Extra crispy (AI)</>}</button>}
      </footer>
    </aside>
  );
}
