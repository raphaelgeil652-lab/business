"""Schritt 3: Schriften als Subset von Google Fonts holen -> assets/fonts/

  * Ma Shan Zheng  = Pinselkalligrafie -> Wortmarke + ALLE Überschriften
  * Noto Serif SC  = chinesische Zeichen (der System-Font WenQuanYi sieht billig aus)

Es wird nur die tatsächlich benötigte Zeichenmenge geladen (Parameter `text=`),
darum sind die Dateien wenige KB statt mehrere MB.
"""
import os
import re
import urllib.parse
import urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = f"{os.path.dirname(HERE)}/fonts"
os.makedirs(OUT, exist_ok=True)

UA = ("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) "
      "Chrome/120.0.0.0 Safari/537.36")

LATIN = ("ABCDEFGHIJKLMNOPQRSTUVWXYZ"
         "abcdefghijklmnopqrstuvwxyz"
         "ÄÖÜäöüßÀàÉé"
         "0123456789"
         " .,;:!?·&-–—_/()[]'’\"€%+*×@#°")

# Jedes hier fehlende Zeichen fällt im Flyer auf einen Ersatzfont zurück.
# Nach Änderungen am HTML mit check-glyphs.py gegenprüfen.
CJK = ("旺城酒楼餐厅中国"
       "前菜素食甜点肉类鸭海鲜米饭面条汤点心"
       "午市自助餐招牌特色美味新鲜风味正宗厨房家常菜"
       "猪牛鸡虾鱼炒春卷饺子"
       "欢迎光临营业时间电话地址"
       "福喜龙财运宝吉利年有余双临门")

FAMILIES = [("MaShanZheng", "Ma Shan Zheng"), ("NotoSerifSC", "Noto Serif SC")]
TEXT = "".join(sorted(set(LATIN + CJK)))


def fetch(url):
    return urllib.request.urlopen(
        urllib.request.Request(url, headers={"User-Agent": UA}), timeout=90).read()


def main():
    for slug, family in FAMILIES:
        css_url = ("https://fonts.googleapis.com/css2?family="
                   + urllib.parse.quote(family.replace(" ", "+"), safe="+")
                   + "&text=" + urllib.parse.quote(TEXT))
        css = fetch(css_url).decode()
        urls = re.findall(r"url\((https://[^)]+)\)", css)
        if not urls:
            raise SystemExit(f"Keine Font-URL für {family} erhalten")
        data = fetch(urls[0])
        ext = "woff2" if "woff2" in urls[0] else "ttf"
        path = f"{OUT}/{slug}.{ext}"
        with open(path, "wb") as fh:
            fh.write(data)
        print(f"{family:16s} {len(data) / 1024:6.1f} KB -> fonts/{os.path.basename(path)}")
    print(f"Zeichenvorrat: {len(TEXT)} Glyphen")


# Nur beim direkten Aufruf laden - check-glyphs.py importiert nur den Zeichenvorrat.
if __name__ == "__main__":
    main()
