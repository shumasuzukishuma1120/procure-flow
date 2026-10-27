package com.example.procureflow.purchase.presentation.dto;

import com.example.procureflow.request.domain.RequestStatus;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public record PurchaseListItemResponse(
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
        boolean overdue,
        long version
) {
}
