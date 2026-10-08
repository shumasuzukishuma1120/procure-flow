import type { DraftRequestFormValues } from "@/features/requests/schemas/request-form-schema";
import type { FieldPath } from "react-hook-form";

const requestItemProductNamePattern = /^items\[(\d+)\]\.productName$/;

export function toRequestFormFieldPath(
  apiField: string,
  itemCount: number,
): FieldPath<DraftRequestFormValues> | null {
  if (apiField === "title") {
    return "title";
  }

  const match = requestItemProductNamePattern.exec(apiField);

  if (!match) {
    return null;
  }

  const itemIndex = Number(match[1]);

  if (!Number.isInteger(itemIndex) || itemIndex < 0 || itemIndex >= itemCount) {
    return null;
  }

  return `items.${itemIndex}.productName`;
}
