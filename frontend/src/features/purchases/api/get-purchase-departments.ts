import "server-only";

import type { PurchaseDepartmentResponse } from "@/features/purchases/types";
import { ApiError } from "@/lib/api/api-error";
import { readApiProblem } from "@/lib/api/read-api-problem";

export async function getPurchaseDepartments(): Promise<PurchaseDepartmentResponse[]> {
  const backendApiUrl = process.env.BACKEND_API_URL;
  if (!backendApiUrl) throw new Error("BACKEND_API_URLが設定されていません。");

  const response = await fetch(new URL("/api/purchases/departments", backendApiUrl), {
    cache: "no-store",
  });
  if (!response.ok) throw new ApiError(response.status, await readApiProblem(response));

  return (await response.json()) as PurchaseDepartmentResponse[];
}
