# Template: Beautysalon-Website (Homepage)

Volle Homepage für ein Kosmetik-/Nagelstudio — warm, weich, Fokus auf Behandlungen. Design-Entscheidungen: siehe `docs/design-standard.md`.

## Design

- Schriftpaarung: **Cormorant Garamond** (elegant, kursiv für Headlines) + **Karla** (Fließtext).
- Farbwelt: warmes Blush/Creme als Grund, Rosenholz als Hauptakzent, Gold als Zweitakzent — bewusst nicht die generische Creme+Terrakotta-Kombination.
- Bento-Bildgrid bei den Behandlungen, sanfte Eintritts-Animation im Hero (keine aggressive Bewegung — passend zur "weichen" Markenwirkung).

## Wichtig: "Deine Verwandlung"-Abschnitt

Der Abschnitt ist bewusst als **Platzhalter** gebaut, nicht mit Stockfotos als angebliche Vorher-Nachher-Ergebnisse befüllt — das wäre irreführend, da die Bilder nicht von echten Kund:innen dieses (fiktiven) Studios stammen. Vor dem Live-Gang bei einem echten Kunden: durch echte Vorher-Nachher-Fotos ersetzen, nur mit ausdrücklichem Einverständnis der abgebildeten Person.

## Anpassung pro Kunde

Studioname, Adresse, Telefonnummer, Öffnungszeiten, Leistungen/Preise am Kopf der `index.html` ersetzen (siehe Kommentar). Bilder sind lizenzfreie Unsplash-Fotos — vor echtem Einsatz durch eigene Studiofotos ersetzen.

## Getestet

Rendering in Chromium geprüft (Layout, Bento-Grid, Hover-Zustände, Preiskarten). Externe Bilder/Google-Fonts werden in der Entwicklungssandbox teils blockiert (Netzwerk-Restriktion) — auf einer echten Website laden sie normal.
