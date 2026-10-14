import { readApiProblem } from "@/features/requests/api/utils";
import { ApiError } from "@/lib/api/api-error";

export type DeleteDraftRequestParams = {
  requestId: string;
  version: number;
};

export async function deleteDraftRequest({
  requestId,
  version,
}: DeleteDraftRequestParams): Promise<void> {
  const searchParams = new URLSearchParams({ version: String(version) });
  const response = await fetch(
    `/api/requests/${encodeURIComponent(requestId)}?${searchParams.toString()}`,
    { method: "DELETE" },
  );

  if (!response.ok) {
    const problem = await readApiProblem(response);
    throw new ApiError(response.status, problem);
  }
}
