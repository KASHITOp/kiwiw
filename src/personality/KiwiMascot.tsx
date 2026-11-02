// The editor mascot (DESIGN.md §13): a happy kiwi slice in the corner.
// Reacts only to real events, never blocks anything. Click it to squeeze a seed.
import { useEffect, useRef, useState } from "react";
import { useBus, react, type Mood } from "./bus";
import { useEditor } from "../store";
import { fontDef } from "../fonts/kit";

const SEED_LINES: Record<number, string> = {
  1: "Ow. That was a seed.",
  10: "10 seeds squeezed. I have about 90 left.",
  25: "25 seeds. Is this a cry for help?",
  50: "50 seeds. You've found the seed counter. Tell no one.",
  100: "100 seeds. I am now a cucumber.",
};

const IDLE_LINES = ["Looking juicy.", "Tip: press ? for shortcuts.", "Try the Vibe slider. Go on."];

function readSeeds() {
  try { return Number(localStorage.getItem("kiwiw.seeds") ?? 0) || 0; } catch { return 0; }
}

export default function KiwiMascot() {
  const { mood, line, moodKey } = useBus();
  const [shown, setShown] = useState<{ mood: Mood; line: string | null }>({ mood: "idle", line: null });
  const [seeds, setSeeds] = useState(readSeeds);
  const fonts = useEditor((s) => s.doc.elements.map((e) => (e.type === "text" ? e.fontFamily : "")).join("|"));
  const sawComic = useRef(false);

  // comic-energy fonts get a reaction once per appearance
  useEffect(() => {
    const comic = fonts.split("|").some((f) => f && fontDef(f)?.comicEnergy);
    if (comic && !sawComic.current) react("shook", "Comic Sans energy detected. Respect.");
    sawComic.current = comic;
  }, [fonts]);

  useEffect(() => {
    if (!moodKey) return;
    setShown({ mood, line });
    const t = setTimeout(() => setShown({ mood: "idle", line: null }), mood === "squeeze" ? 1400 : 3200);
    return () => clearTimeout(t);
  }, [mood, line, moodKey]);

  const poke = () => {
    const n = seeds + 1;
    setSeeds(n);
    try { localStorage.setItem("kiwiw.seeds", String(n)); } catch { /* private mode: seeds are free */ }
    react("squeeze", SEED_LINES[n] ?? (n % 7 === 0 ? IDLE_LINES[(n / 7) % IDLE_LINES.length] : `Seeds squeezed: ${n}`));
  };

  return (
    <div className={`mascot m-${shown.mood}`}>
      {shown.line && <div className="mascot-say" key={moodKey}>{shown.line}</div>}
      <button className="mascot-btn" onClick={poke} aria-label={`Kiwi mascot. Seeds squeezed: ${seeds}`} title="Squeeze me">
        <KiwiFace mood={shown.mood} />
      </button>
    </div>
  );
}

/** Original drawing: a kiwi slice with a face and tiny feet. */
function KiwiFace({ mood }: { mood: Mood }) {
  const seeds = Array.from({ length: 14 }, (_, i) => {
    const a = (i / 14) * Math.PI * 2;
    return <ellipse key={i} cx={40 + Math.cos(a) * 19} cy={40 + Math.sin(a) * 19} rx={1.6} ry={3.2} transform={`rotate(${(a * 180) / Math.PI + 90} ${40 + Math.cos(a) * 19} ${40 + Math.sin(a) * 19})`} fill="#1B1508" />;
  });
  const eyes =
    mood === "shook" ? <><circle cx={33} cy={37} r={4.2} fill="#fff" stroke="#1B1508" strokeWidth={1.6} /><circle cx={47} cy={37} r={4.2} fill="#fff" stroke="#1B1508" strokeWidth={1.6} /><circle cx={33} cy={37} r={1.5} fill="#1B1508" /><circle cx={47} cy={37} r={1.5} fill="#1B1508" /></>
    : mood === "squeeze" ? <path d="M29 35 l5 3 -5 3 M51 35 l-5 3 5 3" stroke="#1B1508" strokeWidth={2.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    : mood === "judging" ? <><path d="M29 38 h8 M43 38 h8" stroke="#1B1508" strokeWidth={2.4} strokeLinecap="round" /><path d="M43 33 l8 -2" stroke="#1B1508" strokeWidth={2} strokeLinecap="round" /></>
    : mood === "happy" || mood === "proud" ? <path d="M29 39 q4 -5 8 0 M43 39 q4 -5 8 0" stroke="#1B1508" strokeWidth={2.2} fill="none" strokeLinecap="round" />
    : <><circle cx={33} cy={37} r={2.4} fill="#1B1508" /><circle cx={47} cy={37} r={2.4} fill="#1B1508" /></>;
  const mouth =
    mood === "shook" ? <ellipse cx={40} cy={47} rx={3} ry={3.6} fill="#1B1508" />
    : mood === "judging" ? <path d="M35 47 h10" stroke="#1B1508" strokeWidth={2} strokeLinecap="round" />
    : mood === "squeeze" ? <path d="M35 46 q5 -3 10 0" stroke="#1B1508" strokeWidth={2} fill="none" strokeLinecap="round" />
    : <path d="M34 45 q6 6 12 0" stroke="#1B1508" strokeWidth={2.2} fill="#FF6FA8" strokeLinecap="round" />;
  return (
    <svg viewBox="0 0 80 90" width="100%" height="100%" aria-hidden="true">
      <path d="M31 74 v8 h-5 M49 74 v8 h5" stroke="#E8A13A" strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={40} cy={40} r={36} fill="#6B4A23" />
      <circle cx={40} cy={40} r={32} fill="#8BD630" />
      <circle cx={40} cy={40} r={25} fill="#B8E85C" />
      <ellipse cx={40} cy={40} rx={11} ry={13} fill="#F4F8D8" />
      {seeds}
      <g className="mascot-face">{eyes}{mouth}</g>
      {mood === "proud" && <path d="M14 10 l3 6 6 1 -4.5 4 1 6 -5.5 -3 -5.5 3 1 -6 -4.5 -4 6 -1z" fill="#FFE14D" stroke="#1B1508" strokeWidth={1.2} />}
      <ellipse cx={26} cy={44} rx={4} ry={2.4} fill="#FF6FA8" opacity={0.55} />
      <ellipse cx={54} cy={44} rx={4} ry={2.4} fill="#FF6FA8" opacity={0.55} />
    </svg>
  );
}
