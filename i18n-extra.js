/* i18n-extra.js: English/Arabic text for the static Login, Register and Community markup.
   Elements carry data-x="key"; the Arabic text stays in index.html as the default, English is applied when the site language is EN.
   The three blocks also switch dir/lang so English reads left-to-right. Messages produced by app.js are bilingual inside app.js. */
(function () {
  "use strict";
  var X = {
    "auth.discord": ["المتابعة عبر Discord", "Continue with Discord"], "auth.or": ["أو بالبريد", "or with email"],
    "auth.email": ["البريد الإلكتروني", "Email"], "auth.pass": ["كلمة المرور", "Password"],
    "login.title": ["تسجيل الدخول", "Log in"], "login.btn": ["دخول", "Log in"], "login.alt": ["ليس لديك حساب؟", "Don't have an account?"], "login.alt2": ["أنشئ حساباً", "Create one"],
    "reg.title": ["إنشاء حساب", "Create account"], "reg.name": ["اسم المستخدم", "Username"], "reg.pass": ["كلمة المرور (8 أحرف على الأقل)", "Password (at least 8 characters)"],
    "reg.btn": ["إنشاء الحساب", "Create account"], "reg.alt": ["لديك حساب؟", "Already have an account?"], "reg.alt2": ["سجّل الدخول", "Log in"],
    "com.row1.h": ["دردشة", "Chat"], "com.row1.p": ["قنوات نقاش مفتوحة بجو هادئ ومنظم، مع مشرفين متواجدين.", "Open discussion channels in a calm, organized atmosphere, with moderators present."],
    "com.row2.h": ["فعاليات", "Events"], "com.row2.p": ["مسابقات وسهرات ألعاب وجلسات صوتية كل أسبوع.", "Contests, game nights and voice sessions every week."],
    "com.row3.h": ["مشاريع", "Projects"], "com.row3.p": ["مساحة لعرض أعمالك وطلب الملاحظات من الأعضاء.", "A place to show your work and get feedback from members."],
    "com.channels": ["القنوات", "Channels"],
    "com.c1": ["# الترحيب", "# welcome"], "com.c1d": ["ابدأ من هنا", "Start here"], "com.c2": ["# العام", "# general"], "com.c2d": ["نقاش حر", "Open discussion"],
    "com.c3": ["# الألعاب", "# games"], "com.c3d": ["فرق وأخبار", "Teams and news"], "com.c4": ["# المشاريع", "# projects"], "com.c4d": ["اعرض عملك", "Show your work"],
    "com.c5": ["🔊 غرفة الصوت", "🔊 Voice room"], "com.c5d": ["جلسات مباشرة", "Live sessions"],
    "com.rules": ["القوانين", "Rules"], "com.r1": ["احترام جميع الأعضاء", "Respect all members"], "com.r2": ["ممنوع الإعلانات دون إذن", "No advertising without permission"],
    "com.r3": ["لا للمحتوى المسيء أو المخالف", "No offensive or rule-breaking content"], "com.r4": ["اتبع تعليمات المشرفين", "Follow the moderators' instructions"],
    "com.roles": ["الرتب", "Roles"], "com.o": ["المالك", "Owner"], "com.od": ["إدارة كاملة", "Full management"], "com.m": ["مشرف", "Moderator"], "com.md": ["إدارة المحادثات", "Chat moderation"],
    "com.u": ["عضو", "Member"], "com.ud": ["وصول عام", "General access"]
  };
  var BLOCKS = ["login", "register", "comBody"];
  function apply() {
    var en = document.documentElement.lang === "en";
    [].forEach.call(document.querySelectorAll("[data-x]"), function (e) { var v = X[e.getAttribute("data-x")]; if (v) e.textContent = v[en ? 1 : 0]; });
    BLOCKS.forEach(function (id) { var s = document.getElementById(id); if (s) { s.setAttribute("dir", en ? "ltr" : "rtl"); s.setAttribute("lang", en ? "en" : "ar"); } });
  }
  apply();
  new MutationObserver(apply).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
})();
