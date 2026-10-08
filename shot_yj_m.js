// v0.11.7 移动端四大业务横带局部实测
const { chromium } = require('playwright-core');
const EXE = 'C:/Users/EDY/AppData/Local/ms-playwright/chromium-1232/chrome-win64/chrome.exe';
const URL = 'file:///F:/workBuddy新数据库6.9/2026-09-21-17-02-58/yizhun-biz/index.html';

(async () => {
  const browser = await chromium.launch({ executablePath: EXE });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    document.querySelectorAll('img').forEach(i => i.loading = 'eager');
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
  });
  const bands = document => document.querySelectorAll('#biz-cards .biz-band');
  // 拍机带
  await page.evaluate(() => document.querySelectorAll('#biz-cards .biz-band')[1].scrollIntoView({ block: 'center' }));
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'shots/v0117-m-pj.png' });
  // 验机带：定格在报告帧
  await page.evaluate(() => document.querySelectorAll('#biz-cards .biz-band')[3].scrollIntoView({ block: 'center' }));
  await page.waitForTimeout(400);
  await page.evaluate(() => { document.getAnimations().forEach(a => { a.currentTime = 5000; a.pause(); }); });
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'shots/v0117-m-yj.png' });
  await browser.close();
  console.log('done');
})();
