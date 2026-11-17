# Hilfe für Schritt 6: Seiten online, Zentrale verbinden, Kampagnen anlegen

Klick für Klick. Die Reihenfolge ist wichtig: erst messen, dann erzeugen, dann hochladen.
Kürzel und Adresse des Kunden stehen oben in seiner Übersicht („0 Übersicht“).

## A · Messung anlegen (vor dem Hochladen)

Steht ausführlich vorne in **„7 Kampagnen“** im Kundenordner, Abschnitt „Vorher: Messung einrichten“:
Meta-Pixel anlegen und, wenn eine Google-Kampagne läuft, die Google-Conversion. Beide IDs in den
Steckbrief (Teil 4).

## B · Kundenordner neu erzeugen lassen

Steckbrief (jetzt mit Teil 3 und 4) und die besten Fotos aus seinem Drive-Ordner an Claude:
**„Erzeuge [Betrieb] neu.“** Fotos am besten so benennen: `foto-1`, `foto-2`, `foto-3` (Titelbilder),
`vorher` und `nachher` (dasselbe Dach). Größe und Format sind egal, das System verkleinert sie.
Der neue Ordner ersetzt den alten komplett. Es geht nichts verloren: Abgehakt wird in der Zentrale.

## C · Seiten auf Netlify

1. **app.netlify.com/drop** öffnen (eingeloggt) → den Ordner **„8 Seiten für Netlify“** aus dem
   Kundenordner ins Fenster ziehen. Nach ca. 30 Sekunden ist die Seite online.
2. **Namen ändern:** „Site configuration“ (bzw. „Project configuration“) → „Change site name“ (bzw.
   „Change project name“) → das **Kürzel** des Kunden eintragen → Save. Jetzt heißt die Adresse
   `https://<kürzel>.netlify.app`, genau die, die in den Kampagnen steht.
   *Ist der Name vergeben:* anderen nehmen, die volle Adresse im Steckbrief bei „Eigene Adresse der
   Seiten“ eintragen, neu erzeugen lassen, Ordner nochmal hochziehen (Punkt 4).
3. **Formulare einschalten:** links „Forms“ → „Enable form detection“.
4. **Nochmal hochladen**, damit Netlify die Formulare erkennt: „Deploys“ → den Ordner unten in das
   Feld „Drag and drop your site output folder here“ ziehen.
5. **Mit der Zentrale verbinden:** „Site configuration“ → „Notifications“ → „Form submission
   notifications“ → „Add notification“ → **„Outgoing webhook“**:
   - Event: „New form submission“
   - URL: die **„Webhook-Adresse für Netlify“** aus der Zentrale, Blatt „Einstellungen“. Sie endet auf
     **`?key=…`**. Nicht die „Web-App-Adresse“ darüber nehmen: Ohne Schlüssel lehnt die Zentrale jede
     Anfrage still ab.
   - Wichtig: im Abschnitt **„Form submission notifications“** und dort **„Outgoing webhook“** wählen
     (nicht „Email notification“, nicht „Deploy notifications“)
   - Form: „Any form“ → Save
6. **Sicherheitskopie an dich:** dort nochmal „Add notification“ → **„Email notification“** → deine
   E-Mail → Save. (Falls je etwas hakt, hast du jede Anfrage trotzdem.)

**Kosten:** Netlify kostenlos hat 300 Credits im Monat. Jedes Hochladen kostet 15, Besucher kosten
Datenvolumen (die Seiten sind klein). Das reicht für etwa 3–4 Kunden. Danach Tarif „Personal“
(ca. 9 $ im Monat). Deshalb: nur hochladen, wenn sich etwas geändert hat.

## D · Meta-Kampagne

Werbeanzeigenmanager des Kunden → alles genau wie in **„7 Kampagnen“** → Bilder aus
**„9 Anzeigen-Bilder“** → **pausiert** speichern. Allgemeine Klick-Hilfe: „Meta-Anzeige einrichten“.

## E · Google-Kampagne

Google Ads des Kunden (über dein Verwaltungskonto) → Einstellungen aus **„7 Kampagnen“** →
**pausiert** speichern.

## Danach: Schritt 7 (Testen)

Jede Seite am Handy öffnen, Formular mit dem Namen „TEST“ abschicken. Es muss passieren:
1. Danke-Seite erscheint.
2. Der Kunde bekommt die Anfrage-Mail mit den Knöpfen (frag ihn, ob sie da ist; sonst Spam-Ordner).
3. In der Zentrale steht eine Zeile im Blatt „Anfragen“.
4. Du bekommst die Sicherheitskopie von Netlify.

Danach die TEST-Zeilen in der Zentrale löschen.
