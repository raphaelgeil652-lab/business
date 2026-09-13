# Bund-Kompass

Eine einzelne HTML-Datei. Auf dem Handy öffnen, zum Startbildschirm hinzufügen, fertig.

**[▶ Öffnen](https://raw.githack.com/raphaelgeil652-lab/business/claude/alltags-tools-situation-kma4qf/alltag/bund-kompass/index.html)**

## Was drin ist

| Reiter | Was er macht |
|---|---|
| **Übersicht** | Countdown bis zum Dienstantritt (Datum einmal eintragen, wird gemerkt) und vier Kacheln, wie weit du überall bist. |
| **Regeln** | 31 Aufgaben in fünf Gruppen: Papiere, Geld & Verträge, Versicherung & Gesundheit, Auto/Wohnen/Post, Persönliches. Eigene Punkte kannst du unten anhängen. |
| **Packen** | 38 Teile: Papiere, Praktisches, Nützliches, „lieber dalassen" und was die Bundeswehr stellt. |
| **Fitness** | Basis-Fitness-Test: Sprint 11×10 m, Klimmhang, 1000 m. Versuche eintragen, die Seite sagt dir pro Disziplin bestanden/knapp/nicht und führt den Verlauf. Dazu eine Trainingswoche mit drei Einheiten. |
| **Dienstgrade** | Karteikarten: Mannschaften, Unteroffiziere, Offiziere, Marine, Abkürzungen. Was du zweimal konntest, kommt seltener. Darunter der ganze Stapel als Tabelle. |

## Wie es speichert

Alles bleibt im Browser des Geräts (`localStorage`, Schlüssel `bund-kompass-v1`).
Nichts geht ins Netz, es gibt kein Konto und keinen Server. Die Kehrseite:
**leerst du die Browserdaten, ist es weg**, und auf einem zweiten Gerät fängst du bei null an.

Braucht nach dem ersten Laden kein Internet mehr — keine Schriften, keine Bibliotheken,
keine Bilder von außen. Eine Datei, 37 KB.

## Ehrlichkeitshinweis

Die Inhalte sind Orientierung, keine amtliche Auskunft:

- **Der Einberufungsbescheid schlägt alles.** Was dort an Terminen, Papieren und Packliste steht, gilt.
- Beim Fitness-Test sind die **Mindestmarken zum Bestehen** hinterlegt (Sprint ≤ 60 s, Klimmhang ≥ 5 s,
  1000 m ≤ 6:30 min). Die amtliche **Punktetabelle ist bewusst nicht drin** — die hätte ich raten müssen.
  Die gibt's beim Karriereberater.
- Die „Puffer"-Werte (Sprint ≤ 50 s, Hang ≥ 20 s, 1000 m ≤ 5:30) sind eine Empfehlung, kein offizieller Wert.
- Bei Versicherung, Steuer und Verträgen: Orientierung, keine Rechts- oder Steuerberatung.

## Ändern

Alles steht oben in der Datei in Listen — `TASKS`, `PACK`, `DISCS`, `PLAN`, `DECKS`.
Da kann man Punkte ergänzen oder rauswerfen, ohne den Rest anzufassen.
Eigene Punkte gehen aber auch direkt in der Seite über das Feld unter jeder Liste.
