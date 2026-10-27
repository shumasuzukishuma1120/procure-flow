import { toPurchaseListSearchParams } from "@/features/purchases/api/to-purchase-list-search-params";
import { PurchaseListQuery, PurchaseListResponse } from "@/features/purchases/types";
import { ApiError } from "@/lib/api/api-error";
import { readApiProblem } from "@/lib/api/read-api-problem";

export async function getPurchases( query:PurchaseListQuery,signal?:AbortSignal):Promise<PurchaseListResponse> {

  const params = toPurchaseListSearchParams(query);

  const response = await fetch(`/api/purchases?${params.toString()}`, {
    cache: "no-store",
    signal
  });

  if (!response.ok) {
    throw new ApiError(response.status, await readApiProblem(response));
  }

  return response.json();
}