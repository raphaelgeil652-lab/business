# Design-Paket: Alex Außenanlagen (Tier 1, ein durchgehender Shot)

Echtes Unternehmen, Inhaber **Alex Stadelmann**, Raum **Pfullendorf und Umgebung**.
Leistungen laut Auftrag: Garten- und Außenanlagen, Bagger- und Erdarbeiten, Pflasterarbeiten.
Sprache der Seite: Deutsch. Jede Zeile Copy hier geht **wortgleich** in den Build.

**Was hier bewusst NICHT steht, weil es echt sein muss und ich es nicht weiß:**
Kundenstimmen, Preise, Telefonnummer, E-Mail, Firmensitz, Rechtsform, Gründungsjahr,
Mitarbeiterzahl, Referenzobjekte. Nichts davon wird erfunden. Solange es fehlt, steht
an diesen Stellen entweder gar nichts oder ein klar erkennbarer Platzhalter.

## 1. Die Marken-Prämisse

Eine Idee: **der Unterbau.** Was man am Ende sieht, ist die dünnste Schicht. Ob eine Einfahrt
in zehn Jahren noch eben ist, entscheidet das, was darunter liegt, und ob jemand sauber
gearbeitet hat, als es niemand sehen konnte. Alex verkauft nicht Pflastersteine, er verkauft
den Aufbau darunter und die Verlässlichkeit drumherum.

Register der Marke: ruhig, handfest, ohne Prahlerei. Kurze Sätze. Ein Handwerker, der
erklärt statt zu verkaufen. Nie „Traumgarten", nie „Ihr Partner für".

## 2. Palette als CSS-Tokens

Aus der Welt des Films gezogen: Kalkstein, Abendlicht, Rasen, Baggergelb.
Bewusst **hell**, nicht dunkel-kinoartig. Das ist eine andere Welt als die Kaffeeseite,
und es passt zu draußen.

```css
:root{
  --canvas:#ece7dd;        /* Kalkstein hell, nie reines Weiß */
  --panel:#f6f3ec;         /* Karten und angehobene Flächen */
  --panel-2:#e2dccf;       /* zweite Fläche, Schnittkanten */
  --ink:#191c17;           /* Basalt, der Fließtext */
  --ink-soft:#5b6154;      /* zweite Textfarbe */
  --accent:#d9932a;        /* Baggergelb, nur CTA und seltene Betonung */
  --accent-hover:#c07f1c;
  --green:#3d5c3a;         /* Moos, Flächen und Linien */
  --line:#cfc7b7;
}
```

## 3. Das Schrift-Trio

- **Display: Bricolage Grotesque** (600, 800). Kantig, leicht schmal, wirkt gebaut statt gestylt.
  Kein Inter, kein Roboto, und bewusst etwas anderes als die Serife der Kaffeeseite.
- **Fließtext: Public Sans** (400, 500). Ruhig, sehr gut lesbar auch bei Sonne auf dem Handy.
- **Mono: IBM Plex Mono** (400, 600). Trägt die Maße: cm, m², Gefälle, Schichtdicken.

## 4. Der Hero (Verkaufsseite, kein Film)

**Der Scroll-Film ist gestrichen.** Der Nutzer wollte ihn nicht mehr, und die Seite ist ohne ihn
besser dran: das Angebot steht sofort da, statt erst nach mehreren Wischern.

Der Hero ist zweigeteilt. Links der Text auf ruhigem Kalkstein-Grund, rechts das Bild. Der Text
steht **neben** dem Bild, nicht darauf. Damit braucht das Bild keinen Filter und der Text keinen
Kontrast-Trick, und die Debatte um Schleier über der Wiese erledigt sich von selbst.

| Element | Copy (wortgleich) |
|---|---|
| Ort (mono) | `PFULLENDORF UND UMGEBUNG` |
| Headline | **„Pflaster, das nach dem Winter noch liegt."** |
| Subline | „Alex Stadelmann macht Einfahrten, Terrassen und Wege, den Aushub dazu mit dem eigenen Bagger. Eine Firma, ein Ansprechpartner, ein Termin." |
| Knöpfe | **Kostenlose Besichtigung anfragen** · **Wie ich baue** |
| Zeile darunter | „Antwort am selben Werktag. Das Angebot bekommen Sie schriftlich, mit jeder Position einzeln." |
| Schild am Bild | **„42 cm tief gebaut"** / „Stein, Splitt, Schotter, Planum. Jede Schicht einzeln im Angebot." |

Die Headline nennt den Nutzen, nicht die Tätigkeit: was der Kunde fürchtet, ist die Fläche, die
sich im Frühjahr senkt. Genau dagegen verkauft Alex.

## 5. Die Vertrauensleiste

Direkt unter dem Hero, vier Punkte, das sind die vier Einwände, die als Erstes kommen:

- **Besichtigung kostenlos** — „Anschauen und aufmessen kostet Sie nichts."
- **Angebot mit Positionen** — „Kein Pauschalzettel. Sie sehen, wofür Sie zahlen."
- **Eigener Bagger** — „Erdarbeiten und Pflaster von derselben Person."
- **Aus der Region** — „Raum Pfullendorf und Landkreis Sigmaringen."

## 6. Die Reihenfolge darunter

Alles trichtert auf **einen** Anker: `#termin` (das Kontaktformular am Ende).

**Nav:** Alex Außenanlagen · Leistungen · Der Aufbau · So läuft's · Fragen · Button „Termin anfragen"

Reihenfolge nach der Reihenfolge der Fragen: erst „macht der meinen Job", dann „warum der und
nicht der Billigere", dann „was passiert, wenn ich anfrage", dann die Einwände, dann das Formular.

**A. Leistungen (drei Bildkarten)**
1. **Pflasterarbeiten** — „Einfahrt, Hofeinfahrt, Terrasse, Wege, Randsteine, Treppen."
2. **Bagger- und Erdarbeiten** — „Aushub, Planum, Verdichten, Kanalgräben, Abtrag und Auffüllung."
3. **Garten- und Außenanlagen** — „Rasenflächen, Beete, Hangbefestigung, Zäune, Pflege der Fläche danach."

**B. Der Aufbau**
- Kicker (mono): `WAS UNTER DEM STEIN LIEGT`
- Headline: „Eine Einfahrt ist vier Schichten tief."
- Text: „Oben liegen acht Zentimeter Stein. Darunter Splitt, darunter Schotter, darunter der
  gewachsene Boden mit dem richtigen Gefälle. Wer an der untersten Schicht spart, sieht es nach
  dem ersten Winter. Deshalb steht in meinem Angebot jede Schicht einzeln drin."

**D. So läuft's (drei Schritte, drei Bilder, alle gleich behandelt)**
1. `SCHRITT 1` — „Ich komme vorbei." — „Wir gehen die Fläche zusammen ab, ich messe auf. Das kostet Sie nichts."
2. `SCHRITT 2` — „Sie bekommen es schriftlich." — „Jede Position einzeln: Aushub, Schotter, Splitt, Stein, Entsorgung. Kein Pauschalzettel."
3. `SCHRITT 3` — „Wir bauen." — „Ein fester Termin, ein Ansprechpartner. Am Ende ist die Baustelle sauber."

**C. Der Mitmach-Moment: der Aufbau-Schnitt** (steht direkt hinter „Der Aufbau", weil es dasselbe Argument zum Anfassen ist)
- Kicker (mono): `ZIEH DEN SCHNITT AUF`
- Headline: „Schauen Sie mal drunter."
- Der Besucher zieht einen Regler und schneidet den Aufbau von oben nach unten auf.
  Vier Schichten, jede mit Maß und einem Satz:
  - `0 bis 8 cm` **Pflasterstein** — „Das ist der Teil, den Sie sehen."
  - `8 bis 12 cm` **Splitt** — „Vier Zentimeter Bett. Hier wird der Stein eingerüttelt."
  - `12 bis 42 cm` **Schotter** — „Die Tragschicht. Hier entscheidet sich alles."
  - `ab 42 cm` **Planum** — „Der gewachsene Boden, verdichtet und mit Gefälle."
- Schlusszeile darunter: „Bei einer Einfahrt für Autos gehe ich tiefer. Was Ihre Fläche braucht, sage ich Ihnen vor Ort."

**D. Leistungen (drei Karten, aus dem Auftrag)**
- **Pflasterarbeiten** — „Einfahrt, Hofeinfahrt, Terrasse, Wege, Randsteine, Treppen."
- **Bagger- und Erdarbeiten** — „Aushub, Planum, Verdichten, Kanalgräben, Abtrag und Auffüllung."
- **Garten- und Außenanlagen** — „Rasenflächen, Beete, Hangbefestigung, Zäune, Pflege der Fläche danach."

**E. Was Sie von mir bekommen (statt erfundener Kundenstimmen)**
- Kicker (mono): `DREI ZUSAGEN`
- „Ich melde mich zurück." — „Am selben Werktag. Auch wenn die Antwort mal nein lautet, weil ich keine Kapazität habe."
- „Der Preis steht schriftlich." — „Mit einzelnen Positionen, damit Sie vergleichen können."
- „Die Fläche bleibt sauber." — „Erde weg, Wege gekehrt, Material abgeholt."
- Kleine ehrliche Zeile darunter: „Echte Kundenstimmen und Fotos von fertigen Flächen kommen hier rein, sobald Alex sie schickt."

**F. Fragen (die echten Einwände aus der Recherche)**
- „Kostet die Besichtigung etwas?" — „Nein. Anschauen und aufmessen kostet Sie nichts."
- „Was kostet ein Quadratmeter?" — „Das hängt am Unterbau und am Stein, nicht am Bauchgefühl. Deshalb messe ich erst und rechne dann. Sie bekommen die Positionen einzeln, damit Sie sehen, wofür Sie zahlen."
- „Wie lange dauert es, bis Sie anfangen können?" — „Sage ich Ihnen beim Termin ehrlich. Lieber ein späterer Termin, der hält, als ein früher, der platzt."
- „Machen Sie auch kleine Sachen?" — „Ja. Ein paar Quadratmeter Weg oder ein Randstein sind auch Arbeit."
- „Wer macht den Aushub?" — „Ich, mit eigenem Bagger. Erdarbeiten und Pflaster kommen von derselben Person."

**G. Der Abschluss (das Formular, CTA-Anker `#termin`)**
- Headline: „Sagen Sie mir, worum es geht."
- Text: „Zwei Sätze reichen. Ich melde mich am selben Werktag zurück."
- Felder: „Name", „Telefon oder E-Mail", „Worum geht es?" · Button: **Anfrage senden**
- Erfolgszustand: „Angekommen. Ich melde mich am selben Werktag."
- Handhabung: **noch offen.** Sobald Alex' E-Mail-Adresse feststeht, geht das Formular über einen
  Formulardienst dorthin, damit die Anfrage schriftlich ankommt. Bis dahin steht klein und ehrlich
  darunter, dass die Seite noch nicht scharf geschaltet ist.

**Footer:** Name, Ort, Platzhalter für Telefon und E-Mail, Hinweis auf fehlendes Impressum,
und der Satz zur Bildherkunft (siehe unten).

## 7. Die Vektor-Ebene (von Hand gezeichnet, SVG)

- **Der Schichtschnitt** als Signature-Element: vier gestapelte Bänder mit Maßangaben in Mono,
  gezeichnet wie ein Bauschnitt. Er zeichnet sich beim Scrollen selbst und ist gleichzeitig der
  Mitmach-Moment aus Abschnitt C. Kommt als kleines Zeichen auch in der Nav vor.
- **Die Maßlinie:** eine dünne Linie mit Endstrichen, die sich beim Scrollen aufzieht und die
  Tiefe in Zentimetern mitzählt.
- **Rasenkante:** eine leicht unruhige gezeichnete Linie als Trenner zwischen zwei Abschnitten.
- Eine feste Hintergrund-Ebene: sehr langsam wanderndes warmes Licht über dem Kalkstein-Ton.
- Alles respektiert reduzierte Bewegung: Endzustände sichtbar, Antriebe aus.

## 8. Die Technik-Liste

Ein einziges HTML-File, kein Framework, kein Build-Schritt. Schriften im Projekt. Auftritte beim
Scrollen als Einblendung, `prefers-reduced-motion` schaltet sie live in beide Richtungen ab.
Formular mit Prüfung der Pflichtfelder. Der Aufbau-Regler ist mit Tastatur bedienbar.

**Gemessen statt geschätzt:** 1.374 KB komplett, Ladezeit lokal 74 ms, 0 Konsolenfehler, der
Haupt-Knopf endet bei 547 px und steht damit über der Kante, und auf 375, 768 und 1440 px ragt
Element für Element nichts seitlich heraus.

**Kein Scroll-Film.** Die Bildfolge (12 MB, 141 Einzelbilder) ist entfernt. Sie liegt in der
Git-Geschichte, falls sie je wieder gebraucht wird.

## 9. Das Copy-Gate

Jede Zeile oben geht wortgleich in den Build. Vor der ersten Vorschau muss `index.html` durch das
Gate: null Gedankenstriche, null Floskeln, dazu der Durchgang gegen die leiseren KI-Marker.
Absichtliche Marken-Figuren bleiben, zum Beispiel „Pflaster hält nicht oben. Pflaster hält unten."

## 10. Offenlegung der Bilder

Die Bilder und der Film sind KI-erzeugt, es sind keine Fotos von Alex' Baustellen. Das steht
sichtbar im Footer, bis echte Fotos da sind. Der Nutzer entscheidet, ob die Zeile bleibt oder ob
die Bilder später ausgetauscht werden.
