# موقع ALethea: دليل الإعداد

الملفات التي ترفعها إلى GitHub (كلها في نفس المجلد الرئيسي):
`index.html` `style.css` `aurora.css` `aurora-foundation.css` `welcome.css` `welcome.js` `multiverse.css` `multiverse.js` `polish.css` `extras.css` `extras.js` `config.js` `app.js` `data.js` `alethea.js` `dashboard.js` `README.md` `CLAUDE.md` `ALETHEA_PROGRESS.md`.
أما `schema.sql` و`schema_products.sql` فيُشغَّلان في Supabase ولا يلزم رفعهما (ارفعهما إن أردت حفظهما بالريبو).

ما يفعله كل جزء: شاشة الترحيب (`welcome.*`)، بوابات العوالم في الرئيسية (`multiverse.*`)، المتجر التجريبي (`alethea.js` و`data.js`)، لوحة تجريبية `#/dashboard` (`dashboard.js`)، لوحة أعضاء حقيقية `#/admin` (`app.js` مع Supabase).

## 1) Supabase
1. أنشئ حساباً في supabase.com ثم **New project**.
2. افتح **SQL Editor** والصق محتوى `schema.sql` كاملاً واضغط **Run**.
3. من **Project Settings > API** انسخ **Project URL** ومفتاح **anon / publishable** إلى `config.js`. لا تنسخ مفتاح `service_role` أبداً.

## 2) تطبيق Discord
1. افتح discord.com/developers/applications ثم **New Application**.
2. من **OAuth2** انسخ **Client ID**، ثم **Reset Secret** وانسخ **Client Secret**.
3. في Supabase افتح **Authentication > Providers > Discord** وفعّله، وانسخ منه **Callback URL**.
4. ارجع إلى Discord في **OAuth2 > Redirects** وأضف هذا الـ Callback URL واحفظ.
5. الصق Client ID وClient Secret في صفحة Discord داخل Supabase فقط، ولا تضعهما في أي ملف.

## 3) روابط الموقع في Supabase
في **Authentication > URL Configuration**: **Site URL** هو رابط موقعك على GitHub Pages (ينتهي بـ `/`)، وأضف الرابط نفسه في **Redirect URLs**.

## 4) رابط الدعوة
في Discord: اسم السيرفر > **Invite** > **Edit invite link** > **Never** ثم انسخ الرابط إلى `DISCORD_INVITE_URL` في `config.js`. اختياري: فعّل **Widget** وضع Server ID (17 إلى 19 رقماً) في `DISCORD_GUILD_ID` لإظهار عدد المتصلين.

## 5) الرفع من Android
**Add file > Upload files** على github.com (وضع Desktop site)، اختر كل الملفات أعلاه، ثم **Commit changes**. الملفات ذات الاسم نفسه تُستبدل. وفعّل **Settings > Pages** (Branch = main و/(root)).

## 6) منتجات حقيقية على Supabase (اختياري)
بعد `schema.sql` شغّل `schema_products.sql` في SQL Editor. بعدها، المدير المسجّل دخوله يضيف ويعدّل المنتجات من `#/dashboard` وتُحفظ في قاعدة البيانات وتظهر لكل الزوار. الزائر العادي يرى المنشور فقط، والخادم (RLS) يرفض أي كتابة من غير مدير. بدون هذه الخطوة يبقى الموقع على البيانات التجريبية. السلة والدفع تبقى محاكاة.

## 7) أول مدير
سجّل دخولك في الموقع مرة واحدة، انسخ **User UID** من **Authentication > Users**، ثم شغّل أمر "أول مدير" الموجود في آخر `schema.sql` يدوياً.

## ملاحظات أمان
- حماية `#/admin` الحقيقية هي سياسات RLS في قاعدة البيانات.
- اللوحة التجريبية `#/dashboard` بلا تسجيل دخول وتحفظ في متصفح الزائر فقط.
- مفتاح anon علني بطبيعته. إن تسرّب Client Secret أو service_role غيّرهما فوراً.
