import type { KfzPromoProps } from "./types";

// ============================================================================
// PRESETS — ein Preset pro Kunde/Service-Modul.
// Neuer Kunde: Objekt kopieren, Werte tauschen, echte Fotos in /public legen.
// Struktur (Skelett) NIE ändern — nur die Werte. (siehe service-module.md)
// ============================================================================

// Modul 1 — Aufbereitung / Keramikversiegelung (stärkster Vorher/Nachher-Case)
export const aufbereitungBeispiel: KfzPromoProps = {
  betrieb: "Auto Müller",
  ort: "Pfullendorf",
  telefon: "07552 / 12 34 56",

  modulLabel: "Fahrzeugaufbereitung",
  hook: "Ihr Auto sieht müde aus?",
  nachHook: "Wir machen daraus wieder ein Auto wie neu.",

  vorherBild: "before.jpg",
  nachherBild: "after.jpg",

  offerTitel: "Kostenloser Lack-Check",
  offerZusatz: "Festpreis, bevor Sie sich entscheiden",

  bewertung: 4.9,
  bewertungenAnzahl: 87,

  cta: "Jetzt Termin sichern",
};

// Modul 2 — Folierung / Lackschutzfolie (PPF). Beispiel für einen zweiten Kunden.
export const folierungBeispiel: KfzPromoProps = {
  betrieb: "CarWrap Studio",
  ort: "Sigmaringen",
  telefon: "07571 / 98 76 54",

  modulLabel: "Folierung & Lackschutz",
  hook: "Neuer Look für Ihr Auto?",
  nachHook: "Vollfolierung & Lackschutzfolie vom Profi.",

  vorherBild: "before.jpg",
  nachherBild: "after.jpg",

  offerTitel: "Kostenlose Beratung",
  offerZusatz: "Festpreis für Ihr Wunsch-Design",

  bewertung: 4.8,
  bewertungenAnzahl: 54,

  cta: "Jetzt Wunschfarbe anfragen",
};
