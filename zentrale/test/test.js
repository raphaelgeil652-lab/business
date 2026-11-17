#!/usr/bin/env node
/* Testlauf für zentrale/Code.gs ohne Google: Tabellen, Mails, Zeitpläne und Uhrzeit werden nachgebaut.
 * Aufruf (aus dem Repo-Hauptordner):  node zentrale/test/test.js
 * Die Spaltennamen kommen aus zentrale-bauen.py --kopf, damit Tabelle und Code nicht auseinanderlaufen. */
'use strict';
process.env.TZ = 'Europe/Berlin'; // wie in Apps Script: Datumsrechnung in der Zeitzone des Skripts
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { execFileSync } = require('child_process');
const crypto = require('crypto');

const HIER = path.resolve(__dirname, '..');
const KOPF = JSON.parse(execFileSync('python3', [path.join(HIER, 'zentrale-bauen.py'), '--kopf'], { encoding: 'utf8' }));
const TZ = 'Europe/Berlin';

let ok = 0, fehler = 0;
function pruefe(bed, was) { if (bed) { ok++; } else { fehler++; console.log('  ✗ ' + was); } }

// ---------------------------------------------------------------- Uhr
let JETZT = 0;
class FDate extends Date {
  constructor(...a) { if (a.length === 0) super(JETZT); else super(...a); }
  static now() { return JETZT; }
}
function berlin(s) { // "2027-01-11 09:00" in Berliner Winterzeit (+01:00)
  return new FDate(s.replace(' ', 'T') + ':00+01:00');
}
function uhr(s) { JETZT = berlin(s).getTime(); }

// ---------------------------------------------------------------- Google nachgebaut
class Blatt {
  constructor(name, zeilen) { this.name = name; this.z = zeilen; }
  letzte() { for (let i = this.z.length - 1; i >= 0; i--) if (this.z[i].some(v => v !== '' && v != null)) return i + 1; return 0; }
  getDataRange() {
    const n = this.letzte(), b = Math.max(0, ...this.z.slice(0, n).map(r => r.length));
    return { getValues: () => this.z.slice(0, n).map(r => { const c = r.slice(); while (c.length < b) c.push(''); return c; }) };
  }
  getName() { return this.name; }
  appendRow(a) { this.z.splice(this.letzte(), 0, a.slice()); }
  getRange(r, c) {
    return {
      setValue: v => { while (this.z.length < r) this.z.push([]); const row = this.z[r - 1]; while (row.length < c) row.push(''); row[c - 1] = v; },
      setFormula: f => { while (this.z.length < r) this.z.push([]); const row = this.z[r - 1]; while (row.length < c) row.push(''); row[c - 1] = f; },
      setNumberFormat: () => {},
      getSheet: () => this,
      getValue: () => (this.z[r - 1] || [])[c - 1]
    };
  }
}
const blaetter = {};
const mails = [], entwuerfe = [], dateien = [], alerts = [];
let trigger = [], props = {};

function formatDate(d, tz, muster) {
  const t = {};
  new Intl.DateTimeFormat('en-GB', { timeZone: tz, weekday: 'short', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(d).forEach(p => { t[p.type] = p.value; });
  const u = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 }[t.weekday];
  return muster.replace('yyyy', t.year).replace('MM', t.month).replace('dd', t.day).replace('HH', t.hour).replace('mm', t.minute)
    .replace(/\bH\b/, String(Number(t.hour))).replace(/\bu\b/, String(u));
}

const ctx = {
  Date: FDate, Math, JSON, String, Number, Object, Array, RegExp, Error, isNaN, encodeURIComponent, console,
  SpreadsheetApp: {
    getActive: () => ({ getSheetByName: n => blaetter[n] || null, getUrl: () => 'https://docs.google.com/spreadsheets/d/ZENTRALE' }),
    getUi: () => ({
      alert: (...a) => alerts.push(a.join(' | ')), ButtonSet: { OK: 'OK' },
      createMenu: () => { const m = { addItem: () => m, addSeparator: () => m, addToUi: () => m }; return m; }
    })
  },
  MailApp: { sendEmail: (o, sub, body) => mails.push(typeof o === 'object' ? o : { to: o, subject: sub, body }) },
  GmailApp: { createDraft: (to, subject, body, opt) => entwuerfe.push({ to, subject, body, opt }) },
  ScriptApp: {
    WeekDay: { MONDAY: 'MONDAY' },
    getService: () => ({ getUrl: () => 'https://script.google.com/macros/s/ABC/dev' }),
    getProjectTriggers: () => trigger.slice(),
    deleteTrigger: t => { trigger = trigger.filter(x => x !== t); },
    newTrigger: fn => {
      const t = { fn, plan: [] }, b = {
        timeBased: () => b, everyMinutes: n => (t.plan.push('alle ' + n + ' min'), b), everyDays: n => (t.plan.push('alle ' + n + ' Tage'), b),
        onWeekDay: d => (t.plan.push(d), b), onMonthDay: d => (t.plan.push('Tag ' + d), b), atHour: h => (t.plan.push(h + ' Uhr'), b),
        create: () => { trigger.push(t); return t; }
      };
      return b;
    }
  },
  Utilities: { getUuid: () => crypto.randomUUID(), formatDate },
  Session: { getScriptTimeZone: () => TZ, getEffectiveUser: () => ({ getEmail: () => 'besitzer@gmail.com' }) },
  LockService: { getScriptLock: () => ({ waitLock: () => {}, releaseLock: () => {} }) },
  PropertiesService: { getScriptProperties: () => ({ getProperty: k => props[k] || null, setProperty: (k, v) => { props[k] = v; } }) },
  HtmlService: { createHtmlOutput: h => { const o = { html: h, setTitle: () => o, addMetaTag: () => o }; return o; } },
  ContentService: { createTextOutput: t => ({ text: t }) },
  DriveApp: {
    getFolderById: id => {
      const ordner = name => ({
        name, getFoldersByName: n => { let gegeben = false; return { hasNext: () => !gegeben && n === 'Stromrechnungen' && dateien.some(d => d.ordner === n), next: () => { gegeben = true; return ordner(n); } }; },
        createFolder: n => ordner(n),
        createFile: blob => { dateien.push({ ordner: name, name: blob.name }); return { getUrl: () => 'https://drive.google.com/file/d/DATEI' + dateien.length }; }
      });
      if (id !== 'ORDNER1') throw new Error('Ordner unbekannt');
      return ordner('Kundenordner');
    }
  },
  UrlFetchApp: { fetch: url => ({ getResponseCode: () => (url.includes('kaputt') ? 404 : 200), getBlob: () => ({ name: 'rechnung.jpg', getName() { return this.name; }, setName(n) { this.name = n; } }) }) }
};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(HIER, 'Code.gs'), 'utf8'), ctx, { filename: 'Code.gs' });
const G = ctx;

// ---------------------------------------------------------------- Tabellen anlegen (wie nach dem Import)
function neu() {
  for (const k of Object.keys(blaetter)) delete blaetter[k];
  mails.length = 0; entwuerfe.length = 0; dateien.length = 0; alerts.length = 0; trigger = []; props = {};
  const werte = {
    agentur_name: 'Clickculture', agentur_inhaber: 'Max Beispiel', agentur_email: 'ich@agentur.de',
    benachrichtigung_an: 'ich@agentur.de', geschaeftszeiten: '8-18', arbeitstage: 'Mo-Fr', rueckruf_minuten: 60,
    kopie_jeder_anfrage: 'Nein', akquise_erinnerung: 'Ja', webapp_url: 'https://script.google.com/macros/s/ABC/exec', schluessel: ''
  };
  blaetter.Einstellungen = new Blatt('Einstellungen', [['Schlüssel', 'Einstellung', 'Eintrag', 'Hilfe'], ['', 'Abschnitt', '', '']]
    .concat(KOPF.Einstellungen.map(k => [k, k, k in werte ? werte[k] : '', ''])));
  for (const n of ['Kunden', 'Anfragen', 'Werbekosten', 'Akquise']) blaetter[n] = new Blatt(n, [KOPF[n].slice()]);
  blaetter.Checkliste = new Blatt('Checkliste', [['Schritt', 'Aufgabe', 'Wer'], ['', 'Fortschritt', '']]
    .concat(Array.from({ length: KOPF.Checkliste }, (_, i) => ['4', 'Aufgabe ' + (i + 1), 'Du'])));
  const kunde = (o) => blaetter.Kunden.appendRow(KOPF.Kunden.map(h => (h in o ? o[h] : '')));
  kunde({ 'Kürzel': 'muster-solartechnik', 'Betrieb': 'Muster Solartechnik', 'Anrede für Mails': 'Herr Muster',
    'E-Mail für Anfragen': 'kunde@muster.de', 'Drive-Ordner': 'https://drive.google.com/drive/folders/ORDNER1?usp=sharing',
    'Monatsgebühr €': 1500, 'Live seit': berlin('2026-12-01 00:00'), 'Aktiv': 'Ja',
    'Teilnahmeschluss': berlin('2027-01-15 00:00'), 'Ziehung am': berlin('2027-01-20 00:00') });
  kunde({ 'Kürzel': 'alt-gmbh', 'Betrieb': 'Alt GmbH', 'E-Mail für Anfragen': 'alt@x.de', 'Aktiv': 'Nein' });
}
const anfragen = () => { const v = blaetter.Anfragen.getDataRange().getValues(), k = v[0]; return v.slice(1).map(r => Object.fromEntries(k.map((h, i) => [h, r[i]]))); };
const post = (body, key = null) => G.doPost({ parameter: { key: key || G.einst_().schluessel }, postData: { contents: JSON.stringify(body) } });
const netlify = (id, data, extra = {}) => Object.assign({ id, form_name: data.aktion || 'wirtschaftlichkeit', site_url: 'https://muster-solartechnik.netlify.app',
  created_at: new FDate(JETZT).toISOString(), data: Object.assign({ 'form-name': data.aktion || 'wirtschaftlichkeit' }, data) }, extra);
const knopfLink = (html, text) => { const m = html.match(new RegExp('<a href="([^"]+)"[^>]*>' + text + '</a>')); return m ? m[1].replace(/&amp;/g, '&') : null; };
const klick = (url, extra = {}) => { const q = Object.fromEntries(new URL(url).searchParams); return G.doGet({ parameter: Object.assign(q, extra) }); };
const ohneUndefined = (t, was) => pruefe(!/undefined|NaN|\[object/.test(t), was + ': kein „undefined/NaN“ im Text');

// ================================================================ 1 Einrichten
console.log('1 Einrichten');
neu(); uhr('2027-01-11 08:00');
G.einrichten();
pruefe(trigger.length === 5, '5 Zeitpläne angelegt (sind ' + trigger.length + ')');
pruefe(trigger.map(t => t.fn).sort().join() === 'monatsAnfang,monatsReportEntwuerfe,pruefeRueckrufe,taeglich,wochenMail', 'richtige Funktionen in Zeitplänen');
G.einrichten();
pruefe(trigger.length === 5, 'zweimal Einrichten → trotzdem 5 Zeitpläne');
const key = G.einst_().schluessel;
pruefe(/^[0-9a-f]{24}$/.test(key), 'Schlüssel erzeugt');
pruefe(G.einst_().webapp_url.endsWith('/exec'), 'eingefügte /exec-Adresse bleibt (nicht /dev)');
pruefe(alerts[alerts.length - 1].includes('Alles bereit'), 'Hinweis „Alles bereit“');

// ================================================================ 1b Checkliste
console.log('1b Checkliste');
const ckKopf = () => blaetter.Checkliste.z[0].filter(x => x !== '');
pruefe(ckKopf().join() === 'Schritt,Aufgabe,Wer,muster-solartechnik,alt-gmbh', 'Einrichten legt für jeden Kunden eine Spalte an');
pruefe(blaetter.Checkliste.z[1][3] === '=IFERROR(COUNTIF(D3:D' + (KOPF.Checkliste + 2) + ',"Ja")/' + KOPF.Checkliste + ',0)', 'Fortschritt-Formel stimmt');
blaetter.Kunden.appendRow(KOPF.Kunden.map(h => (h === 'Kürzel' ? 'Neu-Kunde' : h === 'E-Mail für Anfragen' ? 'n@x.de' : '')));
G.onEdit({ range: blaetter.Kunden.getRange(4, 1) });
pruefe(ckKopf().slice(-1)[0] === 'neu-kunde' && blaetter.Checkliste.z[0].indexOf('neu-kunde') === 5, 'neuer Kunde eingefügt → Spalte F von selbst');
G.onEdit({ range: blaetter.Kunden.getRange(4, 2) });
pruefe(ckKopf().length === 6, 'keine doppelte Spalte');
G.onEdit({ range: blaetter.Anfragen.getRange(2, 1) });
pruefe(ckKopf().length === 6, 'Änderung in anderen Blättern: nichts');
blaetter.Kunden.z.splice(3, 1);

// ================================================================ 2 Neue Anfragen
console.log('2 Neue Anfragen');
uhr('2027-01-11 09:00'); // Montag
pruefe(post(netlify('n1', { name: 'Anna Beispiel' }), 'falsch').text === 'falscher Schlüssel', 'falscher Schlüssel wird abgelehnt');
pruefe(anfragen().length === 0, 'ohne Schlüssel keine Zeile');
let r = post(netlify('n1', { kunde: 'muster-solartechnik', name: 'Anna Beispiel', telefon: '0151 2345678', plz: '12345', email: 'anna@x.de',
  eigentuemer: 'Einfamilienhaus', verbrauch_kwh: '5200', utm_source: 'meta', utm_campaign: 'pv-w2',
  stromrechnung: { filename: 'r.jpg', url: 'https://netlify.example/r.jpg' } }));
pruefe(r.text === 'ok', 'Anfrage angenommen');
let a = anfragen()[0];
pruefe(a && a.Kunde === 'muster-solartechnik' && a.Stand === 'neu' && a.Quelle === 'Meta' && a.Seite === 'Wirtschaftlichkeit', 'Zeile richtig: Kunde, Stand neu, Quelle Meta, Seite');
pruefe(a.Details.includes('Verbrauch kWh/Jahr: 5200') && a.Details.includes('https://drive.google.com/file/d/'), 'Details + Stromrechnung im Drive');
pruefe(dateien.length === 1 && dateien[0].ordner === 'Stromrechnungen' && dateien[0].name.startsWith('Stromrechnung Anna Beispiel'), 'Stromrechnung im Unterordner gespeichert');
let m = mails[mails.length - 1];
pruefe(m.to === 'kunde@muster.de' && /Neue Anfrage: Anna Beispiel, 12345/.test(m.subject), 'Mail an den Kunden mit Name und PLZ');
pruefe(m.htmlBody.includes('href="tel:01512345678"'), 'Telefonnummer zum Antippen');
const linkZurueck = knopfLink(m.htmlBody, 'Zurückgerufen');
pruefe(linkZurueck && linkZurueck.startsWith('https://script.google.com/macros/s/ABC/exec?id=n1&t='), 'Knopf „Zurückgerufen“ zeigt auf /exec');
pruefe(m.name === 'Muster Solartechnik · Anfragen' && m.replyTo === 'ich@agentur.de', 'Absendername Betrieb, Antwort an dich');
ohneUndefined(m.htmlBody + m.body + m.subject, 'Anfrage-Mail');
pruefe(post(netlify('n1', { kunde: 'muster-solartechnik', name: 'Anna Beispiel' })).text === 'doppelt', 'gleiche Anfrage zweimal → nur einmal');
// flaches Format ohne „data“, Kunde nur aus der Adresse, Google-Klick
r = post({ id: 'n2', form_name: 'rechner', site_url: 'https://muster-solartechnik.netlify.app', name: 'Bernd Flach', telefon: '0170 1', plz: '54321', gclid: 'abc' });
a = anfragen().find(x => x.ID === 'n2');
pruefe(a && a.Kunde === 'muster-solartechnik' && a.Quelle === 'Google' && a.Seite === 'Rechner', 'flaches Format + Kunde aus Netlify-Adresse + Quelle Google');
// unbekannter und inaktiver Kunde → an dich
post(netlify('n3', { kunde: 'gibts-nicht', name: 'Carla', telefon: '1' }));
pruefe(mails[mails.length - 1].to === 'ich@agentur.de' && mails[mails.length - 1].subject.includes('UNBEKANNT'), 'unbekannter Kunde → Mail an dich');
post(netlify('n4', { kunde: 'alt-gmbh', name: 'Dora', telefon: '1' }));
pruefe(mails[mails.length - 1].to === 'ich@agentur.de' && mails[mails.length - 1].subject.includes('NICHT AKTIV'), 'inaktiver Kunde → Mail an dich');
pruefe(post(netlify('n5', { kunde: 'muster-solartechnik' })).text === 'leer', 'leere Einsendung wird ignoriert');
// kaputter Datei-Link → kein Absturz
post(netlify('n6', { kunde: 'muster-solartechnik', name: 'Emil', telefon: '2', stromrechnung: 'https://kaputt.example/x.jpg' }));
pruefe(anfragen().find(x => x.ID === 'n6').Details.includes('https://kaputt.example/x.jpg'), 'Datei nicht ladbar → Original-Link bleibt');

// ================================================================ 3 Erinnerung nach 60 Geschäftsminuten
console.log('3 Erinnerung');
let vorher = mails.length;
uhr('2027-01-11 09:40'); G.pruefeRueckrufe();
pruefe(mails.length === vorher, 'nach 40 Minuten noch keine Erinnerung');
uhr('2027-01-11 10:05'); G.pruefeRueckrufe();
const erinnerungen = mails.slice(vorher);
pruefe(erinnerungen.some(x => x.to === 'kunde@muster.de' && /Anna Beispiel wartet seit 6\d Minuten/.test(x.subject)), 'Erinnerung an den Kunden');
pruefe(erinnerungen.some(x => x.to === 'ich@agentur.de' && x.subject.includes('ohne Rückruf')), 'Hinweis an dich');
pruefe(!erinnerungen.some(x => x.to !== 'ich@agentur.de' && x.subject.includes('Carla')), 'unbekannter Kunde: Hinweis nur an dich');
vorher = mails.length; G.pruefeRueckrufe();
pruefe(mails.length === vorher, 'nur einmal erinnern');
// Anfrage am Samstagabend → Minuten zählen erst ab Montag 8 Uhr
uhr('2027-01-16 22:00'); post(netlify('w1', { kunde: 'muster-solartechnik', name: 'Wochenende Wanda', telefon: '3' }));
uhr('2027-01-17 12:00'); vorher = mails.length; G.pruefeRueckrufe();
pruefe(mails.length === vorher, 'Sonntag: keine Erinnerung');
uhr('2027-01-18 08:40'); G.pruefeRueckrufe();
pruefe(!mails.slice(vorher).some(x => x.subject.includes('Wanda')), 'Montag 8:40: 40 Geschäftsminuten → noch keine');
uhr('2027-01-18 09:05'); G.pruefeRueckrufe();
pruefe(mails.slice(vorher).some(x => x.subject.includes('Wanda wartet seit 65 Minuten')), 'Montag 9:05: 65 Geschäftsminuten → Erinnerung');

// ================================================================ 4 Knöpfe
console.log('4 Knöpfe');
uhr('2027-01-11 10:20');
let seite = klick(linkZurueck);
pruefe(seite.html.includes('name="ok" value="1"') && seite.html.includes('Zurückgerufen ✓ eintragen'), 'erster Klick zeigt nur Bestätigung (Schutz vor Link-Scannern)');
pruefe(anfragen().find(x => x.ID === 'n1').Stand === 'neu', 'ohne Bestätigung ändert sich nichts');
seite = klick(linkZurueck, { ok: '1' });
a = anfragen().find(x => x.ID === 'n1');
pruefe(seite.html.includes('Gespeichert') && a.Stand === 'erreicht', 'bestätigt → Stand erreicht');
pruefe(a['Minuten bis Rückruf'] === 80 && a['Zurückgerufen'] instanceof FDate, 'Minuten bis Rückruf = 80');
pruefe(klick(linkZurueck.replace(/t=[^&]+/, 't=falsch'), { ok: '1' }).html.includes('nicht (mehr) gültig'), 'falscher Schlüssel im Link → abgelehnt');
const basis = linkZurueck.replace('s=zurueckgerufen', 's=');
klick(basis + 'termin', { ok: '1' });
pruefe(anfragen().find(x => x.ID === 'n1').Stand === 'Termin', 'Termin');
klick(basis + 'nicht-erreicht', { ok: '1' });
pruefe(anfragen().find(x => x.ID === 'n1').Stand === 'Termin', 'Stand geht nicht zurück (Termin bleibt)');
seite = klick(basis + 'auftrag');
pruefe(seite.html.includes('name="w"'), 'Auftrag fragt nach dem Auftragswert');
uhr('2027-01-25 11:00'); vorher = mails.length;
klick(basis + 'auftrag', { ok: '1', w: '18.500' });
a = anfragen().find(x => x.ID === 'n1');
pruefe(a.Stand === 'Auftrag' && a['Auftragswert €'] === 18500 && a['Auftrag am'] instanceof FDate, 'Auftrag mit Wert 18.500 € und Datum');
m = mails.slice(vorher).find(x => x.subject.includes('Erster Auftrag'));
pruefe(m && m.to === 'ich@agentur.de' && m.subject.includes('Februar 2027') && m.htmlBody.includes('1.500 €'), 'Mail „Erster Auftrag“ an dich: Monatsgebühr ab Februar, 1.500 €');
const n2 = anfragen().find(x => x.ID === 'n2');
vorher = mails.length;
klick(`https://script.google.com/macros/s/ABC/exec?id=n2&t=${n2['Schlüssel']}&s=auftrag`, { ok: '1' });
pruefe(!mails.slice(vorher).some(x => x.subject.includes('Erster Auftrag')), 'zweiter Auftrag → keine zweite „Erster Auftrag“-Mail');
klick(`https://script.google.com/macros/s/ABC/exec?id=n6&t=${anfragen().find(x => x.ID === 'n6')['Schlüssel']}&s=kein-interesse`, { ok: '1' });
pruefe(anfragen().find(x => x.ID === 'n6').Stand === 'kein Interesse', 'kein Interesse');
klick(`https://script.google.com/macros/s/ABC/exec?id=n6&t=${anfragen().find(x => x.ID === 'n6')['Schlüssel']}&s=termin`, { ok: '1' });
pruefe(anfragen().find(x => x.ID === 'n6').Stand === 'Termin', 'nach „kein Interesse“ doch Termin → geht');
pruefe(G.doGet({ parameter: {} }).html.includes('in Ordnung'), 'Adresse ohne Parameter → freundliche Seite');

// ================================================================ 5 Wochen-Mail
console.log('5 Wochen-Mail');
uhr('2027-01-25 08:00'); vorher = mails.length;
G.wochenMail();
const woche = mails.slice(vorher);
m = woche.find(x => x.to === 'kunde@muster.de');
pruefe(m && /offenen Anfragen \(\d\)/.test(m.subject), 'Kunde bekommt seine offenen Anfragen');
pruefe(m && m.htmlBody.includes('Wochenende Wanda') && !m.htmlBody.includes('Anna Beispiel'), 'offene drin, Aufträge nicht');
pruefe(m && knopfLink(m.htmlBody, 'Termin vereinbart') && knopfLink(m.htmlBody, 'Auftrag unterschrieben'), 'Knöpfe Termin und Auftrag');
pruefe(!woche.some(x => x.to === 'alt@x.de'), 'inaktiver Kunde bekommt nichts');
pruefe(woche.some(x => x.to === 'ich@agentur.de' && x.htmlBody.includes('noch nie angerufen')), 'Übersicht an dich mit „noch nie angerufen“');
ohneUndefined(woche.map(x => x.htmlBody + x.body).join(''), 'Wochen-Mails');

// ================================================================ 6 Monatsanfang und Reports
console.log('6 Monatsanfang und Reports');
uhr('2027-02-01 07:00'); vorher = mails.length;
G.monatsAnfang();
m = mails.slice(vorher)[0];
pruefe(m && m.to === 'ich@agentur.de' && m.subject.includes('Werbekosten') && m.subject.includes('Rechnung'), 'Monatsanfang: Werbekosten + Rechnung');
pruefe(m && m.htmlBody.includes('Januar 2027') && m.htmlBody.includes('Monatsgebühr 1.500 €'), 'nennt Januar und Monatsgebühr');
blaetter.Werbekosten.appendRow([berlin('2027-01-01 00:00'), 'muster-solartechnik', 2100, 899.5, '']);
uhr('2027-02-03 07:00'); vorher = mails.length;
G.monatsReportEntwuerfe();
const e = entwuerfe[entwuerfe.length - 1];
pruefe(e && e.to === 'kunde@muster.de' && e.subject === 'Ihr Monatsreport Januar 2027', 'Entwurf für den Kunden');
const jan = anfragen().filter(x => x.Kunde === 'muster-solartechnik' && x.Eingang.getMonth() === 0);
pruefe(e.body.includes('Werbeausgaben: 3.000 €') && e.body.includes('Anfragen: ' + jan.length), 'Werbekosten 3.000 € und Zahl der Anfragen');
pruefe(e.body.includes('Aufträge: 2') && e.body.includes('Hallo Herr Muster'), 'Aufträge und Anrede');
ohneUndefined(e.body, 'Report');
pruefe(mails.slice(vorher).some(x => x.subject.includes('Monatsreports liegen als Entwurf')), 'Hinweis an dich: Entwürfe liegen bereit');
uhr('2027-03-01 07:00'); vorher = mails.length; G.monatsAnfang();
pruefe(mails.slice(vorher).some(x => x.htmlBody.includes('Rechnungen für März 2027')), 'auch im März: Rechnung Monatsgebühr');

// ================================================================ 7 Verlosung und Akquise
console.log('7 Verlosung und Akquise');
neu(); uhr('2027-01-11 08:00'); G.einrichten();
const v = (id, aktion, name, tel, tag) => { uhr(tag); post(netlify(id, { kunde: 'muster-solartechnik', aktion, name, telefon: tel })); };
v('v1', 'verlosung-modul', 'Moritz', '0151 1', '2027-01-12 10:00');
v('v2', 'verlosung-modul', 'Mona', '0151 2', '2027-01-13 10:00');
['Rita', 'Rolf', 'Rosa', 'Ruth'].forEach((n, i) => v('r' + i, 'verlosung-rabatt', n, '0160 ' + i, '2027-01-14 10:00'));
v('r9', 'verlosung-rabatt', 'Rita doppelt', '0160 0', '2027-01-14 11:00');
v('zu-spaet', 'verlosung-modul', 'Zu Spät', '0151 9', '2027-01-17 10:00');
blaetter.Akquise.appendRow(['Sonnendach GmbH', 'Herr Licht', 'Hamburg', '040 123', '', '', 'neu', berlin('2027-01-20 00:00'), 'Max', 'morgens']);
blaetter.Akquise.appendRow(['Fertig GmbH', '', '', '1', '', '', 'Kunde', berlin('2027-01-19 00:00'), '', '']);
blaetter.Akquise.appendRow(['Später GmbH', '', '', '1', '', '', 'neu', berlin('2027-02-19 00:00'), '', '']);
uhr('2027-01-20 07:00'); vorher = mails.length;
G.taeglich();
const zieh = mails.slice(vorher).find(x => x.subject.includes('Verlosung'));
pruefe(zieh && zieh.to === 'kunde@muster.de,ich@agentur.de', 'Gewinner-Mail an Kunde und dich');
pruefe(zieh && zieh.htmlBody.includes('Verlosung Modul (2 Teilnehmer, 1 Gewinner)'), 'Modul: 2 Teilnehmer (zu spät zählt nicht)');
pruefe(zieh && zieh.htmlBody.includes('Verlosung Rabatt (4 Teilnehmer, 3 Gewinner)'), 'Rabatt: doppelte Telefonnummer zählt einmal');
pruefe(zieh && (zieh.htmlBody.match(/<li>/g) || []).length === 4 && !zieh.htmlBody.includes('Zu Spät'), '1 + 3 Gewinner, kein Nachzügler');
const akq = mails.slice(vorher).find(x => x.subject.startsWith('Heute anrufen'));
pruefe(akq && akq.subject === 'Heute anrufen: 1 Betrieb' && akq.htmlBody.includes('Sonnendach') && !akq.htmlBody.includes('Fertig'), 'Akquise: nur wer heute dran ist');
vorher = mails.length; G.taeglich();
pruefe(!mails.slice(vorher).some(x => x.subject.includes('Verlosung')), 'nicht zweimal ziehen');

// ================================================================ 8 Test-Anfrage und Fehler
console.log('8 Test-Anfrage und Fehlerfall');
neu(); uhr('2027-01-11 10:00'); G.einrichten(); vorher = mails.length;
G.testAnfrage();
pruefe(anfragen().some(x => x.Name === 'TEST Anna Beispiel') && mails.slice(vorher).some(x => x.to === 'kunde@muster.de'), 'Test-Anfrage aus dem Menü');
blaetter.Anfragen.z[0][blaetter.Anfragen.z[0].indexOf('Stand')] = 'Status';
vorher = mails.length; G.pruefeRueckrufe();
pruefe(mails.slice(vorher).some(x => x.subject.includes('Fehler') && /Spalte „Stand“/.test(x.body)), 'umbenannte Spalte → Fehler-Mail an dich');

console.log(`\n${ok} bestanden, ${fehler} fehlgeschlagen`);
process.exit(fehler ? 1 : 0);
