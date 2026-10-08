export function calculateRequestItemAmount(
  quantity: number | undefined,
  plannedUnitPrice: number | undefined,
): number | undefined {
  const isValidQuantity =
    typeof quantity === "number" && Number.isSafeInteger(quantity) && quantity >= 1;

  const isValidPlannedUnitPrice =
    typeof plannedUnitPrice === "number" &&
    Number.isSafeInteger(plannedUnitPrice) &&
    plannedUnitPrice >= 1;

  if (!isValidQuantity || !isValidPlannedUnitPrice) {
    return undefined;
  }
  return quantity * plannedUnitPrice;
}