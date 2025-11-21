"use client";

import { DashboardGuard } from "@/components/dashboard/DashboardGuard";
import { LandingContentEditor } from "@/components/dashboard/LandingContentEditor";

export default function LandingCMSPage() {
  return (
    <DashboardGuard roles={["admin"]}>
      <div className="container space-y-6 py-8">
        <div className="rounded-3xl bg-white p-5 shadow-card ring-1 ring-line">
          <LandingContentEditor />
        </div>
      </div>
    </DashboardGuard>
  );
}
