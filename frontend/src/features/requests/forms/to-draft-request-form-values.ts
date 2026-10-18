import { createEmptyRequestItemFormValues } from "@/features/requests/forms/request-form-default-values";
import type { DraftRequestFormValues } from "@/features/requests/schemas/request-form-schema";
import type { DraftRequestResponse } from "@/features/requests/types";

export function toDraftRequestFormValues(response: DraftRequestResponse): DraftRequestFormValues {
  const items = response.items.map((item) => {
    const productName = item.productName === null ? "" : item.productName;
    const modelNumber = item.modelNumber === null ? "" : item.modelNumber;
    const productUrl = item.productUrl === null ? "" : item.productUrl;
    const categoryId = item.categoryId === null ? "" : item.categoryId;
    const quantity = item.quantity === null ? undefined : item.quantity;
    const plannedUnitPrice = item.plannedUnitPrice === null ? undefined : item.plannedUnitPrice;

    return {
      productName,
      modelNumber,
      productUrl,
      categoryId,
      quantity,
      plannedUnitPrice,
    };
  });

  const formItems = items.length > 0 ? items : [createEmptyRequestItemFormValues()];

  const title = response.title === null ? "" : response.title;
  const reason = response.reason === null ? "" : response.reason;
  const desiredDeliveryDate =
    response.desiredDeliveryDate === null ? "" : response.desiredDeliveryDate;
  const requestedSupplierId =
    response.requestedSupplierId === null ? "" : response.requestedSupplierId;
  const note = response.note === null ? "" : response.note;

  return {
    title,
    reason,
    desiredDeliveryDate,
    requestedSupplierId,
    note,
    items: formItems,
  };
}
