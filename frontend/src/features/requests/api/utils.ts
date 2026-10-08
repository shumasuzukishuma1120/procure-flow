import type { ApiProblemResponse } from "@/lib/api/types";

export async function readApiProblem(response: Response): Promise<ApiProblemResponse | null> {
  try {
    return (await response.json()) as ApiProblemResponse;
  } catch {
    return null;
  }
}