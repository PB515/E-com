-- Bugadi — order fulfillment workflow + tracking (improvement #1).
-- Run in Supabase: SQL Editor -> New query -> paste -> Run.

-- richer status pipeline (keep 'fulfilled' for existing rows)
alter table public.orders drop constraint if exists orders_status_check;
alter table public.orders add constraint orders_status_check check (
  status in ('pending','paid','cod_confirmed','packed','shipped','delivered','fulfilled','cancelled','returned')
);

-- tracking + shipment fields
alter table public.orders add column if not exists tracking_number text;
alter table public.orders add column if not exists courier text;
alter table public.orders add column if not exists shiprocket_shipment_id text;
alter table public.orders add column if not exists shipped_at timestamptz;
alter table public.orders add column if not exists delivered_at timestamptz;
