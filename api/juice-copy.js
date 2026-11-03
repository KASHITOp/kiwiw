// Vercel serverless function: Juice It copy via Gemini.
// The key lives only on the server (env GEMINI_API_KEY) and never reaches the
// browser. Any failure returns 204, and the client keeps its built-in copy.
const RECIPES = {
  nazar: "Nazar Battu, desi pop: protective auntie meets meme page. head MUST be Hindi (Devanagari), sub Hinglish",
  tapri: "Tapri Print, truck-art kitsch: chai-stall signboard. head MUST be Hindi (Devanagari), sub Hinglish",
  stadium: "Stadium Halftone, sports editorial: pre-match hype, deadly serious about silly things, ALL CAPS",
  brutal: "Brutal Grid, brutalist web: manifesto memo, numbered demands, ALL CAPS",
  swiss: "Swiss Drop, Swiss experimental: quiet, dry, gallery-wall humour",
  trippy: "Trippy Window, retro psychedelic: affirmations from your laptop at 2am",
  neo: "Neo Brutal Pop, neo-brutalism: app notifications for real life",
  pixel: "8-Bit Flex, pixel game UI: achievement unlocked, LEVEL UP style, ALL CAPS",
  sticker: "Sticker Bomb, streetwear drop: hype-beast but self-aware",
  glossy: "Glossy Bloom, glossy luxury: soft launch, gentle brag, 2-3 word head",
};

export default async function handler(req, res) {
  if (req.method !== "POST") { res.status(405).end(); return; }
  const key = process.env.GEMINI_API_KEY;
  // X-Juice-Reason explains a fallback (never includes the key)
  const skip = (why) => { res.setHeader("X-Juice-Reason", why); res.status(204).end(); };
  if (!key) { skip("no-key"); return; }
  let text = "";
  try { text = String((typeof req.body === "string" ? JSON.parse(req.body) : req.body)?.text ?? "").slice(0, 120).trim(); } catch { /* bad body */ }
  if (!text) { res.status(400).end(); return; }

  const prompt = `You write poster copy for the line: "${text}".
Return JSON with exactly these keys: ${Object.keys(RECIPES).join(", ")}.
Each value is {"head": max 5 words, "sub": max 9 words}. Tones:
${Object.entries(RECIPES).map(([k, v]) => `- ${k}: ${v}`).join("\n")}
Rules: witty, never mean; no real brands, celebrities, sports clubs or characters; keep dates, times and places out of "head".`;

  // Models in order. Lite first: fastest. Google retires model ids, so
  // GEMINI_MODEL (if set) is tried first and the list falls through 404/503s.
  const models = [process.env.GEMINI_MODEL, "gemini-flash-lite-latest", "gemini-3.8-flash", "gemini-3.5-flash-lite"].filter(Boolean);
  const deadline = Date.now() + 25000;
  let r = null, why = "no-model";
  try {
    for (const model of models) {
      const left = deadline - Date.now();
      if (left < 1500) { why = "timeout"; break; }
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), left);
      const lite = /lite/.test(model);
      try {
        r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
          method: "POST",
          signal: ctrl.signal,
          headers: { "Content-Type": "application/json", "x-goog-api-key": key },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            // lite models reject thinkingConfig; full flash gets no thinking (copy should be fast, not deep)
            generationConfig: { temperature: 0.95, responseMimeType: "application/json", ...(lite ? {} : { thinkingConfig: { thinkingBudget: 0 } }) },
          }),
        });
      } catch (e) {
        r = null; why = e?.name === "AbortError" ? "timeout" : "network";
      } finally { clearTimeout(timer); }
      if (r?.ok) { res.setHeader("X-Juice-Model", model); break; }
      if (r) why = `upstream-${r.status}`;
      r = null;
    }
    if (!r) { skip(why); return; }
    const data = await r.json();
    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";
    const parsed = JSON.parse(raw);
    // keep only known recipes and short strings
    const clean = {};
    for (const k of Object.keys(RECIPES)) {
      const v = parsed?.[k];
      if (v && typeof v.head === "string") clean[k] = { head: v.head.slice(0, 48), ...(typeof v.sub === "string" ? { sub: v.sub.slice(0, 80) } : {}) };
    }
    res.setHeader("Cache-Control", "no-store");
    res.status(200).json(clean);
  } catch (e) {
    skip(e?.name === "AbortError" ? "timeout" : "parse-or-network");
  }
}
