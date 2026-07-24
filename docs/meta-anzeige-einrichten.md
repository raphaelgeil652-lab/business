# Erste Meta-Anzeige einrichten (Schritt für Schritt)

Klickbare Anleitung, um für einen Kunden die erste Facebook-/Instagram-Anzeige zu schalten, die
Leute auf seine Landingpage bringt (Gratis-Planung-Offer). Für Einsteiger.

> Meta benennt Menüs manchmal leicht um — die **Logik** bleibt: eine Kampagne hat drei Ebenen:
> **Kampagne** (Ziel) → **Anzeigengruppe** (Zielgruppe + Budget) → **Anzeige** (Bild + Text + Link).

---

## Vorbereitung (einmalig pro Kunde)

- [ ] **Facebook-Seite** des Kunden vorhanden (Absender der Anzeige). Falls nicht: kostenlos anlegen.
- [ ] **Werbekonto** im Meta Business Manager, du als Partner mit Zugriff.
- [ ] **Zahlungsmethode** hinterlegt — **die Kreditkarte des Kunden** (er zahlt das Werbebudget direkt an Meta).
- [ ] **Meta Pixel** erstellt und die **PIXEL_ID in der Landingpage** eingetragen (in `index.html`/`bad.html` + `danke.html`). Damit misst Meta die Anfragen.
- [ ] **Landingpage-URL** bereit (deine Netlify-Seite).

---

## Kampagne erstellen (Ebene 1 — das Ziel)

1. **business.facebook.com/adsmanager** öffnen → richtiges Werbekonto (des Kunden) auswählen.
2. Grüner Button **„+ Erstellen"**.
3. **Kampagnenziel: „Leads"** wählen (Ziel = Kontaktanfragen). *(Alternativ „Traffic", falls der Pixel noch nicht sauber misst — siehe unten.)*
4. **Kampagnenname**, z. B. `Küche – Gratis 3D-Planung – [Studioname]`.
5. „Advantage Campaign Budget" fürs Erste **aus** lassen (Budget setzt du eine Ebene tiefer).

## Anzeigengruppe (Ebene 2 — wer + wie viel Geld)

6. **Conversion-Ort: „Website"** (die Leute sollen auf die Landingpage).
7. **Pixel + Ereignis:** Pixel des Kunden wählen, Optimierungsereignis **„Lead"**.
   → Wenn der Pixel/Lead noch nicht sauber misst: erstmal **„Landing Page Views"** (Seitenaufrufe) wählen. Das läuft immer.
8. **Budget: Tagesbudget** z. B. **20 €**. (Das zahlt der Kunde über seine hinterlegte Karte.)
9. **Zielgruppe (Standort ist das Wichtigste):**
   - **Ort:** Stadt des Kunden + Umkreis, z. B. „Pfullendorf +25 km".
   - **Alter:** ca. **30–65**.
   - **Geschlecht:** alle.
   - **Detailliertes Targeting:** bei kleinem Budget **leer lassen** oder nur leicht (z. B. Interesse „Eigenheim/Renovierung"). Metas System findet die Richtigen meist selbst.
10. **Platzierungen: „Advantage+ Platzierungen" (automatisch)** lassen.

## Anzeige (Ebene 3 — was die Leute sehen)

11. **Facebook-Seite des Kunden** als Absender wählen (ggf. Instagram-Konto verknüpfen).
12. **Format: Einzelbild** (am einfachsten).
13. **Bild** hochladen — ein **echtes, gutes Foto** (fertige Küche/Bad). Kein Text im Bild überladen.
14. **Primärtext + Überschrift** aus `../templates/ad-copy.md` einsetzen ([Studioname]/[Ort] ersetzen).
15. **Website-URL:** deine **Landingpage-URL**.
16. **Call-to-Action-Button:** „Mehr dazu" oder „Angebot erhalten".
17. **Advantage+ Creative-Verbesserungen ausschalten** (Meta verändert sonst dein Bild/Text — Playbook-Hygiene). Für den Start optional.
18. Rechts in der **Vorschau** prüfen, wie's auf dem Handy aussieht.
19. **„Veröffentlichen"** → Meta prüft die Anzeige (Review, meist < 24 h) → dann läuft sie.

---

## Nach dem Launch

- **3–4 Tage laufen lassen, bevor du urteilst.** Meta hat eine Lernphase — nicht täglich rumstellen.
- Wichtigste Zahl: **Kosten pro Anfrage** (Cost per Lead). Beispiel-Gefühl: 5–25 € pro Anfrage ist je nach Region okay; ein Anfrage-Wert ist bei Küche/Bad ein Vielfaches wert.
- Wenn nach ~1 Woche zu teuer/keine Anfragen: **Bild oder Überschrift** tauschen (nur eine Sache ändern, nicht alles). Struktur/Offer bleibt gleich.
- **Testlead:** direkt nach Freigabe selbst über die Anzeige/LP eine Testanfrage schicken → kommt die E-Mail? Läuft alles?

## Wenn die Anzeige abgelehnt wird

Passiert bei neuen Konten öfter. Meist Formalität. **Einspruch einlegen** (Button bei der abgelehnten Anzeige), oft wird sie dann freigegeben. Keine Panik.

## Budget-Erinnerung (wichtig)

Das **Tagesbudget zahlt der Kunde** über seine Karte direkt an Meta — nicht du. Du **verwaltest** nur die
Anzeige. Deine Gebühr (Setup + monatlich) ist davon komplett getrennt. (Details: `so-funktioniert-alles.md`.)

## Später (Ausbaustufe)

Sauberes Tracking mit **Pixel + CAPI** und Optimierung auf echte Termine/Kunden: `ghl-n8n-aufbau.md`.
Für die ersten Kunden reicht die einfache Variante oben.
