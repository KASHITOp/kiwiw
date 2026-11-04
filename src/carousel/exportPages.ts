// Carousel export: every page rendered offscreen at full size, then one PDF
// (jsPDF) or a ZIP of PNGs (JSZip).
import { createElement } from "react";
import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import { toJpeg, toPng } from "html-to-image";
import ElementContent from "../editor/ElementContent";
import type { KiwiwDoc } from "../types";

function Page({ doc }: { doc: KiwiwDoc }) {
  return createElement("div", { style: { position: "relative", width: doc.width, height: doc.height, background: doc.background, overflow: "hidden" } },
    doc.elements.filter((e) => !e.hidden).map((el) => createElement("div", { key: el.id, className: "el", style: { position: "absolute", left: el.x, top: el.y, width: el.w, height: el.h, opacity: el.opacity, transform: `rotate(${el.rotation}deg)` } }, createElement(ElementContent, { el }))));
}

async function renderAll(pages: KiwiwDoc[], onProgress: (p: number) => void, jpeg = false): Promise<string[]> {
  const host = document.createElement("div");
  host.style.cssText = "position:fixed;left:-100000px;top:0;pointer-events:none";
  document.body.appendChild(host);
  const out: string[] = [];
  try {
    for (let i = 0; i < pages.length; i++) {
      const box = document.createElement("div");
      host.appendChild(box);
      const root = createRoot(box);
      flushSync(() => root.render(createElement(Page, { doc: pages[i] })));
      await document.fonts.ready;
      await Promise.all(Array.from(box.querySelectorAll("img")).map((im) => im.decode().catch(() => null)));
      await new Promise((r) => setTimeout(r, 120));
      const node = box.firstElementChild as HTMLElement, o = { width: pages[i].width, height: pages[i].height, pixelRatio: 1 };
      out.push(jpeg ? await toJpeg(node, { ...o, quality: 0.9, backgroundColor: pages[i].background }) : await toPng(node, o));
      root.unmount(); box.remove();
      onProgress((i + 1) / pages.length);
    }
  } finally { host.remove(); }
  return out;
}

const download = (blob: Blob, name: string) => {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  (window as unknown as { __kiwiwExport?: string }).__kiwiwExport = `${name}:${blob.size}`;
};

export async function exportPdf(pages: KiwiwDoc[], onProgress: (p: number) => void) {
  const { jsPDF } = await import("jspdf");
  // JPEG inside the PDF: ~15x smaller than PNG, LinkedIn re-compresses anyway
  const imgs = await renderAll(pages, onProgress, true);
  const { width: w, height: h } = pages[0];
  const pdf = new jsPDF({ orientation: w > h ? "landscape" : "portrait", unit: "px", format: [w, h], hotfixes: ["px_scaling"] });
  imgs.forEach((src, i) => { if (i) pdf.addPage([pages[i].width, pages[i].height], pages[i].width > pages[i].height ? "landscape" : "portrait"); pdf.addImage(src, "JPEG", 0, 0, pages[i].width, pages[i].height); });
  download(pdf.output("blob"), "kiwiw-carousel.pdf");
}

export async function exportZip(pages: KiwiwDoc[], onProgress: (p: number) => void) {
  const { default: JSZip } = await import("jszip");
  const imgs = await renderAll(pages, onProgress);
  const zip = new JSZip();
  imgs.forEach((src, i) => zip.file(`slide-${String(i + 1).padStart(2, "0")}.png`, src.split(",")[1], { base64: true }));
  download(await zip.generateAsync({ type: "blob" }), "kiwiw-carousel.zip");
}
