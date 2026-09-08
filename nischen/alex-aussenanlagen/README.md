# 🌿 Alex Außenanlagen, Pfullendorf

Webseite für **Alex Stadelmann**: Garten- und Außenanlagen, Bagger- und Erdarbeiten,
Pflasterarbeiten im Raum Pfullendorf.

Beim Scrollen sinkt die Kamera über einem Garten herab und kommt dicht an der Kante zur Ruhe,
wo die Platte an die Bepflanzung stößt. Darunter beginnt die echte Seite.

Gebaut nach dem Ablauf aus dem Skill `10k-websites`.

---

## ▶ Zum Zeigen

| Was | Öffnen |
|---|---|
| 🌿 **Die komplette Seite** — Scroll-Fahrt, der Aufbau-Schnitt zum Ziehen, Leistungen, Fragen, Kontaktformular. | **[▶ Seite öffnen](https://raw.githack.com/raphaelgeil652-lab/business/main/nischen/alex-aussenanlagen/vorschau/alex-komplett.html)** |

> Der Knopf liefert immer den aktuellen Stand aus `main`. Wenn die Seite alt aussieht, einmal hart neu laden.

> **Wichtig zum Zeigen:** langsam nach unten scrollen. Die Fahrt hängt am Scrollen, sie läuft nicht
> von allein. **Auf dem Handy** siehst du bewusst ein Standbild statt der Fahrt, das hält die Seite
> dort schnell.

Die Vorschau enthält alles eingebettet und läuft auch ohne Internet. 7,8 MB, das erste Öffnen
dauert einen Moment.

---

## ⚠ Was noch fehlt, bevor die Seite online darf

| Fehlt | Was solange auf der Seite steht |
|---|---|
| **Telefon, E-Mail, Anschrift** | sichtbarer Platzhalter im Footer. Das Formular zeigt nur seine Danke-Zeile und verschickt nichts. |
| **Impressum und Datenschutz** | Hinweis im Footer. Beides ist in Deutschland Pflicht. |
| **Echte Fotos** | Hinweis, dass Bilder und Fahrt KI-erzeugt sind. Sie sind als Platzhalter gedacht. |
| **Echte Kundenstimmen** | bewusst keine erfunden. Stattdessen drei Zusagen, die Alex selbst geben kann. |
| **Preise** | keine Zahlen auf der Seite. Die Frage nach dem Quadratmeterpreis wird ehrlich beantwortet, ohne eine Zahl zu behaupten. |

Nichts davon ist erfunden worden. Sobald Alex die Angaben schickt, sind es kleine Änderungen.

---

## Die Ordner

| Ordner | Was drin ist |
|---|---|
| `seite/` | **Die echte Webseite.** `index.html` plus `assets/`. Genau dieser Ordner geht online, nichts anderes. |
| `vorschau/` | Die eine Datei zum Herzeigen, erzeugt aus `seite/`. Geht nie mit online. |
| `tools/` | `vorschau-bauen.py` baut die Vorschau neu, nachdem sich die Seite geändert hat. |
| `arbeitsdateien/` | Startbilder, Einzelbilder aus dem Film, Prüfbilder aus dem Selbsttest. Rohvideo bleibt lokal. |
| `design-paket.md` | Der komplette Plan, geschrieben **vor** der ersten Generierung: Marken-Idee, Farben, Schriften, jeder Text. |

**Nach jeder Änderung an der Seite:**

```
python3 tools/vorschau-bauen.py
```

---

## Was die Seite technisch kann

- **Der Hero ist eine Bildfolge auf einer Zeichenfläche**, kein Video. Grund ist eine Messung aus
  dem vorigen Projekt: bei einem Video muss der Browser für jede Scrollposition neu hinspringen,
  dabei kamen nur 4 bis 10 Bilder pro Sekunde an. Eine Bildfolge kostet 0,01 Millisekunden pro Bild.
  Zwischen zwei Einzelbildern wird überblendet. Gemessen: **140 verschiedene Bildzustände in 142
  Bildschirm-Takten**.
- **Die Landung ist gebaut, nicht gefilmt.** Der Generator ließ die Kamera bis zum Schluss gleich
  schnell fahren. Deshalb bremst die Steuerung: das letzte Viertel Scrollweg verlangsamt
  gleichmäßig bis zum Stillstand.
- **Gewicht:** die Seite selbst wiegt gut 1 MB inklusive Schriften und aller Abschnittsbilder.
  Die Bildfolge wiegt 7,6 MB und lädt hinter dem Ladering nach, während die Seite schon benutzbar
  ist. Handys laden sie nie.
- Schriften liegen im Projekt, es geht keine Anfrage an Google.
- Ohne die Bildfolge ist die Seite trotzdem vollständig.
- **Lesbarkeit gemessen, nicht geschätzt:** dunkle Schrift auf hellem Bild, also zählt das
  dunkelste Pixel unter dem Text. Pro Band 7,5 · 7,6 · 7,6 · 7,4 zu 1, auf dem Handy 9,6.
  Der Boden liegt bei 3,5.
