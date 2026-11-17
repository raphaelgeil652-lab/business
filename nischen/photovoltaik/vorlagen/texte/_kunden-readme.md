# {{betrieb}}

Erzeugt am {{erzeugt_am}} aus dem [Steckbrief](steckbrief.xlsx). **Nichts hier von Hand ändern.**
Etwas falsch oder neu? Im Steckbrief ändern und Claude sagen: „Erzeuge {{betrieb}} neu.“
Die Tabellen und Fotos bleiben dabei erhalten.

## Noch offen

{{offen_liste}}

## Eckdaten

| | |
|---|---|
| Inhaber | {{anrede}} {{inhaber}} · {{telefon}} · {{email}} |
| Werbegebiet | {{einzugsgebiet_km}} km um {{ort}} |
| Preise | Onboarding {{onboarding_preis}} · Monatsgebühr {{retainer}} ab dem ersten Auftrag |
| Werbebudget | {{budget_gesamt}} pro Monat (Meta {{budget_meta}}, Google {{budget_google}}) · Empfehlung war {{budget_empfehlung}} |
| Prüfung | Ergebnis innerhalb von {{pruefung_dauer}} |
<!--VERLOSUNG-->| Verlosung läuft | Teilnahmeschluss {{aktion_ende}}, Ziehung {{ziehung}}, Speicher: {{speicher}} |
<!--/VERLOSUNG-->

## Was du wann brauchst

| Schritt | Datei |
|---|---|
| 4 · Abschluss | [Vereinbarung](dokumente/vereinbarung.md) · [Abrechnungs-Mails](dokumente/abrechnung-mails.md) · [Willkommens-Mail](dokumente/willkommens-mail.md) · [Rückruf-Leitfaden](dokumente/rueckruf-leitfaden.md) |
| 4–7 · Abhaken | [Checkliste bis zum Livegang](tabellen/checkliste.xlsx) |
| 5 · Fotos ablegen | Ordner [`fotos/`](fotos/): `foto-1.jpg`, `foto-2.jpg`, `foto-3.jpg`, dazu wenn vorhanden `vorher.jpg` und `nachher.jpg` |
| 6 · Seiten hochladen | Ordner [`landingpage/`](landingpage/) auf app.netlify.com/drop ziehen |
| 6 · Kampagnen anlegen | [Kampagnen Meta und Google](dokumente/kampagnen.md) · Bilder in [`anzeigen/creatives/`](anzeigen/creatives/) |
| 8 · Jeden Tag / Monat | [Anfragen und Monatsreport](tabellen/anfragen-und-report.xlsx) · [Report-Mail](dokumente/report-mail.md) |
<!--VERLOSUNG-->| Verlosung | [Teilnahmebedingungen](dokumente/teilnahmebedingungen.md) (vor dem Start prüfen lassen) |
<!--/VERLOSUNG-->

**Im Browser ansehen** (nach dem Pushen):
[Anzeigen-Vorschau](https://raw.githack.com/raphaelgeil652-lab/business/main/nischen/photovoltaik/kunden/{{slug}}/anzeigen/vorschau.html?v={{v}}) ·
[Wirtschaftlichkeitsprüfung](https://raw.githack.com/raphaelgeil652-lab/business/main/nischen/photovoltaik/kunden/{{slug}}/landingpage/wirtschaftlichkeit.html?v={{v}}) ·
[Rechner](https://raw.githack.com/raphaelgeil652-lab/business/main/nischen/photovoltaik/kunden/{{slug}}/landingpage/rechner.html?v={{v}})
<!--VERLOSUNG-->· Verlosung: [Modul](https://raw.githack.com/raphaelgeil652-lab/business/main/nischen/photovoltaik/kunden/{{slug}}/landingpage/modul.html?v={{v}}) ·
[20 %](https://raw.githack.com/raphaelgeil652-lab/business/main/nischen/photovoltaik/kunden/{{slug}}/landingpage/rabatt.html?v={{v}}) ·
[Speicher](https://raw.githack.com/raphaelgeil652-lab/business/main/nischen/photovoltaik/kunden/{{slug}}/landingpage/speicher.html?v={{v}})
<!--/VERLOSUNG-->
