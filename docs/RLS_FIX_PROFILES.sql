-- Fix recursive policy on profiles by avoiding self-query

drop policy if exists "profiles admin all" on public.profiles;

create policy "profiles admin all" on public.profiles
  for all
  using (
    coalesce((current_setting('request.jwt.claims', true)::jsonb -> 'user_metadata' ->> 'role'), '') = 'admin'
  )
  with check (
    coalesce((current_setting('request.jwt.claims', true)::jsonb -> 'user_metadata' ->> 'role'), '') = 'admin'
  );

