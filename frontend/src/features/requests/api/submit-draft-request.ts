import type { RequestSubmissionResponse, SubmitDraftRequest } from "@/features/requests/types";
import { ApiError } from "@/lib/api/api-error";

export type SubmitDraftRequestParams = {
  requestId: string;
  request: SubmitDraftRequest;
  idempotencyKey: string;
};

export async function submitDraftRequest({
  requestId,
  request,
  idempotencyKey,
}: SubmitDraftRequestParams): Promise<RequestSubmissionResponse> {
  const response = await fetch(`/api/requests/${encodeURIComponent(requestId)}/submit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const problem = await response.json();
    throw new ApiError(response.status, problem);
  }

  const data: RequestSubmissionResponse = await response.json();

  return data;
}
