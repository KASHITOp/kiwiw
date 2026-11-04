// Pets & Chaos (Pexels cat cutouts + line art + pixel pets) and the Kiwi mascot in 12 moods.
import { S, HEART, heartAt, T, line, sparkle } from "./kit";
import { smoothClosed, type Pt } from "../geometry";
import { kiwiGeometry } from "../../brand/kiwi";
import type { StickerDef } from "../library";

const P = "Pets" as const, K = "Kiwi Moods" as const;
const INK = "#111111";

/* ---- photo cutouts: Pexels cats (LICENSES.md), die-cut on a wobbly blob ---- */
const blob = (seed: number): string => {
  const pts: Pt[] = Array.from({ length: 10 }, (_, i) => {
    const a = (i / 10) * Math.PI * 2, r = 45 + 3.4 * Math.sin(i * 2.3 + seed) + 2 * Math.cos(i * 3.1 + seed * 2);
    return [50 + Math.cos(a) * r, 50 + Math.sin(a) * r];
  });
  return smoothClosed(pts);
};
const CATS: [string, string, string][] = [
  ["yawn", "Yawning cat", "dramatic"], ["tux", "Tuxedo cat", "fancy"], ["kitten", "Tabby kitten", "baby"],
  ["bengal", "Bengal stare", "judging"], ["ginger", "Ginger cat", "main character"], ["patch", "Patchy cat", "curious"],
];
const photo = (id: string, name: string, mood: string, ht: boolean, i: number): StickerDef =>
  S(`pc-cat-${id}${ht ? "-ht" : ""}`, ht ? `${name} (halftone)` : name, P, ["cat", "kitty", "pet", "photo", "cutout", mood, ...(ht ? ["halftone", "b&w"] : [])], ["#FFFFFF", "#FFFFFF", INK], ({ uid }) => (
    <g>
      <defs><clipPath id={`cp${uid}`}><path d={blob(i + (ht ? 7 : 0))} /></clipPath></defs>
      <image href={`/stickers/cat-${id}${ht ? "-ht" : ""}.jpg`} x="0" y="0" width="100" height="100" preserveAspectRatio="xMidYMid slice" clipPath={`url(#cp${uid})`} />
    </g>
  ), { size: [260, 260], uses: [] });

/* ---- cat line art ---- */
const catFace = (kind: string, name: string, eyes: "open" | "closed" | "heart" | "wink", tags: string[]) =>
  S(kind, name, P, ["cat", "line art", "face", "doodle", ...tags], [INK, "#FF8FB1", INK], ({ c }) => (
    <g {...line(c.fill, 3)}>
      <path d="M18,40 L16,10 L38,26 C46,24 54,24 62,26 L84,10 L82,40 C88,52 86,70 74,80 C64,88 36,88 26,80 C14,70 12,52 18,40Z" fill="#FFFFFF" />
      {eyes === "open" && <><circle cx="36" cy="50" r="4" fill={c.fill} /><circle cx="64" cy="50" r="4" fill={c.fill} /></>}
      {eyes === "closed" && <><path d="M30,50 Q36,56 42,50" /><path d="M58,50 Q64,56 70,50" /></>}
      {eyes === "heart" && <><path d={HEART} fill={c.accent} stroke="none" transform={heartAt(36, 50, 6)} /><path d={HEART} fill={c.accent} stroke="none" transform={heartAt(64, 50, 6)} /></>}
      {eyes === "wink" && <><circle cx="36" cy="50" r="4" fill={c.fill} /><path d="M58,50 Q64,44 70,50" /></>}
      <path d="M46,60 L54,60 L50,65Z" fill={c.accent} stroke="none" />
      <path d="M50,65 Q46,71 40,69 M50,65 Q54,71 60,69" />
      <path d="M8,58 L28,60 M8,68 L28,66 M92,58 L72,60 M92,68 L72,66" strokeWidth="1.8" />
      <ellipse cx="26" cy="62" rx="5" ry="3" fill={c.accent} stroke="none" opacity=".6" /><ellipse cx="74" cy="62" rx="5" ry="3" fill={c.accent} stroke="none" opacity=".6" />
    </g>
  ), { size: [200, 200] });

const pixelArt = (kind: string, name: string, rows: string[], pal: Record<string, string>, tags: string[]) =>
  S(kind, name, P, ["pixel", "8-bit", "pet", "retro", "game", ...tags], [pal.X, pal.o ?? "#FFFFFF", INK], ({ c }) => (
    <g>{rows.flatMap((row, y) => [...row].map((ch, x) => (ch === "." ? null : <rect key={`${x}-${y}`} x={x * 8 + 2} y={y * 8 + 2} width="8.3" height="8.3" fill={ch === "X" ? c.fill : ch === "o" ? c.accent : ch === "k" ? c.ink : pal[ch]} />)))}</g>
  ), { vb: [rows[0].length * 8 + 4, rows.length * 8 + 4], size: [rows[0].length * 18, rows.length * 18] });

/* ---- kiwi mascot ---- */
const kg = kiwiGeometry(34, 0.4, 11);
function Kiwi({ eyes = "dot", mouth = "smile", blush = true }: { eyes?: "dot" | "closed" | "angry" | "sad" | "heart" | "star" | "side" | "x"; mouth?: "smile" | "flat" | "open" | "frown" | "o" | "grin"; blush?: boolean }) {
  const e = (x: number) => {
    switch (eyes) {
      case "closed": return <path d={`M${x - 3.6},52 Q${x},55.5 ${x + 3.6},52`} {...line(INK, 1.8)} />;
      case "angry": return <g><circle cx={x} cy="53" r="2" fill={INK} /><path d={x < 50 ? `M${x - 5},46 L${x + 4},49` : `M${x + 5},46 L${x - 4},49`} {...line(INK, 2)} /></g>;
      case "sad": return <g><circle cx={x} cy="53" r="2" fill={INK} /><path d={x < 50 ? `M${x - 4},49 L${x + 4},46` : `M${x + 4},49 L${x - 4},46`} {...line(INK, 1.6)} /></g>;
      case "heart": return <path d={HEART} fill="#E0457B" transform={heartAt(x, 52, 4.6)} />;
      case "star": return <path d={sparkle(x, 52, 5)} fill="#FFD400" stroke={INK} strokeWidth=".8" />;
      case "side": return <g><path d={`M${x - 4},51 L${x + 4},51`} {...line(INK, 1.8)} /><circle cx={x + 2} cy="53" r="1.6" fill={INK} /></g>;
      case "x": return <path d={`M${x - 3},49 L${x + 3},55 M${x + 3},49 L${x - 3},55`} {...line(INK, 1.8)} />;
      default: return <circle cx={x} cy="52" r="2.3" fill={INK} />;
    }
  };
  const m = { smile: "M44,59 Q50,64 56,59", flat: "M45,61 L55,61", open: "M44,58 Q50,68 56,58Z", frown: "M44,63 Q50,58 56,63", o: "", grin: "M42,58 Q50,67 58,58Z" }[mouth];
  return (
    <g>
      <circle cx="50" cy="54" r="40" fill="#7A5A34" />
      <circle cx="50" cy="54" r="36" fill="#8BD630" />
      <circle cx="50" cy="54" r="23" fill="#C9EE7A" opacity=".7" />
      <g transform="translate(50 54)">
        {kg.rays.filter((_, i) => i % 3 === 0).map((r, i) => <line key={i} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2} stroke="#F4FBD6" strokeOpacity={r.o * 0.8} strokeWidth=".7" />)}
        {kg.seeds.filter((_, i) => i % 2 === 0).map((s, i) => <ellipse key={i} cx={s.x * 1.9} cy={s.y * 1.9} rx="1.1" ry="2.6" transform={`rotate(${s.rot} ${s.x * 1.9} ${s.y * 1.9})`} fill={INK} opacity=".85" />)}
      </g>
      <ellipse cx="50" cy="56" rx="16" ry="14" fill="#F4FBD6" />
      {e(43)}{e(57)}
      {mouth === "o" ? <ellipse cx="50" cy="61" rx="2.6" ry="3.2" fill={INK} /> : <path d={m} {...line(INK, 1.8)} fill={mouth === "open" || mouth === "grin" ? "#7A1030" : "none"} />}
      {blush && <><ellipse cx="38" cy="58" rx="3" ry="1.7" fill="#FF7FB3" opacity=".8" /><ellipse cx="62" cy="58" rx="3" ry="1.7" fill="#FF7FB3" opacity=".8" /></>}
    </g>
  );
}
const mood = (kind: string, name: string, tags: string[], body: React.ReactNode, front?: React.ReactNode) =>
  S(`km-${kind}`, `Kiwi ${name}`, K, ["kiwi", "mascot", "mood", "emoji", ...tags], ["#8BD630", "#C9EE7A", INK], () => <g>{body}{front}</g>, { vb: [100, 100], size: [220, 220] });

export const PETS: StickerDef[] = [
  ...CATS.flatMap(([id, name, m], i) => [photo(id, name, m, false, i), photo(id, name, m, true, i)]),
  catFace("pc-cat-line", "Cat face (line art)", "open", ["cute"]),
  catFace("pc-cat-sleepy", "Sleepy cat (line art)", "closed", ["sleepy", "nap"]),
  catFace("pc-cat-love", "Love-struck cat (line art)", "heart", ["love", "crush"]),
  catFace("pc-cat-wink", "Winking cat (line art)", "wink", ["wink", "flirty"]),
  pixelArt("pc-pixel-cat", "Pixel cat", ["X.....X.", "XX...XX.", "XXXXXXX.", "XkXXXkX.", "XXXoXXX.", "XXXXXXXX", ".XXXXXX.", ".X.X.XX."], { X: "#F6A21E", o: "#FF8FB1" }, ["cat"]),
  pixelArt("pc-pixel-dog", "Pixel dog", ["XX....XX", "XXXXXXXX", "XkXXXXkX", "XXXkkXXX", ".XXooXX.", "..XXXX..", ".XX..XX."], { X: "#B5542A", o: "#FF8FB1" }, ["dog", "puppy"]),
  pixelArt("pc-pixel-fish", "Pixel fish", ["..XXXX...", ".XXXXXX.X", "XkXXXXXXX", "XXXXXXXX.", ".XXXXXX.X", "..XXXX..."], { X: "#1D9BF0", o: "#FFFFFF" }, ["fish", "goldfish"]),
  S("pc-paw", "Paw print", P, ["paw", "print", "pet", "dog", "cat"], ["#111111", "#111111", "#111111"], ({ c }) => (
    <g fill={c.fill}><ellipse cx="50" cy="66" rx="20" ry="17" /><ellipse cx="26" cy="40" rx="8" ry="10" /><ellipse cx="42" cy="26" rx="8" ry="10" /><ellipse cx="58" cy="26" rx="8" ry="10" /><ellipse cx="74" cy="40" rx="8" ry="10" /></g>
  ), { size: [140, 140], border: "none" }),
  mood("judging", "judging you", ["judging", "side eye", "unimpressed"], <Kiwi eyes="side" mouth="flat" blush={false} />),
  mood("chai", "on chai break", ["chai", "break", "tea", "relax"], <Kiwi eyes="closed" mouth="smile" />, (
    <g><path d="M70,74 L94,74 L91,96 L73,96Z" fill="#B5542A" stroke={INK} strokeWidth="1.6" /><ellipse cx="82" cy="74" rx="12" ry="2.6" fill="#D9A066" stroke={INK} strokeWidth="1.2" /><path d="M78,68 C76,62 80,60 78,54 M86,68 C84,62 88,60 86,54" {...line("#9CA3AF", 1.4)} /></g>
  )),
  mood("gym", "at the gym", ["gym", "workout", "fitness", "strong", "dumbbell"], <Kiwi eyes="angry" mouth="grin" />, (
    <g><rect x="6" y="6" width="88" height="7" rx="3" fill="#4B5563" /><rect x="2" y="0" width="10" height="19" rx="3" fill={INK} /><rect x="88" y="0" width="10" height="19" rx="3" fill={INK} /><path d="M28,92 Q20,98 14,92 M72,92 Q80,98 86,92" {...line(INK, 2)} /></g>
  )),
  mood("shaadi", "at a shaadi", ["shaadi", "wedding", "sehra", "groom", "festive"], <Kiwi eyes="dot" mouth="smile" />, (
    <g><path d="M16,24 C30,6 70,6 84,24 L80,28 C66,16 34,16 20,28Z" fill="#D7261E" stroke={INK} strokeWidth="1.6" /><path d={sparkle(50, 10, 7)} fill="#F5C542" stroke={INK} strokeWidth=".8" />{[22, 32, 42, 58, 68, 78].map((x) => <circle key={x} cx={x} cy={x < 50 ? 32 - (50 - x) * 0.2 : 32 - (x - 50) * 0.2} r="2.4" fill="#F6A21E" />)}</g>
  )),
  mood("crying", "crying (normal)", ["crying", "sad", "tears", "emotional"], <Kiwi eyes="sad" mouth="frown" />, (
    <g><path d="M41,56 C40,64 38,70 40,76 C42,80 46,78 44,72 C43,66 42,60 41,56Z M59,56 C60,64 62,70 60,76 C58,80 54,78 56,72 C57,66 58,60 59,56Z" fill="#7FB7FF" stroke={INK} strokeWidth=".8" /></g>
  )),
  mood("cool", "in sunglasses", ["sunglasses", "cool", "swag", "chill"], <Kiwi eyes="dot" mouth="smile" />, (
    <g><path d="M30,46 L70,46 L68,56 C66,60 56,60 54,56 L52,50 L48,50 L46,56 C44,60 34,60 32,56Z" fill={INK} /><path d="M34,49 L40,49" {...line("#FFFFFF", 1.4)} /></g>
  )),
  mood("coding", "coding", ["coding", "laptop", "developer", "nerd", "focus"], <Kiwi eyes="dot" mouth="flat" />, (
    <g><rect x="22" y="72" width="56" height="22" rx="2" fill="#374151" stroke={INK} strokeWidth="1.6" /><rect x="16" y="94" width="68" height="4" rx="1.5" fill="#6B7280" /><T x={50} y={86} s={8} f="JetBrains Mono" w={700} c="#8BD630">{"</>"}</T></g>
  )),
  mood("love", "love-struck", ["love", "crush", "heart eyes", "romance"], <Kiwi eyes="heart" mouth="open" />, (
    <g><path d={HEART} fill="#E0457B" transform={heartAt(84, 18, 9)} /><path d={HEART} fill="#FF8FB1" transform={heartAt(16, 24, 6)} /></g>
  )),
  mood("sleepy", "sleepy", ["sleepy", "tired", "nap", "zzz"], <Kiwi eyes="closed" mouth="o" />, (
    <g><T x={80} y={24} s={14} f="Bowlby One" c="#1D3FD8">Z</T><T x={90} y={12} s={9} f="Bowlby One" c="#1D3FD8">z</T><path d="M16,16 C10,8 22,2 26,12" fill="#1D3FD8" /></g>
  )),
  mood("angry", "angry", ["angry", "mad", "rage", "fuming"], <Kiwi eyes="angry" mouth="frown" blush={false} />, (
    <g><path d="M70,14 L76,8 M80,22 L88,20 M74,18 L82,12" {...line("#D7261E", 3)} /><path d="M20,24 C16,14 26,10 28,18" fill="#9CA3AF" opacity=".8" /></g>
  )),
  mood("party", "partying", ["party", "celebrate", "birthday", "confetti"], <Kiwi eyes="star" mouth="grin" />, (
    <g><path d="M38,18 L50,-2 L62,18Z" fill="#FF4FA3" stroke={INK} strokeWidth="1.6" /><circle cx="50" cy="-2" r="3" fill="#FFD400" />{[[14, 30, "#FFD400"], [86, 34, "#1D9BF0"], [20, 80, "#FF4FA3"], [84, 84, "#22C55E"], [10, 56, "#7C3AED"]].map(([x, y, f], i) => <rect key={i} x={+x} y={+y} width="5" height="3" fill={f as string} transform={`rotate(${i * 50} ${x} ${y})`} />)}</g>
  )),
  mood("rich", "rich (allegedly)", ["rich", "money", "paisa", "flex", "gold"], <Kiwi eyes="side" mouth="smile" />, (
    <g><path d="M24,46 L76,46" {...line("#F5C542", 3)} /><circle cx="36" cy="51" r="7" fill="none" stroke="#F5C542" strokeWidth="2" /><circle cx="64" cy="51" r="7" fill="none" stroke="#F5C542" strokeWidth="2" /><g transform="translate(70 70) rotate(-12)"><rect width="26" height="14" rx="2" fill="#22A559" stroke={INK} strokeWidth="1.2" /><T x={13} y={11} s={10} f="Bowlby One" c="#FFFFFF">₹</T></g></g>
  )),
];
