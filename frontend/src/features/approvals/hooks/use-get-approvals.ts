import { getApprovals } from "@/features/approvals/api/get-approvals";
import type { ApprovalListQuery } from "@/features/approvals/types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export function useGetApprovals(query: ApprovalListQuery) {
  return useQuery({
    queryKey: ["approvals", "list", query],
    queryFn: ({ signal }) => getApprovals(query, signal),
    staleTime: 15_000,
    gcTime: 5 * 60_000,
    placeholderData: keepPreviousData,
  });
}
