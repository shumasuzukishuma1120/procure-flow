package com.example.procureflow.purchase.infrastructure;

import com.example.procureflow.request.domain.RequestStatus;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public record PurchaseListItemRow(
        UUID requestId,
        String requestNumber,
        String title,
        RequestStatus status,
        String applicantName,
        UUID departmentId,
        String departmentName,
        String itemSummary,
        int additionalItemCount,
        UUID supplierId,
        String supplierName,
        long totalAmount,
        Instant approvedAt,
        LocalDate desiredDeliveryDate,
        long version
) {
}
