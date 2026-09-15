# Rezepte

Fertige Abläufe für die Fälle, die immer wiederkommen.

---

## 1. Talking Head für TikTok/Reels

Eine Aufnahme, jemand redet in die Kamera, 15–60 Sekunden Rohmaterial.

```bash
cp ~/Downloads/IMG_1234.mov public/roh.mov
MODELL=medium npm run transkribieren -- public/roh.mov
cat ../arbeitsdateien/transkript.txt          # lesen! daraus kommt der Hook
TEMPO=schnell LOOK=kino SCHLEIFE=an \
  HOOK="<der stärkste Satz aus dem Transkript, umformuliert als Versprechen>" \
  NAME="Raffi" ROLLE="Clickculture" \
  npm run schnittplan -- public/roh.mov
```

Dann von Hand in `src/daten/schnittplan.json`:

- Schnitte auf Betonungen schieben, nicht auf gleichmäßige Abstände
- `stichwort` auf die zwei stärksten Wörter
- `zahl`, wenn er aufzählt
- Rahmenfolge prüfen: nie zweimal derselbe hintereinander

```bash
npm run kurzvideo
```

Abnahme, dann abliefern.

---

## 2. Vlog

Mehrere Clips, Musik, Ortskarten.

```bash
mkdir -p public/vlog && cp ~/Downloads/vlog/*.mov public/vlog/
cp ~/Musik/track.mp3 public/musik.mp3
PROCLIP=2 SZENE=2.6 LOOK=warm npm run vlogplan
```

Dann von Hand:

- Erste Szene: `titel` setzen (Ort · Uhrzeit)
- Übergänge variieren — nicht jeder Wechsel braucht einen Effekt, `hart` gehört dazu
- Bei Bewegung im Bild: `whip` in Bewegungsrichtung
- Bei Ortswechsel: `zoom` oder `weissblitz`
- Szenen mit dem stärksten Bild länger stehen lassen (4–6 s), Action kurz (1–2 s)

```bash
npm run vlog
```

---

## 3. Werbeclip für einen Kfz-Betrieb

Ohne Rohmaterial, reine Motion Graphics.

Texte in `src/Werbeclip.tsx` tauschen: Betrieb, Ort, Leistung, Angebot, CTA.
Das Angebot kommt aus `nischen/autowerkstaetten/service-module.md` — das passende
Modul wählen, nicht neu erfinden.

```bash
npm run werbeclip
```

**Bildflächen bleiben sichtbare Platzhalter**, bis echte Vorher/Nachher-Fotos des
Betriebs da sind. Keine Stockbilder, keine KI-Bilder von fremden Autos.

---

## 4. Kundenvideo (echtes Unternehmen)

Gleicher Ablauf wie Talking Head, aber:

- `LOOK=natuerlich` oder `kalt` — kein Kinolook auf einem Handwerksbetrieb
- Kein `stichwort` mit Werbesprache, die der Betrieb nicht halten kann
- Keine erfundenen Zahlen in Grafiken
- Kein Abspann mit fremdem Logo

---

## 5. Der Nutzer will einen Stil, den es nicht gibt

Er sagt „mach das im Stil von X". Dann:

1. Frag nach einem Beispiel oder beschreib, was du daraus liest
2. Leg den Look in `src/looks.ts` an — Filter, Farbebenen, Körnung, Vignette
3. Render eine Probe von 3 Sekunden, zieh ein Bild, zeig es ihm
4. Erst wenn er ja sagt, das ganze Video

Nie das ganze Video in einem unbestätigten Stil rendern.
