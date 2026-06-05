-- Bucket 4 (Slice 4) — editable homepage content (hero, section titles, trust
-- strip, newsletter). Single-row settings table; every column is nullable and
-- NULL means "use the built-in default", so the homepage is unchanged until the
-- admin overrides a field.
-- Run in Supabase: SQL Editor -> New query -> paste -> Run.

create table if not exists public.site_content (
  id int primary key default 1,
  hero_title text,
  hero_subtitle text,
  hero_cta1_label text,
  hero_cta1_href text,
  hero_cta2_label text,
  hero_cta2_href text,
  hero_image_url text,
  category_title text,
  featured_title text,
  newsletter_title text,
  newsletter_subtitle text,
  trust1_label text, trust1_sub text,
  trust2_label text, trust2_sub text,
  trust3_label text, trust3_sub text,
  trust4_label text, trust4_sub text,
  updated_at timestamptz not null default now(),
  constraint site_content_singleton check (id = 1)
);
insert into public.site_content (id) values (1) on conflict (id) do nothing;

alter table public.site_content enable row level security;
create policy "site_content_public_read" on public.site_content for select using (true);
create policy "site_content_admin_all"   on public.site_content for all using (public.is_admin()) with check (public.is_admin());
