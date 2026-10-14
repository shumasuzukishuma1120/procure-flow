import { Skeleton } from "@/components/ui/skeleton";
import MyRequestListSkeleton from "@/features/requests/components/my-request-list-skeleton";

export default function Loading() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between overflow-hidden">
        <Skeleton className="h-7 w-36" />
        <Skeleton className="h-8 w-36" />
      </div>

      <MyRequestListSkeleton />
    </div>
  );
}
