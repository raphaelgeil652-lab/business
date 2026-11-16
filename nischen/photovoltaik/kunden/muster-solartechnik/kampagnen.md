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
| Name | `PV mit Speicher – Kostenlose Dach-Analyse – Muster Solartechnik` |
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
Die Landingpage muss zum Anker passen: Wer auf „Speicher geschenkt“ klickt, liest oben genau das.

**1 — Gewinnspiel Solarmodul** · Bild: `1-gewinnspiel.png` · Button: Registrieren
- Primärtext: ☀️ Gewinnspiel für Hausbesitzer in Ihrer Region: Unter allen Anfragen bis 15. Januar verlosen wir ein Solarmodul für Ihr Dach. Dazu bekommen Sie eine kostenlose Dach-Analyse, ganz unverbindlich.
  👉 Jetzt teilnehmen.
- Headline: Gewinnen Sie ein Solarmodul
- Beschreibung: Teilnahme bis 15. Januar.
- Pflicht: Teilnahmebedingungen auf der Landingpage, Hinweis, dass Meta nicht beteiligt ist.

**2 — 20 % Rabatt** · Bild: `2-rabatt.png` · Button: Angebot erhalten
- Primärtext: Nur bis 15. Januar: 20 % auf Ihre Solaranlage. Muster Solartechnik prüft Ihr Dach kostenlos, plant die Anlage für Ihren Verbrauch und montiert mit eigenem Team.
  👉 Jetzt Rabatt sichern.
- Headline: 20 % auf Ihre Solaranlage
- Beschreibung: Aktion bis 15. Januar.
- Pflicht: Rabatt nur auf einen echten Angebotspreis, nie auf einen vorher erhöhten.

**3 — Speicher geschenkt** · Bild: `3-speicher.png` · Button: Angebot erhalten
- Primärtext: Stromspeicher geschenkt: Zu jeder neuen Solaranlage von Muster Solartechnik gibt es den Speicher gratis dazu. Gilt bis 15. Januar. Die Dach-Analyse vor Ort ist kostenlos.
  👉 Jetzt Angebot sichern.
- Headline: Stromspeicher geschenkt
- Beschreibung: Zu jeder neuen Solaranlage.
- Pflicht: Speichergröße vorher mit dem Betrieb festlegen und auf der Landingpage nennen.

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
3. Kostenlose Dach-Analyse
4. Festpreis-Angebot vorab
5. PV-Anlage mit Speicher
6. Betrieb aus [Ort]
7. 0 % MwSt bis 30 kWp
8. Eigene Montageteams
9. Kein Vermittler, kein Portal
10. Jetzt Termin anfragen
11. Muster Solartechnik
12. Stromspeicher nachrüsten
13. Solar-Check für Ihr Dach
14. Rückruf am selben Tag
15. Unverbindlich & kostenlos

Beschreibungen (höchstens 90 Zeichen; mit dem echten Ort neu prüfen):

1. Wir prüfen Ihr Dach vor Ort und rechnen Ertrag und Speicher für Ihren Verbrauch.
2. Festpreis-Angebot, bevor Sie sich entscheiden. Ein Betrieb aus der Region.
3. Für Anlagen bis 30 kWp auf Wohnhäusern fallen 0 % Mehrwertsteuer an.
4. Eigene Montageteams aus [Ort]. Jetzt kostenlose Dach-Analyse anfragen.

Überschrift 3 an Position 1 anheften, damit der Gratis-Anker immer sichtbar ist.

---

## Nach dem Start

- 3–4 Tage nichts ändern (Lernphase bei Meta).
- Täglich: Kommen Anfragen an? Ruft das Büro innerhalb 1 Stunde zurück?
- Erst ab 20–50 Anfragen bewerten. Dann nur eine Sache ändern.
- Welche Anzeige die **Termine** bringt, nicht nur die Anfragen, zeigt erst die Rückmeldung
  des Kunden pro Anfrage. Die deshalb jede Woche einsammeln.
