import { useState } from "react";

import { useEditor } from "../store";
import { makeText } from "../data/factory";
import { magicWrite, removeBackground, type WriteMode } from "../ai/provider";
import { oops } from "../personality/bus";
import { MagicCards } from "./panels";

// Magic is a stack of bold cards (DESIGN.md §15); Roast and Vibe jump to their tools.
export default function AIPanel({ q = "" }: { q?: string }) {
  return <MagicCards q={q}>{{ write: <MagicWrite />, bg: <MagicBgRemove /> }}</MagicCards>;
}

function MagicWrite() {
  const add = useEditor((s) => s.addElement);
  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState<WriteMode>("write");
  const [out, setOut] = useState("");
  const [busy, setBusy] = useState(false);

  const run = async () => {
    setBusy(true); setOut("");
    try { setOut(await magicWrite(prompt, mode)); }
    catch (e) { setOut(""); oops("Magic Write", e); }
    finally { setBusy(false); }
  };

  return (
    <div className="ai-card">
      <p className="hint">Generate, rephrase, shorten or expand copy.</p>
      <div className="field"><textarea placeholder="Write about…" value={prompt} onChange={(e) => setPrompt(e.target.value)} /></div>
      <div className="field" style={{ marginBottom: "var(--s-3)" }}>
        <select value={mode} onChange={(e) => setMode(e.target.value as WriteMode)}>
          <option value="write">Write</option>
          <option value="rephrase">Rephrase</option>
          <option value="shorten">Shorten</option>
          <option value="expand">Expand</option>
        </select>
      </div>
      <button className="btn primary block" onClick={run} disabled={busy}>{busy ? <span className="spinner" /> : "Generate"}</button>
      {out && (
        <>
          <div className="ai-out">{out}</div>
          <button className="btn sm block" style={{ marginTop: "var(--s-2)" }} onClick={() => add(makeText({ text: out, fontSize: 32, w: 600, h: 200 }))}>Add to canvas</button>
        </>
      )}
    </div>
  );
}

function MagicBgRemove() {
  const { doc, selectedId, updateElement } = useEditor();
  const el = doc.elements.find((e) => e.id === selectedId);
  const isImage = el?.type === "image";
  const [busy, setBusy] = useState(false);

  const run = async () => {
    if (!isImage) return;
    setBusy(true);
    try {
      const out = await removeBackground((el as { src: string }).src);
      updateElement(el!.id, { src: out });
    } catch (e) { oops("Background remover", e); }
    finally { setBusy(false); }
  };

  return (
    <div className="ai-card">
      <p className="hint">{isImage ? "Remove the background of the selected image." : "Select an image on the canvas first."}</p>
      <button className="btn primary block" onClick={run} disabled={!isImage || busy}>{busy ? <span className="spinner" /> : "Remove background"}</button>
    </div>
  );
}
