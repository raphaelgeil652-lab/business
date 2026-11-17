# Kampagnen — {{betrieb}}

> Alles fertig zum Eintragen. Anzeigen-Bilder: `../anzeigen/creatives/`.
> Ziel-Adressen: `{{landingpage_url}}/wirtschaftlichkeit.html`, `…/rechner.html`; bei Verlosung `…/modul.html`, `…/rabatt.html`, `…/speicher.html`.

Budget: Meta {{budget_meta}} pro Monat (≈ {{budget_meta_tag}} pro Tag) · Google {{budget_google}} pro Monat (≈ {{budget_google_tag}} pro Tag).

## Meta (Facebook/Instagram)

| Einstellung | Wert |
|---|---|
| Kampagne | `PV – Wirtschaftlichkeit – {{betrieb}}` (Dauer) und bei Verlosung `PV – Verlosung – {{betrieb}}`, Ziel **Leads**, Advantage Campaign Budget aus |
| Anzeigengruppe | `{{ort}} {{einzugsgebiet_km}} km`, Conversion-Ort Website, Pixel-Ereignis „Lead“ |
| Tagesbudget | {{budget_meta_tag}} |
| Ort | {{ort}} + {{einzugsgebiet_km}} km, „Personen, die an diesem Ort leben“ |
| Alter / Geschlecht | 35–65+ / alle |
| Detailliertes Targeting | leer |
| Platzierungen | Advantage+ (automatisch) |
| Sonderkategorie | keine (keine Finanzierung bewerben) |

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

URL-Parameter: `utm_source=meta&utm_campaign=pv-modul` (bzw. `pv-rabatt`, `pv-speicher`)
<!--/VERLOSUNG-->

URL-Parameter Dauerkampagne: `utm_source=meta&utm_campaign=pv-w1` … `pv-w5`

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
| Ziel | `wirtschaftlichkeit.html`, URL-Parameter `utm_source=google&utm_campaign=pv-suche` |

Keywords (Wortgruppe): `"photovoltaik {{ort_klein}}"` · `"solaranlage {{ort_klein}}"` · `"pv anlage {{ort_klein}}"` · `"photovoltaik mit speicher"` · `"solarteur"` · `"pv anlage kosten"` · `"stromspeicher nachrüsten"`

Ausschließen: `balkonkraftwerk` · `steckersolar` · `gebraucht` · `selber bauen` · `diy` · `job` · `ausbildung` · `stellenangebot` · `gehalt` · `reinigung` · `mieter`

Überschriften (höchstens 30 Zeichen, mit dem Ortsnamen Länge prüfen):
1. Solaranlage in {{ort}} · 2. Photovoltaik in {{ort}} · 3. Rechnet sich Solar für Sie? (an Position 1 anheften) · 4. Festpreis-Angebot vorab · 5. PV-Anlage mit Speicher · 6. Betrieb aus {{ort}} · 7. 0 % MwSt bis 30 kWp · 8. {{team_headline}} · 9. Kein Vermittler, kein Portal · 10. Jetzt Termin anfragen · 11. {{betrieb}} · 12. Stromspeicher nachrüsten · 13. Prüfung nach Eintragung · 14. Rückruf am selben Tag · 15. Unverbindlich & kostenlos

Beschreibungen (höchstens 90 Zeichen):
1. Wir rechnen Ertrag und Speicher für Ihren Verbrauch, kostenlos nach Ihrer Eintragung.
2. Festpreis-Angebot, bevor Sie sich entscheiden. Ein Betrieb aus der Region.
3. Für Anlagen bis 30 kWp auf Wohnhäusern fallen 0 % Mehrwertsteuer an.
4. {{team_beschr}}. Jetzt eintragen, Prüfung kostenlos.

## Nach dem Start

3–4 Tage nichts ändern · täglich Anfragen und Rückrufzeit prüfen · erst ab 20–50 Anfragen
bewerten, dann nur eine Sache ändern · Rückmeldungen pro Anfrage jede Woche in
`tabellen/anfragen-und-report.xlsx` eintragen.
