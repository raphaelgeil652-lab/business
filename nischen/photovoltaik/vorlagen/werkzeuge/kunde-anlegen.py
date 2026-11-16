#!/usr/bin/env python3
"""Legt aus einem ausgefüllten Steckbrief den kompletten Kundenordner an.

Aufruf (aus dem Repo-Hauptordner):
    python3 nischen/photovoltaik/vorlagen/werkzeuge/kunde-anlegen.py <steckbrief.xlsx>

Liest:     den Steckbrief + vorlagen/tabellen/00-agentur-stammdaten.xlsx
Schreibt:  nischen/photovoltaik/kunden/<betrieb>/
             README.md               Überblick, Links, nächste Schritte
             steckbrief.xlsx          Kopie des Steckbriefs (die Quelle für alles)
             fotos/                   HIER die echten Fotos des Kunden ablegen (1-modul.jpg, 2-rabatt.jpg, 3-speicher.jpg)
             dokumente/               Vereinbarung, Mails, Kampagnen, Teilnahmebedingungen …
             tabellen/                Onboarding + Anfragen-und-Report (werden nie überschrieben)
             anzeigen/                anzeigen.html, vorschau.html, creatives/*.png
             landingpage/             modul.html, rabatt.html, speicher.html, danke.html

Mehrfach ausführen ist ausdrücklich erlaubt: Nach jeder Änderung am Steckbrief oder an den
Fotos einfach neu laufen lassen. Erzeugte Dateien werden ersetzt, die Tabellen in tabellen/
und die Fotos in fotos/ bleiben unangetastet.
"""
import datetime as dt
import importlib.util
import json
import pathlib
import re
import shutil
import subprocess
import sys

from openpyxl import load_workbook

HIER = pathlib.Path(__file__).resolve().parent
VORLAGEN = HIER.parent
PV = VORLAGEN.parent
KUNDEN = PV / "kunden"

TEXTE_PRO_KUNDE = ["vereinbarung.md", "willkommens-mail.md", "rueckruf-leitfaden.md", "kampagnen.md",
                   "teilnahmebedingungen.md", "report-mail.md", "abrechnung-mails.md"]
MONATE = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September",
          "Oktober", "November", "Dezember"]
EURO = {"ticket_von", "ticket_bis", "ticket_schnitt", "onboarding_preis", "retainer", "budget_meta", "budget_google"}


def lese_schluessel(pfad):
    """Liest Spalte A (Schlüssel) → Spalte B (Feld) und C (Wert) aus dem ersten Blatt."""
    ws = load_workbook(pfad, data_only=True).worksheets[0]
    werte, namen = {}, {}
    for row in ws.iter_rows(min_row=6, max_col=3, values_only=True):
        key, feld, wert = row
        if not key or key == "§":
            continue
        namen[key] = feld
        if isinstance(wert, str):
            wert = wert.strip()
        werte[key] = wert if wert not in ("", None) else None
    return werte, namen


def euro(x):
    return f"{x:,.0f} €".replace(",", ".")


def datum(x):
    return x.strftime("%d.%m.%Y") if isinstance(x, (dt.date, dt.datetime)) else x


def datum_kurz(x):
    return f"{x.day}. {MONATE[x.month - 1]}" if isinstance(x, (dt.date, dt.datetime)) else x


def slug(text):
    t = text.lower()
    for a, b in (("ä", "ae"), ("ö", "oe"), ("ü", "ue"), ("ß", "ss")):
        t = t.replace(a, b)
    return re.sub(r"[^a-z0-9]+", "-", t).strip("-")


def felder(stb, agentur, namen):
    f = {}
    for k, v in {**agentur, **stb}.items():
        if v is None:
            f[k] = f"[{namen.get(k, k)}]"
        elif k in EURO and isinstance(v, (int, float)):
            f[k] = euro(v)
        elif isinstance(v, (dt.date, dt.datetime)):
            f[k] = datum(v)
        elif isinstance(v, float) and v.is_integer():
            f[k] = str(int(v))
        else:
            f[k] = str(v)
    # abgeleitete Felder
    f["aktion_ende_kurz"] = datum_kurz(stb["aktion_ende"]) if stb.get("aktion_ende") else "[Teilnahmeschluss]"
    meta, google = stb.get("budget_meta") or 0, stb.get("budget_google") or 0
    f["budget_gesamt"] = euro(meta + google) if (meta or google) else "[Werbebudget]"
    f["budget_meta_tag"] = euro(round(meta / 30)) if meta else "[Tagesbudget Meta]"
    f["budget_google_tag"] = euro(round(google / 30)) if google else "[Tagesbudget Google]"
    f["inhaber_nachname"] = stb["inhaber"].split()[-1] if stb.get("inhaber") else "[Nachname]"
    f["ort_klein"] = stb["ort"].lower() if stb.get("ort") else "[ort]"
    f["adresse"] = (f"{f['strasse']}, {f['plz']} {f['ort']}")
    tel = re.sub(r"\D", "", str(stb.get("telefon") or ""))
    f["telefon_link"] = "+49" + tel.lstrip("0") if tel else "+49XXXXXXXX"
    url = stb.get("landingpage_url") or ""
    f["landingpage_domain"] = re.sub(r"^https?://", "", url).rstrip("/") or "[ihre-seite].netlify.app"
    f["landingpage_url"] = url.rstrip("/") if url else "[Adresse der Landingpages]"
    ku = str(agentur.get("agentur_kleinunternehmer") or "").lower()
    f["ust_hinweis"] = ("Gemäß §19 UStG wird keine Umsatzsteuer berechnet." if ku == "ja"
                        else "Alle Beträge zzgl. 19 % Umsatzsteuer.")
    if not stb.get("pixel_id"):
        f["pixel_id"] = "PIXEL_ID"
    return f


def fuellen(text, f):
    return re.sub(r"\{\{(\w+)\}\}", lambda m: f.get(m.group(1), f"[{m.group(1)}]"), text)


def kopiere_ordner(quelle, ziel, nur_neu=False):
    ziel.mkdir(parents=True, exist_ok=True)
    for q in quelle.iterdir():
        z = ziel / q.name
        if nur_neu and z.exists():
            continue
        shutil.copy2(q, z)


def lade_lp_bauer():
    spec = importlib.util.spec_from_file_location("lp", HIER / "landingpages-bauen.py")
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def main():
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    quelle = pathlib.Path(sys.argv[1]).resolve()
    stb, namen = lese_schluessel(quelle)
    agentur, anamen = lese_schluessel(VORLAGEN / "tabellen" / "00-agentur-stammdaten.xlsx")
    namen.update(anamen)
    if not stb.get("betrieb"):
        sys.exit("Im Steckbrief fehlt „Betrieb (Kurzname)“.")
    f = felder(stb, agentur, namen)
    ziel = KUNDEN / slug(stb["betrieb"])
    print(f"Kunde: {stb['betrieb']}  →  {ziel.relative_to(PV.parent.parent)}")
    ziel.mkdir(parents=True, exist_ok=True)

    # Steckbrief als Quelle im Kundenordner
    if quelle != (ziel / "steckbrief.xlsx").resolve():
        shutil.copy2(quelle, ziel / "steckbrief.xlsx")

    # Fotos: einmal Platzhalter, danach gehören sie dem Kunden
    kopiere_ordner(VORLAGEN / "assets" / "fotos", ziel / "fotos", nur_neu=True)

    # Tabellen: nur beim ersten Mal
    (ziel / "tabellen").mkdir(exist_ok=True)
    for q, z in (("02-onboarding.xlsx", "onboarding.xlsx"), ("03-anfragen-und-report.xlsx", "anfragen-und-report.xlsx")):
        if not (ziel / "tabellen" / z).exists():
            shutil.copy2(VORLAGEN / "tabellen" / q, ziel / "tabellen" / z)
    print("✓ tabellen/ (bestehende bleiben unverändert)")

    # Dokumente
    (ziel / "dokumente").mkdir(exist_ok=True)
    for name in TEXTE_PRO_KUNDE:
        text = (VORLAGEN / "texte" / name).read_text(encoding="utf-8")
        (ziel / "dokumente" / name).write_text(fuellen(text, f), encoding="utf-8")
    print(f"✓ dokumente/ ({len(TEXTE_PRO_KUNDE)} Dateien)")

    # Landingpages
    lp = ziel / "landingpage"
    lp.mkdir(exist_ok=True)
    kopiere_ordner(VORLAGEN / "assets" / "fonts", lp / "fonts")
    kopiere_ordner(ziel / "fotos", lp / "fotos")
    (lp / "danke.html").write_text(fuellen((VORLAGEN / "landingpage" / "danke.html").read_text(encoding="utf-8"), f), encoding="utf-8")
    aktion = {k: f[k] for k in ("betrieb", "betrieb_lang", "telefon", "telefon_link", "adresse",
                                "oeffnungszeiten", "ziehung", "speicher", "pixel_id")}
    aktion.update({"_hinweis": "ERZEUGT aus steckbrief.xlsx — nicht von Hand ändern.",
                   "datum": f["aktion_ende_kurz"], "datum_voll": f["aktion_ende"]})
    (lp / "aktionen.json").write_text(json.dumps(aktion, ensure_ascii=False, indent=2), encoding="utf-8")
    print("✓ landingpage/")
    lade_lp_bauer().bauen(lp)

    # Anzeigen
    an = ziel / "anzeigen"
    an.mkdir(exist_ok=True)
    kopiere_ordner(VORLAGEN / "assets" / "fonts", an / "fonts")
    kopiere_ordner(ziel / "fotos", an / "fotos")
    for name in ("anzeigen.html", "vorschau.html"):
        (an / name).write_text(fuellen((VORLAGEN / "anzeigen" / name).read_text(encoding="utf-8"), f), encoding="utf-8")
    try:
        subprocess.run(["node", str(HIER / "creatives-rendern.js"), str(an / "anzeigen.html")], check=True,
                       capture_output=True, text=True)
        print("✓ anzeigen/creatives/ (3 Bilder gerendert)")
    except Exception as e:
        print("! Anzeigen-Bilder nicht gerendert (Node/Playwright fehlt?):", e)

    # README
    offen = [namen[k] for k, v in stb.items() if v is None and k not in ("notizen", "bisher")]
    readme = (VORLAGEN / "texte" / "_kunden-readme.md").read_text(encoding="utf-8")
    f["offen_liste"] = "\n".join(f"- [ ] {n}" for n in offen) or "- nichts, alles ausgefüllt"
    f["slug"] = ziel.name
    f["erzeugt_am"] = dt.date.today().strftime("%d.%m.%Y")
    (ziel / "README.md").write_text(fuellen(readme, f), encoding="utf-8")
    print("✓ README.md")
    if offen:
        print(f"\nNoch offen im Steckbrief ({len(offen)}): " + ", ".join(offen))


if __name__ == "__main__":
    main()
