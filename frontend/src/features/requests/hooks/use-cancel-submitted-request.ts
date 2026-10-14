import {
  cancelSubmittedRequest,
  type CancelSubmittedRequestParams,
} from "@/features/requests/api/cancel-submitted-request";
import type { CancelRequestResponse } from "@/features/requests/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCancelSubmittedRequest() {
  const queryClient = useQueryClient();

  return useMutation<CancelRequestResponse, Error, CancelSubmittedRequestParams>({
    mutationKey: ["requests", "cancel"],
    mutationFn: cancelSubmittedRequest,
    retry: false,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["requests", "list"] });
    },
  });
}
