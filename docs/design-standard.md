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

## Konkret umgesetzt in `templates/zahnarzt-landingpage/`

Bleibt eine Landingpage (ein Service, ein CTA) — bekam nur maßvolle Auffrischung, keine Homepage-Behandlung:
- Schriftpaarung: **Fraunces** (Display, warm, Charakter) + **Work Sans** (Fließtext) statt System-Serif/Inter.
- Hero: dezentes Gradient-Mesh im Hintergrund + gestaffelte Eintritts-Animation der Hero-Elemente.
- Benefits-Sektion: Bento-Grid statt drei gleicher Karten.

## Konkret umgesetzt in `templates/fitnessstudio-website/` (volle Homepage)

- Schriftpaarung: **Bebas Neue** (kräftige, athletische Display-Schrift) + **Manrope** (Fließtext) — bewusst anders als beim Zahnarzt, passend zur energischen Branche.
- Farbwelt: dunkles Kohle-Marine statt reinem Schwarz, Amber/Gold als Hauptakzent, Petrol als Zweitakzent — bewusste Abweichung von der "Fast-Schwarz + Neongrün/Vermillion"-KI-Klischeekombination.
- Echte Unsplash-Trainingsfotos (Hero, Studio, Kursplan, Testimonial) statt Icons/Illustrationen.
- Hero: Vollbild-Foto mit langsamem Zoom-Effekt + gestaffelter Text-Einblendung.
- Kursplan als Bento-Bildgrid (eine große Kachel + zwei kleinere), Hover-Zoom auf den Bildern.
- Dark-Mode-First als bewusste Markenentscheidung (passt zur Foto-Stimmung/Energie), nicht als Standardwert.

## Für zukünftige Vorlagen (Beauty, Friseur)

Jede neue Homepage bekommt einen eigenen kurzen Design-Plan (Farbpalette als 4-6 benannte Werte, Schriftpaarung, Layout-Idee in 1-2 Sätzen) **vor** dem Bauen — nicht eine bestehende Optik einfach wiederverwenden. Branchenspezifische Stimmung:
- **Beautysalon**: warm, weich, evtl. mit Vorher-Nachher-Fokus im Layout
- **Friseur**: modern, klar, Fokus auf Ortsbezug in Typografie/Struktur
