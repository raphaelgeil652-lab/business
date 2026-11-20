# Beauty

Online-Terminbuchung über Meta- und Google-Werbung für **ein Studio, eine Behandlung**:
**Laser-Haarentfernung** · **Permanent Make-up** · **Faltenbehandlung und Hyaluron** (Ärzte, Heilpraktiker) ·
**Bleaching** (Zahnarztpraxen). Die Kundin sieht eine Anzeige, wählt auf der Seite des Studios einen freien Termin,
bestätigt per E-Mail, und der Termin steht im Kalender des Studios. Kein Rückruf nötig, keine Fake-Anfragen.

**Status (20.11.2026, Version 2):** Gespräch = ein Formular in der Zentrale, das Studio arbeitet seine eigene Schritte-Seite ab,
Mails, Erinnerungen, Rechnungen und Reports laufen von selbst. Getestet mit vier erfundenen Beispielstudios.
**Nächster Schritt: Code in der Zentrale ersetzen (neue Version bereitstellen) und Probelauf 2.**
Photovoltaik ist pausiert und liegt unverändert in `../photovoltaik/`.

| Was | Wo |
|---|---|
| **Die Anleitung** ⭐ vom ersten Kontakt bis zum laufenden Studio | [`ANLEITUNG.md`](ANLEITUNG.md) |
| **Die Beauty-Zentrale**: Formular „Neuer Kunde“, Schritte-Seite fürs Studio, Team-Seite, Online-Buchung, alle Mails | [`zentrale/EINRICHTEN.md`](zentrale/EINRICHTEN.md) |
| Hilfe: Meta und Google mit dem Studio einrichten, Netlify | [`hilfe-einrichten.md`](hilfe-einrichten.md) |
| Der Baukasten: vier Behandlungen mit Regeln, Texten, Anzeigen | [`vorlagen/module.py`](vorlagen/module.py) |
| Regeln, Zahlen, Quellen | [`modul-beauty.md`](modul-beauty.md) |
| Das System dahinter (Technik) | [`vorlagen/LIES-MICH.md`](vorlagen/LIES-MICH.md) |

**Ansehen** (erfundene Beispielstudios, die Terminseiten zeigen Beispiel-Termine):

| Behandlung | Anzeigen | Terminseite |
|---|---|---|
| Laser (Google-Kalender) | [▶ Anzeigen](https://raw.githack.com/raphaelgeil652-lab/business/main/nischen/beauty/kunden/muster-laserstudio/anzeigen/vorschau.html?v=2) | [▶ Seite](https://raw.githack.com/raphaelgeil652-lab/business/main/nischen/beauty/kunden/muster-laserstudio/seite/termin.html?demo=1&v=2) |
| Permanent Make-up (Studio bestätigt per Knopf) | [▶ Anzeigen](https://raw.githack.com/raphaelgeil652-lab/business/main/nischen/beauty/kunden/muster-brows/anzeigen/vorschau.html?v=2) | [▶ Seite](https://raw.githack.com/raphaelgeil652-lab/business/main/nischen/beauty/kunden/muster-brows/seite/termin.html?demo=1&v=2) |
| Faltenbehandlung (Ärztin) | [▶ Anzeigen](https://raw.githack.com/raphaelgeil652-lab/business/main/nischen/beauty/kunden/muster-aesthetik/anzeigen/vorschau.html?v=2) | [▶ Seite](https://raw.githack.com/raphaelgeil652-lab/business/main/nischen/beauty/kunden/muster-aesthetik/seite/termin.html?demo=1&v=2) |
| Bleaching (Zahnarztpraxis) | [▶ Anzeigen](https://raw.githack.com/raphaelgeil652-lab/business/main/nischen/beauty/kunden/muster-zahnarztpraxis/anzeigen/vorschau.html?v=2) | [▶ Seite](https://raw.githack.com/raphaelgeil652-lab/business/main/nischen/beauty/kunden/muster-zahnarztpraxis/seite/termin.html?demo=1&v=2) |

(Die Links funktionieren, sobald der Branch `beauty-recherche` in `main` übernommen ist.)

## Worauf es ankommt

- **Ihr seid zu zweit.** Jedes Studio hat einen festen **Betreuer** (du oder dein Kollege), dessen Name und Nummer
  in allen Mails stehen. Die Zentrale schickt jedem seine Akquise-Liste, seine Studio-Hinweise und seine Report-Links. Zusammen klären: Aufteilung, Auftritt (z. B. GbR), Rechnungen.

- **Eine Behandlung pro Studio**, und nur, wer sie darf: Laser mit NiSV-Fachkunde, Faltenbehandlung nur Ärzte
  (Hyaluron auch Heilpraktiker), Bleaching nur Zahnärzte. Das Formular „Neuer Kunde“ prüft das.
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
node nischen/beauty/zentrale/test/test.js          # Zentrale: 211 Prüfungen (Buchung, Formular, Schritte-Seite, Team-Seite, Mails)
node nischen/beauty/zentrale/test/seiten-test.js   # echte Seite im Browser + Zentrale, Ende zu Ende
```
