/** Fit the page inside the stage that's actually on screen (panels may be collapsed). */
export function fitZoom(w: number, h: number) {
  const st = document.querySelector(".stage") as HTMLElement | null;
  const availW = (st?.clientWidth ?? window.innerWidth - 56 - 320 - 300) - 96;
  const availH = (st?.clientHeight ?? window.innerHeight - 52) - 120; // room for the zoom pill
  return Math.max(0.1, Math.min(1, Math.min(availW / w, availH / h)));
}
