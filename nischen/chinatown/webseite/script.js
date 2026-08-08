/* ==========================================================================
   Chinatown Pfullendorf — gemeinsames Skript
   Bewusst klein und ohne Bibliotheken: Ladezeit ist bei Gastro-Seiten direkt
   Umsatz, und die Seite hat nur ein Ziel — den Anruf.
   ========================================================================== */
(function () {
  "use strict";

  /* ---- Öffnungszeiten: eine Quelle für Status, Tabelle und Suchmaschinen --
     Montag Ruhetag, Dienstag bis Sonntag 11:30–14:30 und 17:30–23:00.       */
  var ZEITEN = {
    1: null,
    2: [["11:30", "14:30"], ["17:30", "23:00"]],
    3: [["11:30", "14:30"], ["17:30", "23:00"]],
    4: [["11:30", "14:30"], ["17:30", "23:00"]],
    5: [["11:30", "14:30"], ["17:30", "23:00"]],
    6: [["11:30", "14:30"], ["17:30", "23:00"]],
    0: [["11:30", "14:30"], ["17:30", "23:00"]]
  };
  var TAGE = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];

  function minuten(hhmm) {
    var t = hhmm.split(":");
    return parseInt(t[0], 10) * 60 + parseInt(t[1], 10);
  }

  /* Immer die Ortszeit des Restaurants nehmen, nicht die des Besuchers. */
  function jetztInPfullendorf() {
    var f = new Intl.DateTimeFormat("de-DE", {
      timeZone: "Europe/Berlin", weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false
    });
    var teile = {};
    f.formatToParts(new Date()).forEach(function (p) { teile[p.type] = p.value; });
    var kurz = { So: 0, Mo: 1, Di: 2, Mi: 3, Do: 4, Fr: 5, Sa: 6 };
    var tag = kurz[teile.weekday.replace(".", "")];
    return { tag: tag, minute: parseInt(teile.hour, 10) * 60 + parseInt(teile.minute, 10) };
  }

  function naechsteOeffnung(vonTag) {
    for (var i = 1; i <= 7; i++) {
      var t = (vonTag + i) % 7;
      if (ZEITEN[t]) return { tag: t, zeit: ZEITEN[t][0][0], morgen: i === 1 };
    }
    return null;
  }

  function statusSetzen() {
    var el = document.querySelector("[data-status]");
    if (!el) return;
    var text = el.querySelector("[data-status-text]");
    var jetzt = jetztInPfullendorf();
    var heute = ZEITEN[jetzt.tag];
    var offen = null;

    if (heute) {
      for (var i = 0; i < heute.length; i++) {
        if (jetzt.minute >= minuten(heute[i][0]) && jetzt.minute < minuten(heute[i][1])) {
          offen = heute[i];
          break;
        }
      }
    }

    if (offen) {
      el.setAttribute("data-open", "ja");
      text.innerHTML = "<b>Jetzt geöffnet</b> &middot; bis " + offen[1] + " Uhr";
      return;
    }

    /* Heute noch eine Öffnung vor uns? */
    if (heute) {
      for (var j = 0; j < heute.length; j++) {
        if (jetzt.minute < minuten(heute[j][0])) {
          el.setAttribute("data-open", "nein");
          text.innerHTML = "<b>Heute geöffnet</b> &middot; ab " + heute[j][0] + " Uhr";
          return;
        }
      }
    }

    var n = naechsteOeffnung(jetzt.tag);
    el.setAttribute("data-open", "nein");
    text.innerHTML = "<b>" + (ZEITEN[jetzt.tag] ? "Für heute geschlossen" : "Montag Ruhetag") +
      "</b> &middot; " + (n.morgen ? "morgen" : TAGE[n.tag]) + " ab " + n.zeit + " Uhr";
  }

  /* Heutigen Tag in der Öffnungszeiten-Tabelle hervorheben */
  function heuteMarkieren() {
    var tag = jetztInPfullendorf().tag;
    var zeile = document.querySelector('.zeiten tr[data-tag="' + tag + '"]');
    if (zeile) zeile.setAttribute("data-heute", "");
  }

  /* ---- Navigation auf schmalen Bildschirmen ------------------------------ */
  function navAufbauen() {
    var knopf = document.querySelector(".navtoggle");
    var nav = document.getElementById("hauptnav");
    if (!knopf || !nav) return;

    function schmal() { return window.matchMedia("(max-width:719px)").matches; }
    function zustand(offen) {
      nav.hidden = schmal() ? !offen : false;
      knopf.setAttribute("aria-expanded", offen ? "true" : "false");
    }
    zustand(false);
    knopf.addEventListener("click", function () {
      zustand(knopf.getAttribute("aria-expanded") !== "true");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A" && schmal()) zustand(false);
    });
    window.addEventListener("resize", function () { zustand(false); });
  }

  /* ---- Sanftes Einblenden beim Scrollen ---------------------------------- */
  function revealAufbauen() {
    var ziele = document.querySelectorAll(".reveal");
    if (!ziele.length) return;
    if (!("IntersectionObserver" in window) ||
        window.matchMedia("(prefers-reduced-motion:reduce)").matches) {
      ziele.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }
    var beobachter = new IntersectionObserver(function (eintraege) {
      eintraege.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-in"); beobachter.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: .08 });
    ziele.forEach(function (el) { beobachter.observe(el); });
  }

  function start() {
    document.documentElement.classList.add("js");
    var jahr = document.getElementById("jahr");
    if (jahr) jahr.textContent = new Date().getFullYear();
    statusSetzen();
    heuteMarkieren();
    navAufbauen();
    revealAufbauen();
    setInterval(statusSetzen, 60000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
