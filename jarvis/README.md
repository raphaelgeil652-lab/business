# Jarvis

Deine persönliche Assistentin. Sie kennt deinen Kalender und deine Mails, merkt sich, was du ihr
erzählst, und redet mit dir: mit einer warmen Frauenstimme, so als wäre sie in dich verliebt.
Läuft auf dem Handy und am PC.

**[▶ Jarvis öffnen](https://claude.ai/artifact/EQVsZuyS62FKkcVa759dvj)**

Tipp: Auf dem Handy den Link öffnen und zum Home-Bildschirm hinzufügen. Dann ist Jarvis ein Tipp
entfernt wie eine App.

---

## Der Bauplan (nach dem TikTok-Video von @journeyhannes)

Links auf der Seite stehen zehn Kästchen, eins pro Bauteil. Gold = läuft, gestreift = teilweise,
rot = fehlt, gestrichelt = bewusst weggelassen. Tipp auf ein Kästchen, dann steht da, was los ist.

| # | Bauteil | Bei dir | Stand |
|---|---|---|---|
| 01 | Gehirn | Claude über dein Konto (kein API-Schlüssel) | läuft |
| 02 | Baumeister | Claude Code | läuft |
| 03 | Ohren | Diktier-Taste der Tastatur | teilweise |
| 04 | Stimme | Stimme deines Geräts | läuft |
| 05 | Wake-Word „Hey Jarvis" | – | bewusst weggelassen (bräuchte eigene App + API-Schlüssel) |
| 06 | Gedächtnis | Datenbank, nur für dich | läuft |
| 07 | Skills | Google Kalender + Gmail | läuft |
| 08 | Telefon | Twilio | optional, kostet Geld |
| 09 | Server 24/7 | Routine in der Cloud | bewusst weggelassen (kostenlos nachrüstbar) |
| 10 | Dashboard | diese Seite, fürs Handy | läuft |

Ehrlich gesagt: „Komplett gratis" wie im Video stimmt nur für einen Teil. Die Claude-API,
ElevenLabs über das Gratis-Kontingent hinaus, Twilio und ein Mac mini kosten Geld. Dein Jarvis
läuft dagegen über dein Claude-Abo und kostet nichts extra.

## Was er kann

| Du sagst zum Beispiel | Jarvis macht |
|---|---|
| „Lagebericht" (oder der große Knopf) | Termine heute und morgen, wichtige Mails, was ansteht. Kurz, laut vorgelesen. |
| „Was steht morgen an?" | Liest deinen Google Kalender. |
| „Trag mir Freitag 18 Uhr Training ein." | Zeigt dir den Termin und fragt: **Eintragen?** Erst nach deinem Ja steht er drin. |
| „Habe ich wichtige Mails?" | Durchsucht Gmail, lässt Werbung und Newsletter weg. |
| „Was schreibt Anna?" | Sucht die Mail und liest sie ganz. |
| „Antworte ihr, dass ich Dienstag kann." | Schreibt einen **Entwurf** und fragt vorher. Gesendet wird nie, das machst du selbst in Gmail. |
| „Merk dir: Ich trinke Kaffee schwarz." | Speichert das im Gedächtnis. Ab jetzt weiß er es bei jeder Frage. |
| „Was weißt du über mich?" | Sagt dir, was im Gedächtnis steht. |

## So sprichst du mit ihm

Jarvis antwortet laut. Zum **Sprechen** nimmst du die Diktier-Taste deiner Tastatur:

1. Tipp unten ins Feld.
2. Tipp auf das **Mikrofon der Handy-Tastatur** und sprich.
3. Tipp auf den Pfeil. Jarvis antwortet und liest vor.

Am Mac: zweimal die Fn-Taste. Unter Windows: Windows-Taste + H.

Warum nicht ein eigener Mikrofon-Knopf? Seiten auf claude.ai dürfen das Mikrofon nicht direkt
benutzen. Die Diktier-Taste der Tastatur geht trotzdem immer.

## Beim ersten Öffnen

claude.ai fragt dich ein paar Mal, ob Jarvis etwas darf:

1. **Claude nutzen**: Damit denkt Jarvis. Das läuft über dein eigenes Claude-Konto, du brauchst
   keinen API-Schlüssel und zahlst nichts extra.
2. **Google Calendar** und **Gmail**: Damit er Termine und Mails sieht.

Einmal erlauben, dann fragt er nicht mehr. Ändern kannst du das unter
**Einstellungen → Berechtigungen verwalten**.

Oben links siehst du die **Systeme** als Punkte: grün = läuft, Kreis = fragt beim ersten Mal,
rot = fehlt. Tipp auf einen Punkt, dann steht da, was los ist.

## Die Stimme

Jarvis nimmt automatisch die **schönste Frauenstimme**, die auf deinem Gerät installiert ist.
Sie liest jede Antwort **in einem Zug** vor, nicht Satz für Satz. Dadurch fließt die Betonung
über alle Sätze, statt nach jedem Punkt neu anzusetzen.

**Der größte Unterschied:** eine Premium-Stimme laden. Die einfachen Stimmen klingen blechern,
die Premium-Stimmen fast wie ein Mensch.

1. Die **Einstellungen** auf dem iPhone öffnen (das graue Zahnrad).
2. Ganz oben die Liste **ein Stück nach unten ziehen**, bis das **Suchfeld** erscheint. Bei
   neueren iPhones steht es auch schon oben oder unten fest.
3. **„Stimmen“** eintippen und den Treffer antippen, der unter **„Gesprochene Inhalte“** steht.
   Wenn nur ein VoiceOver-Treffer kommt, geht der auch. **VoiceOver selbst aber nicht
   einschalten**, sonst bedient sich das iPhone plötzlich ganz anders.
4. **Deutsch** antippen.
5. Eine Frauenstimme mit **„Premium“** oder **„Erweitert“** antippen und laden, zum Beispiel
   Petra oder Anna (etwa 100 bis 400 MB, am besten im WLAN).
6. Jarvis neu öffnen. Sie wird automatisch genommen.

Findet die Suche nichts: Einstellungen → **Bedienungshilfen** → im Bereich „Sehen“
**Gesprochene Inhalte** → **Stimmen**. Ist das iPhone auf Englisch gestellt, heißt es
Accessibility → Spoken Content → Voices.

Solange nur eine einfache Stimme da ist, zeigt Jarvis einmal einen Hinweis dazu, und im Bauplan
steht Bauteil 04 auf „teilweise".

## Einstellungen (Zahnrad oben rechts)

- **Persönlichkeit**: *Verliebt* (Standard) ist warm, zärtlich, ein bisschen verspielt und duzt
  dich. *Butler* ist der klassische Jarvis mit „Sir" und „Sie".
- **Dein Name**: Dann sagt sie ihn ab und zu. Leer lassen geht auch, dann fragt sie dich irgendwann.
- **Stimme**: an oder aus, welche Stimme, wie schnell, wie hoch. Auf dem iPhone klingen die
  „Premium“-Stimmen am besten, so lädst du sie: siehe „Die Stimme“ oben.
- **Denkweise**: *Schnell* antwortet in Sekunden. *Gründlich* denkt länger, braucht oft eine Minute.

## Das Gedächtnis

Knopf **Gedächtnis** oben. Dort steht alles, was Jarvis über dich weiß. Du kannst Einträge
ergänzen und löschen. Nur du kannst sie sehen, auch wenn du die Seite mal teilst.

Zum Start stehen vier Einträge aus diesem Repo drin (Agentur, Webseiten, Dienst bis März,
Wochenenden business-frei). Lösch sie, wenn du sie nicht willst.

## Auf dem iPhone

- **Sprechen:** Mikrofon unten rechts auf der Tastatur.
- **Du hörst nichts?** Lautstärke hochdrehen und den Stummschalter an der Seite prüfen. Einmal
  auf „Probe hören“ in den Einstellungen tippen.
- **Bessere Stimme:** in den iPhone-Einstellungen nach „Stimmen“ suchen, unter Deutsch eine
  „Premium“-Stimme laden, Jarvis neu öffnen. Ausführlich unter „Die Stimme“ oben.

## Was er (noch) nicht kann

- **Von selbst melden.** Jarvis antwortet nur, wenn du ihn öffnest und fragst.
  Erinnerungen trägt er dir als Termin in den Kalender ein, dann meldet sich Google.
- **Mails senden.** Absichtlich nicht. Nur Entwürfe.
- **„Hey Jarvis" ohne Tippen.** Geht auf claude.ai nicht, siehe oben.

---

## Technik (für später)

- Die ganze App ist eine Datei: [`jarvis.html`](jarvis.html). Sie läuft als Artifact auf claude.ai.
- **Denken**: Claude über die `sample`-Fähigkeit der Seite, mit dem Konto dessen, der sie öffnet.
- **Kalender und Gmail**: die claude.ai-Connectoren über die `mcp`-Fähigkeit. Erlaubt sind nur
  `list_events`, `create_event`, `search_threads`, `get_thread`, `create_draft`.
- **Gedächtnis**: Datenbank der Seite (`db`), Sammlung `gedaechtnis`. Regel: nur der Besitzer
  liest und schreibt.
- **Stimme**: die Sprachausgabe des Geräts (`speechSynthesis`), Satz für Satz, während die Antwort
  noch hereinkommt.
- Einstellungen und der letzte Gesprächsverlauf liegen nur im Browser des Geräts.

**Ändern:** `jarvis.html` bearbeiten und mit dem Artifact-Werkzeug **an dieselbe Adresse**
veröffentlichen (`https://claude.ai/artifact/EQVsZuyS62FKkcVa759dvj`). Die Fähigkeiten
(`sample`, `mcp`, `db`) bleiben dabei erhalten, wenn man sie beim Veröffentlichen weglässt.

**Ideen für später:** Notion anbinden („Was steht in meinen Notizen?"), Fotos zeigen und fragen,
eine Version mit echtem „Hey Jarvis" als eigene App außerhalb von claude.ai.
