# Webseitenbau-Standard (Skill `10k-websites`)

**Ab sofort gilt: jede neue Webseite in diesem Repo wird nach diesem Standard gebaut.**
Der Skill liegt installiert unter `.agents/skills/10k-websites/` (verlinkt nach `.claude/skills/`)
und ist **unverändert** übernommen. Diese Datei ist die Kurzfassung plus die wenigen Stellen,
an denen unsere Realität (Hosting, Sprache, Recht, Skalierbarkeit) vom Original abweicht.

Reihenfolge der Autorität beim Webseitenbau:
1. Direkte Anweisung des Nutzers im Chat
2. `.agents/skills/10k-websites/SKILL.md` + seine `references/`
3. Die Abweichungen weiter unten in dieser Datei
4. Alles andere im Repo

Wenn ein anderer Webseiten-Skill installiert ist (`restaurant-website-builder`, `design-taste-frontend`,
`impeccable`, …), **regiert `10k-websites` den Ablauf.** Andere Skills dürfen als Werkzeug für einen
Einzelschritt dienen, nie als zweiter Ablaufplan. Bestehende Seiten (Chinatown, Kfz-Landingpage)
werden nicht automatisch umgebaut, sondern nur wenn der Nutzer es sagt.

---

## Was der Skill baut

Eine Webseite, die sich wie ein Film anfühlt: ein KI-generiertes Hero-Video läuft beim Scrollen
vorwärts und beim Zurückscrollen rückwärts, Texte erscheinen um das Bild herum, und danach geht die
Seite in eine echte Webseite über: Sektionen, echte Texte, **ein** klarer Call-to-Action.
Reines HTML, CSS, JavaScript. Ein Ordner, kein Build, ein Befehl zum Veröffentlichen.

Der Anspruch dahinter: die Seite soll aussehen, als hätte sie mehrere tausend Euro gekostet.
„Schön" ist nur das Eintrittsgeld, verkauft wird über Struktur und Text.

## Die 11 Phasen (Kurzfassung)

| Phase | Was passiert | Merksatz |
|---|---|---|
| 1 | Setup-Assistent: Werkzeuge prüfen (Bildgenerator, ffmpeg, Node), Kosten ehrlich ansagen | Erste Nachricht an den Nutzer ist **immer** die Checkliste, nie eine Design-Frage |
| 2 | Design-Gespräch: Was ist es, für wen, welches Gefühl, welches Material hat der Kunde | Eine Frage pro Nachricht, als anklickbare Auswahl |
| 3 | Kundenrecherche: echte Bewertungen und Foren lesen, Originalsprache der Käufer sammeln | Texte in den Worten der Käufer, alles trichtert auf **einen** CTA |
| 4 | Tiefe wählen: Tier 1 (ein 6-Sekunden-Shot), Tier 2 (verkettete Reise), Tier 3 (durchchoreografiert) | Erster Bau startet auf Tier 1 |
| 5 | **Erst die Seite entwerfen, dann den Film storyboarden** (Design-Paket schreiben) | Der Generator weiß nie, dass er eine Webseite macht |
| 6 | Hero erzeugen: Startbild, Modellwahl, Video, Stills, mit Preis-Ansage vor jedem Schritt | Jeder Preis wird vorher genannt, `get_cost` ist gratis |
| 7 | Material aufbereiten (ffmpeg): Scrub-Encode, Poster, Endframe, Stills | Rohdateien nie im Deploy-Ordner |
| 8 | Seite bauen: `index.html` + `assets/`, kein Framework, Texte wortgleich aus dem Design-Paket | Die ganze Seite ist animiert, nicht nur das Hero |
| 9 | Selbsttest, bevor der Nutzer irgendwas sieht | Der Nutzer findet keine Fehler mehr |
| 10 | Online stellen und live nachmessen | Erst prüfen, dann „fertig" sagen |
| 11 | Politur-Runden, danach Dauerbereitschaft | Änderung = ein Satz vom Nutzer |

## Die Gates (nie überspringen)

- **Storyboard-Gate:** Freigabe vor jeder Generierung. Das billigste Gate der ganzen Kette.
- **Bild-Gate:** Startbild selbst anschauen (Marken, Anatomie, Komposition), dann zeigen.
- **⛔ Video-Gate:** Video außerhalb des Deploy-Ordners ablegen, der Nutzer schaut es an, bevor die
  Seite drumherum gebaut wird. Bei verketteten Reisen pro Segment. Drei Fehlversuche = Konzeptfehler,
  nicht Promptfehler: Konzept wechseln.
- **Copy-Gate (Phase 9):** `index.html` nach Gedankenstrichen und Floskeln durchsuchen, jeden Treffer
  umschreiben, bis die Suche null Treffer liefert. Danach der Durchgang gegen die leiseren KI-Marker.
- **Selbsttest-Gate:** die komplette Checkliste am Ende von `references/scrub-pipeline.md`.

## Die 12 Hero-Gesetze in einem Satz pro Stück

1. Die Bewegung passt zum Scrollen (runter muss sich wie runter anfühlen).
2. Ein Motiv, eine durchgehende Bewegung, kein Schnitt.
3. Bahn festhalten, Körper frei lassen: nie das Motiv einfrieren.
4. Das Ende zuerst planen, es ist die Ruheposition der Seite.
5. Gutmütige Motive wählen: Flüssigkeit, Nebel, Licht, Stoff. Keine Hände und Tastaturen in Großaufnahme.
6. Senkrechte Bewegungsachse bevorzugen.
7. Für das Layout komponieren: Platz für die Texte freilassen.
8. Übergänge körperlich machen (Spritzer, Tropfen auf der Linse, kurzer Unschärfe-Moment).
9. Produkt im Hero: entweder Marke aufbringen oder nah genug ranfahren.
10. Text über Video braucht ein Lesbarkeits-System, geprüft am **schlechtesten** Einzelbild.
11. Text in Scroll-Strecke takten, nicht in Sekunden. Getestet wird mit echten Scroll-Stößen.
12. Dauerregeln: „kein Text, keine Logos" in jeden Prompt, Presets ablehnen, nie um ein nicht
    freigegebenes Video herum bauen.

## Der technische Kern (aus `references/scrub-pipeline.md`)

- Video als **Blob** laden, nicht per Range-Request. Über ~8 MB gestreamt, mit ehrlichem Ladering,
  Watchdog nach 20 Sekunden ohne Fortschritt, Poster zuerst.
- Zeit **weich nachziehen** (lerp) in einer rAF-Schleife, die sich schlafen legt, framerate-unabhängig.
- **Seeks gattern:** nie ein `currentTime` schreiben, solange das vorige noch läuft. Fehler-Handler
  löst die Sperre, sonst blockiert das Scrubben dauerhaft.
- **Nur bei Änderung ins DOM schreiben**, Textwerte zusätzlich auf ~10 Hz drosseln.
- **Textbänder** in vh takten: Plateau ca. 80 bis 130vh, Rampen ca. 20vh, geprüft mit dem Flick-Test.
- **Lesbarkeit in vier Schichten:** Grund-Scrim, Band-Scrim, Textschatten-Token, Chip für Kleintext.
  Kontrast mindestens 3,5:1 am schlechtesten Pixel.
- **Fünf Gates für das statische Hero** (Handy, Tablet hochkant, grober Zeiger hochkant, Handy quer,
  reduzierte Bewegung): identisch in CSS und JS, **live** über `change`-Listener, nicht einmal beim Laden.
- Die Seite ist **komplett und schön, auch wenn das Video nie lädt.**
- Qualitätsboden: echte Schriften (nie Inter oder Roboto als Display), Kontrast rechnen statt raten,
  Landmarks und Skip-Link, `:focus-visible`, 44px Touchflächen, Favicon, og-Tags beim Deploy nachtragen.

## Selbsttest vor dem Zeigen

Screenshots in vier Größen, jeden Button und das Formular auslösen, Hero oben/mitte/unten scrubben,
Flick-Test (120/240/360px), Lesbarkeits-Audit, jede Einblendung beweisen, Seitwärts-Scrollen
provozieren, reduzierte Bewegung an und **mitten im Betrieb umschalten**, Video-Datei wegnehmen,
Konsole prüfen, Buchstabenunterlängen prüfen, zum Schluss der Blick mit frischen Augen.

---

# Abweichungen für Clickculture (das gilt zusätzlich)

Der Skill ist auf zwei fremde Dienste geschrieben (Higgsfield für Bild/Video, Hostinger fürs Hosting)
und auf englische Texte. Bei uns gilt stattdessen:

### 1. Hosting: Netlify oder Vercel statt Hostinger
Phase 10 läuft über unseren Weg aus `anleitungen/landingpage-hosten.md` (Netlify per GitHub, Publish
Directory zeigt auf den Seitenordner) oder Vercel wie bei `nischen/chinatown/webseite/`.
Alles andere aus `references/deploy.md` bleibt gültig, insbesondere:
og-Tags **vor** dem Deploy auf die echte URL setzen, live selbst prüfen (HTTPS, 200, Video-URL,
saubere Konsole), Geschwindigkeit **messen** statt schätzen, danach Test auf dem echten Handy.

### 2. Bild und Video: Higgsfield ist Kür, nicht Pflicht
Ohne Generator-Zugang wird nicht gewartet, sondern das statische Hero gebaut: echtes Kundenmaterial
(Vorher/Nachher-Fotos aus dem Onboarding) als komponiertes Standbild, mit denselben Textbändern,
demselben Lesbarkeits-System und derselben Animationsdichte. Die Gates für Bilder und der
Marken-Check gelten für jedes Bild, egal woher es kommt.
Kosten, wenn generiert wird: Startbild ca. 2 Credits, Video ca. 10 bis 55 Credits je nach Modell.
Preis **immer vorher** ansagen, `get_cost` ist gratis.

### 3. Sprache: alles auf Deutsch, Copy-Gate auf Deutsch
Das Verbot der Gedankenstriche und der Floskeln gilt sinngemäß. Unsere Suchliste für Phase 9,
zusätzlich zur englischen aus dem Skill:
`ganzheitlich`, `maßgeschneidert`, `innovativ`, `Lösungen`, `nahtlos`, `Synergien`, `zukunftssicher`,
`Mehrwert`, `professionell und zuverlässig`, `Ihr Partner für`, `nicht nur … sondern auch`.
Jeder Treffer wird in einen geraden Satz umgeschrieben. Absichtliche Marken-Figuren aus dem
Design-Paket (ein geplanter Dreiklang, ein kurzer Schlagsatz) bleiben stehen.

### 4. Recht: DSGVO gehört zum Qualitätsboden
Jede Kundenseite bekommt Impressum und Datenschutz, Schriften werden **selbst gehostet** statt von
Google Fonts geladen, kein Tracking ohne Einwilligung. Das ist kein Extra, sondern Teil von „fertig".

### 5. Formulare: kein `mailto` bei echten Kunden
Der Skill lässt vier Wege zu. Bei uns gilt: eine Kundenseite, die echte Anfragen bekommt, nutzt
Netlify Forms oder Formspree, damit der Lead schriftlich ankommt und der Speed-to-Lead messbar bleibt.
`mailto` nur für Demo- und Vorzeigeseiten. Danach zählt weiter, was im Playbook steht:
Rückruf unter einer Stunde.

### 6. Skalierbarkeit schlägt Einzelfall-Schönheit (Playbook-Prinzip 1)
Für **Kunden-Landingpages** in der Kfz-Nische bleibt die Regel aus `CLAUDE.md` in Kraft:
ein LP-Skelett, getauscht wird nur das Service-Modul. Nichts pro Klient hart verdrahten.
Das heißt konkret:

| Was gebaut wird | Wie tief nach `10k-websites` |
|---|---|
| Kunden-Landingpage (Kfz, 25 km Umkreis, Lead-Ziel) | Design- und Technikboden komplett, aber **eine** Vorlage für alle. Kein eigenes Hero-Video pro Kunde, solange das Modell 999 €/Monat kostet. Kundenmaterial im Standbild-Hero. |
| Eigene Agentur- oder Pitch-Seite von Clickculture | Volle Tiefe, gern Tier 2. Hier ist die Seite selbst das Verkaufsargument. |
| Einzelkunde mit eigenem Auftritt (z. B. Chinatown) | Volle Tiefe, Tier 1, wenn der Kunde es bezahlt oder es der Referenz dient. |

Der ehrliche Grund für diese Tabelle: ein 6-Sekunden-Hero-Video pro Werkstatt kostet Zeit und Credits
pro Kunde und bricht Prinzip 1, sobald mehr als eine Handvoll Kunden da sind. Die Gesetze, die Gates,
das Lesbarkeits-System, der Qualitätsboden und der Selbsttest gelten dagegen **überall**, weil sie
nichts pro Kunde kosten.

### 7. Der Ton bleibt
Freundlicher Fachmann, kurze Sätze, jede Frage als Auswahl zum Anklicken, Preis vor jeder Ausgabe,
und wenn etwas schiefgeht: ein ruhiger Satz, was passiert ist und was jetzt getan wird.
