# Hilfe für Schritt 6: Zugänge, Messung, Seiten online, Zentrale verbinden, Kampagne

Klick für Klick, so wie Meta, Google und Netlify im November 2026 aussehen. Die Reihenfolge ist wichtig:
erst messen, dann erzeugen, dann hochladen, dann verbinden, dann Kampagne.
Kürzel und Adresse des Kunden stehen oben in seiner „0 Übersicht“.

## 0 · Zugänge: Google (Schritt 4) und Meta (Schritt 5)

### Google: Konto anlegen oder verknüpfen (Schritt 4, vor der Willkommens-Mail)

Chrome, kein VPN, kein Werbeblocker. Normalfall: Der Kunde hat noch kein Konto, du legst es an.
1. Dein Verwaltungskonto öffnen → links das Symbol **„Konten“** → oben **„Unterkonto-Einstellungen“** (falls es da
   ist) → blauer **„+“** → **„Neues Konto erstellen“** → Name = Betrieb,
   Deutschland, Zeitzone Berlin, EUR → Erstellen. Die **Kunden-ID** des neuen Kontos (10 Ziffern) notieren.
   Fragt Google dabei nach **Zahlungsdaten: nichts eintragen**, überspringen bzw. zurück. Die Zahlungsart
   trägt der Kunde selbst ein.
2. Startet Google den Assistenten **„Erste Kampagne erstellen“**: oben links **×**. Die Kampagne kommt später.
3. Das neue Konto öffnen → links **„Verwaltung“** (Zahnrad) → **„Zugriff und Sicherheit“** → **„+“** →
   E-Mail des Kunden → Zugriffsebene **„Administrator“** → Einladung senden. Es muss „Administrator“ sein:
   Nur ein Administrator darf eine Zahlungsart hinterlegen und die Bestätigung als Werbetreibender machen.
4. Der Kunde nimmt die Einladung an und hinterlegt unter **„Abrechnung“** → „Einstellungen“ seine
   **Zahlungsart** (seine Firma, seine Karte, er zahlt Google direkt). Erst danach die Kampagne anlegen.

Hat der Kunde **schon ein Google-Ads-Konto** (Kunden-ID steht in den Notizen des Steckbriefs): kein neues
Konto anlegen. Verwaltungskonto → „Konten“ (→ „Unterkonto-Einstellungen“) → „+“ → **„Vorhandenes Konto verknüpfen“** → seine ID → Anfrage
senden. Er nimmt an: in seinem Konto „Verwaltung“ → „Zugriff und Sicherheit“ → Reiter **„Verwaltungskonten“**
→ Annehmen (steht so in seiner Zugänge-Anleitung, Teil C4).

*Im Probelauf geprüft: Konto anlegen und Conversion. Einladung, Zahlungsart und Verknüpfen noch nicht.*

**Beim Probelauf** (Kunden-E-Mail = deine eigene): Die Einladung entfällt, du hast über dein Verwaltungskonto
schon Zugriff. Eine Zahlungsart willst du für einen erfundenen Kunden nicht hinterlegen. Deshalb die
Google-Kampagne nur **bis zum Bildschirm, der nach Zahlungsdaten fragt**, durchklicken, dort abbrechen.
Alles davor ist damit geprüft. Wer den Kundenteil echt testen will: eine zweite E-Mail-Adresse (z. B. die des
Kollegen) als Kunden-E-Mail in den Steckbrief.

### Meta: Zugriff annehmen (Ende Schritt 5, wenn der Kunde dich eingeladen hat)

Der Kunde lädt dich mit deiner Business-ID als Partner ein (steht so in der Willkommens-Mail). Danach:
1. business.facebook.com/settings → „Konten“ → **„Werbekonten“**: Das Konto des Kunden steht in der Liste
   (oft mit dem Hinweis, dass es einem anderen Portfolio gehört).
2. Anklicken → **„Personen zuweisen“** → dich auswählen → **„Vollständige Kontrolle“** → Zuweisen.
   Ohne diesen Schritt siehst du das Konto im Werbeanzeigenmanager nicht.
3. Dasselbe unter „Konten“ → **„Seiten“** für seine Facebook-Seite.
4. Zahlungsmethode: hinterlegt der **Kunde** in seinem Werbekonto (seine Karte, er zahlt Meta direkt).

## A · Messung anlegen (vor dem Hochladen)

Steht ausführlich in **„7 Kampagnen“**, Abschnitt „Vorher: Messung einrichten“: Meta-Pixel
(Meta sagt „Datensatz“) anlegen und mit dem Werbekonto des Kunden verbinden, dazu die
Google-Conversion. Bei Google wichtig: Den Wert holst du dir im Tag Manager, der sich dabei öffnet.
Dort nichts senden und nichts einbauen. Beide IDs in den Steckbrief, Teil 4, **mit `'` davor**
(sonst macht Excel aus der letzten Ziffer eine 0).

## B · Kundenordner neu erzeugen lassen

Steckbrief (jetzt mit Teil 3 und 4) und die besten Fotos aus seinem Drive-Ordner an Claude:
**„Erzeuge [Betrieb] neu.“** Fotos am besten so benennen: `foto-1`, `foto-2`, `foto-3` (Titelbilder),
`vorher` und `nachher` (dasselbe Dach). Größe und Format sind egal, das System verkleinert sie.
Der neue Ordner ersetzt den alten komplett. Es geht nichts verloren: Abgehakt wird in der Zentrale.

## C · Seiten auf Netlify

1. Bei **app.netlify.com einloggen** (wichtig: eingeloggt sein, sonst ist die Seite nur vorläufig).
2. **app.netlify.com/drop** öffnen → den Ordner **„8 Seiten für Netlify“** aus dem Kundenordner ins
   große Feld ziehen. Den ganzen Ordner, nicht einzelne Dateien. Nach ca. 30 Sekunden ist er online.
3. **Namen ändern:** links „Project configuration“ → „General“ → im Kasten „Project details“ auf
   **„Change project name“** (bzw. „Options“ → „Change project name“) → das **Kürzel** eintragen → Save.
   Jetzt heißt die Adresse `https://<kürzel>.netlify.app`, genau die, die in den Kampagnen steht.
   *Ist der Name vergeben:* anderen nehmen, die volle Adresse im Steckbrief bei „Eigene Adresse der
   Seiten“ eintragen, neu erzeugen lassen, ab Punkt 5 nochmal hochziehen.
4. **Formulare einschalten:** links „Project configuration“ → **„Forms“** → „Enable form detection“.
5. **Nochmal hochladen** (erst jetzt erkennt Netlify die Formulare): links **„Deploys“** → nach unten
   scrollen bis zum Feld mit **gestricheltem Rand** („Drag and drop your project output folder here“)
   → den Ordner „8 Seiten für Netlify“ hineinziehen → es erscheint „Published“.
   Nicht wieder app.netlify.com/drop nehmen, das macht eine zweite, neue Seite.
6. **Prüfen:** `https://<kürzel>.netlify.app` öffnen → die Wirtschaftlichkeitsprüfung erscheint.
   Unter Project configuration → Forms stehen die Formulare „wirtschaftlichkeit“ und „rechner“.

**Kosten:** Netlify kostenlos hat 300 Credits im Monat. Im Probelauf waren sie nach zwei Testkunden
aufgebraucht; dann erscheint oben rot „running on operational credits“ und neue Uploads gehen nicht
mehr (bestehende Seiten bleiben online). **Ab dem ersten echten Kunden deshalb Tarif „Personal“**
(ca. 9 $ im Monat, 1.000 Credits; das Onboarding deckt das locker). Trotzdem nur hochladen, wenn sich
etwas geändert hat.

## D · Mit der Zentrale verbinden

1. In der Zentrale, Blatt „Einstellungen“, die **„Webhook-Adresse für Netlify“** kopieren. Sie endet auf
   **`?key=…`**. Nicht die „Web-App-Adresse“ darüber nehmen: Ohne Schlüssel lehnt die Zentrale jede
   Anfrage still ab.
2. Netlify → Project configuration → **„Notifications“**. Dort gibt es mehrere Bereiche. Den Bereich
   **„Form submission notifications“** nehmen (nicht „Deploy notifications“).
3. Dort **„Add notification“ → „Outgoing webhook“** (nicht „Email notification“):
   Event „New form submission“ · URL to notify: die Webhook-Adresse · Form „Any form“ → Save.
4. Nochmal **„Add notification“ → „Email notification“**: deine E-Mail · „New form submission“ ·
   „Any form“ → Save. Das ist deine Sicherheitskopie jeder Anfrage.
5. In der Liste stehen jetzt **zwei** Einträge: einer mit deiner E-Mail, einer mit `script.google.com`.

**Klappt es nicht** (Test-Anfrage kommt nicht in der Zentrale an):
- Zentrale → Erweiterungen → Apps Script → links **„Ausführungen“**: Steht dort kein „doPost“, kommt
  Netlify nicht an. Prüfen: Endet die Adresse in Netlify auf `?key=`? Ist sie die aus „Einstellungen“?
- Die Web-App-Adresse (ohne `?key=`) in einem privaten Browserfenster öffnen: Es muss „Clickculture
  Zentrale – Diese Adresse ist in Ordnung“ erscheinen. Kommt „Datei kann derzeit nicht geöffnet
  werden“, ist die Web-App-Adresse falsch: in Apps Script „Bereitstellen“ → „Bereitstellungen verwalten“
  → unter **„Web-App“ die URL** kopieren (nicht die Bereitstellungs-ID darüber).

## E · Meta-Kampagne

Genau nach **„7 Kampagnen“**, Abschnitt „Meta-Kampagne anlegen: Klick für Klick“. Dort steht jedes
Feld in der Reihenfolge, in der Meta es zeigt, mit dem fertigen Eintrag. Am Ende **nicht
veröffentlichen**, nur schließen: Die Kampagne bleibt ein Entwurf bis Schritt 7.

Nicht den Knopf „Werbung schalten“ auf der Facebook-Seite benutzen und nicht „Anzeige erstellen“ in
der Business Suite: Dort fehlen die Felder. Immer **adsmanager.facebook.com** → „+ Erstellen“.

## F · Google-Kampagne

Genau nach **„7 Kampagnen“**, Abschnitt „Google-Kampagne anlegen: Klick für Klick“. Vorher muss der Kunde
seine Zahlungsart hinterlegt haben (Punkt 0). Am Ende veröffentlichen und **sofort auf „Pausiert“** stellen,
dann die ausschließenden Keywords eintragen. Google prüft die Anzeigen auch im pausierten Zustand. Vor
Schritt 7 in der Kampagne nachsehen: Bei den Anzeigen steht „Zulässig“ (nicht „Abgelehnt“).

**Google hängt** („Ein Fehler ist aufgetreten – Google Ads aktualisieren“, weiße Seite):
1. „Reload“. 2. VPN aus, Werbeblocker aus, Tab schließen, neu öffnen. 3. Privates Fenster in Chrome.
4. Über dein Verwaltungskonto: links „Kampagnen“ → „+“ → Konto des Kunden wählen.
Angefangene Kampagnen liegen unter Kampagnen → „Entwürfe“.

## Danach: Schritt 7 (Testen)

1. Im Events Manager das Pixel des Kunden öffnen → Reiter **„Events testen“** → bei Website die
   Adresse `https://<kürzel>.netlify.app/wirtschaftlichkeit.html` eintragen → **„Website öffnen“**.
2. Im neuen Fenster bei den Cookies **„Einverstanden“**, dann das Formular mit dem Namen „TEST“ abschicken.
3. Es muss passieren:
   - im Events Manager erscheinen **„PageView“** und **„Lead“** mit „Verarbeitet“,
   - der Kunde (bzw. du) bekommt die Anfrage-Mail **mit den Knöpfen**,
   - in der Zentrale steht eine Zeile im Blatt „Anfragen“,
   - du bekommst die Sicherheitskopie von Netlify.
4. In der Anfrage-Mail auf „Zurückgerufen“ tippen und bestätigen → in der Zentrale stehen Uhrzeit und
   Minuten. Danach die TEST-Zeilen in der Zentrale löschen.

**Google:** Die Test-Anfrage zählt Google nicht, weil sie nicht über eine Anzeige kam. Bei der Conversion
steht deshalb weiter „Warten auf Conversions“. Das ist richtig. Nach den ersten echten Anzeigenklicks
(1–2 Tage nach dem Start) prüfen: Zielvorhaben → Conversions → der Status wechselt auf „Aktiv“ bzw. es stehen
Conversions in der Spalte.

Gut zu wissen: Die Test-Ereignisse erscheinen nur unter „Events testen“, nicht in der „Übersicht“.
Echte Besucher tauchen in der Übersicht mit 20–30 Minuten Verzögerung auf (Zeitraum oben rechts auf
„Heute“ stellen). Ohne „Einverstanden“ bei den Cookies sendet die Seite absichtlich nichts an Meta.

## Nach einem Probelauf aufräumen

1. **Zentrale**, Blatt „Kunden“: beim Testkunden bei **„Aktiv“ Nein** eintragen. Sonst bekommst du weiter
   Montags-Mails und Erinnerungen für ihn. Im Blatt „Anfragen“ die TEST-Zeilen löschen.
2. **Meta:** Die Kampagne im Entwurf löschen (Werbeanzeigenmanager → Haken davor → Papierkorb).
3. **Google:** Den Kampagnen-Entwurf löschen. Das Testkonto darf bleiben, ohne Zahlungsart kostet es nichts.
4. **Netlify:** die Seite löschen (siehe unten). Spart Credits.

## Seite löschen (Kunde hört auf oder nach einem Probelauf)

Netlify → Projekt → Project configuration → General → im Kasten „Project details“ **„Options“ →
„Delete project“** → Namen eintippen → bestätigen. Oder in der Projektliste bei „…“ → Delete.
