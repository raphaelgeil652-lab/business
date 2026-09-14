# Design-Paket: Wakepark Pfullendorf

Warum die Seite aussieht, wie sie aussieht. Jede Textzeile hier steht wortgleich auf der Seite.

---

## 1. Die Faktenlage (recherchiert, nichts erfunden)

Quellen: wakepark-pfullendorf.de (Startseite, Über uns, Buchung und Preise, Öffnungszeiten),
pfullendorf.de/seepark, cablemekka.com, oberschwaben-tourismus.de, blubbr.de.

- Wakepark Pfullendorf, Ostufer des Seepark Linzgau, Bannholzer Weg 18, 88630 Pfullendorf.
- **5-Mast-Anlage** plus **Übungslift System 2.0**. Hindernisse: 3 Boxen, 5 Rails, 2 Kicker,
  2 Special Obstacles (Unit Ollie Barrier, Riffelrohr). Zusammen 12.
- Seit Frühjahr 2025 neuer Betreiber: **Helgi Kolvidsson**. Wiedereröffnung 1. Mai 2025.
  Beim technischen Update war Wakeboard-Profi **Jens Geißler** dabei, das Betriebsgebäude ist neu.
- Team laut Über-uns-Seite: Helgi, Dan (Bahnleitung), dazu die Hebler Fabi, Flo, Simon, Moritz.
- **Saison 2026: 29. März bis 18. Oktober.** Ab 19. Oktober Winterschlaf.
- Öffnungszeiten: März sonntags 12 bis 19. April Mi bis Fr 14 bis 19, Wochenende 12 bis 19.
  Mai Di bis Fr 14 bis 21, Wochenende 12 bis 21. Juni Mo bis Fr 14 bis 21, Wochenende 12 bis 21.
  1. Juli bis 13. September täglich 12 bis 21. 14. bis 30. September Mo zu, Di bis Fr 14 bis 19,
  Wochenende 12 bis 19. Oktober wie September. Büro Di und Fr 9 bis 18 Uhr.
- Im Normalbetrieb keine Voranmeldung. Anmeldepflicht nur für Anfängerkurs und exklusive
  Bahnbuchung, über booking@wakepark-pfullendorf.de.
- Buchung online über Wakesys: `https://wakepark-pfullendorf.wakesys.com/browser/index.php`
- Gratis zu jeder Zeitkarte und Bahnbuchung: Schwimmweste, Wasserski, Kneeboard.
- Verleih: Neopren kurz 7 €, lang 8 €, Anfängerboard 8 €, Pro-Board 12 €. Bei kompletter
  Bahnbuchung 8 / 10 / 10 / 14 €. Ab 21 Personen Aufschlag.
- Kurse ab 8 Jahren, mit Materialkunde, Theorie und Wasserpraxis.
- Vor Ort: Shop, Café, Bootshaus nebenan, Liegewiese, Beachvolleyball, Minigolf,
  Wasserspielplatz, Wohnmobilstellplatz. 25 km vom Bodensee.
- Telefon 07552 4086901, Verleih 0172 3056278. Instagram @wakeparkfullendorf.

**Nicht auf der Seite:** erfundene Kundenstimmen, erfundene Zeitkarten-Preise, erfundene
Bewertungszahlen. Die Stimmen-Sektion ist sichtbar als Platzhalter markiert.

---

## 2. Die Zielgruppe, in ihren eigenen Worten

Sportler von jung bis 60, dazu Gruppen (Geburtstag, Firma, Verein, Schulklasse) und Familien.
Die wiederkehrenden Sätze aus Anfänger-Foren und Ratgebern:

- **Die Angst:** „Ich kann das doch gar nicht." „Ich mach mich zum Affen vor allen."
- **Die Überraschung:** „Sieht wilder aus, als es ist." „Viel leichter, als ich dachte."
- **Der Preis dafür:** „Muskeln, von denen ich nicht wusste, dass ich sie habe."
- **Der Haken:** „Ich wollte nicht mehr aufhören."
- **Die praktische Hürde:** Muss ich buchen? Brauche ich eigenes Zeug? Ab wann geht das?

Daraus folgt die Reihenfolge der Seite: **erst die Angst wegnehmen, dann zeigen was es gibt,
dann die praktischen Fragen abräumen, dann buchen.**

---

## 3. Die Kern-Idee: der Zug

Am Kabel zieht dich nichts weiter als ein Seil. Du musst nicht paddeln, nicht Gas geben, nicht
stark sein. Du musst einmal aushalten, wie es zieht, und dann stehst du. **Zwischen sitzen und
stehen liegen drei Sekunden.** Die ganze Seite verkauft diese drei Sekunden. Was sie nicht
bedient, steht nicht drauf.

---

## 4. Die Farbwelt kommt aus dem eigenen Wappen

Das Logo des Parks ist ein Wappen mit Sonnenuntergang-Streifen, zwei Silhouetten und einem
cremefarbenen Schriftzug. Genau das wird die Palette der Seite, damit Marke und Webseite
dieselbe Welt sind.

```css
--cream:#f6ecd9;      /* Hintergrund, gebleichter Sommer, kein reines Weiß */
--cream-2:#efe1c6;    /* die ruhigeren Abschnitte */
--paper:#fffaf0;      /* Karten */
--brown:#2f1d13;      /* Schrift und die dunklen Bänder */
--brown-3:#1d110a;    /* Abschluss und Fußzeile */
--amber:#f0a52e;      /* der obere Streifen des Wappens */
--orange:#e2701d;     /* der mittlere */
--rust:#c1440e;       /* der untere, als Flächenfarbe des Buchungsknopfes */
--rust-ink:#a8380a;   /* dieselbe Farbe fuer kleine Schrift, damit der Kontrast reicht */
--teal:#12787c;       /* das Wasser, sparsam als zweiter Akzent */
--muted:#6b5544;      /* Fließtext zweiter Ordnung */
```

**Warum hell und nicht dunkel:** Fast jede Wakepark-Seite fährt schwarz mit Neon. Hell und warm
ist hier nicht nur anders, es ist ehrlicher: der Park ist ein Sommerort bei Tageslicht.

Gemessene Kontraste auf der fertigen Seite: Fließtext 6,71:1, Lede 5,40:1, Kicker 5,02:1,
FAQ-Antwort 5,96:1, Knopfbeschriftung auf Orange 4,92:1. Deshalb steht auf dem orangen Knopf
dunkle Tinte statt Weiß: mit Weiß wären es nur 3,4:1 gewesen.

## 5. Das Schrift-Trio

- **Display: Archivo Black.** Breit, schwer, Plakatcharakter. Alle Überschriften in Versalien.
- **Fließtext: Hanken Grotesk** 400 / 500 / 700. Ruhig, gut lesbar, hält sich zurück.
- **Beschriftung: DM Mono** 500. Für Kicker, Uhrzeiten, Preise, Marker. Gibt den Anlagen-Ton.

Alle drei liegen als woff2 im Ordner `seite/assets/fonts/`. Kein Google-Aufruf.

## 6. Das durchgehende Motiv

**Die Sonnenstreifen aus dem Wappen.** Sie kommen als Balken unter dem Hero zurück, als
Wappen-Icons neben den Vorteilen, als Linie unter jeder Karten-Überschrift, als Trennstrich
im Kicker und als Füllung, die beim Überfahren des Buchungsknopfes von unten hochschiebt.
Nimmt man sie weg, verliert die Seite ihre Klammer.

---

## 7. Der Aufbau, mit dem fertigen Text

Jeder Abschnitt führt auf denselben Anker. Keine zwei Nachbarn teilen sich ein Layout.

**Hero** (Foto: Fahrer in der Gischtwand mit Regenbogen)
- Kicker: „Seepark Linzgau · 25 km vom Bodensee"
- Überschrift: „Zwischen sitzen und stehen liegen drei Sekunden."
- Unterzeile: „Am Kabel zieht dich ein Seil, kein Boot. Du hängst im Wasser, drückst dich
  dagegen, und dann läufst du. Mehr ist es nicht."
- Knöpfe: „Zeitkarte buchen" und „Anfängerkurs anfragen"
- Kleingedrucktes: „Im Normalbetrieb ohne Anmeldung. Schwimmweste, Wasserski und Kneeboard sind
  bei jeder Zeitkarte dabei."

**Faktenleiste:** 5 Masten · Übungslift · 12 Hindernisse · Ab 8 Jahren.

**Vorteile** („Am Kabel lernst du es an einem Nachmittag."): Das Seil macht die Arbeit ·
Erst der Übungslift, dann die große Bahn · Du brauchst nichts mitzubringen ·
Der Tag hört am Wasser nicht auf.

**Angebot** („Fünf Wege auf die Bahn."): Zeitkarte · Anfängerkurs · Bahn exklusiv ·
Bananaboat · Verleih. Die ersten beiden mit Foto, die anderen drei rein typografisch,
damit die drei kleinen gleich behandelt sind.

**Dein erster Tag** („Vom Parkplatz aufs Wasser in zwanzig Minuten."):
Ankommen · Anziehen · Einweisung · Fahren.

**Die Anlage** („Ein Baggersee, zwei Lifte, zwölf Hindernisse."): Luftbild mit vier Markern
(große Bahn, Hindernisse, Start und Verleih, Strand) und die Hindernisliste mit Zahlen.

**Wer dahintersteht** („Hier arbeiten Leute, die selbst fahren."): zuerst der Betreiber und das
Team als echter Beleg, danach drei markierte Platzhalter für Gästestimmen.

**Preise und Zeiten** („Was es kostet, wann es geht."): Verleihtabelle links,
Saisonkalender rechts. Der laufende Saisonabschnitt wird per JavaScript hervorgehoben.

**Fragen** („Was vor dem ersten Mal alle fragen."): acht echte Einwände.

**Abschluss** („Das Wasser wartet nicht bis nächstes Jahr."): der ehrliche Dringlichkeitsgrund
ist der 18. Oktober. Daneben das Formular für Kurs, Gruppe und Firmenevent.

---

## 8. Die drei bewegten Details

1. **Die Live-Anzeige im Kopf.** Aus den echten Saisonzeiten wird berechnet, ob gerade offen ist:
   „Jetzt offen bis 21 Uhr", „Heute ab 14 Uhr", „Heute geschlossen" oder „Winterpause · Start
   29. März". Ein grüner Punkt pulst, wenn offen ist.
2. **Die Auftritte beim Scrollen.** Abschnitte fahren gestaffelt hoch. Die Staffelverzögerung
   wird nach dem Auftritt wieder entfernt, sonst hinken spätere Hover-Effekte hinterher.
3. **Der Buchungsknopf.** Beim Überfahren schieben die drei Wappen-Streifen von unten hoch und
   die Beschriftung wechselt auf Dunkelbraun.

Alles läuft nur über `transform` und `opacity`. Bei „Bewegung reduzieren" im Betriebssystem
sind alle Animationen aus und alle Elemente sofort im Endzustand. Im Hintergrund-Tab pausiert
alles.

---

## 9. Entscheidungen, die bewusst gefallen sind

- **Ein einziger Hauptweg.** Alle Knöpfe führen zum Buchungssystem. Das Formular fängt nur ab,
  was dort nicht geht: Kurs, Gruppe, Firmenevent.
- **Das Formular schickt eine E-Mail** über das Mailprogramm des Besuchers. Es gibt keinen Server,
  und ein stiller Erfolgsdialog, der nirgendwo hingeht, wäre gelogen. Der Text unter dem Knopf
  sagt genau, was passiert.
- **Keine Bewertungssterne.** Es kursiert eine Zahl von 94 Prozent Weiterempfehlung bei 416
  Facebook-Bewertungen. Nicht überprüfbar, also nicht auf der Seite. Wenn der Betreiber sie
  bestätigt, ist sie ein starker Zusatz im Proof-Abschnitt.
- **Schriften selbst gehostet**, kein Google-Aufruf.
- **Der Hero zeigt keinen Anfänger.** Das stärkste Foto ist der Fahrer in der Gischtwand. Die
  Angst der Anfänger wird direkt darunter im Text abgeholt, nicht im Bild.
