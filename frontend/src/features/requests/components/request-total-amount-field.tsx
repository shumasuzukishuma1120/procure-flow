import RequestTotalAmount from "@/features/requests/components/request-total-amount";
import { type DraftRequestFormValues } from "@/features/requests/schemas/request-form-schema";
import { calculateRequestItemAmount } from "@/features/requests/utils/calculate-request-item-amount";
import { useFormContext, useWatch } from "react-hook-form";

export default function RequestTotalAmountField() {
  const { control } = useFormContext<DraftRequestFormValues>();

  const watchedItems = useWatch({
    control,
    name: "items",
  });

  const itemAmounts = watchedItems.map((item) =>
    calculateRequestItemAmount(item.quantity, item.plannedUnitPrice),
  );

  const areAllItemsCalculable =
    itemAmounts.length > 0 && itemAmounts.every((amount): amount is number => amount !== undefined);

  const requestTotalAmount = areAllItemsCalculable
    ? itemAmounts.reduce((total, amount) => total + amount, 0)
    : undefined;

  return <RequestTotalAmount amount={requestTotalAmount} />;
}
