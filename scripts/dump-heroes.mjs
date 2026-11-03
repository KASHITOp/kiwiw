// Freeze the hero templates (built with real font metrics) to JSON.
//   node scripts/dump-heroes.mjs   (dev server on :5173)
import { chromium } from "playwright-core";
import { writeFileSync } from "node:fs";
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
const page = await browser.newPage();
await page.goto("http://localhost:5173/dev/kit?dump=heroes", { waitUntil: "networkidle" });
await page.waitForSelector("#dump", { timeout: 30000 });
const json = await page.textContent("#dump");
writeFileSync("src/data/tpl/heroes.json", JSON.stringify(JSON.parse(json), null, 0));
console.log("heroes:", JSON.parse(json).length);
await browser.close();
