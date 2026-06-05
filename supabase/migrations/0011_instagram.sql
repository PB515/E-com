-- Instagram showcase — an admin-curated grid of post/reel links shown on the
-- storefront. Privacy-friendly (no third-party embed script): each item is a
-- thumbnail card that opens the post/reel on Instagram.
-- Run in Supabase: SQL Editor -> New query -> paste -> Run.

create table if not exists public.instagram_posts (
  id uuid primary key default gen_random_uuid(),
  url text not null,                  -- the post/reel permalink
  image_url text,                     -- thumbnail in our storage
  caption text,
  is_reel boolean not null default false,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists instagram_posts_active_idx on public.instagram_posts (is_active, sort_order);
alter table public.instagram_posts enable row level security;
create policy "instagram_public_read" on public.instagram_posts for select using (true);
create policy "instagram_admin_all"   on public.instagram_posts for all using (public.is_admin()) with check (public.is_admin());
