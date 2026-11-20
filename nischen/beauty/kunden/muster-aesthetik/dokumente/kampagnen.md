# Kampagnen — Muster Ästhetik · Faltenbehandlung und Hyaluron

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
- ✗ nicht erlaubt: Preise in der Werbung
- ✗ nicht erlaubt: Behandlung direkt buchen
- Wer darf behandeln: Arzt/Ärztin (Muskelrelaxans und Hyaluron) oder Heilpraktiker/in (nur Hyaluron). Kosmetikstudios: nein.
- Kurz: Heilmittelwerbegesetz: kein „Botox“, kein Vorher/Nachher, keine Verlosung, keine Rabatte, kein „kostenlos“
- Nie das Wort „Botox“, nie Makel ansprechen („Sie haben Falten?“), keine Garantie, kein „schmerzfrei“.

## Vorher: Messung einrichten (einmal pro Kunde, vor dem Hochladen der Seiten)

**Meta-Pixel (Meta nennt es „Datensatz“)**
1. business.facebook.com/settings → links **„Datenquellen“ → „Datensätze“** → **„Hinzufügen“**.
2. Name: `Muster Ästhetik` → **„Erstellen“**.
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
   `https://muster-aesthetik.netlify.app`. Die anderen drei Haken (App, Anrufe, Offline) leer lassen →
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

Dann Steckbrief an Claude: „Erzeuge Muster Ästhetik neu.“ Erst danach die Seiten hochladen.

## Meta-Kampagne anlegen: Klick für Klick

adsmanager.facebook.com → oben links das **Werbekonto des Studios** wählen → grüner Knopf **„+ Erstellen“**.

### 1 · Kampagne

| Feld | Eintrag |
|---|---|
| Buchungsart | **Auktion** |
| Kampagnenziel | **Leads** → Weiter |
| Name der Kampagne | `Beauty – Faltenbehandlung und Hyaluron – Muster Ästhetik` |
| Budgetstrategie | **Kampagnenbudget** |
| Tagesbudget | **18 €** (= 550 € im Monat ÷ 30) |
| Kampagnengebotsstrategie | **Höchstes Volumen** |
| Spezielle Anzeigenkategorien | **nichts** auswählen |

### 2 · Anzeigengruppe

| Feld | Eintrag |
|---|---|
| Name der Anzeigengruppe | `Musterstadt 15 km` |
| Conversion-Ort | **Website** |
| Performance-Ziel | **Anzahl der Leads maximieren** |
| Datensatz | **Muster Ästhetik** |
| Conversion-Event | **Lead** |
| Budget und Zeitplan | Start heute, **kein Enddatum** |

**Zielgruppe** (unter „Einschränkungen“):

| Feld | Eintrag |
|---|---|
| Standorte | „Deutschland“ entfernen → `Musterstadt` → Umkreis **15 km** → „Personen, die hier leben“ |
| Mindestalter | **18** (Pflicht bei Schönheitsbehandlungen), gern höher: Vorschlag 30 bis 65 |
| Sprachen | **Deutsch** |
| Zielgruppe vorschlagen | Alter 30 bis 65 · Geschlecht: alle; Frauen sind die Mehrheit, rund jeder neunte ist ein Mann (DGÄPC 2025) |
| Platzierungen | **Advantage+** so lassen |

**Wenn Meta „Lead“ nicht anbietet oder ausgraut** (kommt bei Gesundheit/Schönheit vor): Performance-Ziel
**„Anzahl der Landingpage-Aufrufe maximieren“** nehmen. Nach den ersten 20–30 bestätigten Terminen nochmal
versuchen, auf „Leads“ umzustellen.

### 3 · Anzeigen (für jede der Anzeigen unten)

Wie bei jeder Anzeige: „Anzeigengestaltung konfigurieren“ → **„Image Ad“** → Bild hochladen → **Quell-URL** =
Zieladresse unten → Texte kopieren → Button **„Jetzt buchen“** (heißt bei Meta „Book now“ bzw. „Jetzt buchen“;
gibt es ihn nicht: „Mehr dazu“) → bei „Optimierungen“ **alle Schalter aus** → Tracking: Datensatz **Muster Ästhetik**.
Weitere Anzeigen: links bei der Anzeige „…“ → **Duplizieren** → Bild, Texte, Parameter austauschen.

**Ende: NICHT „Veröffentlichen“.** Oben links schließen. In der Liste steht „Entwurf“.

**1 · f1-beratung** · Bild `f1-beratung.png` · Quell-URL `https://muster-aesthetik.netlify.app/termin.html` · URL-Parameter `utm_source=meta&utm_campaign=falten-f1`
- Primärtext: Sie überlegen, ob eine Faltenbehandlung oder Hyaluron das Richtige für Sie ist? Im persönlichen Gespräch bei Muster Ästhetik klären wir alle Fragen zu Ablauf, Wirkung und Risiken. Danach entscheiden Sie in Ruhe.
  👉 Beratungstermin online wählen.
- Überschrift: Erst beraten, dann entscheiden
- Beschreibung: Beratungstermin online wählen.

**2 · f2-person** · Bild `f2-person.png` · Quell-URL `https://muster-aesthetik.netlify.app/termin.html` · URL-Parameter `utm_source=meta&utm_campaign=falten-f2`
- Primärtext: Ein gutes Ergebnis beginnt mit einem guten Gespräch. Dr. med. Lena Muster, Fachärztin für Dermatologie nimmt sich Zeit für Ihre Fragen und sagt Ihnen ehrlich, was möglich ist und was nicht.
  👉 Beratungstermin online wählen.
- Überschrift: Ehrliche Beratung in Musterstadt
- Beschreibung: Dr. med. Lena Muster, Fachärztin für Dermatologie nimmt sich Zeit.

**3 · f3-ablauf** · Bild `f3-ablauf.png` · Quell-URL `https://muster-aesthetik.netlify.app/termin.html` · URL-Parameter `utm_source=meta&utm_campaign=falten-f3`
- Primärtext: Beratung zur Faltenbehandlung und zu Hyaluron, ganz einfach: Termin online wählen, per E-Mail bestätigen, vorbeikommen. Alle Fragen klären wir im Gespräch.
  👉 Freie Termine ansehen.
- Überschrift: Beratung in 3 Schritten
- Beschreibung: Freie Termine online ansehen.

**4 · f4-hyaluron** · Bild `f4-hyaluron.png` · Quell-URL `https://muster-aesthetik.netlify.app/termin.html` · URL-Parameter `utm_source=meta&utm_campaign=falten-f4`
- Primärtext: Sie interessieren sich für eine Behandlung mit Hyaluron, zum Beispiel an den Lippen? Im Beratungsgespräch bei Muster Ästhetik erfahren Sie, was möglich ist, was dazugehört und was es kostet.
  👉 Beratungstermin online wählen.
- Überschrift: Beratung zu Hyaluron
- Beschreibung: Persönlich, in Musterstadt.

**5 · f5-online** · Bild `f5-online.png` · Quell-URL `https://muster-aesthetik.netlify.app/termin.html` · URL-Parameter `utm_source=meta&utm_campaign=falten-f5`
- Primärtext: Bei Muster Ästhetik sehen Sie alle freien Beratungstermine online und buchen in 30 Sekunden. Die Bestätigung kommt per E-Mail.
  👉 Freie Termine ansehen.
- Überschrift: Beratungstermin online buchen
- Beschreibung: Freie Zeiten ansehen.


## Google-Kampagne anlegen: Klick für Klick

Voraussetzung: Das Studio hat in seinem Google-Ads-Konto seine **Zahlungsart** hinterlegt. Ohne Zahlungsart fragt
Google am Ende nach Zahlungsdaten: **dort nie deine eigenen eintragen.** Chrome, kein VPN, kein Werbeblocker.

ads.google.com → **Konto des Studios** wählen → links **„Kampagnen“** → blauer **„+“** → **„Neue Kampagne“**.

1. Zielvorhaben **„Leads“** → Conversion-Ziel **„Lead-Formular senden“** (die Conversion „Termin bestätigt“). Andere Ziele entfernen.
2. Kampagnentyp **„Suche“** → nur **„Websitebesuche“**: `https://muster-aesthetik.netlify.app/termin.html`. Nicht „Eingereichte Lead-Formulare“.
3. Name: `Suche – Faltenbehandlung und Hyaluron Musterstadt` → **„Weiter“**.
4. Gebote: **„Klicks“** → Haken bei „Maximales CPC-Gebotslimit“ → `4,00 €`. (Ab ca. 30 bestätigten Terminen über Google auf „Conversions“ umstellen.)
5. Netzwerke: **beide Haken raus**. Standort: **„Umkreis“** `Musterstadt`, `15` km. Standortoption: **„Präsenz“**. Sprache: **Deutsch**.
6. „Politische Werbung in der EU“: **„Nein“**. Weitere Einstellungen → „Suffix der finalen URL“: `utm_source=google&utm_campaign=falten-suche`. Automatisch erstellte Assets: **aus**. „AI Max“ / weitgehend passende Keywords: **aus**.
7. Anzeigengruppe `Faltenbehandlung und Hyaluron Musterstadt`, Keywords **mit Anführungszeichen**, eins pro Zeile:
```
"faltenbehandlung musterstadt"
"faltenunterspritzung musterstadt"
"hyaluron musterstadt"
"lippen aufspritzen musterstadt"
"ästhetische medizin musterstadt"
"faltenbehandlung kosten"
"hyaluron lippen"
```
8. Finale URL: `https://muster-aesthetik.netlify.app/termin.html` · Pfad: `Beratung / Termin`.
9. Überschriften (15, je höchstens 30 Zeichen; zeigt Google rot, kürzen):
    1. Faltenbehandlung
    2. Beratung zu Hyaluron
    3. Erst beraten, dann entscheiden
    4. Termin online buchen
    5. Ärztliche Beratung
    6. Muster Ästhetik
    7. Freie Termine ansehen
    8. Persönlich und ohne Druck
    9. Aufklärung vor Behandlung
    10. Beratung in Musterstadt
    11. Ohne Warteschleife buchen
    12. Ihr Termin in 30 Sekunden
    13. Ehrliche Einschätzung
    14. Ästhetik in Musterstadt
    15. Lippen und Konturen
   Überschrift 1 an **Position 1 anheften**.
10. Beschreibungen (4, je höchstens 90 Zeichen):
    1. Persönliches Gespräch zu Faltenbehandlung und Hyaluron. Danach entscheiden Sie in Ruhe.
    2. Ausführliche Aufklärung über Ablauf, Wirkung und Risiken. Termin online wählen.
    3. Freie Beratungstermine sehen und in 30 Sekunden buchen. Bestätigung per E-Mail.
    4. Muster Ästhetik in Musterstadt. Behandlung nur nach Aufklärung.
11. Budget: **10 €** pro Tag → **„Kampagne veröffentlichen“** → sofort auf **„Pausiert“**.
12. **Ausschließende Keywords** (Kampagne → „Keywords“ → „Ausschließende Keywords“ → „+“):
```
creme
serum
kaufen
selber
kurs
ausbildung
schulung
job
stellenangebot
türkei
pen
ohne nadel
```

**Wichtig bei Faltenbehandlung:** Das Wort „Botox“ (und andere Markennamen) nie in Anzeigen oder Keywords: Google sperrt verschreibungspflichtige Mittel. Kundenlisten, Remarketing und ähnliche Zielgruppen sind bei Schönheitsbehandlungen nicht erlaubt. Lehnt Google eine Anzeige ab, die betroffene Überschrift weglassen, nicht umformulieren und neu einreichen.


## Nach dem Start

3–4 Tage nichts ändern · erst ab 20–50 bestätigten Terminen bewerten, dann nur eine Sache ändern.
Gute Anzeige = viele **bestätigte** Termine, wenige „nicht erschienen“ (steht im Monatsreport).
