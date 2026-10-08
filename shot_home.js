// v0.11.0 首页双端截图实测
const { chromium } = require('playwright-core');
const EXE = 'C:/Users/EDY/AppData/Local/ms-playwright/chromium-1232/chrome-win64/chrome.exe';
const URL = 'file:///F:/workBuddy新数据库6.9/2026-09-21-17-02-58/yizhun-biz/index.html';

(async () => {
  const browser = await chromium.launch({ executablePath: EXE });
  async function shoot(cons, tag, width, height) {
    const page = await browser.newPage({ viewport: { width, height } });
    await page.goto(URL, { waitUntil: 'networkidle' });
    // 图片 eager + reveal 全部点亮
    await page.evaluate(() => {
      document.querySelectorAll('img').forEach(i => i.loading = 'eager');
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
    });
    await page.waitForTimeout(800);
    // 分段截图
    const stops = [
      ['hero', '#biz-cards'],          // 首屏+业务入口
      ['why', '#why'],                  // 困局+旅程动画
      ['answer', '#answer'],            // 金句+解法
      ['tail', '#join'],                // 底座+CTA
    ];
    for (const [name, sel] of stops) {
      await page.evaluate(s => { document.querySelector(s).scrollIntoView({ block: 'start' }); }, sel);
      await page.waitForTimeout(700);
      await page.screenshot({ path: `shots/${tag}-${name}.png` });
    }
    // 验机动画中途帧（手机进机器+报告打勾）
    await page.evaluate(() => document.querySelectorAll('#biz-cards .biz-band')[3].scrollIntoView({ block: 'center' }));
    await page.waitForTimeout(2300);
    await page.screenshot({ path: `shots/${tag}-anim-mid.png` });
    await page.waitForTimeout(1800);
    await page.screenshot({ path: `shots/${tag}-anim-mid2.png` });
    // 整页长图
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(400);
    await page.screenshot({ path: `shots/${tag}-full.png`, fullPage: true });
    await page.close();
    console.log('done', tag);
  }
  await shoot(null, 'v0118-d', 1440, 900);
  await shoot(null, 'v0118-m', 390, 844);
  await browser.close();
})();
