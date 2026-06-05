-- Bucket 3 (Slice 1) — Business Tax Mode (GST-registered vs unregistered seller).
-- Run in Supabase: SQL Editor -> New query -> paste -> Run.
--
-- Default 'gst' everywhere PRESERVES current behaviour and keeps every existing
-- order/invoice a GST document. The mode is snapshotted onto each new order so
-- switching the business setting later never rewrites a past document.

-- the business-level setting (the switch the admin flips)
alter table public.tax_settings
  add column if not exists tax_mode text not null default 'gst'
  check (tax_mode in ('gst','unregistered'));

-- snapshot of the mode in force when each order was placed
alter table public.orders
  add column if not exists tax_mode text not null default 'gst';

-- snapshot of the mode on the issued document
alter table public.invoices
  add column if not exists tax_mode text not null default 'gst';
