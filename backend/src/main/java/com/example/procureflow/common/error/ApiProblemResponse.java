package com.example.procureflow.common.error;

import java.util.List;

public record ApiProblemResponse(
        String type,
        String title,
        int status,
        String detail,
        String code,
        String traceId,
        List<ApiFieldError> fieldErrors
) {
}
