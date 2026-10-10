/* ALethea — Phase 3: Multiverse portal hub. Load AFTER alethea.js. Self-contained (own ar/en text).
   Injects the hub into #homeSections in place of the "Explore" tiles, and re-injects after any re-render (e.g. language switch).
   Respects the dashboard toggle: if the Explore section is switched off, no hub is shown. */
(function () {
"use strict";
var TXT = {
  ar: { title: "ALethea Multiverse", sub: "اختر عالماً وادخل من بوابته. العوالم المفتوحة تعمل الآن بنسخة العرض، والباقي ما زال قيد التجربة.", enter: "ادخل", lock: "هذا العالم لم يُكتشف بعد",
    st: { demo: "عرض تجريبي", open: "مفتوح", exp: "تجريبي", dev: "قيد التطوير", unk: "غير مكتشف" },
    w: { store: ["المتجر", "منتجات تجريبية وسلة ودفع محاكى."], projects: ["الاستوديو", "معرض أعمال وتجارب بصرية."], tools: ["المختبر", "أدوات وتطبيقات قيد التجربة."],
      services: ["المصنع", "خدمات إبداعية وتقنية مقترحة."], community: ["الساحة", "Discord وYouTube وInstagram."], about: ["الأصل", "قصة ALethea وخريطة الطريق."], unk: ["؟؟؟", "شيء ما يتشكّل هناك."] } },
  en: { title: "ALethea Multiverse", sub: "Pick a world and step through its portal. Open worlds run in preview mode now; the rest are still experiments.", enter: "Enter", lock: "This world has not been discovered yet",
    st: { demo: "Demo", open: "Open", exp: "Experimental", dev: "In development", unk: "Undiscovered" },
    w: { store: ["The Store", "Demo products, a cart and simulated checkout."], projects: ["The Studio", "Showcase works and visual experiments."], tools: ["The Lab", "Tools and apps still being tested."],
      services: ["The Forge", "Proposed creative and technical services."], community: ["The Commons", "Discord, YouTube and Instagram."], about: ["The Origin", "ALethea's story and roadmap."], unk: ["???", "Something is forming out there."] } }
};
/* id, route, status, gradient colors, glyph (static trusted SVG) */
var WORLDS = [
  ["store", "store", "demo", "c2", "c1", '<circle cx="24" cy="24" r="7"/><ellipse cx="24" cy="24" rx="19" ry="8" transform="rotate(-25 24 24)"/>'],
  ["projects", "projects", "demo", "c1", "c3", '<path d="M24 5l17 10v18L24 43 7 33V15z"/><path d="M24 5v38M7 15l34 18"/>'],
  ["tools", "tools", "exp", "c3", "c2", '<circle cx="24" cy="24" r="17" stroke-dasharray="4 5"/><circle cx="24" cy="24" r="6"/>'],
  ["services", "services", "dev", "c1", "c2", '<path d="M8 37L24 9l16 28z"/><circle cx="24" cy="28" r="4"/>'],
  ["community", "community", "open", "c3", "c1", '<circle cx="18" cy="20" r="10"/><circle cx="30" cy="20" r="10"/><circle cx="24" cy="31" r="10"/>'],
  ["about", "about", "open", "c2", "c3", '<path d="M30 7a17 17 0 1 0 11 24A14 14 0 0 1 30 7z"/>'],
  ["unk", null, "unk", "c1", "c3", '<path d="M18 18a6 6 0 1 1 8 5.7c-1.6.7-2 1.6-2 3.3M24 34.5v.5"/>']
];
var FALL = { c1: "#3b82f6", c2: "#10d9a0", c3: "#8b5cf6" };
var NS = "http://www.w3.org/2000/svg", busy = false;

function lang() { return document.documentElement.lang === "en" ? "en" : "ar"; }
function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
function svg(inner, cls) { var s = document.createElementNS(NS, "svg"); s.setAttribute("viewBox", "0 0 48 48"); s.setAttribute("aria-hidden", "true"); if (cls) s.setAttribute("class", cls); s.innerHTML = inner; return s; }
function toast(m) { try { if (window.ALETHEA && window.ALETHEA.toast) window.ALETHEA.toast(m); } catch (e) {} }

function orbits() {
  var s = document.createElementNS(NS, "svg"); s.setAttribute("class", "mv-orbits"); s.setAttribute("viewBox", "0 0 1000 520"); s.setAttribute("preserveAspectRatio", "xMidYMid slice"); s.setAttribute("aria-hidden", "true");
  s.innerHTML = '<defs><linearGradient id="mvLine" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="var(--c1,#3b82f6)"/><stop offset=".5" stop-color="var(--c2,#10d9a0)"/><stop offset="1" stop-color="var(--c3,#8b5cf6)"/></linearGradient></defs>' +
    '<g><ellipse cx="500" cy="260" rx="470" ry="150" transform="rotate(-12 500 260)"/><ellipse cx="500" cy="260" rx="380" ry="210" transform="rotate(18 500 260)"/><ellipse cx="500" cy="260" rx="260" ry="250"/></g>';
  return s;
}

function worldsCfg() { try { return (window.ALETHEA && window.ALETHEA.data && window.ALETHEA.data.worlds) || {}; } catch (e) { return {}; } }
function shown(cfg) { return WORLDS.filter(function (w) { var c = cfg[w[0]]; return !c || c.show !== false; }); }
function world(w, T, i, c) {
  var id = w[0], route = w[1], t = T.w[id], locked = !route;
  var status = c && T.st[c.status] ? c.status : w[2];
  var li = el("li"); li.style.setProperty("--i", i);
  var a = el(locked ? "button" : "a", "mv-world" + (locked ? " is-unk" : ""));
  if (locked) { a.type = "button"; a.addEventListener("click", function () { toast(T.lock); }); } else a.href = "#/" + route;
  a.style.setProperty("--a", "var(--" + w[3] + "," + FALL[w[3]] + ")"); a.style.setProperty("--b", "var(--" + w[4] + "," + FALL[w[4]] + ")");
  var top = el("span", "mv-top"), glyph = el("span", "mv-glyph"); glyph.appendChild(svg(w[5]));
  top.appendChild(glyph); top.appendChild(el("span", "mv-status " + status, T.st[status]));
  var go = el("span", "mv-go", locked ? "" : T.enter);
  if (!locked) go.appendChild(svg('<path d="M5 24h38M31 12l12 12-12 12"/>'));
  a.appendChild(top); a.appendChild(el("span", "mv-name", t[0])); a.appendChild(el("span", "mv-desc", t[1])); if (!locked) a.appendChild(go);
  li.appendChild(a); return li;
}
function build() {
  var T = TXT[lang()], sec = el("section", "sec mv-hub"); sec.setAttribute("aria-labelledby", "mvTitle"); sec.dataset.lang = lang();
  var head = el("div", "mv-head"), h2 = el("h2", null, T.title); h2.id = "mvTitle";
  head.appendChild(h2); head.appendChild(el("p", null, T.sub));
  var cfg = worldsCfg(), ul = el("ul", "mv-worlds"); shown(cfg).forEach(function (w, i) { ul.appendChild(world(w, T, i, cfg[w[0]])); });
  /* soft highlight follows the pointer (hover devices only) */
  ul.addEventListener("pointermove", function (e) {
    if (e.pointerType !== "mouse") return; var c = e.target.closest && e.target.closest(".mv-world"); if (!c) return;
    var r = c.getBoundingClientRect(); c.style.setProperty("--mx", ((e.clientX - r.left) / r.width * 100).toFixed(0) + "%"); c.style.setProperty("--my", ((e.clientY - r.top) / r.height * 100).toFixed(0) + "%");
  });
  sec.appendChild(orbits()); sec.appendChild(head); sec.appendChild(ul); return sec;
}
function ensure() {
  if (busy) return; var host = document.getElementById("homeSections"); if (!host) return;
  var tiles = host.querySelector(".tiles"), old = host.querySelector(".mv-hub");
  if (!tiles) { if (old && old.parentNode) old.parentNode.removeChild(old); return; } /* Explore section switched off in the dashboard */
  var tsec = tiles.closest(".sec"); if (!tsec) return;
  if (!shown(worldsCfg()).length) { if (old && old.parentNode) old.parentNode.removeChild(old); tsec.classList.remove("mv-replaced"); return; } /* every world hidden: keep the plain tiles */
  busy = true;
  try {
    tsec.classList.add("mv-replaced");
    if (!old || old.dataset.lang !== lang()) { if (old && old.parentNode) old.parentNode.removeChild(old); tsec.parentNode.insertBefore(build(), tsec); }
  } catch (err) { if (window.console) console.error("multiverse:", err); tsec.classList.remove("mv-replaced"); }
  busy = false;
}
function start() {
  var host = document.getElementById("homeSections"); if (!host) return;
  new MutationObserver(ensure).observe(host, { childList: true });
  ensure();
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();

/* ---- Phase 4: scroll progress, back-to-top, cart badge bump ---- */
(function () {
"use strict";
var TOP = { ar: "العودة للأعلى", en: "Back to top" };
function lang() { return document.documentElement.lang === "en" ? "en" : "ar"; }
function init() {
  if (document.querySelector(".mv-progress")) return;
  var bar = document.createElement("div"); bar.className = "mv-progress"; bar.setAttribute("aria-hidden", "true");
  var top = document.createElement("button"); top.type = "button"; top.className = "mv-top-btn";
  top.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
  document.body.appendChild(bar); document.body.appendChild(top);
  function label() { top.setAttribute("aria-label", TOP[lang()]); }
  label(); new MutationObserver(label).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  var raf = 0;
  function upd() {
    raf = 0; var h = document.documentElement.scrollHeight - innerHeight, y = window.pageYOffset || 0;
    bar.style.transform = "scaleX(" + (h > 0 ? Math.min(1, y / h) : 0).toFixed(3) + ")"; top.classList.toggle("show", y > 700);
  }
  addEventListener("scroll", function () { if (!raf) raf = requestAnimationFrame(upd); }, { passive: true });
  addEventListener("resize", upd); addEventListener("hashchange", function () { setTimeout(upd, 60); });
  top.addEventListener("click", function () { scrollTo({ top: 0, behavior: document.documentElement.dataset.motion === "off" ? "auto" : "smooth" }); });
  ["cartBadge", "dockBadge"].forEach(function (id) {
    var b = document.getElementById(id); if (!b) return; var last = b.textContent;
    new MutationObserver(function () {
      var now = b.textContent;
      if (now !== last && now) { b.classList.remove("mv-bump"); void b.offsetWidth; b.classList.add("mv-bump"); }
      last = now;
    }).observe(b, { childList: true, characterData: true, subtree: true });
  });
  upd();
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();

/* ---- Phase 6: promo bar controlled from the dashboard (Universe & promo tab) ---- */
(function () {
"use strict";
var KEY = "alethea.promo.closed";
function lang() { return document.documentElement.lang === "en" ? "en" : "ar"; }
function cfg() { try { return (window.ALETHEA && window.ALETHEA.data && window.ALETHEA.data.promo) || null; } catch (e) { return null; } }
function safeLink(v) {
  v = String(v || "").trim(); if (!v) return "";
  if (/^#\/[a-z0-9\/_-]*$/i.test(v)) return v;
  try { var u = new URL(v); return u.protocol === "https:" ? u.href : ""; } catch (e) { return ""; }
}
function closedFor(text) { try { return sessionStorage.getItem(KEY) === text; } catch (e) { return false; } }
function render() {
  var old = document.querySelector(".mv-promo"), p = cfg(), header = document.querySelector("header");
  var text = p && p.on && p.text ? (p.text[lang()] || p.text.ar || p.text.en || "") : "";
  if (!text || closedFor(text) || !header) { if (old && old.parentNode) old.parentNode.removeChild(old); return; }
  if (old && old.dataset.k === lang() + "|" + text + "|" + (p.link || "")) return;
  if (old && old.parentNode) old.parentNode.removeChild(old);
  var bar = document.createElement("div"); bar.className = "mv-promo"; bar.dataset.k = lang() + "|" + text + "|" + (p.link || ""); bar.setAttribute("role", "note");
  var link = safeLink(p.link), msg = document.createElement(link ? "a" : "span"); msg.className = "mv-promo-text"; msg.textContent = text;
  if (link) { msg.href = link; if (link.charAt(0) !== "#") { msg.target = "_blank"; msg.rel = "noopener noreferrer"; } }
  var x = document.createElement("button"); x.type = "button"; x.className = "mv-promo-x"; x.textContent = "\u00d7"; x.setAttribute("aria-label", lang() === "en" ? "Close" : "إغلاق");
  x.addEventListener("click", function () { try { sessionStorage.setItem(KEY, text); } catch (e) {} if (bar.parentNode) bar.parentNode.removeChild(bar); });
  bar.appendChild(msg); bar.appendChild(x); header.parentNode.insertBefore(bar, header.nextSibling);
}
function start() {
  render(); addEventListener("hashchange", function () { setTimeout(render, 30); }); addEventListener("alethea:route", function () { setTimeout(render, 30); });
  new MutationObserver(render).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
