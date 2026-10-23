import { create } from "zustand";
import type { Element, KiwiwDoc } from "./types";

const uid = () => Math.random().toString(36).slice(2, 10);

const blankDoc: KiwiwDoc = {
  width: 1080,
  height: 1080,
  background: "#ffffff",
  elements: [],
};

interface History {
  past: KiwiwDoc[];
  future: KiwiwDoc[];
}

interface EditorState {
  doc: KiwiwDoc;
  selectedId: string | null;
  zoom: number;
  history: History;

  // mutations
  loadDoc: (doc: KiwiwDoc) => void;
  newDoc: (width: number, height: number) => void;
  addElement: (el: Omit<Element, "id">) => void;
  updateElement: (id: string, patch: Partial<Element>, record?: boolean) => void;
  removeElement: (id: string) => void;
  duplicateElement: (id: string) => void;
  reorder: (id: string, dir: "front" | "back" | "forward" | "backward") => void;
  setLayerOrder: (panelIds: string[]) => void;
  select: (id: string | null) => void;
  setBackground: (color: string) => void;
  setZoom: (zoom: number) => void;
  commit: () => void; // push a history checkpoint
  undo: () => void;
  redo: () => void;
}

const clone = (d: KiwiwDoc): KiwiwDoc => JSON.parse(JSON.stringify(d));

export const useEditor = create<EditorState>((set, get) => ({
  doc: blankDoc,
  selectedId: null,
  zoom: 1,
  history: { past: [], future: [] },

  loadDoc: (doc) =>
    set({ doc: clone(doc), selectedId: null, history: { past: [], future: [] } }),

  newDoc: (width, height) =>
    set({
      doc: { width, height, background: "#ffffff", elements: [] },
      selectedId: null,
      history: { past: [], future: [] },
    }),

  commit: () => {
    const { doc, history } = get();
    set({ history: { past: [...history.past, clone(doc)].slice(-50), future: [] } });
  },

  addElement: (el) => {
    get().commit();
    const id = uid();
    set((s) => ({
      doc: { ...s.doc, elements: [...s.doc.elements, { ...el, id } as Element] },
      selectedId: id,
    }));
  },

  updateElement: (id, patch, record = true) => {
    if (record) get().commit();
    set((s) => ({
      doc: {
        ...s.doc,
        elements: s.doc.elements.map((e) =>
          e.id === id ? ({ ...e, ...patch } as Element) : e
        ),
      },
    }));
  },

  removeElement: (id) => {
    get().commit();
    set((s) => ({
      doc: { ...s.doc, elements: s.doc.elements.filter((e) => e.id !== id) },
      selectedId: s.selectedId === id ? null : s.selectedId,
    }));
  },

  duplicateElement: (id) => {
    const src = get().doc.elements.find((e) => e.id === id);
    if (!src) return;
    get().commit();
    const copy = { ...clone(src as unknown as KiwiwDoc) } as unknown as Element;
    copy.id = uid();
    copy.x = src.x + 24;
    copy.y = src.y + 24;
    set((s) => ({ doc: { ...s.doc, elements: [...s.doc.elements, copy] }, selectedId: copy.id }));
  },

  setLayerOrder: (panelIds) => {
    get().commit();
    set((s) => {
      const byId = new Map(s.doc.elements.map((e) => [e.id, e]));
      // panelIds are front-first (as shown in the layers panel); the document
      // stores back-first, so reverse to get render order.
      const next = panelIds.slice().reverse().map((id) => byId.get(id)).filter(Boolean) as Element[];
      if (next.length !== s.doc.elements.length) return s;
      return { doc: { ...s.doc, elements: next } };
    });
  },

  reorder: (id, dir) => {
    get().commit();
    set((s) => {
      const els = [...s.doc.elements];
      const i = els.indexOf(els.find((e) => e.id === id)!);
      if (i < 0) return s;
      const [el] = els.splice(i, 1);
      if (dir === "front") els.push(el);
      else if (dir === "back") els.unshift(el);
      else if (dir === "forward") els.splice(Math.min(i + 1, els.length), 0, el);
      else els.splice(Math.max(i - 1, 0), 0, el);
      return { doc: { ...s.doc, elements: els } };
    });
  },

  select: (id) => set({ selectedId: id }),
  setBackground: (color) => {
    get().commit();
    set((s) => ({ doc: { ...s.doc, background: color } }));
  },
  setZoom: (zoom) => set({ zoom: Math.max(0.1, Math.min(3, zoom)) }),

  undo: () => {
    const { history, doc } = get();
    if (!history.past.length) return;
    const prev = history.past[history.past.length - 1];
    set({
      doc: prev,
      history: { past: history.past.slice(0, -1), future: [clone(doc), ...history.future] },
      selectedId: null,
    });
  },

  redo: () => {
    const { history, doc } = get();
    if (!history.future.length) return;
    const next = history.future[0];
    set({
      doc: next,
      history: { past: [...history.past, clone(doc)], future: history.future.slice(1) },
      selectedId: null,
    });
  },
}));
