# Vorlagen-System Beauty (Technik)

Wie das System gebaut ist. **Für den Ablauf mit dem Studio gilt die [Anleitung](../ANLEITUNG.md).**
Gleiches Prinzip wie bei Photovoltaik, mit zwei großen Unterschieden: **ein Baukasten mit vier Behandlungen**
und **Online-Buchung statt Rückruf**.

## Die vier Teile

| Teil | Wo | Was |
|---|---|---|
| **Baukasten** | [`module.py`](module.py) | Die vier Behandlungen (Laser, Permanent Make-up, Faltenbehandlung, Bleaching): Regeln, Seitentexte, Anzeigen, Vorbereitung, Google-Texte, Annahmen. Die eine Quelle für alles Behandlungsspezifische |
| **Steckbrief** | [`tabellen/01-steckbrief.xlsx`](tabellen/01-steckbrief.xlsx) | Quelle für alles pro Studio. Prüft selbst, ob das Studio passt (auch: darf es diese Behandlung?), schlägt das Budget vor |
| **Kunde-anlegen** | [`werkzeuge/kunde-anlegen.py`](werkzeuge/kunde-anlegen.py) | Steckbrief (+ Fotos) → kompletter Kundenordner |
| **Beauty-Zentrale** | [`../zentrale/`](../zentrale/) | Google-Tabelle + Apps Script: freie Zeiten, Buchung, Bestätigung, Kalender, Erinnerung, Absage, Fake-Schutz, Reports, Rechnungen, Akquise |

```
python3 nischen/beauty/vorlagen/werkzeuge/kunde-anlegen.py <steckbrief.xlsx> [fotos ...]
python3 werkzeuge/clickculture-ordner-bauen.py --beauty <kürzel> <ausgabeordner>
```

Weitere Werkzeuge: `tabellen-bauen.py` (leerer Steckbrief neu), `beispiele-bauen.py` (die vier erfundenen
Beispielkunden neu), `creatives-rendern.js` (Anzeigen-PNGs). Tests: `node nischen/beauty/zentrale/test/test.js`
(Zentrale, 133 Prüfungen) und `node nischen/beauty/zentrale/test/seiten-test.js` (echte Seite im Browser +
Zentrale, Ende zu Ende). **Nach jeder Änderung an Code.gs, buchung.js oder den Seiten beide laufen lassen.**

## So läuft eine Buchung

```
Anzeige → termin.html ──(fragt freie Zeiten)──► Zentrale ──► Google-Kalender des Studios (oder buchbare Zeiten)
          Termin wählen, Name/Telefon/E-Mail
          „Termin reservieren“ ──(POST)──────► Zentrale prüft: Bot-Falle, Zeit-Falle, Name, Telefon, E-Mail (Wegwerf,
                                                Postfach), Sperrliste, ein offener Termin pro Person, Flut-Schutz
                                                → Zeile „unbestätigt“, Platz 45 Min. reserviert
          danke.html  ◄──────────────────────── Mail „Bitte bestätigen“ an die Kundin
bestaetigen.html (aus der Mail, Klick nötig) ─► Zentrale: Kalender (Modus Kalender) bzw. Studio bestätigt (Wunschtermin)
          meldet „Lead“ an Meta/Google        → Bestätigung mit Vorbereitung + .ics an die Kundin, Mail ans Studio
                                                24 h vorher Erinnerung · abends „Wie waren die Termine?“ ans Studio
absagen.html (Link in den Mails) ────────────► Zentrale: Kalender frei, Mail ans Studio
```

Rückruf-Wünsche und Verlosung laufen wie bei Photovoltaik über Netlify-Formulare → Webhook → Zentrale.

**Gezählt wird nur die Bestätigung.** Meta „Lead“ und Google-Conversion feuern erst auf `bestaetigen.html`. So
lernen die Plattformen echte Termine statt Klicks.

## Der Kundenordner

| Im Repo | Im Finder (ZIP) | Wann |
|---|---|---|
| `README.md` | 0 Übersicht – was noch fehlt | immer zuerst |
| `steckbrief.xlsx` | 1 Steckbrief | |
| `dokumente/vertrag-mail.md`, `vereinbarung.md` | 2a, 2b Vertrag | Schritt 4 |
| `dokumente/abrechnung-mails.md` | 3 Rechnung – Mailtext | Schritt 4, 8 |
| `dokumente/willkommens-mail.md` | 4 Willkommens-Mail | Schritt 4 |
| `dokumente/zugaenge-anleitung.md` | 4b Zugänge-Anleitung – als PDF anhängen | Schritt 4 |
| `dokumente/kalender-anleitung.md` | 4c Kalender verbinden – als PDF anhängen | Schritt 4 |
| `dokumente/termin-leitfaden.md` | 5 Termin-Leitfaden – als PDF anhängen | Schritt 4 |
| `zentrale-zeile.txt` | 6 Zeile für die Zentrale | Schritt 4 |
| `dokumente/kampagnen.md` | 7 Kampagnen | Schritt 6 |
| `landingpage/` | 8 Seiten für Netlify | Schritt 6 |
| `anzeigen/creatives/` | 9 Anzeigen-Bilder | Schritt 6 |
| `anzeigen/` | 10 Anzeigen ansehen | zum Zeigen |
| `dokumente/teilnahmebedingungen.md` | 11 Verlosung – Teilnahmebedingungen | nur bei Verlosung |

## Regeln, die im System stecken

- **Ein Studio, eine Behandlung.** Der Steckbrief wählt das Modul; Seite, Anzeigen, Mails und Kampagnen folgen ihm.
- **Werberecht je Behandlung als Schalter** in `module.py` (`regeln`): Verlosung, Vorher/Nachher, Rabatte,
  „kostenlos“, Preise, direkte Buchung. Was nicht erlaubt ist, wird gar nicht erst erzeugt. Kunde-anlegen warnt,
  wenn der Steckbrief etwas will, das nicht geht (z. B. Verlosung bei Faltenbehandlung, Kosmetikstudio mit Faltenbehandlung).
- **Keine Gesundheitsfragen im Formular.** Ausdrückliche Einwilligung (Art. 9 DSGVO) und Häkchen „mindestens 18“.
- **Vorbereitungs-Hinweise sind Vorschläge**, bis das Studio sie freigibt (Steckbrief „Vorbereitung freigegeben“).
- **Nichts erfinden.** Leere Felder erscheinen als `[Feldname]` und stehen unter „Noch offen“. Bewertungen nur echte
  (bei Faltenbehandlung gar keine), Vorher/Nachher nur wo erlaubt und mit echten Fotos.
- Pixel und Google erst nach Zustimmung, Schriften selbst gehostet (Fraunces, Inter Tight), keine Google Fonts.
- **Ohne Web-App-Adresse der Zentrale** (Steckbrief „Deine Daten“) zeigen die Seiten Beispiel-Termine (Vorführmodus,
  auch mit `?demo=1`).
