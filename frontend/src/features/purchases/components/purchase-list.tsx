"use client";

import PurchaseListFilter from "@/features/purchases/components/purchase-list-filter";
import PurchaseListTable from "@/features/purchases/components/purchase-list-table";
import PurchaseListPagination from "@/features/purchases/components/purchase-list-pagination";
import { isDateOnlyValue } from "@/features/requests/utils/is-date-only-value";
import {
  PURCHASE_LIST_PAGE_SIZES,
  PURCHASE_SORTS,
  PURCHASE_STATUSES,
  type PurchaseDepartmentResponse,
  type PurchaseListPageSize,
  type PurchaseListQuery,
  type PurchaseListStatus,
  type PurchaseSort,
} from "@/features/purchases/types";
import { useSearchParams } from "next/navigation";
import { useGetPurchases } from "@/features/purchases/hooks/use-get-purchases";
import type { SupplierOption } from "@/features/suppliers/types";
import PurchaseListSkeleton from "@/features/purchases/components/purchase-list-skeleton";

const DEFAULT_QUERY = { page: 0, size: 20, sort: "DELIVERY_DATE_ASC" } satisfies PurchaseListQuery;

function isPageSize(value: number): value is PurchaseListPageSize {
  return PURCHASE_LIST_PAGE_SIZES.some((size) => size === value);
}

function isSort(value: string | null): value is PurchaseSort {
  return value !== null && PURCHASE_SORTS.some((sort) => sort === value);
}

function isPurchaseStatus(value: string | null): value is PurchaseListStatus {
  return value !== null && PURCHASE_STATUSES.some((status) => status === value);
}

type PurchaseListProps = {
  supplierOptions: SupplierOption[];
  departments: PurchaseDepartmentResponse[];
};

export default function PurchaseList({ supplierOptions, departments }: PurchaseListProps) {
  const searchParams = useSearchParams();
  const parsedPage = Number(searchParams.get("page"));
  const page = Number.isInteger(parsedPage) && parsedPage >= 0 ? parsedPage : DEFAULT_QUERY.page;
  const parsedSize = Number(searchParams.get("size"));
  const size = isPageSize(parsedSize) ? parsedSize : DEFAULT_QUERY.size;
  const sortParam = searchParams.get("sort");
  const sort = isSort(sortParam) ? sortParam : DEFAULT_QUERY.sort;

  const keyword = searchParams.get("keyword")?.trim() || undefined;

  const statusParam = searchParams.get("status");
  const status = isPurchaseStatus(statusParam) ? statusParam : undefined;

  const departmentIdParam = searchParams.get("departmentId");
  const departmentId = departments.some(({ id }) => id === departmentIdParam)
    ? departmentIdParam ?? undefined
    : undefined;
  const supplierIdParam = searchParams.get("supplierId");
  const supplierId = supplierOptions.some(({ id }) => id === supplierIdParam)
    ? supplierIdParam ?? undefined
    : undefined;

  const approvedFromParam = searchParams.get("approvedFrom");
  const approvedFrom = isDateOnlyValue(approvedFromParam) ? approvedFromParam : undefined;

  const approvedToParam = searchParams.get("approvedTo");
  const approvedTo = isDateOnlyValue(approvedToParam) ? approvedToParam : undefined;

  const query: PurchaseListQuery = {
    page,
    size,
    sort,
    keyword,
    status,
    departmentId,
    supplierId,
    approvedFrom,
    approvedTo,
  };

  const purchaseQuery = useGetPurchases(query);

  if (purchaseQuery.isPending) {
    return <PurchaseListSkeleton />;
  }

  if (purchaseQuery.isError) {
    return <p role="alert">{purchaseQuery.error.message}</p>;
  }

  return (
    <div aria-busy={purchaseQuery.isFetching} className="space-y-3">
      <PurchaseListFilter
        keyword={keyword}
        status={status}
        departmentId={departmentId}
        supplierId={supplierId}
        sort={sort}
        supplierOptions={supplierOptions}
        departments={departments}
      />
      {purchaseQuery.isFetching && (
        <p role="status" className="text-sm text-muted-foreground">購買処理一覧を更新しています</p>
      )}
      <PurchaseListTable items={purchaseQuery.data.items} />
      <PurchaseListPagination
        page={page}
        size={size}
        totalPages={purchaseQuery.data.totalPages}
        totalElements={purchaseQuery.data.totalElements}
      />
    </div>
  );
}
