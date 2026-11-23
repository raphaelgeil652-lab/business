# Kampagne — Muster Brows

> Alles fertig zum Eintragen, Texte 1:1 kopieren. Bilder: Ordner `anzeigen/creatives`.
> Nur Meta (Facebook und Instagram). Die Klickwege sind so, wie Meta sie im November 2026 zeigt. Heißt ein Feld anders, nimm das Nächstliegende
> und schick Claude einen Screenshot, dann wird der Guide für alle Studios korrigiert.
> Pixel-ID und Werbekonto hast du schon bei „Meta einrichten“ eingetragen („Meta fertig“). Sie wirken sofort,
> die Seite muss dafür **nicht** neu hochgeladen werden.

**Was gezählt wird:** Meta bekommt „Lead“ erst, wenn die Kundin ihren Termin **in der Mail
bestätigt** hat (Seite `bestaetigen.html`). Reservierungen, die nie bestätigt werden, und Fake-Buchungen zählen nicht.
So lernt Meta, Menschen zu finden, die wirklich kommen.

**Regeln für diese Behandlung** (stecken schon in den Texten, nichts dazu erfinden):
- ✓ erlaubt: Verlosung
- ✗ nicht erlaubt: Vorher/Nachher-Fotos
- ✓ erlaubt: Rabatte, Neukundenpreis
- ✓ erlaubt: das Wort „kostenlos“
- ✓ erlaubt: Preise in der Werbung
- Wer darf behandeln: Hygieneschulung und Nachweis der PMU-Ausbildung; Arbeitsproben (echte Ergebnisfotos).
- Kurz: Wettbewerbsrecht und Preisangaben; Ergebnisfotos nur echte, Vorher/Nachher-Collagen nicht in Anzeigen

## Vorher kurz prüfen: der Pixel ist schon da

1. Team-Seite des Studios → Kasten **„Einrichten“** → im Feld **„Meta-Pixel (Datensatz-ID)“** steht eine Nummer (15–16 Ziffern).
   Das hast du bei „Meta einrichten“ erledigt. **Warum:** Bestätigt eine Kundin ihren Termin, meldet die Seite Meta einen „Lead“.
   So lernt Meta, wer wirklich bucht, und du siehst in Meta, welche Anzeige Termine bringt.
2. Steht dort nichts: business.facebook.com → Portfolio des Studios → **Einstellungen → Datenquellen → Datensätze** → ID kopieren
   (gibt es keinen: **„Hinzufügen“**, Name `Muster Brows`, mit dem Werbekonto verbinden) → in das Feld eintragen → Speichern.
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
| Name der Kampagne | `Beauty – Permanent Make-up – Muster Brows` |
| Budgetstrategie | **Kampagnenbudget** |
| Tagesbudget | **13 €** (= 400 € im Monat ÷ 30) |
| Kampagnengebotsstrategie | **Höchstes Volumen** |
| Spezielle Anzeigenkategorien | **nichts** auswählen |

### 2 · Anzeigengruppe

| Feld | Eintrag |
|---|---|
| Name der Anzeigengruppe | `Musterstadt 15 km` |
| Conversion-Ort | **Website** |
| Performance-Ziel | **Anzahl der Leads maximieren** |
| Datensatz | **Muster Brows** |
| Conversion-Event | **Lead** |
| Budget und Zeitplan | Start heute, **kein Enddatum** |
| Begünstigte und zahlende Person (EU-Transparenz) | beide Male **Mia Muster** (das Studio, nicht ihr) |

**Zielgruppe** (unter „Einschränkungen“):

| Feld | Eintrag |
|---|---|
| Standorte | „Deutschland“ entfernen → `Musterstadt` → Umkreis **15 km** → „Personen, die hier leben“ |
| Mindestalter | **18** (Pflicht bei Schönheitsbehandlungen), gern höher: Vorschlag 25 bis 60 |
| Sprachen | **Deutsch** |
| Zielgruppe vorschlagen | Alter 25 bis 60 · Geschlecht: Frauen |
| Platzierungen | **Advantage+** so lassen |

**Wenn Meta „Lead“ nicht anbietet oder ausgraut** (kommt bei Gesundheit/Schönheit vor): Performance-Ziel
**„Anzahl der Landingpage-Aufrufe maximieren“** nehmen. Nach den ersten 20–30 bestätigten Terminen nochmal
versuchen, auf „Leads“ umzustellen.

### 3 · Anzeigen (für jede der Anzeigen unten)

Wie bei jeder Anzeige: „Anzeigengestaltung konfigurieren“ → **„Image Ad“** → Bild hochladen (Format **4:5**). Fragt Meta nach
einem Bild für Stories und Reels (9:16): in der Vorschau prüfen, dass oben der Gewinn und unten der Knopf zu sehen sind, sonst
für Stories/Reels **„Zuschneiden“** und den Ausschnitt so legen, dass der Text ganz drin ist. → **Quell-URL** =
Zieladresse unten → Texte kopieren → Button **„Jetzt buchen“** (heißt bei Meta „Book now“ bzw. „Jetzt buchen“;
gibt es ihn nicht: „Mehr dazu“) → bei „Optimierungen“ bzw. **„Advantage+ Creative“ alle Schalter aus** (sonst legt Meta
eigenen Text über das Bild oder schneidet es um) → Tracking: Datensatz **Muster Brows**.
Weitere Anzeigen: links bei der Anzeige „…“ → **Duplizieren** → Bild, Texte, Parameter austauschen.

**Ende: NICHT „Veröffentlichen“.** Oben links schließen. In der Liste steht „Entwurf“.

**1 · n1-angebot** · Bild `n1-angebot.png` · Quell-URL `https://muster-brows.netlify.app/termin.html?l=Powder%20Brows%20inkl.%20Nachstechen` · URL-Parameter `utm_source=meta&utm_campaign=pmu-n1`
- Primärtext: Powder Brows 349 € statt 390 €: Ihr Start bei Muster Brows in Musterstadt. Regulär 390 €.
  ✔ Freie Termine sofort sehen
  ✔ In 30 Sekunden online gebucht
  ✔ Nur für Ihren ersten Termin
  👉 Jetzt Termin buchen.
- Überschrift: Powder Brows 349 € statt 390 €
- Beschreibung: Nur für Neukundinnen.

**2 · p1-vorzeichnen** · Bild `p1-vorzeichnen.png` · Quell-URL `https://muster-brows.netlify.app/termin.html` · URL-Parameter `utm_source=meta&utm_campaign=pmu-p1`
- Primärtext: Unsicher, welche Form zu Ihnen passt? Sehen Sie es, bevor Sie sich entscheiden.
  ✔ kostenlose Beratung bei Muster Brows
  ✔ Wir zeichnen Ihre Augenbrauen vor, Sie sehen das Ergebnis im Spiegel
  ✔ Erst dann entscheiden Sie, in Ruhe
  👉 Jetzt Termin sichern.
- Überschrift: Beratung mit Vorzeichnen: kostenlos
- Beschreibung: Erst sehen, dann entscheiden.

**3 · p2-morgens** · Bild `p2-morgens.png` · Quell-URL `https://muster-brows.netlify.app/termin.html` · URL-Parameter `utm_source=meta&utm_campaign=pmu-p2`
- Primärtext: Jeden Morgen Augenbrauen nachzeichnen? Mit Powder Brows sind sie schon fertig, wenn Sie aufstehen.
  ✔ Weich schattiert, passend zu Ihrem Gesicht
  ✔ Beim Sport, im Urlaub, am Morgen: immer gleich
  ✔ Beratung mit Vorzeichnen vorab
  👉 Jetzt Termin sichern.
- Überschrift: Powder Brows in Musterstadt
- Beschreibung: Beratung mit Vorzeichnen.

**4 · p3-preis** · Bild `p3-preis.png` · Quell-URL `https://muster-brows.netlify.app/termin.html` · URL-Parameter `utm_source=meta&utm_campaign=pmu-p3`
- Primärtext: Powder Brows inkl. Nachstechen bei Muster Brows für 390 €. Ein Preis, alles drin.
  ✔ Beratung und Vorzeichnen
  ✔ Pigmentieren
  ✔ Nachstechtermin inklusive
  👉 Jetzt freien Termin sichern.
- Überschrift: Powder Brows inkl. Nachstechen 390 €
- Beschreibung: Nachstechtermin inklusive.

**5 · p4-online** · Bild `p4-online.png` · Quell-URL `https://muster-brows.netlify.app/termin.html` · URL-Parameter `utm_source=meta&utm_campaign=pmu-p4`
- Primärtext: Nie wieder hinterhertelefonieren: Bei Muster Brows sehen Sie alle freien Termine online und buchen Ihre kostenlose Beratung mit Vorzeichnen in 30 Sekunden.
  ✔ Termin antippen ✔ per E-Mail bestätigen ✔ Erinnerung kommt von selbst
  👉 Freie Termine ansehen.
- Überschrift: Freie Termine online ansehen
- Beschreibung: Permanent Make-up in Musterstadt.

**6 · p5-kuenstlerin** · Bild `p5-kuenstlerin.png` · Quell-URL `https://muster-brows.netlify.app/termin.html` · URL-Parameter `utm_source=meta&utm_campaign=pmu-p5`
- Primärtext: Permanent Make-up ist Handarbeit. Bei Muster Brows wird jede Braue einzeln geplant: Form, Farbe, Ihr Typ.
  ✔ kostenlose Beratung mit Vorzeichnen
  ✔ Sie sehen die Form, bevor pigmentiert wird
  👉 Jetzt Beratung sichern.
- Überschrift: Jede Braue einzeln geplant
- Beschreibung: Beratung mit Vorzeichnen.


## Nach dem Start

3–4 Tage nichts ändern · erst ab 20–50 bestätigten Terminen bewerten, dann nur eine Sache ändern.
Gute Anzeige = viele **bestätigte** Termine, wenige „nicht erschienen“ (steht im Monatsreport).
