import { useNavigate } from "react-router-dom";
import { useEditor } from "../store";
import { TEMPLATES } from "../data/templates";
import type { Template } from "../types";
import Thumb from "../editor/Thumb";

function Tile({ t, i, dup }: { t: Template; i: number; dup?: boolean }) {
  const navigate = useNavigate();
  const loadDoc = useEditor((s) => s.loadDoc);
  const open = () => { loadDoc(t.doc); navigate("/editor"); };
  return (
    <button
      className="mq-tile"
      onClick={open}
      tabIndex={dup ? -1 : 0}
      aria-hidden={dup ? true : undefined}
      aria-label={dup ? undefined : `Open the ${t.name} template`}
    >
      <span className="mq-art" style={{ aspectRatio: `${t.doc.width} / ${t.doc.height}` }}>
        <Thumb doc={t.doc} />
      </span>
      <span className="mono mq-cap">TPL-{String(i + 1).padStart(2, "0")} · {t.name.toUpperCase()}</span>
    </button>
  );
}

function Row({ items, reverse }: { items: Template[]; reverse?: boolean }) {
  return (
    <div className={"mq-row" + (reverse ? " rev" : "")}>
      <div className="mq-track">
        {items.map((t) => <Tile key={t.id} t={t} i={TEMPLATES.indexOf(t)} />)}
        {items.map((t) => <Tile key={t.id + "-dup"} t={t} i={TEMPLATES.indexOf(t)} dup />)}
      </div>
    </div>
  );
}

export default function Marquee() {
  const a = TEMPLATES;
  const b = [...TEMPLATES].reverse();
  return (
    <section id="templates" className="sec mq">
      <div className="sec-head">
        <div className="mono eyebrow">[02] THE PANTRY · {TEMPLATES.length} TEMPLATES, PRE-SLICED</div>
        <h2 className="display sec-h2">Templates, pre&#8209;sliced.</h2>
        <p className="sec-sub">Every tile is a real render of an editable file. Hover to stop the belt, click to start cutting.</p>
      </div>
      <div className="mq-tilt">
        <Row items={a} />
        <Row items={b} reverse />
      </div>
    </section>
  );
}
