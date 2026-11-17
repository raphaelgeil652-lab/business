#!/usr/bin/env python3
"""Legt aus einem ausgefüllten Steckbrief den kompletten Kundenordner an.

Aufruf (aus dem Repo-Hauptordner):
    python3 nischen/photovoltaik/vorlagen/werkzeuge/kunde-anlegen.py <steckbrief.xlsx>

Liest:     den Steckbrief + vorlagen/tabellen/00-agentur.xlsx (Blatt „Deine Daten“)
Schreibt:  nischen/photovoltaik/kunden/<betrieb>/
             README.md               Überblick, Links, nächste Schritte
             steckbrief.xlsx          Kopie des Steckbriefs (die Quelle für alles)
             fotos/                   HIER die echten Fotos des Kunden ablegen: foto-1.jpg, foto-2.jpg, foto-3.jpg
                                      (Titelbilder), optional vorher.jpg + nachher.jpg (dasselbe Dach)
             dokumente/               Vereinbarung, Mails, Kampagnen, Teilnahmebedingungen …
             tabellen/                Checkliste + Anfragen-und-Report (werden nie überschrieben)
             anzeigen/                wirtschaftlichkeit.html (immer), verlosungen.html (nur bei aktiver Verlosung),
                                      vorschau.html, creatives/*.png
             landingpage/             wirtschaftlichkeit.html, rechner.html, danke.html,
                                      bei aktiver Verlosung zusätzlich modul.html, rabatt.html, speicher.html

Zwei Kampagnenarten: Dauerkampagne Wirtschaftlichkeitsprüfung (immer) und Saisonaktion Verlosung
(2–3 × im Jahr, Steckbrief-Feld „Verlosung gerade aktiv?“). Die Beispielzahlen kommen aus
vorlagen/rechengrundlage.json.

Mehrfach ausführen ist ausdrücklich erlaubt: Nach jeder Änderung am Steckbrief oder an den
Fotos einfach neu laufen lassen. Erzeugte Dateien werden ersetzt, die Tabellen in tabellen/
und die Fotos in fotos/ bleiben unangetastet.
"""
import datetime as dt
import html
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
                   "report-mail.md", "abrechnung-mails.md"]
TEXTE_VERLOSUNG = ["teilnahmebedingungen.md"]
VERLOSUNGS_SEITEN = ["modul.html", "rabatt.html", "speicher.html"]
VERLOSUNGS_BILDER = ["1-gewinnspiel.png", "2-rabatt.png", "3-speicher.png"]
MONATE = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September",
          "Oktober", "November", "Dezember"]
EURO = {"ticket_schnitt", "onboarding_preis", "retainer", "budget_meta", "budget_google"}
# Muss für Vertrag und Livegang ausgefüllt sein (sonst steht es in der README unter „Noch offen“)
PFLICHT = ["betrieb", "anrede", "inhaber", "telefon", "email", "ort", "einzugsgebiet_km", "ticket_schnitt",
           "kapazitaet_termine", "betrieb_lang", "strasse", "plz", "oeffnungszeiten", "eigenes_team",
           "onboarding_preis", "retainer", "budget_meta", "budget_google", "impressum_url", "datenschutz_url",
           "landingpage_url", "pixel_id"]
OPTIONAL = ["bewertung_1", "bewertung_2"]
VERLOSUNG_PFLICHT = ["aktion_ende", "ziehung", "speicher"]
CHECKS = ["check_entscheider", "check_rueckruf", "check_fotos"]


BEWERTUNGEN_HTML = """<!--B--><section>
    <h2>Das sagen Kunden</h2>
    {{bewertungen_html}}
  </section><!--/B-->"""
VORHER_NACHHER_HTML = """<section>
    <h2>Anlagen, die wir montiert haben</h2>
    <div class="tiles"><figure><img src="fotos/vorher.jpg" alt="Dach vorher" loading="lazy"><figcaption>Vorher</figcaption></figure><figure><img src="fotos/nachher.jpg" alt="Dach nachher" loading="lazy"><figcaption>Nachher</figcaption></figure></div>
  </section>"""


def lese_schluessel(pfad):
    """Liest Spalte A (Schlüssel) → Spalte B (Frage) und C (Eintrag) aus dem ersten Blatt."""
    ws = load_workbook(pfad, data_only=True).worksheets[0]
    werte, namen = {}, {}
    for row in ws.iter_rows(min_row=1, max_col=3, values_only=True):
        key, feld, wert = row
        if not isinstance(key, str) or not re.fullmatch(r"[a-z][a-z0-9_]*", key) or key == "ergebnis":
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
    f["budget_empfehlung"] = euro(budget_empfehlung(stb))
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
    if not stb.get("pruefung_dauer"):
        f["pruefung_dauer"] = "2 Werktagen"
    if not stb.get("vertragsbeginn"):
        f["vertragsbeginn"] = dt.date.today().strftime("%d.%m.%Y")
    # Eigenes Montageteam: nur behaupten, wenn im Steckbrief „Ja“ steht
    team = str(stb.get("eigenes_team") or "").lower() == "ja"
    f["team_fakt"] = "eigene Montageteams" if team else "Fachbetrieb in Ihrer Region"
    f["team_zusatz"] = " · eigene Montageteams" if team else ""
    f["team_satz"] = f" {f['betrieb']} plant und montiert mit eigenem Team." if team else ""
    f["team_headline"] = "Eigene Montageteams" if team else "Fachbetrieb aus der Region"
    f["team_beschr"] = f"Eigene Montageteams aus {f['ort']}" if team else f"Fachbetrieb aus {f['ort']}"
    f["team_li"] = "<li>Montage mit eigenem Team, kein Subunternehmer</li>" if team else ""
    # Echte Bewertungen: ohne Eintrag fällt der Block weg (nichts erfinden, kein Platzhalter online)
    bew = [stb[k] for k in ("bewertung_1", "bewertung_2") if stb.get(k)]
    f["_bewertungen"] = bool(bew)
    f["bewertungen_html"] = "\n    ".join(f'<blockquote class="review">{html.escape(str(b))}</blockquote>' for b in bew)
    aktiv = str(stb.get("verlosung_aktiv") or "").lower() == "ja"
    f["_verlosung_aktiv"] = aktiv
    if aktiv:
        f["aktionen_text"] = (f"Saisonaktion: Verlosung eines kostenlosen Solarmoduls sowie von 3 × 20 % Rabatt und "
                              f"3 Stromspeichern ({f['speicher']}) zur ersten Bestellung. Teilnahmeschluss: "
                              f"{f['aktion_ende']}, Ziehung: {f['ziehung']}. Kosten und Einlösung der Gewinne trägt "
                              f"der Auftraggeber.")
        f["verlosung_absatz"] = (f"\n- Unsere Verlosung: Teilnahmeschluss {f['aktion_ende']}, Ziehung am {f['ziehung']}, "
                                 f"verloster Speicher: {f['speicher']}. Bitte bestätigen Sie, dass Sie die Gewinne einlösen.")
    else:
        f["aktionen_text"] = "Saisonaktionen (Verlosungen) werden bei Bedarf gesondert in Textform vereinbart."
        f["verlosung_absatz"] = ""
    rechenwerte(f)
    return f


def fuellen(text, f):
    text = bloecke(text, {"VERLOSUNG": f.get("_verlosung_aktiv", False), "BEWERTUNGEN": f.get("_bewertungen", False),
                          "VORHERNACHHER": f.get("_vorher_nachher", False)})
    return re.sub(r"\{\{(\w+)\}\}", lambda m: f.get(m.group(1), f"[{m.group(1)}]"), text)


def bloecke(text, schalter):
    """<!--NAME--> … <!--/NAME--> bleibt nur, wenn der Schalter an ist (ohne die Markierungen)."""
    for name, an in schalter.items():
        muster = re.compile(rf"<!--{name}-->(.*?)<!--/{name}-->\n?", re.S)
        text = muster.sub((lambda m: m.group(1)) if an else "", text)
    return text


def budget_empfehlung(stb):
    """Gleiche Regel wie im Steckbrief: Auftragswert ÷ 5, zum Start höchstens 3.000 € (ohne Auftragswert 3.000 €)."""
    t = stb.get("ticket_schnitt")
    return min(3000, round(t / 5 / 100) * 100) if isinstance(t, (int, float)) and t > 0 else 3000


def rechenwerte(f):
    """Beispielrechnung aus rechengrundlage.json → Felder w_* und r_json."""
    rg = json.loads((VORLAGEN / "rechengrundlage.json").read_text(encoding="utf-8"))
    kwh, ct, eigen, jahre = rg["verbrauch_kwh"], rg["strompreis_ct"], rg["eigenversorgung_speicher_prozent"], rg["jahre"]
    jahr = kwh * ct / 100
    solar = jahr * (1 - eigen / 100)
    tsd = lambda x: f"{x:,.0f}".replace(",", ".")
    f.update({
        "w_verbrauch": tsd(kwh), "w_verbrauch_zahl": str(kwh), "w_preis": str(ct), "w_preis_quelle": rg["strompreis_quelle"],
        "w_eigen_quelle": rg["eigenversorgung_quelle"],
        "w_kosten_jahr": euro(jahr), "w_kosten_solar_jahr": euro(round(solar / 10) * 10),
        "w_abschlag": euro(round(jahr / 12)), "w_abschlag_solar": euro(round(solar / 12)),
        "w_jahre": str(jahre), "w_kosten_jahre": euro(int(jahr * jahre // 1000) * 1000),
        "w_annahmen": (f"Beispiel: {tsd(kwh)} kWh/Jahr, {ct} ct/kWh ({rg['strompreis_quelle']}), "
                       f"{rg['anlage_text']}, ca. {eigen} % Eigenversorgung ({rg['eigenversorgung_quelle']})."),
        "r_json": json.dumps({"preis_ct": ct, "spannen": {k: v for k, v in rg["rechner"].items() if not k.startswith("_")}}),
    })


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
    agentur, anamen = lese_schluessel(VORLAGEN / "tabellen" / "00-agentur.xlsx")
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
    f["_vorher_nachher"] = all((ziel / "fotos" / n).exists() for n in ("vorher.jpg", "nachher.jpg"))

    # Tabellen: nur beim ersten Mal
    (ziel / "tabellen").mkdir(exist_ok=True)
    (ziel / "tabellen" / "onboarding.xlsx").unlink(missing_ok=True)  # alter Name
    for q, z in (("02-checkliste-bis-livegang.xlsx", "checkliste.xlsx"),
                 ("03-anfragen-und-report.xlsx", "anfragen-und-report.xlsx")):
        if not (ziel / "tabellen" / z).exists():
            wb = load_workbook(VORLAGEN / "tabellen" / q)
            wb.worksheets[0]["A1"] = f"{wb.worksheets[0]['A1'].value} · {stb['betrieb']}"
            if "Anfragen" in wb.sheetnames:  # Beispielzeile raus, damit sie nicht mitzählt
                for c in wb["Anfragen"][5]:
                    if c.column != 7:
                        c.value = None
            if "Monatsreport" in wb.sheetnames:
                wb["Monatsreport"]["B5"] = f"{f['anrede']} {f['inhaber_nachname']}"
                wb["Monatsreport"]["B6"] = f"{f['agentur_inhaber']}\n{f['agentur_name']}"
            wb.save(ziel / "tabellen" / z)
    print("✓ tabellen/ (bestehende bleiben unverändert)")

    # Dokumente
    (ziel / "dokumente").mkdir(exist_ok=True)
    aktiv = f["_verlosung_aktiv"]
    texte = TEXTE_PRO_KUNDE + (TEXTE_VERLOSUNG if aktiv else [])
    for name in texte:
        text = (VORLAGEN / "texte" / name).read_text(encoding="utf-8")
        (ziel / "dokumente" / name).write_text(fuellen(text, f), encoding="utf-8")
    if not aktiv:
        for name in TEXTE_VERLOSUNG:
            (ziel / "dokumente" / name).unlink(missing_ok=True)
    print(f"✓ dokumente/ ({len(texte)} Dateien) · Verlosung {'AKTIV' if aktiv else 'aus'}")

    # Landingpages
    lp = ziel / "landingpage"
    lp.mkdir(exist_ok=True)
    kopiere_ordner(VORLAGEN / "assets" / "fonts", lp / "fonts")
    kopiere_ordner(ziel / "fotos", lp / "fotos")
    for name in ("danke.html", "wirtschaftlichkeit.html", "rechner.html"):
        (lp / name).write_text(fuellen((VORLAGEN / "landingpage" / name).read_text(encoding="utf-8"), f), encoding="utf-8")
    aktion = {k: f[k] for k in ("betrieb", "betrieb_lang", "telefon", "telefon_link", "adresse",
                                "oeffnungszeiten", "ziehung", "speicher", "pixel_id")}
    aktion.update({k: f[k] for k in ("impressum_url", "datenschutz_url", "team_zusatz", "team_li")})
    aktion["bewertungen_html"] = bloecke(BEWERTUNGEN_HTML, {"B": f["_bewertungen"]}).replace("{{bewertungen_html}}", f["bewertungen_html"])
    aktion["vorher_nachher_html"] = VORHER_NACHHER_HTML if f["_vorher_nachher"] else ""
    aktion.update({"_hinweis": "ERZEUGT aus steckbrief.xlsx — nicht von Hand ändern.",
                   "datum": f["aktion_ende_kurz"], "datum_voll": f["aktion_ende"]})
    (lp / "aktionen.json").write_text(json.dumps(aktion, ensure_ascii=False, indent=2), encoding="utf-8")
    print("✓ landingpage/ (wirtschaftlichkeit.html, rechner.html, danke.html)")
    if aktiv:
        lade_lp_bauer().bauen(lp)
    else:
        for name in VERLOSUNGS_SEITEN:
            (lp / name).unlink(missing_ok=True)

    # Anzeigen
    an = ziel / "anzeigen"
    an.mkdir(exist_ok=True)
    kopiere_ordner(VORLAGEN / "assets" / "fonts", an / "fonts")
    kopiere_ordner(ziel / "fotos", an / "fotos")
    (an / "anzeigen.html").unlink(missing_ok=True)  # alter Name
    vorlagen_html = ["wirtschaftlichkeit.html", "vorschau.html"] + (["verlosungen.html"] if aktiv else [])
    for name in vorlagen_html:
        (an / name).write_text(fuellen((VORLAGEN / "anzeigen" / name).read_text(encoding="utf-8"), f), encoding="utf-8")
    if not aktiv:
        (an / "verlosungen.html").unlink(missing_ok=True)
        for name in VERLOSUNGS_BILDER:
            (an / "creatives" / name).unlink(missing_ok=True)
    for name in [n for n in vorlagen_html if n != "vorschau.html"]:
        try:
            subprocess.run(["node", str(HIER / "creatives-rendern.js"), str(an / name)], check=True,
                           capture_output=True, text=True)
            print(f"✓ anzeigen/creatives/ aus {name}")
        except Exception as e:
            print(f"! {name} nicht gerendert (Node/Playwright fehlt?):", e)

    # README
    pflicht = PFLICHT + (VERLOSUNG_PFLICHT if f["_verlosung_aktiv"] else [])
    offen = [namen.get(k, k) for k in pflicht if stb.get(k) is None]
    offen += [f"{namen.get(k, k)} (optional)" for k in OPTIONAL if stb.get(k) is None]
    if not f["_vorher_nachher"]:
        offen.append("Fotos vorher.jpg und nachher.jpg (optional, sonst fehlt der Vorher/Nachher-Block)")
    readme = (VORLAGEN / "texte" / "_kunden-readme.md").read_text(encoding="utf-8")
    f["offen_liste"] = "\n".join(f"- [ ] {n}" for n in offen) or "- nichts, alles ausgefüllt"
    f["slug"] = ziel.name
    f["erzeugt_am"] = dt.date.today().strftime("%d.%m.%Y")
    f["v"] = dt.datetime.now().strftime("%Y%m%d%H%M")  # neue Zahl je Lauf, damit githack nichts Altes zeigt
    (ziel / "README.md").write_text(fuellen(readme, f), encoding="utf-8")
    print("✓ README.md")
    if offen:
        print(f"\nNoch offen ({len(offen)}): " + ", ".join(offen))
    nicht_ja = [namen.get(k, k) for k in CHECKS if str(stb.get(k) or "").lower() != "ja"]
    if nicht_ja:
        print("\n! ACHTUNG, Kunde passt noch nicht. Nicht „Ja“: " + " · ".join(nicht_ja))


if __name__ == "__main__":
    main()
