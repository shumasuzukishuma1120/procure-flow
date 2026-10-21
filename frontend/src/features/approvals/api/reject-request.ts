import type { ApprovalActionResponse } from "@/features/approvals/types";
import { ApiError } from "@/lib/api/api-error";
import { readApiProblem } from "@/lib/api/read-api-problem";

export type RejectRequestParams = {
  requestId: string;
  version: number;
  reason: string;
  idempotencyKey: string;
};

export async function rejectRequest({
  requestId,
  version,
  reason,
  idempotencyKey,
}: RejectRequestParams): Promise<ApprovalActionResponse> {
  const response = await fetch(`/api/approvals/${encodeURIComponent(requestId)}/reject`, {
    method: "POST",
    headers: { "content-type": "application/json", "Idempotency-Key": idempotencyKey },
    body: JSON.stringify({ version, reason }),
  });
  if (!response.ok) throw new ApiError(response.status, await readApiProblem(response));
  return (await response.json()) as ApprovalActionResponse;
}
