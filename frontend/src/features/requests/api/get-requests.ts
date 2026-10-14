import { toMyRequestListSearchParams } from "@/features/requests/api/to-my-request-list-search-params";
import { readApiProblem } from "@/features/requests/api/utils";
import type { MyRequestListQuery, MyRequestListResponse } from "@/features/requests/types";
import { ApiError } from "@/lib/api/api-error";

export async function getRequests(query:MyRequestListQuery,signal?:AbortSignal):Promise<MyRequestListResponse>{

  const params = toMyRequestListSearchParams(query);

  const response = await fetch(`/api/requests?${params.toString()}`,{
    cache:"no-store",
    signal
  });

  if (!response.ok){
    const problem = await readApiProblem(response);
    throw new ApiError(response.status, problem)
  }

  const data = (await response.json()) as MyRequestListResponse
  return data;
}