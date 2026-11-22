# Kampagnen — {{betrieb}} · {{modul_name}}

> Alles fertig zum Eintragen, Texte 1:1 kopieren. Bilder: Ordner `anzeigen/creatives`.
> Die Klickwege sind so, wie Meta und Google sie im November 2026 zeigen. Heißt ein Feld anders, nimm das Nächstliegende.
> Pixel-ID und Werbekonto hast du schon bei „Meta einrichten“ eingetragen („Meta fertig“). Sie wirken sofort,
> die Seite muss dafür **nicht** neu hochgeladen werden.

**Was gezählt wird:** Meta bekommt „Lead“ erst, wenn die Kundin ihren Termin **in der Mail
bestätigt** hat (Seite `bestaetigen.html`). Reservierungen, die nie bestätigt werden, und Fake-Buchungen zählen nicht.
So lernt Meta, Menschen zu finden, die wirklich kommen.

**Regeln für diese Behandlung** (stecken schon in den Texten, nichts dazu erfinden):
{{regeln_liste}}

## Vorher kurz prüfen: der Pixel ist schon da

1. Team-Seite des Studios → Kasten **„Einrichten“** → im Feld **„Meta-Pixel (Datensatz-ID)“** steht eine Nummer (15–16 Ziffern).
   Das hast du bei „Meta einrichten“ erledigt. **Warum:** Bestätigt eine Kundin ihren Termin, meldet die Seite Meta einen „Lead“.
   So lernt Meta, wer wirklich bucht, und du siehst in Meta, welche Anzeige Termine bringt.
2. Steht dort nichts: business.facebook.com → Portfolio des Studios → **Einstellungen → Datenquellen → Datensätze** → ID kopieren
   (gibt es keinen: **„Hinzufügen“**, Name `{{betrieb}}`, mit dem Werbekonto verbinden) → in das Feld eintragen → Speichern.
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
| Name der Kampagne | `Beauty – {{modul_name}} – {{betrieb}}` |
| Budgetstrategie | **Kampagnenbudget** |
| Tagesbudget | **{{budget_meta_tag}}** (= {{budget_meta}} im Monat ÷ 30) |
| Kampagnengebotsstrategie | **Höchstes Volumen** |
| Spezielle Anzeigenkategorien | **nichts** auswählen |

### 2 · Anzeigengruppe

| Feld | Eintrag |
|---|---|
| Name der Anzeigengruppe | `{{ort}} {{umkreis_km}} km` |
| Conversion-Ort | **Website** |
| Performance-Ziel | **Anzahl der Leads maximieren** |
| Datensatz | **{{betrieb}}** |
| Conversion-Event | **Lead** |
| Budget und Zeitplan | Start heute, **kein Enddatum** |

**Zielgruppe** (unter „Einschränkungen“):

| Feld | Eintrag |
|---|---|
| Standorte | „Deutschland“ entfernen → `{{ort}}` → Umkreis **{{umkreis_km}} km** → „Personen, die hier leben“ |
| Mindestalter | **18** (Pflicht bei Schönheitsbehandlungen), gern höher: Vorschlag {{zielgruppe_alter}} |
| Sprachen | **Deutsch** |
| Zielgruppe vorschlagen | Alter {{zielgruppe_alter}} · Geschlecht: {{zielgruppe_geschlecht}} |
| Platzierungen | **Advantage+** so lassen |

**Wenn Meta „Lead“ nicht anbietet oder ausgraut** (kommt bei Gesundheit/Schönheit vor): Performance-Ziel
**„Anzahl der Landingpage-Aufrufe maximieren“** nehmen. Nach den ersten 20–30 bestätigten Terminen nochmal
versuchen, auf „Leads“ umzustellen.

### 3 · Anzeigen (für jede der Anzeigen unten)

Wie bei jeder Anzeige: „Anzeigengestaltung konfigurieren“ → **„Image Ad“** → Bild hochladen → **Quell-URL** =
Zieladresse unten → Texte kopieren → Button **„Jetzt buchen“** (heißt bei Meta „Book now“ bzw. „Jetzt buchen“;
gibt es ihn nicht: „Mehr dazu“) → bei „Optimierungen“ **alle Schalter aus** → Tracking: Datensatz **{{betrieb}}**.
Weitere Anzeigen: links bei der Anzeige „…“ → **Duplizieren** → Bild, Texte, Parameter austauschen.

**Ende: NICHT „Veröffentlichen“.** Oben links schließen. In der Liste steht „Entwurf“.

{{meta_anzeigen_md}}

## Nach dem Start

3–4 Tage nichts ändern · erst ab 20–50 bestätigten Terminen bewerten, dann nur eine Sache ändern.
Gute Anzeige = viele **bestätigte** Termine, wenige „nicht erschienen“ (steht im Monatsreport).
