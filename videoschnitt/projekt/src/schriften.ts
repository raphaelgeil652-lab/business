import {loadFont} from '@remotion/fonts';
import {continueRender, delayRender, staticFile} from 'remotion';

/**
 * Die Schriften liegen selbst gehostet in `public/fonts/`.
 * Es geht kein Aufruf zu Google Fonts raus — gleiche Regel wie bei den Webseiten.
 */
export const TITELSCHRIFT = 'Archivo Black';
export const TEXTSCHRIFT = 'Hanken Grotesk';

const handle = delayRender('Schriften laden');

Promise.all([
  loadFont({
    family: TITELSCHRIFT,
    url: staticFile('fonts/archivo-black.woff2'),
    weight: '400',
    format: 'woff2',
  }),
  loadFont({
    family: TEXTSCHRIFT,
    url: staticFile('fonts/hanken-grotesk-500.woff2'),
    weight: '500',
    format: 'woff2',
  }),
])
  .then(() => continueRender(handle))
  .catch(() => continueRender(handle));
