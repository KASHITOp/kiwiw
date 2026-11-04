# Kiwiw Style DNA

Ten recipes the Juice It engine, the templates and the effects panel all share. They're derived from the reference board (desi pop, sports halftone, brutalist web, Swiss experimental, retro psychedelic, playful UI). **Technique only:** no real people, brands, logos, sports clubs or characters from the board ever appear. Every sticker and frame is our own SVG, every font is from Google Fonts, and every photo is Pexels (see LICENSES.md).

Each recipe in `src/dna/recipes.ts` mirrors this file. If they disagree, this file wins.

Effect names refer to the effects engine (DESIGN.md §16): `halftone`, `duotone`, `grain`, `posterize`, `bw`, `cutout` (image); `stamp`, `torn`, `polaroid`, `window`, `truck`, `evileye` (frames); `wave`, `arch`, `outline`, `shadow`, `stack`, `glossy` (type); `bg-checker`, `bg-swirl`, `bg-halftone`, `bg-sunburst`, `bg-pixel` (backgrounds).

---

## 1. Nazar Battu
*Desi pop. Ward off bad vibes, invite good ones.*

- **Palette:** hot pink `#F2479B`, haldi yellow `#FFD23F`, nazar cobalt `#1D3FD8`, sky `#7FB7FF`, crimson `#B3122E`, cream `#FBEEDC`.
- **Fonts:** Rozha One (Devanagari display, the shout) + Anton (English caps) + JetBrains Mono (labels).
- **Layout grammar:** a full-bleed pattern (pink/yellow stripes or an evil-eye field). A nimbu-mirchi string hangs from top centre. A small English kicker ("NO") sits above a giant Devanagari headline in the lower third. Details sit in a cream pill at the bottom.
- **Signature effects:** `evileye` frame or evil-eye pattern, `outline` on the Devanagari, `grain`.
- **Stickers:** nimbu-mirchi, evil eye, diya, marigold.
- **Copy tone:** protective auntie meets meme page. Hinglish allowed.
- **Sample headlines:** "NO बुरी नज़र" · "नज़र मत लगाना, bas aa jaana" · "Tested by mummy. Approved by nazar."
- **Never:** more than one English font, a white background, or an evil eye drawn as a creepy realistic eye.

## 2. Tapri Print
*Truck-art kitsch, chai-stall pride.*

- **Palette:** truck red `#D62828`, peacock teal `#0F7C7A`, saffron `#F7931E`, chalk `#FFF3D6`, ink `#1A1208`.
- **Fonts:** Yatra One (Devanagari, the signboard) + Baloo 2 (round, friendly English) + Khand (condensed details).
- **Layout grammar:** a truck-art border frames the whole page. The headline is set signboard style in the top third. A photo sits in a `stamp` frame, slightly rotated, in the centre. A price or "rate list" block sits bottom left with a ribbon. Stickers go in the corners.
- **Signature effects:** `truck` frame, `stamp` photo frame, `posterize` on the photo, `shadow` type.
- **Stickers:** marigold, diya, toran, badge-seal, ribbon.
- **Copy tone:** street vendor's handwritten board. Proud, loud, a little poetic.
- **Sample headlines:** "चाय पे चर्चा, free" · "Cutting chai, full feelings" · "HORN OK PLEASE (FOR CHAI)"
- **Never:** minimal whitespace, pastel colours, or a sans serif headline.

## 3. Stadium Halftone
*Sports editorial: red, cream, black, stats.*

- **Palette:** stadium red `#D7191C`, newsprint cream `#F2E8D5`, ink `#111111`, white `#FFFFFF`.
- **Fonts:** Anton (huge condensed) + JetBrains Mono (the stat block) + Instrument Serif italic (one manifesto line).
- **Layout grammar:** a giant condensed headline across the top, behind the subject. A `halftone` + `duotone` (red/black) photo cutout fills the right two thirds. A mono stat block ("AGE: 23 / CLUB: ...") sits bottom left. A tiny manifesto line goes above the headline.
- **Signature effects:** `halftone`, `duotone`, `cutout` border, `grain`, `stack` type.
- **Stickers:** burst-seal, scribble-x, arrow-straight.
- **Copy tone:** pre-match hype, deadly serious about silly things.
- **Sample headlines:** "WIN OR DIE (OF SUGAR)" · "SEASON 01. NO SUBS." · "LEGEND IN THE GROUP CHAT"
- **Never:** a real athlete, club, kit sponsor or league mark; soft rounded fonts; more than three colours.

## 4. Brutal Grid
*Brutalist web on paper.*

- **Palette:** signal red `#FF2E1F`, ultra blue `#1F3BFF`, ink `#0A0A0A`, paper `#F4F1EA`.
- **Fonts:** Archivo Black (condensed grotesk feel) + Space Mono (metadata).
- **Layout grammar:** a hard 4-column grid with visible rules. Numbered sections run 01/02/03. One huge headline block breaks the grid. Colour blocks are red or blue rectangles with knockout type. Tiny mono metadata sits in every corner.
- **Signature effects:** `bw` photo, `posterize`, `outline` type, `bg-pixel` (subtle).
- **Stickers:** arrow-straight, line-double, badge-tag.
- **Copy tone:** manifesto memo, numbered demands.
- **Sample headlines:** "01. SHOW UP. 02. EAT. 03. LEAVE." · "MAKE THE SIGNAL LOUDER" · "NO NOISE. JUST NEWS."
- **Never:** drop shadows, gradients, curves, or centred layouts.

## 5. Swiss Drop
*Experimental Swiss: one giant cropped word, one tiny human.*

- **Palette:** Swiss red `#E30613`, off-white `#EFEDE6`, ink `#141414`.
- **Fonts:** Archivo Black (giant cropped letters) + Inter (body) + Space Mono (timeline).
- **Layout grammar:** two or three giant letters, cropped off the page edges. A tiny figure (our SVG walker, or a small cutout photo) interacts with them, walking on or peeking out. A timeline of numbers runs along a rule (01 … 12). Leave about 40% negative space.
- **Signature effects:** `cutout` on a tiny photo, `bw`, `grain`, timeline rule.
- **Stickers:** figure-walker (new), line-double, arrow-drop.
- **Copy tone:** quiet, dry, gallery-wall humour.
- **Sample headlines:** "JU / NE" · "TUE—SDAY" · "SALE (A SMALL ONE)"
- **Never:** more than two colours plus ink, decoration for its own sake, or an uncropped headline.

## 6. Trippy Window
*Retro psychedelic: rainbow swirls and a popup that believes in you.*

- **Palette:** hot pink `#FF4FA3`, sunflower `#FFC72C`, grape `#6B3FD8`, sky `#3FA9FF`, red `#E8322E`, cream `#FFF1DE`.
- **Fonts:** Shrikhand (liquid retro display) + VT323-style mono via Space Mono (window chrome).
- **Layout grammar:** a full-bleed `bg-swirl`. A retro OS `window` sits centre, slightly tilted, holding the headline. A second smaller window says something supportive. Details go in a pill at the bottom.
- **Signature effects:** `bg-swirl` or `bg-checker`, `window` frame, `wave` type.
- **Stickers:** burst-sparkle, scribble-star, bubble-thought.
- **Copy tone:** affirmations from your laptop at 2 a.m.
- **Sample headlines:** "I AM THE MAIN CHARACTER" · "Error 404: chill not found" · "You have 1 new vibe"
- **Never:** straight-edged backgrounds, corporate blue, or more than two windows.

## 7. Neo Brutal Pop
*Neo-brutalism: thick outlines, hard shadows, yellow.*

- **Palette:** brutal yellow `#FFE14D`, ink `#111111`, white `#FFFFFF`, accent pink `#FF6FB5`, lime `#B6F23A`.
- **Fonts:** Archivo Black + Space Mono.
- **Layout grammar:** stacked UI cards with 6px black outlines and 10px hard shadows, like an app screen blown up. The headline goes in the top card, details become "buttons", and stickers act as notification badges.
- **Signature effects:** `outline` + `shadow`, `cutout` photo in a card, `bg-pixel` dots.
- **Stickers:** badge-pill, burst-12, arrow-loop.
- **Copy tone:** app notifications for real life.
- **Sample headlines:** "Save now. Feast anytime." · "TAP TO ATTEND" · "1 new event (you'll like it)"
- **Never:** soft shadows, thin outlines, or gradients.

## 8. 8-Bit Flex
*Pixel game screen. Level 01: your event.*

- **Palette:** night `#120B2E`, pixel pink `#FF3EA5`, coin yellow `#FFD400`, slime `#5CFF5C`, cyan `#3FE0FF`.
- **Fonts:** Press Start 2P (everything loud) + Space Mono (small).
- **Layout grammar:** `bg-pixel` stars on night. A "LEVEL 01" header bar sits at the top. The headline is set in pixel type with a coin-yellow shadow. A player card (photo with `posterize` in a pixel frame) sits centre. A "PRESS START" button with the details goes at the bottom.
- **Signature effects:** `bg-pixel`, `posterize`, `shadow` type, `outline`.
- **Stickers:** pixel heart, pixel star, burst-sparkle.
- **Copy tone:** game UI, achievement unlocked.
- **Sample headlines:** "LEVEL UP: BIRTHDAY" · "PLAYER 2 HAS JOINED" · "HIGH SCORE: 40% OFF"
- **Never:** smooth curves, serif fonts, or real game characters and logos.

## 9. Sticker Bomb
*Streetwear collage: cutouts, bubble letters, chaos with taste.*

- **Palette:** electric blue `#2443FF`, lime `#C6F432`, bubblegum `#FF7AC6`, white `#FFFFFF`, ink `#111111`.
- **Fonts:** Bagel Fat One (bubble display) + Permanent Marker (scribbles) + Space Mono.
- **Layout grammar:** a photo with a thick white `cutout` border in the centre, slightly rotated. A bubble headline overlaps the photo top-left. Stickers pile on the corners and edges (5–9 of them). Small mono product-tag details sit bottom right.
- **Signature effects:** `cutout`, `glossy` or `outline` type, `grain`, `halftone` patch.
- **Stickers:** everything from bursts, badges, scribbles, tape and bubbles.
- **Copy tone:** streetwear drop, hype-beast but self-aware.
- **Sample headlines:** "GOOD MOOD, LIMITED DROP" · "BIGGER. BRIGHTER. BOLDER." · "NO REFUNDS ON VIBES"
- **Never:** fewer than 5 stickers, a centred grid, or empty corners.

## 10. Glossy Bloom
*Premium glossy 3D: bubble type you want to lick, photos in glass-smooth cards.*

- **Palette:** cream `#F6EEDF` or deep plum `#2A0F2E`; bubble fills pink `#FFD6E5→#E0457B`, butter `#FFF6C9→#F2B705`, lilac `#F1ECFF→#8E6CFF`; blush `#FFC2D1`.
- **Fonts:** Bagel Fat One rendered `glossy` (7-step ink extrusion, two-stop gradient body, inner specular stripe, bottom rim light, soft contact shadow) + Instrument Serif italic + Space Mono.
- **Layout grammar:** a giant 3D headline (top or bottom third). Photos sit in rounded glossy cards: white 12px rim, radius ≥ 44, a specular sheen gradient on top, and a slight tilt. Chrome stickers float at the card corners. Details go in a plum pill or a centred serif line.
- **Signature effects:** `glossy` type, rounded cards with `cutout` + sheen, `grain` (light), `bg-halftone` in plum.
- **Stickers:** chrome sparkle, chrome heart, glossy bubble.
- **Copy tone:** soft-launch luxury, gentle brag.
- **Sample headlines:** "Save the date" · "Sweet things, slowly" · "Diwali Sale"
- **Never:** flat fills on the headline, square photo corners, neon, or more than three chrome stickers.
- **Rework log (round 4):** I reworked it twice against Nazar Battu, and it now matches it, so it stays in Juice It.

## 11 · LOUD QUOTES (type-only)

There are no photos: the type is the design. It's for statements, mantras,
house rules and bilingual one-liners.

- **Palettes** (paper / ink / second ink): tomato red on cream, hot pink with
  red, mustard with maroon, cobalt with cream, cream with black.
- **Riso finish on every poster:**
  - paper grain overlay (`texture-grain` in the ink colour);
  - misregistration, as a hard offset shadow in the second ink;
  - ink bleed (`TextElement.bleed`, a soft halo);
  - element grain.
- **Type effects:**
  - vertical stretch (`TextElement.stretch`);
  - melt/drip (Rubik Wet Paint);
  - stacked condensed caps edge to edge (Big Shoulders 900);
  - 70s groovy (Caprasimo + wave);
  - retro italic serif (Playfair 800 italic);
  - script (Great Vibes);
  - ransom-note letters (the `ty-ransom-*` stickers);
  - one word highlighted.
- **Fonts:** Bowlby One, Climate Crisis, Big Shoulders Display, Playfair
  Display Italic, Caprasimo, Gloock, Kalam, Great Vibes, Rubik Wet Paint,
  Rubik Glitch, Tiro Devanagari Hindi, Rozha One.
- **Layouts** (`src/dna/quotes.ts`):
  - **A** giant single word, stretched or melting;
  - **B** full-bleed stacked manifesto;
  - **C** House Rules (ransom header, 5 numbered rules);
  - **D** sentence with one word shouting;
  - **E** quote + tiny attribution;
  - **F** Hindi / English bilingual.
- **Juice It:** when the line reads like a statement (no date, time, place or
  price, no event word, and either 4+ words, punctuation or Devanagari), 2 of
  the 6 results are Loud Quotes.
- **Copy:** the user's own words are the headline. Attributions are made up
  and obviously fake ("— probably your mum"). Never quote real people,
  lyrics or films.
