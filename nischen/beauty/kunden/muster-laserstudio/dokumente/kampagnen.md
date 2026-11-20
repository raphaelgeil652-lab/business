# Kampagnen — Muster Laserstudio · Laser-Haarentfernung

> Alles fertig zum Eintragen, Texte 1:1 kopieren. Bilder: Ordner „9 Anzeigen-Bilder“.
> Die Klickwege sind so, wie Meta und Google sie im November 2026 zeigen. Heißt ein Feld anders, nimm das Nächstliegende.
> Alles erst als **Entwurf** anlegen. Live geht es in Schritt 7.

**Was gezählt wird:** Meta bekommt „Lead“ und Google eine Conversion erst, wenn die Kundin ihren Termin **in der Mail
bestätigt** hat (Seite `bestaetigen.html`). Reservierungen, die nie bestätigt werden, und Fake-Buchungen zählen nicht.
So lernen Meta und Google, Menschen zu finden, die wirklich kommen.

**Regeln für diese Behandlung** (stecken schon in den Texten, nichts dazu erfinden):
- ✓ erlaubt: Verlosung
- ✓ erlaubt: Vorher/Nachher-Fotos
- ✓ erlaubt: Rabatte, Neukundenpreis
- ✓ erlaubt: das Wort „kostenlos“
- ✓ erlaubt: Preise in der Werbung
- ✓ erlaubt: Behandlung direkt buchen
- Wer darf behandeln: NiSV-Fachkunde (Zertifikat) für jede Person, die lasert. Ohne Nachweis kein Kunde.
- Kurz: Wettbewerbsrecht und Preisangaben; „dauerhaft“ nur mit Hinweis auf mehrere Sitzungen und ohne Garantie

## Vorher: Messung einrichten (einmal pro Kunde, vor dem Hochladen der Seiten)

**Meta-Pixel (Meta nennt es „Datensatz“)**
1. business.facebook.com/settings → links **„Datenquellen“ → „Datensätze“** → **„Hinzufügen“**.
2. Name: `Muster Laserstudio` → **„Erstellen“**.
3. Frage „Wähle die Werbekonten aus …“: das **Werbekonto des Studios** ankreuzen → **„Weiter“**.
4. Fragt Meta, wie du einrichten willst: **schließen**. Der Code steckt schon in den Seiten.
5. Die **Datensatz-ID** (15–16 Ziffern) kopieren → Steckbrief Teil 5, mit `'` davor.
6. **Gesundheit und Schönheit:** Meta schränkt bei manchen Studios und Praxen die Daten ein („eingeschränkte
   Datennutzung“). Steht im Events Manager ein solcher Hinweis, ist das kein Fehler von dir. Die Seite sendet
   ohnehin keine Behandlungsnamen. Siehe unten „Wenn Meta ‚Lead‘ nicht anbietet“.

**Google-Ads-Conversion** (so geklickt im Probelauf, November 2026)

Voraussetzung: Das Google-Ads-Konto des Kunden hängt an deinem Verwaltungskonto (Hilfe „Schritt 6“, Punkt 0).
Google Ads am besten in **Chrome, ohne VPN und ohne Werbeblocker**. Sonst bleibt es gern mit „Ein Fehler ist
aufgetreten“ hängen.

1. ads.google.com → oben auf den Kontonamen → das **Konto des Kunden** wählen (nicht dein Verwaltungskonto).
2. Links **„Zielvorhaben“** (der Pokal) → **„Conversions“** → **„Zusammenfassung“** → **„Conversions erstellen“**
   bzw. „+ Conversion-Aktion“.
3. Bei **„Conversions auf einer Website“** den Haken setzen → rechts **„URL hinzufügen“** →
   `https://muster-laserstudio.netlify.app`. Die anderen drei Haken (App, Anrufe, Offline) leer lassen →
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
   Die „Conversion-Typ-ID“ brauchst du nicht. Tag Manager mit × schließen, **nicht auf „Senden“ klicken**.
8. Daraus wird: `AW-` + Conversion-ID + `/` + Conversion-Label, z. B. `AW-123456789/AbCdEfGhIj`
   → Steckbrief Teil 4 „Google-Ads-Conversion“, mit `'` davor.

Einmal prüfen: links „Verwaltung“ (Zahnrad) → „Kontoeinstellungen“ → **„Automatische Tagkennzeichnung“
muss an sein** (ist es normalerweise). Ohne sie kann Google die Anfragen keiner Anzeige zuordnen.

Status „Warten auf Conversions“ ist normal. Er bleibt, bis die erste Kundin nach einem Klick auf eine Google-Anzeige ihren Termin bestätigt.

Dann Steckbrief an Claude: „Erzeuge Muster Laserstudio neu.“ Erst danach die Seiten hochladen.

## Meta-Kampagne anlegen: Klick für Klick

adsmanager.facebook.com → oben links das **Werbekonto des Studios** wählen → grüner Knopf **„+ Erstellen“**.

### 1 · Kampagne

| Feld | Eintrag |
|---|---|
| Buchungsart | **Auktion** |
| Kampagnenziel | **Leads** → Weiter |
| Name der Kampagne | `Beauty – Laser-Haarentfernung – Muster Laserstudio` |
| Budgetstrategie | **Kampagnenbudget** |
| Tagesbudget | **15 €** (= 450 € im Monat ÷ 30) |
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

**1 · l1-probeschuss** · Bild `l1-probeschuss.png` · Quell-URL `https://muster-laserstudio.netlify.app/termin.html` · URL-Parameter `utm_source=meta&utm_campaign=laser-l1`
- Primärtext: Haarentfernung mit Laser, ohne Rätselraten: In der kostenlosen Analyse prüfen wir Haut und Haar, Sie spüren beim Probeschuss, wie es sich anfühlt, und Sie bekommen den Preis für alle Sitzungen vorab.
  👉 Termin direkt online wählen.
- Überschrift: Analyse mit Probeschuss: kostenlos
- Beschreibung: Termin in 30 Sekunden online wählen.

**2 · l2-saison** · Bild `l2-saison.png` · Quell-URL `https://muster-laserstudio.netlify.app/termin.html` · URL-Parameter `utm_source=meta&utm_campaign=laser-l2`
- Primärtext: Laser-Haarentfernung braucht ein paar Monate. Wer im Herbst oder Winter startet, ist bis zum Sommer meist durch. Starten Sie mit einer kostenlosen Analyse inklusive Probeschuss bei Muster Laserstudio.
  👉 Termin online wählen.
- Überschrift: Im Winter starten, im Sommer glatt
- Beschreibung: Laser-Haarentfernung in Musterstadt.

**3 · l3-preis** · Bild `l3-preis.png` · Quell-URL `https://muster-laserstudio.netlify.app/termin.html` · URL-Parameter `utm_source=meta&utm_campaign=laser-l3`
- Primärtext: Was kostet Laser-Haarentfernung? Bei Muster Laserstudio zum Beispiel Achseln ab 59 € pro Sitzung. Wie viele Sitzungen Sie brauchen und was das zusammen kostet, sagen wir Ihnen in der kostenlosen Analyse, bevor Sie sich entscheiden.
  👉 Termin online wählen.
- Überschrift: Achseln ab 59 € pro Sitzung
- Beschreibung: Gesamtpreis vorab in der Analyse.

**4 · l4-online** · Bild `l4-online.png` · Quell-URL `https://muster-laserstudio.netlify.app/termin.html` · URL-Parameter `utm_source=meta&utm_campaign=laser-l4`
- Primärtext: Keine Lust auf Telefon? Bei Muster Laserstudio sehen Sie alle freien Termine online und buchen Ihre kostenlose Analyse mit Probeschuss in 30 Sekunden.
  👉 Freie Termine ansehen.
- Überschrift: Freie Termine online ansehen
- Beschreibung: Laser-Haarentfernung in Musterstadt.

**5 · l5-fachkunde** · Bild `l5-fachkunde.png` · Quell-URL `https://muster-laserstudio.netlify.app/termin.html` · URL-Parameter `utm_source=meta&utm_campaign=laser-l5`
- Primärtext: Laser-Haarentfernung ist Vertrauenssache. Bei Muster Laserstudio behandeln ausschließlich Fachkräfte mit Fachkundenachweis nach NiSV. Starten Sie mit einer kostenlosen Haut- und Haaranalyse.
  👉 Termin online wählen.
- Überschrift: Laser mit geprüfter Fachkunde
- Beschreibung: Analyse mit Probeschuss: kostenlos.

**6 · v1-verlosung** · Bild `v1-verlosung.png` · Quell-URL `https://muster-laserstudio.netlify.app/verlosung.html` · URL-Parameter `utm_source=meta&utm_campaign=laser-v1`
- Primärtext: ✨ Verlosung bei Muster Laserstudio: Unter allen Teilnehmerinnen und Teilnehmern bis 31. Januar verlosen wir ein Laser-Paket Achseln (6 Sitzungen). Mitmachen dauert 30 Sekunden.
  👉 Jetzt teilnehmen.
- Überschrift: Wir verlosen ein Laser-Paket Achseln (6 Sitzungen)
- Beschreibung: Teilnahme bis 31. Januar.

Die Verlosungs-Anzeige in eine **eigene Kampagne** `Beauty – Verlosung – Muster Laserstudio` (gleiche Einstellungen), Budget in dieser Zeit etwa hälftig aufteilen.


## Google-Kampagne anlegen: Klick für Klick

Voraussetzung: Das Studio hat in seinem Google-Ads-Konto seine **Zahlungsart** hinterlegt. Ohne Zahlungsart fragt
Google am Ende nach Zahlungsdaten: **dort nie deine eigenen eintragen.** Chrome, kein VPN, kein Werbeblocker.

ads.google.com → **Konto des Studios** wählen → links **„Kampagnen“** → blauer **„+“** → **„Neue Kampagne“**.

1. Zielvorhaben **„Leads“** → Conversion-Ziel **„Lead-Formular senden“** (die Conversion „Termin bestätigt“). Andere Ziele entfernen.
2. Kampagnentyp **„Suche“** → nur **„Websitebesuche“**: `https://muster-laserstudio.netlify.app/termin.html`. Nicht „Eingereichte Lead-Formulare“.
3. Name: `Suche – Laser-Haarentfernung Musterstadt` → **„Weiter“**.
4. Gebote: **„Klicks“** → Haken bei „Maximales CPC-Gebotslimit“ → `2,50 €`. (Ab ca. 30 bestätigten Terminen über Google auf „Conversions“ umstellen.)
5. Netzwerke: **beide Haken raus**. Standort: **„Umkreis“** `Musterstadt`, `15` km. Standortoption: **„Präsenz“**. Sprache: **Deutsch**.
6. „Politische Werbung in der EU“: **„Nein“**. Weitere Einstellungen → „Suffix der finalen URL“: `utm_source=google&utm_campaign=laser-suche`. Automatisch erstellte Assets: **aus**. „AI Max“ / weitgehend passende Keywords: **aus**.
7. Anzeigengruppe `Laser-Haarentfernung Musterstadt`, Keywords **mit Anführungszeichen**, eins pro Zeile:
```
"laser haarentfernung musterstadt"
"haarentfernung musterstadt"
"dauerhafte haarentfernung musterstadt"
"diodenlaser musterstadt"
"laser haarentfernung kosten"
"laser haarentfernung achseln"
"laser haarentfernung beine"
```
8. Finale URL: `https://muster-laserstudio.netlify.app/termin.html` · Pfad: `Laser / Termin`.
9. Überschriften (15, je höchstens 30 Zeichen; zeigt Google rot, kürzen):
    1. Laser-Haarentfernung Musterstadt
    2. Analyse mit Probeschuss
    3. Termin online buchen
    4. Gesamtpreis vorab
    5. Diodenlaser mit NiSV-Fachkunde
    6. Jetzt im Winter starten
    7. Muster Laserstudio
    8. Freie Termine ansehen
    9. Achseln ab 59 €/Sitzung
    10. Ohne Warteschleife buchen
    11. Fachkräfte mit Fachkunde
    12. Haarentfernung in Musterstadt
    13. Probeschuss: kostenlos
    14. Ihr Termin in 30 Sekunden
    15. Neukunden willkommen
   Überschrift 1 an **Position 1 anheften**.
10. Beschreibungen (4, je höchstens 90 Zeichen):
    1. Analyse mit Probeschuss, Gesamtpreis vorab. Freie Termine sehen und online buchen.
    2. Diodenlaser, Fachkräfte mit NiSV-Fachkunde. Meist 6–8 Sitzungen, Ergebnis individuell.
    3. Jetzt im Herbst oder Winter starten, bis zum Sommer meist durch. Termin online wählen.
    4. Muster Laserstudio in Musterstadt. Termin wählen, per E-Mail bestätigen, fertig.
11. Budget: **5 €** pro Tag → **„Kampagne veröffentlichen“** → sofort auf **„Pausiert“**.
12. **Ausschließende Keywords** (Kampagne → „Keywords“ → „Ausschließende Keywords“ → „+“):
```
ipl gerät
gerät kaufen
zu hause
philips
braun
selber
ausbildung
schulung
job
stellenangebot
gebraucht
test
erfahrungen forum
```

**Hinweis:** Kundenlisten und Remarketing für Schönheitsbehandlungen sind bei Google eingeschränkt. Nichts davon einrichten.


## Nach dem Start

3–4 Tage nichts ändern · erst ab 20–50 bestätigten Terminen bewerten, dann nur eine Sache ändern.
Gute Anzeige = viele **bestätigte** Termine, wenige „nicht erschienen“ (steht im Monatsreport).
