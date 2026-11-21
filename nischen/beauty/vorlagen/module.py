"""Der Baukasten Beauty: vier Behandlungs-Module. EINE Quelle für Regeln, Seitentexte, Anzeigen, Vorbereitung,
Google-Texte und Planungs-Annahmen. kunde-anlegen.py und tabellen-bauen.py lesen diese Datei.

Wie beim Kfz-Baukasten gilt: Skelett von Seite und Anzeigen ist für alle Kunden gleich, getauscht wird nur das Modul.

Platzhalter {{feld}} füllt kunde-anlegen.py aus den Daten der Zentrale (z. B. {{betrieb}}, {{ort}}, {{behandler_name}},
{{beratung_name}}, {{beratung_minuten}}, {{beratung_wort}}, {{leistung_1}}, {{preis_1}}, {{gewinn}}, {{aktion_ende_kurz}}).

GRUNDBAUSTEIN VERKAUF, Fassung 2 (Nutzer-Vorgabe + Recherche reports/Verkaufsstarke Beauty Anzeigen Meta.md, 21.11.2026):
  AUFS BILD nur: Kicker 1–3 Wörter · Überschrift = Angebot oder Nutzen, höchstens ~6 Wörter · EINE Unterzeile (höchstens ~10 Wörter;
  beim Gewinnspiel die Bedingung „Im Lostopf: wer bis … bucht und zum Termin kommt“) · Knopf 2–3 Wörter. Zusammen höchstens 15–20 Wörter.
  Keine Hinweiszeile, kein „Hier behandelt Sie …“. Was die Kundin bekommt, muss in 2 Sekunden klar sein.
  IN DEN ANZEIGENTEXT: die ersten 125 Zeichen = Haken + Angebot, danach Häkchen, Pflichtangaben, Bedingungen.
  Jedes Studio hat ein Neukundenangebot (Pflichtfeld im Formular) → immer die Angebots-Anzeige ANGEBOT_ANZEIGE zuerst.
Bisherige Regeln dazu:
  1. Haken in der ersten Zeile: ein Wunsch oder ein Ärger der Kundin („Nie wieder hinterhertelefonieren“, „Augenbrauen,
     die morgens schon fertig sind“). Keine Makel-Ansprache bei Ärzten.
  2. Konkretes Angebot: Leistung + Preis, wo erlaubt. Kein „Beauty für alle“.
  3. Nutzen in 2–3 Häkchen-Zeilen (✔), kurz und greifbar.
  4. Vertrauen: wer behandelt, Erfahrung, echte Fotos, ehrlicher Rat.
  5. Ein klarer Schritt, verkaufend formuliert: „Jetzt Termin sichern“, „Freie Termine ansehen“. Echte Knappheit
     („Termine sind begrenzt“), nie erfundene („nur noch 2 Plätze“), nie Garantien.
  Die Werberegeln unten gehen immer vor: Ärzte und Zahnärzte sachlich, ohne Rabatt, Verlosung, „kostenlos“.

Rechtliche Leitplanken (Recherche Nov. 2026, research_notes/Beauty Tool Abläufe und Anzeigen/, keine Rechtsberatung):
- Faltenbehandlung (Ärzte, Heilpraktiker): Heilmittelwerbegesetz. Kein „Botox“ (§ 10 HWG, Google sperrt den Begriff),
  kein Vorher/Nachher (BGH I ZR 170/24, auch Stories), keine Verlosung, keine Rabatte/Festpreis-Aktionen (GOÄ),
  kein „kostenlos“ (OLG Frankfurt 6 U 60/26: kostenlose ärztliche Beratung = Zuwendung nach § 7 HWG),
  keine Makel-Ansprache („Sie haben Falten?“, Meta), keine Garantie- und Schmerzfrei-Versprechen. Erst Beratung, dann Behandlung.
- Laser (Kosmetik mit NiSV-Fachkunde): UWG/PAngV. „Dauerhaft“ nur mit Hinweis direkt daneben (mehrere Sitzungen,
  keine Garantie; OLG Karlsruhe 6 U 181/23, OLG Frankfurt 6 U 189/23). Preis pro Sitzung nie ohne Hinweis auf die Sitzungszahl.
  Verlosung, Neukunden-Preis, kostenlose Probebehandlung erlaubt. Kein „medizinisch“ ohne Arzt (OLG Nürnberg 3 U 562/25).
- Permanent Make-up (Kosmetik): UWG/PAngV. Ergebnisfotos ja, Vorher/Nachher-Collage nur vorsichtig (Grauzone, nur auf der Seite).
  Verlosung und kostenlose Beratung erlaubt. Preis inkl. Nachstechtermin nennen.
- Bleaching (nur Zahnarztpraxis, > 0,1 % H2O2 darf nur der Zahnarzt): Berufsordnung, sachlich. Kein „perfekte Zähne“,
  keine Rabatte/Gutscheine, keine Verlosung, kein „kostenlos“. „ab“-Preis auf der Seite erlaubt (VG Münster), nicht als Blickfang.
- Alle: Meta-Zielgruppe ab 18, im Formular Häkchen „mindestens 18“, keine Gesundheitsfragen im Formular.

Vorbereitungs-Hinweise sind VORSCHLÄGE. Das Studio prüft und gibt sie frei (Schritte-Seite „Hinweise vor dem Termin prüfen“).
"""

BEHANDLER = ["Arzt/Ärztin", "Heilpraktiker/in", "Kosmetik mit NiSV-Fachkunde", "Kosmetik/PMU-Studio", "Zahnarztpraxis"]

MODULE = {
    # ------------------------------------------------------------------------------------------------ Laser
    "Laser": {
        "kuerzel": "laser",
        "recht_kurz": "Wettbewerbsrecht und Preisangaben; „dauerhaft“ nur mit Hinweis auf mehrere Sitzungen und ohne Garantie",
        "name": "Laser-Haarentfernung",
        "behandler": ["Kosmetik mit NiSV-Fachkunde", "Arzt/Ärztin"],
        "qualifikation": "NiSV-Fachkunde (Zertifikat) für jede Person, die lasert. Ohne Nachweis kein Kunde.",
        "regeln": {"verlosung": True, "vorher_nachher": True, "rabatt": True, "kostenlos": True, "preise": True, "direkt": True},
        "beratung": {"name": "Haut- und Haaranalyse mit Probeschuss", "minuten": 20},
        "leistungen_beispiel": "Achseln | 20 | ab 59 €; Bikinizone | 30 | ab 79 €; Beine komplett | 60 | ab 199 €",
        "vorbereitung": [
            "Die Stelle 24 Stunden vorher rasieren, nicht epilieren und nicht wachsen",
            "4 Wochen vorher nicht mehr epilieren, wachsen oder zupfen",
            "2 Wochen vorher keine Sonne, kein Solarium, kein Selbstbräuner",
            "Am Tag selbst keine Creme, kein Deo und kein Make-up auf der Stelle",
            "Nehmen Sie Medikamente ein (z. B. Antibiotika), sagen Sie es uns bitte vorher",
        ],
        "farben": {"bg": "#EEF1F2", "ink": "#14202A", "accent": "#1E6B73", "soft": "#DCE4E6", "dunkel": "#14262B", "hell": "#F6F8F8"},
        "lp": {
            "titel": "Laser-Haarentfernung in {{ort}} · {{betrieb}}",
            "kicker": "Laser-Haarentfernung in {{ort}}",
            "h1": "Glatte Haut, <em>ohne ständig zu rasieren.</em>",
            "sub": "Starten Sie mit einer {{beratung_wort}}en Haut- und Haaranalyse inklusive Probeschuss. Termin direkt hier wählen.",
            "hinweis": "Dauerhafte Haarreduktion braucht meist 6 bis 8 Sitzungen im Abstand von einigen Wochen. Wie viele es bei Ihnen sind, hängt von Haut und Haar ab. Ein bestimmtes Ergebnis können wir nicht garantieren.",
            "schritte": ["Termin online wählen", "Analyse und Probeschuss, Preis für alle Sitzungen vorab", "Sie entscheiden in Ruhe"],
            "vorteile": [
                "Moderner Diodenlaser, behandelt von Fachkräften mit NiSV-Fachkunde",
                "Den Gesamtpreis für alle Sitzungen kennen Sie vor dem Start",
                "Probeschuss an einer kleinen Stelle, damit Sie wissen, wie es sich anfühlt",
                "Termine online buchen und absagen, ohne Warteschleife",
            ],
            "faq": [
                ("Wie viele Sitzungen brauche ich?", "Meist 6 bis 8, je nach Körperstelle, Haut und Haar. Haare wachsen in Phasen nach, deshalb liegen zwischen den Sitzungen einige Wochen."),
                ("Tut das weh?", "Die meisten beschreiben es als kurzes Wärmegefühl oder leichtes Zwicken. Beim Probeschuss in der Analyse merken Sie selbst, wie es sich anfühlt."),
                ("Ist die Haarentfernung dauerhaft?", "Ziel ist eine dauerhafte Reduktion der Haare. Einzelne Haare können nachwachsen, eine Garantie für ein bestimmtes Ergebnis gibt es nicht."),
                ("Wann ist die beste Zeit zu starten?", "Herbst und Winter: Vor und nach den Sitzungen sollte die Haut nicht gebräunt sein. Wer jetzt startet, ist bis zum Sommer meist durch."),
                ("Was kostet es?", "Die Preise pro Sitzung stehen oben. Den Gesamtpreis für alle Sitzungen nennen wir Ihnen in der Analyse, bevor Sie sich entscheiden."),
                ("Für wen ist es nicht geeignet?", "Bei sehr hellen, grauen oder roten Haaren wirkt der Laser kaum. In der Schwangerschaft behandeln wir nicht. Das klären wir in der Analyse."),
            ],
        },
        "anzeigen": [
            {"id": "l1-probeschuss", "stil": "a", "foto": "foto-1", "kicker": "Für Neukundinnen und Neukunden",
             "h1": "Analyse mit Probeschuss: <em>{{beratung_wort}}.</em>",
             "sub": "Wir prüfen Haut und Haar und nennen Ihnen den Preis für alle Sitzungen, bevor Sie starten.",
             "fine": "Dauerhafte Haarreduktion braucht meist 6–8 Sitzungen. Ergebnisse sind individuell.",
             "cta": "Termin jetzt sichern",
             "primaer": "Haarentfernung mit Laser, ohne Rätselraten.\n✔ {{beratung_wort}}e Analyse von Haut und Haar\n✔ Probeschuss: Sie spüren vorher, wie es sich anfühlt\n✔ Gesamtpreis für alle Sitzungen, bevor Sie sich entscheiden\n👉 Jetzt Termin sichern, die freien Zeiten sehen Sie sofort.",
             "headline": "Analyse mit Probeschuss: {{beratung_wort}}", "beschreibung": "Termin in 30 Sekunden online wählen."},
            {"id": "l2-saison", "stil": "b", "foto": "foto-2", "kicker": "Jetzt ist die beste Zeit",
             "h1": "Im Winter starten, <em>im Sommer glatt.</em>",
             "sub": "Haarentfernung mit Diodenlaser bei {{betrieb}}. Ihre erste Sitzung jetzt online buchen.",
             "fine": "Meist 6–8 Sitzungen im Abstand einiger Wochen. Keine Garantie für ein bestimmtes Ergebnis.",
             "cta": "Jetzt Termin sichern",
             "primaer": "Wer jetzt startet, ist bis zum Sommer meist durch. Laser-Haarentfernung braucht ein paar Monate, darum lohnt sich der Start im Herbst oder Winter.\n✔ {{beratung_wort}}e Analyse mit Probeschuss bei {{betrieb}}\n✔ Mehrere Sitzungen, klarer Plan, Gesamtpreis vorab\n👉 Jetzt Termin sichern.",
             "headline": "Im Winter starten, im Sommer glatt", "beschreibung": "Laser-Haarentfernung in {{ort}}."},
            {"id": "l3-preis", "stil": "c", "foto": "foto-3", "kicker": "Preise ohne Überraschung",
             "h1": "{{leistung_1}} <em>{{preis_1}}</em>",
             "sub": "pro Sitzung. Den Gesamtpreis für alle Sitzungen erfahren Sie vorab in der Analyse.",
             "fine": "Preis pro Sitzung, meist 6–8 Sitzungen nötig. Ergebnisse sind individuell.",
             "cta": "Termin jetzt sichern",
             "primaer": "Laser-Haarentfernung in {{ort}}: {{leistung_1}} {{preis_1}} pro Sitzung.\n✔ Wie viele Sitzungen Sie brauchen, sagen wir Ihnen vorab\n✔ Gesamtpreis vor der ersten Behandlung\n✔ Termin in 30 Sekunden online gebucht\n👉 Jetzt freien Termin sichern.",
             "headline": "{{leistung_1}} {{preis_1}} pro Sitzung", "beschreibung": "Gesamtpreis vorab in der Analyse."},
            {"id": "l4-online", "stil": "d", "foto": "foto-1", "kicker": "Ohne Anruf, ohne Warteschleife",
             "h1": "Termin in <em>30 Sekunden</em> online buchen.",
             "sub": "Freie Zeiten sehen, Termin wählen, per E-Mail bestätigen. Fertig.",
             "fine": "Laser-Haarentfernung bei {{betrieb}}, {{ort}}. Meist 6–8 Sitzungen nötig.",
             "cta": "Freie Termine ansehen",
             "primaer": "Nie wieder hinterhertelefonieren: Bei {{betrieb}} sehen Sie alle freien Termine online und buchen Ihre {{beratung_wort}}e Analyse mit Probeschuss in 30 Sekunden.\n✔ Termin antippen ✔ per E-Mail bestätigen ✔ Erinnerung kommt von selbst\n👉 Freie Termine ansehen.",
             "headline": "Freie Termine online ansehen", "beschreibung": "Laser-Haarentfernung in {{ort}}."},
            {"id": "l5-fachkunde", "stil": "e", "foto": "foto-3", "kicker": "Geprüfte Fachkunde nach NiSV",
             "h1": "Laser gehört <em>in geübte Hände.</em>",
             "sub": "{{behandler_name}} und Team behandeln mit Diodenlaser und Fachkundenachweis.",
             "fine": "Fachkunde nach der Verordnung zum Schutz vor nichtionisierender Strahlung (NiSV).",
             "cta": "Analyse sichern",
             "primaer": "Laser gehört in geübte Hände. Bei {{betrieb}} behandeln ausschließlich Fachkräfte mit Fachkundenachweis nach NiSV.\n✔ {{beratung_wort}}e Haut- und Haaranalyse vorab\n✔ Ehrlicher Rat, ob Laser bei Ihnen passt\n👉 Jetzt Analyse sichern.",
             "headline": "Laser mit geprüfter Fachkunde", "beschreibung": "Analyse mit Probeschuss: {{beratung_wort}}."},
        ],
        "verlosung": {"id": "v1-verlosung", "stil": "b", "foto": "foto-2", "kicker": "Verlosung bis {{aktion_ende_kurz}}",
                      "h1": "Wir verlosen <em>{{gewinn}}.</em>", "sub": "Unter allen Teilnehmerinnen und Teilnehmern ab 18. Mitmachen dauert 30 Sekunden.",
                      "fine": "Teilnahme ab 18. Teilnahmebedingungen auf der Seite.", "cta": "Jetzt teilnehmen",
                      "primaer": "✨ Gewinnspiel bei {{betrieb}}: Wir verlosen {{gewinn}}.\n✔ So machen Sie mit: bis {{aktion_ende_kurz}} einen Termin online buchen und wahrnehmen\n✔ Jeder wahrgenommene Termin ist ein Los\n✔ Ab 18, Teilnahmebedingungen auf der Seite\n👉 Jetzt Termin buchen und mitmachen.",
                      "headline": "Wir verlosen {{gewinn}}", "beschreibung": "Teilnahme bis {{aktion_ende_kurz}}."},
        "google": {
            "keywords": ["laser haarentfernung {{ort_klein}}", "haarentfernung {{ort_klein}}", "dauerhafte haarentfernung {{ort_klein}}",
                         "diodenlaser {{ort_klein}}", "laser haarentfernung kosten", "laser haarentfernung achseln", "laser haarentfernung beine"],
            "negativ": ["ipl gerät", "gerät kaufen", "zu hause", "philips", "braun", "selber", "ausbildung", "schulung", "job",
                        "stellenangebot", "gebraucht", "test", "erfahrungen forum"],
            "headlines": ["Laser-Haarentfernung {{ort}}", "Analyse mit Probeschuss", "Termin online buchen", "Gesamtpreis vorab",
                          "Diodenlaser mit NiSV-Fachkunde", "Jetzt im Winter starten", "{{betrieb}}", "Freie Termine ansehen",
                          "{{leistung_1}} {{preis_1}}/Sitzung", "Ohne Warteschleife buchen", "Fachkräfte mit Fachkunde",
                          "Haarentfernung in {{ort}}", "Probeschuss: {{beratung_wort}}", "Ihr Termin in 30 Sekunden", "Neukunden willkommen"],
            "descriptions": ["Analyse mit Probeschuss, Gesamtpreis vorab. Freie Termine sehen und online buchen.",
                             "Diodenlaser, Fachkräfte mit NiSV-Fachkunde. Meist 6–8 Sitzungen, Ergebnis individuell.",
                             "Jetzt im Herbst oder Winter starten, bis zum Sommer meist durch. Termin online wählen.",
                             "{{betrieb}} in {{ort}}. Termin wählen, per E-Mail bestätigen, fertig."],
            "pfad": ["Laser", "Termin"],
        },
        "zielgruppe": {"alter": "18 bis 45", "geschlecht": "alle (Advantage+ findet die Richtigen); Frauen sind die Mehrheit"},
        "annahmen": {"kosten_pro_termin": 35, "erscheinen": 0.75, "kauf": 0.5, "meta_anteil": 0.7, "kundenwert": 900},
        "preis_empfehlung": "Onboarding ca. 700 €, Monatsgebühr ca. 799–999 €, Werbebudget ca. 500–800 €",
    },

    # ------------------------------------------------------------------------------------------------ Permanent Make-up
    "Permanent Make-up": {
        "kuerzel": "pmu",
        "recht_kurz": "Wettbewerbsrecht und Preisangaben; Ergebnisfotos nur echte, Vorher/Nachher-Collagen nicht in Anzeigen",
        "name": "Permanent Make-up",
        "behandler": ["Kosmetik/PMU-Studio", "Kosmetik mit NiSV-Fachkunde", "Arzt/Ärztin"],
        "qualifikation": "Hygieneschulung und Nachweis der PMU-Ausbildung; Arbeitsproben (echte Ergebnisfotos).",
        "regeln": {"verlosung": True, "vorher_nachher": False, "rabatt": True, "kostenlos": True, "preise": True, "direkt": True},
        "beratung": {"name": "Beratung mit Vorzeichnen", "minuten": 30},
        "leistungen_beispiel": "Powder Brows | 150 | 390 € inkl. Nachstechen; Lippen Aquarell | 150 | 450 € inkl. Nachstechen; Lidstrich | 120 | 290 € inkl. Nachstechen",
        "vorbereitung": [
            "Kommen Sie bei Augenbrauen am besten ungeschminkt, bei Lippen ohne Lippenstift",
            "24 Stunden vorher bitte keinen Alkohol",
            "Blutverdünnende Mittel nur nach Rücksprache mit Ihrem Arzt weglassen, nie auf eigene Faust",
            "Hatten Sie schon einmal Lippenherpes? Bei Lippen-Pigmentierung sagen Sie es uns bitte vorher",
            "Planen Sie den Nachstechtermin ein, meist einige Wochen später",
        ],
        "farben": {"bg": "#F4ECE7", "ink": "#2A1E1A", "accent": "#8A5240", "soft": "#E6D6CD", "dunkel": "#2B1F1B", "hell": "#FAF5F2"},
        "lp": {
            "titel": "Permanent Make-up in {{ort}} · {{betrieb}}",
            "kicker": "Permanent Make-up in {{ort}}",
            "h1": "Augenbrauen, die <em>morgens schon fertig sind.</em>",
            "sub": "Starten Sie mit einer {{beratung_wort}}en Beratung mit Vorzeichnen: Sie sehen die Form, bevor pigmentiert wird. Termin direkt hier wählen.",
            "hinweis": "Ergebnis und Haltbarkeit hängen von Haut, Pflege und Sonne ab. Ein Nachstechtermin gehört dazu.",
            "schritte": ["Termin online wählen", "Beratung und Vorzeichnen, Form gemeinsam festlegen", "Pigmentieren, Nachstechtermin inklusive"],
            "vorteile": [
                "Form und Farbe passend zu Ihrem Gesicht, gemeinsam vorgezeichnet",
                "Weich schattiert (Powder Brows) statt harter Linien",
                "Nachstechtermin im Preis enthalten",
                "Termine online buchen und absagen, ohne Warteschleife",
            ],
            "faq": [
                ("Wie lange hält Permanent Make-up?", "Meist ein bis drei Jahre, je nach Haut, Pflege und Sonne. Danach frischen wir die Farbe auf."),
                ("Tut das weh?", "Die meisten empfinden es als gut auszuhalten. Wir arbeiten auf Wunsch mit einer betäubenden Creme."),
                ("Was passiert in der Beratung?", "Wir sprechen über Ihre Wünsche, zeichnen die Form vor und Sie sehen das Ergebnis im Spiegel, bevor irgendetwas pigmentiert wird."),
                ("Wie sieht es direkt danach aus?", "In den ersten Tagen ist die Farbe kräftiger, danach wird sie weicher. Nach dem Nachstechtermin ist das Ergebnis fertig."),
                ("Was kostet es?", "Die Preise stehen oben, der Nachstechtermin ist enthalten. Sie zahlen erst, wenn wir pigmentieren."),
                ("Wann geht es nicht?", "In Schwangerschaft und Stillzeit und bei bestimmten Hauterkrankungen pigmentieren wir nicht. Das klären wir in der Beratung."),
            ],
        },
        "anzeigen": [
            {"id": "p1-vorzeichnen", "stil": "a", "foto": "foto-1", "kicker": "Erst sehen, dann entscheiden",
             "h1": "Beratung mit Vorzeichnen: <em>{{beratung_wort}}.</em>",
             "sub": "Sie sehen Ihre neue Augenbrauen-Form im Spiegel, bevor pigmentiert wird.",
             "fine": "Permanent Make-up bei {{betrieb}}, {{ort}}. Nachstechtermin inklusive.",
             "cta": "Termin jetzt sichern",
             "primaer": "Unsicher, welche Form zu Ihnen passt? Sehen Sie es, bevor Sie sich entscheiden.\n✔ {{beratung_wort}}e Beratung bei {{betrieb}}\n✔ Wir zeichnen Ihre Augenbrauen vor, Sie sehen das Ergebnis im Spiegel\n✔ Erst dann entscheiden Sie, in Ruhe\n👉 Jetzt Termin sichern.",
             "headline": "Beratung mit Vorzeichnen: {{beratung_wort}}", "beschreibung": "Erst sehen, dann entscheiden."},
            {"id": "p2-morgens", "stil": "b", "foto": "foto-2", "kicker": "Powder Brows",
             "h1": "Augenbrauen, die <em>morgens schon fertig sind.</em>",
             "sub": "Weich schattiert, passend zu Ihrem Gesicht. Bei {{betrieb}} in {{ort}}.",
             "fine": "Haltbarkeit meist 1–3 Jahre, je nach Haut und Pflege.",
             "cta": "Termin jetzt sichern",
             "primaer": "Jeden Morgen Augenbrauen nachzeichnen? Mit Powder Brows sind sie schon fertig, wenn Sie aufstehen.\n✔ Weich schattiert, passend zu Ihrem Gesicht\n✔ Beim Sport, im Urlaub, am Morgen: immer gleich\n✔ Beratung mit Vorzeichnen vorab\n👉 Jetzt Termin sichern.",
             "headline": "Powder Brows in {{ort}}", "beschreibung": "Beratung mit Vorzeichnen."},
            {"id": "p3-preis", "stil": "c", "foto": "foto-3", "kicker": "Ein Preis, alles drin",
             "h1": "{{leistung_1}} <em>{{preis_1}}</em>",
             "sub": "Beratung, Vorzeichnen, Pigmentieren und Nachstechtermin.",
             "fine": "Preis laut Preisliste von {{betrieb}}. Ergebnis abhängig von Haut und Pflege.",
             "cta": "Termin jetzt sichern",
             "primaer": "{{leistung_1}} bei {{betrieb}} für {{preis_1}}. Ein Preis, alles drin.\n✔ Beratung und Vorzeichnen\n✔ Pigmentieren\n✔ Nachstechtermin inklusive\n👉 Jetzt freien Termin sichern.",
             "headline": "{{leistung_1}} {{preis_1}}", "beschreibung": "Nachstechtermin inklusive."},
            {"id": "p4-online", "stil": "d", "foto": "foto-1", "kicker": "Ohne Anruf, ohne Warteschleife",
             "h1": "Termin in <em>30 Sekunden</em> online buchen.",
             "sub": "Freie Zeiten sehen, Termin wählen, per E-Mail bestätigen. Fertig.",
             "fine": "Permanent Make-up bei {{betrieb}}, {{ort}}.",
             "cta": "Freie Termine ansehen",
             "primaer": "Nie wieder hinterhertelefonieren: Bei {{betrieb}} sehen Sie alle freien Termine online und buchen Ihre {{beratung_wort}}e Beratung mit Vorzeichnen in 30 Sekunden.\n✔ Termin antippen ✔ per E-Mail bestätigen ✔ Erinnerung kommt von selbst\n👉 Freie Termine ansehen.",
             "headline": "Freie Termine online ansehen", "beschreibung": "Permanent Make-up in {{ort}}."},
            {"id": "p5-kuenstlerin", "stil": "e", "foto": "foto-3", "kicker": "Handarbeit mit Erfahrung",
             "h1": "Jede Braue <em>wird einzeln geplant.</em>",
             "sub": "{{behandler_name}} nimmt sich für Form, Farbe und Ihre Wünsche Zeit.",
             "fine": "Permanent Make-up bei {{betrieb}}. Ergebnisse sind individuell.",
             "cta": "Beratung sichern",
             "primaer": "Permanent Make-up ist Handarbeit. Bei {{betrieb}} wird jede Braue einzeln geplant: Form, Farbe, Ihr Typ.\n✔ {{beratung_wort}}e Beratung mit Vorzeichnen\n✔ Sie sehen die Form, bevor pigmentiert wird\n👉 Jetzt Beratung sichern.",
             "headline": "Jede Braue einzeln geplant", "beschreibung": "Beratung mit Vorzeichnen."},
        ],
        "verlosung": {"id": "v1-verlosung", "stil": "b", "foto": "foto-2", "kicker": "Verlosung bis {{aktion_ende_kurz}}",
                      "h1": "Wir verlosen <em>{{gewinn}}.</em>", "sub": "Unter allen Teilnehmerinnen und Teilnehmern ab 18. Mitmachen dauert 30 Sekunden.",
                      "fine": "Teilnahme ab 18. Teilnahmebedingungen auf der Seite.", "cta": "Jetzt teilnehmen",
                      "primaer": "✨ Gewinnspiel bei {{betrieb}}: Wir verlosen {{gewinn}}.\n✔ So machen Sie mit: bis {{aktion_ende_kurz}} einen Termin online buchen und wahrnehmen\n✔ Jeder wahrgenommene Termin ist ein Los\n✔ Ab 18, Teilnahmebedingungen auf der Seite\n👉 Jetzt Termin buchen und mitmachen.",
                      "headline": "Wir verlosen {{gewinn}}", "beschreibung": "Teilnahme bis {{aktion_ende_kurz}}."},
        "google": {
            "keywords": ["permanent make up {{ort_klein}}", "powder brows {{ort_klein}}", "microblading {{ort_klein}}",
                         "augenbrauen pigmentieren {{ort_klein}}", "permanent make up augenbrauen", "lippen pigmentieren", "powder brows kosten"],
            "negativ": ["entfernen", "entfernung", "ausbildung", "schulung", "kurs", "gerät", "farbe kaufen", "job", "stellenangebot",
                        "selber", "fehlgeschlagen", "korrektur"],
            "headlines": ["Permanent Make-up {{ort}}", "Powder Brows in {{ort}}", "Beratung mit Vorzeichnen", "Termin online buchen",
                          "Nachstechtermin inklusive", "{{betrieb}}", "Freie Termine ansehen", "{{leistung_1}} {{preis_1}}",
                          "Weich schattierte Brauen", "Erst sehen, dann entscheiden", "Ohne Warteschleife buchen",
                          "Brauen morgens schon fertig", "Beratung {{beratung_wort}}", "Ihr Termin in 30 Sekunden", "Handarbeit mit Erfahrung"],
            "descriptions": ["Beratung mit Vorzeichnen: Sie sehen die Form vorab. Termin online wählen.",
                             "Powder Brows, Lippen und Lidstrich. Nachstechtermin im Preis enthalten.",
                             "Freie Termine sehen und in 30 Sekunden buchen. Bestätigung per E-Mail.",
                             "{{betrieb}} in {{ort}}. Jede Braue einzeln geplant."],
            "pfad": ["Brows", "Termin"],
        },
        "zielgruppe": {"alter": "25 bis 60", "geschlecht": "Frauen"},
        "annahmen": {"kosten_pro_termin": 45, "erscheinen": 0.75, "kauf": 0.6, "meta_anteil": 0.75, "kundenwert": 450},
        "preis_empfehlung": "Onboarding ca. 400–500 €, Monatsgebühr ca. 399–599 €, Werbebudget ca. 300–600 €",
    },

    # ------------------------------------------------------------------------------------------------ Faltenbehandlung
    "Faltenbehandlung": {
        "kuerzel": "falten",
        "recht_kurz": "Heilmittelwerbegesetz: kein „Botox“, kein Vorher/Nachher, keine Verlosung, keine Rabatte, kein „kostenlos“",
        "name": "Faltenbehandlung und Hyaluron",
        "behandler": ["Arzt/Ärztin", "Heilpraktiker/in"],
        "qualifikation": "Arzt/Ärztin (Muskelrelaxans und Hyaluron) oder Heilpraktiker/in (nur Hyaluron). Kosmetikstudios: nein.",
        "regeln": {"verlosung": False, "vorher_nachher": False, "rabatt": False, "kostenlos": False, "preise": False, "direkt": False},
        "beratung": {"name": "Beratungsgespräch", "minuten": 20},
        "leistungen_beispiel": "",
        "vorbereitung": [
            "Kommen Sie wenn möglich ungeschminkt",
            "Bringen Sie eine Liste Ihrer Medikamente mit",
            "Planen Sie nach einer Behandlung am selben Tag keinen Sport, keine Sauna und kein Solarium ein",
            "Für eine Behandlung müssen Sie mindestens 18 Jahre alt sein",
        ],
        "farben": {"bg": "#F3EEE8", "ink": "#25201C", "accent": "#7D4A47", "soft": "#E5DBD2", "dunkel": "#28211E", "hell": "#FAF7F3"},
        "lp": {
            "titel": "Faltenbehandlung in {{ort}} · {{betrieb}}",
            "kicker": "Ästhetische Behandlung in {{ort}}",
            "h1": "Erst beraten, <em>dann in Ruhe entscheiden.</em>",
            "sub": "{{fach_beratung}} zur Faltenbehandlung und zu Hyaluron bei {{behandler_name}}. Termin direkt hier wählen.",
            "hinweis": "Jede Behandlung erfolgt erst nach ausführlicher Aufklärung. Wie jede Behandlung kann sie Nebenwirkungen haben, Ergebnisse sind individuell. Die Kosten richten sich nach der Gebührenordnung und werden im Gespräch besprochen.",
            "schritte": ["Beratungstermin online wählen", "Gespräch und Aufklärung, alle Fragen geklärt", "Sie entscheiden in Ruhe, ob und wann"],
            "vorteile": [
                "Persönliches Gespräch mit {{behandler_name}}",
                "Ausführliche Aufklärung über Ablauf, Wirkung und Risiken",
                "Ein Behandlungsplan, der zu Ihnen passt, ohne Druck",
                "Termine online buchen und absagen, ohne Warteschleife",
            ],
            "faq": [
                ("Was passiert im Beratungsgespräch?", "Wir sprechen über Ihre Wünsche, schauen uns die Behandlungszone an und klären Sie über Ablauf, Wirkung und mögliche Nebenwirkungen auf. Danach entscheiden Sie in Ruhe."),
                ("Wer behandelt?", "{{behandler_name}}. Behandlungen mit Injektionen gehören in ärztliche oder heilkundliche Hände."),
                ("Was kostet eine Behandlung?", "Das hängt von Behandlungszone und Aufwand ab. Die Kosten besprechen wir im Gespräch, bevor Sie sich entscheiden."),
                ("Kann ich direkt behandelt werden?", "Zuerst steht immer das Beratungsgespräch mit Aufklärung. Ob und wann behandelt wird, entscheiden Sie danach."),
                ("Muss ich etwas vorbereiten?", "Kommen Sie wenn möglich ungeschminkt und bringen Sie eine Liste Ihrer Medikamente mit. Alles Weitere steht in Ihrer Terminbestätigung."),
            ],
        },
        "anzeigen": [
            {"id": "f1-beratung", "stil": "a", "foto": "foto-1", "kicker": "Ästhetische Behandlung in {{ort}}",
             "h1": "Erst beraten, <em>dann in Ruhe entscheiden.</em>",
             "sub": "{{fach_beratung}} zur Faltenbehandlung und zu Hyaluron. Termin online wählen.",
             "fine": "Behandlung nur nach Aufklärung. Ergebnisse sind individuell.",
             "cta": "Beratungstermin wählen",
             "primaer": "Sie überlegen, ob eine Faltenbehandlung oder Hyaluron das Richtige für Sie ist? Im persönlichen Gespräch bei {{betrieb}} klären wir alle Fragen zu Ablauf, Wirkung und Risiken. Danach entscheiden Sie in Ruhe.\n👉 Beratungstermin online wählen.",
             "headline": "Erst beraten, dann entscheiden", "beschreibung": "Beratungstermin online wählen."},
            {"id": "f2-person", "stil": "b", "foto": "foto-3", "kicker": "Persönlich und ohne Druck",
             "h1": "{{behandler_name_kurz}} <em>nimmt sich Zeit.</em>",
             "sub": "Für Ihre Fragen, Ihre Wünsche und eine ehrliche Einschätzung.",
             "fine": "{{betrieb}}, {{ort}}. Behandlung nur nach Aufklärung.",
             "cta": "Beratungstermin wählen",
             "primaer": "Ein gutes Ergebnis beginnt mit einem guten Gespräch. {{behandler_name}} nimmt sich Zeit für Ihre Fragen und sagt Ihnen ehrlich, was möglich ist und was nicht.\n👉 Beratungstermin online wählen.",
             "headline": "Ehrliche Beratung in {{ort}}", "beschreibung": "{{behandler_name}} nimmt sich Zeit."},
            {"id": "f3-ablauf", "stil": "c", "foto": "foto-2", "kicker": "So einfach geht es",
             "h1": "In 3 Schritten <em>zu Ihrer Beratung.</em>",
             "sub": "Termin wählen, per E-Mail bestätigen, vorbeikommen.",
             "fine": "{{betrieb}}, {{ort}}. Behandlung nur nach Aufklärung.",
             "cta": "Freie Termine ansehen",
             "primaer": "Beratung zur Faltenbehandlung und zu Hyaluron, ganz einfach: Termin online wählen, per E-Mail bestätigen, vorbeikommen. Alle Fragen klären wir im Gespräch.\n👉 Freie Termine ansehen.",
             "headline": "Beratung in 3 Schritten", "beschreibung": "Freie Termine online ansehen."},
            {"id": "f4-hyaluron", "stil": "d", "foto": "foto-1", "kicker": "Lippen und Konturen",
             "h1": "Beratung zu <em>Hyaluron.</em>",
             "sub": "Was möglich ist, was dazugehört, was es kostet: alles im persönlichen Gespräch.",
             "fine": "{{betrieb}}, {{ort}}. Behandlung nur nach Aufklärung. Ergebnisse sind individuell.",
             "cta": "Beratungstermin wählen",
             "primaer": "Sie interessieren sich für eine Behandlung mit Hyaluron, zum Beispiel an den Lippen? Im Beratungsgespräch bei {{betrieb}} erfahren Sie, was möglich ist, was dazugehört und was es kostet.\n👉 Beratungstermin online wählen.",
             "headline": "Beratung zu Hyaluron", "beschreibung": "Persönlich, in {{ort}}."},
            {"id": "f5-online", "stil": "e", "foto": "foto-2", "kicker": "Ohne Anruf, ohne Warteschleife",
             "h1": "Ihr Beratungstermin, <em>online gebucht.</em>",
             "sub": "Freie Zeiten sehen, Termin wählen, per E-Mail bestätigen.",
             "fine": "{{betrieb}}, {{ort}}. Behandlung nur nach Aufklärung.",
             "cta": "Freie Termine ansehen",
             "primaer": "Bei {{betrieb}} sehen Sie alle freien Beratungstermine online und buchen in 30 Sekunden. Die Bestätigung kommt per E-Mail.\n👉 Freie Termine ansehen.",
             "headline": "Beratungstermin online buchen", "beschreibung": "Freie Zeiten ansehen."},
        ],
        "verlosung": None,
        "google": {
            "keywords": ["faltenbehandlung {{ort_klein}}", "faltenunterspritzung {{ort_klein}}", "hyaluron {{ort_klein}}",
                         "lippen aufspritzen {{ort_klein}}", "ästhetische medizin {{ort_klein}}", "faltenbehandlung kosten",
                         "hyaluron lippen"],
            "negativ": ["creme", "serum", "kaufen", "selber", "kurs", "ausbildung", "schulung", "job", "stellenangebot",
                        "türkei", "pen", "ohne nadel"],
            "headlines": ["Faltenbehandlung in {{ort}}", "Beratung zu Hyaluron", "Erst beraten, dann entscheiden", "Termin online buchen",
                          "{{fach_beratung}}", "{{betrieb}}", "Freie Termine ansehen", "Persönlich und ohne Druck",
                          "Aufklärung vor Behandlung", "Beratung in {{ort}}", "Ohne Warteschleife buchen", "Ihr Termin in 30 Sekunden",
                          "Ehrliche Einschätzung", "Ästhetik in {{ort}}", "Lippen und Konturen"],
            "descriptions": ["Persönliches Gespräch zu Faltenbehandlung und Hyaluron. Danach entscheiden Sie in Ruhe.",
                             "Ausführliche Aufklärung über Ablauf, Wirkung und Risiken. Termin online wählen.",
                             "Freie Beratungstermine sehen und in 30 Sekunden buchen. Bestätigung per E-Mail.",
                             "{{betrieb}} in {{ort}}. Behandlung nur nach Aufklärung."],
            "pfad": ["Beratung", "Termin"],
        },
        "zielgruppe": {"alter": "30 bis 65", "geschlecht": "alle; Frauen sind die Mehrheit, rund jeder neunte ist ein Mann (DGÄPC 2025)"},
        "annahmen": {"kosten_pro_termin": 60, "erscheinen": 0.75, "kauf": 0.5, "meta_anteil": 0.65, "kundenwert": 900},
        "preis_empfehlung": "Onboarding ca. 700 €, Monatsgebühr ca. 799–999 €, Werbebudget ca. 600–1.000 €",
    },

    # ------------------------------------------------------------------------------------------------ Bleaching
    "Bleaching": {
        "kuerzel": "bleaching",
        "recht_kurz": "Berufsordnung der Zahnärzte und Heilmittelwerbegesetz: sachlich, keine Rabatte, keine Verlosung, kein „kostenlos“",
        "name": "Zahnaufhellung (Bleaching)",
        "behandler": ["Zahnarztpraxis"],
        "qualifikation": "Nur Zahnarztpraxen. Bleaching-Studios ohne Zahnarzt sind rechtlich unsicher und kein Kunde.",
        "regeln": {"verlosung": False, "vorher_nachher": False, "rabatt": False, "kostenlos": False, "preise": True, "direkt": True},
        "beratung": {"name": "Erstgespräch Zahnaufhellung", "minuten": 20},
        "leistungen_beispiel": "Bleaching in der Praxis | 90 | ab 350 €; Zahnreinigung vor dem Bleaching | 60 | ab 100 €",
        "vorbereitung": [
            "Bringen Sie wenn vorhanden Ihr Bonusheft mit",
            "Bringen Sie eine Liste Ihrer Medikamente mit",
            "Vor einer Aufhellung prüfen wir Zähne und Zahnfleisch. Oft gehört eine Zahnreinigung dazu",
            "Füllungen und Kronen hellen nicht mit auf. Das besprechen wir vorher",
        ],
        "farben": {"bg": "#F2F5F8", "ink": "#13243A", "accent": "#245E9E", "soft": "#DDE6EF", "dunkel": "#14243A", "hell": "#FAFCFD"},
        "lp": {
            "titel": "Zahnaufhellung in {{ort}} · {{betrieb}}",
            "kicker": "Zahnaufhellung in der Zahnarztpraxis",
            "h1": "Hellere Zähne, <em>zahnärztlich begleitet.</em>",
            "sub": "Erst prüfen wir Zähne und Zahnfleisch, dann hellen wir schonend auf. Erstgespräch direkt hier wählen.",
            "hinweis": "Wie hell die Zähne werden und wie lange es hält, ist individuell. Füllungen und Kronen hellen nicht mit auf. Manche spüren für kurze Zeit empfindliche Zähne.",
            "schritte": ["Erstgespräch online wählen", "Untersuchung und Beratung", "Aufhellung in der Praxis"],
            "vorteile": [
                "Zahnaufhellung in der Zahnarztpraxis, mit Untersuchung vorab",
                "Ehrliche Einschätzung, was bei Ihren Zähnen möglich ist",
                "Termine online buchen und absagen, ohne Warteschleife",
            ],
            "faq": [
                ("Warum Bleaching beim Zahnarzt?", "Wirksame Aufhellungsmittel dürfen nur in der Zahnarztpraxis angewendet werden. Vorher prüfen wir Zähne und Zahnfleisch."),
                ("Wie hell werden die Zähne?", "Das ist individuell und hängt von Ihrer Ausgangsfarbe ab. Im Erstgespräch sagen wir Ihnen ehrlich, was möglich ist."),
                ("Tut das weh?", "Die Aufhellung selbst ist nicht schmerzhaft. Manche spüren danach für kurze Zeit empfindliche Zähne."),
                ("Wie lange hält es?", "Meist einige Jahre, je nach Ernährung und Pflege. Kaffee, Tee, Rotwein und Rauchen dunkeln wieder nach."),
                ("Was kostet es?", "Die Preise stehen oben. Ob vorher eine Zahnreinigung nötig ist, klären wir im Erstgespräch."),
            ],
        },
        "anzeigen": [
            {"id": "b1-praxis", "stil": "a", "foto": "foto-1", "kicker": "Zahnaufhellung in {{ort}}",
             "h1": "Hellere Zähne, <em>zahnärztlich begleitet.</em>",
             "sub": "Erst Untersuchung, dann schonende Aufhellung in der Praxis.",
             "fine": "{{betrieb}}. Ergebnis und Haltbarkeit sind individuell.",
             "cta": "Erstgespräch wählen",
             "primaer": "Zahnaufhellung gehört in die Zahnarztpraxis. Bei {{betrieb}} prüfen wir zuerst Zähne und Zahnfleisch und sagen Ihnen ehrlich, was bei Ihnen möglich ist.\n👉 Erstgespräch online wählen.",
             "headline": "Zahnaufhellung beim Zahnarzt", "beschreibung": "Erstgespräch online wählen."},
            {"id": "b2-erst-pruefen", "stil": "b", "foto": "foto-2", "kicker": "So läuft es",
             "h1": "Erst prüfen, <em>dann aufhellen.</em>",
             "sub": "Untersuchung, Beratung, Aufhellung: alles in einer Praxis.",
             "fine": "{{betrieb}}, {{ort}}. Füllungen und Kronen hellen nicht mit auf.",
             "cta": "Erstgespräch wählen",
             "primaer": "Bevor wir aufhellen, schauen wir genau hin: Sind Zähne und Zahnfleisch gesund? Braucht es vorher eine Reinigung? Danach hellen wir schonend in der Praxis auf.\n👉 Erstgespräch online wählen.",
             "headline": "Erst prüfen, dann aufhellen", "beschreibung": "Zahnaufhellung in {{ort}}."},
            {"id": "b3-anlass", "stil": "c", "foto": "foto-3", "kicker": "Hochzeit, Feier, Urlaub",
             "h1": "Rechtzeitig <em>planen.</em>",
             "sub": "Für den großen Tag: Erstgespräch jetzt, Aufhellung ein paar Wochen vorher.",
             "fine": "{{betrieb}}, {{ort}}. Ergebnis individuell.",
             "cta": "Erstgespräch wählen",
             "primaer": "Eine Hochzeit, ein Jubiläum oder einfach der Sommer steht an? Planen Sie die Zahnaufhellung ein paar Wochen vorher. Das Erstgespräch bei {{betrieb}} buchen Sie online.\n👉 Erstgespräch online wählen.",
             "headline": "Zahnaufhellung rechtzeitig planen", "beschreibung": "Erstgespräch online wählen."},
            {"id": "b4-online", "stil": "d", "foto": "foto-1", "kicker": "Ohne Anruf, ohne Warteschleife",
             "h1": "Ihr Erstgespräch, <em>online gebucht.</em>",
             "sub": "Freie Zeiten sehen, Termin wählen, per E-Mail bestätigen.",
             "fine": "Zahnaufhellung bei {{betrieb}}, {{ort}}.",
             "cta": "Freie Termine ansehen",
             "primaer": "Bei {{betrieb}} sehen Sie alle freien Termine für ein Erstgespräch zur Zahnaufhellung online und buchen in 30 Sekunden.\n👉 Freie Termine ansehen.",
             "headline": "Erstgespräch online buchen", "beschreibung": "Zahnaufhellung in {{ort}}."},
            {"id": "b5-praxis-team", "stil": "e", "foto": "foto-3", "kicker": "Ihre Zahnarztpraxis in {{ort}}",
             "h1": "{{behandler_name_kurz}} <em>und Team.</em>",
             "sub": "Zahnaufhellung mit Untersuchung vorab, in vertrauter Umgebung.",
             "fine": "{{betrieb}}. Ergebnis und Haltbarkeit sind individuell.",
             "cta": "Erstgespräch wählen",
             "primaer": "{{behandler_name}} und Team von {{betrieb}} beraten Sie zur Zahnaufhellung: ehrlich, mit Untersuchung vorab und in Ruhe.\n👉 Erstgespräch online wählen.",
             "headline": "Ihre Zahnarztpraxis in {{ort}}", "beschreibung": "Zahnaufhellung mit Untersuchung."},
        ],
        "verlosung": None,
        "google": {
            "keywords": ["bleaching zahnarzt {{ort_klein}}", "zahnaufhellung {{ort_klein}}", "zähne bleichen {{ort_klein}}",
                         "bleaching {{ort_klein}}", "bleaching beim zahnarzt", "zahnaufhellung zahnarzt", "bleaching kosten zahnarzt"],
            "negativ": ["zuhause", "set", "strips", "kaufen", "amazon", "dm", "rossmann", "pen", "gel", "ausbildung", "job",
                        "stellenangebot", "selber", "hausmittel", "natron"],
            "headlines": ["Zahnaufhellung in {{ort}}", "Bleaching beim Zahnarzt", "Erst prüfen, dann aufhellen", "Termin online buchen",
                          "{{betrieb}}", "Erstgespräch online wählen", "Freie Termine ansehen", "Untersuchung vorab",
                          "Zahnarztpraxis in {{ort}}", "Ohne Warteschleife buchen", "Ihr Termin in 30 Sekunden",
                          "Ehrliche Einschätzung", "Aufhellung in der Praxis", "Rechtzeitig vor dem Anlass", "Schonend aufhellen"],
            "descriptions": ["Zahnaufhellung in der Zahnarztpraxis, mit Untersuchung vorab. Erstgespräch online wählen.",
                             "Wir sagen Ihnen ehrlich, was bei Ihren Zähnen möglich ist. Termin in 30 Sekunden.",
                             "Freie Termine sehen und buchen. Bestätigung per E-Mail.",
                             "{{betrieb}} in {{ort}}. Erst prüfen, dann aufhellen."],
            "pfad": ["Bleaching", "Termin"],
        },
        "zielgruppe": {"alter": "25 bis 55", "geschlecht": "alle"},
        "annahmen": {"kosten_pro_termin": 50, "erscheinen": 0.8, "kauf": 0.45, "meta_anteil": 0.6, "kundenwert": 450},
        "preis_empfehlung": "Onboarding ca. 600–700 €, Monatsgebühr ca. 599–799 €, Werbebudget ca. 400–700 €",
    },
}

BEHANDLUNGEN = list(MODULE)  # Reihenfolge im Formular „Neuer Kunde“: Laser, Permanent Make-up, Faltenbehandlung, Bleaching


# ------------------------------------------------------------------------------------------------ Eigenes Angebot (Version 3)
# Nutzer-Vorgabe 21.11.2026: Das Angebot trägt ihr pro Studio selbst ein (z. B. „Wimpernverlängerung“, „Lippen-Hyaluron“).
# Die Werberegeln richten sich danach, WER behandelt (Schalter aus dem passenden Modul oben). Die Texte sind allgemein
# und setzen {{angebot}} ein. Die vier Module oben bleiben für die Regeln und als Beispiele erhalten.
REGELN_VON_BEHANDLER = {
    "Kosmetik/PMU-Studio": "Permanent Make-up",       # normales Wettbewerbsrecht
    "Kosmetik mit NiSV-Fachkunde": "Laser",           # Laser/IPL: NiSV, „dauerhaft“ nur mit Hinweis
    "Arzt/Ärztin": "Faltenbehandlung",                # Heilmittelwerbegesetz
    "Heilpraktiker/in": "Faltenbehandlung",           # Heilmittelwerbegesetz
    "Zahnarztpraxis": "Bleaching",                    # Berufsordnung Zahnärzte
}
PROVISION_STANDARD = 15  # % vom ersten Kauf einer Neukundin aus einem Online-Termin (innerhalb von 3 Monaten)

# Angebots-Anzeige: kommt bei JEDEM Studio als erste Anzeige dazu (Neukundenangebot aus dem Formular „Neuer Kunde“).
ANGEBOT_ANZEIGE = {"id": "n1-angebot", "stil": "c", "foto": "foto-5", "leistung": "{{nk_leistung}}", "kicker": "Neukundinnen",
                   "h1": "{{nk_text}}",
                   "sub": "{{nk_leistung}}{{nk_bis_kurz}}",
                   "cta": "Termin buchen",
                   "primaer": "{{nk_text}}: Ihr Start bei {{betrieb}} in {{ort}}.{{nk_normal_satz}}\n✔ Freie Termine sofort sehen\n✔ In 30 Sekunden online gebucht\n✔ Nur für Ihren ersten Termin{{nk_bis_satz}}\n👉 Jetzt Termin buchen.",
                   "headline": "{{nk_text}}", "beschreibung": "Nur für Neukundinnen."}

# Gewinnspiel-Anzeigen: nur wo regeln.verlosung an ist UND in der Zentrale ein Gewinnspiel eingetragen ist.
# Die Bedingung (Termin buchen UND hinkommen) steht als Unterzeile auf dem Bild (BGH I ZR 64/07), alle Pflichtangaben im Anzeigentext.
GEWINNSPIEL_TEXT = ("🎁 Gewinnspiel bei {{betrieb}} in {{ort}}: Hauptgewinn {{gs_haupt}}{{gs_weitere_satz}}.\n"
                    "So sind Sie im Lostopf: bis {{gs_bis}} Ihren ersten Termin online buchen und hinkommen. Der Termin kostet den normalen Preis.\n"
                    "Ab 18, ein Los pro Person. Ziehung am {{gs_ziehung}} unter allen, die zu ihrem Termin gekommen sind. Teilnahmebedingungen: {{gs_tnb}}\n"
                    "Diese Aktion steht in keiner Verbindung zu Meta und wird nicht von Meta gesponsert oder organisiert.\n👉 Jetzt Termin buchen.")
GEWINNSPIEL = [
    {"stil": "b", "foto": "foto-8", "kicker": "Gewinnspiel", "h1": "Gewinnen Sie: <em>{{gs_haupt_kurz}}</em>",
     "sub": "Im Lostopf: wer bis {{gs_bis_kurz}} bucht und zum Termin kommt.", "cta": "Termin buchen",
     "primaer": GEWINNSPIEL_TEXT, "headline": "Gewinnen: {{gs_haupt_kurz}}", "beschreibung": "Mit Ihrem Termin im Lostopf."},
    {"stil": "c", "foto": "foto-7", "kicker": "Gewinnspiel", "h1": "{{gs_anzahl}} Gewinne. <em>Jeder Termin zählt.</em>",
     "sub": "Im Lostopf: wer bis {{gs_bis_kurz}} bucht und zum Termin kommt.", "cta": "Termin buchen",
     "primaer": GEWINNSPIEL_TEXT, "headline": "{{gs_anzahl}} Gewinne bei {{betrieb}}", "beschreibung": "Teilnahme bis {{gs_bis_kurz}}."},
    {"stil": "a", "foto": "foto-5", "leistung": "{{nk_leistung}}", "kicker": "Neukundinnen", "h1": "{{nk_text}}",
     "sub": "Plus Gewinnchance: Termin bis {{gs_bis_kurz}} wahrnehmen.", "cta": "Termin buchen",
     "primaer": "{{nk_text}} bei {{betrieb}} in {{ort}}.{{nk_normal_satz}}\n" + GEWINNSPIEL_TEXT, "headline": "{{nk_text}}", "beschreibung": "Plus Gewinnchance bis {{gs_bis_kurz}}."},
]

ALLGEMEIN = {
    "kuerzel": "allgemein",
    "vorbereitung": [
        "Bitte kommen Sie 5 Minuten vor Ihrem Termin",
        "Hat sich gesundheitlich etwas geändert oder nehmen Sie neue Medikamente? Sagen Sie es uns bitte vor der Behandlung",
        "Können Sie nicht kommen, sagen Sie bitte rechtzeitig über den Link in Ihrer Bestätigung ab",
    ],
    "farben": {"bg": "#F4ECE7", "ink": "#2A1E1A", "accent": "#8A5240", "soft": "#E6D6CD", "dunkel": "#2B1F1B", "hell": "#FAF5F2"},
    "lp": {
        "titel": "{{angebot}} in {{ort}} · {{betrieb}}",
        "kicker": "{{angebot}} in {{ort}}",
        "h1": "{{angebot}}. <em>Termin direkt online.</em>",
        "sub": "Starten Sie mit einer {{beratung_wort}}en Beratung bei {{betrieb}}. Freie Zeiten sehen und direkt hier buchen.",
        "hinweis": "Ergebnisse sind individuell. Was bei Ihnen möglich ist, besprechen wir persönlich vor der Behandlung.",
        "schritte": ["Freien Termin wählen", "Per E-Mail bestätigen", "Persönlich beraten und behandelt werden"],
        "vorteile": [
            "Persönliche Beratung, bevor etwas gemacht wird",
            "Alle freien Termine auf einen Blick, auch abends und am Wochenende, wenn das Studio dann offen hat",
            "Online buchen und absagen, ohne Warteschleife",
            "Erinnerung 24 Stunden vor Ihrem Termin",
        ],
        "faq": [
            ("Wie buche ich?", "Leistung wählen, freien Termin antippen, Namen und Kontakt eintragen. Danach kommt eine E-Mail: Erst mit Ihrem Klick dort ist der Termin fest."),
            ("Was passiert beim ersten Termin?", "Wir sprechen über Ihre Wünsche und klären, was bei Ihnen sinnvoll ist. Erst dann wird behandelt."),
            ("Was kostet es?", "Die Preise stehen in der Übersicht oben, soweit sie feststehen. Alles Weitere besprechen wir vorab, Sie entscheiden in Ruhe."),
            ("Kann ich absagen oder verschieben?", "Ja, über den Link in Ihrer Bestätigung. Bitte rechtzeitig, dann bekommt jemand anderes den Platz."),
            ("Ich finde keinen passenden Termin.", "Fordern Sie unten einen Rückruf an oder rufen Sie uns an. Wir finden eine Lösung."),
        ],
    },
    "anzeigen": [
        # Grundbaustein Verkauf, Fassung 2 (Recherche 21.11.2026): aufs Bild nur Kicker (1–3 Wörter), Überschrift = Angebot
        # oder Nutzen (höchstens ~6 Wörter), EINE Unterzeile, Knopf. Alles andere in den Anzeigentext (erste 125 Zeichen: Angebot).
        ANGEBOT_ANZEIGE,
        {"id": "n2-angebot-ort", "stil": "b", "foto": "foto-1", "leistung": "{{nk_leistung}}", "kicker": "{{betrieb}}",
         "h1": "{{angebot}} <em>in {{ort}}.</em>",
         "sub": "Neukundinnen: {{nk_text}}",
         "cta": "Termin buchen",
         "primaer": "Neu bei {{betrieb}}? {{nk_text}}.{{nk_normal_satz}}\n✔ Alle freien Termine sofort sehen\n✔ In 30 Sekunden online gebucht\n✔ Nur für Ihren ersten Termin{{nk_bis_satz}}\n👉 Jetzt Termin buchen.",
         "headline": "{{nk_text}}", "beschreibung": "{{angebot}} in {{ort}}."},
        {"id": "a3-preis", "stil": "a", "foto": "foto-2", "kicker": "Fester Preis",
         "h1": "{{leistung_1}} <em>{{preis_1}}</em>",
         "sub": "Freie Termine sofort sehen und buchen.",
         "cta": "Termin buchen",
         "primaer": "{{leistung_1}} bei {{betrieb}} in {{ort}}: {{preis_1}}, ohne Überraschung.\n✔ Termin in 30 Sekunden online\n✔ Erinnerung 24 Stunden vorher\n👉 Jetzt Termin buchen.",
         "headline": "{{leistung_1}} {{preis_1}}", "beschreibung": "Jetzt freien Termin sichern."},
        {"id": "a2-online", "stil": "d", "foto": "foto-4", "kicker": "Ohne Anruf",
         "h1": "Ihr Termin <em>in 30 Sekunden.</em>",
         "sub": "Freie Zeiten sehen, antippen, fertig.",
         "cta": "Freie Termine",
         "primaer": "Nie wieder hinterhertelefonieren: Bei {{betrieb}} in {{ort}} sehen Sie alle freien Termine für {{angebot}} online.\n✔ Termin antippen ✔ per E-Mail bestätigen ✔ Erinnerung kommt von selbst\n👉 Freie Termine ansehen.",
         "headline": "Freie Termine in {{ort}}", "beschreibung": "In 30 Sekunden online gebucht."},
        {"id": "a1-beratung", "stil": "e", "foto": "foto-6", "kicker": "Erst beraten",
         "h1": "Wissen, was geht. <em>Dann entscheiden.</em>",
         "sub": "{{beratung_name}}: {{beratung_wort}}, {{beratung_minuten}} Minuten.",
         "cta": "Beratung buchen",
         "primaer": "Sie überlegen schon länger wegen {{angebot}}? In der {{beratung_name}} bei {{betrieb}} erfahren Sie in Ruhe, was bei Ihnen möglich ist, was es kostet und wie es abläuft: {{beratung_wort}}, ohne Druck.\n👉 Jetzt Termin wählen.",
         "headline": "{{beratung_name}}: {{beratung_wort}}", "beschreibung": "Freie Zeiten sofort sehen."},
    ],
    "zielgruppe": {"alter": "25 bis 60", "geschlecht": "alle (Advantage+ findet die Richtigen)"},
}
