// Personality event bus (DESIGN.md §13): toasts and mascot reactions.
// One toast at a time; the mascot only reacts to real events.
import { create } from "zustand";

export type Mood = "idle" | "happy" | "shook" | "proud" | "squeeze" | "judging";

interface Bus {
  toastMsg: string | null;
  toastKey: number;
  mood: Mood;
  line: string | null;
  moodKey: number;
  toast: (msg: string) => void;
  react: (mood: Mood, line?: string) => void;
}

export const useBus = create<Bus>((set) => ({
  toastMsg: null,
  toastKey: 0,
  mood: "idle",
  line: null,
  moodKey: 0,
  toast: (msg) => set((s) => ({ toastMsg: msg, toastKey: s.toastKey + 1 })),
  react: (mood, line) => set((s) => ({ mood, line: line ?? null, moodKey: s.moodKey + 1 })),
}));

export const toast = (msg: string) => useBus.getState().toast(msg);
export const react = (mood: Mood, line?: string) => useBus.getState().react(mood, line);

/** Error copy: what broke, what to do, a light line. Never blames the user. */
export const oops = (what: string, e: unknown) =>
  toast(`${what} tripped over a seed. Try again? (${(e as Error)?.message ?? "unknown"})`);
