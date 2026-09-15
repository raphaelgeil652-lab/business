import {AbsoluteFill, Sequence} from 'remotion';
import {Clip} from './komponenten/Clip';
import {Grafiken} from './komponenten/Grafiken';
import {Klangspur} from './komponenten/Klang';
import {Outro} from './komponenten/Outro';
import {Rahmenpruefung} from './komponenten/Rahmenpruefung';
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
export const Kurzvideo: React.FC<{
  plan: Videoplan;
  woerter: Wort[];
  /** Blendet die sicheren Zonen ein. Beim Rendern mit RAHMEN=1 einschalten. */
  rahmenPruefen?: boolean;
}> = ({plan, woerter, rahmenPruefen}) => {
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
              lookName={plan.look}
              punches={(plan.punches ?? [])
                .filter((p) => p >= von / plan.fps && p < (von + laenge) / plan.fps)
                .map((p) => p - von / plan.fps)}
            />
            {text ? <HookText text={text} laengeInFrames={laenge} /> : null}
          </Sequence>
        );
      })}
      {plan.untertitel ? (
        <Untertitel
          zeilen={zeilen}
          akzentfarbe={plan.akzentfarbe}
          pausen={(plan.grafiken ?? [])
            .filter((g) => g.art === 'stichwort')
            .map((g) => ({
              von: Math.round(g.von * plan.fps),
              bis: Math.round(g.bis * plan.fps),
            }))}
        />
      ) : null}
      {plan.grafiken ? (
        <Grafiken grafiken={plan.grafiken} fps={plan.fps} akzent={plan.akzentfarbe} />
      ) : null}
      {plan.schleife && plan.ausschnitte.length > 0 ? (
        // Schleifen-Ende: der Anfang nochmal, damit der Neustart weich wirkt.
        <Sequence
          from={schnittLaenge(plan)}
          durationInFrames={Math.round(plan.schleife.dauer * plan.fps)}
        >
          <Clip
            ausschnitt={{
              von: plan.ausschnitte[0].von,
              bis: plan.ausschnitte[0].von + plan.schleife.dauer,
              zoom: plan.ausschnitte[0].zoom,
              rahmen: plan.ausschnitte[0].rahmen,
            }}
            laengeInFrames={Math.round(plan.schleife.dauer * plan.fps)}
            fps={plan.fps}
            rohvideo={plan.rohvideo}
            lookName={plan.look}
          />
        </Sequence>
      ) : null}
      {plan.outro && !plan.schleife ? (
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
      {plan.klaenge ? <Klangspur klaenge={plan.klaenge} fps={plan.fps} /> : null}
      {rahmenPruefen ? <Rahmenpruefung /> : null}
    </AbsoluteFill>
  );
};
