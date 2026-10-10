package com.example.procureflow.request.infrastructure;

import com.example.procureflow.request.domain.RequestStatus;

import java.time.Instant;
import java.util.UUID;

public record MyRequestListItemRow(
        UUID requestId,
        String requestNumber,
        String title,
        RequestStatus status,
        String firstItemName,
        int additionalItemCount,
        String requestedSupplierName,
        long totalAmount,
        Instant updatedAt,
        long version
) {
}
