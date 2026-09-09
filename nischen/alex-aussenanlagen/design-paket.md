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

## 4. Die Band-Karte (Hero)

Der Film: die Kamera sinkt langsam senkrecht auf eine frisch gepflasterte Fläche am Rasenrand,
Abendsonne von rechts, die Fugen treten hervor, zum Schluss steht sie dicht über der Fläche still.

**Der Film ist das Hauptelement, nicht die Kulisse.** Deshalb liegt über dem Bild an keiner Stelle
ein Schleier, und es gibt nur **zwei** Textmomente statt vieler kurzer Einblendungen. Dazwischen
läuft die Fahrt ohne jede Überlagerung durch. Der Scrollweg ist 900vh lang, damit sie trägt.

| Schild | Bereich | Moment im Film | Copy (wortgleich) | Entrance |
|---|---|---|---|---|
| 1 | 0.00 bis 0.12 | hoch über der Fläche, Muster noch grob | Kicker: `ALEX STADELMANN` / **„Das Schöne sieht man. Das Wichtige nicht."** / „Alex Stadelmann, Außenanlagen im Raum Pfullendorf." | Drift-down, die Wörter sinken wie die Kamera |
| frei | 0.12 bis 0.80 | die Fläche kommt näher, Fugen werden scharf, Licht streift die Kanten | **kein Text** | — |
| 2 | 0.80 bis 1.00 | steht still, Rasenkante und lange Schatten | **„Ich schaue es mir an. Dann bekommen Sie es schriftlich."** / „Besichtigung kostenlos, Angebot mit einzelnen Positionen." / CTA: **Termin anfragen** · **Wie ich baue** | Wort-für-Wort-Aufstieg, dann Subline, dann CTA |

**Das Schild** ist das einzige Element, das das Bild berührt: eine kompakte dunkle Fläche in
Basalt (`rgba(21,25,19,.9)`) mit heller Schrift und einer Kante in Ocker links, nur so groß wie
der Text selbst, unten links auf der ruhigen Rasenfläche. Es bringt seinen Kontrast selbst mit,
statt das Bild aufzuhellen.

Zwei Sprüche sind aus der ersten Fassung ersatzlos gestrichen („Pflaster hält nicht oben.
Pflaster hält unten." und „Bagger, Erde, Stein. Alles von mir."). Ihre Inhalte stehen weiter
unten auf der Seite ohnehin: der Unterbau im Abschnitt „Der Aufbau", die eigene Maschine in den
Leistungen.

**Die Navigation** bekommt über dem Film dasselbe Material: eine schmale dunkle Leiste mit heller
Schrift, die nach unten ausläuft. Grund ist eine Messung, keine Vorliebe: das Laub unter der
Zeile hat gleichzeitig fast weiße und fast schwarze Stellen, an denen weder dunkle noch helle
Schrift allein trägt. Unterhalb des Films kippt die Leiste zurück auf dunkle Schrift über hellem
Grund.

**Der Film hört nicht abrupt auf:** der erste Abschnitt darunter („Der Aufbau") trägt das
Schlussbild als eigene Ebene weiter und blendet es in den Kalkstein-Ton aus. Als Ebene innerhalb
der Sektion, nicht mit `background-attachment:fixed`, weil das auf iPhones ruckelt.

## 5. Statisches Hero (Handy, reduzierte Bewegung)

- Headline: **„Ich schaue es mir an. Dann bekommen Sie es schriftlich."**
- Subline: „Alex Stadelmann, Außenanlagen im Raum Pfullendorf. Pflaster, Erdarbeiten, Garten."
- CTA: **Termin anfragen** · **Wie ich baue**
- Hintergrund: das Schlussbild des Films, unangetastet. Der Text sitzt auf demselben Schild wie
  im Film, es liegt keine Aufhellung über dem Bild.

## 6. Was unter dem Hero kommt

Alles trichtert auf **einen** Anker: `#termin` (das Kontaktformular am Ende).

**Nav:** Alex Außenanlagen · Der Aufbau · So läuft's · Leistungen · Fragen · Button „Termin anfragen"

**A. Der Aufbau (Übergang aus dem Schlussbild)**
- Kicker (mono): `WAS UNTER DEM STEIN LIEGT`
- Headline: „Eine Einfahrt ist vier Schichten tief."
- Text: „Oben liegen acht Zentimeter Stein. Darunter Splitt, darunter Schotter, darunter der
  gewachsene Boden mit dem richtigen Gefälle. Wer an der untersten Schicht spart, sieht es nach
  dem ersten Winter. Deshalb steht in meinem Angebot jede Schicht einzeln drin."

**B. So läuft's (drei Schritte, drei Bilder, alle gleich behandelt)**
1. `SCHRITT 1` — „Ich komme vorbei." — „Wir gehen die Fläche zusammen ab, ich messe auf. Das kostet Sie nichts."
2. `SCHRITT 2` — „Sie bekommen es schriftlich." — „Jede Position einzeln: Aushub, Schotter, Splitt, Stein, Entsorgung. Kein Pauschalzettel."
3. `SCHRITT 3` — „Wir bauen." — „Ein fester Termin, ein Ansprechpartner. Am Ende ist die Baustelle sauber."

**C. Der Mitmach-Moment: der Aufbau-Schnitt** (das eine gestaltete Element zum Anfassen)
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

Wie bei Tagwerk, inklusive der dort gemessenen Abweichung: **der Hero läuft als Bildfolge auf
einer Zeichenfläche mit Überblendung zwischen den Einzelbildern**, nicht als Video. Dazu
dt-normalisierter Lerp mit ruhender rAF-Schleife, DOM-Schreibzugriffe nur bei Änderung,
Band-Pacing mit Flick-Test, die fünf Gates für das statische Hero live über change-Listener,
Seite komplett ohne die Bildfolge, Schriften im Projekt, Qualitätsboden.

**Achtung, anderer Weg als bei Tagwerk:** Der Film ist hell und stark. Statt das Bild für den
Text aufzuhellen, bekommt der Text seine eigene dunkle Fläche. Über dem Bild liegt nichts.
Der Kontrast wird genauso gemessen, Boden 3,5 zu 1, und weil die Schrift jetzt hell auf dunkel
sitzt, zählt das **hellste** Pixel unter dem Text statt des dunkelsten.

## 9. Das Copy-Gate

Jede Zeile oben geht wortgleich in den Build. Vor der ersten Vorschau muss `index.html` durch das
Gate: null Gedankenstriche, null Floskeln, dazu der Durchgang gegen die leiseren KI-Marker.
Absichtliche Marken-Figuren bleiben, zum Beispiel „Das Schöne sieht man. Das Wichtige nicht."

## 10. Offenlegung der Bilder

Die Bilder und der Film sind KI-erzeugt, es sind keine Fotos von Alex' Baustellen. Das steht
sichtbar im Footer, bis echte Fotos da sind. Der Nutzer entscheidet, ob die Zeile bleibt oder ob
die Bilder später ausgetauscht werden.
