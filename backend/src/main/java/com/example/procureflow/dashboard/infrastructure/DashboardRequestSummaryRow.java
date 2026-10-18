package com.example.procureflow.dashboard.infrastructure;

import com.example.procureflow.request.domain.RequestStatus;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public record DashboardRequestSummaryRow(
        UUID requestId,
        String requestNumber,
        String title,
        RequestStatus status,
        String applicantName,
        String departmentName,
        LocalDate desiredDeliveryDate,
        long totalAmount,
        Instant updatedAt
) {
}
