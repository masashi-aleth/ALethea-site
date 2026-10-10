/* settings.js: simple "Settings" page (#/settings): language, color studio shortcut, text size, corners, background effects,
   animations, contrast. Choices are saved in this browser; theme colors and animation level also follow the account (account-sync.js). */
(function () {
  "use strict";
  var KEY = "alethea.prefs.v1", DEF = { fs: 100, r: 20, fx: 1, ct: 0 };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var el = function (t, c, x) { var n = document.createElement(t); if (c) n.className = c; if (x != null) n.textContent = x; return n; };
  var lang = function () { return document.documentElement.lang === "en" ? "en" : "ar"; };
  var P = (function () { try { return Object.assign({}, DEF, JSON.parse(localStorage.getItem(KEY)) || {}); } catch (e) { return Object.assign({}, DEF); } })();
  function clampPick(v, list, d) { return list.indexOf(v) > -1 ? v : d; }
  P.fs = clampPick(P.fs, [90, 100, 112, 125], 100); P.r = clampPick(P.r, [8, 20, 30], 20); P.fx = P.fx ? 1 : 0; P.ct = P.ct ? 1 : 0;
  function apply() {
    var h = document.documentElement; h.style.fontSize = P.fs === 100 ? "" : P.fs + "%"; if (P.r === 20) h.style.removeProperty("--r"); else h.style.setProperty("--r", P.r + "px");
    h.classList.toggle("pro-nofx", !P.fx); h.classList.toggle("pro-contrast", !!P.ct);
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(P)); } catch (e) {} apply(); }
  apply();   // run immediately so the saved look is in place on load

  var S = {
    ar: { nav: "الإعدادات", title: "الإعدادات", sub: "غيّر شكل الموقع بالطريقة اللي تريحك. كل شي يتحفظ تلقائياً.",
      lang: "اللغة", langS: "لغة الواجهة", colors: "الألوان والمظهر", colorsS: "اختر ألوانك وتوهج الخلفية من استوديو الألوان.", open: "افتح استوديو الألوان",
      fs: "حجم الخط", fsS: "كبّر النص إذا تحب.", fsO: [["صغير", 90], ["عادي", 100], ["كبير", 112], ["كبير جداً", 125]],
      r: "شكل الزوايا", rS: "حادة أو ناعمة أو دائرية.", rO: [["حادة", 8], ["ناعمة", 20], ["دائرية", 30]],
      fx: "خلفية الجسيمات والتوهج", fxS: "أطفئها لو جهازك بطيء أو تحب الهدوء.", on: "تشغيل", off: "إيقاف",
      mo: "الحركات", moS: "تحكم بحركة الواجهة والمجرة.", moO: [["كاملة", 100], ["خفيفة", 40], ["بدون", 0]],
      ct: "تباين عالٍ", ctS: "نصوص وحدود أوضح.", reset: "إعادة الضبط", resetS: "يرجع حجم الخط والزوايا والخلفية والتباين للوضع الأصلي.", done: "تمت إعادة الضبط" },
    en: { nav: "Settings", title: "Settings", sub: "Change how the site looks in the way that suits you. Everything is saved automatically.",
      lang: "Language", langS: "Interface language", colors: "Colors and look", colorsS: "Pick your colors and background glow in the color studio.", open: "Open color studio",
      fs: "Text size", fsS: "Make the text bigger if you like.", fsO: [["Small", 90], ["Normal", 100], ["Large", 112], ["Extra large", 125]],
      r: "Corner style", rS: "Sharp, soft or round.", rO: [["Sharp", 8], ["Soft", 20], ["Round", 30]],
      fx: "Particles and glow background", fxS: "Turn it off on a slow device or for a calmer look.", on: "On", off: "Off",
      mo: "Animations", moS: "Control motion in the interface and the galaxy.", moO: [["Full", 100], ["Light", 40], ["None", 0]],
      ct: "High contrast", ctS: "Clearer text and borders.", reset: "Reset", resetS: "Restores text size, corners, background and contrast to the original look.", done: "Settings reset" }
  };
  var toast = function (m) { try { window.ALETHEA.toast(m); } catch (e) {} };
  var onRoute = function () { return /^#\/settings$/.test(location.hash); };
  var motion = function () { try { return window.ALETHEA.theme.motion; } catch (e) { return 100; } };

  function seg(opts, cur, pick) {
    var w = el("div", "seg"); w.setAttribute("role", "group");
    opts.forEach(function (o) { var b = el("button", "seg-b" + (o[1] === cur ? " on" : ""), o[0]); b.type = "button"; b.setAttribute("aria-pressed", o[1] === cur); b.addEventListener("click", function () { pick(o[1]); render(); }); w.append(b); });
    return w;
  }
  function row(title, sub, ctrl) { var c = el("section", "glass set-row"), t = el("div", "set-t"); t.append(el("b", "", title), el("small", "", sub)); c.append(t, ctrl); return c; }

  function render() {
    var root = $("#settingsRoot"); navLink(); if (!root || !onRoute()) return; var t = S[lang()]; root.textContent = "";
    var w = el("div", "wrap sup"), head = el("div", "pagehead"); head.append(el("span", "eyebrow", t.nav), el("h1", "", t.title), el("p", "", t.sub)); w.append(head);
    w.append(row(t.lang, t.langS, seg([["العربية", "ar"], ["English", "en"]], lang(), function (v) { if (v !== lang()) { var b = $("#langBtn"); if (b) b.click(); } })));
    var op = el("button", "btn", t.open); op.type = "button"; op.addEventListener("click", function () { var b = $("#themeBtn"); if (b) b.click(); }); w.append(row(t.colors, t.colorsS, op));
    w.append(row(t.fs, t.fsS, seg(t.fsO, P.fs, function (v) { P.fs = v; save(); })));
    w.append(row(t.r, t.rS, seg(t.rO, P.r, function (v) { P.r = v; save(); })));
    w.append(row(t.fx, t.fxS, seg([[t.on, 1], [t.off, 0]], P.fx, function (v) { P.fx = v; save(); })));
    w.append(row(t.mo, t.moS, seg(t.moO, motion() > 60 ? 100 : motion() > 0 ? 40 : 0, function (v) { try { window.ALETHEA.theme.motion = v; window.ALETHEA.applyTheme(); } catch (e) {} })));
    w.append(row(t.ct, t.ctS, seg([[t.on, 1], [t.off, 0]], P.ct, function (v) { P.ct = v; save(); })));
    var rs = el("button", "btn ghost", t.reset); rs.type = "button"; rs.addEventListener("click", function () { P = Object.assign({}, DEF); save(); render(); toast(t.done); }); w.append(row(t.reset, t.resetS, rs));
    root.append(w);
  }
  function navLink() {
    var nav = $("#nav"); if (!nav) return; var a = $("#setNav");
    if (!a) { a = el("a"); a.id = "setNav"; a.href = "#/settings"; a.dataset.r = "settings"; var an = nav.querySelector('[data-r="community"]'); nav.insertBefore(a, an ? an.nextSibling : null); }
    a.textContent = S[lang()].nav;
  }
  function init() {
    render(); addEventListener("hashchange", function () { setTimeout(render, 30); }); addEventListener("alethea:route", function () { setTimeout(render, 30); });
    new MutationObserver(render).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  }
  if (document.readyState === "complete") init(); else addEventListener("load", init);
})();
