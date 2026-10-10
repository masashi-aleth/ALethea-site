/* ops.js: admin operations page (#/ops): overview, health check, searchable audit log with CSV export.
   The page is only shown to admins, but the real protection is RLS on audit_log (schema_audit.sql). textContent only. */
(function () {
  "use strict";
  var PAGE = 20, page = 0, kind = "", q = "";
  var L = function () { return document.documentElement.lang === "en" ? "en" : "ar"; };
  var S = {
    ar: { nav: "العمليات", title: "لوحة العمليات", denied: "هذه الصفحة للمدراء فقط.", members: "الأعضاء", new7: "جدد (7 أيام)", open: "تذاكر مفتوحة", resolved: "تذاكر محلولة",
      byStatus: "التذاكر حسب الحالة", health: "حالة النظام", db: "قاعدة البيانات", ok: "متصلة", bad: "غير متاحة", log: "سجل الأحداث", all: "كل الأنواع", ticket: "التذاكر", role: "الأدوار",
      search: "بحث بالهدف", time: "الوقت", action: "الحدث", target: "الهدف", prev: "السابق", next: "التالي", csv: "تصدير CSV", empty: "لا توجد أحداث.", setup: "سجل الأحداث غير مُفعّل: شغّل schema_audit.sql.", err: "تعذّر التحميل.",
      st: { open: "مفتوحة", in_progress: "قيد المعالجة", waiting_user: "بانتظار المستخدم", resolved: "محلولة" } },
    en: { nav: "Operations", title: "Operations", denied: "This page is for admins only.", members: "Members", new7: "New (7 days)", open: "Open tickets", resolved: "Resolved tickets",
      byStatus: "Tickets by status", health: "System health", db: "Database", ok: "reachable", bad: "unavailable", log: "Audit log", all: "All types", ticket: "Tickets", role: "Roles",
      search: "Search target", time: "Time", action: "Event", target: "Target", prev: "Previous", next: "Next", csv: "Export CSV", empty: "No events.", setup: "Audit log is not enabled: run schema_audit.sql.", err: "Could not load.",
      st: { open: "Open", in_progress: "In progress", waiting_user: "Waiting for user", resolved: "Resolved" } }
  };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var el = function (t, c, x) { var n = document.createElement(t); if (c) n.className = c; if (x != null) n.textContent = x; return n; };
  var db = function () { var d = window.ALETHEA_DB; return d && d.db ? d.db : null; };
  var isAdmin = function () { try { return window.ALETHEA_DB.isAdmin(); } catch (e) { return false; } };
  var onRoute = function () { return /^#\/ops$/.test(location.hash); };
  var when = function (s) { try { return new Date(s).toLocaleString(L() === "en" ? "en-GB" : "ar-IQ", { dateStyle: "short", timeStyle: "medium" }); } catch (e) { return s; } };
  var cell = function (t, c) { var d = el("div", "ops-card"); d.append(el("b", "", c), el("small", "", t)); return d; };

  function navLink() {
    var nav = $("#nav"); if (!nav) return; var a = $("#opsNav");
    if (!a) { a = el("a"); a.id = "opsNav"; a.href = "#/ops"; a.dataset.r = "ops"; a.setAttribute("data-admin", ""); a.hidden = !isAdmin(); var an = nav.querySelector('[data-r="admin"]'); nav.insertBefore(a, an ? an.nextSibling : null); }
    a.textContent = S[L()].nav; a.hidden = !isAdmin();
  }
  var count = async function (b) { var r = await b; return r.error ? null : r.count; };

  async function render() {
    navLink(); var root = $("#opsRoot"); if (!root || !onRoute()) return; var t = S[L()]; root.textContent = ""; var w = el("div", "sup ops"); root.append(w); w.append(el("h1", "", t.title));
    var c = db(); if (!c || !isAdmin()) { w.append(el("p", "sup-warn", t.denied)); return; }
    var since = new Date(Date.now() - 7 * 864e5).toISOString(), t0 = performance.now();
    var tk = await c.from("support_tickets").select("status").limit(1000), ms = Math.round(performance.now() - t0);
    var mem = await count(c.from("profiles").select("id", { count: "exact", head: true })), nw = await count(c.from("profiles").select("id", { count: "exact", head: true }).gte("created_at", since));
    var tally = { open: 0, in_progress: 0, waiting_user: 0, resolved: 0 }; (tk.data || []).forEach(function (x) { if (x.status in tally) tally[x.status]++; });
    var g = el("div", "ops-grid"); g.append(cell(t.members, mem == null ? "-" : mem), cell(t.new7, nw == null ? "-" : nw), cell(t.open, tk.error ? "-" : tally.open + tally.in_progress + tally.waiting_user), cell(t.resolved, tk.error ? "-" : tally.resolved)); w.append(g);
    var ch = el("section", "sup-card"); ch.append(el("h2", "", t.byStatus)); var mx = Math.max(1, tally.open, tally.in_progress, tally.waiting_user, tally.resolved);
    Object.keys(tally).forEach(function (k) { var r = el("div", "ops-bar"), bar = el("i"); bar.style.width = Math.round(tally[k] / mx * 100) + "%"; r.append(el("span", "", t.st[k] + " (" + tally[k] + ")"), bar); ch.append(r); }); w.append(ch);
    var h = el("section", "sup-card"); h.append(el("h2", "", t.health), el("p", "", t.db + ": " + (tk.error ? t.bad : t.ok + " · " + ms + " ms"))); w.append(h);
    w.append(await logView());
  }

  async function logView() {
    var t = S[L()], c = db(), box = el("section", "sup-card"); box.append(el("h2", "", t.log));
    var bar = el("div", "sup-bar"), sel = el("select"), inp = el("input"), csv = el("button", "btn ghost", t.csv); csv.type = "button";
    [["", t.all], ["ticket.", t.ticket], ["role.", t.role]].forEach(function (o) { var op = el("option", "", o[1]); op.value = o[0]; if (o[0] === kind) op.selected = true; sel.append(op); });
    inp.placeholder = t.search; inp.value = q; inp.maxLength = 60; bar.append(sel, inp, csv); box.append(bar);
    var s = c.from("audit_log").select("at,actor,action,target,severity,meta").order("at", { ascending: false }).range(page * PAGE, page * PAGE + PAGE - 1);
    if (kind) s = s.like("action", kind + "%"); if (q) s = s.ilike("target", "%" + q.replace(/[%_,()\\]/g, " ") + "%");
    var r = await s; if (r.error) { box.append(el("p", "sup-warn", t.setup)); return box; }
    var rows = r.data || []; if (!rows.length) box.append(el("p", "", t.empty));
    var tb = el("div", "ops-scroll"), tbl = el("table"), hd = el("tr"); ["time", "action", "target"].forEach(function (k) { hd.append(el("th", "", t[k])); }); tbl.append(hd);
    rows.forEach(function (x) { var tr = el("tr", x.severity === "critical" ? "crit" : ""); tr.append(el("td", "", when(x.at)), el("td", "", x.action + (x.meta && x.meta.status_to ? " → " + x.meta.status_to : x.meta && x.meta.to ? " → " + x.meta.to : "")), el("td", "", (x.target || "") + (x.actor ? " · " + String(x.actor).slice(0, 8) : ""))); tbl.append(tr); });
    tb.append(tbl); box.append(tb);
    var pg = el("div", "sup-bar"), pv = el("button", "btn ghost", t.prev), nx = el("button", "btn ghost", t.next); pv.type = nx.type = "button"; pv.disabled = page === 0; nx.disabled = rows.length < PAGE;
    pv.onclick = function () { page--; render(); }; nx.onclick = function () { page++; render(); }; pg.append(pv, nx); box.append(pg);
    var go = function () { kind = sel.value; q = inp.value.trim(); page = 0; render(); }; sel.onchange = go; inp.onchange = go;
    csv.onclick = function () {   // spreadsheet-safe: cells starting with = + - @ are prefixed so they cannot run as formulas
      var safe = function (v) { v = String(v == null ? "" : v); if (/^[=+\-@\t\r]/.test(v)) v = "'" + v; return '"' + v.replace(/"/g, '""') + '"'; };
      var out = ["at,actor,action,target,severity"].concat(rows.map(function (x) { return [x.at, x.actor, x.action, x.target, x.severity].map(safe).join(","); })).join("\n");
      var a = el("a"); a.href = URL.createObjectURL(new Blob([out], { type: "text/csv" })); a.download = "alethea-audit-page" + (page + 1) + ".csv"; a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
    };
    return box;
  }

  function init() {
    navLink(); render();
    addEventListener("hashchange", function () { setTimeout(render, 30); });
    addEventListener("alethea:route", function () { setTimeout(render, 30); });
    addEventListener("alethea:auth", function () { setTimeout(render, 60); });
    new MutationObserver(render).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  }
  if (document.readyState === "complete") init(); else addEventListener("load", init);
})();
