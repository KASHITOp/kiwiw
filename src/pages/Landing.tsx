import { Link, useNavigate } from "react-router-dom";
import { Leaf, MousePointer2, LayoutTemplate, ImageIcon, PenLine, Sparkles, Eraser, Scaling, Download, ArrowRight } from "lucide-react";
import { useEditor } from "../store";
import { TEMPLATES } from "../data/templates";
import Thumb from "../editor/Thumb";

const FEATURES = [
  { icon: <MousePointer2 size={20} />, title: "Drag-and-drop editor", text: "Add, scale, rotate and layer text, shapes and images on a free canvas — no design skills needed." },
  { icon: <LayoutTemplate size={20} />, title: "Template library", text: "Start from ready-made, fully-editable templates for social, docs, slides and more." },
  { icon: <ImageIcon size={20} />, title: "Stock & uploads", text: "Drop in your own images or search a built-in photo library of free, licensed stock." },
  { icon: <PenLine size={20} />, title: "Magic Write", text: "Generate, rephrase, shorten or expand copy with AI — straight into your design." },
  { icon: <Sparkles size={20} />, title: "Magic Media", text: "Turn a text prompt into original imagery and graphics in seconds." },
  { icon: <Eraser size={20} />, title: "Background remover", text: "One click to knock out an image background and make it pop." },
  { icon: <Scaling size={20} />, title: "Smart resize", text: "Reflow a design to a new size and platform without starting over." },
  { icon: <Download size={20} />, title: "Export anywhere", text: "Download crisp PNGs at 2× or save your project as JSON to keep editing." },
];

export default function Landing() {
  const navigate = useNavigate();
  const { loadDoc, newDoc } = useEditor();

  const openTemplate = (i: number) => { loadDoc(TEMPLATES[i].doc); navigate("/editor"); };
  const startBlank = () => { newDoc(1080, 1080); navigate("/editor"); };

  return (
    <div>
      <nav className="nav">
        <div className="brand" style={{ fontSize: "var(--t-xl)" }}>
          <span className="logo" style={{ width: 32, height: 32 }}><Leaf size={18} /></span> Kiwiw
        </div>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#templates">Templates</a>
          <a href="#magic">Magic Studio</a>
        </div>
        <Link to="/editor" className="btn primary sm">Open editor <ArrowRight size={15} /></Link>
      </nav>

      <header className="hero">
        <div className="pill"><Sparkles size={14} /> Design anything, the fresh way</div>
        <h1>Create stunning designs<br />with Kiwiw</h1>
        <p>A drag-and-drop design studio with templates, stock photos and an AI Magic Studio — all in your browser.</p>
        <div className="hero-cta">
          <button className="btn primary" onClick={startBlank}>Start designing — free</button>
          <a href="#templates" className="btn">Browse templates</a>
        </div>
      </header>

      <div className="preview-wrap">
        <div className="preview">
          <img src="/editor-hero.jpg" alt="The Kiwiw editor with a design open" />
        </div>
      </div>

      <section id="features" className="section">
        <h2>Everything you need to design</h2>
        <p className="sub">Core editing plus an AI Magic Studio — the features that matter, built our own way.</p>
        <div className="feature-grid">
          {FEATURES.map((f) => (
            <div key={f.title} className="card">
              <div className="ico">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="templates" className="section">
        <h2>Start from a template</h2>
        <p className="sub">Every template is fully editable. Click one to open it in the editor.</p>
        <div className="land-tpl-grid">
          {TEMPLATES.map((t, i) => (
            <div key={t.id} className="tpl" onClick={() => openTemplate(i)} title={t.name}>
              <Thumb doc={t.doc} />
              <div className="tpl-label">{t.name} · {t.category}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="magic" className="cta-band">
        <h2>Meet the Magic Studio</h2>
        <p className="sub" style={{ marginBottom: "var(--s-6)" }}>Write copy, generate images and clean up photos with AI — right inside the canvas.</p>
        <button className="btn primary" onClick={startBlank}>Try it now</button>
      </section>

      <footer>Kiwiw — an original design studio. Built with React + Vite. © {new Date().getFullYear()}</footer>
    </div>
  );
}
