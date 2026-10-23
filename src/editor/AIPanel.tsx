import { useState } from "react";
import { PenLine, ImagePlus, Eraser } from "lucide-react";
import { useEditor } from "../store";
import { makeText, makeImage } from "../data/factory";
import { magicWrite, magicImage, removeBackground, keys, type WriteMode } from "../ai/provider";

export default function AIPanel() {
  return (
    <>
      <h4>Magic Studio</h4>
      <MagicWrite />
      <MagicImage />
      <MagicBgRemove />
    </>
  );
}

function Badge({ live }: { live: boolean }) {
  return live ? <span className="badge live">live</span> : <span className="badge mock">demo</span>;
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
    catch (e) { setOut("Error: " + (e as Error).message); }
    finally { setBusy(false); }
  };

  return (
    <div className="ai-card">
      <h5><PenLine size={16} /> Magic Write <Badge live={!!keys.openai} /></h5>
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

function MagicImage() {
  const add = useEditor((s) => s.addElement);
  const [prompt, setPrompt] = useState("");
  const [src, setSrc] = useState("");
  const [busy, setBusy] = useState(false);

  const run = async () => {
    setBusy(true); setSrc("");
    try { setSrc(await magicImage(prompt)); }
    catch (e) { alert("Error: " + (e as Error).message); }
    finally { setBusy(false); }
  };

  return (
    <div className="ai-card">
      <h5><ImagePlus size={16} /> Magic Media <Badge live={!!keys.openai} /></h5>
      <p className="hint">Generate an image from a text prompt.</p>
      <div className="field"><textarea placeholder="A kiwi bird mascot, flat style…" value={prompt} onChange={(e) => setPrompt(e.target.value)} /></div>
      <button className="btn primary block" onClick={run} disabled={busy}>{busy ? <span className="spinner" /> : "Generate image"}</button>
      {src && (
        <>
          <img src={src} style={{ width: "100%", borderRadius: "var(--r-sm)", marginTop: "var(--s-3)" }} />
          <button className="btn sm block" style={{ marginTop: "var(--s-2)" }} onClick={() => add(makeImage(src))}>Add to canvas</button>
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
    } catch (e) { alert("Error: " + (e as Error).message); }
    finally { setBusy(false); }
  };

  return (
    <div className="ai-card">
      <h5><Eraser size={16} /> Background Remover <Badge live={!!keys.removebg} /></h5>
      <p className="hint">{isImage ? "Remove the background of the selected image." : "Select an image on the canvas first."}</p>
      <button className="btn primary block" onClick={run} disabled={!isImage || busy}>{busy ? <span className="spinner" /> : "Remove background"}</button>
    </div>
  );
}
