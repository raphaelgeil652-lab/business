# Hilfe: Meta und Google mit dem Studio einrichten

Zum Mitmachen am Telefon mit Bildschirm-Teilen (ca. 30 Minuten). Das Studio klickt, ihr sagt an.
So sehen Meta und Google im November 2026 aus. Heißt ein Knopf anders, das Nächstliegende nehmen.
Dieselben Schritte stehen kürzer auf der Schritte-Seite des Studios.

**Vorher klären (im Gespräch):** Wer im Studio hat ein Facebook-Profil? Wer hat die Firmenkarte zur Hand?
Beides muss beim Termin da sein. Ohne Karte bleibt jede Kampagne im Entwurf.

---

## Meta (Facebook und Instagram)

**Grundregel:** Seite und Werbekonto gehören dem Studio. Ihr bekommt nur Zugriff als Partner.
Ein Werbekonto, das in eurem Portfolio angelegt wurde, lässt sich nicht an das Studio übergeben, und eine Sperre
eures Portfolios würde dann alle Studios treffen.

1. **Facebook-Profil.** Die Inhaberin braucht ein echtes, persönliches Profil mit ihrem echten Namen. Hat sie keins:
   facebook.com → **Neues Konto erstellen**. Keine erfundenen Profile, kein VPN: Meta sperrt so etwas.
   Danach **Einstellungen → Kontenübersicht → Passwort und Sicherheit → Zweistufige Authentifizierung** einschalten.
2. **Business-Portfolio.** business.facebook.com → **Portfolio erstellen**. Name des Studios, ihr Name, die geschäftliche E-Mail.
   Die Angaben wie im Impressum.
3. **Facebook-Seite.** Hat das Studio noch keine: im Portfolio **Einstellungen → Konten → Seiten → Hinzufügen → Neue
   Facebook-Seite erstellen**. Kategorie: Laser „Kosmetikstudio“, Permanent Make-up „Permanent Make-up-Studio“,
   Faltenbehandlung „Arzt“, Bleaching „Zahnarzt“. Ein Instagram-Konto ist nicht nötig: Die Anzeigen laufen auch auf
   Instagram mit Name und Bild der Facebook-Seite.
4. **Werbekonto.** **Einstellungen → Konten → Werbekonten → Hinzufügen → Neues Werbekonto erstellen**.
   Zeitzone **Europe/Berlin**, Währung **EUR**. Beides lässt sich später **nicht** ändern. Wofür: **„Mein Unternehmen“**.
   Danach im Werbekonto **Zahlungseinstellungen → Zahlungsmethode hinzufügen** → die Karte des Studios.
5. **Werbetreibender und Zahler** (EU-Pflicht, sonst laufen keine Anzeigen): im Werbekonto bei den Einstellungen zur
   Transparenz beide Male **das Studio** eintragen, nicht euch.
6. **Partner hinzufügen.** **Einstellungen → Nutzer → Partner → Hinzufügen → „Gewähre einem Partner Zugriff auf
   deine Assets“** → Business-ID `2264672317797144` → die **Seite** und das **Werbekonto** auswählen, jeweils
   **volle Kontrolle**. Hat das Studio schon einen Datensatz (Pixel), den auch.
7. Auf der Schritte-Seite: **„Erledigt, Partnerzugriff ist freigegeben“**.

**Euer Teil danach** (die Mail der Zentrale sagt es auch): business.facebook.com → **euer** Portfolio →
**Einstellungen → Konten → Werbekonten** → Konto des Studios → **Personen zuweisen** (euch beide, volle Kontrolle).
Dasselbe bei **Seiten**. Ohne diesen Schritt seht ihr das Konto im Werbeanzeigenmanager nicht.
Dann den Datensatz (Pixel) anlegen, wie in der Kampagnen-Anleitung beschrieben.

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
