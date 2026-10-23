import type { Template, Element } from "../types";

// Original Kiwiw starter templates. Every template is built from our own
// shapes + text — nothing is copied from another product. The engine reads
// any number of these, so thousands can be added as plain data.

let n = 0;
const id = () => `t${n++}`;

const text = (p: Partial<Extract<Element, { type: "text" }>>): Element => ({
  id: id(), type: "text", x: 0, y: 0, w: 400, h: 80, rotation: 0, opacity: 1,
  text: "Text", fontSize: 48, fontFamily: "Inter", color: "#1d2b12",
  fontWeight: 700, align: "left", lineHeight: 1.2, letterSpacing: 0, ...p,
});
const shape = (p: Partial<Extract<Element, { type: "shape" }>>): Element => ({
  id: id(), type: "shape", x: 0, y: 0, w: 200, h: 200, rotation: 0, opacity: 1,
  shape: "rect", fill: "#7bc62d", stroke: "#1d2b12", strokeWidth: 0, radius: 16, ...p,
});

export const TEMPLATES: Template[] = [
  {
    id: "ig-quote",
    name: "Quote Post",
    category: "Social",
    thumbBg: "linear-gradient(135deg,#7bc62d,#38bdf8)",
    doc: {
      width: 1080, height: 1080, background: "#0f1115",
      elements: [
        shape({ shape: "ellipse", x: 740, y: -120, w: 520, h: 520, fill: "#7bc62d", opacity: 0.25 }),
        shape({ shape: "ellipse", x: -160, y: 760, w: 440, h: 440, fill: "#38bdf8", opacity: 0.2 }),
        text({ x: 110, y: 360, w: 860, h: 320, text: "Great design\nis invisible.", fontSize: 92, color: "#ffffff", fontWeight: 800, lineHeight: 1.08 }),
        text({ x: 110, y: 720, w: 500, h: 60, text: "— Kiwiw", fontSize: 34, color: "#7bc62d", fontWeight: 600 }),
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
        shape({ x: 0, y: 0, w: 1080, h: 300, fill: "#fb7185", radius: 0 }),
        text({ x: 90, y: 90, w: 900, h: 120, text: "MEGA SALE", fontSize: 110, color: "#ffffff", fontWeight: 800, align: "center" }),
        text({ x: 90, y: 440, w: 900, h: 300, text: "50% OFF", fontSize: 220, color: "#f59e0b", fontWeight: 800, align: "center" }),
        shape({ shape: "rect", x: 360, y: 820, w: 360, h: 110, fill: "#1d2b12", radius: 55 }),
        text({ x: 360, y: 848, w: 360, h: 60, text: "Shop now", fontSize: 40, color: "#ffffff", fontWeight: 700, align: "center" }),
      ],
    },
  },
  {
    id: "resume",
    name: "Resume",
    category: "Documents",
    thumbBg: "linear-gradient(135deg,#f1f5f9,#cbd5e1)",
    doc: {
      width: 850, height: 1100, background: "#ffffff",
      elements: [
        shape({ x: 0, y: 0, w: 280, h: 1100, fill: "#1d2b12", radius: 0 }),
        shape({ shape: "ellipse", x: 70, y: 70, w: 140, h: 140, fill: "#7bc62d" }),
        text({ x: 40, y: 240, w: 200, h: 40, text: "CONTACT", fontSize: 20, color: "#7bc62d", fontWeight: 700 }),
        text({ x: 40, y: 290, w: 220, h: 160, text: "you@email.com\n+91 00000 00000\nyourcity, IN", fontSize: 15, color: "#e7ebf0", fontWeight: 400, lineHeight: 1.7 }),
        text({ x: 320, y: 80, w: 480, h: 60, text: "YOUR NAME", fontSize: 46, color: "#1d2b12", fontWeight: 800 }),
        text({ x: 320, y: 150, w: 480, h: 40, text: "Product Designer", fontSize: 24, color: "#5fa31b", fontWeight: 600 }),
        text({ x: 320, y: 240, w: 480, h: 40, text: "EXPERIENCE", fontSize: 22, color: "#1d2b12", fontWeight: 700 }),
        text({ x: 320, y: 300, w: 480, h: 220, text: "Role · Company · 2023—now\nWhat you did and the impact it had.\n\nRole · Company · 2021—2023\nAnother highlight line here.", fontSize: 15, color: "#334155", fontWeight: 400, lineHeight: 1.6 }),
      ],
    },
  },
  {
    id: "slide",
    name: "Title Slide",
    category: "Presentation",
    thumbBg: "linear-gradient(135deg,#8b5cf6,#38bdf8)",
    doc: {
      width: 1280, height: 720, background: "#0f1115",
      elements: [
        shape({ x: 0, y: 620, w: 1280, h: 100, fill: "#7bc62d", radius: 0 }),
        shape({ shape: "ellipse", x: 980, y: -140, w: 440, h: 440, fill: "#8b5cf6", opacity: 0.3 }),
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
      width: 1280, height: 720, background: "#111827",
      elements: [
        shape({ x: 0, y: 0, w: 640, h: 720, fill: "#7bc62d", radius: 0, opacity: 0.15 }),
        text({ x: 60, y: 150, w: 760, h: 420, text: "I BUILT\nMY OWN\nCANVA", fontSize: 150, color: "#ffffff", fontWeight: 800, lineHeight: 1.0 }),
        shape({ shape: "rect", x: 60, y: 600, w: 300, h: 70, fill: "#ef4444", radius: 12 }),
        text({ x: 60, y: 616, w: 300, h: 50, text: "WATCH NOW", fontSize: 34, color: "#ffffff", fontWeight: 800, align: "center" }),
      ],
    },
  },
  {
    id: "story",
    name: "Story",
    category: "Social",
    thumbBg: "linear-gradient(135deg,#38bdf8,#7bc62d)",
    doc: {
      width: 1080, height: 1920, background: "#ffffff",
      elements: [
        shape({ x: 0, y: 0, w: 1080, h: 1920, fill: "#38bdf8", opacity: 0.08, radius: 0 }),
        shape({ shape: "ellipse", x: 290, y: 260, w: 500, h: 500, fill: "#7bc62d", opacity: 0.25 }),
        text({ x: 90, y: 820, w: 900, h: 300, text: "Swipe up\nfor more", fontSize: 120, color: "#1d2b12", fontWeight: 800, align: "center", lineHeight: 1.05 }),
      ],
    },
  },
  {
    id: "card",
    name: "Business Card",
    category: "Branding",
    thumbBg: "linear-gradient(135deg,#1d2b12,#5fa31b)",
    doc: {
      width: 1050, height: 600, background: "#1d2b12",
      elements: [
        shape({ shape: "ellipse", x: 760, y: -120, w: 420, h: 420, fill: "#7bc62d", opacity: 0.3 }),
        text({ x: 70, y: 200, w: 600, h: 60, text: "Your Name", fontSize: 56, color: "#ffffff", fontWeight: 800 }),
        text({ x: 72, y: 280, w: 600, h: 40, text: "Founder, Kiwiw", fontSize: 26, color: "#7bc62d", fontWeight: 600 }),
        text({ x: 72, y: 430, w: 600, h: 80, text: "you@kiwiw.app · kiwiw.app", fontSize: 22, color: "#cbd5e1", fontWeight: 400 }),
      ],
    },
  },
  {
    id: "poster",
    name: "Event Poster",
    category: "Marketing",
    thumbBg: "linear-gradient(135deg,#8b5cf6,#fb7185)",
    doc: {
      width: 1080, height: 1350, background: "#0f1115",
      elements: [
        shape({ shape: "triangle", x: 100, y: 120, w: 880, h: 500, fill: "#8b5cf6", opacity: 0.5 }),
        text({ x: 90, y: 720, w: 900, h: 220, text: "DESIGN\nMEETUP", fontSize: 150, color: "#ffffff", fontWeight: 800, lineHeight: 0.95 }),
        text({ x: 92, y: 1010, w: 900, h: 60, text: "Fri · 7 PM · Online", fontSize: 40, color: "#7bc62d", fontWeight: 600 }),
      ],
    },
  },
];

export const TEMPLATE_CATEGORIES = Array.from(new Set(TEMPLATES.map((t) => t.category)));
