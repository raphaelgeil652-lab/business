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
  getSheetId() { return 7; }
  setFrozenRows() {}
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
      getSheet: () => this, setFontWeight: () => ({}), getDisplayValue2: null,
      getValue: () => (this.z[r - 1] || [])[c - 1],
      getFormulas: () => { const out = []; for (let i = 0; i < nr; i++) { const row = this.z[r - 1 + i] || []; out.push(Array.from({ length: nc }, (_, j) => /^=/.test(String(row[c - 1 + j] ?? '')) ? row[c - 1 + j] : '')); } return out; }
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
const ordner = [];
function neuerOrdner(name) {
  const o = { id: 'F' + (ordner.length + 1), name, dateien: [],
    getUrl: () => 'https://drive.google.com/drive/folders/' + o.id, createFolder: n => neuerOrdner(n),
    createFile: b => { o.dateien.push(b); return b; },
    getFiles: () => { const l = o.dateien.slice(); return { hasNext: () => l.length > 0, next: () => l.shift() }; } };
  ordner.push(o);
  return o;
}
const exporte = [];

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
    getActive: () => ({ getSheetByName: n => blaetter[n] || null, getUrl: () => 'https://docs.google.com/spreadsheets/d/ZENTRALE', getId: () => 'ZENTRALE',
      insertSheet: n => (blaetter[n] = new Blatt(n, [])) }),
    getUi: () => ({
      alert: (...a) => alerts.push(a.join(' | ')), ButtonSet: { OK: 'OK' }, showModalDialog: (h, t) => alerts.push('DIALOG ' + t + ' ' + h.html),
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
    WeekDay: { MONDAY: 'MONDAY' }, getOAuthToken: () => 'TOKEN',
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
  Utilities: {
    getUuid: () => crypto.randomUUID(), formatDate, newBlob: (inhalt, typ, name) => ({ inhalt, typ, name, setName: n => ({ inhalt, typ, name: n }),
      getAs: t => ({ inhalt, typ: t, setName: n => ({ inhalt, typ: t, name: n }) }) }),
    computeHmacSha256Signature: (v, k) => Array.from(crypto.createHmac('sha256', k).update(v).digest()),
    base64EncodeWebSafe: b => Buffer.from(b).toString('base64').replace(/\+/g, '-').replace(/\//g, '_'),
    base64Decode: b => Array.from(Buffer.from(b, 'base64')),
    DigestAlgorithm: { SHA_256: 'sha256' }, Charset: { UTF_8: 'utf8' },
    computeDigest: (alg, text) => Array.from(crypto.createHash('sha256').update(text, 'utf8').digest()).map(b => (b > 127 ? b - 256 : b))
  },
  DriveApp: {
    getFoldersByName: n => { const f = ordner.filter(o => o.name === n); return { hasNext: () => f.length > 0, next: () => f.shift() }; },
    createFolder: n => neuerOrdner(n),
    getFolderById: id => ordner.find(o => o.id === id) || null
  },
  Session: { getScriptTimeZone: () => TZ, getEffectiveUser: () => ({ getEmail: () => 'besitzer@gmail.com' }) },
  LockService: { getScriptLock: () => ({ waitLock: () => {}, releaseLock: () => {} }) },
  PropertiesService: { getScriptProperties: () => ({ getProperty: k => props[k] || null, setProperty: (k, v) => { props[k] = v; } }) },
  HtmlService: { createHtmlOutput: h => { const o = { html: h, getContent: () => h, getTitle: () => 'T', setTitle: () => o, addMetaTag: () => o, setWidth: () => o, setHeight: () => o }; return o; } },
  ContentService: { MimeType: { JSON: 'json' }, createTextOutput: t => { const o = { text: t, setMimeType: () => o }; return o; } },
  UrlFetchApp: {
    fetch: (url, opt) => {
      if (url.startsWith('https://docs.google.com/spreadsheets/d/ZENTRALE/export')) {
        exporte.push({ url, nr: blaetter['Rechnung drucken'].getRange(1, 3).getValue() });
        return { getResponseCode: () => 200, getBlob: () => ({ setName: n => ({ name: n, typ: 'application/pdf' }) }) };
      }
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
  abonniert.clear(); ordner.length = 0; exporte.length = 0;
  mails.length = 0; entwuerfe.length = 0; alerts.length = 0; trigger = []; props = {}; cache = {}; quota = 90;
  const werte = {
    agentur_name: 'Clickculture', agentur_inhaber: 'Max Beispiel', agentur_email: 'ich@agentur.de', agentur_steuernr: '12/345/67890', agentur_kleinunternehmer: 'Nein', agentur_business_id: '1234567890123456',
    bestaetigung_minuten: 45, erinnerung_stunden: 24, raster_minuten: 30, max_unbestaetigt: 6, mail_warnung_ab: 25,
    benachrichtigung_an: 'ich@agentur.de,tom@agentur.de', team: 'Max = ich@agentur.de; Tom Beispiel = tom@agentur.de', geschaeftszeiten: '9-18', arbeitstage: 'Mo-Sa', rueckruf_minuten: 60,
    kopie_jeder_anfrage: 'Nein', akquise_erinnerung: 'Ja', webapp_url: 'https://script.google.com/macros/s/ABC/exec', schluessel: ''
  };
  blaetter.Einstellungen = new Blatt('Einstellungen', [['Schlüssel', 'Einstellung', 'Eintrag', 'Hilfe'], ['', 'Abschnitt', '', '']]
    .concat(KOPF.Einstellungen.map(k => [k, k, k in werte ? werte[k] : '', ''])));
  for (const n of ['Kunden', 'Termine', 'Sperrliste', 'Werbekosten', 'Akquise']) blaetter[n] = new Blatt(n, [KOPF[n].slice()]);
  blaetter['Verträge'] = new Blatt('Verträge', [KOPF['Verträge'].slice()]);
  blaetter.Rechnungen = new Blatt('Rechnungen', [KOPF.Rechnungen.slice()]);
  blaetter['Rechnung drucken'] = new Blatt('Rechnung drucken', [[]]);
  const kunde = o => blaetter.Kunden.appendRow(KOPF.Kunden.map(h => (h in o ? o[h] : '')));
  kalender['studio@laser.de'] = [];
  kunde({ 'Kürzel': 'muster-laser', 'Betrieb': 'Muster Laserstudio', 'Anrede für Mails': 'Frau Muster', 'E-Mail für Termine': 'studio@laser.de',
    'Telefon': '07552 12345', 'Adresse': 'Hauptstraße 1, 88630 Pfullendorf', 'Seiten-Adresse': 'https://muster-laser.netlify.app/',
    'Monatsgebühr €': 899, 'Live seit': berlin('2026-12-01 00:00'), 'Status': 'Live', 'Behandlung': 'Laser', 'Buchung': 'Kalender',
    'Kalender-ID': 'studio@laser.de', 'Buchbare Zeiten': 'Mo-Fr 9-18; Sa 10-14',
    'Leistungen': 'Beratung | 20 | ; Achseln | 20 | 89 €; Beine komplett | 60 | 249 €', 'Puffer Minuten': 0, 'Vorlauf Stunden': 12, 'Tage im Voraus': 14,
    'Absagefrist Stunden': 24, 'Ausfallregel': 'Bei späterer Absage berechnen wir 30 €.', 'Vorbereitung': 'Am Vortag rasieren • 2 Wochen vorher keine Sonne',
    'Teilnahmeschluss': berlin('2027-01-15 00:00'), 'Ziehung am': berlin('2027-01-20 00:00'), 'Betreuer': 'Tom' });
  kunde({ 'Kürzel': 'muster-pmu', 'Betrieb': 'Muster Brows', 'Anrede für Mails': 'Frau Brow', 'E-Mail für Termine': 'brows@pmu.de', 'Telefon': '0151 99999999',
    'Adresse': 'Weg 2, 12345 Musterstadt', 'Seiten-Adresse': 'https://muster-pmu.netlify.app', 'Status': 'Live', 'Behandlung': 'Permanent Make-up',
    'Buchung': 'Wunschtermin', 'Buchbare Zeiten': 'Di, Do 10-16', 'Leistungen': 'Beratung | 30 | ; Powder Brows | 150 | 390 €',
    'Vorlauf Stunden': 24, 'Tage im Voraus': 21, 'Absagefrist Stunden': 48, 'Vorbereitung': '' });
  kunde({ 'Kürzel': 'alt-gmbh', 'Betrieb': 'Alt GmbH', 'E-Mail für Termine': 'alt@x.de', 'Status': 'Beendet' });
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
pruefe(JSON.stringify(G.KUNDEN_SPALTEN) === JSON.stringify(KOPF.Kunden), 'Spalten in Code.gs und zentrale-bauen.py gleich');

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
const k60 = G.kunde_('muster-laser'); k60.raster = 60;
const t60 = G.freieSlots_(k60, '', G.einst_())[0].zeiten;
pruefe(t60[0] === '09:00' && t60[1] === '11:00' && !t60.includes('09:30'), 'Takt pro Studio: alle 60 Min. (9:00, 11:00 …; 10 Uhr belegt)');
pruefe(!get({ a: 'slots', k: 'muster-laser', art: 'behandlung', l: 'Gibts nicht' }).ok, 'unbekannte Leistung → nicht buchbar');
pruefe(!get({ a: 'slots', k: 'alt-gmbh' }).ok && !get({ a: 'slots', k: 'quatsch' }).ok, 'inaktiver/unbekannter Kunde → keine Termine');
pruefe(cache['slots_muster-laser_20'], 'Slots kurz zwischengespeichert');

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
pruefe(t.Telefon === '+4915123456781' && t.Quelle === 'Meta' && t.Art === 'Online-Termin' && t.Leistung === 'Beratung' && t.Dauer === 20, 'Telefon vereinheitlicht, Quelle Meta, Art, Dauer');
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
pruefe(m && /^Ihre Woche: \d+ neue Online-Termine · \d+× bitte Stand antippen$/.test(m.subject) && m.htmlBody.includes('Ihre letzte Woche') && m.htmlBody.includes('bestätigte Online-Termine</b> an') && m.replyTo === 'tom@agentur.de', 'Wochenbericht mit Zahlen für Studios, die live sind; Antwort an den Betreuer');
ohneUndefined(m.htmlBody, 'Wochenbericht');
pruefe(mails.slice(vorher).some(x => x.to === 'ich@agentur.de,tom@agentur.de' && x.subject.startsWith('Wochen-Mails sind raus')), 'Übersicht an euch beide');
uhr('2027-02-01 07:00'); vorher = mails.length;
G.monatsAnfang();
m = mails.slice(vorher).find(x => x.subject.startsWith('Monatsanfang'));
pruefe(m && m.subject.includes('1 Rechnung angelegt') && m.htmlBody.includes('Monatsgebühr 899 €'), 'Monatsanfang: Rechnung Monatsgebühr gemeldet');
const rl = mails.slice(vorher).find(x => x.to === 'tom@agentur.de' && x.subject.startsWith('Monatsreports Januar 2027'));
pruefe(rl && rl.htmlBody.includes('Muster Laserstudio') && !rl.htmlBody.includes('Muster Brows'), 'Betreuer bekommt seine Studios für den Report (nur die, die vor Monatsende live waren)');
{
  const rg = blaetter.Rechnungen.getDataRange().getValues(), kk = rg[0];
  const zeile = rg.slice(1).find(x => x[kk.indexOf('Kürzel')] === 'muster-laser');
  pruefe(zeile && zeile[kk.indexOf('Posten')] === 'Monatsgebühr' && zeile[kk.indexOf('Zeitraum')] === 'Februar 2027' && zeile[kk.indexOf('Netto €')] === 899, 'Rechnung Monatsgebühr von selbst angelegt');
  pruefe(mails.slice(vorher).some(x => x.to === 'tom@agentur.de' && /Rechnung .* angelegt/.test(x.subject) && x.htmlBody.includes('agentur_iban')), 'ohne IBAN: kein Versand, Hinweis an den Betreuer');
  const n = blaetter.Rechnungen.letzte(); G.monatsAnfang();
  pruefe(blaetter.Rechnungen.letzte() === n, 'zweimal Monatsanfang → keine doppelte Rechnung');
}
// Report über die Team-Seite: Werbekosten eintragen, zwei Sätze, senden
const tl = linkMit(rl.htmlBody, 'a=team');
const ts = klick(tl);
pruefe(ts.html.includes('Monatsreport Januar 2027') && ts.html.includes('Meta € im Januar'), 'Team-Seite zeigt den Report mit Feldern für Werbekosten');
const tp = parameter(tl);
pruefe(!G.teamAktion(tp.k, 'falsch', 'report', {}).ok, 'Team-Seite: falscher Schlüssel → nichts');
pruefe(!G.teamAktion(tp.k, tp.t, 'report', { meta: '400' }).ok, 'Report ohne Google-Kosten → Hinweis');
uhr('2027-02-03 07:00'); vorher = mails.length;
let tr = G.teamAktion(tp.k, tp.t, 'report', { meta: '400', google: '100', geaendert: 'Zwei neue Anzeigen', naechstes: 'Gebiet auf 20 km', brauchen: '' });
const e = mails.slice(vorher).find(x => x.to === 'studio@laser.de');
pruefe(tr.ok && e && e.subject === 'Ihr Monatsreport Januar 2027' && e.cc === 'tom@agentur.de', 'Report geht an das Studio, Kopie an den Betreuer');
pruefe(blaetter.Werbekosten.getDataRange().getValues().some(r => r[1] === 'muster-laser' && r[2] === 400 && r[3] === 100), 'Werbekosten von der Team-Seite im Blatt');
pruefe(e.body.trim().endsWith('Tom\nClickculture'), 'Report unterschreibt der Betreuer');
pruefe(e.body.includes('Werbeausgaben: 500 €') && /bestätigte Termine: 3 \(Werbekosten pro Termin: 167 €\)/.test(e.body), 'Werbekosten und bestätigte Termine (3)');
pruefe(e.body.includes('Erschienen: 1 · nicht erschienen: 1 · abgesagt: 1') && e.body.includes('Behandlung gekauft: 1 (Wert laut Ihnen: 1.190 €)'), 'erschienen, nicht erschienen, abgesagt, gekauft');
pruefe(/Herausgefiltert: \d+ \(nicht bestätigt \d+, als Fake gemeldet 2, Bots 2\)/.test(e.body), 'herausgefilterte Fakes und Bots im Report');
pruefe(e.body.includes('Was wir geändert haben: Zwei neue Anzeigen') && !e.body.includes('[') && !e.body.includes('brauchen'), 'eigene Sätze drin, leere weggelassen, keine [Klammern]');
ohneUndefined(e.body, 'Report');
vorher = mails.length; G.monatsReportEntwuerfe();
pruefe(!mails.slice(vorher).some(x => x.to === 'tom@agentur.de' && x.subject.includes('Erinnerung: Monatsreports')), 'am 3.: gesendeter Report → keine Erinnerung');
pruefe(G.teamAktion(tp.k, tp.t, 'report', { meta: '1', google: '1' }).meldung === 'Schon gesendet.', 'nicht doppelt senden');
{
  const rg = blaetter.Rechnungen.getDataRange().getValues(), kk = rg[0], nr = rg.slice(1).find(x => x[kk.indexOf('Kürzel')] === 'muster-laser')[0];
  tr = G.teamAktion(tp.k, tp.t, 'bezahlt', { nr: String(nr) });
  pruefe(tr.ok && blaetter.Rechnungen.getDataRange().getValues().slice(1).find(x => x[kk.indexOf('Kürzel')] === 'muster-laser')[kk.indexOf('Bezahlt am')] instanceof Date, 'Knopf „Bezahlt“ trägt das Datum ein');
}

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
pruefe(/Muster Laserstudio: ✓ Kalender verbunden, \d+ freie Zeiten/.test(alerts[alerts.length - 1]) && alerts[alerts.length - 1].includes('Muster Brows: Modus „Wunschtermin“'), 'Kalender prüfen: ✓ und Wunschtermin');
delete kalender['studio@laser.de']; abonniert.clear();
G.kalenderPruefen();
pruefe(alerts[alerts.length - 1].includes('✗ Kalender „studio@laser.de“ nicht erreichbar'), 'Kalender nicht freigegeben → ✗ mit Hinweis');
vorher = mails.length;
r = get({ a: 'slots', k: 'muster-laser', art: 'beratung' });
pruefe(!r.ok && /Gerade hat etwas nicht geklappt/.test(r.fehler) && mails.slice(vorher).some(x => x.subject.includes('Fehler') && /nicht erreichbar/.test(x.body)), 'Kalender weg: Seite bekommt freundlichen Fehler, du eine Fehler-Mail');
neu(); uhr('2027-01-11 10:00'); G.einrichten(); vorher = mails.length;
G.testBuchung();
pruefe(termine().some(x => x.Name === 'TEST Anna Beispiel' && x.Stand === 'unbestätigt') && mails.slice(vorher).some(x => x.to === 'ich@agentur.de' && x.subject.startsWith('Bitte bestätigen')), 'Test-Buchung aus dem Menü: Mail an dich');
{
  // Test-Studio ohne eigene Seite: Knopf in der Mail führt auf eine Seite der Zentrale
  blaetter.Kunden.z[1][KOPF.Kunden.indexOf('Seiten-Adresse')] = '';
  const tb = termine().find(x => x.Name === 'TEST Anna Beispiel');
  const ks = tb['Kunden-Schlüssel'];
  const lk = G.kundenLink_(G.einst_(), G.kunde_('muster-laser'), 'bestaetigen', tb.ID, ks);
  pruefe(lk === 'https://script.google.com/macros/s/ABC/exec?a=bestaetigen&id=' + tb.ID + '&t=' + ks, 'ohne Seite: Bestätigungs-Link zeigt auf die Zentrale');
  let sz = klick(lk);
  pruefe(sz.html.includes('Termin verbindlich bestätigen') && termin(tb.ID).Stand === 'unbestätigt', 'Zentrale-Seite fragt erst nach (Schutz vor Link-Scannern)');
  sz = klick(lk, { ok: '1' });
  pruefe(sz.html.includes('Termin bestätigt') && termin(tb.ID).Stand === 'Termin', 'Klick → Termin bestätigt');
  const best = mails.find(x => x.to === 'ich@agentur.de' && x.subject.startsWith('Bestätigt:'));
  const ab = linkMit(best.htmlBody, 'a=absagen');
  pruefe(!!ab && ab.startsWith('https://script.google.com/macros/s/ABC/exec?a=absagen'), 'Absage-Link zeigt ebenfalls auf die Zentrale');
  klick(ab, { ok: '1' });
  pruefe(termin(tb.ID).Stand === 'abgesagt', 'Absage über die Zentrale-Seite');
}
blaetter.Termine.z[0][blaetter.Termine.z[0].indexOf('Stand')] = 'Status';
vorher = mails.length; G.alle10Minuten();
pruefe(mails.slice(vorher).some(x => x.subject.includes('Fehler') && /Spalte „Stand“/.test(x.body)), 'umbenannte Spalte → Fehler-Mail an dich');
pruefe(G.doGet({ parameter: {} }).html.includes('in Ordnung'), 'Adresse ohne Parameter → freundliche Seite');


// ================================================================ 16 Neuer Kunde: Formular → Mails → Schritte → Erinnerungen → Live
console.log('16 Neuer Kunde');
neu(); uhr('2027-03-01 10:00'); G.einrichten();
{
  const s = G.einst_();
  pruefe(s.uebersicht_url.includes('a=team') && s.formular_url.includes('a=neu&t='), 'Einrichten schreibt die zwei Lesezeichen in die Einstellungen');
  pruefe(klick(s.formular_url).html.includes('Neuer Kunde') && klick(s.formular_url.replace(/t=\w+/, 't=falsch')).html.includes('nicht gültig'), 'Formular nur mit Schlüssel');
  const basis = { betreuer: 'Tom', betreuer_telefon: '0151 1111111', betrieb: 'kate cosmetics', firma: 'Kate Cosmetics, Inh. Katleen Miner', anrede: 'Frau', vorname: 'katleen',
    nachname: 'miner', telefon: '08382 12345', email: 'Kate@Studio.de', strasse: 'am bahnhof', hausnummer: '4', plz: '88131', ort: 'lindau', angebot: 'powder brows und lippen',
    behandler: 'Kosmetik/PMU-Studio', quali: true,
    leistungen: [{ name: 'powder Brows', minuten: '120', preis: '390' }, { name: 'Lippen | Aquarell', minuten: '150', preis: '' }, { name: '', minuten: '', preis: '' }],
    zeiten: 'Di 9:00-18:00; Mi 9:30-12:00 14:00-18:00; Sa 10:00-14:00', kalender: 'Kalender', kalender_id: '', absage: '24', ausfall: '40',
    termine: '4', umkreis: '20', provision: '15', budget: '800', mail: true };
  const f = o => G.neuerKunde_(Object.assign({}, basis, o), G.einst_());
  pruefe(!f({ betrieb: '' }).ok && /Name des Studios/.test(f({ betrieb: '' }).text), 'Pflichtfeld fehlt → Hinweis');
  pruefe(!f({ behandler: '' }).ok && !f({ hausnummer: '' }).ok && !f({ plz: '8813' }).ok && !f({ provision: '' }).ok, 'Pflichtfelder: Behandler, Hausnummer, PLZ, Provision');
  pruefe(!f({ quali: false }).ok, 'ohne Qualifikation → kein Abschluss');
  pruefe(!f({ leistungen: [] }).ok && !f({ leistungen: [{ name: 'Brows', minuten: '', preis: '' }] }).ok, 'ohne Leistung oder ohne Minuten → Hinweis');
  pruefe(!f({ behandler: 'Arzt/Ärztin', leistungen: [{ name: 'Botox Stirn', minuten: '30' }] }).ok && !f({ angebot: 'Botox' }).ok, '„Botox“ → abgelehnt');
  pruefe(!f({ zeiten: '' }).ok, 'ohne buchbare Zeiten → Hinweis');
  pruefe(blaetter.Kunden.letzte() === 4, 'abgelehnte Versuche legen nichts an');
  {
    const rb = G.neuerKunde_(Object.assign({}, basis, { betrieb: 'Beratung Test', leistungen: [{ name: 'haarpigmentierung', minuten: '30', preis: '1800', beratung: true }] }), G.einst_());
    const kb = G.kunde_('beratung-test');
    pruefe(rb.ok && kb.leistungen[0].name === 'Beratung Haarpigmentierung' && kb.leistungen[0].minuten === 30 && kb.leistungen[0].preis === 'ab 1800 €', '„erst Beratung“: online buchbar ist die Beratung, Preis als „ab …“');
    blaetter.Kunden.z = blaetter.Kunden.z.filter(r => r[0] !== 'beratung-test');
  }
  const vorher = mails.length, r = f({});
  const k = G.kunde_('kate-cosmetics');
  pruefe(r.ok && k && k.status === 'Angelegt' && k.token.length === 32, 'Kunde angelegt: Kürzel aus dem Namen, Status Angelegt, Schlüssel');
  pruefe(k.zeiten === 'Di 9:00-18:00; Mi 9:30-12:00 14:00-18:00; Sa 10:00-14:00' && k.raster === 15 && k.modus === 'Kalender' && k.kalender === 'kate@studio.de', 'Zeiten aus dem Kalender-Raster, Takt von selbst 15 Min., Kalender = Studio-Mail');
  pruefe(k.betrieb === 'Kate Cosmetics' && k.inhaber === 'Katleen Miner' && k.anrede === 'Frau Miner' && k.adresse === 'Am Bahnhof 4, 88131 Lindau' && k.behandlung === 'Powder Brows und Lippen', 'Groß- und Kleinschreibung von selbst, Adresse aus getrennten Feldern');
  pruefe(k.leistungen.length === 2 && k.leistungen[0].name === 'Powder Brows' && k.leistungen[1].name === 'Lippen / Aquarell' && k.leistungen[1].minuten === 150, 'Leistungen: leere Zeile weg, „|“ entschärft, großer Anfang');
  pruefe(/40 €/.test(k.ausfall) && /5 Minuten vor/.test(k.vorbereitung) && k.seite === 'https://kate-cosmetics.netlify.app' && k.provision === 15, 'Ausfallregel, allgemeiner Vorschlag Vorbereitung, Seitenadresse, Provision');
  pruefe(k.betreuerMail === 'tom@agentur.de' && k.betreuerTelefon === '0151 1111111', 'Betreuer-Mail aus dem Team');
  const v = G.vertrag_('kate-cosmetics');
  pruefe(v.includes('Kate Cosmetics, Inh. Katleen Miner') && v.includes('Powder Brows (120 Min., 390 €)') && v.includes('800 €') && v.includes('20 km um Lindau') && v.includes('Provision: 15 %') && !/Google Ads/.test(v) && !/\{\{/.test(v), 'Vereinbarung: ausgefüllt, Provision, nur Meta, keine {{Platzhalter}}');
  const w = mails.slice(vorher).find(x => x.to === 'kate@studio.de');
  pruefe(w && w.cc === 'tom@agentur.de' && w.subject.startsWith('Willkommen') && linkMit(w.htmlBody, 'a=studio'), 'Willkommens-Mail an das Studio mit Link, Kopie an den Betreuer');
  pruefe(f({}).ok && G.kunde_('kate-cosmetics-2'), 'gleicher Name nochmal → eigenes Kürzel (-2)');
  {
    // Tabelle aus der Vorlage: vorbereitete Zeilen mit Formel „Erster Auftrag“ → neuer Kunde in die erste leere Zeile, Formel bleibt
    const ku = blaetter.Kunden, kopfK = ku.z[0], ea = kopfK.indexOf('Erster Auftrag'), frei = ku.letzte() + 1;
    for (let i = 0; i < 5; i++) { const row = kopfK.map(() => ''); row[ea] = '=WENN(A' + (frei + i) + '="";"";1)'; ku.z.push(row); }
    G.zeileAnhaengen_(G.tabelle_('Kunden'), { 'Kürzel': 'leer-test', 'Betrieb': 'Leer Test' });
    pruefe(ku.z[frei - 1][0] === 'leer-test' && /^=WENN/.test(ku.z[frei - 1][ea]) && ku.z[frei][0] === '', 'Neuer Kunde landet in der ersten leeren Zeile, nicht hinter den vorbereiteten (Formel bleibt)');
    ku.z = ku.z.filter(r => r[0] !== 'leer-test' && !(r[0] === '' && /^=WENN/.test(r[ea] || '')));
  }

  // Schritte-Seite
  const sl = linkMit(w.htmlBody, 'a=studio'), sp = parameter(sl);
  let seite = klick(sl).html;
  pruefe(seite.includes('0 von 8 erledigt') && seite.includes('Google-Kalender freigeben') && !seite.includes('Google Ads verbinden') && seite.includes(G.metaEinladung_(G.einst_())) && seite.includes('besitzer@gmail.com') && seite.includes('15 %</b>'), 'Schritte-Seite: 8 Schritte (nur Meta), Einladungs-Adresse, Zentrale-Adresse, Provision');
  pruefe(seite.includes('Clickculture bei Facebook einladen') && seite.includes('Volle Kontrolle') && seite.includes('business.facebook.com/overview') && seite.includes('Das kommt später') && !seite.includes('Business-ID'), 'Meta: Studio lädt nur ein, Karte wartet, keine Business-ID beim Studio');
  pruefe(klick(sl.replace(/t=\w+/, 't=falsch')).html.includes('nicht (mehr) gültig'), 'falscher Link → nichts');
  const A = (a, d) => G.studioAktion(sp.k, sp.t, a, d || {});
  pruefe(!A('vertrag', { name: 'Kate', ok: true }).ok && !A('vertrag', { name: 'Katleen Miner', ok: false }).ok, 'Vertrag: Vor- und Nachname und Häkchen nötig');
  let m0 = mails.length, x1 = A('vertrag', { name: 'Katleen Miner', ok: true });
  pruefe(x1.ok && G.kunde_('kate-cosmetics').vertrag && x1.html.includes('1 von 8'), 'Vertrag angenommen, Seite zeigt 1 von 8');
  const kopie = mails.slice(m0).find(x => x.to === 'kate@studio.de' && x.subject.startsWith('Ihre Vereinbarung'));
  pruefe(kopie && kopie.htmlBody.includes('Powder Brows') && kopie.htmlBody.includes('Annahme-Nachweis') && kopie.attachments && kopie.attachments[0].typ === 'application/pdf' && kopie.bcc === 'ich@agentur.de', 'Vereinbarung als PDF mit Annahme-Nachweis an das Studio, Kopie an euch');
  pruefe(blaetter['Verträge'].getDataRange().getValues().some(z => z[0] === 'kate-cosmetics' && z[3] === 'Katleen Miner' && z[2] instanceof Date && /^[0-9a-f]{64}$/.test(z[5])), 'Annahme mit Name, Zeit und Prüfsumme im Blatt „Verträge“');
  pruefe(!mails.slice(m0).some(x => /Rechnung/.test(x.subject)), 'keine Onboarding-Rechnung (Provision)');
  pruefe(!A('links', { impressum: 'kate.de/impressum', datenschutz: '' }).ok && A('links', { impressum: 'https://kate.de/impressum', datenschutz: 'https://kate.de/datenschutz' }).ok, 'Links: nur vollständige Adressen');
  pruefe(A('behandler', { behandler: 'Katleen Miner, PMU Artist' }).ok, 'Behandler gespeichert');
  pruefe(A('vorbereitung', { text: '- Kein Alkohol am Vortag\n\n• Keine Blutverdünner', h_0: 'Bitte ungeschminkt kommen', h_1: '' }).ok && G.kunde_('kate-cosmetics').vorbereitung === 'Kein Alkohol am Vortag • Keine Blutverdünner', 'Vorbereitung: Zeilen → Punkte, freigegeben');
  pruefe(G.kunde_('kate-cosmetics').hinweise['Powder Brows'] === 'Bitte ungeschminkt kommen' && !G.kunde_('kate-cosmetics').hinweise['Lippen / Aquarell'], 'Hinweise je Leistung gespeichert (leere weggelassen)');
  const vh = G.vorbereitungHtml_(G.kunde_('kate-cosmetics'), 'Powder Brows'), vh2 = G.vorbereitungHtml_(G.kunde_('kate-cosmetics'), 'Lippen / Aquarell');
  pruefe(vh.indexOf('ungeschminkt') > 0 && vh.indexOf('ungeschminkt') < vh.indexOf('Kein Alkohol') && !vh2.includes('ungeschminkt') && vh2.includes('Kein Alkohol'), 'Mail-Hinweise: eigene der Leistung zuerst, dann die allgemeinen');
  for (let i = 0; i < 3; i++) G.studioFoto(sp.k, sp.t, 'foto' + i + '.jpg', 'image/jpeg', Buffer.from('bild').toString('base64'));
  pruefe(G.kunde_('kate-cosmetics').fotos === 3 && mails.filter(m => m.subject.startsWith('Foto ') && m.attachments && m.attachments.length).length === 3, '3 Fotos hochgeladen, gezählt, als Anhang an den Betreuer');
  // Portal: Seite als JSON, Knöpfe per POST
  const pj = get({ a: 'studio', k: sp.k, t: sp.t, format: 'json' });
  pruefe(pj.ok && pj.html.includes('Ihre Schritte'), 'Portal holt die Schritte-Seite als JSON');
  pruefe(post({ a: 'run', fn: 'studioAktion', args: [sp.k, sp.t, 'behandler', { behandler: 'Katleen Miner, PMU Artist' }] }).ok, 'Portal: Knopf per POST');
  pruefe(!post({ a: 'run', fn: 'neuerKunde', args: [{}], t: 'falsch' }).ok && !post({ a: 'run', fn: 'einrichten', args: [] }).ok, 'Portal: Formular nur mit Schlüssel, andere Funktionen gesperrt');
  G.einstSetzen_('portal_url', 'https://clickculture-portal.netlify.app');
  pruefe(G.studioLink_(G.einst_(), G.kunde_('kate-cosmetics')).startsWith('https://clickculture-portal.netlify.app/?z=https%3A%2F%2Fscript.google.com'), 'Links zeigen aufs Portal');
  G.einstSetzen_('portal_url', '');
  let x2 = A('kalender', { kalender: 'kate@studio.de' });
  pruefe(!x2.ok && /Noch keine Freigabe/.test(x2.meldung), 'Kalender noch nicht freigegeben → klarer Hinweis');
  pruefe(!A('kalender', { kalender: 'besitzer@gmail.com' }).ok && /unsere Adresse/.test(A('kalender', { kalender: 'besitzer@gmail.com' }).meldung), 'Kalender: unsere eigene Adresse wird abgelehnt');
  kalender['kate@studio.de'] = [];
  pruefe(A('kalender', { kalender: 'kate@studio.de' }).ok && G.kunde_('kate-cosmetics').kalenderOk, 'Kalender freigegeben → verbunden');
  seite = klick(sl).html;
  pruefe(seite.includes('6 von 8') && seite.includes('Ändern</summary>'), 'erledigte Schritte bleiben änderbar');
  pruefe(A('behandler', { behandler: 'Katleen Miner, PMU-Artistin' }).ok && G.kunde_('kate-cosmetics').behandlerName === 'Katleen Miner, PMU-Artistin', 'erledigter Schritt geändert');

  // Erinnerungen
  uhr('2027-03-02 08:00'); m0 = mails.length; G.taeglich();
  pruefe(!mails.slice(m0).some(x => x.subject.includes('Schritt')), 'nach 1 Werktag: noch keine Erinnerung');
  uhr('2027-03-03 08:00'); m0 = mails.length; G.taeglich();
  const er = mails.slice(m0).find(x => x.to === 'kate@studio.de' && x.subject.includes('Noch 1 Schritt'));
  pruefe(er && er.htmlBody.includes('bei Facebook einladen') && !er.htmlBody.includes('Karte') && !er.htmlBody.includes('Vereinbarung'), 'nach 2 Werktagen: Erinnerung nur mit dem, was fehlt');
  uhr('2027-03-04 08:00'); m0 = mails.length; G.taeglich();
  pruefe(!mails.slice(m0).some(x => x.to === 'kate@studio.de'), 'nicht jeden Tag erinnern');
  // zweites Studio reagiert nie → nach 3 Erinnerungen Mail an den Betreuer
  ['2027-03-03', '2027-03-05', '2027-03-09', '2027-03-11'].forEach(d => { uhr(d + ' 08:00'); G.taeglich(); });
  pruefe(mails.filter(x => x.to === 'kate@studio.de' && x.subject.includes('bis zum Start von Kate Cosmetics') && x.htmlBody.includes('Vereinbarung')).length === 3, 'Studio ohne Fortschritt: genau 3 Erinnerungen');
  pruefe(mails.some(x => x.to === 'tom@agentur.de' && x.subject.includes('kommt nicht weiter')), 'danach: Betreuer soll anrufen');
  m0 = mails.length;
  pruefe(!A('karte', {}).ok, 'Karte geht erst, wenn Meta eingerichtet ist');
  pruefe(A('meta', {}).ok && mails.slice(m0).some(x => x.to === 'tom@agentur.de' && x.subject.includes('eingeladen') && x.htmlBody.includes('Meta einrichten') && x.htmlBody.includes('a=team')), 'Einladung gemeldet → Betreuer bekommt Mail mit Team-Link');
  pruefe(klick(sl).html.includes('7 von 8') && klick(sl).html.includes('Ihr Teil ist im Moment erledigt'), '7 von 8: nur die Karte wartet noch auf euch');
  uhr('2027-03-12 08:00'); G.taeglich();
  const da = mails.slice(m0).find(x => x.to === 'tom@agentur.de' && x.subject.includes('alles vom Studio da'));
  pruefe(da && da.htmlBody.includes('clickculture-beauty-studio') && da.htmlBody.includes('https://kate.de/impressum') && da.htmlBody.includes('Anhänge'), '„Alles da“: Mail an den Betreuer mit Text für Claude und nächsten Schritten');
  m0 = mails.length; G.taeglich();
  pruefe(!mails.slice(m0).some(x => x.subject.includes('alles vom Studio da')), '„Alles da“ nur einmal');

  // Team-Seite: Pixel, Conversion, live schalten
  const tl = linkMit(da.htmlBody, 'a=team'), tp = parameter(tl);
  pruefe(klick(tl).html.includes('Jetzt live schalten') && klick(tl).html.includes('Schritte des Studios'), 'Team-Seite: Schritte und Live-Knopf');
  pruefe(G.doGet({ parameter: { a: 'team', t: G.teamToken_(G.einst_(), '') } }).html.includes('Kate Cosmetics'), 'Übersicht listet die Studios');
  const T = (a, d) => G.teamAktion(tp.k, tp.t, a, d || {});
  let th = klick(tl).html;
  pruefe(th.includes('Meta einrichten') && th.includes('1234567890123456') && th.includes('Europe/Berlin') && th.includes('Karte des Studios'), 'Team-Seite: Klickliste „Meta einrichten“ mit Business-ID, Karte fehlt beim Live-Knopf');
  pruefe(!T('metafertig', { werbekonto: '123', seite: 'neu' }).ok, 'Werbekonto-ID zu kurz → Hinweis');
  m0 = mails.length;
  pruefe(T('metafertig', { werbekonto: 'act_998877665544332', pixel: '', seite: 'alt' }).ok && G.kunde_('kate-cosmetics').werbekonto === '998877665544332', 'Meta fertig: Werbekonto gespeichert (act_ weg)');
  const km = mails.slice(m0).find(x => x.to === 'kate@studio.de' && x.subject.includes('Karte'));
  pruefe(km && linkMit(km.htmlBody, 'a=studio') && km.htmlBody.includes('Genehmigen'), 'Studio bekommt Mail „Karte hinterlegen“ mit Link (und Seite genehmigen)');
  seite = klick(sl).html;
  pruefe(seite.includes('asset_id=998877665544332') && seite.includes('Zahlungsmethode hinzufügen') && seite.includes('Genehmigen') && !seite.includes('Das kommt später'), 'Schritte-Seite: Karte mit direktem Link zur Zahlungsseite');
  m0 = mails.length; T('erinnern');
  pruefe(mails.slice(m0).some(x => x.to === 'kate@studio.de' && x.htmlBody.includes('Karte')), 'Erinnerung nennt die Karte');
  m0 = mails.length;
  pruefe(A('karte', {}).ok && klick(sl).html.includes('8 von 8') && mails.slice(m0).some(x => x.to === 'tom@agentur.de' && x.subject.includes('Karte ist hinterlegt')), 'Karte hinterlegt → 8 von 8, Betreuer bekommt Bescheid');
  m0 = mails.length; pruefe(T('metafertig', { werbekonto: '998877665544332', pixel: '', seite: 'alt' }).ok && !mails.slice(m0).length, 'Meta ändern schickt keine Mail mehr');
  pruefe(klick(tl).html.includes('Eingerichtet am') && !klick(tl).html.includes('Karte des Studios'), 'Team-Seite: Meta ✓, Karte nicht mehr offen');
  pruefe(!T('einrichten', { pixel: '123', conversion: '', seite: k.seite }).ok && !T('einrichten', { pixel: '', conversion: 'AW-123', seite: k.seite }).ok, 'Pixel/Conversion falsch → Hinweis');
  pruefe(T('einrichten', { pixel: '1234567890123456', conversion: 'AW-123456789/AbC-d', seite: k.seite }).ok, 'Pixel und Conversion gespeichert');
  const mess = get({ a: 'mess', k: 'kate-cosmetics' });
  pruefe(mess.pixel === '1234567890123456' && mess.conversion === 'AW-123456789/AbC-d', 'Seite holt Pixel und Conversion aus der Zentrale (kein neues Hochladen)');
  // Freigabe durch das Studio
  m0 = mails.length;
  pruefe(T('vorschau', {}).ok && mails.slice(m0).some(x => x.to === 'kate@studio.de' && x.subject.startsWith('Bitte ansehen') && linkMit(x.htmlBody, 'a=studio')), 'Team-Seite: Studio um Freigabe bitten → Mail ans Studio');
  let fs1 = klick(sl).html;
  pruefe(fs1.includes('Passt so, freigeben') && fs1.includes('https://kate-cosmetics.netlify.app/anzeigen/vorschau.html') && fs1.includes('termin.html?demo=1') && fs1.includes('8 von 9'), 'Schritte-Seite zeigt Seite, Anzeigen und Freigabe-Knöpfe');
  pruefe(!A('freigabe-aendern', { text: '' }).ok, 'Änderung ohne Text → Hinweis');
  m0 = mails.length;
  pruefe(A('freigabe-aendern', { text: 'Preis Powder Brows ist 420 €' }).ok && mails.slice(m0).some(x => x.to === 'tom@agentur.de' && x.subject.includes('möchte etwas ändern') && x.htmlBody.includes('420')), 'Änderungswunsch → Mail an den Betreuer mit dem Text');
  pruefe(!G.kunde_('kate-cosmetics').vorschau && klick(tl).html.includes('Preis Powder Brows ist 420'), 'Team-Seite zeigt den Wunsch, Freigabe-Knopf wieder da');
  uhr('2027-03-16 08:00'); m0 = mails.length; G.taeglich();
  pruefe(!mails.slice(m0).some(x => x.subject.includes('alles vom Studio da')), 'nach Änderungswunsch kein zweites „alles da“');
  T('vorschau', {});
  pruefe(klick(sl).html.includes('Ihr letzter Änderungswunsch'), 'Studio sieht seinen letzten Wunsch');
  uhr('2027-03-18 08:00'); m0 = mails.length; G.taeglich();
  pruefe(mails.slice(m0).some(x => x.to === 'kate@studio.de' && x.htmlBody.includes('ansehen und freigeben')), 'Freigabe offen → Erinnerung nach 2 Werktagen');
  m0 = mails.length;
  pruefe(A('freigabe-ok', {}).ok && G.kunde_('kate-cosmetics').freigabe && mails.slice(m0).some(x => x.to === 'tom@agentur.de' && x.subject.includes('freigegeben')), 'Freigabe → Mail an den Betreuer: live schalten');
  uhr('2027-03-22 08:00'); m0 = mails.length; G.taeglich();
  pruefe(!mails.slice(m0).some(x => x.to === 'kate@studio.de'), 'nach der Freigabe keine Erinnerungen mehr');
  m0 = mails.length;
  pruefe(T('live', {}).ok && G.kunde_('kate-cosmetics').status === 'Live' && G.kunde_('kate-cosmetics').live, 'Live schalten: Status und „Live seit“');
  const lm = mails.slice(m0).find(x => x.to === 'kate@studio.de' && x.subject.startsWith('Es geht los'));
  pruefe(lm && lm.htmlBody.includes('Fake melden') && lm.htmlBody.includes('19 Uhr'), '„Ihre Werbung läuft“ an das Studio');
  m0 = mails.length; G.alle10Minuten();
  pruefe(!mails.slice(m0).some(x => x.subject.startsWith('Es geht los')), 'Live-Mail nur einmal');
  uhr('2027-03-29 08:00'); m0 = mails.length; G.wochenMail();
  const wb = mails.slice(m0).find(x => x.to === 'kate@studio.de');
  pruefe(wb && wb.subject === 'Ihre Woche: 0 neue Online-Termine' && wb.htmlBody.includes('Alles ist eingetragen'), 'Wochenbericht auch ohne offene Termine, sobald live');
  pruefe(T('pausieren', {}).ok && !G.kunde_('kate-cosmetics').aktiv && !get({ a: 'slots', k: 'kate-cosmetics' }).ok, 'Pausieren: keine Buchungen mehr');
  T('fortsetzen', {});

  // Buchung beim neuen Studio mit gewählter Leistung
  let sl2 = get({ a: 'slots', k: 'kate-cosmetics', l: 'Lippen / Aquarell' });
  const sa = sl2.tage.find(t => t.label.startsWith('Sa'));
  pruefe(sl2.ok && sl2.dauer === 150 && sa && sa.zeiten[sa.zeiten.length - 1] === '11:30' && !sl2.tage.some(t => t.label.startsWith('Mo')), 'freie Zeiten für die gewählte Leistung (150 Min.: Sa letzter Start 11:30, montags keine)');
  const r2 = post({ a: 'buchen', kunde: 'kate-cosmetics', leistung: 'Powder Brows', start: sl2.tage[0].datum + 'T' + sl2.tage[0].zeiten[0], name: 'Lena Braue', telefon: '0151 23456781', email: 'lena@beispiel.de', ms: 20000 });
  pruefe(r2.ok && termin(r2.id).Leistung === 'Powder Brows' && termin(r2.id).Dauer === 120, 'Buchung mit Leistung und Dauer');
  pruefe(!post({ a: 'buchen', kunde: 'kate-cosmetics', leistung: 'Gibts nicht', start: sl2.tage[0].datum + 'T10:00', name: 'X Y', telefon: '0151 23456782', email: 'x@beispiel.de', ms: 20000 }).ok, 'unbekannte Leistung → abgelehnt');

  // Rückruf direkt von der Seite (ohne Netlify)
  pruefe(post({ a: 'anfrage', kunde: 'kate-cosmetics', form: 'rueckruf', name: 'Ria Ruf', telefon: '0151 7778889', ms: 9000 }).ok &&
    termine().some(z => z.Name === 'Ria Ruf' && z.Art === 'Rückruf') && mails.some(x => x.to === 'kate@studio.de' && x.subject.startsWith('Rückruf-Wunsch: Ria Ruf')), 'Rückruf-Wunsch direkt an die Zentrale, Mail an das Studio');
  pruefe(post({ a: 'anfrage', kunde: 'kate-cosmetics', form: 'rueckruf', name: 'Bot', telefon: '1', ms: 500 }).ok && !termine().some(z => z.Name === 'Bot'), 'Rückruf: Bot-Falle legt nichts an');

  // Rechnung automatisch als PDF, sobald IBAN & Co. da sind
  G.einstSetzen_('agentur_iban', 'DE00 1234'); G.einstSetzen_('agentur_anschrift', 'Weg 1, 88630 Pfullendorf');
  m0 = mails.length;
  const nr = G.rechnungAnlegen_(G.kunde_('kate-cosmetics-2'), G.einst_(), 'Onboarding', 'einmalig', 700);
  const rm = mails.slice(m0).find(x => x.to === 'kate@studio.de' && x.subject.startsWith('Rechnung ' + nr));
  pruefe(rm && rm.attachments && rm.attachments[0].name === 'Rechnung ' + nr + '.pdf' && exporte.some(e => e.nr === nr && e.url.includes('range=B3:E31')), 'Rechnung als PDF an das Studio');
  ohneUndefined(lm.htmlBody + er.htmlBody + w.htmlBody + da.htmlBody + seite, 'neue Mails und Seiten');
  // Telefonnummern behalten die 0
  pruefe(G.telLesen_(15123456781) === '015123456781' && G.telLesen_('+49 151 1') === '+49 151 1' && G.telLesen_('0151 2') === '0151 2', 'Telefon: Google-Zahl bekommt die 0 zurück');
  const zk = blaetter.Kunden.z[0].indexOf('Betreuer Telefon'), zr = blaetter.Kunden.z.findIndex(r => r[0] === 'kate-cosmetics');
  blaetter.Kunden.z[zr][zk] = 1511111111;
  pruefe(G.kunde_('kate-cosmetics').betreuerTelefon === '01511111111', 'Betreuer-Telefon aus der Tabelle mit 0');
  // Kundendaten ändern
  const fe = G.formularSeite_({ t: G.einst_().schluessel, k: 'kate-cosmetics' }).html;
  pruefe(fe.includes('Kundendaten ändern') && fe.includes('value="Am Bahnhof"') && fe.includes('value="4"') && fe.includes('value="88131"'), 'Formular zum Ändern ist vorausgefüllt');
  m0 = mails.length;
  const ae = G.neuerKunde_(Object.assign({}, basis, { kuerzel: 'kate-cosmetics', budget: '950' }), G.einst_());
  pruefe(ae.ok && G.kunde_('kate-cosmetics').status === 'Live' && !mails.slice(m0).some(x => x.subject.startsWith('Willkommen')) && !G.kunde_('kate-cosmetics-3'), 'Ändern: gleicher Kunde, keine neue Willkommens-Mail');
  // Provision am Monatsanfang
  blaetter.Termine.appendRow(G.zeileNachKopf_(G.tabelle_('Termine'), { 'ID': 'P1', 'Eingang': berlin('2027-03-20 10:00'), 'Kunde': 'kate-cosmetics', 'Art': 'Online-Termin',
    'Stand': 'Auftrag', 'Auftragswert €': 390, 'Auftrag am': berlin('2027-03-25 12:00'), 'Name': 'Pia Provision' }));
  uhr('2027-04-01 07:00'); m0 = mails.length; G.monatsAnfang();
  const rp = blaetter.Rechnungen.getDataRange().getValues(), rk = rp[0];
  pruefe(rp.slice(1).some(z => z[rk.indexOf('Kürzel')] === 'kate-cosmetics' && z[rk.indexOf('Posten')] === 'Provision' && z[rk.indexOf('Zeitraum')] === 'März 2027' && z[rk.indexOf('Netto €')] === 58.5), 'Provision: 15 % von 390 € = 58,50 € für März');
  pruefe(mails.slice(m0).some(x => x.subject.startsWith('Monatsanfang') && x.htmlBody.includes('Provision März 2027')), 'Monatsanfang meldet die Provisions-Rechnung');
  pruefe(G.nachfragen_(G.einst_(), { s: 'auftrag', id: 'P1', t: 'x' }, 'Pia', G.KNOEPFE.auftrag).html.includes('name="w" required'), 'Kauf-Knopf: Betrag ist Pflicht');
  // Gewinnspiel mit Terminbuchung
  pruefe(!T('gewinnspiel', { gewinn: 'Neuset', ab: '2027-04-10', bis: '2027-04-05', ziehung: '2027-04-20' }).ok, 'Gewinnspiel: falsche Reihenfolge der Daten → Hinweis');
  pruefe(T('gewinnspiel', { gewinn: '1 × Wimpern-Neuset (Wert 145 €)', ab: '2027-04-01', bis: '2027-04-15', ziehung: '2027-04-16' }).ok, 'Gewinnspiel gespeichert');
  uhr('2027-04-05 10:00');
  const gsl = get({ a: 'slots', k: 'kate-cosmetics', l: 'Powder Brows' });
  pruefe(gsl.gewinnspiel && gsl.gewinnspiel.gewinn.includes('Neuset') && gsl.gewinnspiel.bis === '15.04.2027', 'Terminseite bekommt das Gewinnspiel mit (Banner)');
  pruefe(G.teilnahmeSeite_({ k: 'kate-cosmetics' }).html.includes('wahrnehmen') || G.teilnahmeSeite_({ k: 'kate-cosmetics' }).html.includes('wahr'), 'Teilnahmebedingungen werden erzeugt');
  const tz = G.tabelle_('Termine');
  [['G1', 'Gina Gewinn', '0151 11112222', 'erschienen', '2027-04-08 10:00'], ['G2', 'Nora Nichtda', '0151 33334444', 'nicht erschienen', '2027-04-09 10:00'],
   ['G3', 'Zora Zuspät', '0151 55556666', 'erschienen', '2027-04-20 10:00']].forEach(([id, n, tel, st, t]) =>
    blaetter.Termine.appendRow(G.zeileNachKopf_(tz, { 'ID': id, 'Eingang': berlin('2027-04-02 09:00'), 'Kunde': 'kate-cosmetics', 'Art': 'Online-Termin', 'Name': n, 'Telefon': tel, 'Stand': st, 'Termin': berlin(t) })));
  uhr('2027-04-16 08:00'); m0 = mails.length; G.taeglich();
  const zg = mails.slice(m0).find(x => x.subject.includes('Verlosung'));
  pruefe(zg && zg.htmlBody.includes('Gina Gewinn') && zg.htmlBody.includes('1 Teilnehmer') && !zg.htmlBody.includes('Nora') && !zg.htmlBody.includes('Zora'), 'Ziehung nur unter denen, die im Zeitraum erschienen sind');
  G.neuerKunde_(Object.assign({}, basis, { betrieb: 'Praxis Test', behandler: 'Arzt/Ärztin', angebot: 'Faltenbehandlung', leistungen: [{ name: 'Beratung', minuten: '20' }] }), G.einst_());
  pruefe(!G.teamAktion('praxis-test', G.teamToken_(G.einst_(), 'praxis-test'), 'gewinnspiel', { gewinn: '1 × Behandlung', ab: '2027-04-01', bis: '2027-04-02', ziehung: '2027-04-03' }).ok, 'Ärzte: Gewinnspiel gesperrt (Heilmittelwerbegesetz)');
}
console.log(`\n${ok} bestanden, ${fehler} fehlgeschlagen`);
process.exit(fehler ? 1 : 0);
