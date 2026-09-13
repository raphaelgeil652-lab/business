# Posteingang & Alltag automatisieren

Stand: 13.09.2026. Was gemacht ist, was du selbst klicken musst, und warum.

---

## Der Befund

| | |
|---|---|
| Mails im Posteingang | **9.846** |
| davon ungelesen | **8.981** |
| Ordner/Labels vorher | **0** |
| Termine im Kalender (nächste 4 Wochen) | **1** (Friseur, 23.09.) |

Stichprobe der letzten 50 Threads: **rund 40 davon reine Werbung.** Die Hauptverursacher sind
Temu, Outletcity, BestSecret, Isabel Bernard, elusa, Europa-Park, ZEIT, ActivTrades, NAGA,
Scalable Capital, Jobrapido — dazu TikTok-, Snapchat- und Vercel-Benachrichtigungen.

**Das eigentliche Problem ist nicht die Menge, sondern dass dazwischen Sachen untergehen,
die dich wirklich betreffen.** Gefunden zwischen der Werbung:

- **Sling / Wakepark Pfullendorf** — deine Schichten. Stehen nur in Mails, nirgends sonst.
- **iCloud-Speicher voll** seit 09.09. → seitdem kein Backup mehr von deinem Gerät.
- **Instagram**: „Passwort vergessen"-Mail am 10.09., Nutzername am 11.09. geändert
  (`ra1ael_gl15` → `_404.raphael_`). Warst du das?
- **TikTok**: Login von einem neuen Gerät am 09.09., plus ein 6-stelliger Code.
- **Vercel**: schickt bei *jedem* Commit „9 deployments failed". Verursacht das Repo hier.

---

## Was schon erledigt ist

Vier Labels angelegt und die gefundenen Mails einsortiert:

| Label | Farbe | Was rein kommt |
|---|---|---|
| `1 Schichten` | grün | alles von Sling / Wakepark |
| `2 Sicherheit` | rot | Logins, Codes, Passwörter, Kontoänderungen |
| `3 Geld und Fristen` | orange | Rechnungen, Abos, Mahnungen, „Speicher voll" |
| `4 Braucht Antwort` | blau | echte Mails von echten Menschen |

**Nichts wurde gelöscht und nichts archiviert.** Alle 9.846 Mails liegen unverändert da.

---

## Schritt 1 — Gmail-Filter (das Wichtigste, 10 Minuten)

Das ist die einzige Automation, die **dauerhaft von allein läuft** — direkt in Gmail, ohne KI,
ohne dass irgendwas angeschaltet bleiben muss. Einmal eingerichtet, für immer.

**So geht's:** Gmail am Rechner öffnen → oben ins Suchfeld den Suchtext eingeben →
rechts im Suchfeld auf **Suchoptionen anzeigen** → unten auf **Filter erstellen** → Häkchen setzen.

### Filter A — Werbung verschwindet aus dem Posteingang

**Suchtext:**
```
category:promotions
```
**Häkchen:** „Posteingang überspringen (Archivieren)" + „Auch auf passende Konversationen anwenden"

> Das letzte Häkchen wendet den Filter rückwirkend auf alle bestehenden Mails an. Damit ist der
> Großteil der 9.000 in einem Rutsch weg — **nicht gelöscht**, nur aus dem Posteingang raus.
> Du findest alles weiter über die Suche und unter „Alle Nachrichten".

### Filter B — Schichten landen sofort richtig

**Suchtext:**
```
from:sling@getsling.com
```
**Häkchen:** „Label anwenden: 1 Schichten" + „Immer als wichtig markieren" + rückwirkend anwenden

### Filter C — Sicherheitsmails niemals übersehen

**Suchtext:**
```
from:(security@mail.instagram.com OR noreply@account.tiktok.com OR no-reply@accounts.google.com OR noreply@email.apple.com OR informational@email.snapchat.com)
```
**Häkchen:** „Label anwenden: 2 Sicherheit" + „Immer als wichtig markieren" + rückwirkend anwenden

### Filter D — Social-Lärm raus

**Suchtext:**
```
from:(notification@service.tiktok.com OR informational@email.snapchat.com OR notifications@vercel.com)
```
**Häkchen:** „Posteingang überspringen" + rückwirkend anwenden

### Filter E — Die Werbe-Dauersender, die Filter A nicht erwischt

**Suchtext:**
```
from:(temuemail.com OR my.outletcity.com OR fashionnews.bestsecret.com OR isabelbernard.com OR support@elusa.de OR news.europapark.de OR newsletterversand.zeit.de OR marketing.activtrades.com OR news.naga.com OR mailer.scalable.capital OR jobrapidoalert.com)
```
**Häkchen:** „Posteingang überspringen" + rückwirkend anwenden

---

## Schritt 2 — Abmelden statt filtern (die saubere Lösung)

Filtern versteckt nur. Abmelden stoppt es. Gmail zeigt bei den meisten dieser Absender oben
neben dem Namen einen **„Abmelden"**-Link — ein Klick, fertig. Lohnt sich bei:

Temu (mit Abstand der stärkste Absender) · Outletcity · BestSecret · Isabel Bernard · elusa ·
Europa-Park · ZEIT · ActivTrades · NAGA · Scalable Capital · Jobrapido

**Vercel ist ein Sonderfall** und gehört nicht abgemeldet, sondern abgestellt:
vercel.com → Settings → Notifications → Deployment-Mails aus. Oder das Projekt löschen, wenn
du es ohnehin nicht nutzt — die 9 fehlschlagenden Deployments kommen von diesem Repo und
bringen dir nichts.

---

## Schritt 3 — Das Morgenbriefing (läuft täglich von selbst)

Ich kann diese Routine **nicht für dich anlegen** — in deinem Account dürfen automatisch
angelegte Routinen die Gmail- und Kalender-Verbindung nicht mitnehmen. Sie würde jeden Morgen
starten und mit leeren Händen dastehen. Du musst sie einmal selbst anlegen, dann läuft sie.

**So geht's:** claude.ai öffnen → in der Seitenleiste **Routinen** → **Neue Routine** →
Zeitplan auf **täglich, 07:00** → sicherstellen, dass **Gmail und Google Calendar** als
Verbindungen angehakt sind → den Text unten reinkopieren → speichern.

Der fertige Text steht in [`morgenbriefing-prompt.md`](morgenbriefing-prompt.md) — einfach
komplett kopieren.

---

## Was du selbst entscheiden musst

- [ ] **Instagram prüfen.** Dein Nutzername wurde am 11.09. geändert. Wenn du das nicht warst:
      sofort Passwort ändern und Zwei-Faktor anschalten.
- [ ] **iCloud.** Speicher ist voll, seit dem 09.09. gibt es kein Backup mehr. Entweder aufräumen
      oder 0,99 €/Monat für 50 GB.
- [ ] **Offene Schicht:** Am 08.09. kam ein Angebot für **Montag, 14.09., 13:00–15:00** —
      darauf hast du nie reagiert. Das ist morgen.
- [ ] **Filter A rückwirkend anwenden?** Das räumt ~9.000 Mails auf einmal aus dem Posteingang.
      Reversibel, aber eine große Bewegung. Dein Klick, nicht meiner.
