import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useEditor } from "../store";
import { TEMPLATES } from "../data/templates";
import type { Template } from "../types";
import Thumb from "../editor/Thumb";

function Tile({ t, i, dup }: { t: Template; i: number; dup?: boolean }) {
  const navigate = useNavigate();
  const loadDoc = useEditor((s) => s.loadDoc);
  const open = (e: React.MouseEvent) => {
    // a drag that ends on a tile is not a click
    if ((e.currentTarget.closest(".mq-tilt") as HTMLElement | null)?.dataset.dragged === "1") return;
    loadDoc(t.doc); navigate("/editor");
  };
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
      <div className="mq-shift">
      <div className="mq-track">
        {items.map((t) => <Tile key={t.id} t={t} i={TEMPLATES.indexOf(t)} />)}
        {items.map((t) => <Tile key={t.id + "-dup"} t={t} i={TEMPLATES.indexOf(t)} dup />)}
      </div>
      </div>
    </div>
  );
}

export default function Marquee() {
  const a = TEMPLATES;
  const b = [...TEMPLATES].reverse();
  const wall = useRef<HTMLDivElement>(null);
  // drag the whole wall sideways; each row wraps by half its (doubled) width, so it never ends
  const drag = useRef<{ x: number; off: number; moved: boolean } | null>(null);
  const off = useRef(0);
  const apply = () => wall.current?.querySelectorAll<HTMLElement>(".mq-shift").forEach((el, i) => {
    const half = (el.firstElementChild as HTMLElement).scrollWidth / 2 || 1;
    const v = ((((i ? -off.current : off.current) % half) + half) % half) - half;
    el.style.transform = `translateX(${v}px)`;
  });
  const down = (e: React.PointerEvent) => { drag.current = { x: e.clientX, off: off.current, moved: false }; wall.current!.dataset.dragged = "0"; };
  const move = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 5) { d.moved = true; wall.current!.dataset.dragged = "1"; wall.current!.classList.add("dragging"); }
    off.current = d.off + dx;
    apply();
  };
  const up = () => { drag.current = null; wall.current?.classList.remove("dragging"); setTimeout(() => { if (wall.current) wall.current.dataset.dragged = "0"; }, 0); };
  return (
    <section id="templates" className="sec mq">
      <div className="sec-head">
        <div className="mono eyebrow">[06] THE PANTRY · {TEMPLATES.length} TEMPLATES, PRE-SLICED</div>
        <h2 className="display sec-h2">Templates, pre&#8209;sliced.</h2>
        <p className="sec-sub">Every tile is a real render of an editable file. Grab the wall and fling it. Click one to start cutting.</p>
      </div>
      <div className="mq-tilt" ref={wall} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerLeave={up}>
        <Row items={a} />
        <Row items={b} reverse />
      </div>
    </section>
  );
}
