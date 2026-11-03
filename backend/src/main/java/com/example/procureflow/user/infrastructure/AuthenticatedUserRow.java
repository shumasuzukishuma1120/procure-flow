package com.example.procureflow.user.infrastructure;

import java.util.UUID;

public record AuthenticatedUserRow(
        UUID id,
        UUID departmentId,
        String employeeNumber,
        String displayName,
        String departmentName
) {
}
