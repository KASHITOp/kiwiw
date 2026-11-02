import { useEffect } from "react";

const CODE = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

/** ↑↑↓↓←→←→BA. Squeezes every kiwi on the page. */
export function useKonami(onWin: () => void) {
  useEffect(() => {
    let i = 0;
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      i = k === CODE[i] ? i + 1 : k === CODE[0] ? 1 : 0;
      if (i === CODE.length) { i = 0; onWin(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onWin]);
}

export function squeezeKiwis() {
  const root = document.documentElement;
  root.classList.remove("kiwi-squeeze");
  void root.offsetWidth; // restart the animation
  root.classList.add("kiwi-squeeze");
  setTimeout(() => root.classList.remove("kiwi-squeeze"), 1400);
}
