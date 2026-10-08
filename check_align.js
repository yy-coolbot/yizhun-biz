// 线上页面解法块对齐实测：量 .fix 的 offsetTop
const { chromium } = require('playwright-core');
const EXE = 'C:/Users/EDY/AppData/Local/ms-playwright/chromium-1232/chrome-win64/chrome.exe';
const BASE = 'https://yy-coolbot.github.io/yizhun-biz/';

(async () => {
  const browser = await chromium.launch({ executablePath: EXE });
  // 复现用户路径：聚合页 → 点击「了解壹准保卖/拍机」进子页（v0.11.20 踩坑场景）
  for (const [biz, goTxt] of [['baomai', '了解壹准保卖'], ['paiji', '了解壹准拍机']]) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    try {
      await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 60000 });
    } catch (e) { console.log('首页导航失败: ' + e.message.split('\n')[0]); await page.close(); continue; }
    await page.waitForTimeout(1500);
    await page.evaluate(() => {
      document.querySelectorAll('img').forEach(i => i.loading = 'eager');
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
    });
    await page.getByText(goTxt).first().click();
    await page.waitForTimeout(1800);
    const rows = await page.evaluate(() => {
      const out = [];
      document.querySelectorAll('.pain-grid').forEach(g => {
        const cards = g.querySelectorAll('.pain-card');
        for (let i = 0; i + 1 < cards.length; i += 2) {
          const fa = cards[i].querySelector('.fix'), fb = cards[i + 1].querySelector('.fix');
          if (!fa || !fb) continue;
          out.push({
            row: (i / 2 + 1),
            leftTop: Math.round(fa.getBoundingClientRect().top + window.scrollY),
            rightTop: Math.round(fb.getBoundingClientRect().top + window.scrollY)
          });
        }
      });
      return out;
    });
    rows.forEach(r => {
      const ok = r.leftTop === r.rightTop ? '✅齐' : '❌差' + Math.abs(r.leftTop - r.rightTop) + 'px';
      console.log(`首页点进${biz} 行${r.row}: L=${r.leftTop} R=${r.rightTop} ${ok}`);
    });
    await page.close();
  }
  await browser.close();
})();
