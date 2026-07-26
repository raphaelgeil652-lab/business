# business — Clickculture (lokale Performance-Marketing-Agentur für Küchenstudios)

## Auf einen Blick

Aufbau der Agentur **Clickculture** — Performance-Marketing für **EINE fokussierte lokale Nische: Küchenstudios.** Modell zu 100 % nach dem erprobten Playbook (`docs/agentur-playbook.md`, aus einem Partner-Modell mit 25+ Klienten). Kern: **Werbung (Meta + Google Ads) → Leads → Terminbuchungen** für den Klienten, drumherum ein **System** (Landingpage + Speed-to-Lead + Reporting). Wir verkaufen kein „Ads-Schalten", sondern ein komplettes Kundengewinnungs-System. Ziel: **10k+/Monat** wiederkehrend, schlank und kopierbar.

**Autorität:** `docs/agentur-playbook.md` ist die Grundlage. Alles hier setzt es konkret um. Direkte Anweisungen des Nutzers im Chat haben Vorrang.

## Nische

**Nur Küchenstudios** (kleinbetrieblich, inhabergeführt, mit genug Budget). Entscheidung: Fokus statt Bauchladen.
- Hoher Ticketwert (Küche 10–30k €) → ein gewonnener Kunde finanziert Werbebudget + Agentur-Fee locker.
- Natürlicher **Gratis-Anker-Offer**: „kostenlose 3D-Küchenplanung" → führt zum High-Ticket-Abschluss.
- Terminbasiert & trackbar, inhaberbetrieben. Details + 5-Punkte-Filter: `docs/nischen.md`.
- **Badsanierung ist zurückgestellt** (nicht Fokus). Die Bad-Landingpage/-Leads bleiben als Fundus, werden aber nicht aktiv bespielt.

**Kanäle:** Meta (Facebook/Instagram) **+ Google Ads**. Meta weckt Nachfrage (Feed), Google fängt aktive Sucher ab („Küchenstudio [Ort]").

**Preis-/Garantie-Modell:** Setup **500–1.000 €** (mit **Geld-zurück-Garantie**: keine vereinbarten Anfragen in 30 Tagen → Gebühr zurück) + monatliche Betreuung; **Werbebudget ~1.500 €/Monat** zahlt der Kunde direkt an Meta/Google. Details: `docs/geschaeftsmodell.md`.

Region-Ausgangspunkt: Pfullendorf / Landkreis Sigmaringen + Umland (Bodensee/Oberschwaben); per Targeting erweiterbar.

## Was automatisiert/vom System läuft vs. was nur der Nutzer selbst tut

- **System/Claude:** Landingpages + Creatives + Ad-Copy (Struktur wiederverwenden), CRM-Snapshot & n8n-Automationen, Tracking-Setup, Reports, Lead-Recherche, Doku/Wissen pflegen.
- **Nur der Nutzer selbst:** Salescalls/Vertragsabschluss mit Klienten, Vertrauen aufbauen, Meta-/Zahlungs-Konten verifizieren, Entscheidungen zu Budget/Preisen.

## Struktur dieses Repos (bewusst schlank)

- `CLAUDE.md` — diese Übersicht. Bei jeder größeren Entscheidung aktuell halten.
- `docs/`
  - `so-funktioniert-alles.md` — **Einsteiger-Überblick + Glossar** (was ist was, wie hängt alles zusammen). Bei Unklarheit hier starten.
  - `erster-kunde-fahrplan.md` — **schlanker Startweg** zum ersten Kunden (ohne den ganzen Automatik-Überbau).
  - `fahrplan-erster-umsatz.md` — **abhakbare To-do-Liste bis zur ersten Überweisung** (Rechtliches/Konten, Preis, Akquise, Aufsetzen, Rechnung).
  - `agentur-playbook.md` — **Master-Playbook (Grundlage, nicht ändern außer auf Ansage).**
  - `geschaeftsmodell.md` — Angebot, Abrechnung (Onboarding-Gebühr + Revenue Share), 10k/Monat-Rechnung, Positionierung.
  - `nischen.md` — Küche & Bad durch den 5-Punkte-Filter, Gratis-Anker-Offers.
  - `offer-und-ads.md` — 3–5 wiederverwendbare Offer-/Ad-Strukturen, Trust-Regeln.
  - `klienten-journey.md` — A–Z-Prozess vom Lead bis zur Abrechnung + Checklisten.
  - `tech-stack.md` — GoHighLevel, n8n, Tracking (Pixel + CAPI), Meta-Hygiene, LP-Hosting.
  - `meta-konto-einrichten.md` — **Überblick Meta-Konto** einrichten (Business Portfolio für die Agentur vs. Seite/Werbekonto/Pixel beim Kunden, Partnerzugriff).
  - `meta-anzeige-einrichten.md` — **klickbare Anleitung: erste Facebook-/Instagram-Anzeige** einrichten (Kampagne/Zielgruppe/Budget/Anzeige), für Einsteiger.
  - `ghl-n8n-aufbau.md` — Schritt-für-Schritt: Master-Snapshot bauen + n8n-Workflows (Lead-Intake, Speed-to-Lead, Stage→CAPI, Onboarding-Klon), Klienten-Store, Dedup-Kette, Testplan.
- `wissen/` — Lern-System: `creatives.md`, `onboarding.md`, `tech.md`, `sales.md`. Jede Erkenntnis pro Bereich hier festhalten, damit keine Fehler doppelt passieren.
- `templates/` — `landingpage/` (mobile-first; Küche `index.html` / Bad `bad.html` + `danke.html`; Formular→E-Mail via Netlify, GHL-Umstellung in der README dokumentiert), `n8n/` (importierbare Workflow-Grundgerüste WF-1/2/3, für die Ausbaustufe), `onboarding-email.md`, `ad-copy.md`, `angebot-vertrag.md` (1-Seiten-Vereinbarung + Geld-zurück-Garantie), `kunden-uebersicht/` (Übersichtsblatt zum Vorzeigen), `beispiele/` (fertige Schau-Beispiele: Landingpage + Facebook-Ad-Mockup + Anzeigentexte).
- `leads/klienten-leads.csv` — recherchierte Prospect-Betriebe (Küche/Bad) in der Region.
- `.agents/skills` + `.claude/skills` — installierte Design-Skills (impeccable, taste-skill) zum Bau guter Landingpages/Creatives.

## Prinzipien (aus dem Playbook — immer beachten)

1. **Skalierbar ab Tag 1** — nichts pro Klient hardcoden. Jede Lösung muss für 100 Klienten parallel funktionieren.
2. **Termin-Tracking = Geschäftsgrundlage** — ohne lückenlose Erfassung kein Revenue Share, kein Report-Beweis.
3. **Wiederholung schlägt Kreativität** — dieselben 3–5 Offer-Strukturen dauerhaft, nur in Variationen testen.
4. **Onboarding standardisieren** — Snapshot + Automation + Checklisten. Der Engpass ist nie die Werbung, sondern das Onboarding.
5. **Kapazität & Speed-to-Lead** — sofortige WhatsApp/SMS-Antwort; Leads sind wertlos, wenn der Klient langsam reagiert.
6. **Wissens-System pflegen** — Learnings nach `wissen/` schreiben (nicht nur im Chat).

## Aktueller Stand

MVP steht: Landingpages (Küche/Bad) live bei Netlify, Anfragen kommen per E-Mail, Terminvergabe manuell.
Angebot/Vertrag-Vorlage + Salescall-Skript + Leads bereit. **Noch keine Klienten.**

**Ziel: 7.000 € bis 01.10.2026** (Details/Rückrechnung in `docs/geschaeftsmodell.md`). Hebel = **jetzt akquirieren**:
Küchenstudios anrufen **und vor Ort abklappern** (`wissen/sales.md`, `leads/klienten-leads.csv`, `leads/anruf-reihenfolge.md`),
~2–3 Kunden im August abschließen (Setup 500–1.000 € + monatlich, Geld-zurück-Garantie). Fahrplan bis zum ersten Geld:
`docs/fahrplan-erster-umsatz.md`. Kunden-Übersichtsblatt zum Vorzeigen: `templates/kunden-uebersicht/`.
Der ganze Automatik-Überbau (GHL/n8n/CAPI) kommt erst nach den ersten Kunden.
