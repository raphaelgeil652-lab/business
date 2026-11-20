/* Online-Buchung auf der Seite des Studios. Liest die Einstellungen aus <script id="buchung-cfg" type="application/json">.
   Fragt die Beauty-Zentrale nach freien Zeiten und schickt die Buchung dorthin. Der Termin ist erst fest,
   wenn die Kundin ihn in der Mail bestätigt (danke.html erklärt das).
   Ohne Zentrale-Adresse oder mit ?demo=1 zeigt die Seite Beispiel-Termine (zum Vorführen im Gespräch). */
(function () {
  var cfg = JSON.parse(document.getElementById('buchung-cfg').textContent);
  var q = new URLSearchParams(location.search);
  var DEMO = !/^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(cfg.zentrale || '') || q.get('demo') === '1';
  var start = Date.now(), tage = [];
  var optionen = cfg.leistungen || [];
  var wahl = { leistung: optionen.length ? optionen[0].name : '', minuten: optionen.length ? optionen[0].minuten : 30, tag: null, zeit: null };
  var $ = function (id) { return document.getElementById(id); };
  var el = function (tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  // Werbe-Parameter merken (auch wenn die Kundin erst auf einer zweiten Seite bucht)
  var UTM = {};
  ['utm_source', 'utm_campaign', 'fbclid', 'gclid'].forEach(function (k) {
    var v = q.get(k);
    try { if (v) sessionStorage.setItem(k, v); else v = sessionStorage.getItem(k); } catch (e) {}
    UTM[k] = v || '';
    var f = document.querySelector('[name="' + k + '"]');
    if (f) f.value = UTM[k];
  });

  // 1 · Was buchen?
  var arten = $('arten');
  if (optionen.length < 2) { $('schritt-art').style.display = 'none'; }
  optionen.forEach(function (o, i) {
    var b = el('button', 'art', '<span><b>' + esc(o.name) + '</b><small>' + o.minuten + ' Min.</small></span>' + (o.preis ? '<span class="preis">' + esc(o.preis) + '</span>' : ''));
    b.type = 'button';
    b.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
    b.onclick = function () {
      [].forEach.call(arten.children, function (x) { x.setAttribute('aria-pressed', 'false'); });
      b.setAttribute('aria-pressed', 'true');
      wahl.leistung = o.name; wahl.minuten = o.minuten;
      ladeZeiten();
    };
    arten.appendChild(b);
  });

  // 2 · Freie Zeiten
  function ladeZeiten(hinweis) {
    wahl.tag = null; wahl.zeit = null; zeigeWahl();
    $('tage').innerHTML = '';
    $('lade').textContent = hinweis || 'Freie Termine werden geladen …';
    $('lade').style.display = 'block';
    if (DEMO) { setTimeout(function () { zeigeTage(demoTage()); }, 250); return; }
    fetch(cfg.zentrale + '?a=slots&k=' + encodeURIComponent(cfg.kunde) + '&l=' + encodeURIComponent(wahl.leistung))
      .then(function (r) { return r.json(); })
      .then(function (d) { if (!d.ok) throw new Error(d.fehler); zeigeTage(d.tage); })
      .catch(function () {
        $('lade').innerHTML = 'Die Online-Termine sind gerade nicht erreichbar. Rufen Sie uns an: <a href="tel:' + esc(cfg.telefon_link) + '">' +
          esc(cfg.telefon) + '</a> oder lassen Sie sich zurückrufen.';
        rueckruf(true);
      });
  }
  // Großer Wochenkalender: alle freien Zeiten aus dem Google-Kalender des Studios, am Handy 3 Tage, am Computer 7 Tage
  var start0 = 0, proSeite = 7, alleTage = [];
  function tageListe(liste) {
    var map = {}, out = [], wt = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'], p = function (n) { return (n < 10 ? '0' : '') + n; };
    liste.forEach(function (t) { map[t.datum] = t; });
    var heute = new Date(), letzter = liste.length ? liste[liste.length - 1].datum : '';
    for (var i = 0; i < 35; i++) {
      var d = new Date(heute.getFullYear(), heute.getMonth(), heute.getDate() + i);
      var key = d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
      out.push(map[key] || { datum: key, label: wt[d.getDay()] + ', ' + p(d.getDate()) + '.' + p(d.getMonth() + 1) + '.', zeiten: [] });
      if (key >= letzter && i >= 6) break;
    }
    return out;
  }
  function zeigeTage(liste) {
    tage = liste || [];
    if (!tage.some(function (t) { return t.zeiten.length; })) {
      $('lade').innerHTML = 'Gerade ist online kein Termin frei. Lassen Sie sich zurückrufen, wir finden einen.';
      rueckruf(true);
      return;
    }
    $('lade').style.display = 'none';
    alleTage = tageListe(tage);
    proSeite = window.innerWidth >= 700 ? 7 : 3;
    start0 = 0;
    while (start0 + proSeite < alleTage.length && !alleTage.slice(start0, start0 + proSeite).some(function (t) { return t.zeiten.length; })) start0 += proSeite;
    malen();
  }
  function malen() {
    var sicht = alleTage.slice(start0, start0 + proSeite), k = $('tage');
    k.innerHTML = '';
    var kopf = el('div', 'kal-kopf');
    var zur = el('button', 'kal-pfeil', '‹'), vor = el('button', 'kal-pfeil', '›');
    zur.type = vor.type = 'button';
    zur.setAttribute('aria-label', 'frühere Tage'); vor.setAttribute('aria-label', 'spätere Tage');
    zur.disabled = start0 === 0; vor.disabled = start0 + proSeite >= alleTage.length;
    zur.onclick = function () { start0 = Math.max(0, start0 - proSeite); malen(); };
    vor.onclick = function () { start0 = Math.min(alleTage.length - 1, start0 + proSeite); malen(); };
    kopf.appendChild(zur);
    kopf.appendChild(el('span', 'kal-titel', esc(sicht[0].label.split(', ')[1]) + ' – ' + esc(sicht[sicht.length - 1].label.split(', ')[1])));
    kopf.appendChild(vor);
    k.appendChild(kopf);
    var gitter = el('div', 'kal-gitter');
    gitter.style.gridTemplateColumns = 'repeat(' + sicht.length + ', minmax(0, 1fr))';
    sicht.forEach(function (t) {
      var sp = el('div', 'kal-tag'), teile = t.label.split(', ');
      sp.appendChild(el('div', 'kal-tagkopf', '<b>' + esc(teile[0]) + '</b><small>' + esc(teile[1]) + '</small>'));
      if (!t.zeiten.length) sp.appendChild(el('div', 'kal-leer', '–'));
      t.zeiten.forEach(function (z) {
        var b = el('button', 'zeit', z);
        b.type = 'button';
        b.setAttribute('data-tag', t.datum);
        if (wahl.tag && wahl.tag.datum === t.datum && wahl.zeit === z) b.setAttribute('aria-pressed', 'true');
        b.onclick = function () {
          [].forEach.call(k.querySelectorAll('.zeit'), function (x) { x.setAttribute('aria-pressed', 'false'); });
          b.setAttribute('aria-pressed', 'true');
          wahl.tag = t; wahl.zeit = z; zeigeWahl();
          $('schritt-daten').style.display = 'block';
          setTimeout(function () { $('wahl').scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 60);
        };
        sp.appendChild(b);
      });
      gitter.appendChild(sp);
    });
    k.appendChild(gitter);
  }
  function zeigeWahl() {
    var w = $('wahl');
    if (wahl.tag && wahl.zeit) {
      w.innerHTML = '<b>' + esc(wahl.tag.label) + ' um ' + wahl.zeit + ' Uhr</b> · ' + esc(wahl.leistung) + ' (' + wahl.minuten + ' Min.)';
      w.classList.add('show');
      $('senden').disabled = false;
    } else {
      w.classList.remove('show');
      $('senden').disabled = true;
    }
  }
  function demoTage() {
    var out = [], d = new Date(), wt = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
    for (var i = 1; out.length < 21 && i < 30; i++) {
      var x = new Date(d.getFullYear(), d.getMonth(), d.getDate() + i);
      if (x.getDay() === 0) continue;
      var z = ['09:00', '09:30', '10:30', '11:00', '13:30', '14:00', '15:30', '16:00', '17:00'].filter(function (_, k) { return (k + i) % 3; });
      var p = function (n) { return (n < 10 ? '0' : '') + n; };
      out.push({ datum: x.getFullYear() + '-' + p(x.getMonth() + 1) + '-' + p(x.getDate()), label: wt[x.getDay()] + ', ' + p(x.getDate()) + '.' + p(x.getMonth() + 1) + '.', zeiten: z });
    }
    return out;
  }

  // 3 · Daten und Absenden
  var form = $('buchung-form');
  function feldFehler(name, text) {
    var f = form.elements[name], e = $('fehler-' + name);
    if (f) f.classList.toggle('falsch', !!text);
    if (e) { e.textContent = text || ''; e.classList.toggle('show', !!text); }
  }
  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    ['name', 'telefon', 'email'].forEach(function (n) { feldFehler(n, ''); });
    $('fehler').classList.remove('show');
    if (!wahl.zeit) return;
    var d = {
      a: 'buchen', kunde: cfg.kunde, leistung: wahl.leistung, start: wahl.tag.datum + 'T' + wahl.zeit,
      name: form.elements.name.value, telefon: form.elements.telefon.value, email: form.elements.email.value,
      hp: form.elements.website.value, ms: Date.now() - start
    };
    Object.keys(UTM).forEach(function (k) { d[k] = UTM[k]; });
    var b = $('senden');
    b.disabled = true; b.textContent = 'Wird reserviert …';
    var weiter = function (frist) {
      var m = String(d.email), at = m.indexOf('@');
      var maske = at > 1 ? m.slice(0, 1) + '•••' + m.slice(at) : m;
      location.href = 'danke.html?f=' + (frist || 45) + '&m=' + encodeURIComponent(maske) + (DEMO ? '&demo=1' : '');
    };
    if (DEMO) { setTimeout(function () { weiter(45); }, 400); return; }
    fetch(cfg.zentrale, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(d) })
      .then(function (r) { return r.json(); })
      .then(function (r) {
        if (r.ok) return weiter(r.frist);
        b.disabled = false; b.textContent = 'Termin reservieren';
        if (r.feld) { feldFehler(r.feld, r.fehler); form.elements[r.feld].focus(); return; }
        $('fehler').textContent = r.fehler; $('fehler').classList.add('show');
        if (r.weg) ladeZeiten('Dieser Termin ist gerade vergeben worden. Neue freie Zeiten werden geladen …');
      })
      .catch(function () {
        b.disabled = false; b.textContent = 'Termin reservieren';
        $('fehler').innerHTML = 'Das hat gerade nicht geklappt. Bitte nochmal versuchen oder anrufen: <a href="tel:' + esc(cfg.telefon_link) + '">' + esc(cfg.telefon) + '</a>';
        $('fehler').classList.add('show');
      });
  });

  // Rückruf statt Online-Termin: geht direkt an die Zentrale (keine Netlify-Formulare nötig)
  function rueckruf(an) { $('rueckruf-box').style.display = an ? 'block' : 'none'; }
  var rf = document.querySelector('form[name="rueckruf"]');
  if (rf) rf.addEventListener('submit', function (ev) {
    ev.preventDefault();
    if (!rf.checkValidity()) { rf.reportValidity(); return; }
    var d = { a: 'anfrage', form: 'rueckruf', kunde: cfg.kunde, name: rf.elements.name.value, telefon: rf.elements.telefon.value,
      wunsch: rf.elements.wunsch ? rf.elements.wunsch.value : '', hp: rf.elements['bot-field'].value, ms: Date.now() - start };
    Object.keys(UTM).forEach(function (k) { d[k] = UTM[k]; });
    var b = rf.querySelector('button'), f = $('rueckruf-fehler');
    var fertig = function () { location.href = 'rueckruf-danke.html' + (DEMO ? '?demo=1' : ''); };
    if (DEMO) { fertig(); return; }
    b.disabled = true;
    fetch(cfg.zentrale, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(d) })
      .then(function (r) { return r.json(); })
      .then(function (r) { if (r.ok) return fertig(); b.disabled = false; f.textContent = r.fehler; f.classList.add('show'); })
      .catch(function () { b.disabled = false; f.innerHTML = 'Das hat gerade nicht geklappt. Bitte rufen Sie uns an: <a href="tel:' + esc(cfg.telefon_link) + '">' + esc(cfg.telefon) + '</a>'; f.classList.add('show'); });
  });
  $('rueckruf-link').onclick = function () { rueckruf(true); $('rueckruf-box').scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  if (DEMO) $('demo').style.display = 'block';
  ladeZeiten();
})();
