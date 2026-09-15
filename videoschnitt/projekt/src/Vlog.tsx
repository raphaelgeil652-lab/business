import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useVideoConfig} from 'remotion';
import {
  TransitionSeries,
  linearTiming,
  springTiming,
  blurSlide,
  crossZoom,
  dreamyZoom,
  pushCut,
  type TransitionPresentation,
} from '@remotion/transitions';
import {clockWipe} from '@remotion/transitions/clock-wipe';
import {weissblitz, whip, zoomBlende} from './komponenten/uebergaenge';
import {fade} from '@remotion/transitions/fade';
import {slide} from '@remotion/transitions/slide';
import {wipe} from '@remotion/transitions/wipe';
import {Clip} from './komponenten/Clip';
import {Grafiken} from './komponenten/Grafiken';
import {Klangspur} from './komponenten/Klang';
import {Ortskarte} from './komponenten/Ortskarte';
import './schriften';
import type {Vlogplan} from './vlogplan';

/**
 * Vlog: mehrere Aufnahmen werden zu einer Sequenz montiert.
 *
 * Unterschied zum Kurzvideo: Dort schneiden wir EINE Aufnahme klein, hier
 * setzen wir VIELE Aufnahmen zusammen. Deshalb echte Übergänge statt harter
 * Schnitte — bei einem Ortswechsel trägt ein Übergang die Bewegung weiter,
 * bei einem Redeschnitt würde er nur stören.
 */
// Jeder Übergang bringt eigene Zusatzwerte mit; für die Liste ist das egal.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Praesentation = TransitionPresentation<any>;

/**
 * Die Übergänge, die zur Auswahl stehen.
 *
 * `blende`, `wisch`, `schieben`, `uhr` und `zugschnitt` rechnen im Browser und
 * laufen überall. `unschaerfe`, `zoom` und `traum` sind Shader-Übergänge —
 * die sehen besser aus, brauchen aber mehr Rechenzeit beim Rendern.
 */
const UEBERGANG: Record<string, (() => Praesentation) | null> = {
  // Laufen überall:
  hart: null,
  whip: () => whip() as Praesentation,
  zoom: () => zoomBlende() as Praesentation,
  weissblitz: () => weissblitz() as Praesentation,
  blende: () => fade() as Praesentation,
  wisch: () => wipe() as Praesentation,
  schieben: () => slide() as Praesentation,
  uhr: () => clockWipe({width: 1080, height: 1920}) as Praesentation,
  zugschnitt: () => pushCut() as Praesentation,

  // Shader-Übergänge von Remotion. Sehen noch besser aus, brauchen aber
  // „HTML in Canvas" (Chrome 148+ mit aktivierter Flagge). Wo das fehlt,
  // bricht das Rendern ab — deshalb nicht in der Standardauswahl.
  'shader-unschaerfe': () => blurSlide({direction: 'from-right', blur: 14}) as Praesentation,
  'shader-zoom': () => crossZoom({strength: 0.35}) as Praesentation,
  'shader-traum': () => dreamyZoom({scale: 1.2, rotation: 0.4}) as Praesentation,
};

export const UEBERGAENGE = Object.keys(UEBERGANG);

export const Vlog: React.FC<{plan: Vlogplan}> = ({plan}) => {
  const {fps, durationInFrames} = useVideoConfig();

  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <TransitionSeries>
        {plan.szenen.map((szene, i) => {
          const laenge = Math.round(szene.dauer * fps);
          const naechster = plan.szenen[i + 1];
          const art = naechster?.uebergang ?? 'hart';
          const bauer = UEBERGANG[art] ?? null;
          const dauer = Math.round((naechster?.uebergangDauer ?? 0.4) * fps);

          return [
            <TransitionSeries.Sequence key={`s${i}`} durationInFrames={laenge}>
              <Clip
                ausschnitt={{
                  von: szene.von,
                  bis: szene.von + szene.dauer,
                  zoom: szene.zoom ?? [1, 1.06],
                  rahmen: szene.rahmen,
                }}
                laengeInFrames={laenge}
                fps={fps}
                rohvideo={szene.datei}
                lookName={szene.look ?? plan.look}
              />
              {szene.titel ? (
                <Ortskarte text={szene.titel} unterzeile={szene.unterzeile} laenge={laenge} akzent={plan.akzentfarbe} />
              ) : null}
            </TransitionSeries.Sequence>,
            bauer && naechster ? (
              <TransitionSeries.Transition
                key={`t${i}`}
                presentation={bauer()}
                timing={
                  art === 'zoom' || art === 'shader-traum'
                    ? springTiming({config: {damping: 200}, durationInFrames: dauer})
                    : linearTiming({durationInFrames: dauer})
                }
              />
            ) : null,
          ];
        })}
      </TransitionSeries>

      {plan.grafiken ? (
        <Grafiken grafiken={plan.grafiken} fps={fps} akzent={plan.akzentfarbe} />
      ) : null}
      {plan.klaenge ? <Klangspur klaenge={plan.klaenge} fps={fps} /> : null}

      {plan.musik ? (
        <Sequence>
          <Audio
            src={staticFile(plan.musik)}
            // Musik kommt rein und geht am Ende wieder raus, damit sie nicht
            // abgeschnitten wirkt.
            volume={(f) =>
              interpolate(
                f,
                [0, fps, durationInFrames - fps * 1.5, durationInFrames],
                [0, plan.musikLautstaerke ?? 0.22, plan.musikLautstaerke ?? 0.22, 0],
                {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
              )
            }
          />
        </Sequence>
      ) : null}
    </AbsoluteFill>
  );
};
