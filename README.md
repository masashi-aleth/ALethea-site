# موقع ALethea: دليل الإعداد

الملفات: `index.html` و`style.css` و`app.js` و`config.js` للموقع، و`schema.sql` لقاعدة البيانات (يُشغَّل في Supabase ولا يلزم رفعه).

## 1) Supabase
1. أنشئ حساباً في supabase.com ثم **New project**.
2. افتح **SQL Editor** والصق محتوى `schema.sql` كاملاً واضغط **Run**.
3. من **Project Settings > API** انسخ **Project URL** ومفتاح **anon / publishable** إلى `config.js`.
   لا تنسخ مفتاح `service_role` أبداً.

## 2) تطبيق Discord
1. افتح discord.com/developers/applications ثم **New Application**.
2. من **OAuth2** انسخ **Client ID**، ثم **Reset Secret** وانسخ **Client Secret**.
3. في Supabase افتح **Authentication > Providers > Discord** وفعّله، وانسخ منه **Callback URL**.
4. ارجع إلى Discord في **OAuth2 > Redirects** وأضف هذا الـ Callback URL واحفظ.
5. الصق Client ID وClient Secret في صفحة Discord داخل Supabase فقط، ولا تضعهما في أي ملف.

## 3) روابط الموقع في Supabase
في **Authentication > URL Configuration**:
- **Site URL**: رابط موقعك على GitHub Pages، مثل `https://USER.github.io/alethea-site/` (ينتهي بـ `/`).
- **Redirect URLs**: أضف الرابط نفسه.

لتجربة سريعة يمكنك إيقاف **Confirm email** من **Authentication > Providers > Email**. الإرسال المجاني للبريد محدود بعدد قليل في الساعة.

## 4) رابط الدعوة
في Discord: اضغط اسم السيرفر > **Invite** > **Edit invite link** > **Never** ثم انسخ الرابط إلى `DISCORD_INVITE_URL` في `config.js`.
اختياري: فعّل **Widget** من إعدادات السيرفر وضع Server ID في `DISCORD_GUILD_ID` لإظهار عدد المتصلين.

## 5) الرفع من Android
1. نزّل الملفات إلى هاتفك (مجلد Downloads).
2. افتح Chrome على github.com وسجّل الدخول، ثم من القائمة ⋮ فعّل **Desktop site**.
3. **New repository** باسم `alethea-site`، اجعله **Public**، ثم **Create**.
4. **Add file > Upload files** واختر: `index.html` و`style.css` و`app.js` و`config.js` (و`README.md` إن أردت)، ثم **Commit changes**.
5. **Settings > Pages**: Source = **Deploy from a branch**، Branch = **main** و**/(root)**، ثم **Save**. بعد دقيقة أو اثنتين يظهر الرابط.

عدّل `config.js` قبل الرفع، أو بعده من GitHub: افتح الملف ثم أيقونة القلم ثم **Commit**.

## 6) أول مدير
سجّل دخولك في الموقع مرة واحدة. ثم من **Authentication > Users** افتح حسابك وانسخ **User UID**. في **SQL Editor** شغّل أمر "أول مدير" الموجود في آخر `schema.sql` (بعد وضع الـ UID وحذف `--`). الأمر لا يعمل إن وُجد مدير مسبقاً. بعدها تتم الترقية من تبويب الأعضاء، والمدير لا يستطيع تغيير رتبته بنفسه.

## ملاحظات أمان
- حماية لوحة التحكم الحقيقية هي سياسات RLS في قاعدة البيانات. إخفاء الرابط في الواجهة للتسهيل فقط.
- مفتاح anon علني بطبيعته، وسياسات RLS هي ما يمنع الوصول للبيانات.
- إن تسرّب Client Secret أو service_role، غيّرهما فوراً من مكان إنشائهما.
