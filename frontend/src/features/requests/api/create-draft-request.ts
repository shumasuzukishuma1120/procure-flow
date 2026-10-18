import { readApiProblem } from "@/lib/api/read-api-problem";;
import type { CreateDraftRequest, DraftRequestResponse } from "@/features/requests/types";
import { ApiError } from "@/lib/api/api-error";

type CreateDraftCreationParams = {
  request: CreateDraftRequest;
  idempotencyKey: string;
};

export async function createDraftRequest({
  request,
  idempotencyKey,
}: CreateDraftCreationParams): Promise<DraftRequestResponse> {
  const response = await fetch("/api/requests", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Idempotency-Key": idempotencyKey },
    body: JSON.stringify(request),
  });
  if (!response.ok) {
    const problem = await readApiProblem(response);
    throw new ApiError(response.status, problem);
  }

  const data: DraftRequestResponse = await response.json();
  return data;
}
