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
        <div className="mono eyebrow">[08] ABOUT THE MAKER</div>
        <h2 className="display sec-h2">{ABOUT.heading}</h2>
        <p className="ab-body">{ABOUT.body}</p>
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
    </section>
  );
}
