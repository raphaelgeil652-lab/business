import type {Ausschnitt} from './schnitt';

/** Ein Wort mit Zeitstempel, so wie Whisper es liefert. */
export type Wort = {
  text: string;
  startMs: number;
  endMs: number;
};

/** Ein Wort, umgerechnet auf die Zeitleiste des fertigen Videos. */
export type WortImSchnitt = {
  text: string;
  vonFrame: number;
  bisFrame: number;
};

/**
 * Rechnet die Wortzeiten aus dem Rohvideo auf das geschnittene Video um.
 *
 * Wichtig: Sobald etwas rausgeschnitten wird, stimmen die Originalzeiten nicht
 * mehr. Jedes Wort bekommt hier die Zeit, zu der es im fertigen Video faellt.
 * Woerter, die in einem rausgeschnittenen Stueck liegen, fallen weg.
 */
export const woerterAufSchnittLegen = (
  woerter: Wort[],
  ausschnitte: Ausschnitt[],
  fps: number,
): WortImSchnitt[] => {
  const ergebnis: WortImSchnitt[] = [];
  let versatzSek = 0; // wo dieser Ausschnitt im fertigen Video anfaengt

  for (const a of ausschnitte) {
    for (const w of woerter) {
      const startSek = w.startMs / 1000;
      const endeSek = w.endMs / 1000;
      // Wort zaehlt zu diesem Ausschnitt, wenn es darin anfaengt.
      if (startSek < a.von || startSek >= a.bis) {
        continue;
      }
      const text = w.text.trim();
      if (text === '') {
        continue;
      }
      const neuStart = versatzSek + (startSek - a.von);
      const neuEnde = versatzSek + (Math.min(endeSek, a.bis) - a.von);
      ergebnis.push({
        text,
        vonFrame: Math.round(neuStart * fps),
        bisFrame: Math.max(Math.round(neuEnde * fps), Math.round(neuStart * fps) + 1),
      });
    }
    versatzSek += a.bis - a.von;
  }

  return ergebnis;
};

/**
 * Fasst Woerter zu kurzen Zeilen zusammen (TikTok-Stil: 2–4 Woerter gleichzeitig,
 * das gerade gesprochene Wort wird hervorgehoben).
 */
export type Zeile = {
  woerter: WortImSchnitt[];
  vonFrame: number;
  bisFrame: number;
};

export const zeilenBauen = (
  woerter: WortImSchnitt[],
  maxWoerter = 3,
  maxZeichen = 22,
): Zeile[] => {
  const zeilen: Zeile[] = [];
  let aktuell: WortImSchnitt[] = [];

  const abschliessen = () => {
    if (aktuell.length === 0) {
      return;
    }
    zeilen.push({
      woerter: aktuell,
      vonFrame: aktuell[0].vonFrame,
      bisFrame: aktuell[aktuell.length - 1].bisFrame,
    });
    aktuell = [];
  };

  for (const w of woerter) {
    const zeichen = aktuell.reduce((n, x) => n + x.text.length + 1, 0) + w.text.length;
    const luecke =
      aktuell.length > 0 && w.vonFrame - aktuell[aktuell.length - 1].bisFrame > 12;
    if (aktuell.length >= maxWoerter || zeichen > maxZeichen || luecke) {
      abschliessen();
    }
    aktuell.push(w);
    // Satzende: Zeile hier trennen, das liest sich ruhiger.
    if (/[.!?]$/.test(w.text)) {
      abschliessen();
    }
  }
  abschliessen();

  return zeilen;
};
