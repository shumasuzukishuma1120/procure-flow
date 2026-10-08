import type {
  CreateRequestSubmissionRequest,
  RequestSubmissionResponse,
} from "@/features/requests/types";
import type { ApiProblemResponse } from "@/lib/api/types";
import { delay, http, HttpResponse } from "msw";

const requestSubmissionResponse = {
  requestId: "00000000-0000-4000-8000-000000000001",
  requestNumber: "REQ-2026-000001",
  status: "SUBMITTED",
  version: 1,
  submittedAt: "2026-10-04T00:00:00Z",
} satisfies RequestSubmissionResponse;

const networkFailedIdempotencyKeys = new Set<string>();

const supplierNotActiveProblem = {
  type: "https://example.invalid/problems/supplier-not-active",
  title: "Supplier is not active",
  status: 422,
  detail: "選択した仕入先は現在利用できません。仕入先を選び直してください。",
  code: "SUPPLIER_NOT_ACTIVE",
  traceId: "mock-trace-id",
  fieldErrors: [],
} satisfies ApiProblemResponse;

const requestValidationProblem = {
  type: "https://example.invalid/problems/request-validation-error",
  title: "Request validation failed",
  status: 400,
  detail: "入力内容を確認してください。",
  code: "REQUEST_VALIDATION_ERROR",
  traceId: "mock-trace-id",
  fieldErrors: [
    {
      field: "title",
      code: "INVALID_TITLE",
      message: "このタイトルは使用できません。",
    },
  ],
} satisfies ApiProblemResponse;

function createRequestItemValidationProblem(itemIndex: number): ApiProblemResponse {
  return {
    type: "https://example.invalid/problems/request-validation-error",
    title: "Request validation failed",
    status: 400,
    detail: "申請明細の入力内容を確認してください。",
    code: "REQUEST_VALIDATION_ERROR",
    traceId: "mock-trace-id",
    fieldErrors: [
      {
        field: `items[${itemIndex}].productName`,
        code: "INVALID_PRODUCT_NAME",
        message: "この商品名は使用できません。",
      },
    ],
  };
}

export const requestSubmissionHandlers = [
  http.post("/api/request-submissions", async ({ request }) => {
    await delay(800);

    const requestBody = (await request.json()) as CreateRequestSubmissionRequest;

    if (requestBody.title === "ネットワークエラー確認") {
      const idempotencyKey = request.headers.get("Idempotency-Key");

      if (idempotencyKey === null || !networkFailedIdempotencyKeys.has(idempotencyKey)) {
        if (idempotencyKey !== null) {
          networkFailedIdempotencyKeys.add(idempotencyKey);
        }

        return HttpResponse.error();
      }
    }

    if (requestBody.title === "入力エラー確認") {
      return HttpResponse.json(requestValidationProblem, {
        status: 400,
      });
    }

    const invalidItemIndex = requestBody.items.findIndex(
      (item) => item.productName === "明細入力エラー確認",
    );

    if (invalidItemIndex >= 0) {
      return HttpResponse.json(createRequestItemValidationProblem(invalidItemIndex), {
        status: 400,
      });
    }

    if (requestBody.title === "業務エラー確認") {
      return HttpResponse.json(supplierNotActiveProblem, {
        status: 422,
      });
    }

    return HttpResponse.json(requestSubmissionResponse, {
      status: 201,
    });
  }),
];
