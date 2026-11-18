/* Thème de Noël : bouton à côté du numéro de version, mémorisation du choix, activation automatique en décembre.
   Tout est figé si l'appareil réduit les animations. */
(function () {
  var KEY = 'gite-theme', root = document.documentElement;
  var still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fx = null; // éléments et minuteurs actifs

  /* ---------- Mémoire du choix ----------
     « noel » = activé à la main · « off-ANNÉE » = désactivé à la main cette année-là.
     Sans choix, le thème est actif par défaut du 1er au 26 décembre (inclus), tous les ans. */
  function inSeason(d) { return d.getMonth() === 11 && d.getDate() <= 26; }
  function readPref() {
    var v = null;
    try { v = localStorage.getItem(KEY); } catch (e) {}
    if (!v) { var m = document.cookie.match(/(?:^|; )gite-theme=([^;]+)/); v = m && m[1]; } // secours si localStorage est bloqué
    return v;
  }
  function writePref(v) {
    try { localStorage.setItem(KEY, v); } catch (e) {}
    try { document.cookie = KEY + '=' + v + ';max-age=31536000;path=/;SameSite=Lax'; } catch (e) {}
  }
  function wanted() {
    var v = readPref(), n = new Date();
    if (v === 'noel') return true;
    if (v === 'off-' + n.getFullYear()) return false;
    return inSeason(n);
  }

  function el(tag, cls, parent) { var e = document.createElement(tag); if (cls) e.className = cls; (parent || document.body).appendChild(e); return e; }
  function rnd(a, b) { return a + Math.random() * (b - a); }

  /* ---------- Polices du thème (chargées seulement quand il est actif) ---------- */
  function loadFonts() {
    if (document.getElementById('noel-fonts')) return;
    var l = document.createElement('link'); l.id = 'noel-fonts'; l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Inter:wght@400;500;600&display=swap';
    document.head.appendChild(l);
  }

  /* ---------- Guirlande : fil en arcs de 150 à 240 px, une ampoule tous les 36 px ---------- */
  var COLORS = ['#ff3b3b', '#ffd54f', '#4caf50', '#42a5f5', '#ff7043'];
  function buildGarland(g) {
    var w = root.clientWidth, NS = 'http://www.w3.org/2000/svg';
    g.innerHTML = '';
    var svg = document.createElementNS(NS, 'svg'); svg.setAttribute('width', w); svg.setAttribute('height', 34);
    var d = 'M0 5', x = 0, arcs = [];
    while (x < w) { var len = rnd(150, 240), sag = rnd(9, 13); d += ' Q' + (x + len / 2) + ' ' + (5 + 2 * sag) + ' ' + (x + len) + ' 5'; arcs.push({ x0: x, len: len, sag: sag }); x += len; }
    var p = document.createElementNS(NS, 'path'); p.setAttribute('d', d); p.setAttribute('fill', 'none'); p.setAttribute('stroke', '#2d5a3f'); p.setAttribute('stroke-width', '2.2');
    svg.appendChild(p); g.appendChild(svg);
    for (var i = 0, bx = 18, a = 0; bx < w; i++, bx += 36) {
      while (a < arcs.length - 1 && bx > arcs[a].x0 + arcs[a].len) a++;
      var A = arcs[a], t = Math.min(1, Math.max(0, (bx - A.x0) / A.len)), y = 5 + 4 * A.sag * t * (1 - t);
      var b = el('span', 'b', g);
      b.style.cssText = '--c:' + COLORS[i % COLORS.length] + ';left:' + bx + 'px;top:' + (y + 1) + 'px;animation-delay:-' + ((i * 0.37) % 1.9).toFixed(2) + 's';
    }
  }

  /* ---------- Neige + étoiles scintillantes (un seul canvas) ---------- */
  function startSnow(state) {
    var cv = el('canvas', 'noel-snow'); cv.setAttribute('aria-hidden', 'true');
    var ctx = cv.getContext('2d'), W, H, flakes = [], stars = [], wind = 0, windT = 0, last = 0, raf = 0;
    function setup() {
      W = root.clientWidth; H = window.innerHeight;
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.round(Math.min(110, Math.max(40, W * H / 9000)));
      flakes = []; for (var i = 0; i < n; i++) {
        var r = 0.8 + Math.pow(Math.random(), 1.6) * 2.6;
        flakes.push({ x: Math.random() * W, y: Math.random() * H, r: r, v: 0.25 + (r - 0.8) / 2.6 * 1.1, ph: Math.random() * 6.28, o: Math.min(0.95, 0.35 + Math.random() * 0.6) });
      }
      stars = []; for (var k = 0; k < 12; k++) stars.push({ x: Math.random() * W, y: Math.random() * H * 0.6, r: rnd(2.5, 5), ph: Math.random() * 6.28 });
    }
    function star(s, t) {
      var a = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t / 2800 * 6.283 + s.ph));
      ctx.globalAlpha = a; ctx.strokeStyle = '#fff8e1'; ctx.lineWidth = 1.1; ctx.lineCap = 'round'; ctx.beginPath();
      for (var j = 0; j < 4; j++) { var ang = j * Math.PI / 4, L = (j % 2 === 0) ? s.r : s.r * 0.55;
        ctx.moveTo(s.x - Math.cos(ang) * L, s.y - Math.sin(ang) * L); ctx.lineTo(s.x + Math.cos(ang) * L, s.y + Math.sin(ang) * L); }
      ctx.stroke(); ctx.beginPath(); ctx.arc(s.x, s.y, 0.9, 0, 6.283); ctx.fillStyle = '#fff'; ctx.fill();
    }
    function draw(t, dt) {
      ctx.clearRect(0, 0, W, H);
      stars.forEach(function (s) { star(s, t); });
      wind += (windT - wind) * 0.04; ctx.fillStyle = '#fff';
      flakes.forEach(function (f) {
        if (dt) { f.y += f.v * dt; f.ph += 0.012 * dt; f.x += Math.sin(f.ph) * 0.35 * dt + wind * (0.4 + f.r * 0.25) * dt;
          if (f.y > H + 4) { f.y = -4; f.x = Math.random() * W; } if (f.x > W + 4) f.x = -4; else if (f.x < -4) f.x = W + 4; }
        ctx.globalAlpha = f.o; ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, 6.283); ctx.fill();
      });
      ctx.globalAlpha = 1;
    }
    function loop(t) { var dt = last ? Math.min(3, (t - last) / 16.7) : 1; last = t; draw(t, dt); raf = requestAnimationFrame(loop); }
    function run() { if (!raf && !still) { last = 0; raf = requestAnimationFrame(loop); } }
    function stop() { if (raf) { cancelAnimationFrame(raf); raf = 0; } }
    function vis() { document.hidden ? stop() : run(); }
    function mouse(e) { windT = (e.clientX / W - 0.5) * 1.2; }
    var rt; function rs() { clearTimeout(rt); rt = setTimeout(function () { setup(); if (still) draw(0, 0); }, 150); }
    setup(); if (still) draw(0, 0); else run();
    document.addEventListener('visibilitychange', vis); window.addEventListener('resize', rs); window.addEventListener('mousemove', mouse, { passive: true });
    state.undo.push(function () { stop(); document.removeEventListener('visibilitychange', vis); window.removeEventListener('resize', rs); window.removeEventListener('mousemove', mouse); clearTimeout(rt); cv.remove(); });
  }

  /* ---------- Traîneau : première fois 5 s après l'activation, puis toutes les 25 à 50 s ---------- */
  function startSleigh(state) {
    if (still) return;
    var timer;
    function schedule(ms) { timer = setTimeout(launch, ms); }
    function launch() {
      if (document.hidden) { schedule(rnd(25000, 50000)); return; }
      var vw = root.clientWidth, vh = window.innerHeight, w = Math.min(vw * 0.64, 300), dir = Math.random() < 0.5 ? 1 : -1;
      var img = el('img', 'noel-sleigh'); img.src = 'assets/noel/sleigh.svg'; img.alt = ''; img.setAttribute('aria-hidden', 'true');
      img.style.width = w + 'px'; img.style.top = (vh * rnd(0.30, 0.52)) + 'px';
      var flip = dir > 0 ? '' : ' scaleX(-1)', from = dir > 0 ? -w : vw, to = dir > 0 ? vw : -w;
      var a = img.animate([
        { transform: 'translateX(' + from + 'px)' + flip, opacity: 0 }, { opacity: 0.88, offset: 0.08 }, { opacity: 0.88, offset: 0.92 },
        { transform: 'translateX(' + to + 'px)' + flip, opacity: 0 }], { duration: rnd(10000, 13500), easing: 'linear' });
      a.onfinish = function () { img.remove(); schedule(rnd(25000, 50000)); };
      state.cur = img;
    }
    schedule(5000);
    state.undo.push(function () { clearTimeout(timer); if (state.cur) state.cur.remove(); document.querySelectorAll('.noel-sleigh').forEach(function (n) { n.remove(); }); });
  }

  /* ---------- Décor de confiserie posé sur la neige du pied de page ----------
     Le profil de la neige (SURF, unités du dessin 1200 x 60, pas de 10) permet de poser chaque objet sur le relief réel,
     enfoncé de quelques pixels, quelle que soit la largeur de l'écran. */
  var SURF = [26.0,24.1,22.3,20.6,19.1,17.7,16.4,15.3,14.3,13.3,12.5,11.8,11.2,10.8,10.4,10.1,9.9,9.8,9.7,9.8,10.0,10.2,10.5,10.9,11.4,11.9,12.5,13.2,13.9,14.7,15.6,16.5,17.5,18.5,19.6,20.8,22.0,23.2,24.5,25.6,26.6,27.7,28.7,29.8,30.7,31.6,32.4,33.2,33.9,34.6,35.2,35.8,36.3,36.8,37.2,37.5,37.8,38.0,38.1,38.2,38.3,38.2,38.1,38.0,37.8,37.5,37.1,36.7,36.2,35.7,35.1,34.4,33.7,32.8,32.0,31.1,30.2,29.0,28.0,26.9,25.8,24.8,23.7,22.6,21.6,20.7,19.8,18.9,17.9,17.1,16.4,15.6,14.9,14.3,13.6,13.0,12.5,12.0,11.6,11.2,10.9,10.7,10.5,10.4,10.3,10.3,10.3,10.4,10.6,10.9,11.2,11.6,12.0,12.6,13.1,13.8,14.5,15.3,16.1,17.0,18.0];
  var STRIP_H = 46, STRIP_TOP = -43; // bande de neige : 46 px de haut, son haut est à 43 px au-dessus du pied de page
  var ITEMS = [ // [image, classe, largeur, hauteur/largeur, position (0 à 1), enfoncement px, visible sur petit écran]
    ['cane', 'cane', 32, 50 / 26, 0.02, 5, 1], ['lollipop', 'lol', 25, 41 / 20, 0.17, 5, 1], ['bonbon', 'bon', 34, 16 / 26, 0.33, 3, 0],
    ['house', 'house', 92, 62 / 72, 0.50, 4, 1], ['bonbon', 'bon', 34, 16 / 26, 0.67, 3, 0], ['lollipop', 'lol', 25, 41 / 20, 0.83, 5, 1], ['cane', 'cane flip', 32, 50 / 26, 0.98, 5, 1]];
  function surfaceY(xpx, W) { // hauteur de la neige (px, repère du pied de page) à l'abscisse xpx
    var u = Math.max(0, Math.min(1200, xpx / W * 1200)) / 10, i = Math.floor(u), f = u - i, y = SURF[i] + (SURF[Math.min(i + 1, 120)] - SURF[i]) * f;
    return STRIP_TOP + y * STRIP_H / 60;
  }
  function placeDecor(d, f) {
    var W = f.clientWidth, small = W < 700, k = small ? 0.75 : 1, colW = Math.min(1080, W) - 40, x0 = (W - Math.min(1080, W)) / 2 + 20;
    d.innerHTML = '';
    ITEMS.forEach(function (it) {
      if (small && !it[6]) return;
      var w = it[2] * k, h = w * it[3], cx = x0 + it[4] * colW, left = Math.max(0, Math.min(W - w, cx - w / 2));
      var low = -1e9; for (var s = 0; s <= 4; s++) low = Math.max(low, surfaceY(left + w * s / 4, W)); // point le plus bas de la neige sous l'objet
      var i = el('img', it[1], d); i.src = 'assets/noel/' + it[0] + '.svg'; i.alt = '';
      i.style.cssText = 'width:' + w + 'px;left:' + left.toFixed(1) + 'px;top:' + (low + it[5] - h).toFixed(1) + 'px';
    });
  }
  function buildDecor(state) {
    var f = document.querySelector('footer'); if (!f) return;
    var d = el('div', 'noel-decor', f); d.setAttribute('aria-hidden', 'true'); placeDecor(d, f);
    var w0 = f.clientWidth, rt;
    function rs() { clearTimeout(rt); rt = setTimeout(function () { if (f.clientWidth !== w0) { w0 = f.clientWidth; placeDecor(d, f); } }, 150); }
    window.addEventListener('resize', rs);
    state.undo.push(function () { window.removeEventListener('resize', rs); clearTimeout(rt); d.remove(); });
  }

  /* ---------- Activation / désactivation ---------- */
  function on() {
    if (fx) return;
    fx = { undo: [] };
    root.classList.add('noel'); if (still) root.classList.add('noel-still');
    loadFonts();
    var g = el('div', 'noel-garland'); g.setAttribute('aria-hidden', 'true'); buildGarland(g);
    var gw = root.clientWidth, rt;
    function gr() { clearTimeout(rt); rt = setTimeout(function () { if (root.clientWidth !== gw) { gw = root.clientWidth; buildGarland(g); } }, 200); }
    window.addEventListener('resize', gr);
    fx.undo.push(function () { window.removeEventListener('resize', gr); clearTimeout(rt); g.remove(); });
    startSnow(fx); buildDecor(fx); startSleigh(fx);
  }
  function off() {
    if (!fx) { root.classList.remove('noel', 'noel-still'); return; }
    fx.undo.forEach(function (u) { u(); }); fx = null;
    root.classList.remove('noel', 'noel-still');
  }
  function sync(btn) {
    var a = !!fx; btn.setAttribute('aria-pressed', a ? 'true' : 'false');
    btn.setAttribute('aria-label', a ? 'Désactiver le thème de Noël' : 'Activer le thème de Noël');
    btn.title = a ? 'Désactiver le thème de Noël' : 'Activer le thème de Noël';
  }
  function init() {
    var btn = document.querySelector('.noel-btn');
    if (wanted()) on();
    if (btn) {
      sync(btn);
      btn.addEventListener('click', function () {
        if (fx) { off(); writePref('off-' + new Date().getFullYear()); } else { on(); writePref('noel'); }
        sync(btn);
      });
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
