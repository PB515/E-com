-- Bucket 4 (Slice 3) — product ↔ category many-to-many + per-category sort.
-- A product keeps its PRIMARY category (products.category) but can now also
-- appear in additional categories, each with its own order + "featured" flag.
-- Run in Supabase: SQL Editor -> New query -> paste -> Run.

create table if not exists public.product_categories (
  category_id uuid not null references public.categories(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  sort_order int not null default 0,
  is_featured boolean not null default false,
  is_primary boolean not null default false,   -- the product's home category
  created_at timestamptz not null default now(),
  primary key (category_id, product_id)
);
create index if not exists product_categories_category_idx on public.product_categories (category_id);
create index if not exists product_categories_product_idx on public.product_categories (product_id);
alter table public.product_categories enable row level security;
create policy "product_categories_public_read" on public.product_categories for select using (true);
create policy "product_categories_admin_all"   on public.product_categories for all using (public.is_admin()) with check (public.is_admin());

-- seed: every existing product becomes a (primary) member of its current
-- category, so category pages keep showing exactly what they show today.
insert into public.product_categories (category_id, product_id, is_primary, sort_order)
select c.id, p.id, true, 0
from public.products p
join public.categories c on c.slug = p.category
on conflict (category_id, product_id) do nothing;
