package com.example.procureflow.request.presentation.dto;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record DraftRequestResponse(
        UUID requestId,
        String requestNumber,
        String status,
        String title,
        String reason,
        LocalDate desiredDeliveryDate,
        UUID requestedSupplierId,
        String note,
        List<CreateDraftRequestItem> items,
        long totalAmount,
        long version,
        Instant createdAt,
        Instant updatedAt
) {
}
