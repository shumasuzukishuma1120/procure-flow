"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ApprovalListFilters from "@/features/approvals/components/approval-list-filters";
import ApprovalListPagination from "@/features/approvals/components/approval-list-pagination";
import ApprovalListSkeleton from "@/features/approvals/components/approval-list-skeleton";
import ApprovalListTable from "@/features/approvals/components/approval-list-table";
import { useGetApprovals } from "@/features/approvals/hooks/use-get-approvals";
import {
  APPROVAL_LIST_PAGE_SIZES,
  APPROVAL_SORTS,
  type ApprovalListPageSize,
  type ApprovalListQuery,
  type ApprovalSort,
  type ApproverDepartmentResponse,
} from "@/features/approvals/types";
import { isDateOnlyValue } from "@/features/requests/utils/is-date-only-value";

const DEFAULT_QUERY = { page: 0, size: 20, sort: "OLDEST" } satisfies ApprovalListQuery;

function isPageSize(value: number): value is ApprovalListPageSize {
  return APPROVAL_LIST_PAGE_SIZES.some((size) => size === value);
}

function isSort(value: string | null): value is ApprovalSort {
  return value !== null && APPROVAL_SORTS.some((sort) => sort === value);
}

export default function ApprovalList({
  departments,
}: {
  departments: ApproverDepartmentResponse[];
}) {
  const searchParams = useSearchParams();
  const parsedPage = Number(searchParams.get("page"));
  const page = Number.isInteger(parsedPage) && parsedPage >= 0 ? parsedPage : DEFAULT_QUERY.page;
  const parsedSize = Number(searchParams.get("size"));
  const size = isPageSize(parsedSize) ? parsedSize : DEFAULT_QUERY.size;
  const sortParam = searchParams.get("sort");
  const sort = isSort(sortParam) ? sortParam : DEFAULT_QUERY.sort;
  const keyword = searchParams.get("keyword")?.trim() || undefined;
  const submittedFromParam = searchParams.get("submittedFrom");
  const submittedToParam = searchParams.get("submittedTo");
  const submittedFrom = isDateOnlyValue(submittedFromParam) ? submittedFromParam : undefined;
  const submittedTo = isDateOnlyValue(submittedToParam) ? submittedToParam : undefined;
  const departmentIdParam = searchParams.get("departmentId");
  const departmentId = departments.some(({ id }) => id === departmentIdParam)
    ? departmentIdParam ?? undefined
    : undefined;
  const overdueOnly = searchParams.get("overdueOnly") === "true";
  const approvalsQuery = useGetApprovals({
    page, size, sort, keyword, submittedFrom, submittedTo, departmentId, overdueOnly,
  });

  if (approvalsQuery.isPending) return <ApprovalListSkeleton />;
  if (approvalsQuery.isError) return <p role="alert">{approvalsQuery.error.message}</p>;

  return (
    <div aria-busy={approvalsQuery.isFetching} className="space-y-3">
      <ApprovalListFilters
        keyword={keyword}
        departmentId={departmentId}
        overdueOnly={overdueOnly}
        sort={sort}
        departments={departments}
      />
      {approvalsQuery.isFetching && (
        <p role="status" className="text-sm text-muted-foreground">
          承認待ち一覧を更新しています
        </p>
      )}
      <Suspense fallback={<p role="status">承認待ち一覧を読み込んでいます</p>}>
        <ApprovalListTable items={approvalsQuery.data.items} />
      </Suspense>
      <ApprovalListPagination
        page={page}
        size={size}
        totalPages={approvalsQuery.data.totalPages}
        totalElements={approvalsQuery.data.totalElements}
      />
    </div>
  );
}
