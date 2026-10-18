import { readApiProblem } from "@/lib/api/read-api-problem";;
import type {
  DraftRequestResponse,
  UpdateDraftRequest,
} from "@/features/requests/types";
import { ApiError } from "@/lib/api/api-error";

export type UpdateDraftRequestParams = {
  requestId: string;
  request: UpdateDraftRequest;
};

export async function updateDraftRequest({
  requestId,
  request,
}: UpdateDraftRequestParams): Promise<DraftRequestResponse> {
  const response = await fetch(`/api/requests/${encodeURIComponent(requestId)}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const problem = await readApiProblem(response);
    throw new ApiError(response.status, problem);
  }

  const data: DraftRequestResponse = await response.json();
  return data;
}
