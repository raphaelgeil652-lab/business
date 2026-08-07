const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const outdir = process.argv[2];
  const html = 'file://' + outdir + '/faltflyer.html';
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage();
  await p.goto(html, { waitUntil: 'networkidle' });
  await p.pdf({ path: outdir + '/chinatown-faltflyer-A4.pdf', width:'297mm', height:'210mm', printBackground:true, margin:{top:'0',bottom:'0',left:'0',right:'0'} });
  await p.setViewportSize({ width: 1123, height: 794 });
  const secs = await p.$$('.sheet');
  const names = ['aussen','innen'];
  for (let i=0;i<secs.length;i++){ await secs[i].screenshot({ path: `${outdir}/fold-${names[i]}.png` }); }
  await b.close();
  console.log('OK');
})();
