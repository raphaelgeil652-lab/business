# business

## Auf einen Blick

Website + Ads-Retainer für vier lokale Branchen in Pfullendorf/Sigmaringen. Der Kreislauf: Leads recherchieren → Erstkontakt (Anruf/vor Ort) → 1-2 kostenlose/günstige Referenzprojekte → daraus zahlende Kunden in derselben Nische → monatliche Ads-Betreuung als eigentliches Einkommen. Was automatisiert läuft (Recherche, Vorlagen, Lead-Tracking, wöchentliche Erinnerung) vs. was nur der Nutzer selbst tun kann (Anrufe, Vertrauen, Vertragsabschluss) steht in `docs/konzept-akquise-system.md`.

## Kontext

Dieses Repo ist die Basis für den Aufbau einer Agentur, die zwei Leistungen kombiniert:

1. **Websites bauen** für lokale Kunden (No-Code: Webflow oder WordPress/Elementor)
2. **Ads schalten** (Google Ads, Meta Ads) für dieselben Kunden, um ihnen mehr Kunden/Leads zu bringen

Modell: Website als Einstiegsprojekt (Fixpreis/einmalig), Ads-Betreuung danach als monatlicher Retainer. Der Retainer ist der eigentliche Hebel für wiederkehrendes Einkommen, nicht der einmalige Website-Verkauf.

## Aktueller Stand

- Noch keine eigenen Kunden, kein Netzwerk vorhanden
- Skills (Website-Bau, Ads-Zertifizierungen) noch im Aufbau
- Ziel: nebenbei starten, erste 1-2 Projekte kostenlos/günstig für Testimonials, danach zahlende Kunden in einer fokussierten Nische

## Zielregion & Nische

Standort: Pfullendorf / Landkreis Sigmaringen (Bodensee-Nord).

- **Nicht** die großen Industriearbeitgeber der Region (Geberit, Kramer-Werke, Schwörer Haus, Fürst-von-Hohenzollern-Gruppe) als Zielkunden – eigene Marketingabteilungen, lange B2B-Zyklen, kein Fit.
- **Nicht** klassisches Handwerk (Elektriker, Dachdecker, Sanitär) als erste Nische – wegen Fachkräftemangel meist schon ausgebucht, Ads bringen dort kaum messbaren Mehrwert.
- **Festgelegte Nische (4 Branchen)**: Zahnärzte, Fitnessstudios, Beautysalons (Kosmetik/Nagelstudios) und Friseure – konsumentennahe, wiederkehrende Entscheidungen, kaum digitale Konkurrenz vor Ort, gut kopierbares Muster nach dem ersten Referenzprojekt pro Branche. Physio und Gastronomie/Tourismus wurden als frühere Kandidaten geprüft (siehe `docs/playbook-landingpages-ads.md`), sind aber aktuell **nicht** Fokus – Recherche/Ansprache konzentriert sich auf die vier genannten Branchen.

## Fahrplan

Ausgangslage: nebenbei (Job/Schule parallel), beide Kern-Skills (Website-Bau, Ads) noch neu, kein bestehendes Netzwerk mit potenziellen Kunden. Realistischer Zeithorizont: die ersten 3-6 Monate sind überwiegend Lernen + unbezahlte Beweisprojekte, bevor echtes Geld reinkommt – das ist der Normalfall, kein Scheitern.

1. **Skills aufbauen** (parallel, ca. 1-3 Monate): No-Code-Website-Tool lernen (Webflow oder WordPress/Elementor); Google-Skillshop- und Meta-Blueprint-Zertifizierungen (kostenlos); eigenes Ads-Testbudget (50-100€) einmal wirklich selbst schalten.
2. **Beweis bauen, bevor verkauft wird**: 1-2 kostenlose/sehr günstige Projekte für echte Kontakte (Nachbarschaft, Verein, Familie) für ein zeigbares Ergebnis + Testimonial. Daraus eigene Portfolio-Seite ableiten.
3. **Erste zahlende Kunden ohne Netzwerk**: lokale Nische (siehe unten) über Google Maps/direkte Ansprache vor Ort, nicht E-Mail-Spam. Alternativ Fiverr/Upwork als Trainingsrad.
4. **Wiederkehrendes Einkommen**: Website ist der Foot-in-the-door, die monatliche Ads-Betreuung + Wartung ist der eigentliche Hebel für skalierbares Einkommen.

## Struktur dieses Repos

- `CLAUDE.md` – dieser Überblick: Geschäftsmodell, Stand, Zielnische, Fahrplan. Bei jeder größeren Entscheidung (Nischenwechsel, neue Angebote, Repo-Struktur) aktuell halten.
- `docs/` – tiefere Recherchen und Playbooks:
  - `docs/playbook-landingpages-ads.md` – High-Converting Landingpages/Ads für die Zielnische
  - `docs/konzept-akquise-system.md` – Akquise-Trichter, was automatisiert läuft vs. was der Nutzer selbst tun muss, wöchentlicher Rhythmus
  - `docs/outreach-skripte.md` – Anruf-/Vor-Ort-Skripte für Erstkontakt
  - `docs/ads-budget-und-abrechnung.md` – wie Werbebudget (Kunde → Google/Meta) und eigene Betreuungsgebühr (Kunde → dir) technisch und finanziell getrennt funktionieren
  - `docs/design-standard.md` – verbindliche Design-Prinzipien für alle Homepages (gegen generisches KI-Design; Landingpages bleiben bewusst schlank, siehe Playbook), gilt für jede neue Vorlage in `templates/`
- `templates/` – wiederverwendbare Website-/Ads-Vorlagen pro Nische:
  - `templates/zahnarzt-landingpage/` – Ads-Landingpage + Google-Ads-Copy + Anzeigenvorschau-Mockup (Zahnärzte)
  - `templates/fitnessstudio-website/` – volle Homepage (Fitnessstudios), inkl. `showcase.html` als bewusst übertriebene Effekt-Demo (kein Kundentemplate)
  - `templates/beautysalon-website/` – volle Homepage (Beautysalons/Kosmetik)
  - `templates/friseur-website/` – volle Homepage (Friseure)
- `websites/` – konkrete, mehrseitige Kunden-Websites (statisches HTML/CSS/JS, direkt hostbar). Erstes Projekt: `websites/fit4life/` (Fitnessstudio Pfullendorf). Landingpages werden separat unter `templates/` gepflegt. **Konvention: Jede Website ist ein eigenständiger, direkt auf Vercel deploybarer Ordner** (kein Build-Schritt, eigene `vercel.json`, `cleanUrls`; in Vercel als Root Directory den jeweiligen Website-Ordner setzen). **Workflow-Konvention: Sobald eine Website fertig oder aktualisiert ist, wird der Arbeits-Branch direkt nach `main` gemerged**, damit der Ordner auf `main` liegt und ohne Extra-Schritte in Vercel als Root Directory auswählbar/deploybar ist (Vercel liest die Ordnerauswahl aus dem Production-Branch `main`).
- `leads/leads.csv` – Lead-Tracker mit echten recherchierten Betrieben in der Zielregion (Name, Kontakt, Website-Einschätzung, Status, nächster Schritt). Nach jedem Kontaktversuch aktuell halten.
- Konvention: Erkenntnisse, Recherchen und Entscheidungen aus Sessions werden hier im Repo festgehalten (nicht nur im Chat-Verlauf), damit zukünftige Sessions direkt darauf aufbauen können.

## Konvention: Feedback und Vorlieben des Nutzers dauerhaft festhalten

Ausdrücklicher Wunsch des Nutzers: Jede Feedback-Schleife wird als dauerhafte Erkenntnis gespeichert, nicht nur im Moment umgesetzt. Konkret:

- Sagt der Nutzer "das gefällt mir nicht / mach es anders" und bestätigt danach das Ergebnis ("so ist es gut"), wird die Erkenntnis **sofort in die passende Datei geschrieben** (Design-Feedback → `docs/design-standard.md`, Prozess-/Angebotsentscheidungen → CLAUDE.md oder passendes docs/-Dokument) und committet/gepusht.
- Das gilt für alle Arten von Vorlieben: Design-Geschmack, Tonalität von Texten, Arbeitsweise, Umfang von Websites, was er selbst machen will vs. delegiert.
- Ziel: Jede neue Session kennt den aktuellen Stand seiner Vorlieben, ohne dass er sie wiederholen muss. Beispiel-Präzedenzfall: die bestätigte editoriale Design-Richtung in `docs/design-standard.md` (Juli 2026).
