-- Bucket 4 (Slice 2) — Collections: marketing groupings a product can belong to
-- (Festive Picks, Under ₹999, Best Sellers…), independent of its permanent
-- category. Many-to-many via product_collections.
-- Run in Supabase: SQL Editor -> New query -> paste -> Run.

create table if not exists public.collections (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  image_url text,                     -- banner
  seo_title text,
  seo_description text,
  is_active boolean not null default true,
  show_on_home boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.collections enable row level security;
create policy "collections_public_read" on public.collections for select using (true);
create policy "collections_admin_all"   on public.collections for all using (public.is_admin()) with check (public.is_admin());

-- link table: one product can sit in many collections, each with its own order
-- and a "featured" flag (pin to the front of that collection).
create table if not exists public.product_collections (
  collection_id uuid not null references public.collections(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  sort_order int not null default 0,
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  primary key (collection_id, product_id)
);
create index if not exists product_collections_collection_idx on public.product_collections (collection_id);
create index if not exists product_collections_product_idx on public.product_collections (product_id);
alter table public.product_collections enable row level security;
create policy "product_collections_public_read" on public.product_collections for select using (true);
create policy "product_collections_admin_all"   on public.product_collections for all using (public.is_admin()) with check (public.is_admin());
