/**
 * Baut den Schnittplan automatisch aus dem Transkript.
 *
 * Aufruf (aus dem Ordner `videoschnitt/projekt`):
 *   npm run schnittplan -- public/roh.mp4
 *
 * Die Idee dahinter ist einfach: Wo im Rohvideo niemand spricht, passiert
 * nichts. Genau diese Stellen fliegen raus. Was bleibt, wird aneinander-
 * gehängt und bekommt abwechselnde Zooms, damit kein Ausschnitt tot wirkt.
 *
 * Stellschrauben (als Umgebungsvariablen davorsetzen):
 *   PAUSE=0.45   ab welcher Stille geschnitten wird, in Sekunden
 *   LUFT=0.12    wie viel Ruhe an jedem Schnittrand stehen bleibt
 *   MINLAENGE=0.5  kürzere Ausschnitte werden mit dem Nachbarn verschmolzen
 *   MAXSTUECK=3.5  längere Ausschnitte werden geteilt, damit der Zoom wechselt
 *   HOOK="Text"  großer Text über dem ersten Ausschnitt
 *   NAME="Raffi"  Namensschild, das am Anfang reinfährt
 *   ROLLE="Clickculture"  Unterzeile im Namensschild
 *   OUTRO="Clickculture"  Abspann-Karte am Ende
 *
 * Beispiel:
 *   PAUSE=0.6 HOOK="3 Fehler, die dich Kunden kosten" npm run schnittplan -- public/roh.mp4
 */
import {execFileSync} from 'node:child_process';
import {existsSync, readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';

const PAUSE = Number(process.env.PAUSE ?? 0.45);
const LUFT = Number(process.env.LUFT ?? 0.12);
const MINLAENGE = Number(process.env.MINLAENGE ?? 0.5);
const MAXSTUECK = Number(process.env.MAXSTUECK ?? 3.5);
const HOOK = process.env.HOOK ?? '';
const NAME = process.env.NAME ?? '';
const ROLLE = process.env.ROLLE ?? '';
const OUTRO = process.env.OUTRO ?? '';

const eingabe = process.argv[2] ?? 'public/roh.mp4';
const videoPfad = resolve(process.cwd(), eingabe);
const untertitelPfad = resolve(process.cwd(), 'src/daten/untertitel.json');
const planPfad = resolve(process.cwd(), 'src/daten/schnittplan.json');

if (!existsSync(videoPfad)) {
  console.error(`Rohvideo nicht gefunden: ${eingabe}`);
  process.exit(1);
}
if (!existsSync(untertitelPfad)) {
  console.error('Es gibt noch keine Untertitel. Zuerst: npm run transkribieren -- ' + eingabe);
  process.exit(1);
}

/** Maße, Bildrate und Länge direkt aus dem Rohvideo lesen. */
const messen = () => {
  const roh = execFileSync(
    'npx',
    ['remotion', 'ffprobe', '-v', 'error', '-show_streams', '-show_format', '-of', 'json', videoPfad],
    {encoding: 'utf8'},
  );
  const daten = JSON.parse(roh.slice(roh.indexOf('{')));
  const spur = daten.streams.find((s) => s.codec_type === 'video') ?? {};
  const [zaehler, nenner] = String(spur.avg_frame_rate ?? '30/1').split('/');

  // Handyvideos liegen oft quer in der Datei und werden erst beim Abspielen
  // gedreht. Ohne diesen Schritt käme ein Hochkantvideo als Querformat raus.
  const drehung = Math.abs(
    (spur.side_data_list ?? []).find((d) => d.rotation !== undefined)?.rotation ??
      Number(spur.tags?.rotate ?? 0),
  );
  const quer = drehung === 90 || drehung === 270;

  return {
    breite: (quer ? spur.height : spur.width) ?? 1080,
    hoehe: (quer ? spur.width : spur.height) ?? 1920,
    fps: Math.round(Number(zaehler) / Number(nenner || 1)) || 30,
    laenge: Number(daten.format?.duration ?? 0),
    gedreht: quer,
  };
};

const {breite, hoehe, fps, laenge, gedreht} = messen();
const woerter = JSON.parse(readFileSync(untertitelPfad, 'utf8'));

if (woerter.length === 0) {
  console.error('Die Untertitel-Datei ist leer — im Video wurde nichts gesprochen erkannt.');
  process.exit(1);
}

// 1. Woerter zu Stuecken buendeln: neue Stelle, sobald eine echte Pause kommt.
const stuecke = [];
let aktuell = null;

for (const w of woerter) {
  const von = w.startMs / 1000;
  const bis = w.endMs / 1000;
  if (aktuell === null) {
    aktuell = {von, bis};
    continue;
  }
  if (von - aktuell.bis >= PAUSE) {
    stuecke.push(aktuell);
    aktuell = {von, bis};
  } else {
    aktuell.bis = bis;
  }
}
if (aktuell) {
  stuecke.push(aktuell);
}

// 2. Luft an die Raender geben, an den Videogrenzen abschneiden.
const mitLuft = stuecke.map((s) => ({
  von: Math.max(0, s.von - LUFT),
  bis: Math.min(laenge, s.bis + LUFT),
}));

// 3. Zu kurze Stuecke an das vorherige anhaengen, ueberlappende verschmelzen.
const zusammengefasst = [];
for (const s of mitLuft) {
  const letztes = zusammengefasst[zusammengefasst.length - 1];
  if (letztes && (s.von <= letztes.bis || s.bis - s.von < MINLAENGE)) {
    letztes.bis = Math.max(letztes.bis, s.bis);
  } else {
    zusammengefasst.push({...s});
  }
}

// 3b. Lange Stuecke teilen. Wer ohne Pause durchredet, bekaeme sonst einen
//     einzigen langen Ausschnitt ohne jeden Wechsel. Geteilt wird immer an
//     einer Wortgrenze, nie mitten im Wort — und dort, wo die groesste
//     Atempause liegt.
const grenzenIn = (von, bis) => {
  const grenzen = [];
  for (let i = 0; i < woerter.length - 1; i++) {
    const ende = woerter[i].endMs / 1000;
    const start = woerter[i + 1].startMs / 1000;
    if (ende > von + 0.8 && start < bis - 0.8) {
      grenzen.push({stelle: (ende + start) / 2, luecke: start - ende});
    }
  }
  return grenzen;
};

const geteilt = [];
for (const s of zusammengefasst) {
  let von = s.von;
  while (s.bis - von > MAXSTUECK * 1.4) {
    const ziel = von + MAXSTUECK;
    const nah = grenzenIn(von, s.bis).filter(
      (g) => g.stelle > ziel - 1.2 && g.stelle < ziel + 0.8,
    );
    // Die laengste Atempause im Fenster ist die unauffaelligste Schnittstelle.
    nah.sort((a, b) => b.luecke - a.luecke);
    const stelle = nah.length > 0 ? nah[0].stelle : ziel;
    geteilt.push({von, bis: Number(stelle.toFixed(2))});
    von = Number(stelle.toFixed(2));
  }
  geteilt.push({von, bis: s.bis});
}

// 4. Zooms abwechseln, damit die Ausschnitte nicht gleich aussehen.
//    Ran, raus, leicht ran — und bei langen Ausschnitten staerker.
const zoomfolge = [
  [1.0, 1.1],
  [1.14, 1.02],
  [1.05, 1.16],
  [1.12, 1.0],
];

const ausschnitte = geteilt.map((s, i) => {
  const dauer = s.bis - s.von;
  const [a, b] = zoomfolge[i % zoomfolge.length];
  // Bei sehr kurzen Ausschnitten faellt der Zoom kleiner aus, sonst wirkt es hektisch.
  const staerke = Math.min(1, dauer / 2.5);
  return {
    von: Number(s.von.toFixed(2)),
    bis: Number(s.bis.toFixed(2)),
    zoom: [
      Number((1 + (a - 1) * staerke).toFixed(3)),
      Number((1 + (b - 1) * staerke).toFixed(3)),
    ],
  };
});

const behalten = ausschnitte.reduce((n, a) => n + (a.bis - a.von), 0);

// 5. Motion Graphics setzen. Zeiten zaehlen ab hier im fertigen Video.
const grafiken = [{art: 'fortschritt', von: 0, bis: behalten}];

// Auf jedem Schnitt ein kurzer Wisch — das macht die Schnitte sichtbar,
// statt sie zu verstecken.
let stelle = 0;
for (const a of ausschnitte.slice(0, -1)) {
  stelle += a.bis - a.von;
  grafiken.push({art: 'blitz', von: Number(stelle.toFixed(2)), bis: Number((stelle + 0.22).toFixed(2))});
}

if (NAME) {
  grafiken.push({
    art: 'namensschild',
    von: 0.6,
    bis: Math.min(behalten, 3.4),
    text: NAME,
    ...(ROLLE ? {unterzeile: ROLLE} : {}),
  });
}

const plan = {
  rohvideo: eingabe.replace(/^public\//, ''),
  breite,
  hoehe,
  fps,
  untertitel: true,
  akzentfarbe: process.env.AKZENT ?? '#ffd60a',
  hook: HOOK,
  ausschnitte,
  grafiken,
  ...(OUTRO ? {outro: {dauer: 1.4, text: OUTRO, unterzeile: process.env.OUTROZEILE ?? ''}} : {}),
};

writeFileSync(planPfad, JSON.stringify(plan, null, 2) + '\n');

const weg = laenge - behalten;
console.log(`Schnittplan geschrieben → src/daten/schnittplan.json`);
console.log(
  `  Rohvideo:     ${laenge.toFixed(1)} s, ${breite}×${hoehe}, ${fps} fps${gedreht ? ' (Hochkant, gedreht gespeichert)' : ''}`,
);
console.log(`  Ausschnitte:  ${ausschnitte.length}`);
console.log(`  Bleibt:       ${behalten.toFixed(1)} s`);
console.log(`  Rausgenommen: ${weg.toFixed(1)} s Pausen (${((weg / laenge) * 100).toFixed(0)} %)`);
console.log(`  Grafiken:     ${grafiken.length}`);
if (HOOK) {
  console.log(`  Hook:         „${HOOK}"`);
}
if (OUTRO) {
  console.log(`  Abspann:      „${OUTRO}"`);
}
