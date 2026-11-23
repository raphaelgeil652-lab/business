# Kampagnen — Muster Laserstudio · Laser-Haarentfernung

> Alles fertig zum Eintragen, Texte 1:1 kopieren. Bilder: Ordner `anzeigen/creatives`.
> Die Klickwege sind so, wie Meta und Google sie im November 2026 zeigen. Heißt ein Feld anders, nimm das Nächstliegende.
> Pixel-ID und Werbekonto hast du schon bei „Meta einrichten“ eingetragen („Meta fertig“). Sie wirken sofort,
> die Seite muss dafür **nicht** neu hochgeladen werden.

**Was gezählt wird:** Meta bekommt „Lead“ erst, wenn die Kundin ihren Termin **in der Mail
bestätigt** hat (Seite `bestaetigen.html`). Reservierungen, die nie bestätigt werden, und Fake-Buchungen zählen nicht.
So lernt Meta, Menschen zu finden, die wirklich kommen.

**Regeln für diese Behandlung** (stecken schon in den Texten, nichts dazu erfinden):
- ✓ erlaubt: Verlosung
- ✓ erlaubt: Vorher/Nachher-Fotos
- ✓ erlaubt: Rabatte, Neukundenpreis
- ✓ erlaubt: das Wort „kostenlos“
- ✓ erlaubt: Preise in der Werbung
- Wer darf behandeln: NiSV-Fachkunde (Zertifikat) für jede Person, die lasert. Ohne Nachweis kein Kunde.
- Kurz: Wettbewerbsrecht und Preisangaben; „dauerhaft“ nur mit Hinweis auf mehrere Sitzungen und ohne Garantie

## Vorher kurz prüfen: der Pixel ist schon da

1. Team-Seite des Studios → Kasten **„Einrichten“** → im Feld **„Meta-Pixel (Datensatz-ID)“** steht eine Nummer (15–16 Ziffern).
   Das hast du bei „Meta einrichten“ erledigt. **Warum:** Bestätigt eine Kundin ihren Termin, meldet die Seite Meta einen „Lead“.
   So lernt Meta, wer wirklich bucht, und du siehst in Meta, welche Anzeige Termine bringt.
2. Steht dort nichts: business.facebook.com → Portfolio des Studios → **Einstellungen → Datenquellen → Datensätze** → ID kopieren
   (gibt es keinen: **„Hinzufügen“**, Name `Muster Laserstudio`, mit dem Werbekonto verbinden) → in das Feld eintragen → Speichern.
3. **Gesundheit und Schönheit:** Meta schränkt bei manchen Studios und Praxen die Daten ein („eingeschränkte
   Datennutzung“). Steht im Events Manager ein solcher Hinweis, ist das kein Fehler von euch. Die Seite sendet
   ohnehin keine Behandlungsnamen. Siehe unten „Wenn Meta ‚Lead‘ nicht anbietet“.

## Meta-Kampagne anlegen: Klick für Klick

adsmanager.facebook.com → oben links das **Werbekonto des Studios** wählen → grüner Knopf **„+ Erstellen“**.

### 1 · Kampagne

| Feld | Eintrag |
|---|---|
| Buchungsart | **Auktion** |
| Kampagnenziel | **Leads** → Weiter |
| Name der Kampagne | `Beauty – Laser-Haarentfernung – Muster Laserstudio` |
| Budgetstrategie | **Kampagnenbudget** |
| Tagesbudget | **20 €** (= 600 € im Monat ÷ 30) |
| Kampagnengebotsstrategie | **Höchstes Volumen** |
| Spezielle Anzeigenkategorien | **nichts** auswählen |

### 2 · Anzeigengruppe

| Feld | Eintrag |
|---|---|
| Name der Anzeigengruppe | `Musterstadt 15 km` |
| Conversion-Ort | **Website** |
| Performance-Ziel | **Anzahl der Leads maximieren** |
| Datensatz | **Muster Laserstudio** |
| Conversion-Event | **Lead** |
| Budget und Zeitplan | Start heute, **kein Enddatum** |

**Zielgruppe** (unter „Einschränkungen“):

| Feld | Eintrag |
|---|---|
| Standorte | „Deutschland“ entfernen → `Musterstadt` → Umkreis **15 km** → „Personen, die hier leben“ |
| Mindestalter | **18** (Pflicht bei Schönheitsbehandlungen), gern höher: Vorschlag 18 bis 45 |
| Sprachen | **Deutsch** |
| Zielgruppe vorschlagen | Alter 18 bis 45 · Geschlecht: alle (Advantage+ findet die Richtigen); Frauen sind die Mehrheit |
| Platzierungen | **Advantage+** so lassen |

**Wenn Meta „Lead“ nicht anbietet oder ausgraut** (kommt bei Gesundheit/Schönheit vor): Performance-Ziel
**„Anzahl der Landingpage-Aufrufe maximieren“** nehmen. Nach den ersten 20–30 bestätigten Terminen nochmal
versuchen, auf „Leads“ umzustellen.

### 3 · Anzeigen (für jede der Anzeigen unten)

Wie bei jeder Anzeige: „Anzeigengestaltung konfigurieren“ → **„Image Ad“** → Bild hochladen → **Quell-URL** =
Zieladresse unten → Texte kopieren → Button **„Jetzt buchen“** (heißt bei Meta „Book now“ bzw. „Jetzt buchen“;
gibt es ihn nicht: „Mehr dazu“) → bei „Optimierungen“ **alle Schalter aus** → Tracking: Datensatz **Muster Laserstudio**.
Weitere Anzeigen: links bei der Anzeige „…“ → **Duplizieren** → Bild, Texte, Parameter austauschen.

**Ende: NICHT „Veröffentlichen“.** Oben links schließen. In der Liste steht „Entwurf“.

**1 · n1-angebot** · Bild `n1-angebot.png` · Quell-URL `https://muster-laserstudio.netlify.app/termin.html?l=Haut-%20und%20Haaranalyse%20mit%20Probeschuss` · URL-Parameter `utm_source=meta&utm_campaign=laser-n1`
- Primärtext: Probeschuss + Hautanalyse gratis: Ihr Start bei Muster Laserstudio in Musterstadt.
  ✔ Freie Termine sofort sehen
  ✔ In 30 Sekunden online gebucht
  ✔ Nur für Ihren ersten Termin
  👉 Jetzt Termin buchen.
- Überschrift: Probeschuss + Hautanalyse gratis
- Beschreibung: Nur für Neukundinnen.

**2 · l1-probeschuss** · Bild `l1-probeschuss.png` · Quell-URL `https://muster-laserstudio.netlify.app/termin.html` · URL-Parameter `utm_source=meta&utm_campaign=laser-l1`
- Primärtext: Haarentfernung mit Laser, ohne Rätselraten.
  ✔ kostenlose Analyse von Haut und Haar
  ✔ Probeschuss: Sie spüren vorher, wie es sich anfühlt
  ✔ Gesamtpreis für alle Sitzungen, bevor Sie sich entscheiden
  👉 Jetzt Termin sichern, die freien Zeiten sehen Sie sofort.
- Überschrift: Analyse mit Probeschuss: kostenlos
- Beschreibung: Termin in 30 Sekunden online wählen.

**3 · l2-saison** · Bild `l2-saison.png` · Quell-URL `https://muster-laserstudio.netlify.app/termin.html` · URL-Parameter `utm_source=meta&utm_campaign=laser-l2`
- Primärtext: Wer jetzt startet, ist bis zum Sommer meist durch. Laser-Haarentfernung braucht ein paar Monate, darum lohnt sich der Start im Herbst oder Winter.
  ✔ kostenlose Analyse mit Probeschuss bei Muster Laserstudio
  ✔ Mehrere Sitzungen, klarer Plan, Gesamtpreis vorab
  👉 Jetzt Termin sichern.
- Überschrift: Im Winter starten, im Sommer glatt
- Beschreibung: Laser-Haarentfernung in Musterstadt.

**4 · l3-preis** · Bild `l3-preis.png` · Quell-URL `https://muster-laserstudio.netlify.app/termin.html` · URL-Parameter `utm_source=meta&utm_campaign=laser-l3`
- Primärtext: Laser-Haarentfernung in Musterstadt: Achseln ab 59 € pro Sitzung.
  ✔ Wie viele Sitzungen Sie brauchen, sagen wir Ihnen vorab
  ✔ Gesamtpreis vor der ersten Behandlung
  ✔ Termin in 30 Sekunden online gebucht
  👉 Jetzt freien Termin sichern.
- Überschrift: Achseln ab 59 € pro Sitzung
- Beschreibung: Gesamtpreis vorab in der Analyse.

**5 · l4-online** · Bild `l4-online.png` · Quell-URL `https://muster-laserstudio.netlify.app/termin.html` · URL-Parameter `utm_source=meta&utm_campaign=laser-l4`
- Primärtext: Nie wieder hinterhertelefonieren: Bei Muster Laserstudio sehen Sie alle freien Termine online und buchen Ihre kostenlose Analyse mit Probeschuss in 30 Sekunden.
  ✔ Termin antippen ✔ per E-Mail bestätigen ✔ Erinnerung kommt von selbst
  👉 Freie Termine ansehen.
- Überschrift: Freie Termine online ansehen
- Beschreibung: Laser-Haarentfernung in Musterstadt.

**6 · l5-fachkunde** · Bild `l5-fachkunde.png` · Quell-URL `https://muster-laserstudio.netlify.app/termin.html` · URL-Parameter `utm_source=meta&utm_campaign=laser-l5`
- Primärtext: Laser gehört in geübte Hände. Bei Muster Laserstudio behandeln ausschließlich Fachkräfte mit Fachkundenachweis nach NiSV.
  ✔ kostenlose Haut- und Haaranalyse vorab
  ✔ Ehrlicher Rat, ob Laser bei Ihnen passt
  👉 Jetzt Analyse sichern.
- Überschrift: Laser mit geprüfter Fachkunde
- Beschreibung: Analyse mit Probeschuss: kostenlos.


## Nach dem Start

3–4 Tage nichts ändern · erst ab 20–50 bestätigten Terminen bewerten, dann nur eine Sache ändern.
Gute Anzeige = viele **bestätigte** Termine, wenige „nicht erschienen“ (steht im Monatsreport).
