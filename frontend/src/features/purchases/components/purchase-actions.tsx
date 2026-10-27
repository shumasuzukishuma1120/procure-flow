import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import CompleteReceiptDialog from "@/features/purchases/components/complete-receipt-dialog";
import CreatePurchaseOrderDialog from "@/features/purchases/components/create-purchase-order-dialog";
import type { PurchaseDetailResponse } from "@/features/purchases/types";
import type { SupplierOption } from "@/features/suppliers/types";

export default function PurchaseActions({
  request,
  supplierOptions,
}: {
  request: PurchaseDetailResponse;
  supplierOptions: SupplierOption[];
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {request.status === "APPROVED" && <CreatePurchaseOrderDialog request={request} supplierOptions={supplierOptions} />}
      {request.status === "ORDERED" && <CompleteReceiptDialog request={request} />}
      <Button variant="outline" nativeButton={false} render={<Link href="/purchases" />}>
        <ArrowLeft aria-hidden="true" />一覧へ戻る
      </Button>
    </div>
  );
}
