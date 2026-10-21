import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getApprovalDetail } from "@/features/approvals/api/get-approval-detail";
import ApprovalDetail from "@/features/approvals/components/approval-detail";
import { ApiError } from "@/lib/api/api-error";

export const metadata: Metadata = { title: "承認申請詳細" };
type ApprovalDetailPageProps = { params: Promise<{ requestId: string }> };

export default async function ApprovalDetailPage({ params }: ApprovalDetailPageProps) {
  const { requestId } = await params;
  const request = await getApprovalDetailOrNotFound(requestId);
  return <ApprovalDetail request={request} />;
}

async function getApprovalDetailOrNotFound(requestId: string) {
  try {
    return await getApprovalDetail(requestId);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }
}
