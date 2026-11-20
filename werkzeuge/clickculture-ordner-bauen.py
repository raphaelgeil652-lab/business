#!/usr/bin/env python3
"""Baut den Finder-Ordner „Clickculture“ aus dem Repo: Texte als Word (.docx), Tabellen, Seiten, Bilder.

Aufruf (aus dem Repo-Hauptordner):
    python3 werkzeuge/clickculture-ordner-bauen.py [Zielordner]
        → <Zielordner>/Clickculture/ und <Zielordner>/Clickculture.zip   (Standard: ./clickculture-build)
    python3 werkzeuge/clickculture-ordner-bauen.py --kunde <kürzel> [Zielordner]
        → nur dieser Kunde (Beauty, sonst Photovoltaik) als eigener Ordner + ZIP, zum Ablegen in „04 Kundenordner“

Aktive Nische ist Beauty (seit 20.11.2026). Die Ordner stehen in der Reihenfolge, wie man an ein Studio rangeht
(wie nischen/beauty/ANLEITUNG.md). Photovoltaik liegt vollständig unter „07 Andere Nischen › Photovoltaik (pausiert)“.
Jeder Name sagt, was man damit tut. Braucht pandoc. Webseitenbau, persönliche Entwicklung und
Videoschnitt gehören nicht hinein.
"""
import html
import pathlib
import shutil
import subprocess
import sys
import urllib.parse
import zipfile

REPO = pathlib.Path(__file__).resolve().parent.parent
N = REPO / "nischen"
PV = N / "photovoltaik"
V = PV / "vorlagen"
Z = REPO / "zentrale"
MUSTER = PV / "kunden" / "muster-solartechnik"
B = N / "beauty"
BV = B / "vorlagen"
BZ = B / "zentrale"
BEISPIELE = [("muster-laserstudio", "Laser-Haarentfernung"), ("muster-brows", "Permanent Make-up"),
             ("muster-aesthetik", "Faltenbehandlung (Ärztin)"), ("muster-zahnarztpraxis", "Bleaching (Zahnarztpraxis)")]
PVO = "07 Andere Nischen und Aufträge/Photovoltaik (pausiert)"

ANLEITUNG = "00 Anleitung – so läuft es.docx"
O1, O2, O3, O4 = "01 Einmal vorbereiten", "02 Studios finden (Schritt 1)", "03 Beispiele zum Zeigen (Schritt 2)", "04 Kundenordner von Claude (Schritt 4 und 5)"
O5, O6, O7 = "05 Hilfe – Meta, Google, Netlify", "06 Hintergrund und Wissen", "07 Andere Nischen und Aufträge"

PLAN = [
    (B / "ANLEITUNG.md", ANLEITUNG),
    # 01 Vorbereiten
    (BZ / "EINRICHTEN.md", f"{O1}/1 Beauty-Zentrale einrichten – Anleitung.docx"),
    (BZ / "Clickculture Beauty-Zentrale.xlsx", f"{O1}/2 Beauty-Zentrale – nur bei neuer Einrichtung hochladen.xlsx"),
    (BZ / "Code.gs", f"{O1}/3 Beauty-Zentrale-Code – in Apps Script einfügen.txt"),
    # 02 Studios finden
    (BV / "texte/akquise-verkaufsskript.md", f"{O2}/1 Verkaufsskript – Ansprache und Gespräch.docx"),
    (BV / "texte/akquise-nachfass-mails.md", f"{O2}/2 Nachfass-Nachrichten.docx"),
    # 03 Beispiele: siehe beispiele(); 04 Kundenordner: aus nischen/beauty/kunden/ (siehe kunden())
    # 05 Hilfe
    (B / "hilfe-einrichten.md", f"{O5}/1 Hilfe – Meta und Google mit dem Studio einrichten, Netlify.docx"),
    # 06 Hintergrund und Wissen
    (BV / "LIES-MICH.md", f"{O6}/Beauty/So ist das System gebaut.docx"),
    (B / "README.md", f"{O6}/Beauty/Übersicht Beauty.docx"),
    (B / "modul-beauty.md", f"{O6}/Beauty/Regeln, Zahlen, Quellen.docx"),
    (REPO / "reports/Beauty Nischen Profitabilität Deutschland.md", f"{O6}/Beauty/Bericht – welche Beauty-Nische sich lohnt.docx"),
    (REPO / "grundlagen/agentur-playbook.md", f"{O6}/Agentur-Playbook.docx"),
    (REPO / "grundlagen/so-funktioniert-alles.md", f"{O6}/So funktioniert alles (Einsteiger).docx"),
    (REPO / "grundlagen/wissen/creatives.md", f"{O6}/Learnings/Creatives.docx"),
    (REPO / "grundlagen/wissen/onboarding.md", f"{O6}/Learnings/Onboarding.docx"),
    (REPO / "grundlagen/wissen/tech.md", f"{O6}/Learnings/Technik.docx"),
    # 07 · Photovoltaik (pausiert, vollständig)
    (PV / "ANLEITUNG.md", f"{PVO}/00 Anleitung Photovoltaik.docx"),
    (Z / "EINRICHTEN.md", f"{PVO}/01 Vorbereiten/1 PV-Zentrale einrichten – Anleitung.docx"),
    (Z / "Clickculture Zentrale.xlsx", f"{PVO}/01 Vorbereiten/2 PV-Zentrale – in Google Drive hochladen.xlsx"),
    (Z / "Code.gs", f"{PVO}/01 Vorbereiten/3 PV-Zentrale-Code – in Apps Script einfügen.txt"),
    (PV / "hilfe-vorbereiten.md", f"{PVO}/01 Vorbereiten/4 Vorbereiten – Meta, Google, Netlify, deine Daten.docx"),
    (V / "texte/akquise-verkaufsskript.md", f"{PVO}/02 Kunden finden/1 Verkaufsskript.docx"),
    (V / "texte/akquise-nachfass-mails.md", f"{PVO}/02 Kunden finden/2 Nachfass-Mails.docx"),
    (V / "tabellen/01-steckbrief.xlsx", f"{PVO}/03 Videocall/1 Steckbrief-Vorlage PV.xlsx"),
    (MUSTER / "anzeigen", f"{PVO}/03 Videocall/2 Beispiel – Anzeigen (vorschau.html öffnen)"),
    (MUSTER / "landingpage", f"{PVO}/03 Videocall/3 Beispiel – Seiten (wirtschaftlichkeit.html öffnen)"),
    (PV / "hilfe-einrichten.md", f"{PVO}/05 Hilfe beim Einrichten.docx"),
    (V / "LIES-MICH.md", f"{PVO}/06 Hintergrund/So ist das System gebaut.docx"),
    (PV / "README.md", f"{PVO}/06 Hintergrund/Übersicht Photovoltaik.docx"),
    (PV / "modul-photovoltaik.md", f"{PVO}/06 Hintergrund/Modul Photovoltaik – Regeln, Zahlen, Quellen.docx"),
    (V / "anzeigen/recherche.md", f"{PVO}/06 Hintergrund/Recherche Anzeigen.docx"),
    (REPO / "anleitungen/tech-stack.md", f"{O7}/Kfz-Betriebe/Technik (ältere Anleitungen)/Technik-Regeln.docx"),
    (REPO / "anleitungen/meta-konto-einrichten.md", f"{O7}/Kfz-Betriebe/Technik (ältere Anleitungen)/Meta-Konto einrichten.docx"),
    (REPO / "anleitungen/meta-anzeige-einrichten.md", f"{O7}/Kfz-Betriebe/Technik (ältere Anleitungen)/Meta-Anzeige einrichten.docx"),
    (REPO / "anleitungen/klienten-journey.md", f"{O7}/Kfz-Betriebe/Technik (ältere Anleitungen)/Kunden-Ablauf.docx"),
    (REPO / "anleitungen/landingpage-hosten.md", f"{O7}/Kfz-Betriebe/Technik (ältere Anleitungen)/Landingpage online stellen.docx"),
    (REPO / "anleitungen/ghl-n8n-aufbau.md", f"{O7}/Kfz-Betriebe/Technik (ältere Anleitungen)/Später ab ca. 10 Kunden – CRM und Automatik (GoHighLevel, n8n).docx"),
    (REPO / "anleitungen/n8n", f"{O7}/Kfz-Betriebe/Technik (ältere Anleitungen)/n8n-Workflows"),
    # 07 Andere Nischen und Aufträge
    (N / "autowerkstaetten/README.md", f"{O7}/Kfz-Betriebe/0 Übersicht.docx"),
    (N / "autowerkstaetten/businessplan.md", f"{O7}/Kfz-Betriebe/1 Businessplan.docx"),
    (N / "autowerkstaetten/geschaeftsmodell.md", f"{O7}/Kfz-Betriebe/2 Geschäftsmodell und Preise.docx"),
    (N / "autowerkstaetten/nische.md", f"{O7}/Kfz-Betriebe/3 Nische und Kundenfilter.docx"),
    (N / "autowerkstaetten/service-module.md", f"{O7}/Kfz-Betriebe/4 Service-Module (Baukasten).docx"),
    (N / "autowerkstaetten/recherche-landingpages.md", f"{O7}/Kfz-Betriebe/5 Recherche Landingpages.docx"),
    (N / "autowerkstaetten/akquise/verkaufsskript.md", f"{O7}/Kfz-Betriebe/Akquise/Verkaufsskript vor Ort.docx"),
    (N / "autowerkstaetten/akquise/angebot-vertrag.md", f"{O7}/Kfz-Betriebe/Akquise/Angebot und Vertrag.docx"),
    (N / "autowerkstaetten/akquise/onboarding-email.md", f"{O7}/Kfz-Betriebe/Akquise/Willkommens-Mail.docx"),
    (N / "autowerkstaetten/akquise/fahrplan-erster-umsatz.md", f"{O7}/Kfz-Betriebe/Akquise/Fahrplan erster Umsatz.docx"),
    (N / "autowerkstaetten/akquise/klienten-leads.csv", f"{O7}/Kfz-Betriebe/Akquise/Lead-Liste Kfz-Betriebe.csv"),
    (N / "autowerkstaetten/seiten/pitch", f"{O7}/Kfz-Betriebe/Seiten (im Browser öffnen)/Pitch-Seite fürs iPad"),
    (N / "autowerkstaetten/seiten/landingpage", f"{O7}/Kfz-Betriebe/Seiten (im Browser öffnen)/Landingpage-Vorlage"),
    (N / "autowerkstaetten/seiten/beispiele", f"{O7}/Kfz-Betriebe/Seiten (im Browser öffnen)/Beispiele (Anzeige, Landingpage)"),
    (N / "kuechenstudios", f"{O7}/Küchenstudios (zurückgestellt)"),
    (N / "chinatown/README.md", f"{O7}/China Restaurant Chinatown/0 Übersicht.docx"),
    (N / "chinatown/flyer/chinatown-faltflyer-A4.pdf", f"{O7}/China Restaurant Chinatown/Flyer A4 Faltflyer (Druck).pdf"),
    (N / "chinatown/flyer/chinatown-flyer-A5.pdf", f"{O7}/China Restaurant Chinatown/Flyer A5 (Druck).pdf"),
    (N / "chinatown/vorschau", f"{O7}/China Restaurant Chinatown/Vorschau (im Browser öffnen)"),
    (N / "chinatown/webseite", f"{O7}/China Restaurant Chinatown/Webseite (Dateien für Vercel)"),
]

# Ein Kundenordner im Finder: in der Reihenfolge, in der man die Dateien braucht
KUNDE_BEAUTY = [
    ("LIES-MICH.md", "0 Lies mich – drei Schritte.docx"),
    ("seite", "1 Seite für Netlify – Ordner hineinziehen"),
    ("kampagnen.md", "2 Kampagnen – Meta und Google Klick für Klick.docx"),
    ("anzeigen/creatives", "3 Anzeigen-Bilder – bei Meta hochladen"),
    ("anzeigen", "4 Anzeigen ansehen – vorschau.html öffnen"),
    ("fotos", "Fotos – Originale"),
]
KUNDE = [
    ("README.md", "0 Übersicht – was noch fehlt.docx"),
    ("steckbrief.xlsx", "1 Steckbrief.xlsx"),
    ("dokumente/vertrag-mail.md", "2a Vertrag – so verschickst du ihn (Mailtext).docx"),
    ("dokumente/vereinbarung.md", "2b Vertrag – als PDF schicken.docx"),
    ("dokumente/abrechnung-mails.md", "3 Rechnung – Mailtext (die Rechnung selbst machst du in der Zentrale).docx"),
    ("dokumente/willkommens-mail.md", "4 Willkommens-Mail – am Tag der Unterschrift.docx"),
    ("dokumente/zugaenge-anleitung.md", "4b Zugänge-Anleitung für den Kunden – als PDF an die Willkommens-Mail.docx"),
    ("dokumente/rueckruf-leitfaden.md", "5 Rückruf-Leitfaden – als PDF an die Willkommens-Mail.docx"),
    ("zentrale-zeile.txt", "6 Zeile für die Zentrale – kopieren, im Blatt Kunden einfügen.txt"),
    ("dokumente/kampagnen.md", "7 Kampagnen – Messung, Meta und Google.docx"),
    ("landingpage", "8 Seiten für Netlify – ganzen Ordner hochziehen"),
    ("anzeigen/creatives", "9 Anzeigen-Bilder – bei Meta hochladen"),
    ("anzeigen", "10 Anzeigen ansehen – vorschau.html öffnen"),
    ("dokumente/teilnahmebedingungen.md", "11 Verlosung – Teilnahmebedingungen prüfen lassen.docx"),
    ("fotos", "Fotos – Originale"),
]
# Die Vorschau der Anzeigen verlinkt die Terminseite: Pfad an die Finder-Namen anpassen
VORSCHAU_LINK = {"kunde": ("../landingpage/", "../8 Seiten für Netlify – ganzen Ordner hochziehen/"),
                 "kunde_beauty": ("../seite/", "../1 Seite für Netlify – Ordner hineinziehen/"),
                 "beispiel": ("../seite/", "../Seite (termin.html öffnen)/")}

TOP = {
    O1: "Einmal: neuen Code in die Zentrale, Einstellungen, zwei Lesezeichen (Übersicht und Formular „Neuer Kunde“).",
    O2: "Studios persönlich oder über Instagram ansprechen. Die Liste ist in der Beauty-Zentrale, Blatt „Akquise“.",
    O3: "Im Gespräch zeigen: Anzeigen und Terminseite der passenden Behandlung. Ausgefüllt wird das Formular „Neuer Kunde“ (Lesezeichen).",
    O4: "Ein Ordner pro Studio, von Claude gebaut, wenn die Mail „alles vom Studio da“ kam. Nummeriert in der Reihenfolge, in der du ihn brauchst.",
    O5: "Klick für Klick: Meta und Google mit dem Studio am Telefon einrichten, Netlify, was tun, wenn etwas hakt.",
    O6: "Zum Nachlesen: wie das System gebaut ist, Regeln und Quellen, der Bericht zur Nischenwahl, das Playbook.",
    O7: "Photovoltaik (pausiert, vollständig erhalten), Kfz-Betriebe, Küchenstudios und Einzelaufträge.",
}
NAMEN_MD = {"readme": "Übersicht", "ad-copy": "Anzeigentexte", "offer-und-ads": "Angebot und Anzeigen",
            "geschaeftsmodell": "Geschäftsmodell", "nische": "Nische und Kundenfilter",
            "angebot-vertrag": "Angebot und Vertrag", "besuchs-reihenfolge": "Besuchs-Reihenfolge",
            "erster-kunde-fahrplan": "Erster Kunde Fahrplan", "fahrplan-erster-umsatz": "Fahrplan erster Umsatz",
            "onboarding-email": "Willkommens-Mail", "verkaufsskript": "Verkaufsskript"}
ORDNER_NAMEN = {"akquise": "Akquise", "seiten": "Seiten (im Browser öffnen)", "beispiele": "Beispiele",
                "landingpage": "Landingpage-Vorlage", "pitch": "Pitch-Seite fürs iPad"}
NICHT_MIT = {"aktionen.json"}  # Technikdatei, gehört nicht auf Netlify


def schoen(rel):
    return pathlib.Path(*[ORDNER_NAMEN.get(t, t) for t in rel.parts]) if rel.parts else rel


def docx(quelle, ziel):
    ziel.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(["pandoc", str(quelle), "-f", "gfm", "-o", str(ziel)], check=True)


def ordner(quelle, ziel, umbenennen=True):
    for p in sorted(quelle.rglob("*")):
        if p.is_dir() or p.name.startswith(".") or p.name in NICHT_MIT or p.suffix == ".pyc" \
                or "tools" in p.relative_to(quelle).parts:
            continue
        rel = p.relative_to(quelle)
        unter = schoen(rel.parent) if umbenennen else rel.parent
        if p.suffix == ".md" and umbenennen:
            name = NAMEN_MD.get(p.stem.lower(), p.stem.replace("-", " ").capitalize())
            if p.stem.lower() == "readme" and rel.parent != pathlib.Path("."):
                name = "Anleitung"
            docx(p, ziel / unter / f"{name}.docx")
        else:
            (ziel / unter).mkdir(parents=True, exist_ok=True)
            shutil.copy2(p, ziel / unter / p.name)


def ist_beauty(quelle):
    return (quelle / "kampagnen.md").exists() and (quelle / "seite").exists()


def vorschau_umschreiben(ordner_pfad, art):
    alt, neu = VORSCHAU_LINK[art]
    for v in ordner_pfad.rglob("vorschau.html"):
        v.write_text(v.read_text(encoding="utf-8").replace(alt, urllib.parse.quote(neu, safe="/.")), encoding="utf-8")


def kunde(quelle, ziel):
    """Ein Kundenordner in Finder-Form, Dateien nummeriert in der Reihenfolge der Anleitung."""
    for rel, name in (KUNDE_BEAUTY if ist_beauty(quelle) else KUNDE):
        q = quelle / rel
        if not q.exists():
            continue
        if q.is_dir():
            ordner(q, ziel / name, umbenennen=False)
        elif q.suffix == ".md":
            docx(q, ziel / name)
        else:
            ziel.mkdir(parents=True, exist_ok=True)
            shutil.copy2(q, ziel / name)
    vorschau_umschreiben(ziel, "kunde_beauty" if ist_beauty(quelle) else "kunde")


def betriebsname(ordner):
    datei = ordner / "LIES-MICH.md" if (ordner / "LIES-MICH.md").exists() else ordner / "README.md"
    return datei.read_text(encoding="utf-8").splitlines()[0].lstrip("# ").split(" · ")[0].strip()


def kunden(ziel_root):
    # Beauty: nur ein Beispiel als Muster (alle vier stehen unter „03 Gespräch › Beispiele“); echte Kunden liegen nicht im Repo
    beispiele = {k for k, _ in BEISPIELE}
    for k in sorted(p for p in (B / "kunden").iterdir() if p.is_dir() and (p / "LIES-MICH.md").exists()):
        if k.name in beispiele and k.name != "muster-laserstudio":
            continue
        name = betriebsname(k) + (" (Beispiel, erfunden)" if k.name in beispiele else "")
        kunde(k, ziel_root / O4 / name)
    for k in sorted(p for p in (PV / "kunden").iterdir() if p.is_dir() and (p / "README.md").exists()):
        name = betriebsname(k) + (" (Beispiel, erfunden)" if k.name == "muster-solartechnik" else "")
        kunde(k, ziel_root / PVO / "04 Kundenordner" / name)


def beispiele(ziel_root):
    """Die vier Beispielstudios zum Zeigen im Gespräch: je Anzeigen und Seite."""
    for kuerzel, titel in BEISPIELE:
        q = B / "kunden" / kuerzel
        if not q.exists():
            continue
        z = ziel_root / O3 / titel
        ordner(q / "anzeigen", z / "Anzeigen (vorschau.html öffnen)", umbenennen=False)
        ordner(q / "seite", z / "Seite (termin.html öffnen)", umbenennen=False)
        vorschau_umschreiben(z, "beispiel")


def link(rel, text, klasse=""):
    return f'<a class="{klasse}" href="{urllib.parse.quote(str(rel))}">{html.escape(text)}</a>'


def startseite(ziel):
    m = f"{O4}/Muster Laserstudio (Beispiel, erfunden)"
    bsp = f"{O3}/Laser-Haarentfernung"
    schritte = [
        ("Einmal vorbereiten", "Neuen Code in die Zentrale (und „Neue Version“ bereitstellen), Einstellungen ausfüllen, zwei Lesezeichen speichern.",
         [(f"{O1}/1 Beauty-Zentrale einrichten – Anleitung.docx", "Zentrale einrichten")]),
        ("1 · Studios finden", "Persönlich vorbeigehen oder über Instagram anschreiben, keine Kaltanrufe bei Praxen.",
         [(f"{O2}/1 Verkaufsskript – Ansprache und Gespräch.docx", "Verkaufsskript"),
          (f"{O2}/2 Nachfass-Nachrichten.docx", "Nachfass-Nachrichten")]),
        ("2 · Gespräch", "Beispiel zeigen. Lesezeichen „Neuer Kunde“ mit dem Studio ausfüllen → „Kunde anlegen“. Willkommens-Mail, Vereinbarung und Schritte-Seite gehen von selbst raus.",
         [(f"{bsp}/Anzeigen (vorschau.html öffnen)/vorschau.html", "Beispiel-Anzeigen"),
          (f"{bsp}/Seite (termin.html öffnen)/termin.html", "Beispiel-Terminseite")]),
        ("3 · Das Studio erledigt seine Schritte", "Vereinbarung, Fotos, Kalender, Meta, Google. Die Zentrale erinnert. Ihr reagiert nur auf Mails. Meta und Google am besten zusammen am Telefon.",
         [(f"{O5}/1 Hilfe – Meta und Google mit dem Studio einrichten, Netlify.docx", "Meta und Google Klick für Klick")]),
        ("4 · Mail „alles vom Studio da“", "Fotos-Ordner herunterladen, mit dem „Text für Claude“ an Claude. Claude schickt den Kundenordner.",
         [(f"{m}/0 Lies mich – drei Schritte.docx", "So sieht ein Kundenordner aus")]),
        ("5 · Online und Kampagnen", "Seite auf Netlify ziehen, Kampagnen nach Anleitung, Pixel-ID und Conversion auf der Team-Seite.",
         [(f"{m}/2 Kampagnen – Meta und Google Klick für Klick.docx", "Kampagnen")]),
        ("6 · Testen und live", "Test-Termin buchen, bestätigen, absagen. Kampagnen an. Team-Seite „Jetzt live schalten“.", []),
        ("7 · Laufend", "Rechnungen, Erinnerungen und Termine laufen von selbst. Am 1. je Studio ein Klick für den Monatsreport.", []),
    ]
    karten = "".join(
        f'<div class="schritt"><b>{html.escape(t)}</b><p>{html.escape(b)}</p>'
        + (f'<p class="links">{" · ".join(link(r, x) for r, x in ls)}</p>' if ls else "") + "</div>"
        for t, b, ls in schritte)
    teile = []
    for top in sorted(TOP):
        dateien = sorted(p for p in (ziel / top).rglob("*") if p.is_file()
                         and not any(s in p.parts for s in ("fonts", "fotos", "Fotos – Originale", "n8n-Workflows", "creatives"))
                         and p.suffix not in (".json", ".jpg", ".png", ".woff2", ".svg", ".js", ".css")
                         and not any("Seiten für Netlify" in s or "Anzeigen ansehen" in s or "Beispiel – " in s or "Beispiele zum Zeigen" in s for s in p.parts))
        zeilen = "".join(f'<li>{link(p.relative_to(ziel), p.stem)}<span>{html.escape(" › ".join(p.relative_to(ziel).parts[1:-1]))}</span></li>'
                         for p in dateien)
        teile.append(f'<section><h2>{html.escape(top)}</h2><p>{html.escape(TOP[top])}</p><ul>{zeilen}</ul></section>')
    (ziel / "00 START HIER.html").write_text(f"""<!DOCTYPE html><html lang="de"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1"><title>Clickculture</title><style>
body{{margin:0;background:#F3EFE7;color:#1A1917;font-family:-apple-system,"Helvetica Neue",Arial,sans-serif;line-height:1.5;}}
.w{{max-width:900px;margin:0 auto;padding:40px 24px 80px;}}
h1{{font-size:44px;letter-spacing:-.03em;margin:0;}} .lead{{color:#5E5A52;margin:8px 0 24px;}}
.start{{background:#fff;border:2px solid #B4461F;border-radius:8px;padding:18px 20px;margin-bottom:28px;}}
.start h2{{margin:0 0 4px;font-size:22px;}} .start>p{{margin:0 0 14px;color:#5E5A52;}}
.schritt{{border-top:1px solid #E8E2D6;padding:10px 0;}} .schritt b{{font-size:16px;}} .schritt p{{margin:2px 0;font-size:14px;color:#3A3732;}}
.schritt .links a{{color:#B4461F;}}
section{{border-top:1px solid #DDD6C9;padding:24px 0 8px;}} section h2{{font-size:20px;margin:0 0 4px;}}
section>p{{color:#6B665D;margin:0 0 12px;font-size:15px;}} ul{{list-style:none;padding:0;margin:0;}}
li{{display:flex;justify-content:space-between;gap:16px;padding:7px 0;border-bottom:1px solid #E8E2D6;font-size:15px;}}
a{{color:#1A1917;text-decoration:none;font-weight:600;}} a:hover{{color:#B4461F;}} li span{{color:#8A857B;font-size:13px;text-align:right;}}
.tipp{{font-size:13px;color:#6B665D;margin-top:14px;}}
</style></head><body><div class="w"><h1>Clickculture</h1>
<p class="lead">Werbung → Online-Termine → Kundinnen für Beauty-Studios und Praxen: Laser, Permanent Make-up, Faltenbehandlung, Bleaching. Ihr füllt im Gespräch ein Formular aus, den Rest machen die Zentrale, das Studio auf seiner Schritte-Seite und Claude. Photovoltaik liegt pausiert unter „07“.</p>
<div class="start"><h2>So geht es</h2><p>Einmal die {link(ANLEITUNG, "Anleitung")} lesen. Dann Schritt für Schritt:</p>{karten}
<p class="tipp">Word-Dateien öffnen sich in Pages oder Word, Tabellen in Numbers oder Excel, Seiten im Browser.
Die Beauty-Zentrale läuft in deinem Google-Konto. Diesen Ordner baut <code>werkzeuge/clickculture-ordner-bauen.py</code> jederzeit neu.</p></div>
{''.join(teile)}</div></body></html>""", encoding="utf-8")


def zippen(ordner_pfad):
    zipdatei = ordner_pfad.parent / f"{ordner_pfad.name}.zip"
    with zipfile.ZipFile(zipdatei, "w", zipfile.ZIP_DEFLATED) as zf:
        for p in sorted(ordner_pfad.rglob("*")):
            if p.is_file():
                zf.write(p, p.relative_to(ordner_pfad.parent))
    print(zipdatei, round(zipdatei.stat().st_size / 1e6, 1), "MB")
    return zipdatei


def main():
    args = sys.argv[1:]
    if args[:1] == ["--kunde"]:
        if len(args) < 2:
            sys.exit(__doc__)
        k = B / "kunden" / args[1]
        if not k.exists():
            k = PV / "kunden" / args[1]
        out = pathlib.Path(args[2] if len(args) > 2 else "clickculture-build").resolve()
        ziel = out / betriebsname(k)
        shutil.rmtree(ziel, ignore_errors=True)
        kunde(k, ziel)
        zippen(ziel)
        return
    out = pathlib.Path(args[0] if args else "clickculture-build").resolve()
    ziel = out / "Clickculture"
    shutil.rmtree(ziel, ignore_errors=True)
    ziel.mkdir(parents=True)
    for quelle, rel in PLAN:
        zz = ziel / rel
        if quelle.is_dir():
            ordner(quelle, zz, umbenennen=not (str(rel).startswith(O3) or "Videocall" in str(rel)))
        elif quelle.suffix == ".md" and zz.suffix == ".docx":
            docx(quelle, zz)
        else:
            zz.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(quelle, zz)
    kunden(ziel)
    beispiele(ziel)
    (ziel / O6 / "Betriebshandbuch (online öffnen).html").write_text(
        '<meta charset="utf-8"><meta http-equiv="refresh" content="0; url=https://claude.ai/artifact/7DSh95Hfrp17kLRnNLXftN">'
        '<a href="https://claude.ai/artifact/7DSh95Hfrp17kLRnNLXftN">Betriebshandbuch öffnen</a>', encoding="utf-8")
    startseite(ziel)
    zippen(ziel)


if __name__ == "__main__":
    main()
