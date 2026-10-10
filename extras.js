/* extras.js: Phase 9 additive layer. Quick search (Ctrl/Cmd+K or "/"), store info bar, recently viewed, home FAQ.
   Own bilingual text, textContent only, storage in try/catch. Nothing here talks to a server. */
(function () {
  "use strict";
  var KEY = "alethea.recent.v1";
  var T = {
    ar: { search: "بحث", ph: "ابحث عن منتج أو صفحة…", none: "لا نتائج مطابقة", pages: "الصفحات", prods: "المنتجات",
      info: ["متجر تجريبي: لا يُخصم أي مبلغ", "السلة محفوظة في هذا المتصفح فقط", "لا نطلب أي بيانات دفع"], recent: "شاهدتها مؤخراً:",
      faqT: "أسئلة شائعة",
      faq: [["هل هذا متجر حقيقي؟", "لا. المنتجات والأسعار والمشاريع كلها خيالية للعرض، والدفع محاكاة ولا يُجمع فيه أي بيان دفع."],
            ["أين تُحفظ سلتي ومفضلتي؟", "في هذا المتصفح فقط. لا تنتقل إلى جهاز آخر ولا يراها أحد غيرك."],
            ["كيف أتواصل مع المجتمع؟", "من صفحة المجتمع تجد رابط ديسكورد وعدد المتصلين إن كان الويدجت مفعّلاً."],
            ["كيف أغيّر اللغة أو المظهر؟", "من أزرار الهيدر: زر اللغة وزر الألوان. اختيارك يُحفظ في المتصفح."]] },
    en: { search: "Search", ph: "Search products or pages…", none: "No matches", pages: "Pages", prods: "Products",
      info: ["Demo store: nothing is charged", "Cart is saved in this browser only", "No payment details are collected"], recent: "Recently viewed:",
      faqT: "Frequently asked questions",
      faq: [["Is this a real store?", "No. Products, prices and projects are fictional, and checkout is a simulation that collects no payment details."],
            ["Where are my cart and favorites saved?", "Only in this browser. They don't sync to other devices and nobody else can see them."],
            ["How do I reach the community?", "The Community page has the Discord link and the online count when the widget is enabled."],
            ["How do I change language or theme?", "Use the language and palette buttons in the header. Your choice is remembered."]] }
  };
  var PAGES = [["store", "المتجر", "Store"], ["services", "خدمات", "Services"], ["projects", "مشاريع", "Projects"], ["tools", "أدوات", "Tools"],
               ["community", "المجتمع", "Community"], ["about", "عن ALethea", "About"], ["cart", "السلة", "Cart"]];
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var lang = function () { return document.documentElement.lang === "en" ? "en" : "ar"; };
  var D = function () { try { return window.ALETHEA.data; } catch (e) { return { products: [], categories: [] }; } };
  var el = function (tag, cls, txt) { var n = document.createElement(tag); if (cls) n.className = cls; if (txt != null) n.textContent = txt; return n; };
  var pname = function (p) { return (p.name && (p.name[lang()] || p.name.en)) || p.id; };

  /* ---- Quick search ---- */
  var pal, input, list, sel = 0, links = [];
  function build() {
    pal = el("div"); pal.id = "proPal"; pal.setAttribute("role", "dialog"); pal.setAttribute("aria-modal", "true");
    var box = el("div", "pro-box"); input = el("input"); input.type = "search"; input.autocomplete = "off";
    list = el("ul", "pro-list"); box.append(input, list); pal.append(box); document.body.append(pal);
    pal.addEventListener("click", function (e) { if (e.target === pal || e.target.closest("a")) close(); });
    input.addEventListener("input", fill);
    input.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); mark(sel + (e.key === "ArrowDown" ? 1 : -1)); }
      else if (e.key === "Enter" && links[sel]) { e.preventDefault(); links[sel].click(); }
    });
  }
  function mark(i) {
    if (!links.length) return; sel = (i + links.length) % links.length;
    links.forEach(function (a, k) { a.classList.toggle("sel", k === sel); }); links[sel].scrollIntoView({ block: "nearest" });
  }
  function row(href, title, sub) { var li = el("li"), a = el("a"); a.href = href; a.append(el("span", "", title), el("small", "", sub || "")); li.append(a); links.push(a); return li; }
  function fill() {
    var q = input.value.trim().toLowerCase(), l = lang(), d = D(), t = T[l]; list.textContent = ""; links = [];
    var pages = PAGES.filter(function (p) { return !q || p[l === "en" ? 2 : 1].toLowerCase().indexOf(q) > -1; });
    var cats = {}; (d.categories || []).forEach(function (c) { cats[c.id] = c.name && (c.name[l] || c.name.en); });
    var prods = (d.products || []).filter(function (p) {
      return p.status === "published" && (!q || (((p.name && (p.name.ar + " " + p.name.en)) || "") + " " + (p.tags || []).join(" ")).toLowerCase().indexOf(q) > -1);
    }).slice(0, 8);
    if (pages.length) { list.append(el("h3", "", t.pages)); pages.forEach(function (p) { list.append(row("#/" + p[0], p[l === "en" ? 2 : 1])); }); }
    if (prods.length) { list.append(el("h3", "", t.prods)); prods.forEach(function (p) { list.append(row("#/product/" + p.id, pname(p), cats[p.cat])); }); }
    if (!links.length) list.append(el("li", "pro-empty", t.none)); mark(0);
  }
  function open() { if (!pal) build(); input.placeholder = T[lang()].ph; input.value = ""; fill(); pal.classList.add("on"); input.focus(); }
  function close() { if (pal) pal.classList.remove("on"); }
  function addBtn() {
    if ($("#proSearchBtn")) return; var th = $("#themeBtn"); if (!th) return;
    var b = el("button", "ibtn pro-sbtn"); b.id = "proSearchBtn"; b.type = "button";
    b.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>';
    b.setAttribute("aria-label", T[lang()].search); b.addEventListener("click", open); th.parentNode.insertBefore(b, th);
  }
  document.addEventListener("keydown", function (e) {
    var typing = /^(INPUT|TEXTAREA|SELECT)$/.test((document.activeElement || {}).tagName || "");
    if ((e.key === "k" && (e.ctrlKey || e.metaKey)) || (e.key === "/" && !typing)) { e.preventDefault(); open(); }
    else if (e.key === "Escape") close();
  });

  /* ---- Recently viewed ---- */
  function recent() { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; } }
  function track() {
    var m = /^#\/product\/(.+)$/.exec(location.hash); if (!m) return; var id = decodeURIComponent(m[1]);
    if (!(D().products || []).some(function (p) { return p.id === id; })) return;
    var r = [id].concat(recent().filter(function (x) { return x !== id; })).slice(0, 4);
    try { localStorage.setItem(KEY, JSON.stringify(r)); } catch (e) {}
  }

  /* ---- Store info bar (+ recently viewed) ---- */
  function storeBar() {
    var root = $("#storeRoot"); if (!root) return; var old = $("#proStoreBar");
    if (old) { if (old.dataset.l === lang() && old.dataset.r === recent().join()) return; old.remove(); }
    var t = T[lang()], bar = el("div", "pro-info"); bar.id = "proStoreBar"; bar.dataset.l = lang(); bar.dataset.r = recent().join();
    t.info.forEach(function (s) { bar.append(el("span", "", s)); });
    var prods = D().products || [], ids = recent().filter(function (id) { return prods.some(function (p) { return p.id === id && p.status === "published"; }); });
    if (ids.length) {
      var wrap = el("div", "pro-recent"); wrap.append(el("span", "", t.recent));
      ids.forEach(function (id) { var p = prods.filter(function (x) { return x.id === id; })[0], a = el("a", "", pname(p)); a.href = "#/product/" + id; wrap.append(a); });
      bar.append(wrap);
    }
    root.insertBefore(bar, root.firstChild);
  }

  /* ---- Home FAQ ---- */
  function faq() {
    var host = $("#homeSections"); if (!host) return; var old = $("#proFaq"); var l = lang();
    if (old) { if (old.dataset.l === l) return; old.remove(); }
    var s = el("section", "pro-faq"); s.id = "proFaq"; s.dataset.l = l; s.append(el("h2", "", T[l].faqT));
    T[l].faq.forEach(function (qa) { var d = el("details"); d.append(el("summary", "", qa[0]), el("p", "", qa[1])); s.append(d); });
    host.insertAdjacentElement("afterend", s);
  }


  /* ---- Weak-device tier (low cores/RAM or Data Saver): drop blur effects. Sites of the Day in 2026 do the same. ---- */
  try {
    var n = navigator, weak = (n.hardwareConcurrency && n.hardwareConcurrency <= 4) || (n.deviceMemory && n.deviceMemory <= 2) || (n.connection && n.connection.saveData);
    if (weak) document.documentElement.classList.add("pro-lite");
  } catch (e) {}

  /* ---- Pointer spotlight on product cards (mouse only; CSS hides it elsewhere) ---- */
  var raf = 0;
  document.addEventListener("pointermove", function (e) {
    if (e.pointerType !== "mouse" || raf) return;
    var c = e.target.closest && e.target.closest(".pcard"); if (!c) return;
    raf = requestAnimationFrame(function () {
      raf = 0; var r = c.getBoundingClientRect();
      c.style.setProperty("--mx", (e.clientX - r.left) + "px"); c.style.setProperty("--my", (e.clientY - r.top) + "px");
    });
  }, { passive: true });

  function refresh() { addBtn(); var b = $("#proSearchBtn"); if (b) b.setAttribute("aria-label", T[lang()].search); track(); storeBar(); faq(); }
  function init() {
    refresh();
    addEventListener("hashchange", function () { setTimeout(refresh, 40); });
    addEventListener("alethea:route", function () { setTimeout(refresh, 40); });
    new MutationObserver(refresh).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
    var sr = $("#storeRoot"); if (sr) new MutationObserver(storeBar).observe(sr, { childList: true });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
