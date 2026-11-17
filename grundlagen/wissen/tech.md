# Wissen: Tech (GHL, n8n, Tracking)

Learnings zu Automationen, CRM, Tracking. Grundregeln stehen in `../../anleitungen/tech-stack.md`.

## Gelöste Probleme

- **Repo ist öffentlich** (githack braucht das). Deshalb nie echte Kundenordner, Anfragen oder
  Bankdaten ins Repo. PV-Kundenordner sind per `.gitignore` ausgeschlossen, Anfragen liegen in der
  Zentrale im Google-Konto des Nutzers. (Nov. 2026)
- **Knöpfe in Mails werden von Link-Scannern „geklickt“.** Die Zentrale ändert deshalb nichts beim
  ersten Aufruf, sondern zeigt eine Bestätigungsseite (Formular), erst der zweite Klick speichert.
- **Netlify-Webhook-Format ist kaum dokumentiert.** `Code.gs` liest beide Formen (mit und ohne
  `data`) und erkennt den Kunden am versteckten Feld `kunde`, sonst an `<kürzel>.netlify.app`.
  Doppelte Zustellungen werden über die Netlify-ID verworfen.
- **Netlify kostenlos = 300 Credits/Monat** (seit 2026: 15 je Upload, 20 je GB, Formulare frei).
  Reicht für ca. 3–4 Kunden; Fotos werden deshalb auf 1.600 px verkleinert.
- **Apps Script ohne Google testen:** `node zentrale/test/test.js` baut Tabellen, Mails, Zeitpläne und
  Uhr nach. Zeitzone im Test auf Europe/Berlin, sonst rutschen Monatsgrenzen.

## Offene Punkte / To-do

- _(noch leer)_

## Snippets / Referenzen

- GHL HTTP Request Header: `Version: 2021-07-28`, PIT.
- Pixel + CAPI Dedup über gemeinsame `event_id`; FBCLID als Hidden Field.
