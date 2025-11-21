"use client";

import { useMemo } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { DashboardGuard } from "@/components/dashboard/DashboardGuard";
import { useCatalogData } from "@/components/dashboard/useCatalogData";

export default function CoursesPage() {
  const { token, user } = useAuth();
  const role = useMemo(() => (user?.user_metadata as { role?: string })?.role || "unknown", [user]);
  const canManage = role === "admin" || role === "teacher";
  const { courses, error, reload } = useCatalogData(canManage, token || undefined);

  return (
    <DashboardGuard>
      <div className="container space-y-4 py-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange">Courses</p>
            <h1 className="text-2xl font-semibold text-charcoal">Daftar Kursus</h1>
            <p className="text-sm text-muted">
              {canManage ? "Admin/Guru melihat semua kursus termasuk unpublished." : "Siswa melihat kursus published."}
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
          {courses.map((c) => (
            <div key={c.id} className="rounded-2xl bg-white p-4 shadow-card ring-1 ring-line">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-charcoal">{c.title}</h3>
                  <p className="text-[11px] text-muted">ID: {c.id}</p>
                  <p className="text-xs text-muted">{c.description}</p>
                </div>
                <div className="text-xs text-muted">
                  Mode: {c.mode} | Level: {c.level || "-"}
                  <br />
                  Published: {c.is_published ? "Ya" : "Tidak"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardGuard>
  );
}

