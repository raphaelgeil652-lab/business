#!/usr/bin/env python3
"""Baut die vier erfundenen Beispielkunden (eine je Behandlung) aus der leeren Steckbrief-Vorlage neu.

Aufruf (aus dem Repo-Hauptordner): python3 nischen/beauty/vorlagen/werkzeuge/beispiele-bauen.py

Sie dienen zum Zeigen im Gespräch („03 Gespräch › Beispiele“) und zum Probelauf. Alles ist erfunden: Namen,
Adressen, Telefonnummern. Ohne Web-App-Adresse der Zentrale zeigen die Seiten Beispiel-Termine.
"""
import datetime as dt
import pathlib
import subprocess
import sys

from openpyxl import load_workbook

HIER = pathlib.Path(__file__).resolve().parent
VORLAGE = HIER.parent / "tabellen" / "01-steckbrief.xlsx"
KUNDEN = HIER.parent.parent / "kunden"
GEMEINSAM = dict(anrede="Frau", ort="Musterstadt", umkreis_km=15, strasse="Musterweg 1", plz="12345", check_entscheider="Ja",
                 check_qualifikation="Ja", check_kalender="Ja", check_fotos="Ja", onboarding_preis=700, retainer=899,
                 drive_link="https://drive.google.com/drive/folders/BEISPIEL", buchbare_zeiten="Di-Fr 9-18; Sa 10-14",
                 absagefrist_stunden=24, vorbereitung_ok="Ja", impressum_url="https://example.com/impressum",
                 datenschutz_url="https://example.com/datenschutz")
BEISPIELE = {
    "muster-laserstudio": dict(betrieb="Muster Laserstudio", inhaber="Sabine Muster", telefon="0123 4567810", email="termine@muster-laserstudio.example",
                               behandlung="Laser", behandler="Kosmetik mit NiSV-Fachkunde", kundenwert=900, termine_woche=4,
                               betrieb_lang="Muster Laserstudio GmbH", oeffnungszeiten="Di–Fr 9–19 Uhr, Sa 9–14 Uhr", budget_meta=450, budget_google=150,
                               buchung_modus="Kalender", kalender_id="termine@muster-laserstudio.example", beratung_minuten=20,
                               leistungen="Achseln | 20 | ab 59 €; Bikinizone | 30 | ab 79 €; Beine komplett | 60 | ab 199 €", puffer_minuten=10,
                               ausfallgebuehr=30, behandler_name="Sabine Muster, Fachkunde nach NiSV",
                               bewertung_1="„Super nette Beratung, der Probeschuss hat mir die Angst genommen.“ — Lea",
                               bewertung_2="„Nach der vierten Sitzung kaum noch Haare an den Beinen. Klare Empfehlung.“ — Nina",
                               verlosung_aktiv="Ja", gewinn="ein Laser-Paket Achseln (6 Sitzungen)",
                               aktion_ende=dt.datetime(2027, 1, 31), ziehung=dt.datetime(2027, 2, 2)),
    "muster-brows": dict(betrieb="Muster Brows", inhaber="Mia Muster", telefon="0123 4567820", email="hallo@muster-brows.example",
                         behandlung="Permanent Make-up", behandler="Kosmetik/PMU-Studio", kundenwert=420, termine_woche=3,
                         betrieb_lang="Mia Muster", oeffnungszeiten="Di–Sa nach Vereinbarung", retainer=499, onboarding_preis=450,
                         budget_meta=300, budget_google=100, buchung_modus="Wunschtermin", buchbare_zeiten="Di, Do 10-16; Sa 10-14",
                         beratung_minuten=30, leistungen="Powder Brows | 150 | 390 € inkl. Nachstechen; Lippen Aquarell | 150 | 450 € inkl. Nachstechen",
                         absagefrist_stunden=48, behandler_name="Mia Muster, PMU-Artist"),
    "muster-aesthetik": dict(betrieb="Muster Ästhetik", anrede="Frau", inhaber="Dr. Lena Muster", telefon="0123 4567830",
                             email="praxis@muster-aesthetik.example", behandlung="Faltenbehandlung", behandler="Arzt/Ärztin", kundenwert=900,
                             termine_woche=4, betrieb_lang="Dr. med. Lena Muster", oeffnungszeiten="Mo–Fr 8–18 Uhr", budget_meta=550, budget_google=300,
                             buchung_modus="Kalender", kalender_id="praxis@muster-aesthetik.example", buchbare_zeiten="Mo-Fr 9-12 14-17",
                             beratung_minuten=20, behandler_name="Dr. med. Lena Muster, Fachärztin für Dermatologie"),
    "muster-zahnarztpraxis": dict(betrieb="Muster Zahnarztpraxis", anrede="Herr", inhaber="Dr. Paul Muster", telefon="0123 4567840",
                                  email="praxis@muster-zahnarzt.example", behandlung="Bleaching", behandler="Zahnarztpraxis", kundenwert=450,
                                  termine_woche=3, betrieb_lang="Zahnarztpraxis Dr. Paul Muster", oeffnungszeiten="Mo–Do 8–18 Uhr, Fr 8–13 Uhr",
                                  retainer=699, onboarding_preis=650, budget_meta=350, budget_google=250, buchung_modus="Kalender",
                                  kalender_id="praxis@muster-zahnarzt.example", buchbare_zeiten="Mo-Do 8-17; Fr 8-12", beratung_minuten=20,
                                  leistungen="Bleaching in der Praxis | 90 | ab 350 €", behandler_name="Dr. med. dent. Paul Muster, Zahnarzt"),
}


def main():
    for kuerzel, werte in BEISPIELE.items():
        wb = load_workbook(VORLAGE)
        ws = wb["Steckbrief"]
        zeilen = {ws.cell(r, 1).value: r for r in range(1, ws.max_row + 1)}
        for k, v in {**GEMEINSAM, **werte}.items():
            ws.cell(zeilen[k], 3).value = v
        dd = wb["Deine Daten"]
        dz = {dd.cell(r, 1).value: r for r in range(1, dd.max_row + 1)}
        dd.cell(dz["agentur_name"], 3).value = "Clickculture"
        ziel = KUNDEN / kuerzel
        ziel.mkdir(parents=True, exist_ok=True)
        wb.save(ziel / "steckbrief.xlsx")
        subprocess.run([sys.executable, str(HIER / "kunde-anlegen.py"), str(ziel / "steckbrief.xlsx")], check=True)
        print()


if __name__ == "__main__":
    main()
