import {
  AbsoluteFill,
  OffthreadVideo,
  interpolate,
  random,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {look} from '../looks';
import type {Ausschnitt} from '../schnitt';

/**
 * Ein Ausschnitt aus dem Rohvideo.
 *
 * Drei Dinge passieren hier, und alle drei haben einen Grund:
 *
 * 1. **Zoom** — langsames Ranfahren hält ein statisches Bild lebendig.
 * 2. **Bildausschnitt** (`rahmen`) — „nah" zoomt stärker und schiebt das Bild
 *    zur Seite. Auf einer einzigen Kameraeinstellung sieht das aus wie eine
 *    zweite Kamera. Das ist der Trick, der Schnitte absichtlich wirken lässt
 *    statt nach Bildsprung.
 * 3. **Punch** — ein kurzer Stoß auf ein betontes Wort. Dauert 7 Bilder.
 */
const RAHMEN = {
  weit: {zoom: 1.0, x: 0, y: 0},
  nah: {zoom: 1.28, x: 0, y: -0.04},
  'nah-links': {zoom: 1.3, x: 0.07, y: -0.03},
  'nah-rechts': {zoom: 1.3, x: -0.07, y: -0.03},
  kopf: {zoom: 1.55, x: 0, y: -0.09},
} as const;

export type RahmenName = keyof typeof RAHMEN;

const Koernung: React.FC<{staerke: number}> = ({staerke}) => {
  const frame = useCurrentFrame();
  // Neuer Zufallswert pro Bild, sonst steht die Körnung still und wirkt wie Schmutz.
  const seed = Math.floor(random(`korn-${frame}`) * 9999);
  return (
    <AbsoluteFill style={{opacity: staerke, mixBlendMode: 'overlay', pointerEvents: 'none'}}>
      <svg width="100%" height="100%">
        <filter id={`korn-${frame}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={seed} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#korn-${frame})`} />
      </svg>
    </AbsoluteFill>
  );
};

export const Clip: React.FC<{
  ausschnitt: Ausschnitt;
  laengeInFrames: number;
  fps: number;
  rohvideo: string;
  lookName?: string;
  /** Sekunden innerhalb dieses Ausschnitts, an denen ein Punch sitzt. */
  punches?: number[];
}> = ({ausschnitt, laengeInFrames, fps, rohvideo, lookName, punches = []}) => {
  const frame = useCurrentFrame();
  const l = look(lookName);
  const r = RAHMEN[(ausschnitt.rahmen ?? 'weit') as RahmenName] ?? RAHMEN.weit;

  const [von, bis] = ausschnitt.zoom ?? [1, 1];
  const fahrt = interpolate(frame, [0, laengeInFrames], [von, bis], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Punch: kurzer Stoß nach vorn, dann zurück.
  const punch = punches.reduce((groesster, sekunde) => {
    const start = sekunde * fps;
    const stoss = interpolate(frame, [start, start + 2, start + 7], [0, 0.07, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    return Math.max(groesster, stoss);
  }, 0);

  const scale = fahrt * r.zoom + punch;

  return (
    <AbsoluteFill style={{overflow: 'hidden', backgroundColor: '#000'}}>
      <AbsoluteFill style={{filter: l.filter}}>
        <OffthreadVideo
          src={staticFile(rohvideo)}
          trimBefore={Math.round(ausschnitt.von * fps)}
          trimAfter={Math.round(ausschnitt.bis * fps)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `scale(${scale}) translate(${r.x * 100}%, ${r.y * 100}%)`,
          }}
        />
      </AbsoluteFill>

      {l.ebenen.map((e, i) => (
        <AbsoluteFill
          key={i}
          style={{backgroundColor: e.farbe, mixBlendMode: e.modus as never, opacity: e.deckkraft}}
        />
      ))}

      {l.vignette > 0 ? (
        <AbsoluteFill
          style={{
            background: `radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,${l.vignette}) 100%)`,
          }}
        />
      ) : null}

      {l.koernung > 0 ? <Koernung staerke={l.koernung} /> : null}
    </AbsoluteFill>
  );
};
