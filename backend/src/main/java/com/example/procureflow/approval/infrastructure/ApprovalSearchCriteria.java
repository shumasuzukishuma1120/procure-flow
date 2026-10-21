package com.example.procureflow.approval.infrastructure;

import com.example.procureflow.approval.application.ApprovalSort;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public record ApprovalSearchCriteria(
        UUID approverId,
        String keyword,
        Instant submittedFrom,
        Instant submittedToExclusive,
        UUID departmentId,
        LocalDate desiredDeliveryDateBefore,
        ApprovalSort sort,
        int limit,
        long offset
) {
}
