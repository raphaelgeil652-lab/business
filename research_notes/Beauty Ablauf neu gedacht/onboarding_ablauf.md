# Client onboarding for a small lead-gen agency (local beauty studios), 2025/2026: speed, simplicity, automation

Method note (read first): 16 tool calls, all based on search-engine results. Fetching full pages failed because these hosts are blocked in this session: connexify.io, instantly.ai, dev.to and support.google.com. So most findings below come from search snippets and summaries, not from reading full articles. Nearly all agency-onboarding material online comes from vendors (Leadsie, Connexify, Instantly, Launchbay, GHL snapshot sellers), which have a commercial interest. I found no independent, peer-reviewed benchmark for agency onboarding. Day numbers should be read as common practice, not as evidence.

## 1. What to ask in the sales call vs. the post-sale form (minimal fields)

### Takeaway
No source gives an authoritative minimal field list for beauty or med-spa clients. Vendor guidance converges on four rules. Ask only what the service actually needs. Tailor the list to the service. Collect some items before signing. Clearly mark which fields are optional. Form research supports dropping the ~50-field intake: long single-step forms convert badly, and labelling fields "optional" can matter a lot.

### Cited Findings
- Asset requests should match the service: a lead-gen client needs different inputs than an SEO client. Some guides suggest asking for certain assets *before* the contract is signed, so week 1 is not spent chasing material. — [Instantly: onboarding email for different service types](https://instantly.ai/blog/client-onboarding-email-for-different-service-types-customized-approaches/) (snippet only)
- A med-spa snapshot vendor describes a short patient-side qualifier form with three fields: treatment interest, first visit or returning, best time to call. This is the end-customer form, not agency intake, but it shows the "few fields" norm in the niche. — [beauty-spa GHL snapshot guide](https://beauty-spa-ghl-snapshot.pages.dev/blog/gohighlevel-for-spas-2026-guide) (vendor)
- Agency intake tools advertise pre-filling forms and saving progress with reminders, so clients are not forced to finish in one sitting. — [Glitter guide: onboard new lead generation client](https://www.glitter.io/guides/onboard-new-lead-generation-client) (search summary)
- Form length evidence (mostly marketing blogs that recycle a few original tests):
  - A NP Digital study of 404 landing pages (Dec 2024) found single-step forms with 5+ fields convert at 8.1% or lower, and recommends splitting long forms into steps. — [Neil Patel: conversion rate by form fields](https://neilpatel.com/marketing-stats/conversion-rate-by-form-fields/)
  - Adding the word "optional" to field labels reportedly raised conversion from 42.6% to 80% in the ImageScape case. — [Medium: Do short forms really convert better?](https://medium.com/tips-and-tricks-about-online-forms/do-short-forms-really-convert-better-b74a6d78767f)
  - Reform recommends marking the optional fields rather than the required ones. — [Reform: form length optimization](https://www.reform.app/blog/form-length-optimization-best-practices)
  - Counter-evidence: cutting a form from 9 to 6 fields lowered conversions by 14.23%, and rewording the fields raised them by 19.21%. Field count is not the only source of friction. — [CXL: reduce form fields](https://conversionxl.com/reduce-form-fields/)

### Inferences
- These are inferences, not sourced facts. For a 20-minute call the clean split is:
  - **In the call (about 5–8 items):** studio name and contact person; which one treatment to advertise; that treatment's price and duration, as one line of free text; free appointment slots per week (capacity); budget agreement; who approves Meta/Google access; does a website with Impressum/Datenschutz exist (yes/no + URL).
  - **Post-sale form or email reply (everything else):** photos, logo, opening hours, address details, calendar sharing, legal texts, team data.
  - Every field is either "Pflicht" (needed to go live) or "optional". Services are captured as plain text (e.g. "Laser Achseln – 89 € – 30 Min"), not in a special format.
- The form-conversion studies concern anonymous web visitors, not paying B2B clients. They transfer only loosely: a client who has just signed is more motivated than a web visitor. The bigger issue in the failed test was call *duration* and the unclear required/optional marking, and both rules address that directly.

### Gaps
- I found no published "minimal intake field list" from a beauty or med-spa agency with outcome data. The search mostly returned Fiverr/Upwork listings.
- I found no German-language source on intake for beauty-studio clients.

## 2. Pre-call preparation: personalised demo page / mock ads with the prospect's name

### Takeaway
Personalised landing pages, demos and mock-ups are widely recommended in outbound sales. The only numbers come from vendors and are self-reported. They concern reply or demo-booking rates, not agency close rates. There is no evidence specific to spec ads for local beauty studios.

### Cited Findings
- Reply.io reports that personalising both the outreach and the landing page (first name, company and similar variables) produced "45% additional demos". The figure is self-reported with no baseline given. — [Reply.io: Personalized outreach at scale, part 1](https://reply.io/outreach-at-scale-part-1/)
- Clay describes a "personalized demo play" that includes a custom mockup built from the prospect's branding and website. It gives no conversion numbers. — [Clay: personalized demo play](https://clay.com/blog/personalized-demo-play)
- Supademo recommends building one demo with name, company and image variables, then generating one link per prospect. — [Supademo: personalized outbound demos at scale](https://supademo.com/blog/personalized-outbound-demos-at-scale)
- An outbound leader in a G2 interview says that moving from ~50% to 60–70% personalisation roughly doubled the response rate. — [G2 interview, Sept 2025](https://learn.g2.com/interview-latane-conant-mass-outreach)
- A founder notes that once outbound runs at volume, the prospect research itself becomes the bottleneck. — [Indie Hackers post](https://www.indiehackers.com/post/we-stopped-sending-people-to-our-homepage-our-cold-outreach-open-rate-jumped-to-89-d0463d1606)

### Inferences
- The research-bottleneck point argues for *templated* personalisation: one script fills studio name, treatment, logo and photo into the existing landing-page and ad templates. Hand-made mock-ups do not scale. A demo built this way can become the client's real page after signing, so it saves onboarding time twice.
- These are inferences for Germany. Mock ads that use a real studio's name or logo should be shown privately in the meeting, not published. And no health or treatment claims should be made that would breach HWG.

### Gaps
- I found no independent study of agency close rates with spec work versus without it.

## 3. A blocker-free sequence (contract → … → campaigns), and call vs. written guides for access

### Takeaway
Sources agree that access is the main bottleneck, and that most onboarding tasks wait on the client. Measurement should be checked before launch. For Google Ads the documented fix is to create the account without a campaign: in Expert Mode, or as a client account created under the agency's manager (MCC) account. The campaign, and with it the final URL, then comes only after the landing page is live. A Google ad whose final URL is not a working page will be flagged or disapproved.

### Cited Findings
- Client-side waiting dominates. An analysis of 16,000+ onboarding tasks found 85.2% were assigned to the client. — [Launchbay: client onboarding statistics, Sept 2025](https://launchbay.com/blog/client-onboarding-statistics) (vendor)
- For most agencies the bottleneck is "platform access and repetitive data entry". — [Connexify](https://www.connexify.io/blog/how-digital-marketing-agencies-streamline-client-onboarding) (snippet; page not fetchable)
- The contact person often lacks the admin role needed to grant access, which forces extra internal routing. — [Saas Hero](https://www.saashero.net/?p=23684)
- Connecting ad accounts is the most common friction point, especially for Meta. Typical reasons: the client has no Business Manager yet, or there are ad account restrictions or billing problems. — [Connexify: ad agency Facebook workflow](https://www.connexify.io/blog/ad-agency-facebook-workflow-from-contract-to-launch) (snippet)
- Measurement before launch: one agency will not launch until measurement is verified. Its target is verified access the same day, measurement ready within 24–48 h, and launch around days 4–7. — [Connexify, same](https://www.connexify.io/blog/ad-agency-facebook-workflow-from-contract-to-launch) (snippet)
- How Meta partner access works:
  - The agency sends the request from Business Settings → Partners → "Ask a partner to share their assets".
  - The client approves under "Requests" and can approve, modify or deny.
  - The approver needs Admin or Full Control rights on the asset.
  - The request must go to the portfolio that owns the asset.
  - If nobody has sufficient access (for example, the portfolio was created by a former employee), a partner request cannot fix it.
  - Alternative: the client assigns the agency directly using the agency's Business ID.
  — [Leadsie: request Facebook ad account access](https://leadsie.com/blog/request-facebook-ad-account-access); [Leadsie: Meta business portfolio access](https://www.leadsie.com/blog/request-access-meta-business-portfolio); [Meta developer docs: business-to-business](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/business-to-business)
- Meta will not let a campaign leave draft without a payment method on the ad account. A clinic guide also covers the Page category ("Medical spa"), the ad account time zone and currency. — [Dermis app: Meta Ads preliminary setup guide](https://intercom.help/dermisapp/en/articles/15868244-meta-ads-preliminary-setup-guide)
- Google Ads without a website up front:
  - New accounts start in Smart Mode. On the "New campaign" page you can click "Switch to Expert Mode", then "Create an account without a campaign", then confirm billing country, time zone and currency. — [Google Ads Help 6366720](https://support.google.com/adwords/answer/6366720?hl=en-AU) (via search summary)
  - In manager (MCC) accounts, the "create account without a campaign" option was described as limited to advertisers with more than $1,000 spend in good standing. — same search result (unverified; the page could not be fetched)
  - Client accounts can also be created from inside the manager account. — [Google Ads Help 7518900](https://support.google.com/google-ads/answer/7518900?hl=en) (not fetched)
  - Third-party guides note that Google still pushes users toward creating a campaign and that the link placement varies. — [graphed.com](https://graphed.com/blog/how-to-create-a-google-ad-account-without-a-campaign)
- The final URL is required for ads. — [Google Ads Help: Final URL](https://support.google.com/google-ads/answer/6080568)
- Google's landing-page test reports "Page not found" for dead pages, and "Destination not working" disapprovals are tied to landing-page problems. — [Google Ads Help: Test your landing page](https://support.google.com/google-ads/answer/6328603?hl=en)
- A kickoff call is still recommended even when most onboarding tasks are automated. — [Glitter guide](https://www.glitter.io/guides/onboard-new-lead-generation-client) (search summary)

### Inferences
- The repo's own notes (CLAUDE.md, 19.11.2026) say the Google client account was created *under the manager account*, which matches the documented route. The blocker in the test came from opening the self-serve Smart Mode wizard instead.
- Recommended order:
  1. Contract accepted (email).
  2. Agency publishes the landing page **immediately**, using the studio's name, its one treatment and placeholder photos, on `<kürzel>.netlify.app`, unindexed. The URL then exists from day 0.
  3. Access requests go out the same day: Meta partner request from the agency side; Google client account created by the agency under the MCC. The client only accepts. The repo already does this for Google.
  4. Client delivers photos, calendar sharing, Impressum/Datenschutz link.
  5. Tracking test on the confirmation page.
  6. Campaigns.
  - The Meta payment method and admin role are the two client-side items that most often stall things. Check both in the call: "Who is admin of your Facebook page? Is a card on file?"
- Call vs. guide: the sources do not settle this. The observed pattern is a short kickoff call plus written click-by-click guides, with the agency doing everything it can from its own side. A 15-minute screen-share is most useful for the Meta approval step, where the client must find "Requests". This is an inference.
- Whether a placeholder page at a live URL would pass Google review is unconfirmed. Ads go live only after real content and legal links are in place anyway.

### Gaps
- I could not confirm the current (Nov 2026) MCC restrictions or wording on support.google.com, because the host is blocked.
- I found no source testing "landing page live with placeholders before assets" as a practice. It is a logical consequence of the final-URL requirement, not an evidenced best practice.

## 4. Automated onboarding emails: timing and content

### Takeaway
Common practice is front-loaded:
- welcome email within minutes (up to 2 h) of signing, during business hours
- reminder for outstanding items around day 3
- escalation or kickoff confirmation around day 5
- technical or setup check around day 7
- after that: "you're live" and first-week check-in emails

Event-triggered reminders, sent when a specific item is still missing, are recommended over pure calendar schedules. All of this comes from vendor blogs and should be treated as convention.

### Cited Findings
- Send 4–6 emails over 7–14 days, starting within minutes of signup during weekday hours. — [Instantly: client onboarding email timing](https://instantly.ai/blog/client-onboarding-email-timing/) (snippet only)
- Send the handoff confirmation within 2 h of signing, and a fuller welcome package the same day or the next morning. — [Instantly: complete onboarding email workflow](https://instantly.ai/blog/the-complete-client-onboarding-email-workflow-welcome-through-30-day-review/) (snippet)
- A typical sequence (snippet only):
  - Day 1: welcome email with asset request and team introduction
  - Day 3: automated reminder for outstanding assets
  - Day 5: kickoff confirmation, or escalation if assets are missing
  - Day 7: technical setup confirmation
  — [Instantly / dev.to "7 emails in week 1"](https://dev.to/lisasakura/new-client-onboarding-email-sequence-7-emails-every-agency-should-send-in-week-1-copy-paste-300f)
- Event-triggered alternative: send a reminder a few hours after a pending task is created, rather than "on day 3". A 24-hour nudge if the onboarding link has not been completed also appears in one template. — [search summary of Instantly / Moxo pages](https://www.moxo.com/blog/master-onboarding-emails)
- Sending onboarding emails outside business hours is listed as a common, avoidable mistake. — [Instantly: onboarding email mistakes](https://instantly.ai/blog/client-onboarding-email-mistakes-what-not-to-do/) (snippet)
- Zapier offers a ready-made "two-day onboarding reminder email and SMS" automation, which shows that 48 h reminders are a standard pattern. — [Zapier](https://zapier.com/automations/customer-service-success/customer-onboarding/onboarding-workflow-management/send-two-day-onboarding-reminder-email-and-sms-to-clients)
- One GHL agency flow: welcome email with form link → answers feed the CRM → snapshot loads → pipeline stage changes → kickoff call booked through the calendar. The vendor claims onboarding finishes in under 72 h. — [NetPartners: automating client onboarding with GoHighLevel](https://netpartners.marketing/automating-client-onboarding-with-gohighlevel-scale-agencies-without-the-chaos/)
- A dedicated email template for clients who go silent in week 1 is also a recognised pattern. — [dev.to: when a new client goes silent](https://dev.to/lisasakura/agency-owners-what-do-you-do-when-a-new-client-goes-silent-in-week-one-1oem)

### Inferences
Suggested sequence for this agency, mapped onto the existing Apps-Script "Zentrale" (inference):

| # | Trigger | Email |
|---|---|---|
| E1 | Contract accepted | Welcome email: contract PDF attached, landing-page preview link, *only* the open required items, each with a 1-click guide. |
| E2 | +48 h, a required item still open | Reminder listing only what is missing (Meta request, photos, calendar sharing, legal link). |
| E3 | +5 days, still open | Personal note from the assigned Betreuer and an offer of a 15-min screen-share. |
| E4 | All required items done + tracking test passed | "You're live" email: what happens now, how bookings arrive, the confirm/no-show buttons. |
| E5 | Live +7 days | First-week check-in: booked appointments, show-up rate, open questions. |

- Send only on weekdays during business hours.
- Each email should be generated from a status column per item, not from a fixed calendar.

### Gaps
- I found no evidence-based optimum for reminder intervals. 48–72 h is convention.
- I could not read the full text of the Instantly or dev.to templates because the hosts are blocked.

## 5. Automation with free tools (Sheets + Apps Script: PDF, email, Drive) and German contract form

### Takeaway
Apps Script can render an HTML template to PDF, save it into a Drive folder it creates, and email it as an attachment. Google publishes an official sample for the Drive and Gmail parts. The binding limit is the email quota: 100 recipients/day for a free Google account, and 1,500/day for Workspace only after a payment and age threshold.

On the legal side, a B2B service or agency contract in Germany has no statutory form requirement. Acceptance by email (text form) is valid; proving it is the weak point. The data processing agreement (AVV, Art. 28(9) GDPR) only needs an "electronic format". The Bavarian supervisory authority accepts electronic documentation, but whether a plain email is enough is debated.

### Cited Findings
- Google's official sample "Generate & send PDFs from Google Sheets" uses the Drive service to create a folder for the exported PDFs and the Gmail service to send them as attachments. — [Google Developers: generate-pdfs](https://developers.google.com/apps-script/samples/automations/generate-pdfs) ([German version](https://developers.google.com/apps-script/samples/automations/generate-pdfs?hl=de))
- An HTML string can be turned into a PDF blob with Apps Script's Utilities service and sent as an attachment. Saving into specific Drive folders needs the broader Drive scope. — [Labnol: convert HTML to PDF with Google Script](https://labnol.org/code/19960-convert-html-to-pdf)
- Older forum reports describe rendering problems in the HTML→PDF conversion. The thread looks dated, so treat it as a possible pitfall: test CSS such as fonts and page breaks. — [Google Groups thread](https://groups.google.com/g/google-apps-script-community/c/V3HckDT0kUw)
- Apps Script email quotas:
  - MailApp recipients per day: 100 for consumer accounts, 1,500 for Workspace. — [Apps Script quotas](https://developers.google.com/apps-script/guides/services/quotas)
  - CC/BCC recipients count towards the quota. — [Zenn guide](https://zenn.dev/gas/articles/7b8bf039ff0186)
  - The Workspace increase applies only after $100 cumulative payment plus 60 days. — same Zenn guide
  - Workspace Individual reportedly gets no increase (user report). — [Google Developer forum](https://discuss.google.dev/t/apps-script-email-sending-limits/323469)
  - `MailApp.getRemainingDailyQuota()` shows the remaining quota. — [Apps Script quotas](https://developers.google.com/apps-script/guides/services/quotas)
- German contract form:
  - German contract law starts from freedom of form. A contract comes about through offer and acceptance, also by email or online form. — [IHK Rhein-Neckar: Vertragsschluss im digitalen Raum](https://www.ihk.de/rhein-neckar/recht/datenschutz-itrecht-internetrecht/it-sicherheit/vertragsschluss-im-digitalen-raum-6778488); [Verbraucherzentrale](https://www.verbraucherzentrale.de/wissen/vertraege-reklamation/kundenrechte/vertraege-schliessen-per-email-und-co-24642)
  - A plain email satisfies text form (§ 126b BGB) but not written form (§ 126 BGB). Written form can be replaced only by a qualified electronic signature (§ 126a BGB). — [IT-Recht Kanzlei: gesetzliche Schriftform](https://www.it-recht-kanzlei.de/gesetzliche-schriftform.html)
  - A typed name at the end of an email, a click on "accept" or a scanned signature count as a *simple* electronic signature (eIDAS). Simple and advanced signatures carry no special evidentiary privilege. A qualified signature creates prima-facie evidence of authenticity under the ZPO. — [Docusign: Rechtsgültigkeit](https://www.docusign.com/de-de/produkte/elektronische-signatur/rechtsgultigkeit); [IHK Rhein-Neckar](https://www.ihk.de/rhein-neckar/recht/datenschutz-itrecht-internetrecht/it-sicherheit/vertragsschluss-im-digitalen-raum-6778488)
  - Single emails have low evidentiary weight, but a consistent email exchange can be presented in court. — [drweb.de: Vertrag per E-Mail](https://www.drweb.de/vertrag-e-mail/); [test.de: Verträge per E-Mail](https://www.test.de/Vertraege-per-E-Mail-Formsache-23123-0/)
  - Consumer-protection information duties (Fernabsatz) do not apply to pure B2B contracts. — [Verbraucherzentrale](https://www.verbraucherzentrale.de/wissen/vertraege-reklamation/kundenrechte/vertraege-schliessen-per-email-email-fax-sms-oder-messenger-das-sollten-sie-wissen-24642)
- AVV (data processing agreement):
  - Art. 28(9) GDPR: the contract must be in writing, "which may also be in an electronic format". — [BayLDA FAQ ADV Formerfordernis](https://www.lda.bayern.de/media/veroeffentlichungen/FAQ_ADV_Formerfordernis.pdf)
  - Opinions differ on whether plain email or a scan is enough. The trend leans towards text form being sufficient. — [Dr. Datenschutz: AVV online abschließen](https://www.dr-datenschutz.de/avv-online-abschliessen-elektronische-signatur-erforderlich/)
  - The Berlin authority's checklist lists sending the complete AVV by email as a checkpoint. — [BlnBDI Checkliste AVV](https://www.datenschutz-berlin.de/fileadmin/user_upload/pdf/dokumente/2022-BlnBDI_Checkliste-Pruefung-AVV_v1.0.pdf)

### Inferences
- A practical German B2B flow (inference; have a lawyer check it):
  1. Apps Script fills the contract and AVV from the sheet and renders a PDF.
  2. It emails the PDFs with a clear sentence: "Bitte antworten Sie mit ‚Ich nehme das Angebot an' oder klicken Sie auf [Annehmen]".
  3. The acceptance click is logged in the sheet with timestamp, email address and a document hash. The reply email is archived in the Drive folder.
  4. That gives text form plus a documented email exchange. A paid e-signature tool adds little legal value for this contract type unless the contract itself contains a written-form clause. In that case, drop or adjust the clause.
- The agency's own contract template must not demand "Schriftform" for its own conclusion, or email acceptance becomes inconsistent with it.
- Quota: each studio already consumes Zentrale mails for bookings. The repo notes ~100 mails/day on a free account. Onboarding emails are few (about 5 per client), so they fit. Bookings are what push towards Workspace.
- Invoices: a §14 UStG invoice can be sent electronically. Note that B2B e-invoicing (XRechnung/ZUGFeRD) has been mandatory to *receive* since 1.1.2025 in Germany, and becomes mandatory to *issue* in stages (2027/2028 depending on revenue). A plain HTML→PDF invoice may only be acceptable during the transition. This is not researched in this session and comes from prior knowledge; it needs verification.

### Gaps
- No court decision found specifically on accepting an agency contract by email. Only general guidance.
- E-invoice obligations were not researched here; flagged for verification.
- I did not verify the current Apps Script HTML→PDF rendering quality (2026).

## 6. Time-to-live benchmarks, common failure points, one-page checklists vs. manuals

### Takeaway
Reported times range from under 72 h (GHL vendor claims) and 5–7 days to ads live (Meta-focused agencies), up to 10–15 business days (ClickUp) and 4–6 weeks to first campaigns (B2B agency Saas Hero). All are vendor statements without methodology.

Failure points repeat across sources: access and admin rights, missing Business Manager, payment method, assets, and measurement not verified. Checklists have strong evidence from medicine (Haynes 2009) for complex procedures with handoffs. Their transfer to agency onboarding is an analogy, not tested.

### Cited Findings
- Time-to-live figures:
  - "Ads live in 5–7 days instead of 21–30 days" after a 45–60 min onboarding call — an agency marketing claim. — [search result set: Meta onboarding](https://www.connexify.io/blog/how-facebook-advertising-agencies-cut-onboarding-time)
  - Target of 24–72 h from signature to verified platform access. — [Connexify](https://www.connexify.io/blog/social-media-advertising-agencies-how-they-onboard) (snippet)
  - 10–15 business days for a typical engagement; simple retainers about 5 days. — [ClickUp: agency client onboarding workflow](https://clickup.com/learn/?p=70736)
  - First campaigns usually launch in weeks 4–6 when onboarding runs smoothly (B2B SaaS agency). — [Saas Hero](https://www.saashero.net/?p=23684)
  - Social-media (content) onboarding takes 3–4 weeks. — [PostPlanify checklist](https://postplanify.com/blog/social-media-agency-client-onboarding-checklist)
  - GHL med-spa snapshots install within 24 h to a few business days once access exists (vendor claims). — [beauty-spa snapshot guide](https://beauty-spa-ghl-snapshot.pages.dev/blog/gohighlevel-for-spas-2026-guide)
- Survey citation (secondhand, not verified): an AgencyAnalytics 2024 survey of 251 agencies found nearly half struggle to allocate billable time, partly because onboarding is manual. — [Wayfront](https://wayfront.com/blog/customer-onboarding-automation)
- Failure points: see section 3 (admin role, owning portfolio, missing BM, billing, payment method, measurement), plus Meta's restricted rules for health or aesthetics categories, mentioned as a consideration. — [Leadsie](https://leadsie.com/blog/request-facebook-ad-account-access); [Dermis](https://intercom.help/dermisapp/en/articles/15868244-meta-ads-preliminary-setup-guide)
- Checklist evidence: a 19-item WHO surgical checklist in 8 hospitals was associated with deaths falling from 1.5% to 0.8% and complications from 11.0% to 7.0%. The design was before/after, not randomised. It is structured at three handoff points (sign in, time out, sign out). — [Haynes et al., NEJM 2009 (PubMed)](https://pubmed.ncbi.nlm.nih.gov/19144931/); [Harvard Gazette](https://news.harvard.edu/gazette/story/2009/01/surgical-safety-checklist-drops-deaths-and-complications-by-more-than-one-third/)

### Inferences
- A realistic target for this agency: **day 0 (call) to ads live in 3–5 working days**. This is possible because:
  - the landing page is template-generated
  - the Google account is created by the agency in the MCC
  - Meta needs only one client approval plus a payment method
  - the biggest remaining variables are photos and the studio's calendar sharing
  - the repo's existing Netlify, Zentrale and templates already remove most build time
- Format: use **one one-page checklist per role** (Betreuer · Technik · Studio), split at the handoff points the way the WHO checklist is. Long manuals stay as reference only, linked from each checklist line. The failed test showed that volume of material, not its absence, was the problem.
- Typical local-client failure modes and fixes (inferred from the sources above plus the repo's own test):

| Failure | Fix |
|---|---|
| Owner does not know who is Meta page admin | Ask in the call; screen-share if needed |
| No payment method | Ask in the call; client adds a card during the call |
| Assets never arrive | Placeholders are live from day 0; 48 h reminder lists only the missing items |
| Calendar sharing unclear | Wunschtermin mode as a fallback so launch is not blocked |
| Legal links missing | This is a hard gate: no ads without Impressum/Datenschutz |

### Gaps
- No independent time-to-live benchmark for local-service lead-gen agencies exists in the sources found.
- No study compares checklists with manuals specifically for agency onboarding.
- No German beauty-agency sources found. Blocked hosts prevented deeper reading of Connexify/Instantly.
