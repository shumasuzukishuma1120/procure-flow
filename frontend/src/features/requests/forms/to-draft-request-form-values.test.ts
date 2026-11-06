import { describe, expect, it } from "vitest";
import { toDraftRequestFormValues } from "@/features/requests/forms/to-draft-request-form-values";
import type { DraftRequestResponse } from "@/features/requests/types";

const baseResponse: DraftRequestResponse = {
  requestId: "00000000-0000-4000-8000-000000000001",
  requestNumber: null,
  status: "DRAFT",
  title: null,
  reason: null,
  desiredDeliveryDate: null,
  requestedSupplierId: null,
  note: null,
  items: [],
  totalAmount: 0,
  version: 1,
  createdAt: "2026-10-29T00:00:00Z",
  updatedAt: "2026-10-29T00:00:00Z",
};

describe("toDraftRequestFormValues", () => {
  it("nullをフォームの未入力値へ変換し、明細が0件なら空の明細を1件用意する", () => {
    expect(toDraftRequestFormValues(baseResponse)).toEqual({
      title: "",
      reason: "",
      desiredDeliveryDate: "",
      requestedSupplierId: "",
      note: "",
      items: [
        {
          productName: "",
          modelNumber: "",
          productUrl: "",
          categoryId: "",
          quantity: undefined,
          plannedUnitPrice: undefined,
        },
      ],
    });
  });

  it("取得した明細のnullをフォームの未入力値へ変換する", () => {
    const response: DraftRequestResponse = {
      ...baseResponse,
      title: "開発用モニターの購入",
      items: [
        {
          productName: "27インチモニター",
          modelNumber: null,
          productUrl: null,
          categoryId: "00000000-0000-4000-8000-000000000002",
          quantity: 2,
          plannedUnitPrice: null,
        },
      ],
    };

    expect(toDraftRequestFormValues(response)).toEqual({
      title: "開発用モニターの購入",
      reason: "",
      desiredDeliveryDate: "",
      requestedSupplierId: "",
      note: "",
      items: [
        {
          productName: "27インチモニター",
          modelNumber: "",
          productUrl: "",
          categoryId: "00000000-0000-4000-8000-000000000002",
          quantity: 2,
          plannedUnitPrice: undefined,
        },
      ],
    });
  });
});
