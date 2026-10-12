/* ALethea: entrance. Load in <head> (sync, tiny). Builds its own DOM, so index.html needs no markup.
   Flow: screen 1 = animated 2D spiral galaxy (visitor must click/tap) -> screen 2 = the ALethea entrance (solar system, galaxy-portal
   background, ENTER button) -> the unchanged site. Shows once per browser session. Never traps: Esc moves forward on each screen.
   Skipped for admin/login/OAuth-return URLs and when the dashboard switch turns the welcome off. */
(function () {
"use strict";
var root = document.documentElement, KEY = "alethea.entered", pending = false;
function seen() { try { return sessionStorage.getItem(KEY) === "1"; } catch (e) { return false; } }
function mark() { try { sessionStorage.setItem(KEY, "1"); } catch (e) {} }
function skipUrl() { return /[?&]code=/.test(location.search) || /^#\/(admin|login|register|dashboard)/.test(location.hash); }
function off() { try { var d = JSON.parse(localStorage.getItem("alethea.data.v1") || "null"); return !!(d && d.sections && d.sections.welcome === false); } catch (e) { return false; } } /* dashboard toggle */
if (seen() || skipUrl() || off()) return;

function release() { root.classList.remove("wl-pending"); pending = false; }
root.classList.add("wl-pending"); pending = true;

function motionOff() {
  var r = false;
  try { r = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}
  try { var t = JSON.parse(localStorage.getItem("alethea.theme.v1") || "null"); if (t && Number(t.motion) === 0) r = true; } catch (e) {}
  return r;
}
function lite() { try { return (navigator.hardwareConcurrency || 8) <= 4 || (navigator.deviceMemory || 8) <= 2; } catch (e) { return false; } }
function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text) n.textContent = text; return n; }
function rng(seed) { return function () { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }; }
function offscreen(S) { var c = document.createElement("canvas"); c.width = c.height = S; return c; }

/* Pre-rendered spiral galaxy (drawn once, then only rotated each frame, which is very cheap) */
function galaxyBitmap(S, light) {
  var c = offscreen(S), g = c.getContext("2d"), R = S / 2, rnd = rng(7), sc = S / 1000, i, k, first;
  var arm = ["59,130,246", "34,211,238", "139,92,246", "16,217,160"];
  function th(k, r) { return k * 1.5708 + (r / R) * 5.4; }
  g.globalCompositeOperation = "lighter";
  var halo = g.createRadialGradient(R, R, 0, R, R, R);
  halo.addColorStop(0, "rgba(255,255,255,.95)"); halo.addColorStop(.03, "rgba(210,246,255,.85)"); halo.addColorStop(.09, "rgba(70,200,255,.5)");
  halo.addColorStop(.25, "rgba(59,130,246,.22)"); halo.addColorStop(.55, "rgba(139,92,246,.09)"); halo.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = halo; g.fillRect(0, 0, S, S);
  g.lineCap = g.lineJoin = "round";
  for (k = 0; k < 4; k++) {                                          // nebula arms: three stacked strokes = soft glow without blur filters
    var main = k % 2 === 0;
    [[.17, .045], [.09, .08], [.035, .15]].forEach(function (L) {
      g.beginPath(); first = true;
      for (var r = R * .05; r <= R * .98; r += R * .012) { var a = th(k, r), x = R + r * Math.cos(a), y = R + r * Math.sin(a); if (first) { g.moveTo(x, y); first = false; } else g.lineTo(x, y); }
      var gr = g.createRadialGradient(R, R, 0, R, R, R);
      gr.addColorStop(0, "rgba(255,255,255,.9)"); gr.addColorStop(.14, "rgba(" + arm[k] + ",.95)"); gr.addColorStop(.75, "rgba(" + arm[k] + ",.45)"); gr.addColorStop(1, "rgba(" + arm[k] + ",0)");
      g.strokeStyle = gr; g.lineWidth = R * L[0] * (main ? 1 : .7); g.globalAlpha = L[1] * (main ? 1 : .75); g.stroke();
    });
  }
  g.globalCompositeOperation = "source-over"; g.globalAlpha = .3; g.strokeStyle = "rgb(3,5,20)"; g.lineWidth = R * .02;   // dust lanes
  [0, 2].forEach(function (k) { g.beginPath(); first = true; for (var r = R * .1; r <= R * .95; r += R * .015) { var a = th(k, r) + .17, x = R + r * Math.cos(a), y = R + r * Math.sin(a); if (first) { g.moveTo(x, y); first = false; } else g.lineTo(x, y); } g.stroke(); });
  g.globalCompositeOperation = "lighter"; g.globalAlpha = 1;
  var N = light ? 1500 : 3200;
  for (i = 0; i < N; i++) {                                           // stars hug the arms; bright and warm near the core, cool and violet outside
    var k2 = (rnd() * 4) | 0, t = Math.pow(rnd(), 1.1), r2 = R * (.03 + .95 * t), jit = (rnd() + rnd() + rnd() - 1.5) * (.28 + .55 * t);
    var a2 = rnd() < .22 ? rnd() * 6.283 : th(k2, r2) + jit, x2 = R + r2 * Math.cos(a2), y2 = R + r2 * Math.sin(a2);
    var col = t < .22 ? (rnd() < .6 ? "255,255,255" : "190,240,255") : t < .6 ? (rnd() < .5 ? "170,215,255" : "120,230,255") : (rnd() < .5 ? "200,180,255" : "150,245,215");
    g.fillStyle = "rgba(" + col + "," + (.35 + rnd() * .65).toFixed(2) + ")"; var s = (.7 + rnd() * 1.6) * Math.max(1, sc * 1.4); g.fillRect(x2, y2, s, s);
  }
  var core = g.createRadialGradient(R, R, 0, R, R, R * .12);
  core.addColorStop(0, "rgba(255,255,255,1)"); core.addColorStop(.35, "rgba(200,245,255,.75)"); core.addColorStop(1, "rgba(60,170,255,0)");
  g.fillStyle = core; g.fillRect(0, 0, S, S);
  return c;
}

/* Pre-rendered vortex layer for the portal background */
function swirlBitmap(S, n, dir, cols) {
  var c = offscreen(S), g = c.getContext("2d"), R = S / 2, j, first;
  g.lineCap = "round"; g.globalCompositeOperation = "lighter";
  for (j = 0; j < n; j++) {
    [[.15, .05], [.08, .1], [.03, .22]].forEach(function (L) {
      g.beginPath(); first = true;
      for (var r = R * .05; r <= R * .98; r += R * .012) { var a = j * 6.2832 / n + dir * (r / R) * 5.2, x = R + r * Math.cos(a), y = R + r * Math.sin(a); if (first) { g.moveTo(x, y); first = false; } else g.lineTo(x, y); }
      g.strokeStyle = "rgb(" + cols[j % cols.length] + ")"; g.lineWidth = R * L[0]; g.globalAlpha = L[1]; g.stroke();
    });
  }
  g.globalCompositeOperation = "destination-in"; g.globalAlpha = 1;       // fade the middle and the rim so it reads as a vortex
  var m = g.createRadialGradient(R, R, 0, R, R, R);
  m.addColorStop(0, "rgba(0,0,0,0)"); m.addColorStop(.07, "rgba(0,0,0,0)"); m.addColorStop(.25, "rgba(0,0,0,1)"); m.addColorStop(.62, "rgba(0,0,0,.85)"); m.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = m; g.fillRect(0, 0, S, S);
  return c;
}

/* ---------- Screen 1: animated 2D galaxy. The visitor must click/tap (or press Enter/Space/Esc) ---------- */
function galaxyScreen(next) {
  var still = motionOff(), light = lite(), w = el("div");
  w.id = "wlGalaxy"; w.lang = "en"; w.setAttribute("role", "dialog"); w.setAttribute("aria-modal", "true"); w.setAttribute("aria-label", "ALethea galaxy");
  if (still) w.classList.add("wl-still");
  var cv = el("canvas", "wl-gx-cv"); cv.setAttribute("aria-hidden", "true");
  var hint = el("p", "wl-gx-hint", "TOUCH THE GALAXY TO ENTER"), btn = el("button", "wl-gx-btn"); btn.type = "button"; btn.setAttribute("aria-label", "Touch the galaxy to enter");
  w.appendChild(cv); w.appendChild(hint); w.appendChild(btn); document.body.appendChild(w);
  var ctx = cv.getContext && cv.getContext("2d");
  if (!ctx) { document.body.removeChild(w); next(); return; }
  var W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 1.5), bmp = null, twk = [], dust = [], raf = 0, last = 0, done = false, rt = 0, shoot = null, nextShoot = 3500, DC = ["59,130,246", "34,211,238", "139,92,246", "16,217,160"];

  function draw(t) {
    ctx.clearRect(0, 0, W, H); ctx.globalCompositeOperation = "lighter"; ctx.globalAlpha = 1;
    var k = W > H ? .86 : 1, d = Math.max(W, H) * 1.02, i, s;
    ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(1, k); ctx.rotate(still ? 0 : t * .000045); ctx.drawImage(bmp, -d / 2, -d / 2, d, d); ctx.restore();
    var cr = d * .07 * (still ? 1 : 1 + .035 * Math.sin(t * .0014)), g = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, cr);
    g.addColorStop(0, "rgba(255,255,255,.55)"); g.addColorStop(1, "rgba(80,190,255,0)"); ctx.fillStyle = g; ctx.fillRect(W / 2 - cr, H / 2 - cr, cr * 2, cr * 2);
    for (i = 0; i < twk.length; i++) { s = twk[i]; ctx.globalAlpha = still ? .6 : .2 + .8 * (.5 + .5 * Math.sin(t * s.s + s.p)); ctx.fillStyle = "rgb(" + s.c + ")"; ctx.fillRect(s.x, s.y, s.r, s.r); }
    for (i = 0; i < dust.length; i++) {
      s = dust[i]; if (!still) { s.x += s.vx; s.y += s.vy; if (s.x < -5) s.x = W + 5; else if (s.x > W + 5) s.x = -5; if (s.y < -5) s.y = H + 5; else if (s.y > H + 5) s.y = -5; }
      ctx.globalAlpha = s.a; ctx.fillStyle = "rgb(" + s.c + ")"; ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.283); ctx.fill();
    }
    if (!still) {                                                        // rare shooting star
      if (!shoot && t > nextShoot) { var ag = .5 + Math.random() * .35; shoot = { x: Math.random() * W * .6, y: Math.random() * H * .3, vx: Math.cos(ag) * 10, vy: Math.sin(ag) * 10, l: 0 }; nextShoot = t + 6000 + Math.random() * 6000; }
      if (shoot) {
        shoot.x += shoot.vx; shoot.y += shoot.vy; shoot.l++; ctx.globalAlpha = Math.max(0, 1 - shoot.l / 50);
        var tx = shoot.x - shoot.vx * 9, ty = shoot.y - shoot.vy * 9, sg = ctx.createLinearGradient(shoot.x, shoot.y, tx, ty); sg.addColorStop(0, "rgba(255,255,255,1)"); sg.addColorStop(1, "rgba(120,200,255,0)");
        ctx.strokeStyle = sg; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(shoot.x, shoot.y); ctx.lineTo(tx, ty); ctx.stroke(); if (shoot.l > 50) shoot = null;
      }
    }
    ctx.globalAlpha = 1;
  }
  function size() {
    W = innerWidth; H = innerHeight; cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    bmp = galaxyBitmap(Math.min(light ? 900 : 1500, Math.round(Math.max(W, H) * dpr * 1.05)), light);
    var i, n = light ? 90 : 170, m = light ? 24 : 48; twk = []; dust = [];
    for (i = 0; i < n; i++) twk.push({ x: Math.random() * W, y: Math.random() * H, p: Math.random() * 6.283, s: .0008 + Math.random() * .0022, r: .6 + Math.random() * 1.2, c: Math.random() < .4 ? "190,240,255" : "255,255,255" });
    for (i = 0; i < m; i++) dust.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .12, vy: (Math.random() - .5) * .12, r: 1 + Math.random() * 2.4, a: .08 + Math.random() * .18, c: DC[i % 4] });
    draw(last || 0);
  }
  function loop(ts) { raf = requestAnimationFrame(loop); if (document.hidden) return; if (light && ts - last < 32) return; last = ts; draw(ts); }
  function onResize() { clearTimeout(rt); rt = setTimeout(size, 160); }
  function onKey(e) { if (e.key === "Escape") { e.preventDefault(); proceed(); } }
  function ripple(e) {                                                   // visual feedback exactly where the visitor touched
    if (still) return; var r = el("i", "wl-rip"); r.style.left = (e && e.detail ? e.clientX : W / 2) + "px"; r.style.top = (e && e.detail ? e.clientY : H / 2) + "px";
    w.appendChild(r); setTimeout(function () { if (r.parentNode) r.parentNode.removeChild(r); }, 900);
  }
  function proceed() {
    if (done) return; done = true; document.removeEventListener("keydown", onKey);
    w.classList.add("wl-gx-go"); next();                                // the entrance is built underneath while the galaxy zooms and fades
    setTimeout(function () { cancelAnimationFrame(raf); removeEventListener("resize", onResize); clearTimeout(rt); if (w.parentNode) w.parentNode.removeChild(w); }, still ? 220 : 1000);
  }
  size(); if (!still) raf = requestAnimationFrame(loop);
  addEventListener("resize", onResize); btn.addEventListener("click", function (e) { ripple(e); proceed(); }); document.addEventListener("keydown", onKey);
  try { btn.focus({ preventScroll: true }); } catch (e) {}
}

/* Extra pre-rendered layers for the portal background: fine concentric/radial/geometric pattern + a static star field */
function patternBitmap(S) {
  var c = offscreen(S), g = c.getContext("2d"), R = S / 2, u = S / 1000, i, a;
  g.translate(R, R); g.lineCap = "round";
  [[.2, [2, 9], "130,225,255"], [.29, [1, 5], "170,150,255"], [.38, [14, 18], "130,225,255"], [.5, [1, 4], "120,240,200"], [.64, [26, 20], "170,150,255"], [.82, [3, 13], "130,225,255"]].forEach(function (d) {
    g.beginPath(); g.setLineDash([d[1][0] * u * 1.6, d[1][1] * u * 1.6]); g.lineWidth = Math.max(1, u * 1.4); g.strokeStyle = "rgba(" + d[2] + ",.34)"; g.arc(0, 0, R * d[0], 0, 6.2832); g.stroke();
  });
  g.setLineDash([]);
  for (i = 0; i < 48; i++) {
    a = i * 6.2832 / 48; var lg = i % 6 === 0, r0 = R * (lg ? .12 : .3), r1 = R * (lg ? .95 : .55);
    g.beginPath(); g.moveTo(Math.cos(a) * r0, Math.sin(a) * r0); g.lineTo(Math.cos(a) * r1, Math.sin(a) * r1); g.strokeStyle = "rgba(150,200,255," + (lg ? .14 : .06) + ")"; g.lineWidth = Math.max(1, u * (lg ? 1.6 : 1)); g.stroke();
  }
  [[6, .58, 0], [3, .42, .5]].forEach(function (p) {                    // hexagon + triangle
    g.beginPath(); for (i = 0; i <= p[0]; i++) { a = p[2] + i * 6.2832 / p[0]; var x = Math.cos(a) * R * p[1], y = Math.sin(a) * R * p[1]; if (i) g.lineTo(x, y); else g.moveTo(x, y); }
    g.strokeStyle = "rgba(200,180,255,.22)"; g.lineWidth = Math.max(1, u * 1.4); g.stroke();
  });
  g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = "destination-in";
  var m = g.createRadialGradient(R, R, 0, R, R, R); m.addColorStop(0, "rgba(0,0,0,0)"); m.addColorStop(.1, "rgba(0,0,0,.2)"); m.addColorStop(.25, "rgba(0,0,0,1)"); m.addColorStop(.75, "rgba(0,0,0,.9)"); m.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = m; g.fillRect(0, 0, S, S); return c;
}
function starBitmap(W, H, dpr, light) {
  var c = document.createElement("canvas"); c.width = Math.round(W * dpr); c.height = Math.round(H * dpr); var g = c.getContext("2d"); g.scale(dpr, dpr);
  var n = Math.round(W * H / (light ? 5200 : 2600)), rnd = rng(31), i, x, y, r;
  for (i = 0; i < n; i++) {
    x = rnd() * W; y = rnd() * H; r = .4 + Math.pow(rnd(), 3) * 1.9;
    g.globalAlpha = .25 + rnd() * .6; g.fillStyle = rnd() < .22 ? "#a8e8ff" : rnd() < .5 ? "#cfd6ff" : "#ffffff"; g.fillRect(x, y, r, r);
    if (r > 1.9 && !light) { g.globalAlpha = .25; g.fillRect(x - r * 2, y + r / 2 - .4, r * 5, .8); g.fillRect(x + r / 2 - .4, y - r * 2, .8, r * 5); }   // a few stars get a soft cross glint
  }
  return c;
}

/* ---------- Entrance background: giant galaxy portal (vortex + tunnel rings + luminous center) ---------- */
function portal(w, scene, still, light) {
  var cv = el("canvas", "wl-portal"); cv.setAttribute("aria-hidden", "true"); w.insertBefore(cv, w.firstChild);
  var ctx = cv.getContext && cv.getContext("2d"); if (!ctx) return function () {};
  var dpr = Math.min(window.devicePixelRatio || 1, 1.5), W = 0, H = 0, cx = 0, cy = 0, big = 0, A = null, B = null, raf = 0, last = 0, rt = 0, C = null, SB = null, cols = ["34,211,238", "59,130,246", "139,92,246", "16,217,160", "34,211,238"];
  function draw(t) {
    ctx.clearRect(0, 0, W, H); ctx.globalCompositeOperation = "lighter"; ctx.globalAlpha = 1;
    if (SB) ctx.drawImage(SB, 0, 0, W, H);
    for (var q = 0; q < 3; q++) {                                      // slow drifting nebula clouds
      var ang = still ? q * 2.1 : t * .00007 + q * 2.1, bx = cx + Math.cos(ang) * big * .22, by = cy + Math.sin(ang * 1.3) * big * .16, br = big * .2, bg = ctx.createRadialGradient(bx, by, 0, bx, by, br);
      bg.addColorStop(0, "rgba(" + cols[q] + ",.10)"); bg.addColorStop(1, "rgba(" + cols[q] + ",0)"); ctx.fillStyle = bg; ctx.fillRect(bx - br, by - br, br * 2, br * 2);
    }
    var g = ctx.createRadialGradient(cx, cy, 0, cx, cy, big * .4);
    g.addColorStop(0, "rgba(120,220,255,.35)"); g.addColorStop(.25, "rgba(59,130,246,.18)"); g.addColorStop(.6, "rgba(139,92,246,.07)"); g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(still ? 0 : t * .00006); ctx.globalAlpha = .9; ctx.drawImage(A, -big / 2, -big / 2, big, big); ctx.restore();
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(still ? .6 : -t * .0001); ctx.globalAlpha = .7; ctx.drawImage(B, -big * .4, -big * .4, big * .8, big * .8); ctx.restore();
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(still ? .2 : t * .00004); ctx.globalAlpha = .85; ctx.drawImage(C, -big * .45, -big * .45, big * .9, big * .9); ctx.restore();
    ctx.lineWidth = 1.2;
    for (var i = 0; i < 5; i++) { var p = ((still ? .2 : t / 7000) + i / 5) % 1, rr = big * .015 + big * .26 * p * p, a = (1 - p) * .4 * Math.min(1, p * 5); ctx.strokeStyle = "rgba(130,225,255," + a.toFixed(3) + ")"; ctx.beginPath(); ctx.arc(cx, cy, rr, 0, 6.283); ctx.stroke(); }
    var pr = big * .045 * (1 + (still ? 0 : .08 * Math.sin(t * .002))), c = ctx.createRadialGradient(cx, cy, 0, cx, cy, pr);
    c.addColorStop(0, "rgba(255,255,255,.85)"); c.addColorStop(.4, "rgba(150,230,255,.45)"); c.addColorStop(1, "rgba(60,160,255,0)"); ctx.fillStyle = c; ctx.fillRect(cx - pr, cy - pr, pr * 2, pr * 2); ctx.globalAlpha = 1;
  }
  function size() {
    W = innerWidth; H = innerHeight; cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var r = scene.getBoundingClientRect(); cx = r.left + r.width / 2; cy = r.top + r.height / 2; big = Math.max(W, H) * 1.55;   // centered on the solar system
    var S = light ? 640 : 1024; A = swirlBitmap(S, 5, 1, cols); B = swirlBitmap(S, 3, -1, cols); C = patternBitmap(light ? 640 : 1024); SB = starBitmap(W, H, dpr, light); draw(last || 0);
  }
  function loop(ts) { raf = requestAnimationFrame(loop); if (document.hidden) return; if (light && ts - last < 32) return; last = ts; draw(ts); }
  function onResize() { clearTimeout(rt); rt = setTimeout(size, 160); }
  size(); if (!still) raf = requestAnimationFrame(loop); addEventListener("resize", onResize);
  return function stop() { cancelAnimationFrame(raf); removeEventListener("resize", onResize); clearTimeout(rt); };
}

/* ---------- Screen 2: the ALethea entrance (title, credit and ENTER are unchanged; planet -> solar system; new background) ---------- */
var SYS = [[24, 4.2, 7, .1, "p1"], [34, 6.2, 11, .55, "p2"], [44, 7.2, 16, .3, "p3"], [54, 5.4, 22, .8, "p4"], [70, 13, 38, .15, "p5"], [83, 10.6, 52, .62, "p7 wl-ring"], [93, 7.6, 70, .35, "p6"], [100, 7.4, 92, .85, "p9"]];   // [orbit diameter, planet size, period s, phase, style]: Mercury..Neptune

function entrance() {
  if (!pending) return;
  try {
    var still = motionOff(), light = lite();
    var w = el("div"); w.id = "welcome"; w.setAttribute("role", "dialog"); w.setAttribute("aria-modal", "true"); w.setAttribute("aria-labelledby", "wlTitle"); w.lang = "en";
    if (still) w.classList.add("wl-still");
    var canvas = still ? null : el("canvas", "wl-fx"); if (canvas) canvas.setAttribute("aria-hidden", "true");
    var haze = el("div", "wl-haze"); haze.setAttribute("aria-hidden", "true");
    var scene = el("div", "wl-scene"), sys = el("div", "wl-sys"); scene.setAttribute("aria-hidden", "true");
    sys.appendChild(el("i", "wl-belt")); sys.appendChild(el("i", "wl-sun"));
    SYS.forEach(function (o) {
      var orb = el("div", "wl-orb"), p = el("i", "wl-pl " + o[4]);
      orb.style.setProperty("--w", o[0]); orb.style.setProperty("--t", o[2] + "s"); orb.style.setProperty("--a", (-o[2] * o[3]).toFixed(2) + "s"); orb.style.setProperty("--k", o[3]);
      p.style.setProperty("--s", o[1]); orb.appendChild(p); sys.appendChild(orb);
    });
    scene.appendChild(sys);
    var h1 = el("h1", "wl-title", "WELCOME TO ALETHEA"); h1.id = "wlTitle";
    var credit = el("p", "wl-credit", "Made & Developed by Masashi");
    var btn = el("button", "wl-enter", "ENTER"); btn.type = "button";
    if (canvas) w.appendChild(canvas);
    w.appendChild(haze); w.appendChild(scene); w.appendChild(h1); w.appendChild(credit); w.appendChild(btn);
    document.body.appendChild(w);
    var stopPortal = portal(w, scene, still, light);

    var raf = 0, leaving = false, ctx = null, dots = [], tws = [], shoot = null, nextShoot = 2500;

    /* particles: one light canvas, paused when hidden */
    if (canvas && canvas.getContext) {
      ctx = canvas.getContext("2d");
      var pal = ["#3b82f6", "#10d9a0", "#8b5cf6", "#ffffff"];
      var size = function () {
        var d = Math.min(window.devicePixelRatio || 1, 1.5);
        canvas.width = innerWidth * d; canvas.height = innerHeight * d; ctx.setTransform(d, 0, 0, d, 0, 0);
        var n = innerWidth < 600 ? 36 : 70; dots = [];
        for (var i = 0; i < n; i++) dots.push({ x: Math.random() * innerWidth, y: Math.random() * innerHeight, r: .6 + Math.random() * 1.8, v: .08 + Math.random() * .3, a: .25 + Math.random() * .6, c: pal[i % 4] });
        var m = light ? 50 : innerWidth < 600 ? 90 : 160; tws = [];
        for (var j = 0; j < m; j++) tws.push({ x: Math.random() * innerWidth, y: Math.random() * innerHeight, r: .5 + Math.random() * 1.3, p: Math.random() * 6.283, s: .0009 + Math.random() * .0026, c: Math.random() < .35 ? "170,230,255" : "255,255,255" });
      };
      size(); addEventListener("resize", size);
      (function tick(ts) {
        raf = requestAnimationFrame(tick); ts = ts || 0;
        if (document.hidden || !ctx) return;
        ctx.clearRect(0, 0, innerWidth, innerHeight);
        for (var j = 0; j < tws.length; j++) { var q = tws[j]; ctx.globalAlpha = .15 + .85 * (.5 + .5 * Math.sin(ts * q.s + q.p)); ctx.fillStyle = "rgb(" + q.c + ")"; ctx.fillRect(q.x, q.y, q.r, q.r); }
        for (var i = 0; i < dots.length; i++) {
          var p = dots[i]; p.y -= p.v; if (p.y < -4) { p.y = innerHeight + 4; p.x = Math.random() * innerWidth; }
          ctx.globalAlpha = p.a; ctx.fillStyle = p.c; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill();
        }
        if (!shoot && ts > nextShoot) { var ag = .5 + Math.random() * .35; shoot = { x: Math.random() * innerWidth * .6, y: Math.random() * innerHeight * .3, vx: Math.cos(ag) * 10, vy: Math.sin(ag) * 10, l: 0 }; nextShoot = ts + 7000 + Math.random() * 6000; }
        if (shoot) {                                                    // rare shooting star
          shoot.x += shoot.vx; shoot.y += shoot.vy; shoot.l++; ctx.globalAlpha = Math.max(0, 1 - shoot.l / 50);
          var tx = shoot.x - shoot.vx * 9, ty = shoot.y - shoot.vy * 9, sg = ctx.createLinearGradient(shoot.x, shoot.y, tx, ty); sg.addColorStop(0, "rgba(255,255,255,1)"); sg.addColorStop(1, "rgba(120,200,255,0)");
          ctx.strokeStyle = sg; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(shoot.x, shoot.y); ctx.lineTo(tx, ty); ctx.stroke(); if (shoot.l > 50) shoot = null;
        }
      })();
    }

    /* enter */
    function onKey(e) { if (e.key === "Escape") go(); }
    function go() {
      if (leaving) return; leaving = true; mark();
      w.classList.add("wl-go"); release(); // site becomes visible underneath while the overlay fades
      setTimeout(finish, still ? 220 : 1000);
    }
    function finish() {
      if (raf) cancelAnimationFrame(raf);
      stopPortal();
      document.removeEventListener("keydown", onKey);
      if (w.parentNode) w.parentNode.removeChild(w);
      var m = document.getElementById("main");
      if (m) { m.setAttribute("tabindex", "-1"); try { m.focus({ preventScroll: true }); } catch (e) {} }
    }
    btn.addEventListener("click", go);
    document.addEventListener("keydown", onKey);
    try { btn.focus({ preventScroll: true }); } catch (e) {}
  } catch (err) {
    var old = document.getElementById("welcome"); if (old && old.parentNode) old.parentNode.removeChild(old);
    release(); // never leave the site hidden if anything fails
    if (window.console) console.error("welcome failed:", err);
  }
}

function build() {
  if (!pending) return;
  try { galaxyScreen(entrance); }
  catch (err) {                                                          // if the galaxy fails for any reason, fall back to the plain entrance
    var g = document.getElementById("wlGalaxy"); if (g && g.parentNode) g.parentNode.removeChild(g);
    if (window.console) console.error("galaxy failed:", err);
    entrance();
  }
}
if (document.body) build(); else document.addEventListener("DOMContentLoaded", build);
/* last-resort safety: if no overlay ever appears, reveal the site */
setTimeout(function () { if (pending && !document.getElementById("welcome") && !document.getElementById("wlGalaxy")) release(); }, 3000);
})();
