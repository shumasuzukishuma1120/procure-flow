import { z } from "zod";

const dateOnlySchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "日付を選択してください");

export const purchaseOrderFormSchema = z.object({
  actualSupplierId: z.string().uuid("仕入先を選択してください"),
  purchaseOrderNumber: z.string().trim().min(1, "発注番号を入力してください").max(100, "100文字以内で入力してください"),
  promisedDeliveryDate: dateOnlySchema,
  purchaserNote: z.string().max(1000, "1,000文字以内で入力してください"),
  items: z.array(z.object({
    requestItemId: z.string().uuid(),
    actualUnitPrice: z.number().int().min(1, "1円以上で入力してください").max(99_999_999, "99,999,999円以内で入力してください"),
  })).min(1),
});

export type PurchaseOrderFormValues = z.infer<typeof purchaseOrderFormSchema>;

export const receiptFormSchema = z.object({
  receivedDate: dateOnlySchema,
  receiptNote: z.string().max(1000, "1,000文字以内で入力してください"),
  allItemsReceived: z.boolean().refine((value) => value, "全商品を受領したことを確認してください"),
});

export type ReceiptFormValues = z.infer<typeof receiptFormSchema>;
