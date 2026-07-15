# Konzept: Akquise-System & Automatisierung

Beantwortet: Wie geht's konkret weiter, wie kommen Kunden rein, was läuft automatisiert über dieses Repo/diese Session und was musst du zwingend selbst tun.

## 1. Der Trichter (Funnel)

```
Recherche  →  Erstkontakt  →  Termin/Gespräch  →  Angebot  →  Umsetzung  →  Referenz  →  Retainer-Kunde
```

- **Recherche**: wird hier im Repo geführt (`leads/leads.csv`). Kann ich für dich erledigen/erweitern.
- **Erstkontakt**: Anruf oder Vor-Ort-Besuch (siehe `docs/outreach-skripte.md`). Musst du selbst machen — kein Ersatz dafür.
- **Termin/Gespräch**: persönlich oder telefonisch, du zeigst die passende Landingpage/Ads-Vorschau aus `templates/`.
- **Angebot**: erstes Projekt bewusst günstig/kostenlos für Testimonial (siehe Fahrplan in `CLAUDE.md`, Phase 2).
- **Umsetzung**: Website + Ads live schalten.
- **Referenz**: Testimonial + Vorher/Nachher-Zahlen einsammeln, für nächste Akquise nutzen.
- **Retainer-Kunde**: monatliche Ads-Betreuung — das eigentliche Ziel.

## 2. Was automatisiert werden kann (über mich/dieses Repo) — und was nicht

**Kann ich für dich übernehmen:**
- Neue Leads recherchieren und in `leads/leads.csv` eintragen (Name, Adresse, Telefon, ob eine Website existiert)
- Website/Google-Business-Profil eines Leads grob einschätzen (schwacher Webauftritt = guter Ansatzpunkt)
- Landingpage- und Ads-Vorlage pro Nische bauen (wie beim Zahnarzt-Case)
- Anrufskripte, Vor-Ort-Skripte, Angebotsvorlagen schreiben
- Lead-Status pflegen, wenn du mir nach einem Anruf sagst, wie es lief
- Wöchentliche Erinnerung/Review einrichten (siehe Abschnitt 4)

**Kannst nur du:**
- Der eigentliche Anruf / das Vor-Ort-Gespräch — Vertrauen entsteht nicht durch eine KI
- Der Vertragsabschluss / die Preisverhandlung
- Das tatsächliche Freigeben/Bezahlen von Google-/Meta-Ads-Budget (das läuft über deinen eigenen Account)
- Die persönliche Kundenbeziehung danach (Rückrufe, Betreuung)

Kurz: Ich bin das Backoffice (Recherche, Material, Tracking), du bist der Vertrieb. Das lässt sich nicht umdrehen, ohne dass es unglaubwürdig wird.

## 3. Wöchentlicher Rhythmus (angepasst an „nebenbei")

Realistisch bei 5-8h/Woche:

- **1x pro Woche (z. B. Montag, 30 Min.)**: `leads/leads.csv` durchgehen, 3-5 Leads für die Woche auswählen, bei Bedarf neue Leads nachrecherchieren lassen.
- **Über die Woche verteilt**: die ausgewählten Leads anrufen/besuchen, Ergebnis direkt in `leads.csv` notieren (Status, nächster Schritt, Datum).
- **1x pro Woche (z. B. Freitag, 15 Min.)**: kurzer Rückblick — wie viele Kontakte, wie viele Termine, was hat funktioniert.

Ziel in den ersten 4-6 Wochen: nicht Abschlüsse, sondern **Gesprächstermine**. Ein Gespräch pro Woche ist am Anfang schon ein guter Wert.

## 4. Automatisierte Erinnerung (optional)

Ich kann eine wiederkehrende Routine einrichten, die dich z. B. jeden Montag in dieser Session anstupst: „Hier sind deine offenen Leads aus `leads.csv`, hier ein Vorschlag für diese Woche." Das ersetzt keine Anrufe, hält dich aber bei der Stange, ohne dass du selbst dran denken musst. Optional — nur einrichten, wenn gewünscht.

## 5. Erste konkrete Leads

15 reale Betriebe in Pfullendorf sind bereits in `leads/leads.csv` erfasst (Zahnärzte, Beauty/Kosmetik, Physiotherapie, Fitness), inkl. erster Einschätzung, ob ein eigener Webauftritt erkennbar ist. Priorität "Hoch" = kein eigener Webauftritt gefunden, bester Ansatzpunkt für den ersten Testimonial-Kunden:
- **TheSalonNiki** (Beauty) — nur eine Buchungsseite auf fremder Plattform, keine eigene Website
- **Isolde Keune Nagel- und Kosmetikstudio** — nur in Branchenverzeichnissen gelistet
- **Dr. Sarah Schottelius (Zahnheilkunde)** — Webauftritt unklar, prüfen

Nächster Recherche-Schritt: Website + Google-Unternehmensprofil jedes Leads einzeln prüfen (kann ich übernehmen), um die Liste von "vermutet schwach" auf "bestätigt schwach" zu bringen, bevor du anrufst.
