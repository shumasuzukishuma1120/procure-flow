import { Card, CardContent } from "@/components/ui/card";
import ApprovalsDashboardSection from "@/features/dashboard/components/approvals-dashboard-section";
import MyRequestsDashboardSection from "@/features/dashboard/components/my-requests-dashboard-section";
import PurchasesDashboardSection from "@/features/dashboard/components/purchases-dashboard-section";
import type { DashboardResponse } from "@/features/dashboard/types";
import type { UserRole } from "@/features/auth/types";

type DashboardOverviewProps = {
  dashboard: DashboardResponse;
  roles: UserRole[];
};

export default function DashboardOverview({ dashboard, roles }: DashboardOverviewProps) {
  const canViewMyRequests = roles.includes("USER");
  const canViewApprovals = roles.includes("APPROVER");
  const canViewPurchases = roles.includes("PURCHASER");

  if (!canViewMyRequests && !canViewApprovals && !canViewPurchases) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          現在表示できる業務情報はありません。
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {canViewMyRequests && <MyRequestsDashboardSection dashboard={dashboard.myRequests} />}
      {canViewApprovals && <ApprovalsDashboardSection dashboard={dashboard.approvals} />}
      {canViewPurchases && <PurchasesDashboardSection dashboard={dashboard.purchases} />}
    </div>
  );
}
