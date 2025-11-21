## Supabase Schema Draft (MCP-integrated)

Target: roles admin, teacher, student. Storage for materials. Designed for App Router + MCP agents calling Supabase RPC.

### 1) Enum & Common
```sql
-- Roles
create type user_role as enum ('admin', 'teacher', 'student');

-- Users (auth.users holds auth); this table stores profile & role
create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  role user_role not null default 'student',
  full_name text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

### 2) Core Domain Tables
```sql
-- Courses (Matematika SD/SMP/SMA, Programming)
create table public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,     -- e.g., math-sd, math-smp, math-sma, programming
  mode text not null,         -- online, offline, hybrid
  level text,                 -- optional detail (pemula, lanjutan)
  description text,
  created_by uuid references public.profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Modules (per course)
create table public.modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  summary text,
  order_index int not null default 1,
  duration_minutes int,
  created_by uuid references public.profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Materials (file or link)
create table public.materials (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.modules(id) on delete cascade,
  title text not null,
  material_type text not null, -- pdf, video, link, quiz
  url text,                    -- storage public url or external
  storage_path text,           -- if using Supabase storage bucket
  created_by uuid references public.profiles(id),
  created_at timestamptz default now()
);

-- Progress per student per module
create table public.progress (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  module_id uuid not null references public.modules(id) on delete cascade,
  status text not null default 'not_started', -- not_started, in_progress, done
  score numeric(5,2),
  last_viewed_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (student_id, module_id)
);

-- Sessions / schedule (online/offline)
create table public.sessions (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  mentor_id uuid references public.profiles(id),
  starts_at timestamptz not null,
  ends_at timestamptz,
  mode text not null,           -- online/offline/hybrid
  location text,                -- link zoom atau alamat
  created_at timestamptz default now()
);
```

### 3) Storage
- Bucket `materials`: public read OR signed URLs; write restricted to `teacher` and `admin`.
- Store `storage_path` in `materials`, derive public URL with `supabase.storage` in app.

### 4) RLS Policies (high-level)
Enable RLS on all tables; examples:
```sql
-- profiles: users manage own profile
alter table public.profiles enable row level security;
create policy "profiles self select" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles self update" on public.profiles
  for update using (auth.uid() = id);
create policy "profiles admin all" on public.profiles
  for all using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

-- courses: admin full, teacher can read; (optionally allow teacher create)
alter table public.courses enable row level security;
create policy "courses admin all" on public.courses
  for all using (auth.uid() in (select id from public.profiles where role = 'admin'));
create policy "courses teacher read" on public.courses
  for select using (auth.uid() in (select id from public.profiles where role in ('teacher','admin')));
create policy "courses public read" on public.courses
  for select using (true); -- if catalog is public

-- modules: admin all, teacher read/create own, students read
alter table public.modules enable row level security;
create policy "modules admin all" on public.modules
  for all using (auth.uid() in (select id from public.profiles where role='admin'));
create policy "modules teacher insert own" on public.modules
  for insert with check (auth.uid() in (select id from public.profiles where role='teacher') and created_by = auth.uid());
create policy "modules teacher update own" on public.modules
  for update using (created_by = auth.uid())
  with check (created_by = auth.uid());
create policy "modules any read" on public.modules
  for select using (true);

-- materials: admin all, teacher own, students read
alter table public.materials enable row level security;
create policy "materials admin all" on public.materials
  for all using (auth.uid() in (select id from public.profiles where role='admin'));
create policy "materials teacher insert own" on public.materials
  for insert with check (auth.uid() in (select id from public.profiles where role='teacher') and created_by = auth.uid());
create policy "materials teacher update own" on public.materials
  for update using (created_by = auth.uid())
  with check (created_by = auth.uid());
create policy "materials read" on public.materials
  for select using (true);

-- progress: student owns their rows, admin read/all
alter table public.progress enable row level security;
create policy "progress student select" on public.progress
  for select using (student_id = auth.uid());
create policy "progress student upsert" on public.progress
  for insert with check (student_id = auth.uid());
create policy "progress student update" on public.progress
  for update using (student_id = auth.uid())
  with check (student_id = auth.uid());
create policy "progress admin all" on public.progress
  for all using (auth.uid() in (select id from public.profiles where role='admin'));

-- sessions: admin all, teacher own, students read
alter table public.sessions enable row level security;
create policy "sessions admin all" on public.sessions
  for all using (auth.uid() in (select id from public.profiles where role='admin'));
create policy "sessions teacher insert own" on public.sessions
  for insert with check (auth.uid() in (select id from public.profiles where role='teacher' or role='admin'));
create policy "sessions teacher update own" on public.sessions
  for update using (mentor_id = auth.uid() or auth.uid() in (select id from public.profiles where role='admin'))
  with check (mentor_id = auth.uid() or auth.uid() in (select id from public.profiles where role='admin'));
create policy "sessions read" on public.sessions
  for select using (true);
```

### 5) Recommended Indexes
- `modules(course_id, order_index)`
- `materials(module_id)`
- `progress(student_id, module_id)`
- `sessions(course_id, starts_at)`

### 6) MCP Touchpoints
- RPC example for publishing a module and creating default progress rows:
```sql
create or replace function public.publish_module(p_module_id uuid)
returns void
language plpgsql security definer as $$
begin
  update public.modules set updated_at = now() where id = p_module_id;
  insert into public.progress (student_id, module_id, status)
  select p.id, p_module_id, 'not_started'
  from public.profiles p
  where p.role = 'student'
  on conflict (student_id, module_id) do nothing;
end;
$$;
```
- MCP agent can call this RPC after guru/admin menekan tombol “Publish”.

### 7) Seed Suggestions
- 3 courses matematika (SD/SMP/SMA), 2 programming (Pemula, Web Dasar).
- 6–10 modules per course; 2 materials per module (pdf + video/link).
- 10 siswa dummy untuk uji progres.

Setelah skema ini disetujui, langkah berikut: terapkan migrations (SQL), tambah RLS untuk storage bucket, dan hubungkan API layer (Supabase JS) di Next.js sesuai peran.

### 8) Landing Page Content
- Table: `landing_content` (slug PK, content JSONB, created_at, updated_at, updated_by ref profiles).
- RLS: public `select`; `insert/update/delete` dibatasi admin (`profiles.role = 'admin'`).
- Gunakan slug `main` sebagai landing aktif. Struktur JSON mengikuti tipe `LandingContent` di app (hero, popularCourses, about, whyChoose, newsletter, cta). Konten default tetap ada di kode; Supabase row mengoverride jika tersedia.
