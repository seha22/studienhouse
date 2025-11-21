## API Flow (Next.js App Router)

Semua contoh menggunakan Supabase client dari `src/lib/supabase/server.ts`.

### Endpoints
- `GET /api/catalog`  
  - Mengembalikan daftar courses + modules + materials. Default hanya item `is_published = true`. Tambahkan `?all=1` + bearer token admin/teacher untuk melihat unpublished.

- `POST /api/courses/:id/publish` / `POST /api/courses/:id/unpublish`  
  - Toggle publish course. Hanya admin.

- `POST /api/modules/:id/publish`  
  - Memanggil RPC `publish_module(p_module_id)` untuk memperbarui modul & membuat progres siswa.  
  - Wajib bearer token; hanya admin/teacher (diverifikasi via `requireAuthRole`). Juga menandai `modules.is_published = true`.

- `POST /api/modules/:id/unpublish`  
  - Menonaktifkan modul (set `is_published=false`). Wajib bearer token admin/teacher.

- `PUT /api/progress`  
  - Body: `{ studentId, moduleId, status, score? }`  
  - Upsert progres siswa. Wajib bearer token; student hanya boleh menulis miliknya, admin boleh semua (teacher opsional).

- `POST /api/materials`  
  - Body JSON: `{ moduleId, title, materialType, storagePath?, url? }`.  
  - Wajib bearer token admin/teacher. Menambah record material (storage sudah di-upload terpisah).

- `POST /api/materials/upload`  
  - FormData: `file`, `moduleId`, `title`, optional `materialType`.  
  - Upload ke bucket `materials`, lalu insert record `materials` dengan `storage_path` & `publicUrl`.

### Auth & Keamanan
- Tidak ada middleware global; setiap route sensitif memeriksa bearer token + role via `requireAuthRole` (`src/lib/auth.ts`).
- Jangan expose `SUPABASE_SERVICE_ROLE_KEY` ke client; hanya gunakan di server-side.

### Client helpers
- `src/lib/api-client.ts` menyediakan helper fetch (catalog, publish/unpublish module, update progress, upload material) yang menerima bearer token bila diperlukan.

### Env yang dibutuhkan
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only)

### Upload material
- Gunakan bucket `materials` yang sudah dibuat.  
- Client upload → `supabase.storage.from("materials").upload(...)` lalu simpan `storage_path`/`url` ke tabel `materials`.
