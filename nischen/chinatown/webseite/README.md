# 🏮 Webseite – China Restaurant Chinatown, Pfullendorf

<p align="center">
  <a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fraphaelgeil652-lab%2Fbusiness&root-directory=nischen%2Fchinatown%2Fwebseite&project-name=chinatown-pfullendorf&repository-name=chinatown-pfullendorf">
    <img alt="Website live schalten" src="https://img.shields.io/badge/Website%20live%20schalten-mit%20Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white">
  </a>
</p>

<p align="center">
  <em>Ein Klick auf den Button lädt die Seite zu Vercel hoch und veröffentlicht sie.<br>
  Danach die Live-Adresse hier eintragen:</em> <code>[noch nicht veröffentlicht]</code>
</p>

---

Statische Seite aus reinem HTML/CSS — kein Framework, kein Baukasten, kein Build-Schritt.
Läuft auf jedem Webspace und verursacht keine laufenden Lizenzkosten.

**Die Seite hat genau ein Ziel: den Anruf.** Reservierung, Abholung und Rückfragen laufen bei
Chinatown ausschließlich telefonisch — also führt jeder Abschnitt dorthin, und auf dem Handy
liegt dauerhaft eine Anrufleiste in der Daumenzone.

## Seiten

| Datei | Inhalt |
|---|---|
| `index.html` | Startseite: Hero, Buffet, Mittagskarte, Familie Mau, Galerie |
| `speisekarte.html` | komplette Karte — 69 Gerichte + 18 Mittagsmenüs |
| `kontakt.html` | Öffnungszeiten, Adresse, Anfahrt |
| `impressum.html` | Anbieterkennzeichnung — **noch auszufüllen** |
| `datenschutz.html` | Datenschutzerklärung — **vor Livegang prüfen** |

Dazu `style.css`, `script.js`, `assets/` (Bilder, Schriften) und `tools/` (Hilfsskripte).

## Was die Seite besonders macht

- **Live-Öffnungsstatus.** Oben steht „Jetzt geöffnet · bis 23:00 Uhr" bzw. „Montag Ruhetag ·
  morgen ab 11:30 Uhr" — berechnet aus der echten Uhrzeit in Europe/Berlin, nicht aus der des
  Besuchers. Genau daran scheitern die widersprüchlichen Fremdeinträge im Netz.
- **Strukturierte Daten** (`ChineseRestaurant`): Adresse, Telefon und Öffnungszeiten
  maschinenlesbar, damit Google die richtigen Werte übernimmt.
- **Speisekarte kommt aus dem Flyer** — eine Quelle für Druck und Web, siehe unten.
- **Keine Cookies, kein Tracking, keine externen Schriften.** Dadurch ist kein Cookie-Banner
  nötig und die Datenschutzerklärung bleibt kurz.
- **Bildsprache des Faltflyers** — dunkler Lack, China-Rot, Gold, dieselben Schriften.

## Auf Vercel veröffentlichen

**Variante A — Button oben.** Ein Klick, fertig.

**Variante B — Projekt selbst anlegen (Änderungen gehen automatisch live):**
1. Auf vercel.com „Add New… → Project" und dieses Repository auswählen.
2. **Root Directory** auf `nischen/chinatown/webseite` setzen — sonst findet Vercel die Seite nicht.
3. Framework Preset **Other**, Build Command und Output Directory leer lassen.

**Variante C — Kommandozeile:**
```bash
npm i -g vercel
cd nischen/chinatown/webseite
vercel --prod
```

`vercel.json` setzt saubere URLs (`/speisekarte` statt `/speisekarte.html`),
Sicherheits-Header und Caching. `.vercelignore` hält `tools/` und diese README heraus.

### Eigene Domain
In Vercel unter *Settings → Domains* eintragen und die angezeigten DNS-Einträge beim
Domain-Anbieter hinterlegen. HTTPS macht Vercel automatisch.

## Speisekarte pflegen

Preise **nicht** in `speisekarte.html` ändern — sie werden aus dem gedruckten Faltflyer
übernommen, damit Karte und Webseite nicht auseinanderlaufen:

```bash
# 1. Gericht/Preis in ../flyer/faltflyer.html ändern
# 2. dann:
cd tools && python3 speisekarte-uebernehmen.py
```

Das Skript bricht ab, wenn nicht genau 69 Gerichte und 18 Mittagsmenüs herauskommen.

## Weitere Skripte

```bash
python3 tools/bilder-holen.py      # lädt lizenzfreie Übergangsbilder (CC0) nach assets/fotos
node tools/screenshots.cjs "$(pwd)"  # Vorschaubilder, Desktop + Handy
sh tools/deploy-paket.sh           # ZIP mit genau den auslieferbaren Dateien
```

## ⚠️ Vor dem Livegang zwingend erledigen

1. **Impressum ausfüllen.** Alles in `impressum.html`, was rot umrandet ist: vollständiger
   Name des Inhabers, Rechtsform, E-Mail-Adresse, ggf. USt-IdNr., zuständige Behörde.
   Ein unvollständiges Impressum ist abmahnfähig.
2. **Datenschutzerklärung prüfen.** Der Text passt zur Seite, wie sie jetzt ist. Kommt später
   ein Kontaktformular, Google Maps oder Statistik dazu, muss er erweitert werden. Beim
   Hosting über Vercel (USA) die Grundlage der Drittlandübermittlung eintragen.
3. **Öffnungszeiten bestätigen lassen.** Hier steht 23:00 Uhr nach Angabe des Kunden — der
   *bisherige Papierflyer* nennt dagegen 22:00 Uhr. Das muss Fam. Mau klären, es betrifft
   auch den neuen Flyer.
4. **Google-Unternehmensprofil anlegen** und die widersprüchlichen Fremdeinträge
   (Gelbe Seiten, 11880, Yelp, golocal) korrigieren.

## Bilder

Die aktuellen Fotos sind **Übergangsbilder** aus frei lizenzierten Quellen (CC0 / Public
Domain über Openverse, Nachweis in `assets/fotos/BILDNACHWEIS.json`). Sie dürfen kommerziell
genutzt werden und brauchen keine Namensnennung.

**Echte Fotos aus dem Restaurant wirken deutlich stärker** — sobald Fam. Mau welche liefert,
hier ersetzen:

| Datei | Motiv |
|---|---|
| `assets/fotos/gastraum.webp` | Gastraum, quer — trägt die ganze Startseite |
| `assets/fotos/buffet.webp` | aufgebautes Buffet |
| `assets/fotos/kueche.webp` | hochkant; hier gehört idealerweise das **Familienfoto** hin |
| `assets/fotos/*.webp` | die sechs Galeriebilder |

Vor dem Einbauen als **WebP** speichern, max. ~1600 px breit.
**Keine Fotos aus fremden Portalen** (Yelp, golocal, RestaurantGuru) verwenden — urheberrechtlich
geschützt und ein klassischer Abmahnfall.
