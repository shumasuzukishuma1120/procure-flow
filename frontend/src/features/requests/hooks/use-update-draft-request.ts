import {
  updateDraftRequest,
  type UpdateDraftRequestParams,
} from "@/features/requests/api/update-draft-request";
import type { DraftRequestResponse } from "@/features/requests/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateDraftRequest() {
  const queryClient = useQueryClient();

  return useMutation<DraftRequestResponse, Error, UpdateDraftRequestParams>({
    mutationKey: ["requests", "update-draft"],
    mutationFn: updateDraftRequest,
    retry: false,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["requests", "list"] });
    },
  });
}
