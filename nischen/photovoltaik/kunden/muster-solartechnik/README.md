# Muster Solartechnik

Erzeugt am 16.11.2026 aus [`steckbrief.xlsx`](steckbrief.xlsx) mit `kunde-anlegen.py`.
**Ändern immer im Steckbrief, dann neu erzeugen** — Dateien in `dokumente/`, `anzeigen/` und
`landingpage/` werden dabei ersetzt. `tabellen/` und `fotos/` bleiben unangetastet.

```
python3 nischen/photovoltaik/vorlagen/werkzeuge/kunde-anlegen.py nischen/photovoltaik/kunden/muster-solartechnik/steckbrief.xlsx
```

## Eckdaten

| | |
|---|---|
| Inhaber | Herr Markus Muster · [Telefon für Rückrufe] · [E-Mail (Anfragen gehen hierhin)] |
| Adresse | [Straße und Hausnummer], [PLZ] [Ort] ([Bundesland]) |
| Einzugsgebiet | 40 km |
| Verlosungen | Teilnahmeschluss 15.01.2027, Ziehung 20.01.2027, Speicher: 10 kWh |
| Preise | Onboarding 850 € · Retainer 1.500 €/Monat ab erstem Auftrag |
| Werbebudget | Meta 700 € + Google 300 € = 1.000 € pro Monat |

## Noch offen im Steckbrief

- [ ] Straße und Hausnummer
- [ ] PLZ
- [ ] Ort
- [ ] Bundesland
- [ ] Telefon für Rückrufe
- [ ] E-Mail (Anfragen gehen hierhin)
- [ ] Webseite
- [ ] Link Google-Profil
- [ ] Meta-Pixel-ID
- [ ] Adresse der Landingpages
- [ ] Drive-Ordner für Fotos

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
| Teilnahmebedingungen | [`dokumente/teilnahmebedingungen.md`](dokumente/teilnahmebedingungen.md) | Vor Livegang prüfen lassen |
| Report-Mail | [`dokumente/report-mail.md`](dokumente/report-mail.md) | Monatlich |
| Abrechnungs-Mails | [`dokumente/abrechnung-mails.md`](dokumente/abrechnung-mails.md) | Onboarding-Rechnung, Retainer-Start |
| Anzeigen-Bilder | [`anzeigen/creatives/`](anzeigen/creatives/) | Hochladen bei Meta |
| Anzeigen-Vorschau | [`anzeigen/vorschau.html`](anzeigen/vorschau.html) | Zeigen im Videocall |
| Landingpages | [`landingpage/`](landingpage/) | Ganzen Ordner auf app.netlify.com/drop ziehen |
| Fotos | [`fotos/`](fotos/) | Echte Fotos des Kunden mit genau diesen Namen ablegen, dann neu erzeugen |

**Öffnen im Browser** (nach dem Pushen; Zahl hinter `?v=` nach Änderungen hochzählen):
[Anzeigen-Vorschau](https://raw.githack.com/raphaelgeil652-lab/business/main/nischen/photovoltaik/kunden/muster-solartechnik/anzeigen/vorschau.html?v=1) ·
[Modul](https://raw.githack.com/raphaelgeil652-lab/business/main/nischen/photovoltaik/kunden/muster-solartechnik/landingpage/modul.html?v=1) ·
[20 %](https://raw.githack.com/raphaelgeil652-lab/business/main/nischen/photovoltaik/kunden/muster-solartechnik/landingpage/rabatt.html?v=1) ·
[Speicher](https://raw.githack.com/raphaelgeil652-lab/business/main/nischen/photovoltaik/kunden/muster-solartechnik/landingpage/speicher.html?v=1)
