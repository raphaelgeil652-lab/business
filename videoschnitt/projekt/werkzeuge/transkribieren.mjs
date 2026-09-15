/**
 * Macht aus einem Rohvideo die Untertitel-Datei.
 *
 * Aufruf (aus dem Ordner `videoschnitt/projekt`):
 *   npm run transkribieren -- public/roh.mp4
 *
 * Was passiert:
 *   1. Ton aus dem Video ziehen (16 kHz Mono, so will es Whisper)
 *   2. Whisper.cpp installieren, falls noch nicht da (einmalig, laedt ~150 MB)
 *   3. Video abtippen lassen, Wort fuer Wort mit Zeitstempel
 *   4. Ergebnis schreiben:
 *        src/daten/untertitel.json     -> wird im Video eingeblendet
 *        arbeitsdateien/transkript.txt -> zum Lesen, mit Zeiten und Pausen
 *
 * Modell waehlen: MODELL=small npm run transkribieren -- public/roh.mp4
 *   base   schnell, fuer Deutsch ungenau bei Fachwoertern
 *   small  guter Kompromiss (Standard)
 *   medium am genauesten, dauert deutlich laenger
 */
import {execFileSync} from 'node:child_process';
import {mkdirSync, writeFileSync} from 'node:fs';
import {dirname, join, resolve} from 'node:path';
import {
  downloadWhisperModel,
  installWhisperCpp,
  transcribe,
  toCaptions,
} from '@remotion/install-whisper-cpp';

const WHISPER_VERSION = '1.7.6';
const modell = process.env.MODELL ?? 'small';
const sprache = process.env.SPRACHE ?? 'de';

const eingabe = process.argv[2];
if (!eingabe) {
  console.error('Bitte das Rohvideo angeben, z. B.: npm run transkribieren -- public/roh.mp4');
  process.exit(1);
}

const videoPfad = resolve(process.cwd(), eingabe);
const whisperOrdner = resolve(process.cwd(), '.whisper');
const wavPfad = join(whisperOrdner, 'ton.wav');
const untertitelPfad = resolve(process.cwd(), 'src/daten/untertitel.json');
const transkriptPfad = resolve(process.cwd(), '../arbeitsdateien/transkript.txt');

mkdirSync(whisperOrdner, {recursive: true});
mkdirSync(dirname(transkriptPfad), {recursive: true});

console.log('1/4  Ton aus dem Video ziehen …');
execFileSync(
  'npx',
  ['remotion', 'ffmpeg', '-y', '-i', videoPfad, '-ar', '16000', '-ac', '1', '-c:a', 'pcm_s16le', wavPfad],
  {stdio: 'ignore'},
);

console.log('2/4  Whisper vorbereiten (beim ersten Mal dauert das ein paar Minuten) …');
await installWhisperCpp({to: whisperOrdner, version: WHISPER_VERSION});
await downloadWhisperModel({model: modell, folder: whisperOrdner});

console.log(`3/4  Video abtippen (Modell: ${modell}, Sprache: ${sprache}) …`);
const roh = await transcribe({
  inputPath: wavPfad,
  whisperPath: whisperOrdner,
  whisperCppVersion: WHISPER_VERSION,
  model: modell,
  language: sprache,
  tokenLevelTimestamps: true,
});

const {captions} = toCaptions({whisperCppOutput: roh});

// Whisper liefert Wortteile: aus „Einkauf" werden „Eink" und „auf".
// Teile ohne fuehrendes Leerzeichen gehoeren ans Wort davor — sonst stehen
// zerrissene Woerter im Video.
const woerter = [];
for (const c of captions) {
  if (c.text.trim() === '') {
    continue;
  }
  const letztes = woerter[woerter.length - 1];
  if (letztes && !c.text.startsWith(' ')) {
    letztes.text += c.text;
    letztes.endMs = c.endMs;
  } else {
    woerter.push({text: c.text, startMs: c.startMs, endMs: c.endMs});
  }
}

writeFileSync(untertitelPfad, JSON.stringify(woerter, null, 1));

// Lesbares Transkript mit Zeiten — die Grundlage fuer den Schnittplan.
const zeit = (ms) => {
  const s = ms / 1000;
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${s.toFixed(2).padStart(5, '0')}`;
};

let text = `Transkript: ${eingabe}\nModell: ${modell}\n\n`;
let zeile = '';
let zeilenStart = woerter[0]?.startMs ?? 0;
let vorigesEnde = null;

for (const w of woerter) {
  // Pausen ab 0,6 Sekunden markieren — das sind die natuerlichen Schnittstellen.
  if (vorigesEnde !== null && w.startMs - vorigesEnde >= 600) {
    text += `[${zeit(zeilenStart)}] ${zeile.trim()}\n`;
    text += `      ↳ Pause ${( (w.startMs - vorigesEnde) / 1000).toFixed(1)} s (${zeit(vorigesEnde)} – ${zeit(w.startMs)})\n`;
    zeile = '';
    zeilenStart = w.startMs;
  } else if (zeile.length > 80 && w.text.startsWith(' ')) {
    text += `[${zeit(zeilenStart)}] ${zeile.trim()}\n`;
    zeile = '';
    zeilenStart = w.startMs;
  }
  zeile += w.text;
  vorigesEnde = w.endMs;
}
if (zeile.trim() !== '') {
  text += `[${zeit(zeilenStart)}] ${zeile.trim()}\n`;
}

writeFileSync(transkriptPfad, text);

console.log('4/4  Fertig.');
console.log(`     ${woerter.length} Wörter → src/daten/untertitel.json`);
console.log('     Transkript mit Zeiten → arbeitsdateien/transkript.txt');
