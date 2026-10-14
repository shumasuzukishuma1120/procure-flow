import { readApiProblem } from "@/features/requests/api/utils";
import type { CancelRequestResponse } from "@/features/requests/types";
import { ApiError } from "@/lib/api/api-error";

export type CancelSubmittedRequestParams = {
  requestId: string;
  version: number;
  reason: string;
};

export async function cancelSubmittedRequest({
  requestId,
  version,
  reason,
}: CancelSubmittedRequestParams): Promise<CancelRequestResponse> {
  const response = await fetch(`/api/requests/${encodeURIComponent(requestId)}/cancel`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ version, reason }),
  });

  if (!response.ok) {
    const problem = await readApiProblem(response);
    throw new ApiError(response.status, problem);
  }

  return (await response.json()) as CancelRequestResponse;
}
