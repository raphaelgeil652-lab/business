#!/usr/bin/env python3
"""Baut aus der fertigen Seite eine einzige Datei zum Anschauen.

Alles wird eingebettet: Film, Bilder, Schriften. Die Datei liegt in vorschau/ und damit
ausserhalb des Deploy-Ordners, sie geht nie mit online. Zum Ausliefern zaehlt
allein nischen/tagwerk/seite/.

Aufruf:  python3 vorschau-bauen.py
"""
import base64, io, os, re, sys

HIER = os.path.dirname(os.path.abspath(__file__))
SEITE = os.path.join(HIER, '..', 'seite')
ZIEL = os.path.join(HIER, '..', 'vorschau', 'tagwerk-komplett.html')

TYPEN = {'.jpg': 'image/jpeg', '.png': 'image/png', '.mp4': 'video/mp4',
         '.webm': 'video/webm', '.woff2': 'font/woff2'}


def datei_als_uri(rel):
    pfad = os.path.join(SEITE, rel)
    typ = TYPEN[os.path.splitext(rel)[1].lower()]
    with open(pfad, 'rb') as f:
        return 'data:%s;base64,%s' % (typ, base64.b64encode(f.read()).decode('ascii'))


def main():
    html = io.open(os.path.join(SEITE, 'index.html'), encoding='utf-8').read()

    # jedes url('assets/...') durch die eingebettete Datei ersetzen
    for rel in sorted(set(re.findall(r"url\('(assets/[^']+)'\)", html))):
        html = html.replace("url('%s')" % rel, "url('%s')" % datei_als_uri(rel))

    # die Bildfolge des Heros: alle Einzelbilder wandern in eine Liste im Skript
    anzahl = len([n for n in os.listdir(os.path.join(SEITE, 'assets', 'frames')) if n.endswith('.jpg')])
    liste = ','.join("'%s'" % datei_als_uri('assets/frames/f%04d.jpg' % (i + 1)) for i in range(anzahl))
    alt = ("  function frameURL(i){ var n = String(i+1); while (n.length < 4) n = '0' + n; "
           "return 'assets/frames/f' + n + '.jpg'; }")
    neu = "  var __F=[%s];\n  function frameURL(i){ return __F[i]; }" % liste
    assert alt in html, 'frameURL nicht gefunden, Vorschau waere ohne Bilder'
    html = html.replace(alt, neu, 1)

    # Schriften-Vorladen zeigt sonst auf Dateien, die es in der einen Datei nicht gibt
    html = re.sub(r'<link rel="preload"[^>]*>\n?', '', html)

    # ein ehrlicher Hinweis oben, damit niemand die Vorschau mit der echten Seite verwechselt
    html = html.replace('<body>', '<body data-vorschau="1">', 1)

    io.open(ZIEL, 'w', encoding='utf-8').write(html)
    print('geschrieben: %s (%.1f MB)' % (ZIEL, os.path.getsize(ZIEL) / 1048576))


if __name__ == '__main__':
    sys.exit(main())
