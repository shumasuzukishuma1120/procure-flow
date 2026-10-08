import type { CreateDraftRequest, DraftRequestResponse } from "@/features/requests/types";
import type { ApiProblemResponse } from "@/lib/api/types";
import { delay, http, HttpResponse } from "msw";

type StoredDraftCreation = {
  requestFingerprint: string;
  response: DraftRequestResponse;
};

const draftCreationsByIdempotencyKey = new Map<string, StoredDraftCreation>();
const draftRequestsById = new Map<string, DraftRequestResponse>();

const missingIdempotencyKeyProblem = {
  type: "https://example.invalid/problems/idempotency-key-required",
  title: "Idempotency key is required",
  status: 400,
  detail: "下書きの作成にはIdempotency-Keyが必要です。",
  code: "IDEMPOTENCY_KEY_REQUIRED",
  traceId: "mock-trace-id",
  fieldErrors: [],
} satisfies ApiProblemResponse;

const idempotencyKeyConflictProblem = {
  type: "https://example.invalid/problems/idempotency-key-conflict",
  title: "Idempotency key conflict",
  status: 409,
  detail: "同じIdempotency-Keyが異なる内容の下書き作成に使用されました。",
  code: "IDEMPOTENCY_KEY_CONFLICT",
  traceId: "mock-trace-id",
  fieldErrors: [],
} satisfies ApiProblemResponse;

const draftRequestNotFoundProblem = {
  type: "https://example.invalid/problems/request-not-found",
  title: "Request not found",
  status: 404,
  detail: "指定された下書きは見つかりませんでした。",
  code: "REQUEST_NOT_FOUND",
  traceId: "mock-trace-id",
  fieldErrors: [],
} satisfies ApiProblemResponse;

function calculateDraftTotalAmount(requestBody: CreateDraftRequest): number {
  return requestBody.items.reduce((total, item) => {
    if (item.quantity === null || item.plannedUnitPrice === null) {
      return total;
    }

    return total + item.quantity * item.plannedUnitPrice;
  }, 0);
}

export const draftRequestHandlers = [
  http.post("/api/requests", async ({ request }) => {
    await delay(800);

    const idempotencyKey = request.headers.get("Idempotency-Key");

    if (idempotencyKey === null) {
      return HttpResponse.json(missingIdempotencyKeyProblem, {
        status: 400,
      });
    }

    const requestBody = (await request.json()) as CreateDraftRequest;
    const requestFingerprint = JSON.stringify(requestBody);
    const storedDraftCreation = draftCreationsByIdempotencyKey.get(idempotencyKey);

    if (storedDraftCreation !== undefined) {
      if (storedDraftCreation.requestFingerprint !== requestFingerprint) {
        return HttpResponse.json(idempotencyKeyConflictProblem, {
          status: 409,
        });
      }

      return HttpResponse.json(storedDraftCreation.response, {
        status: 201,
      });
    }

    const response = {
      requestId: crypto.randomUUID(),
      requestNumber: null,
      status: "DRAFT",
      title: requestBody.title,
      reason: requestBody.reason,
      desiredDeliveryDate: requestBody.desiredDeliveryDate,
      requestedSupplierId: requestBody.requestedSupplierId,
      note: requestBody.note,
      items: requestBody.items,
      totalAmount: calculateDraftTotalAmount(requestBody),
      version: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } satisfies DraftRequestResponse;

    draftCreationsByIdempotencyKey.set(idempotencyKey, {
      requestFingerprint,
      response,
    });
    draftRequestsById.set(response.requestId, response);

    return HttpResponse.json(response, {
      status: 201,
    });
  }),
  http.get("/api/requests/:requestId", async ({ params }) => {
    await delay(500);

    const requestId = params.requestId;

    if (typeof requestId !== "string") {
      return HttpResponse.json(draftRequestNotFoundProblem, {
        status: 404,
      });
    }

    const draftRequest = draftRequestsById.get(requestId);

    if (draftRequest === undefined) {
      return HttpResponse.json(draftRequestNotFoundProblem, {
        status: 404,
      });
    }

    return HttpResponse.json(draftRequest, {
      status: 200,
    });
  }),
];
