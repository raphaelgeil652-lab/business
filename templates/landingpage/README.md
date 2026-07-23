# Landingpage-Vorlage (Küche & Bad) — MVP

Einfache, mobil-optimierte Werbe-Landingpages. **Formular → E-Mail** über **Netlify Forms**
(kein GoHighLevel, kein Backend, keine laufenden Kosten). Slop-geprüft (impeccable: 0 Anti-Patterns).

| Datei | Zweck |
|---|---|
| `index.html` | Küche — „Kostenlose 3D-Planung" |
| `bad.html` | Bad — „Kostenlose Vor-Ort-Beratung" |
| `danke.html` | Danke-Seite nach dem Absenden (feuert Meta-Pixel „Lead") |

## Pro Klient anpassen (im Code mit `[ ]` markiert)

- Texte: `[Studioname]`, `[Ort]`, `[Telefon]`, `[Adresse]`.
- Bilder: Hero + Bewertungen durch **echte** Fotos/Google-Bewertungen ersetzen. **Sterne max 4,9**.
- `PIXEL_ID`: Meta-Pixel-ID (optional, kann am Anfang leer bleiben — dann misst der Pixel nichts, alles andere läuft).
- Impressum/Datenschutz: `impressum.html` / `datenschutz.html` anlegen (Pflicht) und verlinken.

## Online stellen mit Netlify (Schritt für Schritt)

> Ausführliche Einsteiger-Anleitung (GitHub-Import + Drag&Drop + Fehlerbehebung): `../../docs/landingpage-hosten.md`

1. Auf **netlify.com** kostenlos anmelden.
2. Diesen Ordner (`index.html`, `bad.html`, `danke.html`) als ZIP oder Ordner auf
   **app.netlify.com/drop** ziehen („Netlify Drop"). Fertig — du bekommst sofort eine Live-URL.
3. In Netlify unter **Forms** siehst du jede Anfrage. Unter **Site settings → Forms → Notifications**
   eine **E-Mail-Benachrichtigung** einrichten → jede Anfrage landet in deinem Postfach.
4. Später: eigene Domain verbinden (z. B. `kueche-[ort].de`).

> Wichtig: Das Formular funktioniert **nur, wenn die Seite bei Netlify liegt** (die Formular-
> Verarbeitung ist eine Netlify-Funktion). Lokal/Doppelklick sendet nichts ab.

## So kommt eine Anfrage bei dir an

Besucher füllt Formular aus → Netlify verarbeitet es → du bekommst eine **E-Mail** + Eintrag im
**Netlify-Dashboard**. `danke.html` wird angezeigt und feuert (falls `PIXEL_ID` gesetzt) das
Meta-Event „Lead". **Speed-to-Lead:** du/der Betrieb ruft die Nummer aus der Mail **sofort** an
(< 5 Min). — Am Anfang bewusst manuell, das reicht für den ersten Kunden.

## Später auf GoHighLevel umstellen (wenn du skalierst)

Ersetze in `index.html`/`bad.html` den `<form>…</form>`-Block durch das GHL-Formular-iframe und
verdrahte Tracking/Automationen nach `../../docs/ghl-n8n-aufbau.md`:

```html
<iframe class="form-frame" id="ghlForm"
        data-src="https://api.leadconnectorhq.com/widget/form/GHL_FORM_ID"
        title="Terminanfrage" style="width:100%;min-height:520px;border:0;border-radius:12px;"></iframe>
<script>
  // event_id + fbclid an das GHL-Formular übergeben (Hidden-Felder im Formular anlegen)
  var EVENT_ID = (crypto.randomUUID ? crypto.randomUUID() : 'ev-'+Date.now());
  var p = new URLSearchParams(location.search);
  var f = document.getElementById('ghlForm');
  f.src = f.dataset.src + '?event_id='+EVENT_ID+'&fbclid='+(p.get('fbclid')||'');
</script>
```

Dann greifen die n8n-Workflows (`../n8n/`) und die CAPI-Dedup-Kette. Das ist die Ausbaustufe,
nicht nötig für den ersten Kunden.
