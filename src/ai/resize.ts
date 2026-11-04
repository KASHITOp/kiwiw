// Magic Resize (DESIGN.md §19): post ↔ story ↔ LinkedIn banner ↔ YouTube
// thumbnail with a real re-layout, not a stretch.
//  1. Backdrops (bg stickers, textures, full-page shapes, edge-to-edge strips)
//     stretch to the new page.
//  2. Everything else is grouped into units: a text plus the pill or badge
//     sitting behind it moves as one.
//  3. Similar shapes: each unit keeps its anchor (centre, in page %) and scales
//     by the smaller ratio, so spacing grows at least as fast as sizes.
//     Big aspect jumps reflow: the hero (largest photo, else largest sticker)
//     gets its own zone and the type is re-stacked beside or below it.
//  4. The collision resolver tidies whatever is left.
import type { Element, KiwiwDoc } from "../types";
import { resolveCollisions } from "../dna/collide";

export const FORMATS = [
  { id: "post", label: "Instagram post", w: 1080, h: 1080 },
  { id: "portrait", label: "Portrait post", w: 1080, h: 1350 },
  { id: "story", label: "Story", w: 1080, h: 1920 },
  { id: "banner", label: "LinkedIn banner", w: 1584, h: 396 },
  { id: "yt", label: "YouTube thumbnail", w: 1280, h: 720 },
  { id: "linkedin", label: "LinkedIn post", w: 1200, h: 1200 },
] as const;

type Box = { x: number; y: number; w: number; h: number };
interface Unit { els: Element[]; box: Box; text: boolean; area: number; image: boolean }

const isBackdrop = (e: Element, d: KiwiwDoc) => {
  if (e.type === "text") return false;
  if (e.type === "sticker" && (e.kind.startsWith("bg-") || /texture|grain/.test(e.kind))) return true;
  if (e.w * e.h >= d.width * d.height * 0.8) return true;
  // strips and frames that run edge to edge
  return e.type !== "image" && (e.w >= d.width * 0.92 || e.h >= d.height * 0.92);
};

const bbox = (els: Element[]): Box => {
  const x0 = Math.min(...els.map((e) => e.x)), y0 = Math.min(...els.map((e) => e.y));
  const x1 = Math.max(...els.map((e) => e.x + e.w)), y1 = Math.max(...els.map((e) => e.y + e.h));
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
};
const inside = (px: number, py: number, b: Box) => px >= b.x && px <= b.x + b.w && py >= b.y && py <= b.y + b.h;

function scaleEl(e: Element, s: number, x: number, y: number): Element {
  const out = { ...e, x, y, w: e.w * s, h: e.h * s } as Element;
  if (out.type === "text" && e.type === "text") {
    out.fontSize = e.fontSize * s;
    out.letterSpacing = e.letterSpacing * s;
    if (e.outline) out.outline = { ...e.outline, width: Math.max(1, e.outline.width * s) };
    if (e.shadow) out.shadow = { ...e.shadow, x: e.shadow.x * s, y: e.shadow.y * s };
  }
  if (e.cutout) out.cutout = { ...e.cutout, width: Math.max(2, e.cutout.width * s) };
  return out;
}

/** Move + scale a unit so its box lands at (x, y) with scale s. */
const placeUnit = (u: Unit, s: number, x: number, y: number) => u.els.map((e) => scaleEl(e, s, x + (e.x - u.box.x) * s, y + (e.y - u.box.y) * s));

function units(els: Element[]): Unit[] {
  const texts = els.filter((e) => e.type === "text");
  const used = new Set<Element>();
  const out: Unit[] = [];
  for (const t of texts) {
    const cx = t.x + t.w / 2, cy = t.y + t.h / 2;
    // the pill / badge / sticker label right behind this text
    const backs = els.filter((e) => e.type !== "text" && e.type !== "image" && !used.has(e) && inside(cx, cy, e) && e.w * e.h < t.w * t.h * 3.5);
    backs.forEach((b) => used.add(b));
    const group = [...backs, t];
    out.push({ els: group, box: bbox(group), text: true, area: t.w * t.h, image: false });
  }
  for (const e of els) if (e.type !== "text" && !used.has(e)) out.push({ els: [e], box: { x: e.x, y: e.y, w: e.w, h: e.h }, text: false, area: e.w * e.h, image: e.type === "image" });
  return merge(out);
}

const join = (a: Unit, b: Unit): Unit => { const els = [...a.els, ...b.els]; return { els, box: bbox(els), text: a.text || b.text, area: a.area + b.area, image: a.image || b.image }; };

/** Rows of text (menu name + price, rule no. + rule) and clusters of same-size stickers (ransom words) move together. */
function merge(us: Unit[]): Unit[] {
  let changed = true;
  while (changed) {
    changed = false;
    outer: for (let i = 0; i < us.length; i++) for (let j = i + 1; j < us.length; j++) {
      const a = us[i], b = us[j];
      const vo = Math.min(a.box.y + a.box.h, b.box.y + b.box.h) - Math.max(a.box.y, b.box.y);
      const row = a.text && b.text && vo > 0.5 * Math.min(a.box.h, b.box.h);
      // compare the pieces (letters), not the growing cluster
      const piece = (u: Unit) => Math.max(...u.els.map((e) => Math.max(e.w, e.h)));
      const sa = piece(a), sb = piece(b);
      const gap = Math.max(a.box.x - (b.box.x + b.box.w), b.box.x - (a.box.x + a.box.w), a.box.y - (b.box.y + b.box.h), b.box.y - (a.box.y + a.box.h));
      const cluster = !a.text && !b.text && !a.image && !b.image && a.els.every((e) => e.type === "sticker") && b.els.every((e) => e.type === "sticker")
        && Math.max(sa, sb) / Math.min(sa, sb) < 1.6 && gap < 0.35 * Math.min(sa, sb);
      if (row || cluster) { us[i] = join(a, b); us.splice(j, 1); changed = true; break outer; }
    }
  }
  return us;
}

export function smartResize(doc: KiwiwDoc, W: number, H: number): KiwiwDoc {
  const kx = W / doc.width, ky = H / doc.height;
  const back = doc.elements.filter((e) => isBackdrop(e, doc));
  const stretched = back.map((e) => ({ ...e, x: e.x * kx, y: e.y * ky, w: e.w * kx, h: e.h * ky }) as Element);
  const us = units(doc.elements.filter((e) => !isBackdrop(e, doc)));
  const a0 = doc.width / doc.height, a1 = W / H;
  const jump = Math.max(a0, a1) / Math.min(a0, a1);
  const m = Math.round(Math.min(W, H) * 0.06);
  let placed: Element[] = [];

  const anchor = (u: Unit, s: number) => {
    const cx = (u.box.x + u.box.w / 2) * kx, cy = (u.box.y + u.box.h / 2) * ky;
    const w = u.box.w * s, h = u.box.h * s;
    return placeUnit(u, s, Math.max(m * 0.5 - w * 0.5, Math.min(W - w * 0.5 - m * 0.5, cx - w / 2)), Math.max(m * 0.5 - h * 0.5, Math.min(H - h * 0.5 - m * 0.5, cy - h / 2)));
  };

  if (jump < 1.6 || us.length < 2) {
    const s = Math.min(kx, ky);
    placed = us.flatMap((u) => anchor(u, s));
  } else {
    const wide = a1 > a0;
    const hero = [...us].filter((u) => !u.text).sort((a, b) => (Number(b.image) - Number(a.image)) || b.area - a.area)[0];
    // stickers and tape sitting on the hero photo travel with it
    const riders = hero?.image ? us.filter((u) => u !== hero && !u.text && inside(u.box.x + u.box.w / 2, u.box.y + u.box.h / 2, hero.box)) : [];
    const texts = us.filter((u) => u.text).sort((a, b) => a.box.y - b.box.y);
    const rest = us.filter((u) => u !== hero && !u.text && !riders.includes(u));
    const split = wide ? 0.42 : 0.44;
    const heroZone: Box = wide ? { x: W * (1 - split), y: m, w: W * split - m, h: H - 2 * m } : { x: m, y: m, w: W - 2 * m, h: H * split - m };
    const typeZone: Box = !hero ? { x: m, y: m, w: W - 2 * m, h: H - 2 * m } : wide ? { x: m, y: m, w: W * (1 - split) - 2 * m, h: H - 2 * m } : { x: m, y: H * split + m * 0.5, w: W - 2 * m, h: H * (1 - split) - 1.5 * m };
    if (hero) {
      if (hero.image) {
        const e = hero.els[0];
        placed.push({ ...e, x: heroZone.x, y: heroZone.y, w: heroZone.w, h: heroZone.h, rotation: 0 } as Element);
        const sx = heroZone.w / hero.box.w, sy = heroZone.h / hero.box.h, s = Math.min(sx, sy);
        for (const r of riders) {
          if (r.els.every((e) => e.type === "shape")) {
            placed.push(...r.els.map((e) => ({ ...e, x: heroZone.x + (e.x - hero.box.x) * sx, y: heroZone.y + (e.y - hero.box.y) * sy, w: e.w * sx, h: e.h * sy }) as Element));
            continue;
          }
          const cx = heroZone.x + (r.box.x + r.box.w / 2 - hero.box.x) * sx, cy = heroZone.y + (r.box.y + r.box.h / 2 - hero.box.y) * sy;
          placed.push(...placeUnit(r, s, cx - (r.box.w * s) / 2, cy - (r.box.h * s) / 2));
        }
      } else {
        const s = Math.min(heroZone.w / hero.box.w, heroZone.h / hero.box.h);
        placed.push(...placeUnit(hero, s, heroZone.x + (heroZone.w - hero.box.w * s) / 2, heroZone.y + (heroZone.h - hero.box.h * s) / 2));
      }
    }
    placed.push(...stack(texts, typeZone));
    // small decorations keep their spot, scaled down, and get nudged off the type
    placed.push(...rest.flatMap((u) => anchor(u, Math.min(kx, ky) * 0.9)));
  }
  // keep the original stacking order (a shadow block stays behind its photo)
  const order = new Map(doc.elements.map((e, i) => [e.id, i]));
  const all = [...stretched, ...placed].sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));
  return resolveCollisions({ ...doc, width: W, height: H, elements: all }).doc;
}

/** Re-stack type units top to bottom in a zone, each as large as the zone allows. */
function stack(us: Unit[], zone: Box): Element[] {
  if (!us.length) return [];
  const gap = zone.h * 0.035;
  // one common scale so the stack fits the zone height, capped per unit by the zone width
  let s = (zone.h - gap * (us.length - 1)) / us.reduce((t, u) => t + u.box.h, 0);
  const fits = () => us.reduce((t, u) => t + u.box.h * Math.min(s, zone.w / u.box.w), 0) + gap * (us.length - 1);
  for (let i = 0; i < 8 && fits() < zone.h * 0.92; i++) s *= 1.12;
  while (fits() > zone.h && s > 0.05) s *= 0.95;
  const total = fits();
  let y = zone.y + (zone.h - total) / 2;
  const out: Element[] = [];
  for (const u of us) {
    const k = Math.min(s, zone.w / u.box.w);
    const w = u.box.w * k;
    const t = u.els.find((e) => e.type === "text");
    const align = t && t.type === "text" ? t.align : "left";
    const x = align === "center" ? zone.x + (zone.w - w) / 2 : align === "right" ? zone.x + zone.w - w : zone.x;
    out.push(...placeUnit(u, k, x, y));
    y += u.box.h * k + gap;
  }
  return out;
}
