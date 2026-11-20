/**
 * Clickculture Beauty-Zentrale – Online-Buchung und Automatik im Hintergrund.
 * Läuft als Google Apps Script in der Google-Tabelle „Clickculture Beauty-Zentrale“. Kostenlos.
 *
 * Was sie von selbst macht:
 *  1. Freie Termine: Die Seite des Kunden fragt hier nach freien Zeiten. Die Zentrale schaut in den
 *     Google-Kalender des Studios (oder nur auf die buchbaren Zeiten im Modus „Wunschtermin“).
 *  2. Buchung: Der Termin wird reserviert (noch nicht fest). Der Besucher bekommt eine Mail
 *     „Bitte bestätigen“. Erst nach dem Klick dort ist der Termin fest. Nicht bestätigt → Platz wieder frei.
 *     Schutz gegen Fake-Termine: Bot-Falle, Zeit-Falle, Prüfung von Name, Telefon und E-Mail
 *     (Wegwerf-Adressen, Domain ohne Postfach), Sperrliste, nur ein offener Termin pro Person.
 *  3. Bestätigt → Termin im Kalender des Studios, Bestätigung mit Vorbereitung und Kalenderdatei an den
 *     Besucher, Mail an das Studio mit Knopf „Fake melden“.
 *  4. 24 Stunden vorher: Erinnerung mit Vorbereitung und Absage-Link an den Besucher.
 *  5. Abends 19 Uhr: Mail an jedes Studio „Wie waren die Termine heute?“ (erschienen · nicht erschienen · gekauft)
 *  6. Rückruf-Wünsche und Verlosungen (Netlify-Formulare) wie gewohnt: Mail mit „Zurückgerufen“, Erinnerung nach 60 Min.
 *  7. Montags 8 Uhr: offene Termine und Anfragen an jedes Studio, Übersicht an dich
 *  8. Erster Auftrag → Mail an dich: ab nächstem Monat Monatsgebühr
 *  9. 1. des Monats: Werbekosten eintragen, Rechnungen · 3. des Monats: Monatsreports als Entwurf in Gmail
 * 10. Täglich 7 Uhr: Verlosung ziehen, Akquise-Liste, Warnung wenn das Mail-Kontingent knapp wird
 *
 * Zu zweit: Einstellung „team“ (Name = E-Mail), Spalte „Betreuer“ im Blatt „Kunden“ und „Wer“ im Blatt „Akquise“.
 *   Hinweise gehen an alle in „Hinweise gehen an“; die Akquise-Liste und Report-Entwürfe an die zuständige Person.
 *
 * Einrichtung: Blatt „Start“ in der Tabelle oder nischen/beauty/zentrale/EINRICHTEN.md. An diesem Code nichts ändern.
 */

/* Stand geht nur nach vorne (Reihenfolge unten). Die Stände in NEBEN gehen immer und danach darf es weitergehen. */
var STAND = ['unbestätigt', 'angefragt', 'neu', 'nicht erreicht', 'erreicht', 'Termin', 'erschienen', 'Auftrag'];
var NEBEN = ['kein Interesse', 'abgesagt', 'nicht erschienen', 'Fake', 'verfallen'];
var OFFEN = ['unbestätigt', 'angefragt', 'Termin'];  /* blockieren einen Platz im Kalender */
var SEITEN = {
  'rueckruf': 'Rückruf', 'verlosung': 'Verlosung'
};
var GEWINNER = { 'Verlosung': 1 };
var KNOEPFE = {
  'zurueckgerufen': { text: 'Zurückgerufen', stand: 'erreicht', farbe: '#1F7A3F' },
  'nicht-erreicht': { text: 'Nicht erreicht', stand: 'nicht erreicht', farbe: '#6B665D' },
  'termin': { text: 'Termin vereinbart', stand: 'Termin', farbe: '#1A1917' },
  'wunsch-ok': { text: 'Termin bestätigen', stand: 'Termin', farbe: '#1F7A3F' },
  'wunsch-nein': { text: 'Passt nicht, ich rufe an', stand: 'neu', farbe: '#6B665D' },
  'erschienen': { text: 'Erschienen', stand: 'erschienen', farbe: '#1A1917' },
  'nicht-erschienen': { text: 'Nicht erschienen', stand: 'nicht erschienen', farbe: '#6B665D' },
  'auftrag': { text: 'Behandlung gekauft', stand: 'Auftrag', farbe: '#1F7A3F' },
  'kein-interesse': { text: 'Kein Interesse', stand: 'kein Interesse', farbe: '#9A3B2E' },
  'fake': { text: 'Fake melden', stand: 'Fake', farbe: '#9A3B2E' }
};
var WEGWERF = ['mailinator.com', 'guerrillamail.com', 'guerrillamail.de', 'sharklasers.com', 'grr.la', '10minutemail.com',
  '10minutemail.de', 'temp-mail.org', 'tempmail.com', 'tempmail.de', 'tempmail.net', 'trashmail.com', 'trashmail.de',
  'trash-mail.com', 'wegwerfmail.de', 'wegwerfmail.net', 'wegwerfemail.de', 'yopmail.com', 'yopmail.fr', 'dispostable.com',
  'getnada.com', 'maildrop.cc', 'mailnesia.com', 'spambog.com', 'spambog.de', 'fakeinbox.com', 'throwawaymail.com',
  'mohmal.com', 'emailondeck.com', 'mintemail.com', 'burnermail.io', 'tempr.email', 'discard.email', 'mail-temp.com',
  'spoofmail.de', 'muellmail.com', 'sofort-mail.de', 'byom.de', 'trashmail.ws', 'einrot.com', 'cuvox.de', 'armyspy.com',
  'dayrep.com', 'fleckens.hu', 'gustr.com', 'jourrapide.com', 'rhyta.com', 'superrito.com', 'teleworm.us'];
var WOCHENTAG = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
var WOCHENTAG_LANG = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
var MONATE = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
var TAG = 24 * 60 * 60 * 1000, MIN = 60000;


// ================================================================ Menü und Einrichtung

function onOpen() {
  SpreadsheetApp.getUi().createMenu('Clickculture')
    .addItem('1 · Einrichten (einmal, und nach jeder neuen Bereitstellung)', 'einrichten')
    .addItem('2 · Kalender der Kunden prüfen', 'kalenderPruefen')
    .addItem('3 · Test-Buchung durchspielen', 'testBuchung')
    .addSeparator()
    .addItem('Abend-Mail jetzt senden', 'abendMail')
    .addItem('Wochen-Mail jetzt senden', 'wochenMail')
    .addItem('Monatsreport-Entwürfe jetzt erstellen', 'monatsReportEntwuerfe')
    .addToUi();
}

function einrichten() {
  var ui = SpreadsheetApp.getUi(), s = einst_();
  ['Einstellungen', 'Kunden', 'Termine', 'Sperrliste', 'Werbekosten', 'Akquise'].forEach(blatt_);
  ['Kunden', 'Termine', 'Akquise', 'Sperrliste'].forEach(textSpalten_);
  checklisteSpalten_();
  if (!s.schluessel) {
    s.schluessel = Utilities.getUuid().replace(/-/g, '').slice(0, 24);
    einstSetzen_('schluessel', s.schluessel);
  }
  ScriptApp.getProjectTriggers().forEach(function (t) { ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('alle10Minuten').timeBased().everyMinutes(10).create();
  ScriptApp.newTrigger('abendMail').timeBased().everyDays(1).atHour(19).create();
  ScriptApp.newTrigger('wochenMail').timeBased().onWeekDay(ScriptApp.WeekDay.MONDAY).atHour(8).create();
  ScriptApp.newTrigger('monatsAnfang').timeBased().onMonthDay(1).atHour(7).create();
  ScriptApp.newTrigger('monatsReportEntwuerfe').timeBased().onMonthDay(3).atHour(7).create();
  ScriptApp.newTrigger('taeglich').timeBased().everyDays(1).atHour(7).create();
  var url = String(s.webapp_url || '').trim(), hinweise = [];
  if (url && !/^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(url)) {
    hinweise.push('Die Web-App-Adresse sieht falsch aus. Sie muss mit https://script.google.com/macros/s/ beginnen und auf /exec enden.');
  }
  if (!url) hinweise.push('Die Web-App-Adresse fehlt. Bitte Schritt 5 der Einrichtung machen und danach hier nochmal „Einrichten“ wählen.');
  if (s.tz !== 'Europe/Berlin') hinweise.push('Zeitzone ist „' + s.tz + '“. Bitte in Apps Script unter Projekteinstellungen (Zahnrad) auf „Berlin“ stellen.');
  if (!s.agentur_email) hinweise.push('Im Blatt „Einstellungen“ fehlt deine E-Mail.');
  if (!/^(ja|nein)$/i.test(String(s.agentur_kleinunternehmer || '').trim())) hinweise.push('Im Blatt „Einstellungen“ bei „Kleinunternehmer“ Ja oder Nein wählen, genauso wie im Steckbrief.');
  if (!s.agentur_steuernr) hinweise.push('Im Blatt „Einstellungen“ fehlt die Steuernummer (Pflicht auf jeder Rechnung).');
  ui.alert('Clickculture Beauty-Zentrale',
    'Die Automatik läuft. 6 Zeitpläne sind aktiv.\n\n' +
    (url ? 'Die Web-App-Adresse (für die Steckbrief-Vorlage, Blatt „Eure Daten“) und die Webhook-Adresse für Netlify stehen im Blatt „Einstellungen“.\n\n' : '') +
    (hinweise.length ? 'Noch zu tun:\n- ' + hinweise.join('\n- ') : 'Alles bereit. Zur Sicherheit die Web-App-Adresse einmal in einem privaten Browserfenster öffnen: Es muss „Diese Adresse ist in Ordnung“ erscheinen. Danach: „3 · Test-Buchung durchspielen“.'),
    ui.ButtonSet.OK);
}

/** Prüft für jeden aktiven Kunden im Modus „Kalender“, ob die Zentrale seinen Kalender lesen und beschreiben kann. */
function kalenderPruefen() {
  var ui = SpreadsheetApp.getUi(), s = einst_(), zeilen = [];
  kunden_().filter(function (k) { return k.aktiv; }).forEach(function (k) {
    if (k.modus !== 'Kalender') { zeilen.push('• ' + k.betrieb + ': Modus „Wunschtermin“ (kein Kalender nötig)'); return; }
    var cal = kalender_(k);
    if (!cal) { zeilen.push('• ' + k.betrieb + ': ✗ Kalender „' + k.kalender + '“ nicht erreichbar. Hat das Studio ihn für dich freigegeben (Änderungen an Terminen vornehmen)?'); return; }
    var n = freieSlots_(k, 'beratung', '', s).reduce(function (a, t) { return a + t.zeiten.length; }, 0);
    zeilen.push('• ' + k.betrieb + ': ✓ Kalender verbunden, ' + n + ' freie Beratungszeiten in den nächsten ' + k.tage + ' Tagen');
  });
  ui.alert('Kalender der Kunden', zeilen.join('\n') || 'Keine aktiven Kunden.', ui.ButtonSet.OK);
}

/** Spielt eine Buchung durch: freier Platz beim ersten aktiven Kunden, Bestätigungs-Mail geht an DICH. */
function testBuchung() {
  var ui = SpreadsheetApp.getUi(), s = einst_(), k = kunden_().filter(function (x) { return x.aktiv; })[0];
  if (!k) { ui.alert('Erst im Blatt „Kunden“ eine Zeile anlegen (zum Testen dich selbst mit deiner E-Mail).'); return; }
  var tage = freieSlots_(k, 'beratung', '', s);
  if (!tage.length) { ui.alert('Bei ' + k.betrieb + ' gibt es keinen freien Platz. Buchbare Zeiten und Kalender prüfen.'); return; }
  var r = buchen_({ kunde: k.kuerzel, art: 'beratung', start: tage[0].datum + 'T' + tage[0].zeiten[0], name: 'TEST Anna Beispiel',
    telefon: '0151 23456781', email: s.an.split(',')[0], ms: 60000, quelle: 'test', test: true }, s);
  ui.alert(r.ok ? 'Test-Buchung angelegt (' + tage[0].label + ', ' + tage[0].zeiten[0] + ' Uhr).\n\nDie Mail „Bitte bestätigen“ ging an ' + s.an.split(',')[0] +
    '. Dort auf den Knopf tippen und auf der Seite bestätigen. Dann: Termin im Kalender des Studios, Bestätigung an dich, Mail an das Studio.\n\nDanach im Blatt „Termine“ die TEST-Zeile auf „abgesagt“ und den Kalendereintrag löschen.'
    : 'Das hat nicht geklappt: ' + r.fehler);
}

/** Läuft von selbst bei jeder Änderung in der Tabelle (einfacher Trigger, keine Einrichtung nötig). */
function onEdit(e) {
  try {
    if (e && e.range && e.range.getSheet().getName() === 'Kunden') checklisteSpalten_();
  } catch (err) { /* nie die Eingabe stören */ }
}

function checklisteSpalten_() {
  var ck = SpreadsheetApp.getActive().getSheetByName('Checkliste');
  if (!ck) return;
  var werte = ck.getDataRange().getValues(), kopf = (werte[0] || []).map(function (v) { return String(v).trim().toLowerCase(); });
  var letzteAufgabe = 2;
  for (var r = 2; r < werte.length; r++) if (String(werte[r][1]).trim()) letzteAufgabe = r + 1;
  var spalte = kopf.length;
  while (spalte > 3 && !kopf[spalte - 1]) spalte--;
  kunden_().forEach(function (k) {
    if (kopf.indexOf(k.kuerzel) >= 0) return;
    spalte++;
    var b = spaltenBuchstabe_(spalte);
    ck.getRange(1, spalte).setValue(k.kuerzel);
    formelSetzen_(ck.getRange(2, spalte), '=IFERROR(COUNTIF(' + b + '3:' + b + letzteAufgabe + ',"Ja")/' + (letzteAufgabe - 2) + ',0)');
    ck.getRange(2, spalte).setNumberFormat('0%');
    kopf[spalte - 1] = k.kuerzel;
  });
}

function formelSetzen_(zelle, formel) {
  zelle.setFormula(formel);
  SpreadsheetApp.flush();
  if (/^#(ERROR|FEHLER)/i.test(String(zelle.getDisplayValue()))) zelle.setFormula(formel.replace(/,/g, ';'));
}

function spaltenBuchstabe_(n) {
  var s = '';
  while (n > 0) { var m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = Math.floor((n - 1) / 26); }
  return s;
}


// ================================================================ Schnittstelle für die Seiten (GET und POST)

function doGet(e) {
  var p = (e && e.parameter) || {};
  if (p.a === 'slots') return json_(sicherJson_(function () { return slotsAnfrage_(p); }));
  if (p.a === 'info') return json_(sicherJson_(function () { return infoAnfrage_(p); }));
  if (!p.id) return seite_('Clickculture Zentrale', 'Diese Adresse ist in Ordnung. Sie wird für die Online-Buchung und die Knöpfe in den Mails gebraucht.');
  return knopfSeite_(p);
}

function doPost(e) {
  var p = (e && e.parameter) || {};
  if (p.key !== undefined) return netlifyWebhook_(e);
  var d = {};
  try { d = JSON.parse((e && e.postData && e.postData.contents) || '{}'); } catch (err) { return json_({ ok: false, fehler: 'Ungültige Anfrage.' }); }
  var s = einst_();
  if (d.a === 'buchen') return json_(gesperrt_(function () { return buchen_(d, s); }));
  if (d.a === 'bestaetigen') return json_(gesperrt_(function () { return bestaetigen_(d.id, d.t, s); }));
  if (d.a === 'absagen') return json_(gesperrt_(function () { return absagen_(d.id, d.t, s); }));
  return json_({ ok: false, fehler: 'Unbekannte Aktion.' });
}

function gesperrt_(fn) {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try { return sicherJson_(fn); } finally { SpreadsheetApp.flush(); lock.releaseLock(); }
}

function sicherJson_(fn) {
  try { return fn(); } catch (err) {
    fehler_('Online-Buchung', err);
    return { ok: false, fehler: 'Gerade hat etwas nicht geklappt. Bitte versuchen Sie es gleich nochmal oder rufen Sie uns an.' };
  }
}

function slotsAnfrage_(p) {
  var s = einst_(), k = kunde_(p.k);
  if (!k || !k.aktiv) return { ok: false, fehler: 'Die Online-Buchung ist gerade nicht verfügbar.' };
  var art = p.art === 'behandlung' ? 'behandlung' : 'beratung';
  var dauer = dauer_(k, art, p.l);
  if (!dauer) return { ok: false, fehler: 'Diese Leistung ist online nicht buchbar.' };
  var cache = CacheService.getScriptCache(), schl = 'slots_' + k.kuerzel + '_' + art + '_' + dauer;
  var alt = cache.get(schl);
  if (alt) return JSON.parse(alt);
  var r = { ok: true, dauer: dauer, modus: k.modus, tage: freieSlots_(k, art, p.l, s) };
  cache.put(schl, JSON.stringify(r), 90);
  return r;
}

function infoAnfrage_(p) {
  var t = tabelle_('Termine'), z = zeileMitId_(t, p.id);
  if (!z || String(t.get(z, 'Kunden-Schlüssel')) !== String(p.t)) return { ok: false, fehler: 'Dieser Link ist nicht (mehr) gültig.' };
  var k = kunde_(t.get(z, 'Kunde')), start = datum_(t.get(z, 'Termin'));
  return { ok: true, stand: String(t.get(z, 'Stand')), name: String(t.get(z, 'Name')), leistung: String(t.get(z, 'Leistung')),
    termin: start ? terminText_(start) : '', vergangen: !!(start && start < new Date()), betrieb: k ? k.betrieb : '',
    telefon: k ? k.telefon : '' };
}


// ================================================================ Freie Zeiten

/** Freie Startzeiten, gruppiert nach Tag: [{datum:'2027-01-12', label:'Di, 12.01.', zeiten:['09:00', …]}] */
function freieSlots_(k, art, leistung, s) {
  var dauer = dauer_(k, art, leistung);
  if (!dauer) return [];
  var fenster = buchbareZeiten_(k.zeiten), jetzt = new Date();
  var ab = new Date(jetzt.getTime() + k.vorlauf * 60 * MIN);
  var heute = new Date(jetzt.getFullYear(), jetzt.getMonth(), jetzt.getDate());
  var bis = new Date(heute.getFullYear(), heute.getMonth(), heute.getDate() + k.tage + 1);
  var belegt = belegt_(k, heute, bis, s), raster = k.raster || Number(s.raster_minuten) || 30, puffer = k.puffer * MIN, tage = [];
  for (var d = new Date(heute); d < bis; d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1)) {
    var wt = d.getDay() === 0 ? 7 : d.getDay(), zeiten = [];
    (fenster[wt] || []).forEach(function (f) {
      for (var m = f[0]; m + dauer <= f[1]; m += raster) {
        var st = new Date(d.getFullYear(), d.getMonth(), d.getDate(), Math.floor(m / 60), m % 60);
        var en = new Date(st.getTime() + dauer * MIN);
        if (st < ab) continue;
        var frei = !belegt.some(function (b) { return st.getTime() < b[1] + puffer && en.getTime() > b[0] - puffer; });
        if (frei) zeiten.push(zwei_(st.getHours()) + ':' + zwei_(st.getMinutes()));
      }
    });
    if (zeiten.length) tage.push({ datum: d.getFullYear() + '-' + zwei_(d.getMonth() + 1) + '-' + zwei_(d.getDate()),
      label: WOCHENTAG[d.getDay()] + ', ' + zwei_(d.getDate()) + '.' + zwei_(d.getMonth() + 1) + '.', zeiten: zeiten });
  }
  return tage;
}

/** Belegte Zeiten [start, ende] in ms: Kalender des Studios (Modus Kalender) + offene Buchungen aus „Termine“. */
function belegt_(k, von, bis, s) {
  var liste = [];
  if (k.modus === 'Kalender') {
    var cal = kalender_(k);
    if (!cal) throw new Error('Kalender von ' + k.betrieb + ' (' + k.kalender + ') nicht erreichbar. Freigabe prüfen (Menü „2 · Kalender der Kunden prüfen“).');
    cal.getEvents(von, bis).forEach(function (ev) {
      try { if (String(ev.getTransparency && ev.getTransparency()) === 'TRANSPARENT') return; } catch (e) { /* egal */ }
      if (ev.isAllDayEvent()) {
        var a = ev.getAllDayStartDate(), b = ev.getAllDayEndDate();
        liste.push([a.getTime(), b.getTime()]);
      } else liste.push([ev.getStartTime().getTime(), ev.getEndTime().getTime()]);
    });
  }
  var t = tabelle_('Termine'), jetzt = new Date();
  t.zeilen.forEach(function (z) {
    if (String(t.get(z, 'Kunde')) !== k.kuerzel || !aktivGebucht_(t, z, s, jetzt)) return;
    var st = datum_(t.get(z, 'Termin'));
    if (st) liste.push([st.getTime(), st.getTime() + (Number(t.get(z, 'Dauer')) || 30) * MIN]);
  });
  return liste;
}

/** Hält diese Zeile gerade einen Platz? (unbestätigt und noch in der Frist, angefragt, Termin) */
function aktivGebucht_(t, z, s, jetzt) {
  var st = String(t.get(z, 'Stand'));
  if (OFFEN.indexOf(st) < 0 || !datum_(t.get(z, 'Termin'))) return false;
  if (st === 'unbestätigt') {
    var ein = datum_(t.get(z, 'Eingang'));
    return !!ein && jetzt - ein < haltMinuten_(s) * MIN;
  }
  return true;
}

function haltMinuten_(s) { return Number(s.bestaetigung_minuten) || 45; }

/** „Mo-Fr 9-18; Sa 10-14“ · „Di, Do 9:30-13 14-18“ → {1:[[540,1080]], …} (1 = Montag … 7 = Sonntag, Minuten ab 0 Uhr) */
function buchbareZeiten_(text) {
  var tage = { mo: 1, di: 2, mi: 3, do: 4, fr: 5, sa: 6, so: 7 }, out = {};
  String(text || '').split(/[;\n]/).forEach(function (teil) {
    var zahl = teil.search(/\d/);
    if (zahl < 0) return;
    var tagText = teil.slice(0, zahl).toLowerCase(), welche = [];
    var re = /(mo|di|mi|do|fr|sa|so)[a-z]*\.?(\s*[-–]\s*(mo|di|mi|do|fr|sa|so)[a-z]*\.?)?/g, m;
    while ((m = re.exec(tagText))) {
      var a = tage[m[1]], b = m[3] ? tage[m[3]] : a;
      for (var i = a; i <= b; i++) welche.push(i);
    }
    var zre = /(\d{1,2})(?:[:.](\d{2}))?\s*(?:uhr\s*)?[-–]\s*(\d{1,2})(?:[:.](\d{2}))?/gi, zz, spannen = [];
    while ((zz = zre.exec(teil.slice(zahl)))) spannen.push([Number(zz[1]) * 60 + Number(zz[2] || 0), Number(zz[3]) * 60 + Number(zz[4] || 0)]);
    welche.forEach(function (w) { out[w] = (out[w] || []).concat(spannen); });
  });
  return out;
}

/** Dauer in Minuten: Beratung aus der Spalte „Beratung Minuten“, Behandlung aus „Leistungen“ (Name | Minuten | Preis; …). */
function dauer_(k, art, leistung) {
  if (art !== 'behandlung') return k.beratung;
  var l = leistung_(k, leistung);
  return l ? l.minuten : 0;
}

function leistung_(k, name) {
  var n = String(name || '').trim().toLowerCase();
  return k.leistungen.filter(function (l) { return l.name.toLowerCase() === n; })[0] || null;
}

function leistungenLesen_(text) {
  return String(text || '').split(';').map(function (x) {
    var t = x.split('|').map(function (y) { return y.trim(); });
    return { name: t[0], minuten: Number(t[1]) || 0, preis: t[2] || '' };
  }).filter(function (l) { return l.name && l.minuten > 0; });
}

function kalender_(k) {
  if (!k.kalender) return null;
  var cal = CalendarApp.getCalendarById(k.kalender);
  if (!cal) {
    try { cal = CalendarApp.subscribeToCalendar(k.kalender); } catch (e) { cal = null; }
  }
  return cal;
}


// ================================================================ Buchen, bestätigen, absagen

function buchen_(d, s) {
  var txt = function (v) { return v == null ? '' : String(v).trim(); };
  var k = kunde_(d.kunde);
  if (!k || !k.aktiv) return { ok: false, fehler: 'Die Online-Buchung ist gerade nicht verfügbar. Bitte rufen Sie uns an.' };
  // 1 · Bot-Fallen: still „ok“ melden, nichts anlegen (der Bot soll nicht lernen, woran es lag)
  if (txt(d.hp) || (Number(d.ms) > 0 && Number(d.ms) < 3000) || !d.ms) {
    zaehlen_('bots_' + k.kuerzel + '_' + monatSchluessel_(new Date()));
    return { ok: true, id: 'X' + new Date().getTime(), frist: haltMinuten_(s) };
  }
  // 2 · Angaben prüfen
  var name = txt(d.name).replace(/\s+/g, ' '), email = txt(d.email).toLowerCase(), tel = telefon_(d.telefon);
  if (!nameOk_(name)) return { ok: false, feld: 'name', fehler: 'Bitte geben Sie Ihren Vor- und Nachnamen an.' };
  if (!tel) return { ok: false, feld: 'telefon', fehler: 'Bitte prüfen Sie Ihre Telefonnummer (z. B. 0151 23456789).' };
  var mail = emailPruefen_(email);
  if (mail) return { ok: false, feld: 'email', fehler: mail };
  if (gesperrt__(k.kuerzel, tel, email)) {
    return { ok: false, fehler: 'Eine Online-Buchung ist leider nicht möglich. Bitte rufen Sie uns an: ' + k.telefon };
  }
  // 3 · Termin prüfen
  var art = d.art === 'behandlung' ? 'behandlung' : 'beratung', l = art === 'behandlung' ? leistung_(k, d.leistung) : null;
  if (art === 'behandlung' && !l) return { ok: false, fehler: 'Diese Leistung ist online nicht buchbar.' };
  var dauer = dauer_(k, art, d.leistung), start = startAusText_(d.start);
  if (!start) return { ok: false, fehler: 'Bitte wählen Sie einen Termin.' };
  var t = tabelle_('Termine'), jetzt = new Date();
  var schon = t.zeilen.filter(function (z) {
    if (String(t.get(z, 'Kunde')) !== k.kuerzel || !aktivGebucht_(t, z, s, jetzt)) return false;
    var st = datum_(t.get(z, 'Termin'));
    return st && st > jetzt && (ziffern_(t.get(z, 'Telefon')) === ziffern_(tel) || String(t.get(z, 'E-Mail')).toLowerCase() === email);
  })[0];
  if (schon && !d.test) {
    return { ok: false, fehler: 'Sie haben bei uns schon einen Termin am ' + terminText_(datum_(t.get(schon, 'Termin'))) +
      '. Zum Verschieben sagen Sie ihn bitte über den Link in Ihrer Mail ab und buchen neu.' };
  }
  var flut = t.zeilen.filter(function (z) {
    var ein = datum_(t.get(z, 'Eingang'));
    return String(t.get(z, 'Kunde')) === k.kuerzel && String(t.get(z, 'Stand')) === 'unbestätigt' && ein && jetzt - ein < 30 * MIN;
  }).length;
  if (flut >= (Number(s.max_unbestaetigt) || 6)) {
    warnungEinmal_(s, 'flut_' + k.kuerzel, '⚠ Viele unbestätigte Buchungen bei ' + k.betrieb + (k.betreuer ? ' (' + k.betreuer + ')' : ''),
      'In den letzten 30 Minuten kamen ' + flut + ' Buchungen, die noch niemand bestätigt hat. Neue Buchungen sind kurz gesperrt. Möglicherweise ein Bot oder jemand, der Termine blockieren will. Blatt „Termine“ ansehen.');
    return { ok: false, fehler: 'Gerade sind sehr viele Anfragen gleichzeitig. Bitte rufen Sie uns kurz an: ' + k.telefon };
  }
  var frei = freieSlots_(k, art, d.leistung, s).some(function (tg) {
    return tg.zeiten.some(function (z) { return tg.datum + 'T' + z === String(d.start).slice(0, 16); });
  });
  if (!frei) return { ok: false, fehler: 'Dieser Termin ist leider gerade vergeben worden. Bitte wählen Sie einen anderen.', weg: true };
  // 4 · Reservieren und Bestätigungs-Mail schicken
  var id = 'B' + jetzt.getTime().toString(36).toUpperCase() + Math.floor(Math.random() * 1296).toString(36).toUpperCase();
  var ks = neuerSchluessel_();
  var quelle = quelle_(d), details = [];
  if (txt(d.nachricht)) details.push('Nachricht: ' + txt(d.nachricht).slice(0, 500));
  if (txt(d.utm_campaign)) details.push('Anzeige: ' + txt(d.utm_campaign));
  zeileAnhaengen_(t, {
    'ID': id, 'Eingang': jetzt, 'Kunde': k.kuerzel, 'Art': art === 'behandlung' ? 'Behandlung' : 'Beratung',
    'Leistung': l ? l.name : 'Beratung', 'Termin': start, 'Dauer': dauer, 'Name': name, 'Telefon': tel, 'E-Mail': email,
    'Quelle': quelle, 'Stand': 'unbestätigt', 'Details': details.join(' · '), 'Schlüssel': neuerSchluessel_(), 'Kunden-Schlüssel': ks
  });
  cacheLeeren_(k);
  var link = k.seite + '/bestaetigen.html?id=' + encodeURIComponent(id) + '&t=' + ks;
  mail_(s, {
    to: email, absender: k.betrieb, antwortAn: k.email,
    subject: 'Bitte bestätigen: Ihr Termin am ' + terminText_(start),
    html: rahmen_('<p style="font-size:16px;">Hallo ' + esc_(name) + ',</p>' +
      '<p style="font-size:16px;">wir halten diesen Termin für Sie frei:</p>' + terminBox_(k, l ? l.name : 'Beratung', start, dauer) +
      '<p style="font-size:16px;"><b>Bitte bestätigen Sie ihn innerhalb von ' + haltMinuten_(s) + ' Minuten.</b> Erst dann ist er fest gebucht.</p>' +
      grosserKnopf_(link, 'Termin bestätigen') +
      '<p style="font-size:13px;color:#6B665D;">Sie haben nichts gebucht? Dann ignorieren Sie diese Mail einfach, der Platz wird wieder frei.</p>')
  });
  return { ok: true, id: id, frist: haltMinuten_(s) };
}

function bestaetigen_(id, token, s) {
  var t = tabelle_('Termine'), z = zeileMitId_(t, id);
  if (!z || String(t.get(z, 'Kunden-Schlüssel')) !== String(token)) return { ok: false, fehler: 'Dieser Link ist nicht (mehr) gültig.' };
  var k = kunde_(t.get(z, 'Kunde')), st = String(t.get(z, 'Stand')), start = datum_(t.get(z, 'Termin')), jetzt = new Date();
  if (!k) return { ok: false, fehler: 'Die Online-Buchung ist gerade nicht verfügbar.' };
  var info = { ok: true, termin: terminText_(start), leistung: String(t.get(z, 'Leistung')), betrieb: k.betrieb, telefon: k.telefon };
  if (st === 'Termin' || st === 'angefragt' || st === 'erschienen' || st === 'Auftrag') { info.stand = st; info.schon = true; return info; }
  if (st !== 'unbestätigt' && st !== 'verfallen') return { ok: false, fehler: 'Dieser Termin wurde abgesagt. Buchen Sie gern einen neuen.', neu: true };
  if (start < jetzt) return { ok: false, fehler: 'Dieser Termin liegt schon in der Vergangenheit. Buchen Sie gern einen neuen.', neu: true };
  if (st === 'verfallen' || !aktivGebucht_(t, z, s, jetzt)) {
    // Frist verpasst: geht trotzdem, wenn der Platz noch frei ist
    t.set(z, 'Stand', 'verfallen');
    var frei = freieSlots_(k, String(t.get(z, 'Art')) === 'Behandlung' ? 'behandlung' : 'beratung', t.get(z, 'Leistung'), s).some(function (tg) {
      return tg.zeiten.some(function (x) { return tg.datum + 'T' + x === textAusStart_(start); });
    });
    if (!frei) return { ok: false, fehler: 'Die Frist ist abgelaufen und der Termin inzwischen vergeben. Bitte wählen Sie einen neuen.', neu: true };
  }
  t.set(z, 'Bestätigt am', jetzt);
  cacheLeeren_(k);
  if (k.modus === 'Kalender') {
    t.set(z, 'Stand', 'Termin');
    eintragen_(t, z, k);
    bestaetigungAnKunde_(t, z, k, s);
    neuerTerminAnStudio_(t, z, k, s, false);
    info.stand = 'Termin';
  } else {
    t.set(z, 'Stand', 'angefragt');
    neuerTerminAnStudio_(t, z, k, s, true);
    info.stand = 'angefragt';
  }
  return info;
}

function absagen_(id, token, s) {
  var t = tabelle_('Termine'), z = zeileMitId_(t, id);
  if (!z || String(t.get(z, 'Kunden-Schlüssel')) !== String(token)) return { ok: false, fehler: 'Dieser Link ist nicht (mehr) gültig.' };
  var k = kunde_(t.get(z, 'Kunde')), st = String(t.get(z, 'Stand')), start = datum_(t.get(z, 'Termin')), jetzt = new Date();
  var info = { ok: true, termin: terminText_(start), betrieb: k ? k.betrieb : '', telefon: k ? k.telefon : '' };
  if (st === 'abgesagt') { info.schon = true; return info; }
  if (OFFEN.indexOf(st) < 0 && st !== 'verfallen') return { ok: false, fehler: 'Dieser Termin kann online nicht mehr abgesagt werden. Bitte rufen Sie uns an' + (k ? ': ' + k.telefon : '.') };
  if (start && start < jetzt) return { ok: false, fehler: 'Der Termin hat schon begonnen. Bitte rufen Sie uns an' + (k ? ': ' + k.telefon : '.') };
  var warFest = st === 'Termin' || st === 'angefragt';
  t.set(z, 'Stand', 'abgesagt');
  t.set(z, 'Abgesagt am', jetzt);
  austragen_(t, z, k);
  if (k) cacheLeeren_(k);
  if (k && warFest) {
    var kurz = start && start - jetzt < k.absagefrist * 60 * MIN;
    mail_(s, { to: k.email, absender: k.betrieb + ' · Termine',
      subject: 'Abgesagt: ' + t.get(z, 'Name') + ', ' + terminText_(start) + (kurz ? ' (kurzfristig)' : ''),
      html: rahmen_('<p><b>' + esc_(t.get(z, 'Name')) + '</b> hat den Termin am <b>' + esc_(terminText_(start)) + '</b> (' + esc_(t.get(z, 'Leistung')) + ') online abgesagt.' +
        (k.modus === 'Kalender' ? ' Der Eintrag ist aus Ihrem Kalender entfernt, der Platz ist wieder online buchbar.' : ' Der Platz ist wieder online buchbar.') + '</p>' +
        '<p>Telefon: <a href="tel:' + esc_(t.get(z, 'Telefon')) + '">' + esc_(t.get(z, 'Telefon')) + '</a></p>') });
  }
  info.kurzfristig = !!(start && k && start - jetzt < k.absagefrist * 60 * MIN);
  return info;
}

/** Termin in den Kalender des Studios schreiben (nur Modus Kalender). */
function eintragen_(t, z, k) {
  var cal = kalender_(k);
  if (!cal) throw new Error('Kalender von ' + k.betrieb + ' nicht erreichbar, Termin ' + t.get(z, 'ID') + ' nicht eingetragen.');
  var start = datum_(t.get(z, 'Termin')), ende = new Date(start.getTime() + (Number(t.get(z, 'Dauer')) || 30) * MIN);
  var ev = cal.createEvent(t.get(z, 'Leistung') + ': ' + t.get(z, 'Name') + ' (online gebucht)', start, ende, {
    description: 'Telefon: ' + t.get(z, 'Telefon') + '\nE-Mail: ' + t.get(z, 'E-Mail') +
      (t.get(z, 'Details') ? '\n' + t.get(z, 'Details') : '') + '\nOnline gebucht und per E-Mail bestätigt. Nr. ' + t.get(z, 'ID'),
    location: k.adresse
  });
  t.set(z, 'Kalender-Eintrag', ev.getId());
}

function austragen_(t, z, k) {
  var evId = String(t.get(z, 'Kalender-Eintrag') || '');
  if (!evId || !k) return;
  try {
    var cal = kalender_(k), ev = cal && cal.getEventById(evId);
    if (ev) ev.deleteEvent();
    t.set(z, 'Kalender-Eintrag', '');
  } catch (e) { fehler_('Kalendereintrag löschen', e); }
}


// ================================================================ Prüfungen gegen Fake-Buchungen

/** Deutsche (und Nachbarländer-) Nummern → „+4915123456789“, sonst ''. Offensichtliche Fantasienummern fallen raus. */
function telefon_(roh) {
  var n = String(roh || '').replace(/[^\d+]/g, '');
  if (/^00/.test(n)) n = '+' + n.slice(2);
  else if (/^0/.test(n)) n = '+49' + n.slice(1);
  if (!/^\+\d{8,15}$/.test(n)) return '';
  if (/^\+490/.test(n)) n = '+49' + n.slice(4);
  var national = n.slice(3);
  if (/^\+49/.test(n)) {
    if (national.length < 7 || national.length > 12 || /^0/.test(national)) return '';
    if (/^1/.test(national) && !/^1[5-7]\d{8,9}$/.test(national)) return '';
  }
  if (/(\d)\1{5,}/.test(national) || /^(0123456|1234567|2345678|3456789|9876543|8765432|7654321)$/.test(national.slice(-7))) return '';
  return n;
}

function nameOk_(n) {
  if (n.length < 3 || n.length > 60 || /[@<>\/\\]|http|www\./i.test(n)) return false;
  if ((n.match(/\d/g) || []).length > 0) return false;
  return (n.match(/[A-Za-zÀ-ÖØ-öø-ÿĀ-žß]/g) || []).length >= 3 && /\s/.test(n);
}

function emailPruefen_(email) {
  if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email)) return 'Bitte prüfen Sie Ihre E-Mail-Adresse. Dorthin schicken wir die Bestätigung.';
  var domain = email.split('@')[1];
  if (WEGWERF.indexOf(domain) >= 0) return 'Bitte nutzen Sie Ihre normale E-Mail-Adresse. Dorthin schicken wir die Bestätigung.';
  if (!domainNimmtPost_(domain)) return 'An diese E-Mail-Adresse kann nichts zugestellt werden. Bitte prüfen Sie sie.';
  return '';
}

/** Hat die Domain ein Postfach (MX- oder A-Eintrag)? Fragt Googles DNS. Im Zweifel ja. */
function domainNimmtPost_(domain) {
  var cache = CacheService.getScriptCache(), schl = 'mx_' + domain, alt = cache.get(schl);
  if (alt) return alt === 'ja';
  var ok = true;
  try {
    var frag = function (typ) {
      var r = UrlFetchApp.fetch('https://dns.google/resolve?name=' + encodeURIComponent(domain) + '&type=' + typ, { muteHttpExceptions: true });
      return r.getResponseCode() === 200 ? JSON.parse(r.getContentText()) : null;
    };
    var mx = frag('MX');
    if (mx && mx.Status === 3) ok = false;
    else if (mx && mx.Status === 0 && !(mx.Answer || []).length) {
      var a = frag('A');
      ok = !(a && a.Status === 0 && !(a.Answer || []).length);
    }
  } catch (e) { ok = true; }
  cache.put(schl, ok ? 'ja' : 'nein', 6 * 3600);
  return ok;
}

function gesperrt__(kuerzel, tel, email) {
  var sp = tabelle_('Sperrliste'), t = ziffern_(tel);
  return sp.zeilen.some(function (z) {
    var w = String(sp.get(z, 'Telefon oder E-Mail')).trim().toLowerCase(), fuer = String(sp.get(z, 'Kunde')).trim().toLowerCase();
    if (!w || (fuer && fuer !== kuerzel)) return false;
    return w === email || (ziffern_(w).length >= 7 && ziffern_(telefon_(w) || w) === t);
  });
}

function sperren_(t, z, grund) {
  var sp = tabelle_('Sperrliste'), jetzt = new Date();
  [t.get(z, 'Telefon'), t.get(z, 'E-Mail')].forEach(function (w) {
    if (!String(w).trim()) return;
    zeileAnhaengen_(sp, { 'Telefon oder E-Mail': String(w).trim(), 'Kunde': t.get(z, 'Kunde'), 'Grund': grund, 'Am': jetzt });
  });
}


// ================================================================ Mails rund um den Termin

function bestaetigungAnKunde_(t, z, k, s) {
  var start = datum_(t.get(z, 'Termin')), dauer = Number(t.get(z, 'Dauer')) || 30, id = t.get(z, 'ID');
  var absagen = k.seite + '/absagen.html?id=' + encodeURIComponent(id) + '&t=' + t.get(z, 'Kunden-Schlüssel');
  mail_(s, {
    to: t.get(z, 'E-Mail'), absender: k.betrieb, antwortAn: k.email,
    subject: 'Bestätigt: Ihr Termin am ' + terminText_(start),
    html: rahmen_('<p style="font-size:16px;">Hallo ' + esc_(t.get(z, 'Name')) + ',</p>' +
      '<p style="font-size:16px;">Ihr Termin ist fest gebucht. Wir freuen uns auf Sie!</p>' + terminBox_(k, t.get(z, 'Leistung'), start, dauer) +
      vorbereitungHtml_(k) + absageHtml_(k, absagen) +
      '<p style="font-size:13px;color:#6B665D;">Im Anhang finden Sie den Termin für Ihren Kalender.</p>'),
    anhang: [Utilities.newBlob(ics_(id, k, t.get(z, 'Leistung'), start, dauer), 'text/calendar', 'termin.ics')]
  });
}

function neuerTerminAnStudio_(t, z, k, s, wunsch) {
  var start = datum_(t.get(z, 'Termin')), id = t.get(z, 'ID'), schl = t.get(z, 'Schlüssel');
  var tel = String(t.get(z, 'Telefon'));
  var knoepfe = wunsch ? knopf_(s, id, schl, 'wunsch-ok') + ' ' + knopf_(s, id, schl, 'wunsch-nein') + ' ' + knopf_(s, id, schl, 'fake', true)
    : knopf_(s, id, schl, 'fake', true);
  mail_(s, {
    to: k.email, absender: k.betrieb + ' · Termine',
    subject: (wunsch ? 'Terminwunsch – bitte bestätigen: ' : 'Neuer Online-Termin: ') + terminText_(start) + ' · ' + t.get(z, 'Leistung') + ' · ' + t.get(z, 'Name'),
    html: rahmen_(
      '<p style="font-size:15px;margin:0 0 6px;color:#6B665D;">' + (wunsch ? 'Terminwunsch' : 'Online gebucht') + ' · per E-Mail bestätigt · über ' + esc_(t.get(z, 'Quelle')) + '</p>' +
      '<h1 style="font-size:24px;margin:0 0 4px;">' + esc_(terminText_(start)) + '</h1>' +
      '<p style="font-size:17px;margin:0 0 14px;">' + esc_(t.get(z, 'Leistung')) + ' (' + esc_(t.get(z, 'Dauer')) + ' Min.)</p>' +
      '<p style="font-size:17px;margin:0 0 4px;"><b>' + esc_(t.get(z, 'Name')) + '</b></p>' +
      '<p style="font-size:16px;margin:0 0 14px;"><a href="tel:' + esc_(tel) + '" style="color:#1A1917;font-weight:700;">' + esc_(tel) + '</a> · ' + esc_(t.get(z, 'E-Mail')) + '</p>' +
      (t.get(z, 'Details') ? '<p style="font-size:14px;color:#3A3732;">' + esc_(t.get(z, 'Details')) + '</p>' : '') +
      (wunsch ? '<p style="font-size:15px;"><b>Bitte prüfen Sie in Ihrem Kalender, ob die Zeit passt, und tippen Sie dann:</b> Bei „Termin bestätigen“ bekommt Ihre Kundschaft sofort die Bestätigung mit Vorbereitung.</p>'
        : '<p style="font-size:15px;">Der Termin steht schon in Ihrem Kalender. Die Bestätigung mit Vorbereitung ist schon raus, 24 Stunden vorher kommt eine Erinnerung.</p>') +
      knoepfe +
      '<p style="font-size:13px;color:#6B665D;margin-top:14px;">„Fake melden“ nur, wenn die Buchung offensichtlich nicht echt ist (falsche Nummer, Scherz, Konkurrenz). Der Termin wird dann gelöscht und Nummer und E-Mail gesperrt.</p>')
  });
}

function erinnerungAnKunde_(t, z, k, s) {
  var start = datum_(t.get(z, 'Termin')), id = t.get(z, 'ID');
  var absagen = k.seite + '/absagen.html?id=' + encodeURIComponent(id) + '&t=' + t.get(z, 'Kunden-Schlüssel');
  mail_(s, {
    to: t.get(z, 'E-Mail'), absender: k.betrieb, antwortAn: k.email,
    subject: 'Erinnerung: Ihr Termin ' + (gleicherTag_(start, new Date(new Date().getTime() + TAG)) ? 'morgen' : 'am ' + WOCHENTAG_LANG[start.getDay()]) +
      ' um ' + uhrzeit_(start) + ' Uhr',
    html: rahmen_('<p style="font-size:16px;">Hallo ' + esc_(t.get(z, 'Name')) + ',</p>' +
      '<p style="font-size:16px;">wir freuen uns auf Sie:</p>' + terminBox_(k, t.get(z, 'Leistung'), start, Number(t.get(z, 'Dauer')) || 30) +
      vorbereitungHtml_(k) + absageHtml_(k, absagen))
  });
}

function terminBox_(k, leistung, start, dauer) {
  var karte = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(k.betrieb + ', ' + k.adresse);
  return '<table style="width:100%;border-collapse:collapse;background:#F6F3EE;border-radius:8px;margin:0 0 18px;font-size:16px;">' +
    '<tr><td style="padding:14px 16px 4px;color:#6B665D;width:90px;">Wann</td><td style="padding:14px 16px 4px;"><b>' + esc_(terminText_(start)) + '</b> (' + esc_(dauer) + ' Min.)</td></tr>' +
    '<tr><td style="padding:4px 16px;color:#6B665D;">Was</td><td style="padding:4px 16px;">' + esc_(leistung) + '</td></tr>' +
    '<tr><td style="padding:4px 16px;color:#6B665D;">Wo</td><td style="padding:4px 16px;">' + esc_(k.betrieb) + '<br>' + esc_(k.adresse) +
    '<br><a href="' + esc_(karte) + '" style="color:#1A1917;">In Google Maps öffnen</a></td></tr>' +
    '<tr><td style="padding:4px 16px 14px;color:#6B665D;">Telefon</td><td style="padding:4px 16px 14px;"><a href="tel:' + esc_(ziffernPlus_(k.telefon)) + '" style="color:#1A1917;">' + esc_(k.telefon) + '</a></td></tr></table>';
}

function vorbereitungHtml_(k) {
  var punkte = String(k.vorbereitung || '').split('•').map(function (x) { return x.trim(); }).filter(String);
  if (!punkte.length) return '';
  return '<h2 style="font-size:18px;margin:22px 0 8px;">So bereiten Sie sich vor</h2><ul style="font-size:15px;padding-left:20px;margin:0 0 18px;">' +
    punkte.map(function (p) { return '<li style="margin-bottom:6px;">' + esc_(p) + '</li>'; }).join('') + '</ul>' +
    '<p style="font-size:13px;color:#6B665D;">Sie nehmen Medikamente, sind schwanger oder unsicher, ob etwas zutrifft? Rufen Sie uns vorher kurz an.</p>';
}

function absageHtml_(k, link) {
  return '<h2 style="font-size:18px;margin:22px 0 8px;">Sie können doch nicht?</h2>' +
    '<p style="font-size:15px;margin:0 0 12px;">Bitte sagen Sie ' + (k.absagefrist ? 'spätestens ' + k.absagefrist + ' Stunden vorher ' : '') +
    'ab, dann bekommt jemand anderes den Platz. Zum Verschieben: absagen und auf unserer Seite neu buchen.</p>' +
    '<p><a href="' + esc_(link) + '" style="color:#9A3B2E;font-weight:700;">Termin absagen</a></p>' +
    (k.ausfall ? '<p style="font-size:13px;color:#6B665D;">' + esc_(k.ausfall) + '</p>' : '');
}

function ics_(id, k, leistung, start, dauer) {
  var utc = function (d) {
    return d.getUTCFullYear() + zwei_(d.getUTCMonth() + 1) + zwei_(d.getUTCDate()) + 'T' + zwei_(d.getUTCHours()) + zwei_(d.getUTCMinutes()) + '00Z';
  };
  var e = function (v) { return String(v || '').replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n'); };
  return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Clickculture//Termin//DE', 'METHOD:PUBLISH', 'BEGIN:VEVENT',
    'UID:' + id + '@clickculture', 'DTSTAMP:' + utc(new Date()), 'DTSTART:' + utc(start), 'DTEND:' + utc(new Date(start.getTime() + dauer * MIN)),
    'SUMMARY:' + e(leistung + ' · ' + k.betrieb), 'LOCATION:' + e(k.adresse), 'DESCRIPTION:' + e('Telefon ' + k.telefon),
    'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
}


// ================================================================ Knöpfe in den Mails an das Studio

function knopfSeite_(p) {
  var knopf = KNOEPFE[p.s];
  if (!knopf) return seite_('Unbekannter Knopf', 'Dieser Link ist nicht vollständig.');
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    var s = einst_(), t = tabelle_('Termine'), z = zeileMitId_(t, p.id);
    if (!z || String(t.get(z, 'Schlüssel')) !== String(p.t)) return seite_('Nicht gefunden', 'Dieser Link ist nicht (mehr) gültig.');
    var name = t.get(z, 'Name');
    if (p.ok !== '1') return nachfragen_(s, p, name, knopf);
    var neu = standSetzen_(t, z, p.s, p.w, s);
    return seite_('Gespeichert ✓', esc_(name) + ': <b>' + esc_(knopf.text) + '</b>.<br>Stand jetzt: ' + esc_(neu) + '.<br><br>Fertig. Sie können dieses Fenster schließen.');
  } catch (err) {
    fehler_('Knopf in einer Mail', err);
    return seite_('Das hat nicht geklappt', 'Bitte später nochmal versuchen.');
  } finally {
    SpreadsheetApp.flush();
    lock.releaseLock();
  }
}

function nachfragen_(s, p, name, knopf) {
  var wert = p.s === 'auftrag'
    ? '<label style="display:block;margin:0 0 16px;font-size:16px;">Wert in € (z. B. Paket oder Behandlung, wenn bekannt)<br>' +
      '<input name="w" inputmode="numeric" style="font-size:20px;padding:10px;width:100%;box-sizing:border-box;margin-top:6px;"></label>' : '';
  return seite_('Noch nicht gespeichert',
    '<p style="margin:0 0 6px;"><b>' + esc_(name) + '</b></p>' +
    '<p style="margin:0 0 20px;">Bitte unten auf den Knopf tippen. <b>Erst dann ist es eingetragen.</b></p>' +
    '<form method="get" action="' + esc_(basis_(s)) + '" target="_top">' +
    '<input type="hidden" name="id" value="' + esc_(p.id) + '"><input type="hidden" name="t" value="' + esc_(p.t) + '">' +
    '<input type="hidden" name="s" value="' + esc_(p.s) + '"><input type="hidden" name="ok" value="1">' + wert +
    '<button style="font-size:20px;padding:16px;width:100%;border:0;border-radius:6px;background:' + knopf.farbe +
    ';color:#fff;font-weight:700;">' + esc_(knopf.text) + ' ✓ eintragen</button></form>');
}

function standSetzen_(t, z, aktion, wert, s) {
  var jetzt = new Date(), alt = String(t.get(z, 'Stand') || 'neu'), knopf = KNOEPFE[aktion], k = kunde_(t.get(z, 'Kunde'));
  if ((aktion === 'zurueckgerufen' || aktion === 'nicht-erreicht') && !t.get(z, 'Zurückgerufen')) {
    t.set(z, 'Zurückgerufen', jetzt);
    var ein = datum_(t.get(z, 'Eingang'));
    if (ein) t.set(z, 'Minuten bis Rückruf', geschaeftsMinuten_(ein, jetzt, s));
  }
  if (aktion === 'fake') {
    austragen_(t, z, k);
    t.set(z, 'Stand', 'Fake');
    sperren_(t, z, 'vom Studio als Fake gemeldet');
    if (k) cacheLeeren_(k);
    return 'Fake (gelöscht und gesperrt)';
  }
  if (aktion === 'wunsch-ok' && alt === 'angefragt') {
    t.set(z, 'Stand', 'Termin');
    if (k && k.kalender && kalender_(k)) eintragen_(t, z, k);
    if (k) bestaetigungAnKunde_(t, z, k, s);
    return 'Termin (Bestätigung ist raus)';
  }
  if (aktion === 'wunsch-nein') {
    if (alt === 'angefragt') { t.set(z, 'Stand', 'neu'); t.set(z, 'Erinnert', jetzt); }
    return String(t.get(z, 'Stand'));
  }
  var neu = neuerStand_(alt, knopf.stand);
  if (neu !== alt) t.set(z, 'Stand', neu);
  if (aktion === 'auftrag' && zahl_(wert) > 0) t.set(z, 'Auftragswert €', zahl_(wert));
  if (neu === 'Auftrag' && alt !== 'Auftrag') {
    t.set(z, 'Auftrag am', jetzt);
    ersterAuftragPruefen_(t, z, s);
  }
  return neu;
}

function neuerStand_(alt, ziel) {
  if (NEBEN.indexOf(ziel) >= 0 || NEBEN.indexOf(alt) >= 0) return ziel;
  var ia = STAND.indexOf(alt), iz = STAND.indexOf(ziel);
  if (iz < 0) return alt;
  return iz > ia ? ziel : alt;
}

function ersterAuftragPruefen_(t, z, s) {
  var kuerzel = t.get(z, 'Kunde');
  var andere = t.zeilen.filter(function (x) {
    return x.nr !== z.nr && t.get(x, 'Kunde') === kuerzel && t.get(x, 'Stand') === 'Auftrag';
  });
  if (andere.length) return;
  var k = kunde_(kuerzel) || { betrieb: kuerzel, gebuehr: '' }, ab = ersterNaechsterMonat_(new Date());
  mail_(s, {
    to: s.an,
    subject: '🎉 Erster Auftrag bei ' + k.betrieb + (k.betreuer ? ' (' + k.betreuer + ')' : '') + ' – Monatsgebühr ab ' + monatName_(ab),
    html: rahmen_('<h1 style="font-size:22px;">Erster Auftrag bei ' + esc_(k.betrieb) + '</h1>' +
      '<p>' + esc_(t.get(z, 'Name')) + (zahl_(t.get(z, 'Auftragswert €')) ? ', Wert ' + euro_(t.get(z, 'Auftragswert €')) : '') + '.</p>' +
      '<p><b>Ab ' + monatName_(ab) + ' ist die Monatsgebühr fällig' + (k.gebuehr ? ' (' + euro_(k.gebuehr) + ')' : '') + '.</b></p>' +
      '<ol><li>Kunden anrufen und gratulieren.</li><li>Im Kundenordner „3 Rechnung“, Mail 2 schicken.</li>' +
      '<li>Ab dann erinnert dich die Zentrale jeden Monatsersten an die Rechnung.</li></ol>')
  });
}


// ================================================================ Rückruf-Wünsche und Verlosung (Netlify-Formulare)

function netlifyWebhook_(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    var s = einst_();
    if (!s.schluessel || String(e.parameter.key) !== String(s.schluessel)) return text_('falscher Schlüssel');
    var a = anfrageAusNetlify_(JSON.parse((e.postData && e.postData.contents) || '{}'));
    if (!a.name && !a.telefon) return text_('leer');
    return text_(neueAnfrage_(a, s));
  } catch (err) {
    fehler_('Neue Anfrage', err);
    return text_('fehler');
  } finally {
    SpreadsheetApp.flush();
    lock.releaseLock();
  }
}

function anfrageAusNetlify_(roh) {
  var p = roh && roh.payload ? roh.payload : (roh || {});
  var d = p.data || p;
  var txt = function (v) { return v == null ? '' : String(v).trim(); };
  var form = txt(p.form_name || d['form-name'] || d.aktion);
  var details = [];
  [['wunsch', 'Wunsch'], ['nachricht', 'Nachricht'], ['utm_campaign', 'Anzeige']].forEach(function (f) {
    if (txt(d[f[0]])) details.push(f[1] + ': ' + txt(d[f[0]]));
  });
  return {
    id: txt(p.id || p.number) || ('A' + new Date().getTime()),
    eingang: p.created_at ? new Date(p.created_at) : new Date(),
    kunde: (txt(d.kunde) || slugAusUrl_(p.site_url || d.referrer)).toLowerCase(),
    name: txt(d.name), telefon: telefon_(d.telefon) || txt(d.telefon), email: txt(d.email),
    art: SEITEN[form] || 'Rückruf', quelle: quelle_(d), details: details.join(' · ')
  };
}

function slugAusUrl_(u) {
  var m = String(u || '').match(/^https?:\/\/([^.\/]+)\.netlify\.app/i);
  return m ? m[1].toLowerCase() : '';
}

function quelle_(d) {
  var txt = function (v) { return v == null ? '' : String(v).trim(); };
  var q = txt(d.utm_source).toLowerCase();
  return /google|gads|adwords/.test(q) || (!q && txt(d.gclid)) ? 'Google'
    : /meta|facebook|instagram|^fb|^ig/.test(q) || (!q && txt(d.fbclid)) ? 'Meta'
    : q ? txt(d.utm_source) : 'direkt';
}

function neueAnfrage_(a, s) {
  var t = tabelle_('Termine');
  if (t.zeilen.some(function (z) { return String(t.get(z, 'ID')) === String(a.id); })) return 'doppelt';
  var k = kunde_(a.kunde), schl = neuerSchluessel_();
  if (k && gesperrt__(k.kuerzel, telefon_(a.telefon), String(a.email).toLowerCase())) {
    zeileAnhaengen_(t, { 'ID': a.id, 'Eingang': a.eingang, 'Kunde': a.kunde, 'Art': a.art, 'Name': a.name, 'Telefon': a.telefon,
      'E-Mail': a.email, 'Quelle': a.quelle, 'Stand': 'Fake', 'Details': 'gesperrt (Sperrliste) · ' + a.details, 'Schlüssel': schl });
    return 'gesperrt';
  }
  zeileAnhaengen_(t, {
    'ID': a.id, 'Eingang': a.eingang, 'Kunde': a.kunde, 'Art': a.art, 'Leistung': a.art, 'Name': a.name, 'Telefon': a.telefon,
    'E-Mail': a.email, 'Quelle': a.quelle, 'Stand': 'neu', 'Details': a.details, 'Schlüssel': schl
  });
  var aktiv = k && k.aktiv;
  var html = anfrageHtml_(a, s, schl, k);
  mail_(s, {
    to: aktiv ? k.email : s.an,
    subject: (aktiv ? '' : '[KUNDE ' + (k ? 'NICHT AKTIV' : 'UNBEKANNT') + ': ' + a.kunde + '] ') +
      (a.art === 'Verlosung' ? 'Verlosung: ' : 'Rückruf-Wunsch: ') + a.name + ' – bitte innerhalb von ' + s.rueckruf_minuten + ' Minuten anrufen',
    html: html, absender: aktiv ? k.betrieb + ' · Anfragen' : 'Clickculture Zentrale'
  });
  if (aktiv && /^ja/i.test(String(s.kopie_jeder_anfrage))) {
    mail_(s, { to: s.an, subject: 'Kopie · ' + k.betrieb + ': ' + a.art + ' von ' + a.name, html: html });
  }
  return 'ok';
}

function anfrageHtml_(a, s, schl, k) {
  var tel = String(a.telefon).replace(/[^\d+]/g, '');
  return rahmen_(
    '<p style="font-size:15px;margin:0 0 6px;color:#6B665D;">' + esc_(a.art === 'Verlosung' ? 'Teilnahme an der Verlosung' : 'Rückruf-Wunsch') + ' · über ' + esc_(a.quelle) + '</p>' +
    '<h1 style="font-size:24px;margin:0 0 4px;">' + esc_(a.name) + '</h1>' +
    '<p style="font-size:18px;margin:0 0 16px;"><a href="tel:' + esc_(tel) + '" style="color:#1A1917;font-weight:700;">' + esc_(a.telefon) + '</a>' +
    (a.email ? '<br><span style="font-size:15px;">' + esc_(a.email) + '</span>' : '') + '</p>' +
    (a.details ? '<p style="font-size:14px;color:#3A3732;margin:0 0 16px;">' + esc_(a.details) + '</p>' : '') +
    '<p style="font-size:15px;margin:0 0 16px;"><b>Bitte innerhalb von ' + s.rueckruf_minuten + ' Minuten anrufen</b> und einen Termin ausmachen. Danach hier tippen:</p>' +
    knopf_(s, a.id, schl, 'zurueckgerufen') + ' ' + knopf_(s, a.id, schl, 'nicht-erreicht') + ' ' + knopf_(s, a.id, schl, 'fake', true));
}


// ================================================================ Zeitpläne

function alle10Minuten() { sicher_('Alle 10 Minuten', function () {
  var s = einst_(), jetzt = new Date(), t = tabelle_('Termine'), geaendert = {};
  t.zeilen.forEach(function (z) {
    var st = String(t.get(z, 'Stand')), ein = datum_(t.get(z, 'Eingang')), start = datum_(t.get(z, 'Termin'));
    // a) nicht bestätigte Reservierungen verfallen lassen
    if (st === 'unbestätigt' && ein && jetzt - ein >= haltMinuten_(s) * MIN) {
      t.set(z, 'Stand', 'verfallen');
      geaendert[t.get(z, 'Kunde')] = true;
      return;
    }
    // b) Erinnerung 24 Stunden vor dem Termin (nur wenn mindestens 36 Stunden vorher gebucht, sonst kam die Bestätigung gerade erst)
    var vor = (Number(s.erinnerung_stunden) || 24) * 60 * MIN, best = datum_(t.get(z, 'Bestätigt am'));
    if (st === 'Termin' && start && !t.get(z, 'Erinnert') && start > jetzt && start - jetzt <= vor &&
        String(t.get(z, 'E-Mail')).indexOf('@') > 0 && best && start - best > vor + 12 * 60 * MIN) {
      var k = kunde_(t.get(z, 'Kunde'));
      if (k && k.aktiv) erinnerungAnKunde_(t, z, k, s);
      t.set(z, 'Erinnert', jetzt);
    }
  });
  Object.keys(geaendert).forEach(function (kz) { var k = kunde_(kz); if (k) cacheLeeren_(k); });
  pruefeRueckrufe_(s, t, jetzt);
}); }

function pruefeRueckrufe_(s, t, jetzt) {
  if (!inZeit_(jetzt, s)) return;
  t.zeilen.forEach(function (z) {
    if (String(t.get(z, 'Stand')) !== 'neu' || t.get(z, 'Zurückgerufen') || t.get(z, 'Erinnert')) return;
    var ein = datum_(t.get(z, 'Eingang'));
    if (!ein || jetzt - ein > 3 * TAG) return;
    var min = geschaeftsMinuten_(ein, jetzt, s);
    if (min < s.rueckruf_minuten) return;
    var k = kunde_(t.get(z, 'Kunde')), schl = t.get(z, 'Schlüssel');
    var a = { name: t.get(z, 'Name'), telefon: t.get(z, 'Telefon'), email: t.get(z, 'E-Mail'), art: t.get(z, 'Art'),
      quelle: t.get(z, 'Quelle'), id: t.get(z, 'ID'), details: t.get(z, 'Details') };
    if (k && k.aktiv) {
      mail_(s, { to: k.email, absender: k.betrieb + ' · Anfragen',
        subject: 'Erinnerung: ' + a.name + ' wartet seit ' + min + ' Minuten auf Ihren Rückruf',
        html: anfrageHtml_(a, s, schl, k) });
    }
    mail_(s, { to: s.an, subject: '⏰ ' + (k ? k.betrieb + (k.betreuer ? ' (' + k.betreuer + ')' : '') : t.get(z, 'Kunde')) + ': ' + a.name + ' seit ' + min + ' Min. ohne Rückruf',
      html: rahmen_('<p><b>' + esc_(k ? k.betrieb : t.get(z, 'Kunde')) + '</b> hat ' + esc_(a.name) + ' (' + esc_(a.telefon) +
        ') noch nicht zurückgerufen. Der Kunde ist erinnert. Am besten kurz anrufen.</p>') });
    t.set(z, 'Erinnert', jetzt);
  });
}

/** Abends: jedes Studio bekommt die Termine von heute (und offene von gestern) mit Knöpfen. */
function abendMail() { sicher_('Abend-Mail', function () {
  var s = einst_(), t = tabelle_('Termine'), jetzt = new Date();
  var morgen = new Date(jetzt.getFullYear(), jetzt.getMonth(), jetzt.getDate() + 1), gestern = new Date(morgen.getTime() - 2 * TAG);
  kunden_().filter(function (k) { return k.aktiv; }).forEach(function (k) {
    var liste = t.zeilen.filter(function (z) {
      var st = datum_(t.get(z, 'Termin'));
      return t.get(z, 'Kunde') === k.kuerzel && String(t.get(z, 'Stand')) === 'Termin' && st && st >= gestern && st < jetzt;
    });
    if (!liste.length) return;
    mail_(s, { to: k.email, absender: k.betrieb + ' · Termine',
      subject: 'Wie waren Ihre Online-Termine heute? (' + liste.length + ')',
      html: rahmen_('<p>Guten Abend ' + esc_(k.anrede) + ',</p><p>bitte tippen Sie bei jedem Termin kurz an, wie er gelaufen ist. ' +
        'Bei „Behandlung gekauft“ gern den Wert (z. B. Paket) eintragen. So wird Ihr Monatsreport genau.</p>' +
        '<table style="width:100%;border-collapse:collapse;">' + liste.map(function (z) {
          var id = t.get(z, 'ID'), schl = t.get(z, 'Schlüssel');
          return '<tr><td style="padding:14px 0;border-top:1px solid #E8E2D6;"><b style="font-size:16px;">' + esc_(t.get(z, 'Name')) + '</b> · ' +
            esc_(terminText_(datum_(t.get(z, 'Termin')))) + '<br><span style="color:#6B665D;font-size:13px;">' + esc_(t.get(z, 'Leistung')) + '</span><br>' +
            ['erschienen', 'nicht-erschienen', 'auftrag'].map(function (x) { return knopf_(s, id, schl, x, true); }).join(' ') + '</td></tr>';
        }).join('') + '</table>') });
  });
}); }

function wochenMail() { sicher_('Wochen-Mail', function () {
  var s = einst_(), t = tabelle_('Termine'), jetzt = new Date(), uebersicht = [];
  kunden_().filter(function (k) { return k.aktiv; }).forEach(function (k) {
    var offen = t.zeilen.filter(function (z) {
      var ein = datum_(t.get(z, 'Eingang')), st = String(t.get(z, 'Stand')), start = datum_(t.get(z, 'Termin'));
      if (t.get(z, 'Kunde') !== k.kuerzel || !ein || jetzt - ein > 120 * TAG) return false;
      if (st === 'erschienen') return true;
      if (st === 'Termin') return start && start < jetzt;
      return (st === 'neu' || st === 'nicht erreicht' || st === 'erreicht') && jetzt - ein > TAG;
    });
    if (!offen.length) return;
    var liste = offen.map(function (z) {
      var id = t.get(z, 'ID'), schl = t.get(z, 'Schlüssel'), st = String(t.get(z, 'Stand'));
      var knoepfe = st === 'Termin' ? ['erschienen', 'nicht-erschienen', 'auftrag']
        : st === 'erschienen' ? ['auftrag', 'kein-interesse']
        : (st === 'neu' || st === 'nicht erreicht' ? ['zurueckgerufen'] : []).concat(['termin', 'auftrag', 'kein-interesse']);
      var start = datum_(t.get(z, 'Termin'));
      return '<tr><td style="padding:14px 0;border-top:1px solid #E8E2D6;">' +
        '<b style="font-size:16px;">' + esc_(t.get(z, 'Name')) + '</b> · ' + esc_(t.get(z, 'Telefon')) +
        '<br><span style="color:#6B665D;font-size:13px;">' + (start ? 'Termin ' + esc_(terminText_(start)) : 'Eingang ' + datumText_(datum_(t.get(z, 'Eingang')), s)) +
        ' · ' + esc_(t.get(z, 'Leistung') || t.get(z, 'Art')) + ' · Stand: ' + esc_(st) + '</span><br>' +
        knoepfe.map(function (x) { return knopf_(s, id, schl, x, true); }).join(' ') + '</td></tr>';
    }).join('');
    mail_(s, { to: k.email, absender: k.betrieb + ' · Termine',
      subject: 'Noch offen (' + offen.length + '): bitte kurz den Stand antippen',
      html: rahmen_('<p>Guten Morgen ' + esc_(k.anrede) + ',</p><p>hier ist noch offen, wie es weiterging. Ein Tipp pro Zeile genügt. ' +
        'Das dauert eine Minute und macht Ihren Monatsreport genau.</p><table style="width:100%;border-collapse:collapse;">' + liste + '</table>' +
        '<p style="font-size:13px;color:#6B665D;">Fragen? Antworten Sie einfach auf diese Mail.</p>') });
    var nieAngerufen = offen.filter(function (z) { return String(t.get(z, 'Stand')) === 'neu'; }).length;
    uebersicht.push('<li><b>' + esc_(k.betrieb) + '</b>' + (k.betreuer ? ' (' + esc_(k.betreuer) + ')' : '') + ': ' + offen.length + ' offen' + (nieAngerufen ? ', davon <b>' + nieAngerufen + ' Rückruf-Wünsche noch nie angerufen</b>' : '') + '</li>');
  });
  if (uebersicht.length) {
    mail_(s, { to: s.an, subject: 'Wochen-Mails sind raus (' + uebersicht.length + ' Kunden)',
      html: rahmen_('<p>Jeder Kunde hat seine offenen Termine und Anfragen mit Knöpfen bekommen:</p><ul>' + uebersicht.join('') + '</ul>' +
        '<p>Steht irgendwo „noch nie angerufen“: kurz beim Kunden nachhaken.</p>') });
  }
}); }

function monatsAnfang() { sicher_('Monatsanfang', function () {
  var s = einst_(), jetzt = new Date(), vm = vormonat_(jetzt), t = tabelle_('Termine'), wk = tabelle_('Werbekosten');
  var aktive = kunden_().filter(function (k) { return k.aktiv && k.live && k.live < vm.ende; });
  var fehlend = aktive.filter(function (k) {
    return !wk.zeilen.some(function (z) { var m = datum_(wk.get(z, 'Monat')); return wk.get(z, 'Kunde') === k.kuerzel && m && gleicherMonat_(m, vm.start); });
  });
  var monatAnfang = new Date(jetzt.getFullYear(), jetzt.getMonth(), 1);
  var faellig = kunden_().filter(function (k) {
    var ab = gebuehrAb_(k.kuerzel, t);
    return k.aktiv && ab && ab <= monatAnfang;
  });
  if (!fehlend.length && !faellig.length) return;
  mail_(s, { to: s.an, subject: 'Monatsanfang ' + monatName_(jetzt) + ': ' +
      (fehlend.length ? fehlend.length + '× Werbekosten eintragen' : '') + (fehlend.length && faellig.length ? ' · ' : '') +
      (faellig.length ? faellig.length + ' Rechnung' + (faellig.length > 1 ? 'en' : '') + ' schreiben' : ''),
    html: rahmen_(
      (fehlend.length ? '<h2 style="font-size:18px;">1 · Werbekosten ' + monatName_(vm.start) + ' eintragen (bis zum 3.)</h2>' +
        '<p>In Meta (Werbeanzeigenmanager) und Google Ads den Betrag für ' + monatName_(vm.start) + ' ablesen und im Blatt „Werbekosten“ eintragen. ' +
        'Monat = 1. ' + monatName_(vm.start) + '.</p><ul>' + fehlend.map(function (k) { return '<li>' + esc_(k.betrieb) + ' (' + esc_(k.kuerzel) + ')</li>'; }).join('') + '</ul>' +
        '<p>Am 3. liegen dann die Monatsreports als Entwurf in deinem Gmail.</p>' : '') +
      (faellig.length ? '<h2 style="font-size:18px;">2 · Rechnungen für ' + monatName_(jetzt) + '</h2><ul>' +
        faellig.map(function (k) { return '<li>' + esc_(k.betrieb) + ': Monatsgebühr ' + (k.gebuehr ? euro_(k.gebuehr) : '') + '</li>'; }).join('') +
        '</ul><p>Blatt „Rechnungen“: je eine Zeile, dann „Rechnung drucken“ → als PDF → mit kurzer Mail schicken.</p>' : '') +
      '<p><a href="' + SpreadsheetApp.getActive().getUrl() + '">Zentrale öffnen</a></p>') });
}); }

function monatsReportEntwuerfe() { sicher_('Monatsreport', function () {
  var s = einst_(), vm = vormonat_(new Date()), t = tabelle_('Termine'), wk = tabelle_('Werbekosten'), fertig = [];
  kunden_().filter(function (k) { return k.aktiv && k.live && k.live < vm.ende; }).forEach(function (k) {
    var z = zahlen_(t, wk, k.kuerzel, vm);
    var text = reportText_(k, z, vm, s), bm = teamMail_(s, k.betreuer);
    GmailApp.createDraft(k.email, 'Ihr Monatsreport ' + monatName_(vm.start), text, { name: s.agentur_name || 'Clickculture', replyTo: bm || s.agentur_email || '' });
    if (bm && bm.toLowerCase() !== String(Session.getEffectiveUser().getEmail() || '').toLowerCase()) {
      /* Der Betreuer hat keinen Zugriff auf die Gmail-Entwürfe des Zentrale-Kontos: er bekommt den Text zum Ergänzen und Weiterleiten */
      mail_(s, { to: bm, subject: 'Report-Entwurf ' + monatName_(vm.start) + ' für ' + k.betrieb + ': ergänzen und an ' + k.email + ' schicken',
        html: rahmen_('<p>Die drei [eckigen Klammern] ergänzen, dann von deiner Adresse an <b>' + esc_(k.email) + '</b> schicken und kurz anrufen.</p>' +
          '<pre style="white-space:pre-wrap;font-family:inherit;background:#F6F3EE;padding:14px;border-radius:8px;">' + esc_(text) + '</pre>') });
    }
    fertig.push('<li>' + esc_(k.betrieb) + (k.betreuer ? ' (' + esc_(k.betreuer) + ')' : '') + ': ' + z.gebucht + ' Online-Termine, ' + z.erschienen + ' erschienen, ' + z.auftraege + ' gekauft' +
      (z.kosten === null ? ' · <b>Werbekosten fehlen</b>' : '') + '</li>');
  });
  if (fertig.length) {
    mail_(s, { to: s.an, subject: fertig.length + ' Monatsreports liegen als Entwurf in Gmail',
      html: rahmen_('<p>Für ' + monatName_(vm.start) + ':</p><ul>' + fertig.join('') + '</ul>' +
        '<p>So geht es: Gmail → Entwürfe → je Report die drei [eckigen Klammern] ersetzen → senden → 10 Minuten anrufen. Wer ein Studio betreut, hat den Text zusätzlich per Mail bekommen und schickt ihn selbst.</p>' +
        '<p>Fehlen Werbekosten: erst eintragen, dann in der Zentrale Menü „Clickculture → Monatsreport-Entwürfe jetzt erstellen“ und den alten Entwurf löschen.</p>') });
  }
}); }

function taeglich() { sicher_('Täglich', function () {
  var s = einst_(), jetzt = new Date(), heute = Utilities.formatDate(jetzt, s.tz, 'yyyy-MM-dd'), props = PropertiesService.getScriptProperties();
  // Mail-Kontingent
  try {
    var rest = MailApp.getRemainingDailyQuota();
    if (rest < (Number(s.mail_warnung_ab) || 25)) {
      warnungEinmal_(s, 'quota', '⚠ Mail-Kontingent der Zentrale wird knapp (' + rest + ' übrig)',
        'Google erlaubt der Zentrale nur eine bestimmte Zahl Mails am Tag (kostenloses Konto ca. 100, Google Workspace ca. 1.500). ' +
        'Heute früh sind nur noch ' + rest + ' übrig. Wird es knapp, kommen Bestätigungen nicht mehr an. Lösung: die Zentrale in ein Google-Workspace-Konto umziehen (siehe EINRICHTEN, „Grenzen von Google“).');
    }
  } catch (e) { /* egal */ }
  // Verlosungen
  kunden_().filter(function (k) { return k.aktiv && k.ziehung && Utilities.formatDate(k.ziehung, s.tz, 'yyyy-MM-dd') === heute; }).forEach(function (k) {
    var merk = 'gezogen_' + k.kuerzel + '_' + heute;
    if (props.getProperty(merk)) return;
    var t = tabelle_('Termine'), bis = k.schluss ? new Date(k.schluss.getTime() + TAG) : jetzt;
    var teilnehmer = eindeutig_(t.zeilen.filter(function (z) {
      var ein = datum_(t.get(z, 'Eingang'));
      return t.get(z, 'Kunde') === k.kuerzel && String(t.get(z, 'Art')) === 'Verlosung' && String(t.get(z, 'Stand')) !== 'Fake' && ein && ein < bis;
    }).map(function (z) { return { name: t.get(z, 'Name'), telefon: t.get(z, 'Telefon'), email: t.get(z, 'E-Mail') }; }));
    var g = ziehen_(teilnehmer, GEWINNER.Verlosung, Math.random);
    mail_(s, { to: k.email + ',' + s.an, absender: 'Clickculture Zentrale', subject: 'Verlosung ' + k.betrieb + ': die Gewinnerin',
      html: rahmen_('<p>Heute ist Ziehung. Das System hat zufällig gezogen (jede Telefonnummer zählt einmal, ' + teilnehmer.length + ' Teilnehmer):</p>' +
        (g.length ? '<ol>' + g.map(function (x) { return '<li><b>' + esc_(x.name) + '</b> · ' + esc_(x.telefon) + (x.email ? ' · ' + esc_(x.email) : '') + '</li>'; }).join('') + '</ol>' : '<p>Keine Teilnehmer.</p>') +
        '<p><b>Jetzt:</b> Gewinnerin anrufen und gratulieren. Alle anderen Teilnehmer sind ganz normale Anfragen: anrufen und einen Termin anbieten.</p>') });
    props.setProperty(merk, 'ja');
  });
  // Akquise
  if (/^nein/i.test(String(s.akquise_erinnerung))) return;
  var ak = tabelle_('Akquise'), ende = new Date(jetzt.getFullYear(), jetzt.getMonth(), jetzt.getDate() + 1);
  var dran = ak.zeilen.filter(function (z) {
    var d = datum_(ak.get(z, 'Nächster Kontakt am')), st = String(ak.get(z, 'Stand'));
    return ak.get(z, 'Studio') && d && d < ende && st !== 'Kunde' && st !== 'kein Interesse';
  });
  if (!dran.length) return;
  // Jede Person im Team bekommt ihre eigenen Studios (Spalte „Wer“), Zeilen ohne bekannte Person gehen an alle
  var gruppen = {};
  dran.forEach(function (z) {
    var an = teamMail_(s, ak.get(z, 'Wer')) || s.an;
    (gruppen[an] = gruppen[an] || []).push(z);
  });
  Object.keys(gruppen).forEach(function (an) {
    var liste = gruppen[an];
    mail_(s, { to: an, subject: 'Heute dran: ' + liste.length + ' Studio' + (liste.length > 1 ? 's' : ''),
      html: rahmen_('<ul>' + liste.map(function (z) {
        var tel = String(ak.get(z, 'Telefon')).replace(/[^\d+]/g, '');
        return '<li style="margin-bottom:8px;"><b>' + esc_(ak.get(z, 'Studio')) + '</b>' + (ak.get(z, 'Ort') ? ', ' + esc_(ak.get(z, 'Ort')) : '') +
          ' · <a href="tel:' + esc_(tel) + '">' + esc_(ak.get(z, 'Telefon')) + '</a>' + (ak.get(z, 'Wer') ? ' · ' + esc_(ak.get(z, 'Wer')) : ' · <b>noch niemand zugeteilt</b>') +
          '<br><span style="color:#6B665D;">' + esc_(ak.get(z, 'Behandlung')) + ' · ' + esc_(ak.get(z, 'Stand')) + (ak.get(z, 'Notiz') ? ' · ' + esc_(ak.get(z, 'Notiz')) : '') + '</span></li>';
      }).join('') + '</ul><p>Danach im Blatt „Akquise“ Stand und nächsten Kontakt eintragen.</p>') });
  });
}); }


// ================================================================ Zahlen

function zahlen_(t, wk, kuerzel, vm) {
  var z = { gebucht: 0, verfallen: 0, rueckruf: 0, erschienen: 0, nichtErschienen: 0, abgesagt: 0, auftraege: 0, umsatz: 0,
    fake: 0, minuten: null, kosten: null, bots: Number(PropertiesService.getScriptProperties().getProperty('bots_' + kuerzel + '_' + monatSchluessel_(vm.start)) || 0) };
  var mins = [];
  t.zeilen.forEach(function (r) {
    var ein = datum_(t.get(r, 'Eingang'));
    if (t.get(r, 'Kunde') !== kuerzel || !ein || ein < vm.start || ein >= vm.ende) return;
    var st = String(t.get(r, 'Stand')), art = String(t.get(r, 'Art'));
    if (st === 'Fake') { z.fake++; return; }
    if (st === 'verfallen' || st === 'unbestätigt') { z.verfallen++; return; }
    if (art === 'Rückruf' || art === 'Verlosung') z.rueckruf++;
    else if (t.get(r, 'Bestätigt am')) z.gebucht++;
    if (st === 'erschienen' || st === 'Auftrag') z.erschienen++;
    if (st === 'nicht erschienen') z.nichtErschienen++;
    if (st === 'abgesagt') z.abgesagt++;
    if (st === 'Auftrag') { z.auftraege++; z.umsatz += zahl_(t.get(r, 'Auftragswert €')); }
    var m = t.get(r, 'Minuten bis Rückruf');
    if (m !== '' && m !== null && !isNaN(Number(m))) mins.push(Number(m));
  });
  if (mins.length) z.minuten = Math.round(mins.reduce(function (a, b) { return a + b; }, 0) / mins.length);
  wk.zeilen.forEach(function (r) {
    var m = datum_(wk.get(r, 'Monat'));
    if (wk.get(r, 'Kunde') === kuerzel && m && gleicherMonat_(m, vm.start)) {
      z.kosten = (z.kosten || 0) + zahl_(wk.get(r, 'Meta €')) + zahl_(wk.get(r, 'Google €'));
    }
  });
  return z;
}

function reportText_(k, z, vm, s) {
  var monat = monatName_(vm.start), cpt = z.kosten && z.gebucht ? Math.round(z.kosten / z.gebucht) : null;
  return 'Hallo ' + k.anrede + ',\n\n' +
    'hier Ihre Zahlen für ' + monat + ':\n' +
    '- Werbeausgaben: ' + (z.kosten === null ? '[Werbekosten fehlen]' : euro_(z.kosten)) + '\n' +
    '- Online gebuchte und bestätigte Termine: ' + z.gebucht + (cpt !== null ? ' (Werbekosten pro Termin: ' + euro_(cpt) + ')' : '') + '\n' +
    '- Rückruf-Wünsche' + (k.ziehung ? ' und Verlosung' : '') + ': ' + z.rueckruf + (z.minuten !== null ? ' (Rückruf im Schnitt nach ' + z.minuten + ' Minuten)' : '') + '\n' +
    '- Erschienen: ' + z.erschienen + ' · nicht erschienen: ' + z.nichtErschienen + ' · abgesagt: ' + z.abgesagt + '\n' +
    '- Behandlung gekauft: ' + z.auftraege + (z.umsatz ? ' (Wert laut Ihnen: ' + euro_(z.umsatz) + ')' : '') + '\n' +
    '- Herausgefiltert: ' + (z.verfallen + z.fake + z.bots) + ' (nicht bestätigt ' + z.verfallen + ', als Fake gemeldet ' + z.fake + ', Bots ' + z.bots + '). Diese Termine haben Sie nie erreicht.\n\n' +
    'Was wir geändert haben: [eine Sache]\n' +
    'Was wir als Nächstes tun: [eine Sache]\n' +
    'Was wir von Ihnen brauchen: [z. B. neue Fotos in Ihren Ordner, Rückmeldung zu offenen Terminen]\n\n' +
    'Beste Grüße\n' + (k.betreuer || s.agentur_inhaber || '') + (s.agentur_name ? '\n' + s.agentur_name : '');
}

function gebuehrAb_(kuerzel, t) {
  var erste = null;
  t.zeilen.forEach(function (z) {
    var d = datum_(t.get(z, 'Auftrag am'));
    if (t.get(z, 'Kunde') === kuerzel && t.get(z, 'Stand') === 'Auftrag' && d && (!erste || d < erste)) erste = d;
  });
  return erste ? ersterNaechsterMonat_(erste) : null;
}

function ziehen_(liste, n, zufall) {
  var rest = liste.slice(), g = [];
  while (rest.length && g.length < n) g.push(rest.splice(Math.floor(zufall() * rest.length), 1)[0]);
  return g;
}

function eindeutig_(liste) {
  var gesehen = {};
  return liste.filter(function (x) {
    var k = String(x.telefon).replace(/\D/g, '') || String(x.name).toLowerCase();
    if (gesehen[k]) return false;
    gesehen[k] = true;
    return true;
  });
}

function zaehlen_(schl) {
  var p = PropertiesService.getScriptProperties();
  p.setProperty(schl, String(Number(p.getProperty(schl) || 0) + 1));
}

function warnungEinmal_(s, schl, betreff, text) {
  var p = PropertiesService.getScriptProperties(), merk = 'warn_' + schl, jetzt = new Date().getTime();
  if (jetzt - Number(p.getProperty(merk) || 0) < 3 * 3600 * 1000) return;
  p.setProperty(merk, String(jetzt));
  mail_(s, { to: s.an, subject: betreff, html: rahmen_('<p>' + esc_(text) + '</p>') });
}


// ================================================================ Zeit

function inZeit_(d, s) {
  var tag = Number(Utilities.formatDate(d, s.tz, 'u')), std = Number(Utilities.formatDate(d, s.tz, 'H'));
  return tag <= s.zeiten.tage && std >= s.zeiten.von && std < s.zeiten.bis;
}

function geschaeftsMinuten_(von, bis, s) {
  var n = 0, schritt = 5 * MIN, ende = Math.min(bis.getTime(), von.getTime() + 7 * TAG);
  for (var t = von.getTime(); t < ende; t += schritt) if (inZeit_(new Date(t), s)) n += 5;
  return n;
}

function startAusText_(v) {
  var m = String(v || '').match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
  return m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), Number(m[4]), Number(m[5])) : null;
}
function textAusStart_(d) { return d.getFullYear() + '-' + zwei_(d.getMonth() + 1) + '-' + zwei_(d.getDate()) + 'T' + uhrzeit_(d); }
function terminText_(d) { return d ? WOCHENTAG[d.getDay()] + ', ' + zwei_(d.getDate()) + '.' + zwei_(d.getMonth() + 1) + '.' + d.getFullYear() + ', ' + uhrzeit_(d) + ' Uhr' : ''; }
function uhrzeit_(d) { return zwei_(d.getHours()) + ':' + zwei_(d.getMinutes()); }
function zwei_(n) { return (n < 10 ? '0' : '') + n; }
function gleicherTag_(a, b) { return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(); }
function vormonat_(d) { return { start: new Date(d.getFullYear(), d.getMonth() - 1, 1), ende: new Date(d.getFullYear(), d.getMonth(), 1) }; }
function ersterNaechsterMonat_(d) { return new Date(d.getFullYear(), d.getMonth() + 1, 1); }
function gleicherMonat_(a, b) { return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth(); }
function monatName_(d) { return MONATE[d.getMonth()] + ' ' + d.getFullYear(); }
function monatSchluessel_(d) { return d.getFullYear() + '-' + zwei_(d.getMonth() + 1); }
function datumText_(d, s) { return d ? Utilities.formatDate(d, s.tz, 'dd.MM.yyyy HH:mm') : ''; }
function datum_(v) {
  if (v instanceof Date) return isNaN(v.getTime()) ? null : v;
  if (v === '' || v == null) return null;
  var m = String(v).match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})(?:\s+(\d{1,2}):(\d{2}))?/);
  if (m) return new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]), Number(m[4] || 0), Number(m[5] || 0));
  var d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
}


// ================================================================ Tabellen

function blatt_(name) {
  var sh = SpreadsheetApp.getActive().getSheetByName(name);
  if (!sh) throw new Error('Das Blatt „' + name + '“ fehlt in der Zentrale.');
  return sh;
}

function tabelle_(name) {
  var sh = blatt_(name), werte = sh.getDataRange().getValues(), kopf = {};
  (werte[0] || []).forEach(function (h, i) { if (h !== '' && h != null) kopf[String(h).trim()] = i; });
  var zeilen = [];
  for (var r = 1; r < werte.length; r++) zeilen.push({ nr: r + 1, w: werte[r] });
  var spalte = function (sp) {
    if (kopf[sp] === undefined) throw new Error('Im Blatt „' + name + '“ fehlt die Spalte „' + sp + '“.');
    return kopf[sp];
  };
  return {
    sh: sh, kopf: kopf, zeilen: zeilen,
    get: function (z, sp) { var v = z.w[spalte(sp)]; return v == null ? '' : v; },
    set: function (z, sp, v) { var i = spalte(sp); sh.getRange(z.nr, i + 1).setValue(v); z.w[i] = v; }
  };
}

var TEXT_SPALTEN = ['Telefon', 'PLZ', 'Telefon oder E-Mail', 'Kalender-Eintrag'];

function zeileAnhaengen_(tab, werte) {
  var z = zeileNachKopf_(tab, werte), r = tab.sh.getLastRow() + 1;
  TEXT_SPALTEN.forEach(function (h) { if (tab.kopf[h] !== undefined) tab.sh.getRange(r, tab.kopf[h] + 1).setNumberFormat('@'); });
  tab.sh.getRange(r, 1, 1, z.length).setValues([z]);
  tab.zeilen.push({ nr: r, w: z });
  SpreadsheetApp.flush();
}

function textSpalten_(name) {
  var sh = blatt_(name), kopf = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
  kopf.forEach(function (h, i) {
    if (TEXT_SPALTEN.indexOf(String(h).trim()) >= 0) sh.getRange(2, i + 1, Math.max(sh.getMaxRows() - 1, 1), 1).setNumberFormat('@');
  });
}

function zeileNachKopf_(tab, werte) {
  var n = Object.keys(tab.kopf).reduce(function (m, k) { return Math.max(m, tab.kopf[k] + 1); }, 0), z = [];
  for (var i = 0; i < n; i++) z.push('');
  Object.keys(werte).forEach(function (k) { if (tab.kopf[k] !== undefined) z[tab.kopf[k]] = werte[k]; });
  return z;
}

function zeileMitId_(tab, id) {
  for (var i = 0; i < tab.zeilen.length; i++) if (String(tab.get(tab.zeilen[i], 'ID')) === String(id)) return tab.zeilen[i];
  return null;
}

function kunden_() {
  var t = tabelle_('Kunden');
  return t.zeilen.filter(function (z) { return String(t.get(z, 'Kürzel')).trim(); }).map(function (z) {
    var g = function (sp) { return t.get(z, sp); };
    var modus = /wunsch/i.test(String(g('Buchung'))) ? 'Wunschtermin' : 'Kalender';
    return {
      kuerzel: String(g('Kürzel')).trim().toLowerCase(), betrieb: String(g('Betrieb')) || String(g('Kürzel')),
      anrede: String(g('Anrede für Mails')) || 'zusammen', email: String(g('E-Mail für Termine')).trim(),
      telefon: String(g('Telefon')), adresse: String(g('Adresse')), seite: String(g('Seiten-Adresse')).trim().replace(/\/+$/, ''),
      drive: String(g('Drive-Ordner')).trim(), gebuehr: zahl_(g('Monatsgebühr €')), live: datum_(g('Live seit')),
      aktiv: !/^nein/i.test(String(g('Aktiv'))) && !!String(g('E-Mail für Termine')).trim(),
      behandlung: String(g('Behandlung')), modus: modus, kalender: String(g('Kalender-ID')).trim(),
      zeiten: String(g('Buchbare Zeiten')), beratung: Number(g('Beratung Minuten')) || 0, leistungen: leistungenLesen_(g('Leistungen')),
      puffer: Number(g('Puffer Minuten')) || 0, vorlauf: g('Vorlauf Stunden') === '' ? 12 : Number(g('Vorlauf Stunden')) || 0,
      tage: Number(g('Tage im Voraus')) || 21, raster: Number(g('Raster Minuten')) || 0, absagefrist: Number(g('Absagefrist Stunden')) || 0, ausfall: String(g('Ausfallregel')),
      vorbereitung: String(g('Vorbereitung')),
      schluss: datum_(g('Teilnahmeschluss')), ziehung: datum_(g('Ziehung am')), betreuer: String(g('Betreuer')).trim()
    };
  });
}

function kunde_(kuerzel) {
  var k = String(kuerzel || '').toLowerCase().trim();
  return kunden_().filter(function (x) { return x.kuerzel === k; })[0] || null;
}

function einst_() {
  var s = {};
  blatt_('Einstellungen').getDataRange().getValues().forEach(function (z) { if (z[0]) s[String(z[0]).trim()] = z[2]; });
  s.rueckruf_minuten = Number(s.rueckruf_minuten) || 60;
  var m = String(s.geschaeftszeiten || '9-18').match(/(\d+)\D+(\d+)/);
  s.zeiten = { von: m ? Number(m[1]) : 9, bis: m ? Number(m[2]) : 18, tage: /sa/i.test(String(s.arbeitstage)) ? 6 : 5 };
  s.tz = Session.getScriptTimeZone();
  s.an = String(s.benachrichtigung_an || s.agentur_email || '').trim() || Session.getEffectiveUser().getEmail();
  var teamText = String(s.team || '');
  s.team = {};
  teamText.split(/[;\n]/).forEach(function (x) {
    var m = x.match(/^\s*(.+?)\s*[=:]\s*(\S+@\S+)\s*$/);
    if (m) s.team[m[1].toLowerCase()] = m[2];
  });
  return s;
}

function einstSetzen_(schluessel, wert) {
  var sh = blatt_('Einstellungen'), werte = sh.getDataRange().getValues();
  for (var i = 0; i < werte.length; i++) if (String(werte[i][0]).trim() === schluessel) { sh.getRange(i + 1, 3).setValue(wert); return; }
  throw new Error('In „Einstellungen“ fehlt die Zeile ' + schluessel);
}

/** E-Mail einer Person aus dem Team (Einstellung „team“, z. B. „Max = max@x.de; Tom = tom@y.de“). Vorname reicht. */
function teamMail_(s, name) {
  var n = String(name || '').trim().toLowerCase();
  if (!n) return '';
  if (s.team[n]) return s.team[n];
  var treffer = Object.keys(s.team).filter(function (k) { return k.split(' ')[0] === n.split(' ')[0]; });
  return treffer.length === 1 ? s.team[treffer[0]] : '';
}

function cacheLeeren_(k) {
  var c = CacheService.getScriptCache(), schl = [];
  schl.push('slots_' + k.kuerzel + '_beratung_' + k.beratung);
  k.leistungen.forEach(function (l) { schl.push('slots_' + k.kuerzel + '_behandlung_' + l.minuten); });
  c.removeAll(schl);
}


// ================================================================ Mails und Seiten

function mail_(s, o) {
  var opt = { to: o.to, subject: o.subject, htmlBody: o.html, body: ohneHtml_(o.html),
    name: o.absender || s.agentur_name || 'Clickculture', replyTo: o.antwortAn || s.agentur_email || undefined };
  if (o.anhang) opt.attachments = o.anhang;
  MailApp.sendEmail(opt);
}

function rahmen_(inhalt) {
  return '<div style="font-family:-apple-system,Helvetica,Arial,sans-serif;color:#1A1917;max-width:560px;line-height:1.45;">' + inhalt + '</div>';
}

function grosserKnopf_(url, text) {
  return '<p style="margin:22px 0;"><a href="' + esc_(url) + '" style="display:inline-block;padding:16px 26px;border-radius:8px;background:#1F7A3F;' +
    'color:#ffffff;text-decoration:none;font-weight:700;font-size:18px;">' + esc_(text) + '</a></p>';
}

function basis_(s) { return String(s.webapp_url || '').trim(); }

function knopf_(s, id, schl, aktion, klein) {
  var k = KNOEPFE[aktion];
  var url = basis_(s) + '?id=' + encodeURIComponent(id) + '&t=' + encodeURIComponent(schl) + '&s=' + aktion;
  return '<a href="' + esc_(url) + '" style="display:inline-block;margin:4px 4px 4px 0;padding:' + (klein ? '9px 12px' : '13px 18px') +
    ';border-radius:6px;background:' + k.farbe + ';color:#ffffff;text-decoration:none;font-weight:700;font-size:' + (klein ? '14px' : '16px') + ';">' +
    esc_(k.text) + '</a>';
}

function seite_(titel, inhalt) {
  return HtmlService.createHtmlOutput(
    '<div style="font-family:-apple-system,Helvetica,Arial,sans-serif;max-width:480px;margin:40px auto;padding:0 20px;color:#1A1917;">' +
    '<h1 style="font-size:24px;">' + titel + '</h1><div style="font-size:17px;line-height:1.5;">' + inhalt + '</div></div>')
    .setTitle('Clickculture').addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function json_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function text_(t) { return ContentService.createTextOutput(t); }

function sicher_(was, fn) {
  try { fn(); } catch (err) { fehler_(was, err); }
}

function fehler_(was, err) {
  try {
    var s = einst_();
    MailApp.sendEmail(s.an, '⚠ Beauty-Zentrale: Fehler bei „' + was + '“',
      'Die Automatik hatte ein Problem:\n\n' + (err && err.stack || err) + '\n\nHäufigste Ursachen: eine Spalte oder ein Blatt wurde umbenannt, oder ein Kalender ist nicht (mehr) freigegeben.');
  } catch (e) { /* nichts mehr zu tun */ }
}

function neuerSchluessel_() { return Utilities.getUuid().replace(/-/g, '').slice(0, 16); }
function ziffern_(v) { return String(v == null ? '' : v).replace(/\D/g, '').replace(/^0049/, '49').replace(/^0(?=[1-9])/, '49'); }
function ziffernPlus_(v) { var t = telefon_(v); return t || String(v).replace(/[^\d+]/g, ''); }
function zahl_(v) { var n = Number(String(v == null ? '' : v).replace(/[^\d,.-]/g, '').replace(/\.(?=\d{3}(\D|$))/g, '').replace(',', '.')); return isNaN(n) ? 0 : n; }
function euro_(v) { return Math.round(zahl_(v)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' €'; }
function esc_(v) { return String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
function ohneHtml_(h) {
  return String(h || '').replace(/<a [^>]*href="([^"]*)"[^>]*>([^<]*)<\/a>/g, '$2 ($1)').replace(/<br\s*\/?>/g, '\n')
    .replace(/<\/(p|h1|h2|li|tr|ol|ul|table)>/g, '\n').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/\n{3,}/g, '\n\n').trim();
}
