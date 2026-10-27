package com.example.procureflow.purchase.presentation.dto;

import com.example.procureflow.request.domain.RequestStatus;

import java.time.Instant;
import java.util.UUID;

public record PurchaseActionResponse(
        UUID requestId,
        RequestStatus status,
        long version,
        Instant processedAt
) {
}
