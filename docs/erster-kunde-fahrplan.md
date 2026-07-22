# Erster-Kunde-Fahrplan (schlanke Startversion)

Ziel: **einen ersten Küchen-/Bad-Betrieb als Kunde gewinnen und ein echtes Ergebnis liefern** —
ohne den ganzen Automatik-Überbau. Der große Tech-Stack (n8n, CAPI, Snapshot) kommt **erst danach**.

## Grundhaltung

**Erst ein Kunde + Beweis, dann Technik & Skalierung.** Am Anfang ist nicht das Ziel, „perfekt"
zu sein, sondern **einem Betrieb echte Anfragen zu bringen** und daraus eine Case-Study
(Testimonial + Zahlen) zu machen. Damit gewinnst du danach die zahlenden Kunden.

---

## Phase 0 — Vorbereitung (1–2 Tage)

- [ ] **Angebot festlegen:** „Kostenlose 3D-Küchenplanung" (Küche) bzw. „Kostenlose Bad-Beratung / Vor-Ort-Aufmaß" (Bad). Ein Offer, ein Ziel: Termin.
- [ ] **Landingpage fertig machen:** Vorlage `../templates/landingpage/` nehmen, Platzhalter `[ ]` ersetzen (Name, Ort, Fotos später vom Kunden). Hosten bei **Netlify** oder **Vercel** (kostenlos, kein Server nötig).
- [ ] **Lead-Auffang wählen (simpel!):** Am Anfang reicht ein **GHL-Basiskonto** mit einem Formular — oder sogar ein einfaches Formular-Tool, das dir die Anfrage per E-Mail/WhatsApp schickt. **n8n ist hier noch nicht nötig.**

## Phase 1 — Ersten Kunden gewinnen (die wichtigste Phase)

- [ ] **Anruf-Liste nehmen:** `../leads/klienten-leads.csv` (14 echte Betriebe mit Nummer).
- [ ] **Case-Study-Deal anbieten:** ersten Kunden **vergünstigt oder kostenlos** – im Tausch gegen ein **Testimonial** und die Erlaubnis, die Ergebnisse zu zeigen. Das senkt seine Hürde und gibt dir deinen Beweis.
- [ ] **Kapazität prüfen** (wichtig, Playbook-Filter Punkt 5): Kann der Betrieb zusätzliche Termine/Aufträge überhaupt bedienen? Wenn nicht → anderer Betrieb.
- [ ] **Salescall-Notizen** in `../wissen/sales.md` festhalten (was funktioniert, welche Einwände).

> Merke: Das ist **dein** Job (Anrufe, Vertrauen, Abschluss) — das kann kein Tool und keine KI für dich machen.

## Phase 2 — Schlank aufsetzen (für diesen einen Kunden)

- [ ] **Landingpage personalisieren:** echten Studionamen, Ort, 2–3 echte Fotos, echte Bewertungen (max. 4,9★).
- [ ] **Eine Meta-Anzeige** schalten (Gratis-Offer). Textvorlagen: `../templates/ad-copy.md`. Klein starten (z. B. 10–20 €/Tag Testbudget, zahlt der Kunde).
- [ ] **Anfrage-Auffang testen:** Formular ausfüllen → kommt die Anfrage an? Reicht am Anfang GHL-Formular + Benachrichtigung.
- [ ] **Speed-to-Lead:** sofort reagieren. Zur Not **manuell** oder mit einer einfachen GHL-Automation — noch **kein n8n** nötig.
- [ ] **Tracking simpel:** der **Meta Pixel** auf der LP reicht zum Start. **CAPI/Dedup kommt später.**

## Phase 3 — Liefern & Beweis sammeln

- [ ] Anfragen an den Betrieb geben, dranbleiben, dass er **schnell** anruft.
- [ ] **Termine sauber festhalten** (einfache Liste/Sheet reicht) — das ist später deine Abrechnungs- und Beweisgrundlage.
- [ ] Nach ein paar Wochen: **Zahlen + Testimonial** einsammeln (X Anfragen, Y Termine, Z Abschlüsse).

## Phase 4 — Erst JETZT skalieren

Wenn der erste Kunde läuft und du den Beweis hast:
- [ ] Den **Automatik-Überbau** aufsetzen: n8n-Workflows (`../templates/n8n/`), Master-Snapshot + CAPI-Dedup nach `ghl-n8n-aufbau.md`.
- [ ] Zweiten/dritten Kunden mit **demselben Muster** gewinnen (gleiche LP-/Ad-Struktur, nur personalisiert). Ab hier zahlt sich die Standardisierung aus → Weg Richtung 10k/Monat (`geschaeftsmodell.md`).

---

## Wer macht was

| Nur du selbst | System / Claude |
|---|---|
| Anrufen, Vertrauen aufbauen, Deal abschließen | Landingpage, Ad-Copy, Vorlagen bauen |
| Meta-/Zahlungskonten verifizieren | Lead-Recherche, Doku pflegen |
| Entscheidungen zu Budget/Preisen | (später) Automationen/Tracking einrichten |
| Ergebnisse mit dem Kunden besprechen | Reports vorbereiten |

## Diese Woche konkret

1. Landingpage aus der Vorlage fertig personalisieren + bei Netlify/Vercel hochladen.
2. 5 Betriebe aus `../leads/klienten-leads.csv` anrufen (mit Case-Study-Angebot).
3. Ergebnisse + Einwände in `../wissen/sales.md` notieren.

Ein einziges „Ja" reicht, um loszulegen. Der Rest wächst von dort.
