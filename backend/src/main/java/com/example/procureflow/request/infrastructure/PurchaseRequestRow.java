package com.example.procureflow.request.infrastructure;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public record PurchaseRequestRow(
        UUID id,
        UUID applicantId,
        UUID createdBy,
        UUID departmentId,
        UUID requestedSupplierId,
        String title,
        String reason,
        LocalDate desiredDeliveryDate,
        String note,
        String status,
        long version,
        Instant createdAt,
        Instant updatedAt
) {
}
