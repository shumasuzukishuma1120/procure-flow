import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import MyRecentRequestsTable from "@/features/dashboard/components/my-recent-requests-table";
import MyRequestStatusSummary from "@/features/dashboard/components/my-request-status-summary";
import type { MyRequestsDashboard } from "@/features/dashboard/types";
import { ArrowRight, FileText } from "lucide-react";
import Link from "next/link";

type MyRequestsDashboardSectionProps = {
  dashboard: MyRequestsDashboard;
};

export default function MyRequestsDashboardSection({
  dashboard,
}: MyRequestsDashboardSectionProps) {
  return (
    <section aria-labelledby="my-requests-heading">
      <Card>
        <CardHeader>
          <CardTitle id="my-requests-heading" className="flex items-center gap-2 text-lg">
            <FileText className="size-5 text-blue-600" aria-hidden="true" />
            自分の申請
          </CardTitle>
          <CardDescription>ステータス別の件数と最近更新された申請</CardDescription>
          <CardAction>
            <Button
              variant="link"
              size="sm"
              nativeButton={false}
              render={<Link href="/requests" />}
            >
              すべて見る
              <ArrowRight aria-hidden="true" />
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="space-y-6">
          <MyRequestStatusSummary statusCounts={dashboard.statusCounts} />
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">最近の申請</h3>
            <MyRecentRequestsTable requests={dashboard.recentRequests} />
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
