# Landingpage-Vorlage (Küche & Bad)

Single-File, mobile-first Ad-Landingpage nach Playbook. Für Meta-Ad-Traffic mit
Gratis-Anker-Offer (Küche: 3D-Planung / Bad: Vor-Ort-Beratung). Extern hosten
(Netlify/Vercel), **kein Build**. Slop-geprüft (impeccable: 0 Anti-Patterns).

## Pro Klient anpassen (im Code mit `[ ]` markiert)

- **Texte:** `[Studioname]`, `[Ort]`, `[Adresse]`, `[Telefon]`, Offer (Küche ↔ Bad).
- **Bilder:** Hero-Bild + Bewertungen durch **echte** Klienten-Fotos/Google-Bewertungen ersetzen. **Sterne max 4,9** (nie 5,0 — wirkt gekauft).
- **Meta Pixel:** `PIXEL_ID` (3×: init, noscript-img, noscript-url) eintragen.
- **GHL-Formular:** `GHL_FORM_ID` im iframe `data-src` eintragen.
- **Impressum/Datenschutz:** Links im Footer setzen.

## Tracking (Playbook: Abrechnungs-Grundlage)

- Meta **Pixel** feuert `PageView` mit generierter **`event_id`**.
- Beim Absenden feuert das Skript `Lead` mit **derselben `event_id`** → **Dedup** mit dem serverseitigen **CAPI**-Event (aus dem n8n/GHL-Workflow).
- **`fbclid`** + UTM-Parameter werden aus der URL gelesen und an den GHL-iframe als Query-Parameter übergeben → im GHL-Formular als (versteckte) Felder anlegen, damit sie im CRM ankommen.

## GHL-Formular vorbereiten

Im GHL-Formular Hidden-Fields anlegen: `event_id`, `fbclid`, `utm_source`, `utm_campaign`, `utm_medium`. Diese werden per URL-Parameter befüllt. Beim Submit sendet GHL eine `postMessage`, die den Pixel-`Lead` auslöst.

## Deploy

Ordner extern hosten (Netlify Drop / Vercel). Eine LP-Instanz pro Klient (eigene
`PIXEL_ID`/`GHL_FORM_ID`). Vor Launch: Testlead absenden und prüfen, dass Lead
im CRM ankommt **und** das Pixel/CAPI-Event dedupliziert erscheint.

## Design

Warme, vertrauensbildende Palette (Sand/Ton/Terrakotta) + DM Serif Display + Manrope.
Mobile-first, Sticky-CTA unten. Farben zentral in `:root` anpassbar.
