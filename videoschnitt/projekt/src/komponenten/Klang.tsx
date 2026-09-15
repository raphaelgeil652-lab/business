import {Audio, Sequence, staticFile} from 'remotion';

/**
 * Die Tonebene.
 *
 * Soundeffekte sind der Unterschied zwischen „Schnitt" und „gemachtem Schnitt".
 * Ein Schnitt ohne Geräusch wirkt wie ein Aussetzer, ein Schnitt mit Whoosh
 * wirkt gewollt. Die Dateien liegen in `public/klang/` und sind selbst gebaut
 * (`werkzeuge/klaenge-bauen.py`) — keine Stock-Bibliothek, keine Lizenzfrage.
 */
export const KLAENGE = {
  whoosh: {datei: 'klang/whoosh.wav', standard: 0.5},
  'whoosh-lang': {datei: 'klang/whoosh-lang.wav', standard: 0.45},
  impact: {datei: 'klang/impact.wav', standard: 0.55},
  pop: {datei: 'klang/pop.wav', standard: 0.4},
  klick: {datei: 'klang/klick.wav', standard: 0.35},
  riser: {datei: 'klang/riser.wav', standard: 0.4},
  bass: {datei: 'klang/bass.wav', standard: 0.5},
} as const;

export type KlangName = keyof typeof KLAENGE;

export type KlangEinsatz = {
  art: string;
  /** Sekunde im fertigen Video. */
  von: number;
  /** 0 bis 1. Ohne Angabe gilt der Standardwert des Klangs. */
  lautstaerke?: number;
};

export const Klangspur: React.FC<{klaenge: KlangEinsatz[]; fps: number}> = ({klaenge, fps}) => {
  return (
    <>
      {klaenge.map((k, i) => {
        const eintrag = KLAENGE[k.art as KlangName];
        if (!eintrag) {
          return null;
        }
        return (
          <Sequence key={i} from={Math.round(k.von * fps)}>
            <Audio src={staticFile(eintrag.datei)} volume={k.lautstaerke ?? eintrag.standard} />
          </Sequence>
        );
      })}
    </>
  );
};
