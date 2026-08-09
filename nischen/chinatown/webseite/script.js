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
    document.querySelectorAll("[data-status]").forEach(statusEinzeln);
  }

  function statusEinzeln(el) {
    var text = el.querySelector("[data-status-text]");
    if (!text) return;
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
    document.querySelectorAll('.zeiten tr[data-tag="' + tag + '"]')
      .forEach(function (z) { z.setAttribute("data-heute", ""); });
  }

  /* ---- Tabs -------------------------------------------------------------
     Greift nur, wenn mehrere Seiten in einem Dokument liegen (Komplett-
     Vorschau). Auf der echten Webseite ist jede Seite eine eigene Datei —
     dort bleiben die Tabs ganz normale Verweise.                          */
  function tabsAufbauen() {
    var seiten = document.querySelectorAll("[data-seite]");
    if (seiten.length < 2) return;

    function zeige(name, ziel) {
      var gefunden = false;
      seiten.forEach(function (s) {
        var aktiv = s.getAttribute("data-seite") === name;
        s.classList.toggle("ist-aktiv", aktiv);
        if (aktiv) gefunden = true;
      });
      if (!gefunden) return false;
      document.querySelectorAll(".tabs a").forEach(function (a) {
        if (a.getAttribute("data-tab") === name) a.setAttribute("aria-current", "page");
        else a.removeAttribute("aria-current");
      });
      if (ziel) ziel.scrollIntoView({ block: "start" });
      else window.scrollTo(0, 0);
      return true;
    }

    /* Klicks abfangen. Bewusst NICHT über href^="#" gesucht: Vorschau-Dienste
       wie htmlpreview schreiben Verweise in absolute Adressen um, dann würde
       die Erkennung ins Leere laufen und der Klick die Seite verlassen.
       Deshalb zählt data-tab, ersatzweise der Teil hinter dem #.            */
    document.addEventListener("click", function (e) {
      var a = e.target.closest ? e.target.closest("a") : null;
      if (!a) return;

      var id = a.getAttribute("data-tab");
      if (!id) {
        var href = a.getAttribute("href") || "";
        if (href.indexOf("#") === -1) return;
        id = href.split("#").pop();
      }
      if (!id) return;

      var ziel = document.getElementById(id);
      if (!ziel) return;
      var seite = ziel.closest("[data-seite]");
      if (!seite) return;

      e.preventDefault();
      zeige(seite.getAttribute("data-seite"), ziel === seite ? null : ziel);
      try { history.replaceState(null, "", "#" + id); } catch (fehler) { /* egal */ }
    });

    window.addEventListener("hashchange", function () {
      zeige((location.hash || "").slice(1) || "start");
    });

    if (!zeige((location.hash || "").slice(1) || "start")) zeige("start");
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
    var j = String(new Date().getFullYear());
    document.querySelectorAll("#jahr, .jahr").forEach(function (e) { e.textContent = j; });
    statusSetzen();
    heuteMarkieren();
    tabsAufbauen();
    revealAufbauen();
    setInterval(statusSetzen, 60000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
