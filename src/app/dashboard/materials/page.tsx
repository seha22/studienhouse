"use client";

import { useMemo } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { DashboardGuard } from "@/components/dashboard/DashboardGuard";
import { useCatalogData } from "@/components/dashboard/useCatalogData";

export default function MaterialsPage() {
  const { token, user } = useAuth();
  const role = useMemo(() => (user?.user_metadata as { role?: string })?.role || "unknown", [user]);
  const canManage = role === "admin" || role === "teacher";
  const { courses, error, reload } = useCatalogData(canManage, token || undefined);

  const materials = courses.flatMap((c) =>
    (c.modules || []).flatMap((m) =>
      (m.materials || []).map((mat) => ({
        ...mat,
        moduleTitle: m.title,
        moduleId: m.id,
        courseTitle: c.title,
        courseId: c.id,
      }))
    )
  );

  return (
    <DashboardGuard>
      <div className="container space-y-4 py-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange">Materials</p>
            <h1 className="text-2xl font-semibold text-charcoal">Daftar Materi</h1>
            <p className="text-sm text-muted">
              {canManage ? "Admin/Guru akses materi lengkap." : "Siswa lihat materi published."}
            </p>
          </div>
          <button
            onClick={reload}
            className="rounded-pill bg-cloud px-3 py-1 text-sm font-semibold text-charcoal"
          >
            Refresh
          </button>
        </div>
        {error && <div className="rounded-xl bg-red-100 px-3 py-2 text-sm text-red-700">{error}</div>}
        <div className="grid gap-3">
          {materials.map((mat) => (
            <div key={mat.id} className="rounded-2xl bg-white p-4 shadow-card ring-1 ring-line">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-base font-semibold text-charcoal">{mat.title}</h3>
                  <p className="text-[11px] text-muted">
                    Course: {mat.courseTitle} (ID: {mat.courseId}) | Module: {mat.moduleTitle} (ID: {mat.moduleId})
                  </p>
                  <p className="text-[11px] text-muted">Material ID: {mat.id}</p>
                  {mat.url && (
                    <a
                      href={mat.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-semibold text-orange underline"
                    >
                      Buka materi
                    </a>
                  )}
                </div>
                <div className="text-xs text-muted">Type: {mat.material_type}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardGuard>
  );
}

