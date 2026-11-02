# Kiwiw `juice-v2` — overnight REVIEW

Branch: `juice-v2` (main and production untouched).
Preview: **https://kiwiw-b6oxkmx7s-kartavyaas-projects.vercel.app**
(Vercel protects previews on the hobby plan, so log in to Vercel to view it. Production at kiwiw.vercel.app is unchanged.)

> Status: all six phases done and committed (one commit per phase). Typecheck and build pass. Zero console errors at 1366×768, 1920×1080 and 390px.

## What got built

### Phase 0 · References
`REFERENCES.md`: six original style directions (Block Capitals, The Sunday Issue, Cut & Paste Club, Bombay Talkies Press, Quiet Money, Brainrot Broadcast). Each has type roles (shout / talk / label), palette, depth rule, layout rules, a signature move, a never-rule and a joke. Structure lessons came from the Framer, Clay, Nike, The Verge and Spotify breakdowns on getdesign.md (rigor only, not looks).

### Phase 1 · Type + shape kit
- **18 Google Fonts** self-hosted via Fontsource, grouped by mood (Display · loud, Serif · fancy, Hand · human, Desi · apna, Mono · nerdy, Clean · plain). The picker previews every face in itself and snaps weight to weights the face really ships.
- **11 text presets**: Shouty headline, Fancy serif, Sticker label, Handwritten note, Hinglish caption, Desi headline, Meme caption, Arched badge, Hard shadow pop, Mono label, Body.
- **50 original SVG stickers** in 11 categories (blobs, bursts, badges, scribbles, arrows, tape & paper, bubbles, lines, texture, kiwi, desi), searchable, three recolourable slots, flip.
- **Text effects**: outline, hard shadow, highlight, curved text, ALL CAPS toggle.

| Stickers | Font picker |
| --- | --- |
| ![Stickers](docs/review/stickers.png) | ![Font picker](docs/review/font-picker.png) |

### Phase 2 · 24 templates
Four per direction across Instagram post, story, poster, YouTube thumbnail, slide and LinkedIn banner. Each has a funny name and a one-liner on hover. The **Desi pack** has Hinglish copy: Fest Poster That Actually Gets Crowd, Chai Break Menu, Diwali Sale But Make It Fashion, Shaadi Save-the-Date (Mummy Approved), and Investor Bait.

Quality gate: every template was rendered at native size and critiqued; 11 needed fixes (collisions, wrapping, overflow). After fixes none looked generic, so none were deleted. The old 9 templates were removed.

**Best 8:**

| | | | |
| --- | --- | --- | --- |
| ![](docs/review/tpl-bc-rave.png) | ![](docs/review/tpl-si-longread.png) | ![](docs/review/tpl-cp-gig.png) | ![](docs/review/tpl-bt-fest.png) |
| Basement Rave Poster | Long Read, Short Attention | Garage Band Gig | Fest Poster That Actually Gets Crowd |
| ![](docs/review/tpl-bt-chai.png) | ![](docs/review/tpl-qm-investor.png) | ![](docs/review/tpl-br-ratio.png) | ![](docs/review/tpl-br-clickbait.png) |
| Chai Break Menu | Investor Bait | Ratio'd Announcement | Clickbait But Honest |

### Phase 3 · Juice It
One input, six posters, no API key. The parser splits the line into headline, day, date, time, place and price. Each style has built-in witty copy, and a deterministic layout fits every headline by measuring the real web font. With `VITE_OPENAI_API_KEY` the copy is rewritten by AI first. The reveal splits a kiwi open and the posters fly out of the cut. Clicking one opens it in the editor. It replaces the mini-editor in the landing hero and has its own tab in the editor.

**"bake sale saturday 10am":**

![Juice It results](docs/review/juice-bake-sale.png)

| Mid-burst | Picked → editor |
| --- | --- |
| ![Burst](docs/review/juice-burst.png) | ![Editor](docs/review/editor-juice.png) |

![Landing hero](docs/review/landing-hero.png)

### Phase 4 · Personality
- **Vibe slider** in the top bar: Corporate · Polished · Neutral · Spicy · Unhinged. It rewrites the headline and sub line with prewritten tone lines ("Utsav: A Strategic Update", "UTSAV OR PERISH", "Per My Last Email: …"), swaps the headline font, refits the copy with real font metrics, straightens or tilts everything, and fades or adds chaos stickers. **Neutral is always the untouched original.** Double-click the slider to snap back.
- **Roast My Design**: 9 rules (too many fonts, low contrast, cramped margins, everything centred, microscopic text, no hierarchy, wall of text, lost elements, colour overload). Each roast has a one-click **Fix it**, plus **Fix all**, a 0–100 score and a verdict ("Freshly squeezed" down to "Kiwi-adjacent"). With an OpenAI key, "Extra crispy (AI)" adds a bonus roast.
- **Microcopy**: toasts for export ("Exported. It's juicy."), save, copy and group; errors say what broke, then the joke ("Export tripped over a seed. Try again?"); empty canvas ("A blank page is just a poster with stage fright."); empty layers; tooltips.
- **Easter eggs**: ↑↑↓↓←→←→BA squeezes every kiwi (landing hero, logo, mascot). The kiwi mascot in the editor corner reacts to Comic-Sans-energy fonts ("Comic Sans energy detected. Respect."), vibe changes, roasts and exports. Click it for the seed counter, which has milestones at 1, 10, 25, 50 and 100.

| Roast | Vibe: Unhinged | Vibe: Corporate |
| --- | --- | --- |
| ![Roast](docs/review/roast.png) | ![Unhinged](docs/review/vibe-unhinged.png) | ![Corporate](docs/review/vibe-corporate.png) |

### Phase 5 · Editor mechanics
- **Smart snapping** to page and element edges and centres (pink `#FF3D9A` guides) and **equal spacing** (lime `#D8F27A` guides with gap ticks), within 6 screen px. Alt drags freely; Shift-rotate snaps to 15°.
- **Multi-select**: shift-click, marquee drag on empty canvas, dashed group box, everything moves together. **Groups** with Ctrl+G / Ctrl+Shift+G.
- **Shortcuts**: Ctrl+D, arrows (Shift = 10px), Delete, Ctrl+G, Ctrl+C/X/V, Ctrl+Z/Y, Ctrl+A, Esc, `/` jumps to sticker search, `?` opens a cheat sheet.
- **Autosave** to localStorage 600ms after every change; **My designs** grid at the top of the Design tab (thumbnails, "Editing now", delete). Opening /editor empty restores your last design ("Welcome back. Your design waited for you.").

| Snapping guide while dragging | Marquee → group → nudge |
| --- | --- |
| ![Guides](docs/review/editor-guides.png) | ![Multi](docs/review/multi-select.png) |

| Cheat sheet | My designs + restore |
| --- | --- |
| ![Cheat sheet](docs/review/cheat-sheet.png) | ![My designs](docs/review/my-designs.png) |

### Phase 6 · Verification
- `tsc` clean, `npm run build` exit 0.
- Headless Chrome against the production build: landing, Juice It overlay and editor (with Vibe + Roast open) at 1366×768, 1920×1080 and 390px. **0 console errors, 0 warnings.**
- Preview deployed (no `--prod`). Production at kiwiw.vercel.app is unchanged; main is untouched.

| Phone: Juice It | Phone: editor gate |
| --- | --- |
| ![Juice 390](docs/review/juice-390.png) | ![Phone gate](docs/review/phone-gate.png) |

## Bold calls I made while you slept
- **No stock photos in templates.** Every image is drawn or typographic. That keeps them original and export-safe; Pexels is still available in the editor's Photos tab.
- **Magic Resize stays "in the oven"** on the landing, because the editor still can't do it.
- **Template order interleaves the six directions**, so no two neighbouring tiles share a style.
- **The hero's mini-editor became Juice It**, because Juice It is the better demo, and the seed animation now flies into its live poster.
- **The editor refuses phones.** Under 760px it shows "This editor needs elbow room." and points to Juice It, which works fine on a phone. That's better than a broken canvas in someone's LinkedIn feed.
- **Vibe edits are throwaway until you touch something.** Edit the design while on Spicy and that edit becomes the new Neutral. That's simpler than a merge, and Ctrl+Z still walks back through it.
- **Full-page textures (grain, halftone) are click-through.** They sat on top and ate every drag. Select them from Layers.
- **The Konami toast says "No refunds."** instead of promising seeds it doesn't give.

## Unfinished / rough edges
- Vibe uses one headline and one sub line per design. Templates that split a headline over two text boxes (BASE / MENT) only rewrite the first half, which is funny on Unhinged ("BASE OR PERISH / MENT") but not intentional.
- Snapping and the marquee use unrotated boxes, so rotated elements snap by their pre-rotation bounds.
- Resize handles only appear for a single element; there's no group resize yet.
- Autosave lives in localStorage. Big uploaded photos can fill it; when they do, a toast tells you to hit Save.
- The AI bonus roast and AI Juice copy are untested without a key (the code paths are there, gated on `VITE_OPENAI_API_KEY`).
- The Vercel preview is behind Vercel login (hobby plan protection).

## Top 5 next ideas
1. **Record mode**: one button that plays a scripted demo (type a line → Juice → pick → Unhinged → Roast → Fix all → Export) at a steady pace, made for the LinkedIn screen recording.
2. **Vibe for Juice It**: drag the slider in the Juice overlay and watch all six posters change at once.
3. **Roast leaderboard / share card**: export the roast score card as an image ("My poster scored 34. Kiwi-adjacent.").
4. **Magic Resize for real**: reflow one design to post, story and banner using the same `fitText` + layout roles Juice It already uses.
5. **Brand kit from a photo**: pick a palette and font pair from an uploaded image, then apply it to any template in one click.
