import { z } from "zod";

const httpUrlSchema = z.url({
  protocol: /^https?$/,
});

export const draftRequestItemFormSchema = z.object({
  productName: z.string().trim().max(200, { error: "商品名は200文字以内で入力してください" }),
  modelNumber: z.string().trim().max(100, { error: "型番は100文字以内で入力してください" }),
  productUrl: z
    .string()
    .trim()
    .max(2_048, { error: "商品URLは2048以内で入力してください" })
    .refine((value) => value === "" || httpUrlSchema.safeParse(value).success, {
      error: "商品URLにはhttpまたはhttpsから始まるURLを入力してください",
    }),
  categoryId: z.union([z.literal(""), z.uuid()], { error: "有効なカテゴリを選択してください" }),
  quantity: z
    .number({ error: "数量は数値で入力してください" })
    .int({ error: "数量は整数で入力してください" })
    .min(1, { error: "数量は1以上で入力してください" })
    .max(9_999, { error: "数量は9999以下で入力してください" })
    .optional(),
  plannedUnitPrice: z
    .number({ error: "予定単価は数値で入力してください" })
    .int({ error: "予定単価は整数で入力してください" })
    .min(1, { error: "予定単価は1円以上で入力してください" })
    .max(99_999_999, { error: "予定単価は99,999,999円以下で入力してください" })
    .optional(),
});

export type DraftRequestItemFormValues = z.infer<typeof draftRequestItemFormSchema>;
