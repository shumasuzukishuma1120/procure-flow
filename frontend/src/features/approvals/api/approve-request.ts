import type { ApprovalActionResponse } from "@/features/approvals/types";
import { ApiError } from "@/lib/api/api-error";
import { readApiProblem } from "@/lib/api/read-api-problem";

export type ApproveRequestParams = {
  requestId: string;
  version: number;
  idempotencyKey: string;
};

export async function approveRequest({
  requestId,
  version,
  idempotencyKey,
}: ApproveRequestParams): Promise<ApprovalActionResponse> {
  const response = await fetch(`/api/approvals/${encodeURIComponent(requestId)}/approve`, {
    method: "POST",
    headers: { "content-type": "application/json", "Idempotency-Key": idempotencyKey },
    body: JSON.stringify({ version }),
  });
  if (!response.ok) throw new ApiError(response.status, await readApiProblem(response));
  return (await response.json()) as ApprovalActionResponse;
}
