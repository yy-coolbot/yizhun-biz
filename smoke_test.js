const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = 'F:/workBuddy新数据库6.9/2026-09-21-17-02-58/yizhun-biz/index.html';
const html = fs.readFileSync(path, 'utf8');
const css = (html.match(/<style>([\s\S]*?)<\/style>/) || ['', ''])[1];

function load(url) {
  const dom = new JSDOM(html, { url, runScripts: 'dangerously', pretendToBeVisual: true });
  dom.window.IntersectionObserver = class { observe(){} unobserve(){} disconnect(){} };
  return dom.window.document;
}

let pass = 0, fail = 0;
function t(name, cond) {
  if (cond) { pass++; console.log('  PASS ' + name); }
  else { fail++; console.log('  FAIL ' + name); }
}

console.log('== 形态1：无参数（聚合模式） ==');
{
  const d = load('https://yy-coolbot.github.io/yizhun-biz/');
  t('聚合页可见', !d.getElementById('view-home').hidden);
  t('三个子视图隐藏', ['view-baomai','view-paiji','view-sushou'].every(id => d.getElementById(id).hidden));
  t('页脚分享按钮已移除(由拓客助手替代)', d.getElementById('foot-actions') === null);
  t('页脚品牌区已移除(仅留版权细条)', !d.querySelector('.foot-brand') && !d.querySelector('.foot-note') && !!d.getElementById('ver-tag'));
  t('四大业务=通栏横带×4', d.querySelectorAll('#biz-cards .biz-band').length === 4);
  t('横带LOGO齐=横板反白版(bm/pj/ss/yj)', ['logo-bm','logo-pj','logo-ss','logo-yj'].every(n => !!d.querySelector(`#biz-cards .biz-pill img[src="assets/${n}.png"]`)));
  t('定位胶囊×4=钦定文案', [...d.querySelectorAll('#biz-cards .biz-pill')].map(e => e.textContent.trim()).join(',') === '本地B端回收服务,B端采货方式和渠道,C端回收服务,验机服务');
  t('四大业务大字=钦定标语', [...d.querySelectorAll('#biz-cards .bb-title')].map(e => e.textContent.replace(/\s/g,'')).join('|') === '壹准保卖本地B端最优出货渠道。|壹准拍机B端智能竞拍采货平台。|壹准bot速收C端线上回收服务基础设施。|壹准验机承接二手电商的验机与认证服务。');
  t('小字=删首句后版本', d.querySelectorAll('#biz-cards .bb-desc')[0].textContent.trim().startsWith('B端商家批量下单') && d.querySelectorAll('#biz-cards .bb-desc')[1].textContent.includes('二手机货源为王') && !d.querySelectorAll('#biz-cards .bb-desc')[1].textContent.includes('渠道。二手机') && d.querySelectorAll('#biz-cards .bb-desc')[2].textContent.includes('同意回收秒到账') && !d.querySelectorAll('#biz-cards .bb-desc')[2].textContent.includes('重塑电商回收'));
  t('验机小字=用户钦定文案', d.querySelectorAll('#biz-cards .bb-desc')[3].textContent.trim().startsWith('壹准验机是一个颠覆性创新的验机服务品牌') && d.querySelectorAll('#biz-cards .bb-desc')[3].textContent.includes('结果完全一致'));
  t('入口按钮=仅保卖/拍机有、速收/验机无', d.querySelectorAll('#biz-cards .bb-info .go').length === 2);
  t('入口按钮=绿色凸显样式(var(--green))', /\.bb-info \.go\{[^}]*var\(--green\)/.test(css));
  t('流程步=图标容器+✅+步数5/4/6', d.querySelectorAll('#biz-cards .fs-ic .fs-g').length === 15 && d.querySelectorAll('#biz-cards .fs-check').length === 15 && [5,4,6].every((n,i) => d.querySelectorAll('#biz-cards .biz-band')[i].querySelectorAll('.hfstep').length === n));
  t('常驻角标×3=官方验报告×2+7×24h×1', d.querySelectorAll('#biz-cards .fs-badge').length === 3 && [...d.querySelectorAll('#biz-cards .fs-badge')].filter(e => e.textContent.includes('壹准官方验')).length === 2 && [...d.querySelectorAll('#biz-cards .fs-badge')].some(e => e.textContent.includes('7×24h不间断')));
  t('中途标签=最快半小时×2(保卖/速收1→2)', [...d.querySelectorAll('#biz-cards .fs-mid')].length === 2 && [...d.querySelectorAll('#biz-cards .fs-mid')].every(e => e.textContent === '最快半小时'));
  t('转弯两行=保卖/速收分两行(拐弯箭头×2=流动虚线.tv)', d.querySelectorAll('#biz-cards .fs-turn').length === 2 && d.querySelectorAll('#biz-cards .fs-turn .tv').length === 2 && d.querySelectorAll('#biz-cards .fs-row').length === 5);
  t('流程步时序=未亮无✅(fs-check默认opacity 0)+暗灰描边', !!d.querySelector('#biz-cards .fs-check') && /\.fs-check\{[^}]*opacity:0/.test(html) && html.includes('stroke:#67718f'));
  t('验机横带=机器居中(左3手机队列+中机器+右3报告打✓)', d.querySelectorAll('#biz-cards .yj-ph').length === 3 && !!d.querySelector('#biz-cards .yj-machine img[src="assets/machine-big.png"]') && d.querySelectorAll('#biz-cards .yj-rep img[src="assets/pj-report.png"]').length === 3 && d.querySelectorAll('#biz-cards .yj-rep .stk').length === 3);
  t('跑马灯模块已删除', d.getElementById('ticker-track') === null && !d.querySelector('.ticker'));
  t('模块标题=四大业务板块且小字已删', d.querySelector('#biz-cards h2').textContent.includes('四大业务板块') && !d.querySelector('#biz-cards .sec-desc'));
  t('hero三胶囊=新范式三件套', d.querySelectorAll('#view-home .hchip').length === 3 && d.getElementById('view-home').textContent.includes('分布式验机机器人对齐非标品') && d.getElementById('view-home').textContent.includes('AI ERP提升经营效率') && d.getElementById('view-home').textContent.includes('AI交易平台降低交易成本'));
  t('hero按钮=唯一绿胶囊合作咨询+顶部胶囊已删', d.querySelector('#view-home .btn-green').textContent.includes('合作咨询') && d.querySelectorAll('#view-home .hero-btns .btn').length === 1 && !d.querySelector('#view-home .hero-badge'));
  t('导航CTA指向聚合CTA', d.getElementById('nav-cta').getAttribute('href') === '#join');
  t('首页Hero=钦定版「用壹准AI生态平台，把二手生意重做一遍」', d.querySelector('#view-home h1').textContent.replace(/\s/g,'').includes('用壹准AI生态平台') && d.querySelector('#view-home h1').textContent.replace(/\s/g,'').includes('把二手生意重做一遍'));
  t('页面标题同步新Hero', d.title.includes('用壹准AI生态平台'));
  t('困局区：3张卡+「对不齐」标题+钦定小字', !!d.getElementById('why') && d.querySelectorAll('#why .why-card').length === 3 && d.querySelector('#why h2').textContent.includes('对不齐') && d.querySelector('#why .sec-desc').textContent.includes('最大隐性成本'));
  t('困局三卡=钦定文案v0.11.10', [...d.querySelectorAll('#why .why-card h3')].map(e => e.textContent).join('|') === '反复验机，层层“买单”|报告黑箱，信任昂贵|对齐信息，无法传递' && d.querySelector('#why .why-card p').textContent.includes('C2B回收、B2B流通到B2C零售') && d.querySelectorAll('#why .why-card p')[1].textContent.includes('降价成交'));
  t('旅程动画保持已删', !d.querySelector('#why .jn-demo'));
  t('总结条恢复+字段回第一行+金句条已删', !!d.querySelector('#why .why-sum') && !d.querySelector('#why .why-sum br') && d.querySelector('#why .why-sum').textContent.includes('检测标准化') && d.querySelector('#why .why-sum').textContent.includes('破局重构') && !d.querySelector('.mquote') && !d.querySelector('#why .jn-demo'));
  t('解法区=钦定v0.11.10：三通栏左内容右图+3落点+新配图', d.querySelectorAll('#answer .an-row').length === 3 && !!d.querySelector('#answer img[src="assets/an-robot.png"]') && !!d.querySelector('#answer img[src="assets/an-agent.png"]') && !!d.querySelector('#answer img[src="assets/an-market.png"]') && d.querySelectorAll('#answer .an-go').length === 3 && !d.querySelector('#answer .an-fig figcaption'));
  t('解法区文案=钦定（大标题两行+三卡大字）', d.querySelector('#answer .h2-pre').textContent === '壹准AI生态平台的解法' && d.querySelector('#answer h2').textContent.includes('机器人对齐，AI做买卖。') && [...d.querySelectorAll('#answer .an-row h3')].map(e => e.textContent).join('|') === '验机机器人，对齐非标品|AI智能体，提升效率。|AI 交易平台，交易摩擦趋零。' && d.querySelector('#answer .an-row p').textContent.includes('“壹准官方验”报告即描述'));
  t('底座区已删+回收商改二手商(首页)', !d.querySelector('#tech') && ![...d.querySelectorAll('#biz-cards .bb-desc, #biz-cards .fs-lb')].some(e => e.textContent.includes('回收商')));
  t('04关于绿怡科技=钦定文案+产品矩阵配图', !!d.querySelector('#about') && d.querySelector('#about .sec-idx .no').textContent === '04' && d.querySelector('#about h2').textContent.includes('关于绿怡科技') && d.querySelector('#about .an-info').textContent.includes('苹果大中华区、中国电信、中国移动') && d.querySelector('#about .an-info').textContent.includes('万亿赛道产业新生态') && !!d.querySelector('#about img[src="assets/an-company.png"]'));
  t('v0.11.19钦定文案：简称+绿怡致力于+壹准二手机中心×2+全球二手商即时竞价', d.querySelector('#about .an-info').textContent.includes('广州绿怡科技公司（简称“绿怡科技”）') && d.querySelector('#about .an-info').textContent.includes('绿怡致力于搭建') && !d.querySelector('#about').textContent.includes('正着力') && [...d.querySelectorAll('#biz-cards .bb-desc')].filter(e => e.textContent.includes('壹准二手机中心')).length === 2 && !d.querySelector('#biz-cards').textContent.includes('壹准城市中心'));
  t('v0.11.19：痛点卡解法块等高对齐JS已挂载', html.includes('equalizeFix') && html.includes('minHeight'));
  t('双真码到位：子页真图+占位行已删+首页双码并排', !!d.querySelector('#bm-join img[src="assets/qr-bm.jpg"]') && !!d.querySelector('#pj-join img[src="assets/qr-pj.jpg"]') && d.querySelector('#bm-join .sub').textContent.includes('点击“点击注册”') && d.querySelector('#pj-join .sub').textContent.includes('点击“点击注册”') && !d.querySelector('#bm-join .contact-rows') && !d.querySelector('#pj-join .contact-rows') && d.querySelectorAll('#join .qr-item').length === 2 && !!d.querySelector('#join img[src="assets/qr-bm.jpg"]') && !!d.querySelector('#join img[src="assets/qr-pj.jpg"]') && d.querySelector('#join .qr-item span').textContent.includes('扫码注册壹准保卖，开始卖货。') && d.querySelectorAll('#join .qr-item span')[1].textContent.includes('扫码注册壹准拍机，开始采货。'));
  t('v0.11.14：首页CTA去标题+返回首页按钮+返回顶部按钮', !d.querySelector('#join h3') && !d.querySelector('#join .sub') && d.getElementById('nav-home').textContent.includes('返回首页') && d.getElementById('nav-home').hidden === true && !!d.getElementById('btop') && !!d.querySelector('.btop svg'));
  t('解法区落点=回看四大业务板块', d.querySelector('#answer .an-go[href="#biz-cards"]').textContent.includes('回看四大业务板块'));
}

console.log('== 形态2：?biz=baomai（单业务隔离） ==');
{
  const d = load('https://yy-coolbot.github.io/yizhun-biz/?biz=baomai');
  t('保卖页可见', !d.getElementById('view-baomai').hidden);
  t('聚合页已物理删除', d.getElementById('view-home') === null);
  t('拍机页已物理删除', d.getElementById('view-paiji') === null);
  t('速收页已物理删除', d.getElementById('view-sushou') === null);
  t('分享按钮已移除', d.getElementById('foot-actions') === null);
  t('无其他业务入口文案', !d.body.innerHTML.includes('了解壹准拍机') && !d.body.innerHTML.includes('了解流量主合作'));
  t('标题含业务名', d.title.includes('壹准保卖'));
  t('导航CTA指向保卖入驻区(锚点bug修复)', d.getElementById('nav-cta').getAttribute('href') === '#bm-join');
  t('六段结构：痛点区', !!d.getElementById('bm-pain'));
  t('六段结构：优势区', !!d.getElementById('bm-adv'));
  t('六段结构：画像区', !!d.getElementById('bm-who'));
  t('六段结构：流程区', !!d.getElementById('bm-flow'));
  t('六段结构：规则区', !!d.getElementById('bm-rules'));
  t('编辑式Hero：标题回归「机器人验机卖全球」', d.querySelector('#view-baomai h1').textContent.includes('机器人验机卖全球'));
  t('徽标定位改为「本地B端最优出货渠道」', d.querySelector('#view-baomai .hero-badge').textContent.includes('本地B端最优出货渠道'));
  t('首屏LOGO在徽标胶囊内且无（绿怡科技旗下）', !!d.querySelector('#view-baomai .hero-badge .badge-logo') && !d.querySelector('#view-baomai .hero-badge').textContent.includes('（绿怡科技旗下）'));
  t('首屏副标已删除', d.querySelector('#view-baomai .hero-sub') === null);
  t('首屏时效底注已删除', d.querySelector('#view-baomai .hero-note') === null);
  t('动态地球底图（SVG）存在', !!d.querySelector('#view-baomai .hero-globe svg'));
  t('地球含交易光弧×5+脉冲节点×5', d.querySelectorAll('#view-baomai .hero-globe .arc').length === 5 && d.querySelectorAll('#view-baomai .hero-globe .halo').length === 5);
  t('首屏三点辅助（同城速运/透明验机/全球竞拍）', d.querySelectorAll('#view-baomai .hero-points li').length === 3);
  t('三点小字：最快半小时+当天回款', d.getElementById('view-baomai').textContent.includes('最快半小时送达') && d.getElementById('view-baomai').textContent.includes('当天验机、当天回款'));
  t('三点小字：壹准官方验报告', d.getElementById('view-baomai').textContent.includes('壹准官方验'));
  t('三点小字：国内国外多渠道即时竞价', d.getElementById('view-baomai').textContent.includes('国内国外多渠道即时竞价'));
  t('痛点区：4张话术气泡卡', d.querySelectorAll('#view-baomai .pain-grid .pain-card').length === 4);
  t('痛点区：每卡含话术气泡(头像+昵称)+概括点+解法', [...d.querySelectorAll('#view-baomai .pain-card')].every(c => c.querySelector('.q-ava') && c.querySelector('.q-name') && c.querySelector('.ptag') && c.querySelector('.fix b')));
  t('痛点区：四张标签=渠道少/到手刀/太麻烦/行情快', [...d.querySelectorAll('#view-baomai .ptag')].map(e => e.textContent).join(',') === '渠道少,到手刀,太麻烦,行情快');
  t('痛点区：气泡无斜体旧样式(italic 已移除)', ![...d.querySelectorAll('#view-baomai .q-msg p')].some(p => /font-style\s*:\s*italic/.test(p.getAttribute('style') || '')));
  t('痛点区：第4点小字为钦定版', d.querySelector('#view-baomai .pain-card:nth-child(4) .why').textContent.includes('货压在手一天，就亏一天'));
  t('痛点区：标题=用户钦定「无形挤压」版', d.querySelector('#bm-pain h2').textContent.includes('无形挤压'));
  t('痛点区：sec-desc 小字已删除', !d.querySelector('#bm-pain .sec-desc'));
  t('痛点区：解法统一「壹准保卖的解法」×4', [...d.querySelectorAll('#view-baomai .pain-card .fix b')].filter(b => b.textContent === '壹准保卖的解法').length === 4);
  t('痛点区：数字改 2000/1600', d.getElementById('bm-pain').textContent.includes('2000') && d.getElementById('bm-pain').textContent.includes('1600'));
  t('痛点区：「限时免收服务费」口径', d.getElementById('bm-pain').textContent.includes('限时免收'));
  t('痛点区：第二点补「买家」+删「按报告说话」尾巴', d.getElementById('bm-pain').textContent.includes('买家收之前什么价都好说') && !d.getElementById('bm-pain').textContent.includes('按报告说话'));
  t('痛点区：第四点小字=钦定版(亏一天+尽快出手)', d.getElementById('bm-pain').textContent.includes('货压在手一天，就亏一天') && d.getElementById('bm-pain').textContent.includes('只求尽快出手、减少损失') && !d.getElementById('bm-pain').textContent.includes('华强北商家囤着'));
  t('痛点区：四条全部聚焦出货(无收货侧旧文案)', !d.getElementById('bm-pain').textContent.includes('凭感觉收') && !d.getElementById('bm-pain').textContent.includes('垫资生意'));
  t('流程为6步(.flow)且逐步带小图标', d.getElementById('view-baomai').querySelectorAll('#bm-flow .fstep').length === 6 && d.querySelectorAll('#bm-flow .fstep .fic').length === 6);
  t('四大保障：装饰小图标已全部移除(.adv-ic=0)', d.querySelectorAll('#bm-adv .adv-ic').length === 0);
  t('四大保障：4个保障标签齐全', d.querySelectorAll('#bm-adv .adv-tag').length === 4);
  t('四大保障：标题=钦定版', d.querySelector('#bm-adv h2').textContent.includes('壹准保卖的四大保障'));
  t('四大保障：标签=01极速/02高价/03透明/04省心', [...d.querySelectorAll('#bm-adv .adv-tag')].map(e => e.textContent).join(',') === '01 极速,02 高价,03 透明,04 省心');
  t('四大保障：极速卡含下单→验机→回款演示动画(3步+2箭头)', d.querySelectorAll('#bm-adv .fd-step').length === 3 && d.querySelectorAll('#bm-adv .fd-arrow').length === 2);
  t('动画字段钦定：验机+上架 / 3分钟完成机器人质检，随即上架竞拍', d.querySelector('#bm-adv .fd-s2 b').textContent === '验机+上架' && d.querySelector('#bm-adv .fd-s2 .fd-sub').textContent === '3分钟完成机器人质检，随即上架竞拍');
  t('四大保障：02-04配图位于卡片底部(最后一个元素)', Array.from(d.querySelectorAll('#bm-adv .adv-grid .adv-card:not(.adv-speed)')).every(c => c.lastElementChild.classList.contains('adv-img')));
  t('动画类绑定：三步+双箭头时间线类齐全', !!d.querySelector('#bm-adv .fd-s1') && !!d.querySelector('#bm-adv .fd-s2') && !!d.querySelector('#bm-adv .fd-s3') && !!d.querySelector('#bm-adv .fa-1') && !!d.querySelector('#bm-adv .fa-2'));
  t('四大保障：三张配图均为透明PNG(globe/robot/ease)', d.querySelector('#bm-adv .adv-img img[src="assets/bm-globe.png"]') && d.querySelector('#bm-adv .adv-img img[src="assets/bm-robot.png"]') && d.querySelector('#bm-adv .adv-img img[src="assets/bm-ease.png"]'));
  t('四大保障：三张配图统一contain模式(无底图样式一致)', d.querySelectorAll('#bm-adv .adv-img.img-contain').length === 3);
  t('四大保障：02标题加「销售」+钦定文案(v0.11.19改全球二手商)', d.getElementById('bm-adv').textContent.includes('国内国外多渠道即时竞价销售') && d.getElementById('bm-adv').textContent.includes('全球二手商即时竞价') && !d.getElementById('bm-adv').textContent.includes('全球回收商的 AI 买手'));
  t('四大保障：03/04 标题=钦定版', d.getElementById('bm-adv').textContent.includes('AI机器人提供「壹准官方验」') && d.getElementById('bm-adv').textContent.includes('寄出后，你坐等回款即可'));
  t('规则含真实费率：交易服务费暂免', d.getElementById('bm-rules').textContent.includes('暂免'));
  t('规则含真实费率：质检费5元/台', d.getElementById('bm-rules').textContent.includes('5 元/台'));
  t('规则含真实时效：48小时报告/15天确认', d.getElementById('bm-rules').textContent.includes('48 小时') && d.getElementById('bm-rules').textContent.includes('15 天'));
  t('流程钦定v0.8.6：快捷下单/括号版速运小字', d.getElementById('bm-flow').textContent.includes('快捷下单') && d.getElementById('bm-flow').textContent.includes('可选快速寄出或自送（快速寄出最快半小时送达验机中心）'));
  t('规则区措辞软化：无「规矩/丑话」', !d.getElementById('bm-rules').textContent.includes('规矩') && !d.getElementById('bm-rules').textContent.includes('丑话'));
  t('免责钦定文案：以小程序最新公示版本为准', d.getElementById('bm-rules').textContent.includes('相关完整规则以壹准保卖小程序内最新公示版本为准。'));
  t('规则对照原文补齐：保证金/隐私清除/库龄60天/72小时申诉', d.getElementById('bm-rules').textContent.includes('业务保证金') && d.getElementById('bm-rules').textContent.includes('隐私清理') && d.getElementById('bm-rules').textContent.includes('60 天') && d.getElementById('bm-rules').textContent.includes('72 小时'));
  t('流程钦定文案：注册/钱包下单/同城速运/质检后即时竞价', d.getElementById('bm-flow').textContent.includes('微信搜索壹准保卖小程序，根据提示完成注册') && d.getElementById('bm-flow').textContent.includes('开通卖家钱包并下单') && d.getElementById('bm-flow').textContent.includes('可选快速寄出或自送') && d.getElementById('bm-flow').textContent.includes('质检后即时竞价'));
  t('费用占位已清除', !d.getElementById('view-baomai').textContent.includes('费率对外口径待确认'));
  t('客户画像=钦定文案（门店小店/稳定货源/更高更快更省心/到手刀扯皮）', d.getElementById('view-baomai').textContent.includes('二手门店/小店') && d.getElementById('view-baomai').textContent.includes('有一定的稳定货源的商家') && d.getElementById('view-baomai').textContent.includes('想卖得更高、更快、更省心的商家') && d.getElementById('view-baomai').textContent.includes('到手刀、扯皮'));
  t('入驻条件占位模块已移除', !d.getElementById('view-baomai').textContent.includes('具体入驻条件'));
  t('时效口径=用户钦定官方文案「当天下单、当天验机、当天回款」', d.getElementById('view-baomai').textContent.includes('当天下单、当天验机、当天回款'));
}

console.log('== 形态3：?biz=paiji（单业务隔离） ==');
{
  const d = load('https://yy-coolbot.github.io/yizhun-biz/?biz=paiji');
  t('拍机页可见', !d.getElementById('view-paiji').hidden);
  t('保卖页已物理删除', d.getElementById('view-baomai') === null);
  t('导航CTA指向拍机入驻区', d.getElementById('nav-cta').getAttribute('href') === '#pj-join');
  t('七段结构：痛点/优势/省心/画像/流程/规则', ['pj-pain','pj-adv','pj-ease','pj-who','pj-flow','pj-rules'].every(id => !!d.getElementById(id)));
  t('双重保障=2图文卡(旧01省心/04公平已删+标题钦定)', d.querySelectorAll('#pj-adv .adv-card').length === 2 && !d.querySelector('#pj-adv .adv-speed') && d.querySelector('#pj-adv h2').textContent.includes('双重保障'));
  t('拍机Hero：LOGO胶囊+货源汇流动画+三点辅助', !!d.querySelector('#view-paiji .hero-badge .badge-logo') && !!d.querySelector('#view-paiji .hero-globe') && d.querySelectorAll('#view-paiji .hero-points li').length === 3);
  t('拍机汇流动画：6条流线6个流动点+中心涟漪×2', d.querySelectorAll('#view-paiji .hero-globe .fdot').length === 6 && d.querySelectorAll('#view-paiji .hero-globe path[id^="pjf-"]').length === 6 && d.querySelectorAll('#view-paiji .hero-globe animate').length === 4);
  t('痛点区：4张聊天话术卡(商/本地手机店老板)', d.querySelectorAll('#pj-pain .pain-card').length === 4 && d.querySelectorAll('#pj-pain .q-ava').length === 4 && d.getElementById('pj-pain').textContent.includes('本地手机店老板'));
  t('流程：横向双链路 STEP1/2/5/6共用+人工/AI智采STEP3/4+手机端模式Tab', d.querySelectorAll('#pj-flow .fstep').length === 8 && d.querySelectorAll('#pj-flow .fic').length === 8 && d.querySelectorAll('#pj-flow .pf-mode').length === 2 && d.querySelectorAll('#pj-flow .pf-tab').length === 2 && d.querySelector('#pj-flow .pf-tab[data-mode="ai"]').classList.contains('active') && d.querySelector('#pj-flow .pf-mode[data-mode="ai"]').classList.contains('active') && d.getElementById('pj-flow').textContent.includes('开通买家钱包并充值，以及缴纳保证金') && d.getElementById('pj-flow').textContent.includes('竞得支付（手动）') && d.getElementById('pj-flow').textContent.includes('挑选手机') && d.getElementById('pj-flow').textContent.includes('配置策略') && d.getElementById('pj-flow').textContent.includes('AI报价采购师根据策略，自主竞拍采货'));
  t('双重保障动画：01货源汇流(src-flow 14光点)+02验机出报告(chk-flow时序+质检报告图)', d.querySelectorAll('#pj-adv .src-flow .sfd').length === 14 && d.querySelectorAll('#pj-adv .src-flow .sf-dim').length === 14 && !d.querySelector('#pj-adv .cf-ar') && !!d.querySelector('#pj-adv .chk-flow img[src="assets/pj-report.png"]') && !!d.querySelector('#pj-adv .chk-flow img[src="assets/pj-robot.png"]'));
  t('双重保障钦定文案：海量货源本地优先+标准验机所见即所得', d.getElementById('pj-adv').textContent.includes('海量货源，本地优先') && d.getElementById('pj-adv').textContent.includes('标准验机，所见即所得') && d.getElementById('pj-adv').textContent.includes('壹准官方验'));
  t('拍机Hero钦定文案：B端平台+三点辅助', d.getElementById('view-paiji').querySelector('.hero-badge').textContent.includes('B端智能竞拍采货平台') && d.getElementById('view-paiji').textContent.includes('海量源头货源') && d.getElementById('view-paiji').textContent.includes('AI机器人官方验') && d.getElementById('view-paiji').textContent.includes('AI智采'));
  t('规则含真实费率：38元/台/价高者得/48小时售后/保证金2000起/发货费8元', d.getElementById('pj-rules').textContent.includes('38 元/台') && d.getElementById('pj-rules').textContent.includes('价高者得') && d.getElementById('pj-rules').textContent.includes('48 小时') && d.getElementById('pj-rules').textContent.includes('2000 元起') && d.getElementById('pj-rules').textContent.includes('10000 元起') && d.getElementById('pj-rules').textContent.includes('8 元/台') && d.getElementById('pj-rules').textContent.includes('次日早 7 点'));
  t('省心板块：标题钦定+智能全宽卡三步动画', d.querySelector('#pj-ease h2').textContent.includes('让买家更省心，采货更简单') && !!d.querySelector('#pj-ease .adv-speed') && d.querySelectorAll('#pj-ease .flow-demo .fd-step').length === 3 && d.querySelectorAll('#pj-ease .flow-demo .fd-arrow').length === 2);
  t('省心板块：6个模块+各配简化UI示意图(SVG)+标题按逗号断两行', d.querySelectorAll('#pj-ease .grid-3 .adv-card').length === 6 && d.querySelectorAll('#pj-ease .grid-3 .adv-ui svg').length === 6 && !d.querySelector('#pj-ease img[src*="pj2d"]') && d.querySelectorAll('#pj-ease .grid-3 h3 br').length === 6);
  t('内容区无占位残留(CTA联系方式占位除外)', ['pj-pain','pj-adv','pj-who','pj-flow','pj-rules'].every(id => !d.getElementById(id).textContent.includes('占位')) && !d.getElementById('view-paiji').querySelector('.ph-tag'));
}

console.log('== 形态4：?biz=sushou（v0.11.18 已隐藏，回退聚合页） ==');
{
  const d = load('https://yy-coolbot.github.io/yizhun-biz/?biz=sushou');
  t('速收子页保持隐藏', d.getElementById('view-sushou').hidden === true);
  t('回退为聚合页', !d.getElementById('view-home').hidden);
  t('导航CTA指向聚合CTA', d.getElementById('nav-cta').getAttribute('href') === '#join');
  t('页面标题不含速收', !d.title.includes('速收'));
}

console.log('== 形态5：非法参数回退聚合 ==');
{
  const d = load('https://yy-coolbot.github.io/yizhun-biz/?biz=hack');
  t('回退为聚合页', !d.getElementById('view-home').hidden);
  t('导航CTA回退指向聚合CTA', d.getElementById('nav-cta').getAttribute('href') === '#join');
}

console.log('== 通用检查 ==');
{
  const d = load('https://yy-coolbot.github.io/yizhun-biz/');
  t('已去除网站式导航菜单', d.querySelector('.nav-links') === null);
  t('拓客助手=入口隐藏,顶部5连击唤出', (() => {
    const btn = d.querySelector('.scout-btn');
    if (!btn || btn.hidden !== true) return false;
    const W = d.defaultView;
    for (let i = 0; i < 5; i++){
      const ev = new W.MouseEvent('click', { bubbles: true, clientY: 10 });
      Object.defineProperty(ev, 'target', { value: d.body });
      d.dispatchEvent(ev);
    }
    return d.getElementById('scout-mask').classList.contains('open') && btn.hidden === false;
  })());
  t('v0.11.18：拓客助手速收入口已移除(仅聚合/保卖/拍机3行)', [...d.querySelectorAll('#scout-mask .copy-row')].length === 3 && !d.getElementById('scout-mask').innerHTML.includes("copyLink('sushou')"));
  t('无极限词「全网最高/业内第一/价最高」', !html.includes('全网最高') && !html.includes('业内第一') && !html.includes('价最高'));
  t('免责声明存在(钦定：以小程序最新公示版本为准)', html.includes('以壹准保卖小程序内最新公示版本为准'));
  t('OG 标签存在', html.includes('og:title'));
  t('无渐变文字滥用(仅允许的类)', !/background-clip:\s*text/.test(html));
}

console.log('== 资产完整性 ==');
{
  // 引用的本地 assets 必须真实存在（GitHub Pages 404 防线）
  const refs = [...html.matchAll(/src="(assets\/[^"]+)"/g)].map(m => m[1])
    .concat([...html.matchAll(/url\('(assets\/[^']+)'\)/g)].map(m => m[1]));
  const missing = refs.filter(f => !fs.existsSync('F:/workBuddy新数据库6.9/2026-09-21-17-02-58/yizhun-biz/' + f));
  t('引用配图共 ' + refs.length + ' 处（双logo+保卖三图+拍机robot/report+首页robot+横板LOGO×4+大机器图+报告卡×3+解法区配图×3+公司产品矩阵+双二维码×2处）', refs.length === 23);
  t('无缺失图片文件: ' + (missing.join(',') || '无'), missing.length === 0);
}

console.log('\n结果: ' + pass + ' 通过, ' + fail + ' 失败');
process.exit(fail ? 1 : 0);
