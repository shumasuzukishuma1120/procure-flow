import { Skeleton } from "@/components/ui/skeleton";

export default function PurchaseListSkeleton() {
  return (
    <div role="status" aria-label="購買処理一覧を読み込んでいます" className="space-y-3">
      <span className="sr-only">購買処理一覧を読み込んでいます</span>
      <Skeleton className="h-9 w-full" />
      <div className="space-y-2">
        {Array.from({ length: 8 }, (_, index) => <Skeleton key={index} className="h-12 w-full" />)}
      </div>
    </div>
  );
}
