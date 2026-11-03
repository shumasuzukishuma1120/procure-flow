package com.example.procureflow.request.infrastructure;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public record SubmittedRequestCreationRow(
        UUID id,
        UUID applicantId,
        UUID createdBy,
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
        long version,
        Instant submittedAt
) {
}
