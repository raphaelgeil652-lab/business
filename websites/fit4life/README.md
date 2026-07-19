# Website: fit4life Pfullendorf

Erstes Website-Referenzprojekt in der Nische Fitnessstudio. Statische Website
(HTML/CSS/JS, keine externen Abhaengigkeiten) – direkt hostbar oder als Vorlage
fuer Webflow/WordPress uebertragbar.

## Seiten

| Datei             | Inhalt                                                        |
|-------------------|---------------------------------------------------------------|
| `index.html`      | Startseite: Hero, Angebotsueberblick, Warum, Kurs-Teaser, CTA |
| `kurse.html`      | Alle Kurse mit Beschreibung + Kursplan-Platzhalter            |
| `studio.html`     | Ausstattung: Geraete, Kursflaeche, Sauna, Solarium, Cafe, PT  |
| `ueber-uns.html`  | Philosophie + Team (Felix Staudacher)                         |
| `kontakt.html`    | Adresse, Telefon, Oeffnungszeiten, Karte, Anfrageformular     |
| `assets/style.css`| Zentrales Stylesheet (Design-System)                          |
| `assets/main.js`  | Mobile-Navigation + Jahr im Footer                            |

## Lokal ansehen

Einfach `index.html` im Browser oeffnen. Oder lokaler Server:

```
cd websites/fit4life
python3 -m http.server 8000
# -> http://localhost:8000
```

## NOCH zu ergaenzen (Platzhalter im Code mit `[ ]` und CSS-Klasse `.ph` markiert)

Alle Platzhalter sind orange/kursiv dargestellt und leicht per Suche nach `ph`
bzw. `[` auffindbar.

- [ ] **Oeffnungszeiten** (kontakt.html + Footer-Hinweis)
- [ ] **Telefonnummer bestaetigen** – 07771 875275 hat Vorwahl Stockach, nicht
      Pfullendorf (07552). Beim Kunden verifizieren, dann in allen Seiten + `tel:`-Links korrigieren.
- [ ] **E-Mail-Adresse** (kontakt.html + evtl. Footer)
- [ ] **Fotos**: Studio, Geraetflaeche, Kursraum, Sauna/Solarium/Cafe, Team –
      gemeinsam vor Ort aufnehmen und `media-ph`-Platzhalter ersetzen.
- [ ] **Kursplan** (Wochenzeiten/Trainer) als Tabelle in kurse.html
- [ ] **Reha-Sport**: Kassen-/Verordnungsinfos ergaenzen
- [ ] **Team**: weitere Mitglieder + O-Ton von Felix (ueber-uns.html)
- [ ] **Preise / Mitgliedschaften** (optional eigene Seite, falls gewuenscht)
- [ ] **Google-Maps-Einbettung** (Anfahrt in kontakt.html)
- [ ] **Kontaktformular** an Versanddienst anbinden (z. B. Formspree / Netlify
      Forms) oder serverseitig verarbeiten – aktuell nur Platzhalter ohne Versand.
- [ ] **Impressum & Datenschutz** (rechtlich verpflichtend!) – Seiten
      `impressum.html` / `datenschutz.html` anlegen (im Footer bereits verlinkt).
- [ ] **Social-Links** (Instagram/Facebook), falls vorhanden

## Design

- Farbschema: dunkles Anthrazit + Limegruen-Akzent (energetisch, modern).
  Zentral in `assets/style.css` unter `:root` aenderbar (z. B. an echte
  fit4life-Markenfarben anpassen, falls vorhanden).
- Mobile-first, responsiv, mit Burger-Menue.
- Platzhalter-Farbe (`--accent-2`, orange) macht offene Stellen bewusst sichtbar –
  nach dem Befuellen kann die `.ph`-Hervorhebung entfernt werden.

## Datenquelle

Inhalte basieren auf `templates/fitnessstudio-landingpage/kunde-fit4life-brief.md`.
