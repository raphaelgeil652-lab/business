import {AbsoluteFill, OffthreadVideo, interpolate, staticFile, useCurrentFrame} from 'remotion';
import type {Ausschnitt} from '../schnitt';

/**
 * Ein Ausschnitt aus dem Rohvideo, mit langsamem Zoom.
 * Der Zoom ist das, was ein statisches Talking-Head-Video lebendig macht.
 */
export const Clip: React.FC<{
  ausschnitt: Ausschnitt;
  laengeInFrames: number;
  fps: number;
  rohvideo: string;
}> = ({ausschnitt, laengeInFrames, fps, rohvideo}) => {
  const frame = useCurrentFrame();
  const [von, bis] = ausschnitt.zoom ?? [1, 1];
  const scale = interpolate(frame, [0, laengeInFrames], [von, bis], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{overflow: 'hidden', backgroundColor: '#000'}}>
      <OffthreadVideo
        src={staticFile(rohvideo)}
        trimBefore={Math.round(ausschnitt.von * fps)}
        trimAfter={Math.round(ausschnitt.bis * fps)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${scale})`,
        }}
      />
    </AbsoluteFill>
  );
};
