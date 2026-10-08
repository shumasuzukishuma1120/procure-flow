import { type SubmitRequestFormValues } from "@/features/requests/schemas/request-form-schema";
import type {
  CreateRequestSubmissionItemRequest,
  CreateRequestSubmissionRequest,
} from "@/features/requests/types";

export function toCreateRequestSubmissionRequest(
  values: SubmitRequestFormValues,
): CreateRequestSubmissionRequest {
  const note = values.note === "" ? null : values.note;
  const items: CreateRequestSubmissionItemRequest[] = values.items.map((item) => {
    const modelNumber = item.modelNumber === "" ? null : item.modelNumber;
    const productUrl = item.productUrl === "" ? null : item.productUrl;
    return {
      productName: item.productName,
      modelNumber,
      productUrl,
      categoryId: item.categoryId,
      quantity: item.quantity,
      plannedUnitPrice: item.plannedUnitPrice,
    };
  });

  return {
    title: values.title,
    reason: values.reason,
    desiredDeliveryDate: values.desiredDeliveryDate,
    requestedSupplierId: values.requestedSupplierId,
    note,
    items,
  };
}
