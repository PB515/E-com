-- Bucket 4 (Slice 1) — admin-managed Categories (replace the hardcoded 5).
-- Run in Supabase: SQL Editor -> New query -> paste -> Run.
--
-- Seeds the existing 5 categories so the live store is unchanged, then swaps the
-- hardcoded products.category CHECK for a foreign key to this table (so adding a
-- 6th category no longer needs a code/DB change, and a category in use can't be
-- deleted out from under its products).

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  blurb text,                         -- short tagline on cards / nav
  description text,                   -- longer intro on the category page
  image_url text,
  seo_title text,
  seo_description text,
  is_active boolean not null default true,     -- master on/off
  show_in_nav boolean not null default true,
  show_on_home boolean not null default true,
  show_in_footer boolean not null default true,
  nav_order int not null default 0,
  home_order int not null default 0,
  footer_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists categories_active_idx on public.categories (is_active);
alter table public.categories enable row level security;
create policy "categories_public_read" on public.categories for select using (true);
create policy "categories_admin_all"   on public.categories for all using (public.is_admin()) with check (public.is_admin());

-- seed the existing five (slugs/names/blurbs/intros mirror lib/catalog.ts)
insert into public.categories (slug,name,blurb,description,nav_order,home_order,footer_order) values
 ('hasli','Hasli','Statement neckpieces','Rigid silver-tone neckpieces that sit at the collarbone. The piece an outfit is built around.',1,1,1),
 ('earrings','Earrings','Jhumkas, chandbalis, studs','From temple-bell jhumkas to crescent chandbalis. The everyday and the occasion, in oxidised silver tone.',2,2,2),
 ('ear-cuffs','Ear Cuffs','Single and chain-linked','No piercing needed. A modern way to wear a traditional finish, single or chain-linked.',3,3,3),
 ('bracelets','Bracelets','Kadas and cuffs','Engraved kadas and adjustable cuffs. Weight and detail you can feel on the wrist.',4,4,4),
 ('pendants','Pendants','Deity and coin motifs','Small pieces that carry a motif close. Deity and antique-coin reliefs on a fine chain.',5,5,5)
on conflict (slug) do nothing;

-- swap the hardcoded CHECK for a slug foreign key (update cascades a rename;
-- delete is restricted, so a category with products can't be removed)
alter table public.products drop constraint if exists products_category_check;
alter table public.products drop constraint if exists products_category_fkey;
alter table public.products add constraint products_category_fkey
  foreign key (category) references public.categories(slug) on update cascade;
