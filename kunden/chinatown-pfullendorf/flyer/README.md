# Flyer – China Restaurant Chinatown (Pfullendorf)

Druckfertiger A5-Flyer (Vorder- + Rückseite), Farbwelt **Rot/Schwarz/Gold** mit goldener
Winkekatze (als Vektor → im Druck gestochen scharf). Aufbau nach den Recherche-Learnings zu
verkaufsoptimierten Restaurant-Flyern: Front = Catcher + EIN Angebot + CTA, Rückseite = Appetit
(kuratierte Gerichte, kein voller Karten-Abdruck) + Gutschein + Fakten.

## Dateien

**A5-Flyer (einfach, Vorder-/Rückseite):**
- `index.html` — Quelle · `chinatown-flyer-A5.pdf` — druckfertig · `preview-seite1/2.png` — Vorschau.

**Faltflyer (DIN A4, Wickelfalz → DL, durchgehend dunkel, ALLE Gerichte):**
- `faltflyer.html` — Quelle · `chinatown-faltflyer-A4.pdf` — druckfertig · `fold-aussen/innen.png` — Vorschau.
- Druck: **beidseitig, A4 quer, an kurzer Kante wenden**, danach **2× falzen (Wickelfalz)**.
  Front = Cover (Chinatown + Katze), aufgeklappt = komplette Speisekarte (Nr. 1–69),
  Innenflügel = Mittagskarte (M1–M18), Rückseite = Kontakt/Zeiten/Buffet.

## Neu rendern (nach Änderungen an index.html)
Chromium/Playwright vorhanden. Rendert PDF + Vorschau:
`node ../../../scratchpad/render.cjs "$PWD"` (Skript im Scratchpad; bei Bedarf neu erzeugen).

## ⚠️ Vom Inhaber (Fam. Mau) noch freizugeben
- **Angebots-Aufhänger Front:** „Mittagsmenü ab 7,50 €" (basiert auf echter Karte M1–M18).
- **Gutschein Rückseite:** „1× Frühlingsrolle gratis zu jedem Hauptgericht, gültig bis 30.09.2026"
  → Platzhalter. Datum/Bedingung/Art des Angebots mit dem Kunden abstimmen.
- **Preise** aus der aktuellen Karte übernommen — vor Druck gegen die Tagespreise prüfen.

## Offene To-dos für die finale Version
- Echtes Food-Foto der knusprigen Ente einbinden (stärkstes Trust-/Appetit-Element).
- Ggf. QR-Code (Google-Profil/Reservierung) auf der Rückseite.
