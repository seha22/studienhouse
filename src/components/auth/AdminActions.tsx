"use client";

import { useState } from "react";
import { useAuth } from "./AuthProvider";
import {
  publishModule,
  unpublishModule,
  publishCourse,
  unpublishCourse,
} from "@/lib/api-client";

type Props = {
  sampleCourseId?: string;
  sampleModuleId?: string;
};

export function AdminActions({ sampleCourseId, sampleModuleId }: Props) {
  const { token, user } = useAuth();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const requireToken = () => {
    if (!token) {
      setError("Login dulu sebagai admin/teacher untuk mencoba aksi ini.");
      return false;
    }
    return true;
  };

  async function handle(action: () => Promise<unknown>) {
    setBusy(true);
    setMessage(null);
    setError(null);
    try {
      const res = await action();
      setMessage(JSON.stringify(res));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-3xl bg-white/90 p-4 shadow-card ring-1 ring-line backdrop-blur">
      <h3 className="text-base font-semibold text-charcoal">Admin/Teacher Sandbox</h3>
      <p className="text-xs text-muted">Gunakan token dari login panel. Isi ID course/module untuk mencoba publish/unpublish.</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <button
          className="rounded-pill bg-orange px-4 py-2 text-sm font-semibold text-charcoal disabled:opacity-50"
          disabled={busy}
          onClick={() => {
            if (!requireToken() || !sampleCourseId) return;
            handle(() => publishCourse(sampleCourseId, { token: token! }));
          }}
        >
          Publish course (sample)
        </button>
        <button
          className="rounded-pill bg-cloud px-4 py-2 text-sm font-semibold text-charcoal disabled:opacity-50"
          disabled={busy}
          onClick={() => {
            if (!requireToken() || !sampleCourseId) return;
            handle(() => unpublishCourse(sampleCourseId, { token: token! }));
          }}
        >
          Unpublish course (sample)
        </button>
        <button
          className="rounded-pill bg-orange px-4 py-2 text-sm font-semibold text-charcoal disabled:opacity-50"
          disabled={busy}
          onClick={() => {
            if (!requireToken() || !sampleModuleId) return;
            handle(() => publishModule(sampleModuleId, { token: token! }));
          }}
        >
          Publish module (sample)
        </button>
        <button
          className="rounded-pill bg-cloud px-4 py-2 text-sm font-semibold text-charcoal disabled:opacity-50"
          disabled={busy}
          onClick={() => {
            if (!requireToken() || !sampleModuleId) return;
            handle(() => unpublishModule(sampleModuleId, { token: token! }));
          }}
        >
          Unpublish module (sample)
        </button>
      </div>
      <div className="mt-3 text-xs text-muted">User: {user?.email || "not signed in"}</div>
      {message && <div className="mt-3 rounded-xl bg-mint px-3 py-2 text-xs text-charcoal">{message}</div>}
      {error && <div className="mt-2 rounded-xl bg-red-100 px-3 py-2 text-xs text-red-700">{error}</div>}
    </div>
  );
}

