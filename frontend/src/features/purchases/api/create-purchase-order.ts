import type {
  CreatePurchaseOrderRequest,
  PurchaseActionResponse,
} from "@/features/purchases/types";
import { ApiError } from "@/lib/api/api-error";
import { readApiProblem } from "@/lib/api/read-api-problem";

export type CreatePurchaseOrderParams = {
  requestId: string;
  request: CreatePurchaseOrderRequest;
  idempotencyKey: string;
};

export async function createPurchaseOrder({
  requestId,
  request,
  idempotencyKey,
}: CreatePurchaseOrderParams): Promise<PurchaseActionResponse> {
  const response = await fetch(`/api/purchases/${encodeURIComponent(requestId)}/order`, {
    method: "POST",
    headers: { "content-type": "application/json", "Idempotency-Key": idempotencyKey },
    body: JSON.stringify(request),
  });
  if (!response.ok) throw new ApiError(response.status, await readApiProblem(response));
  return (await response.json()) as PurchaseActionResponse;
}
