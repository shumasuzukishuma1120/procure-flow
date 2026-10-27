import { createPurchaseOrder } from "@/features/purchases/api/create-purchase-order";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreatePurchaseOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["purchases", "order"],
    mutationFn: createPurchaseOrder,
    retry: false,
    onSuccess: async () => queryClient.invalidateQueries({ queryKey: ["purchases", "list"] }),
  });
}
