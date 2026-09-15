import {AbsoluteFill, useVideoConfig} from 'remotion';
import {TEXTSCHRIFT} from '../schriften';
import {rahmen} from '../sicherheitszonen';

/**
 * Blendet die sicheren Zonen sichtbar ein — zum Prüfen, nicht für das fertige Video.
 * Einschalten beim Rendern mit: RAHMEN=1
 *
 * Rot schraffiert ist das, was die App später überdeckt.
 */
export const Rahmenpruefung: React.FC = () => {
  const {width, height} = useVideoConfig();
  const r = rahmen(width, height);
  const rot = 'rgba(255,0,64,0.28)';

  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: r.oben, background: rot}} />
      <div style={{position: 'absolute', bottom: 0, left: 0, right: 0, height: r.unten, background: rot}} />
      <div style={{position: 'absolute', top: 0, bottom: 0, left: 0, width: r.links, background: rot}} />
      <div style={{position: 'absolute', top: 0, bottom: 0, right: 0, width: r.rechts, background: rot}} />
      <div
        style={{
          position: 'absolute',
          top: r.oben,
          left: r.links,
          right: r.rechts,
          bottom: r.unten,
          border: `${3 * r.s}px dashed rgba(255,255,255,0.9)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: r.oben + 12 * r.s,
          left: r.links + 12 * r.s,
          fontFamily: TEXTSCHRIFT,
          fontSize: 26 * r.s,
          color: '#fff',
          background: 'rgba(0,0,0,0.7)',
          padding: `${6 * r.s}px ${12 * r.s}px`,
        }}
      >
        sichere Zone — rot wird von der App überdeckt
      </div>
    </AbsoluteFill>
  );
};
