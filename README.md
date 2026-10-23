<div align="center">

# 🥝 Kiwiw

### An original, browser-based design studio.

Drag-and-drop editing, templates, stock photos, and an AI **Magic Studio** —
all in the browser. Inspired by the category (Canva, Figma, Adobe Express);
every line is written from scratch, nothing copied.

</div>

---

## What is Kiwiw?

Kiwiw is a web app for making graphics — social posts, slides, resumes, posters,
thumbnails and more. You start from a template or a blank canvas, drop in text,
shapes and images, arrange them freely, and export a finished design. An AI
Magic Studio helps you write copy, generate images and clean up photos.

It's a learning-first, build-it-yourself take on the design-tool category — a
real, extensible codebase you own.

## Screenshots

> _Placeholders — drop real images into `docs/` and update these links._

| Landing | Editor |
| --- | --- |
| ![Landing page](docs/screenshot-landing.png) | ![Editor](docs/screenshot-editor.png) |

| Templates | Magic Studio |
| --- | --- |
| ![Templates](docs/screenshot-templates.png) | ![Magic Studio](docs/screenshot-magic.png) |

## Features

**Editor**
- Add text, shapes (rectangle / circle / triangle / line) and images
- Drag to move, 8-handle resize, free rotate
- Layers panel — reorder, show/hide, lock, delete
- Properties panel — position, size, rotation, opacity, font, color, fills, radius
- Undo / redo (`Ctrl+Z` / `Ctrl+Y`), duplicate (`Ctrl+D`), delete
- Zoom + Fit, document resize presets
- Export **PNG** (2×) and save/reload projects as **JSON**

**Content**
- 8 original starter templates across Social, Documents, Presentation, Branding and Marketing
- Template engine reads designs as plain data, so thousands can be added without code changes
- Built-in photo search (free demo photos, real Pexels search with a key)
- Upload your own images

**Magic Studio (AI)**
- ✍️ **Magic Write** — generate, rephrase, shorten or expand copy
- 🎨 **Magic Media** — turn a text prompt into an image
- 🪄 **Background Remover** — knock out an image background

Every AI feature runs in **demo mode** with no key, and goes **live** the moment
you add an API key.

## Tech stack

- **React 19** + **TypeScript**
- **Vite** (dev server + build)
- **Zustand** for state (with an undo/redo history stack)
- **React Router** for landing / editor routes
- **html-to-image** for PNG export
- Plain CSS design system (no UI framework) — custom Kiwiw theme

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:5173.

Build for production:

```bash
npm run build
npm run preview
```

## Going live (API keys)

Copy `.env.example` to `.env` and fill in whichever you want:

| Variable | Powers | Get it |
| --- | --- | --- |
| `VITE_OPENAI_API_KEY` | Magic Write + Magic Media | platform.openai.com |
| `VITE_REMOVEBG_API_KEY` | Background Remover | remove.bg/api |
| `VITE_PEXELS_API_KEY` | Real photo search | pexels.com/api |

> ⚠️ Vite exposes `VITE_*` variables to the browser — fine for local development.
> For production, proxy these calls through your own backend so keys are never
> shipped to end users. `.env` is git-ignored and must never be committed.

## Project layout

```
src/
  pages/        Landing.tsx, Editor.tsx
  editor/       Canvas, LeftPanel, PropertiesPanel, LayersPanel, AIPanel, AssetPanel
  data/         factory.ts (element defaults), templates.ts (seed templates)
  ai/           provider.ts (AI layer: real calls + mock fallbacks)
  store.ts      Zustand store with undo/redo history
  types.ts      document & element model
```

## Roadmap

Magic Resize (reflow to new sizes), multi-page documents, brand kit, snapping &
alignment guides, keyboard nudging, real-time collaboration, a richer template
library.

## License

[MIT](LICENSE) — free to use, modify and distribute.

---

Built with [Claude Code](https://claude.com/claude-code).
