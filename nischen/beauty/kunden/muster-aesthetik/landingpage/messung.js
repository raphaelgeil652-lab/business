/* Messung für Meta und Google, nur nach Zustimmung. Jede Seite setzt vorher:
   window.MESSUNG = { pixel: 'PIXEL_ID oder Ziffern', gads: 'AW-…/… oder leer' }
   Die Seite „bestaetigen.html“ ruft nach einer echten Bestätigung window.messungMelden() auf:
   Meta bekommt „Lead“, Google die Conversion. Ohne Behandlungsnamen (Datenschutz, Meta-Regeln für Gesundheit). */
(function () {
  var M = window.MESSUNG || {}, KEY = 'lp-consent', offen = false;
  function getC() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function setC(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  function pixelOk() { return /^\d{10,20}$/.test(String(M.pixel || '')); }
  function gadsOk() { return /^AW-\d+\/[\w-]+$/.test(String(M.gads || '')); }
  function loadPixel() {
    if (window.fbq || !pixelOk()) return;
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;
    s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', M.pixel); fbq('track', 'PageView');
  }
  function loadGoogle() {
    if (window.gtag || !gadsOk()) return;
    var gid = M.gads.split('/')[0], gs = document.createElement('script');
    gs.async = true; gs.src = 'https://www.googletagmanager.com/gtag/js?id=' + gid; document.head.appendChild(gs);
    window.dataLayer = window.dataLayer || []; window.gtag = function () { dataLayer.push(arguments); };
    gtag('consent', 'default', { ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted', analytics_storage: 'granted' });
    gtag('js', new Date()); gtag('config', gid);
  }
  function laden() { loadPixel(); loadGoogle(); if (offen) melden(); }
  function melden() {
    if (getC() !== 'ja') { offen = true; return; }
    offen = false;
    loadPixel(); loadGoogle();
    if (window.fbq) fbq('track', 'Lead');
    if (window.gtag && gadsOk()) gtag('event', 'conversion', { send_to: M.gads });
  }
  window.messungMelden = melden;
  document.addEventListener('DOMContentLoaded', function () {
    var box = document.getElementById('consent'), c = getC();
    if (!box) return;
    if (c === 'ja') laden(); else if (c !== 'nein') box.classList.add('show');
    document.getElementById('consent-yes').onclick = function () { setC('ja'); box.classList.remove('show'); laden(); };
    document.getElementById('consent-no').onclick = function () { setC('nein'); box.classList.remove('show'); };
    var auf = document.getElementById('consent-open');
    if (auf) auf.onclick = function () { box.classList.add('show'); };
  });
})();
