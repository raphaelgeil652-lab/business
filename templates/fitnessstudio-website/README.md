# Template: Fitnessstudio-Website (Homepage)

Volle Homepage (keine Landingpage) für ein Fitnessstudio — editorial, dunkel, energisch. Referenz-Vorlage der verschärften Design-Generation, siehe `docs/design-standard.md`.

## Design

- Schriftpaarung: **Bebas Neue** (riesige Condensed-Headlines) + **Manrope** (UI/Fließtext).
- Farbwelt: Kohle (#101214), Knochen (#EDEAE4), Signalorange (#E8542F) — kräftig, aber nicht die "Schwarz + Neongrün"-KI-Klischeekombination.
- Layout: Vollbild-Hero mit zeilenweisem Typo-Aufstieg, Zahlenband mit Linienraster, Trainingsbereiche als alternierende Vollbild-Zeilen mit Clip-Reveal, Preise als helle Großzeilen mit Dunkel-Hover-Invert, Zitat, geteilte Kontakt-Sektion, Sticky-Mobile-Leiste.
- Bewusst keine Karten-Grids, keine Pillen-Buttons, kein Label-über-Überschrift-Muster in jeder Sektion.

## Anpassung pro Kunde

Am Kopf der `index.html` steht ein Kommentar mit den Stellen, die pro Kunde ersetzt werden müssen:
- Studioname, Adresse, Telefonnummer, Öffnungszeiten
- Bilder (aktuell lizenzfreie Unsplash-Platzhalter — vor echtem Einsatz durch echte Fotos des Studios ersetzen)
- Kursplan, Preise, Trainer-Angaben durch echte Daten

## Bilder

Alle Bilder sind lizenzfreie Unsplash-Fotos, direkt per URL eingebunden (kein Download/Hosting nötig). Vor dem Verwenden weiterer Unsplash-Bilder: Bild-ID immer erst herunterladen und den tatsächlichen Inhalt prüfen, nicht blind aus dem Gedächtnis einfügen — sonst Risiko für falsche/unpassende Bilder.

## Warum diese Datei anders aussieht als die Zahnarzt-Landingpage

Das hier ist bewusst **keine** Landingpage, sondern die volle Website: mehrere Themen (Studio, Kurse, Preise, Kontakt), keine einzelne Suchintention, entsprechend mehr visuelle Tiefe (echte Fotos, kräftigere Typografie, Bewegung) als bei einer schlanken Ads-Landingpage.

## showcase.html — bewusste Maximal-Version, kein Kundentemplate

`showcase.html` ist eine übertriebene Design-Demo (Custom Cursor, Canvas-Partikel im Hero, Parallax, Laufband-Ticker, Glasflächen mit farbigen Blobs, Magnetic Buttons, Zähler-Animationen) — zeigt die technische/visuelle Obergrenze, wird aber bewusst **nicht** für echte Kundenprojekte eingesetzt. Für Kunden gilt weiterhin `index.html` nach `docs/design-standard.md` (Vertrauen vor Effekt). `showcase.html` eignet sich höchstens als Eindrucks-Demo im Erstgespräch, nicht als Liefergegenstand.

## Getestet

Rendering in Chromium geprüft (Hero-Animation, Zahlenband, Bereichs-Zeilen inkl. Clip-Reveal, Preiszeilen-Hover, Kontakt-Split, mobile Leiste). Externe Bilder/Google-Fonts werden in der Entwicklungssandbox teils blockiert (Netzwerk-Restriktion) — auf einer echten Website laden sie normal.
