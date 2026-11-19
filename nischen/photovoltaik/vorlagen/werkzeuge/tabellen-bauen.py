#!/usr/bin/env python3
"""Baut die ausfüllbaren Tabellen in vorlagen/tabellen/.

Aufruf: python3 nischen/photovoltaik/vorlagen/werkzeuge/tabellen-bauen.py

  01-steckbrief.xlsx              pro Kunde kopieren. Blatt „Steckbrief“ (prüft selbst, ob der Kunde passt,
                                  schlägt das Budget vor), „Rechnung intern“, „Deine Daten“ (einmal in der
                                  Vorlage ausfüllen, dann trägt jede Kopie sie mit)

Checkliste, Anfragen, Akquise, Werbekosten und Rechnungen liegen in der Zentrale (zentrale/), nicht hier.
Die versteckte Spalte A (Schlüssel) lesen die Werkzeuge aus. Nicht ändern.
"""
import pathlib
from copy import copy

from openpyxl import Workbook
from openpyxl.formatting.rule import FormulaRule
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
AGENTUR = [  # nur was Vertrag und Mails brauchen; IBAN und Steuernummer stehen in der Zentrale
    ("agentur_name", "Name der Agentur", "steht im Vertrag und in den Mails", "text"),
    ("agentur_inhaber", "Dein Name", "Unterschrift im Vertrag, Absender der Mails", "text"),
    ("agentur_anschrift", "Deine Anschrift", "Straße, PLZ Ort (für den Vertrag)", "text"),
    ("agentur_email", "Deine E-Mail", "", "text"),
    ("agentur_telefon", "Dein Telefon", "mit ' davor eintippen, damit die 0 bleibt", "text"),
    ("agentur_kleinunternehmer", "Kleinunternehmer (§ 19 UStG)?", "Ja = im Vertrag steht: keine Umsatzsteuer", "janein"),
    ("agentur_business_id", "Meta Business-ID", "Einstellungen → Unternehmensinfos · mit ' davor eintippen", "text"),
    ("agentur_google_mcc", "Google-Ads-Verwaltungskonto (Kunden-ID)", "oben rechts in Google Ads, z. B. 123-456-7890", "text"),
]

STECKBRIEF = [
    ("§", "1 · Im Gespräch: Passt der Kunde?", None, None),
    ("betrieb", "Betrieb (so heißt er in den Anzeigen)", "z. B. Muster Solartechnik", "text"),
    ("anrede", "Anrede des Inhabers", "Herr / Frau", "anrede"),
    ("inhaber", "Inhaber (Vor- und Nachname)", "z. B. Markus Muster", "text"),
    ("telefon", "Telefon für Rückrufe", "steht auf den Seiten · mit ' davor, damit die 0 bleibt", "text"),
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
    ("drive_link", "Google-Drive-Ordner für seine Fotos (Link)", "in Schritt 3 anlegen, für den Kunden freigeben: Bearbeiter", "text"),
    ("§", "3 · Kommt vom Kunden (nach der Unterschrift)", None, None),
    ("impressum_url", "Link zu seinem Impressum", "von seiner Webseite kopieren", "text"),
    ("datenschutz_url", "Link zu seiner Datenschutzerklärung", "von seiner Webseite kopieren", "text"),
    ("bewertung_1", "Echte Google-Bewertung 1", "Text — Vorname, Ort · leer = kein Bewertungs-Block", "text"),
    ("bewertung_2", "Echte Google-Bewertung 2", "nie erfinden", "text"),
    ("§", "4 · Zum Einrichten (vor dem Hochladen)", None, None),
    ("pixel_id", "Meta-Pixel-ID (Datensatz-ID)", "15–16 Ziffern, mit ' davor eintippen · wie: „7 Kampagnen“, Messung einrichten", "text"),
    ("google_conversion", "Google-Ads-Conversion (ID/Label)", "z. B. AW-123456789/AbCdEfGh · nur wenn Google-Kampagne", "text"),
    ("landingpage_url", "Eigene Adresse der Seiten (nur falls nötig)", "leer = https://<kürzel>.netlify.app (das Kürzel steht in der Übersicht des Kunden)", "text"),
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
        if typ == "text":
            w.number_format = "@"  # als Text: sonst macht Excel aus 0152… eine Zahl und kürzt lange IDs
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


# ---------------------------------------------------------------- 01 Steckbrief
def steckbrief():
    wb = Workbook()
    ws = wb.active
    ws.title = "Steckbrief"
    z = schluesselblatt(ws, STECKBRIEF, "Steckbrief: neuer Kunde",
                        "Für jeden Kunden eine Kopie. Teil 1 im Videocall, Teil 2 bis zur Unterschrift, dann an Claude: "
                        "„Lege den Kunden aus diesem Steckbrief an.“ Einmalig vorher: Blatt „Deine Daten“ ausfüllen.")
    S = lambda k: f"$C${z[k]}"
    RI = "'Rechnung intern'!"

    # Ergebnis
    e = ws.cell(row=z["ergebnis"], column=3)
    ent, rr, fo, kap = S("check_entscheider"), S("check_rueckruf"), S("check_fotos"), S("kapazitaet_termine")
    noetig = f"{RI}$B$19"
    e.value = (f'=IF(OR({ent}="Nein",{rr}="Nein",{fo}="Nein"),"✗ So nicht abschließen",'
               f'IF(AND({ent}="Ja",{rr}="Ja",{fo}="Ja",{kap}<>""),'
               f'IF(AND(N({S("ticket_schnitt")})>0,{RI}$B$5<2500),"⚠ Auftragswert unter 12.500 €: Budget läge unter 2.500 €, eher nicht abschließen",'
               f'IF(N({kap})>=ROUNDDOWN({noetig},0),"✓ Kunde passt","⚠ Kapazität zu klein für das Budget: Budget senken oder mehr Termine klären")),'
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
    dd = wb.create_sheet("Deine Daten")
    schluesselblatt(dd, AGENTUR, "Deine Daten (einmal ausfüllen)",
                    "Einmal in der leeren Vorlage ausfüllen und speichern. Jede Kopie für einen Kunden trägt sie dann mit.")
    wb.save(ZIEL / "01-steckbrief.xlsx")
    print("✓ 01-steckbrief.xlsx")


if __name__ == "__main__":
    ZIEL.mkdir(parents=True, exist_ok=True)
    steckbrief()
