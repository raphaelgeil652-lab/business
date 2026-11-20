# Kampagnen — Muster Zahnarztpraxis · Zahnaufhellung (Bleaching)

> Alles fertig zum Eintragen, Texte 1:1 kopieren. Bilder: Ordner „9 Anzeigen-Bilder“.
> Die Klickwege sind so, wie Meta und Google sie im November 2026 zeigen. Heißt ein Feld anders, nimm das Nächstliegende.
> Alles erst als **Entwurf** anlegen. Live geht es in Schritt 7.

**Was gezählt wird:** Meta bekommt „Lead“ und Google eine Conversion erst, wenn die Kundin ihren Termin **in der Mail
bestätigt** hat (Seite `bestaetigen.html`). Reservierungen, die nie bestätigt werden, und Fake-Buchungen zählen nicht.
So lernen Meta und Google, Menschen zu finden, die wirklich kommen.

**Regeln für diese Behandlung** (stecken schon in den Texten, nichts dazu erfinden):
- ✗ nicht erlaubt: Verlosung
- ✗ nicht erlaubt: Vorher/Nachher-Fotos
- ✗ nicht erlaubt: Rabatte, Neukundenpreis
- ✗ nicht erlaubt: das Wort „kostenlos“
- ✓ erlaubt: Preise in der Werbung
- ✓ erlaubt: Behandlung direkt buchen
- Wer darf behandeln: Nur Zahnarztpraxen. Bleaching-Studios ohne Zahnarzt sind rechtlich unsicher und kein Kunde.
- Kurz: Berufsordnung der Zahnärzte und Heilmittelwerbegesetz: sachlich, keine Rabatte, keine Verlosung, kein „kostenlos“

## Vorher: Messung einrichten (einmal pro Kunde, vor dem Hochladen der Seiten)

**Meta-Pixel (Meta nennt es „Datensatz“)**
1. business.facebook.com/settings → links **„Datenquellen“ → „Datensätze“** → **„Hinzufügen“**.
2. Name: `Muster Zahnarztpraxis` → **„Erstellen“**.
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
   `https://muster-zahnarztpraxis.netlify.app`. Die anderen drei Haken (App, Anrufe, Offline) leer lassen →
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

Dann Steckbrief an Claude: „Erzeuge Muster Zahnarztpraxis neu.“ Erst danach die Seiten hochladen.

## Meta-Kampagne anlegen: Klick für Klick

adsmanager.facebook.com → oben links das **Werbekonto des Studios** wählen → grüner Knopf **„+ Erstellen“**.

### 1 · Kampagne

| Feld | Eintrag |
|---|---|
| Buchungsart | **Auktion** |
| Kampagnenziel | **Leads** → Weiter |
| Name der Kampagne | `Beauty – Zahnaufhellung (Bleaching) – Muster Zahnarztpraxis` |
| Budgetstrategie | **Kampagnenbudget** |
| Tagesbudget | **12 €** (= 350 € im Monat ÷ 30) |
| Kampagnengebotsstrategie | **Höchstes Volumen** |
| Spezielle Anzeigenkategorien | **nichts** auswählen |

### 2 · Anzeigengruppe

| Feld | Eintrag |
|---|---|
| Name der Anzeigengruppe | `Musterstadt 15 km` |
| Conversion-Ort | **Website** |
| Performance-Ziel | **Anzahl der Leads maximieren** |
| Datensatz | **Muster Zahnarztpraxis** |
| Conversion-Event | **Lead** |
| Budget und Zeitplan | Start heute, **kein Enddatum** |

**Zielgruppe** (unter „Einschränkungen“):

| Feld | Eintrag |
|---|---|
| Standorte | „Deutschland“ entfernen → `Musterstadt` → Umkreis **15 km** → „Personen, die hier leben“ |
| Mindestalter | **18** (Pflicht bei Schönheitsbehandlungen), gern höher: Vorschlag 25 bis 55 |
| Sprachen | **Deutsch** |
| Zielgruppe vorschlagen | Alter 25 bis 55 · Geschlecht: alle |
| Platzierungen | **Advantage+** so lassen |

**Wenn Meta „Lead“ nicht anbietet oder ausgraut** (kommt bei Gesundheit/Schönheit vor): Performance-Ziel
**„Anzahl der Landingpage-Aufrufe maximieren“** nehmen. Nach den ersten 20–30 bestätigten Terminen nochmal
versuchen, auf „Leads“ umzustellen.

### 3 · Anzeigen (für jede der Anzeigen unten)

Wie bei jeder Anzeige: „Anzeigengestaltung konfigurieren“ → **„Image Ad“** → Bild hochladen → **Quell-URL** =
Zieladresse unten → Texte kopieren → Button **„Jetzt buchen“** (heißt bei Meta „Book now“ bzw. „Jetzt buchen“;
gibt es ihn nicht: „Mehr dazu“) → bei „Optimierungen“ **alle Schalter aus** → Tracking: Datensatz **Muster Zahnarztpraxis**.
Weitere Anzeigen: links bei der Anzeige „…“ → **Duplizieren** → Bild, Texte, Parameter austauschen.

**Ende: NICHT „Veröffentlichen“.** Oben links schließen. In der Liste steht „Entwurf“.

**1 · b1-praxis** · Bild `b1-praxis.png` · Quell-URL `https://muster-zahnarztpraxis.netlify.app/termin.html` · URL-Parameter `utm_source=meta&utm_campaign=bleaching-b1`
- Primärtext: Zahnaufhellung gehört in die Zahnarztpraxis. Bei Muster Zahnarztpraxis prüfen wir zuerst Zähne und Zahnfleisch und sagen Ihnen ehrlich, was bei Ihnen möglich ist.
  👉 Erstgespräch online wählen.
- Überschrift: Zahnaufhellung beim Zahnarzt
- Beschreibung: Erstgespräch online wählen.

**2 · b2-erst-pruefen** · Bild `b2-erst-pruefen.png` · Quell-URL `https://muster-zahnarztpraxis.netlify.app/termin.html` · URL-Parameter `utm_source=meta&utm_campaign=bleaching-b2`
- Primärtext: Bevor wir aufhellen, schauen wir genau hin: Sind Zähne und Zahnfleisch gesund? Braucht es vorher eine Reinigung? Danach hellen wir schonend in der Praxis auf.
  👉 Erstgespräch online wählen.
- Überschrift: Erst prüfen, dann aufhellen
- Beschreibung: Zahnaufhellung in Musterstadt.

**3 · b3-anlass** · Bild `b3-anlass.png` · Quell-URL `https://muster-zahnarztpraxis.netlify.app/termin.html` · URL-Parameter `utm_source=meta&utm_campaign=bleaching-b3`
- Primärtext: Eine Hochzeit, ein Jubiläum oder einfach der Sommer steht an? Planen Sie die Zahnaufhellung ein paar Wochen vorher. Das Erstgespräch bei Muster Zahnarztpraxis buchen Sie online.
  👉 Erstgespräch online wählen.
- Überschrift: Zahnaufhellung rechtzeitig planen
- Beschreibung: Erstgespräch online wählen.

**4 · b4-online** · Bild `b4-online.png` · Quell-URL `https://muster-zahnarztpraxis.netlify.app/termin.html` · URL-Parameter `utm_source=meta&utm_campaign=bleaching-b4`
- Primärtext: Bei Muster Zahnarztpraxis sehen Sie alle freien Termine für ein Erstgespräch zur Zahnaufhellung online und buchen in 30 Sekunden.
  👉 Freie Termine ansehen.
- Überschrift: Erstgespräch online buchen
- Beschreibung: Zahnaufhellung in Musterstadt.

**5 · b5-praxis-team** · Bild `b5-praxis-team.png` · Quell-URL `https://muster-zahnarztpraxis.netlify.app/termin.html` · URL-Parameter `utm_source=meta&utm_campaign=bleaching-b5`
- Primärtext: Dr. med. dent. Paul Muster, Zahnarzt und Team von Muster Zahnarztpraxis beraten Sie zur Zahnaufhellung: ehrlich, mit Untersuchung vorab und in Ruhe.
  👉 Erstgespräch online wählen.
- Überschrift: Ihre Zahnarztpraxis in Musterstadt
- Beschreibung: Zahnaufhellung mit Untersuchung.


## Google-Kampagne anlegen: Klick für Klick

Voraussetzung: Das Studio hat in seinem Google-Ads-Konto seine **Zahlungsart** hinterlegt. Ohne Zahlungsart fragt
Google am Ende nach Zahlungsdaten: **dort nie deine eigenen eintragen.** Chrome, kein VPN, kein Werbeblocker.

ads.google.com → **Konto des Studios** wählen → links **„Kampagnen“** → blauer **„+“** → **„Neue Kampagne“**.

1. Zielvorhaben **„Leads“** → Conversion-Ziel **„Lead-Formular senden“** (die Conversion „Termin bestätigt“). Andere Ziele entfernen.
2. Kampagnentyp **„Suche“** → nur **„Websitebesuche“**: `https://muster-zahnarztpraxis.netlify.app/termin.html`. Nicht „Eingereichte Lead-Formulare“.
3. Name: `Suche – Zahnaufhellung (Bleaching) Musterstadt` → **„Weiter“**.
4. Gebote: **„Klicks“** → Haken bei „Maximales CPC-Gebotslimit“ → `4,00 €`. (Ab ca. 30 bestätigten Terminen über Google auf „Conversions“ umstellen.)
5. Netzwerke: **beide Haken raus**. Standort: **„Umkreis“** `Musterstadt`, `15` km. Standortoption: **„Präsenz“**. Sprache: **Deutsch**.
6. „Politische Werbung in der EU“: **„Nein“**. Weitere Einstellungen → „Suffix der finalen URL“: `utm_source=google&utm_campaign=bleaching-suche`. Automatisch erstellte Assets: **aus**. „AI Max“ / weitgehend passende Keywords: **aus**.
7. Anzeigengruppe `Zahnaufhellung (Bleaching) Musterstadt`, Keywords **mit Anführungszeichen**, eins pro Zeile:
```
"bleaching zahnarzt musterstadt"
"zahnaufhellung musterstadt"
"zähne bleichen musterstadt"
"bleaching musterstadt"
"bleaching beim zahnarzt"
"zahnaufhellung zahnarzt"
"bleaching kosten zahnarzt"
```
8. Finale URL: `https://muster-zahnarztpraxis.netlify.app/termin.html` · Pfad: `Bleaching / Termin`.
9. Überschriften (15, je höchstens 30 Zeichen; zeigt Google rot, kürzen):
    1. Zahnaufhellung in Musterstadt
    2. Bleaching beim Zahnarzt
    3. Erst prüfen, dann aufhellen
    4. Termin online buchen
    5. Muster Zahnarztpraxis
    6. Erstgespräch online wählen
    7. Freie Termine ansehen
    8. Untersuchung vorab
    9. Zahnarztpraxis in Musterstadt
    10. Ohne Warteschleife buchen
    11. Ihr Termin in 30 Sekunden
    12. Ehrliche Einschätzung
    13. Aufhellung in der Praxis
    14. Rechtzeitig vor dem Anlass
    15. Schonend aufhellen
   Überschrift 1 an **Position 1 anheften**.
10. Beschreibungen (4, je höchstens 90 Zeichen):
    1. Zahnaufhellung in der Zahnarztpraxis, mit Untersuchung vorab. Erstgespräch online wählen.
    2. Wir sagen Ihnen ehrlich, was bei Ihren Zähnen möglich ist. Termin in 30 Sekunden.
    3. Freie Termine sehen und buchen. Bestätigung per E-Mail.
    4. Muster Zahnarztpraxis in Musterstadt. Erst prüfen, dann aufhellen.
11. Budget: **8 €** pro Tag → **„Kampagne veröffentlichen“** → sofort auf **„Pausiert“**.
12. **Ausschließende Keywords** (Kampagne → „Keywords“ → „Ausschließende Keywords“ → „+“):
```
zuhause
set
strips
kaufen
amazon
dm
rossmann
pen
gel
ausbildung
job
stellenangebot
selber
hausmittel
natron
```

**Hinweis:** Kundenlisten und Remarketing für Schönheitsbehandlungen sind bei Google eingeschränkt. Nichts davon einrichten.


## Nach dem Start

3–4 Tage nichts ändern · erst ab 20–50 bestätigten Terminen bewerten, dann nur eine Sache ändern.
Gute Anzeige = viele **bestätigte** Termine, wenige „nicht erschienen“ (steht im Monatsreport).
