let currentLang = 'en';

function toggleDropdown() {
  document.getElementById('langDropdown').classList.toggle('open');
}
document.addEventListener('click', function(e) {
  if (!e.target.closest('.lang-select-wrap')) {
    document.getElementById('langDropdown').classList.remove('open');
  }
});
function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('rovavix_lang', lang);
  const data = LANGS[lang];
  document.documentElement.lang = lang;
  document.body.className = (lang === 'en' || lang === 'es' || lang === 'de') ? '' : 'lang-' + lang;
  document.getElementById('currentFlag').textContent = data.flag;
  document.getElementById('currentLangName').textContent = data.name;
  document.querySelectorAll('.lang-option').forEach(function(btn) {
    const btnLang = btn.getAttribute('onclick').replace("setLang('","").replace("')","");
    btn.classList.toggle('active', btnLang === lang);
  });
  document.querySelectorAll('.t[data-key]').forEach(function(el) {
    const key = el.getAttribute('data-key');
    if (data[key] !== undefined) el.innerHTML = data[key];
  });
  document.getElementById('langDropdown').classList.remove('open');
}
var savedLang = localStorage.getItem('rovavix_lang');
if (savedLang && LANGS[savedLang] && savedLang !== 'en') { setLang(savedLang); }

document.querySelectorAll('a[href^="#"]').forEach(function(a) {
  a.addEventListener('click', function(e) {
    var href = a.getAttribute('href');
    if (href.length < 2) { e.preventDefault(); return; }
    var target = document.querySelector(href);
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  });
});

/* HERO SLIDER */
(function() {
  var slider = document.getElementById('heroSlider');
  var track = document.getElementById('heroTrack');
  var dotsWrap = document.getElementById('heroDots');
  if (!slider || !track) return;

  var slides = Array.prototype.slice.call(track.children);
  var index = 0;
  var timer = null;
  var interval = 6000;

  slides.forEach(function(_, i) {
    var dot = document.createElement('button');
    dot.className = 'hero-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Slide ' + (i + 1));
    dot.addEventListener('click', function() { goTo(i); restart(); });
    dotsWrap.appendChild(dot);
  });
  var dots = Array.prototype.slice.call(dotsWrap.children);

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    track.style.transform = 'translateX(-' + (index * 100) + '%)';
    dots.forEach(function(d, di) { d.classList.toggle('active', di === index); });
  }
  function next() { goTo(index + 1); }
  function start() { timer = setInterval(next, interval); }
  function stop() { clearInterval(timer); }
  function restart() { stop(); start(); }

  slider.addEventListener('mouseenter', stop);
  slider.addEventListener('mouseleave', start);

  start();
})();
