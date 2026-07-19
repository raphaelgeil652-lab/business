# Template: Beautysalon-Website (Homepage)

Volle Homepage für ein Kosmetik-/Nagelstudio — hell, ruhig, editorial. Referenz-Vorlage der verschärften Design-Generation, siehe `docs/design-standard.md`.

## Design

- Schriftpaarung: **Fraunces** (weiche Serife mit Kursiv-Akzenten) + **Outfit** (leichter Fließtext).
- Farbwelt: Porzellan (#F7F1EC), Pflaume (#2E1A1D), Lackrot (#A8404C) — das Rot ist aus der Nagellack-Bildwelt abgeleitet, nicht aus einem generischen Beauty-Rosa.
- Layout: Split-Hero mit randabfallendem Bild + kleiner Überlappung, Behandlungen als nummerierte Großzeilen (Name, Preis, Dauer, Bild — keine Karten), Statement-Band auf Pflaume, geteilte Kontakt-Sektion mit Infotabelle, Sticky-Mobile-Leiste.

## Wichtig: "Vorher/Nachher"-Abschnitt

Bewusst als **ehrlicher Platzhalter** gebaut — dort niemals Stockfotos als angebliche Ergebnisse einsetzen (irreführend). Erst mit echten Kundinnenfotos befüllen, nur mit ausdrücklichem Einverständnis.

## Anpassung pro Kunde

Studioname, Adresse, Telefonnummer, Öffnungszeiten, Leistungen/Preise am Kopf der `index.html` ersetzen (siehe Kommentar). Bilder sind lizenzfreie Unsplash-Fotos — vor echtem Einsatz durch eigene Studiofotos ersetzen.

## Getestet

Rendering in Chromium geprüft (Hero-Animation, Behandlungszeilen inkl. Hover, Statement-Band, Kontakt-Split, mobile Leiste). Externe Bilder/Google-Fonts werden in der Entwicklungssandbox teils blockiert — auf einer echten Website laden sie normal.
