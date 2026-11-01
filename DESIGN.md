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

**Editor chrome** follows the same tokens in a calm register: ink surfaces, hairlines, one kiwi button (Export), mono for numbers and section labels, the slice logo, Bricolage only for the wordmark. No grain, no cursor, no annotations in the editor.

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
