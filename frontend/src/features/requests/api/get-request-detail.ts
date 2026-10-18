import "server-only";

import type { RequestDetailResponse } from "@/features/requests/types";
import { ApiError } from "@/lib/api/api-error";
import { readApiProblem } from "@/lib/api/read-api-problem";

export async function getRequestDetail(requestId: string): Promise<RequestDetailResponse> {
  const backendApiUrl = process.env.BACKEND_API_URL;

  if (!backendApiUrl) {
    throw new Error("BACKEND_API_URLが設定されていません。");
  }

  const requestUrl = new URL(`/api/requests/${encodeURIComponent(requestId)}`, backendApiUrl);

  const response = await fetch(requestUrl, {
    cache: "no-store",
  });

  if (!response.ok) {
    const problem = await readApiProblem(response);
    throw new ApiError(response.status, problem);
  }

  const data: RequestDetailResponse = await response.json();

  return data
}
