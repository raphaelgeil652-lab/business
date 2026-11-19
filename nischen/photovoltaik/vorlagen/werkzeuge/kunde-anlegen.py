#!/usr/bin/env python3
"""Legt aus einem ausgefüllten Steckbrief den kompletten Kundenordner an.

Aufruf (aus dem Repo-Hauptordner):
    python3 nischen/photovoltaik/vorlagen/werkzeuge/kunde-anlegen.py <steckbrief.xlsx> [fotos ...]

Liest:     den Steckbrief (Blatt „Steckbrief“ und Blatt „Deine Daten“)
           optional Fotos: werden nach Namen zugeordnet (foto-1 … foto-3, vorher, nachher); jpg, png, heic, webp
Schreibt:  nischen/photovoltaik/kunden/<kürzel>/
             README.md               Übersicht: was noch fehlt (nach Schritten), Eckdaten, welche Datei wann
             zentrale-zeile.txt      die Zeile für das Blatt „Kunden“ der Zentrale (kopieren, einfügen)
             steckbrief.xlsx          Kopie des Steckbriefs (die Quelle für alles)
             fotos/                   die Originalfotos des Kunden (bleiben erhalten)
             dokumente/               Vereinbarung, Abrechnungs-Mails, Willkommens-Mail, Rückruf-Leitfaden,
                                      Kampagnen, bei Verlosung Teilnahmebedingungen
             anzeigen/                Anzeigen-HTML, vorschau.html, creatives/*.png
             landingpage/             der Ordner für Netlify: wirtschaftlichkeit.html, rechner.html, danke.html,
                                      bei Verlosung modul.html, rabatt.html, speicher.html; Fotos verkleinert

Mehrfach ausführen ist erlaubt und gewollt: nach jeder Änderung am Steckbrief oder neuen Fotos.
Echte Kundenordner kommen NICHT ins Repo (es ist öffentlich): .gitignore schließt sie aus, nur der
fiktive Probekunde liegt drin. Die Quelle bleibt der Steckbrief beim Nutzer.
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

TEXTE_PRO_KUNDE = ["vereinbarung.md", "vertrag-mail.md", "abrechnung-mails.md", "willkommens-mail.md", "zugaenge-anleitung.md",
                   "rueckruf-leitfaden.md",
                   "kampagnen.md"]
FOTO_NAMEN = ["foto-1", "foto-2", "foto-3", "vorher", "nachher"]
FOTO_MAX = 1600  # Pixel an der langen Seite; hält die Seiten schnell und spart Netlify-Datenvolumen
TEXTE_VERLOSUNG = ["teilnahmebedingungen.md"]
VERLOSUNGS_SEITEN = ["modul.html", "rabatt.html", "speicher.html"]
VERLOSUNGS_BILDER = ["1-gewinnspiel.png", "2-rabatt.png", "3-speicher.png"]
MONATE = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September",
          "Oktober", "November", "Dezember"]
EURO = {"ticket_schnitt", "onboarding_preis", "retainer", "budget_meta", "budget_google"}
# Muss für Vertrag und Livegang ausgefüllt sein (sonst steht es in der README unter „Noch offen“)
# Was fehlt, steht in der README unter „Noch offen“, sortiert nach dem Schritt, in dem es gebraucht wird.
OFFEN_NACH_SCHRITT = [
    ("Für die Vereinbarung (Schritt 3–4)", ["betrieb", "anrede", "inhaber", "telefon", "email", "ort", "einzugsgebiet_km",
                                            "ticket_schnitt", "kapazitaet_termine", "betrieb_lang", "strasse", "plz",
                                            "oeffnungszeiten", "eigenes_team", "onboarding_preis", "retainer",
                                            "budget_meta", "budget_google", "drive_link"]),
    ("Vom Kunden (Schritt 5)", ["impressum_url", "datenschutz_url"]),
    ("Zum Einrichten (Schritt 6)", ["pixel_id"]),
]
OPTIONAL = [("Vom Kunden (Schritt 5)", ["bewertung_1", "bewertung_2"]),
            ("Zum Einrichten (Schritt 6)", ["google_conversion"])]
AGENTUR_PFLICHT = ["agentur_name", "agentur_inhaber", "agentur_anschrift", "agentur_email", "agentur_telefon",
                   "agentur_business_id", "agentur_google_mcc"]
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


def lese_schluessel(pfad, blatt=None):
    """Liest Spalte A (Schlüssel) → Spalte B (Frage) und C (Eintrag) aus dem Blatt (Standard: das erste)."""
    wb = load_workbook(pfad, data_only=True)
    if blatt and blatt not in wb.sheetnames:
        return {}, {}
    ws = wb[blatt] if blatt else wb.worksheets[0]
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


RECHTSFORMEN = {"gmbh": "GmbH", "ug": "UG", "ag": "AG", "kg": "KG", "ohg": "OHG", "gbr": "GbR", "e.k.": "e.K.",
               "mbh": "mbH", "co.": "Co.", "&": "&"}


def aufbereiten(d):
    """Tippfehler und Excel-Eigenheiten glätten, bevor irgendetwas erzeugt wird. Gibt Warnungen zurück."""
    warnungen = []
    for k in ("betrieb", "betrieb_lang", "inhaber", "ort", "strasse", "agentur_inhaber", "agentur_anschrift"):
        v = d.get(k)
        if isinstance(v, str) and v == v.lower() and any(c.isalpha() for c in v):
            d[k] = " ".join(RECHTSFORMEN.get(w, w[:1].upper() + w[1:]) for w in v.split(" "))
    for k in ("betrieb", "betrieb_lang"):  # Rechtsform immer richtig schreiben: gmbh → GmbH
        v = d.get(k)
        if isinstance(v, str):
            d[k] = " ".join(RECHTSFORMEN.get(w.lower(), w) if w.lower() in RECHTSFORMEN else w for w in v.split(" "))
    for k in ("anrede",):
        if isinstance(d.get(k), str):
            d[k] = d[k].strip().capitalize()
    for k in ("eigenes_team", "verlosung_aktiv", "check_entscheider", "check_rueckruf", "check_fotos", "agentur_kleinunternehmer"):
        if isinstance(d.get(k), str):
            d[k] = d[k].strip().capitalize()
    for k in ("telefon", "agentur_telefon"):  # Excel macht aus 0152… die Zahl 152…
        v = d.get(k)
        if isinstance(v, (int, float)):
            s = str(int(v))
            d[k] = ("+" + s) if s.startswith("49") and len(s) >= 11 else ("0" + s)
    if isinstance(d.get("plz"), (int, float)):
        d["plz"] = str(int(d["plz"])).zfill(5)
    for k, name in (("pixel_id", "Meta-Pixel-ID"), ("agentur_business_id", "Meta Business-ID")):
        v = d.get(k)
        if isinstance(v, (int, float)):
            s = str(int(v))
            d[k] = s
            if len(s) >= 16 and s.endswith("0"):
                warnungen.append(f"{name} {s} endet auf 0: Excel speichert nur 15 Stellen genau. Bitte bei Meta "
                                 f"vergleichen und als Text eintragen (ein ' davor tippen).")
    return warnungen


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
    f["slug"] = slug(stb["betrieb"])
    url = (stb.get("landingpage_url") or f"https://{f['slug']}.netlify.app").rstrip("/")
    if not url.startswith("http"):
        url = "https://" + url
    f["landingpage_url"] = url
    f["landingpage_domain"] = re.sub(r"^https?://", "", url)
    gc = str(stb.get("google_conversion") or "").strip().replace(" ", "")
    f["google_conversion"] = gc if re.fullmatch(r"AW-\d+/[\w-]+", gc) else ""
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


def fotos_uebernehmen(dateien, ordner):
    """Neue Fotos nach Namen in fotos/ legen (Originale). Nicht erkannte Namen der Reihe nach als foto-1 … foto-3."""
    ordner.mkdir(parents=True, exist_ok=True)
    frei = [n for n in FOTO_NAMEN[:3]]
    for d in dateien:
        d = pathlib.Path(d)
        stamm = d.stem.lower().replace("_", "-").replace(" ", "-")
        name = next((n for n in ["vorher", "nachher"] + FOTO_NAMEN[:3] if n in stamm), None)
        if name is None:
            name = frei.pop(0) if frei else None
        elif name in frei:
            frei.remove(name)
        if name is None:
            print(f"! {d.name}: kein Platz mehr (höchstens foto-1 … foto-3, vorher, nachher)")
            continue
        for alt in ordner.glob(name + ".*"):
            alt.unlink()
        shutil.copy2(d, ordner / (name + d.suffix.lower()))
        print(f"✓ Foto {d.name} → fotos/{name}{d.suffix.lower()}")


def fotos_fuer_web(quelle, ziel):
    """Fotos aus fotos/ als JPG in Web-Größe nach ziel/ (gedreht wie aufgenommen, lange Seite höchstens FOTO_MAX)."""
    from PIL import Image, ImageOps
    ziel.mkdir(parents=True, exist_ok=True)
    for alt in ziel.glob("*.jpg"):
        alt.unlink()
    for name in FOTO_NAMEN:
        q = next(iter(sorted(quelle.glob(name + ".*"))), None)
        if q is None:
            continue
        z = ziel / (name + ".jpg")
        try:
            if q.suffix.lower() in (".heic", ".heif"):
                subprocess.run(["convert", str(q), "-auto-orient", "-resize", f"{FOTO_MAX}x{FOTO_MAX}>", "-quality", "82",
                                "-strip", "-interlace", "Plane", str(z)], check=True, capture_output=True)
                continue
            im = ImageOps.exif_transpose(Image.open(q)).convert("RGB")
            im.thumbnail((FOTO_MAX, FOTO_MAX))
            im.save(z, "JPEG", quality=82, optimize=True, progressive=True)
        except Exception as e:  # lieber das Original als gar kein Foto
            print(f"! {q.name} nicht umgewandelt ({e}), nehme das Original")
            shutil.copy2(q, z)


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
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    quelle = pathlib.Path(sys.argv[1]).resolve()
    stb, namen = lese_schluessel(quelle, "Steckbrief")
    if not stb:
        stb, namen = lese_schluessel(quelle)
    agentur, anamen = lese_schluessel(quelle, "Deine Daten")
    namen.update(anamen)
    warnungen = aufbereiten(stb) + aufbereiten(agentur)
    if not stb.get("betrieb"):
        sys.exit("Im Steckbrief fehlt „Betrieb (Kurzname)“.")
    f = felder(stb, agentur, namen)
    ziel = KUNDEN / f["slug"]
    print(f"Kunde: {stb['betrieb']}  →  {ziel.relative_to(PV.parent.parent)}")
    ziel.mkdir(parents=True, exist_ok=True)

    # Steckbrief als Quelle im Kundenordner
    if quelle != (ziel / "steckbrief.xlsx").resolve():
        shutil.copy2(quelle, ziel / "steckbrief.xlsx")

    # Fotos: neue übernehmen; fehlende Titelbilder sind Platzhalter (CC0) bis echte da sind
    fotos_uebernehmen(sys.argv[2:], ziel / "fotos")
    for n in FOTO_NAMEN[:3]:
        if not list((ziel / "fotos").glob(n + ".*")):
            shutil.copy2(VORLAGEN / "assets" / "fotos" / (n + ".jpg"), ziel / "fotos" / (n + ".jpg"))
    platzhalter = [n for n in FOTO_NAMEN[:3] if (ziel / "fotos" / (n + ".jpg")).exists() and
                   (ziel / "fotos" / (n + ".jpg")).read_bytes() == (VORLAGEN / "assets" / "fotos" / (n + ".jpg")).read_bytes()]
    f["_vorher_nachher"] = all(list((ziel / "fotos").glob(n + ".*")) for n in ("vorher", "nachher"))

    shutil.rmtree(ziel / "tabellen", ignore_errors=True)  # Checkliste und Anfragen liegen jetzt in der Zentrale

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
    (ziel / "dokumente" / "report-mail.md").unlink(missing_ok=True)  # Monatsreport legt jetzt die Zentrale an
    print(f"✓ dokumente/ ({len(texte)} Dateien) · Verlosung {'AKTIV' if aktiv else 'aus'}")

    # Landingpages
    lp = ziel / "landingpage"
    lp.mkdir(exist_ok=True)
    kopiere_ordner(VORLAGEN / "assets" / "fonts", lp / "fonts")
    fotos_fuer_web(ziel / "fotos", lp / "fotos")
    for name in ("danke.html", "wirtschaftlichkeit.html", "rechner.html"):
        (lp / name).write_text(fuellen((VORLAGEN / "landingpage" / name).read_text(encoding="utf-8"), f), encoding="utf-8")
    # Startseite: die Hauptadresse ohne Zusatz führt zur Wirtschaftlichkeitsprüfung (Werbe-Parameter bleiben dran)
    (lp / "index.html").write_text(
        '<!DOCTYPE html><html lang="de"><head><meta charset="UTF-8"><meta name="robots" content="noindex">'
        '<meta name="viewport" content="width=device-width, initial-scale=1">'
        f'<title>{html.escape(f["betrieb"])}</title>'
        '<meta http-equiv="refresh" content="0; url=wirtschaftlichkeit.html">'
        '<script>location.replace("wirtschaftlichkeit.html" + location.search);</script></head>'
        '<body><a href="wirtschaftlichkeit.html">Weiter zur kostenlosen Wirtschaftlichkeitsprüfung</a></body></html>',
        encoding="utf-8")
    aktion = {k: f[k] for k in ("betrieb", "betrieb_lang", "telefon", "telefon_link", "adresse",
                                "oeffnungszeiten", "ziehung", "speicher", "pixel_id", "slug")}
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
    fotos_fuer_web(ziel / "fotos", an / "fotos")
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

    # Zeile für die Zentrale (Blatt „Kunden“, Spalten Kürzel … Ziehung am)
    roh = lambda k: "" if stb.get(k) is None else (datum(stb[k]) if isinstance(stb[k], (dt.date, dt.datetime)) else
                                                    str(int(stb[k])) if isinstance(stb[k], float) and stb[k].is_integer() else str(stb[k]))
    zeile = [f["slug"], roh("betrieb"), f"{roh('anrede')} {f['inhaber_nachname'] if stb.get('inhaber') else ''}".strip(),
             roh("email"), roh("telefon"), roh("drive_link"), roh("onboarding_preis"), roh("retainer"), "", "Ja",
             roh("aktion_ende") if aktiv else "", roh("ziehung") if aktiv else ""]
    (ziel / "zentrale-zeile.txt").write_text("\t".join(zeile) + "\n", encoding="utf-8")
    print("✓ zentrale-zeile.txt")

    # README
    gruppen = {}
    for titel, keys in OFFEN_NACH_SCHRITT:
        gruppen.setdefault(titel, []).extend(namen.get(k, k) for k in keys if stb.get(k) is None)
    if aktiv:
        gruppen.setdefault("Für die Verlosung", []).extend(namen.get(k, k) for k in VERLOSUNG_PFLICHT if stb.get(k) is None)
    for titel, keys in OPTIONAL:
        gruppen.setdefault(titel, []).extend(f"{namen.get(k, k)} (wenn möglich)" for k in keys if stb.get(k) is None)
    if platzhalter:
        gruppen.setdefault("Vom Kunden (Schritt 5)", []).append(
            f"Echte Fotos (noch Platzhalter: {', '.join(platzhalter)})")
    if not f["_vorher_nachher"]:
        gruppen.setdefault("Vom Kunden (Schritt 5)", []).append("Foto vorher und nachher vom selben Dach (wenn möglich)")
    if warnungen:
        gruppen = {"Bitte prüfen": warnungen, **gruppen}
    fehlt_agentur = [anamen.get(k, k) for k in AGENTUR_PFLICHT if not agentur.get(k)]
    if fehlt_agentur:
        gruppen = {"Deine Daten (im Steckbrief, Blatt „Deine Daten“)": fehlt_agentur, **gruppen}
    offen = [(t_, l) for t_, l in gruppen.items() if l]
    f["offen_liste"] = "\n\n".join(f"**{t_}**\n" + "\n".join(f"- [ ] {n}" for n in l) for t_, l in offen) \
        or "Nichts, alles ausgefüllt."
    f["erzeugt_am"] = dt.date.today().strftime("%d.%m.%Y")
    f["v"] = dt.datetime.now().strftime("%Y%m%d%H%M")  # neue Zahl je Lauf, damit githack nichts Altes zeigt
    readme = (VORLAGEN / "texte" / "_kunden-readme.md").read_text(encoding="utf-8")
    (ziel / "README.md").write_text(fuellen(readme, f), encoding="utf-8")
    print("✓ README.md")
    for t_, l in offen:
        print(f"\nNoch offen · {t_}: " + ", ".join(l))
    nicht_ja = [namen.get(k, k) for k in CHECKS if str(stb.get(k) or "").lower() != "ja"]
    if nicht_ja:
        print("\n! ACHTUNG, Kunde passt noch nicht. Nicht „Ja“: " + " · ".join(nicht_ja))


if __name__ == "__main__":
    main()
