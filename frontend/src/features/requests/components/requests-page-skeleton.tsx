import { Skeleton } from "@/components/ui/skeleton";
import MyRequestListSkeleton from "@/features/requests/components/my-request-list-skeleton";

export default function RequestsPageSkeleton() {
  return (
    <div
      className="space-y-4"
      role="status"
      aria-label="自分の申請一覧を読み込んでいます"
    >
      <span className="sr-only">自分の申請一覧を読み込んでいます</span>
      <div aria-hidden="true" className="flex items-center justify-between overflow-hidden">
        <Skeleton className="h-7 w-36" />
        <Skeleton className="h-8 w-36" />
      </div>
      <div aria-hidden="true">
        <MyRequestListSkeleton />
      </div>
    </div>
  );
}
