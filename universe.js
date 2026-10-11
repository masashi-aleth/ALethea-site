/* universe.js: "Explore the ALethea Universe": a NEW section on the home page, placed after the hero/intro and before the main sections.
   Canvas starfield (no library) + CSS nebula/planets. Each planet is a real link to an existing route. The welcome screen and the
   hero galaxy are not touched. Animation pauses off-screen and when the tab is hidden; reduced motion / "Animations: None" draws a still sky. */
(function () {
  "use strict";
  var T = {
    ar: { eb: "الكون", h: "استكشف كون ALethea", sub: "اكتشف عوالم جديدة، واستكشف مساحات رقمية، وجد وجهتك التالية.", go: "الذهاب إلى ",
      p: { store: ["المتجر", "منتجات تجريبية وسلة محاكاة"], projects: ["المشاريع", "معرض أعمال ALethea"], tools: ["الأدوات", "أدوات صغيرة تجربها"], services: ["الخدمات", "ما نقدّمه"], community: ["المجتمع", "انضم لسيرفر ديسكورد"] } },
    en: { eb: "UNIVERSE", h: "EXPLORE THE ALETHEA UNIVERSE", sub: "Discover new worlds, explore digital spaces, and find your next destination.", go: "Go to ",
      p: { store: ["Store", "Demo products and a simulated cart"], projects: ["Projects", "ALethea showcase"], tools: ["Tools", "Small tools you can try"], services: ["Services", "What we offer"], community: ["Community", "Join the Discord server"] } }
  };
  var CX = 50, CY = 46;                                             // star position (% of the box)
  var PL = [["store", 26, 30, "blue"], ["projects", 76, 22, "violet"], ["tools", 74, 55, "cyan"], ["services", 24, 64, "emerald"], ["community", 50, 86, "magenta"]];
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var el = function (t, c, x) { var n = document.createElement(t); if (c) n.className = c; if (x != null) n.textContent = x; return n; };
  var lang = function () { return document.documentElement.lang === "en" ? "en" : "ar"; };
  var calm = function () { try { return matchMedia("(prefers-reduced-motion:reduce)").matches || window.ALETHEA.theme.motion === 0; } catch (e) { return false; } };

  function rings() {                                              // one faint orbit per planet, derived from where the planet sits
    var ns = "http://www.w3.org/2000/svg", s = document.createElementNS(ns, "svg"); s.setAttribute("viewBox", "0 0 100 100"); s.setAttribute("preserveAspectRatio", "none"); s.setAttribute("class", "uni-rings"); s.setAttribute("aria-hidden", "true");
    PL.forEach(function (p) {
      var dx = p[1] - CX, dy = p[2] - CY, rx = Math.max(Math.abs(dx) * 1.12, 14), c = dx / rx, sn = Math.sqrt(Math.max(1 - c * c, .09)) * (dy < 0 ? -1 : 1), e = document.createElementNS(ns, "ellipse");
      e.setAttribute("cx", CX); e.setAttribute("cy", CY); e.setAttribute("rx", rx.toFixed(1)); e.setAttribute("ry", Math.abs(dy / sn).toFixed(1)); s.appendChild(e);
    });
    return s;
  }

  /* ---- Starfield ---- */
  function stars(cv, box) {
    var ctx = cv.getContext("2d"), W = 0, H = 0, S = [], dpr = Math.min(window.devicePixelRatio || 1, 1.5), run = false, last = 0, inView = false;
    var lite = document.documentElement.classList.contains("pro-lite");
    function draw(dt) {
      ctx.clearRect(0, 0, W, H); var still = calm(), drift = still ? 0 : dt * .012;
      for (var i = 0; i < S.length; i++) {
        var s = S[i]; s.x += drift * s.z; if (s.x > W) s.x -= W; if (!still) s.t += dt * .002;
        ctx.globalAlpha = (.3 + .7 * (.5 + .5 * Math.sin(s.t))) * s.z; ctx.fillStyle = s.c; ctx.fillRect(s.x, s.y, s.z * 1.9, s.z * 1.9);
      }
    }
    function size() {
      var r = cv.getBoundingClientRect(); W = r.width; H = r.height; if (!W || !H) return; cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.round(W * H / (lite ? 5200 : 2400)); S = [];
      for (var i = 0; i < n; i++) S.push({ x: Math.random() * W, y: Math.random() * H, z: .25 + Math.random() * .75, t: Math.random() * 6.28, c: Math.random() < .18 ? "#8ff3ff" : Math.random() < .5 ? "#c7d2ff" : "#ffffff" });
      draw(0);
    }
    function loop(ts) {
      if (!inView || document.hidden || calm()) { run = false; cv.dataset.anim = "0"; if (calm()) draw(0); return; }
      var dt = Math.min(50, ts - last || 16); last = ts; if (!lite || dt >= 30) draw(dt); requestAnimationFrame(loop);
    }
    function start() { if (run || !inView || document.hidden || calm()) return; run = true; last = 0; cv.dataset.anim = "1"; requestAnimationFrame(loop); }
    new IntersectionObserver(function (en) { inView = en[0].isIntersecting; start(); }, { threshold: 0.05 }).observe(box);
    document.addEventListener("visibilitychange", start); setInterval(start, 1500);   // re-checks after Settings > Animations changes
    if (window.ResizeObserver) new ResizeObserver(size).observe(box); else addEventListener("resize", size);
    size();
  }

  /* ---- Section ---- */
  function texts(sec) {
    var t = T[lang()]; $(".eyebrow", sec).textContent = t.eb; $("h2", sec).textContent = t.h; $(".uni-sub", sec).textContent = t.sub;
    PL.forEach(function (p) { var a = $('[data-k="' + p[0] + '"]', sec), n = t.p[p[0]]; a.setAttribute("aria-label", t.go + n[0] + ": " + n[1]); a.title = n[1]; $("b", a).textContent = n[0]; $("small", a).textContent = n[1]; });
  }
  function build() {
    var host = $("#homeSections"); if (!host || $("#uni")) return;
    var sec = el("section", "uni-sec wrap"); sec.id = "uni"; sec.setAttribute("aria-labelledby", "uniH");
    var sh = el("div", "sec-head"), sd = el("div"), h2 = el("h2"); h2.id = "uniH"; sd.append(el("span", "eyebrow"), h2, el("p", "uni-sub")); sh.append(sd); sec.append(sh);
    var box = el("div", "uni"), cv = el("canvas"), pls = el("div", "uni-planets"); cv.setAttribute("aria-hidden", "true");
    box.append(cv, rings(), el("i", "uni-star"));
    PL.forEach(function (p, i) {
      var a = el("a", "uni-p p-" + p[3]); a.href = "#/" + p[0]; a.dataset.k = p[0]; a.style.left = p[1] + "%"; a.style.top = p[2] + "%"; a.style.animationDelay = (-i * 1.7) + "s";
      a.append(el("span", "orb"), el("b"), el("small"));
      a.addEventListener("click", function (e) {
        if (e.ctrlKey || e.metaKey || e.shiftKey || e.button) return; e.preventDefault();
        var go = function () { box.classList.remove("jump"); location.hash = "#/" + p[0]; };
        if (calm()) return go(); box.classList.add("jump"); setTimeout(go, 240);
      });
      pls.append(a);
    });
    box.append(pls); sec.append(box); host.insertAdjacentElement("beforebegin", sec); texts(sec);
    box.addEventListener("pointermove", function (e) {            // subtle parallax for mouse only
      if (e.pointerType !== "mouse") return; var r = box.getBoundingClientRect();
      box.style.setProperty("--upx", ((e.clientX - r.left) / r.width * 2 - 1).toFixed(2)); box.style.setProperty("--upy", ((e.clientY - r.top) / r.height * 2 - 1).toFixed(2));
    }, { passive: true });
    box.addEventListener("pointerleave", function () { box.style.setProperty("--upx", 0); box.style.setProperty("--upy", 0); });
    stars(cv, box);
  }
  function init() {
    build();
    new MutationObserver(function () { var s = $("#uni"); if (s) texts(s); else build(); }).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
    addEventListener("alethea:route", function () { if (!$("#uni")) build(); });
  }
  if (document.readyState === "complete") init(); else addEventListener("load", init);
})();
