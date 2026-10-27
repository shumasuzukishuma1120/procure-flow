import type { CompleteReceiptRequest, PurchaseActionResponse } from "@/features/purchases/types";
import { ApiError } from "@/lib/api/api-error";
import { readApiProblem } from "@/lib/api/read-api-problem";

export type CompleteReceiptParams = {
  requestId: string;
  request: CompleteReceiptRequest;
  idempotencyKey: string;
};

export async function completeReceipt({
  requestId,
  request,
  idempotencyKey,
}: CompleteReceiptParams): Promise<PurchaseActionResponse> {
  const response = await fetch(`/api/purchases/${encodeURIComponent(requestId)}/receipt`, {
    method: "POST",
    headers: { "content-type": "application/json", "Idempotency-Key": idempotencyKey },
    body: JSON.stringify(request),
  });
  if (!response.ok) throw new ApiError(response.status, await readApiProblem(response));
  return (await response.json()) as PurchaseActionResponse;
}
