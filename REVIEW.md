# Kiwiw `juice-v2` — overnight REVIEW

Branch: `juice-v2` (main and production untouched).
Preview: **https://kiwiw-3aas6jdey-kartavyaas-projects.vercel.app**
(Vercel protects previews on the hobby plan, so log in to Vercel to view it. Production at kiwiw.vercel.app is unchanged.)

> Status: draft written after Phase 3 so a hand-off exists even if the night runs short. Updated at the end.

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

## Bold calls I made while you slept
- **No stock photos in templates.** Every image is drawn or typographic. That keeps them original and export-safe; Pexels is still available in the editor's Photos tab.
- **Magic Resize stays "in the oven"** on the landing, because the editor still can't do it.
- **Template order interleaves the six directions**, so no two neighbouring tiles share a style.
- **The hero's mini-editor became Juice It**, because Juice It is the better demo, and the seed animation now flies into its live poster.

## Still to come tonight
Phase 4 (Vibe slider, Roast My Design, microcopy, easter eggs), Phase 5 (snapping, shortcuts, autosave, multi-select), then final verification.
