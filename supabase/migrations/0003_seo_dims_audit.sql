-- Bucket 1 — SEO fields, shipping dimensions, launch flags, audit log.
-- Run in Supabase: SQL Editor -> New query -> paste -> Run.

-- per-product SEO + physical dimensions (weight/size used by Shiprocket too)
alter table public.products add column if not exists seo_title text;
alter table public.products add column if not exists seo_description text;
alter table public.products add column if not exists weight_grams numeric;
alter table public.products add column if not exists length_cm numeric;
alter table public.products add column if not exists breadth_cm numeric;
alter table public.products add column if not exists height_cm numeric;

-- manual launch-readiness checkboxes (privacy reviewed, CA verified, etc.)
alter table public.tax_settings add column if not exists launch_flags jsonb not null default '{}'::jsonb;

-- admin audit log
create table if not exists public.admin_audit (
  id uuid primary key default gen_random_uuid(),
  actor_email text,
  action text not null,
  entity text,
  entity_id text,
  details jsonb,
  created_at timestamptz not null default now()
);
alter table public.admin_audit enable row level security;
create policy "audit_admin_read"   on public.admin_audit for select using (public.is_admin());
create policy "audit_admin_insert" on public.admin_audit for insert with check (public.is_admin());
create index if not exists admin_audit_created_idx on public.admin_audit (created_at desc);
