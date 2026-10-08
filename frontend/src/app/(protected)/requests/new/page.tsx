import { getActiveCategoryOptions } from "@/features/categories/server/get-active-category-options";
import CreateRequestForm from "@/features/requests/components/create-request-form";
import { getActiveSupplierOptions } from "@/features/suppliers/server/get-active-supplier-options";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "新規申請",
};

export default async function NewRequestPage() {
  const [supplierOptions, categoryOptions] = await Promise.all([
    getActiveSupplierOptions(),
    getActiveCategoryOptions(),
  ]);

  return <CreateRequestForm supplierOptions={supplierOptions} categoryOptions={categoryOptions} />;
}
