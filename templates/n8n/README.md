# n8n-Workflow-Grundgerüste (Küche & Bad)

Importierbare Skelett-Workflows zum Playbook (Details: `../../docs/ghl-n8n-aufbau.md`).
**Grundgerüste, kein Fertig-System** — Tokens/URLs/Store müssen noch gesetzt werden.
Prinzip: ein Workflow pro Aktion, Klient kommt aus dem Payload/Store (nichts hardcoden).

| Datei | Zweck | Webhook-Pfad |
|---|---|---|
| `wf1-lead-intake.json` | Lead → GHL-Kontakt + Meta-CAPI `Lead` + Speed-to-Lead auslösen | `/webhook/lead-intake` |
| `wf2-speed-to-lead.json` | Sofort-Nachricht (WhatsApp/SMS) an den Lead | `/webhook/speed-to-lead` |
| `wf3-stage-to-capi.json` | GHL-Stage-Wechsel → Meta-CAPI (`Schedule`/`AppointmentShow`/`Purchase`) | `/webhook/stage-changed` |

## Importieren

n8n → *Workflows → Import from File* → jeweilige `.json` wählen. Danach je Workflow den
Webhook aktivieren (Production-URL notieren).

## Nach dem Import anpassen (TODO im Code markiert)

1. **Klienten-Store statt Beispiel-Map:** In `wf1` (Node „Config & Normalisieren") und `wf3`
   (Node „Stage → Event + Config") ist eine `CLIENTS`-Beispiel-Map hinterlegt. Ersetze sie
   durch einen echten Lookup (Google Sheet / Postgres / n8n Data Table), gemappt über
   `body.locationId` → `{ pit, pixelId, capiToken }`. **Keine echten Tokens ins Repo committen.**
2. **WF-2-URL in WF-1:** Im Node „Trigger Speed-to-Lead (WF-2)" die Platzhalter-URL
   `https://DEINE-N8N-URL/webhook/speed-to-lead` durch deine echte WF-2-Production-URL ersetzen.
3. **GHL-Outbound-Webhook (für WF-3):** Im GHL-Master-Snapshot einen Workflow
   „Opportunity Stage Changed → Webhook" auf die WF-3-URL zeigen lassen (siehe
   `../../docs/ghl-n8n-aufbau.md`, Teil A7). Payload muss `locationId`, `stage`, `event_id` enthalten.
4. **Meta Graph-Version** (`v21.0`) und **GHL-Endpunkte** vor Live gegen die aktuelle Doku prüfen.

## Tracking-Dedup (wichtig)

`event_id` kommt aus dem Landingpage-Formular (`../landingpage/`) über GHL bis in WF-1/WF-3.
Browser-Pixel und Server-CAPI nutzen **dieselbe** `event_id` → Meta dedupliziert. E-Mail/Telefon
werden in WF-1 per SHA256 (Crypto-Node) gehasht, bevor sie an Meta gehen.

## Testen

Siehe Testplan in `../../docs/ghl-n8n-aufbau.md` (Teil F): Testlead senden → Kontakt in GHL,
Speed-to-Lead-Nachricht < 5 Min, im Meta Events Manager „Browser + Server (dedupliziert)".
