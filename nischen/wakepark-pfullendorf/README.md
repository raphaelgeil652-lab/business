# Wakepark Pfullendorf — Webseite

Webseite für den Wakepark Pfullendorf (Wasserskianlage am Seepark Linzgau).
Zielgruppe: Sportler von jung bis 60. Ziel: **Buchungen und Anfragen**.

**[▶ Seite öffnen](https://raw.githack.com/raphaelgeil652-lab/business/main/nischen/wakepark-pfullendorf/seite/index.html)**

## Aufbau

| Ordner | Was drin ist |
|---|---|
| `seite/` | **Das, was online geht.** `index.html` plus `assets/` (Bilder, Schriften). Sonst nichts. |
| `arbeitsdateien/` | Rohmaterial und Herkunftsnachweis. Bleibt lokal. |
| `design-paket.md` | Die Gestaltungsentscheidungen und warum sie so getroffen wurden. |

Kein Framework, kein Build-Schritt, kein Server. Eine HTML-Datei und ein Ordner. Zum Hochladen
reicht es, den Inhalt von `seite/` auf einen beliebigen Webspace zu legen.

## Die Seite von oben nach unten

1. **Kopfleiste** mit Logo, Navigation, Live-Anzeige „geöffnet oder zu" und dem Buchungsknopf.
2. **Hero** mit dem Gischt-Foto und der Kernaussage: drei Sekunden zwischen sitzen und stehen.
3. **Faktenleiste**: 5 Masten, Übungslift, 12 Hindernisse, ab 8 Jahren.
4. **Vorteile**: vier Gründe, warum Kabel einfacher ist als Boot.
5. **Angebot**: Zeitkarte, Anfängerkurs, Bahn exklusiv, Bananaboat, Verleih.
6. **Dein erster Tag**: vier Schritte vom Parkplatz aufs Wasser.
7. **Die Anlage**: Luftbild mit Markern und die Hindernisliste.
8. **Wer dahintersteht**: Betreiber und Team, darunter Platz für echte Gästestimmen.
9. **Preise und Zeiten**: Verleihpreise und der komplette Saisonkalender.
10. **Fragen**: acht Antworten auf die echten Einwände vor dem ersten Mal.
11. **Abschluss**: Buchungsknopf plus Formular für Kurs, Gruppe und Firmenevent.
12. **Fußzeile** mit Adresse, Telefon, E-Mail, Saison und Social.

Alles führt auf einen einzigen Hauptweg: **buchen**. Das Formular fängt nur die Fälle ab,
die nicht über den Onlineshop laufen.

## Was echt ist und was nicht

**Recherchiert und belegt** (Quellen in `design-paket.md`): Adresse, Telefonnummern, E-Mail,
Saisondaten, Öffnungszeiten je Monat, Verleihpreise, Hindernisse, 5-Mast-Anlage und Übungslift,
Buchung über Wakesys, Betreiberwechsel 2025, Ausstattung im Seepark.

**Bewusst nicht erfunden:** Es steht keine einzige Kundenstimme auf der Seite. Die drei
Stimmen-Felder sind sichtbar als Platzhalter markiert. Auch Zeitkarten-Preise stehen nirgends,
weil sie nicht öffentlich sind, dafür führt der Knopf ins Buchungssystem.

## Vor dem Livegang noch offen

- [ ] **Impressum und Datenschutzerklärung** ergänzen. Ohne die beiden darf die Seite in
      Deutschland nicht online.
- [ ] **Gästestimmen** einsetzen. Drei echte Zitate mit Vornamen reichen.
- [ ] **Öffnungszeiten und Verleihpreise** gegen den aktuellen Stand prüfen.
- [ ] **Bildrechte klären.** Fünf Fotos stammen vom Park, eins von cablemekka.com.
      Details in `arbeitsdateien/rohmaterial/HERKUNFT.md`.
- [ ] **Zwei Zeilen im Quelltext anpassen:** hinter dem Kommentar
      `BEIM LIVEGANG ERSETZEN` stehen `og:url` und `og:image`. Dort die echte Adresse eintragen,
      sonst zeigt die Vorschau beim Teilen in WhatsApp das falsche Bild.

## Technisches, kurz

- **Schriften liegen auf dem eigenen Server** (`assets/fonts/`), es geht kein Aufruf zu Google
  Fonts raus. In Deutschland wurde das eingebettete Laden schon abgemahnt, weil dabei die
  IP-Adresse des Besuchers an Google geht.
- **Erste Ladung rund 436 KB**, davon 228 KB das Hero-Foto. Der Rest wird erst beim Scrollen
  geholt.
- **Ohne JavaScript funktioniert die Seite vollständig.** Das FAQ klappt dann nativ auf.
- **Getestet** mit echtem Chrome bei 1440, 1280, 834, 390 und 360 Pixeln Breite: kein seitliches
  Scrollen, Konsole ohne Fehler, alle Bilder laden, Tap-Ziele mindestens 44 Pixel,
  kleinster gemessener Textkontrast 4,92:1.
- **Das Formular** baut eine fertige E-Mail an `booking@wakepark-pfullendorf.de` und öffnet das
  Mailprogramm des Besuchers. Für echten Live-Betrieb wäre ein Formulardienst wie Formspree der
  nächste Schritt, dann landet die Anfrage direkt im Postfach.

## Lokal ansehen

```
cd seite
python3 -m http.server 8777
```

Dann `http://localhost:8777` im Browser öffnen.
