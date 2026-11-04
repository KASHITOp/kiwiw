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
import { juiceWithAI, ensureJuiceFonts, juiceRecipe, type JuiceResult, type RecipeKey } from "../juice";
import { buildHeroes } from "../dna/heroes";
import { resolveCollisions } from "../dna/collide";
import { LAYOUTS } from "../dna/layouts";
import { writeCopy, RECIPE_ORDER } from "../dna/recipes";
import { parseIdea } from "../juice/parse";
import { photoFor } from "../data/photos";

const GATE = ["college fest friday 6pm", "chai tapri opening sunday", "hiring designers", "diwali sale 40% off", "my startup launch", "birthday party", "gym new batch", "wedding save the date", "podcast episode 12", "bake sale saturday 10am"];

/** ?view=collide: every template + every layout x gate line, raw (before the resolver). */
function CollideReport() {
  const [rows, setRows] = useState<string[] | null>(null);
  useEffect(() => {
    ensureJuiceFonts().then(() => {
      const out: string[] = [];
      for (const t of TEMPLATES) { const f = resolveCollisions(t.doc).fixes; if (f.length) out.push(`TPL ${t.id}: ${f.map((x) => `${x.name} ${x.action}`).join(", ")}`); }
      for (const line of GATE) for (const r of RECIPE_ORDER) LAYOUTS[r].forEach((L, i) => {
        const idea = parseIdea(line);
        const d = L({ c: writeCopy(r, idea, 0), photo: photoFor(line, 0), photo2: photoFor(line, 1), seed: 7 });
        const f = resolveCollisions(d).fixes;
        if (f.length) out.push(`JUICE ${r}#${i + 1} "${line}": ${f.map((x) => `${x.name} ${x.action}`).join(", ")}`);
      });
      setRows(out);
    });
  }, []);
  return rows ? <pre id="collide">{[`${rows.length} collisions`, ...rows].join(String.fromCharCode(10))}</pre> : null;
}

/** ?view=stickers&cat=Coquette: one category as it renders on the canvas (border included). */
function StickerSheet({ cat }: { cat: string }) {
  const [ready, setReady] = useState(false);
  useEffect(() => { document.fonts.ready.then(() => setTimeout(() => setReady(true), 300)); }, []);
  const list = STICKERS.filter((d) => d.category === cat);
  return (
    <div id={ready ? "sheet-ready" : undefined} style={{ background: "#2A2A2A", padding: 24, display: "grid", gridTemplateColumns: "repeat(6, 190px)", gap: 14, width: 6 * 190 + 5 * 14 + 48 }}>
      {list.map((d) => {
        const el = { ...(makeSticker(d.kind, 190, 190) as Element), id: "s" } as Element;
        const k = 160 / Math.max(el.w, el.h);
        const w = el.w * k, h = el.h * k;
        return (
          <div key={d.kind} style={{ fontFamily: "JetBrains Mono", fontSize: 10, color: "#ddd" }}>
            <div style={{ width: 190, height: 190, borderRadius: 8, background: "#F4E7D7", position: "relative" }}>
              <div style={{ position: "absolute", left: (190 - w) / 2, top: (190 - h) / 2, width: w, height: h }}><ElementContent el={{ ...el, w, h } as Element} /></div>
            </div>
            <div style={{ marginTop: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{d.name}</div>
          </div>
        );
      })}
    </div>
  );
}

/** ?view=og: the 1200x630 social card, built from real juiced posters. */
function OgCard() {
  const [docs, setDocs] = useState<KiwiwDoc[] | null>(null);
  useEffect(() => { ensureJuiceFonts().then(() => setDocs([juiceRecipe("bake sale saturday 10am", "sticker", 0).doc, juiceRecipe("chai tapri opening sunday", "nazar", 2).doc, juiceRecipe("wedding save the date", "glossy", 2).doc])); }, []);
  if (!docs) return null;
  const card = (d: KiwiwDoc, x: number, y: number, rot: number, w: number) => (
    <div style={{ position: "absolute", left: x, top: y, width: w, aspectRatio: "1080 / 1350", transform: `rotate(${rot}deg)`, borderRadius: 14, overflow: "hidden", boxShadow: "0 30px 60px rgba(0,0,0,.6)" }}><Thumb doc={d} /></div>
  );
  return (
    <div id="og-ready" style={{ position: "relative", width: 1200, height: 630, overflow: "hidden", background: "#0B0D08", fontFamily: "Inter" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(242,245,230,.07) 1.2px, transparent 1.2px)", backgroundSize: "22px 22px" }} />
      <div style={{ position: "absolute", left: 64, top: 70, width: 560 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 34 }}>
          <svg width="46" height="46" viewBox="-50 -50 100 100"><circle r="48" fill="#6B4A23" /><circle r="43" fill="#8BD630" /><circle r="34" fill="#B8E85C" /><ellipse rx="12" ry="14" fill="#F4F8D8" />{Array.from({ length: 14 }, (_, i) => { const a = (i / 14) * Math.PI * 2; return <ellipse key={i} cx={Math.cos(a) * 22} cy={Math.sin(a) * 22} rx="2" ry="4" fill="#17140D" transform={`rotate(${(a * 180) / Math.PI + 90} ${Math.cos(a) * 22} ${Math.sin(a) * 22})`} />; })}</svg>
          <span style={{ fontFamily: "Bricolage Grotesque Variable", fontWeight: 800, fontSize: 40, letterSpacing: "-0.04em", color: "#F2F5E6" }}>Kiwiw</span>
        </div>
        <div style={{ fontFamily: "Bricolage Grotesque Variable", fontWeight: 800, fontSize: 82, lineHeight: 0.92, letterSpacing: "-0.045em", color: "#F2F5E6" }}>Plain idea in.<br /><span style={{ color: "#8BD630" }}>Juicy design out.</span></div>
        <div style={{ marginTop: 30, fontSize: 24, lineHeight: 1.4, color: "#B4BCA2", width: 470 }}>Type one boring line. Get six posters in ten styles. Desi, loud, glossy, never generic.</div>
        <div style={{ position: "absolute", top: 470, display: "flex", gap: 14, alignItems: "center", fontFamily: "JetBrains Mono", fontWeight: 700, fontSize: 18, letterSpacing: "0.08em" }}>
          <span style={{ background: "#8BD630", color: "#0B0D08", padding: "10px 16px", borderRadius: 999 }}>KIWIW.VERCEL.APP</span>
          <span style={{ color: "#D8F27A" }}>BY KARTAVYAA</span>
        </div>
      </div>
      {card(docs[1], 640, 120, -9, 250)}
      {card(docs[2], 960, 150, 8, 250)}
      {card(docs[0], 780, 60, 2, 300)}
    </div>
  );
}

/** ?dump=heroes: build the hero templates with real fonts and print the JSON. */
function HeroDump() {
  const [json, setJson] = useState("");
  useEffect(() => { ensureJuiceFonts().then(() => setJson(JSON.stringify(buildHeroes()))); }, []);
  return json ? <pre id="dump">{json}</pre> : null;
}
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
  useEffect(() => {
    const recipe = new URLSearchParams(location.search).get("recipe") as RecipeKey | null;
    // ?recipe=<key>: all three layouts of one recipe (art-direction rounds)
    if (recipe) ensureJuiceFonts().then(() => setResults([0, 1, 2].map((i) => juiceRecipe(text, recipe, i))));
    else juiceWithAI(text, variant).then((r) => setResults(r.results));
  }, [text, variant]);
  if (!results) return null;
  return (
    <div id="juice-ready" style={{ display: "flex", flexWrap: "wrap", gap: 40, padding: 40, background: "#0B0D08", zoom: Number(new URLSearchParams(location.search).get("zoom") ?? 1) }}>
      {results.map((r) => (
        <div key={r.style + r.layout} data-juice={r.style}>
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
  if (params.get("view") === "og") return <OgCard />;
  if (params.get("view") === "stickers") return <StickerSheet cat={params.get("cat") ?? "Coquette"} />;
  if (params.get("dump") === "heroes") return <HeroDump />;
  if (params.get("view") === "collide") return <CollideReport />;
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
