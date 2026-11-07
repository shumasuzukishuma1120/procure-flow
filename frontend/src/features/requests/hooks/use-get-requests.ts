import { getRequests } from "@/features/requests/api/get-requests";
import type { MyRequestListQuery } from "@/features/requests/types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export function useGetRequests(query: MyRequestListQuery) {
  return useQuery({
    queryKey: ["requests", "list", query],
    queryFn: ({ signal }) => getRequests(query, signal),
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    retry: false,
    placeholderData: keepPreviousData,
  });
}
