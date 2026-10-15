package com.example.procureflow.request.infrastructure;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public record DraftRequestUpdateRow(
        UUID id,
        UUID applicantId,
        UUID requestedSupplierId,
        String title,
        String reason,
        LocalDate desiredDeliveryDate,
        String note,
        long expectedVersion,
        Instant updatedAt
) {
}
