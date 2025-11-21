-- Landing page content managed by admin users.
-- Covers hero, courses, about, benefits, newsletter, and CTA blocks in JSON.

create table if not exists public.landing_content (
  slug text primary key,
  content jsonb not null default '{}'::jsonb,
  updated_by uuid references public.profiles(id),
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create unique index if not exists landing_content_slug_idx on public.landing_content(slug);

alter table public.landing_content enable row level security;

-- Public read so landing page can be rendered anonymously.
create policy if not exists "landing content public read" on public.landing_content
  for select using (true);

-- Only admins may insert/update/delete landing content.
create policy if not exists "landing content admin insert" on public.landing_content
  for insert
  with check (auth.uid() in (select id from public.profiles where role = 'admin'));

create policy if not exists "landing content admin update" on public.landing_content
  for update using (auth.uid() in (select id from public.profiles where role = 'admin'))
  with check (auth.uid() in (select id from public.profiles where role = 'admin'));

create policy if not exists "landing content admin delete" on public.landing_content
  for delete using (auth.uid() in (select id from public.profiles where role = 'admin'));

