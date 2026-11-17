# {{betrieb}}

**Kürzel:** `{{slug}}` · **Adresse der Seiten:** {{landingpage_url}} · erzeugt am {{erzeugt_am}}

Nichts in diesem Ordner von Hand ändern. Etwas falsch oder neu? Im Steckbrief ändern und Claude
schicken: „Erzeuge {{betrieb}} neu.“ Die Checkliste und die Fotos bleiben dabei erhalten.

## Noch offen

{{offen_liste}}

## Eckdaten

| | |
|---|---|
| Inhaber | {{anrede}} {{inhaber}} · {{telefon}} · {{email}} |
| Werbegebiet | {{einzugsgebiet_km}} km um {{ort}} |
| Preise | Onboarding {{onboarding_preis}} · Monatsgebühr {{retainer}} ab dem ersten Auftrag |
| Werbebudget | {{budget_gesamt}} pro Monat (Meta {{budget_meta}}, Google {{budget_google}}) · Empfehlung: {{budget_empfehlung}} |
| Prüfung | Ergebnis innerhalb von {{pruefung_dauer}} |
| Fotos vom Kunden | {{drive_link}} |
<!--VERLOSUNG-->| Verlosung läuft | Teilnahmeschluss {{aktion_ende}}, Ziehung {{ziehung}}, Speicher: {{speicher}} |
<!--/VERLOSUNG-->

## Welche Datei wann

| Schritt | Datei in diesem Ordner | Was du tust |
|---|---|---|
| 4 · Abschluss | **2 Vertrag** | als PDF schicken, unterschrieben zurück |
| | **3 Rechnung** | Rechnung in der Zentrale machen, mit Mail 1 schicken |
| | **4 Willkommens-Mail** + **5 Rückruf-Leitfaden** | Mail schicken, Leitfaden als PDF anhängen |
| | **6 Zeile für die Zentrale** | öffnen, alles kopieren, in der Zentrale im Blatt „Kunden“ in die erste freie Zeile einfügen. Die Checkliste für diesen Kunden legt sich dann von selbst an. |
| 6 · Einrichten | **7 Kampagnen** | zuerst „Messung einrichten“, dann Meta und Google anlegen (pausiert) |
| | **8 Seiten für Netlify** | ganzen Ordner auf app.netlify.com/drop ziehen, Seite in `{{slug}}` umbenennen |
| | **9 Anzeigen-Bilder** | bei Meta hochladen |
| Zum Zeigen | **10 Anzeigen ansehen** | `vorschau.html` im Browser öffnen |
<!--VERLOSUNG-->| Verlosung | **11 Teilnahmebedingungen** | vor dem Start prüfen lassen, steht auf den Verlosungsseiten |
<!--/VERLOSUNG-->
Abhaken: in der Zentrale, Blatt „Checkliste“, Spalte `{{slug}}`.

**Im Browser ansehen** (nur beim fiktiven Probekunden, echte Kunden liegen nicht im Repo):
[Anzeigen-Vorschau](https://raw.githack.com/raphaelgeil652-lab/business/main/nischen/photovoltaik/kunden/{{slug}}/anzeigen/vorschau.html?v={{v}}) ·
[Wirtschaftlichkeitsprüfung](https://raw.githack.com/raphaelgeil652-lab/business/main/nischen/photovoltaik/kunden/{{slug}}/landingpage/wirtschaftlichkeit.html?v={{v}}) ·
[Rechner](https://raw.githack.com/raphaelgeil652-lab/business/main/nischen/photovoltaik/kunden/{{slug}}/landingpage/rechner.html?v={{v}})
