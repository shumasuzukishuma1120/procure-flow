package com.example.procureflow.request.infrastructure;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public record RequestDetailRow(
        UUID requestId,
        String requestNumber,
        String status,
        String title,
        String reason,
        LocalDate desiredDeliveryDate,
        UUID requestedSupplierId,
        String note,
        long version,
        Instant createdAt,
        Instant updatedAt
) {
}
