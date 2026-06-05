-- Bucket 2 (Slice 1) — Customer CRM + unified order source/fields.
-- Run in Supabase: SQL Editor -> New query -> paste -> Run.

-- Customers become a CRM entity
alter table public.customers add column if not exists notes text;
alter table public.customers add column if not exists tags text[] not null default '{}'::text[];
alter table public.customers add column if not exists source text;        -- first-touch source

-- Every order carries its source + commercial fields (unified across channels)
alter table public.orders add column if not exists source text not null default 'website';
alter table public.orders add column if not exists internal_note text;
alter table public.orders add column if not exists payment_status text not null default 'paid';
alter table public.orders add column if not exists discount_inr numeric(12,2) not null default 0;
alter table public.orders add column if not exists shipping_inr numeric(12,2) not null default 0;

create index if not exists orders_source_idx on public.orders (source);
create index if not exists customers_phone_idx on public.customers (phone);
create index if not exists customers_email_idx on public.customers (email);
