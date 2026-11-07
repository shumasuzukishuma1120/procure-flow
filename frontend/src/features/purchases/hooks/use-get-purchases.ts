import { getPurchases } from "@/features/purchases/api/get-purchases";
import type { PurchaseListQuery } from "@/features/purchases/types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export function useGetPurchases(query: PurchaseListQuery) {
  return useQuery({
    queryKey: ["purchases", "list", query],
    queryFn: ({ signal }) => getPurchases(query, signal),
    staleTime: 15_000,
    gcTime: 5 * 60_000,
    placeholderData: keepPreviousData,
  });
}
