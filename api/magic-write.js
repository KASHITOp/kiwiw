// Vercel function: Magic Write via Gemini. Key stays server-side
// (GEMINI_API_KEY). Any failure → 204 and the client uses its built-in writer.
const MODES = {
  write: "Write punchy, witty poster copy (max 2 short lines) about the user's idea. Never generic.",
  rephrase: "Rephrase the user's text with more personality. Keep the meaning. Max 2 lines.",
  shorten: "Shorten the user's text to its punchiest essence. Max 8 words.",
  expand: "Expand the user's text into 2-3 lively sentences with a clear call to action.",
};

export default async function handler(req, res) {
  if (req.method !== "POST") { res.status(405).end(); return; }
  const key = process.env.GEMINI_API_KEY;
  const skip = (why) => { res.setHeader("X-Juice-Reason", why); res.status(204).end(); };
  if (!key) { skip("no-key"); return; }
  let body = {};
  try { body = typeof req.body === "string" ? JSON.parse(req.body) : req.body ?? {}; } catch { /* bad body */ }
  const text = String(body.text ?? "").slice(0, 400).trim();
  const mode = MODES[body.mode] ? body.mode : "write";
  if (!text) { res.status(400).end(); return; }

  const prompt = `${MODES[mode]} Hinglish is fine if the input is Indian. No real brands, celebrities or characters. Return plain text only, no quotes or markdown.\n\nInput: ${text}`;
  const models = [process.env.GEMINI_MODEL, "gemini-flash-lite-latest", "gemini-3.8-flash", "gemini-3.5-flash-lite"].filter(Boolean);
  const deadline = Date.now() + 25000;
  let why = "no-model";
  for (const model of models) {
    const left = deadline - Date.now();
    if (left < 1500) { why = "timeout"; break; }
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), left);
    try {
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
        method: "POST", signal: ctrl.signal,
        headers: { "Content-Type": "application/json", "x-goog-api-key": key },
        body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig: { temperature: 0.9, ...(/lite/.test(model) ? {} : { thinkingConfig: { thinkingBudget: 0 } }) } }),
      });
      if (!r.ok) { why = `upstream-${r.status}`; continue; }
      const data = await r.json();
      const out = String(data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "").trim().replace(/^["']|["']$/g, "").slice(0, 600);
      if (!out) { why = "empty"; continue; }
      res.setHeader("X-Juice-Model", model);
      res.setHeader("Cache-Control", "no-store");
      res.status(200).json({ text: out });
      return;
    } catch (e) {
      why = e?.name === "AbortError" ? "timeout" : "network";
    } finally { clearTimeout(timer); }
  }
  skip(why);
}
