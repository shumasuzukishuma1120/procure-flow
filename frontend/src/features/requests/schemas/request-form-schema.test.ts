import { describe, expect, it } from "vitest";
import {
  draftRequestFormSchema,
  submitRequestFormSchema,
  type SubmitRequestFormValues,
} from "@/features/requests/schemas/request-form-schema";
import { createDraftRequestFormDefaultValues } from "@/features/requests/forms/request-form-default-values";

function createValidSubmitValues(): SubmitRequestFormValues {
  return {
    title: "開発用モニターの購入",
    reason: "開発環境改善のため",
    desiredDeliveryDate: "2026-11-10",
    requestedSupplierId: "00000000-0000-4000-8000-000000000001",
    note: "",
    items: [
      {
        productName: "27インチモニター",
        modelNumber: "",
        productUrl: "",
        categoryId: "00000000-0000-4000-8000-000000000002",
        quantity: 1,
        plannedUnitPrice: 50000,
      },
    ],
  };
}

describe("request-form-schema", () => {
  describe("draftRequestFormSchema", () => {
    it("全項目が空でも成功する", () => {
      const values = createDraftRequestFormDefaultValues();
      const result = draftRequestFormSchema.safeParse(values);

      expect(result.success).toBe(true);
    });
  });

  describe("submitRequestFormSchema", () => {
    describe("有効な入力", () => {
      it("必要な項目が入力されている場合は成功する", () => {
        const values = createValidSubmitValues();
        const result = submitRequestFormSchema.safeParse(values);

        expect(result.success).toBe(true);
      });

      it("タイトルが100文字の場合は成功する", () => {
        const values = createValidSubmitValues();
        values.title = "a".repeat(100);
        const result = submitRequestFormSchema.safeParse(values);

        expect(result.success).toBe(true);
      });
    });
    describe("無効な入力", () => {
      it("下書き用の空データを申請する場合は失敗する", () => {
        const values = createDraftRequestFormDefaultValues();
        const result = submitRequestFormSchema.safeParse(values);

        expect(result.success).toBe(false);
      });

      it("タイトルが空白文字だけの場合は失敗する", () => {
        const values = createValidSubmitValues();
        values.title = "   ";
        const result = submitRequestFormSchema.safeParse(values);

        expect(result.success).toBe(false);
      });

      it("タイトルが空文字の場合は失敗する", () => {
        const values = createValidSubmitValues();
        values.title = "";
        const result = submitRequestFormSchema.safeParse(values);

        expect(result.success).toBe(false);
      });

      it("タイトルが101文字の場合は失敗する", () => {
        const values = createValidSubmitValues();
        values.title = "a".repeat(101);
        const result = submitRequestFormSchema.safeParse(values);

        expect(result.success).toBe(false);
      });

      it("希望納期がYYYY-MM-DD形式でない場合は失敗する", () => {
        const values = createValidSubmitValues();
        values.desiredDeliveryDate = "2026/11/10";
        const result = submitRequestFormSchema.safeParse(values);

        expect(result.success).toBe(false);
      });

      it("明細が0件の場合は失敗する", () => {
        const values = createValidSubmitValues();
        values.items = [];
        const result = submitRequestFormSchema.safeParse(values);

        expect(result.success).toBe(false);
      });
    });
  });
});
