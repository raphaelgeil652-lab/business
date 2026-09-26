"""Baut den Plan bis 30 als HTML (plan.html) aus rechnung.json.

Reihenfolge:  python3 rechnung.py  →  python3 bauen.py  →  node pdf.js
"""
import json
from pathlib import Path

HIER = Path(__file__).parent
R = json.loads((HIER / "rechnung.json").read_text())
P, V, S = R["plan"], R["vorsichtig"], R["stark"]
A = P["annahmen"]


def eur(x, z=False):
    t = f"{round(x):,}".replace(",", ".")
    return f"{'+' if z and x > 0 else ''}{t} €"


def mio(x):
    return f"{x / 1_000_000:.2f}".replace(".", ",") + " Mio. €"


def tk(x):
    """Tausender kurz: 84.896 → 85.000 €"""
    return eur(round(x, -3))


def stand(e, monat):
    return next(v for v in e["verlauf"] if v["monat"] == monat)


def tabelle(kopf, zeilen, rechts_ab=1, summe=None, notiz=None, minus=()):
    h = ["<table><thead><tr>"]
    for i, k in enumerate(kopf):
        h.append(f'<th class="{"r" if i >= rechts_ab else ""}">{k}</th>')
    h.append("</tr></thead><tbody>")
    for n, z in enumerate(zeilen):
        cls = ' class="minus"' if n in minus else ""
        h.append(f"<tr{cls}>" + "".join(
            f'<td class="{"r" if i >= rechts_ab else ""}">{c}</td>' for i, c in enumerate(z)) + "</tr>")
    if summe:
        h.append('<tr class="summe">' + "".join(
            f'<td class="{"r" if i >= rechts_ab else ""}">{c}</td>' for i, c in enumerate(summe)) + "</tr>")
    h.append("</tbody></table>")
    if notiz:
        h.append(f'<p class="tabelle-notiz">{notiz}</p>')
    return "".join(h)


def schritte(liste):
    return '<ol class="schritte">' + "".join(
        f'<li><span class="wann">{w}</span><span class="was"><b>{t}</b>{f"<span>{d}</span>" if d else ""}</span></li>'
        for w, t, d in liste) + "</ol>"


def kasten(art, titel, punkte):
    return f'<div class="kasten {art}"><h4>{titel}</h4><ul>' + "".join(f"<li>{p}</li>" for p in punkte) + "</ul></div>"


def kopf(nr, titel, wann, bild, farbe, pos="50% 50%"):
    return f'''<div class="kopf" style="--farbe: var({farbe})">
  <div><div class="nr">{nr}</div><h2>{titel}</h2><div class="wann mono">{wann}</div></div>
  <div class="bild"><img src="../bilder/{bild}" alt="" style="object-position:{pos}"></div>
</div>'''


# ---------------------------------------------------------------------------
# Kennzahlen aus der Rechnung
# ---------------------------------------------------------------------------
pe = P["phasen_ende"]
k_kaserne = pe["kaserne"]["vermoegen"]
k_reise = pe["reise"]["vermoegen"]
k_ausb = pe["ausbildung"]["vermoegen"]
k_ges = pe["geselle"]["vermoegen"]
k_meister = pe["meister"]["vermoegen"]
ende = P["ende"]
privat_nach_kauf = stand(P, "2031-10")["privat"]

azubi_netto = [round(b * 0.79) for b in A["azubi_brutto"]]
biz_netto_monat = (A["kunden_ausbildung"] * A["retainer"] - A["tools_business"]) * (1 - A["steuer_business"])
reise_biz = 4 * (2 * A["retainer"] - A["tools_business"]) * (1 - A["steuer_business"])
onb = A["onboarding_april"] * A["onboarding_gebuehr"] * (1 - A["steuer_business"])

jahre = []
for j in range(2026, 2039):
    monat = f"{j}-12" if j < 2038 else "2038-04"
    jahre.append((j, monat))

# ---------------------------------------------------------------------------
html = []
add = html.append

add('''<!doctype html><html lang="de"><head><meta charset="utf-8"><title>Der Plan bis 30</title>
<link rel="stylesheet" href="stil.css"></head><body>''')

# ---------- Titelseite ----------
add(f'''<section class="titelseite">
<img src="../bilder/00-gipfel.jpg" alt="">
<div class="titel-inhalt">
  <div class="titel-kopf mono"><span>Der Plan bis 30</span><span>Stand 26.09.2026</span></div>
  <div>
    <h1>Der Plan<br>bis <span class="g">30</span></h1>
    <p class="titel-unter">Schritt für Schritt vom Abi bis zum eigenen Betrieb, der ersten Million und dem ersten Porsche. Mit allen Zahlen.</p>
    <div class="titel-zahlen">
      <div><b>{tk(k_kaserne + A["steuer_erstattung_2026"])}</b><span>gespart nach der Kaserne, inklusive Steuer zurück</span></div>
      <div><b>{tk(k_meister)}</b><span>auf dem Konto, wenn du Meister bist (Herbst 2031)</span></div>
      <div><b>{tk(A["kaufpreis"])}</b><span>Kaufpreis für deinen ersten Betrieb, mit 23</span></div>
      <div><b>{mio(ende["vermoegen"])}</b><span>Vermögen am 15.04.2038, im Plan-Szenario</span></div>
    </div>
    <p class="titel-hinweis">Alle Zahlen sind gerechnet, nicht geraten: Monat für Monat, in drei Szenarien, mit Quellen am Ende. Sie sind trotzdem ein Plan und keine Garantie. Einmal im Jahr, an deinem Geburtstag, prüfst du sie und passt sie an.</p>
  </div>
</div>
</section>''')

# ---------- Auf einen Blick ----------
phasen = [
    ("01", "Kaserne", "01.10.2026 – 31.03.2027", "18", "Durchziehen und jeden Monat 1.600 € sparen", k_kaserne, "--c-kaserne"),
    ("02", "April: Kunden holen", "01.04. – 13.04.2027", "18 → 19", "Zwei Kunden unterschreiben, bevor du fliegst", pe["april"]["vermoegen"], "--c-dubai"),
    ("03", "Dubai und Asien", "14.04. – 31.08.2027", "19", "Trainieren, Kontakte, Business läuft mit", k_reise, "--c-asien"),
    ("04", "Ausbildung SHK", "09/2027 – 02/2030", "19 – 21", "Verkürzt auf 30 Monate, zuhause wohnen, sparen", k_ausb, "--c-ausbildung"),
    ("05", "Geselle und Meister", "03/2030 – 09/2031", "21 – 23", "Meisterbrief, fast ohne eigene Kosten", k_meister, "--c-meister"),
    ("06", "Betrieb übernehmen", "Oktober 2031", "23", f"Kaufpreis {tk(A['kaufpreis'])}, {tk(A['eigenkapital'])} Eigenkapital", privat_nach_kauf, "--c-betrieb"),
    ("07", "Wachsen, dann Schweiz", "2032 – 2038", "24 – 29", "Jedes Jahr 15 % mehr Umsatz, ab 2034 Schweiz", stand(P, "2037-12")["vermoegen"], "--c-schweiz"),
    ("08", "Mit 30", "15.04.2038", "30", "Nettovermögen über 1 Mio. €, Porsche bar bezahlt", ende["vermoegen"], "--c-ziel"),
]
add('<section class="kapitel"><div class="kopf" style="--farbe: var(--tinte); grid-template-columns: 1fr"><div><div class="etikett">Auf einen Blick</div><h2>Acht Etappen, ein Ziel</h2></div></div>')
add('<p class="ziel-satz">Das hier ist dein ganzer Weg auf einer Seite. Rechts steht, was du am Ende jeder Etappe besitzt, wenn du dich an den Plan hältst. Ab Etappe 06 zählt dein Betrieb mit dazu.</p>')
add('<div class="phasen">')
for nr, t, zeit, alter, ziel, geld, farbe in phasen:
    add(f'<div style="--farbe: var({farbe})"><span class="p-nr">{nr}</span><span><span class="p-titel">{t}</span><br><span class="p-zeit">{zeit} · {alter} J.</span></span><span>{ziel}</span><span class="p-geld">{eur(geld)}</span></div>')
add('</div>')
add('<p class="grosser-satz">Sparen bringt dich zum Betrieb.<br>Der Betrieb bringt dich zur Million.</p>')
add('''<div class="zwei">
<div>
<h3>Die drei Hebel</h3>
<p><b>1. Die Sparquote bis 23.</b> Du wohnst zuhause, verdienst nebenbei mit Meta Ads und gibst wenig aus. So kommen bis zum Meister rund {m} zusammen. Das ist dein Eintrittsgeld für einen Betrieb.</p>
<p><b>2. Der Betrieb ab 23.</b> Ein Handwerksbetrieb mit 1 Mio. € Umsatz ist heute etwa {kp} wert. Wächst er auf 2,3 Mio. €, ist er über 800.000 € wert. Kein Sparplan der Welt schafft das in sieben Jahren.</p>
<p><b>3. Dein Vorteil: Werbung.</b> Die meisten Handwerksbetriebe finden weder Kunden noch Leute. Du kannst beides mit Meta Ads. Das ist der Grund, warum dein Betrieb schneller wächst als der Durchschnitt.</p>
</div>
<div>
<h3>So liest du den Plan</h3>
<p>Jede Etappe hat vier Teile: <b>die Schritte</b> mit Datum zum Abhaken, <b>das Geld</b> als Tabelle, <b>die Tipps</b> fürs Sparen und Anlegen und <b>den Plan B</b>, falls etwas schiefgeht.</p>
<p>Gerechnet ist alles in drei Szenarien: <b>vorsichtig</b> (vieles läuft zäh), <b>Plan</b> (du ziehst durch, es läuft normal) und <b>stark</b> (es läuft richtig gut). Im Text stehen die Plan-Zahlen.</p>
<p>Zahlen mit einem Stern (*) sind von heute aus geschätzt, zum Beispiel Löhne im Jahr 2029. Alles andere ist mit Quelle belegt, siehe letzte Seite.</p>
</div>
</div>'''.format(m=tk(k_meister), kp=tk(A["kaufpreis"])))
add('</section>')

# ---------- Geldpfad ----------
kurve = (HIER / "geldpfad.svg").read_text()
frueh = (HIER / "geldpfad-frueh.svg").read_text()
add('<section class="kapitel"><div class="kopf" style="--farbe: var(--morgenrot); grid-template-columns: 1fr"><div><div class="etikett">Die Rechnung</div><h2>Dein Geldpfad bis 2038</h2></div></div>')
add(f'<p class="ziel-satz">Die Kurven zeigen dein Nettovermögen: alles, was dir gehört, minus alle Schulden. Die gestrichelte Linie ist die Million. Ab Oktober 2031 zählt der Wert deines Betriebs mit.</p>')
add(kurve)
add('<div class="legende"><span><i style="--f: var(--k-vorsichtig)"></i>vorsichtig</span><span><i style="--f: var(--k-plan)"></i>Plan</span><span><i style="--f: var(--k-stark)"></i>stark</span><span><i style="--f: var(--gold); height:.4mm"></i>1 Mio. €</span></div>')
add(f'''<div class="zahlen" style="margin-top:5mm">
<div><b>{mio(V["ende"]["vermoegen"])}</b><span>vorsichtig: kleiner Betrieb, 6 % Wachstum</span></div>
<div><b style="color:var(--morgenrot)">{mio(P["ende"]["vermoegen"])}</b><span>Plan: Betrieb wächst jedes Jahr 15 %</span></div>
<div><b style="color:var(--k-stark)">{mio(S["ende"]["vermoegen"])}</b><span>stark: größerer Betrieb, 20 % Wachstum</span></div>
<div><b>{mio(P["nach_porsche"])}</b><span>Plan, nachdem der Porsche bar bezahlt ist</span></div>
</div>''')
add('<h3>Die ersten fünf Jahre vergrößert <span class="klein">Ersparnis bis zur Übernahme</span></h3>')
add(frueh)
add(f'<p class="klein-text" style="margin-top:1.5mm">Der kleine Knick 2027 ist die Reise. Danach geht es fast gerade nach oben: Ausbildung plus zwei Werbekunden bringen rund {eur(biz_netto_monat + azubi_netto[1] - A["ausgaben_ausbildung"])} im Monat.</p>')
add('</section>')

# ---------- Woraus die Million besteht ----------
e = P["ende"]
add('<section class="kapitel"><div class="kopf" style="--farbe: var(--gold); grid-template-columns: 1fr"><div><div class="etikett">Ehrlich gerechnet</div><h2>Woraus die Million besteht</h2></div></div>')
add('<div class="zwei"><div>')
add(tabelle(["Plan-Szenario, 15.04.2038", "Betrag"], [
    ["Wert deines Betriebs (4 × Jahresgewinn)", eur(e["firmenwert"])],
    ["Geld auf dem Firmenkonto", eur(e["firma_cash"])],
    ["ETF-Depot (privat)", eur(e["etf"])],
    ["Tagesgeld (privat)", eur(e["tagesgeld"])],
    ["minus Restschuld Kaufkredit", "−" + eur(e["kredit"])],
], summe=["Nettovermögen", eur(e["vermoegen"])], minus=(4,),
    notiz=f'Umsatz des Betriebs im Jahr 2038: {eur(e["umsatz"])}, Gewinn nach deinem Gehalt: {eur(e["gewinn"])}.'))
add('</div><div>')
add(f'''<p><b>Rund drei Viertel deiner Million stecken im Betrieb.</b> Das ist normal für Unternehmer und gleichzeitig die wichtigste Warnung in diesem Plan: Der Firmenwert ist erst dann echtes Geld, wenn jemand den Betrieb kauft. Deshalb baust du nebenbei ein privates Depot auf, das dir allein gehört. Im Plan sind das mit 30 rund {tk(e["etf"] + e["tagesgeld"])}.</p>
<p><b>Wie der Firmenwert gerechnet ist:</b> Handwerksbetriebe werden in Deutschland nach dem AWH-Verfahren bewertet. Vereinfacht: Gewinn nach einem fairen Chefgehalt, geteilt durch einen Zinssatz von 15 bis 32 %. Bei 25 % ergibt das den Faktor 4. Kleine Betriebe, die am Chef hängen, liegen eher bei 3 bis 3,5. Deshalb rechnet das vorsichtige Szenario mit 3,5.</p>''')
add('</div></div>')
add('<h3>Die Annahmen der drei Szenarien</h3>')
def ann(k, f=lambda x: x):
    return [f(V["annahmen"][k]), f(P["annahmen"][k]), f(S["annahmen"][k])]
proz = lambda x: f"{x * 100:.0f} %".replace(".", ",")
add(tabelle(["Annahme", "vorsichtig", "Plan", "stark"], [
    ["Sold netto pro Monat (brutto 2.600 €)"] + ann("sold_netto", eur),
    ["Ausgaben pro Monat in der Kaserne"] + ann("ausgaben_kaserne", eur),
    ["Reisekosten April bis August 2027 gesamt"] + ann("reisekosten", eur),
    ["Werbekunden während Reise und Ausbildung (je 999 €)"] + [str(V["annahmen"]["kunden_ausbildung"]), str(P["annahmen"]["kunden_ausbildung"]), str(S["annahmen"]["kunden_ausbildung"])],
    ["Ausgaben pro Monat in der Ausbildung"] + ann("ausgaben_ausbildung", eur),
    ["Zins Tagesgeld / Rendite ETF pro Jahr"] + [f'{proz(V["annahmen"]["zins_tagesgeld"])[:-2]},0 % / {proz(V["annahmen"]["rendite_etf"])}', "2,5 % / 6 %", "2,5 % / 7 %"],
    ["Kaufpreis Betrieb / davon Eigenkapital"] + [f'{tk(x["annahmen"]["kaufpreis"])} / {tk(x["annahmen"]["eigenkapital"])}' for x in (V, P, S)],
    ["Umsatz im ersten Jahr"] + ann("umsatz_start", eur),
    ["Wachstum pro Jahr"] + ann("wachstum", proz),
    ["Gewinn nach Chefgehalt (vom Umsatz)"] + [f'{proz(x["annahmen"]["marge_start"])} → {proz(x["annahmen"]["marge_ende"])}' for x in (V, P, S)],
    ["Dein Gehalt als Chef, netto, am Anfang"] + ann("gf_netto_start", eur),
], rechts_ab=1, notiz="Gewinnspannen zum Vergleich: Betriebe mit 10 bis 49 Leuten kommen im Schnitt auf 5,8 % Umsatzrendite (KfW 2025). Umsatz pro Mitarbeiter im SHK-Handwerk: rund 150.000 € (ZVSHK 2025). 1 Mio. € Umsatz sind also etwa 7 Leute."))
add('</section>')

# ---------- Geld-System ----------
add('<section class="kapitel"><div class="kopf" style="--farbe: var(--gold); grid-template-columns: 1fr"><div><div class="etikett">Bevor es losgeht</div><h2>Dein Geld-System: vier Töpfe</h2></div></div>')
add('<p class="ziel-satz">Geld, das auf dem Girokonto liegt, wird ausgegeben. Deshalb bekommt jeder Euro am Zahltag sofort seinen Platz. Das System richtest du einmal ein, danach läuft es allein.</p>')
add(tabelle(["Topf", "Wofür", "Wo", "Wie viel"], [
    ["<b>1 · Girokonto</b>", "Alltag: Handy, Essen, Freizeit, Kostgeld", "dein jetziges Konto", "nur das Monatsbudget"],
    ["<b>2 · Notgroschen</b>", "Wenn etwas kaputtgeht oder ein Monat schlecht läuft", "Tagesgeld", "3 Monatsausgaben, ca. 2.500 €"],
    ["<b>3 · Betriebs-Topf</b>", "Eigenkapital für die Übernahme 2031", "Tagesgeld, später auch Geldmarkt-ETF", "80 % von allem, was du sparst"],
    ["<b>4 · Depot für immer</b>", "Dein privates Vermögen, nicht anfassen", "ETF-Sparplan Welt", "20 % von allem, was du sparst"],
], rechts_ab=9))
add('''<div class="zwei">''')
add(kasten("gut", "Die Regeln", [
    "<b>Zahltag-Regel:</b> Am Tag nach Sold oder Gehalt geht ein Dauerauftrag auf Tagesgeld und Depot. Erst sparen, dann leben.",
    "<b>Geld für den Betrieb bleibt sicher.</b> Was du 2031 brauchst, gehört nicht in Aktien. Ein Crash kurz vor dem Kauf würde dich Jahre kosten.",
    "<b>ETF nur für Geld, das du 10 Jahre nicht brauchst.</b> Der Weltaktienmarkt hatte über jede 15-Jahres-Strecke seit 1975 ein Plus, aber auch Einbrüche von über 50 %.",
    "<b>Nie alles bei einer Bank.</b> Neobanken sperren manchmal Konten zur Prüfung. Zwei Banken sind Pflicht.",
    "<b>Keine Schulden für Dinge, die an Wert verlieren.</b> Kein Ratenkauf, kein Leasing als Azubi.",
]))
add(kasten("geld", "Was ich konkret eröffnen würde", [
    "<b>Tagesgeld:</b> Scalable Capital (2,60 %) oder Trade Republic (2,50 %), beide ohne Obergrenze und kostenlos. Stand September 2026.",
    "<b>Depot:</b> beim gleichen Anbieter, Sparplan ab 1 € ohne Gebühr. Deutsche Anbieter führen die Steuer automatisch ab, das spart dir Arbeit.",
    "<b>Revolut Standard (kostenlos)</b> als zweites Konto und Reisekarte. Gebührenfrei zahlen in Dubai und Asien.",
    "<b>Ab 01.01.2027: Altersvorsorgedepot</b> mit staatlicher Zulage (Seite „Geld anlegen“).",
]))
add('</div>')
add('<div class="keinbruch"><h3>Revolut Ultra: lohnt sich das wegen der Zinsen?</h3>')
add('<div class="zwei"><div>')
add(tabelle(["Revolut, Stand 09/2026", "Preis pro Jahr", "Tagesgeld-Zins"], [
    ["Standard", "0 €", "2,25 % bis 5.000 €, darüber 1,25 %"],
    ["Premium", "89 €", "je nach Quelle 1,50–2,25 %"],
    ["Metal", "155 €", "2,25 % auf alles"],
    ["Ultra", "650 € (monatlich 65 €)", "2,50 % bis 100.000 €"],
    ["Neukunden-Aktion", "–", "4,25 % für 4 Monate bis 25.000 €"],
], rechts_ab=9, notiz="Quellen widersprechen sich bei Standard und Premium. Vor dem Abschluss in der App prüfen. Die Aktion verlangt ab dem 2. Monat 3 Kartenzahlungen à 5 € pro 30 Tage."))
add('</div><div>')
add('''<p><b>Kurze Antwort: nein.</b> Ultra kostet 650 € im Jahr. Gegenüber Revolut Standard lohnt es sich erst ab etwa <b>56.000 € auf dem Konto</b>, und nur vor Steuern. Gegenüber einem kostenlosen Tagesgeld mit 2,5–2,6 % lohnt es sich <b>nie</b>, weil der Ultra-Zins nicht höher ist.</p>
<p>Beispiel mit 10.000 €: Ultra bringt 250 € Zinsen und kostet 650 €, also 400 € Verlust. Trade Republic bringt 250 € und kostet nichts.</p>
<p><b>Wann Ultra doch Sinn haben kann:</b> Es enthält Lounge-Zugang und eine Reiseversicherung. Für die fünf Reisemonate monatlich gebucht kostet es 325 €. Das lohnt sich nur, wenn die Versicherung wirklich 5 Monate am Stück abdeckt. Das steht in den Bedingungen und muss vorher geprüft werden. Sonst ist eine eigene Auslandskrankenversicherung für rund 40 € im Monat günstiger.</p>''')
add('</div></div></div>')
add('<p class="grosser-satz" style="font-size:14pt">1 % mehr Zins auf 10.000 € sind 100 € im Jahr.<br>Einmal im Monat nicht essen gehen bringt mehr.</p>')
add('</section>')

# ---------- 01 Kaserne ----------
add('<section class="kapitel">')
add(kopf("01", "Kaserne", "01.10.2026 – 31.03.2027 · 18 Jahre · Gebirgsjäger", "02-gebirgsjaeger.jpg", "--c-kaserne", "50% 25%"))
add(f'<p class="ziel-satz" style="--farbe: var(--c-kaserne)"><b>Ziel:</b> Die Grundausbildung durchziehen, jeden Monat 1.600 € zur Seite legen und im März mit einem Ausbildungsvertrag, gebuchten Flügen und einem fertigen Reiseplan rausgehen.</p>')
add('<div style="--farbe: var(--c-kaserne)">')
add(schritte([
    ("bis 30.09.", "Tagesgeld und Depot eröffnen", "Scalable oder Trade Republic. Steuer-ID bereithalten. Freistellungsauftrag über 1.000 € einrichten."),
    ("bis 30.09.", "Dauerauftrag anlegen", "Jeweils einen Tag nach dem Sold: 1.280 € aufs Tagesgeld, 320 € in den ETF-Sparplan. Den Rest behältst du."),
    ("Oktober", "Kostgeld mit Mama klären", "Vorschlag: 150 € im Monat, auch wenn du nur am Wochenende da bist. Das ist fair und steht schon in deinem Budget."),
    ("Nov. – Jan.", "Fünf SHK-Betriebe für die Ausbildung anschreiben", "Bewerbung online, Vorstellung im Urlaub oder im April. Die wichtigste Frage steht unten im Kasten."),
    ("Januar", "Steuererklärung 2026 abgeben (ELSTER)", "Du hast 2026 nur drei Monate Sold, das liegt unter dem Grundfreibetrag. Rund 1.050 € Lohnsteuer kommen zurück."),
    ("ab 01.01.2027", "Altersvorsorgedepot eröffnen", "30 € im Monat. Bis 25 gibt es 200 € Startbonus, dazu 50 Cent pro eingezahltem Euro. Vorher prüfen, ob du als Soldat förderberechtigt bist."),
    ("Februar", "Reise vorbereiten", "Thailand-Touristenvisum online beantragen, Auslandskrankenversicherung abschließen, Krankenkasse anrufen (siehe Etappe 02), Reisehinweise VAE prüfen, Flüge buchen."),
    ("März", "Fünf Gespräche mit Kfz-Betrieben", "Wie in deinem Programm für März. Zwei davon sollen im April unterschreiben."),
]))
add('</div>')
add('<div class="zwei"><div>')
add('<h3>Das Geld <span class="klein">Plan, 6 Monate</span></h3>')
add(tabelle(["", "pro Monat", "6 Monate"], [
    ["Sold netto (2.600 € brutto)", eur(2250), eur(13500)],
    ["Essen / Kantine (ca. 10 € pro Tag möglich)", "−" + eur(200), "−" + eur(1200)],
    ["Wochenenden, Freizeit", "−" + eur(250), "−" + eur(1500)],
    ["Kostgeld Mama", "−" + eur(150), "−" + eur(900)],
    ["Handy, Kleinkram", "−" + eur(50), "−" + eur(300)],
], summe=["Gespart", eur(1600), eur(9600)], minus=(1, 2, 3, 4),
    notiz=f"Stand Ende März 2027: {eur(k_kaserne)}. Im Mai kommen 1.050 € Steuer zurück. Damit landest du effektiv bei deinen 2.400 € im Monat."))
add('</div><div>')
add(kasten("", "Gut zu wissen", [
    "Sold bei 6 Monaten: rund 2.600 € brutto. Abgezogen wird nur Lohnsteuer, keine Sozialabgaben. Netto rund 2.250 €.",
    "Bahnfahren in Uniform ist in ganz Deutschland kostenlos, auch am Wochenende. Das spart dir leicht 100 € im Monat.",
    "Unterkunft ist frei, Arzt ist frei (Truppenarzt). Fürs Essen nennt die Bundeswehr rund 10 € pro Tag. Frag am ersten Tag nach, was abgezogen wird.",
    "Führerschein-Zuschuss (bis 3.500 €) gibt es erst ab 12 Monaten Dienst. Entlassungsgeld erst ab mehr als 6 Monaten.",
]))
add(kasten("achtung", "Die wichtigste Frage an jeden Ausbildungsbetrieb", [
    "<b>„Wie alt sind Sie, und wer übernimmt den Betrieb später?“</b> Such dir einen Chef um die 55 ohne Nachfolger. Dann lernst du nicht nur das Handwerk, sondern auch deinen späteren Betrieb von innen kennen. Das ist der klügste Zug im ganzen Plan.",
]))
add('</div></div>')
add(kasten("plan-b", "Plan B", [
    "Du brichst ab oder verletzt dich: Ausbildung früher starten. Viele Betriebe nehmen auch zum Februar. Deine Ersparnis bleibt, der Rest des Plans verschiebt sich nicht.",
    "Der Sold ist höher als gedacht: Die Differenz geht komplett in den Betriebs-Topf. Nicht ausgeben.",
]))
add('</section>')

# ---------- 02 April ----------
add('<section class="kapitel">')
add(kopf("02", "April: Kunden holen", "01.04. – 13.04.2027 · 18 Jahre · zuhause", "06-laptop.jpg", "--c-dubai", "50% 50%"))
add('<p class="ziel-satz"><b>Ziel:</b> In zwei Wochen zwei Werbekunden unterschreiben lassen und so einrichten, dass ihre Kampagnen laufen, bevor du fliegst. Das bezahlt deine Reise.</p>')
add('<div style="--farbe: var(--c-dubai)">')
add(schritte([
    ("1. April", "Gewerbe anmelden (online, 25–100 €)", "Kleinunternehmer ankreuzen: unter 25.000 € Umsatz im Vorjahr keine Umsatzsteuer. Zwei Kunden sind 23.976 € im Jahr."),
    ("1. – 10. April", "15 Kfz-Betriebe vor Ort besuchen", "Mit Verkaufsskript und Pitch-Seite. Nur Betriebe mit Aufträgen ab 300 €."),
    ("bis 12. April", "Zwei Kunden onboarden", "Vorher-Nachher-Bilder, Landingpage und Kampagne live, Rückruf-Regel mit dem Chef. Alles muss ohne dich laufen."),
    ("bis 12. April", "Ausbildungsvertrag unterschreiben", "Mit Antrag auf Verkürzung um 12 Monate (wegen Abitur). Beginn 01.09.2027. Nebengewerbe gleich offen ansprechen."),
    ("bis 12. April", "Krankenkasse klären", "Ab April bist du nicht mehr über die Bundeswehr versichert. Verdienst du mehr als 565 € im Monat, geht die Familienversicherung nicht mehr. Dann rund 270–310 € im Monat freiwillig."),
    ("13. April", "Flug nach Dubai", "Nur wenn das Auswärtige Amt nicht mehr von Reisen in die VAE abrät (Stand September 2026 rät es ab)."),
]))
add('</div>')
add('<div class="zwei"><div>')
add('<h3>Das Geld <span class="klein">Plan</span></h3>')
add(tabelle(["", "Betrag"], [
    ["2 × Einrichtungsgebühr à 700 €", eur(1400)],
    ["22 % davon als Steuerrücklage", "−" + eur(308)],
    ["Ausgaben zuhause (Fahrten, Essen)", "−" + eur(400)],
], summe=["Plus im April", eur(692)], minus=(1, 2),
    notiz="Die monatlichen 999 € pro Kunde zahlt der Betrieb erst ab dem ersten vermittelten Auftrag, meist im Mai. Die Geld-zurück-Garantie gilt: keine Anfragen in 30 Tagen, Gebühr zurück."))
add('</div><div>')
add(kasten("geld", "Geld-Tipps", [
    "Die 22 % Steuerrücklage kommen auf ein eigenes Unterkonto. Was am Jahresende übrig bleibt, ist Bonus.",
    "Die Werbebudgets zahlen die Kunden direkt an Meta. So läuft nie fremdes Geld über dein Konto.",
    "Kaufst du als Kleinunternehmer Software aus dem Ausland, fällt trotzdem 19 % Umsatzsteuer an (Reverse Charge). Kleine Beträge, aber in die Steuererklärung.",
]))
add('</div></div>')
add(kasten("plan-b", "Plan B", [
    "Nur ein Kunde unterschreibt: Reise trotzdem antreten, aber die Philippinen streichen (spart rund 1.500 €).",
    "Kein Kunde: Du fliegst trotzdem. Das Ersparte trägt die Reise allein, siehe Reise-Ampel auf der nächsten Seite.",
    "Dubai ist nicht möglich: Justin in Bangkok treffen oder Dubai auf später verschieben. Direkt nach Bangkok fliegen spart rund 850 €.",
]))
add('</section>')

# ---------- 03 Reise ----------
add('<section class="kapitel">')
add(kopf("03", "Dubai und Asien", "14.04. – 31.08.2027 · 19 Jahre · Dubai, Thailand, Philippinen", "04-thailand.jpg", "--c-asien", "50% 60%"))
add('<p class="ziel-satz"><b>Ziel:</b> Viereinhalb Monate trainieren, bis du ein Video hast, das Sponsoren überzeugt. Das Business läuft nebenbei mit wenigen Stunden pro Woche. Du kommst mit mehr Geld zurück, als du losgeflogen bist, oder zumindest mit fast genauso viel.</p>')
add('<div class="zwei"><div>')
add('<h3>Die Route</h3>')
add(tabelle(["Wann", "Wo", "Einreise"], [
    ["14.04. – 30.04.", "Dubai bei Justin, 19. Geburtstag am 15.04.", "visafrei bis 90 Tage"],
    ["01.05. – 31.07.", "Bangkok: Taco Lake und Thai Wake Park", "Touristenvisum 60 Tage + 30 Tage Verlängerung"],
    ["01.08. – 29.08.", "Philippinen: CamSur Watersports Complex", "30 Tage visafrei"],
    ["30.08.", "Rückflug München", "Ausbildung ab 01.09."],
], rechts_ab=9, notiz="Wichtig: Seit 15.09.2026 bekommst du in Thailand ohne Visum nur noch 30 Tage. Deshalb vorher das Touristenvisum (60 Tage) online über thaievisa.go.th beantragen, vor Ort einmal um 30 Tage verlängern (1.900 THB). Das Langzeitvisum DTV gibt es erst ab 20 Jahren."))
add('</div><div>')
add('<h3>Das Budget <span class="klein">Plan</span></h3>')
add(tabelle(["", "Betrag"], [
    ["Flug München – Dubai", eur(250)],
    ["Dubai, 2 Wochen (du wohnst bei Justin)", eur(600)],
    ["Flug Dubai – Bangkok", eur(250)],
    ["Visum + Verlängerung Thailand", eur(90)],
    ["Bangkok 3 Monate à 900 € (Zimmer, Essen, Roller, Wakeboard)", eur(2700)],
    ["Flug Bangkok – Philippinen", eur(150)],
    ["Philippinen 1 Monat", eur(950)],
    ["Rückflug", eur(400)],
    ["Auslandskrankenversicherung 5 Monate à 40 €", eur(200)],
    ["Krankenkasse Deutschland 5 Monate à 300 €", eur(1500)],
    ["Board, Bindung (gebraucht), Action-Cam", eur(1200)],
    ["Puffer", eur(810)],
], summe=["Reise gesamt", eur(9100)]))
add('</div></div>')
add('<div class="zwei"><div>')
add('<h3>Wakeboard: der Weg zum Sponsor</h3>')
add('<div style="--farbe: var(--c-asien)">')
add(schritte([
    ("Mai, Woche 1", "Trick-Liste schreiben", "Was du kannst, was du bis August sicher stehen willst. Jede Woche ein neuer Trick."),
    ("ab Mai", "5 Tage pro Woche fahren", "Taco Lake in Bangkok: rund 400 THB für den ganzen Tag. Thai Wake Park: 850 THB für 2 Stunden."),
    ("jede Session", "Filmen", "Stativ oder Kumpel. Jede Woche ein Clip auf Instagram, immer mit Park und Trick im Text."),
    ("bis 31. Juli", "Ein Edit von 60–90 Sekunden", "Nur deine besten Landungen, gute Musik, Name und Kontakt am Ende."),
    ("August", "An Slingshot und Dupwake schicken", "An die Teammanager und an die deutschen Händler. Der erste Schritt ist meist ein Shop- oder „Flow“-Sponsoring: Material zum Sonderpreis, noch kein Geld."),
]))
add('</div></div><div>')
add(kasten("achtung", "Arbeiten an der Anlage: Vorsicht", [
    "In Thailand gilt jede Tätigkeit als Arbeit, auch unbezahlt. Ohne Arbeitserlaubnis drohen 5.000 bis 50.000 THB Strafe, Abschiebung und Einreisesperre.",
    "Deshalb: als Gast trainieren, Leute kennenlernen, filmen. Nicht gegen freie Fahrten mitarbeiten.",
    "Legal an Anlagen arbeiten geht in der EU, zum Beispiel als Saisonjob im Sommer an einem deutschen Wakepark.",
    "Remote für deutsche Kunden arbeiten ist mit Touristenvisum rechtlich nicht sauber gedeckt. Halte es klein: Kampagnen laufen, du prüfst einmal pro Woche.",
]))
add(kasten("gut", "Die Reise-Ampel", [
    "<b>Grün:</b> 2 Kunden zahlen, Tagesgeld über 6.000 € → Plan wie oben.",
    "<b>Gelb:</b> 1 Kunde oder Tagesgeld 4.000–6.000 € → Philippinen streichen, Ende Juli heim.",
    "<b>Rot:</b> Tagesgeld unter 4.000 € → sofort heim. Der Notgroschen wird nicht verreist.",
]))
add('</div></div>')
add(f'<p class="tabelle-notiz">Rechnung Plan: Reise −9.100 €, April-Ausgaben −400 €, Einrichtungsgebühren +1.092 €, 4 Monate Kunden +{eur(reise_biz)} (nach Steuerrücklage), Steuererstattung +1.050 €. Stand Ende August: {eur(k_reise)}.</p>')
add('</section>')

# ---------- 04 Ausbildung ----------
add('<section class="kapitel">')
add(kopf("04", "Ausbildung SHK", "01.09.2027 – 28.02.2030 · 19 – 21 Jahre · Anlagenmechaniker SHK", "01-wasserburg.jpg", "--c-ausbildung", "50% 45%"))
add('<p class="ziel-satz"><b>Ziel:</b> In 30 statt 42 Monaten Geselle werden, dabei zuhause wohnen, das Werbe-Business mit zwei Kunden weiterführen und am Ende über 55.000 € auf dem Konto haben.</p>')
add('<div style="--farbe: var(--c-ausbildung)">')
add(schritte([
    ("Vertrag", "Verkürzung um 12 Monate beantragen", "Mit Abitur geht bis zu ein Jahr weniger. Antrag stellen du und der Betrieb gemeinsam bei der Handwerkskammer, am besten gleich mit dem Vertrag."),
    ("Sept. 2027", "Nebengewerbe beim Betrieb melden", "Erlaubt, solange die Ausbildung nicht leidet und du keine Konkurrenz machst. Schriftlich festhalten."),
    ("jedes Jahr", "Berufsschule mit guten Noten", "Mit einem Schnitt besser als 2,5 kannst du zusätzlich vorzeitig zur Gesellenprüfung. Das spart bis zu 6 weitere Monate."),
    ("ab 2028", "Den Betrieb wie ein Käufer kennenlernen", "Frag den Chef nach Kalkulation, Materialpreisen, Wartungsverträgen. Wer weiß, wie ein Betrieb Geld verdient, kauft später den richtigen."),
    ("Sommer 2028/29", "Wakeboard-Saison", "Urlaub für Contests nehmen. Das Sponsoring aus 2027 weiterpflegen."),
    ("Herbst 2029", "Teil III und IV des Meisters abends lernen", "Kaufmännisch und Ausbilderschein, online möglich, rund 3.200 € bei der HWK. Aufstiegs-BAföG beantragen, bevor der Kurs beginnt. Die Prüfung verlangt die HWK meist erst nach der Gesellenprüfung."),
    ("bis 31.12.2029", "Für die Meisterschule anmelden", "Die städtische Meisterschule München (Ostbahnhof) kostet kein Schulgeld. Anmeldeschluss ist der 31.12. des Vorjahres. Plätze sind begrenzt."),
    ("Februar 2030", "Gesellenprüfung", ""),
]))
add('</div>')
add('<div class="zwei"><div>')
add('<h3>Das Geld <span class="klein">Plan, pro Monat</span></h3>')
add(tabelle(["", "1. Jahr", "2. Jahr", "3. Jahr*"], [
    ["Vergütung brutto (Tarif SHK Bayern)", eur(1050), eur(1130), eur(1260)],
    ["Vergütung netto (rund 21 % Abzüge)", eur(azubi_netto[0]), eur(azubi_netto[1]), eur(azubi_netto[2])],
    ["2 Werbekunden nach Steuerrücklage", eur(biz_netto_monat), eur(biz_netto_monat), eur(biz_netto_monat)],
    ["Kostgeld 250, Auto 250, Freizeit 300, Rest 70", "−" + eur(870), "−" + eur(870), "−" + eur(870)],
], summe=["Gespart pro Monat", eur(azubi_netto[0] + biz_netto_monat - 870), eur(azubi_netto[1] + biz_netto_monat - 870), eur(azubi_netto[2] + biz_netto_monat - 870)], minus=(3,),
    notiz=f"Tarif SHK Bayern ab 09/2025: 1.000 / 1.050 / 1.150 / 1.250 €. Die Sätze ab 2027 werden neu verhandelt. Bei Verkürzung startest du trotzdem mit dem Satz des 1. Jahres. Stand Ende Februar 2030: {eur(k_ausb)}."))
add('</div><div>')
add(kasten("geld", "Geld-Tipps in der Ausbildung", [
    "<b>Zahltag-Regel bleibt:</b> 1.200 € ins Tagesgeld, 300 € in den ETF. Jeden Monat, automatisch.",
    "<b>Tarifliche Altersvorsorge:</b> In tarifgebundenen SHK-Betrieben in Bayern zahlt der Chef für Azubis 32 € im Monat in eine Betriebsrente. Nachfragen, mitnehmen.",
    "<b>Kleinunternehmer-Grenze:</b> Mit drei Kunden liegst du über 25.000 € und musst ab dem Folgejahr 19 % Umsatzsteuer berechnen. Für Firmenkunden kein Problem, sie holen sie sich zurück.",
    "<b>Steuer:</b> Bei rund 35.000 € Jahreseinkommen zahlst du etwa 16 % Einkommensteuer. Die 22 % Rücklage reichen also sicher.",
    "<b>Auto:</b> gebraucht und bar, höchstens 5.000 €. Kein Leasing, keine Finanzierung.",
]))
add('</div></div>')
add(kasten("plan-b", "Plan B", [
    "Kein Betrieb macht die Verkürzung mit: dann 42 Monate. Der Plan verschiebt sich um ein Jahr, die Million um ein Jahr später. Deshalb die Verkürzung schon im Vorstellungsgespräch klären.",
    "Das Business frisst zu viel Zeit: auf einen Kunden reduzieren. Die Ausbildung hat Vorrang, ohne Meister kein Betrieb.",
]))
add('</section>')

# ---------- 05 Geselle und Meister ----------
add('<section class="kapitel">')
add(kopf("05", "Geselle und Meister", "03/2030 – 09/2031 · 21 – 23 Jahre · Installateur- und Heizungsbauermeister", "07-gebaeudetechnik.jpg", "--c-meister", "50% 45%"))
add('<p class="ziel-satz"><b>Ziel:</b> Ein halbes Jahr als Geselle Geld verdienen, dann in Vollzeit den Meister machen und im Sommer 2031 mit Meisterbrief, 3.000 € Meisterbonus und rund 85.000 € auf dem Konto dastehen.</p>')
add('<div style="--farbe: var(--c-meister)">')
add(schritte([
    ("März – Aug. 2030", "Als Geselle arbeiten", "Tariflohn SHK Bayern rund 19,60 € pro Stunde, am Markt 3.500–4.200 € brutto. Netto rund 2.200 €. Am besten im späteren Übernahme-Betrieb."),
    ("Frühjahr 2030", "Prüfung Teil III und IV", "Den Kurs hast du im Herbst 2029 abends gemacht."),
    ("Sept. 2030", "Meisterschule Vollzeit, Teil I und II", "Bis Juli 2031. Option A: städtische Meisterschule München ohne Schulgeld (rund 2.200 € für Gebühren und Material). Option B: HWK-Kurs für rund 9.000–9.500 € plus Prüfung."),
    ("vor Kursbeginn", "Aufstiegs-BAföG beantragen", "Kurs und Prüfung bis 15.000 € gefördert: die Hälfte geschenkt, der Rest als günstiges KfW-Darlehen."),
    ("Juli 2031", "Meisterprüfung bestehen", "Dann wird die Hälfte des Darlehens erlassen. Übernimmst du innerhalb von 3 Jahren einen Betrieb und führst ihn 3 Jahre, fällt der Rest auch weg."),
    ("Aug. 2031", "Meisterbonus Bayern beantragen", "3.000 €, Antrag innerhalb von 2 Jahren. Die besten 20 % bekommen zusätzlich den Meisterpreis (Urkunde)."),
]))
add('</div>')
add('<div class="zwei"><div>')
add('<h3>Was der Meister wirklich kostet <span class="klein">Option B, HWK-Kurs</span></h3>')
add(tabelle(["", "Betrag"], [
    ["Kurs Teil I + II", eur(9500)],
    ["Kurs Teil III + IV, Prüfungsgebühren", eur(3600)],
    ["davon Zuschuss Aufstiegs-BAföG (50 %)", "−" + eur(6550)],
    ["Darlehen, 50 % Erlass bei Bestehen", "−" + eur(3275)],
    ["Rest-Darlehen, erlassen bei Übernahme bis 2034", "−" + eur(3275)],
    ["Laptop, Lernmaterial, halbes Meisterstück", eur(1500)],
], summe=["Du zahlst selbst", eur(1500)], minus=(2, 3, 4)))
add('</div><div>')
add('<h3>Das Geld <span class="klein">Plan</span></h3>')
add(tabelle(["", "pro Monat"], [
    ["Geselle netto (6 Monate)", eur(2200)],
    ["2 Werbekunden nach Steuerrücklage", eur(biz_netto_monat)],
    ["Ausgaben", "−" + eur(970)],
], minus=(2,), notiz=f"In der Meisterschule fällt das Gehalt weg. Die Werbekunden tragen dich durch. Den Unterhaltsbeitrag (1.019 € im Monat, geschenkt) bekommst du nur mit weniger als 45.000 € Vermögen. Du wirst mehr haben, deshalb ist er nicht eingerechnet. Stand vor der Übernahme: {eur(k_meister)}."))
add('</div></div>')
add('</section>')

# ---------- 06 Übernahme ----------
rate = P["kreditrate"]
zins_anf = P["zinsrate_anfang"]
add('<section class="kapitel">')
add(kopf("06", "Betrieb übernehmen", "Suche ab 2029 · Kauf Oktober 2031 · 23 Jahre", "08-betrieb.jpg", "--c-betrieb", "50% 55%"))
add(f'<p class="ziel-satz"><b>Ziel:</b> Einen gesunden SHK-Betrieb mit rund 7 Mitarbeitern und 1 Mio. € Umsatz übernehmen, dessen Chef in Rente geht. Kaufpreis rund {tk(A["kaufpreis"])}, davon {tk(A["eigenkapital"])} aus deinem Ersparten.</p>')
add('<div class="zwei"><div>')
add('<div style="--farbe: var(--c-betrieb)">')
add(schritte([
    ("2029", "Liste mit 30 Betrieben im Umkreis von 40 km", "Quellen: nexxt-change (über 10.000 Inserate), Betriebsbörse der Handwerkskammer, Innung, Steuerberater. Der beste Tipp: Frag den Außendienst vom Großhändler. Der weiß, wer aufhören will."),
    ("2030", "Erste Gespräche", "Ohne Druck: „Ich mache gerade meinen Meister und suche einen Betrieb, den ich weiterführen kann.“ Mindestens 125.000 Handwerksbetriebe suchen in den nächsten 5 Jahren einen Nachfolger."),
    ("Frühjahr 2031", "Zahlen prüfen", "3 Jahresabschlüsse, Wartungsverträge, Alter der Mitarbeiter, Fahrzeuge, Garantiefälle, Mietvertrag, Auftragsbestand. Mit Steuerberater."),
    ("Sommer 2031", "Finanzierung zusagen lassen", "Hausbank plus Förderkredit, siehe rechts. Banken wollen heute 20–30 % Eigenkapital."),
    ("Herbst 2031", "Kaufvertrag", "Mit Anwalt. Der alte Chef bleibt 6–12 Monate als Berater. Das beruhigt Kunden und Mitarbeiter."),
    ("erste 100 Tage", "Jeden Mitarbeiter einzeln sprechen", "Niemand soll gehen. Dann alle Wartungskunden anrufen, danach die erste Meta-Kampagne starten."),
]))
add('</div></div><div>')
add('<h3>Was der Betrieb wert ist</h3>')
add(tabelle(["Beispiel nach AWH-Verfahren", "Betrag"], [
    ["Umsatz", eur(1_000_000)],
    ["Gewinn nach fairem Chefgehalt (7 %)", eur(70_000)],
    ["geteilt durch Kapitalisierungszins 28 %", ""],
], summe=["Wert ≈ Kaufpreis", eur(250_000)]))
add('<h3>Die Finanzierung <span class="klein">Plan</span></h3>')
add(tabelle(["", "Betrag"], [
    ["Eigenkapital aus dem Betriebs-Topf", eur(A["eigenkapital"])],
    ["KfW ERP-Förderkredit Gründung und Nachfolge", eur(A["kaufpreis"] - A["eigenkapital"])],
    ["Zins je nach Bonität 3,4–9,8 %, gerechnet mit", "5,5 %"],
    ["Rate in den 2 tilgungsfreien Jahren", eur(zins_anf) + " / Monat"],
    ["Rate danach, 8 Jahre", eur(rate) + " / Monat"],
], rechts_ab=1, notiz="Die Rate zahlt der Betrieb, nicht du privat. Dazu gibt es eine 100-%-Garantie der Bürgschaftsbank. Alternative: LfA Förderbank Bayern, Gründungskredit bis 150.000 € mit 80 % Haftungsfreistellung. Eine Meistergründungsprämie gibt es in Bayern nicht."))
add('</div></div>')
add('<div class="zwei">')
add(kasten("geld", "Der Profi-Zug: Holding", [
    "Lass dir beim Kauf eine <b>Holding-GmbH</b> einrichten, die deine Betriebs-GmbH besitzt. Gewinne, die du nicht privat brauchst, wandern in die Holding und werden dort nur mit rund 1,5 % statt 26 % weiterer Steuer belastet.",
    "Die Holding kann damit investieren: in ETFs, einen zweiten Betrieb oder den Standort Schweiz. Das ist der Motor hinter dem Firmenkonto in der Rechnung.",
    "Die GmbH-Steuer sinkt ab 2028 jedes Jahr um einen Punkt, bis 2032 auf rund 25 %.",
]))
add(kasten("plan-b", "Plan B", [
    "Kein passender Betrieb bis 2032: selbst gründen mit Meister und Meta Ads. Kleiner Start, dafür ohne Kaufkredit.",
    "Zu wenig Eigenkapital: kleineren Betrieb nehmen (vorsichtiges Szenario: 150.000 €) oder den alten Chef einen Teil stunden lassen (Verkäuferdarlehen).",
    "Übernahme bis 2034, sonst verfällt der volle Darlehenserlass vom Meister.",
]))
add('</div>')
add('</section>')

# ---------- 07 Wachstum + Schweiz ----------
wachs = []
for j in range(2032, 2039):
    m = f"{j}-12" if j < 2038 else "2038-04"
    v = stand(P, m)
    wachs.append([str(j), eur(v["umsatz"]), f'{round(v["umsatz"] / 150000)}', eur(v["gewinn"]), eur(v["firmenwert"]), eur(v["privat"])])
add('<section class="kapitel">')
add(kopf("07", "Wachsen, dann Schweiz", "2032 – 2038 · 24 – 29 Jahre", "09-schweiz.jpg", "--c-schweiz", "50% 45%"))
add('<p class="ziel-satz"><b>Ziel:</b> Jedes Jahr rund 15 % mehr Umsatz, indem du mit Meta Ads zwei Dinge findest, die jedem Handwerksbetrieb fehlen: gute Aufträge und gute Leute. Ab 2034 den ersten Fuß in die Schweiz setzen.</p>')
add(tabelle(["Jahr", "Umsatz", "Leute (≈)", "Gewinn nach Chefgehalt", "Wert Betrieb", "Privat (Tagesgeld + ETF)"], wachs, rechts_ab=1,
    notiz="Plan-Szenario. Leute = Umsatz geteilt durch 150.000 € pro Kopf. Wachstum heißt vor allem: jedes Jahr zwei bis drei Fachkräfte mehr finden."))
add('<div class="zwei"><div>')
add('<div style="--farbe: var(--c-schweiz)">')
add(schritte([
    ("2032", "Wärmepumpen und Bäder bewerben", "Zwei Kampagnen, die dauerhaft laufen. Nur Aufträge mit gutem Ertrag."),
    ("2032", "Recruiting-Kampagne", "Fachkräfte sind der Engpass im SHK-Handwerk. Wer Leute findet, wächst."),
    ("2033", "Zweiter Meister, Chef aus der Baustelle raus", "Du führst, du schraubst nicht mehr. Nur so wird der Betrieb mehr wert als du."),
    ("2034", "Schweiz testen", "Über das Meldeverfahren: bis 90 Arbeitstage pro Jahr, online 8 Tage vorher anmelden. Erste Aufträge in Grenznähe."),
    ("2035 – 2038", "Schweizer GmbH, zweiter Standort", "20.000 CHF Stammkapital, Meister anerkennen lassen (rund 350 CHF beim SBFI). Der Betrieb läuft ohne dich im Tagesgeschäft. Genau das macht ihn wertvoll."),
]))
add('</div></div><div>')
add(kasten("", "Schweiz: was du wissen musst", [
    "<b>Preise:</b> Sanitär 80–150 CHF pro Stunde, in Deutschland 75–130 €.",
    "<b>Mindestlöhne (GAV Gebäudetechnik 2026):</b> 4.600 CHF ab Lehrabschluss, 5.300 CHF ab dem 5. Jahr. Gilt auch für deine entsandten Leute.",
    "<b>Kaution:</b> bis 10.000 CHF, einmalig.",
    "<b>Mehrwertsteuer:</b> Ab 100.000 CHF weltweitem Umsatz vom ersten Franken an steuerpflichtig, mit Steuervertreter in der Schweiz.",
    "<b>Steuern für Firmen:</b> 12–19 % je nach Kanton, deutlich weniger als in Deutschland.",
    "<b>Selbst umziehen?</b> Möglich mit Bewilligung B. Vorsicht: Deutschland verlangt beim Wegzug Steuer auf Firmenanteile (Wegzugssteuer). Nie ohne Steuerberater umziehen.",
]))
add('</div></div>')
add('</section>')

# ---------- 08 Mit 30 ----------
add('<section class="kapitel">')
add(kopf("08", "Mit 30", "15.04.2038 · 30 Jahre", "10-porsche.jpg", "--c-ziel", "50% 55%"))
add(f'<p class="ziel-satz"><b>Ziel:</b> Nettovermögen über 1 Mio. €, ein Betrieb, der ohne dich läuft, ein privates Depot, das dir allein gehört, und ein Porsche 911, bar bezahlt.</p>')
add('<div class="zwei"><div>')
add('<h3>Der Porsche</h3>')
add(tabelle(["911, Stand 2026", "Preis"], [
    ["Neu: 992.2 Carrera", "ab 128.700 €"],
    ["Neu: 992.2 Carrera S", "ab 154.800 €"],
    ["Gebraucht: 991 Carrera", "ca. 72.000 – 115.000 €"],
    ["Gebraucht: 992.1 Carrera S (2020)", "ab ca. 96.000 €"],
    ["Kfz-Steuer pro Jahr", "336 €"],
    ["Service klein / groß", "ca. 1.000 / 2.000 €"],
    ["Vollkasko pro Jahr", "800 – 2.000 €"],
], rechts_ab=1, notiz="Gebrauchtpreise Stand 2026. Junge Fahrer zahlen für die Vollkasko oft über 4.000 € im Jahr."))
add('</div><div>')
add(kasten("geld", "Die Porsche-Regeln", [
    "<b>Bar bezahlen.</b> Kein Leasing, keine Finanzierung.",
    "<b>Erst kaufen, wenn dein privates Geld mindestens das Dreifache ist.</b> Im Plan: rund " + tk(ende["privat"]) + " privat, Porsche " + tk(A["porsche"]) + ". Passt.",
    "<b>Privat kaufen, nicht über die Firma.</b> Als Firmenwagen musst du jeden Monat 1 % vom Neupreis versteuern. Bei 150.000 € Listenpreis sind das 1.500 € im Monat, auch beim Gebrauchten.",
    "<b>Porsche-Topf:</b> Ab 2035 jeden Monat 1.000 € auf ein eigenes Tagesgeld. Bis 2038 sind das über 40.000 €.",
]))
add('</div></div>')
add('<h3>Was „Millionär“ in diesem Plan heißt</h3>')
add('<p>Nettovermögen: alles, was dir gehört (Betrieb, Firmenkonto, Depot, Tagesgeld), minus alle Schulden. Im Plan-Szenario sind das am 15.04.2038 <b>' + eur(ende["vermoegen"]) + '</b>, nach dem Porsche <b>' + eur(P["nach_porsche"]) + '</b>. Im vorsichtigen Szenario sind es ' + eur(V["ende"]["vermoegen"]) + '. Das ist immer noch mehr, als die meisten Menschen mit 50 haben. Der Unterschied zwischen beiden liegt fast nur an einer Zahl: wie schnell dein Betrieb wächst.</p>')
add('<p class="grosser-satz">Die Million entscheidet sich nicht 2038.<br>Sie entscheidet sich 2031, bei der Wahl des Betriebs.</p>')
add('</section>')

# ---------- Jahr für Jahr ----------
zeilen = []
alter = {j: j - 2008 - (0 if j >= 2008 else 0) for j in range(2026, 2039)}
for j, m in jahre:
    zeilen.append([
        f"{'April ' if j == 2038 else 'Ende '}{j}", str(j - 2008 if j < 2038 else 30),
        {"kaserne": "Kaserne", "april": "April", "reise": "Reise", "ausbildung": "Ausbildung", "geselle": "Geselle", "meister": "Meister", "betrieb": "Betrieb"}[stand(P, m)["phase"]],
        eur(stand(V, m)["vermoegen"]), eur(stand(P, m)["vermoegen"]), eur(stand(S, m)["vermoegen"]),
    ])
add('<section class="kapitel"><div class="kopf" style="--farbe: var(--tinte); grid-template-columns: 1fr"><div><div class="etikett">Zum Nachschauen</div><h2>Jahr für Jahr</h2></div></div>')
add('<p class="ziel-satz">Dein Nettovermögen am Ende jedes Jahres. Trag daneben mit Stift ein, was du wirklich hast. Liegst du zwei Jahre hintereinander unter „vorsichtig“, ist es Zeit für ein ehrliches Gespräch mit dir selbst.</p>')
add(tabelle(["Zeitpunkt", "Alter", "Etappe", "vorsichtig", "Plan", "stark"], zeilen, rechts_ab=3))
add('<table style="margin-top:6mm"><thead><tr><th>Jahr</th><th class="r">Was ich wirklich habe</th><th class="r">Notiz</th></tr></thead><tbody>' +
    "".join(f'<tr><td>{j}</td><td class="r" style="height:7mm"></td><td class="r"></td></tr>' for j in range(2027, 2039)) + '</tbody></table>')
add('</section>')

# ---------- Geld anlegen ----------
add('<section class="kapitel"><div class="kopf" style="--farbe: var(--gold); grid-template-columns: 1fr"><div><div class="etikett">Nebenbei investieren</div><h2>Geld anlegen: die Tipps</h2></div></div>')
add('<div class="zwei"><div>')
add('<h3>Die Reihenfolge</h3>')
add('<div style="--farbe: var(--gold)">')
add(schritte([
    ("1", "Notgroschen", "3 Monatsausgaben aufs Tagesgeld. Erst wenn der steht, kommt alles andere."),
    ("2", "Altersvorsorgedepot (ab 2027)", "Mindestens 360 € im Jahr einzahlen, dafür gibt der Staat 180 € dazu. Das sind 50 % Rendite ab dem ersten Tag. Unter 25 zusätzlich 200 € Startbonus."),
    ("3", "Betriebs-Topf", "Tagesgeld, ab rund 30.000 € zum Teil Geldmarkt-ETF (z. B. Xtrackers EUR Overnight, LU0290358497, rund 2,4 %). Sicher, weil du das Geld 2031 brauchst."),
    ("4", "ETF-Sparplan Welt", "Geld für die nächsten 20 Jahre. Nie verkaufen, wenn es fällt."),
    ("5", "Ab 2031: Holding", "Gewinne aus dem Betrieb steuergünstig anlegen."),
]))
add('</div>')
add('<h3>Welche ETFs</h3>')
add(tabelle(["ETF", "ISIN", "Kosten/Jahr"], [
    ["Vanguard FTSE All-World (thesaurierend)", "IE00BK5BQT80", "0,14–0,19 %"],
    ["SPDR MSCI ACWI IMI", "IE00B3YLTY66", "0,17 %"],
    ["iShares MSCI ACWI", "IE00B6R52259", "0,20 %"],
], rechts_ab=2, notiz="Einer davon reicht. Finanztip empfiehlt seit Mai 2026 für neues Geld „Alle-Länder“-ETFs statt nur MSCI World."))
add('</div><div>')
add('<h3>Tagesgeld, Stand September 2026</h3>')
add(tabelle(["Anbieter", "Zins", "Bedingung"], [
    ["Scalable Capital", "2,60 %", "ohne Grenze"],
    ["Trade Republic", "2,50 %", "ohne Grenze"],
    ["Revolut Standard", "2,25 %", "nur bis 5.000 €"],
    ["Revolut Ultra", "2,50 %", "kostet 650 € / Jahr"],
    ["Revolut Aktion", "4,25 %", "4 Monate, Kartennutzung"],
    ["ING Aktion", "3,20 %", "4 Monate"],
], rechts_ab=1, notiz="Die EZB hat den Leitzins am 16.09.2026 auf 2,50 % erhöht. Aktionszinsen lohnen sich, wenn du eh ein Konto brauchst. Konto-Hopping für 30 € Zinsen lohnt sich nicht."))
add('<h3>Was 12 Jahre Zinseszins machen</h3>')
add(tabelle(["Monatlich", "bei 2 %", "bei 5 %", "bei 7 %", "eingezahlt"], [
    ["100 €", "16.242 €", "19.534 €", "22.146 €", "14.400 €"],
    ["300 €", "48.725 €", "58.603 €", "66.439 €", "43.200 €"],
    ["500 €", "81.208 €", "97.672 €", "110.732 €", "72.000 €"],
    ["1.000 €", "162.415 €", "195.344 €", "221.464 €", "144.000 €"],
], rechts_ab=1, notiz="Vor Steuern und Kosten. Für 1 Mio. € in 12 Jahren nur durch Sparen bräuchtest du 4.515 € im Monat bei 7 %. Deshalb der Betrieb."))
add('</div></div>')
add('<div class="zwei">')
add(kasten("", "Steuern auf Geldanlagen", [
    "<b>1.000 € Zinsen und Gewinne pro Jahr sind steuerfrei</b>, wenn du einen Freistellungsauftrag stellst. Bei mehreren Banken aufteilen.",
    "Darüber: 25 % plus Soli. Deutsche Banken und Broker führen das automatisch ab.",
    "<b>Revolut-Depot</b> führt keine Steuer ab. Dann musst du alles selbst in die Steuererklärung schreiben (Anlage KAP). Deshalb lieber einen deutschen Broker.",
    "Aktien-ETFs: 30 % der Erträge sind steuerfrei (Teilfreistellung). Jeden Januar wird eine kleine Vorabpauschale fällig, bei 10.000 € Depot rund 40 €.",
]))
add(kasten("achtung", "Finger weg", [
    "<b>CFDs und Trading-Apps mit Hebel:</b> 74–89 % der Privatleute verlieren Geld.",
    "<b>Signalgruppen und Finfluencer</b>, die schnelle Rendite versprechen. Die BaFin warnt jedes Jahr vor Hunderten.",
    "<b>Krypto</b> höchstens als Spielgeld, maximal 5 % deines Vermögens. Die steuerfreie Haltefrist von einem Jahr soll möglicherweise abgeschafft werden.",
    "<b>Riester:</b> Neue Verträge gibt es ab 2027 nicht mehr. Das Altersvorsorgedepot ist besser.",
]))
add('</div>')
add('</section>')

# ---------- Risiken + Jahres-Check ----------
add('<section class="kapitel"><div class="kopf" style="--farbe: var(--warn); grid-template-columns: 1fr"><div><div class="etikett">Was schiefgehen kann</div><h2>Risiken und der Jahres-Check</h2></div></div>')
add(tabelle(["Risiko", "Wie wahrscheinlich", "Was du dann machst"], [
    ["Kein Werbekunde 2027", "mittel", "Reise-Ampel: kürzer reisen. Plan verschiebt sich nicht."],
    ["Dubai nicht möglich", "mittel (Reisehinweis)", "Direkt nach Bangkok, Justin dort treffen."],
    ["Keine Verkürzung der Ausbildung", "gering", "42 Monate, alles ein Jahr später."],
    ["Meisterprüfung nicht bestanden", "gering", "Teil wiederholen, Übernahme ein halbes Jahr später. Bis 2034 ist Zeit."],
    ["Kein passender Betrieb", "mittel", "Selbst gründen oder Teilhaber werden. Suche rechtzeitig ab 2029."],
    ["Mitarbeiter kündigen nach der Übernahme", "mittel", "Alter Chef bleibt als Berater, jedes Gespräch persönlich, Recruiting über Meta."],
    ["Bau-Flaute, hohe Zinsen", "mittel", "Wartung und Service stärken. Die laufen auch in schlechten Jahren."],
    ["Gesundheit", "gering", "Berufsunfähigkeitsversicherung ab Ausbildungsbeginn, solange du jung und gesund bist. Ist günstig mit 19."],
], rechts_ab=9))
add('<div class="zwei">')
add(kasten("gut", "Der Jahres-Check an jedem 15. April", [
    "Was habe ich wirklich? In die Tabelle „Jahr für Jahr“ eintragen.",
    "Liege ich über, auf oder unter dem Plan?",
    "Was war der größte Fehler des Jahres, was der größte Erfolg?",
    "Stimmt das Ziel noch, oder will ich etwas anderes?",
    "Was sind die drei wichtigsten Schritte bis zum nächsten Geburtstag?",
]))
add(kasten("geld", "Mit Claude nachrechnen", [
    "Die Rechnung liegt im Repo unter <b>visionboard/plan/</b>. Schreib einfach: „Rechne meinen Plan neu, ich habe X € und Y Kunden.“ Dann kommt ein neues PDF mit deinen echten Zahlen.",
    "Ändert sich der Plan (anderer Beruf, andere Reise, anderer Zeitpunkt), wird die ganze Rechnung neu gemacht, nicht geschätzt.",
]))
add('</div>')
add('</section>')

# ---------- Quellen ----------
quellen = [
    ("Neuer Wehrdienst, Sold, Bahn, Führerschein", "https://www.bundeswehr.de/de/menschen-karrieren/neuer-wehrdienst"),
    ("Antworten zum neuen Wehrdienst", "https://www.bundesregierung.de/breg-de/aktuelles/antworten-zum-neuen-wehrdienst-2397476"),
    ("Steuerbefreiungen § 3 EStG", "https://www.gesetze-im-internet.de/estg/__3.html"),
    ("Entlassungsgeld", "https://www.dienstzeitende.de/dze-abc/entlassungsgeld-214/"),
    ("Familienversicherung § 10 SGB V", "https://www.gesetze-im-internet.de/sgb_5/__10.html"),
    ("Mindestbeitrag freiwillige GKV 2026", "https://covago.de/mindestbemessungsgrundlage-2026/"),
    ("Auslandskrankenversicherung Vergleich", "https://www.abenteuer-vanlife.de/weltreise-auslandskrankenversicherung-vergleich/"),
    ("Reisehinweise VAE", "https://www.auswaertiges-amt.de/de/reiseundsicherheit/vereinigtearabischeemiratesicherheit-202332"),
    ("Thailand, Einreise (Botschaft Berlin)", "https://berlin.thaiembassy.org/de/page/allgemeine-informationen?menu=624afc370442b4457e30b123"),
    ("Thailand, 30 Tage ab 15.09.2026", "https://www.fragomen.com/insights/thailand-reduction-in-visa-exempt-stay-duration-forthcoming.html"),
    ("DTV-Visum", "https://dtv.in.th/country/germany"),
    ("Arbeiten ohne Work Permit", "https://www.tilleke.com/insights/foreigners-beware-penalties-working-without-permit-may-be-dire/"),
    ("Wakeparks Thailand", "https://wakeparksthailand.com/wakeboarding-in-thailand/"),
    ("Philippinen, visafrei", "https://immigration.gov.ph/visas/visa-waiver/"),
    ("Tarif SHK Bayern", "https://cgm.de/news/shk-bayern-2024/"),
    ("Mindestausbildungsvergütung", "https://www.bibb.de/de/pressemitteilung_212952.php"),
    ("Verkürzung, § 27c HwO", "https://www.gesetze-im-internet.de/hwo/__27c.html"),
    ("Vorzeitige Zulassung, HWK München", "https://www.hwk-muenchen.de/artikel/vorzeitige-zulassung-zur-gesellen-oder-abschlusspruefung-74,0,3413.html"),
    ("Meisterkurs HWK München", "https://www.hwk-muenchen-bildung.de/artikel/meistervorbereitungskurs-zum-installateur-und-heizungsbauermeister-teile-i-und-ii-3741,0,143.html"),
    ("Städtische Meisterschule München", "https://www.meisterschulen-muenchen.de/Installateure-und-Heizungsbau_9_0.html"),
    ("Teil III/IV HWK München", "https://www.hwk-muenchen.de/kurse/meistervorbereitungskurs-teil-iii-und-teil-iv-fuer-alle-gewerke-74,0,coursedetail.html?id=1215866"),
    ("Aufstiegs-BAföG, Erlass § 13b", "https://www.gesetze-im-internet.de/afbg/__13b.html"),
    ("Aufstiegs-BAföG, Fördersätze", "https://www.aufstiegs-bafoeg.de/aufstiegsbafoeg/de/die-foerderung/wie-wird-gefoerdert/wie-wird-mit-dem-aufstiegs-bafoeg-gefoerdert.html"),
    ("Meisterbonus Bayern", "https://www.stmwi.bayern.de/wirtschaft/ausbildung-beruf/meisterbonus/"),
    ("Nachfolge im Handwerk (ZDH)", "https://www.zdh.de/ueber-uns/fachbereich-gewerbefoerderung/betriebsnachfolge/"),
    ("KfW Nachfolge-Monitoring 2026", "https://www.kfw.de/PDF/Download-Center/Konzernthemen/Research/PDF-Dokumente-Fokus-Volkswirtschaft/Fokus-2026/Fokus-Nr.-526-Januar-2026-Nachfolge-Monitoring.pdf"),
    ("AWH-Verfahren", "https://www.handwerk-unternehmenswert.de/wissen/unternehmenswert-ermitteln-handwerk-awh"),
    ("KfW ERP-Förderkredit 077", "https://www.kfw.de/inlandsfoerderung/Unternehmen/Gr%C3%BCnden-Nachfolgen/F%C3%B6rderprodukte/ERP-F%C3%B6rderkredit-Gr%C3%BCndung-und-Nachfolge-(077)/"),
    ("LfA Förderbank Bayern", "https://www.lfa.de/website/de/foerderangebote/gruendung-wachstum/gruendung/index.php"),
    ("Umsatzrendite nach Betriebsgröße", "https://www.handwerk-magazin.de/umsatzrendite-169576/"),
    ("SHK-Handwerk 2025 (ZVSHK)", "https://www.zvshk.de/presse/shk-handwerk-2025-umsatz-und-auftraege-ruecklaeufig-investitionsstau-bremst-branche"),
    ("Schweiz, Meldeverfahren", "https://www.zh.ch/de/wirtschaft-arbeit/erwerbstaetigkeit-auslaender/eu-efta-staatsangehoerige/meldeverfahren-eu-efta-staatsangehoerige.html"),
    ("Schweiz, Mindestlöhne Gebäudetechnik 2026", "https://suissetec.ch/files/PDFs/Recht/GAV_Salaer/Deutsch/Mindestl%C3%B6hne%202026-d.pdf"),
    ("Schweiz, MWST ausländische Firmen", "https://www.estv.admin.ch/de/mwst-steuerpflicht-auslaendische-unternehmen"),
    ("Schweiz, GmbH", "https://www.kmu.admin.ch/de/gmbh-haftung-stammkapital-gruendung"),
    ("Porsche 911 Preise", "https://de.motor1.com/news/746613/porsche-911-carrera-s-2025-facelift/"),
    ("Kleinunternehmer § 19 UStG", "https://www.gesetze-im-internet.de/ustg_1980/__19.html"),
    ("Einkommensteuertarif § 32a", "https://www.gesetze-im-internet.de/estg/__32a.html"),
    ("Revolut Preise 2026", "https://www.neuebanken.de/revolut-preiserhoehung-2026/"),
    ("Revolut Tagesgeld", "https://www.biallo.de/tagesgeld/test/revolut/"),
    ("Revolut Aktion 4,25 %", "https://www.finanztip.de/daily/tagesgeld-rekord-425-p-a-aber-mit-zwei-haken/"),
    ("EZB-Zinsentscheid 10.09.2026", "https://www.ecb.europa.eu/press/pr/date/2026/html/ecb.mp260910~314e508016.en.html"),
    ("Tagesgeld-Vergleich Finanztip", "https://www.finanztip.de/tagesgeld/"),
    ("Welt-ETFs, Finanztip", "https://www.finanztip.de/indexfonds-etf/"),
    ("MSCI World Historie", "https://www.finanztip.de/indexfonds-etf/msci-world/"),
    ("Basiszins Vorabpauschale 2026", "https://www.bundesfinanzministerium.de/Content/DE/Downloads/BMF_Schreiben/Steuerarten/Investmentsteuer/2026-01-13-basiszins-berechnung-vorabpauschale.html"),
    ("Altersvorsorgedepot", "https://www.finanztip.de/altersvorsorge/altersvorsorgedepot/"),
    ("Holding, § 8b KStG", "https://resolvio.com/wissen/grundlagen/holding-schachtelprivileg-wann-dividenden-und-verkaufserloese-zu-95-steuerfrei-sind"),
    ("Senkung Körperschaftsteuer", "https://www.bundesfinanzministerium.de/Web/DE/Themen/Steuern/Wachstumsbooster/wachstumsbooster.html"),
    ("Firmenwagen 1-%-Regel", "https://www.adac.de/rund-ums-fahrzeug/elektromobilitaet/elektroauto/elektroauto-firmenwagen-steuern/"),
    ("CFD-Verluste (ESMA)", "https://www.esma.europa.eu/press-news/esma-news/esma-agrees-prohibit-binary-options-and-restrict-cfds-protect-retail-investors"),
    ("Krypto-Haltefrist", "https://www.neuebanken.de/krypto-haltefrist-abschaffung/"),
]
add('<section class="kapitel"><div class="kopf" style="--farbe: var(--tinte); grid-template-columns: 1fr"><div><div class="etikett">Belege</div><h2>Quellen</h2></div></div>')
add('<p class="ziel-satz" style="font-size:9.4pt">Recherchiert am 26.09.2026. Zahlen wie Zinsen, Tarife und Visaregeln ändern sich. Vor jeder großen Entscheidung die Quelle neu prüfen.</p>')
add('<ol class="quellen">' + "".join(f'<li><b>{t}</b><br><a href="{u}">{u}</a></li>' for t, u in quellen) + '</ol>')
add('</section>')

add('</body></html>')
(HIER / "plan.html").write_text("\n".join(html))
print("plan.html geschrieben")
