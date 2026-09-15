import {Composition} from 'remotion';
import {Kurzvideo} from './Kurzvideo';
import {laengeInFrames, videoplan, woerter} from './schnitt';
import {Werbeclip, werbeclipStandard} from './Werbeclip';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Das geschnittene Kurzvideo. Maße, Länge und Schnitt kommen aus
          src/daten/schnittplan.json — geschrieben vom Werkzeug. */}
      <Composition
        id="Kurzvideo"
        component={Kurzvideo}
        durationInFrames={laengeInFrames(videoplan)}
        fps={videoplan.fps}
        width={videoplan.breite}
        height={videoplan.hoehe}
        defaultProps={{plan: videoplan, woerter}}
      />

      {/* Werbeclip für Meta/Google — braucht kein Rohmaterial. */}
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
