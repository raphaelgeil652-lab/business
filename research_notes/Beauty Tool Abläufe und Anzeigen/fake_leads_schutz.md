# Schutz vor Fake-, Spam- und Sabotage-Leads/-Buchungen (Beauty-Klienten, Meta + Google Ads → LP/Buchung), Stand Nov. 2026

> Hinweis zur Recherche: In dieser Umgebung waren fast alle Primärseiten **nicht abrufbar** (Netzwerk-Allowlist blockierte u. a. docs.netlify.com, cal.com, twilio.com, ppc.land, intercom.help). Alle Belege stammen daher aus **Suchergebnis-Auszügen** (Snippets/Zusammenfassungen der Suchmaschine), nicht aus vollständig gelesenen Seiten. Zahlen deshalb vor Verwendung an der Quelle prüfen. Viele Quellen sind Anbieter-Blogs (ClickCease, Kitomba, Rework, emaillistvalidation) mit eigenem Interesse.

## 1. Bedrohungsmodell: Was kommt vor, wie häufig, was berichten Agenturen?

### Takeaway
Bots/Formular-Spam und „Junk-Leads“ aus Meta-Sofortformularen und Google Performance Max sind gut dokumentierte, alltägliche Probleme; gezielte **Konkurrenz-Sabotage per Fake-Termin** ist dagegen in keiner gefundenen Quelle belegt (nur Anbieter nennen „Fake-Buchungen“ allgemein). Es gibt keine belastbaren Häufigkeitszahlen, auch Google selbst nennt keine.

### Cited Findings
- Google: Invalid-Traffic-Filter fangen viel ab, aber solcher Traffic kann trotzdem Website und Lead-Formulare erreichen; Konkurrenten, die manuell klicken, um Kosten zu treiben, sind eine anerkannte Form von Invalid Traffic. Ungültige Aktivität vor Rechnungsstellung wird nicht berechnet, Untersuchung für die letzten 60 Tage beantragbar — [Google Ads Hilfe: About invalid traffic](https://support.google.com/google-ads/answer/11182074)
- Ziele wie „qualified lead“/„request quote“ lösen laut Google-Doku automatisch spezielle Invalid-Traffic-Schutzmechanismen für Lead-Gen aus; **Google veröffentlicht keine Daten, wie oft ungültige Leads vorkommen** — [PPC Land (Snippet, nicht abrufbar)](https://ppc.land/google-ads-filters-miss-fake-leads-so-advertisers-must-add-3-form-checks/)
- PPC-Berater meldeten „a lot of fake leads“ über Performance Max für Lead-Gen; Googles Ginny Marvin: man arbeite aktiv daran (ca. 2024, **ältere Daten**) — [Search Engine Roundtable](https://seroundtable.com/google-ads-decreasing-invalid-leads-34272.html)
- Häufige Ursache laut Fraud-Anbieter: jede Formular-Absendung als primäre Conversion zählen → Google lernt, dass jede Absendung wertvoll ist; Fake-Leads häufen sich bei bestimmten Suchbegriffen (Anbietersicht) — [ClickCease Blog](https://www.clickcease.com/blog/?p=10719); [ClickCease: PMax invalid lead traffic](https://www.clickcease.com/blog/?p=11024)
- Meta-Sofortformulare: Nutzer melden Leads, die „das Formular nie ausgefüllt haben“ (vorausgefüllte Daten, Fehlklicks) — [upGrowth](https://upgrowth.in/facebook-lead-ads-fake-leads-never-filled-form/); [LeadsBridge](https://leadsbridge.com/blog/fake-leads-from-facebook-ads/); [ClickCease: stop fake leads on Meta](https://www.clickcease.com/blog/how-do-i-stop-fake-leads-on-meta-ads/)
- Netlify-Formulare: trotz Honeypot + reCAPTCHA berichten Nutzer von plötzlichen Spam-Spitzen — [Netlify Forum](https://answers.netlify.com/t/sudden-spike-in-spam-on-netlify-forms-honeypot-recaptcha-loumarc-netlify-app/150254); [Netlify Forum: Constant stream of spam](https://answers.netlify.com/t/constant-stream-of-spam-from-netlify-form-submissions/42396)
- Calendly-Community: zahlreiche Threads zu Spam-/Fake-Buchungen, die Kalender verstopfen — [Calendly Community: drastic increase in spam bookings](https://community.calendly.com/how-do-i-40/drastic-increase-in-spam-bookings-clogging-up-calendar-3493); [fake appointments](https://community.calendly.com/how-do-i-40/fake-appointments-4539)
- Beauty-Buchungssoftware Beautinda hat einen eigenen Hilfeartikel „Absicherung vor No-Shows, kurzfristigen Absagen, Fake-Buchungen“ (Maßnahmen: Anzahlung, vollständige Kundendaten, keine Barzahlung, strenge Stornoregeln) — [Beautinda Hilfe (Snippet)](https://intercom.help/beautinda-gmbh/de/articles/13229936-absicherung-vor-nichterscheinen-no-shows-kurzfristigen-absagen-fake-buchungen)
- No-Show-Basisrate in Beauty laut Anbieter 10–20 % (ohne Primärquelle) — [Rework](https://resources.rework.com/libraries/beauty-center-growth/no-show-cancellation-management)

### Inferences
- Für einen Beauty-Klienten ist das realistische Problem in dieser Reihenfolge: (1) Junk-Leads aus Meta-Sofortformularen (falls genutzt), (2) Tippfehler/unerreichbare Nummern und E-Mails, (3) No-Shows echter Personen, (4) Bot-Spam auf der LP, (5) Konkurrenz-Sabotage (selten, aber am schädlichsten, weil sie Slots blockiert). Gegen (5) wirken dieselben Maßnahmen wie gegen (3): Bestätigungspflicht + Anzahlung.
- Weil die Agentur Landingpages statt Sofortformulare nutzt, ist Junk aus vorausgefüllten Meta-Formularen weniger relevant; Bots und Tippfehler werden relevanter.

### Gaps
- Keine unabhängige Zahl zur Häufigkeit von Fake-Leads (Anteil an allen Leads) gefunden; keine Quelle belegt konkret Konkurrenz-Sabotage per Fake-Termin in Deutschland.
- Keine Reddit-Threads (r/PPC, r/FacebookAds) in den Suchergebnissen.

## 2. Maßnahmen und Belege (Wirkung, Reibung, Kosten, Aufwand)

### Takeaway
Die stärksten, belegten Filter sind (a) **Bestätigungs-/Verifizierungspflicht vor dem festen Slot** (E-Mail-Code/-Link; Standard bei Cal.com und Calendly) und (b) **Anzahlung**; Honeypot/Akismet/Turnstile sind billige Grundschutz-Schichten gegen Bots, helfen aber nicht gegen Menschen. Auf der Werbeseite wirkt **Rückmeldung der Lead-Qualität** (Meta CAPI für CRM, Google: qualifizierte Leads als Conversion) gegen die Ursache.

### Cited Findings
**Netlify Forms (vorhanden)**
- Netlify-Doku: alle Absendungen werden mit **Akismet** gefiltert; nur bestandene erscheinen unter „Verified“, Akismet-Treffer unter „Spam“. Honeypot per `netlify-honeypot`-Attribut (verdecktes Feld, gefüllt → stilles Verwerfen); reCAPTCHA per `data-netlify-recaptcha="true"`; Honeypot-/reCAPTCHA-Treffer erscheinen nicht einmal im Spam-Tab — [Netlify Docs: Spam filters (Snippet)](https://docs.netlify.com/manage/forms/spam-filters/)
- Widerspruch: ein Netlify-Blogpost enthält den Satz, man habe „decided to remove this feature“; die aktuelle Doku beschreibt Akismet aber als aktiv → Doku gilt — [Netlify Blog 2019 (Akismet)](https://www.netlify.com/blog/2019/02/12/improved-netlify-forms-spam-filtering-using-akismet/); [Netlify Blog 2019: Spam management](https://netlify.com/blog/2019/05/21/spam-management-for-netlify-forms/)
- Akismet lässt sich laut Netlify-Mitarbeiter nicht abschalten; echte Anfragen landen teils im Spam (False Positives) — [Netlify Forum: Genuine submissions flagged as spam](https://answers.netlify.com/t/genuine-form-submissions-getting-flagged-as-spam/14127)
- hCaptcha ist in Netlify Forms nur Feature-Wunsch, nicht eingebaut (Snippet) — [Netlify Forum](https://answers.netlify.com/t/sudden-spike-in-spam-on-netlify-forms-honeypot-recaptcha-loumarc-netlify-app/150254)

**Cloudflare Turnstile**
- Kostenlos für alle; Free-Plan laut Quellen bis 10–20 Widgets, 10 Hostnamen/Widget, teils 1 Mio. siteverify/Monat genannt (Quellen widersprechen sich) — [Cloudflare Blog: Turnstile GA](https://blog.cloudflare.com/turnstile-ga/); [Cloudflare Turnstile Plans](https://developers.cloudflare.com/turnstile/plans); [Piano Docs](https://docs.piano.io/en/subscriptions/cloudflare-turnstile)
- Token muss **serverseitig** über siteverify geprüft werden (nicht im Frontend, sonst Secret offen / umgehbar); Token einmalig gültig, verfällt nach 300 s — [Cloudflare Turnstile FAQ](https://developers.cloudflare.com/turnstile/frequently-asked-questions)

**Meta Lead Ads**
- Formulartyp „Höhere Absicht“ (Higher Intent) fügt einen Überprüfungsbildschirm vor dem Absenden ein; weniger, aber qualifiziertere Leads; stoppt aber keine absichtlich falschen Angaben — [Medium-Guide](https://medium.com/@aquib.9011/how-to-build-a-facebook-instant-form-that-filters-out-everyone-who-isnt-serious-d1270f6ae4fe); [LeadEnforce](https://leadenforce.com/blog/about-lead-ads-with-instant-form-how-to-improve-lead-quality); [Socinova](https://socinova.com/discussions/reduce-fake-leads-meta-ads/)
- Anbieterzahl „20–40 % weniger Volumen, 70–85 % Kontaktquote“ ohne Datenbasis → unbelegt — [upGrowth](https://upgrowth.in/facebook-lead-ads-fake-leads-never-filled-form/)
- **Conversion Leads / CAPI für CRM:** CRM-Stufen werden an Meta zurückgemeldet, damit der Algorithmus auf echte Kunden optimiert; nur für Sofortformulare kompatibel; Zielstufe mit ca. 1–40 % Conversionrate; Lead-ID speichern; 2–4 Wochen Lernphase — [Meta Developers: Conversions API for CRM](https://developers.facebook.com/docs/marketing-api/conversions-api/conversion-leads-integration); [Zapier: Meta guide to better lead quality](https://www.zapier.com/blog/meta-guide-to-better-lead-quality/)
- Meta-Angabe: CAPI für CRM → im Schnitt ca. **21 % niedrigere Kosten pro Qualitäts-Lead** (Sofortformulare) und 9,5 % (Website-Formulare); A/B-Test mit 1.031 Werbetreibenden, 28.07.–11.08.2025 (Herstellerzahl) — [Make Blog (Juni 2026)](https://www.make.com/en/blog/meta-make-conversions-api-for-crm)

**Google Ads**
- Empfehlung (Anbietersicht): nicht auf rohe Absendungen optimieren, sondern CRM-qualifizierte Ereignisse (gültiger/gebuchter Lead) importieren; Formular-Checks: Wegwerf-E-Mail-Erkennung, ungültige Telefonnummern, Duplikate, IP-Reputation; negative Keywords bei Häufung — [ClickCease](https://www.clickcease.com/blog/?p=10719); [PPC Land](https://ppc.land/google-ads-filters-miss-fake-leads-so-advertisers-must-add-3-form-checks/)

**Buchungsbestätigung / Verifizierung**
- Cal.com: Schalter „Requires Booker Email Verification“ je Ereignistyp (Tab „Erweitert“, direkt unter „Requires Confirmation“); API v2 hat Endpunkte „Prüfen ob Verifizierung nötig“, „Code senden“, „Code verifizieren“ (E-Mail-Einmalcode) — [Cal.com Blog: Verification features](https://cal.com/blog/elevating-booking-authenticity-on-cal-com-a-guide-to-cal-com-s-verification-featu); [Cal.com API: Send email verification code](https://cal.com/docs/api-reference/v2/bookings--email-verification/send-email-verification-code); [Guideflow-Anleitung](https://www.guideflow.com/tutorial/how-to-enable-booker-email-verification-in-calcom)
- Calendly: E-Mail-Verifizierung für Ereignistypen in **allen Tarifen**; jede Buchung läuft durch reCAPTCHA v3, nur als Spam markierte sehen eine Challenge; Personen lassen sich nur nachträglich blockieren; kein eigenes Captcha — [Calendly Help: Require email verification](https://calendly.com/help/how-to-require-email-verification-for-event-types.html); [Calendly Help: Abuse prevention](https://calendly.com/help/abuse-prevention); [Calendly Community: captcha](https://community.calendly.com/how-do-i-40/adding-a-captcha-to-my-booking-page-2295)
- Booksy: Buchungen bestätigen lassen oder bestimmte Personen blockieren — [Booksy Kalender](https://biz.booksy.com/de-de/funktionen/kalender-terminplanung)
- Doctolib: Buchung nur mit Konto (kein Gast), Konto-Bestätigung per E-Mail, 2FA; SMS-Einmalcode zur Profilverifizierung (Anbieter-Fallstudie smsmode) — [netzpolitik.org](https://netzpolitik.org/2024/doctolib-wachsender-riese-im-gesundheitsdatenmarkt/); [smsmode Fallstudie](https://www.smsmode.com/en/send-confirmation-appointment-by-sms-doctolib/)

**Anzahlung**
- Kitomba (eigene Daten): Salons mit 100 % Anzahlung haben **29 % weniger** Absagen/No-Shows als Salons ohne Anzahlung — [Kitomba](https://www.kitomba.com/blog/deposits-vs-cancellation-fees-salons/)
- Rework: Anzahlung nur für Neukunden senkt No-Shows „um bis zu 50 %“ ohne nennenswerten Conversion-Verlust; Erinnerungen allein −30–40 % (ohne Primärquelle) — [Rework](https://resources.rework.com/libraries/beauty-center-growth/no-show-cancellation-management)
- Beautinda: Anzahlung für alle oder nur Neukunden einstellbar, bei No-Show/später Absage einbehalten — [Beautinda: Anzahlung für Onlinebuchungen (Snippet)](https://intercom.help/beautinda-gmbh/de/articles/10511339-anzahlung-fur-onlinebuchungen)
- Rechtlich (DE): Ausfallgebühren/Einbehalt nur durchsetzbar, wenn bei der Buchung wirksam (AGB) vereinbart — [Verbraucherzentrale Niedersachsen](https://www.verbraucherzentrale-niedersachsen.de/themen/kaufen-reklamieren/ausfallgebuehr-no-show-gebuehr-was-ist-das-muessen-sie-sie-bezahlen); [Sparkasse](https://www.sparkasse.de/aktuelles/verpasste-termine-kosten.html)

**SMS-OTP – Kosten**
- Twilio Verify: 0,05 $ pro erfolgreicher Verifizierung + Kanalgebühr (Seite „Stand Okt. 2026“); Twilio-SMS nach Deutschland laut DE-Preisseite ca. 0,112 $ (Tabellenlayout unklar), Drittanbieter nennt 0,0582 € — [Twilio Verify pricing](https://www.twilio.com/en-us/user-authentication-identity/pricing/verify); [Twilio SMS pricing DE](https://www.twilio.com/de-de/sms/pricing/de); [sent.dm](https://www.sent.dm/en/resources/sms-pricing/germany-sms-pricing)
- seven.io (Deutschland): Pay-per-Use, Verzeichnisangabe 0,075 € pro SMS weltweit (nicht von seven selbst, evtl. veraltet); >160 Zeichen bzw. Unicode (70 Zeichen) = mehrere Teil-SMS — [european-alternatives.eu](https://european-alternatives.eu/de/produkt/seven); [seven.io Preise](https://seven.io/prices)
- Twilio: auch fehlgeschlagene SMS-Versuche werden berechnet — [Authgear: Twilio Verify Pricing 2026](https://www.authgear.com/post/twilio-verify-pricing-and-alternatives)

### Inferences
**Rangliste (Wirkung gegen „nur echte, erreichbare Menschen im Kalender“ × Reibung × Kosten × Aufwand im bestehenden Stack):**
1. **Slot erst nach Bestätigung fest** (E-Mail-Link/-Code; vorgemerkter Slot 30–60 Min., dann frei). Hohe Wirkung gegen Bots, Tippfehler-E-Mails und Sabotage mit fremden Adressen; mittlere Reibung (E-Mail-DOI: 65–90 % bestätigen, s. Abschnitt 4); Kosten 0; Aufwand gering in Cal.com (Schalter), mittel in Apps Script. Standard bei Cal.com/Calendly → branchenüblich.
2. **Anzahlung (z. B. 20–50 € für Neukunden, verrechnet)** über Stripe/PayPal-Link. Stärkster Filter gegen Sabotage und No-Shows (Kitomba −29 %), aber höchste Reibung; braucht AGB-Klausel. Für hochpreisige Behandlungen (Botox, Laser-Paket, PMU) gut vertretbar; für kostenlose Erstberatung eher nicht.
3. **Grundschutz gegen Bots**: Netlify-Honeypot (schon da) + Akismet (automatisch) + Zeitfalle (Absendung < ~3 s verwerfen) + Turnstile (unsichtbar, kostenlos, mit serverseitiger Prüfung in Apps Script/Netlify Function). Kaum Reibung, Kosten 0.
4. **Plausibilitätsprüfung in der Zentrale**: Telefonformat (DE-Mobil/Festnetz), Wegwerf-E-Mail-Liste, Duplikate (gleiche Nummer/E-Mail), max. 1 offene Buchung pro Nummer/E-Mail. Keine Reibung für Echte, geringer Aufwand.
5. **Schneller Rückruf/Bestätigungsanruf durch die Praxis** + Erinnerung 24 h vorher mit „bestätigen oder Termin wird freigegeben“. Fängt Fake-Nummern spätestens beim Anruf; Erinnerungen senken No-Shows.
6. **SMS-OTP**: sehr wirksam gegen Fake-Nummern, aber Kosten (~0,06–0,11 € je SMS, bei Twilio Verify zzgl. 0,05 $), Auftragsverarbeiter, Aufwand; nur bei echtem Problem.
7. **Werbeseitig**: Google-Conversion erst auf „bestätigte Buchung“ statt Formularabsendung; bei Meta-Sofortformularen „Höhere Absicht“ + CAPI-Rückmeldung. Wirkt mittelfristig auf die Quelle.
8. **Sperrliste** (Nummern/E-Mails/IPs) – reaktiv, sobald Muster auftreten.

### Gaps
- Kein abrufbarer Beleg zu libphonenumber-Prüfung, HLR-Lookup-Preisen in DE, MX-Check-Wirksamkeit oder Wegwerf-E-Mail-Listen (nur Erwähnung bei ClickCease).
- Kein Beleg zu Treatwell-Mechanik (Karte bei Buchung?), MessageBird/Bird-Preisen, WhatsApp-Bestätigung (Business-API-Kosten).
- Keine Quelle zur Integration von SMS-APIs in Google Apps Script gefunden (technisch per UrlFetchApp naheliegend, aber unbelegt).
- Google-Ads-Lead-Formular vs. Landingpage hinsichtlich Spam: keine Vergleichsdaten gefunden.

## 3. Was nutzen seriöse Buchungstools?

### Takeaway
Der Branchenstandard ist **E-Mail-Verifizierung + unsichtbares Captcha + optional manuelle Bestätigung/Blockliste**; Beauty-spezifische Tools ergänzen **Anzahlung (oft nur Neukunden)**; Doctolib setzt auf Pflichtkonto mit E-Mail-Bestätigung und SMS-Codes.

### Cited Findings
- Cal.com: „Requires Booker Email Verification“ + „Requires Confirmation“ je Ereignistyp — [Cal.com Blog](https://cal.com/blog/elevating-booking-authenticity-on-cal-com-a-guide-to-cal-com-s-verification-featu)
- Calendly: E-Mail-Verifizierung (alle Tarife), reCAPTCHA v3, Blockieren nachträglich — [Calendly Help](https://calendly.com/help/abuse-prevention)
- Booksy: Bestätigung + Personen blockieren — [Booksy](https://biz.booksy.com/de-de/funktionen/kalender-terminplanung)
- Beautinda: Anzahlung (alle/Neukunden), vollständige Kundendaten, keine Barzahlung, Stornoregeln — [Beautinda](https://intercom.help/beautinda-gmbh/de/articles/13229936-absicherung-vor-nichterscheinen-no-shows-kurzfristigen-absagen-fake-buchungen)
- Doctolib: kein Gastbuchen, Konto mit E-Mail-Bestätigung, 2FA/SMS-OTP — [netzpolitik.org](https://netzpolitik.org/2024/doctolib-wachsender-riese-im-gesundheitsdatenmarkt/); [smsmode](https://www.smsmode.com/en/send-confirmation-appointment-by-sms-doctolib/)

### Inferences
- Ein selbst gebautes System sollte mindestens Cal.com-Niveau erreichen: E-Mail-Bestätigung vor festem Slot + Bot-Schutz + Blockliste. Cal.com liefert das per Schalter; Selbstbau in Apps Script lohnt nur, wenn Cal.com aus anderen Gründen ausscheidet.

### Gaps
- Treatwell-Verfahren nicht belegt; ob Cal.com SMS-Verifizierung für Bucher anbietet, nicht belegt.

## 4. Conversion-Verlust je Reibungsstufe

### Takeaway
Belastbare Zahlen gibt es nur für E-Mail-Double-Opt-in (Newsletter-Kontext): **ca. 65–90 % bestätigen**, also 10–35 % Verlust; für SMS-OTP und Anzahlung bei Terminbuchungen fanden sich keine unabhängigen Zahlen.

### Cited Findings
- DOI: Bestätigungsrate 65–90 % je nach Branche (HubSpot-Community) — [HubSpot Community](https://community.hubspot.com/t5/Email-Deliverability/Benchmark-for-Double-Opt-in/td-p/506332)
- DOI senkt Listenwachstum typischerweise um 15–30 %; ~70 % schließen die Bestätigung ab (Anbieter, unbelegt) — [emaillistvalidation](https://emaillistvalidation.com/blog/double-opt-in-growth-impact/)
- Studie (GetResponse): über 23 % bestätigten die E-Mail im zweiten Schritt nicht — [GetResponse](https://www.getresponse.com/blog/new-research-epic-battle-double-single-opt)
- Anzahlung für Neukunden: „ohne nennenswerten Einfluss auf Buchungs-Conversion“ (unbelegt, Anbieter) — [Rework](https://resources.rework.com/libraries/beauty-center-growth/no-show-cancellation-management)

### Inferences
- Bei einer Terminbuchung (konkretes Eigeninteresse, Bestätigung sofort im Postfach) dürfte die Bestätigungsrate eher am oberen Ende liegen als bei Newsletter-DOI; das ist eine Annahme, keine Messung. Ein **6-stelliger Code auf derselben Seite** (wie Cal.com) hält den Nutzer im Fluss und dürfte weniger verlieren als ein Link in einer Mail.
- Für den Klienten zählt nicht die Lead-Zahl, sondern erschienene Termine: ein Verlust von 10–25 % unbestätigter Buchungen enthält überproportional Fakes/Tippfehler, die sonst Slots und Rückrufzeit kosten.

### Gaps
- Keine Zahlen zu SMS-OTP-Abbruchquoten, zu Anzahlungs-Abbruch bei Beauty-Erstterminen oder zum Verlust durch „Höhere Absicht“ bei Meta (nur unbelegte 20–40 %).

## 5. DSGVO-Anforderungen

### Takeaway
Turnstile gilt in deutschen Ratgebern als datenschutzfreundlicher als reCAPTCHA, eine Einwilligungspflicht ist aber **nicht abschließend geklärt**; Cloudflare/Twilio sind US-Anbieter (Standardvertragsklauseln, Erwähnung in der Datenschutzerklärung). Rechtsrat einholen; Quellen sind Ratgeber, keine Urteile.

### Cited Findings
- reCAPTCHA: Berliner Aufsicht – Tools, deren Anbieter Daten auch zu eigenen Zwecken nutzt, nur mit Einwilligung; Einwilligungslösung führt dazu, dass ohne Zustimmung kein Bot-Schutz läuft; Rechtslage uneinheitlich — [Dr. Datenschutz](https://www.dr-datenschutz.de/google-recaptcha-und-der-datenschutz/); [eRecht24: reCAPTCHA](https://www.e-recht24.de/dsg/12667-google-recaptcha.html)
- Google stellt reCAPTCHA ab 02.04.2026 auf ein Auftragsverarbeiter-Modell um (Einzelquelle, Anbieterblog — prüfen) — [captcha.eu](https://www.captcha.eu/?p=3338)
- Turnstile: eRecht24 bietet Datenschutztext; US-Anbieter, Standardvertragsklauseln relevant; Einwilligungsfrage offen — [eRecht24: Cloudflare Turnstile](https://www.e-recht24.de/dsg/13110-cloudflare-turnstile.html); [captcha.eu: Is Turnstile GDPR compliant](https://www.captcha.eu/is-cloudflare-turnstile-gdpr-compliant/); [legalweb](https://legalweb.io/en/gdpr/embeddings_cloudflareturnstile/)
- Odoo-Doku empfiehlt Turnstile statt reCAPTCHA v3, weil Letzteres evtl. nicht mit lokalen Datenschutzregeln vereinbar — [Odoo Docs](https://www.odoo.com/documentation/17.0/de/applications/websites/website/configuration/spam_protection.html)
- Doctolib: Berliner Datenschutzaufsicht kritisierte ungefragte Bestätigungs-SMS/-Mails an Patienten — [Dr. Datenschutz: Doctolib](https://www.dr-datenschutz.de/doctolib-im-fokus-der-aufsichtsbehoerde/); [zm-online](https://www.zm-online.de/news/detail/vorsicht-mit-sms-terminvereinbarungen)

### Inferences
- Bestätigungs-E-Mail/-SMS zur Buchung lässt sich auf Vertragsanbahnung (Art. 6 Abs. 1 lit. b) bzw. berechtigtes Interesse (Missbrauchsschutz, lit. f) stützen; SMS-Anbieter = Auftragsverarbeiter (AVV nötig), EU-Anbieter (seven.io, Sitz DE laut Verzeichnis) vereinfachen das. IP-Speicherung für Rate-Limits kurz halten (z. B. Hash, wenige Tage). Bei Ästhetik-/Zahnbehandlungen können Formularangaben Gesundheitsdaten (Art. 9) sein → Formular schlank halten. **Alles juristisch nicht belegt, Prüfung durch Anwalt/DSB.**

### Gaps
- Keine deutsche Rechtsquelle speziell zu SMS-Verifizierung, Speicherdauer von IPs für Spam-Schutz oder Art.-9-Einordnung von Beauty-Anfragen gefunden.

## 6. Empfohlene Stufen (Default vs. nur bei Bedarf)

### Takeaway
Ab Tag 1 kostenlose, reibungsarme Schichten plus Bestätigungspflicht vor festem Slot; Anzahlung und SMS-OTP erst, wenn Fake-Buchungen oder No-Shows tatsächlich auftreten (oder von Anfang an bei teuren Behandlungen nur für Neukunden).

### Cited Findings
- Grundlagen siehe Abschnitte 2–5: Honeypot/Akismet ([Netlify Docs](https://docs.netlify.com/manage/forms/spam-filters/)), Turnstile kostenlos mit serverseitiger Prüfung ([Cloudflare FAQ](https://developers.cloudflare.com/turnstile/frequently-asked-questions)), Booker-E-Mail-Verifizierung als Standard ([Cal.com](https://cal.com/blog/elevating-booking-authenticity-on-cal-com-a-guide-to-cal-com-s-verification-featu), [Calendly](https://calendly.com/help/how-to-require-email-verification-for-event-types.html)), Anzahlung −29 % No-Shows ([Kitomba](https://www.kitomba.com/blog/deposits-vs-cancellation-fees-salons/)), CAPI-Qualitätsrückmeldung ([Meta](https://developers.facebook.com/docs/marketing-api/conversions-api/conversion-leads-integration)).

### Inferences
**Stufe 1 – immer, ab Tag 1 (0 € Zusatzkosten):**
- Netlify-Honeypot + Akismet (Spam-Tab wöchentlich sichten wegen False Positives) + Zeitfalle.
- Plausibilität in der Zentrale: Telefonformat, Wegwerf-Domains, Duplikat-Check, max. 1 offene Buchung je Nummer/E-Mail.
- **Termin erst nach Bestätigung fest** (Cal.com: Booker-E-Mail-Verifizierung an; Eigenbau: Slot 30–60 Min. vorgemerkt, Link/Code, sonst frei).
- Erinnerung 24 h vorher mit Bestätigen-/Absagen-Knopf; Rückruf durch die Praxis unter 1 h.
- Werbung: Google-Conversion = bestätigte Buchung (nicht Formularabsendung); Sperrliste führen.

**Stufe 2 – bei ersten Auffälligkeiten (Bot-Spitzen, Fake-Namen):**
- Turnstile (unsichtbar) mit serverseitiger Prüfung; Datenschutzerklärung ergänzen.
- Rate-Limit je IP/Nummer; Meta „Höhere Absicht“, falls Sofortformulare laufen.

**Stufe 3 – bei echten Fake-Buchungen/No-Shows oder teuren Behandlungen:**
- Anzahlung für Neukunden (verrechnet, per AGB vereinbart) über Stripe/PayPal.
- SMS-OTP über EU-Anbieter (seven.io) mit AVV; Kosten grob 0,06–0,11 € je Verifizierung (prüfen).
- Meta CAPI für CRM / Qualitätsrückmeldung, sobald genug Leads (Stufe mit 1–40 % Quote).

### Gaps
- Keine Daten, ab welcher Fake-Quote sich Stufe 3 rechnet; Schwellenwerte (z. B. „>5 % unbestätigte Buchungen“) wären eigene Festlegung, nicht belegt.
