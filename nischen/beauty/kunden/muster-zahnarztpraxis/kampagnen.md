# Kampagnen — Muster Zahnarztpraxis · Zahnaufhellung (Bleaching)

> Alles fertig zum Eintragen, Texte 1:1 kopieren. Bilder: Ordner `anzeigen/creatives`.
> Die Klickwege sind so, wie Meta und Google sie im November 2026 zeigen. Heißt ein Feld anders, nimm das Nächstliegende.
> Pixel-ID und Werbekonto hast du schon bei „Meta einrichten“ eingetragen („Meta fertig“). Sie wirken sofort,
> die Seite muss dafür **nicht** neu hochgeladen werden.

**Was gezählt wird:** Meta bekommt „Lead“ erst, wenn die Kundin ihren Termin **in der Mail
bestätigt** hat (Seite `bestaetigen.html`). Reservierungen, die nie bestätigt werden, und Fake-Buchungen zählen nicht.
So lernt Meta, Menschen zu finden, die wirklich kommen.

**Regeln für diese Behandlung** (stecken schon in den Texten, nichts dazu erfinden):
- ✗ nicht erlaubt: Verlosung
- ✗ nicht erlaubt: Vorher/Nachher-Fotos
- ✗ nicht erlaubt: Rabatte, Neukundenpreis
- ✗ nicht erlaubt: das Wort „kostenlos“
- ✓ erlaubt: Preise in der Werbung
- Wer darf behandeln: Nur Zahnarztpraxen. Bleaching-Studios ohne Zahnarzt sind rechtlich unsicher und kein Kunde.
- Kurz: Berufsordnung der Zahnärzte und Heilmittelwerbegesetz: sachlich, keine Rabatte, keine Verlosung, kein „kostenlos“

## Vorher kurz prüfen: der Pixel ist schon da

1. Team-Seite des Studios → Kasten **„Einrichten“** → im Feld **„Meta-Pixel (Datensatz-ID)“** steht eine Nummer (15–16 Ziffern).
   Das hast du bei „Meta einrichten“ erledigt. **Warum:** Bestätigt eine Kundin ihren Termin, meldet die Seite Meta einen „Lead“.
   So lernt Meta, wer wirklich bucht, und du siehst in Meta, welche Anzeige Termine bringt.
2. Steht dort nichts: business.facebook.com → Portfolio des Studios → **Einstellungen → Datenquellen → Datensätze** → ID kopieren
   (gibt es keinen: **„Hinzufügen“**, Name `Muster Zahnarztpraxis`, mit dem Werbekonto verbinden) → in das Feld eintragen → Speichern.
3. **Gesundheit und Schönheit:** Meta schränkt bei manchen Studios und Praxen die Daten ein („eingeschränkte
   Datennutzung“). Steht im Events Manager ein solcher Hinweis, ist das kein Fehler von euch. Die Seite sendet
   ohnehin keine Behandlungsnamen. Siehe unten „Wenn Meta ‚Lead‘ nicht anbietet“.

## Meta-Kampagne anlegen: Klick für Klick

adsmanager.facebook.com → oben links das **Werbekonto des Studios** wählen → grüner Knopf **„+ Erstellen“**.

### 1 · Kampagne

| Feld | Eintrag |
|---|---|
| Buchungsart | **Auktion** |
| Kampagnenziel | **Leads** → Weiter |
| Name der Kampagne | `Beauty – Zahnaufhellung (Bleaching) – Muster Zahnarztpraxis` |
| Budgetstrategie | **Kampagnenbudget** |
| Tagesbudget | **20 €** (= 600 € im Monat ÷ 30) |
| Kampagnengebotsstrategie | **Höchstes Volumen** |
| Spezielle Anzeigenkategorien | **nichts** auswählen |

### 2 · Anzeigengruppe

| Feld | Eintrag |
|---|---|
| Name der Anzeigengruppe | `Musterstadt 15 km` |
| Conversion-Ort | **Website** |
| Performance-Ziel | **Anzahl der Leads maximieren** |
| Datensatz | **Muster Zahnarztpraxis** |
| Conversion-Event | **Lead** |
| Budget und Zeitplan | Start heute, **kein Enddatum** |

**Zielgruppe** (unter „Einschränkungen“):

| Feld | Eintrag |
|---|---|
| Standorte | „Deutschland“ entfernen → `Musterstadt` → Umkreis **15 km** → „Personen, die hier leben“ |
| Mindestalter | **18** (Pflicht bei Schönheitsbehandlungen), gern höher: Vorschlag 25 bis 55 |
| Sprachen | **Deutsch** |
| Zielgruppe vorschlagen | Alter 25 bis 55 · Geschlecht: alle |
| Platzierungen | **Advantage+** so lassen |

**Wenn Meta „Lead“ nicht anbietet oder ausgraut** (kommt bei Gesundheit/Schönheit vor): Performance-Ziel
**„Anzahl der Landingpage-Aufrufe maximieren“** nehmen. Nach den ersten 20–30 bestätigten Terminen nochmal
versuchen, auf „Leads“ umzustellen.

### 3 · Anzeigen (für jede der Anzeigen unten)

Wie bei jeder Anzeige: „Anzeigengestaltung konfigurieren“ → **„Image Ad“** → Bild hochladen → **Quell-URL** =
Zieladresse unten → Texte kopieren → Button **„Jetzt buchen“** (heißt bei Meta „Book now“ bzw. „Jetzt buchen“;
gibt es ihn nicht: „Mehr dazu“) → bei „Optimierungen“ **alle Schalter aus** → Tracking: Datensatz **Muster Zahnarztpraxis**.
Weitere Anzeigen: links bei der Anzeige „…“ → **Duplizieren** → Bild, Texte, Parameter austauschen.

**Ende: NICHT „Veröffentlichen“.** Oben links schließen. In der Liste steht „Entwurf“.

**1 · n1-angebot** · Bild `n1-angebot.png` · Quell-URL `https://muster-zahnarztpraxis.netlify.app/termin.html?l=Erstgespr%C3%A4ch%20Zahnaufhellung` · URL-Parameter `utm_source=meta&utm_campaign=bleaching-n1`
- Primärtext: Erstgespräch zur Zahnaufhellung: Ihr Start bei Muster Zahnarztpraxis in Musterstadt.
  ✔ Freie Termine sofort sehen
  ✔ In 30 Sekunden online gebucht
  ✔ Nur für Ihren ersten Termin
  👉 Jetzt Termin buchen.
- Überschrift: Erstgespräch zur Zahnaufhellung
- Beschreibung: Nur für Neukundinnen.

**2 · b1-praxis** · Bild `b1-praxis.png` · Quell-URL `https://muster-zahnarztpraxis.netlify.app/termin.html` · URL-Parameter `utm_source=meta&utm_campaign=bleaching-b1`
- Primärtext: Zahnaufhellung gehört in die Zahnarztpraxis. Bei Muster Zahnarztpraxis prüfen wir zuerst Zähne und Zahnfleisch und sagen Ihnen ehrlich, was bei Ihnen möglich ist.
  👉 Erstgespräch online wählen.
- Überschrift: Zahnaufhellung beim Zahnarzt
- Beschreibung: Erstgespräch online wählen.

**3 · b2-erst-pruefen** · Bild `b2-erst-pruefen.png` · Quell-URL `https://muster-zahnarztpraxis.netlify.app/termin.html` · URL-Parameter `utm_source=meta&utm_campaign=bleaching-b2`
- Primärtext: Bevor wir aufhellen, schauen wir genau hin: Sind Zähne und Zahnfleisch gesund? Braucht es vorher eine Reinigung? Danach hellen wir schonend in der Praxis auf.
  👉 Erstgespräch online wählen.
- Überschrift: Erst prüfen, dann aufhellen
- Beschreibung: Zahnaufhellung in Musterstadt.

**4 · b3-anlass** · Bild `b3-anlass.png` · Quell-URL `https://muster-zahnarztpraxis.netlify.app/termin.html` · URL-Parameter `utm_source=meta&utm_campaign=bleaching-b3`
- Primärtext: Eine Hochzeit, ein Jubiläum oder einfach der Sommer steht an? Planen Sie die Zahnaufhellung ein paar Wochen vorher. Das Erstgespräch bei Muster Zahnarztpraxis buchen Sie online.
  👉 Erstgespräch online wählen.
- Überschrift: Zahnaufhellung rechtzeitig planen
- Beschreibung: Erstgespräch online wählen.

**5 · b4-online** · Bild `b4-online.png` · Quell-URL `https://muster-zahnarztpraxis.netlify.app/termin.html` · URL-Parameter `utm_source=meta&utm_campaign=bleaching-b4`
- Primärtext: Bei Muster Zahnarztpraxis sehen Sie alle freien Termine für ein Erstgespräch zur Zahnaufhellung online und buchen in 30 Sekunden.
  👉 Freie Termine ansehen.
- Überschrift: Erstgespräch online buchen
- Beschreibung: Zahnaufhellung in Musterstadt.

**6 · b5-praxis-team** · Bild `b5-praxis-team.png` · Quell-URL `https://muster-zahnarztpraxis.netlify.app/termin.html` · URL-Parameter `utm_source=meta&utm_campaign=bleaching-b5`
- Primärtext: Dr. med. dent. Paul Muster, Zahnarzt und Team von Muster Zahnarztpraxis beraten Sie zur Zahnaufhellung: ehrlich, mit Untersuchung vorab und in Ruhe.
  👉 Erstgespräch online wählen.
- Überschrift: Ihre Zahnarztpraxis in Musterstadt
- Beschreibung: Zahnaufhellung mit Untersuchung.


## Nach dem Start

3–4 Tage nichts ändern · erst ab 20–50 bestätigten Terminen bewerten, dann nur eine Sache ändern.
Gute Anzeige = viele **bestätigte** Termine, wenige „nicht erschienen“ (steht im Monatsreport).
