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
| **Die Anleitung** ⭐ vom ersten Anruf bis zur laufenden Kampagne, in Reihenfolge | [`ANLEITUNG.md`](ANLEITUNG.md) |
| Steckbrief zum Ausfüllen (pro Kunde kopieren; Blatt „Deine Daten“ einmal ausfüllen) | [`vorlagen/tabellen/01-steckbrief.xlsx`](vorlagen/tabellen/01-steckbrief.xlsx) |
| **Die Zentrale**: Google-Tabelle mit Automatik (Anfragen, Erinnerungen, Reports, Checkliste, Akquise, Rechnungen) | [`../../zentrale/EINRICHTEN.md`](../../zentrale/EINRICHTEN.md) |
| Hilfe für Schritt 6: Seiten online, Zentrale verbinden, Kampagnen | [`hilfe-einrichten.md`](hilfe-einrichten.md) |
| Das System dahinter (Technik) | [`vorlagen/LIES-MICH.md`](vorlagen/LIES-MICH.md) |
| Probekunde, komplett vom System erzeugt | [`kunden/muster-solartechnik/`](kunden/muster-solartechnik/) |
| Das Modul: Ticket, Verlosungen, Anzeigen-Standard, Regeln, Quellen | [`modul-photovoltaik.md`](modul-photovoltaik.md) |
| Betriebshandbuch (nischenneutral, Claude-Doc) | [Öffnen](https://claude.ai/artifact/7DSh95Hfrp17kLRnNLXftN) |

**Ansehen** (Probekunde):
[▶ Anzeigen-Vorschau](https://raw.githack.com/raphaelgeil652-lab/business/main/nischen/photovoltaik/kunden/muster-solartechnik/anzeigen/vorschau.html?v=7) ·
[▶ Wirtschaftlichkeitsprüfung](https://raw.githack.com/raphaelgeil652-lab/business/main/nischen/photovoltaik/kunden/muster-solartechnik/landingpage/wirtschaftlichkeit.html?v=7) ·
[▶ Rechner](https://raw.githack.com/raphaelgeil652-lab/business/main/nischen/photovoltaik/kunden/muster-solartechnik/landingpage/rechner.html?v=7) ·
Verlosung: [▶ Modul](https://raw.githack.com/raphaelgeil652-lab/business/main/nischen/photovoltaik/kunden/muster-solartechnik/landingpage/modul.html?v=7) ·
[▶ 20 %](https://raw.githack.com/raphaelgeil652-lab/business/main/nischen/photovoltaik/kunden/muster-solartechnik/landingpage/rabatt.html?v=7) ·
[▶ Speicher](https://raw.githack.com/raphaelgeil652-lab/business/main/nischen/photovoltaik/kunden/muster-solartechnik/landingpage/speicher.html?v=7)

---

## So läuft es

Alles steht in der [Anleitung](ANLEITUNG.md). Kurz: Betriebe anrufen → Videocall mit Steckbrief →
Claude erzeugt den Kundenordner → Abschluss am selben Tag, Kunde in die Zentrale → Kunde schickt
Fotos, Zugänge, Links → Seiten hochladen, mit der Zentrale verbinden, Kampagnen anlegen → testen,
live. Danach meldet sich die Zentrale, wenn du etwas tun musst.

## Worauf es bei PV ankommt

- **Werbebudget = Auftragswert ÷ 5**, Start mit 3.000 € (nicht unter 2.500 €). Faustregel aus der
  Praxis eines befreundeten Agenturinhabers: Weniger Budget bringt zu wenige und schlechtere Anfragen.
  Dafür braucht der Betrieb 5–6 freie Beratungstermine pro Woche; der Steckbrief prüft das.
- **Rückruf in 1 Stunde.** Interessenten fragen parallel bei mehreren an.
- **Einzugsgebiet pro Kunde.** Werberadius = wo er montiert. Im Gespräch fragen.
- **Lange Entscheidung.** Erster unterschriebener Auftrag nach Wochen. Ob sich das für den Kunden trägt: Steckbrief, Blatt „Rechnung intern“.
- **Zahlen nur als Beispielrechnung** mit Annahmen und Quelle, nie als Versprechen. Keine Förderzusagen.
- **Wirtschaftlichkeitsprüfung pünktlich liefern.** Wer zusagt „innerhalb von 2 Werktagen“, muss es halten.
- **githack zwischenspeichert alte Fassungen.** Nach Änderungen die Zahl hinter `?v=` in den Links hochzählen.
- **Echte Kunden nie ins Repo.** Es ist öffentlich. Kundenordner liegen beim Nutzer, Anfragen in der Zentrale.

## Offen mit dem Kollegen

- Wer macht was: Er verkauft an die Betriebe, du baust und betreibst das System?
- Wie wird geteilt?
- Falls er bei einem PV-Betrieb angestellt ist: Nebentätigkeit und Wettbewerbsverbot im
  Arbeitsvertrag prüfen, bevor er Konkurrenzbetriebe anspricht.
