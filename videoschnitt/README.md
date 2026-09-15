# Videoschnitt per Code

Hier werden Videos **geschrieben statt geschnitten**: Schnitte, Zooms, Untertitel und
Motion Graphics stehen als Code in einer Datei, und daraus wird eine fertige MP4-Datei
gerendert. Grundlage ist [Remotion](https://www.remotion.dev).

Gedacht für zwei Sachen:

1. **Kurzvideos** aus einem Rohvideo (Handyaufnahme) — für Reels, TikTok, Shorts.
2. **Werbeclips** für Meta und Google, ganz ohne Rohmaterial, nur aus Text und Bewegung.

---

## Was wirklich geht — und was nicht

Ein TikTok-Video hat behauptet, Claude schneidet dein Video ab jetzt selbstständig.
Das stimmt ungefähr zur Hälfte. Ehrlich aufgeteilt:

**Das geht wirklich:**
- Rohvideo abtippen lassen, Wort für Wort mit Zeitstempel (auf Deutsch)
- Pausen und Versprecher rausschneiden
- Langsame Zooms auf jeden Ausschnitt
- Untertitel im Kurzvideo-Stil, das gesprochene Wort farbig
- Große Texte, Logos, Balken, Zahlen, animierte Grafiken
- Alles in 1080 × 1920, fertig zum Hochladen

**Das geht nicht:**
- Claude *sieht* das Video nicht und *hört* es nicht. Die Entscheidungen kommen aus
  dem Transkript und aus dem, was du dazu sagst.
- „Maximale Viralität per Knopfdruck" gibt es nicht. Der Schnittplan ist eine
  Entscheidung, keine Zauberei. Er wird gut, wenn das Rohmaterial gut ist.
- Rendern dauert. Ein 60-Sekunden-Video braucht auf einem normalen Rechner ein paar
  Minuten.

---

## Der Ablauf in vier Schritten

**Schritt 1 — einmalig einrichten**

```bash
cd videoschnitt/projekt
npm install
```

**Schritt 2 — Rohvideo ablegen**

Die Aufnahme als `videoschnitt/projekt/public/roh.mp4` speichern.
Videodateien werden bewusst **nicht** mit ins Repo eingecheckt.

**Schritt 3 — abtippen lassen**

```bash
npm run transkribieren -- public/roh.mp4
```

Das schreibt zwei Dateien:
- `public/untertitel.json` — die Untertitel fürs Video
- `arbeitsdateien/transkript.txt` — zum Lesen, mit Zeiten und markierten Pausen

Beim ersten Mal lädt das Werkzeug Whisper herunter (etwa 150 MB). Danach geht es schnell.
Genauer wird es mit `MODELL=small` oder `MODELL=medium` davor — dauert dann länger.

**Schritt 4 — Schnittplan schreiben und rendern**

Der Schnittplan steht in `projekt/src/schnitt.ts`. Danach:

```bash
npm run kurzvideo     # fertiges Video -> ausgabe/kurzvideo.mp4
npm run werbeclip     # Werbeclip      -> ausgabe/werbeclip.mp4
npm start             # Vorschau im Browser, mit Zeitleiste zum Durchklicken
```

---

## Die eine Datei, die sich pro Video ändert

`projekt/src/schnitt.ts`. Ein Ausschnitt sieht so aus:

```ts
{von: 12.4, bis: 18.0, zoom: [1.0, 1.15], text: 'Das kostet dich Kunden'}
```

Gelesen: *nimm die Sekunden 12,4 bis 18,0 aus dem Rohvideo, fahre dabei langsam
näher ran und blende oben diesen Text ein.* Mehrere Ausschnitte hintereinander
ergeben den Schnitt. Was nicht aufgelistet ist, fliegt raus.

Die Untertitel rutschen automatisch mit: Sobald etwas rausgeschnitten wird,
stimmen die Originalzeiten nicht mehr — das rechnet `src/untertitel.ts` um.

Alles andere bleibt über alle Videos gleich. **Gleiches Prinzip wie bei den
Service-Modulen: Gerüst bleibt, nur der Inhalt wird getauscht.**

---

## Was drin liegt

```
videoschnitt/
  README.md                    diese Datei
  projekt/
    src/schnitt.ts             der Schnittplan — die Datei, die sich ändert
    src/Kurzvideo.tsx          das geschnittene Kurzvideo
    src/Werbeclip.tsx          Werbeclip für Meta/Google, ohne Rohmaterial
    src/untertitel.ts          rechnet die Wortzeiten auf den Schnitt um
    src/schriften.ts           lädt die Schriften aus public/fonts/
    src/komponenten/           Clip (Zoom), Untertitel, Hook-Text
    werkzeuge/transkribieren.mjs   Video -> Untertitel + Transkript
    werkzeuge/rendern.sh           rendert eine Komposition zu MP4
    public/fonts/              Archivo Black + Hanken Grotesk, selbst gehostet
```

Die Schriften liegen wie bei den Webseiten **selbst gehostet** im Projekt.
Es geht kein Aufruf zu Google Fonts raus.

---

## Der Werbeclip

`npm run werbeclip` rendert einen 15-Sekunden-Clip im Hochformat:
Hook → Vorher/Nachher → Angebot → Abschluss mit Knopf, dazu ein Fortschrittsbalken.
Die Texte stehen in `src/Werbeclip.tsx` unter `werbeclipStandard` und werden pro
Kunde getauscht (Betrieb, Ort, Leistung, Angebot).

**Die Bildflächen sind sichtbare Platzhalter.** Da gehören die echten
Vorher/Nachher-Fotos des Betriebs rein — das stärkste Vertrauenselement der Branche.
Erfundene Bilder kommen hier nicht rein, gleiche Regel wie bei den echten Kundenseiten.

---

## Zum Plugin

Es gibt ein offizielles Remotion-Plugin für Claude Code:

```bash
claude plugin marketplace add remotion-dev/claude-code-plugin
claude plugin install remotion@remotion
```

**Nötig ist es nicht.** Remotion ist ein normales npm-Paket — dieses Projekt hier
funktioniert ohne Plugin. Das Plugin bringt zusätzliches Remotion-Wissen mit,
mehr nicht.

---

## Lizenz

Remotion ist **kostenlos für Einzelpersonen und Firmen bis 3 Mitarbeiter**, auch
kommerziell. Ab einer größeren Firma wird eine Firmenlizenz fällig.
Für Clickculture in der jetzigen Größe: kostenlos.
Nachlesen: <https://www.remotion.dev/license>

---

## Stand

Aufgesetzt und getestet: Rendern läuft, Untertitel werden erzeugt, der Werbeclip
ist fertig gerendert worden. **Noch kein echtes Rohvideo verarbeitet** — dafür fehlt
eine eigene Aufnahme.
