# Webseite – China Restaurant Chinatown (Pfullendorf)

Statische Seite aus reinem HTML/CSS, ohne Framework und ohne Baukasten. Läuft auf jedem
Webspace, verursacht keine laufenden Lizenzkosten und lädt schnell.

**Die Seite hat genau ein Ziel: den Anruf.** Reservierung, Abholung und Rückfragen laufen bei
Chinatown ausschließlich telefonisch — also führt jeder Abschnitt dorthin, und auf dem Handy
liegt dauerhaft eine Anrufleiste in der Daumenzone.

## Dateien

    index.html        Startseite
    speisekarte.html  komplette Karte (69 Gerichte + 18 Mittagsmenüs)
    kontakt.html      Öffnungszeiten, Adresse, Anfahrt
    style.css         gemeinsames Stylesheet aller drei Seiten
    script.js         Öffnungsstatus, Navigation, Einblendungen
    assets/           Winkekatze, Drache, Schriften
    tools/            Hilfsskripte (siehe unten)

## Was die Seite besonders macht

- **Live-Öffnungsstatus.** Oben steht „Jetzt geöffnet · bis 23:00 Uhr" bzw. „Montag Ruhetag ·
  morgen ab 11:30 Uhr" — berechnet aus der echten Uhrzeit in Europe/Berlin, nicht aus der des
  Besuchers. Das ist genau der Punkt, an dem die Fremdeinträge im Netz versagen.
- **Strukturierte Daten** (`ChineseRestaurant` in `index.html`): Adresse, Telefon und
  Öffnungszeiten maschinenlesbar, damit Google die richtigen Werte übernimmt.
- **Speisekarte kommt aus dem Flyer.** Eine Quelle für Druck und Web, siehe unten.
- **Bildsprache des Faltflyers** — dunkler Lack, China-Rot, Gold, dieselben Schriften.
  Print und Web wirken als eine Marke.

## Speisekarte pflegen

Preise und Gerichte **nicht** in `speisekarte.html` ändern. Sie werden aus dem gedruckten
Faltflyer übernommen, damit Karte und Webseite nicht auseinanderlaufen:

```bash
# 1. Gericht/Preis in ../flyer/faltflyer.html ändern
# 2. dann:
cd tools && python3 speisekarte-uebernehmen.py
```

Das Skript bricht ab, wenn nicht genau 69 Gerichte und 18 Mittagsmenüs herauskommen — so
fällt ein Fehler auf, bevor er auf der Seite landet.

## Screenshots erzeugen

```bash
node tools/screenshots.cjs "$(pwd)"   # -> tools/_shots/ (Desktop + Handy, alle Seiten)
```

## Auf Vercel veröffentlichen

Die Seite ist statisch — es gibt **keinen Build-Schritt**. `vercel.json` liegt bei und setzt
saubere URLs (`/speisekarte` statt `/speisekarte.html`), Sicherheits-Header und Caching
(Bilder und Schriften ein Jahr, HTML immer frisch).

**Variante A — aus diesem Repo (empfohlen, weil Änderungen automatisch live gehen):**
1. Auf vercel.com „Add New… → Project" und dieses Repository auswählen.
2. **Root Directory** auf `kunden/chinatown-pfullendorf/webseite` setzen — das ist der
   entscheidende Schritt, sonst findet Vercel die Seite nicht.
3. Framework Preset: **Other**. Build Command und Output Directory leer lassen.
4. Deploy. Jeder Push auf den Branch veröffentlicht danach automatisch.

**Variante B — ohne Repo (Ordner hochladen):**
Den Ordnerinhalt (bzw. das ZIP aus `tools/deploy-paket.sh`) auf vercel.com/new ziehen.
Wichtig: die Dateien müssen **direkt** im Wurzelverzeichnis liegen, nicht in einem Unterordner.

**Variante C — Kommandozeile:**
```bash
npm i -g vercel
cd kunden/chinatown-pfullendorf/webseite
vercel            # Vorschau-Adresse
vercel --prod     # endgültig veröffentlichen
```

`.vercelignore` sorgt dafür, dass `tools/` und diese README nicht mit hochgeladen werden.

### Eigene Domain
Sobald Fam. Mau eine Domain hat: in Vercel unter *Settings → Domains* eintragen und die dort
angezeigten DNS-Einträge beim Domain-Anbieter hinterlegen. HTTPS macht Vercel automatisch.

## ⚠️ Vor dem Livegang zwingend erledigen

1. **Impressum und Datenschutzerklärung** ergänzen — in Deutschland Pflicht, aktuell steht
   nur ein Hinweis im Fußbereich. Ohne beides nicht online stellen.
2. **Fotos einsetzen** (siehe unten). Bis dahin stehen überall beschriftete Platzhalter.
3. **Öffnungszeiten bestätigen lassen.** Hier steht 23:00 Uhr nach Angabe des Kunden — der
   *bisherige Papierflyer* nennt dagegen 22:00 Uhr. Das muss Fam. Mau klären, es betrifft
   auch unseren neuen Flyer.
4. **Google-Unternehmensprofil anlegen** und die widersprüchlichen Fremdeinträge
   (Gelbe Seiten, 11880, Yelp, golocal) auf die richtigen Zeiten korrigieren.
5. Domain registrieren.

## Fotos einsetzen

Jeder Platzhalter ist im HTML als solcher beschriftet und trägt daneben einen Kommentar mit
dem fertigen Ersetzungs-Code. Benötigt werden:

| Stelle | Bild |
|---|---|
| Hero (Startseite) | Gastraum, quer, warmes Licht — trägt die ganze Seite |
| Buffet | aufgebautes Buffet, schräg von oben |
| Familie Mau | Familienfoto, hochkant — das wichtigste Vertrauensbild |
| Galerie (6×) | Knusprige Ente · Gastraum · Buffet-Detail · Wok · gedeckter Tisch · Außenansicht |

Vor dem Einbauen als **WebP** speichern und auf max. ~1600 px Breite bringen — ein
unkomprimiertes Handyfoto kostet mehr Gäste, als ein schönes Bild bringt.

**Keine Fotos aus fremden Portalen** (Yelp, golocal, RestaurantGuru) verwenden: urheberrechtlich
geschützt und in Deutschland ein klassischer Abmahnfall.

## Aktuelles Seitengewicht

Startseite rund 376 KB inklusive Schriften, Winkekatze, CSS und JavaScript. Beim Einsetzen der
echten Fotos darauf achten, dass die Startseite unter etwa 1 MB bleibt.
