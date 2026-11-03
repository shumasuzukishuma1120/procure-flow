import "server-only";
import { ApiError } from "@/lib/api/api-error";
import { readApiProblem } from "@/lib/api/read-api-problem";
import { fetchSpringBoot } from "@/lib/api/server/fetch-spring-boot";
import { type CurrentUser } from "@/features/auth/types";

export async function getCurrentUser(): Promise<CurrentUser> {
  const backendApiUrl = process.env.BACKEND_API_URL;
  if (!backendApiUrl) {
    throw new Error("BACKEND_API_URLが設定されていません。");
  }

  const response = await fetchSpringBoot(new URL("/api/me", backendApiUrl), {
    cache: "no-store",
  });
  if (!response.ok) {
    throw new ApiError(response.status, await readApiProblem(response));
  }

  return (await response.json()) as CurrentUser;
}
