# Google-Ads-Konto für einen Neukunden anlegen und übergeben (Verwaltungskonto, deutsche Oberfläche, Stand Nov. 2026)

**Hinweis zur Quellenlage:** Keine einzige Seite ließ sich abrufen. support.google.com, developers.google.com, omr.com, ppc.land, ppcnewsfeed.com und seroundtable.com waren im Netz dieser Sitzung gesperrt (ENOTFOUND). Alle Belege unten stammen aus **Suchergebnis-Auszügen**, nicht aus vollständig gelesenen Seiten. Genaue Knopf-Beschriftungen der deutschen Oberfläche 2026 konnte ich deshalb kaum bestätigen. Was nur aus Vorwissen stammt, steht unter „Inferences“ und ist dort als solches markiert.

## 1. Der Assistent im neuen Unterkonto: Wie schließt man die Kontoerstellung ohne Kampagne ab?

### Takeaway
Laut Google-Hilfe gibt es im Verwaltungskonto die Option „create account without a campaign“ (deutsch vermutlich „Konto ohne Kampagne erstellen“). Sie erscheint aber **nur für berechtigte Verwaltungskonten**: Darunter muss ein Konto mit mehr als 1.000 USD Ausgaben und sauberer Richtlinien-Historie hängen. Ein frisches Agentur-MCC ohne Ausgaben bekommt diese Option sehr wahrscheinlich nicht angezeigt. Das erklärt gut, warum der Assistent „Hallo …, sprechen wir doch zuerst über Ihr Unternehmen“ immer wiederkommt: Ohne Abschluss des Assistenten mit Abrechnung, und vermutlich mit einer Kampagne, kommt man nicht heraus.

### Cited Findings
- Weg im Verwaltungskonto: Seite „Konten“ → Plus-Knopf → „Neues Konto erstellen“ → Unternehmensinformationen. Ein zweiter Weg führt über das Abschnittsmenü „Unterkontoeinstellungen“. — [Google Ads Hilfe 7456139](https://support.google.com/google-ads/answer/7456139?hl=en) (Suchauszug)
- „Eligible advertisers who have had more than $1,000 USD in spend and are in good standing with Google Ads policy will be able to select 'create account without a campaign'. This functionality allows you to complete account and billing set up only, skipping subsequent steps (including campaign creation)“. Eine Kampagne braucht man trotzdem, damit Anzeigen laufen. — [Google Ads Hilfe 7456139](https://support.google.com/google-ads/answer/7456139?hl=en) (Suchauszug; die Seite wirkte laut Metadaten älter, der Schwellenwert kann sich geändert haben)
- Laut einer anderen Hilfeseite muss man direkt oder indirekt ein Google-Ads-Konto besitzen, das insgesamt mehr als 1.000 USD ausgegeben hat und die Richtlinien eingehalten hat. Erst dann darf man aus dem MCC überhaupt neue Konten erstellen. — [Google Ads Hilfe 7518900](https://support.google.com/google-ads/answer/7518900?hl=en) (Suchauszug). **Widerspruch zum Praxistest:** Das Konto ließ sich am 20.11.2026 trotzdem anlegen. Die Sperre gilt 2026 offenbar nur noch für den Weg „ohne Kampagne“, oder sie wird nicht mehr durchgesetzt.
- Nach dem Speichern der Unternehmensinformationen kommt laut Hilfe die Seite für die Abrechnung: Zahlungsmethode wählen, Abrechnungsdaten wie Rechnungsname und Rechnungsadresse eingeben. — [Google Ads Hilfe 7456139](https://support.google.com/google-ads/answer/7456139?hl=en) (Suchauszug)
- Das Verwaltungskonto ist automatisch administrativer Inhaber des neuen Kontos. Konten ohne Aktivität über 15 Monate werden gekündigt. — [Google Ads Hilfe 7456139](https://support.google.com/google-ads/answer/7456139?hl=en) (Suchauszug)
- Land und Zeitzone werden beim Anlegen festgelegt und lassen sich danach nicht mehr ändern. — [developers.google.com Shopping t13 (de)](https://developers.google.com/google-ads/shopping/campaign-management/articles/t13?hl=de) (Suchauszug)
- Ein Leitfaden (Leadsie, 2026) sagt: Neue Konten direkt aus dem MCC anzulegen steht nicht allen offen. Man könne die Kampagne beim Onboarding aber überspringen, indem man in den Expertenmodus wechselt. Das ist eine Blog-Behauptung, nicht offizielle Anleitung. — [Leadsie](https://www.leadsie.com/blog/how-to-create-a-google-ads-account)
- Google testet seit 2025/2026 einen schnelleren Onboarding-Weg, bei dem Kontoerstellung und Kampagne gebündelt werden („create an account with campaign“). — [Search Engine Land](https://searchengineland.com/google-tests-faster-account-setup-using-pre-built-campaigns-467526); [SERoundtable](https://www.seroundtable.com/google-ads-create-an-account-with-campaign-for-faster-set-up-40747.html)
- In den Suchergebnissen taucht eine PPC-News-Meldung aus dem Oktober 2026 auf: „MCC accounts can create Google Ads accounts without …“. Den Inhalt konnte ich nicht abrufen. Es ist unklar, ob die 1.000-USD-Hürde damit gefallen ist. — [ppcnewsfeed 2026-10](https://ppcnewsfeed.com/ppc-news/2026-10/mcc-accounts-can-create-google-ads-accounts-without/) (nur Titel)

### Inferences
- Wahrscheinlichster Grund für die Schleife: Dem neuen Clickculture-MCC fehlt die Ausgaben-Historie. Deshalb gibt es kein „Ohne Kampagne“, und der Assistent führt zwangsweise über Unternehmen → (Kampagne) → Abrechnung. Ein Konto ohne abgeschlossene Abrechnung bleibt im Zustand „Einrichtung unvollständig“, und der Assistent öffnet sich bei jedem Klick neu. Diese Erklärung stammt aus Vorwissen und ist nicht belegt.
- Seite 1 lässt sich ohne fertige Website bestehen, wenn man „Ihre geschäftliche Telefonnummer“ wählt statt „Ihre Website“. Das ist eine reine Ableitung aus den gezeigten Optionen und ungeprüft. Die Zielseite lässt sich später in der Kampagne ändern. Alternativ gibt man eine bereits erreichbare URL an, etwa die bestehende Webseite des Studios.
- Die Einladung im Feld „Nutzer in dieses Konto einladen (optional)“ wird vermutlich erst verschickt, wenn der Assistent abgeschlossen ist. Ein Beleg dafür fehlt. Sicherer ist es, die Einladung danach im **Unterkonto selbst** zu verschicken, unter Verwaltung → Zugriff und Sicherheit → „+“, und **nicht** im MCC.
- Sollte der Assistent auf Seite 2 oder 3 einen Link „Zum Expertenmodus wechseln“ oder „Konto ohne Kampagne erstellen“ zeigen, ist das der Ausstieg. Laut Hilfe ist er aber an die Berechtigung gebunden. Bei frischem MCC muss man damit rechnen, dass er fehlt.

### Gaps
- Die genauen Bildschirme 2 bis n des Assistenten (2025/2026, deutsch) waren nirgends als Text zu finden. Hilfeseiten und Community-Threads ließen sich nicht abrufen.
- Ob die Abrechnung zwingend im Assistenten liegt oder übersprungen werden kann, ist nicht bestätigt.
- Was die Oktober-2026-Meldung genau ändert, ist unbekannt.

## 2. Alternative: Der Kunde legt sein Konto selbst an und nimmt die Verknüpfung an

### Takeaway
Für ein **eigenständiges** Konto über ads.google.com dokumentiert Google den Weg „Zum Expertenmodus wechseln“ → „Konto ohne Kampagne erstellen“ → Abrechnungsland, Zeitzone und Währung bestätigen. Eine 1.000-USD-Hürde ist dort nicht erwähnt. Danach schickt die Agentur aus dem MCC eine Verknüpfungsanfrage, und der Kunde nimmt sie an. Dieser Weg umgeht die MCC-Sperre und lässt das Konto beim Kunden. Er hat aber zwei neue Hürden für 2026: Passkey und, im Pilotprogramm, Firmen-E-Mail für sensible Aktionen.

### Cited Findings
- Neue Konten starten im Smart-Modus. Profis können in den Expertenmodus wechseln und auf der Seite „Neue Kampagne“ den Weg „Create an account without a campaign“ wählen, danach Abrechnungsland, Zeitzone und Währung bestätigen. — [Google Ads Hilfe 6366720](https://support.google.com/adwords/answer/6366720?hl=en-AU) (Suchauszug)
- Laut Drittanbieter-Anleitungen entstehen keine Kosten, bis eine Kampagne mit hinterlegter Abrechnung läuft. — [graphed.com](https://graphed.com/blog/how-to-create-a-google-ad-account-without-a-campaign); [Selah Creative](https://selahcreativeco.squarespace.com/blog/how-to-set-up-a-google-ads-account-without-a-campaign)
- Bekanntes Problem: Nach dem Wechsel in den Expertenmodus zeigt das Konto beim nächsten Login wieder die Smart-Ansicht. Den Modus erkennt man am Zahnrad-Label: „Einstellungen“ bedeutet Smart, „Tools und Einstellungen“ bedeutet Experte. — [FeedArmy](https://feedarmy.com/kb/how-to-fix-google-ads-stuck-in-smart-mode-even-after-switching-to-expert-mode/); [Google Ads Hilfe 9520605](https://support.google.com/google-ads/answer/9520605?hl=en-AU) (Suchauszüge)
- Smart-Kampagnen werden zurückgefahren. Laut Google-Entwicklerblog (Juni 2026) wird die Neuanlage über die API eingestellt, Empfehlung ist Performance Max. — [Google Ads Developer Blog 2026/06](https://developers.google.com/ads/blog/posts/2026/06/changes-to-support-for-smart-campaigns?m=1); [Search Engine Land](https://searchengineland.com/google-ads-api-to-stop-supporting-new-smart-campaign-creation-480999)
- Einladungen und Anfragen nimmt man über die Kontoeinstellungen bzw. den Kontozugriff an. Ausstehende Einladungen findet man unter „Zugriff und Sicherheit“. — [developers.google.com Shopping t14 (de)](https://developers.google.com/google-ads/shopping/full-automation/articles/t14?hl=de); [AdsPower](https://www.adspower.com/de/blog/how-do-i-share-google-ads-account) (Suchauszüge)
- Wird ein Konto mit einem MCC verknüpft, behält der ursprüngliche Werbetreibende Anmeldung und Abrechnung. — [developers.google.com (de)](https://developers.google.com/google-ads/shopping/full-automation/articles/t14?hl=de) (Suchauszug)
- Allgemeiner Praxisrat (Agentur-Blog, April 2025): Der Kunde soll Inhaber des Kontos sein, die Agentur wird als Verwalter hinzugefügt. — [Yael Consulting](https://www.yaelconsulting.com/?p=7042)

### Inferences
- **Weniger Fehlerstellen für eine Studio-Inhaberin hat Weg B (Kunde legt selbst an)**, vorausgesetzt der Betreuer sitzt **daneben oder ist per Bildschirm dabei**. Weg A scheitert an etwas, das der Kunde nicht beheben kann: der fehlenden MCC-Berechtigung. Weg B scheitert höchstens am Expertenmodus-Link, und den kann der Betreuer zeigen. Danach muss der Kunde nur noch:
  1. auf ads.google.com mit seinem Google-Konto anmelden,
  2. „Zum Expertenmodus wechseln“ klicken (kleiner Link unten im Assistenten),
  3. „Konto ohne Kampagne erstellen“ wählen,
  4. Land Deutschland, Zeitzone Berlin und Währung EUR bestätigen (danach nicht mehr änderbar),
  5. die 10-stellige Kunden-ID oben rechts weitergeben.
- Danach im MCC unter Konten → „+“ → „Vorhandenes Konto verknüpfen“ die Kunden-ID eingeben und die Anfrage senden. Der Kunde nimmt sie im eigenen Konto an, unter Verwaltung → Zugriff und Sicherheit → Tab „Verwaltungskonten“ → Annehmen. **Diese Beschriftungen stammen aus Vorwissen, nicht aus 2026-Quellen.**
- Wenn das Studio kein eigenes Google-Konto mit Firmen-E-Mail hat, ist Weg A besser: MCC legt an, Abrechnung durch den Kunden. Voraussetzung ist, dass die MCC-Hürde fällt.

### Gaps
- Ob „Zum Expertenmodus wechseln“ und „Konto ohne Kampagne erstellen“ im deutschen Assistenten im November 2026 noch existieren, ist nicht bestätigt. Google testet gebündelte Onboarding-Wege, siehe Abschnitt 1.

## 3. Zahlung: Kunde mit Zugriffsebene „Verwaltung“ hinterlegt die Abrechnung; Verifizierung in Deutschland

### Takeaway
Die Zahlungsmethode wird im Kundenkonto unter Abrechnung → Einstellungen → „Zahlungsmethode hinzufügen“ hinterlegt. Das Ändern von Abrechnungsdaten ist seit dem 15.07.2026 für betroffene Konten eine **„sensible Aktion“ mit Passkey-Pflicht**. Die Werbetreibenden-Verifizierung wird nicht pauschal zum Start verlangt. Google fordert sie per Benachrichtigung an und setzt eine Frist, sonst wird das Konto pausiert. Die Beauty-Behandlungen sind keine Finanzdienstleistungen, die Finanz-Verifizierung für Deutschland greift also nicht.

### Cited Findings
- Pfad: Menü Abrechnung → Einstellungen → Bereich „Zahlungsmethoden“ → „Zahlungsmethode hinzufügen“. Bankkonten außerhalb der USA brauchen unter Umständen eine Testzahlung oder Einzugsermächtigung. — [Google Ads Hilfe 2472647 (de)](https://support.google.com/google-ads/answer/2472647?hl=de) (Suchauszug)
- Ab dem 15.07.2026 ist für bestimmte sensible Aktionen ein Passkey nötig, darunter das Hinzufügen von Nutzern und das Ändern von Abrechnungsdaten. Ein neuer Passkey ist erst **48 Stunden** nach dem Anlegen dafür nutzbar. Nur ein Teil der Werbetreibenden ist betroffen, sie werden per E-Mail und Hinweis im Konto informiert. — [Google Ads Hilfe 16917887](https://support.google.com/google-ads/answer/16917887); [SERoundtable](https://www.seroundtable.com/google-ads-passkey-sensitive-actions-41286.html); [PPC Land](https://ppc.land/google-ads-will-require-passkeys-for-sensitive-actions-from-july-15/) (Suchauszüge)
- Agenturen sollen auf persönliche Zugänge umstellen: Jeder Mitarbeiter wird mit eigener E-Mail-Adresse eingeladen und schützt seinen Zugang mit eigenem Passkey. — [Google Ads Hilfe 16917887](https://support.google.com/google-ads/answer/16917887) (Suchauszug)
- **Firmen-E-Mail-Pflicht (Pilot):** Sensible Aktionen wie Änderungen an Kontoverknüpfungen und Nutzerzugriffen erfordern im Pilotprogramm eine Firmen-Domain. @gmail.com bzw. @yahoo.com dürfen weiter Berichte ansehen und Kampagnen bearbeiten. Betroffene werden per E-Mail informiert. — [Google Ads Hilfe 17423445](https://support.google.com/google-ads/answer/17423445?hl=en); [Search Engine Land](https://searchengineland.com/new-google-ads-help-doc-outlines-corporate-email-rules-484414); [SERoundtable](https://seroundtable.com/google-ads-free-email-account-security-41827.html)
- Mehrparteien-Genehmigung: Ein zweiter Admin muss sensible Aktionen wie das Hinzufügen von Nutzern oder das Ändern von Rollen bestätigen, sofern dies aktiv ist. — [Google Ads Hilfe 16891189](https://support.google.com/google-ads/answer/16891189) (Suchauszug)
- Werbetreibenden-Verifizierung: Google meldet sich per Benachrichtigung im Konto oder per E-Mail, wenn sie nötig ist. Wird die Frist verpasst, kann das Konto pausiert werden. — [Google Ads Richtlinien-Hilfe 15577076](https://support.google.com/adspolicy/answer/15577076?hl=en); [Update Jan. 2025](https://support.google.com/adspolicy/answer/15576964?hl=en-GB) (Suchauszüge)
- Für Finanzdienstleistungs-Werbung in Deutschland ist eine eigene Verifizierung Pflicht (Lizenznachweis, G2). Für Beauty nicht relevant. — [Google Ads Richtlinien-Hilfe 12492484](https://support.google.com/adspolicy/answer/12492484)

### Inferences
- Für Clickculture heißt das: Die **Studio-Inhaberin hinterlegt die Zahlungsdaten selbst**, am besten im Termin mit dem Betreuer. Gibt Google eine Passkey-Aufforderung aus, muss sie den Passkey auf ihrem Handy anlegen. Danach kann es 48 Stunden dauern, bis die Abrechnung geändert werden darf. **Deshalb Konto und Abrechnung mindestens zwei Tage vor dem geplanten Start erledigen.**
- Der Betreuer sollte mit einer **Firmen-Adresse** (eigene Domain) im MCC arbeiten, nicht mit Gmail. Sonst können Verknüpfen und Einladen für ihn gesperrt sein, sobald das MCC ins Pilotprogramm fällt.
- Die Studios sollten die Werbetreibenden-Verifizierung (Ausweis bzw. Handelsregister/Gewerbeanmeldung) bereithalten, damit sie bei Aufforderung schnell reagieren können.

### Gaps
- Ob die Abrechnung bei einem vom MCC angelegten Konto schon im Assistenten verlangt wird oder erst später, ließ sich nicht klären.
- Wann die Verifizierung bei neuen deutschen Konten konkret einsetzt, ob gleich zu Beginn oder nach ersten Ausgaben, ist nicht belegt.

## 4. Conversion für eine Website-Buchung: Conversion-ID und Label ohne Tag Manager

### Takeaway
Das Ereignis-Snippet nutzt `gtag('event','conversion',{send_to:'AW-ID/LABEL'})`. Es gehört auf die Danke- bzw. Bestätigungsseite, nachdem dort zuvor das Google-Tag geladen wurde. In der neuen Oberfläche sind ID und Label oft hinter der Option „Google Tag Manager verwenden“ versteckt. Man muss dort aber nichts installieren oder senden, die Werte werden nur angezeigt. Das deckt sich mit dem Repo-Learning vom 19.11.2026.

### Cited Findings
- Format `send_to: 'AW-CONVERSION_ID/CONVERSION_LABEL'`. Das Ereignis-Snippet steht auf der Conversion-Seite, das Google-Tag muss davor geladen sein. — [Google Ads Hilfe 7548399](https://support.google.com/google-ads/answer/7548399?hl=en-GB) (Suchauszug)
- Laut Analytics Mania zeigt die Option „Google Tag Manager verwenden“ ID und Label an. Sie bleibt teilweise verborgen, bis das Basis-Tag erkannt wurde. — [Analytics Mania](https://www.analyticsmania.com/?p=20767) (Drittquelle)
- Google testet in der Conversion-Einrichtung eine direkte Option „In Google Tag Manager einrichten“. Der Ablauf kann sich deshalb je nach Konto unterscheiden. — [Search Engine Land](https://searchengineland.com/google-ads-tests-direct-google-tag-manager-integration-for-conversion-setup-474693)
- Wurde eine Conversion „über URL“ angelegt, gibt es je nach Fall unterschiedliche Folgeschritte. — [Google Ads Hilfe 12215519](https://support.google.com/google-ads/answer/12215519?hl=en-AU) (nur Titel)

### Inferences
- Für Beauty gilt das Repo-Muster unverändert: Conversion „Lead-Formular senden“ bzw. „Termin buchen“ anlegen. ID und Label holt man über „Google Tag Manager verwenden“, dort nur ablesen, nichts senden. Die Werte kommen in den Steckbrief, das Feuern geschieht nur auf `bestaetigen.html`.

### Gaps
- Die exakten deutschen Menünamen der Conversion-Einrichtung im November 2026 sind nicht bestätigt.

## 5. Häufige Blocker 2025/2026 und wie man sie vermeidet

### Takeaway
Die Hauptrisiken für neue Konten sind Sperren wegen „Umgehung von Systemen“, Abrechnungs-Sperren und Folgesperren über ein gemeinsames MCC. Dazu kommen die neuen Sicherheitshürden: Passkey, Firmen-E-Mail und Mehrparteien-Genehmigung.

### Cited Findings
- Konten mit offenen Salden, abgelehnten Zahlungen oder Zweifeln an der Zahlungsfähigkeit können gesperrt werden. Manchmal wird das Konto nur pausiert, bis die Zahlungsmethode bestätigt ist. — [Google Ads Hilfe 13704200](https://support.google.com/google-ads/answer/13704200)
- Konten, die eine E-Mail-Adresse oder Zahlungsmethode teilen **oder am selben Verwaltungskonto hängen**, können mitgesperrt werden. Google rät, erst die Sperre aufzuheben, bevor man neue Konten anlegt. — [Google Ads Hilfe 9841640](https://support.google.com/google-ads/answer/9841640?hl=en)
- „Umgehung von Systemen“ ist ein schwerer Verstoß, etwa Cloaking oder Missbrauch mehrerer Konten. Community-Berichte erwähnen neue Konten, die ohne erkennbaren Grund nach dieser Richtlinie gesperrt wurden. — [Google Ads Richtlinie 15938075](https://support.google.com/adspolicy/answer/15938075?hl=en); [Search Engine Land](https://searchengineland.com/google-ads-account-suspensions-what-advertisers-need-to-know-430538)
- Ein Community-Fall: Ein im MCC angelegtes, unbenutztes Kundenkonto wurde wegen „unbezahltem Saldo“ gesperrt, obwohl 0 $ offen waren. — [Google Groups adwords-api](https://groups.google.com/g/adwords-api/c/PMnD1kmZPdg) (Einzelfall, Ausgang unbekannt)
- Passkey ab 15.07.2026 und Firmen-Domain im Pilot, siehe Abschnitt 3. — [Google Ads Hilfe 16917887](https://support.google.com/google-ads/answer/16917887); [Google Ads Hilfe 17423445](https://support.google.com/google-ads/answer/17423445?hl=en)

### Inferences
- Vorbeugen, belegt aus den Quellen oben:
  - keine halb angelegten Test-Konten im MCC liegen lassen (unfertige Konten mit „Saldo“-Problem können über das MCC andere mitreißen),
  - keine geteilten Zahlungsmittel zwischen Studios,
  - Zielseite muss erreichbar sein und dasselbe zeigen wie die Anzeige (kein Cloaking),
  - das Testkonto vom 20.11.2026 schließen, sobald es nicht mehr gebraucht wird.
- Zur 2-Schritt-Verifizierung fand ich keine neuen 2026-Belege über den Passkey-Punkt hinaus.

### Gaps
- Es gibt keine belastbaren Zahlen, wie oft neue deutsche Kleinkonten 2026 gesperrt werden.
- Ob die Passkey-Pflicht im November 2026 für alle Konten gilt oder weiter nur für benachrichtigte, ist nicht bestätigt.
