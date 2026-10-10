package com.example.procureflow.security;

import java.util.UUID;

public record CurrentUser(
        UUID id,
        UUID departmentId
) {
}
