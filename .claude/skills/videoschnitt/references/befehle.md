# Befehle und Stellschrauben

Alles aus dem Ordner `videoschnitt/projekt`.

---

## Einrichten (einmalig)

```bash
npm install
```

Die Klänge liegen schon im Repo. Neu bauen nur, wenn sie anders klingen sollen:

```bash
npm run klaenge        # braucht python3 mit numpy
```

---

## Kurzvideo (eine Aufnahme)

```bash
npm run transkribieren -- public/roh.mov   # Ton abtippen
npm run schnittplan -- public/roh.mov      # Schnitt planen
npm run kurzvideo                          # rendern
npm run schneiden -- public/roh.mov        # alle drei auf einmal
```

### Stellschrauben

| Schraube | Bedeutung | Standard |
|---|---|---|
| `MODELL` | `base` schnell · `small` gut · `medium` am besten | `small` |
| `TEMPO` | `ruhig` 4,0 s · `normal` 2,8 s · `schnell` 2,0 s pro Einstellung | `normal` |
| `MAXSTUECK` | eigener Wert statt Tempo | — |
| `PAUSE` | ab welcher Stille geschnitten wird | `0.45` |
| `LUFT` | Ruhe an jedem Schnittrand | `0.12` |
| `FUELLER` | `aus` lässt „ähm" stehen | `an` |
| `LOOK` | Farblook | `hart` |
| `HOOK` | großer Text über dem ersten Ausschnitt | leer |
| `NAME` / `ROLLE` | Namensschild | leer |
| `OUTRO` / `OUTROZEILE` | Abspann-Karte | leer |
| `SCHLEIFE` | `an` hängt den Anfang hinten an | aus |
| `KLANG` | `aus` schaltet Soundeffekte ab | `an` |
| `AKZENT` | Akzentfarbe | `#ffd60a` |
| `REIZ` | erlaubte Sekunden ohne neuen Reiz | `3` |
| `TON` | `aus` lässt die Lautstärke wie im Rohmaterial | `an` |
| `RAHMEN` | `1` blendet die sicheren Zonen ein | aus |

---

## Vlog (mehrere Aufnahmen)

Clips nach `public/vlog/` legen, Musik als `public/musik.mp3`.

```bash
npm run vlogplan       # Plan aus dem Ordner bauen
npm run vlog           # rendern
```

| Schraube | Bedeutung | Standard |
|---|---|---|
| `SZENE` | Länge einer Szene in Sekunden | `2.4` |
| `PROCLIP` | wie viele Szenen aus einer Aufnahme | `1` |
| `START` | Sekunden am Anfang jeder Aufnahme überspringen | `0.6` |
| `UEBERGANG` | fester Übergang statt Abwechslung | wechselnd |
| `LOOK` | Farblook | `warm` |
| `MUSIK` | Dateiname in `public/` | `musik.mp3` |
| `MUSIKLAUT` | Lautstärke der Musik | `0.22` |

---

## Werbeclip (ohne Rohmaterial)

```bash
npm run werbeclip
```

Texte in `src/Werbeclip.tsx` unter `werbeclipStandard`.

---

## Vorschau und Prüfen

```bash
npm start              # Browser mit Zeitleiste, ohne Rendern
npm run pruefen        # prüft den Code auf Fehler
```

Einzelbilder ziehen:

```bash
FF=$(python3 -c "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())")
$FF -v error -ss 3.2 -i ausgabe/kurzvideo.mp4 -frames:v 1 -vf scale=270:-1 /tmp/b.jpg
```

Lautstärke messen:

```bash
$FF -i ausgabe/kurzvideo.mp4 -af volumedetect -f null - 2>&1 | grep mean_volume
```
