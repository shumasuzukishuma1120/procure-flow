import type { DraftRequestFormValues } from "@/features/requests/schemas/request-form-schema";

export function hasDraftContent(values: DraftRequestFormValues): boolean {
  const hasRequestContent = [
    values.title,
    values.reason,
    values.desiredDeliveryDate,
    values.requestedSupplierId,
    values.note,
  ].some((value) => value.trim() !== "");

  const hasRequestItemContent = values.items.some((item) => {
    const hasTextContent = [
      item.productName,
      item.modelNumber,
      item.productUrl,
      item.categoryId,
    ].some((value) => value.trim() !== "");

    return hasTextContent || item.quantity !== undefined || item.plannedUnitPrice !== undefined;
  });

  return hasRequestContent || hasRequestItemContent;
}
