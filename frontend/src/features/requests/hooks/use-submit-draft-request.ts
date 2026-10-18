import { submitDraftRequest } from "@/features/requests/api/submit-draft-request";
import { useMutation } from "@tanstack/react-query";

export function useEditRequestSubmissions() {
  return useMutation({
    mutationKey: ["requests", "edit-submission"],
    mutationFn: submitDraftRequest,
    retry: false,
  })
}