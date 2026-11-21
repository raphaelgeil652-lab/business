# Hilfe: Meta und Google mit dem Studio einrichten

Bei Meta macht das Studio nur zwei kurze Dinge selbst (steht auf seiner Schritte-Seite), den Rest richtet ihr ein.
So sehen Meta und Google im November 2026 aus. Heißt ein Knopf anders, das Nächstliegende nehmen.

**Vorher klären (im Gespräch):** Hat die Inhaberin ein Facebook-Profil? Hat das Studio schon eine Facebook-Seite?

---

## Meta (Facebook und Instagram)

**Grundregel:** Seite und Werbekonto gehören dem Studio. Darum legt ihr sie **im Portfolio des Studios** an, nie in
eurem. Ein Werbekonto aus eurem Portfolio lässt sich nicht an das Studio übergeben, und eine Sperre eures Portfolios
würde dann alle Studios treffen.

**Das Studio macht nur zwei Dinge** (steht so auf seiner Schritte-Seite, ohne Anruf):

1. **Business-Portfolio anlegen** (falls es noch keins hat): business.facebook.com → „Business-Portfolio erstellen“ →
   Name des Studios, eigener Name, E-Mail → in der Mail von Facebook „Jetzt bestätigen“.
2. **Euch einladen:** Einstellungen → Personen → Hinzufügen → eure Facebook-E-Mail (Einstellung „meta_einladung“) →
   **Volle Kontrolle** → Einladen. Dann auf der Schritte-Seite „Erledigt, ich habe Clickculture eingeladen“.

Ein Facebook-Profil braucht die Inhaberin dafür: ihr echtes, persönliches. Hat sie keins, legt sie es auf facebook.com
an. Keine erfundenen Profile, kein VPN: Meta sperrt so etwas.

**Euer Teil** (ihr bekommt eine Mail, die Klickliste steht auf der Team-Seite im Kasten „Meta einrichten“):

1. Einladung annehmen (Mail von Facebook an eure Facebook-E-Mail).
2. Auf business.facebook.com **oben links das Portfolio des Studios wählen**. Ab hier alles dort.
3. **Seite:** Einstellungen → Konten → Seiten → Hinzufügen → „Neue Facebook-Seite erstellen“. Hat das Studio schon
   eine Seite: „Vorhandene Seite hinzufügen“. Dann muss das Studio eine Anfrage genehmigen (auf der Team-Seite
   „schon vorhanden“ wählen, dann steht es in seiner Mail).
4. **Werbekonto:** Einstellungen → Konten → Werbekonten → Hinzufügen → „Neues Werbekonto erstellen“. Zeitzone
   **Europe/Berlin**, Währung **EUR** (beides später **nicht** änderbar), „Mein Unternehmen“. Euch volle Kontrolle geben.
5. **Werbetreibender und Zahler** (EU-Pflicht, sonst laufen keine Anzeigen): im Werbekonto beide Male **das Studio**.
6. **Pixel:** Events Manager → Datenquellen verbinden → Web → mit dem Werbekonto verbinden.
7. **Partnerzugriff für euer Portfolio:** Einstellungen → Partner → Hinzufügen → „Gewähre einem Partner Zugriff auf
   deine Assets“ → eure Business-ID `2264672317797144` → Seite, Werbekonto, Pixel, volle Kontrolle. Dann im
   Clickculture-Portfolio bei Werbekonten und Seiten **Personen zuweisen** (euch beide).
8. Team-Seite: Werbekonto-ID und Pixel-ID eintragen → **„Meta fertig“**.

**Zum Schluss das Studio:** Es bekommt die Mail „Karte hinterlegen“. Der Knopf auf der Schritte-Seite öffnet direkt die
Zahlungsseite seines Werbekontos → „Zahlungsmethode hinzufügen“ → Karte → Speichern → „Erledigt“. Die Karte gibt
nie ihr ein: Das Studio zahlt Meta selbst.

**Klappt es beim Studio nicht** (kommt nicht weiter, findet den Knopf nicht): anrufen und die zwei Schritte am Telefon
vorlesen. Mehr muss es nicht tun.

**Vorsicht vor gefälschten Mails** „Ihr Konto wurde eingeschränkt“: nie auf Links klicken, immer direkt in
business.facebook.com nachsehen.

---

## Google Ads

**Grundregel:** Das Studio legt sein Konto selbst an, ihr verknüpft es danach mit eurem Verwaltungskonto.
Wenn ihr ein Konto im Verwaltungskonto anlegt, zwingt Google euch durch den Assistenten (Unternehmen, Webseite,
Kampagne, Zahlung). Der Ausweg „Konto ohne Kampagne“ fehlt dort, bis euer Verwaltungskonto über 1.000 $ ausgegeben hat.

1. ads.google.com öffnen, **mit dem Google-Konto des Studios** anmelden. Chrome, kein VPN, kein Werbeblocker.
2. **Neues Google Ads-Konto** bzw. **Jetzt starten**.
3. Google fragt nach dem Unternehmen und will eine Kampagne bauen. **Nichts ausfüllen.** Ganz unten klein:
   **„Zum Expertenmodus wechseln“**.
4. Nächste Seite, ganz unten: **„Konto ohne Kampagne erstellen“**.
5. Land **Deutschland**, Zeitzone **(GMT+01:00) Berlin**, Währung **Euro (EUR)**. Später nicht änderbar → **Senden**.
6. **„Konto ansehen“**. Oben rechts steht die **Kunden-ID** (123-456-7890). Auf der Schritte-Seite eintragen → Speichern.
7. **Ihr:** ads.google.com → euer Verwaltungskonto `774-518-7262` → links **Konten** → blaues **+** →
   **„Vorhandenes Konto verknüpfen“** → Kunden-ID → **Anfrage senden**.
8. **Studio:** in seinem Konto links **Verwaltung → Zugriff und Sicherheit** → oben **Verwaltungskonten** → **Annehmen**.
9. **Studio:** links **Abrechnung → Einstellungen** → Zahlungsmethode (seine Karte).
10. Auf der Schritte-Seite: **„Erledigt, Anfrage angenommen“**.

**Passkey:** Seit Juli 2026 verlangt Google für Abrechnung und Nutzer-Änderungen manchmal einen Passkey. Ein neuer
Passkey gilt erst nach **48 Stunden**. Deshalb Google mindestens zwei Tage vor dem gewünschten Start erledigen.

**Bestätigung des Werbetreibenden:** fordert Google später per Hinweis an, mit Frist. Dann macht das Studio sie
(Ausweis bzw. Firmendaten). Frist nicht verpassen, sonst pausiert Google die Anzeigen.

---

## Netlify (ihr)

Einmal: Tarif **Personal**. Pro Studio: **Add new project → Deploy manually** → Ordner „1 Seite für Netlify“ hineinziehen
→ **Project configuration → Change project name** → Kürzel des Studios. Neue Fassung derselben Seite: im Projekt
**Deploys** → Ordner in das Feld unten ziehen.

## Wenn etwas hakt

| Problem | Lösung |
|---|---|
| Studio findet die Schritte-Seite nicht | Team-Seite → „Schritte-Seite öffnen“ → Link schicken, oder „Studio jetzt erinnern“ |
| „Freigabe prüfen“ sagt „noch keine Freigabe“ | Kalender-Freigabe mit „Änderungen an Terminen vornehmen“, an die Adresse auf der Schritte-Seite. 1–2 Minuten warten |
| Google zeigt „Zum Expertenmodus wechseln“ nicht | Abmelden, im privaten Fenster neu anmelden. Sonst Assistent ausfüllen mit der Webseite, die das Studio schon hat, Kampagne am Ende pausieren |
| Meta: Werbekonto taucht bei euch nicht auf | „Personen zuweisen“ vergessen (siehe oben) |
| Meta bietet „Lead“ nicht an | Kampagnen-Anleitung, Abschnitt „Wenn Meta ‚Lead‘ nicht anbietet“ |
| Terminseite zeigt nur Beispiel-Termine | Claude hat die Seite ohne Adresse der Zentrale gebaut: „Text für Claude“ von der Team-Seite neu schicken |
