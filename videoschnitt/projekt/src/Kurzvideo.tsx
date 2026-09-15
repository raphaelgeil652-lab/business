import {AbsoluteFill, Sequence} from 'remotion';
import {Clip} from './komponenten/Clip';
import {HookText} from './komponenten/HookText';
import {Untertitel} from './komponenten/Untertitel';
import './schriften';
import type {Videoplan} from './schnitt';
import {woerterAufSchnittLegen, zeilenBauen, type Wort} from './untertitel';

/**
 * Das geschnittene Kurzvideo.
 *
 * Ausschnitte laufen hintereinander, jeder mit seinem Zoom. Darüber liegen
 * der Hook-Text und die Wort-Untertitel. Beides kommt aus den Dateien in
 * `src/daten/` — fehlen die Untertitel, läuft das Video einfach ohne.
 */
export const Kurzvideo: React.FC<{plan: Videoplan; woerter: Wort[]}> = ({plan, woerter}) => {
  const zeilen = plan.untertitel
    ? zeilenBauen(woerterAufSchnittLegen(woerter, plan.ausschnitte, plan.fps))
    : [];

  let start = 0;

  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      {plan.ausschnitte.map((ausschnitt, i) => {
        const laenge = Math.round((ausschnitt.bis - ausschnitt.von) * plan.fps);
        const von = start;
        start += laenge;
        // Der Hook steht über dem ersten Ausschnitt, wenn dort kein eigener Text steht.
        const text = ausschnitt.text ?? (i === 0 ? plan.hook : undefined);
        return (
          <Sequence key={i} from={von} durationInFrames={laenge}>
            <Clip
              ausschnitt={ausschnitt}
              laengeInFrames={laenge}
              fps={plan.fps}
              rohvideo={plan.rohvideo}
            />
            {text ? <HookText text={text} laengeInFrames={laenge} /> : null}
          </Sequence>
        );
      })}
      {plan.untertitel ? (
        <Untertitel zeilen={zeilen} akzentfarbe={plan.akzentfarbe} />
      ) : null}
    </AbsoluteFill>
  );
};
