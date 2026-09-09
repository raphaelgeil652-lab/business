# 🌿 Alex Außenanlagen, Pfullendorf

Webseite für **Alex Stadelmann**: Garten- und Außenanlagen, Bagger- und Erdarbeiten,
Pflasterarbeiten im Raum Pfullendorf.

Beim Scrollen sinkt die Kamera über einem Garten herab und kommt dicht an der Kante zur Ruhe,
wo die Platte an die Bepflanzung stößt. Darunter beginnt die echte Seite.

**Der Film ist das Hauptelement der Seite.** Über dem Bild liegt kein Schleier, es läuft in voller
Farbe durch, und es gibt nur zwei Textmomente: einen beim Einstieg und einen, wenn die Fahrt steht.
Dazwischen ist nichts eingeblendet. Der Text sitzt jeweils auf einem eigenen dunklen Schild, statt
das Bild für ihn aufzuhellen.

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

Die Vorschau enthält alles eingebettet und läuft auch ohne Internet. 8,0 MB. Das erste Öffnen
dauert gemessen rund 15 bis 20 Sekunden, bis alle Einzelbilder entpackt sind. Der Ladering unten
zeigt den Fortschritt. Solange er noch läuft, wirkt die Fahrt stockend, danach nicht mehr.

---

## ⚠ Was noch fehlt, bevor die Seite online darf

| Fehlt | Was solange auf der Seite steht |
|---|---|
| **Telefon, E-Mail, Anschrift** | sichtbarer Platzhalter im Footer. Das Formular zeigt nur seine Danke-Zeile und verschickt nichts. |
| **Impressum und Datenschutz** | Hinweis im Footer. Beides ist in Deutschland Pflicht. |
| **Echte Fotos** | Hinweis, dass Bilder und Fahrt KI-erzeugt sind. Sie sind als Platzhalter gedacht. |
| **Echte Kundenstimmen** | bewusst keine erfunden. Stattdessen drei Zusagen über dem Formular, die Alex selbst geben kann. |
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
  Zwischen zwei Einzelbildern wird überblendet. Gemessen: **149 verschiedene Bildzustände in 151
  Bildschirm-Takten**.
- **Die Fahrt ist lang:** 900vh Scrollweg. Sie ist nicht nach ein paar Wischern vorbei, sondern
  trägt die halbe Seite.
- **Die Landung ist gebaut, nicht gefilmt.** Der Generator ließ die Kamera bis zum Schluss gleich
  schnell fahren. Deshalb bremst die Steuerung: das letzte Viertel Scrollweg verlangsamt
  gleichmäßig bis zum Stillstand.
- **Kein Filter über dem Bild.** Weder ein aufhellender Schleier noch eine Vignette. Der Text
  bringt seinen Kontrast über sein eigenes dunkles Schild mit, und die Navigation über eine
  schmale dunkle Leiste, die nur über dem Film erscheint.
- **Gewicht:** die Seite selbst wiegt gut 1 MB inklusive Schriften und aller Abschnittsbilder.
  Die Bildfolge wiegt 7,6 MB und lädt hinter dem Ladering nach, während die Seite schon benutzbar
  ist. Handys laden sie nie.
- Schriften liegen im Projekt, es geht keine Anfrage an Google.
- Ohne die Bildfolge ist die Seite trotzdem vollständig.
- **Lesbarkeit gemessen, nicht geschätzt:** helle Schrift auf dunklem Schild, also zählt das
  hellste Pixel unter dem Text. Schild 1: 13,7 zu 1 (Überschrift) und 12,0 (Fließtext),
  Schild 2: 11,3 und 9,9, auf dem Handy 11,2. Die Navigation über dem Film liegt zwischen
  5,5 und 13,3. Der Boden ist 3,5.
