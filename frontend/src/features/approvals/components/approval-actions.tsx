import { Button } from "@/components/ui/button";
import ApproveRequestDialog from "@/features/approvals/components/approve-request-dialog";
import RejectRequestDialog from "@/features/approvals/components/reject-request-dialog";
import type { ApprovalDetailResponse } from "@/features/approvals/types";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ApprovalActions({ request }: { request: ApprovalDetailResponse }) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      {request.status === "SUBMITTED" && (
        <>
          <ApproveRequestDialog requestId={request.requestId} requestTitle={request.title} version={request.version} />
          <RejectRequestDialog requestId={request.requestId} requestTitle={request.title} version={request.version} />
        </>
      )}
      <Button variant="outline" nativeButton={false} render={<Link href="/approvals" />}>
        <ArrowLeft aria-hidden="true" />一覧へ戻る
      </Button>
    </div>
  );
}
