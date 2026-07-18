# Design-Standard für alle Landingpages

Grund: generische KI-Designs (immer Inter-Schrift, immer derselbe lila-blaue Verlauf, immer drei gleiche abgerundete Karten) wirken flach und ohne Wow-Effekt. Recherche + Anthropics eigenes Cookbook zu "Prompting for frontend aesthetics" zeigen, warum das passiert und wie man es vermeidet — das gilt ab jetzt verbindlich für jede neue Vorlage in `templates/`.

## Warum KI-Design oft gleich aussieht

Ein KI-Modell gibt bei vager Anfrage den statistischen Durchschnitt seiner Trainingsdaten zurück — und dieser Durchschnitt hat ein Gesicht: Inter-Schrift, zentrierter Hero, drei gleiche abgerundete Karten, lila-blauer Verlauf. Das ist kein Zufall, sondern Mittelwertbildung. Gegenmittel: bewusst von diesem Mittelwert wegsteuern, nicht dem ersten Impuls folgen.

## Verbindliche Prinzipien (ab sofort für jede Vorlage)

1. **Nie Inter/Roboto/Arial als einzige Schrift.** Jede Vorlage bekommt eine bewusst gewählte Schriftpaarung mit Charakter (Display-Schrift + Grotesk/Humanist-Sans), passend zur jeweiligen Branche — nicht dieselbe Kombination für alle vier Nischen. Echte Web-Fonts (Google Fonts) sind für echte Kundenseiten völlig in Ordnung, mit robustem System-Font-Fallback für den Fall, dass sie nicht laden.
2. **Kein Standard-Verlauf/-Farbschema.** Farbpalette pro Branche bewusst herleiten (siehe bestehende Zahnarzt-Palette: Salbei/Wacholdergrün/Honig statt Klinik-Blau oder Creme+Terrakotta), nicht das erste naheliegende Schema übernehmen.
3. **Ein orchestrierter Eintritts-Moment statt verstreuter Effekte.** Der Hero-Bereich bekommt eine gestaffelte Eintritts-Animation (Headline, Text, CTA nacheinander), plus ein dezentes Verlaufs-Hintergrundelement ("Mesh"-Farbflächen, leicht in Bewegung). Das ist der Ort für den "Wow-Effekt" — nicht zehn kleine Spielereien über die ganze Seite verteilt.
4. **Asymmetrische statt gleichförmige Layouts.** Drei exakt gleiche Karten nebeneinander wirken sofort nach Vorlage. Stattdessen z. B. Bento-Grid (eine größere, hervorgehobene Karte + kleinere daneben) oder andere bewusste Asymmetrie.
5. **Hover-/Bewegungstiefe auf interaktiven Elementen.** Karten und Buttons heben sich beim Hover leicht an (Schatten + Transform), damit die Seite lebendig statt statisch wirkt — dezent, nicht übertrieben.
6. **Zurückhaltung bleibt Pflicht.** Kein Glassmorphismus, keine 3D-Mockups, kein Dark-Mode-First, keine Countdown-Timer oder aufdringliche Pop-ups — das passt zu SaaS/Tech-Produkten, nicht zu einer Zahnarzt-, Beauty-, Fitness- oder Friseur-Seite, die Vertrauen aufbauen soll. Referenzpunkt für die Balance zwischen "Wow" und "seriös": reduziertes, tadelloses Interface-Design (z. B. die Design-Sprache von Emil Kowalski/Vercel-Umfeld) — hohe Sorgfalt in Typografie/Spacing/Bewegung, ohne Effekthascherei.
7. **Bewegung immer mit `prefers-reduced-motion`-Rücksicht.** Jede Animation braucht eine Reduced-Motion-Alternative (sofort sichtbar statt animiert).

## Konkret umgesetzt in `templates/zahnarzt-landingpage/`

- Schriftpaarung: **Fraunces** (Display, warm, Charakter) + **Work Sans** (Fließtext) statt System-Serif/Inter.
- Hero: dezentes Gradient-Mesh im Hintergrund (Wacholdergrün + Honig, langsam driftend) + gestaffelte Eintritts-Animation der Hero-Elemente + sanft schwebende Illustration.
- Benefits-Sektion: Bento-Grid (eine hervorgehobene große Karte + zwei kleinere) statt drei gleicher Karten.
- Karten/Buttons: Hover-Anhebung mit Schatten statt statischer Flächen.

## Für zukünftige Vorlagen (Fitnessstudio, Beauty, Friseur)

Jede neue Vorlage bekommt einen eigenen kurzen Design-Plan (Farbpalette als 4-6 benannte Werte, Schriftpaarung, Layout-Idee in 1-2 Sätzen) **vor** dem Bauen — nicht dieselbe Zahnarzt-Optik einfach wiederverwenden. Branchenspezifische Stimmung:
- **Fitnessstudio**: energischer, kräftiger Kontrast, kein Pastell
- **Beautysalon**: warm, weich, evtl. mit Vorher-Nachher-Fokus im Layout
- **Friseur**: modern, klar, Fokus auf Ortsbezug in Typografie/Struktur
