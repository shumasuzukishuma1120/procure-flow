import type { ApiProblemResponse } from "@/lib/api/types";

export class ApiError extends Error {
  readonly status: number;
  readonly problem: ApiProblemResponse | null;

  constructor(status: number, problem: ApiProblemResponse | null) {
    const message = problem?.detail ?? problem?.title ?? `API request failed with status ${status}`;

    super(message);

    this.name = "ApiError";
    this.status = status;
    this.problem = problem;
  }
}
