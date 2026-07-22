# GHL-Master-Snapshot + n8n-Workflows — Schritt-für-Schritt

Konkrete Bauanleitung für das System-Rückgrat (Playbook §5). Leitprinzip über allem:
**skalierbar ab Tag 1 — nichts pro Klient hardcoden.** Der Master-Snapshot wird einmal
gebaut und pro Klient geklont; n8n hat **einen Workflow pro Aktion**, klientenspezifische
Daten kommen im Webhook-Payload bzw. aus einem zentralen Klienten-Store.

> Hinweis: GHL- und Meta-APIs ändern sich. Endpunkte/Version hier sind der Stand des
> Playbooks (GHL Header `Version: 2021-07-28`, Base `https://services.leadconnectorhq.com`).
> Vor dem Live-Gang gegen die aktuelle Doku prüfen.

---

## TEIL A — GHL Master-Snapshot (einmal bauen, dann klonen)

Alles hier ist **klienten-agnostisch**. Klientenspezifisches (Name, Pixel, Telefon) kommt
später über Custom Values / den Klienten-Store.

### A1. Custom Fields (Kontakt) anlegen
Für Tracking + Personalisierung. Anlegen unter *Settings → Custom Fields*:
- `offer_typ` (Text: „kueche" | „bad")
- `event_id` (Text) — für Meta Pixel↔CAPI-Dedup
- `fbclid` (Text), `fbc` (Text), `fbp` (Text)
- `utm_source`, `utm_medium`, `utm_campaign` (Text)
- `lead_quelle` (Text, z. B. „meta-lp")

### A2. Custom Values (Platzhalter je Subaccount)
Unter *Settings → Custom Values* — werden beim Klonen pro Klient gefüllt:
- `{{studioname}}`, `{{ort}}`, `{{telefon}}`, `{{kalender_link}}`
- `{{pixel_id}}`, `{{n8n_webhook_stage}}` (URL zu WF-3)

### A3. Pipeline „Kundengewinnung" mit Stages
Unter *Opportunities → Pipelines*. Die Stages bilden den **Deeper Funnel** (jede Stage
= ein Meta-Event, siehe C3):
1. **Neuer Lead** → Meta `Lead`
2. **Kontaktiert** (Speed-to-Lead raus)
3. **Termin gebucht** → Meta `Schedule`
4. **Termin erschienen** → Meta `AppointmentShow` (Custom Event)
5. **Angebot** → Meta `InitiateCheckout` (optional)
6. **Kunde gewonnen** → Meta `Purchase`
7. **Verloren** (Grund im Feld)

### A4. Kalender „Kostenlose Planung"
Unter *Calendars*. Ein Buchungskalender (Küche: 3D-Planung / Bad: Vor-Ort-Beratung).
- Bestätigungs-Mail + SMS an Lead aktivieren.
- Erinnerungen: 24 h + 2 h vorher (native GHL-Workflow, siehe A6).
- Bei Buchung → Kontakt automatisch in Stage „Termin gebucht" schieben.

### A5. Tags
`lead-neu`, `kontaktiert`, `termin-gebucht`, `no-show`, `kunde`, `reaktivierung`.

### A6. Native GHL-Automationen (bleiben in GHL, nicht n8n)
Was reine CRM-/Kommunikations-Logik ist, läuft nativ in GHL:
- **Termin-Erinnerungen** (24 h / 2 h vor Termin).
- **No-Show-Flow**: Status „no-show" → Reaktivierungs-Nachricht + Rückstufung.
- **Kalender-Bestätigung** nach Buchung.

### A7. Outbound-Webhook bei Stage-Wechsel (Brücke zu n8n)
Ein GHL-Workflow: **Trigger = Opportunity Stage Changed** → Aktion **Webhook** an
`{{n8n_webhook_stage}}` (WF-3). Payload: `locationId`, `contactId`, `stage`, `event_id`,
`offer_typ`, Kontaktdaten (email/phone gehasht wird erst in n8n). So meldet GHL jede
Funnel-Bewegung an n8n → Meta-CAPI.

### A8. Private Integration Token (PIT)
Pro Subaccount unter *Settings → Private Integrations* ein PIT mit Scopes
(contacts, opportunities, conversations, calendars) erzeugen. **Wird in den Klienten-Store
gelegt** (Teil B), nie in Workflows hardcoden.

### A9. Snapshot ziehen
Wenn A1–A8 stehen: *Settings → Snapshots → Create Snapshot*. Das ist der **Master-Snapshot**.
Jeder neue Klient = Klon davon (manuell oder via WF-4).

---

## TEIL B — Klienten-Store (zentrale Zuordnung)

Damit n8n **einen** Workflow für alle Klienten nutzen kann, braucht es pro Klient die
Secrets/Config — gemappt über die `locationId` (GHL-Subaccount-ID).

Store = Google Sheet, Postgres oder n8n Data Table mit Spalten:

| locationId | studioname | ghl_pit | pixel_id | capi_token | offer_typ |
|---|---|---|---|---|---|

Jeder Workflow liest zuerst über die eingehende `locationId` die passende Zeile → holt
`ghl_pit`, `pixel_id`, `capi_token`. **Kein Secret im Workflow selbst.**

---

## TEIL C — n8n-Workflows (ein Workflow pro Aktion)

> **Importierbare Grundgerüste liegen bereit:** `../templates/n8n/` (WF-1/2/3 als `.json` + README).
> In n8n importieren, dann Tokens/Store/URLs setzen (siehe dortige README).

Gemeinsame Bausteine:
- **GHL-Call:** HTTP Request, Base `https://services.leadconnectorhq.com`,
  Header `Authorization: Bearer {{pit}}`, `Version: 2021-07-28`, `Content-Type: application/json`.
- **Meta-CAPI-Call:** HTTP POST `https://graph.facebook.com/v21.0/{{pixel_id}}/events?access_token={{capi_token}}`.
- **Dedup:** dieselbe `event_id` wie im Browser-Pixel (kommt aus dem LP-Formular-Feld).
- **Hashing für Meta:** E-Mail lowercase + SHA256; Telefon nur Ziffern inkl. Ländercode + SHA256.

### WF-1 — Lead-Intake (Herzstück)
**Trigger:** Webhook (POST). Quelle: GHL „Form Submitted"-Webhook **oder** LP direkt.
Payload u. a.: `locationId, name, phone, email, offer_typ, event_id, fbclid, fbp, utm_*`.

Schritte:
1. **Store-Lookup** (locationId → pit, pixel_id, capi_token).
2. **GHL Upsert Contact** — `POST /contacts/upsert`
   Body: `{ locationId, name, phone, email, tags:["lead-neu"], customFields:[{key:"event_id",field_value:event_id},{key:"fbclid",...},{key:"offer_typ",...}] }`
3. **GHL Opportunity anlegen** — Pipeline „Kundengewinnung", Stage „Neuer Lead".
4. **Meta CAPI `Lead`** — `event_id` = event_id (Dedup!), `action_source:"website"`,
   `user_data:{ em:[sha256(email)], ph:[sha256(phone)], fbc: aus fbclid, fbp, client_ip_address, client_user_agent }`.
5. **Speed-to-Lead auslösen** → WF-2 aufrufen (oder direkt Nachricht senden).
6. **Response 200** an Trigger.

### WF-2 — Speed-to-Lead (sofortige Antwort)
**Trigger:** von WF-1 (Execute Workflow) mit `contactId, locationId`.
Schritt: **GHL Send Message** — `POST /conversations/messages`
Body: `{ type:"WhatsApp" (Fallback SMS), contactId, message:"Hallo {{name}}, danke für deine Anfrage bei {{studioname}}! Wir melden uns gleich für deinen kostenlosen Planungstermin. 😊" }`
→ Ziel: **unter 5 Minuten** reagieren. Tag `kontaktiert`, Stage → „Kontaktiert".

### WF-3 — Stage-Change → Meta CAPI (Deeper Funnel)
**Trigger:** Webhook von GHL (A7), Payload: `locationId, contactId, stage, event_id`.
Schritte:
1. Store-Lookup.
2. **Stage → Event-Mapping:**
   - „Termin gebucht" → `Schedule`
   - „Termin erschienen" → `AppointmentShow` (Custom)
   - „Kunde gewonnen" → `Purchase` (+ `custom_data.value`, `currency:"EUR"`)
3. **Meta CAPI** senden (gleiche `event_id`-Logik). → Meta optimiert auf echte Kunden,
   nicht auf Formular-Ausfüller.

### WF-4 — Onboarding: Subaccount aus Snapshot (optional, fortgeschritten)
**Trigger:** Webhook „neuer Klient" (nach Vertrag). Payload: Klientendaten.
Schritte: GHL `POST /locations/` mit `snapshotId` (Master) → PIT erzeugen/eintragen →
Custom Values füllen (`studioname`, `pixel_id`, `telefon`, …) → Zeile in Klienten-Store
schreiben → Willkommens-Mail (`../templates/onboarding-email.md`) auslösen.
> Startphase: ruhig **manuell klonen** (Snapshot laden), WF-4 erst automatisieren, wenn es sich lohnt.

### WF-5 — Report (optional, geplant)
**Trigger:** Schedule (monatlich). Pull: Leads, Termine, Shows, Kunden, Spend →
Zusammenfassung ins Reporting-Sheet / E-Mail an Klient.

---

## TEIL D — Tracking end-to-end (Dedup-Kette)

1. **LP** generiert `event_id`, feuert Pixel `PageView`/`Lead` (Browser) mit dieser ID,
   übergibt `event_id` + `fbclid` als Hidden-Feld ans GHL-Formular.
2. **GHL** speichert `event_id`/`fbclid` im Kontakt, feuert „Form Submitted"-Webhook → **WF-1**.
3. **WF-1** sendet **CAPI `Lead`** mit **derselben `event_id`** → Meta dedupliziert Browser + Server.
4. **Stage-Wechsel** in GHL → **WF-3** → CAPI `Schedule`/`Purchase` etc.

**Ohne diese Kette kein sauberes Tracking → kein Revenue-Share-Beweis.** (Playbook §6.2)

---

## TEIL E — Neuen Klienten aufsetzen (Kurz-Ablauf)

1. Snapshot klonen (manuell oder WF-4) → neuer Subaccount.
2. PIT erzeugen, Custom Values füllen (Name, Ort, Telefon, Pixel-ID, Kalender).
3. Zeile im Klienten-Store anlegen (locationId → pit/pixel/capi_token).
4. Landingpage aus `../templates/landingpage/` personalisieren + hosten (Pixel-ID, GHL-Form-ID).
5. **Testlead** senden → prüfen: Kontakt in GHL ✔, Speed-to-Lead-Nachricht ✔, CAPI-Event
   im Meta Events Manager **dedupliziert** ✔.
6. Kampagne live (Budget in Cent, Advantage+/Multi-Advertiser aus, System User Token).

## TEIL F — Testplan vor Launch

- [ ] Testlead über die LP → landet in GHL mit `event_id`/`fbclid` in Custom Fields
- [ ] Speed-to-Lead-Nachricht kommt in < 5 Min
- [ ] Meta Events Manager: `Lead` zeigt „Browser + Server (dedupliziert)"
- [ ] Stage manuell auf „Termin gebucht" → `Schedule`-Event erscheint
- [ ] Stage „Kunde gewonnen" → `Purchase` mit Wert
- [ ] Keine Secrets im Workflow (alles aus Store); ein Workflow bedient mehrere Test-Locations

## Merksatz

Ein Workflow pro Aktion, Klient kommt aus dem Payload/Store. So bedient dieselbe n8n-Instanz
1 oder 100 Klienten — genau das ist der Skalierungshebel.
