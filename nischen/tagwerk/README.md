# ☕ Tagwerk — Demo-Webseite (Kaffeemarke)

**Kein Kunde, kein Auftrag.** Tagwerk ist eine erfundene Kaffeemarke, gebaut als **Vorzeige-Stück**
für den Webseitenbau: eine Seite, bei der das Scrollen einen Film abspielt. Du scrollst nach unten,
der Espresso läuft weiter in die Tasse, die Texte kommen daneben rein. Scrollst du hoch, läuft alles
rückwärts.

Gebaut nach dem Ablauf aus dem Skill `10k-websites`. Alles darin ist selbst erfunden: Name,
Geschäftsidee, Farben, Schriften, Texte, Film und Bilder.

---

## ▶ Zum Zeigen

| Was | Öffnen |
|---|---|
| ☕ **Die komplette Seite** — Scroll-Film, alle Abschnitte, der Frische-Regler zum Ziehen, Preise, Fragen, Formular. | **[▶ Seite öffnen](https://rawcdn.githack.com/raphaelgeil652-lab/business/main/nischen/tagwerk/vorschau/tagwerk-komplett.html)** |

> **Wichtig zum Zeigen:** langsam nach unten scrollen. Der Film ist an das Scrollen gekoppelt, er
> läuft nicht von allein. **Auf dem Handy** siehst du bewusst ein Standbild statt des Films, das
> hält die Seite dort schnell.

Die Vorschau-Datei enthält **alles eingebettet**: Film, Bilder, Schriften. Sie läuft deshalb auch
ohne Internet. Einmal öffnen, auf dem iPad über *Teilen → Zur Leseliste hinzufügen* sichern, dann
funktioniert sie beim Kundenbesuch auch im Funkloch. Sie ist 6,6 MB groß, das erste Öffnen dauert
einen Moment.

---

## Die Ordner

| Ordner | Was drin ist |
|---|---|
| `seite/` | **Die echte Webseite.** `index.html` plus `assets/`. Genau dieser Ordner geht online, nichts anderes. |
| `vorschau/` | Die eine Datei zum Herzeigen, erzeugt aus `seite/`. Geht nie mit online. |
| `tools/` | `vorschau-bauen.py` baut die Vorschau neu, nachdem sich die Seite geändert hat. |
| `arbeitsdateien/` | Startbilder, Einzelbilder aus dem Film, Prüf-Bilder. Rohvideo und große PNGs bleiben lokal. |
| `design-paket.md` | Der komplette Plan, der **vor** der ersten Generierung geschrieben wurde: Marken-Idee, Farben, Schriften, jeder Text, jedes Band im Hero. |

**Nach jeder Änderung an der Seite:**

```
python3 tools/vorschau-bauen.py
```

---

## Was die Seite technisch kann

- Der Film wird komplett geladen und dann vom Scrollen gesteuert, deshalb läuft das Scrubben auch
  auf Hostern, die keine Teil-Downloads können.
- **816 KB** für die ganze Seite inklusive Schriften und aller Bilder. Der Film kommt getrennt
  hinterher, während die Seite schon benutzbar ist.
- Schriften liegen im Projekt, es geht keine Anfrage an Google.
- Handys, Tablets im Hochformat und alle, die reduzierte Bewegung eingestellt haben, bekommen ein
  gestaltetes Standbild und laden den Film gar nicht erst.
- Ohne Film ist die Seite trotzdem vollständig.
- Der Text über dem Film wurde gemessen, nicht geschätzt: schlechtester Kontrast pro Band
  5,6 · 15,9 · 16,4 · 10,3 zu 1, auf dem Handy 4,66. Der Boden liegt bei 3,5.

## Das Formular

Es verschickt **nichts**. Es zeigt nur seine Danke-Zeile, und genau das steht auch klein darunter
auf der Seite. Für einen echten Kunden käme hier ein Formulardienst rein, damit die Anfrage
schriftlich ankommt.
