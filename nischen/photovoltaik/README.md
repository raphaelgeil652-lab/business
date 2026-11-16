# Photovoltaik — Probelauf

Agentur-Modell aus dem Betriebshandbuch, angewendet auf PV-Betriebe (Solarteure, die selbst
montieren). Geplant zusammen mit einem Kollegen aus dem PV-Vertrieb.

**Status:** Probelauf mit einem **erfundenen** Kunden („Muster Solartechnik“). Noch kein echter Kunde.
Alles unten funktioniert genauso für den ersten echten PV-Kunden: Kundenordner kopieren, Namen tauschen.

---

## Alles auf einen Blick — in dieser Reihenfolge abarbeiten

**Öffnen** zeigt die Datei oder Seite. **Weiter** sagt, was du damit tust. **Veröffentlichen** sagt,
ob und wie es nach draußen geht. „Intern“ heißt: bleibt bei dir, geht nie an den Kunden.

### A · Grundlagen (einmal lesen)

| # | Was | Öffnen | Weiter | Veröffentlichen |
|---|---|---|---|---|
| 1 | **Betriebshandbuch** — das ganze Modell, nischenneutral | [▶ Öffnen](https://claude.ai/artifact/7DSh95Hfrp17kLRnNLXftN) | Einmal ganz lesen, vor allem „Schnellstart“ und „Onboarding“ | Für den Kollegen: im Doc oben **Teilen** → seine E-Mail eintragen. Ohne Freigabe kann er den Link nicht öffnen. |
| 2 | **PV-Modul** — Ticket, Gratis-Anker, Anzeigen, Keywords, Regeln | [▶ Öffnen](modul-photovoltaik.md) | Mit dem Kollegen durchgehen: Stimmen Preise und Sprache aus seiner Vertriebserfahrung? Änderungen hier eintragen | Intern |

### B · Einmalig für die Agentur (nur du, ca. 1 Stunde)

| # | Was | Öffnen | Weiter | Veröffentlichen |
|---|---|---|---|---|
| 3 | **Meta Business Portfolio** | [▶ business.facebook.com](https://business.facebook.com) | Erstellen → Agenturname + E-Mail → Zwei-Faktor an → **Business-ID** notieren (Einstellungen → Unternehmensinfos). Anleitung: [`meta-konto-einrichten.md`](../../anleitungen/meta-konto-einrichten.md) | – |
| 4 | **Google-Ads-Verwaltungskonto** | [▶ Verwaltungskonto anlegen](https://ads.google.com/home/tools/manager-accounts/) | Anlegen, **Kunden-ID** (xxx-xxx-xxxx) notieren. Darüber lädst du später das Konto des Kunden ein | – |
| 5 | **Netlify** (Hosting der Landingpages) | [▶ app.netlify.com](https://app.netlify.com) | Kostenlos registrieren. Mehr nicht, Hochladen kommt in Schritt 12 | – |

### C · Am Tag der Unterschrift

| # | Was | Öffnen | Weiter | Veröffentlichen |
|---|---|---|---|---|
| 6 | **Steckbrief** — alles aus dem Verkaufsgespräch | [▶ Öffnen](kunden/muster-solartechnik/steckbrief.md) | **Preise entscheiden** (Vorschlag 850 € / 1.500 €/Monat / 1.000 € Budget) und die Frage „Retainer ab erstem Auftrag oder spätestens ab Monat 3“ | Intern, die Rechnung darin nie dem Kunden zeigen |
| 7 | **Vereinbarung** | [▶ Öffnen](kunden/muster-solartechnik/vereinbarung.md) | Alle `[eckigen Klammern]` füllen, Preise aus Schritt 6 übernehmen | Text in Google Docs oder Word einfügen → **als PDF speichern** → vor Ort oder per Mail unterschreiben lassen. Unterschrieben in den Drive-Ordner des Kunden |
| 8 | **Onboarding-Rechnung** | – | 850 € (bzw. dein Preis), Zahlungsziel 14 Tage, ggf. Hinweis §19 UStG | Als PDF per Mail an den Kunden |
| 9 | **Drive-Ordner des Kunden** | [▶ drive.google.com](https://drive.google.com) | Ordner „Muster Solartechnik“ mit Unterordnern Fotos · Videos · Vertrag · Reports. **Freigeben → Bearbeiter** für die Mail des Kunden | Link kommt in die Willkommens-Mail |
| 10 | **Willkommens-Mail** | [▶ Öffnen](kunden/muster-solartechnik/willkommens-mail.md) | `[Link]` = Drive-Ordner, `[Business-ID]` aus Schritt 3, `[E-Mail]` = deine Agentur-Adresse | Text kopieren → aus deinem Postfach an den Kunden senden. **Nach 3 Tagen ohne Material: anrufen** |

### D · Einrichtung (sobald Material und Zugänge da sind)

| # | Was | Öffnen | Weiter | Veröffentlichen |
|---|---|---|---|---|
| 11 | **Landingpage** | [▶ Seite ansehen](https://raw.githack.com/raphaelgeil652-lab/business/main/nischen/photovoltaik/kunden/muster-solartechnik/landingpage/index.html) · [Datei](kunden/muster-solartechnik/landingpage/index.html) | In `index.html` alle `[eckigen Klammern]` füllen. Graue Foto-Kästen: `<div class="ba-todo">…</div>` durch `<img src="fotos/haus1-vorher.jpg" alt="…">` ersetzen, Fotos in einen Ordner `fotos/` daneben legen. Bewertungen nur echte, Schnitt höchstens 4,9 | Siehe Schritt 12 |
| 12 | **Landingpage online stellen** | [▶ app.netlify.com/drop](https://app.netlify.com/drop) | Den ganzen Ordner `landingpage/` (mit `index.html`, `danke.html`, `fotos/`, `impressum.html`, `datenschutz.html` vom Kunden) auf die Seite ziehen. Danach: **Forms → Formular-Erkennung an → neu hochladen**, dann **Notifications → Form submission → E-Mail an Kunde und dich**. Anleitung: [`landingpage-hosten.md`](../../anleitungen/landingpage-hosten.md) | Netlify gibt dir die Adresse (`….netlify.app`). Die kommt in die Anzeigen. Eigene Domain des Kunden später unter Domain settings |
| 13 | **Danke-Seite** | [▶ Seite ansehen](https://raw.githack.com/raphaelgeil652-lab/business/main/nischen/photovoltaik/kunden/muster-solartechnik/landingpage/danke.html) | `[Telefon]` füllen. Sonst fertig | Geht mit Schritt 12 automatisch online |
| 14 | **Meta-Pixel** | [▶ Events Manager](https://business.facebook.com/events_manager2) | Im Konto des Kunden: Datenquelle → Pixel. Die Pixel-ID in `index.html` **und** `danke.html` bei `PIXEL_ID` eintragen, Ordner neu hochladen | Pixel lädt nur, wenn Besucher „Einverstanden“ klicken. Prüfen: Events Manager → Testereignisse |
| 15 | **Anzeigen ansehen** ⭐ — die 3 Anzeigen mit den Gratis-Ankern, wie sie im Feed und bei Google aussehen | [▶ Vorschau öffnen](https://raw.githack.com/raphaelgeil652-lab/business/main/nischen/photovoltaik/kunden/muster-solartechnik/anzeigen/vorschau.html) | Mit dem Kollegen durchgehen. Gut zum Zeigen im Verkaufsgespräch: „So sähe das für Sie aus“ | Nicht hochladen, nur zum Ansehen und Zeigen |
| 16 | **Anzeigen-Bilder** (fertig zum Hochladen) | [Gewinnspiel](https://raw.githack.com/raphaelgeil652-lab/business/main/nischen/photovoltaik/kunden/muster-solartechnik/anzeigen/creatives/1-gewinnspiel.png) · [20 % Rabatt](https://raw.githack.com/raphaelgeil652-lab/business/main/nischen/photovoltaik/kunden/muster-solartechnik/anzeigen/creatives/2-rabatt.png) · [Speicher geschenkt](https://raw.githack.com/raphaelgeil652-lab/business/main/nischen/photovoltaik/kunden/muster-solartechnik/anzeigen/creatives/3-speicher.png) | Link öffnen → Bild speichern. **Für einen neuen Kunden:** in [`anzeigen.html`](kunden/muster-solartechnik/anzeigen/anzeigen.html) unten Name, Ort und Aktionsdatum ändern, eigene Fotos in `fotos/` legen, dann Claude sagen „Anzeigen neu rendern“ (oder `node nischen/photovoltaik/tools/creatives-rendern.js <pfad>/anzeigen.html`) | Im Werbeanzeigenmanager je ein Bild pro Anzeige, Texte aus `kampagnen.md`. Angebote vorher vom Kunden freigeben lassen |
| 17 | **Echte Fotos und Videos** (sobald vom Kunden da) | [▶ Videoschnitt-Anleitung](../../videoschnitt/README.md) | Rohvideo in `videoschnitt/projekt/public/` legen → `npm run schneiden -- public/roh.mp4`. Skript für das Inhaber-Video steht in `kampagnen.md` | Als **zusätzliche** Anzeigen in dieselbe Anzeigengruppe. Videos kommen **nicht** ins Repo |
| 18 | **Meta-Kampagne** | [▶ Werbeanzeigenmanager](https://adsmanager.facebook.com) · [Einstellungen](kunden/muster-solartechnik/kampagnen.md) | Werbekonto des Kunden wählen → Erstellen → alles 1:1 aus `kampagnen.md` (Ziel Leads, 23 €/Tag, Einzugsgebiet des Kunden, 3 Anzeigen mit Bildern und Texten aus Schritt 16). Anleitung: [`meta-anzeige-einrichten.md`](../../anleitungen/meta-anzeige-einrichten.md) | **Pausiert anlegen.** Erst nach Schritt 20 auf „Aktiv“ |
| 19 | **Google-Kampagne** | [▶ Google Ads](https://ads.google.com) · [Einstellungen](kunden/muster-solartechnik/kampagnen.md) | Im Verwaltungskonto das Konto des Kunden öffnen → Neue Kampagne → Suche → Keywords, Ausschlüsse, 15 Überschriften und 4 Beschreibungen aus `kampagnen.md` kopieren. Conversion = Aufruf der Danke-Seite | **Pausiert anlegen**, aktiv nach Schritt 20 |

### E · Test und Livegang

| # | Was | Öffnen | Weiter | Veröffentlichen |
|---|---|---|---|---|
| 20 | **Testlauf** | [▶ Checkliste](kunden/muster-solartechnik/onboarding.md) | Selbst eine Anfrage über die echte Netlify-Adresse schicken: Danke-Seite? Mail beim Kunden **und** bei dir (Spam prüfen)? Am Handy: Formular oben, Anrufen wählt die richtige Nummer? | – |
| 21 | **Livegang** | Werbeanzeigenmanager + Google Ads | Beide Kampagnen auf **Aktiv**. Datum in `onboarding.md` eintragen: Ab da laufen die 30 Tage Garantie | Kunde anrufen: „Ab jetzt kommen Anfragen, bitte innerhalb einer Stunde zurückrufen.“ |
| 22 | **Laufender Betrieb** | [▶ Handbuch, Abschnitt „Laufender Betrieb“](https://claude.ai/artifact/7DSh95Hfrp17kLRnNLXftN) | Täglich Anfragen prüfen · wöchentlich Kurzanruf „was wurde aus jeder Anfrage?“ · erst ab 20–50 Anfragen etwas ändern | Monatsreport (Vorlage im Handbuch) per Mail an den Kunden |

### F · Neue PV-Kunden in ganz Deutschland gewinnen

Wir sind nicht an einen Ort gebunden. Jeder Kunde kann irgendwo in Deutschland sitzen; seine
**Werbung** läuft trotzdem nur in **seinem** Einzugsgebiet. Verkauft wird per Telefon und Video
statt mit Besuch vor Ort.

| # | Was | Öffnen | Weiter | Veröffentlichen |
|---|---|---|---|---|
| 23 | **Lead-Liste PV-Betriebe** | [▶ Google Maps](https://www.google.com/maps/search/Photovoltaik+Installateur) | Pro Stadt suchen „Photovoltaik [Stadt]“. Passt: inhabergeführt, gute Google-Bewertungen, schwache Webseite, montiert selbst. Name, Telefon, Ort, Bewertung in eine Tabelle | Intern |
| 24 | **Erstkontakt per Telefon** | [▶ Handbuch, Abschnitt „Neue Kunden gewinnen“](https://claude.ai/artifact/7DSh95Hfrp17kLRnNLXftN) | Ziel ist ein 20-Minuten-Videocall, kein Abschluss am Telefon. Die zwei Fragen: Welche Leistung bringt am meisten? Wie viele Montagen pro Monat gehen zusätzlich? Dazu: **Bis wie viele Kilometer fahren Sie zur Montage?** | – |
| 25 | **Videocall mit Bildschirm** | [▶ Anzeigen-Vorschau](https://raw.githack.com/raphaelgeil652-lab/business/main/nischen/photovoltaik/kunden/muster-solartechnik/anzeigen/vorschau.html) · [▶ Landingpage](https://raw.githack.com/raphaelgeil652-lab/business/main/nischen/photovoltaik/kunden/muster-solartechnik/landingpage/index.html) | Bildschirm teilen, Anzeigen und Seite zeigen: „So sähe das mit Ihrem Namen aus.“ Tipp: Vorher in `anzeigen.html` seinen Namen und Ort eintragen und neu rendern, dann sieht er seine eigenen Anzeigen | – |
| 26 | **Abschluss aus der Ferne** | [▶ Vereinbarung](kunden/muster-solartechnik/vereinbarung.md) | Vereinbarung als PDF schicken, digital unterschreiben lassen (z. B. Unterschrift im PDF oder ein E-Signatur-Dienst), dann ab Schritt 6 | Onboarding-Call per Video statt vor Ort |

### Für den nächsten echten Kunden

Ordner `kunden/muster-solartechnik/` kopieren → umbenennen → überall Name, Ort, Einzugsgebiet und
Zahlen tauschen → in `anzeigen/anzeigen.html` Name, Ort und Aktionsdatum ändern und neu rendern → die
⚠️-Hinweise „fiktiv“ löschen. Ab Schritt 6 weiter.

---

## Warum PV ins Modell passt

- Auftragswert 13.000–25.000 €: Kriterium 1 ist nie das Problem.
- Inhabergeführte Betriebe in der Region, Gratis-Anker naheliegend (Dach-Analyse).
- Starkes Argument gegen Lead-Portale: Unsere Anfragen gehen nur an einen Betrieb.

## Worauf es hier ankommt

- **Rückruf in 1 Stunde.** Interessenten fragen parallel bei mehreren an.
- **Einzugsgebiet pro Kunde.** Der Werberadius ist das Gebiet, in dem er montiert, nicht ein fester Wert. Im Gespräch fragen.
- **Montagevorlauf prüfen.** Kapazität heißt hier: freie Montagetermine, nicht nur Beratung.
- **Lange Entscheidung.** Erster unterschriebener Auftrag nach Wochen, nicht Tagen.
- **Keine Ersparnis- oder Förderversprechen** in Anzeigen und auf der Seite.
- **Impressum und Datenschutz des Kunden** müssen vor Schritt 12 da sein. Die Seite verlinkt
  `impressum.html` und `datenschutz.html`, ohne die Dateien laufen die Links ins Leere.

## Offen mit dem Kollegen

- Wer macht was: Er verkauft an die Betriebe, du baust und betreibst das System?
- Wie wird geteilt?
- Falls er bei einem PV-Betrieb angestellt ist: Nebentätigkeit und Wettbewerbsverbot im
  Arbeitsvertrag prüfen, bevor er Konkurrenzbetriebe als Kunden anspricht.
