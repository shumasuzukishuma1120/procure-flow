import {
  MAX_QUANTITY,
  MAX_PLANNED_UNIT_PRICE,
} from "@/features/requests/constants/request-constraints";
import { z } from "zod";

const httpUrlSchema = z.url({
  protocol: /^https?$/,
});
const productNameSchema = z
  .string()
  .trim()
  .max(200, { error: "商品名は200文字以内で入力してください" });
const quantitySchema = z
  .number({ error: "数量は数値で入力してください" })
  .int({ error: "数量は整数で入力してください" })
  .min(1, { error: "数量は1以上で入力してください" })
  .max(MAX_QUANTITY, { error: `数量は${MAX_QUANTITY.toLocaleString("ja-JP")}以下で入力してください` });
const plannedUnitPriceSchema = z
  .number({ error: "予定単価は数値で入力してください" })
  .int({ error: "予定単価は整数で入力してください" })
  .min(1, { error: "予定単価は1円以上で入力してください" })
  .max(MAX_PLANNED_UNIT_PRICE, {
    error: `予定単価は${MAX_PLANNED_UNIT_PRICE.toLocaleString("ja-JP")}円以下で入力してください`,
  });
const categoryIdSchema = z.uuid({ error: "有効なカテゴリを選択してください" });

export const draftRequestItemFormSchema = z.object({
  productName: productNameSchema,
  modelNumber: z.string().trim().max(100, { error: "型番は100文字以内で入力してください" }),
  productUrl: z
    .string()
    .trim()
    .max(2_048, { error: "商品URLは2048文字以内で入力してください" })
    .refine((value) => value === "" || httpUrlSchema.safeParse(value).success, {
      error: "商品URLにはhttpまたはhttpsから始まるURLを入力してください",
    }),
  categoryId: z.union([z.literal(""), categoryIdSchema]),
  quantity: quantitySchema.optional(),
  plannedUnitPrice: plannedUnitPriceSchema.optional(),
});

export type DraftRequestItemFormValues = z.infer<typeof draftRequestItemFormSchema>;

export const submitRequestItemFormSchema = draftRequestItemFormSchema.extend({
  productName: productNameSchema.min(1, { error: "商品名は必須です" }),
  categoryId: categoryIdSchema,
  quantity: quantitySchema,
  plannedUnitPrice: plannedUnitPriceSchema,
});

export type SubmitRequestItemFormValues = z.infer<typeof submitRequestItemFormSchema>;
