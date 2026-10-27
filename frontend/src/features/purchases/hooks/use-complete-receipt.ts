import { completeReceipt } from "@/features/purchases/api/complete-receipt";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCompleteReceipt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["purchases", "receipt"],
    mutationFn: completeReceipt,
    retry: false,
    onSuccess: async () => queryClient.invalidateQueries({ queryKey: ["purchases", "list"] }),
  });
}
