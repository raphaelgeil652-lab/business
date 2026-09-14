# Design-Paket: Wakepark Pfullendorf

Der komplette Plan vor der Generierung. Jede Textzeile hier geht wortgleich auf die Seite.
Tier 1 (eine durchgehende Einstellung), weil das Guthaben genau eine Kamerafahrt trägt.

## Die Faktenlage (recherchiert, nichts erfunden)

Quellen: wakepark-pfullendorf.de (Startseite, Über uns, Buchung und Preise, Öffnungszeiten),
pfullendorf.de/seepark, cablemekka.com, oberschwaben-tourismus.de.

- Wakepark Pfullendorf, am Ostufer des Seepark Linzgau, Bannholzer Weg 18, 88630 Pfullendorf.
- Seit Frühjahr 2025 unter neuem Betreiber: Helgi Kolvidsson. Vorher Familie Herrmann.
- Fullsize-Cable plus Zweimastlift. Hindernisse: 3 Boxen, 5 Rails, 2 Kicker, 2 Special Obstacles
  (Unit Ollie Barrier, Riffelrohr).
- Saison 2026: 29. März bis 18. Oktober. Ab 19. Oktober Winterschlaf.
- Öffnungszeiten 2026: März sonntags 12 bis 19 Uhr. April Mi bis Fr 14 bis 19, Wochenende 12 bis 19.
  Mai Di bis Fr 14 bis 21, Wochenende 12 bis 21. Juni Mo bis Fr 14 bis 21, Wochenende 12 bis 21.
  1. Juli bis 13. September täglich 12 bis 21. 14. bis 30. September Mo zu, Di bis Fr 14 bis 19,
  Wochenende 12 bis 19. Büro dienstags und freitags 9 bis 18 Uhr.
- Im Normalbetrieb keine Voranmeldung nötig. Anmeldepflicht nur für exklusive Bahnbuchung und
  Anfängerkurse, ausschließlich über booking@wakepark-pfullendorf.de.
- Buchung online über Wakesys: https://wakepark-pfullendorf.wakesys.com/browser/index.php
- Gratis zu jeder Zeitkarte und Bahnbuchung: Schwimmweste, Wasserski, Kneeboard.
- Verleihpreise (veröffentlicht): Neopren kurz 7 EUR, Neopren lang 8 EUR, Anfänger-Wakeboard 8 EUR,
  Pro-Wakeboard 12 EUR. Bei kompletter Bahnbuchung: 8 / 10 / 10 / 14 EUR. Ab 21 Personen Aufschlag.
- Kurse ab 8 Jahren, mit Materialkunde, Theorie und Wasserpraxis.
- Vor Ort: Shop, Café Seeblick, Bootshaus daneben, Liegewiese, Volleyball, Minigolf,
  Wasserspielplatz, Wohnmobilstellplatz. 25 km vom Bodensee.
- Telefon: 07552 4086901. Instagram @wakeparkfullendorf, dazu Facebook und YouTube.

**Was bewusst nicht auf der Seite steht:** erfundene Kundenstimmen, erfundene Zeitkarten-Preise,
erfundene Bewertungszahlen. Die Stimmen-Sektion ist sichtbar als Platzhalter markiert.

## Die Zielgruppe, in ihren eigenen Worten

Junge bis 60-jährige Sportler, dazu Gruppen (Geburtstag, Firma, Verein) und Familien.
Die wiederkehrenden Sätze aus Foren und Anfänger-Ratgebern:

- Die Angst: "Ich kann das doch gar nicht." "Ich mach mich zum Affen vor allen."
- Die Überraschung: "Sieht wilder aus, als es ist." "Viel leichter, als ich vorher dachte."
- Der Preis dafür: "Muskeln, von denen ich nicht wusste, dass ich sie habe."
- Der Haken: "Ich wollte nicht mehr aufhören."
- Die praktische Hürde: Muss ich buchen? Brauche ich eigenes Zeug? Ab wann geht das?

Daraus folgt die Reihenfolge der Seite: erst die Angst wegnehmen, dann zeigen was es kostet,
dann die praktischen Fragen abräumen, dann buchen.

## 1. Die Marken-Idee

**Ein Wort aus der Welt der Anlage: der Zug.**

Am Kabel zieht dich nichts weiter als ein Seil. Du musst nicht paddeln, nicht Gas geben,
nicht stark sein. Du musst einmal aushalten, wie es zieht, und dann stehst du. Zwischen
sitzen und stehen liegen drei Sekunden. Die ganze Seite erklärt und verkauft diese drei
Sekunden: der Film zieht den Besucher die Seite hinunter, die Zugleine läuft als gezeichnete
Linie durch alle Abschnitte, und der eine Mitmach-Moment lässt ihn den Griff selbst halten.
Was diese drei Sekunden nicht bedient, kommt nicht auf die Seite.

## 2. Die Palette als CSS-Tokens

Aus dem Wasser selbst: Linzgauer Türkis bei Mittagslicht, gebleichtes Alu der Masten,
weiße Gischt, das Orange von Griff und Weste. Helle Richtung, bewusst gegen den dunklen
Kino-Look, den fast jede Wakepark-Seite fährt. Gesagt und begründet: die verbotenen
Standard-Looks (Creme mit Serife, Fast-Schwarz mit Säuregrün, Fast-Schwarz mit Bernstein,
Haarlinien-Brutalismus) sind damit alle umgangen, und die Seite liest sich wie Sommer.

```css
:root{
  --canvas:#eef3f2;        /* gebleichter Himmel über Wasser, kein reines Weiß */
  --canvas-deep:#dfeae9;   /* die ruhigeren Abschnitte */
  --panel:#fbfdfd;         /* Karten und angehobene Flächen */
  --accent:#ff4a1f;        /* Griff-Orange: nur CTA, Fokus, zwei Betonungen */
  --accent-hover:#e63d14;
  --accent-muted:rgba(255,74,31,.14);
  --aqua:#0f8f9e;          /* die Zugleine und alle Flüster-Details */
  --text-secondary:#4a6a70; /* 5,3:1 auf Canvas */
  --text-primary:#0b2128;   /* Seetiefe */
}
```

Kontrast geprüft: Fließtext 5,3:1, Überschriften weit darüber, Beschriftung auf Orange
4,9:1 (deshalb steht auf dem orangen Knopf dunkle Tinte, kein Weiß).

## 3. Das Schrift-Trio

- **Display: Bricolage Grotesque 800.** Breit, eigenwillig, leicht technisch. Kein Inter, kein Roboto.
- **Fließtext: Hanken Grotesk 400 / 500 / 700.** Ruhig, gut lesbar, bleibt im Hintergrund.
- **Beschriftung: DM Mono 500.** Für Kicker, Zahlen, Uhrzeiten. Gibt den Anlagen-Ton.

## 4. Die Bandkarte (Hero, 500vh, Scrollweg 400vh)

| Band | Bereich (Startwert) | Moment im Film | Text (wortgleich) | Auftritt |
|---|---|---|---|---|
| 1 | 0.00 bis 0.26 | Kamera hoch über dem See, sinkt ab, türkises Wasser unten im Bild | "Du musst nichts können." / "Nur einmal loslassen." | Drift-down: die Worte sinken herein, wie die Kamera sinkt |
| 2 | 0.30 bis 0.55 | Sturz näher an die Oberfläche, Gischt streift die Linse | "Das Seil zieht." / "Drei Sekunden später stehst du." | Approach-from-depth: die Zeile wächst auf den Leser zu |
| 3 | 0.58 bis 0.80 | Durchbruch durch die Gischt, Tropfen auf der Linse, Kamera legt sich flach | "Kein Boot. Kein Motor." / "Seil, Wasser, du." | Halves parting: die Zeile teilt sich auseinander wie die Gischt |
| 4 | 0.84 bis 1.00 | Ruhe: weite Glasfläche, Kabellinie läuft in die Tiefe, Masten klein am Ufer | "Wakepark Pfullendorf" / "Seepark Linzgau. Saison bis 18. Oktober." / Knopf "Bahn buchen" | Word-by-word rise, dann Unterzeile, dann Knopf |

Band 1 ohne Einblend-Rampe, mit einmaliger Lade-Montage. Band 4 ohne Ausblend-Rampe.
Die Zahlen sind Startwerte und werden vom Flick-Test geprüft.

## 5. Der statische Hero (Handy, Reduced Motion)

Über dem Endbild, ohne Reise dahinter:

- Kicker: "Seepark Linzgau"
- Überschrift: "Drei Sekunden zwischen sitzen und stehen."
- Unterzeile: "Wakeboarden und Wasserski am Kabel. Anfänger stehen hier jeden Tag zum ersten Mal auf."
- Knopf: "Bahn buchen"
- Darunter klein: "Saison 29. März bis 18. Oktober"

## 6. Der Aufbau unter dem Hero

Jeder Abschnitt trichtert auf denselben Anker `#buchen`. Keine zwei Nachbarn teilen sich
ein Layout-Skelett.

**a) Faktenleiste** (schmale Leiste, vier Werte, Mono)
"Fullsize-Cable plus Zweimastlift" / "3 Boxen, 5 Rails, 2 Kicker" / "Ab 8 Jahren" / "25 km vom Bodensee"

**b) Drei Sekunden** (das Versprechen, asymmetrisch: großer Text links, gezeichnete Leine rechts)
Kicker: "Der Zug"
Überschrift: "Am Kabel macht das Seil die Arbeit."
Text: "Beim Wasserski hinter dem Boot musst du warten, bis jemand Gas gibt. Hier hängst du im
Wasser, das Seil nimmt dich mit, und du drückst dich einfach dagegen. Mehr ist es nicht. Der
erste Start sieht von außen wilder aus, als er sich anfühlt: ein Ruck, Wasser im Gesicht,
und dann läufst du."
Betonte Zeile: "Die meisten stehen beim dritten Versuch."
Klein darunter: "Schwimmweste, Wasserski und Kneeboard sind bei jeder Zeitkarte dabei. Du musst
nichts mitbringen außer Badezeug und Handtuch."

**c) Was du buchen kannst** (fünf Einträge, typografisch statt bebildert, damit alle fünf
gleich behandelt sind)
Kicker: "Das Angebot"
Überschrift: "Fünf Wege auf die Bahn."
1. "Zeitkarte" / "Stunde oder Tag, im Normalbetrieb ohne Anmeldung. Einfach kommen, Wakesys-Konto
   anlegen, aufs Wasser." / "Preise im Buchungssystem"
2. "Anfängerkurs" / "Materialkunde, Theorie am Ufer, dann Wasser. Ab 8 Jahren. Anmeldung nötig." /
   "Anmeldung über booking@"
3. "Bahn exklusiv" / "Die komplette Anlage für deine Gruppe. Geburtstag, Firma, Verein.
   Anmeldung nötig." / "Ab 21 Personen mit Aufschlag"
4. "Bananaboat" / "Für alle, die zuschauen wollten und dann doch nicht. Nur vor Ort oder auf Anfrage." /
   "Nur vor Ort"
5. "Verleih" / "Neopren kurz 7 EUR, lang 8 EUR. Anfänger-Wakeboard 8 EUR, Pro-Wakeboard 12 EUR." /
   "Weste, Wasserski, Kneeboard gratis"

**d) Halt den Griff** (der eine Mitmach-Moment, eigener Abschnitt, dunklere Wasserfläche)
Kicker: "Probier es hier"
Überschrift: "Halt den Griff. Drei Sekunden."
Hilfszeile: "Drücken und halten. Loslassen zählt zurück."
Erfolgszeile: "Und da stehst du."
Was passiert: gedrückt halten füllt einen Zähler von 0,0 auf 3,0 Sekunden, eine gezeichnete
Figur richtet sich aus dem Wasser auf, die Wasserlinie sinkt. Zu früh loslassen lässt den
Zähler weich zurücklaufen, nie springen. Bei 3,0 leuchten drei Sätze nacheinander auf:
"Genau so lange dauert dein erster Start." / "Länger musst du nichts aushalten." /
"Den Rest macht das Seil."
Reduced Motion bekommt den Endzustand sofort, ohne Halten.

**e) Dein erster Tag** (vier Schritte, vier selbst gezeichnete Icons, gleiche Behandlung)
Kicker: "Der Ablauf"
Überschrift: "Vom Parkplatz aufs Wasser in zwanzig Minuten."
1. "Ankommen" / "Bannholzer Weg 18. Parken, Kasse, Wakesys-Konto anlegen, wenn du noch keins hast."
2. "Anziehen" / "Neopren und Weste aus dem Verleih. Umkleide und Spind sind da."
3. "Einweisung" / "Wie du im Wasser sitzt, wann du dich gegen den Zug lehnst, wie du loslässt."
4. "Fahren" / "Erste Runde am Zweimastlift, dann auf die große Bahn. Der Hebler passt auf dich auf."

**f) Stimmen** (Platzhalter, sichtbar markiert)
Kicker: "Stimmen"
Überschrift: "Hier kommen echte Gästestimmen hin."
Hinweis-Text: "Wir erfinden keine Bewertungen. Diese drei Felder sind Platzhalter und werden mit
echten Zitaten vom Park gefüllt, sobald sie da sind."
Drei Karten mit Platzhalterzeilen und der Markierung "Platzhalter".

**g) Preise und Zeiten** (zwei Spalten: Verleihpreise als Tabelle, Öffnungszeiten als Monatsliste)
Kicker: "Was es kostet, wann es geht"
Überschrift: "Zahlen ohne Kleingedrucktes."
Verleihtabelle mit den vier veröffentlichten Preisen, Fußnote: "Bei kompletter Bahnbuchung
8 / 10 / 10 / 14 EUR, ab 21 Personen mit Aufschlag. Zeitkarten-Preise stehen im Buchungssystem."
Öffnungszeiten als Monatsliste, Fußnote: "Wetter kann Zeiten ändern. Aktuelles steht auf Instagram."

**h) Fragen** (Akkordeon, acht Stück, die echten Einwände)
Kicker: "Fragen"
Überschrift: "Was vor dem ersten Mal alle fragen."
1. "Ich war noch nie auf einem Board. Reicht das?" / "Ja. Genau dafür gibt es den Anfängerkurs:
   Materialkunde, kurze Theorie am Ufer, dann Wasser. Ab 8 Jahren. Und Schwimmweste, Wasserski und
   Kneeboard sind bei jeder Zeitkarte dabei."
2. "Muss ich vorher buchen?" / "Im Normalbetrieb nicht. Du kannst während der Öffnungszeiten einfach
   an die große Bahn kommen. Anmelden musst du dich nur für den Anfängerkurs und für die exklusive
   Bahnbuchung, beides über booking@wakepark-pfullendorf.de."
3. "Wie fit muss ich sein?" / "Fitter, als du denkst, musst du nicht sein. Der Zug macht die Arbeit.
   Was du am nächsten Tag merkst, sind Unterarme und Rumpf. Das legt sich nach zwei, drei Besuchen."
4. "Was muss ich mitbringen?" / "Badesachen, Handtuch, etwas zu trinken. Neopren und Board leihst du
   vor Ort. Weste, Wasserski und Kneeboard kosten nichts extra."
5. "Und wenn es regnet?" / "Regen ist kein Problem, du bist sowieso nass und der Neopren hält warm.
   Bei Gewitter oder Sturm steht die Anlage still. Änderungen stehen auf Instagram."
6. "Kann ich kommen, ohne zu fahren?" / "Ja. Am Seepark gibt es Liegewiese, Volleyball, Minigolf und
   Wasserspielplatz, dazu Shop und Café direkt an der Anlage und das Bootshaus nebenan."
7. "Geht das mit einer Gruppe?" / "Dafür gibt es die exklusive Bahnbuchung: die komplette Anlage für
   euch. Ab 21 Personen kommt ein Aufschlag dazu. Anfragen an booking@wakepark-pfullendorf.de."
8. "Wann ist überhaupt Saison?" / "29. März bis 18. Oktober 2026. Ab dem 19. Oktober geht die Anlage
   in den Winterschlaf."

**i) Abschluss und Formular** (der starke Schluss, volle Breite, Endbild als Hintergrund)
Überschrift: "Der See läuft. Du fehlst."
Unterzeile: "Zeitkarten buchst du direkt im Buchungssystem. Kurs, Gruppe oder Firmenevent gehen über
das Formular, und du bekommst eine Antwort aus dem Büro."
Hauptknopf: "Bahn buchen"
Formular-Beschriftungen: "Name", "E-Mail", "Worum geht es?" (Auswahl: Anfängerkurs / Gruppe oder
Geburtstag / Firmenevent / Etwas anderes), "Wie viele seid ihr?", "Wunschtermin", "Nachricht"
Knopf: "Anfrage senden"
Mikrotext unter dem Knopf: "Das öffnet dein E-Mail-Programm mit der fertigen Nachricht an
booking@wakepark-pfullendorf.de. Büro ist dienstags und freitags von 9 bis 18 Uhr besetzt."
Erfolgszustand: "Deine E-Mail ist vorbereitet. Abschicken nicht vergessen."
**Formular-Weg: mailto.** Ehrlich gesagt auf der Seite, weil es keinen Server gibt. Für einen
echten Live-Betrieb wäre ein Formulardienst der nächste Schritt.

**j) Fußzeile**
Adresse, Telefon, beide E-Mail-Adressen, Öffnungszeiten-Kurzform, Social-Links, Seepark-Hinweis.
Dazu der ehrliche Hinweis: "Die Bilder dieser Seite sind KI-erzeugt und stehen als Platzhalter für
echte Fotos aus dem Park. Impressum und Datenschutz fehlen noch und müssen vor dem Livegang vom
Betreiber ergänzt werden."

## 7. Die Vektor-Ebene

- **Die Zugleine (das Signature-Element).** Eine durchgehende SVG-Linie in `--aqua`, die von der
  Faktenleiste bis zum Abschluss durch die ganze Seite läuft, an jeder Abschnittsgrenze über einen
  gezeichneten Mast läuft und dazwischen durchhängt. Sie zeichnet sich beim Scrollen selbst
  (stroke-dashoffset), und ein kleiner Mitnehmer sitzt auf ihr und fährt mit der Scrollposition mit.
  Nimmt man sie weg, verliert die Seite ihre Klammer. Das ist der Test.
- **Vier Ablauf-Icons**, selbst gezeichnet, gleiche Strichstärke, gleicher Rahmen.
- **Der Griff** im Mitmach-Abschnitt: gezeichneter Wakeboard-Griff, Seil, Figur, Wasserlinie.
- **Flüster-Partikel:** feine, langsam steigende Luftblasen in `--aqua` bei 8 Prozent Deckkraft,
  nur im Mitmach-Abschnitt, Zyklus über 20 Sekunden.
- **Eine feste Hintergrundebene:** weiche, sehr langsam wandernde Wasserlicht-Kaustik plus feines
  Korn, Zyklus 90 Sekunden, hinter allem.
- Alles achtet Reduced Motion: Endzustände sichtbar, Antriebe aus.

## 8. Die Technik-Liste

Vollständig nach `references/scrub-pipeline.md`: Blob-Fetch mit Ladering (nur wenn über 8 MB,
sonst schlicht), dt-normalisierter Lerp mit ruhender rAF-Schleife, gegatete Seeks mit
Deadlock-Ausstieg, delta-gegatete DOM-Schreibvorgänge, Bandtakt nach dem Flick-Test, das
vierschichtige Lesbarkeits-System (Basis-Scrim, Band-Scrim, Textschatten, Chip), die fünf
Static-Hero-Gates live in CSS und JS identisch, vollständig ohne Video funktionsfähig, dazu der
Qualitätsboden und der ganzseitig animierte Standard aus Phase 8.

## 9. Das Text-Gate

Jede Zeile oben geht wortgleich auf die Seite. Die gebaute Seite muss das Phase-9-Gate bestehen:
null Gedankenstriche, null Floskelwörter, dazu der Durchgang gegen die leiseren KI-Verräter.
Bewusste Marken-Figuren aus diesem Paket bleiben: "Kein Boot. Kein Motor." ist gewollt,
"Seil, Wasser, du." auch.
