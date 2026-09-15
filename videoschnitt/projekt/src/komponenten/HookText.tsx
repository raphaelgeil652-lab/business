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
  const {fps} = useVideoConfig();

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
        paddingTop: 220,
        paddingLeft: 70,
        paddingRight: 70,
        opacity: raus,
      }}
    >
      <div
        style={{
          transform: `translateY(${interpolate(rein, [0, 1], [-40, 0])}px)`,
          backgroundColor: '#ffffff',
          color: '#0b0b0b',
          fontFamily: TITELSCHRIFT,
          fontSize: 64,
          lineHeight: 1.1,
          textAlign: 'center',
          textTransform: 'uppercase',
          padding: '18px 28px',
          borderRadius: 14,
          boxShadow: '0 18px 50px rgba(0,0,0,0.45)',
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};
