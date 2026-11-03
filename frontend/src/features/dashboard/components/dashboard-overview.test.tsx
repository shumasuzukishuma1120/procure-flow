import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import DashboardOverview from "@/features/dashboard/components/dashboard-overview";
import type { DashboardResponse } from "@/features/dashboard/types";

const dashboard = {
  myRequests: {
    statusCounts: [],
    recentRequests: [],
  },
  approvals: {
    pendingCount: 2,
    overdueCount: 1,
    oldestRequests: [],
  },
  purchases: {
    awaitingOrderCount: 3,
    awaitingReceiptCount: 4,
    upcomingRequests: [],
  },
} satisfies DashboardResponse;

describe("DashboardOverview", () => {
  it("USERには自分の申請だけを表示する", () => {
    render(<DashboardOverview dashboard={dashboard} roles={["USER"]} />);
    const myRequestSection = screen.getByRole("region", { name: "自分の申請" });
    expect(myRequestSection).toBeInTheDocument();
    const approvalsSection = screen.queryByRole("region", { name: "承認待ち" });
    expect(approvalsSection).not.toBeInTheDocument();
    const purchasesSection = screen.queryByRole("region", { name: "購買処理" });
    expect(purchasesSection).not.toBeInTheDocument();
  });

  it("APPROVERには承認待ちだけを表示する", () => {
    render(<DashboardOverview dashboard={dashboard} roles={["APPROVER"]} />);
    const myRequestSection = screen.queryByRole("region", { name: "自分の申請" });
    expect(myRequestSection).not.toBeInTheDocument();
    const approvalsSection = screen.getByRole("region", { name: "承認待ち" });
    expect(approvalsSection).toBeInTheDocument();
    const purchasesSection = screen.queryByRole("region", { name: "購買処理" });
    expect(purchasesSection).not.toBeInTheDocument();
  });
  it("PURCHASERには購買処理だけを表示する", () => {
    render(<DashboardOverview dashboard={dashboard} roles={["PURCHASER"]} />);
    const myRequestSection = screen.queryByRole("region", { name: "自分の申請" });
    expect(myRequestSection).not.toBeInTheDocument();
    const approvalsSection = screen.queryByRole("region", { name: "承認待ち" });
    expect(approvalsSection).not.toBeInTheDocument();
    const purchasesSection = screen.getByRole("region", { name: "購買処理" });
    expect(purchasesSection).toBeInTheDocument();
  });

  it("複数の役割を持つユーザーには該当するセクションをすべて表示する(USER + APPROVER)", () => {
    render(<DashboardOverview dashboard={dashboard} roles={["USER", "APPROVER"]} />);
    const myRequestSection = screen.getByRole("region", { name: "自分の申請" });
    expect(myRequestSection).toBeInTheDocument();
    const approvalsSection = screen.getByRole("region", { name: "承認待ち" });
    expect(approvalsSection).toBeInTheDocument();
    const purchasesSection = screen.queryByRole("region", { name: "購買処理" });
    expect(purchasesSection).not.toBeInTheDocument();
  });

  it("業務権限を持たない場合は案内メッセージを表示する", () => {
    render(<DashboardOverview dashboard={dashboard} roles={["ADMIN"]} />);
    const message = screen.getByText("現在表示できる業務情報はありません。");
    expect(message).toBeInTheDocument();

    const myRequestSection = screen.queryByRole("region", { name: "自分の申請" });
    expect(myRequestSection).not.toBeInTheDocument();
    const approvalsSection = screen.queryByRole("region", { name: "承認待ち" });
    expect(approvalsSection).not.toBeInTheDocument();
    const purchasesSection = screen.queryByRole("region", { name: "購買処理" });
    expect(purchasesSection).not.toBeInTheDocument();
  });
});
