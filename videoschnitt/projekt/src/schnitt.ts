/**
 * DAS IST DIE EINE DATEI, DIE SICH PRO VIDEO AENDERT.
 *
 * Hier steht, was aus dem Rohvideo wird: welche Stellen drinbleiben,
 * wo reingezoomt wird und welcher grosse Text eingeblendet wird.
 * Alles andere im Projekt bleibt gleich — genau wie bei der Landingpage:
 * ein Geruest, nur der Inhalt wird getauscht.
 */

export type Ausschnitt = {
  /** Sekunde im Rohvideo, ab der dieser Ausschnitt gezeigt wird. */
  von: number;
  /** Sekunde im Rohvideo, bis zu der dieser Ausschnitt gezeigt wird. */
  bis: number;
  /**
   * Zoom am Anfang und am Ende des Ausschnitts. 1 = Originalgroesse.
   * [1, 1.15] faehrt langsam rein, [1.2, 1] faehrt langsam raus.
   * Weglassen = kein Zoom.
   */
  zoom?: [number, number];
  /** Grosser Text oben im Bild, z. B. der Hook oder ein Kapitel. Optional. */
  text?: string;
};

export type Videoplan = {
  /** Dateiname des Rohvideos in `public/`. */
  rohvideo: string;
  breite: number;
  hoehe: number;
  fps: number;
  /** Die Ausschnitte in der Reihenfolge, in der sie im fertigen Video laufen. */
  ausschnitte: Ausschnitt[];
  /** Wort-Untertitel automatisch aus `public/untertitel.json` einblenden? */
  untertitel: boolean;
  /** Farbe, in der das gerade gesprochene Wort hervorgehoben wird. */
  akzentfarbe: string;
};

export const videoplan: Videoplan = {
  rohvideo: 'roh.mp4',
  breite: 1080,
  hoehe: 1920,
  fps: 30,
  untertitel: true,
  akzentfarbe: '#ffd60a',
  ausschnitte: [
    // Beispielplan. Wird pro Video ersetzt, sobald das Rohmaterial da ist.
    {von: 0.0, bis: 3.5, zoom: [1.0, 1.12], text: 'Beispiel-Hook'},
    {von: 5.0, bis: 9.0, zoom: [1.2, 1.02]},
    {von: 12.0, bis: 16.0, zoom: [1.0, 1.1]},
  ],
};

/** Gesamtlaenge des fertigen Videos in Frames. */
export const laengeInFrames = (plan: Videoplan): number =>
  Math.max(
    1,
    Math.round(
      plan.ausschnitte.reduce((summe, a) => summe + (a.bis - a.von), 0) * plan.fps,
    ),
  );
