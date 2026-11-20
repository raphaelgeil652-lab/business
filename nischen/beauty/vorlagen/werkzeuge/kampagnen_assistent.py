"""Kampagnen-Assistent: macht aus der ausgefüllten Kampagnen-Anleitung (Markdown) eine Seite zum Abarbeiten.

Jeder Schritt hat ein Häkchen (bleibt im Browser gespeichert), jeder Text zum Eintragen einen Knopf „Kopieren“.
Oben zeigt ein Balken, wie weit man ist. Kein Internet nötig, eine einzige Datei. kunde-anlegen.py ruft bauen() auf.
"""
import html
import re

TEXTFELDER = ("Primärtext", "Überschrift", "Beschreibung")


def _inline(text):
    """Escape, dann `code` → Kopier-Chip, **fett** → <b>."""
    teile = re.split(r"(`[^`]+`)", text)
    out = []
    for t in teile:
        if t.startswith("`") and t.endswith("`") and len(t) > 2:
            wert = t[1:-1]
            out.append(f'<span class="chip"><code>{html.escape(wert)}</code><button type="button" class="kopie" data-text="{html.escape(wert, quote=True)}">Kopieren</button></span>')
        else:
            e = html.escape(t, quote=False)
            out.append(re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", e))
    return "".join(out)


def _kopierblock(wert, mehrzeilig=False):
    tag = "pre" if mehrzeilig else "div"
    return (f'<div class="kblock"><{tag} class="wert">{html.escape(wert)}</{tag}>'
            f'<button type="button" class="kopie" data-text="{html.escape(wert, quote=True)}">Kopieren</button></div>')


def bauen(md, titel, schluessel):
    zeilen = md.splitlines()
    out, i, nr = [], 0, [0]

    def haken(inhalt, cls="schritt"):
        nr[0] += 1
        return f'<label class="{cls}"><input type="checkbox" data-n="{nr[0]}"><span>{inhalt}</span></label>'

    absatz = []

    def absatz_leeren():
        if absatz:
            text = " ".join(absatz)
            if re.match(r"\*\*\d+ · ", text):  # Kopf einer Meta-Anzeige
                out.append('<div class="anzeige">' + haken(_inline(text)) + "</div>")
            else:
                out.append("<p>" + _inline(text) + "</p>")
            absatz.clear()

    while i < len(zeilen):
        z = zeilen[i]
        s = z.strip()
        if s.startswith("```"):
            absatz_leeren()
            block = []
            i += 1
            while i < len(zeilen) and not zeilen[i].strip().startswith("```"):
                block.append(zeilen[i])
                i += 1
            i += 1
            out.append(haken("Eintragen:", "schritt klein") + _kopierblock("\n".join(block).strip("\n"), True))
            continue
        if not s:
            absatz_leeren()
            i += 1
            continue
        m = re.match(r"^(#{1,3}) (.*)", z)
        if m:
            absatz_leeren()
            ebene = len(m.group(1))
            out.append(f"<h{ebene + 1 if ebene > 1 else 1}>{_inline(m.group(2))}</h{ebene + 1 if ebene > 1 else 1}>")
            i += 1
            continue
        if s.startswith(">"):
            absatz_leeren()
            block = []
            while i < len(zeilen) and zeilen[i].strip().startswith(">"):
                block.append(zeilen[i].strip().lstrip(">").strip())
                i += 1
            out.append('<div class="hinweis">' + "<br>".join(_inline(b) for b in block if b) + "</div>")
            continue
        if s.startswith("|"):
            absatz_leeren()
            reihen = []
            while i < len(zeilen) and zeilen[i].strip().startswith("|"):
                zellen = [c.strip() for c in zeilen[i].strip().strip("|").split("|")]
                if not all(re.fullmatch(r":?-+:?", c) for c in zellen):
                    reihen.append(zellen)
                i += 1
            kopf, *rest = reihen
            t = '<table><tr><th></th>' + "".join(f"<th>{_inline(c)}</th>" for c in kopf) + "</tr>"
            for r in rest:
                nr[0] += 1
                t += f'<tr><td class="h"><input type="checkbox" data-n="{nr[0]}"></td>' + "".join(f"<td>{_inline(c)}</td>" for c in r) + "</tr>"
            out.append(t + "</table>")
            continue
        m = re.match(r"^(\d+\.|-) (.*)", z)
        if m:
            absatz_leeren()
            text, unter = m.group(2), []
            i += 1
            while i < len(zeilen) and zeilen[i].startswith(" ") and zeilen[i].strip() and not re.match(r"^(\d+\.|-) ", zeilen[i]):
                u = zeilen[i]
                um = re.match(r"^\s{3,}\d+\. (.*)", u)
                if um:
                    unter.append(("kopie", um.group(1).strip()))
                elif u.strip().startswith("```"):
                    break
                else:
                    unter.append(("text", u.strip()))
                i += 1
            fm = re.match(r"^(%s): (.*)" % "|".join(TEXTFELDER), text)
            if fm:
                wert = "\n".join([fm.group(2)] + [t for a, t in unter if a == "text"])
                out.append(haken(f"<b>{fm.group(1)}</b>", "schritt klein") + _kopierblock(wert, "\n" in wert))
            else:
                inhalt = _inline(" ".join([text] + [t for a, t in unter if a == "text"]))
                out.append(haken(inhalt))
                kop = [t for a, t in unter if a == "kopie"]
                if kop:
                    out.append('<div class="liste">' + "".join(_kopierblock(k) for k in kop) + "</div>")
            continue
        absatz.append(s)
        i += 1
    absatz_leeren()

    return f"""<!DOCTYPE html>
<html lang="de"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex"><title>Kampagnen · {html.escape(titel)}</title>
<style>
:root{{--bg:#F7F4EE;--ink:#1A1917;--muted:#6B665D;--line:#E4DED3;--gruen:#1F7A3F;}}
body{{margin:0;background:var(--bg);color:var(--ink);font-family:-apple-system,"Helvetica Neue",Arial,sans-serif;line-height:1.5;font-size:15px;}}
.w{{max-width:820px;margin:0 auto;padding:0 16px 80px;}}
.leiste{{position:sticky;top:0;background:var(--bg);padding:12px 0 10px;border-bottom:1px solid var(--line);z-index:5;}}
.leiste b{{font-size:15px;}} .balken{{height:8px;background:var(--line);border-radius:4px;margin-top:6px;overflow:hidden;}}
.balken i{{display:block;height:100%;background:var(--gruen);width:0;transition:width .2s;}}
h1{{font-size:24px;margin:18px 0 6px;}} h3{{font-size:20px;margin:30px 0 6px;padding-top:12px;border-top:2px solid var(--ink);}} h4{{font-size:16px;margin:20px 0 6px;}}
p{{margin:8px 0;}} .hinweis{{background:#fff;border-left:4px solid var(--gruen);padding:10px 12px;margin:10px 0;font-size:14px;}}
.schritt{{display:flex;gap:10px;align-items:flex-start;background:#fff;border:1px solid var(--line);border-radius:8px;padding:10px 12px;margin:6px 0;cursor:pointer;}}
.schritt.klein{{margin-bottom:0;border-bottom-left-radius:0;border-bottom-right-radius:0;}}
.schritt input,td.h input{{width:20px;height:20px;margin-top:2px;flex:none;accent-color:var(--gruen);}}
.erledigt>span,tr.erledigt td{{color:#9A968C;text-decoration:line-through;}}
.kblock{{display:flex;gap:8px;align-items:flex-start;background:#fff;border:1px solid var(--line);border-top:0;border-radius:0 0 8px 8px;padding:8px 12px;margin:0 0 10px;}}
.liste .kblock{{border-top:1px solid var(--line);border-radius:8px;margin:4px 0 4px 30px;}}
.wert{{flex:1;margin:0;font-family:inherit;white-space:pre-wrap;font-size:14px;}}
.kopie{{flex:none;font-size:13px;font-weight:700;padding:6px 10px;border:0;border-radius:6px;background:var(--ink);color:#fff;cursor:pointer;}}
.kopie.ok{{background:var(--gruen);}}
.chip{{display:inline-flex;gap:4px;align-items:center;background:#F1ECE2;border-radius:5px;padding:1px 2px 1px 6px;margin:1px 0;}}
.chip code{{font-size:13px;}} .chip .kopie{{padding:3px 7px;font-size:12px;}}
table{{width:100%;border-collapse:collapse;background:#fff;border:1px solid var(--line);border-radius:8px;margin:8px 0;font-size:14px;}}
th{{text-align:left;padding:8px;background:#EFEAE0;}} td{{padding:8px;border-top:1px solid var(--line);vertical-align:top;}} td.h{{width:24px;}}
.anzeige .schritt{{border:2px solid var(--ink);}}
.oben{{font-size:13px;color:var(--muted);}} .null{{border:0;background:none;color:var(--muted);text-decoration:underline;cursor:pointer;font-size:13px;}}
</style></head><body><div class="w">
<div class="leiste"><b id="stand">0 von 0 erledigt</b> · <button class="null" type="button" id="zurueck">Häkchen zurücksetzen</button>
<div class="balken"><i id="bar"></i></div></div>
<p class="oben">Kampagnen-Assistent für {html.escape(titel)}. Von oben nach unten abarbeiten, jeden Schritt abhaken. Texte mit „Kopieren“ übernehmen,
dann bei Meta oder Google mit Strg+V bzw. ⌘+V einfügen. Die Häkchen bleiben in diesem Browser gespeichert.</p>
{"".join(out)}
</div><script>
(function () {{
  var KEY = 'kampagne-{html.escape(schluessel)}', boxen = Array.prototype.slice.call(document.querySelectorAll('input[type=checkbox]'));
  var stand = {{}};
  try {{ stand = JSON.parse(localStorage.getItem(KEY) || '{{}}'); }} catch (e) {{}}
  function zeigen() {{
    var n = 0;
    boxen.forEach(function (b) {{
      var an = !!stand[b.dataset.n]; b.checked = an; if (an) n++;
      var z = b.closest('label') || b.closest('tr'); if (z) z.classList.toggle('erledigt', an);
    }});
    document.getElementById('stand').textContent = n + ' von ' + boxen.length + ' erledigt';
    document.getElementById('bar').style.width = (boxen.length ? 100 * n / boxen.length : 0) + '%';
  }}
  boxen.forEach(function (b) {{ b.addEventListener('change', function () {{
    stand[b.dataset.n] = b.checked; try {{ localStorage.setItem(KEY, JSON.stringify(stand)); }} catch (e) {{}} zeigen(); }}); }});
  document.getElementById('zurueck').onclick = function () {{ if (confirm('Alle Häkchen entfernen?')) {{ stand = {{}}; try {{ localStorage.removeItem(KEY); }} catch (e) {{}} zeigen(); }} }};
  document.addEventListener('click', function (e) {{
    var k = e.target.closest('.kopie'); if (!k) return;
    e.preventDefault(); e.stopPropagation();
    var t = k.getAttribute('data-text'), fertig = function () {{ var alt = k.textContent; k.textContent = 'Kopiert ✓'; k.classList.add('ok'); setTimeout(function () {{ k.textContent = alt; k.classList.remove('ok'); }}, 1500); }};
    var notfall = function () {{ var a = document.createElement('textarea'); a.value = t; document.body.appendChild(a); a.select(); try {{ document.execCommand('copy'); }} catch (x) {{}} a.remove(); fertig(); }};
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(fertig, notfall); else notfall();
  }}, true);
  zeigen();
}})();
</script></body></html>"""
