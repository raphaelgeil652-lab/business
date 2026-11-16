# Vorlagen-System Photovoltaik

Alles, was du für einen PV-Kunden brauchst, als feste Dateien. Für jeden Kunden in Deutschland
gleich: **Steckbrief ausfüllen → ein Befehl → kompletter Kundenordner.**

## So legst du einen neuen Kunden an

1. **Einmalig:** [`tabellen/00-agentur-stammdaten.xlsx`](tabellen/00-agentur-stammdaten.xlsx)
   ausfüllen (dein Name, Anschrift, IBAN, Meta Business-ID …). Gilt für alle Kunden.
2. [`tabellen/01-steckbrief.xlsx`](tabellen/01-steckbrief.xlsx) kopieren und im Verkaufsgespräch
   ausfüllen. Die gelben Zellen sind die Eingaben, Spalte D zeigt das Format. Blatt
   „Pflichtcheck“ muss „Kunde passt“ zeigen.
3. Claude sagen: **„Lege den Kunden aus diesem Steckbrief an“** — oder selbst:
   ```
   python3 nischen/photovoltaik/vorlagen/werkzeuge/kunde-anlegen.py <steckbrief.xlsx>
   ```
4. Fertig ist `nischen/photovoltaik/kunden/<betrieb>/` mit Vereinbarung, Mails, Kampagnen,
   drei Anzeigen-Bildern, drei Landingpages, Onboarding- und Anfragen-Tabelle. Die `README.md`
   dort zeigt, was noch fehlt.
5. Sobald echte Fotos, Pixel-ID oder Landingpage-Adresse da sind: Fotos in `kunden/<betrieb>/fotos/`
   legen (Namen `1-modul.jpg`, `2-rabatt.jpg`, `3-speicher.jpg`), Steckbrief ergänzen und
   **dasselbe nochmal ausführen**. Tabellen und Fotos bleiben dabei erhalten.

## Was hier liegt

### Tabellen (ausfüllbar, Excel / Google Sheets / Numbers)

| Datei | Wofür | Wie oft |
|---|---|---|
| [`00-agentur-stammdaten.xlsx`](tabellen/00-agentur-stammdaten.xlsx) | deine Daten für Vertrag, Mails, Rechnungen | einmal |
| [`01-steckbrief.xlsx`](tabellen/01-steckbrief.xlsx) | alles über den Kunden, Pflichtcheck, interne Rechnung | pro Kunde |
| [`02-onboarding.xlsx`](tabellen/02-onboarding.xlsx) | 27 Schritte von Unterschrift bis Livegang, Fortschritt in % | pro Kunde (wird kopiert) |
| [`03-anfragen-und-report.xlsx`](tabellen/03-anfragen-und-report.xlsx) | jede Anfrage, Reaktionszeit, Werbekosten, **Monatsreport rechnet sich selbst** | pro Kunde (wird kopiert) |
| [`04-akquise-pv-betriebe.xlsx`](tabellen/04-akquise-pv-betriebe.xlsx) | PV-Betriebe in ganz Deutschland, Status, Pipeline | eine für alles |
| [`05-rechnungen.xlsx`](tabellen/05-rechnungen.xlsx) | alle Rechnungen, Fälligkeit, offen/überfällig/bezahlt | eine für alles |

Farben in allen Tabellen: **gelb = ausfüllen**, blaue Schrift = Eingabe, schwarz/grün = rechnet sich.
Jede Tabelle hat eine Beispielzeile in grauer Kursivschrift: überschreiben oder löschen.

### Texte (werden pro Kunde automatisch ausgefüllt)

| Datei | Wofür |
|---|---|
| [`vereinbarung.md`](texte/vereinbarung.md) | Vertrag, als PDF unterschreiben lassen |
| [`willkommens-mail.md`](texte/willkommens-mail.md) | Tag der Unterschrift: Fotos, Zugänge, Bestätigung der Verlosungen |
| [`rueckruf-leitfaden.md`](texte/rueckruf-leitfaden.md) | für das Büro des Kunden: Anruf in 6 Schritten, SMS, Rückmeldung |
| [`kampagnen.md`](texte/kampagnen.md) | Meta- und Google-Einstellungen, alle Anzeigentexte |
| [`teilnahmebedingungen.md`](texte/teilnahmebedingungen.md) | Entwurf, vor Livegang rechtlich prüfen |
| [`report-mail.md`](texte/report-mail.md) | monatlicher Report an den Kunden |
| [`abrechnung-mails.md`](texte/abrechnung-mails.md) | Onboarding-Rechnung, Start des Retainers |

### Texte (allgemein, für die Kundengewinnung)

| Datei | Wofür |
|---|---|
| [`akquise-verkaufsskript.md`](texte/akquise-verkaufsskript.md) | Erstanruf, Videocall, die zwei Fragen, Einwände, Abschluss aus der Ferne |
| [`akquise-nachfass-mails.md`](texte/akquise-nachfass-mails.md) | nach dem Anruf, nicht erreicht, nach dem Videocall |

### Anzeigen und Landingpages

| Datei | Wofür |
|---|---|
| [`anzeigen/anzeigen.html`](anzeigen/anzeigen.html) | die drei Anzeigen im festgelegten Stil (Verlosung Modul, 20 %, Speicher) |
| [`anzeigen/vorschau.html`](anzeigen/vorschau.html) | so sehen sie im Feed und bei Google aus |
| [`anzeigen/recherche.md`](anzeigen/recherche.md) | Recherche dazu, mit Quellen |
| [`landingpage/danke.html`](landingpage/danke.html) | Danke-Seite nach dem Absenden |
| [`assets/`](assets/) | Schrift (selbst gehostet) und Platzhalterfotos (CC0) |

### Werkzeuge

| Datei | Was es tut |
|---|---|
| [`werkzeuge/kunde-anlegen.py`](werkzeuge/kunde-anlegen.py) | Steckbrief → kompletter Kundenordner |
| [`werkzeuge/landingpages-bauen.py`](werkzeuge/landingpages-bauen.py) | die drei Verlosungsseiten (wird von kunde-anlegen aufgerufen) |
| [`werkzeuge/creatives-rendern.js`](werkzeuge/creatives-rendern.js) | Anzeigen-HTML → PNG in Meta-Größe |
| [`werkzeuge/tabellen-bauen.py`](werkzeuge/tabellen-bauen.py) | baut die leeren Tabellen neu (deine Stammdaten bleiben) |

## Regeln, die im System stecken

- **Einstieg sind nur die drei Verlosungen**, kein anderes Gratis-Angebot. Rabatt und Speicher
  gibt es für je 3 Gewinner zur ersten Bestellung, nicht für alle.
- **Kein fester Ort.** Anzeigen nennen keinen Ort; Kampagnen und Seiten nehmen den Ort aus dem Steckbrief.
- **Nichts erfinden.** Leere Felder erscheinen sichtbar als `[Feldname]`, nie als ausgedachter Wert.
- Pixel erst nach Zustimmung, Schrift selbst gehostet, keine Google Fonts.
- Teilnahmebedingungen sind ein Entwurf: vor dem ersten echten Einsatz prüfen lassen.
