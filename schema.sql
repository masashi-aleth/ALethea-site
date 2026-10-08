-- ALethea schema v2 (مراجعة أمنية)
-- شغّله كاملاً مرة واحدة في Supabase: SQL Editor ثم Run.
-- مناسب لمشروع جديد فارغ، وإعادة تشغيله آمنة (idempotent).
-- مبدأ التصميم: المتصفح لا يكتب في profiles إطلاقاً. تغيير الرتب يمر فقط عبر
-- الدالة set_user_role التي تتحقق من الصلاحية على الخادم.

-- ============================================================
-- 1) profiles
-- ============================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text,
  provider text,
  role text not null default 'member' check (role in ('member','admin')),
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

-- سحب كل الصلاحيات الافتراضية (Supabase يمنحها لـ anon و authenticated)
-- ثم منح القراءة فقط. لا إدراج ولا تعديل ولا حذف مباشر من المتصفح.
revoke all on table public.profiles from anon, authenticated;
grant select on table public.profiles to authenticated;

-- ============================================================
-- 2) is_admin(): هل المستخدم الحالي مدير؟ (يقرأ من الجدول لا من بيانات المتصفح)
-- ============================================================
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  );
$$;
revoke all on function public.is_admin() from public, anon, authenticated;
grant execute on function public.is_admin() to authenticated;

-- ============================================================
-- 3) إنشاء الملف الشخصي عند التسجيل. الرتبة دائماً member
--    (لا تُقرأ أبداً من user_metadata لأن المستخدم يستطيع تعديلها)
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, username, provider, role)
  values (
    new.id,
    left(
      coalesce(
        nullif(btrim(regexp_replace(
          coalesce(new.raw_user_meta_data->>'username', new.raw_user_meta_data->>'full_name',
                   new.raw_user_meta_data->>'name', ''),
          '[[:cntrl:]]', '', 'g')), ''),
        split_part(new.email, '@', 1),
        'member'),
      40),
    coalesce(new.raw_app_meta_data->>'provider', 'email'),
    'member'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;
revoke all on function public.handle_new_user() from public, anon, authenticated;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- 4) سياسات القراءة فقط على profiles
-- ============================================================
drop policy if exists "read own profile" on public.profiles;
drop policy if exists "admins read all profiles" on public.profiles;
drop policy if exists "admins update profiles" on public.profiles;   -- سياسة قديمة: تُحذف إن وُجدت
create policy "read own profile" on public.profiles
  for select to authenticated using (id = (select auth.uid()));
create policy "admins read all profiles" on public.profiles
  for select to authenticated using ((select public.is_admin()));
-- لا توجد أي سياسة insert/update/delete: مرفوضة لكل الأدوار عبر الواجهة.

-- ============================================================
-- 5) تغيير الرتبة: المسار الوحيد المسموح
-- ============================================================
create or replace function public.set_user_role(target uuid, new_role text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  caller uuid := (select auth.uid());
begin
  if caller is null then
    raise exception 'not authenticated' using errcode = '28000';
  end if;
  if target is null or new_role is null or new_role not in ('member','admin') then
    raise exception 'invalid arguments' using errcode = '22023';
  end if;

  -- تسلسل كل عمليات تغيير الرتب لمنع سباق (مديران يخفّضان بعضهما معاً)
  perform pg_advisory_xact_lock(hashtext('alethea.set_user_role'));

  if not public.is_admin() then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  if target = caller then
    raise exception 'you cannot change your own role' using errcode = '42501';
  end if;

  -- المنفِّذ مدير ولا يستطيع استهداف نفسه، فيبقى مدير واحد على الأقل دائماً.
  update public.profiles set role = new_role where id = target;
  if not found then
    raise exception 'user not found' using errcode = 'P0002';
  end if;
end;
$$;
revoke all on function public.set_user_role(uuid, text) from public, anon, authenticated;
grant execute on function public.set_user_role(uuid, text) to authenticated;

-- ============================================================
-- 6) site_settings (للمدراء فقط)
-- ============================================================
create table if not exists public.site_settings (
  key text primary key,
  value boolean not null default false,
  updated_at timestamptz not null default now()
);
alter table public.site_settings
  drop constraint if exists site_settings_key_allowed,
  add constraint site_settings_key_allowed
    check (key in ('welcome_message','verification','mod_log'));
alter table public.site_settings enable row level security;

revoke all on table public.site_settings from anon, authenticated;
grant select, insert, update on table public.site_settings to authenticated;

drop policy if exists "admins read settings" on public.site_settings;
drop policy if exists "admins insert settings" on public.site_settings;
drop policy if exists "admins update settings" on public.site_settings;
create policy "admins read settings" on public.site_settings
  for select to authenticated using ((select public.is_admin()));
create policy "admins insert settings" on public.site_settings
  for insert to authenticated with check ((select public.is_admin()));
create policy "admins update settings" on public.site_settings
  for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

insert into public.site_settings (key, value) values
  ('welcome_message', true), ('verification', false), ('mod_log', true)
on conflict (key) do nothing;

-- ============================================================
-- 7) أول مدير: خطوة منفصلة تُنفَّذ يدوياً من SQL Editor فقط
-- ============================================================
-- لا تُشغَّل مع الملف. التنفيذ من لوحة Supabase يتم بصلاحيات المالك
-- (تتجاوز RLS) ولا يمكن الوصول إليه من المتصفح أو من مفتاح anon.
-- 1) سجّل دخولك في الموقع مرة واحدة.
-- 2) من Authentication > Users افتح حسابك وانسخ User UID (والتزم بأنه حسابك أنت).
-- 3) ضع الـ UID مكان المثال، احذف علامات -- عن الأسطر الأربعة، ثم شغّلها وحدها:
--
-- update public.profiles
--    set role = 'admin'
--  where id = '00000000-0000-0000-0000-000000000000'
--    and not exists (select 1 from public.profiles where role = 'admin');
--
-- الشرط الأخير يجعل الأمر لا يفعل شيئاً إن وُجد مدير مسبقاً.
-- بعدها تتم الترقية والتخفيض من لوحة التحكم عبر set_user_role.
