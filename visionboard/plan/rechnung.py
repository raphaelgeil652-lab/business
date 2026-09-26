"""Geldrechnung für den Plan bis 30.

Rechnet Monat für Monat von Oktober 2026 bis April 2038 in drei Szenarien
(vorsichtig, plan, stark). Alle Annahmen stehen oben in SZENARIEN und sind
im PDF offen aufgelistet. Ausgabe: rechnung.json (Zahlen für den Plan) und
geldpfad.svg (Vermögenskurve, maßstabsgetreu).

Aufruf:  python3 rechnung.py
"""
import json
from pathlib import Path

HIER = Path(__file__).parent

# ---------------------------------------------------------------------------
# Annahmen. Beträge in Euro pro Monat, wenn nicht anders angegeben.
# ---------------------------------------------------------------------------
GEMEINSAM = {
    "start_vermoegen": 0,          # was heute schon da ist (im PDF als Feld zum Eintragen)
    "sold_netto": 2250,            # 2.600 € brutto, Lohnsteuer abgezogen (Quelle: Bundeswehr, Steuerrechner)
    "steuer_erstattung_2026": 1050,  # Lohnsteuer Okt-Dez 2026 kommt zurück (unter Grundfreibetrag)
    "onboarding_gebuehr": 700,     # Clickculture-Preis Kfz, einmalig je Kunde
    "retainer": 999,               # Clickculture-Preis Kfz, je Kunde und Monat
    "tools_business": 60,          # Software, Domain, Kleinkram
    "april_ausgaben": 400,
    "gesellen_netto": 2200,
    "meisterbonus": 3000,          # Bayern, bei bestandener Meisterprüfung
    "meister_eigenanteil": 1500,   # Laptop, Lernmaterial, halbes Meisterstück-Material (Rest trägt AFBG)
    "azubi_brutto": [1050, 1130, 1260],  # SHK Bayern: 1. Jahr, 2. Jahr, 3. Jahr (Tarif 2025 + ~3 %/Jahr)
    "porsche": 85000,              # gebrauchter 911 (991.2 Carrera)
}

SZENARIEN = {
    "vorsichtig": {
        "ausgaben_kaserne": 750,
        "kunden_reise": [0, 0, 1, 1, 1],   # Kunden April..August 2027
        "onboarding_april": 1,
        "kunden_ausbildung": 1,
        "reisekosten": 10500,
        "ausgaben_ausbildung": 950,
        "steuer_business": 0.15,
        "zins_tagesgeld": 0.02,
        "rendite_etf": 0.05,
        "etf_anteil_vorher": 0.2,
        "unterhalt_meister": 500,       # Aufstiegs-BAföG, weil Vermögen unter 45.000 €
        "kaufpreis": 150000,
        "eigenkapital": 30000,
        "kreditzins": 0.065,
        "umsatz_start": 700000,
        "wachstum": 0.06,
        "marge_start": 0.05, "marge_ende": 0.06,
        "multiplikator": 3.5,
        "gf_netto_start": 3500, "gf_steigerung": 0.05,
        "privat_ausgaben": 2200,
    },
    "plan": {
        "ausgaben_kaserne": 650,
        "kunden_reise": [0, 2, 2, 2, 2],
        "onboarding_april": 2,
        "kunden_ausbildung": 2,
        "reisekosten": 9100,
        "ausgaben_ausbildung": 870,
        "steuer_business": 0.22,
        "zins_tagesgeld": 0.025,
        "rendite_etf": 0.06,
        "etf_anteil_vorher": 0.2,
        "unterhalt_meister": 0,
        "kaufpreis": 250000,
        "eigenkapital": 50000,
        "kreditzins": 0.055,
        "umsatz_start": 1000000,
        "wachstum": 0.15,
        "marge_start": 0.07, "marge_ende": 0.09,
        "multiplikator": 4.0,
        "gf_netto_start": 4000, "gf_steigerung": 0.07,
        "privat_ausgaben": 2200,
    },
    "stark": {
        "ausgaben_kaserne": 550,
        "kunden_reise": [0, 3, 3, 3, 3],
        "onboarding_april": 3,
        "kunden_ausbildung": 3,
        "reisekosten": 9100,
        "ausgaben_ausbildung": 820,
        "steuer_business": 0.28,
        "zins_tagesgeld": 0.025,
        "rendite_etf": 0.07,
        "etf_anteil_vorher": 0.2,
        "unterhalt_meister": 0,
        "kaufpreis": 350000,
        "eigenkapital": 90000,
        "kreditzins": 0.05,
        "umsatz_start": 1300000,
        "wachstum": 0.20,
        "marge_start": 0.08, "marge_ende": 0.11,
        "multiplikator": 4.5,
        "gf_netto_start": 4500, "gf_steigerung": 0.08,
        "privat_ausgaben": 2400,
    },
}

AZUBI_NETTO_QUOTE = 0.79   # Sozialabgaben ca. 21 %, Lohnsteuer bei dieser Höhe ~0
KREDIT_JAHRE = 10          # KfW ERP-Förderkredit 077: 10 Jahre, davon 2 tilgungsfrei
STEUER_FIRMA = 0.27        # GmbH: Körperschaft- + Gewerbesteuer, sinkt ab 2028 schrittweise auf ~25 %


def monate():
    j, m = 2026, 10
    while (j, m) <= (2038, 4):
        yield j, m
        m += 1
        if m == 13:
            j, m = j + 1, 1


def phase(j, m):
    t = (j, m)
    if t <= (2027, 3):
        return "kaserne"
    if t == (2027, 4):
        return "april"
    if t <= (2027, 8):
        return "reise"
    if t <= (2030, 2):
        return "ausbildung"
    if t <= (2030, 8):
        return "geselle"
    if t <= (2031, 9):
        return "meister"
    return "betrieb"


def annuitaet(betrag, zins, jahre):
    i = zins / 12
    n = jahre * 12
    return betrag * i / (1 - (1 + i) ** -n)


def rechne(name):
    s = {**GEMEINSAM, **SZENARIEN[name]}
    tg = float(s["start_vermoegen"])   # Tagesgeld: Notgroschen + Übernahme-Topf
    etf = 0.0
    kredit = 0.0
    rate = 0.0
    firma_cash = 0.0
    umsatz = marge = gf = 0.0
    ausgaben_privat = s["privat_ausgaben"]
    verlauf = []
    phasen_ende = {}
    reise_monatlich = s["reisekosten"] / 5  # April bis August
    ausbildung_monat = 0
    betrieb_monat = 0

    for j, m in monate():
        p = phase(j, m)
        einnahmen = ausgaben = business = 0.0

        if p == "kaserne":
            einnahmen = s["sold_netto"]
            ausgaben = s["ausgaben_kaserne"]
        elif p == "april":
            ausgaben = s["april_ausgaben"] + reise_monatlich
            business = s["onboarding_april"] * s["onboarding_gebuehr"]
        elif p == "reise":
            kunden = s["kunden_reise"][m - 4]
            business = kunden * s["retainer"] - (s["tools_business"] if kunden else 0)
            ausgaben = reise_monatlich
            if (j, m) == (2027, 5):
                einnahmen += s["steuer_erstattung_2026"]
        elif p in ("ausbildung", "geselle", "meister"):
            business = s["kunden_ausbildung"] * s["retainer"] - s["tools_business"]
            if p == "ausbildung":
                lj = min(ausbildung_monat // 12, 2)
                einnahmen = s["azubi_brutto"][lj] * AZUBI_NETTO_QUOTE
                ausgaben = s["ausgaben_ausbildung"]
                ausbildung_monat += 1
            elif p == "geselle":
                einnahmen = s["gesellen_netto"]
                ausgaben = s["ausgaben_ausbildung"] + 100
            else:  # Meisterschule Vollzeit, Kurs und Prüfung trägt das Aufstiegs-BAföG
                einnahmen = s["unterhalt_meister"] if m != 9 or j != 2031 else 0
                ausgaben = s["ausgaben_ausbildung"] + 100
                if (j, m) == (2030, 9):
                    ausgaben += s["meister_eigenanteil"]
                if (j, m) == (2031, 8):
                    einnahmen += s["meisterbonus"]
        if business > 0:
            business *= (1 - s["steuer_business"])

        if p != "betrieb":
            sparen = einnahmen + business - ausgaben
            if sparen > 0:
                etf += sparen * s["etf_anteil_vorher"]
                tg += sparen * (1 - s["etf_anteil_vorher"])
            else:
                tg += sparen
        else:
            if betrieb_monat == 0:
                # Übernahme am 1. Oktober 2031
                tg -= s["eigenkapital"]
                kredit = s["kaufpreis"] - s["eigenkapital"]
                rate = annuitaet(kredit, s["kreditzins"], KREDIT_JAHRE - 2)
                umsatz = s["umsatz_start"]
                gf = s["gf_netto_start"]
            betrieb_monat += 1
            if m == 1 and j > 2032:
                umsatz *= 1 + s["wachstum"]
                gf *= 1 + s["gf_steigerung"]
                ausgaben_privat *= 1.03
            anteil = min(betrieb_monat / 79, 1)
            marge = s["marge_start"] + (s["marge_ende"] - s["marge_start"]) * anteil
            ebit_monat = umsatz * marge / 12
            zins = kredit * s["kreditzins"] / 12
            tilgung = 0.0 if betrieb_monat <= 24 else min(rate - zins, kredit)
            kredit -= tilgung
            frei = (ebit_monat - zins) * (1 - STEUER_FIRMA) - tilgung
            firma_cash += frei * 0.5  # die andere Hälfte geht ins Wachstum (Autos, Leute, Werkzeug)
            sparen = gf - ausgaben_privat
            etf += sparen * 0.8
            tg += sparen * 0.2

        # Zinsen (nach Abgeltungsteuer grob) und Rendite
        if tg > 0:
            tg *= 1 + s["zins_tagesgeld"] * 0.75 / 12
        etf *= 1 + s["rendite_etf"] / 12
        firma_cash *= 1 + 0.01 / 12

        firmenwert = s["multiplikator"] * umsatz * marge if p == "betrieb" else 0.0
        vermoegen = tg + etf + firmenwert + firma_cash - kredit
        verlauf.append({
            "monat": f"{j}-{m:02d}", "phase": p,
            "tagesgeld": round(tg), "etf": round(etf),
            "firmenwert": round(firmenwert), "firma_cash": round(firma_cash),
            "kredit": round(kredit), "vermoegen": round(vermoegen),
            "umsatz": round(umsatz), "gewinn": round(umsatz * marge),
            "privat": round(tg + etf),
        })
        phasen_ende[p] = verlauf[-1]

    ende = verlauf[-1]
    return {
        "annahmen": s,
        "verlauf": verlauf,
        "phasen_ende": phasen_ende,
        "ende": ende,
        "nach_porsche": ende["vermoegen"] - s["porsche"],
        "kreditrate": round(rate),
        "zinsrate_anfang": round((s["kaufpreis"] - s["eigenkapital"]) * s["kreditzins"] / 12),
    }


def svg_kurve(ergebnisse, breite=720, hoehe=300):
    """Vermögenskurve aller Szenarien. y linear, eine Skala für alles."""
    rand_l, rand_r, rand_o, rand_u = 58, 16, 16, 30
    w = breite - rand_l - rand_r
    h = hoehe - rand_o - rand_u
    alle = [v["vermoegen"] for e in ergebnisse.values() for v in e["verlauf"]]
    ymax = 2_500_000 if max(alle) > 2_000_000 else 1_500_000
    ymin = min(0, min(alle))
    n = len(next(iter(ergebnisse.values()))["verlauf"])

    def x(i):
        return rand_l + w * i / (n - 1)

    def y(v):
        return rand_o + h * (1 - (v - ymin) / (ymax - ymin))

    farben = {"vorsichtig": "var(--k-vorsichtig)", "plan": "var(--k-plan)", "stark": "var(--k-stark)"}
    teile = [f'<svg viewBox="0 0 {breite} {hoehe}" class="kurve" role="img" aria-label="Vermögensverlauf 2026 bis 2038 in drei Szenarien">']
    schritt = 500_000
    wert = 0
    while wert <= ymax:
        yy = y(wert)
        teile.append(f'<line x1="{rand_l}" x2="{breite - rand_r}" y1="{yy:.1f}" y2="{yy:.1f}" class="gitter"/>')
        label = "0 €" if wert == 0 else f"{wert / 1_000_000:.1f} Mio. €".replace(".", ",")
        teile.append(f'<text x="{rand_l - 8}" y="{yy + 3.5:.1f}" class="achse" text-anchor="end">{label}</text>')
        wert += schritt
    # Millionen-Linie
    teile.append(f'<line x1="{rand_l}" x2="{breite - rand_r}" y1="{y(1_000_000):.1f}" y2="{y(1_000_000):.1f}" class="million"/>')
    verlauf = next(iter(ergebnisse.values()))["verlauf"]
    for i, v in enumerate(verlauf):
        if v["monat"].endswith("-01"):
            jahr = v["monat"][:4]
            teile.append(f'<text x="{x(i):.1f}" y="{hoehe - 10}" class="achse" text-anchor="middle">{jahr[2:]}</text>')
    # Übernahme-Markierung
    for i, v in enumerate(verlauf):
        if v["monat"] == "2031-10":
            teile.append(f'<line x1="{x(i):.1f}" x2="{x(i):.1f}" y1="{rand_o}" y2="{rand_o + h}" class="marke"/>')
            teile.append(f'<text x="{x(i) + 5:.1f}" y="{rand_o + 10}" class="achse">Übernahme</text>')
    for name, e in ergebnisse.items():
        pkt = " ".join(f"{x(i):.1f},{y(v['vermoegen']):.1f}" for i, v in enumerate(e["verlauf"]))
        teile.append(f'<polyline points="{pkt}" fill="none" style="stroke:{farben[name]}" stroke-width="{2.6 if name == "plan" else 1.8}" stroke-linejoin="round"/>')
        letzte = e["verlauf"][-1]
        teile.append(f'<circle cx="{x(n - 1):.1f}" cy="{y(letzte["vermoegen"]):.1f}" r="3.5" style="fill:{farben[name]}"/>')
    teile.append("</svg>")
    return "\n".join(teile)


def svg_frueh(ergebnisse, breite=720, hoehe=220):
    """Die ersten fünf Jahre vergrößert (bis zur Übernahme), damit man die Sparphase sieht."""
    rand_l, rand_r, rand_o, rand_u = 58, 16, 14, 28
    w = breite - rand_l - rand_r
    h = hoehe - rand_o - rand_u
    stuecke = {k: [v for v in e["verlauf"] if v["monat"] <= "2031-09"] for k, e in ergebnisse.items()}
    n = len(stuecke["plan"])
    ymax = 150_000
    farben = {"vorsichtig": "var(--k-vorsichtig)", "plan": "var(--k-plan)", "stark": "var(--k-stark)"}

    def x(i):
        return rand_l + w * i / (n - 1)

    def y(v):
        return rand_o + h * (1 - v / ymax)

    teile = [f'<svg viewBox="0 0 {breite} {hoehe}" class="kurve" role="img" aria-label="Ersparnis bis zur Übernahme">']
    for wert in range(0, ymax + 1, 25_000):
        teile.append(f'<line x1="{rand_l}" x2="{breite - rand_r}" y1="{y(wert):.1f}" y2="{y(wert):.1f}" class="gitter"/>')
        teile.append(f'<text x="{rand_l - 8}" y="{y(wert) + 3.5:.1f}" class="achse" text-anchor="end">{wert // 1000} T€</text>')
    for i, v in enumerate(stuecke["plan"]):
        if v["monat"].endswith("-01"):
            teile.append(f'<text x="{x(i):.1f}" y="{hoehe - 9}" class="achse" text-anchor="middle">{v["monat"][:4]}</text>')
    for name, st in stuecke.items():
        pkt = " ".join(f"{x(i):.1f},{y(max(v['vermoegen'], 0)):.1f}" for i, v in enumerate(st))
        teile.append(f'<polyline points="{pkt}" fill="none" style="stroke:{farben[name]}" stroke-width="{2.6 if name == "plan" else 1.8}" stroke-linejoin="round"/>')
    teile.append("</svg>")
    return "\n".join(teile)


if __name__ == "__main__":
    ergebnisse = {name: rechne(name) for name in SZENARIEN}
    (HIER / "rechnung.json").write_text(json.dumps(ergebnisse, ensure_ascii=False, indent=1))
    (HIER / "geldpfad.svg").write_text(svg_kurve(ergebnisse))
    (HIER / "geldpfad-frueh.svg").write_text(svg_frueh(ergebnisse))
    for name, e in ergebnisse.items():
        pe = e["phasen_ende"]
        print(f"{name:11s}", " | ".join(f"{p}: {pe[p]['vermoegen']:>9,}" for p in pe),
              f"| Rate {e['kreditrate']} | Ende {e['ende']['vermoegen']:,} | nach Porsche {e['nach_porsche']:,}")
