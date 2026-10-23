// Kiwiw AI layer. Every feature has a real implementation that activates when
// the matching API key is present, and a mock fallback so the UI is fully
// usable with no key. Browser-side keys are fine for local prototyping; for
// production, proxy these through your own backend so keys are never shipped.

const env = import.meta.env as Record<string, string | undefined>;

export const keys = {
  openai: env.VITE_OPENAI_API_KEY,
  removebg: env.VITE_REMOVEBG_API_KEY,
};

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

/* ---------------- Magic Write ---------------- */
export type WriteMode = "write" | "rephrase" | "shorten" | "expand";

export async function magicWrite(prompt: string, mode: WriteMode): Promise<string> {
  if (keys.openai) {
    const sys = {
      write: "You are a concise copywriter. Produce punchy marketing copy.",
      rephrase: "Rephrase the user's text, keeping meaning, improving flow.",
      shorten: "Shorten the user's text to its essence.",
      expand: "Expand the user's text into a fuller paragraph.",
    }[mode];
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${keys.openai}` },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "system", content: sys }, { role: "user", content: prompt }],
        temperature: 0.8,
      }),
    });
    if (!res.ok) throw new Error(`OpenAI error ${res.status}`);
    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() ?? "";
  }

  // Mock
  await delay(700);
  const base = prompt.trim() || "your idea";
  switch (mode) {
    case "rephrase": return `Here's a fresh take: ${base} — reimagined with clarity and a confident voice.`;
    case "shorten": return base.split(/\s+/).slice(0, 8).join(" ") + "…";
    case "expand": return `${base}. And there's more to it — this version adds context, benefits, and a clear call to action so readers know exactly what to do next.`;
    default: return `✨ ${capitalize(base)} that people actually love.\nBuilt for speed. Designed to stand out. Yours in minutes.`;
  }
}

/* ---------------- Magic Image ---------------- */
export async function magicImage(prompt: string): Promise<string> {
  if (keys.openai) {
    const res = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${keys.openai}` },
      body: JSON.stringify({ model: "gpt-image-1", prompt, size: "1024x1024", n: 1 }),
    });
    if (!res.ok) throw new Error(`OpenAI image error ${res.status}`);
    const data = await res.json();
    const b64 = data.data?.[0]?.b64_json;
    if (b64) return `data:image/png;base64,${b64}`;
    if (data.data?.[0]?.url) return data.data[0].url;
    throw new Error("No image returned");
  }

  // Mock — generate an original gradient SVG "art" from the prompt.
  await delay(900);
  return gradientArt(prompt);
}

/* ---------------- Background Removal ---------------- */
export async function removeBackground(imageSrc: string): Promise<string> {
  if (keys.removebg) {
    const blob = await (await fetch(imageSrc)).blob();
    const form = new FormData();
    form.append("image_file", blob);
    form.append("size", "auto");
    const res = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: { "X-Api-Key": keys.removebg },
      body: form,
    });
    if (!res.ok) throw new Error(`remove.bg error ${res.status}`);
    const out = await res.blob();
    return URL.createObjectURL(out);
  }

  // Mock — client-side flood-fill from the corners to knock out a near-uniform
  // background. Real, just simpler than an ML matting model.
  await delay(600);
  return naiveBgRemove(imageSrc);
}

/* ---------------- helpers ---------------- */
function capitalize(s: string) { return s.charAt(0).toUpperCase() + s.slice(1); }

function gradientArt(prompt: string): string {
  const seed = [...prompt].reduce((a, c) => a + c.charCodeAt(0), 0);
  const h1 = seed % 360, h2 = (seed * 7) % 360, h3 = (seed * 13) % 360;
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='1024' height='1024'>
    <defs><radialGradient id='g' cx='30%' cy='30%'>
      <stop offset='0%' stop-color='hsl(${h1},80%,60%)'/>
      <stop offset='60%' stop-color='hsl(${h2},70%,45%)'/>
      <stop offset='100%' stop-color='hsl(${h3},75%,25%)'/>
    </radialGradient></defs>
    <rect width='1024' height='1024' fill='url(#g)'/>
    <circle cx='${seed % 900 + 60}' cy='${(seed * 3) % 900 + 60}' r='${seed % 200 + 80}' fill='white' opacity='0.12'/>
    <circle cx='${(seed * 5) % 900 + 60}' cy='${(seed * 2) % 900 + 60}' r='${seed % 160 + 60}' fill='black' opacity='0.1'/>
    <text x='50%' y='94%' font-family='Inter,sans-serif' font-size='34' fill='rgba(255,255,255,.85)' text-anchor='middle'>${escapeXml(prompt).slice(0, 40)}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function escapeXml(s: string) {
  return s.replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" }[c]!));
}

function naiveBgRemove(src: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = img.naturalWidth; c.height = img.naturalHeight;
      const ctx = c.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      try {
        const d = ctx.getImageData(0, 0, c.width, c.height);
        const p = d.data;
        const [br, bg, bb] = [p[0], p[1], p[2]]; // top-left as bg sample
        const tol = 48;
        for (let i = 0; i < p.length; i += 4) {
          if (Math.abs(p[i] - br) < tol && Math.abs(p[i + 1] - bg) < tol && Math.abs(p[i + 2] - bb) < tol) {
            p[i + 3] = 0;
          }
        }
        ctx.putImageData(d, 0, 0);
        resolve(c.toDataURL("image/png"));
      } catch {
        resolve(src); // tainted canvas (cross-origin) — return original
      }
    };
    img.onerror = () => reject(new Error("image load failed"));
    img.src = src;
  });
}
