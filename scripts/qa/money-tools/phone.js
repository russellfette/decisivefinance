const { open } = require('./lib');
(async () => {
  const OUT = process.argv[2] || '/tmp/claude-0/qa-out';
  for (const slug of ['price-to-wire', 'where-the-revenue-went', 'working-capital-target']) {
    const { browser, page } = await open('/' + slug + '/', { ctx: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'reduce' } });
    await page.waitForTimeout(300);
    await page.screenshot({ path: `${OUT}/${slug}-phone-top.png` });
    if (slug !== 'working-capital-target') {
      await page.tap('[data-summary]');
      await page.waitForTimeout(600);
      await page.locator('.mt-out').screenshot({ path: `${OUT}/${slug}-phone-expanded.png` });
    } else {
      await page.locator('.mt-quick').screenshot({ path: `${OUT}/${slug}-phone-expanded.png` });
    }
    await browser.close();
  }
})();
