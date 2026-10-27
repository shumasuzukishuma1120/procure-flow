import { Skeleton } from "@/components/ui/skeleton";

export default function PurchaseDetailLoading() {
  return (
    <div role="status" aria-label="購買処理詳細を読み込んでいます" className="space-y-5">
      <span className="sr-only">購買処理詳細を読み込んでいます</span>
      <div className="flex justify-between"><Skeleton className="h-8 w-48" /><Skeleton className="h-9 w-64" /></div>
      <Skeleton className="h-72 w-full rounded-xl" />
      <div className="grid gap-4 md:grid-cols-2"><Skeleton className="h-72 rounded-xl" /><Skeleton className="h-72 rounded-xl" /></div>
    </div>
  );
}
