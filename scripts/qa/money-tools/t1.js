const { open, rows, check } = require('./lib');

const v = (rs, k) => { const r = rs.find((x) => x.key === k); return r ? Number(r.value) : undefined; };
const has = (rs, k) => rs.some((x) => x.key === k);
const shown = (rs, k) => (rs.find((x) => x.key === k) || {}).shown;

// Brief test cases: every line set to "Yours", so the walk uses only typed numbers.
async function yours(page, m) {
  await page.click('[data-clear]');
  for (const n of ['escrow', 'escrowmo', 'wc', 'fund']) await page.click(`label[for=${n}-yours]`);
  await page.click(m.earn ? 'label[for=earn-yours]' : 'label[for=earn-off]');
  if (m.earn) await page.click('label[for=earnmo-yours]');
  const map = { 'p-price': m.P, 'p-debt': m.D, 'p-cash': m.C, 'p-wct': m.Wt, 'p-wcd': m.Wc, 'p-fee': m.fee, 'p-legal': m.legal, 'p-other': m.other, 'p-escrow': m.E, 'p-escrow-mo': m.Em, 'p-earn': m.earn, 'p-earn-mo': m.Xm, 'p-rate': m.r };
  for (const [id, val] of Object.entries(map)) if (val != null) await page.fill('#' + id, String(val));
  await page.locator('body').click({ position: { x: 2, y: 2 } }).catch(() => {});
}
const EX = { P: 12000000, D: 2400000, C: 300000, Wt: 1800000, Wc: 1650000, fee: 450000, legal: 180000, other: 45000, E: 1200000, Em: 12, earn: 1500000, Xm: 24, r: 25 };

(async () => {
  const { browser, page, errors } = await open('/price-to-wire/');
  const R = [];
  let rs, lead, interp, tnote, warn;
  const read = async () => {
    rs = await rows(page);
    lead = (await page.textContent('[data-lead]')).trim();
    interp = (await page.textContent('[data-interp]')).trim();
    tnote = await page.$eval('[data-tnote]', (n) => (n.hidden ? '' : n.textContent.trim()));
    warn = await page.$eval('[data-missing]', (n) => (n.hidden ? '' : n.textContent.trim()));
  };

  // v2 defaults
  await read();
  const sank = await page.$$eval('[data-sankey] path', (p) => p.length);
  const banner = await page.$eval('[data-example-banner]', (n) => !n.hidden);
  check(R, 'V1-1', 'Page opens with a $12,000,000 example and published defaults (escrow 10%, working capital -0.27%, expense fund $75,000)',
    banner && v(rs, 'escrow') === -1200000 && v(rs, 'wc') === -32400 && v(rs, 'fund') === -75000 && v(rs, 'k') === 10692600 && v(rs, 'total') === 11892600 && shown(rs, 'debt') === 'Not included' && shown(rs, 'fees') === 'Not included' && /Not included yet/.test(warn) && sank >= 4,
    `escrow ${v(rs, 'escrow')}; working capital ${v(rs, 'wc')}; fund ${v(rs, 'fund')}; K ${v(rs, 'k')}; total ${v(rs, 'total')}; debt "${shown(rs, 'debt')}"; fees "${shown(rs, 'fees')}"; note "${warn}"; Sankey bands ${sank}`);

  await page.click('label[for=ins-yes]'); await read();
  check(R, 'V1-2', 'Deal insurance Yes: escrow typical 2.8%', v(rs, 'escrow') === -336000, `escrow ${v(rs, 'escrow')}`);
  await page.click('label[for=ins-no]'); await read();
  check(R, 'V1-3', 'Deal insurance No: escrow typical 11.1%', v(rs, 'escrow') === -1332000, `escrow ${v(rs, 'escrow')}`);
  await page.click('label[for=escrow-high]'); await read();
  check(R, 'V1-4', 'Escrow High: 15%', v(rs, 'escrow') === -1800000, `escrow ${v(rs, 'escrow')}`);
  await page.click('label[for=earn-typ]'); await read();
  const earnLabel = (rs.find((x) => x.key === 'earn-later') || {}).label || '';
  check(R, 'V1-5', 'Earnout Typical: 57% of price over 21 months', v(rs, 'earn-later') === 6840000 && /over 21 months/.test(earnLabel), `earnout ${v(rs, 'earn-later')}; "${earnLabel}"`);
  await page.click('label[for=wc-low]'); await read();
  check(R, 'V1-6', 'Working capital Low: -1.0%', v(rs, 'wc') === -120000, `working capital ${v(rs, 'wc')}`);
  await page.fill('#p-price', '30000000'); await read();
  check(R, 'V1-7', 'Price $30,000,000: expense fund $100,000', v(rs, 'fund') === -100000, `fund ${v(rs, 'fund')}`);
  await page.fill('#p-price', '60000000'); await read();
  check(R, 'V1-8', 'Price $60,000,000: no published expense fund', v(rs, 'fund') === 0, `fund ${v(rs, 'fund')}`);
  await page.fill('#p-price', '12000000');
  await page.click('.mt-moves summary');
  await page.fill('#p-rev', '7300000');
  await page.$eval('#p-days', (el) => { el.value = '-5'; el.dispatchEvent(new Event('input', { bubbles: true })); });
  await read();
  const eff = await page.textContent('[data-days-effect]');
  check(R, 'V1-9', 'Slider: revenue $7,300,000, customers pay 5 days faster: line -$100,000', v(rs, 'timing') === -100000 && /−\$100,000; the cash you keep moves \+\$100,000/.test(eff), `timing ${v(rs, 'timing')}; "${eff}"`);
  await page.fill('#p-debt', '2400000'); await page.fill('#p-fee', '450000'); await read();
  check(R, 'V1-10', 'Entering debt and a fee clears the not-included note', warn === '' && v(rs, 'debt') === -2400000, `note "${warn}"; debt ${v(rs, 'debt')}`);

  // Brief section 4.7 test cases, all lines on "Yours"
  await yours(page, EX); await read();
  check(R, 'T1-1', 'Worked example',
    v(rs, 'k') === 7875000 && v(rs, 's0') === -1968750 && v(rs, 'n') === 5906250 && v(rs, 'total') === 7931250 && interp.includes('49.2%') && v(rs, 'escrow-later') === 900000 && v(rs, 'earn-later') === 1125000 && v(rs, 'wc') === -150000,
    `K ${v(rs, 'k')}; S0 ${-v(rs, 's0')}; N ${v(rs, 'n')}; escrow later ${v(rs, 'escrow-later')}; earnout later ${v(rs, 'earn-later')}; total ${v(rs, 'total')}; ${interp}`);
  await yours(page, { P: 12000000, fee: 450000, legal: 180000, other: 45000, E: 1200000, Em: 12, r: 25 }); await read();
  check(R, 'T1-2', 'Example with D 0, C 0, no WC, X 0',
    v(rs, 'k') === 10125000 && v(rs, 's0') === -2531250 && v(rs, 'n') === 7593750 && v(rs, 'total') === 8493750 && !has(rs, 'earn-later') && tnote === 'No earnout entered.',
    `K ${v(rs, 'k')}; S0 ${-v(rs, 's0')}; N ${v(rs, 'n')}; total ${v(rs, 'total')}; note "${tnote}"`);
  await yours(page, { P: 12000000, D: 2400000, Wt: 1800000, Wc: 1900000 }); await read();
  const labels = rs.map((x) => x.label);
  check(R, 'T1-3', 'P 12,000,000; D 2,400,000; Wt 1,800,000; Wc 1,900,000; rest blank',
    v(rs, 'wc') === 100000 && v(rs, 'k') === 9700000 && v(rs, 'total') === 9700000 && lead.startsWith('Cash at close, before tax') && !has(rs, 's0') && labels.includes('Total if every contingency pays, before tax'),
    `A ${v(rs, 'wc')}; K ${v(rs, 'k')}; total ${v(rs, 'total')}; lead "${lead}"`);
  await yours(page, { P: 8000000, D: 1000000, fee: 300000, E: 800000 }); await read();
  check(R, 'T1-4', 'P 8,000,000; D 1,000,000; T 300,000; E 800,000; r blank', v(rs, 'k') === 5900000 && v(rs, 'total') === 6700000 && tnote === 'No earnout entered.', `K ${v(rs, 'k')}; total ${v(rs, 'total')}; note "${tnote}"`);
  await yours(page, { P: 3000000, D: 3500000, fee: 200000, E: 300000, earn: 500000, r: 25 }); await read();
  check(R, 'T1-5', 'P 3,000,000; D 3,500,000; T 200,000; E 300,000; X 500,000; r 25%',
    v(rs, 'k') === -1000000 && v(rs, 's0') === 0 && lead === 'At this price you’d bring $1,000,000 to the closing table.' && v(rs, 'escrow-later') === 225000 && v(rs, 'earn-later') === 375000 && v(rs, 'total') === -400000,
    `K ${v(rs, 'k')}; lead "${lead}"; escrow net ${v(rs, 'escrow-later')}; earnout net ${v(rs, 'earn-later')}; total ${v(rs, 'total')}`);
  await yours(page, { P: 12000000, Wt: 1800000 }); await read();
  const wcnote = await page.$eval('#p-wcd-note', (n) => (n.hidden ? '' : n.textContent.trim()));
  check(R, 'T1-6', 'Wt only', v(rs, 'wc') === 0 && /Enter both/.test(wcnote), `A ${v(rs, 'wc')}; note "${wcnote}"`);
  await yours(page, { P: 12000000, r: 75 }); await read();
  const rnote = await page.$eval('#p-rate-note', (n) => (n.hidden ? '' : n.textContent.trim()));
  check(R, 'T1-7', 'r = 75', v(rs, 's0') === -7200000 && rnote === 'Use 0 to 60.', `set-aside ${-v(rs, 's0')}; note "${rnote}"`);
  await yours(page, { P: '$12,000,000' }); await read();
  check(R, 'T1-8', 'P "$12,000,000" with symbols', v(rs, 'price') === 12000000, `parsed ${v(rs, 'price')}`);

  await page.click('[data-clear]');
  const emptyMsg = await page.$eval('[data-empty]', (n) => (n.hidden ? '' : n.textContent.trim()));
  check(R, 'E1', 'Price blank', emptyMsg === 'Type a price to see the walk.', `"${emptyMsg}"`);

  console.log(JSON.stringify({ tool: 'price-to-wire', results: R, errors }, null, 1));
  await browser.close();
})();
