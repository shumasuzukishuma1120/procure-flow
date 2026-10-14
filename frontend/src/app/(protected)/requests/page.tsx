import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import MyRequestList from "@/features/requests/components/my-request-list";
import { getActiveCategoryOptions } from "@/features/categories/server/get-active-category-options";
import { getActiveSupplierOptions } from "@/features/suppliers/server/get-active-supplier-options";

export const metadata: Metadata = {
  title: "自分の申請",
};

export default async function RequestsPage() {
  const [supplierOptions, categoryOptions] = await Promise.all([
    getActiveSupplierOptions(),
    getActiveCategoryOptions(),
  ]);

  return (
    <>
      <div className="flex justify-between overflow-hidden">
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
