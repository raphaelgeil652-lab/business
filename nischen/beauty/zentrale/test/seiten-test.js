#!/usr/bin/env node
/* Ende-zu-Ende-Test: echte Terminseite im Browser (Playwright) + nachgebaute Beauty-Zentrale (Code.gs wie in test.js).
 * Aufruf (aus dem Repo-Hauptordner):  node nischen/beauty/zentrale/test/seiten-test.js
 * Braucht den Beispielkunden nischen/beauty/kunden/muster-laserstudio (beispiele-bauen.py).
 * Spielt durch: Termin wählen → reservieren → Mail „Bitte bestätigen“ → Bestätigungsseite → Kalender + Mails →
 * Absage-Link → Absageseite → Platz wieder frei. Dazu: Fehlermeldung bei ungültiger Telefonnummer, Rückruf-Ausweg. */
'use strict';
process.env.TZ = 'Europe/Berlin';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { chromium } = require('playwright');

const HIER = path.resolve(__dirname, '..');
const REPO = path.resolve(HIER, '../../..');
// Den Google-Nachbau aus test.js übernehmen (alles zwischen „Uhr“ und dem ersten Testblock), ohne die Tests auszuführen
const quelle = fs.readFileSync(path.join(__dirname, 'test.js'), 'utf8');
const nachbau = quelle.slice(quelle.indexOf("const fs = require('fs');"),
  quelle.indexOf('// ================================================================ 1 Einrichten'));
const N = new Function('require', '__dirname', 'process', nachbau +
  '\nreturn { G, neu, termine, mails, kalender, blaetter, setzeJetzt: ms => { JETZT = ms; } };')(
  require, __dirname, process);

let ok = 0, fehler = 0;
function pruefe(bed, was) { if (bed) ok++; else { fehler++; console.log('  ✗ ' + was); } }

(async () => {
  N.setzeJetzt(Date.now());
  N.neu();
  N.G.einrichten();
  const URL_Z = 'https://script.google.com/macros/s/TEST/exec';
  // Kundenseite in einen Testordner kopieren, auf die Test-Zentrale und den Testkunden umstellen
  const lpQuelle = path.join(REPO, 'nischen/beauty/kunden/muster-laserstudio/landingpage');
  const lp = fs.mkdtempSync(path.join(os.tmpdir(), 'beauty-lp-'));
  fs.cpSync(lpQuelle, lp, { recursive: true });
  for (const f of ['termin.html', 'bestaetigen.html', 'absagen.html']) {
    const p = path.join(lp, f);
    fs.writeFileSync(p, fs.readFileSync(p, 'utf8').replace(/"zentrale": ""/g, `"zentrale": "${URL_Z}"`).replace(/"kunde": "muster-laserstudio"/, '"kunde": "muster-laser"'));
  }
  const datei = n => 'file://' + path.join(lp, n);

  const b = await chromium.launch();
  const page = await b.newPage({ viewport: { width: 390, height: 844 } });
  const jsFehler = [];
  page.on('pageerror', e => jsFehler.push(e.message));
  await page.route(URL_Z + '**', async route => {
    const req = route.request(), u = new URL(req.url());
    N.setzeJetzt(Date.now());
    const antwort = req.method() === 'POST'
      ? N.G.doPost({ parameter: Object.fromEntries(u.searchParams), postData: { contents: req.postData() } })
      : N.G.doGet({ parameter: Object.fromEntries(u.searchParams) });
    await route.fulfill({ status: 200, contentType: 'application/json', headers: { 'Access-Control-Allow-Origin': '*' }, body: antwort.text });
  });

  console.log('1 Seite lädt freie Termine aus der Zentrale');
  await page.goto(datei('termin.html') + '?utm_source=meta&utm_campaign=laser-l1');
  await page.click('#consent-yes');
  await page.waitForSelector('.zeit');
  pruefe(await page.$eval('#demo', e => e.style.display) === 'none', 'kein Vorschau-Hinweis (echte Zentrale)');
  const arten = await page.$$eval('.art b', l => l.map(x => x.textContent));
  pruefe(arten.length === 4 && arten[1] === 'Achseln', 'Auswahl: Beratung + direkt buchbare Leistungen aus dem Steckbrief (' + arten.join(', ') + ')');
  await (await page.$$('.art'))[1].click();
  await page.waitForSelector('.zeit');
  const tag = await page.$eval('.tag[aria-pressed="true"]', e => e.textContent);
  const zeit = await page.$eval('.zeit', e => e.textContent);
  await page.click('.zeit');
  pruefe(/Achseln \(20 Min\.\)/.test(await page.textContent('#wahl')), 'Auswahl zeigt Leistung und Dauer');

  console.log('2 Falsche Telefonnummer → Hinweis am Feld');
  await page.fill('input[name=name]', 'Anna Beispiel');
  await page.fill('input[name=telefon]', '12345');
  await page.fill('input[name=email]', 'anna@beispiel.de');
  for (const c of await page.$$('#buchung-form input[type=checkbox]')) await c.check();
  await page.waitForTimeout(3100); // Zeit-Falle: Menschen brauchen länger als 3 Sekunden
  await page.click('#senden');
  await page.waitForSelector('#fehler-telefon.show');
  pruefe(/Telefonnummer/.test(await page.textContent('#fehler-telefon')) && N.termine().length === 0, 'Fehler am Telefonfeld, nichts gebucht');

  console.log('3 Reservieren → Danke-Seite, Mail „Bitte bestätigen“');
  await page.fill('input[name=telefon]', '0151 23456781');
  await page.click('#senden');
  await page.waitForURL(/danke\.html/);
  pruefe(/a•••@beispiel\.de/.test(await page.textContent('#mail')), 'Danke-Seite zeigt die (gekürzte) Adresse');
  let t = N.termine()[0];
  pruefe(t && t.Stand === 'unbestätigt' && t.Leistung === 'Achseln' && t.Quelle === 'Meta' && /Anzeige: laser-l1/.test(t.Details), 'Zeile „unbestätigt“, Leistung, Quelle Meta, Anzeige gemerkt');
  const bitte = N.mails.find(m => m.to === 'anna@beispiel.de' && m.subject.startsWith('Bitte bestätigen'));
  pruefe(!!bitte, 'Mail „Bitte bestätigen“ an die Kundin');
  const link = bitte.htmlBody.match(/href="([^"]*bestaetigen\.html[^"]*)"/)[1].replace(/&amp;/g, '&');

  console.log('4 Bestätigungsseite → Termin fest');
  await page.goto(datei('bestaetigen.html') + link.slice(link.indexOf('?')));
  await page.waitForSelector('#ok');
  pruefe((await page.textContent('#box')).includes('Achseln'), 'Bestätigungsseite zeigt den Termin');
  pruefe(N.termine()[0].Stand === 'unbestätigt', 'nur Öffnen der Seite bestätigt nichts (Schutz vor Link-Scannern)');
  await page.evaluate(() => { window.__lead = 0; const alt = window.messungMelden; window.messungMelden = () => { window.__lead++; alt && alt(); }; });
  await page.click('#ok');
  await page.waitForFunction(() => /bestätigt/.test(document.querySelector('#box h1').textContent));
  t = N.termine()[0];
  pruefe(t.Stand === 'Termin', 'Stand „Termin“');
  pruefe(N.kalender['studio@laser.de'].some(e => e.titel === 'Achseln: Anna Beispiel (online gebucht)'), 'Termin im Kalender des Studios');
  pruefe(N.mails.some(m => m.to === 'anna@beispiel.de' && m.subject.startsWith('Bestätigt:')) && N.mails.some(m => m.to === 'studio@laser.de' && m.subject.startsWith('Neuer Online-Termin')), 'Bestätigung an Kundin, Mail ans Studio');
  pruefe(await page.evaluate(() => window.__lead) === 1, 'Seite meldet genau einmal „Lead“ an Meta/Google');
  pruefe((await page.textContent('#box')).includes('So bereiten Sie sich vor'), 'Vorbereitung auf der Seite');

  console.log('5 Absage-Link → Platz wieder frei');
  const best = N.mails.find(m => m.to === 'anna@beispiel.de' && m.subject.startsWith('Bestätigt:'));
  const ab = best.htmlBody.match(/href="([^"]*absagen\.html[^"]*)"/)[1].replace(/&amp;/g, '&');
  await page.goto(datei('absagen.html') + ab.slice(ab.indexOf('?')));
  await page.waitForSelector('#ok');
  await page.click('#ok');
  await page.waitForFunction(() => /abgesagt/.test(document.querySelector('#box h1').textContent));
  pruefe(N.termine()[0].Stand === 'abgesagt' && !N.kalender['studio@laser.de'].some(e => e.titel.includes('Anna')), 'abgesagt, aus dem Kalender gelöscht');
  await page.goto(datei('termin.html'));
  await (await page.$$('.art'))[1].click();
  await page.waitForSelector('.zeit');
  pruefe(await page.$eval('.tag[aria-pressed="true"]', e => e.textContent) === tag && await page.$eval('.zeit', e => e.textContent) === zeit, 'derselbe Platz ist wieder buchbar');

  console.log('6 Rückruf-Ausweg');
  await page.click('#rueckruf-link');
  pruefe(await page.isVisible('form[name=rueckruf]'), 'Rückruf-Formular klappt auf');
  pruefe(await page.$eval('form[name=rueckruf]', f => f.getAttribute('data-netlify')) === 'true', 'Rückruf-Formular ist ein Netlify-Formular');

  pruefe(jsFehler.length === 0, 'keine JavaScript-Fehler: ' + jsFehler.join(' | '));
  await b.close();
  fs.rmSync(lp, { recursive: true, force: true });
  console.log(`\n${ok} bestanden, ${fehler} fehlgeschlagen`);
  process.exit(fehler ? 1 : 0);
})();
