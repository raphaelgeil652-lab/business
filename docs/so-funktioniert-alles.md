# So funktioniert alles — Einsteiger-Überblick

Dieses Dokument erklärt das ganze Setup in einfacher Sprache. Wenn dir mal unklar ist,
„was mache ich hier eigentlich", lies hier nach. Vertiefung dann in den anderen Docs.

## Das Geschäft in einem Satz

Du besorgst lokalen **Küchen- und Bad-Betrieben neue Kundenanfragen** über
Facebook-/Instagram-Werbung — und lieferst ein **System**, das diese Anfragen automatisch
einsammelt und dafür sorgt, dass der Betrieb sofort reagiert. Dafür zahlt dir der Betrieb monatlich.

**Warum das rechnet:** Eine neue Küche kostet 10–30k €, ein Bad 15–40k €. Bringst du dem Betrieb
ein paar echte Interessenten im Monat, ist **ein einziger Abschluss** ein Vielfaches deiner Gebühr wert.

## Die Reise einer Anfrage (der ganze Ablauf)

```
Facebook-Werbung  →  Landingpage  →  Formular ausgefüllt (= "Lead")
 "Kostenlose          (eine simple      Name + Telefon
  3D-Planung"          Seite)
        ↓
  Lead landet im CRM  →  System schreibt SOFORT zurück  →  Betrieb ruft an
  (digitales             "Danke, wir melden uns"            → Termin → Küche verkauft
   Kontaktbuch)          (WhatsApp/SMS)
        ↓
  Du siehst alles, machst Monatsreport, bekommst dein Geld
```

## Die Werkzeuge — was ist was

- **Meta Ads** — die Werbung selbst (Facebook/Instagram Anzeigen).
- **Landingpage** — die *eine* Seite mit Angebot + Formular. Vorlage: `../templates/landingpage/`.
- **GoHighLevel (GHL)** — das **CRM**. Wie ein digitales **Kontaktbuch + Kalender + Nachrichten-Zentrale**. Hier landen Anfragen, stehen Termine, gehen automatische Nachrichten raus.
- **n8n** — der **Automatik-Roboter im Hintergrund**. Nach dem Prinzip „*wenn X passiert, tue automatisch Y*". Verbindet alle Teile, ohne dass du klickst.
- **Tracking (Pixel + CAPI)** — die **Erfolgsmessung**. Meldet Facebook zurück „aus diesem Klick wurde eine Anfrage / ein Termin / ein Kunde", damit Facebook mehr von den *richtigen* Leuten anspricht. Gleichzeitig dein **Beweis**, wie viel du gebracht hast (Abrechnungsgrundlage).

## Was die 3 n8n-Workflows tun (in einfach)

n8n besteht aus kleinen Automatik-Ketten. Wir haben drei Grundgerüste (`../templates/n8n/`):

- **WF-1 „Neue Anfrage verarbeiten"** — sobald jemand das Formular ausfüllt: Kontakt ins CRM eintragen, Facebook „das war eine Anfrage" melden, Sofort-Antwort anstoßen.
- **WF-2 „Sofort zurückschreiben"** — schickt in Sekunden eine WhatsApp/SMS „Danke, wir melden uns". Wichtig, weil Anfragen kalt werden, wenn man Stunden wartet.
- **WF-3 „Fortschritt an Facebook melden"** — wenn der Betrieb den Kontakt weiterschiebt (Termin → erschienen → Kunde), lernt Facebook, Leute zu bringen, die wirklich kaufen.

## Entwarnung: Was du zum Start WIRKLICH brauchst

Du musst das nicht alles auswendig können und **nicht sofort** aufsetzen. Das Playbook beschreibt
das *ausgereifte* System für viele Klienten. Für deinen **ersten Kunden** reicht viel weniger:
Angebot + einfache Landingpage + eine Facebook-Anzeige + ein simpler Weg, die Anfrage aufzufangen.
Den ganzen Automatik-Überbau (n8n, CAPI, Snapshot) baust du **erst danach**, wenn du skalierst.

👉 Konkreter, schlanker Startweg: **`erster-kunde-fahrplan.md`**.

## Glossar (kurz erklärt)

- **Lead** — eine Kontakt-Anfrage (jemand hat das Formular ausgefüllt).
- **Offer / Gratis-Anker-Offer** — das kostenlose Einstiegs-Angebot (z. B. „kostenlose 3D-Planung"), das zum teuren Kauf führt.
- **AOV** — „Average Order Value", der durchschnittliche Auftragswert (bei Küche/Bad sehr hoch).
- **CRM** — Kundenverwaltungs-Software (hier: GoHighLevel).
- **GoHighLevel (GHL)** — das konkrete CRM-Tool, das wir nutzen.
- **Subaccount** — ein eigener GHL-Bereich pro Klient.
- **Snapshot** — eine gespeicherte Vorlage eines fertig eingerichteten GHL-Accounts, die man pro Klient „klont" (kopiert).
- **PIT (Private Integration Token)** — ein Passwort-artiger Schlüssel, mit dem n8n mit GHL reden darf.
- **n8n** — Automatisierungs-Tool (die „wenn X dann Y"-Schaltzentrale).
- **Landingpage (LP)** — die einzelne Werbe-Seite mit Angebot + Formular.
- **Meta Pixel** — ein kleines Skript auf der LP, das Facebook meldet, was Besucher tun.
- **CAPI (Conversions API)** — dieselbe Meldung an Facebook, aber vom Server statt vom Browser (zuverlässiger).
- **event_id** — eine eindeutige Nummer pro Anfrage, damit Pixel- und CAPI-Meldung nicht doppelt gezählt werden.
- **Dedup (Deduplizierung)** — genau das: doppelte Zählung verhindern (über die gemeinsame event_id).
- **Speed-to-Lead** — sofortige Reaktion auf eine neue Anfrage (in Minuten, nicht Stunden).
- **Deeper-Funnel-Events** — nicht nur „Anfrage" an Facebook melden, sondern auch „Termin/Kunde", damit Facebook auf echte Käufer optimiert.
- **Onboarding-Gebühr** — einmalige Setup-Gebühr, die der Klient am Anfang zahlt.
- **Revenue Share** — Umsatzbeteiligung: du bekommst z. B. pro Termin/Abschluss Geld (statt Fixpreis).
- **Retainer** — feste monatliche Betreuungsgebühr.

## Weiterlesen

- Geschäft & Geld: `geschaeftsmodell.md`
- Nische & Angebot: `nischen.md`, `offer-und-ads.md`
- Ablauf mit Klient: `klienten-journey.md`
- Technik-Regeln: `tech-stack.md`, Detail-Anleitung: `ghl-n8n-aufbau.md`
- **Loslegen:** `erster-kunde-fahrplan.md`
