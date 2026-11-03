package com.example.procureflow.security.presentation;

import java.util.List;
import java.util.UUID;

public record CurrentUserResponse(
        UUID id,
        String employeeNumber,
        String name,
        DepartmentResponse department,
        List<String> roles
) {
    public record DepartmentResponse(
            UUID id,
            String name
    ) {
    }
}
