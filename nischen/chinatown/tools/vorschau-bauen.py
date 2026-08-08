"""Baut selbstenthaltende Vorschau-Dateien -> nischen/chinatown/vorschau/

Warum: Die Öffnen-Links im README laufen über htmlpreview.github.io. Dort werden
nur die HTML-Dateien selbst geladen — Stylesheet, Schriften und Bilder, die
relativ verlinkt sind, fehlen dann. Ergebnis wäre eine unformatierte Seite.

Deshalb wird hier alles in **eine Datei** gepackt: CSS, JavaScript, Schriften und
Bilder als Data-URI. Die Vorschau funktioniert dadurch überall — auch offline,
z. B. in der Safari-Leseliste auf dem iPad beim Kundenbesuch.

Aufruf:  python3 vorschau-bauen.py
"""
import base64
import io
import os
import re

from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
KUNDE = os.path.dirname(HERE)
WEB = f"{KUNDE}/webseite"
FLYER = f"{KUNDE}/flyer"
ZIEL = f"{KUNDE}/vorschau"
os.makedirs(ZIEL, exist_ok=True)

ROH = ("https://htmlpreview.github.io/?https://raw.githubusercontent.com/"
       "raphaelgeil652-lab/business/main/nischen/chinatown/vorschau/")

SEITEN = ["index", "speisekarte", "kontakt", "impressum", "datenschutz"]
MIME = {".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg", ".svg": "image/svg+xml", ".ttf": "font/ttf"}


def daten_uri(pfad, max_breite=1400):
    """Datei als Data-URI. Rasterbilder werden fürs Web verkleinert."""
    endung = os.path.splitext(pfad)[1].lower()
    typ = MIME.get(endung, "application/octet-stream")
    roh = open(pfad, "rb").read()
    if endung in (".png", ".jpg", ".jpeg", ".webp"):
        im = Image.open(io.BytesIO(roh))
        if im.width > max_breite:
            im = im.resize((max_breite, round(im.height * max_breite / im.width)),
                           Image.LANCZOS)
        puffer = io.BytesIO()
        im.save(puffer, "WEBP", quality=82, method=6)
        roh, typ = puffer.getvalue(), "image/webp"
    return f"data:{typ};base64," + base64.b64encode(roh).decode()


def css_einbetten(css_pfad):
    css = open(css_pfad, encoding="utf-8").read()
    basis = os.path.dirname(css_pfad)

    def ersetze(m):
        rel = m.group(1).strip("'\"")
        if rel.startswith(("data:", "http")):
            return m.group(0)
        pfad = os.path.normpath(os.path.join(basis, rel))
        return f'url("{daten_uri(pfad)}")' if os.path.exists(pfad) else m.group(0)

    return re.sub(r'url\(([^)]+)\)', ersetze, css)


def baue(quelle, ziel_name, linkziele=None):
    basis = os.path.dirname(quelle)
    s = open(quelle, encoding="utf-8").read()

    # Stylesheet einbetten
    def css_tag(m):
        pfad = os.path.normpath(os.path.join(basis, m.group(1)))
        return f"<style>\n{css_einbetten(pfad)}\n</style>" if os.path.exists(pfad) else m.group(0)
    s = re.sub(r'<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"[^>]*>', css_tag, s)

    # JavaScript einbetten
    def js_tag(m):
        pfad = os.path.normpath(os.path.join(basis, m.group(1)))
        if not os.path.exists(pfad):
            return m.group(0)
        return "<script>\n" + open(pfad, encoding="utf-8").read() + "\n</script>"
    s = re.sub(r'<script[^>]+src="([^"]+)"[^>]*></script>', js_tag, s)

    # url() in direkt eingebetteten <style>-Blöcken auflösen. Der Flyer hält sein
    # CSS inline, seine Schriften würden sonst als externe Anfragen fehlschlagen.
    def style_block(m):
        inhalt = m.group(1)

        def ersetze(u):
            rel = u.group(1).strip("'\"")
            if rel.startswith(("data:", "http")):
                return u.group(0)
            pfad = os.path.normpath(os.path.join(basis, rel))
            return f'url("{daten_uri(pfad)}")' if os.path.exists(pfad) else u.group(0)

        return "<style>" + re.sub(r'url\(([^)]+)\)', ersetze, inhalt) + "</style>"
    s = re.sub(r'<style>(.*?)</style>', style_block, s, flags=re.S)

    # srcset entfernen - im Einzeldatei-Modus zählt nur die eine eingebettete Fassung
    s = re.sub(r'\s+srcset="[^"]*"', "", s)
    s = re.sub(r'\s+sizes="[^"]*"', "", s)

    # Bilder einbetten
    def bild(m):
        rel = m.group(1)
        if rel.startswith(("data:", "http")):
            return m.group(0)
        pfad = os.path.normpath(os.path.join(basis, rel))
        return f'src="{daten_uri(pfad)}"' if os.path.exists(pfad) else m.group(0)
    s = re.sub(r'src="([^"]+)"', bild, s)

    # Verweise zwischen den Seiten auf die Vorschau-Adressen umbiegen
    for ziel, adresse in (linkziele or {}).items():
        s = s.replace(f'href="{ziel}"', f'href="{adresse}"')

    pfad = f"{ZIEL}/{ziel_name}"
    open(pfad, "w", encoding="utf-8").write(s)
    print(f"  {ziel_name:34s} {os.path.getsize(pfad)/1024:6.0f} KB")
    return pfad


def main():
    linkziele = {f"{n}.html": f"{ROH}webseite-{n}.html" for n in SEITEN}

    print("Webseite:")
    for n in SEITEN:
        baue(f"{WEB}/{n}.html", f"webseite-{n}.html", linkziele)

    print("Flyer:")
    baue(f"{FLYER}/faltflyer.html", "flyer-faltflyer.html")

    print(f"\nfertig -> {ZIEL}")


if __name__ == "__main__":
    main()
