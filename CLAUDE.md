# business — Clickculture (lokale Performance-Marketing-Agentur für Küchenstudios)

## Auf einen Blick

Aufbau der Agentur **Clickculture** — Performance-Marketing für **EINE fokussierte lokale Nische: Küchenstudios.** Modell zu 100 % nach dem erprobten Playbook (`grundlagen/agentur-playbook.md`, aus einem Partner-Modell mit 25+ Klienten). Kern: **Werbung (Meta + Google Ads) → Leads → Terminbuchungen** für den Klienten, drumherum ein **System** (Landingpage + Speed-to-Lead + Reporting). Wir verkaufen kein „Ads-Schalten", sondern ein komplettes Kundengewinnungs-System. Ziel: **10k+/Monat** wiederkehrend, schlank und kopierbar.

**Autorität:** `grundlagen/agentur-playbook.md` ist die Grundlage. Alles hier setzt es konkret um. Direkte Anweisungen des Nutzers im Chat haben Vorrang.

## Nische

**Nur Küchenstudios** (kleinbetrieblich, inhabergeführt, mit genug Budget). Entscheidung: Fokus statt Bauchladen.
- Hoher Ticketwert (Küche 10–30k €) → ein gewonnener Kunde finanziert Werbebudget + Agentur-Fee locker.
- Natürlicher **Gratis-Anker-Offer**: „kostenlose 3D-Küchenplanung" → führt zum High-Ticket-Abschluss.
- Terminbasiert & trackbar, inhaberbetrieben. Details + 5-Punkte-Filter: `grundlagen/nischen.md`.
- **Badsanierung ist zurückgestellt** (nicht Fokus). Die Bad-Landingpage/-Leads bleiben als Fundus, werden aber nicht aktiv bespielt.

**Kanäle:** Meta (Facebook/Instagram) **+ Google Ads**. Meta weckt Nachfrage (Feed), Google fängt aktive Sucher ab („Küchenstudio [Ort]").

**Preis-/Garantie-Modell:** Onboarding **850 €** (mit **Geld-zurück-Garantie**: keine echten Anfragen in 30 Tagen → Gebühr zurück) + **monatliche Betreuung ab Start, deren Retainer-Gebühr (1.500 €/Monat) erst ab der ersten verkauften Küche fällig wird** (Risk-Reversal: Kunde zahlt erst, wenn er über die Werbung verdient hat; erster Verkauf realistisch in 1–2 Monaten), **jederzeit kündbar**; **Werbebudget ~1.000 €/Monat** zahlt der Kunde direkt an Meta/Google. Details: `grundlagen/geschaeftsmodell.md`.

Region-Ausgangspunkt: Pfullendorf / Landkreis Sigmaringen + Umland (Bodensee/Oberschwaben); per Targeting erweiterbar.

## Was automatisiert/vom System läuft vs. was nur der Nutzer selbst tut

- **System/Claude:** Landingpages + Creatives + Ad-Copy (Struktur wiederverwenden), CRM-Snapshot & n8n-Automationen, Tracking-Setup, Reports, Lead-Recherche, Doku/Wissen pflegen.
- **Nur der Nutzer selbst:** Verkaufsgespräche **vor Ort** (persönlich reingehen)/Vertragsabschluss mit Klienten, Vertrauen aufbauen, Meta-/Zahlungs-Konten verifizieren, Entscheidungen zu Budget/Preisen.

## Struktur dieses Repos (aufgeräumt in 4 Ordner)

- `README.md` — **Start-/Übersichtsseite** mit klickbaren Links zu den fertigen Seiten. Erste Anlaufstelle.
- `CLAUDE.md` — diese Übersicht. Bei jeder größeren Entscheidung aktuell halten.
- **`seiten/` — alles zum Zeigen (Kundensachen), rendert per Link im Browser:**
  - `pitch/index.html` — **Verkaufs-One-Pager: alles in einer Datei** (Ablauf, Beispiel-Anzeige, Landingpage-Vorschau, Preise, Garantie, FAQ). Das Hauptstück zum Vorzeigen.
  - `landingpage/` — echte Küche-Landingpage (`index.html` + `danke.html`; Bad `bad.html` als Fundus), Formular→E-Mail via Netlify, GHL-Umstellung in der README.
  - `beispiele/` — Schau-Beispiele: Facebook-Ad-Mockup + fertige Beispiel-Landingpage + Anzeigentexte (README).
- **`akquise/` — dein Tagesgeschäft (Kunden gewinnen):**
  - `klienten-leads.csv` — recherchierte Küchenstudio-Leads in der Region.
  - `besuchs-reihenfolge.md` — priorisierte Besuchs-/Fahrt-Reihenfolge (welche Läden in welcher Reihenfolge).
  - `verkaufsskript.md` — **Vor-Ort-Skript (persönlich reingehen)** + Einwände + Telefon als Nachfass-Fallback (früher `wissen/sales.md`).
  - `angebot-vertrag.md` — 1-Seiten-Vereinbarung + Vergütung (Betreuung erst ab erstem Verkauf).
  - `onboarding-email.md` — Onboarding-Mail-Vorlage.
  - `erster-kunde-fahrplan.md` / `fahrplan-erster-umsatz.md` — Startweg + abhakbare To-do-Liste bis zur ersten Überweisung.
- **`anleitungen/` — Wie-geht-was (nur bei Bedarf reinschauen):**
  - `meta-konto-einrichten.md`, `meta-anzeige-einrichten.md` — Meta-Konto + erste Anzeige einrichten (Einsteiger).
  - `landingpage-hosten.md` — Landingpage online stellen (Netlify) + Troubleshooting.
  - `ghl-n8n-aufbau.md`, `n8n/` — CRM-/Automations-Ausbaustufe (Workflow-Grundgerüste, später).
  - `tech-stack.md`, `klienten-journey.md`, `ad-copy.md` — Tech-Stack, A–Z-Prozess, Ad-Text-Vorlagen.
- **`grundlagen/` — Strategie & Wissen (nachschlagen):**
  - `agentur-playbook.md` — **Master-Playbook (Grundlage, nicht ändern außer auf Ansage).**
  - `geschaeftsmodell.md` — Angebot, Preise/Garantie, 10k/Monat-Rechnung, 7k-Ziel.
  - `nischen.md`, `offer-und-ads.md`, `so-funktioniert-alles.md` — Nische + 5-Punkte-Filter, Offer-/Ad-Strukturen, Einsteiger-Überblick + Glossar.
  - `grundlagen/wissen/` — Lern-System (`creatives.md`, `onboarding.md`, `tech.md`): Learnings festhalten, damit keine Fehler doppelt passieren.
- `.agents/skills` + `.claude/skills` — installierte Design-Skills (impeccable, taste-skill) zum Bau guter Landingpages/Creatives.

## Prinzipien (aus dem Playbook — immer beachten)

1. **Skalierbar ab Tag 1** — nichts pro Klient hardcoden. Jede Lösung muss für 100 Klienten parallel funktionieren.
2. **Termin-Tracking = Geschäftsgrundlage** — ohne lückenlose Erfassung kein Revenue Share, kein Report-Beweis.
3. **Wiederholung schlägt Kreativität** — dieselben 3–5 Offer-Strukturen dauerhaft, nur in Variationen testen.
4. **Onboarding standardisieren** — Snapshot + Automation + Checklisten. Der Engpass ist nie die Werbung, sondern das Onboarding.
5. **Kapazität & Speed-to-Lead** — sofortige WhatsApp/SMS-Antwort; Leads sind wertlos, wenn der Klient langsam reagiert.
6. **Wissens-System pflegen** — Learnings nach `grundlagen/wissen/` schreiben (nicht nur im Chat).

## Aktueller Stand

MVP steht: Landingpages (Küche/Bad) live bei Netlify, Anfragen kommen per E-Mail, Terminvergabe manuell.
Angebot/Vertrag-Vorlage + Salescall-Skript + Leads bereit. **Noch keine Klienten.**

**Ziel: 7.000 € bis 01.10.2026** (Details/Rückrechnung in `grundlagen/geschaeftsmodell.md`). Hebel = **jetzt akquirieren**:
Küchenstudios **vor Ort abklappern** (persönlich reingehen; telefonisch nur nachfassen) (`akquise/verkaufsskript.md`, `akquise/klienten-leads.csv`, `akquise/besuchs-reihenfolge.md`),
~2 Kunden im August abschließen (Onboarding 850 € + 1.500 €/Monat ab der ersten verkauften Küche). Fahrplan bis zum ersten Geld:
`akquise/fahrplan-erster-umsatz.md`. Verkaufs-One-Pager zum Vorzeigen (alles in einer Datei): `seiten/pitch/` (Links in `README.md`).
Der ganze Automatik-Überbau (GHL/n8n/CAPI) kommt erst nach den ersten Kunden.
