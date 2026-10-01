import { draftRequestItemFormSchema } from "@/features/requests/schemas/request-item-form-schema";
import { z } from "zod";

export const draftRequestFormSchema = z.object({
  title: z.string().trim().max(100, { error: "タイトルは100文字以内で入力してください" }),
  reason: z.string().trim().max(1_000, { error: "理由は1,000文字以内で入力してください" }),
  desiredDeliveryDate: z.union([z.literal(""), z.iso.date()], {
    error: "希望納期はYYYY-MM-DD形式で入力してください",
  }),
  requestedSupplierId: z.union([z.literal(""), z.uuid()], {
    error: "有効な希望仕入先を選択してください",
  }),
  note: z.string().trim().max(1_000, { error: "備考は1,000文字以内で入力してください" }),
  items: z.array(draftRequestItemFormSchema).max(20, {
    error: "商品明細は20件以下にしてください",
  }),
});

export type DraftRequestFormValues = z.infer<typeof draftRequestFormSchema>;
