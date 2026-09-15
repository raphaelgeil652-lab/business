import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {TEXTSCHRIFT, TITELSCHRIFT} from '../schriften';
import {rahmen} from '../sicherheitszonen';

/**
 * Orts- und Zeitkarte für Vlogs: „Pfullendorf · 7:40".
 * Steht unten links, fährt kurz rein und wieder raus — wie im Reisefilm.
 */
export const Ortskarte: React.FC<{
  text: string;
  unterzeile?: string;
  laenge: number;
  akzent: string;
}> = ({text, unterzeile, laenge, akzent}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const r = rahmen(width, height);
  const s = r.s;

  const rein = spring({frame, fps, config: {damping: 22, stiffness: 160}});
  const raus = interpolate(frame, [laenge - 14, laenge - 6], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const breite = interpolate(rein, [0, 1], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
        paddingBottom: r.unten + 60 * s,
        paddingLeft: r.links,
        opacity: raus,
      }}
    >
      <div style={{display: 'flex', alignItems: 'center', gap: 16 * s}}>
        <div style={{width: 6 * s, height: 62 * s, backgroundColor: akzent, transform: `scaleY(${rein})`}} />
        <div style={{overflow: 'hidden'}}>
          <div
            style={{
              fontFamily: TITELSCHRIFT,
              fontSize: 46 * s,
              color: '#fff',
              textShadow: `0 ${4 * s}px ${18 * s}px rgba(0,0,0,0.8)`,
              transform: `translateX(${interpolate(breite, [0, 1], [-40 * s, 0])}px)`,
            }}
          >
            {text}
          </div>
          {unterzeile ? (
            <div
              style={{
                fontFamily: TEXTSCHRIFT,
                fontSize: 28 * s,
                color: 'rgba(255,255,255,0.8)',
                textShadow: `0 ${3 * s}px ${14 * s}px rgba(0,0,0,0.8)`,
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
