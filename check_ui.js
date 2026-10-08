/* UI 适配自查：多宽度横向溢出检测（v0.11.17） */
const { chromium } = require('playwright-core');

(async () => {
  const browser = await chromium.launch({ executablePath: 'C:/Users/EDY/AppData/Local/ms-playwright/chromium-1232/chrome-win64/chrome.exe' });
  const base = 'file:///F:/workBuddy新数据库6.9/2026-09-21-17-02-58/yizhun-biz/index.html';
  const pages = [
    ['聚合页', ''],
    ['保卖页', '?biz=baomai'],
    ['拍机页', '?biz=paiji'],
    ['速收页', '?biz=sushou'],
  ];
  const widths = [320, 390, 768, 1024, 1440];
  let issues = 0;

  for (const [name, qs] of pages) {
    for (const w of widths) {
      const page = await browser.newPage({ viewport: { width: w, height: 850 } });
      await page.goto(base + qs, { waitUntil: 'networkidle' });
      // 触发懒加载 + reveal + 底部
      await page.evaluate(() => {
        document.querySelectorAll('img').forEach(i => i.loading = 'eager');
        document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
      });
      // 分段滚到底再回顶，确保所有动画区渲染
      for (let y = 0; y < 20000; y += 1200) {
        await page.evaluate(yy => window.scrollTo(0, yy), y);
        await page.waitForTimeout(60);
        if (await page.evaluate(() => window.scrollY + window.innerHeight >= document.body.scrollHeight - 5)) break;
      }
      await page.waitForTimeout(400);
      const r = await page.evaluate(() => {
        const vw = document.documentElement.clientWidth;
        const sw = document.documentElement.scrollWidth;
        const bad = [];
        if (sw > vw + 1) {
          document.querySelectorAll('body *').forEach(el => {
            const b = el.getBoundingClientRect();
            if (b.width > 0 && b.right > vw + 1 && b.left < vw) {
              const cs = getComputedStyle(el);
              if (cs.position === 'fixed' || cs.position === 'absolute') return; // 定位元素单独看
              bad.push(el.tagName + '.' + String(el.className).split(' ')[0] + ' right=' + Math.round(b.right));
            }
          });
        }
        return { vw, sw, bad: [...new Set(bad)].slice(0, 6) };
      });
      const ok = r.sw <= r.vw + 1 && r.bad.length === 0;
      if (!ok) {
        issues++;
        console.log(`✗ ${name} @${w}px  scrollWidth=${r.sw} vw=${r.vw}`);
        r.bad.forEach(b => console.log('    ' + b));
      } else {
        console.log(`✓ ${name} @${w}px`);
      }
      await page.close();
    }
  }
  await browser.close();
  console.log(issues === 0 ? 'ALL CLEAN' : issues + ' 处溢出');
})();