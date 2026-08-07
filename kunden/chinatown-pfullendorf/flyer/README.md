# Flyer – China Restaurant Chinatown (Pfullendorf)

Kunde: **China Restaurant Chinatown**, Inhaber Fam. Mau, Heiligenberger Str. 1, 88630 Pfullendorf,
Tel. 07552/6636. Di–So 11:30–14:30 & 17:30–22:00, Montag Ruhetag.

Zwei Stücke liegen hier: der **Faltflyer** (aktuelle Fassung, zum Vorzeigen beim Kunden) und ein
einfacher **A5-Flyer** aus dem ersten Entwurf.

---

## 1. Faltflyer — DIN A4, Wickelfalz *(die aktuelle Fassung)*

- `faltflyer.html` — Quelle
- `chinatown-faltflyer-A4.pdf` — **druckfertig**
- `fold-aussen.png`, `fold-innen.png` — Vorschau

**Aufbau** (6 Panels à 99 mm):

| | Außenseite | Innenseite (aufgeklappt) |
|---|---|---|
| links | Mittagskarte M1–M18 + Buffet | Vorspeisen 1–14 · Vegetarisch 15–22 · Nachtisch 64–69 |
| Mitte | Rückseite: Drache, Kontakt, Zeiten, Buffet | Fleisch 23–39 (Schwein/Rind/Huhn) · Ente 40–46 |
| rechts | **Cover**: Wortmarke + Winkekatze | Fisch 47–55 · Reis 56–58 · Nudeln 59–63 · Buffet |

**Gestaltung:** dunkle Basis wie das Restaurant, Rot als durchgehendes Akzentsystem
(Rahmen, alle Überschriften, Siegel 旺城), Gold für Wortmarke, Linien und Ornamente.
Wortmarke und **alle Überschriften in Pinselkalligrafie** (Ma Shan Zheng), Gerichte und Preise
in einer gut lesbaren Serifenlosen. Chinesische Zeichen in Noto Serif SC, zusätzlich große
Zeichen als Wasserzeichen hinter jedem Abschnitt.

**Drucken:** A4 **quer**, beidseitig, **an kurzer Kante wenden**, Hintergrundgrafiken aktivieren,
Ränder „Keine". Danach 2× falzen (Wickelfalz).

> Hinweis für die Druckerei: alle drei Panels sind exakt 99 mm breit. Beim echten Wickelfalz will
> die Druckerei das innen einrollende Panel meist 1–2 mm schmaler haben. Das ist eine Angabe, die
> die Druckerei fallabhängig macht — vor Auflagendruck kurz abstimmen.

---

## 2. A5-Flyer *(erster Entwurf, nicht weiterentwickelt)*

`index.html` · `chinatown-flyer-A5.pdf` · `preview-seite1.png` / `preview-seite2.png`.
Farb- und Schriftwelt entspricht **nicht** der aktuellen Fassung — bei Bedarf nachziehen.

---

## Assets & Regenerierung

    assets/
      winkekatze.png     freigestellte, goldgegradete Winkekatze (aus dem echten Foto)
      drache.svg         vektorisierter Drache (vom alten Papierflyer)
      fonts/             Ma Shan Zheng + Noto Serif SC (nur benötigte Glyphen)
      quellen/           Originalfotos: Winkekatze + alter Flyer (= Preis-Referenz)
      tools/             die Skripte, die die Assets erzeugen

Alle Skripte aus `assets/tools/` ausführen:

```bash
python3 cutout.py        # Foto -> _work/crop.png + _work/mask.png (GrabCut)
python3 grade.py         # _work -> assets/winkekatze.png (Goldgrading)
python3 dragon.py        # alter Flyer -> assets/drache.svg (Vektorisierung)
python3 fonts.py         # Font-Subsets -> assets/fonts/
python3 check-glyphs.py  # prüft, ob alle CJK-Zeichen im Subset sind
node render-fold.cjs "$(cd ../.. && pwd)"   # -> PDF + Vorschau-PNGs
```

**Nach jeder Änderung am HTML:** `check-glyphs.py` laufen lassen. Ein chinesisches Zeichen, das
nicht im Subset ist, fällt still auf einen Ersatzfont zurück und sieht im Druck falsch aus.

Die Winkekatze ist **ihre echte Figur aus dem Laden**, freigestellt und auf Gold gegradet —
im Verkaufsgespräch ein Argument für sich.

---

## ⚠️ Vor dem Druck mit Fam. Mau klären

- **Preise gegenprüfen.** Alle 69 Gerichte + 18 Mittagsmenüs sind 1:1 von der alten Karte
  übernommen (`assets/quellen/`), können aber inzwischen veraltet sein.
- **Buffetpreis 19,50 €** und die Mittagszeiten (Di–Sa bis 14:30) bestätigen lassen.
- Soll ein **Angebot/Gutschein** mit drauf? Aktuell bewusst keiner drin — der Faltflyer ist als
  Speisekarte angelegt, nicht als Aktionsflyer.

## Mögliche nächste Schritte

- **Echte Food-Fotos** (v. a. knusprige Ente) einbinden — das stärkste Appetit-Element und
  aktuell die größte Lücke.
- QR-Code (Google-Profil / Reservierung) auf der Rückseite.
