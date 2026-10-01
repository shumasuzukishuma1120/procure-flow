export const REQUEST_STATUSES = [
  "DRAFT",
  "SUBMITTED",
  "CANCELED",
  "REJECTED",
  "APPROVED",
  "ORDERED",
  "COMPLETED",
  "REAPPLICATION_REQUIRED",
] as const;

export type RequestStatus = (typeof REQUEST_STATUSES)[number];

export type MyRequestListItemResponse = {
  requestId: string;
  requestNumber: string | null;
  title: string | null;
  status: RequestStatus;
  firstItemName: string | null;
  additionalItemCount: number;
  requestedSupplierName: string | null;
  totalAmount: number;
  updatedAt: string;
  version: number;
};

export type MyRequestListResponse = {
  items: MyRequestListItemResponse[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};
