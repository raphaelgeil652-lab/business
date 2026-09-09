# 🌿 Alex Außenanlagen, Pfullendorf

Webseite für **Alex Stadelmann**: Garten- und Außenanlagen, Bagger- und Erdarbeiten,
Pflasterarbeiten im Raum Pfullendorf.

Beim Scrollen sinkt die Kamera über einem Garten herab und kommt dicht an der Kante zur Ruhe,
wo die Platte an die Bepflanzung stößt. Darunter beginnt die echte Seite.

**Der Film ist das Hauptelement der Seite.** Über dem Bild liegt kein Schleier, es läuft in voller
Farbe durch. Vier Textmomente sitzen darauf, jeder auf einem eigenen dunklen Schild, statt das Bild
für sie aufzuhellen. Zwischen den Schildern läuft die Fahrt ohne Einblendung weiter.

Gebaut nach dem Ablauf aus dem Skill `10k-websites`.

---

## ▶ Zum Zeigen

| Was | Öffnen |
|---|---|
| 🌿 **Die komplette Seite** — Scroll-Fahrt, der Aufbau-Schnitt zum Ziehen, Leistungen, Fragen, Kontaktformular. | **[▶ Seite öffnen](https://raw.githack.com/raphaelgeil652-lab/business/main/nischen/alex-aussenanlagen/seite/index.html)** |

> Der Knopf liefert immer den aktuellen Stand aus `main`. Wenn die Seite alt aussieht, einmal hart neu laden.

> **Wichtig zum Zeigen:** langsam nach unten scrollen. Die Fahrt hängt am Scrollen, sie läuft nicht
> von allein. **Auf dem Handy** siehst du bewusst ein Standbild statt der Fahrt, das hält die Seite
> dort schnell.

**Der Knopf zeigt jetzt direkt auf die echte Seite**, nicht mehr auf eine heruntergerechnete
Vorschau-Datei. Du siehst also genau das, was online gehen würde, in voller Schärfe. Die
Einzelbilder wiegen zusammen 12 MB und laden hinter dem Ladering nach, während die Seite schon
benutzbar ist. Erst wenn der Ring leer ist, ist die Fahrt vollständig.

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
| `arbeitsdateien/` | Startbilder, Einzelbilder aus dem Film, Prüfbilder aus dem Selbsttest. Rohvideo bleibt lokal. |
| `design-paket.md` | Der komplette Plan, geschrieben **vor** der ersten Generierung: Marken-Idee, Farben, Schriften, jeder Text. |

---

## Was die Seite technisch kann

- **Der Hero ist eine Bildfolge auf einer Zeichenfläche**, kein Video. Grund ist eine Messung aus
  dem vorigen Projekt: bei einem Video muss der Browser für jede Scrollposition neu hinspringen,
  dabei kamen nur 4 bis 10 Bilder pro Sekunde an. Zwischen zwei Einzelbildern wird überblendet.
  Gemessen kalt und ohne Zwischenspeicher: **80 verschiedene Bildzustände auf 80 mögliche
  Scrollpositionen**, die Fahrt folgt dem Scrollen also eins zu eins.
- **Die Bilder werden vorgewärmt.** Ein Bild zum ersten Mal zu zeichnen kostet das Entpacken,
  gemessen **14,6 ms**; dasselbe Bild danach **0 ms**. Bei 60 Bildern pro Sekunde stehen 16,7 ms
  zur Verfügung, ausgerechnet die *erste* Fahrt wäre also abgehackt gewesen. Deshalb zeichnet die
  Seite nach dem Laden jedes Bild einmal, solange du noch oben stehst.
- **Auflösung:** 1440 px pro Einzelbild, aus einem 1934-px-Original. Vorher waren es 1000 px, und
  in der Vorschau-Datei sogar nur 820 px, was auf einem breiten Fenster sichtbar verpixelt war.
- **Die Fahrt ist lang:** 900vh Scrollweg.
- **Die Landung ist gebaut, nicht gefilmt.** Der Generator ließ die Kamera bis zum Schluss gleich
  schnell fahren. Deshalb bremst die Steuerung: das letzte Viertel Scrollweg verlangsamt
  gleichmäßig bis zum Stillstand.
- **Kein Filter über dem Bild.** Weder ein aufhellender Schleier noch eine Vignette. Der Text
  bringt seinen Kontrast über sein eigenes dunkles Schild mit, und die Navigation über eine
  schmale dunkle Leiste, die nur über dem Film erscheint.
- **Gewicht:** die Seite selbst wiegt gut 1 MB inklusive Schriften und aller Abschnittsbilder.
  Die Bildfolge wiegt 12 MB und lädt hinter dem Ladering nach. Handys laden sie nie.
- Schriften liegen im Projekt, es geht keine Anfrage an Google.
- Ohne die Bildfolge ist die Seite trotzdem vollständig.
- **Lesbarkeit gemessen, nicht geschätzt:** helle Schrift auf dunklem Schild, also zählt das
  hellste Pixel unter dem Text.

  | | Überschrift | Fließtext | betontes Wort |
  |---|---|---|---|
  | Schild 1 | 13,7 | 12,0 | 6,5 |
  | Schild 2 | 13,6 | 11,9 | 6,5 |
  | Schild 3 | 13,2 | 11,6 | 6,3 |
  | Schild 4 | 11,3 | 9,9 | 5,4 |
  | Handy | 11,2 | | |

  Die Navigation über dem Film liegt zwischen 5,5 und 13,3. Der Boden ist 3,5.
