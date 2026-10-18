import { getActiveCategoryOptions } from "@/features/categories/server/get-active-category-options";
import { getRequestDetail } from "@/features/requests/api/get-request-detail";
import RequestDetail from "@/features/requests/components/request-detail";
import { getActiveSupplierOptions } from "@/features/suppliers/server/get-active-supplier-options";
import { ApiError } from "@/lib/api/api-error";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = { title: "申請詳細" };

type DetailRequestPageProps = {
  params: Promise<{ requestId: string }>;
};

export default async function DetailRequestPage({ params }: DetailRequestPageProps) {
  const { requestId } = await params;
  const [request, supplierOptions, categoryOptions] = await Promise.all([
    getRequestDetailOrNotFound(requestId),
    getActiveSupplierOptions(),
    getActiveCategoryOptions(),
  ]);

  return (
    <RequestDetail
      request={request}
      supplierOptions={supplierOptions}
      categoryOptions={categoryOptions}
    />
  );
}

async function getRequestDetailOrNotFound(requestId: string) {
  try {
    return await getRequestDetail(requestId);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }
}
