#!/usr/bin/env python3
"""Baut den Steckbrief für Beauty-Kunden: nischen/beauty/vorlagen/tabellen/01-steckbrief.xlsx

Aufruf: python3 nischen/beauty/vorlagen/werkzeuge/tabellen-bauen.py

Blätter: „Steckbrief“ (prüft selbst, ob das Studio passt, schlägt das Budget vor), „Rechnung intern“,
„Eure Daten“ (einmal in der Vorlage ausfüllen, dann trägt jede Kopie sie mit), „Annahmen“ (aus module.py).
Die versteckte Spalte A (Schlüssel) liest kunde-anlegen.py. Nicht umbenennen.
"""
import importlib.util
import pathlib
from copy import copy

from openpyxl import Workbook
from openpyxl.formatting.rule import FormulaRule
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.worksheet.datavalidation import DataValidation

HIER = pathlib.Path(__file__).resolve().parent
ZIEL = HIER.parent / "tabellen"
_spec = importlib.util.spec_from_file_location("module", HIER.parent / "module.py")
M = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(M)

F = "Arial"
H_FILL = PatternFill("solid", start_color="1A1917")
IN_FILL = PatternFill("solid", start_color="FFF6CC")
SEC_FILL = PatternFill("solid", start_color="EFEAE0")
GRUEN = PatternFill("solid", start_color="E5F4E4")
ROT = PatternFill("solid", start_color="FBEBEB")
ORANGE = PatternFill("solid", start_color="F9EEDA")
HILFE = Font(name=F, size=9, color="6B665D")
THIN = Side(style="thin", color="D9D4CA")
BOX = Border(left=THIN, right=THIN, top=THIN, bottom=THIN)
EURO = '#,##0 "€"'

AGENTUR = [
    ("agentur_name", "Name der Agentur", "steht im Vertrag und in den Mails", "text"),
    ("agentur_inhaber", "Dein Name (Partner 1)", "Vor- und Nachname. Im Vertrag als Auftragnehmer, in Mails wenn du betreust", "text"),
    ("agentur_telefon", "Dein Telefon", "mit ' davor eintippen, damit die 0 bleibt", "text"),
    ("agentur_email", "Deine E-Mail", "Studios, die du betreust, antworten hierhin", "text"),
    ("agentur_partner", "Name deines Kollegen (Partner 2)", "Vor- und Nachname · leer = du arbeitest allein", "text"),
    ("agentur_partner_telefon", "Telefon deines Kollegen", "mit ' davor", "text"),
    ("agentur_partner_email", "E-Mail deines Kollegen", "Studios, die er betreut, antworten hierhin", "text"),
    ("agentur_technik", "Wer von euch macht die Technik?", "Seiten, Kampagnen, Zentrale · Name · leer = Partner 1", "text"),
    ("agentur_anschrift", "Anschrift der Agentur", "Straße, PLZ Ort (für den Vertrag)", "text"),
    ("agentur_kleinunternehmer", "Kleinunternehmer (§ 19 UStG)?", "Ja = im Vertrag steht: keine Umsatzsteuer", "janein"),
    ("agentur_business_id", "Meta Business-ID", "Einstellungen → Unternehmensinfos · mit ' davor eintippen", "text"),
    ("agentur_google_mcc", "Google-Ads-Verwaltungskonto (Kunden-ID)", "oben rechts in Google Ads, z. B. 123-456-7890", "text"),
    ("agentur_google_email", "Google-Konto der Beauty-Zentrale (E-Mail)", "unter diesem Konto läuft die Zentrale; dafür geben die Studios ihren Kalender frei. Eins für euch beide", "text"),
    ("agentur_zentrale_url", "Web-App-Adresse der Beauty-Zentrale", "aus der Zentrale, Blatt „Einstellungen“ (endet auf /exec). Ohne sie zeigen die Seiten nur Beispiel-Termine", "text"),
]

STECKBRIEF = [
    ("§", "1 · Im Gespräch: Passt das Studio?", None, None),
    ("betreuer", "Wer von euch betreut das Studio?", "Vorname reicht · fester Ansprechpartner in allen Mails und Anleitungen · leer = Partner 1", "text"),
    ("betrieb", "Studio / Praxis (so heißt es in den Anzeigen)", "z. B. Haut & Licht Laserstudio", "text"),
    ("anrede", "Anrede der Inhaberin / des Inhabers", "Herr / Frau", "anrede"),
    ("inhaber", "Inhaber/in (Vor- und Nachname)", "z. B. Sabine Muster", "text"),
    ("telefon", "Telefon des Studios", "steht auf den Seiten und in den Mails · mit ' davor", "text"),
    ("email", "E-Mail für Termine", "jede Buchung geht hierhin", "text"),
    ("ort", "Ort des Studios", "Mitte des Werbegebiets, steht in Anzeigen", "text"),
    ("umkreis_km", "Werbegebiet: Umkreis in km", "Stadt 10–15, Land 20–25", "zahl"),
    ("behandlung", "Welche Behandlung bewerben wir?", "eine pro Kunde: Laser, Permanent Make-up, Faltenbehandlung, Bleaching", "behandlung"),
    ("behandler", "Wer behandelt?", "entscheidet, was erlaubt ist", "behandler"),
    ("kundenwert", "Was bringt eine neue Kundin im ersten Jahr im Schnitt?", "z. B. Laser-Paket 900 €, Brows 400 €", "euro"),
    ("termine_woche", "Wie viele zusätzliche Termine mit Neukunden schafft das Studio pro Woche?", "daraus rechnet sich das Budget", "zahl"),
    ("check_entscheider", "Ist der Entscheider im Gespräch dabei?", "Nein = neuen Termin mit der Chefin/dem Chef", "janein"),
    ("check_qualifikation", "Qualifikation passt? (Laser: NiSV-Fachkunde · Falten: Arzt/HP · Bleaching: Zahnarzt)", "Nein = kein Kunde", "janein"),
    ("check_kalender", "Google-Kalender, den wir lesen dürfen, oder bereit, Termine per Knopf zu bestätigen?", "sonst kein Online-Termin möglich", "janein"),
    ("check_fotos", "Gibt es Fotos von Studio, Team, Behandlung (oder werden welche gemacht)?", "ohne Fotos keine guten Anzeigen", "janein"),
    ("ergebnis", "Ergebnis", "rechnet sich selbst", "ergebnis"),
    ("§", "2 · Für die Vereinbarung (bis zur Unterschrift)", None, None),
    ("betrieb_lang", "Firmenname mit Rechtsform", "wie im Impressum, z. B. Haut & Licht GmbH oder Sabine Muster", "text"),
    ("strasse", "Straße und Hausnummer", "", "text"),
    ("plz", "PLZ", "", "text"),
    ("oeffnungszeiten", "Öffnungszeiten", "steht auf der Seite, z. B. Di–Fr 9–19, Sa 9–14", "text"),
    ("onboarding_preis", "Onboarding, einmalig", "deine Entscheidung (Empfehlung siehe „Rechnung intern“)", "euro"),
    ("retainer", "Monatsgebühr", "fällig erst ab dem ersten Kauf aus einem Online-Termin", "euro"),
    ("budget_meta", "Werbebudget Meta pro Monat", "budget", "euro"),
    ("budget_google", "Werbebudget Google pro Monat", "budget", "euro"),
    ("vertragsbeginn", "Datum der Unterschrift", "leer = heute", "datum"),
    ("drive_link", "Google-Drive-Ordner für Fotos (Link)", "in Schritt 3 anlegen, für das Studio freigeben: Bearbeiter", "text"),
    ("§", "3 · Online-Buchung", None, None),
    ("buchung_modus", "Wie werden Termine eingetragen?", "Kalender = direkt in seinen Google-Kalender · Wunschtermin = Studio bestätigt per Knopf", "modus"),
    ("kalender_id", "Google-Kalender des Studios (E-Mail-Adresse oder Kalender-ID)", "nur bei „Kalender“; das Studio gibt ihn für dich frei (Anleitung 4c)", "text"),
    ("buchbare_zeiten", "Wann darf online gebucht werden?", "z. B. „Mo-Fr 9-18; Sa 10-14“ oder „Di, Do 9:30-13 14-18“", "text"),
    ("beratung_minuten", "Dauer der Beratung (Minuten)", "leer = Vorschlag des Moduls", "zahl"),
    ("leistungen", "Direkt buchbare Behandlungen", "Name | Minuten | Preis; … · leer = nur Beratung · bei Faltenbehandlung immer leer", "text"),
    ("puffer_minuten", "Puffer zwischen Terminen (Minuten)", "z. B. 10 zum Aufräumen · leer = 0", "zahl"),
    ("vorlauf_stunden", "Frühestens … Stunden nach der Buchung", "leer = 12", "zahl"),
    ("tage_voraus", "Wie viele Tage im Voraus buchbar?", "leer = 21", "zahl"),
    ("absagefrist_stunden", "Absage bitte spätestens … Stunden vorher", "z. B. 24 · steht in Bestätigung und Erinnerung", "zahl"),
    ("ausfallgebuehr", "Ausfallgebühr bei später Absage oder Nichterscheinen (€)", "leer = keine. Nur wenn das Studio das wirklich verlangt", "euro"),
    ("vorbereitung", "Eigene Vorbereitungs-Hinweise (Punkte mit • trennen)", "leer = Vorschlag des Moduls (steht in der „0 Übersicht“)", "text"),
    ("vorbereitung_ok", "Hat das Studio die Vorbereitungs-Hinweise geprüft und freigegeben?", "Pflicht vor dem Livegang", "janein"),
    ("§", "4 · Kommt vom Studio (nach der Unterschrift)", None, None),
    ("behandler_name", "Wer behandelt? (Name, Titel, Qualifikation)", "z. B. „Dr. med. Lisa Muster, Fachärztin für Dermatologie“ oder „Sabine Muster, NiSV-Fachkunde“", "text"),
    ("impressum_url", "Link zum Impressum", "von seiner Webseite kopieren", "text"),
    ("datenschutz_url", "Link zur Datenschutzerklärung", "muss Netlify, Meta-Pixel, Google Ads und die Online-Buchung nennen", "text"),
    ("bewertung_1", "Echte Google-Bewertung 1", "Text — Vorname · leer = kein Bewertungs-Block · bei Faltenbehandlung nicht verwendet", "text"),
    ("bewertung_2", "Echte Google-Bewertung 2", "nie erfinden", "text"),
    ("§", "5 · Zum Einrichten (vor dem Hochladen)", None, None),
    ("pixel_id", "Meta-Pixel-ID (Datensatz-ID)", "15–16 Ziffern, mit ' davor", "text"),
    ("google_conversion", "Google-Ads-Conversion (ID/Label)", "z. B. AW-123456789/AbCdEfGh · nur wenn Google-Kampagne", "text"),
    ("landingpage_url", "Eigene Adresse der Seiten (nur falls nötig)", "leer = https://<kürzel>.netlify.app", "text"),
    ("§", "6 · Nur Laser und Permanent Make-up: Verlosung (2–3 × im Jahr)", None, None),
    ("verlosung_aktiv", "Läuft gerade eine Verlosung?", "leer = Nein. Bei Faltenbehandlung und Bleaching nie", "janein"),
    ("gewinn", "Was wird verlost?", "z. B. „ein Laser-Paket Achseln (6 Sitzungen)“", "text"),
    ("aktion_ende", "Teilnahmeschluss", "Datum", "datum"),
    ("ziehung", "Tag der Ziehung", "Datum", "datum"),
    ("§", "7 · Notizen", None, None),
    ("notizen", "Notizen aus dem Gespräch", "nur für dich", "text"),
]


def kopf(ws, zeile, werte, breiten=None):
    for i, w in enumerate(werte, start=1):
        c = ws.cell(row=zeile, column=i, value=w)
        c.font = Font(name=F, bold=True, color="FFFFFF", size=10)
        c.fill = H_FILL
        c.alignment = Alignment(vertical="center", wrap_text=True)
    if breiten:
        for i, b in enumerate(breiten, start=1):
            ws.column_dimensions[chr(64 + i)].width = b
    ws.row_dimensions[zeile].height = 30


def titel(ws, text, unter):
    ws["A1"] = text
    ws["A1"].font = Font(name=F, bold=True, size=14)
    ws["A2"] = unter
    ws["A2"].font = Font(name=F, size=10, color="6B665D")


def liste(ws, rng, werte):
    dv = DataValidation(type="list", formula1='"' + ",".join(werte) + '"', allow_blank=True)
    ws.add_data_validation(dv)
    dv.add(rng)


def eingabe(c, fmt=None):
    c.fill = IN_FILL
    c.border = BOX
    c.font = Font(name=F, size=10, color="0000FF")
    if fmt:
        c.number_format = fmt


def schluesselblatt(ws, felder, titeltext, unter):
    titel(ws, titeltext, unter)
    kopf(ws, 4, ["Schlüssel", "Frage", "Eintrag", "Hilfe"], [16, 56, 36, 60])
    zeilen, r = {}, 5
    for key, frage, hilfe, typ in felder:
        if key == "§":
            c = ws.cell(row=r, column=2, value=frage)
            c.font = Font(name=F, bold=True, size=11)
            for col in range(1, 5):
                ws.cell(row=r, column=col).fill = SEC_FILL
            ws.row_dimensions[r].height = 22
            r += 1
            continue
        zeilen[key] = r
        ws.cell(row=r, column=1, value=key).font = Font(name=F, size=8, color="9A968C")
        ws.cell(row=r, column=2, value=frage).font = Font(name=F, size=10, bold=True)
        ws.cell(row=r, column=2).alignment = Alignment(wrap_text=True, vertical="center")
        w = ws.cell(row=r, column=3)
        if typ != "ergebnis":
            eingabe(w)
        h = ws.cell(row=r, column=4, value=hilfe)
        h.font = HILFE
        h.alignment = Alignment(wrap_text=True, vertical="center")
        if typ == "text":
            w.number_format = "@"
        if typ == "datum":
            w.number_format = "DD.MM.YYYY"
        elif typ == "euro":
            w.number_format = EURO
        elif typ == "janein":
            liste(ws, w.coordinate, ["Ja", "Nein"])
        elif typ == "anrede":
            liste(ws, w.coordinate, ["Herr", "Frau"])
        elif typ == "behandlung":
            liste(ws, w.coordinate, M.BEHANDLUNGEN)
        elif typ == "behandler":
            liste(ws, w.coordinate, M.BEHANDLER)
        elif typ == "modus":
            liste(ws, w.coordinate, ["Kalender", "Wunschtermin"])
        r += 1
    ws.column_dimensions["A"].hidden = True
    for ref in ("A1", "A2"):
        ws[ref.replace("A", "B")] = ws[ref].value
        ws[ref.replace("A", "B")].font = copy(ws[ref].font)
        ws[ref] = None
    ws.page_setup.orientation = "landscape"
    ws.page_setup.fitToWidth = 1
    ws.page_setup.fitToHeight = 0
    ws.sheet_properties.pageSetUpPr.fitToPage = True
    ws.freeze_panes = "C5"
    return zeilen


def steckbrief():
    wb = Workbook()
    ws = wb.active
    ws.title = "Steckbrief"
    z = schluesselblatt(ws, STECKBRIEF, "Steckbrief: neues Beauty-Studio",
                        "Für jeden Kunden eine Kopie. Teil 1 im Gespräch, Teil 2 und 3 bis zur Unterschrift, dann an Claude: "
                        "„Lege den Kunden aus diesem Steckbrief an.“ Einmalig vorher: Blatt „Eure Daten“ ausfüllen.")
    S = lambda k: f"$C${z[k]}"
    RI = "'Rechnung intern'!"

    # Annahmen je Modul (aus module.py), daraus liest „Rechnung intern“ per SVERWEIS
    an = wb.create_sheet("Annahmen")
    titel(an, "Annahmen je Behandlung (aus module.py)", "Ändern nur hier oder in module.py. Nach 20–50 echten Terminen durch eigene Zahlen ersetzen.")
    kopf(an, 4, ["Behandlung", "Kosten pro bestätigtem Termin", "Erscheinen", "Kauf nach Termin", "Anteil Meta", "Erlaubte Behandler", "Preis-Empfehlung"],
         [20, 16, 12, 14, 12, 50, 60])
    for i, (name, mod) in enumerate(M.MODULE.items(), start=5):
        a = mod["annahmen"]
        for col, (v, fmt) in enumerate(((name, None), (a["kosten_pro_termin"], EURO), (a["erscheinen"], "0%"), (a["kauf"], "0%"),
                                        (a["meta_anteil"], "0%"), (", ".join(mod["behandler"]), None), (mod["preis_empfehlung"], None)), start=1):
            c = an.cell(row=i, column=col, value=v)
            c.font = Font(name=F, size=10, color="0000FF" if isinstance(v, (int, float)) else "000000")
            if fmt:
                c.number_format = fmt
    ende = 4 + len(M.MODULE)
    TAB = f"Annahmen!$A$5:$G${ende}"
    look = lambda spalte: f"IFERROR(VLOOKUP({S('behandlung')},{TAB},{spalte},FALSE),\"\")"

    # Ergebnis
    e = ws.cell(row=z["ergebnis"], column=3)
    checks = [S(k) for k in ("check_entscheider", "check_qualifikation", "check_kalender", "check_fotos")]
    erlaubt = f'ISNUMBER(SEARCH({S("behandler")},{look(6)}))'
    e.value = (f'=IF(OR({",".join(c + "=\"Nein\"" for c in checks)}),"✗ So nicht abschließen",'
               f'IF(AND({S("behandlung")}<>"",{S("behandler")}<>"",NOT({erlaubt})),"✗ Diese Behandlung darf "&{S("behandler")}&" nicht anbieten bzw. bewerben",'
               f'IF(AND({",".join(c + "=\"Ja\"" for c in checks)},{S("termine_woche")}<>"",{S("behandlung")}<>""),'
               f'IF(N({S("termine_woche")})>=2,"✓ Studio passt","⚠ Unter 2 Neukunden-Terminen pro Woche lohnt die Werbung kaum: mehr Platz klären"),'
               f'"noch offen")))')
    e.font = Font(name=F, size=11, bold=True)
    e.border = BOX
    for zeichen, fill in (("✓", GRUEN), ("✗", ROT), ("⚠", ORANGE)):
        ws.conditional_formatting.add(e.coordinate, FormulaRule(formula=[f'LEFT({e.coordinate},1)="{zeichen}"'], fill=fill))
    e.alignment = Alignment(wrap_text=True, vertical="center")
    ws.row_dimensions[z["ergebnis"]].height = 36
    ws.cell(row=z["ergebnis"], column=4).value = "grün = abschließen · gelb = klären · rot = nicht abschließen. Zahlen: Blatt „Rechnung intern“"

    for key, anteil in (("budget_meta", f"{RI}$B$6"), ("budget_google", f"(1-{RI}$B$6)")):
        h = ws.cell(row=z[key], column=4)
        h.value = f'=IF({RI}$B$5="","Behandlung und Termine pro Woche eintragen",ROUND({RI}$B$5*{anteil}/50,0)*50)'
        h.number_format = '"Empfehlung: "#,##0" €  ·  du entscheidest"'
        h.font = Font(name=F, size=10, bold=True, color="008000")

    # Rechnung intern
    ri = wb.create_sheet("Rechnung intern")
    titel(ri, "Rechnung intern — nie dem Studio zeigen",
          "Annahmen kommen aus dem Blatt „Annahmen“ (je Behandlung). Alles andere rechnet sich.")
    kopf(ri, 4, ["", "Wert", "Woher"], [48, 16, 74])
    st = "Steckbrief!"
    budget_ein = f"N({st}{S('budget_meta')})+N({st}{S('budget_google')})"
    kpt = f"IFERROR(VLOOKUP({st}{S('behandlung')},{TAB},2,FALSE),0)"
    zeilen = [
        ("Empfohlenes Werbebudget pro Monat",
         f'=IF(OR({st}{S("behandlung")}="",N({st}{S("termine_woche")})=0),"",MAX(300,MIN(2000,ROUND(N({st}{S("termine_woche")})*4.33*{kpt}/50,0)*50)))', EURO,
         "Termine pro Woche × 4,33 × Kosten pro bestätigtem Termin, mindestens 300 €, höchstens 2.000 €"),
        ("Davon Meta (Rest Google)", f"=IFERROR(VLOOKUP({st}{S('behandlung')},{TAB},5,FALSE),0.7)", "0%", "aus „Annahmen“"),
        ("Werbebudget, mit dem gerechnet wird", f"=IF({budget_ein}>0,{budget_ein},N(B5))", EURO,
         f'=IF({budget_ein}>0,"aus dem Steckbrief","Empfehlung (Budget noch nicht eingetragen)")'),
        ("", None, None, ""),
        ("Kosten pro bestätigtem Termin", f"={kpt}", EURO, "Annahme aus „Annahmen“, nicht belegt: deutsche Zahlen gibt es kaum"),
        ("Anteil, der erscheint", f"=IFERROR(VLOOKUP({st}{S('behandlung')},{TAB},3,FALSE),0.75)", "0%", "Annahme. Erinnerung 24 h vorher hilft"),
        ("Anteil, der danach kauft", f"=IFERROR(VLOOKUP({st}{S('behandlung')},{TAB},4,FALSE),0.5)", "0%", "Annahme"),
        ("Bestätigte Termine pro Monat", "=IFERROR(B7/B9,0)", "0", ""),
        ("Davon erschienen", "=B12*B10", "0.0", ""),
        ("Davon gekauft (neue Kundinnen)", "=B13*B11", "0.0", ""),
        ("Wert einer neuen Kundin im ersten Jahr", f"=N({st}{S('kundenwert')})", EURO, "aus dem Steckbrief"),
        ("Umsatz beim Studio pro Monat (erstes Jahr)", "=B14*B15", EURO, ""),
        ("Kosten des Studios pro Monat", f"=B7+N({st}{S('retainer')})", EURO, "Werbebudget + Monatsgebühr"),
        ("Umsatz pro eingesetztem Euro", "=IFERROR(B16/B17,0)", '0.0"×"', "über 3 ist gut · Marge des Studios beachten"),
        ("Termine pro Woche, die das bringt", "=B12/4.33", "0.0", "muss zur Antwort im Steckbrief passen"),
        ("", None, None, ""),
        ("Preis-Empfehlung für diese Behandlung", f"=IFERROR(VLOOKUP({st}{S('behandlung')},{TAB},7,FALSE),\"\")", None, "aus der Recherche, du entscheidest"),
    ]
    for i, (g, v, fmt, h) in enumerate(zeilen, start=5):
        ri.cell(row=i, column=1, value=g).font = Font(name=F, size=10, bold=i in (5, 7, 18, 21))
        if v is None:
            continue
        c = ri.cell(row=i, column=2, value=v)
        if fmt:
            c.number_format = fmt
        c.font = Font(name=F, size=10, bold=i in (5, 7, 18, 21))
        ri.cell(row=i, column=3, value=h).font = HILFE
    ri["B21"].alignment = Alignment(wrap_text=False)

    dd = wb.create_sheet("Eure Daten")
    schluesselblatt(dd, AGENTUR, "Eure Daten (einmal ausfüllen)",
                    "Einmal in der leeren Vorlage ausfüllen und speichern, am besten zusammen. Jede Kopie für ein Studio trägt sie dann mit.")
    wb.move_sheet("Annahmen", offset=1)
    wb.save(ZIEL / "01-steckbrief.xlsx")
    print("✓ 01-steckbrief.xlsx")


if __name__ == "__main__":
    ZIEL.mkdir(parents=True, exist_ok=True)
    steckbrief()
