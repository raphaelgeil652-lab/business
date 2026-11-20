# Online-Buchung, Kalender-Sync und Bestätigungs-/Erinnerungs-Mails für Beauty & Ästhetik (DE, Stand Nov. 2026)

Hinweis zur Methode: In dieser Umgebung waren die Primärseiten **developers.google.com, support.google.com und cal.com nicht abrufbar** (Netzwerk-Allowlist, getaddrinfo ENOTFOUND). Alle Angaben unten stammen daher aus Suchergebnis-Auszügen (WebSearch), nicht aus vollständig gelesenen Seiten. Zahlen zu Quoten und Tarifen vor Umsetzung auf den Originalseiten gegenprüfen. Etwa 16 Such-/Abrufversuche.

## 1. Direktbuchung vs. Lead-Formular + Rückruf (Conversion, Show-up, Lead-Qualität)

### Takeaway
Es gibt **keine belastbare Vergleichsstudie** Direktbuchung vs. Formular+Rückruf für Beauty/Ästhetik. Die verfügbaren Zahlen sind US-Med-Spa-Agenturblogs ohne offengelegte Methodik; sie stützen zwei Punkte: (a) nicht Leads, sondern **erschienene Termine** messen, (b) Anzahlung/Deposit gilt als stärkster Show-Rate-Hebel – aber ohne veröffentlichte Daten.

### Cited Findings
- US-Agenturargument: ein 40-$-Lead mit 30 % Show-Rate ist teurer als ein 90-$-Lead mit 85 % Show-Rate; wer nur Lead-Kosten berichtet, entscheidet falsch (US Med Spa, Agenturblog) — [Growbi](https://growbi.co/blog/med-spa-marketing-agency-booked-appointments-myth)
- Benchmark-Zielwerte (US, Agentur): Show-Rate gebuchter Beratungen 80–85 % als Ziel — [DoctorLeadFlow Benchmarks 2026](https://doctorleadflow.com/blog/med-spa-marketing-benchmarks/); Buchungsquote 50–70 % — [Prospyr KPIs](https://prospyrmed.com/blog/post/med-spa-kpis-to-track-benchmark-formulas)
- Gemessene Realität einer US-Agentur: nur **42 %** der gebuchten Beratungen erschienen (48 % bei Kern-Injectables, 67 % bei einer kleineren Gruppe, 0 % bei einem „Education“-Angebot); 162 $ pro Buchung → effektiv 384 $ pro erschienenem Patienten — [DoctorLeadFlow Show-Rate](https://doctorleadflow.com/blog/med-spa-show-rate/)
- Empfehlung (ohne Testdaten): Zwei-Schritt-Flow, der in einem Zeitslot endet, statt langes generisches Kontaktformular — [Sagapixel](https://sagapixel.com/marketing/medical-spa/) / [Aesthetix Media](https://aesthetixmedia.com/blog/med-spa-consultation) (Suchauszug, Zuordnung zu einer der beiden Seiten nicht eindeutig)
- „Deposit capture“ habe den größten Einzeleffekt auf die Show-Rate – ohne veröffentlichte Daten — [Pronk Med Spa Benchmarks 2026](https://pronkmedspamarketing.com/blog/med-spa-digital-marketing-benchmarks/)
- Einziger Fallbericht: Klinik San Diego, Beratung→Buchung 40 % → 71 %, Ursache nicht isoliert — [FrontDesk.care](https://frontdesk.care/resources/guides/medspa-lead-conversion)
- Deutsche Studie (Augenheilkunde, 2025): In der Praxis war die No-Show-Rate bei **online gebuchten** Terminen niedriger als bei offline gebuchten — [Frontiers in Digital Health 2025](https://frontiersin.org/journals/digital-health/articles/10.3389/fdgth.2025.1567397/full)

### Inferences
- Für die Agentur: Hybrid ist am vertretbarsten – Landingpage mit **kurzen Qualifizierungsfragen → Slot-Auswahl → Bestätigung**, plus Fallback „lieber Rückruf“. Direkt-Behandlungstermin nur für risikoarme, standardisierte Leistungen (Laser-Probe-/Testschuss, PMU-Beratung, Bleaching-Beratung); bei Botox/Hyaluron immer **erst Beratung/Aufklärung** (ärztliche Pflicht, siehe Abschnitt 5).
- Reporting-KPI sollte „erschienene Termine“ und „Behandlung durchgeführt“ sein, nicht „Leads“ – passt zum Playbook-Prinzip „Auftrags-Tracking“.
- Die Online-vs-offline-Show-Rate-Beobachtung aus DE ist nur Korrelation (Selbstselektion).

### Gaps
- Keine A/B- oder Kohortenstudie Direktbuchung vs. Formular+Rückruf im Beauty-Bereich gefunden, weder DE noch US.
- Keine veröffentlichten Zahlen zum Effekt von Anzahlungen auf Show-Rate in Beauty.

## 2. Welche Buchungssoftware nutzen deutsche Studios/Praxen? Widgets, Deep-Links, Webhooks, Sync

### Takeaway
**Keine unabhängigen Marktanteilszahlen** gefunden. Sichtbar im DE-Beauty-Markt: Planity, Treatwell (inkl. Salonized seit 10/2024), Shore, Booksy, Fresha, Salonkee; im Arzt-/Zahnarztbereich Doctolib und samedi. Zu offiziellen APIs/Webhooks der Salon-Plattformen wurden keine Belege gefunden.

### Cited Findings
- Planity: laut Anbieter „+50.000 Friseur- & Kosmetiksalons“ (nicht unabhängig geprüft) — [Planity](https://www.planity.com/de-DE); Capterra: >40.000 Salons in FR/BE/DE — [Capterra Treatwell vs Planity](https://www.capterra.com.de/compare/181827/1027177/treatwell/vs/planity); Artikel 03/2026 „All-in-one-Software für Kosmetikstudios“ — [Basic Thinking](https://www.basicthinking.de/blog/2026/03/02/planity-die-all-in-one-software-fuer-kosmetikstudios/)
- Treatwell: Buchungsmarktplatz DACH; hat Salonized im Oktober 2024 vollständig übernommen — [Pabau (Wettbewerber-Blog)](https://pabau.com/de/blog/alternativen-zu-salonized/)
- Shore: als „Best for Germany/DACH“ genannt, mit TSE- und DATEV-Konformität (Wettbewerber-Vergleich) — [Alteg.io 2026](https://alteg.io/en/blog/13-best-online-booking-software-for-beauty-businesses-in-europe-in-2026/)
- Salonkee-AGB-Seiten von Nagelstudios zeigen Praxis „voller Preis bei Nichterscheinen nach § 615 BGB“ — [Salonkee](https://salonkee.de/search/nail-salon/wesel/manicure)
- samedi (Arztpraxen): Buchungswidget als Link (neuer Tab) oder iframe; mehrere **individuelle Widgets je Leistung** möglich — [samedi PDF](https://www.samedi.com/assets/samedi-Individuelles_Buchungswidget.pdf)
- Doctolib: keine offizielle Doku zu Widget/Deep-Link/API gefunden; nur inoffizielles WordPress-Plugin „Button for Doctolib“ (schwebender Button mit frei wählbarem Doctolib-Link) — [WordPress Plugin](https://wordpress.org/plugins/?p=119381)
- Doctolib steht im Fokus der Datenschutzaufsicht — [Dr. Datenschutz](https://www.dr-datenschutz.de/doctolib-im-fokus-der-aufsichtsbehoerde/)

### Inferences
- Hat der Klient schon eine Software (Planity/Treatwell/Shore/Doctolib), ist der pragmatische Weg: **Deep-Link oder iframe der bestehenden Buchung** auf der Landingpage; Conversion-Tracking ist dann schwierig, weil die Buchung auf fremder Domain endet (kein Pixel auf der Bestätigungsseite). Agentur sollte dann Klick auf „Termin buchen“ als Mikro-Conversion + Abgleich der Buchungen aus dem Tool (manuell/Export) nutzen.
- Marktplätze (Treatwell, Planity) zeigen dem Kunden Konkurrenz-Studios – Risiko, bezahlten Traffic auf eine Vergleichsplattform zu schicken.

### Gaps
- Keine Marktanteile; nichts zu Timify, Studiobookr, Phorest, Dentolo/Jameda-Booking gefunden.
- Unbelegt: ob Planity/Treatwell/Shore Webhooks, öffentliche APIs, UTM-Durchreichung oder Google-Calendar-Zwei-Wege-Sync bieten. Muss je Anbieter in Hilfe-Center/Sales geprüft werden.

## 3. Cal.com und Google Kalender Terminplaner im Detail

### Takeaway
**Cal.com Free** bietet laut eigener FAQ >90 % der Funktionen inkl. Webhooks, Workflows, Routing-Formularen; Booker-E-Mail-Verifizierung existiert als Event-Type-Schalter. Aber: Standard-Hosting sendet Daten in die USA (DPF); **EU-Hosting (cal.eu) ist ab 1.11.2026 nur noch ab Organizations-Plan** bzw. laut Konkurrent eingestellt – widersprüchlich. **Google Terminplaner** ist kostenlos stark eingeschränkt; Buchungsformular-Fragen, Erinnerungen, mehrere Seiten brauchen Workspace/Google One Premium.

### Cited Findings
**Cal.com**
- Free-Nutzer erhalten >90 % der Funktionen, inkl. Webhooks, automatisierter Workflows und Routing-Formularen — [Cal.com FAQ](https://cal.com/scheduling/frequently-asked-questions)
- Ein Pricing-Auszug markiert Workflows auf niedrigerer Stufe als „only templated“ → frei formulierbare Workflow-Texte evtl. nur kostenpflichtig — [Cal.com Pricing](https://cal.com/pricing?country=US)
- Anpassbare Buchungsfragen gelistet (Stufe im Auszug unklar) — [Cal.com Pricing](https://next.cal.com/pricing)
- Free = Einzelnutzer, Cal.com-Branding sichtbar; Teams ca. 12 $/Nutzer/Monat, Organizations ca. 28 $/Nutzer/Monat (Drittquellen) — [Zeeg](https://zeeg.me/en/blog/post/cal-com-pricing); [Findstack](https://findstack.com/products/cal-com/reviews)
- „Requires Booker Email Verification“ als Schalter im Advanced-Tab des Event-Types (Blog 10/2023) — [Cal.com Blog](https://cal.com/blog/elevating-booking-authenticity-on-cal-com-a-guide-to-cal-com-s-verification-featu); [Guideflow](https://www.guideflow.com/tutorial/how-to-enable-booker-email-verification-in-calcom-events)
- EU-Hosting: ab 1. November nur noch kostenpflichtig ab Organizations-Plan, keine Individuals/Teams-Konten auf Cal.eu — [Cal.com Europe](https://cal.com/europe/); Standard-Dienst überträgt Daten in die USA unter dem Data Privacy Framework — [Cal.com DPF](https://cal.com/dpf-data-privacy-framework); **widersprochen** von Konkurrent meetergo: „Cal.eu schließt am 1.11.2026, Nutzer werden auf die internationale Plattform migriert“ — [meetergo Review](https://meetergo.com/en/magazine/cal-com-review) (Interessenkonflikt beachten); mehrere Quellen nennen 50-Nutzer-Minimum für EU — [meetergo](https://meetergo.com/en/magazine/cal-com-eu-hosting)
- Cal.com: DSGVO, SOC 2 Type II, ISO 27001 laut Anbieter — [Cal.com GDPR Blog](https://cal.com/blog/gdpr-compliant-scheduling)

**Google Kalender Terminplaner (appointment schedules)**
- Privates Google-Konto / Business Starter: eine Buchungsseite, Basis-Bestätigungsmails, Einbetten/Teilen möglich; kaum Anpassung (Titel, Beschreibung) — [Zeeg Guide](https://zeeg.me/post/google-calendar-appointment-scheduling)
- Premium (Workspace/Google One): mehrere Terminarten mit eigenen Seiten, Buchungsformular-Zusatzfragen, bis zu 5 automatische Erinnerungen — [Google Hilfe (Auszug)](https://support.google.com/calendar/answer/11608416?hl=en-ca); [YouCanBookMe](https://youcanbook.me/blog/google-appointment-scheduler?hs_amp=true)
- Bestätigungsmail ist Standard und kaum anpassbar; Antworten auf Zusatzfragen lösen keine Logik aus, erscheinen nur in der Einladung — [Zapier](https://zapier.com/blog/calendly-vs-google-calendar)
- Workspace Frontline/Essentials können keine Terminpläne anlegen — [Google Workspace](https://workspace.google.com/intl/en-GB_uk/resources/appointment-scheduling)

### Inferences
- Für DSGVO-sensible Ästhetik-Praxen ist Cal.com Free (US-Hosting über DPF) rechtlich möglich, aber erklärungsbedürftig; EU-Residenz ist für Einzelstudios praktisch nicht mehr erreichbar. EU-Alternativen (z. B. meetergo, deutsche Anbieter) prüfen.
- Google Terminplaner kostenlos ist für Agenturkunden zu schwach (keine individuelle Bestätigungsmail mit Vorbereitungshinweisen, keine Erinnerungen) – aber kombinierbar: Terminplaner bucht, Apps Script der Zentrale liest neue Kalender-Events und verschickt die eigene Vorbereitungs-Mail.

### Gaps
- Exakte Free-Plan-Grenzen von Cal.com (eigene Mail-Texte, Erinnerungen per SMS, Anzahl Event-Types, Puffer, Mindestvorlauf) nicht primär verifiziert (cal.com nicht abrufbar). Aus Erfahrung (nicht belegt): Puffer, Mindestvorlauf, mehrere Event-Types und Embeds sind im Free-Plan enthalten.
- Ob Google Terminplaner eine Booker-E-Mail-Verifizierung anbietet: nicht belegt.

## 4. Eigenbau auf Google Apps Script (Freebusy + Event anlegen)

### Takeaway
Machbar, aber die harte Grenze ist der **Mailversand: 100 Empfänger/Tag bei privaten Konten** vs. 1.500 bei Workspace. Kalender-Events: 5.000 vs. 10.000/Tag – unkritisch. Quoten gelten pro Nutzer, Reset 24 h nach erster Anfrage, und können sich ohne Ankündigung ändern.

### Cited Findings
- E-Mail-Empfänger/Tag: Consumer 100*, Workspace 1.500* (domainintern 2.000); `MailApp.getRemainingDailyQuota()` liefert Restkontingent — [Apps Script Quotas](https://developers.google.com/apps-script/guides/services/quotas)
- Kalender-Events erstellt: 5.000 bzw. 10.000/Tag (Consumer/Workspace laut Sekundärquellen) — [Apps Script Quotas](https://developers.google.com/apps-script/guides/services/quotas); [O'Reilly „Going GAS“, Kap. 4](https://www.oreilly.com/library/view/going-gas/9781491940457/ch04.html)
- Quoten pro Nutzer, Reset 24 h nach erster Anfrage, „subject to elimination, reduction, or change at any time, without notice“ — [Apps Script Quotas](https://developers.google.com/apps-script/guides/services/quotas)

### Inferences
- Rechnung: pro Buchung ca. 2–3 Mails (Bestätigung Kunde, Info an Studio, Erinnerung) → bei 100/Tag reicht ein privates Konto für ~30–40 Buchungen/Tag über **alle** Agentur-Kunden zusammen, falls ein Konto (die Zentrale) für alle sendet. Mit wachsender Kundenzahl Workspace-Konto (1.500) oder Versand über das Konto des Klienten (eigene Quote, eigener Absender) einplanen.
- Doppelbuchung: Prüfen und Anlegen müssen in `LockService.getScriptLock()` laufen, und unmittelbar vor `createEvent` die Belegung erneut prüfen (Race Condition zwischen Slot-Anzeige und Absenden). (Fachwissen, nicht quellenbelegt.)
- Zeitzonen: Skript-Zeitzone und Kalender-Zeitzone explizit auf Europe/Berlin setzen; Slots serverseitig erzeugen (Sommer-/Winterzeit). (Fachwissen.)
- Lesezugriff auf den Kalender des Klienten: Klient teilt Kalender mit dem Zentrale-Konto mit „Änderungen an Terminen vornehmen“; Freebusy über Advanced Calendar Service. (Fachwissen.)
- Latenz: Apps-Script-Web-Apps antworten typischerweise in 1–3 s, Kaltstarts länger → Slots beim Laden der Landingpage vorab abrufen, Spinner anzeigen. (Erfahrungswert, nicht belegt.)
- .ics-Anhang: `MailApp.sendEmail` mit `attachments` (Blob, MIME `text/calendar`) möglich; alternativ legt das Event mit Gast-Einladung automatisch eine Google-Einladung an – die kommt aber im Google-Standardlayout. (Fachwissen.)

### Gaps
- Footnote-Bedingungen der Consumer-Mailquote (z. B. Reduktion für neue/kostenlose Konten) nicht lesbar (Seite blockiert).
- Keine Quelle zu Web-App-Latenzen oder Limits gleichzeitiger Ausführungen geprüft (Seite blockiert; aus Erinnerung: 30 gleichzeitige Ausführungen pro Nutzer – unverifiziert).

## 5. Inhalte von Bestätigungs-/Erinnerungs-Mails: Vorbereitungshinweise je Behandlung, Timing, Storno, Ausfallgebühr

### Takeaway
Vorbereitungsregeln sind **behandler-abhängig**; Quellen widersprechen sich bei Fristen. Die Mail-Vorlage braucht daher **feste Struktur + vom Klienten bestätigte Werte** (Platzhalter), keine von der Agentur erfundenen medizinischen Fristen. Ausfallgebühren sind in DE grundsätzlich zulässig, wenn vor Buchung klar vereinbart, angemessen, mit Anrechnung ersparter Aufwendungen (§ 615 S. 2 BGB).

### Cited Findings
**Laser-Haarentfernung**
- Nur rasieren, nicht wachsen/epilieren/zupfen (Laser braucht die Haarwurzel) — [Beobachter](https://www.beobachter.ch/gesundheit/laser-oder-blitzlichttherapie-das-ist-zu-beachten); [apotheken.de](https://www.apotheken.de/krankheiten/hintergrundwissen/5933-haarentfernung-mit-dem-laser)
- Rasur 1–2 Tage vorher (IPL) — [evenskyn](https://www.evenskyn.com/de/blogs/skin-beautyarticles/ipl-laser-hair-removal-what-you-can-expect-before-after)
- Haut nicht gebräunt (Sonne/Solarium); gilt auch nach der Behandlung — [Beobachter](https://www.beobachter.ch/gesundheit/laser-oder-blitzlichttherapie-das-ist-zu-beachten); kein Selbstbräuner/Bräunungsspray — [desired.de](https://www.desired.de/beauty/haarentfernung/laserepilation-dauerhaft-seidig-glatte-haut/)
- Fristen widersprüchlich: 2 Wochen vorher (IPL-Anbieter) — [evenskyn](https://www.evenskyn.com/de/blogs/skin-beautyarticles/ipl-laser-hair-removal-what-you-can-expect-before-after); 3 Wochen vor und nach — [utopia](https://utopia.de/ratgeber/dauerhafte-haarentfernung-methoden-vor-und-nachteile-im-ueberblick); 2 Wochen vor, ≥ 8 Wochen nach — [weekend.at](https://www.weekend.at/lifestyle/beauty/laser-haarentfernung-im-faktencheck)
- Mehrere Sitzungen im Abstand von ca. 4 Wochen — [t-online](https://www.t-online.de/ratgeber/id_90106988/beste-haarentfernung-schonende-methoden-fuer-haut-und-haar-von-epilieren-bis-waxing.html)

**Permanent Make-up**
- Kein Botox 1 Monat vor PMU im Lippenbereich / 4 Wochen vor oder nach kein Botox oder Filler (Praxis-Vorbereitungsseiten, US) — [Precision Brows](https://precision-brows.squarespace.com/before-procedure); [PreCare Instruction](https://khaki-flower-4zk4.squarespace.com/precare-instruction)
- EADV-Patientenbroschüre (05/2026): Botox verändert Muskelaktivität und damit die PMU-Form; besser PMU vor Botox; Nachstechen ggf. nötig; Fieberbläschen als Risiko nach Lippen-PMU — [EADV Leaflet](https://eadv.org/wp-content/uploads/2026/05/EADV-Leaflet-TF-Tattoo-Permanent-Make-Up.pdf)
- Einverständnisformulare (AT) fragen Blutverdünnung ab; Behandlung binnen 3 Monaten abgeschlossen; Farbe anfangs deutlich kräftiger als Endergebnis — [WKO Einverständnis Lippe](https://www.wko.at/oe/gewerbe-handwerk/fusspfleger-kosmetiker-masseure/20100114-einverstaendniserklaerung-lippe-2.pdf); [konsumentenfragen.at](https://konsumentenfragen.at/konsumentenfragen/Zentrale_Elemente/Materialien/einverstaendniserklaerung_pmup__ueberarbeitet_2010_2.pdf); WKO Fragenkatalog PMU — [WKO](https://wko.at/noe/gewerbe-handwerk/fusspfleger-kosmetiker-masseure/fragenkatalog-permanent-make-up.pdf)
- Herpes: als Auslöser/Risiko genannt, aber **keine belegte Prophylaxe-Empfehlung** gefunden (ärztlich klären) — [EADV Leaflet](https://eadv.org/wp-content/uploads/2026/05/EADV-Leaflet-TF-Tattoo-Permanent-Make-Up.pdf)

**Botox/Hyaluron**
- Blutverdünner (Aspirin, Ibuprofen) ca. 1 Woche vorher meiden; verschriebene Medikamente nicht eigenmächtig absetzen; Alkohol in den Tagen davor meiden — [Utah Facial Plastics](https://www.utahfacialplastics.com/about-us/patient-resources/pre-and-post-care-for-ufp-treatments/injectables-pre-post-care/) (US); [HA Pre-Toxin PDF](https://cdn.shopify.com/s/files/1/0274/0630/3347/files/HA_Pre-Toxin.pdf) (US)
- Nach Botox: für den Rest des Tages Sport, Sauna, Laser, intensive Peelings meiden — [Apotheken Umschau](https://www.apotheken-umschau.de/mein-koerper/haut-und-haare/botox-anwendungen-vorteile-und-moegliche-nebenwirkungen-1350515.html)
- Ausführliches Aufklärungs- und Beratungsgespräch ist Standard — [Gesundheits-Lexikon](https://www.gesundheits-lexikon.com/Therapie/Arzneimittel-Naturheilmittel/Botox-Faltenbehandlung); nicht in Schwangerschaft/Stillzeit, Ausschluss bei neuromuskulären Erkrankungen/Allergien — [Stadt Wien](https://www.wien.gv.at/spezial/frauengesundheit-aesthetische-eingriffe/irrtum-schonheitseingriffe-mit-laser-und-spritzen-sind-harmlos/informationen-zu-botox-und-laserbehandlungen/); DGÄPC-Info Botulinumtoxin — [DGÄPC PDF](https://www.dgaepc.de/wp-content/uploads/2015/04/Botulinumtoxin.pdf) (2015)
- **Werberecht (relevant für Landingpage/Anzeigen):** BGH 31.07.2025 (I ZR 170/24): keine Vorher-Nachher-Bilder für Hyaluron-/Botox-Behandlungen ohne medizinische Indikation (§ 11 Abs. 1 S. 3 Nr. 1 HWG), gilt in allen Medien inkl. Instagram — [LTO](https://www.lto.de/recht/nachrichten/n/izr17024-bgh-vorher-nachher-bildern-schoenheitsoperation-dr-rick-und-nick-aesthetify); [Ärzteblatt](https://www.aerzteblatt.de/news/bundesgerichtshof-untersagt-werbung-fur-hyaluronspritzen-mit-vorher-nachher-bildern-9682baf7-8727-478a-9535-5bb619b29bbe); Verfassungsbeschwerde 1 BvR 2656/25 anhängig — [BÄK Stellungnahme](https://www.bundesaerztekammer.de/fileadmin/user_upload/BAEK/Politik/Stellungnahmen/Stellungnahme_Bundesaerztekammer_BverfG_1_BvR_2656_25.pdf); LÄK Hessen 03/2026 „Keine Werbung Hyaluron-Injektionen“ — [LÄKH PDF](https://www.laekh.de/fileadmin/user_upload/Heftarchiv/Einzelartikel/2026/03_2026/Recht_Keine_Werbung_Hyaluron_Injektionen.pdf)

**Bleaching**
- Professionelle Zahnreinigung 1–2 Wochen vorher; erhöhte Empfindlichkeit möglich — [ERGO](https://www.ergo.de/de/Ratgeber/zahngesundheit/zahnpflege-zahnerhalt/bleaching)
- Karies/Parodontitis vorher behandeln; Ursache der Verfärbung klären; Kosten 300–1.000 €, Privatleistung — [Verbraucherzentrale](https://www.verbraucherzentrale.de/wissen/gesundheit-pflege/medikamente/bleaching-moeglichkeiten-der-zahnaufhellung-12908)
- Fluoridierung/Versiegelung nach Bleaching gegen Empfindlichkeit — [Apotheken Umschau](https://www.apotheken-umschau.de/krankheiten-symptome/zahnkrankheiten/weisse-zaehne-wann-bleaching-geeignet-ist-799689.html)

**Ausfallgebühr / Storno**
- No-Show-/Ausfallgebühren grundsätzlich zulässig, keine einheitliche Rechtsprechung; muss bei Buchung ausdrücklich auf Stornobedingungen und Kosten hingewiesen werden (VZ Niedersachsen, 07/2026) — [Verbraucherzentrale Niedersachsen](https://www.verbraucherzentrale-niedersachsen.de/wissen/vertraege-reklamation/kundenrechte/ausfallgebuehr-oder-noshowgebuehr-was-ist-das-und-muessen-sie-sie-bezahlen-120246)
- Rechtsgrundlage § 615 S. 1 BGB (Annahmeverzug); nach S. 2 ersparte Aufwendungen bzw. anderweitiger Verdienst anrechnen — [ETL Rechtsanwälte 2025](https://www.etl-rechtsanwaelte.de/aktuelles/nichterscheinen-des-patienten-ausfallhonorar-2025/); Pauschale in AGB → § 305 BGB, klarer Hinweis auf § 615 BGB — [IWW](https://www.iww.de/fmp/forderungsrecht/ausfallhonorar-neues-zu-ausfallhonoraren-und-strafgebuehren-von-aerzten-wenn-der-patient-nicht-erscheint-f162675)
- Vorab klar kommunizieren, Höhe angemessen, überzogene Pauschalen unzulässig — [Sparkasse](https://www.sparkasse.de/aktuelles/verpasste-termine-kosten.html)
- AG Hamburg-Wandsbek 713 C 238/18 (2018): Ausfallhonorar-Klausel verstößt nicht grundsätzlich gegen §§ 307, 308 Nr. 7 BGB; kritisiert LG Berlin 55 S 310/04 (2005) — [IWW](https://www.iww.de/fmp/forderungsrecht/ausfallhonorar-neues-zu-ausfallhonoraren-und-strafgebuehren-von-aerzten-wenn-der-patient-nicht-erscheint-f162675); Zahnärztekammer Niedersachsen Stellungnahme — [ZKN PDF](https://zkn.de/wp-content/uploads/2024/02/Stellungnahme_Das_Ausfallhonorar-1.pdf)

### Inferences
- Mail-Bausteine (Vorschlag): Termin (Datum, Uhrzeit, Dauer, Adresse, Anfahrt/Parken) · Was mitbringen · **Vorbereitung (vom Behandler bestätigte Liste)** · Was danach gilt · Wer behandelt / Beratung vs. Behandlung · Kosten/Anzahlung · Stornofrist und Ausfallgebühr (gleicher Wortlaut wie auf der Buchungsseite) · Umbuchen/Absagen-Link · .ics · Impressum/Datenschutz.
- Bei Ärzten (Botox/Hyaluron/Bleaching) zusätzlich: Aufklärungsbogen vorab als Link, Hinweis „Behandlung erst nach Aufklärung; Bedenkzeit“. Agentur sollte **keine medizinischen Fristen selbst festlegen** – Vorlage mit Platzhaltern, die der Behandler ausfüllt/freigibt (analog „nichts erfinden“-Regel im Repo).
- Vorher-Nachher-Bilder dürfen bei Botox/Hyaluron weder in Anzeigen noch auf der Landingpage stehen (BGH 2025) – bei Laser-Haarentfernung/PMU/Bleaching (kein „operativer plastisch-chirurgischer Eingriff“) ist die Lage nicht abschließend geklärt.

### Gaps
- Keine belastbare deutsche Quelle zu „weißer Diät 48 h nach Bleaching“, zu einer 24-h-Alkoholregel vor PMU, zur Nachstech-Frist 4–8 Wochen oder zur Herpes-Prophylaxe-Dosierung.
- Altersgrenze 18+ für Botox/Hyaluron: in dieser Recherche nicht belegt (HWG-Text selbst nicht geprüft; aus Erinnerung verbietet § 11 Abs. 1 S. 3 Nr. 2 HWG Werbung für solche Eingriffe, die sich überwiegend an unter 18-Jährige richtet – unverifiziert).
- Keine Rechtsprechung speziell zu Kosmetikstudios und Ausfallgebühren gefunden; Übertragung aus Arzt-Fällen.
- Optimales Erinnerungs-Timing (24 h vs. 48 h) für Beauty nicht belegt.

## 6. No-Show-Reduktion mit Zahlen

### Takeaway
Die wissenschaftlichen Effekte von Erinnerungen sind **moderat (ca. 20 % relativ)**, nicht die 30–50 %, die Anbieter behaupten. Wortlaut der Erinnerung zählt. Deutsche Baseline laut KBV 8–15 % versäumte Termine.

### Cited Findings
- Review über 105 Studien: durchschnittliche No-Show-Rate 23 %; KBV nennt für DE 8–15 % — [Frontiers Digital Health 2025](https://frontiersin.org/journals/digital-health/articles/10.3389/fdgth.2025.1567397/full)
- SMS-Erinnerung (Brasilien, Kinderdiabetes-Ambulanz): Abwesenheit 20,0 % (2012) → 15,9 % (2013) → 15,4 % (2014), also ca. 20–23 % relativ weniger — [PMC4659257](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4659257/)
- A/B-Test SMS-Formulierung (Klinik, 2020; SMS 5 Tage vorher): gezielte Formulierung senkt No-Shows deutlich; einfache Erinnerungen wirken, aber klein — [PMC7310733](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7310733/)
- DE-Studie (Augenklinik/Praxis, 20 Monate): SMS-Erinnerungen reduzieren No-Shows; online gebuchte Termine niedrigere No-Show-Rate — [Frontiers Digital Health 2025](https://frontiersin.org/journals/digital-health/articles/10.3389/fdgth.2025.1567397/full)
- Anbieterbehauptung „30–50 % weniger“ ohne Quelle — [KI-Syndikat](https://www.ki-syndikat.de/usecases/gesundheit/03-terminplanung/) (nicht belastbar)
- Anzahlung als größter Hebel (ohne Daten, US) — [Pronk](https://pronkmedspamarketing.com/blog/med-spa-digital-marketing-benchmarks/)

### Inferences
- Für die Zentrale: Bestätigungsmail sofort + Erinnerung ca. 24–48 h vorher mit **Bestätigen-/Absagen-Knopf** (freigewordene Slots sind wertvoller als No-Shows). Eine Studio-seitige Bestätigung „Termin bestätigt“ macht No-Shows sichtbar und erlaubt Nachbesetzung.
- Anzahlung (z. B. bei PMU üblich) erhöht Verbindlichkeit, braucht aber Zahlungsdienst (Stripe/PayPal) – im kostenlosen Apps-Script-Weg nicht trivial; Cal.com bietet Zahlungs-App (nicht belegt für Free).

### Gaps
- Keine Beauty-spezifischen No-Show-Zahlen (DE) gefunden; keine Daten zu Anzahlung oder Bestätigungsklick-Effekt.

## 7. DSGVO: Gesundheitsfragen im Buchungsformular, Einwilligung, AV-Vertrag

### Takeaway
Schon Angaben zu Beschwerden, gewünschter Behandlung oder Anamnesefragen sind **Gesundheitsdaten (Art. 9 DSGVO)**. Im Buchungsformular nur das Nötigste erfragen; Gesundheitsfragen (Schwangerschaft, Blutverdünner, Herpes) besser im Termin bzw. Aufklärungsbogen. Wenn doch online: ausdrückliche, gesonderte Einwilligung. Buchungstools = Auftragsverarbeiter → AV-Vertrag.

### Cited Findings
- Gesundheitsdaten nach Art. 9 DSGVO grundsätzlich verboten zu verarbeiten; Ausnahme u. a. ausdrückliche Einwilligung (Art. 9 Abs. 2 lit. a) — [Dr. Datenschutz Arztpraxis](https://www.dr-datenschutz.de/datenschutz-in-der-arztpraxis-alles-wichtige-im-ueberblick/)
- Bereits Angabe von Beschwerden, gezielte Arztsuche oder Anamnesebogen = Gesundheitsdaten; vzbv-Prüfung: 7 von 9 Anbietern holen keine/unzureichende ausdrückliche Einwilligung ein — [vzbv](https://www.vzbv.de/node/13177); [Dr. Datenschutz vzbv](https://www.dr-datenschutz.de/vzbv-prueft-datenschutz-bei-anbietern-von-videosprechstunden/)
- Ausdrückliche Einwilligung: eindeutiger Bezug auf Gesundheitsdaten, unmissverständliche bestätigende Handlung; allgemeiner AGB-Verweis reicht nicht — [Dr. Datenschutz Digitale Gesundheit](https://www.dr-datenschutz.de/digitale-gesundheit-herausforderungen-fuer-den-patientendatenschutz/)
- DSK-Positionspapier zu Terminverwaltungsdienstleistern (Heilberufspraxen): Patienten nach Art. 13 über Einbindung informieren — [DSK Beschluss](https://datenschutzkonferenz-online.de/media/dskb/DSK-Beschluss_Positionspapier_Terminverwaltungsunternehmen.pdf)
- Buchungsanbieter empfiehlt knappe Aufnahme: Name, Telefon, E-Mail — [SimplyBook.me](https://simplybook.me/index.php/de/blog/online-booking-for-healthcare)
- Auftragsverarbeitung im Medizinbereich (ULD SH) — [datenschutzzentrum.de](https://www.datenschutzzentrum.de/uploads/projekte/anomed/2023-12-04_Auftragsverarbeitung_Medizindatenschutz-Zwingelberg.pdf)

### Inferences
- Formular-Minimum: Name, Telefon, E-Mail, gewünschte Leistung (neutral formuliert, z. B. „Beratung Faltenbehandlung“), Wunschtermin, Kontaktweg. Keine Pflichtfelder zu Medikamenten/Schwangerschaft/Herpes.
- Bei Kosmetikstudios (keine Heilberufe) greift Art. 9 Abs. 2 lit. h meist nicht → Einwilligung ist der Weg (eigene Schlussfolgerung).
- Konsequenz für die Agentur-Zentrale: Werden Termindaten in der Google-Tabelle der Agentur gespeichert, ist die Agentur Auftragsverarbeiter des Klienten → AV-Vertrag Agentur↔Klient, Google (Workspace-Datenverarbeitungsbedingungen) als Unterauftragsverarbeiter; mit privatem Gmail-Konto ist ein AV-Vertrag mit Google nicht sauber abschließbar (Fachwissen, nicht belegt). Meta-Pixel auf Seiten mit Gesundheitsbezug: keine Behandlungsdetails als Events/Parameter übertragen.
- Wortlaut-Vorschlag Einwilligung (nur falls Gesundheitsangaben abgefragt): „Ich willige ausdrücklich ein, dass [Studio] meine freiwilligen Angaben zu meiner Gesundheit (z. B. Medikamente, Vorerkrankungen) zur Vorbereitung meines Termins verarbeitet. Widerruf jederzeit per E-Mail an …“ – separate, nicht vorangekreuzte Checkbox. (Eigener Entwurf, juristisch prüfen lassen.)

### Gaps
- Keine Quelle speziell zu Kosmetikstudios / Online-Buchung / Art. 9; keine Aussage einer Aufsichtsbehörde zu Meta-Pixel auf Beauty-Landingpages gefunden.
