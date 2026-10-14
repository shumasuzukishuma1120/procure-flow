import {
  deleteDraftRequest,
  type DeleteDraftRequestParams,
} from "@/features/requests/api/delete-draft-request";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteDraftRequest() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, DeleteDraftRequestParams>({
    mutationKey: ["requests", "delete-draft"],
    mutationFn: deleteDraftRequest,
    retry: false,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["requests", "list"] });
    },
  });
}
