// Share link (DESIGN.md §21): the whole design, compressed into the URL hash.
// No backend: the hash never reaches a server. Uploaded photos (data: URLs)
// make links too long, so we say so and offer Export instead.
import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from "lz-string";
import type { KiwiwDoc } from "../types";

/** Past this, chat apps and some browsers start truncating links. */
export const MAX_LINK = 12000;

export function shareLink(doc: KiwiwDoc): { url: string; ok: true } | { ok: false; reason: string; length: number } {
  const heavy = doc.elements.filter((e) => e.type === "image" && e.src.startsWith("data:")).length;
  const packed = compressToEncodedURIComponent(JSON.stringify({ v: 1, doc }));
  const url = `${location.origin}/view#d=${packed}`;
  if (url.length > MAX_LINK) {
    return { ok: false, length: url.length, reason: heavy ? `${heavy} uploaded photo${heavy > 1 ? "s" : ""} live inside this design, so the link would be ${Math.round(url.length / 1000)}k characters long. Links that long get chopped by WhatsApp.` : `This design is too detailed for a link (${Math.round(url.length / 1000)}k characters).` };
  }
  return { ok: true, url };
}

export function readLink(hash: string): KiwiwDoc | null {
  const m = hash.match(/[#&]d=([^&]+)/);
  if (!m) return null;
  try {
    const data = JSON.parse(decompressFromEncodedURIComponent(m[1]) ?? "");
    const d = data?.doc;
    return d && typeof d.width === "number" && Array.isArray(d.elements) ? (d as KiwiwDoc) : null;
  } catch { return null; }
}
