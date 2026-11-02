// Headless screenshot + console-error harness using the locally installed
// Chrome (no browser download). Usage:
//   node scripts/shoot.mjs <spec.json> <outDir>
// spec: [{ name, url, width, height, steps?: [{ eval } | { click } | { wait } | { press } | { type }],
//          selector?, fullPage?, scroll? }]
import { chromium } from "playwright-core";
import { readFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const [specPath, outDir = "shots"] = process.argv.slice(2);
const spec = JSON.parse(readFileSync(specPath, "utf8"));
mkdirSync(outDir, { recursive: true });

const exe = process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe";
const browser = await chromium.launch({ executablePath: exe, headless: true });
const results = [];

for (const s of spec) {
  const ctx = await browser.newContext({ viewport: { width: s.width ?? 1366, height: s.height ?? 768 }, deviceScaleFactor: s.dpr ?? 1 });
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => { if (m.type() === "error" || m.type() === "warning") errors.push(`${m.type()}: ${m.text()}`); });
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  await page.goto(s.url, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  for (const st of s.steps ?? []) {
    if (st.eval) await page.evaluate(st.eval);
    if (st.click) await page.click(st.click);
    if (st.press) await page.keyboard.press(st.press);
    if (st.type) await page.keyboard.type(st.type);
    if (st.wait) await page.waitForTimeout(st.wait);
  }
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(s.settle ?? 250);
  const file = join(outDir, `${s.name}.png`);
  if (s.selector) await page.locator(s.selector).first().screenshot({ path: file });
  else await page.screenshot({ path: file, fullPage: !!s.fullPage });
  let data;
  if (s.collect) data = await page.evaluate(s.collect);
  results.push({ name: s.name, file, errors, data });
  await ctx.close();
}

await browser.close();
console.log(JSON.stringify(results, null, 1));
