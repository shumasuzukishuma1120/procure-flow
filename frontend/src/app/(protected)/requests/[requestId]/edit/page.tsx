import { getActiveCategoryOptions } from "@/features/categories/server/get-active-category-options";
import { getRequestDetail } from "@/features/requests/api/get-request-detail";
import EditRequestForm from "@/features/requests/components/edit-request-form";
import { isDraftRequestResponse } from "@/features/requests/guards/is-draft-request-response";
import { getActiveSupplierOptions } from "@/features/suppliers/server/get-active-supplier-options";
import { ApiError } from "@/lib/api/api-error";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

export const metadata: Metadata = { title: "下書き編集" };

type EditRequestPageProps = {
  params: Promise<{ requestId: string }>;
};

export default async function EditRequestPage({ params }: EditRequestPageProps) {
  const { requestId } = await params;

  const [requestDetail, supplierOptions, categoryOptions] = await Promise.all([
    getRequestDetailOrNotFound(requestId),
    getActiveSupplierOptions(),
    getActiveCategoryOptions(),
  ]);

  if (!isDraftRequestResponse(requestDetail)) {
    redirect(`/requests/${encodeURIComponent(requestId)}`);
  }
  return (
    <EditRequestForm
      request={requestDetail}
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
