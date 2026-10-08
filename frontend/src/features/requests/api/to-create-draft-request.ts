import type { DraftRequestFormValues } from "@/features/requests/schemas/request-form-schema";
import type { CreateDraftRequest } from "@/features/requests/types";

export function toCreateDraftRequest(values: DraftRequestFormValues): CreateDraftRequest {
  const items = values.items
    .filter(
      (item) =>
        item.productName !== "" ||
        item.modelNumber !== "" ||
        item.productUrl !== "" ||
        item.categoryId !== "" ||
        item.quantity !== undefined ||
        item.plannedUnitPrice !== undefined,
    )
    .map((item) => {
      const productName = item.productName === "" ? null : item.productName;
      const modelNumber = item.modelNumber === "" ? null : item.modelNumber;
      const productUrl = item.productUrl === "" ? null : item.productUrl;
      const categoryId = item.categoryId === "" ? null : item.categoryId;
      const quantity = item.quantity === undefined ? null : item.quantity;
      const plannedUnitPrice = item.plannedUnitPrice === undefined ? null : item.plannedUnitPrice;

      return {
        productName,
        modelNumber,
        productUrl,
        categoryId,
        quantity,
        plannedUnitPrice,
      };
    });
  const title = values.title === "" ? null : values.title;
  const reason = values.reason === "" ? null : values.reason;
  const desiredDeliveryDate = values.desiredDeliveryDate === "" ? null : values.desiredDeliveryDate;
  const requestedSupplierId = values.requestedSupplierId === "" ? null : values.requestedSupplierId;
  const note = values.note === "" ? null : values.note;

  return {
    title,
    reason,
    desiredDeliveryDate,
    requestedSupplierId,
    note,
    items,
  };
}
