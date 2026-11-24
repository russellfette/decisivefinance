const { open, fill, check } = require('./lib');

const EX = { 'rw-rev-1': '10000000', 'rw-rev-2': '12000000', 'rw-cogs-1': '6200000', 'rw-cogs-2': '7680000', 'rw-opex-1': '2700000', 'rw-opex-2': '3050000', 'rw-int-1': '120000', 'rw-int-2': '160000', 'rw-rate': '25', 'rw-prin-1': '300000', 'rw-prin-2': '400000', 'rw-grow-1': '150000', 'rw-grow-2': '450000', 'rw-inv-1': '100000', 'rw-inv-2': '250000', 'rw-took-1': '180000', 'rw-took-2': '180000' };

(async () => {
  const { browser, page, errors } = await open('/where-the-revenue-went/');
  const R = [];
  const read = () => page.evaluate(() => {
    const cellv = (row, col) => { const td = document.querySelector(`[data-years] tr[data-row="${row}"] td[data-col="${col}"]`); return td && td.getAttribute('data-value') !== null ? Number(td.getAttribute('data-value')) : null; };
    const centsOf = (row, col) => { const td = document.querySelector(`[data-years] tr[data-row="${row}"] td[data-col="${col}"] .mt-cents`); return td ? td.textContent : null; };
    const bt = document.querySelector('[data-bridge-table]');
    return {
      lead: document.querySelector('[data-lead]').textContent.trim(),
      sub: document.querySelector('[data-lead-sub]').hidden ? '' : document.querySelector('[data-lead-sub]').textContent.trim(),
      interp: document.querySelector('[data-interp]').hidden ? '' : document.querySelector('[data-interp]').textContent.trim(),
      L1: cellv('L', '1'), L2: cellv('L', '2'), B1: cellv('B', '1'), B2: cellv('B', '2'), TX1: cellv('tx', '1'), TX2: cellv('tx', '2'), PBT2: cellv('PBT', '2'),
      Lc2: centsOf('L', '2'), Lc1: centsOf('L', '1'), hasTx: !!document.querySelector('[data-years] tr[data-row="tx"]'),
      growShown2: (document.querySelector('[data-years] tr[data-row="grow"] td[data-col="2"]') || {}).textContent,
      bridgeShown: !bt.hidden, bridgeSum: bt.getAttribute('data-sum'), bridgeCap: bt.querySelector('caption').textContent,
      bridgeRows: [...document.querySelectorAll('[data-bridge] tr')].map((t) => t.querySelector('th').textContent + ' ' + t.querySelector('td').childNodes[0].textContent),
      sentences: [...document.querySelectorAll('[data-sentence]')].map((p) => p.textContent),
      lastLabel: [...document.querySelectorAll('[data-years] tr[data-row="L"] th')].map((t) => t.textContent)[0],
      cols: [...document.querySelectorAll('[data-years-head] th')].map((t) => t.textContent)
    };
  });

  await page.click('[data-example]');
  let d = await read();
  check(R, 'T2-1', 'Worked example (Show an example link)',
    d.L1 === 185000 && d.L2 === -267500 && d.bridgeShown && d.bridgeSum === '2000000' && d.B1 === 5000 && d.B2 === -447500 && d.Lc1 === '1.9¢' && d.Lc2 === '\u22122.2\u00a2',
    `L ${d.L1} / ${d.L2}; bridge "${d.bridgeCap}" sums to ${d.bridgeSum}: ${d.bridgeRows.join('; ')}; B ${d.B1} / ${d.B2}; cents left ${d.Lc1} / ${d.Lc2}; lead "${d.lead}" (${d.sub}); interp "${d.interp}"; sentences: ${d.sentences.join(' | ')}`);

  await fill(page, { 'rw-rev-2': '5000000', 'rw-cogs-2': '3500000', 'rw-opex-2': '1700000', 'rw-int-2': '50000', 'rw-prin-2': '100000', 'rw-grow-2': '-50000', 'rw-rate': '25' });
  d = await read();
  check(R, 'T2-2', 'Loss year (this year only, rate 25%)',
    d.PBT2 === -250000 && d.TX2 === 0 && d.L2 === -300000 && d.Lc2 === '\u22126.0\u00a2' && d.sentences.includes('No tax set-aside on a loss.'),
    `PBT ${d.PBT2}; TX ${d.TX2}; L ${d.L2}; cents ${d.Lc2}; sentences: ${d.sentences.join(' | ')}`);
  check(R, 'T2-5', 'Growth -50,000 shown as cash released',
    d.sentences.includes('Cash released from receivables and inventory: +$50,000.') && /\+\$50,000/.test(d.growShown2),
    `growth cell "${d.growShown2}"; sentence present: ${d.sentences.includes('Cash released from receivables and inventory: +$50,000.')}`);
  check(R, 'T2-4', 'This year only: no bridge', !d.bridgeShown && d.cols.length === 2, `bridge ${d.bridgeShown ? 'rendered' : 'not rendered'}; columns ${JSON.stringify(d.cols)}`);

  const noRate = { ...EX }; delete noRate['rw-rate'];
  await fill(page, noRate);
  d = await read();
  check(R, 'T2-3', 'Worked example, rate blank',
    d.L1 === 430000 && d.L2 === 10000 && !d.hasTx && d.lead.includes('before tax') && d.lastLabel === 'Left for you, before tax',
    `L ${d.L1} / ${d.L2}; tax rows ${d.hasTx ? 'shown' : 'hidden (0 both years)'}; lead "${d.lead}"; row "${d.lastLabel}"`);

  await fill(page, {});
  const e = await page.$eval('[data-empty]', (n) => (n.hidden ? '' : n.textContent.trim()));
  check(R, 'E1', 'Revenue blank', e === 'Type revenue to see where it went.', `"${e}"`);

  await page.click('[data-example]');
  await page.check('#rw-mode-m');
  d = await read();
  check(R, 'E2', 'Monthly mode relabels, same math', d.lead.startsWith('Left for you this month') && d.cols.includes('Last month') && d.L2 === -267500, `lead "${d.lead}"; cols ${JSON.stringify(d.cols)}`);

  console.log(JSON.stringify({ tool: 'where-the-revenue-went', results: R, errors }, null, 1));
  await browser.close();
})();
