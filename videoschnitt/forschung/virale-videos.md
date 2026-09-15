# Was virale Kurzvideos wirklich anders machen

Recherche für das Videoschnitt-Werkzeug. Alles hier ist entweder **im Werkzeug umgesetzt**
oder steht bewusst unter „nicht belegt". Ganz unten steht, was ich nicht nachweisen konnte —
das ist genauso wichtig wie der Rest.

**Warnung vorweg zur Qualität der Quellen:** Fast alles in diesem Feld kommt von
Werkzeug-Anbietern und Agenturen, die etwas verkaufen wollen. Harte Studien gibt es kaum.
Die einzigen Zahlen von der Plattform selbst kommen von Meta. Ich habe deshalb überall
dazugeschrieben, wie belastbar eine Aussage ist.

---

## 1. Die ersten drei Sekunden entscheiden alles

**Befund:** Zuschauer entscheiden in etwa 2–3 Sekunden, ob sie weiterschauen. Die häufigste
Form des Scheiterns ist ein Abfall von 30–50 % zwischen Sekunde 1 und 3 — die sogenannte
Klippe. Videos, die diese Klippe überstehen, laufen fast immer.

**Belastbarkeit:** mittel. Von mehreren Anbietern übereinstimmend berichtet, aber ohne
offengelegte Datengrundlage.

**Im Werkzeug umgesetzt:** Der Hook (`titelband`) startet jetzt bei Sekunde 0,15 statt
irgendwann. Das Werkzeug **warnt**, wenn kein Hook gesetzt ist.

Quellen: [Aibrify — Retention-Kurve](https://aibrify.com/blog/youtube-shorts-retention-curve-playbook) ·
[HypeNest — Hooks und Retention](https://hypenest.ai/blogs/tiktok-algorithm-2026-video-hooks-retention) ·
[Teleprompter — Short-Form-Strategie](https://www.teleprompter.com/blog/short-form-video-strategy)

---

## 2. Schnitttempo: alle 1–3 Sekunden passiert etwas

**Befund:** Bei der meistkopierten Machart (Hormozi-Stil) liegt die durchschnittliche
Einstellungslänge bei **1–3 Sekunden**. Alle 1–2 Sekunden kommt ein Schnitt oder ein
Zoomsprung. Stille und Atempausen werden vollständig entfernt. Der Leitsatz dahinter:
Jede Sekunde ändert sich etwas — ein Schnitt, ein Zoom oder eine Grafik.

**Belastbarkeit:** hoch, was die Beschreibung angeht (jeder kann es nachzählen).
Niedrig, was den Nachweis angeht, dass es *ursächlich* mehr Reichweite bringt.

**Im Werkzeug umgesetzt:** Neue Tempo-Voreinstellungen. `TEMPO=schnell` schneidet auf
maximal 2,0 Sekunden pro Einstellung, `normal` auf 2,8 (neue Grundeinstellung, vorher 3,5),
`ruhig` auf 4,0.

Quellen: [Joyspace — Hormozi-Stil 2026](https://joyspace.ai/hormozi-editing-style-2026-analysis) ·
[Riverside — Hormozi-Stil](https://riverside.com/blog/hormozi-style-videos) ·
[Joyspace — Pattern Interrupt](https://joyspace.ai/pattern-interrupt-reset-attention-span)

---

## 3. Der langsame Zoom ist kein Effekt, sondern ein Werkzeug

**Befund:** Der „Hormozi-Puls" — langsam auf den Sprecher zufahren, dann hart rausschneiden —
ahmt nach, wie menschliche Aufmerksamkeit arbeitet. Er erzeugt Abwechslung aus einer einzigen
Kameraeinstellung, ohne vom Inhalt abzulenken.

**Belastbarkeit:** mittel. Die Wirkung ist plausibel und überall kopiert, aber nicht gemessen.

**Im Werkzeug umgesetzt:** Zooms wechseln automatisch durch (ran / raus / leicht ran), und
die Stärke hängt an der Länge der Einstellung — kurze Einstellungen bekommen weniger Zoom,
sonst wirkt es hektisch.

---

## 4. Untertitel Wort für Wort, nicht satzweise

**Befund:** Die hervorgehobene Wort-für-Wort-Darstellung hält den Blick am Text, weil der
Zuschauer nie „fertig gelesen" ist, bevor der Satz gesprochen ist. Zweiter Kanal neben dem
Ton: Lesen **und** Hören. Auf TikTok, Reels und Shorts ist das der Standard.

**Belastbarkeit:** mittel bis hoch für die Aussage „Untertitel helfen" (sehr viele Videos
laufen ohne Ton). Niedrig für die genaue Behauptung „Wort für Wort schlägt satzweise um X %" —
diese Zahl behauptet jeder Anbieter, keiner belegt sie.

**Im Werkzeug umgesetzt:** Wort-für-Wort mit farbigem aktivem Wort, 2–3 Wörter gleichzeitig,
Zeilenumbruch bei Satzende und bei Atempausen.

Quellen: [Fliki — eingebrannte Untertitel](https://fliki.ai/blog/burned-in-subtitles) ·
[Braiv — Karaoke-Untertitel](https://www.braiv.co/features/karaoke-style-animated-captions)

---

## 5. Sichere Zonen — der am häufigsten übersehene Fehler

**Befund:** Die Bedienoberfläche der App liegt **über** dem Video. Auf 1080 × 1920 gilt grob:

| Bereich | Wird verdeckt von |
|---|---|
| oben ca. 110 px | Profilzeile, Suchleiste |
| unten ca. 320–400 px | Bildunterschrift, Musiktitel, Fortschritt |
| rechts ca. 120–180 px | Herz, Kommentare, Teilen, Profilbild |
| links ca. 60 px | Rand |

Die Bildunterschrift **wächst**, wenn ein Zuschauer sie antippt. Deshalb empfehlen mehrere
Quellen, wichtige Inhalte mindestens **370 px** über dem unteren Rand zu halten.

**Belastbarkeit:** hoch. Das ist nachmessbar, mehrere Quellen kommen auf denselben Bereich.
TikTok selbst sagt allerdings, die Zone ändert sich je nach Format und Anzeigenart — vor dem
Hochladen einmal in der App ansehen bleibt Pflicht.

**Im Werkzeug umgesetzt:** Alle Texte und Grafiken sitzen jetzt in einem Sicherheitsrahmen
(oben 6 %, unten 23 %, links 6 %, rechts 17 %). Mit `RAHMEN=1` beim Rendern wird der Rahmen
sichtbar eingeblendet, zum Prüfen.

Quellen: [Kreatli — TikTok Safe Zone](https://kreatli.com/guides/tiktok-safe-zone) ·
[CheckSafe.Zone — Maße](https://checksafe.zone/articles/tiktok-safe-area-overlay-guide-2026) ·
[House of Marketers — Safe Zones](https://houseofmarketers.com/guide-to-safe-zones-tiktok-facebook-instagram-stories-reels/)

---

## 6. Die Schleife: das Ende sieht aus wie der Anfang

**Befund:** Zwei Arten. **Bild-Schleife** — das letzte Bild gleicht dem ersten, der Neustart
fällt nicht auf. **Erzähl-Schleife** — der Schluss lässt den ersten Satz neu bedeuten.
Der Zuschauer schaut nochmal, ohne es zu entscheiden. Das verdoppelt die Sehdauer pro
Auslieferung, ohne eine einzige Sekunde mehr Material.

Wichtige Einschränkung aus derselben Quelle: **Für Anleitungen und Erklärvideos taugt die
Schleife nicht** — wer den Nutzen hat, schaut nicht nochmal. Sie wirkt bei Geschichten,
Humor und Verwandlungen (Vorher/Nachher).

**Belastbarkeit:** mittel. Der Mechanismus ist logisch und die Zahl „7–15 Sekunden laden zum
Nochmal-Schauen ein" taucht mehrfach auf, ist aber nicht belegt.

**Im Werkzeug umgesetzt:** `SCHLEIFE=an` hängt den Anfang des ersten Ausschnitts hinten an,
sodass der Neustart weich wirkt. Statt oder zusätzlich zum Abspann.

Quellen: [virvid — Looping Structure](https://virvid.ai/blog/looping-structure-shorts-retention-2026) ·
[Digital Blacksmiths — loopbare Shorts](https://digitalblacksmiths.io/youtube-shorts-algorithm-secret-loopable-videos-increase-watch-time/)

---

## 7. Das Einzige mit echten Plattform-Zahlen: Meta

**Befund:** Meta berichtet für Reels-Anzeigen, die **9:16, mit Ton und mit den wichtigen
Elementen in der sicheren Zone** gebaut sind, **34,5 % geringere Kosten pro Ergebnis**
als Bildanzeigen. Weiter: 70–80 % der Reels-Zuschauer haben den Ton an. Und — für uns
wichtig — **Anzeigen, die mit dem Logo aufmachen, signalisieren „Werbung" und werden
weggewischt.** Marke gehört nach hinten oder beiläufig ins Bild.

**Belastbarkeit:** die höchste in diesem Dokument, weil sie von der Plattform selbst kommt.
Trotzdem ist es Marketingmaterial von Meta für Meta.

**Im Werkzeug umgesetzt:** Der Abspann steht am **Ende**, nie am Anfang. Im Werbeclip steht
der Name des Betriebs erst in der letzten Szene. Die Lautstärke wird angeglichen (siehe
Punkt 8), damit „mit Ton" auch wirklich hörbar ist.

Quelle: [Meta for Business — Reels-Anzeigen](https://www.facebook.com/business/ads/facebook-instagram-reels-ads)

---

## 8. Lautstärke: der Fehler, der wie „kein Ton" aussieht

**Befund:** Plattformen liefern auf etwa **−14 LUFS** aus. Eine Handyaufnahme liegt oft bei
−30 dB und wirkt neben jedem anderen Video tonlos.

**Belastbarkeit:** hoch, das ist Technik und nachmessbar.

**Im Werkzeug umgesetzt:** Nach jedem Rendern wird auf −14 LUFS angeglichen, Tonspur auf
48 kHz. Genau dieser Fehler ist uns hier einmal passiert: Der erste Schnitt kam mit −31,9 dB
raus, also so leise wie das Rohmaterial.

---

## 9. Länge

**Befund:** 7–15 Sekunden laden zum Nochmal-Schauen ein (Schleifen-Logik). Für Werbung
nennen die Quellen 15–30 Sekunden als brauchbaren Bereich. Gute Shorts erreichen
55–70 % durchgeschaut, die besten 80–90 %.

**Belastbarkeit:** niedrig bis mittel. Die Spannen widersprechen sich zwischen den Quellen.

**Nicht ins Werkzeug eingebaut** — Länge ist eine inhaltliche Entscheidung, keine technische.

---

## 10. Alle 3 Sekunden ein neuer Reiz

**Befund:** In kurzen Videos (15–60 s) sollen Musterbrüche **alle 3–5 Sekunden**
kommen — ein harter Schnitt, ein Zoom, ein Perspektivwechsel, ein Geräusch, eine
Einblendung. Der Grund: Das Gehirn schaltet sonst in den Scroll-Leerlauf.
Dieselbe Quelle nennt als Zahl, dass 65 % der Nutzer in den ersten 3 Sekunden
entscheiden. Ein schneller Schnitt liest sich als Energie, ein langsames Ranfahren
als Nähe, ein unerwarteter Zoom als Überraschung — die Reize haben also
unterschiedliche Bedeutung, sie sind nicht austauschbar.

**Belastbarkeit:** mittel. Die Beschreibung stimmt nachweislich (man kann es in
jedem erfolgreichen Video nachzählen). Die Wirkungsbehauptung ist nicht belegt,
und die Spanne „3–5 s" schwankt je nach Quelle.

**Im Werkzeug umgesetzt:** Der Planer zählt alle Reize (Schnitte, Grafiken,
Bildstöße, Klänge), rechnet die größte Lücke aus und **warnt**, wenn sie über
3 Sekunden liegt. Einstellbar mit `REIZ=`.

Quellen: [Edición Video Pro — Pattern Interrupts](https://edicionvideopro.com/en/editing-for-platforms-video-marketing/pattern-interrupts-tiktok-retention-guide/) ·
[Joyspace — Pattern Interrupt](https://joyspace.ai/pattern-interrupt-reset-attention-span) ·
[LightningIM — 12 Techniken](https://lightningim.com/12-powerful-pattern-interrupt-video-editing-techniques-that-boost-engagement/)

---

## 11. Vlogs folgen anderen Regeln als Talking Heads

**Befund:** Beim Vlog trägt der **Übergang** die Bewegung von einer Aufnahme in die
nächste. Ein Whip-Pan (Kamera reißt zur Seite, Bild wird unscharf) verbindet zwei
Orte, ein Match Cut verbindet zwei ähnliche Formen oder Bewegungen. Für die Tonspur
gilt J-Cut und L-Cut: Der Ton der nächsten Aufnahme setzt vor dem Bild ein (oder
umgekehrt), damit der Schnitt nicht auffällt.

Zum Tempo: **1–2 Sekunden pro Aufnahme bei Action, 4–6 Sekunden bei Landschaft oder
Stimmung.** Wichtiger Hinweis aus derselben Quelle: Bei starkem Helligkeitsunterschied
zwischen zwei Aufnahmen legt ein Whip-Pan den Unterschied offen, weil die Unschärfe
die Lichter auseinanderzieht — deshalb vorher farblich angleichen.

**Belastbarkeit:** hoch, was das Handwerk angeht. Das ist Schnittlehre, keine
Plattform-Behauptung.

**Im Werkzeug umgesetzt:** Eigene Komposition `Vlog` mit echten Übergängen
(Whip, Zoom, Weißblitz und die Remotion-Übergänge), Musikspur mit weichem Ein- und
Ausblenden, Orts- und Zeitkarten. Der Look wird über alle Szenen gleich gelegt —
genau wegen des Helligkeitsproblems.

Quellen: [Inside Editors — Übergänge](https://insideeditors.com/video-editing-transitions/) ·
[Captions — sechs Schnittarten](https://captions.ai/blog/six-common-types-of-cuts-in-film) ·
[Inside The Edit — Pacing](https://www.insidetheedit.com/blog/pacing-in-video-editing)

---

## Was NICHT belegt ist

Ehrlich aufgelistet, damit niemand später darauf baut:

1. **Keine einzige Prozentzahl zur Wirkung von Untertitel-Stilen ist belegt.** „Wort für Wort
   erhöht die Sehdauer um X %" behaupten mehrere Anbieter von Untertitel-Werkzeugen. Keiner
   nennt eine Datengrundlage. Dass Untertitel überhaupt helfen, ist plausibel — die genaue
   Zahl ist Verkaufstext.

2. **Zu Textanimationen (einfliegen, tippen, aufpoppen) gibt es nichts Brauchbares.** Die
   Suche liefert fast nur Verkaufsseiten für Vorlagen. Welche Animation besser wirkt, ist
   unbekannt. Unsere Entscheidung dafür ist Geschmack, nicht Wissen.

3. **Fortschrittsbalken und Countdown: keine Belege.** Die Suche dazu ergab ausschließlich
   Stock-Material-Shops. Der Balken ist bei uns drin, weil er in vielen erfolgreichen Videos
   vorkommt — das ist Nachahmung, kein Nachweis.

4. **„Der Algorithmus bevorzugt X" ist bei allen Plattformen unbelegt.** Niemand außerhalb
   der Unternehmen kennt die Gewichtung. Alle Aussagen dazu sind Rückschlüsse aus
   Beobachtung.

5. **Die Soundeffekte sind Handwerk, kein Befund.** Dass ein Whoosh auf dem Schnitt
   das Video „gemachter" wirken lässt, ist meine Erfahrung und die gängige Praxis —
   gemessen hat das niemand. Genauso die Farblooks.

6. **Kein einziger Befund ist an deutschsprachigem Material aus einer lokalen Nische
   geprüft.** Alles kommt aus dem englischsprachigen Creator-Umfeld. Ob eine Kfz-Werkstatt
   in Pfullendorf dieselbe Machart braucht wie ein US-Unternehmer mit Millionenreichweite,
   ist offen. **Das entscheidet erst unser eigenes Material.**

---

## Was das für uns heißt

Die belastbaren Punkte sind die technischen: sichere Zonen, Lautstärke, 9:16, Untertitel
überhaupt, Marke nach hinten. Die sind alle eingebaut und kosten nichts.

Die Machart (Tempo, Zooms, Grafiken) ist gut begründete Nachahmung, kein Wissen. Deshalb
ist sie im Werkzeug **einstellbar** und nicht festgeschraubt — sobald eigene Zahlen da sind,
wird nachjustiert.

Nächster Schritt für echte Erkenntnis: dasselbe Rohmaterial zweimal schneiden (einmal
`TEMPO=ruhig`, einmal `TEMPO=schnell`), beide hochladen, Durchschaurate vergleichen.
Learnings dann nach `grundlagen/wissen/creatives.md`.
