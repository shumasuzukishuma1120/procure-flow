import type { DraftRequestFormValues } from "@/features/requests/schemas/request-form-schema";
import type { DraftRequestItemFormValues } from "@/features/requests/schemas/request-item-form-schema";

export function createEmptyRequestItemFormValues(): DraftRequestItemFormValues {
  return {
    productName: "",
    modelNumber: "",
    productUrl: "",
    categoryId: "",
    quantity: undefined,
    plannedUnitPrice: undefined,
  };
}

export function createDraftRequestFormDefaultValues(): DraftRequestFormValues {
  return {
    title: "",
    reason: "",
    desiredDeliveryDate: "",
    requestedSupplierId: "",
    note: "",
    items: [createEmptyRequestItemFormValues()],
  };
}
