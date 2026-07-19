# Template: Friseur-Website (Homepage)

Volle Homepage für einen Friseursalon — editorial, warm, auf ein Ziel gerichtet (Termin). Referenz-Vorlage der verschärften Design-Generation, siehe `docs/design-standard.md`.

## Design

- Schriftpaarung: **Instrument Serif** (große Editorial-Headlines mit Kursiv-Akzenten) + **Archivo** (UI/Fließtext).
- Farbwelt: Papier (#F2ECE3), Espresso-Schwarz (#16120F), Bronze (#C98A4B) — aus dem warmen Licht der Barbershop-Bildwelt abgeleitet.
- Layout: Vollbild-Hero mit zeilenweisem Typo-Aufstieg, Statement-Sektion mit überlappendem Bild, asymmetrische zweispaltige Arbeits-Collage (versetzt), Preise als große dunkle Zeilen mit Bronze-Hover-Invert, geteilte Kontakt-Sektion (Bild + Infotabelle), Sticky-Mobile-Leiste (Anrufen/Termin).
- Bewusst keine Karten-Grids, keine Pillen-Buttons, kein Label-über-Überschrift-Muster in jeder Sektion.

## Anpassung pro Kunde

Salonname, Adresse, Telefonnummer, Öffnungszeiten, Preise und Bewertungszahl am Kopf der `index.html` ersetzen (siehe Kommentar). Bilder sind lizenzfreie Unsplash-Fotos — vor echtem Einsatz durch eigene Salonfotos ersetzen.

## Getestet

Rendering in Chromium geprüft (Hero-Animation, Clip-Reveals, Preiszeilen-Hover, Kontakt-Split, mobile Leiste). Externe Bilder/Google-Fonts werden in der Entwicklungssandbox teils blockiert — auf einer echten Website laden sie normal.
