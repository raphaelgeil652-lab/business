# {{betrieb}}

Erzeugt am {{erzeugt_am}} aus [`steckbrief.xlsx`](steckbrief.xlsx) mit `kunde-anlegen.py`.
**Ändern immer im Steckbrief, dann neu erzeugen** — Dateien in `dokumente/`, `anzeigen/` und
`landingpage/` werden dabei ersetzt. `tabellen/` und `fotos/` bleiben unangetastet.

```
python3 nischen/photovoltaik/vorlagen/werkzeuge/kunde-anlegen.py nischen/photovoltaik/kunden/{{slug}}/steckbrief.xlsx
```

## Eckdaten

| | |
|---|---|
| Inhaber | {{anrede}} {{inhaber}} · {{telefon}} · {{email}} |
| Adresse | {{adresse}} ({{bundesland}}) |
| Einzugsgebiet | {{einzugsgebiet_km}} km |
| Dauerkampagne | Wirtschaftlichkeitsprüfung, Ergebnis innerhalb von {{pruefung_dauer}} |
<!--VERLOSUNG-->| Verlosung (aktiv) | Teilnahmeschluss {{aktion_ende}}, Ziehung {{ziehung}}, Speicher: {{speicher}} |
<!--/VERLOSUNG-->
| Preise | Onboarding {{onboarding_preis}} · Retainer {{retainer}}/Monat ab erstem Auftrag |
| Werbebudget | Meta {{budget_meta}} + Google {{budget_google}} = {{budget_gesamt}} pro Monat |

## Noch offen im Steckbrief

{{offen_liste}}

## Alles für diesen Kunden

| Was | Datei | Wofür |
|---|---|---|
| Steckbrief | [`steckbrief.xlsx`](steckbrief.xlsx) | Die Quelle für alles, inkl. Pflichtcheck und interner Rechnung |
| Onboarding | [`tabellen/onboarding.xlsx`](tabellen/onboarding.xlsx) | Abhaken bis zum Livegang |
| Anfragen und Report | [`tabellen/anfragen-und-report.xlsx`](tabellen/anfragen-und-report.xlsx) | Jede Anfrage eintragen, Monatsreport rechnet sich |
| Vereinbarung | [`dokumente/vereinbarung.md`](dokumente/vereinbarung.md) | Als PDF schicken, unterschreiben lassen |
| Willkommens-Mail | [`dokumente/willkommens-mail.md`](dokumente/willkommens-mail.md) | Am Tag der Unterschrift |
| Rückruf-Leitfaden | [`dokumente/rueckruf-leitfaden.md`](dokumente/rueckruf-leitfaden.md) | Für das Büro des Kunden |
| Kampagnen | [`dokumente/kampagnen.md`](dokumente/kampagnen.md) | Meta und Google 1:1 eintragen |
<!--VERLOSUNG-->| Teilnahmebedingungen | [`dokumente/teilnahmebedingungen.md`](dokumente/teilnahmebedingungen.md) | Vor Livegang prüfen lassen |
<!--/VERLOSUNG-->
| Report-Mail | [`dokumente/report-mail.md`](dokumente/report-mail.md) | Monatlich |
| Abrechnungs-Mails | [`dokumente/abrechnung-mails.md`](dokumente/abrechnung-mails.md) | Onboarding-Rechnung, Retainer-Start |
| Anzeigen-Bilder | [`anzeigen/creatives/`](anzeigen/creatives/) | Hochladen bei Meta |
| Anzeigen-Vorschau | [`anzeigen/vorschau.html`](anzeigen/vorschau.html) | Zeigen im Videocall |
| Landingpages | [`landingpage/`](landingpage/) | Ganzen Ordner auf app.netlify.com/drop ziehen |
| Fotos | [`fotos/`](fotos/) | Echte Fotos des Kunden als `foto-1.jpg`, `foto-2.jpg`, `foto-3.jpg` ablegen, dann neu erzeugen |

**Öffnen im Browser** (nach dem Pushen; Zahl hinter `?v=` nach Änderungen hochzählen):
[Anzeigen-Vorschau](https://raw.githack.com/raphaelgeil652-lab/business/main/nischen/photovoltaik/kunden/{{slug}}/anzeigen/vorschau.html?v=1) ·
[Wirtschaftlichkeitsprüfung](https://raw.githack.com/raphaelgeil652-lab/business/main/nischen/photovoltaik/kunden/{{slug}}/landingpage/wirtschaftlichkeit.html?v=1) ·
[Rechner](https://raw.githack.com/raphaelgeil652-lab/business/main/nischen/photovoltaik/kunden/{{slug}}/landingpage/rechner.html?v=1)
<!--VERLOSUNG-->· Verlosung: [Modul](https://raw.githack.com/raphaelgeil652-lab/business/main/nischen/photovoltaik/kunden/{{slug}}/landingpage/modul.html?v=1) ·
[20 %](https://raw.githack.com/raphaelgeil652-lab/business/main/nischen/photovoltaik/kunden/{{slug}}/landingpage/rabatt.html?v=1) ·
[Speicher](https://raw.githack.com/raphaelgeil652-lab/business/main/nischen/photovoltaik/kunden/{{slug}}/landingpage/speicher.html?v=1)
<!--/VERLOSUNG-->
