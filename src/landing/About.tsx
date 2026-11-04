// About the maker. Copy + links live in src/content/about.ts.
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import KiwiSlice from "../brand/KiwiSlice";
import { ABOUT } from "../content/about";

export default function About() {
  const [photo, setPhoto] = useState<"loading" | "ok" | "missing">("loading");
  return (
    <section id="about" className="sec about">
      <div className="ab-photo">
        <KiwiSlice R={160} detail={0.7} pad={8} className="ab-ring" />
        <div className="ab-hole">
          {photo !== "missing" && (
            <img src={ABOUT.photo} alt={ABOUT.name} onLoad={() => setPhoto("ok")} onError={() => setPhoto("missing")} style={{ opacity: photo === "ok" ? 1 : 0 }} />
          )}
          {photo !== "ok" && <span className="mono ab-wait">{ABOUT.photoPlaceholder}</span>}
        </div>
      </div>
      <div className="ab-text">
        <div className="mono eyebrow">[10] ABOUT THE MAKER</div>
        <h2 className="display sec-h2">{ABOUT.heading}</h2>
        <div className="ab-body">{ABOUT.body.map((para, i) => <p key={i}>{para}</p>)}</div>
        <div className="ab-links">
          {ABOUT.links.map((l) => (
            <a key={l.label} href={l.href} target={l.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="ab-link">
              {l.label} <ArrowUpRight size={15} />
            </a>
          ))}
        </div>
        <div className="mono ab-stats">
          {ABOUT.stats.map((s) => <span key={s.k}>{s.k}: <b>{s.v}</b></span>)}
        </div>
      </div>
      <BoardingPass />
    </section>
  );
}

/** The layover that started it, as a boarding pass (own SVG barcode + perforation). */
function BoardingPass() {
  const b = ABOUT.boardingPass;
  // deterministic "barcode": bar widths from the letters of the result
  const bars = Array.from({ length: 46 }, (_, i) => 1 + ((b.result.charCodeAt(i % b.result.length) * (i + 3)) % 4));
  let x = 0;
  return (
    <div className="bp" role="img" aria-label={`Boarding pass: from ${b.from.city} to ${b.to.city}, status ${b.status}, result ${b.result}`}>
      <div className="bp-main">
        <div className="bp-top mono"><span>BOARDING PASS</span><span>{b.flight}</span></div>
        <div className="bp-route">
          <div><b>{b.from.code}</b><span className="mono">{b.from.city}</span></div>
          <span className="bp-plane" aria-hidden="true">✈</span>
          <div><b>{b.to.code}</b><span className="mono">{b.to.city}</span></div>
        </div>
        <div className="bp-grid mono">
          <div><i>STATUS</i><b className="bp-delayed">{b.status}</b></div>
          <div><i>GATE</i><b>{b.gate}</b></div>
          <div><i>SEAT</i><b>{b.seat}</b></div>
        </div>
      </div>
      <div className="bp-stub">
        <div className="mono bp-res"><i>RESULT</i><b>{b.result}</b></div>
        <svg className="bp-code" viewBox="0 0 160 44" preserveAspectRatio="none" aria-hidden="true">
          {bars.map((w, i) => { const r = <rect key={i} x={x} y="0" width={w} height="44" />; x += w + (i % 3 === 0 ? 2.5 : 1.5); return r; })}
        </svg>
      </div>
    </div>
  );
}
