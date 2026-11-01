import type { Template, Element, KiwiwDoc } from "../types";
import { kiwiGeometry, cutLine } from "../brand/kiwi";

// Original Kiwiw starter templates. Every template is built from our own
// shapes + text — nothing is copied from another product. The engine reads
// any number of these, so thousands can be added as plain data.

let n = 0;
const id = () => `t${n++}`;

const text = (p: Partial<Extract<Element, { type: "text" }>>): Element => ({
  id: id(), type: "text", x: 0, y: 0, w: 400, h: 80, rotation: 0, opacity: 1,
  text: "Text", fontSize: 48, fontFamily: "Inter", color: "#0B0D08",
  fontWeight: 700, align: "left", lineHeight: 1.2, letterSpacing: 0, ...p,
});
const shape = (p: Partial<Extract<Element, { type: "shape" }>>): Element => ({
  id: id(), type: "shape", x: 0, y: 0, w: 200, h: 200, rotation: 0, opacity: 1,
  shape: "rect", fill: "#8BD630", stroke: "#0B0D08", strokeWidth: 0, radius: 16, ...p,
});

export const TEMPLATES: Template[] = [
  {
    id: "ig-quote",
    name: "Quote Post",
    category: "Social",
    thumbBg: "linear-gradient(135deg,#8BD630,#D8F27A)",
    doc: {
      width: 1080, height: 1080, background: "#0B0D08",
      elements: [
        shape({ shape: "ellipse", x: 740, y: -120, w: 520, h: 520, fill: "#8BD630", opacity: 0.25 }),
        shape({ shape: "ellipse", x: -160, y: 760, w: 440, h: 440, fill: "#D8F27A", opacity: 0.2 }),
        text({ x: 110, y: 360, w: 860, h: 320, text: "Great design\nis invisible.", fontSize: 92, color: "#ffffff", fontWeight: 800, lineHeight: 1.08 }),
        text({ x: 110, y: 720, w: 500, h: 60, text: "— Kiwiw", fontSize: 34, color: "#8BD630", fontWeight: 600 }),
      ],
    },
  },
  {
    id: "ig-promo",
    name: "Sale Promo",
    category: "Social",
    thumbBg: "linear-gradient(135deg,#fb7185,#f59e0b)",
    doc: {
      width: 1080, height: 1080, background: "#fff7ed",
      elements: [
        shape({ x: 0, y: 0, w: 1080, h: 240, fill: "#fb7185", radius: 0 }),
        text({ x: 90, y: 78, w: 900, h: 96, text: "MEGA SALE", fontSize: 92, color: "#ffffff", fontWeight: 800, align: "center" }),
        text({ x: 90, y: 400, w: 900, h: 300, text: "50% OFF", fontSize: 190, color: "#f59e0b", fontWeight: 800, align: "center" }),
        shape({ shape: "rect", x: 390, y: 840, w: 300, h: 96, fill: "#0B0D08", radius: 48 }),
        text({ x: 390, y: 864, w: 300, h: 48, text: "Shop now", fontSize: 36, color: "#ffffff", fontWeight: 700, align: "center" }),
      ],
    },
  },
  {
    id: "resume",
    name: "Resume",
    category: "Documents",
    thumbBg: "linear-gradient(135deg,#F2F5E6,#cbd5e1)",
    doc: {
      width: 850, height: 1100, background: "#ffffff",
      elements: [
        shape({ x: 0, y: 0, w: 280, h: 1100, fill: "#0B0D08", radius: 0 }),
        shape({ shape: "ellipse", x: 70, y: 70, w: 140, h: 140, fill: "#8BD630" }),
        text({ x: 40, y: 240, w: 200, h: 40, text: "CONTACT", fontSize: 20, color: "#8BD630", fontWeight: 700 }),
        text({ x: 40, y: 290, w: 220, h: 160, text: "you@email.com\n+91 00000 00000\nyourcity, IN", fontSize: 15, color: "#e7ebf0", fontWeight: 400, lineHeight: 1.7 }),
        text({ x: 320, y: 80, w: 480, h: 60, text: "YOUR NAME", fontSize: 46, color: "#0B0D08", fontWeight: 800 }),
        text({ x: 320, y: 150, w: 480, h: 40, text: "Product Designer", fontSize: 24, color: "#6CB022", fontWeight: 600 }),
        text({ x: 320, y: 240, w: 480, h: 40, text: "EXPERIENCE", fontSize: 22, color: "#0B0D08", fontWeight: 700 }),
        text({ x: 320, y: 300, w: 480, h: 220, text: "Role · Company · 2023—now\nWhat you did and the impact it had.\n\nRole · Company · 2021—2023\nAnother highlight line here.", fontSize: 15, color: "#334155", fontWeight: 400, lineHeight: 1.6 }),
      ],
    },
  },
  {
    id: "slide",
    name: "Title Slide",
    category: "Presentation",
    thumbBg: "linear-gradient(135deg,#8BD630,#D8F27A)",
    doc: {
      width: 1280, height: 720, background: "#0B0D08",
      elements: [
        shape({ x: 0, y: 620, w: 1280, h: 100, fill: "#8BD630", radius: 0 }),
        shape({ shape: "ellipse", x: 980, y: -140, w: 440, h: 440, fill: "#8BD630", opacity: 0.3 }),
        text({ x: 90, y: 230, w: 1000, h: 140, text: "Project Kiwiw", fontSize: 96, color: "#ffffff", fontWeight: 800 }),
        text({ x: 92, y: 380, w: 900, h: 50, text: "A fresh take on design — your subtitle here.", fontSize: 30, color: "#9aa3b2", fontWeight: 400 }),
      ],
    },
  },
  {
    id: "yt-thumb",
    name: "YouTube Thumbnail",
    category: "Video",
    thumbBg: "linear-gradient(135deg,#ef4444,#f59e0b)",
    doc: {
      width: 1280, height: 720, background: "#0B0D08",
      elements: [
        shape({ x: 0, y: 0, w: 640, h: 720, fill: "#8BD630", radius: 0, opacity: 0.15 }),
        text({ x: 60, y: 130, w: 760, h: 470, text: "I BUILT\nMY OWN\nEDITOR", fontSize: 148, color: "#ffffff", fontWeight: 800, lineHeight: 1.02 }),
        shape({ shape: "rect", x: 60, y: 600, w: 300, h: 70, fill: "#ef4444", radius: 12 }),
        text({ x: 60, y: 616, w: 300, h: 50, text: "WATCH NOW", fontSize: 34, color: "#ffffff", fontWeight: 800, align: "center" }),
      ],
    },
  },
  {
    id: "story",
    name: "Story",
    category: "Social",
    thumbBg: "linear-gradient(135deg,#D8F27A,#8BD630)",
    doc: {
      width: 1080, height: 1920, background: "#ffffff",
      elements: [
        shape({ x: 0, y: 0, w: 1080, h: 1920, fill: "#D8F27A", opacity: 0.08, radius: 0 }),
        shape({ shape: "ellipse", x: 290, y: 260, w: 500, h: 500, fill: "#8BD630", opacity: 0.25 }),
        text({ x: 90, y: 820, w: 900, h: 300, text: "Swipe up\nfor more", fontSize: 120, color: "#0B0D08", fontWeight: 800, align: "center", lineHeight: 1.05 }),
      ],
    },
  },
  {
    id: "card",
    name: "Business Card",
    category: "Branding",
    thumbBg: "linear-gradient(135deg,#0B0D08,#6CB022)",
    doc: {
      width: 1050, height: 600, background: "#0B0D08",
      elements: [
        shape({ shape: "ellipse", x: 760, y: -120, w: 420, h: 420, fill: "#8BD630", opacity: 0.3 }),
        text({ x: 70, y: 200, w: 600, h: 60, text: "Your Name", fontSize: 56, color: "#ffffff", fontWeight: 800 }),
        text({ x: 72, y: 280, w: 600, h: 40, text: "Founder, Kiwiw", fontSize: 26, color: "#8BD630", fontWeight: 600 }),
        text({ x: 72, y: 430, w: 600, h: 80, text: "you@kiwiw.app · kiwiw.app", fontSize: 22, color: "#cbd5e1", fontWeight: 400 }),
      ],
    },
  },
  {
    id: "poster",
    name: "Event Poster",
    category: "Marketing",
    thumbBg: "linear-gradient(135deg,#8BD630,#fb7185)",
    doc: {
      width: 1080, height: 1350, background: "#0B0D08",
      elements: [
        shape({ shape: "triangle", x: 100, y: 120, w: 880, h: 500, fill: "#8BD630", opacity: 0.5 }),
        text({ x: 90, y: 700, w: 900, h: 320, text: "DESIGN\nMEETUP", fontSize: 150, color: "#ffffff", fontWeight: 800, lineHeight: 0.98 }),
        text({ x: 92, y: 1060, w: 900, h: 60, text: "Fri · 7 PM · Online", fontSize: 40, color: "#8BD630", fontWeight: 600 }),
      ],
    },
  },
  {
    id: "share-card",
    name: "Share Card",
    category: "Social",
    thumbBg: "#0B0D08",
    doc: shareCard(),
  },
];

/**
 * 1200×630 link-preview card, built only from Kiwiw elements. The site's
 * og:image is exported from this template with the editor's own pipeline.
 */
function shareCard(): KiwiwDoc {
  const cx = 950, cy = 315, R = 245;
  const g = kiwiGeometry(R, 0.8, 7);
  const els: Element[] = [];
  const ellipse = (p: Partial<Extract<Element, { type: "shape" }>>) => shape({ shape: "ellipse", radius: 0, ...p });
  const ring = (r: number, fill: string) => ellipse({ x: cx - r, y: cy - r, w: 2 * r, h: 2 * r, fill });

  // rind, skin and flesh (stepped rings stand in for the radial gradient)
  els.push(ring(R, "#8A6A44"), ring(R * 0.95, "#4A3720"), ring(R * 0.935, "#8BD630"),
    ring(R * 0.72, "#A8E048"), ring(R * 0.52, "#C6EC62"), ring(R * 0.36, "#E6F6A2"));
  // rays
  g.rays.filter((_, i) => i % 2 === 0).forEach((r) => {
    const len = Math.hypot(r.x2 - r.x1, r.y2 - r.y1);
    const mx = (r.x1 + r.x2) / 2, my = (r.y1 + r.y2) / 2;
    const ang = (Math.atan2(r.y2 - r.y1, r.x2 - r.x1) * 180) / Math.PI;
    els.push(shape({ x: cx + mx - len / 2, y: cy + my - 0.75, w: len, h: 1.5, rotation: ang, fill: "#F4FBD6", opacity: r.o, radius: 0 }));
  });
  // core + seed ring
  els.push(ellipse({ x: cx - g.core.rx, y: cy - g.core.ry, w: 2 * g.core.rx, h: 2 * g.core.ry, fill: "#F7FBE5" }));
  g.seeds.forEach((s) => els.push(ellipse({ x: cx + s.x - s.rx, y: cy + s.y - s.ry, w: 2 * s.rx, h: 2 * s.ry, rotation: s.rot, fill: "#17140D" })));
  // the cut: a zig-zag of short ink strokes through the middle
  const pts = cutLine(R, 3).filter(([, y]) => Math.abs(y) <= R * 0.97);
  for (let i = 1; i < pts.length; i++) {
    const [x1, y1] = pts[i - 1], [x2, y2] = pts[i];
    const len = Math.hypot(x2 - x1, y2 - y1) + 2;
    const ang = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
    els.push(shape({ x: cx + (x1 + x2) / 2 - len / 2, y: cy + (y1 + y2) / 2 - 2.5, w: len, h: 5, rotation: ang, fill: "#0B0D08", radius: 2 }));
  }

  // words
  els.push(
    text({ x: 72, y: 84, w: 600, h: 22, text: "[01] FIG. 1 · A KIWI, CUT CLEAN IN HALF", fontSize: 15, fontFamily: "JetBrains Mono", color: "#D8F27A", fontWeight: 500, letterSpacing: 1.5 }),
    text({ x: 66, y: 122, w: 620, h: 92, text: "Plain idea in.", fontSize: 88, fontFamily: "Bricolage Grotesque Variable", color: "#F2F5E6", fontWeight: 800, letterSpacing: -3.5, lineHeight: 0.95 }),
    text({ x: 66, y: 210, w: 620, h: 92, text: "Juicy design out.", fontSize: 88, fontFamily: "Bricolage Grotesque Variable", color: "#8BD630", fontWeight: 800, letterSpacing: -3.5, lineHeight: 0.95 }),
    text({ x: 70, y: 326, w: 520, h: 66, text: "Type the plain version. Kiwiw hands back the juicy one.", fontSize: 23, color: "#B4BCA2", fontWeight: 400, lineHeight: 1.4 }),
    shape({ x: 70, y: 430, w: 292, h: 64, fill: "#8BD630", radius: 32 }),
    text({ x: 70, y: 430, w: 292, h: 64, text: "Start cutting →", fontSize: 22, color: "#0B0D08", fontWeight: 600, align: "center", lineHeight: 1 }),
    text({ x: 72, y: 540, w: 420, h: 22, text: "KIWIW.VERCEL.APP", fontSize: 15, fontFamily: "JetBrains Mono", color: "#6B7360", fontWeight: 500, letterSpacing: 1.8 }),
    text({ x: 728, y: 586, w: 440, h: 20, text: "SEEDS · 72 (WE COUNTED)", fontSize: 13, fontFamily: "JetBrains Mono", color: "#9AA28A", fontWeight: 500, letterSpacing: 1.3, align: "right" }),
  );

  return { width: 1200, height: 630, background: "#0B0D08", elements: els };
}

export const TEMPLATE_CATEGORIES = Array.from(new Set(TEMPLATES.map((t) => t.category)));
