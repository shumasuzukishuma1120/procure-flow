import { approveRequest } from "@/features/approvals/api/approve-request";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useApproveRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["approvals", "approve"],
    mutationFn: approveRequest,
    retry: false,
    onSuccess: async () => queryClient.invalidateQueries({ queryKey: ["approvals", "list"] }),
  });
}
