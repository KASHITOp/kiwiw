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
  /** Autosave slot this doc belongs to. */
  designId: string;
  /** Primary selection (the panels edit this one). */
  selectedId: string | null;
  /** Everything selected, primary last. */
  selectedIds: string[];
  zoom: number;
  history: History;

  // mutations
  loadDoc: (doc: KiwiwDoc, designId?: string) => void;
  /** Swap the whole doc, keeping selection; pass record=true to checkpoint first. */
  replaceDoc: (doc: KiwiwDoc, record?: boolean) => void;
  newDoc: (width: number, height: number) => void;
  addElement: (el: Omit<Element, "id">) => void;
  updateElement: (id: string, patch: Partial<Element>, record?: boolean) => void;
  removeElement: (id: string) => void;
  duplicateElement: (id: string) => void;
  reorder: (id: string, dir: "front" | "back" | "forward" | "backward") => void;
  setLayerOrder: (panelIds: string[]) => void;
  /** additive=true toggles (shift-click). Groups select together. */
  select: (id: string | null, additive?: boolean) => void;
  selectMany: (ids: string[]) => void;
  /** Patch many elements at once (drag, nudge, align). */
  updateMany: (patches: Record<string, Partial<Element>>, record?: boolean) => void;
  removeSelected: () => void;
  duplicateSelected: () => void;
  pasteElements: (els: Element[]) => void;
  group: () => void;
  ungroup: () => void;
  setBackground: (color: string) => void;
  setZoom: (zoom: number) => void;
  commit: () => void; // push a history checkpoint
  undo: () => void;
  redo: () => void;
}

const clone = (d: KiwiwDoc): KiwiwDoc => JSON.parse(JSON.stringify(d));

export const useEditor = create<EditorState>((set, get) => ({
  doc: blankDoc,
  designId: uid(),
  selectedId: null,
  selectedIds: [],
  zoom: 1,
  history: { past: [], future: [] },

  loadDoc: (doc, designId) =>
    set({ doc: clone(doc), designId: designId ?? uid(), selectedId: null, selectedIds: [], history: { past: [], future: [] } }),

  replaceDoc: (doc, record = false) => {
    if (record) get().commit();
    set((s) => {
      const ids = s.selectedIds.filter((id) => doc.elements.some((e) => e.id === id));
      return { doc, selectedIds: ids, selectedId: ids[ids.length - 1] ?? null };
    });
  },

  newDoc: (width, height) =>
    set({
      doc: { width, height, background: "#ffffff", elements: [] },
      designId: uid(),
      selectedId: null,
      selectedIds: [],
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
      selectedIds: [id],
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
      selectedIds: s.selectedIds.filter((x) => x !== id),
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
    set((s) => ({ doc: { ...s.doc, elements: [...s.doc.elements, copy] }, selectedId: copy.id, selectedIds: [copy.id] }));
  },

  updateMany: (patches, record = true) => {
    if (record) get().commit();
    set((s) => ({ doc: { ...s.doc, elements: s.doc.elements.map((e) => (patches[e.id] ? ({ ...e, ...patches[e.id] } as Element) : e)) } }));
  },

  removeSelected: () => {
    const ids = new Set(get().selectedIds);
    if (!ids.size) return;
    get().commit();
    set((s) => ({ doc: { ...s.doc, elements: s.doc.elements.filter((e) => !ids.has(e.id)) }, selectedId: null, selectedIds: [] }));
  },

  duplicateSelected: () => {
    const sel = new Set(get().selectedIds);
    const src = get().doc.elements.filter((e) => sel.has(e.id));
    if (src.length) get().pasteElements(src);
  },

  pasteElements: (els) => {
    if (!els.length) return;
    get().commit();
    const regroup = new Map<string, string>();
    const copies = els.map((src) => {
      const c = JSON.parse(JSON.stringify(src)) as Element;
      c.id = uid();
      c.x += 24;
      c.y += 24;
      if (src.groupId) { if (!regroup.has(src.groupId)) regroup.set(src.groupId, uid()); c.groupId = regroup.get(src.groupId); }
      return c;
    });
    const ids = copies.map((c) => c.id);
    set((s) => ({ doc: { ...s.doc, elements: [...s.doc.elements, ...copies] }, selectedIds: ids, selectedId: ids[ids.length - 1] }));
  },

  group: () => {
    const ids = new Set(get().selectedIds);
    if (ids.size < 2) return;
    get().commit();
    const gid = uid();
    set((s) => ({ doc: { ...s.doc, elements: s.doc.elements.map((e) => (ids.has(e.id) ? { ...e, groupId: gid } : e)) } }));
  },

  ungroup: () => {
    const ids = new Set(get().selectedIds);
    if (!ids.size) return;
    get().commit();
    set((s) => ({ doc: { ...s.doc, elements: s.doc.elements.map((e) => (ids.has(e.id) ? { ...e, groupId: undefined } : e)) } }));
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

  select: (id, additive = false) =>
    set((s) => {
      if (!id) return { selectedId: null, selectedIds: [] };
      const el = s.doc.elements.find((e) => e.id === id);
      const unit = el?.groupId ? s.doc.elements.filter((e) => e.groupId === el.groupId).map((e) => e.id) : [id];
      if (!additive) return { selectedIds: unit, selectedId: id };
      const has = s.selectedIds.includes(id);
      const ids = has ? s.selectedIds.filter((x) => !unit.includes(x)) : [...s.selectedIds.filter((x) => !unit.includes(x)), ...unit];
      return { selectedIds: ids, selectedId: has ? ids[ids.length - 1] ?? null : id };
    }),

  selectMany: (ids) => set({ selectedIds: ids, selectedId: ids[ids.length - 1] ?? null }),
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
      selectedIds: [],
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
      selectedIds: [],
    });
  },
}));
