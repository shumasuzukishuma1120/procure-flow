import type { ApprovalListQuery } from "@/features/approvals/types";

export function toApprovalListSearchParams(query: ApprovalListQuery): URLSearchParams {
  const params = new URLSearchParams({
    page: String(query.page),
    size: String(query.size),
    sort: query.sort,
  });

  if (query.keyword) params.set("keyword", query.keyword);
  if (query.submittedFrom) params.set("submittedFrom", query.submittedFrom);
  if (query.submittedTo) params.set("submittedTo", query.submittedTo);
  if (query.departmentId) params.set("departmentId", query.departmentId);
  if (query.overdueOnly) params.set("overdueOnly", "true");

  return params;
}
