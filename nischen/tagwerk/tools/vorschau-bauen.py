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

    # alles, was im Skript als Pfad steht: Film in beiden Fassungen und das Standbild
    for rel in ('assets/hero-scrub.mp4', 'assets/hero-scrub.webm', 'assets/hero-poster.jpg'):
        html = html.replace("'%s'" % rel, "'%s'" % datei_als_uri(rel))

    # Schriften-Vorladen zeigt sonst auf Dateien, die es in der einen Datei nicht gibt
    html = re.sub(r'<link rel="preload"[^>]*>\n?', '', html)

    # ein ehrlicher Hinweis oben, damit niemand die Vorschau mit der echten Seite verwechselt
    html = html.replace('<body>', '<body data-vorschau="1">', 1)

    io.open(ZIEL, 'w', encoding='utf-8').write(html)
    print('geschrieben: %s (%.1f MB)' % (ZIEL, os.path.getsize(ZIEL) / 1048576))


if __name__ == '__main__':
    sys.exit(main())
