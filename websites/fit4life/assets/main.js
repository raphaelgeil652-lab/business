// Mobile-Navigation ein-/ausblenden
(function () {
  var toggle = document.querySelector('.nav__toggle');
  var links = document.querySelector('.nav__links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', function () {
    var open = links.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  // Menue schliessen, wenn ein Link angeklickt wird (mobil)
  links.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') links.classList.remove('is-open');
  });

  // Jahr im Footer automatisch setzen
  var y = document.querySelector('[data-year]');
  if (y) y.textContent = new Date().getFullYear();
})();
