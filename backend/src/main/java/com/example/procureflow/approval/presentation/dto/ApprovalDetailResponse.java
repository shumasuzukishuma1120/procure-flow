package com.example.procureflow.approval.presentation.dto;

import com.example.procureflow.request.domain.RequestStatus;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record ApprovalDetailResponse(
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
        List<ApprovalItemResponse> items,
        long totalAmount,
        long version,
        Instant submittedAt,
        Instant createdAt,
        Instant updatedAt,
        ApprovalDecisionResponse decision
) {
    public ApprovalDetailResponse {
        items = List.copyOf(items);
    }
}
