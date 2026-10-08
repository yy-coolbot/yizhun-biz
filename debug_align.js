// 解剖行2错位：点击进入后 600ms/1800ms 两个时刻的状态 + 手动重跑等高器对比
const { chromium } = require('playwright-core');
const EXE = 'C:/Users/EDY/AppData/Local/ms-playwright/chromium-1232/chrome-win64/chrome.exe';
const BASE = 'file:///F:/workBuddy新数据库6.9/2026-09-21-17-02-58/yizhun-biz/index.html';

(async () => {
  const browser = await chromium.launch({ executablePath: EXE });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1200);
  await page.evaluate(() => {
    document.querySelectorAll('img').forEach(i => i.loading = 'eager');
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
  });
  await page.getByText('了解壹准保卖').first().click();

  async function dump(tag) {
    const rows = await page.evaluate(() => {
      const out = [];
      // 只看可见视图里的 pain-grid（跳过隐藏视图的 0 值网格）
      document.querySelectorAll('.pain-grid').forEach(g => {
        const cards = g.querySelectorAll('.pain-card');
        for (let i = 0; i + 1 < cards.length; i += 2) {
          const fa = cards[i].querySelector('.fix'), fb = cards[i + 1].querySelector('.fix');
          if (!fa || !fb || !fa.offsetHeight) continue;
          out.push({
            row: (i / 2 + 1),
            Lw: cards[i].clientWidth, Rw: cards[i + 1].clientWidth,
            Lh: fa.offsetHeight, Rh: fb.offsetHeight,
            Lmin: fa.style.minHeight, Rmin: fb.style.minHeight,
            Ltop: Math.round(fa.getBoundingClientRect().top + window.scrollY),
            Rtop: Math.round(fb.getBoundingClientRect().top + window.scrollY)
          });
        }
      });
      return out;
    });
    rows.forEach(r => console.log(`${tag} 行${r.row}: 卡宽${r.Lw}/${r.Rw} 高${r.Lh}/${r.Rh} min=${r.Lmin}/${r.Rmin} 顶${r.Ltop}/${r.Rtop} ${r.Ltop === r.Rtop ? '✅' : '❌差' + (r.Rtop - r.Ltop)}`));
  }
  await dump('点击+600ms');
  await page.waitForTimeout(1200);
  await dump('点击+1800ms');
  await page.evaluate(() => equalizeFix());
  await page.waitForTimeout(200);
  await dump('手动重跑后');
  await browser.close();
})();
