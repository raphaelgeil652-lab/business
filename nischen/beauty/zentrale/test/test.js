#!/usr/bin/env node
/* Testlauf für nischen/beauty/zentrale/Code.gs ohne Google: Tabellen, Kalender, Mails, Zeitpläne und Uhrzeit werden nachgebaut.
 * Aufruf (aus dem Repo-Hauptordner):  node nischen/beauty/zentrale/test/test.js
 * Die Spaltennamen kommen aus zentrale-bauen.py --kopf, damit Tabelle und Code nicht auseinanderlaufen. */
'use strict';
process.env.TZ = 'Europe/Berlin';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { execFileSync } = require('child_process');
const crypto = require('crypto');

const HIER = path.resolve(__dirname, '..');
const KOPF = JSON.parse(execFileSync('python3', [path.join(HIER, 'zentrale-bauen.py'), '--kopf'], { encoding: 'utf8' }));
const TZ = 'Europe/Berlin';

let ok = 0, fehler = 0;
let DEUTSCH = false;
function pruefe(bed, was) { if (bed) { ok++; } else { fehler++; console.log('  ✗ ' + was); } }

// ---------------------------------------------------------------- Uhr
let JETZT = 0;
class FDate extends Date {
  constructor(...a) { if (a.length === 0) super(JETZT); else super(...a); }
  static now() { return JETZT; }
}
function berlin(s) { return new FDate(s.replace(' ', 'T') + ':00+01:00'); }
function uhr(s) { JETZT = berlin(s).getTime(); }
function weiter(min) { JETZT += min * 60000; }

// ---------------------------------------------------------------- Google nachgebaut
class Blatt {
  constructor(name, zeilen) { this.name = name; this.z = zeilen; this.text = new Set(); }
  wert(r, c, v) { return typeof v === 'string' && /^\d+$/.test(v) && !this.text.has(r + ',' + c) ? Number(v) : v; }
  getLastRow() { return this.letzte(); }
  getLastColumn() { return Math.max(0, ...this.z.map(r => r.length)); }
  getMaxRows() { return Math.max(1000, this.z.length); }
  letzte() { for (let i = this.z.length - 1; i >= 0; i--) if (this.z[i].some(v => v !== '' && v != null)) return i + 1; return 0; }
  getDataRange() {
    const n = this.letzte(), b = Math.max(0, ...this.z.slice(0, n).map(r => r.length));
    return { getValues: () => this.z.slice(0, n).map(r => { const c = r.slice(); while (c.length < b) c.push(''); return c; }) };
  }
  getName() { return this.name; }
  appendRow(a) { const r = this.letzte() + 1; this.z.splice(r - 1, 0, a.map((v, i) => this.wert(r, i + 1, v))); }
  getRange(r, c, nr = 1, nc = 1) {
    return {
      setValues: w => w.forEach((zeile, i) => zeile.forEach((v, j) => {
        const rr = r + i, cc = c + j; while (this.z.length < rr) this.z.push([]);
        const row = this.z[rr - 1]; while (row.length < cc) row.push(''); row[cc - 1] = this.wert(rr, cc, v);
      })),
      getValues: () => { const out = []; for (let i = 0; i < nr; i++) { const row = this.z[r - 1 + i] || []; out.push(Array.from({ length: nc }, (_, j) => row[c - 1 + j] ?? '')); } return out; },
      setValue: v => { while (this.z.length < r) this.z.push([]); const row = this.z[r - 1]; while (row.length < c) row.push(''); row[c - 1] = v; },
      setFormula: f => { while (this.z.length < r) this.z.push([]); const row = this.z[r - 1]; while (row.length < c) row.push(''); row[c - 1] = f; },
      getDisplayValue: () => { const f = String((this.z[r - 1] || [])[c - 1] || ''); return DEUTSCH && /^=.*,/.test(f) ? '#ERROR!' : f; },
      setNumberFormat: f => { for (let i = 0; i < nr; i++) for (let j = 0; j < nc; j++) { const k = (r + i) + ',' + (c + j); if (f === '@') this.text.add(k); else this.text.delete(k); } },
      getSheet: () => this,
      getValue: () => (this.z[r - 1] || [])[c - 1]
    };
  }
}

// Kalender: id → [{id, titel, start, ende, ganztags, beschreibung}]
const kalender = {};
let kalNr = 0;
function kalObjekt(id) {
  return {
    getEvents: (von, bis) => (kalender[id] || []).filter(e => e.start < bis && e.ende > von).map(ev),
    createEvent: (titel, start, ende, opt) => { const e = { id: 'ev' + (++kalNr), titel, start, ende, ganztags: false, beschreibung: opt.description, ort: opt.location }; kalender[id].push(e); return ev(e); },
    getEventById: eid => { const e = (kalender[id] || []).find(x => x.id === eid); return e ? ev(e) : null; }
  };
  function ev(e) {
    return {
      getId: () => e.id, isAllDayEvent: () => e.ganztags, getStartTime: () => e.start, getEndTime: () => e.ende,
      getAllDayStartDate: () => e.start, getAllDayEndDate: () => e.ende, getTransparency: () => e.frei ? 'TRANSPARENT' : 'OPAQUE',
      deleteEvent: () => { kalender[id] = kalender[id].filter(x => x !== e); }
    };
  }
}
const abonniert = new Set();

const blaetter = {};
const mails = [], entwuerfe = [], alerts = [];
let trigger = [], props = {}, cache = {}, quota = 90;

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
    flush: () => {},
    getActive: () => ({ getSheetByName: n => blaetter[n] || null, getUrl: () => 'https://docs.google.com/spreadsheets/d/ZENTRALE' }),
    getUi: () => ({
      alert: (...a) => alerts.push(a.join(' | ')), ButtonSet: { OK: 'OK' },
      createMenu: () => { const m = { addItem: () => m, addSeparator: () => m, addToUi: () => m }; return m; }
    })
  },
  MailApp: { sendEmail: (o, sub, body) => { quota--; mails.push(typeof o === 'object' ? o : { to: o, subject: sub, body }); }, getRemainingDailyQuota: () => quota },
  GmailApp: { createDraft: (to, subject, body, opt) => entwuerfe.push({ to, subject, body, opt }) },
  CalendarApp: {
    getCalendarById: id => (kalender[id] && abonniert.has(id) ? kalObjekt(id) : null),
    subscribeToCalendar: id => { if (!kalender[id]) throw new Error('kein Zugriff'); abonniert.add(id); return kalObjekt(id); }
  },
  CacheService: { getScriptCache: () => ({ get: k => cache[k] || null, put: (k, v) => { cache[k] = v; }, removeAll: ks => ks.forEach(k => delete cache[k]) }) },
  ScriptApp: {
    WeekDay: { MONDAY: 'MONDAY' },
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
  Utilities: { getUuid: () => crypto.randomUUID(), formatDate, newBlob: (inhalt, typ, name) => ({ inhalt, typ, name }) },
  Session: { getScriptTimeZone: () => TZ, getEffectiveUser: () => ({ getEmail: () => 'besitzer@gmail.com' }) },
  LockService: { getScriptLock: () => ({ waitLock: () => {}, releaseLock: () => {} }) },
  PropertiesService: { getScriptProperties: () => ({ getProperty: k => props[k] || null, setProperty: (k, v) => { props[k] = v; } }) },
  HtmlService: { createHtmlOutput: h => { const o = { html: h, setTitle: () => o, addMetaTag: () => o }; return o; } },
  ContentService: { MimeType: { JSON: 'json' }, createTextOutput: t => { const o = { text: t, setMimeType: () => o }; return o; } },
  UrlFetchApp: {
    fetch: url => {
      const name = decodeURIComponent((url.match(/name=([^&]+)/) || [])[1] || '');
      const antwort = name === 'nichtda-xyz.de' ? { Status: 3 } : name === 'ohnepost.de' ? { Status: 0 } : { Status: 0, Answer: [{ data: 'mx' }] };
      return { getResponseCode: () => 200, getContentText: () => JSON.stringify(antwort) };
    }
  }
};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(HIER, 'Code.gs'), 'utf8'), ctx, { filename: 'Code.gs' });
const G = ctx;

// ---------------------------------------------------------------- Tabellen anlegen (wie nach dem Import)
function neu() {
  for (const k of Object.keys(blaetter)) delete blaetter[k];
  for (const k of Object.keys(kalender)) delete kalender[k];
  abonniert.clear();
  mails.length = 0; entwuerfe.length = 0; alerts.length = 0; trigger = []; props = {}; cache = {}; quota = 90;
  const werte = {
    agentur_name: 'Clickculture', agentur_inhaber: 'Max Beispiel', agentur_email: 'ich@agentur.de', agentur_steuernr: '12/345/67890', agentur_kleinunternehmer: 'Nein',
    bestaetigung_minuten: 45, erinnerung_stunden: 24, raster_minuten: 30, max_unbestaetigt: 6, mail_warnung_ab: 25,
    benachrichtigung_an: 'ich@agentur.de,tom@agentur.de', team: 'Max = ich@agentur.de; Tom Beispiel = tom@agentur.de', geschaeftszeiten: '9-18', arbeitstage: 'Mo-Sa', rueckruf_minuten: 60,
    kopie_jeder_anfrage: 'Nein', akquise_erinnerung: 'Ja', webapp_url: 'https://script.google.com/macros/s/ABC/exec', schluessel: ''
  };
  blaetter.Einstellungen = new Blatt('Einstellungen', [['Schlüssel', 'Einstellung', 'Eintrag', 'Hilfe'], ['', 'Abschnitt', '', '']]
    .concat(KOPF.Einstellungen.map(k => [k, k, k in werte ? werte[k] : '', ''])));
  for (const n of ['Kunden', 'Termine', 'Sperrliste', 'Werbekosten', 'Akquise']) blaetter[n] = new Blatt(n, [KOPF[n].slice()]);
  blaetter.Checkliste = new Blatt('Checkliste', [['Schritt', 'Aufgabe', 'Wer'], ['', 'Fortschritt', '']]
    .concat(Array.from({ length: KOPF.Checkliste }, (_, i) => ['4', 'Aufgabe ' + (i + 1), 'Du'])));
  const kunde = o => blaetter.Kunden.appendRow(KOPF.Kunden.map(h => (h in o ? o[h] : '')));
  kalender['studio@laser.de'] = [];
  kunde({ 'Kürzel': 'muster-laser', 'Betrieb': 'Muster Laserstudio', 'Anrede für Mails': 'Frau Muster', 'E-Mail für Termine': 'studio@laser.de',
    'Telefon': '07552 12345', 'Adresse': 'Hauptstraße 1, 88630 Pfullendorf', 'Seiten-Adresse': 'https://muster-laser.netlify.app/',
    'Monatsgebühr €': 899, 'Live seit': berlin('2026-12-01 00:00'), 'Aktiv': 'Ja', 'Behandlung': 'Laser', 'Buchung': 'Kalender',
    'Kalender-ID': 'studio@laser.de', 'Buchbare Zeiten': 'Mo-Fr 9-18; Sa 10-14', 'Beratung Minuten': 20,
    'Leistungen': 'Achseln | 20 | 89 €; Beine komplett | 60 | 249 €', 'Puffer Minuten': 0, 'Vorlauf Stunden': 12, 'Tage im Voraus': 14,
    'Absagefrist Stunden': 24, 'Ausfallregel': 'Bei späterer Absage berechnen wir 30 €.', 'Vorbereitung': 'Am Vortag rasieren • 2 Wochen vorher keine Sonne',
    'Teilnahmeschluss': berlin('2027-01-15 00:00'), 'Ziehung am': berlin('2027-01-20 00:00'), 'Betreuer': 'Tom' });
  kunde({ 'Kürzel': 'muster-pmu', 'Betrieb': 'Muster Brows', 'Anrede für Mails': 'Frau Brow', 'E-Mail für Termine': 'brows@pmu.de', 'Telefon': '0151 99999999',
    'Adresse': 'Weg 2, 12345 Musterstadt', 'Seiten-Adresse': 'https://muster-pmu.netlify.app', 'Aktiv': 'Ja', 'Behandlung': 'Permanent Make-up',
    'Buchung': 'Wunschtermin', 'Buchbare Zeiten': 'Di, Do 10-16', 'Beratung Minuten': 30, 'Leistungen': 'Powder Brows | 150 | 390 €',
    'Vorlauf Stunden': 24, 'Tage im Voraus': 21, 'Absagefrist Stunden': 48, 'Vorbereitung': '' });
  kunde({ 'Kürzel': 'alt-gmbh', 'Betrieb': 'Alt GmbH', 'E-Mail für Termine': 'alt@x.de', 'Aktiv': 'Nein' });
}
const termine = () => { const v = blaetter.Termine.getDataRange().getValues(), k = v[0]; return v.slice(1).map(r => Object.fromEntries(k.map((h, i) => [h, r[i]]))); };
const termin = id => termine().find(x => x.ID === id);
const get = p => JSON.parse(G.doGet({ parameter: p }).text);
const post = d => JSON.parse(G.doPost({ parameter: {}, postData: { contents: JSON.stringify(d) } }).text);
const webhook = (body, key = null) => G.doPost({ parameter: { key: key || G.einst_().schluessel }, postData: { contents: JSON.stringify(body) } });
const buche = (o = {}) => post(Object.assign({ a: 'buchen', kunde: 'muster-laser', art: 'beratung', name: 'Anna Beispiel', telefon: '0151 23456781',
  email: 'anna@beispiel.de', ms: 25000, hp: '', utm_source: 'meta', utm_campaign: 'laser-l1' }, o));
const knopfLink = (html, text) => { const m = html.match(new RegExp('<a href="([^"]+)"[^>]*>' + text + '</a>')); return m ? m[1].replace(/&amp;/g, '&') : null; };
const linkMit = (html, teil) => { const m = html.match(new RegExp('href="([^"]*' + teil + '[^"]*)"')); return m ? m[1].replace(/&amp;/g, '&') : null; };
const klick = (url, extra = {}) => G.doGet({ parameter: Object.assign(Object.fromEntries(new URL(url).searchParams), extra) });
const parameter = url => Object.fromEntries(new URL(url).searchParams);
const ohneUndefined = (t, was) => pruefe(!/undefined|NaN|\[object|null/.test(t), was + ': kein „undefined/NaN/null“ im Text');
const letzte = () => mails[mails.length - 1];

// ================================================================ 1 Einrichten und Checkliste
console.log('1 Einrichten');
neu(); uhr('2027-01-11 08:00');
G.einrichten();
pruefe(trigger.length === 6, '6 Zeitpläne angelegt (sind ' + trigger.length + ')');
pruefe(trigger.map(t => t.fn).sort().join() === 'abendMail,alle10Minuten,monatsAnfang,monatsReportEntwuerfe,taeglich,wochenMail', 'richtige Funktionen');
G.einrichten();
pruefe(trigger.length === 6, 'zweimal Einrichten → trotzdem 6');
pruefe(/^[0-9a-f]{24}$/.test(G.einst_().schluessel), 'Schlüssel erzeugt');
pruefe(alerts[alerts.length - 1].includes('Alles bereit'), 'Hinweis „Alles bereit“');
const ckKopf = () => blaetter.Checkliste.z[0].filter(x => x !== '');
pruefe(ckKopf().join() === 'Schritt,Aufgabe,Wer,muster-laser,muster-pmu,alt-gmbh', 'Checkliste: Spalte je Kunde');
DEUTSCH = true;
blaetter.Kunden.appendRow(KOPF.Kunden.map(h => (h === 'Kürzel' ? 'de-kunde' : h === 'E-Mail für Termine' ? 'd@x.de' : h === 'Aktiv' ? 'Nein' : '')));
G.onEdit({ range: blaetter.Kunden.getRange(5, 1) });
pruefe(/;"Ja"\)\/\d+;0\)$/.test(blaetter.Checkliste.z[1][blaetter.Checkliste.z[0].indexOf('de-kunde')]), 'deutsche Tabelle: Formel mit „;“');
DEUTSCH = false;

// ================================================================ 2 Buchbare Zeiten und freie Termine
console.log('2 Freie Termine');
const bz = G.buchbareZeiten_('Mo-Fr 9-18; Sa 10-14');
pruefe(JSON.stringify(bz[1]) === '[[540,1080]]' && JSON.stringify(bz[6]) === '[[600,840]]' && !bz[7], '„Mo-Fr 9-18; Sa 10-14“ richtig gelesen');
const bz2 = G.buchbareZeiten_('Di, Do 9:30-13 14-18');
pruefe(JSON.stringify(bz2[2]) === '[[570,780],[840,1080]]' && JSON.stringify(bz2[4]) === JSON.stringify(bz2[2]) && !bz2[3], '„Di, Do 9:30-13 14-18“ richtig gelesen');
pruefe(JSON.stringify(G.buchbareZeiten_('Montag bis Freitag 8.00–12.00 Uhr')[1]) === '[[480,720]]', 'ausgeschrieben „Montag bis Freitag 8.00–12.00 Uhr“ → nur Montag (bis = kein Bereich)');
uhr('2027-01-11 09:00'); // Montag
kalender['studio@laser.de'].push({ id: 'x1', titel: 'Kundin', start: berlin('2027-01-12 10:00'), ende: berlin('2027-01-12 11:00'), ganztags: false });
kalender['studio@laser.de'].push({ id: 'x2', titel: 'Urlaub', start: berlin('2027-01-13 00:00'), ende: berlin('2027-01-14 00:00'), ganztags: true });
kalender['studio@laser.de'].push({ id: 'x3', titel: 'Erinnerung (frei)', start: berlin('2027-01-12 15:00'), ende: berlin('2027-01-12 16:00'), ganztags: false, frei: true });
let r = get({ a: 'slots', k: 'muster-laser', art: 'beratung' });
pruefe(r.ok && r.dauer === 20 && r.modus === 'Kalender', 'Slots-Antwort ok, Dauer 20, Modus Kalender');
pruefe(abonniert.has('studio@laser.de'), 'freigegebener Kalender wird von selbst abonniert');
pruefe(r.tage[0].datum === '2027-01-12' && r.tage[0].label === 'Di, 12.01.', 'Vorlauf 12 h: erster Tag ist Dienstag');
let di = r.tage[0].zeiten;
pruefe(di.includes('09:30') && !di.includes('10:00') && !di.includes('10:30') && di.includes('11:00'), 'Kalendertermin 10–11 Uhr ist belegt');
pruefe(di.includes('15:00') && di[di.length - 1] === '17:30', '„frei“ markierter Eintrag blockiert nicht · letzter Start 17:30');
pruefe(!r.tage.some(t => t.datum === '2027-01-13'), 'ganztägiger Urlaub: Mittwoch ganz weg');
const sa = r.tage.find(t => t.datum === '2027-01-16');
pruefe(sa && sa.zeiten[0] === '10:00' && sa.zeiten[sa.zeiten.length - 1] === '13:30', 'Samstag 10–14');
pruefe(!r.tage.some(t => t.datum === '2027-01-17'), 'Sonntag nicht buchbar');
pruefe(r.tage[r.tage.length - 1].datum <= '2027-01-25', 'höchstens 14 Tage im Voraus');
r = get({ a: 'slots', k: 'muster-laser', art: 'behandlung', l: 'Beine komplett' });
pruefe(r.ok && r.dauer === 60 && !r.tage[0].zeiten.includes('09:30') && r.tage[0].zeiten.includes('09:00'), 'Behandlung 60 Min.: 9:30 passt nicht vor 10 Uhr');
pruefe(!get({ a: 'slots', k: 'muster-laser', art: 'behandlung', l: 'Gibts nicht' }).ok, 'unbekannte Leistung → nicht buchbar');
pruefe(!get({ a: 'slots', k: 'alt-gmbh' }).ok && !get({ a: 'slots', k: 'quatsch' }).ok, 'inaktiver/unbekannter Kunde → keine Termine');
pruefe(cache['slots_muster-laser_beratung_20'], 'Slots kurz zwischengespeichert');

// ================================================================ 3 Buchen und Prüfungen
console.log('3 Buchen');
let vorher = mails.length;
r = buche({ hp: 'ich bin ein bot', start: '2027-01-12T09:00' });
pruefe(r.ok && termine().length === 0 && mails.length === vorher, 'Bot-Falle (Feld ausgefüllt): „ok“, aber nichts angelegt, keine Mail');
r = buche({ ms: 1200, start: '2027-01-12T09:00' });
pruefe(r.ok && termine().length === 0, 'zu schnell abgeschickt (1,2 s): nichts angelegt');
pruefe(props['bots_muster-laser_2027-01'] === '2', 'Bots gezählt (2)');
const fehlerFeld = (o, feld) => { const x = buche(Object.assign({ start: '2027-01-12T09:00' }, o)); return !x.ok && x.feld === feld; };
pruefe(fehlerFeld({ name: 'A' }, 'name') && fehlerFeld({ name: 'Anna' }, 'name') && fehlerFeld({ name: 'Test123 Bot' }, 'name') && fehlerFeld({ name: 'http://spam.ru' }, 'name'), 'Name: zu kurz, nur Vorname, Ziffern, Link → abgelehnt');
pruefe(fehlerFeld({ telefon: '123' }, 'telefon') && fehlerFeld({ telefon: '0151 11111111' }, 'telefon') && fehlerFeld({ telefon: '0151 23456789' }, 'telefon') && fehlerFeld({ telefon: '0123 4567' }, 'telefon'), 'Telefon: zu kurz, gleiche Ziffern, 123456…, Unsinn → abgelehnt');
pruefe(G.telefon_('0151 2345 6781') === '+4915123456781' && G.telefon_('+49 (0) 7552 9876') === '+4975529876' && G.telefon_('0041 79 312 45 67') === '+41793124567', 'Telefon wird vereinheitlicht (+49 …, Schweiz ok)');
pruefe(fehlerFeld({ email: 'anna@' }, 'email') && fehlerFeld({ email: 'x@mailinator.com' }, 'email') && fehlerFeld({ email: 'x@nichtda-xyz.de' }, 'email') && fehlerFeld({ email: 'x@ohnepost.de' }, 'email'), 'E-Mail: kaputt, Wegwerf, Domain gibt es nicht, kein Postfach → abgelehnt');
pruefe(termine().length === 0, 'nach allen Fehlern: keine Zeile');
pruefe(!buche({ start: '2027-01-12T10:00' }).ok, 'belegte Zeit (Kalender) → abgelehnt');
pruefe(!buche({ start: '2027-01-11T10:00' }).ok, 'Zeit im Vorlauf (heute) → abgelehnt');
pruefe(!buche({ start: '2027-01-12T09:15' }).ok, 'Zeit außerhalb des Rasters → abgelehnt');
vorher = mails.length;
r = buche({ start: '2027-01-12T09:00' });
let t = termin(r.id);
pruefe(r.ok && r.frist === 45 && t && t.Stand === 'unbestätigt', 'gültige Buchung → Zeile „unbestätigt“, Frist 45 Min.');
pruefe(t.Telefon === '+4915123456781' && t.Quelle === 'Meta' && t.Art === 'Beratung' && t.Leistung === 'Beratung' && t.Dauer === 20, 'Telefon vereinheitlicht, Quelle Meta, Art, Dauer');
pruefe(t.Termin instanceof FDate && t.Termin.getTime() === berlin('2027-01-12 09:00').getTime(), 'Termin-Zeit richtig gespeichert');
pruefe(kalender['studio@laser.de'].length === 3, 'noch NICHT im Kalender des Studios');
let m = letzte();
pruefe(mails.length === vorher + 1 && m.to === 'anna@beispiel.de' && m.subject === 'Bitte bestätigen: Ihr Termin am Di, 12.01.2027, 09:00 Uhr', 'Mail „Bitte bestätigen“ an die Kundin');
pruefe(m.name === 'Muster Laserstudio' && m.replyTo === 'studio@laser.de', 'Absender = Studio, Antwort geht ans Studio');
const bLink = linkMit(m.htmlBody, 'bestaetigen.html');
pruefe(bLink && bLink.startsWith('https://muster-laser.netlify.app/bestaetigen.html?id=' + r.id + '&t='), 'Bestätigungs-Link zeigt auf die Seite des Studios (ohne doppelten /)');
ohneUndefined(m.htmlBody + m.body, 'Bitte-bestätigen-Mail');
pruefe(!get({ a: 'slots', k: 'muster-laser', art: 'beratung' }).tage[0].zeiten.includes('09:00'), 'reservierter Platz ist für andere weg (Cache geleert)');
r = buche({ start: '2027-01-12T11:00', email: 'ANNA@beispiel.de', telefon: '0171 5556667' });
pruefe(!r.ok && /schon einen Termin am Di, 12\.01\.2027, 09:00 Uhr/.test(r.fehler), 'gleiche Person (E-Mail) bucht nochmal → Hinweis auf bestehenden Termin');
r = buche({ start: '2027-01-12T11:00', email: 'neu@beispiel.de', telefon: '+49 151 23456781' });
pruefe(!r.ok, 'gleiche Person (Telefon in anderer Schreibweise) → abgelehnt');
r = buche({ start: '2027-01-12T09:00', name: 'Bernd Zweiter', email: 'bernd@beispiel.de', telefon: '0160 7654329' });
pruefe(!r.ok && r.weg, 'gleicher Platz von jemand anderem → „gerade vergeben“');
pruefe(!buche({ kunde: 'alt-gmbh', start: '2027-01-12T09:00' }).ok, 'inaktiver Kunde → keine Buchung');

// ================================================================ 4 Bestätigen
console.log('4 Bestätigen');
const id1 = termine()[0].ID, kt1 = parameter(bLink).t;
pruefe(get({ a: 'info', id: id1, t: kt1 }).stand === 'unbestätigt', 'Info-Abfrage der Bestätigungsseite');
pruefe(!get({ a: 'info', id: id1, t: 'falsch' }).ok, 'Info mit falschem Schlüssel → abgelehnt');
pruefe(!post({ a: 'bestaetigen', id: id1, t: 'falsch' }).ok, 'Bestätigen mit falschem Schlüssel → abgelehnt');
pruefe(!post({ a: 'bestaetigen', id: id1, t: termin(id1)['Schlüssel'] }).ok, 'Studio-Schlüssel taugt nicht zum Bestätigen');
uhr('2027-01-11 09:20'); vorher = mails.length;
r = post({ a: 'bestaetigen', id: id1, t: kt1 });
t = termin(id1);
pruefe(r.ok && r.stand === 'Termin' && t.Stand === 'Termin' && t['Bestätigt am'] instanceof FDate, 'bestätigt → Stand „Termin“');
const ev1 = kalender['studio@laser.de'].find(e => e.id === t['Kalender-Eintrag']);
pruefe(ev1 && ev1.titel === 'Beratung: Anna Beispiel (online gebucht)' && ev1.start.getTime() === berlin('2027-01-12 09:00').getTime() &&
  ev1.ende.getTime() === berlin('2027-01-12 09:20').getTime(), 'Termin steht im Kalender des Studios (9:00–9:20)');
pruefe(ev1.beschreibung.includes('+4915123456781') && ev1.ort === 'Hauptstraße 1, 88630 Pfullendorf', 'Kalendereintrag mit Telefon und Adresse');
const neueMails = mails.slice(vorher);
const anKundin = neueMails.find(x => x.to === 'anna@beispiel.de'), anStudio = neueMails.find(x => x.to === 'studio@laser.de');
pruefe(anKundin && anKundin.subject === 'Bestätigt: Ihr Termin am Di, 12.01.2027, 09:00 Uhr', 'Bestätigung an die Kundin');
pruefe(anKundin.htmlBody.includes('Am Vortag rasieren') && anKundin.htmlBody.includes('2 Wochen vorher keine Sonne'), 'Bestätigung enthält die Vorbereitung');
pruefe(anKundin.htmlBody.includes('spätestens 24 Stunden vorher') && anKundin.htmlBody.includes('Bei späterer Absage berechnen wir 30 €.'), 'Absagefrist und Ausfallregel');
pruefe(linkMit(anKundin.htmlBody, 'absagen.html').startsWith('https://muster-laser.netlify.app/absagen.html?id=' + id1 + '&t=' + kt1), 'Absage-Link');
pruefe(anKundin.htmlBody.includes('google.com/maps/search'), 'Google-Maps-Link zum Studio');
const ics = anKundin.attachments && anKundin.attachments[0];
pruefe(ics && ics.name === 'termin.ics' && ics.inhalt.includes('DTSTART:20270112T080000Z') && ics.inhalt.includes('DTEND:20270112T082000Z'), 'Kalenderdatei .ics (Zeit in UTC richtig)');
pruefe(ics.inhalt.includes('LOCATION:Hauptstraße 1\\, 88630 Pfullendorf'), '.ics: Komma maskiert');
pruefe(anStudio && anStudio.subject === 'Neuer Online-Termin: Di, 12.01.2027, 09:00 Uhr · Beratung · Anna Beispiel', 'Mail an das Studio');
pruefe(knopfLink(anStudio.htmlBody, 'Fake melden') && anStudio.htmlBody.includes('steht schon in Ihrem Kalender'), 'Studio-Mail: Knopf „Fake melden“');
ohneUndefined(anKundin.htmlBody + anKundin.body + anStudio.htmlBody, 'Bestätigungs-Mails');
vorher = mails.length;
r = post({ a: 'bestaetigen', id: id1, t: kt1 });
pruefe(r.ok && r.schon && mails.length === vorher && kalender['studio@laser.de'].length === 4, 'zweiter Klick: nichts doppelt');

// ================================================================ 5 Nicht bestätigt → verfällt
console.log('5 Verfallen');
uhr('2027-01-11 10:00');
r = buche({ start: '2027-01-12T11:00', name: 'Clara Später', email: 'clara@beispiel.de', telefon: '0172 3344556' });
const id2 = r.id, kt2 = parameter(linkMit(letzte().htmlBody, 'bestaetigen.html')).t;
weiter(30); G.alle10Minuten();
pruefe(termin(id2).Stand === 'unbestätigt', 'nach 30 Min.: noch reserviert');
weiter(20); G.alle10Minuten();
pruefe(termin(id2).Stand === 'verfallen', 'nach 50 Min.: verfallen');
pruefe(get({ a: 'slots', k: 'muster-laser', art: 'beratung' }).tage[0].zeiten.includes('11:00'), 'Platz ist wieder frei');
r = post({ a: 'bestaetigen', id: id2, t: kt2 });
pruefe(r.ok && termin(id2).Stand === 'Termin', 'später doch bestätigt, Platz noch frei → geht');
uhr('2027-01-11 11:00');
r = buche({ start: '2027-01-12T11:30', name: 'Dora Zuspät', email: 'dora@beispiel.de', telefon: '0173 9988776' });
const id3 = r.id, kt3 = parameter(linkMit(letzte().htmlBody, 'bestaetigen.html')).t;
weiter(60); G.alle10Minuten();
buche({ start: '2027-01-12T11:30', name: 'Emil Schneller', email: 'emil@beispiel.de', telefon: '0174 1239876' });
r = post({ a: 'bestaetigen', id: id3, t: kt3 });
pruefe(!r.ok && r.neu && /vergeben/.test(r.fehler) && termin(id3).Stand === 'verfallen', 'verfallen und inzwischen vergeben → Hinweis, neu buchen');

// ================================================================ 6 Erinnerung 24 Stunden vorher
console.log('6 Erinnerung');
uhr('2027-01-11 12:00');
r = buche({ start: '2027-01-14T10:00', name: 'Frieda Vorab', email: 'frieda@beispiel.de', telefon: '0175 4455667' });
const id4 = r.id, kt4 = parameter(linkMit(letzte().htmlBody, 'bestaetigen.html')).t;
post({ a: 'bestaetigen', id: id4, t: kt4 });
uhr('2027-01-13 09:30'); vorher = mails.length; G.alle10Minuten();
pruefe(!mails.slice(vorher).some(x => x.to === 'frieda@beispiel.de'), '24,5 h vorher: noch keine Erinnerung');
uhr('2027-01-13 10:05'); G.alle10Minuten();
m = mails.slice(vorher).find(x => x.to === 'frieda@beispiel.de');
pruefe(m && m.subject === 'Erinnerung: Ihr Termin morgen um 10:00 Uhr' && m.htmlBody.includes('Am Vortag rasieren') && linkMit(m.htmlBody, 'absagen.html'), 'Erinnerung mit Vorbereitung und Absage-Link');
vorher = mails.length; weiter(10); G.alle10Minuten();
pruefe(!mails.slice(vorher).some(x => x.to === 'frieda@beispiel.de'), 'nur einmal erinnern');
pruefe(!termin(id1).Erinnert, 'kurzfristig gebuchter Termin (weniger als 24 h): keine extra Erinnerung');

// ================================================================ 7 Absagen
console.log('7 Absagen');
uhr('2027-01-13 11:00'); vorher = mails.length;
pruefe(!post({ a: 'absagen', id: id4, t: 'falsch' }).ok, 'Absagen mit falschem Schlüssel → abgelehnt');
r = post({ a: 'absagen', id: id4, t: kt4 });
pruefe(r.ok && r.kurzfristig && termin(id4).Stand === 'abgesagt' && termin(id4)['Abgesagt am'] instanceof FDate, 'abgesagt (kurzfristig, innerhalb 24 h)');
pruefe(!kalender['studio@laser.de'].some(e => e.titel.includes('Frieda')), 'aus dem Kalender gelöscht');
m = mails.slice(vorher).find(x => x.to === 'studio@laser.de');
pruefe(m && m.subject === 'Abgesagt: Frieda Vorab, Do, 14.01.2027, 10:00 Uhr (kurzfristig)', 'Studio bekommt die Absage');
pruefe(post({ a: 'absagen', id: id4, t: kt4 }).schon, 'zweimal absagen: kein Fehler');
pruefe(get({ a: 'slots', k: 'muster-laser', art: 'beratung' }).tage.find(x => x.datum === '2027-01-14').zeiten.includes('10:00'), 'Platz wieder buchbar');

// ================================================================ 8 Fake melden und Sperrliste
console.log('8 Fake melden');
uhr('2027-01-13 12:00');
r = buche({ start: '2027-01-15T15:00', name: 'Konkurrenz Fake', email: 'fake@konkurrenz.de', telefon: '0176 1112223' });
const id5 = r.id;
post({ a: 'bestaetigen', id: id5, t: parameter(linkMit(letzte().htmlBody, 'bestaetigen.html')).t });
const fakeLink = knopfLink(mails.slice(-2).find(x => x.to === 'studio@laser.de').htmlBody, 'Fake melden');
let seite = klick(fakeLink);
pruefe(seite.html.includes('name="ok" value="1"') && termin(id5).Stand === 'Termin', 'erster Klick nur Nachfrage (Schutz vor Link-Scannern)');
seite = klick(fakeLink, { ok: '1' });
pruefe(seite.html.includes('Gespeichert') && termin(id5).Stand === 'Fake', 'Fake gemeldet');
pruefe(!kalender['studio@laser.de'].some(e => e.titel.includes('Konkurrenz')), 'Fake-Termin aus dem Kalender gelöscht');
const sperre = blaetter.Sperrliste.getDataRange().getValues().slice(1).map(z => z[0]);
pruefe(sperre.includes('+4917611122 23'.replace(' ', '')) && sperre.includes('fake@konkurrenz.de'), 'Telefon und E-Mail auf der Sperrliste');
r = buche({ start: '2027-01-15T16:00', name: 'Konkurrenz Nochmal', email: 'anders@konkurrenz.de', telefon: '0176-111 2223' });
pruefe(!r.ok && /nicht möglich/.test(r.fehler) && /07552 12345/.test(r.fehler), 'gesperrte Nummer kann nicht mehr buchen (Hinweis: anrufen)');
blaetter.Sperrliste.appendRow(['gesperrt@x.de', '', 'von Hand', '']);
pruefe(!buche({ start: '2027-01-15T16:00', name: 'Gesperrt Person', email: 'gesperrt@x.de', telefon: '0177 2223334' }).ok, 'von Hand gesperrte E-Mail (für alle Studios)');
pruefe(!klick(fakeLink.replace(/t=[^&]+/, 't=falsch'), { ok: '1' }).html.includes('Gespeichert'), 'Knopf mit falschem Schlüssel → abgelehnt');

// ================================================================ 9 Flut-Schutz
console.log('9 Flut-Schutz');
uhr('2027-01-18 09:00'); vorher = mails.length;
const frei = get({ a: 'slots', k: 'muster-laser', art: 'beratung' }).tage[1];
const fl = frei.zeiten.slice(0, 7).map((z, i) => buche({ start: frei.datum + 'T' + z, name: 'Bot Nummer' + 'abcdefg'[i], email: 'b' + i + '@beispiel.de', telefon: '0151 2468' + (1350 + i * 7) }));
pruefe(fl.slice(0, 6).every(x => x.ok) && !fl[6].ok && /sehr viele/.test(fl[6].fehler), '6 unbestätigte in 30 Min. ok, die 7. wird abgewiesen');
pruefe(mails.slice(vorher).some(x => x.to === 'ich@agentur.de,tom@agentur.de' && x.subject.includes('Viele unbestätigte')), 'Warnung an dich');
const warnAnzahl = () => mails.filter(x => x.subject.includes('Viele unbestätigte')).length;
buche({ start: frei.datum + 'T' + frei.zeiten[8], name: 'Bot Neun', email: 'b9@beispiel.de', telefon: '0151 24689999' });
pruefe(warnAnzahl() === 1, 'Warnung nicht bei jedem Versuch');
weiter(60); G.alle10Minuten();
pruefe(termine().filter(x => x.Name.startsWith('Bot')).every(x => x.Stand === 'verfallen'), 'unbestätigte Bot-Buchungen verfallen, Plätze wieder frei');

// ================================================================ 10 Modus Wunschtermin
console.log('10 Wunschtermin');
uhr('2027-01-11 09:00');
r = get({ a: 'slots', k: 'muster-pmu', art: 'behandlung', l: 'Powder Brows' });
pruefe(r.ok && r.modus === 'Wunschtermin' && r.tage[0].datum === '2027-01-12' && r.tage[0].zeiten.join() === '10:00,10:30,11:00,11:30,12:00,12:30,13:00,13:30',
  'ohne Kalender: Zeiten aus „Di, Do 10-16“, 150 Min. passen bis 13:30');
r = buche({ kunde: 'muster-pmu', art: 'behandlung', leistung: 'Powder Brows', start: '2027-01-12T10:00', name: 'Gina Braue', email: 'gina@beispiel.de', telefon: '0151 7778889' });
const id6 = r.id;
pruefe(r.ok && termin(id6).Leistung === 'Powder Brows' && termin(id6).Dauer === 150, 'Behandlung direkt gebucht (150 Min.)');
pruefe(!get({ a: 'slots', k: 'muster-pmu', art: 'behandlung', l: 'Powder Brows' }).tage[0].zeiten.includes('12:00'), 'überschneidende Zeit ist belegt');
vorher = mails.length;
r = post({ a: 'bestaetigen', id: id6, t: parameter(linkMit(letzte().htmlBody, 'bestaetigen.html')).t });
pruefe(r.ok && r.stand === 'angefragt' && termin(id6).Stand === 'angefragt', 'nach Bestätigung durch die Kundin: „angefragt“');
m = mails.slice(vorher).find(x => x.to === 'brows@pmu.de');
pruefe(m && m.subject.startsWith('Terminwunsch – bitte bestätigen') && knopfLink(m.htmlBody, 'Termin bestätigen') && knopfLink(m.htmlBody, 'Passt nicht, ich rufe an'), 'Studio bekommt Wunsch mit zwei Knöpfen');
pruefe(!mails.slice(vorher).some(x => x.to === 'gina@beispiel.de'), 'Kundin bekommt noch keine Bestätigung');
vorher = mails.length;
klick(knopfLink(m.htmlBody, 'Termin bestätigen'), { ok: '1' });
pruefe(termin(id6).Stand === 'Termin', 'Studio bestätigt → Termin');
m = mails.slice(vorher).find(x => x.to === 'gina@beispiel.de');
pruefe(m && m.subject.startsWith('Bestätigt:') && !m.htmlBody.includes('So bereiten Sie sich vor') && m.htmlBody.includes('spätestens 48 Stunden'), 'jetzt Bestätigung an die Kundin (ohne leere Vorbereitung, 48 h Absagefrist)');
r = buche({ kunde: 'muster-pmu', art: 'beratung', start: '2027-01-14T10:00', name: 'Hanna Wunsch', email: 'hanna@beispiel.de', telefon: '0151 5554443' });
post({ a: 'bestaetigen', id: r.id, t: parameter(linkMit(letzte().htmlBody, 'bestaetigen.html')).t });
klick(knopfLink(letzte().htmlBody, 'Passt nicht, ich rufe an'), { ok: '1' });
pruefe(termin(r.id).Stand === 'neu', '„Passt nicht, ich rufe an“ → wird Rückruf-Fall');

// ================================================================ 11 Abend-Mail, Kauf, erster Auftrag
console.log('11 Abend-Mail');
uhr('2027-01-12 19:00'); vorher = mails.length;
G.abendMail();
m = mails.slice(vorher).find(x => x.to === 'studio@laser.de');
pruefe(m && /Wie waren Ihre Online-Termine heute\? \(2\)/.test(m.subject) && m.htmlBody.includes('Anna Beispiel') && m.htmlBody.includes('Clara Später'), 'Studio: Termine von heute mit Knöpfen');
pruefe(knopfLink(m.htmlBody, 'Erschienen') && knopfLink(m.htmlBody, 'Nicht erschienen') && knopfLink(m.htmlBody, 'Behandlung gekauft'), 'drei Knöpfe');
pruefe(!mails.slice(vorher).some(x => x.to === 'alt@x.de'), 'inaktiver Kunde bekommt nichts');
const kauf = m.htmlBody.split('<tr>').find(x => x.includes('Anna Beispiel'));
seite = klick(knopfLink(kauf, 'Behandlung gekauft'));
pruefe(seite.html.includes('name="w"'), '„Behandlung gekauft“ fragt nach dem Wert');
vorher = mails.length;
klick(knopfLink(kauf, 'Behandlung gekauft'), { ok: '1', w: '1.190' });
t = termin(id1);
pruefe(t.Stand === 'Auftrag' && t['Auftragswert €'] === 1190 && t['Auftrag am'] instanceof FDate, 'Kauf mit Wert 1.190 €');
m = mails.slice(vorher).find(x => x.subject.includes('Erster Auftrag'));
pruefe(m && m.to === 'ich@agentur.de,tom@agentur.de' && m.subject.includes('(Tom)') && m.subject.includes('Februar 2027') && m.htmlBody.includes('899 €'), 'Mail „Erster Auftrag“ an euch beide, mit Betreuer: Monatsgebühr ab Februar, 899 €');
klick(knopfLink(mails.filter(x => x.subject.includes('Wie waren'))[0].htmlBody.split('<tr>').find(x => x.includes('Clara')), 'Nicht erschienen'), { ok: '1' });
pruefe(termin(id2).Stand === 'nicht erschienen', 'nicht erschienen');

// ================================================================ 12 Rückruf-Wunsch (Netlify) und Erinnerung
console.log('12 Rückruf-Wunsch');
uhr('2027-01-18 10:00');
pruefe(webhook({ id: 'n1', form_name: 'rueckruf', data: { kunde: 'muster-laser', name: 'Ida Rückruf' } }, 'falsch').text === 'falscher Schlüssel', 'falscher Schlüssel abgelehnt');
vorher = mails.length;
r = webhook({ id: 'n1', form_name: 'rueckruf', site_url: 'https://muster-laser.netlify.app', created_at: new FDate(JETZT).toISOString(),
  data: { kunde: 'muster-laser', name: 'Ida Rückruf', telefon: '0151 3216549', wunsch: 'Lieber nachmittags', utm_source: 'google' } });
t = termin('n1');
pruefe(r.text === 'ok' && t.Art === 'Rückruf' && t.Stand === 'neu' && t.Quelle === 'Google' && t.Telefon === '+491513216549', 'Rückruf-Wunsch als Zeile „neu“');
m = mails.slice(vorher)[0];
pruefe(m.to === 'studio@laser.de' && m.subject.startsWith('Rückruf-Wunsch: Ida Rückruf') && knopfLink(m.htmlBody, 'Zurückgerufen') && m.htmlBody.includes('Lieber nachmittags'), 'Mail ans Studio mit Knopf');
pruefe(webhook({ id: 'n1', form_name: 'rueckruf', data: { kunde: 'muster-laser', name: 'Ida Rückruf' } }).text === 'doppelt', 'doppelt → nur einmal');
pruefe(webhook({ id: 'n2', form_name: 'rueckruf', data: { kunde: 'muster-laser', name: 'Fake Gesperrt', telefon: '0176 1112223' } }).text === 'gesperrt' && termin('n2').Stand === 'Fake', 'gesperrte Nummer im Formular → still als Fake');
vorher = mails.length;
uhr('2027-01-18 10:40'); G.alle10Minuten();
pruefe(!mails.slice(vorher).some(x => x.subject.includes('Ida')), 'nach 40 Min. noch keine Erinnerung');
uhr('2027-01-18 11:05'); G.alle10Minuten();
pruefe(mails.slice(vorher).some(x => x.to === 'studio@laser.de' && /Ida Rückruf wartet seit 6\d Minuten/.test(x.subject)) &&
  mails.slice(vorher).some(x => x.to === 'ich@agentur.de,tom@agentur.de' && x.subject.includes('(Tom)') && x.subject.includes('ohne Rückruf')), 'Erinnerung ans Studio und Hinweis an dich');
klick(knopfLink(m.htmlBody, 'Zurückgerufen'), { ok: '1' });
pruefe(termin('n1').Stand === 'erreicht' && termin('n1')['Minuten bis Rückruf'] === 65, 'Zurückgerufen: Minuten gezählt');

// ================================================================ 13 Wochen-Mail, Monatsanfang, Report
console.log('13 Woche, Monat, Report');
uhr('2027-01-25 08:00'); vorher = mails.length;
G.wochenMail();
m = mails.slice(vorher).find(x => x.to === 'studio@laser.de');
pruefe(m && m.htmlBody.includes('Ida Rückruf') && !m.htmlBody.includes('Anna Beispiel'), 'Wochen-Mail: offene drin, gekaufte nicht');
pruefe(mails.slice(vorher).some(x => x.to === 'ich@agentur.de,tom@agentur.de' && x.subject.startsWith('Wochen-Mails sind raus')), 'Übersicht an euch beide');
uhr('2027-02-01 07:00'); vorher = mails.length;
G.monatsAnfang();
m = mails.slice(vorher)[0];
pruefe(m && m.subject.includes('Werbekosten') && m.subject.includes('Rechnung') && m.htmlBody.includes('Monatsgebühr 899 €'), 'Monatsanfang: Werbekosten + Rechnung');
blaetter.Werbekosten.appendRow([berlin('2027-01-01 00:00'), 'muster-laser', 400, 100, '']);
uhr('2027-02-03 07:00');
G.monatsReportEntwuerfe();
const e = entwuerfe.find(x => x.to === 'studio@laser.de');
pruefe(e && e.subject === 'Ihr Monatsreport Januar 2027' && e.opt.replyTo === 'tom@agentur.de', 'Report-Entwurf für das Studio, Antwort an den Betreuer');
pruefe(e.body.trim().endsWith('Tom\nClickculture'), 'Report unterschreibt der Betreuer');
pruefe(mails.some(x => x.to === 'tom@agentur.de' && x.subject.startsWith('Report-Entwurf Januar 2027 für Muster Laserstudio') && x.htmlBody.includes('Werbeausgaben')), 'Betreuer bekommt den Report-Text per Mail (kein Zugriff auf Gmail-Entwürfe)');
pruefe(e.body.includes('Werbeausgaben: 500 €') && /bestätigte Termine: 3 \(Werbekosten pro Termin: 167 €\)/.test(e.body), 'Werbekosten und bestätigte Termine (3)');
pruefe(e.body.includes('Erschienen: 1 · nicht erschienen: 1 · abgesagt: 1') && e.body.includes('Behandlung gekauft: 1 (Wert laut Ihnen: 1.190 €)'), 'erschienen, nicht erschienen, abgesagt, gekauft');
pruefe(/Herausgefiltert: \d+ \(nicht bestätigt \d+, als Fake gemeldet 2, Bots 2\)/.test(e.body), 'herausgefilterte Fakes und Bots im Report');
ohneUndefined(e.body, 'Report');

// ================================================================ 14 Verlosung, Akquise, Kontingent
console.log('14 Täglich');
neu(); uhr('2027-01-11 08:00'); G.einrichten();
['Moni', 'Mara', 'Mia'].forEach((n, i) => { uhr('2027-01-1' + (2 + i) + ' 10:00'); webhook({ id: 'v' + i, form_name: 'verlosung', data: { kunde: 'muster-laser', name: n + ' Los', telefon: '0151 246813' + (57 + i) } }); });
uhr('2027-01-14 11:00'); webhook({ id: 'v9', form_name: 'verlosung', data: { kunde: 'muster-laser', name: 'Moni Doppelt', telefon: '0151 24681357' } });
uhr('2027-01-17 10:00'); webhook({ id: 'vz', form_name: 'verlosung', data: { kunde: 'muster-laser', name: 'Zu Spät', telefon: '0151 99887766' } });
blaetter.Akquise.appendRow(['Glow Studio', 'Frau Glow', 'Ulm', '0731 123', '@glow', 'Laser', '4,9 · 80', 'neu', berlin('2027-01-20 00:00'), 'Max', 'dienstags']);
blaetter.Akquise.appendRow(['Fertig Studio', '', '', '1', '', '', '', 'Kunde', berlin('2027-01-19 00:00'), '', '']);
blaetter.Akquise.appendRow(['Tom Studio', '', 'Ulm', '2', '', 'PMU', '', 'neu', berlin('2027-01-19 00:00'), 'Tom', '']);
blaetter.Akquise.appendRow(['Offen Studio', '', 'Ulm', '3', '', 'PMU', '', 'neu', berlin('2027-01-19 00:00'), '', '']);
quota = 20;
uhr('2027-01-20 07:00'); vorher = mails.length;
G.taeglich();
const zieh = mails.slice(vorher).find(x => x.subject.includes('Verlosung'));
pruefe(zieh && zieh.to === 'studio@laser.de,ich@agentur.de,tom@agentur.de' && zieh.htmlBody.includes('3 Teilnehmer') && (zieh.htmlBody.match(/<li>/g) || []).length === 1 && !zieh.htmlBody.includes('Zu Spät'), 'Verlosung: 1 Gewinnerin aus 3 (doppelt und zu spät zählen nicht)');
pruefe(mails.slice(vorher).some(x => x.to === 'ich@agentur.de' && x.subject === 'Heute dran: 1 Studio' && x.htmlBody.includes('Glow Studio') && !x.htmlBody.includes('Fertig')), 'Akquise: Max bekommt seine Studios');
pruefe(mails.slice(vorher).some(x => x.to === 'tom@agentur.de' && x.subject === 'Heute dran: 1 Studio' && x.htmlBody.includes('Tom Studio')), 'Akquise: Tom (Vorname reicht) bekommt seine Studios');
pruefe(mails.slice(vorher).some(x => x.to === 'ich@agentur.de,tom@agentur.de' && x.htmlBody.includes('Offen Studio') && x.htmlBody.includes('noch niemand zugeteilt')), 'Akquise: nicht zugeteilte gehen an beide');
pruefe(mails.slice(vorher).some(x => x.subject.includes('Mail-Kontingent')), 'Warnung: Mail-Kontingent knapp');
vorher = mails.length; G.taeglich();
pruefe(!mails.slice(vorher).some(x => x.subject.includes('Verlosung') || x.subject.includes('Kontingent')), 'nicht zweimal ziehen, nicht zweimal warnen');

// ================================================================ 15 Menü, Fehler
console.log('15 Menü und Fehlerfall');
neu(); uhr('2027-01-11 10:00'); G.einrichten();
G.kalenderPruefen();
pruefe(/Muster Laserstudio: ✓ Kalender verbunden, \d+ freie Beratungszeiten/.test(alerts[alerts.length - 1]) && alerts[alerts.length - 1].includes('Muster Brows: Modus „Wunschtermin“'), 'Kalender prüfen: ✓ und Wunschtermin');
delete kalender['studio@laser.de']; abonniert.clear();
G.kalenderPruefen();
pruefe(alerts[alerts.length - 1].includes('✗ Kalender „studio@laser.de“ nicht erreichbar'), 'Kalender nicht freigegeben → ✗ mit Hinweis');
vorher = mails.length;
r = get({ a: 'slots', k: 'muster-laser', art: 'beratung' });
pruefe(!r.ok && /Gerade hat etwas nicht geklappt/.test(r.fehler) && mails.slice(vorher).some(x => x.subject.includes('Fehler') && /nicht erreichbar/.test(x.body)), 'Kalender weg: Seite bekommt freundlichen Fehler, du eine Fehler-Mail');
neu(); uhr('2027-01-11 10:00'); G.einrichten(); vorher = mails.length;
G.testBuchung();
pruefe(termine().some(x => x.Name === 'TEST Anna Beispiel' && x.Stand === 'unbestätigt') && mails.slice(vorher).some(x => x.to === 'ich@agentur.de' && x.subject.startsWith('Bitte bestätigen')), 'Test-Buchung aus dem Menü: Mail an dich');
blaetter.Termine.z[0][blaetter.Termine.z[0].indexOf('Stand')] = 'Status';
vorher = mails.length; G.alle10Minuten();
pruefe(mails.slice(vorher).some(x => x.subject.includes('Fehler') && /Spalte „Stand“/.test(x.body)), 'umbenannte Spalte → Fehler-Mail an dich');
pruefe(G.doGet({ parameter: {} }).html.includes('in Ordnung'), 'Adresse ohne Parameter → freundliche Seite');

console.log(`\n${ok} bestanden, ${fehler} fehlgeschlagen`);
process.exit(fehler ? 1 : 0);
