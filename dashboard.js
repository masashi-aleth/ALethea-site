/* ALethea — DEMO dashboard (#/dashboard).
   IMPORTANT: no login and no server. Edits are saved in THIS browser only (localStorage).
   Nothing here is visible to other visitors/devices. Real protected admin = #/admin (Supabase). */
(() => {
"use strict";
const A = window.ALETHEA; if (!A) return;
const { h, icon, loc, clear, safeUrl, safeImg, art, STYLES, money, toast, clamp } = A;
const $ = (s, r = document) => r.querySelector(s);

const DT = {
ar: {
  title: "لوحة التحكم التجريبية", sub: "أضف وعدّل المحتوى من هاتفك بدون لمس الكود.",
  banner: "وضع تجريبي: لا يوجد تسجيل دخول ولا خادم. كل تغيير يُحفظ في هذا المتصفح فقط ولا يظهر لزوار آخرين أو لأجهزتك الأخرى. للحفظ الدائم يلزم قاعدة بيانات (انظر الإعداد والتكاملات).",
  "tab.overview": "نظرة عامة", "tab.products": "المنتجات", "tab.categories": "الفئات", "tab.projects": "المشاريع", "tab.news": "الإعلانات", "tab.sections": "أقسام الموقع",
  "tab.social": "الروابط", "tab.theme": "الثيم والألوان", "tab.setup": "الإعداد والتكاملات", "tab.activity": "السجل",
  kp: "منشور", kh: "مخفي أو مسودة", kc: "فئات", kpr: "مشاريع", kn: "إعلانات", kcart: "قطع في سلتك", byCat: "المنتجات حسب الفئة",
  quick: "إجراءات سريعة", addProduct: "منتج جديد", viewSite: "عرض الموقع", storage: "حجم البيانات المحفوظة", kb: "ك.ب",
  add: "إضافة", edit: "تعديل", del: "حذف", save: "حفظ", cancel: "إلغاء", close: "إغلاق", publish: "نشر", hide: "إخفاء", feature: "تمييز", unfeature: "إلغاء التمييز",
  "st.published": "منشور", "st.hidden": "مخفي", "st.draft": "مسودة", "st.all": "الكل",
  "f.nameAr": "الاسم بالعربية", "f.nameEn": "الاسم بالإنجليزية", "f.descAr": "الوصف بالعربية", "f.descEn": "الوصف بالإنجليزية", "f.price": "السعر المعروض (تجريبي)", "f.old": "السعر قبل الخصم (اختياري)",
  "f.cat": "الفئة", "f.tags": "الوسوم (مفصولة بفواصل)", "f.badgeAr": "شارة ترويجية بالعربية", "f.badgeEn": "شارة ترويجية بالإنجليزية", "f.avail": "الحالة", "f.status": "الظهور",
  "f.featured": "منتج مميز", "f.artStyle": "نمط الصورة المولّدة", "f.hue": "لون الصورة", "f.image": "صورة مخصصة (رابط https)", "f.upload": "رفع صورة من الهاتف", "f.removeImg": "إزالة الصورة المخصصة",
  "f.gallery": "صور إضافية (رابط في كل سطر)", "f.preview": "معاينة مباشرة", "f.imgNote": "الصورة المرفوعة تُصغَّر وتُحفظ داخل المتصفح. الصور الكبيرة تستهلك مساحة التخزين.",
  "f.title": "العنوان", "f.titleAr": "العنوان بالعربية", "f.titleEn": "العنوان بالإنجليزية", "f.bodyAr": "النص بالعربية", "f.bodyEn": "النص بالإنجليزية", "f.link": "الرابط (اختياري، https)",
  "f.date": "التاريخ", "f.pinned": "تثبيت في الأعلى", "f.icon": "الأيقونة", "f.hue2": "اللون",
  "av.available": "متوفر", "av.limited": "كمية محدودة", "av.soon": "قريباً",
  newProduct: "منتج جديد", editProduct: "تعديل المنتج", newCat: "فئة جديدة", editCat: "تعديل الفئة", newProject: "مشروع جديد", editProject: "تعديل المشروع", newNews: "إعلان جديد", editNews: "تعديل الإعلان",
  need: "املأ الاسم (بالعربية أو الإنجليزية) على الأقل", badPrice: "السعر يجب أن يكون رقماً بين 0 و 100000", badUrl: "الرابط غير صالح (يجب أن يبدأ بـ https://)", badCat: "اختر فئة",
  saved: "تم الحفظ", deleted: "تم الحذف", confirmDel: "حذف هذا العنصر نهائياً؟", catInUse: "لا يمكن حذف فئة فيها منتجات ({n}). انقل المنتجات أولاً.",
  noItems: "لا توجد عناصر. أضف أول عنصر.", filter: "تصفية", search: "بحث في المنتجات",
  secTitle: "أقسام الصفحة الرئيسية", secSub: "أخفِ أو أظهر الأقسام. تظهر النتيجة في الصفحة الرئيسية فوراً.",
  "sec.stats": "شريط الأرقام التوضيحية", "sec.explore": "بطاقات الاستكشاف", "sec.featured": "المنتجات المميزة", "sec.projects": "المشاريع", "sec.tools": "الأدوات والتطبيقات", "sec.services": "الخدمات", "sec.news": "الأخبار", "sec.community": "دعوة المجتمع",
  socTitle: "الروابط الاجتماعية", socSub: "ضع روابطك العامة. هذه روابط فقط، وليست ربطاً بأي واجهة برمجية.", "soc.youtube": "رابط YouTube (فيديو أو قناة)", "soc.instagram": "رابط Instagram", "soc.discord": "رابط دعوة Discord (يتجاوز config.js)", "soc.website": "موقعك (اختياري)", "soc.email": "بريد التواصل (اختياري)",
  socNote: "روابط الفيديو (watch أو youtu.be أو shorts) تُعرض كمشغّل مضمّن. غير ذلك يظهر كزر رابط.",
  thTitle: "الثيم والألوان", thSub: "يتغير الموقع كله فوراً (معاينة حية) ويُحفظ في هذا المتصفح.",
  setupTitle: "الإعداد والتكاملات", setupSub: "لا شيء هنا مطلوب لتجربة الموقع. اربط الخدمات الحقيقية لاحقاً وببطء.",
  where: "أين تُحفظ بياناتك؟", wData: "المنتجات، الفئات، المشاريع، الإعلانات، الروابط", wDataH: "في هذا المتصفح فقط (localStorage)", wDataN: "لتظهر على كل الأجهزة وللزوار يلزم قاعدة بيانات (المرحلة ٢).",
  wTheme: "الثيم واللغة", wThemeH: "في هذا المتصفح فقط", wThemeN: "كل زائر يختار ثيمه. ثيم افتراضي موحّد يلزمه حفظ على الخادم.",
  wCart: "السلة والدفع المحاكى", wCartH: "السلة في هذا المتصفح. لا توجد طلبات حقيقية", wCartN: "الدفع الحقيقي غير موجود في هذه النسخة.",
  wAuth: "حسابات الأعضاء وصفحة #/admin", wAuthH: "Supabase (حقيقي ومحمي بسياسات RLS)", wAuthN: "يعمل فقط إذا كان config.js مضبوطاً وschema.sql مشغّلاً في Supabase.",
  col1: "ماذا", col2: "أين", col3: "ملاحظة",
  integ: "التكاملات", on: "مضبوط", off: "غير مضبوط", demo: "تجريبي",
  iSup: "Supabase (تسجيل الدخول وقائمة الأعضاء)", iSupOn: "يوجد Project URL ومفتاح publishable في config.js. يُستخدم للدخول والأعضاء فقط، ولا يخزن المنتجات بعد.", iSupOff: "غير مضبوط في config.js. الموقع التجريبي يعمل بدونه.",
  iSupHow: "لتخزين المحتوى على Supabase لاحقاً: تتم مراجعة schema.sql أولاً، ثم إضافة جداول المنتجات بسياسات RLS للمدراء فقط، ثم تشغيلها يدوياً من SQL Editor. لا نشغّل شيئاً تلقائياً.",
  iDisc: "Discord", iDiscOn: "يوجد رابط دعوة (من هذه اللوحة أو config.js).", iDiscOff: "لا يوجد رابط دعوة.", iDiscHow: "ضع الرابط من تبويب الروابط أو في config.js.",
  iYt: "YouTube", iIg: "Instagram", iLinksHow: "رابط فقط من تبويب الروابط.",
  iPay: "الدفع", iPayOff: "غير متاح في هذه النسخة.", iPayHow: "الدفع الحقيقي يتم عبر مزود دفع موثوق وصفحة دفع مستضافة وخادم يتحقق من العمليات. لا تضع مفاتيح سرية في ملفات الموقع أبداً.",
  iKeys: "مفاتيح API والأسرار", iKeysHow: "لا تُدخل أي مفتاح سري هنا ولا في الملفات العامة. المفاتيح السرية مكانها خادم أو إعدادات مزود الخدمة فقط. هذه اللوحة تحفظ روابط عامة فقط.",
  backup: "نسخ احتياطي واستعادة", backupSub: "لنقل بياناتك إلى جهاز آخر قبل وجود قاعدة بيانات.", export: "تنزيل نسخة (JSON)", import: "استيراد نسخة", importOk: "تم الاستيراد", importBad: "ملف غير صالح",
  reset: "استعادة البيانات التجريبية الأصلية", resetSub: "يمسح تعديلاتك في هذا المتصفح ويعيد المحتوى الأصلي.", resetConfirm: "استعادة البيانات الأصلية؟ ستفقد كل تعديلاتك في هذا المتصفح.", resetDone: "تمت الاستعادة",
  actTitle: "سجل النشاط (محلي)", actSub: "آخر 100 إجراء في هذا المتصفح فقط. ليس سجلاً أمنياً.", actClear: "مسح السجل", actNone: "لا يوجد نشاط بعد.",
  l_add: "إضافة", l_edit: "تعديل", l_del: "حذف", l_pub: "نشر", l_hide: "إخفاء",
  uploading: "جارٍ معالجة الصورة...", imgBad: "تعذّر قراءة الصورة", imgBig: "الصورة كبيرة جداً (الحد 8 م.ب)",
  "tab.experience": "الكون والعروض", "sec.welcome": "شاشة الترحيب",
  bannerLive: "وضع مباشر: أنت مسجّل كمدير. تغييرات المنتجات تُحفظ في قاعدة بيانات Supabase وتظهر لكل الزوار، والصلاحية يتحقق منها الخادم (RLS). بقية الأقسام ما زالت محلية في هذا المتصفح.",
  remoteOk: "حُفظ في قاعدة البيانات", remoteFail: "تعذّر الحفظ في قاعدة البيانات (حُفظ محلياً فقط). تأكد من تشغيل schema_products.sql", remoteDel: "حُذف من قاعدة البيانات",
  expTitle: "الكون والعروض", expSub: "تحكم بعوالم بوابة الصفحة الرئيسية وبشريط العرض. التغييرات محلية في هذا المتصفح.",
  promoTitle: "شريط العرض", promoOn: "إظهار الشريط أعلى الموقع", promoAr: "النص بالعربية", promoEn: "النص بالإنجليزية", promoLink: "رابط (اختياري: https أو #/store مثلاً)", badLink: "الرابط غير صالح",
  worldsTitle: "عوالم الكون المتعدد", worldsSub: "أظهر أو أخفِ كل عالم، وغيّر وسم حالته.",
  "w.store": "المتجر", "w.projects": "الاستوديو", "w.tools": "المختبر", "w.services": "المصنع", "w.community": "الساحة", "w.about": "الأصل", "w.unk": "؟؟؟",
  "ws.open": "مفتوح", "ws.demo": "عرض تجريبي", "ws.exp": "تجريبي", "ws.dev": "قيد التطوير", "ws.unk": "غير مكتشف"
},
en: {
  title: "Demo dashboard", sub: "Add and edit content from your phone without touching code.",
  banner: "Demo mode: no login and no server. Every change is saved in this browser only and is not visible to other visitors or your other devices. A database is required for permanent saving (see Setup & Integrations).",
  "tab.overview": "Overview", "tab.products": "Products", "tab.categories": "Categories", "tab.projects": "Projects", "tab.news": "Announcements", "tab.sections": "Site sections",
  "tab.social": "Social links", "tab.theme": "Theme & colors", "tab.setup": "Setup & Integrations", "tab.activity": "Activity",
  kp: "published", kh: "hidden or draft", kc: "categories", kpr: "projects", kn: "announcements", kcart: "items in your cart", byCat: "Products by category",
  quick: "Quick actions", addProduct: "New product", viewSite: "View site", storage: "Saved data size", kb: "KB",
  add: "Add", edit: "Edit", del: "Delete", save: "Save", cancel: "Cancel", close: "Close", publish: "Publish", hide: "Hide", feature: "Feature", unfeature: "Unfeature",
  "st.published": "Published", "st.hidden": "Hidden", "st.draft": "Draft", "st.all": "All",
  "f.nameAr": "Name (Arabic)", "f.nameEn": "Name (English)", "f.descAr": "Description (Arabic)", "f.descEn": "Description (English)", "f.price": "Displayed price (demo)", "f.old": "Price before discount (optional)",
  "f.cat": "Category", "f.tags": "Tags (comma separated)", "f.badgeAr": "Promo label (Arabic)", "f.badgeEn": "Promo label (English)", "f.avail": "Availability", "f.status": "Visibility",
  "f.featured": "Featured product", "f.artStyle": "Generated image style", "f.hue": "Image color", "f.image": "Custom image (https link)", "f.upload": "Upload a photo from phone", "f.removeImg": "Remove custom image",
  "f.gallery": "Extra images (one link per line)", "f.preview": "Live preview", "f.imgNote": "Uploaded images are shrunk and stored in the browser. Big images use up storage space.",
  "f.title": "Title", "f.titleAr": "Title (Arabic)", "f.titleEn": "Title (English)", "f.bodyAr": "Text (Arabic)", "f.bodyEn": "Text (English)", "f.link": "Link (optional, https)",
  "f.date": "Date", "f.pinned": "Pin to top", "f.icon": "Icon", "f.hue2": "Color",
  "av.available": "Available", "av.limited": "Limited", "av.soon": "Coming soon",
  newProduct: "New product", editProduct: "Edit product", newCat: "New category", editCat: "Edit category", newProject: "New project", editProject: "Edit project", newNews: "New announcement", editNews: "Edit announcement",
  need: "Fill in the name (Arabic or English) at least", badPrice: "Price must be a number between 0 and 100000", badUrl: "Invalid link (must start with https://)", badCat: "Choose a category",
  saved: "Saved", deleted: "Deleted", confirmDel: "Delete this item permanently?", catInUse: "Cannot delete a category that has products ({n}). Move the products first.",
  noItems: "Nothing here yet. Add the first item.", filter: "Filter", search: "Search products",
  secTitle: "Home page sections", secSub: "Show or hide sections. The home page updates immediately.",
  "sec.stats": "Illustrative numbers strip", "sec.explore": "Explore cards", "sec.featured": "Featured products", "sec.projects": "Projects", "sec.tools": "Tools & apps", "sec.services": "Services", "sec.news": "News", "sec.community": "Community invite",
  socTitle: "Social links", socSub: "Add your public links. These are links only, not API connections.", "soc.youtube": "YouTube link (video or channel)", "soc.instagram": "Instagram link", "soc.discord": "Discord invite link (overrides config.js)", "soc.website": "Your website (optional)", "soc.email": "Contact email (optional)",
  socNote: "Video links (watch, youtu.be or shorts) show as an embedded player. Anything else shows as a link button.",
  thTitle: "Theme & colors", thSub: "The whole site changes instantly (live preview) and is saved in this browser.",
  setupTitle: "Setup & Integrations", setupSub: "Nothing here is required to try the site. Connect real services later, step by step.",
  where: "Where is your data saved?", wData: "Products, categories, projects, announcements, links", wDataH: "This browser only (localStorage)", wDataN: "A database is needed for it to show on all devices and to visitors (Stage 2).",
  wTheme: "Theme and language", wThemeH: "This browser only", wThemeN: "Each visitor picks their own theme. A shared default theme needs server-side saving.",
  wCart: "Cart and simulated checkout", wCartH: "Cart in this browser. No real orders", wCartN: "Real payments do not exist in this version.",
  wAuth: "Member accounts and #/admin", wAuthH: "Supabase (real, protected by RLS policies)", wAuthN: "Works only if config.js is set and schema.sql was run in Supabase.",
  col1: "What", col2: "Where", col3: "Note",
  integ: "Integrations", on: "Configured", off: "Not configured", demo: "Demo",
  iSup: "Supabase (login and members list)", iSupOn: "A Project URL and publishable key exist in config.js. Used for login and members only; it does not store products yet.", iSupOff: "Not set in config.js. The demo site works without it.",
  iSupHow: "To store content on Supabase later: review schema.sql first, add product tables with admin-only RLS policies, then run them manually in the SQL Editor. Nothing runs automatically.",
  iDisc: "Discord", iDiscOn: "An invite link exists (from this dashboard or config.js).", iDiscOff: "No invite link.", iDiscHow: "Add it in the Social links tab or in config.js.",
  iYt: "YouTube", iIg: "Instagram", iLinksHow: "Link only, from the Social links tab.",
  iPay: "Payments", iPayOff: "Not available in this version.", iPayHow: "Real payments go through a trusted payment provider with a hosted checkout and a server that verifies transactions. Never put secret keys in site files.",
  iKeys: "API keys and secrets", iKeysHow: "Do not enter any secret key here or in public files. Secret keys belong on a server or in the provider's settings only. This dashboard saves public links only.",
  backup: "Backup & restore", backupSub: "To move your data to another device before a database exists.", export: "Download backup (JSON)", import: "Import backup", importOk: "Imported", importBad: "Invalid file",
  reset: "Restore original demo data", resetSub: "Clears your edits in this browser and restores the original content.", resetConfirm: "Restore the original data? You will lose all your edits in this browser.", resetDone: "Restored",
  actTitle: "Activity log (local)", actSub: "Last 100 actions in this browser only. Not a security log.", actClear: "Clear log", actNone: "No activity yet.",
  l_add: "Added", l_edit: "Edited", l_del: "Deleted", l_pub: "Published", l_hide: "Hidden",
  uploading: "Processing image...", imgBad: "Could not read the image", imgBig: "Image too large (8 MB max)",
  "tab.experience": "Universe & promo", "sec.welcome": "Welcome screen",
  bannerLive: "Live mode: you are signed in as an admin. Product changes are saved to the Supabase database and show for every visitor; the server enforces permission (RLS). Other sections are still local to this browser.",
  remoteOk: "Saved to the database", remoteFail: "Could not save to the database (saved locally only). Make sure schema_products.sql was run", remoteDel: "Deleted from the database",
  expTitle: "Universe & promo", expSub: "Control the home-page portal worlds and the promo bar. Changes are local to this browser.",
  promoTitle: "Promo bar", promoOn: "Show the bar at the top of the site", promoAr: "Text (Arabic)", promoEn: "Text (English)", promoLink: "Link (optional: https or e.g. #/store)", badLink: "Invalid link",
  worldsTitle: "Multiverse worlds", worldsSub: "Show or hide each world and change its status label.",
  "w.store": "The Store", "w.projects": "The Studio", "w.tools": "The Lab", "w.services": "The Forge", "w.community": "The Commons", "w.about": "The Origin", "w.unk": "???",
  "ws.open": "Open", "ws.demo": "Demo", "ws.exp": "Experimental", "ws.dev": "In development", "ws.unk": "Undiscovered"
}};
const d = k => (DT[A.lang] && DT[A.lang][k]) ?? DT.ar[k] ?? k;
const TABS = ["overview", "products", "categories", "projects", "news", "sections", "experience", "social", "theme", "setup", "activity"];
const TAB_ICONS = { overview: "dash", products: "box", categories: "layers", projects: "folder", news: "news", sections: "grid", experience: "globe", social: "link", theme: "palette", setup: "shield", activity: "log" };
let tab = "overview", pFilter = "all", pQuery = "";
const data = () => A.data;
const nm = o => loc(o) || "—";
const slug = s => String(s || "item").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 24) || "item";
const uid = (p, s) => p + "-" + slug(s) + "-" + Math.random().toString(36).slice(2, 6);
const str = (v, n) => String(v == null ? "" : v).trim().slice(0, n);
const ok = () => toast(d("saved"));
const persist = msg => { A.saveData(); if (msg) A.log(msg); A.rerender(); };

/* ---------- sheet (modal bottom sheet) ---------- */
let openSheet = null;
function sheet(title, body, acts) {
  closeSheet();
  const back = h("div", { class: "sheet-back", onclick: e => { if (e.target === back) closeSheet(); } },
    h("div", { class: "sheet", role: "dialog", "aria-modal": "true", "aria-label": title },
      h("div", { class: "hd" }, h("h2", null, title), h("button", { class: "ibtn", type: "button", "aria-label": d("close"), onclick: closeSheet }, icon("x"))), body, acts));
  document.body.append(back); document.body.style.overflow = "hidden"; openSheet = back;
  const f = back.querySelector("input[type=text],textarea"); if (f) setTimeout(() => f.focus({ preventScroll: true }), 50);
  return back;
}
function closeSheet() { if (openSheet) { openSheet.remove(); openSheet = null; document.body.style.overflow = ""; } }
document.addEventListener("keydown", e => { if (e.key === "Escape") closeSheet(); });
addEventListener("hashchange", closeSheet);

const field = (label, input) => h("label", { class: "field" }, h("span", null, label), input);
const txt = (obj, key, max, multi) => { const el = h(multi ? "textarea" : "input", multi ? { maxlength: max } : { type: "text", maxlength: max, value: obj[key] || "" }); if (multi) el.value = obj[key] || ""; el.addEventListener("input", () => { obj[key] = el.value; obj.__touch && obj.__touch(); }); return el; };
const sel = (opts, cur, on) => h("select", { onchange: e => on(e.target.value) }, opts.map(([v, l]) => h("option", { value: v, selected: cur === v }, l)));
const check = (label, cur, on) => h("label", { class: "checkline" }, h("input", { type: "checkbox", checked: !!cur, onchange: e => on(e.target.checked) }), h("span", null, label));
const err = h("div"); // replaced per sheet
function errBox() { return h("div", { class: "demo-banner", style: { display: "none", borderColor: "#fb7185", color: "#fecdd3", background: "rgba(244,63,94,.08)" }, role: "alert" }); }
function showErr(box, m) { clear(box).append(icon("alert"), h("div", null, m)); box.style.display = "flex"; box.scrollIntoView({ block: "nearest" }); }
const acts = (onSave, extra) => h("div", { class: "foot-acts" }, h("button", { class: "btn ghost", type: "button", onclick: closeSheet }, d("cancel")), extra || null, h("button", { class: "btn", type: "button", onclick: onSave }, icon("check"), d("save")));

/* ---------- cleaners ---------- */
const bi = (o, n) => ({ ar: str(o && o.ar, n), en: str(o && o.en, n) });
function cleanProduct(p, cats) {
  const price = Math.round(Number(p.price) * 100) / 100, old = p.oldPrice === "" || p.oldPrice == null ? 0 : Math.round(Number(p.oldPrice) * 100) / 100;
  return {
    id: str(p.id, 60) || uid("p", p.name && p.name.en), status: ["published", "hidden", "draft"].includes(p.status) ? p.status : "draft", featured: !!p.featured,
    cat: cats.some(c => c.id === p.cat) ? p.cat : (cats[0] ? cats[0].id : ""), price: isFinite(price) ? clamp(price, 0, 100000) : 0, oldPrice: isFinite(old) ? clamp(old, 0, 100000) : 0,
    avail: ["available", "limited", "soon"].includes(p.avail) ? p.avail : "available", name: bi(p.name, 80), desc: bi(p.desc, 600),
    tags: (Array.isArray(p.tags) ? p.tags : []).map(x => str(x, 24)).filter(Boolean).slice(0, 8), badge: bi(p.badge, 24),
    art: { style: STYLES.includes(p.art && p.art.style) ? p.art.style : "mesh", hue: clamp(Number(p.art && p.art.hue) || 220, 0, 360) },
    image: safeImg(p.image), gallery: (Array.isArray(p.gallery) ? p.gallery : []).map(safeImg).filter(Boolean).slice(0, 3)
  };
}
function cleanSimple(x, kind, cats) {
  if (kind === "project") return { id: str(x.id, 60) || uid("pr", x.title && x.title.en), status: ["published", "hidden", "draft"].includes(x.status) ? x.status : "draft", hue: clamp(Number(x.hue) || 220, 0, 360), link: safeUrl(x.link), tags: (Array.isArray(x.tags) ? x.tags : []).map(v => str(v, 24)).filter(Boolean).slice(0, 6), title: bi(x.title, 80), desc: bi(x.desc, 400) };
  if (kind === "news") return { id: str(x.id, 60) || uid("a", x.title && x.title.en), status: ["published", "hidden", "draft"].includes(x.status) ? x.status : "draft", pinned: !!x.pinned, date: /^\d{4}-\d{2}-\d{2}$/.test(x.date) ? x.date : new Date().toISOString().slice(0, 10), title: bi(x.title, 100), body: bi(x.body, 500) };
  return x;
}

/* ---------- product editor ---------- */
function productSheet(orig) {
  const isNew = !orig, cats = data().categories;
  const f = orig ? JSON.parse(JSON.stringify(orig)) : { id: "", status: "published", featured: false, cat: cats[0] ? cats[0].id : "", price: 10, oldPrice: 0, avail: "available", name: { ar: "", en: "" }, desc: { ar: "", en: "" }, tags: [], badge: { ar: "", en: "" }, art: { style: "mesh", hue: Math.floor(Math.random() * 360) }, image: "", gallery: [] };
  f.tags = f.tags || []; f.gallery = f.gallery || []; f.art = f.art || { style: "mesh", hue: 220 };
  const box = errBox(), prevBox = h("div", { class: "prevwrap", style: { pointerEvents: "none" } });
  const draw = () => clear(prevBox).append(A.productCard(cleanProduct(Object.assign({}, f, { status: "published", id: "preview" }), cats.length ? cats : [{ id: f.cat }])));
  let drawT; const later = () => { clearTimeout(drawT); drawT = setTimeout(draw, 120); };
  const bind = (obj, key, max, multi) => { const el = txt(obj, key, max, multi); el.addEventListener("input", later); return el; };
  const imgIn = h("input", { type: "url", dir: "ltr", placeholder: "https://...", value: f.image && f.image.startsWith("http") ? f.image : "", oninput: e => { f.image = e.target.value.trim(); later(); } });
  const fileIn = h("input", { type: "file", accept: "image/*", style: { display: "none" }, onchange: async e => {
    const file = e.target.files && e.target.files[0]; if (!file) return;
    if (file.size > 8 * 1024 * 1024) return showErr(box, d("imgBig"));
    toast(d("uploading"));
    try { f.image = await shrink(file); imgIn.value = ""; box.style.display = "none"; toast(d("saved") + " · " + Math.round(f.image.length / 1024) + " KB"); draw(); } catch (x) { showErr(box, d("imgBad")); }
    fileIn.value = "";
  } });
  const hue = h("input", { type: "range", min: 0, max: 360, value: f.art.hue, oninput: e => { f.art.hue = Number(e.target.value); later(); } });
  const galleryTa = h("textarea", { dir: "ltr", placeholder: "https://...", oninput: e => { f.gallery = e.target.value.split("\n").map(s => s.trim()).filter(Boolean).slice(0, 3); later(); } }); galleryTa.value = f.gallery.filter(x => x.startsWith("http")).join("\n");
  const tagsIn = h("input", { type: "text", maxlength: 120, value: f.tags.join(", "), oninput: e => { f.tags = e.target.value.split(/[,،]/).map(s => s.trim()).filter(Boolean).slice(0, 8); later(); } });
  const priceIn = h("input", { type: "number", inputmode: "decimal", step: "0.01", min: 0, value: f.price, oninput: e => { f.price = e.target.value; later(); } });
  const oldIn = h("input", { type: "number", inputmode: "decimal", step: "0.01", min: 0, value: f.oldPrice || "", oninput: e => { f.oldPrice = e.target.value; later(); } });
  const body = h("div", null,
    h("div", { class: "note2" }, d("f.preview")), prevBox, box,
    h("div", { class: "row2" }, field(d("f.nameAr"), bind(f.name, "ar", 80)), field(d("f.nameEn"), bind(f.name, "en", 80))),
    h("div", { class: "row2" }, field(d("f.descAr"), bind(f.desc, "ar", 600, true)), field(d("f.descEn"), bind(f.desc, "en", 600, true))),
    h("div", { class: "row2" }, field(d("f.price"), priceIn), field(d("f.old"), oldIn)),
    h("div", { class: "row2" }, field(d("f.cat"), sel(cats.map(c => [c.id, nm(c.name)]), f.cat, v => { f.cat = v; later(); })), field(d("f.tags"), tagsIn)),
    h("div", { class: "row2" }, field(d("f.badgeAr"), bind(f.badge, "ar", 24)), field(d("f.badgeEn"), bind(f.badge, "en", 24))),
    h("div", { class: "row2" }, field(d("f.avail"), sel([["available", d("av.available")], ["limited", d("av.limited")], ["soon", d("av.soon")]], f.avail, v => { f.avail = v; later(); })),
      field(d("f.status"), sel([["published", d("st.published")], ["hidden", d("st.hidden")], ["draft", d("st.draft")]], f.status, v => f.status = v))),
    check(d("f.featured"), f.featured, v => f.featured = v),
    h("div", { class: "row2" }, field(d("f.artStyle"), sel(STYLES.map(s => [s, s]), f.art.style, v => { f.art.style = v; later(); })), field(d("f.hue"), hue)),
    field(d("f.image"), imgIn),
    h("div", { class: "toprow" }, h("button", { class: "btn ghost sm", type: "button", onclick: () => fileIn.click() }, icon("upload"), d("f.upload")), fileIn,
      h("button", { class: "btn ghost sm", type: "button", onclick: () => { f.image = ""; imgIn.value = ""; draw(); } }, icon("trash"), d("f.removeImg"))),
    h("small", { style: { color: "var(--muted)" } }, d("f.imgNote")),
    field(d("f.gallery"), galleryTa));
  draw();
  sheet(isNew ? d("newProduct") : d("editProduct"), body, acts(() => {
    if (!str(f.name.ar, 80) && !str(f.name.en, 80)) return showErr(box, d("need"));
    const pr = Number(f.price); if (!isFinite(pr) || pr < 0 || pr > 100000 || f.price === "") return showErr(box, d("badPrice"));
    if (f.oldPrice !== "" && f.oldPrice != null && (!isFinite(Number(f.oldPrice)) || Number(f.oldPrice) < 0)) return showErr(box, d("badPrice"));
    if (!cats.some(c => c.id === f.cat)) return showErr(box, d("badCat"));
    if (f.image && !safeImg(f.image)) return showErr(box, d("badUrl"));
    if (f.gallery.some(u => !safeImg(u))) return showErr(box, d("badUrl"));
    const c = cleanProduct(f, cats), list = data().products;
    if (isNew) { c.id = uid("p", c.name.en || c.name.ar); list.push(c); } else { const i = list.findIndex(x => x.id === orig.id); if (i >= 0) { c.id = orig.id; list[i] = c; } }
    closeSheet(); persist(d(isNew ? "l_add" : "l_edit") + ": " + nm(c.name)); ok(); syncRemote(c);
  }));
}
function shrink(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onerror = () => rej(new Error("read"));
    r.onload = () => { const im = new Image(); im.onerror = () => rej(new Error("img"));
      im.onload = () => { const k = Math.min(1, 900 / Math.max(im.width, im.height)), cv = document.createElement("canvas"); cv.width = Math.round(im.width * k); cv.height = Math.round(im.height * k);
        const cx = cv.getContext("2d"); cx.fillStyle = "#050818"; cx.fillRect(0, 0, cv.width, cv.height); cx.drawImage(im, 0, 0, cv.width, cv.height);
        let out = cv.toDataURL("image/jpeg", .78); if (out.length > 420000) out = cv.toDataURL("image/jpeg", .55); res(out); };
      im.src = r.result; };
    r.readAsDataURL(file);
  });
}

/* ---------- simple editors ---------- */
const dsel = (label, key, f, opts) => field(label, sel(opts, f[key], v => f[key] = v));
const statusOpts = () => [["published", d("st.published")], ["hidden", d("st.hidden")], ["draft", d("st.draft")]];
const ICONS = ["tool", "app", "layers", "spark", "compass", "bag", "palette", "code", "film", "image", "type", "grid", "wave", "bolt", "box"];

function categorySheet(orig) {
  const f = orig ? JSON.parse(JSON.stringify(orig)) : { id: "", icon: "box", name: { ar: "", en: "" } }, box = errBox();
  sheet(orig ? d("editCat") : d("newCat"), h("div", null, box, h("div", { class: "row2" }, field(d("f.nameAr"), txt(f.name, "ar", 40)), field(d("f.nameEn"), txt(f.name, "en", 40))), dsel(d("f.icon"), "icon", f, ICONS.map(i => [i, i]))),
    acts(() => {
      if (!str(f.name.ar, 40) && !str(f.name.en, 40)) return showErr(box, d("need"));
      const c = { id: orig ? orig.id : uid("c", f.name.en || f.name.ar), icon: ICONS.includes(f.icon) ? f.icon : "box", name: bi(f.name, 40) }, l = data().categories;
      if (orig) l[l.findIndex(x => x.id === orig.id)] = c; else l.push(c);
      closeSheet(); persist(d(orig ? "l_edit" : "l_add") + ": " + nm(c.name)); ok();
    }));
}
function projectSheet(orig) {
  const f = orig ? JSON.parse(JSON.stringify(orig)) : { id: "", status: "published", hue: Math.floor(Math.random() * 360), link: "", tags: [], title: { ar: "", en: "" }, desc: { ar: "", en: "" } }, box = errBox();
  const tagsIn = h("input", { type: "text", value: (f.tags || []).join(", "), oninput: e => f.tags = e.target.value.split(/[,،]/).map(s => s.trim()).filter(Boolean) });
  sheet(orig ? d("editProject") : d("newProject"), h("div", null, box,
    h("div", { class: "row2" }, field(d("f.titleAr"), txt(f.title, "ar", 80)), field(d("f.titleEn"), txt(f.title, "en", 80))),
    h("div", { class: "row2" }, field(d("f.descAr"), txt(f.desc, "ar", 400, true)), field(d("f.descEn"), txt(f.desc, "en", 400, true))),
    field(d("f.tags"), tagsIn), field(d("f.link"), h("input", { type: "url", dir: "ltr", placeholder: "https://...", value: f.link || "", oninput: e => f.link = e.target.value.trim() })),
    h("div", { class: "row2" }, field(d("f.hue2"), h("input", { type: "range", min: 0, max: 360, value: f.hue, oninput: e => f.hue = Number(e.target.value) })), dsel(d("f.status"), "status", f, statusOpts()))),
    acts(() => {
      if (!str(f.title.ar, 80) && !str(f.title.en, 80)) return showErr(box, d("need"));
      if (f.link && !safeUrl(f.link)) return showErr(box, d("badUrl"));
      const c = cleanSimple(f, "project"), l = data().projects; if (orig) { c.id = orig.id; l[l.findIndex(x => x.id === orig.id)] = c; } else l.push(c);
      closeSheet(); persist(d(orig ? "l_edit" : "l_add") + ": " + nm(c.title)); ok();
    }));
}
function newsSheet(orig) {
  const f = orig ? JSON.parse(JSON.stringify(orig)) : { id: "", status: "published", pinned: false, date: new Date().toISOString().slice(0, 10), title: { ar: "", en: "" }, body: { ar: "", en: "" } }, box = errBox();
  sheet(orig ? d("editNews") : d("newNews"), h("div", null, box,
    h("div", { class: "row2" }, field(d("f.titleAr"), txt(f.title, "ar", 100)), field(d("f.titleEn"), txt(f.title, "en", 100))),
    h("div", { class: "row2" }, field(d("f.bodyAr"), txt(f.body, "ar", 500, true)), field(d("f.bodyEn"), txt(f.body, "en", 500, true))),
    h("div", { class: "row2" }, field(d("f.date"), h("input", { type: "date", dir: "ltr", value: f.date, oninput: e => f.date = e.target.value })), dsel(d("f.status"), "status", f, statusOpts())),
    check(d("f.pinned"), f.pinned, v => f.pinned = v)),
    acts(() => {
      if (!str(f.title.ar, 100) && !str(f.title.en, 100)) return showErr(box, d("need"));
      const c = cleanSimple(f, "news"), l = data().announcements; if (orig) { c.id = orig.id; l[l.findIndex(x => x.id === orig.id)] = c; } else l.unshift(c);
      closeSheet(); persist(d(orig ? "l_edit" : "l_add") + ": " + nm(c.title)); ok();
    }));
}
function remove(list, item, label) {
  if (!confirm(d("confirmDel"))) return false;
  const i = list.findIndex(x => x.id === item.id); if (i < 0) return false; list.splice(i, 1);
  persist(d("l_del") + ": " + label); toast(d("deleted")); return true;
}

/* ---------- tabs ---------- */
async function syncRemote(p) {
  const r = await A.remoteSave(p); if (!r || r.skipped) return;
  toast(r.error ? d("remoteFail") + " (" + str(r.error.message, 80) + ")" : d("remoteOk"));
}
async function syncRemoteDel(id) {
  const r = await A.remoteDelete(id); if (!r || r.skipped) return;
  toast(r.error ? d("remoteFail") + " (" + str(r.error.message, 80) + ")" : d("remoteDel"));
}
const pill = s => h("span", { class: "pill " + s }, d("st." + s));
function row(img, title, meta, actions) {
  return h("div", { class: "drow" + (img ? "" : " noimg") }, img ? h("img", { src: img, alt: "", width: 64, height: 48 }) : null, h("div", { class: "meta" }, h("b", null, title), h("small", null, meta)), h("div", { class: "acts" }, actions));
}
const btn = (ic, label, fn, cls) => h("button", { class: "btn sm " + (cls || "ghost"), type: "button", "aria-label": label, onclick: fn }, icon(ic), label);

function tabOverview(root) {
  const D = data(), pubN = D.products.filter(p => p.status === "published").length, otherN = D.products.length - pubN;
  const kp = [[pubN, "kp"], [otherN, "kh"], [D.categories.length, "kc"], [D.projects.length, "kpr"], [D.announcements.length, "kn"], [A.cartInfo().count, "kcart"]];
  const max = Math.max(1, ...D.categories.map(c => D.products.filter(p => p.cat === c.id).length));
  const size = Math.round(JSON.stringify(D).length / 1024);
  root.append(h("div", { class: "kpis" }, kp.slice(0, 4).map(([v, k]) => h("div", { class: "glass kpi" }, h("b", null, String(v)), h("span", null, d(k))))),
    h("div", { class: "kpis", style: { gridTemplateColumns: "1fr 1fr" } }, kp.slice(4).map(([v, k]) => h("div", { class: "glass kpi" }, h("b", null, String(v)), h("span", null, d(k))))),
    h("div", { class: "glass dpanel" }, h("h2", null, d("byCat")), h("div", { class: "bars", style: { marginTop: "12px" } }, D.categories.map(c => { const n = D.products.filter(p => p.cat === c.id).length;
      return h("div", { class: "b" }, h("span", null, nm(c.name)), h("div", { class: "track" }, h("div", { class: "fill", style: { width: Math.round(n / max * 100) + "%" } })), h("b", null, String(n))); }))),
    h("div", { class: "glass dpanel" }, h("h2", null, d("quick")), h("div", { class: "toprow", style: { marginTop: "12px" } },
      btn("plus", d("addProduct"), () => { tab = "products"; render(); productSheet(null); }, ""), btn("palette", d("tab.theme"), () => { tab = "theme"; render(); }),
      h("a", { class: "btn ghost sm", href: "#/" }, icon("eye"), d("viewSite")), h("a", { class: "btn ghost sm", href: "#/store" }, icon("bag"), A.t("nav.store"))),
      h("small", { style: { color: "var(--muted)" } }, d("storage") + ": " + size + " " + d("kb"))));
}
function tabProducts(root) {
  const D = data();
  const q = pQuery.trim().toLowerCase();
  const list = D.products.filter(p => (pFilter === "all" || p.status === pFilter) && (!q || (nm(p.name) + " " + p.name.ar + " " + p.name.en).toLowerCase().includes(q)));
  const rows = h("div");
  const draw = () => {
    clear(rows);
    const qq = pQuery.trim().toLowerCase(), l = D.products.filter(p => (pFilter === "all" || p.status === pFilter) && (!qq || (p.name.ar + " " + p.name.en).toLowerCase().includes(qq)));
    if (!l.length) rows.append(h("div", { class: "empty" }, icon("box"), h("p", null, d("noItems"))));
    l.forEach(p => rows.append(row(A.productImg(p), nm(p.name), [h("span", null, pill(p.status)), p.featured ? "★ " : "", nm((D.categories.find(c => c.id === p.cat) || {}).name) + " · " + (A.cents(p.price) ? money(A.cents(p.price)) : A.t("free")) + " · " + d("av." + p.avail)],
      [btn("edit", d("edit"), () => productSheet(p)),
       btn(p.status === "published" ? "eyeoff" : "eye", p.status === "published" ? d("hide") : d("publish"), () => { p.status = p.status === "published" ? "hidden" : "published"; persist(d(p.status === "published" ? "l_pub" : "l_hide") + ": " + nm(p.name)); ok(); syncRemote(p); }),
       btn("spark", p.featured ? d("unfeature") : d("feature"), () => { p.featured = !p.featured; persist(d("l_edit") + ": " + nm(p.name)); ok(); syncRemote(p); }),
       btn("trash", d("del"), () => { if (remove(D.products, p, nm(p.name))) syncRemoteDel(p.id); }, "danger")])));
  };
  const search = h("input", { type: "search", placeholder: d("search"), value: pQuery, oninput: e => { pQuery = e.target.value; draw(); } });
  root.append(h("div", { class: "toprow" }, btn("plus", d("addProduct"), () => productSheet(null), ""),
    sel([["all", d("st.all")], ["published", d("st.published")], ["hidden", d("st.hidden")], ["draft", d("st.draft")]], pFilter, v => { pFilter = v; draw(); })), field("", search), rows);
  draw();
}
function tabCats(root) {
  const D = data();
  root.append(h("div", { class: "toprow" }, btn("plus", d("newCat"), () => categorySheet(null), "")),
    ...D.categories.map(c => { const n = D.products.filter(p => p.cat === c.id).length;
      return row(null, nm(c.name), (c.name.ar || "") + " / " + (c.name.en || "") + " · " + n, [btn("edit", d("edit"), () => categorySheet(c)),
        btn("trash", d("del"), () => { if (n) return toast(d("catInUse").replace("{n}", n)); remove(D.categories, c, nm(c.name)); }, "danger")]); }));
}
function tabSimple(root, kind) {
  const D = data(), list = kind === "project" ? D.projects : D.announcements, ed = kind === "project" ? projectSheet : newsSheet;
  root.append(h("div", { class: "toprow" }, btn("plus", kind === "project" ? d("newProject") : d("newNews"), () => ed(null), "")));
  if (!list.length) root.append(h("div", { class: "empty" }, icon("folder"), h("p", null, d("noItems"))));
  list.forEach(x => root.append(row(kind === "project" ? art(STYLES[(x.id.length + (x.hue | 0)) % 5], x.hue, 0) : null, nm(kind === "project" ? x.title : x.title),
    [pill(x.status), kind === "news" ? (x.pinned ? "★ " : "") + (x.date || "") : (x.tags || []).join(", ")],
    [btn("edit", d("edit"), () => ed(x)), btn(x.status === "published" ? "eyeoff" : "eye", x.status === "published" ? d("hide") : d("publish"), () => { x.status = x.status === "published" ? "hidden" : "published"; persist(d("l_edit") + ": " + nm(x.title)); ok(); }),
      btn("trash", d("del"), () => remove(list, x, nm(x.title)), "danger")])));
}
function tabExperience(root) {
  const D = data(), W = D.worlds, P = D.promo, box = errBox();
  const f = { on: !!P.on, ar: (P.text && P.text.ar) || "", en: (P.text && P.text.en) || "", link: P.link || "" };
  const okLink = v => !v || /^#\/[a-z0-9\/_-]*$/i.test(v) || !!safeUrl(v);
  const onChk = check(d("promoOn"), f.on, v => f.on = v);
  const ar = h("input", { type: "text", maxlength: 120, value: f.ar, oninput: e => f.ar = e.target.value });
  const en = h("input", { type: "text", maxlength: 120, dir: "ltr", value: f.en, oninput: e => f.en = e.target.value });
  const lk = h("input", { type: "text", dir: "ltr", maxlength: 200, placeholder: "https://... / #/store", value: f.link, oninput: e => f.link = e.target.value.trim() });
  root.append(
    h("div", { class: "glass dpanel" }, h("h2", null, d("promoTitle")), box, onChk, field(d("promoAr"), ar), field(d("promoEn"), en), field(d("promoLink"), lk),
      btn("check", d("save"), () => {
        if (!okLink(f.link)) return showErr(box, d("badLink"));
        P.on = f.on; P.text = { ar: str(f.ar, 120), en: str(f.en, 120) }; P.link = f.link;
        A.saveData(); A.log(d("l_edit") + ": " + d("promoTitle")); box.style.display = "none"; ok();
      }, "")),
    h("div", { class: "glass dpanel" }, h("h2", null, d("worldsTitle")), h("p", { class: "sub" }, d("worldsSub")),
      Object.keys(W).map(id => h("div", { class: "switch-row" }, h("div", null, d("w." + id)),
        h("div", { class: "toprow", style: { margin: 0 } },
          sel(["open", "demo", "exp", "dev", "unk"].map(s => [s, d("ws." + s)]), W[id].status, v => { W[id].status = v; A.saveData(); A.log(d("l_edit") + ": " + d("w." + id)); }),
          h("button", { class: "tgl", type: "button", role: "switch", "aria-checked": String(W[id].show !== false), "aria-label": d("w." + id), onclick: e => { W[id].show = W[id].show === false; e.currentTarget.setAttribute("aria-checked", String(W[id].show)); A.saveData(); A.log(d("l_edit") + ": " + d("w." + id)); } })))),
      h("a", { class: "btn ghost sm", href: "#/", style: { marginTop: "14px" } }, icon("eye"), d("viewSite"))));
}
function tabSections(root) {
  const s = data().sections;
  root.append(h("div", { class: "glass dpanel" }, h("h2", null, d("secTitle")), h("p", { class: "sub" }, d("secSub")),
    Object.keys(s).map(k => h("div", { class: "switch-row" }, h("div", null, d("sec." + k)),
      h("button", { class: "tgl", type: "button", role: "switch", "aria-checked": String(!!s[k]), "aria-label": d("sec." + k), onclick: e => { s[k] = !s[k]; e.currentTarget.setAttribute("aria-checked", String(s[k])); A.saveData(); A.log(d("l_edit") + ": " + d("sec." + k)); } }))),
    h("a", { class: "btn ghost sm", href: "#/", style: { marginTop: "14px" } }, icon("eye"), d("viewSite"))));
}
function tabSocial(root) {
  const so = data().socials, box = errBox(), keys = ["youtube", "instagram", "discord", "website", "email"], f = Object.assign({}, so), ins = {};
  keys.forEach(k => ins[k] = h("input", { type: k === "email" ? "email" : "url", dir: "ltr", placeholder: k === "email" ? "name@example.com" : "https://...", value: f[k] || "", oninput: e => f[k] = e.target.value.trim() }));
  root.append(h("div", { class: "glass dpanel" }, h("h2", null, d("socTitle")), h("p", { class: "sub" }, d("socSub")), box, ...keys.map(k => field(d("soc." + k), ins[k])), h("div", { class: "note2" }, d("socNote")),
    btn("check", d("save"), () => {
      for (const k of keys) { if (!f[k]) continue; if (k === "email" ? !/^\S+@\S+\.\S+$/.test(f[k]) : !safeUrl(f[k])) return showErr(box, d("badUrl") + " — " + d("soc." + k)); }
      keys.forEach(k => so[k] = k === "email" ? str(f[k], 80) : safeUrl(f[k]));
      persist(d("l_edit") + ": " + d("tab.social")); ok();
    }, "")));
}
function tabTheme(root) {
  const box = h("div"); root.append(h("div", { class: "glass dpanel" }, h("h2", null, d("thTitle")), h("p", { class: "sub" }, d("thSub")), box)); A.renderThemeEditor(box);
}
function tabSetup(root) {
  const C = window.ALETHEA_CONFIG || {}, D = data();
  const has = v => typeof v === "string" && v && !/^PASTE/.test(v);
  const supOn = has(C.SUPABASE_URL) && has(C.SUPABASE_ANON_KEY);
  let host = ""; try { host = new URL(C.SUPABASE_URL).host; } catch (e) {}
  const integ = (title, on, text, how, extra) => h("div", { class: "integ" }, h("h3", null, title, h("span", { class: "state " + (on ? "on" : "off") }, on ? d("on") : d("off"))), h("p", { style: { margin: "4px 0", color: "var(--muted)" } }, text), how ? h("small", { style: { color: "var(--muted)" } }, how) : null, extra || null);
  const rowsT = [[d("wData"), d("wDataH"), d("wDataN")], [d("wTheme"), d("wThemeH"), d("wThemeN")], [d("wCart"), d("wCartH"), d("wCartN")], [d("wAuth"), d("wAuthH"), d("wAuthN")]];
  const fileIn = h("input", { type: "file", accept: "application/json,.json", style: { display: "none" }, onchange: async e => {
    const f = e.target.files && e.target.files[0]; if (!f) return;
    try { const j = JSON.parse(await f.text()); if (!j || !Array.isArray(j.products)) throw 0;
      const cats = (Array.isArray(j.categories) && j.categories.length ? j.categories : D.categories).map(c => ({ id: str(c.id, 40), icon: ICONS.includes(c.icon) ? c.icon : "box", name: bi(c.name, 40) })).filter(c => c.id);
      A.setData({ categories: cats, products: j.products.slice(0, 300).map(p => cleanProduct(p, cats)), projects: (j.projects || []).slice(0, 100).map(x => cleanSimple(x, "project")), announcements: (j.announcements || []).slice(0, 100).map(x => cleanSimple(x, "news")),
        tools: D.tools, services: D.services, sections: j.sections, worlds: j.worlds, promo: j.promo, socials: Object.fromEntries(Object.entries(j.socials || {}).map(([k, v]) => [k, k === "email" ? str(v, 80) : safeUrl(v)])) });
      A.log(d("importOk")); toast(d("importOk")); A.rerender();
    } catch (x) { toast(d("importBad")); }
    fileIn.value = "";
  } });
  root.append(
    h("div", { class: "glass dpanel" }, h("h2", null, d("setupTitle")), h("p", { class: "sub" }, d("setupSub")),
      h("h3", null, d("where")), h("div", { style: { overflowX: "auto" } }, h("table", { class: "cmp" }, h("thead", null, h("tr", null, [d("col1"), d("col2"), d("col3")].map(x => h("th", null, x)))), h("tbody", null, rowsT.map(r => h("tr", null, r.map(c => h("td", null, c)))))))),
    h("div", { class: "glass dpanel" }, h("h2", null, d("integ")),
      integ(d("iSup"), supOn, supOn ? d("iSupOn") + (host ? " (" + host + ")" : "") : d("iSupOff"), d("iSupHow")),
      integ(d("iDisc"), !!A.discordUrl(), A.discordUrl() ? d("iDiscOn") : d("iDiscOff"), d("iDiscHow")),
      integ(d("iYt"), !!A.youtubeUrl(), A.youtubeUrl() || d("off"), d("iLinksHow")),
      integ(d("iIg"), !!safeUrl(D.socials.instagram), safeUrl(D.socials.instagram) || d("off"), d("iLinksHow")),
      integ(d("iPay"), false, d("iPayOff"), d("iPayHow")),
      h("div", { class: "integ" }, h("h3", null, icon("shield"), d("iKeys")), h("p", { style: { margin: "4px 0", color: "var(--muted)" } }, d("iKeysHow")))),
    h("div", { class: "glass dpanel" }, h("h2", null, d("backup")), h("p", { class: "sub" }, d("backupSub")),
      h("div", { class: "toprow" }, btn("download", d("export"), () => {
        const blob = new Blob([JSON.stringify(Object.assign({ app: "alethea-demo", exported: new Date().toISOString() }, D), null, 2)], { type: "application/json" });
        const a = h("a", { href: URL.createObjectURL(blob), download: "alethea-demo-backup.json" }); document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
      }), btn("upload", d("import"), () => fileIn.click()), fileIn),
      h("h3", null, d("reset")), h("p", { class: "sub" }, d("resetSub")),
      btn("refresh", d("reset"), () => { if (!confirm(d("resetConfirm"))) return; A.resetData(); A.log(d("resetDone")); toast(d("resetDone")); A.rerender(); }, "danger")));
}
function tabActivity(root) {
  const L = A.logs;
  root.append(h("div", { class: "glass dpanel" }, h("h2", null, d("actTitle")), h("p", { class: "sub" }, d("actSub")),
    L.length ? L.map(x => h("div", { class: "logline" }, h("time", null, new Date(x.t).toLocaleString("en-GB")), h("span", null, x.m))) : h("p", { style: { color: "var(--muted)" } }, d("actNone")),
    L.length ? btn("trash", d("actClear"), () => { A.clearLogs(); A.rerender(); }) : null));
}

/* ---------- shell ---------- */
function render() {
  const root = clear($("#dashRoot")), body = h("div");
  root.append(h("div", { class: "pagehead" }, h("span", { class: "eyebrow" }, A.t("nav.dashboard") + (A.remoteCanWrite() ? " · LIVE" : " · DEMO")), h("h1", null, d("title")), h("p", null, d("sub"))),
    A.remoteCanWrite() ? h("div", { class: "demo-banner big live", role: "note" }, icon("shield"), h("div", null, d("bannerLive"))) : h("div", { class: "demo-banner big", role: "note" }, icon("alert"), h("div", null, d("banner"))),
    h("div", { class: "dtabs", role: "tablist" }, TABS.map(k => h("button", { class: "chip dtab" + (tab === k ? " on" : ""), type: "button", role: "tab", "aria-selected": String(tab === k), onclick: () => { tab = k; render(); } }, icon(TAB_ICONS[k]), d("tab." + k)))), body);
  ({ overview: tabOverview, products: tabProducts, categories: tabCats, projects: r => tabSimple(r, "project"), news: r => tabSimple(r, "news"), sections: tabSections, experience: tabExperience, social: tabSocial, theme: tabTheme, setup: tabSetup, activity: tabActivity })[tab](body);
}
window.ALETHEA_DASH = { render };
})();
