export const PURCHASE_LIST_PAGE_SIZES = [20, 50, 100] as const;
export type PurchaseListPageSize = (typeof PURCHASE_LIST_PAGE_SIZES)[number];

export const PURCHASE_SORTS = [
  "DELIVERY_DATE_ASC",
  "APPROVED_AT_ASC",
  "APPROVED_AT_DESC",
  "AMOUNT_DESC",
] as const;
export type PurchaseSort = (typeof PURCHASE_SORTS)[number];

export const PURCHASE_STATUSES = ["APPROVED", "ORDERED", "COMPLETED"] as const;

export type PurchaseListStatus = (typeof PURCHASE_STATUSES)[number];

export type PurchaseListQuery = {
  page: number;
  size: PurchaseListPageSize;
  sort: PurchaseSort;
  status?: PurchaseListStatus;
  keyword?: string;
  departmentId?: string;
  supplierId?: string;
  approvedFrom?: string;
  approvedTo?: string;
};

export type PurchaseListItemResponse = {
  requestId: string;
  requestNumber: string;
  title: string;
  status: PurchaseListStatus;
  applicantName: string;
  departmentId: string;
  departmentName: string;
  itemSummary: string;
  additionalItemCount: number;
  supplierId: string;
  supplierName: string;
  totalAmount: number;
  approvedAt: string;
  desiredDeliveryDate: string;
  overdue: boolean;
  version: number;
};

export type PurchaseListResponse = {
  items: PurchaseListItemResponse[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export type PurchaseDepartmentResponse = {
  id: string;
  name: string;
};

export type PurchaseItemResponse = {
  requestItemId: string;
  lineNumber: number;
  productName: string;
  modelNumber: string | null;
  productUrl: string | null;
  categoryId: string;
  categoryName: string;
  quantity: number;
  plannedUnitPrice: number;
  actualUnitPrice: number | null;
  plannedAmount: number;
  actualAmount: number | null;
};

export type PurchaseDetailResponse = {
  requestId: string;
  requestNumber: string;
  status: PurchaseListStatus;
  title: string;
  reason: string;
  desiredDeliveryDate: string;
  note: string | null;
  applicantId: string;
  applicantName: string;
  departmentId: string;
  departmentName: string;
  requestedSupplierId: string;
  requestedSupplierName: string;
  items: PurchaseItemResponse[];
  approvedTotalAmount: number;
  actualTotalAmount: number | null;
  approvedAt: string;
  purchaseOrderId: string | null;
  actualSupplierId: string | null;
  actualSupplierName: string | null;
  purchaseOrderNumber: string | null;
  promisedDeliveryDate: string | null;
  purchaserNote: string | null;
  orderedByName: string | null;
  orderedAt: string | null;
  receivedDate: string | null;
  receiptNote: string | null;
  receivedByName: string | null;
  completedAt: string | null;
  version: number;
};

export type CreatePurchaseOrderRequest = {
  version: number;
  actualSupplierId: string;
  purchaseOrderNumber: string;
  promisedDeliveryDate: string;
  purchaserNote: string | null;
  items: Array<{ requestItemId: string; actualUnitPrice: number }>;
};

export type CompleteReceiptRequest = {
  version: number;
  receivedDate: string;
  receiptNote: string | null;
  allItemsReceived: boolean;
};

export type PurchaseActionResponse = {
  requestId: string;
  status: "ORDERED" | "COMPLETED";
  version: number;
  processedAt: string;
};
