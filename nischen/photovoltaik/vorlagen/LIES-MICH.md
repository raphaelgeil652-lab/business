# Vorlagen-System Photovoltaik

Wie das System gebaut ist. **Für den Ablauf mit dem Kunden gilt die
[Anleitung](../ANLEITUNG.md).** Diese Seite brauchst du nur, wenn du wissen willst, was wo liegt
und warum.

Prinzip: **Steckbrief ausfüllen → ein Befehl → kompletter Kundenordner.** Für jeden Kunden in
Deutschland gleich.

```
python3 nischen/photovoltaik/vorlagen/werkzeuge/kunde-anlegen.py <steckbrief.xlsx>
```

Oder Claude sagen: „Lege den Kunden aus diesem Steckbrief an.“ Mehrfach ausführen ist erlaubt:
Erzeugte Dateien werden ersetzt, `tabellen/` und `fotos/` im Kundenordner bleiben erhalten.

## Zwei Kampagnenarten

| | Dauerkampagne: Wirtschaftlichkeitsprüfung | Saisonaktion: Verlosung |
|---|---|---|
| Wann | das ganze Jahr | 2–3 × im Jahr, Steckbrief Teil 5 = Ja |
| Anzeigen | 5 (Vorher/Nachher, Abschlag, Prüfung, Rechner, 20 Jahre) | 3 (Modul, 20 %, Speicher) |
| Seiten | `wirtschaftlichkeit.html`, `rechner.html` | `modul.html`, `rabatt.html`, `speicher.html` |
| Prinzip | Beispielrechnung im Bild, **Prüfung erst nach Eintragung** | 1 Modul bzw. je 3 Gewinner, zur ersten Bestellung |

Die Beispielzahlen stehen an **einer** Stelle: [`rechengrundlage.json`](rechengrundlage.json).
Einmal im Jahr prüfen, dann alle Kunden neu erzeugen.

## Tabellen

| Datei | Wofür | Wie oft |
|---|---|---|
| [`00-agentur.xlsx`](tabellen/00-agentur.xlsx) | deine Daten · alle Rechnungen · Rechnung zum Drucken (Umsatzsteuer und Nummer rechnen sich) | eine für alles |
| [`01-steckbrief.xlsx`](tabellen/01-steckbrief.xlsx) | alles über den Kunden auf einem Blatt, prüft selbst, ob er passt, schlägt das Budget vor | pro Kunde kopieren |
| [`02-checkliste-bis-livegang.xlsx`](tabellen/02-checkliste-bis-livegang.xlsx) | 17 Haken, gleiche Schritte wie die Anleitung | wird pro Kunde kopiert |
| [`03-anfragen-und-report.xlsx`](tabellen/03-anfragen-und-report.xlsx) | jede Anfrage, Rückrufzeit, Monatsreport mit fertiger Mail | wird pro Kunde kopiert |
| [`04-akquise-pv-betriebe.xlsx`](tabellen/04-akquise-pv-betriebe.xlsx) | Betriebe zum Anrufen, wer heute dran ist | eine für alles |

Gelb = ausfüllen. Alles andere rechnet sich. Die versteckte Spalte A im Steckbrief und in
„Deine Daten“ liest das Werkzeug aus.

### Was im Steckbrief steht und warum

Nur Felder, die irgendwo gebraucht werden:

| Teil | Felder | Wofür |
|---|---|---|
| 1 · Im Gespräch | Betrieb, Inhaber, Telefon, E-Mail, Ort, Umkreis, Auftragswert, Termine pro Woche, 3 Ja-Fragen | Anzeigen, Seiten, Werbegebiet, Budget, Entscheidung „passt er?“ |
| 2 · Vereinbarung | Firmenname, Adresse, Geschäftszeiten, eigenes Team?, Preise, Budget, Prüfungsdauer, Datum, Drive-Ordner | Vertrag, Seiten, Anzeigentexte („eigene Montageteams“ nur bei Ja), Willkommens-Mail (wohin die Fotos kommen) |
| 3 · Vom Kunden | Links zu Impressum und Datenschutz, 2 echte Bewertungen | Fußzeile und Bewertungs-Block der Seiten (ohne Bewertung fällt der Block weg) |
| 4 · Nach dem Hochladen | Adresse der Seiten, Pixel-ID | Kampagnen-Ziele, Pixel auf den Seiten |
| 5 · Verlosung | läuft?, Teilnahmeschluss, Ziehung, Speicher | Verlosungs-Anzeigen, -Seiten, Teilnahmebedingungen |

**Budgetregel:** Auftragswert ÷ 5, zum Start höchstens 3.000 € (ohne Auftragswert 3.000 €),
70 % Meta, 30 % Google. Unter 2.500 € warnt das Blatt „Rechnung intern“. Es rechnet auch aus,
wie viele Beratungstermine pro Woche das Budget bringt. Schafft der Betrieb weniger, zeigt
das Ergebnis „⚠ Kapazität zu klein“.

## Texte (werden pro Kunde automatisch ausgefüllt)

| Datei | Wofür |
|---|---|
| [`vereinbarung.md`](texte/vereinbarung.md) | Vertrag, als PDF unterschreiben lassen |
| [`abrechnung-mails.md`](texte/abrechnung-mails.md) | Rechnung Onboarding, Start der Monatsgebühr, jeden Monat |
| [`willkommens-mail.md`](texte/willkommens-mail.md) | Tag der Unterschrift: genau die 4 Dinge, die gebraucht werden |
| [`rueckruf-leitfaden.md`](texte/rueckruf-leitfaden.md) | für das Büro des Kunden: Anruf, SMS, Rückmeldung |
| [`kampagnen.md`](texte/kampagnen.md) | Meta- und Google-Einstellungen, alle Anzeigentexte |
| [`report-mail.md`](texte/report-mail.md) | zeigt, wie die Monatsmail aussieht (sie entsteht in der Tabelle) |
| [`teilnahmebedingungen.md`](texte/teilnahmebedingungen.md) | nur bei Verlosung |
| [`_kunden-readme.md`](texte/_kunden-readme.md) | Übersicht im Kundenordner mit „Noch offen“ |

Allgemein für die Kundengewinnung: [`akquise-verkaufsskript.md`](texte/akquise-verkaufsskript.md),
[`akquise-nachfass-mails.md`](texte/akquise-nachfass-mails.md).

Bedingte Blöcke in den Vorlagen: `<!--VERLOSUNG-->`, `<!--BEWERTUNGEN-->`, `<!--VORHERNACHHER-->`.
Sie bleiben nur stehen, wenn das jeweilige Feld oder Foto da ist.

## Anzeigen, Seiten, Fotos

| Datei | Wofür |
|---|---|
| [`anzeigen/wirtschaftlichkeit.html`](anzeigen/wirtschaftlichkeit.html) | 5 Anzeigen der Dauerkampagne |
| [`anzeigen/verlosungen.html`](anzeigen/verlosungen.html) | 3 Verlosungs-Anzeigen |
| [`anzeigen/vorschau.html`](anzeigen/vorschau.html) | so sehen sie im Feed und bei Google aus |
| [`landingpage/`](landingpage/) | Wirtschaftlichkeitsprüfung, Rechner, Danke-Seite; Verlosungsseiten baut [`werkzeuge/landingpages-bauen.py`](werkzeuge/landingpages-bauen.py) |
| [`assets/`](assets/) | Schrift (selbst gehostet) und Platzhalterfotos (CC0) |

Fotos im Kundenordner unter `fotos/`: `foto-1.jpg` bis `foto-3.jpg` (Titelbilder der Anzeigen und
Seiten), dazu wenn vorhanden `vorher.jpg` und `nachher.jpg` (dasselbe Dach, Block auf den Seiten).

## Werkzeuge

| Datei | Was es tut |
|---|---|
| [`werkzeuge/kunde-anlegen.py`](werkzeuge/kunde-anlegen.py) | Steckbrief → kompletter Kundenordner, warnt bei offenen Feldern und wenn der Kunde nicht passt |
| [`werkzeuge/landingpages-bauen.py`](werkzeuge/landingpages-bauen.py) | die drei Verlosungsseiten (ruft kunde-anlegen auf) |
| [`werkzeuge/creatives-rendern.js`](werkzeuge/creatives-rendern.js) | Anzeigen-HTML → PNG in Meta-Größe |
| [`werkzeuge/tabellen-bauen.py`](werkzeuge/tabellen-bauen.py) | baut die leeren Tabellen neu (`00-agentur.xlsx` mit deinen Daten bleibt) |

## Regeln, die im System stecken

- **Dauerhaft läuft die Wirtschaftlichkeitsprüfung**, die es erst nach der Eintragung gibt.
  **Verlosungen nur 2–3 × im Jahr**; Rabatt und Speicher für je 3 Gewinner, nicht für alle.
- **Zahlen nur als gekennzeichnete Beispielrechnung** mit Annahmen und Quelle, nie als Zusage.
- **Kein fester Ort.** Anzeigen nennen keinen Ort; Kampagnen und Seiten nehmen ihn aus dem Steckbrief.
- **Nichts erfinden.** Leere Pflichtfelder erscheinen sichtbar als `[Feldname]` und stehen in der
  README unter „Noch offen“. Bewertungen und Vorher/Nachher fallen ohne echtes Material ganz weg.
  „Eigene Montageteams“ steht nur da, wenn der Steckbrief Ja sagt.
- Pixel erst nach Zustimmung, Schrift selbst gehostet, keine Google Fonts.
