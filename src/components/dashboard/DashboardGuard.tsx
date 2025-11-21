"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";

type Props = {
  children: ReactNode;
  roles?: Array<"admin" | "teacher" | "student">;
  redirectTo?: string;
};

export function DashboardGuard({
  children,
  roles = ["admin", "teacher", "student"],
  redirectTo = "/login",
}: Props) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace(redirectTo);
        return;
      }
      const metaRole = (user.user_metadata as { role?: string })?.role;
      if (metaRole && !roles.includes(metaRole as typeof roles[number])) {
        router.replace(redirectTo);
      }
    }
  }, [user, loading, router, roles, redirectTo]);

  if (!user) {
    return (
      <div className="container py-12 text-center text-sm text-muted">
        Mengalihkan ke halaman login...
      </div>
    );
  }
  return <>{children}</>;
}
