import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPurchaseDetail } from "@/features/purchases/api/get-purchase-detail";
import PurchaseDetail from "@/features/purchases/components/purchase-detail";
import { getActiveSupplierOptions } from "@/features/suppliers/server/get-active-supplier-options";
import { ApiError } from "@/lib/api/api-error";

export const metadata: Metadata = { title: "購買処理詳細" };
type PurchaseDetailPageProps = { params: Promise<{ requestId: string }> };

export default async function PurchaseDetailPage({ params }: PurchaseDetailPageProps) {
  const { requestId } = await params;
  const [request, supplierOptions] = await Promise.all([
    getPurchaseDetailOrNotFound(requestId),
    getActiveSupplierOptions(),
  ]);
  return <PurchaseDetail request={request} supplierOptions={supplierOptions} />;
}

async function getPurchaseDetailOrNotFound(requestId: string) {
  try {
    return await getPurchaseDetail(requestId);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }
}
