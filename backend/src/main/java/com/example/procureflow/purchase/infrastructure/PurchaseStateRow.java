package com.example.procureflow.purchase.infrastructure;

import com.example.procureflow.request.domain.RequestStatus;

import java.time.Instant;
import java.util.UUID;

public record PurchaseStateRow(
        RequestStatus status,
        long version,
        UUID purchaseOrderId,
        Instant orderedAt
) {
}
