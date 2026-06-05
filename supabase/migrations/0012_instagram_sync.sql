-- Instagram auto-sync (Meta Graph API). Lets synced posts coexist with manual
-- ones and be de-duplicated on re-sync by their Instagram media id.
-- Run in Supabase: SQL Editor -> New query -> paste -> Run.

alter table public.instagram_posts add column if not exists ig_media_id text;
-- partial unique: many manual posts can have NULL, but each IG media id is unique
create unique index if not exists instagram_posts_ig_media_id_key
  on public.instagram_posts (ig_media_id) where ig_media_id is not null;
alter table public.instagram_posts add column if not exists source text not null default 'manual';
