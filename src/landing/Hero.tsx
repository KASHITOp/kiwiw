import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import KiwiSlice from "../brand/KiwiSlice";
import KiwiLogo from "../brand/KiwiLogo";
import { rng } from "../brand/kiwi";
import { useEditor } from "../store";
import HeroEditor from "./HeroEditor";
import { useMedia } from "./useMedia";

const SEEDS = 72;
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const easeOut = (t: number) => 1 - (1 - t) ** 3;
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

export default function Hero() {
  const desktop = useMedia("(min-width: 900px)");
  const reduced = useMedia("(prefers-reduced-motion: reduce)");
  const fine = useMedia("(pointer: fine)");
  const pinned = desktop && !reduced;
  const newDoc = useEditor((s) => s.newDoc);

  const pinRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const kiwiRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const seedLayerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLElement>(null);
  const posterRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const fullRef = useRef(false);
  const [full, setFull] = useState(false);

  // Each seed gets a launch window along the scroll, a spot on the cut, and a landing spot in the poster.
  const seeds = useMemo(() => {
    const r = rng(42);
    return Array.from({ length: SEEDS }, (_, i) => ({
      t0: 0.12 + (i / (SEEDS - 1)) * 0.58,
      jx: r() - 0.5, jy: r() - 0.5,
      tx: 0.12 + r() * 0.76, ty: 0.12 + r() * 0.76,
      bend: r() - 0.5, lift: 0.6 + r() * 0.8,
      r0: r() * 360, spin: (r() - 0.5) * 720,
    }));
  }, []);

  useEffect(() => {
    let raf = 0;
    const els = Array.from(seedLayerRef.current!.children) as HTMLElement[];
    const tick = () => {
      raf = 0;
      const hero = heroRef.current, kiwi = kiwiRef.current, poster = posterRef.current;
      if (!hero || !kiwi || !poster) return;
      const hr = hero.getBoundingClientRect();
      const kr = kiwi.getBoundingClientRect();
      const pr = poster.getBoundingClientRect();
      const vh = window.innerHeight;

      let p = 0;
      if (reduced) p = 0;
      else if (pinned) {
        const pin = pinRef.current!.getBoundingClientRect();
        p = clamp01(-pin.top / Math.max(1, pin.height - vh));
      } else p = clamp01((vh * 0.5 - kr.top) / (vh * 0.8));

      // 1. the crack widens and the halves swing apart
      const s = easeOut(clamp01(p / 0.3));
      const w = kr.width;
      leftRef.current!.style.transform = `translate3d(${(-s * w * 0.075).toFixed(1)}px,${(-s * w * 0.015).toFixed(1)}px,0) rotate(${(-7 * s).toFixed(2)}deg)`;
      rightRef.current!.style.transform = `translate3d(${(s * w * 0.075).toFixed(1)}px,${(s * w * 0.02).toFixed(1)}px,0) rotate(${(6 * s).toFixed(2)}deg)`;

      // 2. seeds leave the cut and land in the poster
      const cx = kr.left - hr.left + kr.width / 2;
      const cy = kr.top - hr.top + kr.height / 2;
      const px = pr.left - hr.left;
      const py = pr.top - hr.top;
      let count = 0;
      for (let i = 0; i < SEEDS; i++) {
        const sd = seeds[i];
        const el = els[i];
        const u = clamp01((p - sd.t0) / 0.22);
        if (u <= 0 || u >= 1) {
          if (u >= 1) count++;
          el.style.opacity = "0";
          continue;
        }
        const sx = cx + sd.jx * w * 0.04;
        const sy = cy + sd.jy * kr.height * 0.5;
        const ex = px + sd.tx * pr.width;
        const ey = py + sd.ty * pr.height;
        const mx = (sx + ex) / 2 + sd.bend * w * 0.3;
        const my = Math.min(sy, ey) - sd.lift * Math.min(220, kr.height * 0.35);
        const e = easeInOut(u);
        const a = (1 - e) * (1 - e), b = 2 * (1 - e) * e, c = e * e;
        const x = a * sx + b * mx + c * ex;
        const y = a * sy + b * my + c * ey;
        el.style.opacity = String(u < 0.8 ? 1 : (1 - u) / 0.2);
        el.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) rotate(${(sd.r0 + u * sd.spin).toFixed(0)}deg) scale(${(1 - 0.35 * u).toFixed(2)})`;
      }

      // 3. the counter counts what actually landed
      if (counterRef.current) counterRef.current.textContent = String(count).padStart(3, "0");
      const f = count >= SEEDS;
      if (f !== fullRef.current) { fullRef.current = f; setFull(f); }
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(tick); };
    tick();
    const settle = setTimeout(on, 300); // after fonts settle
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      cancelAnimationFrame(raf);
      clearTimeout(settle);
    };
  }, [pinned, reduced, seeds]);

  const onKiwiMove = (e: React.PointerEvent) => {
    const c = cursorRef.current, k = kiwiRef.current;
    if (!c || !k) return;
    const r = k.getBoundingClientRect();
    c.style.transform = `translate(${e.clientX - r.left}px, ${e.clientY - r.top}px)`;
    c.style.opacity = "1";
  };
  const onKiwiLeave = () => { if (cursorRef.current) cursorRef.current.style.opacity = "0"; };

  return (
    <section className="hero-pin" ref={pinRef}>
      <div className="hero" ref={heroRef}>
        <div className="hero-inner">
          <nav className="hero-nav">
            <Link to="/" className="brand"><KiwiLogo size={30} /><span className="display">Kiwiw</span></Link>
            <div className="nav-links mono">
              <a href="#templates">Templates</a>
              <a href="#magic">Magic</a>
              <Link to="/editor">Editor</Link>
              <a href="https://github.com/KASHITOp/kiwiw" target="_blank" rel="noreferrer">GitHub</a>
            </div>
            <Link to="/editor" className="k-btn sm nav-cta">Open editor →</Link>
          </nav>

          <div className="hero-head">
            <div className="mono eyebrow">[01] FIG. 1 · A KIWI, CUT CLEAN IN HALF</div>
            <h1 className="display hero-h1">Plain idea in.<br /><span className="juicy">Juicy design out.</span></h1>
          </div>

          <div className="hero-copy">
            <p>Type the plain version. Kiwiw hands back the juicy one: layout, type, colour, done. No design degree required. We checked.</p>
            <div className="hero-ctas">
              <Link to="/editor" className="k-btn" onClick={() => newDoc(1080, 1080)}>Start cutting →</Link>
              <a href="#templates" className="mono k-ghost">Browse the pantry</a>
            </div>
          </div>

          <div className="hero-card"><HeroEditor posterRef={posterRef} full={full} /></div>

          <div className="hero-kiwi" ref={kiwiRef} onPointerMove={fine ? onKiwiMove : undefined} onPointerLeave={onKiwiLeave}>
            <div className="half" ref={leftRef}><KiwiSlice half="left" /></div>
            <div className="half" ref={rightRef}><KiwiSlice half="right" /></div>
            <svg className="anno-lines" viewBox="-330 -330 660 660" aria-hidden="true">
              <line x1="36" y1="-330" x2="4" y2="-298" />
              <line className="anno-desk-line" x1="150" y1="280" x2="186" y2="224" />
              <line className="anno-desk-line" x1="-250" y1="292" x2="-64" y2="60" />
            </svg>
            <span className="anno mono" style={{ left: "56%", top: "-2%" }}>CUT · SCROLL TO SPLIT</span>
            <span className="anno mono anno-desk" style={{ left: "70%", top: "93%" }}>FUZZ · BORING</span>
            <span className="anno mono anno-desk" style={{ left: "0%", top: "95%" }}>SEEDS · 72 (WE COUNTED)</span>
            {fine && <div className="k-cursor" ref={cursorRef}><i /></div>}
          </div>

          <div className="hero-foot mono">
            <span>SEEDS COLLECTED <b ref={counterRef}>000</b> / 072 ✦</span>
            <span className="scroll-hint">↓ SCROLL TO SPLIT IT</span>
          </div>
        </div>
        <div className="seed-layer" ref={seedLayerRef} aria-hidden="true">
          {seeds.map((_, i) => <i key={i} />)}
        </div>
      </div>
    </section>
  );
}
