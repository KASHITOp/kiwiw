// /view#d=… : a read-only page for a shared design (DESIGN.md §21).
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Thumb from "../editor/Thumb";
import { readLink } from "../share/link";
import { useEditor } from "../store";
import { ensureJuiceFonts } from "../juice";
import "../share/view.css";

export default function View() {
  const [hash, setHash] = useState(() => location.hash);
  useEffect(() => { const on = () => setHash(location.hash); window.addEventListener("hashchange", on); return () => window.removeEventListener("hashchange", on); }, []);
  const doc = useMemo(() => readLink(hash), [hash]);
  const [ready, setReady] = useState(false);
  useEffect(() => { ensureJuiceFonts().then(() => setReady(true)); }, []);
  const nav = useNavigate();
  const remix = () => { if (doc) { useEditor.getState().loadDoc(doc); nav("/editor"); } };
  useEffect(() => { document.title = doc ? "A design made with Kiwiw" : "Kiwiw: link not found"; }, [doc]);

  return (
    <div className="vw">
      <header className="vw-top">
        <Link to="/" className="vw-brand display">Kiwiw</Link>
        <span className="mono vw-ro">READ-ONLY · SHARED DESIGN</span>
      </header>
      {doc ? (
        <main className="vw-main">
          <div className="vw-stage" key={String(ready)} style={{ aspectRatio: `${doc.width} / ${doc.height}` }}><Thumb doc={doc} /></div>
          <aside className="vw-side">
            <span className="vw-badge">Made with Kiwiw 🥝</span>
            <h1 className="display">Somebody made this. You can steal it (legally).</h1>
            <p>Open a copy in the editor and change everything, or start from your own boring line.</p>
            <div className="vw-cta">
              <button className="vw-btn" onClick={remix}>Remix this</button>
              <Link to="/" className="vw-btn ghost">Juice your own</Link>
            </div>
            <p className="mono vw-meta">{doc.width} × {doc.height} · {doc.elements.length} elements · lives entirely in this link</p>
          </aside>
        </main>
      ) : (
        <main className="vw-main vw-empty">
          <div>
            <h1 className="display">This link lost its design.</h1>
            <p>Probably chopped by a chat app. Ask for it again, or make your own in 30 seconds.</p>
            <Link to="/" className="vw-btn">Juice your own</Link>
          </div>
        </main>
      )}
    </div>
  );
}
