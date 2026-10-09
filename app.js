(() => {
"use strict";
const C = window.ALETHEA_CONFIG || {};
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const ready = v => typeof v === "string" && v && !/^PASTE/.test(v);
const NEED_CFG = "الموقع غير مربوط بـ Supabase بعد. عدّل ملف config.js أولاً.";
const back = location.origin + location.pathname.replace(/index\.html$/, "");

const db = ready(C.SUPABASE_URL) && ready(C.SUPABASE_ANON_KEY) && window.supabase
  ? window.supabase.createClient(C.SUPABASE_URL, C.SUPABASE_ANON_KEY, { auth: { flowType: "pkce" } })
  : null;

let session = null, profile = null;
const isAdmin = () => !!profile && profile.role === "admin";

const toast = $("#toast"); let tt;
function say(m) { toast.textContent = m; toast.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove("show"), 3200); }
function show(el, text, bad) { el.textContent = text; el.className = "msg " + (bad ? "bad" : "good"); }

// زر الانضمام
$$(".join").forEach(a => {
  if (ready(C.DISCORD_INVITE_URL)) a.href = C.DISCORD_INVITE_URL;
  else a.addEventListener("click", e => { e.preventDefault(); say("ضع رابط دعوة السيرفر في config.js"); });
});

// عدد المتصلين (اختياري)
if (ready(C.DISCORD_GUILD_ID) && /^\d+$/.test(C.DISCORD_GUILD_ID)) {
  fetch("https://discord.com/api/guilds/" + C.DISCORD_GUILD_ID + "/widget.json")
    .then(r => r.ok ? r.json() : null)
    .then(j => { if (j && typeof j.presence_count === "number") { $("#online").textContent = j.presence_count; $("#live").hidden = false; } })
    .catch(() => {});
}

// التنقل
// المسارات تُقرأ من عناصر .view في الصفحة (تمت إضافة صفحات جديدة). الأسماء المستعارة تفتح قسماً داخل صفحة المجتمع.
const routes = $$(".view").map(v => v.id);
const alias = { youtube: "community", discord: "community", instagram: "community" };
const group = { product: "store", cart: "store", checkout: "store" };
function route(top = true) {
  const seg = location.hash.replace(/^#\/?/, "").split("/");
  const name = seg[0] || "home";
  let id = alias[name] || name;
  if (!routes.includes(id)) id = "home";
  if (session && (id === "login" || id === "register")) { location.hash = "#/"; return; }
  $$(".view").forEach(v => v.classList.toggle("on", v.id === id));
  $$("nav a[data-r], .dock a[data-r]").forEach(a => a.classList.toggle("on", a.dataset.r === (group[id] || id)));
  $("#nav").classList.remove("open"); $("#menu").setAttribute("aria-expanded", "false");
  if (top) scrollTo(0, 0);
  if (id === "admin") renderAdmin();
  window.dispatchEvent(new CustomEvent("alethea:route", { detail: { id, name, param: seg.slice(1).join("/") } }));
}
addEventListener("hashchange", () => route());
$("#menu").onclick = () => { const o = $("#nav").classList.toggle("open"); $("#menu").setAttribute("aria-expanded", o); };

// حالة المستخدم
async function loadProfile() {
  profile = null;
  if (!db || !session) return;
  const { data } = await db.from("profiles").select("id,username,role").eq("id", session.user.id).maybeSingle();
  profile = data;
}
function paint() {
  $$("[data-guest]").forEach(e => e.hidden = !!session);
  $$("[data-user]").forEach(e => e.hidden = !session);
  $$("[data-admin]").forEach(e => e.hidden = !isAdmin());
  $("#who").textContent = (profile && profile.username) || (session && session.user.email) || "";
}

// الأخطاء بالعربي
function tr(m) {
  m = String(m || "");
  if (/Invalid login/i.test(m)) return "البريد أو كلمة المرور غير صحيحة";
  if (/not confirmed/i.test(m)) return "فعّل بريدك من رسالة التأكيد أولاً";
  if (/already registered/i.test(m)) return "هذا البريد مسجّل مسبقاً";
  if (/rate limit/i.test(m)) return "محاولات كثيرة، انتظر قليلاً ثم أعد المحاولة";
  if (/Password should/i.test(m)) return "كلمة المرور ضعيفة، استخدم 8 أحرف على الأقل";
  return "حدث خطأ: " + m;
}

// تسجيل الدخول عبر Discord
$$("[data-discord]").forEach(b => b.onclick = async () => {
  if (!db) return say(NEED_CFG);
  const { error } = await db.auth.signInWithOAuth({ provider: "discord", options: { redirectTo: back } });
  if (error) say(tr(error.message));
});

// النماذج
$$("form[data-f]").forEach(f => f.addEventListener("submit", async e => {
  e.preventDefault();
  const kind = f.dataset.f, msg = $(".msg", f), btn = $("button[type=submit]", f);
  const errs = $$(".err", f), val = {}; let ok = true;
  $$("input", f).forEach((inp, i) => {
    const v = inp.value.trim(); let m = "";
    if (!v) m = "هذا الحقل مطلوب";
    else if (inp.type === "email" && !/^\S+@\S+\.\S+$/.test(v)) m = "اكتب بريداً صحيحاً";
    else if (inp.name === "pass" && kind === "register" && inp.value.length < 8) m = "كلمة المرور أقصر من 8 أحرف";
    inp.classList.toggle("bad", !!m); errs[i].textContent = m; if (m) ok = false;
    val[inp.name] = inp.name === "pass" ? inp.value : v;
  });
  msg.textContent = ""; msg.className = "msg";
  if (!ok) return;
  if (!db) return show(msg, NEED_CFG, true);
  btn.disabled = true;
  try {
    if (kind === "login") {
      const { error } = await db.auth.signInWithPassword({ email: val.email, password: val.pass });
      if (error) throw error;
    } else {
      const { data, error } = await db.auth.signUp({ email: val.email, password: val.pass, options: { data: { username: val.name }, emailRedirectTo: back } });
      if (error) throw error;
      if (!data.session) { show(msg, "تم إنشاء الحساب. افتح بريدك واضغط رابط التأكيد ثم سجّل الدخول."); f.reset(); }
    }
  } catch (err) { show(msg, tr(err.message), true); }
  btn.disabled = false;
}));

$("#logout").onclick = async () => { if (db) await db.auth.signOut(); say("تم تسجيل الخروج"); location.hash = "#/"; };

// لوحة التحكم
$$(".tabs button").forEach(b => b.onclick = () => {
  $$(".tabs button").forEach(x => x.classList.toggle("on", x === b));
  $$(".tab").forEach(t => t.classList.toggle("on", t.id === b.dataset.t));
});

async function renderAdmin() {
  const ok = isAdmin(), den = $("#adminDenied");
  den.hidden = ok; $("#adminBody").hidden = !ok;
  if (!ok) { den.textContent = !db ? NEED_CFG : session ? "حسابك لا يملك صلاحية إدارة." : "هذه الصفحة للإداريين فقط. سجّل الدخول أولاً."; return; }
  const [p, s] = await Promise.all([
    db.from("profiles").select("id,username,role,provider,created_at").order("created_at", { ascending: false }).limit(500),
    db.from("site_settings").select("key,value")
  ]);
  if (p.error) return say("تعذّر تحميل الأعضاء");
  const rows = p.data, week = Date.now() - 7 * 864e5;
  $("#sTotal").textContent = rows.length;
  $("#sWeek").textContent = rows.filter(r => new Date(r.created_at) > week).length;
  $("#sAdmins").textContent = rows.filter(r => r.role === "admin").length;
  $("#sDiscord").textContent = rows.filter(r => r.provider === "discord").length;

  const tb = $("#members"); tb.replaceChildren();
  rows.forEach(r => {
    const tr_ = document.createElement("tr");
    const td = t => { const d = document.createElement("td"); d.textContent = t; tr_.appendChild(d); return d; };
    td(r.username || "—"); td(r.provider === "discord" ? "Discord" : "بريد"); td(r.role === "admin" ? "مدير" : "عضو");
    const a = td("");
    if (r.id !== session.user.id) {
      const b = document.createElement("button"); b.className = "mini";
      b.textContent = r.role === "admin" ? "إزالة الإدارة" : "ترقية لمدير";
      b.onclick = () => setRole(r, b); a.appendChild(b);
    }
    tb.appendChild(tr_);
  });

  const days = [...Array(7)].map((_, i) => { const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - (6 - i)); return { d, n: 0 }; });
  rows.forEach(r => { const t = new Date(r.created_at); t.setHours(0, 0, 0, 0); const c = days.find(x => x.d.getTime() === t.getTime()); if (c) c.n++; });
  const max = Math.max(1, ...days.map(c => c.n)), ch = $("#chart"); ch.replaceChildren();
  days.forEach(c => {
    const b = document.createElement("div");
    b.dataset.d = c.d.toLocaleDateString("ar", { weekday: "short" });
    b.setAttribute("aria-label", c.n + " تسجيل"); b.title = c.n + " تسجيل"; ch.appendChild(b);
    requestAnimationFrame(() => requestAnimationFrame(() => b.style.height = Math.max(4, c.n / max * 100) + "%"));
  });

  const map = Object.fromEntries((s.data || []).map(x => [x.key, x.value]));
  $$(".sw[data-key]").forEach(sw => sw.setAttribute("aria-checked", String(!!map[sw.dataset.key])));
}

async function setRole(r, b) {
  const role = r.role === "admin" ? "member" : "admin";
  if (!confirm("تغيير رتبة " + (r.username || "هذا العضو") + "؟")) return;
  b.disabled = true;
  const { error } = await db.rpc("set_user_role", { target: r.id, new_role: role });
  if (error) say("لم تتغير الرتبة"); else { say("تم تغيير الرتبة"); renderAdmin(); }
}

$$(".sw").forEach(sw => {
  const t = async () => {
    if (!db || !isAdmin()) return;
    const v = sw.getAttribute("aria-checked") !== "true";
    sw.setAttribute("aria-checked", String(v));
    const { error } = await db.from("site_settings").upsert({ key: sw.dataset.key, value: v, updated_at: new Date().toISOString() });
    if (error) { sw.setAttribute("aria-checked", String(!v)); say("تعذّر حفظ الإعداد"); } else say("تم الحفظ");
  };
  sw.onclick = t;
  sw.onkeydown = e => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); t(); } };
});

// البدء
async function init() {
  paint(); route();
  if (!db) return;
  const { data } = await db.auth.getSession(); session = data.session;
  if (/[?&]code=/.test(location.search)) history.replaceState(null, "", location.pathname + location.hash);
  await loadProfile(); paint(); route(false);
  db.auth.onAuthStateChange((_e, s) => {
    session = s;
    setTimeout(async () => { await loadProfile(); paint(); route(false); }, 0);
  });
}
init();
})();
