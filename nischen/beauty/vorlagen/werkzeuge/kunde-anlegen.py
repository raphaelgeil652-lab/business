#!/usr/bin/env python3
"""Baut aus den Daten der Beauty-Zentrale die Terminseite, die Anzeigen und die Kampagnen-Anleitung eines Studios.

Aufruf (aus dem Repo-Hauptordner):
    python3 nischen/beauty/vorlagen/werkzeuge/kunde-anlegen.py <text-fuer-claude.json> [fotos, Ordner oder ZIP ...]

Liest:     den „Text für Claude“ aus der Zentrale (Mail „alles vom Studio da“ oder Team-Seite des Studios), module.py
           und die Fotos des Studios (beliebige Namen; die ersten drei werden foto-1 = Behandlung, foto-2 = Studio,
           foto-3 = Behandler/in, außer der Name sagt es schon: foto-2.jpg, vorher.jpg …). jpg, png, heic, webp.
Schreibt:  nischen/beauty/kunden/<kürzel>/
             LIES-MICH.md       die drei Schritte danach
             seite/             der Ordner für Netlify (termin.html, danke, bestaetigen, absagen, rueckruf-danke, Fotos)
             anzeigen/          creatives/*.png zum Hochladen bei Meta, vorschau.html zum Ansehen
             kampagnen.html     Kampagnen-Assistent: Meta und Google Schritt für Schritt, Häkchen, Knöpfe „Kopieren“
             kampagnen.md       dieselbe Anleitung als Text
             fotos/, daten.json

Kein Steckbrief, keine Excel mehr: Alles kommt aus dem Formular „Neuer Kunde“ und der Schritte-Seite des Studios.
Mehrfach ausführen ist erlaubt. Echte Kundenordner kommen NICHT ins Repo (öffentlich, .gitignore).
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
import tempfile
import zipfile
from urllib.parse import quote

HIER = pathlib.Path(__file__).resolve().parent
VORLAGEN = HIER.parent
BEAUTY = VORLAGEN.parent
KUNDEN = BEAUTY / "kunden"
_spec = importlib.util.spec_from_file_location("module", VORLAGEN / "module.py")
M = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(M)

SEITEN = ["termin.html", "danke.html", "bestaetigen.html", "absagen.html", "rueckruf-danke.html"]
STATISCH = ["seite.css", "messung.js", "buchung.js"]
FOTO_NAMEN = ["foto-1", "foto-2", "foto-3", "foto-4", "foto-5", "foto-6", "foto-7", "foto-8", "vorher", "nachher"]
# Weitere Fotos sind freiwillig: Fehlt eines, nimmt die Anzeige das passende der ersten drei.
# foto-4 Online buchen · foto-5 erste Leistung mit Preis · foto-6 die Beratung · foto-7/8 frei für weitere Kampagnen.
FOTO_ERSATZ = {"foto-4": "foto-1", "foto-5": "foto-1", "foto-6": "foto-2", "foto-7": "foto-1", "foto-8": "foto-3"}
FOTO_MAX = 1600
BILDER = {".jpg", ".jpeg", ".png", ".heic", ".heif", ".webp"}
MONATE = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"]
BERATUNG = re.compile(r"beratung|analyse|erstgespr|vorzeichn|probe|kennenlern|vorgespr", re.I)


def euro(x):
    return f"{x:,.0f} €".replace(",", ".")


def datum(x):
    return x.strftime("%d.%m.%Y") if isinstance(x, (dt.date, dt.datetime)) else x


def datum_kurz(x):
    return f"{x.day}. {MONATE[x.month - 1]}" if isinstance(x, (dt.date, dt.datetime)) else x


def slug(text):
    t = text.lower()
    for a, b in (("ä", "ae"), ("ö", "oe"), ("ü", "ue"), ("ß", "ss"), ("&", "und")):
        t = t.replace(a, b)
    return re.sub(r"[^a-z0-9]+", "-", t).strip("-")


def esc(s):
    return html.escape(str(s), quote=True)


def fuellen(text, f, schalter=None):
    text = bloecke(text, schalter or {})
    for _ in range(3):  # Platzhalter in Platzhaltern (z. B. Modultexte mit {{ort}})
        neu = re.sub(r"\{\{(\w+)\}\}", lambda m: str(f.get(m.group(1), f"[{m.group(1)}]")), text)
        if neu == text:
            break
        text = neu
    return text


def bloecke(text, schalter):
    for name, an in schalter.items():
        muster = re.compile(rf"<!--{name}-->(.*?)<!--/{name}-->\n?", re.S)
        text = muster.sub((lambda m: m.group(1)) if an else "", text)
    return text




def zahl(v, vorgabe):
    try:
        return int(float(v)) if v not in (None, "") else vorgabe
    except (TypeError, ValueError):
        return vorgabe


def preis_text(p):
    p = str(p or "").strip()
    if not p:
        return ""
    return p if re.search(r"€|eur", p, re.I) else p + " €"


def felder(d):
    """Alle Platzhalter für Seite, Anzeigen und Kampagnen aus dem „Text für Claude“. Gibt (f, modul, hinweise) zurück."""
    hinweise = []
    angebot = str(d.get("behandlung") or "").strip()
    if not angebot:
        sys.exit("Im Text fehlt das Angebot („behandlung“).")
    regel = M.MODULE.get(M.REGELN_VON_BEHANDLER.get(d.get("behandler_art") or "", ""))
    mod = M.MODULE.get(angebot)
    if mod is None:  # eigenes Angebot: allgemeine Texte, Regeln nach dem Behandler
        regel = regel or M.MODULE["Permanent Make-up"]
        mod = {**M.ALLGEMEIN, "name": angebot, "regeln": regel["regeln"], "qualifikation": regel["qualifikation"],
               "recht_kurz": regel["recht_kurz"], "annahmen": regel["annahmen"], "behandler": regel["behandler"]}
    r, k = mod["regeln"], mod["kuerzel"]
    leer = lambda x, name: x if x not in (None, "") else f"[{name}]"
    f = {"betrieb": d["betrieb"], "betrieb_lang": d.get("firma") or d["betrieb"], "telefon": d.get("telefon", ""), "email": d.get("email", ""),
         "inhaber": d.get("inhaber", ""), "adresse": d.get("adresse", ""), "slug": d["kuerzel"], "modul_name": mod["name"], "modul": k,
         "kampagne_kuerzel": k, "umkreis_km": str(zahl(d.get("umkreis"), 15)), "qualifikation": mod["qualifikation"],
         "impressum_url": leer(d.get("impressum"), "Impressum-Link fehlt"), "datenschutz_url": leer(d.get("datenschutz"), "Datenschutz-Link fehlt"),
         "behandler_name": d.get("behandler") or "", "angebot": angebot,
         "behandler_name_kurz": (str(d.get("behandler") or "").split(",")[0].replace("Dr. med. dent. ", "Dr. ").replace("Dr. med. ", "Dr. ") or "unser Team"), "zentrale_url": d.get("zentrale") or "", "agentur_name": (d.get("agentur") or {}).get("name", "Clickculture")}
    m = re.search(r"\d{5}\s+(.+)$", f["adresse"])
    f["ort"] = m.group(1).strip() if m else "[Ort]"
    f["ort_klein"] = f["ort"].lower()
    tel = re.sub(r"\D", "", f["telefon"])
    f["telefon_link"] = "+49" + tel.lstrip("0") if tel and not tel.startswith("49") else ("+" + tel if tel else "+49")
    url = (d.get("seite") or f"https://{f['slug']}.netlify.app").rstrip("/")
    f["landingpage_url"] = url
    f["landingpage_domain"] = re.sub(r"^https?://", "", url)
    if not re.fullmatch(r"https://script\.google\.com/macros/s/[\w-]+/exec", f["zentrale_url"]):
        hinweise.append("Die Adresse der Zentrale fehlt oder sieht falsch aus: Die Seite zeigt dann nur Beispiel-Termine.")
        f["zentrale_url"] = ""
    for x in ("impressum", "datenschutz"):
        if not d.get(x):
            hinweise.append(f"{x.capitalize()}-Link fehlt: So nicht live gehen (Schritte-Seite des Studios).")
    if (d.get("behandler_art") or "") and d["behandler_art"] not in mod["behandler"]:
        hinweise.append(f"„{d['behandler_art']}“ darf {mod['name']} nicht anbieten bzw. bewerben. So nicht live gehen.")
    arzt = d.get("behandler_art") in ("Arzt/Ärztin", "Zahnarztpraxis")
    f["fach_beratung"] = "Ärztliche Beratung" if arzt else "Persönliche Beratung"
    # Leistungen: alle buchbar. Eine „Beratung“ (Analyse, Erstgespräch …) erkennen wir am Namen
    leist = [{"name": str(l.get("name", "")).strip(), "minuten": zahl(l.get("minuten"), 0), "preis": str(l.get("preis") or "").strip()}
             for l in d.get("leistungen") or []]
    leist = [l for l in leist if l["name"] and l["minuten"] > 0]
    if not leist:
        sys.exit("Keine Leistungen in den Daten. Bitte im Formular der Zentrale eintragen.")
    f["_leistungen"] = leist
    ber = next((l for l in leist if BERATUNG.search(l["name"])), None)
    gratis = ber is not None and re.sub(r"[^\d,.]", "", ber["preis"]).strip(",.0") == ""
    f["_beratung"] = ber is not None
    f["beratung_name"] = ber["name"] if ber else "Termin"
    f["beratung_minuten"] = str(ber["minuten"]) if ber else str(leist[0]["minuten"])
    f["beratung_wort"] = "kostenlos" if (gratis and r["kostenlos"]) else "unverbindlich"
    mitpreis = [l for l in leist if l["preis"] and l is not ber and re.search(r"\d", l["preis"])]
    f["_preis"] = bool(mitpreis) and r["preise"]
    f["leistung_1"] = mitpreis[0]["name"] if mitpreis else ""
    f["preis_1"] = preis_text(mitpreis[0]["preis"]) if mitpreis else ""
    if not ber:
        hinweise.append("Keine Beratung unter den Leistungen: Anzeigen, die eine Beratung/Analyse versprechen, lasse ich weg.")
    # Buchung, Absage, Vorbereitung
    f["_wunsch"] = d.get("modus") == "Wunschtermin"
    absage = zahl(d.get("absagefrist"), 24)
    f["absagefrist_text"] = f"{absage} Stunden vor dem Termin"
    f["ausfall_regel"] = d.get("ausfall") or ""
    f["_vorbereitung"] = [x.strip() for x in str(d.get("vorbereitung") or "").split("•") if x.strip()] or mod["vorbereitung"]
    f["oeffnungszeiten"] = "Online-Termine: " + str(d.get("zeiten") or "").replace(";", " ·")
    # Regeln, Budget, Google
    regeln = [("Verlosung", r["verlosung"]), ("Vorher/Nachher-Fotos", r["vorher_nachher"]), ("Rabatte, Neukundenpreis", r["rabatt"]),
              ("das Wort „kostenlos“", r["kostenlos"]), ("Preise in der Werbung", r["preise"])]
    f["regeln_liste"] = "\n".join(f"- {'✓ erlaubt' if an else '✗ nicht erlaubt'}: {name}" for name, an in regeln) + \
        f"\n- Wer darf behandeln: {mod['qualifikation']}\n- Kurz: {mod['recht_kurz']}" + \
        ("\n- Nie das Wort „Botox“, nie Makel ansprechen („Sie haben Falten?“), keine Garantie, kein „schmerzfrei“." if k == "falten" else "")
    budget = zahl(d.get("budget"), 0)
    meta, google = budget, 0  # erstmal nur Meta (Nutzer-Vorgabe 21.11.2026)
    f["budget_meta"], f["budget_google"] = euro(meta), euro(google)
    f["budget_meta_tag"] = euro(round(meta / 30)) if meta else "[Tagesbudget Meta]"
    f["budget_google_tag"] = euro(round(google / 30)) if google else "[Tagesbudget Google]"
    f["cpc_limit"] = "2,50 €" if k in ("laser", "pmu") else "4,00 €"
    f["_verlosung"] = False
    # Neukundenangebot (Pflichtfeld im Formular) und Gewinnspiel (aus der Zentrale)
    nk = d.get("angebot") or {}
    f["_nk"] = bool(str(nk.get("text") or "").strip())
    f["nk_text"] = str(nk.get("text") or "").strip()
    f["nk_leistung"] = str(nk.get("leistung") or "").strip()
    f["nk_normal_satz"] = f" Regulär {nk['normal']}." if nk.get("normal") else ""
    f["nk_bis_satz"] = f", nur bis {nk['bis']}" if nk.get("bis") else ""
    f["nk_bis_kurz"] = f" · bis {nk['bis'][:6]}" if nk.get("bis") else ""
    gs = d.get("gewinnspiel") or {}
    gw = [str(x).strip().strip("/,;").strip() for x in (gs.get("gewinne") or []) if str(x).strip().strip("/,;").strip()]
    f["_gs"] = bool(gw) and r["verlosung"]
    anzahl = lambda x: int(m.group(1)) if (m := re.match(r"^(\d+)\s*[x×]", x)) else 1
    f["gs_haupt"] = re.sub(r"^\d+\s*[x×]\s*", "", gw[0]) if gw else ""
    f["gs_haupt_kurz"] = re.sub(r"\s*\(.*?\)", "", f["gs_haupt"]).strip()
    f["gs_weitere_satz"] = (" Dazu: " + ", ".join(gw[1:]) + ".") if len(gw) > 1 else ""
    # Kurzform fürs Bild: „+ 2× 20 % + 3× 40 % auf deinen nächsten Termin“ (gleiche Endung nur einmal)
    teile = [re.match(r"^(?:(\d+)\s*[x×]\s*)?(\d+\s*%)\s*(.*)$", x) for x in gw[1:]]
    if teile and all(teile) and len({t.group(3) for t in teile}) == 1:
        f["gs_weitere_kurz"] = " ".join(f"+ {t.group(1) or 1}×\u00a0{t.group(2)}" for t in teile) + ("\n" + teile[0].group(3) if teile[0].group(3) else "")
    else:
        f["gs_weitere_kurz"] = " ".join("+ " + x for x in gw[1:])
    f["gs_anzahl"] = str(sum(anzahl(x) for x in gw)) if gw else ""
    f["gs_bis"] = gs.get("bis") or ""
    f["gs_bis_kurz"] = (gs.get("bis") or "")[:6]
    f["gs_ziehung"] = gs.get("ziehung") or ""
    f["gs_tnb"] = gs.get("bedingungen") or "[Link zu den Teilnahmebedingungen]"
    offen = not gs.get("bis")
    f["gs_lostopf"] = ("Im Lostopf: wer einen Termin bucht und hinkommt. Jeden Monat neu verlost. Ab 18." if offen
                       else f"Im Lostopf: wer bis {f['gs_bis_kurz']} einen Termin bucht und hinkommt. Ab 18.")
    f["gs_kicker_zeit"] = "Jeden Monat neu" if offen else f"Nur bis {f['gs_bis_kurz']}"
    f["gs_ablauf"] = ("deinen ersten Termin online buchen und hinkommen." if offen
                      else f"bis {f['gs_bis']} deinen ersten Termin online buchen und hinkommen.")
    f["gs_ziehung_satz"] = ("Wir verlosen jeden Monat neu, am 1. unter allen, die im Vormonat zu ihrem Termin gekommen sind." if offen
                            else f"Ziehung am {f['gs_ziehung']} unter allen, die zu ihrem Termin gekommen sind.")
    f["zielgruppe_alter"] = mod["zielgruppe"]["alter"]
    f["zielgruppe_geschlecht"] = mod["zielgruppe"]["geschlecht"]
    fa = mod["farben"]
    f["farben_css"] = (f"--bg:{fa['bg']};--ink:{fa['ink']};--ink2:{fa['ink']}CC;--muted:#6B665D;--line:{fa['soft']};"
                       f"--accent:{fa['accent']};--soft:{fa['soft']};--dunkel:{fa['dunkel']};--hell:{fa['hell']};")
    return f, mod, hinweise


def kuerzen(text, n, f):
    """Google erlaubt 30 Zeichen je Überschrift, 90 je Beschreibung. Erst Zusätze und Ort weglassen, dann an einer Wortgrenze kürzen."""
    if len(text) <= n:
        return text
    for versuch in (text.split(" inkl.")[0], text.replace(" in " + f.get("ort", ""), ""), text.replace(" " + f.get("ort", ""), "")):
        if len(versuch) <= n:
            return versuch.strip()
    kurz = text[:n + 1].rsplit(" ", 1)[0].rstrip(",:;–-")
    return kurz


def seiten_felder(f, mod, fotos):
    """Bausteine der Terminseite."""
    r, lp, k = mod["regeln"], mod["lp"], mod["kuerzel"]
    s = {}
    s["seiten_titel"] = fuellen(lp["titel"], f)
    s["meta_beschreibung"] = esc(re.sub(r"<[^>]+>", "", fuellen(lp["sub"], f) if f["_beratung"] else f"{mod['name']} bei {f['betrieb']} in {f['ort']}: Termin online buchen."))
    s["lp_kicker"] = fuellen(lp["kicker"], f)
    s["lp_h1"] = fuellen(lp["h1"], f)
    s["lp_sub"] = esc(fuellen(lp["sub"], f) if f["_beratung"] else "Freie Termine sehen und direkt online buchen. Die Bestätigung kommt per E-Mail.")
    if f.get("_nk"):
        s["lp_sub"] = "<b>Neukundinnen: " + esc(f["nk_text"]) + "</b>" + esc(f["nk_bis_satz"]) + ". Freien Termin wählen und direkt hier buchen."
    s["foto_alt"] = esc(f"{mod['name']} bei {f['betrieb']}")
    s["schritte_html"] = "".join(f"<div><b>{i}</b>{esc(fuellen(t, f))}</div>" for i, t in enumerate(lp["schritte"], 1))
    s["vorteile_titel"] = "Was Sie erwartet"
    s["vorteile_html"] = "".join(f"<li>{esc(fuellen(v, f))}</li>" for v in lp["vorteile"])
    s["hinweis"] = esc(fuellen(lp["hinweis"], f))
    s["faq_html"] = "\n    ".join(f"<details><summary>{esc(fuellen(q, f))}</summary><p>{esc(fuellen(a, f))}</p></details>" for q, a in lp["faq"])
    s["final_titel"] = "Ihr erster Schritt: <em>ein Termin.</em>" if k != "falten" else "Erst beraten, <em>dann entscheiden.</em>"
    # Preise (nur wo erlaubt und vorhanden)
    leist = f["_leistungen"]
    if leist:
        zeilen = "".join(f"<tr><td>{esc(l['name'])}<small>{l['minuten']} Min.</small></td><td>{esc(preis_text(l['preis'])) if r['preise'] else ''}</td></tr>" for l in leist)
        zusatz = {"laser": "Preise pro Sitzung. Meist sind 6–8 Sitzungen nötig; den Gesamtpreis nennen wir Ihnen vorab.",
                  "pmu": "Preise inklusive Beratung, Vorzeichnen und Nachstechtermin.",
                  "bleaching": "Ob vorher eine Zahnreinigung nötig ist, klären wir im Erstgespräch."}.get(k, "")
        mitp = r["preise"] and any(l["preis"] for l in leist)
        s["leistungen_html"] = (f'  <section>\n    <h2>{"Leistungen und Preise" if mitp else "Leistungen"}</h2>\n    <table class="preise">{zeilen}</table>\n'
                                f'    <p class="hinweis">{esc(zusatz) + " Alle Preise inklusive Mehrwertsteuer." if mitp else "Alle Leistungen sind online buchbar."}</p>\n  </section>\n')
    else:
        s["leistungen_html"] = ""
    # Ergebnisse (Vorher/Nachher) nur wo erlaubt und mit echten Fotos
    if r["vorher_nachher"] and fotos.get("vorher") and fotos.get("nachher"):
        s["ergebnisse_html"] = ('  <section>\n    <h2>Ein Ergebnis aus unserem Studio</h2>\n    <div class="tiles"><figure><img src="fotos/vorher.jpg" alt="Vorher" loading="lazy">'
                                '<figcaption>Vorher</figcaption></figure><figure><img src="fotos/nachher.jpg" alt="Nachher" loading="lazy"><figcaption>Nachher</figcaption></figure></div>\n'
                                '    <p class="hinweis">Echtes Ergebnis einer Kundin, mit ihrer Zustimmung gezeigt. Ergebnisse sind individuell.</p>\n  </section>\n')
    else:
        s["ergebnisse_html"] = ""
    # Behandler/in
    if f["behandler_name"]:
        text = {"laser": "Behandelt wird bei uns nur mit Fachkundenachweis nach NiSV.",
                "pmu": "Jede Form wird gemeinsam mit Ihnen vorgezeichnet, bevor pigmentiert wird.",
                "falten": "Vor jeder Behandlung steht ein ausführliches Gespräch mit Aufklärung.",
                "bleaching": "Vor jeder Aufhellung untersuchen wir Zähne und Zahnfleisch.",
                "allgemein": "Vor jeder Behandlung nehmen wir uns Zeit für Ihre Fragen."}[k]
        s["person_html"] = (f'  <section>\n    <h2>Wer Sie behandelt</h2>\n    <div class="person"><div class="bild" style="background-image:url(fotos/foto-3.jpg)"></div>'
                            f'<div><b>{esc(f["behandler_name"])}</b><p>{esc(text)}</p></div></div>\n  </section>\n')
    else:
        s["person_html"] = ""
    s["bewertungen_html"] = ""  # Bewertungen nur echte; bei Bedarf später ergänzen
    # Einwilligung (Art. 9 DSGVO ausdrücklich, weil schon der Behandlungswunsch ein Gesundheitsdatum sein kann)
    s["einwilligung_text"] = (f"Ich willige ausdrücklich ein, dass {esc(f['betrieb'])} meine Angaben einschließlich der gewünschten Behandlung "
                              f"verarbeitet, um den Termin zu vereinbaren und mich daran zu erinnern (Art. 9 Abs. 2 lit. a DSGVO). "
                              f"Ich kann die Einwilligung jederzeit widerrufen.")
    s["einwilligung_rueckruf"] = (f"Ich willige ausdrücklich ein, dass {esc(f['betrieb'])} meine Angaben einschließlich meines Interesses an "
                                  f"{esc(mod['name'])} verarbeitet, um mich zurückzurufen (Art. 9 Abs. 2 lit. a DSGVO). Widerruf jederzeit möglich.")
    s["ausfall_html"] = (f'        <label class="check"><input type="checkbox" name="ausfall" required> <span>{esc(f["ausfall_regel"])}</span></label>\n'
                         if f["ausfall_regel"] else "")
    s["verlosung_link_html"] = ' · <a href="verlosung.html">Verlosung</a>' if f["_verlosung"] else ""
    s["buchung_cfg"] = json.dumps({
        "zentrale": f["zentrale_url"], "kunde": f["slug"], "telefon": f["telefon"], "telefon_link": f["telefon_link"],
        "leistungen": [{"name": l["name"], "minuten": l["minuten"], "preis": preis_text(l["preis"]) if r["preise"] else ""} for l in leist],
    }, ensure_ascii=False).replace("</", "<\\/")
    s["seite_cfg"] = json.dumps({
        "zentrale": f["zentrale_url"], "telefon": f["telefon"], "telefon_link": f["telefon_link"], "betrieb": f["betrieb"],
        "vorbereitung": f["_vorbereitung"], "ausfall": f["ausfall_regel"],
    }, ensure_ascii=False).replace("</", "<\\/")
    return s


def anzeigen_html(f, mod):
    alle = list(mod["anzeigen"])
    if f.get("_nk") and not f.get("_kampagne") and not any(a["id"] == "n1-angebot" for a in alle):
        alle = [M.ANGEBOT_ANZEIGE] + alle
    # Nur versprechen, was das Studio anbietet: Preis-Anzeige braucht einen Preis, Beratungs-Anzeigen eine Beratung
    text = lambda a: " ".join(str(a.get(x, "")) for x in ("kicker", "h1", "sub", "fine", "primaer", "headline", "beschreibung"))
    alle = [a for a in alle if (f["_preis"] or "{{preis_1}}" not in text(a)) and (f["_beratung"] or "{{beratung_" not in text(a))
            and (f.get("_nk") or "{{nk_" not in text(a)) and (f.get("_gs") or "{{gs_" not in text(a))]
    alle = [{**a, "leistung": fuellen(a["leistung"], f)} if a.get("leistung") else a for a in alle]
    teile, vorschau = [], []
    for a in alle:
        t = {x: fuellen(a.get(x, ""), f) for x in ("kicker", "h1", "sub", "fine", "cta", "primaer", "headline", "beschreibung")}
        # Überschrift: zusammengehörige Teile nicht trennen („+ 1. Auffüllen“), lange Überschriften etwas kleiner
        t["h1"] = re.sub(r"(\+|\d\.) ", "\\1\u00a0", t["h1"])
        t["h1"] = re.sub(r" (€|%)", "\u00a0\\1", t["h1"])
        t["sub"] = re.sub(r" (€|%)", "\u00a0\\1", re.sub(r"(\+|\d\.) ", "\\1\u00a0", t["sub"]))
        lang = len(re.sub(r"<[^>]+>", "", t["h1"])) > (34 if a["stil"] == "g" else 40)
        fd = f.get("_fotos_da") or {}
        foto = a["foto"] if fd.get(a["foto"], True) else FOTO_ERSATZ.get(a["foto"], "foto-1")
        teile.append(f'<div class="ad {a["stil"]}" data-creative="{a["id"]}">\n <div class="photo" style="background-image:url(fotos/{foto}.jpg)"></div>\n'
                     f' <div class="band"><p class="kicker">{esc(t["kicker"])}</p><h1{' class="lang"' if lang else ''}>{t["h1"]}</h1><p class="sub">{esc(t["sub"])}</p></div>\n'
                     f' <div class="cta">{esc(t["cta"])} <span>→</span></div>\n'
                     + (f' <p class="fine">{esc(t["fine"])}</p>\n' if a["stil"] == "g" and t["fine"] else '') + '</div>')
        vorschau.append(f'  <div class="ad"><div class="top"><div class="pic"></div><div class="who"><b>{esc(f["betrieb"])}</b><span>Gesponsert · 🌐</span></div></div>\n'
                        f'    <div class="txt">{esc(t["primaer"])}</div>\n    <img src="creatives/{a["id"]}.png" alt="{esc(a["id"])}">\n'
                        f'    <div class="card"><div><span class="u">{esc(f["landingpage_domain"])}</span><b>{esc(t["headline"])}</b><small>{esc(t["beschreibung"])}</small></div>'
                        f'<span class="btn">Jetzt buchen</span></div></div>')
        a["_t"] = t
    return "\n\n".join(teile), "\n".join(vorschau), alle


def meta_md(f, alle):
    zeilen = []
    for i, a in enumerate(alle, 1):
        t = a["_t"]
        ziel = "verlosung.html" if a["id"].startswith("v") else "termin.html" + ("?l=" + quote(a["leistung"]) if a.get("leistung") else "")
        zeilen.append(f"**{i} · {a['id']}** · Bild `{a['id']}.png` · Quell-URL `{f['landingpage_url']}/{ziel}` · "
                      f"URL-Parameter `utm_source=meta&utm_campaign={f['kampagne_kuerzel']}-{a['id'].split('-')[0]}`\n"
                      f"- Primärtext: {t['primaer'].replace(chr(10), chr(10) + '  ')}\n- Überschrift: {t['headline']}\n- Beschreibung: {t['beschreibung']}\n")
    if f["_verlosung"]:
        zeilen.append("Die Verlosungs-Anzeige in eine **eigene Kampagne** `Beauty – Verlosung – " + f["betrieb"] + "` (gleiche Einstellungen), "
                      "Budget in dieser Zeit etwa hälftig aufteilen.\n")
    return "\n".join(zeilen)


def fotos_uebernehmen(dateien, ordner):
    ordner.mkdir(parents=True, exist_ok=True)
    frei = list(FOTO_NAMEN[:8])
    for d in dateien:
        d = pathlib.Path(d)
        stamm = d.stem.lower().replace("_", "-").replace(" ", "-")
        name = next((n for n in ["vorher", "nachher"] + FOTO_NAMEN[:8] if n in stamm), None)
        if name is None:
            name = frei.pop(0) if frei else None
        elif name in frei:
            frei.remove(name)
        if name is None:
            print(f"! {d.name}: kein Platz mehr (höchstens foto-1 … foto-8, vorher, nachher)")
            continue
        for alt in ordner.glob(name + ".*"):
            alt.unlink()
        shutil.copy2(d, ordner / (name + d.suffix.lower()))
        print(f"✓ Foto {d.name} → fotos/{name}{d.suffix.lower()}")


def fotos_fuer_web(quelle, ziel):
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
        except Exception as e:
            print(f"! {q.name} nicht umgewandelt ({e}), nehme das Original")
            shutil.copy2(q, z)


def kopiere_ordner(quelle, ziel):
    ziel.mkdir(parents=True, exist_ok=True)
    for q in quelle.iterdir():
        shutil.copy2(q, ziel / q.name)




def fotos_sammeln(argumente, tmp):
    """Einzelne Bilder, Ordner oder ZIP (z. B. „Herunterladen“ aus Google Drive) → Liste von Bilddateien, sortiert."""
    out = []
    for a in argumente:
        p = pathlib.Path(a)
        if p.is_dir():
            out += sorted(x for x in p.rglob("*") if x.suffix.lower() in BILDER and not x.name.startswith("."))
        elif p.suffix.lower() == ".zip":
            z = tmp / p.stem
            with zipfile.ZipFile(p) as zf:
                for info in zf.infolist():
                    name = pathlib.PurePosixPath(info.filename)
                    if name.suffix.lower() in BILDER and not name.name.startswith(".") and "__MACOSX" not in info.filename:
                        ziel = z / name.name
                        ziel.parent.mkdir(parents=True, exist_ok=True)
                        ziel.write_bytes(zf.read(info))
                        out.append(ziel)
        elif p.suffix.lower() in BILDER:
            out.append(p)
        else:
            print(f"! {p.name}: weder Bild noch Ordner noch ZIP, übersprungen")
    return out


def daten_lesen(pfad):
    roh = pathlib.Path(pfad).read_text(encoding="utf-8")
    a, b = roh.find("{"), roh.rfind("}")
    d = json.loads(roh[a:b + 1])
    if d.get("typ") != "clickculture-beauty-studio":
        sys.exit("Das ist nicht der „Text für Claude“ aus der Beauty-Zentrale.")
    return d


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    d = daten_lesen(sys.argv[1])
    f, mod, warnungen = felder(d)
    ziel = KUNDEN / f["slug"]
    print(f"Studio: {f['betrieb']} · {mod['name']}  →  {ziel.relative_to(BEAUTY.parent.parent)}")
    ziel.mkdir(parents=True, exist_ok=True)
    (ziel / "daten.json").write_text(json.dumps(d, ensure_ascii=False, indent=1), encoding="utf-8")
    for alt in ("landingpage", "dokumente", "README.md", "zentrale-zeile.txt", "steckbrief.xlsx"):  # Reste der alten Version
        q = ziel / alt
        shutil.rmtree(q, ignore_errors=True) if q.is_dir() else q.unlink(missing_ok=True)

    # Fotos: neue übernehmen; fehlende sind Platzhalter des Moduls (sichtbar als solche markiert)
    with tempfile.TemporaryDirectory() as tmp:
        fotos_uebernehmen(fotos_sammeln(sys.argv[2:], pathlib.Path(tmp)), ziel / "fotos")
    platz = VORLAGEN / "assets" / "fotos" / mod["kuerzel"]
    platzhalter = []
    for n in FOTO_NAMEN[:3]:
        vorhanden = list((ziel / "fotos").glob(n + ".*"))
        ist_platz = vorhanden and vorhanden[0].suffix == ".jpg" and any(
            vorhanden[0].read_bytes() == p.read_bytes() for p in (VORLAGEN / "assets" / "fotos").glob("*/" + n + ".jpg"))
        if not vorhanden or ist_platz:
            for alt in vorhanden:
                alt.unlink()
            shutil.copy2(platz / (n + ".jpg"), ziel / "fotos" / (n + ".jpg"))
            platzhalter.append(n)
    if platzhalter:
        warnungen.append("Noch Platzhalter-Fotos statt echter: " + ", ".join(platzhalter) + ". Vor dem Livegang echte Fotos schicken.")
    fotos = {n: bool(list((ziel / "fotos").glob(n + ".*"))) for n in FOTO_NAMEN}

    # Seite für Netlify
    lp = ziel / "seite"
    shutil.rmtree(lp, ignore_errors=True)
    lp.mkdir()
    kopiere_ordner(VORLAGEN / "assets" / "fonts", lp / "fonts")
    fotos_fuer_web(ziel / "fotos", lp / "fotos")
    if not mod["regeln"]["vorher_nachher"]:
        for n in ("vorher", "nachher"):
            (lp / "fotos" / (n + ".jpg")).unlink(missing_ok=True)
    sf = {**f, **seiten_felder(f, mod, fotos)}
    for name in STATISCH:
        shutil.copy2(VORLAGEN / "landingpage" / name, lp / name)
    for name in SEITEN:
        (lp / name).write_text(fuellen((VORLAGEN / "landingpage" / name).read_text(encoding="utf-8"), sf), encoding="utf-8")
    (lp / "index.html").write_text(
        '<!DOCTYPE html><html lang="de"><head><meta charset="UTF-8"><meta name="robots" content="noindex">'
        '<meta name="viewport" content="width=device-width, initial-scale=1">'
        f'<title>{esc(f["betrieb"])}</title><meta http-equiv="refresh" content="0; url=termin.html">'
        '<script>location.replace("termin.html" + location.search);</script></head>'
        '<body><a href="termin.html">Weiter zur Terminbuchung</a></body></html>', encoding="utf-8")
    offen = re.findall(r"\[[A-ZÄÖÜ][^\]\n]{2,60}\]", " ".join(p.read_text(encoding="utf-8") for p in lp.glob("*.html")))
    print("✓ seite/ (" + ", ".join(sorted(p.name for p in lp.glob("*.html"))) + ")")

    # Anzeigen (läuft ein Gewinnspiel, sind die Gewinnspiel-Anzeigen die Hauptkampagne)
    if f.get("_gs"):
        mod = {**mod, "anzeigen": list(M.GEWINNSPIEL)}
    anz_html, vorschau_html, alle = anzeigen_html({**f, "_fotos_da": fotos, "_kampagne": bool(f.get("_gs"))}, mod)
    f["meta_anzeigen_md"] = meta_md(f, alle)
    an = ziel / "anzeigen"
    shutil.rmtree(an, ignore_errors=True)
    an.mkdir()
    kopiere_ordner(VORLAGEN / "assets" / "fonts", an / "fonts")
    fotos_fuer_web(ziel / "fotos", an / "fotos")
    af = {**f, "anzeigen_html": anz_html, "vorschau_html": vorschau_html,
          "regel_hinweis": {"falten": "Für Faltenbehandlung gilt das Heilmittelwerbegesetz: kein „Botox“, kein Vorher/Nachher, keine Rabatte, kein „kostenlos“.",
                            "bleaching": "Für Zahnärzte gilt die Berufsordnung: sachlich, ohne Rabatte und Verlosungen.",
                            "laser": "„Dauerhaft“ steht nie ohne den Hinweis auf mehrere Sitzungen.",
                            "pmu": "Ergebnisfotos nur echte, mit Zustimmung der Kundin.",
                            "allgemein": mod["recht_kurz"]}[mod["kuerzel"]]}
    (an / "anzeigen.html").write_text(fuellen((VORLAGEN / "anzeigen" / "anzeigen.html").read_text(encoding="utf-8"), af), encoding="utf-8")
    (an / "vorschau.html").write_text(fuellen((VORLAGEN / "anzeigen" / "vorschau.html").read_text(encoding="utf-8"), af), encoding="utf-8")
    try:
        subprocess.run(["node", str(HIER / "creatives-rendern.js"), str(an / "anzeigen.html")], check=True, capture_output=True, text=True)
        print(f"✓ anzeigen/creatives/ ({len(alle)} Bilder)")
    except Exception as e:
        print("! Anzeigen nicht gerendert (Node/Playwright fehlt?):", e)

    # Anzeigen auch auf die Seite (Unterordner „anzeigen“): Dort sieht das Studio sie vor dem Start und gibt sie frei
    va = lp / "anzeigen"
    va.mkdir(exist_ok=True)
    if (an / "creatives").exists():
        kopiere_ordner(an / "creatives", va / "creatives")
    (va / "vorschau.html").write_text((an / "vorschau.html").read_text(encoding="utf-8").replace("../seite/termin.html", "../termin.html")
                                      .replace("<head>", '<head><meta name="robots" content="noindex">', 1), encoding="utf-8")

    # Kampagnen-Anleitung und LIES-MICH
    kampagnen = fuellen((VORLAGEN / "texte" / "kampagnen.md").read_text(encoding="utf-8"), f)
    (ziel / "kampagnen.md").write_text(kampagnen, encoding="utf-8")
    sys.path.insert(0, str(HIER))
    import kampagnen_assistent
    (ziel / "kampagnen.html").write_text(kampagnen_assistent.bauen(kampagnen, f["betrieb"], f["slug"]), encoding="utf-8")
    f["warnungen"] = "\n".join(f"- ⚠ {w}" for w in warnungen) or "- Nichts. Alles da."
    f["v"] = dt.datetime.now().strftime("%Y%m%d%H%M")
    (ziel / "LIES-MICH.md").write_text(fuellen((VORLAGEN / "texte" / "_kunden-readme.md").read_text(encoding="utf-8"), f), encoding="utf-8")
    print("✓ kampagnen.html (Assistent), kampagnen.md, LIES-MICH.md")
    if offen:
        warnungen.append("Auf der Seite stehen noch Lücken: " + ", ".join(sorted(set(offen))))
    for w in warnungen:
        print("! " + w)


if __name__ == "__main__":
    main()
