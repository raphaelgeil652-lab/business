import { z } from "zod";

// Ein einziges Prop-Schema für ALLE Kfz-Kunden.
// Neuer Kunde = neues Preset mit diesen Werten. Skelett bleibt identisch.
export const kfzPromoSchema = z.object({
  // Betrieb
  betrieb: z.string(),          // "Auto Müller"
  ort: z.string(),              // "Pfullendorf"
  telefon: z.string(),          // "07552 / 12 34 56"

  // Service-Modul
  modulLabel: z.string(),       // "Fahrzeugaufbereitung" (kleine Kennzeichnung oben)
  hook: z.string(),             // "Dein Auto sieht müde aus?"
  nachHook: z.string(),         // "Wir machen daraus wieder ein Auto wie neu."

  // Vorher/Nachher (Dateinamen in /public)
  vorherBild: z.string(),       // "before.jpg"
  nachherBild: z.string(),      // "after.jpg"

  // Angebot (Gratis-Anker)
  offerTitel: z.string(),       // "Kostenloser Lack-Check"
  offerZusatz: z.string(),      // "Festpreis, bevor Sie sich entscheiden"

  // Trust
  bewertung: z.number(),        // z.B. 4.9  (Playbook: nie 5,0)
  bewertungenAnzahl: z.number(),// z.B. 87

  // CTA
  cta: z.string(),              // "Jetzt Termin sichern"
});

export type KfzPromoProps = z.infer<typeof kfzPromoSchema>;
