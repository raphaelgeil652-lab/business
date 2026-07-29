# So funktioniert alles — Einsteiger-Überblick

Dieses Dokument erklärt das ganze Setup in einfacher Sprache. Wenn dir mal unklar ist,
„was mache ich hier eigentlich", lies hier nach. Vertiefung dann in den anderen Docs.

## Das Geschäft in einem Satz

Du besorgst **lokalen Betrieben neue Kundenanfragen** über Facebook-/Instagram- und Google-Werbung —
und lieferst ein **System**, das diese Anfragen einsammelt und dafür sorgt, dass der Betrieb sofort
reagiert. Dafür zahlt dir der Betrieb monatlich.

> **Aktuelle Nische: Kfz-Betriebe** (`../nischen/autowerkstaetten/`). Die Beispiele unten sind daraus.
> Die zurückgestellte Küchen-Nische liegt in `../nischen/kuechenstudios/` und funktioniert genauso,
> nur mit anderen Zahlen.

**Warum das rechnet:** Ein Auftrag beim Kfz-Betrieb bringt 300–5.000 € (Aufbereitung, Keramik,
Folierung, Karosserie). Bringst du ihm ein paar echte Interessenten im Monat, zahlen sich **schon
zwei Aufträge** ein Vielfaches deiner Gebühr zurück.

## Die Reise einer Anfrage (der ganze Ablauf)

```
Werbung (Meta+Google) →  Landingpage  →  Formular ausgefüllt (= "Lead")
 "Kostenloser              (eine simple     Name + Telefon + Fahrzeug
  Lack-Check"               Seite)
        ↓
  Anfrage geht raus  →  Betrieb ruft SOFORT zurück  →  Festpreis genannt
  (E-Mail, später CRM)     (unter 1 Stunde!)             → Auto auf dem Hof
        ↓
  Du siehst alles, machst Monatsreport, bekommst dein Geld
```

## Die Werkzeuge — was ist was

- **Meta Ads** — die Werbung selbst (Facebook/Instagram Anzeigen).
- **Landingpage** — die *eine* Seite mit Angebot + Formular. Vorlage: `../nischen/autowerkstaetten/seiten/landingpage/`.
- **GoHighLevel (GHL)** — das **CRM**. Wie ein digitales **Kontaktbuch + Kalender + Nachrichten-Zentrale**. Hier landen Anfragen, stehen Termine, gehen automatische Nachrichten raus.
- **n8n** — der **Automatik-Roboter im Hintergrund**. Nach dem Prinzip „*wenn X passiert, tue automatisch Y*". Verbindet alle Teile, ohne dass du klickst.
- **Tracking (Pixel + CAPI)** — die **Erfolgsmessung**. Meldet Facebook zurück „aus diesem Klick wurde eine Anfrage / ein Termin / ein Kunde", damit Facebook mehr von den *richtigen* Leuten anspricht. Gleichzeitig dein **Beweis**, wie viel du gebracht hast (Abrechnungsgrundlage).

## Wie Werbung + Budget funktioniert (in einfach)

**Werbung schalten** = Meta (Facebook/Instagram) zeigt deine Anzeige gezielt Leuten **in der Region**
(z. B. Autobesitzern im Umkreis von 25 km). Dafür zahlt man Meta Geld — das heißt **Werbebudget**.

**Budget = Tagesbetrag.** Du sagst Meta z. B. „gib 20 €/Tag aus". Meta zeigt die Anzeige so vielen
passenden Leuten, bis die 20 € aufgebraucht sind. **Mehr Budget = mehr Reichweite = mehr mögliche Anfragen.**

**Wie daraus Anfragen werden:**
```
Anzeige "Kostenloser Lack-Check" (Meta zeigt sie in der Region, max. 25 km)
   → jemand klickt → Landingpage → Formular ausgefüllt = 1 Anfrage → E-Mail an den Kunden
```
Grobes Gefühl: eine Anfrage kostet 25–55 €. Aus 600 €/Monat werden also grob 15–25 Anfragen.

### ⭐ Der wichtigste Punkt: die ZWEI getrennten Geldtöpfe
```
KUNDE (Kfz-Betrieb)
   ├─ zahlt WERBEBUDGET ─────►  META/GOOGLE  (damit die Anzeige läuft; eigene Karte)
   │    z.B. 600 €/Monat                     ⟵ NICHT dein Geld, du verdienst da nichts dran
   └─ zahlt DEINE GEBÜHR ────►  DU            (fürs Aufsetzen + Betreuen)
        700 € Onboarding + 999 €/Monat       ⟵ DAS ist dein Einkommen
```
- **Werbebudget** gehört dem Kunden und geht **direkt an Meta** (seine Karte im Werbekonto). Du fasst es nie an. Es ist nur der „Sprit" für die Anzeige.
- **Deine Gebühr** zahlt der Kunde separat an dich. Damit hat das Werbebudget nichts zu tun.
- Du **stellst das Budget zwar ein** (weil du die Anzeige verwaltest), aber bezahlt wird es von **seiner** Karte.

**Was du dabei tust:** einmal einrichten (Bild, Text, Zielgruppe, Tagesbudget) — die Auslieferung
macht danach **Metas System automatisch**. Dein Job: gutes Angebot + gute Landingpage + Anzeige
aufsetzen + ab und zu optimieren.

**Warum es sich für den Kunden lohnt:** ~600 € Budget + 999 € an dich = ~1.600 €/Monat → grob
17 Anfragen → ~5 Aufträge → bei 600 € pro Auftrag **~3.000 € Umsatz**. Bei einer Keramikversiegelung
(~1.000 €) oder einem Karosserieauftrag (~2.500 €) entsprechend deutlich mehr.

## Was die 3 n8n-Workflows tun (in einfach)

n8n besteht aus kleinen Automatik-Ketten. Wir haben drei Grundgerüste (`../anleitungen/n8n/`):

- **WF-1 „Neue Anfrage verarbeiten"** — sobald jemand das Formular ausfüllt: Kontakt ins CRM eintragen, Facebook „das war eine Anfrage" melden, Sofort-Antwort anstoßen.
- **WF-2 „Sofort zurückschreiben"** — schickt in Sekunden eine WhatsApp/SMS „Danke, wir melden uns". Wichtig, weil Anfragen kalt werden, wenn man Stunden wartet.
- **WF-3 „Fortschritt an Facebook melden"** — wenn der Betrieb den Kontakt weiterschiebt (Termin → erschienen → Kunde), lernt Facebook, Leute zu bringen, die wirklich kaufen.

## Entwarnung: Was du zum Start WIRKLICH brauchst

Du musst das nicht alles auswendig können und **nicht sofort** aufsetzen. Das Playbook beschreibt
das *ausgereifte* System für viele Klienten. Für deinen **ersten Kunden** reicht viel weniger:
Angebot + einfache Landingpage + eine Facebook-Anzeige + ein simpler Weg, die Anfrage aufzufangen.
Den ganzen Automatik-Überbau (n8n, CAPI, Snapshot) baust du **erst danach**, wenn du skalierst.

👉 Konkreter, schlanker Startweg: **`../nischen/autowerkstaetten/akquise/fahrplan-erster-umsatz.md`**.

## Glossar (kurz erklärt)

- **Lead** — eine Kontakt-Anfrage (jemand hat das Formular ausgefüllt).
- **Offer / Gratis-Anker-Offer** — das kostenlose Einstiegs-Angebot (z. B. „kostenloser Lack-Check"), das zum teuren Kauf führt.
- **AOV** — „Average Order Value", der durchschnittliche Auftragswert (muss über ~300 € liegen, sonst trägt er keine Werbung).
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

- **Aktuelle Nische (Kfz-Betriebe):** `../nischen/autowerkstaetten/businessplan.md`, `../nischen/autowerkstaetten/service-module.md`
- **Zurückgestellte Nische (Küchenstudios):** `../nischen/kuechenstudios/geschaeftsmodell.md`, `../nischen/kuechenstudios/nische.md`
- Ablauf mit Klient: `../anleitungen/klienten-journey.md`
- Technik-Regeln: `../anleitungen/tech-stack.md`, Detail-Anleitung: `../anleitungen/ghl-n8n-aufbau.md`
- **Loslegen:** `../nischen/autowerkstaetten/akquise/fahrplan-erster-umsatz.md`
