-- Seed template: replace placeholders with real auth.user IDs
-- Before running, create users via Supabase Auth and capture their UUIDs.

-- Replace these values
-- :ADMIN_USER_ID
-- :TEACHER_MATH_ID
-- :TEACHER_PROG_ID
-- :STUDENT_A_ID
-- :STUDENT_B_ID

insert into public.profiles (id, role, full_name)
values
  ('%ADMIN_USER_ID%', 'admin', 'Admin MatProg'),
  ('%TEACHER_MATH_ID%', 'teacher', 'Guru Matematika'),
  ('%TEACHER_PROG_ID%', 'teacher', 'Mentor Programming'),
  ('%STUDENT_A_ID%', 'student', 'Siswa A'),
  ('%STUDENT_B_ID%', 'student', 'Siswa B');

-- Courses
insert into public.courses (title, category, mode, level, description, created_by, is_published)
values
  ('Matematika SD', 'math-sd', 'hybrid', 'dasar', 'Numerasi dasar untuk SD', '%ADMIN_USER_ID%', true),
  ('Matematika SMP', 'math-smp', 'online', 'menengah', 'Aljabar & geometri', '%ADMIN_USER_ID%', true),
  ('Matematika SMA', 'math-sma', 'hybrid', 'lanjutan', 'Persiapan AKM/UTBK', '%ADMIN_USER_ID%', true),
  ('Programming Pemula', 'programming', 'online', 'pemula', 'Logika & web dasar', '%TEACHER_PROG_ID%', true),
  ('Programming Web Dasar', 'programming', 'online', 'pemula', 'HTML/CSS/JS projek pertama', '%TEACHER_PROG_ID%', true);

-- Example modules (attach to course ids after creation if needed)
-- insert into public.modules (course_id, title, summary, order_index, created_by, is_published)
-- values ('<course_uuid>', 'Aljabar Linear', 'Konsep dasar dan latihan', 1, '%TEACHER_MATH_ID%', true);

