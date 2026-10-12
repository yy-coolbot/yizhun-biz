const { chromium } = require('playwright-core');
const EXE = 'C:/Users/EDY/AppData/Local/ms-playwright/chromium-1232/chrome-win64/chrome.exe';
const BASE = 'file:///F:/workBuddy新数据库6.9/2026-09-21-17-02-58/yizhun-biz/index.html';
(async () => {
  const browser = await chromium.launch({ executablePath: EXE });
  const jobs = [
    { biz: 'baomai', w: 1440, h: 900, out: 'shots/v0123-d-bm-rules.png' },
    { biz: 'paiji', w: 1440, h: 900, out: 'shots/v0123-d-pj-rules.png' },
    { biz: 'baomai', w: 390, h: 844, out: 'shots/v0123-m-bm-rules.png' },
    { biz: 'paiji', w: 390, h: 844, out: 'shots/v0123-m-pj-rules.png' }
  ];
  for (const j of jobs) {
    const page = await browser.newPage({ viewport: { width: j.w, height: j.h } });
    await page.goto(BASE + '?biz=' + j.biz, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => document.querySelectorAll('.reveal').forEach(el => el.classList.add('in')));
    const el = await page.$('#' + (j.biz === 'baomai' ? 'bm-rules' : 'pj-rules'));
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(900);
    await el.screenshot({ path: j.out });
    console.log('saved', j.out);
    await page.close();
  }
  await browser.close();
})();
