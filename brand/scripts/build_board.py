import os, re

LOGO = "/home/user/business/brand/logo"

def svg(name, cls="", w=None):
    s = open(os.path.join(LOGO, name)).read().strip()
    # strip explicit width/height so CSS controls sizing; keep viewBox
    s = re.sub(r'\s(width|height)="[^"]*"', '', s, count=2)
    s = s.replace('<svg ', f'<svg class="{cls}" ' if cls else '<svg ')
    return s

BODY = f"""
<div class="page">

  <!-- HERO -->
  <header class="hero">
    <div class="hero-mark">{svg('ccg-white.svg','mk-hero')}</div>
    <div class="hero-copy">
      <p class="eyebrow">Bildmarke · Monogramm</p>
      <h1>Das CCG&#8202;-&#8202;Zeichen</h1>
      <p class="lede">Ein Konzept aus deiner Handskizze, entwickelt zu einem
      skalierbaren Vektor-Logo: ein ineinander&shy;fließendes Doppel&#8209;C, das
      in ein G mit aufsteigendem Bogen übergeht. Handschriftlich im Charakter,
      präzise in der Konstruktion.</p>
      <p class="meta">Küche&nbsp;&amp;&nbsp;Bad · Performance-Marketing · Bodensee / Oberschwaben</p>
    </div>
  </header>

  <!-- CONCEPT -->
  <section class="band">
    <p class="eyebrow">Die Idee</p>
    <h2>Zwei Buchstaben, eine Bewegung</h2>
    <div class="two">
      <p>Die linke Form ist ein <strong>Doppel&#8209;C</strong> — zwei verschachtelte
      Bögen, die wie ein Echo wirken. Sie fließt nach rechts in das
      <strong>G</strong>, dessen Ring sich mit Querbalken und nach oben laufendem
      Häkchen schließt. Der durchgehende, kalligrafische Strich (dick&#8202;/&#8202;dünn wie
      mit der Breitfeder) hält den persönlichen, handgezeichneten Ursprung fest.</p>
      <p>Formal steht die runde, offene Geste für <strong>Fluss</strong> — den Lauf
      der Leads durch das System und das Wasser-Motiv von Bad und Küche. Das Zeichen
      funktioniert als reines Signet und ist so angelegt, dass später mühelos eine
      Wortmarke andocken kann.</p>
    </div>
  </section>

  <!-- VARIANTS -->
  <section class="band alt">
    <p class="eyebrow">Varianten</p>
    <h2>Fünf Fassungen, ein Zeichen</h2>
    <div class="grid v5">
      <figure class="tile"><div class="hold">{svg('ccg-primary.svg','mk')}</div><figcaption><b>Primär · Kalligrafisch</b><span>Die Hauptfassung. Modulierter Strich, Petrol.</span></figcaption></figure>
      <figure class="tile"><div class="hold">{svg('ccg-duo.svg','mk')}</div><figcaption><b>Zweifarbig</b><span>CC in Petrol, G in Messing — Farb-Story.</span></figcaption></figure>
      <figure class="tile"><div class="hold ink">{svg('ccg-white.svg','mk')}</div><figcaption><b>Negativ</b><span>Weiß auf dunklem oder farbigem Grund.</span></figcaption></figure>
      <figure class="tile"><div class="hold">{svg('ccg-monoline.svg','mk ink-c')}</div><figcaption><b>Monolinie</b><span>Gleichmäßige Linie — Web, kleine Größen.</span></figcaption></figure>
      <figure class="tile"><div class="hold">{svg('ccg-bold.svg','mk ink-c')}</div><figcaption><b>Fett</b><span>Kräftig für sehr kleine Anwendungen.</span></figcaption></figure>
    </div>
  </section>

  <!-- CONSTRUCTION -->
  <section class="band">
    <p class="eyebrow">Konstruktion</p>
    <h2>Auf dem Raster gebaut</h2>
    <div class="two constr">
      <div class="hold big">{svg('ccg-construction.svg','mk')}</div>
      <div>
        <p>Das Zeichen ist aus drei Kreisen konstruiert: zwei konzentrische Bögen
        für das Doppel&#8209;C und ein gleich großer Ring für das G, alle auf einer
        gemeinsamen Grundlinie. Diese Geometrie hält die Proportionen stabil —
        vom Briefkopf bis zum Favicon.</p>
        <ul class="specs">
          <li><span>Doppel&#8209;C</span> zwei Bögen, Radius-Verhältnis ~1&#8202;:&#8202;0,6</li>
          <li><span>G-Ring</span> gleicher Radius wie äußeres C</li>
          <li><span>Feder-Winkel</span> ~38° für den Dick-/Dünn-Kontrast</li>
          <li><span>Grundlinie</span> alle Zentren auf einer Achse</li>
        </ul>
      </div>
    </div>
  </section>

  <!-- CLEAR SPACE / MIN SIZE -->
  <section class="band alt">
    <p class="eyebrow">Schutzraum &amp; Mindestgröße</p>
    <h2>Luft zum Atmen</h2>
    <div class="grid two">
      <figure class="tile"><div class="hold clear">
        <div class="cs-box">{svg('ccg-primary.svg','mk')}</div>
      </div><figcaption><b>Schutzraum</b><span>Ringsum mindestens die Höhe des C freihalten — nichts rückt näher heran.</span></figcaption></figure>
      <figure class="tile"><div class="hold sizes">
        {svg('ccg-primary.svg','sz sz1')}
        {svg('ccg-primary.svg','sz sz2')}
        {svg('ccg-bold.svg','sz sz3 ink-c')}
      </div><figcaption><b>Mindestgröße</b><span>Ab ~20&nbsp;px die Fett-Fassung nutzen; darunter das Favicon-Signet.</span></figcaption></figure>
    </div>
  </section>

  <!-- COLOR -->
  <section class="band">
    <p class="eyebrow">Farbe</p>
    <h2>Petrol &amp; Messing</h2>
    <p class="sub">Tiefes Petrol steht für Wasser, Ruhe und Seriosität (Bad); warmes
    Messing für Wärme, Holz und Hochwertigkeit (Küche). Anthrazit und ein warmes
    Off-White tragen das System.</p>
    <div class="swatches">
      <div class="sw"><div class="chip" style="background:#0E3A43"></div><b>Petrol</b><code>#0E3A43</code><span>Primär</span></div>
      <div class="sw"><div class="chip" style="background:#B07A3C"></div><b>Messing</b><code>#B07A3C</code><span>Akzent</span></div>
      <div class="sw"><div class="chip" style="background:#14181A"></div><b>Anthrazit</b><code>#14181A</code><span>Text / Neutral</span></div>
      <div class="sw"><div class="chip" style="background:#F4F1EC;box-shadow:inset 0 0 0 1px #0002"></div><b>Off-White</b><code>#F4F1EC</code><span>Grund</span></div>
    </div>
  </section>

  <!-- BACKGROUNDS -->
  <section class="band alt">
    <p class="eyebrow">Hintergründe</p>
    <h2>Auf jedem Grund</h2>
    <div class="grid bg4">
      <div class="bgtile" style="background:#F4F1EC">{svg('ccg-primary.svg','mk')}<span>Off-White</span></div>
      <div class="bgtile" style="background:#FFFFFF">{svg('ccg-duo.svg','mk')}<span>Weiß</span></div>
      <div class="bgtile dark" style="background:#0E3A43">{svg('ccg-white.svg','mk')}<span>Petrol</span></div>
      <div class="bgtile dark" style="background:#14181A">{svg('ccg-white.svg','mk')}<span>Anthrazit</span></div>
    </div>
  </section>

  <!-- APPLICATIONS -->
  <section class="band">
    <p class="eyebrow">Anwendungen</p>
    <h2>Signet, App-Icon, Favicon</h2>
    <div class="apps">
      <figure class="app"><div class="badge-hold">{svg('ccg-badge-petrol.svg','bdg')}</div><figcaption>Avatar / App-Icon</figcaption></figure>
      <figure class="app"><div class="badge-hold">{svg('ccg-badge-ink.svg','bdg')}</div><figcaption>Stempel · dunkel</figcaption></figure>
      <figure class="app"><div class="fav-row">
        {svg('favicon.svg','fv f64')}{svg('favicon.svg','fv f32')}{svg('favicon.svg','fv f16')}
      </div><figcaption>Favicon 64 / 32 / 16&nbsp;px</figcaption></figure>
    </div>
  </section>

  <!-- DO / DONT -->
  <section class="band alt">
    <p class="eyebrow">Regeln</p>
    <h2>So bleibt das Zeichen stark</h2>
    <div class="grid dd">
      <div class="do"><h3>Richtig</h3><ul>
        <li>Schutzraum einhalten</li>
        <li>Nur die definierten Farben</li>
        <li>Auf kontrastreichem Grund platzieren</li>
        <li>Die passende Fassung zur Größe wählen</li>
      </ul></div>
      <div class="dont"><h3>Vermeiden</h3><ul>
        <li>Verzerren oder schräg stellen</li>
        <li>Eigene Farben / Verläufe</li>
        <li>Schatten oder Outline hinzufügen</li>
        <li>Auf unruhigem Foto ohne Fläche</li>
      </ul></div>
    </div>
  </section>

  <footer class="foot">
    <div class="foot-mk">{svg('ccg-white.svg','mk-f')}</div>
    <p>CCG · Logo-Konzept — erste Entwicklungsstufe aus der Handskizze.
    Vektor-Master unter <code>brand/logo/</code>. Wortmarke folgt nach Namensfindung.</p>
  </footer>
</div>
"""

CSS = """
:root{
  --petrol:#0E3A43; --petrol-2:#12525E; --brass:#B07A3C; --brass-2:#C79A5E;
  --ink:#14181A; --paper:#F4F1EC;
  --bg:#EAEDEC; --surface:#F6F7F5; --surface-2:#E2E7E5;
  --text:#1B2224; --muted:#5C6B6C; --line:#CBD4D2;
  --accent:var(--brass);
  --serif:'Hoefler Text','Iowan Old Style','Palatino Linotype',Palatino,Georgia,'Times New Roman',serif;
  --sans:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
  --mono:ui-monospace,'SF Mono',Menlo,Consolas,monospace;
}
@media (prefers-color-scheme:dark){:root{
  --bg:#0C1416; --surface:#111E20; --surface-2:#0E1A1C;
  --text:#EAF0EE; --muted:#8FA3A2; --line:#22383A; --paper:#12262B;
}}
:root[data-theme="dark"]{
  --bg:#0C1416; --surface:#111E20; --surface-2:#0E1A1C;
  --text:#EAF0EE; --muted:#8FA3A2; --line:#22383A; --paper:#12262B;
}
:root[data-theme="light"]{
  --bg:#EAEDEC; --surface:#F6F7F5; --surface-2:#E2E7E5;
  --text:#1B2224; --muted:#5C6B6C; --line:#CBD4D2; --paper:#F4F1EC;
}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--text);font-family:var(--sans);
  line-height:1.6;-webkit-font-smoothing:antialiased}
.page{max-width:1060px;margin:0 auto;padding:0 24px 0}
.eyebrow{font-family:var(--mono);font-size:.72rem;letter-spacing:.22em;
  text-transform:uppercase;color:var(--accent);margin:0 0 .8rem}
h1,h2,h3{font-family:var(--serif);font-weight:600;text-wrap:balance;letter-spacing:-.01em}
h2{font-size:clamp(1.7rem,4vw,2.5rem);margin:0 0 1.4rem;line-height:1.08}
h3{font-size:1.05rem;margin:0 0 .7rem}
code{font-family:var(--mono);font-size:.85em}

/* hero */
.hero{background:var(--petrol);color:#EAF0EE;border-radius:20px;margin:26px 0 40px;
  padding:clamp(30px,5vw,58px);display:grid;grid-template-columns:minmax(0,0.9fr) 1.1fr;
  gap:clamp(24px,4vw,52px);align-items:center;
  background-image:radial-gradient(120% 120% at 12% 0%,#12525E 0%,#0E3A43 55%,#0A2E35 100%)}
.hero-mark{display:flex;justify-content:center}
.mk-hero{width:min(300px,80%);height:auto}
.hero h1{font-size:clamp(2.1rem,5.2vw,3.4rem);margin:.1rem 0 1rem;color:#fff;line-height:1.02}
.hero .eyebrow{color:var(--brass-2)}
.lede{font-size:1.06rem;color:#CFE0DE;margin:0 0 1.1rem;max-width:46ch}
.meta{font-family:var(--mono);font-size:.74rem;letter-spacing:.08em;color:#7FA6A5;margin:0}

/* bands */
.band{padding:clamp(34px,5vw,60px) 0;border-top:1px solid var(--line)}
.band.alt{background:var(--surface);border-radius:20px;padding-left:clamp(20px,4vw,44px);
  padding-right:clamp(20px,4vw,44px);border-top:none;margin:8px 0}
.sub,.two p{color:var(--text)}
.sub{max-width:60ch;margin:-.4rem 0 1.8rem;color:var(--muted)}
.two{display:grid;grid-template-columns:1fr 1fr;gap:clamp(20px,4vw,44px)}
.two p{margin:0 0 1rem;max-width:52ch}
strong{color:var(--accent);font-weight:600}

/* variant grid */
.grid{display:grid;gap:16px}
.v5{grid-template-columns:repeat(5,1fr)}
.tile{margin:0;background:var(--surface);border:1px solid var(--line);border-radius:14px;
  overflow:hidden;display:flex;flex-direction:column}
.band.alt .tile{background:var(--surface-2)}
/* sample grounds stay on the logo's intended ground in BOTH themes */
.hold{background:#F4F1EC;display:flex;align-items:center;justify-content:center;
  padding:26px 18px;min-height:120px}
.hold.ink{background:var(--ink)}
.mk{width:100%;max-width:170px;height:auto}
.ink-c{color:#0E3A43}
figcaption{padding:12px 14px 15px;font-size:.82rem;color:var(--muted);
  display:flex;flex-direction:column;gap:2px}
figcaption b{color:var(--text);font-size:.9rem}

/* construction */
.constr{align-items:center}
.hold.big{min-height:230px}
.big .mk{max-width:340px}
.specs{list-style:none;padding:0;margin:1rem 0 0;font-size:.9rem}
.specs li{display:flex;gap:12px;padding:9px 0;border-bottom:1px solid var(--line);color:var(--muted)}
.specs li span{font-family:var(--mono);font-size:.74rem;color:var(--accent);
  min-width:96px;letter-spacing:.04em;text-transform:uppercase}

/* clear space + sizes */
.clear .cs-box{position:relative;padding:26px;outline:1px dashed var(--line);border-radius:6px}
.clear{padding:34px}
.sizes{gap:22px;flex-wrap:wrap}
.sz{height:auto}.sz1{width:150px}.sz2{width:84px}.sz3{width:40px;color:#0E3A43}

/* color */
.swatches{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-top:.6rem}
.sw{display:flex;flex-direction:column;gap:6px}
.chip{aspect-ratio:1.5/1;border-radius:12px;width:100%}
.sw b{font-size:.92rem}.sw code{color:var(--muted)}.sw span{font-size:.76rem;color:var(--accent);
  font-family:var(--mono);letter-spacing:.06em;text-transform:uppercase}

/* backgrounds */
.bg4{grid-template-columns:repeat(4,1fr)}
.bgtile{aspect-ratio:1/1;border-radius:14px;display:flex;flex-direction:column;
  align-items:center;justify-content:center;gap:16px;border:1px solid var(--line);position:relative}
.bgtile .mk{max-width:120px}
.bgtile span{position:absolute;bottom:10px;font-family:var(--mono);font-size:.66rem;
  letter-spacing:.1em;text-transform:uppercase;color:#0009}
.bgtile.dark span{color:#fff8}

/* apps */
.apps{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.app{margin:0;display:flex;flex-direction:column;gap:12px;align-items:center}
.badge-hold{width:100%;display:flex;justify-content:center}
.bdg{width:150px;height:auto;border-radius:20px;box-shadow:0 10px 30px #0e3a4326}
.fav-row{display:flex;gap:16px;align-items:flex-end;min-height:64px}
.fv{border-radius:12px}.f64{width:64px}.f32{width:32px}.f16{width:16px}
.app figcaption{padding:0;text-align:center;align-items:center}

/* do/dont */
.dd{grid-template-columns:1fr 1fr}
.do,.dont{background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:22px 24px}
.band.alt .do,.band.alt .dont{background:var(--surface-2)}
.do h3{color:var(--petrol-2)}.dont h3{color:#B0553C}
:root[data-theme="dark"] .do h3{color:var(--brass-2)}
.do ul,.dont ul{margin:0;padding-left:1.1rem;color:var(--muted);font-size:.92rem}
.do li,.dont li{margin:.4rem 0}

/* footer */
.foot{border-top:1px solid var(--line);margin-top:20px;padding:34px 0 46px;
  display:flex;gap:22px;align-items:center}
.mk-f{width:70px;height:auto;color:var(--petrol);flex:none}
:root[data-theme="dark"] .mk-f{color:#EAF0EE}
.foot p{margin:0;color:var(--muted);font-size:.88rem;max-width:60ch}

@media (max-width:820px){
  .hero{grid-template-columns:1fr;text-align:center}
  .hero-copy .lede{margin-left:auto;margin-right:auto}
  .v5{grid-template-columns:repeat(2,1fr)}
  .two,.constr,.dd,.apps{grid-template-columns:1fr}
  .swatches,.bg4{grid-template-columns:repeat(2,1fr)}
}
@media (prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}}
"""

FULL = f"""<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>CCG · Logo-Konzept</title>
<style>{CSS}</style>
</head>
<body>
{BODY}
</body>
</html>
"""

# full standalone -> repo
with open("/home/user/business/brand/brand-board.html","w") as fh:
    fh.write(FULL)

# body-only (+inline style) -> artifact
with open("/tmp/claude-0/-home-user-business/932dd61b-cd41-5d6a-9d99-d2863830bd0a/scratchpad/artifact_board.html","w") as fh:
    fh.write(f"<style>{CSS}</style>\n{BODY}")

print("brand-board.html written")
