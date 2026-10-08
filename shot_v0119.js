// v0.11.19 对齐+文案修改截图实测
const { chromium } = require('playwright-core');
const EXE = 'C:/Users/EDY/AppData/Local/ms-playwright/chromium-1232/chrome-win64/chrome.exe';
const BASE = 'file:///F:/workBuddy新数据库6.9/2026-09-21-17-02-58/yizhun-biz/index.html';

(async () => {
  const browser = await chromium.launch({ executablePath: EXE });
  async function shoot(url, tag, width, height, stops) {
    const page = await browser.newPage({ viewport: { width, height } });
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.evaluate(() => {
      document.querySelectorAll('img').forEach(i => i.loading = 'eager');
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
    });
    await page.waitForTimeout(900);
    for (const [name, sel] of stops) {
      await page.evaluate(s => { document.querySelector(s).scrollIntoView({ block: 'start' }); }, sel);
      await page.waitForTimeout(700);
      await page.screenshot({ path: `shots/${tag}-${name}.png` });
    }
    await page.close();
    console.log('done', tag);
  }
  // 首页：业务卡(二手机中心文案) + 关于绿怡(简称/致力于)
  await shoot(BASE, 'v0119-d-home', 1440, 900, [['biz', '#biz-cards'], ['about', '#about']]);
  // 保卖子页：痛点区对齐 + 02高价卡(全球二手商即时竞价)
  await shoot(BASE + '?biz=baomai', 'v0119-d-bm', 1440, 900, [['pain', '#bm-pain'], ['adv', '#bm-adv']]);
  // 拍机子页：痛点区对齐
  await shoot(BASE + '?biz=paiji', 'v0119-d-pj', 1440, 900, [['pain', '#pj-pain']]);
  // 移动端痛点对齐抽查
  await shoot(BASE + '?biz=baomai', 'v0119-m-bm', 390, 844, [['pain', '#bm-pain']]);
  await browser.close();
})();
