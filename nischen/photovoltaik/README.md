# Photovoltaik

Agentur-Modell aus dem Betriebshandbuch für PV-Betriebe in **ganz Deutschland**, geplant mit
einem Kollegen aus dem PV-Vertrieb. Zwei Kampagnenarten für Hausbesitzer:
- **Dauerkampagne:** kostenlose Wirtschaftlichkeitsprüfung, nach der Eintragung, mit
  Beispielrechnung in der Anzeige („1.665 € → rund 500 €“).
- **Saisonaktion, 2–3 × im Jahr:** drei Verlosungen (kostenloses Modul · 3 × 20 % · 3 Speicher,
  jeweils zur ersten Bestellung).

**Status:** Probelauf mit dem erfundenen Kunden „Muster Solartechnik“. Noch kein echter Kunde.

| Was | Wo |
|---|---|
| **Das System** ⭐ alle Vorlagen, Tabellen, Werkzeuge, mit Anleitung | [`vorlagen/LIES-MICH.md`](vorlagen/LIES-MICH.md) |
| Probekunde, komplett vom System erzeugt | [`kunden/muster-solartechnik/`](kunden/muster-solartechnik/) |
| Das Modul: Ticket, Verlosungen, Anzeigen-Standard, Regeln, Quellen | [`modul-photovoltaik.md`](modul-photovoltaik.md) |
| Betriebshandbuch (nischenneutral, Claude-Doc) | [Öffnen](https://claude.ai/artifact/7DSh95Hfrp17kLRnNLXftN) |

**Ansehen** (Probekunde):
[▶ Anzeigen-Vorschau](https://raw.githack.com/raphaelgeil652-lab/business/main/nischen/photovoltaik/kunden/muster-solartechnik/anzeigen/vorschau.html?v=5) ·
[▶ Wirtschaftlichkeitsprüfung](https://raw.githack.com/raphaelgeil652-lab/business/main/nischen/photovoltaik/kunden/muster-solartechnik/landingpage/wirtschaftlichkeit.html?v=5) ·
[▶ Rechner](https://raw.githack.com/raphaelgeil652-lab/business/main/nischen/photovoltaik/kunden/muster-solartechnik/landingpage/rechner.html?v=5) ·
Verlosung: [▶ Modul](https://raw.githack.com/raphaelgeil652-lab/business/main/nischen/photovoltaik/kunden/muster-solartechnik/landingpage/modul.html?v=5) ·
[▶ 20 %](https://raw.githack.com/raphaelgeil652-lab/business/main/nischen/photovoltaik/kunden/muster-solartechnik/landingpage/rabatt.html?v=5) ·
[▶ Speicher](https://raw.githack.com/raphaelgeil652-lab/business/main/nischen/photovoltaik/kunden/muster-solartechnik/landingpage/speicher.html?v=5)

---

## Fahrplan: vom ersten Anruf bis zum laufenden Kunden

`V` = `vorlagen/`, `K` = `kunden/<betrieb>/` (vom System erzeugt).

### A · Einmalig für dich

| # | Was | Datei / Link | Weiter |
|---|---|---|---|
| 1 | Agentur-Stammdaten | [`V/tabellen/00-agentur-stammdaten.xlsx`](vorlagen/tabellen/00-agentur-stammdaten.xlsx) | Einmal ausfüllen. Landet automatisch in Vertrag, Mails, Rechnungen |
| 2 | Meta Business Portfolio | [business.facebook.com](https://business.facebook.com) | Anlegen, Zwei-Faktor an, Business-ID in die Stammdaten. Anleitung: [`meta-konto-einrichten.md`](../../anleitungen/meta-konto-einrichten.md) |
| 3 | Google-Ads-Verwaltungskonto | [Verwaltungskonto anlegen](https://ads.google.com/home/tools/manager-accounts/) | Kunden-ID in die Stammdaten |
| 4 | Netlify | [app.netlify.com](https://app.netlify.com) | Kostenlos registrieren |

### B · Kunden gewinnen (ganz Deutschland, per Telefon und Video)

| # | Was | Datei / Link | Weiter |
|---|---|---|---|
| 5 | Liste der PV-Betriebe | [`V/tabellen/04-akquise-pv-betriebe.xlsx`](vorlagen/tabellen/04-akquise-pv-betriebe.xlsx) · [Google Maps](https://www.google.com/maps/search/Photovoltaik+Installateur) | Pro Stadt „Photovoltaik [Stadt]“ suchen, eintragen, Status pflegen |
| 6 | Erstanruf und Videocall | [`V/texte/akquise-verkaufsskript.md`](vorlagen/texte/akquise-verkaufsskript.md) | Ziel: 20-Minuten-Videocall. Dort die zwei Fragen, dann Anzeigen und Seiten zeigen |
| 7 | Nachfassen | [`V/texte/akquise-nachfass-mails.md`](vorlagen/texte/akquise-nachfass-mails.md) | Nach Anruf, nicht erreicht, nach Videocall |
| 8 | Steckbrief | [`V/tabellen/01-steckbrief.xlsx`](vorlagen/tabellen/01-steckbrief.xlsx) | Kopieren, im Gespräch ausfüllen. Pflichtcheck muss „Kunde passt“ zeigen. **Preise entscheidest du** |

### C · Kunde anlegen und abschließen

| # | Was | Datei / Link | Weiter |
|---|---|---|---|
| 9 | Kundenordner erzeugen | [`V/werkzeuge/kunde-anlegen.py`](vorlagen/werkzeuge/kunde-anlegen.py) | Claude sagen „Lege den Kunden aus diesem Steckbrief an“. Tipp: schon vor dem Videocall, dann zeigst du ihm seine eigenen Anzeigen |
| 10 | Vereinbarung | `K/dokumente/vereinbarung.md` | In Google Docs/Word einfügen → als PDF → digital unterschreiben lassen |
| 11 | Onboarding-Rechnung | [`V/tabellen/05-rechnungen.xlsx`](vorlagen/tabellen/05-rechnungen.xlsx) · `K/dokumente/abrechnung-mails.md` | Rechnung eintragen und mit der Mail schicken |
| 12 | Willkommens-Mail | `K/dokumente/willkommens-mail.md` | Am Tag der Unterschrift. Drive-Ordner vorher anlegen und Link in den Steckbrief |
| 13 | Rückruf-Leitfaden | `K/dokumente/rueckruf-leitfaden.md` | An das Büro des Kunden. Rückruf in 1 Stunde ist der größte Hebel |
| 14 | Onboarding abhaken | `K/tabellen/onboarding.xlsx` | 27 Schritte, Fortschritt in % |

### D · Einrichten und live gehen

| # | Was | Datei / Link | Weiter |
|---|---|---|---|
| 15 | Fotos und Daten nachtragen | `K/fotos/`, `K/steckbrief.xlsx` | Echte Fotos als `foto-1.jpg`, `foto-2.jpg`, `foto-3.jpg`; Pixel-ID, Telefon, Adresse in den Steckbrief → **Kundenordner neu erzeugen** |
| 16 | Rechtlich prüfen lassen | `K/anzeigen/creatives/w*.png`, `K/dokumente/teilnahmebedingungen.md` | Einmal: Beispielrechnungen in den Anzeigen; bei Verlosung die Teilnahmebedingungen |
| 17 | Landingpages hochladen | [app.netlify.com/drop](https://app.netlify.com/drop) | Ordner `K/landingpage/` plus Impressum und Datenschutz des Kunden hineinziehen. Forms → Erkennung an, Benachrichtigung an Kunde und dich. Adresse in den Steckbrief, neu erzeugen. Anleitung: [`landingpage-hosten.md`](../../anleitungen/landingpage-hosten.md) |
| 18 | Meta-Pixel | [Events Manager](https://business.facebook.com/events_manager2) | Pixel im Konto des Kunden anlegen, ID in den Steckbrief, neu erzeugen, neu hochladen |
| 19 | Meta-Kampagnen | [Werbeanzeigenmanager](https://adsmanager.facebook.com) · `K/dokumente/kampagnen.md` | Dauerkampagne mit 5 Anzeigen (`w1`–`w5`), bei Verlosung zusätzlich 3 Anzeigen; pausiert anlegen |
| 20 | Google-Kampagne | [Google Ads](https://ads.google.com) · `K/dokumente/kampagnen.md` | Keywords, 15 Überschriften, 4 Beschreibungen, pausiert anlegen |
| 21 | Testlauf | `K/tabellen/onboarding.xlsx` | Je eine Test-Anfrage über jede Seite, Mail beim Kunden? Pixel erst nach Zustimmung? |
| 22 | Livegang | — | Kampagnen aktiv, Datum notieren (Start der 30-Tage-Garantie) |

### E · Laufender Betrieb

| # | Was | Datei | Weiter |
|---|---|---|---|
| 23 | Anfragen eintragen | `K/tabellen/anfragen-und-report.xlsx` | Jede Anfrage eine Zeile, Rückmeldung des Kunden wöchentlich nachtragen |
| 24 | Monatsreport | Blatt „Monatsreport“ · `K/dokumente/report-mail.md` | Monat eintragen, Zahlen in die Mail, 10 Minuten telefonieren |
| 25 | Retainer starten | Monatsreport „Erster Auftrag“ · `K/dokumente/abrechnung-mails.md` | Ab dem Monat nach dem ersten Auftrag monatlich abrechnen |
| 26 | Verlosung 2–3 × im Jahr | Steckbrief „Verlosung gerade aktiv?“ | Ja + Daten eintragen → neu erzeugen → Verlosungs-Kampagne starten. Nach der Ziehung auf Nein → neu erzeugen. Die Dauerkampagne läuft immer weiter |

---

## Worauf es bei PV ankommt

- **Rückruf in 1 Stunde.** Interessenten fragen parallel bei mehreren an.
- **Einzugsgebiet pro Kunde.** Werberadius = wo er montiert. Im Gespräch fragen.
- **Lange Entscheidung.** Erster unterschriebener Auftrag nach Wochen. Preisfrage dazu: siehe Steckbrief, Blatt „Rechnung intern“.
- **Zahlen nur als Beispielrechnung** mit Annahmen und Quelle, nie als Versprechen. Keine Förderzusagen.
- **Wirtschaftlichkeitsprüfung pünktlich liefern.** Wer zusagt „innerhalb von 2 Werktagen“, muss es halten.
- **githack zwischenspeichert alte Fassungen.** Nach Änderungen die Zahl hinter `?v=` in den Links hochzählen.

## Offen mit dem Kollegen

- Wer macht was: Er verkauft an die Betriebe, du baust und betreibst das System?
- Wie wird geteilt?
- Falls er bei einem PV-Betrieb angestellt ist: Nebentätigkeit und Wettbewerbsverbot im
  Arbeitsvertrag prüfen, bevor er Konkurrenzbetriebe anspricht.
