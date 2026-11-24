const { open, fill, check } = require('./lib');
const MONTHS = [1650000, 1700000, 1750000, 1850000, 1950000, 2050000, 2000000, 1900000, 1800000, 1700000, 1650000, 1600000];

(async () => {
  const { browser, page, errors } = await open('/working-capital-target/');
  const R = [];
  const read = () => page.evaluate(() => {
    const lead = document.querySelector('[data-lead]');
    const cap = document.querySelector('[data-caption]');
    return {
      wt: Number(lead.getAttribute('data-wt')), wc: Number(lead.getAttribute('data-wc')), adj: Number(lead.getAttribute('data-adj')),
      lead: lead.textContent.trim(), interp: document.querySelector('[data-interp]').textContent.trim(),
      notes: [...document.querySelectorAll('[data-note]')].map((n) => n.textContent),
      months: !document.querySelector('[data-months-view]').hidden, caption: cap.textContent, best: cap.getAttribute('data-best'), worst: cap.getAttribute('data-worst')
    };
  });

  await page.click('[data-example]');
  let d = await read();
  check(R, 'T3-1', 'Worked example (Show an example link)',
    d.wt === 1800000 && d.wc === 1650000 && d.adj === -150000 && d.best === '6:250000' && d.worst === '12:-200000',
    `Wt ${d.wt}; Wc ${d.wc}; adjustment ${d.adj}; best ${d.best}; worst ${d.worst}; lead "${d.lead}"; interp "${d.interp}"; caption "${d.caption}"; notes ${JSON.stringify(d.notes)}`);

  await fill(page, { 'w-a1': '2000000', 'w-b6': '2100000' });
  d = await read();
  check(R, 'T3-2', 'A1 2,000,000; B6 2,100,000', d.adj === 100000 && d.notes.includes('Using the target you typed.'), `adjustment ${d.adj}; lead "${d.lead}"; interp "${d.interp}"; notes ${JSON.stringify(d.notes)}`);

  const six = {}; MONTHS.slice(0, 6).forEach((v, i) => { six['w-m' + (i + 1)] = String(v); });
  await fill(page, six);
  d = await read();
  check(R, 'T3-3', 'Months 1 to 6 only', d.wt === 1825000 && d.notes.includes('Averaged over 6 months.') && !d.months, `Wt ${d.wt}; notes ${JSON.stringify(d.notes)}; month view ${d.months ? 'shown' : 'hidden'}`);

  await fill(page, { 'w-a1': '-200000', 'w-b6': '-350000' });
  d = await read();
  check(R, 'T3-4', 'A1 -200,000; B6 -350,000', d.adj === -150000 && d.notes.includes('Your working capital is negative; the same rule applies.'), `adjustment ${d.adj}; notes ${JSON.stringify(d.notes)}`);

  await fill(page, {});
  const e = await page.$eval('[data-empty]', (n) => (n.hidden ? '' : n.textContent.trim()));
  check(R, 'E1', 'No target and no months', e === 'Type a target or your month-end balances.', `"${e}"`);

  const both = { 'w-a1': '1900000', 'w-m1': '1000000', 'w-b6': '1900000' };
  await fill(page, both);
  d = await read();
  check(R, 'E2', 'Both A1 and months; zero adjustment', d.wt === 1900000 && d.notes.includes('Using the target you typed.') && d.interp === 'You’d deliver the target. No adjustment.', `Wt ${d.wt}; interp "${d.interp}"; notes ${JSON.stringify(d.notes)}`);

  console.log(JSON.stringify({ tool: 'working-capital-target', results: R, errors }, null, 1));
  await browser.close();
})();
