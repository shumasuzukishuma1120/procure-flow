import { describe, expect, it } from "vitest";
import { toCreateDraftRequest } from "@/features/requests/api/to-create-draft-request";
import { createDraftRequestFormDefaultValues } from "@/features/requests/forms/request-form-default-values";

describe("toCreateDraftRequest", () => {
  it("空文字をnullへ変換し、空の明細を送信対象から除外する", () => {
    const values = createDraftRequestFormDefaultValues();

    expect(toCreateDraftRequest(values)).toEqual({
      title: null,
      reason: null,
      desiredDeliveryDate: null,
      requestedSupplierId: null,
      note: null,
      items: [],
    });
  });

  it("一部だけ入力された明細を残し、未入力項目をnullへ変換する", () => {
    const values = createDraftRequestFormDefaultValues();
    values.title = "型番だけ決まっている申請";
    values.items[0].modelNumber = "MONITOR-001";

    expect(toCreateDraftRequest(values)).toEqual({
      title: "型番だけ決まっている申請",
      reason: null,
      desiredDeliveryDate: null,
      requestedSupplierId: null,
      note: null,
      items: [
        {
          productName: null,
          modelNumber: "MONITOR-001",
          productUrl: null,
          categoryId: null,
          quantity: null,
          plannedUnitPrice: null,
        },
      ],
    });
  });
});
