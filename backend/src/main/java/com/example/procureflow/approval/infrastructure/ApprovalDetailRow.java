package com.example.procureflow.approval.infrastructure;

import com.example.procureflow.request.domain.RequestStatus;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public record ApprovalDetailRow(
        UUID requestId,
        String requestNumber,
        RequestStatus status,
        String title,
        String reason,
        LocalDate desiredDeliveryDate,
        UUID requestedSupplierId,
        String requestedSupplierName,
        String note,
        UUID applicantId,
        String applicantName,
        UUID departmentId,
        String departmentName,
        long version,
        Instant submittedAt,
        Instant createdAt,
        Instant updatedAt,
        String decision,
        String decisionReason,
        String decidedByName,
        Long decisionRequestVersion,
        Instant decidedAt
) {
}
