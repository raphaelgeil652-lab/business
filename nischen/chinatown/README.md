# 🏮 China Restaurant Chinatown — Pfullendorf

Kunde: **Familie Mau**, Heiligenberger Straße 1, 88630 Pfullendorf, Tel. 07552 6636.
Di–So 11:30–14:30 und 17:30–23:00, **Montag Ruhetag**.

Hier liegt alles für diesen Kunden an einer Stelle: der gedruckte Faltflyer und die Webseite.

---

## ▶ Zum Zeigen

| Was | Öffnen |
|---|---|
| 🌐 **Die komplette Webseite** — Startseite, Speisekarte, Kontakt, Impressum und Datenschutz in einer durchgehenden Ansicht. Oben auf „Speisekarte" oder „Kontakt" klicken springt innerhalb der Seite. | **[▶ Webseite öffnen](https://htmlpreview.github.io/?https://raw.githubusercontent.com/raphaelgeil652-lab/business/main/nischen/chinatown/vorschau/webseite-komplett.html)** |
| 📄 **Der komplette Flyer** — beide Seiten des Faltflyers am Bildschirm. | **[▶ Flyer öffnen](https://htmlpreview.github.io/?https://raw.githubusercontent.com/raphaelgeil652-lab/business/main/nischen/chinatown/vorschau/flyer-komplett.html)** |
| 🖨️ Flyer als Druckdatei (PDF) — das, was in die Druckerei geht. | [PDF öffnen](https://github.com/raphaelgeil652-lab/business/blob/main/nischen/chinatown/flyer/chinatown-faltflyer-A4.pdf) |

> Beide Dateien enthalten **alles eingebettet** — Bilder, Schriften, Stylesheet. Sie laufen
> deshalb auch ohne Internet: einmal öffnen und auf dem iPad über *Teilen → Zur Leseliste
> hinzufügen* sichern, dann funktionieren sie beim Kundenbesuch auch im Funkloch.

---

## Die Webseite wirklich online stellen

Die Vorschau oben ist nur zum Zeigen. Für den echten Livegang:

<p align="center">
  <a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fraphaelgeil652-lab%2Fbusiness&root-directory=nischen%2Fchinatown%2Fwebseite&project-name=chinatown-pfullendorf&repository-name=chinatown-pfullendorf">
    <img alt="Website live schalten" src="https://img.shields.io/badge/Website%20live%20schalten-mit%20Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white">
  </a>
</p>

Oder in Vercel manuell: Repository auswählen und **Root Directory** auf
`nischen/chinatown/webseite` setzen. Details: [`webseite/README.md`](webseite/README.md).

---

## Die Ordner

| Ordner | Was drin ist |
|---|---|
| 📂 [`flyer/`](flyer/) | Faltflyer: `faltflyer.html`, druckfertiges PDF, Winkekatze, Drache, Quellfotos, Skripte |
| 📂 [`webseite/`](webseite/) | Die Webseite: 5 Seiten, Bilder, Schriften, Vercel-Konfiguration |
| 📂 [`vorschau/`](vorschau/) | Die selbstenthaltenden Dateien hinter den Öffnen-Links (werden erzeugt, nicht von Hand bearbeitet) |
| 📂 [`tools/`](tools/) | `vorschau-bauen.py` — erzeugt den Ordner `vorschau/` neu |

---

## ⚠️ Offen, bevor etwas gedruckt oder online geht

1. **Öffnungszeiten klären.** Auf der Webseite steht **23:00 Uhr** (Angabe des Kunden), im Flyer
   steht **22:00 Uhr** (aus dem alten Papierflyer). Eines von beidem ist falsch — Fam. Mau fragen,
   dann ziehe ich die Stelle nach.
2. **Preise gegenprüfen**, bevor der Flyer in Auflage geht.
3. **Impressum ausfüllen** — ohne vollständige Angaben darf die Webseite nicht öffentlich.
4. **Echte Fotos** vom Restaurant besorgen. Die aktuellen Bilder sind lizenzfreie Übergangsbilder
   (CC0) — eigene Aufnahmen wirken deutlich stärker.
5. **Google-Unternehmensprofil** anlegen; die Fremdeinträge im Netz nennen falsche Zeiten.

## Nach Änderungen

```bash
cd tools && python3 vorschau-bauen.py      # Vorschau-Dateien neu erzeugen
```

Preise immer **im Flyer** ändern, dann `webseite/tools/speisekarte-uebernehmen.py` laufen lassen —
der Flyer ist die einzige Quelle, damit Druck und Web nicht auseinanderlaufen.
