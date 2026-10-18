import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/features/auth/server/get-current-user";
import { getDashboard } from "@/features/dashboard/api/get-dashboard";
import DashboardOverview from "@/features/dashboard/components/dashboard-overview";
import { Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ダッシュボード",
};

export default async function DashboardPage() {
  const [dashboard, currentUser] = await Promise.all([getDashboard(), getCurrentUser()]);
  const canCreateRequest = currentUser.roles.includes("USER");

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-bold">今日の業務</h2>
        {canCreateRequest && (
          <Button nativeButton={false} render={<Link href="/requests/new" />}>
            <Plus aria-hidden="true" />
            新規申請を作成
          </Button>
        )}
      </div>
      <DashboardOverview dashboard={dashboard} roles={currentUser.roles} />
    </div>
  );
}
