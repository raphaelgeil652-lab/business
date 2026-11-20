# Technische Machbarkeit: eine Netlify-Seite für alle Studios + Apps Script als Backend (Stand Nov. 2026)

**Hinweis zur Methode:** In dieser Sitzung waren developers.google.com, developers.google.cn, support.google.com, docs.netlify.com und justin.poehnelt.com **nicht abrufbar** (Netzwerk-Sperre der Sitzung). Die Belege stammen daher überwiegend aus Suchergebnis-Auszügen (Snippets) dieser Seiten und aus Foren. Punkte, die nur auf meinem Vorwissen (Stand bis Mitte 2026) beruhen und hier nicht frisch belegt werden konnten, sind mit **[Vorwissen, nicht verifiziert]** markiert. Für eine Entscheidung sollten die markierten Punkte per Test auf dem echten Konto geprüft werden (Test-Ideen stehen jeweils dabei).

## 1. Prüfen Meta-Anzeigenprüfung, Google-Ads-Zielseitenprüfung und Googlebot eine clientseitig gerenderte Seite, die ihren Inhalt von script.google.com holt? Risiken und Gegenmittel

### Takeaway
Googlebot (Suche) rendert JavaScript und indexiert per API nachgeladene Inhalte, aber verzögert. Für die **Anzeigen-Prüfer (AdsBot, Meta-Review, facebookexternalhit für Link-Vorschauen) gibt es keine Zusage, dass sie JS ausführen und auf eine zweite Quelle warten**; eine leere Hülle beim ersten HTML-Abruf ist das größte vermeidbare Ablehnungsrisiko („Destination not working/not crawlable", „non-functional landing page"). Sicherster Weg: **pro Studio eine statisch vorgerenderte HTML-Datei** (Name, Adresse, Leistungen, Preise, Impressum-Link im ersten HTML), JS nur für die Terminbuchung.

### Cited Findings
- Google hat eigene Ablehnungsgründe „Destination not crawlable" und „Destination not working" in der Ads-Richtlinie; Prüfung über den AdsBot-Crawler, den man in Chrome DevTools per User-Agent nachstellen kann — [Google Ads: Destination not crawlable](https://support.google.com/adspolicy/answer/16428929); [Destination not working](https://support.google.com/adspolicy/answer/16428019); [Destination requirements](https://support.google.com/adspolicy/answer/6368661) (nur Snippets gelesen, Seiten nicht abrufbar)
- Anbieterquelle (kommerzielles Interesse: verkauft Prerendering): Google Ads prüft Zielseiten mit einem Crawler, der JavaScript nicht zuverlässig ausführt — [Prerender.io: fix disapproved Google Ads](https://prerender.io/blog/how-to-fix-disapproved-google-ads/)
- Meta verlangt, dass die Zielseite für die Zielgruppe funktioniert/erreichbar ist („non-functional landing page"); und verbietet alles, was die Prüfung umgeht („circumventing systems") — [Meta: Non-functional landing page](https://transparency.meta.com/policies/ad-standards/product-format-specific-policies/non-functional-landing-page/); [Meta: Circumventing systems](https://transparency.meta.com/en-gb/policies/ad-standards/deceptive-content/circumventing-systems). Keine Meta-Quelle gefunden, die beschreibt, ob der Prüf-Crawler JS ausführt.
- Googlebot (Suche) hat in einer Vercel-Studie alle per API asynchron geladenen Inhalte indexiert; Rendering läuft aber verzögert — [Vercel: How Google handles JavaScript](https://vercel.com/blog/how-google-handles-javascript-throughout-the-indexing-process)
- Google nennt „Dynamic Rendering" (Bots bekommen serverseitig gerenderte Fassung) ausdrücklich nur einen Workaround, nicht empfohlen; empfohlen sind SSR/Prerendering. Dynamic Rendering gilt nicht als Cloaking, solange der Inhalt gleich ist — [Google Search Central: Dynamic rendering as a workaround](https://developers.google.com/search/docs/crawling-indexing/javascript/dynamic-rendering)
- Bei SPAs empfiehlt Google für nicht existierende Einträge (API sagt „gibt es nicht") Weiterleitung auf echte 404 oder `noindex`, sonst „soft 404" — [Google Search Central: Fix Search-related JavaScript problems](https://developers.google.com/search/docs/guides/fix-search-javascript)
- Shell-Seiten mit JS-Inhalt landen laut SEO-Kommentar oft in „Gecrawlt – zurzeit nicht indexiert" — [dev.to: JavaScript SEO in 2026](https://dev.to/garvit_sharda/javascript-seo-in-2026-the-two-waves-of-indexing-myth-and-what-googlebot-actually-keeps-20lm) (Einzelmeinung)

### Inferences
- `/* /index.html 200` liefert für **jeden** Pfad Status 200 — auch für Tippfehler-Pfade. Ohne eigene 404-Logik entstehen „soft 404"; für Ads unkritisch, für Suche unschön.
- Doppelte Abhängigkeit: Fällt Apps Script aus, ist langsam oder liefert einen Fehler (HTML statt JSON), sieht der Prüfer/Besucher eine leere Seite → Ablehnung „non-functional" bzw. verbranntes Budget. Diese Abhängigkeit trifft **alle Studios gleichzeitig**.
- Link-Vorschau-Crawler (facebookexternalhit, WhatsApp) führen nach allgemeinem Kenntnisstand **kein JS aus** → Titel/Bild/Beschreibung pro Studio müssen im statischen HTML stehen (OG-Tags), sonst zeigt jede geteilte Studio-Seite dieselbe generische Vorschau **[Vorwissen, nicht verifiziert]**.
- Empfohlene Gegenmittel, in Reihenfolge der Wirkung:
  1. **Statisch vorrendern pro Studio**: ein Skript (lokal oder Apps Script → Netlify-Deploy) schreibt `/katecosmetics/index.html` mit allen Texten, Preisen, OG-Tags, Impressum/Datenschutz-Links fest hinein. Netlify liefert existierende Dateien vor der Rewrite-Regel aus (Shadowing) **[Vorwissen, nicht verifiziert]**. Die Config-JSON kann zusätzlich als statische Datei `/katecosmetics/config.json` mit ausgeliefert werden → Apps Script nur noch für freie Zeiten und Buchung.
  2. Wenn doch dynamisch: `<noscript>` und ein Grund-Inhalt im HTML (Studio-Name, Leistung, Kontakt) statt leerer Hülle; Ladezustand mit Fallback-Text bei Fehler.
  3. Vor jedem Kampagnenstart: Seite mit AdsBot-User-Agent in DevTools und `curl` (ohne JS) prüfen.

### Gaps
- Kein offizielles Dokument (Meta oder Google Ads) gefunden, das klar sagt, ob/wie lange deren Prüf-Crawler JS ausführen und auf Fremd-APIs warten. Belastbar nur durch eigenen Test (Testanzeige mit kleinem Budget).

## 2. Latenz von Apps Script doGet (kalt/warm), CacheService; ist fetch() cross-origin zu Apps Script 2025/2026 zuverlässig, auch Safari iOS?

### Takeaway
Funktioniert grundsätzlich (GET ohne eigene Header = „simple request", kein Preflight; Antwort kommt über 302-Umleitung von script.googleusercontent.com). Latenz ist spürbar und schwankt: Community-Werte ~0,4–1,5 s warm, Kaltstart länger (keine offizielle Zahl). Für eine Landingpage, auf der jeder Klick Geld kostet, ist ein **synchroner Apps-Script-Abruf vor dem ersten Rendern zu langsam und zu fragil** — Config statisch ausliefern, Apps Script nur für freie Zeiten/Buchung.

### Cited Findings
- Apps Script liefert Ausgaben des Content Service über eine Einmal-URL auf script.googleusercontent.com aus (Umleitung); Web-Apps antworten auf POST immer mit 302 — [Google Groups: 302 Redirect Blues](https://groups.google.com/g/google-apps-script-community/c/WALz_3rw7u4); [Google Groups: New Web app deploy broke CORS](https://groups.google.com/g/google-apps-script-community/c/9Jzey4IicMY)
- Ein Entwickler (Reddit, April 2025): POST funktioniert in Desktop-Chrome und Safari, scheitert aber in mobilem Chrome mit CORS-Fehler; Umgehung: `Content-Type: text/plain;charset=utf-8`, um Preflight zu vermeiden — [r/GoogleAppsScript, 18.04.2025](https://redlib.hbubli.cc/r/GoogleAppsScript/comments/1k1yqfm/google_apps_script_web_app_post_request_works_on)
- Web-App muss mit „Zugriff: Jeder (auch anonym)" bereitgestellt sein — [DEV: Google Apps Script as CORS proxy](https://dev.to/missinqlink/fixing-cors-issues-using-google-apps-script-as-a-lightweight-proxy-n04); Muster `ContentService.createTextOutput(JSON.stringify(...))` mit JSON-MIME-Typ — [Google: Content Service](https://developers.google.com/apps-script/guides/content); Client-Beispiel `fetch(url).then(r=>r.json())` — [tanaikech Gist](https://gist.github.com/tanaikech/a72aab0242012362c46ec69031c720d5)
- Kaltstart: Skripte, die länger nicht liefen, werden erst von der Platte geladen; Apps-Script-Server halten nicht alle Skripte im Speicher — [Google Groups: Why does the first response take more time](https://groups.google.com/g/google-apps-script-community/c/jjzUGGlMoAg)
- Gemessene Werte (Community): ~400–1.500 ms pro `google.script.run`-Aufruf; Antwortzeiten „sehr unregelmäßig", mal 400, mal 1.000 ms — [Google Groups: google.script.run Lag?](https://groups.google.com/g/google-apps-script-community/c/M0UHwkNKYUE); [Google Groups: Webhook latency](https://groups.google.com/g/google-apps-script-community/c/aA44ECydiRA)
- Bibliotheken verlängern den Start leicht — [Google: Apps Script Best Practices](https://developers.google.com/apps-script/guides/support/best-practices)
- CacheService ~15–20 ms pro Lese-/Schreibvorgang vs. ~150–200 ms PropertiesService (Einzel-Benchmark eines Google-Mitarbeiters) — [Poehnelt: Storage Wars](https://justin.poehnelt.com/posts/apps-script-key-value-stores/)
- Gleichzeitige Ausführungen: 30 pro Nutzer, 1.000 pro Skript — [Google: Apps Script Quotas](https://developers.google.com/apps-script/guides/services/quotas) (Snippet)

### Inferences
- „Execute as me": **alle Abrufe aller Studios laufen auf dem Kontingent eines Google-Kontos** → bei 30 gleichzeitigen Ausführungen pro Nutzer kann ein Anzeigen-Peak (viele Klicks gleichzeitig, mehrere Studios) zu „Service invoked too many times"-Fehlern führen. Mit CacheService wird die Ausführung kürzer, aber jede Anfrage bleibt eine Ausführung.
- Wirft `doGet` einen Fehler, liefert Google eine HTML-Fehlerseite ohne CORS-Freigabe → im Browser erscheint das als CORS-/Netzwerkfehler, nicht als lesbare Meldung. Seite braucht Timeout + Fallback **[Vorwissen, nicht verifiziert]**.
- GET ohne eigene Header (kein `Content-Type: application/json`, kein Authorization) folgt der 302 und funktioniert nach verbreiteter Erfahrung in allen aktuellen Browsern inkl. Safari iOS; Probleme entstehen fast immer durch Preflight (POST mit JSON-Header). Für Buchungen per POST: `text/plain` senden **[Vorwissen; Reddit-Bericht oben stützt es]**. Kein Safari-spezifischer Fehler mit script.googleusercontent.com gefunden.
- Mit mehreren angemeldeten Google-Konten kann eine `/u/1/`-URL entstehen; bei „Jeder, auch anonym" sollte das keine Rolle spielen **[Vorwissen, nicht verifiziert]**.

### Gaps
- Keine offizielle Kaltstart-Zahl. Test: 20 Aufrufe nach 1 h Pause und 20 warme Aufrufe messen, auf iPhone (Safari) und Android (Chrome), im Mobilfunknetz.

## 3. Welches Drive-Bild-URL-Format funktioniert 2025/2026, Grenzen, Zuverlässigkeit

### Takeaway
`uc?export=view` ist seit Anfang 2024 für Einbettungen kaputt. Aktuell in der Community empfohlen: `https://lh3.googleusercontent.com/d/FILE_ID=w1600` (zuletzt empfohlen Feb. 2026) und als Ausweich `drive.google.com/thumbnail?id=FILE_ID&sz=w1600`. **Beides ist von Google nicht offiziell unterstützt** und kann jederzeit brechen. Für Werbe-Zielseiten (Ladezeit, Zuverlässigkeit) besser: Fotos beim Anlegen einmal aus Drive holen und als Dateien mit auf Netlify ausliefern.

### Cited Findings
- Bild-Einbettungen aus Drive liefern 403; das Muster war nie offiziell unterstützt, gilt auch für lh3- und Thumbnail-Links — [Poehnelt: Google Drive embed images 403](https://justin.poehnelt.com/posts/google-drive-embed-images-403/); [DEV: Embed images from Google Drive](https://dev.to/googleworkspace/embed-images-from-google-drive-in-your-website-11k6) (Snippets)
- Bruch der alten Einbettungen um Januar 2024 dokumentiert — [PiunikaWeb, 23.01.2024 (Update 31.01.2024)](https://piunikaweb.com/2024/01/23/this-hack-might-save-your-broken-google-drive-embeds/)
- Februar 2026: Apps-Script-Community empfiehlt das lh3-Format, weil die alte Methode nicht mehr unterstützt wird — [Google Groups: Direct access to Google Drive file from HTML](https://groups.google.com/g/google-apps-script-community/c/84nBhhce8LY)
- `drive.google.com/thumbnail?id=…` funktioniert laut Nutzern; lh3 mit Größensuffix `=s256`/`=w256` als „neueres Format" — [MIT App Inventor Community](https://community.appinventor.mit.edu/t/url-local-image-for-fancygallery/106840?page=2)
- Datei/Ordner muss „Jeder mit dem Link: Betrachter" sein; Links mit `resourcekey` brauchen diesen Parameter auch in der Bild-URL — [Obsidian Forum](https://forum.obsidian.md/t/images-from-google-drive-not-loading/86444); [Drive image link generator](https://sites.google.com/view/drive-tools/google-drive-image-link-generator)
- Einzelne Nutzer melden, dass früher funktionierende Methoden aufgehört haben (z. B. Power BI) — [Microsoft Fabric Community](https://community.fabric.microsoft.com/t5/Service/Image-Url-from-google-Drive-cannot-visualize/m-p/3639032)

### Inferences
- Drive ist kein CDN: Bei vielen Abrufen derselben Datei kann Google drosseln (429/„zu viele Zugriffe") **[Vorwissen, nicht verifiziert]**. Für Anzeigen-Traffic ein Risiko.
- Sicherer Weg: Apps Script lädt beim Anlegen/Ändern die Fotos (verkleinert) und schreibt sie in den Netlify-Deploy (oder der Nutzer zieht sie per Skript) — dann gleiche Domain, keine CORS-Frage, kein Freigabe-Risiko. Alternative: Netlify-Proxy-Rewrite `/bild/* → https://lh3.googleusercontent.com/d/:splat 200` macht Bilder same-origin (kostet Netlify-Bandbreite, bleibt aber von der inoffiziellen URL abhängig) **[Vorwissen, nicht verifiziert]**.
- Datenschutz: Jeder Bildabruf von googleusercontent überträgt die IP der Besucherin an Google → in der Datenschutzerklärung nennen (passt zur Repo-Regel „keine Google-Fonts-Aufrufe").

### Gaps
- Kein offizielles Google-Statement 2025/2026 zu lh3-Links gefunden. Ob lh3 einen `Access-Control-Allow-Origin`-Header sendet, ist nicht belegt (siehe Frage 6).

## 4. Apps Script HTML→PDF, E-Mail-Anhänge, DriveApp.setSharing, Kontingente privat vs. Workspace

### Takeaway
Das größte harte Limit ist **E-Mail: 100 Empfänger/Tag im kostenlosen Konto** (Workspace 1.500) — mit automatischen PDF-Mails an Studios und Kundinnen ist das bei einigen Studios schnell erreicht. HTML→PDF funktioniert, aber mit altem, undokumentiertem CSS-Umfang (Flexbox/Grid unsicher, Bilder besser als base64 einbetten). `setSharing(ANYONE_WITH_LINK)` funktioniert auf privaten Konten (Admin-Sperre nur in Workspace möglich).

### Cited Findings
- E-Mail-Empfänger: 100/Tag (privat, gmail.com) vs. 1.500/Tag (Workspace), pro Nutzer, Rücksetzung 24 h nach erster Anfrage; URL Fetch 20.000/Tag privat vs. 100.000/Tag Workspace; gleichzeitige Ausführungen 30/Nutzer, 1.000/Skript — [Google: Apps Script Quotas](https://developers.google.com/apps-script/guides/services/quotas) (Snippet über Suche; Seite selbst nicht abrufbar)
- Anhänge über Apps Script: Grenze von 5 MB auf 25 MB pro Nachricht angehoben — [Labnol: Bigger attachments](https://labnol.org/internet/bigger-attachments-with-mail-merge/21186); Gmail: alle Anhänge zusammen max. 25 MB — [Gmail Hilfe: Anhänge](https://support.google.com/mail/answer/6584?hl=en); Bericht über verlorene Anhänge ab 25 MB in Apps Script — [r/GoogleAppsScript, März 2025](https://redlib.hackliberty.org/r/GoogleAppsScript/comments/1jhmfb2/is_there_a_way_to_handle_25mb_and_up_attachments)
- HTML→PDF: Google veröffentlicht keine CSS-Unterstützungstabelle für `getAs('application/pdf')`; CSS-Treue muss getestet werden; bewährter Umweg: Google-Docs-Vorlage füllen und als PDF exportieren — [Labnol: Convert HTML to PDF](https://labnol.org/code/19960-convert-html-to-pdf); [Stack Overflow (Archiv): CSS is lost when converting HTML to PDF](https://kiwix.lema.org/stackoverflow.com_en_all_2023-11/questions/49990859/css-is-lost-when-converting-html-to-pdf-in-google-apps-script); [Google Issue Tracker 196100674](https://issuetracker.google.com/issues/196100674?pli=1); Bericht über beschädigte PDFs — [Google Groups: PDF files corrupted](https://groups.google.com/g/google-apps-script-community/c/OXW_ONOXc14)
- `Access`-Enum: Admins einer Workspace-Domain können „Jeder"/„Jeder mit Link" verbieten, dann wirft `setSharing` eine Ausnahme — [Google: Enum Access](https://developers.google.com/apps-script/reference/drive/access); Admin-Einstellung — [Workspace: Restrict the access users can give to files](https://knowledge.workspace.google.com/admin/drive/restrict-the-access-users-can-give-to-files); Freigabe einer Datei kann nicht weiter sein als die des Elternordners (Bericht) — [Google Developer forums](https://discuss.google.dev/t/weird-drive-sharing-permissions-limitations-cant-share-with-link-when-parent-folder-is-shared-within-org/284361)
- **Achtung Widerspruch:** Eine KI-Zusammenfassung der Suche behauptete, `ANYONE_WITH_LINK` sei nur für Workspace verfügbar. Nach meinem Kenntnisstand gilt die Workspace-Einschränkung in der Doku für `DOMAIN`/`DOMAIN_WITH_LINK`, nicht für `ANYONE_WITH_LINK` **[Vorwissen; Seite nicht abrufbar, per 1-Zeilen-Test prüfen]**.

### Inferences / weitere Kontingente **[Vorwissen, nicht verifiziert — Werte vor Entscheidung in der Quota-Tabelle prüfen]**
- Laufzeit pro Ausführung 6 Min.; Trigger-Gesamtlaufzeit ca. 90 Min./Tag (privat) vs. 6 h (Workspace); 20 Trigger pro Nutzer und Skript; Dokumente erstellen ca. 250/Tag privat vs. 1.500 Workspace; max. 250 Anhänge pro Mail; Mail-Text ca. 200 kB (privat) / 400 kB (Workspace).
- Für das bestehende Beauty-System gilt laut CLAUDE.md schon: ~100 Mails/Tag ≈ 20 Buchungen → **jede zusätzliche automatische PDF-Mail (Angebot, Vertrag, Vorbereitung) frisst dasselbe Kontingent**. Ab 4–5 Studios Workspace (wie bereits geplant) — dort verdoppelt sich nicht nur Mail, sondern auch URL-Fetch und Trigger-Laufzeit.
- PDF-Praxis: Bilder als `data:`-URI einbetten (externe URLs werden vom Konverter oft nicht geladen), Layout mit Tabellen/Blöcken statt Flexbox/Grid, Schriften nicht verlassen (Standard-Fonts). Wenn Optik wichtig (Angebot/Vertrag): Google-Docs-Vorlage + `replaceText` + PDF-Export ist robuster.
- Rechtlich: Automatischer Versand von Dokumenten mit Gesundheitsbezug (Behandlung) per Mail → Art.-9-Daten; nur Minimum in Anhänge.

### Gaps
- Offizielle Werte für Trigger-Laufzeit, Dokument-Erstellung, Anhang-Anzahl konnten nicht abgerufen werden (developers.google.com gesperrt).

## 5. Netlify: SPA-Weiterleitung, Credits für eine kleine Seite, eigene Domain

### Takeaway
`/* /index.html 200` ist das Standardmuster und funktioniert. Kostenlos: 300 Credits/Monat, **jeder Produktions-Deploy kostet 15 Credits** (also max. ~20 Deploys/Monat, ohne Traffic) — bei einer Seite für alle Studios, die bei jeder Studio-Änderung neu deployt wird, wird das schnell knapp; bei Überschreitung wird das Projekt **bis zum nächsten Monat pausiert** (= alle Studio-Seiten offline). Personal 9 $/Monat, 1.000 Credits. Eigene Domain dringend empfohlen (siehe Frage 7).

### Cited Findings
- Credit-Modell seit 05.09.2025: Free 300 Credits, Personal 9 $/Monat mit 1.000 Credits — [Netlify Changelog: credit-based plans](https://www.netlify.com/changelog/netlify-pricing-update-introducing-credit-based-plans/); [Netlify Pricing](https://netlify.com/pricing)
- Produktions-Deploy = 15 Credits; Formular-Einsendungen kostenlos und unbegrenzt; Bandbreite, Web-Requests und Compute verbrauchen ebenfalls Credits; bei erreichtem Limit pausieren Projekte bis zum nächsten Abrechnungszyklus — [Netlify Docs: How credits work](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/how-credits-work/); [Netlify Docs: Credit-based pricing plans](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/credit-based-pricing-plans/) (Snippets)
- Netlify selbst empfiehlt bei Ads-Problemen eine eigene Domain statt `*.netlify.app`, weil der geteilte Domain-Ruf unter Spam-Seiten leidet — [Netlify Forum: Google Ads Problem with Netlify Domain](https://answers.netlify.com/t/google-ads-problem-with-netlify-domain/15711)
- Repo-eigene Erfahrung (CLAUDE.md): 300 Credits waren schon nach zwei Testkunden leer.

### Inferences
- Credit-Sätze pro GB Bandbreite und pro 10.000 Requests konnten nicht abgerufen werden; nach Vorwissen ca. 10 Credits/GB und 3 Credits/10k Requests **[Vorwissen, nicht verifiziert]**. Bei Fotos 1.600 px (~300 kB) × ein paar Bilder × tausende Klicks ist Bandbreite relevant.
- **Ein Vorteil der Ein-Seiten-Architektur:** Wenn Inhalte zur Laufzeit aus Apps Script kommen, braucht eine Studio-Änderung keinen Deploy (spart 15 Credits). Prerendering (Frage 1) braucht dagegen einen Deploy pro Änderung → Änderungen bündeln.
- Eigene Domain + automatisches HTTPS ist auf allen Netlify-Tarifen inkl. Free möglich **[Vorwissen, nicht verifiziert]**; Kosten nur für die Domain selbst (~1 €/Monat).
- Netlify-Rewrites können auch auf externe URLs proxyen (z. B. Apps Script oder lh3) → same-origin, löst CORS/Canvas-Probleme; aber eine Proxy-Rewrite auf Apps Script folgt der 302 nicht zwingend serverseitig — testen **[Vorwissen, nicht verifiziert]**.

### Gaps
- Exakte Credit-Sätze für Bandbreite/Requests; ob Rewrites/Proxy-Requests extra kosten.

## 6. html-to-image / html2canvas mit Web-Fonts und Drive-Bildern (Canvas-Tainting/CORS)

### Takeaway
Der PNG-Export scheitert, sobald ein fremdes Bild ohne CORS-Freigabe in die Canvas gezeichnet wird („tainted canvas" → `toDataURL`/`toBlob` wirft). Ob lh3.googleusercontent.com den nötigen `Access-Control-Allow-Origin`-Header sendet, ist **nicht belegt**; Drive-Share-Links tun es nachweislich nicht. Sicher ist nur: Bilder **same-origin** (auf Netlify) oder als **data-URI** (Apps Script liefert base64) — und Schriften selbst hosten.

### Cited Findings
- Sobald eine Canvas fremde Bilddaten ohne CORS-Freigabe enthält, ist sie „tainted"; Auslesen wirft eine Ausnahme. Lösung: `crossOrigin="anonymous"` + Server sendet `Access-Control-Allow-Origin` — [MDN: Use cross-origin images in a canvas](https://developer.mozilla.org/en-US/docs/CORS_Enabled_Image)
- `allowTaint: true` (html2canvas) macht die Canvas nicht exportierbar; `toBlob` statt `toDataURL` hilft nicht; Alternative: vertrauenswürdiger same-origin-Proxy — [PositionIsEverything: cross-origin image errors in html2canvas](https://www.positioniseverything.net/how-to-fix-cross-origin-image-errors-in-html2canvas/); [html2canvas Issue #1614](https://www.github.com/niklasvh/html2canvas/issues/1614); [html2canvas Issue #592](https://www.github.com/niklasvh/html2canvas/issues/592)
- Drive-Share-Link als Bildquelle: von CORS blockiert, „No 'Access-Control-Allow-Origin' header", Antwort ist text/html — [GitHub PAIR-code/facets Issue #231](https://www.github.com/PAIR-code/facets/issues/231)
- dom-to-image(-more) sucht alle `@font-face` und bettet Schriften ein; vor dem Rendern `document.fonts.ready` abwarten — [dom-to-image-more README](https://unpkg.com/dom-to-image-more@3.10.2/README.md)

### Inferences **[Vorwissen, nicht verifiziert]**
- html-to-image (SVG-foreignObject) hat bekannte Safari-Eigenheit: Bilder/Schriften fehlen beim ersten Aufruf, Workaround = `toPng` zweimal aufrufen bzw. vorher alle Bilder dekodieren. html2canvas bildet CSS nach und kann moderne Eigenschaften (z. B. `object-fit`, manche Filter) falsch darstellen.
- Fremde Stylesheets (Google Fonts) führen in html-to-image zu `SecurityError` beim Lesen von `cssRules` → Schriften selbst hosten (Repo-Standard ist das schon).
- Praktisch: Für die Anzeigen-Seite die Fotos über Apps Script als base64 holen (`DriveApp.getFileById(id).getBlob()` → `Utilities.base64Encode`) oder same-origin auf Netlify ablegen. Größe beachten: 1080×1350-Export braucht `pixelRatio` passend (Canvas-Größe), iOS-Safari hat Canvas-Flächenlimits.
- Alternative, die das Problem ganz vermeidet: Anzeigen-PNGs wie bisher serverseitig/lokal rendern (`creatives-rendern` existiert im Repo).

### Gaps
- Header-Verhalten von lh3.googleusercontent.com: Test mit `curl -I -H "Origin: https://example.com" "https://lh3.googleusercontent.com/d/<ID>=w1600"` nötig (in dieser Sitzung kein Zugriff).
- html-to-image-Issues auf GitHub konnten nicht direkt gelesen werden.

## 7. Meta-Pixel / Google-Tag auf EINER geteilten Domain für viele Studios mit verschiedenen Pixel-IDs: Domain-Verifizierung, AEM, geteilte Domain vs. Subdomain

### Takeaway
Technisch gehen mehrere Pixel-IDs auf einer Domain (Pixel pro Pfad dynamisch laden). Domain-Verifizierung ist seit 2023 für Event-Konfiguration nicht mehr Pflicht, und das 8-Event-Limit/AEM-Tab ist 2025 entfallen (dünn belegt). **Das eigentliche Risiko ist der geteilte Ruf:** Eine Domain (oder `*.netlify.app`), die Meta/Google wegen eines Studios als problematisch einstuft, trifft **alle** Studios. Gerade Beauty/Gesundheit ist sensibel. Empfehlung: eigene Domain der Agentur, **pro Studio eine Subdomain** (`kate.termine-clickculture.de`) — oder idealerweise eine Subdomain/Domain des Studios.

### Cited Findings
- Meta hat 2023 die Pflicht zur Domain-Verifizierung für die Event-Konfiguration aufgehoben; Verifizierung bleibt für Link-Bearbeitungsrechte empfohlen; eine einzelne Conversion-Domain muss beim Anlegen nicht mehr gewählt werden; AEM existiert weiter — [Adviso: Evolution of AEM (04.07.2023)](https://www.adviso.ca/en/blog/guides-en/evolution-aggregated-measurement-meta); [Jon Loomer: Big changes to website conversion campaigns](https://www.jonloomer.com/meta-announces-big-changes-to-website-conversion-campaigns/); [Jon Loomer: AEM isn't going away](https://pubcast.jonloomer.com/videos/metas-aggregated-event-measurement-isnt-going-away/)
- Juni 2025: 8-Event-Limit und Priorisierung entfallen, AEM-Tab aus dem Events Manager entfernt (nur eine Quelle, Zeitpunkt unsicher) — [Conversios](https://www.conversios.io/ga/blog/tomhas-imeachta-comhioml%C3%A1naithe-meitea); [Jon Loomer: AEM tab is gone](https://pubcast.jonloomer.com/videos/the-aggregated-event-measurement-tab-is-gone/); [DEPT: Removal of AEM](https://www.deptagency.com/en-dk/insight/metas-removal-of-aggregated-event-measurement-aem-and-its-implications-for-advertisers/)
- Geteilter Domain-Ruf: Google Ads beanstandete eine `netlify.app`-Subdomain wegen fremder Inhalte; Netlify rät zu eigener Domain — [Netlify Forum](https://answers.netlify.com/t/google-ads-problem-with-netlify-domain/15711); Meta stufte eine von vielen Nutzern geteilte Standard-Domain als verdächtig ein, Lösung: andere Domain — [Chariow Help](https://help.chariow.com/en/articles/179-how-to-resolve-issues-with-sharing-chariow-links-on-meta-facebook); Domain-/Pixel-Sperren prüft man im Events Manager → Diagnose bzw. Account Quality — [Shopify Community](https://community.shopify.com/t/crazy-high-cpms-on-meta-how-to-check-if-our-domain-is-flagged/347759); Anzeigen werden jederzeit neu geprüft — [Meta Advertising Standards](https://transparency.meta.com/policies/ad-standards/)

### Inferences **[Vorwissen, nicht verifiziert — wichtig, vor Entscheidung prüfen]**
- **`netlify.app` steht auf der Public Suffix List** → eine fremde Plattform-Domain, die man nicht in Meta verifizieren kann (DNS-TXT/Meta-Tag auf Root nicht möglich; Meta-Tag-Methode auf der Subdomain evtl. ja). Mit eigener Domain entfällt das.
- **Meta Health & Wellness:** Meta stuft Domains/Datensätze mit Gesundheitsbezug ein und schränkt dann untere Funnel-Events/Optimierung ein (seit 2025 ausgeweitet). Eine Einstufung hängt an Domain/Pixel → auf einer geteilten Domain würde eine Einstufung (z. B. durch Faltenbehandlung-/Laser-Seiten) auch Studios mit harmloseren Angeboten treffen. Subdomain pro Studio begrenzt das teilweise; ob Meta auf Root-Domain-Ebene einstuft, ist unklar.
- **Google Ads „Unfair advantage"/Ein-Anzeige-pro-Domain:** Google zeigt in einer Auktion normalerweise nicht mehrere Anzeigen mit derselben Anzeige-Domain. Zwei Studios derselben Stadt mit derselben Behandlung auf derselben Domain würden sich gegenseitig verdrängen; außerdem zeigt die Anzeige die Agentur-Domain statt des Studios (Vertrauen, „Misrepresentation"-Risiko, wenn Absender unklar). Eigene Subdomain hilft bei der Anzeige-Domain nur bedingt (Google wertet teils die Root-Domain) → **pro Studio eigene Domain** ist der saubere Weg, wenn zwei Studios im selben Gebiet laufen.
- Cookies: `_fbp`/`_gcl` werden auf die Domain gesetzt; alle Pfade teilen sie → eine Besucherin, die zwei Studio-Seiten besucht, trägt dieselbe Kennung; Pixel mehrerer Studios auf einer Origin sind datenschutzrechtlich heikel (Einwilligung muss pro Studio/Verantwortlichem gelten). Pixel nur für den eigenen Pfad und nur nach Zustimmung laden (wie PV-Seiten).
- Einwilligung pro Studio: Der Verantwortliche in Impressum/Datenschutz ist das Studio; die Domain gehört der Agentur → Auftragsverarbeitung/Rollen klar dokumentieren.

### Gaps
- Kein offizielles Meta-Dokument zu mehreren Werbetreibenden auf einer Domain gefunden; Google-Ads-Policy-Seiten („Unfair advantage", „Destination mismatch") nicht abrufbar. Health-&-Wellness-Einstufung in der EU 2026 nicht frisch belegt.
- Empfehlung für Klärung: Meta Business Help „Domain verification" und Google Ads Policy „Unfair advantage" direkt lesen, sobald support.google.com/facebook.com erreichbar sind.
