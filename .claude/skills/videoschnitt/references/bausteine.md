# Bausteine

Alles, was zur Verfügung steht, mit den Werten, die im Code stehen.

---

## Bildausschnitte (`rahmen`)

Der Wechsel zwischen ihnen lässt einen Schnitt wie eine zweite Kamera aussehen.
Definiert in `src/komponenten/Clip.tsx`.

| Name | Zoom | Versatz | Wofür |
|---|---|---|---|
| `weit` | 1,00 | — | Grundeinstellung, zeigt die Umgebung |
| `nah` | 1,28 | leicht hoch | Standard-Punch-in |
| `nah-links` | 1,30 | nach rechts geschoben | wirkt wie eine Kamera von links |
| `nah-rechts` | 1,30 | nach links geschoben | Gegenstück dazu |
| `kopf` | 1,55 | stark hoch | Großaufnahme, für die Pointe |

**Regel:** Zwei gleiche Rahmen nebeneinander = Bildsprung. Immer wechseln.

---

## Farblooks (`look`)

Definiert in `src/looks.ts`. Neuen Look anlegen: dort einen Eintrag ergänzen.

| Name | Wirkung | Wofür |
|---|---|---|
| `natuerlich` | nur leicht angehoben | wenn es echt wirken muss |
| `hart` | Kontrast 1,22 · Sättigung 1,28 | TikTok-Standard |
| `kino` | türkise Schatten, warme Haut | Gesichter, Talking Head |
| `warm` | Abendsonne | draußen, Sommer |
| `kalt` | sachlich, leicht blau | Werkstatt, Technik, Kfz |
| `vintage` | ausgewaschen, körnig | Erinnerungen, Rückblick |
| `nacht` | blau, harte Tiefen | dunkle Aufnahmen |
| `schwarzweiss` | harter Kontrast | Stilmittel, sparsam |

Jeder Look bringt Filter, Farbebenen, Körnung und Vignette mit.

---

## Motion Graphics (`grafiken`)

Definiert in `src/komponenten/Grafiken.tsx`. Zeiten zählen im **fertigen** Video.

| Art | Was es ist | Wann |
|---|---|---|
| `titelband` | Band oben mit Thema und Unterzeile | der Hook, Sekunde 0,15 |
| `namensschild` | Lower Third, fährt von links rein | einmal am Anfang |
| `stichwort` | ein Wort knallt groß ins Bild | Pointe, Betonung |
| `zahl` | große Ziffer oben rechts | Aufzählungen, „1 von 3" |
| `pfeil` | Pfeil, der wippt (`richtung`) | zeigt auf etwas im Bild |
| `blitz` | Wisch in der Akzentfarbe | auf einem Schnitt |
| `fortschritt` | dünner Balken unten | durchgehend |
| `ortskarte` | Ort und Uhrzeit unten links (nur Vlog) | Szenenwechsel |

Beispiel:

```json
{"art": "stichwort", "von": 6.85, "bis": 7.5, "text": "Der Shit"}
{"art": "zahl", "von": 3.0, "bis": 5.2, "text": "1", "unterzeile": "von 3"}
{"art": "pfeil", "von": 5.6, "bis": 6.6, "richtung": "unten"}
```

---

## Soundeffekte (`klaenge`)

Selbst gebaut mit `werkzeuge/klaenge-bauen.py`, liegen in `public/klang/`.
Definiert in `src/komponenten/Klang.tsx`.

| Name | Klang | Wann | Standard-Lautstärke |
|---|---|---|---|
| `whoosh` | kurzes Rauschen, fährt durch | auf jedem Schnitt | 0,5 |
| `whoosh-lang` | länger, abfallend | auf weichen Übergängen | 0,45 |
| `impact` | trockener Schlag | Hook, harte Aussage | 0,55 |
| `pop` | kurzes Ploppen | Grafik springt auf | 0,4 |
| `klick` | Tick | kleine Einblendung | 0,35 |
| `riser` | steigt an, wird heller | 1 s vor der Pointe | 0,4 |
| `bass` | tiefer Abfall | Schlusspunkt | 0,5 |

Der Whoosh startet **0,08 s vor** dem Schnitt, sonst kommt er zu spät an.

---

## Übergänge (nur Vlog)

Definiert in `src/Vlog.tsx` und `src/komponenten/uebergaenge.tsx`.

**Laufen überall:**

| Name | Wirkung |
|---|---|
| `hart` | Schnitt ohne Effekt — nicht jeder Wechsel braucht einen |
| `whip` | Bild wird zur Seite gerissen, unscharf. Der Vlog-Standard |
| `zoom` | alte Aufnahme fährt weg, neue kommt von vorn |
| `weissblitz` | kurz überstrahlen. Einmal pro Video reicht |
| `blende` | weiches Überblenden |
| `wisch` | Kante fährt durch |
| `schieben` | Bild schiebt das andere raus |
| `uhr` | Uhrzeigersinn |
| `zugschnitt` | harter Schub |

**Brauchen Chrome 148+ mit aktivierter HTML-in-Canvas-Flagge** (sonst bricht das
Rendern ab): `shader-unschaerfe`, `shader-zoom`, `shader-traum`. Das sind Remotions
eigene Shader-Übergänge — schöner, aber nicht überall lauffähig.

---

## Sichere Zonen

Definiert in `src/sicherheitszonen.ts`.

| Rand | Anteil | bei 1080×1920 |
|---|---|---|
| oben | 6 % | 115 px |
| unten | 23 % | 442 px |
| links | 6 % | 65 px |
| rechts | 17 % | 184 px |

Prüfen: `RAHMEN=1 npm run kurzvideo` — rot ist das, was die App überdeckt.
