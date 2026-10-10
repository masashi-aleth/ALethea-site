/* ALethea — Phase 2: welcome screen. Load in <head> (sync, tiny). Builds its own DOM, so index.html needs no markup.
   Shows once per browser session. Never traps: ENTER button, Esc key. Skipped for admin/login/OAuth-return URLs. */
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
function has3d() { try { return !!(window.CSS && CSS.supports && CSS.supports("transform-style", "preserve-3d")); } catch (e) { return false; } }
function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text) n.textContent = text; return n; }

function build() {
  if (!pending) return;
  try {
    var still = motionOff(), flat = !has3d();
    var w = el("div"); w.id = "welcome"; w.setAttribute("role", "dialog"); w.setAttribute("aria-modal", "true"); w.setAttribute("aria-labelledby", "wlTitle"); w.lang = "en";
    if (still) w.classList.add("wl-still"); if (flat) w.classList.add("wl-flat");
    var canvas = still ? null : el("canvas", "wl-fx"); if (canvas) canvas.setAttribute("aria-hidden", "true");
    var haze = el("div", "wl-haze"); haze.setAttribute("aria-hidden", "true");
    var scene = el("div", "wl-scene"), stage = el("div", "wl-stage"); scene.setAttribute("aria-hidden", "true");
    ["wl-ring wl-r1", "wl-ring wl-r2", "wl-ring wl-r3", "wl-disc", "wl-core"].forEach(function (c) { stage.appendChild(el("i", c)); });
    scene.appendChild(stage);
    var h1 = el("h1", "wl-title", "WELCOME TO ALETHEA"); h1.id = "wlTitle";
    var credit = el("p", "wl-credit", "Made & Developed by Masashi");
    var btn = el("button", "wl-enter", "ENTER"); btn.type = "button";
    if (canvas) w.appendChild(canvas);
    w.appendChild(haze); w.appendChild(scene); w.appendChild(h1); w.appendChild(credit); w.appendChild(btn);
    document.body.appendChild(w);

    var raf = 0, tiltRaf = 0, leaving = false, ctx = null, dots = [];

    /* particles: one light canvas, paused when hidden */
    if (canvas && canvas.getContext) {
      ctx = canvas.getContext("2d");
      var pal = ["#3b82f6", "#10d9a0", "#8b5cf6", "#ffffff"];
      var size = function () {
        var d = Math.min(window.devicePixelRatio || 1, 1.5);
        canvas.width = innerWidth * d; canvas.height = innerHeight * d; ctx.setTransform(d, 0, 0, d, 0, 0);
        var n = innerWidth < 600 ? 36 : 70; dots = [];
        for (var i = 0; i < n; i++) dots.push({ x: Math.random() * innerWidth, y: Math.random() * innerHeight, r: .6 + Math.random() * 1.8, v: .08 + Math.random() * .3, a: .25 + Math.random() * .6, c: pal[i % 4] });
      };
      size(); addEventListener("resize", size);
      (function tick() {
        raf = requestAnimationFrame(tick);
        if (document.hidden || !ctx) return;
        ctx.clearRect(0, 0, innerWidth, innerHeight);
        for (var i = 0; i < dots.length; i++) {
          var p = dots[i]; p.y -= p.v; if (p.y < -4) { p.y = innerHeight + 4; p.x = Math.random() * innerWidth; }
          ctx.globalAlpha = p.a; ctx.fillStyle = p.c; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill();
        }
      })();
    }

    /* pointer / touch tilt (rAF throttled) */
    function tilt(x, y) {
      if (tiltRaf || still || flat) return;
      tiltRaf = requestAnimationFrame(function () {
        tiltRaf = 0;
        stage.style.setProperty("--wy", (18 + (x / innerWidth - .5) * 50).toFixed(1) + "deg");
        stage.style.setProperty("--wx", (-10 - (y / innerHeight - .5) * 40).toFixed(1) + "deg");
      });
    }
    function onMove(e) { tilt(e.clientX, e.clientY); }
    w.addEventListener("pointermove", onMove);

    /* enter */
    function onKey(e) { if (e.key === "Escape") go(); }
    function go() {
      if (leaving) return; leaving = true; mark();
      w.classList.add("wl-go"); release(); // site becomes visible underneath while the overlay fades
      setTimeout(finish, still ? 220 : 1000);
    }
    function finish() {
      if (raf) cancelAnimationFrame(raf);
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
if (document.body) build(); else document.addEventListener("DOMContentLoaded", build);
/* last-resort safety: if the overlay never appears, reveal the site */
setTimeout(function () { if (pending && !document.getElementById("welcome")) release(); }, 3000);
})();
