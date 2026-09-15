/**
 * Der eine Befehl, der alles macht.
 *
 *   npm run schneiden -- public/roh.mp4
 *
 * Läuft nacheinander:
 *   1. abtippen        (Ton -> Wörter mit Zeitstempeln)
 *   2. Schnitt planen  (Pausen raus, Zooms setzen)
 *   3. rendern         (fertige MP4-Datei)
 *
 * Alle Stellschrauben aus den Einzelwerkzeugen gelten auch hier:
 *   MODELL=small PAUSE=0.6 HOOK="Dein Hook" npm run schneiden -- public/roh.mp4
 */
import {spawnSync} from 'node:child_process';
import {existsSync} from 'node:fs';
import {resolve} from 'node:path';

const eingabe = process.argv[2] ?? 'public/roh.mp4';
const ziel = process.argv[3] ?? 'ausgabe/kurzvideo.mp4';

if (!existsSync(resolve(process.cwd(), eingabe))) {
  console.error(`Rohvideo nicht gefunden: ${eingabe}`);
  console.error('Leg die Aufnahme als public/roh.mp4 ab oder gib den Pfad an.');
  process.exit(1);
}

const schritte = [
  ['Abtippen', 'node', ['werkzeuge/transkribieren.mjs', eingabe]],
  ['Schnitt planen', 'node', ['werkzeuge/schnittplan.mjs', eingabe]],
  ['Rendern', 'bash', ['werkzeuge/rendern.sh', 'Kurzvideo', ziel]],
];

for (const [name, befehl, argumente] of schritte) {
  console.log(`\n=== ${name} ===`);
  const ergebnis = spawnSync(befehl, argumente, {stdio: 'inherit'});
  if (ergebnis.status !== 0) {
    console.error(`\nAbgebrochen bei: ${name}`);
    process.exit(ergebnis.status ?? 1);
  }
}

console.log(`\nFertig: ${ziel}`);
