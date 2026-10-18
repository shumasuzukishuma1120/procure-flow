import type { DraftRequestResponse, RequestDetailResponse } from "@/features/requests/types";

export function isDraftRequestResponse(
  response: RequestDetailResponse,
): response is DraftRequestResponse {
  return response.status === "DRAFT" && response.requestNumber === null;
}
