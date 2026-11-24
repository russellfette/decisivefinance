const { open } = require('./lib');
(async () => {
  const OUT = '/tmp/claude-0/qa-out';
  for (const slug of ['price-to-wire', 'where-the-revenue-went', 'working-capital-target']) {
    const { browser, page } = await open('/' + slug + '/', { ctx: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'reduce' } });
    await page.click('[data-example]');
    await page.tap('[data-summary]');
    await page.waitForTimeout(900);
    await page.locator('.mt-out').screenshot({ path: `${OUT}/${slug}-phone-expanded.png` });
    await browser.close();
  }
})();
