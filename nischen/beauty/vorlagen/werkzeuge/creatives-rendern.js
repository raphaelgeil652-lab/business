// Erzeugt aus einer creatives.html die PNG-Dateien zum Hochladen bei Meta.
// Aufruf:  node nischen/beauty/vorlagen/werkzeuge/creatives-rendern.js <pfad/zu/creatives.html>
// Ergebnis: <ordner der html>/creatives/<name>.png, exakt in der Größe des jeweiligen Elements.
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

(async () => {
  const src = process.argv[2];
  if (!src) { console.error('Pfad zur creatives.html fehlt.'); process.exit(1); }
  const file = path.resolve(src);
  const out = path.join(path.dirname(file), 'creatives');
  fs.mkdirSync(out, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 2000 }, deviceScaleFactor: 1 });
  await page.goto('file://' + file);
  await page.evaluate(() => document.fonts.ready);
  const items = await page.$$('[data-creative]');
  for (const el of items) {
    const name = await el.getAttribute('data-creative');
    const target = path.join(out, name + '.png');
    await el.screenshot({ path: target });
    console.log('✓', path.relative(process.cwd(), target));
  }
  await browser.close();
})();
