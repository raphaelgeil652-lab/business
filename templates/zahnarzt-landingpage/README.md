# Template: Zahnarzt-Landingpage

Statische, abhängigkeitsfreie Landingpage (eine HTML-Datei) für die Flagship-Leistung „Professionelle Zahnreinigung“ einer Zahnarztpraxis. Basiert auf `docs/playbook-landingpages-ads.md`.

## Design-Entscheidungen

- **Ein Service, eine Seite, ein CTA** – bewusst kein Praxis-Rundumschlag, sondern eine Leistung mit klarer Suchintention. Für weitere Leistungen (z. B. Invisalign, Notfall) diese Datei kopieren statt eine Seite zu überladen.
- **Keine Web-Fonts** – bewusst nur System-Schriftarten (Serif für Headlines/Vertrauen, Sans für Fließtext/Formular). Kein Ladeverzug, kein Layout-Sprung – wichtig, weil laut Recherche das Klick-zum-Anrufen-Element auf dem Handy innerhalb von 2 Sekunden erreichbar sein muss.
- **Kurzes Formular** – nur Name + Telefon Pflichtfeld, Nachricht optional. Zusatzinfos gehören in den Folgeprozess, nicht auf die Landingpage.
- **Sticky Header + mobile Sticky-Leiste** – Telefonnummer und Buchungs-CTA sind auf jedem Scroll-Stand erreichbar.
- **Transparente Preisbox + FAQ** – nimmt typische Einwände (Schmerzen, Kosten, Dauer) direkt vorweg, bevor der Nutzer abspringt.
- **Farbpalette**: warmes Salbei-Porzellan als Grund, Wacholdergrün als Vertrauensfarbe, Honigbraun als CTA-Farbe – bewusst kein klinisches Blau/Türkis und keine Creme+Terrakotta-Standardkombination.

## Anpassung pro Kunde

Am Kopf der `index.html` steht ein Kommentar mit allen Stellen, die pro Kunde ersetzt werden müssen: Praxisname, Ort, Adresse, Telefonnummer, Bewertungen, Preis, Testimonials. Das Formular ist aktuell nur clientseitig (kein echter Versand) – vor dem Livegang an ein echtes Buchungssystem/CRM oder zumindest an einen Mailversand-Endpoint anbinden.

## Getestet

Rendering wurde in Chromium (Desktop 1280px, Mobile 390px) geprüft: keine JS-Fehler, Formular-Interaktion, Scroll-Reveal-Animationen und Sticky-Elemente funktionieren wie vorgesehen.
