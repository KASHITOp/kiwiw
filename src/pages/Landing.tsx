import { Link, useNavigate } from "react-router-dom";
import { useEditor } from "../store";
import { TEMPLATES } from "../data/templates";

const FEATURES = [
  { ico: "🖱️", title: "Drag-and-drop editor", text: "Add, scale, rotate and layer text, shapes and images on an infinite canvas — no design skills needed." },
  { ico: "📐", title: "Template library", text: "Start from ready-made, fully-editable templates for social, docs, slides and more. Built to scale to thousands." },
  { ico: "🖼️", title: "Stock & uploads", text: "Drop in your own images or search a built-in photo library powered by free, licensed stock." },
  { ico: "✍️", title: "Magic Write", text: "Generate, rephrase, shorten or expand copy with AI — straight into your design." },
  { ico: "🎨", title: "Magic Media", text: "Turn a text prompt into original imagery and graphics in seconds." },
  { ico: "🪄", title: "Background remover", text: "One click to knock out an image background and make it pop." },
  { ico: "🎚️", title: "Magic Resize", text: "Reflow a design to a new size and platform without starting over." },
  { ico: "📤", title: "Export anywhere", text: "Download crisp PNGs at 2× or save your project as JSON to keep editing." },
];

export default function Landing() {
  const navigate = useNavigate();
  const { loadDoc, newDoc } = useEditor();

  const openTemplate = (i: number) => { loadDoc(TEMPLATES[i].doc); navigate("/editor"); };
  const startBlank = () => { newDoc(1080, 1080); navigate("/editor"); };

  return (
    <div>
      <nav className="nav">
        <div className="brand"><span className="dot">🥝</span> Kiwiw</div>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#templates">Templates</a>
          <a href="#magic">Magic Studio</a>
        </div>
        <Link to="/editor" className="btn primary sm">Open editor →</Link>
      </nav>

      <header className="hero">
        <div className="pill">✨ Design anything, the fresh way</div>
        <h1>Create stunning designs with <span className="grad">Kiwiw</span></h1>
        <p>A drag-and-drop design studio with templates, stock photos and an AI Magic Studio — all in your browser.</p>
        <div className="hero-cta">
          <button className="btn primary" onClick={startBlank}>Start designing — free</button>
          <a href="#templates" className="btn">Browse templates</a>
        </div>
      </header>

      <div className="preview-wrap">
        <div className="preview">
          <div className="mock" style={{ display: "grid", gridTemplateColumns: "64px 1fr 260px", height: 420, background: "var(--panel)" }}>
            <div style={{ background: "var(--panel-2)", borderRight: "1px solid var(--line)" }} />
            <div style={{ display: "grid", placeItems: "center", background: "#0b0d11" }}>
              <div style={{ width: 300, height: 300, borderRadius: 14, background: "linear-gradient(135deg,#7bc62d,#38bdf8)", display: "grid", placeItems: "center", color: "#07140a", fontWeight: 800, fontSize: 40, boxShadow: "var(--shadow)" }}>
                Kiwiw
              </div>
            </div>
            <div style={{ background: "var(--panel-2)", borderLeft: "1px solid var(--line)", padding: 16 }}>
              <div style={{ height: 14, width: "60%", background: "var(--line)", borderRadius: 6, marginBottom: 12 }} />
              <div style={{ height: 36, background: "var(--line)", borderRadius: 8, marginBottom: 10 }} />
              <div style={{ height: 36, background: "var(--line)", borderRadius: 8, marginBottom: 10 }} />
              <div style={{ height: 80, background: "linear-gradient(135deg,#8b5cf6,#38bdf8)", borderRadius: 8 }} />
            </div>
          </div>
        </div>
      </div>

      <section id="features" className="section">
        <h2>Everything you need to design</h2>
        <p className="sub">Core editing plus an AI Magic Studio — the features that matter, built our own way.</p>
        <div className="feature-grid">
          {FEATURES.map((f) => (
            <div key={f.title} className="card">
              <div className="ico">{f.ico}</div>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="templates" className="section">
        <h2>Start from a template</h2>
        <p className="sub">Every template is fully editable. Click one to open it in the editor.</p>
        <div className="tpl-grid">
          {TEMPLATES.map((t, i) => (
            <div key={t.id} className="tpl" style={{ background: t.thumbBg, aspectRatio: `${t.doc.width}/${t.doc.height}` }} onClick={() => openTemplate(i)}>
              <div className="tpl-label">{t.name} · {t.category}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="magic" className="cta-band">
        <h2>Meet the Magic Studio ✨</h2>
        <p className="sub" style={{ marginBottom: 26 }}>Write copy, generate images and clean up photos with AI — right inside the canvas.</p>
        <button className="btn primary" onClick={startBlank}>Try it now</button>
      </section>

      <footer>Kiwiw — an original design studio. Built with React + Vite. © {new Date().getFullYear()}</footer>
    </div>
  );
}
