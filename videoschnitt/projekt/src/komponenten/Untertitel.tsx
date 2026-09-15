import {AbsoluteFill, Sequence, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {TITELSCHRIFT} from '../schriften';
import {rahmen} from '../sicherheitszonen';
import type {Zeile} from '../untertitel';

/**
 * Untertitel im Kurzvideo-Stil: kurze Zeile, das gerade gesprochene Wort farbig.
 * Das hält Zuschauer ohne Ton im Video — der häufigste Fall beim Scrollen.
 *
 * Die Zeile sitzt im Sicherheitsrahmen (`src/sicherheitszonen.ts`), also über der
 * Bildunterschrift der App und links von den Knöpfen.
 *
 * Zahlen und Preise werden hervorgehoben. Begründung: Sie sind die Stelle, an der
 * ein Zuschauer hängen bleibt („299 €", „3 Fehler", „30 %"). Das ist eine
 * Entscheidung aus Erfahrung, kein Messergebnis — siehe forschung/virale-videos.md.
 */
const istZahl = (text: string) => /[0-9]|€|%/.test(text);

const ZeileAnzeigen: React.FC<{zeile: Zeile; akzentfarbe: string}> = ({zeile, akzentfarbe}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const r = rahmen(width, height);
  const pop = spring({frame, fps, config: {damping: 14, stiffness: 220, mass: 0.5}});

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: r.unten,
        paddingLeft: r.links,
        paddingRight: r.rechts,
      }}
    >
      <div
        style={{
          transform: `scale(${0.9 + pop * 0.1})`,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          gap: `${8 * r.s}px ${16 * r.s}px`,
          maxWidth: r.nutzbareBreite,
          fontFamily: TITELSCHRIFT,
          lineHeight: 1.15,
          textTransform: 'uppercase',
          textAlign: 'center',
        }}
      >
        {zeile.woerter.map((w, i) => {
          const aktiv =
            frame + zeile.vonFrame >= w.vonFrame && frame + zeile.vonFrame < w.bisFrame;
          const zahl = istZahl(w.text);
          return (
            <span
              key={`${w.text}-${i}`}
              style={{
                fontSize: (zahl ? 86 : 76) * r.s,
                color: zahl ? '#0b0f14' : aktiv ? akzentfarbe : '#ffffff',
                backgroundColor: zahl ? akzentfarbe : 'transparent',
                padding: zahl ? `${2 * r.s}px ${12 * r.s}px` : 0,
                textShadow: zahl
                  ? 'none'
                  : `0 ${6 * r.s}px 0 rgba(0,0,0,0.85), 0 0 ${22 * r.s}px rgba(0,0,0,0.9)`,
                WebkitTextStroke: zahl ? undefined : `${Math.max(2, 3 * r.s)}px rgba(0,0,0,0.9)`,
                paintOrder: 'stroke fill',
              }}
            >
              {w.text}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const Untertitel: React.FC<{
  zeilen: Zeile[];
  akzentfarbe: string;
  /** Zeitfenster in Frames, in denen keine Untertitel laufen (z. B. unter einem Stichwort). */
  pausen?: {von: number; bis: number}[];
}> = ({zeilen, akzentfarbe, pausen = []}) => {
  // Ein Stichwort sagt schon, was gesagt wird. Der Untertitel darunter waere
  // dasselbe Wort zweimal im Bild.
  const sichtbar = zeilen.filter(
    (z) => !pausen.some((p) => z.vonFrame < p.bis && z.bisFrame > p.von),
  );

  return (
    <>
      {sichtbar.map((zeile, i) => (
        <Sequence
          key={i}
          from={zeile.vonFrame}
          durationInFrames={Math.max(zeile.bisFrame - zeile.vonFrame, 6)}
        >
          <ZeileAnzeigen zeile={zeile} akzentfarbe={akzentfarbe} />
        </Sequence>
      ))}
    </>
  );
};
