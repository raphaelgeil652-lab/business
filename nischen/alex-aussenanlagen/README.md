# 🌿 Alex Außenanlagen, Pfullendorf

Webseite für **Alex Stadelmann**: Garten- und Außenanlagen, Bagger- und Erdarbeiten,
Pflasterarbeiten im Raum Pfullendorf.

Eine normale Verkaufsseite: das Angebot steht sofort da, darunter Leistungen, der Unterbau als
Argument, der Ablauf, die häufigen Fragen und das Formular. **Kein Scroll-Film mehr.**

---

## ▶ Zum Zeigen

| Was | Öffnen |
|---|---|
| 🌿 **Die komplette Seite** | **[▶ Seite öffnen](https://raw.githack.com/raphaelgeil652-lab/business/main/nischen/alex-aussenanlagen/seite/index.html)** |

> Der Knopf liefert immer den aktuellen Stand aus `main`. Wenn die Seite alt aussieht, einmal hart
> neu laden. Er zeigt direkt auf `seite/index.html`, also genau auf das, was online gehen würde.

---

## Wie die Seite verkauft

Die Reihenfolge ist nicht Geschmack, sondern die Reihenfolge, in der ein Interessent fragt:

| # | Abschnitt | Beantwortet |
|---|---|---|
| 1 | **Hero** | Was macht der, wo, und was habe ich davon. Zwei Knöpfe, der wichtigste zuerst. |
| 2 | **Vertrauensleiste** | Die vier Einwände, die sofort kommen: kostet das was, ist das ein Pauschalpreis, holt der Subunternehmer, ist der aus der Gegend. |
| 3 | **Leistungen** | Macht der überhaupt meinen Job. Drei Bildkarten. |
| 4 | **Der Aufbau** | Warum er und nicht der Billigere. Vier Schichten, 42 cm. |
| 5 | **Der Schnitt zum Ziehen** | Dasselbe Argument zum Anfassen. Der Regler zeigt, was unter dem Stein liegt. |
| 6 | **So läuft's** | Was passiert, wenn ich anfrage. Drei Schritte. |
| 7 | **Fragen** | Die Einwände, die den Abschluss verhindern, allen voran der Quadratmeterpreis. |
| 8 | **Termin** | Drei Zusagen direkt über dem Formular, dann das Formular. |

Alles führt auf **einen** Anker: `#termin`. Der Knopf in der Navigation bleibt immer sichtbar.

---

## ⚠ Was noch fehlt, bevor die Seite online darf

| Fehlt | Was solange auf der Seite steht |
|---|---|
| **Telefon, E-Mail, Anschrift** | sichtbarer Platzhalter im Footer. Das Formular zeigt nur seine Danke-Zeile und verschickt nichts. |
| **Impressum und Datenschutz** | Hinweis im Footer. Beides ist in Deutschland Pflicht. |
| **Echte Fotos** | Hinweis, dass die Bilder KI-erzeugt sind. Sie sind als Platzhalter gedacht. |
| **Echte Kundenstimmen** | bewusst keine erfunden. Stattdessen drei Zusagen über dem Formular, die Alex selbst geben kann. |
| **Preise** | keine Zahlen auf der Seite. Die Frage nach dem Quadratmeterpreis wird ehrlich beantwortet, ohne eine Zahl zu behaupten. |

Nichts davon ist erfunden worden. Sobald Alex die Angaben schickt, sind es kleine Änderungen.

**Ein Telefonknopf fehlt bewusst.** Bei einem Handwerker ist der Anruf der stärkste Weg zum
Auftrag. Sobald Alex' Nummer da ist, gehört sie in die Navigation und als fester Balken unten
aufs Handy.

---

## Die Ordner

| Ordner | Was drin ist |
|---|---|
| `seite/` | **Die echte Webseite.** `index.html` plus `assets/`. Genau dieser Ordner geht online, nichts anderes. |
| `arbeitsdateien/` | Rohmaterial und Prüfbilder aus dem Selbsttest. Bleibt lokal. |
| `design-paket.md` | Der Plan hinter der Seite: Marken-Idee, Farben, Schriften, jeder Text. |

---

## Was die Seite technisch kann

- **Ein einziges HTML-File**, kein Framework, kein Build-Schritt, kein Server-Code.
- **Gewicht gemessen: 1.374 KB** komplett, mit allen Bildern und Schriften. Ladezeit lokal 74 ms.
  Zum Vergleich: die vorige Fassung mit dem Scroll-Film zog 12 MB Einzelbilder nach.
- Schriften liegen im Projekt, es geht keine Anfrage an Google.
- **Das Angebot steht über der Kante:** der Haupt-Knopf endet gemessen bei 547 px, also weit vor
  den 900 px eines normalen Laptop-Fensters. Auf 375x667 ist er ebenfalls ohne Scrollen sichtbar.
- **Nichts ragt seitlich heraus**, gemessen auf 375, 768 und 1440 px, und zwar Element für Element.
  Vorher gab es dort einen echten Fehler: Angaben wie `width:40ch` erzwangen in Grid-Spalten eine
  Spalte breiter als das Fenster, und `overflow-x:clip` hat den abgeschnittenen Text nur versteckt.
- **Bewegung nur als Einblendung** beim Scrollen, und `prefers-reduced-motion` schaltet sie ab,
  in beide Richtungen live.
- **0 Konsolenfehler.** Formular prüft leere Pflichtfelder und zeigt die Danke-Zeile.
- Der Aufbau-Regler ist mit Tastatur bedienbar und hat ein verstecktes Label.
