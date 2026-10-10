/* account-sync.js: saves the signed-in user's theme to Supabase (table user_settings) and restores it on any device.
   Visitors who are not signed in keep using this browser's localStorage only. If the table is missing, nothing happens. */
(function () {
  "use strict";
  var KEY = "alethea.theme.v1", NUM = { ang: 360, bgi: 100, glow: 100, motion: 100 }, last = "", timer = 0, busy = false;
  var T = { ar: ["تمت مزامنة مظهرك مع حسابك", "تعذّر حفظ المظهر في حسابك"], en: ["Your theme is synced to your account", "Could not save your theme to your account"] };
  var say = function (i) { try { window.ALETHEA.toast(T[document.documentElement.lang === "en" ? "en" : "ar"][i]); } catch (e) {} };
  var hex = function (v) { return typeof v === "string" && /^#[0-9a-f]{6}$/i.test(v); };

  /* Only known keys with valid values are accepted from the server. */
  function clean(raw) {
    if (!raw || typeof raw !== "object") return null; var o = {}, ok = false;
    ["c1", "c2", "c3", "bg"].forEach(function (k) { if (hex(raw[k])) { o[k] = raw[k]; ok = true; } });
    Object.keys(NUM).forEach(function (k) { var n = Number(raw[k]); if (isFinite(n)) { o[k] = Math.min(NUM[k], Math.max(0, n)); ok = true; } });
    if (["bgp", "pbg", "gpb"].indexOf(raw.order) > -1) o.order = raw.order;
    if (typeof raw.preset === "string" && raw.preset.length < 20) o.preset = raw.preset;
    return ok ? o : null;
  }
  var db = function () { var d = window.ALETHEA_DB; return d && d.db ? d.db : null; };
  var snap = function () { try { return JSON.stringify(clean(window.ALETHEA.theme) || {}); } catch (e) { return ""; } };

  async function uid() { var r = await db().auth.getSession(); return r && r.data && r.data.session ? r.data.session.user.id : null; }

  async function push() {
    var c = db(); if (!c || busy) return; var s = snap(); if (!s || s === last) return; busy = true;
    try {
      var id = await uid(); if (!id) return;
      var r = await c.from("user_settings").upsert({ user_id: id, theme: JSON.parse(s), updated_at: new Date().toISOString() });
      if (r && r.error) throw r.error; last = s;
    } catch (e) { console.warn("account-sync: save failed", e && e.message); say(1); last = s; }
    finally { busy = false; }
  }

  /* On sign-in: the account's saved theme wins; if the account has none yet, upload this device's theme. */
  async function pull() {
    var c = db(); if (!c || !window.ALETHEA) return;
    try {
      var id = await uid(); if (!id) { stop(); return; }
      var r = await c.from("user_settings").select("theme").eq("user_id", id).maybeSingle();
      if (r && r.error) throw r.error;
      var remote = r && r.data ? clean(r.data.theme) : null;
      if (remote) {
        Object.assign(window.ALETHEA.theme, remote);
        try { localStorage.setItem(KEY, JSON.stringify(window.ALETHEA.theme)); } catch (e) {}
        window.ALETHEA.applyTheme(); last = snap(); say(0);
      } else { last = ""; await push(); }
      start();
    } catch (e) { console.warn("account-sync: unavailable", e && e.message); }
  }
  function start() { if (!timer) timer = setInterval(function () { if (!document.hidden) push(); }, 2500); }
  function stop() { clearInterval(timer); timer = 0; last = ""; }

  addEventListener("alethea:auth", pull);
  if (document.readyState === "complete") pull(); else addEventListener("load", pull);
})();
