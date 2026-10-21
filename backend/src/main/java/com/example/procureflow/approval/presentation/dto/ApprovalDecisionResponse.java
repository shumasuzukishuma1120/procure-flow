package com.example.procureflow.approval.presentation.dto;

import java.time.Instant;

public record ApprovalDecisionResponse(
        String decision,
        String reason,
        String decidedByName,
        long requestVersion,
        Instant decidedAt
) {
}
