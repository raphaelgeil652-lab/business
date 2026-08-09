"""Baut zwei Dateien zum Zeigen -> nischen/chinatown/vorschau/

  webseite-komplett.html   die ganze Webseite in EINER Datei
  flyer-komplett.html      der ganze Faltflyer in EINER Datei

Warum eine Datei statt fünf:
  * Die Öffnen-Links laufen über htmlpreview.github.io. Dort wird nur die eine
    aufgerufene HTML-Datei geladen — Stylesheet, Schriften und Bilder, die relativ
    verlinkt sind, fehlen. Deshalb wird hier **alles** als Data-URI eingebettet.
  * Verweise auf andere Dateien funktionieren in der Vorschau nicht (man landet auf
    der htmlpreview-Startseite mit dem Eingabefeld). Deshalb werden alle Unterseiten
    in ein Dokument gehängt; die Navigation schaltet dort zwischen Tabs um,
    sodass immer nur ein Bereich sichtbar ist.

Nebeneffekt: beide Dateien laufen ohne Internet — z. B. in der Safari-Leseliste
auf dem iPad beim Kundenbesuch.

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

# Reihenfolge im Gesamtdokument + Sprungmarke je Seite
SEITEN = [("index", "start"), ("speisekarte", "speisekarte"), ("kontakt", "kontakt"),
          ("impressum", "impressum"), ("datenschutz", "datenschutz")]

MIME = {".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg", ".svg": "image/svg+xml", ".ttf": "font/ttf"}


def daten_uri(pfad, max_breite=1400):
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


def urls_aufloesen(text, basis):
    """Relative url(...) in CSS durch eingebettete Daten ersetzen."""
    def ersetze(m):
        rel = m.group(1).strip("'\"")
        if rel.startswith(("data:", "http")):
            return m.group(0)
        pfad = os.path.normpath(os.path.join(basis, rel))
        return f'url("{daten_uri(pfad)}")' if os.path.exists(pfad) else m.group(0)
    return re.sub(r'url\(([^)]+)\)', ersetze, text)


def alles_einbetten(s, basis):
    """CSS, JavaScript, Schriften und Bilder in das Dokument holen."""
    def css_tag(m):
        pfad = os.path.normpath(os.path.join(basis, m.group(1)))
        if not os.path.exists(pfad):
            return m.group(0)
        css = open(pfad, encoding="utf-8").read()
        return "<style>\n" + urls_aufloesen(css, os.path.dirname(pfad)) + "\n</style>"
    s = re.sub(r'<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"[^>]*>', css_tag, s)

    def js_tag(m):
        pfad = os.path.normpath(os.path.join(basis, m.group(1)))
        if not os.path.exists(pfad):
            return m.group(0)
        return "<script>\n" + open(pfad, encoding="utf-8").read() + "\n</script>"
    s = re.sub(r'<script[^>]+src="([^"]+)"[^>]*></script>', js_tag, s)

    # Der Flyer hält sein CSS direkt im Dokument - dort ebenfalls auflösen
    s = re.sub(r'<style>(.*?)</style>',
               lambda m: "<style>" + urls_aufloesen(m.group(1), basis) + "</style>",
               s, flags=re.S)

    s = re.sub(r'\s+srcset="[^"]*"', "", s)
    s = re.sub(r'\s+sizes="[^"]*"', "", s)

    def bild(m):
        rel = m.group(1)
        if rel.startswith(("data:", "http")):
            return m.group(0)
        pfad = os.path.normpath(os.path.join(basis, rel))
        return f'src="{daten_uri(pfad)}"' if os.path.exists(pfad) else m.group(0)
    return re.sub(r'src="([^"]+)"', bild, s)


def teil(s, tag):
    m = re.search(rf"<{tag}[^>]*>(.*?)</{tag}>", s, re.S)
    return m.group(1) if m else ""


def baue_webseite():
    roh = {n: open(f"{WEB}/{n}.html", encoding="utf-8").read() for n, _ in SEITEN}
    start = roh["index"]

    # Alle Seiteninhalte untereinander, jeder mit eigener Sprungmarke
    abschnitte = []
    for name, anker in SEITEN:
        abschnitte.append(
            f'<div id="{anker}" data-seite="{anker}">\n{teil(roh[name], "main")}\n</div>')
    haupt = "\n".join(abschnitte)

    kopf = teil(start, "head")
    fuss = re.search(r'(<footer class="footer">.*?</footer>)', start, re.S).group(1)
    leiste = re.search(r'(<header class="topbar">.*?</header>)', start, re.S).group(1)
    anrufleiste = re.search(r'(<div class="callbar">.*?</div>\s*</div>)', start, re.S)
    anrufleiste = anrufleiste.group(1) if anrufleiste else ""

    s = (f"<!doctype html>\n<html lang=\"de\">\n<head>{kopf}</head>\n<body>\n"
         f"{leiste}\n<main>\n{haupt}\n</main>\n{fuss}\n{anrufleiste}\n"
         f"<script src=\"script.js\"></script>\n</body>\n</html>\n")

    # Verweise auf andere Dateien werden zu Sprungmarken im selben Dokument
    for name, anker in SEITEN:
        s = s.replace(f'href="{name}.html#', f'href="#')
        s = s.replace(f'href="{name}.html"', f'href="#{anker}"')

    # In einem Dokument darf jede Kennung nur einmal vorkommen
    s = s.replace('id="hauptnav"', 'id="hauptnav"', 1)
    s = re.sub(r'id="jahr"', 'class="jahr"', s)

    s = alles_einbetten(s, WEB)
    pfad = f"{ZIEL}/webseite-komplett.html"
    open(pfad, "w", encoding="utf-8").write(s)
    print(f"  webseite-komplett.html   {os.path.getsize(pfad)/1024:6.0f} KB "
          f"({len(SEITEN)} Seiten in einer Datei)")


def baue_flyer():
    s = alles_einbetten(open(f"{FLYER}/faltflyer.html", encoding="utf-8").read(), FLYER)
    pfad = f"{ZIEL}/flyer-komplett.html"
    open(pfad, "w", encoding="utf-8").write(s)
    print(f"  flyer-komplett.html      {os.path.getsize(pfad)/1024:6.0f} KB")


def main():
    for alt in os.listdir(ZIEL):                    # alte Einzelseiten entfernen
        if alt.endswith(".html") and alt not in ("webseite-komplett.html",
                                                 "flyer-komplett.html"):
            os.remove(f"{ZIEL}/{alt}")
    baue_webseite()
    baue_flyer()
    print(f"\nfertig -> {ZIEL}")


if __name__ == "__main__":
    main()
