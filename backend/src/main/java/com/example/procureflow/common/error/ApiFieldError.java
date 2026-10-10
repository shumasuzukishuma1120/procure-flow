package com.example.procureflow.common.error;

public record ApiFieldError(
        String field,
        String code,
        String message
) {
}
