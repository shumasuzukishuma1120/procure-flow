import { MAX_REQUEST_ITEM_COUNT } from "@/features/requests/constants/request-constraints";
import {
  draftRequestItemFormSchema,
  submitRequestItemFormSchema,
} from "@/features/requests/schemas/request-item-form-schema";
import { z } from "zod";

const titleSchema = z
  .string()
  .trim()
  .max(100, { error: "タイトルは100文字以内で入力してください" });
const reasonSchema = z
  .string()
  .trim()
  .max(1_000, { error: "理由は1,000文字以内で入力してください" });
const desiredDeliveryDateSchema = z.iso.date({
  error: "希望納期はYYYY-MM-DD形式で入力してください",
});
const requestedSupplierIdSchema = z.uuid({ error: "有効な希望仕入先を選択してください" });

export const draftRequestFormSchema = z.object({
  title: titleSchema,
  reason: reasonSchema,
  desiredDeliveryDate: z.union([z.literal(""), desiredDeliveryDateSchema]),
  requestedSupplierId: z.union([z.literal(""), requestedSupplierIdSchema]),
  note: z.string().trim().max(1_000, { error: "備考は1,000文字以内で入力してください" }),
  items: z.array(draftRequestItemFormSchema).max(MAX_REQUEST_ITEM_COUNT, {
    error: `商品明細は${MAX_REQUEST_ITEM_COUNT}件以下にしてください`,
  }),
});

export type DraftRequestFormValues = z.infer<typeof draftRequestFormSchema>;

export const submitRequestFormSchema = draftRequestFormSchema.extend({
  title: titleSchema.min(1, { error: "タイトルは必須です" }),
  reason: reasonSchema.min(1, { error: "申請理由を入力してください" }),
  desiredDeliveryDate: z
    .string()
    .min(1, { error: "希望納期を選択してください" })
    .pipe(desiredDeliveryDateSchema),
  requestedSupplierId: z
    .string()
    .min(1, { error: "希望仕入先を選択してください" })
    .pipe(requestedSupplierIdSchema),
  items: z
    .array(submitRequestItemFormSchema)
    .min(1, { error: "申請明細は必須です" })
    .max(MAX_REQUEST_ITEM_COUNT, {
      error: `商品明細は${MAX_REQUEST_ITEM_COUNT}件以下にしてください`,
    }),
});

export type SubmitRequestFormValues = z.infer<typeof submitRequestFormSchema>;
