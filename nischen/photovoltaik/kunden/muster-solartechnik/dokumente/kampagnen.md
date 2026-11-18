# Kampagnen — Muster Solartechnik

> Alles fertig zum Eintragen, Texte 1:1 kopieren. Bilder: Ordner „9 Anzeigen-Bilder“.
> Die Klickwege unten sind genau so, wie Meta sie im November 2026 zeigt. Heißt ein Feld anders,
> nimm das, was am nächsten dran ist. Alles erst als **Entwurf** anlegen. Live geht es in Schritt 7.

## Vorher: Messung einrichten (einmal pro Kunde, vor dem Hochladen der Seiten)

**Meta-Pixel (Meta nennt es „Datensatz“)**
1. business.facebook.com/settings → links **„Datenquellen“ → „Datensätze“** → **„Hinzufügen“**.
2. Name: `Muster Solartechnik` → **„Erstellen“**.
3. Frage „Wähle die Werbekonten aus …“: das **Werbekonto des Kunden** ankreuzen → **„Weiter“**.
   (Steht es nicht in der Liste: Der Kunde hat dich noch nicht als Partner eingeladen, siehe Schritt 5.)
4. Fragt Meta danach, wie du einrichten willst, oder zeigt „Für mich einrichten“: **schließen**. Der Code
   steckt schon in den Seiten.
5. Die lange Zahl (**Datensatz-ID**, 15–16 Ziffern) kopieren → Steckbrief Teil 4, mit `'` davor.
   Das Ereignis „Lead“ meldet die Danke-Seite von selbst, nur wenn der Besucher den Cookies zustimmt.

**Google-Ads-Conversion** (nur wenn eine Google-Kampagne läuft)
Google Ads des Kunden → Ziele → Conversions → „Neue Conversion-Aktion“ → Website → manuell
einrichten → Kategorie „Lead-Formular senden“, Wert „keinen Wert“, Zählung „Eine“ → „Google-Tag selbst
einrichten“ → aus dem Ereignis-Snippet `send_to` kopieren (sieht so aus: `AW-123456789/AbCdEf`) →
Steckbrief Teil 4.

Dann Steckbrief an Claude: „Erzeuge Muster Solartechnik neu.“ Erst danach die Seiten hochladen.

## Meta-Kampagne anlegen: Klick für Klick

adsmanager.facebook.com → oben links das **Werbekonto des Kunden** wählen → grüner Knopf **„+ Erstellen“**.

### 1 · Kampagne

| Feld | Eintrag |
|---|---|
| Buchungsart | **Auktion** |
| Kampagnenziel | **Leads** → Weiter |
| Name der Kampagne | `PV – Wirtschaftlichkeit – Muster Solartechnik` |
| Budgetstrategie | **Kampagnenbudget** |
| Tagesbudget | **70 €** (= 2.100 € im Monat ÷ 30) |
| Kampagnengebotsstrategie | **Höchstes Volumen** |
| A/B-Test | aus |
| Spezielle Anzeigenkategorien | **nichts** auswählen |

→ Weiter

### 2 · Anzeigengruppe

| Feld | Eintrag |
|---|---|
| Name der Anzeigengruppe | `[Ort des Betriebs] 40 km` |
| Conversion-Ort | **Website** |
| Performance-Ziel | **Anzahl der Leads maximieren** (nicht „Wert der Conversions“) |
| Datensatz | **Muster Solartechnik** |
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
| Standorte | „Deutschland“ mit dem **x** entfernen → `[Ort des Betriebs]` eintippen und den richtigen Ort wählen → Umkreis **40 km** → wenn angeboten: „Personen, die hier leben“ |
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
| Tracking | Website-Events: **Muster Solartechnik** angehakt. Gibt es das Feld „URL-Parameter“: Parameter von unten eintragen |

**Weitere Anzeigen:** in der linken Spalte bei der Anzeige „…“ → **Duplizieren** → Name, Bild, Texte,
Quell-URL und Parameter austauschen.

**Ende: NICHT „Veröffentlichen“.** Oben links schließen. In der Liste steht „Entwurf“.

Zieladressen und Parameter:

| Anzeige | Quell-URL | URL-Parameter |
|---|---|---|
| W1, W2, W3, W5 | `https://muster-solartechnik.netlify.app/wirtschaftlichkeit.html` | `utm_source=meta&utm_campaign=pv-w1` (w2, w3, w5) |
| W4 | `https://muster-solartechnik.netlify.app/rechner.html` | `utm_source=meta&utm_campaign=pv-w4` |
| Modul, Rabatt, Speicher | `https://muster-solartechnik.netlify.app/modul.html`, `/rabatt.html`, `/speicher.html` | `utm_source=meta&utm_campaign=pv-modul` (rabatt, speicher) |

### Dauerkampagne: Wirtschaftlichkeitsprüfung (das ganze Jahr)

Jede Anzeige zeigt eine gekennzeichnete Beispielrechnung und die Schritte „eintragen → wir rechnen
→ Ergebnis“. Die Prüfung gibt es erst nach der Eintragung. Button bei allen: **Registrieren**.

**W1 — Vorher/Nachher** · Bild `w1-vorher-nachher.png` · Ziel `wirtschaftlichkeit.html`
- Primärtext: Rund 1.665 € zahlt ein Haushalt mit 4.500 kWh im Jahr für Strom. Mit eigener Solaranlage und Speicher könnten es rund 500 € sein. Wie es bei Ihnen aussieht, rechnen wir nach Ihrer Eintragung kostenlos nach.
  👉 Jetzt eintragen.
- Headline: Ihre kostenlose Wirtschaftlichkeitsprüfung
- Beschreibung: Erst eintragen, dann rechnen wir für Ihr Haus.

**W2 — Abschlag** · Bild `w2-abschlag.png` · Ziel `wirtschaftlichkeit.html`
- Primärtext: Schauen Sie mal auf Ihren Abschlag. Liegt er bei 139 € oder mehr? Mit Solar und Speicher könnte er bei rund 42 € liegen. Tragen Sie sich ein, dann rechnen wir es mit Ihren echten Zahlen nach.
  👉 Jetzt eintragen.
- Headline: Ihr Abschlag, nachgerechnet
- Beschreibung: Kostenlos, nach Eintragung.

**W3 — Prüfung** · Bild `w3-pruefung.png` · Ziel `wirtschaftlichkeit.html`
- Primärtext: Rechnet sich Solar bei Ihnen? Tragen Sie sich ein und schicken Sie uns ein Foto Ihrer Stromrechnung. Wir rechnen Ersparnis und Amortisation für Ihr Haus und melden uns innerhalb von 2 Werktagen.
  👉 Jetzt eintragen.
- Headline: Rechnet sich Solar bei Ihnen?
- Beschreibung: Kostenlose Wirtschaftlichkeitsprüfung.

**W4 — Rechner** · Bild `w4-rechner.png` · Ziel `rechner.html`
- Primärtext: Wie viel Strom könnten Sie selbst erzeugen? 3 Fragen, sofort eine erste Schätzung. Die genaue Wirtschaftlichkeitsprüfung für Ihr Haus gibt es kostenlos nach Ihrer Eintragung.
  👉 Jetzt ausrechnen.
- Headline: 60-Sekunden-Solarrechner
- Beschreibung: Erste Schätzung sofort.

**W5 — 20 Jahre** · Bild `w5-20-jahre.png` · Ziel `wirtschaftlichkeit.html`
- Primärtext: 4.500 kWh im Jahr, heutiger Preis, 20 Jahre: Das sind rund 33.000 € für Strom, ohne einen Cent Preissteigerung. Wie viel davon Sie selbst erzeugen könnten, rechnen wir nach Ihrer Eintragung kostenlos aus.
  👉 Jetzt eintragen.
- Headline: 33.000 € für Strom?
- Beschreibung: Kostenlose Wirtschaftlichkeitsprüfung.


### Saisonaktion: Verlosung (2–3 × im Jahr, nur wenn aktiv)

Läuft parallel zur Dauerkampagne. Vorschlag: Budget in dieser Zeit etwa hälftig aufteilen.

**Anzeige 1 — Gewinnspiel Modul** · Bild `1-gewinnspiel.png` · Ziel `modul.html` · Button **Registrieren**
- Primärtext: ☀️ Gewinnspiel für Hausbesitzer in Ihrer Region: Unter allen Anfragen bis 15. Januar verlosen wir ein kostenloses Modul. Mitmachen dauert 30 Sekunden.
  👉 Jetzt teilnehmen.
- Headline: Gewinnen Sie ein Solarmodul
- Beschreibung: Teilnahme bis 15. Januar.

**Anzeige 2 — Verlosung 20 % Rabatt** · Bild `2-rabatt.png` · Ziel `rabatt.html` · Button **Registrieren**
- Primärtext: Verlosung bis 15. Januar: Unter allen Anfragen verlosen wir 3 × 20 % Rabatt auf die erste Bestellung Ihrer Solaranlage. Muster Solartechnik plant und montiert mit eigenem Team.
  👉 Jetzt teilnehmen.
- Headline: 20 % Rabatt gewinnen
- Beschreibung: 3 Gewinner, Verlosung bis 15. Januar.

**Anzeige 3 — Verlosung Stromspeicher** · Bild `3-speicher.png` · Ziel `speicher.html` · Button **Registrieren**
- Primärtext: Wir verlosen 3 Stromspeicher! Unter allen Anfragen bis 15. Januar ziehen wir 3 Gewinner, die den Speicher gratis zu ihrer ersten Bestellung bekommen. Mitmachen dauert 30 Sekunden.
  👉 Jetzt teilnehmen.
- Headline: 3 Stromspeicher zu gewinnen
- Beschreibung: Gratis zur ersten Bestellung.

Eigene Kampagne `PV – Verlosung – Muster Solartechnik`, gleiche Einstellungen wie oben, Zieladressen siehe Tabelle.

Vor dem Livegang (Schritt 7):
- [ ] In der Vorschau rechts: Sieht jede Anzeige aus wie das Original-Bild? (sonst „Optimierungen“ prüfen)
- [ ] Test-Anfrage über jede Seite, im Events Manager unter „Events testen“ erscheinen „PageView“ und „Lead“

## Google Ads (Suche)

| Einstellung | Wert |
|---|---|
| Kampagne | `Suche – PV [Ort des Betriebs]`, nur Suchnetzwerk |
| Tagesbudget | 30 € |
| Gebot | Start: Klicks maximieren, Höchst-CPC 3 €. Ab ca. 30 Conversions: Conversions maximieren |
| Standort | [Ort des Betriebs] + 40 km, „Präsenz: Personen an diesem Ort oder regelmäßig dort“ |
| Conversion | die Conversion-Aktion aus „Vorher: Messung einrichten“, Punkt 2 |
| Ziel | `wirtschaftlichkeit.html`, URL-Parameter `utm_source=google&utm_campaign=pv-suche` |

Keywords (Wortgruppe): `"photovoltaik [ort]"` · `"solaranlage [ort]"` · `"pv anlage [ort]"` · `"photovoltaik mit speicher"` · `"solarteur"` · `"pv anlage kosten"` · `"stromspeicher nachrüsten"`

Ausschließen: `balkonkraftwerk` · `steckersolar` · `gebraucht` · `selber bauen` · `diy` · `job` · `ausbildung` · `stellenangebot` · `gehalt` · `reinigung` · `mieter`

Überschriften (höchstens 30 Zeichen, mit dem Ortsnamen Länge prüfen):
1. Solaranlage in [Ort des Betriebs] · 2. Photovoltaik in [Ort des Betriebs] · 3. Rechnet sich Solar für Sie? (an Position 1 anheften) · 4. Festpreis-Angebot vorab · 5. PV-Anlage mit Speicher · 6. Betrieb aus [Ort des Betriebs] · 7. 0 % MwSt bis 30 kWp · 8. Eigene Montageteams · 9. Kein Vermittler, kein Portal · 10. Jetzt Termin anfragen · 11. Muster Solartechnik · 12. Stromspeicher nachrüsten · 13. Prüfung nach Eintragung · 14. Rückruf am selben Tag · 15. Unverbindlich & kostenlos

Beschreibungen (höchstens 90 Zeichen):
1. Wir rechnen Ertrag und Speicher für Ihren Verbrauch, kostenlos nach Ihrer Eintragung.
2. Festpreis-Angebot, bevor Sie sich entscheiden. Ein Betrieb aus der Region.
3. Für Anlagen bis 30 kWp auf Wohnhäusern fallen 0 % Mehrwertsteuer an.
4. Eigene Montageteams aus [Ort des Betriebs]. Jetzt eintragen, Prüfung kostenlos.

## Nach dem Start

3–4 Tage nichts ändern · erst ab 20–50 Anfragen bewerten, dann nur eine Sache ändern.
Anfragen, Rückrufzeit und Stand sammelt die Zentrale von selbst. Du schaust montags in die Übersichtsmail.
