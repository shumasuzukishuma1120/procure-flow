package com.example.procureflow.request.infrastructure;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public record SubmitDraftUpdateRow(
        UUID id,
        UUID applicantId,
        UUID submittedBy,
        UUID departmentId,
        String departmentNameSnapshot,
        UUID requestedSupplierId,
        String requestedSupplierNameSnapshot,
        String requestNumber,
        String title,
        String reason,
        LocalDate desiredDeliveryDate,
        String note,
        long expectedVersion,
        Instant submittedAt
) {
}
