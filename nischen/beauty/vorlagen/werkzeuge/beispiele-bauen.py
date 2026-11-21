#!/usr/bin/env python3
"""Baut die vier erfundenen Beispielstudios (eine je Behandlung) neu, so wie sie aus der Zentrale kämen.

Aufruf (aus dem Repo-Hauptordner): python3 nischen/beauty/vorlagen/werkzeuge/beispiele-bauen.py

Jedes Beispiel ist ein „Text für Claude“, wie ihn die Zentrale schickt (Mail „alles vom Studio da“ bzw. Team-Seite).
Zum Zeigen im Gespräch und zum Probelauf. Alles ist erfunden: Namen, Adressen, Telefonnummern.
Ohne Adresse der Zentrale zeigen die Seiten Beispiel-Termine.
"""
import json
import pathlib
import subprocess
import sys

HIER = pathlib.Path(__file__).resolve().parent
KUNDEN = HIER.parent.parent / "kunden"
GEMEINSAM = dict(typ="clickculture-beauty-studio", anrede="Frau Muster", adresse="Musterweg 1, 12345 Musterstadt", takt=30, absagefrist=24,
                 umkreis=15, impressum="https://example.com/impressum", datenschutz="https://example.com/datenschutz", zentrale="",
                 agentur=dict(name="Clickculture", email="hallo@clickculture.example", telefon="0151 00000001"))
L = lambda *x: [dict(name=n, minuten=m, preis=p) for n, m, p in x]
BEISPIELE = {
    "muster-laserstudio": dict(betrieb="Muster Laserstudio", firma="Muster Laserstudio GmbH", inhaber="Sabine Muster", telefon="0123 4567810",
                               email="termine@muster-laserstudio.example", behandlung="Laser", behandler_art="Kosmetik mit NiSV-Fachkunde",
                               behandler="Sabine Muster, Fachkunde nach NiSV", modus="Kalender", zeiten="Di 9-18; Mi 9-18; Do 9-18; Fr 9-18; Sa 10-14",
                               angebot={"text": "Probeschuss + Hautanalyse gratis", "leistung": "Haut- und Haaranalyse mit Probeschuss"},
                               leistungen=L(("Haut- und Haaranalyse mit Probeschuss", 20, ""), ("Achseln", 20, "ab 59"), ("Bikinizone", 30, "ab 79"),
                                            ("Beine komplett", 60, "ab 199")),
                               ausfall="Bei einer Absage später als 24 Stunden vorher oder wenn Sie nicht kommen, berechnen wir 30 €. Das gilt nicht, wenn Sie "
                                       "nachweisen, dass Sie das Versäumnis nicht zu vertreten haben oder uns kein oder ein geringerer Schaden entstanden ist.",
                               budget=600, betreuer="Max"),
    "muster-brows": dict(betrieb="Muster Brows", firma="Mia Muster", inhaber="Mia Muster", telefon="0123 4567820", email="hallo@muster-brows.example",
                         behandlung="Permanent Make-up", behandler_art="Kosmetik/PMU-Studio", behandler="Mia Muster, PMU-Artist", modus="Wunschtermin",
                         zeiten="Di 10-16; Do 10-16; Sa 10-14", absagefrist=48,
                         angebot={"text": "Powder Brows 349 € statt 390 €", "leistung": "Powder Brows inkl. Nachstechen", "normal": "390 €"},
                         leistungen=L(("Beratung mit Vorzeichnen", 30, ""), ("Powder Brows inkl. Nachstechen", 150, "390"),
                                      ("Lippen Aquarell inkl. Nachstechen", 150, "450")), budget=400, betreuer="Tom"),
    "muster-aesthetik": dict(betrieb="Muster Ästhetik", firma="Dr. med. Lena Muster", anrede="Frau Dr. Muster", inhaber="Dr. Lena Muster",
                             telefon="0123 4567830", email="praxis@muster-aesthetik.example", behandlung="Faltenbehandlung", behandler_art="Arzt/Ärztin",
                             behandler="Dr. med. Lena Muster, Fachärztin für Dermatologie", modus="Kalender", zeiten="Mo 9-12 14-17; Di 9-12 14-17; Mi 9-12; Do 9-12 14-17",
                             angebot={"text": "Persönliche Beratung, 20 Minuten", "leistung": "Beratungsgespräch Faltenbehandlung"},
                             leistungen=L(("Beratungsgespräch Faltenbehandlung", 20, "")), budget=850, betreuer="Max"),
    "muster-zahnarztpraxis": dict(betrieb="Muster Zahnarztpraxis", firma="Zahnarztpraxis Dr. Paul Muster", anrede="Herr Dr. Muster", inhaber="Dr. Paul Muster",
                                  telefon="0123 4567840", email="praxis@muster-zahnarzt.example", behandlung="Bleaching", behandler_art="Zahnarztpraxis",
                                  behandler="Dr. med. dent. Paul Muster, Zahnarzt", modus="Kalender", zeiten="Mo 8-17; Di 8-17; Mi 8-17; Do 8-17; Fr 8-12",
                                  angebot={"text": "Erstgespräch zur Zahnaufhellung", "leistung": "Erstgespräch Zahnaufhellung"},
                                  leistungen=L(("Erstgespräch Zahnaufhellung", 20, ""), ("Bleaching in der Praxis", 90, "ab 350")), budget=600, betreuer="Tom"),
}


def main():
    for kuerzel, werte in BEISPIELE.items():
        ziel = KUNDEN / kuerzel
        ziel.mkdir(parents=True, exist_ok=True)
        d = {**GEMEINSAM, **werte, "kuerzel": kuerzel, "seite": f"https://{kuerzel}.netlify.app"}
        quelle = ziel / "daten.json"
        quelle.write_text(json.dumps(d, ensure_ascii=False, indent=1), encoding="utf-8")
        subprocess.run([sys.executable, str(HIER / "kunde-anlegen.py"), str(quelle)], check=True)
        print()


if __name__ == "__main__":
    main()
