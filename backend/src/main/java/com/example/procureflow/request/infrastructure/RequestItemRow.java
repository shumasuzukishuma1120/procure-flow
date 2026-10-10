package com.example.procureflow.request.infrastructure;

import java.time.Instant;
import java.util.UUID;

public record RequestItemRow(
        UUID id,
        UUID requestId,
        int lineNumber,
        String productName,
        String modelNumber,
        String productUrl,
        UUID categoryId,
        Integer quantity,
        Long plannedUnitPrice,
        Instant createdAt,
        Instant updatedAt
) {
}
