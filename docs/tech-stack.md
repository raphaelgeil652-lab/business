# Tech-Stack & Kernregeln

Aus dem Playbook (§5). Grundregel über allem: **Skalierbar ab Tag 1 — nichts pro Klient hardcoden.** Jede Lösung muss für 100 Klienten parallel funktionieren.

> **Konkrete Bauanleitung (Schritt für Schritt): [`ghl-n8n-aufbau.md`](ghl-n8n-aufbau.md)** — Master-Snapshot, n8n-Workflows, Klienten-Store, Tracking-Dedup, Testplan. Dieses Dokument hier fasst die Kernregeln zusammen.

## GoHighLevel (GHL) — CRM

- **Ein Subaccount pro Klient**, deployed als **Klon eines Master-Snapshots** (alle Pipelines, Kalender, Workflows vorkonfiguriert).
- Verbesserungen fließen **zurück in den Snapshot** → alle neuen Klienten profitieren automatisch.
- Zugriff aus Automationen immer per **HTTP Request** mit **Private Integration Token (PIT)**, Header `Version: 2021-07-28` — **nie native Nodes**.

## n8n — Automation-Engine

- **Ein Workflow pro Aktion, nicht pro Klient.** Klienten-spezifische Daten kommen im **Webhook-Payload** — nicht im Workflow hardcoden.
- GHL nur per HTTP Request (siehe oben).

## Landingpages

- **Extern hosten** (Netlify/Vercel o. ä.), **nicht** im Funnel-Builder des CRM.
- **Single-File-HTML, mobile-first only** (80 %+ des Meta-Traffics ist mobil).
- **GHL-Formular per iframe** einbetten.
- Vorlage: `../templates/landingpage/`.

## Tracking (Abrechnungs-Grundlage — nicht optional)

- **Meta Pixel** auf der LP mit generierter **`event_id`** + **CAPI serverseitig** über den CRM/n8n-Workflow.
- **Dedup** über die gemeinsame `event_id` (Browser-Pixel + Server-CAPI).
- **FBCLID** als Hidden Field mitführen → bessere Match-Quality.
- **Deeper-Funnel-Events:** nicht nur „Lead", sondern Pipeline-Stages (Termin gebucht → erschienen → Kunde) als CAPI-Events → Meta optimiert auf echte Kunden.

## Meta API / Ads-Hygiene

- Budgets **in Cent**.
- **Advantage+ Creative Enhancements deaktivieren.**
- **Multi-Advertiser Ads deaktivieren.**
- **System User Token** statt persönlichem Token.

## Merksatz

Sauberes Tracking = Beweis + Abrechnung. Alles andere lässt sich nachbessern, fehlendes Tracking nicht rückwirkend.
