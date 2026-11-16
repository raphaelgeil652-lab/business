#!/usr/bin/env python3
"""Baut die leeren, ausfüllbaren Tabellen-Vorlagen in vorlagen/tabellen/.

Aufruf: python3 nischen/photovoltaik/vorlagen/werkzeuge/tabellen-bauen.py
Achtung: überschreibt die Vorlagen. 00-agentur-stammdaten.xlsx wird nur angelegt, wenn sie fehlt
(dort stehen deine eigenen Daten).

Die Spalte "Schlüssel" im Steckbrief und in den Stammdaten liest kunde-anlegen.py aus.
Nicht umbenennen.
"""
import pathlib
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.formatting.rule import CellIsRule, FormulaRule
from openpyxl.comments import Comment

ZIEL = pathlib.Path(__file__).resolve().parent.parent / "tabellen"
F = "Arial"
H_FILL = PatternFill("solid", start_color="1A1917")
IN_FILL = PatternFill("solid", start_color="FFF6CC")   # gelb = hier ausfüllen
SEC_FILL = PatternFill("solid", start_color="EFEAE0")
EX_FONT = Font(name=F, size=10, italic=True, color="7A756B")
THIN = Side(style="thin", color="D9D4CA")
BOX = Border(left=THIN, right=THIN, top=THIN, bottom=THIN)


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


def basis(ws):
    for row in ws.iter_rows():
        for c in row:
            if c.font is None or c.font.name != F:
                c.font = Font(name=F, size=c.font.size if c.font else 10, bold=c.font.bold if c.font else False,
                              italic=c.font.italic if c.font else False, color=c.font.color if c.font else None)


BUNDESLAENDER = ["Baden-Württemberg", "Bayern", "Berlin", "Brandenburg", "Bremen", "Hamburg", "Hessen",
                 "Mecklenburg-Vorpommern", "Niedersachsen", "Nordrhein-Westfalen", "Rheinland-Pfalz",
                 "Saarland", "Sachsen", "Sachsen-Anhalt", "Schleswig-Holstein", "Thüringen"]

# ---------------------------------------------------------------- Felder
# (Schlüssel, Feld, Beispiel, Hinweis, Typ)   Typ: text | datum | euro | zahl | janein | bundesland
AGENTUR = [
    ("agentur_name", "Name der Agentur", "Muster Agentur", "Wie du auf Rechnung und Vertrag heißt", "text"),
    ("agentur_inhaber", "Dein Name", "Max Beispiel", "Unterschrift im Vertrag, Absender der Mails", "text"),
    ("agentur_anschrift", "Anschrift", "Musterstraße 1, 12345 Musterstadt", "", "text"),
    ("agentur_email", "E-Mail", "info@beispiel.de", "Absender, Google-Ads-Einladung", "text"),
    ("agentur_telefon", "Telefon", "0170 0000000", "", "text"),
    ("agentur_steuernr", "Steuernummer", "12/345/67890", "", "text"),
    ("agentur_iban", "IBAN", "DE00 0000 0000 0000 0000 00", "Für Rechnungen", "text"),
    ("agentur_kleinunternehmer", "Kleinunternehmer (§19 UStG)?", "Ja", "Ja = keine Umsatzsteuer auf Rechnungen", "janein"),
    ("agentur_business_id", "Meta Business-ID", "1234567890", "Business-Einstellungen → Unternehmensinfos", "text"),
    ("agentur_google_mcc", "Google-Ads-Verwaltungskonto (Kunden-ID)", "123-456-7890", "Oben rechts in Google Ads", "text"),
]

STECKBRIEF = [
    ("§", "Betrieb", None, None, None),
    ("betrieb", "Betrieb (Kurzname)", "Muster Solartechnik", "So steht er in Anzeigen und Seiten", "text"),
    ("betrieb_lang", "Firmenname mit Rechtsform", "Muster Solartechnik GmbH", "Für Vertrag, Impressum, Teilnahmebedingungen", "text"),
    ("anrede", "Anrede Inhaber", "Herr", "Herr / Frau", "anrede"),
    ("inhaber", "Inhaber / Entscheider", "Markus Muster", "Vor- und Nachname", "text"),
    ("strasse", "Straße und Hausnummer", "Beispielweg 5", "", "text"),
    ("plz", "PLZ", "12345", "", "text"),
    ("ort", "Ort", "Musterstadt", "Sitz des Betriebs", "text"),
    ("bundesland", "Bundesland", "Bayern", "Auswahl", "bundesland"),
    ("telefon", "Telefon für Rückrufe", "0123 456789", "Steht auf Landingpage und Anzeige", "text"),
    ("email", "E-Mail (Anfragen gehen hierhin)", "anfragen@beispiel.de", "", "text"),
    ("webseite", "Webseite", "www.beispiel.de", "", "text"),
    ("google_profil", "Link Google-Profil", "https://g.page/…", "Für Bewertungen", "text"),
    ("oeffnungszeiten", "Geschäftszeiten", "Mo–Fr 8–17 Uhr", "", "text"),
    ("mitarbeiter", "Mitarbeiter", 7, "Anzahl", "zahl"),
    ("montageteams", "Eigene Montageteams", 2, "Anzahl. 0 = Subunternehmer → Anzeigentext anpassen", "zahl"),
    ("§", "Leistung und Kapazität", None, None, None),
    ("ticket_von", "Auftragswert von", 15000, "€, PV-Anlage mit Speicher", "euro"),
    ("ticket_bis", "Auftragswert bis", 25000, "€", "euro"),
    ("ticket_schnitt", "Auftragswert im Schnitt", 18000, "€, für die interne Rechnung", "euro"),
    ("kapazitaet_termine", "Zusätzliche Beratungstermine pro Woche", 4, "Antwort auf Frage 2 im Verkaufsgespräch", "zahl"),
    ("kapazitaet_montagen", "Zusätzliche Montagen pro Monat", 4, "", "zahl"),
    ("montagevorlauf", "Vorlauf bis zur Montage (Wochen)", 8, "", "zahl"),
    ("montagedauer", "Montagedauer", "1–2 Tage", "Text für Landingpage", "text"),
    ("einzugsgebiet_km", "Einzugsgebiet (km um den Ort)", 40, "„Bis wie weit fahren Sie zur Montage?“", "zahl"),
    ("rueckruf_zusage", "Rückruf innerhalb 1 Stunde zugesagt?", "Ja", "Nein = kein Abschluss", "janein"),
    ("§", "Verlosungen", None, None, None),
    ("aktion_ende", "Teilnahmeschluss", "2027-01-15", "Datum", "datum"),
    ("ziehung", "Datum der Ziehung", "2027-01-20", "Datum", "datum"),
    ("speicher", "Speicher bei der Verlosung", "10 kWh", "Größe/Modell, das der Betrieb verlost", "text"),
    ("§", "Preise und Budget", None, None, None),
    ("vertragsbeginn", "Vertragsbeginn", "2026-11-16", "Datum der Unterschrift", "datum"),
    ("onboarding_preis", "Onboarding (einmalig)", 850, "€, deine Entscheidung", "euro"),
    ("retainer", "Retainer pro Monat", 1500, "€, fällig ab erstem unterschriebenen Auftrag", "euro"),
    ("budget_meta", "Werbebudget Meta pro Monat", 700, "€, zahlt der Kunde direkt", "euro"),
    ("budget_google", "Werbebudget Google pro Monat", 300, "€, zahlt der Kunde direkt", "euro"),
    ("§", "Technik (nach dem Onboarding)", None, None, None),
    ("pixel_id", "Meta-Pixel-ID", "1234567890123456", "Events Manager des Kunden", "text"),
    ("landingpage_url", "Adresse der Landingpages", "https://muster-solar.netlify.app", "Nach dem Hochladen auf Netlify", "text"),
    ("drive_link", "Drive-Ordner für Fotos", "https://drive.google.com/…", "Freigabe: Bearbeiter für den Kunden", "text"),
    ("§", "Aus dem Gespräch", None, None, None),
    ("bisher", "Wie kommen bisher Kunden rein?", "Empfehlung, gekaufte Portal-Leads", "", "text"),
    ("notizen", "Notizen", "Will vor allem Anlagen mit Speicher verkaufen", "", "text"),
]


def schluesselblatt(wb, felder, name, titeltext, unter):
    ws = wb.active
    ws.title = name
    titel(ws, titeltext, unter)
    ws["A3"] = "Gelbe Zellen in Spalte C ausfüllen. Spalte D zeigt das Format. Spalte A nicht ändern."
    ws["A3"].font = Font(name=F, size=10, bold=True, color="B4461F")
    kopf(ws, 5, ["Schlüssel", "Feld", "Wert (ausfüllen)", "Beispiel", "Hinweis"], [20, 40, 38, 32, 50])
    r = 6
    for key, feld, bsp, hinweis, typ in felder:
        if key == "§":
            c = ws.cell(row=r, column=2, value=feld)
            c.font = Font(name=F, bold=True, size=11)
            for col in range(1, 6):
                ws.cell(row=r, column=col).fill = SEC_FILL
            r += 1
            continue
        ws.cell(row=r, column=1, value=key).font = Font(name=F, size=9, color="9A968C")
        ws.cell(row=r, column=2, value=feld).font = Font(name=F, size=10, bold=True)
        w = ws.cell(row=r, column=3)
        w.fill = IN_FILL
        w.border = BOX
        w.font = Font(name=F, size=10, color="0000FF")
        b = ws.cell(row=r, column=4, value=bsp)
        b.font = EX_FONT
        ws.cell(row=r, column=5, value=hinweis).font = Font(name=F, size=9, color="6B665D")
        if typ == "datum":
            w.number_format = "DD.MM.YYYY"
            b.value = f"{bsp[8:10]}.{bsp[5:7]}.{bsp[0:4]}"
        elif typ == "euro":
            w.number_format = '#,##0 "€"'
            b.number_format = '#,##0 "€"'
        elif typ == "janein":
            liste(ws, w.coordinate, ["Ja", "Nein"])
        elif typ == "anrede":
            liste(ws, w.coordinate, ["Herr", "Frau"])
        elif typ == "bundesland":
            liste(ws, w.coordinate, BUNDESLAENDER)
        r += 1
    ws.freeze_panes = "C6"
    ws.column_dimensions["A"].hidden = False
    return ws, r


def zeile_von(ws, key):
    for row in ws.iter_rows(min_row=6, max_col=1):
        if row[0].value == key:
            return row[0].row
    raise KeyError(key)


# ---------------------------------------------------------------- 00 Agentur
def agentur():
    p = ZIEL / "00-agentur-stammdaten.xlsx"
    if p.exists():
        print("· 00-agentur-stammdaten.xlsx existiert, bleibt unverändert")
        return
    wb = Workbook()
    schluesselblatt(wb, AGENTUR, "Agentur", "Agentur-Stammdaten",
                    "Einmal ausfüllen. Gilt für alle Kunden (Vertrag, Mails, Rechnungen).")
    wb.save(p)
    print("✓", p.name)


# ---------------------------------------------------------------- 01 Steckbrief
def steckbrief():
    wb = Workbook()
    ws, _ = schluesselblatt(wb, STECKBRIEF, "Steckbrief", "Kunden-Steckbrief Photovoltaik",
                            "Im oder direkt nach dem Verkaufsgespräch ausfüllen. Daraus erzeugt "
                            "kunde-anlegen.py den kompletten Kundenordner.")
    S = "Steckbrief!$C$"

    # Pflichtcheck
    pc = wb.create_sheet("Pflichtcheck")
    titel(pc, "Pflichtcheck vor der Unterschrift", "Alle fünf müssen „Ja“ sein. Sonst kündigt der Kunde meist nach zwei Monaten.")
    kopf(pc, 4, ["Kriterium", "Erfüllt?", "Prüffrage im Gespräch"], [52, 12, 70])
    krit = [
        ("Auftragswert über ca. 300 € (bei PV immer erfüllt)", "„Was kostet bei Ihnen eine Anlage mit Speicher im Schnitt?“"),
        ("Kapazität für zusätzliche Termine und Montagen", "„Wie viele Montagen pro Monat könnten Sie zusätzlich schaffen?“"),
        ("Der Entscheider sitzt am Tisch", "„Entscheiden Sie selbst über Werbung?“"),
        ("Rückruf innerhalb 1 Stunde zugesagt", "„Wenn eine Anfrage reinkommt: Schaffen Sie den Rückruf innerhalb einer Stunde?“"),
        ("Fotos fertiger Anlagen vorhanden oder zugesagt", "„Haben Sie Fotos von Dächern vorher und nachher?“"),
    ]
    for i, (k, f) in enumerate(krit, start=5):
        pc.cell(row=i, column=1, value=k).font = Font(name=F, size=10)
        c = pc.cell(row=i, column=2)
        c.fill = IN_FILL
        c.border = BOX
        c.font = Font(name=F, size=10, color="0000FF", bold=True)
        pc.cell(row=i, column=3, value=f).font = Font(name=F, size=10, color="6B665D")
    liste(pc, "B5:B9", ["Ja", "Nein"])
    pc["A11"] = "Ergebnis"
    pc["A11"].font = Font(name=F, bold=True, size=12)
    pc["B11"] = '=IF(COUNTIF(B5:B9,"Ja")=5,"Kunde passt",IF(COUNTIF(B5:B9,"Nein")>0,"Nicht abschließen","noch offen"))'
    pc["B11"].font = Font(name=F, bold=True, size=12)
    pc.column_dimensions["B"].width = 20
    pc.conditional_formatting.add("B11", FormulaRule(formula=['B11="Kunde passt"'], fill=PatternFill("solid", start_color="E5F4E4")))
    pc.conditional_formatting.add("B11", FormulaRule(formula=['B11="Nicht abschließen"'], fill=PatternFill("solid", start_color="FBEBEB")))

    # Interne Rechnung
    ri = wb.create_sheet("Rechnung intern")
    titel(ri, "Interne Rechnung — nie dem Kunden zeigen",
          "Prüft, ob ein Auftrag beim Kunden den Retainer trägt. Annahmen in Blau, alles andere rechnet sich.")
    kopf(ri, 4, ["Größe", "Wert", "Herkunft"], [44, 16, 70])
    zeilen = [
        ("Werbebudget pro Monat (€)", f"={S}{zeile_von(ws,'budget_meta')}+{S}{zeile_von(ws,'budget_google')}", "aus dem Steckbrief", '#,##0 "€"'),
        ("Kosten pro Anfrage (€, Annahme)", 50, "Annahme: Branchenquellen nennen grob 30–90 €. Nach 20–50 Anfragen durch eigene Zahl ersetzen.", '#,##0 "€"'),
        ("Anfragen pro Monat", "=IFERROR(B5/B6,0)", "Budget ÷ Kosten pro Anfrage", "0"),
        ("Anteil mit Termin (Annahme)", 0.4, "Annahme, nicht belegt. Mit eigenen Zahlen aus dem Anfragen-Tracker ersetzen.", "0%"),
        ("Anteil Termin → Auftrag (Annahme)", 0.2, "Annahme, nicht belegt.", "0%"),
        ("Aufträge pro Monat", "=B7*B8*B9", "", "0.0"),
        ("Auftragswert im Schnitt (€)", f"={S}{zeile_von(ws,'ticket_schnitt')}", "aus dem Steckbrief", '#,##0 "€"'),
        ("Umsatz beim Kunden pro Monat (€)", "=B10*B11", "", '#,##0 "€"'),
        ("Kosten des Kunden pro Monat (€)", f"=B5+{S}{zeile_von(ws,'retainer')}", "Budget + Retainer", '#,##0 "€"'),
        ("Umsatz pro eingesetztem Euro", "=IFERROR(B12/B13,0)", "über 3 ist komfortabel, Marge des Betriebs beachten", '0.0"×"'),
    ]
    for i, (g, v, h, fmt) in enumerate(zeilen, start=5):
        ri.cell(row=i, column=1, value=g).font = Font(name=F, size=10)
        c = ri.cell(row=i, column=2, value=v)
        c.number_format = fmt
        blau = not (isinstance(v, str) and v.startswith("="))
        c.font = Font(name=F, size=10, color="0000FF" if blau else ("008000" if "Steckbrief" in str(v) else "000000"), bold=(i == 14))
        if blau:
            c.fill = IN_FILL
        ri.cell(row=i, column=3, value=h).font = Font(name=F, size=9, color="6B665D")
    p = ZIEL / "01-steckbrief.xlsx"
    wb.save(p)
    print("✓", p.name)


# ---------------------------------------------------------------- 02 Onboarding
ONBOARDING = [
    ("Tag der Unterschrift", "Steckbrief vollständig ausgefüllt, Pflichtcheck = „Kunde passt“", "Du"),
    ("Tag der Unterschrift", "Kundenordner erzeugt (kunde-anlegen.py)", "Claude"),
    ("Tag der Unterschrift", "Vereinbarung unterschrieben (PDF)", "Du"),
    ("Tag der Unterschrift", "Onboarding-Rechnung gestellt (05-rechnungen.xlsx)", "Du"),
    ("Tag der Unterschrift", "Drive-Ordner angelegt und für den Kunden freigegeben", "Du"),
    ("Tag der Unterschrift", "Willkommens-Mail verschickt", "Du"),
    ("Tag der Unterschrift", "Rückruf-Leitfaden an das Büro des Kunden geschickt", "Du"),
    ("Bis Tag 3", "Fotos Dach vorher/nachher (mind. 3 Paare) im Drive", "Kunde"),
    ("Bis Tag 3", "Meta-Partnerzugriff (Seite, Werbekonto, Pixel)", "Kunde"),
    ("Bis Tag 3", "Google-Ads-Partnerzugriff", "Kunde"),
    ("Bis Tag 3", "Logo, Telefon, Adresse, Geschäftszeiten bestätigt", "Kunde"),
    ("Bis Tag 3", "Verlosungen freigegeben: Enddatum, Ziehung, Speichergröße, Kosten", "Kunde"),
    ("Bis Tag 3", "Impressum und Datenschutzerklärung erhalten", "Kunde"),
    ("Bis Tag 3", "Teilnahmebedingungen rechtlich geprüft", "Du"),
    ("Einrichtung", "Fotos des Kunden in anzeigen/fotos und landingpage/fotos gelegt", "Claude"),
    ("Einrichtung", "Kundenordner neu erzeugt (mit Pixel-ID und Fotos)", "Claude"),
    ("Einrichtung", "Landingpages auf Netlify hochgeladen, Formular-Benachrichtigung an Kunde und dich", "Du"),
    ("Einrichtung", "Meta-Kampagne mit 3 Anzeigen angelegt (pausiert)", "Du"),
    ("Einrichtung", "Google-Kampagne angelegt (pausiert)", "Du"),
    ("Vor dem Livegang", "Test-Anfrage über jede der 3 Landingpages", "Du"),
    ("Vor dem Livegang", "Anfrage-Mail kommt beim Kunden an (Spam prüfen)", "Du"),
    ("Vor dem Livegang", "Pixel feuert erst nach Zustimmung (Events Manager → Testereignisse)", "Du"),
    ("Vor dem Livegang", "Advantage+ Creative-Verbesserungen und Multi-Advertiser aus", "Du"),
    ("Livegang", "Kampagnen aktiv, Datum notiert (Start der 30-Tage-Garantie)", "Du"),
    ("Livegang", "Kunde informiert: Rückruf innerhalb 1 Stunde", "Du"),
    ("Livegang", "Wöchentlicher Kurzanruf vereinbart", "Du"),
    ("Livegang", "Erster Report-Termin vereinbart", "Du"),
]


def onboarding():
    wb = Workbook()
    ws = wb.active
    ws.title = "Onboarding"
    titel(ws, "Onboarding-Checkliste", "Status per Auswahl setzen. Der Fortschritt rechnet sich selbst.")
    ws["A3"] = "Fortschritt"
    ws["A3"].font = Font(name=F, bold=True)
    ws["C3"] = f'=COUNTIF(E6:E{5+len(ONBOARDING)},"erledigt")/COUNTA(C6:C{5+len(ONBOARDING)})'
    ws["C3"].number_format = "0%"
    ws["C3"].font = Font(name=F, bold=True, size=12)
    kopf(ws, 5, ["Nr", "Phase", "Aufgabe", "Wer", "Status", "Erledigt am", "Notiz"], [5, 20, 70, 10, 12, 13, 40])
    for i, (ph, aufg, wer) in enumerate(ONBOARDING, start=6):
        ws.cell(row=i, column=1, value=i - 5)
        ws.cell(row=i, column=2, value=ph)
        ws.cell(row=i, column=3, value=aufg)
        ws.cell(row=i, column=4, value=wer)
        s = ws.cell(row=i, column=5, value="offen")
        s.fill = IN_FILL
        d = ws.cell(row=i, column=6)
        d.fill = IN_FILL
        d.number_format = "DD.MM.YYYY"
        ws.cell(row=i, column=7).fill = IN_FILL
        for col in range(1, 8):
            ws.cell(row=i, column=col).font = Font(name=F, size=10)
            ws.cell(row=i, column=col).alignment = Alignment(vertical="top", wrap_text=True)
    end = 5 + len(ONBOARDING)
    liste(ws, f"E6:E{end}", ["offen", "läuft", "erledigt"])
    liste(ws, f"D6:D{end}", ["Du", "Kunde", "Claude"])
    ws.conditional_formatting.add(f"E6:E{end}", CellIsRule(operator="equal", formula=['"erledigt"'], fill=PatternFill("solid", start_color="E5F4E4")))
    ws.conditional_formatting.add(f"E6:E{end}", CellIsRule(operator="equal", formula=['"läuft"'], fill=PatternFill("solid", start_color="F9EEDA")))
    ws.freeze_panes = "A6"
    p = ZIEL / "02-onboarding.xlsx"
    wb.save(p)
    print("✓", p.name)


# ---------------------------------------------------------------- 03 Anfragen + Report
ANF_COLS = ["Eingang (Datum, Uhrzeit)", "Name", "Telefon", "PLZ", "Eigentümer", "Verlosung", "Quelle",
            "Rückruf (Datum, Uhrzeit)", "Reaktion (Min.)", "Termin?", "Angebot?", "Auftrag?",
            "Auftragswert (€)", "Status", "Notiz"]
N = 500


def anfragen():
    wb = Workbook()
    ws = wb.active
    ws.title = "Anfragen"
    titel(ws, "Anfragen", "Jede Anfrage eine Zeile. Gelb ausfüllen, Reaktionszeit rechnet sich. Zeile 5 ist ein Beispiel: löschen oder überschreiben.")
    kopf(ws, 4, ANF_COLS, None)
    breiten = [17, 22, 16, 8, 14, 12, 9, 17, 10, 9, 9, 9, 13, 12, 36]
    for i, b in enumerate(breiten, start=1):
        ws.column_dimensions[chr(64 + i)].width = b
    ws.row_dimensions[4].height = 34
    from datetime import datetime
    bsp = [datetime(2027, 1, 3, 9, 12), "BEISPIEL Anna Muster", "0151 0000000", "12345", "Einfamilienhaus",
           "Speicher", "Meta", datetime(2027, 1, 3, 9, 40), None, "Ja", "Ja", "Nein", None, "Angebot", "Will Speicher, Dach Süd"]
    for r in range(5, 5 + N):
        for col in range(1, 16):
            c = ws.cell(row=r, column=col)
            c.font = Font(name=F, size=10, color="0000FF" if col != 9 else "000000")
            if col != 9:
                c.fill = IN_FILL if r == 5 else PatternFill(None)
        ws.cell(row=r, column=1).number_format = "DD.MM.YYYY HH:MM"
        ws.cell(row=r, column=8).number_format = "DD.MM.YYYY HH:MM"
        ws.cell(row=r, column=13).number_format = '#,##0 "€"'
        ws.cell(row=r, column=9, value=f'=IF(AND(ISNUMBER(A{r}),ISNUMBER(H{r})),ROUND((H{r}-A{r})*1440,0),"")')
    for col, v in enumerate(bsp, start=1):
        if v is not None:
            ws.cell(row=5, column=col, value=v).font = EX_FONT
    rng = lambda c: f"{c}5:{c}{4+N}"
    liste(ws, rng("E"), ["Einfamilienhaus", "Mehrfamilienhaus", "Mieter"])
    liste(ws, rng("F"), ["Modul", "Rabatt", "Speicher"])
    liste(ws, rng("G"), ["Meta", "Google", "Sonstige"])
    for c in "JKL":
        liste(ws, rng(c), ["Ja", "Nein"])
    liste(ws, rng("N"), ["neu", "erreicht", "Termin", "Angebot", "Auftrag", "verloren"])
    ws.conditional_formatting.add(rng("I"), CellIsRule(operator="greaterThan", formula=["60"], fill=PatternFill("solid", start_color="FBEBEB")))
    ws.freeze_panes = "C5"
    ws["I4"].comment = Comment("Minuten zwischen Eingang und Rückruf. Rot = über 60 Minuten.", "Vorlage")

    wk = wb.create_sheet("Werbekosten")
    titel(wk, "Werbekosten", "Pro Monat aus Meta und Google übertragen. Monat = erster Tag des Monats.")
    kopf(wk, 4, ["Monat", "Meta (€)", "Google (€)", "Summe (€)"], [14, 14, 14, 14])
    for r in range(5, 29):
        wk.cell(row=r, column=1).number_format = "MM.YYYY"
        for col in (1, 2, 3):
            wk.cell(row=r, column=col).fill = IN_FILL
            wk.cell(row=r, column=col).font = Font(name=F, size=10, color="0000FF")
        wk.cell(row=r, column=2).number_format = '#,##0.00 "€"'
        wk.cell(row=r, column=3).number_format = '#,##0.00 "€"'
        d = wk.cell(row=r, column=4, value=f"=IF(A{r}=\"\",\"\",B{r}+C{r})")
        d.number_format = '#,##0.00 "€"'
        d.font = Font(name=F, size=10)

    rp = wb.create_sheet("Monatsreport")
    titel(rp, "Monatsreport", "Nur den Monat in B4 eintragen (erster Tag des Monats). Alles andere rechnet sich aus den anderen Blättern.")
    rp.column_dimensions["A"].width = 40
    rp.column_dimensions["B"].width = 18
    rp.column_dimensions["C"].width = 52
    rp["A4"] = "Monat"
    rp["B4"] = datetime(2027, 1, 1)
    rp["B4"].number_format = "MM.YYYY"
    rp["B4"].fill = IN_FILL
    rp["B4"].font = Font(name=F, bold=True, color="0000FF")
    A = f"Anfragen!$A$5:$A${4+N}"
    von, bis = "$B$4", "EDATE($B$4,1)"
    zeit = f'{A},">="&{von},{A},"<"&{bis}'
    col = lambda c: f"Anfragen!${c}$5:${c}${4+N}"
    kz = [
        ("Werbekosten", f"=SUMIFS(Werbekosten!$D$5:$D$28,Werbekosten!$A$5:$A$28,{von})", '#,##0 "€"', "aus Blatt Werbekosten"),
        ("Anfragen", f"=COUNTIFS({zeit})", "0", ""),
        ("Kosten pro Anfrage", "=IFERROR(B6/B7,0)", '#,##0 "€"', "wichtigste Steuerzahl"),
        ("davon Verlosung Modul", f'=COUNTIFS({zeit},{col("F")},"Modul")', "0", ""),
        ("davon Verlosung Rabatt", f'=COUNTIFS({zeit},{col("F")},"Rabatt")', "0", ""),
        ("davon Verlosung Speicher", f'=COUNTIFS({zeit},{col("F")},"Speicher")', "0", ""),
        ("Ø Reaktionszeit (Min.)", f"=IFERROR(AVERAGEIFS({col('I')},{zeit}),0)", "0", "Ziel: unter 60"),
        ("Termine", f'=COUNTIFS({zeit},{col("J")},"Ja")', "0", ""),
        ("Angebote", f'=COUNTIFS({zeit},{col("K")},"Ja")', "0", ""),
        ("Aufträge", f'=COUNTIFS({zeit},{col("L")},"Ja")', "0", ""),
        ("Auftragsumsatz", f'=SUMIFS({col("M")},{zeit},{col("L")},"Ja")', '#,##0 "€"', "laut Kunde"),
        ("Kosten pro Auftrag", "=IFERROR(B6/B15,0)", '#,##0 "€"', ""),
        ("Erster Auftrag überhaupt (Retainer-Start)", f'=IF(COUNTIFS({col("L")},"Ja")=0,"noch keiner",_xlfn.MINIFS({A},{col("L")},"Ja"))', "DD.MM.YYYY", "ab diesem Monat ist der Retainer fällig"),
    ]
    kopf(rp, 5, ["Kennzahl", "Wert", "Hinweis"], None)
    for i, (k, f, fmt, h) in enumerate(kz, start=6):
        rp.cell(row=i, column=1, value=k).font = Font(name=F, size=10, bold=k in ("Anfragen", "Aufträge", "Kosten pro Anfrage"))
        c = rp.cell(row=i, column=2, value=f)
        c.number_format = fmt
        c.font = Font(name=F, size=10, color="008000")
        rp.cell(row=i, column=3, value=h).font = Font(name=F, size=9, color="6B665D")
    p = ZIEL / "03-anfragen-und-report.xlsx"
    wb.save(p)
    print("✓", p.name)


# ---------------------------------------------------------------- 04 Akquise
AKQ = ["Firma", "Ansprechpartner", "Ort", "Bundesland", "Telefon", "Webseite", "Google-Bewertung", "Anzahl Bewertungen",
       "Montiert selbst?", "Status", "Nächster Schritt", "Datum nächster Schritt", "Notiz"]
STATUS_AKQ = ["neu", "nicht erreicht", "Gespräch", "Videocall vereinbart", "Vereinbarung geschickt", "Kunde", "kein Interesse"]


def akquise():
    wb = Workbook()
    ws = wb.active
    ws.title = "PV-Betriebe"
    titel(ws, "Akquise: PV-Betriebe in ganz Deutschland", "Quelle: Google Maps „Photovoltaik [Stadt]“. Passt: inhabergeführt, gute Bewertungen, schwache Webseite, montiert selbst. Zeile 5 = Beispiel.")
    kopf(ws, 4, AKQ, None)
    for i, b in enumerate([26, 20, 16, 20, 16, 22, 11, 11, 11, 20, 30, 14, 36], start=1):
        ws.column_dimensions[chr(64 + i)].width = b
    from datetime import datetime
    bsp = ["BEISPIEL Sonnendach GmbH", "Herr Beispiel", "Musterstadt", "Hessen", "0123 456789", "www.beispiel.de", 4.8, 37,
           "Ja", "neu", "Anrufen, nach Inhaber fragen", datetime(2027, 1, 10), ""]
    for r in range(5, 505):
        for col in range(1, 14):
            ws.cell(row=r, column=col).font = Font(name=F, size=10, color="0000FF")
        ws.cell(row=r, column=7).number_format = "0.0"
        ws.cell(row=r, column=12).number_format = "DD.MM.YYYY"
    for col, v in enumerate(bsp, start=1):
        ws.cell(row=5, column=col, value=v).font = EX_FONT
        ws.cell(row=5, column=col).fill = IN_FILL
    liste(ws, "D5:D504", BUNDESLAENDER)
    liste(ws, "I5:I504", ["Ja", "Nein", "unklar"])
    liste(ws, "J5:J504", STATUS_AKQ)
    ws.conditional_formatting.add("J5:J504", CellIsRule(operator="equal", formula=['"Kunde"'], fill=PatternFill("solid", start_color="E5F4E4")))
    ws.freeze_panes = "B5"

    ue = wb.create_sheet("Übersicht")
    titel(ue, "Pipeline", "Zählt sich selbst aus dem Blatt PV-Betriebe.")
    kopf(ue, 4, ["Status", "Anzahl"], [28, 12])
    for i, s in enumerate(STATUS_AKQ, start=5):
        ue.cell(row=i, column=1, value=s).font = Font(name=F, size=10)
        ue.cell(row=i, column=2, value=f"=COUNTIF('PV-Betriebe'!$J$5:$J$504,A{i})").font = Font(name=F, size=10, color="008000")
    r = 5 + len(STATUS_AKQ)
    ue.cell(row=r, column=1, value="Gesamt").font = Font(name=F, bold=True)
    ue.cell(row=r, column=2, value=f"=SUM(B5:B{r-1})").font = Font(name=F, bold=True)
    p = ZIEL / "04-akquise-pv-betriebe.xlsx"
    wb.save(p)
    print("✓", p.name)


# ---------------------------------------------------------------- 05 Rechnungen
def rechnungen():
    wb = Workbook()
    ws = wb.active
    ws.title = "Rechnungen"
    titel(ws, "Rechnungen (alle Kunden)", "Eine Zeile pro Rechnung. Brutto, Fälligkeit und Status rechnen sich. Zeile 6 = Beispiel.")
    ws["A3"] = "Offen gesamt (€)"
    ws["A3"].font = Font(name=F, bold=True)
    ws["C3"] = '=SUMIFS(H6:H505,K6:K505,"<>bezahlt",H6:H505,">0")'
    ws["C3"].number_format = '#,##0.00 "€"'
    ws["C3"].font = Font(name=F, bold=True, size=12)
    kopf(ws, 5, ["Rechnungsnr.", "Datum", "Kunde", "Posten", "Zeitraum", "Netto (€)", "USt.-Satz", "Brutto (€)",
                 "Fällig am", "Bezahlt am", "Status"], [14, 12, 24, 13, 16, 12, 10, 12, 12, 12, 12])
    from datetime import datetime
    bsp = ["2027-001", datetime(2026, 11, 16), "BEISPIEL Muster Solartechnik", "Onboarding", "einmalig", 850, 0]
    for r in range(6, 506):
        for col in (1, 2, 3, 4, 5, 6, 7, 10):
            c = ws.cell(row=r, column=col)
            c.font = Font(name=F, size=10, color="0000FF")
        ws.cell(row=r, column=2).number_format = "DD.MM.YYYY"
        ws.cell(row=r, column=10).number_format = "DD.MM.YYYY"
        ws.cell(row=r, column=6).number_format = '#,##0.00 "€"'
        ws.cell(row=r, column=7).number_format = "0%"
        h = ws.cell(row=r, column=8, value=f'=IF(F{r}="","",F{r}*(1+G{r}))')
        h.number_format = '#,##0.00 "€"'
        i_ = ws.cell(row=r, column=9, value=f'=IF(B{r}="","",B{r}+14)')
        i_.number_format = "DD.MM.YYYY"
        ws.cell(row=r, column=11, value=f'=IF(B{r}="","",IF(ISNUMBER(J{r}),"bezahlt",IF(TODAY()>I{r},"überfällig","offen")))')
        for col in (8, 9, 11):
            ws.cell(row=r, column=col).font = Font(name=F, size=10)
    for col, v in enumerate(bsp, start=1):
        ws.cell(row=6, column=col, value=v).font = EX_FONT
        ws.cell(row=6, column=col).fill = IN_FILL
    ws["G6"].number_format = "0%"
    liste(ws, "D6:D505", ["Onboarding", "Retainer", "Sonstiges"])
    dvp = DataValidation(type="list", formula1='"0,0.19"', allow_blank=True)
    ws.add_data_validation(dvp)
    dvp.add("G6:G505")
    ws["G5"].comment = Comment("0 = Kleinunternehmer (§19 UStG), 0.19 = 19 %", "Vorlage")
    ws.conditional_formatting.add("K6:K505", CellIsRule(operator="equal", formula=['"überfällig"'], fill=PatternFill("solid", start_color="FBEBEB")))
    ws.conditional_formatting.add("K6:K505", CellIsRule(operator="equal", formula=['"bezahlt"'], fill=PatternFill("solid", start_color="E5F4E4")))
    ws.freeze_panes = "A6"
    p = ZIEL / "05-rechnungen.xlsx"
    wb.save(p)
    print("✓", p.name)


if __name__ == "__main__":
    ZIEL.mkdir(parents=True, exist_ok=True)
    agentur()
    steckbrief()
    onboarding()
    anfragen()
    akquise()
    rechnungen()
