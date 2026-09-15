/**
 * Der Schnittplan.
 *
 * Diese Datei liest nur — geschrieben wird der Plan von
 * `werkzeuge/schnittplan.mjs` nach `src/daten/schnittplan.json`.
 *
 * Du kannst `src/daten/schnittplan.json` jederzeit von Hand nachbessern:
 * einen Ausschnitt rauswerfen, eine Sekunde verschieben, einen Zoom ändern.
 * Der nächste Lauf des Werkzeugs überschreibt die Datei aber wieder.
 */
import type {Grafik} from './komponenten/Grafiken';
import planDaten from './daten/schnittplan.json';
import wortDaten from './daten/untertitel.json';
import type {Wort} from './untertitel';

export type Ausschnitt = {
  /** Sekunde im Rohvideo, ab der dieser Ausschnitt gezeigt wird. */
  von: number;
  /** Sekunde im Rohvideo, bis zu der dieser Ausschnitt gezeigt wird. */
  bis: number;
  /**
   * Zoom am Anfang und am Ende des Ausschnitts. 1 = Originalgröße.
   * [1, 1.15] fährt langsam ran, [1.2, 1] fährt langsam raus.
   */
  zoom?: [number, number];
  /** Großer Text oben im Bild für diesen Ausschnitt. Optional. */
  text?: string;
  /**
   * Bildausschnitt: weit · nah · nah-links · nah-rechts · kopf.
   * Der Wechsel zwischen weit und nah lässt einen Schnitt wie eine zweite
   * Kamera aussehen. Ohne ihn wirkt jeder Schnitt wie ein Bildsprung.
   */
  rahmen?: 'weit' | 'nah' | 'nah-links' | 'nah-rechts' | 'kopf';
};

export type Videoplan = {
  /** Dateiname des Rohvideos in `public/`. */
  rohvideo: string;
  breite: number;
  hoehe: number;
  fps: number;
  ausschnitte: Ausschnitt[];
  /** Wort-Untertitel einblenden? */
  untertitel: boolean;
  /** Farbe, in der das gerade gesprochene Wort hervorgehoben wird. */
  akzentfarbe: string;
  /** Farblook, siehe src/looks.ts: natuerlich · hart · kino · warm · kalt · vintage · nacht · schwarzweiss */
  look?: string;
  /** Sekunden im fertigen Video, an denen ein Bildstoß sitzt (betonte Wörter). */
  punches?: number[];
  /** Soundeffekte, Zeiten im fertigen Video. */
  klaenge?: {art: string; von: number; lautstaerke?: number}[];
  /** Großer Text über dem ersten Ausschnitt. Leer = kein Hook. */
  hook?: string;
  /** Motion Graphics. Zeiten zählen im fertigen Video, nicht im Rohvideo. */
  grafiken?: Grafik[];
  /** Abspann-Karte am Ende. Weglassen = kein Abspann. */
  outro?: {dauer: number; text: string; unterzeile?: string};
  /**
   * Schleifen-Ende: hängt den Anfang des ersten Ausschnitts hinten an, damit der
   * Neustart nicht auffällt. Schlägt den Abspann — beides zusammen geht nicht,
   * ein Abspann zerstört die Schleife. Siehe forschung/virale-videos.md, Punkt 6.
   */
  schleife?: {dauer: number};
};

export const videoplan: Videoplan = {
  ...(planDaten as unknown as Videoplan),
  ausschnitte: (planDaten.ausschnitte as unknown as Ausschnitt[]).map((a) => ({
    ...a,
    zoom: a.zoom ? ([a.zoom[0], a.zoom[1]] as [number, number]) : undefined,
  })),
};

export const woerter: Wort[] = wortDaten as Wort[];

/** Länge der Ausschnitte in Frames, ohne Abspann. */
export const schnittLaenge = (plan: Videoplan): number =>
  Math.max(
    1,
    Math.round(plan.ausschnitte.reduce((summe, a) => summe + (a.bis - a.von), 0) * plan.fps),
  );

/** Was hinten drankommt: Schleife schlägt Abspann. */
export const anhangDauer = (plan: Videoplan): number =>
  plan.schleife ? plan.schleife.dauer : (plan.outro?.dauer ?? 0);

/** Gesamtlänge des fertigen Videos in Frames, mit Anhang. */
export const laengeInFrames = (plan: Videoplan): number =>
  schnittLaenge(plan) + Math.round(anhangDauer(plan) * plan.fps);
