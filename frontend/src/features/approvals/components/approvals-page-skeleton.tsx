import { Skeleton } from "@/components/ui/skeleton";
import ApprovalListSkeleton from "@/features/approvals/components/approval-list-skeleton";

export default function ApprovalsPageSkeleton() {
  return (
    <div role="status" aria-label="承認待ちページを読み込んでいます" className="space-y-4">
      <span className="sr-only">承認待ちページを読み込んでいます</span>
      <Skeleton aria-hidden="true" className="h-7 w-48" />
      <div aria-hidden="true"><ApprovalListSkeleton /></div>
    </div>
  );
}
