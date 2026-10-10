package com.example.procureflow.request.infrastructure;

public record IdempotencyRecord(
        String requestHash,
        String processingStatus,
        Integer responseStatus,
        String responseBody
) {
}
