// Dev-only review surface (not routed in production builds). Renders the whole
// kit so it can be screenshotted and art-directed:
//   /dev/kit                 stickers, fonts, presets
//   /dev/kit?view=templates  every template at a fixed width
//   /dev/kit?tpl=<id>        one template at native size (for quality gates)
import { STICKERS } from "../stickers/library";
import StickerArt from "../stickers/StickerArt";
import { FONT_KIT, GROUP_LABEL } from "../fonts/kit";
import { TEXT_PRESETS } from "../data/presets";
import { TEMPLATES } from "../data/templates";
import ElementContent from "../editor/ElementContent";
import Thumb from "../editor/Thumb";
import type { Element, KiwiwDoc } from "../types";
import { useEffect, useState } from "react";
import { juiceWithAI, type JuiceResult } from "../juice";
import { FX_PRESETS } from "../effects/presets";
import { makeSticker } from "../data/presets";

/** ?view=fx: every effect on a sample photo / headline, plus the backgrounds. */
function FxView() {
  const photo = { id: "ph", type: "image", src: "/photos/chai-37186989.jpg", x: 0, y: 0, w: 300, h: 380, rotation: 0, opacity: 1, radius: 0, fit: "cover" } as Element;
  const head = { id: "tx", type: "text", text: "NO बुरी नज़र", x: 0, y: 0, w: 300, h: 160, rotation: 0, opacity: 1, fontSize: 64, fontFamily: "Anton", fontWeight: 400, color: "#B3122E", align: "center", lineHeight: 1, letterSpacing: 0 } as Element;
  const sample = (g: string) => (g === "Type" || g === "Devanagari" ? head : photo);
  return (
    <div id="fx-ready" style={{ ...wrap, background: "#F2E8D5", color: "#111" }}>
      {(["Image", "Frames", "Finish", "Type", "Devanagari"] as const).map((g) => (
        <section key={g}>
          <div style={{ ...h2, color: "#B3122E" }}>{g.toUpperCase()}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 28 }}>
            {FX_PRESETS.filter((p) => p.group === g).map((p) => {
              const base = sample(g);
              const el = { ...base, id: p.id, ...p.apply(base) } as Element;
              return (
                <figure key={p.id} style={{ margin: 0 }}>
                  <div style={{ position: "relative", width: el.w, height: el.h }}><div className="el" style={{ left: 0, top: 0, width: el.w, height: el.h }}><ElementContent el={el} /></div></div>
                  <figcaption style={{ fontFamily: "JetBrains Mono", fontSize: 12, marginTop: 8 }}>{p.label}</figcaption>
                </figure>
              );
            })}
          </div>
        </section>
      ))}
      <div style={{ ...h2, color: "#B3122E" }}>BACKGROUNDS</div>
      <div style={{ display: "flex", gap: 20 }}>
        {["bg-checker", "bg-swirl", "bg-halftone", "bg-sunburst", "bg-pixel"].map((k) => (
          <div key={k} style={{ position: "relative", width: 240, height: 300 }}>
            <div className="el" style={{ left: 0, top: 0, width: 240, height: 300 }}><ElementContent el={{ ...makeSticker(k, 240, 300), id: k, x: 0, y: 0, w: 240, h: 300 } as Element} /></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DocRender({ doc }: { doc: KiwiwDoc }) {
  return (
    <div className="tpl-native" id="tpl-native" style={{ position: "relative", width: doc.width, height: doc.height, background: doc.background, overflow: "hidden" }}>
      {doc.elements.map((el) => el.hidden ? null : (
        <div key={el.id} className="el" style={{ left: el.x, top: el.y, width: el.w, height: el.h, opacity: el.opacity, transform: `rotate(${el.rotation}deg)` }}>
          <ElementContent el={el} />
        </div>
      ))}
    </div>
  );
}

/** Waits for the measured fonts, exactly like the real Juice It flow. */
function JuiceView({ text, variant }: { text: string; variant: number }) {
  const [results, setResults] = useState<JuiceResult[] | null>(null);
  useEffect(() => { juiceWithAI(text, variant).then((r) => setResults(r.results)); }, [text, variant]);
  if (!results) return null;
  return (
    <div id="juice-ready" style={{ display: "flex", flexWrap: "wrap", gap: 40, padding: 40, background: "#0B0D08", zoom: Number(new URLSearchParams(location.search).get("zoom") ?? 1) }}>
      {results.map((r) => (
        <div key={r.style} data-juice={r.style}>
          <DocRender doc={r.doc} />
          <div style={{ fontFamily: "JetBrains Mono", fontSize: 30, color: "#D8F27A", marginTop: 12 }}>{r.name} · layout {r.layout + 1}</div>
        </div>
      ))}
    </div>
  );
}

const wrap: React.CSSProperties = { background: "#0B0D08", color: "#F2F5E6", fontFamily: "Inter", padding: 32, minHeight: "100vh" };
const h2: React.CSSProperties = { fontFamily: "JetBrains Mono", fontSize: 13, letterSpacing: "0.1em", color: "#D8F27A", margin: "32px 0 16px" };

export default function DevKit() {
  const params = new URLSearchParams(location.search);
  const juiced = params.get("juice");
  if (juiced !== null) return <JuiceView text={juiced} variant={Number(params.get("v") ?? 0)} />;
  const one = params.get("tpl");
  if (one) {
    const t = TEMPLATES.find((x) => x.id === one);
    return t ? <DocRender doc={t.doc} /> : <div style={wrap}>No template "{one}"</div>;
  }
  if (params.get("view") === "fx") return <FxView />;
  if (params.get("view") === "templates") {
    return (
      <div style={wrap}>
        <div style={h2}>{TEMPLATES.length} TEMPLATES</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
          {TEMPLATES.map((t) => (
            <figure key={t.id} data-tpl={t.id} style={{ margin: 0, width: 300 }}>
              <div style={{ position: "relative", width: 300, aspectRatio: `${t.doc.width}/${t.doc.height}`, maxHeight: 420 }}><Thumb doc={t.doc} /></div>
              <figcaption style={{ fontSize: 12, marginTop: 6 }}><b>{t.name}</b> <span style={{ color: "#9AA28A" }}>· {t.style} · {t.format}</span><br /><span style={{ color: "#9AA28A" }}>{t.description}</span></figcaption>
            </figure>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div style={wrap}>
      <div style={h2}>{STICKERS.length} STICKERS</div>
      <div id="kit-stickers" style={{ display: "grid", gridTemplateColumns: "repeat(10, 1fr)", gap: 12, background: "#F2F5E6", padding: 16, borderRadius: 12 }}>
        {STICKERS.map((s) => (
          <div key={s.kind} style={{ textAlign: "center", color: "#0B0D08" }}>
            <div style={{ height: 96, display: "grid", placeItems: "center" }}><div style={{ width: 96, height: 96 }}><StickerArt kind={s.kind} fit /></div></div>
            <div style={{ fontSize: 10, fontFamily: "JetBrains Mono" }}>{s.name}</div>
          </div>
        ))}
      </div>
      <div style={h2}>FONT KIT</div>
      <div id="kit-fonts" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        {FONT_KIT.map((f) => (
          <div key={f.family} style={{ background: "#12150E", padding: 14, borderRadius: 10 }}>
            <div style={{ fontFamily: "JetBrains Mono", fontSize: 10, color: "#9AA28A" }}>{GROUP_LABEL[f.group]} · {f.label}</div>
            <div style={{ fontFamily: f.family, fontWeight: f.defaultWeight, fontSize: 34, lineHeight: 1.15 }}>{f.sample}</div>
          </div>
        ))}
      </div>
      <div style={h2}>TEXT PRESETS + EFFECTS</div>
      <div id="kit-presets" style={{ display: "flex", flexWrap: "wrap", gap: 16, background: "#F2F5E6", padding: 16, borderRadius: 12 }}>
        {TEXT_PRESETS.map((p) => {
          const s = 0.5;
          const el = { ...p.el, id: p.id, x: 0, y: 0, w: p.el.w * s, h: p.el.h * s, fontSize: p.el.fontSize * s, letterSpacing: p.el.letterSpacing * s,
            outline: p.el.outline ? { ...p.el.outline, width: p.el.outline.width * s } : null,
            shadow: p.el.shadow ? { ...p.el.shadow, x: p.el.shadow.x * s, y: p.el.shadow.y * s } : null } as Element;
          return (
            <div key={p.id} style={{ background: p.el.color === "#FFFFFF" ? "#2A2F22" : "transparent", padding: 6 }}>
              <div style={{ width: el.w, height: el.h, transform: `rotate(${p.el.rotation}deg)` }}><ElementContent el={el} /></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
