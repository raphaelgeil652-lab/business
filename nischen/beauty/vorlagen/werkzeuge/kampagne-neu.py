#!/usr/bin/env python3
"""Neue Kampagne für ein Studio: jederzeit, so oft ihr wollt, mit eigenem Thema und eigenen Anzeigen.

Aufruf (aus dem Repo-Hauptordner):
    python3 nischen/beauty/vorlagen/werkzeuge/kampagne-neu.py <kürzel> <kampagne.json>

kampagne.json (schreibt Claude aus eurem Wunsch, z. B. „Neue Kampagne für kate-cosmetics: Wimpern-Winteraktion“):
    {"name": "Wimpern Winter", "ziel": "Wimpernverlängerung im Winter", "budget": 300, "zielgruppe": "25 bis 50",
     "anzeigen": [{"kicker": "...", "h1": "... <em>...</em>", "sub": "...", "fine": "...", "cta": "Termin online wählen",
                   "primaer": "...", "headline": "...", "beschreibung": "...", "foto": "foto-1",
                   "leistung": "Gelnägel"}, ...]}
„leistung“ (optional): Die Anzeige führt auf die Terminseite, auf der genau diese Leistung schon ausgewählt ist.
Platzhalter wie {{betrieb}}, {{ort}}, {{angebot}} gehen. Texte immer nach dem GRUNDBAUSTEIN VERKAUF in module.py schreiben.
„foto“: foto-1 … foto-8 (fehlt eines, nimmt die Anzeige foto-1/2/3). Das Studio muss schon gebaut sein (kunde-anlegen.py).

Schreibt nach nischen/beauty/kunden/<kürzel>/kampagnen/<name>/:
    kampagne.html  Kampagnen-Assistent nur für diese Kampagne (Häkchen, Knöpfe „Kopieren“)
    creatives/     Anzeigen-Bilder zum Hochladen · vorschau.html zum Ansehen · anzeigen.html (Vorlage der Bilder)
Prüft die Texte gegen die Werberegeln des Studios (z. B. kein „kostenlos“ bei Ärzten, nie „Botox“).
Die Terminseite bleibt dieselbe; die Anzeigen tragen eigene URL-Parameter, damit der Monatsreport sie trennt.
"""
import importlib.util
import json
import pathlib
import re
import subprocess
import sys

HIER = pathlib.Path(__file__).resolve().parent
_spec = importlib.util.spec_from_file_location("ka", HIER / "kunde-anlegen.py")
KA = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(KA)
sys.path.insert(0, str(HIER))
import kampagnen_assistent  # noqa: E402

VERBOTEN_IMMER = [r"\bbotox\b", r"botulinum", r"garantiert", r"schmerzfrei", r"100\s*%"]
VERBOTEN_OHNE = {"kostenlos": [r"kostenlos", r"gratis", r"umsonst"], "rabatt": [r"rabatt", r"\d+\s*%\s*(rabatt|günstiger|sparen)", r"gutschein"],
                 "verlosung": [r"verlos", r"gewinn"], "vorher_nachher": [r"vorher.{0,10}nachher"]}


def pruefen(texte, regeln):
    funde = []
    alles = " ".join(texte).lower()
    for m in VERBOTEN_IMMER:
        if re.search(m, alles):
            funde.append(m.strip("\\b"))
    for regel, muster in VERBOTEN_OHNE.items():
        if not regeln.get(regel, True):
            funde += [m for m in muster if re.search(m, alles)]
    return funde


def main():
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    kz, quelle = sys.argv[1], pathlib.Path(sys.argv[2])
    ordner = KA.KUNDEN / kz
    if not (ordner / "daten.json").exists():
        sys.exit(f"✗ {kz} ist noch nicht gebaut. Erst kunde-anlegen.py.")
    k = json.loads(quelle.read_text(encoding="utf-8"))
    name = str(k.get("name") or "").strip()
    if not name or not k.get("anzeigen"):
        sys.exit("✗ In kampagne.json fehlen „name“ oder „anzeigen“.")
    d = json.loads((ordner / "daten.json").read_text(encoding="utf-8"))
    f, mod, _ = KA.felder(d)
    slug = KA.slug(name)
    anzeigen = []
    for i, a in enumerate(k["anzeigen"], 1):
        a = {"stil": "abcde"[(i - 1) % 5], "foto": "foto-%d" % ((i - 1) % 3 + 1), "cta": "Termin online wählen", "fine": "", "kicker": "", "sub": "", **a}
        a["id"] = f"{slug[:12].rstrip('-')}-{i}"
        anzeigen.append(a)
    texte = [KA.fuellen(str(a.get(x, "")), f) for a in anzeigen for x in ("kicker", "h1", "sub", "fine", "primaer", "headline", "beschreibung")]
    funde = pruefen(texte, mod["regeln"])
    if funde:
        sys.exit("✗ Diese Wörter sind für dieses Studio in der Werbung nicht erlaubt: " + ", ".join(sorted(set(funde))) + ". Texte ändern.")
    ziel = ordner / "kampagnen" / slug
    ziel.mkdir(parents=True, exist_ok=True)
    (ziel / "kampagne.json").write_text(json.dumps(k, ensure_ascii=False, indent=1), encoding="utf-8")
    f = {**f, "kampagne_kuerzel": slug}
    mod_k = {**mod, "anzeigen": anzeigen}
    fotos_da = {nm: bool(list((ordner / "fotos").glob(nm + ".*"))) for nm in KA.FOTO_NAMEN}
    anz_html, vorschau_html, alle = KA.anzeigen_html({**f, "_preis": True, "_beratung": True, "_fotos_da": fotos_da}, mod_k)
    KA.kopiere_ordner(KA.VORLAGEN / "assets" / "fonts", ziel / "fonts")
    KA.fotos_fuer_web(ordner / "fotos", ziel / "fotos")
    af = {**f, "anzeigen_html": anz_html, "vorschau_html": vorschau_html, "regel_hinweis": mod["recht_kurz"]}
    (ziel / "anzeigen.html").write_text(KA.fuellen((KA.VORLAGEN / "anzeigen" / "anzeigen.html").read_text(encoding="utf-8"), af), encoding="utf-8")
    (ziel / "vorschau.html").write_text(KA.fuellen((KA.VORLAGEN / "anzeigen" / "vorschau.html").read_text(encoding="utf-8"), af)
                                        .replace("../seite/termin.html", f["landingpage_url"] + "/termin.html"), encoding="utf-8")
    try:
        subprocess.run(["node", str(HIER / "creatives-rendern.js"), str(ziel / "anzeigen.html")], check=True, capture_output=True, text=True)
    except Exception as e:
        print("! Bilder nicht gerendert:", e)
    budget = int(k.get("budget") or 0)
    md = f"""# Neue Kampagne „{name}“ · {f['betrieb']}

> {k.get('ziel') or ''}
> Läuft **zusätzlich** zu den bestehenden Kampagnen. Die Terminseite bleibt dieselbe. Pixel und Datensatz sind schon eingerichtet.

## Meta-Kampagne anlegen

adsmanager.facebook.com → **Werbekonto des Studios** → **„+ Erstellen“**.

| Feld | Eintrag |
|---|---|
| Kampagnenziel | **Leads** → Weiter |
| Name der Kampagne | `{f['betrieb']} – {name}` |
| Budgetstrategie | **Kampagnenbudget** |
| Tagesbudget | **{KA.euro(round(budget / 30)) if budget else 'wie besprochen'}**{f' (= {KA.euro(budget)} im Monat ÷ 30)' if budget else ''} |
| Conversion-Ort | **Website** |
| Performance-Ziel | **Anzahl der Leads maximieren** |
| Datensatz | **{f['betrieb']}** · Conversion-Event **Lead** |
| Standorte | `{f['ort']}` → Umkreis **{f['umkreis_km']} km** |
| Mindestalter | **18**{(' · Vorschlag ' + k['zielgruppe']) if k.get('zielgruppe') else ''} |

Je Anzeige: „Image Ad“ → Bild hochladen → Quell-URL und URL-Parameter → Texte kopieren → Button **„Jetzt buchen“** →
Optimierungen aus. Am Ende **nicht veröffentlichen**, erst nach Freigabe durch das Studio.

{KA.meta_md(f, alle)}
"""
    (ziel / "kampagne.md").write_text(md, encoding="utf-8")
    (ziel / "kampagne.html").write_text(kampagnen_assistent.bauen(md, f"{f['betrieb']} · {name}", f"{kz}-{slug}"), encoding="utf-8")
    print(f"✓ Neue Kampagne „{name}“ für {f['betrieb']}: {ziel.relative_to(KA.BEAUTY.parent.parent)} ({len(alle)} Anzeigen)")


if __name__ == "__main__":
    main()
