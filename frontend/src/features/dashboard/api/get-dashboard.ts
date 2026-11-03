import "server-only";

import type { DashboardResponse } from "@/features/dashboard/types";
import { ApiError } from "@/lib/api/api-error";
import { readApiProblem } from "@/lib/api/read-api-problem";
import { fetchSpringBoot } from "@/lib/api/server/fetch-spring-boot";

export async function getDashboard(): Promise<DashboardResponse> {
  const backendApiUrl = process.env.BACKEND_API_URL;

  if (!backendApiUrl) {
    throw new Error("BACKEND_API_URLが設定されていません。");
  }

  const requestUrl = new URL("/api/dashboard", backendApiUrl);

  const response = await fetchSpringBoot(requestUrl, {
    cache: "no-store",
  });

  if (!response.ok) {
    const problem = await readApiProblem(response);
    throw new ApiError(response.status, problem);
  }

  const data: DashboardResponse = await response.json();

  return data;
}
