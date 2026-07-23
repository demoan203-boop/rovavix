(function () {
  var overlay = document.getElementById('introOverlay');
  if (!overlay) return;

  if (sessionStorage.getItem('rovavixIntroSeen')) {
    overlay.remove();
    return;
  }

  var body = document.body;
  var canvas = document.getElementById('introCanvas');
  var ctx = canvas.getContext('2d');
  var enterBtn = document.getElementById('introEnterBtn');
  var glow1 = document.getElementById('introGlow1');
  var glow2 = document.getElementById('introGlow2');
  var aiLetterEls = Array.prototype.slice.call(document.querySelectorAll('.intro-ai-letter'));
  var letters = [];

  body.classList.add('intro-active');

  var CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  var WORDS = ['AI', 'DATA', 'NEURAL', 'AGENT', 'LOGIC', 'MODEL', 'LEARN', 'VISION',
    'SIGNAL', 'PATTERN', 'NETWORK', 'DEEP', 'TRAIN', 'PREDICT', 'INSIGHT', 'AUTOMATE',
    'MACHINE', 'COGNITION', 'ADAPT', 'SCALE', 'FUTURE', 'THINK', 'SENSE', 'TRUTH',
    'CONNECT', 'PROCESS', 'COMPUTE', 'REASON', 'GENERATE', 'OPTIMIZE', 'ALGORITHM',
    'INTELLIGENCE', 'ROVAVIX'];
  var ACCENTS = ['#ff5c5c', '#3ddc84', '#4d8dff'];
  var particles = [];
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var W = 0, H = 0;

  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildParticles();
    computeLetterCenters();
  }

  function computeLetterCenters() {
    letters = aiLetterEls.map(function (el) {
      var r = el.getBoundingClientRect();
      return { el: el, cx: r.left + r.width / 2, cy: r.top + r.height / 2 };
    });
  }

  function buildParticles() {
    var count = Math.floor((W * H) / 1100);
    particles = [];
    for (var i = 0; i < count; i++) {
      var baseX = Math.random() * W;
      var baseY = Math.random() * H;
      var colorRoll = Math.random();
      var isWord = Math.random() < 0.32;
      particles.push({
        baseX: baseX, baseY: baseY,
        x: baseX, y: baseY,
        char: isWord ? WORDS[Math.floor(Math.random() * WORDS.length)] : CHARS[Math.floor(Math.random() * CHARS.length)],
        size: isWord ? 9 + Math.random() * 6 : 10 + Math.random() * 11,
        alpha: 0.09 + Math.random() * 0.26,
        color: colorRoll < 0.06 ? ACCENTS[0] : colorRoll < 0.13 ? ACCENTS[1] : colorRoll < 0.20 ? ACCENTS[2] : '#ffffff',
        phase: Math.random() * Math.PI * 2,
        speed: 0.2 + Math.random() * 0.3,
        drift: 8 + Math.random() * 14
      });
    }
  }

  window.addEventListener('resize', resize);
  resize();

  var targetX = W / 2, targetY = H / 2;
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

  var REPEL_RADIUS = 140;
  var REPEL_STRENGTH = 46;
  var WAVE_RANGE = 260;
  var WAVE_AMPLITUDE = 30;

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(computeLetterCenters);
  }
  window.setTimeout(computeLetterCenters, 400);

  function tick() {
    t += 0.016;
    if (idle) {
      targetX = W / 2 + Math.sin(t * 0.5) * W * 0.22;
      targetY = H / 2 + Math.cos(t * 0.4) * H * 0.18;
    }
    curX += (targetX - curX) * 0.08;
    curY += (targetY - curY) * 0.08;
    curX2 += (targetX - curX2) * 0.035;
    curY2 += (targetY - curY2) * 0.035;

    glow1.style.left = curX + 'px';
    glow1.style.top = curY + 'px';
    glow2.style.left = (W - curX2) + 'px';
    glow2.style.top = curY2 + 'px';

    ctx.clearRect(0, 0, W, H);

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      var fx = p.baseX + Math.sin(t * p.speed + p.phase) * p.drift;
      var fy = p.baseY + Math.cos(t * p.speed * 0.8 + p.phase) * p.drift;

      var dx = fx - curX, dy = fy - curY;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < REPEL_RADIUS && dist > 0.01) {
        var force = (1 - dist / REPEL_RADIUS) * REPEL_STRENGTH;
        fx += (dx / dist) * force;
        fy += (dy / dist) * force;
      }
      p.x += (fx - p.x) * 0.15;
      p.y += (fy - p.y) * 0.15;

      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.font = p.size + 'px "DM Sans", monospace';
      ctx.fillText(p.char, p.x, p.y);
    }
    ctx.globalAlpha = 1;

    for (var j = 0; j < letters.length; j++) {
      var l = letters[j];
      var ldx = l.cx - curX, ldy = l.cy - curY;
      var ldist = Math.sqrt(ldx * ldx + ldy * ldy);
      var falloff = Math.max(0, 1 - ldist / WAVE_RANGE);
      var lift = falloff * falloff * -WAVE_AMPLITUDE;
      var scale = 1 + falloff * 0.08;
      l.el.style.transform = 'translateY(' + lift.toFixed(2) + 'px) scale(' + scale.toFixed(3) + ')';
    }

    raf = requestAnimationFrame(tick);
  }
  tick();

  function closeIntro() {
    overlay.classList.add('intro-hidden');
    body.classList.remove('intro-active');
    sessionStorage.setItem('rovavixIntroSeen', '1');
    cancelAnimationFrame(raf);
    window.removeEventListener('resize', resize);
    window.setTimeout(function () { overlay.remove(); }, 800);
  }

  enterBtn.addEventListener('click', closeIntro);
  window.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === 'Escape') closeIntro();
  });
})();
