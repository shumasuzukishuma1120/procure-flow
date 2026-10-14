package com.example.procureflow.request.presentation.dto;

import java.time.Instant;
import java.util.UUID;

public record CancelRequestResponse(
        UUID requestId,
        String status,
        long version,
        Instant canceledAt
) {
}
