// Baut aus lebensweg-a4.html das druckfertige PDF und ein PNG (ca. 300 dpi).
// Aufruf im Ordner visionboard/druck:  node pdf-bauen.js
const path = require('path');
const pw = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
(async () => {
  const b = await pw.chromium.launch();
  const url = 'file://' + path.join(__dirname, 'lebensweg-a4.html');
  const p = await b.newPage({ viewport: { width: 794, height: 1123 }, deviceScaleFactor: 3.125 });
  await p.goto(url);
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(600);
  const fonts = await p.evaluate(() => [...document.fonts].map(f => f.family + ':' + f.status).join(' '));
  const ueber = await p.evaluate(() => [...document.querySelectorAll('.karte .text, .finale-inhalt, .fuss')]
    .filter(e => e.scrollHeight > e.clientHeight + 1 || e.scrollWidth > e.clientWidth + 1).length);
  console.log(fonts, '| überlaufende Blöcke:', ueber);
  await p.pdf({ path: path.join(__dirname, 'lebensweg-a4.pdf'), format: 'A4', printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
  await (await p.$('.blatt')).screenshot({ path: path.join(__dirname, 'lebensweg-a4.png') });
  await b.close();
})();
