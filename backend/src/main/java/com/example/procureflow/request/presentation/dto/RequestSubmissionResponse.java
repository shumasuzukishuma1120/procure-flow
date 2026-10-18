package com.example.procureflow.request.presentation.dto;

import java.time.Instant;
import java.util.UUID;

public record RequestSubmissionResponse(
        UUID requestId,
        String requestNumber,
        String status,
        long version,
        Instant submittedAt
) {
}
