# Modul: PV-Anlage mit Speicher

Leistungs-Modul nach dem Betriebshandbuch („Baukasten: Skelett und Modul“). Gilt für jeden
PV-Betrieb. Pro Kunde werden nur die Platzhalter in eckigen Klammern gefüllt.

Stand der Marktzahlen: November 2026. Quellen unten, Einschätzung dazu jeweils dabei.

---

## Kurzprofil

| | |
|---|---|
| Für | Solarteure und Elektrobetriebe, die PV auf Ein- und Zweifamilienhäusern selbst montieren |
| Ticket | 13.000–25.000 € für ca. 10 kWp mit Speicher, ohne Speicher ca. 10.000–16.000 € |
| Warum stark | sehr hoher Auftragswert; Leute vergleichen ohnehin, wollen aber einen Betrieb aus der Nähe |
| Entscheidung | Wochen bis wenige Monate, meist mehrere Angebote im Vergleich |
| Saison | ganzjährig. Ob der Winter schwächer läuft, zeigen erst eigene Zahlen. |
| Budget-Richtwert | ca. 1.000 €/Monat, davon ca. 70 % Meta, 30 % Google |
| Zielradius | das Einzugsgebiet des Betriebs, im Gespräch fragen („Bis wie weit fahren Sie zur Montage?“). Bei PV oft größer als die 25 km aus dem Handbuch; Start mit seiner Angabe, nach 20–50 Anfragen prüfen |
| Kosten pro Anfrage | grob 30–90 € (Branchenquellen, kaum deutsche Daten). Nach 20–50 Anfragen mit eigenen Zahlen ersetzen. |

**Kundenfilter:** Kriterium 1 (Auftragswert) ist hier nie das Problem. Die Engpässe sind
Kapazität (Montagevorlauf!) und Rückrufgeschwindigkeit, weil Interessenten parallel bei
Portalen und Konkurrenz anfragen.

## Anzeigen-Standard (gilt für alle PV-Kunden)

Festgelegt im November 2026, nachdem drei aufwendigere Richtungen verworfen wurden.
Vorlage: `vorlagen/anzeigen/anzeigen.html`, Recherche dazu: `vorlagen/anzeigen/recherche.md`.

- **Das Solardach ist das Bild.** Oben ca. 45 % der Fläche ein echtes Foto von Modulen auf
  einem Wohnhaus. Man muss in einer Sekunde sehen, dass es um Solar geht.
- Darunter auf ruhiger, flacher Fläche: kleiner Kicker (z. B. „Aktion bis …“), **das Angebot groß**
  mit dem Schlüsselwort in Farbe, ein erklärender Satz, eine Faktenzeile (Betrieb · Ort · Vorteil),
  Aufforderung als Zeile mit Pfeil, Kleingedrucktes.
- Eine Schrift (Inter Tight), keine Verläufe, kein Glow, keine Icons, keine Deko-Kästen.
- Pro Anzeige eine Flächenfarbe: hell/rostrot, dunkel/gelb, hell/grün.
- Format 1080 × 1350 (4:5), Text nicht an den unteren Rand.

## Der Einstieg: drei Verlosungen

Die drei Verlosungen sind der einzige Einstieg, ein anderes Gratis-Angebot wird nicht beworben
(Entscheidung des Nutzers, November 2026). Nach der Anfrage ruft der Betrieb an und erstellt auf
Wunsch ein Festpreis-Angebot.

| Verlosung | Headline | Mechanik | Was der Betrieb vorher festlegen muss |
|---|---|---|---|
| Gewinnspiel Modul | „Gewinnen Sie ein Solarmodul.“ | Unter allen Anfragen wird **ein kostenloses Modul** verlost | Teilnahmebedingungen, Zeitraum, Ziehung |
| Verlosung 20 % | „20 % Rabatt gewinnen.“ | **3 Gewinner** bekommen 20 % auf ihre **erste Bestellung** | Rabatt auf echten Angebotspreis, Enddatum |
| Verlosung Speicher | „3 Stromspeicher zu gewinnen.“ | **3 Gewinner** bekommen den Speicher gratis zur **ersten Bestellung** | Speichergröße, Enddatum |

Alle drei sind Verlosungen, keine Rabatte für alle. Pflicht: Teilnahmebedingungen auf der
Landingpage, Hinweis „Meta ist nicht beteiligt“, und bei Rabatt/Speicher vor der Teilnahme klar
sagen, dass der Gewinn nur mit einer Bestellung eingelöst wird.

## Der Vorteil gegenüber Portalen (in jedem Gespräch nutzen)

Lead-Portale verkaufen dieselbe Anfrage oft an mehrere Betriebe. Unsere Anfragen kommen von
der eigenen Seite des Betriebs und gehen nur an ihn. Er ruft als Einziger an.

## Anzeigentexte (Meta)

Bilder aus der Anzeigen-Vorlage, ausgefüllte Texte pro Kunde in `kunden/<kunde>/kampagnen.md`.
Button bei allen: **Registrieren**. Jede Anzeige zeigt auf ihre eigene Landingpage.

- **Modul:** ☀️ Gewinnspiel für Hausbesitzer in Ihrer Region: Unter allen Anfragen bis [Datum] verlosen wir ein kostenloses Modul. Mitmachen dauert 30 Sekunden. 👉 Jetzt teilnehmen.
- **20 %:** Verlosung bis [Datum]: Unter allen Anfragen verlosen wir 3 × 20 % Rabatt auf die erste Bestellung Ihrer Solaranlage. [Betrieb] plant und montiert mit eigenem Team. 👉 Jetzt teilnehmen.
- **Speicher:** Wir verlosen 3 Stromspeicher! Unter allen Anfragen bis [Datum] ziehen wir 3 Gewinner, die den Speicher gratis zu ihrer ersten Bestellung bekommen. 👉 Jetzt teilnehmen.

## Google (Suche)

Keyword-Muster (Wortgruppe und genau passend): `photovoltaik [ort]` · `solaranlage [ort]` ·
`pv anlage [ort]` · `photovoltaik mit speicher [ort]` · `solarteur [ort]` · `pv anlage kosten` ·
`stromspeicher nachrüsten [ort]`

Ausschließende Keywords: `balkonkraftwerk` · `steckersolar` · `gebraucht` · `selber bauen` ·
`diy` · `job` · `ausbildung` · `stellenangebot` · `gehalt` · `reinigung` · `mieter`

## Landingpages

Je Verlosung eine Seite im Anzeigen-Stil (`modul.html`, `rabatt.html`, `speicher.html`), erzeugt
von `vorlagen/werkzeuge/kunde-anlegen.py` aus dem Steckbrief. Oben steht wortgleich das
Angebot der Anzeige.

| Feld | Pflicht | Warum |
|---|---|---|
| Name | ja | |
| Telefon | ja | Rückruf |
| Postleitzahl | ja | Einzugsgebiet prüfen |
| Eigentümer? (Einfamilienhaus / Zwei- oder Mehrfamilienhaus / Nein, Mieter) | ja | der wichtigste Filter |
| E-Mail | nein | |
| Häkchen Teilnahmebedingungen | ja | Voraussetzung für die Verlosung |

Stromverbrauch, Dachart und Ausrichtung klärt der Betrieb beim Rückruf.

- **Vorher/Nachher heißt hier:** leeres Dach → fertige Anlage, dasselbe Haus aus derselben Perspektive. Drohnenfotos sind ideal.
- Keine Zahlen zur Einspeisevergütung: Sie ändern sich halbjährlich, und für 2027 ist eine Reform im Gespräch.

## Video-Hook (15–30 s, hochkant)

Leeres Dach von der Straße oder per Drohne → Montageteam bei der Arbeit (2–3 Schnitte) →
fertige Anlage in der Abendsonne. Untertitel: „Gleiches Dach. [Montagedauer] später.“
Zweite Variante: Inhaber 20 Sekunden selbst vor der Kamera: „Ich bin [Name] aus [Ort] …“

## Regeln speziell für PV-Werbung

- **Keine Ersparnis versprechen.** Kein „Sie sparen 80 %“, kein „Strom gratis“, keine Amortisationszeit als Zusage. Das hängt vom einzelnen Haus ab und ist ein Abmahnrisiko.
- **0 % Mehrwertsteuer** darf genannt werden, mit der Bedingung: Anlagen bis 30 kWp auf oder an Wohngebäuden (§ 12 Abs. 3 UStG). Vorher mit dem Betrieb abstimmen.
- **Keine Förderzusagen.** Förderprogramme ändern sich, nur nennen, was der Betrieb aktuell bestätigt.
- **Keine Finanzierung in der Anzeige.** Ratenkauf oder Kredit in der Anzeige kann bei Meta eine Sonderkategorie für Finanzprodukte auslösen. Vor einem Test prüfen.
- **Echte Fotos aus der Region**, keine Stockbilder mit Palmen und Wüstendächern.

## Quellen (Stand November 2026)

Preise und Rahmen:
- [Kosten PV-Anlage 10 kWp mit Speicher 2026 — priwatt](https://priwatt.de/blog/kosten-pv-anlage-10-kwp-mit-speicher/)
- [Photovoltaik Kosten 2026 — 42watt](https://42watt.de/magazin/photovoltaik-kosten)
- [Photovoltaik Mehrwertsteuer 2026 — priwatt](https://priwatt.de/blog/photovoltaik-mehrwertsteuer-2026/)
- [Einspeisevergütung 2026 und EEG-Reform 2027 — reduco](https://reduco.ai/blog/einspeiseverguetung-aenderungen-2026-2027)

Kosten pro Anfrage (vorwiegend US/UK-Marketingblogs, teils selbst Anbieter, für Deutschland nur grobe Richtung):
- [Facebook Ads for Solar Companies 2026 — SurgePV](https://www.surgepv.com/blog/facebook-ads-solar-companies)
- [How much do solar leads cost in 2026? — Hero](https://gowithhero.com/blog/how-much-do-solar-leads-cost)
- [Solar Facebook Ads Statistics 2026 — Webtonic](https://www.webtonic.io/blog/solar-energy-facebook-ads-statistics)

Die Preis- und Steuerquellen sind überwiegend Händler- und Ratgeberseiten. Vor dem echten
Einsatz Einspeisevergütung und Nullsteuersatz bei Bundesnetzagentur bzw. im UStG-Text gegenprüfen.
