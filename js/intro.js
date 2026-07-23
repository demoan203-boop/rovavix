(function () {
  var overlay = document.getElementById('introOverlay');
  if (!overlay) return;

  if (sessionStorage.getItem('rovavixIntroSeen')) {
    overlay.remove();
    return;
  }

  var body = document.body;
  var glow1 = document.getElementById('introGlow1');
  var glow2 = document.getElementById('introGlow2');
  var enterBtn = document.getElementById('introEnterBtn');

  body.classList.add('intro-active');

  var targetX = window.innerWidth / 2;
  var targetY = window.innerHeight / 2;
  var curX = targetX, curY = targetY;
  var curX2 = targetX, curY2 = targetY;
  var idle = true;
  var t = 0;
  var raf;

  function onMove(x, y) {
    idle = false;
    targetX = x;
    targetY = y;
  }
  window.addEventListener('mousemove', function (e) { onMove(e.clientX, e.clientY); });
  window.addEventListener('touchmove', function (e) {
    if (e.touches && e.touches[0]) onMove(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });

  function tick() {
    t += 0.008;
    if (idle) {
      targetX = window.innerWidth / 2 + Math.sin(t) * window.innerWidth * 0.2;
      targetY = window.innerHeight / 2 + Math.cos(t * 0.8) * window.innerHeight * 0.15;
    }
    curX += (targetX - curX) * 0.07;
    curY += (targetY - curY) * 0.07;
    curX2 += (targetX - curX2) * 0.035;
    curY2 += (targetY - curY2) * 0.035;

    glow1.style.left = curX + 'px';
    glow1.style.top = curY + 'px';
    glow2.style.left = (window.innerWidth - curX2) + 'px';
    glow2.style.top = curY2 + 'px';

    raf = requestAnimationFrame(tick);
  }
  tick();

  function closeIntro() {
    overlay.classList.add('intro-hidden');
    body.classList.remove('intro-active');
    sessionStorage.setItem('rovavixIntroSeen', '1');
    cancelAnimationFrame(raf);
    window.setTimeout(function () { overlay.remove(); }, 800);
  }

  enterBtn.addEventListener('click', closeIntro);
  window.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === 'Escape') closeIntro();
  });
})();
