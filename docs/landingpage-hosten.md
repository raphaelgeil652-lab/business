# Landingpage online stellen (Netlify) — Schritt für Schritt

Für Einsteiger. Ziel: eine der Landingpages aus `../templates/landingpage/` ins Netz bringen,
sodass das Formular funktioniert und Anfragen per E-Mail kommen. **Kein Programmieren, kein Build.**

## Weg A — Netlify mit GitHub verbinden (empfohlen)

Die Dateien liegen schon im Repo `business` (Ordner `templates/landingpage`). Du musst nichts
herunterladen.

1. Auf **netlify.com** → **Sign up** → **„Sign up with GitHub"** (damit ist GitHub gleich verbunden).
2. **Add new site** → **Import an existing project** → **Deploy with GitHub**.
3. Zugriff erlauben (es reicht, nur das Repo **`business`** freizugeben), dann **`business`** auswählen.
4. **Wichtigste Einstellung:**
   - **Build command:** leer lassen
   - **Publish directory:** `templates/landingpage`
5. **Deploy** → nach ~30 Sekunden bekommst du eine Live-URL (`zufallsname.netlify.app`).

Bei jedem `git push` nach `main` aktualisiert Netlify die Seite automatisch.

## Weg B — Drag & Drop (ohne GitHub)

1. Die Dateien `index.html`, `bad.html`, `danke.html` in **einen Ordner** auf deinem PC legen.
2. Den **Ordner** (nicht die Einzeldateien) auf **app.netlify.com/drop** ziehen. Fertig, Live-URL erscheint.

## Welche Seite ist wo?

- **Küche:** die Root-URL, z. B. `zufallsname.netlify.app` (das ist `index.html`).
- **Bad:** `zufallsname.netlify.app/bad.html`.
- **Danke-Seite:** erscheint automatisch nach dem Absenden (`danke.html`).

> Pro echtem Kunden nutzt du später nur **eine** Variante (Küchenstudio → Küche, Bad-Betrieb → Bad)
> und machst dafür eine **eigene** Netlify-Seite mit seinem Namen/Fotos statt der `[Platzhalter]`.

## Anfragen per E-Mail bekommen

Netlify **speichert** jede Anfrage, verschickt aber **nur mit aktivierter Benachrichtigung** eine E-Mail.

1. Erst prüfen, dass eine Anfrage angekommen ist: Projekt → **Forms** (erscheint, sobald es eine
   Anfrage gibt) → dort das Formular **„anfrage-kueche"** mit dem Eintrag.
2. **Project configuration → Notifications** → Abschnitt **„Form submission notifications"** →
   **Add notification → Email notification** → deine E-Mail eintragen → **Save**.
   (Je nach Netlify-UI auch unter Forms → Settings erreichbar.)
3. Formular erneut absenden → die Mail kommt in ~1 Minute. **Wichtig: erste Mail landet oft im Spam-/Werbung-Ordner.**

## Kurz testen

1. Deine Live-URL öffnen, das Formular ausfüllen und absenden.
2. Es sollte die **Danke-Seite** erscheinen.
3. Im Netlify-Dashboard unter **Forms** taucht die Anfrage auf (und als Mail, wenn Benachrichtigung aktiv).

## Problem: 404 „Page not found" beim Absenden

Beim Klick auf „Absenden" kommt eine 404 → **Netlify hat das Formular nicht erkannt**
(Formular-Erkennung ist bei neuen Seiten oft standardmäßig aus).

- **Prüf-Trick:** Ruf `deinname.netlify.app/danke.html` direkt auf. Lädt die Danke-Seite, sind
  alle Dateien da → es liegt nur an der Formular-Erkennung.
- **Fix:** In Netlify die **Form detection aktivieren** (Forms bzw. Project configuration → Forms),
  dann **Deploys → Trigger deploy → „Clear cache and deploy site"**, danach erneut testen.
- **Fallback:** Klappt es partout nicht, das Formular auf **Formspree** umstellen (kostenlos,
  mailt automatisch, ohne Netlify-Einstellungen).

## Häufigster Fehler

**Seite ist leer / 404 (schon beim Öffnen)** → meist falsches **Publish directory**. Es muss
`templates/landingpage` sein (nicht der Repo-Wurzelordner) — sonst findet Netlify die `index.html` nicht.

## Wichtig

Das Formular sendet **nur online bei Netlify** (die Verarbeitung ist eine Netlify-Funktion).
Lokal per Doppelklick auf die Datei wird nichts abgeschickt.
