# Beauty

Online-Terminbuchung über Meta- und Google-Werbung für **ein Studio, eine Behandlung**:
**Laser-Haarentfernung** · **Permanent Make-up** · **Faltenbehandlung und Hyaluron** (Ärzte, Heilpraktiker) ·
**Bleaching** (Zahnarztpraxen). Die Kundin sieht eine Anzeige, wählt auf der Seite des Studios einen freien Termin,
bestätigt per E-Mail, und der Termin steht im Kalender des Studios. Kein Rückruf nötig, keine Fake-Anfragen.

**Status:** fertig gebaut, getestet mit vier erfundenen Beispielstudios. **Nächster Schritt: einrichten und Probelauf.**
Photovoltaik ist pausiert und liegt unverändert in `../photovoltaik/`.

| Was | Wo |
|---|---|
| **Die Anleitung** ⭐ vom ersten Kontakt bis zum ersten Online-Termin | [`ANLEITUNG.md`](ANLEITUNG.md) |
| Steckbrief zum Ausfüllen (pro Studio kopieren; Blatt „Eure Daten“ einmal ausfüllen) | [`vorlagen/tabellen/01-steckbrief.xlsx`](vorlagen/tabellen/01-steckbrief.xlsx) |
| **Die Beauty-Zentrale**: Google-Tabelle mit Online-Buchung, Kalender, Mails, Fake-Schutz, Reports | [`zentrale/EINRICHTEN.md`](zentrale/EINRICHTEN.md) |
| Hilfe für Schritt 6: Kalender, Messung, Seiten, Zentrale, Kampagnen | [`hilfe-einrichten.md`](hilfe-einrichten.md) |
| Der Baukasten: vier Behandlungen mit Regeln, Texten, Anzeigen | [`vorlagen/module.py`](vorlagen/module.py) |
| Regeln, Zahlen, Quellen | [`modul-beauty.md`](modul-beauty.md) |
| Das System dahinter (Technik) | [`vorlagen/LIES-MICH.md`](vorlagen/LIES-MICH.md) |

**Ansehen** (erfundene Beispielstudios, die Terminseiten zeigen Beispiel-Termine):

| Behandlung | Anzeigen | Terminseite |
|---|---|---|
| Laser (Modus Kalender, mit Verlosung) | [▶ Anzeigen](https://raw.githack.com/raphaelgeil652-lab/business/main/nischen/beauty/kunden/muster-laserstudio/anzeigen/vorschau.html?v=1) | [▶ Seite](https://raw.githack.com/raphaelgeil652-lab/business/main/nischen/beauty/kunden/muster-laserstudio/landingpage/termin.html?demo=1&v=1) |
| Permanent Make-up (Modus Wunschtermin) | [▶ Anzeigen](https://raw.githack.com/raphaelgeil652-lab/business/main/nischen/beauty/kunden/muster-brows/anzeigen/vorschau.html?v=1) | [▶ Seite](https://raw.githack.com/raphaelgeil652-lab/business/main/nischen/beauty/kunden/muster-brows/landingpage/termin.html?demo=1&v=1) |
| Faltenbehandlung (Ärztin) | [▶ Anzeigen](https://raw.githack.com/raphaelgeil652-lab/business/main/nischen/beauty/kunden/muster-aesthetik/anzeigen/vorschau.html?v=1) | [▶ Seite](https://raw.githack.com/raphaelgeil652-lab/business/main/nischen/beauty/kunden/muster-aesthetik/landingpage/termin.html?demo=1&v=1) |
| Bleaching (Zahnarztpraxis) | [▶ Anzeigen](https://raw.githack.com/raphaelgeil652-lab/business/main/nischen/beauty/kunden/muster-zahnarztpraxis/anzeigen/vorschau.html?v=1) | [▶ Seite](https://raw.githack.com/raphaelgeil652-lab/business/main/nischen/beauty/kunden/muster-zahnarztpraxis/landingpage/termin.html?demo=1&v=1) |

(Die Links funktionieren, sobald der Branch `beauty-recherche` in `main` übernommen ist.)

## Worauf es ankommt

- **Ihr seid zu zweit.** Jedes Studio hat einen festen **Betreuer** (du oder dein Kollege), dessen Name und Nummer
  in allen Mails und Anleitungen stehen; einer von euch macht die **Technik**. Die Zentrale verteilt Akquise-Liste und
  Report-Entwürfe an die richtige Person, Hinweise gehen an beide. Zusammen klären: Aufteilung, Auftritt (z. B. GbR), Rechnungen.

- **Eine Behandlung pro Studio**, und nur, wer sie darf: Laser mit NiSV-Fachkunde, Faltenbehandlung nur Ärzte
  (Hyaluron auch Heilpraktiker), Bleaching nur Zahnärzte. Der Steckbrief prüft das.
- **Termin erst nach Bestätigung per E-Mail fest.** Fakes, Bots und falsche Adressen kommen nie beim Studio an.
- **Kalender des Studios** (Google) oder **Modus Wunschtermin** (Studio bestätigt per Knopf).
- **Abends tippt das Studio**: erschienen, nicht erschienen, gekauft. Daran hängen Report und Monatsgebühr.
- **Werberecht steckt im Baukasten.** Bei Ärzten und Zahnärzten: keine Verlosung, keine Rabatte, kein „kostenlos“,
  kein Vorher/Nachher, nie „Botox“.
- **Mail-Grenze von Google:** ca. 100 Mails am Tag im kostenlosen Konto, reicht für ~20 Buchungen am Tag. Ab dem
  4.–5. Studio die Zentrale in Google Workspace betreiben.
- **Echte Kunden nie ins Repo.** Es ist öffentlich. Nur die vier erfundenen Beispiele liegen drin.

## Tests

```
node nischen/beauty/zentrale/test/test.js          # Zentrale: 133 Prüfungen
node nischen/beauty/zentrale/test/seiten-test.js   # echte Seite im Browser + Zentrale, Ende zu Ende
```
