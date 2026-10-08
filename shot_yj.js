// v0.11.7 验机动画关键帧定格实测 + 速收/验机横带
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
  // 速收横带（标签断行验证）
  await page.evaluate(() => document.querySelectorAll('#biz-cards .biz-band')[2].scrollIntoView({ block: 'center' }));
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'shots/v0117-d-ss.png' });
  // 验机横带：定格动画关键帧
  await page.evaluate(() => document.querySelectorAll('#biz-cards .biz-band')[3].scrollIntoView({ block: 'center' }));
  await page.waitForTimeout(400);
  // 帧1：t=2.85s 手机正进机器、队列右移
  await page.evaluate(() => { document.getAnimations().forEach(a => { a.currentTime = 2850; a.pause(); }); });
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'shots/v0117-yj-enter.png' });
  // 帧2：t=5.0s 报告弹出+绿✓
  await page.evaluate(() => { document.getAnimations().forEach(a => { a.currentTime = 5000; }); });
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'shots/v0117-yj-report.png' });
  await browser.close();
  console.log('done');
})();
