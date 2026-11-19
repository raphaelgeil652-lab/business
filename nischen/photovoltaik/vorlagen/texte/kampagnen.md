# Kampagnen — {{betrieb}}

> Alles fertig zum Eintragen, Texte 1:1 kopieren. Bilder: Ordner „9 Anzeigen-Bilder“.
> Die Klickwege unten sind so, wie Meta und Google sie im November 2026 zeigen. Heißt ein Feld anders,
> nimm das, was am nächsten dran ist. Alles erst als **Entwurf** anlegen. Live geht es in Schritt 7.

## Vorher: Messung einrichten (einmal pro Kunde, vor dem Hochladen der Seiten)

**Meta-Pixel (Meta nennt es „Datensatz“)**
1. business.facebook.com/settings → links **„Datenquellen“ → „Datensätze“** → **„Hinzufügen“**.
2. Name: `{{betrieb}}` → **„Erstellen“**.
3. Frage „Wähle die Werbekonten aus …“: das **Werbekonto des Kunden** ankreuzen → **„Weiter“**.
   (Steht es nicht in der Liste: Der Kunde hat dich noch nicht als Partner eingeladen, siehe Schritt 5.)
4. Fragt Meta danach, wie du einrichten willst, oder zeigt „Für mich einrichten“: **schließen**. Der Code
   steckt schon in den Seiten.
5. Die lange Zahl (**Datensatz-ID**, 15–16 Ziffern) kopieren → Steckbrief Teil 4, mit `'` davor.
   Das Ereignis „Lead“ meldet die Danke-Seite von selbst, nur wenn der Besucher den Cookies zustimmt.

**Google-Ads-Conversion** (so geklickt im Probelauf, November 2026)

Voraussetzung: Das Google-Ads-Konto des Kunden hängt an deinem Verwaltungskonto (Hilfe „Schritt 6“, Punkt 0).
Google Ads am besten in **Chrome, ohne VPN und ohne Werbeblocker**. Sonst bleibt es gern mit „Ein Fehler ist
aufgetreten“ hängen.

1. ads.google.com → oben auf den Kontonamen → das **Konto des Kunden** wählen (nicht dein Verwaltungskonto).
2. Links **„Zielvorhaben“** (der Pokal) → **„Conversions“** → **„Zusammenfassung“** → **„Conversions erstellen“**
   bzw. „+ Conversion-Aktion“.
3. Bei **„Conversions auf einer Website“** den Haken setzen → rechts **„URL hinzufügen“** →
   `{{landingpage_url}}`. Die anderen drei Haken (App, Anrufe, Offline) leer lassen →
   **„Speichern und fortfahren“**. Ist die Seite noch nicht online, findet Google nichts. Das ist egal.
4. **„+ Conversion erstellen“** bzw. „manuell“ → Kategorie **„Lead-Formular senden“** → Name
   `Anfrage Wirtschaftlichkeitsprüfung` → Wert: **„Für jede Conversion denselben Wert verwenden“, 1 €**
   („keinen Wert“ gibt es nicht mehr; der Wert ist uns egal) → Zählung **„Eine“** → **„Speichern und fortfahren“**.
   Steht daneben „Primäre Zahlungsmethode“: falsche Übersetzung von „primäre Aktion“, passt so.
5. Es kommt ein Fenster **„Google-Tag einrichten“** mit Code `GTM-…` und dem Knopf „Einfügung testen“:
   **„Abbrechen“** bzw. **×**. Nichts einbauen, das machen unsere Seiten selbst.
6. **Den Wert holen:** „Zielvorhaben“ → „Conversions“ → **„Alle Conversions“** → auf
   **„Anfrage Wirtschaftlichkeitsprüfung“** klicken → ganz nach unten scrollen → im Kasten „Datenquellen“
   rechts **„Verwalten“** → **„Einrichten“**. Es öffnet sich der **Tag Manager** → unten bei „Ausstehende
   Änderungen“ den blauen Link **„Anfrage Wirtschaftlichkeitsprüfung“** anklicken.
7. Dort stehen **„Conversion-ID“** (nur Ziffern) und **„Conversion-Label“** (Buchstaben und Zahlen).
   Die „Conversion-Typ-ID“ brauchst du nicht. Tag Manager mit × schließen, **nicht auf „Senden“ klicken**.
8. Daraus wird: `AW-` + Conversion-ID + `/` + Conversion-Label, z. B. `AW-123456789/AbCdEfGhIj`
   → Steckbrief Teil 4 „Google-Ads-Conversion“, mit `'` davor.

Einmal prüfen: links „Verwaltung“ (Zahnrad) → „Kontoeinstellungen“ → **„Automatische Tagkennzeichnung“
muss an sein** (ist es normalerweise). Ohne sie kann Google die Anfragen keiner Anzeige zuordnen.

Status „Warten auf Conversions“ ist normal. Er bleibt, bis die erste Anfrage über eine Google-Anzeige kommt.

Dann Steckbrief an Claude: „Erzeuge {{betrieb}} neu.“ Erst danach die Seiten hochladen.

## Meta-Kampagne anlegen: Klick für Klick

adsmanager.facebook.com → oben links das **Werbekonto des Kunden** wählen → grüner Knopf **„+ Erstellen“**.

### 1 · Kampagne

| Feld | Eintrag |
|---|---|
| Buchungsart | **Auktion** |
| Kampagnenziel | **Leads** → Weiter |
| Name der Kampagne | `PV – Wirtschaftlichkeit – {{betrieb}}` |
| Budgetstrategie | **Kampagnenbudget** |
| Tagesbudget | **{{budget_meta_tag}}** (= {{budget_meta}} im Monat ÷ 30) |
| Kampagnengebotsstrategie | **Höchstes Volumen** |
| A/B-Test | aus |
| Spezielle Anzeigenkategorien | **nichts** auswählen |

→ Weiter

### 2 · Anzeigengruppe

| Feld | Eintrag |
|---|---|
| Name der Anzeigengruppe | `{{ort}} {{einzugsgebiet_km}} km` |
| Conversion-Ort | **Website** |
| Performance-Ziel | **Anzahl der Leads maximieren** (nicht „Wert der Conversions“) |
| Datensatz | **{{betrieb}}** |
| Conversion-Event | **Lead** |
| Attributionsmodell | so lassen |
| Kostenziel pro Ergebnis | leer lassen |
| Dynamische Anzeigengestaltung | aus |
| Live-Video-Ad | aus |
| Budget und Zeitplan | Start heute, **kein Enddatum** |

**Zielgruppe** („Advantage+ aktiviert“ lässt sich nicht abschalten, das ist in Ordnung). Unter
„Einschränkungen“ – die hält Meta immer ein:

| Feld | Eintrag |
|---|---|
| Standorte | „Deutschland“ mit dem **x** entfernen → `{{ort}}` eintippen und den richtigen Ort wählen → Umkreis **{{einzugsgebiet_km}} km** → wenn angeboten: „Personen, die hier leben“ |
| Mindestalter | so hoch wie möglich, bis **35** |
| Unbekanntes Alter auf WhatsApp | **ausschließen** |
| Sprachen | **Deutsch** |
| Zielgruppe vorschlagen | wenn dort ein Alter steht: **35 bis 65+** |
| Custom Audiences | nichts |

| Weiter unten | Eintrag |
|---|---|
| Platzierungen | **Advantage+** so lassen |
| Wert-Regeln, Einschränkungen auf Kontoebene, Brand Safety | nichts ändern |
| Transparenz (Werbetreibender und Zahlender) | erst in Schritt 7, vor dem Livegang |

→ Weiter

### 3 · Anzeige (für jede der 5 Anzeigen)

| Feld | Eintrag |
|---|---|
| Name der Anzeige | `W1 Vorher-Nachher` (bzw. W2 … W5) |
| Partnership Ad | aus |
| Facebook-Seite | die Seite des Kunden |
| Instagram-Profil | „Facebook-Seite verwenden“ (oder sein Instagram, wenn verknüpft) |
| Threads, WhatsApp, Branding | nichts |
| Anzeigenkonfiguration | „Werbeanzeige erstellen“; Kasten „Shopping-Erlebnis“ → **„Später erinnern“** |
| Anzeigengestaltung | **„Anzeigengestaltung konfigurieren“ → „Image Ad“** → es öffnet sich ein Assistent: |

Der Assistent hat oben eine Leiste mit Stufen:

| Stufe | Eintrag |
|---|---|
| Medien | Bild aus „9 Anzeigen-Bilder“ hochladen (W1: `w1-vorher-nachher.png`) |
| Konfiguration | **Quell-URL** = Zieladresse der Anzeige (siehe unten). Branding aus, Sitelinks aus |
| Zuschneiden | so lassen |
| Text | Primärtext, Überschrift, Beschreibung von unten kopieren. Button / Call to Action: **Registrieren** |
| Bildgenerierung | **nichts generieren** |
| Optimierungen | **alle Schalter aus** (sonst verändert Meta Bild und Text) |
| Übersetzung | nichts |

| Danach | Eintrag |
|---|---|
| Tracking | Website-Events: **{{betrieb}}** angehakt. Gibt es das Feld „URL-Parameter“: Parameter von unten eintragen |

**Weitere Anzeigen:** in der linken Spalte bei der Anzeige „…“ → **Duplizieren** → Name, Bild, Texte,
Quell-URL und Parameter austauschen.

**Ende: NICHT „Veröffentlichen“.** Oben links schließen. In der Liste steht „Entwurf“.

Zieladressen und Parameter:

| Anzeige | Quell-URL | URL-Parameter |
|---|---|---|
| W1, W2, W3, W5 | `{{landingpage_url}}/wirtschaftlichkeit.html` | `utm_source=meta&utm_campaign=pv-w1` (w2, w3, w5) |
| W4 | `{{landingpage_url}}/rechner.html` | `utm_source=meta&utm_campaign=pv-w4` |
<!--VERLOSUNG-->| Modul, Rabatt, Speicher | `{{landingpage_url}}/modul.html`, `/rabatt.html`, `/speicher.html` | `utm_source=meta&utm_campaign=pv-modul` (rabatt, speicher) |
<!--/VERLOSUNG-->

### Dauerkampagne: Wirtschaftlichkeitsprüfung (das ganze Jahr)

Jede Anzeige zeigt eine gekennzeichnete Beispielrechnung und die Schritte „eintragen → wir rechnen
→ Ergebnis“. Die Prüfung gibt es erst nach der Eintragung. Button bei allen: **Registrieren**.

**W1 — Vorher/Nachher** · Bild `w1-vorher-nachher.png` · Ziel `wirtschaftlichkeit.html`
- Primärtext: Rund {{w_kosten_jahr}} zahlt ein Haushalt mit {{w_verbrauch}} kWh im Jahr für Strom. Mit eigener Solaranlage und Speicher könnten es rund {{w_kosten_solar_jahr}} sein. Wie es bei Ihnen aussieht, rechnen wir nach Ihrer Eintragung kostenlos nach.
  👉 Jetzt eintragen.
- Headline: Ihre kostenlose Wirtschaftlichkeitsprüfung
- Beschreibung: Erst eintragen, dann rechnen wir für Ihr Haus.

**W2 — Abschlag** · Bild `w2-abschlag.png` · Ziel `wirtschaftlichkeit.html`
- Primärtext: Schauen Sie mal auf Ihren Abschlag. Liegt er bei {{w_abschlag}} oder mehr? Mit Solar und Speicher könnte er bei rund {{w_abschlag_solar}} liegen. Tragen Sie sich ein, dann rechnen wir es mit Ihren echten Zahlen nach.
  👉 Jetzt eintragen.
- Headline: Ihr Abschlag, nachgerechnet
- Beschreibung: Kostenlos, nach Eintragung.

**W3 — Prüfung** · Bild `w3-pruefung.png` · Ziel `wirtschaftlichkeit.html`
- Primärtext: Rechnet sich Solar bei Ihnen? Tragen Sie sich ein und schicken Sie uns ein Foto Ihrer Stromrechnung. Wir rechnen Ersparnis und Amortisation für Ihr Haus und melden uns innerhalb von {{pruefung_dauer}}.
  👉 Jetzt eintragen.
- Headline: Rechnet sich Solar bei Ihnen?
- Beschreibung: Kostenlose Wirtschaftlichkeitsprüfung.

**W4 — Rechner** · Bild `w4-rechner.png` · Ziel `rechner.html`
- Primärtext: Wie viel Strom könnten Sie selbst erzeugen? 3 Fragen, sofort eine erste Schätzung. Die genaue Wirtschaftlichkeitsprüfung für Ihr Haus gibt es kostenlos nach Ihrer Eintragung.
  👉 Jetzt ausrechnen.
- Headline: 60-Sekunden-Solarrechner
- Beschreibung: Erste Schätzung sofort.

**W5 — 20 Jahre** · Bild `w5-20-jahre.png` · Ziel `wirtschaftlichkeit.html`
- Primärtext: {{w_verbrauch}} kWh im Jahr, heutiger Preis, {{w_jahre}} Jahre: Das sind rund {{w_kosten_jahre}} für Strom, ohne einen Cent Preissteigerung. Wie viel davon Sie selbst erzeugen könnten, rechnen wir nach Ihrer Eintragung kostenlos aus.
  👉 Jetzt eintragen.
- Headline: {{w_kosten_jahre}} für Strom?
- Beschreibung: Kostenlose Wirtschaftlichkeitsprüfung.

<!--VERLOSUNG-->
### Saisonaktion: Verlosung (2–3 × im Jahr, nur wenn aktiv)

Läuft parallel zur Dauerkampagne. Vorschlag: Budget in dieser Zeit etwa hälftig aufteilen.

**Anzeige 1 — Gewinnspiel Modul** · Bild `1-gewinnspiel.png` · Ziel `modul.html` · Button **Registrieren**
- Primärtext: ☀️ Gewinnspiel für Hausbesitzer in Ihrer Region: Unter allen Anfragen bis {{aktion_ende_kurz}} verlosen wir ein kostenloses Modul. Mitmachen dauert 30 Sekunden.
  👉 Jetzt teilnehmen.
- Headline: Gewinnen Sie ein Solarmodul
- Beschreibung: Teilnahme bis {{aktion_ende_kurz}}.

**Anzeige 2 — Verlosung 20 % Rabatt** · Bild `2-rabatt.png` · Ziel `rabatt.html` · Button **Registrieren**
- Primärtext: Verlosung bis {{aktion_ende_kurz}}: Unter allen Anfragen verlosen wir 3 × 20 % Rabatt auf die erste Bestellung Ihrer Solaranlage.{{team_satz}}
  👉 Jetzt teilnehmen.
- Headline: 20 % Rabatt gewinnen
- Beschreibung: 3 Gewinner, Verlosung bis {{aktion_ende_kurz}}.

**Anzeige 3 — Verlosung Stromspeicher** · Bild `3-speicher.png` · Ziel `speicher.html` · Button **Registrieren**
- Primärtext: Wir verlosen 3 Stromspeicher! Unter allen Anfragen bis {{aktion_ende_kurz}} ziehen wir 3 Gewinner, die den Speicher gratis zu ihrer ersten Bestellung bekommen. Mitmachen dauert 30 Sekunden.
  👉 Jetzt teilnehmen.
- Headline: 3 Stromspeicher zu gewinnen
- Beschreibung: Gratis zur ersten Bestellung.

Eigene Kampagne `PV – Verlosung – {{betrieb}}`, gleiche Einstellungen wie oben, Zieladressen siehe Tabelle.
<!--/VERLOSUNG-->

Vor dem Livegang (Schritt 7):
- [ ] In der Vorschau rechts: Sieht jede Anzeige aus wie das Original-Bild? (sonst „Optimierungen“ prüfen)
- [ ] Test-Anfrage über jede Seite, im Events Manager unter „Events testen“ erscheinen „PageView“ und „Lead“

## Google-Kampagne anlegen: Klick für Klick

Voraussetzung: Der Kunde hat in seinem Google-Ads-Konto seine **Zahlungsart** hinterlegt (Schritt 5). Ohne
Zahlungsart fragt Google am Ende nach Zahlungsdaten: **dort nie deine eigenen eintragen**, sonst zahlst du
seine Werbung. Chrome, kein VPN, kein Werbeblocker.

> Im Probelauf geprüft bis einschließlich Punkt 5 („Websitebesuche“). Danach blieb Google mit „Ein Fehler ist
> aufgetreten“ hängen (VPN war an). Die Punkte ab 6 folgen dem üblichen Aufbau. Heißt ein Feld anders, nimm das
> Nächstliegende. Hängt Google: „Reload“, sonst Tab schließen und neu öffnen. Angefangenes liegt unter
> Kampagnen → „Entwürfe“.

ads.google.com → **Konto des Kunden** wählen → links **„Kampagnen“** → blauer **„+“** → **„Neue Kampagne“**.

### 1 · Ziel und Typ
1. Zielvorhaben: **„Leads“**.
2. Darunter bei den Conversion-Zielen muss **„Lead-Formular senden“** stehen. Andere Ziele mit dem
   Mülleimer entfernen.
3. Kampagnentyp: **„Suche“**.
4. „Wählen Sie aus, wie Sie Ihr Zielvorhaben erreichen möchten“: **nur „Websitebesuche“** →
   `{{landingpage_url}}/wirtschaftlichkeit.html`. **Nicht „Eingereichte Lead-Formulare“**: Das wäre ein
   Formular bei Google, die Anfragen kämen nicht in die Zentrale. Anrufe, Ladenbesuche, Nachrichten leer.
5. Kampagnenname: `Suche – PV {{ort}}` → **„Weiter“**.

### 2 · Gebote
6. „Worauf möchten Sie sich konzentrieren?“: **„Klicks“** → Haken bei **„Maximales CPC-Gebotslimit
   festlegen“** → `3,00 €` → **„Weiter“**. (Ab ca. 30 Anfragen über Google auf „Conversions“ umstellen.)

### 3 · Kampagneneinstellungen
7. Netzwerke: **beide Haken raus** („Google Suchnetzwerk-Partner“ und „Google Displaynetzwerk“).
8. Standorte: **„Anderen Standort eingeben“** → **„Erweiterte Suche“** → **„Umkreis“** → `{{ort}}`,
   `{{einzugsgebiet_km}}` km → **„Speichern“**. „Deutschland“ darf nicht mehr ausgewählt sein.
9. **„Standortoptionen“** aufklappen → **„Präsenz: Personen an Ihren ausgewählten Standorten oder Personen,
   die sich regelmäßig dort aufhalten“**.
10. Sprachen: **Deutsch** (sonst nichts).
11. Zielgruppensegmente: überspringen.
12. „Politische Werbung in der EU“: **„Nein“**.
13. **„Weitere Einstellungen“** aufklappen → **„Kampagnen-URL-Optionen“** → „Suffix der finalen URL“:
    `utm_source=google&utm_campaign=pv-suche`. Gibt es „Automatisch erstellte Assets“: **aus**.
14. **„Weiter“**. Fragt Google nach **„AI Max“** oder „weitgehend passende Keywords“: **aus**.

### 4 · Keywords und Anzeige
15. Anzeigengruppenname: `PV {{ort}}`.
16. Keywords, **mit den Anführungszeichen**, eins pro Zeile (dann zählt nur genau diese Wortgruppe):
```
"photovoltaik {{ort_klein}}"
"solaranlage {{ort_klein}}"
"pv anlage {{ort_klein}}"
"photovoltaik mit speicher"
"solarteur"
"pv anlage kosten"
"stromspeicher nachrüsten"
```
17. Finale URL: `{{landingpage_url}}/wirtschaftlichkeit.html` · Pfad: `Photovoltaik` / `Pruefung`.
18. Überschriften (Google will 15, je höchstens 30 Zeichen; zeigt Google rot, kürzen):
    1. Solaranlage in {{ort}} · 2. Photovoltaik in {{ort}} · 3. Rechnet sich Solar für Sie? · 4. Festpreis-Angebot vorab ·
    5. PV-Anlage mit Speicher · 6. Betrieb aus {{ort}} · 7. 0 % MwSt bis 30 kWp · 8. {{team_headline}} ·
    9. Kein Vermittler, kein Portal · 10. Jetzt Termin anfragen · 11. {{betrieb}} · 12. Stromspeicher nachrüsten ·
    13. Prüfung nach Eintragung · 14. Rückruf am selben Tag · 15. Unverbindlich & kostenlos
    Überschrift 3 an **Position 1 anheften**: auf die Nadel neben dem Feld → „Position 1“.
19. Beschreibungen (4, je höchstens 90 Zeichen):
    1. Wir rechnen Ertrag und Speicher für Ihren Verbrauch, kostenlos nach Ihrer Eintragung.
    2. Festpreis-Angebot, bevor Sie sich entscheiden. Ein Betrieb aus der Region.
    3. Für Anlagen bis 30 kWp auf Wohnhäusern fallen 0 % Mehrwertsteuer an.
    4. {{team_beschr}}. Jetzt eintragen, Prüfung kostenlos.
20. Sitelinks, Bilder und andere Assets: überspringen → **„Weiter“**.

### 5 · Budget und Abschluss
21. Budget: **„Benutzerdefiniertes Budget festlegen“** → **{{budget_google_tag}}** pro Tag → **„Weiter“**.
22. Überprüfen → **„Kampagne veröffentlichen“** → danach sofort in der Liste „Kampagnen“ beim Status auf
    **„Pausiert“** stellen. Aktiv wird sie erst in Schritt 7.
23. **Ausschließende Keywords** (gibt es erst nach dem Anlegen): Kampagne anklicken → links „Keywords“ →
    „Ausschließende Keywords“ → **„+“** → „Zu Kampagne hinzufügen“ → eins pro Zeile → Speichern:
```
balkonkraftwerk
steckersolar
gebraucht
selber bauen
diy
job
ausbildung
stellenangebot
gehalt
reinigung
mieter
```

## Nach dem Start

3–4 Tage nichts ändern · erst ab 20–50 Anfragen bewerten, dann nur eine Sache ändern.
Anfragen, Rückrufzeit und Stand sammelt die Zentrale von selbst. Du schaust montags in die Übersichtsmail.
