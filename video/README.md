# video — Remotion-Video-Engine für Clickculture

Erzeugt fertige **MP4-Ad-Creatives** (Meta Reels/Stories, TikTok, YouTube Shorts) für Kfz-Kunden —
programmatisch mit [Remotion](https://www.remotion.dev) (React → MP4). Gleiches Prinzip wie das
LP-Skelett: **ein Template, pro Kunde nur die Inhalte tauschen.** Kein neues Design pro Kunde.

Format: **1080 × 1920 (9:16), 15 s, H.264-MP4** — das dominante Reels/Stories-Format.

---

## So funktioniert es (in 30 Sekunden)

Ein Video besteht aus vier Szenen, die immer gleich aufgebaut sind (`src/kfz/`):

1. **Hook** — Aufmerksamkeits-Frage + Betrieb/Ort
2. **Vorher/Nachher** — animierter Slider (stärkstes Trust-Element der Branche)
3. **Offer** — der Gratis-Anker + Sterne-Bewertung (max. 4,9, Playbook-Regel)
4. **CTA** — „Jetzt Termin sichern" + Telefonnummer

Getauscht wird **nur ein Datenobjekt** (`preset`) + die zwei Fotos. Skelett bleibt identisch.

---

## Setup (einmalig)

```bash
cd video
npm install
```

Chromium ist in dieser Umgebung schon da; Remotion nutzt die vorinstallierte `chrome-headless-shell`.
`render.sh` findet sie automatisch.

## Video rendern → MP4

```bash
./render.sh                       # KfzAufbereitung -> out/KfzAufbereitung.mp4
./render.sh KfzFolierung          # -> out/KfzFolierung.mp4
./render.sh KfzAufbereitung out/mueller.mp4
```

Das fertige MP4 liegt in `out/` (nicht eingecheckt).

## Live im Editor bearbeiten (Vorschau)

```bash
npm run studio
```

Öffnet das Remotion Studio im Browser: Szenen live sehen, Props im Panel ändern (Betrieb, Hook,
Offer …), scrubben. Ideal zum Feintuning vor dem Rendern.

---

## Neuen Kunden anlegen (der eigentliche Arbeitsschritt)

1. **Fotos** des Kunden nach `public/` legen, z. B. `mueller-vorher.jpg` / `mueller-nachher.jpg`
   (Hochformat 9:16 füllt am besten; echte Betriebsfotos, keine Stockbilder — Playbook).
2. In `src/kfz/presets.ts` ein Preset kopieren und Werte ausfüllen:

   ```ts
   export const mueller: KfzPromoProps = {
     betrieb: "Auto Müller",
     ort: "Pfullendorf",
     telefon: "07552 / 12 34 56",
     modulLabel: "Fahrzeugaufbereitung",
     hook: "Ihr Auto sieht müde aus?",
     nachHook: "Wir machen daraus wieder ein Auto wie neu.",
     vorherBild: "mueller-vorher.jpg",
     nachherBild: "mueller-nachher.jpg",
     offerTitel: "Kostenloser Lack-Check",
     offerZusatz: "Festpreis, bevor Sie sich entscheiden",
     bewertung: 4.9,          // nie 5,0 (Playbook-Trust-Regel)
     bewertungenAnzahl: 87,
     cta: "Jetzt Termin sichern",
   };
   ```

3. In `src/Root.tsx` eine `<Composition>` mit eigener `id` und diesem Preset ergänzen.
4. `./render.sh <id>` — fertig.

Die passenden Texte pro Service (Aufbereitung, Folierung, Smart Repair …) stehen fertig in
`../nischen/autowerkstaetten/service-module.md` — einfach übernehmen.

---

## Struktur

```
video/
├── render.sh              Ein-Befehl-Render zu MP4 (nutzt vorinstalliertes Chromium)
├── remotion.config.ts     Output-Einstellungen (H.264, MP4)
├── src/
│   ├── index.ts           registerRoot
│   ├── Root.tsx           Compositions-Register — je Kunde eine Composition
│   ├── theme.ts           Marken-Farben (aus der Landingpage) + Schrift
│   ├── components/Stars   Sterne-Bewertung
│   └── kfz/
│       ├── types.ts       das Prop-Schema für ALLE Kunden (zod)
│       ├── presets.ts     ein Preset pro Kunde/Service-Modul
│       ├── KfzPromoAd.tsx  Szenen-Abfolge + Übergänge
│       └── scenes/        Hook · VorherNachher · Offer · CTA
├── public/                Fotos & Assets (before.jpg/after.jpg sind Platzhalter)
└── out/                   gerenderte MP4s (nicht eingecheckt)
```

## Was noch fehlt / Ausbaustufen

- **Echte Kundenfotos** ersetzen `public/before.jpg` / `after.jpg` (Platzhalter).
- **Musik/Ton:** eine lizenzfreie Tonspur in `public/` legen und per `<Audio>` einbinden
  (aktuell ohne Ton — für Meta-Feeds oft ok, Reels laufen besser mit Musik).
- **Weitere Formate:** 1:1 (Feed) und 16:9 durch zusätzliche `<Composition>` mit anderer
  Breite/Höhe — Szenen sind relativ aufgebaut und passen sich an.
- **Untertitel/Text-Varianten** je Service-Modul als weitere Presets.
