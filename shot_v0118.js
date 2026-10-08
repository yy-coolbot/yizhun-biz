// v0.11.8 局部实测：四大业务验机LOGO胶囊 + 困局区改版
const { chromium } = require('playwright-core');
const EXE = 'C:/Users/EDY/AppData/Local/ms-playwright/chromium-1232/chrome-win64/chrome.exe';
const URL = 'file:///F:/workBuddy新数据库6.9/2026-09-21-17-02-58/yizhun-biz/index.html';

(async () => {
  const browser = await chromium.launch({ executablePath: EXE });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    document.querySelectorAll('img').forEach(i => i.loading = 'eager');
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
  });
  // 验机横带（LOGO胶囊）
  await page.evaluate(() => document.querySelectorAll('#biz-cards .biz-band')[3].scrollIntoView({ block: 'center' }));
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'shots/v0118-yj-logo.png' });
  // 保卖横带（对照LOGO）
  await page.evaluate(() => document.querySelectorAll('#biz-cards .biz-band')[0].scrollIntoView({ block: 'center' }));
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'shots/v0118-bm-logo.png' });
  // 困局区（新文案+总结条）
  await page.evaluate(() => document.getElementById('why').scrollIntoView({ block: 'start' }));
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'shots/v0118-why.png' });
  await page.evaluate(() => document.querySelector('#why .why-sum').scrollIntoView({ block: 'center' }));
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'shots/v0118-whysum.png' });
  await browser.close();
  console.log('done');
})();
