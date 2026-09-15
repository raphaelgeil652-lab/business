import {Composition} from 'remotion';
import {Kurzvideo} from './Kurzvideo';
import {laengeInFrames, videoplan} from './schnitt';
import {Werbeclip, werbeclipStandard} from './Werbeclip';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Geschnittenes Kurzvideo aus einem Rohvideo in public/. */}
      <Composition
        id="Kurzvideo"
        component={Kurzvideo}
        durationInFrames={laengeInFrames(videoplan)}
        fps={videoplan.fps}
        width={videoplan.breite}
        height={videoplan.hoehe}
        defaultProps={{plan: videoplan}}
      />

      {/* Werbeclip fuer Meta/Google — braucht kein Rohmaterial. */}
      <Composition
        id="Werbeclip"
        component={Werbeclip}
        durationInFrames={15 * 30}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={werbeclipStandard}
      />
    </>
  );
};
