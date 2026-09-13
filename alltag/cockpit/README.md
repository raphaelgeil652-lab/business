# Raphaels Cockpit

**[▶ Öffnen](https://claude.ai/code/artifact/e838cc49-d2f0-4e5e-92e9-c4d4f8650f00)**

Eine Seite, die **live** in Gmail und den Google Kalender schaut — nicht eine Momentaufnahme,
sondern bei jedem Öffnen der aktuelle Stand. Läuft als Artifact auf claude.ai, mit deinen
Zugangsdaten; die Seite selbst sieht keine Tokens.

## Was drauf steht

| Block | Woher |
|---|---|
| **Als Nächstes** | der nächste Termin aus dem Google Kalender |
| **Offene Schichtangebote** | aus den Sling-Mails gelesen, gefiltert auf die, die noch nicht im Kalender stehen. Je Angebot ein Knopf **Eintragen** |
| **Kalender · 14 Tage** | Google Kalender |
| **Posteingang · 48 h** | Gmail, sortiert in Sicherheit, Geld/Fristen, Schichten, Sonstiges, Werbung |

## Wie die Schichten erkannt werden

Sling schreibt in festen Formulierungen, die sich sauber auswerten lassen:

| Satz in der Mail | Bedeutung | Was passiert |
|---|---|---|
| `A new shift is available on … from … to …` | angeboten, noch nicht deins | erscheint als offenes Angebot |
| `You have a new shift on …` | dir zugeteilt | gilt nicht mehr als Angebot |
| `You were unassigned from your shift on …` | wieder abgesagt | hebt die Zuteilung auf |
| `5 new shifts are available` | Sammelmail ohne Details | wird ignoriert |

Das Datum kommt aus dem Link in der Mail (`&date 26-09-14`), nicht aus dem Monatsnamen — damit
gibt es zum Jahreswechsel keine Verwechslung. Bei „You have a new shift" steht nur die Startzeit
in der Mail; dort wird mit **2 Stunden** gerechnet und das in der Seite als `?` sichtbar gemacht.

## Grenzen, die du kennen solltest

- **Eintragen legt nur den Kalendertermin an.** Die Schicht in Sling übernehmen musst du in Sling.
  Die Seite kann das nicht und tut auch nicht so.
- **Nur Lesen, ein einziger Schreibzugriff.** Gelesen wird Gmail (Suche + Thread) und der Kalender.
  Geschrieben wird ausschließlich der Kalendertermin, und nur wenn du auf den Knopf drückst.
  Keine Mail wird gelöscht, archiviert oder verschickt.
- **Die Suche liefert pro Thread nur die ältesten Nachrichten.** Deshalb holt die Seite jeden
  Sling-Thread einzeln komplett nach — sonst fehlen die neuesten Schichten.
- **Doppelte Termine:** Vor dem Anlegen wird geprüft, ob zur selben Zeit schon ein Termin mit
  „Wakepark" oder „Schicht" im Kalender steht.
- Schlägt ein Aufruf fehl, betrifft das nur seinen Block — der Rest der Seite bleibt stehen,
  mit einer Meldung, die sagt, was zu tun ist (neu verbinden, hinzufügen, warten).

## Aktualisierung

Kalender und Posteingang alle 5 Minuten, Sling-Mails alle 10 Minuten — und immer beim Öffnen.
