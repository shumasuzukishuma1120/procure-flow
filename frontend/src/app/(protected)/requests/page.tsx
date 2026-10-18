import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import MyRequestList from "@/features/requests/components/my-request-list";
import MyRequestListSkeleton from "@/features/requests/components/my-request-list-skeleton";
import { getActiveCategoryOptions } from "@/features/categories/server/get-active-category-options";
import { getActiveSupplierOptions } from "@/features/suppliers/server/get-active-supplier-options";

export const metadata: Metadata = {
  title: "自分の申請",
};

export default function RequestsPage() {
  return (
    <Suspense fallback={<RequestsPageSkeleton />}>
      <RequestsPageContent />
    </Suspense>
  );
}

async function RequestsPageContent() {
  const [supplierOptions, categoryOptions] = await Promise.all([
    getActiveSupplierOptions(),
    getActiveCategoryOptions(),
  ]);

  return (
    <>
      <div className="flex justify-between overflow-hidden mb-2">
        <h2 className="text-lg font-bold">自分の申請一覧</h2>
        <Button variant={"outline"} nativeButton={false} render={<Link href="/requests/new" />}>
          <Plus aria-hidden="true" />
          新規申請を作成
        </Button>
      </div>

      <MyRequestList supplierOptions={supplierOptions} categoryOptions={categoryOptions} />
    </>
  );
}

function RequestsPageSkeleton() {
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
