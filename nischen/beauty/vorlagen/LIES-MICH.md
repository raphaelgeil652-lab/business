# Vorlagen-System Beauty (Technik)

Wie das System gebaut ist. **Für den Ablauf mit dem Studio gilt die [Anleitung](../ANLEITUNG.md).**
Version 2 (20.11.2026): kein Steckbrief mehr. Alles pro Studio entsteht in der Zentrale (Formular „Neuer Kunde“ und
Schritte-Seite des Studios). Claude baut daraus nur noch Terminseite, Anzeigen und Kampagnen-Anleitung.

## Die Teile

| Teil | Wo | Was |
|---|---|---|
| **Baukasten** | [`module.py`](module.py) | Die vier Behandlungen: Regeln, Seitentexte, Anzeigen, Vorschläge für die Vorbereitung, Google-Texte, Annahmen. Die eine Quelle für alles Behandlungsspezifische |
| **Beauty-Zentrale** | [`../zentrale/`](../zentrale/) | Google-Tabelle + Apps Script: Formular „Neuer Kunde“, Schritte-Seite fürs Studio, Team-Seite, Online-Buchung, alle Mails, Rechnungen, Reports |
| **Kunde-anlegen** | [`werkzeuge/kunde-anlegen.py`](werkzeuge/kunde-anlegen.py) | „Text für Claude“ (+ Fotos, Ordner oder ZIP) → Seite für Netlify, Anzeigen, Kampagnen-Anleitung |
| **Vereinbarung** | [`texte/vereinbarung.md`](texte/vereinbarung.md) | Wird von `zentrale-bauen.py` in `Code.gs` übernommen (Baustein), die Zentrale füllt sie aus |

```
python3 nischen/beauty/zentrale/zentrale-bauen.py          # Baustein in Code.gs (module.py + Vereinbarung) und die Tabelle neu
python3 nischen/beauty/vorlagen/werkzeuge/kunde-anlegen.py <text-fuer-claude.json> [fotos | ordner | fotos.zip]
python3 nischen/beauty/vorlagen/werkzeuge/beispiele-bauen.py   # die vier erfundenen Beispielstudios neu
python3 nischen/beauty/vorlagen/werkzeuge/netlify-hochladen.py <kürzel>     # Seite selbst auf Netlify online (Zugangsschlüssel liegt im Proxy der Umgebung „business“)
python3 werkzeuge/clickculture-ordner-bauen.py --kunde <kürzel> <ausgabeordner>
```

**Claude-Ablauf bei „Baue die Seite für <kürzel>“:** Text als JSON speichern → `kunde-anlegen.py` mit den Fotos →
Seite ansehen (Platzhalter? Lücken?) → `netlify-hochladen.py <kürzel>` → `clickculture-ordner-bauen.py --kunde <kürzel>` →
ZIP schicken und sagen: „Team-Seite → Studio um Freigabe bitten“. Jede Fassung kostet 15 Netlify-Credits.

Tests: `node nischen/beauty/zentrale/test/test.js` (Zentrale, 211 Prüfungen) und
`node nischen/beauty/zentrale/test/seiten-test.js` (echte Seite im Browser + Zentrale, Ende zu Ende).
**Nach jeder Änderung an module.py, vereinbarung.md, Code.gs, buchung.js oder den Seiten: `zentrale-bauen.py`, dann beide Tests.**

## Der Ablauf in der Zentrale

```
Formular „Neuer Kunde“ ──► Zeile im Blatt „Kunden“ (Status Angelegt), Vereinbarung ausgefüllt (Blatt „Verträge“),
                           Willkommens-Mail mit Link zur Schritte-Seite
Schritte-Seite (Studio) ──► Vereinbarung annehmen (Name, Zeit) → Kopie als PDF per Mail
                           Links, Behandler, Vorbereitung freigeben, Fotos hochladen, Kalender prüfen, Facebook einladen, Karte
                           → Mails an den Betreuer, wenn er etwas tun muss
täglich 8 Uhr ───────────► Erinnerung alle 2 Werktage (höchstens 3), dann „bitte anrufen“ · alles da → Mail mit „Text für Claude“
Team-Seite „Freigabe“ ───► Studio sieht Seite (seite/termin.html?demo=1) und Anzeigen (seite/anzeigen/vorschau.html), tippt
                           „Passt so“ oder schreibt einen Änderungswunsch → Mail an den Betreuer
montags 8 Uhr ───────────► Wochenbericht ans Studio (neue Termine, erschienen, gekauft, diese Woche) + offene Stände
Team-Seite (ihr) ────────► Pixel-ID, Google-Conversion, Seitenadresse · „Jetzt live schalten“ → Mail „Ihre Werbung läuft“
                           Monatsreport mit Werbekosten senden · Rechnung „Bezahlt“ · Pausieren
```

## So läuft eine Buchung

```
Anzeige → termin.html ──(fragt freie Zeiten je Leistung)──► Zentrale ──► Google-Kalender des Studios (oder buchbare Zeiten)
          Leistung, Termin, Name/Telefon/E-Mail
          „Termin reservieren“ ──(POST)──────► Zentrale prüft: Bot-Falle, Zeit-Falle, Name, Telefon, E-Mail (Wegwerf,
                                                Postfach), Sperrliste, ein offener Termin pro Person, Flut-Schutz
                                                → Zeile „unbestätigt“, Platz 45 Min. reserviert
          danke.html  ◄──────────────────────── Mail „Bitte bestätigen“ an die Kundin
bestaetigen.html (aus der Mail, Klick nötig) ─► Zentrale: Kalender bzw. Studio bestätigt per Knopf (ohne Google-Kalender)
          meldet „Lead“ an Meta/Google        → Bestätigung mit Vorbereitung + .ics an die Kundin, Mail ans Studio
absagen.html (Link in den Mails) ────────────► Zentrale: Kalender frei, Mail ans Studio
Rückruf-Wunsch ──(POST a=anfrage)────────────► Zentrale: Mail ans Studio mit „Zurückgerufen“, Erinnerung nach 60 Min.
```

**Jede Leistung des Studios ist buchbar.** Es gibt keine Unterscheidung Beratung/Behandlung mehr. Erkennt
kunde-anlegen eine Beratung am Namen (Beratung, Analyse, Erstgespräch, Vorzeichnen …), nutzen Seite und Anzeigen sie
als Einstieg; ohne Beratung fallen Anzeigen weg, die eine versprechen, ohne Preis die Preis-Anzeige.

**Pixel-ID und Google-Conversion** holt die Seite zur Laufzeit aus der Zentrale (`?a=mess`), erst nach Zustimmung.
Neue IDs wirken sofort, ohne neues Hochladen. **Gezählt wird nur die Bestätigung** (`bestaetigen.html`).

**Warum pro Studio eine eigene statische Seite** (und nicht eine Seite für alle): Die Anzeigen-Prüfer von Meta und
Google führen nicht verlässlich JavaScript aus, und eine geteilte Domain teilt sich auch den Ruf und Sperren
(Recherche: `research_notes/Beauty Ablauf neu gedacht/technik_machbarkeit.md`).

## Der Kundenordner

| Im Repo | Im Finder (ZIP) |
|---|---|
| `LIES-MICH.md` | 0 Lies mich – drei Schritte |
| `seite/` | 1 Seite für Netlify – Ordner hineinziehen |
| `kampagnen.html` | 2 Kampagnen-Assistent (Häkchen, Knöpfe „Kopieren“, gespeichert im Browser) |
| `kampagnen.md` | 2b Kampagnen als Text |
| `anzeigen/creatives/` | 3 Anzeigen-Bilder – bei Meta hochladen |
| `anzeigen/` | 4 Anzeigen ansehen |
| `fotos/`, `daten.json` | Fotos – Originale (daten.json bleibt im Repo-Ordner) |

## Regeln, die im System stecken

- **Ein Studio, eine Behandlung.** Das Formular prüft, ob der Behandler sie anbieten darf.
- **Werberecht je Behandlung als Schalter** in `module.py` (`regeln`): Verlosung, Vorher/Nachher, Rabatte,
  „kostenlos“, Preise. Was nicht erlaubt ist, wird gar nicht erst erzeugt. „Botox“ lehnt das Formular ab.
- **Keine Gesundheitsfragen im Formular.** Ausdrückliche Einwilligung (Art. 9 DSGVO) und Häkchen „mindestens 18“.
- **Vorbereitungs-Hinweise sind Vorschläge**, bis das Studio sie auf seiner Schritte-Seite freigibt.
- **Nichts erfinden.** Fehlt etwas, steht `[…]` auf der Seite und kunde-anlegen warnt. Bewertungen nur echte,
  Vorher/Nachher nur wo erlaubt und mit echten Fotos. Platzhalter-Fotos werden gemeldet.
- Pixel und Google erst nach Zustimmung, Schriften selbst gehostet (Fraunces, Inter Tight), keine Google Fonts.
- **Ohne Adresse der Zentrale** zeigen die Seiten Beispiel-Termine (Vorführmodus, auch mit `?demo=1`).
- **Gewinnspiel** (Version 3): Teilnahme = Termin buchen, Teilnahmeschluss offen, die Zentrale zieht nicht. Die
  alte Verlosung (`verlosung.html`) ist nur noch für Altkunden erhalten.
