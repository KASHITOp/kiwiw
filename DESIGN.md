# Kiwiw — DESIGN.md

The rules Kiwiw is designed by. If a choice isn't covered here, pick the option
that makes the page feel more like a kiwi cut in half, not more like a SaaS
template. Values below are the source of truth; `src/landing/landing.css` and
`src/tokens.css` implement them.

---

## 01 — Concept & voice

**Cut it open.** A kiwi is brown fuzz outside and electric green inside. Kiwiw
takes a plain idea in and hands a juicy design out. Every surface should stage
that before → after: something dull or closed, then the cut, then colour.

| Rule | Do | Don't |
| --- | --- | --- |
| Headlines | Short, confident, a little cheeky. "Plain idea in. Juicy design out." | "Create stunning designs effortlessly." |
| Length | One idea per line. Headlines ≤ 4 words per line. | Stacked adjectives, "seamless", "powerful", "all-in-one". |
| Humour | One dry aside per block, max ("We checked."). | Puns in every line. Exclamation marks in UI. |
| Claims | Say what it does. Demo it live next to the claim. | Promise outcomes a static card can't show. |

---

## 02 — Color

Dark, seedy base; green does the talking; brown appears only where the fuzz is.

| Token | Hex | Role | Usage |
| --- | --- | --- | --- |
| `--ink` | `#0B0D08` | Background | Page background, editor canvas surround, text on green. |
| `--ink-2` | `#12150E` | Raised surface | Cards, panels, the mini-editor. |
| `--ink-3` | `#1A1E14` | Pressed / chips | Chips, hover fills, inactive controls. |
| `--kiwi` | `#8BD630` | Primary accent | Primary buttons, the second headline line, active state, focus fill. |
| `--flesh` | `#D8F27A` | Highlight | Eyebrow labels, seeds in flight, focus rings, poster surfaces. |
| `--seed` | `#17140D` | Seed black | Seeds inside the slice. Never as a UI colour. |
| `--fuzz` | `#8A6A44` | Warm accent (rare) | The rind, the poster "photo", one dot in window chrome. ≤ 3% of any screen. |
| `--paper` | `#F2F5E6` | Primary text | Headlines and body on ink. |
| `--body` | `#B4BCA2` | Body text | Paragraph copy on ink. |
| `--mute` | `#9AA28A` | Secondary text | Nav links, annotations. |
| `--dim` | `#6B7360` | Tertiary text | Labels, counters, captions. |
| `--line` | `rgba(242,245,230,.10)` | Hairline | All 1px borders. |

- Green is earned: at most **one** kiwi-filled button per view, plus the juicy headline.
- Text on `--kiwi` / `--flesh` is always `--ink`. Text on ink is `--paper` or `--body`.
- Gradients are allowed **only** as the radial kiwi flesh (`#F6FBDF → #E6F6A2 → #C6EC62 → #8BD630 → #6CB022`, centre-out). Never linear, never purple/blue.

---

## 03 — Typography

Three faces, three jobs. Nothing else is loaded.

| Role | Family | Weights | Used for |
| --- | --- | --- | --- |
| Display | Bricolage Grotesque (variable, `opsz` 96) | 700–800 | Headlines, section titles, poster headlines, the wordmark. |
| UI | Inter | 400–600 | Body copy, buttons, inputs, editor chrome. |
| Mono | JetBrains Mono | 400–600 | Labels, numbers, counters, annotations, file names, chips. |

| Style | Size | Line height | Tracking | Notes |
| --- | --- | --- | --- | --- |
| Hero H1 (desktop) | `clamp(56px, min(7.2vw, 11.2vh), 132px)` | 0.90 | −0.045em | Sized by width **and** height so both lines sit above the fold. |
| Hero H1 (mobile) | `clamp(42px, 12vw, 72px)` | 0.92 | −0.035em | Balanced wrap allowed. |
| Section H2 | `clamp(40px, 6vw, 96px)` | 0.92 | −0.04em | One line on desktop where possible. |
| Row H3 | `clamp(28px, 3.2vw, 48px)` | 1.0 | −0.03em | Magic showcase rows. |
| Body | `clamp(16px, 1.25vw, 18px)` | 1.5 | 0 | Max 470px measure. |
| Button | 14–16px / 600 | 1 | 0 | Inter. |
| Label | 11–12px / 500 | 1.2 | +0.1em, UPPERCASE | Mono. |

- **Letters never touch.** Display tracking stops at −0.045em; check "idea in." and "out." at the largest clamp before shipping.
- Numbers that count, measure or index (`072`, `1080 × 1080`, `[01]`) are always mono and zero-padded where they count.

---

## 04 — The cut (signature motif)

The jagged crack through the kiwi is the brand's verb. It means "transform".

- **Shape:** a vertical zig-zag, 24-unit steps, ±8 amplitude with ±2.5 jitter (`cutLine()` in `src/brand/kiwi.ts`). Never a clean straight line, never a curve.
- **Cut face:** `#EEF9BE` at 70% opacity, stroke `0.9%` of the slice radius, drawn on both halves.
- **The split:** halves separate horizontally by up to **7.5% of slice width**, lift by ≤ 2%, and rotate **−7° / +6°**. The gap shows `--ink`, never a colour.
- **Where it appears:** the hero slice; the eyebrow `FIG. 1` caption; section dividers (a thin zig-zag rule, `--line`); the "cut" cursor ring.
- One cut per screen. Don't stack cracks or use the zig-zag as decoration on cards.

---

## 05 — Seeds & the slice

Seeds are the unit of change: they leave the fruit and become design.

| Element | Spec |
| --- | --- |
| Slice | Rind `--fuzz` with fractal-noise displacement (`R × 0.04`), skin `#4A3720` at 0.95R, flesh radial gradient at 0.935R, ~110 rays at 12–26% white, core ellipse 0.20R × 0.165R. |
| Seed (in fruit) | Teardrop ellipse, `R×0.011 + 0.4` by `R×0.03 + 0.8`, `--seed`, rotated to point outward, ring at 0.26–0.33R. 72 per slice. |
| Seed (in flight) | 6 × 14px, `--flesh`, `border-radius: 50%`. Ink seeds vanish on the dark page, so flying seeds are always flesh. |
| Counter | `SEEDS COLLECTED 000 / 072`, mono, counts only seeds that actually land. 72/72 marks the card "JUICED". |
| Logo | The same slice at R = 15 with reduced detail. Never redraw it; render `KiwiLogo`. |

All slice geometry is generated from a seeded RNG so every kiwi is the same kiwi.

---

## 06 — Labels, annotations & texture

The page reads like a botanical plate that someone graffitied with a design tool.

- **Eyebrow labels:** mono, UPPERCASE, +0.1em, `--flesh`, indexed `[01]`, `[02]`… and captioned like a figure (`FIG. 1 · …`).
- **Annotations:** mono 11px `--mute`, joined to their subject by a **1.5px leader line** at 35% paper. Labels sit **beside** what they describe, never on top of a busy area (the crack, a seed ring).
- **Grain:** fractal noise over the whole page at **4% opacity**, `pointer-events: none`. Never more.
- **Cursor:** over the slice only, a 36px `--flesh` ring with a 4px dot. Native cursor everywhere else; touch devices get none.
- **Easter egg:** the seed counter. Nothing else hides; don't add more.

---

## 07 — Components, spacing & layout

**Spacing** is a 4px scale (`4, 8, 12, 16, 20, 24, 32, 40, 48, 64`). **Radii** are three steps plus pill: `6` (inputs, chips), `10` (posters, small cards), `16–18` (cards, the mini-editor), `999` (buttons).

| Component | Spec |
| --- | --- |
| Primary button | `--kiwi` fill, `--ink` text, pill, 15×24 (sm 11×18). Hover → `--flesh`. 1px press. Focus: 2px `--flesh` ring, 3px offset. |
| Ghost link | Mono 12px UPPERCASE, `--paper`, underline offset 6px at 30%. Hover → `--flesh`. |
| Card | `--ink-2`, 1px `rgba(216,242,122,.14)` border, radius 18, shadow `0 30px 80px rgba(0,0,0,.5)`. |
| Chip | `--ink-3`, 1px hairline, radius 8, mono 11px. Active: `--kiwi` border, `--flesh` text. |
| Input | `--ink`, 1px `rgba(216,242,122,.22)`, radius 9, 34px tall. Focus: `--kiwi` border + 3px `rgba(139,214,48,.18)` halo. |
| Template tile | Real render of the template JSON (never a gradient placeholder), radius 10, tilted in the marquee. |

| Breakpoint | Layout |
| --- | --- |
| < 900px | One column: nav → headline → copy → slice (80vw, max 460px) → mini-editor → counter. No pinning. |
| ≥ 900px | Two columns in a centred **1440px** container. Headline + copy + mini-editor left; slice right, sized `min(44vw, 700px, 100vh − 150px)` so it never crosses the fold. Hero pinned for 230vh of scroll. |
| Verified | 390, 1280×720, 1366×768, 1440×900, 1920×1080: nav, both headline lines, CTA and full slice above the fold. |

**Editor chrome** follows the same tokens in a calm register: ink surfaces, hairlines, one kiwi button (Export), mono for numbers and section labels, the slice logo. Bricolage appears only in the wordmark and the left panel's section header. Grain appears only on the left panel, at 4% or less. No cursor, no annotations. Details in §15.

---

## 08 — Motion

Motion explains the cut. It never decorates.

| Rule | Value |
| --- | --- |
| UI transitions | 150ms `cubic-bezier(.4,0,.2,1)` on colour, border, shadow, transform. |
| Scroll scenes | Driven by scroll position, not time. One scene per section. |
| Split | `easeOutCubic` over the first 30% of the hero scroll. |
| Seed flight | Each seed has a launch window (12–70% of scroll, 22% long), quadratic arc, `easeInOutCubic`, spin ≤ 360°, scales to 65%, fades in its last 20%. |
| Performance | Scroll-linked and looping motion animates `transform` and `opacity` only, on composited layers. Never re-render an SVG per frame. The one exception: the Magic Resize demo morphs a ≤ 240px box's width/height, because a resize *is* the point. |
| Demos | Loop only while on screen (IntersectionObserver); each loop ≤ 6s; hover pauses. |
| Marquee | Constant speed, pauses on hover and focus. |
| Juice reveal | A kiwi fades in and splits (1.5s), then six posters fly out of the cut to their slots: 780ms each, staggered 80ms, starting at 8% scale with a spin that settles. Thumbnails measure layout size, never transformed size. |
| Reduced motion | `prefers-reduced-motion: reduce` → no pinning, no flight, no marquee scroll; everything sits in its finished state. |

---

## 09 — Don'ts

- **No purple or blue gradients.** No gradients at all except the radial kiwi flesh.
- **No emoji as icons.** Icons are lucide (UI) or drawn from the slice (brand). Typographic marks (`→ ✦ ⠿ ·`) are fine.
- **No generic SaaS copy:** "stunning", "seamless", "supercharge", "all-in-one", "unleash", "effortless".
- **No identical card grids.** Features are shown as alternating showcase rows with a live demo each, never 8 equal tiles.
- **No fake UI:** no skeleton mockups or gradient placeholders standing in for product. Show real renders.
- **No brown as a fill colour** outside the rind and the poster photo.
- **No straight or curved cuts,** and never more than one cut per screen.
- **No text on the crack** or over the seed ring; annotate beside it.
- **No layout that leaks the fold** at the verified viewports, and no horizontal scroll at 390px.

The Don'ts above govern **Kiwiw's own chrome** (landing, editor UI). Template
*content* follows the six directions in `REFERENCES.md`, which may use their own
palettes (hot pink, marigold, peacock…). The gradient ban applies everywhere.

---

## 10 — Content type kit (what users design with)

The brand UI stays on three faces (section 03). Designs get a bigger kit, all
Google Fonts self-hosted via Fontsource so PNG export embeds them.

| Group (picker label) | Faces | Use for |
| --- | --- | --- |
| Display · loud | Bricolage Grotesque, Anton, Archivo Black, Unbounded, Syne, Rubik Mono One | Headlines that need to be read from across a chai stall. |
| Serif · fancy | Instrument Serif, Fraunces, DM Serif Display | Editorial headlines, one italic word. |
| Hand · human | Caveat, Permanent Marker, Gochi Hand | Notes, scribbles, meme captions. |
| Desi · apna | Baloo 2, Mukta, Tiro Devanagari Hindi | Hindi + Hinglish, Devanagari that actually renders. |
| Mono · nerdy | JetBrains Mono, Space Mono | Labels, prices, timestamps. |
| Clean · plain | Inter | Body copy. |

- The picker previews every face **in itself** and snaps weight to the nearest real weight the face ships (no faux bold).
- A design may use **three families max** before Roast My Design complains.

---

## 11 — Stickers

All stickers are Kiwiw's own SVG, drawn or generated from seeded geometry.

| Rule | Value |
| --- | --- |
| Colour slots | Every sticker exposes at most three: `fill`, `accent`, `ink`. Users recolour any of them. |
| Line weight | Ink outlines at 3–4% of the sticker's short side; hand-drawn strokes use round caps and joins. |
| Hand feel | Wobble comes from seeded jitter, so a sticker looks hand-drawn but renders identically every time. |
| Fills | Flat colour. The only textures are halftone dots and grain, and those are stickers themselves. |
| Categories | Basic shapes, Blobs, Bursts, Badges, Scribbles, Arrows, Tape & paper, Bubbles, Lines, Texture, Kiwi, Desi. |
| Search | By name, category and tags. |

Never: clip-art realism, gradients inside stickers, trademarked characters.

---

## 12 — Text effects

| Effect | Spec |
| --- | --- |
| Outline | `-webkit-text-stroke`, painted behind the fill (`paint-order: stroke fill`), 1–24px. |
| Hard shadow | Zero-blur `text-shadow`, offset only. Blurred shadows don't exist here. |
| Highlight | A flat colour block behind each line (`box-decoration-break: clone`), marker-style padding. |
| Curve | Text set on an SVG arc, −100 (frown) to +100 (smile); single line. |
| Case | Sentence or ALL CAPS, as a toggle, never baked into the copy. |

---

## 13 — Personality

Funny, never confusing. The joke rides along with the instruction; it never replaces it.

| Surface | Rule | Example |
| --- | --- | --- |
| Microcopy | Say what happened first, then the aside. ≤ 12 words. | "Exported. It's juicy." |
| Errors | What broke, what to do, then a light line. Never blame the user. | "Export tripped over a seed. Try again?" |
| Empty states | Invite one specific action. | "A blank page is just a poster with stage fright." |
| Roast My Design | Roast the design, never the person. Every roast names the problem plainly and offers a one-click **Fix it**. | "Everything is centred. Bold choice. By which we mean default." |
| Vibe slider | One axis, Corporate ⇄ Unhinged, in five steps: Corporate, Polished, Neutral, Spicy, Unhinged. It changes copy tone, font choice, sticker density and rotation chaos. Neutral is always the original. | — |
| Mascot | A happy kiwi in the editor corner. It reacts only to real events (comic-energy fonts, roast results, exports, the Konami code) and never blocks anything. | "Comic Sans energy detected." |
| Easter eggs | Konami code squeezes the kiwi; the seed counter; the mascot. No more. | — |

Toasts: bottom-centre, ink pill, 2.6s, one at a time, `aria-live="polite"`.

## 14 — Editor mechanics

The canvas should feel like it wants to help.

| Mechanic | Rule |
| --- | --- |
| Snapping | Drag snaps to page edges and centre and to other elements' edges and centres within **6 screen px**. Edge/centre guides are **pink `#FF3D9A`**, 1 screen px. Equal-spacing guides are **lime `#D8F27A`** with a small gap marker on both sides. Hold **Alt** to drag freely. |
| Multi-select | Shift-click toggles. Dragging on empty canvas draws a marquee (kiwi-tint fill, dashed kiwi border). Multiple selection shows one dashed bounding box; resize handles only for a single element. |
| Groups | Ctrl+G groups the selection; clicking any member selects the whole group. Ctrl+Shift+G ungroups. |
| Shortcuts | Ctrl+D duplicate · arrows nudge 1px (Shift 10px) · Delete · Ctrl+G / Ctrl+Shift+G · Ctrl+C / Ctrl+V · Ctrl+Z / Ctrl+Y · Ctrl+A · Esc · `/` search the open panel · `?` cheat sheet · `Ctrl+\` collapse the panel. |
| Autosave | Every change saves to localStorage after 600ms idle. "My designs" in the Design tab lists up to 24, newest first. Opening /editor with nothing loaded restores the last design. |

## 15 — Editor chrome v2

Figma/Linear-grade tooling, with kiwi personality in the margins, never in the controls.

| Surface | Rule |
| --- | --- |
| Rail | **56px**, icons only (lucide, 20px, stroke 1.75). Labels are instant tooltips (no delay) to the right, as mono 11px ink pills. Active = lime pill (`--accent-soft`, 40×36, radius 10) behind the icon, plus a **4px lime dot** on the rail's left edge. Order: Juice, Templates, Text, Stickers, Photos, Uploads, Magic. Juice is special: its icon is kiwi-green with a soft glow (`0 0 14px rgba(139,214,48,.45)`), always. |
| Left panel | **320px**. Header: section name in Bricolage 22/800 with a mono 11px count or hint beside it. Below it, a **search bar that is always present**, scoped to the section. Section changes fade and slide 150ms (8px, ease-out). `Ctrl+\` collapses it (width animates to 0 in 150ms). Grain at 4%. |
| Empty states | Exactly one joke each, after the instruction. |
| Template cards | **Masonry**, 2 columns. Card height follows the design's aspect ratio. Landscape formats (≥ 1.3:1) span both columns; banners get a fixed 2.4:1 card with the design centred on a dark backdrop (`#14170F`) and 12px of padding, so they never read as a strip. Hover shows the funny name plus the size ("1584 × 396 · LinkedIn banner"). |
| Template tabs | "My designs" and "Templates" are separate tabs inside the panel. Category chips sit under search: All, Posts, Stories, Posters, Slides, Banners, Desi, Resumes. Slides includes YouTube thumbnails. |
| Page | The sheet has a soft drop shadow (`0 18px 50px rgba(0,0,0,.45)`) and a 1px `rgba(255,255,255,.06)` border. The stage keeps a faint 20px dot grid. |
| Zoom pill | Floating at bottom-centre of the stage: − / zoom % / + / fit / page size readout in mono. It stays clear of the mascot (bottom-right), and toasts sit above it. |
| Layers | Real thumbnails: the element rendered on the page background colour. Human names: "Headline: MAIN CHARACTER", "Text: …", "Sticker: starburst", "Shape: red dot", "Photo". |
| No selection | Page size, background, quick add, then a random design tip with a joke and a "another tip" button. |
| Autosave | A design joins My designs only after its first edit. Opening a template is not a design. |

## 16 — Effects engine

Flat is the enemy. Every effect is data on the element (so it saves, undoes, exports and juices), rendered by the shared `ElementContent`. The recipes that use them live in `STYLE_DNA.md`.

| Group | Effects | Rules |
| --- | --- | --- |
| Image | halftone (dot size), duotone (2 colours), posterize (levels), B&W high-contrast | Processed on a canvas into a data URL, cached by source + settings, so exports match the screen. Halftone dots sit on a 45° grid. Its paper can be transparent so the page shows through. Duotone feeds the halftone's ink and paper. |
| Finish (any element) | grain, cutout border | Grain is an inline SVG turbulence filter **clipped to the element's own pixels** (it never paints the empty box). Cutout is a stacked `drop-shadow` sticker border (white by default) that hugs the real shape, plus one soft shadow. |
| Frames (any element) | postage stamp, torn paper, polaroid, retro OS window, truck-art border, evil-eye ring | Frames wrap the element and inset its content; the element's box is the outer frame. All are drawn in our own SVG/CSS. The window gets a hard ink shadow and three title-bar buttons. The stamp's perforation radius is 3.5% of the short side. |
| Type | wave, arch (curve), outline + hard shadow, stacked condensed caps, Devanagari display, glossy | Wave offsets each glyph on a sine wave (amplitude in % of the font size). "Stack" is an action (caps, one word per line, line height 0.84, Anton), not a mode. Glossy = an ink outline layer under a vertical gradient-clipped fill with a white top highlight, at most one glossy element per design. Devanagari display faces: Rozha One, Yatra One, Khand, Tiro Devanagari Hindi, Baloo 2. |
| Backgrounds | warped checkerboard, psychedelic swirl, halftone gradient, sunburst rays, pixel grid | Stretchable stickers in the "Backgrounds" category, recolourable with 3 slots. "Use as page background" sizes them to the page and sends them to the back. |

**Panel:** with an element selected, the right panel shows an **Effects** gallery grouped as above. Every tile is a **live preview of the selected element** with that effect applied (not an icon). Clicking a tile toggles the effect, and its controls (sliders, colours) appear under the gallery. Active tiles get the lime ring.
