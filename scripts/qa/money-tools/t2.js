const { open, check } = require('./lib');
const path = require('path');

const EX = { 'rw-rev-1': '10000000', 'rw-rev-2': '12000000', 'rw-cogs-1': '6200000', 'rw-cogs-2': '7680000', 'rw-opex-1': '2700000', 'rw-opex-2': '3050000', 'rw-int-1': '120000', 'rw-int-2': '160000', 'rw-rate': '25', 'rw-prin-1': '300000', 'rw-prin-2': '400000', 'rw-grow-1': '150000', 'rw-grow-2': '450000', 'rw-inv-1': '100000', 'rw-inv-2': '250000', 'rw-took-1': '180000', 'rw-took-2': '180000' };
const M = '−';

async function fillFull(page, map, mode = 'full') {
  await page.click('[data-clear]');
  await page.click(mode === 'full' ? 'label[for=rw-detail-full]' : 'label[for=rw-detail-quick]');
  for (const [id, v] of Object.entries(map)) await page.fill('#' + id, String(v));
  await page.locator('body').click({ position: { x: 2, y: 2 } }).catch(() => {});
}

(async () => {
  const { browser, page, errors, net } = await open('/where-the-revenue-went/');
  const R = [];
  const read = () => page.evaluate(() => {
    const cellv = (row, col) => { const td = document.querySelector(`[data-years] tr[data-row="${row}"] td[data-col="${col}"]`); return td && td.getAttribute('data-value') !== null ? Number(td.getAttribute('data-value')) : null; };
    const pctOf = (row, col) => { const td = document.querySelector(`[data-years] tr[data-row="${row}"] td[data-col="${col}"] .mt-cents`); return td ? td.textContent : null; };
    const bt = document.querySelector('[data-bridge-table]');
    const v = (id) => document.getElementById(id).value;
    return {
      lead: document.querySelector('[data-lead]').textContent.trim(),
      sub: document.querySelector('[data-lead-sub]').hidden ? '' : document.querySelector('[data-lead-sub]').textContent.trim(),
      interp: document.querySelector('[data-interp]').hidden ? '' : document.querySelector('[data-interp]').textContent.trim(),
      L1: cellv('L', '1'), L2: cellv('L', '2'), B1: cellv('B', '1'), B2: cellv('B', '2'), TX1: cellv('tx', '1'), TX2: cellv('tx', '2'), PBT2: cellv('PBT', '2'),
      Lp2: pctOf('L', '2'), Lp1: pctOf('L', '1'), cogsP2: pctOf('cogs', '2'), hasTx: !!document.querySelector('[data-years] tr[data-row="tx"]'),
      growShown2: (document.querySelector('[data-years] tr[data-row="grow"] td[data-col="2"]') || {}).textContent,
      bridgeShown: !bt.hidden, bridgeSum: bt.getAttribute('data-sum'), bridgeCap: bt.querySelector('caption').textContent,
      sentences: [...document.querySelectorAll('[data-sentence]')].map((p) => p.textContent),
      lastLabel: [...document.querySelectorAll('[data-years] tr[data-row="L"] th')].map((t) => t.textContent)[0],
      cols: [...document.querySelectorAll('[data-years-head] th')].map((t) => t.textContent),
      sankeyPaths: document.querySelectorAll('[data-sankey] path').length,
      sankeyText: [...document.querySelectorAll('[data-sankey] text')].map((t) => t.textContent).join(' | '),
      banner: !document.querySelector('[data-example-banner]').hidden,
      fileOut: document.getElementById('rw-file-out').hidden ? '' : document.getElementById('rw-file-out').textContent,
      fields: { rev1: v('rw-rev-1'), rev2: v('rw-rev-2'), cogs1: v('rw-cogs-1'), cogs2: v('rw-cogs-2'), opex1: v('rw-opex-1'), opex2: v('rw-opex-2'), int1: v('rw-int-1'), int2: v('rw-int-2'), grow2: v('rw-grow-2'), prin2: v('rw-prin-2') },
      quickHidden: getComputedStyle(document.querySelector('tr[data-full]')).display === 'none',
      prinLabel: document.getElementById('rw-row-prin').textContent
    };
  });

  let d = await read();
  check(R, 'V2-1', 'Page opens with the worked example loaded and a Sankey on top',
    d.banner && d.L2 === -267500 && d.sankeyPaths >= 6, `banner ${d.banner}; left for you ${d.L2}; Sankey bands ${d.sankeyPaths}; labels: ${d.sankeyText.slice(0, 160)}`);

  await page.click('[data-example]');
  d = await read();
  check(R, 'T2-1', 'Worked example (Show an example link)',
    d.L1 === 185000 && d.L2 === -267500 && d.bridgeShown && d.bridgeSum === '2000000' && d.B1 === 5000 && d.B2 === -447500 && d.Lp1 === '1.9%' && d.Lp2 === M + '2.2%',
    `L ${d.L1} / ${d.L2}; bridge "${d.bridgeCap}" sums to ${d.bridgeSum}; B ${d.B1} / ${d.B2}; percent left ${d.Lp1} / ${d.Lp2}; cost of goods ${d.cogsP2}`);

  await fillFull(page, { 'rw-rev-2': '5000000', 'rw-cogs-2': '3500000', 'rw-opex-2': '1700000', 'rw-int-2': '50000', 'rw-prin-2': '100000', 'rw-grow-2': '-50000', 'rw-rate': '25' });
  d = await read();
  check(R, 'T2-2', 'Loss year (this year only, rate 25%)',
    d.PBT2 === -250000 && d.TX2 === 0 && d.L2 === -300000 && d.Lp2 === M + '6.0%' && d.sentences.includes('No tax set-aside on a loss.'),
    `PBT ${d.PBT2}; TX ${d.TX2}; L ${d.L2}; percent ${d.Lp2}; sentences: ${d.sentences.join(' | ')}`);
  check(R, 'T2-5', 'Growth -50,000 shown as cash released', d.sentences.includes('Cash released from receivables and inventory: +$50,000.') && /\+\$50,000/.test(d.growShown2) && /Cash released/.test(d.sankeyText), `cell "${d.growShown2}"; Sankey shows cash released: ${/Cash released/.test(d.sankeyText)}`);
  check(R, 'T2-4', 'This year only: no bridge', !d.bridgeShown && d.cols.length === 2, `bridge ${d.bridgeShown ? 'rendered' : 'not rendered'}; columns ${JSON.stringify(d.cols)}`);

  const noRate = { ...EX }; delete noRate['rw-rate'];
  await fillFull(page, noRate);
  d = await read();
  check(R, 'T2-3', 'Worked example, rate blank', d.L1 === 430000 && d.L2 === 10000 && !d.hasTx && d.lead.includes('before tax') && d.lastLabel === 'Left for you, before tax', `L ${d.L1} / ${d.L2}; tax rows ${d.hasTx ? 'shown' : 'hidden'}; lead "${d.lead}"`);

  // Quick mode: five numbers, detail rows hidden and ignored.
  await fillFull(page, { 'rw-rev-2': '12000000', 'rw-cogs-2': '7680000', 'rw-opex-2': '3050000', 'rw-prin-2': '560000', 'rw-took-2': '180000' }, 'quick');
  d = await read();
  check(R, 'V2-2', 'Quick mode: five numbers', d.quickHidden && d.prinLabel === 'Loan payments' && d.L2 === 710000, `detail rows hidden ${d.quickHidden}; label "${d.prinLabel}"; left for you ${d.L2} (12,000,000 - 7,680,000 - 3,050,000 - 560,000)`);

  // Upload: QuickBooks-style comparison exports, CSV and Excel.
  await page.click('[data-clear]');
  const before = net.length;
  await page.setInputFiles('#rw-file', [path.join(__dirname, 'fixtures/qbo-pl.csv'), path.join(__dirname, 'fixtures/qbo-bs.csv')]);
  await page.waitForTimeout(400);
  d = await read();
  const after = net.slice(before);
  check(R, 'V2-3', 'Upload CSV P&L and balance sheet fills both years',
    d.fields.rev2 === '$12,000,000' && d.fields.rev1 === '$10,000,000' && d.fields.cogs2 === '$7,680,000' && d.fields.opex2 === '$3,050,000' && d.fields.opex1 === '$2,700,000' && d.fields.int2 === '$160,000' && d.fields.grow2 === '$350,000' && d.fields.prin2 === '$400,000' && after.length === 0,
    `fields ${JSON.stringify(d.fields)}; message "${d.fileOut}"; network requests during upload: ${after.length}`);
  await page.click('[data-clear]');
  await page.setInputFiles('#rw-file', path.join(__dirname, 'fixtures/qbo-pl.xlsx'));
  await page.waitForTimeout(500);
  d = await read();
  check(R, 'V2-4', 'Upload Excel P&L', d.fields.rev2 === '$12,000,000' && d.fields.opex1 === '$2,700,000' && d.fields.int1 === '$120,000', `fields ${JSON.stringify(d.fields)}; message "${d.fileOut}"`);
  await page.setInputFiles('#rw-file', { name: 'junk.csv', mimeType: 'text/csv', buffer: Buffer.from('hello,world\n1,2\n') });
  await page.waitForTimeout(300);
  d = await read();
  check(R, 'V2-5', 'Unreadable file says so', /couldn/.test(d.fileOut), `"${d.fileOut}"`);

  await page.click('[data-clear]');
  const e = await page.$eval('[data-empty]', (n) => (n.hidden ? '' : n.textContent.trim()));
  check(R, 'E1', 'Revenue blank', e === 'Type revenue to see where it went.', `"${e}"`);
  await page.click('[data-example]');
  await page.click('label[for=rw-mode-m]');
  d = await read();
  check(R, 'E2', 'Monthly mode relabels, same math', d.lead.startsWith('Left for you this month') && d.cols.includes('Last month') && d.L2 === -267500, `lead "${d.lead}"`);

  console.log(JSON.stringify({ tool: 'where-the-revenue-went', results: R, errors }, null, 1));
  await browser.close();
})();
