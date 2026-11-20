# Kampagnen — {{betrieb}} · {{modul_name}}

> Für die Technik bei euch ({{technik_name}}). Alles fertig zum Eintragen, Texte 1:1 kopieren. Bilder: Ordner „9 Anzeigen-Bilder“.
> Die Klickwege sind so, wie Meta und Google sie im November 2026 zeigen. Heißt ein Feld anders, nimm das Nächstliegende.
> Alles erst als **Entwurf** anlegen. Live geht es in Schritt 7.

**Was gezählt wird:** Meta bekommt „Lead“ und Google eine Conversion erst, wenn die Kundin ihren Termin **in der Mail
bestätigt** hat (Seite `bestaetigen.html`). Reservierungen, die nie bestätigt werden, und Fake-Buchungen zählen nicht.
So lernen Meta und Google, Menschen zu finden, die wirklich kommen.

**Regeln für diese Behandlung** (stecken schon in den Texten, nichts dazu erfinden):
{{regeln_liste}}

## Vorher: Messung einrichten (einmal pro Kunde, vor dem Hochladen der Seiten)

**Meta-Pixel (Meta nennt es „Datensatz“)**
1. business.facebook.com/settings → links **„Datenquellen“ → „Datensätze“** → **„Hinzufügen“**.
2. Name: `{{betrieb}}` → **„Erstellen“**.
3. Frage „Wähle die Werbekonten aus …“: das **Werbekonto des Studios** ankreuzen → **„Weiter“**.
4. Fragt Meta, wie ihr einrichten wollt: **schließen**. Der Code steckt schon in den Seiten.
5. Die **Datensatz-ID** (15–16 Ziffern) kopieren → Steckbrief Teil 5, mit `'` davor.
6. **Gesundheit und Schönheit:** Meta schränkt bei manchen Studios und Praxen die Daten ein („eingeschränkte
   Datennutzung“). Steht im Events Manager ein solcher Hinweis, ist das kein Fehler von euch. Die Seite sendet
   ohnehin keine Behandlungsnamen. Siehe unten „Wenn Meta ‚Lead‘ nicht anbietet“.

**Google-Ads-Conversion** (so geklickt im Probelauf, November 2026)

Voraussetzung: Das Google-Ads-Konto des Kunden hängt an eurem Verwaltungskonto (Hilfe „Schritt 6“, Punkt 0).
Google Ads am besten in **Chrome, ohne VPN und ohne Werbeblocker**. Sonst bleibt es gern mit „Ein Fehler ist
aufgetreten“ hängen.

1. ads.google.com → oben auf den Kontonamen → das **Konto des Kunden** wählen (nicht euer Verwaltungskonto).
2. Links **„Zielvorhaben“** (der Pokal) → **„Conversions“** → **„Zusammenfassung“** → **„Conversions erstellen“**
   bzw. „+ Conversion-Aktion“.
3. Bei **„Conversions auf einer Website“** den Haken setzen → rechts **„URL hinzufügen“** →
   `{{landingpage_url}}`. Die anderen drei Haken (App, Anrufe, Offline) leer lassen →
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
   → Steckbrief Teil 4 „Google-Ads-Conversion“, mit `'` davor.

Einmal prüfen: links „Verwaltung“ (Zahnrad) → „Kontoeinstellungen“ → **„Automatische Tagkennzeichnung“
muss an sein** (ist es normalerweise). Ohne sie kann Google die Anfragen keiner Anzeige zuordnen.

Status „Warten auf Conversions“ ist normal. Er bleibt, bis die erste Kundin nach einem Klick auf eine Google-Anzeige ihren Termin bestätigt.

Dann Steckbrief an Claude: „Erzeuge {{betrieb}} neu.“ Erst danach die Seiten hochladen.

## Meta-Kampagne anlegen: Klick für Klick

adsmanager.facebook.com → oben links das **Werbekonto des Studios** wählen → grüner Knopf **„+ Erstellen“**.

### 1 · Kampagne

| Feld | Eintrag |
|---|---|
| Buchungsart | **Auktion** |
| Kampagnenziel | **Leads** → Weiter |
| Name der Kampagne | `Beauty – {{modul_name}} – {{betrieb}}` |
| Budgetstrategie | **Kampagnenbudget** |
| Tagesbudget | **{{budget_meta_tag}}** (= {{budget_meta}} im Monat ÷ 30) |
| Kampagnengebotsstrategie | **Höchstes Volumen** |
| Spezielle Anzeigenkategorien | **nichts** auswählen |

### 2 · Anzeigengruppe

| Feld | Eintrag |
|---|---|
| Name der Anzeigengruppe | `{{ort}} {{umkreis_km}} km` |
| Conversion-Ort | **Website** |
| Performance-Ziel | **Anzahl der Leads maximieren** |
| Datensatz | **{{betrieb}}** |
| Conversion-Event | **Lead** |
| Budget und Zeitplan | Start heute, **kein Enddatum** |

**Zielgruppe** (unter „Einschränkungen“):

| Feld | Eintrag |
|---|---|
| Standorte | „Deutschland“ entfernen → `{{ort}}` → Umkreis **{{umkreis_km}} km** → „Personen, die hier leben“ |
| Mindestalter | **18** (Pflicht bei Schönheitsbehandlungen), gern höher: Vorschlag {{zielgruppe_alter}} |
| Sprachen | **Deutsch** |
| Zielgruppe vorschlagen | Alter {{zielgruppe_alter}} · Geschlecht: {{zielgruppe_geschlecht}} |
| Platzierungen | **Advantage+** so lassen |

**Wenn Meta „Lead“ nicht anbietet oder ausgraut** (kommt bei Gesundheit/Schönheit vor): Performance-Ziel
**„Anzahl der Landingpage-Aufrufe maximieren“** nehmen. Nach den ersten 20–30 bestätigten Terminen nochmal
versuchen, auf „Leads“ umzustellen.

### 3 · Anzeigen (für jede der Anzeigen unten)

Wie bei jeder Anzeige: „Anzeigengestaltung konfigurieren“ → **„Image Ad“** → Bild hochladen → **Quell-URL** =
Zieladresse unten → Texte kopieren → Button **„Jetzt buchen“** (heißt bei Meta „Book now“ bzw. „Jetzt buchen“;
gibt es ihn nicht: „Mehr dazu“) → bei „Optimierungen“ **alle Schalter aus** → Tracking: Datensatz **{{betrieb}}**.
Weitere Anzeigen: links bei der Anzeige „…“ → **Duplizieren** → Bild, Texte, Parameter austauschen.

**Ende: NICHT „Veröffentlichen“.** Oben links schließen. In der Liste steht „Entwurf“.

{{meta_anzeigen_md}}

## Google-Kampagne anlegen: Klick für Klick

Voraussetzung: Das Studio hat in seinem Google-Ads-Konto seine **Zahlungsart** hinterlegt. Ohne Zahlungsart fragt
Google am Ende nach Zahlungsdaten: **dort nie eure eigenen eintragen.** Chrome, kein VPN, kein Werbeblocker.

ads.google.com → **Konto des Studios** wählen → links **„Kampagnen“** → blauer **„+“** → **„Neue Kampagne“**.

1. Zielvorhaben **„Leads“** → Conversion-Ziel **„Lead-Formular senden“** (die Conversion „Termin bestätigt“). Andere Ziele entfernen.
2. Kampagnentyp **„Suche“** → nur **„Websitebesuche“**: `{{landingpage_url}}/termin.html`. Nicht „Eingereichte Lead-Formulare“.
3. Name: `Suche – {{modul_name}} {{ort}}` → **„Weiter“**.
4. Gebote: **„Klicks“** → Haken bei „Maximales CPC-Gebotslimit“ → `{{cpc_limit}}`. (Ab ca. 30 bestätigten Terminen über Google auf „Conversions“ umstellen.)
5. Netzwerke: **beide Haken raus**. Standort: **„Umkreis“** `{{ort}}`, `{{umkreis_km}}` km. Standortoption: **„Präsenz“**. Sprache: **Deutsch**.
6. „Politische Werbung in der EU“: **„Nein“**. Weitere Einstellungen → „Suffix der finalen URL“: `utm_source=google&utm_campaign={{kampagne_kuerzel}}-suche`. Automatisch erstellte Assets: **aus**. „AI Max“ / weitgehend passende Keywords: **aus**.
7. Anzeigengruppe `{{modul_name}} {{ort}}`, Keywords **mit Anführungszeichen**, eins pro Zeile:
```
{{google_keywords}}
```
8. Finale URL: `{{landingpage_url}}/termin.html` · Pfad: `{{google_pfad}}`.
9. Überschriften (15, je höchstens 30 Zeichen; zeigt Google rot, kürzen):
{{google_headlines}}
   Überschrift 1 an **Position 1 anheften**.
10. Beschreibungen (4, je höchstens 90 Zeichen):
{{google_descriptions}}
11. Budget: **{{budget_google_tag}}** pro Tag → **„Kampagne veröffentlichen“** → sofort auf **„Pausiert“**.
12. **Ausschließende Keywords** (Kampagne → „Keywords“ → „Ausschließende Keywords“ → „+“):
```
{{google_negativ}}
```
{{google_hinweis}}

## Nach dem Start

3–4 Tage nichts ändern · erst ab 20–50 bestätigten Terminen bewerten, dann nur eine Sache ändern.
Gute Anzeige = viele **bestätigte** Termine, wenige „nicht erschienen“ (steht im Monatsreport).
