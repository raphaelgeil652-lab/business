"""Holt dunkle, lizenzfreie Bilder für die Webseite -> assets/fotos/

Quelle ist Openverse, gefiltert auf **CC0 / Public Domain**. Diese Lizenzen erlauben
kommerzielle Nutzung ohne Namensnennung — anders als Fotos von Yelp, golocal oder
RestaurantGuru, die urheberrechtlich geschützt sind und abgemahnt werden können.

Die Bilder sind ausdrücklich **Übergangsmaterial**: echte Fotos aus dem Restaurant
wirken deutlich stärker und sollten sie ersetzen, sobald Fam. Mau welche liefert.

Aufruf:  python3 bilder-holen.py
"""
import io
import json
import os
import urllib.parse
import urllib.request

from PIL import Image, ImageEnhance

HERE = os.path.dirname(os.path.abspath(__file__))
ZIEL = f"{os.path.dirname(HERE)}/assets/fotos"
os.makedirs(ZIEL, exist_ok=True)

UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120.0 Safari/537.36"
API = "https://api.openverse.org/v1/images/"

# Name, Suchbegriffe, Stichwörter im Titel, Zielbreite, Seitenverhältnis (Breite/Höhe)
#
# Der Stichwort-Filter ist wichtig: ohne ihn liefert die Suche zwar dunkle, aber
# thematisch falsche Bilder (Kürbisse statt Teigtaschen, Neonschild statt Eingang).
SLOTS = [
    ("gastraum",      ["restaurant interior", "chinese restaurant", "restaurant dining room"],
     ["restaurant", "dining", "interior", "bistro", "brasserie"],                 1800, 16 / 9),
    ("buffet",        ["chinese food buffet", "buffet food", "chinese banquet"],
     ["buffet", "banquet", "food", "dish", "spread"],                             1200, 4 / 3),
    ("kueche",        ["wok cooking", "stir fry wok", "chinese kitchen"],
     ["wok", "stir", "fry", "kitchen", "cook", "noodle", "rice"],                  900, 3 / 4),
    ("ente",          ["peking duck", "roast duck", "crispy duck"],
     ["duck", "ente"],                                                            1000, 4 / 3),
    ("gastraum2",     ["restaurant table", "restaurant dining table", "restaurant interior"],
     ["restaurant", "dining", "table", "interior"],                               1000, 4 / 3),
    ("buffet-detail", ["dumplings", "dim sum", "spring roll"],
     ["dumpling", "dim sum", "roll", "jiaozi", "bao", "wonton"],                   1000, 4 / 3),
    ("wok",           ["stir fry vegetables", "wok noodles", "fried noodles"],
     ["wok", "stir", "fry", "noodle", "vegetable"],                                1000, 4 / 3),
    ("tisch",         ["chopsticks", "table setting restaurant", "chinese tea table"],
     ["chopstick", "table", "setting", "plate", "tea", "bowl"],                    1000, 4 / 3),
    ("aussen",        ["restaurant facade", "restaurant exterior", "chinatown street night"],
     ["facade", "exterior", "entrance", "front", "street", "shop", "chinatown"],   1000, 4 / 3),
]


def hole(url, timeout=45):
    return urllib.request.urlopen(
        urllib.request.Request(url, headers={"User-Agent": UA}), timeout=timeout).read()


def kandidaten(begriff, anzahl=12):
    url = (API + "?q=" + urllib.parse.quote(begriff)
           + "&license=cc0,pdm&page_size=" + str(anzahl))
    try:
        return json.loads(hole(url, 30)).get("results", [])
    except Exception as e:
        print(f"    Suche fehlgeschlagen ({begriff}): {e}")
        return []


def zuschneiden(im, verhaeltnis, breite):
    """Mittig auf das Zielverhältnis beschneiden, dann auf Zielbreite bringen."""
    b, h = im.size
    ist = b / h
    if ist > verhaeltnis:
        neu_b = int(h * verhaeltnis)
        links = (b - neu_b) // 2
        im = im.crop((links, 0, links + neu_b, h))
    else:
        neu_h = int(b / verhaeltnis)
        oben = int((h - neu_h) * 0.4)          # etwas oberhalb der Mitte wirkt natürlicher
        im = im.crop((0, oben, b, oben + neu_h))
    return im.resize((breite, int(breite / verhaeltnis)), Image.LANCZOS)


def abdunkeln(im):
    """An die dunkle, warme Bildwelt der Seite angleichen."""
    im = ImageEnhance.Brightness(im).enhance(0.72)
    im = ImageEnhance.Contrast(im).enhance(1.10)
    im = ImageEnhance.Color(im).enhance(0.92)
    r, g, b = im.split()
    r = r.point(lambda v: min(255, int(v * 1.06)))   # warmer Stich
    b = b.point(lambda v: int(v * 0.94))
    return Image.merge("RGB", (r, g, b))


def helligkeit(im):
    kl = im.convert("L").resize((64, 64))
    return sum(kl.getdata()) / (64 * 64)


def main():
    nachweise = []
    for name, begriffe, stichworte, breite, verhaeltnis in SLOTS:
        print(f"{name}:")
        treffer = []
        for begriff in begriffe:
            for r in kandidaten(begriff):
                if (r.get("width") or 0) < 900:
                    continue
                titel = (r.get("title") or "").lower()
                # Motiv muss zum Slot passen - sonst landen Kürbisse in der Buffet-Kachel
                if not any(w in titel for w in stichworte):
                    continue
                try:
                    im = Image.open(io.BytesIO(hole(r["url"]))).convert("RGB")
                except Exception:
                    continue
                if min(im.size) < 500:
                    continue
                treffer.append((helligkeit(im), im, r, begriff))
            if len(treffer) >= 5:
                break
        if not treffer:
            print("    kein passendes Bild gefunden")
            continue
        # unter den passenden das dunkelste nehmen, aber nichts fast Schwarzes
        treffer.sort(key=lambda t: t[0])
        brauchbar = [t for t in treffer if t[0] > 25] or treffer
        bestes = brauchbar[0]

        hell, im, r, begriff = bestes
        fertig = abdunkeln(zuschneiden(im, verhaeltnis, breite))
        pfad = f"{ZIEL}/{name}.webp"
        fertig.save(pfad, "WEBP", quality=82, method=6)
        klein = fertig.resize((fertig.width // 2, fertig.height // 2), Image.LANCZOS)
        klein.save(f"{ZIEL}/{name}-klein.webp", "WEBP", quality=80, method=6)
        kb = os.path.getsize(pfad) / 1024
        print(f"    {fertig.size[0]}x{fertig.size[1]}  {kb:.0f} KB  Helligkeit {hell:.0f}  «{begriff}»")
        nachweise.append({
            "datei": f"{name}.webp", "titel": r.get("title"),
            "lizenz": f'{r.get("license")} {r.get("license_version") or ""}'.strip(),
            "urheber": r.get("creator"), "quelle": r.get("foreign_landing_url"),
        })

    with open(f"{ZIEL}/BILDNACHWEIS.json", "w", encoding="utf-8") as fh:
        json.dump(nachweise, fh, ensure_ascii=False, indent=2)
    print(f"\n{len(nachweise)} Bilder + Nachweis in {ZIEL}")


if __name__ == "__main__":
    main()
