import {AbsoluteFill, Sequence} from 'remotion';
import {Clip} from './komponenten/Clip';
import {Grafiken} from './komponenten/Grafiken';
import {Outro} from './komponenten/Outro';
import {HookText} from './komponenten/HookText';
import {Untertitel} from './komponenten/Untertitel';
import './schriften';
import {schnittLaenge, type Videoplan} from './schnitt';
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
      {plan.grafiken ? (
        <Grafiken grafiken={plan.grafiken} fps={plan.fps} akzent={plan.akzentfarbe} />
      ) : null}
      {plan.outro ? (
        <Sequence
          from={schnittLaenge(plan)}
          durationInFrames={Math.round(plan.outro.dauer * plan.fps)}
        >
          <Outro
            text={plan.outro.text}
            unterzeile={plan.outro.unterzeile}
            laenge={Math.round(plan.outro.dauer * plan.fps)}
            akzent={plan.akzentfarbe}
          />
        </Sequence>
      ) : null}
    </AbsoluteFill>
  );
};
