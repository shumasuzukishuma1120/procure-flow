import { createDraftRequest } from "@/features/requests/api/create-draft-request";
import { useMutation } from "@tanstack/react-query";

export function useCreateDraftRequest() {
  return useMutation({
    mutationKey: ["requests", "create-draft"],
    mutationFn: createDraftRequest,
    retry: false,
  });
}
