const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const dir = process.argv[2];
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const seiten = ['index', 'speisekarte', 'kontakt'];
  for (const [name, w, h] of [['desktop', 1280, 900], ['mobil', 390, 844]]) {
    for (const s of seiten) {
      const p = await b.newPage();
      await p.setViewportSize({ width: w, height: h });
      await p.goto('file://' + dir + '/' + s + '.html', { waitUntil: 'networkidle' });
      // einmal durchscrollen, damit die Einblend-Beobachter ausloesen
      await p.evaluate(async () => {
        // weiches Scrollen abschalten, sonst kommen die Spruenge nie unten an
        document.documentElement.style.scrollBehavior = 'auto';
        const schritt = window.innerHeight * 0.8;
        for (let y = 0; y < document.body.scrollHeight; y += schritt) {
          window.scrollTo(0, y);
          await new Promise(r => setTimeout(r, 90));
        }
        window.scrollTo(0, 0);
      });
      await p.waitForTimeout(800);
      await p.screenshot({ path: `${dir}/tools/_shots/${name}-${s}.png`, fullPage: true });
      await p.close();
    }
  }
  await b.close();
  console.log('Screenshots fertig');
})();
