# Template: Friseur-Website (Homepage)

Volle Homepage für einen Friseursalon — modern, klar, mit Ortsbezug in Typografie/Struktur. Design-Entscheidungen: siehe `docs/design-standard.md`.

## Design

- Schriftpaarung: **Unbounded** (kräftige, geometrische Display-Schrift) + **Figtree** (Fließtext).
- Farbwelt: warmes Papier-Weiß/Graphit als Grund, kräftiges Kobaltblau als Akzent — bewusst anders als die anderen drei Nischen-Vorlagen (Zahnarzt: Grün/Honig, Fitness: Amber/Dunkel, Beauty: Rosenholz/Blush).
- **Ortsbezug als Gestaltungsmittel**: großes, halbtransparentes "PFULLENDORF"-Wasserzeichen im Hero und in der Schluss-CTA — macht den Standort selbst zum Design-Element, nicht nur zu Fließtext.
- Bento-Bildgrid für Arbeitsproben, Preisliste als klare Tabelle statt Karten.

## Anpassung pro Kunde

Salonname, Adresse, Telefonnummer, Öffnungszeiten, Leistungen/Preise am Kopf der `index.html` ersetzen (siehe Kommentar). Der Ortsname im Wasserzeichen (`PFULLENDORF`) muss beim Ortswechsel mit angepasst werden (zwei Stellen: `.locmark` und `.locmark2`). Bilder sind lizenzfreie Unsplash-Fotos — vor echtem Einsatz durch eigene Salonfotos ersetzen.

## Getestet

Rendering in Chromium geprüft (Layout, Bento-Grid, Preisliste, Hover-Zustände). Externe Bilder/Google-Fonts werden in der Entwicklungssandbox teils blockiert (Netzwerk-Restriktion) — auf einer echten Website laden sie normal.
