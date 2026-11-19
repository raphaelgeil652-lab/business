#!/usr/bin/env python3
"""Baut den Finder-Ordner „Clickculture“ aus dem Repo: Texte als Word (.docx), Tabellen, Seiten, Bilder.

Aufruf (aus dem Repo-Hauptordner):
    python3 werkzeuge/clickculture-ordner-bauen.py [Zielordner]
        → <Zielordner>/Clickculture/ und <Zielordner>/Clickculture.zip   (Standard: ./clickculture-build)
    python3 werkzeuge/clickculture-ordner-bauen.py --kunde <kürzel> [Zielordner]
        → nur dieser PV-Kunde als eigener Ordner + ZIP, zum Ablegen in „04 Kundenordner“

Die Ordner stehen in der Reihenfolge, wie man an einen Kunden rangeht (wie nischen/photovoltaik/ANLEITUNG.md).
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

ANLEITUNG = "00 Anleitung – vom ersten Anruf bis zur laufenden Kampagne.docx"
O1, O2, O3, O4 = "01 Vorbereiten (einmal)", "02 Kunden finden (Schritt 1)", "03 Videocall (Schritt 2)", "04 Kundenordner (Schritt 3 bis 8)"
O5, O6, O7 = "05 Hilfe beim Einrichten (Schritt 6)", "06 Hintergrund und Wissen", "07 Andere Nischen und Aufträge"

PLAN = [
    (PV / "ANLEITUNG.md", ANLEITUNG),
    # 01 Vorbereiten
    (Z / "EINRICHTEN.md", f"{O1}/1 Zentrale einrichten – Anleitung.docx"),
    (Z / "Clickculture Zentrale.xlsx", f"{O1}/2 Clickculture Zentrale – in Google Drive hochladen.xlsx"),
    (Z / "Code.gs", f"{O1}/3 Zentrale-Code – in Apps Script einfügen.txt"),
    (PV / "hilfe-vorbereiten.md", f"{O1}/4 Vorbereiten – Meta, Google, Netlify, deine Daten.docx"),
    # 02 Kunden finden
    (V / "texte/akquise-verkaufsskript.md", f"{O2}/1 Verkaufsskript – Anruf und Videocall.docx"),
    (V / "texte/akquise-nachfass-mails.md", f"{O2}/2 Nachfass-Mails – Termin, nicht erreicht, nach dem Call.docx"),
    # 03 Videocall
    (V / "tabellen/01-steckbrief.xlsx", f"{O3}/1 Steckbrief-Vorlage – für jeden Kunden kopieren.xlsx"),
    (MUSTER / "anzeigen", f"{O3}/2 Beispiel – Anzeigen (vorschau.html öffnen)"),
    (MUSTER / "landingpage", f"{O3}/3 Beispiel – Seiten (wirtschaftlichkeit.html öffnen)"),
    # 04 Kundenordner: aus nischen/photovoltaik/kunden/ (siehe kunden())
    # 05 Hilfe beim Einrichten
    (PV / "hilfe-einrichten.md", f"{O5}/1 Hilfe Schritt 6 – Zugänge, Messung, Seiten, Zentrale, Kampagnen.docx"),
        # 06 Hintergrund und Wissen
    (V / "LIES-MICH.md", f"{O6}/Photovoltaik/So ist das System gebaut.docx"),
    (PV / "README.md", f"{O6}/Photovoltaik/Übersicht Photovoltaik.docx"),
    (PV / "modul-photovoltaik.md", f"{O6}/Photovoltaik/Modul Photovoltaik – Regeln, Zahlen, Quellen.docx"),
    (V / "anzeigen/recherche.md", f"{O6}/Photovoltaik/Recherche Anzeigen.docx"),
    (REPO / "grundlagen/agentur-playbook.md", f"{O6}/Agentur-Playbook.docx"),
    (REPO / "grundlagen/so-funktioniert-alles.md", f"{O6}/So funktioniert alles (Einsteiger).docx"),
    (REPO / "grundlagen/wissen/creatives.md", f"{O6}/Learnings/Creatives.docx"),
    (REPO / "grundlagen/wissen/onboarding.md", f"{O6}/Learnings/Onboarding.docx"),
    (REPO / "grundlagen/wissen/tech.md", f"{O6}/Learnings/Technik.docx"),
    (REPO / "anleitungen/tech-stack.md", f"{O7}/Kfz-Betriebe/Technik (ältere Anleitungen, nicht für Photovoltaik)/Technik-Regeln.docx"),
    (REPO / "anleitungen/meta-konto-einrichten.md", f"{O7}/Kfz-Betriebe/Technik (ältere Anleitungen, nicht für Photovoltaik)/Meta-Konto einrichten.docx"),
    (REPO / "anleitungen/meta-anzeige-einrichten.md", f"{O7}/Kfz-Betriebe/Technik (ältere Anleitungen, nicht für Photovoltaik)/Meta-Anzeige einrichten.docx"),
    (REPO / "anleitungen/klienten-journey.md", f"{O7}/Kfz-Betriebe/Technik (ältere Anleitungen, nicht für Photovoltaik)/Kunden-Ablauf.docx"),
    (REPO / "anleitungen/landingpage-hosten.md", f"{O7}/Kfz-Betriebe/Technik (ältere Anleitungen, nicht für Photovoltaik)/Landingpage online stellen.docx"),
    (REPO / "anleitungen/ghl-n8n-aufbau.md", f"{O7}/Kfz-Betriebe/Technik (ältere Anleitungen, nicht für Photovoltaik)/Später ab ca. 10 Kunden – CRM und Automatik (GoHighLevel, n8n).docx"),
    (REPO / "anleitungen/n8n", f"{O7}/Kfz-Betriebe/Technik (ältere Anleitungen, nicht für Photovoltaik)/n8n-Workflows"),
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

# Ein PV-Kundenordner im Finder: in der Reihenfolge, in der man die Dateien braucht
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

TOP = {
    O1: "Einmal vor dem ersten Kunden: die Zentrale (Google-Tabelle mit Automatik) einrichten, Konten anlegen.",
    O2: "Betriebe anrufen und einen Videocall vereinbaren. Die Liste der Betriebe ist in der Zentrale, Blatt „Akquise“.",
    O3: "Im Videocall den Steckbrief ausfüllen und das Beispiel zeigen.",
    O4: "Ein Ordner pro Kunde, von Claude erzeugt. Die Dateien sind in der Reihenfolge nummeriert, in der du sie brauchst.",
    O5: "Klick für Klick: Zugänge (Meta, Google), Messung, Seiten online, Zentrale verbinden, Kampagnen anlegen, testen.",
    O6: "Zum Nachlesen: wie das System gebaut ist, das Playbook, Recherche, Learnings.",
    O7: "Kfz-Betriebe, Küchenstudios (zurückgestellt) und Einzelaufträge.",
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


def kunde(quelle, ziel):
    """Ein PV-Kundenordner in Finder-Form, Dateien nummeriert in der Reihenfolge der Anleitung."""
    for rel, name in KUNDE:
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


def betriebsname(ordner_pv):
    return (ordner_pv / "README.md").read_text(encoding="utf-8").splitlines()[0].lstrip("# ").strip()


def kunden(ziel_root):
    for k in sorted(p for p in (PV / "kunden").iterdir() if p.is_dir() and (p / "README.md").exists()):
        name = betriebsname(k) + (" (Beispiel, erfunden)" if k.name == "muster-solartechnik" else "")
        kunde(k, ziel_root / O4 / name)


def link(rel, text, klasse=""):
    return f'<a class="{klasse}" href="{urllib.parse.quote(str(rel))}">{html.escape(text)}</a>'


def startseite(ziel):
    m = f"{O4}/Muster Solartechnik (Beispiel, erfunden)"
    schritte = [
        ("Vorbereiten (einmal)", "Zentrale einrichten, Steckbrief-Vorlage: Blatt „Deine Daten“, Konten anlegen.",
         [(f"{O1}/1 Zentrale einrichten – Anleitung.docx", "Zentrale einrichten"),
          (f"{O3}/1 Steckbrief-Vorlage – für jeden Kunden kopieren.xlsx", "Steckbrief-Vorlage"),
          (f"{O1}/4 Vorbereiten – Meta, Google, Netlify, deine Daten.docx", "Meta, Google, Netlify")]),
        ("1 · Kunden finden", "Betriebe anrufen, Ziel: Videocall. Liste in der Zentrale, Blatt „Akquise“.",
         [(f"{O2}/1 Verkaufsskript – Anruf und Videocall.docx", "Verkaufsskript"),
          (f"{O2}/2 Nachfass-Mails – Termin, nicht erreicht, nach dem Call.docx", "Nachfass-Mails")]),
        ("2 · Videocall", "Steckbrief Teil 1 ausfüllen, Beispiel zeigen, Budget nennen, bei Ja Teil 2.",
         [(f"{O3}/1 Steckbrief-Vorlage – für jeden Kunden kopieren.xlsx", "Steckbrief"),
          (f"{O3}/2 Beispiel – Anzeigen (vorschau.html öffnen)/vorschau.html", "Beispiel-Anzeigen"),
          (f"{O3}/3 Beispiel – Seiten (wirtschaftlichkeit.html öffnen)/wirtschaftlichkeit.html", "Beispiel-Seite")]),
        ("3 · Kundenordner erzeugen lassen", "Drive-Ordner anlegen, Link in den Steckbrief, Steckbrief an Claude. ZIP in „04 Kundenordner“.",
         [(f"{m}/0 Übersicht – was noch fehlt.docx", "So sieht ein Kundenordner aus")]),
        ("4 · Abschluss (am selben Tag)", "Vertrag, Rechnung, Google-Konto für ihn anlegen, Willkommens-Mail mit Zugänge-Anleitung und Rückruf-Leitfaden, Kunde in die Zentrale.",
         [(f"{m}/2a Vertrag – so verschickst du ihn (Mailtext).docx", "2 Vertrag"), (f"{m}/3 Rechnung – Mailtext (die Rechnung selbst machst du in der Zentrale).docx", "3 Rechnung"),
          (f"{m}/4 Willkommens-Mail – am Tag der Unterschrift.docx", "4 Willkommens-Mail"),
          (f"{m}/4b Zugänge-Anleitung für den Kunden – als PDF an die Willkommens-Mail.docx", "4b Zugänge-Anleitung"),
          (f"{m}/6 Zeile für die Zentrale – kopieren, im Blatt Kunden einfügen.txt", "6 Zeile für die Zentrale")]),
        ("5 · Vom Kunden einsammeln (bis Tag 3)", "Fotos im Drive-Ordner, Zugänge (Meta-Partner, Google angenommen, Zahlungsarten), Links, Bewertungen, ein Name. Fehlt etwas: anrufen.", []),
        ("6 · Einrichten", "Messung, neu erzeugen, Seiten online, Zentrale verbinden, Kampagnen pausiert anlegen.",
         [(f"{O5}/1 Hilfe Schritt 6 – Zugänge, Messung, Seiten, Zentrale, Kampagnen.docx", "Klick für Klick"),
          (f"{m}/7 Kampagnen – Messung, Meta und Google.docx", "7 Kampagnen")]),
        ("7 · Testen und live", "Test-Anfrage über jede Seite, Kampagnen aktiv, „Live seit“ in der Zentrale.", []),
        ("8 · Laufend", "Die Zentrale meldet sich per Mail. Was du dann tust, steht in der Anleitung, Schritt 8.", []),
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
                         and not any("Seiten für Netlify" in s or "Anzeigen ansehen" in s or "Beispiel – " in s for s in p.parts))
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
<p class="lead">Werbung → Anfragen → Aufträge für Solarbetriebe in ganz Deutschland. Alles in der Reihenfolge, wie du an einen Kunden rangehst.</p>
<div class="start"><h2>So geht es</h2><p>Einmal die {link(ANLEITUNG, "Anleitung")} lesen. Dann Schritt für Schritt:</p>{karten}
<p class="tipp">Word-Dateien öffnen sich in Pages oder Word, Tabellen in Numbers oder Excel, Seiten im Browser.
Die Zentrale läuft in deinem Google-Konto. Diesen Ordner baut <code>werkzeuge/clickculture-ordner-bauen.py</code> jederzeit neu.</p></div>
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
            ordner(quelle, zz, umbenennen=not str(rel).startswith(O3))
        elif quelle.suffix == ".md" and zz.suffix == ".docx":
            docx(quelle, zz)
        else:
            zz.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(quelle, zz)
    kunden(ziel)
    (ziel / O6 / "Betriebshandbuch (online öffnen).html").write_text(
        '<meta charset="utf-8"><meta http-equiv="refresh" content="0; url=https://claude.ai/artifact/7DSh95Hfrp17kLRnNLXftN">'
        '<a href="https://claude.ai/artifact/7DSh95Hfrp17kLRnNLXftN">Betriebshandbuch öffnen</a>', encoding="utf-8")
    startseite(ziel)
    zippen(ziel)


if __name__ == "__main__":
    main()
