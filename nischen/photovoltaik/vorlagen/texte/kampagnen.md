# Kampagnen — {{betrieb}}

> Alles fertig zum Eintragen. Anzeigen-Bilder: `../anzeigen/creatives/`.
> Ziel-Adressen: `{{landingpage_url}}/modul.html`, `…/rabatt.html`, `…/speicher.html`.

Budget: Meta {{budget_meta}} pro Monat (≈ {{budget_meta_tag}} pro Tag) · Google {{budget_google}} pro Monat (≈ {{budget_google_tag}} pro Tag).

## Meta (Facebook/Instagram)

| Einstellung | Wert |
|---|---|
| Kampagne | `PV – Verlosungen – {{betrieb}}`, Ziel **Leads**, Advantage Campaign Budget aus |
| Anzeigengruppe | `{{ort}} {{einzugsgebiet_km}} km`, Conversion-Ort Website, Pixel-Ereignis „Lead“ |
| Tagesbudget | {{budget_meta_tag}} |
| Ort | {{ort}} + {{einzugsgebiet_km}} km, „Personen, die an diesem Ort leben“ |
| Alter / Geschlecht | 35–65+ / alle |
| Detailliertes Targeting | leer |
| Platzierungen | Advantage+ (automatisch) |
| Sonderkategorie | keine (keine Finanzierung bewerben) |

**Anzeige 1 — Gewinnspiel Modul** · Bild `1-gewinnspiel.png` · Ziel `modul.html` · Button **Registrieren**
- Primärtext: ☀️ Gewinnspiel für Hausbesitzer in Ihrer Region: Unter allen Anfragen bis {{aktion_ende_kurz}} verlosen wir ein kostenloses Modul. Mitmachen dauert 30 Sekunden.
  👉 Jetzt teilnehmen.
- Headline: Gewinnen Sie ein Solarmodul
- Beschreibung: Teilnahme bis {{aktion_ende_kurz}}.

**Anzeige 2 — Verlosung 20 % Rabatt** · Bild `2-rabatt.png` · Ziel `rabatt.html` · Button **Registrieren**
- Primärtext: Verlosung bis {{aktion_ende_kurz}}: Unter allen Anfragen verlosen wir 3 × 20 % Rabatt auf die erste Bestellung Ihrer Solaranlage. {{betrieb}} plant und montiert mit eigenem Team.
  👉 Jetzt teilnehmen.
- Headline: 20 % Rabatt gewinnen
- Beschreibung: 3 Gewinner, Verlosung bis {{aktion_ende_kurz}}.

**Anzeige 3 — Verlosung Stromspeicher** · Bild `3-speicher.png` · Ziel `speicher.html` · Button **Registrieren**
- Primärtext: Wir verlosen 3 Stromspeicher! Unter allen Anfragen bis {{aktion_ende_kurz}} ziehen wir 3 Gewinner, die den Speicher gratis zu ihrer ersten Bestellung bekommen. Mitmachen dauert 30 Sekunden.
  👉 Jetzt teilnehmen.
- Headline: 3 Stromspeicher zu gewinnen
- Beschreibung: Gratis zur ersten Bestellung.

URL-Parameter: `utm_source=meta&utm_campaign=pv-modul` (bzw. `pv-rabatt`, `pv-speicher`)

Vor dem Veröffentlichen:
- [ ] Advantage+ Creative-Verbesserungen aus · Multi-Advertiser aus
- [ ] Vorschau am Handy geprüft · Test-Anfrage über jede Anzeige

## Google Ads (Suche)

| Einstellung | Wert |
|---|---|
| Kampagne | `Suche – PV {{ort}}`, nur Suchnetzwerk |
| Tagesbudget | {{budget_google_tag}} |
| Gebot | Start: Klicks maximieren, Höchst-CPC 3 €. Ab ca. 30 Conversions: Conversions maximieren |
| Standort | {{ort}} + {{einzugsgebiet_km}} km, „Präsenz: Personen an diesem Ort oder regelmäßig dort“ |
| Conversion | Aufruf der Danke-Seite |
| Ziel | `speicher.html`, URL-Parameter `utm_source=google&utm_campaign=pv-suche` |

Keywords (Wortgruppe): `"photovoltaik {{ort_klein}}"` · `"solaranlage {{ort_klein}}"` · `"pv anlage {{ort_klein}}"` · `"photovoltaik mit speicher"` · `"solarteur"` · `"pv anlage kosten"` · `"stromspeicher nachrüsten"`

Ausschließen: `balkonkraftwerk` · `steckersolar` · `gebraucht` · `selber bauen` · `diy` · `job` · `ausbildung` · `stellenangebot` · `gehalt` · `reinigung` · `mieter`

Überschriften (höchstens 30 Zeichen, mit dem Ortsnamen Länge prüfen):
1. Solaranlage in {{ort}} · 2. Photovoltaik in {{ort}} · 3. 3 Stromspeicher zu gewinnen (an Position 1 anheften) · 4. Festpreis-Angebot vorab · 5. PV-Anlage mit Speicher · 6. Betrieb aus {{ort}} · 7. 0 % MwSt bis 30 kWp · 8. Eigene Montageteams · 9. Kein Vermittler, kein Portal · 10. Jetzt Termin anfragen · 11. {{betrieb}} · 12. Stromspeicher nachrüsten · 13. 20 % Rabatt gewinnen · 14. Rückruf am selben Tag · 15. Unverbindlich & kostenlos

Beschreibungen (höchstens 90 Zeichen):
1. Wir prüfen Ihr Dach vor Ort und rechnen Ertrag und Speicher für Ihren Verbrauch.
2. Festpreis-Angebot, bevor Sie sich entscheiden. Ein Betrieb aus der Region.
3. Für Anlagen bis 30 kWp auf Wohnhäusern fallen 0 % Mehrwertsteuer an.
4. Eigene Montageteams aus {{ort}}. Jetzt an der Verlosung teilnehmen.

## Nach dem Start

3–4 Tage nichts ändern · täglich Anfragen und Rückrufzeit prüfen · erst ab 20–50 Anfragen
bewerten, dann nur eine Sache ändern · Rückmeldungen pro Anfrage jede Woche in
`tabellen/anfragen-und-report.xlsx` eintragen.
