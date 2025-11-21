"use client";

import { useMemo } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { AdminActions } from "@/components/auth/AdminActions";
import { CatalogManager } from "@/components/dashboard/CatalogManager";
import { DashboardGuard } from "@/components/dashboard/DashboardGuard";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useAuth();
  const role = useMemo(() => {
    const r = (user?.user_metadata as { role?: string })?.role;
    return r || "unknown";
  }, [user]);
  const isStudent = role === "student";

  return (
    <DashboardGuard>
      <div className="container space-y-6 py-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange">Dashboard</p>
            <h1 className="text-3xl font-semibold text-charcoal">Kursus Matematika & Programming</h1>
            <p className="text-sm text-muted">
              Akses katalog, materi, dan progres belajar. Peran: {role}.
            </p>
          </div>
          <div className="rounded-pill bg-cloud px-3 py-2 text-sm text-charcoal">
            Role: {role}
          </div>
        </div>

        {!isStudent && (
          <div className="rounded-3xl bg-white/80 p-4 shadow-card ring-1 ring-line">
            <AdminActions />
          </div>
        )}

        <div className="rounded-3xl bg-white p-4 shadow-card ring-1 ring-line">
          <CatalogManager />
        </div>

        <div className="text-xs text-muted">
          Kembali ke <Link href="/" className="underline">Landing</Link>
        </div>
      </div>
    </DashboardGuard>
  );
}
