# business — Clickculture (lokale Performance-Marketing-Agentur)

## Auf einen Blick

Aufbau der Agentur **Clickculture** — Performance-Marketing für eine fokussierte lokale Nische.
Modell zu 100 % nach dem erprobten Playbook (`grundlagen/agentur-playbook.md`, aus einem
Partner-Modell mit 25+ Klienten). Kern: **Werbung (Meta + Google Ads) → Leads → Aufträge** für den
Klienten, drumherum ein **System** (Landingpage + Speed-to-Lead + Reporting). Wir verkaufen kein
„Ads-Schalten", sondern ein komplettes Kundengewinnungs-System. Ziel: **10k+/Monat** wiederkehrend,
schlank und kopierbar.

**Autorität:** `grundlagen/agentur-playbook.md` ist die Grundlage. Alles andere setzt es konkret um.
Direkte Anweisungen des Nutzers im Chat haben Vorrang.

## Zwei getrennte Geschäfte in diesem Repo

1. **Agentur Clickculture** (alles Weitere in dieser Datei: Kfz, Küchenstudios, Chinatown,
   `anleitungen/`, `grundlagen/`). Bleibt unverändert.
2. **Webseitenbau** als eigenes Geschäft: Webseiten für beliebige Unternehmen, egal ob Restaurant,
   Café, Werkstatt oder Küchenstudio. Es sind einfach Webseiten, kein Agenturkunde.

**Für den Webseitenbau gilt ausschließlich `.claude/skills/10k-websites/SKILL.md` plus seine
`references/`.** Unverändert, so wie der Nutzer den Skill geliefert hat: seine Phasen, seine Gates,
sein Deploy-Weg, seine Standards. Nicht vermischen, in keine Richtung. Also keine Agentur-Preise,
keine Kfz-Leitplanken, keine LP-Vorlage und kein Service-Baukasten in einer Webseite, und umgekehrt
ändert der Skill nichts an der Agentur-Doku. Andere Webseiten- oder Design-Skills laufen nicht
nebenher; `10k-websites` regiert allein.

Gebaute Webseiten liegen unter `nischen/<name>/`, weil der Nutzer dort sucht. Aufbau je Seite:
`seite/` (das, was online geht), `arbeitsdateien/` (Rohmaterial, bleibt lokal) und
`design-paket.md` (der Plan vor der Generierung). Dazu meist `vorschau/` plus `tools/`, eine
selbstenthaltende Datei zum Herzeigen — außer wenn der Öffnen-Knopf direkt auf `seite/` zeigen
kann, siehe Alex.

Gebaute Seiten: **`nischen/tagwerk/`** (Demo, erfundene Kaffeemarke),
**`nischen/alex-aussenanlagen/`** (echter Kunde, Pfullendorf) und
**`nischen/wakepark-pfullendorf/`** (Wasserskianlage am Seepark Linzgau).

## Dritter Bereich: persönliche Entwicklung (kein Geschäft)

`entwicklung/` ist ein **6-Monats-Programm zur Persönlichkeitsentwicklung** für den Nutzer
persönlich (01.10.2026 – 28.03.2027, während des Dienstes in der Kaserne). Es hat mit der
Agentur und dem Webseitenbau **nichts** zu tun und wird nicht mit ihnen vermischt — keine
Agentur-Sprache, keine Kunden, keine Preise.

Kern: jeden Abend ein kleines Versprechen ins Heft (180-mal), jede Woche eine konkrete
Aufgabe, jeden Monat eine Prüfung mit drei prüfbaren Kriterien. Sechs Monatsthemen:
Hinschauen · Nein sagen · Menschen verstehen · Fragen und Zuhören · eigene Regeln ·
zurück ins Geschäft. Dazu eine eigene Spur zum Loskommen nach der Trennung.
Alle harten Regeln sind mit Forschung belegt (`entwicklung/forschung/quellen.md`), samt
ehrlichem Abschnitt, was **nicht** belegt ist.

**Sprache: bewusst einfach — das ist eine ausdrückliche Vorgabe des Nutzers.** Alles in
einfachen, kurzen Sätzen, ausführlich, mit Schritt-für-Schritt-Anleitungen, damit er nie
überlegen muss, was zu tun ist. Fachwörter sind rausgeschrieben oder direkt erklärt (Glossar
in `wie-es-funktioniert.md`). Feste Begriffe, die überall gleich heißen: **das Heft · das
Versprechen · die drei Zeilen · die Aufgabe der Woche · die Beobachtungsfrage · die
Sonntagsfragen · die Monatsprüfung · der Selbsttest.** Keine neue Fachsprache einführen —
kein „Gate", kein „Register", kein „Protokoll", kein „Prompt".

**Für die Zeit des Programms gilt:** Das Business liegt von Oktober bis Februar auf Standby,
ab März kommt es kontrolliert zurück. Wochenenden zu Hause sind ausdrücklich business-frei.
In [`entwicklung/werkzeuge/mit-claude-arbeiten.md`](entwicklung/werkzeuge/mit-claude-arbeiten.md)
stehen fünf feste Termine mit fertigen Texten zum Kopieren (Monatsabrechnung · wenn es nicht
läuft · Gespräch nachbesprechen · Regeln prüfen · Schluss-Abrechnung). Bei diesen Terminen ist
**Ehrlichkeit wichtiger als Ermutigung** — eine nicht bestandene Monatsprüfung wird so
benannt, nicht schöngeredet.

**Läuft außerdem:** ein Artifact als Handy-Begleiter (Feldkompass — zeigt täglich von selbst,
was dran ist) und eine tägliche Routine um 12:00, die eine Push-Meldung mit der Tagesaufgabe
aufs Handy schickt. Die Routine trägt den Wochenplan im Prompt — wird der Plan geändert,
muss die Routine mitgeändert werden.

---

## Zwei Nischen, zwei Ordner

| Nische | Status | Ordner |
|---|---|---|
| **Kfz-Betriebe** | **aktiver Fokus** (seit Juli 2026) | `nischen/autowerkstaetten/` |
| Küchenstudios | zurückgestellt, vollständig erhalten | `nischen/kuechenstudios/` |

**Warum gewechselt:** Vor-Ort-Besuche bei Küchenstudios im Juli 2026 zeigten verhaltene Resonanz.
Kfz-Betriebe sind zahlreicher, Werbung gegenüber offener, fast immer inhabergeführt — und der erste
Auftrag kommt in Tagen statt Monaten (schnelleres Geld). Der Trade-off ist der kleinere Ticketwert
und damit die kleinere Fee. Details: `nischen/autowerkstaetten/businessplan.md`.

**Die Küchen-Nische nicht löschen** — sie ist reaktivierbar, falls der Nutzer sie wieder aufgreift.

---

## Aktive Nische: Kfz-Betriebe

**Zielgruppe:** Autowerkstätten, Aufbereiter/Detailer, Folierer, Karosseriebauer, Reifenhändler.
Inhabergeführt, 1–8 Mitarbeiter, schwacher Digitalauftritt bei gutem Google-Profil.

### Die zentrale Mechanik: Service egal, Ticketwert nicht

Der Nutzer hat entschieden: **jeder Betrieb bekommt seine eigene Leistung beworben.** Damit das
nicht zum Bauchladen wird, gilt:

> **LP-Skelett und Ad-Skelett sind über alle Kunden identisch. Getauscht wird nur ein Service-Modul.**

7 fertige Module in `nischen/autowerkstaetten/service-module.md` (Aufbereitung/Keramik · Folierung/PPF ·
Smart Repair · Räder & Reifen · Karosserie · Nachrüstung · Inspektion/TÜV). Jedes bringt Ticketspanne,
Gratis-Anker-Offer, Anzeigentexte, LP-Headline, Formularoptionen, Budget-Richtwert und Video-Hook mit.

**Harte Leitplanke:** Nur Leistungen ab **~300 € pro Auftrag** bewerben. Ein Lead kostet 25–55 € —
ein Ölwechsel für 80 € kann das nie tragen. Bietet ein Betrieb nur Kleinteiliges an, wird er kein Kunde.

### Preis-/Garantie-Modell

**Onboarding 700 €** einmalig (Geld-zurück-Garantie: keine echten Anfragen in 30 Tagen → zurück)
+ **Retainer 999 €/Monat**, Betreuung ab Start, **Gebühr erst ab dem ersten vermittelten Auftrag**
+ **Werbebudget 300–900 €/Monat**, zahlt der Kunde direkt an Meta/Google (Höhe nach seiner Kapazität).
**Jederzeit kündbar.** Details: `nischen/autowerkstaetten/geschaeftsmodell.md`.

### Was Erfolg oder Misserfolg entscheidet

1. **Vorher/Nachher-Bildmaterial vom Kunden** — stärkstes Trust-Element der Branche, kritischster
   Onboarding-Schritt. Ohne echtes Material ist die Kampagne halb so stark.
2. **Kapazität vor dem Abschluss prüfen** — Playbook-Filter 5. Ein Betrieb, der die Anfragen nicht
   abarbeiten kann, kündigt trotz guter Werbung. Häufigster vermeidbarer Verlust.
3. **Speed-to-Lead** — Rückruf unter 1 Stunde. Größter Einzelhebel, größer als jeder Anzeigentext.

Region: Pfullendorf / Landkreis Sigmaringen + Umland. Zielradius je Kampagne **max. ~25 km**.

---

## Was automatisiert/vom System läuft vs. was nur der Nutzer selbst tut

- **System/Claude:** Landingpages + Creatives + Ad-Copy (Struktur wiederverwenden), Service-Module
  pflegen, CRM-Snapshot & n8n-Automationen, Tracking-Setup, Reports, Lead-Recherche, Doku/Wissen pflegen.
- **Nur der Nutzer selbst:** Verkaufsgespräche **vor Ort** (persönlich reingehen)/Vertragsabschluss,
  Vertrauen aufbauen, Meta-/Zahlungs-Konten verifizieren, Entscheidungen zu Budget/Preisen.

## Struktur dieses Repos

- `README.md` — **Start-/Übersichtsseite** mit klickbaren Links zu den fertigen Seiten. Erste Anlaufstelle.
- `CLAUDE.md` — diese Übersicht. Bei jeder größeren Entscheidung aktuell halten.

### `nischen/autowerkstaetten/` — aktiver Fokus
- `README.md` — Einstieg in die Nische
- `businessplan.md` — der komplette Plan (Positionierung, Angebot, Zahlen, Zeitplan, Risiken)
- `geschaeftsmodell.md` — Preise, 7k-Rückrechnung, Weg zu 10k/Monat
- `nische.md` — 5-Punkte-Filter auf Kfz, Leitplanke „Service egal, Ticketwert nicht", Zielkunden-Profil
- `service-module.md` — **der Baukasten**, 7 Module mit Offer + Ad-Copy + LP-Texten
- `recherche-landingpages.md` — Marktrecherche mit Quellen: was in der Branche konvertiert
- `akquise/` — `verkaufsskript.md` (Vor-Ort + die 2 entscheidenden Fragen), `angebot-vertrag.md`,
  `onboarding-email.md`, `klienten-leads.csv`, `fahrplan-erster-umsatz.md`
- `seiten/` — `pitch/index.html` (iPad-Verkaufsseite, **Bilder eingebettet → offline nutzbar**),
  `landingpage/` (`index.html` + `danke.html` + README)

### `nischen/kuechenstudios/` — zurückgestellt
Vollständig erhalten: `geschaeftsmodell.md`, `nische.md`, `offer-und-ads.md`, `ad-copy.md`,
`akquise/` (inkl. Leads + Besuchs-Reihenfolge), `seiten/` (Pitch, Landingpage Küche/Bad, Beispiele).
Preise dort: 850 € / 1.500 € — **nicht mit der Kfz-Nische verwechseln.**

### `nischen/tagwerk/` — Demo-Webseite (erfundene Kaffeemarke)
Gehört zum **Webseitenbau**, nicht zur Agentur. Scroll-Film-Seite nach `10k-websites`:
`seite/` (index.html + assets, nur das geht online), `vorschau/tagwerk-komplett.html` (alles
eingebettet, für den Öffnen-Knopf), `tools/vorschau-bauen.py`, `arbeitsdateien/`, `design-paket.md`.
Nach jeder Änderung an `seite/` die Vorschau neu bauen.

### `nischen/alex-aussenanlagen/` — Webseite für Alex Stadelmann (Pfullendorf)
Gehört zum **Webseitenbau**, nicht zur Agentur. Echtes Unternehmen: Garten- und Außenanlagen,
Bagger- und Erdarbeiten, Pflaster. Aufbau: `seite/`, `arbeitsdateien/`, `design-paket.md`.

**Kein Scroll-Film.** Der Nutzer hat die Scroll-Animation abbestellt, die Seite ist jetzt eine
normale Verkaufsseite: Hero mit Angebot über der Kante, Vertrauensleiste, Leistungen, der Unterbau
als Argument samt Regler zum Anfassen, Ablauf, Fragen, Formular. Alles trichtert auf `#termin`.
Die alte Bildfolge liegt in der Git-Geschichte.

**Hier keine `vorschau/`:** Der Öffnen-Knopf zeigt direkt auf `seite/index.html` über githack,
also auf genau das, was online ginge. Tagwerk und Chinatown behalten ihre Vorschauen.

**Weil das Unternehmen echt ist, wurde nichts erfunden:** keine Kundenstimmen, keine Preise, keine
Kontaktdaten. Diese Stellen sind sichtbare Platzhalter. Vor dem Livegang fehlen noch Telefon,
E-Mail, Impressum und Datenschutz sowie echte Fotos.

### `nischen/wakepark-pfullendorf/` — Webseite für den Wakepark Pfullendorf
Gehört zum **Webseitenbau**, nicht zur Agentur. Wasserskianlage am Seepark Linzgau, Ziel der
Seite sind Buchungen und Kursanfragen. Aufbau: `seite/` (index.html + assets, nur das geht
online), `arbeitsdateien/rohmaterial/` samt `HERKUNFT.md`, `design-paket.md`, `README.md`.

**Kein Scroll-Film, keine KI-Bilder auf der Seite.** Der Nutzer hat ausdrücklich nur den Auftrag
aus dem Chat gelten lassen: eine hochwertige Webseite mit starker Typografie, klarer Führung,
CTAs, Social Proof, Leistungen, Vorteilen, FAQ und starkem Abschluss. Die Fotos sind echt und
stammen vom Park, die Farben kommen aus dem Wappen des Parks (Braun, Sonnenuntergang-Amber,
Creme, dazu das Türkis des Sees).

**Weil das Unternehmen echt ist, wurde nichts erfunden:** keine Kundenstimmen (drei sichtbar
markierte Platzhalter), keine Zeitkarten-Preise. Vor dem Livegang fehlen Impressum, Datenschutz,
echte Gästestimmen und die Freigabe der Bildrechte. Ein Foto stammt von cablemekka.com, nicht
vom Park. **Keine `vorschau/`:** der Öffnen-Knopf zeigt über githack direkt auf `seite/index.html`.

Schriften liegen selbst gehostet unter `seite/assets/fonts/`, es geht kein Aufruf zu Google
Fonts raus. Das ist Absicht und darf nicht auf ein CDN zurückgedreht werden.

### `nischen/chinatown/` — Einzelkunde China Restaurant Chinatown
Liegt bewusst unter `nischen/`, weil der Nutzer dort sucht — inhaltlich ist es **keine Nische**,
sondern ein Gastro-Einzelauftrag. **Nicht mit dem Kfz-Angebot oder dessen Preisen vermischen.**
- `README.md` — Übersicht mit Öffnen-Buttons (erste Anlaufstelle)
- `flyer/` — druckfertiger DIN-A4-Faltflyer (Wickelfalz), PDF, Winkekatze, Drache, Skripte
- `webseite/` — statische Seite (Start, Speisekarte, Kontakt, Impressum, Datenschutz), Vercel-fertig
- `vorschau/` — selbstenthaltende Dateien hinter den Öffnen-Links, erzeugt von `tools/vorschau-bauen.py`

**Eine Quelle für die Speisekarte:** `webseite/tools/speisekarte-uebernehmen.py` überträgt Gerichte
und Preise aus `flyer/faltflyer.html`. Preise nur im Flyer pflegen, nie direkt in der Webseite.

### `entwicklung/` — persönliches 6-Monats-Programm (kein Geschäft)
- `README.md` — Einstieg · `wie-es-funktioniert.md` — einmal lesen, dann ist alles klar (mit Glossar) · `26-wochen-plan.md` — das Arbeitsdokument
- `monate/` — `00-vorbereitung.md` (Countdown bis 1.10.) bis `06-maerz.md`
- `werkzeuge/` — `tagesprotokoll.md`, `sonntag-im-zug.md`, `trennung.md`, `nein-sagen.md`,
  `menschen-lesen.md`, `gespraeche-fuehren.md`, `standards.md`, `selbsttest.md`,
  `leseplan.md`, `koerper.md`, `mit-claude-arbeiten.md`
- `drucksachen/taschenkarten.html` — 8 Karten zum Ausdrucken (Kaserne, ohne Handy nutzbar)
- `forschung/quellen.md` — Belege mit Links, plus „was NICHT belegt ist"

### `videoschnitt/` — Videos per Code (Werkzeug, nicht Nische)
Werkzeug für beide Geschäfte: Kurzvideos aus einer Aufnahme (Reels/TikTok) und Werbeclips für
Meta/Google. Ein Befehl macht alles — `npm run schneiden -- public/roh.mp4`: Ton abtippen
(Whisper, deutsch), Sprechpausen automatisch rausschneiden, Punch-in-Zooms setzen, Wort-Untertitel
einblenden, Motion Graphics setzen (Titelband, Namensschild, Stichwort, Wisch, Balken, Abspann),
MP4 rendern. Handyvideos vom iPhone werden richtig gedreht. Technik: [Remotion](https://www.remotion.dev), kostenlos in unserer Größe.

**Die Machart beruht auf Recherche:** `videoschnitt/forschung/virale-videos.md` hält fest, was
belegt ist (sichere Zonen, −14 LUFS, Marke nach hinten — Meta-Zahlen) und was **nicht** belegt ist
(alle Prozentzahlen zu Untertitel-Stilen, Textanimationen, Fortschrittsbalken). Daraus umgesetzt:
Sicherheitsrahmen für alle Texte (`RAHMEN=1` zum Prüfen), Tempo-Voreinstellungen (`TEMPO=`),
Füllwörter raus, Zahlen in Untertiteln hervorgehoben, Schleifen-Ende (`SCHLEIFE=an`), Warnung
bei fehlendem Hook. Die Machart ist bewusst **einstellbar**, nicht festgeschraubt.

Nachgebessert wird in `projekt/src/daten/schnittplan.json` (Zeiten, Zooms, Texte) — ein neuer
Lauf überschreibt die Datei aber. **Videodateien kommen nicht ins Repo.** Schriften selbst
gehostet, kein Google-Fonts-Aufruf. Der Werbeclip zeigt **sichtbare Platzhalter** statt
erfundener Vorher/Nachher-Fotos — echte Fotos des Betriebs gehören da rein.
Das Claude-Plugin für Remotion ist **nicht nötig**, das Projekt läuft ohne.
Einstieg: `videoschnitt/README.md`.

### `anleitungen/` — gemeinsam, nischenneutral
`meta-konto-einrichten.md`, `meta-anzeige-einrichten.md`, `landingpage-hosten.md`,
`ghl-n8n-aufbau.md` + `n8n/`, `tech-stack.md`, `klienten-journey.md`

### `grundlagen/` — gemeinsam, nischenneutral
- `agentur-playbook.md` — **Master-Playbook (Grundlage, nicht ändern außer auf Ansage).**
- `so-funktioniert-alles.md` — Einsteiger-Überblick + Glossar
- `wissen/` — Lern-System (`creatives.md`, `onboarding.md`, `tech.md`): Learnings festhalten,
  damit keine Fehler doppelt passieren.

`.agents/skills` + `.claude/skills` — installierte Skills: Design-Skills (impeccable, taste-skill)
und **`10k-websites`** (unverändert, maßgeblich für den Webseitenbau, siehe oben).

## Prinzipien (aus dem Playbook — immer beachten)

1. **Skalierbar ab Tag 1** — nichts pro Klient hardcoden. Jede Lösung muss für 100 Klienten parallel
   funktionieren. Deshalb: ein LP-File + Service-Module statt einer Seite pro Kunde.
2. **Auftrags-Tracking = Geschäftsgrundlage** — ohne lückenlose Erfassung kein Report-Beweis und
   kein sauberer Abrechnungsstart.
3. **Wiederholung schlägt Kreativität** — dieselben Strukturen dauerhaft, nur in Variationen testen.
   Erst ab 20–50 Ergebnissen bewerten.
4. **Onboarding standardisieren** — der Engpass ist nie die Werbung, sondern das Onboarding.
   Ziel: neuer Kunde in **Stunden** live, nicht in Tagen.
5. **Kapazität & Speed-to-Lead** — Leads sind wertlos, wenn der Klient langsam reagiert.
6. **Wissens-System pflegen** — Learnings nach `grundlagen/wissen/` schreiben (nicht nur im Chat).

## Aktueller Stand

Kfz-Nische ist **vollständig aufgesetzt**: Businessplan, Service-Baukasten, Landingpage, Pitch-Seite,
Verkaufsskript, Vertrag, Onboarding-Mail, Fahrplan. **Noch keine Klienten, Lead-Liste noch zu füllen.**

**Ziel: 7.000 € bis 01.10.2026** → **3–4 Abschlüsse im August**, davon mindestens 2 in der ersten
Monatshälfte (je früher die Unterschrift, desto mehr Retainer-Monate zählen noch vor dem Stichtag).

Hebel = **jetzt akquirieren**: Kfz-Betriebe vor Ort abklappern, 15–25 Kontakte pro Woche
(`nischen/autowerkstaetten/akquise/verkaufsskript.md`). Nächster Schritt:
`nischen/autowerkstaetten/akquise/fahrplan-erster-umsatz.md`.

Der ganze Automatik-Überbau (GHL/n8n/CAPI) kommt erst ab ~10 Kunden.
