# Zentrale einrichten (einmal, ca. 20 Minuten)

Die **Zentrale** ist eine Google-Tabelle in deinem Google-Konto. Dort laufen alle Kunden zusammen,
und sie erledigt die Routine im Hintergrund. Kostenlos, kein Server, kein Abo.

## Was sie von selbst macht

| Wann | Was passiert |
|---|---|
| Neue Anfrage auf einer Kundenseite | Zeile im Blatt „Anfragen“. Sofort Mail an den Kunden mit Telefonnummer zum Antippen und den Knöpfen „Zurückgerufen“ / „Nicht erreicht“. Ein Foto der Stromrechnung landet im Drive-Ordner des Kunden. |
| 60 Minuten ohne Rückruf (nur Geschäftszeit gezählt) | Erinnerung an den Kunden, Hinweis an dich |
| Montag 8 Uhr | Jeder Kunde bekommt seine offenen Anfragen mit Knöpfen: Termin · Angebot · Auftrag · kein Interesse. Du bekommst eine Übersicht. |
| Erster Auftrag eines Kunden | Mail an dich: ab nächstem Monat Monatsgebühr berechnen |
| 1. des Monats | Mail an dich: Werbekosten eintragen, diese Rechnungen sind fällig |
| 3. des Monats | Für jeden Kunden ein fertiger Monatsreport als Entwurf in deinem Gmail |
| Täglich 7 Uhr | Verlosung: am Tag der Ziehung die Gewinner · Akquise: wen du heute anrufst |
| Neuer Kunde im Blatt „Kunden“ | eigene Spalte im Blatt „Checkliste“ |
| Ein Fehler passiert | Mail an dich mit dem Grund |

Die Knöpfe in den Mails fragen immer einmal nach („… eintragen?“). So kann kein Virenscanner aus
Versehen etwas ändern.

## Die Dateien

- **Clickculture Zentrale.xlsx**: die Tabelle zum Hochladen
- **Zentrale-Code.txt**: der Code, den du in Apps Script einfügst (gleich wie `Code.gs`)

## So richtest du sie ein

1. **Hochladen:** drive.google.com → „Neu“ → „Datei hochladen“ → „Clickculture Zentrale.xlsx“.
   Die Datei öffnen → oben „Datei“ → „Als Google Tabellen speichern“. Ab jetzt nur noch diese
   Google-Version benutzen (die .xlsx kannst du löschen).
2. **Deine Daten:** Blatt „Einstellungen“ → alle gelben Felder ausfüllen. Bei „Hinweise gehen an“
   deine E-Mail, gern mit Komma auch die deines Kollegen.
3. **Code einfügen:** Menü „Erweiterungen“ → „Apps Script“. Im Editor alles löschen. Die Datei
   „Zentrale-Code.txt“ öffnen, alles kopieren, einfügen. Oben auf das Disketten-Symbol (Speichern).
   Oben links „Unbenanntes Projekt“ anklicken → „Clickculture Zentrale“.
4. **Zeitzone:** links das Zahnrad (Projekteinstellungen) → Zeitzone „(GMT+01:00) Berlin“.
5. **Bereitstellen:** oben rechts „Bereitstellen“ → „Neue Bereitstellung“ → beim Zahnrad neben
   „Typ auswählen“ → „Web-App“.
   - Beschreibung: Zentrale
   - Ausführen als: **Ich**
   - Zugriff: **Jeder**
   - „Bereitstellen“ → „Zugriff autorisieren“ → dein Google-Konto → Google warnt „App nicht
     überprüft“ → „Erweitert“ → „Weiter zu Clickculture Zentrale (unsicher)“ → „Zulassen“.
     (Die Warnung kommt, weil du die App selbst geschrieben hast. Sie läuft nur in deinem Konto.)
   - Die **Web-App-URL** kopieren (endet auf `/exec`) → in der Tabelle, Blatt „Einstellungen“,
     bei „Web-App-Adresse“ einfügen.
6. **Einschalten:** die Tabelle im Browser neu laden. Oben erscheint das Menü „Clickculture“ →
   „1 · Einrichten“ → beim ersten Mal zulassen (wie in Schritt 5) → nochmal „1 · Einrichten“.
   Die Meldung sagt „Die Automatik läuft“. Im Blatt „Einstellungen“ steht jetzt die
   **Webhook-Adresse für Netlify**.
7. **Testen:** Blatt „Kunden“ → dich selbst eintragen: Kürzel `test`, Betrieb `Test`, deine E-Mail
   bei „E-Mail für Anfragen“, Aktiv `Ja`. Menü „Clickculture“ → „2 · Test-Anfrage durchspielen“.
   Du bekommst die Anfrage-Mail. Auf „Zurückgerufen“ tippen → bestätigen. Im Blatt „Anfragen“
   stehen jetzt Uhrzeit und Minuten. Danach aufräumen: die Test-Zeilen in „Kunden“ und „Anfragen“
   löschen und im Blatt „Checkliste“ die Spalte `test`.

Fertig. Ab jetzt läuft alles von selbst.

## Wichtig

- **Spalten und Blätter nicht umbenennen oder verschieben.** Die Automatik findet sie über die
  Überschriften. Wird doch etwas umbenannt, kommt eine Fehler-Mail mit dem Namen.
- **Code geändert?** (z. B. weil Claude eine neue Fassung liefert): Code ersetzen, speichern, dann
  „Bereitstellen“ → „Bereitstellungen verwalten“ → Stift → Version „Neue Version“ → „Bereitstellen“.
  Die Web-App-Adresse bleibt gleich.
- **Grenzen von Google** (kostenloses Konto): etwa 100 Mails am Tag. Das reicht für ca. 10 Kunden.
  Darüber Google Workspace (dann 1.500 am Tag).
- **Datenschutz:** In „Anfragen“ stehen Namen und Telefonnummern von Privatleuten. Die Tabelle
  nur mit deinem Kollegen teilen, nie öffentlich. Ins Repo kommt sie nie.

## Für Claude (Technik)

`Code.gs` ist die Quelle, `Zentrale-Code.txt` im Finder-Ordner ist dieselbe Datei. Spaltennamen in
`zentrale-bauen.py` und `Code.gs` müssen zusammenpassen. Prüfen mit `node zentrale/test/test.js`
(baut Google nach und spielt alle Abläufe durch).
