package com.example.procureflow.approval.presentation.dto;

import java.util.UUID;

public record ApproverDepartmentResponse(
        UUID id,
        String name
) {
}
