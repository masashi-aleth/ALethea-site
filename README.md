# موقع ALethea: دليل الإعداد

الملفات التي ترفعها إلى GitHub (كلها في نفس المجلد الرئيسي):
`index.html` `style.css` `aurora.css` `aurora-foundation.css` `welcome.css` `welcome.js` `multiverse.css` `multiverse.js` `polish.css` `extras.css` `extras.js` `account-sync.js` `support.js` `ops.js` `galaxy.js` `settings.js` `config.js` `app.js` `data.js` `alethea.js` `dashboard.js` `README.md` `CLAUDE.md` `ALETHEA_PROGRESS.md`.
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

## 8) مزامنة المظهر مع الحساب (المرحلة 10)
بعد `schema.sql` شغّل `schema_account.sql` في SQL Editor. بعدها أي مستخدم مسجّل دخوله، يُحفظ مظهره (الألوان والإضاءة والحركة) في حسابه ويرجع له على أي جهاز. الزائر غير المسجّل يبقى مظهره بمتصفحه فقط. بدون تشغيل الملف لا يحدث شيء ولا ظهور أخطاء.

## 9) مركز الدعم والإشعارات (المرحلة 11)
بعد `schema.sql` شغّل `schema_support.sql` في SQL Editor. بعدها يظهر رابط «الدعم» وجرس الإشعارات للمستخدم المسجّل، ويفتح تذاكر ويتابع الردود في `#/support`. المدير (role = admin) يرى كل التذاكر ويرد ويغيّر الحالة والأولوية. لا تُرسل رسائل بريد؛ الإشعارات داخل الموقع فقط. بدون تشغيل الملف تظهر رسالة «الدعم غير مُفعّل».

## 10) سجل الأحداث ولوحة العمليات (المرحلة 12)
بعد `schema_support.sql` شغّل `schema_audit.sql`. بعدها يظهر للمدير رابط «العمليات» (`#/ops`): أرقام الأعضاء والتذاكر، رسم للتذاكر حسب الحالة، فحص اتصال قاعدة البيانات، وسجل أحداث قابل للبحث والتصفية مع تصدير CSV. السجل يقرؤه المدراء فقط ولا أحد يعدّله أو يحذفه. يُسجَّل: فتح التذاكر والردود وتغيير الحالة/الأولوية وتغيير أدوار الأعضاء (بدون نص الرسائل). أحداث تسجيل الدخول تُراجَع من Authentication > Logs في Supabase.

## 11) المجرة وصفحة الإعدادات والدليل (المرحلة 13)
`galaxy.js` يستبدل الكوكب بمجرة حلزونية خفيفة (SVG + CSS بدون مكتبات) نجومها روابط حقيقية للأقسام: المتجر، المشاريع، الأدوات، الخدمات، المجتمع، عن ALethea. السحب يدوّر المجرة والنقر على نجمة ينقلك للقسم. أول زيارة يظهر دليل «من وين أبدأ؟» مرة واحدة، ويرجع من زر «من وين أبدأ؟» بالرئيسية. `settings.js` يضيف صفحة `#/settings`: اللغة، استوديو الألوان، حجم الخط، شكل الزوايا، إطفاء خلفية الجسيمات، مستوى الحركة، تباين عالٍ، وإعادة ضبط. الاختيارات تُحفظ بالمتصفح؛ ألوان المظهر ومستوى الحركة تتبع الحساب أيضاً عند تفعيل `schema_account.sql`.
