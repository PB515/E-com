-- Bugadi — initial schema + RLS + seed (doc 06 / app-02 / Billing & GST module).
-- Run this in Supabase: SQL Editor -> New query -> paste -> Run.
-- Deny-by-default: RLS on everywhere; the ONLY public read is active products
-- and their images. All other reads are admin-only; trusted writes go through
-- the service-role client (which bypasses RLS) from the server.

create extension if not exists pgcrypto;

-- ── admin role ────────────────────────────────────────────────────────────
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean language sql security definer stable
set search_path = public as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;

-- ── tax settings (singleton, admin-editable) ──────────────────────────────
create table if not exists public.tax_settings (
  id int primary key default 1,
  business_name text not null default 'Bugadi',
  gstin text,                              -- null until obtained
  registered_state text not null default 'Maharashtra',
  default_gst_rate numeric(5,2) not null default 12.00,
  default_hsn text not null default '7117',
  invoice_prefix text not null default 'BUG',
  updated_at timestamptz not null default now(),
  constraint singleton check (id = 1)
);

-- ── catalog ───────────────────────────────────────────────────────────────
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  category text not null check (category in ('ear-cuffs','earrings','bracelets','hasli','pendants')),
  price_inr integer not null,              -- GST-inclusive display price
  hsn_code text not null default '7117',   -- admin-editable
  gst_rate numeric(5,2) not null default 12.00, -- admin-editable
  motif text, region text, occasion text, story text,
  material text, size text, care text,
  images int not null default 1,
  stock int not null default 0,
  is_active boolean not null default true,
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  url text not null, alt_text text, sort_order int default 0, is_primary boolean default false
);

-- ── customers / addresses (guest checkout) ────────────────────────────────
create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  name text not null, email text not null, phone text,
  created_at timestamptz not null default now()
);
create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  line1 text not null, line2 text, city text not null,
  state text not null,                     -- drives place-of-supply
  pincode text not null, created_at timestamptz not null default now()
);

-- ── orders ────────────────────────────────────────────────────────────────
create sequence if not exists public.order_seq start 10001;
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null default ('BUG-' || nextval('public.order_seq')),
  customer_id uuid not null references public.customers(id),
  address_id uuid not null references public.addresses(id),
  status text not null default 'pending'
    check (status in ('pending','paid','cod_confirmed','fulfilled','cancelled','returned')),
  payment_method text not null check (payment_method in ('razorpay','cod')),
  -- tax snapshot (written at checkout; never rewritten)
  place_of_supply_state text not null,
  is_intra_state boolean not null,
  subtotal_inr numeric(12,2) not null,
  cgst_amount numeric(12,2) not null default 0,
  sgst_amount numeric(12,2) not null default 0,
  igst_amount numeric(12,2) not null default 0,
  total_tax_amount numeric(12,2) not null,
  grand_total_inr numeric(12,2) not null,
  razorpay_order_id text, razorpay_payment_id text,
  created_at timestamptz not null default now(), paid_at timestamptz
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id),
  product_name text not null,              -- snapshot
  unit_price_inr numeric(12,2) not null,
  qty int not null,
  hsn_code text not null,                  -- snapshot
  gst_rate numeric(5,2) not null,          -- snapshot
  line_total_inr numeric(12,2) not null
);

-- ── invoices (legal record from the snapshot) ─────────────────────────────
create sequence if not exists public.invoice_seq start 1;
create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  invoice_number text unique not null,     -- set in the server action (prefix + FY + seq)
  order_id uuid not null unique references public.orders(id),
  gstin text,                              -- snapshot of seller GSTIN (or null)
  place_of_supply_state text not null, is_intra_state boolean not null,
  subtotal_inr numeric(12,2) not null,
  cgst_amount numeric(12,2) not null default 0,
  sgst_amount numeric(12,2) not null default 0,
  igst_amount numeric(12,2) not null default 0,
  total_tax_amount numeric(12,2) not null, grand_total_inr numeric(12,2) not null,
  issued_at timestamptz not null default now()
);

-- ── subscribers / returns / credit notes ──────────────────────────────────
create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null, source text, consent_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
create table if not exists public.return_requests (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id),
  order_number text, reason text not null check (reason in ('damaged','wrong_item')),
  note text, photo_url text,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default now(), reviewed_at timestamptz
);
create table if not exists public.credit_notes (
  id uuid primary key default gen_random_uuid(),
  return_request_id uuid references public.return_requests(id),
  order_id uuid references public.orders(id),
  invoice_id uuid references public.invoices(id),
  amount_inr numeric(12,2) not null, tax_reversed_inr numeric(12,2) not null,
  credit_note_number text unique not null, issued_at timestamptz not null default now()
);

-- ── RLS (deny by default; service role bypasses) ──────────────────────────
alter table public.admin_users     enable row level security;
alter table public.tax_settings    enable row level security;
alter table public.products        enable row level security;
alter table public.product_images  enable row level security;
alter table public.customers       enable row level security;
alter table public.addresses       enable row level security;
alter table public.orders          enable row level security;
alter table public.order_items     enable row level security;
alter table public.invoices        enable row level security;
alter table public.subscribers     enable row level security;
alter table public.return_requests enable row level security;
alter table public.credit_notes    enable row level security;

-- Public can read ONLY active products + their images.
create policy "products_public_read"  on public.products       for select using (is_active = true);
create policy "images_public_read"    on public.product_images for select using (true);

-- Admin can do everything (per table). Everyone else: denied (no policy).
create policy "products_admin_all"    on public.products       for all using (public.is_admin()) with check (public.is_admin());
create policy "images_admin_all"      on public.product_images for all using (public.is_admin()) with check (public.is_admin());
create policy "tax_admin_all"         on public.tax_settings    for all using (public.is_admin()) with check (public.is_admin());
create policy "admins_admin_all"      on public.admin_users     for all using (public.is_admin()) with check (public.is_admin());
create policy "customers_admin_read"  on public.customers       for select using (public.is_admin());
create policy "addresses_admin_read"  on public.addresses       for select using (public.is_admin());
create policy "orders_admin_rw"       on public.orders          for all using (public.is_admin()) with check (public.is_admin());
create policy "order_items_admin_read" on public.order_items    for select using (public.is_admin());
create policy "invoices_admin_read"   on public.invoices        for select using (public.is_admin());
create policy "subscribers_admin_read" on public.subscribers    for select using (public.is_admin());
create policy "returns_admin_rw"      on public.return_requests for all using (public.is_admin()) with check (public.is_admin());
create policy "credit_admin_rw"       on public.credit_notes    for all using (public.is_admin()) with check (public.is_admin());

-- ── seed: tax settings + the 11 representative products ───────────────────
insert into public.tax_settings (id) values (1) on conflict (id) do nothing;

insert into public.products (slug,name,category,price_inr,motif,region,occasion,story,material,size,care,images,stock,featured) values
('engraved-hasli-choker','Engraved Hasli Choker','hasli',1899,'Paisley','Rajasthan','Weddings and festive wear','The hasli is the oldest form of Indian neck ornament, a rigid band worn close to the throat. This one carries the paisley, a motif read across Rajasthan as a sign of life and abundance. It is the piece an outfit is built around.','German silver, oxidised antique finish','Inner width approx. 12 cm, adjustable rear clasp','Keep dry. Wipe with a soft cloth. Store in a pouch away from moisture.',3,6,true),
('beaded-hasli-set','Beaded Hasli Set','hasli',1499,'Ghungroo bead','Gujarat','Festive and ethnic wear','A hasli paired with matching drops, edged in small ghungroo beads. The beadwork echoes the anklets of folk dance, where sound is part of the ornament. Made to be the centre of a festive look.','German silver, oxidised finish, with beads','Choker inner width approx. 12 cm; drops 3 cm','Keep dry. Wipe gently. Avoid perfume contact on the beads.',2,4,false),
('oxidised-jhumka','Oxidised Jhumka','earrings',749,'Temple bell','South India','Festivals and weddings','The jhumka takes its dome shape from the temple bells of the south. Worn for generations at weddings and festival nights, the small beads along the rim give it a soft movement and chime. A piece that belongs to celebration.','German silver, oxidised antique finish','Dome 2.2 cm, total drop 4 cm; post and back','Keep dry. Wipe with a soft cloth after wear.',3,12,true),
('chandbali','Chandbali','earrings',829,'Crescent moon','Hyderabad','Occasion and bridal wear','Chandbali means moon-shaped. The crescent form travelled with the courts of Hyderabad and became a bridal favourite across India. The tiered crescent catches the light at every angle.','German silver, oxidised finish','Width 3.2 cm, total drop 5 cm','Keep dry. Store flat in a pouch.',2,8,true),
('mirror-work-studs','Mirror-Work Studs','earrings',399,'Sheesha mirror','Kutch','Everyday and casual ethnic','Sheesha, or mirror-work, comes from the embroidery of Kutch, where small mirrors are stitched to catch light and ward off the evil eye. Set into a silver-tone frame, it becomes an everyday stud.','German silver frame with mirror inlay','Diameter 1.2 cm; post and back','Keep dry. Avoid scratching the mirror face.',2,20,false),
('single-oxidised-cuff','Single Oxidised Ear Cuff','ear-cuffs',449,'Filigree','Odisha','Everyday and layering','Filigree, the craft of twisting fine silver wire, has a long home in the workshops of Odisha. This cuff carries that lacework in a form that needs no piercing, clipped to the ear''s edge.','German silver, oxidised finish','Adjustable, fits most; single piece','Reshape gently by hand if needed. Keep dry.',2,15,false),
('chain-linked-ear-cuff','Chain-Linked Ear Cuff','ear-cuffs',549,'Filigree','Kutch','Occasion and statement wear','A cuff joined to a stud by a draping chain, so the ornament follows the curve of the ear. It reads as one continuous piece of silverwork, traditional in finish, modern in how it is worn.','German silver, oxidised finish; one ear','Adjustable cuff; chain drop 4 cm','Keep the chain untangled in a pouch. Keep dry.',2,9,true),
('oxidised-kada','Oxidised Kada','bracelets',899,'Engraved band','Rajasthan','Festive and ethnic wear','The kada is a broad, solid bangle worn as a single statement. The engraved band running its width is the work of Rajasthani hand-chasing, where the pattern is cut into the metal by hand. Weight you feel when you wear it.','German silver, oxidised antique finish','Inner diameter 6.4 cm (size 2-6); openable','Keep dry. Wipe the engraving with a soft brush.',2,7,true),
('adjustable-cuff','Adjustable Cuff','bracelets',649,'Open terminal','Himachal','Everyday and layering','An open cuff with shaped terminals, a form worn in the hill regions where bracelets are passed down rather than clasped. The opening lets one size sit on many wrists.','German silver, oxidised finish','Open cuff, adjustable; fits most','Open and close gently along the existing curve.',2,11,false),
('deity-motif-pendant','Deity Pendant','pendants',699,'Deity relief','Maharashtra','Daily and devotional wear','A small relief pendant of the kind carried in Maharashtra as a daily token of faith. The figure is raised from the metal so its detail holds even as the piece is worn close every day.','German silver, oxidised finish; on a chain','Pendant 2.4 cm; chain 45 cm','Keep dry. The chain detaches for cleaning.',2,14,true),
('coin-pendant','Coin Pendant','pendants',549,'Antique coin','Tamil Nadu','Everyday layering','The kasu, or coin, is a recurring motif of the south, where strings of coins mark prosperity. Here a single embossed coin hangs from a fine chain, an everyday piece with an old reference.','German silver, oxidised finish; on a chain','Coin 2 cm; chain 45 cm','Keep dry. Wipe with a soft cloth.',2,18,false)
on conflict (slug) do nothing;
