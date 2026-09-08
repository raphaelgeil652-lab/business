#!/usr/bin/env python3
"""Baut aus der fertigen Seite eine einzige Datei zum Anschauen.

Alles wird eingebettet: die Bildfolge des Heros, die Abschnittsbilder, die Schriften.
Die Datei liegt in vorschau/ und damit ausserhalb des Deploy-Ordners, sie geht nie mit
online. Zum Ausliefern zaehlt allein nischen/alex-aussenanlagen/seite/.

Die Bildfolge wird fuer die Vorschau kleiner gerechnet, sonst waere die eine Datei
ueber zehn Megabyte gross. Auf der echten Seite bleiben die vollen Bilder.

Aufruf:  python3 vorschau-bauen.py
"""
import base64, io, os, re, shutil, subprocess, sys, tempfile

HIER = os.path.dirname(os.path.abspath(__file__))
SEITE = os.path.join(HIER, '..', 'seite')
ZIEL = os.path.join(HIER, '..', 'vorschau', 'alex-komplett.html')
VORSCHAU_BREITE = 820          # Bildfolge nur fuer die Vorschau verkleinert
VORSCHAU_QUALITAET = '9'

TYPEN = {'.jpg': 'image/jpeg', '.png': 'image/png', '.woff2': 'font/woff2'}


def als_uri(pfad, typ=None):
    typ = typ or TYPEN[os.path.splitext(pfad)[1].lower()]
    with open(pfad, 'rb') as f:
        return 'data:%s;base64,%s' % (typ, base64.b64encode(f.read()).decode('ascii'))


def main():
    html = io.open(os.path.join(SEITE, 'index.html'), encoding='utf-8').read()

    # jedes url('assets/...') durch die eingebettete Datei ersetzen
    for rel in sorted(set(re.findall(r"url\('(assets/[^']+)'\)", html))):
        html = html.replace("url('%s')" % rel, "url('%s')" % als_uri(os.path.join(SEITE, rel)))

    # Standbild im Skript
    html = html.replace("'assets/hero-start.jpg'", "'%s'" % als_uri(os.path.join(SEITE, 'assets/hero-start.jpg')))

    # die Bildfolge: verkleinert und als Liste ins Skript
    ordner = os.path.join(SEITE, 'assets', 'frames')
    namen = sorted(n for n in os.listdir(ordner) if n.endswith('.jpg'))
    tmp = tempfile.mkdtemp()
    try:
        uris = []
        for n in namen:
            klein = os.path.join(tmp, n)
            subprocess.run(['ffmpeg', '-v', 'error', '-i', os.path.join(ordner, n),
                            '-vf', 'scale=%d:-2' % VORSCHAU_BREITE, '-q:v', VORSCHAU_QUALITAET,
                            '-y', klein], check=True)
            uris.append(als_uri(klein))
        liste = ','.join("'%s'" % u for u in uris)
    finally:
        shutil.rmtree(tmp, ignore_errors=True)

    alt = ("  function frameURL(i){ var n = String(i+1); while (n.length < 4) n = '0' + n; "
           "return 'assets/frames/f' + n + '.jpg'; }")
    neu = "  var __F=[%s];\n  function frameURL(i){ return __F[i]; }" % liste
    assert alt in html, 'frameURL nicht gefunden, die Vorschau waere ohne Bilder'
    html = html.replace(alt, neu, 1)

    # Vorladen der Schriften zeigt sonst auf Dateien, die es in der einen Datei nicht gibt
    html = re.sub(r'<link rel="preload"[^>]*>\n?', '', html)
    html = html.replace('<body>', '<body data-vorschau="1">', 1)

    io.open(ZIEL, 'w', encoding='utf-8').write(html)
    print('geschrieben: %s (%.1f MB)' % (ZIEL, os.path.getsize(ZIEL) / 1048576))


if __name__ == '__main__':
    sys.exit(main())
