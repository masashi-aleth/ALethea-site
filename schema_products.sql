-- ALethea: products table (Phase 7). شغّله يدوياً في Supabase SQL Editor بعد schema.sql. إعادة تشغيله آمنة.
-- القراءة: أي زائر يرى المنتجات المنشورة فقط. الكتابة والقراءة الكاملة: للمدراء فقط (is_admin() من schema.sql).
-- لا يحذف ولا يغيّر أي جدول موجود.

create table if not exists public.products (
  id text primary key check (char_length(id) between 1 and 80),
  status text not null default 'draft' check (status in ('published','hidden','draft')),
  doc jsonb not null check (octet_length(doc::text) < 2000000),
  updated_at timestamptz not null default now()
);
alter table public.products enable row level security;

revoke all on table public.products from anon, authenticated;
grant select on table public.products to anon, authenticated;
grant insert, update, delete on table public.products to authenticated;

drop policy if exists "public reads published products" on public.products;
drop policy if exists "admins read all products" on public.products;
drop policy if exists "admins insert products" on public.products;
drop policy if exists "admins update products" on public.products;
drop policy if exists "admins delete products" on public.products;

create policy "public reads published products" on public.products
  for select to anon, authenticated using (status = 'published');
create policy "admins read all products" on public.products
  for select to authenticated using ((select public.is_admin()));
create policy "admins insert products" on public.products
  for insert to authenticated with check ((select public.is_admin()));
create policy "admins update products" on public.products
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "admins delete products" on public.products
  for delete to authenticated using ((select public.is_admin()));
