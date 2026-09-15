"""
Baut die Soundeffekte selbst — keine Stock-Bibliothek, keine Lizenzfragen.

Aufruf (aus dem Ordner `videoschnitt/projekt`):
    python3 werkzeuge/klaenge-bauen.py

Schreibt nach `public/klang/`. Muss nur einmal laufen; die Dateien liegen im Repo.
Wer den Klang ändern will, dreht hier an den Zahlen und lässt es neu laufen.
"""
import math
import os
import struct
import wave

import numpy as np

RATE = 48000
ZIEL = os.path.join(os.path.dirname(__file__), '..', 'public', 'klang')


def schreiben(name, daten, lautstaerke=0.9):
    """Normalisiert auf die gewünschte Spitze und schreibt eine 16-Bit-Stereo-WAV."""
    daten = np.asarray(daten, dtype=np.float64)
    spitze = np.max(np.abs(daten)) or 1.0
    daten = daten / spitze * lautstaerke
    # Weiche Kanten, damit es nicht knackt
    kante = int(RATE * 0.005)
    if len(daten) > 2 * kante:
        daten[:kante] *= np.linspace(0, 1, kante)
        daten[-kante:] *= np.linspace(1, 0, kante)
    stereo = np.stack([daten, daten], axis=1)
    ganz = np.clip(stereo * 32767, -32768, 32767).astype('<i2')
    pfad = os.path.join(ZIEL, name)
    with wave.open(pfad, 'wb') as f:
        f.setnchannels(2)
        f.setsampwidth(2)
        f.setframerate(RATE)
        f.writeframes(ganz.tobytes())
    print(f'  {name}  {len(daten) / RATE:.2f} s')


def t(dauer):
    return np.linspace(0, dauer, int(RATE * dauer), endpoint=False)


def tiefpass(signal, cutoff_verlauf):
    """Einfacher Tiefpass, dessen Grenzfrequenz sich über die Zeit bewegt."""
    aus = np.zeros_like(signal)
    letzter = 0.0
    for i, x in enumerate(signal):
        f = max(40.0, float(cutoff_verlauf[i]))
        alpha = 1.0 - math.exp(-2.0 * math.pi * f / RATE)
        letzter += alpha * (x - letzter)
        aus[i] = letzter
    return aus


def hochpass(signal, cutoff_verlauf):
    tief = tiefpass(signal, cutoff_verlauf)
    return signal - tief


def whoosh(dauer=0.38, richtung='auf'):
    """Rauschen, dessen Klangfarbe durchfährt — der Standardklang für einen Schnitt."""
    zeit = t(dauer)
    rausch = np.random.default_rng(7).normal(0, 1, len(zeit))
    verlauf = np.linspace(300, 6000, len(zeit)) if richtung == 'auf' else np.linspace(6000, 300, len(zeit))
    gefiltert = hochpass(tiefpass(rausch, verlauf * 1.6), verlauf * 0.5)
    huelle = np.sin(np.pi * np.linspace(0, 1, len(zeit))) ** 1.6
    return gefiltert * huelle


def impact(dauer=0.55):
    """Trockener Schlag: tiefer Sinus, der abfällt, plus kurzer Rauschanteil."""
    zeit = t(dauer)
    frequenz = 130 * np.exp(-zeit * 16) + 42
    phase = 2 * np.pi * np.cumsum(frequenz) / RATE
    koerper = np.sin(phase) * np.exp(-zeit * 7)
    rng = np.random.default_rng(11)
    knall = rng.normal(0, 1, len(zeit)) * np.exp(-zeit * 60)
    knall = tiefpass(knall, np.full(len(zeit), 2500.0))
    return koerper * 1.0 + knall * 0.35


def pop(dauer=0.14):
    """Kurzes Ploppen für Text und Grafiken, die aufspringen."""
    zeit = t(dauer)
    frequenz = 1300 * np.exp(-zeit * 30) + 320
    phase = 2 * np.pi * np.cumsum(frequenz) / RATE
    return np.sin(phase) * np.exp(-zeit * 28)


def klick(dauer=0.06):
    zeit = t(dauer)
    rng = np.random.default_rng(3)
    k = rng.normal(0, 1, len(zeit)) * np.exp(-zeit * 160)
    return hochpass(k, np.full(len(zeit), 1200.0))


def riser(dauer=1.1):
    """Aufbau vor der Pointe: Rauschen wird heller und lauter, Ton steigt mit."""
    zeit = t(dauer)
    rng = np.random.default_rng(23)
    rausch = rng.normal(0, 1, len(zeit))
    verlauf = np.linspace(400, 9000, len(zeit))
    gefiltert = hochpass(tiefpass(rausch, verlauf), verlauf * 0.25)
    frequenz = np.linspace(180, 900, len(zeit))
    ton = np.sin(2 * np.pi * np.cumsum(frequenz) / RATE) * 0.35
    huelle = np.linspace(0, 1, len(zeit)) ** 2.2
    return (gefiltert + ton) * huelle


def bass(dauer=0.9):
    """Tiefer Abfall — setzt einen Schlusspunkt unter eine Aussage."""
    zeit = t(dauer)
    frequenz = np.linspace(95, 32, len(zeit))
    phase = 2 * np.pi * np.cumsum(frequenz) / RATE
    return np.sin(phase) * np.exp(-zeit * 2.6)


def swoosh_lang(dauer=0.75):
    return whoosh(dauer, 'ab')


if __name__ == '__main__':
    os.makedirs(ZIEL, exist_ok=True)
    print('Klänge werden gebaut:')
    schreiben('whoosh.wav', whoosh(), 0.75)
    schreiben('whoosh-lang.wav', swoosh_lang(), 0.7)
    schreiben('impact.wav', impact(), 0.92)
    schreiben('pop.wav', pop(), 0.6)
    schreiben('klick.wav', klick(), 0.5)
    schreiben('riser.wav', riser(), 0.75)
    schreiben('bass.wav', bass(), 0.9)
    print('Fertig. Liegen in public/klang/')
