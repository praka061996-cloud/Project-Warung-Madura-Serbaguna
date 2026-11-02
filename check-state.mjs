import { chromium } from 'playwright';

async function check() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  const state = await page.evaluate(() => {
    return {
      hasHeader: !!document.querySelector('header'),
      headerText: document.querySelector('header')?.innerText,
      h2Text: document.querySelector('h2')?.innerText,
    };
  });

  console.log('Browser state on boot:', state);
  await browser.close();
}

check().catch(console.error);
