/**
 * Sichere Zonen.
 *
 * Die Bedienoberfläche der App liegt ÜBER dem Video: oben die Profilzeile, unten
 * die Bildunterschrift und der Musiktitel, rechts Herz, Kommentare und Teilen.
 * Alles, was dort liegt, ist für den Zuschauer halb verdeckt.
 *
 * Die Werte sind Anteile, keine festen Pixel — so gelten sie für jede Videogröße.
 * Herleitung und Quellen: `videoschnitt/forschung/virale-videos.md`, Punkt 5.
 *
 * Unten sind es bewusst 23 % (bei 1920 px sind das 442 px): Die Bildunterschrift
 * wächst, wenn jemand sie antippt. Die Quellen empfehlen mindestens 370 px.
 */
export const ZONEN = {
  oben: 0.06,
  unten: 0.23,
  links: 0.06,
  rechts: 0.17,
} as const;

export type Rahmen = {
  /** Alle Werte in Pixeln, bezogen auf die Maße des Videos. */
  oben: number;
  unten: number;
  links: number;
  rechts: number;
  /** Breite, die für Text übrig bleibt. */
  nutzbareBreite: number;
  /** Faktor für alle Schriftgrößen und Abstände: 1 bei 1920 px Höhe. */
  s: number;
};

export const rahmen = (breite: number, hoehe: number): Rahmen => ({
  oben: hoehe * ZONEN.oben,
  unten: hoehe * ZONEN.unten,
  links: breite * ZONEN.links,
  rechts: breite * ZONEN.rechts,
  nutzbareBreite: breite * (1 - ZONEN.links - ZONEN.rechts),
  s: hoehe / 1920,
});
