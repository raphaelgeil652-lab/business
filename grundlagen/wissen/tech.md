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
- **Excel kürzt lange Zahlen und Nullen.** Meta-IDs (16 Stellen) verlieren die letzte Ziffer (wird 0),
  Telefon 0152… wird 152…, PLZ 01067 wird 1067. Die Steckbrief-Vorlage speichert Textfelder deshalb als
  Text, und `kunde-anlegen.py` repariert Telefon/PLZ und warnt bei IDs, die auf 0 enden. (Probelauf Nov. 2026)
- **Probelauf Zentrale (Nov. 2026), zwei Stolpersteine:** (1) beim Bereitstellen die Bereitstellungs-ID
  statt der Web-App-URL kopiert → „Datei kann derzeit nicht geöffnet werden“; (2) in Netlify die
  Web-App-Adresse ohne `?key=` eingetragen → Zentrale lehnt still ab. Schnelltest von außen:
  GET auf die /exec-Adresse muss „Diese Adresse ist in Ordnung“ zeigen; POST ohne Schlüssel antwortet
  „falscher Schlüssel“, mit Schlüssel „ok“. Ob Netlify ankommt: Apps Script → Ausführungen → „doPost“.
- **Netlify kostenlos war nach zwei Testkunden leer** (Probelauf 2, 18.11.2026): „running on operational
  credits“, neue Uploads gesperrt, bestehende Seiten bleiben online. Ab dem ersten echten Kunden Tarif
  „Personal“ (ca. 9 $/Monat) einplanen.
- **Apps Script ohne Google testen:** `node zentrale/test/test.js` baut Tabellen, Mails, Zeitpläne und
  Uhr nach. Zeitzone im Test auf Europe/Berlin, sonst rutschen Monatsgrenzen.

## Offene Punkte / To-do

- _(noch leer)_

## Snippets / Referenzen

- GHL HTTP Request Header: `Version: 2021-07-28`, PIT.
- Pixel + CAPI Dedup über gemeinsame `event_id`; FBCLID als Hidden Field.
