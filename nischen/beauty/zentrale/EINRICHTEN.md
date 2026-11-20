# Beauty-Zentrale einrichten (einmal, ca. 25 Minuten)

Die **Beauty-Zentrale** ist eine Google-Tabelle in deinem Google-Konto. Sie ist das Herz der Online-Buchung: Die
Terminseiten aller Studios fragen sie nach freien Zeiten, sie nimmt Buchungen an, schickt die Mails, trägt Termine in
die Kalender der Studios ein und schreibt die Reports. Kostenlos, kein Server, kein Abo.

Sie ist **eine eigene Tabelle**, getrennt von der Photovoltaik-Zentrale. Die PV-Zentrale bleibt unverändert.

## Was sie von selbst macht

| Wann | Was passiert |
|---|---|
| Jemand öffnet eine Terminseite | Die Seite fragt die freien Zeiten ab (Google-Kalender des Studios, buchbare Zeiten, schon reservierte Plätze) |
| Termin reserviert | Prüfung gegen Fakes (Bot-Falle, Zeit-Falle, Name, Telefon, E-Mail, Sperrliste, ein offener Termin pro Person). Zeile „unbestätigt“, Platz 45 Minuten frei gehalten, Mail „Bitte bestätigen“ an die Kundin |
| Kundin bestätigt | Termin im Kalender des Studios (oder Knöpfe „bestätigen / ich rufe an“ im Modus Wunschtermin), Bestätigung mit Vorbereitung und Kalenderdatei an die Kundin, Mail ans Studio mit „Fake melden“ |
| Nicht bestätigt nach 45 Minuten | Platz wird wieder frei, Zeile „verfallen“ |
| 24 Stunden vorher | Erinnerung mit Vorbereitung und Absage-Link an die Kundin |
| Kundin sagt ab | Kalendereintrag weg, Mail ans Studio, Platz wieder frei |
| Täglich 19 Uhr | Jedes Studio: „Wie waren die Termine heute?“ mit Knöpfen erschienen · nicht erschienen · gekauft |
| Rückruf-Wunsch (Formular) | Mail ans Studio mit „Zurückgerufen“, Erinnerung nach 60 Minuten |
| Montag 8 Uhr | Offene Termine und Anfragen an jedes Studio, Übersicht an dich |
| Erster Kauf eines Studios | Mail an dich: ab nächstem Monat Monatsgebühr |
| 1. / 3. des Monats | Werbekosten und Rechnungen · Monatsreports als Entwurf in deinem Gmail |
| Täglich 7 Uhr | Verlosung ziehen · Akquise-Liste · Warnung, wenn das Mail-Kontingent knapp wird |
| Viele unbestätigte Buchungen auf einmal | Buchung kurz gesperrt, Warnung an dich (Bot oder jemand, der Termine blockieren will) |

## Die Dateien

- **„2 Beauty-Zentrale – in Google Drive hochladen.xlsx“**: die Tabelle zum Hochladen
- **„3 Beauty-Zentrale-Code – in Apps Script einfügen.txt“**: der Code, den du in Apps Script einfügst (gleich wie `Code.gs`)

## So richtest du sie ein

1. **Hochladen:** drive.google.com → „Neu“ → „Datei hochladen“ → „2 Beauty-Zentrale – in Google Drive hochladen.xlsx“.
   Die Datei öffnen → oben „Datei“ → „Als Google Tabellen speichern“. Ab jetzt nur noch diese
   Google-Version benutzen (die .xlsx kannst du löschen).
2. **Eure Daten:** Blatt „Einstellungen“ → alle gelben Felder ausfüllen. Bei „Hinweise gehen an“
   deine E-Mail, gern mit Komma auch die deines Kollegen.
3. **Code einfügen:** Menü „Erweiterungen“ → „Apps Script“. Im Editor alles löschen. Die Datei
   „3 Beauty-Zentrale-Code – in Apps Script einfügen.txt“ öffnen, alles kopieren, einfügen. Oben auf das Disketten-Symbol (Speichern).
   Oben links „Unbenanntes Projekt“ anklicken → „Clickculture Beauty-Zentrale“.
4. **Zeitzone:** links das Zahnrad (Projekteinstellungen) → Zeitzone „(GMT+01:00) Berlin“.
5. **Bereitstellen:** oben rechts „Bereitstellen“ → „Neue Bereitstellung“ → beim Zahnrad neben
   „Typ auswählen“ → „Web-App“.
   - Beschreibung: Zentrale
   - Ausführen als: **Ich**
   - Zugriff: **Jeder**
   - „Bereitstellen“ → „Zugriff autorisieren“ → dein Google-Konto → Google warnt „App nicht
     überprüft“ → „Erweitert“ → „Weiter zu Clickculture Beauty-Zentrale (unsicher)“ → „Zulassen“.
     (Die Warnung kommt, weil du die App selbst geschrieben hast. Sie läuft nur in deinem Konto.)
   - Im Fenster stehen zwei Dinge mit „Kopieren“-Knopf: oben die „Bereitstellungs-ID“, darunter
     **„Web-App“ → „URL“**. Den **unteren** Knopf nehmen (die Adresse beginnt mit
     `https://script.google.com/macros/s/` und endet auf `/exec`) → in der Tabelle, Blatt
     „Einstellungen“, bei „Web-App-Adresse“ einfügen.
   - **Prüfen:** Die Adresse in einem privaten Browserfenster öffnen. Es muss „Clickculture Zentrale –
     Diese Adresse ist in Ordnung“ erscheinen. Kommt „Datei kann derzeit nicht geöffnet werden“,
     ist es die falsche Adresse. Wiederfinden: „Bereitstellen“ → „Bereitstellungen verwalten“.
6. **Einschalten:** Zurück zum Browser-Tab mit der **Google-Tabelle** (nicht Apps Script) und neu laden (Mac `Cmd + R`,
   Windows `F5`). Nach ein paar Sekunden erscheint oben rechts neben „Hilfe“ das Menü **„Clickculture“** →
   „1 · Einrichten“ → beim ersten Mal „Weiter“ und zulassen (Google fragt jetzt auch nach **Kalender**: zulassen) →
   danach nochmal „1 · Einrichten“. Die Meldung sagt „Die Automatik läuft“.
   *Kein Menü?* Steht oben neben dem Dateinamen „.XLSX“, ist es noch nicht die Google-Version (Schritt 1).
7. **Web-App-Adresse in die Steckbrief-Vorlage:** dieselbe Adresse (endet auf `/exec`) in der Steckbrief-Vorlage,
   Blatt **„Eure Daten“**, bei „Web-App-Adresse der Beauty-Zentrale“ eintragen, dazu bei „Google-Konto der
   Beauty-Zentrale“ die E-Mail des Kontos, unter dem die Zentrale läuft (dafür geben die Studios ihren Kalender frei). Ohne die Adresse zeigen die Terminseiten nur Beispiel-Termine.
8. **Testen** (10 Minuten, mit dir selbst als Studio):
   - In deinem eigenen Google-Kalender nichts ändern. Blatt **„Kunden“** → eine Zeile: Kürzel `test`, Betrieb `Test`,
     deine E-Mail bei „E-Mail für Termine“, Adresse, Aktiv `Ja`, Buchung `Kalender`, Kalender-ID = **deine E-Mail**,
     Buchbare Zeiten `Mo-Sa 9-18`, Beratung Minuten `20`, Vorlauf Stunden `1`, Absagefrist Stunden `24`.
   - Menü „Clickculture“ → **„2 · Kalender der Kunden prüfen“**: Es muss „✓ Kalender verbunden“ stehen.
   - Menü → **„3 · Test-Buchung durchspielen“**: Du bekommst die Mail „Bitte bestätigen“. Auf den Knopf tippen →
     es öffnet sich eine Seite der Zentrale → dort nochmal **„Termin verbindlich bestätigen“**. Jetzt muss passieren:
     Termin in deinem Kalender, Mail „Bestätigt“ (mit Kalenderdatei), Mail „Neuer Online-Termin“. In der Bestätigung
     unten auf **„Termin absagen“** → bestätigen → der Kalendereintrag verschwindet wieder.
     (Ein Test-Studio ohne eigene Webseite bekommt diese einfachen Seiten der Zentrale. Echte Studios haben ihre
     eigene Terminseite, die testest du in Schritt 7 der Anleitung.)
   - Aufräumen: Zeile `test` in „Kunden“ löschen (oder Aktiv `Nein`), TEST-Zeile in „Termine“ löschen, Spalte `test`
     in „Checkliste“ löschen.

9. **Mit deinem Kollegen teilen:** oben rechts „Freigeben“ → seine E-Mail → **Bearbeiter**. Er sieht und bearbeitet
   alles, die Automatik läuft aber weiter in **deinem** Konto (bzw. dem Agentur-Konto). Das Menü „Clickculture“
   funktioniert auch bei ihm (beim ersten Mal muss er zulassen).
10. **Team eintragen:** Blatt „Einstellungen“ → **„Hinweise gehen an“**: eure beiden E-Mails mit Komma →
   **„Wer ist im Team?“**: `Max = max@mail.de; Tom = tom@mail.de` (eure Namen, Vorname reicht). Dann: Im Blatt
   „Kunden“ steht bei jedem Studio der **Betreuer**, im Blatt „Akquise“ bei jedem Studio **„Wer“**. Daraus macht die
   Zentrale: Jeder bekommt morgens seine eigene Akquise-Liste, der Betreuer bekommt den Report-Text seines Studios,
   und Hinweise an euch beide tragen den Betreuer im Betreff.

**Ein Konto für die Zentrale:** Die Studios geben ihren Kalender für das Google-Konto frei, unter dem die Zentrale
läuft. Am besten ein eigenes Agentur-Konto (z. B. Google Workspace mit eurer Domain), auf das ihr beide zugreifen
könnt. Läuft sie unter einem privaten Konto, kann nur dessen Inhaber Apps Script und Gmail-Entwürfe sehen.

Fertig. Ab jetzt läuft alles von selbst.

## Wichtig

- **Spalten und Blätter nicht umbenennen oder verschieben.** Die Automatik findet sie über die
  Überschriften. Wird doch etwas umbenannt, kommt eine Fehler-Mail mit dem Namen.
- **Code geändert?** (z. B. weil Claude eine neue Fassung liefert): Code ersetzen, speichern, dann
  „Bereitstellen“ → „Bereitstellungen verwalten“ → Stift → Version „Neue Version“ → „Bereitstellen“.
  Die Web-App-Adresse bleibt gleich. Danach im Tab mit der Tabelle neu laden → Menü „Clickculture“ →
  „1 · Einrichten“. Ohne „Neue Version“ läuft für Netlify weiter der alte Code.
- **Welche Web-App-Adresse ist die richtige?** Immer die unter „Bereitstellen“ → „Bereitstellungen
  verwalten“ → **„Aktiv“** → „Web-App“ → URL. Gibt es dort mehrere aktive, die oberste nehmen und die
  anderen per Stift ebenfalls auf „Neue Version“ stellen. Zur Kontrolle im privaten Fenster öffnen.
- **Grenzen von Google:** Ein kostenloses Konto darf etwa **100 Mails am Tag** schicken. Pro Online-Termin gehen
  3–4 Mails raus (bitte bestätigen, Bestätigung, Studio, Erinnerung), dazu eine Abend-Mail je Studio. Das reicht für
  etwa **20 Buchungen am Tag über alle Studios**. Darüber, spätestens ab dem 4.–5. Studio: die Zentrale in einem
  **Google-Workspace-Konto** betreiben (ca. 7 € im Monat, dann 1.500 Mails am Tag). Die Zentrale warnt dich morgens,
  wenn es knapp wird.
- **Datenschutz:** In „Termine“ stehen Namen, Telefonnummern und E-Mails von Privatleuten. Du verarbeitest sie im Auftrag der Studios (Auftragsverarbeitungsvertrag, Vereinbarung §6). Alte Zeilen (älter als 12 Monate) einmal im Quartal löschen. Die Tabelle
  nur mit deinem Kollegen teilen, nie öffentlich. Ins Repo kommt sie nie.

## Für Claude (Technik)

`Code.gs` ist die Quelle, „3 Beauty-Zentrale-Code …txt“ im Finder-Ordner ist dieselbe Datei. Spaltennamen in
`zentrale-bauen.py` und `Code.gs` müssen zusammenpassen. Prüfen mit `node nischen/beauty/zentrale/test/test.js`
(baut Google samt Kalender nach und spielt alle Abläufe durch) und `node nischen/beauty/zentrale/test/seiten-test.js`
(echte Terminseite im Browser gegen die nachgebaute Zentrale).
