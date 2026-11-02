// Autosave (DESIGN.md §14): every change lands in localStorage after 600ms idle.
import { useEffect, useState } from "react";
import { useEditor } from "../store";
import type { KiwiwDoc } from "../types";

export interface SavedDesign { id: string; name: string; updated: number; doc: KiwiwDoc }

const KEY = "kiwiw.designs";
const MAX = 24;
const EVT = "kiwiw:designs";

export function listDesigns(): SavedDesign[] {
  try { return (JSON.parse(localStorage.getItem(KEY) ?? "[]") as SavedDesign[]).sort((a, b) => b.updated - a.updated); }
  catch { return []; }
}

function write(list: SavedDesign[]) {
  localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX)));
  window.dispatchEvent(new Event(EVT));
}

const nameOf = (doc: KiwiwDoc) => {
  const t = doc.elements
    .filter((e) => e.type === "text" && e.text.trim())
    .sort((a, b) => (b.type === "text" ? b.fontSize : 0) - (a.type === "text" ? a.fontSize : 0))[0];
  return t && t.type === "text" ? t.text.replace(/\s+/g, " ").trim().slice(0, 32) : "Untitled masterpiece";
};

export function saveDesign(id: string, doc: KiwiwDoc): boolean {
  try {
    write([{ id, name: nameOf(doc), updated: Date.now(), doc }, ...listDesigns().filter((d) => d.id !== id)]);
    return true;
  } catch { return false; } // quota (big uploads) or private mode
}

export function removeDesign(id: string) {
  try { write(listDesigns().filter((d) => d.id !== id)); } catch { /* nothing to remove */ }
}

/** Mount once in the editor. Returns false if the last save failed. */
export function useAutosave(onFail: () => void) {
  useEffect(() => {
    let t: ReturnType<typeof setTimeout> | undefined;
    let failed = false;
    const unsub = useEditor.subscribe((s, prev) => {
      // only real edits count: opening a template (new designId) is not a design yet (DESIGN.md §15)
      if (s.doc === prev.doc || s.designId !== prev.designId) return;
      clearTimeout(t);
      t = setTimeout(() => {
        const { doc, designId } = useEditor.getState();
        if (!doc.elements.length) return;
        const ok = saveDesign(designId, doc);
        if (!ok && !failed) onFail();
        failed = !ok;
      }, 600);
    });
    return () => { clearTimeout(t); unsub(); };
  }, [onFail]);
}

export function useDesigns() {
  const [list, setList] = useState(listDesigns);
  useEffect(() => {
    const on = () => setList(listDesigns());
    window.addEventListener(EVT, on);
    window.addEventListener("storage", on);
    return () => { window.removeEventListener(EVT, on); window.removeEventListener("storage", on); };
  }, []);
  return list;
}
