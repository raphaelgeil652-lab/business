# Landingpage — eine Vorlage für alle Kunden

`index.html` ist **ein einziges File, das für jeden Kunden funktioniert.** Du tauschst nur die
Platzhalter und das Service-Modul. Genau das macht das Onboarding schnell genug, um zu skalieren.

## Personalisieren (~15 Minuten)

1. **Modul wählen** — nach dem Verkaufsgespräch klar (`../../service-module.md`).
2. **Kopie anlegen** und alle `[Platzhalter]` ersetzen:
   `[Betrieb]` `[Ort]` `[Telefon]` `[Adresse]` `[Leistung]` `[Kundenname]` `[Öffnungszeiten]`
3. **Headline + Subline aus dem Modul übernehmen.** Sie muss die Anzeige **wörtlich spiegeln**
   (Message Match) — sonst springen die Leute ab, weil sie glauben, falsch gelandet zu sein.
4. **Dropdown-Optionen** im Formular auf das Modul anpassen.
5. **Vorher/Nachher-Fotos einsetzen** — der wichtigste Schritt. Echte Fotos des Betriebs,
   keine Stockbilder. Mindestens 3 Paare, verschiedene Fahrzeugtypen.
6. **Bewertungen** durch echte Google-Bewertungen ersetzen.
   ⚠️ **Nie 5,0 anzeigen — maximal 4,9.** 5,0 wirkt gekauft (Playbook-Trustregel).
7. **FAQ-Antworten** mit seinen echten Angaben füllen (Preise, Dauer, Ersatzwagen).
8. **Impressum/Datenschutz** des Kunden verlinken.
9. `PIXEL_ID` eintragen (optional, kann am Anfang leer bleiben).

## Aufbau der Seite (und warum)

| Reihenfolge | Warum |
|---|---|
| 1. Hero + **Formular above the fold** | Er soll nicht suchen müssen |
| 2. **Vorher/Nachher** | Das stärkste Trust-Element der Branche |
| 3. Leistungen | Was konkret drin ist |
| 4. So einfach geht's | Nimmt die Unsicherheit „was passiert dann?" |
| 5. Bewertungen | Fremde bestätigen, was du behauptest |
| 6. FAQ | Räumt die letzten Abschluss-Bremsen weg |
| 7. Abschluss-CTA | Wer unten ankommt, darf nicht hochscrollen müssen |
| Sticky Bar (mobil) | Anrufen + Anfragen jederzeit erreichbar |

Begründung mit Quellen: `../../recherche-landingpages.md`.

## Hosten

Netlify, Drag & Drop. Sobald die Seite dort liegt, funktioniert das Formular automatisch
(Netlify Forms) und schickt die Anfragen per E-Mail.

Schritt-für-Schritt: `../../../../anleitungen/landingpage-hosten.md`

**Nach dem Hochladen unbedingt testen:**
- [ ] Formular absenden → landet auf `danke.html`
- [ ] Anfrage-Mail kommt an — **auch beim Kunden**, nicht nur bei dir
- [ ] Auf dem Handy prüfen: Formular sichtbar ohne Scrollen, Sticky-Bar da
- [ ] „Anrufen" wählt die richtige Nummer

## Formularfelder

Bewusst kurz gehalten — jedes zusätzliche Feld kostet Anfragen:
Name · Telefon · Fahrzeug (alle Pflicht) · Leistung (Dropdown) · E-Mail (optional).

Adresse, Kennzeichen und Wunschtermin fragt der Betrieb beim Rückruf ab.

**Ausnahme Modul 3 (Smart Repair):** Dort lohnt sich ein **Foto-Upload-Feld** — „Foto schicken,
Festpreis in 24 h" ist der stärkste Anker im Baukasten und braucht das Bild.

## Später: CRM statt E-Mail

Solange du wenige Kunden hast, reicht die E-Mail-Weiterleitung. Ab ca. 10 Kunden wird es unübersichtlich —
dann auf GoHighLevel + n8n umstellen (Speed-to-Lead per WhatsApp/SMS, CAPI-Tracking):
`../../../../anleitungen/ghl-n8n-aufbau.md`
