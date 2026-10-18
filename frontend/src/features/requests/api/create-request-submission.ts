import { readApiProblem } from "@/lib/api/read-api-problem";;
import type {
  CreateRequestSubmissionRequest,
  RequestSubmissionResponse,
} from "@/features/requests/types";
import { ApiError } from "@/lib/api/api-error";

type CreateRequestSubmissionParams = {
  request: CreateRequestSubmissionRequest;
  idempotencyKey: string;
};


export async function createRequestSubmission({
  request,
  idempotencyKey,
}: CreateRequestSubmissionParams): Promise<RequestSubmissionResponse> {
  const response = await fetch("/api/request-submissions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const problem = await readApiProblem(response);
    throw new ApiError(response.status, problem);
  }

  const data: RequestSubmissionResponse = await response.json();
  return data;
}
