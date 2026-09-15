import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {TITELSCHRIFT} from '../schriften';

/**
 * Der grosse Text oben im Bild — der Hook. Faehrt rein, bleibt stehen,
 * blendet am Ende des Ausschnitts wieder weg.
 */
export const HookText: React.FC<{text: string; laengeInFrames: number}> = ({
  text,
  laengeInFrames,
}) => {
  const frame = useCurrentFrame();
  const {fps, height} = useVideoConfig();
  const s = height / 1920;

  const rein = spring({frame, fps, config: {damping: 16, stiffness: 180}});
  const raus = interpolate(frame, [laengeInFrames - 8, laengeInFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 200 * s,
        paddingLeft: 70 * s,
        paddingRight: 70 * s,
        opacity: raus,
      }}
    >
      <div
        style={{
          transform: `translateY(${interpolate(rein, [0, 1], [-40 * s, 0])}px)`,
          backgroundColor: '#ffffff',
          color: '#0b0b0b',
          fontFamily: TITELSCHRIFT,
          fontSize: 60 * s,
          lineHeight: 1.1,
          textAlign: 'center',
          textTransform: 'uppercase',
          padding: `${18 * s}px ${28 * s}px`,
          borderRadius: 14 * s,
          boxShadow: `0 ${18 * s}px ${50 * s}px rgba(0,0,0,0.45)`,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};
