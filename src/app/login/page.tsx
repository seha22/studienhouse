"use client";

import { AuthPanel } from "@/components/auth/AuthPanel";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="container flex min-h-[70vh] items-center justify-center py-12">
      <div className="w-full max-w-2xl space-y-4">
        <div className="text-center space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange">Login</p>
          <h1 className="text-3xl font-semibold text-charcoal">Masuk ke Dashboard</h1>
          <p className="text-sm text-muted">
            Gunakan akun admin/guru/siswa untuk mengelola kursus dan melihat progres.
          </p>
        </div>
        <AuthPanel />
        <div className="text-center text-xs text-muted">
          Belum ingin masuk? <Link href="/" className="underline">Kembali ke landing</Link>
        </div>
      </div>
    </div>
  );
}

