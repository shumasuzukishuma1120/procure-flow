import type { RequestStatus } from "@/features/requests/types";

export const APPROVAL_LIST_PAGE_SIZES = [20, 50, 100] as const;
export type ApprovalListPageSize = (typeof APPROVAL_LIST_PAGE_SIZES)[number];

export const APPROVAL_SORTS = ["OLDEST", "NEWEST", "DELIVERY_DATE_ASC", "AMOUNT_DESC"] as const;
export type ApprovalSort = (typeof APPROVAL_SORTS)[number];

export type ApprovalListQuery = {
  page: number;
  size: ApprovalListPageSize;
  sort: ApprovalSort;
  keyword?: string;
  submittedFrom?: string;
  submittedTo?: string;
  departmentId?: string;
  overdueOnly?: boolean;
};

export type ApprovalListItemResponse = {
  requestId: string;
  requestNumber: string;
  title: string;
  status: RequestStatus;
  applicantName: string;
  departmentId: string;
  departmentName: string;
  requestedSupplierName: string;
  totalAmount: number;
  desiredDeliveryDate: string;
  overdue: boolean;
  submittedAt: string;
  version: number;
};

export type ApprovalListResponse = {
  items: ApprovalListItemResponse[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export type ApproverDepartmentResponse = {
  id: string;
  name: string;
};

export type ApprovalItemResponse = {
  lineNumber: number;
  productName: string;
  modelNumber: string | null;
  productUrl: string | null;
  categoryId: string;
  categoryName: string;
  quantity: number;
  plannedUnitPrice: number;
  amount: number;
};

export type ApprovalDecisionResponse = {
  decision: "APPROVED" | "REJECTED";
  reason: string | null;
  decidedByName: string;
  requestVersion: number;
  decidedAt: string;
};

export type ApprovalDetailResponse = {
  requestId: string;
  requestNumber: string;
  status: RequestStatus;
  title: string;
  reason: string;
  desiredDeliveryDate: string;
  requestedSupplierId: string;
  requestedSupplierName: string;
  note: string | null;
  applicantId: string;
  applicantName: string;
  departmentId: string;
  departmentName: string;
  items: ApprovalItemResponse[];
  totalAmount: number;
  version: number;
  submittedAt: string;
  createdAt: string;
  updatedAt: string;
  decision: ApprovalDecisionResponse | null;
};

export type ApprovalActionResponse = {
  requestId: string;
  status: "APPROVED" | "REJECTED";
  version: number;
  decidedAt: string;
};
