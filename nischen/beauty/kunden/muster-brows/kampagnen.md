# Kampagnen — Muster Brows · Permanent Make-up

> Alles fertig zum Eintragen, Texte 1:1 kopieren. Bilder: Ordner `anzeigen/creatives`.
> Die Klickwege sind so, wie Meta und Google sie im November 2026 zeigen. Heißt ein Feld anders, nimm das Nächstliegende.
> Pixel-ID und Google-Conversion trägst du auf der **Team-Seite** des Studios ein (Link in jeder Mail der Zentrale).
> Sie wirken sofort, die Seite muss dafür **nicht** neu hochgeladen werden.

**Was gezählt wird:** Meta bekommt „Lead“ und Google eine Conversion erst, wenn die Kundin ihren Termin **in der Mail
bestätigt** hat (Seite `bestaetigen.html`). Reservierungen, die nie bestätigt werden, und Fake-Buchungen zählen nicht.
So lernen Meta und Google, Menschen zu finden, die wirklich kommen.

**Regeln für diese Behandlung** (stecken schon in den Texten, nichts dazu erfinden):
- ✓ erlaubt: Verlosung
- ✗ nicht erlaubt: Vorher/Nachher-Fotos
- ✓ erlaubt: Rabatte, Neukundenpreis
- ✓ erlaubt: das Wort „kostenlos“
- ✓ erlaubt: Preise in der Werbung
- Wer darf behandeln: Hygieneschulung und Nachweis der PMU-Ausbildung; Arbeitsproben (echte Ergebnisfotos).
- Kurz: Wettbewerbsrecht und Preisangaben; Ergebnisfotos nur echte, Vorher/Nachher-Collagen nicht in Anzeigen

## Vorher: Messung einrichten (einmal pro Kunde)

**Meta-Pixel (Meta nennt es „Datensatz“)**
1. business.facebook.com/settings → links **„Datenquellen“ → „Datensätze“** → **„Hinzufügen“**.
2. Name: `Muster Brows` → **„Erstellen“**.
3. Frage „Wähle die Werbekonten aus …“: das **Werbekonto des Studios** ankreuzen → **„Weiter“**.
4. Fragt Meta, wie ihr einrichten wollt: **schließen**. Der Code steckt schon in den Seiten.
5. Die **Datensatz-ID** (15–16 Ziffern) kopieren → Team-Seite des Studios → „Meta-Pixel“ → Speichern.
6. **Gesundheit und Schönheit:** Meta schränkt bei manchen Studios und Praxen die Daten ein („eingeschränkte
   Datennutzung“). Steht im Events Manager ein solcher Hinweis, ist das kein Fehler von euch. Die Seite sendet
   ohnehin keine Behandlungsnamen. Siehe unten „Wenn Meta ‚Lead‘ nicht anbietet“.

**Google-Ads-Conversion** (so geklickt im Probelauf, November 2026)

Voraussetzung: Das Studio hat die Verknüpfung mit eurem Verwaltungskonto angenommen (steht auf der Team-Seite als ✓ bei „Google Ads verbinden“).
Google Ads am besten in **Chrome, ohne VPN und ohne Werbeblocker**. Sonst bleibt es gern mit „Ein Fehler ist
aufgetreten“ hängen.

1. ads.google.com → oben auf den Kontonamen → das **Konto des Kunden** wählen (nicht euer Verwaltungskonto).
2. Links **„Zielvorhaben“** (der Pokal) → **„Conversions“** → **„Zusammenfassung“** → **„Conversions erstellen“**
   bzw. „+ Conversion-Aktion“.
3. Bei **„Conversions auf einer Website“** den Haken setzen → rechts **„URL hinzufügen“** →
   `https://muster-brows.netlify.app`. Die anderen drei Haken (App, Anrufe, Offline) leer lassen →
   **„Speichern und fortfahren“**. Ist die Seite noch nicht online, findet Google nichts. Das ist egal.
4. **„+ Conversion erstellen“** bzw. „manuell“ → Kategorie **„Lead-Formular senden“** → Name
   `Termin bestätigt` → Wert: **„Für jede Conversion denselben Wert verwenden“, 1 €**
   („keinen Wert“ gibt es nicht mehr; der Wert ist uns egal) → Zählung **„Eine“** → **„Speichern und fortfahren“**.
   Steht daneben „Primäre Zahlungsmethode“: falsche Übersetzung von „primäre Aktion“, passt so.
5. Es kommt ein Fenster **„Google-Tag einrichten“** mit Code `GTM-…` und dem Knopf „Einfügung testen“:
   **„Abbrechen“** bzw. **×**. Nichts einbauen, das machen unsere Seiten selbst.
6. **Den Wert holen:** „Zielvorhaben“ → „Conversions“ → **„Alle Conversions“** → auf
   **„Termin bestätigt“** klicken → ganz nach unten scrollen → im Kasten „Datenquellen“
   rechts **„Verwalten“** → **„Einrichten“**. Es öffnet sich der **Tag Manager** → unten bei „Ausstehende
   Änderungen“ den blauen Link **„Termin bestätigt“** anklicken.
7. Dort stehen **„Conversion-ID“** (nur Ziffern) und **„Conversion-Label“** (Buchstaben und Zahlen).
   Die „Conversion-Typ-ID“ braucht ihr nicht. Tag Manager mit × schließen, **nicht auf „Senden“ klicken**.
8. Daraus wird: `AW-` + Conversion-ID + `/` + Conversion-Label, z. B. `AW-123456789/AbCdEfGhIj`
   → Team-Seite des Studios → „Google-Conversion“ → Speichern.

Einmal prüfen: links „Verwaltung“ (Zahnrad) → „Kontoeinstellungen“ → **„Automatische Tagkennzeichnung“
muss an sein** (ist es normalerweise). Ohne sie kann Google die Anfragen keiner Anzeige zuordnen.

Status „Warten auf Conversions“ ist normal. Er bleibt, bis die erste Kundin nach einem Klick auf eine Google-Anzeige ihren Termin bestätigt.


## Meta-Kampagne anlegen: Klick für Klick

adsmanager.facebook.com → oben links das **Werbekonto des Studios** wählen → grüner Knopf **„+ Erstellen“**.

### 1 · Kampagne

| Feld | Eintrag |
|---|---|
| Buchungsart | **Auktion** |
| Kampagnenziel | **Leads** → Weiter |
| Name der Kampagne | `Beauty – Permanent Make-up – Muster Brows` |
| Budgetstrategie | **Kampagnenbudget** |
| Tagesbudget | **10 €** (= 300 € im Monat ÷ 30) |
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

Wie bei jeder Anzeige: „Anzeigengestaltung konfigurieren“ → **„Image Ad“** → Bild hochladen → **Quell-URL** =
Zieladresse unten → Texte kopieren → Button **„Jetzt buchen“** (heißt bei Meta „Book now“ bzw. „Jetzt buchen“;
gibt es ihn nicht: „Mehr dazu“) → bei „Optimierungen“ **alle Schalter aus** → Tracking: Datensatz **Muster Brows**.
Weitere Anzeigen: links bei der Anzeige „…“ → **Duplizieren** → Bild, Texte, Parameter austauschen.

**Ende: NICHT „Veröffentlichen“.** Oben links schließen. In der Liste steht „Entwurf“.

**1 · p1-vorzeichnen** · Bild `p1-vorzeichnen.png` · Quell-URL `https://muster-brows.netlify.app/termin.html` · URL-Parameter `utm_source=meta&utm_campaign=pmu-p1`
- Primärtext: Unsicher, welche Form zu Ihnen passt? In der kostenlosen Beratung zeichnen wir Ihre Augenbrauen vor. Sie sehen das Ergebnis im Spiegel und entscheiden dann in Ruhe.
  👉 Termin online wählen.
- Überschrift: Beratung mit Vorzeichnen: kostenlos
- Beschreibung: Erst sehen, dann entscheiden.

**2 · p2-morgens** · Bild `p2-morgens.png` · Quell-URL `https://muster-brows.netlify.app/termin.html` · URL-Parameter `utm_source=meta&utm_campaign=pmu-p2`
- Primärtext: Jeden Morgen Augenbrauen nachzeichnen? Mit Powder Brows sind sie schon fertig, wenn Sie aufstehen. Weich schattiert, passend zu Ihrem Gesicht.
  👉 Beratung mit Vorzeichnen online buchen.
- Überschrift: Powder Brows in Musterstadt
- Beschreibung: Beratung mit Vorzeichnen.

**3 · p3-preis** · Bild `p3-preis.png` · Quell-URL `https://muster-brows.netlify.app/termin.html` · URL-Parameter `utm_source=meta&utm_campaign=pmu-p3`
- Primärtext: Keine versteckten Kosten: Powder Brows inkl. Nachstechen bei Muster Brows für 390 €. Darin sind Beratung, Vorzeichnen, Pigmentieren und der Nachstechtermin enthalten.
  👉 Termin online wählen.
- Überschrift: Powder Brows inkl. Nachstechen 390 €
- Beschreibung: Nachstechtermin inklusive.

**4 · p4-online** · Bild `p4-online.png` · Quell-URL `https://muster-brows.netlify.app/termin.html` · URL-Parameter `utm_source=meta&utm_campaign=pmu-p4`
- Primärtext: Bei Muster Brows sehen Sie alle freien Termine online und buchen Ihre kostenlose Beratung mit Vorzeichnen in 30 Sekunden.
  👉 Freie Termine ansehen.
- Überschrift: Freie Termine online ansehen
- Beschreibung: Permanent Make-up in Musterstadt.

**5 · p5-kuenstlerin** · Bild `p5-kuenstlerin.png` · Quell-URL `https://muster-brows.netlify.app/termin.html` · URL-Parameter `utm_source=meta&utm_campaign=pmu-p5`
- Primärtext: Permanent Make-up ist Handarbeit. Bei Muster Brows planen wir jede Braue einzeln: Form, Farbe, Ihr Typ. Starten Sie mit einer kostenlosen Beratung mit Vorzeichnen.
  👉 Termin online wählen.
- Überschrift: Jede Braue einzeln geplant
- Beschreibung: Beratung mit Vorzeichnen.


## Google-Kampagne anlegen: Klick für Klick

Voraussetzung: Das Studio hat in seinem Google-Ads-Konto seine **Zahlungsart** hinterlegt. Ohne Zahlungsart fragt
Google am Ende nach Zahlungsdaten: **dort nie eure eigenen eintragen.** Chrome, kein VPN, kein Werbeblocker.

ads.google.com → **Konto des Studios** wählen → links **„Kampagnen“** → blauer **„+“** → **„Neue Kampagne“**.

1. Zielvorhaben **„Leads“** → Conversion-Ziel **„Lead-Formular senden“** (die Conversion „Termin bestätigt“). Andere Ziele entfernen.
2. Kampagnentyp **„Suche“** → nur **„Websitebesuche“**: `https://muster-brows.netlify.app/termin.html`. Nicht „Eingereichte Lead-Formulare“.
3. Name: `Suche – Permanent Make-up Musterstadt` → **„Weiter“**.
4. Gebote: **„Klicks“** → Haken bei „Maximales CPC-Gebotslimit“ → `2,50 €`. (Ab ca. 30 bestätigten Terminen über Google auf „Conversions“ umstellen.)
5. Netzwerke: **beide Haken raus**. Standort: **„Umkreis“** `Musterstadt`, `15` km. Standortoption: **„Präsenz“**. Sprache: **Deutsch**.
6. „Politische Werbung in der EU“: **„Nein“**. Weitere Einstellungen → „Suffix der finalen URL“: `utm_source=google&utm_campaign=pmu-suche`. Automatisch erstellte Assets: **aus**. „AI Max“ / weitgehend passende Keywords: **aus**.
7. Anzeigengruppe `Permanent Make-up Musterstadt`, Keywords **mit Anführungszeichen**, eins pro Zeile:
```
"permanent make up musterstadt"
"powder brows musterstadt"
"microblading musterstadt"
"augenbrauen pigmentieren musterstadt"
"permanent make up augenbrauen"
"lippen pigmentieren"
"powder brows kosten"
```
8. Finale URL: `https://muster-brows.netlify.app/termin.html` · Pfad: `Brows / Termin`.
9. Überschriften (15, je höchstens 30 Zeichen; zeigt Google rot, kürzen):
    1. Permanent Make-up Musterstadt
    2. Powder Brows in Musterstadt
    3. Beratung mit Vorzeichnen
    4. Termin online buchen
    5. Nachstechtermin inklusive
    6. Muster Brows
    7. Freie Termine ansehen
    8. Powder Brows
    9. Weich schattierte Brauen
    10. Erst sehen, dann entscheiden
    11. Ohne Warteschleife buchen
    12. Brauen morgens schon fertig
    13. Beratung kostenlos
    14. Ihr Termin in 30 Sekunden
    15. Handarbeit mit Erfahrung
   Überschrift 1 an **Position 1 anheften**.
10. Beschreibungen (4, je höchstens 90 Zeichen):
    1. Beratung mit Vorzeichnen: Sie sehen die Form vorab. Termin online wählen.
    2. Powder Brows, Lippen und Lidstrich. Nachstechtermin im Preis enthalten.
    3. Freie Termine sehen und in 30 Sekunden buchen. Bestätigung per E-Mail.
    4. Muster Brows in Musterstadt. Jede Braue einzeln geplant.
11. Budget: **3 €** pro Tag → **„Kampagne veröffentlichen“** → sofort auf **„Pausiert“**.
12. **Ausschließende Keywords** (Kampagne → „Keywords“ → „Ausschließende Keywords“ → „+“):
```
entfernen
entfernung
ausbildung
schulung
kurs
gerät
farbe kaufen
job
stellenangebot
selber
fehlgeschlagen
korrektur
```

**Hinweis:** Kundenlisten und Remarketing für Schönheitsbehandlungen sind bei Google eingeschränkt. Nichts davon einrichten.


## Nach dem Start

3–4 Tage nichts ändern · erst ab 20–50 bestätigten Terminen bewerten, dann nur eine Sache ändern.
Gute Anzeige = viele **bestätigte** Termine, wenige „nicht erschienen“ (steht im Monatsreport).
