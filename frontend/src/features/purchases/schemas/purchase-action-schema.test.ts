import { describe, expect, it } from "vitest";
import {
  purchaseOrderFormSchema,
  receiptFormSchema,
  type PurchaseOrderFormValues,
  type ReceiptFormValues,
} from "@/features/purchases/schemas/purchase-action-schema";

function createValidPurchaseOrderValues(): PurchaseOrderFormValues {
  return {
    actualSupplierId: "00000000-0000-4000-8000-000000000001",
    purchaseOrderNumber: "PO-2026-000001",
    promisedDeliveryDate: "2026-11-10",
    purchaserNote: "",
    items: [
      {
        requestItemId: "00000000-0000-4000-8000-000000000002",
        actualUnitPrice: 50000,
      },
    ],
  };
}

describe("purchaseOrderFormSchema", () => {
  describe("有効な入力", () => {
    it("必要な項目が入力されている場合は成功する", () => {
      const values = createValidPurchaseOrderValues();
      const result = purchaseOrderFormSchema.safeParse(values);

      expect(result.success).toBe(true);
    });

    it("実単価が1円の場合は成功する", () => {
      const base = createValidPurchaseOrderValues();
      const values = {
        ...base,
        items: [
          {
            ...base.items[0],
            actualUnitPrice: 1,
          },
        ],
      };
      const result = purchaseOrderFormSchema.safeParse(values);

      expect(result.success).toBe(true);
    });
  });
  describe("無効な入力", () => {
    it("発注番号が空白文字だけの場合は失敗する", () => {
      const values = createValidPurchaseOrderValues();
      values.purchaseOrderNumber = "   ";
      const result = purchaseOrderFormSchema.safeParse(values);

      expect(result.success).toBe(false);
    });

    it("仕入先IDがUUIDでない場合は失敗する", () => {
      const values = createValidPurchaseOrderValues();
      values.actualSupplierId = "無効なUUID";
      const result = purchaseOrderFormSchema.safeParse(values);

      expect(result.success).toBe(false);
    });

    it("明細が0件の場合は失敗する", () => {
      const base = createValidPurchaseOrderValues();
      const values = {
        ...base,
        items: [],
      };
      const result = purchaseOrderFormSchema.safeParse(values);

      expect(result.success).toBe(false);
    });

    it("実単価が0円の場合は失敗する", () => {
      const base = createValidPurchaseOrderValues();
      const values = {
        ...base,
        items: [
          {
            ...base.items[0],
            actualUnitPrice: 0,
          },
        ],
      };
      const result = purchaseOrderFormSchema.safeParse(values);

      expect(result.success).toBe(false);
    });

    it("納品予定日がYYYY-MM-DD形式でない場合は失敗する", () => {
      const values = createValidPurchaseOrderValues();
      values.promisedDeliveryDate = "2026/11/10";
      const result = purchaseOrderFormSchema.safeParse(values);

      expect(result.success).toBe(false);
    });
  });
});

function createValidReceiptValues(): ReceiptFormValues {
  return {
    receivedDate: "2026-11-10",
    receiptNote: "",
    allItemsReceived: true,
  };
}

describe("receiptFormSchema", () => {
  describe("有効な入力", () => {
    it("有効な入力の場合は成功する", () => {
      const values = createValidReceiptValues();
      const result = receiptFormSchema.safeParse(values);

      expect(result.success).toBe(true);
    });

    it("受領メモが1000文字の場合は成功する", () => {
      const values = createValidReceiptValues();
      values.receiptNote = "a".repeat(1000);
      const result = receiptFormSchema.safeParse(values);

      expect(result.success).toBe(true);
    });
  });
  describe("無効な入力", () => {
    it("全商品受領が未確認の場合は失敗する", () => {
      const values = createValidReceiptValues();
      values.allItemsReceived = false;
      const result = receiptFormSchema.safeParse(values);

      expect(result.success).toBe(false);
    });

    it("受領日がYYYY-MM-DD形式でない場合は失敗する", () => {
      const values = createValidReceiptValues();
      values.receivedDate = "2026/11/10";
      const result = receiptFormSchema.safeParse(values);

      expect(result.success).toBe(false);
    });

    it("受領メモが1000文字を超える場合は失敗する", () => {
      const values = createValidReceiptValues();
      values.receiptNote = "a".repeat(1001);
      const result = receiptFormSchema.safeParse(values);

      expect(result.success).toBe(false);
    });
  });
});
