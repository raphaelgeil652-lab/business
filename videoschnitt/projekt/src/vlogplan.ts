import type {Grafik} from './komponenten/Grafiken';
import type {KlangEinsatz} from './komponenten/Klang';
import vlogDaten from './daten/vlogplan.json';

export type Szene = {
  /** Datei in `public/`, z. B. "vlog/01.mov". */
  datei: string;
  /** Sekunde in dieser Aufnahme, ab der gezeigt wird. */
  von: number;
  /** Wie lange diese Szene läuft. */
  dauer: number;
  zoom?: [number, number];
  rahmen?: 'weit' | 'nah' | 'nah-links' | 'nah-rechts' | 'kopf';
  /** Eigener Look nur für diese Szene. Ohne Angabe gilt der Look des Plans. */
  look?: string;
  /** Übergang ZU dieser Szene (die vorige geht so hier rein). */
  uebergang?: string;
  uebergangDauer?: number;
  /** Orts- und Zeitkarte unten links. */
  titel?: string;
  unterzeile?: string;
};

export type Vlogplan = {
  breite: number;
  hoehe: number;
  fps: number;
  look?: string;
  akzentfarbe: string;
  /** Musikdatei in `public/`. Weglassen = keine Musik. */
  musik?: string;
  musikLautstaerke?: number;
  szenen: Szene[];
  grafiken?: Grafik[];
  klaenge?: KlangEinsatz[];
};

export const vlogplan = vlogDaten as unknown as Vlogplan;

/**
 * Gesamtlänge. Wichtig: Übergänge überlappen, sie fressen Zeit aus beiden
 * Nachbarszenen. Ohne diesen Abzug läuft das Video am Ende ins Leere.
 */
export const vlogLaenge = (plan: Vlogplan): number => {
  const szenen = plan.szenen.reduce((n, s) => n + Math.round(s.dauer * plan.fps), 0);
  const uebergaenge = plan.szenen
    .slice(1)
    .filter((s) => s.uebergang && s.uebergang !== 'hart')
    .reduce((n, s) => n + Math.round((s.uebergangDauer ?? 0.4) * plan.fps), 0);
  return Math.max(1, szenen - uebergaenge);
};
