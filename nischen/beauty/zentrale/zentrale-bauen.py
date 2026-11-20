#!/usr/bin/env python3
"""Baut „Clickculture Beauty-Zentrale.xlsx“: die Tabelle, die in Google Drive hochgeladen wird und mit Code.gs
die Online-Buchung und die Automatik im Hintergrund trägt.

Aufruf:  python3 nischen/beauty/zentrale/zentrale-bauen.py          → nischen/beauty/zentrale/Clickculture Beauty-Zentrale.xlsx
         python3 nischen/beauty/zentrale/zentrale-bauen.py --kopf   → Spaltennamen als JSON (für den Test von Code.gs)

Die Spaltennamen in Zeile 1 der Blätter Kunden, Termine, Sperrliste, Werbekosten und Akquise liest Code.gs.
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
ZIEL = HIER / "Clickculture Beauty-Zentrale.xlsx"
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
STAND = ["unbestätigt", "angefragt", "neu", "nicht erreicht", "erreicht", "Termin", "erschienen", "Auftrag",
         "nicht erschienen", "abgesagt", "kein Interesse", "Fake", "verfallen"]
STAND_AKQ = ["neu", "nicht erreicht", "Termin vereinbart", "Vereinbarung geschickt", "Kunde", "kein Interesse"]

# ---------------------------------------------------------------- Spalten (Zeile 1), die Code.gs liest
KUNDEN = [  # (Name, Breite, Format, Eingabe?) · die ersten Spalten bis „Betreuer“ kommen aus „Zeile für die Zentrale“
    ("Kürzel", 22, None, True), ("Betrieb", 26, None, True), ("Anrede für Mails", 18, None, True),
    ("E-Mail für Termine", 28, None, True), ("Telefon", 16, "@", True), ("Adresse", 30, None, True),
    ("Seiten-Adresse", 30, None, True), ("Drive-Ordner", 24, None, True),
    ("Onboarding €", 12, EURO, True), ("Monatsgebühr €", 13, EURO, True), ("Live seit", 12, DATUM, True), ("Aktiv", 8, None, True),
    ("Behandlung", 18, None, True), ("Buchung", 13, None, True), ("Kalender-ID", 28, None, True),
    ("Buchbare Zeiten", 26, None, True), ("Beratung Minuten", 10, "0", True), ("Leistungen", 40, None, True),
    ("Puffer Minuten", 9, "0", True), ("Vorlauf Stunden", 9, "0", True), ("Tage im Voraus", 9, "0", True),
    ("Absagefrist Stunden", 10, "0", True), ("Ausfallregel", 30, None, True), ("Vorbereitung", 40, None, True),
    ("Teilnahmeschluss", 14, DATUM, True), ("Ziehung am", 12, DATUM, True), ("Betreuer", 14, None, True),
    ("Erster Auftrag", 14, DATUM, False), ("Monatsgebühr ab", 14, "MM.YYYY", False), ("Termine gesamt", 10, "0", False),
    ("Notiz", 34, None, True),
]
TERMINE = [
    ("ID", 14, None), ("Eingang", 16, ZEIT), ("Kunde", 18, None), ("Art", 11, None), ("Leistung", 18, None),
    ("Termin", 16, ZEIT), ("Dauer", 7, "0"), ("Name", 22, None), ("Telefon", 16, "@"), ("E-Mail", 24, None),
    ("Quelle", 9, None), ("Stand", 14, None), ("Bestätigt am", 16, ZEIT), ("Erinnert", 16, ZEIT), ("Abgesagt am", 16, ZEIT),
    ("Zurückgerufen", 16, ZEIT), ("Minuten bis Rückruf", 10, "0"), ("Auftragswert €", 13, EURO), ("Auftrag am", 16, ZEIT),
    ("Details", 40, None), ("Kalender-Eintrag", 10, "@"), ("Schlüssel", 6, None), ("Kunden-Schlüssel", 6, None),
]
SPERRLISTE = [("Telefon oder E-Mail", 30, "@"), ("Kunde", 20, None), ("Grund", 40, None), ("Am", 16, ZEIT)]
WERBEKOSTEN = [("Monat", 12, "MM.YYYY"), ("Kunde", 22, None), ("Meta €", 12, EURO2), ("Google €", 12, EURO2), ("Summe €", 12, EURO2)]
AKQUISE = [("Studio", 28, None), ("Ansprechpartner", 20, None), ("Ort", 16, None), ("Telefon", 16, "@"),
           ("Webseite oder Instagram", 24, None), ("Behandlung", 16, None), ("Google (Sterne · Anzahl)", 12, None),
           ("Stand", 18, None), ("Nächster Kontakt am", 13, DATUM), ("Wer", 10, None), ("Notiz", 40, None)]
RECHNUNGEN = [("Nr.", 10, None), ("Datum", 11, DATUM), ("Kunde (Firma)", 26, None), ("Anschrift Kunde", 32, None),
              ("Posten", 14, None), ("Zeitraum", 16, None), ("Netto €", 11, EURO2), ("USt.", 6, "0%"), ("Brutto €", 11, EURO2),
              ("Fällig am", 11, DATUM), ("Bezahlt am", 11, DATUM), ("Status", 11, None)]

CHECKLISTE = [  # gleiche Schritte wie nischen/beauty/ANLEITUNG.md (4 bis 7)
    ("4 · Abschluss", "Vereinbarung als PDF geschickt, unterschrieben zurück", "Betreuer"),
    ("4 · Abschluss", "Rechnung Onboarding (Blatt Rechnungen) als PDF mit Mail 1 geschickt", "Betreuer"),
    ("4 · Abschluss", "Google-Ads-Konto für das Studio unter eurem Verwaltungskonto angelegt, als Administrator eingeladen", "Technik"),
    ("4 · Abschluss", "Willkommens-Mail geschickt: Zugänge-Anleitung, Kalender-Anleitung und Termin-Leitfaden als PDF angehängt", "Betreuer"),
    ("4 · Abschluss", "Zeile für die Zentrale im Blatt „Kunden“ eingefügt", "Technik"),
    ("5 · Vom Studio", "Fotos im Drive-Ordner: Studio, Behandlung, Behandler/in (Ergebnisfotos nur wo erlaubt)", "Studio"),
    ("5 · Vom Studio", "Kalender für euer Zentrale-Konto freigegeben („Änderungen an Terminen vornehmen“) oder Modus Wunschtermin vereinbart", "Studio"),
    ("5 · Vom Studio", "Meta: Partnerzugriff auf Seite und Werbekonto, Zahlungsmethode im Werbekonto", "Studio"),
    ("5 · Vom Studio", "Bei Meta euch seinem Werbekonto und seiner Seite zugewiesen", "Technik"),
    ("5 · Vom Studio", "Google Ads: Einladung angenommen, Zahlungsart hinterlegt", "Studio"),
    ("5 · Vom Studio", "Links zu Impressum und Datenschutz, 2 echte Google-Bewertungen", "Studio"),
    ("5 · Vom Studio", "Vorbereitungs-Hinweise und Absageregel vom Studio gelesen und freigegeben", "Studio"),
    ("5 · Vom Studio", "Nachweis Qualifikation: Laser = NiSV-Fachkunde, Faltenbehandlung = Arzt/Heilpraktiker, Bleaching = Zahnarzt", "Studio"),
    ("6 · Einrichten", "Meta-Pixel und Google-Conversion angelegt, IDs im Steckbrief (Teil 5)", "Technik"),
    ("6 · Einrichten", "Steckbrief und die besten Fotos an Claude, Kundenordner neu erzeugt", "Technik"),
    ("6 · Einrichten", "Seiten auf Netlify, Name = Kürzel, Formular-Erkennung an, nochmal hochgeladen", "Technik"),
    ("6 · Einrichten", "Netlify: Webhook zur Zentrale und Mail-Kopie an euch eingetragen (für Rückruf-Wünsche)", "Technik"),
    ("6 · Einrichten", "Zentrale: Menü „2 · Kalender der Kunden prüfen“ zeigt ✓ und freie Zeiten", "Technik"),
    ("6 · Einrichten", "Meta-Kampagne mit den Anzeigen als Entwurf angelegt", "Technik"),
    ("6 · Einrichten", "Google-Kampagne angelegt (pausiert)", "Technik"),
    ("7 · Live", "„0 Übersicht“: nichts mehr offen, Impressum- und Datenschutz-Link sind drin (Pflicht)", "Technik"),
    ("7 · Live", "Test-Buchung über die Seite mit eurer E-Mail: bestätigt, im Kalender, Mails da, wieder abgesagt", "Technik"),
    ("7 · Live", "„Events testen“: PageView auf der Seite, Lead auf der Bestätigungsseite", "Technik"),
    ("7 · Live", "Am Handy geprüft: Termin wählen, Formular, Anrufen-Knopf, Fotos", "Betreuer"),
    ("7 · Live", "Meta: Transparenz (Werbetreibender und Zahlender = Kunde) eingetragen, ggf. verifiziert", "Technik"),
    ("7 · Live", "Kampagnen aktiv. Im Blatt „Kunden“ bei „Live seit“ das Datum (Start der 30 Tage)", "Technik"),
    ("7 · Live", "Studio angerufen: Mails „Neuer Termin“, „Fake melden“ und Abend-Mail erklärt", "Betreuer"),
]

EINSTELLUNGEN = [  # (Schlüssel, Einstellung, Vorgabe, Hilfe)
    ("§", "Eure Daten (für Rechnungen und Mails)", None, None),
    ("agentur_name", "Name der Agentur", "", "steht als Absender in Mails an dich und auf Rechnungen"),
    ("agentur_inhaber", "Eure Namen", "", "z. B. „Max Muster und Tom Beispiel“: stehen auf Rechnungen. Unter Reports steht der Betreuer des Studios"),
    ("agentur_anschrift", "Deine Anschrift", "", "Straße, PLZ Ort"),
    ("agentur_email", "E-Mail der Agentur", "", "gemeinsame Adresse (oder deine). Studios antworten hierhin, wenn kein Betreuer eingetragen ist"),
    ("agentur_telefon", "Telefon der Agentur", "", "steht auf Rechnungen"),
    ("agentur_steuernr", "Steuernummer", "", "Pflicht auf jeder Rechnung"),
    ("agentur_iban", "IBAN", "", ""),
    ("agentur_kleinunternehmer", "Kleinunternehmer (§ 19 UStG)?", "", "Ja = keine Umsatzsteuer. Muss genauso sein wie im Steckbrief, Blatt „Eure Daten“"),
    ("§", "Online-Buchung", None, None),
    ("bestaetigung_minuten", "Termin freihalten bis zur Bestätigung (Minuten)", 45, "So lange ist ein Platz reserviert. Nicht bestätigt → wieder frei"),
    ("erinnerung_stunden", "Erinnerung an die Kundin … Stunden vorher", 24, ""),
    ("raster_minuten", "Termine beginnen alle … Minuten", 30, "30 = 9:00, 9:30, 10:00 …"),
    ("max_unbestaetigt", "Höchstens … unbestätigte Buchungen in 30 Minuten pro Studio", 6, "Schutz gegen Bots und Termin-Blockierer. Darüber: kurz gesperrt, Mail an dich"),
    ("mail_warnung_ab", "Warnen, wenn morgens weniger als … Mails übrig sind", 25, "Google-Grenze: ca. 100 Mails am Tag (kostenlos), 1.500 (Workspace)"),
    ("§", "Rückruf-Wünsche (Formular auf der Seite)", None, None),
    ("benachrichtigung_an", "Hinweise gehen an", "", "eure beiden E-Mails, mit Komma getrennt: Fehler, Warnungen, ⏰, erster Auftrag, Wochen-Übersicht"),
    ("team", "Wer ist im Team?", "", "Name = E-Mail; Name = E-Mail, z. B. „Max = max@mail.de; Tom = tom@mail.de“. Die Namen in „Betreuer“ (Kunden) und „Wer“ (Akquise) müssen dazu passen; Vorname reicht"),
    ("geschaeftszeiten", "Geschäftszeiten der Studios", "9-18", "nur in dieser Zeit zählen die Minuten bis zum Rückruf"),
    ("arbeitstage", "Arbeitstage", "Mo-Sa", "Mo-Fr oder Mo-Sa"),
    ("rueckruf_minuten", "Erinnern nach … Minuten ohne Rückruf", 60, ""),
    ("kopie_jeder_anfrage", "Jeden Rückruf-Wunsch auch an mich?", "Nein", "Nein reicht: Netlify schickt dir ohnehin eine Kopie"),
    ("akquise_erinnerung", "Morgens Akquise-Liste mailen?", "Ja", "listet die Studios, die heute dran sind"),
    ("§", "Technik (füllt sich bei der Einrichtung)", None, None),
    ("webapp_url", "Web-App-Adresse", "", "Schritt 5: aus „Bereitstellen“ kopieren (endet auf /exec). Auch in die Steckbrief-Vorlage, Blatt „Eure Daten“"),
    ("schluessel", "Schlüssel", "", "setzt „Einrichten“ von selbst. Nicht weitergeben"),
    ("webhook_url", "Webhook-Adresse für Netlify", "FORMEL", "bei jedem Kunden in Netlify eintragen (für Rückruf-Wünsche)"),
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


def sp(spalten, name):
    """Spaltenbuchstabe einer Überschrift, z. B. sp(TERMINE, "Stand") → "L"."""
    from openpyxl.utils import get_column_letter
    return get_column_letter([s[0] for s in spalten].index(name) + 1)


def bauen():
    wb = Workbook()
    T = lambda n: sp(TERMINE, n)
    K = lambda n: sp(KUNDEN, n)
    A = lambda n: sp(AKQUISE, n)

    # ------------------------------------------------ Start
    st = wb.active
    st.title = "Start"
    st.column_dimensions["A"].width = 4
    st.column_dimensions["B"].width = 46
    st.column_dimensions["C"].width = 16
    st.column_dimensions["D"].width = 60
    text(st, "B1", "Clickculture Beauty-Zentrale", bold=True, size=18)
    text(st, "B2", "Online-Buchung für alle Studios. Termine kommen von selbst, Mails gehen von selbst raus.", size=10, color="6B665D")
    text(st, "B4", "Auf einen Blick", bold=True, size=12)
    stand, ein, start = f"Termine!{T('Stand')}:{T('Stand')}", f"Termine!{T('Eingang')}:{T('Eingang')}", f"Termine!{T('Termin')}:{T('Termin')}"
    blick = [
        ("Bestätigte Termine ab heute", f'=COUNTIFS({stand},"Termin",{start},">="&TODAY())', "0"),
        ("Termine diesen Monat gebucht", f'=COUNTIFS({ein},">="&DATE(YEAR(TODAY()),MONTH(TODAY()),1),Termine!{T("Bestätigt am")}:{T("Bestätigt am")},"<>")', "0"),
        ("Rückruf-Wünsche, die warten", f'=COUNTIF({stand},"neu")', "0"),
        ("Aktive Kunden", f'=COUNTIFS(Kunden!A2:A200,"?*",Kunden!{K("Aktiv")}2:{K("Aktiv")}200,"<>Nein")', "0"),
        ("Offene Rechnungen", '=SUMIFS(Rechnungen!I:I,Rechnungen!L:L,"<>bezahlt",Rechnungen!I:I,">0")', EURO2),
        ("Heute dran (Akquise)", f'=COUNTIFS(Akquise!{A("Nächster Kontakt am")}:{A("Nächster Kontakt am")},"<="&TODAY(),Akquise!{A("Stand")}:{A("Stand")},"<>Kunde",Akquise!{A("Stand")}:{A("Stand")},"<>kein Interesse")', "0"),
    ]
    for i, (k, f, fmt) in enumerate(blick, start=5):
        text(st, f"B{i}", k, size=10)
        st[f"C{i}"] = f
        st[f"C{i}"].number_format = fmt
        st[f"C{i}"].font = Font(name=F, size=11, bold=True)
    text(st, "B12", "Was von selbst passiert", bold=True, size=12)
    auto = [
        "Die Seite des Studios zeigt freie Zeiten aus seinem Google-Kalender (oder nur die buchbaren Zeiten im Modus „Wunschtermin“)",
        "Buchung → Platz reserviert, Kundin bekommt „Bitte bestätigen“. Erst nach dem Klick ist der Termin fest. Sonst nach 45 Minuten wieder frei",
        "Bestätigt → Termin im Kalender des Studios, Bestätigung mit Vorbereitung und Kalenderdatei an die Kundin, Mail an das Studio",
        "24 Stunden vorher → Erinnerung mit Vorbereitung und Absage-Link an die Kundin. Absage → Kalender frei, Mail an das Studio",
        "Schutz: Bot-Falle, Prüfung von Name, Telefon, E-Mail, Sperrliste, nur ein offener Termin pro Person, Knopf „Fake melden“",
        "19 Uhr → jedes Studio: „Wie waren die Termine heute?“ (erschienen · nicht erschienen · gekauft)",
        "Rückruf-Wunsch → Mail mit „Zurückgerufen“, Erinnerung nach 60 Minuten · Montag → offene Termine an jedes Studio",
        "Erster Auftrag → Mail an dich · 1. des Monats → Werbekosten, Rechnungen · 3. des Monats → Reports als Entwurf in Gmail",
    ]
    for i, t in enumerate(auto, start=13):
        text(st, f"B{i}", "• " + t, size=10)
        st.merge_cells(f"B{i}:D{i}")
        st.row_dimensions[i].height = 28
    text(st, "B22", "Einrichten (einmal, ca. 25 Minuten)", bold=True, size=12)
    schritte = [
        "1. Diese Datei in Google Drive hochladen, öffnen, „Datei → Als Google Tabellen speichern“. Ab dann nur noch die Google-Version benutzen.",
        "2. Blatt „Einstellungen“: die gelben Felder ausfüllen.",
        "3. Menü „Erweiterungen → Apps Script“. Alles im Editor löschen. Den Inhalt von „Zentrale-Code.txt“ einfügen. Speichern (Diskette).",
        "4. In Apps Script links das Zahnrad (Projekteinstellungen): Zeitzone „(GMT+01:00) Berlin“ wählen.",
        "5. Oben rechts „Bereitstellen → Neue Bereitstellung“ → Zahnrad → „Web-App“. Ausführen als: Ich. Zugriff: Jeder. "
        "→ Bereitstellen → Zugriff erlauben (Google warnt: „Erweitert → Weiter zu …“ → Zulassen). Die Web-App-URL kopieren "
        "und im Blatt „Einstellungen“ bei „Web-App-Adresse“ einfügen. Dieselbe Adresse in die Steckbrief-Vorlage, Blatt „Eure Daten“.",
        "6. Zurück zu diesem Browser-Tab (die Tabelle, nicht Apps Script) und neu laden. Oben rechts neben „Hilfe“ erscheint das Menü „Clickculture“ → „1 · Einrichten“ → zulassen → nochmal „1 · Einrichten“.",
        "7. Testen: siehe Anleitung „1 Beauty-Zentrale einrichten“, Punkt 7.",
    ]
    for i, t in enumerate(schritte, start=23):
        text(st, f"B{i}", t, size=10)
        st.merge_cells(f"B{i}:D{i}")
        st.row_dimensions[i].height = 42 if len(t) > 120 else 28
    text(st, "B31", "Ausführlich: „1 Beauty-Zentrale einrichten – Anleitung“ im Ordner „01 Vorbereiten (einmal)“.", size=9, color="6B665D")

    # ------------------------------------------------ Einstellungen
    es = wb.create_sheet("Einstellungen")
    for i, (h, b) in enumerate((("Schlüssel", 16), ("Einstellung", 44), ("Eintrag", 44), ("Hilfe", 64)), start=1):
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
    for col, v in enumerate(["BEISPIEL Haut & Licht Laserstudio (Zeile überschreiben)", "Frau Beispiel", "Musterstadt", "0123 456789",
                             "@beispiel.laser", "Laser", "4,8 · 112", "neu", None, "Max", "Inhaberin dienstags im Studio"], start=1):
        c = ak.cell(row=2, column=col, value=v)
        c.font = Font(name=F, size=10, italic=True, color="7A756B")
    liste(ak, f"{A('Stand')}2:{A('Stand')}1000", STAND_AKQ)
    liste(ak, f"{A('Behandlung')}2:{A('Behandlung')}1000", ["Faltenbehandlung", "Laser", "Permanent Make-up", "Bleaching"])
    ak.conditional_formatting.add(f"{A('Stand')}2:{A('Stand')}1000", CellIsRule(operator="equal", formula=['"Kunde"'], fill=GRUEN))
    n, s_ = A("Nächster Kontakt am"), A("Stand")
    ak.conditional_formatting.add(f"A2:{A('Notiz')}1000", FormulaRule(
        formula=[f'AND(ISNUMBER(${n}2),${n}2<=TODAY(),${s_}2<>"Kunde",${s_}2<>"kein Interesse")'], fill=ORANGE))
    ak[f"{n}1"].comment = Comment("Datum eintragen, dann kommt es morgens in der Mail „Heute dran“. Orange = heute dran.", "Zentrale")
    ak[f"{A('Wer')}1"].comment = Comment("Wer von euch kümmert sich? Name wie in „Einstellungen → Wer ist im Team?“. Dann kommt das Studio morgens nur in seine Mail.", "Zentrale")
    ak.auto_filter.ref = f"A1:{A('Notiz')}1000"

    # ------------------------------------------------ Kunden
    ku = wb.create_sheet("Kunden")
    kopf(ku, KUNDEN)
    formate(ku, KUNDEN, 200)
    st_, kd, au = f"Termine!${T('Stand')}:${T('Stand')}", f"Termine!${T('Kunde')}:${T('Kunde')}", f"Termine!${T('Auftrag am')}:${T('Auftrag am')}"
    ea, mab = K("Erster Auftrag"), K("Monatsgebühr ab")
    for r in range(2, 201):
        for i, (_n, _b, _f, eingabe) in enumerate(KUNDEN, start=1):
            if not eingabe:
                ku.cell(row=r, column=i).fill = GRAU
        ku[f"{ea}{r}"] = (f'=IF($A{r}="","",IF(COUNTIFS({kd},$A{r},{st_},"Auftrag")=0,"noch keiner",'
                          f'_xlfn.MINIFS({au},{kd},$A{r},{st_},"Auftrag")))')
        ku[f"{mab}{r}"] = f'=IF(OR($A{r}="",${ea}{r}="",${ea}{r}="noch keiner"),"",DATE(YEAR(${ea}{r}),MONTH(${ea}{r})+1,1))'
        ku[f"{K('Termine gesamt')}{r}"] = f'=IF($A{r}="","",COUNTIFS({kd},$A{r},Termine!${T("Bestätigt am")}:${T("Bestätigt am")},"<>"))'
    liste(ku, f"{K('Aktiv')}2:{K('Aktiv')}200", ["Ja", "Nein"])
    liste(ku, f"{K('Buchung')}2:{K('Buchung')}200", ["Kalender", "Wunschtermin"])
    ku["A1"].comment = Comment("Neuer Kunde: die Datei „Zeile für die Zentrale“ aus seinem Kundenordner öffnen, alles kopieren, "
                               "hier in die erste freie Zeile in Spalte A einfügen. Die Spalten bis „Betreuer“ füllen sich so.", "Zentrale")
    ku[f"{K('Live seit')}1"].comment = Comment("Datum, an dem die Kampagnen live gingen. Ab dann gibt es Monatsreports.", "Zentrale")
    ku[f"{K('Aktiv')}1"].comment = Comment("Nein = keine Online-Buchung, keine Mails, keine Reports mehr (Kunde hat aufgehört).", "Zentrale")
    ku[f"{K('Buchung')}1"].comment = Comment("Kalender = freie Zeiten aus dem Google-Kalender des Studios, Termine werden direkt eingetragen. "
                                             "Wunschtermin = nur buchbare Zeiten, das Studio bestätigt jeden Termin per Knopf.", "Zentrale")
    ku[f"{K('Betreuer')}1"].comment = Comment("Wer von euch betreut das Studio? Name wie in „Einstellungen → Wer ist im Team?“. Bekommt den Report-Entwurf, steht in Hinweisen.", "Zentrale")
    ku[f"{K('Buchbare Zeiten')}1"].comment = Comment("Wann online gebucht werden darf, z. B. „Mo-Fr 9-18; Sa 10-14“ oder „Di, Do 9:30-13 14-18“.", "Zentrale")
    ku[f"{K('Leistungen')}1"].comment = Comment("Direkt buchbare Behandlungen: Name | Minuten | Preis; Name | Minuten | Preis", "Zentrale")
    ku[f"{K('Vorbereitung')}1"].comment = Comment("Punkte mit • getrennt. Steht in der Bestätigung und der Erinnerung an die Kundin.", "Zentrale")

    # ------------------------------------------------ Checkliste
    ck = wb.create_sheet("Checkliste")
    for i, (h, b) in enumerate((("Schritt", 15), ("Aufgabe", 76), ("Wer", 10)), start=1):
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
    ck["A1"].comment = Comment("Jeder Kunde im Blatt „Kunden“ bekommt hier von selbst eine Spalte. Erledigt = „Ja“ wählen. "
                               "Wer: Betreuer = wer das Studio betreut, Technik = wer bei euch einrichtet, Studio = der Kunde.", "Zentrale")

    # ------------------------------------------------ Termine
    tm = wb.create_sheet("Termine")
    kopf(tm, TERMINE)
    formate(tm, TERMINE, 3000)
    liste(tm, f"{T('Stand')}2:{T('Stand')}5000", STAND)
    for wert, farbe in (("Termin", GELB), ("Auftrag", GRUEN), ("neu", ORANGE), ("Fake", ROT), ("nicht erschienen", ROT)):
        tm.conditional_formatting.add(f"{T('Stand')}2:{T('Stand')}5000", CellIsRule(operator="equal", formula=[f'"{wert}"'], fill=farbe))
    tm["A1"].comment = Comment("Dieses Blatt füllt sich von selbst: Online-Buchungen, Rückruf-Wünsche, Verlosung. Den Stand pflegen die Studios "
                               "über die Knöpfe in den Mails; du kannst ihn auch hier ändern. Grau/unbestätigt = Kundin hat noch nicht bestätigt.", "Zentrale")
    for name in ("Kalender-Eintrag", "Schlüssel", "Kunden-Schlüssel"):
        tm.column_dimensions[T(name)].hidden = True
    tm.auto_filter.ref = f"A1:{T('Details')}5000"

    # ------------------------------------------------ Sperrliste
    sl = wb.create_sheet("Sperrliste")
    kopf(sl, SPERRLISTE)
    formate(sl, SPERRLISTE, 1000)
    sl["A1"].comment = Comment("Telefonnummern und E-Mails, mit denen nicht mehr online gebucht werden kann. „Fake melden“ trägt hier von selbst ein. "
                               "Du kannst auch selbst Zeilen anlegen. Kunde leer = gilt für alle Studios.", "Zentrale")

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
    mr.column_dimensions["A"].width = 38
    mr.column_dimensions["B"].width = 18
    text(mr, "A1", "Monatsreport zum Ansehen", bold=True, size=14)
    text(mr, "A2", "Kunde und Monat wählen. Die Mail an das Studio legt die Zentrale am 3. von selbst als Entwurf in Gmail an.", size=9, color="6B665D")
    for ref, label in (("3", "Kunde (Kürzel)"), ("4", "Monat (1. des Monats)")):
        text(mr, f"A{ref}", label, bold=True, size=10)
        mr[f"B{ref}"].fill = GELB
        mr[f"B{ref}"].border = BOX
        mr[f"B{ref}"].font = Font(name=F, color="0000FF", bold=True)
    mr["B4"].number_format = "MM.YYYY"
    dv = DataValidation(type="list", formula1="Kunden!$A$2:$A$200", allow_blank=True)
    mr.add_data_validation(dv)
    dv.add("B3")
    zeit = f'Termine!${T("Kunde")}:${T("Kunde")},$B$3,Termine!${T("Eingang")}:${T("Eingang")},">="&$B$4,Termine!${T("Eingang")}:${T("Eingang")},"<"&EDATE($B$4,1)'
    stn = lambda s: f'COUNTIFS({zeit},Termine!${T("Stand")}:${T("Stand")},"{s}")'
    kz = [
        ("Werbekosten", '=SUMPRODUCT((Werbekosten!$B$2:$B$400=$B$3)*(MONTH(Werbekosten!$A$2:$A$400)=MONTH($B$4))*'
                        '(YEAR(Werbekosten!$A$2:$A$400)=YEAR($B$4))*(Werbekosten!$C$2:$C$400+Werbekosten!$D$2:$D$400))', EURO),
        ("Online gebucht und bestätigt", f'=COUNTIFS({zeit},Termine!${T("Bestätigt am")}:${T("Bestätigt am")},"<>")', "0"),
        ("Werbekosten pro bestätigtem Termin", "=IFERROR(B6/B7,0)", EURO),
        ("Rückruf-Wünsche und Verlosung", f'=COUNTIFS({zeit},Termine!${T("Art")}:${T("Art")},"Rückruf")+COUNTIFS({zeit},Termine!${T("Art")}:${T("Art")},"Verlosung")', "0"),
        ("Erschienen", f"={stn('erschienen')}+{stn('Auftrag')}", "0"),
        ("Nicht erschienen", f"={stn('nicht erschienen')}", "0"),
        ("Abgesagt", f"={stn('abgesagt')}", "0"),
        ("Behandlung gekauft", f"={stn('Auftrag')}", "0"),
        ("Wert laut Studio", f'=SUMIFS(Termine!${T("Auftragswert €")}:${T("Auftragswert €")},{zeit},Termine!${T("Stand")}:${T("Stand")},"Auftrag")', EURO),
        ("Werbekosten pro Kauf", "=IFERROR(B6/B13,0)", EURO),
        ("Herausgefiltert (nicht bestätigt, Fake)", f"={stn('verfallen')}+{stn('unbestätigt')}+{stn('Fake')}", "0"),
        ("Erster Auftrag überhaupt", f"=IFERROR(VLOOKUP($B$3,Kunden!$A:${ea},{[s[0] for s in KUNDEN].index('Erster Auftrag') + 1},FALSE),\"\")", DATUM),
    ]
    for i, h in enumerate(("Zahl", "Wert"), start=1):
        c = mr.cell(row=5, column=i, value=h)
        c.font = Font(name=F, bold=True, color="FFFFFF", size=10)
        c.fill = DUNKEL
    for i, (k_, f, fmt) in enumerate(kz, start=6):
        mr.cell(row=i, column=1, value=k_).font = Font(name=F, size=10, bold=k_ in ("Online gebucht und bestätigt", "Behandlung gekauft"))
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
        print(json.dumps({"Checkliste": len(CHECKLISTE), "Kunden": [s[0] for s in KUNDEN], "Termine": [s[0] for s in TERMINE],
                          "Sperrliste": [s[0] for s in SPERRLISTE], "Werbekosten": [s[0] for s in WERBEKOSTEN],
                          "Akquise": [s[0] for s in AKQUISE], "Einstellungen": [e[0] for e in EINSTELLUNGEN if e[0] != "§"]},
                         ensure_ascii=False))
    else:
        bauen()
