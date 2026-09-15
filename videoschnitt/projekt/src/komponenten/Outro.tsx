import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {TEXTSCHRIFT, TITELSCHRIFT} from '../schriften';

/** Abspann-Karte: dunkle Fläche, Name, Unterzeile, Strich der aufzieht. */
export const Outro: React.FC<{
  text: string;
  unterzeile?: string;
  laenge: number;
  akzent: string;
}> = ({text, unterzeile, laenge, akzent}) => {
  const frame = useCurrentFrame();
  const {fps, height} = useVideoConfig();
  const s = height / 1920;
  const auf = interpolate(frame, [0, 6], [0, 1], {extrapolateRight: 'clamp'});
  const rein = spring({frame: frame - 3, fps, config: {damping: 18, stiffness: 140}});
  const strich = interpolate(frame, [6, laenge * 0.7], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0b0f14',
        opacity: auf,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div style={{textAlign: 'center', transform: `translateY(${interpolate(rein, [0, 1], [30 * s, 0])}px)`}}>
        <div
          style={{
            fontFamily: TITELSCHRIFT,
            fontSize: 96 * s,
            color: '#fff',
            textTransform: 'uppercase',
            letterSpacing: -1 * s,
          }}
        >
          {text}
        </div>
        <div
          style={{
            height: 8 * s,
            width: `${strich * 100}%`,
            backgroundColor: akzent,
            margin: `${26 * s}px auto 0`,
          }}
        />
        {unterzeile ? (
          <div
            style={{
              marginTop: 26 * s,
              fontFamily: TEXTSCHRIFT,
              fontSize: 38 * s,
              color: 'rgba(255,255,255,0.66)',
            }}
          >
            {unterzeile}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};
