#!/usr/bin/env python3
"""Legt aus einem ausgefüllten Beauty-Steckbrief den kompletten Kundenordner an.

Aufruf (aus dem Repo-Hauptordner):
    python3 nischen/beauty/vorlagen/werkzeuge/kunde-anlegen.py <steckbrief.xlsx> [fotos ...]

Liest:     den Steckbrief (Blätter „Steckbrief“ und „Eure Daten“; alte Vorlagen: „Deine Daten“) und das Modul der Behandlung aus module.py
           optional Fotos: werden nach Namen zugeordnet (foto-1 = Behandlung, foto-2 = Studio, foto-3 = Behandler/in,
           vorher, nachher); jpg, png, heic, webp
Schreibt:  nischen/beauty/kunden/<kürzel>/
             README.md               Übersicht: was noch fehlt, Regeln der Behandlung, welche Datei wann
             zentrale-zeile.txt      die Zeile für das Blatt „Kunden“ der Beauty-Zentrale
             steckbrief.xlsx, fotos/
             dokumente/              Vereinbarung, Mails, Zugänge-, Kalender-Anleitung, Termin-Leitfaden, Kampagnen
             anzeigen/               anzeigen.html, vorschau.html, creatives/*.png
             landingpage/            der Ordner für Netlify: termin.html, danke.html, bestaetigen.html, absagen.html,
                                     rueckruf-danke.html, bei Verlosung verlosung.html; Fotos verkleinert

Mehrfach ausführen ist erlaubt und gewollt. Echte Kundenordner kommen NICHT ins Repo (öffentlich, .gitignore).
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
BEAUTY = VORLAGEN.parent
KUNDEN = BEAUTY / "kunden"
_spec = importlib.util.spec_from_file_location("module", VORLAGEN / "module.py")
M = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(M)

TEXTE = ["vereinbarung.md", "vertrag-mail.md", "abrechnung-mails.md", "willkommens-mail.md", "zugaenge-anleitung.md",
         "kalender-anleitung.md", "termin-leitfaden.md", "kampagnen.md"]
SEITEN = ["termin.html", "danke.html", "bestaetigen.html", "absagen.html", "rueckruf-danke.html"]
STATISCH = ["seite.css", "messung.js", "buchung.js"]
FOTO_NAMEN = ["foto-1", "foto-2", "foto-3", "vorher", "nachher"]
FOTO_MAX = 1600
MONATE = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"]
EURO = {"kundenwert", "onboarding_preis", "retainer", "budget_meta", "budget_google", "ausfallgebuehr"}
OFFEN_NACH_SCHRITT = [
    ("Für die Vereinbarung (Schritt 3–4)", ["betrieb", "anrede", "inhaber", "telefon", "email", "ort", "umkreis_km", "behandlung",
                                            "behandler", "termine_woche", "betrieb_lang", "strasse", "plz", "oeffnungszeiten",
                                            "onboarding_preis", "retainer", "budget_meta", "budget_google", "drive_link"]),
    ("Online-Buchung (Schritt 3–6)", ["buchung_modus", "buchbare_zeiten", "absagefrist_stunden"]),
    ("Vom Studio (Schritt 5)", ["behandler_name", "impressum_url", "datenschutz_url"]),
    ("Zum Einrichten (Schritt 6)", ["pixel_id"]),
]
OPTIONAL = [("Zum Einrichten (Schritt 6)", ["google_conversion"])]
AGENTUR_PFLICHT = ["agentur_name", "agentur_inhaber", "agentur_anschrift", "agentur_email", "agentur_telefon",
                   "agentur_business_id", "agentur_google_mcc", "agentur_google_email", "agentur_zentrale_url"]
CHECKS = ["check_entscheider", "check_qualifikation", "check_kalender", "check_fotos"]
FB_KATEGORIE = {"laser": "„Kosmetikstudio“ oder „Haarentfernungsdienst“", "pmu": "„Permanent Make-up-Studio“ oder „Kosmetikstudio“",
                "falten": "„Arzt“ bzw. „Medizinische Kosmetik“", "bleaching": "„Zahnarzt“"}
RECHT_KURZ = {
    "laser": "Wettbewerbsrecht und Preisangaben; „dauerhaft“ nur mit Hinweis auf mehrere Sitzungen und ohne Garantie",
    "pmu": "Wettbewerbsrecht und Preisangaben; Ergebnisfotos nur echte, Vorher/Nachher-Collagen nicht in Anzeigen",
    "falten": "Heilmittelwerbegesetz: kein „Botox“, kein Vorher/Nachher, keine Verlosung, keine Rabatte, kein „kostenlos“",
    "bleaching": "Berufsordnung der Zahnärzte und Heilmittelwerbegesetz: sachlich, keine Rabatte, keine Verlosung, kein „kostenlos“",
}


def lese_schluessel(pfad, blatt=None):
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


RECHTSFORMEN = {"gmbh": "GmbH", "ug": "UG", "ag": "AG", "kg": "KG", "ohg": "OHG", "gbr": "GbR", "e.k.": "e.K.", "mbh": "mbH"}


def aufbereiten(d):
    warnungen = []
    for k in ("betrieb", "betrieb_lang"):
        v = d.get(k)
        if isinstance(v, str):
            d[k] = " ".join(RECHTSFORMEN.get(w.lower(), w) for w in v.split(" "))
    for k in ("anrede", "check_entscheider", "check_qualifikation", "check_kalender", "check_fotos", "verlosung_aktiv",
              "vorbereitung_ok", "agentur_kleinunternehmer"):
        if isinstance(d.get(k), str):
            d[k] = d[k].strip().capitalize()
    for k in ("telefon", "agentur_telefon", "agentur_partner_telefon"):
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
                warnungen.append(f"{name} {s} endet auf 0: Excel speichert nur 15 Stellen genau. Bitte bei Meta vergleichen und als Text eintragen (ein ' davor).")
    return warnungen


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


def zahl(v, vorgabe):
    try:
        return int(float(v)) if v not in (None, "") else vorgabe
    except (TypeError, ValueError):
        return vorgabe


def leistungen_lesen(text):
    out = []
    for teil in str(text or "").split(";"):
        t = [x.strip() for x in teil.split("|")]
        if t and t[0] and len(t) > 1 and zahl(t[1], 0) > 0:
            out.append({"name": t[0], "minuten": zahl(t[1], 0), "preis": t[2] if len(t) > 2 else ""})
    return out


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


def team(f, stb, agentur, hinweise):
    """Ihr seid zu zweit: wer betreut dieses Studio (Ansprechpartner), wer macht die Technik, wie steht ihr im Vertrag."""
    p1, p2 = agentur.get("agentur_inhaber"), agentur.get("agentur_partner")
    personen = [(p1, agentur.get("agentur_telefon"), agentur.get("agentur_email"))]
    if p2:
        personen.append((p2, agentur.get("agentur_partner_telefon"), agentur.get("agentur_partner_email")))
    vorname = lambda n: str(n or "").split()[0].lower() if n else ""
    def finde(name):
        n = str(name or "").strip().lower()
        for p in personen:
            if p[0] and (n == str(p[0]).lower() or (n and vorname(n) == vorname(p[0]))):
                return p
        return None
    b = finde(stb.get("betreuer")) if stb.get("betreuer") else personen[0]
    if b is None:
        hinweise.append(f"Betreuer „{stb.get('betreuer')}“ steht nicht in „Eure Daten“. Ich nehme {p1 or 'Partner 1'}.")
        b = personen[0]
    f["betreuer_name"] = str(b[0]) if b[0] else "[Name des Betreuers]"
    f["betreuer_vorname"] = f["betreuer_name"].split()[0]
    f["betreuer_telefon"] = str(b[1]) if b[1] else "[Telefon des Betreuers]"
    f["betreuer_email"] = str(b[2]) if b[2] else "[E-Mail des Betreuers]"
    t = finde(agentur.get("agentur_technik")) if agentur.get("agentur_technik") else personen[0]
    f["technik_name"] = str((t or personen[0])[0] or "[Technik]")
    namen = [str(p[0]) for p in personen if p[0]]
    f["agentur_vertreter"] = " und ".join(namen) if namen else "[eure Namen]"
    andere = [n for n in namen if n != f["betreuer_name"]]
    f["team_vorstellung"] = (f"Wir sind zu zweit: {f['betreuer_name']} und {andere[0]}. Ihr fester Ansprechpartner bin ich, "
                             f"{f['betreuer_vorname']}. Erreichen Sie mich einmal nicht, hilft Ihnen {andere[0].split()[0]} genauso weiter."
                             if andere else "")


def felder(stb, agentur, namen):
    """Alle Platzhalter für Texte und Seiten. Gibt (f, modul, hinweise) zurück."""
    hinweise = []
    mod = M.MODULE.get(stb.get("behandlung") or "", None)
    if mod is None:
        hinweise.append("Behandlung fehlt oder ist unbekannt. Ich nehme vorläufig „Laser“. Bitte im Steckbrief wählen.")
        mod = M.MODULE["Laser"]
    r = mod["regeln"]
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
    k = mod["kuerzel"]
    team(f, stb, agentur, hinweise)
    f["modul_name"] = mod["name"]
    f["modul"] = k
    f["slug"] = slug(stb["betrieb"])
    f["kampagne_kuerzel"] = k
    behandler = stb.get("behandler") or ""
    if behandler and behandler not in mod["behandler"]:
        hinweise.append(f"„{behandler}“ darf {mod['name']} nicht anbieten bzw. bewerben ({mod['qualifikation']}). So nicht abschließen.")
    arzt = behandler == "Arzt/Ärztin"
    f["fach_beratung"] = "Ärztliche Beratung" if arzt else "Persönliche Beratung"
    f["beratung_wort"] = "kostenlos" if r["kostenlos"] else "unverbindlich"
    f["beratung_name"] = mod["beratung"]["name"]
    f["beratung_minuten"] = str(zahl(stb.get("beratung_minuten"), mod["beratung"]["minuten"]))
    bn = stb.get("behandler_name")
    f["behandler_name"] = bn or "[Name der Behandlerin / des Behandlers]"
    f["behandler_name_kurz"] = (bn.split(",")[0].replace("Dr. med. dent. ", "Dr. ").replace("Dr. med. ", "Dr. ") if bn else "[Name]")
    f["qualifikation"] = mod["qualifikation"]
    f["recht_kurz"] = RECHT_KURZ[k]
    f["fb_kategorie"] = FB_KATEGORIE[k]
    # Leistungen (direkt buchbar)
    leist = leistungen_lesen(stb.get("leistungen"))
    if leist and not r["direkt"]:
        hinweise.append(f"Bei {mod['name']} gibt es keine direkte Buchung (erst Beratung, dann Behandlung). Die Leistungen im Steckbrief werden nicht angezeigt.")
        leist = []
    f["_leistungen"] = leist
    f["leistung_1"] = leist[0]["name"] if leist else "[erste Leistung]"
    f["preis_1"] = (leist[0]["preis"] or "[Preis]") if leist else "[Preis]"
    f["direkt_satz"] = ("oder direkt einen Behandlungstermin: " + ", ".join(l["name"] for l in leist)) if leist else "Behandlungen werden danach vereinbart"
    f["direkt_kurz"] = ("direkt buchbar: " + ", ".join(l["name"] for l in leist)) if leist else "nur Beratung online"
    # Buchung
    modus = "Wunschtermin" if str(stb.get("buchung_modus") or "").lower().startswith("wunsch") else "Kalender"
    f["buchung_modus"] = modus
    f["_wunsch"] = modus == "Wunschtermin"
    if modus == "Kalender" and not stb.get("kalender_id"):
        hinweise.append("Modus „Kalender“, aber die Kalender-ID fehlt noch (Schritt 5, Anleitung 4c).")
    vorlauf, tage = zahl(stb.get("vorlauf_stunden"), 12), zahl(stb.get("tage_voraus"), 21)
    puffer, absage = zahl(stb.get("puffer_minuten"), 0), zahl(stb.get("absagefrist_stunden"), 24)
    f["vorlauf_text"] = f"{vorlauf} Stunden"
    f["tage_text"] = f"{tage} Tage"
    f["raster_text"] = f"alle {zahl(stb.get('raster_minuten'), 30)} Minuten"
    f["puffer_text"] = f", danach {puffer} Minuten Puffer" if puffer else ""
    f["absagefrist_text"] = f"{absage} Stunden vor dem Termin" if absage else "kurz vor dem Termin"
    gebuehr = stb.get("ausfallgebuehr")
    if isinstance(gebuehr, (int, float)) and gebuehr > 0:
        f["ausfall_regel"] = (f"Bei einer Absage später als {absage} Stunden vorher oder wenn Sie nicht kommen, berechnen wir "
                              f"{euro(gebuehr)}. Das gilt nicht, wenn Sie nachweisen, dass Sie das Versäumnis nicht zu vertreten haben "
                              f"oder uns kein oder ein geringerer Schaden entstanden ist.")
        f["ausfall_satz"] = "Ausfallgebühr: " + f["ausfall_regel"]
        f["ausfall_kurz"] = f"Ausfallgebühr {euro(gebuehr)}"
    else:
        f["ausfall_regel"] = ""
        f["ausfall_satz"] = "Eine Ausfallgebühr ist nicht vereinbart."
        f["ausfall_kurz"] = "keine Ausfallgebühr"
    # Vorbereitung
    eigene = [x.strip() for x in str(stb.get("vorbereitung") or "").split("•") if x.strip()]
    vorb = eigene or mod["vorbereitung"]
    f["_vorbereitung"] = vorb
    f["vorbereitung_liste"] = "\n".join(f"- {x}" for x in vorb)
    ok = str(stb.get("vorbereitung_ok") or "").lower() == "ja"
    f["vorbereitung_status"] = ("✓ Vom Studio freigegeben." if ok else
                                "⚠ **Noch nicht freigegeben.** " + ("Das ist der Vorschlag des Moduls. " if not eigene else "") +
                                "Das Studio muss die Hinweise prüfen (Willkommens-Mail, Punkt 5). Vorher nicht live gehen.")
    f["ablauf_bestaetigt"] = ("Sie bekommen eine Mail mit zwei Knöpfen: „Termin bestätigen“ oder „Passt nicht, ich rufe an“. Erst wenn Sie bestätigen, bekommt die Kundin ihre Bestätigung."
                              if f["_wunsch"] else "Der Termin steht sofort in Ihrem Google-Kalender, mit Name, Telefon und E-Mail. Sie bekommen zusätzlich eine Mail.")
    f["ablauf_kurz"] = " als Mail mit zwei Knöpfen (bestätigen oder anrufen)" if f["_wunsch"] else " direkt in Ihren Kalender und als Mail"
    f["kalender_pflicht"] = ("Bestätigung jedes Terminwunsches über die Knöpfe in der Mail, in den Geschäftszeiten innerhalb einer Stunde."
                             if f["_wunsch"] else
                             "Freigabe seines Google-Kalenders für den Auftragnehmer („Änderungen an Terminen vornehmen“) und Pflege des "
                             "Kalenders: Was dort nicht eingetragen ist, gilt als online buchbar.")
    # Fotos
    f["fotos_zusatz"] = ("   - Ergebnisfotos nur, wenn erlaubt (siehe unten) und mit schriftlicher Zustimmung der Kundin.\n" if r["vorher_nachher"] or k == "pmu"
                         else "   - Bitte **keine** Vorher-Nachher-Fotos: Für diese Behandlung sind sie in der Werbung verboten.\n")
    f["fotos_zusatz_mail"] = f["fotos_zusatz"].replace("   - ", "- ")
    # Regeln (für README, Kampagnen)
    regeln = [
        ("Verlosung", r["verlosung"]), ("Vorher/Nachher-Fotos", r["vorher_nachher"]), ("Rabatte, Neukundenpreis", r["rabatt"]),
        ("das Wort „kostenlos“", r["kostenlos"]), ("Preise in der Werbung", r["preise"]), ("Behandlung direkt buchen", r["direkt"]),
    ]
    f["regeln_liste"] = "\n".join(f"- {'✓ erlaubt' if an else '✗ nicht erlaubt'}: {name}" for name, an in regeln) + \
        f"\n- Wer darf behandeln: {mod['qualifikation']}\n- Kurz: {RECHT_KURZ[k]}" + \
        ("\n- Nie das Wort „Botox“, nie Makel ansprechen („Sie haben Falten?“), keine Garantie, kein „schmerzfrei“." if k == "falten" else "")
    # Adresse, Telefon, URL
    f["adresse"] = f"{f['strasse']}, {f['plz']} {f['ort']}"
    tel = re.sub(r"\D", "", str(stb.get("telefon") or ""))
    f["telefon_link"] = "+49" + tel.lstrip("0") if tel and not tel.startswith("49") else ("+" + tel if tel else "+49")
    f["inhaber_nachname"] = stb["inhaber"].split()[-1] if stb.get("inhaber") else "[Nachname]"
    f["ort_klein"] = stb["ort"].lower() if stb.get("ort") else "[ort]"
    url = (stb.get("landingpage_url") or f"https://{f['slug']}.netlify.app").rstrip("/")
    f["landingpage_url"] = url if url.startswith("http") else "https://" + url
    f["landingpage_domain"] = re.sub(r"^https?://", "", f["landingpage_url"])
    gc = str(stb.get("google_conversion") or "").strip().replace(" ", "")
    f["google_conversion"] = gc if re.fullmatch(r"AW-\d+/[\w-]+", gc) else ""
    if not stb.get("pixel_id"):
        f["pixel_id"] = "PIXEL_ID"
    if not stb.get("vertragsbeginn"):
        f["vertragsbeginn"] = dt.date.today().strftime("%d.%m.%Y")
    zent = str(agentur.get("agentur_zentrale_url") or "").strip()
    f["_zentrale"] = zent if re.fullmatch(r"https://script\.google\.com/macros/s/[\w-]+/exec", zent) else ""
    if agentur.get("agentur_zentrale_url") and not f["_zentrale"]:
        hinweise.append("Die Web-App-Adresse der Beauty-Zentrale sieht falsch aus (muss mit https://script.google.com/macros/s/ beginnen und auf /exec enden).")
    ku = str(agentur.get("agentur_kleinunternehmer") or "").lower()
    f["ust_hinweis"] = "Gemäß §19 UStG wird keine Umsatzsteuer berechnet." if ku == "ja" else "Alle Beträge zzgl. 19 % Umsatzsteuer."
    meta, google = stb.get("budget_meta") or 0, stb.get("budget_google") or 0
    f["budget_gesamt"] = euro(meta + google) if (meta or google) else "[Werbebudget]"
    f["budget_meta_tag"] = euro(round(meta / 30)) if meta else "[Tagesbudget Meta]"
    f["budget_google_tag"] = euro(round(google / 30)) if google else "[Tagesbudget Google]"
    f["cpc_limit"] = "2,50 €" if k in ("laser", "pmu") else "4,00 €"
    # Verlosung
    aktiv = str(stb.get("verlosung_aktiv") or "").lower() == "ja"
    if aktiv and not r["verlosung"]:
        hinweise.append(f"Verlosungen sind bei {mod['name']} nicht erlaubt. Die Verlosung wird nicht erzeugt.")
        aktiv = False
    f["_verlosung"] = aktiv
    f["aktion_ende_kurz"] = datum_kurz(stb["aktion_ende"]) if stb.get("aktion_ende") else "[Teilnahmeschluss]"
    f["aktionen_text"] = (f"Saisonaktion: Verlosung von {f['gewinn']}, Teilnahmeschluss {f['aktion_ende']}, Ziehung {f['ziehung']}. "
                          f"Kosten und Einlösung des Gewinns trägt der Auftraggeber." if aktiv else
                          "Saisonaktionen werden bei Bedarf gesondert in Textform vereinbart" +
                          (", soweit sie für diese Behandlung erlaubt sind." if r["verlosung"] else "; Verlosungen sind für diese Behandlung nicht erlaubt."))
    # Zielgruppe, Google
    f["zielgruppe_alter"] = mod["zielgruppe"]["alter"]
    f["zielgruppe_geschlecht"] = mod["zielgruppe"]["geschlecht"]
    g = mod["google"]
    f["google_keywords"] = "\n".join(f'"{fuellen(x, f)}"' for x in g["keywords"])
    f["google_negativ"] = "\n".join(g["negativ"])
    f["google_pfad"] = " / ".join(g["pfad"])
    f["google_headlines"] = "\n".join(f"    {i}. {kuerzen(fuellen(h, f), 30, f)}" for i, h in enumerate(g["headlines"], 1))
    f["google_descriptions"] = "\n".join(f"    {i}. {kuerzen(fuellen(d, f), 90, f)}" for i, d in enumerate(g["descriptions"], 1))
    f["google_titel"] = " | ".join(fuellen(h, f) for h in g["headlines"][:3])
    f["google_text"] = fuellen(g["descriptions"][0], f)
    f["google_hinweis"] = ("\n**Wichtig bei Faltenbehandlung:** Das Wort „Botox“ (und andere Markennamen) nie in Anzeigen oder Keywords: Google "
                           "sperrt verschreibungspflichtige Mittel. Kundenlisten, Remarketing und ähnliche Zielgruppen sind bei Schönheitsbehandlungen "
                           "nicht erlaubt. Lehnt Google eine Anzeige ab, die betroffene Überschrift weglassen, nicht umformulieren und neu einreichen.\n"
                           if k == "falten" else
                           "\n**Hinweis:** Kundenlisten und Remarketing für Schönheitsbehandlungen sind bei Google eingeschränkt. Nichts davon einrichten.\n")
    # Farben
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


def seiten_felder(f, mod, stb, fotos):
    """Bausteine der Terminseite."""
    r, lp, k = mod["regeln"], mod["lp"], mod["kuerzel"]
    s = {}
    s["seiten_titel"] = fuellen(lp["titel"], f)
    s["meta_beschreibung"] = esc(re.sub(r"<[^>]+>", "", fuellen(lp["sub"], f)))
    s["lp_kicker"] = fuellen(lp["kicker"], f)
    s["lp_h1"] = fuellen(lp["h1"], f)
    s["lp_sub"] = esc(fuellen(lp["sub"], f))
    s["foto_alt"] = esc(f"{mod['name']} bei {f['betrieb']}")
    s["schritte_html"] = "".join(f"<div><b>{i}</b>{esc(fuellen(t, f))}</div>" for i, t in enumerate(lp["schritte"], 1))
    s["vorteile_titel"] = "Was Sie erwartet"
    s["vorteile_html"] = "".join(f"<li>{esc(fuellen(v, f))}</li>" for v in lp["vorteile"])
    s["hinweis"] = esc(fuellen(lp["hinweis"], f))
    s["faq_html"] = "\n    ".join(f"<details><summary>{esc(fuellen(q, f))}</summary><p>{esc(fuellen(a, f))}</p></details>" for q, a in lp["faq"])
    s["final_titel"] = "Ihr erster Schritt: <em>ein Termin.</em>" if k != "falten" else "Erst beraten, <em>dann entscheiden.</em>"
    # Preise (nur wo erlaubt und vorhanden)
    leist = f["_leistungen"]
    if r["preise"] and leist:
        zeilen = "".join(f"<tr><td>{esc(l['name'])}<small>{l['minuten']} Min.</small></td><td>{esc(l['preis'])}</td></tr>" for l in leist)
        zusatz = {"laser": "Preise pro Sitzung. Meist sind 6–8 Sitzungen nötig; den Gesamtpreis nennen wir Ihnen vorab.",
                  "pmu": "Preise inklusive Beratung, Vorzeichnen und Nachstechtermin.",
                  "bleaching": "Ob vorher eine Zahnreinigung nötig ist, klären wir im Erstgespräch."}.get(k, "")
        s["leistungen_html"] = (f'  <section>\n    <h2>Leistungen und Preise</h2>\n    <table class="preise">{zeilen}</table>\n'
                                f'    <p class="hinweis">{esc(zusatz)} Alle Preise inklusive Mehrwertsteuer.</p>\n  </section>\n')
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
    if stb.get("behandler_name"):
        text = {"laser": "Behandelt wird bei uns nur mit Fachkundenachweis nach NiSV.",
                "pmu": "Jede Form wird gemeinsam mit Ihnen vorgezeichnet, bevor pigmentiert wird.",
                "falten": "Vor jeder Behandlung steht ein ausführliches Gespräch mit Aufklärung.",
                "bleaching": "Vor jeder Aufhellung untersuchen wir Zähne und Zahnfleisch."}[k]
        s["person_html"] = (f'  <section>\n    <h2>Wer Sie behandelt</h2>\n    <div class="person"><div class="bild" style="background-image:url(fotos/foto-3.jpg)"></div>'
                            f'<div><b>{esc(stb["behandler_name"])}</b><p>{esc(text)}</p></div></div>\n  </section>\n')
    else:
        s["person_html"] = ""
    # Bewertungen (nicht bei Faltenbehandlung: § 11 HWG Äußerungen Dritter)
    bew = [stb[x] for x in ("bewertung_1", "bewertung_2") if stb.get(x)]
    if bew and k != "falten":
        s["bewertungen_html"] = ('  <section>\n    <h2>Das sagen Kundinnen und Kunden</h2>\n    ' +
                                 "\n    ".join(f'<blockquote class="review">{esc(b)}</blockquote>' for b in bew) +
                                 '\n    <p class="hinweis">Echte Bewertungen von Google.</p>\n  </section>\n')
    else:
        s["bewertungen_html"] = ""
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
        "zentrale": f["_zentrale"], "kunde": f["slug"], "telefon": stb.get("telefon") or "", "telefon_link": f["telefon_link"],
        "beratung": {"name": f["beratung_name"], "minuten": int(f["beratung_minuten"]), "wort": f["beratung_wort"]},
        "leistungen": [{"name": l["name"], "minuten": l["minuten"], "preis": l["preis"] if r["preise"] else ""} for l in leist],
        "direkt": bool(leist),
    }, ensure_ascii=False).replace("</", "<\\/")
    s["seite_cfg"] = json.dumps({
        "zentrale": f["_zentrale"], "telefon": stb.get("telefon") or "", "telefon_link": f["telefon_link"], "betrieb": f["betrieb"],
        "beratung": f["beratung_name"], "vorbereitung": f["_vorbereitung"], "ausfall": f["ausfall_regel"],
    }, ensure_ascii=False).replace("</", "<\\/")
    return s


def anzeigen_html(f, mod):
    alle = list(mod["anzeigen"]) + ([mod["verlosung"]] if f["_verlosung"] and mod["verlosung"] else [])
    if not f["_leistungen"]:  # Preis-Anzeige braucht eine Leistung mit Preis
        alle = [a for a in alle if "{{preis_1}}" not in a["h1"]]
    teile, vorschau = [], []
    for a in alle:
        t = {x: fuellen(a[x], f) for x in ("kicker", "h1", "sub", "fine", "cta", "primaer", "headline", "beschreibung")}
        teile.append(f'<div class="ad {a["stil"]}" data-creative="{a["id"]}">\n <div class="photo" style="background-image:url(fotos/{a["foto"]}.jpg)"></div>\n'
                     f' <div class="band"><p class="kicker">{esc(t["kicker"])}</p><h1>{t["h1"]}</h1><p class="sub">{esc(t["sub"])}</p></div>\n'
                     f' <div class="cta">{esc(t["cta"])} <span>→</span></div>\n <p class="fine">{esc(t["fine"])}</p>\n</div>')
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
        ziel = "verlosung.html" if a["id"].startswith("v") else "termin.html"
        zeilen.append(f"**{i} · {a['id']}** · Bild `{a['id']}.png` · Quell-URL `{f['landingpage_url']}/{ziel}` · "
                      f"URL-Parameter `utm_source=meta&utm_campaign={f['kampagne_kuerzel']}-{a['id'].split('-')[0]}`\n"
                      f"- Primärtext: {t['primaer'].replace(chr(10), chr(10) + '  ')}\n- Überschrift: {t['headline']}\n- Beschreibung: {t['beschreibung']}\n")
    if f["_verlosung"]:
        zeilen.append("Die Verlosungs-Anzeige in eine **eigene Kampagne** `Beauty – Verlosung – " + f["betrieb"] + "` (gleiche Einstellungen), "
                      "Budget in dieser Zeit etwa hälftig aufteilen.\n")
    return "\n".join(zeilen)


def fotos_uebernehmen(dateien, ordner):
    ordner.mkdir(parents=True, exist_ok=True)
    frei = list(FOTO_NAMEN[:3])
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


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    quelle = pathlib.Path(sys.argv[1]).resolve()
    stb, namen = lese_schluessel(quelle, "Steckbrief")
    agentur, anamen = lese_schluessel(quelle, "Eure Daten")
    if not agentur:
        agentur, anamen = lese_schluessel(quelle, "Deine Daten")
    namen.update(anamen)
    warnungen = aufbereiten(stb) + aufbereiten(agentur)
    if not stb.get("betrieb"):
        sys.exit("Im Steckbrief fehlt „Studio / Praxis“.")
    f, mod, hinweise = felder(stb, agentur, namen)
    warnungen += hinweise
    ziel = KUNDEN / f["slug"]
    print(f"Kunde: {stb['betrieb']} · {mod['name']}  →  {ziel.relative_to(BEAUTY.parent.parent)}")
    ziel.mkdir(parents=True, exist_ok=True)
    if quelle != (ziel / "steckbrief.xlsx").resolve():
        shutil.copy2(quelle, ziel / "steckbrief.xlsx")

    # Fotos: neue übernehmen; fehlende Titelbilder sind Platzhalter des Moduls
    fotos_uebernehmen(sys.argv[2:], ziel / "fotos")
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
    fotos = {n: bool(list((ziel / "fotos").glob(n + ".*"))) for n in FOTO_NAMEN}
    if (fotos["vorher"] or fotos["nachher"]) and not mod["regeln"]["vorher_nachher"]:
        warnungen.append(f"Vorher/Nachher-Fotos sind bei {mod['name']} in der Werbung nicht erlaubt. Sie werden nicht verwendet.")

    # Dokumente
    (ziel / "dokumente").mkdir(exist_ok=True)
    schalter = {"VERLOSUNG": f["_verlosung"], "WUNSCH": f["_wunsch"]}
    anz_html, vorschau_html, alle = anzeigen_html(f, mod)
    f["meta_anzeigen_md"] = meta_md(f, alle)
    texte = TEXTE + (["teilnahmebedingungen.md"] if f["_verlosung"] else [])
    for name in texte:
        (ziel / "dokumente" / name).write_text(fuellen((VORLAGEN / "texte" / name).read_text(encoding="utf-8"), f, schalter), encoding="utf-8")
    if not f["_verlosung"]:
        (ziel / "dokumente" / "teilnahmebedingungen.md").unlink(missing_ok=True)
    print(f"✓ dokumente/ ({len(texte)} Dateien)")

    # Seiten
    lp = ziel / "landingpage"
    shutil.rmtree(lp, ignore_errors=True)
    lp.mkdir()
    kopiere_ordner(VORLAGEN / "assets" / "fonts", lp / "fonts")
    fotos_fuer_web(ziel / "fotos", lp / "fotos")
    if not mod["regeln"]["vorher_nachher"]:
        for n in ("vorher", "nachher"):
            (lp / "fotos" / (n + ".jpg")).unlink(missing_ok=True)
    sf = {**f, **seiten_felder(f, mod, stb, fotos)}
    for name in STATISCH:
        shutil.copy2(VORLAGEN / "landingpage" / name, lp / name)
    for name in SEITEN + (["verlosung.html"] if f["_verlosung"] else []):
        (lp / name).write_text(fuellen((VORLAGEN / "landingpage" / name).read_text(encoding="utf-8"), sf), encoding="utf-8")
    (lp / "index.html").write_text(
        '<!DOCTYPE html><html lang="de"><head><meta charset="UTF-8"><meta name="robots" content="noindex">'
        '<meta name="viewport" content="width=device-width, initial-scale=1">'
        f'<title>{esc(f["betrieb"])}</title><meta http-equiv="refresh" content="0; url=termin.html">'
        '<script>location.replace("termin.html" + location.search);</script></head>'
        '<body><a href="termin.html">Weiter zur Terminbuchung</a></body></html>', encoding="utf-8")
    print("✓ landingpage/ (" + ", ".join(sorted(p.name for p in lp.glob("*.html"))) + ")")

    # Anzeigen
    an = ziel / "anzeigen"
    shutil.rmtree(an, ignore_errors=True)
    an.mkdir()
    kopiere_ordner(VORLAGEN / "assets" / "fonts", an / "fonts")
    fotos_fuer_web(ziel / "fotos", an / "fotos")
    af = {**f, "anzeigen_html": anz_html, "vorschau_html": vorschau_html,
          "regel_hinweis": {"falten": "Für Faltenbehandlung gilt das Heilmittelwerbegesetz: kein „Botox“, kein Vorher/Nachher, keine Rabatte, kein „kostenlos“.",
                            "bleaching": "Für Zahnärzte gilt die Berufsordnung: sachlich, ohne Rabatte und Verlosungen.",
                            "laser": "„Dauerhaft“ steht nie ohne den Hinweis auf mehrere Sitzungen.",
                            "pmu": "Ergebnisfotos nur echte, mit Zustimmung der Kundin."}[mod["kuerzel"]]}
    (an / "anzeigen.html").write_text(fuellen((VORLAGEN / "anzeigen" / "anzeigen.html").read_text(encoding="utf-8"), af), encoding="utf-8")
    (an / "vorschau.html").write_text(fuellen((VORLAGEN / "anzeigen" / "vorschau.html").read_text(encoding="utf-8"), af), encoding="utf-8")
    try:
        subprocess.run(["node", str(HIER / "creatives-rendern.js"), str(an / "anzeigen.html")], check=True, capture_output=True, text=True)
        print(f"✓ anzeigen/creatives/ ({len(alle)} Bilder)")
    except Exception as e:
        print("! Anzeigen nicht gerendert (Node/Playwright fehlt?):", e)

    # Zeile für die Zentrale (Blatt „Kunden“, Spalten Kürzel … Ziehung am)
    roh = lambda k: "" if stb.get(k) is None else (datum(stb[k]) if isinstance(stb[k], (dt.date, dt.datetime)) else
                                                    str(int(stb[k])) if isinstance(stb[k], float) and stb[k].is_integer() else str(stb[k]))
    leist = "; ".join(f"{l['name']} | {l['minuten']} | {l['preis']}" for l in f["_leistungen"])
    zeile = [f["slug"], roh("betrieb"), f"{roh('anrede')} {f['inhaber_nachname'] if stb.get('inhaber') else ''}".strip(),
             roh("email"), roh("telefon"), f["adresse"], f["landingpage_url"], roh("drive_link"), roh("onboarding_preis"), roh("retainer"),
             "", "Ja", stb.get("behandlung") or "", f["buchung_modus"], roh("kalender_id"), roh("buchbare_zeiten"), f["beratung_minuten"],
             leist, str(zahl(stb.get("puffer_minuten"), 0)), str(zahl(stb.get("vorlauf_stunden"), 12)), str(zahl(stb.get("tage_voraus"), 21)), str(zahl(stb.get("raster_minuten"), 30)),
             str(zahl(stb.get("absagefrist_stunden"), 24)), f["ausfall_regel"], " • ".join(f["_vorbereitung"]),
             roh("aktion_ende") if f["_verlosung"] else "", roh("ziehung") if f["_verlosung"] else "", f["betreuer_name"]]
    (ziel / "zentrale-zeile.txt").write_text("\t".join(x.replace("\t", " ").replace("\n", " ") for x in zeile) + "\n", encoding="utf-8")
    print("✓ zentrale-zeile.txt")

    # README
    gruppen = {}
    for titel, keys in OFFEN_NACH_SCHRITT:
        gruppen.setdefault(titel, []).extend(namen.get(k, k) for k in keys if stb.get(k) is None)
    if f["buchung_modus"] == "Kalender" and not stb.get("kalender_id"):
        gruppen.setdefault("Vom Studio (Schritt 5)", []).append("Kalender-ID (Kalender freigeben, Anleitung 4c)")
    if str(stb.get("vorbereitung_ok") or "").lower() != "ja":
        gruppen.setdefault("Vom Studio (Schritt 5)", []).append("Vorbereitungs-Hinweise vom Studio freigegeben (Steckbrief Teil 3)")
    if f["_verlosung"]:
        gruppen.setdefault("Für die Verlosung", []).extend(namen.get(k, k) for k in ("gewinn", "aktion_ende", "ziehung") if stb.get(k) is None)
    for titel, keys in OPTIONAL:
        gruppen.setdefault(titel, []).extend(f"{namen.get(k, k)} (wenn möglich)" for k in keys if stb.get(k) is None)
    if platzhalter:
        gruppen.setdefault("Vom Studio (Schritt 5)", []).append(f"Echte Fotos (noch Platzhalter: {', '.join(platzhalter)})")
    if not f["_zentrale"] and agentur.get("agentur_zentrale_url"):
        gruppen.setdefault("Eure Daten (im Steckbrief, Blatt „Eure Daten“)", []).append(
            "Web-App-Adresse der Beauty-Zentrale: ohne sie zeigt die Seite nur Beispiel-Termine")
    if warnungen:
        gruppen = {"Bitte prüfen": warnungen, **gruppen}
    fehlt_agentur = [anamen.get(k, k) for k in AGENTUR_PFLICHT if not agentur.get(k)]
    if fehlt_agentur:
        gruppen = {"Eure Daten (im Steckbrief, Blatt „Eure Daten“)": fehlt_agentur + gruppen.pop("Eure Daten (im Steckbrief, Blatt „Eure Daten“)", []), **gruppen}
    offen = [(t_, l) for t_, l in gruppen.items() if l]
    f["offen_liste"] = "\n\n".join(f"**{t_}**\n" + "\n".join(f"- [ ] {n}" for n in l) for t_, l in offen) or "Nichts, alles ausgefüllt."
    f["erzeugt_am"] = dt.date.today().strftime("%d.%m.%Y")
    f["v"] = dt.datetime.now().strftime("%Y%m%d%H%M")
    (ziel / "README.md").write_text(fuellen((VORLAGEN / "texte" / "_kunden-readme.md").read_text(encoding="utf-8"), f, schalter), encoding="utf-8")
    print("✓ README.md")
    for t_, l in offen:
        print(f"\nNoch offen · {t_}: " + " · ".join(l))
    nicht_ja = [namen.get(k, k) for k in CHECKS if str(stb.get(k) or "").lower() != "ja"]
    if nicht_ja:
        print("\n! ACHTUNG, Studio passt noch nicht. Nicht „Ja“: " + " · ".join(nicht_ja))


if __name__ == "__main__":
    main()
