#!/usr/bin/env python3
"""Baut die drei Verlosungs-Landingpages (modul / rabatt / speicher) für einen PV-Kunden.

Normalerweise ruft kunde-anlegen.py das auf. Einzeln:
         python3 nischen/photovoltaik/vorlagen/werkzeuge/landingpages-bauen.py <kunde>/landingpage
Liest:   <ordner>/aktionen.json   (Name, Telefon, Datum, Speichergröße …)
Schreibt: <ordner>/modul.html, rabatt.html, speicher.html

Gleicher Stil wie die Anzeigen (anzeigen/verlosungen.html): Solardach-Foto, Angebot groß,
eine Schrift (Inter Tight, selbst gehostet), keine Verläufe, kein Glow.
Pixel lädt erst nach Zustimmung, keine Google Fonts.
"""
import json
import pathlib
import sys

VARIANTEN = {
    "modul": {
        "form": "verlosung-modul",
        "foto": "foto-1.jpg", "foto_pos": "58% 32%", "foto_size": "cover",
        "bg": "#F3EFE7", "ink": "#1A1917", "muted": "#6B665D", "surface": "#FFFFFF",
        "line": "#DDD6C9", "accent": "#B4461F", "accent_ink": "#FFFFFF",
        "title": "Gewinnen Sie ein Solarmodul",
        "kicker": "Gewinnspiel bis {datum}",
        "h1": "Gewinnen Sie ein <em>Solarmodul.</em>",
        "sub": "Unter allen Anfragen bis {datum} verlosen wir ein kostenloses Modul. Mitmachen dauert 30 Sekunden.",
        "gewinn": "ein kostenloses Solarmodul",
        "schritt3": "Am {ziehung} ziehen wir den Gewinner und benachrichtigen ihn per Telefon oder E-Mail.",
        "einloesen": "Das Modul wird bei einer Solaranlage von {betrieb} mit eingebaut oder als Erweiterung montiert.",
        "faq_extra": [],
    },
    "rabatt": {
        "form": "verlosung-rabatt",
        "foto": "foto-2.jpg", "foto_pos": "20% 0%", "foto_size": "auto 150%",
        "bg": "#151515", "ink": "#F3F1EC", "muted": "#9B978F", "surface": "#222120",
        "line": "#34322F", "accent": "#F0C24B", "accent_ink": "#151515",
        "title": "20 % Rabatt gewinnen",
        "kicker": "Verlosung bis {datum}",
        "h1": "<em>20 % Rabatt</em> gewinnen.",
        "sub": "Wir verlosen 3 × 20 % Rabatt auf die erste Bestellung Ihrer Solaranlage. Mitmachen dauert 30 Sekunden.",
        "gewinn": "20 % Rabatt auf die erste Bestellung einer Solaranlage (3 Gewinner)",
        "schritt3": "Am {ziehung} ziehen wir 3 Gewinner. Der Rabatt gilt auf den Angebotspreis Ihrer ersten Bestellung.",
        "einloesen": "Der Rabatt wird vom Angebotspreis der ersten Bestellung abgezogen. Eine Barauszahlung ist nicht möglich.",
        "faq_extra": [("Wie wird der Rabatt eingelöst?",
                       "Gewinnen Sie, ziehen wir 20 % vom Angebotspreis Ihrer ersten Bestellung ab. Sie müssen nicht bestellen, um teilzunehmen. Der Gewinn gilt aber nur zusammen mit einer Bestellung.")],
    },
    "speicher": {
        "form": "verlosung-speicher",
        "foto": "foto-3.jpg", "foto_pos": "42% 18%", "foto_size": "cover",
        "bg": "#ECEAE4", "ink": "#1A1917", "muted": "#6B665D", "surface": "#FFFFFF",
        "line": "#D6D2C8", "accent": "#2F6B4F", "accent_ink": "#FFFFFF",
        "title": "3 Stromspeicher zu gewinnen",
        "kicker": "Verlosung bis {datum}",
        "h1": "3 Stromspeicher <em>zu gewinnen.</em>",
        "sub": "Unter allen Anfragen verlosen wir 3 Speicher gratis zu Ihrer ersten Bestellung. Mitmachen dauert 30 Sekunden.",
        "gewinn": "ein Stromspeicher ({speicher}) gratis zur ersten Bestellung einer Solaranlage (3 Gewinner)",
        "schritt3": "Am {ziehung} ziehen wir 3 Gewinner. Der Speicher wird zusammen mit Ihrer ersten Bestellung kostenlos eingebaut.",
        "einloesen": "Der Speicher ({speicher}) wird mit der ersten Bestellung einer Solaranlage kostenlos geliefert und montiert. Eine Barauszahlung ist nicht möglich.",
        "faq_extra": [("Wie bekomme ich den Speicher?",
                       "Gewinnen Sie, bauen wir den Speicher ({speicher}) mit Ihrer ersten Solaranlage kostenlos ein. Sie müssen nicht bestellen, um teilzunehmen. Der Gewinn gilt aber nur zusammen mit einer Bestellung.")],
    },
}

SEITE = r"""<!--
  LANDINGPAGE · {title} · {betrieb}
  ERZEUGT von vorlagen/werkzeuge/kunde-anlegen.py (Steckbrief) — nicht von Hand ändern.
  Teilnahmebedingungen sind ein ENTWURF: vor dem Livegang rechtlich prüfen lassen.
-->
<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title} · {betrieb}</title>
<meta name="description" content="{title}: Verlosung bis {datum}. Mit Ihrer Anfrage nehmen Sie teil.">
<meta name="robots" content="noindex">
<style>
  @font-face{{font-family:"Inter Tight";src:url(fonts/inter-tight-latin-500-normal.woff2) format("woff2");font-weight:500;font-display:swap;}}
  @font-face{{font-family:"Inter Tight";src:url(fonts/inter-tight-latin-600-normal.woff2) format("woff2");font-weight:600;font-display:swap;}}
  @font-face{{font-family:"Inter Tight";src:url(fonts/inter-tight-latin-700-normal.woff2) format("woff2");font-weight:700;font-display:swap;}}
  @font-face{{font-family:"Inter Tight";src:url(fonts/inter-tight-latin-800-normal.woff2) format("woff2");font-weight:800;font-display:swap;}}
  :root{{--bg:{bg};--ink:{ink};--muted:{muted};--surface:{surface};--line:{line};--accent:{accent};--accent-ink:{accent_ink};
        --sans:"Inter Tight",-apple-system,"Segoe UI",Roboto,Arial,sans-serif;}}
  *{{box-sizing:border-box;}}
  html{{scroll-behavior:smooth;}}
  body{{margin:0;background:var(--bg);color:var(--ink);font-family:var(--sans);font-weight:500;line-height:1.55;-webkit-font-smoothing:antialiased;}}
  h1,h2{{margin:0;letter-spacing:-.03em;line-height:1.02;text-wrap:balance;}}
  p{{margin:0;text-wrap:pretty;}}
  em{{font-style:normal;color:var(--accent);}}
  a{{color:inherit;}}
  .wrap{{max-width:600px;margin:0 auto;padding:0 22px;}}

  .top{{display:flex;justify-content:space-between;align-items:center;padding:16px 0;font-weight:700;letter-spacing:-.01em;}}
  .top a{{text-decoration:none;color:var(--accent);font-size:.92rem;}}
  .photo{{width:100%;aspect-ratio:16/10;background:url(fotos/{foto}) {foto_pos}/{foto_size} no-repeat;}}
  .hero{{padding:28px 0 8px;}}
  .kicker{{font-size:.78rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--accent);}}
  .hero h1{{font-size:clamp(2.3rem,10vw,3.2rem);font-weight:800;margin-top:10px;}}
  .hero .sub{{font-size:1.1rem;margin-top:14px;}}
  .facts{{font-size:.9rem;color:var(--muted);margin-top:12px;}}

  .card{{background:#FFFFFF;color:#1A1917;border-radius:6px;padding:22px 20px;margin:24px 0 8px;border:1px solid var(--line);}}
  .card h2{{font-size:1.45rem;font-weight:800;}}
  .card .hint{{font-size:.92rem;color:#5E5A52;margin-top:6px;}}
  form{{display:grid;gap:12px;margin-top:16px;}}
  label{{font-size:.82rem;font-weight:700;}}
  input,select{{display:block;width:100%;margin-top:5px;padding:13px 12px;border:1.5px solid #D9D4CA;border-radius:4px;font:inherit;font-size:1rem;background:#fff;color:#1A1917;}}
  input:focus,select:focus{{outline:2px solid var(--accent);border-color:transparent;}}
  .row{{display:grid;grid-template-columns:1fr 1fr;gap:12px;}}
  .check{{display:flex;gap:10px;align-items:flex-start;font-weight:500;font-size:.86rem;color:#3A3732;}}
  .check input{{width:20px;height:20px;margin:2px 0 0;flex:0 0 auto;}}
  .hp{{position:absolute;left:-9999px;}}
  button,.btn{{display:block;width:100%;border:0;border-radius:4px;background:var(--accent);color:var(--accent-ink);font:inherit;font-weight:700;
              font-size:1.08rem;padding:16px;cursor:pointer;text-align:center;text-decoration:none;}}
  .note{{font-size:.8rem;color:#6B665D;margin-top:10px;text-align:center;}}

  section{{padding:36px 0;border-top:1px solid var(--line);}}
  section h2{{font-size:1.7rem;font-weight:800;margin-bottom:16px;}}
  ol.steps{{list-style:none;counter-reset:s;margin:0;padding:0;display:grid;gap:16px;}}
  ol.steps li{{counter-increment:s;position:relative;padding-left:46px;}}
  ol.steps li::before{{content:counter(s);position:absolute;left:0;top:0;width:32px;height:32px;border-radius:4px;background:var(--accent);
                       color:var(--accent-ink);display:grid;place-items:center;font-weight:800;}}
  ol.steps b{{display:block;}}
  ol.steps span{{color:var(--muted);font-size:.95rem;}}
  ul.list{{margin:0;padding:0;list-style:none;display:grid;gap:10px;}}
  ul.list li{{padding-left:22px;position:relative;}}
  ul.list li::before{{content:"";position:absolute;left:0;top:.62em;width:10px;height:2px;background:var(--accent);}}
  .tiles{{display:grid;grid-template-columns:1fr 1fr;gap:10px;}}
  .tiles figure{{margin:0;}}
  .tiles img{{display:block;width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:4px;}}
  .tiles figcaption{{font-size:.8rem;color:var(--muted);margin-top:6px;}}
  .review{{border-left:3px solid var(--accent);padding:4px 0 4px 14px;margin:0 0 16px;font-size:.98rem;}}
  details{{border-bottom:1px solid var(--line);padding:14px 0;}}
  summary{{cursor:pointer;font-weight:700;list-style:none;display:flex;justify-content:space-between;gap:12px;}}
  summary::after{{content:"+";color:var(--accent);font-weight:800;}}
  details[open] summary::after{{content:"−";}}
  details p{{color:var(--muted);margin-top:8px;font-size:.95rem;}}
  .tnb{{font-size:.86rem;color:var(--muted);}}
  .tnb p{{margin-bottom:8px;}}
  .tnb b{{color:var(--ink);}}
  .draft{{font-size:.78rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--accent);margin-bottom:10px;}}
  .final{{text-align:center;}}
  .final p{{color:var(--muted);margin:0 0 18px;}}
  footer{{border-top:1px solid var(--line);padding:22px 0 110px;text-align:center;font-size:.84rem;color:var(--muted);line-height:1.8;}}
  .linkbtn{{background:none;border:0;padding:0;font:inherit;color:inherit;text-decoration:underline;cursor:pointer;width:auto;display:inline;}}

  .sticky{{position:fixed;left:0;right:0;bottom:0;z-index:50;background:var(--bg);border-top:1px solid var(--line);
           padding:10px 22px calc(10px + env(safe-area-inset-bottom));}}
  .sticky .btn{{max-width:600px;margin:0 auto;}}
  @media (min-width:720px){{.sticky{{display:none;}} footer{{padding-bottom:24px;}}}}
  .consent{{position:fixed;left:0;right:0;bottom:0;z-index:60;background:var(--surface);color:var(--ink);border-top:1px solid var(--line);
            padding:16px 22px calc(16px + env(safe-area-inset-bottom));display:none;}}
  .consent.show{{display:block;}}
  .consent p{{max-width:600px;margin:0 auto 12px;font-size:.86rem;color:var(--muted);}}
  .consent .row{{max-width:600px;margin:0 auto;}}
  .consent .ghost{{background:transparent;color:var(--ink);border:1.5px solid var(--line);}}
</style>
</head>
<body>

<div class="wrap"><div class="top"><span>{betrieb}</span><a href="tel:{telefon_link}">{telefon}</a></div></div>
<div class="photo" role="img" aria-label="Wohnhaus mit Solaranlage auf dem Dach"></div>

<div class="wrap">
  <header class="hero">
    <p class="kicker">{kicker}</p>
    <h1>{h1}</h1>
    <p class="sub">{sub}</p>
    <p class="facts">{betrieb} · Fachbetrieb in Ihrer Region{team_zusatz}</p>
  </header>

  <div class="card" id="teilnehmen">
    <h2>Jetzt teilnehmen</h2>
    <p class="hint">30 Sekunden. Mit Ihrer Anfrage sind Sie automatisch in der Verlosung.</p>
    <form name="{form}" method="POST" data-netlify="true" netlify-honeypot="bot-field" action="danke.html">
      <input type="hidden" name="form-name" value="{form}">
      <input type="hidden" name="aktion" value="{form}">
      <p class="hp"><label>Bitte leer lassen <input name="bot-field"></label></p>
      <label>Name <input type="text" name="name" required autocomplete="name" placeholder="Ihr Name"></label>
      <div class="row">
        <label>Telefon <input type="tel" name="telefon" required autocomplete="tel" placeholder="Für Rückruf"></label>
        <label>Postleitzahl <input type="text" name="plz" required inputmode="numeric" pattern="[0-9]{{5}}" maxlength="5" autocomplete="postal-code" placeholder="Ihre PLZ"></label>
      </div>
      <label>Sind Sie Eigentümer des Hauses?
        <select name="eigentuemer" required>
          <option value="">Bitte wählen …</option>
          <option>Ja, Einfamilienhaus</option>
          <option>Ja, Zwei- oder Mehrfamilienhaus</option>
          <option>Nein, ich bin Mieter</option>
        </select>
      </label>
      <label>E-Mail (optional) <input type="email" name="email" autocomplete="email" placeholder="ihre@email.de"></label>
      <label class="check"><input type="checkbox" name="bedingungen" required> <span>Ich akzeptiere die <a href="#bedingungen">Teilnahmebedingungen</a>. Die Teilnahme ist kostenlos und an keinen Kauf gebunden.</span></label>
      <input type="hidden" name="fbclid" id="f_fbclid"><input type="hidden" name="gclid" id="f_gclid">
      <input type="hidden" name="utm_source" id="f_utm_source"><input type="hidden" name="utm_campaign" id="f_utm_campaign">
      <button type="submit">Jetzt teilnehmen</button>
    </form>
    <p class="note">Kostenlos und unverbindlich.</p>
  </div>
</div>

<div class="wrap">
  <section>
    <h2>So läuft's</h2>
    <ol class="steps">
      <li><b>Anfrage schicken</b><span>Formular ausfüllen. Damit nehmen Sie an der Verlosung teil.</span></li>
      <li><b>Wir rufen Sie an</b><span>Werktags innerhalb einer Stunde. Auf Wunsch erstellen wir Ihnen ein Festpreis-Angebot für Ihre Solaranlage.</span></li>
      <li><b>Ziehung</b><span>{schritt3}</span></li>
    </ol>
  </section>

  {vorher_nachher_html}

  <section>
    <h2>Alles aus einer Hand</h2>
    <ul class="list">
      <li>Planung mit Speicher, passend zu Ihrem Verbrauch</li>
      {team_li}
      <li>Anmeldung beim Netzbetreiber und Inbetriebnahme</li>
      <li>Festpreis, bevor Sie sich entscheiden</li>
    </ul>
  </section>

  {bewertungen_html}

  <section>
    <h2>Häufige Fragen</h2>
    <details><summary>Muss ich etwas kaufen, um teilzunehmen?</summary><p>Nein. Die Teilnahme ist kostenlos. Sie schicken das Formular ab, das ist alles.</p></details>
    {faq_extra}
    <details><summary>Wann wird gezogen?</summary><p>Teilnahmeschluss ist der {datum}. Gezogen wird am {ziehung}. Gewinner benachrichtigen wir per Telefon oder E-Mail.</p></details>
    <details><summary>Was passiert nach meiner Anfrage?</summary><p>Wir rufen Sie an. Wenn Sie möchten, planen wir Ihre Anlage passend zu Ihrem Verbrauch und nennen Ihnen einen Festpreis. Danach entscheiden Sie in Ruhe.</p></details>
    <details><summary>Kann ich als Mieter teilnehmen?</summary><p>Ja. Für eine Solaranlage braucht es aber die Zustimmung des Eigentümers.</p></details>
  </section>

  <section id="bedingungen" class="tnb">
    <p class="draft">Entwurf — vor Livegang rechtlich prüfen</p>
    <h2>Teilnahmebedingungen</h2>
    <p><b>Veranstalter:</b> {betrieb_lang}, {adresse}.</p>
    <p><b>Zeitraum:</b> Teilnahme bis {datum_voll}, 23:59 Uhr. Ziehung am {ziehung}.</p>
    <p><b>Teilnahme:</b> durch Absenden des Formulars auf dieser Seite. Teilnahmeberechtigt sind volljährige Personen mit Wohnsitz in Deutschland. Pro Person eine Teilnahme. Die Teilnahme ist kostenlos und nicht an einen Kauf gebunden.</p>
    <p><b>Gewinn:</b> {gewinn}. {einloesen}</p>
    <p><b>Ziehung und Benachrichtigung:</b> Die Gewinner werden unter allen gültigen Teilnahmen per Zufall gezogen und per Telefon oder E-Mail benachrichtigt. Meldet sich ein Gewinner nicht innerhalb von 14 Tagen, wird neu gezogen.</p>
    <p><b>Ausschluss:</b> Mitarbeiter des Veranstalters und ihre Angehörigen. Der Rechtsweg ist ausgeschlossen.</p>
    <p><b>Datenschutz:</b> Ihre Angaben verwenden wir für die Verlosung und für die Kontaktaufnahme zu Ihrer Anfrage. Details in der <a href="{datenschutz_url}">Datenschutzerklärung</a>.</p>
    <p><b>Hinweis:</b> Diese Aktion steht in keiner Verbindung zu Facebook oder Instagram und wird von Meta weder gesponsert noch unterstützt oder organisiert.</p>
  </section>

  <section class="final">
    <h2>Jetzt teilnehmen.</h2>
    <p>Verlosung bis {datum}. Mitmachen dauert 30 Sekunden.</p>
    <a class="btn" href="#teilnehmen">Jetzt teilnehmen</a>
  </section>
</div>

<footer><div class="wrap">
  <b>{betrieb_lang}</b><br>{adresse} · <a href="tel:{telefon_link}">{telefon}</a><br>{oeffnungszeiten}<br>
  <a href="{impressum_url}">Impressum</a> · <a href="{datenschutz_url}">Datenschutz</a> ·
  <button class="linkbtn" type="button" id="consent-open">Cookie-Einstellungen</button>
</div></footer>

<div class="sticky"><a class="btn" href="#teilnehmen">Jetzt teilnehmen</a></div>

<div class="consent" id="consent" role="dialog" aria-label="Cookie-Einstellungen">
  <p>Wir möchten messen, ob unsere Werbung auf Facebook und Instagram ankommt. Dafür nutzen wir das Meta-Pixel, das Cookies setzt. Das geht nur mit Ihrer Zustimmung. Mehr dazu im <a href="{datenschutz_url}">Datenschutz</a>.</p>
  <div class="row"><button class="ghost" type="button" id="consent-no">Nur notwendige</button><button type="button" id="consent-yes">Einverstanden</button></div>
</div>

<script>
  var PIXEL_ID = '{pixel_id}', KEY = 'lp-consent';
  function getC(){{ try {{ return localStorage.getItem(KEY); }} catch(e){{ return null; }} }}
  function setC(v){{ try {{ localStorage.setItem(KEY, v); }} catch(e){{}} }}
  function loadPixel(){{
    if (window.fbq || PIXEL_ID === 'PIXEL_ID') return;
    !function(f,b,e,v,n,t,s){{if(f.fbq)return;n=f.fbq=function(){{n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)}};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;
    s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', PIXEL_ID); fbq('track', 'PageView');
  }}
  (function(){{
    var box = document.getElementById('consent'), c = getC();
    if (c === 'ja') loadPixel(); else if (c !== 'nein') box.classList.add('show');
    document.getElementById('consent-yes').onclick = function(){{ setC('ja'); box.classList.remove('show'); loadPixel(); }};
    document.getElementById('consent-no').onclick = function(){{ setC('nein'); box.classList.remove('show'); }};
    document.getElementById('consent-open').onclick = function(){{ box.classList.add('show'); }};
    var p = new URLSearchParams(location.search);
    ['fbclid','gclid','utm_source','utm_campaign'].forEach(function(k){{ var el = document.getElementById('f_' + k); if (el) el.value = p.get(k) || ''; }});
  }})();
</script>
</body>
</html>
"""


def bauen(ordner):
    """Baut modul/rabatt/speicher.html in <ordner> aus <ordner>/aktionen.json."""
    ordner = pathlib.Path(ordner)
    kunde = json.loads((ordner / "aktionen.json").read_text(encoding="utf-8"))
    for name, v in VARIANTEN.items():
        daten = dict(kunde)
        werte = {k: (w.format(**daten) if isinstance(w, str) else w) for k, w in v.items()}
        daten.update(werte)
        daten["faq_extra"] = "\n    ".join(
            f"<details><summary>{q.format(**kunde)}</summary><p>{a.format(**kunde)}</p></details>"
            for q, a in v["faq_extra"])
        ziel = ordner / f"{name}.html"
        ziel.write_text(SEITE.format(**daten), encoding="utf-8")
        print("  ✓", ziel.name)


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit("Aufruf: python3 landingpages-bauen.py <ordner mit aktionen.json>")
    bauen(sys.argv[1])
