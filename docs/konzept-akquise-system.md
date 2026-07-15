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
- **Über die Woche verteilt**: die ausgewählten Leads anrufen/besuchen, Ergebnis direkt in `leads.csv` eintragen (siehe unten, wie genau).
- **1x pro Woche (z. B. Freitag, 15 Min.)**: kurzer Rückblick — wie viele Kontakte, wie viele Termine, was hat funktioniert.

Ziel in den ersten 4-6 Wochen: nicht Abschlüsse, sondern **Gesprächstermine**. Ein Gespräch pro Woche ist am Anfang schon ein guter Wert.

### Wie du Fortschritt in `leads.csv` einträgst

Vier Spalten dafür, mit klarer Aufgabenteilung:

- **Status**: der aktuelle Zustand — `Neu` → `Kontaktiert` → `Termin vereinbart` → `Kunde` (oder `Kein Interesse`, wenn abgelehnt).
- **Naechster_Schritt**: was konkret als Nächstes ansteht, z. B. „Rückruf Freitag 14 Uhr" oder „Angebot per WhatsApp schicken".
- **Datum**: wann du diesen Lead zuletzt bearbeitet hast (Format egal, z. B. `16.07.`).
- **Kontaktverlauf**: ein kurzes, anwachsendes Protokoll aller Kontakte — neue Einträge einfach hinten anhängen, ältere nicht löschen. Das ist bewusst getrennt von der Spalte `Notizen` (die enthält nur die ursprüngliche Recherche-Einschätzung, nicht deinen Verlauf).

**Beispiel** — nach einem Anruf bei TheSalonNiki, der zu einem Rückruftermin führt:
- `Status`: `Kontaktiert`
- `Naechster_Schritt`: `Rückruf Fr 14 Uhr`
- `Datum`: `16.07.`
- `Kontaktverlauf`: `16.07.: angerufen, Chefin nicht da, Rückruf vereinbart`

Nächste Woche, nach dem Rückruf mit Terminvereinbarung:
- `Status`: `Termin vereinbart`
- `Naechster_Schritt`: `Termin 22.07., 16 Uhr vor Ort`
- `Datum`: `18.07.`
- `Kontaktverlauf`: `16.07.: angerufen, Chefin nicht da, Rückruf vereinbart | 18.07.: Rückruf erhalten, Termin für 22.07. vereinbart`

Einfach in Excel/Numbers/Google Sheets öffnen (CSV-Datei) oder direkt als Text bearbeiten — beides funktioniert, solange die Kommas innerhalb von Freitext in Anführungszeichen stehen.

## 4. Automatisierte Erinnerung (optional)

Ich kann eine wiederkehrende Routine einrichten, die dich z. B. jeden Montag in dieser Session anstupst: „Hier sind deine offenen Leads aus `leads.csv`, hier ein Vorschlag für diese Woche." Das ersetzt keine Anrufe, hält dich aber bei der Stange, ohne dass du selbst dran denken musst. Optional — nur einrichten, wenn gewünscht.

## 5. Erste konkrete Leads

17 reale Betriebe in Pfullendorf sind bereits in `leads/leads.csv` erfasst, aufgeteilt auf die vier Nischen-Branchen (Zahnärzte, Fitnessstudios, Beautysalons, Friseure), inkl. erster Einschätzung, ob ein eigener Webauftritt erkennbar ist. Priorität "Hoch" = kein eigener Webauftritt gefunden bzw. nur Branchenverzeichnis/Fremdplattform, bester Ansatzpunkt für den ersten Testimonial-Kunden pro Branche:
- **TheSalonNiki** (Beautysalon) — nur eine Buchungsseite auf fremder Plattform, keine eigene Website
- **Isolde Keune Nagel- und Kosmetikstudio** (Beautysalon) — nur in Branchenverzeichnissen gelistet
- **Dr. Sarah Schottelius** (Zahnarzt) — Webauftritt unklar, prüfen
- **Sportcenter Barz** (Fitnessstudio) — seit 1982 etabliert, aber kein eigener Webauftritt gefunden
- **Boll Manfred Der Haarschneider** (Friseur) — kleiner Einzelsalon, guter Kandidat

Nächster Recherche-Schritt: Website + Google-Unternehmensprofil jedes Leads einzeln prüfen (kann ich übernehmen), um die Liste von "vermutet schwach" auf "bestätigt schwach" zu bringen, bevor du anrufst.
