package com.example.procureflow.request.presentation.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

public record CancelRequestRequest(
        @NotNull(message = "versionを指定してください。")
        @PositiveOrZero(message = "versionは0以上で指定してください。")
        Long version,

        @NotBlank(message = "取消理由を入力してください。")
        @Size(max = 500, message = "取消理由は500文字以内で入力してください。")
        String reason
) {
}
