const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://localhost:4321';

async function open(path, opts = {}) {
  const browser = await chromium.launch();
  const ctx = await browser.newContext(opts.ctx || { viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  const net = [];
  page.on('request', (r) => net.push({ url: r.url(), method: r.method(), type: r.resourceType() }));
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'log') errors.push('console.' + m.type() + ': ' + m.text()); });
  await page.goto(BASE + path, { waitUntil: 'networkidle' });
  return { browser, ctx, page, net, errors };
}

async function fill(page, map) {
  await page.click('[data-clear]');
  for (const [id, v] of Object.entries(map)) {
    await page.fill('#' + id, String(v));
  }
  await page.locator('body').click({ position: { x: 2, y: 2 } }).catch(() => {});
}

async function rows(page, sel = '[data-walk] tr') {
  return page.$$eval(sel, (trs) => trs.map((tr) => {
    const th = tr.querySelector('th'); const td = tr.querySelector('td');
    const btn = th && th.querySelector('button');
    return { key: tr.getAttribute('data-row'), label: (btn ? btn.textContent : th ? th.textContent : '').trim(), shown: td ? td.textContent.trim() : '', value: td ? td.getAttribute('data-value') : null };
  }));
}

function check(results, id, desc, cond, got) {
  results.push({ id, desc, pass: !!cond, got });
}

module.exports = { open, fill, rows, check, BASE };
