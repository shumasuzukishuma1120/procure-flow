package com.example.procureflow.approval.infrastructure;

import com.example.procureflow.request.domain.RequestStatus;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public record ApprovalListItemRow(
        UUID requestId,
        String requestNumber,
        String title,
        RequestStatus status,
        String applicantName,
        UUID departmentId,
        String departmentName,
        String requestedSupplierName,
        long totalAmount,
        LocalDate desiredDeliveryDate,
        Instant submittedAt,
        long version
) {
}
