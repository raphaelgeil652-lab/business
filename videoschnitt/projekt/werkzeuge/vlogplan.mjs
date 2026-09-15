/**
 * Baut den Vlog-Plan aus einem Ordner voller Aufnahmen.
 *
 * Aufruf (aus dem Ordner `videoschnitt/projekt`):
 *   npm run vlogplan
 *
 * Erwartet die Clips in `public/vlog/` — beliebig viele, .mp4 oder .mov.
 * Sie werden nach Dateiname sortiert, das ist die Reihenfolge im Film.
 *
 * Stellschrauben:
 *   SZENE=2.4      wie lange eine Szene läuft (Sekunden)
 *   PROCLIP=1      wie viele Szenen aus einer Aufnahme geschnitten werden
 *   UEBERGANG=whip fester Übergang statt Abwechslung
 *                  (whip · zoom · weissblitz · blende · wisch · schieben · uhr · zugschnitt · hart)
 *   LOOK=warm      Farblook für alle Szenen
 *   MUSIK=musik.mp3  Musikdatei in public/ (wird automatisch erkannt)
 *   START=1.0      wie viele Sekunden am Anfang jeder Aufnahme übersprungen werden
 */
import {execFileSync} from 'node:child_process';
import {existsSync, readdirSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';

const SZENE = Number(process.env.SZENE ?? 2.4);
const PROCLIP = Math.max(1, Number(process.env.PROCLIP ?? 1));
const START = Number(process.env.START ?? 0.6);
const LOOK = process.env.LOOK ?? 'warm';
const FEST = process.env.UEBERGANG ?? '';

// Abwechslung statt immer derselbe Übergang — sonst wirkt der Film wie eine
// Vorlage. „hart" ist bewusst dabei: Nicht jeder Schnitt braucht einen Effekt.
const UEBERGAENGE = ['whip', 'hart', 'zoom', 'schieben', 'hart', 'whip', 'blende'];
const RAHMEN = ['weit', 'nah', 'weit', 'nah-links', 'weit', 'nah-rechts'];
const ZOOMS = [
  [1.0, 1.08],
  [1.1, 1.0],
  [1.0, 1.12],
  [1.08, 1.0],
];

const vlogOrdner = resolve(process.cwd(), 'public/vlog');
const planPfad = resolve(process.cwd(), 'src/daten/vlogplan.json');

if (!existsSync(vlogOrdner)) {
  console.error('Es gibt keinen Ordner public/vlog/. Leg deine Aufnahmen dort ab.');
  process.exit(1);
}

const dateien = readdirSync(vlogOrdner)
  .filter((f) => /\.(mp4|mov|m4v)$/i.test(f))
  .sort();

if (dateien.length === 0) {
  console.error('In public/vlog/ liegt keine Aufnahme (.mp4 oder .mov).');
  process.exit(1);
}

const messen = (pfad) => {
  const roh = execFileSync(
    'npx',
    ['remotion', 'ffprobe', '-v', 'error', '-show_streams', '-show_format', '-of', 'json', pfad],
    {encoding: 'utf8'},
  );
  const daten = JSON.parse(roh.slice(roh.indexOf('{')));
  const spur = daten.streams.find((s) => s.codec_type === 'video') ?? {};
  const [z, n] = String(spur.avg_frame_rate ?? '30/1').split('/');
  const drehung = Math.abs(
    (spur.side_data_list ?? []).find((d) => d.rotation !== undefined)?.rotation ??
      Number(spur.tags?.rotate ?? 0),
  );
  const quer = drehung === 90 || drehung === 270;
  return {
    breite: (quer ? spur.height : spur.width) ?? 1080,
    hoehe: (quer ? spur.width : spur.height) ?? 1920,
    fps: Math.round(Number(z) / Number(n || 1)) || 30,
    laenge: Number(daten.format?.duration ?? 0),
  };
};

const szenen = [];
let ersteMasse = null;
let index = 0;

for (const datei of dateien) {
  const masse = messen(resolve(vlogOrdner, datei));
  if (!ersteMasse) {
    ersteMasse = masse;
  }

  // Aus einer langen Aufnahme mehrere Szenen schneiden, gleichmäßig verteilt.
  const nutzbar = Math.max(0, masse.laenge - START);
  const anzahl = Math.max(1, Math.min(PROCLIP, Math.floor(nutzbar / SZENE)));
  const abstand = anzahl > 1 ? nutzbar / anzahl : 0;

  for (let i = 0; i < anzahl; i++) {
    const von = Number((START + i * abstand).toFixed(2));
    const dauer = Number(Math.min(SZENE, masse.laenge - von).toFixed(2));
    if (dauer < 0.8) {
      continue;
    }
    szenen.push({
      datei: `vlog/${datei}`,
      von,
      dauer,
      zoom: ZOOMS[index % ZOOMS.length],
      rahmen: RAHMEN[index % RAHMEN.length],
      ...(index === 0
        ? {}
        : {
            uebergang: FEST || UEBERGAENGE[(index - 1) % UEBERGAENGE.length],
            uebergangDauer: 0.4,
          }),
    });
    index++;
  }
}

// Musik automatisch erkennen.
const musikName = process.env.MUSIK ?? 'musik.mp3';
const hatMusik = existsSync(resolve(process.cwd(), 'public', musikName));

// Auf jedem Übergang ein Geräusch — der Übergang trägt sonst nicht.
const klaenge = [];
let zeit = 0;
szenen.forEach((s, i) => {
  if (i > 0) {
    const weich = s.uebergang && s.uebergang !== 'hart';
    klaenge.push({
      art: weich ? 'whoosh-lang' : 'whoosh',
      von: Number(Math.max(0, zeit - 0.12).toFixed(2)),
      lautstaerke: weich ? 0.4 : 0.5,
    });
    if (weich) {
      zeit -= s.uebergangDauer ?? 0.4;
    }
  }
  zeit += s.dauer;
});

const plan = {
  breite: ersteMasse.breite,
  hoehe: ersteMasse.hoehe,
  fps: ersteMasse.fps,
  look: LOOK,
  akzentfarbe: process.env.AKZENT ?? '#ffd60a',
  ...(hatMusik ? {musik: musikName, musikLautstaerke: Number(process.env.MUSIKLAUT ?? 0.22)} : {}),
  szenen,
  grafiken: [],
  klaenge,
};

writeFileSync(planPfad, JSON.stringify(plan, null, 2) + '\n');

console.log('Vlog-Plan geschrieben → src/daten/vlogplan.json');
console.log(`  Aufnahmen:    ${dateien.length}`);
console.log(`  Szenen:       ${szenen.length}`);
console.log(`  Länge:        ${zeit.toFixed(1)} s`);
console.log(`  Maße:         ${plan.breite}×${plan.hoehe}, ${plan.fps} fps`);
console.log(`  Look:         ${LOOK}`);
console.log(`  Musik:        ${hatMusik ? musikName : 'keine (public/' + musikName + ' fehlt)'}`);
if (!hatMusik) {
  console.log('');
  console.log('  Hinweis: Ein Vlog ohne Musik wirkt leer. Leg eine Datei als');
  console.log(`  public/${musikName} ab — dann liegt sie automatisch drunter.`);
}
