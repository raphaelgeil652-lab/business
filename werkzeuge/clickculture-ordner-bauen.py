#!/usr/bin/env python3
"""Baut den Finder-Ordner „Clickculture“ aus dem Repo: Texte als Word (.docx), Tabellen, Seiten, Bilder.

Aufruf (aus dem Repo-Hauptordner):
    python3 werkzeuge/clickculture-ordner-bauen.py [Zielordner]
        → <Zielordner>/Clickculture/ und <Zielordner>/Clickculture.zip   (Standard: ./clickculture-build)
    python3 werkzeuge/clickculture-ordner-bauen.py --kunde <betrieb> [Zielordner]
        → nur dieser PV-Kunde als eigener Ordner + ZIP, zum Ablegen unter 02 Photovoltaik › 3 Kunden

Braucht pandoc. Die Reihenfolge der Ordner folgt dem Ablauf: erst die Anleitung, dann das, was man
beim Kunden braucht, dann Verwaltung und Hintergrund. Webseitenbau, persönliche Entwicklung und
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

PLAN = [
    # 01 Anleitung
    (PV / "ANLEITUNG.md", "01 Anleitung/Vom Kunden zur fertigen Kampagne.docx"),
    # 02 Photovoltaik
    (V / "tabellen/01-steckbrief.xlsx", "02 Photovoltaik/1 Steckbrief (für jeden Kunden kopieren).xlsx"),
    (V / "tabellen/04-akquise-pv-betriebe.xlsx", "02 Photovoltaik/2 Akquise/Akquise-Liste PV-Betriebe.xlsx"),
    (V / "texte/akquise-verkaufsskript.md", "02 Photovoltaik/2 Akquise/Verkaufsskript.docx"),
    (V / "texte/akquise-nachfass-mails.md", "02 Photovoltaik/2 Akquise/Nachfass-Mails.docx"),
    # 3 Kunden: wird aus nischen/photovoltaik/kunden/ gefüllt (siehe kunden())
    (V / "LIES-MICH.md", "02 Photovoltaik/4 Hintergrund/So ist das System gebaut.docx"),
    (PV / "README.md", "02 Photovoltaik/4 Hintergrund/Übersicht Photovoltaik.docx"),
    (PV / "modul-photovoltaik.md", "02 Photovoltaik/4 Hintergrund/Modul Photovoltaik (Regeln, Zahlen, Quellen).docx"),
    (V / "anzeigen/recherche.md", "02 Photovoltaik/4 Hintergrund/Recherche Anzeigen.docx"),
    # 03 Verwaltung
    (V / "tabellen/00-agentur.xlsx", "03 Verwaltung/Agentur (Deine Daten und Rechnungen).xlsx"),
    # 04 Anleitungen Technik
    (REPO / "anleitungen/meta-konto-einrichten.md", "04 Anleitungen Technik/Meta-Konto einrichten.docx"),
    (REPO / "anleitungen/meta-anzeige-einrichten.md", "04 Anleitungen Technik/Meta-Anzeige einrichten.docx"),
    (REPO / "anleitungen/landingpage-hosten.md", "04 Anleitungen Technik/Landingpage online stellen (Netlify).docx"),
    (REPO / "anleitungen/klienten-journey.md", "04 Anleitungen Technik/Kunden-Ablauf von A bis Z.docx"),
    (REPO / "anleitungen/tech-stack.md", "04 Anleitungen Technik/Technik-Regeln.docx"),
    (REPO / "anleitungen/ghl-n8n-aufbau.md", "04 Anleitungen Technik/Später ab ca. 10 Kunden/CRM und Automatik (GoHighLevel, n8n).docx"),
    (REPO / "anleitungen/n8n", "04 Anleitungen Technik/Später ab ca. 10 Kunden/n8n-Workflows"),
    # 05 Grundlagen
    (REPO / "grundlagen/agentur-playbook.md", "05 Grundlagen/Agentur-Playbook.docx"),
    (REPO / "grundlagen/so-funktioniert-alles.md", "05 Grundlagen/So funktioniert alles (Einsteiger).docx"),
    (REPO / "grundlagen/wissen/creatives.md", "05 Grundlagen/Wissen/Learnings Creatives.docx"),
    (REPO / "grundlagen/wissen/onboarding.md", "05 Grundlagen/Wissen/Learnings Onboarding.docx"),
    (REPO / "grundlagen/wissen/tech.md", "05 Grundlagen/Wissen/Learnings Technik.docx"),
    # 06 Kfz
    (N / "autowerkstaetten/README.md", "06 Kfz-Betriebe/0 Übersicht.docx"),
    (N / "autowerkstaetten/businessplan.md", "06 Kfz-Betriebe/1 Businessplan.docx"),
    (N / "autowerkstaetten/geschaeftsmodell.md", "06 Kfz-Betriebe/2 Geschäftsmodell und Preise.docx"),
    (N / "autowerkstaetten/nische.md", "06 Kfz-Betriebe/3 Nische und Kundenfilter.docx"),
    (N / "autowerkstaetten/service-module.md", "06 Kfz-Betriebe/4 Service-Module (Baukasten).docx"),
    (N / "autowerkstaetten/recherche-landingpages.md", "06 Kfz-Betriebe/5 Recherche Landingpages.docx"),
    (N / "autowerkstaetten/akquise/verkaufsskript.md", "06 Kfz-Betriebe/Akquise/Verkaufsskript vor Ort.docx"),
    (N / "autowerkstaetten/akquise/angebot-vertrag.md", "06 Kfz-Betriebe/Akquise/Angebot und Vertrag.docx"),
    (N / "autowerkstaetten/akquise/onboarding-email.md", "06 Kfz-Betriebe/Akquise/Willkommens-Mail.docx"),
    (N / "autowerkstaetten/akquise/fahrplan-erster-umsatz.md", "06 Kfz-Betriebe/Akquise/Fahrplan erster Umsatz.docx"),
    (N / "autowerkstaetten/akquise/klienten-leads.csv", "06 Kfz-Betriebe/Akquise/Lead-Liste Kfz-Betriebe.csv"),
    (N / "autowerkstaetten/seiten/pitch", "06 Kfz-Betriebe/Seiten (im Browser öffnen)/Pitch-Seite fürs iPad"),
    (N / "autowerkstaetten/seiten/landingpage", "06 Kfz-Betriebe/Seiten (im Browser öffnen)/Landingpage-Vorlage"),
    (N / "autowerkstaetten/seiten/beispiele", "06 Kfz-Betriebe/Seiten (im Browser öffnen)/Beispiele (Anzeige, Landingpage)"),
    # 07 Küche
    (N / "kuechenstudios", "07 Küchenstudios (zurückgestellt)"),
    # 08 Einzelkunden
    (N / "chinatown/README.md", "08 Einzelkunden/China Restaurant Chinatown/0 Übersicht.docx"),
    (N / "chinatown/flyer/chinatown-faltflyer-A4.pdf", "08 Einzelkunden/China Restaurant Chinatown/Flyer A4 Faltflyer (Druck).pdf"),
    (N / "chinatown/flyer/chinatown-flyer-A5.pdf", "08 Einzelkunden/China Restaurant Chinatown/Flyer A5 (Druck).pdf"),
    (N / "chinatown/vorschau", "08 Einzelkunden/China Restaurant Chinatown/Vorschau (im Browser öffnen)"),
    (N / "chinatown/webseite", "08 Einzelkunden/China Restaurant Chinatown/Webseite (Dateien für Vercel)"),
]

TOP = {
    "01 Anleitung": "Hier anfangen. 8 Schritte vom ersten Anruf bis zur laufenden Kampagne, mit jeder Datei und wo sie liegt.",
    "02 Photovoltaik": "Alles für PV-Kunden in ganz Deutschland: Steckbrief, Akquise, die fertigen Kundenordner, Hintergrund.",
    "03 Verwaltung": "Deine Daten und alle Rechnungen in einer Datei, mit Rechnung zum Drucken.",
    "04 Anleitungen Technik": "Hilfen zum Klicken: Meta-Konto, Meta-Anzeige, Seiten online stellen.",
    "05 Grundlagen": "Das Playbook, nach dem die Agentur arbeitet, und die Learnings.",
    "06 Kfz-Betriebe": "Businessplan, Preise, Service-Baukasten, Verkaufsskript, Vertrag, Pitch- und Landingpage.",
    "07 Küchenstudios (zurückgestellt)": "Vollständig erhalten, falls die Nische wieder aufgegriffen wird.",
    "08 Einzelkunden": "Einzelaufträge außerhalb der Nischen.",
}
NAMEN_MD = {"readme": "Übersicht", "ad-copy": "Anzeigentexte", "offer-und-ads": "Angebot und Anzeigen",
            "geschaeftsmodell": "Geschäftsmodell", "nische": "Nische und Kundenfilter",
            "angebot-vertrag": "Angebot und Vertrag", "besuchs-reihenfolge": "Besuchs-Reihenfolge",
            "erster-kunde-fahrplan": "Erster Kunde Fahrplan", "fahrplan-erster-umsatz": "Fahrplan erster Umsatz",
            "onboarding-email": "Willkommens-Mail", "verkaufsskript": "Verkaufsskript",
            "vereinbarung": "1 Vereinbarung", "abrechnung-mails": "2 Abrechnungs-Mails",
            "willkommens-mail": "3 Willkommens-Mail", "rueckruf-leitfaden": "4 Rückruf-Leitfaden für das Büro",
            "kampagnen": "5 Kampagnen Meta und Google", "report-mail": "6 Monatsreport-Mail",
            "teilnahmebedingungen": "7 Teilnahmebedingungen Verlosung"}
NAMEN_XLSX = {"checkliste": "Checkliste bis zum Livegang", "anfragen-und-report": "Anfragen und Monatsreport"}
ORDNER_NAMEN = {"akquise": "Akquise", "seiten": "Seiten (im Browser öffnen)", "beispiele": "Beispiele",
                "landingpage": "Landingpage-Vorlage", "pitch": "Pitch-Seite fürs iPad"}


def schoen(rel):
    return pathlib.Path(*[ORDNER_NAMEN.get(t, t) for t in rel.parts]) if rel.parts else rel


def docx(quelle, ziel):
    ziel.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(["pandoc", str(quelle), "-f", "gfm", "-o", str(ziel)], check=True)


def ordner(quelle, ziel, umbenennen=True):
    for p in sorted(quelle.rglob("*")):
        if p.is_dir() or p.name.startswith(".") or "tools" in p.relative_to(quelle).parts or p.suffix == ".pyc":
            continue
        rel = p.relative_to(quelle)
        unter = schoen(rel.parent) if umbenennen else rel.parent
        if p.suffix == ".md":
            name = NAMEN_MD.get(p.stem.lower(), p.stem.replace("-", " ").capitalize())
            if p.stem.lower() == "readme" and rel.parent != pathlib.Path("."):
                name = "Anleitung"
            docx(p, ziel / unter / f"{name}.docx")
        else:
            (ziel / unter).mkdir(parents=True, exist_ok=True)
            name = f"{NAMEN_XLSX[p.stem]}.xlsx" if p.suffix == ".xlsx" and p.stem in NAMEN_XLSX else p.name
            shutil.copy2(p, ziel / unter / name)


def kunde(ordner_pv, ziel):
    """Ein PV-Kundenordner in Finder-Form: Übersicht, Steckbrief, Dokumente, Tabellen, Bilder, Seiten, Fotos."""
    docx(ordner_pv / "README.md", ziel / "0 Übersicht (was noch fehlt).docx")
    shutil.copy2(ordner_pv / "steckbrief.xlsx", ziel / "Steckbrief.xlsx")
    for quelle, name in (("dokumente", "Dokumente"), ("tabellen", "Tabellen"), ("anzeigen/creatives", "Anzeigen-Bilder"),
                         ("landingpage", "Landingpages (ganzen Ordner auf Netlify ziehen)"), ("fotos", "Fotos"),
                         ("anzeigen", "Anzeigen-Vorschau (im Browser öffnen)")):
        q = ordner_pv / quelle
        if q.exists():
            ordner(q, ziel / name, umbenennen=False)


def betriebsname(ordner_pv):
    zeile = (ordner_pv / "README.md").read_text(encoding="utf-8").splitlines()[0]
    return zeile.lstrip("# ").strip()


def kunden(ziel_root):
    for k in sorted(p for p in (PV / "kunden").iterdir() if p.is_dir()):
        name = betriebsname(k) + (" (Beispiel, erfunden)" if k.name == "muster-solartechnik" else "")
        kunde(k, ziel_root / "02 Photovoltaik" / "3 Kunden" / name)


def startseite(ziel):
    teile = []
    for top in sorted(TOP):
        dateien = sorted(p for p in (ziel / top).rglob("*") if p.is_file()
                         and not any(s in p.parts for s in ("fonts", "fotos", "assets", "Fotos", "n8n-Workflows"))
                         and p.suffix not in (".json", ".jpg", ".png", ".woff2", ".svg", ".js", ".css")
                         and "Landingpages (ganzen Ordner auf Netlify ziehen)" not in p.parts
                         and "Anzeigen-Vorschau (im Browser öffnen)" not in p.parts)
        zeilen = []
        for p in dateien:
            rel = p.relative_to(ziel)
            unter = " › ".join(rel.parts[1:-1])
            zeilen.append(f'<li><a href="{urllib.parse.quote(str(rel))}">{html.escape(p.stem)}</a>'
                          f'<span>{html.escape(unter + " · " if unter else "")}{p.suffix[1:].upper()}</span></li>')
        teile.append(f'<section><h2>{html.escape(top)}</h2><p>{html.escape(TOP[top])}</p><ul>{"".join(zeilen)}</ul></section>')
    anl = urllib.parse.quote("01 Anleitung/Vom Kunden zur fertigen Kampagne.docx")
    stb = urllib.parse.quote("02 Photovoltaik/1 Steckbrief (für jeden Kunden kopieren).xlsx")
    (ziel / "00 START HIER.html").write_text(f"""<!DOCTYPE html><html lang="de"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1"><title>Clickculture</title><style>
body{{margin:0;background:#F3EFE7;color:#1A1917;font-family:-apple-system,"Helvetica Neue",Arial,sans-serif;line-height:1.5;}}
.w{{max-width:880px;margin:0 auto;padding:40px 24px 80px;}}
h1{{font-size:44px;letter-spacing:-.03em;margin:0;}} .lead{{color:#5E5A52;margin:8px 0 28px;}}
.tipps{{background:#fff;border:1px solid #DDD6C9;border-radius:6px;padding:14px 18px;font-size:14px;color:#3A3732;margin-bottom:12px;}}
.start{{border:2px solid #B4461F;font-size:16px;}} .start ol{{margin:8px 0 0;padding-left:20px;}}
section{{border-top:1px solid #DDD6C9;padding:24px 0 8px;}} h2{{font-size:22px;margin:0 0 4px;}}
section>p{{color:#6B665D;margin:0 0 12px;font-size:15px;}} ul{{list-style:none;padding:0;margin:0;}}
li{{display:flex;justify-content:space-between;gap:16px;padding:7px 0;border-bottom:1px solid #E8E2D6;font-size:15px;}}
a{{color:#1A1917;text-decoration:none;font-weight:600;}} a:hover{{color:#B4461F;}} li span{{color:#8A857B;font-size:13px;text-align:right;}}
</style></head><body><div class="w"><h1>Clickculture</h1>
<p class="lead">Performance-Marketing für lokale Betriebe: Werbung → Anfragen → Aufträge. Alles an einem Ort.</p>
<div class="tipps start"><b>Neuer Kunde? So geht es los:</b><ol>
<li><a href="{anl}" style="color:#B4461F;">01 · Anleitung „Vom Kunden zur fertigen Kampagne“</a> einmal lesen.</li>
<li>Im Videocall den <a href="{stb}" style="color:#B4461F;">Steckbrief</a> ausfüllen.</li>
<li>Steckbrief an Claude: „Lege den Kunden aus diesem Steckbrief an.“ Den fertigen Ordner unter 02 › 3 Kunden ablegen.</li></ol></div>
<div class="tipps">Word-Dateien (DOCX) öffnen sich in Pages oder Word, Tabellen (XLSX) in Numbers oder Excel, Seiten (HTML)
im Browser. In Tabellen gilt: gelb = ausfüllen, alles andere rechnet sich. Das Original liegt im Repo „business“;
diesen Ordner baut <code>werkzeuge/clickculture-ordner-bauen.py</code> jederzeit neu.</div>
{''.join(teile)}</div></body></html>""", encoding="utf-8")


def zippen(ordner_pfad):
    zipdatei = ordner_pfad.parent / f"{ordner_pfad.name}.zip"
    with zipfile.ZipFile(zipdatei, "w", zipfile.ZIP_DEFLATED) as z:
        for p in sorted(ordner_pfad.rglob("*")):
            if p.is_file():
                z.write(p, p.relative_to(ordner_pfad.parent))
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
        z = ziel / rel
        if quelle.is_dir():
            ordner(quelle, z)
        elif quelle.suffix == ".md" and z.suffix == ".docx":
            docx(quelle, z)
        else:
            z.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(quelle, z)
    kunden(ziel)
    (ziel / "05 Grundlagen/Betriebshandbuch (online öffnen).html").write_text(
        '<meta charset="utf-8"><meta http-equiv="refresh" content="0; url=https://claude.ai/artifact/7DSh95Hfrp17kLRnNLXftN">'
        '<a href="https://claude.ai/artifact/7DSh95Hfrp17kLRnNLXftN">Betriebshandbuch öffnen</a>', encoding="utf-8")
    startseite(ziel)
    zippen(ziel)


if __name__ == "__main__":
    main()
