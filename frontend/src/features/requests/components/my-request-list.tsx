"use client";

import MyRequestListFilters from "@/features/requests/components/my-request-list-filters";
import MyRequestListPagination from "@/features/requests/components/my-request-list-pagination";
import MyRequestListTable from "@/features/requests/components/my-request-list-table";
import { useGetRequests } from "@/features/requests/hooks/use-get-requests";
import { type MyRequestListQuery } from "@/features/requests/types";
import { isDateOnlyValue } from "@/features/requests/utils/is-date-only-value";
import { isMyRequestListPageSize } from "@/features/requests/utils/is-my-request-list-page-size";
import { isRequestStatus } from "@/features/requests/utils/is-request-status";
import { useSearchParams } from "next/navigation";
import type { CategoryOption } from "@/features/categories/types";
import type { SupplierOption } from "@/features/suppliers/types";
import { Suspense } from "react";
import MyRequestListSkeleton from "@/features/requests/components/my-request-list-skeleton";

const DEFAULT_MY_REQUEST_LIST_QUERY = {
  page: 0,
  size: 20,
  sort: "UPDATED_DESC",
  keyword: undefined,
} satisfies MyRequestListQuery;

type MyRequestListProps = {
  categoryOptions: CategoryOption[];
  supplierOptions: SupplierOption[];
};

export default function MyRequestList({ categoryOptions, supplierOptions }: MyRequestListProps) {
  const searchParams = useSearchParams();

  const parsedPage = Number(searchParams.get("page"));
  const page = !Number.isInteger(parsedPage) || parsedPage < 0 ? 0 : parsedPage;

  const parsedSize = Number(searchParams.get("size"));
  const size = isMyRequestListPageSize(parsedSize)
    ? parsedSize
    : DEFAULT_MY_REQUEST_LIST_QUERY.size;

  const statusParam = searchParams.get("status");
  const status = isRequestStatus(statusParam) ? statusParam : undefined;

  const keywordParam = searchParams.get("keyword");
  const keyword = keywordParam?.trim() || undefined;

  const createdFromParam = searchParams.get("createdFrom");
  const createdToParam = searchParams.get("createdTo");
  const createdFrom = isDateOnlyValue(createdFromParam) ? createdFromParam : undefined;
  const createdTo = isDateOnlyValue(createdToParam) ? createdToParam : undefined;

  const categoryIdParam = searchParams.get("categoryId");
  const categoryId =
    categoryIdParam && categoryOptions.some((category) => category.id === categoryIdParam)
      ? categoryIdParam
      : undefined;

  const supplierIdParam = searchParams.get("supplierId");
  const supplierId =
    supplierIdParam && supplierOptions.some((supplier) => supplier.id === supplierIdParam)
      ? supplierIdParam
      : undefined;

  const query = {
    ...DEFAULT_MY_REQUEST_LIST_QUERY,
    page,
    size,
    status,
    keyword,
    createdFrom,
    createdTo,
    categoryId,
    supplierId,
  };

  const requestsQuery = useGetRequests(query);

  if (requestsQuery.isPending) {
    return <MyRequestListSkeleton />;
  }
  if (requestsQuery.isError) {
    return <p role="alert">{requestsQuery.error.message}</p>;
  }

  return (
    <div aria-busy={requestsQuery.isFetching}>
      <MyRequestListFilters
        status={status}
        keyword={keyword}
        categoryId={categoryId}
        supplierId={supplierId}
        categoryOptions={categoryOptions}
        supplierOptions={supplierOptions}
      />
      {requestsQuery.isFetching && (
        <p role="status" className="text-sm text-muted-foreground">
          申請一覧を更新しています
        </p>
      )}
      <Suspense fallback={<p role="status">申請一覧を読み込んでいます</p>}>
      <MyRequestListTable items={requestsQuery.data.items} />
      </Suspense>
      <MyRequestListPagination
        page={page}
        size={size}
        totalPages={requestsQuery.data.totalPages}
        totalElements={requestsQuery.data.totalElements}
      />
    </div>
  );
}
