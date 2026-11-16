# Kampagnen — Muster Solartechnik

> ⚠️ **FIKTIVER PROBEKUNDE.** Alles ist fertig zum Eintragen. Live gehen kann es erst, wenn
> die Zugänge da sind und das Bildmaterial vom Kunden vorliegt (siehe [`onboarding.md`](onboarding.md)).

Budget: **1.000 €/Monat** → Meta 700 € (≈ 23 €/Tag), Google 300 € (≈ 10 €/Tag).
Ziel der Seite: `[Landingpage-URL]` (nach dem Hosten eintragen).

---

## Meta (Facebook/Instagram)

### Kampagne

| Einstellung | Wert |
|---|---|
| Name | `PV – Verlosungen – Muster Solartechnik` |
| Ziel | Leads |
| Advantage Campaign Budget | aus |
| Sonderkategorie | keine (solange keine Finanzierung beworben wird) |

### Anzeigengruppe

| Einstellung | Wert |
|---|---|
| Name | `[Ort] [Radius] km – 35-65+` |
| Conversion-Ort | Website |
| Pixel / Ereignis | Pixel des Kunden, „Lead“ (feuert auf der Danke-Seite). Misst der Pixel noch nicht: „Landing Page Views“ |
| Tagesbudget | 23 € |
| Ort | [Ort des Betriebs] + sein Einzugsgebiet, „Personen, die an diesem Ort leben“ |
| Alter | 35–65+ |
| Geschlecht | alle |
| Detailliertes Targeting | leer |
| Platzierungen | Advantage+ (automatisch) |

### Anzeigen (3 Stück in der Gruppe, je ein Gratis-Anker)

Bilder: [`anzeigen/creatives/`](anzeigen/creatives/) · So sieht es aus: [`anzeigen/vorschau.html`](anzeigen/vorschau.html).
Name, Ort und Aktionsdatum stehen unten in [`anzeigen/anzeigen.html`](anzeigen/anzeigen.html) (`KUNDE`).
Jede Anzeige zeigt auf ihre eigene Landingpage (`modul.html`, `rabatt.html`, `speicher.html`), oben steht dort wortgleich dasselbe Angebot.

**1 — Gewinnspiel Solarmodul** · Bild: `1-gewinnspiel.png` · Ziel: `…/modul.html` · Button: Registrieren
- Primärtext: ☀️ Gewinnspiel für Hausbesitzer in Ihrer Region: Unter allen Anfragen bis 15. Januar verlosen wir ein kostenloses Modul. Mitmachen dauert 30 Sekunden.
  👉 Jetzt teilnehmen.
- Headline: Gewinnen Sie ein Solarmodul
- Beschreibung: Teilnahme bis 15. Januar.

**2 — Verlosung 20 % Rabatt** · Bild: `2-rabatt.png` · Ziel: `…/rabatt.html` · Button: Registrieren
- Primärtext: Verlosung bis 15. Januar: Unter allen Anfragen verlosen wir 3 × 20 % Rabatt auf die erste Bestellung Ihrer Solaranlage. Muster Solartechnik plant und montiert mit eigenem Team.
  👉 Jetzt teilnehmen.
- Headline: 20 % Rabatt gewinnen
- Beschreibung: 3 Gewinner, Verlosung bis 15. Januar.

**3 — Verlosung Stromspeicher** · Bild: `3-speicher.png` · Ziel: `…/speicher.html` · Button: Registrieren
- Primärtext: Wir verlosen 3 Stromspeicher! Unter allen Anfragen bis 15. Januar ziehen wir 3 Gewinner, die den Speicher gratis zu ihrer ersten Bestellung bekommen. Mitmachen dauert 30 Sekunden.
  👉 Jetzt teilnehmen.
- Headline: 3 Stromspeicher zu gewinnen
- Beschreibung: Gratis zur ersten Bestellung.

**Pflicht für alle drei Verlosungen:** Teilnahmebedingungen auf der Landingpage (Zeitraum, wer
teilnehmen darf, wie und wann gezogen wird, wie Gewinner benachrichtigt werden) und der Hinweis,
dass Meta nicht beteiligt ist. Bei Rabatt und Speicher muss **klar dastehen, dass der Gewinn nur
mit einer Bestellung eingelöst wird** — das ist erlaubt, aber nur, wenn es vor der Teilnahme
deutlich gesagt wird. Rabatt nur auf einen echten Angebotspreis; Speichergröße festlegen.

Alle drei Angebote (Kosten, Datum, Bedingungen) muss der Kunde schriftlich freigeben (§7 der Vereinbarung).

### Skript für ein Inhaber-Video (später als zusätzliche Anzeige)

Handy hochkant, vor einer fertigen Anlage oder im Lager, 20 Sekunden:

> „Ich bin Markus Muster von Muster Solartechnik hier in [Ort]. Wir planen und montieren
> Solaranlagen mit unseren eigenen Teams, kein Vermittler, kein Callcenter. Wenn Sie wissen
> wollen, was auf Ihrem Dach geht: Wir kommen vorbei, schauen uns das kostenlos an, und Sie
> bekommen einen Festpreis. Link ist unten.“

### Hygiene vor dem Veröffentlichen

- [ ] Advantage+ Creative-Verbesserungen aus (auf Anzeigenebene)
- [ ] Multi-Advertiser-Anzeigen aus
- [ ] URL-Parameter: `utm_source=meta&utm_campaign=pv-[gewinnspiel|rabatt|speicher]`
- [ ] Vorschau am Handy geprüft
- [ ] Nach Freigabe eine Test-Anfrage über die Anzeige geschickt

---

## Google Ads (Suche)

### Kampagne

| Einstellung | Wert |
|---|---|
| Name | `Suche – PV [Ort]` |
| Typ | Suche (nur Suchnetzwerk, Display aus) |
| Tagesbudget | 10 € |
| Gebotsstrategie | Start: Klicks maximieren mit Höchst-CPC 3 €. Nach ca. 30 Conversions: Conversions maximieren |
| Standort | [Ort des Betriebs] + Einzugsgebiet, Option „Präsenz: Personen an diesem Ort oder regelmäßig dort“ |
| Sprache | Deutsch |
| Conversion | Formular abgeschickt = Aufruf der Danke-Seite |
| URL-Parameter | `utm_source=google&utm_campaign=pv-suche` |

Der Höchst-CPC ist ein Startwert, keine Erfahrungszahl. Nach der ersten Woche an die echten
Klickpreise anpassen.

### Keywords (Anzeigengruppe „PV [Ort]“)

Wortgruppe: `"photovoltaik [ort]"` · `"solaranlage [ort]"` · `"pv anlage [ort]"` ·
`"photovoltaik mit speicher"` · `"solarteur"` · `"pv anlage kosten"` · `"stromspeicher nachrüsten"`

Genau passend: `[photovoltaik [ort]]` · `[solaranlage [ort]]` · `[pv anlage [ort]]`

Die Wortgruppen ohne Ortsnamen greifen nur im Standort-Radius, weil die Kampagne auf
das Einzugsgebiet des Betriebs begrenzt ist.

### Ausschließende Keywords

`balkonkraftwerk` · `steckersolar` · `gebraucht` · `selber bauen` · `diy` · `job` ·
`ausbildung` · `stellenangebot` · `gehalt` · `reinigung` · `mieter`

### Responsive Suchanzeige

Überschriften (höchstens 30 Zeichen; mit dem echten Ort des Kunden die Länge neu prüfen):

1. Solaranlage in [Ort]
2. Photovoltaik in [Ort]
3. 3 Stromspeicher zu gewinnen
4. Festpreis-Angebot vorab
5. PV-Anlage mit Speicher
6. Betrieb aus [Ort]
7. 0 % MwSt bis 30 kWp
8. Eigene Montageteams
9. Kein Vermittler, kein Portal
10. Jetzt Termin anfragen
11. Muster Solartechnik
12. Stromspeicher nachrüsten
13. 20 % Rabatt gewinnen
14. Rückruf am selben Tag
15. Unverbindlich & kostenlos

Beschreibungen (höchstens 90 Zeichen; mit dem echten Ort neu prüfen):

1. Wir prüfen Ihr Dach vor Ort und rechnen Ertrag und Speicher für Ihren Verbrauch.
2. Festpreis-Angebot, bevor Sie sich entscheiden. Ein Betrieb aus der Region.
3. Für Anlagen bis 30 kWp auf Wohnhäusern fallen 0 % Mehrwertsteuer an.
4. Eigene Montageteams aus [Ort]. Jetzt an der Verlosung teilnehmen.

Überschrift 3 an Position 1 anheften, damit die Verlosung immer sichtbar ist. Ziel der Google-Anzeige: `speicher.html`.

---

## Nach dem Start

- 3–4 Tage nichts ändern (Lernphase bei Meta).
- Täglich: Kommen Anfragen an? Ruft das Büro innerhalb 1 Stunde zurück?
- Erst ab 20–50 Anfragen bewerten. Dann nur eine Sache ändern.
- Welche Anzeige die **Termine** bringt, nicht nur die Anfragen, zeigt erst die Rückmeldung
  des Kunden pro Anfrage. Die deshalb jede Woche einsammeln.
