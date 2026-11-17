#!/usr/bin/env python3
"""Baut die ausfüllbaren Tabellen in vorlagen/tabellen/.

Aufruf: python3 nischen/photovoltaik/vorlagen/werkzeuge/tabellen-bauen.py

  00-agentur.xlsx                 deine Daten + alle Rechnungen + Rechnung zum Drucken
                                  (wird NUR angelegt, wenn sie fehlt: dort stehen deine eigenen Daten)
  01-steckbrief.xlsx              pro Kunde: alles auf einem Blatt, prüft selbst, ob der Kunde passt,
                                  und schlägt das Werbebudget vor
  02-checkliste-bis-livegang.xlsx pro Kunde (wird kopiert): 17 Haken von der Unterschrift bis live
  03-anfragen-und-report.xlsx     pro Kunde (wird kopiert): jede Anfrage, Monatsreport samt fertiger Mail
  04-akquise-pv-betriebe.xlsx     eine für alles: Betriebe, die du anrufst

Die versteckte Spalte A (Schlüssel) lesen die Werkzeuge aus. Nicht ändern.
"""
import pathlib
from copy import copy
from datetime import datetime

from openpyxl import Workbook
from openpyxl.comments import Comment
from openpyxl.formatting.rule import CellIsRule, FormulaRule
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.worksheet.datavalidation import DataValidation

ZIEL = pathlib.Path(__file__).resolve().parent.parent / "tabellen"
F = "Arial"
H_FILL = PatternFill("solid", start_color="1A1917")
IN_FILL = PatternFill("solid", start_color="FFF6CC")   # gelb = hier ausfüllen
SEC_FILL = PatternFill("solid", start_color="EFEAE0")
GRUEN = PatternFill("solid", start_color="E5F4E4")
ROT = PatternFill("solid", start_color="FBEBEB")
EX_FONT = Font(name=F, size=10, italic=True, color="7A756B")
HILFE = Font(name=F, size=9, color="6B665D")
THIN = Side(style="thin", color="D9D4CA")
BOX = Border(left=THIN, right=THIN, top=THIN, bottom=THIN)
EURO = '#,##0 "€"'
MONATE = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober",
          "November", "Dezember"]


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


# ---------------------------------------------------------------- Felder
# (Schlüssel, Frage, Hilfe, Typ)   Typ: text | datum | euro | zahl | janein | anrede
# "§" = Abschnitt. Schlüssel liest kunde-anlegen.py. Nicht umbenennen.
AGENTUR = [
    ("agentur_name", "Name der Agentur", "steht auf Vertrag und Rechnung", "text"),
    ("agentur_inhaber", "Dein Name", "Unterschrift im Vertrag, Absender der Mails", "text"),
    ("agentur_anschrift", "Deine Anschrift", "Straße, PLZ Ort", "text"),
    ("agentur_email", "E-Mail", "", "text"),
    ("agentur_telefon", "Telefon / WhatsApp", "Kunden schicken Fotos hierhin", "text"),
    ("agentur_steuernr", "Steuernummer", "Pflicht auf jeder Rechnung", "text"),
    ("agentur_iban", "IBAN", "", "text"),
    ("agentur_kleinunternehmer", "Kleinunternehmer (§ 19 UStG)?", "Ja = keine Umsatzsteuer auf Rechnungen", "janein"),
    ("agentur_business_id", "Meta Business-ID", "Business-Einstellungen → Unternehmensinfos", "text"),
    ("agentur_google_mcc", "Google-Ads-Verwaltungskonto (Kunden-ID)", "oben rechts in Google Ads, z. B. 123-456-7890", "text"),
]

STECKBRIEF = [
    ("§", "1 · Im Gespräch: Passt der Kunde?", None, None),
    ("betrieb", "Betrieb (so heißt er in den Anzeigen)", "z. B. Muster Solartechnik", "text"),
    ("anrede", "Anrede des Inhabers", "Herr / Frau", "anrede"),
    ("inhaber", "Inhaber (Vor- und Nachname)", "z. B. Markus Muster", "text"),
    ("telefon", "Telefon für Rückrufe", "steht auf den Seiten", "text"),
    ("email", "E-Mail für Anfragen", "jede Anfrage geht hierhin", "text"),
    ("ort", "Ort des Betriebs", "Mitte des Werbegebiets", "text"),
    ("einzugsgebiet_km", "Bis wie weit fährt er zur Montage? (km)", "z. B. 40", "zahl"),
    ("ticket_schnitt", "Was kostet eine Anlage mit Speicher im Schnitt?", "z. B. 18.000 €", "euro"),
    ("kapazitaet_termine", "Wie viele zusätzliche Beratungstermine schafft er pro Woche?", "bei 3.000 € Budget kommen etwa 5–6 pro Woche", "zahl"),
    ("check_entscheider", "Ist der Entscheider im Gespräch dabei?", "Nein = neuen Termin mit dem Chef machen", "janein"),
    ("check_rueckruf", "Ruft er jede Anfrage innerhalb 1 Stunde zurück?", "zögert er: nicht abschließen", "janein"),
    ("check_fotos", "Hat er Fotos fertiger Anlagen (oder macht er welche)?", "ohne Fotos keine guten Anzeigen", "janein"),
    ("ergebnis", "Ergebnis", "rechnet sich selbst", "ergebnis"),
    ("§", "2 · Für die Vereinbarung (bis zur Unterschrift)", None, None),
    ("betrieb_lang", "Firmenname mit Rechtsform", "z. B. Muster Solartechnik GmbH", "text"),
    ("strasse", "Straße und Hausnummer", "", "text"),
    ("plz", "PLZ", "", "text"),
    ("oeffnungszeiten", "Geschäftszeiten", "z. B. Mo–Fr 8–17 Uhr · steht auf den Seiten", "text"),
    ("eigenes_team", "Montiert er mit eigenem Team?", "Nein = Anzeigen sagen nicht „eigene Montageteams“", "janein"),
    ("onboarding_preis", "Onboarding, einmalig", "deine Entscheidung", "euro"),
    ("retainer", "Monatsgebühr", "fällig erst ab dem ersten Auftrag", "euro"),
    ("budget_meta", "Werbebudget Meta pro Monat", "budget", "euro"),
    ("budget_google", "Werbebudget Google pro Monat", "budget", "euro"),
    ("pruefung_dauer", "Wirtschaftlichkeitsprüfung kommt innerhalb von …", "leer = 2 Werktagen", "text"),
    ("vertragsbeginn", "Datum der Unterschrift", "leer = heute", "datum"),
    ("drive_link", "Google-Drive-Ordner für seine Fotos (Link)", "vor dem Anlegen erstellen, für den Kunden freigeben: Bearbeiter", "text"),
    ("§", "3 · Kommt vom Kunden (nach der Unterschrift)", None, None),
    ("impressum_url", "Link zu seinem Impressum", "von seiner Webseite kopieren", "text"),
    ("datenschutz_url", "Link zu seiner Datenschutzerklärung", "von seiner Webseite kopieren", "text"),
    ("bewertung_1", "Echte Google-Bewertung 1", "Text — Vorname, Ort · leer = kein Bewertungs-Block", "text"),
    ("bewertung_2", "Echte Google-Bewertung 2", "nie erfinden", "text"),
    ("§", "4 · Nach dem Hochladen", None, None),
    ("landingpage_url", "Adresse der Seiten", "z. B. https://muster-solar.netlify.app", "text"),
    ("pixel_id", "Meta-Pixel-ID", "Events Manager des Kunden, 15–16 Ziffern", "text"),
    ("§", "5 · Nur bei Verlosung (2–3 × im Jahr)", None, None),
    ("verlosung_aktiv", "Läuft gerade eine Verlosung?", "leer = Nein", "janein"),
    ("aktion_ende", "Teilnahmeschluss", "Datum", "datum"),
    ("ziehung", "Tag der Ziehung", "Datum", "datum"),
    ("speicher", "Welcher Speicher wird verlost?", "z. B. 10 kWh", "text"),
    ("§", "6 · Notizen", None, None),
    ("notizen", "Notizen aus dem Gespräch", "nur für dich", "text"),
]


def schluesselblatt(ws, felder, titeltext, unter):
    """Spalte A Schlüssel (versteckt) · B Frage · C Eintrag (gelb) · D Hilfe. Gibt {schlüssel: zeile} zurück."""
    titel(ws, titeltext, unter)
    kopf(ws, 4, ["Schlüssel", "Frage", "Eintrag", "Hilfe"], [16, 52, 34, 52])
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
        if typ == "datum":
            w.number_format = "DD.MM.YYYY"
        elif typ == "euro":
            w.number_format = EURO
        elif typ == "janein":
            liste(ws, w.coordinate, ["Ja", "Nein"])
        elif typ == "anrede":
            liste(ws, w.coordinate, ["Herr", "Frau"])
        r += 1
    ws.column_dimensions["A"].hidden = True
    for ref in ("A1", "A2"):  # Titel aus der versteckten Spalte A nach B
        ws[ref.replace("A", "B")] = ws[ref].value
        ws[ref.replace("A", "B")].font = copy(ws[ref].font)
        ws[ref] = None
    ws.page_setup.orientation = "landscape"
    ws.page_setup.fitToWidth = 1
    ws.page_setup.fitToHeight = 0
    ws.sheet_properties.pageSetUpPr.fitToPage = True
    ws.freeze_panes = "C5"
    return zeilen


# ---------------------------------------------------------------- 00 Agentur
def agentur():
    p = ZIEL / "00-agentur.xlsx"
    if p.exists():
        print("· 00-agentur.xlsx existiert, bleibt unverändert (deine Daten)")
        return
    wb = Workbook()
    ws = wb.active
    ws.title = "Deine Daten"
    z = schluesselblatt(ws, AGENTUR, "Deine Daten",
                        "Einmal ausfüllen. Landet automatisch in Vertrag, Mails und Rechnungen.")
    D = "'Deine Daten'!$C$"

    # Rechnungen
    rg = wb.create_sheet("Rechnungen")
    titel(rg, "Rechnungen (alle Kunden)",
          "Pro Rechnung eine Zeile. Gelb ausfüllen, der Rest rechnet sich. Drucken: Blatt „Rechnung drucken“.")
    rg["A3"] = "Offen gesamt"
    rg["A3"].font = Font(name=F, bold=True)
    rg["C3"] = '=SUMIFS(I6:I505,L6:L505,"<>bezahlt",I6:I505,">0")'
    rg["C3"].number_format = '#,##0.00 "€"'
    rg["C3"].font = Font(name=F, bold=True, size=12)
    kopf(rg, 5, ["Nr.", "Datum", "Kunde (Firma)", "Anschrift Kunde", "Posten", "Zeitraum", "Netto",
                 "USt.", "Brutto", "Fällig am", "Bezahlt am", "Status"],
         [10, 12, 26, 34, 14, 16, 12, 7, 12, 12, 12, 12])
    for r in range(6, 506):
        rg.cell(row=r, column=1, value=f'=IF(B{r}="","",YEAR(B{r})&"-"&TEXT(ROW()-5,"000"))')
        for col in (2, 3, 4, 5, 6, 7, 11):
            rg.cell(row=r, column=col).font = Font(name=F, size=10, color="0000FF")
        rg.cell(row=r, column=2).number_format = "DD.MM.YYYY"
        rg.cell(row=r, column=11).number_format = "DD.MM.YYYY"
        rg.cell(row=r, column=7).number_format = '#,##0.00 "€"'
        rg.cell(row=r, column=8, value=f'=IF(G{r}="","",IF({D}{z["agentur_kleinunternehmer"]}="Ja",0,0.19))').number_format = "0%"
        rg.cell(row=r, column=9, value=f'=IF(G{r}="","",ROUND(G{r}*(1+H{r}),2))').number_format = '#,##0.00 "€"'
        rg.cell(row=r, column=10, value=f'=IF(B{r}="","",B{r}+14)').number_format = "DD.MM.YYYY"
        rg.cell(row=r, column=12, value=f'=IF(B{r}="","",IF(ISNUMBER(K{r}),"bezahlt",IF(TODAY()>J{r},"überfällig","offen")))')
    for col in (2, 3, 4, 5, 6, 7, 11):
        rg.cell(row=6, column=col).fill = IN_FILL
    for col, v in zip((2, 3, 4, 5, 6, 7), (datetime(2027, 1, 4), "BEISPIEL Muster Solartechnik GmbH",
                                           "Beispielweg 5, 12345 Musterstadt", "Onboarding", "einmalig", 850)):
        c = rg.cell(row=6, column=col, value=v)
        c.font = EX_FONT
    liste(rg, "E6:E505", ["Onboarding", "Monatsgebühr", "Sonstiges"])
    rg.conditional_formatting.add("L6:L505", CellIsRule(operator="equal", formula=['"überfällig"'], fill=ROT))
    rg.conditional_formatting.add("L6:L505", CellIsRule(operator="equal", formula=['"bezahlt"'], fill=GRUEN))
    rg.freeze_panes = "B6"
    rg["G5"].comment = Comment("Umsatzsteuer kommt automatisch aus „Deine Daten“ (Kleinunternehmer Ja = 0 %).", "Vorlage")

    # Rechnung drucken
    dr = wb.create_sheet("Rechnung drucken")
    dr.column_dimensions["A"].width = 3
    dr.column_dimensions["B"].width = 34
    dr.column_dimensions["C"].width = 24
    dr.column_dimensions["D"].width = 18
    dr.column_dimensions["E"].width = 16
    dr["B1"] = "Welche Rechnung? Nr. eintragen →"
    dr["B1"].font = Font(name=F, size=9, color="B4461F", bold=True)
    dr["C1"] = "2027-001"
    eingabe(dr["C1"])
    dr["D1"] = "dann Datei › Drucken › als PDF"
    dr["D1"].font = HILFE
    R = "Rechnungen!"
    zeile = f'MATCH($C$1,{R}$A$6:$A$505,0)'
    hol = lambda col: f'=IFERROR(INDEX({R}${col}$6:${col}$505,{zeile}),"")'
    zellen = [
        ("B3", f"={D}{z['agentur_name']}", Font(name=F, bold=True, size=13)),
        ("B4", f"={D}{z['agentur_inhaber']}&\" · \"&{D}{z['agentur_anschrift']}", Font(name=F, size=9, color="6B665D")),
        ("B5", f"={D}{z['agentur_email']}&\" · \"&{D}{z['agentur_telefon']}", Font(name=F, size=9, color="6B665D")),
        ("B8", hol("C"), Font(name=F, size=11, bold=True)),
        ("B9", hol("D"), Font(name=F, size=11)),
        ("B12", "Rechnung", Font(name=F, bold=True, size=18)),
        ("B14", "Rechnungsnummer", Font(name=F, size=10)), ("C14", "=$C$1", Font(name=F, size=10, bold=True)),
        ("B15", "Rechnungsdatum", Font(name=F, size=10)), ("C15", hol("B"), Font(name=F, size=10)),
        ("B16", "Steuernummer", Font(name=F, size=10)), ("C16", f"={D}{z['agentur_steuernr']}", Font(name=F, size=10)),
        ("B19", "Leistung", Font(name=F, size=10, bold=True)), ("C19", "Zeitraum", Font(name=F, size=10, bold=True)),
        ("E19", "Betrag", Font(name=F, size=10, bold=True)),
        ("B20", hol("E"), Font(name=F, size=10)), ("C20", hol("F"), Font(name=F, size=10)),
        ("E20", hol("G"), Font(name=F, size=10)),
        ("B22", "Netto", Font(name=F, size=10)), ("E22", "=E20", Font(name=F, size=10)),
        ("B23", '="Umsatzsteuer "&IFERROR(TEXT(INDEX(Rechnungen!$H$6:$H$505,' + zeile + '),"0%"),"")', Font(name=F, size=10)),
        ("E23", f'=IFERROR(INDEX({R}$I$6:$I$505,{zeile})-INDEX({R}$G$6:$G$505,{zeile}),"")', Font(name=F, size=10)),
        ("B24", "Gesamt", Font(name=F, size=11, bold=True)), ("E24", hol("I"), Font(name=F, size=11, bold=True)),
        ("B27", f'=IF({D}{z["agentur_kleinunternehmer"]}="Ja","Gemäß § 19 UStG wird keine Umsatzsteuer berechnet.","")', Font(name=F, size=9)),
        ("B28", '="Zahlbar bis "&IFERROR(DAY(INDEX(Rechnungen!$J$6:$J$505,' + zeile + '))&"."&MONTH(INDEX(Rechnungen!$J$6:$J$505,'
         + zeile + '))&"."&YEAR(INDEX(Rechnungen!$J$6:$J$505,' + zeile + ')),"")&" ohne Abzug auf IBAN "&' + f"{D}{z['agentur_iban']}",
         Font(name=F, size=9)),
        ("B30", "Vielen Dank für die Zusammenarbeit.", Font(name=F, size=9)),
    ]
    for ref, v, font in zellen:
        dr[ref] = v
        dr[ref].font = font
    for ref in ("C15",):
        dr[ref].number_format = "DD.MM.YYYY"
    for ref in ("E20", "E22", "E23", "E24"):
        dr[ref].number_format = '#,##0.00 "€"'
        dr[ref].alignment = Alignment(horizontal="right")
    for col in "BCDE":
        dr[f"{col}19"].border = Border(bottom=THIN)
        dr[f"{col}24"].border = Border(top=THIN)
    dr.print_area = "A3:E31"
    dr.page_setup.orientation = "portrait"
    dr.page_setup.fitToWidth = 1
    wb.save(p)
    print("✓", p.name)


# ---------------------------------------------------------------- 01 Steckbrief
def steckbrief():
    wb = Workbook()
    ws = wb.active
    ws.title = "Steckbrief"
    z = schluesselblatt(ws, STECKBRIEF, "Steckbrief: neuer Kunde",
                        "Für jeden Kunden eine Kopie. Teil 1 im Gespräch ausfüllen, Teil 2 bis zur Unterschrift. "
                        "Dann Claude schicken: „Lege den Kunden aus diesem Steckbrief an.“")
    S = lambda k: f"$C${z[k]}"
    RI = "'Rechnung intern'!"

    # Ergebnis
    e = ws.cell(row=z["ergebnis"], column=3)
    ent, rr, fo, kap = S("check_entscheider"), S("check_rueckruf"), S("check_fotos"), S("kapazitaet_termine")
    noetig = f"{RI}$B$19"
    e.value = (f'=IF(OR({ent}="Nein",{rr}="Nein",{fo}="Nein"),"✗ So nicht abschließen",'
               f'IF(AND({ent}="Ja",{rr}="Ja",{fo}="Ja",{kap}<>""),'
               f'IF(N({kap})>=ROUNDDOWN({noetig},0),"✓ Kunde passt","⚠ Kapazität zu klein für das Budget: Budget senken oder mehr Termine klären"),'
               f'"noch offen"))')
    e.font = Font(name=F, size=11, bold=True)
    e.border = BOX
    ws.conditional_formatting.add(e.coordinate, FormulaRule(formula=[f'LEFT({e.coordinate},1)="✓"'], fill=GRUEN))
    ws.conditional_formatting.add(e.coordinate, FormulaRule(formula=[f'LEFT({e.coordinate},1)="✗"'], fill=ROT))
    ws.conditional_formatting.add(e.coordinate, FormulaRule(formula=[f'LEFT({e.coordinate},1)="⚠"'], fill=PatternFill("solid", start_color="F9EEDA")))
    e.alignment = Alignment(wrap_text=True, vertical="center")
    ws.row_dimensions[z["ergebnis"]].height = 32
    ws.cell(row=z["ergebnis"], column=4).value = ("grün = abschließen · gelb = Kapazität klären · rot = nicht abschließen. "
                                                  "Termine nötig fürs Budget: Blatt „Rechnung intern“")

    # Budget-Empfehlung neben den Budgetfeldern
    for key, anteil in (("budget_meta", f"{RI}$B$6"), ("budget_google", f"(1-{RI}$B$6)")):
        h = ws.cell(row=z[key], column=4)
        h.value = f'=ROUND({RI}$B$5*{anteil}/50,0)*50' 
        h.number_format = '"Empfehlung: "#,##0" €  ·  du entscheidest"'
        h.font = Font(name=F, size=10, bold=True, color="008000")

    # Rechnung intern
    ri = wb.create_sheet("Rechnung intern")
    titel(ri, "Rechnung intern — nie dem Kunden zeigen",
          "Blau = Annahme (nach 20–50 echten Anfragen durch eigene Zahlen ersetzen). Alles andere rechnet sich.")
    kopf(ri, 4, ["", "Wert", "Woher"], [46, 16, 70])
    steck = "Steckbrief!"
    budget_ein = f"N({steck}{S('budget_meta')})+N({steck}{S('budget_google')})"
    zeilen = [
        ("Empfohlenes Werbebudget zum Start",
         f"=IF(N({steck}{S('ticket_schnitt')})=0,3000,MIN(3000,ROUND({steck}{S('ticket_schnitt')}/5/100,0)*100))", EURO,
         f'=IF(N({steck}{S("ticket_schnitt")})=0,"Start mit 3.000 € (Auftragswert fehlt noch)",IF(B5<2500,'
         f'"Auftragswert ÷ 5 liegt unter 2.500 €: Anfragen werden knapp, Kunde passt eher nicht",'
         f'"Faustregel: Auftragswert ÷ 5, zum Start höchstens 3.000 €"))'),
        ("Davon Meta (Rest Google)", 0.7, "0%", "Annahme: Meta bringt bei PV die meisten Anfragen"),
        ("Werbebudget, mit dem gerechnet wird", f"=IF({budget_ein}>0,{budget_ein},B5)", EURO,
         f'=IF({budget_ein}>0,"aus dem Steckbrief","Empfehlung (Budget noch nicht eingetragen)")'),
        ("", None, None, ""),
        ("Kosten pro Anfrage", 50, EURO, "Annahme: Branchenquellen nennen grob 30–90 €"),
        ("Anteil Anfragen mit Termin", 0.4, "0%", "Annahme, nicht belegt"),
        ("Anteil Termine mit Auftrag", 0.2, "0%", "Annahme, nicht belegt"),
        ("Anfragen pro Monat", "=IFERROR(B7/B9,0)", "0", ""),
        ("Termine pro Monat", "=B12*B10", "0.0", "sollte zur Kapazität passen"),
        ("Aufträge pro Monat", "=B13*B11", "0.0", ""),
        ("Auftragswert im Schnitt", f"={steck}{S('ticket_schnitt')}", EURO, "aus dem Steckbrief"),
        ("Umsatz beim Kunden pro Monat", "=B14*B15", EURO, ""),
        ("Kosten des Kunden pro Monat", f"=B7+N({steck}{S('retainer')})", EURO, "Werbebudget + Monatsgebühr"),
        ("Umsatz pro eingesetztem Euro", "=IFERROR(B16/B17,0)", '0.0"×"', "über 3 ist gut · Marge des Betriebs beachten"),
        ("Termine pro Woche nötig", "=B13/4.33", "0.0", "muss zu seiner Kapazität im Steckbrief passen"),
    ]
    for i, (g, v, fmt, h) in enumerate(zeilen, start=5):
        ri.cell(row=i, column=1, value=g).font = Font(name=F, size=10, bold=i in (5, 7, 18, 19))
        if v is None:
            continue
        c = ri.cell(row=i, column=2, value=v)
        c.number_format = fmt
        annahme = not (isinstance(v, str) and v.startswith("="))
        c.font = Font(name=F, size=10, color="0000FF" if annahme else "000000", bold=i in (5, 7, 18, 19))
        if annahme:
            eingabe(c, fmt)
        ri.cell(row=i, column=3, value=h).font = HILFE
    wb.save(ZIEL / "01-steckbrief.xlsx")
    print("✓ 01-steckbrief.xlsx")


# ---------------------------------------------------------------- 02 Checkliste
CHECKLISTE = [
    ("4 · Abschluss", "Vereinbarung unterschrieben zurück", "Du"),
    ("4 · Abschluss", "Rechnung Onboarding geschickt (00-agentur.xlsx)", "Du"),
    ("4 · Abschluss", "Willkommens-Mail und Rückruf-Leitfaden geschickt", "Du"),
    ("5 · Vom Kunden", "Fotos im Drive-Ordner: mind. 3 fertige Anlagen, ideal ein Dach vorher und nachher", "Kunde"),
    ("5 · Vom Kunden", "Meta: Partnerzugriff auf Seite und Werbekonto", "Kunde"),
    ("5 · Vom Kunden", "Google Ads: Zugriff für dein Verwaltungskonto", "Kunde"),
    ("5 · Vom Kunden", "Links zu Impressum und Datenschutz, 2 echte Google-Bewertungen", "Kunde"),
    ("5 · Vom Kunden", "Name der Person, die die Wirtschaftlichkeitsprüfungen rechnet", "Kunde"),
    ("6 · Einrichten", "Fotos aus dem Drive und neue Angaben an Claude, Kundenordner neu erzeugt", "Du"),
    ("6 · Einrichten", "Seiten auf Netlify, Formular-Mails gehen an Kunde und dich", "Du"),
    ("6 · Einrichten", "Pixel angelegt, Adresse und Pixel-ID im Steckbrief, neu erzeugt, neu hochgeladen", "Du"),
    ("6 · Einrichten", "Meta-Kampagne mit den 5 Anzeigen angelegt (pausiert)", "Du"),
    ("6 · Einrichten", "Google-Kampagne angelegt (pausiert)", "Du"),
    ("7 · Live", "Test-Anfrage über jede Seite, Mail kommt beim Kunden an", "Du"),
    ("7 · Live", "Am Handy geprüft: Formular, Anrufen-Knopf, Fotos", "Du"),
    ("7 · Live", "Kampagnen aktiv. Datum hier eintragen = Start der 30 Tage", "Du"),
    ("7 · Live", "Kunde angerufen: Rückruf in 1 Stunde, fester Wochen-Anruf vereinbart", "Du"),
]


def checkliste():
    wb = Workbook()
    ws = wb.active
    ws.title = "Checkliste"
    titel(ws, "Checkliste bis zum Livegang", "Gleiche Schritte wie in der Anleitung (4 bis 7). Erledigt = „Ja“ wählen.")
    ws["A3"] = "Fortschritt"
    ws["A3"].font = Font(name=F, bold=True)
    end = 5 + len(CHECKLISTE)
    ws["C3"] = f'=COUNTIF(E6:E{end},"Ja")/{len(CHECKLISTE)}'
    ws["C3"].number_format = "0%"
    ws["C3"].font = Font(name=F, bold=True, size=12)
    kopf(ws, 5, ["Nr", "Schritt", "Aufgabe", "Wer", "Erledigt", "Datum"], [5, 17, 72, 9, 10, 13])
    for i, (ph, aufg, wer) in enumerate(CHECKLISTE, start=6):
        for col, v in enumerate((i - 5, ph, aufg, wer), start=1):
            c = ws.cell(row=i, column=col, value=v)
            c.font = Font(name=F, size=10)
            c.alignment = Alignment(vertical="top", wrap_text=True)
        eingabe(ws.cell(row=i, column=5))
        eingabe(ws.cell(row=i, column=6), "DD.MM.YYYY")
    liste(ws, f"E6:E{end}", ["Ja"])
    ws.conditional_formatting.add(f"A6:F{end}", FormulaRule(formula=['$E6="Ja"'], fill=GRUEN))
    ws.freeze_panes = "A6"
    wb.save(ZIEL / "02-checkliste-bis-livegang.xlsx")
    print("✓ 02-checkliste-bis-livegang.xlsx")


# ---------------------------------------------------------------- 03 Anfragen + Report
ANF_COLS = ["Eingang (Datum, Uhrzeit)", "Name", "Telefon", "PLZ", "Seite", "Rückruf (Datum, Uhrzeit)",
            "Minuten bis Rückruf", "Stand", "Auftragswert", "Notiz"]
STAND = ["neu", "nicht erreicht", "erreicht", "Termin", "Angebot", "Auftrag", "kein Interesse"]
N = 500


def anfragen():
    wb = Workbook()
    ws = wb.active
    ws.title = "Anfragen"
    titel(ws, "Anfragen", "Jede Anfrage eine Zeile. „Stand“ = wie weit sie gekommen ist (geht nie zurück). "
                          "Minuten rechnen sich. Zeile 5 ist ein Beispiel: überschreiben.")
    kopf(ws, 4, ANF_COLS, [17, 22, 16, 8, 16, 17, 10, 14, 13, 40])
    ws.row_dimensions[4].height = 34
    for r in range(5, 5 + N):
        for col in range(1, 11):
            ws.cell(row=r, column=col).font = Font(name=F, size=10, color="000000" if col == 7 else "0000FF")
        ws.cell(row=r, column=1).number_format = "DD.MM.YYYY HH:MM"
        ws.cell(row=r, column=6).number_format = "DD.MM.YYYY HH:MM"
        ws.cell(row=r, column=9).number_format = EURO
        ws.cell(row=r, column=7, value=f'=IF(AND(ISNUMBER(A{r}),ISNUMBER(F{r})),ROUND((F{r}-A{r})*1440,0),"")')
    bsp = [datetime(2027, 1, 4, 9, 12), "BEISPIEL Anna Muster", "0151 0000000", "12345", "Wirtschaftlichkeit",
           datetime(2027, 1, 4, 9, 40), None, "Angebot", None, "will Speicher, Dach Süd"]
    for col, v in enumerate(bsp, start=1):
        c = ws.cell(row=5, column=col)
        if col != 7:
            c.fill = IN_FILL
        if v is not None:
            c.value = v
            c.font = EX_FONT
    rng = lambda c: f"{c}5:{c}{4 + N}"
    liste(ws, rng("E"), ["Wirtschaftlichkeit", "Rechner", "Verlosung"])
    liste(ws, rng("H"), STAND)
    ws.conditional_formatting.add(rng("G"), CellIsRule(operator="greaterThan", formula=["60"], fill=ROT))
    ws.conditional_formatting.add(rng("H"), CellIsRule(operator="equal", formula=['"Auftrag"'], fill=GRUEN))
    ws.freeze_panes = "C5"
    ws["E4"].comment = Comment("Über welche Seite kam die Anfrage? Steht in der Anfrage-Mail (Formularname).", "Vorlage")
    ws["G4"].comment = Comment("Rot = über 60 Minuten. Größter Hebel überhaupt.", "Vorlage")

    wk = wb.create_sheet("Werbekosten")
    titel(wk, "Werbekosten", "Einmal im Monat aus Meta und Google abschreiben. Monat = erster Tag des Monats.")
    kopf(wk, 4, ["Monat", "Meta", "Google", "Summe"], [14, 14, 14, 14])
    for r in range(5, 41):
        eingabe(wk.cell(row=r, column=1), "MM.YYYY")
        eingabe(wk.cell(row=r, column=2), '#,##0.00 "€"')
        eingabe(wk.cell(row=r, column=3), '#,##0.00 "€"')
        d = wk.cell(row=r, column=4, value=f'=IF(A{r}="","",N(B{r})+N(C{r}))')
        d.number_format = '#,##0.00 "€"'
        d.font = Font(name=F, size=10)

    rp = wb.create_sheet("Monatsreport")
    titel(rp, "Monatsreport", "Nur den Monat eintragen. Alles rechnet sich, unten steht die fertige Mail zum Kopieren.")
    rp.column_dimensions["A"].width = 34
    rp.column_dimensions["B"].width = 16
    rp.column_dimensions["C"].width = 60
    for ref, label, v, fmt in (("4", "Monat (erster Tag)", datetime(2027, 1, 1), "MM.YYYY"),
                               ("5", "Anrede in der Mail", "Herr Muster", None),
                               ("6", "Dein Name", "", None)):
        rp[f"A{ref}"] = label
        rp[f"A{ref}"].font = Font(name=F, size=10, bold=True)
        rp[f"B{ref}"] = v
        eingabe(rp[f"B{ref}"], fmt)
    rp["C5"] = "füllt das Werkzeug beim Anlegen aus"
    rp["C5"].font = HILFE
    A = f"Anfragen!$A$5:$A${4 + N}"
    col = lambda c: f"Anfragen!${c}$5:${c}${4 + N}"
    zeit = f'{A},">="&$B$4,{A},"<"&EDATE($B$4,1)'
    stand = lambda s: f'COUNTIFS({zeit},{col("H")},"{s}")'
    kz = [
        ("Werbekosten", "=SUMIFS(Werbekosten!$D$5:$D$40,Werbekosten!$A$5:$A$40,$B$4)", EURO, "aus Blatt Werbekosten"),
        ("Anfragen", f"=COUNTIFS({zeit})", "0", ""),
        ("Kosten pro Anfrage", "=IFERROR(B9/B10,0)", EURO, "die wichtigste Zahl"),
        ("davon Wirtschaftlichkeit", f'=COUNTIFS({zeit},{col("E")},"Wirtschaftlichkeit")', "0", "Dauerkampagne"),
        ("davon Rechner", f'=COUNTIFS({zeit},{col("E")},"Rechner")', "0", "Dauerkampagne"),
        ("davon Verlosung", f'=COUNTIFS({zeit},{col("E")},"Verlosung")', "0", "nur wenn eine läuft"),
        ("Ø Minuten bis Rückruf", f"=IFERROR(AVERAGEIFS({col('G')},{zeit}),0)", "0", "Ziel: unter 60"),
        ("Termine", f"={stand('Termin')}+{stand('Angebot')}+{stand('Auftrag')}", "0", "Stand Termin oder weiter"),
        ("Angebote", f"={stand('Angebot')}+{stand('Auftrag')}", "0", ""),
        ("Aufträge", f"={stand('Auftrag')}", "0", ""),
        ("Auftragsumsatz", f'=SUMIFS({col("I")},{zeit},{col("H")},"Auftrag")', EURO, "laut Kunde"),
        ("Kosten pro Auftrag", "=IFERROR(B9/B18,0)", EURO, ""),
        ("Erster Auftrag überhaupt", f'=IF(COUNTIF({col("H")},"Auftrag")=0,"noch keiner",_xlfn.MINIFS({A},{col("H")},"Auftrag"))',
         "DD.MM.YYYY", "ab dem Folgemonat Monatsgebühr berechnen"),
    ]
    kopf(rp, 8, ["Zahl", "Wert", "Hinweis"])
    for i, (k, f, fmt, h) in enumerate(kz, start=9):
        rp.cell(row=i, column=1, value=k).font = Font(name=F, size=10, bold=k in ("Anfragen", "Aufträge", "Kosten pro Anfrage"))
        c = rp.cell(row=i, column=2, value=f)
        c.number_format = fmt
        c.font = Font(name=F, size=10, color="008000")
        rp.cell(row=i, column=3, value=h).font = HILFE
    monat = "CHOOSE(MONTH($B$4)," + ",".join(f'"{m}"' for m in MONATE) + ')&" "&YEAR($B$4)'
    n = lambda ref: f'FIXED({ref},0)'
    br = "&CHAR(10)&"
    mail = ('="Betreff: Ihr Monatsreport "&' + monat + br + 'CHAR(10)&"Hallo "&$B$5&","' + br + 'CHAR(10)&'
            '"hier Ihre Zahlen für "&' + monat + '&":"' + br +
            '"- Werbeausgaben: "&' + n("B9") + '&" €"' + br +
            '"- Anfragen: "&B10&" (Kosten pro Anfrage: "&' + n("B11") + '&" €)"' + br +
            '"- Rückruf im Schnitt nach "&' + n("B15") + '&" Minuten"' + br +
            '"- Termine: "&B16&" · Angebote: "&B17&" · Aufträge: "&B18' + br +
            'CHAR(10)&"Was wir geändert haben: [eine Sache]"' + br +
            '"Was wir als Nächstes tun: [eine Sache]"' + br +
            '"Was wir von Ihnen brauchen: [z. B. Rückmeldung zu offenen Anfragen]"' + br +
            'CHAR(10)&"Beste Grüße"' + br + '$B$6')
    rp["A23"] = "Mail zum Kopieren"
    rp["A23"].font = Font(name=F, bold=True, size=11)
    rp["A24"] = "Zelle B24 kopieren, in die Mail einfügen, die drei [eckigen Klammern] ersetzen, danach 10 Minuten telefonieren."
    rp["A24"].font = HILFE
    rp["A24"].alignment = Alignment(wrap_text=True, vertical="top")
    rp.merge_cells("B24:C24")
    rp["B24"] = mail
    rp["B24"].alignment = Alignment(wrap_text=True, vertical="top")
    rp["B24"].font = Font(name=F, size=10)
    rp["B24"].border = BOX
    rp.row_dimensions[24].height = 250
    wb.save(ZIEL / "03-anfragen-und-report.xlsx")
    print("✓ 03-anfragen-und-report.xlsx")


# ---------------------------------------------------------------- 04 Akquise
AKQ = ["Firma", "Ansprechpartner", "Ort", "Telefon", "Webseite", "Google (Sterne · Anzahl)", "Stand",
       "Nächster Anruf am", "Notiz"]
STAND_AKQ = ["neu", "nicht erreicht", "Videocall vereinbart", "Vereinbarung geschickt", "Kunde", "kein Interesse"]


def akquise():
    wb = Workbook()
    ws = wb.active
    ws.title = "PV-Betriebe"
    titel(ws, "Akquise: PV-Betriebe in ganz Deutschland",
          "Google Maps: „Photovoltaik [Stadt]“. Passt: inhabergeführt, gute Bewertungen, schwache Webseite. "
          "Sortieren nach „Nächster Anruf am“. Zeile 5 = Beispiel.")
    kopf(ws, 4, AKQ, [28, 20, 16, 16, 24, 14, 22, 14, 40])
    bsp = ["BEISPIEL Sonnendach GmbH", "Herr Beispiel", "Musterstadt", "0123 456789", "www.beispiel.de", "4,8 · 37",
           "neu", datetime(2027, 1, 12), "Inhaber morgens erreichbar"]
    for r in range(5, 505):
        for col in range(1, 10):
            ws.cell(row=r, column=col).font = Font(name=F, size=10, color="0000FF")
        ws.cell(row=r, column=8).number_format = "DD.MM.YYYY"
    for col, v in enumerate(bsp, start=1):
        c = ws.cell(row=5, column=col, value=v)
        c.font = EX_FONT
        c.fill = IN_FILL
    liste(ws, "G5:G504", STAND_AKQ)
    ws.conditional_formatting.add("G5:G504", CellIsRule(operator="equal", formula=['"Kunde"'], fill=GRUEN))
    ws.conditional_formatting.add("H5:H504", FormulaRule(formula=['AND(ISNUMBER(H5),H5<=TODAY(),$G5<>"Kunde",$G5<>"kein Interesse")'],
                                                         fill=PatternFill("solid", start_color="F9EEDA")))
    ws.auto_filter.ref = "A4:I504"
    ws.freeze_panes = "B5"

    ue = wb.create_sheet("Übersicht")
    titel(ue, "Übersicht", "Zählt sich selbst.")
    kopf(ue, 4, ["Stand", "Anzahl"], [28, 12])
    for i, s in enumerate(STAND_AKQ, start=5):
        ue.cell(row=i, column=1, value=s).font = Font(name=F, size=10)
        ue.cell(row=i, column=2, value=f"=COUNTIF('PV-Betriebe'!$G$5:$G$504,A{i})").font = Font(name=F, size=10, color="008000")
    r = 5 + len(STAND_AKQ)
    ue.cell(row=r, column=1, value="Heute oder überfällig anrufen").font = Font(name=F, bold=True)
    ue.cell(row=r, column=2, value="=COUNTIFS('PV-Betriebe'!$H$5:$H$504,\"<=\"&TODAY(),'PV-Betriebe'!$G$5:$G$504,\"<>Kunde\","
                                    "'PV-Betriebe'!$G$5:$G$504,\"<>kein Interesse\")").font = Font(name=F, bold=True)
    wb.save(ZIEL / "04-akquise-pv-betriebe.xlsx")
    print("✓ 04-akquise-pv-betriebe.xlsx")


if __name__ == "__main__":
    ZIEL.mkdir(parents=True, exist_ok=True)
    agentur()
    steckbrief()
    checkliste()
    anfragen()
    akquise()
