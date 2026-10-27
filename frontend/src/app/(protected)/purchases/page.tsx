import type { Metadata } from "next";
import { Suspense } from "react";
import { getPurchaseDepartments } from "@/features/purchases/api/get-purchase-departments";
import PurchaseList from "@/features/purchases/components/purchase-list";
import PurchasesPageSkeleton from "@/features/purchases/components/purchases-page-skeleton";
import { getActiveSupplierOptions } from "@/features/suppliers/server/get-active-supplier-options";

export const metadata: Metadata = { title: "購買処理" };

export default function PurchasesPage() {
  return (
    <Suspense fallback={<PurchasesPageSkeleton />}>
      <PurchasesPageContent />
    </Suspense>
  );
}
async function PurchasesPageContent() {
  const [supplierOptions, departments] = await Promise.all([
    getActiveSupplierOptions(),
    getPurchaseDepartments(),
  ]);
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">購買処理一覧</h2>
      <PurchaseList supplierOptions={supplierOptions} departments={departments} />
    </div>
  );
}
