import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {TEXTSCHRIFT, TITELSCHRIFT} from './schriften';

/**
 * Werbeclip fuer Meta/Google — reine Motion Graphics, kein Rohmaterial noetig.
 *
 * Aufbau nach dem Baukasten-Prinzip aus `service-module.md`:
 * Geruest bleibt gleich, nur die Texte werden pro Kunde getauscht.
 * Die Bildflaechen sind sichtbare Platzhalter, bis echte Vorher/Nachher-Fotos
 * des Betriebs da sind — erfundene Bilder kommen hier nicht rein.
 */
export type WerbeclipTexte = {
  hook: string;
  betrieb: string;
  ort: string;
  leistung: string;
  offer: string;
  cta: string;
  akzent: string;
};

export const werbeclipStandard: WerbeclipTexte = {
  hook: 'Ihr Auto sieht müde aus?',
  betrieb: '[Betrieb]',
  ort: '[Ort]',
  leistung: 'Aufbereitung & Keramikversiegelung',
  offer: 'Kostenloser Lack-Check — Festpreis vorher, keine Überraschung',
  cta: 'Jetzt Termin sichern',
  akzent: '#ffb020',
};

const HINTERGRUND = '#0b0f14';

const Szene: React.FC<{children: React.ReactNode}> = ({children}) => {
  const frame = useCurrentFrame();
  const auf = interpolate(frame, [0, 8], [0, 1], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill
      style={{
        opacity: auf,
        padding: 90,
        justifyContent: 'center',
        backgroundColor: HINTERGRUND,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

const Fotoplatz: React.FC<{beschriftung: string; verzoegerung: number; akzent: string}> = ({
  beschriftung,
  verzoegerung,
  akzent,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const rein = spring({frame: frame - verzoegerung, fps, config: {damping: 18, stiffness: 140}});
  return (
    <div
      style={{
        flex: 1,
        borderRadius: 24,
        border: `4px dashed ${akzent}`,
        backgroundColor: 'rgba(255,255,255,0.04)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `translateY(${interpolate(rein, [0, 1], [50, 0])}px)`,
        opacity: rein,
        fontFamily: TEXTSCHRIFT,
        fontSize: 40,
        color: 'rgba(255,255,255,0.75)',
        textAlign: 'center',
        padding: 24,
      }}
    >
      {beschriftung}
    </div>
  );
};

export const Werbeclip: React.FC<WerbeclipTexte> = (t) => {
  const {fps, durationInFrames} = useVideoConfig();
  const frame = useCurrentFrame();
  const fortschritt = interpolate(frame, [0, durationInFrames], [0, 1]);

  return (
    <AbsoluteFill style={{backgroundColor: HINTERGRUND}}>
      {/* 1 — Hook */}
      <Sequence durationInFrames={3 * fps}>
        <Szene>
          <HookZeile text={t.hook} akzent={t.akzent} />
          <div
            style={{
              marginTop: 40,
              fontFamily: TEXTSCHRIFT,
              fontSize: 44,
              color: 'rgba(255,255,255,0.72)',
            }}
          >
            {t.leistung} in {t.ort}
          </div>
        </Szene>
      </Sequence>

      {/* 2 — Vorher/Nachher */}
      <Sequence from={3 * fps} durationInFrames={4 * fps}>
        <Szene>
          <div style={{display: 'flex', flexDirection: 'column', gap: 28, height: '72%'}}>
            <Fotoplatz beschriftung="Platzhalter: echtes Vorher-Foto des Betriebs" verzoegerung={0} akzent={t.akzent} />
            <Fotoplatz beschriftung="Platzhalter: echtes Nachher-Foto des Betriebs" verzoegerung={12} akzent={t.akzent} />
          </div>
          <div
            style={{
              marginTop: 36,
              fontFamily: TITELSCHRIFT,
              fontSize: 56,
              color: '#fff',
              textTransform: 'uppercase',
            }}
          >
            Vorher — Nachher
          </div>
        </Szene>
      </Sequence>

      {/* 3 — Angebot */}
      <Sequence from={7 * fps} durationInFrames={4 * fps}>
        <Szene>
          <div
            style={{
              borderLeft: `10px solid ${t.akzent}`,
              paddingLeft: 40,
              fontFamily: TITELSCHRIFT,
              fontSize: 82,
              lineHeight: 1.12,
              color: '#fff',
            }}
          >
            {t.offer}
          </div>
        </Szene>
      </Sequence>

      {/* 4 — Abschluss */}
      <Sequence from={11 * fps}>
        <Szene>
          <div style={{textAlign: 'center'}}>
            <div style={{fontFamily: TITELSCHRIFT, fontSize: 92, color: '#fff'}}>{t.betrieb}</div>
            <div
              style={{
                marginTop: 18,
                fontFamily: TEXTSCHRIFT,
                fontSize: 46,
                color: 'rgba(255,255,255,0.7)',
              }}
            >
              {t.ort}
            </div>
            <Knopf text={t.cta} akzent={t.akzent} />
          </div>
        </Szene>
      </Sequence>

      {/* Fortschrittsbalken — haelt den Blick bis zum Ende */}
      <AbsoluteFill style={{justifyContent: 'flex-end'}}>
        <div style={{height: 10, backgroundColor: 'rgba(255,255,255,0.12)'}}>
          <div style={{height: '100%', width: `${fortschritt * 100}%`, backgroundColor: t.akzent}} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const HookZeile: React.FC<{text: string; akzent: string}> = ({text, akzent}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const woerter = text.split(' ');
  return (
    <div style={{display: 'flex', flexWrap: 'wrap', gap: '0 22px'}}>
      {woerter.map((w, i) => {
        const rein = spring({
          frame: frame - i * 4,
          fps,
          config: {damping: 16, stiffness: 160},
        });
        return (
          <span
            key={i}
            style={{
              fontFamily: TITELSCHRIFT,
              fontSize: 96,
              lineHeight: 1.05,
              color: i === woerter.length - 1 ? akzent : '#fff',
              transform: `translateY(${interpolate(rein, [0, 1], [60, 0])}px)`,
              opacity: rein,
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

const Knopf: React.FC<{text: string; akzent: string}> = ({text, akzent}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const puls = interpolate(
    Math.sin(((frame / fps) * Math.PI * 2) / 1.6),
    [-1, 1],
    [0.985, 1.015],
    {easing: Easing.linear},
  );
  return (
    <div
      style={{
        marginTop: 60,
        display: 'inline-block',
        transform: `scale(${puls})`,
        backgroundColor: akzent,
        color: '#0b0f14',
        fontFamily: TITELSCHRIFT,
        fontSize: 58,
        padding: '28px 48px',
        borderRadius: 18,
        textTransform: 'uppercase',
      }}
    >
      {text}
    </div>
  );
};
