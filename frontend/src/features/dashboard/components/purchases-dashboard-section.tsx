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
import type { PurchasesDashboard } from "@/features/dashboard/types";
import { ArrowRight, PackageCheck, ShoppingCart } from "lucide-react";
import Link from "next/link";

type PurchasesDashboardSectionProps = {
  dashboard: PurchasesDashboard;
};

export default function PurchasesDashboardSection({
  dashboard,
}: PurchasesDashboardSectionProps) {
  return (
    <section aria-labelledby="purchase-processing-heading">
      <Card>
        <CardHeader>
          <CardTitle id="purchase-processing-heading" className="flex items-center gap-2 text-lg">
            <ShoppingCart className="size-5 text-violet-600" aria-hidden="true" />
            購買処理
          </CardTitle>
          <CardDescription>発注・受領の対応が必要な申請</CardDescription>
          <CardAction>
            <Button
              variant="link"
              size="sm"
              nativeButton={false}
              render={<Link href="/purchases" />}
            >
              すべて見る
              <ArrowRight aria-hidden="true" />
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="space-y-6">
          <dl className="grid gap-3 sm:grid-cols-2">
            <DashboardMetric
              label="発注待ち"
              count={dashboard.awaitingOrderCount}
              icon={ShoppingCart}
              tone="green"
            />
            <DashboardMetric
              label="受領待ち"
              count={dashboard.awaitingReceiptCount}
              icon={PackageCheck}
              tone="violet"
            />
          </dl>
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">希望納期が近い申請</h3>
            <DashboardWorkQueueTable
              requests={dashboard.upcomingRequests}
              caption="希望納期が近い購買処理一覧"
              emptyMessage="対応が必要な購買処理はありません。"
              detailBasePath="/purchases"
            />
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
