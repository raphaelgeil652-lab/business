#!/usr/bin/env python3
"""Baut „Clickculture Zentrale.xlsx“: die Tabelle, die in Google Drive hochgeladen wird und mit Code.gs
die Automatik im Hintergrund trägt.

Aufruf:  python3 zentrale/zentrale-bauen.py          → zentrale/Clickculture Zentrale.xlsx
         python3 zentrale/zentrale-bauen.py --kopf   → Spaltennamen als JSON (für den Test von Code.gs)

Die Spaltennamen in Zeile 1 der Blätter Kunden, Anfragen, Werbekosten und Akquise liest Code.gs.
Wer sie ändert, muss Code.gs mitändern. Die Schlüssel in Spalte A von „Einstellungen“ ebenso.
"""
import json
import pathlib
import sys

from openpyxl import Workbook
from openpyxl.comments import Comment
from openpyxl.formatting.rule import CellIsRule, FormulaRule
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.worksheet.datavalidation import DataValidation

HIER = pathlib.Path(__file__).resolve().parent
ZIEL = HIER / "Clickculture Zentrale.xlsx"
F = "Arial"
DUNKEL = PatternFill("solid", start_color="1A1917")
GELB = PatternFill("solid", start_color="FFF6CC")
GRAU = PatternFill("solid", start_color="EFEAE0")
GRUEN = PatternFill("solid", start_color="E5F4E4")
ROT = PatternFill("solid", start_color="FBEBEB")
ORANGE = PatternFill("solid", start_color="F9EEDA")
HILFE = Font(name=F, size=9, color="6B665D")
DUENN = Side(style="thin", color="D9D4CA")
BOX = Border(left=DUENN, right=DUENN, top=DUENN, bottom=DUENN)
EURO = '#,##0 "€"'
EURO2 = '#,##0.00 "€"'
ZEIT = "DD.MM.YYYY HH:MM"
DATUM = "DD.MM.YYYY"
STAND = ["neu", "nicht erreicht", "erreicht", "Termin", "Angebot", "Auftrag", "kein Interesse"]
STAND_AKQ = ["neu", "nicht erreicht", "Videocall vereinbart", "Vereinbarung geschickt", "Kunde", "kein Interesse"]

# ---------------------------------------------------------------- Spalten (Zeile 1), die Code.gs liest
KUNDEN = [  # (Name, Breite, Format, Eingabe?)
    ("Kürzel", 22, None, True), ("Betrieb", 26, None, True), ("Anrede für Mails", 18, None, True),
    ("E-Mail für Anfragen", 28, None, True), ("Telefon", 16, None, True), ("Drive-Ordner", 30, None, True),
    ("Onboarding €", 12, EURO, True), ("Monatsgebühr €", 13, EURO, True), ("Live seit", 12, DATUM, True),
    ("Aktiv", 8, None, True), ("Teilnahmeschluss", 14, DATUM, True), ("Ziehung am", 12, DATUM, True),
    ("Erster Auftrag", 14, DATUM, False), ("Monatsgebühr ab", 14, "MM.YYYY", False), ("Anfragen gesamt", 10, "0", False),
    ("Notiz", 34, None, True),
]
ANFRAGEN = [
    ("ID", 14, None), ("Eingang", 16, ZEIT), ("Kunde", 18, None), ("Name", 22, None), ("Telefon", 16, None),
    ("E-Mail", 22, None), ("PLZ", 7, None), ("Seite", 16, None), ("Quelle", 9, None), ("Zurückgerufen", 16, ZEIT),
    ("Stand", 14, None), ("Auftragswert €", 13, EURO), ("Auftrag am", 16, ZEIT), ("Minuten bis Rückruf", 10, "0"),
    ("Erinnert", 16, ZEIT), ("Details", 50, None), ("Schlüssel", 6, None),
]
WERBEKOSTEN = [("Monat", 12, "MM.YYYY"), ("Kunde", 22, None), ("Meta €", 12, EURO2), ("Google €", 12, EURO2), ("Summe €", 12, EURO2)]
AKQUISE = [("Firma", 28, None), ("Ansprechpartner", 20, None), ("Ort", 16, None), ("Telefon", 16, None), ("Webseite", 24, None),
           ("Google (Sterne · Anzahl)", 12, None), ("Stand", 20, None), ("Nächster Anruf am", 13, DATUM), ("Wer", 10, None),
           ("Notiz", 40, None)]
RECHNUNGEN = [("Nr.", 10, None), ("Datum", 11, DATUM), ("Kunde (Firma)", 26, None), ("Anschrift Kunde", 32, None),
              ("Posten", 14, None), ("Zeitraum", 16, None), ("Netto €", 11, EURO2), ("USt.", 6, "0%"), ("Brutto €", 11, EURO2),
              ("Fällig am", 11, DATUM), ("Bezahlt am", 11, DATUM), ("Status", 11, None)]

CHECKLISTE = [  # gleiche Schritte wie nischen/photovoltaik/ANLEITUNG.md (4 bis 7)
    ("4 · Abschluss", "Vereinbarung als PDF geschickt, unterschrieben zurück", "Du"),
    ("4 · Abschluss", "Rechnung Onboarding (Blatt Rechnungen) als PDF mit Mail 1 geschickt", "Du"),
    ("4 · Abschluss", "Willkommens-Mail geschickt, Zugänge-Anleitung und Rückruf-Leitfaden als PDF angehängt", "Du"),
    ("5 · Vom Kunden", "Fotos im Drive-Ordner: mind. 3 fertige Anlagen, ideal ein Dach vorher und nachher", "Kunde"),
    ("5 · Vom Kunden", "Meta: Partnerzugriff auf Seite und Werbekonto, Zahlungsmethode im Werbekonto", "Kunde"),
    ("5 · Vom Kunden", "Bei Meta dich seinem Werbekonto und seiner Seite zugewiesen (Hilfe Schritt 6, Punkt 0)", "Du"),
    ("5 · Vom Kunden", "Google Ads: Konto unter deinem Verwaltungskonto, Kunde Administrator, Zahlungsart drin", "Kunde"),
    ("5 · Vom Kunden", "Links zu Impressum und Datenschutz, 2 echte Google-Bewertungen", "Kunde"),
    ("5 · Vom Kunden", "Name der Person, die die Wirtschaftlichkeitsprüfungen rechnet", "Kunde"),
    ("6 · Einrichten", "Meta-Pixel und Google-Conversion angelegt, IDs im Steckbrief (Teil 4)", "Du"),
    ("6 · Einrichten", "Steckbrief und die besten Fotos an Claude, Kundenordner neu erzeugt", "Du"),
    ("6 · Einrichten", "Seiten auf Netlify, Name = Kürzel, Formular-Erkennung an, nochmal hochgeladen", "Du"),
    ("6 · Einrichten", "Netlify: Webhook zur Zentrale und Mail-Kopie an dich eingetragen", "Du"),
    ("6 · Einrichten", "Meta-Kampagne mit den 5 Anzeigen als Entwurf angelegt", "Du"),
    ("6 · Einrichten", "Google-Kampagne angelegt (pausiert)", "Du"),
    ("7 · Live", "Test über „Events testen“: PageView + Lead, Mail mit Knöpfen, Zeile in „Anfragen“", "Du"),
    ("7 · Live", "Am Handy geprüft: Formular, Anrufen-Knopf, Fotos", "Du"),
    ("7 · Live", "Meta: Transparenz (Werbetreibender und Zahlender = Kunde) eingetragen, ggf. verifiziert", "Du"),
    ("7 · Live", "Kampagnen aktiv. Im Blatt „Kunden“ bei „Live seit“ das Datum (Start der 30 Tage)", "Du"),
    ("7 · Live", "Kunde angerufen: Knöpfe in der Mail erklärt, Rückruf in 1 Stunde", "Du"),
]

EINSTELLUNGEN = [  # (Schlüssel, Einstellung, Vorgabe, Hilfe)
    ("§", "Deine Daten (für Rechnungen und Mails)", None, None),
    ("agentur_name", "Name der Agentur", "", "steht als Absender in Mails und auf Rechnungen"),
    ("agentur_inhaber", "Dein Name", "", "Unterschrift unter Monatsreports"),
    ("agentur_anschrift", "Deine Anschrift", "", "Straße, PLZ Ort"),
    ("agentur_email", "Deine E-Mail", "", "Kunden antworten an diese Adresse"),
    ("agentur_telefon", "Dein Telefon", "", ""),
    ("agentur_steuernr", "Steuernummer", "", "Pflicht auf jeder Rechnung"),
    ("agentur_iban", "IBAN", "", ""),
    ("agentur_kleinunternehmer", "Kleinunternehmer (§ 19 UStG)?", "Ja", "Ja = keine Umsatzsteuer auf Rechnungen"),
    ("§", "Automatik", None, None),
    ("benachrichtigung_an", "Hinweise gehen an", "", "deine E-Mail; mehrere mit Komma, z. B. auch dein Kollege"),
    ("geschaeftszeiten", "Geschäftszeiten der Kunden", "8-18", "nur in dieser Zeit zählen die Minuten bis zum Rückruf"),
    ("arbeitstage", "Arbeitstage", "Mo-Fr", "Mo-Fr oder Mo-Sa"),
    ("rueckruf_minuten", "Erinnern nach … Minuten ohne Rückruf", 60, ""),
    ("kopie_jeder_anfrage", "Jede Anfrage auch an mich?", "Nein", "Nein reicht: Netlify schickt dir ohnehin eine Kopie"),
    ("akquise_erinnerung", "Morgens Akquise-Liste mailen?", "Ja", "listet die Betriebe, die heute dran sind"),
    ("§", "Technik (füllt sich bei der Einrichtung)", None, None),
    ("webapp_url", "Web-App-Adresse", "", "Schritt 5: aus „Bereitstellen“ kopieren und hier einfügen (endet auf /exec)"),
    ("schluessel", "Schlüssel", "", "setzt „Einrichten“ von selbst. Nicht weitergeben"),
    ("webhook_url", "Webhook-Adresse für Netlify", "FORMEL", "bei jedem Kunden in Netlify eintragen (Anleitung Schritt 6)"),
]


def kopf(ws, spalten):
    for i, (name, breite, *_rest) in enumerate(spalten, start=1):
        c = ws.cell(row=1, column=i, value=name)
        c.font = Font(name=F, bold=True, color="FFFFFF", size=10)
        c.fill = DUNKEL
        c.alignment = Alignment(vertical="center", wrap_text=True)
        ws.column_dimensions[c.column_letter].width = breite
    ws.row_dimensions[1].height = 32
    ws.freeze_panes = "A2"


def formate(ws, spalten, bis):
    for i, (_n, _b, fmt, *_rest) in enumerate(spalten, start=1):
        if fmt:
            for r in range(2, bis + 1):
                ws.cell(row=r, column=i).number_format = fmt


def liste(ws, rng, werte):
    dv = DataValidation(type="list", formula1='"' + ",".join(werte) + '"', allow_blank=True)
    ws.add_data_validation(dv)
    dv.add(rng)


def text(ws, ref, wert, **font):
    ws[ref] = wert
    ws[ref].font = Font(name=F, **font)
    ws[ref].alignment = Alignment(wrap_text=True, vertical="top")


def bauen():
    wb = Workbook()

    # ------------------------------------------------ Start
    st = wb.active
    st.title = "Start"
    st.column_dimensions["A"].width = 4
    st.column_dimensions["B"].width = 46
    st.column_dimensions["C"].width = 16
    st.column_dimensions["D"].width = 60
    text(st, "B1", "Clickculture Zentrale", bold=True, size=18)
    text(st, "B2", "Hier laufen alle Kunden zusammen. Anfragen kommen von selbst, Mails gehen von selbst raus.", size=10, color="6B665D")
    text(st, "B4", "Auf einen Blick", bold=True, size=12)
    blick = [
        ("Anfragen, die auf Rückruf warten", '=COUNTIF(Anfragen!K:K,"neu")', "0"),
        ("Anfragen diesen Monat", '=COUNTIFS(Anfragen!B:B,">="&DATE(YEAR(TODAY()),MONTH(TODAY()),1))', "0"),
        ("Aktive Kunden", '=COUNTIFS(Kunden!A2:A200,"?*",Kunden!J2:J200,"<>Nein")', "0"),
        ("Offene Rechnungen", '=SUMIFS(Rechnungen!I:I,Rechnungen!L:L,"<>bezahlt",Rechnungen!I:I,">0")', EURO2),
        ("Heute anrufen (Akquise)", '=COUNTIFS(Akquise!H:H,"<="&TODAY(),Akquise!G:G,"<>Kunde",Akquise!G:G,"<>kein Interesse")', "0"),
    ]
    for i, (k, f, fmt) in enumerate(blick, start=5):
        text(st, f"B{i}", k, size=10)
        st[f"C{i}"] = f
        st[f"C{i}"].number_format = fmt
        st[f"C{i}"].font = Font(name=F, size=11, bold=True)
    text(st, "B11", "Was von selbst passiert", bold=True, size=12)
    auto = [
        "Neue Anfrage → Zeile im Blatt „Anfragen“ + sofort Mail an den Kunden mit Knopf „Zurückgerufen“",
        "Kein Rückruf nach 60 Minuten (Geschäftszeit) → Erinnerung an den Kunden und Hinweis an dich",
        "Montag 8 Uhr → jeder Kunde bekommt seine offenen Anfragen mit Knöpfen: Termin · Angebot · Auftrag",
        "Erster Auftrag eines Kunden → Mail an dich: ab nächstem Monat Monatsgebühr berechnen",
        "1. des Monats → Mail an dich: Werbekosten eintragen, welche Rechnungen fällig sind",
        "3. des Monats → fertige Monatsreports als Entwurf in deinem Gmail",
        "Täglich 7 Uhr → Verlosung: am Tag der Ziehung die Gewinner · Akquise: wen du heute anrufst",
        "Neuer Kunde im Blatt „Kunden“ → eigene Spalte im Blatt „Checkliste“",
    ]
    for i, t in enumerate(auto, start=12):
        text(st, f"B{i}", "• " + t, size=10)
        st.merge_cells(f"B{i}:D{i}")
    text(st, "B21", "Einrichten (einmal, ca. 20 Minuten)", bold=True, size=12)
    schritte = [
        "1. Diese Datei in Google Drive hochladen, öffnen, „Datei → Als Google Tabellen speichern“. Ab dann nur noch die Google-Version benutzen.",
        "2. Blatt „Einstellungen“: die gelben Felder ausfüllen.",
        "3. Menü „Erweiterungen → Apps Script“. Alles im Editor löschen. Den Inhalt von „Zentrale-Code.txt“ einfügen. Speichern (Diskette).",
        "4. In Apps Script links das Zahnrad (Projekteinstellungen): Zeitzone „(GMT+01:00) Berlin“ wählen.",
        "5. Oben rechts „Bereitstellen → Neue Bereitstellung“ → Zahnrad → „Web-App“. Ausführen als: Ich. Zugriff: Jeder. "
        "→ Bereitstellen → Zugriff erlauben (Google warnt: „Erweitert → Weiter zu …“ → Zulassen). Die Web-App-URL kopieren "
        "und im Blatt „Einstellungen“ bei „Web-App-Adresse“ einfügen.",
        "6. Zurück zu diesem Browser-Tab (die Tabelle, nicht Apps Script) und neu laden (Mac Cmd+R, Windows F5). Oben rechts neben „Hilfe“ erscheint das Menü „Clickculture“ → „1 · Einrichten“ → zulassen → nochmal „1 · Einrichten“.",
        "7. Testen: Im Blatt „Kunden“ dich selbst als Kunde eintragen (Kürzel test, deine E-Mail, Aktiv Ja). Menü → „2 · Test-Anfrage“. "
        "In der Mail auf „Zurückgerufen“ tippen. Danach die Test-Zeilen und die Checkliste-Spalte „test“ löschen.",
    ]
    for i, t in enumerate(schritte, start=22):
        text(st, f"B{i}", t, size=10)
        st.merge_cells(f"B{i}:D{i}")
        st.row_dimensions[i].height = 42 if len(t) > 120 else 28
    text(st, "B30", "Ausführlich: „1 Zentrale einrichten – Anleitung“ im Ordner „01 Vorbereiten (einmal)“.", size=9, color="6B665D")

    # ------------------------------------------------ Einstellungen
    es = wb.create_sheet("Einstellungen")
    for i, (h, b) in enumerate((("Schlüssel", 16), ("Einstellung", 40), ("Eintrag", 44), ("Hilfe", 60)), start=1):
        c = es.cell(row=1, column=i, value=h)
        c.font = Font(name=F, bold=True, color="FFFFFF", size=10)
        c.fill = DUNKEL
        es.column_dimensions[c.column_letter].width = b
    zeile_von = {}
    r = 2
    for key, label, vorgabe, hilfe in EINSTELLUNGEN:
        if key == "§":
            es.cell(row=r, column=2, value=label).font = Font(name=F, bold=True, size=11)
            for col in range(1, 5):
                es.cell(row=r, column=col).fill = GRAU
            r += 1
            continue
        zeile_von[key] = r
        es.cell(row=r, column=1, value=key).font = Font(name=F, size=8, color="9A968C")
        es.cell(row=r, column=2, value=label).font = Font(name=F, size=10, bold=True)
        c = es.cell(row=r, column=3, value=vorgabe if vorgabe != "FORMEL" else None)
        c.font = Font(name=F, size=10, color="0000FF")
        c.border = BOX
        if key not in ("schluessel", "webhook_url"):
            c.fill = GELB
        es.cell(row=r, column=4, value=hilfe).font = HILFE
        r += 1
    w, k = zeile_von["webapp_url"], zeile_von["schluessel"]
    es.cell(row=zeile_von["webhook_url"], column=3,
            value=f'=IF(OR(C{w}="",C{k}=""),"erscheint nach Schritt 6 der Einrichtung",C{w}&"?key="&C{k})').font = Font(name=F, size=10, bold=True)
    liste(es, f"C{zeile_von['agentur_kleinunternehmer']}", ["Ja", "Nein"])
    liste(es, f"C{zeile_von['kopie_jeder_anfrage']}", ["Ja", "Nein"])
    liste(es, f"C{zeile_von['akquise_erinnerung']}", ["Ja", "Nein"])
    liste(es, f"C{zeile_von['arbeitstage']}", ["Mo-Fr", "Mo-Sa"])
    es.column_dimensions["A"].hidden = True
    es.freeze_panes = "C2"
    E = lambda key: f"Einstellungen!$C${zeile_von[key]}"

    # ------------------------------------------------ Akquise
    ak = wb.create_sheet("Akquise")
    kopf(ak, AKQUISE)
    formate(ak, AKQUISE, 1000)
    for col, v in enumerate(["BEISPIEL Sonnendach GmbH (Zeile überschreiben)", "Herr Beispiel", "Musterstadt", "0123 456789",
                             "www.beispiel.de", "4,8 · 37", "neu", None, "", "Inhaber morgens erreichbar"], start=1):
        c = ak.cell(row=2, column=col, value=v)
        c.font = Font(name=F, size=10, italic=True, color="7A756B")
    liste(ak, "G2:G1000", STAND_AKQ)
    ak.conditional_formatting.add("G2:G1000", CellIsRule(operator="equal", formula=['"Kunde"'], fill=GRUEN))
    ak.conditional_formatting.add("A2:J1000", FormulaRule(
        formula=['AND(ISNUMBER($H2),$H2<=TODAY(),$G2<>"Kunde",$G2<>"kein Interesse")'], fill=ORANGE))
    ak["H1"].comment = Comment("Datum eintragen, dann kommt es morgens in der Mail „Heute anrufen“. Orange = heute dran.", "Zentrale")
    ak["I1"].comment = Comment("Wer ruft an? Z. B. dein Name oder der deines Kollegen.", "Zentrale")
    ak.auto_filter.ref = "A1:J1000"

    # ------------------------------------------------ Kunden
    ku = wb.create_sheet("Kunden")
    kopf(ku, KUNDEN)
    formate(ku, KUNDEN, 200)
    for r in range(2, 201):
        for i, (_n, _b, _f, eingabe) in enumerate(KUNDEN, start=1):
            if not eingabe:
                ku.cell(row=r, column=i).fill = GRAU
        ku[f"M{r}"] = (f'=IF($A{r}="","",IF(COUNTIFS(Anfragen!$C:$C,$A{r},Anfragen!$K:$K,"Auftrag")=0,"noch keiner",'
                       f'_xlfn.MINIFS(Anfragen!$M:$M,Anfragen!$C:$C,$A{r},Anfragen!$K:$K,"Auftrag")))')
        ku[f"N{r}"] = f'=IF(OR($A{r}="",$M{r}="",$M{r}="noch keiner"),"",DATE(YEAR($M{r}),MONTH($M{r})+1,1))'
        ku[f"O{r}"] = f'=IF($A{r}="","",COUNTIF(Anfragen!$C:$C,$A{r}))'
    liste(ku, "J2:J200", ["Ja", "Nein"])
    ku["A1"].comment = Comment("Neuer Kunde: die Datei „Zeile für die Zentrale“ aus seinem Kundenordner öffnen, alles kopieren, "
                               "hier in die erste freie Zeile in Spalte A einfügen.", "Zentrale")
    ku["I1"].comment = Comment("Datum, an dem die Kampagnen live gingen. Ab dann gibt es Monatsreports.", "Zentrale")
    ku["J1"].comment = Comment("Nein = keine Mails, keine Reports mehr (Kunde hat aufgehört).", "Zentrale")

    # ------------------------------------------------ Checkliste (eine Spalte pro Kunde, legt Code.gs an)
    ck = wb.create_sheet("Checkliste")
    for i, (h, b) in enumerate((("Schritt", 15), ("Aufgabe", 70), ("Wer", 8)), start=1):
        c = ck.cell(row=1, column=i, value=h)
        c.font = Font(name=F, bold=True, color="FFFFFF", size=10)
        c.fill = DUNKEL
        ck.column_dimensions[c.column_letter].width = b
    for col in range(4, 53):
        c = ck.cell(row=1, column=col)
        c.fill = DUNKEL
        c.font = Font(name=F, bold=True, color="FFFFFF", size=10)
        ck.column_dimensions[c.column_letter].width = 16
    ck["B2"] = "Fortschritt"
    ck["B2"].font = Font(name=F, bold=True, size=10)
    ende = 2 + len(CHECKLISTE)
    for i, (schritt, aufgabe, wer) in enumerate(CHECKLISTE, start=3):
        for col, v in enumerate((schritt, aufgabe, wer), start=1):
            c = ck.cell(row=i, column=col, value=v)
            c.font = Font(name=F, size=10)
            c.alignment = Alignment(wrap_text=True, vertical="top")
    liste(ck, f"D3:AZ{ende}", ["Ja"])
    ck.conditional_formatting.add(f"D3:AZ{ende}", CellIsRule(operator="equal", formula=['"Ja"'], fill=GRUEN))
    ck.freeze_panes = "D3"
    ck["A1"].comment = Comment("Jeder Kunde im Blatt „Kunden“ bekommt hier von selbst eine Spalte. Erledigt = „Ja“ wählen.", "Zentrale")

    # ------------------------------------------------ Anfragen
    an = wb.create_sheet("Anfragen")
    kopf(an, ANFRAGEN)
    formate(an, ANFRAGEN, 2000)
    liste(an, "K2:K5000", STAND)
    an.conditional_formatting.add("K2:K5000", CellIsRule(operator="equal", formula=['"neu"'], fill=ORANGE))
    an.conditional_formatting.add("K2:K5000", CellIsRule(operator="equal", formula=['"Auftrag"'], fill=GRUEN))
    an.conditional_formatting.add("N2:N5000", CellIsRule(operator="greaterThan", formula=["60"], fill=ROT))
    an["A1"].comment = Comment("Dieses Blatt füllt sich von selbst. Den Stand pflegen die Kunden über die Knöpfe in den Mails; "
                               "du kannst ihn auch hier ändern.", "Zentrale")
    an.column_dimensions["Q"].hidden = True
    an.auto_filter.ref = "A1:P5000"

    # ------------------------------------------------ Werbekosten
    wk = wb.create_sheet("Werbekosten")
    kopf(wk, WERBEKOSTEN)
    formate(wk, WERBEKOSTEN, 400)
    for r in range(2, 401):
        wk[f"E{r}"] = f'=IF(A{r}="","",N(C{r})+N(D{r}))'
    wk["A1"].comment = Comment("Einmal im Monat (die Zentrale erinnert dich am 1.): Monat = 1. des Monats, Kunde = Kürzel, "
                               "Beträge aus dem Werbeanzeigenmanager und Google Ads.", "Zentrale")

    # ------------------------------------------------ Monatsreport (zum Ansehen)
    mr = wb.create_sheet("Monatsreport")
    mr.column_dimensions["A"].width = 34
    mr.column_dimensions["B"].width = 18
    mr.column_dimensions["C"].width = 50
    text(mr, "A1", "Monatsreport zum Ansehen", bold=True, size=14)
    text(mr, "A2", "Kunde und Monat wählen. Die Mail an den Kunden legt die Zentrale am 3. von selbst als Entwurf in Gmail an.", size=9, color="6B665D")
    for ref, label in (("3", "Kunde (Kürzel)"), ("4", "Monat (1. des Monats)")):
        text(mr, f"A{ref}", label, bold=True, size=10)
        mr[f"B{ref}"].fill = GELB
        mr[f"B{ref}"].border = BOX
        mr[f"B{ref}"].font = Font(name=F, color="0000FF", bold=True)
    mr["B4"].number_format = "MM.YYYY"
    dv = DataValidation(type="list", formula1="Kunden!$A$2:$A$200", allow_blank=True)
    mr.add_data_validation(dv)
    dv.add("B3")
    zeit = 'Anfragen!$C:$C,$B$3,Anfragen!$B:$B,">="&$B$4,Anfragen!$B:$B,"<"&EDATE($B$4,1)'
    st_ = lambda s: f'COUNTIFS({zeit},Anfragen!$K:$K,"{s}")'
    kz = [
        ("Werbekosten", '=SUMPRODUCT((Werbekosten!$B$2:$B$400=$B$3)*(MONTH(Werbekosten!$A$2:$A$400)=MONTH($B$4))*'
                        '(YEAR(Werbekosten!$A$2:$A$400)=YEAR($B$4))*(Werbekosten!$C$2:$C$400+Werbekosten!$D$2:$D$400))', EURO),
        ("Anfragen", f"=COUNTIFS({zeit})", "0"),
        ("Kosten pro Anfrage", "=IFERROR(B6/B7,0)", EURO),
        ("Ø Minuten bis Rückruf", f"=IFERROR(AVERAGEIFS(Anfragen!$N:$N,{zeit}),0)", "0"),
        ("Termine", f"={st_('Termin')}+{st_('Angebot')}+{st_('Auftrag')}", "0"),
        ("Angebote", f"={st_('Angebot')}+{st_('Auftrag')}", "0"),
        ("Aufträge", f"={st_('Auftrag')}", "0"),
        ("Auftragswert laut Kunde", f'=SUMIFS(Anfragen!$L:$L,{zeit},Anfragen!$K:$K,"Auftrag")', EURO),
        ("Kosten pro Auftrag", "=IFERROR(B6/B12,0)", EURO),
        ("Erster Auftrag überhaupt", "=IFERROR(VLOOKUP($B$3,Kunden!$A:$M,13,FALSE),\"\")", DATUM),
    ]
    for i, (h, b) in enumerate((("Zahl", 0), ("Wert", 0), ("", 0)), start=1):
        c = mr.cell(row=5, column=i, value=h)
        c.font = Font(name=F, bold=True, color="FFFFFF", size=10)
        c.fill = DUNKEL
    for i, (k, f, fmt) in enumerate(kz, start=6):
        mr.cell(row=i, column=1, value=k).font = Font(name=F, size=10, bold=k in ("Anfragen", "Aufträge", "Kosten pro Anfrage"))
        c = mr.cell(row=i, column=2, value=f)
        c.number_format = fmt
        c.font = Font(name=F, size=10, color="008000")

    # ------------------------------------------------ Rechnungen
    rg = wb.create_sheet("Rechnungen")
    kopf(rg, RECHNUNGEN)
    formate(rg, RECHNUNGEN, 500)
    for r in range(2, 501):
        rg[f"A{r}"] = f'=IF(B{r}="","",YEAR(B{r})&"-"&TEXT(ROW()-1,"000"))'
        rg[f"H{r}"] = f'=IF(G{r}="","",IF({E("agentur_kleinunternehmer")}="Ja",0,0.19))'
        rg[f"I{r}"] = f'=IF(G{r}="","",ROUND(G{r}*(1+H{r}),2))'
        rg[f"J{r}"] = f'=IF(B{r}="","",B{r}+14)'
        rg[f"L{r}"] = f'=IF(B{r}="","",IF(ISNUMBER(K{r}),"bezahlt",IF(TODAY()>J{r},"überfällig","offen")))'
        for col in "AHIJL":
            rg[f"{col}{r}"].fill = GRAU
    liste(rg, "E2:E500", ["Onboarding", "Monatsgebühr", "Sonstiges"])
    rg.conditional_formatting.add("L2:L500", CellIsRule(operator="equal", formula=['"überfällig"'], fill=ROT))
    rg.conditional_formatting.add("L2:L500", CellIsRule(operator="equal", formula=['"bezahlt"'], fill=GRUEN))
    rg["B1"].comment = Comment("Datum eintragen, Nummer, Umsatzsteuer, Brutto und Fälligkeit rechnen sich. "
                               "PDF: Blatt „Rechnung drucken“.", "Zentrale")
    rg["K1"].comment = Comment("Wenn das Geld da ist: Datum eintragen. Dann steht „bezahlt“.", "Zentrale")

    # ------------------------------------------------ Rechnung drucken
    dr = wb.create_sheet("Rechnung drucken")
    for col, b in zip("ABCDE", (3, 36, 24, 16, 16)):
        dr.column_dimensions[col].width = b
    text(dr, "B1", "Welche Rechnung? Nummer eintragen →", bold=True, size=9, color="B4461F")
    dr["C1"].fill = GELB
    dr["C1"].border = BOX
    dr["C1"].font = Font(name=F, color="0000FF", bold=True)
    text(dr, "D1", "dann B3:E31 markieren → Datei → Herunterladen → PDF → „Ausgewählte Zellen“", size=9, color="6B665D")
    zeile = "MATCH($C$1,Rechnungen!$A$2:$A$500,0)"
    hol = lambda col: f'=IFERROR(INDEX(Rechnungen!${col}$2:${col}$500,{zeile}),"")'
    zellen = [
        ("B3", f"={E('agentur_name')}", dict(bold=True, size=13)),
        ("B4", f'={E("agentur_inhaber")}&" · "&{E("agentur_anschrift")}', dict(size=9, color="6B665D")),
        ("B5", f'={E("agentur_email")}&" · "&{E("agentur_telefon")}', dict(size=9, color="6B665D")),
        ("B8", hol("C"), dict(size=11, bold=True)), ("B9", hol("D"), dict(size=11)),
        ("B12", "Rechnung", dict(bold=True, size=18)),
        ("B14", "Rechnungsnummer", dict(size=10)), ("C14", "=$C$1", dict(size=10, bold=True)),
        ("B15", "Rechnungsdatum", dict(size=10)), ("C15", hol("B"), dict(size=10)),
        ("B16", "Steuernummer", dict(size=10)), ("C16", f"={E('agentur_steuernr')}", dict(size=10)),
        ("B19", "Leistung", dict(size=10, bold=True)), ("C19", "Zeitraum", dict(size=10, bold=True)), ("E19", "Betrag", dict(size=10, bold=True)),
        ("B20", hol("E"), dict(size=10)), ("C20", hol("F"), dict(size=10)), ("E20", hol("G"), dict(size=10)),
        ("B22", "Netto", dict(size=10)), ("E22", "=E20", dict(size=10)),
        ("B23", f'="Umsatzsteuer "&IFERROR(TEXT(INDEX(Rechnungen!$H$2:$H$500,{zeile}),"0%"),"")', dict(size=10)),
        ("E23", f'=IFERROR(INDEX(Rechnungen!$I$2:$I$500,{zeile})-INDEX(Rechnungen!$G$2:$G$500,{zeile}),"")', dict(size=10)),
        ("B24", "Gesamt", dict(size=11, bold=True)), ("E24", hol("I"), dict(size=11, bold=True)),
        ("B27", f'=IF({E("agentur_kleinunternehmer")}="Ja","Gemäß § 19 UStG wird keine Umsatzsteuer berechnet.","")', dict(size=9)),
        ("B28", f'="Zahlbar bis "&IFERROR(DAY(INDEX(Rechnungen!$J$2:$J$500,{zeile}))&"."&MONTH(INDEX(Rechnungen!$J$2:$J$500,{zeile}))'
                f'&"."&YEAR(INDEX(Rechnungen!$J$2:$J$500,{zeile})),"")&" ohne Abzug auf IBAN "&{E("agentur_iban")}', dict(size=9)),
        ("B30", "Vielen Dank für die Zusammenarbeit.", dict(size=9)),
    ]
    for ref, v, font in zellen:
        dr[ref] = v
        dr[ref].font = Font(name=F, **font)
    dr["C15"].number_format = DATUM
    for ref in ("E20", "E22", "E23", "E24"):
        dr[ref].number_format = EURO2
        dr[ref].alignment = Alignment(horizontal="right")
    for col in "BCDE":
        dr[f"{col}19"].border = Border(bottom=DUENN)
        dr[f"{col}24"].border = Border(top=DUENN)
    dr.print_area = "A3:E31"

    wb.save(ZIEL)
    print("✓", ZIEL.name)


if __name__ == "__main__":
    if "--kopf" in sys.argv:
        print(json.dumps({"Checkliste": len(CHECKLISTE), "Kunden": [s[0] for s in KUNDEN], "Anfragen": [s[0] for s in ANFRAGEN],
                          "Werbekosten": [s[0] for s in WERBEKOSTEN], "Akquise": [s[0] for s in AKQUISE],
                          "Einstellungen": [e[0] for e in EINSTELLUNGEN if e[0] != "§"]}, ensure_ascii=False))
    else:
        bauen()
