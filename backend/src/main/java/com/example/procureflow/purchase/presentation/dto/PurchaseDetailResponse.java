package com.example.procureflow.purchase.presentation.dto;

import com.example.procureflow.request.domain.RequestStatus;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record PurchaseDetailResponse(
        UUID requestId,
        String requestNumber,
        RequestStatus status,
        String title,
        String reason,
        LocalDate desiredDeliveryDate,
        String note,
        UUID applicantId,
        String applicantName,
        UUID departmentId,
        String departmentName,
        UUID requestedSupplierId,
        String requestedSupplierName,
        List<PurchaseItemResponse> items,
        long approvedTotalAmount,
        Long actualTotalAmount,
        Instant approvedAt,
        UUID purchaseOrderId,
        UUID actualSupplierId,
        String actualSupplierName,
        String purchaseOrderNumber,
        LocalDate promisedDeliveryDate,
        String purchaserNote,
        String orderedByName,
        Instant orderedAt,
        LocalDate receivedDate,
        String receiptNote,
        String receivedByName,
        Instant completedAt,
        long version
) {
}
