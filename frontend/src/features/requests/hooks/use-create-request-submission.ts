import { createRequestSubmission } from "@/features/requests/api/create-request-submission";
import { useMutation } from "@tanstack/react-query";

export function useCreateRequestSubmission() {
  return useMutation({
    mutationKey: ["requests", "create-submission"],
    mutationFn: createRequestSubmission,
    retry: false,
  });
}
