-- Bucket 2 (Slice 2) — variant model + stock-movement ledger + manual orders.
-- Run in Supabase: SQL Editor -> New query -> paste -> Run.

-- product variants (each with its own stock / SKU / optional price override)
create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  label text not null default 'Standard',
  sku text,
  price_inr integer,                 -- null = inherit the product price
  stock int not null default 0,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists product_variants_product_idx on public.product_variants (product_id);
alter table public.product_variants enable row level security;
create policy "variants_public_read" on public.product_variants for select using (true);
create policy "variants_admin_all"   on public.product_variants for all using (public.is_admin()) with check (public.is_admin());

-- product SKU
alter table public.products add column if not exists sku text;

-- manual/marketplace orders: draft flag + wider payment methods + marketplace fields
alter table public.orders add column if not exists is_draft boolean not null default false;
alter table public.orders drop constraint if exists orders_payment_method_check;
alter table public.orders add constraint orders_payment_method_check check (
  payment_method in ('razorpay','cod','upi','cash','bank','manual','marketplace')
);
alter table public.orders add column if not exists marketplace_name text;
alter table public.orders add column if not exists marketplace_order_id text;
alter table public.orders add column if not exists marketplace_fee_inr numeric(12,2) not null default 0;

-- order items reference the variant sold
alter table public.order_items add column if not exists variant_id uuid references public.product_variants(id);
alter table public.order_items add column if not exists variant_label text;

-- one stock pool, every change logged
create table if not exists public.stock_movements (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete set null,
  variant_id uuid references public.product_variants(id) on delete set null,
  delta int not null,                -- negative = out, positive = in
  reason text not null,              -- sale / manual / damage / return / restock / adjustment
  source text,                       -- website / whatsapp / instagram / exhibition / ...
  order_id uuid references public.orders(id) on delete set null,
  note text,
  actor_email text,
  created_at timestamptz not null default now()
);
create index if not exists stock_movements_product_idx on public.stock_movements (product_id, created_at desc);
alter table public.stock_movements enable row level security;
create policy "movements_admin_read"   on public.stock_movements for select using (public.is_admin());
create policy "movements_admin_insert" on public.stock_movements for insert with check (public.is_admin());

-- seed: a default 'Standard' variant per existing product, mirroring its stock
insert into public.product_variants (product_id, label, stock, price_inr, sort_order)
select id, 'Standard', stock, null, 0
from public.products p
where not exists (select 1 from public.product_variants v where v.product_id = p.id);
