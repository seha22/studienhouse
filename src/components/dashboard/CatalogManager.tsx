"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  fetchCatalog,
  publishCourse,
  unpublishCourse,
  publishModule,
  unpublishModule,
  uploadMaterial,
  updateProgress,
} from "@/lib/api-client";

type Material = {
  id: string;
  title: string;
  material_type: string;
  url?: string | null;
  storage_path?: string | null;
};

type Module = {
  id: string;
  title: string;
  summary?: string | null;
  order_index?: number | null;
  duration_minutes?: number | null;
  materials?: Material[];
};

type Course = {
  id: string;
  title: string;
  category: string;
  mode: string;
  level: string | null;
  description: string | null;
  modules?: Module[];
};

type Status = "not_started" | "in_progress" | "done";

export function CatalogManager() {
  const { token, user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [uploadState, setUploadState] = useState<string | null>(null);
  const [progressState, setProgressState] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("in_progress");
  const [score, setScore] = useState<string>("");

  const canManage = useMemo(() => {
    if (!user || !token) return false;
    // Optional lightweight check using user metadata role if present
    const role = (user.user_metadata as { role?: string })?.role;
    if (role && (role === "student")) return false;
    return true;
  }, [user, token]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchCatalog(canManage, { token: token || undefined });
      setCourses((res as { courses: Course[] }).courses || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load catalog");
    } finally {
      setLoading(false);
    }
  }, [canManage, token]);

  useEffect(() => {
    load();
  }, [load]);

  async function toggleCourse(courseId: string, publish: boolean) {
    if (!token) return setError("Login dulu untuk mengelola publish.");
    setBusyId(courseId);
    try {
      if (publish) await publishCourse(courseId, { token });
      else await unpublishCourse(courseId, { token });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action error");
    } finally {
      setBusyId(null);
    }
  }

  async function toggleModule(moduleId: string, publish: boolean) {
    if (!token) return setError("Login dulu untuk mengelola publish.");
    setBusyId(moduleId);
    try {
      if (publish) await publishModule(moduleId, { token });
      else await unpublishModule(moduleId, { token });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action error");
    } finally {
      setBusyId(null);
    }
  }

  async function handleUpload(moduleId: string, file?: File, title?: string) {
    if (!token) return setError("Login dulu untuk upload.");
    if (!file || !title) return;
    setUploadState(moduleId);
    try {
      await uploadMaterial(file, { moduleId, title, materialType: "file" }, { token });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload error");
    } finally {
      setUploadState(null);
    }
  }

  async function handleProgress(moduleId: string) {
    if (!token || !user) return setError("Login sebagai siswa/admin untuk update progres.");
    setProgressState(moduleId);
    try {
      await updateProgress(
        { studentId: user.id, moduleId, status, score: score ? Number(score) : undefined },
        { token }
      );
      setScore("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Progress error");
    } finally {
      setProgressState(null);
    }
  }

  if (loading) {
    return (
      <div className="rounded-3xl bg-white/80 p-4 text-sm text-muted shadow-card">
        Memuat katalog...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-charcoal">Katalog Kursus</h3>
        <button
          onClick={load}
          className="text-sm font-semibold text-charcoal underline"
        >
          Refresh
        </button>
      </div>
      {error && <div className="rounded-xl bg-red-100 px-3 py-2 text-sm text-red-700">{error}</div>}
      <div className="space-y-1 text-xs text-muted">
        <div>Access: {user?.email || "anon"} {canManage ? "(manage enabled)" : "(read-only)"}</div>
        <div className="text-[11px]">Gunakan bearer token dari login panel; admin/teacher bisa lihat unpublished.</div>
      </div>
      <div className="space-y-4">
        {courses.map((course) => (
          <div
            key={course.id}
            className="rounded-3xl bg-white p-4 shadow-card ring-1 ring-line"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h4 className="text-base font-semibold text-charcoal">{course.title}</h4>
                <p className="text-[11px] text-muted">ID: {course.id}</p>
                <p className="text-xs text-muted">{course.description}</p>
              </div>
              {canManage && (
                <div className="flex gap-2 text-xs">
                  <button
                    disabled={busyId === course.id}
                    onClick={() => toggleCourse(course.id, true)}
                    className="rounded-pill bg-orange px-3 py-1 font-semibold text-charcoal disabled:opacity-50"
                  >
                    Publish
                  </button>
                  <button
                    disabled={busyId === course.id}
                    onClick={() => toggleCourse(course.id, false)}
                    className="rounded-pill bg-cloud px-3 py-1 font-semibold text-charcoal disabled:opacity-50"
                  >
                    Unpublish
                  </button>
                </div>
              )}
            </div>
            <div className="mt-3 space-y-3">
              {(course.modules || []).map((mod) => (
                <div
                  key={mod.id}
                  className="rounded-2xl border border-line bg-cloud/60 p-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="text-sm font-semibold text-charcoal">{mod.title}</div>
                      <div className="text-[11px] text-muted">ID: {mod.id}</div>
                      <div className="text-xs text-muted">{mod.summary}</div>
                    </div>
                    {canManage && (
                      <div className="flex gap-2 text-xs">
                        <button
                          disabled={busyId === mod.id}
                          onClick={() => toggleModule(mod.id, true)}
                          className="rounded-pill bg-orange px-3 py-1 font-semibold text-charcoal disabled:opacity-50"
                        >
                          Publish
                        </button>
                        <button
                          disabled={busyId === mod.id}
                          onClick={() => toggleModule(mod.id, false)}
                          className="rounded-pill bg-cloud px-3 py-1 font-semibold text-charcoal disabled:opacity-50"
                        >
                          Unpublish
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Upload material */}
                  {canManage && (
                    <UploadBox
                      moduleId={mod.id}
                      busy={uploadState === mod.id}
                      onUpload={handleUpload}
                    />
                  )}

                  {/* Progress tracker */}
                  {user && (
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as Status)}
                        className="rounded-lg border border-line px-2 py-1 text-sm"
                      >
                        <option value="not_started">Belum mulai</option>
                        <option value="in_progress">Sedang belajar</option>
                        <option value="done">Selesai</option>
                      </select>
                      <input
                        type="number"
                        step="0.1"
                        placeholder="Skor (opsional)"
                        value={score}
                        onChange={(e) => setScore(e.target.value)}
                        className="w-32 rounded-lg border border-line px-2 py-1 text-sm"
                      />
                      <button
                        disabled={progressState === mod.id}
                        onClick={() => handleProgress(mod.id)}
                        className="rounded-pill bg-charcoal px-3 py-1 font-semibold text-ivory disabled:opacity-50"
                      >
                        Update progres
                      </button>
                    </div>
                  )}

                  {mod.materials && mod.materials.length > 0 && (
                    <ul className="mt-2 space-y-1 text-xs text-muted">
                      {mod.materials.map((mat) => (
                        <li key={mat.id} className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-orange"></span>
                          <a
                            href={mat.url || "#"}
                            className="text-charcoal underline"
                            target="_blank"
                            rel="noreferrer"
                          >
                            {mat.title}
                          </a>
                          <span className="text-[11px] text-muted">({mat.material_type})</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function UploadBox({
  moduleId,
  busy,
  onUpload,
}: {
  moduleId: string;
  busy: boolean;
  onUpload: (moduleId: string, file?: File, title?: string) => void;
}) {
  const [file, setFile] = useState<File | undefined>(undefined);
  const [title, setTitle] = useState<string>("");

  return (
    <div className="mt-3 rounded-xl bg-white px-3 py-2 shadow-pill ring-1 ring-line">
      <div className="text-xs font-semibold text-charcoal">Upload materi</div>
      <div className="mt-2 flex flex-wrap gap-2 text-xs">
        <input
          type="text"
          placeholder="Judul"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="min-w-[160px] flex-1 rounded-lg border border-line px-2 py-1"
        />
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0])}
          className="text-xs"
        />
        <button
          disabled={busy}
          onClick={() => onUpload(moduleId, file, title)}
          className="rounded-pill bg-orange px-3 py-1 font-semibold text-charcoal disabled:opacity-50"
        >
          {busy ? "Uploading..." : "Upload"}
        </button>
      </div>
    </div>
  );
}
