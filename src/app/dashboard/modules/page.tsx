"use client";

import { useMemo } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { DashboardGuard } from "@/components/dashboard/DashboardGuard";
import { useCatalogData } from "@/components/dashboard/useCatalogData";

export default function ModulesPage() {
  const { token, user } = useAuth();
  const role = useMemo(() => (user?.user_metadata as { role?: string })?.role || "unknown", [user]);
  const canManage = role === "admin" || role === "teacher";
  const { courses, error, reload } = useCatalogData(canManage, token || undefined);

  const modules = courses.flatMap((c) =>
    (c.modules || []).map((m) => ({ ...m, courseTitle: c.title, courseId: c.id }))
  );

  return (
    <DashboardGuard>
      <div className="container space-y-4 py-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange">Modules</p>
            <h1 className="text-2xl font-semibold text-charcoal">Daftar Modul</h1>
            <p className="text-sm text-muted">
              {canManage ? "Admin/Guru melihat semua modul." : "Siswa melihat modul published."}
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
          {modules.map((m) => (
            <div key={m.id} className="rounded-2xl bg-white p-4 shadow-card ring-1 ring-line">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-charcoal">{m.title}</h3>
                  <p className="text-[11px] text-muted">Course: {m.courseTitle} (ID: {m.courseId})</p>
                  <p className="text-[11px] text-muted">Module ID: {m.id}</p>
                  <p className="text-xs text-muted">{m.summary}</p>
                </div>
                <div className="text-xs text-muted">
                  Published: {m.is_published ? "Ya" : "Tidak"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardGuard>
  );
}

