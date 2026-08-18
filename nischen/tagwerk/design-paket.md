# Design-Paket: Tagwerk (Tier 1, ein durchgehender Shot)

Demo-Projekt. Erfundene Marke, alles generiert. Sprache der Seite: Deutsch.
Jede Zeile Copy hier geht **wortgleich** in den Build. Zahlen bei den Bändern sind Startwerte,
validiert später durch den Flick-Test.

## 1. Die Marken-Prämisse

Tagwerk ist ein Kaffee, dessen ganze Geschichte an **einem Datum** hängt: dem Rösttag.
Ein Rösttag pro Woche, ein Kaffee statt vierhundert, das Datum auf jede Packung gestempelt,
am selben Tag verschickt. Jede Sektion der Seite, der Mitmach-Moment und der Schlusssatz
dienen dieser einen Idee. Was das Datum nicht erklärt, kommt nicht auf die Seite.

Register der Marke: ruhig, handwerklich, sehr direkt. Kurze Sätze. Kein Café-Poesie-Ton,
keine Herkunftsromane. Die Marke redet wie ein Röster, der um sechs Uhr morgens arbeitet.

## 2. Palette als CSS-Tokens

Aus der Welt des Films gezogen: dunkler Röstraum, warmes Seitenlicht, Dampf, Milchglas.
Endgültige Werte werden nach dem Video-Gate aus dem echten Bild nachgezogen.

```css
:root{
  --canvas:#17110d;        /* Röstraum-Dunkel, warm getönt, nie reines Schwarz */
  --panel:#211812;         /* Karten und angehobene Flächen */
  --accent:#e08a3c;        /* Glut-Orange: nur CTA und seltene Betonung */
  --accent-hover:#f0a355;
  --accent-muted:#7a4a22;  /* Flüsterstärke: Ränder, Glimmen, Partikel */
  --text-secondary:#c4ab98;
  --text-primary:#f4ece1;  /* Milchschaum-Creme */
}
```

## 3. Das Schrift-Trio

- **Display: Fraunces** (600, 700, opsz variabel). Warme, leicht eigenwillige Serife, riecht nach
  Handwerk statt nach Startup. Kein Inter, kein Roboto.
- **Fließtext: Karla** (400, 500). Ruhige Grotesk, gute Lesbarkeit über Video.
- **Mono: Space Mono** (400, 700). Trägt das Stempel-Motiv: Datumsangaben, Chargennummern, Labels.

## 4. Die Band-Karte (Hero, ca. 400vh)

| Band | Bereich (Startwert) | Moment im Film | Copy (wortgleich) | Entrance |
|---|---|---|---|---|
| 1 | 0.00 bis 0.17 | Der Strahl beginnt zu fallen, Raum dunkel, Licht von rechts | **„Kaffee hat ein Datum."** / „Bei den meisten steht es nur nicht drauf." | Drift-down, Wörter fallen von oben ins Bild (echot den Guss) |
| 2 | 0.21 bis 0.44 | Der Strahl trifft die Kanne, Dampf schlägt auf | **„Im Regal liegt er Monate."** / „Bei uns sind es Tage." | Word-Punch mit Overshoot auf „Monate", der Aufschlag im Bild |
| 3 | 0.48 bis 0.70 | Die Kanne füllt sich, Flüssigkeit wirbelt und beruhigt sich | **„Ein Kaffee. Nicht vierhundert."** / „Du musst nichts aussuchen. Nur aufmachen." | Grid-Snap: Zeichen rutschen der Reihe nach an ihren Platz |
| 4 | 0.74 bis 1.00 | Alles steht still, Dampf driftet, Schlussbild | **„Dienstag geröstet. Donnerstag in deiner Küche."** / „Ein Rösttag. Ein Kaffee. Kündigen mit einem Klick." / CTA: **Rösttag sichern** | Wort-für-Wort-Aufstieg, dann Subline, dann CTA. Drei Ankünfte, ein Band |

Aktionsspur: Der Guss läuft in der rechten Bildhälfte. Alle Bänder sitzen links im ruhigen Raum,
Band 4 rückt in die untere Mitte, sobald die Kanne steht.

## 5. Statisches Hero (Handy, reduzierte Bewegung)

- Headline: **„Dienstag geröstet. Donnerstag in deiner Küche."**
- Subline: „Ein Rösttag pro Woche. Ein Kaffee. Das Datum steht auf der Packung."
- CTA: **Rösttag sichern**
- Hintergrund: das Schlussbild des Films (die stehende Kanne), nicht das Startbild.

## 6. Was unter dem Hero kommt

Alles trichtert auf **einen** CTA-Anker: `#rösttag` (das Formular am Ende).

**Nav:** Tagwerk (Wortmarke + Stempel) · Der Kaffee · So läuft's · Preis · Fragen · Button „Rösttag sichern"

**A. Das Datum (Übergang aus dem Schlussbild)**
- Kicker (mono): `CHARGE 34 · GERÖSTET 18.08.`
- Headline: „Frisch ist kein Gefühl. Frisch ist ein Datum."
- Text: „Kaffee verliert sein Aroma ab dem Rösttag, nicht ab dem Kaufdatum. Deshalb steht bei uns
  auf jeder Packung, an welchem Tag sie geröstet wurde. Du musst uns nicht glauben. Du kannst es lesen."

**B. So läuft's (drei Schritte, drei Bilder, alle gleich behandelt)**
1. `DIENSTAG 06:00` — „Wir rösten." — „Eine Charge, eine Sorte, eine Trommel. Fertig, wenn sie fertig ist."
2. `DIENSTAG 14:00` — „Wir stempeln und verschicken." — „Das Datum kommt auf die Packung, die Packung kommt zur Post. Am selben Tag."
3. `DONNERSTAG` — „Du machst auf." — „Zwei Tage alt. So schmeckt Kaffee, bevor er müde wird."

**C. Der Mitmach-Moment: der Frische-Regler** (das eine gestaltete Element zum Anfassen)
- Kicker (mono): `ZIEH AM REGLER`
- Headline: „So schmeckt Zeit."
- Der Besucher zieht von Tag 0 bis Tag 90. Aroma-Partikel werden dünner, die Notiz darunter wechselt:
  - Tag 2: „Blüte, brauner Zucker, klarer Abgang."
  - Tag 14: „Immer noch gut. Die Spitze ist weg."
  - Tag 45: „Flach. Man schmeckt nur noch Röstung."
  - Tag 90: „Bitter. Das ist der Kaffee aus dem Regal."
- Schlusszeile darunter: „Wir verschicken an Tag 0."

**D. Stimmen (drei Karten)**
- „Ich habe zwanzig Jahre Supermarktkaffee getrunken und dachte, so schmeckt Kaffee eben." — Miriam K.
- „Das Datum auf der Packung hat mich überzeugt, nicht der Text auf der Seite." — Tobias R.
- „Ich wollte nicht aus vierhundert Sorten wählen. Ich wollte guten Kaffee." — Anke B.

**E. Preis (ehrlich, eine Karte)**
- `250 G · GANZE BOHNE ODER GEMAHLEN`
- **14 € pro Packung, Versand inklusive.**
- „Alle zwei Wochen oder jeden Monat, du stellst es ein. Kündigen geht online, mit einem Klick,
  ohne Anruf und ohne Grund."
- Button: **Rösttag sichern**

**F. Fragen (die echten Einwände aus den Bewertungen)**
- „Kann ich jederzeit kündigen?" — „Ja, online, mit einem Klick. Kein Anruf, keine Frist, keine Rückfrage."
- „14 € klingt viel für 250 Gramm." — „Für 40 Tassen. Das sind 35 Cent pro Tasse, und du zahlst keinen Regalplatz mit."
- „Was, wenn er mir nicht schmeckt?" — „Erste Packung geht auf uns. Schreib uns eine Zeile, wir buchen zurück."
- „Bohne oder gemahlen?" — „Beides. Bei gemahlen sag uns, womit du brühst, dann stellen wir es richtig ein."
- „Nur eine Sorte, wird das nicht langweilig?" — „Die Sorte wechselt mit der Ernte, nicht mit dem Katalog. Du bekommst, was gerade am besten ist."

**G. Der Abschluss (das Formular, CTA-Anker `#rösttag`)**
- Headline: „Der nächste Rösttag ist Dienstag."
- Text: „Trag deine E-Mail ein, dann liegt die Packung am Donnerstag bei dir."
- Feld-Label: „E-Mail" · Platzhalter: „du@beispiel.de" · Button: **Rösttag sichern**
- Erfolgszustand: „Steht. Wir melden uns am Rösttag."
- Formular-Handhabung: **reiner JS-Erfolgszustand** (Demo-Seite, es wird nichts versendet).
  Direkt unter dem Formular, klein und ehrlich: „Demo-Seite. Das Formular verschickt nichts."

**Footer:** „Tagwerk ist eine erfundene Marke, gebaut als Demo. Es gibt keine Rösterei, keinen Versand
und keinen Kaffee. Bilder und Film sind KI-generiert." · Impressum-Platzhalter · Datenschutz-Platzhalter

## 7. Die Vektor-Ebene (von Hand gezeichnet, SVG)

- **Der Stempel** als Signature-Element: ein leicht schiefer, gestempelter Kreis mit Datum in Space Mono.
  Sitzt in der Nav, auf der Preis-Karte und als großes, ruhiges Wasserzeichen in Sektion A.
  Er zeichnet sich beim Scrollen selbst (stroke-dasharray), leicht rotiert, nie perfekt.
- **Die Fall-Linie:** eine dünne senkrechte Linie, die den Guss aus dem Hero in Sektion A weiterführt
  und sich beim Scrollen nach unten zeichnet.
- **Dampf-Partikel** auf Flüsterstärke im Hintergrund von Sektion C, langsam, 60 Sekunden Zyklus.
- Eine feste Hintergrund-Ebene über die ganze Seite: ein sehr langsamer warmer Lichtschein,
  damit Scrollen sich wie Bewegung durch einen Raum anfühlt.
- Alles respektiert reduzierte Bewegung: Endzustände sichtbar, Antriebe aus.

## 8a. Nachtrag nach der ersten Vorschau: der Hero läuft als Bildfolge

Der Nutzer hat die Animation als abgehackt gemeldet. Nachgemessen: bei einem Video kostet jedes
Springen zu einer neuen Scrollposition bis zu einer Zehntelsekunde, es kamen nur 4 bis 10 Bilder
pro Sekunde an. Deshalb bewusst abgewichen vom Video-Weg des Skills:

- 141 Einzelbilder (1440 px breit, zusammen 4,5 MB) statt einer Videodatei.
- Gezeichnet wird auf eine Zeichenfläche, gemessene Kosten 0,01 ms pro Bild.
- Zwischen zwei Einzelbildern wird überblendet, sonst bleiben Stufen sichtbar.
- Ergebnis gemessen: 143 verschiedene Bildzustände in 145 Bildschirm-Takten.
- Hero-Höhe von 700vh auf 560vh, damit weniger Scrollweg auf ein Einzelbild fällt.

Alles andere aus diesem Paket bleibt unverändert gültig.

## 8. Die Technik-Liste (nichts davon halb erinnern)

Blob-Fetch mit Ladering, dt-normalisierter Lerp mit ruhender rAF-Schleife, gegatterte Seeks mit
Fehler-Ausstieg, DOM-Schreibzugriffe nur bei Änderung, Band-Pacing mit Flick-Test, das vierschichtige
Lesbarkeits-System, die fünf Gates für das statische Hero live über change-Listener, Seite komplett
ohne Video, dazu der Qualitätsboden. Alles nach `references/scrub-pipeline.md`,
plus der Standard „die ganze Seite ist animiert" aus Phase 8.

## 9. Das Copy-Gate

Jede Zeile oben geht wortgleich in den Build. Vor der ersten Vorschau muss `index.html` durch das
Gate aus Phase 9: null Gedankenstriche, null Floskeln, dazu der Durchgang gegen die leiseren
KI-Marker im Fließtext. Absichtliche Marken-Figuren aus diesem Paket bleiben stehen, zum Beispiel
„Ein Kaffee. Nicht vierhundert." und „Dienstag geröstet. Donnerstag in deiner Küche."
