# Website: fit4life Pfullendorf

Erstes Website-Referenzprojekt in der Nische Fitnessstudio. Editoriale One-Page-Homepage
nach `docs/design-standard.md` (Bebas Neue + Manrope, Kohle/Knochen/Signalorange,
ein Konversionsziel: Probetraining). Statisch, ohne Build, direkt auf Vercel deploybar.

Auf KI-Slop geprüft mit dem `impeccable`-Detektor (0 Anti-Patterns).

## Dateien

| Datei          | Inhalt                                                                 |
|----------------|------------------------------------------------------------------------|
| `index.html`   | Komplette Homepage (Hero, Zahlen, Bereiche, Wohlfühlen, Kurse, Preise, Statement, Kontakt) – Styles & JS inline |
| `vercel.json`  | `cleanUrls` für saubere URLs                                            |

## Seiten-Aufbau (Sektionen der One-Page)

1. **Hero** – Vollbild, „Fit fürs Leben", zeilenweiser Typo-Aufstieg
2. **Zahlenband** – 570 m² / 120 m² / 10 Kursformate
3. **Bereiche** – Gerätetraining & Kurse als Vollbild-Zeilen mit Bild
4. **Mehr als nur Geräte** – Sauna, Solarium, Café, Personal Training, Reha (editoriale Zeilenliste)
5. **Kurse** – alle 10 Kursformate als Typo-Index
6. **Preise** – Zeilen mit Hover-Invert (Probetraining gratis, Rest als Platzhalter)
7. **Statement** – ehrlicher Studio-Leitsatz (kein erfundenes Kundenzitat)
8. **Besuch/Kontakt** – Bild + Infotabelle, Anrufen + Route planen
9. **Footer + Sticky-Mobile-Leiste** (Anrufen / Probetraining)

## Lokal ansehen

`index.html` im Browser öffnen, oder:

```
cd websites/fit4life
python3 -m http.server 8000   # -> http://localhost:8000
```

## Auf Vercel deployen

Reine statische Seite, **kein Build**. `vercel.json` sorgt für saubere URLs.

1. **Repo verbinden (empfohlen):** Vercel „Add New… → Project", dieses Repo wählen,
   **Root Directory** = `websites/fit4life`, Framework Preset „Other", Deploy.
2. **Drag & Drop:** Ordner `websites/fit4life` ins Vercel-Dashboard ziehen.
3. **CLI:** im Ordner `vercel --prod`.

Immer den **Website-Ordner selbst** als Root Directory setzen, nicht die Repo-Wurzel.

## VOR ECHTEM LIVE-GANG ersetzen (im Code mit `[ … ]` / Klasse `.todo` markiert)

- [ ] **Telefon 07771 875275 verifizieren** – Vorwahl 07771 = Stockach, nicht Pfullendorf (07552). Beim Kunden bestätigen, dann alle `tel:`-Links + Anzeigetexte korrigieren.
- [ ] **Öffnungszeiten** (Besuch-Sektion)
- [ ] **Preise** (Mitgliedschaft, Personal Training)
- [ ] **E-Mail** ergänzen (aktuell nur Telefon + Route)
- [ ] **Fotos**: Hero, Gerätefläche, Kursraum, Besuch-Bild sind lizenzfreie Unsplash-Platzhalter – beim Vor-Ort-Termin durch echte fit4life-Fotos ersetzen.
- [ ] **Kursplan** (Wochenzeiten) in der Kurse-Sektion ergänzen
- [ ] **Impressum & Datenschutz** (rechtlich Pflicht) – `impressum.html` / `datenschutz.html` anlegen (im Footer verlinkt)

## Design-Quelle

Inhalte: `templates/fitnessstudio-landingpage/kunde-fit4life-brief.md`.
Design-Sprache & verbotene KI-Muster: `docs/design-standard.md`.
Genutzte Skills: `impeccable`, `taste-skill` (in `.agents/skills/` / `.claude/skills/`).
