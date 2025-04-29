import { chromium } from "playwright";

async function openPlaywright(url: string) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: "domcontentloaded" });

  return { page, browser };
}

export default openPlaywright;
