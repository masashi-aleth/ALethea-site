/* ALethea — public site: i18n, theme engine, demo store, cart, simulated checkout, 3D/particles.
   Demo mode: everything is stored in THIS browser only (localStorage). No backend, no payments. */
(() => {
"use strict";
const SEED = window.ALETHEA_SEED;
const C = window.ALETHEA_CONFIG || {};
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clone = o => JSON.parse(JSON.stringify(o));
const clamp = (n, a, b) => Math.min(b, Math.max(a, n));

/* ---------------- storage (always guarded) ---------------- */
const KEYS = { data: "alethea.data.v1", theme: "alethea.theme.v1", lang: "alethea.lang", cart: "alethea.cart.v1", log: "alethea.log.v1" };
const mem = {};
const st = {
  get(k) { try { return localStorage.getItem(k); } catch (e) { return k in mem ? mem[k] : null; } },
  set(k, v) { try { localStorage.setItem(k, v); return true; } catch (e) { mem[k] = v; return false; } },
  del(k) { try { localStorage.removeItem(k); } catch (e) { delete mem[k]; } }
};
const load = (k, d) => { try { const v = st.get(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } };
let storageOk = true;
const save = (k, v) => { const ok = st.set(k, JSON.stringify(v)); if (!ok && storageOk) { storageOk = false; toast(t("storage.fail")); } return ok; };

/* ---------------- i18n ---------------- */
const T = {
ar: {
  skip: "تخطَّ إلى المحتوى", "nav.home": "الرئيسية", "nav.explore": "استكشف", "nav.store": "المتجر التجريبي", "nav.projects": "المشاريع",
  "nav.tools": "أدوات وتطبيقات", "nav.services": "الخدمات", "nav.community": "المجتمع", "nav.about": "عن ALethea", "nav.dashboard": "لوحة التحكم",
  "dock.store": "المتجر", "dock.cart": "السلة", "dock.more": "المزيد",
  "hero.eyebrow": "كون رقمي تجريبي", "hero.headline": "مساحة تتسع للأدوات والمشاريع والمجتمع",
  "hero.sub": "متجر تجريبي، معرض أعمال، أدوات وخدمات، ومجتمع يكبر معك. كل ما تراه هنا نسخة عرض يمكن تجربتها وتعديلها.",
  "hero.cta1": "استكشف الكون", "hero.cta2": "افتح المتجر التجريبي", "hero.online": "متصل الآن على Discord", "hero.scroll": "مرّر للأسفل",
  "chip.store": "المتجر", "chip.projects": "المشاريع", "chip.community": "المجتمع",
  "disc.title": "Discord", "disc.sub": "قسم واحد من المجتمع، وليس كل ALethea.", "disc.join": "انضم إلى Discord",
  "disc.sample": "الوصف أدناه نموذجي ويمكن تعديله لاحقاً. رابط الدعوة وعدد المتصلين يأتيان من config.js فقط.",
  "foot.note": "نسخة تجريبية للعرض فقط. كل المنتجات والأسعار والمشاريع خيالية، ولا توجد مدفوعات حقيقية.",
  "foot.copy": "© ALethea — مشروع تجريبي، غير تابع لشركة Discord أو YouTube أو Instagram.",
  demo: "تجريبي", "storage.fail": "تعذّر الحفظ في متصفحك (التخزين ممتلئ أو ممنوع). التغييرات لن تبقى بعد إغلاق الصفحة.",
  free: "مجاني", "usd": "دولار (تجريبي)", "arrow": "←",
  "s.products": "منتجاً تجريبياً", "s.projects": "مشاريع معروضة", "s.presets": "ثيمات جاهزة", "s.langs": "لغتان",
  "s.note": "أرقام توضيحية محسوبة من البيانات التجريبية",
  "ex.eyebrow": "استكشف", "ex.title": "كل ما في الكون", "ex.sub": "اختر وجهتك. كل قسم يعمل بالبيانات التجريبية.", "ex.open": "افتح",
  "ex.store": "متجر تجريبي بسلة ودفع محاكى", "ex.projects": "أعمال وتجارب بصرية للعرض", "ex.tools": "أدوات وتطبيقات قيد التجربة", "ex.services": "خدمات إبداعية وتقنية",
  "ex.community": "Discord وYouTube وInstagram", "ex.about": "قصة ALethea والتواصل", "ex.categories": "تسوّق حسب الفئة",
  "home.featured": "منتجات مميزة", "home.featuredSub": "بطاقات تجريبية بتأثيرات ثلاثية الأبعاد. مرّر إصبعك أو الماوس فوقها.", "home.all": "عرض الكل",
  "home.projects": "من المشاريع", "home.tools": "أدوات وتطبيقات", "home.services": "الخدمات", "home.news": "آخر الأخبار", "home.community": "انضم إلى المجتمع",
  "home.communitySub": "Discord وYouTube وInstagram. الروابط هنا تجريبية حتى تضع روابطك من لوحة التحكم.",
  "store.title": "المتجر التجريبي", "store.sub": "تصفّح وجرّب السلة والدفع المحاكى.",
  "store.banner": "نسخة عرض: المنتجات والأسعار خيالية. السلة والدفع محاكاة فقط، ولا يتم أي تحصيل مالي.",
  "store.search": "ابحث عن منتج أو وسم...", "store.cat": "الفئة", "store.all": "الكل", "store.availAll": "كل الحالات", "store.sort": "الترتيب",
  "sort.featured": "المميز أولاً", "sort.newest": "الأحدث", "sort.priceAsc": "السعر: الأقل", "sort.priceDesc": "السعر: الأعلى", "sort.name": "الاسم",
  "store.tags": "الوسوم", "store.results": "{n} منتج", "store.featured": "مميز", "store.allProducts": "كل المنتجات", "store.clear": "مسح الفلاتر",
  "store.emptyT": "لا توجد نتائج", "store.emptyP": "جرّب كلمات أخرى أو امسح الفلاتر.",
  "store.noneT": "المتجر فارغ حالياً", "store.noneP": "لا توجد منتجات منشورة. أضف منتجاً من لوحة التحكم.",
  "avail.available": "متوفر", "avail.limited": "كمية محدودة", "avail.soon": "قريباً",
  add: "أضف إلى السلة", added: "أُضيف إلى السلة (تجريبي)", unavailable: "غير متاح بعد",
  "p.home": "الرئيسية", "p.store": "المتجر", "p.qty": "الكمية", "p.demo": "منتج تجريبي خيالي. لا يوجد ملف أو خدمة فعلية، والسعر للعرض فقط.", "p.related": "منتجات مشابهة", "p.cart": "اذهب إلى السلة",
  "p.notFoundT": "المنتج غير موجود", "p.notFoundP": "قد يكون مخفياً أو محذوفاً.", "p.back": "العودة للمتجر", "p.gallery": "معرض الصور",
  "cart.title": "سلة التسوق (تجريبية)", "cart.emptyT": "السلة فارغة", "cart.emptyP": "أضف بعض المنتجات التجريبية لتجربة الحساب والدفع المحاكى.",
  "cart.remove": "إزالة", "cart.clear": "إفراغ السلة", "cart.continue": "متابعة التسوق", "cart.summary": "ملخص الطلب", "cart.items": "عدد القطع",
  "cart.subtotal": "المجموع الفرعي", "cart.fee": "رسوم (تجريبية)", "cart.total": "الإجمالي", "cart.checkout": "إلى الدفع المحاكى",
  "cart.note": "الأسعار تجريبية. لن يُحصَّل أي مبلغ.", "cart.each": "للوحدة", "cart.dec": "تقليل", "cart.inc": "زيادة",
  "co.title": "دفع محاكى", "co.banner": "هذا دفع محاكى للتجربة فقط. لا نطلب أي بيانات دفع، ولا يتم تحصيل أي مبلغ، ولن يصلك شيء.",
  "co.confirm": "أفهم أن هذا محاكاة وأنه لا توجد عملية دفع ولا طلب حقيقي.", "co.place": "إتمام الطلب التجريبي", "co.back": "العودة للسلة",
  "co.doneT": "تم الطلب التجريبي", "co.stamp": "محاكاة · DEMO", "co.ref": "رقم المحاكاة", "co.time": "الوقت",
  "co.notReal": "هذا ليس طلباً حقيقياً: لم يُدفع أي مبلغ ولم يُرسل أي منتج.", "co.again": "عودة للمتجر",
  "pr.title": "المشاريع ومعرض الأعمال", "pr.sub": "أعمال خيالية تُظهر شكل المعرض. عدّلها من لوحة التحكم.", "pr.all": "الكل",
  "pr.nolink": "عرض تجريبي · بلا رابط", "pr.open": "افتح المشروع",
  "tl.title": "الأدوات والتطبيقات", "tl.sub": "أفكار ونماذج أولية قد تكبر لاحقاً. لا توجد تطبيقات فعلية للتنزيل حالياً.", "tl.note": "مفهوم تجريبي",
  "sv.title": "الخدمات", "sv.sub": "ما يمكن أن تقدمه ALethea مستقبلاً. العروض أدناه للعرض فقط.", "sv.quote": "اطلب عرضاً (تجريبي)",
  "cm.title": "المجتمع", "cm.sub": "Discord جزء واحد فقط. هنا أيضاً YouTube وInstagram وروابطك الخاصة.", "cm.open": "افتح", "cm.noLink": "رابط تجريبي: أضفه من لوحة التحكم ← الروابط",
  "yt.title": "YouTube", "yt.sub": "ضع رابط فيديو أو قناتك من لوحة التحكم ليظهر هنا.", "yt.ph": "مكان تجريبي للفيديو", "yt.phSub": "لا يوجد رابط حقيقي بعد.", "yt.channel": "افتح على YouTube",
  "ig.title": "Instagram", "ig.sub": "رابط الملف الشخصي فقط. لا نعرض خلاصة مزيفة.", "ig.open": "افتح الملف على Instagram", "ig.ph": "رابط تجريبي: أضف حسابك من لوحة التحكم.",
  "ab.title": "عن ALethea", "ab.sub": "علامة مرنة وكون رقمي قابل للنمو في أكثر من اتجاه.",
  "ab.story": "ALethea ليست سيرفر Discord فقط. هي مساحة لتجارب رقمية متعددة: أدوات، تصميم، متجر، مشاريع ومجتمع. هذه النسخة التجريبية تعرض الشكل والتجربة قبل ربط أي خدمة حقيقية.",
  "ab.v1": "مرونة", "ab.v1p": "تبدأ بفئة وتتسع إلى فئات أخرى دون إعادة بناء.", "ab.v2": "وضوح", "ab.v2p": "كل شيء تجريبي موسوم بوضوح. لا ادعاءات ولا أرقام مزيفة.", "ab.v3": "سلاسة", "ab.v3p": "حركات خفيفة تعمل بسلاسة على هاتفك.",
  "ab.road": "خريطة طريق (خطة، وليست تاريخاً)", "ab.r1": "المرحلة ١ · نسخة عرض", "ab.r1p": "ما تراه الآن: بيانات تجريبية في متصفحك.",
  "ab.r2": "المرحلة ٢ · قاعدة بيانات", "ab.r2p": "حفظ المحتوى على Supabase ليظهر على كل الأجهزة.", "ab.r3": "المرحلة ٣ · حسابات الإدارة", "ab.r3p": "دخول آمن للمدراء وصلاحيات على الخادم.",
  "ab.r4": "المرحلة ٤ · دفع حقيقي (اختياري)", "ab.r4p": "ربط بوابة دفع موثوقة بعد الاختبار.",
  "ct.title": "تواصل معنا", "ct.demo": "نموذج تجريبي: الرسالة لا تُرسل إلى أي جهة ولا تُحفظ.", "ct.name": "الاسم", "ct.email": "البريد الإلكتروني", "ct.msg": "رسالتك",
  "ct.send": "إرسال (تجريبي)", "ct.sent": "تمت المحاكاة: لم تُرسل رسالتك إلى أي مكان. اربط خدمة بريد حقيقية لاحقاً.", "ct.mail": "بريد التواصل", "ct.mailDemo": "بريد تجريبي، غير حقيقي",
  "theme.title": "ألوان الموقع", "theme.sub": "تتغير فوراً وتُحفظ في متصفحك.", "theme.presets": "ثيمات جاهزة", "theme.colors": "الألوان", "theme.c1": "أزرق", "theme.c2": "أخضر", "theme.c3": "بنفسجي",
  "theme.order": "ترتيب التدرج", "theme.angle": "زاوية التدرج", "theme.bgi": "شدة الخلفية", "theme.glow": "قوة التوهج", "theme.motion": "شدة الحركة", "theme.reset": "استعادة الثيم الافتراضي", "theme.custom": "مخصص",
  "theme.reduced": "جهازك يطلب تقليل الحركة، لذلك الحركة متوقفة.", "theme.close": "إغلاق", "theme.preview": "معاينة",
  "tp.ocean": "أوشن", "tp.aurora": "أورورا", "tp.emerald": "إميرالد", "tp.violet": "فيوليت",
  "ord.bgp": "أزرق ← أخضر ← بنفسجي", "ord.pbg": "بنفسجي ← أزرق ← أخضر", "ord.gpb": "أخضر ← بنفسجي ← أزرق",
  "toast.theme": "تم حفظ الثيم", "empty.go": "افتح المتجر"
},
en: {
  skip: "Skip to content", "nav.home": "Home", "nav.explore": "Explore", "nav.store": "Demo Store", "nav.projects": "Projects",
  "nav.tools": "Tools & Apps", "nav.services": "Services", "nav.community": "Community", "nav.about": "About ALethea", "nav.dashboard": "Dashboard",
  "dock.store": "Store", "dock.cart": "Cart", "dock.more": "More",
  "hero.eyebrow": "Experimental digital universe", "hero.headline": "A space for tools, projects and community",
  "hero.sub": "A demo store, a portfolio, tools and services, and a community that grows with you. Everything here is a preview you can try and edit.",
  "hero.cta1": "Explore the universe", "hero.cta2": "Open the demo store", "hero.online": "online now on Discord", "hero.scroll": "Scroll down",
  "chip.store": "Store", "chip.projects": "Projects", "chip.community": "Community",
  "disc.title": "Discord", "disc.sub": "One part of the community, not all of ALethea.", "disc.join": "Join Discord",
  "disc.sample": "The description below is a sample and can be edited later. The invite link and online count come from config.js only.",
  "foot.note": "Demo preview only. All products, prices and projects are fictional and no real payments exist.",
  "foot.copy": "© ALethea — an experimental project, not affiliated with Discord, YouTube or Instagram.",
  demo: "Demo", "storage.fail": "Could not save in your browser (storage full or blocked). Changes will not survive closing the page.",
  free: "Free", "usd": "USD (demo)", "arrow": "→",
  "s.products": "demo products", "s.projects": "showcase projects", "s.presets": "theme presets", "s.langs": "languages",
  "s.note": "Illustrative numbers computed from the demo data",
  "ex.eyebrow": "Explore", "ex.title": "Everything in the universe", "ex.sub": "Pick a destination. Every section runs on demo data.", "ex.open": "Open",
  "ex.store": "A demo store with a cart and simulated checkout", "ex.projects": "Showcase works and visual experiments", "ex.tools": "Tools and apps in the lab", "ex.services": "Creative and technical services",
  "ex.community": "Discord, YouTube and Instagram", "ex.about": "ALethea's story and contact", "ex.categories": "Shop by category",
  "home.featured": "Featured products", "home.featuredSub": "Demo cards with 3D effects. Hover or touch them.", "home.all": "View all",
  "home.projects": "From the projects", "home.tools": "Tools & apps", "home.services": "Services", "home.news": "Latest news", "home.community": "Join the community",
  "home.communitySub": "Discord, YouTube and Instagram. Links here are placeholders until you add yours in the dashboard.",
  "store.title": "Demo Store", "store.sub": "Browse and try the cart and simulated checkout.",
  "store.banner": "Preview mode: products and prices are fictional. Cart and checkout are simulations only and nothing is ever charged.",
  "store.search": "Search a product or tag...", "store.cat": "Category", "store.all": "All", "store.availAll": "Any availability", "store.sort": "Sort",
  "sort.featured": "Featured first", "sort.newest": "Newest", "sort.priceAsc": "Price: low to high", "sort.priceDesc": "Price: high to low", "sort.name": "Name",
  "store.tags": "Tags", "store.results": "{n} products", "store.featured": "Featured", "store.allProducts": "All products", "store.clear": "Clear filters",
  "store.emptyT": "No results", "store.emptyP": "Try other words or clear the filters.",
  "store.noneT": "The store is empty", "store.noneP": "No published products. Add one from the dashboard.",
  "avail.available": "Available", "avail.limited": "Limited", "avail.soon": "Coming soon",
  add: "Add to cart", added: "Added to cart (demo)", unavailable: "Not available yet",
  "p.home": "Home", "p.store": "Store", "p.qty": "Quantity", "p.demo": "A fictional demo product. No real file or service exists and the price is for display only.", "p.related": "Related products", "p.cart": "Go to cart",
  "p.notFoundT": "Product not found", "p.notFoundP": "It may be hidden or deleted.", "p.back": "Back to store", "p.gallery": "Gallery",
  "cart.title": "Shopping cart (demo)", "cart.emptyT": "Your cart is empty", "cart.emptyP": "Add some demo products to try totals and the simulated checkout.",
  "cart.remove": "Remove", "cart.clear": "Empty cart", "cart.continue": "Continue shopping", "cart.summary": "Order summary", "cart.items": "Items",
  "cart.subtotal": "Subtotal", "cart.fee": "Fees (demo)", "cart.total": "Total", "cart.checkout": "Go to simulated checkout",
  "cart.note": "Prices are demo values. Nothing will be charged.", "cart.each": "each", "cart.dec": "Decrease", "cart.inc": "Increase",
  "co.title": "Simulated checkout", "co.banner": "This is a simulated checkout for testing only. We ask for no payment details, nothing is charged, and nothing will be delivered.",
  "co.confirm": "I understand this is a simulation: no payment and no real order.", "co.place": "Place demo order", "co.back": "Back to cart",
  "co.doneT": "Demo order placed", "co.stamp": "SIMULATION · DEMO", "co.ref": "Simulation ID", "co.time": "Time",
  "co.notReal": "This is not a real order: no money was paid and nothing was sent.", "co.again": "Back to store",
  "pr.title": "Projects & portfolio", "pr.sub": "Fictional works showing how the portfolio looks. Edit them from the dashboard.", "pr.all": "All",
  "pr.nolink": "Demo showcase · no link", "pr.open": "Open project",
  "tl.title": "Digital tools & apps", "tl.sub": "Ideas and prototypes that may grow later. There are no real apps to download yet.", "tl.note": "Demo concept",
  "sv.title": "Services", "sv.sub": "What ALethea could offer in the future. The offers below are for display only.", "sv.quote": "Request a quote (demo)",
  "cm.title": "Community", "cm.sub": "Discord is only one part. Here are also YouTube, Instagram and your own links.", "cm.open": "Open", "cm.noLink": "Placeholder link: add it in Dashboard → Social",
  "yt.title": "YouTube", "yt.sub": "Add a video or channel link in the dashboard and it appears here.", "yt.ph": "Demo video placeholder", "yt.phSub": "No real link yet.", "yt.channel": "Open on YouTube",
  "ig.title": "Instagram", "ig.sub": "Profile link only. We never show a fake feed.", "ig.open": "Open profile on Instagram", "ig.ph": "Placeholder: add your account in the dashboard.",
  "ab.title": "About ALethea", "ab.sub": "A flexible brand and a digital universe that can grow in many directions.",
  "ab.story": "ALethea is not only a Discord server. It is a space for many digital experiences: tools, design, a store, projects and community. This preview shows the look and feel before any real service is connected.",
  "ab.v1": "Flexible", "ab.v1p": "Start with one category and grow into others without a rebuild.", "ab.v2": "Honest", "ab.v2p": "Everything demo is labelled. No claims and no fake numbers.", "ab.v3": "Smooth", "ab.v3p": "Light motion that runs well on your phone.",
  "ab.road": "Roadmap (a plan, not history)", "ab.r1": "Stage 1 · Preview", "ab.r1p": "What you see now: demo data in your browser.",
  "ab.r2": "Stage 2 · Database", "ab.r2p": "Store content on Supabase so it shows on every device.", "ab.r3": "Stage 3 · Admin accounts", "ab.r3p": "Secure admin sign-in with server-side permissions.",
  "ab.r4": "Stage 4 · Real payments (optional)", "ab.r4p": "Connect a trusted payment gateway after testing.",
  "ct.title": "Contact", "ct.demo": "Demo form: your message is not sent anywhere and is not saved.", "ct.name": "Name", "ct.email": "Email", "ct.msg": "Your message",
  "ct.send": "Send (demo)", "ct.sent": "Simulated: your message was not sent anywhere. Connect a real mail service later.", "ct.mail": "Contact email", "ct.mailDemo": "Demo email, not real",
  "theme.title": "Site colors", "theme.sub": "Changes apply instantly and are saved in your browser.", "theme.presets": "Presets", "theme.colors": "Colors", "theme.c1": "Blue", "theme.c2": "Green", "theme.c3": "Violet",
  "theme.order": "Gradient order", "theme.angle": "Gradient angle", "theme.bgi": "Background intensity", "theme.glow": "Glow strength", "theme.motion": "Animation intensity", "theme.reset": "Restore default theme", "theme.custom": "Custom",
  "theme.reduced": "Your device asks for reduced motion, so motion is paused.", "theme.close": "Close", "theme.preview": "Preview",
  "tp.ocean": "Ocean", "tp.aurora": "Aurora", "tp.emerald": "Emerald", "tp.violet": "Violet",
  "ord.bgp": "Blue → Green → Violet", "ord.pbg": "Violet → Blue → Green", "ord.gpb": "Green → Violet → Blue",
  "toast.theme": "Theme saved", "empty.go": "Open the store"
}};
let lang = (() => { const v = st.get(KEYS.lang); return v === "en" || v === "ar" ? v : "ar"; })();
const t = (k, vars) => { let s = (T[lang] && T[lang][k]) ?? T.ar[k] ?? k; if (vars) for (const x in vars) s = s.replace("{" + x + "}", vars[x]); return s; };
const loc = o => (o && (o[lang] || o.en || o.ar)) || "";

/* ---------------- DOM helpers (no innerHTML with data) ---------------- */
function add(el, kid) {
  if (kid == null || kid === false) return;
  if (Array.isArray(kid)) kid.forEach(k => add(el, k));
  else if (kid instanceof Node) el.appendChild(kid);
  else el.appendChild(document.createTextNode(String(kid)));
}
const PROPS = ["value", "checked", "disabled", "selected"];
function h(tag, props, ...kids) {
  const el = document.createElement(tag);
  for (const k in props || {}) {
    const v = props[k];
    if (v == null || v === false) continue;
    if (k === "class") el.className = v;
    else if (k.startsWith("on") && typeof v === "function") el.addEventListener(k.slice(2), v);
    else if (k === "style" && typeof v === "object") Object.assign(el.style, v);
    else if (PROPS.includes(k)) el[k] = v;
    else el.setAttribute(k, v === true ? "" : v);
  }
  add(el, kids);
  return el;
}
function icon(name, cls) {
  const s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  s.setAttribute("class", "i" + (cls ? " " + cls : "")); s.setAttribute("aria-hidden", "true");
  const u = document.createElementNS("http://www.w3.org/2000/svg", "use");
  u.setAttribute("href", "#i-" + name); s.appendChild(u); return s;
}
const clear = el => { while (el.firstChild) el.removeChild(el.firstChild); return el; };
const go = path => { location.hash = "#/" + path; };

function safeUrl(u) { try { const x = new URL(String(u || "").trim()); return x.protocol === "https:" || x.protocol === "http:" ? x.href : ""; } catch (e) { return ""; } }
function safeImg(u) {
  u = String(u || "").trim();
  if (/^data:image\/(png|jpe?g|webp|gif);base64,[A-Za-z0-9+/=]+$/.test(u) && u.length < 1500000) return u;
  const x = safeUrl(u); return x.startsWith("https:") ? x : "";
}

let tt;
function toast(m) { const el = $("#toast"); if (!el) return; el.textContent = m; el.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => el.classList.remove("show"), 2800); }

/* ---------------- state ---------------- */
function migrate(d) {
  const base = clone(SEED);
  if (!d || typeof d !== "object") return base;
  const out = {};
  for (const k of ["categories", "products", "projects", "announcements", "tools", "services"]) out[k] = Array.isArray(d[k]) ? d[k] : base[k];
  out.sections = Object.assign({}, base.sections, d.sections || {});
  out.socials = Object.assign({}, base.socials, d.socials || {});
  out.version = base.version;
  return out;
}
let data = migrate(load(KEYS.data, null));
let cart = (() => { const c = load(KEYS.cart, []); return Array.isArray(c) ? c.filter(x => x && typeof x.id === "string" && x.qty > 0) : []; })();
let logs = (() => { const l = load(KEYS.log, []); return Array.isArray(l) ? l : []; })();
const saveData = () => save(KEYS.data, data);
function log(msg) { logs.unshift({ t: Date.now(), m: msg }); logs = logs.slice(0, 100); save(KEYS.log, logs); }

/* ---------------- art generator (placeholder images, no external files) ---------------- */
const hs = (h_, l, a = 1) => `hsl(${((h_ % 360) + 360) % 360} 92% ${l}% / ${a})`;
function art(style, hue, v = 0) {
  hue = Number(hue) || 220;
  const a = hue, b = hue + 55, c = hue + 115, o = v * 37;
  let body = "";
  if (style === "orbit") {
    body = `<circle cx="400" cy="300" r="70" fill="url(#g1)" filter="url(#bl)"/><circle cx="400" cy="300" r="46" fill="url(#g2)"/>` +
      [140, 215, 290].map((r, i) => `<ellipse cx="400" cy="300" rx="${r + 40}" ry="${r * .42}" fill="none" stroke="${hs(a + i * 40, 62)}" stroke-width="3" transform="rotate(${-24 + i * 28 + o / 6} 400 300)" opacity=".85"/>`).join("") +
      `<circle cx="${180 + o}" cy="${250 - o / 3}" r="12" fill="${hs(c, 70)}"/><circle cx="${610 - o}" cy="360" r="9" fill="${hs(b, 72)}"/><circle cx="520" cy="${140 + o / 2}" r="6" fill="#fff" opacity=".8"/>`;
  } else if (style === "prism") {
    body = `<polygon points="${120 + o},520 400,${70 + o / 4} 700,520" fill="url(#g1)" opacity=".9"/><polygon points="260,520 480,${150 + o / 5} 760,470" fill="url(#g2)" opacity=".75"/><polygon points="40,430 330,${190 - o / 6} 520,540" fill="${hs(c, 55, .55)}"/><polygon points="400,${70 + o / 4} 700,520 480,${150 + o / 5}" fill="#fff" opacity=".12"/>`;
  } else if (style === "waves") {
    const w = (y, amp, ph, col, op) => `<path d="M0 ${y} C 130 ${y - amp},270 ${y + amp},400 ${y} S 670 ${y - amp},800 ${y} V600 H0Z" transform="translate(${ph} 0)" fill="${col}" opacity="${op}"/>`;
    body = w(250 + o / 4, 70, -o, hs(a, 55, .55), 1) + w(330, 60, o, hs(b, 52, .7), 1) + w(410 - o / 5, 55, -o / 2, hs(c, 50, .85), 1) + w(490, 40, o / 2, hs(a + 20, 30), 1) +
      `<circle cx="${620 - o}" cy="120" r="46" fill="url(#g2)" filter="url(#bl)"/>`;
  } else if (style === "grid") {
    let g = ""; for (let i = 0; i <= 12; i++) { const x = 400 + (i - 6) * 150; g += `<line x1="400" y1="300" x2="${x}" y2="620" stroke="${hs(b, 65, .6)}" stroke-width="2"/>`; }
    for (let j = 1; j <= 7; j++) { const y = 300 + j * j * 6.6; g += `<line x1="0" y1="${y}" x2="800" y2="${y}" stroke="${hs(a, 62, .55)}" stroke-width="2"/>`; }
    body = `<circle cx="${400 + o / 2 - 20}" cy="205" r="95" fill="url(#g2)" filter="url(#bl)"/><circle cx="${400 + o / 2 - 20}" cy="205" r="70" fill="url(#g1)"/><rect y="300" width="800" height="300" fill="${hs(a, 10, .55)}"/>` + g;
  } else { // mesh
    body = `<circle cx="${180 + o}" cy="170" r="190" fill="${hs(a, 58, .9)}" filter="url(#bl)"/><circle cx="${600 - o}" cy="${220 + o / 3}" r="200" fill="${hs(b, 56, .85)}" filter="url(#bl)"/><circle cx="${400 + o / 2}" cy="480" r="210" fill="${hs(c, 56, .85)}" filter="url(#bl)"/>` +
      `<g stroke="#fff" stroke-opacity=".10">` + [0, 1, 2, 3, 4, 5, 6, 7].map(i => `<line x1="${i * 115}" y1="0" x2="${i * 115}" y2="600"/><line x1="0" y1="${i * 86}" x2="800" y2="${i * 86}"/>`).join("") + `</g>`;
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice"><defs>` +
    `<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${hs(a, 8)}"/><stop offset="1" stop-color="${hs(c, 16)}"/></linearGradient>` +
    `<linearGradient id="g1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${hs(a, 62)}"/><stop offset="1" stop-color="${hs(b, 58)}"/></linearGradient>` +
    `<linearGradient id="g2" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${hs(b, 72)}"/><stop offset="1" stop-color="${hs(c, 62)}"/></linearGradient>` +
    `<filter id="bl" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${style === "mesh" ? 46 : 14}"/></filter></defs>` +
    `<rect width="800" height="600" fill="url(#bg)"/>${body}</svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}
const STYLES = ["mesh", "orbit", "prism", "waves", "grid"];
function productImages(p) {
  const s = (p.art && p.art.style) || "mesh", hu = (p.art && p.art.hue) || 220;
  const own = safeImg(p.image), extra = (p.gallery || []).map(safeImg).filter(Boolean);
  const gen = [art(s, hu, 0), art(s, hu + 18, 1), art(STYLES[(STYLES.indexOf(s) + 1) % 5], hu + 40, 2)];
  const list = own ? [own, ...extra, gen[1]] : [gen[0], ...extra, gen[1], gen[2]];
  return list.slice(0, 5);
}
const productImg = p => productImages(p)[0];

/* ---------------- theme engine ---------------- */
const PRESETS = {
  ocean:   { c1: "#2f7bff", c2: "#19c9e6", c3: "#6c5cff", bg: "#040a1f", ang: 125, order: "bgp", bgi: 65, glow: 65, motion: 60 },
  aurora:  { c1: "#3b82f6", c2: "#10d9a0", c3: "#8b5cf6", bg: "#050818", ang: 110, order: "bgp", bgi: 60, glow: 60, motion: 60 },
  emerald: { c1: "#0ea5a8", c2: "#2de2a6", c3: "#4f7cff", bg: "#03140f", ang: 115, order: "gpb", bgi: 60, glow: 60, motion: 55 },
  violet:  { c1: "#5b6cff", c2: "#2fd8b4", c3: "#a24dff", bg: "#0a0620", ang: 130, order: "pbg", bgi: 65, glow: 70, motion: 60 }
};
const ORDERS = { bgp: ["c1", "c2", "c3"], pbg: ["c3", "c1", "c2"], gpb: ["c2", "c3", "c1"] };
let theme = (() => {
  const s = load(KEYS.theme, null); const d = Object.assign({ preset: "aurora" }, PRESETS.aurora);
  if (!s || typeof s !== "object") return d;
  const o = Object.assign(d, s);
  const hex = v => /^#[0-9a-f]{6}$/i.test(v);
  for (const k of ["c1", "c2", "c3", "bg"]) if (!hex(o[k])) o[k] = d[k];
  for (const k of ["bgi", "glow", "motion", "ang"]) o[k] = clamp(Number(o[k]) || 0, 0, k === "ang" ? 360 : 100);
  if (!ORDERS[o.order]) o.order = "bgp";
  return o;
})();
const reduceMq = window.matchMedia ? matchMedia("(prefers-reduced-motion: reduce)") : { matches: false };
const hex2rgb = x => [1, 3, 5].map(i => parseInt(x.slice(i, i + 2), 16));
const mixHex = (a, b, k) => { const A = hex2rgb(a), B = hex2rgb(b); return "#" + A.map((v, i) => Math.round(v + (B[i] - v) * k).toString(16).padStart(2, "0")).join(""); };
const motionOn = () => theme.motion > 0 && !reduceMq.matches;
function applyTheme() {
  const r = document.documentElement, s = r.style, cols = ORDERS[theme.order].map(k => theme[k]);
  s.setProperty("--c1", theme.c1); s.setProperty("--c2", theme.c2); s.setProperty("--c3", theme.c3);
  s.setProperty("--bg", theme.bg); s.setProperty("--bg2", mixHex(theme.bg, theme.c3, .2));
  s.setProperty("--ang", theme.ang + "deg");
  s.setProperty("--grad", `linear-gradient(${theme.ang}deg,${cols[0]},${cols[1]} 52%,${cols[2]})`);
  s.setProperty("--grad2", `linear-gradient(135deg,${theme.c3},${theme.c1} 55%,${theme.c2})`);
  s.setProperty("--bgi", (theme.bgi / 100).toFixed(2)); s.setProperty("--glow", (theme.glow / 100).toFixed(2));
  s.setProperty("--speed", (0.4 + theme.motion / 100 * 1.4).toFixed(2));
  r.dataset.motion = motionOn() ? "on" : "off";
  const m = $('meta[name="theme-color"]'); if (m) m.setAttribute("content", theme.bg);
  fxColors = [theme.c1, theme.c2, theme.c3].map(hex2rgb);
  if (motionOn()) startFx(); else stopFx();
}
const saveTheme = () => save(KEYS.theme, theme);
function setPreset(id) { theme = Object.assign({ preset: id }, PRESETS[id]); applyTheme(); saveTheme(); }
reduceMq.addEventListener && reduceMq.addEventListener("change", applyTheme);

function renderThemeEditor(box) {
  clear(box);
  const upd = (k, v, rerender) => { theme[k] = v; theme.preset = "custom"; applyTheme(); saveTheme(); if (rerender) renderThemeEditor(box); };
  const slider = (k, key, max = 100) => h("label", { class: "field" }, h("span", null, t(key) + " · ", h("b", { class: "val" }, String(theme[k]) + (k === "ang" ? "°" : "%"))),
    h("input", { type: "range", min: 0, max, value: theme[k], oninput: e => { const v = Number(e.target.value); theme[k] = v; theme.preset = "custom"; e.target.previousSibling.lastChild.textContent = v + (k === "ang" ? "°" : "%"); applyTheme(); saveTheme(); } }));
  const pre = h("div", { class: "presets" }, Object.keys(PRESETS).map(id => {
    const p = PRESETS[id], cols = ORDERS[p.order].map(k => p[k]);
    return h("button", { type: "button", class: "preset" + (theme.preset === id ? " on" : ""), onclick: () => { setPreset(id); renderThemeEditor(box); } },
      h("i", { style: { background: `linear-gradient(${p.ang}deg,${cols[0]},${cols[1]},${cols[2]})` } }), h("span", null, t("tp." + id)));
  }));
  const colorIn = (k, key) => h("label", { class: "field" }, h("span", null, t(key)), h("input", { type: "color", value: theme[k], oninput: e => { theme[k] = e.target.value; theme.preset = "custom"; applyTheme(); saveTheme(); }, onchange: () => renderThemeEditor(box) }));
  box.append(
    h("div", { class: "live-preview", "aria-label": t("theme.preview") }),
    h("h3", { style: { margin: "0 0 4px" } }, t("theme.presets") + (theme.preset === "custom" ? " · " + t("theme.custom") : "")), pre,
    h("h3", { style: { margin: "10px 0 0" } }, t("theme.colors")),
    h("div", { class: "colors3" }, colorIn("c1", "theme.c1"), colorIn("c2", "theme.c2"), colorIn("c3", "theme.c3")),
    h("label", { class: "field" }, h("span", null, t("theme.order")),
      h("select", { onchange: e => upd("order", e.target.value, true) }, Object.keys(ORDERS).map(o => h("option", { value: o, selected: theme.order === o }, t("ord." + o))))),
    slider("ang", "theme.angle", 360), slider("bgi", "theme.bgi"), slider("glow", "theme.glow"), slider("motion", "theme.motion"),
    reduceMq.matches ? h("div", { class: "note2" }, t("theme.reduced")) : null,
    h("button", { type: "button", class: "btn ghost sm", onclick: () => { setPreset("aurora"); renderThemeEditor(box); toast(t("toast.theme")); } }, icon("refresh"), t("theme.reset"))
  );
}
function openThemePanel(force) {
  const p = $("#themePanel"), open = force != null ? force : !p.classList.contains("open");
  p.classList.toggle("open", open); $("#themeBtn").setAttribute("aria-expanded", String(open));
  if (open) {
    clear(p);
    const body = h("div");
    p.append(h("div", { class: "hd" }, h("div", null, h("h3", null, t("theme.title")), h("small", { style: { color: "var(--muted)" } }, t("theme.sub"))),
      h("button", { class: "ibtn", type: "button", "aria-label": t("theme.close"), onclick: () => openThemePanel(false) }, icon("x"))), body);
    renderThemeEditor(body);
  }
}

/* ---------------- background particles (one light canvas) ---------------- */
let fxColors = [[59, 130, 246], [16, 217, 160], [139, 92, 246]], fxRaf = 0, fxP = [], fxCtx = null;
function startFx() {
  const cv = $("#fx"); if (!cv || fxRaf) return;
  fxCtx = cv.getContext("2d"); if (!fxCtx) return;
  const size = () => {
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    cv.width = innerWidth * dpr; cv.height = innerHeight * dpr; fxCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.round((12 + theme.motion * .42) * clamp(innerWidth / 900, .45, 1.2));
    fxP = Array.from({ length: n }, () => ({ x: Math.random() * innerWidth, y: Math.random() * innerHeight, r: .8 + Math.random() * 2.2, vx: (Math.random() - .5) * .22, vy: -.08 - Math.random() * .28, c: Math.floor(Math.random() * 3), a: .25 + Math.random() * .5 }));
  };
  size(); startFx.size = size;
  const tick = () => {
    if (!motionOn()) { stopFx(); return; }
    fxRaf = requestAnimationFrame(tick);
    if (document.hidden) return;
    const sp = .5 + theme.motion / 100;
    fxCtx.clearRect(0, 0, innerWidth, innerHeight);
    for (const p of fxP) {
      p.x += p.vx * sp; p.y += p.vy * sp;
      if (p.y < -6) { p.y = innerHeight + 6; p.x = Math.random() * innerWidth; }
      if (p.x < -6) p.x = innerWidth + 6; else if (p.x > innerWidth + 6) p.x = -6;
      const col = fxColors[p.c];
      fxCtx.beginPath(); fxCtx.fillStyle = `rgba(${col[0]},${col[1]},${col[2]},${p.a})`; fxCtx.arc(p.x, p.y, p.r, 0, 6.283); fxCtx.fill();
    }
  };
  fxRaf = requestAnimationFrame(tick);
}
function stopFx() { if (fxRaf) cancelAnimationFrame(fxRaf); fxRaf = 0; const cv = $("#fx"); if (cv && fxCtx) fxCtx.clearRect(0, 0, cv.width, cv.height); }
let rzT; addEventListener("resize", () => { clearTimeout(rzT); rzT = setTimeout(() => { if (fxRaf && startFx.size) startFx.size(); }, 200); });

/* ---------------- reveal, tilt, parallax, hero drag ---------------- */
let io = null;
function initReveal() {
  if (!("IntersectionObserver" in window)) return;
  io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px", threshold: .08 });
  document.documentElement.classList.add("anim");
}
function reveal(root) {
  const els = $$(".reveal:not(.in)", root || document);
  if (!io) { els.forEach(e => e.classList.add("in")); return; }
  els.forEach(e => io.observe(e));
  setTimeout(() => els.forEach(e => e.classList.add("in")), 2500); // safety net: never leave content hidden
}
let tiltRaf = 0;
document.addEventListener("pointermove", e => {
  const el = e.target.closest && e.target.closest(".tilt"); if (!el || !motionOn()) return;
  if (tiltRaf) return;
  tiltRaf = requestAnimationFrame(() => {
    tiltRaf = 0; const r = el.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height, k = 4 + theme.motion / 100 * 9;
    el.classList.add("hot"); el.style.setProperty("--ty", ((px - .5) * k).toFixed(2) + "deg"); el.style.setProperty("--tx", ((.5 - py) * k).toFixed(2) + "deg");
    el.style.setProperty("--mx", (px * 100).toFixed(1) + "%"); el.style.setProperty("--my", (py * 100).toFixed(1) + "%");
  });
});
document.addEventListener("pointerout", e => { const el = e.target.closest && e.target.closest(".tilt"); if (el && !el.contains(e.relatedTarget)) { el.classList.remove("hot"); el.style.setProperty("--tx", "0deg"); el.style.setProperty("--ty", "0deg"); } });
let pyRaf = 0;
addEventListener("scroll", () => { if (pyRaf || !motionOn() || scrollY > 1000) return; pyRaf = requestAnimationFrame(() => { pyRaf = 0; document.documentElement.style.setProperty("--py", String(Math.round(scrollY))); }); }, { passive: true });
function initHero() {
  const sc = $("#scene"), sg = $("#stage"); if (!sc || !sg) return;
  let rx = -14, ry = 24, d = null;
  const put = () => { sg.style.setProperty("--rx", rx + "deg"); sg.style.setProperty("--ry", ry + "deg"); };
  sc.addEventListener("pointerdown", e => { d = { x: e.clientX, y: e.clientY, rx, ry }; sg.classList.add("drag"); try { sc.setPointerCapture(e.pointerId); } catch (_) {} });
  sc.addEventListener("pointermove", e => {
    if (d) { ry = d.ry + (e.clientX - d.x) * .45; rx = clamp(d.rx - (e.clientY - d.y) * .3, -55, 35); put(); }
    else if (e.pointerType === "mouse" && motionOn()) { const r = sc.getBoundingClientRect(); ry = 24 + ((e.clientX - r.left) / r.width - .5) * 44; rx = -14 - ((e.clientY - r.top) / r.height - .5) * 30; put(); }
  });
  const end = () => { d = null; sg.classList.remove("drag"); };
  sc.addEventListener("pointerup", end); sc.addEventListener("pointercancel", end);
}

/* ---------------- formatting & commerce ---------------- */
const cents = n => Math.round((Number(n) || 0) * 100);
const money = c => "$" + (c / 100).toFixed(2);
const priceText = p => (cents(p.price) === 0 ? t("free") : money(cents(p.price)));
const published = () => data.products.filter(p => p.status === "published");
const catOf = id => data.categories.find(c => c.id === id);
const prodById = id => data.products.find(p => p.id === id);
function cartLines() {
  const lines = [];
  for (const l of cart) { const p = prodById(l.id); if (p && p.status === "published" && p.avail !== "soon") lines.push({ p, qty: clamp(l.qty, 1, 99) }); }
  return lines;
}
function totals() {
  const lines = cartLines(), sub = lines.reduce((s, l) => s + cents(l.p.price) * l.qty, 0), count = lines.reduce((s, l) => s + l.qty, 0);
  return { lines, sub, fee: 0, total: sub, count };
}
function pruneCart() { const ok = new Set(cartLines().map(l => l.p.id)); const n = cart.filter(l => ok.has(l.id)); if (n.length !== cart.length) { cart = n; save(KEYS.cart, cart); } }
function cartAdd(id, q = 1) {
  const p = prodById(id); if (!p || p.status !== "published" || p.avail === "soon") return toast(t("unavailable"));
  const l = cart.find(x => x.id === id); if (l) l.qty = clamp(l.qty + q, 1, 99); else cart.push({ id, qty: clamp(q, 1, 99) });
  save(KEYS.cart, cart); updateBadges(); toast(t("added") + " · " + loc(p.name));
}
function cartSet(id, q) { const l = cart.find(x => x.id === id); if (!l) return; if (q < 1) cart = cart.filter(x => x.id !== id); else l.qty = clamp(q, 1, 99); save(KEYS.cart, cart); updateBadges(); }
function updateBadges() {
  const n = totals().count;
  for (const b of [$("#cartBadge"), $("#dockBadge")]) if (b) { b.textContent = n ? String(n) : ""; b.dataset.n = String(n); }
}

/* ---------------- shared pieces ---------------- */
function pagehead(eyebrow, title, sub) { return h("div", { class: "pagehead reveal" }, h("span", { class: "eyebrow" }, eyebrow), h("h1", null, title), sub ? h("p", null, sub) : null); }
function sechead(eyebrow, title, sub, linkText, linkTo) {
  return h("div", { class: "sec-head" }, h("div", null, h("span", { class: "eyebrow" }, eyebrow), h("h2", null, title), sub ? h("p", null, sub) : null),
    linkText ? h("a", { class: "link", href: "#/" + linkTo }, linkText, icon("arrow", "arr")) : null);
}
function banner(text, big) { return h("div", { class: "demo-banner" + (big ? " big" : ""), role: "note" }, icon("alert"), h("div", null, text)); }
function empty(title, text, btnText, btnTo, ic) {
  return h("div", { class: "empty" }, icon(ic || "box"), h("h3", null, title), h("p", null, text), btnText ? h("a", { class: "btn", href: "#/" + btnTo }, btnText) : null);
}
function priceEl(p, big) {
  const free = cents(p.price) === 0;
  return h("span", { class: "price" + (free ? " free" : "") }, priceText(p), (!free && Number(p.oldPrice) > Number(p.price)) ? h("span", { class: "old" }, money(cents(p.oldPrice))) : null);
}
function productCard(p) {
  const cat = catOf(p.cat), badge = loc(p.badge), canBuy = p.avail !== "soon";
  const card = h("article", { class: "pcard tilt", onclick: e => { if (!e.target.closest("button,a")) go("product/" + p.id); } },
    h("div", { class: "pimg" }, h("img", { src: productImg(p), alt: "", loading: "lazy", width: 800, height: 600 }), badge ? h("span", { class: "pbadge" }, badge) : null,
      h("span", { class: "avail " + (p.avail === "available" ? "ok" : p.avail) }, t("avail." + p.avail))),
    h("div", { class: "pbody" }, h("span", { class: "pcat" }, cat ? loc(cat.name) : ""),
      h("h3", { class: "pname" }, h("a", { href: "#/product/" + p.id }, loc(p.name))),
      h("div", { class: "tagrow" }, (p.tags || []).slice(0, 2).map(x => h("span", { class: "tg" }, x))),
      h("div", { class: "pbottom" }, priceEl(p),
        h("button", { class: "addbtn", type: "button", disabled: !canBuy, "aria-label": t("add") + ": " + loc(p.name), onclick: e => { e.stopPropagation(); cartAdd(p.id); } }, icon(canBuy ? "plus" : "log")))));
  return card;
}
function gcard({ img, ic, title, text, tags, status, action }) {
  return h("article", { class: "glass gcard tilt" },
    img ? h("div", { class: "gart" }, h("img", { src: img, alt: "", loading: "lazy", width: 800, height: 450 })) : null,
    h("div", { class: "gbody" }, ic ? h("div", { class: "mini-ico" }, icon(ic)) : null, status ? h("span", { class: "status-pill" }, status) : null,
      h("h3", null, title), h("p", null, text), tags && tags.length ? h("div", { class: "tagrow" }, tags.map(x => h("span", { class: "tg" }, x))) : null, action || null));
}
const discordUrl = () => safeUrl(data.socials.discord) || (typeof C.DISCORD_INVITE_URL === "string" && !/^PASTE/.test(C.DISCORD_INVITE_URL) ? safeUrl(C.DISCORD_INVITE_URL) : "");
function linkBtn(url, label, ic, cls) {
  return url ? h("a", { class: "btn " + (cls || ""), href: url, target: "_blank", rel: "noopener noreferrer" }, ic ? icon(ic) : null, label)
    : h("span", { class: "btn ghost", style: { cursor: "default", opacity: ".7" }, "aria-disabled": "true" }, t("demo") + " · " + label);
}

/* ---------------- views ---------------- */
function renderHome() {
  const root = clear($("#homeSections")), s = data.sections, pub = published();
  if (s.stats) {
    const stats = [[pub.length, "s.products"], [data.projects.filter(x => x.status === "published").length, "s.projects"], [Object.keys(PRESETS).length, "s.presets"], [2, "s.langs"]];
    root.append(h("div", { class: "sec reveal" }, h("div", { class: "stats-strip" }, stats.map(([v, k]) => h("div", { class: "glass sstat tilt" }, h("b", null, String(v)), h("span", null, t(k))))),
      h("p", { style: { color: "var(--muted)", fontSize: ".8rem", margin: "10px 0 0" } }, h("span", { class: "demo-tag" }, "DEMO"), " " + t("s.note"))));
  }
  if (s.explore) root.append(h("div", { class: "sec reveal" }, sechead(t("ex.eyebrow"), t("ex.title"), t("ex.sub"), t("home.all"), "explore"), exploreTiles(6)));
  if (s.featured) {
    const f = pub.filter(p => p.featured).slice(0, 4);
    if (f.length) root.append(h("div", { class: "sec reveal" }, sechead(t("store.featured"), t("home.featured"), t("home.featuredSub"), t("home.all"), "store"), h("div", { class: "pgrid" }, f.map(productCard))));
  }
  if (s.projects) {
    const pr = data.projects.filter(x => x.status === "published").slice(0, 3);
    if (pr.length) root.append(h("div", { class: "sec reveal" }, sechead(t("nav.projects"), t("home.projects"), null, t("home.all"), "projects"), h("div", { class: "gcards" }, pr.map(projectCard))));
  }
  if (s.tools && data.tools.length) root.append(h("div", { class: "sec reveal" }, sechead(t("nav.tools"), t("home.tools"), null, t("home.all"), "tools"), h("div", { class: "gcards" }, data.tools.slice(0, 3).map(toolCard))));
  if (s.services && data.services.length) root.append(h("div", { class: "sec reveal" }, sechead(t("nav.services"), t("home.services"), null, t("home.all"), "services"), h("div", { class: "gcards" }, data.services.slice(0, 3).map(serviceCard))));
  if (s.news) {
    const n = newsList().slice(0, 3);
    if (n.length) root.append(h("div", { class: "sec reveal" }, sechead(t("nav.community"), t("home.news")), newsEl(n)));
  }
  if (s.community) root.append(h("div", { class: "sec reveal" }, h("div", { class: "glass", style: { padding: "28px", textAlign: "center" } },
    h("h2", { style: { margin: "0 0 6px" } }, t("home.community")), h("p", { style: { color: "var(--muted)", margin: "0 auto 18px", maxWidth: "560px" } }, t("home.communitySub")),
    h("div", { class: "cta" }, linkBtn(discordUrl(), "Discord", "chat", "discord"), linkBtn(youtubeUrl(), "YouTube", "youtube"), linkBtn(safeUrl(data.socials.instagram), "Instagram", "camera", "ghost")))));
  reveal(root);
}
const newsList = () => data.announcements.filter(a => a.status === "published").sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || String(b.date).localeCompare(String(a.date)));
const newsEl = list => h("div", { class: "news" }, list.map(a => h("article", { class: "glass item" }, h("time", { class: "date" }, a.date || ""),
  h("div", null, h("h3", null, a.pinned ? h("span", { class: "pin" }, "★ ") : null, loc(a.title)), h("p", null, loc(a.body))))));
const youtubeUrl = () => safeUrl(data.socials.youtube);

const NAV_TILES = [["store", "bag", "nav.store", "ex.store"], ["projects", "folder", "nav.projects", "ex.projects"], ["tools", "tool", "nav.tools", "ex.tools"], ["services", "compass", "nav.services", "ex.services"], ["community", "chat", "nav.community", "ex.community"], ["about", "spark", "nav.about", "ex.about"]];
function exploreTiles(n) {
  return h("div", { class: "tiles" }, NAV_TILES.slice(0, n).map(([to, ic, nk, dk]) => h("a", { class: "glass tile tilt", href: "#/" + to },
    h("span", { class: "ico" }, icon(ic)), h("h3", null, t(nk)), h("p", null, t(dk)), h("span", { class: "go" }, t("ex.open") + " " + t("arrow")))));
}
function renderExplore() {
  const root = clear($("#exploreRoot"));
  root.append(pagehead(t("ex.eyebrow"), t("ex.title"), t("ex.sub")), h("div", { class: "reveal" }, exploreTiles(6)),
    h("div", { class: "sec reveal" }, sechead(t("nav.store"), t("ex.categories")), h("div", { class: "chips", style: { flexWrap: "wrap" } },
      data.categories.map(c => h("a", { class: "chip", href: "#/store/" + c.id }, icon(c.icon || "box"), loc(c.name))))));
  reveal(root);
}

/* store */
const sf = { q: "", cat: "all", tags: [], avail: "all", sort: "featured" };
let storeFirst = true;
function filtered() {
  const q = sf.q.trim().toLowerCase();
  let l = published().filter(p => (sf.cat === "all" || p.cat === sf.cat) && (sf.avail === "all" || p.avail === sf.avail) && sf.tags.every(x => (p.tags || []).includes(x)) &&
    (!q || [loc(p.name), p.name.ar, p.name.en, loc(p.desc), (p.tags || []).join(" ")].join(" ").toLowerCase().includes(q)));
  const idx = new Map(data.products.map((p, i) => [p.id, i]));
  const by = { featured: (a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || idx.get(a.id) - idx.get(b.id), newest: (a, b) => idx.get(b.id) - idx.get(a.id),
    priceAsc: (a, b) => cents(a.price) - cents(b.price), priceDesc: (a, b) => cents(b.price) - cents(a.price), name: (a, b) => loc(a.name).localeCompare(loc(b.name), lang) };
  return l.sort(by[sf.sort] || by.featured);
}
function renderStore(param) {
  if (param && (param === "all" || catOf(param))) sf.cat = param;
  const root = clear($("#storeRoot")), pub = published();
  root.append(pagehead(t("nav.store"), t("store.title"), t("store.sub")), banner(t("store.banner")));
  if (!pub.length) { root.append(empty(t("store.noneT"), t("store.noneP"), t("nav.dashboard"), "dashboard", "box")); return; }
  const results = h("div", { id: "storeResults" });
  const allTags = [...new Set(pub.flatMap(p => p.tags || []))].sort().slice(0, 14);
  const chipsEl = h("div", { class: "chips", role: "group", "aria-label": t("store.cat") });
  const drawChips = () => { clear(chipsEl).append(h("button", { type: "button", class: "chip" + (sf.cat === "all" ? " on" : ""), onclick: () => { sf.cat = "all"; drawChips(); draw(); } }, t("store.all")),
    ...data.categories.filter(c => pub.some(p => p.cat === c.id)).map(c => h("button", { type: "button", class: "chip" + (sf.cat === c.id ? " on" : ""), onclick: () => { sf.cat = c.id; drawChips(); draw(); } }, icon(c.icon || "box"), loc(c.name)))); };
  const tagsEl = h("div", { class: "chips", role: "group", "aria-label": t("store.tags") });
  const drawTags = () => { clear(tagsEl).append(...allTags.map(x => h("button", { type: "button", class: "chip t" + (sf.tags.includes(x) ? " on" : ""), onclick: () => { sf.tags = sf.tags.includes(x) ? sf.tags.filter(y => y !== x) : [...sf.tags, x]; drawTags(); draw(); } }, "#" + x))); };
  const sel = (opts, cur, on) => h("select", { onchange: e => { on(e.target.value); draw(); } }, opts.map(([v, l]) => h("option", { value: v, selected: cur === v }, l)));
  const search = h("input", { type: "search", class: "search", placeholder: t("store.search"), value: sf.q, "aria-label": t("store.search"), oninput: e => { sf.q = e.target.value; draw(); } });
  root.append(h("div", { class: "glass toolbar" },
    h("div", { class: "tr" }, search,
      sel([["all", t("store.availAll")], ["available", t("avail.available")], ["limited", t("avail.limited")], ["soon", t("avail.soon")]], sf.avail, v => sf.avail = v),
      sel([["featured", t("sort.featured")], ["newest", t("sort.newest")], ["priceAsc", t("sort.priceAsc")], ["priceDesc", t("sort.priceDesc")], ["name", t("sort.name")]], sf.sort, v => sf.sort = v)),
    chipsEl, allTags.length ? tagsEl : null), results);
  drawChips(); drawTags();
  function draw() {
    const l = filtered(), active = sf.q || sf.cat !== "all" || sf.avail !== "all" || sf.tags.length;
    clear(results);
    const head = h("div", { class: "subhead" }, h("h2", null, active ? t("store.results", { n: l.length }) : t("store.allProducts")),
      active ? h("button", { type: "button", class: "btn ghost sm", onclick: () => { Object.assign(sf, { q: "", cat: "all", tags: [], avail: "all", sort: "featured" }); search.value = ""; renderStore(); } }, icon("x"), t("store.clear")) : null);
    if (!active) { const f = pub.filter(p => p.featured).slice(0, 4); if (f.length) results.append(h("div", { class: "subhead" }, h("h2", null, t("store.featured"))), h("div", { class: "pgrid" }, f.map(productCard))); }
    results.append(head);
    if (!l.length) results.append(empty(t("store.emptyT"), t("store.emptyP"), null, null, "search"));
    else results.append(h("div", { class: "pgrid" }, l.map(productCard)));
  }
  if (storeFirst && motionOn()) {
    storeFirst = false;
    results.append(h("div", { class: "pgrid", "aria-busy": "true" }, [1, 2, 3, 4].map(() => h("div", { class: "skel" }))));
    setTimeout(() => { if ($("#store").classList.contains("on")) draw(); }, 380);
  } else { storeFirst = false; draw(); }
}
function renderProduct(id) {
  const root = clear($("#productRoot")), p = prodById(id);
  if (!p || p.status !== "published") { root.append(empty(t("p.notFoundT"), t("p.notFoundP"), t("p.back"), "store", "search")); return; }
  const cat = catOf(p.cat), imgs = productImages(p); let cur = 0, qty = 1;
  const main = h("img", { src: imgs[0], alt: loc(p.name), width: 800, height: 600 });
  const thumbs = h("div", { class: "thumbs", role: "group", "aria-label": t("p.gallery") });
  const paint = () => { main.src = imgs[cur]; $$("button", thumbs).forEach((b, i) => b.classList.toggle("on", i === cur)); };
  imgs.forEach((src, i) => thumbs.append(h("button", { type: "button", class: i === 0 ? "on" : "", "aria-label": (i + 1) + "/" + imgs.length, onclick: () => { cur = i; paint(); } }, h("img", { src, alt: "", loading: "lazy" }))));
  const qOut = h("output", null, "1");
  const canBuy = p.avail !== "soon", badge = loc(p.badge);
  root.append(h("div", { class: "crumbs" }, h("a", { href: "#/" }, t("p.home")), "/", h("a", { href: "#/store" }, t("p.store")), cat ? ["/", h("a", { href: "#/store/" + cat.id }, loc(cat.name))] : null, "/", h("b", null, loc(p.name))),
    h("div", { class: "detail" },
      h("div", null, h("div", { class: "gal-main tilt" }, main), imgs.length > 1 ? thumbs : null),
      h("div", { class: "glass info" }, h("span", { class: "pcat" }, cat ? loc(cat.name) : ""), h("h1", null, loc(p.name)),
        h("div", { class: "tagrow" }, badge ? h("span", { class: "demo-tag" }, badge) : null, (p.tags || []).map(x => h("a", { class: "tg", href: "#/store", onclick: () => { sf.tags = [x]; } }, "#" + x))),
        h("div", { class: "price", style: { fontSize: "1.9rem" } }, priceEl(p)),
        h("div", { class: "availline " + (p.avail === "available" ? "" : p.avail) }, h("i"), t("avail." + p.avail)),
        h("p", { class: "d" }, loc(p.desc)),
        canBuy ? h("div", { class: "buyrow" }, h("div", { class: "qty", role: "group", "aria-label": t("p.qty") },
          h("button", { type: "button", "aria-label": t("cart.dec"), onclick: () => { qty = clamp(qty - 1, 1, 99); qOut.textContent = qty; } }, "−"), qOut,
          h("button", { type: "button", "aria-label": t("cart.inc"), onclick: () => { qty = clamp(qty + 1, 1, 99); qOut.textContent = qty; } }, "+")),
          h("button", { class: "btn", type: "button", onclick: () => cartAdd(p.id, qty) }, icon("cart"), t("add")), h("a", { class: "btn ghost", href: "#/cart" }, t("p.cart")))
          : h("div", { class: "buyrow" }, h("span", { class: "btn ghost", "aria-disabled": "true", style: { cursor: "default" } }, t("avail.soon"))),
        h("div", { class: "demo-banner", style: { marginTop: "20px", marginBottom: 0 } }, icon("alert"), h("div", null, t("p.demo"))))));
  const rel = published().filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 4);
  if (rel.length) root.append(h("div", { class: "sec" }, h("div", { class: "subhead" }, h("h2", null, t("p.related"))), h("div", { class: "pgrid" }, rel.map(productCard))));
  reveal(root);
}
function qtyEl(l) {
  const out = h("output", null, String(l.qty));
  return h("div", { class: "qty", role: "group" }, h("button", { type: "button", "aria-label": t("cart.dec"), onclick: () => { cartSet(l.p.id, l.qty - 1); renderCart(); } }, "−"), out,
    h("button", { type: "button", "aria-label": t("cart.inc"), onclick: () => { cartSet(l.p.id, l.qty + 1); renderCart(); } }, "+"));
}
function summaryEl(tt_, ctaEl) {
  return h("aside", { class: "glass summary" }, h("h3", null, t("cart.summary")),
    h("div", { class: "sline" }, t("cart.items"), h("b", null, String(tt_.count))), h("div", { class: "sline" }, t("cart.subtotal"), h("b", null, money(tt_.sub))),
    h("div", { class: "sline" }, t("cart.fee"), h("b", null, money(tt_.fee))), h("div", { class: "sline total" }, t("cart.total") + " (" + t("usd") + ")", h("b", null, money(tt_.total))),
    h("p", { style: { color: "var(--muted)", fontSize: ".85rem", margin: "10px 0 0" } }, t("cart.note")), ctaEl);
}
function renderCart() {
  pruneCart(); const root = clear($("#cartRoot")), tt_ = totals();
  root.append(pagehead(t("nav.store"), t("cart.title")), banner(t("store.banner")));
  if (!tt_.lines.length) { root.append(empty(t("cart.emptyT"), t("cart.emptyP"), t("empty.go"), "store", "cart")); return; }
  root.append(h("div", { class: "cartwrap" }, h("div", null, tt_.lines.map(l => h("article", { class: "glass cline" },
    h("img", { src: productImg(l.p), alt: "", width: 84, height: 64 }),
    h("div", null, h("h3", null, h("a", { href: "#/product/" + l.p.id }, loc(l.p.name))), h("div", { class: "unit" }, priceText(l.p) + " " + (cents(l.p.price) ? t("cart.each") : ""))),
    h("div", { class: "end" }, qtyEl(l), h("b", { class: "lt" }, money(cents(l.p.price) * l.qty)), h("button", { class: "rm", type: "button", onclick: () => { cartSet(l.p.id, 0); renderCart(); } }, t("cart.remove"))))),
    h("div", { class: "toprow" }, h("a", { class: "btn ghost sm", href: "#/store" }, t("cart.continue")), h("button", { class: "btn ghost sm", type: "button", onclick: () => { cart = []; save(KEYS.cart, cart); updateBadges(); renderCart(); } }, icon("trash"), t("cart.clear")))),
    summaryEl(tt_, h("a", { class: "btn", href: "#/checkout" }, t("cart.checkout")))));
}
let receipt = null;
function renderCheckout() {
  pruneCart(); const root = clear($("#checkoutRoot")), tt_ = totals();
  if (receipt) {
    const r = receipt;
    root.append(pagehead(t("nav.store"), t("co.doneT")), h("div", { class: "glass receipt" }, h("span", { class: "stamp" }, t("co.stamp")),
      h("h2", null, t("co.doneT")), h("div", null, t("co.ref") + ": ", h("span", { class: "ref" }, r.ref)), h("small", { style: { color: "var(--muted)" } }, t("co.time") + ": " + r.time),
      h("ul", null, r.lines.map(l => h("li", null, h("span", null, loc(l.name) + " × " + l.qty), h("b", null, money(l.cents * l.qty)))), h("li", null, h("b", null, t("cart.total")), h("b", null, money(r.total)))),
      banner(t("co.notReal"), true), h("a", { class: "btn", href: "#/store", onclick: () => { receipt = null; } }, t("co.again"))));
    return;
  }
  root.append(pagehead(t("nav.store"), t("co.title")), banner(t("co.banner"), true));
  if (!tt_.lines.length) { root.append(empty(t("cart.emptyT"), t("cart.emptyP"), t("empty.go"), "store", "cart")); return; }
  const btn = h("button", { class: "btn", type: "button", disabled: true }, icon("check"), t("co.place"));
  const chk = h("input", { type: "checkbox", id: "coChk", onchange: e => { btn.disabled = !e.target.checked; } });
  btn.addEventListener("click", () => {
    if (!chk.checked) return;
    const cur = totals(), ref = "SIM-" + Date.now().toString(36).toUpperCase() + "-" + Math.random().toString(36).slice(2, 5).toUpperCase();
    receipt = { ref, time: new Date().toLocaleString(lang === "ar" ? "ar-IQ-u-nu-latn" : "en-GB"), total: cur.total, lines: cur.lines.map(l => ({ name: l.p.name, qty: l.qty, cents: cents(l.p.price) })) };
    log("Simulated order " + ref + " · " + money(cur.total) + " (no payment)");
    cart = []; save(KEYS.cart, cart); updateBadges(); renderCheckout(); scrollTo(0, 0);
  });
  root.append(h("div", { class: "cartwrap" }, h("div", null, tt_.lines.map(l => h("article", { class: "glass cline" }, h("img", { src: productImg(l.p), alt: "", width: 84, height: 64 }),
    h("div", null, h("h3", null, loc(l.p.name)), h("div", { class: "unit" }, "× " + l.qty)), h("div", { class: "end" }, h("b", { class: "lt" }, money(cents(l.p.price) * l.qty))))),
    h("a", { class: "btn ghost sm", href: "#/cart" }, t("co.back"))),
    summaryEl(tt_, h("div", null, h("label", { class: "checkline" }, chk, h("span", null, t("co.confirm"))), btn))));
}

/* projects / tools / services */
function projectCard(p) {
  const u = safeUrl(p.link);
  return gcard({ img: art(["mesh", "orbit", "prism", "waves", "grid"][(p.id.length + (p.hue | 0)) % 5], p.hue, 0), title: loc(p.title), text: loc(p.desc), tags: p.tags,
    action: u ? h("a", { class: "link", href: u, target: "_blank", rel: "noopener noreferrer" }, t("pr.open"), icon("arrow", "arr")) : h("small", { style: { color: "var(--muted)" } }, t("pr.nolink")) });
}
let prTag = "all";
function renderProjects() {
  const root = clear($("#projectsRoot")), list = data.projects.filter(x => x.status === "published"), tags = [...new Set(list.flatMap(x => x.tags || []))];
  root.append(pagehead(t("nav.projects"), t("pr.title"), t("pr.sub")));
  if (!list.length) { root.append(empty(t("pr.title"), t("store.noneP"), null, null, "folder")); return; }
  const grid = h("div", { class: "gcards" }), chips = h("div", { class: "chips", style: { marginBottom: "18px" } });
  const draw = () => { clear(grid).append(...list.filter(x => prTag === "all" || (x.tags || []).includes(prTag)).map(projectCard)); clear(chips).append(...["all", ...tags].map(x => h("button", { type: "button", class: "chip" + (prTag === x ? " on" : ""), onclick: () => { prTag = x; draw(); } }, x === "all" ? t("pr.all") : "#" + x))); };
  draw(); root.append(chips, grid); reveal(root);
}
const toolCard = x => gcard({ ic: x.icon, status: loc(x.status), title: loc(x.name), text: loc(x.desc), action: h("small", { style: { color: "var(--muted)" } }, t("tl.note")) });
const serviceCard = x => gcard({ ic: x.icon, title: loc(x.name), text: loc(x.desc), action: h("a", { class: "btn ghost sm", href: "#/about/contact", style: { alignSelf: "flex-start" } }, t("sv.quote")) });
function renderTools() { const r = clear($("#toolsRoot")); r.append(pagehead(t("nav.tools"), t("tl.title"), t("tl.sub")), h("div", { class: "gcards" }, data.tools.map(toolCard)), banner(t("tl.sub"))); reveal(r); }
function renderServices() { const r = clear($("#servicesRoot")); r.append(pagehead(t("nav.services"), t("sv.title"), t("sv.sub")), h("div", { class: "gcards" }, data.services.map(serviceCard))); reveal(r); }

/* community */
function ytId(u) {
  try { const x = new URL(u); if (x.hostname === "youtu.be") return x.pathname.slice(1).split("/")[0];
    if (/(^|\.)youtube\.com$/.test(x.hostname)) { if (x.pathname === "/watch") return x.searchParams.get("v"); const m = x.pathname.match(/^\/(embed|shorts|live)\/([\w-]{11})/); if (m) return m[2]; } } catch (e) {}
  return "";
}
function renderCommunity(name) {
  const root = clear($("#communityRoot")), yt = youtubeUrl(), ig = safeUrl(data.socials.instagram), dc = discordUrl();
  const card = (ic, title, text, btn) => h("div", { class: "glass social-card tilt" }, h("h3", null, icon(ic), title), h("p", null, text), btn);
  root.append(pagehead(t("nav.community"), t("cm.title"), t("cm.sub")),
    h("div", { class: "social-grid reveal" }, card("chat", "Discord", t("disc.sub"), linkBtn(dc, t("disc.join"), "chat", "discord")), card("youtube", "YouTube", t("yt.sub"), linkBtn(yt, t("yt.channel"), "youtube")), card("camera", "Instagram", t("ig.sub"), linkBtn(ig, t("ig.open"), "camera", "ghost"))),
    (dc && yt && ig) ? null : banner(t("cm.noLink")));
  // YouTube
  const id = yt ? ytId(yt) : "";
  const ys = clear($("#sec-youtube"));
  ys.append(sechead("YouTube", t("yt.title"), t("yt.sub")), id && /^[\w-]{11}$/.test(id)
    ? h("div", { class: "yt-frame" }, h("iframe", { src: "https://www.youtube-nocookie.com/embed/" + id, title: "YouTube", loading: "lazy", allow: "accelerometer; encrypted-media; gyroscope; picture-in-picture", allowfullscreen: true, referrerpolicy: "strict-origin-when-cross-origin" }))
    : h("div", { class: "yt-frame" }, h("div", null, h("div", { class: "play" }, icon("play")), h("b", null, t("yt.ph")), h("p", { style: { color: "var(--muted)", margin: "4px 0 0" } }, yt ? t("yt.channel") : t("yt.phSub")),
      yt ? h("div", { style: { marginTop: "12px" } }, linkBtn(yt, t("yt.channel"), "youtube")) : h("span", { class: "demo-tag", style: { marginTop: "10px" } }, "DEMO"))));
  const is = clear($("#sec-instagram"));
  is.append(sechead("Instagram", t("ig.title"), t("ig.sub")), h("div", { class: "glass", style: { padding: "20px", display: "grid", gridTemplateColumns: "minmax(120px,200px) 1fr", gap: "20px", alignItems: "center" } },
    h("div", { class: "ig-demo" }, icon("camera")), h("div", null, h("p", { style: { margin: "0 0 14px", color: "var(--muted)" } }, ig ? ig : t("ig.ph")), linkBtn(ig, t("ig.open"), "camera"))));
  reveal(root);
  if (["discord", "youtube", "instagram"].includes(name)) setTimeout(() => { const el = $("#sec-" + name); if (el) el.scrollIntoView({ behavior: motionOn() ? "smooth" : "auto", block: "start" }); }, 60);
}

/* about + contact */
function renderAbout(param) {
  const root = clear($("#aboutRoot")), mail = data.socials.email && /^\S+@\S+\.\S+$/.test(data.socials.email) ? data.socials.email : "";
  const msg = h("div", { class: "demo-banner", style: { display: "none", marginTop: "14px" }, role: "status" }, icon("check"), h("div", null, t("ct.sent")));
  const form = h("form", { novalidate: true, onsubmit: e => { e.preventDefault(); msg.style.display = "flex"; form.reset(); } },
    h("label", { class: "field" }, h("span", null, t("ct.name")), h("input", { type: "text", autocomplete: "off", maxlength: 60 })),
    h("label", { class: "field" }, h("span", null, t("ct.email")), h("input", { type: "email", autocomplete: "off", dir: "ltr", maxlength: 80 })),
    h("label", { class: "field" }, h("span", null, t("ct.msg")), h("textarea", { maxlength: 500 })), h("button", { class: "btn", type: "submit" }, icon("mail"), t("ct.send")), msg);
  root.append(pagehead(t("nav.about"), t("ab.title"), t("ab.sub")),
    h("div", { class: "glass reveal", style: { padding: "24px", fontSize: "1.05rem", lineHeight: "2" } }, t("ab.story")),
    h("div", { class: "sec reveal" }, h("div", { class: "values" }, [["ab.v1", "ab.v1p"], ["ab.v2", "ab.v2p"], ["ab.v3", "ab.v3p"]].map(([a, b]) => h("div", { class: "glass tilt" }, h("h3", { class: "gtext" }, t(a)), h("p", null, t(b)))))),
    h("div", { class: "sec reveal" }, sechead("Roadmap", t("ab.road")), h("ul", { class: "timeline" }, [1, 2, 3, 4].map(i => h("li", null, h("b", null, t("ab.r" + i)), h("span", null, t("ab.r" + i + "p")))))),
    h("div", { class: "sec reveal", id: "contact" }, sechead(t("nav.about"), t("ct.title")), h("div", { class: "contact" },
      h("div", { class: "glass panel" }, banner(t("ct.demo")), form),
      h("div", { class: "glass panel" }, h("h3", { style: { marginTop: 0 } }, t("ct.mail")), h("p", { style: { direction: "ltr", textAlign: "start" } }, mail || "contact@alethea.example"), mail ? null : h("span", { class: "demo-tag" }, t("ct.mailDemo")),
        h("div", { class: "cta", style: { justifyContent: "flex-start", marginTop: "16px" } }, linkBtn(discordUrl(), "Discord", "chat", "discord"), linkBtn(youtubeUrl(), "YouTube", "youtube", "ghost"), linkBtn(safeUrl(data.socials.instagram), "Instagram", "camera", "ghost"))))));
  reveal(root);
  if (param === "contact") setTimeout(() => { const el = $("#contact"); if (el) el.scrollIntoView({ behavior: "auto", block: "start" }); }, 60);
}

/* ---------------- chrome: i18n apply, footer, router glue ---------------- */
function applyI18n() {
  document.documentElement.lang = lang; document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  $$("[data-i18n]").forEach(el => { const k = el.dataset.i18n; if ((T[lang] && T[lang][k]) != null) el.textContent = T[lang][k]; });
  document.title = lang === "ar" ? "ALethea | الكون الرقمي (نسخة تجريبية)" : "ALethea | Digital Universe (Demo)";
  const lb = $("#langBtn"); if (lb) { lb.textContent = lang === "ar" ? "EN" : "عربي"; lb.setAttribute("aria-label", lang === "ar" ? "Switch to English" : "التبديل إلى العربية"); }
  const tb = $("#themeBtn"); if (tb) tb.setAttribute("aria-label", t("theme.title"));
  const fn = clear($("#footNav"));
  [["", "nav.home"], ["explore", "nav.explore"], ["store", "nav.store"], ["projects", "nav.projects"], ["tools", "nav.tools"], ["services", "nav.services"], ["community", "nav.community"], ["youtube", null, "YouTube"], ["discord", null, "Discord"], ["instagram", null, "Instagram"], ["about", "nav.about"], ["dashboard", "nav.dashboard"]]
    .forEach(([to, k, lbl]) => fn.append(h("a", { href: "#/" + to }, lbl || t(k))));
}
function setLang(l) { lang = l; st.set(KEYS.lang, l); applyI18n(); rerender(); if ($("#themePanel").classList.contains("open")) openThemePanel(true); }
let cur = { id: "home", name: "home", param: "" };
function rerender() { handle(cur); }
function handle(d) {
  cur = d; pruneCart(); updateBadges();
  const f = { home: renderHome, explore: renderExplore, store: () => renderStore(d.param), product: () => renderProduct(d.param), cart: renderCart, checkout: renderCheckout, projects: renderProjects,
    tools: renderTools, services: renderServices, community: () => renderCommunity(d.name), about: () => renderAbout(d.param), dashboard: () => window.ALETHEA_DASH && window.ALETHEA_DASH.render() }[d.id];
  try { if (f) f(); } catch (err) { console.error(err); }
  $$(".join").forEach(a => { const u = discordUrl(); if (u) a.href = u; });
  openThemePanel(false);
}
function parseHash() {
  const seg = location.hash.replace(/^#\/?/, "").split("/"), name = seg[0] || "home", alias = { youtube: "community", discord: "community", instagram: "community" };
  let id = alias[name] || name; if (!/^[a-z]+$/.test(id) || !$("#" + id + ".view")) id = "home";
  return { id, name, param: seg.slice(1).join("/") };
}

window.ALETHEA = {
  h, icon, t, loc, clear, safeUrl, safeImg, art, STYLES, productImg, productImages, productCard, money, cents, toast, log, go, clamp,
  get lang() { return lang; }, get data() { return data; }, get logs() { return logs; }, get theme() { return theme; },
  saveData, rerender, renderThemeEditor, applyTheme, PRESETS, discordUrl, youtubeUrl, KEYS, storageOk: () => storageOk,
  clearLogs() { logs = []; save(KEYS.log, logs); },
  setData(d) { data = migrate(d); saveData(); pruneCart(); },
  resetData() { data = clone(SEED); saveData(); cart = []; save(KEYS.cart, cart); updateBadges(); },
  cartInfo: () => ({ count: totals().count })
};

function start() {
  initReveal(); applyI18n(); applyTheme(); initHero(); updateBadges();
  $("#themeBtn").addEventListener("click", () => openThemePanel());
  $("#langBtn").addEventListener("click", () => setLang(lang === "ar" ? "en" : "ar"));
  $("#dockMore").addEventListener("click", () => { $("#menu").click(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") openThemePanel(false); });
  document.addEventListener("click", e => { const p = $("#themePanel"); if (!e.target.isConnected) return; if (p.classList.contains("open") && !p.contains(e.target) && !e.target.closest("#themeBtn")) openThemePanel(false); });
  addEventListener("alethea:route", e => handle(e.detail));
  // close the mobile menu after choosing a link
  $("#nav").addEventListener("click", e => { if (e.target.closest("a")) { $("#nav").classList.remove("open"); $("#menu").setAttribute("aria-expanded", "false"); } });
  handle(parseHash());
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
