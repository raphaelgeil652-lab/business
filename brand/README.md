# CCG — Logo / Bildmarke

Erste Entwicklungsstufe des Logos aus der Handskizze (Doppel‑C + G, handschriftlich).
Reines **Bildzeichen** (Signet) — die Wortmarke folgt nach der Namensfindung.

Übersicht ansehen: **`brand-board.html`** im Browser öffnen (Markenboard mit allen
Fassungen, Konstruktion, Schutzraum, Farben, Anwendungen).

## Konzept

Die linke Form ist ein **Doppel‑C** (zwei verschachtelte Bögen, „Echo"), die fließend
in ein **G** übergeht (Ring mit Querbalken + nach oben laufendem Häkchen). Ein
durchgehender, kalligrafischer Strich (dick/dünn wie mit der Breitfeder) hält den
handgezeichneten Ursprung fest. Die runde, offene Geste steht für **Fluss** — den
Lauf der Leads durch das System und das Wasser‑Motiv von Bad & Küche.

Konstruiert aus drei Kreisen auf einer gemeinsamen Grundlinie → stabile Proportionen
vom Briefkopf bis zum Favicon.

## Dateien (`logo/`)

| Datei | Zweck |
|---|---|
| `ccg-primary.svg` | **Hauptlogo** — kalligrafisch, Petrol. Standard für die meisten Anwendungen. |
| `ccg-calligraphic.svg` | Master der Hauptfassung, erbt die Farbe (`currentColor`) — für flexibles Einfärben. |
| `ccg-duo.svg` | Zweifarbig: CC in Petrol, G in Messing. |
| `ccg-monoline.svg` | Gleichmäßige Linie (`currentColor`) — Web-UI, mittlere/kleine Größen. |
| `ccg-bold.svg` | Kräftige Linie (`currentColor`) — sehr kleine Anwendungen. |
| `ccg-black.svg` / `ccg-white.svg` | Ein­farbig Schwarz bzw. Weiß (Negativ, Druck, Fax, Stempel). |
| `ccg-badge-petrol.svg` / `ccg-badge-ink.svg` | Signet im abgerundeten Kachel — Avatar, App‑Icon, Social‑Profil. |
| `favicon.svg` | Vereinfachtes, kräftiges Signet für 16–64 px (Browser-Tab). |
| `ccg-construction.svg` | Konstruktions­raster (nur zur Doku). |

`currentColor`‑Dateien nehmen die CSS‑`color` des umgebenden Elements an — praktisch
zum Einfärben in Petrol, Weiß oder Anthrazit ohne neue Datei.

## Farben

| Rolle | Name | HEX |
|---|---|---|
| Primär | Petrol | `#0E3A43` |
| Akzent | Messing | `#B07A3C` |
| Text / Neutral | Anthrazit | `#14181A` |
| Grund | Off‑White | `#F4F1EC` |

## Regeln

**Richtig:** Schutzraum einhalten (ringsum ≥ Höhe des C); nur die definierten Farben;
auf kontrastreichem Grund; passende Fassung zur Größe wählen (ab ~20 px `ccg-bold`,
Browser‑Tab `favicon`).

**Vermeiden:** verzerren/schräg stellen; eigene Farben oder Verläufe; Schatten/Outline;
auf unruhigem Foto ohne ruhige Fläche.

## Später: Wortmarke ergänzen

Sobald der Agenturname steht, wird eine Wortmarke rechts neben oder unter das Signet
gesetzt (Lockup). Empfehlung: ruhige, humanistische Serifen‑ oder Grotesk‑Schrift,
Petrol oder Anthrazit, Zeichenhöhe ≈ Wortmarken‑Versalhöhe. Das Signet bleibt
unverändert und funktioniert weiter allein (Favicon, Avatar).

## Neu erzeugen

Die SVGs sind generiert (präzise Kreis­bögen). Quelle: `scripts/gen_logo.py`
(Zeichen → `logo/`) und `scripts/build_board.py` (Markenboard). Zum Ändern die
Geometrie‑Konstanten oben in `gen_logo.py` (Radien, Winkel, Feder­winkel `NIB`)
anpassen und neu ausgeben:

```bash
python3 brand/scripts/gen_logo.py      # erzeugt alle SVGs in brand/logo/
python3 brand/scripts/build_board.py   # baut brand/brand-board.html neu
```
