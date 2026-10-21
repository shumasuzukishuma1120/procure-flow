package com.example.procureflow.approval.presentation.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public record ApproveRequest(
        @NotNull(message = "versionを指定してください。")
        @PositiveOrZero(message = "versionは0以上で指定してください。")
        Long version
) {
}
