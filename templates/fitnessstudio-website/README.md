# Template: Fitnessstudio-Website (Homepage)

Volle Homepage (keine Landingpage) für ein Fitnessstudio — mehrere Abschnitte, echte Bildsprache, modernes/energisches Design. Design-Entscheidungen im Detail: siehe `docs/design-standard.md`.

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

Rendering in Chromium geprüft (Layout, Hover-Zustände, Bento-Kursplan, Preis-Karten, Schluss-CTA). Externe Bilder/Google-Fonts werden in der Entwicklungssandbox teils blockiert (Netzwerk-Restriktion) — auf einer echten Website laden sie normal.
