import { useRef, useState } from "react";
import { useEditor } from "../store";
import { makeText, makeShape, makeImage } from "../data/factory";
import { TEMPLATES } from "../data/templates";
import AIPanel from "./AIPanel";
import AssetPanel from "./AssetPanel";

type Tab = "templates" | "text" | "elements" | "uploads" | "photos" | "ai";

export default function LeftPanel() {
  const [tab, setTab] = useState<Tab>("templates");
  const tabs: { id: Tab; icon: string; label: string }[] = [
    { id: "templates", icon: "📐", label: "Design" },
    { id: "elements", icon: "◆", label: "Shapes" },
    { id: "text", icon: "🆃", label: "Text" },
    { id: "photos", icon: "🖼", label: "Photos" },
    { id: "uploads", icon: "⬆", label: "Upload" },
    { id: "ai", icon: "✨", label: "Magic" },
  ];

  return (
    <>
      <div className="rail">
        {tabs.map((t) => (
          <button key={t.id} className={tab === t.id ? "active" : ""} onClick={() => setTab(t.id)}>
            <span className="em">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>
      <div className="side">
        {tab === "templates" && <TemplatesTab />}
        {tab === "elements" && <ShapesTab />}
        {tab === "text" && <TextTab />}
        {tab === "photos" && <AssetPanel />}
        {tab === "uploads" && <UploadTab />}
        {tab === "ai" && <AIPanel />}
      </div>
    </>
  );
}

function TemplatesTab() {
  const loadDoc = useEditor((s) => s.loadDoc);
  return (
    <>
      <h4>Templates</h4>
      <div className="tpl-grid">
        {TEMPLATES.map((t) => (
          <div key={t.id} className="tpl" style={{ background: t.thumbBg, aspectRatio: `${t.doc.width}/${t.doc.height}` }} onClick={() => loadDoc(t.doc)}>
            <div className="tpl-label">{t.name}</div>
          </div>
        ))}
      </div>
    </>
  );
}

function ShapesTab() {
  const add = useEditor((s) => s.addElement);
  const shapes = [
    { k: "rect" as const, label: "▭ Rectangle" },
    { k: "ellipse" as const, label: "⬤ Circle" },
    { k: "triangle" as const, label: "▲ Triangle" },
    { k: "line" as const, label: "▬ Line" },
  ];
  return (
    <>
      <h4>Shapes</h4>
      {shapes.map((s) => (
        <button key={s.k} className="btn" style={{ width: "100%", marginBottom: 8, justifyContent: "flex-start" }} onClick={() => add(makeShape(s.k))}>
          {s.label}
        </button>
      ))}
    </>
  );
}

function TextTab() {
  const add = useEditor((s) => s.addElement);
  const presets = [
    { label: "Add a heading", size: 72, weight: 800 },
    { label: "Add a subheading", size: 42, weight: 600 },
    { label: "Add body text", size: 24, weight: 400 },
  ];
  return (
    <>
      <h4>Text</h4>
      {presets.map((p) => (
        <button
          key={p.label}
          className="btn"
          style={{ width: "100%", marginBottom: 8, fontSize: Math.min(p.size / 3, 18), fontWeight: p.weight, justifyContent: "flex-start" }}
          onClick={() => add(makeText({ text: p.label.replace("Add a ", "").replace("Add ", ""), fontSize: p.size, fontWeight: p.weight }))}
        >
          {p.label}
        </button>
      ))}
    </>
  );
}

function UploadTab() {
  const add = useEditor((s) => s.addElement);
  const ref = useRef<HTMLInputElement>(null);
  const [imgs, setImgs] = useState<string[]>([]);

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    files.forEach((f) => {
      const r = new FileReader();
      r.onload = () => { const src = r.result as string; setImgs((p) => [src, ...p]); };
      r.readAsDataURL(f);
    });
  };

  return (
    <>
      <h4>Uploads</h4>
      <button className="btn primary" style={{ width: "100%", marginBottom: 12 }} onClick={() => ref.current?.click()}>⬆ Upload image</button>
      <input ref={ref} type="file" accept="image/*" multiple hidden onChange={onFile} />
      <div className="asset-grid">
        {imgs.map((src, i) => (
          <div key={i} className="asset" onClick={() => add(makeImage(src))}>
            <img src={src} />
          </div>
        ))}
      </div>
      {imgs.length === 0 && <div className="empty">Your uploads appear here.</div>}
    </>
  );
}
