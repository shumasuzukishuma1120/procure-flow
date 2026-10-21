package com.example.procureflow.approval.presentation.dto;

import com.example.procureflow.request.domain.RequestStatus;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public record ApprovalListItemResponse(
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
        boolean overdue,
        Instant submittedAt,
        long version
) {
}
