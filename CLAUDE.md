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

Der Projektordner einer Seite wird laut Skill mit dem Nutzer abgesprochen und liegt nicht unter
`nischen/`.

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

### `nischen/chinatown/` — Einzelkunde China Restaurant Chinatown
Liegt bewusst unter `nischen/`, weil der Nutzer dort sucht — inhaltlich ist es **keine Nische**,
sondern ein Gastro-Einzelauftrag. **Nicht mit dem Kfz-Angebot oder dessen Preisen vermischen.**
- `README.md` — Übersicht mit Öffnen-Buttons (erste Anlaufstelle)
- `flyer/` — druckfertiger DIN-A4-Faltflyer (Wickelfalz), PDF, Winkekatze, Drache, Skripte
- `webseite/` — statische Seite (Start, Speisekarte, Kontakt, Impressum, Datenschutz), Vercel-fertig
- `vorschau/` — selbstenthaltende Dateien hinter den Öffnen-Links, erzeugt von `tools/vorschau-bauen.py`

**Eine Quelle für die Speisekarte:** `webseite/tools/speisekarte-uebernehmen.py` überträgt Gerichte
und Preise aus `flyer/faltflyer.html`. Preise nur im Flyer pflegen, nie direkt in der Webseite.

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
