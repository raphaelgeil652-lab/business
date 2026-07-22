# Lokale Nischen-Agentur — Playbook-Übersicht (Übergabe-Dokument)

*Kontext-Dokument für Claude: So funktioniert das Agentur-Modell, nach dem diese Agentur aufgebaut wird. Es basiert auf einem erprobten Modell aus einer anderen Nische (25+ aktive Klienten). Nutze dieses Dokument als Grundlage, um Aufgaben rund um Aufbau, Klienten-Akquise, Systeme und Kampagnen zu formen.*

---

## 1. Geschäftsmodell

- **Performance-Marketing-Agentur für EINE lokale Nische** — inhaberbetriebene Service-Businesses (z.B. Fahrschulen, Küchenstudios, Badsanierung, Autofolierung).
- Kern-Leistung: Meta Ads (+ ggf. Google Ads auf kleinem Budget) → Leads → Terminbuchungen für den Klienten.
- Drumherum ein **System-Ökosystem**: CRM-Automationen, Terminerfassung, Reaktivierung, optional Loyalty-Programm. Die Agentur verkauft nicht „Ads", sondern ein komplettes Kundengewinnungs-System.
- **Abrechnung:** Onboarding-Gebühr + monatlich Revenue Share (pro erfasstem Termin/Abschluss) oder Fixpreis. Revenue Share macht lückenloses Termin-Tracking geschäftskritisch.
- **Positionierung ist das Asset:** „DIE Agentur für [Nische]" — nicht Bauchladen. Eine Nische, ein Playbook, dann skalieren (Ziel: 25 → 100+ Klienten mit denselben Systemen).

## 2. Nischen-/Klienten-Filter (alle 5 müssen erfüllt sein)

1. **AOV/LTV hoch genug** — ein gewonnener Kunde muss dem Klienten €300+ (besser €1.000+) bringen, sonst bleibt nach Ad-Budget + Agentur-Fee nichts übrig.
2. **Gratis-Anker-Offer möglich** — ein niedrigschwelliger kostenloser Einstieg, der natürlich zum High-Ticket-Kauf führt (z.B. „kostenlose 3D-Planung", „kostenloser Check", Giveaway).
3. **Terminbasiert & trackbar** — klarer Funnel: Lead → Termin → Abschluss, im CRM erfassbar.
4. **Inhaberbetrieben** — der Owner entscheidet selbst, kein Konzern-Einkauf.
5. **Kapazität vorhanden** — der Klient muss zusätzliche Termine abarbeiten können. Vor Signing prüfen, sonst kündigt er trotz guter Performance.

## 3. Offer- & Ad-Mechanik (wichtigster Hebel)

- **Wenige bewährte Ad-Strukturen, immer wieder recyclen** — nicht ständig neu erfinden. 3–5 Struktur-Templates (Giveaway, Gratis-Offer, Anker-Preis „X statt Y", saisonale Aktion) rotieren über alle Klienten.
- Der Gratis-/Giveaway-Offer senkt die Einstiegshürde; das Geld wird im Upsell/Folgegeschäft verdient.
- **Trust-Regel:** Bewertungsanzeigen nie 5.0/5 zeigen — maximal 4.9 (5.0 wirkt gekauft). Sterne bleiben voll.
- Creatives + Copy pro Klient nur personalisiert (Name, Bilder, lokale Details) — die Struktur bleibt identisch. Das macht Massenproduktion möglich.

## 4. Klienten-Journey (A–Z)

1. Akquise (Ads oder Kaltakquise) → Termin mit Closer → Salescall → Vertrag + Onboarding-Gebühr
2. Automation erstellt CRM-Subaccount aus einem **Master-Snapshot** (alle Pipelines, Kalender, Workflows vorkonfiguriert)
3. Willkommens-Email mit Instructions: Meta-Partner-Einladung, Asset-Upload (Drive), Kalender verbinden
4. Onboarding-Call: WhatsApp/Kanäle verbinden, Systeme prüfen, Tracking-Setup (CAPI)
5. Creatives erstellen → Kampagnen einrichten und launchen
6. Leads laufen ein → Klient bucht Termine → Systeme erfassen sie automatisch (→ Sheet für Abrechnung)
7. Monatlicher Report + Abrechnung
8. Optional: Loyalty-Programm für Endkunden des Klienten (Wallet-Card, Reaktivierung)

## 5. Tech-Stack & Kernregeln

- **GoHighLevel (GHL)** — CRM. Ein Subaccount pro Klient, deployed als Klon eines Master-Snapshots. Verbesserungen fließen in den Snapshot zurück → alle neuen Klienten profitieren.
- **n8n** — Automation-Engine. Regel: **ein Workflow pro Aktion, nicht pro Klient** — Klienten-Daten kommen im Webhook-Payload. GHL immer per HTTP Request (Private Integration Token, Header `Version: 2021-07-28`), nie native Nodes.
- **Landing Pages extern hosten** (Netlify o.ä.), NICHT im Funnel-Builder des CRM. Single-File-HTML, **mobile-first only** (80%+ des Meta-Traffics ist mobil). GHL-Formular per iframe einbetten.
- **Tracking:** Meta Pixel auf der LP mit generierter `event_id` + CAPI serverseitig über den CRM-Workflow — Dedup über die gemeinsame event_id. FBCLID als Hidden Field mitführen für bessere Match-Quality. Sauberes Tracking ist nicht optional: Es ist die Abrechnungs-Grundlage.
- **Meta API/Ads-Hygiene:** Budgets in Cent, Advantage+ Creative Enhancements deaktivieren, Multi-Advertiser Ads deaktivieren, System User Token statt persönlichem Token.
- **Deeper-Funnel-Events:** nicht nur „Lead" an Meta senden, sondern auch Pipeline-Stages (Termin gebucht → erschienen → Kunde) als CAPI-Events — Meta optimiert dann auf echte Kunden statt Formular-Ausfüller.

## 6. Schwerpunkte, die über Erfolg/Misserfolg entscheiden

1. **Skalierbarkeit von Tag 1** — jede Lösung muss für 100 Klienten parallel funktionieren. Nichts pro Klient hardcoden.
2. **Termin-Tracking = Geschäftsgrundlage** — ohne lückenlose Erfassung kein Revenue Share, keine Beweisführung im Report.
3. **Wiederholung schlägt Kreativität** — dieselben 3–5 Offer-Strukturen laufen dauerhaft; getestet wird in Variationen, nicht in neuen Konzepten.
4. **Onboarding standardisieren** — Snapshot + Automation + Checklisten. Der Engpass beim Skalieren ist nie die Werbung, sondern das Onboarding.
5. **Kapazität und Erwartung des Klienten managen** — Leads sind wertlos, wenn der Klient nicht schnell anruft/zurückschreibt. Speed-to-Lead-Automationen (sofortige WhatsApp/SMS-Antwort) einbauen.
6. **Wissens-System pflegen** — Learnings pro Bereich (Creatives, Onboarding, Tech, Sales) in Memory-/Skill-Files dokumentieren, damit Claude sie in jeder Session anwendet und Fehler nicht wiederholt werden.

---

*Hinweis zur Abgrenzung: Dieses Playbook stammt aus den Nischen Tattoo/Optik/Zahn/Hörakustik — diese Vertikalen sind belegt. Die eigene Agentur baut auf andere Nischen (z.B. Fahrschulen, Küchenstudios, Badsanierung, Autofolierung) mit denselben Mechaniken.*
