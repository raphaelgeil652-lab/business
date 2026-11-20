# Modul Beauty: Regeln, Zahlen, Quellen

Hintergrund zum Baukasten (`vorlagen/module.py`). Alles hier ist **Recherche-Stand November 2026, keine
Rechtsberatung**. Die Recherche liegt vollständig in `research_notes/Beauty Tool Abläufe und Anzeigen/` und
`research_notes/Beauty Nischen Profitabilität Deutschland/`, der Bericht zur Nischenwahl in
`reports/Beauty Nischen Profitabilität Deutschland.md`.

## Warum Online-Buchung statt Rückruf

- Beauty-Kundinnen wollen einen Termin, keinen Anruf. Die Seite zeigt freie Zeiten aus dem Kalender des Studios.
- **Termin erst nach Bestätigung per E-Mail fest** (Platz 45 Minuten reserviert). Das ist der stärkste einfache
  Filter gegen Fake-Adressen, Scherz-Buchungen und Konkurrenten, die Termine blockieren wollen. Große Buchungstools
  machen es genauso (Cal.com „Booker Email Verification“, Calendly, Doctolib mit SMS).
- Bei Newslettern bestätigen etwa 65–90 % (Double-Opt-in, keine Beauty-Zahl gefunden). Wer nicht bestätigt, hätte
  meist auch nicht abgehoben.
- **Gezählt wird nur der bestätigte Termin** (Meta „Lead“, Google-Conversion). Empfehlung aus der Recherche: der
  Plattform nur echte Termine als Ziel geben, nicht jedes Formular.
- Erinnerung 24 Stunden vorher: Studien zeigen rund 20 % weniger Nichterscheinen (nicht die 30–50 % aus Werbung von
  Softwareanbietern). Ohne Erinnerung fehlen in Praxen 8–15 % (KBV).

## Schutz gegen Fake-Termine (eingebaut, Stufe 1)

| Was | Wo | Wirkung |
|---|---|---|
| Bestätigung per E-Mail-Klick, Platz 45 Min. reserviert | Zentrale + `bestaetigen.html` | falsche Adressen und Bots kommen nie beim Studio an |
| Bot-Falle (verstecktes Feld) und Zeit-Falle (unter 3 s) | Zentrale | Bots bekommen „ok“, es wird nichts angelegt (gezählt im Report) |
| Name, Telefon (Format, Fantasienummern), E-Mail (Wegwerf-Adressen, Domain ohne Postfach per DNS) | Zentrale | Tippfehler und Unsinn werden direkt am Feld gemeldet |
| Ein offener Termin pro Person (Telefon oder E-Mail) | Zentrale | niemand kann viele Plätze blockieren |
| Flut-Schutz: höchstens 6 unbestätigte in 30 Min. pro Studio, dann kurz gesperrt + Warnung | Zentrale | gegen Massen-Buchungen |
| Knopf „Fake melden“ → Termin weg, Telefon und E-Mail auf die Sperrliste | Mail ans Studio | wer einmal auffällt, kann nie wieder buchen |
| Netlify-Spamfilter (Akismet) und Honeypot | Rückruf-Formular | wie bei Photovoltaik |

**Stufe 2, nur wenn echte Fakes auftauchen** (nicht eingebaut, bewusst): Cloudflare Turnstile (kostenlos, gilt als
datenschutzfreundlicher als reCAPTCHA), SMS-Code (ca. 0,08–0,16 € pro SMS, z. B. seven.io oder Twilio), Anzahlung
bei Neukunden (stärkster Filter, PMU-üblich, kostet Buchungen). Erst messen, dann verschärfen.

## Werberecht je Behandlung (Kurzfassung)

| | Laser | PMU | Faltenbehandlung | Bleaching |
|---|---|---|---|---|
| Gesetz | UWG, PAngV, NiSV | UWG, PAngV | **HWG**, Berufsordnung, GOÄ | **Berufsordnung Zahnärzte**, HWG, GOZ |
| Wer darf | Fachkunde nach NiSV (seit 2026 nur mit Zertifikat) | Kosmetik | Ärzte; Hyaluron auch Heilpraktiker; nie Kosmetik | nur Zahnarzt (> 0,1 % H₂O₂) |
| Vorher/Nachher | ja (echte Fotos, Zustimmung) | Ergebnisfotos; Collage = Grauzone | **nein** (BGH I ZR 170/24, 31.07.2025; auch Stories, OLG Frankfurt 6 U 40/25) | in der Werbung nein (unsicher) |
| „kostenlos“ | ja | ja | **nein** (OLG Frankfurt 6 U 60/26, 03.09.2026: kostenlose ärztliche Beratung = Zuwendung) | nein |
| Verlosung, Rabatte | ja | ja | **nein** (§ 7, § 11 Nr. 13 HWG; LG Berlin II 2025: Rabatt auf Hyaluron) | nein |
| Wörter | „dauerhaft“ nur mit Hinweis direkt daneben (OLG Karlsruhe 6 U 181/23) | Preis inkl. Nachstechen | nie „Botox“ (§ 10 HWG, Google sperrt Rx-Begriffe), keine Makel-Ansprache (Meta) | kein „perfekte Zähne“ (OLG Frankfurt 6 U 219/19) |
| Meta | 18+ | 18+ | 18+, keine Vorher/Nachher bei Falten | 18+ |

**Formular:** keine Gesundheitsfragen; schon der Behandlungswunsch kann ein Gesundheitsdatum sein (EuGH C-21/23) →
ausdrückliche Einwilligung nach Art. 9 DSGVO als Pflicht-Häkchen, dazu „mindestens 18“.
**Ausfallgebühr:** nur mit Hinweis bei der Buchung, Absagefrist, und dem Recht nachzuweisen, dass kein Schaden
entstand (LG Berlin 55 S 310/04). Ist so eingebaut (Häkchen erscheint nur, wenn das Studio eine Gebühr will).

## Annahmen für die Planung (Blatt „Annahmen“ im Steckbrief)

| Behandlung | Kosten pro bestätigtem Termin | Erscheinen | Kauf danach | Meta-Anteil |
|---|---|---|---|---|
| Laser | 35 € | 75 % | 50 % | 70 % |
| Permanent Make-up | 45 € | 75 % | 60 % | 75 % |
| Faltenbehandlung | 60 € | 75 % | 50 % | 65 % |
| Bleaching | 50 € | 80 % | 45 % | 60 % |

**Diese Zahlen sind Schätzungen.** Deutsche Belege gibt es kaum (meist Eigenangaben von Agenturen, US-Werte:
Beauty-Leads auf Facebook ca. 51 $, WordStream 2025). Nach 20–50 echten Terminen durch eigene Zahlen ersetzen:
in `module.py` ändern, `tabellen-bauen.py` laufen lassen.

## Offen und vor dem ersten Kunden zu prüfen

- Die Meta-Werbebibliothek konnte in der Recherche nicht geöffnet werden. Einmal von Hand ansehen (Land Deutschland,
  „Laser Haarentfernung“, „Powder Brows“, „Faltenbehandlung“, „Bleaching Zahnarzt“), Anzeigen notieren, die über 60 Tage
  laufen.
- Meta kann Gesundheits- und Schönheitsanbietern die Optimierung auf „Lead“ einschränken. Ausweg in „7 Kampagnen“.
- Ob PMU unter das HWG fällt, ist ungeklärt. Wir behandeln es vorsichtig (keine Vorher/Nachher-Collagen in Anzeigen).
- Vereinbarung, Einwilligungstext und die Vorlagen der ersten Behandlung einmal anwaltlich prüfen lassen.
