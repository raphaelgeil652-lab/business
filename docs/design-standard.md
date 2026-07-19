# Design-Standard für Websites (Homepages)

**Wichtige Abgrenzung:** Dieser Standard gilt für die volle **Website/Homepage** eines Kunden — nicht für Landingpages. Landingpages folgen weiterhin `docs/playbook-landingpages-ads.md`: kurz, ein Service, ein CTA, keine Ablenkung, weil sie Ads-Traffic mit konkreter Absicht auffangen. Die Homepage dagegen ist das, was Besucher organisch/über Google Maps/Mundpropaganda finden — die darf und soll bildstark, modern und anspruchsvoll sein, mit mehreren Abschnitten (Studio/Team, Angebot, Preise, Kontakt).

Grund für den Standard überhaupt: generische KI-Designs (immer Inter-Schrift, immer derselbe lila-blaue Verlauf, immer drei gleiche abgerundete Karten) wirken flach und ohne Wow-Effekt. Recherche + Anthropics eigenes Cookbook zu "Prompting for frontend aesthetics" zeigen, warum das passiert und wie man es vermeidet.

## Warum KI-Design oft gleich aussieht

Ein KI-Modell gibt bei vager Anfrage den statistischen Durchschnitt seiner Trainingsdaten zurück — und dieser Durchschnitt hat ein Gesicht: Inter-Schrift, zentrierter Hero, drei gleiche abgerundete Karten, lila-blauer Verlauf. Das ist kein Zufall, sondern Mittelwertbildung. Gegenmittel: bewusst von diesem Mittelwert wegsteuern, nicht dem ersten Impuls folgen.

## Verbindliche Prinzipien für Homepages

1. **Nie Inter/Roboto/Arial als einzige Schrift.** Jede Website bekommt eine bewusst gewählte, zur Branche passende Schriftpaarung mit Charakter (Display-Schrift + Grotesk/Humanist-Sans) — nicht dieselbe Kombination für alle vier Nischen. Echte Web-Fonts (Google Fonts) sind für echte Kundenseiten völlig in Ordnung, mit robustem System-Font-Fallback falls sie nicht laden.
2. **Kein Standard-Verlauf/-Farbschema.** Farbpalette pro Branche bewusst herleiten, nicht das erste naheliegende Schema übernehmen (kein Klinik-Blau, kein Creme+Terrakotta, kein lila-blauer SaaS-Verlauf).
3. **Echte Bilder, keine Lorem-Platzhalter.** Homepages leben von Bildsprache — lizenzfreie, thematisch passende Fotografie (z. B. Unsplash, vor dem Einbinden auf tatsächlichen Bildinhalt prüfen, nicht blind Bild-IDs verwenden), bis echte Kundenfotos verfügbar sind.
4. **Ein orchestrierter Eintritts-Moment statt verstreuter Effekte.** Der Hero-Bereich bekommt eine gestaffelte Eintritts-Animation (Headline, Text, CTA nacheinander) plus eine dezente Bewegung (Bild-Zoom, Gradient-Mesh o. ä.). Das ist der Ort für den "Wow-Effekt" — nicht zehn kleine Spielereien über die ganze Seite verteilt.
5. **Asymmetrische statt gleichförmige Layouts.** Drei exakt gleiche Karten nebeneinander wirken sofort nach Vorlage. Stattdessen Bento-Grids (eine größere, hervorgehobene Kachel + kleinere daneben) oder andere bewusste Asymmetrie — auch bei Bildergalerien/Kursplänen.
6. **Hover-/Bewegungstiefe auf interaktiven Elementen.** Karten, Bilder und Buttons reagieren beim Hover (Anheben, Schatten, leichtes Zoomen), damit die Seite lebendig statt statisch wirkt.
7. **Zurückhaltung trotzdem Pflicht — aber als bewusste Entscheidung, nicht als Verbot.** Glassmorphismus, 3D-Mockups oder Dark-Mode-First sind nicht per se falsch, aber nur einsetzen, wenn es zur Marke passt (z. B. dunkle, kontrastreiche Optik für ein Fitnessstudio — passt zur Energie der Branche), nicht weil es gerade Trend ist. Referenzpunkt für "Wow ohne Kitsch": reduziertes, tadelloses Interface-Design (z. B. die Design-Sprache von Emil Kowalski/Vercel-Umfeld) — hohe Sorgfalt in Typografie/Spacing/Bewegung statt Effekthascherei.
8. **Bewegung immer mit `prefers-reduced-motion`-Rücksicht.** Jede Animation braucht eine Reduced-Motion-Alternative (sofort sichtbar statt animiert).

## Verschärfung (nach Feedback): Verbotene Muster

Die erste Generation der Homepages fiel trotz eigener Farben/Schriften als "KI-Website" auf, weil alle dasselbe **Skelett** teilten. Der Wiedererkennungswert von KI-Design liegt nicht in der Farbe, sondern in der Struktur. Deshalb ab sofort verboten:

- **Label-über-Überschrift-Muster in jeder Sektion** (kleines Uppercase-Label mit Strich + H2 + Absatz, endlos wiederholt). Sektionseinstiege müssen variieren.
- **Gleichförmige Karten-Grids** (3 gleiche abgerundete Boxen nebeneinander) — für Leistungen/Preise stattdessen große editoriale Zeilen, Vollbild-Reihen oder asymmetrische Collagen.
- **Pillen-Buttons überall** — Buttons dürfen eckig/kantig sein; Form ist eine Markenentscheidung.
- **Einheitliche runde Ecken auf allem** — Bilder dürfen hart an Viewport-Kanten stoßen, Vollbild laufen, überlappen.
- **Gleiches Sektions-Raster mit identischem Padding-Rhythmus** — Größenkontraste einbauen: riesige Typo neben kleiner, Vollbild neben Weißraum.

Stattdessen verbindlich: **editoriale Layouts** — Vollbild-Bilder, überlappende Ebenen, große Serifentypo mit Kursiv-Akzenten oder Condensed-Display, Preislisten als große Zeilen mit Hover-Invert, geteilte Kontakt-Sektionen (Bild + Infotabelle), Sticky-Mobile-Leiste mit Anruf + Termin. Animationen clean und wenige: Zeilen-Aufstieg im Hero (`translateY` + `overflow: hidden`), Clip-Reveals auf Bildern, Hover-Invert auf Preiszeilen. Alles dient **einem** Konversionsziel (Termin/Probetraining).

## Aktueller Stand der Vorlagen (Referenz-Generation)

- **`templates/friseur-website/`** — Instrument Serif + Archivo; Papier/Espresso/Bronze; Vollbild-Hero mit zeilenweisem Typo-Aufstieg, Statement mit überlappendem Bild, asymmetrische Arbeits-Collage, dunkle Preiszeilen mit Bronze-Hover-Invert, geteilte Kontakt-Sektion.
- **`templates/beautysalon-website/`** — Fraunces (kursiv-Akzente) + Outfit; Porzellan/Pflaume/Lackrot; Split-Hero mit randabfallendem Bild + Überlappung, Behandlungen als nummerierte Großzeilen mit Bild/Preis/Dauer, Pflaumen-Statement-Band, ehrlicher Vorher-Nachher-Platzhalter (niemals Stockfotos als Ergebnisse!).
- **`templates/fitnessstudio-website/`** — Bebas Neue + Manrope; Kohle/Knochen/Signalorange; Vollbild-Hero mit Riesen-Typo, Zahlenband mit Linienraster, Bereiche als alternierende Vollbild-Zeilen, helle Preiszeilen mit Dunkel-Hover-Invert. `showcase.html` daneben = bewusst übertriebene Effekt-Demo, kein Kundentemplate.
- **`templates/zahnarzt-landingpage/`** — bleibt bewusst schlanke Ads-Landingpage (Playbook-Regeln), keine Homepage-Behandlung.

## Für neue Vorlagen

Jede neue Homepage bekommt einen eigenen kurzen Design-Plan (Farbpalette als 4-6 benannte Werte, Schriftpaarung, Layout-Idee in 1-2 Sätzen) **vor** dem Bauen — nie das Skelett einer bestehenden Vorlage kopieren, auch nicht das der Referenz-Generation. Farben aus der Bildwelt/dem Produkt der Branche ableiten (z. B. Lackrot aus der Nagellack-Bildwelt, Bronze aus dem warmen Barbershop-Licht).
