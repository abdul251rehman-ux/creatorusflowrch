-- ============================================================
-- CreatorFlowUS Blog Schema
-- Run this in Supabase: Dashboard → SQL Editor → New Query
-- ============================================================

-- 1. Admin PIN table (single row, id always = 1)
create table if not exists admin_pin (
  id  integer primary key default 1,
  pin text    not null,
  constraint admin_pin_single_row check (id = 1)
);

-- Seed the default PIN (change '1234' to your desired PIN before running)
insert into admin_pin (id, pin) values (1, '1234')
  on conflict (id) do nothing;

-- RLS: block all public access — only service role key can read this table
alter table admin_pin enable row level security;

-- 2. Blogs table
create table if not exists blogs (
  id          uuid          default gen_random_uuid() primary key,
  title       text          not null,
  slug        text          unique not null,
  excerpt     text,
  content     text          not null default '',
  cover_image text,
  author      text          default 'CreatorFlowUS Team',
  category    text,
  tags        text[]        default '{}',
  published   boolean       default false,
  read_time   integer       default 1,
  created_at  timestamptz   default now(),
  updated_at  timestamptz   default now()
);

-- 2. Auto-update updated_at on row change
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists blogs_updated_at on blogs;
create trigger blogs_updated_at
  before update on blogs
  for each row execute function update_updated_at();

-- 3. Row-Level Security
alter table blogs enable row level security;

-- Public visitors can only read published posts
create policy "Public read published blogs"
  on blogs for select
  using (published = true);

-- Service role key bypasses RLS automatically (used by admin API routes)

-- 4. Storage bucket for blog cover images
insert into storage.buckets (id, name, public)
  values ('blog-images', 'blog-images', true)
  on conflict (id) do nothing;

-- Allow anyone to view images (bucket is public)
create policy "Public read blog images"
  on storage.objects for select
  using (bucket_id = 'blog-images');

-- Allow uploads (service role handles this via API routes)
create policy "Allow image uploads"
  on storage.objects for insert
  with check (bucket_id = 'blog-images');

create policy "Allow image deletes"
  on storage.objects for delete
  using (bucket_id = 'blog-images');

-- ============================================================
-- After running the above, update your .env.local:
--
--   NEXT_PUBLIC_SUPABASE_URL   = https://xxxx.supabase.co
--   NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJ...
--   SUPABASE_SERVICE_ROLE_KEY  = eyJ...
--
-- PIN is now stored in the admin_pin table (no env var needed).
-- To change the PIN: Supabase Dashboard → Table Editor → admin_pin → edit row 1
--
-- Get these from: Supabase Dashboard → Settings → API
-- ============================================================
