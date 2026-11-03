import { describe, expect, it } from "vitest";
import { toCreateRequestSubmissionRequest } from "@/features/requests/api/to-create-request-submission-request";
import type { SubmitRequestFormValues } from "@/features/requests/schemas/request-form-schema";

describe("toCreateRequestSubmissionRequest", () => {
  it("任意項目の空文字をnullへ変換し、必須項目を維持する", () => {
    const values: SubmitRequestFormValues = {
      title: "開発用モニターの購入",
      reason: "開発環境を改善するため",
      desiredDeliveryDate: "2026-11-10",
      requestedSupplierId: "00000000-0000-4000-8000-000000000001",
      note: "",
      items: [
        {
          productName: "27インチモニター",
          modelNumber: "",
          productUrl: "",
          categoryId: "00000000-0000-4000-8000-000000000002",
          quantity: 2,
          plannedUnitPrice: 50000,
        },
      ],
    };

    expect(toCreateRequestSubmissionRequest(values)).toEqual({
      title: "開発用モニターの購入",
      reason: "開発環境を改善するため",
      desiredDeliveryDate: "2026-11-10",
      requestedSupplierId: "00000000-0000-4000-8000-000000000001",
      note: null,
      items: [
        {
          productName: "27インチモニター",
          modelNumber: null,
          productUrl: null,
          categoryId: "00000000-0000-4000-8000-000000000002",
          quantity: 2,
          plannedUnitPrice: 50000,
        },
      ],
    });
  });
});
