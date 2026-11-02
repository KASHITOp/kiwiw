// Corporate ⇄ Unhinged (DESIGN.md §13). Neutral is always the original design.
import { useEffect, useRef, useState } from "react";
import { useEditor } from "../store";
import { applyVibe, vibeName, VIBE_FONTS } from "../personality/vibe";
import { react, toast } from "../personality/bus";
import type { KiwiwDoc } from "../types";
import { ensureFonts } from "../juice/fit";

const REACTIONS: Record<string, string> = {
  Corporate: "Per my last kiwi. Synergy achieved.",
  Polished: "Ooh, fancy. Pinky out.",
  Spicy: "Now we're talking.",
  Unhinged: "I have no notes. I have only screams.",
};

export default function VibeBar() {
  const doc = useEditor((s) => s.doc);
  const [vibe, setVibe] = useState(50);
  const base = useRef<KiwiwDoc | null>(null);
  const out = useRef<KiwiwDoc | null>(null);
  const dragging = useRef(false);

  useEffect(() => { ensureFonts(VIBE_FONTS); }, []);

  // the user edited (or loaded) something else: that becomes the new Neutral
  useEffect(() => {
    if (out.current && doc !== out.current) { base.current = null; out.current = null; setVibe(50); }
  }, [doc]);

  const apply = (v: number) => {
    const { doc: cur, replaceDoc } = useEditor.getState();
    if (!base.current) base.current = cur;
    if (!dragging.current) useEditor.getState().commit();
    const next = applyVibe(base.current, v);
    out.current = next;
    replaceDoc(next);
    setVibe(v);
    // measure again once every face (and its unicode subset) has really loaded
    const b = base.current;
    const loads = next.elements.flatMap((e) => (e.type === "text" ? [document.fonts.load(`${e.fontWeight} 40px "${e.fontFamily}"`, e.text).catch(() => [])] : []));
    Promise.all(loads).then(() => {
      if (out.current !== next) return;
      const again = applyVibe(b, v);
      out.current = again;
      useEditor.getState().replaceDoc(again);
    });
    const name = vibeName(v);
    if (name !== "Neutral" && !dragging.current) react(name === "Unhinged" ? "shook" : name === "Corporate" ? "judging" : "happy", REACTIONS[name]);
  };

  const release = () => {
    if (!dragging.current) return;
    dragging.current = false;
    const name = vibeName(vibe);
    if (name !== "Neutral") react(name === "Unhinged" ? "shook" : name === "Corporate" ? "judging" : "happy", REACTIONS[name]);
  };

  const name = vibeName(vibe);
  return (
    <div className={`vibe v-${name.toLowerCase()}`} title="Vibe: drag from Corporate to Unhinged. Neutral is your original.">
      <span className="vibe-end">Corporate</span>
      <input
        type="range" min={0} max={100} step={25} value={vibe}
        aria-label="Vibe" aria-valuetext={name}
        disabled={!doc.elements.length}
        onPointerDown={() => { dragging.current = true; useEditor.getState().commit(); }}
        onPointerUp={release}
        onChange={(e) => apply(+e.target.value)}
        onDoubleClick={() => { apply(50); toast("Back to Neutral. Your original, untouched."); }}
      />
      <span className="vibe-end">Unhinged</span>
      <span className="vibe-name">{name}</span>
    </div>
  );
}

