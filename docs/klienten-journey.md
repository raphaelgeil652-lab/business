# Klienten-Journey (A–Z)

Der standardisierte Ablauf vom Erstkontakt bis zur laufenden Abrechnung. **Onboarding standardisieren ist der Schlüssel zum Skalieren** (Playbook §6.4) — der Engpass ist nie die Werbung, sondern das Onboarding.

## Ablauf

1. **Akquise** — Klienten-Leads (`../leads/klienten-leads.csv`) via Kaltakquise (Anruf/vor Ort) oder eigene Ads. Ziel: Termin mit Entscheider (Inhaber).
2. **Salescall** — Bedarf klären, System zeigen, **Kapazität prüfen** (kann er mehr Termine abarbeiten?), Erwartung managen. Abschluss: Vertrag + **Onboarding-Gebühr**.
3. **CRM-Subaccount anlegen** — Automation klont einen **Master-Snapshot** (alle Pipelines, Kalender, Workflows vorkonfiguriert) → neuer Subaccount in Minuten.
4. **Willkommens-E-Mail** (`../templates/onboarding-email.md`) mit Instructions: Meta-Partner-Einladung, Asset-Upload (Drive: Logo, Fotos, Referenzen), Kalender verbinden.
5. **Onboarding-Call** — WhatsApp/Kanäle verbinden, Systeme prüfen, **Tracking-Setup (Pixel + CAPI)**, Kalender-Slots festlegen.
6. **Creatives + Landingpage** — LP-Vorlage personalisieren (Name/Fotos/Ort), Ad-Creatives + Copy aus Vorlagen, Kampagne einrichten und **launchen**.
7. **Betrieb** — Leads laufen ein → **Speed-to-Lead** (sofort WhatsApp/SMS) → Klient bucht Termine → Systeme erfassen sie automatisch (→ Sheet für Abrechnung).
8. **Report + Abrechnung** — monatlich: Leads, Termine, Abschlüsse, Spend/Ergebnis. Abrechnung Fix oder Revenue Share.
9. **Optional: Loyalty/Reaktivierung** — Wallet-Card/Reaktivierungs-Flows für die Endkunden des Klienten.

## Onboarding-Checkliste (pro neuem Klient)

- [ ] Vertrag unterschrieben + Onboarding-Gebühr bezahlt
- [ ] Kapazität/Erwartung bestätigt (kann Termine abarbeiten)
- [ ] CRM-Subaccount aus Master-Snapshot geklont
- [ ] Meta: als Partner eingeladen, System User Token, Pixel-Zugriff, Werbekonto
- [ ] Assets erhalten: Logo, echte Fotos/Referenzen, Öffnungszeiten, USP, Bewertungen
- [ ] Landingpage personalisiert + extern gehostet (Netlify/Vercel), GHL-Formular im iframe
- [ ] Tracking geprüft: Pixel + `event_id` + CAPI (Dedup), FBCLID-Hidden-Field, Testlead
- [ ] Kalender verbunden, Slots definiert
- [ ] Speed-to-Lead-Automation (WhatsApp/SMS sofort) aktiv + getestet
- [ ] Kampagne(n) live, Budget gesetzt (in Cent), Advantage+/Multi-Advertiser aus
- [ ] Deeper-Funnel-Events (Termin gebucht/erschienen/Kunde) als CAPI konfiguriert
- [ ] Erster Report-Termin vereinbart

## Erwartungs-/Kapazitätsmanagement

Leads sind wertlos, wenn der Klient nicht **schnell** anruft/zurückschreibt. Speed-to-Lead-Automationen von Tag 1. Vor Signing klären, dass er die Termine auch bedienen kann — sonst kündigt er trotz guter Performance.
