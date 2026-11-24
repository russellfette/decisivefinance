// Privacy audit, axe WCAG 2.2 AA scan, phone and print screenshots, print page count.
const fs = require('fs');
const { open, BASE } = require('./lib');
const AXE = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const OUT = process.argv[2] || '/tmp/claude-0/qa-out';
fs.mkdirSync(OUT, { recursive: true });
const PAGES = [
  ['/price-to-wire/', 'price-to-wire'],
  ['/where-the-revenue-went/', 'where-the-revenue-went'],
  ['/working-capital-target/', 'working-capital-target'],
];

(async () => {
  const report = [];
  for (const [path, slug] of PAGES) {
    const r = { slug };
    // --- privacy: type a sentinel, watch every request, storage, cookies, URL
    let { browser, page, net, ctx } = await open(path);
    const det = await page.$('.mt-advanced > summary'); if (det) await det.click();
    const before = net.length;
    const sentinel = '987654321';
    const inputs = await page.$$('input[type="text"]');
    for (const i of inputs) { if (await i.isVisible()) await i.fill(sentinel); }
    await page.click('[data-example]');
    await page.click('[data-show-walk]');
    await page.waitForTimeout(800);
    const after = net.slice(before);
    const leaks = net.filter((n) => n.url.includes(sentinel) || n.url.includes('12000000') || n.url.includes('12%2C000'));
    const storage = await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length, cookie: document.cookie, url: location.href }));
    const cookies = await ctx.cookies();
    const forms = await page.$$eval('form', (fs) => fs.map((f) => ({ action: f.getAttribute('action'), method: f.getAttribute('method') })));
    const html = await page.content();
    const srcHits = ['fetch(', 'XMLHttpRequest', 'sendBeacon', 'localStorage', 'sessionStorage', 'document.cookie', 'history.pushState', 'history.replaceState', 'gtag(', 'plausible'].filter((s) => html.includes(s));
    r.privacy = { requestsAfterTyping: after.map((n) => n.method + ' ' + n.url), sentinelInAnyRequest: leaks.length, localStorage: storage.local, sessionStorage: storage.session, cookies: cookies.length, url: storage.url, formAction: forms, apiTokensInPageSource: srcHits };
    // reload clears fields
    await page.reload({ waitUntil: 'networkidle' });
    r.privacy.afterReload = await page.$$eval('input[type="text"]', (is) => is.filter((i) => i.value !== '').map((i) => i.id + '=' + i.value));
    r.privacy.sentinelAfterReload = r.privacy.afterReload.some((x) => x.includes('987654321'));
    const det2 = await page.$('.mt-advanced > summary'); if (det2) await det2.click();

    // --- axe, empty state and with example, desktop
    const runAxe = async () => {
      await page.addScriptTag({ content: AXE });
      return page.evaluate(async () => {
        const res = await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] } });
        return { violations: res.violations.map((v) => ({ id: v.id, impact: v.impact, n: v.nodes.length, sample: v.nodes.slice(0, 3).map((x) => x.target.join(' ') + ' :: ' + (x.failureSummary || '').split('\n')[1]) })), passes: res.passes.length, incomplete: res.incomplete.map((v) => v.id) };
      });
    };
    r.axeEmpty = await runAxe();
    await page.click('[data-example]');
    r.axeExample = await runAxe();

    // --- print: one US Letter page with example figures
    await page.emulateMedia({ media: 'print' });
    await page.screenshot({ path: `${OUT}/${slug}-print.png`, fullPage: true });
    const pdf = await page.pdf({ format: 'Letter', printBackground: true, path: `${OUT}/${slug}-print.pdf`, preferCSSPageSize: true });
    r.printPages = (pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
    await browser.close();

    // --- phone at 390 x 844: collapsed summary, then expanded
    ({ browser, page } = await open(path, { ctx: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true } }));
    const det3 = await page.$('.mt-advanced > summary'); if (det3) await det3.click();
    await page.click('[data-example]');
    await page.waitForTimeout(150);
    r.phone = await page.evaluate(() => ({ scrollW: document.documentElement.scrollWidth, clientW: document.documentElement.clientWidth, summary: (document.querySelector('[data-summary]') || {}).textContent, summaryVisible: getComputedStyle(document.querySelector('[data-summary]')).display !== 'none' && !document.querySelector('[data-summary]').hidden }));
    await page.screenshot({ path: `${OUT}/${slug}-phone-collapsed.png` });
    await page.tap('[data-summary]');
    await page.waitForTimeout(200);
    r.phone.expanded = await page.$eval('[data-tool]', (t) => t.classList.contains('is-expanded'));
    await page.screenshot({ path: `${OUT}/${slug}-phone-expanded.png` });
    await page.addScriptTag({ content: AXE });
    r.axePhone = await page.evaluate(async () => { const res = await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] } }); return res.violations.map((v) => v.id + ' x' + v.nodes.length + ' ' + v.nodes.map((n) => n.html.slice(0, 120) + ' || ' + n.failureSummary).join(' ## ')); });
    await browser.close();
    report.push(r);
  }
  fs.writeFileSync(`${OUT}/report.json`, JSON.stringify(report, null, 1));
  console.log(JSON.stringify(report, null, 1));
})();
