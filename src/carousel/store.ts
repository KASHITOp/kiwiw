// LinkedIn carousel (DESIGN.md §22): a list of 1080×1350 pages around the
// single-doc editor. The current page lives in the editor store; switching
// saves it back here first.
import { create } from "zustand";
import { useEditor } from "../store";
import type { KiwiwDoc } from "../types";

const clone = <T,>(x: T): T => JSON.parse(JSON.stringify(x));
export const MAX_PAGES = 10, CAROUSEL_W = 1080, CAROUSEL_H = 1350;

interface Carousel {
  pages: KiwiwDoc[] | null;
  index: number;
  start: (pages: KiwiwDoc[]) => void;
  stop: () => void;
  /** All pages with the live editor page folded in. */
  snapshot: () => KiwiwDoc[];
  go: (i: number) => void;
  add: () => void;
  duplicate: () => void;
  remove: () => void;
  move: (dir: -1 | 1) => void;
}

const blank = (): KiwiwDoc => ({ width: CAROUSEL_W, height: CAROUSEL_H, background: "#FFF4DE", elements: [] });

export const useCarousel = create<Carousel>((set, get) => ({
  pages: null,
  index: 0,
  start: (pages) => { set({ pages: pages.map(clone), index: 0 }); useEditor.getState().loadDoc(pages[0]); },
  stop: () => set({ pages: null, index: 0 }),
  snapshot: () => {
    const { pages, index } = get();
    if (!pages) return [useEditor.getState().doc];
    const out = [...pages];
    out[index] = clone(useEditor.getState().doc);
    return out;
  },
  go: (i) => {
    const pages = get().snapshot();
    if (i < 0 || i >= pages.length) return;
    set({ pages, index: i });
    useEditor.getState().loadDoc(pages[i]);
  },
  add: () => {
    const pages = get().snapshot();
    if (pages.length >= MAX_PAGES) return;
    const next = [...pages.slice(0, get().index + 1), blank(), ...pages.slice(get().index + 1)];
    set({ pages: next });
    get().go(get().index + 1);
  },
  duplicate: () => {
    const pages = get().snapshot();
    if (pages.length >= MAX_PAGES) return;
    const i = get().index;
    set({ pages: [...pages.slice(0, i + 1), clone(pages[i]), ...pages.slice(i + 1)] });
    get().go(i + 1);
  },
  remove: () => {
    const pages = get().snapshot();
    if (pages.length <= 1) { set({ pages: null, index: 0 }); return; }
    const i = get().index;
    const next = pages.filter((_, k) => k !== i);
    set({ pages: next, index: Math.min(i, next.length - 1) });
    useEditor.getState().loadDoc(next[Math.min(i, next.length - 1)]);
  },
  move: (dir) => {
    const pages = get().snapshot();
    const i = get().index, j = i + dir;
    if (j < 0 || j >= pages.length) return;
    [pages[i], pages[j]] = [pages[j], pages[i]];
    set({ pages, index: j });
  },
}));
