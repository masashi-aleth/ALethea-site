/* support.js: support center (#/support) + notification bell. Needs schema_support.sql and a signed-in Supabase user.
   All text is rendered with textContent. Permissions are enforced by RLS on the server, never by this file. */
(function () {
  "use strict";
  var L = function () { return document.documentElement.lang === "en" ? "en" : "ar"; };
  var S = {
    ar: { nav: "الدعم", title: "مركز الدعم", login: "سجّل الدخول لفتح تذكرة ومتابعة ردودنا.", loginBtn: "تسجيل الدخول", setup: "الدعم غير مُفعّل بعد: لم يتم إنشاء جداول قاعدة البيانات.",
      newT: "تذكرة جديدة", subject: "الموضوع", cat: "الفئة", pri: "الأولوية", desc: "اشرح مشكلتك", send: "إرسال", mine: "تذاكري", all: "كل التذاكر (مدير)", none: "ما عندك تذاكر بعد. افتح أول تذكرة من الأعلى.",
      notif: "الإشعارات", markAll: "تعليم الكل كمقروء", back: "رجوع للقائمة", reply: "اكتب رداً", you: "أنت", staff: "فريق الدعم", save: "حفظ", err: "حدث خطأ. حاول مرة أخرى.", okT: "تم إنشاء التذكرة", okR: "تم إرسال الرد", okS: "تم الحفظ",
      st: { open: "مفتوحة", in_progress: "قيد المعالجة", waiting_user: "بانتظار ردك", resolved: "تم الحل" }, pr: { low: "منخفضة", normal: "عادية", high: "عالية" },
      ct: { general: "عام", account: "الحساب", store: "المتجر", bug: "مشكلة تقنية", other: "أخرى" },
      n: { reply: "ردّ فريق الدعم على التذكرة ", user_reply: "رد جديد من مستخدم على التذكرة ", status: "تغيّرت حالة التذكرة " }, faqT: "قبل أن تفتح تذكرة",
      faq: "المتجر والدفع هنا تجريبي ولا تُخصم أي مبالغ. الردود تظهر هنا وفي جرس الإشعارات، ولا تُرسل رسائل بريد." },
    en: { nav: "Support", title: "Support center", login: "Sign in to open a ticket and follow our replies.", loginBtn: "Sign in", setup: "Support is not enabled yet: the database tables have not been created.",
      newT: "New ticket", subject: "Subject", cat: "Category", pri: "Priority", desc: "Describe your problem", send: "Send", mine: "My tickets", all: "All tickets (admin)", none: "You have no tickets yet. Open your first one above.",
      notif: "Notifications", markAll: "Mark all as read", back: "Back to list", reply: "Write a reply", you: "You", staff: "Support team", save: "Save", err: "Something went wrong. Try again.", okT: "Ticket created", okR: "Reply sent", okS: "Saved",
      st: { open: "Open", in_progress: "In progress", waiting_user: "Waiting for you", resolved: "Resolved" }, pr: { low: "Low", normal: "Normal", high: "High" },
      ct: { general: "General", account: "Account", store: "Store", bug: "Technical issue", other: "Other" },
      n: { reply: "Support replied to ticket ", user_reply: "A user replied on ticket ", status: "Status changed on ticket " }, faqT: "Before you open a ticket",
      faq: "The store and payments here are a demo and nothing is charged. Replies appear here and in the bell, and no emails are sent." }
  };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var el = function (t, c, x) { var n = document.createElement(t); if (c) n.className = c; if (x != null) n.textContent = x; return n; };
  var db = function () { var d = window.ALETHEA_DB; return d && d.db ? d.db : null; };
  var isAdmin = function () { try { return window.ALETHEA_DB.isAdmin(); } catch (e) { return false; } };
  var toast = function (m) { try { window.ALETHEA.toast(m); } catch (e) {} };
  var uid = null, notifs = [], ready = false;

  async function who() { var c = db(); if (!c) return null; var r = await c.auth.getSession(); uid = r && r.data && r.data.session ? r.data.session.user.id : null; return uid; }
  var when = function (s) { try { return new Date(s).toLocaleString(L() === "en" ? "en-GB" : "ar-IQ", { dateStyle: "medium", timeStyle: "short" }); } catch (e) { return s; } };
  function opt(sel, map, cur) { Object.keys(map).forEach(function (k) { var o = el("option", "", map[k]); o.value = k; if (k === cur) o.selected = true; sel.append(o); }); return sel; }
  function field(label, node) { var w = el("label", "sup-f"); w.append(el("span", "", label), node); return w; }

  /* ---- Notifications + bell ---- */
  async function loadNotifs() {
    var c = db(); if (!c || !(await who())) { notifs = []; bell(); return; }
    var r = await c.from("notifications").select("id,ticket_id,kind,ref,read,created_at").order("created_at", { ascending: false }).limit(30);
    if (r.error) { notifs = []; ready = false; } else { notifs = r.data || []; ready = true; }
    bell();
  }
  function bell() {
    var b = $("#supBell"), nav = $("#nav");
    if (!b) {
      var lb = $("#langBtn"); if (!lb) return;
      b = el("a", "ibtn sup-bell"); b.id = "supBell"; b.href = "#/support";
      b.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 8a6 6 0 10-12 0c0 7-3 8-3 8h18s-3-1-3-8M13.7 20a2 2 0 01-3.4 0"/></svg>';
      b.append(el("span", "sup-n")); lb.parentNode.insertBefore(b, lb);
    }
    var n = notifs.filter(function (x) { return !x.read; }).length; b.hidden = !uid || !ready;
    b.setAttribute("aria-label", S[L()].notif + (n ? " (" + n + ")" : "")); $(".sup-n", b).textContent = n; $(".sup-n", b).hidden = !n;
    if (nav && !$("#supNav")) {
      var a = el("a", "", S[L()].nav); a.id = "supNav"; a.href = "#/support"; a.dataset.r = "support"; a.setAttribute("data-user", ""); a.hidden = !uid;
      var anchor = nav.querySelector('[data-r="community"]'); nav.insertBefore(a, anchor ? anchor.nextSibling : null);
    } else if ($("#supNav")) { $("#supNav").textContent = S[L()].nav; $("#supNav").hidden = !uid; }
  }

  /* ---- Views ---- */
  var param = function () { var m = /^#\/support\/([0-9a-f-]{36})$/i.exec(location.hash); return m ? m[1] : null; };
  var onRoute = function () { return /^#\/support(\/|$)/.test(location.hash); };

  async function render() {
    var root = $("#supportRoot"); if (!root || !onRoute()) return; var t = S[L()]; root.textContent = "";
    var wrap = el("div", "sup"); root.append(wrap); wrap.append(el("h1", "", t.title));
    if (!db() || !(await who())) { wrap.append(el("p", "", t.login)); var a = el("a", "btn", t.loginBtn); a.href = "#/login"; wrap.append(a); return; }
    await loadNotifs(); if (!ready) { wrap.append(el("p", "sup-warn", t.setup)); return; }
    var id = param(); if (id) return detail(wrap, id); return list(wrap);
  }

  async function list(wrap) {
    var t = S[L()], c = db();
    var box = el("details", "sup-faq"); box.append(el("summary", "", t.faqT), el("p", "", t.faq)); wrap.append(box);
    var unread = notifs.filter(function (x) { return !x.read; });
    if (notifs.length) {
      var ns = el("section", "sup-card"); ns.append(el("h2", "", t.notif));
      notifs.slice(0, 5).forEach(function (n) { var row = el("a", "sup-row" + (n.read ? "" : " unread")); row.href = "#/support/" + n.ticket_id; row.append(el("span", "", t.n[n.kind] + (n.ref || "")), el("small", "", when(n.created_at))); ns.append(row); });
      if (unread.length) { var mb = el("button", "btn ghost", t.markAll); mb.type = "button"; mb.onclick = async function () { var r = await c.from("notifications").update({ read: true }).eq("read", false); if (r.error) return toast(t.err); await loadNotifs(); render(); }; ns.append(mb); }
      wrap.append(ns);
    }
    var f = el("form", "sup-card"); f.append(el("h2", "", t.newT));
    var sub = el("input"); sub.required = true; sub.minLength = 3; sub.maxLength = 120;
    var cat = opt(el("select"), t.ct, "general"), pri = opt(el("select"), t.pr, "normal");
    var body = el("textarea"); body.required = true; body.rows = 5; body.maxLength = 4000;
    var go = el("button", "btn", t.send); go.type = "submit"; f.append(field(t.subject, sub), field(t.cat, cat), field(t.pri, pri), field(t.desc, body), go);
    f.onsubmit = async function (e) {
      e.preventDefault(); go.disabled = true;
      try {
        var r = await c.from("support_tickets").insert({ subject: sub.value.trim(), category: cat.value, priority: pri.value, status: "open" }).select("id").single();
        if (r.error) throw r.error;
        var m = await c.from("ticket_messages").insert({ ticket_id: r.data.id, body: body.value.trim() }); if (m.error) throw m.error;
        toast(t.okT); location.hash = "#/support/" + r.data.id;
      } catch (x) { console.warn("support:", x && x.message); toast(t.err); go.disabled = false; }
    };
    wrap.append(f);
    var q = await c.from("support_tickets").select("id,ref,subject,status,priority,updated_at").order("updated_at", { ascending: false }).limit(50);
    var lst = el("section", "sup-card"); lst.append(el("h2", "", isAdmin() ? t.all : t.mine));
    if (q.error) lst.append(el("p", "sup-warn", t.err)); else if (!q.data.length) lst.append(el("p", "", t.none));
    else q.data.forEach(function (k) { var row = el("a", "sup-row"); row.href = "#/support/" + k.id; var l = el("span", "", k.ref + "  " + k.subject), r = el("small", "", t.st[k.status] + " · " + t.pr[k.priority] + " · " + when(k.updated_at)); row.append(l, r); lst.append(row); });
    wrap.append(lst);
  }

  async function detail(wrap, id) {
    var t = S[L()], c = db(), back = el("a", "btn ghost", t.back); back.href = "#/support"; wrap.append(back);
    var k = await c.from("support_tickets").select("id,ref,subject,category,status,priority,created_at").eq("id", id).maybeSingle();
    if (k.error || !k.data) { wrap.append(el("p", "sup-warn", t.err)); return; }
    var tk = k.data; wrap.append(el("h2", "", tk.ref + "  " + tk.subject), el("p", "sup-meta", t.ct[tk.category] + " · " + when(tk.created_at)));
    if (isAdmin()) {
      var bar = el("div", "sup-card sup-bar"), ss = opt(el("select"), t.st, tk.status), ps = opt(el("select"), t.pr, tk.priority), sv = el("button", "btn", t.save); sv.type = "button";
      sv.onclick = async function () { var r = await c.from("support_tickets").update({ status: ss.value, priority: ps.value }).eq("id", id); if (r.error) return toast(t.err); toast(t.okS); render(); };
      bar.append(field(t.pri, ps), field("", ss), sv); wrap.append(bar);
    } else wrap.append(el("p", "sup-badge", t.st[tk.status] + " · " + t.pr[tk.priority]));
    var ms = await c.from("ticket_messages").select("id,is_staff,body,created_at").eq("ticket_id", id).order("created_at"), thread = el("div", "sup-thread");
    (ms.data || []).forEach(function (m) { var b = el("div", "sup-msg" + (m.is_staff ? " staff" : "")); b.append(el("small", "", (m.is_staff ? t.staff : t.you) + " · " + when(m.created_at)), el("p", "", m.body)); thread.append(b); });
    wrap.append(thread);
    var f = el("form", "sup-card"), body = el("textarea"), go = el("button", "btn", t.send); body.required = true; body.rows = 3; body.maxLength = 4000; body.placeholder = t.reply; go.type = "submit"; f.append(body, go);
    f.onsubmit = async function (e) { e.preventDefault(); go.disabled = true; var r = await c.from("ticket_messages").insert({ ticket_id: id, body: body.value.trim() }); if (r.error) { toast(t.err); go.disabled = false; return; } toast(t.okR); render(); };
    wrap.append(f);
    c.from("notifications").update({ read: true }).eq("ticket_id", id).eq("read", false).then(loadNotifs);   // opening a ticket marks its alerts as read
  }

  function init() {
    bell(); render(); loadNotifs();
    addEventListener("hashchange", function () { setTimeout(render, 30); });
    addEventListener("alethea:route", function () { setTimeout(render, 30); });
    addEventListener("alethea:auth", function () { loadNotifs().then(render); });
    new MutationObserver(function () { bell(); render(); }).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
    setInterval(function () { if (!document.hidden && uid) loadNotifs(); }, 60000);
  }
  if (document.readyState === "complete") init(); else addEventListener("load", init);
})();
