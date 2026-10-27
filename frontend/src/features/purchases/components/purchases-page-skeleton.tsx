import { Skeleton } from "@/components/ui/skeleton";
import PurchaseListSkeleton from "@/features/purchases/components/purchase-list-skeleton";

export default function PurchasesPageSkeleton() {
  return <div className="space-y-4"><Skeleton className="h-7 w-36" /><PurchaseListSkeleton /></div>;
}
