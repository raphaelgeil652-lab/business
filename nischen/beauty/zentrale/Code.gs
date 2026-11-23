/**
 * Clickculture Beauty-Zentrale – Online-Buchung und Automatik im Hintergrund.
 * Läuft als Google Apps Script in der Google-Tabelle „Clickculture Beauty-Zentrale“. Kostenlos.
 *
 * Was sie von selbst macht:
 *  0. Neue Kunden (Version 2): Formular „Neuer Kunde“ (Menü 2 oder Lesezeichen) → Kunde, Vereinbarung, Fotos-Ordner,
 *     Willkommens-Mail. Das Studio arbeitet seine Schritte-Seite ab (?a=studio), die Zentrale erinnert und meldet
 *     „alles da“. Die Team-Seite (?a=team) hat alle Knöpfe für euch: Pixel/Conversion, live schalten, Report, bezahlt.
 *     Rechnungen gehen als PDF raus (Onboarding nach Annahme, Monatsgebühr am 1.).
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
 *  6. Rückruf-Wünsche (direkt von der Seite, alte Netlify-Webhooks gehen weiter): Mail mit „Zurückgerufen“, Erinnerung nach 60 Min.
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

/* ======== BAUSTEIN-ANFANG: erzeugt von zentrale-bauen.py aus vorlagen/module.py und vorlagen/texte/vereinbarung.md. Nicht von Hand ändern. */
var MODULE = {"Laser": {"kurz": "laser", "name": "Laser-Haarentfernung", "behandler": ["Kosmetik mit NiSV-Fachkunde", "Arzt/Ärztin"], "qualifikation": "NiSV-Fachkunde (Zertifikat) für jede Person, die lasert. Ohne Nachweis kein Kunde.", "regeln": {"verlosung": true, "vorher_nachher": true, "rabatt": true, "kostenlos": true, "preise": true, "direkt": true}, "vorbereitung": ["Die Stelle 24 Stunden vorher rasieren, nicht epilieren und nicht wachsen", "4 Wochen vorher nicht mehr epilieren, wachsen oder zupfen", "2 Wochen vorher keine Sonne, kein Solarium, kein Selbstbräuner", "Am Tag selbst keine Creme, kein Deo und kein Make-up auf der Stelle", "Nehmen Sie Medikamente ein (z. B. Antibiotika), sagen Sie es uns bitte vorher"], "recht": "Wettbewerbsrecht und Preisangaben; „dauerhaft“ nur mit Hinweis auf mehrere Sitzungen und ohne Garantie", "kosten_pro_termin": 35, "meta_anteil": 0.7, "preis": "Onboarding ca. 700 €, Monatsgebühr ca. 799–999 €, Werbebudget ca. 500–800 €"}, "Permanent Make-up": {"kurz": "pmu", "name": "Permanent Make-up", "behandler": ["Kosmetik/PMU-Studio", "Kosmetik mit NiSV-Fachkunde", "Arzt/Ärztin"], "qualifikation": "Hygieneschulung und Nachweis der PMU-Ausbildung; Arbeitsproben (echte Ergebnisfotos).", "regeln": {"verlosung": true, "vorher_nachher": false, "rabatt": true, "kostenlos": true, "preise": true, "direkt": true}, "vorbereitung": ["Kommen Sie bei Augenbrauen am besten ungeschminkt, bei Lippen ohne Lippenstift", "24 Stunden vorher bitte keinen Alkohol", "Blutverdünnende Mittel nur nach Rücksprache mit Ihrem Arzt weglassen, nie auf eigene Faust", "Hatten Sie schon einmal Lippenherpes? Bei Lippen-Pigmentierung sagen Sie es uns bitte vorher", "Planen Sie den Nachstechtermin ein, meist einige Wochen später"], "recht": "Wettbewerbsrecht und Preisangaben; Ergebnisfotos nur echte, Vorher/Nachher-Collagen nicht in Anzeigen", "kosten_pro_termin": 45, "meta_anteil": 0.75, "preis": "Onboarding ca. 400–500 €, Monatsgebühr ca. 399–599 €, Werbebudget ca. 300–600 €"}, "Faltenbehandlung": {"kurz": "falten", "name": "Faltenbehandlung und Hyaluron", "behandler": ["Arzt/Ärztin", "Heilpraktiker/in"], "qualifikation": "Arzt/Ärztin (Muskelrelaxans und Hyaluron) oder Heilpraktiker/in (nur Hyaluron). Kosmetikstudios: nein.", "regeln": {"verlosung": false, "vorher_nachher": false, "rabatt": false, "kostenlos": false, "preise": false, "direkt": false}, "vorbereitung": ["Kommen Sie wenn möglich ungeschminkt", "Bringen Sie eine Liste Ihrer Medikamente mit", "Planen Sie nach einer Behandlung am selben Tag keinen Sport, keine Sauna und kein Solarium ein", "Für eine Behandlung müssen Sie mindestens 18 Jahre alt sein"], "recht": "Heilmittelwerbegesetz: kein „Botox“, kein Vorher/Nachher, keine Verlosung, keine Rabatte, kein „kostenlos“", "kosten_pro_termin": 60, "meta_anteil": 0.65, "preis": "Onboarding ca. 700 €, Monatsgebühr ca. 799–999 €, Werbebudget ca. 600–1.000 €"}, "Bleaching": {"kurz": "bleaching", "name": "Zahnaufhellung (Bleaching)", "behandler": ["Zahnarztpraxis"], "qualifikation": "Nur Zahnarztpraxen. Bleaching-Studios ohne Zahnarzt sind rechtlich unsicher und kein Kunde.", "regeln": {"verlosung": false, "vorher_nachher": false, "rabatt": false, "kostenlos": false, "preise": true, "direkt": true}, "vorbereitung": ["Bringen Sie wenn vorhanden Ihr Bonusheft mit", "Bringen Sie eine Liste Ihrer Medikamente mit", "Vor einer Aufhellung prüfen wir Zähne und Zahnfleisch. Oft gehört eine Zahnreinigung dazu", "Füllungen und Kronen hellen nicht mit auf. Das besprechen wir vorher"], "recht": "Berufsordnung der Zahnärzte und Heilmittelwerbegesetz: sachlich, keine Rabatte, keine Verlosung, kein „kostenlos“", "kosten_pro_termin": 50, "meta_anteil": 0.6, "preis": "Onboarding ca. 600–700 €, Monatsgebühr ca. 599–799 €, Werbebudget ca. 400–700 €"}};
var BEHANDLER = ["Arzt/Ärztin", "Heilpraktiker/in", "Kosmetik mit NiSV-Fachkunde", "Kosmetik/PMU-Studio", "Zahnarztpraxis"];
var VEREINBARUNG = "<h2>Vereinbarung</h2><p>zwischen</p><p><b>Auftragnehmer:</b> {{agentur_name}}, {{agentur_inhaber}} · {{agentur_anschrift}} · {{agentur_email}} · {{agentur_telefon}}<br>Ansprechpartner für den Auftraggeber: {{betreuer_name}} · {{betreuer_telefon}} · {{betreuer_email}}</p><p>und</p><p><b>Auftraggeber:</b> {{firma}} · {{adresse}} · vertreten durch {{inhaber}}</p><h3>§1 Gegenstand</h3><p>Beworben wird: <b>{{modul_name}}</b> bei {{betrieb}}.<br>Interessentinnen und Interessenten buchen über eine Terminseite online einen Termin für eine dieser Leistungen:<br>{{leistungen_text}}. Ein Termin gilt erst als gebucht, wenn die Person ihn per E-Mail bestätigt hat.<br>Wer keinen passenden Termin findet, kann einen Rückruf anfordern.<br>Werbebudget: <b>{{budget}} pro Monat</b> für Werbung auf Meta (Facebook und Instagram). Werbegebiet: {{umkreis_km}} km um {{ort}}.</p><h3>§2 Leistungen des Auftragnehmers</h3><ul><li>Erstellung und Betrieb der Terminseite mit Online-Buchung, Bestätigung per E-Mail, Erinnerung vor dem Termin und Absage-Möglichkeit für die Kundschaft.</li><li>Schutz gegen Fake-Buchungen: Bestätigung per E-Mail, Prüfung der Angaben, Sperrliste.</li><li>Einrichtung und laufende Betreuung der Werbung auf Meta (Facebook und Instagram).</li><li>Benachrichtigung des Auftraggebers über jeden bestätigten Termin, jede Absage und jeden Rückruf-Wunsch.</li><li>Laufende Optimierung der Kampagnen.</li><li>Monatsreport mit Werbeausgaben, bestätigten Terminen, Kosten pro Termin und den vom Auftraggeber gemeldeten Ergebnissen (erschienen, Behandlung gekauft).</li></ul><h3>§3 Pflichten des Auftraggebers</h3><ul><li>Material: echte Fotos aus dem Studio bzw. der Praxis, Links zu Impressum und Datenschutzerklärung.</li><li>Einladung des Auftragnehmers in das Business-Portfolio des Auftraggebers bei Meta. Der Auftragnehmer legt dort im Namen des Auftraggebers Facebook-Seite, Werbekonto und Pixel an, soweit noch nicht vorhanden. Sie gehören dem Auftraggeber. Im Werbekonto hinterlegt der Auftraggeber seine eigene Zahlungsart; das Werbebudget läuft über sein Konto.</li><li>{{kalender_pflicht}}</li><li>Prüfung und Freigabe der Vorbereitungs-Hinweise und der Absageregel, die die Kundschaft erhält. Für deren fachliche Richtigkeit ist der Auftraggeber verantwortlich.</li><li>Der Auftraggeber versichert, dass er und alle Behandelnden die nötige Qualifikation besitzen ({{qualifikation}}), und informiert den Auftragnehmer unverzüglich, wenn sich daran etwas ändert.</li><li>Seine Datenschutzerklärung nennt die Terminseite (Hosting über Netlify), die Online-Terminbuchung, das Meta-Pixel.</li><li>Rückruf auf Rückruf-Wünsche innerhalb 1 Stunde während der Geschäftszeiten, spätestens am selben Werktag.</li><li>Rückmeldung zu jedem Termin über die Knöpfe in den Mails: erschienen, nicht erschienen, Behandlung gekauft. Beim Kauf gibt der Auftraggeber den Betrag an, den die Kundin bezahlt hat. Er ist die Grundlage der Provision.</li><li>Ausreichende freie Termine für die vermittelten Buchungen.</li></ul><h3>§4 Vergütung</h3><ul><li><b>Keine Grundgebühr, kein Onboarding.</b></li><li><b>Provision: {{provision}} %</b> vom ersten Kauf einer Neukundin, die über die Terminseite gebucht und ihren Termin per E-Mail bestätigt hat (Behandlung oder Paket). Erfasst wird der erste Kauf innerhalb von 3 Monaten nach ihrem ersten Online-Termin, auch wenn dieser Termin eine Beratung war. Weitere Käufe derselben Kundin sind provisionsfrei.</li><li>Abrechnung monatlich zum Monatsanfang für den Vormonat, auf Grundlage der Beträge, die der Auftraggeber über die Knöpfe „Behandlung gekauft“ meldet.</li><li><b>Werbebudget:</b> zahlt der Auftraggeber separat und direkt an Meta.</li><li>Zahlungsziel 14 Tage ab Rechnungsdatum. {{ust_hinweis}}</li></ul><h3>§5 Laufzeit</h3><p>Beginn: mit Annahme dieser Vereinbarung. Keine Mindestlaufzeit, jederzeit zum Monatsende in Textform (z. B. per<br>E-Mail) kündbar. Facebook-Seite, Werbekonten und deren Daten gehören dem Auftraggeber und bleiben bei ihm. Bei<br>Vertragsende beendet der Auftragnehmer seinen Zugang, schaltet die Terminseite ab und löscht die Termindaten der<br>Kundschaft, soweit keine Aufbewahrungspflicht besteht.</p><h3>§6 Datenschutz</h3><p>Über die Terminseite werden personenbezogene Daten von Interessentinnen und Interessenten verarbeitet (Name,<br>Telefon, E-Mail, gewünschter Termin). Der Auftragnehmer verarbeitet sie im Auftrag des Auftraggebers. Die<br>Parteien schließen dazu einen Auftragsverarbeitungsvertrag nach Art. 28 DSGVO. Gesundheitsangaben werden<br>über die Terminseite nicht abgefragt.</p><h3>§7 Werbung und Recht</h3><p>Ergebnisse hängen auch von Erreichbarkeit, Beratung und Kapazität des Auftraggebers ab. Eine bestimmte Zahl<br>von Terminen, Käufen oder ein bestimmter Umsatz wird nicht garantiert. Der Auftragnehmer erstellt die Werbung<br>nach bestem Wissen so, dass sie die für diese Behandlung geltenden Werberegeln einhält ({{recht_kurz}}).<br>Der Auftraggeber kann Anzeigen und Terminseite vor dem Start ansehen und Änderungen verlangen. Der Auftragnehmer<br>darf das Projekt mit Zustimmung als Referenz nennen.</p><h3>§8 Garantie</h3><p>Der Auftraggeber zahlt nur, wenn Neukundinnen aus der Werbung tatsächlich kaufen. Kommen in den ersten 30 Tagen ab<br>Kampagnenstart keine echten, per E-Mail bestätigten Termine zustande, kann der Auftraggeber sofort kündigen.</p><h3>§9 Zustandekommen</h3><p>Diese Vereinbarung kommt zustande, wenn der Auftraggeber sie auf seiner persönlichen Schritte-Seite verbindlich<br>annimmt. Der Link zu dieser Seite wurde nur an seine E-Mail-Adresse geschickt. Name, Datum, Uhrzeit, verwendeter<br>Browser und eine Prüfsumme des Vertragstextes werden gespeichert. Beide Seiten erhalten die Vereinbarung mit diesem<br>Annahme-Nachweis als PDF per E-Mail (Textform). Eine Unterschrift ist zwischen Unternehmen nicht nötig.</p>";
var REGELN_VON_BEHANDLER = {"Kosmetik/PMU-Studio": "Permanent Make-up", "Kosmetik mit NiSV-Fachkunde": "Laser", "Arzt/Ärztin": "Faltenbehandlung", "Heilpraktiker/in": "Faltenbehandlung", "Zahnarztpraxis": "Bleaching"};
var PROVISION_STANDARD = 15;
var VORBEREITUNG_ALLGEMEIN = ["Bitte kommen Sie 5 Minuten vor Ihrem Termin", "Hat sich gesundheitlich etwas geändert oder nehmen Sie neue Medikamente? Sagen Sie es uns bitte vor der Behandlung", "Können Sie nicht kommen, sagen Sie bitte rechtzeitig über den Link in Ihrer Bestätigung ab"];
/* ======== BAUSTEIN-ENDE */


// ================================================================ Menü und Einrichtung

function onOpen() {
  SpreadsheetApp.getUi().createMenu('Clickculture')
    .addItem('1 · Einrichten (einmal, und nach jeder neuen Bereitstellung)', 'einrichten')
    .addItem('2 · Neuer Kunde (im Gespräch ausfüllen)', 'neuerKundeFenster')
    .addItem('3 · Kalender der Kunden prüfen', 'kalenderPruefen')
    .addItem('4 · Test-Buchung durchspielen', 'testBuchung')
    .addSeparator()
    .addItem('Abend-Mail jetzt senden', 'abendMail')
    .addItem('Wochen-Mail jetzt senden', 'wochenMail')
    .addItem('Übersicht und Formular als Lesezeichen', 'lesezeichen')
    .addToUi();
}

function einrichten() {
  var ui = SpreadsheetApp.getUi(), s = einst_();
  ['Einstellungen', 'Kunden', 'Termine', 'Sperrliste', 'Werbekosten', 'Akquise'].forEach(blatt_);
  blattSicher_('Kunden', KUNDEN_SPALTEN);
  blattSicher_('Verträge', VERTRAEGE_SPALTEN);
  if (SpreadsheetApp.getActive().getSheetByName('Rechnungen')) blattSicher_('Rechnungen', ['Kürzel']);
  einstellungenErgaenzen_();
  s = einst_();
  if (!s.schluessel) {
    s.schluessel = Utilities.getUuid().replace(/-/g, '').slice(0, 24);
    einstSetzen_('schluessel', s.schluessel);
  }
  if (basis_(s)) { einstSetzen_('uebersicht_url', teamLink_(s, '')); einstSetzen_('formular_url', formularLink_(s)); }
  ['Kunden', 'Termine', 'Akquise', 'Sperrliste'].forEach(textSpalten_);
  ScriptApp.getProjectTriggers().forEach(function (t) { ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('alle10Minuten').timeBased().everyMinutes(10).create();
  ScriptApp.newTrigger('abendMail').timeBased().everyDays(1).atHour(19).create();
  ScriptApp.newTrigger('wochenMail').timeBased().onWeekDay(ScriptApp.WeekDay.MONDAY).atHour(8).create();
  ScriptApp.newTrigger('monatsAnfang').timeBased().onMonthDay(1).atHour(7).create();
  ScriptApp.newTrigger('monatsReportEntwuerfe').timeBased().onMonthDay(3).atHour(7).create();
  ScriptApp.newTrigger('taeglich').timeBased().everyDays(1).atHour(8).create();
  var url = String(s.webapp_url || '').trim(), hinweise = [];
  if (url && !/^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(url)) {
    hinweise.push('Die Web-App-Adresse sieht falsch aus. Sie muss mit https://script.google.com/macros/s/ beginnen und auf /exec enden.');
  }
  if (!url) hinweise.push('Die Web-App-Adresse fehlt. Bitte Schritt 5 der Einrichtung machen und danach hier nochmal „Einrichten“ wählen.');
  if (s.tz !== 'Europe/Berlin') hinweise.push('Zeitzone ist „' + s.tz + '“. Bitte in Apps Script unter Projekteinstellungen (Zahnrad) auf „Berlin“ stellen.');
  if (!s.agentur_email) hinweise.push('Im Blatt „Einstellungen“ fehlt deine E-Mail.');
  if (!/^(ja|nein)$/i.test(String(s.agentur_kleinunternehmer || '').trim())) hinweise.push('Im Blatt „Einstellungen“ bei „Kleinunternehmer“ Ja oder Nein wählen.');
  if (!s.agentur_steuernr) hinweise.push('Im Blatt „Einstellungen“ fehlt die Steuernummer (Pflicht auf jeder Rechnung).');
  if (!s.agentur_business_id) hinweise.push('Im Blatt „Einstellungen“ fehlt die Meta Business-ID (steht auf der Schritte-Seite der Studios).');
  ui.alert('Clickculture Beauty-Zentrale',
    'Die Automatik läuft. 6 Zeitpläne sind aktiv.\n\n' +
    (url ? 'Zwei Lesezeichen für euch beide (Menü „Übersicht und Formular als Lesezeichen“): die Übersicht aller Studios und das Formular „Neuer Kunde“. Damit braucht ihr die Tabelle im Alltag nicht.\n\n' : '') +
    (hinweise.length ? 'Noch zu tun:\n- ' + hinweise.join('\n- ') : 'Alles bereit. Zur Sicherheit die Web-App-Adresse einmal in einem privaten Browserfenster öffnen: Es muss „Diese Adresse ist in Ordnung“ erscheinen. Danach: „4 · Test-Buchung durchspielen“.'),
    ui.ButtonSet.OK);
}

/** Zeigt die zwei Links, die man sich als Lesezeichen speichert. */
function lesezeichen() {
  var s = einst_();
  if (!basis_(s) || !s.schluessel) { SpreadsheetApp.getUi().alert('Erst die Einrichtung abschließen (Web-App-Adresse und „1 · Einrichten“).'); return; }
  var a = function (url, text) { return '<p><a href="' + esc_(url) + '" target="_blank" style="font-size:17px;font-weight:700;">' + text + '</a><br><span style="font-size:11px;color:#6B665D;word-break:break-all;">' + esc_(url) + '</span></p>'; };
  SpreadsheetApp.getUi().showModalDialog(HtmlService.createHtmlOutput('<div style="font-family:Arial,sans-serif;font-size:14px;">' +
    '<p>Beide Links öffnen und als Lesezeichen speichern (am Handy: Teilen → Zum Home-Bildschirm). Gilt für euch beide, nicht weitergeben.</p>' +
    a(teamLink_(s, ''), 'Übersicht aller Studios') + a(formularLink_(s), 'Neuer Kunde (Formular fürs Gespräch)') + '</div>').setWidth(520).setHeight(300), 'Lesezeichen');
}

/** Prüft für jeden aktiven Kunden im Modus „Kalender“, ob die Zentrale seinen Kalender lesen und beschreiben kann. */
function kalenderPruefen() {
  var ui = SpreadsheetApp.getUi(), s = einst_(), zeilen = [];
  kunden_().filter(function (k) { return k.aktiv; }).forEach(function (k) {
    if (k.modus !== 'Kalender') { zeilen.push('• ' + k.betrieb + ': Modus „Wunschtermin“ (kein Kalender nötig)'); return; }
    var cal = kalender_(k);
    if (!cal) { zeilen.push('• ' + k.betrieb + ': ✗ Kalender „' + k.kalender + '“ nicht erreichbar. Hat das Studio ihn für dich freigegeben (Änderungen an Terminen vornehmen)?'); return; }
    var n = freieSlots_(k, '', s).reduce(function (a, t) { return a + t.zeiten.length; }, 0);
    zeilen.push('• ' + k.betrieb + ': ✓ Kalender verbunden, ' + n + ' freie Zeiten in den nächsten ' + k.tage + ' Tagen');
  });
  ui.alert('Kalender der Kunden', zeilen.join('\n') || 'Keine aktiven Kunden.', ui.ButtonSet.OK);
}

/** Spielt eine Buchung durch: freier Platz beim ersten aktiven Kunden, Bestätigungs-Mail geht an DICH. */
function testBuchung() {
  var ui = SpreadsheetApp.getUi(), s = einst_(), k = kunden_().filter(function (x) { return x.aktiv; })[0];
  if (!k) { ui.alert('Erst im Blatt „Kunden“ eine Zeile anlegen (zum Testen dich selbst mit deiner E-Mail).'); return; }
  var tage = freieSlots_(k, '', s);
  if (!tage.length) { ui.alert('Bei ' + k.betrieb + ' gibt es keinen freien Platz. Buchbare Zeiten, Leistungen und Kalender prüfen.'); return; }
  var r = buchen_({ kunde: k.kuerzel, leistung: (k.leistungen[0] || {}).name, start: tage[0].datum + 'T' + tage[0].zeiten[0], name: 'TEST Anna Beispiel',
    telefon: '0151 23456781', email: s.an.split(',')[0], ms: 60000, quelle: 'test', test: true }, s);
  ui.alert(r.ok ? 'Test-Buchung angelegt (' + tage[0].label + ', ' + tage[0].zeiten[0] + ' Uhr).\n\nDie Mail „Bitte bestätigen“ ging an ' + s.an.split(',')[0] +
    '. Dort auf den Knopf tippen und auf der Seite, die sich öffnet, nochmal bestätigen. Dann: Termin im Kalender des Studios, Bestätigung an dich (mit Absage-Link), Mail an das Studio.\n\nZum Schluss in der Bestätigung auf „Termin absagen“: Der Kalendereintrag verschwindet wieder.'
    : 'Das hat nicht geklappt: ' + r.fehler);
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
  if (p.a === 'bestaetigen' || p.a === 'absagen') return kundenSeite_(p);
  if (p.format === 'json' && (p.a === 'studio' || p.a === 'neu' || p.a === 'team' || p.a === 'tnb')) {
    return json_(sicherJson_(function () {
      var out = p.a === 'studio' ? studioSeite_(p) : p.a === 'neu' ? formularSeite_(p) : p.a === 'tnb' ? teilnahmeSeite_(p) : teamSeite_(p);
      return { ok: true, html: out.getContent(), titel: out.getTitle ? out.getTitle() : '' };
    }));
  }
  if (p.a === 'tnb') return teilnahmeSeite_(p);
  if (p.a === 'studio') return studioSeite_(p);
  if (p.a === 'neu') return formularSeite_(p);
  if (p.a === 'team') return teamSeite_(p);
  if (p.a === 'mess') return json_(sicherJson_(function () { return messAnfrage_(p); }));
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
  if (d.a === 'anfrage') return json_(gesperrt_(function () { return anfrageDirekt_(d, s); }));
  if (d.a === 'run') return json_(portalAufruf_(d, s));
  return json_({ ok: false, fehler: 'Unbekannte Aktion.' });
}

/** Knöpfe aus dem Portal (statt google.script.run). Nur diese Funktionen, jede prüft ihren Schlüssel selbst. */
function portalAufruf_(d, s) {
  var erlaubt = { studioAktion: studioAktion, studioFoto: studioFoto, teamAktion: teamAktion, neuerKunde: neuerKunde };
  var fn = erlaubt[d.fn];
  if (!fn) return { ok: false, fehler: 'Unbekannte Aktion.' };
  if (d.fn === 'neuerKunde' && (!s.schluessel || String(d.t) !== String(s.schluessel))) return { ok: false, fehler: 'Link ungültig.' };
  try { return { ok: true, r: fn.apply(null, d.args || []) }; } catch (err) {
    fehler_('Portal ' + d.fn, err);
    return { ok: false, fehler: err.message };
  }
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
  var l = leistungWahl_(k, p.l);
  if (!l) return { ok: false, fehler: 'Diese Leistung ist online nicht buchbar.' };
  var cache = CacheService.getScriptCache(), schl = 'slots_' + k.kuerzel + '_' + l.minuten;
  var alt = cache.get(schl);
  if (alt) return JSON.parse(alt);
  var r = { ok: true, dauer: l.minuten, modus: k.modus, tage: freieSlots_(k, l.name, s) };
  var gs = gewinnspiel_(k, new Date());
  if (gs) {
    var gl = gewinneListe_(k), weitere = gl.slice(1).reduce(function (n, g) { return n + g.anzahl; }, 0) + (gl[0] ? gl[0].anzahl - 1 : 0);
    r.gewinnspiel = { gewinn: gl[0] ? gl[0].text : k.gewinn, weitere: weitere, gewinne: gewinneText_(gl), offen: true,
      bedingungen: portal_(s) + 'a=tnb&k=' + encodeURIComponent(k.kuerzel) };
  }
  cache.put(schl, JSON.stringify(r), 90);
  return r;
}

/** Meta-Pixel und Google-Conversion des Studios: werden in der Zentrale eingetragen, die Seite muss dafür nicht neu hochgeladen werden. */
function messAnfrage_(p) {
  var k = kunde_(p.k);
  if (!k) return { ok: false };
  var conv = /^AW-\d+\/[\w-]+$/.test(k.conversion) ? k.conversion : '';
  return { ok: true, pixel: k.pixel.length >= 12 ? k.pixel : '', conversion: conv };
}

/** Rückruf-Wunsch bzw. Verlosung direkt von der Seite (ohne Netlify-Formulare). Gleiche Fallen wie bei der Buchung. */
function anfrageDirekt_(d, s) {
  var txt = function (v) { return v == null ? '' : String(v).trim(); };
  var k = kunde_(d.kunde);
  if (txt(d.hp) || !d.ms || Number(d.ms) < 3000) return { ok: true };
  if (!nameOk_(txt(d.name))) return { ok: false, feld: 'name', fehler: 'Bitte geben Sie Ihren Vor- und Nachnamen an.' };
  if (!telefon_(d.telefon)) return { ok: false, feld: 'telefon', fehler: 'Bitte prüfen Sie Ihre Telefonnummer.' };
  var details = [];
  [['wunsch', 'Wunsch'], ['nachricht', 'Nachricht'], ['utm_campaign', 'Anzeige']].forEach(function (f) {
    if (txt(d[f[0]])) details.push(f[1] + ': ' + txt(d[f[0]]).slice(0, 500));
  });
  var r = neueAnfrage_({ id: 'A' + new Date().getTime().toString(36).toUpperCase(), eingang: new Date(), kunde: txt(d.kunde).toLowerCase(),
    name: txt(d.name), telefon: telefon_(d.telefon), email: txt(d.email), art: SEITEN[txt(d.form)] || 'Rückruf',
    quelle: quelle_(d), details: details.join(' · ') }, s);
  return { ok: r !== 'fehler', kunde: k ? k.betrieb : '' };
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
function freieSlots_(k, leistung, s) {
  var l = leistungWahl_(k, leistung), dauer = l ? l.minuten : 0;
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

/** Die gewählte Leistung aus „Leistungen“ (Name | Minuten | Preis; …). Ohne Namen: die erste. Jede Leistung ist buchbar. */
function leistungWahl_(k, name) {
  if (!String(name || '').trim()) return k.leistungen[0] || null;
  return leistung_(k, name);
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
  var l = leistungWahl_(k, d.leistung);
  if (!l) return { ok: false, fehler: 'Diese Leistung ist online nicht buchbar. Bitte rufen Sie uns an: ' + k.telefon };
  var dauer = l.minuten, start = startAusText_(d.start);
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
  var frei = freieSlots_(k, l.name, s).some(function (tg) {
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
    'ID': id, 'Eingang': jetzt, 'Kunde': k.kuerzel, 'Art': 'Online-Termin',
    'Leistung': l.name, 'Termin': start, 'Dauer': dauer, 'Name': name, 'Telefon': tel, 'E-Mail': email,
    'Quelle': quelle, 'Stand': 'unbestätigt', 'Details': details.join(' · '), 'Schlüssel': neuerSchluessel_(), 'Kunden-Schlüssel': ks
  });
  cacheLeeren_(k);
  var link = kundenLink_(s, k, 'bestaetigen', id, ks);
  mail_(s, {
    to: email, absender: k.betrieb, antwortAn: k.email,
    subject: 'Bitte bestätigen: Ihr Termin am ' + terminText_(start),
    html: rahmen_('<p style="font-size:16px;">Hallo ' + esc_(name) + ',</p>' +
      '<p style="font-size:16px;">wir halten diesen Termin für Sie frei:</p>' + terminBox_(k, l.name, start, dauer) +
      '<p style="font-size:16px;"><b>Bitte bestätigen Sie ihn innerhalb von ' + haltMinuten_(s) + ' Minuten.</b> Erst dann ist er fest gebucht.</p>' +
      grosserKnopf_(link, 'Termin bestätigen') +
      '<p style="font-size:13px;color:#6B665D;">Sie haben nichts gebucht? Dann ignorieren Sie diese Mail einfach, der Platz wird wieder frei.</p>')
  });
  return { ok: true, id: id, frist: haltMinuten_(s) };
}

/** Link für die Kundin: auf die Seite des Studios. Hat das Studio (noch) keine Seite, z. B. beim Test aus dem Menü,
 * zeigt die Zentrale selbst eine einfache Bestätigungs- bzw. Absageseite. */
function kundenLink_(s, k, was, id, token) {
  if (/^https?:\/\//.test(k.seite)) return k.seite + '/' + was + '.html?id=' + encodeURIComponent(id) + '&t=' + token;
  return basis_(s) + '?a=' + was + '&id=' + encodeURIComponent(id) + '&t=' + token;
}

function kundenSeite_(p) {
  var s = einst_(), was = p.a === 'absagen' ? 'absagen' : 'bestaetigen';
  var info = sicherJson_(function () { return infoAnfrage_(p); });
  if (!info.ok) return seite_('Nicht gefunden', esc_(info.fehler));
  if (p.ok !== '1') {
    return seite_(was === 'absagen' ? 'Termin absagen?' : 'Termin bestätigen',
      '<p><b>' + esc_(info.termin) + '</b><br>' + esc_(info.leistung) + ' bei ' + esc_(info.betrieb) + '</p>' +
      '<p>Bitte unten tippen. Erst dann ist es ' + (was === 'absagen' ? 'abgesagt' : 'fest gebucht') + '.</p>' +
      '<form method="get" action="' + esc_(basis_(s)) + '" target="_top">' +
      '<input type="hidden" name="a" value="' + was + '"><input type="hidden" name="id" value="' + esc_(p.id) + '">' +
      '<input type="hidden" name="t" value="' + esc_(p.t) + '"><input type="hidden" name="ok" value="1">' +
      '<button style="font-size:20px;padding:16px;width:100%;border:0;border-radius:6px;background:' + (was === 'absagen' ? '#9A3B2E' : '#1F7A3F') +
      ';color:#fff;font-weight:700;">' + (was === 'absagen' ? 'Ja, Termin absagen' : 'Termin verbindlich bestätigen') + '</button></form>');
  }
  var r = gesperrt_(function () { return was === 'absagen' ? absagen_(p.id, p.t, s) : bestaetigen_(p.id, p.t, s); });
  if (!r.ok) return seite_('Das hat nicht geklappt', esc_(r.fehler));
  if (was === 'absagen') return seite_('Termin abgesagt ✓', 'Danke für Ihre Nachricht. Der Platz ist wieder frei.');
  return seite_(r.stand === 'angefragt' ? 'Wunschtermin angekommen ✓' : 'Termin bestätigt ✓',
    '<p><b>' + esc_(r.termin) + '</b><br>' + esc_(r.leistung) + ' bei ' + esc_(r.betrieb) + '</p>' +
    (r.stand === 'angefragt' ? '<p>Das Studio bestätigt den Termin in Kürze per E-Mail.</p>' : '<p>Die Bestätigung mit allen Infos kommt gleich per E-Mail.</p>'));
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
    var frei = freieSlots_(k, t.get(z, 'Leistung'), s).some(function (tg) {
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
  var absagen = kundenLink_(s, k, 'absagen', id, t.get(z, 'Kunden-Schlüssel'));
  mail_(s, {
    to: t.get(z, 'E-Mail'), absender: k.betrieb, antwortAn: k.email,
    subject: 'Bestätigt: Ihr Termin am ' + terminText_(start),
    html: rahmen_('<p style="font-size:16px;">Hallo ' + esc_(t.get(z, 'Name')) + ',</p>' +
      '<p style="font-size:16px;">Ihr Termin ist fest gebucht. Wir freuen uns auf Sie!</p>' + terminBox_(k, t.get(z, 'Leistung'), start, dauer) +
      vorbereitungHtml_(k, t.get(z, 'Leistung')) + absageHtml_(k, absagen) +
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
  var absagen = kundenLink_(s, k, 'absagen', id, t.get(z, 'Kunden-Schlüssel'));
  mail_(s, {
    to: t.get(z, 'E-Mail'), absender: k.betrieb, antwortAn: k.email,
    subject: 'Erinnerung: Ihr Termin ' + (gleicherTag_(start, new Date(new Date().getTime() + TAG)) ? 'morgen' : 'am ' + WOCHENTAG_LANG[start.getDay()]) +
      ' um ' + uhrzeit_(start) + ' Uhr',
    html: rahmen_('<p style="font-size:16px;">Hallo ' + esc_(t.get(z, 'Name')) + ',</p>' +
      '<p style="font-size:16px;">wir freuen uns auf Sie:</p>' + terminBox_(k, t.get(z, 'Leistung'), start, Number(t.get(z, 'Dauer')) || 30) +
      vorbereitungHtml_(k, t.get(z, 'Leistung')) + absageHtml_(k, absagen))
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

function jsonLesen_(v) { try { var o = JSON.parse(String(v || '{}')); return o && typeof o === 'object' ? o : {}; } catch (e) { return {}; } }

/** Allgemeine Hinweise plus die zur gebuchten Leistung (falls das Studio welche eingetragen hat). */
function vorbereitungHtml_(k, leistung) {
  var punkte = String(k.vorbereitung || '').split('•').map(function (x) { return x.trim(); }).filter(String);
  var eigene = String((k.hinweise || {})[String(leistung || '')] || '').split('•').map(function (x) { return x.trim(); }).filter(String);
  punkte = eigene.concat(punkte.filter(function (p) { return eigene.indexOf(p) < 0; }));
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
    ? '<label style="display:block;margin:0 0 16px;font-size:16px;">Was hat die Kundin bezahlt bzw. gebucht? Betrag in € (z. B. Behandlung oder Paket)<br>' +
      '<input name="w" required inputmode="decimal" style="font-size:20px;padding:10px;width:100%;box-sizing:border-box;margin-top:6px;"></label>' : '';
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
  liveMails_(s, jetzt);
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
  var s = einst_(), t = tabelle_('Termine'), wk = tabelle_('Werbekosten'), jetzt = new Date(), uebersicht = [];
  var heute = new Date(jetzt.getFullYear(), jetzt.getMonth(), jetzt.getDate());
  var woche = { start: new Date(heute.getTime() - 7 * TAG), ende: heute };
  kunden_().filter(function (k) { return k.aktiv; }).forEach(function (k) {
    var offen = t.zeilen.filter(function (z) {
      var ein = datum_(t.get(z, 'Eingang')), st = String(t.get(z, 'Stand')), start = datum_(t.get(z, 'Termin'));
      if (t.get(z, 'Kunde') !== k.kuerzel || !ein || jetzt - ein > 120 * TAG) return false;
      if (st === 'erschienen') return true;
      if (st === 'Termin') return start && start < jetzt;
      return (st === 'neu' || st === 'nicht erreicht' || st === 'erreicht') && jetzt - ein > TAG;
    });
    var w = zahlen_(t, wk, k.kuerzel, woche), live = !!(k.live && k.live < heute);
    var kommend = t.zeilen.filter(function (z) {
      var st = datum_(t.get(z, 'Termin'));
      return t.get(z, 'Kunde') === k.kuerzel && String(t.get(z, 'Stand')) === 'Termin' && st && st >= jetzt && st < new Date(heute.getTime() + 7 * TAG);
    }).length;
    if (!offen.length && !live) return;
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
    var zahl = function (n, text) { return '<td style="padding:10px 6px;text-align:center;background:#F7F4EE;border-radius:8px;"><b style="font-size:24px;display:block;">' + n + '</b><span style="font-size:12px;color:#6B665D;">' + text + '</span></td>'; };
    var bericht = live ? '<p style="font-size:16px;"><b>Ihre letzte Woche:</b></p><table style="width:100%;border-collapse:separate;border-spacing:6px;"><tr>' +
      zahl(w.gebucht, 'neue Termine online') + zahl(w.erschienen, 'erschienen') + zahl(w.auftraege, 'gekauft') + zahl(w.rueckruf, 'Rückruf-Wünsche') + '</tr></table>' +
      '<p style="font-size:15px;">Diese Woche stehen <b>' + kommend + ' bestätigte Online-Termine</b> an.' +
      (w.verfallen + w.fake ? ' Herausgefiltert (nie bestätigt oder Fake): ' + (w.verfallen + w.fake) + '. Die haben Sie gar nicht erst erreicht.' : '') + '</p>' : '';
    mail_(s, { to: k.email, absender: k.betrieb + ' · Termine', antwortAn: betreuerMail_(k, s),
      subject: live ? 'Ihre Woche: ' + w.gebucht + ' neue Online-Termine' + (offen.length ? ' · ' + offen.length + '× bitte Stand antippen' : '')
        : 'Noch offen (' + offen.length + '): bitte kurz den Stand antippen',
      html: rahmen_('<p>Guten Morgen ' + esc_(k.anrede) + ',</p>' + bericht +
        (offen.length ? '<p>Hier ist noch offen, wie es weiterging. Ein Tipp pro Zeile genügt. Das dauert eine Minute und macht Ihren Monatsreport genau.</p>' +
          '<table style="width:100%;border-collapse:collapse;">' + liste + '</table>' : '<p>Alles ist eingetragen, danke!</p>') +
        '<p style="font-size:13px;color:#6B665D;">Fragen? Antworten Sie einfach auf diese Mail. Ihr Ansprechpartner: ' + betreuerZeile_(k, s) + '</p>') });
    var nieAngerufen = offen.filter(function (z) { return String(t.get(z, 'Stand')) === 'neu'; }).length;
    uebersicht.push('<li><b>' + esc_(k.betrieb) + '</b>' + (k.betreuer ? ' (' + esc_(k.betreuer) + ')' : '') + ': ' + (live ? w.gebucht + ' neue Termine, ' + w.auftraege + ' gekauft, ' : '') + offen.length + ' offen' + (nieAngerufen ? ', davon <b>' + nieAngerufen + ' Rückruf-Wünsche noch nie angerufen</b>' : '') + '</li>');
  });
  if (uebersicht.length) {
    mail_(s, { to: s.an, subject: 'Wochen-Mails sind raus (' + uebersicht.length + ' Kunden)',
      html: rahmen_('<p>Jedes Studio hat seinen Wochenbericht und seine offenen Termine mit Knöpfen bekommen:</p><ul>' + uebersicht.join('') + '</ul>' +
        '<p>Steht irgendwo „noch nie angerufen“: kurz beim Kunden nachhaken.</p>') });
  }
}); }

function monatsAnfang() { sicher_('Monatsanfang', function () {
  var s = einst_(), jetzt = new Date(), vm = vormonat_(jetzt), t = tabelle_('Termine');
  var monatAnfang = new Date(jetzt.getFullYear(), jetzt.getMonth(), 1), auto = rechnungAutomatisch_(s);
  // 1 · Rechnungen Monatsgebühr: von selbst angelegt und (wenn eingestellt) als PDF verschickt
  var faellig = kunden_().filter(function (k) { var ab = gebuehrAb_(k.kuerzel, t); return k.aktiv && k.gebuehr > 0 && ab && ab <= monatAnfang; }), nummern = {};
  faellig.forEach(function (k) { nummern[k.kuerzel] = rechnungAnlegen_(k, s, 'Monatsgebühr', monatName_(jetzt), k.gebuehr); });
  // Provision: Prozent vom Umsatz, den das Studio im Vormonat für Neukundinnen aus Online-Terminen gemeldet hat
  kunden_().filter(function (k) { return k.provision > 0; }).forEach(function (k) {
    var umsatz = 0;
    t.zeilen.forEach(function (z) {
      var am = datum_(t.get(z, 'Auftrag am'));
      if (t.get(z, 'Kunde') === k.kuerzel && String(t.get(z, 'Stand')) === 'Auftrag' && am && am >= vm.start && am < vm.ende) umsatz += zahl_(t.get(z, 'Auftragswert €'));
    });
    if (umsatz > 0) {
      var nr = rechnungAnlegen_(k, s, 'Provision', monatName_(vm.start), Math.round(umsatz * k.provision) / 100);
      if (nr) { nummern[k.kuerzel + '_p'] = nr; faellig.push({ kuerzel: k.kuerzel + '_p', betrieb: k.betrieb, gebuehr: Math.round(umsatz * k.provision) / 100, provision: true }); }
    }
  });
  // 2 · Monatsreports: jede Person bekommt ihre Studios mit einem Link (Werbekosten trägt man dort gleich mit ein)
  reportListe_(s, vm, 'Monatsreports ' + monatName_(vm.start) + ': je Studio ein Klick');
  var neu = faellig.filter(function (k) { return nummern[k.kuerzel]; });
  if (neu.length) {
    mail_(s, { to: s.an, subject: 'Monatsanfang ' + monatName_(jetzt) + ': ' + neu.length + ' Rechnung' + (neu.length > 1 ? 'en' : '') + (auto ? ' verschickt' : ' angelegt'),
      html: rahmen_('<h2 style="font-size:18px;">Rechnungen ' + monatName_(jetzt) + '</h2><ul>' +
        neu.map(function (k) { return '<li>' + esc_(k.betrieb) + ': ' + (k.provision ? 'Provision ' + monatName_(vm.start) : 'Monatsgebühr') + ' ' + euro_(k.gebuehr) + ' · Nr. ' + esc_(nummern[k.kuerzel]) + '</li>'; }).join('') +
        '</ul><p>' + (auto ? 'Sie gingen als PDF an die Studios. Wenn das Geld da ist: auf der Team-Seite des Studios „Bezahlt“ tippen.' :
          'Die Zeilen stehen im Blatt „Rechnungen“: „Rechnung drucken“ → als PDF → mit kurzer Mail schicken.') + '</p>' +
        '<p><a href="' + esc_(teamLink_(s, '')) + '">Übersicht öffnen</a></p>') });
  }
}); }

/** Am 3.: Erinnerung an noch nicht gesendete Monatsreports (Name bleibt wegen des Zeitplans). */
function monatsReportEntwuerfe() { sicher_('Monatsreport', function () {
  var s = einst_();
  reportListe_(s, vormonat_(new Date()), 'Erinnerung: Monatsreports noch nicht gesendet');
}); }

function reportListe_(s, vm, betreff) {
  var props = PropertiesService.getScriptProperties(), gruppen = {};
  kunden_().filter(function (k) {
    return k.aktiv && k.live && k.live < vm.ende && !props.getProperty('report_' + k.kuerzel + '_' + monatSchluessel_(vm.start));
  }).forEach(function (k) { var an = betreuerMail_(k, s); (gruppen[an] = gruppen[an] || []).push(k); });
  Object.keys(gruppen).forEach(function (an) {
    var liste = gruppen[an];
    mail_(s, { to: an, absender: 'Clickculture Zentrale', subject: betreff + ' (' + liste.length + ')',
      html: rahmen_('<p>Für ' + monatName_(vm.start) + '. Pro Studio: Link öffnen → Werbekosten aus Meta und Google eintragen → zwei kurze Sätze → „Report senden“. Die Zahlen rechnet die Zentrale selbst.</p><ul>' +
        liste.map(function (k) { return '<li style="margin:8px 0;"><a href="' + esc_(teamLink_(s, k.kuerzel)) + '"><b>' + esc_(k.betrieb) + '</b>: Report ausfüllen und senden</a></li>'; }).join('') +
        '</ul><p>Danach am besten 10 Minuten anrufen. Das hält Kunden.</p>') });
  });
}

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
  // Neue Studios: erinnern, „alles da“ melden
  sicher_('Studios nachfassen', function () { studiosNachfassen_(s, jetzt); });
  // Gewinnspiel: keine automatische Ziehung (Nutzer 23.11.2026, die Ziehung läuft außerhalb der Zentrale)
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

function reportText_(k, z, vm, s, x) {
  x = x || {};
  var monat = monatName_(vm.start), cpt = z.kosten && z.gebucht ? Math.round(z.kosten / z.gebucht) : null;
  return 'Hallo ' + k.anrede + ',\n\n' +
    'hier Ihre Zahlen für ' + monat + ':\n' +
    '- Werbeausgaben: ' + (z.kosten === null ? '[Werbekosten fehlen]' : euro_(z.kosten)) + '\n' +
    '- Online gebuchte und bestätigte Termine: ' + z.gebucht + (cpt !== null ? ' (Werbekosten pro Termin: ' + euro_(cpt) + ')' : '') + '\n' +
    '- Rückruf-Wünsche' + (k.ziehung ? ' und Verlosung' : '') + ': ' + z.rueckruf + (z.minuten !== null ? ' (Rückruf im Schnitt nach ' + z.minuten + ' Minuten)' : '') + '\n' +
    '- Erschienen: ' + z.erschienen + ' · nicht erschienen: ' + z.nichtErschienen + ' · abgesagt: ' + z.abgesagt + '\n' +
    '- Behandlung gekauft: ' + z.auftraege + (z.umsatz ? ' (Wert laut Ihnen: ' + euro_(z.umsatz) + ')' : '') + '\n' +
    '- Herausgefiltert: ' + (z.verfallen + z.fake + z.bots) + ' (nicht bestätigt ' + z.verfallen + ', als Fake gemeldet ' + z.fake + ', Bots ' + z.bots + '). Diese Termine haben Sie nie erreicht.\n\n' +
    (x.geaendert ? 'Was wir geändert haben: ' + x.geaendert + '\n' : '') +
    (x.naechstes ? 'Was wir als Nächstes tun: ' + x.naechstes + '\n' : '') +
    (x.brauchen ? 'Was wir von Ihnen brauchen: ' + x.brauchen + '\n' : '') + '\n' +
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


// ================================================================ Neuer Kunde: einfügen, Schritte für das Studio, Erinnerungen

/* Spalten, die „Einrichten“ in einer älteren Zentrale von selbst ergänzt (hinten angehängt, nichts geht verloren). */
var KUNDEN_SPALTEN = ['Kürzel', 'Status', 'Betreuer', 'Betreuer Telefon', 'Betreuer E-Mail', 'Betrieb', 'Firma', 'Anrede für Mails', 'Inhaber',
  'E-Mail für Termine', 'Telefon', 'Adresse', 'Seiten-Adresse', 'Behandlung', 'Behandler-Art', 'Buchung', 'Kalender-ID', 'Buchbare Zeiten', 'Leistungen',
  'Neukundenangebot', 'Angebot Leistung', 'Angebot Normalpreis', 'Angebot bis',
  'Takt Minuten', 'Puffer Minuten', 'Vorlauf Stunden', 'Tage im Voraus', 'Absagefrist Stunden', 'Ausfallregel', 'Vorbereitung', 'Hinweise je Leistung',
  'Onboarding €', 'Monatsgebühr €', 'Provision %', 'Werbebudget €', 'Umkreis km', 'Angelegt am', 'Live seit', 'Pixel-ID', 'Google-Conversion',
  'Vertrag angenommen', 'Impressum', 'Datenschutz', 'Behandler', 'Vorbereitung ok', 'Fotos', 'Kalender ok', 'Meta erledigt', 'Werbekonto-ID', 'Meta fertig', 'Seite bestätigen', 'Karte ok',
  'Google-Ads-ID', 'Google verknüpft', 'Vorschau gesendet', 'Freigabe', 'Änderungswunsch', 'Drive-Ordner', 'Erinnert am', 'Erinnerungen', 'Alles da', 'Live-Mail', 'Token',
  'Gewinn', 'Gewinnspiel Leistungen', 'Gewinnspiel ab', 'Teilnahmeschluss', 'Ziehung am', 'Erster Auftrag', 'Monatsgebühr ab', 'Termine gesamt', 'Notiz'];
var VERTRAEGE_SPALTEN = ['Kürzel', 'Vereinbarung', 'Angenommen am', 'Angenommen von', 'Gesendet an', 'Prüfsumme SHA-256', 'Browser', 'Annahme-Link'];
var NEUE_EINSTELLUNGEN = [
  ['agentur_business_id', 'Meta Business-ID der Agentur', '', 'Meta Business Suite → Einstellungen → Unternehmensinfos (16 Ziffern). Steht in eurer Klickliste „Meta einrichten“ auf der Team-Seite'],
  ['meta_einladung', 'Eure Facebook-E-Mail (für Einladungen)', '', 'Die E-Mail, mit der ihr bei Facebook angemeldet seid. Die Studios laden diese Adresse in ihr Business-Portfolio ein. Leer = E-Mail der Agentur'],
  ['agentur_google_mcc', 'Google-Ads-Verwaltungskonto (Kunden-ID)', '', 'oben rechts in Google Ads, z. B. 774-518-7262'],
  ['rechnungen_automatisch', 'Rechnungen automatisch als PDF schicken?', 'Ja', 'Ja = Onboarding-Rechnung nach dem Annehmen der Vereinbarung, Monatsgebühr am 1. Nein = nur Zeile anlegen, du schickst selbst'],
  ['erinnerung_studio_tage', 'Studio erinnern nach … Werktagen ohne Fortschritt', 2, 'höchstens 3 Erinnerungen, danach Mail an den Betreuer: anrufen'],
  ['portal_url', 'Adresse des Portals', 'https://clickculture-portal.netlify.app', 'Schritte-Seite, Team-Seite und Formular laufen dort (ohne Google-Anmeldung). Leer = direkt über die Zentrale'],
  ['uebersicht_url', 'Übersicht (Lesezeichen)', '', 'setzt „Einrichten“ von selbst: alle Studios, alles per Knopf. Als Lesezeichen am Handy und Laptop speichern'],
  ['formular_url', 'Formular „Neuer Kunde“ (Lesezeichen)', '', 'setzt „Einrichten“ von selbst: im Gespräch ausfüllen']
];

function blattSicher_(name, spalten) {
  var ss = SpreadsheetApp.getActive(), sh = ss.getSheetByName(name);
  if (!sh) { sh = ss.insertSheet(name); sh.getRange(1, 1, 1, spalten.length).setValues([spalten]).setFontWeight('bold'); sh.setFrozenRows(1); return sh; }
  spaltenErgaenzen_(sh, spalten);
  return sh;
}

function spaltenErgaenzen_(sh, spalten) {
  var n = Math.max(sh.getLastColumn(), 1), kopf = sh.getRange(1, 1, 1, n).getValues()[0].map(function (h) { return String(h).trim(); });
  var fehlt = spalten.filter(function (h) { return kopf.indexOf(h) < 0; });
  if (!fehlt.length) return 0;
  var ab = kopf.filter(String).length ? n + 1 : 1;
  sh.getRange(1, ab, 1, fehlt.length).setValues([fehlt]).setFontWeight('bold');
  return fehlt.length;
}

function einstellungenErgaenzen_() {
  var sh = blatt_('Einstellungen'), da = sh.getDataRange().getValues().map(function (z) { return String(z[0]).trim(); });
  NEUE_EINSTELLUNGEN.forEach(function (e) {
    if (da.indexOf(e[0]) < 0) { sh.appendRow(e); da.push(e[0]); }
  });
}

// ---------------------------------------------------------------- Formular „Neuer Kunde“ (im Gespräch ausfüllen)

/** Menü „2 · Neuer Kunde“: das Formular als Fenster über der Tabelle. Dasselbe Formular gibt es als Seite (Lesezeichen). */
function neuerKundeFenster() {
  var s = einst_();
  SpreadsheetApp.getUi().showModalDialog(HtmlService.createHtmlOutput(formularHtml_(s, null)).setWidth(780).setHeight(660), 'Neuer Kunde');
}

function formularLink_(s, kz) { return portal_(s) + 'a=neu&t=' + encodeURIComponent(s.schluessel || '') + (kz ? '&k=' + encodeURIComponent(kz) : ''); }

function formularSeite_(p) {
  var s = einst_();
  if (!s.schluessel || String(p.t) !== String(s.schluessel)) return seite_('Nicht gefunden', 'Dieser Link ist nicht gültig.');
  var k = p.k ? kunde_(p.k) : null;
  return HtmlService.createHtmlOutput(formularHtml_(s, k)).setTitle((k ? 'Ändern: ' + k.betrieb : 'Neuer Kunde') + ' · Clickculture')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/** Gespeicherte Daten eines Studios in die Felder des Formulars (zum Ändern). */
function formularWerte_(k) {
  if (!k) return { provision: PROVISION_STANDARD, umkreis: 15, absage: 24, kalender: 'Kalender' };
  var a = String(k.adresse).match(/^(.*?)\s+(\S+),\s*(\d{5})\s+(.*)$/) || [];
  var teile = String(k.inhaber).split(' '), anr = String(k.anrede).split(' ')[0];
  var t = tabelle_('Kunden'), g = function (h) { return t.kopf[h] === undefined ? '' : t.get(k.zeile, h); };
  return { kuerzel: k.kuerzel, betreuer: k.betreuer, betreuer_telefon: k.betreuerTelefon, betrieb: k.betrieb, firma: k.firma,
    anrede: /herr/i.test(anr) ? 'Herr' : 'Frau', vorname: teile.slice(0, -1).join(' '), nachname: teile.slice(-1)[0] || '',
    telefon: k.telefon, email: k.email, strasse: a[1] || k.adresse, hausnummer: a[2] || '', plz: a[3] || '', ort: a[4] || '',
    angebot: k.behandlung, behandler: String(g('Behandler-Art')), quali: true, leistungen: k.leistungen, zeiten: k.zeiten,
    kalender: k.modus, kalender_id: k.kalender, absage: k.absagefrist || 24,
    ausfall: (String(k.ausfall).match(/berechnen wir ([\d.,]+)/) || [])[1] || '', termine: (String(g('Notiz')).match(/^(\d+)/) || [])[1] || '',
    gs_l: k.gsLeistungen, gs_haupt: gewinneListe_(k).filter(function (g) { return !/%/.test(g.text); }).map(function (g) { return g.text.replace(/\s*\(Wert[^)]*\)\s*$/, ''); }),
    gs_zusatz: gewinneText_(gewinneListe_(k).filter(function (g) { return /%/.test(g.text); })).join('\n'),
    nk_text: k.nk.text, nk_leistung: k.nk.leistung, nk_normal: k.nk.normal, nk_bis: k.nk.bis ? Utilities.formatDate(k.nk.bis, 'Europe/Berlin', 'yyyy-MM-dd') : '',
    umkreis: Number(g('Umkreis km')) || 15, provision: Number(g('Provision %')) || PROVISION_STANDARD, budget: zahl_(g('Werbebudget €')) || '' };
}

function formularHtml_(s, k) {
  var team = Object.keys(s.team).map(function (n) { return n.split(' ')[0].replace(/^./, function (c) { return c.toUpperCase(); }); });
  var w = formularWerte_(k);
  var wert = function (n) { return w[n] == null ? '' : ' value="' + esc_(w[n]) + '"'; };
  var opt = function (liste, aktiv, leer) {
    return (leer ? '<option value="">' + leer + '</option>' : '') + liste.map(function (x) { return '<option' + (x === aktiv ? ' selected' : '') + '>' + esc_(x) + '</option>'; }).join('');
  };
  var feld = function (name, label, extra) { return '<label>' + label + '<input name="' + name + '" ' + (extra || '') + wert(name) + '></label>'; };
  var daten = { regeln: REGELN_VON_BEHANDLER, module: MODULE, leistungen: w.leistungen || [], zeiten: buchbareZeiten_(w.zeiten || ''), nk_leistung: w.nk_leistung || '', gs_l: w.gs_l || [], gs_haupt: w.gs_haupt || [] };
  return '<style>body{font-family:-apple-system,Helvetica,Arial,sans-serif;color:#1A1917;margin:0;background:#F7F4EE;font-size:15px;}' +
    '.w{max-width:760px;margin:0 auto;padding:16px;}h1{font-size:22px;margin:4px 0 2px;}h2{font-size:17px;margin:0 0 8px;}' +
    '.box{background:#fff;border:1px solid #E4DED3;border-radius:10px;padding:14px;margin:12px 0;}label{display:block;margin:7px 0;font-weight:600;font-size:14px;}' +
    'input,select{width:100%;box-sizing:border-box;font-size:16px;padding:8px;border:1px solid #CFC8BB;border-radius:6px;margin-top:3px;font-weight:400;}' +
    '.zwei{display:grid;grid-template-columns:1fr 1fr;gap:0 12px;}.drei{display:grid;grid-template-columns:3fr 1fr 1fr 70px;gap:0 8px;align-items:center;}.drei .b{display:flex;gap:4px;align-items:center;font-size:12px;font-weight:400;margin:0;}.drei .b input{width:auto;margin:0;}.vier{display:grid;grid-template-columns:3fr 1fr;gap:0 8px;}' +
    '.k{color:#6B665D;font-size:13px;font-weight:400;}.check{display:flex;gap:8px;align-items:flex-start;font-weight:400;}.check input{width:auto;margin-top:3px;}' +
    'button{font-size:17px;padding:13px 18px;border:0;border-radius:7px;background:#1F7A3F;color:#fff;font-weight:700;width:100%;}' +
    '.klein{background:#EFEAE0;color:#1A1917;font-size:14px;padding:8px 12px;width:auto;font-weight:600;margin:4px 4px 0 0;}' +
    '#hinweis{padding:10px;border-radius:8px;background:#F9EEDA;display:none;margin:8px 0;}#m{white-space:pre-wrap;padding:12px;border-radius:8px;display:none;margin-top:10px;}' +
    '.empf{color:#1F7A3F;font-weight:700;}.drei input{margin:3px 0;}' +
    '.kal{overflow-x:auto;margin-top:8px;user-select:none;-webkit-user-select:none;touch-action:none;}.kal table{border-collapse:collapse;width:100%;min-width:420px;}' +
    '.kal th{font-size:13px;padding:4px;position:sticky;top:0;background:#fff;}.kal td{border:1px solid #EFEAE0;height:16px;padding:0;cursor:pointer;}' +
    '.kal td.z{border:0;font-size:11px;color:#6B665D;text-align:right;padding-right:6px;cursor:default;white-space:nowrap;width:38px;}.kal td.an{background:#1F7A3F;}' +
    '@media(max-width:560px){.zwei{grid-template-columns:1fr;}}</style>' +
    '<div class="w"><h1>' + (k ? 'Kundendaten ändern: ' + esc_(k.betrieb) : 'Neuer Kunde') + '</h1><p class="k">' +
    (k ? 'Änderungen speichern. Es geht keine neue Willkommens-Mail raus.' : 'Im Gespräch ausfüllen. Alles mit * ist Pflicht. Am Ende ein Klick: Der Kunde ist angelegt, die Vereinbarung und die Willkommens-Mail mit seinen Schritten gehen von selbst raus.') +
    '</p><form id="f" novalidate><input type="hidden" name="kuerzel"' + wert('kuerzel') + '>' +
    '<div class="box"><h2>1 · Das Studio</h2><div class="zwei">' +
    (team.length ? '<label>Wer betreut das Studio? *<select name="betreuer" required>' + opt(team, w.betreuer) + '</select></label>' : feld('betreuer', 'Wer betreut das Studio? * (dein Vorname)', 'required class="gross"')) +
    feld('betreuer_telefon', 'Telefon des Betreuers *', 'required inputmode="tel"') +
    feld('betrieb', 'Name des Studios (wie in der Werbung) *', 'required class="gross"') + feld('firma', 'Firma wie im Impressum *', 'required class="gross"') +
    '<label>Anrede *<select name="anrede" required>' + opt(['Frau', 'Herr'], w.anrede) + '</select></label><span></span>' +
    feld('vorname', 'Vorname Inhaber/in *', 'required class="gross" autocomplete="off"') + feld('nachname', 'Nachname Inhaber/in *', 'required class="gross" autocomplete="off"') +
    feld('telefon', 'Telefon des Studios *', 'required inputmode="tel"') + feld('email', 'E-Mail für Termine *', 'required type="email" class="klein-mail"') +
    '</div><div class="vier">' + feld('strasse', 'Straße *', 'required class="gross"') + feld('hausnummer', 'Hausnummer *', 'required') + '</div>' +
    '<div class="vier" style="grid-template-columns:1fr 3fr;">' + feld('plz', 'PLZ *', 'required inputmode="numeric" pattern="\\d{5}"') + feld('ort', 'Ort *', 'required class="gross"') + '</div></div>' +
    '<div class="box"><h2>2 · Was wird beworben?</h2><div class="zwei">' +
    feld('angebot', 'Angebot in eigenen Worten * <span class="k">(z. B. Wimpernverlängerung)</span>', 'required class="gross"') +
    '<label>Wer behandelt? *<select name="behandler" required>' + opt(BEHANDLER, w.behandler, 'bitte wählen') + '</select></label></div>' +
    '<div id="hinweis"></div>' +
    '<label class="check"><input type="checkbox" name="quali" required' + (w.quali ? ' checked' : '') + '> <span>Die nötige Qualifikation für dieses Angebot ist da * <span class="k" id="quali"></span></span></label></div>' +
    '<div class="box"><h2>3 · Seine Leistungen <span class="k">(alle sind online buchbar)</span></h2>' +
    '<p class="k">So, wie das Studio sie nennt, mit Dauer in Minuten. Mindestens eine. Preis darf leer bleiben. ' +
    'Braucht eine Behandlung vorher ein Gespräch, die Beratung einfach als <b>eigene Leistung</b> eintragen, z. B. „Beratung Haarpigmentierung | 30 | 0“.</p>' +
    '<div class="drei k"><span>Leistung</span><span>Minuten</span><span>Preis €</span><span></span></div><div id="leistungen"></div>' +
    '<button type="button" class="klein" id="mehr">+ Zeile</button> <button type="button" class="klein" id="liste">Liste einfügen</button>' +
    '<div id="listebox" style="display:none;"><p class="k">Eine Leistung pro Zeile: <b>Name | Minuten | Preis</b>, z. B. „Wimpernverlängerung | 120 | 100“. Vorbereitete Liste von Claude hier hineinkopieren.</p>' +
    '<textarea id="listetext" rows="8" style="width:100%;box-sizing:border-box;font-size:14px;"></textarea>' +
    '<button type="button" class="klein" id="listeok">Übernehmen</button></div></div>' +
    '<div class="box" id="gsbox"><h2>3b · Gewinnspiel: die 3 stärksten Leistungen *</h2>' +
    '<p class="k">Fragen: <b>Womit verdient das Studio am meisten?</b> Diese drei Leistungen verlosen wir, je Leistung gibt es eine eigene Anzeige („Gewinne eine gratis …“). ' +
    'Wer online einen Termin bucht, ist dabei. Teilnahmeschluss offen. Später änderbar über „Kundendaten ändern“.</p>' +
    [1, 2, 3].map(function (i) {
      return '<div class="zwei"><label>' + i + '. stärkste Leistung' + (i === 1 ? ' *' : '') + '<select name="gs_l' + i + '" class="gsl"' + (i === 1 ? ' id="gsl1"' : '') + '></select></label>' +
        '<label>So steht es auf der Anzeige: „Gewinne …“<input name="gs_t' + i + '" class="gst" maxlength="45" placeholder="eine gratis Wimpernverlängerung" value="' + esc_((w.gs_haupt || [])[i - 1] || '') + '"></label></div>';
    }).join('') +
    '<label>Zusatzgewinne (einer pro Zeile)<textarea name="gs_zusatz" rows="2" style="width:100%;box-sizing:border-box;font-size:15px;padding:8px;">' +
    esc_(w.gs_zusatz != null && w.gs_zusatz !== '' ? w.gs_zusatz : '2 × 20 % auf deinen nächsten Termin\n3 × 40 % auf deinen nächsten Termin') + '</textarea></label>' +
    '<p class="k" id="gsaus" style="display:none;">Bei Ärzten und Zahnärzten ist ein Gewinnspiel in der Werbung nicht erlaubt (Heilmittelwerbegesetz, Berufsordnung). Hier bleibt alles leer.</p></div>' +
    '<div class="box"><h2>3c · Neukundenangebot <span class="k">(freiwillig)</span></h2>' +
    '<p class="k">Nur, wenn das Studio zusätzlich ein festes Angebot für Neukundinnen will. Es steht dann oben auf der Terminseite. Kurz, höchstens 8 Wörter. ' +
    'Ein Vergleichspreis nur, wenn das Studio ihn wirklich verlangt.</p>' +
    feld('nk_text', 'Angebot', 'maxlength="70" placeholder="z. B. Neuset gratis + 1. Auffüllen 49 €"') +
    '<div class="zwei"><label>Welche Leistung bucht die Kundin dafür?<select name="nk_leistung" id="nkl"></select></label>' +
    feld('nk_normal', 'Normalpreis zum Vergleich (freiwillig)', 'placeholder="z. B. 145 €"') + '</div>' +
    feld('nk_bis', 'Gilt bis (freiwillig, leer = ohne Ende)', 'type="date"') + '</div>' +
    '<div class="box"><h2>4 · Kalender</h2><div class="zwei">' +
    '<label>Google-Kalender? *<select name="kalender" required>' + opt(['Kalender', 'Wunschtermin'], w.kalender) + '</select>' +
    '<span class="k">Kalender = freie Zeiten kommen aus seinem Google-Kalender, Termine landen direkt dort. Wunschtermin = kein Google-Kalender, das Studio bestätigt jeden Termin per Knopf.</span></label>' +
    feld('kalender_id', 'Mit welcher Google-Adresse meldet sich das Studio bei Google Kalender an? <span class="k">(fragen, meist seine Gmail; leer = E-Mail für Termine)</span>', 'type="email" class="klein-mail"') + '</div>' +
    '<p style="margin:10px 0 2px;font-weight:600;">Wann darf online gebucht werden? * <span class="k">Felder antippen oder mit dem Finger darüberziehen. Grün = buchbar.</span></p>' +
    '<p class="k">Alles, was in seinem Google-Kalender steht (auch Kundinnen, die anders gebucht haben, Pausen, Urlaub), ist automatisch belegt.</p>' +
    '<button type="button" class="klein" data-vorlage="mofr">Mo–Fr 9–18</button><button type="button" class="klein" data-vorlage="disa">Di–Sa 9–18</button><button type="button" class="klein" data-vorlage="leer">Alles leeren</button>' +
    '<div class="kal" id="kal"></div><div class="zwei">' +
    '<label>Absagen bis spätestens *<select name="absage" required>' + ['12', '24', '48'].map(function (x) { return '<option value="' + x + '"' + (String(w.absage) === x ? ' selected' : '') + '>' + x + ' Stunden vorher</option>'; }).join('') + '</select></label>' +
    feld('ausfall', 'Ausfallgebühr € <span class="k">(nur wenn das Studio sie verlangt, sonst leer)</span>', 'inputmode="numeric"') + '</div></div>' +
    '<div class="box"><h2>5 · Abrechnung und Werbung (nur Meta)</h2><div class="zwei">' +
    feld('provision', 'Provision in % * <span class="k">vom ersten Kauf jeder Neukundin (innerhalb von 3 Monaten)</span>', 'required inputmode="decimal"') +
    feld('termine', 'Wie viele neue Kundinnen pro Woche schafft das Studio zusätzlich? *', 'required inputmode="numeric"') +
    '<label>Werbebudget € pro Monat (an Meta) * <span class="empf" id="empf"></span><input name="budget" required inputmode="numeric"' + wert('budget') + '></label>' +
    feld('umkreis', 'Werbegebiet: Umkreis in km *', 'required inputmode="numeric"') + '</div>' +
    (k ? '' : '<label class="check"><input type="checkbox" name="mail" checked> <span>Willkommens-Mail mit Vereinbarung und Schritten gleich an das Studio schicken</span></label>') + '</div>' +
    '<button id="los">' + (k ? 'Änderungen speichern' : 'Kunde anlegen') + '</button><div id="m"></div></form></div>' +
    '<script>var D=' + JSON.stringify(daten) + ';' + FORMULAR_JS + '</script>';
}

var FORMULAR_JS = [
  'var f=document.getElementById("f"),L=document.getElementById("leistungen"),KAL=document.getElementById("kal");',
  // Groß- und Kleinschreibung von selbst
  'var KLEIN=["von","van","der","den","de","und","zu","im","am","an","in","bei","für"];',
  'function gross(t){return String(t).trim().replace(/\\s+/g," ").split(" ").map(function(w,i){if(!w)return w;if(i>0&&KLEIN.indexOf(w.toLowerCase())>=0)return w.toLowerCase();return w.charAt(0).toUpperCase()+w.slice(1);}).join(" ");}',
  'document.addEventListener("blur",function(e){var x=e.target;if(!x||x.tagName!=="INPUT")return;if(x.classList.contains("gross"))x.value=gross(x.value);if(x.type==="email"||x.classList.contains("klein-mail"))x.value=x.value.trim().toLowerCase();if(x.name==="l_name"&&x.value)x.value=x.value.trim().charAt(0).toUpperCase()+x.value.trim().slice(1);},true);',
  // Leistungen
  'function zeile(l){l=l||{};var n=L.children.length,d=document.createElement("div"),name=l.name||"",preis=String(l.preis||"").replace(/\\s*€/,""),ber=false;d.className="drei";d.innerHTML=\'<input name="l_name" placeholder="\'+(n?"Leistung "+(n+1):"z. B. Powder Brows")+\'"\'+(n?"":" required")+\'><input name="l_min" inputmode="numeric" placeholder="Min."\'+(n?"":" required")+\'><input name="l_preis" inputmode="decimal" placeholder="€"><label class="b" style="display:none"><input type="checkbox" name="l_ber"></label>\';var i=d.querySelectorAll("input");i[0].value=name;i[1].value=l.minuten||"";i[2].value=preis;i[3].checked=ber;L.appendChild(d);}',
  'D.leistungen.forEach(zeile);while(L.children.length<4)zeile();document.getElementById("mehr").onclick=function(){zeile();};',
  // Neukundenangebot: Auswahl der Leistungen aus der Liste oben
  'var NKL=document.getElementById("nkl");function nkFuellen(){var alt=NKL.value||D.nk_leistung||"",o=\'<option value="">bitte wählen</option>\';Array.prototype.forEach.call(L.children,function(z){var i=z.querySelectorAll("input"),n=i[0].value.trim();if(!n)return;if(i[3].checked)n="Beratung "+n;o+="<option>"+n.replace(/</g,"&lt;")+"</option>";});NKL.innerHTML=o;NKL.value=alt;}',
  'nkFuellen();NKL.addEventListener("focus",nkFuellen);NKL.addEventListener("mousedown",nkFuellen);L.addEventListener("change",nkFuellen);',
  'var GSL=document.querySelectorAll(".gsl"),GST=document.querySelectorAll(".gst");',
  'function gsFuellen(){var namen=[];Array.prototype.forEach.call(L.children,function(z){var i=z.querySelectorAll("input"),n=i[0].value.trim();if(n&&!i[3].checked)namen.push(n);});Array.prototype.forEach.call(GSL,function(s,j){var alt=s.value||(D.gs_l[j]||"");s.innerHTML=\'<option value="">\'+(j?"freiwillig":"bitte wählen")+\'</option>\'+namen.map(function(n){return "<option>"+n.replace(/</g,"&lt;")+"</option>";}).join("");s.value=alt;});}',
  'gsFuellen();Array.prototype.forEach.call(GSL,function(s,j){s.addEventListener("focus",gsFuellen);s.addEventListener("mousedown",gsFuellen);s.addEventListener("change",function(){if(s.value&&(!GST[j].value||GST[j].dataset.auto)){GST[j].value="eine gratis "+s.value;GST[j].dataset.auto="1";}});});',
  'Array.prototype.forEach.call(GST,function(t){t.addEventListener("input",function(){delete t.dataset.auto;});});',
  'function gsPruef(){var m=D.module[D.regeln[f.behandler.value]],an=!m||m.regeln.verlosung;document.getElementById("gsaus").style.display=an?"none":"block";document.getElementById("gsl1").required=an;}',
  'f.behandler.addEventListener("change",gsPruef);gsPruef();L.addEventListener("change",gsFuellen);',
  'document.getElementById("liste").onclick=function(){var b=document.getElementById("listebox");b.style.display=b.style.display==="none"?"block":"none";};',
  'document.getElementById("listeok").onclick=function(){var z=document.getElementById("listetext").value.split(/\\n/).map(function(x){var t=x.split(/\\s*[|\\t;]\\s*/);return{name:(t[0]||"").replace(/^[-•*\\s]+/,"").trim(),minuten:(t[1]||"").replace(/\\D/g,""),preis:(t[2]||"").replace(/[^\\d,.]/g,""),beratung:false};}).filter(function(l){return l.name;});if(!z.length)return;L.innerHTML="";z.forEach(zeile);zeile();document.getElementById("listebox").style.display="none";};',
  // Wochen-Kalender zum Antippen (30-Minuten-Felder, 6 bis 22 Uhr)
  'var TAGE=["Mo","Di","Mi","Do","Fr","Sa","So"],VON=6*60,BIS=22*60,SCHR=30,Z=[];',
  'for(var t=0;t<7;t++){Z[t]=[];for(var m=VON;m<BIS;m+=SCHR){var a=(D.zeiten[t+1]||[]).some(function(r){return m>=r[0]&&m+SCHR<=r[1];});Z[t].push(a);}}',
  'function zz(m){return Math.floor(m/60)+":"+("0"+m%60).slice(-2);}',
  'function malen(){var h="<table><tr><th></th>"+TAGE.map(function(x){return "<th>"+x+"</th>";}).join("")+"</tr>";for(var r=0;r<(BIS-VON)/SCHR;r++){var m=VON+r*SCHR;h+="<tr><td class=z>"+(m%60?"":zz(m))+"</td>";for(var t=0;t<7;t++)h+="<td data-t="+t+" data-r="+r+(Z[t][r]?" class=an":"")+"></td>";h+="</tr>";}KAL.innerHTML=h;}',
  'var zieh=null;function setze(el){if(!el||el.dataset.t==null)return;var t=+el.dataset.t,r=+el.dataset.r;if(zieh===null)zieh=!Z[t][r];Z[t][r]=zieh;el.classList.toggle("an",zieh);}',
  'KAL.addEventListener("mousedown",function(e){zieh=null;setze(e.target);});KAL.addEventListener("mouseover",function(e){if(e.buttons===1)setze(e.target);});',
  'KAL.addEventListener("touchstart",function(e){zieh=null;setze(e.target);e.preventDefault();},{passive:false});',
  'KAL.addEventListener("touchmove",function(e){var p=e.touches[0];setze(document.elementFromPoint(p.clientX,p.clientY));e.preventDefault();},{passive:false});',
  'document.querySelectorAll("[data-vorlage]").forEach(function(b){b.onclick=function(){var v=b.dataset.vorlage;for(var t=0;t<7;t++)for(var r=0;r<Z[t].length;r++){var m=VON+r*SCHR;Z[t][r]=v!=="leer"&&m>=540&&m<1080&&(v==="mofr"?t<5:(t>0&&t<6));}malen();};});',
  'function zeitenText(){var out=[];for(var t=0;t<7;t++){var sp=[],a=null;for(var r=0;r<=Z[t].length;r++){var an=r<Z[t].length&&Z[t][r];if(an&&a===null)a=r;if(!an&&a!==null){sp.push(zz(VON+a*SCHR)+"-"+zz(VON+r*SCHR));a=null;}}if(sp.length)out.push(TAGE[t]+" "+sp.join(" "));}return out.join("; ");}',
  'malen();',
  // Regeln und Budget
  'function pruef(){var m=D.module[D.regeln[f.behandler.value]],h=document.getElementById("hinweis"),t=[];',
  ' document.getElementById("quali").textContent=m?"("+m.qualifikation+")":"";',
  ' if(m&&!m.regeln.kostenlos)t.push("Hier gilt das Heilmittelwerbegesetz bzw. die Berufsordnung: nichts „kostenlos“, keine Rabatte, kein Vorher/Nachher, nie das Wort „Botox“. Zuerst eine Beratung als Leistung eintragen.");',
  ' if(f.behandler.value==="Kosmetik mit NiSV-Fachkunde")t.push("Laser/IPL: Jede Person, die behandelt, braucht die NiSV-Fachkunde. „Dauerhaft“ nur mit Hinweis auf mehrere Sitzungen.");',
  ' h.innerHTML=t.join("<br>");h.style.display=t.length?"block":"none";',
  ' var n=Number(f.termine.value)||0,e=document.getElementById("empf");',
  ' if(m&&n){var v=Math.max(300,Math.min(2000,Math.round(n*4.33*m.kosten_pro_termin/50)*50));e.textContent="Empfehlung: "+v+" €";if(!f.budget.value||f.budget.dataset.auto){f.budget.value=v;f.budget.dataset.auto="1";}}else e.textContent="";}',
  'f.addEventListener("change",pruef);f.addEventListener("input",function(e){if(e.target.name==="budget")delete f.budget.dataset.auto;if(e.target.name==="termine")pruef();});pruef();',
  // Absenden: erst wenn alle Pflichtfelder da sind
  'f.addEventListener("submit",function(e){e.preventDefault();var b=document.getElementById("los"),m=document.getElementById("m");',
  ' Array.prototype.forEach.call(f.querySelectorAll("input.gross"),function(x){x.value=gross(x.value);});',
  ' if(f.kalender.value==="Kalender")f.kalender_id.setAttribute("required","");else f.kalender_id.removeAttribute("required");',
  ' if(!f.checkValidity()){f.reportValidity();return;}',
  ' var zt=zeitenText();if(!zt){m.textContent="Bitte im Kalender antippen, wann online gebucht werden darf.";m.style.display="block";m.style.background="#FBEBEB";return;}',
  ' var d={};Array.prototype.forEach.call(f.elements,function(x){if(!x.name||/^l_/.test(x.name))return;d[x.name]=x.type==="checkbox"?x.checked:x.value;});',
  ' d.zeiten=zt;d.leistungen=Array.prototype.map.call(L.children,function(r){var i=r.querySelectorAll("input");return{name:i[0].value,minuten:i[1].value,preis:i[2].value,beratung:i[3].checked};});',
  ' b.disabled=true;var alt=b.textContent;b.textContent="Moment …";m.style.display="none";',
  ' google.script.run.withSuccessHandler(function(r){m.textContent=r.text;m.style.display="block";m.style.background=r.ok?"#E5F4E4":"#FBEBEB";b.disabled=r.ok&&!d.kuerzel;b.textContent=r.ok?(d.kuerzel?alt:"Angelegt ✓"):alt;m.scrollIntoView({block:"center"});})',
  ' .withFailureHandler(function(x){m.textContent="Fehler: "+x.message;m.style.display="block";m.style.background="#FBEBEB";b.disabled=false;b.textContent=alt;}).neuerKunde(d);});'
].join('\n');

/** google.script.run aus dem Formular. Gibt {ok, text} zurück. */
function neuerKunde(d) {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try { return neuerKunde_(d || {}, einst_()); } catch (err) {
    fehler_('Neuer Kunde', err);
    return { ok: false, text: 'Das hat nicht geklappt: ' + err.message };
  } finally { SpreadsheetApp.flush(); lock.releaseLock(); }
}

/** Groß- und Kleinschreibung: „kate cosmetics“ → „Kate Cosmetics“, „am bahnhof“ → „Am Bahnhof“ (kleine Wörter wie „von“ bleiben klein). */
function gross_(t) {
  var klein = ['von', 'van', 'der', 'den', 'de', 'und', 'zu', 'im', 'am', 'an', 'in', 'bei', 'für'];
  return String(t == null ? '' : t).trim().replace(/\s+/g, ' ').split(' ').map(function (w, i) {
    if (!w) return w;
    if (i > 0 && klein.indexOf(w.toLowerCase()) >= 0) return w.toLowerCase();
    return w.charAt(0).toUpperCase() + w.slice(1);
  }).join(' ');
}

function neuerKunde_(d, s) {
  var txt = function (v) { return String(v == null ? '' : v).trim(); }, fehlt = [];
  var m = MODULE[REGELN_VON_BEHANDLER[txt(d.behandler)]];
  [['betreuer', 'Betreuer'], ['betreuer_telefon', 'Telefon des Betreuers'], ['betrieb', 'Name des Studios'], ['firma', 'Firma'],
    ['vorname', 'Vorname'], ['nachname', 'Nachname'], ['telefon', 'Telefon'], ['email', 'E-Mail'], ['strasse', 'Straße'],
    ['hausnummer', 'Hausnummer'], ['plz', 'PLZ'], ['ort', 'Ort'], ['angebot', 'Angebot'], ['termine', 'Kundinnen pro Woche'],
    ['provision', 'Provision'], ['budget', 'Werbebudget'], ['umkreis', 'Umkreis']]
    .forEach(function (x) { if (!txt(d[x[0]])) fehlt.push(x[1]); });
  if (!m) fehlt.push('Wer behandelt');
  if (fehlt.length) return { ok: false, text: 'Bitte noch ausfüllen: ' + fehlt.join(', ') };
  if (d.quali !== true) return { ok: false, text: 'Ohne die nötige Qualifikation (' + m.qualifikation + ') kein Abschluss. Häkchen setzen, wenn sie da ist.' };
  var email = txt(d.email).toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(email)) return { ok: false, text: 'Die E-Mail sieht falsch aus.' };
  if (!telefon_(d.telefon)) return { ok: false, text: 'Die Telefonnummer des Studios sieht falsch aus.' };
  if (!/^\d{5}$/.test(txt(d.plz))) return { ok: false, text: 'Die PLZ hat 5 Ziffern.' };
  var modus = d.kalender === 'Wunschtermin' ? 'Wunschtermin' : 'Kalender', kalId = txt(d.kalender_id).toLowerCase() || email;
  if (modus === 'Kalender' && !/^\S+@\S+\.\S+$/.test(kalId)) return { ok: false, text: 'Bitte die Adresse seines Google-Kalenders eintragen (meist seine Gmail).' };
  var provision = zahl_(d.provision);
  if (!(provision > 0 && provision <= 50)) return { ok: false, text: 'Die Provision bitte in Prozent, z. B. 15.' };
  var leistungen = (d.leistungen || []).map(function (l) {
    var n = txt(l.name).replace(/[|;]/g, '/').replace(/^beratung\s+/i, ''), p = txt(l.preis).replace(/^ab\s*/i, '');
    n = n.charAt(0).toUpperCase() + n.slice(1);
    if (l.beratung === true && n) { n = 'Beratung ' + n; if (p) p = 'ab ' + p.replace(/\s*€$/, '') + ' €'; }
    return { name: n, minuten: Math.round(zahl_(l.minuten)), preis: p };
  }).filter(function (l) { return l.name; });
  if (!leistungen.length) return { ok: false, text: 'Bitte mindestens eine Leistung eintragen.' };
  var ohneMin = leistungen.filter(function (l) { return !(l.minuten >= 5 && l.minuten <= 600); });
  if (ohneMin.length) return { ok: false, text: 'Bitte bei „' + ohneMin[0].name + '“ die Dauer in Minuten eintragen (z. B. 30).' };
  if (leistungen.concat([{ name: txt(d.angebot) }]).some(function (l) { return /botox|botulinum/i.test(l.name); })) {
    return { ok: false, text: 'Das Wort „Botox“ ist in der Werbung verboten. Bitte z. B. „Faltenbehandlung Stirn“ schreiben.' };
  }
  var nk = txt(d.nk_text).replace(/\s+/g, ' '), nkL = txt(d.nk_leistung), nkN = txt(d.nk_normal), nkBis = datum_(txt(d.nk_bis));
  if (nk && nk.split(' ').length > 8) return { ok: false, text: 'Das Neukundenangebot bitte kürzer, höchstens 8 Wörter. Es steht groß auf der Anzeige.' };
  if (nk && !leistungen.some(function (l) { return l.name === nkL; })) return { ok: false, text: 'Beim Neukundenangebot bitte wählen, welche Leistung die Kundin dafür bucht.' };
  if (!m.regeln.kostenlos && /gratis|kostenlos|umsonst|geschenkt|0\s*€/i.test(nk)) return { ok: false, text: 'Bei ' + m.name + ' ist „gratis/kostenlos“ in der Werbung nicht erlaubt. Bitte ein sachliches Angebot, z. B. „Beratung 30 Minuten“.' };
  if (!m.regeln.rabatt && (/%|rabatt|statt|sparen|gutschein|aktion/i.test(nk) || nkN)) return { ok: false, text: 'Bei ' + m.name + ' sind Rabatte und Vergleichspreise in der Werbung nicht erlaubt. Bitte ein sachliches Angebot.' };
  if (/botox|garantiert|schmerzfrei/i.test(nk)) return { ok: false, text: 'Diese Wörter sind im Angebot nicht erlaubt (Botox, garantiert, schmerzfrei).' };
  // Gewinnspiel: die 3 stärksten Leistungen als Hauptgewinne, dazu Zusatzgewinne
  var gsL = [], gsZeilen = [];
  if (m.regeln.verlosung) {
    [1, 2, 3].forEach(function (i) {
      var ln = txt(d['gs_l' + i]); if (!ln || gsL.indexOf(ln) >= 0) return;
      var l = leistungen.filter(function (x) { return x.name === ln; })[0]; if (!l) return;
      var anz = txt(d['gs_t' + i]).replace(/^gewinne\s+/i, '') || 'eine gratis ' + ln, wert = /\d/.test(l.preis) && !/^ab/i.test(l.preis) ? ' (Wert ' + l.preis.replace(/\s*€$/, '') + ' €)' : '';
      gsL.push(ln); gsZeilen.push(anz + wert);
    });
    if (!gsL.length) return { ok: false, text: 'Bitte beim Gewinnspiel mindestens die stärkste Leistung wählen.' };
    var zus = txt(d.gs_zusatz).split(/\n/).map(function (x) { return x.replace(/^[-•*\s]+/, '').replace(/[\s\/,;]+$/, '').trim(); }).filter(String);
    if (!m.regeln.rabatt && zus.some(function (x) { return /%|rabatt|gutschein/i.test(x); })) return { ok: false, text: 'Für dieses Studio sind Rabatte als Gewinn nicht erlaubt.' };
    gsZeilen = gsZeilen.concat(zus);
  }
  var zt = txt(d.zeiten), test = buchbareZeiten_(zt);
  if (!zt || !Object.keys(test).length) return { ok: false, text: 'Bitte im Kalender antippen, wann online gebucht werden darf.' };
  var betrieb = gross_(d.betrieb), alt = d.kuerzel ? kunde_(d.kuerzel) : null;
  var kz = alt ? alt.kuerzel : kuerzelFrei_(slug_(betrieb));
  var ausfall = zahl_(d.ausfall), absage = Number(d.absage) || 24;
  var adresse = gross_(d.strasse) + ' ' + txt(d.hausnummer) + ', ' + txt(d.plz) + ' ' + gross_(d.ort);
  var betreuer = gross_(d.betreuer), inhaber = gross_(d.vorname) + ' ' + gross_(d.nachname);
  var kunde = {
    'Kürzel': kz, 'Betreuer': betreuer, 'Betreuer Telefon': txt(d.betreuer_telefon), 'Betreuer E-Mail': teamMail_(s, betreuer) || s.agentur_email || '',
    'Betrieb': betrieb, 'Firma': gross_(d.firma), 'Anrede für Mails': (d.anrede === 'Herr' ? 'Herr ' : 'Frau ') + gross_(d.nachname),
    'Inhaber': inhaber, 'E-Mail für Termine': email, 'Telefon': txt(d.telefon), 'Adresse': adresse,
    'Behandlung': gross_(d.angebot), 'Behandler-Art': txt(d.behandler), 'Umkreis km': zahl_(d.umkreis) || 15, 'Buchung': modus,
    'Kalender-ID': modus === 'Kalender' ? kalId : '', 'Buchbare Zeiten': zt,
    'Leistungen': leistungen.map(function (l) { return l.name + ' | ' + l.minuten + ' | ' + l.preis; }).join('; '),
    'Gewinn': gsZeilen.join(' • '), 'Gewinnspiel Leistungen': gsL.join(' • '),
    'Neukundenangebot': nk, 'Angebot Leistung': nk ? nkL : '', 'Angebot Normalpreis': nkN, 'Angebot bis': nkBis || '',
    'Takt Minuten': 15, 'Puffer Minuten': 0, 'Vorlauf Stunden': 12, 'Tage im Voraus': 28, 'Absagefrist Stunden': absage,
    'Ausfallregel': ausfall > 0 ? 'Bei einer Absage später als ' + absage + ' Stunden vorher oder wenn Sie nicht kommen, berechnen wir ' + euro_(ausfall) +
      '. Das gilt nicht, wenn Sie nachweisen, dass Sie das Versäumnis nicht zu vertreten haben oder uns kein oder ein geringerer Schaden entstanden ist.' : '',
    'Provision %': provision, 'Onboarding €': 0, 'Monatsgebühr €': 0, 'Werbebudget €': zahl_(d.budget),
    'Notiz': zahl_(d.termine) + ' Neukundinnen pro Woche möglich'
  };
  if (!alt) { kunde['Seiten-Adresse'] = 'https://' + kz + '.netlify.app'; kunde['Vorbereitung'] = VORBEREITUNG_ALLGEMEIN.join(' • '); }
  if (gsZeilen.length && !(alt && alt.gsAb)) kunde['Gewinnspiel ab'] = new Date(new Date().setHours(0, 0, 0, 0));
  var vertrag = alt && alt.vertrag ? '' : vertragFuellen_(kunde, leistungen, m, s, gross_(d.ort), zahl_(d.umkreis) || 15);
  var text = kundeAnlegen_(kunde, vertrag, s, !alt && d.mail !== false);
  if (alt) text = '✓ Gespeichert.' + (alt.vertrag ? ' Die Vereinbarung ist schon angenommen und bleibt, wie sie ist.' : ' Die Vereinbarung ist angepasst.');
  return { ok: true, text: text };
}

function vertragFuellen_(k, leistungen, m, s, ort, umkreis) {
  var f = {
    agentur_name: s.agentur_name, agentur_inhaber: String(s.agentur_inhaber || ''), agentur_anschrift: s.agentur_anschrift, agentur_email: s.agentur_email,
    agentur_telefon: telLesen_(s.agentur_telefon), betreuer_name: k['Betreuer'], betreuer_telefon: k['Betreuer Telefon'], betreuer_email: k['Betreuer E-Mail'],
    firma: k['Firma'], adresse: k['Adresse'], inhaber: k['Inhaber'], modul_name: k['Behandlung'], betrieb: k['Betrieb'],
    leistungen_text: leistungen.map(function (l) { return l.name + ' (' + l.minuten + ' Min.' + (l.preis && m.regeln.preise ? ', ' + l.preis + (/€/.test(l.preis) ? '' : ' €') : '') + ')'; }).join(', '),
    budget: euro_(k['Werbebudget €']), umkreis_km: umkreis, ort: ort, qualifikation: m.qualifikation, recht_kurz: m.recht,
    kalender_pflicht: k['Buchung'] === 'Wunschtermin' ? 'Bestätigung jedes Terminwunsches über die Knöpfe in der Mail, in den Geschäftszeiten innerhalb einer Stunde.'
      : 'Freigabe seines Google-Kalenders für den Auftragnehmer („Änderungen an Terminen vornehmen“); alle belegten Zeiten, auch Termine aus anderen Quellen, trägt der Auftraggeber dort ein.',
    provision: String(k['Provision %']).replace('.', ','),
    ust_hinweis: /^ja/i.test(String(s.agentur_kleinunternehmer)) ? 'Gemäß § 19 UStG wird keine Umsatzsteuer berechnet.' : 'Alle Beträge zzgl. 19 % Umsatzsteuer.'
  };
  return VEREINBARUNG.replace(/\{\{(\w+)\}\}/g, function (_, x) { return f[x] != null && f[x] !== '' ? esc_(f[x]) : '[' + x + ']'; });
}

function slug_(t) {
  return String(t || '').toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss').replace(/&/g, 'und')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40).replace(/-+$/, '') || 'studio';
}

function kuerzelFrei_(basis) {
  var da = kunden_().map(function (k) { return k.kuerzel; }), k = basis, n = 2;
  while (da.indexOf(k) >= 0) k = basis + '-' + n++;
  return k;
}

/** Telefonnummern: Google macht aus „0151…“ eine Zahl und schneidet die 0 ab. Hier kommt sie zurück. */
function telLesen_(v) {
  if (typeof v === 'number') return '0' + String(Math.round(v));
  var t = String(v == null ? '' : v).trim();
  return /^[1-9]\d{6,}$/.test(t) ? '0' + t : t;
}

/** Legt den Kunden an (oder aktualisiert ihn), speichert die Vereinbarung, legt den Fotos-Ordner an, schickt die Willkommens-Mail. */
function kundeAnlegen_(kunde, vertrag, s, mailSenden) {
  blattSicher_('Kunden', KUNDEN_SPALTEN);
  var t = tabelle_('Kunden'), kz = String(kunde['Kürzel']).toLowerCase().trim();
  var z = t.zeilen.filter(function (x) { return String(t.get(x, 'Kürzel')).trim().toLowerCase() === kz; })[0], neu = !z;
  if (neu) {
    var werte = {};
    Object.keys(kunde).forEach(function (h) { werte[h] = kunde[h]; });
    werte['Status'] = 'Angelegt';
    werte['Angelegt am'] = new Date();
    werte['Token'] = neuerSchluessel_() + neuerSchluessel_();
    zeileAnhaengen_(t, werte);
  } else {
    Object.keys(kunde).forEach(function (h) { if (t.kopf[h] !== undefined && kunde[h] !== '' && kunde[h] != null) t.set(z, h, kunde[h]); });
    if (!String(t.get(z, 'Token'))) t.set(z, 'Token', neuerSchluessel_() + neuerSchluessel_());
  }
  if (vertrag) {
    var vt = tabelle_(blattSicher_('Verträge', VERTRAEGE_SPALTEN).getName());
    var vz = vt.zeilen.filter(function (x) { return String(vt.get(x, 'Kürzel')).toLowerCase() === kz; })[0];
    if (!vz) zeileAnhaengen_(vt, { 'Kürzel': kz, 'Vereinbarung': vertrag });
    else if (!vt.get(vz, 'Angenommen am')) vt.set(vz, 'Vereinbarung', vertrag);
  }
  var k = kunde_(kz), zeilen = [neu ? '✓ ' + k.betrieb + ' ist angelegt.' : '✓ ' + k.betrieb + ' ist aktualisiert.'];
  if (mailSenden && neu) {
    willkommensMail_(k, s);
    zeilen.push('✓ Willkommens-Mail mit Vereinbarung und Schritten an ' + k.email + ' geschickt (Kopie an ' + betreuerMail_(k, s) + ').');
  } else zeilen.push('Link zur Schritte-Seite des Studios: ' + studioLink_(s, k));
  zeilen.push('', 'Ab jetzt läuft es von selbst: Das Studio erledigt seine Schritte, die Zentrale erinnert es und schickt dir eine Mail, sobald alles da ist. Du musst nichts in die Tabelle eintragen.');
  return zeilen.join('\n');
}

function kundeSetzen_(kuerzel, werte) {
  var t = tabelle_('Kunden'), z = t.zeilen.filter(function (x) { return String(t.get(x, 'Kürzel')).trim().toLowerCase() === kuerzel; })[0];
  if (!z) return;
  Object.keys(werte).forEach(function (h) { t.set(z, h, werte[h]); });
}

function portal_(s) {
  var p = String(s.portal_url || '').trim().replace(/\/+$/, '');
  return p ? p + '/?z=' + encodeURIComponent(basis_(s)) + '&' : basis_(s) + '?';
}

function studioLink_(s, k) { return portal_(s) + 'a=studio&k=' + encodeURIComponent(k.kuerzel) + '&t=' + encodeURIComponent(k.token); }

/** E-Mail des Betreuers: aus der Kundenzeile, sonst aus „Wer ist im Team?“, sonst an alle in „Hinweise gehen an“. */
function betreuerMail_(k, s) { return k.betreuerMail || teamMail_(s, k.betreuer) || s.an; }

function betreuerZeile_(k, s) {
  return esc_(k.betreuer || s.agentur_name || 'Clickculture') + (k.betreuerTelefon ? ' · ' + esc_(k.betreuerTelefon) : '') +
    ' · ' + esc_(betreuerMail_(k, s) || '');
}

function willkommensMail_(k, s) {
  mail_(s, {
    to: k.email, cc: betreuerMail_(k, s), antwortAn: betreuerMail_(k, s), absender: (k.betreuer ? k.betreuer + ' · ' : '') + (s.agentur_name || 'Clickculture'),
    subject: 'Willkommen! Ihre nächsten Schritte für ' + k.betrieb,
    html: rahmen_('<p style="font-size:16px;">Hallo ' + esc_(k.anrede) + ',</p>' +
      '<p style="font-size:16px;">schön, dass wir zusammen starten. Damit Ihre Online-Terminbuchung und Ihre Werbung in wenigen Tagen laufen, brauchen wir ein paar Dinge von Ihnen. ' +
      'Alles steht auf einer Seite, Schritt für Schritt. Sie können jederzeit aufhören und später weitermachen.</p>' +
      grosserKnopf_(studioLink_(s, k), 'Meine Schritte öffnen') +
      '<p style="font-size:16px;"><b>Was wir machen:</b> Ihre Terminseite, die Anzeigen und die Einrichtung der Werbung. Bei Facebook und Google helfen wir Ihnen gern am Telefon.</p>' +
      '<p style="font-size:16px;">Ihr Ansprechpartner:<br>' + betreuerZeile_(k, s) + '</p>' +
      '<p style="font-size:13px;color:#6B665D;">Bitte heben Sie diese Mail auf. Über den Knopf kommen Sie immer wieder auf Ihre Seite.</p>')
  });
}


// ---------------------------------------------------------------- Die Schritte-Seite für das Studio

function metaEinladung_(s) { return String(s.meta_einladung || s.agentur_email || '').trim(); }
function zahlungLink_(k) { return 'https://business.facebook.com/billing_hub/payment_settings/?asset_id=' + k.werbekonto; }
function linkKnopf_(url, text) {
  return '<a href="' + esc_(url) + '" target="_blank" style="display:block;text-align:center;padding:13px;margin:8px 0;border:2px solid #1F7A3F;border-radius:7px;color:#1F7A3F;font-weight:700;text-decoration:none;">' + esc_(text) + '</a>';
}

function regelModul_(k) { return MODULE[REGELN_VON_BEHANDLER[k.behandlerArt]] || MODULE[k.behandlung] || MODULE['Permanent Make-up']; }

function studioAufgaben_(k, s) {
  var arzt = /arzt|heilprakt/i.test(k.behandlerArt) && !/zahn/i.test(k.behandlerArt), zahn = /zahn/i.test(k.behandlerArt), laser = /nisv/i.test(k.behandlerArt);
  var a = [
    { id: 'vertrag', titel: 'Vereinbarung lesen und annehmen', fertig: !!k.vertrag },
    { id: 'links', titel: 'Links zu Impressum und Datenschutz', fertig: !!(k.impressum && k.datenschutz) },
    { id: 'behandler', titel: 'Wer behandelt?', fertig: !!k.behandlerName,
      hilfe: laser ? 'Name und Nachweis der NiSV-Fachkunde, z. B. „Sabine Muster, NiSV-Fachkunde Laser“' :
        arzt ? 'Name, Titel und Fachrichtung, z. B. „Dr. med. Lisa Muster, Fachärztin für Dermatologie“' :
        zahn ? 'Name und Titel, z. B. „Dr. med. dent. Jan Muster, Zahnarzt“' : 'Name und Ausbildung, z. B. „Sabine Muster, Permanent Make-up Artist“' },
    { id: 'vorbereitung', titel: 'Hinweise vor dem Termin prüfen', fertig: !!k.vorbereitungOk },
    { id: 'fotos', titel: 'Fotos hochladen', fertig: k.fotos >= 3 },
  ];
  if (k.modus === 'Kalender') a.push({ id: 'kalender', titel: 'Google-Kalender freigeben', fertig: !!k.kalenderOk });
  a.push({ id: 'meta', titel: 'Clickculture bei Facebook einladen', fertig: !!k.metaOk });
  a.push({ id: 'karte', titel: 'Ihre Karte für die Werbung hinterlegen', fertig: !!k.karteOk, wartet: !k.metaFertig });
  if (k.vorschau) a.push({ id: 'freigabe', titel: 'Ihre Seite und Ihre Anzeigen ansehen und freigeben', fertig: !!k.freigabe });
  return a;
}

function studioSeite_(p) {
  var s = einst_(), k = kunde_(p.k);
  if (!k || !k.token || String(p.t) !== k.token) return seite_('Nicht gefunden', 'Dieser Link ist nicht (mehr) gültig. Bitte melden Sie sich bei uns.');
  var js = 'var K=' + JSON.stringify(k.kuerzel) + ',T=' + JSON.stringify(k.token) + ';' +
    'function zeig(r){document.getElementById("inhalt").innerHTML=r.html;var m=document.getElementById("meldung");m.textContent=r.meldung||"";m.style.display=r.meldung?"block":"none";m.style.background=r.ok?"#E5F4E4":"#FBEBEB";if(r.meldung)m.scrollIntoView({block:"center"});}' +
    'function fehl(e){zeig({html:document.getElementById("inhalt").innerHTML,meldung:"Das hat nicht geklappt: "+e.message,ok:false});}' +
    'function gross(t){return String(t).trim().replace(/\\s+/g," ").split(" ").map(function(w){return w.charAt(0).toUpperCase()+w.slice(1);}).join(" ");}' +
    'document.addEventListener("blur",function(e){var x=e.target;if(x&&x.classList&&x.classList.contains("gross"))x.value=gross(x.value);if(x&&x.type==="email")x.value=x.value.trim().toLowerCase();},true);' +
    'document.addEventListener("submit",function(e){e.preventDefault();var f=e.target,b=f.querySelector("button");if(!f.checkValidity()){f.reportValidity();return;}b.disabled=true;b.textContent="Moment …";' +
    'var d={ua:navigator.userAgent};Array.prototype.forEach.call(f.elements,function(x){if(x.name&&x.type!=="file")d[x.name]=x.type==="checkbox"?x.checked:x.value;});' +
    'var datei=f.querySelector("input[type=file]");' +
    'if(datei){var liste=Array.prototype.slice.call(datei.files),n=0;if(!liste.length){b.disabled=false;b.textContent="Hochladen";return;}' +
    '(function weiter(){if(!liste.length){google.script.run.withSuccessHandler(zeig).withFailureHandler(fehl).studioAktion(K,T,"seite",{});return;}' +
    'var x=liste.shift();b.textContent="Lade Foto "+(++n)+" …";var r=new FileReader();r.onload=function(){google.script.run.withSuccessHandler(weiter).withFailureHandler(fehl)' +
    '.studioFoto(K,T,x.name,x.type,String(r.result).split(",")[1]);};r.readAsDataURL(x);})();return;}' +
    'google.script.run.withSuccessHandler(zeig).withFailureHandler(fehl).studioAktion(K,T,f.getAttribute("data-aktion"),d);});';
  return HtmlService.createHtmlOutput(
    '<style>body{font-family:-apple-system,Helvetica,Arial,sans-serif;color:#1A1917;margin:0;background:#F7F4EE;}' +
    '.w{max-width:620px;margin:0 auto;padding:22px 16px 60px;}h1{font-size:25px;margin:0 0 4px;}h2{font-size:19px;margin:0;}' +
    '.box{background:#fff;border:1px solid #E4DED3;border-radius:10px;padding:16px;margin:14px 0;}.ok{border-color:#9CCB9A;background:#F3FAF2;}' +
    'ol{padding-left:20px;}li{margin:6px 0;}input[type=text],input[type=url],textarea{font-family:inherit;width:100%;box-sizing:border-box;font-size:16px;padding:10px;border:1px solid #CFC8BB;border-radius:6px;margin:6px 0;}' +
    'button{font-size:17px;padding:13px 18px;border:0;border-radius:7px;background:#1F7A3F;color:#fff;font-weight:700;margin-top:6px;}' +
    '.k{color:#6B665D;font-size:14px;}code{background:#F1ECE2;padding:2px 6px;border-radius:4px;font-size:15px;}#meldung{display:none;padding:12px;border-radius:8px;font-weight:700;margin:12px 0;}' +
    'details summary{cursor:pointer;color:#1F5FA8;margin:8px 0;}.haken{font-size:20px;margin-right:6px;}</style>' +
    '<div class="w"><div id="meldung"></div><div id="inhalt">' + studioInhalt_(k, s) + '</div></div><script>' + js + '</script>')
    .setTitle(k.betrieb + ' · Ihre Schritte').addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function studioInhalt_(k, s) {
  var auf = studioAufgaben_(k, s), fertig = auf.filter(function (x) { return x.fertig; }).length;
  var nurWarten = fertig < auf.length && !auf.some(function (x) { return !x.fertig && !x.wartet; });
  var kopf = '<h1>' + esc_(k.betrieb) + '</h1><p class="k">Ihre Schritte zum Start · ' + fertig + ' von ' + auf.length + ' erledigt</p>' +
    (fertig === auf.length ? '<div class="box ok"><b>Alles erledigt, vielen Dank!</b> Wir richten jetzt Ihre Seite und die Werbung ein und melden uns, sobald alles läuft.</div>' : '') +
    (nurWarten ? '<div class="box ok"><b>Danke, Ihr Teil ist im Moment erledigt.</b> Wir richten jetzt Ihr Werbekonto ein. Sobald es weitergeht, bekommen Sie eine E-Mail.</div>' : '') +
    '<p class="k">Fragen? ' + betreuerZeile_(k, s) + '</p>';
  return kopf + auf.map(function (a, i) {
    if (a.wartet && !a.fertig) return '<div class="box"><h2><span class="haken">' + (i + 1) + '.</span>' + esc_(a.titel) + '</h2>' +
      '<p class="k">Das kommt später. Sobald wir Ihr Werbekonto eingerichtet haben (meist am selben oder nächsten Werktag), bekommen Sie eine E-Mail. ' +
      'Dann tragen Sie hier nur noch Ihre Karte ein.</p></div>';
    var inhalt = !a.fertig ? aufgabeHtml_(a, k, s) : erledigtText_(a.id, k) +
      (a.id === 'vertrag' || a.id === 'fotos' ? '' : '<details><summary>Ändern</summary>' + aufgabeHtml_(a, k, s) + '</details>');
    return '<div class="box' + (a.fertig ? ' ok' : '') + '"><h2><span class="haken">' + (a.fertig ? '✓' : (i + 1) + '.') + '</span>' + esc_(a.titel) + '</h2>' + inhalt + '</div>';
  }).join('');
}

function erledigtText_(id, k) {
  var t = {
    vertrag: 'Angenommen am ' + datumKurz_(k.vertrag) + '. Eine Kopie haben Sie per Mail bekommen.',
    links: esc_(k.impressum) + '<br>' + esc_(k.datenschutz),
    behandler: esc_(k.behandlerName),
    vorbereitung: 'Freigegeben. Ihre Kundinnen bekommen diese Hinweise mit der Bestätigung.',
    fotos: k.fotos + ' Fotos sind da.',
    kalender: 'Verbunden. Neue Termine stehen direkt in Ihrem Kalender.',
    meta: 'Einladung ist raus. Wir richten jetzt Ihre Facebook-Seite und Ihr Werbekonto ein.',
    karte: 'Danke! Ihre Karte ist hinterlegt.',
    google: 'Konto ' + esc_(k.googleId) + ' ist verbunden.',
    freigabe: 'Freigegeben am ' + datumKurz_(k.freigabe) + '. Danke! Wir starten jetzt die Werbung.'
  }[id] || 'Erledigt.';
  var mehr = id === 'fotos' ? aufgabeHtml_({ id: 'fotos' }, k, einst_()) : '';
  return '<p class="k">' + t + '</p>' + mehr;
}

function aufgabeHtml_(a, k, s) {
  var form = function (aktion, inhalt, knopf) { return '<form data-aktion="' + aktion + '">' + inhalt + '<button>' + esc_(knopf) + '</button></form>'; };
  if (a.id === 'vertrag') {
    var v = vertrag_(k.kuerzel);
    return '<p>Das Wichtigste: <b>keine Grundgebühr, kein Onboarding.</b> Wir bekommen <b>' + String(k.provision || PROVISION_STANDARD).replace('.', ',') +
      ' %</b> vom ersten Kauf einer neuen Kundin aus einem Online-Termin (innerhalb von 3 Monaten, auch nach einer Beratung). Das Werbebudget zahlen Sie direkt an Meta. Jederzeit kündbar.</p>' +
      (v ? '<details><summary>Ganze Vereinbarung lesen</summary><div style="font-size:14px;border-left:3px solid #E4DED3;padding-left:12px;">' + v + '</div></details>' : '') +
      form('vertrag', '<label>Ihr Vor- und Nachname<input type="text" name="name" autocomplete="name" required class="gross"></label>' +
        '<p><label><input type="checkbox" name="ok" required> Ich habe die Vereinbarung gelesen und nehme sie für ' + esc_(k.firma || k.betrieb) + ' verbindlich an.</label></p>' +
        '<p class="k">Sie bekommen die Vereinbarung danach als PDF mit Annahme-Nachweis per Mail.</p>', 'Verbindlich annehmen');
  }
  if (a.id === 'links') {
    return '<p>Von Ihrer Webseite kopieren (meist ganz unten). Ihre Terminseite verlinkt darauf.</p>' +
      '<details><summary>Was muss in der Datenschutzerklärung stehen?</summary><p class="k">Bitte von Ihrem Webseiten-Betreuer ergänzen lassen: ' +
      'Online-Terminbuchung über Clickculture (Daten werden in Google-Diensten verarbeitet), Hosting der Terminseite bei Netlify, ' +
      'Meta-Pixel und Google Ads (nur nach Zustimmung im Cookie-Hinweis), Terminerinnerungen per E-Mail.</p></details>' +
      form('links', '<label>Link zum Impressum<input type="url" name="impressum" required placeholder="https://…" value="' + esc_(k.impressum) + '"></label>' +
        '<label>Link zur Datenschutzerklärung<input type="url" name="datenschutz" required placeholder="https://…" value="' + esc_(k.datenschutz) + '"></label>', 'Speichern');
  }
  if (a.id === 'behandler') {
    return '<p>Steht auf Ihrer Terminseite. ' + esc_(a.hilfe) + '.</p>' +
      form('behandler', '<input type="text" name="behandler" required class="gross" value="' + esc_(k.behandlerName) + '">', 'Speichern');
  }
  if (a.id === 'vorbereitung') {
    var punkte = String(k.vorbereitung || '').split('•').map(function (x) { return x.trim(); }).filter(String).join('\n');
    var je = k.leistungen.map(function (l, i) {
      var h = String((k.hinweise || {})[l.name] || '').split('•').map(function (x) { return x.trim(); }).filter(String).join('\n');
      return '<label style="margin-top:10px;">' + esc_(l.name) + ' <span class="k">(freiwillig)</span><textarea name="h_' + i + '" rows="3" placeholder="z. B. Bitte ungeschminkt kommen">' + esc_(h) + '</textarea></label>';
    }).join('');
    return '<p>Diese Hinweise bekommen Ihre Kundinnen mit der Terminbestätigung und der Erinnerung 24 Stunden vorher. Ein Hinweis pro Zeile.</p>' +
      form('vorbereitung', '<label><b>Für alle Termine</b> <span class="k">(ein Vorschlag von uns, bitte anpassen)</span><textarea name="text" rows="5" required>' + esc_(punkte) + '</textarea></label>' +
        '<p style="margin:14px 0 0;"><b>Zusätzlich je Leistung</b> <span class="k">Was nur für diese Leistung gilt, z. B. „ungeschminkt kommen“ bei Wimpern. Leer lassen, wenn nichts dazukommt.</span></p>' + je, 'So freigeben');
  }
  if (a.id === 'fotos') {
    var falten = !regelModul_(k).regeln.vorher_nachher;
    return '<p>Mindestens 3 Fotos, gern direkt vom Handy: <b>Sie bzw. Ihr Team</b>, <b>Ihr Studio innen</b>, <b>eine Behandlung</b> (gern mit Kundin, wenn sie einverstanden ist).' +
      (falten ? ' Bitte keine Vorher-Nachher-Fotos, die sind bei dieser Behandlung in der Werbung verboten.' : '') + '</p>' +
      form('fotos', '<input type="file" name="fotos" accept="image/*" multiple required style="font-size:16px;margin:8px 0;">', 'Hochladen');
  }
  if (a.id === 'kalender') {
    var zentrale = Session.getEffectiveUser().getEmail();
    return '<p>Damit auf Ihrer Terminseite nur Zeiten erscheinen, die in Ihrem Kalender wirklich frei sind, und neue Online-Termine direkt in Ihrem Kalender stehen. ' +
      '<b>Am Computer</b> (in der Handy-App geht das Freigeben nicht), ca. 2 Minuten.</p>' +
      '<p><b>Welcher Kalender?</b> Der, in dem Sie heute Ihre Termine eintragen. Meist heißt er wie Sie selbst oder wie Ihre Gmail-Adresse. ' +
      'Termine, die Sie dort selbst eintragen (Telefon, Instagram, Pause, Urlaub), sind für Online-Buchungen dann automatisch belegt.</p><ol>' +
      '<li><b>calendar.google.com</b> öffnen und mit dem Google-Konto anmelden, zu dem der Kalender gehört.</li>' +
      '<li>Links unter <b>„Meine Kalender“</b> mit der Maus auf diesen Kalender zeigen → rechts daneben erscheinen drei Punkte <b>⋮</b> → draufklicken → <b>„Einstellungen und Freigabe“</b>.</li>' +
      '<li>Oben stehen <b>„Name“</b> und <b>„Beschreibung“</b>. Die brauchen wir nicht: einfach so lassen, die Beschreibung darf leer bleiben.</li>' +
      '<li>Nach unten scrollen bis zur Überschrift <b>„Geteilt mit“</b>. Dort steht schon ein Eintrag: Ihr Name mit <b>„(Inhaber)“</b> und Ihrer Adresse. ' +
      'Direkt darunter auf <b>„+ Personen und Gruppen hinzufügen“</b> klicken.</li>' +
      '<li>Es öffnet sich ein kleines Fenster. Dort in das Feld <b>unsere Adresse</b> eintragen: <code onclick="navigator.clipboard&&navigator.clipboard.writeText(this.textContent)">' + esc_(zentrale) + '</code> ' +
      '<span class="k">(antippen zum Kopieren)</span></li>' +
      '<li>Daneben die <b>Berechtigung</b> aufklappen. Dort stehen fünf Möglichkeiten. Wählen Sie die <b>vierte: „Änderungen vornehmen und alle Details des Termins ansehen“</b>. ' +
      '<span class="k">Damit sehen wir, wann Sie belegt sind, und können Online-Termine eintragen und bei Absage wieder löschen. ' +
      'Die ersten drei reichen dafür nicht sicher aus, die fünfte („… Freigabe verwalten“) brauchen wir nicht.</span></li>' +
      '<li>Auf <b>„Senden“</b> klicken. Unter „Geteilt mit“ stehen jetzt zwei Einträge: oben Sie mit <b>„(Inhaber)“</b>, darunter unsere Adresse mit „Änderungen vornehmen und alle Details …“. So ist es richtig.</li></ol>' +
      '<p><b>Zum Schluss:</b> hier unten auf <b>„Freigabe prüfen“</b> tippen.</p>' +
      form('kalender', '<label>Ihre Adresse<input type="email" name="kalender" required value="' + esc_(k.kalender) + '"></label>', 'Freigabe prüfen') +
      '<p class="k">„Freigabe prüfen“ sagt sofort, ob es geklappt hat. Kommt „Noch keine Freigabe“: 1–2 Minuten warten und nochmal tippen.</p>';
  }
  if (a.id === 'meta') {
    var einladen = metaEinladung_(s), tel = esc_(k.betreuerTelefon || s.agentur_telefon || '');
    var kopier = function (t) { return '<code onclick="navigator.clipboard&&navigator.clipboard.writeText(this.textContent)">' + esc_(t) + '</code>'; };
    return '<p>Ihre Werbung läuft auf Facebook und Instagram, über Ihr eigenes Werbekonto. <b>Einrichten tun wir das für Sie.</b> ' +
      'Sie laden uns dafür nur einmal ein. Das dauert ca. 5 Minuten, am einfachsten am Computer.</p>' +
      '<p><b>Sie brauchen:</b> Ihr ganz normales Facebook-Konto. Noch keins? Auf <b>facebook.com</b> ein neues Konto erstellen, mit Ihrem echten Namen.</p>' +
      '<h3 style="margin:18px 0 4px;">Teil A · Business-Portfolio anlegen</h3>' +
      '<p class="k" style="margin-top:0;">Haben Sie das schon einmal gemacht? Dann weiter mit Teil B. Wenn Sie nicht sicher sind: einfach Teil A machen.</p><ol>' +
      '<li>Diesen Knopf antippen:' + linkKnopf_('https://business.facebook.com/overview', 'business.facebook.com öffnen') +
        'Fragt Facebook nach der Anmeldung: mit Ihrem Facebook-Konto anmelden.</li>' +
      '<li>Auf <b>„Business-Portfolio erstellen“</b> tippen (manchmal heißt der Knopf <b>„Konto erstellen“</b>).</li>' +
      '<li>Drei Felder ausfüllen: den Namen Ihres Studios ' + kopier(k.betrieb) + ', Ihren Vor- und Nachnamen und Ihre E-Mail-Adresse. Dann auf <b>„Erstellen“</b> tippen.</li>' +
      '<li>Facebook schickt Ihnen eine E-Mail. Darin auf <b>„Jetzt bestätigen“</b> tippen.</li></ol>' +
      '<h3 style="margin:18px 0 4px;">Teil B · Uns einladen</h3><ol>' +
      '<li>Auf business.facebook.com links unten auf das Zahnrad <b>„Einstellungen“</b> tippen.</li>' +
      '<li>Auf <b>„Personen“</b> tippen, dann auf den blauen Knopf <b>„Hinzufügen“</b> (oder <b>„Personen einladen“</b>).</li>' +
      '<li>Diese E-Mail-Adresse eintragen (antippen zum Kopieren): ' + kopier(einladen) + '</li>' +
      '<li>Darunter <b>„Volle Kontrolle“</b> wählen, nicht „Teilzugriff“. <span class="k">Damit wir Seite und Werbekonto für Sie anlegen können. Alles gehört weiter Ihnen.</span></li>' +
      '<li>Auf <b>„Weiter“</b> tippen. Auf den nächsten Seiten nichts auswählen, nur weiter tippen bis <b>„Einladen“</b> (oder <b>„Anfrage senden“</b>).</li></ol>' +
      '<p><b>Zum Schluss:</b> hier unten tippen.</p>' +
      form('meta', '', 'Erledigt, ich habe Clickculture eingeladen') +
      '<p class="k">Sieht etwas anders aus oder klappt nicht? Rufen Sie an' + (tel ? ': ' + tel : '') + '. Wir machen es dann zusammen am Telefon.</p>';
  }
  if (a.id === 'karte') {
    var tel2 = esc_(k.betreuerTelefon || s.agentur_telefon || '');
    return '<p>Ihr Werbekonto ist eingerichtet. Jetzt fehlt nur noch Ihre Karte, damit Facebook die Werbung abrechnen kann. ' +
      'Das Geld geht direkt von Ihrer Karte an Facebook, nicht an uns. Ca. 2 Minuten.</p><ol>' +
      '<li>Diesen Knopf antippen:' + linkKnopf_(zahlungLink_(k), 'Zahlungsseite öffnen') + 'Fragt Facebook nach der Anmeldung: mit Ihrem Facebook-Konto anmelden.</li>' +
      '<li>Auf <b>„Zahlungsmethode hinzufügen“</b> tippen.</li>' +
      '<li>Ihre Kredit- oder Debitkarte eintragen und auf <b>„Speichern“</b> tippen.</li></ol>' +
      (k.seiteBestaetigen ? '<p><b>Noch ein Klick:</b> Sie hatten schon eine Facebook-Seite. Facebook hat Ihnen dazu eine Anfrage geschickt ' +
        '(eine Benachrichtigung bei Facebook oder eine E-Mail). Bitte dort auf <b>„Genehmigen“</b> tippen.</p>' : '') +
      '<p><b>Zum Schluss:</b> hier unten tippen.</p>' +
      form('karte', '', 'Erledigt, meine Karte ist hinterlegt') +
      '<p class="k">Sieht etwas anders aus oder klappt nicht? Rufen Sie an' + (tel2 ? ': ' + tel2 : '') + '.</p>';
  }
  if (a.id === 'freigabe') {
    var knopf = function (url, text) {
      return '<p><a href="' + esc_(url) + '" target="_blank" style="display:block;text-align:center;padding:13px;border:2px solid #1F7A3F;border-radius:7px;color:#1F7A3F;font-weight:700;text-decoration:none;">' + esc_(text) + '</a></p>';
    };
    return '<p>So sieht es aus, bevor die Werbung startet. Bitte beides einmal ansehen, am besten am Handy. Die Termine auf der Seite sind dabei nur Beispiele.</p>' +
      knopf(k.seite + '/termin.html?demo=1', 'Ihre Terminseite ansehen') + knopf(k.seite + '/anzeigen/vorschau.html', 'Ihre Anzeigen ansehen') +
      (k.aenderung ? '<p class="k">Ihr letzter Änderungswunsch: „' + esc_(k.aenderung) + '“. Wir haben ihn umgesetzt. Bitte nochmal ansehen.</p>' : '') +
      form('freigabe-ok', '', 'Passt so, freigeben') +
      '<details><summary>Etwas soll anders sein?</summary>' +
      form('freigabe-aendern', '<textarea name="text" rows="4" placeholder="z. B. anderes Foto oben, Preis für Powder Brows ist 420 €"></textarea>', 'Änderung schicken') + '</details>';
  }
  if (a.id === 'google') {
    if (k.googleId) {
      return '<p>Danke! Wir haben Ihnen an Ihr Google-Konto eine Verknüpfungs-Anfrage geschickt (kann bis zu einem Tag dauern). So nehmen Sie sie an:</p><ol>' +
        '<li><b>ads.google.com</b> öffnen, Konto <code>' + esc_(k.googleId) + '</code>.</li>' +
        '<li>Links <b>Verwaltung → Zugriff und Sicherheit</b> → oben <b>Verwaltungskonten</b> → bei der Anfrage auf <b>Annehmen</b>.</li>' +
        '<li>Links <b>Abrechnung → Einstellungen</b>: Ihre Karte als Zahlungsmethode hinterlegen.</li></ol>' +
        '<p class="k">Fragt Google nach einem Passkey oder einer Bestätigung: einfach den Anweisungen folgen. Ein neuer Passkey gilt erst nach 48 Stunden.</p>' +
        form('google-ok', '', 'Erledigt, Anfrage angenommen');
    }
    return '<p>Ihr eigenes Google-Ads-Konto, ohne schon Werbung zu starten. Am Computer, ca. 5 Minuten:</p><ol>' +
      '<li><b>ads.google.com</b> öffnen und mit Ihrem Google-Konto anmelden → <b>Jetzt starten</b> bzw. <b>Neues Google Ads-Konto</b>.</li>' +
      '<li>Google möchte gleich eine Kampagne erstellen. Das brauchen Sie nicht: ganz unten klein auf <b>„Zum Expertenmodus wechseln“</b> klicken.</li>' +
      '<li>Auf der nächsten Seite ganz unten <b>„Konto ohne Kampagne erstellen“</b>.</li>' +
      '<li>Land <b>Deutschland</b>, Zeitzone <b>Berlin</b>, Währung <b>Euro</b> → <b>Senden</b> bzw. <b>Weiter</b>.</li>' +
      '<li>Oben rechts steht jetzt Ihre Kunden-ID, z. B. 123-456-7890. Die hier eintragen:</li></ol>' +
      '<p class="k">Kommt der Knopf „Zum Expertenmodus wechseln“ nicht? Dann kurz anrufen, wir machen es zusammen.</p>' +
      form('google', '<input type="text" name="id" placeholder="123-456-7890" inputmode="numeric">', 'Speichern');
  }
  return '';
}

/** google.script.run von der Schritte-Seite. Gibt {ok, meldung, html} zurück. */
function studioAktion(kuerzel, token, aktion, d) {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    var s = einst_(), k = kunde_(kuerzel);
    if (!k || !k.token || String(token) !== k.token) return { ok: false, meldung: 'Dieser Link ist nicht mehr gültig.', html: '' };
    var r = studioAktion_(k, s, aktion, d || {});
    SpreadsheetApp.flush();
    k = kunde_(kuerzel);
    r.html = studioInhalt_(k, s);
    return r;
  } catch (err) {
    fehler_('Schritte-Seite ' + kuerzel, err);
    return { ok: false, meldung: 'Gerade hat etwas nicht geklappt. Bitte gleich nochmal versuchen oder uns anrufen.', html: '' };
  } finally { lock.releaseLock(); }
}

function studioAktion_(k, s, aktion, d) {
  var jetzt = new Date(), txt = function (v) { return String(v == null ? '' : v).trim(); }, kz = k.kuerzel;
  if (aktion === 'seite') return { ok: true, meldung: 'Fotos sind angekommen. Danke!' };
  if (aktion === 'vertrag') {
    if (k.vertrag) return { ok: true, meldung: 'Schon angenommen.' };
    if (txt(d.name).split(' ').length < 2) return { ok: false, meldung: 'Bitte Vor- und Nachnamen eintragen.' };
    if (d.ok !== true) return { ok: false, meldung: 'Bitte das Häkchen setzen.' };
    blattSicher_('Verträge', VERTRAEGE_SPALTEN);
    var vt = tabelle_('Verträge'), vz = vt.zeilen.filter(function (x) { return String(vt.get(x, 'Kürzel')).toLowerCase() === kz; })[0];
    var text = vertrag_(kz) || '', pruef = sha256_(text), ua = txt(d.ua).slice(0, 300);
    if (vz) {
      vt.set(vz, 'Angenommen am', jetzt); vt.set(vz, 'Angenommen von', txt(d.name)); vt.set(vz, 'Gesendet an', k.email);
      vt.set(vz, 'Prüfsumme SHA-256', pruef); vt.set(vz, 'Browser', ua); vt.set(vz, 'Annahme-Link', 'Schritte-Seite, Schlüssel …' + k.token.slice(-6));
    }
    kundeSetzen_(kz, { 'Vertrag angenommen': jetzt });
    var nachweis = annahmeNachweis_(k, s, txt(d.name), jetzt, pruef, ua);
    var anhang = [];
    try { anhang.push(vertragPdf_(text + nachweis, k, jetzt)); } catch (e) { fehler_('Vereinbarung als PDF', e); }
    mail_(s, { to: k.email, cc: betreuerMail_(k, s), bcc: s.agentur_email, antwortAn: betreuerMail_(k, s), absender: s.agentur_name || 'Clickculture',
      subject: 'Ihre Vereinbarung mit ' + (s.agentur_name || 'Clickculture') + ' (angenommen am ' + datumKurz_(jetzt) + ')',
      html: rahmen_('<p>Hallo ' + esc_(k.anrede) + ',</p><p>danke! Sie haben die Vereinbarung am ' + esc_(datumText_(jetzt, s)) + ' Uhr angenommen (' + esc_(txt(d.name)) + '). ' +
        'Im Anhang finden Sie sie als PDF mit dem Annahme-Nachweis. Bitte heben Sie diese Mail auf.</p>' +
        '<div style="border-left:3px solid #E4DED3;padding-left:12px;font-size:14px;">' + text + nachweis + '</div>'), anhang: anhang });
    rechnungAnlegen_(kunde_(kz), s, 'Onboarding', 'einmalig', kunde_(kz).onboarding);
    return { ok: true, meldung: 'Danke! Die Vereinbarung ist angenommen. Eine Kopie kommt per Mail.' };
  }
  if (aktion === 'links') {
    var i = txt(d.impressum), ds = txt(d.datenschutz);
    if (!/^https?:\/\/\S+\.\S+/.test(i) || !/^https?:\/\/\S+\.\S+/.test(ds)) return { ok: false, meldung: 'Bitte beide Links vollständig eintragen (beginnen mit https://).' };
    kundeSetzen_(kz, { 'Impressum': i, 'Datenschutz': ds });
    return { ok: true, meldung: 'Gespeichert.' };
  }
  if (aktion === 'behandler') {
    if (txt(d.behandler).length < 5) return { ok: false, meldung: 'Bitte Name und Qualifikation eintragen.' };
    kundeSetzen_(kz, { 'Behandler': txt(d.behandler) });
    return { ok: true, meldung: 'Gespeichert.' };
  }
  if (aktion === 'vorbereitung') {
    var punkte = txt(d.text).split(/\n/).map(function (x) { return x.replace(/^[-•*\s]+/, '').trim(); }).filter(String);
    if (!punkte.length) return { ok: false, meldung: 'Bitte mindestens einen Hinweis stehen lassen.' };
    var hinweise = {};
    k.leistungen.forEach(function (l, i) {
      var p = txt(d['h_' + i]).split(/\n/).map(function (x) { return x.replace(/^[-•*\s]+/, '').trim(); }).filter(String);
      if (p.length) hinweise[l.name] = p.join(' • ');
    });
    kundeSetzen_(kz, { 'Vorbereitung': punkte.join(' • '), 'Hinweise je Leistung': JSON.stringify(hinweise), 'Vorbereitung ok': jetzt });
    return { ok: true, meldung: 'Freigegeben. Danke!' };
  }
  if (aktion === 'kalender') {
    var id = txt(d.kalender).toLowerCase();
    if (!/\S+@\S+\.\S+/.test(id)) return { ok: false, meldung: 'Bitte die Adresse Ihres Kalenders eintragen (z. B. studio@gmail.com).' };
    if (id === String(Session.getEffectiveUser().getEmail()).toLowerCase()) return { ok: false, meldung: 'Das ist unsere Adresse. Bitte Ihre eigene eintragen: die, bei der in Google Kalender „Inhaber“ steht.' };
    kundeSetzen_(kz, { 'Kalender-ID': id });
    var cal = null;
    try { cal = kalender_(kunde_(kz)); } catch (e) { cal = null; }
    if (!cal) return { ok: false, meldung: 'Noch keine Freigabe da. Bitte prüfen: 1. Steht im Feld die Adresse, mit der Sie bei Google Kalender angemeldet sind? 2. Haben Sie die Adresse von uns mit „Änderungen vornehmen und alle Details des Termins ansehen“ hinzugefügt und auf „Senden“ getippt? Dann 1–2 Minuten warten und nochmal prüfen. Klappt es nicht: kurz anrufen.' };
    kundeSetzen_(kz, { 'Kalender ok': jetzt });
    return { ok: true, meldung: 'Verbunden! Ihr Kalender ist freigegeben.' };
  }
  if (aktion === 'meta') {
    if (k.metaOk) return { ok: true, meldung: 'Ist schon gemeldet. Danke!' };
    kundeSetzen_(kz, { 'Meta erledigt': jetzt });
    betreuerHinweis_(k, s, k.betrieb + ': hat euch bei Facebook eingeladen. Jetzt Meta einrichten',
      '<p>' + esc_(k.betrieb) + ' hat ' + esc_(metaEinladung_(s)) + ' in sein Business-Portfolio eingeladen.</p>' +
      '<p>Die Einladung kommt per Mail von Facebook. Danach richtet ihr alles im Portfolio des Studios ein: Seite, Werbekonto, Pixel, Partnerzugriff. ' +
      'Die Klickliste steht auf der Team-Seite im Kasten <b>„Meta einrichten“</b>. Am Ende dort <b>„Meta fertig“</b> tippen, dann bekommt das Studio die Mail zum Hinterlegen der Karte.</p>' +
      '<p>Keine Einladung da (auch nicht im Spam)? Studio anrufen: ' + esc_(k.telefon) + '.</p>');
    return { ok: true, meldung: 'Danke! Wir richten jetzt alles ein und schicken Ihnen eine E-Mail, wenn es weitergeht.' };
  }
  if (aktion === 'karte') {
    if (!k.metaFertig) return { ok: false, meldung: 'Ihr Werbekonto ist noch nicht fertig. Sie bekommen eine E-Mail, sobald es so weit ist.' };
    kundeSetzen_(kz, { 'Karte ok': jetzt });
    betreuerHinweis_(k, s, k.betrieb + ': Karte ist hinterlegt',
      '<p>' + esc_(k.betrieb) + ' meldet: Karte ist im Werbekonto ' + esc_(k.werbekonto) + ' hinterlegt.</p>' +
      '<p>Kurz prüfen: Werbeanzeigenmanager → Abrechnung und Zahlungen → Zahlungsmethode ist da.' +
      (k.seiteBestaetigen ? ' Und: Ist die Facebook-Seite jetzt im Portfolio des Studios und für euch freigegeben?' : '') + '</p>');
    return { ok: true, meldung: 'Danke! Damit kann die Werbung starten, sobald alles fertig ist.' };
  }
  if (aktion === 'google') {
    var g = txt(d.id).replace(/\D/g, '');
    if (g.length !== 10) return { ok: false, meldung: 'Die Kunden-ID hat 10 Ziffern, z. B. 123-456-7890.' };
    var gid = g.slice(0, 3) + '-' + g.slice(3, 6) + '-' + g.slice(6);
    kundeSetzen_(kz, { 'Google-Ads-ID': gid });
    betreuerHinweis_(k, s, k.betrieb + ': Google-Ads-Konto ' + gid + ' verknüpfen',
      '<p>' + esc_(k.betrieb) + ' hat sein Google-Ads-Konto angelegt: <b>' + gid + '</b>.</p><ol>' +
      '<li>ads.google.com → euer Verwaltungskonto' + (s.agentur_google_mcc ? ' (' + esc_(s.agentur_google_mcc) + ')' : '') + ' → links <b>Konten</b> → blaues <b>+</b> → <b>Vorhandenes Konto verknüpfen</b>.</li>' +
      '<li>Kunden-ID ' + gid + ' eintragen → <b>Anfrage senden</b>. Das Studio nimmt sie auf seiner Schritte-Seite an.</li></ol>');
    return { ok: true, meldung: 'Gespeichert. Wir schicken Ihnen jetzt die Verknüpfungs-Anfrage.' };
  }
  if (aktion === 'freigabe-ok') {
    if (!k.vorschau) return { ok: false, meldung: 'Noch nichts zum Freigeben da.' };
    kundeSetzen_(kz, { 'Freigabe': jetzt });
    betreuerHinweis_(k, s, '✓ ' + k.betrieb + ' hat Seite und Anzeigen freigegeben',
      '<p>' + esc_(k.betrieb) + ' hat Terminseite und Anzeigen freigegeben.</p><p>Wenn die Kampagnen fertig sind und der Test-Termin geklappt hat: auf der Team-Seite <b>„Jetzt live schalten“</b>.</p>');
    return { ok: true, meldung: 'Danke! Wir starten jetzt die Werbung und melden uns, sobald sie läuft.' };
  }
  if (aktion === 'freigabe-aendern') {
    if (txt(d.text).length < 3) return { ok: false, meldung: 'Bitte kurz schreiben, was anders sein soll.' };
    kundeSetzen_(kz, { 'Änderungswunsch': txt(d.text).slice(0, 1000) + ' (' + datumKurz_(jetzt) + ')', 'Vorschau gesendet': '' });
    betreuerHinweis_(k, s, '✎ ' + k.betrieb + ' möchte etwas ändern',
      '<p>' + esc_(k.betrieb) + ' schreibt zu Seite und Anzeigen:</p><blockquote style="border-left:3px solid #E4DED3;padding-left:12px;">' + esc_(txt(d.text)) + '</blockquote>' +
      '<ol><li>Den Wunsch an Claude schicken: „Ändere für ' + esc_(k.kuerzel) + ': …“ (Fotos dazu, falls es um Fotos geht).</li>' +
      '<li>Claude stellt die neue Fassung online.</li><li>Auf der Team-Seite <b>„Studio um Freigabe bitten“</b>. Das Studio sieht dann wieder die Seite und die Knöpfe.</li></ol>');
    return { ok: true, meldung: 'Danke, ist angekommen. Wir ändern das und schicken Ihnen die neue Fassung.' };
  }
  if (aktion === 'google-ok') {
    kundeSetzen_(kz, { 'Google verknüpft': jetzt });
    return { ok: true, meldung: 'Danke!' };
  }
  return { ok: false, meldung: 'Unbekannte Aktion.' };
}

/** google.script.run: ein Foto (base64) in den Fotos-Ordner des Studios. */
function studioFoto(kuerzel, token, name, mime, b64) {
  var s = einst_(), k = kunde_(kuerzel);
  if (!k || !k.token || String(token) !== k.token) throw new Error('Link ungültig');
  if (!/^image\//.test(String(mime)) && !/\.(heic|heif|jpe?g|png|webp)$/i.test(String(name))) throw new Error('Bitte nur Fotos hochladen.');
  var datei = Utilities.newBlob(Utilities.base64Decode(b64), mime || 'image/jpeg', String(name || 'foto.jpg').replace(/[^\w.\- ]/g, '_'));
  var n = k.fotos + 1;
  mail_(s, { to: betreuerMail_(k, s), absender: 'Clickculture Zentrale', subject: 'Foto ' + n + ' von ' + k.betrieb + ' (' + k.kuerzel + ')',
    html: rahmen_('<p>' + esc_(k.betrieb) + ' hat ein Foto hochgeladen. Wenn „alles da“ kommt: alle Fotos dieses Studios an Claude schicken.</p>'), anhang: [datei] });
  kundeSetzen_(kuerzel, { 'Fotos': n });
  return n;
}

/** Annahme-Nachweis: wer, wann, über welchen Weg, welcher Text (Prüfsumme). Steht im PDF, in der Mail und im Blatt „Verträge“. */
function annahmeNachweis_(k, s, name, wann, pruef, ua) {
  var z = function (a, b) { return '<tr><td style="padding:3px 10px 3px 0;color:#6B665D;vertical-align:top;">' + a + '</td><td style="padding:3px 0;">' + esc_(b) + '</td></tr>'; };
  return '<h3>Annahme-Nachweis</h3><table style="font-size:13px;border-collapse:collapse;">' +
    z('Angenommen von', name + ' für ' + (k.firma || k.betrieb)) + z('Zeitpunkt', datumText_(wann, s) + ' Uhr (' + s.tz + ')') +
    z('Weg', 'Klick auf „Verbindlich annehmen“ auf der persönlichen Schritte-Seite. Der Link dorthin wurde nur an ' + k.email + ' geschickt.') +
    z('Gerät/Browser', ua || 'nicht übermittelt') + z('Prüfsumme des Vertragstextes (SHA-256)', pruef) +
    z('Kopie', 'als PDF per E-Mail an ' + k.email + ' und ' + (s.agentur_name || 'Clickculture')) + '</table>' +
    '<p style="font-size:12px;color:#6B665D;">Die Vereinbarung zwischen Unternehmen braucht keine Unterschrift (§§ 145 ff. BGB). Sie kam durch die Annahme auf der Schritte-Seite zustande (§ 9).</p>';
}

function sha256_(text) {
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, String(text), Utilities.Charset.UTF_8)
    .map(function (b) { return ('0' + (b & 0xff).toString(16)).slice(-2); }).join('');
}

function vertragPdf_(html, k, wann) {
  var seite = '<html><head><meta charset="utf-8"><style>body{font-family:Arial,sans-serif;font-size:11pt;line-height:1.4;color:#111;}h2{font-size:16pt;}h3{font-size:12pt;margin-top:16px;}</style></head><body>' + html + '</body></html>';
  return Utilities.newBlob(seite, 'text/html', 'Vereinbarung.html').getAs('application/pdf')
    .setName('Vereinbarung ' + (k.firma || k.betrieb) + ' ' + Utilities.formatDate(wann, Session.getScriptTimeZone(), 'yyyy-MM-dd') + '.pdf');
}

function vertrag_(kuerzel) {
  var sh = SpreadsheetApp.getActive().getSheetByName('Verträge');
  if (!sh) return '';
  var vt = tabelle_('Verträge'), z = vt.zeilen.filter(function (x) { return String(vt.get(x, 'Kürzel')).toLowerCase() === kuerzel; })[0];
  return z ? String(vt.get(z, 'Vereinbarung')) : '';
}

function betreuerHinweis_(k, s, betreff, html) {
  mail_(s, { to: betreuerMail_(k, s), absender: 'Clickculture Zentrale', subject: betreff, html: rahmen_(html +
    '<p style="font-size:13px;color:#6B665D;">Alles zu ' + esc_(k.betrieb) + ' auf einen Blick: <a href="' + esc_(teamLink_(s, k.kuerzel)) + '">Team-Seite öffnen</a></p>') });
}


// ---------------------------------------------------------------- Erinnern, „alles da“, „Sie sind live“ (läuft täglich bzw. alle 10 Minuten)

function studiosNachfassen_(s, jetzt, nurKz) {
  var tage = Number(s.erinnerung_studio_tage) || 2;
  kunden_().filter(function (k) {
    return (!nurKz || k.kuerzel === nurKz) && k.aktiv && /angelegt/i.test(k.status) && k.token &&
      (!k.allesDa || (k.vorschau && !k.freigabe) || (k.metaFertig && !k.karteOk));
  }).forEach(function (k) {
    var offen = studioAufgaben_(k, s).filter(function (a) { return !a.fertig && !a.wartet; });
    // „Alles da“: alles, was Claude für Seite und Anzeigen braucht (Karte und Freigabe kommen später)
    if (!k.allesDa && !offen.some(function (a) { return a.id !== 'karte' && a.id !== 'freigabe'; })) {
      kundeSetzen_(k.kuerzel, { 'Alles da': jetzt }); allesDaMail_(k, s);
    }
    if (!offen.length) return;
    var seit = k.erinnert || k.angelegt;
    if (!nurKz && (!seit || werktage_(seit, jetzt) < tage)) return;
    if (k.erinnerungen >= 3 && !nurKz) {
      if (k.erinnerungen === 3) {
        kundeSetzen_(k.kuerzel, { 'Erinnerungen': 4, 'Erinnert am': jetzt });
        betreuerHinweis_(k, s, '☎ ' + k.betrieb + ' kommt nicht weiter: bitte anrufen',
          '<p>' + esc_(k.betrieb) + ' hat drei Erinnerungen bekommen. Noch offen:</p><ul>' + offen.map(function (a) { return '<li>' + esc_(a.titel) + '</li>'; }).join('') +
          '</ul><p>Am besten kurz anrufen (' + esc_(k.telefon) + ') und die Schritte zusammen machen: ' + esc_(studioLink_(s, k)) + '</p>');
      }
      return;
    }
    mail_(s, { to: k.email, antwortAn: betreuerMail_(k, s), absender: (k.betreuer ? k.betreuer + ' · ' : '') + (s.agentur_name || 'Clickculture'),
      subject: 'Noch ' + offen.length + ' Schritt' + (offen.length > 1 ? 'e' : '') + ' bis zum Start von ' + k.betrieb,
      html: rahmen_('<p style="font-size:16px;">Hallo ' + esc_(k.anrede) + ',</p><p style="font-size:16px;">damit Ihre Werbung starten kann, fehlt noch:</p><ul style="font-size:16px;">' +
        offen.map(function (a) { return '<li>' + esc_(a.titel) + '</li>'; }).join('') + '</ul>' + grosserKnopf_(studioLink_(s, k), 'Meine Schritte öffnen') +
        '<p style="font-size:16px;">Lieber zusammen am Telefon? Einfach anrufen: ' + betreuerZeile_(k, s) + '</p>') });
    kundeSetzen_(k.kuerzel, { 'Erinnerungen': k.erinnerungen + 1, 'Erinnert am': jetzt });
  });
}

function allesDaMail_(k, s) {
  betreuerHinweis_(k, s, '✓ ' + k.betrieb + ': alles vom Studio da. Jetzt Seite und Kampagnen',
    '<p>' + esc_(k.betrieb) + ' hat alle Schritte erledigt. Jetzt ihr, in dieser Reihenfolge:</p><ol>' +
    '<li><b>Fotos:</b> Sie kamen als Mails „Foto … von ' + esc_(k.betrieb) + '“. Die Anhänge speichern.</li>' +
    '<li><b>An Claude:</b> die Fotos und den Text unten schicken mit „Baue die Seite für ' + esc_(k.kuerzel) + '“. Claude stellt sie online.</li>' +
    '<li><b>Meta:</b> ' + (k.metaFertig ? 'ist eingerichtet ✓.' : 'auf der <a href="' + esc_(teamLink_(s, k.kuerzel)) + '">Team-Seite</a> den Kasten „Meta einrichten“ abarbeiten, falls noch nicht geschehen.') +
      ' Kampagne mit dem Kampagnen-Assistenten von Claude anlegen.</li>' +
    '<li><b>Test:</b> auf der Seite einen Termin mit deiner E-Mail buchen, bestätigen, wieder absagen.</li>' +
    '<li>Auf der Team-Seite <b>„Jetzt live schalten“</b>. Die Mail „Ihre Werbung läuft“ geht von selbst raus.</li></ol>' +
    '<p><b>Text für Claude</b> (alles markieren und kopieren):</p><pre style="white-space:pre-wrap;background:#F1ECE2;padding:10px;font-size:12px;">' +
    esc_(JSON.stringify(studioDaten_(k, s))) + '</pre>');
}

/** Alles, was Claude für Terminseite, Anzeigen und Kampagnen-Anleitung braucht (kunde-anlegen.py liest genau das). */
function studioDaten_(k, s) {
  var t = tabelle_('Kunden'), z = k.zeile, g = function (h) { return t.kopf[h] === undefined ? '' : t.get(z, h); };
  return { typ: 'clickculture-beauty-studio', kuerzel: k.kuerzel, betrieb: k.betrieb, firma: k.firma || k.betrieb, anrede: k.anrede, inhaber: k.inhaber,
    email: k.email, telefon: k.telefon, adresse: k.adresse, seite: k.seite, behandlung: k.behandlung, behandler_art: String(g('Behandler-Art')),
    behandler: k.behandlerName, leistungen: k.leistungen, zeiten: k.zeiten, takt: k.raster || 30, absagefrist: k.absagefrist, ausfall: k.ausfall,
    vorbereitung: k.vorbereitung, modus: k.modus, umkreis: Number(g('Umkreis km')) || 15, budget: zahl_(g('Werbebudget €')),
    impressum: k.impressum, datenschutz: k.datenschutz, betreuer: k.betreuer, zentrale: basis_(s),
    angebot: k.nk.text ? { text: k.nk.text, leistung: k.nk.leistung, normal: k.nk.normal, bis: k.nk.bis ? datumKurz_(k.nk.bis) : '' } : undefined,
    gewinnspiel: k.gewinn && regelModul_(k).regeln.verlosung ? { gewinne: gewinneText_(gewinneListe_(k)), leistungen: k.gsLeistungen, bedingungen: portal_(s) + 'a=tnb&k=' + encodeURIComponent(k.kuerzel) } : undefined,
    agentur: { name: s.agentur_name || 'Clickculture', email: s.agentur_email || '', telefon: s.agentur_telefon || '' } };
}

function liveMails_(s, jetzt) {
  kunden_().filter(function (k) { return /live/i.test(k.status) && !k.liveMail && k.email; }).forEach(function (k) {
    var werte = { 'Live-Mail': jetzt };
    if (!k.live) werte['Live seit'] = jetzt;
    kundeSetzen_(k.kuerzel, werte);
    mail_(s, { to: k.email, cc: betreuerMail_(k, s), antwortAn: betreuerMail_(k, s), absender: (k.betreuer ? k.betreuer + ' · ' : '') + (s.agentur_name || 'Clickculture'),
      subject: 'Es geht los: Ihre Werbung für ' + k.betrieb + ' läuft',
      html: rahmen_('<p style="font-size:16px;">Hallo ' + esc_(k.anrede) + ',</p><p style="font-size:16px;">ab heute läuft Ihre Werbung. So geht es weiter:</p><ul style="font-size:16px;">' +
        '<li><b>Neue Termine</b> kommen per Mail' + (k.modus === 'Kalender' ? ' und stehen direkt in Ihrem Kalender' : ' mit einem Knopf zum Bestätigen. Bitte zügig bestätigen') + '.</li>' +
        '<li>In jeder Termin-Mail gibt es den Knopf <b>„Fake melden“</b>, falls jemand Unsinn bucht.</li>' +
        '<li><b>Abends um 19 Uhr</b> fragen wir kurz: Wer ist gekommen, wer hat gekauft? Ein Knopfdruck pro Termin. Das ist wichtig, damit wir die Werbung verbessern können.</li>' +
        '<li>Ihre Kundinnen bekommen die Bestätigung mit Ihren Hinweisen und 24 Stunden vorher eine Erinnerung.</li>' +
        '<li>Einmal im Monat bekommen Sie einen kurzen Bericht.</li></ul>' +
        (k.seite ? '<p style="font-size:16px;">Ihre Terminseite: <a href="' + esc_(k.seite) + '">' + esc_(k.seite) + '</a></p>' : '') +
        '<p style="font-size:16px;">Fragen? ' + betreuerZeile_(k, s) + '</p>') });
  });
}

/** Gewinne eines Gewinnspiels: „2 × 30 % Rabatt …“ je Zeile bzw. mit „ • “ getrennt, der Hauptgewinn zuerst. */
function gewinneListe_(k) {
  return String(k.gewinn || '').split(/\s*(?:\n|•)\s*/).map(function (x) { return x.replace(/[\s\/,;]+$/, '').trim(); }).filter(String).map(function (x) {
    var m = x.match(/^(\d+)\s*[x×]\s*(.+)$/i);
    return m ? { anzahl: Math.max(1, Math.min(20, Number(m[1]))), text: m[2].trim() } : { anzahl: 1, text: x };
  });
}
function gewinneText_(liste) { return liste.map(function (g) { return (g.anzahl > 1 ? g.anzahl + ' × ' : '') + g.text; }); }

/** Läuft gerade ein Gewinnspiel mit Terminbuchung? (Start ≤ heute ≤ Teilnahmeschluss) */
function gewinnspiel_(k, jetzt) {
  if (!k.gewinn || !k.gsAb || !regelModul_(k).regeln.verlosung) return false;
  return jetzt >= k.gsAb && (!k.schluss || jetzt < new Date(k.schluss.getTime() + TAG));
}

/** Teilnahmebedingungen, aus den Daten des Studios erzeugt. */
function teilnahmeSeite_(p) {
  var k = kunde_(p.k);
  if (!k || !k.gewinn) return seite_('Kein Gewinnspiel', 'Gerade läuft hier kein Gewinnspiel.');
  var li = function (t) { return '<li style="margin:6px 0;">' + t + '</li>'; };
  return seite_('Teilnahmebedingungen', '<ol style="padding-left:20px;font-size:15px;">' +
    li('<b>Veranstalter:</b> ' + esc_(k.firma || k.betrieb) + ', ' + esc_(k.adresse) + '.') +
    li('<b>Gewinne:</b> ' + esc_(gewinneText_(gewinneListe_(k)).join(' · ')) + '.') +
    li('<b>Teilnahme:</b> einen Termin über unsere Terminseite buchen. Teilnahme ab 18 Jahren.') +
    li('<b>Teilnahmeschluss:</b> offen.') +
    li('Die Gewinnerinnen und Gewinner benachrichtigen wir per E-Mail oder Telefon.') +
    li('Diese Aktion steht in keiner Verbindung zu Facebook oder Instagram und wird von Meta weder gesponsert noch organisiert.') + '</ol>');
}

function werktage_(von, bis) {
  var n = 0, d = new Date(von.getFullYear(), von.getMonth(), von.getDate() + 1);
  for (; d <= bis; d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1)) if (d.getDay() !== 0 && d.getDay() !== 6) n++;
  return n;
}

function datumKurz_(d) { return d ? zwei_(d.getDate()) + '.' + zwei_(d.getMonth() + 1) + '.' + d.getFullYear() : ''; }


// ---------------------------------------------------------------- Team-Seite: alles per Knopf statt in der Tabelle

function teamToken_(s, kz) {
  var sig = Utilities.computeHmacSha256Signature('team:' + (kz || ''), String(s.schluessel || 'x'));
  return Utilities.base64EncodeWebSafe(sig).replace(/=+$/, '').slice(0, 22);
}

function teamLink_(s, kz) { return portal_(s) + 'a=team' + (kz ? '&k=' + encodeURIComponent(kz) : '') + '&t=' + teamToken_(s, kz); }

function teamOk_(s, kz, t) { return !!s.schluessel && String(t) === teamToken_(s, kz); }

function teamSeite_(p) {
  var s = einst_(), kz = String(p.k || '').toLowerCase();
  if (!teamOk_(s, kz, p.t)) return seite_('Nicht gefunden', 'Dieser Link ist nicht gültig.');
  var js = 'var K=' + JSON.stringify(kz) + ',T=' + JSON.stringify(String(p.t)) + ';' +
    'function zeig(r){if(r.html)document.getElementById("inhalt").innerHTML=r.html;var m=document.getElementById("meldung");m.textContent=r.meldung||"";m.style.display=r.meldung?"block":"none";m.style.background=r.ok?"#E5F4E4":"#FBEBEB";if(r.meldung)m.scrollIntoView({block:"center"});}' +
    'document.addEventListener("submit",function(e){e.preventDefault();var f=e.target,b=f.querySelector("button");if(f.dataset.frage&&!confirm(f.dataset.frage))return;b.disabled=true;var alt=b.textContent;b.textContent="Moment …";' +
    'var d={};Array.prototype.forEach.call(f.elements,function(x){if(x.name)d[x.name]=x.value;});' +
    'google.script.run.withSuccessHandler(zeig).withFailureHandler(function(x){b.disabled=false;b.textContent=alt;zeig({ok:false,meldung:"Fehler: "+x.message});}).teamAktion(K,T,f.dataset.aktion,d);});';
  return HtmlService.createHtmlOutput(
    '<style>body{font-family:-apple-system,Helvetica,Arial,sans-serif;color:#1A1917;margin:0;background:#F7F4EE;font-size:15px;}' +
    '.w{max-width:680px;margin:0 auto;padding:18px 14px 60px;}h1{font-size:23px;margin:0 0 4px;}h2{font-size:17px;margin:0 0 8px;}' +
    '.box{background:#fff;border:1px solid #E4DED3;border-radius:10px;padding:14px;margin:12px 0;}.k{color:#6B665D;font-size:13px;}' +
    'label{display:block;margin:6px 0;font-weight:600;font-size:14px;}input,textarea{width:100%;box-sizing:border-box;font-size:16px;padding:8px;border:1px solid #CFC8BB;border-radius:6px;margin-top:3px;font-weight:400;}' +
    'button{font-size:16px;padding:11px 16px;border:0;border-radius:7px;background:#1F7A3F;color:#fff;font-weight:700;margin-top:6px;}' +
    'button.grau{background:#EFEAE0;color:#1A1917;}table{width:100%;border-collapse:collapse;}td{padding:5px 4px;border-bottom:1px solid #EFEAE0;vertical-align:top;}' +
    'a{color:#1F5FA8;}#meldung{display:none;padding:12px;border-radius:8px;font-weight:700;margin:10px 0;}.zwei{display:grid;grid-template-columns:1fr 1fr;gap:0 10px;}</style>' +
    '<div class="w"><div id="meldung"></div><div id="inhalt">' + (kz ? teamStudio_(kz, s) : teamListe_(s)) + '</div></div><script>' + js + '</script>')
    .setTitle(kz ? 'Team · ' + kz : 'Clickculture · Übersicht').addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function teamListe_(s) {
  var ks = kunden_(), reihen = { 'Angelegt': [], 'Live': [], 'Pausiert': [], 'Beendet': [] };
  ks.forEach(function (k) { (reihen[k.status] || reihen.Angelegt).push(k); });
  var zeile = function (k) {
    var auf = studioAufgaben_(k, s), n = auf.filter(function (a) { return a.fertig; }).length;
    return '<tr><td><a href="' + esc_(teamLink_(s, k.kuerzel)) + '" target="_top"><b>' + esc_(k.betrieb) + '</b></a><br><span class="k">' + esc_(k.betreuer || '') + ' · ' + esc_(k.behandlung) + '</span></td>' +
      '<td class="k">' + (k.status === 'Angelegt' ? 'Schritte ' + n + '/' + auf.length + (k.allesDa ? ' · alles da ✓' : '') : esc_(k.status)) + '</td></tr>';
  };
  return '<h1>Übersicht</h1><p class="k">Tippe auf ein Studio. Lesezeichen setzen, dann brauchst du die Tabelle fast nie.</p>' +
    '<p><a href="' + esc_(formularLink_(s)) + '" target="_top"><button type="button">+ Neuer Kunde</button></a></p>' +
    ['Angelegt', 'Live', 'Pausiert', 'Beendet'].filter(function (x) { return reihen[x].length; }).map(function (x) {
      return '<div class="box"><h2>' + (x === 'Angelegt' ? 'Im Aufbau' : x) + '</h2><table>' + reihen[x].map(zeile).join('') + '</table></div>';
    }).join('') + (ks.length ? '' : '<div class="box">Noch keine Kunden.</div>');
}

function teamStudio_(kz, s) {
  var k = kunde_(kz);
  if (!k) return '<p>Studio nicht gefunden.</p>';
  var auf = studioAufgaben_(k, s), form = function (aktion, inhalt, knopf, frage, grau) {
    return '<form data-aktion="' + aktion + '"' + (frage ? ' data-frage="' + esc_(frage) + '"' : '') + '>' + inhalt + '<button' + (grau ? ' class="grau"' : '') + '>' + esc_(knopf) + '</button></form>';
  };
  var html = '<p class="k"><a href="' + esc_(teamLink_(s, '')) + '" target="_top">← alle Studios</a></p><h1>' + esc_(k.betrieb) + '</h1>' +
    '<p class="k">' + esc_(k.status) + ' · ' + esc_(k.behandlung) + ' · Provision ' + String(k.provision || PROVISION_STANDARD).replace('.', ',') + ' % · ' + esc_(k.telefon) + ' · ' + esc_(k.email) +
    ' · <a href="' + esc_(formularLink_(s, k.kuerzel)) + '" target="_top">Kundendaten ändern</a></p>';
  // 1 · Schritte des Studios
  html += '<div class="box"><h2>Schritte des Studios</h2><table>' + auf.map(function (a) {
    return '<tr><td>' + (a.fertig ? '✓' : '○') + ' ' + esc_(a.titel) + '</td></tr>';
  }).join('') + '</table><p class="k">So sieht das Studio seine Seite: <a href="' + esc_(studioLink_(s, k)) + '" target="_blank">Schritte-Seite öffnen</a>' +
    ' · Fotos: ' + k.fotos + ' (kamen per Mail)</p>' +
    (k.status === 'Angelegt' ? form('erinnern', '', 'Studio jetzt erinnern', '', true) : '') + '</div>';
  // Meta einrichten (nachdem das Studio euch eingeladen hat)
  if (k.metaOk) html += metaKasten_(k, s, form);
  // 2 · Einrichten
  html += '<details class="box"><summary><b>Text für Claude</b> (Seite und Anzeigen bauen lassen)</summary><p class="k">Alles markieren, kopieren und Claude schicken, zusammen mit den Fotos aus euren Mails.</p>' +
    '<textarea rows="5" readonly onclick="this.select()" style="font-size:11px;font-family:monospace;">' + esc_(JSON.stringify(studioDaten_(k, s))) + '</textarea></details>';
  html += '<div class="box"><h2>Einrichten</h2><p class="k">Wirkt sofort, die Seite muss dafür nicht neu hochgeladen werden.</p>' +
    form('einrichten', '<div class="zwei"><label>Meta-Pixel (Datensatz-ID)<input name="pixel" value="' + esc_(k.pixel) + '" inputmode="numeric"></label>' +
      '<input type="hidden" name="conversion" value="' + esc_(k.conversion) + '"><span></span></div>' +
      '<label>Adresse der Seite<input name="seite" value="' + esc_(k.seite) + '"></label>', 'Speichern') +
    (k.seite ? '<p class="k"><a href="' + esc_(k.seite) + '" target="_blank">Seite öffnen und Test-Termin buchen</a></p>' : '') + '</div>';
  // 3 · Freigabe durch das Studio
  if (k.status === 'Angelegt') {
    html += '<div class="box"><h2>Freigabe durch das Studio</h2>' + (k.freigabe ? '<p>✓ Seite und Anzeigen freigegeben am ' + datumKurz_(k.freigabe) + '.</p>' :
      k.vorschau ? '<p>Gesendet am ' + datumKurz_(k.vorschau) + '. Das Studio sieht Seite und Anzeigen auf seiner Schritte-Seite und tippt „Passt so“ oder schreibt eine Änderung.</p>' :
      (k.aenderung ? '<p><b>Änderungswunsch:</b> ' + esc_(k.aenderung) + '</p><p class="k">Umgesetzt und neu hochgeladen? Dann wieder um Freigabe bitten.</p>' :
        '<p>Sobald die Seite online ist (Claude hat sie hochgeladen oder ihr habt sie auf Netlify gezogen): Das Studio bekommt eine Mail und sieht Seite und Anzeigen auf seiner Schritte-Seite.</p>') +
      form('vorschau', '', 'Studio um Freigabe bitten')) + '</div>';
  }
  // 4 · Status
  if (k.status === 'Angelegt') {
    var fehlt = [];
    if (!k.freigabe) fehlt.push('Freigabe des Studios');
    if (!k.metaFertig) fehlt.push('Meta einrichten');
    if (!k.karteOk) fehlt.push('Karte des Studios');
    if (!k.pixel) fehlt.push('Pixel-ID');
    if (!k.vertrag) fehlt.push('Vereinbarung');
    if (!k.impressum || !k.datenschutz) fehlt.push('Impressum/Datenschutz');
    html += '<div class="box"><h2>Live schalten</h2><p>Erst wenn die Seite online ist, ein Test-Termin geklappt hat und die Kampagnen laufen. Das Studio bekommt dann von selbst die Mail „Ihre Werbung läuft“.</p>' +
      (fehlt.length ? '<p class="k">Noch offen: ' + esc_(fehlt.join(', ')) + '</p>' : '') +
      form('live', '', 'Jetzt live schalten', 'Wirklich live schalten? Das Studio bekommt dann die Mail „Ihre Werbung läuft“.') + '</div>';
  } else if (k.status === 'Live') {
    html += '<div class="box"><h2>Status</h2>' + form('pausieren', '', 'Pausieren (keine Buchungen, keine Mails)', 'Studio wirklich pausieren?', true) + '</div>';
  } else {
    html += '<div class="box"><h2>Status: ' + esc_(k.status) + '</h2>' + form('fortsetzen', '', 'Wieder live schalten', 'Wieder live schalten?') + '</div>';
  }
  // 4 · Monatsreport
  if (k.live) {
    var vm = vormonat_(new Date()), z = zahlen_(tabelle_('Termine'), tabelle_('Werbekosten'), k.kuerzel, vm);
    var gesendet = PropertiesService.getScriptProperties().getProperty('report_' + k.kuerzel + '_' + monatSchluessel_(vm.start));
    if (k.live < vm.ende) {
      html += '<div class="box"><h2>Monatsreport ' + monatName_(vm.start) + '</h2>' + (gesendet ? '<p>✓ Gesendet am ' + esc_(gesendet) + '.</p>' :
        '<p class="k">Bestätigte Termine: ' + z.gebucht + ' · erschienen: ' + z.erschienen + ' · gekauft: ' + z.auftraege + '</p>' +
        form('report', '<div class="zwei"><label>Meta € im ' + MONATE[vm.start.getMonth()] + '<input name="meta" inputmode="decimal" placeholder="Werbeanzeigenmanager"></label>' +
          '<label>Google € im ' + MONATE[vm.start.getMonth()] + '<input name="google" inputmode="decimal" placeholder="Google Ads"></label></div>' +
          '<label>Was wir geändert haben<input name="geaendert" placeholder="z. B. zwei neue Anzeigen mit Ihren Fotos"></label>' +
          '<label>Was wir als Nächstes tun<input name="naechstes" placeholder="z. B. Werbegebiet auf 20 km erweitern"></label>' +
          '<label>Was wir von Ihnen brauchen (optional)<input name="brauchen" placeholder="z. B. 3 neue Fotos"></label>', 'Report an das Studio senden')) + '</div>';
    }
  }
  // Gewinnspiel (nur wo erlaubt): nur die Gewinne, Teilnahme = Termin buchen, Teilnahmeschluss offen
  if (regelModul_(k).regeln.verlosung) {
    var gs = gewinnspiel_(k, new Date());
    html += '<div class="box"><h2>Gewinnspiel</h2><p class="k">Teilnahme: Wer online einen Termin bucht, ist dabei. Teilnahmeschluss offen. ' +
      'Die stärksten Leistungen wählt ihr über „Kundendaten ändern“, hier könnt ihr die Gewinne direkt anpassen.</p>' +
      (gs ? '<p>✓ Läuft: ' + esc_(gewinneText_(gewinneListe_(k)).join(' · ')) + ' · <a href="' + esc_(portal_(s) + 'a=tnb&k=' + encodeURIComponent(k.kuerzel)) + '" target="_blank">Teilnahmebedingungen</a></p>' : '') +
      form('gewinnspiel', '<label>Gewinne, einer pro Zeile (erst die Hauptgewinne, dann die Zusatzgewinne)' +
        '<textarea name="gewinn" required rows="5" placeholder="eine gratis Wimpernverlängerung (Wert 100 €)\n2 × 20 % auf deinen nächsten Termin\n3 × 40 % auf deinen nächsten Termin" style="width:100%;box-sizing:border-box;font-size:16px;padding:9px;">' +
        esc_(gewinneText_(gewinneListe_(k)).join('\n')) + '</textarea></label>', 'Gewinne speichern') +
      (gs || k.gewinn ? form('gewinnspiel-aus', '', 'Gewinnspiel beenden', 'Gewinnspiel wirklich beenden? Das Banner verschwindet sofort.', true) : '') + '</div>';
  }
  // 5 · Rechnungen
  var rg = SpreadsheetApp.getActive().getSheetByName('Rechnungen') ? tabelle_('Rechnungen') : null;
  var meine = rg && rg.kopf['Kürzel'] !== undefined ? rg.zeilen.filter(function (x) { return String(rg.get(x, 'Kürzel')) === k.kuerzel && rg.get(x, 'Datum'); }) : [];
  if (meine.length) {
    html += '<div class="box"><h2>Rechnungen</h2><table>' + meine.map(function (x) {
      var nr = String(rg.get(x, 'Nr.')), bezahlt = datum_(rg.get(x, 'Bezahlt am'));
      return '<tr><td><b>' + esc_(nr) + '</b> · ' + esc_(rg.get(x, 'Posten')) + ' ' + esc_(rg.get(x, 'Zeitraum')) + '<br><span class="k">' + euro_(rg.get(x, 'Netto €')) + ' netto</span></td><td>' +
        (bezahlt ? '✓ bezahlt ' + datumKurz_(bezahlt) : form('bezahlt', '<input type="hidden" name="nr" value="' + esc_(nr) + '">', 'Bezahlt', '', true)) + '</td></tr>';
    }).join('') + '</table></div>';
  }
  return html;
}

/** google.script.run von der Team-Seite. */
function teamAktion(kz, t, aktion, d) {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    var s = einst_();
    kz = String(kz || '').toLowerCase();
    if (!teamOk_(s, kz, t)) return { ok: false, meldung: 'Link ungültig.' };
    var r = teamAktion_(kz, s, aktion, d || {});
    SpreadsheetApp.flush();
    r.html = teamStudio_(kz, s);
    return r;
  } catch (err) {
    fehler_('Team-Seite ' + kz, err);
    return { ok: false, meldung: 'Das hat nicht geklappt: ' + err.message };
  } finally { lock.releaseLock(); }
}

/** Klickliste für euch: alles im Portfolio des Studios einrichten, nachdem es euch eingeladen hat. */
function metaKasten_(k, s, form) {
  if (k.metaFertig) return '<div class="box"><h2>Meta</h2><p>✓ Eingerichtet am ' + datumKurz_(k.metaFertig) + ' · Werbekonto ' + esc_(k.werbekonto) +
    ' · Karte ' + (k.karteOk ? '✓ hinterlegt' : '○ fehlt noch (das Studio hat die Mail)') + '</p>' +
    '<details><summary>Ändern</summary>' + metaFormular_(k, form) + '</details></div>';
  var p = function (t) { return '<li style="list-style:none;margin:8px 0;"><label style="display:flex;gap:10px;align-items:flex-start;font-weight:normal;margin:0;"><input type="checkbox" style="width:22px;height:22px;flex:none;margin:1px 0 0;"><span>' + t + '</span></label></li>'; }, b = esc_(k.betrieb);
  return '<div class="box"><h2>Meta einrichten</h2><p class="k">' + b + ' hat ' + esc_(metaEinladung_(s)) + ' eingeladen. Die Häkchen sind nur für euch, sie werden nicht gespeichert.</p><ol style="padding-left:0;">' +
    p('<b>Einladung annehmen:</b> Mail von Facebook an ' + esc_(metaEinladung_(s)) + ' → „Einladung annehmen“. Nicht da? Spam ansehen, sonst Studio anrufen.') +
    p('Auf business.facebook.com <b>oben links das Portfolio „' + b + '“ wählen</b>. Ab hier alles in diesem Portfolio, nicht in eurem.') +
    p('<b>Seite:</b> Einstellungen → Konten → Seiten → Hinzufügen → „Neue Facebook-Seite erstellen“, Name „' + b + '“. Hat das Studio schon eine Seite: „Vorhandene Seite hinzufügen“. Dann muss das Studio genehmigen (unten auswählen).') +
    p('<b>Werbekonto:</b> Einstellungen → Konten → Werbekonten → Hinzufügen → „Neues Werbekonto erstellen“. Name „' + b + '“, Zeitzone <b>Europe/Berlin</b>, Währung <b>EUR</b> (beides später nicht änderbar), „Mein Unternehmen“. Euch selbst volle Kontrolle geben.') +
    p('<b>Werbetreibender und Zahler</b> (EU-Pflicht): im Werbeanzeigenmanager → Einstellungen des Werbekontos → beide Male „' + esc_(k.firma || k.betrieb) + '“.') +
    p('<b>Pixel:</b> Events Manager → Datenquellen verbinden → Web → Name „' + b + '“ → mit dem Werbekonto verbinden. Die ID unten eintragen.') +
    p('<b>Partnerzugriff für euer Portfolio:</b> Einstellungen → Partner → Hinzufügen → „Gewähre einem Partner Zugriff auf deine Assets“ → Business-ID <code>' + esc_(s.agentur_business_id || '[fehlt in den Einstellungen]') + '</code> → Seite, Werbekonto und Pixel, jeweils volle Kontrolle.') +
    p('Im <b>Clickculture-Portfolio</b>: Einstellungen → Werbekonten bzw. Seiten → das Konto von ' + b + ' → <b>Personen zuweisen</b> (euch beide).') +
    p('Unten Werbekonto-ID (Werbeanzeigenmanager oben links, nur Ziffern) und Pixel-ID eintragen → <b>„Meta fertig“</b>. Das Studio bekommt dann die Mail „Karte hinterlegen“.') +
    '</ol>' + metaFormular_(k, form) + '</div>';
}

function metaFormular_(k, form) {
  return form('metafertig', '<div class="zwei"><label>Werbekonto-ID *<input name="werbekonto" required inputmode="numeric" value="' + esc_(k.werbekonto) + '"></label>' +
    '<label>Pixel-ID<input name="pixel" inputmode="numeric" value="' + esc_(k.pixel) + '"></label></div>' +
    '<label>Facebook-Seite<select name="seite" style="display:block;width:100%;font-size:16px;padding:9px;margin:6px 0 10px;"><option value="neu">neu angelegt</option><option value="alt"' + (k.seiteBestaetigen ? ' selected' : '') +
    '>schon vorhanden: das Studio muss die Anfrage genehmigen</option></select></label>', 'Meta fertig: Studio bekommt die Mail „Karte hinterlegen“');
}

function teamAktion_(kz, s, aktion, d) {
  var k = kunde_(kz), txt = function (v) { return String(v == null ? '' : v).trim(); }, jetzt = new Date();
  if (!k) return { ok: false, meldung: 'Studio nicht gefunden.' };
  if (aktion === 'einrichten') {
    var px = txt(d.pixel).replace(/\D/g, ''), cv = txt(d.conversion).replace(/\s/g, ''), seite = txt(d.seite).replace(/\/+$/, '');
    if (px && (px.length < 12 || px.length > 20)) return { ok: false, meldung: 'Die Pixel-ID hat meist 15 oder 16 Ziffern.' };
    if (cv && !/^AW-\d+\/[\w-]+$/.test(cv)) return { ok: false, meldung: 'Die Conversion sieht so aus: AW-123456789/AbCdEf (mit Schrägstrich).' };
    if (seite && !/^https:\/\/\S+\.\S+$/.test(seite)) return { ok: false, meldung: 'Die Adresse der Seite beginnt mit https://' };
    kundeSetzen_(kz, { 'Pixel-ID': px, 'Google-Conversion': cv, 'Seiten-Adresse': seite });
    return { ok: true, meldung: 'Gespeichert. Wirkt sofort.' };
  }
  if (aktion === 'metafertig') {
    var wk = txt(d.werbekonto).replace(/^act_/i, '').replace(/\D/g, ''), px2 = txt(d.pixel).replace(/\D/g, '');
    if (wk.length < 8 || wk.length > 20) return { ok: false, meldung: 'Die Werbekonto-ID besteht nur aus Ziffern, meist 15 oder 16 (oben links im Werbeanzeigenmanager).' };
    if (px2 && (px2.length < 12 || px2.length > 20)) return { ok: false, meldung: 'Die Pixel-ID hat meist 15 oder 16 Ziffern.' };
    var erstes = !k.metaFertig, neu = { 'Werbekonto-ID': wk, 'Seite bestätigen': d.seite === 'alt' ? 'Ja' : '', 'Meta fertig': k.metaFertig || jetzt };
    if (px2) neu['Pixel-ID'] = px2;
    if (erstes && !k.karteOk) { neu['Erinnert am'] = jetzt; neu['Erinnerungen'] = 0; }
    kundeSetzen_(kz, neu);
    if (erstes && !k.karteOk) {
      var k3 = kunde_(kz);
      mail_(s, { to: k3.email, antwortAn: betreuerMail_(k3, s), absender: (k3.betreuer ? k3.betreuer + ' · ' : '') + (s.agentur_name || 'Clickculture'),
        subject: 'Ihr Werbekonto ist fertig: bitte noch Ihre Karte hinterlegen',
        html: rahmen_('<p style="font-size:16px;">Hallo ' + esc_(k3.anrede) + ',</p><p style="font-size:16px;">danke für die Einladung! Wir haben Ihre Facebook-Seite und Ihr Werbekonto eingerichtet. ' +
          'Jetzt fehlt nur noch Ihre Karte, damit Facebook die Werbung abrechnen kann. Das dauert ca. 2 Minuten. Die Anleitung steht auf Ihrer Schritte-Seite.</p>' +
          (k3.seiteBestaetigen ? '<p style="font-size:16px;">Außerdem hat Facebook Ihnen eine Anfrage zu Ihrer Seite geschickt. Bitte dort auf „Genehmigen“ tippen.</p>' : '') +
          grosserKnopf_(studioLink_(s, k3), 'Karte hinterlegen') + '<p style="font-size:16px;">Fragen? ' + betreuerZeile_(k3, s) + '</p>') });
      return { ok: true, meldung: 'Gespeichert. Das Studio hat die Mail „Karte hinterlegen“ bekommen.' };
    }
    return { ok: true, meldung: 'Gespeichert.' };
  }
  if (aktion === 'vorschau') {
    if (!/^https:\/\//.test(k.seite)) return { ok: false, meldung: 'Erst die Adresse der Seite eintragen (Kasten „Einrichten“).' };
    kundeSetzen_(kz, { 'Vorschau gesendet': jetzt, 'Freigabe': '', 'Erinnert am': jetzt, 'Erinnerungen': 0 });
    var k2 = kunde_(kz);
    mail_(s, { to: k2.email, antwortAn: betreuerMail_(k2, s), absender: (k2.betreuer ? k2.betreuer + ' · ' : '') + (s.agentur_name || 'Clickculture'),
      subject: 'Bitte ansehen: Ihre Terminseite und Ihre Anzeigen',
      html: rahmen_('<p style="font-size:16px;">Hallo ' + esc_(k2.anrede) + ',</p><p style="font-size:16px;">Ihre Terminseite und Ihre Anzeigen sind fertig. ' +
        'Bitte einmal ansehen und freigeben, dann starten wir die Werbung. Etwas soll anders sein? Einfach dort hineinschreiben.</p>' +
        grosserKnopf_(studioLink_(s, k2), 'Ansehen und freigeben') + '<p style="font-size:16px;">Fragen? ' + betreuerZeile_(k2, s) + '</p>') });
    return { ok: true, meldung: 'Das Studio hat die Mail bekommen und sieht Seite und Anzeigen auf seiner Schritte-Seite.' };
  }
  if (aktion === 'gewinnspiel') {
    if (!regelModul_(k).regeln.verlosung) return { ok: false, meldung: 'Für dieses Studio sind Gewinnspiele in der Werbung nicht erlaubt.' };
    if (txt(d.gewinn).length < 5) return { ok: false, meldung: 'Bitte die Gewinne eintragen.' };
    if (/botox|kostenlos.*behandlung.*ärzt/i.test(txt(d.gewinn))) return { ok: false, meldung: 'Diesen Gewinn bitte anders formulieren.' };
    var gwl = txt(d.gewinn).split(/\n|\s\/\s|\/\s*$/m).map(function (x) { return x.replace(/^[-•*\s]+/, '').replace(/[\s\/,;]+$/, '').trim(); }).filter(String);
    if (!regelModul_(k).regeln.rabatt && gwl.some(function (x) { return /%|rabatt|gutschein/i.test(x); })) return { ok: false, meldung: 'Für dieses Studio sind Rabatte als Gewinn nicht erlaubt.' };
    kundeSetzen_(kz, { 'Gewinn': gwl.join(' • '), 'Gewinnspiel ab': k.gsAb || new Date(new Date().setHours(0, 0, 0, 0)), 'Teilnahmeschluss': '', 'Ziehung am': '' });
    cacheLeeren_(kunde_(kz));
    return { ok: true, meldung: 'Gespeichert. Das Banner auf der Terminseite zeigt die Gewinne sofort. Für neue Anzeigen: den Text für Claude schicken. „Gewinnspiel-Kampagne für ' + kz + '“.' };
  }
  if (aktion === 'gewinnspiel-aus') {
    kundeSetzen_(kz, { 'Gewinn': '', 'Gewinnspiel ab': '', 'Teilnahmeschluss': '', 'Ziehung am': '' });
    cacheLeeren_(kunde_(kz));
    return { ok: true, meldung: 'Gewinnspiel beendet.' };
  }
  if (aktion === 'erinnern') {
    studiosNachfassen_(s, jetzt, kz);
    return { ok: true, meldung: 'Erinnerung ist raus.' };
  }
  if (aktion === 'live' || aktion === 'fortsetzen') {
    kundeSetzen_(kz, { 'Status': 'Live' });
    liveMails_(s, jetzt);
    return { ok: true, meldung: aktion === 'live' ? 'Live! Die Mail „Ihre Werbung läuft“ ist an das Studio raus.' : 'Wieder live.' };
  }
  if (aktion === 'pausieren') {
    kundeSetzen_(kz, { 'Status': 'Pausiert' });
    return { ok: true, meldung: 'Pausiert. Die Seite nimmt keine Buchungen mehr an. Kampagnen bitte auch in Meta und Google pausieren.' };
  }
  if (aktion === 'bezahlt') {
    var rg = tabelle_('Rechnungen'), z = rg.zeilen.filter(function (x) { return String(rg.get(x, 'Nr.')) === txt(d.nr) && String(rg.get(x, 'Kürzel')) === kz; })[0];
    if (!z) return { ok: false, meldung: 'Rechnung nicht gefunden.' };
    rg.set(z, 'Bezahlt am', jetzt);
    return { ok: true, meldung: 'Rechnung ' + txt(d.nr) + ' ist als bezahlt eingetragen.' };
  }
  if (aktion === 'report') {
    var vm = vormonat_(jetzt), schl = 'report_' + kz + '_' + monatSchluessel_(vm.start), props = PropertiesService.getScriptProperties();
    if (props.getProperty(schl)) return { ok: true, meldung: 'Schon gesendet.' };
    var meta = zahl_(d.meta), google = zahl_(d.google);
    if (txt(d.meta) === '' || txt(d.google) === '') return { ok: false, meldung: 'Bitte beide Werbekosten eintragen (0, wenn nichts lief).' };
    var wk = tabelle_('Werbekosten'), wz = wk.zeilen.filter(function (x) { var m = datum_(wk.get(x, 'Monat')); return wk.get(x, 'Kunde') === kz && m && gleicherMonat_(m, vm.start); })[0];
    if (wz) { wk.set(wz, 'Meta €', meta); wk.set(wz, 'Google €', google); }
    else zeileAnhaengen_(wk, { 'Monat': vm.start, 'Kunde': kz, 'Meta €': meta, 'Google €': google });
    var z2 = zahlen_(tabelle_('Termine'), tabelle_('Werbekosten'), kz, vm);
    var text = reportText_(k, z2, vm, s, { geaendert: txt(d.geaendert), naechstes: txt(d.naechstes), brauchen: txt(d.brauchen) });
    mail_(s, { to: k.email, cc: betreuerMail_(k, s), antwortAn: betreuerMail_(k, s), absender: (k.betreuer ? k.betreuer + ' · ' : '') + (s.agentur_name || 'Clickculture'),
      subject: 'Ihr Monatsreport ' + monatName_(vm.start), html: rahmen_('<div style="font-size:15px;white-space:pre-wrap;">' + esc_(text) + '</div>') });
    props.setProperty(schl, datumText_(jetzt, s));
    return { ok: true, meldung: 'Report ist an ' + k.email + ' raus. Am besten noch kurz anrufen (10 Minuten).' };
  }
  return { ok: false, meldung: 'Unbekannte Aktion.' };
}


// ---------------------------------------------------------------- Rechnungen von selbst

/** Legt eine Zeile im Blatt „Rechnungen“ an (nicht doppelt) und schickt sie, wenn eingestellt, als PDF an das Studio. */
function rechnungAnlegen_(k, s, posten, zeitraum, netto) {
  if (!k || !(Number(netto) > 0)) return null;
  var sh = blattSicher_('Rechnungen', ['Kürzel']), rg = tabelle_('Rechnungen');
  var schon = rg.zeilen.some(function (z) { return String(rg.get(z, 'Kürzel')) === k.kuerzel && String(rg.get(z, 'Posten')) === posten && String(rg.get(z, 'Zeitraum')) === zeitraum; });
  if (schon) return null;
  var r = 0;
  for (var i = 0; i < rg.zeilen.length; i++) if (!rg.get(rg.zeilen[i], 'Datum')) { r = rg.zeilen[i].nr; break; }
  if (!r) r = sh.getLastRow() + 1;
  var setz = function (h, v) { sh.getRange(r, rg.kopf[h] + 1).setValue(v); };
  setz('Datum', new Date());
  setz('Kunde (Firma)', k.firma || k.betrieb);
  setz('Anschrift Kunde', k.adresse);
  setz('Posten', posten);
  setz('Zeitraum', zeitraum);
  setz('Netto €', Number(netto));
  setz('Kürzel', k.kuerzel);
  SpreadsheetApp.flush();
  var nr = String(sh.getRange(r, rg.kopf['Nr.'] + 1).getDisplayValue() || '');
  if (!nr || /^#/.test(nr)) { nr = new Date().getFullYear() + '-' + ('00' + (r - 1)).slice(-3); setz('Nr.', nr); }
  var fehlt = rechnungFehlt_(s);
  if (!rechnungAutomatisch_(s)) {
    betreuerHinweis_(k, s, 'Rechnung ' + nr + ' für ' + k.betrieb + ' angelegt: bitte schicken',
      '<p>Im Blatt „Rechnungen“ steht die Rechnung <b>' + esc_(nr) + '</b> (' + esc_(posten) + ', ' + euro_(netto) + ' netto).</p>' +
      (fehlt.length ? '<p>Automatisch schicken geht noch nicht: in „Einstellungen“ fehlt ' + fehlt.join(', ') + '.</p>' : '') +
      '<p>PDF: Blatt „Rechnung drucken“ → Nummer eintragen → Datei → Herunterladen → PDF.</p>');
    return nr;
  }
  try {
    var pdf = rechnungPdf_(nr);
    mail_(s, { to: k.email, cc: betreuerMail_(k, s), antwortAn: betreuerMail_(k, s), absender: s.agentur_name || 'Clickculture',
      subject: 'Rechnung ' + nr + ' · ' + posten + (zeitraum !== 'einmalig' ? ' ' + zeitraum : ''),
      html: rahmen_('<p>Hallo ' + esc_(k.anrede) + ',</p><p>anbei die Rechnung ' + esc_(nr) + ' für ' + esc_(posten) + (zeitraum !== 'einmalig' ? ' (' + esc_(zeitraum) + ')' : '') +
        '. Zahlbar innerhalb von 14 Tagen.</p><p>Vielen Dank!<br>' + esc_(s.agentur_name || '') + '</p>'),
      anhang: [pdf] });
  } catch (e) {
    fehler_('Rechnung als PDF ' + nr, e);
  }
  return nr;
}

function rechnungFehlt_(s) { return ['agentur_steuernr', 'agentur_iban', 'agentur_anschrift'].filter(function (x) { return !String(s[x] || '').trim(); }); }
function rechnungAutomatisch_(s) { return /^ja/i.test(String(s.rechnungen_automatisch || 'Ja')) && !rechnungFehlt_(s).length; }

function rechnungPdf_(nr) {
  var ss = SpreadsheetApp.getActive(), dr = ss.getSheetByName('Rechnung drucken');
  dr.getRange(1, 3).setValue(nr);
  SpreadsheetApp.flush();
  var url = 'https://docs.google.com/spreadsheets/d/' + ss.getId() + '/export?format=pdf&gid=' + dr.getSheetId() +
    '&range=B3:E31&size=A4&portrait=true&fitw=true&gridlines=false&printtitle=false&sheetnames=false&pagenum=UNDEFINED&fzr=false&top_margin=0.8&left_margin=0.8&right_margin=0.6';
  var antwort = UrlFetchApp.fetch(url, { headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() }, muteHttpExceptions: true });
  if (antwort.getResponseCode() !== 200) throw new Error('PDF-Export: HTTP ' + antwort.getResponseCode());
  return antwort.getBlob().setName('Rechnung ' + nr + '.pdf');
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
    set: function (z, sp, v) {
      var i = spalte(sp), zelle = sh.getRange(z.nr, i + 1);
      if (TEXT_SPALTEN.indexOf(sp) >= 0) zelle.setNumberFormat('@');
      zelle.setValue(v); z.w[i] = v;
    }
  };
}

var TEXT_SPALTEN = ['Telefon', 'PLZ', 'Telefon oder E-Mail', 'Kalender-Eintrag', 'Betreuer Telefon', 'Pixel-ID', 'Google-Ads-ID'];

/** Schreibt in die erste wirklich leere Zeile. Vorbereitete Zeilen mit Formeln (z. B. „Erster Auftrag“) zählen als leer, ihre Formeln bleiben. */
function zeileAnhaengen_(tab, werte) {
  var z = zeileNachKopf_(tab, werte), r = 0, alt = null;
  var felder = Object.keys(werte).filter(function (h) { return tab.kopf[h] !== undefined; });
  for (var i = 0; i < tab.zeilen.length; i++) {
    var zz = tab.zeilen[i];
    if ((zz.w[0] === '' || zz.w[0] == null) && felder.every(function (h) { return tab.get(zz, h) === ''; })) { r = zz.nr; alt = zz; break; }
  }
  if (!r) r = tab.sh.getLastRow() + 1;
  var bereich = tab.sh.getRange(r, 1, 1, z.length), formeln = bereich.getFormulas ? bereich.getFormulas()[0] : [];
  formeln.forEach(function (f, j) { if (f && (z[j] === '' || z[j] == null)) z[j] = f; });
  TEXT_SPALTEN.forEach(function (h) { if (tab.kopf[h] !== undefined) tab.sh.getRange(r, tab.kopf[h] + 1).setNumberFormat('@'); });
  bereich.setValues([z]);
  if (alt) alt.w = z; else tab.zeilen.push({ nr: r, w: z });
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
    var g = function (sp) { return t.kopf[sp] === undefined ? '' : t.get(z, sp); };
    var modus = /wunsch/i.test(String(g('Buchung'))) ? 'Wunschtermin' : 'Kalender';
    var status = String(g('Status')).trim() || 'Angelegt';
    return {
      status: status, zeile: z, token: String(g('Token')).trim(), inhaber: String(g('Inhaber')).trim(),
      kuerzel: String(g('Kürzel')).trim().toLowerCase(), betrieb: String(g('Betrieb')) || String(g('Kürzel')),
      anrede: String(g('Anrede für Mails')) || 'zusammen', email: String(g('E-Mail für Termine')).trim(),
      telefon: telLesen_(g('Telefon')), adresse: String(g('Adresse')), seite: String(g('Seiten-Adresse')).trim().replace(/\/+$/, ''),
      drive: String(g('Drive-Ordner')).trim(), gebuehr: zahl_(g('Monatsgebühr €')), live: datum_(g('Live seit')),
      aktiv: !/pausiert|beendet/i.test(status) && !!String(g('E-Mail für Termine')).trim(),
      behandlung: String(g('Behandlung')), modus: modus, kalender: String(g('Kalender-ID')).trim(),
      zeiten: String(g('Buchbare Zeiten')), leistungen: leistungenLesen_(g('Leistungen')),
      puffer: Number(g('Puffer Minuten')) || 0, vorlauf: g('Vorlauf Stunden') === '' ? 12 : Number(g('Vorlauf Stunden')) || 0,
      tage: Number(g('Tage im Voraus')) || 21, raster: Number(g('Takt Minuten')) || 0, absagefrist: Number(g('Absagefrist Stunden')) || 0, ausfall: String(g('Ausfallregel')),
      vorbereitung: String(g('Vorbereitung')),
      schluss: datum_(g('Teilnahmeschluss')), ziehung: datum_(g('Ziehung am')), betreuer: String(g('Betreuer')).trim(),
      betreuerTelefon: telLesen_(g('Betreuer Telefon')), behandlerArt: String(g('Behandler-Art')).trim(), provision: zahl_(g('Provision %')), betreuerMail: String(g('Betreuer E-Mail')).trim(),
      firma: String(g('Firma')).trim(), onboarding: zahl_(g('Onboarding €')), angelegt: datum_(g('Angelegt am')),
      vertrag: datum_(g('Vertrag angenommen')), impressum: String(g('Impressum')).trim(), datenschutz: String(g('Datenschutz')).trim(),
      behandlerName: String(g('Behandler')).trim(), vorbereitungOk: datum_(g('Vorbereitung ok')), fotos: Number(g('Fotos')) || 0,
      kalenderOk: datum_(g('Kalender ok')), metaOk: datum_(g('Meta erledigt')), werbekonto: String(g('Werbekonto-ID')).replace(/\D/g, ''), metaFertig: datum_(g('Meta fertig')),
      seiteBestaetigen: /ja/i.test(String(g('Seite bestätigen'))), karteOk: datum_(g('Karte ok')), googleId: String(g('Google-Ads-ID')).trim(),
      googleOk: datum_(g('Google verknüpft')), erinnert: datum_(g('Erinnert am')), erinnerungen: Number(g('Erinnerungen')) || 0,
      allesDa: datum_(g('Alles da')), liveMail: datum_(g('Live-Mail')), pixel: String(g('Pixel-ID')).replace(/\D/g, ''),
      conversion: String(g('Google-Conversion')).trim(), vorschau: datum_(g('Vorschau gesendet')), freigabe: datum_(g('Freigabe')),
      aenderung: String(g('Änderungswunsch')).trim(), hinweise: jsonLesen_(g('Hinweise je Leistung')), nk: { text: String(g('Neukundenangebot')).trim(), leistung: String(g('Angebot Leistung')).trim(), normal: String(g('Angebot Normalpreis')).trim(), bis: datum_(g('Angebot bis')) },
      gewinn: String(g('Gewinn')).trim(), gsLeistungen: String(g('Gewinnspiel Leistungen')).split('•').map(function (x) { return x.trim(); }).filter(String), gsAb: datum_(g('Gewinnspiel ab'))
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
  s.agentur_telefon = telLesen_(s.agentur_telefon);
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
  k.leistungen.forEach(function (l) { schl.push('slots_' + k.kuerzel + '_' + l.minuten); });
  c.removeAll(schl);
}


// ================================================================ Mails und Seiten

function mail_(s, o) {
  var opt = { to: o.to, subject: o.subject, htmlBody: o.html, body: ohneHtml_(o.html),
    name: o.absender || s.agentur_name || 'Clickculture', replyTo: o.antwortAn || s.agentur_email || undefined };
  if (o.anhang) opt.attachments = o.anhang;
  if (o.cc && o.cc !== o.to) opt.cc = o.cc;
  if (o.bcc && o.bcc !== o.to && o.bcc !== o.cc) opt.bcc = o.bcc;
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
