/* galaxy.js: replaces the hero planet with a spiral galaxy whose "stars" are real links to the site's sections,
   plus a first-visit "where do I start?" guide. Pure SVG/CSS (no library). Drag-to-rotate from alethea.js still works. */
(function () {
  "use strict";
  var KEY = "alethea.guide.v1";
  var T = {
    ar: { hint: "اضغط على نجمة للانتقال إلى القسم", start: "من وين أبدأ؟", title: "أهلاً بك في ALethea", sub: "هذا موقع تجريبي. اختر وين تحب تبدأ:", skip: "فهمت، لا تُظهره مرة أخرى", close: "إغلاق",
      nodes: [["store", "المتجر", "منتجات تجريبية وسلة محاكاة"], ["projects", "المشاريع", "معرض أعمال ALethea"], ["tools", "الأدوات", "أدوات صغيرة تقدر تجربها"], ["services", "الخدمات", "ما نقدّمه"], ["community", "المجتمع", "انضم لسيرفر ديسكورد"], ["about", "عن ALethea", "ما هو هذا الموقع"]],
      go: [["store", "تصفّح المتجر", "اطّلع على المنتجات التجريبية"], ["projects", "شاهد المشاريع", "نماذج من الأعمال"], ["community", "انضم للمجتمع", "ديسكورد ومحادثات"], ["settings", "خصّص الموقع", "ألوان، حجم الخط، حركات"]] },
    en: { hint: "Tap a star to jump to that section", start: "Where do I start?", title: "Welcome to ALethea", sub: "This is a demo site. Pick where you'd like to begin:", skip: "Got it, don't show again", close: "Close",
      nodes: [["store", "Store", "Demo products and a simulated cart"], ["projects", "Projects", "ALethea showcase"], ["tools", "Tools", "Small tools you can try"], ["services", "Services", "What we offer"], ["community", "Community", "Join the Discord server"], ["about", "About", "What this site is"]],
      go: [["store", "Browse the store", "See the demo products"], ["projects", "See the projects", "Sample work"], ["community", "Join the community", "Discord and chat"], ["settings", "Customize the site", "Colors, text size, motion"]] }
  };
  var POS = [[24, 16], [74, 24], [16, 46], [80, 55], [30, 80], [68, 88]];   // % of the scene: alternating sides so labels never collide
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var lang = function () { return document.documentElement.lang === "en" ? "en" : "ar"; };
  var el = function (t, c, x) { var n = document.createElement(t); if (c) n.className = c; if (x != null) n.textContent = x; return n; };
  var calm = function () { try { return matchMedia("(prefers-reduced-motion:reduce)").matches || window.ALETHEA.theme.motion === 0; } catch (e) { return false; } };

  /* ---- Galaxy ---- */
  function disc() {
    var lite = document.documentElement.classList.contains("pro-lite"), N = lite ? 220 : 560, ns = "http://www.w3.org/2000/svg", s = document.createElementNS(ns, "svg");
    s.setAttribute("viewBox", "-200 -200 400 400"); s.setAttribute("class", "gx-disc"); s.setAttribute("aria-hidden", "true");
    var cols = ["var(--c1)", "var(--c2)", "var(--c3)"], seed = 11, rnd = function () { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    var mk = function (n, at) { var e = document.createElementNS(ns, n); for (var k in at) e.setAttribute(k, at[k]); s.appendChild(e); return e; };
    var ang = function (arm, r) { return arm * 2.0944 + (r / 190) * 5.2; };
    for (var arm = 0; arm < 3; arm++) {                        // soft arms: three stacked strokes fake a glow without a blur filter
      var d = ""; for (var r = 8; r <= 192; r += 6) d += (r === 8 ? "M" : "L") + (r * Math.cos(ang(arm, r))).toFixed(1) + " " + (r * Math.sin(ang(arm, r))).toFixed(1);
      [[44, .06], [24, .1], [9, .2]].forEach(function (w) { mk("path", { d: d, fill: "none", stroke: cols[arm], "stroke-width": w[0], "stroke-linecap": "round", opacity: w[1] }); });
    }
    for (var i = 0; i < N; i++) {                               // stars hug the arms; brighter near the core
      var a3 = i % 3, t = Math.pow(rnd(), .75), rr = 10 + t * 184, aa = ang(a3, rr) + (rnd() - .5) * (.9 - t * .45);
      mk("circle", { cx: (rr * Math.cos(aa)).toFixed(1), cy: (rr * Math.sin(aa)).toFixed(1), r: (.7 + rnd() * 2 * (1.25 - t * .7)).toFixed(2), fill: rnd() < .12 ? "#fff" : cols[a3], opacity: (.4 + rnd() * .6 * (1 - t * .4)).toFixed(2) });
    }
    return s;
  }
  function nodes(sc) {
    var old = $(".gx-nodes", sc); if (old) old.remove(); var t = T[lang()], box = el("div", "gx-nodes");
    t.nodes.forEach(function (n, i) {
      var a = el("a", "gx-node"); a.href = "#/" + n[0]; a.title = n[2]; a.setAttribute("aria-label", n[1] + ": " + n[2]);
      a.style.left = POS[i][0] + "%"; a.style.top = POS[i][1] + "%"; a.style.animationDelay = (-i * 1.3) + "s";
      a.append(el("i"), el("span", "", n[1]));
      a.addEventListener("pointerdown", function (e) { e.stopPropagation(); });   // keep clicks working; drag starts only on empty space
      a.addEventListener("click", function (e) {
        if (e.ctrlKey || e.metaKey || e.shiftKey || e.button) return; e.preventDefault();
        var go = function () { sc.classList.remove("warp"); location.hash = "#/" + n[0]; };
        if (calm()) return go(); sc.classList.add("warp"); setTimeout(go, 260);
      });
      box.append(a);
    });
    box.append(el("p", "gx-hint", t.hint)); sc.append(box);
  }
  function galaxy() {
    var sg = $("#stage"), sc = $("#scene"); if (!sg || !sc) return;
    if (!sc.dataset.gx) {
      sc.dataset.gx = "1"; sc.removeAttribute("aria-hidden"); sc.classList.add("has-gx");
      var g = el("div", "gx"), sp = el("div", "gx-spin"); sp.append(disc()); g.append(sp, el("i", "gx-core")); sg.append(g);
    }
    nodes(sc);
  }

  /* ---- First-visit guide ---- */
  var dlg;
  function seen() { try { localStorage.setItem(KEY, "1"); } catch (e) {} }
  function guide() {
    if (dlg) dlg.remove(); var t = T[lang()]; dlg = el("dialog", "glass pro-guide"); dlg.setAttribute("aria-labelledby", "proGT");
    var h = el("h2", "", t.title); h.id = "proGT"; dlg.append(h, el("p", "", t.sub));
    var list = el("div", "pro-go");
    t.go.forEach(function (g) { var a = el("a", "pro-gobtn"); a.href = "#/" + g[0]; a.append(el("b", "", g[1]), el("small", "", g[2])); a.addEventListener("click", function () { dlg.close(); }); list.append(a); });
    var skip = el("button", "btn ghost", t.skip); skip.type = "button"; skip.addEventListener("click", function () { dlg.close(); });
    dlg.append(list, skip); dlg.addEventListener("close", seen); document.body.append(dlg); dlg.showModal();
  }
  function startBtn() {
    var cta = $(".hero-copy .cta"); if (!cta) return; var b = $("#proGuideBtn");
    if (!b) { b = el("button", "pro-hint"); b.id = "proGuideBtn"; b.type = "button"; b.addEventListener("click", guide); cta.insertAdjacentElement("afterend", b); }
    b.textContent = T[lang()].start;
  }
  function autoGuide() {
    var tries = 0, iv = setInterval(function () {
      if (++tries > 60) return clearInterval(iv);
      if (document.getElementById("welcome")) return;            // wait until the welcome screen is gone
      clearInterval(iv); var done = false; try { done = localStorage.getItem(KEY); } catch (e) {}
      if (!done && /^(#\/?)?$/.test(location.hash)) guide();
    }, 500);
  }

  function init() {
    galaxy(); startBtn(); autoGuide();
    new MutationObserver(function () { galaxy(); startBtn(); }).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  }
  if (document.readyState === "complete") init(); else addEventListener("load", init);
})();
