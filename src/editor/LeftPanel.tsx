import { useRef, useState } from "react";
import { LayoutTemplate, Shapes, Type, Image as ImageIcon, Upload, Sparkles, Square, Circle, Triangle, Minus } from "lucide-react";
import { useEditor } from "../store";
import { makeText, makeShape, makeImage } from "../data/factory";
import { TEMPLATES } from "../data/templates";
import Thumb from "./Thumb";
import AIPanel from "./AIPanel";
import AssetPanel from "./AssetPanel";

type Tab = "templates" | "elements" | "text" | "photos" | "uploads" | "ai";

const TABS: { id: Tab; icon: React.ReactNode; label: string }[] = [
  { id: "templates", icon: <LayoutTemplate size={20} />, label: "Design" },
  { id: "elements", icon: <Shapes size={20} />, label: "Shapes" },
  { id: "text", icon: <Type size={20} />, label: "Text" },
  { id: "photos", icon: <ImageIcon size={20} />, label: "Photos" },
  { id: "uploads", icon: <Upload size={20} />, label: "Upload" },
  { id: "ai", icon: <Sparkles size={20} />, label: "Magic" },
];

export default function LeftPanel() {
  const [tab, setTab] = useState<Tab>("templates");
  return (
    <>
      <div className="rail">
        {TABS.map((t) => (
          <button key={t.id} className={tab === t.id ? "active" : ""} onClick={() => setTab(t.id)}>
            {t.icon}
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
          <div key={t.id} className="tpl" onClick={() => loadDoc(t.doc)} title={t.name}>
            <Thumb doc={t.doc} />
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
    { k: "rect" as const, label: "Rectangle", icon: <Square size={18} /> },
    { k: "ellipse" as const, label: "Circle", icon: <Circle size={18} /> },
    { k: "triangle" as const, label: "Triangle", icon: <Triangle size={18} /> },
    { k: "line" as const, label: "Line", icon: <Minus size={18} /> },
  ];
  return (
    <>
      <h4>Shapes</h4>
      {shapes.map((s) => (
        <button key={s.k} className="btn block" style={{ justifyContent: "flex-start", marginBottom: "var(--s-2)" }} onClick={() => add(makeShape(s.k))}>
          {s.icon} {s.label}
        </button>
      ))}
    </>
  );
}

function TextTab() {
  const add = useEditor((s) => s.addElement);
  const presets = [
    { label: "Add a heading", size: 72, weight: 800, preview: 20 },
    { label: "Add a subheading", size: 42, weight: 600, preview: 16 },
    { label: "Add body text", size: 24, weight: 400, preview: 14 },
  ];
  return (
    <>
      <h4>Text</h4>
      {presets.map((p) => (
        <button
          key={p.label}
          className="btn text-preset"
          style={{ fontSize: p.preview, fontWeight: p.weight }}
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
    Array.from(e.target.files ?? []).forEach((f) => {
      const r = new FileReader();
      r.onload = () => setImgs((p) => [r.result as string, ...p]);
      r.readAsDataURL(f);
    });
  };

  return (
    <>
      <h4>Uploads</h4>
      <button className="btn primary block" style={{ marginBottom: "var(--s-3)" }} onClick={() => ref.current?.click()}>
        <Upload size={16} /> Upload image
      </button>
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
