import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DashboardMetric from "@/features/dashboard/components/dashboard-metric";
import DashboardWorkQueueTable from "@/features/dashboard/components/dashboard-work-queue-table";
import type { ApprovalsDashboard } from "@/features/dashboard/types";
import { ArrowRight, Clock3, TriangleAlert } from "lucide-react";
import Link from "next/link";

type ApprovalsDashboardSectionProps = {
  dashboard: ApprovalsDashboard;
};

export default function ApprovalsDashboardSection({
  dashboard,
}: ApprovalsDashboardSectionProps) {
  return (
    <section aria-labelledby="pending-approvals-heading">
      <Card>
        <CardHeader>
          <CardTitle id="pending-approvals-heading" className="flex items-center gap-2 text-lg">
            <Clock3 className="size-5 text-orange-600" aria-hidden="true" />
            承認待ち
          </CardTitle>
          <CardDescription>対応が必要な承認依頼</CardDescription>
          <CardAction>
            <Button
              variant="link"
              size="sm"
              nativeButton={false}
              render={<Link href="/approvals" />}
            >
              すべて見る
              <ArrowRight aria-hidden="true" />
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="space-y-6">
          <dl className="grid gap-3 sm:grid-cols-2">
            <DashboardMetric
              label="承認待ちの申請"
              count={dashboard.pendingCount}
              icon={Clock3}
              tone="blue"
            />
            <DashboardMetric
              label="期限超過"
              count={dashboard.overdueCount}
              icon={TriangleAlert}
              tone="orange"
            />
          </dl>
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">申請日が古い承認待ち</h3>
            <DashboardWorkQueueTable
              requests={dashboard.oldestRequests}
              caption="申請日が古い承認待ち一覧"
              emptyMessage="承認待ちの申請はありません。"
              detailBasePath="/approvals"
            />
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
