# Wissen: Tech (GHL, n8n, Tracking)

Learnings zu Automationen, CRM, Tracking. Grundregeln stehen in `../../anleitungen/tech-stack.md`.

## Gelöste Probleme

- _(z. B. CAPI-Dedup, PIT-Header, Webhook-Payload-Struktur — mit Lösung eintragen)_

## Offene Punkte / To-do

- _(noch leer)_

## Webseitenbau (Skill `10k-websites`, seit 18.08.2026)

- Ablauf, Gates und Qualitätsboden für jede neue Seite: `../../anleitungen/webseitenbau-standard.md`.
- Die drei Fehler, die dort schon vorweggenommen sind, weil sie in echten Builds passiert sind:
  Video per Blob laden (viele Hoster können keine Teil-Downloads, sonst scrubbt die Seite live nicht),
  Seeks gattern (sonst ruckelt Chrome), und die fünf Handy/Reduced-Motion-Gates in CSS **und** JS
  identisch halten, sonst lädt das Handy ein Video, das es nie zeigt.
- Symptom-Ursache-Lösung-Tabellen: `../../.agents/skills/10k-websites/references/troubleshooting.md`.

## Snippets / Referenzen

- GHL HTTP Request Header: `Version: 2021-07-28`, PIT.
- Pixel + CAPI Dedup über gemeinsame `event_id`; FBCLID als Hidden Field.
