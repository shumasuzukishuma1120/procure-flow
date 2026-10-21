import { toApprovalListSearchParams } from "@/features/approvals/api/to-approval-list-search-params";
import type { ApprovalListQuery, ApprovalListResponse } from "@/features/approvals/types";
import { ApiError } from "@/lib/api/api-error";
import { readApiProblem } from "@/lib/api/read-api-problem";

export async function getApprovals(
  query: ApprovalListQuery,
  signal?: AbortSignal,
): Promise<ApprovalListResponse> {
  const params = toApprovalListSearchParams(query);
  const response = await fetch(`/api/approvals?${params.toString()}`, {
    cache: "no-store",
    signal,
  });

  if (!response.ok) {
    throw new ApiError(response.status, await readApiProblem(response));
  }

  return (await response.json()) as ApprovalListResponse;
}
