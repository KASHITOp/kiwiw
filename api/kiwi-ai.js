// Vercel function: Magic tools v3 via Gemini (DESIGN.md §19). The key stays
// server-side (GEMINI_API_KEY). Any failure → 204, and the client silently
// uses its built-in fallback. Tasks: tone, translate, caption, palette, roast.
const RULES = "No real brands, products, celebrities, characters, films or song lyrics. Never insult people, only designs.";

const TONES = {
  corporate: "a corporate LinkedIn voice: synergy, alignment, 'per my last email', polite and stiff",
  unhinged: "an unhinged, chaotic, all-caps-energy voice that is still readable and funny",
  hinglish: "casual Hinglish (Hindi words in Latin script mixed with English), warm and desi",
  genz: "Gen-Z internet slang (no cap, it's giving, lowkey, slay) without emojis",
  uncle: "a Desi uncle giving unsolicited advice ('Beta, in my time…'), affectionate and preachy",
  shark: "a Shark Tank style pitch: the ask, the valuation, the hook, very confident",
};

function prompt(task, b) {
  const text = String(b.text ?? "").slice(0, 600);
  switch (task) {
    case "tone": {
      const tone = TONES[b.tone] ?? TONES.unhinged;
      const max = Math.max(2, Math.min(60, Number(b.maxWords) || 12));
      return `Rewrite this poster text in ${tone}. Keep the meaning. At most ${max} words (it must fit its box). ${RULES} Return JSON {"text": string}.\n\nText: ${text}`;
    }
    case "translate": {
      const to = { hi: "Hindi in Devanagari script", gu: "Gujarati in Gujarati script", hinglish: "Hinglish (Hindi in Latin script mixed with English)" }[b.to] ?? "Hindi in Devanagari script";
      return `Translate this short poster text into ${to}. Keep it natural and punchy, like a desi poster, not a literal translation. Keep numbers, times and ₹ amounts. ${RULES} Return JSON {"text": string}.\n\nText: ${text}`;
    }
    case "caption":
      return `Write social captions for this design. Design text: "${text}". Style: ${String(b.style ?? "").slice(0, 60)}. Return JSON {"instagram": string (2 short lines, playful, Hinglish allowed), "linkedin": string (3 short lines, professional but human, one light joke), "hashtags": string[] (8 lowercase tags without spaces)}. ${RULES}`;
    case "palette":
      return `Create a 5-colour poster palette for the vibe "${text}". Order: background, main ink, accent, second accent, highlight. Ensure the main ink is readable on the background (contrast 4.5:1+). Return JSON {"name": string (2-4 funny words), "colors": string[5] (hex like #A1B2C3)}.`;
    case "roast":
      return `You roast graphic designs, never people. Here is a design: ${String(b.summary ?? "").slice(0, 1500)}. Write 3 short, specific, funny roasts (max 18 words each) about typography, colour, layout or spacing. Desi humour welcome. ${RULES} Return JSON {"roasts": string[3]}.`;
  }
  return null;
}

export default async function handler(req, res) {
  if (req.method !== "POST") { res.status(405).end(); return; }
  const key = process.env.GEMINI_API_KEY;
  const skip = (why) => { res.setHeader("X-Juice-Reason", why); res.status(204).end(); };
  if (!key) { skip("no-key"); return; }
  let body = {};
  try { body = typeof req.body === "string" ? JSON.parse(req.body) : req.body ?? {}; } catch { /* bad body */ }
  const p = prompt(String(body.task ?? ""), body);
  if (!p) { res.status(400).end(); return; }

  const models = [process.env.GEMINI_MODEL, "gemini-flash-lite-latest", "gemini-3.8-flash", "gemini-3.5-flash-lite"].filter(Boolean);
  const deadline = Date.now() + 22000;
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
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: p }] }],
          generationConfig: { temperature: 0.9, responseMimeType: "application/json", ...(/lite/.test(model) ? {} : { thinkingConfig: { thinkingBudget: 0 } }) },
        }),
      });
      if (!r.ok) { why = `upstream-${r.status}`; continue; }
      const data = await r.json();
      const raw = String(data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "");
      let out;
      try { out = JSON.parse(raw.replace(/^```(?:json)?|```$/g, "").trim()); } catch { why = "bad-json"; continue; }
      res.setHeader("X-Juice-Model", model);
      res.setHeader("Cache-Control", "no-store");
      res.status(200).json(out);
      return;
    } catch (e) {
      why = e?.name === "AbortError" ? "timeout" : "network";
    } finally { clearTimeout(timer); }
  }
  skip(why);
}
