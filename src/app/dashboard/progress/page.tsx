"use client";

import { useMemo } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { DashboardGuard } from "@/components/dashboard/DashboardGuard";
import { supabaseClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

type ProgressRow = {
  id: string;
  status: string;
  score: number | null;
  module_id: string;
  module?: {
    title: string;
    course?: { title: string; id: string };
  };
};

export default function ProgressPage() {
  const { user } = useAuth();
  const role = useMemo(() => (user?.user_metadata as { role?: string })?.role || "unknown", [user]);
  const isAdmin = role === "admin";
  const [rows, setRows] = useState<ProgressRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!user) return;
      setLoading(true);
      setError(null);
      const studentId = user.id;
      let query = supabaseClient.from("progress").select(
        `
          id,
          status,
          score,
          module_id,
          module:modules(
            title,
            course:courses(
              id,
              title
            )
          )
        `
      );
      if (!isAdmin) {
        query = query.eq("student_id", studentId);
      }
      const { data, error } = await query;
      if (error) {
        setError(error.message);
      } else {
        const mapped = (data || []).map((row: Record<string, unknown>) => ({
          id: row.id as string,
          status: row.status as string,
          score: row.score as number | null,
          module_id: row.module_id as string,
          module: row.module
            ? {
                title: (row.module as Record<string, unknown>).title as string,
                course: Array.isArray((row.module as { course?: unknown[] }).course)
                  ? (((row.module as { course?: unknown[] }).course?.[0] ?? undefined) as { id: string; title: string })
                  : ((row.module as Record<string, unknown>).course as { id: string; title: string } | undefined),
              }
            : undefined,
        })) as ProgressRow[];
        setRows(mapped);
      }
      setLoading(false);
    }
    load();
  }, [user, isAdmin]);

  return (
    <DashboardGuard roles={["admin", "student"]}>
      <div className="container space-y-4 py-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange">Progress</p>
            <h1 className="text-2xl font-semibold text-charcoal">Progres Belajar</h1>
            <p className="text-sm text-muted">
              {isAdmin ? "Admin melihat progres semua siswa." : "Siswa melihat progres miliknya sendiri."}
            </p>
          </div>
        </div>
        {loading && <div className="rounded-xl bg-cloud px-3 py-2 text-sm text-muted">Memuat...</div>}
        {error && <div className="rounded-xl bg-red-100 px-3 py-2 text-sm text-red-700">{error}</div>}
        <div className="grid gap-3">
          {rows.map((row) => (
            <div key={row.id} className="rounded-2xl bg-white p-4 shadow-card ring-1 ring-line">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-charcoal">{row.module?.title || "Module"}</h3>
                  <p className="text-[11px] text-muted">
                    Course: {row.module?.course?.title || "-"} (Module ID: {row.module_id})
                  </p>
                </div>
                <div className="text-xs text-muted">
                  Status: {row.status} {row.score !== null ? `| Score: ${row.score}` : ""}
                </div>
              </div>
            </div>
          ))}
          {!loading && rows.length === 0 && (
            <div className="rounded-xl bg-cloud px-3 py-2 text-sm text-muted">
              Belum ada progres tercatat.
            </div>
          )}
        </div>
      </div>
    </DashboardGuard>
  );
}
