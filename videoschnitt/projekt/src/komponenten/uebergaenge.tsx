import type {TransitionPresentation, TransitionPresentationComponentProps} from '@remotion/transitions';
import {AbsoluteFill, interpolate} from 'remotion';

/**
 * Eigene Übergänge.
 *
 * Warum selbst gebaut: Remotion bringt sehr schöne Shader-Übergänge mit
 * (crossZoom, dreamyZoom, blurSlide), die brauchen aber „HTML in Canvas" —
 * eine Chrome-Funktion, die nicht überall an ist. Diese hier laufen mit
 * normalem CSS und damit auf jedem Rechner.
 */

type Leer = Record<string, never>;

/**
 * Whip-Pan: Das Bild wird zur Seite gerissen und dabei unscharf.
 * Der Standardübergang im Vlog — er trägt Bewegung von einer Aufnahme in die
 * nächste, statt sie nur auszutauschen.
 */
const WhipKomponente: React.FC<TransitionPresentationComponentProps<Leer>> = ({
  children,
  presentationProgress,
  presentationDirection,
}) => {
  const rein = presentationDirection === 'entering';
  const p = presentationProgress;
  const x = rein ? interpolate(p, [0, 1], [110, 0]) : interpolate(p, [0, 1], [0, -110]);
  // Unschärfe in der Mitte am stärksten — wie echte Bewegungsunschärfe.
  const unschaerfe = Math.sin(p * Math.PI) * 22;

  return (
    <AbsoluteFill
      style={{
        transform: `translateX(${x}%)`,
        filter: `blur(${unschaerfe}px)`,
        backgroundColor: '#000',
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const whip = (): TransitionPresentation<Leer> => ({
  component: WhipKomponente,
  props: {},
});

/**
 * Zoom-Blende: Die alte Aufnahme fährt weg, die neue kommt von vorn.
 * Für Ortswechsel, wo ein Whip zu hektisch wäre.
 */
const ZoomKomponente: React.FC<TransitionPresentationComponentProps<Leer>> = ({
  children,
  presentationProgress,
  presentationDirection,
}) => {
  const rein = presentationDirection === 'entering';
  const p = presentationProgress;
  const scale = rein ? interpolate(p, [0, 1], [1.35, 1]) : interpolate(p, [0, 1], [1, 0.82]);
  const deckkraft = rein ? interpolate(p, [0, 0.55], [0, 1], {extrapolateRight: 'clamp'}) : interpolate(p, [0.45, 1], [1, 0], {extrapolateLeft: 'clamp'});

  return (
    <AbsoluteFill style={{transform: `scale(${scale})`, opacity: deckkraft, backgroundColor: '#000'}}>
      {children}
    </AbsoluteFill>
  );
};

export const zoomBlende = (): TransitionPresentation<Leer> => ({
  component: ZoomKomponente,
  props: {},
});

/**
 * Weißblitz: kurz überstrahlen, dann die neue Aufnahme.
 * Sparsam einsetzen — einmal pro Video reicht.
 */
const BlitzKomponente: React.FC<TransitionPresentationComponentProps<Leer>> = ({
  children,
  presentationProgress,
  presentationDirection,
}) => {
  const p = presentationProgress;
  const rein = presentationDirection === 'entering';
  const weiss = Math.sin(p * Math.PI) * (rein ? 0.9 : 0.9);

  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <AbsoluteFill style={{opacity: rein ? interpolate(p, [0.4, 0.75], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 1}}>
        {children}
      </AbsoluteFill>
      <AbsoluteFill style={{backgroundColor: '#fff', opacity: weiss}} />
    </AbsoluteFill>
  );
};

export const weissblitz = (): TransitionPresentation<Leer> => ({
  component: BlitzKomponente,
  props: {},
});
