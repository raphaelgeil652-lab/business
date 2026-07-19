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

### Wie du Fortschritt einträgst: sag es mir einfach, editier nichts selbst

**Feste Regel: `leads.csv` von Hand zu bearbeiten ist nicht mehr nötig — auch nicht empfohlen.** CSV-Dateien sind nichts, womit man von Hand rumhantieren sollte (Kommas, Anführungszeichen, Spaltenzahl müssen exakt stimmen, ein falsches Komma reicht, um die Datei kaputt zu machen). Das ist Maschinenarbeit, keine Nutzerarbeit.

Stattdessen: Nach einem Anruf oder Besuch schreibst du mir einfach in normaler Sprache, was passiert ist — hier im Chat, egal ob in dieser Session oder einer späteren. Zum Beispiel:

> „Hab TheSalonNiki angerufen, Chefin war nicht da, soll Freitag 14 Uhr nochmal anrufen."

Ich trage das dann korrekt in die passenden Spalten ein (`Status`, `Naechster_Schritt`, `Datum`, `Kontaktverlauf`) — technisch fehlerfrei, ohne dass du dich um Kommas oder Spalten kümmern musst. Die Spalten selbst (zur Orientierung, falls du die Datei mal ansiehst):

- **Status** — aktueller Zustand (`Neu`, `Kontaktiert`, `Termin vereinbart`, `Kunde`, `Kein Interesse`)
- **Naechster_Schritt** — was konkret ansteht
- **Datum** — letzter Bearbeitungsstand
- **Kontaktverlauf** — wachsendes Protokoll aller Kontakte zu diesem Lead
- **Notizen** — bleibt für meine ursprüngliche Recherche-Einschätzung reserviert, nicht für deinen Verlauf

Falls du die Liste mal selbst ansehen willst (nicht bearbeiten): auf GitHub die Datei öffnen, dort wird sie automatisch als lesbare Tabelle dargestellt.

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
