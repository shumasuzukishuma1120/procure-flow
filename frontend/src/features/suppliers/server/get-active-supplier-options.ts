import "server-only";
import type { SupplierOption } from "@/features/suppliers/types";
import { ApiError } from "@/lib/api/api-error";
import { readApiProblem } from "@/lib/api/read-api-problem";
import { fetchSpringBoot } from "@/lib/api/server/fetch-spring-boot";

export async function getActiveSupplierOptions(): Promise<SupplierOption[]> {
  const backendApiUrl = process.env.BACKEND_API_URL;
  if (!backendApiUrl) throw new Error("BACKEND_API_URLが設定されていません。");
  const response = await fetchSpringBoot(new URL("/api/reference-data/suppliers", backendApiUrl));
  if (!response.ok) throw new ApiError(response.status, await readApiProblem(response));
  return (await response.json()) as SupplierOption[];
}
