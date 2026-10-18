import "server-only";

import type { DashboardResponse } from "@/features/dashboard/types";
import { ApiError } from "@/lib/api/api-error";
import { readApiProblem } from "@/lib/api/read-api-problem";

export async function getDashboard(): Promise<DashboardResponse> {
  const backendApiUrl = process.env.BACKEND_API_URL;

  if (!backendApiUrl) {
    throw new Error("BACKEND_API_URL is not defined");
  }

  const requestUrl = new URL("/api/dashboard", backendApiUrl);

  const response = await fetch(requestUrl, {
    cache: "no-store",
  });

  if (!response.ok) {
    const problem = await readApiProblem(response);
    throw new ApiError(response.status, problem);
  }

  const data: DashboardResponse = await response.json();

  return data;
}
