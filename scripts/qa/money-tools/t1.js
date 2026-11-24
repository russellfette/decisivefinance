const { open, fill, rows, check } = require('./lib');

const EX = { 'p-price': '12000000', 'p-debt': '2400000', 'p-cash': '300000', 'p-wct': '1800000', 'p-wcd': '1650000', 'p-fee': '450000', 'p-legal': '180000', 'p-other': '45000', 'p-escrow': '1200000', 'p-escrow-mo': '12', 'p-earn': '1500000', 'p-earn-mo': '24', 'p-rate': '25' };
const v = (rs, k) => { const r = rs.find((x) => x.key === k); return r ? Number(r.value) : undefined; };
const has = (rs, k) => rs.some((x) => x.key === k);

(async () => {
  const { browser, page, errors } = await open('/price-to-wire/');
  const R = [];
  let rs, lead, interp, tnote;
  const read = async () => {
    rs = await rows(page);
    lead = (await page.textContent('[data-lead]')).trim();
    interp = (await page.textContent('[data-interp]')).trim();
    tnote = await page.$eval('[data-tnote]', (n) => (n.hidden ? '' : n.textContent.trim()));
  };

  // T1-1 worked example via the "Show an example" link
  await page.click('[data-example]');
  await read();
  const banner = await page.$eval('[data-example-banner]', (n) => !n.hidden && n.textContent.trim());
  check(R, 'T1-1', 'Worked example (Show an example link)',
    v(rs, 'k') === 7875000 && v(rs, 's0') === -1968750 && v(rs, 'n') === 5906250 && v(rs, 'total') === 7931250 && interp.includes('49.2%') && v(rs, 'escrow-later') === 900000 && v(rs, 'earn-later') === 1125000 && v(rs, 'wc') === -150000,
    `K ${v(rs, 'k')}; S0 ${-v(rs, 's0')}; N ${v(rs, 'n')}; escrow later ${v(rs, 'escrow-later')}; earnout later ${v(rs, 'earn-later')}; total ${v(rs, 'total')}; lead "${lead}"; interp "${interp}"; banner "${banner}"`);

  // T1-2: example with D 0, C 0, no WC, X 0
  const t2 = { ...EX }; delete t2['p-debt']; delete t2['p-cash']; delete t2['p-wct']; delete t2['p-wcd']; delete t2['p-earn']; delete t2['p-earn-mo'];
  await fill(page, t2); await read();
  check(R, 'T1-2', 'Example with D 0, C 0, no WC, X 0',
    v(rs, 'k') === 10125000 && v(rs, 's0') === -2531250 && v(rs, 'n') === 7593750 && v(rs, 'total') === 8493750 && !has(rs, 'earn-later') && tnote === 'No earnout entered.',
    `K ${v(rs, 'k')}; S0 ${-v(rs, 's0')}; N ${v(rs, 'n')}; total ${v(rs, 'total')}; earnout row ${has(rs, 'earn-later') ? 'shown' : 'hidden'}; note "${tnote}"`);

  // T1-3
  await fill(page, { 'p-price': '12000000', 'p-debt': '2400000', 'p-wct': '1800000', 'p-wcd': '1900000' }); await read();
  const labels = rs.map((x) => x.label);
  check(R, 'T1-3', 'P 12,000,000; D 2,400,000; Wt 1,800,000; Wc 1,900,000; rest blank',
    v(rs, 'wc') === 100000 && v(rs, 'k') === 9700000 && v(rs, 'total') === 9700000 && lead.startsWith('Cash at close, before tax') && !has(rs, 's0') && labels.includes('Total if every contingency pays, before tax'),
    `A ${v(rs, 'wc')}; K ${v(rs, 'k')}; total ${v(rs, 'total')}; lead "${lead}"; set-aside rows ${has(rs, 's0') ? 'shown' : 'hidden'}; total label "${labels[labels.length - 1]}"`);

  // T1-4
  await fill(page, { 'p-price': '8000000', 'p-debt': '1000000', 'p-fee': '300000', 'p-escrow': '800000' }); await read();
  check(R, 'T1-4', 'P 8,000,000; D 1,000,000; T 300,000; E 800,000; r blank',
    v(rs, 'k') === 5900000 && v(rs, 'total') === 6700000 && tnote === 'No earnout entered.',
    `K ${v(rs, 'k')}; total ${v(rs, 'total')}; note "${tnote}"`);

  // T1-5
  await fill(page, { 'p-price': '3000000', 'p-debt': '3500000', 'p-fee': '200000', 'p-escrow': '300000', 'p-earn': '500000', 'p-rate': '25' }); await read();
  check(R, 'T1-5', 'P 3,000,000; D 3,500,000; T 200,000; E 300,000; X 500,000; r 25%',
    v(rs, 'k') === -1000000 && v(rs, 's0') === 0 && lead === 'At this price you’d bring $1,000,000 to the closing table.' && v(rs, 'escrow-later') === 225000 && v(rs, 'earn-later') === 375000 && v(rs, 'total') === -400000 && interp === 'Debt, costs and the holdback are larger than the price.',
    `K ${v(rs, 'k')}; S0 ${v(rs, 's0')}; lead "${lead}"; interp "${interp}"; escrow net ${v(rs, 'escrow-later')}; earnout net ${v(rs, 'earn-later')}; total ${v(rs, 'total')}`);

  // T1-6
  await fill(page, { 'p-price': '12000000', 'p-wct': '1800000' }); await read();
  const wcnote = await page.$eval('#p-wcd-note', (n) => (n.hidden ? '' : n.textContent.trim()));
  check(R, 'T1-6', 'Wt only', v(rs, 'wc') === 0 && wcnote === 'Enter both the target and what you’d deliver to see the adjustment.', `A ${v(rs, 'wc')}; note "${wcnote}"`);

  // T1-7
  await fill(page, { 'p-price': '12000000', 'p-rate': '75' }); await read();
  const rnote = await page.$eval('#p-rate-note', (n) => (n.hidden ? '' : n.textContent.trim()));
  check(R, 'T1-7', 'r = 75', v(rs, 's0') === -7200000 && rnote === 'Use 0 to 60.', `set-aside ${-v(rs, 's0')} (60% of 12,000,000); note "${rnote}"`);

  // T1-8
  await fill(page, { 'p-price': '$12,000,000' }); await read();
  const shownPrice = await page.inputValue('#p-price');
  check(R, 'T1-8', 'P "$12,000,000" with symbols', v(rs, 'price') === 12000000 && v(rs, 'k') === 12000000, `parsed ${v(rs, 'price')}; field reads "${shownPrice}"`);

  // Edge: price blank
  await fill(page, {});
  const emptyMsg = await page.$eval('[data-empty]', (n) => (n.hidden ? '' : n.textContent.trim()));
  check(R, 'E1', 'Price blank', emptyMsg === 'Type a price to see the walk.', `"${emptyMsg}"`);
  // Edge: escrow zero hides escrow rows
  await fill(page, { 'p-price': '5000000' }); await read();
  check(R, 'E2', 'Escrow zero hides escrow rows; zero debt shows $0', !has(rs, 'escrow') && !has(rs, 'escrow-later') && rs.find((x) => x.key === 'debt').shown === '$0', JSON.stringify(rs.map((x) => x.label + ' ' + x.shown)));

  console.log(JSON.stringify({ tool: 'price-to-wire', results: R, errors }, null, 1));
  await browser.close();
})();
