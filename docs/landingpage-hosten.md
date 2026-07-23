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

1. In Netlify: **Site configuration → Forms → Notifications**.
2. **Add notification → Email notification** → deine E-Mail eintragen.
3. Ab jetzt kommt jede Formular-Anfrage in dein Postfach (und ins Netlify-Dashboard unter **Forms**).

## Kurz testen

1. Deine Live-URL öffnen, das Formular ausfüllen und absenden.
2. Es sollte die **Danke-Seite** erscheinen.
3. Im Netlify-Dashboard unter **Forms** taucht die Anfrage auf (und als Mail, wenn Benachrichtigung aktiv).

## Häufigster Fehler

**Seite ist leer / 404** → meist falsches **Publish directory**. Es muss `templates/landingpage`
sein (nicht der Repo-Wurzelordner) — sonst findet Netlify die `index.html` nicht.

## Wichtig

Das Formular sendet **nur online bei Netlify** (die Verarbeitung ist eine Netlify-Funktion).
Lokal per Doppelklick auf die Datei wird nichts abgeschickt.
