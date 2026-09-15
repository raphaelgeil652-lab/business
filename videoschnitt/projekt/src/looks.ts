/**
 * Farblooks.
 *
 * Handyaufnahmen sehen flach aus. Ein Look ist das, was aus „Video vom Handy"
 * „bewusst gemacht" macht. Umgesetzt mit CSS-Filtern und Farbebenen über dem
 * Bild — das rendert schnell und ist an jeder Stelle nachvollziehbar.
 *
 * Neuen Look anlegen: hier einen Eintrag ergänzen, fertig.
 */
export type LookName =
  | 'natuerlich'
  | 'hart'
  | 'kino'
  | 'warm'
  | 'kalt'
  | 'vintage'
  | 'nacht'
  | 'schwarzweiss';

export type Ebene = {
  farbe: string;
  /** CSS-Mischmodus, z. B. 'soft-light', 'overlay', 'screen', 'multiply'. */
  modus: string;
  deckkraft: number;
};

export type Look = {
  /** Was der Look macht — in einem Satz. */
  beschreibung: string;
  /** CSS-Filterkette auf das Videobild. */
  filter: string;
  /** Farbebenen über dem Bild, von unten nach oben. */
  ebenen: Ebene[];
  /** Körnung: 0 = aus, 0.1 = sichtbar, 0.25 = grob. */
  koernung: number;
  /** Randabdunklung: 0 = aus, 0.5 = deutlich. */
  vignette: number;
};

export const LOOKS: Record<LookName, Look> = {
  natuerlich: {
    beschreibung: 'Nur leicht angehoben. Für alles, was echt wirken soll.',
    filter: 'contrast(1.05) saturate(1.05)',
    ebenen: [],
    koernung: 0,
    vignette: 0.15,
  },
  hart: {
    beschreibung: 'Knackig und laut. Der Standard auf TikTok.',
    filter: 'contrast(1.22) saturate(1.28) brightness(1.03)',
    ebenen: [{farbe: '#ff8a3d', modus: 'soft-light', deckkraft: 0.1}],
    koernung: 0.04,
    vignette: 0.3,
  },
  kino: {
    beschreibung: 'Türkise Schatten, warme Haut. Der Kinolook.',
    filter: 'contrast(1.16) saturate(0.95)',
    ebenen: [
      {farbe: '#0d3b45', modus: 'multiply', deckkraft: 0.2},
      {farbe: '#ffb26b', modus: 'soft-light', deckkraft: 0.24},
    ],
    koernung: 0.06,
    vignette: 0.38,
  },
  warm: {
    beschreibung: 'Abendsonne. Gut für draußen und für Gesichter.',
    filter: 'contrast(1.08) saturate(1.12) sepia(0.08)',
    ebenen: [{farbe: '#ffb86b', modus: 'soft-light', deckkraft: 0.26}],
    koernung: 0.03,
    vignette: 0.22,
  },
  kalt: {
    beschreibung: 'Sachlich und klar. Für Technik und Werkstatt.',
    filter: 'contrast(1.12) saturate(0.98)',
    ebenen: [{farbe: '#6fb8ff', modus: 'soft-light', deckkraft: 0.22}],
    koernung: 0.03,
    vignette: 0.25,
  },
  vintage: {
    beschreibung: 'Ausgewaschen, körnig, alt. Für Erinnerungen.',
    filter: 'contrast(0.92) saturate(0.78) sepia(0.22) brightness(1.06)',
    ebenen: [
      {farbe: '#d9c7a3', modus: 'soft-light', deckkraft: 0.3},
      {farbe: '#2b2118', modus: 'screen', deckkraft: 0.12},
    ],
    koernung: 0.16,
    vignette: 0.42,
  },
  nacht: {
    beschreibung: 'Blau, kontrastreich, dunkle Tiefen.',
    filter: 'contrast(1.3) saturate(1.1) brightness(0.94)',
    ebenen: [{farbe: '#1b3a8f', modus: 'soft-light', deckkraft: 0.3}],
    koernung: 0.08,
    vignette: 0.5,
  },
  schwarzweiss: {
    beschreibung: 'Schwarzweiß mit hartem Kontrast.',
    filter: 'grayscale(1) contrast(1.28) brightness(1.02)',
    ebenen: [],
    koernung: 0.1,
    vignette: 0.35,
  },
};

export const look = (name?: string): Look => LOOKS[(name ?? 'natuerlich') as LookName] ?? LOOKS.natuerlich;
