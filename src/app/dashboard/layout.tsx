import { ReactNode } from "react";
import Link from "next/link";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-ivory">
      <div className="border-b border-line bg-white/80 backdrop-blur">
        <div className="container flex flex-wrap items-center justify-between gap-3 py-4">
          <div className="flex items-center gap-2 text-lg font-semibold text-charcoal">
            <div className="rounded-lg bg-orange px-2 py-1 text-sm text-charcoal">
              ED
            </div>
            Dashboard
          </div>
          <div className="flex flex-wrap gap-3 text-sm font-semibold text-charcoal">
            <Link href="/dashboard" className="underline-offset-4 hover:underline">
              Overview
            </Link>
            <Link href="/dashboard/courses" className="underline-offset-4 hover:underline">
              Courses
            </Link>
            <Link href="/dashboard/modules" className="underline-offset-4 hover:underline">
              Modules
            </Link>
            <Link href="/dashboard/materials" className="underline-offset-4 hover:underline">
              Materials
            </Link>
            <Link href="/dashboard/progress" className="underline-offset-4 hover:underline">
              Progress
            </Link>
            <Link href="/dashboard/landing" className="underline-offset-4 hover:underline">
              Landing CMS
            </Link>
            <Link href="/" className="underline-offset-4 hover:underline text-muted">
              Landing
            </Link>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
