# Playbook: High-Converting Landingpages & Google/Meta Ads für Zielnische

Research-Zusammenfassung für die festgelegte Nische aus CLAUDE.md: **Zahnärzte, Fitnessstudios, Beautysalons, Friseure**. Basis für zukünftige Angebote/Templates bei echten Kundenprojekten. Physio und Gastronomie/Tourismus wurden früher mitrecherchiert (Abschnitte unten als Referenz belassen), sind aber aktuell nicht Teil der aktiven Nische.

## 0. Homepage vs. Landingpage – zwei verschiedene Dinge im selben Projekt

Pro Kundenprojekt entstehen zwei unterschiedliche Seiten, nicht eine:

- **Homepage**: die eigentliche Firmenwebsite (Start, Leistungen, Team, Kontakt, Öffnungszeiten). Muss für alle Besucherarten funktionieren – organische Google-Suche, Google Maps, Mundpropaganda. Braucht Navigation und mehrere Unterseiten.
- **Landingpage**: eine schlanke Spezialseite pro beworbener Leistung, auf die *ausschließlich* die Ads zeigen (siehe Abschnitt 1). Keine Navigation, ein CTA, exaktes Message Match zur Anzeige.

Beide liegen meist auf derselben Domain (z. B. `praxis.de` = Homepage, `praxis.de/zahnreinigung` = Landingpage dafür), sind aber unterschiedliche Seiten mit unterschiedlichem Zweck – die Landingpage ist i. d. R. nicht in der Hauptnavigation verlinkt. Ads-Traffic auf die normale Homepage statt auf eine dedizierte Landingpage zu schicken kostet die 2-3x höhere Conversion aus Abschnitt 1. Die Templates in `templates/` sind bewusst nur die Landingpage-Hälfte – die Homepage ist pro Kunde individueller und weniger schematisierbar (Team-Fotos, Firmengeschichte etc.).

## 1. Universelle Landingpage-Prinzipien (branchenübergreifend)

- **Eine Seite = ein Angebot = ein CTA.** Keine Navigation, keine Ablenkung. Dedizierte Landingpages statt Traffic auf die normale Homepage schicken bringt in der Praxis 2-3x höhere Conversion (teils bis ~10% vs. 2-3%).
- **Message Match**: Headline der Landingpage muss die Anzeige widerspiegeln, die den Klick ausgelöst hat. Wer auf "Zahnreinigung Pfullendorf" klickt, darf nicht auf einer allgemeinen Praxis-Startseite landen.
- **Hero-Formel**: Headline mit Ort + Hauptnutzen, ein Satz Zusatzinfo, sichtbarer CTA-Button ("Jetzt Termin buchen" / "Kostenlose Beratung sichern").
- **Formulare so kurz wie möglich**: 3 Felder (Name, Telefon, optional E-Mail) schlagen 6-7-Felder-Formulare fast immer. Zusatzinfos (Versicherung, Anamnese, Vertragsdetails) gehören in den Folgeprozess, nicht auf die Landingpage.
- **Mobile first**: 60-68% des Traffics ist mobil. Klick-zum-Anrufen-Button muss ohne Scrollen sichtbar sein (sticky Header).
- **Trust-Signale**: Bewertungen/Sterne, Vorher-Nachher-Bilder (bei Beauty/Zahn/Med-Spa besonders stark), Testimonials (Video schlägt Text), Zertifikate/Qualifikationen.
- **Service-spezifische Seiten**: Für jede Leistung/Suchintention eine eigene Landingpage statt einer generischen Seite (z.B. "Invisalign" ≠ "Zahnextraktion", "Botox" ≠ "Laser-Haarentfernung").
- **A/B-Testing**: Headline zuerst testen (größter Hebel), danach Bilder/Button-Platzierung.
- **Follow-up entscheidet über den ROI**: Lead-Reaktionszeit ist kritischer Erfolgsfaktor – SMS/Anruf innerhalb 60 Sek., zweiter Touch nach 2h, dritter nach 24h konvertiert 3-4x besser als Leads liegen zu lassen. Das ist ein Verkaufsargument gegenüber Kunden: nicht nur Ads schalten, sondern auch beim Lead-Handling beraten.

## 2. Google Ads – Kampagnenstruktur & Bidding

- **Pro Leistung eine eigene Kampagne**, nicht alles in einen Topf werfen (unterschiedliche CPCs, Conversion-Rates, Customer Lifetime Value pro Leistung).
- **Google Local Services Ads (LSA)** für zugelassene Branchen (u.a. Zahnärzte, Handwerker, einige Gesundheitsdienstleister) zusätzlich zu klassischen Search-Kampagnen nutzen: Pay-per-Lead, ganz oben in den Ergebnissen, Trust-Badges. Bewertungsanzahl/-schnitt/-aktualität sind der stärkste Rankingfaktor für LSA – Praxen mit 100+ Bewertungen bei 4,8+ Sternen dominieren.
- **Bidding-Strategie**: Start mit "Maximize Conversions"/"Maximize Leads" ohne Ziel-CPA für die ersten 2-6 Wochen (Datensammlung), danach erst auf Ziel-CPA umstellen. Wöchentlich optimieren, nicht monatlich.
- **Compliance**: Bei Gesundheitsleistungen auf Werberichtlinien/Zulassungsanforderungen achten (Zertifizierungsprozess bei Google frühzeitig starten, nicht erst nach Kampagnenaufbau).
- **Anzeigentext-Formel**: [größter Nutzen] + [Einwand entkräften], z.B. „Fitness an 7 Tagen die Woche – ohne Vertragsbindung!" Headline so konkret wie möglich („Zahnreinigung Pfullendorf: Termin in 60 Min.") statt generisch.

## 3. Meta Ads (Instagram/Facebook) – wann sinnvoll

- Google Ads für aktive Suchintention (Schmerzen, akuter Bedarf) – Meta Ads für Inspiration/Sichtbarkeit, wenn niemand aktiv sucht (Beauty, Gastronomie, Ferienwohnungen).
- Für Tourismus/Gastronomie: emotionale, atmosphärische Foto-/Videoinhalte schlagen klassische Verkaufsbotschaften. Retargeting (wer die Website besucht hat, erneut ansprechen) ist bei Buchungsentscheidungen besonders wirksam.
- Landingpage muss auch hier zur Anzeige passen: Suche/Klick zu „Wellness-Wochenende Bodensee" darf nicht auf einer generischen Hotel-Startseite landen.

## 4. Google Business Profile (GBP) – nicht verhandelbar

- GBP-Signale machen ~32% der lokalen Ranking-Faktoren aus – einflussreicher als Backlinks oder On-Page-SEO.
- Bewertungen sind der am schnellsten wachsende Rankingfaktor (aktuell ~20% Gewichtung, steigend). Anzahl, Schnitt, Aktualität, Antwortrate zählen.
- Vollständige Profile bringen ~70% mehr Besuche als unvollständige; Buchungslink im Profil bringt ~21% mehr Conversions.
- **Praktische Konsequenz fürs Angebot**: GBP-Optimierung + Review-Management sollte Teil des Pakets sein, nicht nur Ads – ohne gutes GBP verpuffen Ads-Ausgaben teilweise.

## 5. Branchenspezifische Notizen

### Zahnärzte / Gesundheit
- Suchintention ist sehr spezifisch (z.B. "Invisalign" vs. "Notfall Zahnschmerzen") → getrennte Landingpages/Kampagnen pro Leistung.
- LSAs besonders stark, da hohe Kaufintention + Vertrauen durch Trust-Badges/Reviews.
- HIPAA/Datenschutz bei Gesprächsprotokollen beachten (in DE: DSGVO-Analogon, keine Patientendaten in Tracking-Tools).

### Beauty / Med-Spa / Kosmetik
- Vorher-Nachher-Bilder sind der stärkste Conversion-Treiber, direkt gefolgt von Testimonials (~90% vertrauen Online-Bewertungen wie persönlichen Empfehlungen).
- Eigene Landingpage pro Behandlung (Botox, Laser, Peeling etc.).
- Buchungsprozess muss online und reibungslos sein – das ist selbst ein Conversion-Hebel.

### Fitness-Studios
- Lead-Magnete mit niedriger Einstiegshürde funktionieren gut ("3 Kurse für 29€" statt direkt Jahresvertrag) – Pricing-Psychologie: Commitment durch kleine Zahlung, nicht durch großes Versprechen.
- FAQ-Sektion auf der Landingpage nimmt typische Einwände vorweg (Vertragsbindung, Öffnungszeiten).

### Friseure
- Eigene Landingpage pro Anlass/Leistung statt Sammelseite: „Damenhaarschnitt" ≠ „Hochsteckfrisur Hochzeit" ≠ „Herrensalon" – unterschiedliche Suchintention, unterschiedliche Zielgruppe.
- **Standort-Keywords sind der stärkste Hebel**: „Friseur [Ort] + in der Nähe/near me"-Suchen konvertieren nachweislich besser als generische Begriffe ohne Ortsbezug.
- Konversionsrate bei guter Landingpage/Ads-Kombination realistisch 10-30% – deutlich höher als bei vielen anderen Branchen, weil Entscheidung + Buchung oft spontan/kurzfristig erfolgt.
- Online-Terminbuchung direkt von der Landingpage aus ist Pflicht, kein Rückruf-Umweg – sonst verpufft ein Großteil der Klicks.
- Conversion-Tracking sauber trennen: Tracking-Tag auf einer separaten „Danke"-Seite nach Buchung, nicht auf der Landingpage selbst – sonst zählt jeder Seitenaufruf fälschlich als Conversion.

### Gastronomie / Tourismus (Bodensee) — Referenz, aktuell nicht Fokus
- Meta Ads für Inspiration/Sichtbarkeit priorisieren, Google Ads für konkrete Buchungsintention ("Ferienwohnung Bodensee Juli").
- Saisonalität aktiv bespielen (Tagesausflügler-Zielgruppe aus Stuttgart/Zürich-Raum im Umkreis targetieren).
- Content-Schwerpunkt: Atmosphäre/Emotion (Fotos/Videos vor Ort) statt reiner Verkaufstext.

## 6. Ableitung fürs eigene Angebot

- Standardpaket sollte **nicht nur Ads schalten**, sondern immer mitliefern: dedizierte Landingpage (statt Traffic auf Bestandswebsite), GBP-Optimierung/Review-Strategie, kurzes Lead-Formular + Empfehlung für schnelle Lead-Reaktion beim Kunden.
- Pro Kunde: erste 4-6 Wochen als Lernphase kommunizieren (Maximize-Conversions-Strategie, noch kein festes Cost-per-Lead-Ziel) – das nimmt Druck raus und ist fachlich korrekt begründbar.
- Referenzprojekt-Strategie: eine Vorlage pro Nische (z.B. eine Zahnarzt-Landingpage-Vorlage) bauen und für weitere Kunden derselben Nische wiederverwenden/anpassen – spart Zeit, erhöht Marge.
