package com.example.procureflow.purchase.infrastructure;

import com.example.procureflow.request.domain.RequestStatus;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public record PurchaseDetailRow(
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
