import {useEffect, useState} from 'react';
import {AbsoluteFill, Sequence, continueRender, delayRender, staticFile} from 'remotion';
import {Clip} from './komponenten/Clip';
import {HookText} from './komponenten/HookText';
import {Untertitel} from './komponenten/Untertitel';
import './schriften';
import type {Videoplan} from './schnitt';
import {woerterAufSchnittLegen, zeilenBauen, type Wort} from './untertitel';

/**
 * Das geschnittene Kurzvideo: Ausschnitte hintereinander, Zoom pro Ausschnitt,
 * grosser Hook-Text und Wort-Untertitel.
 *
 * Die Untertitel kommen aus `public/untertitel.json`. Fehlt die Datei,
 * laeuft das Video ohne Untertitel durch — es bricht nichts ab.
 */
export const Kurzvideo: React.FC<{plan: Videoplan}> = ({plan}) => {
  const [woerter, setWoerter] = useState<Wort[]>([]);
  const [handle] = useState(() => delayRender('Untertitel laden'));

  useEffect(() => {
    if (!plan.untertitel) {
      continueRender(handle);
      return;
    }
    fetch(staticFile('untertitel.json'))
      .then((res) => (res.ok ? res.json() : []))
      .then((daten: Wort[]) => setWoerter(Array.isArray(daten) ? daten : []))
      .catch(() => setWoerter([]))
      .finally(() => continueRender(handle));
  }, [handle, plan.untertitel]);

  const zeilen = zeilenBauen(woerterAufSchnittLegen(woerter, plan.ausschnitte, plan.fps));

  let start = 0;

  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      {plan.ausschnitte.map((ausschnitt, i) => {
        const laenge = Math.round((ausschnitt.bis - ausschnitt.von) * plan.fps);
        const von = start;
        start += laenge;
        return (
          <Sequence key={i} from={von} durationInFrames={laenge}>
            <Clip
              ausschnitt={ausschnitt}
              laengeInFrames={laenge}
              fps={plan.fps}
              rohvideo={plan.rohvideo}
            />
            {ausschnitt.text ? (
              <HookText text={ausschnitt.text} laengeInFrames={laenge} />
            ) : null}
          </Sequence>
        );
      })}
      {plan.untertitel ? (
        <Untertitel zeilen={zeilen} akzentfarbe={plan.akzentfarbe} />
      ) : null}
    </AbsoluteFill>
  );
};
