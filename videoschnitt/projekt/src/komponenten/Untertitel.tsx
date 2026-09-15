import {AbsoluteFill, Sequence, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {TITELSCHRIFT} from '../schriften';
import type {Zeile} from '../untertitel';

/**
 * Untertitel im Kurzvideo-Stil: kurze Zeile unten im Bild, das gerade
 * gesprochene Wort farbig. Das haelt Zuschauer ohne Ton im Video.
 */
const ZeileAnzeigen: React.FC<{zeile: Zeile; akzentfarbe: string; abstandUnten: number}> = ({
  zeile,
  akzentfarbe,
  abstandUnten,
}) => {
  const frame = useCurrentFrame();
  const {fps, height} = useVideoConfig();
  // Alle Maße hängen an der Videohöhe, damit die Schrift bei einem kleinen
  // Hochkantvideo nicht das halbe Bild zudeckt.
  const s = height / 1920;
  const pop = spring({frame, fps, config: {damping: 14, stiffness: 220, mass: 0.5}});

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: abstandUnten * s,
        paddingLeft: 60 * s,
        paddingRight: 60 * s,
      }}
    >
      <div
        style={{
          transform: `scale(${0.9 + pop * 0.1})`,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: `0 ${16 * s}px`,
          fontFamily: TITELSCHRIFT,
          fontSize: 76 * s,
          lineHeight: 1.15,
          textTransform: 'uppercase',
          textAlign: 'center',
        }}
      >
        {zeile.woerter.map((w, i) => {
          const aktiv =
            frame + zeile.vonFrame >= w.vonFrame && frame + zeile.vonFrame < w.bisFrame;
          return (
            <span
              key={`${w.text}-${i}`}
              style={{
                color: aktiv ? akzentfarbe : '#ffffff',
                textShadow: `0 ${6 * s}px 0 rgba(0,0,0,0.85), 0 0 ${22 * s}px rgba(0,0,0,0.9)`,
                WebkitTextStroke: `${Math.max(2, 3 * s)}px rgba(0,0,0,0.9)`,
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
  abstandUnten?: number;
}> = ({zeilen, akzentfarbe, abstandUnten = 320}) => {
  return (
    <>
      {zeilen.map((zeile, i) => (
        <Sequence
          key={i}
          from={zeile.vonFrame}
          durationInFrames={Math.max(zeile.bisFrame - zeile.vonFrame, 6)}
        >
          <ZeileAnzeigen zeile={zeile} akzentfarbe={akzentfarbe} abstandUnten={abstandUnten} />
        </Sequence>
      ))}
    </>
  );
};
