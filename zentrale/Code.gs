/**
 * Clickculture Zentrale – die Automatik im Hintergrund.
 * Läuft als Google Apps Script in der Google-Tabelle „Clickculture Zentrale“. Kostenlos.
 *
 * Was sie von selbst macht:
 *  1. Neue Anfrage (Netlify schickt sie hierher)
 *     → Zeile im Blatt „Anfragen“
 *     → sofort Mail an den Kunden: Name, Telefon zum Antippen, Knöpfe „Zurückgerufen“ / „Nicht erreicht“
 *     → ein Foto der Stromrechnung landet im Drive-Ordner des Kunden (Unterordner „Stromrechnungen“)
 *  2. Alle 10 Minuten: Anfrage nach 60 Geschäftsminuten noch nicht zurückgerufen
 *     → Erinnerung an den Kunden und Hinweis an dich
 *  3. Montags 8 Uhr: Mail an jeden Kunden mit seinen offenen Anfragen und Knöpfen
 *     (Termin · Angebot · Auftrag · kein Interesse). So pflegt sich der Stand von selbst.
 *  4. Erster Auftrag eines Kunden → sofort Mail an dich: ab nächstem Monat Monatsgebühr berechnen
 *  5. Am 1. des Monats 7 Uhr: Mail an dich: Werbekosten eintragen, diese Rechnungen sind fällig
 *  6. Am 3. des Monats 7 Uhr: für jeden Kunden ein fertiger Monatsreport als Entwurf in deinem Gmail
 *  7. Täglich 7 Uhr: am Tag einer Verlosung werden die Gewinner gezogen und gemailt;
 *     Akquise: wen du heute anrufen wolltest
 *  8. Neuer Kunde im Blatt „Kunden“ → er bekommt von selbst eine Spalte im Blatt „Checkliste“
 *
 * Einrichtung: Blatt „Start“ in der Tabelle oder zentrale/EINRICHTEN.md. An diesem Code nichts ändern.
 */

var STAND = ['neu', 'nicht erreicht', 'erreicht', 'Termin', 'Angebot', 'Auftrag'];
var SEITEN = {
  'wirtschaftlichkeit': 'Wirtschaftlichkeit', 'rechner': 'Rechner',
  'verlosung-modul': 'Verlosung Modul', 'verlosung-rabatt': 'Verlosung Rabatt', 'verlosung-speicher': 'Verlosung Speicher'
};
var GEWINNER = { 'Verlosung Modul': 1, 'Verlosung Rabatt': 3, 'Verlosung Speicher': 3 };
var KNOEPFE = {
  'zurueckgerufen': { text: 'Zurückgerufen', stand: 'erreicht', farbe: '#1F7A3F' },
  'nicht-erreicht': { text: 'Nicht erreicht', stand: 'nicht erreicht', farbe: '#6B665D' },
  'termin': { text: 'Termin vereinbart', stand: 'Termin', farbe: '#1A1917' },
  'angebot': { text: 'Angebot geschickt', stand: 'Angebot', farbe: '#1A1917' },
  'auftrag': { text: 'Auftrag unterschrieben', stand: 'Auftrag', farbe: '#1F7A3F' },
  'kein-interesse': { text: 'Kein Interesse', stand: 'kein Interesse', farbe: '#9A3B2E' }
};
var MONATE = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
var TAG = 24 * 60 * 60 * 1000;


// ================================================================ Menü und Einrichtung

function onOpen() {
  SpreadsheetApp.getUi().createMenu('Clickculture')
    .addItem('1 · Einrichten (einmal, und nach jeder neuen Bereitstellung)', 'einrichten')
    .addItem('2 · Test-Anfrage durchspielen', 'testAnfrage')
    .addSeparator()
    .addItem('Wochen-Mail jetzt senden', 'wochenMail')
    .addItem('Monatsreport-Entwürfe jetzt erstellen', 'monatsReportEntwuerfe')
    .addToUi();
}

function einrichten() {
  var ui = SpreadsheetApp.getUi(), s = einst_();
  ['Einstellungen', 'Kunden', 'Anfragen', 'Werbekosten', 'Akquise'].forEach(blatt_);
  checklisteSpalten_();
  if (!s.schluessel) {
    s.schluessel = Utilities.getUuid().replace(/-/g, '').slice(0, 24);
    einstSetzen_('schluessel', s.schluessel);
  }
  ScriptApp.getProjectTriggers().forEach(function (t) { ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('pruefeRueckrufe').timeBased().everyMinutes(10).create();
  ScriptApp.newTrigger('wochenMail').timeBased().onWeekDay(ScriptApp.WeekDay.MONDAY).atHour(8).create();
  ScriptApp.newTrigger('monatsAnfang').timeBased().onMonthDay(1).atHour(7).create();
  ScriptApp.newTrigger('monatsReportEntwuerfe').timeBased().onMonthDay(3).atHour(7).create();
  ScriptApp.newTrigger('taeglich').timeBased().everyDays(1).atHour(7).create();
  var url = String(s.webapp_url || '').trim();
  var dienst = ScriptApp.getService().getUrl() || '';
  if (!url && /\/exec$/.test(dienst)) { url = dienst; einstSetzen_('webapp_url', url); }
  var hinweise = [];
  if (!url) hinweise.push('Die Web-App-Adresse fehlt. Bitte Schritt 5 der Einrichtung machen (Bereitstellen, Adresse in „Einstellungen“ einfügen) und danach hier nochmal „Einrichten“ wählen.');
  if (s.tz !== 'Europe/Berlin') hinweise.push('Zeitzone ist „' + s.tz + '“. Bitte in Apps Script unter Projekteinstellungen (Zahnrad) auf „Berlin“ stellen.');
  if (!s.agentur_email) hinweise.push('Im Blatt „Einstellungen“ fehlt deine E-Mail.');
  ui.alert('Clickculture Zentrale',
    'Die Automatik läuft. 5 Zeitpläne sind aktiv.\n\n' +
    (url ? 'Die Webhook-Adresse für Netlify steht jetzt im Blatt „Einstellungen“.\n\n' : '') +
    (hinweise.length ? 'Noch zu tun:\n- ' + hinweise.join('\n- ') : 'Alles bereit. Als Nächstes: „2 · Test-Anfrage durchspielen“.'),
    ui.ButtonSet.OK);
}

function testAnfrage() {
  var ui = SpreadsheetApp.getUi(), k = kunden_().filter(function (x) { return x.aktiv; })[0];
  if (!k) { ui.alert('Erst im Blatt „Kunden“ eine Zeile anlegen (zum Testen dich selbst mit deiner E-Mail).'); return; }
  var a = anfrageAusNetlify_({
    id: 'TEST-' + Date.now(), form_name: 'wirtschaftlichkeit', created_at: new Date().toISOString(),
    data: { kunde: k.kuerzel, name: 'TEST Anna Beispiel', telefon: '0151 00000000', plz: '12345', eigentuemer: 'Einfamilienhaus',
      verbrauch_kwh: '4500', utm_source: 'meta', utm_campaign: 'pv-w1' }
  });
  neueAnfrage_(a, einst_());
  ui.alert('Test-Anfrage angelegt und an ' + k.email + ' geschickt.\n\nIn der Mail auf „Zurückgerufen“ tippen und bestätigen: Im Blatt „Anfragen“ erscheinen Uhrzeit und Minuten. Danach die Testzeile löschen.');
}


/** Läuft von selbst bei jeder Änderung in der Tabelle (einfacher Trigger, keine Einrichtung nötig). */
function onEdit(e) {
  try {
    if (e && e.range && e.range.getSheet().getName() === 'Kunden') checklisteSpalten_();
  } catch (err) { /* nie die Eingabe stören */ }
}

/** Jeder Kunde bekommt im Blatt „Checkliste“ eine Spalte (Kürzel oben, Fortschritt in Zeile 2). */
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
    ck.getRange(2, spalte).setFormula('=IFERROR(COUNTIF(' + b + '3:' + b + letzteAufgabe + ',"Ja")/' + (letzteAufgabe - 2) + ',0)');
    ck.getRange(2, spalte).setNumberFormat('0%');
    kopf[spalte - 1] = k.kuerzel;
  });
}

function spaltenBuchstabe_(n) {
  var s = '';
  while (n > 0) { var m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = Math.floor((n - 1) / 26); }
  return s;
}


// ================================================================ Neue Anfrage (von Netlify)

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    var s = einst_();
    if (!e || !e.parameter || !s.schluessel || String(e.parameter.key) !== String(s.schluessel)) return text_('falscher Schlüssel');
    var roh = JSON.parse((e.postData && e.postData.contents) || '{}');
    var a = anfrageAusNetlify_(roh);
    if (!a.name && !a.telefon) return text_('leer');
    return text_(neueAnfrage_(a, s));
  } catch (err) {
    fehler_('Neue Anfrage', err);
    return text_('fehler');
  } finally {
    lock.releaseLock();
  }
}

function anfrageAusNetlify_(roh) {
  var p = roh && roh.payload ? roh.payload : (roh || {});
  var d = p.data || p;
  var txt = function (v) { return v == null ? '' : String(v).trim(); };
  var form = txt(p.form_name || d['form-name'] || d.aktion);
  var q = txt(d.utm_source).toLowerCase();
  var quelle = /google|gads|adwords/.test(q) || (!q && txt(d.gclid)) ? 'Google'
    : /meta|facebook|instagram|^fb|^ig/.test(q) || (!q && txt(d.fbclid)) ? 'Meta'
    : q ? txt(d.utm_source) : 'direkt';
  var datei = d.stromrechnung;
  var dateiUrl = datei && typeof datei === 'object' ? txt(datei.url) : txt(datei);
  var details = [];
  [['eigentuemer', 'Wohnt'], ['verbrauch_kwh', 'Verbrauch kWh/Jahr'], ['abschlag_eur', 'Abschlag €/Monat'],
   ['rechner_eingaben', 'Rechner'], ['nachricht', 'Nachricht'], ['utm_campaign', 'Anzeige']].forEach(function (f) {
    if (txt(d[f[0]])) details.push(f[1] + ': ' + txt(d[f[0]]));
  });
  return {
    id: txt(p.id || p.number) || ('A' + new Date().getTime()),
    eingang: p.created_at ? new Date(p.created_at) : new Date(),
    kunde: (txt(d.kunde) || slugAusUrl_(p.site_url || d.referrer)).toLowerCase(),
    name: txt(d.name), telefon: txt(d.telefon), email: txt(d.email), plz: txt(d.plz),
    seite: SEITEN[form] || form || 'unbekannt', quelle: quelle, dateiUrl: dateiUrl, details: details.join(' · ')
  };
}

function slugAusUrl_(u) {
  var m = String(u || '').match(/^https?:\/\/([^.\/]+)\.netlify\.app/i);
  return m ? m[1].toLowerCase() : '';
}

function neueAnfrage_(a, s) {
  var an = tabelle_('Anfragen');
  if (an.zeilen.some(function (z) { return String(an.get(z, 'ID')) === String(a.id); })) return 'doppelt';
  var k = kunde_(a.kunde), schl = neuerSchluessel_(), link = '';
  if (a.dateiUrl && k && k.drive) link = dateiSichern_(a, k);
  var details = a.details;
  if (a.dateiUrl) details += (details ? ' · ' : '') + 'Stromrechnung: ' + (link || a.dateiUrl);
  an.sh.appendRow(zeileNachKopf_(an, {
    'ID': a.id, 'Eingang': a.eingang, 'Kunde': a.kunde, 'Name': a.name, 'Telefon': a.telefon, 'E-Mail': a.email,
    'PLZ': a.plz, 'Seite': a.seite, 'Quelle': a.quelle, 'Stand': 'neu', 'Details': details, 'Schlüssel': schl
  }));
  var aktiv = k && k.aktiv;
  var html = anfrageHtml_(a, details, s, schl, k);
  mail_(s, {
    to: aktiv ? k.email : s.an,
    subject: (aktiv ? '' : '[KUNDE ' + (k ? 'NICHT AKTIV' : 'UNBEKANNT') + ': ' + a.kunde + '] ') +
      'Neue Anfrage: ' + a.name + (a.plz ? ', ' + a.plz : '') + ' – bitte innerhalb von ' + s.rueckruf_minuten + ' Minuten anrufen',
    html: html, absender: aktiv ? k.betrieb + ' · Anfragen' : 'Clickculture Zentrale'
  });
  if (aktiv && /^ja/i.test(String(s.kopie_jeder_anfrage))) {
    mail_(s, { to: s.an, subject: 'Kopie · ' + k.betrieb + ': neue Anfrage von ' + a.name, html: html });
  }
  return 'ok';
}

function anfrageHtml_(a, details, s, schl, k) {
  var tel = String(a.telefon).replace(/[^\d+]/g, '');
  return rahmen_(
    '<p style="font-size:15px;margin:0 0 6px;color:#6B665D;">Neue Anfrage · ' + esc_(a.seite) + ' · über ' + esc_(a.quelle) + '</p>' +
    '<h1 style="font-size:24px;margin:0 0 4px;">' + esc_(a.name) + '</h1>' +
    '<p style="font-size:18px;margin:0 0 16px;"><a href="tel:' + esc_(tel) + '" style="color:#1A1917;font-weight:700;">' + esc_(a.telefon) + '</a>' +
    (a.plz ? ' · PLZ ' + esc_(a.plz) : '') + (a.email ? '<br><span style="font-size:15px;">' + esc_(a.email) + '</span>' : '') + '</p>' +
    (details ? '<p style="font-size:14px;color:#3A3732;margin:0 0 16px;">' + esc_(details) + '</p>' : '') +
    '<p style="font-size:15px;margin:0 0 16px;"><b>Bitte innerhalb von ' + s.rueckruf_minuten + ' Minuten anrufen.</b> Wer zuerst anruft, bekommt meist den Termin. Danach hier tippen:</p>' +
    knopf_(s, a.id, schl, 'zurueckgerufen') + ' ' + knopf_(s, a.id, schl, 'nicht-erreicht') +
    (k && k.drive ? '<p style="font-size:13px;color:#6B665D;margin:18px 0 0;">Ihr Foto-Ordner: <a href="' + esc_(k.drive) + '">' + esc_(k.drive) + '</a></p>' : ''));
}


// ================================================================ Knöpfe in den Mails

function doGet(e) {
  var p = (e && e.parameter) || {};
  if (!p.id) return seite_('Clickculture Zentrale', 'Diese Adresse ist in Ordnung. Sie wird für die Knöpfe in den Anfrage-Mails gebraucht.');
  var knopf = KNOEPFE[p.s];
  if (!knopf) return seite_('Unbekannter Knopf', 'Dieser Link ist nicht vollständig.');
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    var s = einst_(), an = tabelle_('Anfragen'), z = zeileMitId_(an, p.id);
    if (!z || String(an.get(z, 'Schlüssel')) !== String(p.t)) return seite_('Nicht gefunden', 'Dieser Link ist nicht (mehr) gültig.');
    var name = an.get(z, 'Name');
    if (p.ok !== '1') return bestaetigen_(s, p, name, knopf);
    var neu = standSetzen_(an, z, p.s, p.w, s);
    return seite_('Gespeichert ✓', esc_(name) + ': <b>' + esc_(knopf.text) + '</b>.<br>Stand jetzt: ' + esc_(neu) + '.<br><br>Sie können dieses Fenster schließen.');
  } catch (err) {
    fehler_('Knopf in einer Mail', err);
    return seite_('Das hat nicht geklappt', 'Bitte später nochmal versuchen.');
  } finally {
    lock.releaseLock();
  }
}

function bestaetigen_(s, p, name, knopf) {
  var wert = p.s === 'auftrag'
    ? '<label style="display:block;margin:0 0 16px;font-size:16px;">Auftragswert in € (wenn bekannt)<br>' +
      '<input name="w" inputmode="numeric" style="font-size:20px;padding:10px;width:100%;box-sizing:border-box;margin-top:6px;"></label>' : '';
  return seite_(esc_(name),
    '<form method="get" action="' + esc_(basis_(s)) + '" target="_top">' +
    '<input type="hidden" name="id" value="' + esc_(p.id) + '"><input type="hidden" name="t" value="' + esc_(p.t) + '">' +
    '<input type="hidden" name="s" value="' + esc_(p.s) + '"><input type="hidden" name="ok" value="1">' + wert +
    '<button style="font-size:20px;padding:16px;width:100%;border:0;border-radius:6px;background:' + knopf.farbe +
    ';color:#fff;font-weight:700;">' + esc_(knopf.text) + ' ✓ eintragen</button></form>');
}

function standSetzen_(an, z, aktion, wert, s) {
  var jetzt = new Date(), alt = String(an.get(z, 'Stand') || 'neu'), knopf = KNOEPFE[aktion];
  if ((aktion === 'zurueckgerufen' || aktion === 'nicht-erreicht') && !an.get(z, 'Zurückgerufen')) {
    an.set(z, 'Zurückgerufen', jetzt);
    var ein = datum_(an.get(z, 'Eingang'));
    if (ein) an.set(z, 'Minuten bis Rückruf', geschaeftsMinuten_(ein, jetzt, s));
  }
  var neu = neuerStand_(alt, knopf.stand);
  if (neu !== alt) an.set(z, 'Stand', neu);
  if (aktion === 'auftrag' && zahl_(wert) > 0) an.set(z, 'Auftragswert €', zahl_(wert));
  if (neu === 'Auftrag' && alt !== 'Auftrag') {
    an.set(z, 'Auftrag am', jetzt);
    ersterAuftragPruefen_(an, z, s);
  }
  return neu;
}

/** Der Stand geht nur nach vorne. „kein Interesse“ geht immer, und danach darf es wieder weitergehen. */
function neuerStand_(alt, ziel) {
  if (ziel === 'kein Interesse' || alt === 'kein Interesse') return ziel;
  var ia = STAND.indexOf(alt), iz = STAND.indexOf(ziel);
  if (iz < 0) return alt;
  return iz > ia ? ziel : alt;
}

function ersterAuftragPruefen_(an, z, s) {
  var kuerzel = an.get(z, 'Kunde');
  var andere = an.zeilen.filter(function (x) {
    return x.nr !== z.nr && an.get(x, 'Kunde') === kuerzel && an.get(x, 'Stand') === 'Auftrag';
  });
  if (andere.length) return;
  var k = kunde_(kuerzel) || { betrieb: kuerzel, gebuehr: '' }, ab = ersterNaechsterMonat_(new Date());
  mail_(s, {
    to: s.an,
    subject: '🎉 Erster Auftrag bei ' + k.betrieb + ' – Monatsgebühr ab ' + monatName_(ab),
    html: rahmen_('<h1 style="font-size:22px;">Erster Auftrag bei ' + esc_(k.betrieb) + '</h1>' +
      '<p>' + esc_(an.get(z, 'Name')) + (zahl_(an.get(z, 'Auftragswert €')) ? ', Auftragswert ' + euro_(an.get(z, 'Auftragswert €')) : '') + '.</p>' +
      '<p><b>Ab ' + monatName_(ab) + ' ist die Monatsgebühr fällig' + (k.gebuehr ? ' (' + euro_(k.gebuehr) + ')' : '') + '.</b></p>' +
      '<ol><li>Kunden anrufen und gratulieren.</li><li>Im Kundenordner „Mail mit Rechnung“, Mail 2 schicken.</li>' +
      '<li>Ab dann erinnert dich die Zentrale jeden Monatsersten an die Rechnung.</li></ol>')
  });
}


// ================================================================ Zeitpläne

function pruefeRueckrufe() { sicher_('Rückruf-Prüfung', function () {
  var s = einst_(), jetzt = new Date();
  if (!inZeit_(jetzt, s)) return;
  var an = tabelle_('Anfragen');
  an.zeilen.forEach(function (z) {
    if (String(an.get(z, 'Stand')) !== 'neu' || an.get(z, 'Zurückgerufen') || an.get(z, 'Erinnert')) return;
    var ein = datum_(an.get(z, 'Eingang'));
    if (!ein || jetzt - ein > 3 * TAG) return;
    var min = geschaeftsMinuten_(ein, jetzt, s);
    if (min < s.rueckruf_minuten) return;
    var k = kunde_(an.get(z, 'Kunde')), schl = an.get(z, 'Schlüssel'), id = an.get(z, 'ID');
    var a = { name: an.get(z, 'Name'), telefon: an.get(z, 'Telefon'), plz: an.get(z, 'PLZ'), email: an.get(z, 'E-Mail'),
      seite: an.get(z, 'Seite'), quelle: an.get(z, 'Quelle'), id: id };
    if (k && k.aktiv) {
      mail_(s, { to: k.email, absender: k.betrieb + ' · Anfragen',
        subject: 'Erinnerung: ' + a.name + ' wartet seit ' + min + ' Minuten auf Ihren Rückruf',
        html: anfrageHtml_(a, an.get(z, 'Details'), s, schl, k) });
    }
    mail_(s, { to: s.an, subject: '⏰ ' + (k ? k.betrieb : an.get(z, 'Kunde')) + ': ' + a.name + ' seit ' + min + ' Min. ohne Rückruf',
      html: rahmen_('<p><b>' + esc_(k ? k.betrieb : an.get(z, 'Kunde')) + '</b> hat ' + esc_(a.name) + ' (' + esc_(a.telefon) +
        ') noch nicht zurückgerufen. Der Kunde ist erinnert. Am besten kurz anrufen: Ohne schnellen Rückruf keine Aufträge.</p>') });
    an.set(z, 'Erinnert', jetzt);
  });
}); }

function wochenMail() { sicher_('Wochen-Mail', function () {
  var s = einst_(), an = tabelle_('Anfragen'), jetzt = new Date(), uebersicht = [];
  kunden_().filter(function (k) { return k.aktiv; }).forEach(function (k) {
    var offen = an.zeilen.filter(function (z) {
      var ein = datum_(an.get(z, 'Eingang')), st = String(an.get(z, 'Stand'));
      return an.get(z, 'Kunde') === k.kuerzel && ein && jetzt - ein > TAG && jetzt - ein < 120 * TAG &&
        st !== 'Auftrag' && st !== 'kein Interesse';
    });
    if (!offen.length) return;
    var liste = offen.map(function (z) {
      var id = an.get(z, 'ID'), schl = an.get(z, 'Schlüssel'), st = String(an.get(z, 'Stand'));
      var knoepfe = (st === 'neu' || st === 'nicht erreicht' ? ['zurueckgerufen'] : [])
        .concat(['termin', 'angebot', 'auftrag', 'kein-interesse'])
        .filter(function (x) { return neuerStand_(st, KNOEPFE[x].stand) !== st; });
      return '<tr><td style="padding:14px 0;border-top:1px solid #E8E2D6;">' +
        '<b style="font-size:16px;">' + esc_(an.get(z, 'Name')) + '</b> · ' + esc_(an.get(z, 'Telefon')) +
        '<br><span style="color:#6B665D;font-size:13px;">Eingang ' + datumText_(datum_(an.get(z, 'Eingang')), s) + ' · Stand: ' + esc_(st) + '</span><br>' +
        knoepfe.map(function (x) { return knopf_(s, id, schl, x, true); }).join(' ') + '</td></tr>';
    }).join('');
    mail_(s, { to: k.email, absender: k.betrieb + ' · Anfragen',
      subject: 'Ihre offenen Anfragen (' + offen.length + '): bitte kurz den Stand antippen',
      html: rahmen_('<p>Guten Morgen ' + esc_(k.anrede) + ',</p><p>hier Ihre offenen Anfragen. Bitte tippen Sie bei jeder an, wie weit sie ist. ' +
        'Das dauert eine Minute und macht Ihren Monatsreport genau.</p><table style="width:100%;border-collapse:collapse;">' + liste + '</table>' +
        '<p style="font-size:13px;color:#6B665D;">Fragen? Antworten Sie einfach auf diese Mail.</p>') });
    var warten = offen.filter(function (z) { return String(an.get(z, 'Stand')) === 'neu'; }).length;
    uebersicht.push('<li><b>' + esc_(k.betrieb) + '</b>: ' + offen.length + ' offen' + (warten ? ', davon <b>' + warten + ' noch nie angerufen</b>' : '') + '</li>');
  });
  if (uebersicht.length) {
    mail_(s, { to: s.an, subject: 'Wochen-Mails sind raus (' + uebersicht.length + ' Kunden)',
      html: rahmen_('<p>Jeder Kunde hat seine offenen Anfragen mit Knöpfen bekommen:</p><ul>' + uebersicht.join('') + '</ul>' +
        '<p>Steht irgendwo „noch nie angerufen“: kurz beim Kunden nachhaken.</p>') });
  }
}); }

function monatsAnfang() { sicher_('Monatsanfang', function () {
  var s = einst_(), jetzt = new Date(), vm = vormonat_(jetzt), an = tabelle_('Anfragen'), wk = tabelle_('Werbekosten');
  var aktive = kunden_().filter(function (k) { return k.aktiv && k.live && k.live < vm.ende; });
  var fehlend = aktive.filter(function (k) {
    return !wk.zeilen.some(function (z) { var m = datum_(wk.get(z, 'Monat')); return wk.get(z, 'Kunde') === k.kuerzel && m && gleicherMonat_(m, vm.start); });
  });
  var monatAnfang = new Date(jetzt.getFullYear(), jetzt.getMonth(), 1);
  var faellig = kunden_().filter(function (k) {
    var ab = gebuehrAb_(k.kuerzel, an);
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
  var s = einst_(), vm = vormonat_(new Date()), an = tabelle_('Anfragen'), wk = tabelle_('Werbekosten'), fertig = [];
  kunden_().filter(function (k) { return k.aktiv && k.live && k.live < vm.ende; }).forEach(function (k) {
    var z = zahlen_(an, wk, k.kuerzel, vm);
    var text = reportText_(k, z, vm, s);
    GmailApp.createDraft(k.email, 'Ihr Monatsreport ' + monatName_(vm.start), text, { name: s.agentur_name || 'Clickculture', replyTo: s.agentur_email || '' });
    fertig.push('<li>' + esc_(k.betrieb) + ': ' + z.anfragen + ' Anfragen, ' + z.auftraege + ' Aufträge' + (z.kosten === null ? ' · <b>Werbekosten fehlen</b>' : '') + '</li>');
  });
  if (fertig.length) {
    mail_(s, { to: s.an, subject: fertig.length + ' Monatsreports liegen als Entwurf in Gmail',
      html: rahmen_('<p>Für ' + monatName_(vm.start) + ':</p><ul>' + fertig.join('') + '</ul>' +
        '<p>So geht es: Gmail → Entwürfe → je Report die drei [eckigen Klammern] ersetzen → senden → 10 Minuten anrufen.</p>' +
        '<p>Fehlen Werbekosten: erst eintragen, dann in der Zentrale Menü „Clickculture → Monatsreport-Entwürfe jetzt erstellen“ und den alten Entwurf löschen.</p>') });
  }
}); }

function taeglich() { sicher_('Täglich', function () {
  var s = einst_(), jetzt = new Date(), heute = Utilities.formatDate(jetzt, s.tz, 'yyyy-MM-dd'), props = PropertiesService.getScriptProperties();
  // Verlosungen
  kunden_().filter(function (k) { return k.aktiv && k.ziehung && Utilities.formatDate(k.ziehung, s.tz, 'yyyy-MM-dd') === heute; }).forEach(function (k) {
    var merk = 'gezogen_' + k.kuerzel + '_' + heute;
    if (props.getProperty(merk)) return;
    var an = tabelle_('Anfragen'), bis = k.schluss ? new Date(k.schluss.getTime() + TAG) : jetzt;
    var teilnehmer = an.zeilen.filter(function (z) {
      var ein = datum_(an.get(z, 'Eingang'));
      return an.get(z, 'Kunde') === k.kuerzel && /^Verlosung/.test(String(an.get(z, 'Seite'))) && ein && ein < bis;
    }).map(function (z) { return { name: an.get(z, 'Name'), telefon: an.get(z, 'Telefon'), email: an.get(z, 'E-Mail'), seite: an.get(z, 'Seite') }; });
    var html = Object.keys(GEWINNER).map(function (seite) {
      var liste = eindeutig_(teilnehmer.filter(function (t) { return t.seite === seite; }));
      var g = ziehen_(liste, GEWINNER[seite], Math.random);
      return '<h2 style="font-size:17px;">' + esc_(seite) + ' (' + liste.length + ' Teilnehmer, ' + GEWINNER[seite] + ' Gewinner)</h2>' +
        (g.length ? '<ol>' + g.map(function (t) { return '<li><b>' + esc_(t.name) + '</b> · ' + esc_(t.telefon) + (t.email ? ' · ' + esc_(t.email) : '') + '</li>'; }).join('') + '</ol>' : '<p>Keine Teilnehmer.</p>');
    }).join('');
    mail_(s, { to: k.email + ',' + s.an, absender: 'Clickculture Zentrale', subject: 'Verlosung ' + k.betrieb + ': die Gewinner',
      html: rahmen_('<p>Heute ist Ziehung. Das System hat zufällig gezogen (jede Telefonnummer zählt einmal):</p>' + html +
        '<p><b>Jetzt:</b> Gewinner anrufen und gratulieren. Alle anderen Teilnehmer sind ganz normale Anfragen: weiter anrufen und beraten.</p>') });
    props.setProperty(merk, 'ja');
  });
  // Akquise
  if (/^nein/i.test(String(s.akquise_erinnerung))) return;
  var ak = tabelle_('Akquise'), ende = new Date(jetzt.getFullYear(), jetzt.getMonth(), jetzt.getDate() + 1);
  var dran = ak.zeilen.filter(function (z) {
    var d = datum_(ak.get(z, 'Nächster Anruf am')), st = String(ak.get(z, 'Stand'));
    return ak.get(z, 'Firma') && d && d < ende && st !== 'Kunde' && st !== 'kein Interesse';
  });
  if (!dran.length) return;
  mail_(s, { to: s.an, subject: 'Heute anrufen: ' + dran.length + ' Betrieb' + (dran.length > 1 ? 'e' : ''),
    html: rahmen_('<ul>' + dran.map(function (z) {
      var tel = String(ak.get(z, 'Telefon')).replace(/[^\d+]/g, '');
      return '<li style="margin-bottom:8px;"><b>' + esc_(ak.get(z, 'Firma')) + '</b>' + (ak.get(z, 'Ort') ? ', ' + esc_(ak.get(z, 'Ort')) : '') +
        ' · <a href="tel:' + esc_(tel) + '">' + esc_(ak.get(z, 'Telefon')) + '</a>' + (ak.get(z, 'Wer') ? ' · ' + esc_(ak.get(z, 'Wer')) : '') +
        '<br><span style="color:#6B665D;">' + esc_(ak.get(z, 'Stand')) + (ak.get(z, 'Notiz') ? ' · ' + esc_(ak.get(z, 'Notiz')) : '') + '</span></li>';
    }).join('') + '</ul><p>Nach dem Anruf im Blatt „Akquise“ Stand und nächsten Anruf eintragen.</p>') });
}); }


// ================================================================ Zahlen

function zahlen_(an, wk, kuerzel, vm) {
  var z = { anfragen: 0, termine: 0, angebote: 0, auftraege: 0, umsatz: 0, minuten: null, kosten: null, seiten: {} };
  var mins = [];
  an.zeilen.forEach(function (r) {
    var ein = datum_(an.get(r, 'Eingang'));
    if (an.get(r, 'Kunde') !== kuerzel || !ein || ein < vm.start || ein >= vm.ende) return;
    var st = String(an.get(r, 'Stand')), i = STAND.indexOf(st), seite = String(an.get(r, 'Seite'));
    z.anfragen++;
    z.seiten[seite] = (z.seiten[seite] || 0) + 1;
    if (i >= STAND.indexOf('Termin')) z.termine++;
    if (i >= STAND.indexOf('Angebot')) z.angebote++;
    if (st === 'Auftrag') { z.auftraege++; z.umsatz += zahl_(an.get(r, 'Auftragswert €')); }
    var m = an.get(r, 'Minuten bis Rückruf');
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
  var monat = monatName_(vm.start), cpl = z.kosten && z.anfragen ? Math.round(z.kosten / z.anfragen) : null;
  var seiten = Object.keys(z.seiten).map(function (x) { return x + ' ' + z.seiten[x]; }).join(', ');
  return 'Hallo ' + k.anrede + ',\n\n' +
    'hier Ihre Zahlen für ' + monat + ':\n' +
    '- Werbeausgaben: ' + (z.kosten === null ? '[Werbekosten fehlen]' : euro_(z.kosten)) + '\n' +
    '- Anfragen: ' + z.anfragen + (cpl !== null ? ' (Kosten pro Anfrage: ' + euro_(cpl) + ')' : '') + (seiten ? '\n  davon ' + seiten : '') + '\n' +
    '- Rückruf im Schnitt nach ' + (z.minuten === null ? '[keine Angabe]' : z.minuten + ' Minuten') + '\n' +
    '- Termine: ' + z.termine + ' · Angebote: ' + z.angebote + ' · Aufträge: ' + z.auftraege +
    (z.umsatz ? ' (Auftragswert laut Ihnen: ' + euro_(z.umsatz) + ')' : '') + '\n\n' +
    'Was wir geändert haben: [eine Sache]\n' +
    'Was wir als Nächstes tun: [eine Sache]\n' +
    'Was wir von Ihnen brauchen: [z. B. neue Fotos in Ihren Ordner, Rückmeldung zu offenen Anfragen]\n\n' +
    'Beste Grüße\n' + (s.agentur_inhaber || '') + (s.agentur_name ? '\n' + s.agentur_name : '');
}

function gebuehrAb_(kuerzel, an) {
  var erste = null;
  an.zeilen.forEach(function (z) {
    var d = datum_(an.get(z, 'Auftrag am'));
    if (an.get(z, 'Kunde') === kuerzel && an.get(z, 'Stand') === 'Auftrag' && d && (!erste || d < erste)) erste = d;
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
  return liste.filter(function (t) {
    var k = String(t.telefon).replace(/\D/g, '') || String(t.name).toLowerCase();
    if (gesehen[k]) return false;
    gesehen[k] = true;
    return true;
  });
}


// ================================================================ Zeit

function inZeit_(d, s) {
  var tag = Number(Utilities.formatDate(d, s.tz, 'u')), std = Number(Utilities.formatDate(d, s.tz, 'H'));
  return tag <= s.zeiten.tage && std >= s.zeiten.von && std < s.zeiten.bis;
}

/** Minuten zwischen zwei Zeitpunkten, gezählt nur in den Geschäftszeiten (5-Minuten-Schritte, höchstens 7 Tage). */
function geschaeftsMinuten_(von, bis, s) {
  var n = 0, schritt = 5 * 60000, ende = Math.min(bis.getTime(), von.getTime() + 7 * TAG);
  for (var t = von.getTime(); t < ende; t += schritt) if (inZeit_(new Date(t), s)) n += 5;
  return n;
}

function vormonat_(d) {
  return { start: new Date(d.getFullYear(), d.getMonth() - 1, 1), ende: new Date(d.getFullYear(), d.getMonth(), 1) };
}
function ersterNaechsterMonat_(d) { return new Date(d.getFullYear(), d.getMonth() + 1, 1); }
function gleicherMonat_(a, b) { return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth(); }
function monatName_(d) { return MONATE[d.getMonth()] + ' ' + d.getFullYear(); }
function datumText_(d, s) { return d ? Utilities.formatDate(d, s.tz, 'dd.MM.yyyy HH:mm') : ''; }
function datum_(v) {
  if (v instanceof Date) return isNaN(v.getTime()) ? null : v;
  if (v === '' || v == null) return null;
  var m = String(v).match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})/);
  if (m) return new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]));
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
    return {
      kuerzel: String(t.get(z, 'Kürzel')).trim().toLowerCase(), betrieb: String(t.get(z, 'Betrieb')) || String(t.get(z, 'Kürzel')),
      anrede: String(t.get(z, 'Anrede für Mails')) || 'zusammen', email: String(t.get(z, 'E-Mail für Anfragen')).trim(),
      telefon: String(t.get(z, 'Telefon')), drive: String(t.get(z, 'Drive-Ordner')).trim(), gebuehr: zahl_(t.get(z, 'Monatsgebühr €')),
      live: datum_(t.get(z, 'Live seit')), aktiv: !/^nein/i.test(String(t.get(z, 'Aktiv'))) && !!String(t.get(z, 'E-Mail für Anfragen')).trim(),
      schluss: datum_(t.get(z, 'Teilnahmeschluss')), ziehung: datum_(t.get(z, 'Ziehung am'))
    };
  });
}

function kunde_(kuerzel) {
  var k = String(kuerzel || '').toLowerCase();
  return kunden_().filter(function (x) { return x.kuerzel === k; })[0] || null;
}

function einst_() {
  var s = {};
  blatt_('Einstellungen').getDataRange().getValues().forEach(function (z) { if (z[0]) s[String(z[0]).trim()] = z[2]; });
  s.rueckruf_minuten = Number(s.rueckruf_minuten) || 60;
  var m = String(s.geschaeftszeiten || '8-18').match(/(\d+)\D+(\d+)/);
  s.zeiten = { von: m ? Number(m[1]) : 8, bis: m ? Number(m[2]) : 18, tage: /sa/i.test(String(s.arbeitstage)) ? 6 : 5 };
  s.tz = Session.getScriptTimeZone();
  s.an = String(s.benachrichtigung_an || s.agentur_email || '').trim() || Session.getEffectiveUser().getEmail();
  return s;
}

function einstSetzen_(schluessel, wert) {
  var sh = blatt_('Einstellungen'), werte = sh.getDataRange().getValues();
  for (var i = 0; i < werte.length; i++) if (String(werte[i][0]).trim() === schluessel) { sh.getRange(i + 1, 3).setValue(wert); return; }
  throw new Error('In „Einstellungen“ fehlt die Zeile ' + schluessel);
}

function dateiSichern_(a, k) {
  try {
    var id = (String(k.drive).match(/folders\/([\w-]+)/) || String(k.drive).match(/[?&]id=([\w-]+)/) || [])[1];
    if (!id) return '';
    var ordner = DriveApp.getFolderById(id), it = ordner.getFoldersByName('Stromrechnungen');
    var ziel = it.hasNext() ? it.next() : ordner.createFolder('Stromrechnungen');
    var antwort = UrlFetchApp.fetch(a.dateiUrl, { muteHttpExceptions: true });
    if (antwort.getResponseCode() !== 200) return '';
    var blob = antwort.getBlob();
    var endung = (String(blob.getName() || '').match(/\.\w+$/) || ['.jpg'])[0];
    blob.setName('Stromrechnung ' + a.name + ' ' + Utilities.formatDate(a.eingang, Session.getScriptTimeZone(), 'yyyy-MM-dd') + endung);
    return ziel.createFile(blob).getUrl();
  } catch (e) {
    return '';
  }
}


// ================================================================ Mails und Seiten

function mail_(s, o) {
  MailApp.sendEmail({
    to: o.to, subject: o.subject, htmlBody: o.html, body: ohneHtml_(o.html),
    name: o.absender || s.agentur_name || 'Clickculture', replyTo: s.agentur_email || undefined
  });
}

function rahmen_(inhalt) {
  return '<div style="font-family:-apple-system,Helvetica,Arial,sans-serif;color:#1A1917;max-width:560px;line-height:1.45;">' + inhalt + '</div>';
}

function basis_(s) {
  var url = String(s.webapp_url || '').trim(), dienst = ScriptApp.getService().getUrl() || '';
  return url || (/\/exec$/.test(dienst) ? dienst : '');
}

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

function text_(t) { return ContentService.createTextOutput(t); }

function sicher_(was, fn) {
  try { fn(); } catch (err) { fehler_(was, err); }
}

function fehler_(was, err) {
  try {
    var s = einst_();
    MailApp.sendEmail(s.an, '⚠ Zentrale: Fehler bei „' + was + '“',
      'Die Automatik hatte ein Problem:\n\n' + (err && err.stack || err) + '\n\nHäufigste Ursache: eine Spalte oder ein Blatt wurde umbenannt.');
  } catch (e) { /* nichts mehr zu tun */ }
}

function neuerSchluessel_() { return Utilities.getUuid().replace(/-/g, '').slice(0, 16); }
function zahl_(v) { var n = Number(String(v == null ? '' : v).replace(/[^\d,.-]/g, '').replace(/\.(?=\d{3}(\D|$))/g, '').replace(',', '.')); return isNaN(n) ? 0 : n; }
function euro_(v) { return Math.round(zahl_(v)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' €'; }
function esc_(v) { return String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
function ohneHtml_(h) {
  return String(h || '').replace(/<a [^>]*href="([^"]*)"[^>]*>([^<]*)<\/a>/g, '$2 ($1)').replace(/<br\s*\/?>/g, '\n')
    .replace(/<\/(p|h1|h2|li|tr|ol|ul)>/g, '\n').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/\n{3,}/g, '\n\n').trim();
}
