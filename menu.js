/* menu.js: organizes the main menu (#nav) into three labelled groups. It only moves the existing links into columns and adds headings;
   every link keeps its own id, data attributes and the show/hide logic of app.js (guest / user / admin). */
(function () {
  "use strict";
  var T = { ar: ["استكشف", "المجتمع والمساعدة", "مساحتك"], en: ["Discover", "Community & help", "Your space"] };
  var G = [["home", "explore", "store", "projects", "tools", "services"], ["community", "support", "about"], ["settings", "dashboard", "admin", "ops"]];
  var lang = function () { return document.documentElement.lang === "en" ? "en" : "ar"; };
  var el = function (t, c, x) { var n = document.createElement(t); if (c) n.className = c; if (x != null) n.textContent = x; return n; };

  function labels(nav) { var t = T[lang()]; [].forEach.call(nav.querySelectorAll(".nav-h"), function (h, i) { h.textContent = t[i]; }); }
  function build() {
    var nav = document.getElementById("nav"); if (!nav || nav.dataset.grouped) return;
    var need = ["support", "settings", "ops"].every(function (k) { return nav.querySelector('[data-r="' + k + '"]'); });   // links added by other scripts must exist first
    if (!need && (build.tries = (build.tries || 0) + 1) < 40) return setTimeout(build, 250);
    var cols = G.map(function () { var c = el("div", "nav-col"); c.append(el("span", "nav-h")); return c; }), used = [];
    G.forEach(function (keys, i) { keys.forEach(function (k) { var a = nav.querySelector('[data-r="' + k + '"]'); if (a) { cols[i].append(a); used.push(a); } }); });
    [].slice.call(nav.children).forEach(function (n) { if (used.indexOf(n) < 0 && !n.classList.contains("nav-col")) cols[2].append(n); });   // login, register, who, logout follow in original order
    cols.forEach(function (c) { nav.append(c); }); nav.dataset.grouped = "1"; labels(nav);
  }
  function init() {
    build(); new MutationObserver(function () { var n = document.getElementById("nav"); if (n && n.dataset.grouped) labels(n); }).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  }
  if (document.readyState === "complete") init(); else addEventListener("load", init);
})();
