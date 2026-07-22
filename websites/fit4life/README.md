# Website: fit4life Pfullendorf

Erstes Website-Referenzprojekt in der Nische Fitnessstudio. **Mehrseitige Website**
(Startseite + Unterseiten), statisch (HTML/CSS/JS, kein Build), direkt auf Vercel deploybar.
Design: Bebas Neue + Manrope, Kohle/Knochen/Signalorange. Auf KI-Slop geprüft mit dem
`impeccable`-Detektor (0 Anti-Patterns auf allen Seiten).

## Seiten

| Datei             | Inhalt                                                                    |
|-------------------|---------------------------------------------------------------------------|
| `index.html`      | Startseite: Hero, Zahlen, Bereiche, Wohlfühlen-Teaser, Preise, Statement, CTA |
| `kurse.html`      | Alle 10 Kurse (Index + Detailzeilen) + Kursplan-Platzhalter                |
| `studio.html`     | 570 m² Geräte, 120 m² Kurse, Sauna, Solarium, Café, Personal Training, Reha |
| `ueber-uns.html`  | Philosophie + Ansprechpartner Felix Staudacher                            |
| `kontakt.html`    | Adresse, Telefon, Öffnungszeiten, Karte, Anfrageformular                  |
| `assets/style.css`| Gemeinsames Design-System                                                  |
| `assets/main.js`  | Navigation (Mobile-Menü), Header-Scroll, Reveal-Animationen, Jahr         |
| `vercel.json`     | `cleanUrls` für saubere URLs (`/kurse` statt `/kurse.html`)               |

## Lokal ansehen

`index.html` im Browser öffnen, oder:

```
cd websites/fit4life
python3 -m http.server 8000   # -> http://localhost:8000
```

## Auf Vercel deployen

Reine statische Seite, **kein Build**.

1. **Repo verbinden (empfohlen):** Vercel „Add New… → Project", dieses Repo wählen,
   **Root Directory** = `websites/fit4life`, Framework Preset „Other", Deploy.
2. **Drag & Drop:** Ordner `websites/fit4life` ins Vercel-Dashboard ziehen.
3. **CLI:** im Ordner `vercel --prod`.

Immer den **Website-Ordner selbst** als Root Directory setzen, nicht die Repo-Wurzel.

## VOR ECHTEM LIVE-GANG ersetzen (im Code mit `[ … ]` / Klasse `.todo` markiert)

- [ ] **Telefon 07771 875275 verifizieren** – Vorwahl 07771 = Stockach, nicht Pfullendorf (07552). Bestätigen, dann alle `tel:`-Links + Anzeigetexte anpassen.
- [ ] **Öffnungszeiten** (kontakt.html)
- [ ] **Preise** (Startseite, Abschnitt Mitgliedschaft)
- [ ] **E-Mail** (kontakt.html + evtl. Footer)
- [ ] **Fotos**: Gerätefläche, Kursraum, Studio-Einblick, Über-uns, Felix-Foto sind Unsplash-Platzhalter – beim Vor-Ort-Termin durch echte fit4life-Fotos ersetzen.
- [ ] **Hero-Video** (`assets/hero.mp4`): dezentes Hintergrund-Video hinter der Startseiten-Headline. Aktuell ein ruhiger Platzhalter-Clip – beim Fototermin ein entspanntes Studio-Video drehen (leise, wenig Bewegung) und unter gleichem Namen `assets/hero.mp4` ablegen; `assets/hero-poster.jpg` als Standbild/Fallback ersetzen. Läuft stumm, in Endlosschleife; bei „Reduced Motion" wird automatisch nur das Poster gezeigt.
- [ ] **Kursplan** (Wochenzeiten) in kurse.html
- [ ] **Google-Maps-Einbettung** in kontakt.html
- [ ] **Kontaktformular** an Versanddienst anbinden (Formspree/Netlify Forms o. ä.)
- [ ] **Impressum & Datenschutz** (rechtlich Pflicht) – `impressum.html` / `datenschutz.html` anlegen (im Footer verlinkt)

## Hinweis

„Webseite" = diese mehrseitige Website. Landingpages (einzelne Ads-Seiten) werden
getrennt gepflegt und sind **nicht** Teil dieses Ordners.

Datenquelle Inhalte: `templates/fitnessstudio-landingpage/kunde-fit4life-brief.md`.
