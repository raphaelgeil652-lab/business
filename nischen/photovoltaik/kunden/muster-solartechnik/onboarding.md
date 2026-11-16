# Onboarding — Muster Solartechnik

> ⚠️ **FIKTIVER PROBEKUNDE.** Checkliste aus dem Betriebshandbuch, mit dem echten Stand.
> Stufe 1: Landingpage + E-Mail-Weiterleitung, kein CRM.

Stand: 16.11.2026

## Am Tag der Unterschrift

- [x] Steckbrief mit allen Antworten aus dem Gespräch → [`steckbrief.md`](steckbrief.md)
- [x] Vereinbarung ausgefüllt → [`vereinbarung.md`](vereinbarung.md)
- [ ] **Du:** Preise bestätigen oder ändern (Vorschlag 850 € / 1.500 € / 1.000 € Budget)
- [ ] **Du:** Vereinbarung unterschreiben lassen, Onboarding-Rechnung stellen
- [x] Willkommens-Mail geschrieben → [`willkommens-mail.md`](willkommens-mail.md)
- [ ] **Du:** Willkommens-Mail abschicken, Drive-Ordner anlegen und verlinken

## Bis Tag 3: Material und Zugänge (wartet auf den Kunden)

- [ ] Fotos: mindestens 3 Paare Dach vorher/nachher
- [ ] Videos: Montage (für Anzeige A), Inhaber 20 s (für Anzeige B, Skript in `kampagnen.md`)
- [ ] Meta-Partnerzugriff auf Seite, Werbekonto, Pixel
- [ ] Google-Ads-Partnerzugriff
- [ ] Logo, Telefon, Adresse, Geschäftszeiten
- [ ] Preisspanne, Montagedauer, Vorlauf bis zur Montage
- [ ] Freigabe für die Aussage „0 % Mehrwertsteuer bis 30 kWp“ (Anzeige C)
- [ ] Google-Profil-Link für die Bewertungen
- [ ] Impressum und Datenschutzerklärung (muss Meta-Pixel und Netlify Forms nennen)

Nach 3 Tagen ohne Material: anrufen. Notfalls die nächste Montage selbst fotografieren.

## Einrichtung

- [x] PV-Modul geschrieben → [`../../modul-photovoltaik.md`](../../modul-photovoltaik.md)
- [x] Landingpage personalisiert, mit Platzhaltern für alles, was vom Kunden kommt → [`landingpage/`](landingpage/)
- [x] Anzeigentexte Meta (3) und Google (15 Überschriften, 4 Beschreibungen) → [`kampagnen.md`](kampagnen.md)
- [x] Kampagnen-Einstellungen Meta und Google festgelegt → [`kampagnen.md`](kampagnen.md)
- [ ] **Du (einmalig):** Meta Business Portfolio anlegen, Zwei-Faktor an, Business-ID in die Mail
- [ ] **Du (einmalig):** Netlify-Konto und Google-Ads-Verwaltungskonto anlegen
- [ ] Platzhalter auf der Landingpage füllen, sobald das Material da ist
- [ ] Landingpage auf Netlify hosten, E-Mail-Benachrichtigung an Kunde **und** Agentur
- [ ] Pixel-ID in `index.html` und `danke.html` eintragen
- [ ] Creatives schneiden (Videoschnitt-Werkzeug im Repo) und hochladen
- [ ] Kampagnen in Meta und Google anlegen, noch pausiert

## Vor dem Livegang

- [ ] Test-Anfrage über die Landingpage → Danke-Seite erscheint
- [ ] Anfrage-Mail kommt beim Büro des Kunden an (erste oft im Spam)
- [ ] Am Handy: Formular sichtbar, Anrufen-Knopf wählt die richtige Nummer
- [ ] Zustimmungs-Hinweis: Pixel lädt erst nach „Einverstanden“ (im Meta Events Manager prüfen)
- [ ] Hygiene-Regeln in Meta geprüft

## Livegang

- [ ] Kampagnen aktiv, Datum hier notieren: [__] (Start der 30-Tage-Garantie)
- [ ] Kunde informiert: „Ab jetzt kommen Anfragen, bitte innerhalb einer Stunde zurückrufen.“
- [ ] Wöchentlicher Kurzanruf vereinbart: Was wurde aus jeder Anfrage?
- [ ] Ersten Report-Termin vereinbart

## Was beim Probelauf aufgefallen ist (für die Learnings)

- Die Kfz-Landingpage-Vorlage lädt Google Fonts von Google-Servern und setzt das Meta-Pixel ohne
  Zustimmung. Beides ist in Deutschland ein Abmahnrisiko. Die PV-Seite macht es richtig, die
  Vorlage sollte nachgezogen werden.
- Bei PV ist der erste Auftrag Wochen entfernt. „Retainer erst ab dem ersten Auftrag“ heißt hier
  1–2 Monate ohne Retainer. Preisfrage vor dem ersten echten Kunden klären.
- Für PV gibt es kaum deutsche Zahlen zu Kosten pro Anfrage. Die ersten 20–50 Anfragen sind
  die eigentliche Datengrundlage.
