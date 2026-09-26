// Baut plan.pdf aus plan.html.  Aufruf: node pdf.js
const path = require('path');
const pw = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
(async () => {
  const b = await pw.chromium.launch();
  const p = await b.newPage();
  await p.goto('file://' + path.join(__dirname, 'plan.html'));
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(500);
  console.log(await p.evaluate(() => [...document.fonts].filter(f => f.status !== 'loaded').map(f => f.family + ' ' + f.weight).join(', ') || 'alle Schriften geladen'));
  await p.pdf({ path: path.join(__dirname, 'plan-bis-30.pdf'), format: 'A4', printBackground: true, preferCSSPageSize: true });
  await b.close();
})();
