import { rejectRequest } from "@/features/approvals/api/reject-request";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useRejectRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["approvals", "reject"],
    mutationFn: rejectRequest,
    retry: false,
    onSuccess: async () => queryClient.invalidateQueries({ queryKey: ["approvals", "list"] }),
  });
}
