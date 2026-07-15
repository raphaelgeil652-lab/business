# Outreach-Skripte

Zwei Varianten: Anruf und Vor-Ort. Beide nutzen denselben Eisbrecher — ein kostenloser, ehrlicher Hinweis (GBP-Check), keine plumpe Verkaufsansprache. Passt zu allen Leads in `leads/leads.csv`, Platzhalter `[Name]`/`[Betrieb]` ersetzen.

## Telefon-Skript

> „Guten Tag, mein Name ist [Dein Name]. Ich helfe kleinen Betrieben hier in Pfullendorf dabei, online mehr Kund:innen zu erreichen — ich hab mir gerade Ihr Google-Profil/Ihre Website angeschaut und dabei [konkrete Beobachtung, z. B. „gesehen, dass da noch keine aktuellen Fotos hinterlegt sind" / „gesehen, dass es noch keine eigene Website gibt"]. Das ist super leicht zu beheben und bringt oft schnell mehr Anfragen. Hätten Sie kurz 2 Minuten, oder passt es Ihnen besser, wenn ich diese Woche kurz vorbeikomme?“

Wenn Interesse besteht:
> „Perfekt. Ich zeig Ihnen gerne unverbindlich, wie das für einen Betrieb wie Ihren aussehen könnte — dauert 15 Minuten, kein Verkaufsgespräch, einfach ein kurzer Blick auf das, was ich schon vorbereitet habe.“

Wenn abgelehnt: freundlich bedanken, **nicht** nachhaken — in `leads.csv` Status auf „Kein Interesse“ setzen und Datum notieren, damit niemand doppelt angerufen wird.

## Vor-Ort-Skript (kurz, für spontanen Besuch)

> „Hallo, ich wollte nicht einfach anrufen, sondern kurz persönlich vorbeischauen. Ich unterstütze Betriebe hier in der Region beim Thema Website und Online-Sichtbarkeit — bei Ihnen ist mir aufgefallen, dass [Beobachtung]. Falls Sie mal offen dafür sind, das anzuschauen: hier ist meine Nummer, ich meld mich sonst gern nochmal.“

Kein Druck aufbauen, keine lange Erklärung im Stehen — Ziel ist nur ein Rückruf-Termin, nicht der Abschluss an der Tür.

## Nach dem ersten Ja: Gesprächs-Leitfaden für den Termin

1. Kurz zuhören: Was nervt sie/ihn aktuell an der eigenen Sichtbarkeit? (Nicht pitchen, erstmal fragen.)
2. Die passende Vorlage aus `templates/` zeigen (Landingpage + Anzeigenvorschau) als „so könnte das für Sie aussehen“.
3. Erstes Projekt als Test/Referenzangebot vorschlagen (siehe `CLAUDE.md`, Phase 2) — günstig oder kostenlos gegen Testimonial, klar zeitlich begrenzt (z. B. „4 Wochen Testphase“).
4. Ergebnis in `leads/leads.csv` festhalten: Status, vereinbarter nächster Schritt, Datum.

## Grundregeln

- Keine Kaltakquise per E-Mail-Spam (siehe `CLAUDE.md`/Playbook — funktioniert in dieser Zielgruppe kaum).
- Immer eine **konkrete, ehrliche** Beobachtung als Eisbrecher nutzen, keine generische Floskel.
- Ablehnung ist Normalzustand, kein Signal, dass das Modell nicht funktioniert — Ziel ist eine Quote, nicht 100% Zusage.
