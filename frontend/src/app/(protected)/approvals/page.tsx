import type { Metadata } from "next";
import { Suspense } from "react";
import { getApproverDepartments } from "@/features/approvals/api/get-approver-departments";
import ApprovalList from "@/features/approvals/components/approval-list";
import ApprovalsPageSkeleton from "@/features/approvals/components/approvals-page-skeleton";

export const metadata: Metadata = {
  title: "承認待ちの申請",
};

export default function ApprovalsPage() {
  return (
    <Suspense fallback={<ApprovalsPageSkeleton />}>
      <ApprovalsPageContent />
    </Suspense>
  );
}

async function ApprovalsPageContent() {
  const departments = await getApproverDepartments();

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">承認待ちの申請一覧</h2>
      <ApprovalList departments={departments} />
    </div>
  );
}
