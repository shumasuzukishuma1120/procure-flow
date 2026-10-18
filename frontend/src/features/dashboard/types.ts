import type { RequestStatus } from "@/features/requests/types";

export type DashboardStatusCount = {
  status: RequestStatus;
  count: number;
};

export type DashboardRequestSummary = {
  requestId: string;
  requestNumber: string | null;
  title: string;
  status: RequestStatus;
  applicantName: string;
  departmentName: string;
  desiredDeliveryDate: string;
  totalAmount: number;
  updatedAt: string;
};

export type MyRequestsDashboard = {
  statusCounts: DashboardStatusCount[];
  recentRequests: DashboardRequestSummary[];
};

export type ApprovalsDashboard = {
  pendingCount: number;
  overdueCount: number;
  oldestRequests: DashboardRequestSummary[];
};

export type PurchasesDashboard = {
  awaitingOrderCount: number;
  awaitingReceiptCount: number;
  upcomingRequests: DashboardRequestSummary[];
};

export type DashboardResponse = {
  myRequests: MyRequestsDashboard;
  approvals: ApprovalsDashboard;
  purchases: PurchasesDashboard;
};
