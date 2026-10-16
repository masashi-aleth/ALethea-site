/* admin-ui.js: presentation layer for the dashboard and the login/register pages. It does not touch dashboard.js or app.js logic:
   it only adds quick-action cards to the dashboard, a brand/benefits side panel to the auth pages, and show/hide-password buttons. */
(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); }, $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var el = function (t, c, x) { var n = document.createElement(t); if (c) n.className = c; if (x != null) n.textContent = x; return n; };
  var lang = function () { return document.documentElement.lang === "en" ? "en" : "ar"; };
  var isAdmin = function () { try { return window.ALETHEA_DB.isAdmin(); } catch (e) { return false; } };
  var Q = {
    ar: { title: "اختصارات سريعة", ops: ["لوحة العمليات", "الأرقام وسجل الأحداث"], sup: ["تذاكر الدعم", "ردّ وتابع الحالات"], set: ["الإعدادات", "مظهر وحجم خط وحركة"], site: ["عرض الموقع", "شاهد كيف يراه الزائر"] },
    en: { title: "Quick actions", ops: ["Operations", "Numbers and audit log"], sup: ["Support tickets", "Reply and track cases"], set: ["Settings", "Look, text size, motion"], site: ["View site", "See what visitors see"] }
  };
  function quick() {
    var root = $("#dashRoot"); if (!root) return; var anchor = $(".demo-banner", root);
    if (!anchor || $(".dash-quick", root)) return; var q = Q[lang()], box = el("section", "dash-quick"); box.setAttribute("aria-label", q.title);
    [[isAdmin(), "#/ops", q.ops], [true, "#/support", q.sup], [true, "#/settings", q.set], [true, "#/", q.site]].forEach(function (c) {
      if (!c[0]) return; var a = el("a", "glass dq"); a.href = c[1]; a.append(el("b", "", c[2][0]), el("small", "", c[2][1])); box.append(a);
    });
    anchor.insertAdjacentElement("afterend", box);
  }

  var A = {
    ar: { sub: "حسابك اختياري: تتصفح الموقع بدونه، وتسجيل الدخول يفتح لك هذه الميزات.", items: ["مظهرك وألوانك تتبعك على أجهزتك", "افتح تذاكر دعم وتابع الردود", "إشعارات عند ردّ الفريق"], eye: "لماذا حساب؟" },
    en: { sub: "An account is optional: you can browse without one, and signing in unlocks these.", items: ["Your theme and colors follow you across devices", "Open support tickets and follow replies", "Notifications when the team replies"], eye: "Why an account?" }
  };
  function side(panel) {
    if ($(".auth-side", panel)) return; var t = A[lang()];
    var s = el("aside", "auth-side"), ul = el("ul"); s.append(el("i", "auth-orb"), el("span", "eyebrow", t.eye), el("h3", "", "ALethea"), el("p", "", t.sub));
    t.items.forEach(function (x) { ul.append(el("li", "", x)); }); s.append(ul); panel.insertBefore(s, panel.firstChild);
  }
  function pwLabel(b, inp) { var ar = lang() !== "en", shown = inp.type !== "password"; b.textContent = shown ? (ar ? "إخفاء" : "Hide") : (ar ? "إظهار" : "Show"); }
  function pwToggle(panel) {
    $$('input[type="password"]', panel).forEach(function (inp) {
      if (inp.dataset.pw) return; inp.dataset.pw = "1"; var label = inp.id && $('label[for="' + inp.id + '"]', panel); if (!label) return;
      var row = el("div", "pw-row"), b = el("button", "pw-toggle"); b.type = "button"; b.setAttribute("aria-controls", inp.id); pwLabel(b, inp);
      b.addEventListener("click", function () { inp.type = inp.type === "password" ? "text" : "password"; pwLabel(b, inp); });
      label.replaceWith(row); row.append(label, b);
    });
  }
  function auth() { $$(".auth.panel").forEach(function (p) { side(p); pwToggle(p); }); }

  function init() {
    quick(); auth(); var root = $("#dashRoot");
    if (root) new MutationObserver(quick).observe(root, { childList: true });
    addEventListener("hashchange", function () { setTimeout(function () { quick(); auth(); }, 40); });
    new MutationObserver(function () {
      var q = $(".dash-quick"); if (q) q.remove(); quick();
      $$(".auth-side").forEach(function (n) { n.remove(); }); auth();                       // rebuild the side panel in the new language
      $$(".pw-toggle").forEach(function (b) { var i = document.getElementById(b.getAttribute("aria-controls")); if (i) pwLabel(b, i); });
    }).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  }
  if (document.readyState === "complete") init(); else addEventListener("load", init);
})();
