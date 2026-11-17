# Vorlagen-System Photovoltaik (Technik)

Wie das System gebaut ist. **Für den Ablauf mit dem Kunden gilt die [Anleitung](../ANLEITUNG.md).**
Diese Seite ist für Claude und für dich, wenn du wissen willst, was wo liegt und warum.

## Die drei Teile

| Teil | Wo | Was |
|---|---|---|
| **Steckbrief** | [`tabellen/01-steckbrief.xlsx`](tabellen/01-steckbrief.xlsx) | Die Quelle für alles pro Kunde. Blätter: „Steckbrief“ (prüft selbst, ob der Kunde passt, schlägt das Budget vor), „Rechnung intern“, „Deine Daten“ (einmal in der Vorlage ausfüllen) |
| **Kunde-anlegen** | [`werkzeuge/kunde-anlegen.py`](werkzeuge/kunde-anlegen.py) | Steckbrief (+ Fotos) → kompletter Kundenordner |
| **Zentrale** | [`../../../zentrale/`](../../../zentrale/) | Google-Tabelle mit Automatik: Anfragen, Erinnerungen, Stand, Checkliste, Werbekosten, Reports, Rechnungen, Akquise |

## Ein neuer Kunde (was Claude tut)

```
python3 nischen/photovoltaik/vorlagen/werkzeuge/kunde-anlegen.py <steckbrief.xlsx> [fotos ...]
python3 werkzeuge/clickculture-ordner-bauen.py --kunde <kürzel> <ausgabeordner>
```

Das erste baut `kunden/<kürzel>/`, das zweite macht daraus den Finder-Ordner mit sprechenden
Dateinamen als ZIP für den Nutzer. Mehrfach ausführen ist gewollt. **Echte Kundenordner kommen
nicht ins Repo** (öffentlich, `.gitignore`); nur der fiktive `muster-solartechnik` liegt drin. Die
Quelle bleibt der Steckbrief beim Nutzer, er schickt ihn bei jeder Änderung mit.

Fotos werden nach Namen zugeordnet (`foto-1` … `foto-3` = Titelbilder, `vorher`, `nachher`), sonst der
Reihe nach als foto-1 … foto-3. Jedes Format (auch HEIC vom iPhone), gedreht wie aufgenommen, auf
1.600 px verkleinert. Fehlende Titelbilder sind Platzhalter (CC0) und stehen unter „Noch offen“.

## Was im Steckbrief steht und warum

Nur Felder, die irgendwo gebraucht werden. Neues Feld nur, wenn eine Vorlage es nutzt.

| Teil | Felder | Wofür |
|---|---|---|
| 1 · Im Gespräch | Betrieb, Inhaber, Telefon, E-Mail, Ort, Umkreis, Auftragswert, Termine pro Woche, 3 Ja-Fragen | Anzeigen, Seiten, Werbegebiet, Budget, Entscheidung „passt er?“ |
| 2 · Vereinbarung | Firmenname, Adresse, Geschäftszeiten, eigenes Team?, Preise, Budget, Prüfungsdauer, Datum, Drive-Ordner | Vertrag, Seiten, Anzeigentexte („eigene Montageteams“ nur bei Ja), Willkommens-Mail, Zentrale |
| 3 · Vom Kunden | Links zu Impressum und Datenschutz, 2 echte Bewertungen | Fußzeile und Bewertungs-Block der Seiten (ohne Bewertung fällt der Block weg) |
| 4 · Zum Einrichten | Pixel-ID, Google-Conversion, eigene Adresse (nur falls nötig) | Messung auf den Seiten; Adresse sonst `https://<kürzel>.netlify.app` |
| 5 · Verlosung | läuft?, Teilnahmeschluss, Ziehung, Speicher | Verlosungs-Anzeigen, -Seiten, Teilnahmebedingungen |
| Deine Daten | Agentur, Name, Anschrift, E-Mail, Telefon, Kleinunternehmer, Meta-Business-ID, Google-Verwaltungskonto | Vertrag, Mails. IBAN und Steuernummer stehen nur in der Zentrale (für Rechnungen) |

**Budgetregel:** Auftragswert ÷ 5, zum Start höchstens 3.000 € (ohne Auftragswert 3.000 €), 70 % Meta,
30 % Google. Unter 2.500 € warnt „Rechnung intern“. Dort steht auch, wie viele Beratungstermine pro
Woche das Budget bringt; schafft der Betrieb weniger, zeigt das Ergebnis „⚠ Kapazität zu klein“.

## Der Kundenordner

| Im Repo | Im Finder (ZIP) | Wann |
|---|---|---|
| `README.md` | 0 Übersicht – was noch fehlt | immer zuerst |
| `steckbrief.xlsx` | 1 Steckbrief | |
| `dokumente/vereinbarung.md` | 2 Vertrag – als PDF schicken | Schritt 4 |
| `dokumente/abrechnung-mails.md` | 3 Rechnung – Mailtext (die Rechnung selbst machst du in der Zentrale) | Schritt 4, 8 |
| `dokumente/willkommens-mail.md` | 4 Willkommens-Mail | Schritt 4 |
| `dokumente/rueckruf-leitfaden.md` | 5 Rückruf-Leitfaden – als PDF anhängen | Schritt 4 |
| `zentrale-zeile.txt` | 6 Zeile für die Zentrale | Schritt 4 |
| `dokumente/kampagnen.md` | 7 Kampagnen – Messung, Meta und Google | Schritt 6 |
| `landingpage/` | 8 Seiten für Netlify – ganzen Ordner hochziehen | Schritt 6 |
| `anzeigen/creatives/` | 9 Anzeigen-Bilder – bei Meta hochladen | Schritt 6 |
| `anzeigen/` | 10 Anzeigen ansehen – vorschau.html öffnen | zum Zeigen |
| `dokumente/teilnahmebedingungen.md` | 11 Verlosung – Teilnahmebedingungen | nur bei Verlosung |
| `fotos/` | Fotos – Originale | |

## Zwei Kampagnenarten

| | Dauerkampagne: Wirtschaftlichkeitsprüfung | Saisonaktion: Verlosung |
|---|---|---|
| Wann | das ganze Jahr | 2–3 × im Jahr, Steckbrief Teil 5 = Ja |
| Anzeigen | 5 (Vorher/Nachher, Abschlag, Prüfung, Rechner, 20 Jahre) | 3 (Modul, 20 %, Speicher) |
| Seiten | `wirtschaftlichkeit.html`, `rechner.html` | `modul.html`, `rabatt.html`, `speicher.html` |
| Prinzip | Beispielrechnung im Bild, **Prüfung erst nach Eintragung** | 1 Modul bzw. je 3 Gewinner, zur ersten Bestellung; die Zentrale zieht am Tag der Ziehung |

Die Beispielzahlen stehen an **einer** Stelle: [`rechengrundlage.json`](rechengrundlage.json).

## Vorlagen

- `texte/`: Vertrag, Abrechnungs-Mails, Willkommens-Mail, Rückruf-Leitfaden, Kampagnen,
  Teilnahmebedingungen, Übersicht (`_kunden-readme.md`); allgemein: Verkaufsskript, Nachfass-Mails.
  Platzhalter `{{feld}}`; bedingte Blöcke `<!--VERLOSUNG-->`, `<!--BEWERTUNGEN-->`, `<!--VORHERNACHHER-->`.
- `anzeigen/`: `wirtschaftlichkeit.html` (5), `verlosungen.html` (3), `vorschau.html`, `recherche.md`.
- `landingpage/`: Wirtschaftlichkeitsprüfung, Rechner, Danke-Seite. Verlosungsseiten baut
  `werkzeuge/landingpages-bauen.py`. Jedes Formular trägt das versteckte Feld `kunde` = Kürzel,
  daran erkennt die Zentrale den Kunden.
- `assets/`: Schrift (selbst gehostet), Platzhalterfotos (CC0).
- `werkzeuge/`: `kunde-anlegen.py`, `landingpages-bauen.py`, `creatives-rendern.js`, `tabellen-bauen.py`.

## Regeln, die im System stecken

- **Dauerhaft läuft die Wirtschaftlichkeitsprüfung**, die es erst nach der Eintragung gibt.
  **Verlosungen nur 2–3 × im Jahr**; Rabatt und Speicher für je 3 Gewinner, nicht für alle.
- **Zahlen nur als gekennzeichnete Beispielrechnung** mit Annahmen und Quelle, nie als Zusage.
- **Kein fester Ort.** Anzeigen nennen keinen Ort; Kampagnen und Seiten nehmen ihn aus dem Steckbrief.
- **Nichts erfinden.** Leere Pflichtfelder erscheinen als `[Feldname]` und stehen unter „Noch offen“.
  Bewertungen und Vorher/Nachher fallen ohne echtes Material ganz weg. „Eigene Montageteams“ nur bei Ja.
- Meta-Pixel und Google-Conversion erst nach Zustimmung, Schrift selbst gehostet, keine Google Fonts.
