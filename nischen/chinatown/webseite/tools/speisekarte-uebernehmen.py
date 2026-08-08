"""Überträgt die Speisekarte aus dem gedruckten Faltflyer in speisekarte.html.

Der Flyer ist die einzige Quelle für Gerichte und Preise. Dieses Skript liest ihn
aus und schreibt den Kartenteil zwischen die Marker in speisekarte.html. Dadurch
können Druck und Webseite nicht auseinanderlaufen.

Aufruf:  python3 speisekarte-uebernehmen.py
"""
import html
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
WEB = os.path.dirname(HERE)
KUNDE = os.path.dirname(WEB)
# Der Flyer liegt daneben und ist die Quelle für Gerichte und Preise.
FLYER = f"{KUNDE}/flyer/faltflyer.html"
ZIEL = f"{WEB}/speisekarte.html"

START = "<!-- KARTE:START -->"
ENDE = "<!-- KARTE:ENDE -->"

# Kategorie -> Anker und Beschreibung für die Webseite
ZUSATZ = {
    "Vorspeisen": ("vorspeisen", "Suppen, Rollen und Salate zum Anfangen."),
    "Vegetarisch": ("vegetarisch", "Alle Gerichte ohne Fleisch und ohne Fisch."),
    "Fleischgerichte": ("fleisch", "Schwein, Rind und Huhn — frisch im Wok gebraten."),
    "Enten-Gerichte": ("ente", "Unsere Spezialität: knusprig gebraten."),
    "Fisch & Meeresfr.": ("fisch", "Garnelen, Muscheln, Fischfilet und Calamaris."),
    "Reisgerichte": ("reis", ""),
    "Nudelgerichte": ("nudeln", ""),
    "Nachtisch": ("nachtisch", ""),
    "Mittagskarte": ("mittag",
                     "Dienstag bis Samstag bis 14:30 Uhr, inklusive Pekingsuppe oder "
                     "Gemüserollen. Außer an Sonn- und Feiertagen."),
}

# In dieser Reihenfolge erscheinen die Gruppen auf der Webseite
REIHENFOLGE = ["Vorspeisen", "Vegetarisch", "Fleischgerichte", "Enten-Gerichte",
               "Fisch & Meeresfr.", "Reisgerichte", "Nudelgerichte", "Nachtisch",
               "Mittagskarte"]

MUSTER = re.compile(
    r'<span class="t brush">(?P<kat>[^<]+)</span>.*?<span class="z zh">(?P<katzh>[^<]+)</span>'
    r'|<div class="sub-h brush">(?P<sub>[^<]+?)\s*<span'
    r'|<span class="num">(?P<nr>M?\d+)</span><span class="n">(?P<name>.*?)</span>'
    r'.*?<span class="p">(?P<preis>[\d,]+)</span>',
    re.S)


def lies_flyer():
    quelle = open(FLYER, encoding="utf-8").read()
    gruppen, aktuell = {}, None
    # Gerichte vor der ersten Kategorie sind die Mittagsmenüs (M1–M18)
    gruppen["Mittagskarte"] = {"zh": "午市", "posten": []}

    for m in MUSTER.finditer(quelle):
        if m.group("kat"):
            kat = html.unescape(m.group("kat")).strip()
            aktuell = kat
            gruppen.setdefault(kat, {"zh": m.group("katzh").strip(), "posten": []})
        elif m.group("sub"):
            if aktuell:
                gruppen[aktuell]["posten"].append(("sub", m.group("sub").strip()))
        elif m.group("nr"):
            nr = m.group("nr")
            ziel = "Mittagskarte" if nr.startswith("M") else aktuell
            if ziel is None:
                continue
            gruppen[ziel]["posten"].append(
                ("gericht", nr, m.group("name").strip(), m.group("preis")))
    return gruppen


def baue_html(gruppen):
    teile = []
    for kat in REIHENFOLGE:
        if kat not in gruppen:
            print(f"  ! Gruppe fehlt im Flyer: {kat}")
            continue
        g = gruppen[kat]
        anker, beschreibung = ZUSATZ.get(kat, (kat.lower(), ""))
        teile.append(f'      <section class="menu__gruppe reveal" id="{anker}">')
        teile.append('        <div class="menu__kopf">')
        teile.append(f'          <h2 class="h3">{html.escape(kat)}</h2>')
        teile.append('          <span class="rule"></span>')
        teile.append(f'          <span class="zh">{g["zh"]}</span>')
        teile.append('        </div>')
        if beschreibung:
            teile.append(f'        <p class="lede" style="margin-bottom:1rem">{beschreibung}</p>')
        teile.append('        <div class="menu__spalten">')
        for p in g["posten"]:
            if p[0] == "sub":
                teile.append(f'          <h3 class="menu__sub">{html.escape(p[1])}</h3>')
            else:
                _, nr, name, preis = p
                teile.append(
                    '          <p class="dish">'
                    f'<span class="dish__nr">{nr}</span>'
                    f'<span class="dish__name">{name}</span>'
                    f'<span class="dish__preis">{preis}&nbsp;€</span></p>')
        teile.append('        </div>')
        teile.append('      </section>')
    return "\n".join(teile)


def main():
    gruppen = lies_flyer()
    gerichte = sum(1 for g in gruppen.values() for p in g["posten"] if p[0] == "gericht")
    mittag = len([p for p in gruppen["Mittagskarte"]["posten"] if p[0] == "gericht"])
    print(f"Aus dem Flyer gelesen: {gerichte - mittag} Gerichte + {mittag} Mittagsmenüs "
          f"in {len(gruppen)} Gruppen")
    if gerichte - mittag != 69 or mittag != 18:
        raise SystemExit("Unerwartete Anzahl - bitte den Flyer prüfen, es wurde nichts geschrieben.")

    seite = open(ZIEL, encoding="utf-8").read()
    if START not in seite or ENDE not in seite:
        raise SystemExit(f"Marker {START} / {ENDE} fehlen in speisekarte.html")
    vorher, rest = seite.split(START, 1)
    _, nachher = rest.split(ENDE, 1)
    open(ZIEL, "w", encoding="utf-8").write(
        vorher + START + "\n" + baue_html(gruppen) + "\n" + ENDE + nachher)
    print(f"geschrieben: {ZIEL}")


if __name__ == "__main__":
    main()
