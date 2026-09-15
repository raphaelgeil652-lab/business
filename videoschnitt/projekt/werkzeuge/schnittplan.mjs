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
 *   TEMPO=schnell  Schnitttempo: ruhig (4,0 s) · normal (2,8 s) · schnell (2,0 s)
 *   MAXSTUECK=3.5  überschreibt das Tempo mit einem eigenen Wert
 *   SCHLEIFE=an   hängt den Anfang hinten an, damit der Neustart weich wirkt
 *   FUELLER=aus   lässt Füllwörter („ähm", „äh") stehen, statt sie rauszuschneiden
 *   LOOK=kino     Farblook: natuerlich · hart · kino · warm · kalt · vintage · nacht · schwarzweiss
 *   KLANG=aus     schaltet die Soundeffekte ab
 *   REIZ=3        wie viele Sekunden höchstens ohne neuen Reiz vergehen dürfen
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
// Schnitttempo. Die Werte kommen aus der Recherche: bei der meistkopierten
// Machart liegt die Einstellungslänge bei 1–3 Sekunden.
// Siehe forschung/virale-videos.md, Punkt 2.
const TEMPI = {ruhig: 4.0, normal: 2.8, schnell: 2.0};
const TEMPO = process.env.TEMPO ?? 'normal';
const MAXSTUECK = Number(process.env.MAXSTUECK ?? TEMPI[TEMPO] ?? TEMPI.normal);
const SCHLEIFE = (process.env.SCHLEIFE ?? '').toLowerCase() === 'an';
const FUELLER = (process.env.FUELLER ?? 'an').toLowerCase() !== 'aus';

// Füllwörter fliegen raus wie Stille. Der Leitsatz der Machart lautet:
// tote Zeit hat im Kurzvideo nichts verloren.
// Siehe forschung/virale-videos.md, Punkt 2.
const FUELLWOERTER = /^(ähm|äh|ähem|öhm|öh|ehm|em|hm|hmm|mhm|also)$/i;

const LOOK = process.env.LOOK ?? 'hart';
const KLANG = (process.env.KLANG ?? 'an').toLowerCase() !== 'aus';
// Die Recherche nennt alle 3–5 Sekunden einen neuen Reiz, bei kurzen Videos eher 3.
// Siehe forschung/virale-videos.md, Punkt 10.
const REIZ = Number(process.env.REIZ ?? 3.0);

/**
 * Bildausschnitte im Wechsel. Zwei benachbarte Ausschnitte dürfen nie gleich sein —
 * sonst sieht der Schnitt aus wie ein Aussetzer statt wie eine zweite Kamera.
 */
const RAHMENFOLGE = ['weit', 'nah', 'weit', 'nah-links', 'kopf', 'nah-rechts'];
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

// 1b. Fuellwoerter aus den Stuecken herausschneiden.
const fuellstellen = FUELLER
  ? woerter
      .filter((w) => FUELLWOERTER.test(w.text.trim().replace(/[.,!?…]/g, '')))
      .map((w) => ({von: w.startMs / 1000, bis: w.endMs / 1000}))
  : [];

const ohneFueller = [];
for (const st of stuecke) {
  let reste = [{...st}];
  for (const f of fuellstellen) {
    const neue = [];
    for (const teil of reste) {
      if (f.bis <= teil.von || f.von >= teil.bis) {
        neue.push(teil);
        continue;
      }
      // Vor und hinter dem Fuellwort bleibt jeweils ein Rest stehen.
      if (f.von > teil.von) {
        neue.push({von: teil.von, bis: f.von});
      }
      if (f.bis < teil.bis) {
        neue.push({von: f.bis, bis: teil.bis});
      }
    }
    reste = neue;
  }
  ohneFueller.push(...reste.filter((t) => t.bis - t.von > 0.15));
}

// 2. Luft an die Raender geben, an den Videogrenzen abschneiden.
const mitLuft = ohneFueller.map((s) => ({
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
    rahmen: RAHMENFOLGE[i % RAHMENFOLGE.length],
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

if (HOOK) {
  grafiken.push({
    art: 'titelband',
    von: 0.15,
    bis: Math.min(behalten, 2.6),
    text: HOOK,
  });
}

// 5b. Woerter auf die Zeitleiste des fertigen Videos umrechnen. Das brauchen
//     Punches, Stichwort und die Reizpruefung.
const imSchnitt = [];
let versatz = 0;
for (const a of ausschnitte) {
  for (const w of woerter) {
    const start = w.startMs / 1000;
    if (start < a.von || start >= a.bis) {
      continue;
    }
    imSchnitt.push({
      text: w.text.trim(),
      zeit: Number((versatz + (start - a.von)).toFixed(2)),
    });
  }
  versatz += a.bis - a.von;
}

// Punches sitzen auf Zahlen und Preisen — dort bleibt der Blick haengen.
const punches = imSchnitt
  .filter((w) => /[0-9]|€|%/.test(w.text))
  .map((w) => w.zeit);

// Das letzte gesprochene Wort ist fast immer die Pointe.
const letztes = imSchnitt[imSchnitt.length - 1];
if (letztes && behalten > 3) {
  const wort = letztes.text.replace(/[.,!?…]/g, '');
  if (wort.length >= 3) {
    grafiken.push({
      art: 'stichwort',
      von: Math.max(0, letztes.zeit - 0.15),
      bis: behalten,
      text: wort,
    });
    punches.push(letztes.zeit);
  }
}

// 5c. Tonebene. Ein Schnitt ohne Geraeusch wirkt wie ein Aussetzer.
const klaenge = [];
if (KLANG) {
  let stelle2 = 0;
  for (const a of ausschnitte.slice(0, -1)) {
    stelle2 += a.bis - a.von;
    // Der Whoosh startet kurz vor dem Schnitt, sonst kommt er zu spaet an.
    klaenge.push({art: 'whoosh', von: Number(Math.max(0, stelle2 - 0.08).toFixed(2))});
  }
  if (HOOK) {
    klaenge.push({art: 'impact', von: 0.15});
  }
  if (NAME) {
    klaenge.push({art: 'pop', von: 0.6});
  }
  for (const p of punches) {
    klaenge.push({art: 'pop', von: p, lautstaerke: 0.3});
  }
  if (letztes && behalten > 3) {
    klaenge.push({art: 'riser', von: Math.max(0, letztes.zeit - 1.0), lautstaerke: 0.3});
    klaenge.push({art: 'bass', von: letztes.zeit});
  }
}

const plan = {
  rohvideo: eingabe.replace(/^public\//, ''),
  breite,
  hoehe,
  fps,
  untertitel: true,
  akzentfarbe: process.env.AKZENT ?? '#ffd60a',
  hook: '',
  look: LOOK,
  ausschnitte,
  grafiken,
  punches: [...new Set(punches)].sort((a, b) => a - b),
  klaenge,
  ...(OUTRO && !SCHLEIFE
    ? {outro: {dauer: 1.4, text: OUTRO, unterzeile: process.env.OUTROZEILE ?? ''}}
    : {}),
  ...(SCHLEIFE ? {schleife: {dauer: 0.5}} : {}),
};

writeFileSync(planPfad, JSON.stringify(plan, null, 2) + '\n');

const weg = laenge - behalten;
console.log(`Schnittplan geschrieben → src/daten/schnittplan.json`);
console.log(
  `  Rohvideo:     ${laenge.toFixed(1)} s, ${breite}×${hoehe}, ${fps} fps${gedreht ? ' (Hochkant, gedreht gespeichert)' : ''}`,
);
console.log(`  Ausschnitte:  ${ausschnitte.length}`);
console.log(`  Bleibt:       ${behalten.toFixed(1)} s`);
console.log(
  `  Rausgenommen: ${weg.toFixed(1)} s Pausen und Füllwörter (${((weg / laenge) * 100).toFixed(0)} %)`,
);
if (fuellstellen.length > 0) {
  console.log(`  Füllwörter:   ${fuellstellen.length} rausgeschnitten`);
}
console.log(`  Tempo:        ${process.env.MAXSTUECK ? 'eigener Wert' : TEMPO} (max. ${MAXSTUECK} s pro Einstellung)`);
// 6. Reizpruefung: Wie lange laeuft das Video, ohne dass etwas passiert?
const reize = [
  ...ausschnitte.slice(1).map((_, i) =>
    ausschnitte.slice(0, i + 1).reduce((n, a) => n + (a.bis - a.von), 0),
  ),
  ...grafiken.filter((g) => g.art !== 'fortschritt').map((g) => g.von),
  ...punches,
].sort((a, b) => a - b);

let groessteLuecke = reize.length > 0 ? reize[0] : behalten;
let luekeBei = 0;
for (let i = 1; i < reize.length; i++) {
  if (reize[i] - reize[i - 1] > groessteLuecke) {
    groessteLuecke = reize[i] - reize[i - 1];
    luekeBei = reize[i - 1];
  }
}
if (reize.length > 0 && behalten - reize[reize.length - 1] > groessteLuecke) {
  groessteLuecke = behalten - reize[reize.length - 1];
  luekeBei = reize[reize.length - 1];
}

console.log(`  Grafiken:     ${grafiken.length}`);
console.log(`  Klänge:       ${klaenge.length}`);
console.log(`  Look:         ${LOOK}`);
console.log(`  Reize:        ${reize.length} — größte Lücke ${groessteLuecke.toFixed(1)} s bei ${luekeBei.toFixed(1)} s`);
if (HOOK) {
  console.log(`  Hook:         „${HOOK}"`);
}
if (SCHLEIFE) {
  console.log('  Schluss:      Schleife (Anfang hängt hinten dran)');
} else if (OUTRO) {
  console.log(`  Abspann:      „${OUTRO}"`);
}

if (groessteLuecke > REIZ) {
  console.log('');
  console.log(`  ⚠ ${groessteLuecke.toFixed(1)} s ohne neuen Reiz (ab Sekunde ${luekeBei.toFixed(1)}).`);
  console.log(`    Empfohlen sind höchstens ${REIZ} s. Abhilfe: TEMPO=schnell,`);
  console.log('    oder von Hand eine Grafik in diese Lücke setzen.');
}

// Der Hook ist der wichtigste Einzelfaktor: Zuschauer entscheiden in 2–3 Sekunden.
// Siehe forschung/virale-videos.md, Punkt 1.
if (!HOOK) {
  console.log('');
  console.log('  ⚠ Kein Hook gesetzt. Die ersten drei Sekunden entscheiden, ob');
  console.log('    jemand weiterschaut. Setz einen:');
  console.log('      HOOK="Dein Satz" npm run schneiden -- ' + eingabe);
}
