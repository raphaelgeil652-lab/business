# Videoschnitt per Code

Hier werden Videos **geschrieben statt geschnitten**. Du legst eine Aufnahme ab,
startest einen Befehl — und bekommst ein fertiges Hochkantvideo mit Schnitten,
Zooms und Untertiteln zurück. Grundlage ist [Remotion](https://www.remotion.dev).

Gedacht für zwei Sachen:

1. **Kurzvideos** aus einer Handyaufnahme — für Reels, TikTok, Shorts.
2. **Werbeclips** für Meta und Google, ganz ohne Rohmaterial, nur aus Text und Bewegung.

---

## Der eine Befehl

```bash
cd videoschnitt/projekt
npm install                              # nur beim allerersten Mal
npm run schneiden -- public/roh.mp4
```

Das läuft dann von allein durch:

| Schritt | Was passiert |
|---|---|
| 1. Abtippen | Der Ton wird Wort für Wort mit Zeitstempel mitgeschrieben (Deutsch). |
| 2. Schnitt planen | Jede Sprechpause ab 0,45 s fliegt raus. Lange Stücke werden an Wortgrenzen geteilt, damit der Zoom wechselt. |
| 3. Rendern | Fertige Datei in `ausgabe/kurzvideo.mp4`. |

Am Ende steht da, wie viel weg ist — zum Beispiel:
`17 Ausschnitte · bleibt 43,0 s · rausgenommen 4,2 s Pausen (9 %)`

**Mit Hook oben im Bild:**

```bash
HOOK="3 Fehler, die dich Kunden kosten" npm run schneiden -- public/roh.mp4
```

---

## Stellschrauben

Einfach vor den Befehl setzen. Ohne Angabe gilt der Wert in Klammern.

| Schraube | Bedeutung |
|---|---|
| `PAUSE=0.6` | Ab welcher Stille geschnitten wird, in Sekunden (0.45). Größer = ruhiger. |
| `MAXSTUECK=3` | Wie lang ein Ausschnitt höchstens wird, bevor geteilt wird (3.5). Kleiner = hektischer. |
| `LUFT=0.2` | Wie viel Ruhe an jedem Schnittrand bleibt (0.12). Zu klein klingt abgehackt. |
| `HOOK="…"` | Großer Text über dem ersten Ausschnitt (leer). |
| `AKZENT="#ff0000"` | Farbe für Untertitel-Wort, Balken und Grafiken (`#ffd60a`). |
| `NAME="Raffi"` | Namensschild, das am Anfang von links reinfährt (leer). |
| `ROLLE="Clickculture"` | Unterzeile im Namensschild (leer). |
| `OUTRO="Clickculture"` | Abspann-Karte am Ende (leer). |
| `OUTROZEILE="…"` | Unterzeile im Abspann (leer). |
| `MODELL=small` | Genauigkeit beim Abtippen: `base` schnell, `small` besser, `medium` am besten (`small`). |

---

## Einzelne Schritte

Wenn du nicht alles auf einmal willst:

```bash
npm run transkribieren -- public/roh.mp4   # nur abtippen
npm run schnittplan -- public/roh.mp4      # nur den Schnitt planen
npm run kurzvideo                          # nur rendern
npm run werbeclip                          # den Werbeclip rendern
npm start                                  # Vorschau im Browser, mit Zeitleiste
npm run pruefen                            # prüft den Code auf Fehler
```

`npm start` ist der ehrlichste Weg: Du siehst das Video im Browser, ziehst durch
die Zeitleiste und siehst jede Änderung sofort, ohne auf das Rendern zu warten.

---

## Nachbessern von Hand

Der geplante Schnitt steht in `projekt/src/daten/schnittplan.json`. Ein Ausschnitt
sieht so aus:

```json
{"von": 12.4, "bis": 18.0, "zoom": [1.0, 1.15], "text": "Das kostet dich Kunden"}
```

Gelesen: *nimm die Sekunden 12,4 bis 18,0 aus dem Rohvideo, fahre dabei langsam
näher ran und blende oben diesen Text ein.* Du kannst Zeilen löschen, Zeiten
verschieben, Texte ergänzen — danach `npm run kurzvideo`.

**Achtung:** Ein neuer Lauf von `npm run schneiden` überschreibt die Datei wieder.
Wenn du von Hand nachgebessert hast, danach nur noch `npm run kurzvideo` benutzen.

Die Untertitel rutschen automatisch mit: Sobald etwas rausgeschnitten wird,
stimmen die Originalzeiten nicht mehr — das rechnet `src/untertitel.ts` um.

---

## Motion Graphics

Fünf Bausteine liegen bereit. Sie stehen in `schnittplan.json` unter `grafiken`,
die Zeiten zählen dabei im **fertigen** Video, nicht im Rohvideo.

| Baustein | Was es ist |
|---|---|
| `titelband` | Band oben im Bild mit Thema und Unterzeile. Fährt von links rein. |
| `namensschild` | Klassischer Lower Third — Name und Firma, fährt rein und wieder raus. |
| `stichwort` | Ein Wort knallt groß ins Bild. Für die Pointe. Sitzt unter dem Gesicht, nicht auf den Augen. |
| `blitz` | Kurzer Wisch in der Akzentfarbe. Macht einen Schnitt sichtbar. |
| `fortschritt` | Dünner Balken ganz unten, der mitläuft. |

Dazu die Abspann-Karte `outro` — dunkle Fläche, Name, Strich, Unterzeile.

So sieht das aus:

```json
"grafiken": [
  {"art": "fortschritt", "von": 0, "bis": 11.5},
  {"art": "titelband", "von": 0.2, "bis": 2.5, "text": "Thema", "unterzeile": "Unterzeile"},
  {"art": "namensschild", "von": 0.8, "bis": 3.2, "text": "Name", "unterzeile": "Firma"},
  {"art": "blitz", "von": 3.5, "bis": 3.72},
  {"art": "stichwort", "von": 9.5, "bis": 10.4, "text": "Pointe"}
],
"outro": {"dauer": 1.4, "text": "Clickculture", "unterzeile": "Videoschnitt per Code"}
```

**Automatisch gesetzt** werden Fortschrittsbalken und ein Wisch auf jedem Schnitt.
Namensschild und Abspann kommen dazu, wenn du `NAME=` und `OUTRO=` mitgibst.
Titelband und Stichwort setzt man von Hand — die hängen am Inhalt, den kennt
das Werkzeug nicht.

Neue Bausteine kommen in `src/komponenten/Grafiken.tsx` dazu.

---

## Was das Werkzeug kann — und was nicht

**Das geht wirklich** (alles hier getestet, nicht behauptet):
- Pausen und Stille automatisch rausschneiden
- Punch-in-Schnitte mit wechselnden Zooms
- Untertitel im Kurzvideo-Stil, das gesprochene Wort farbig
- Großer Hook-Text, animierte Grafiken, Balken, Zahlen
- Maße und Bildrate werden aus dem Rohvideo übernommen
- Handyvideos (`.mov` vom iPhone) werden richtig gedreht — sie liegen in der
  Datei quer und würden sonst als Querformat rauskommen
- Motion Graphics: Titelband, Namensschild, Stichwort, Wisch, Balken, Abspann

**Das geht nicht:**
- Claude *sieht* und *hört* das Video nicht. Die Entscheidungen kommen aus dem
  Transkript — deshalb die Stellschrauben oben.
- „Maximale Viralität per Knopfdruck" gibt es nicht. Ein gutes Video braucht
  gutes Rohmaterial und einen guten Hook. Das Werkzeug spart die Fleißarbeit,
  nicht das Denken.
- Rendern dauert. Rechne mit etwa einer Minute pro Minute Video.
- Das Abtippen ist nicht perfekt. Mit `MODELL=base` gibt es Fehler bei Namen und
  Fachwörtern. Vor dem Hochladen einmal `arbeitsdateien/transkript.txt` überfliegen.

---

## Der Werbeclip

`npm run werbeclip` rendert einen 15-Sekunden-Clip im Hochformat:
Hook → Vorher/Nachher → Angebot → Abschluss mit Knopf, dazu ein Fortschrittsbalken.
Die Texte stehen in `src/Werbeclip.tsx` unter `werbeclipStandard` und werden pro
Kunde getauscht (Betrieb, Ort, Leistung, Angebot).

**Die Bildflächen sind sichtbare Platzhalter.** Da gehören die echten
Vorher/Nachher-Fotos des Betriebs rein — das stärkste Vertrauenselement der Branche
(siehe `nischen/autowerkstaetten/service-module.md`). Erfundene Bilder kommen hier
nicht rein, gleiche Regel wie bei den echten Kundenseiten.

---

## Was wo liegt

```
videoschnitt/
  README.md                        diese Datei
  projekt/
    src/daten/schnittplan.json     der geplante Schnitt (wird erzeugt)
    src/daten/untertitel.json      die Wörter mit Zeiten (wird erzeugt)
    src/schnitt.ts                 liest beides ein
    src/Kurzvideo.tsx              das geschnittene Kurzvideo
    src/Werbeclip.tsx              Werbeclip für Meta/Google
    src/untertitel.ts              rechnet Wortzeiten auf den Schnitt um
    src/komponenten/               Clip (Zoom), Untertitel, Hook-Text
    src/komponenten/Grafiken.tsx   die Motion-Graphics-Bausteine
    src/komponenten/Outro.tsx      die Abspann-Karte
    werkzeuge/schneiden.mjs        der eine Befehl, der alles macht
    werkzeuge/transkribieren.mjs   Ton -> Wörter mit Zeiten
    werkzeuge/schnittplan.mjs      Pausen raus, Zooms setzen
    werkzeuge/rendern.sh           rendert zu MP4
    public/roh.mp4                 deine Aufnahme (nicht im Repo)
    public/fonts/                  Schriften, selbst gehostet
    ausgabe/                       fertige Videos (nicht im Repo)
  arbeitsdateien/transkript.txt    zum Lesen, mit Zeiten und Pausen
```

Videodateien werden bewusst **nicht** eingecheckt — sie sind groß und ändern sich
ständig. Die Schriften liegen wie bei den Webseiten **selbst gehostet** im Projekt,
es geht kein Aufruf zu Google Fonts raus.

---

## Braucht es das Claude-Plugin?

Nein. Es gibt ein offizielles Remotion-Plugin für Claude Code
(`claude plugin marketplace add remotion-dev/claude-code-plugin`, dann
`claude plugin install remotion@remotion`, geht nur im Terminal auf dem eigenen
Rechner). Es bringt zusätzliches Remotion-Wissen mit, sonst nichts.
**Dieses Projekt läuft ohne Plugin.**

---

## Lizenz

Remotion ist **kostenlos für Einzelpersonen und Firmen bis 3 Mitarbeiter**, auch
kommerziell. Ab einer größeren Firma wird eine Firmenlizenz fällig.
Für Clickculture in der jetzigen Größe: kostenlos.
Nachlesen: <https://www.remotion.dev/license>

---

## Stand

Läuft und ist an echtem Material durchgetestet:

- 47 s TikTok → 43 s Schnitt, 17 Ausschnitte, Untertitel im Takt
- 8 s iPhone-Aufnahme (hochkant, `.mov`) → 5 Ausschnitte von Hand nachgeschärft,
  Füllwort „Ähm" raus, Titelband, Namensschild, Stichwort, Abspann
- Werbeclip rendert ohne Rohmaterial

**Offen:** Ein längeres, echtes Verkaufsvideo — erst daran zeigt sich, ob die
Voreinstellungen für `PAUSE` und `MAXSTUECK` passen.
