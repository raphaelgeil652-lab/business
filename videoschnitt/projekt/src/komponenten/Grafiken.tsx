import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {TEXTSCHRIFT, TITELSCHRIFT} from '../schriften';

/**
 * Die Motion-Graphics-Bausteine.
 *
 * Alle Zeiten (`von`, `bis`) zählen im **fertigen** Video, nicht im Rohvideo.
 * Eingetragen werden sie in `src/daten/schnittplan.json` unter „grafiken".
 *
 * Alle Maße hängen an der Videohöhe, damit dasselbe Element auf einem großen
 * und einem kleinen Hochkantvideo gleich aussieht.
 */
export type Grafik =
  | {art: 'titelband'; von: number; bis: number; text: string; unterzeile?: string}
  | {art: 'namensschild'; von: number; bis: number; text: string; unterzeile?: string}
  | {art: 'stichwort'; von: number; bis: number; text: string}
  | {art: 'blitz'; von: number; bis: number}
  | {art: 'fortschritt'; von: number; bis: number};

/** Band oben im Bild — für den Hook oder das Thema. */
const Titelband: React.FC<{text: string; unterzeile?: string; laenge: number; akzent: string}> = ({
  text,
  unterzeile,
  laenge,
  akzent,
}) => {
  const frame = useCurrentFrame();
  const {fps, height} = useVideoConfig();
  const s = height / 1920;
  const rein = spring({frame, fps, config: {damping: 18, stiffness: 150}});
  const raus = interpolate(frame, [laenge - 7, laenge], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{justifyContent: 'flex-start', paddingTop: 190 * s, opacity: raus}}>
      <div
        style={{
          transform: `translateX(${interpolate(rein, [0, 1], [-120 * s, 0])}px)`,
          display: 'flex',
          alignItems: 'stretch',
        }}
      >
        <div style={{width: 16 * s, backgroundColor: akzent}} />
        <div
          style={{
            backgroundColor: 'rgba(8,10,14,0.92)',
            padding: `${20 * s}px ${34 * s}px`,
            maxWidth: '86%',
          }}
        >
          <div
            style={{
              fontFamily: TITELSCHRIFT,
              fontSize: 58 * s,
              lineHeight: 1.08,
              color: '#fff',
              textTransform: 'uppercase',
            }}
          >
            {text}
          </div>
          {unterzeile ? (
            <div
              style={{
                marginTop: 10 * s,
                fontFamily: TEXTSCHRIFT,
                fontSize: 34 * s,
                color: akzent,
              }}
            >
              {unterzeile}
            </div>
          ) : null}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Namensschild, das von links reinfährt — klassischer Lower Third. */
const Namensschild: React.FC<{
  text: string;
  unterzeile?: string;
  laenge: number;
  akzent: string;
}> = ({text, unterzeile, laenge, akzent}) => {
  const frame = useCurrentFrame();
  const {fps, height} = useVideoConfig();
  const s = height / 1920;
  const rein = spring({frame, fps, config: {damping: 20, stiffness: 130}});
  const raus = spring({
    frame: frame - (laenge - 12),
    fps,
    config: {damping: 20, stiffness: 130},
  });
  const x = interpolate(rein, [0, 1], [-1.1, 0]) + interpolate(raus, [0, 1], [0, -1.1]);

  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', paddingBottom: 620 * s}}>
      <div
        style={{
          transform: `translateX(${x * 100}%)`,
          alignSelf: 'flex-start',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#fff',
          padding: `${16 * s}px ${30 * s}px ${16 * s}px ${22 * s}px`,
          borderRadius: `0 ${14 * s}px ${14 * s}px 0`,
        }}
      >
        <div
          style={{
            width: 10 * s,
            alignSelf: 'stretch',
            backgroundColor: akzent,
            marginRight: 22 * s,
          }}
        />
        <div>
          <div style={{fontFamily: TITELSCHRIFT, fontSize: 50 * s, color: '#0b0f14'}}>{text}</div>
          {unterzeile ? (
            <div
              style={{
                fontFamily: TEXTSCHRIFT,
                fontSize: 30 * s,
                color: 'rgba(11,15,20,0.62)',
                marginTop: 4 * s,
              }}
            >
              {unterzeile}
            </div>
          ) : null}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Ein einzelnes Wort, das kurz groß ins Bild knallt. */
const Stichwort: React.FC<{text: string; laenge: number; akzent: string}> = ({
  text,
  laenge,
  akzent,
}) => {
  const frame = useCurrentFrame();
  const {fps, height} = useVideoConfig();
  const s = height / 1920;
  const pop = spring({frame, fps, config: {damping: 9, stiffness: 260, mass: 0.6}});
  const raus = interpolate(frame, [laenge - 6, laenge], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const kippen = interpolate(pop, [0, 1], [-8, -3]);

  return (
    // Bewusst nicht in der Bildmitte: Bei einem Selfie liegen dort die Augen.
    // Das Stichwort sitzt darunter, über den Untertiteln.
    <AbsoluteFill
      style={{
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 560 * s,
        opacity: raus,
      }}
    >
      <div
        style={{
          transform: `scale(${0.6 + pop * 0.4}) rotate(${kippen}deg)`,
          backgroundColor: akzent,
          color: '#0b0f14',
          fontFamily: TITELSCHRIFT,
          fontSize: 92 * s,
          padding: `${14 * s}px ${30 * s}px`,
          textTransform: 'uppercase',
          boxShadow: `0 ${20 * s}px ${60 * s}px rgba(0,0,0,0.5)`,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};

/** Kurzer heller Wisch — setzt einen Akzent auf einen Schnitt. */
const Blitz: React.FC<{laenge: number; akzent: string}> = ({laenge, akzent}) => {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [0, laenge], [-1, 1], {extrapolateRight: 'clamp'});
  const staerke = interpolate(frame, [0, laenge * 0.4, laenge], [0, 0.55, 0]);

  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `translateX(${x * 130}%) skewX(-14deg)`,
          background: `linear-gradient(90deg, transparent, ${akzent}, transparent)`,
          opacity: staerke,
        }}
      />
    </AbsoluteFill>
  );
};

/** Dünner Balken ganz unten, der mitläuft. */
const Fortschritt: React.FC<{laenge: number; akzent: string}> = ({laenge, akzent}) => {
  const frame = useCurrentFrame();
  const {height} = useVideoConfig();
  const s = height / 1920;
  return (
    <AbsoluteFill style={{justifyContent: 'flex-end'}}>
      <div style={{height: 10 * s, backgroundColor: 'rgba(255,255,255,0.14)'}}>
        <div
          style={{
            height: '100%',
            width: `${interpolate(frame, [0, laenge], [0, 100], {extrapolateRight: 'clamp'})}%`,
            backgroundColor: akzent,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

export const Grafiken: React.FC<{grafiken: Grafik[]; fps: number; akzent: string}> = ({
  grafiken,
  fps,
  akzent,
}) => {
  return (
    <>
      {grafiken.map((g, i) => {
        const von = Math.round(g.von * fps);
        const laenge = Math.max(2, Math.round((g.bis - g.von) * fps));
        return (
          <Sequence key={i} from={von} durationInFrames={laenge}>
            {g.art === 'titelband' ? (
              <Titelband text={g.text} unterzeile={g.unterzeile} laenge={laenge} akzent={akzent} />
            ) : null}
            {g.art === 'namensschild' ? (
              <Namensschild
                text={g.text}
                unterzeile={g.unterzeile}
                laenge={laenge}
                akzent={akzent}
              />
            ) : null}
            {g.art === 'stichwort' ? (
              <Stichwort text={g.text} laenge={laenge} akzent={akzent} />
            ) : null}
            {g.art === 'blitz' ? <Blitz laenge={laenge} akzent={akzent} /> : null}
            {g.art === 'fortschritt' ? <Fortschritt laenge={laenge} akzent={akzent} /> : null}
          </Sequence>
        );
      })}
    </>
  );
};
