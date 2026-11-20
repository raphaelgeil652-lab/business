# {{betrieb}}

**{{modul_name}}** · **Kürzel:** `{{slug}}` · **Adresse der Seiten:** {{landingpage_url}} · erzeugt am {{erzeugt_am}}

Nichts in diesem Ordner von Hand ändern. Etwas falsch oder neu? Im Steckbrief ändern und Claude
schicken: „Erzeuge {{betrieb}} neu.“ Die Checkliste (in der Beauty-Zentrale) und die Fotos bleiben erhalten.

## Noch offen

{{offen_liste}}

## Eckdaten

| | |
|---|---|
| Inhaber/in | {{anrede}} {{inhaber}} · {{telefon}} · {{email}} |
| Behandlung | {{modul_name}} · behandelt: {{behandler}} · {{behandler_name}} |
| Werbegebiet | {{umkreis_km}} km um {{ort}} |
| Online-Buchung | Modus {{buchung_modus}} · {{buchbare_zeiten}} · Beratung {{beratung_minuten}} Min. · {{direkt_kurz}} |
| Absage | bis {{absagefrist_text}} · {{ausfall_kurz}} |
| Preise | Onboarding {{onboarding_preis}} · Monatsgebühr {{retainer}} ab dem ersten Kauf |
| Werbebudget | {{budget_gesamt}} pro Monat (Meta {{budget_meta}}, Google {{budget_google}}) |
| Fotos vom Studio | {{drive_link}} |
<!--VERLOSUNG-->| Verlosung läuft | {{gewinn}} · Teilnahmeschluss {{aktion_ende}}, Ziehung {{ziehung}} |
<!--/VERLOSUNG-->

## Was in dieser Behandlung erlaubt ist (steckt schon in Anzeigen und Seite)

{{regeln_liste}}

## Vorbereitungs-Hinweise, die die Kundschaft bekommt

{{vorbereitung_liste}}

{{vorbereitung_status}}

## Welche Datei wann

| Schritt | Datei in diesem Ordner | Was du tust |
|---|---|---|
| 4 · Abschluss | **2a + 2b Vertrag** | 2a sagt wie und hat den Mailtext; 2b als PDF, selbst unterschreiben, schicken, unterschrieben zurück |
| | **3 Rechnung** | Mailtext. Die Rechnung selbst in der Beauty-Zentrale machen, als PDF an Mail 1 hängen |
| | **4 Willkommens-Mail** + **4b Zugänge** + **4c Kalender** + **5 Termin-Leitfaden** | vorher sein Google-Ads-Konto anlegen; Mail schicken, 4b, 4c und 5 als PDF anhängen |
| | **6 Zeile für die Zentrale** | öffnen, alles kopieren, in der Beauty-Zentrale im Blatt „Kunden“ in die erste freie Zeile einfügen |
| 6 · Einrichten | **7 Kampagnen** | zuerst „Messung einrichten“, dann Meta und Google anlegen (pausiert) |
| | **8 Seiten für Netlify** | ganzen Ordner auf app.netlify.com/drop ziehen, Seite in `{{slug}}` umbenennen |
| | **9 Anzeigen-Bilder** | bei Meta hochladen |
| Zum Zeigen | **10 Anzeigen ansehen** | `vorschau.html` im Browser öffnen |
<!--VERLOSUNG-->| Verlosung | **11 Teilnahmebedingungen** | vor dem Start prüfen lassen, stehen auf der Verlosungsseite |
<!--/VERLOSUNG-->
Abhaken: in der Beauty-Zentrale, Blatt „Checkliste“, Spalte `{{slug}}`.

**Im Browser ansehen** (nur bei den erfundenen Beispielkunden, echte Kunden liegen nicht im Repo):
[Anzeigen-Vorschau](https://raw.githack.com/raphaelgeil652-lab/business/main/nischen/beauty/kunden/{{slug}}/anzeigen/vorschau.html?v={{v}}) ·
[Terminseite (Beispiel-Termine)](https://raw.githack.com/raphaelgeil652-lab/business/main/nischen/beauty/kunden/{{slug}}/landingpage/termin.html?demo=1&v={{v}})
